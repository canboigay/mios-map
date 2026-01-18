// Generate comprehensive demo data for MIOS map

const demoData = {
    nodes: [
        // Platforms
        { id: "ecommerce-platform", name: "E-Commerce Platform", type: "platform", category: "Production", description: "Main retail platform" },
        { id: "mobile-app", name: "Mobile App", type: "platform", category: "Production", description: "iOS and Android app" },
        { id: "admin-dashboard", name: "Admin Dashboard", type: "platform", category: "Internal", description: "Internal management tool" },
        { id: "analytics-engine", name: "Analytics Engine", type: "platform", category: "Production", description: "Real-time analytics" },
        { id: "payment-service", name: "Payment Service", type: "platform", category: "Production", description: "Payment processing" },
        { id: "user-portal", name: "User Portal", type: "platform", category: "Production", description: "Customer account management" },
        { id: "api-gateway", name: "API Gateway", type: "platform", category: "Infrastructure", description: "Central API gateway" },
        { id: "notification-service", name: "Notification Service", type: "platform", category: "Production", description: "Email and push notifications" },
        { id: "search-engine", name: "Search Engine", type: "platform", category: "Production", description: "Product search" },
        { id: "inventory-system", name: "Inventory System", type: "platform", category: "Production", description: "Stock management" },
        
        // Engines
        { id: "recommendation-engine", name: "Recommendation Engine", type: "engine", description: "ML-powered recommendations" },
        { id: "fraud-detection", name: "Fraud Detection", type: "engine", description: "Real-time fraud prevention" },
        { id: "image-processor", name: "Image Processor", type: "engine", description: "Product image optimization" },
        
        // Languages
        { id: "javascript", name: "JavaScript", type: "language" },
        { id: "typescript", name: "TypeScript", type: "language" },
        { id: "python", name: "Python", type: "language" },
        { id: "go", name: "Go", type: "language" },
        { id: "java", name: "Java", type: "language" },
        
        // Frameworks
        { id: "react", name: "React", type: "framework" },
        { id: "nextjs", name: "Next.js", type: "framework" },
        { id: "fastapi", name: "FastAPI", type: "framework" },
        { id: "django", name: "Django", type: "framework" },
        { id: "express", name: "Express", type: "framework" },
        { id: "tailwind", name: "Tailwind CSS", type: "framework" },
        
        // APIs
        { id: "stripe-api", name: "Stripe API", type: "api", description: "Payment processing" },
        { id: "sendgrid-api", name: "SendGrid API", type: "api", description: "Email delivery" },
        { id: "aws-s3", name: "AWS S3", type: "api", description: "File storage" },
        { id: "google-maps", name: "Google Maps API", type: "api", description: "Location services" },
        { id: "openai-api", name: "OpenAI API", type: "api", description: "AI features" },
        { id: "twilio", name: "Twilio API", type: "api", description: "SMS notifications" },
        
        // Databases
        { id: "postgresql", name: "PostgreSQL", type: "database" },
        { id: "redis", name: "Redis", type: "database" },
        { id: "mongodb", name: "MongoDB", type: "database" },
        { id: "elasticsearch", name: "Elasticsearch", type: "database" },
        
        // Opportunities
        { id: "enterprise-tier", name: "Enterprise Tier", type: "opportunity", revenue: "$500k ARR", description: "B2B enterprise package" },
        { id: "api-marketplace", name: "API Marketplace", type: "opportunity", revenue: "$200k ARR", description: "Developer API access" },
        { id: "white-label", name: "White Label Solution", type: "opportunity", revenue: "$300k ARR", description: "Customizable platform" },
    ],
    links: [
        // Platform connections
        { source: "ecommerce-platform", target: "react", type: "uses" },
        { source: "ecommerce-platform", target: "nextjs", type: "uses" },
        { source: "ecommerce-platform", target: "typescript", type: "uses" },
        { source: "ecommerce-platform", target: "tailwind", type: "uses" },
        { source: "ecommerce-platform", target: "postgresql", type: "uses" },
        { source: "ecommerce-platform", target: "redis", type: "uses" },
        { source: "ecommerce-platform", target: "stripe-api", type: "integrates" },
        { source: "ecommerce-platform", target: "recommendation-engine", type: "uses" },
        
        { source: "mobile-app", target: "react", type: "uses" },
        { source: "mobile-app", target: "typescript", type: "uses" },
        { source: "mobile-app", target: "api-gateway", type: "connects" },
        
        { source: "admin-dashboard", target: "react", type: "uses" },
        { source: "admin-dashboard", target: "typescript", type: "uses" },
        { source: "admin-dashboard", target: "postgresql", type: "uses" },
        
        { source: "analytics-engine", target: "python", type: "uses" },
        { source: "analytics-engine", target: "fastapi", type: "uses" },
        { source: "analytics-engine", target: "mongodb", type: "uses" },
        { source: "analytics-engine", target: "elasticsearch", type: "uses" },
        
        { source: "payment-service", target: "go", type: "uses" },
        { source: "payment-service", target: "postgresql", type: "uses" },
        { source: "payment-service", target: "stripe-api", type: "integrates" },
        { source: "payment-service", target: "fraud-detection", type: "uses" },
        
        { source: "user-portal", target: "nextjs", type: "uses" },
        { source: "user-portal", target: "typescript", type: "uses" },
        { source: "user-portal", target: "postgresql", type: "uses" },
        
        { source: "api-gateway", target: "go", type: "uses" },
        { source: "api-gateway", target: "redis", type: "uses" },
        
        { source: "notification-service", target: "python", type: "uses" },
        { source: "notification-service", target: "django", type: "uses" },
        { source: "notification-service", target: "sendgrid-api", type: "integrates" },
        { source: "notification-service", target: "twilio", type: "integrates" },
        { source: "notification-service", target: "redis", type: "uses" },
        
        { source: "search-engine", target: "python", type: "uses" },
        { source: "search-engine", target: "elasticsearch", type: "uses" },
        
        { source: "inventory-system", target: "java", type: "uses" },
        { source: "inventory-system", target: "postgresql", type: "uses" },
        
        // Engine connections
        { source: "recommendation-engine", target: "python", type: "uses" },
        { source: "recommendation-engine", target: "fastapi", type: "uses" },
        { source: "recommendation-engine", target: "openai-api", type: "integrates" },
        { source: "recommendation-engine", target: "postgresql", type: "uses" },
        
        { source: "fraud-detection", target: "python", type: "uses" },
        { source: "fraud-detection", target: "redis", type: "uses" },
        
        { source: "image-processor", target: "python", type: "uses" },
        { source: "image-processor", target: "aws-s3", type: "integrates" },
        
        // Project to project relationships
        { source: "ecommerce-platform", target: "payment-service", type: "depends" },
        { source: "ecommerce-platform", target: "search-engine", type: "depends" },
        { source: "ecommerce-platform", target: "notification-service", type: "depends" },
        { source: "mobile-app", target: "api-gateway", type: "depends" },
        { source: "admin-dashboard", target: "inventory-system", type: "depends" },
        { source: "user-portal", target: "payment-service", type: "depends" },
        
        // Opportunities
        { source: "enterprise-tier", target: "ecommerce-platform", type: "monetizes" },
        { source: "api-marketplace", target: "api-gateway", type: "monetizes" },
        { source: "white-label", target: "ecommerce-platform", type: "monetizes" },
    ]
};

console.log(JSON.stringify(demoData, null, 2));
