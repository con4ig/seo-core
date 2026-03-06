// Generator script for strapi-plugin-seo-gemini source files
// Run: node generate-plugin-files.js

const fs = require('fs');
const path = require('path');

const PLUGIN_ROOT = path.join(__dirname, 'strapi-plugin-seo-gemini');

function writeFile(relativePath, content) {
    const fullPath = path.join(PLUGIN_ROOT, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log('  Written: ' + relativePath);
}

console.log('Generating plugin source files...\n');

// ============================================
// 1. SERVER: services/service.ts (Gemini AI)
// ============================================
writeFile('server/src/services/service.ts', [
    "import type { Core } from '@strapi/strapi';",
    "import { GoogleGenerativeAI } from '@google/generative-ai';",
    "",
    "const service = ({ strapi }: { strapi: Core.Strapi }) => ({",
    "  async generateSeo(content: string) {",
    "    if (!content) {",
    "      throw new Error('Content is required to generate SEO');",
    "    }",
    "",
    "    const apiKey = process.env.GEMINI_API_KEY;",
    "    if (!apiKey) {",
    "      strapi.log.warn('SEO Gemini: GEMINI_API_KEY is missing in .env');",
    "      return {",
    "        metaTitle: 'SEO Gemini | Key Missing',",
    "        metaDescription: 'Please configure GEMINI_API_KEY to enable AI generation.',",
    "      };",
    "    }",
    "",
    "    const genAI = new GoogleGenerativeAI(apiKey);",
    "    const modelsToTry = [",
    "      'gemini-2.0-flash',",
    "      'gemini-1.5-flash',",
    "      'gemini-1.5-flash-8b',",
    "    ];",
    "",
    "    let lastError: any = null;",
    "",
    "    for (const modelName of modelsToTry) {",
    "      try {",
    "        strapi.log.info(`SEO Gemini: Trying ${modelName}...`);",
    "        const model = genAI.getGenerativeModel({ model: modelName });",
    "",
    "        const prompt = `",
    "          You are an expert SEO copywriter.",
    "          Analyze the following content and generate optimized SEO metadata.",
    "          ",
    "          Requirements:",
    '          1. "metaTitle": Compelling title (max 60 chars).',
    '          2. "metaDescription": Compelling summary (max 160 chars).',
    '          3. "keywords": Relevant keywords comma-separated.',
    '          4. "metaRobots": "index, follow".',
    '          5. "structuredData": Valid JSON-LD Article/WebPage schema. Return as object.',
    "          ",
    "          Return ONLY valid JSON in this exact format:",
    "          {",
    '            "metaTitle": "Title",',
    '            "metaDescription": "Description",',
    '            "keywords": "k1, k2",',
    '            "metaRobots": "index, follow",',
    '            "structuredData": {}',
    "          }",
    "          ",
    "          Content:",
    "          ${content}",
    "        `;",
    "",
    "        const result = await model.generateContent(prompt);",
    "        const text = result.response.text();",
    "        const cleanedText = text.replace(/```json/gi, '').replace(/```/gi, '').trim();",
    "        const parsed = JSON.parse(cleanedText);",
    "",
    "        strapi.log.info(`SEO Gemini: Success with ${modelName}`);",
    "        return parsed;",
    "      } catch (err: any) {",
    "        lastError = err;",
    "        strapi.log.warn(`SEO Gemini: ${modelName} failed: ${err.message}`);",
    "      }",
    "    }",
    "",
    "    return {",
    "      metaTitle: 'SEO Gemini | Error',",
    "      metaDescription: `AI Generation failed. [Error: ${lastError?.message}]`,",
    "    };",
    "  },",
    "});",
    "",
    "export default service;",
    "",
].join('\n'));


// ============================================
// 2. SERVER: controllers/controller.ts
// ============================================
writeFile('server/src/controllers/controller.ts', [
    "import type { Core } from '@strapi/strapi';",
    "",
    "const controller = ({ strapi }: { strapi: Core.Strapi }) => ({",
    "  async generate(ctx) {",
    "    const { content } = ctx.request.body;",
    "",
    "    if (!content) {",
    "      return ctx.badRequest('Content is required');",
    "    }",
    "",
    "    try {",
    "      const result = await strapi",
    "        .plugin('strapi-plugin-seo-gemini')",
    "        .service('service')",
    "        .generateSeo(content);",
    "",
    "      ctx.body = { data: result };",
    "    } catch (error: any) {",
    "      ctx.internalServerError(error.message);",
    "    }",
    "  },",
    "});",
    "",
    "export default controller;",
    "",
].join('\n'));


// ============================================
// 3. SERVER: routes/admin/index.ts
// ============================================
writeFile('server/src/routes/admin/index.ts', [
    "export default () => ({",
    "  type: 'admin',",
    "  routes: [",
    "    {",
    "      method: 'POST',",
    "      path: '/generate',",
    "      handler: 'controller.generate',",
    "      config: {",
    "        policies: [],",
    "      },",
    "    },",
    "  ],",
    "});",
    "",
].join('\n'));


// ============================================
// 4. ADMIN: pages/HomePage.tsx
// ============================================
writeFile('admin/src/pages/HomePage.tsx', [
    "import { Main } from '@strapi/design-system';",
    "import { useIntl } from 'react-intl';",
    "import { getTranslation } from '../utils/getTranslation';",
    "",
    "const HomePage = () => {",
    "  const { formatMessage } = useIntl();",
    "",
    "  return (",
    "    <Main>",
    "      <h1>",
    "        {formatMessage({ id: getTranslation('plugin.name'), defaultMessage: 'SEO Gemini' })}",
    "      </h1>",
    "      <p>AI-powered SEO metadata generation using Google Gemini.</p>",
    "    </Main>",
    "  );",
    "};",
    "",
    "export { HomePage };",
    "",
].join('\n'));

console.log('\nAll plugin source files generated successfully!');
console.log('Now run: cd strapi-plugin-seo-gemini && npm run build');
