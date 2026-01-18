/**
 * MIOS Map - Cloudflare Worker
 * 
 * Handles GitHub App OAuth authentication and repository scanning
 * for generating MIOS (Multi-Integrated Operations System) map data.
 * 
 * @module mios-worker
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS for CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Route: Initiate GitHub OAuth (using GitHub App with minimal permissions)
    if (url.pathname === '/api/auth/github') {
      // GitHub App permissions are configured in app settings (Contents: Read-only, Metadata: Read-only)
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/api/auth/callback`
      });
      
      return Response.redirect(`https://github.com/login/oauth/authorize?${params}`, 302);
    }

    // Route: GitHub OAuth Callback
    if (url.pathname === '/api/auth/callback') {
      const code = url.searchParams.get('code');
      
      if (!code) {
        return Response.redirect(`${url.origin}/?error=no_code`, 302);
      }

      try {
        // Exchange code for token
        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code
          })
        });

        const tokenData = await tokenResponse.json();
        
        if (tokenData.error || !tokenData.access_token) {
          return Response.redirect(`${url.origin}/?error=auth_failed`, 302);
        }

        // Redirect to map with token in URL (temporary - will be replaced with better storage)
        return Response.redirect(`${url.origin}/index-v2.html?token=${tokenData.access_token}`, 302);
      } catch (error) {
        return Response.redirect(`${url.origin}/?error=server_error`, 302);
      }
    }

    // Route: Scan GitHub repos
    if (url.pathname === '/api/scan' && request.method === 'POST') {
      try {
        const body = await request.json();
        const token = body.token;
        
        if (!token) {
          return new Response(JSON.stringify({ error: 'No token provided' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Fetch repos
        const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'MIOS-Map'
          }
        });

        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repos');
        }

        const repos = await reposResponse.json();
        
        // Scan repos in parallel
        const scanPromises = repos.map(repo => scanRepo(repo, token));
        const scannedProjects = await Promise.all(scanPromises);
        
        // Generate MIOS data
        const miosData = generateMIOSData(scannedProjects);
        
        return new Response(JSON.stringify(miosData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Default: return 404
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};

/**
 * Scans a single GitHub repository to extract tech stack information
 * 
 * @param {Object} repo - GitHub repository object
 * @param {string} token - GitHub access token
 * @returns {Promise<Object>} Scanned project data with tech stack details
 */
