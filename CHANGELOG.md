# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial open-source project structure
- Root README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, CHANGELOG
- Root .gitignore covering Java, Maven, Node.js, and IDE artifacts
- Docker Compose setup for MySQL and Redis
- Production configuration template `application-prod.yml`
- GitHub issue and pull request templates
- Backend CI workflow for build and test

### Changed

- Unified frontend API client to connect to real backend by default
- Improved JWT authentication response with user profile

### Fixed

- Backend compilation issues and missing imports
- Unified error response format for 401/403 errors

## [0.1.0] - 2026-06-26

### Added

- Spring Boot 3 backend with MyBatis Plus, JWT, Spring Security
- Vue 3 frontend with Vite, Pinia, Vue Router
- Home, tools, articles, projects, errors, tutorials, search, user center pages
- Admin dashboard with RBAC
- SEO infrastructure (sitemap, meta tags, static pages)
- Initial test suite for auth, admin permissions, and password hashing
