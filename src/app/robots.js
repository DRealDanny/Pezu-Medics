/**
 * Next.js Robots Configuration
 * Fully optimized for Googlebot, Bingbot, and Generative AI Search Crawlers
 * (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.)
 */
export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pezustandardmedics.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/pezu-admin", "/api/auth/", "/api/upload"],
      },
      {
        // Explicitly allow and prioritize AI search engines and answer engines
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "cohere-ai",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
        disallow: ["/pezu-admin", "/api/auth/", "/api/upload"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
