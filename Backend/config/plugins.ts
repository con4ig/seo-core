import type { Core } from "@strapi/strapi";

/**
 * Strapi Plugins Configuration
 *
 * Configuring the @sensinum/strapi-plugin-mcp to allow AI agents
 * to act as SEO experts via the Model Context Protocol.
 */
const config = ({ env }: Core.Config.Shared.ConfigParams): any => ({
  mcp: {
    enabled: true,
    config: {
      // The MCP plugin will automatically expose content types
      // based on the permissions set in the Strapi Admin Panel.
    },
  },
});

export default config;
