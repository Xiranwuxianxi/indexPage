# Contributing to Xiran Platform

Thank you for your interest in contributing! This document provides guidelines for participating in the project.

## How to Contribute

### Reporting Issues

- Check if the issue already exists before opening a new one.
- Provide a clear title and description.
- Include steps to reproduce, expected behavior, and actual behavior.
- Mention your environment: OS, browser, JDK, Node.js version.

### Submitting Pull Requests

1. Fork the repository and create a feature branch.
2. Make your changes with clear, focused commits.
3. Ensure backend tests pass: `cd backend && mvn test`
4. Ensure frontend builds successfully: `cd indexPage && npm run build`
5. Update relevant documentation if needed.
6. Open a pull request with a clear description.

## Code Style

### Backend (Java)

- Follow standard Java conventions.
- Use meaningful variable and method names.
- Keep methods short and focused.
- Add unit tests for new features when applicable.

### Frontend (Vue 3)

- Follow the existing component structure.
- Use Composition API with `<script setup>`.
- Run ESLint and Prettier before committing.

## Commit Messages

Use clear and concise commit messages:

```text
feat: add user bookmark endpoint
fix: resolve CORS issue in production
docs: update deployment guide
test: add auth controller tests
```

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Questions?

Open a Discussion or Issue and we will help you out.