async function scanRepo(repo, token) {
  const [owner, repoName] = repo.full_name.split('/');
  
  // Fetch repo languages
  const languagesResponse = await fetch(`https://api.github.com/repos/${owner}/${repoName}/languages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MIOS-Map'
    }
  });
  
  const languages = languagesResponse.ok ? Object.keys(await languagesResponse.json()) : [];
  
  // Fetch key files
  const files = await fetchFiles(owner, repoName, token, [
    'package.json',
    'requirements.txt',
    '.env.example'
  ]);
  
  return {
    id: repo.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    name: repo.name,
    description: repo.description || '',
    url: repo.html_url,
    languages: languages.map(l => l.toLowerCase()),
    frameworks: detectFrameworks(files),
    apis: detectAPIs(files),
    databases: detectDatabases(files),
    stars: repo.stargazers_count
  };
}

/**
 * Fetches multiple files from a repository
 * 
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} token - GitHub access token
 * @param {string[]} paths - Array of file paths to fetch
 * @returns {Promise<Object>} Object mapping file paths to their contents
 */
async function fetchFiles(owner, repo, token, paths) {
  const filePromises = paths.map(async (path) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'MIOS-Map'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.content) {
          return [path, atob(data.content)];
        }
      }
    } catch (e) {}
    return [path, null];
  });
  
  const results = await Promise.all(filePromises);
  return Object.fromEntries(results);
}

/**
 * Detects frameworks from package.json and requirements.txt
 * 
 * @param {Object} files - Object mapping file paths to contents
 * @returns {string[]} Array of detected framework names
 */
function detectFrameworks(files) {
  const frameworks = new Set();
  
  if (files['package.json']) {
    try {
      const pkg = JSON.parse(files['package.json']);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps.next) frameworks.add('nextjs');
      if (deps.react) frameworks.add('react');
      if (deps.vue) frameworks.add('vue');
      if (deps.tailwindcss) frameworks.add('tailwind');
      if (deps.d3) frameworks.add('d3js');
    } catch (e) {}
  }
  
  if (files['requirements.txt']) {
    const reqs = files['requirements.txt'].toLowerCase();
    if (reqs.includes('fastapi')) frameworks.add('fastapi');
    if (reqs.includes('flask')) frameworks.add('flask');
    if (reqs.includes('django')) frameworks.add('django');
  }
  
  return Array.from(frameworks);
}

/**
 * Detects API integrations from dependencies and environment files
 * 
 * @param {Object} files - Object mapping file paths to contents
 * @returns {string[]} Array of detected API names
 */
function detectAPIs(files) {
  const apis = new Set();
  
  if (files['package.json']) {
    try {
      const pkg = JSON.parse(files['package.json']);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps['@supabase/supabase-js']) apis.add('supabase-api');
      if (deps.stripe) apis.add('stripe-api');
    } catch (e) {}
  }
  
  if (files['requirements.txt']) {
    const reqs = files['requirements.txt'].toLowerCase();
    if (reqs.includes('openai')) apis.add('openai-api');
    if (reqs.includes('anthropic')) apis.add('claude-api');
  }
  
  if (files['.env.example']) {
    const env = files['.env.example'].toUpperCase();
    if (env.includes('OPENAI')) apis.add('openai-api');
    if (env.includes('ANTHROPIC')) apis.add('claude-api');
    if (env.includes('SUPABASE')) apis.add('supabase-api');
    if (env.includes('STRIPE')) apis.add('stripe-api');
  }
  
  return Array.from(apis);
}

/**
 * Detects database usage from dependencies
 * 
 * @param {Object} files - Object mapping file paths to contents
 * @returns {string[]} Array of detected database names
 */
function detectDatabases(files) {
  const databases = new Set();
  
  if (files['package.json']) {
    try {
      const pkg = JSON.parse(files['package.json']);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      
      if (deps.pg || deps.postgres) databases.add('postgresql');
      if (deps.redis) databases.add('redis');
      if (deps.mongodb) databases.add('mongodb');
    } catch (e) {}
  }
  
  if (files['requirements.txt']) {
    const reqs = files['requirements.txt'].toLowerCase();
    if (reqs.includes('psycopg')) databases.add('postgresql');
    if (reqs.includes('redis')) databases.add('redis');
  }
  
  return Array.from(databases);
}

/**
 * Generates MIOS map data structure from scanned projects
 * 
 * Creates nodes for projects, languages, frameworks, APIs, and databases,
 * and generates links based on shared technologies.
 * 
 * @param {Object[]} projects - Array of scanned project objects
 * @returns {Object} MIOS data with nodes and links arrays
 */
function generateMIOSData(projects) {
  const nodes = [];
  const links = [];
  
  // Add project nodes
  projects.forEach(project => {
    nodes.push({
      id: project.id,
      name: project.name,
      type: 'platform',
      category: 'GitHub Project',
      description: project.description
    });
    
    // Add tech stack nodes
    project.languages.forEach(lang => {
      if (!nodes.find(n => n.id === lang)) {
        nodes.push({
          id: lang,
          name: lang.charAt(0).toUpperCase() + lang.slice(1),
          type: 'language'
        });
      }
      links.push({ source: project.id, target: lang, type: 'uses' });
    });
    
    project.frameworks.forEach(fw => {
      if (!nodes.find(n => n.id === fw)) {
        nodes.push({
          id: fw,
          name: fw.charAt(0).toUpperCase() + fw.slice(1),
          type: 'framework'
        });
      }
      links.push({ source: project.id, target: fw, type: 'uses' });
    });
    
    project.apis.forEach(api => {
      if (!nodes.find(n => n.id === api)) {
        nodes.push({
          id: api,
          name: api.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          type: 'api'
        });
      }
      links.push({ source: project.id, target: api, type: 'integrates' });
    });
    
    project.databases.forEach(db => {
      if (!nodes.find(n => n.id === db)) {
        nodes.push({
          id: db,
          name: db.charAt(0).toUpperCase() + db.slice(1),
          type: 'database'
        });
      }
      links.push({ source: project.id, target: db, type: 'stores' });
    });
  });
  
  // Add project-to-project connections (shared tech)
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const p1 = projects[i];
      const p2 = projects[j];
      
      const sharedTech = [
        ...p1.frameworks.filter(f => p2.frameworks.includes(f)),
        ...p1.languages.filter(l => p2.languages.includes(l))
      ];
      
      if (sharedTech.length >= 2) {
        links.push({
          source: p1.id,
          target: p2.id,
          type: 'related'
        });
      }
    }
  }
  
  return { nodes, links };
}
