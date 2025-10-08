// scripts/gen-sitemap.mjs
import { writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const SITE =
  process.env.SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:4173");

const API = process.env.VITE_API_URL || "http://localhost:4000";


console.log("[sitemap] SITE_URL =", SITE);
console.log("[sitemap] API_URL  =", API);

async function getProducts() {
  try {
    const res = await fetch(`${API}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn("[sitemap] cannot fetch products:", e.message);
    return [];
  }
}

function xmlEscape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

(async () => {
  const products = await getProducts();
  const today = new Date().toISOString().slice(0, 10);

  const urls = [
    { loc: `${SITE}/`,            changefreq: "weekly",  priority: "0.9" },
    { loc: `${SITE}/catalog`,     changefreq: "daily",   priority: "0.8" },
    // службові маршрути (admin, order) ми НЕ додаємо
    ...products.map(p => ({
      loc: `${SITE}/product/${p.id}`,
      changefreq: "weekly",
      priority: "0.7"
    })),
  ];

  const urlset = urls.map(u => `
    <url>
      <loc>${xmlEscape(u.loc)}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>${u.changefreq}</changefreq>
      <priority>${u.priority}</priority>
    </url>`).join("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urlset}
  </urlset>`;

  const publicDir = resolve("public");
  await mkdir(publicDir, { recursive: true });
  await writeFile(resolve(publicDir, "sitemap.xml"), sitemap.trim(), "utf8");
  await writeFile(resolve(publicDir, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`, "utf8");

  console.log("[sitemap] generated public/sitemap.xml and public/robots.txt");
})();
