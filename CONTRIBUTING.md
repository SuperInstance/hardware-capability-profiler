# Contributing to Hardware Capability Profiler

Thank you for your interest in contributing to Hardware Capability Profiler! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment (browser, OS, device)
   - Screenshots if applicable

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear feature description
   - Use cases and benefits
   - Potential implementation approach
   - Examples if applicable

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Update documentation if needed
6. Ensure all tests pass (`npm test`)
7. Ensure TypeScript compiles (`npm run type-check`)
8. Commit your changes (`git commit -m 'Add amazing feature'`)
9. Push to the branch (`git push origin feature/amazing-feature`)
10. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm
- TypeScript 5.3+
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/hardware-capability-profiler.git

# Navigate to the directory
cd hardware-capability-profiler

# Install dependencies
npm install
```

### Development Workflow

```bash
# Watch mode for development
npm run test:watch

# Type checking
npm run type-check

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- All code must be fully typed
- No `any` types unless absolutely necessary
- Use interfaces for public API
- Use type aliases for internal types

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Use semicolons
- Max line length: 100 characters
- Follow existing code style

### Naming Conventions

- **Files**: kebab-case (`hardware-detector.ts`)
- **Classes**: PascalCase (`HardwareDetector`)
- **Functions/Methods**: camelCase (`getHardwareInfo`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_SCORE`)
- **Interfaces**: PascalCase (`HardwareProfile`)
- **Types**: PascalCase (`PerformanceClass`)

### Documentation

- Document all public APIs
- Use JSDoc comments
- Include examples in documentation
- Update README for user-facing changes
- Update ARCHITECTURE.md for structural changes
- Update API.md for API changes

### Testing

- Write tests for all new functionality
- Maintain test coverage above 80%
- Test edge cases and error conditions
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Example Test

```typescript
describe('HardwareDetector', () => {
  it('should detect CPU information', async () => {
    // Arrange
    const detector = new HardwareDetector();

    // Act
    const result = await detector.getHardwareInfo();

    // Assert
    expect(result.success).toBe(true);
    expect(result.profile?.cpu.cores).toBeGreaterThan(0);
  });
});
```

## Project Structure

```
hardware-capability-profiler/
├── src/              # Source code
├── tests/            # Test files
├── examples/         # Usage examples
├── docs/             # Documentation
├── README.md         # Main documentation
├── CONTRIBUTING.md   # This file
└── package.json      # Package configuration
```

## Commit Messages

Follow conventional commit format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or tooling changes

**Examples:**

```
feat(detection): add WebGPU multi-adapter support

Implement support for detecting multiple GPU adapters
in systems with more than one GPU.

Closes #123
```

```
fix(scoring): correct JEPA score calculation for Apple Silicon

Fix scoring algorithm to properly account for unified memory
in Apple Silicon chips.

Fixes #456
```

## Pull Request Guidelines

### Title

Use conventional commit format:

```
feat: add WebGPU multi-adapter support
fix: correct JEPA scoring for Apple Silicon
docs: update API documentation
```

### Description

Include:
- Summary of changes
- Motivation for the change
- Related issues
- Breaking changes (if any)
- Screenshots (if applicable)

### Review Process

1. Automated checks must pass
2. At least one maintainer approval
3. All feedback addressed
4. No merge conflicts

## Release Process

Releases are managed by maintainers:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm
5. Create GitHub release

## Community Guidelines

### Support Questions

- Use GitHub Issues for bugs and feature requests
- Use Discussions for questions and ideas
- Be patient and respectful

### Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in significant features

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Getting Help

- GitHub Issues: Bug reports and feature requests
- GitHub Discussions: Questions and ideas
- Email: support@superinstance.dev

## Thank You

Thank you for contributing to Hardware Capability Profiler! Your contributions make this project better for everyone.
