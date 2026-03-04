import { Core } from "@strapi/strapi";

export default {
  async afterCreate(event) {
    await handleSeoGeneration(event);
  },

  async afterUpdate(event) {
    await handleSeoGeneration(event);
  },
};

/**
 * Shared logic to generate SEO metadata if missing.
 * Runs AFTER the main record is saved, so we can use Document Service
 * to explicitly attach the component (avoiding Strapi v5 beforeUpdate drops).
 */
async function handleSeoGeneration(event) {
  const { result } = event;
  const documentId = result.documentId;

  if (!documentId) return;

  try {
    // 1. Fetch the exact article with the SEO component from DB
    const article = await strapi.documents("api::article.article").findOne({
      documentId: documentId,
      populate: ["seo"],
    });

    if (!article) return;

    // 2. Check if SEO is already fully populated
    const hasSeo = article.seo?.metaTitle && article.seo?.metaDescription;
    if (hasSeo) {
      return; // Already populated, and breaks infinite loops from our own update
    }

    // 3. Extract text
    let textToAnalyze = "";
    if (typeof article.content === "string") {
      textToAnalyze = article.content;
    } else if (Array.isArray(article.content)) {
      textToAnalyze = JSON.stringify(article.content);
    }

    if (!textToAnalyze || textToAnalyze.length < 10) {
      return;
    }

    strapi.log.info(
      "AI SEO: Article saved without full SEO. Starting generation...",
    );

    // 4. Generate SEO Data
    const generatedSeo = await strapi
      .service("api::ai.ai")
      .generateSeo(textToAnalyze);

    strapi.log.info(
      `AI SEO: Applying generated SEO to article ${documentId}...`,
    );

    // 5. Explicitly update the document to attach the component
    // Truncate fields to strictly adhear to the Strapi max limits just in case the LLM miscounts.
    await strapi.documents("api::article.article").update({
      documentId: documentId,
      data: {
        seo: {
          metaTitle: (generatedSeo.metaTitle || "").substring(0, 60),
          metaDescription: (generatedSeo.metaDescription || "").substring(
            0,
            160,
          ),
          keywords: generatedSeo.keywords || "",
          metaRobots: generatedSeo.metaRobots || "index, follow",
          structuredData: generatedSeo.structuredData || null,
        },
      } as any,
    });

    strapi.log.info("AI SEO: Successfully saved SEO component to database.");
  } catch (error) {
    strapi.log.error("AI SEO: Generation or Database Update failed: ", error);
  }
}
