# Contributing to MIOS Map

Thank you for considering contributing to MIOS Map! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/environment details

### Suggesting Features

1. Check existing issues for similar suggestions
2. Create a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Potential implementation approach (optional)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mios-map.git
   cd mios-map
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Add JSDoc comments for new functions
   - Follow existing code style
   - Test thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Commit message format:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide clear description of changes
   - Reference any related issues
   - Explain why the change is needed

## Development Setup

1. **Prerequisites**
   - Node.js 16+
   - Wrangler CLI
   - GitHub App credentials

2. **Local Development**
   ```bash
   # Install dependencies
   npm install

   # Start local worker
   wrangler dev worker.js

   # Test locally
   # Open index.html in browser
   ```

3. **Testing**
   - Test with demo data first
   - Verify 3D visualizations render correctly
   - Check GitHub OAuth flow
   - Test across different browsers

## Code Style Guidelines

### JavaScript
- Use `const` and `let`, avoid `var`
- Use template literals for strings
- Add JSDoc comments for functions
- Keep functions small and focused
- Use descriptive variable names

### HTML/CSS
- Use semantic HTML
- Keep CSS organized and commented
- Follow existing naming conventions
- Ensure responsive design

### Three.js
- Clean up geometries and materials
- Use appropriate detail levels
- Optimize for performance
- Add comments for complex scenes

## Areas That Need Help

- [ ] Additional framework detection (Rust, Go, etc.)
- [ ] Improved error handling
- [ ] Performance optimization for large repos
- [ ] Mobile responsiveness
- [ ] Accessibility improvements
- [ ] Unit tests
- [ ] Documentation improvements

## Questions?

Feel free to:
- Open an issue for discussion
- Tag @simeong in comments
- Ask in pull request discussions

Thank you for contributing! 🎉
