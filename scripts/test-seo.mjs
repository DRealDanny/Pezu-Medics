async function test() {
  const res = await fetch("http://localhost:3000");
  const text = await res.text();
  const title = text.match(/<title>([^<]+)<\/title>/)?.[1];
  const canonical = text.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const ogTitle = text.match(/<meta property="og:title" content="([^"]+)"/)?.[1];
  const ogImage = text.match(/<meta property="og:image" content="([^"]+)"/)?.[1];
  const hasLdJson = text.includes("application/ld+json");

  console.log("=== SEO AUDIT REPORT ===");
  console.log("Title:", title);
  console.log("Canonical:", canonical);
  console.log("OG Title:", ogTitle);
  console.log("OG Image:", ogImage);
  console.log("Has Schema JSON-LD:", hasLdJson);

  const robotsRes = await fetch("http://localhost:3000/robots.txt");
  console.log("\n=== ROBOTS.TXT ===\n" + (await robotsRes.text()));

  const sitemapRes = await fetch("http://localhost:3000/sitemap.xml");
  console.log("\n=== SITEMAP.XML (First 400 chars) ===\n" + (await sitemapRes.text()).slice(0, 400));

  const llmsRes = await fetch("http://localhost:3000/llms.txt");
  console.log("\n=== LLMS.TXT (First 250 chars) ===\n" + (await llmsRes.text()).slice(0, 250));
}

test().catch(console.error);
