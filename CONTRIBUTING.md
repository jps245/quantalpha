# Contributing to QuantAlpha

Thank you for your interest in contributing to QuantAlpha! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- Poetry (for Python dependency management)
- Git

### Setup Development Environment

1. **Fork and clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/quantalpha.git
   cd quantalpha
   \`\`\`

2. **Install dependencies:**
   \`\`\`bash
   make setup
   # or manually:
   npm install
   poetry install
   \`\`\`

3. **Set up environment:**
   \`\`\`bash
   cp .env.example .env
   # Add your GROQ_API_KEY to .env
   \`\`\`

4. **Test your setup:**
   \`\`\`bash
   make test
   \`\`\`

## 📝 Development Guidelines

### Code Style

**Python:**
- Use [Black](https://black.readthedocs.io/) for formatting: \`poetry run black scripts/\`
- Follow [PEP 8](https://pep8.org/) style guidelines
- Use type hints where possible
- Run \`poetry run mypy scripts/\` for type checking

**TypeScript/JavaScript:**
- Use Prettier for formatting
- Follow ESLint rules: \`npm run lint\`
- Use TypeScript for type safety

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

\`\`\`
feat: add portfolio optimization algorithm
fix: resolve Groq API connection timeout
docs: update installation instructions
test: add unit tests for risk profiler
\`\`\`

### Branch Naming
- \`feature/description\` - New features
- \`fix/description\` - Bug fixes
- \`docs/description\` - Documentation updates
- \`test/description\` - Test additions/updates

## 🧪 Testing

### Python Tests
\`\`\`bash
poetry run pytest
poetry run python scripts/test_groq_connection.py
\`\`\`

### TypeScript/Next.js Tests
\`\`\`bash
npm test
npm run lint
\`\`\`

### Integration Tests
\`\`\`bash
make test
\`\`\`

## 📊 Project Structure

\`\`\`
quantalpha/
├── app/                    # Next.js app directory
├── components/             # React components
├── scripts/               # Python portfolio analysis
├── public/                # Static assets
├── .env.example          # Environment template
├── pyproject.toml        # Python dependencies
├── package.json          # Node.js dependencies
└── Makefile             # Development commands
\`\`\`

## 🔄 Pull Request Process

1. **Create a feature branch:**
   \`\`\`bash
   git checkout -b feature/your-feature-name
   \`\`\`

2. **Make your changes:**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes:**
   \`\`\`bash
   make test
   poetry run black scripts/
   npm run lint
   \`\`\`

4. **Commit and push:**
   \`\`\`bash
   git add .
   git commit -m "feat: your descriptive commit message"
   git push origin feature/your-feature-name
   \`\`\`

5. **Create Pull Request:**
   - Use the PR template
   - Link any related issues
   - Provide clear description of changes

## 🐛 Bug Reports

When reporting bugs, please include:
- **Environment:** OS, Python version, Node.js version
- **Steps to reproduce:** Clear, numbered steps
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Error messages:** Full error output
- **Screenshots:** If applicable

## 💡 Feature Requests

For new features, please:
- Check existing issues first
- Provide clear use case
- Describe expected behavior
- Consider implementation complexity
- Discuss with maintainers before large changes

## 📚 Documentation

- Update README.md for user-facing changes
- Add docstrings to Python functions
- Comment complex algorithms
- Update API documentation
- Include examples for new features

## 🏷️ Release Process

1. Update version in \`pyproject.toml\` and \`package.json\`
2. Update CHANGELOG.md
3. Create release PR
4. Tag release after merge
5. Deploy to production

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines
- Report inappropriate behavior

## 📞 Getting Help

- **Issues:** GitHub Issues for bugs and features
- **Discussions:** GitHub Discussions for questions
- **Documentation:** Check README.md and code comments
- **Contact:** Reach out to maintainers

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to QuantAlpha! 🚀
