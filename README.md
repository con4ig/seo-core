# SEO Core

**SEO Core** is an enterprise-grade, high-performance web platform designed to maximize search engine visibility through automation. Built with a robust modern stack (**Next.js 15 + Strapi v5**), it leverages the power of **Google Gemini 2.0 Flash** to automatically generate, optimize, and organize perfect SEO metadata and semantic structures (JSON-LD) for every piece of content.

This project perfectly balances extreme technical optimization with an elegant, minimalist ("AAA") User Interface.

## Key Features

- **Automated AI SEO Pipeline**: The moment an article is crafted in Strapi, an internal lifecycle hook triggers Gemini 2.0 Flash to synthesize pixel-perfect Meta Titles, Descriptions, Keywords, and Robot directives based on content semantic analysis.
- **Enterprise Semantic Web Structure**: Full support for Google Rich Results via automatic `BreadcrumbList` and `Article` Schema.org JSON-LD injections.
- **Dynamic Crawl Directives**: Programmatically generated `sitemap.xml` and `robots.txt` ensuring real-time indexing synchronization.
- **Modern Monorepo Architecture**:
  - **Backend**: Strapi v5 running entirely autonomously, powered by PostgreSQL 16.
  - **Frontend**: Next.js 15 (App Router, Turbopack) built on optimal Server Components for blazingly fast TTFB (Time to First Byte).
- **Dockerized Zero-Config Environment**: One-command setup (`docker compose up`) orchestrating the backend, frontend, PostgreSQL, and an Nginx Proxy Manager for immediate, scalable deployment.
- **"Brutalist-Chic" Premium Design**: A meticulously crafted minimalist design system focusing on extreme readability, technical typography (`font-mono`), and spatial consistency.

## Technology Stack

| Ecosystem                   | Technologies                                                                                |
| :-------------------------- | :------------------------------------------------------------------------------------------ |
| **Frontend**                | Next.js 15 (App Router), React 19 rc, TailwindCSS, Lucide Icons, Shadcn-like raw components |
| **Backend (Headless CMS)**  | Strapi v5, Node.js (v20), `@google/generative-ai`                                           |
| **Database**                | PostgreSQL 16 (Alpine)                                                                      |
| **Infrastructure / DevOps** | Docker Compose, Docker, Nginx Proxy Manager                                                 |
| **Artificial Intelligence** | Google Gemini 2.0 Flash                                                                     |

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js (only for local tooling/linting, everything else runs in Docker)
- A [Google AI Studio API Key](https://aistudio.google.com/app/apikey) for Gemini 2.0 Flash

### Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/con4ig/seo-core.git
   cd seo-core
   ```

2. **Configure Environment Variables**
   Set up your configuration files based on the `.env.example` templates.

   **Backend:**

   ```bash
   cp Backend/.env.example Backend/.env
   ```

   _Crucial: Open `Backend/.env` and paste your Gemini API Key:_
   `GEMINI_API_KEY="your_api_key_here"`

   **Frontend:**

   ```bash
   cp Frontend/.env.example Frontend/.env
   ```

3. **Launch the Container Infrastructure**

   ```bash
   # Initialize and build the stack
   docker compose up --build -d
   ```

4. **Access the Applications**
   - **Frontend UI:** [http://localhost:3000](http://localhost:3000)
   - **Strapi Admin Panel:** [http://localhost:1337/admin](http://localhost:1337/admin)
   - **Nginx Proxy Manager (Optional):** [http://localhost:81](http://localhost:81)
   - _Note: On the first database initialization, Strapi will prompt you to create an Admin account._

## How the AI Auto-SEO Works

1. A content editor creates a new `Article` via the Strapi Admin Panel and fills the `content` blocks.
2. Upon saving (Draft) or publishing, Strapi's programmatic `lifecycles.ts` hook catches the `beforeCreate` or `beforeUpdate` events.
3. If the SEO metadata fields are empty, the backend dispatches a heavily context-aware prompt containing the article's raw text to the `Gemini 2.0 Flash` API.
4. Gemini synthesizes structured JSON containing optimal keywords and meta descriptions.
5. The CMS automatically injects the AI results into the Database precisely before the transaction completes.
6. When the frontend hits `/api/articles/[slug]`, Next.js maps the `article.seo` object into advanced Next.js Metadata and JSON-LD schema tags on the server side prior to rendering.

## Contribution & Review

This repository acts as a comprehensive demonstration of the integration between modern headless architectures, programmatic SEO optimization, and LLM (Large Language Model) agents working securely in the background.

To explore the exact iterative process behind this system's architecture, browse the commit history! All features were structured under the standard Conventional Commits formats.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started, our technical architecture, and the project roadmap.
