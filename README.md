# MIOS Map

**M**ulti-**I**ntegrated **O**perations **S**ystem Map - An interactive 3D visualization platform for mapping and understanding your entire project ecosystem.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://workers.cloudflare.com/)

🔗 **[Live Demo](https://c84a4c00.mios-map.pages.dev/landing.html)** | 📖 **[Documentation](#deployment)**

## Overview

MIOS Map automatically scans your GitHub repositories and creates an interactive 3D visualization showing:
- Projects and their relationships
- Tech stack (languages, frameworks, APIs, databases)
- Shared dependencies and connections
- Multiple layout views (Force, Tree, Radial, 3D)

## Architecture

### Frontend
- **landing.html** - Marketing landing page with 3D preview
- **demo.html** - Public demo with sample data
- **index.html** - Template for user's private map (not in repo)

Note: The actual index.html file is not included in the repository as it contains personal project data. Users generate their own version by connecting their GitHub account.

### Backend
- **worker.js** - Cloudflare Worker handling:
  - GitHub App OAuth flow
  - Repository scanning
  - Tech stack detection
  - MIOS data generation

### Data
- **demo-data.json** - Sample data for demo
- **generate-demo-data.js** - Demo data generator

## Deployment

### Prerequisites
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- GitHub App credentials

### Setup

1. **Configure GitHub App**
   - Create GitHub App at https://github.com/settings/apps/new
   - Set permissions: Repository Contents (Read), Metadata (Read)
   - Note Client ID and generate Client Secret

2. **Set Cloudflare Secrets**
   ```bash
   wrangler secret put GITHUB_CLIENT_ID
   wrangler secret put GITHUB_CLIENT_SECRET
   ```

3. **Deploy Worker**
   ```bash
   wrangler deploy worker.js
   ```

4. **Deploy Pages**
   ```bash
   wrangler pages deploy . --project-name=mios-map
   ```

## Development

### Local Testing
```bash
wrangler dev worker.js
```

### Update Demo Data
```bash
node generate-demo-data.js
```

## Tech Stack

- **Frontend**: Vanilla JS, Three.js (r128), D3.js
- **Backend**: Cloudflare Workers
- **Hosting**: Cloudflare Pages
- **Auth**: GitHub App OAuth

## Security

- Read-only access to repositories
- No code execution or modifications
- Minimal GitHub permissions (Contents + Metadata)
- No data storage (stateless)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use clear, descriptive variable names
- Add JSDoc comments for functions
- Follow existing code patterns
- Test changes locally before submitting

## Roadmap

- [ ] Dependency vulnerability scanning
- [ ] Team collaboration features
- [ ] CI/CD pipeline integration
- [ ] Advanced analytics dashboard
- [ ] Export to multiple formats (SVG, PNG, JSON)

## Support

If you find MIOS Map helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs via Issues
- 💡 Suggesting features
- 📖 Improving documentation

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

Built with:
- [Three.js](https://threejs.org/) - 3D visualization
- [D3.js](https://d3js.org/) - Data visualization
- [Cloudflare Workers](https://workers.cloudflare.com/) - Serverless backend

---

Made with ❤️ by [Simeon Garratt](https://github.com/simeong)
