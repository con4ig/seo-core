import path from "path";
import type { Core } from "@strapi/strapi";

/**
 * Strapi Plugins Configuration
 *
 * Plugin resolve path uses process.cwd() so it works correctly in both:
 * - Local dev: cwd = Backend/, plugin at ../strapi-plugin-seo-gemini
 * - Docker:    cwd = /opt/app, plugin at /opt/app/strapi-plugin-seo-gemini
 */
const isDocker = process.env.RUNNING_IN_DOCKER === "true";

const config = ({ env }: Core.Config.Shared.ConfigParams): any => ({
  mcp: {
    enabled: true,
    config: {
      // The MCP plugin will automatically expose content types
      // based on the permissions set in the Strapi Admin Panel.
    },
  },
  "strapi-plugin-seo-gemini": {
    enabled: true,
    resolve: isDocker
      ? path.resolve(process.cwd(), "strapi-plugin-seo-gemini") // Docker: /opt/app/strapi-plugin-seo-gemini
      : path.resolve(__dirname, "..", "..", "strapi-plugin-seo-gemini"), // Local: Backend/../../strapi-plugin-seo-gemini
  },
});

export default config;
