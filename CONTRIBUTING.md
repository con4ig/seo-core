# Contributing to SEO Core

First off, thank you for considering contributing to SEO Core! It's people like you that make SEO Core such a great tool.

## How Can I Contribute?

### Reporting Bugs
If you find a bug, please create an issue on GitHub. Include:
- A clear, descriptive title.
- Steps to reproduce the bug.
- Actual vs. expected behavior.
- Environment details (Docker version, browser, etc.).

### Suggesting Enhancements
Feature requests are welcome! Please open an issue to discuss your ideas before starting work.

### Pull Requests
1. Fork the repo and create your branch from `main`.
2. Follow the existing code style (TSX, Tailwind, Clean Code).
3. If you've added code that should be tested, add tests.
4. Ensure the test suite passes.
5. Use Conventional Commits for your commit messages.

## Technical Architecture Overview

To contribute effectively, it's helpful to understand the core engine:

### 1. The AI Engine (Backend)
- **Path**: `Backend/src/api/ai/`
- **Logic**: We use the `@google/generative-ai` library to interface with Gemini 2.0 Flash.
- **Trigger**: Programmatic Lifecycles in `Backend/src/api/article/content-types/article/lifecycles.ts` handle the `beforeCreate` and `beforeUpdate` events to auto-fill SEO metadata.

### 2. The Frontend (Next.js)
- **Architecture**: Next.js 15 App Router.
- **SEO Optimization**: Metadata is generated in `app/articles/[slug]/page.tsx` using the data fetched from Strapi.
- **Breadcrumbs**: Reusable component in `components/blocks/Breadcrumbs.tsx` with JSON-LD support.

## 🗺 Project Roadmap

One of our primary goals is to **modularize the AI SEO logic into a standalone Strapi Plugin**. Currently, the logic lives inside the core Strapi API structure. Moving it to a plugin would allow:
- Easier installation across different Strapi projects.
- Dedicated configuration UI in the Strapi Admin Panel.
- Plugin-specific assets and translations.

If you are interested in helping with this architectural shift, please reach out via GitHub issues!

## Style Guide

- **TypeScript**: No `any`. Use proper interfaces (see `Frontend/src/types/strapi.ts`).
- **CSS**: Use Tailwind CSS for all UI components.
- **Git**: Follow Conventional Commits (e.g., `feat: Add support for AI image generation`).
