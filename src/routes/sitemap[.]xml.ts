import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SITE_URL = "https://blogsudo.lovable.app";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const now = new Date().toISOString();

        const staticUrls = [
          { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0", lastmod: now },
          { loc: `${SITE_URL}/articulos`, changefreq: "daily", priority: "0.9", lastmod: now },
          { loc: `${SITE_URL}/eventos`, changefreq: "daily", priority: "0.9", lastmod: now },
        ];

        const [articlesRes, eventsRes] = await Promise.all([
          supabaseAdmin
            .from("articles")
            .select("slug, updated_at, published_at")
            .eq("status", "published"),
          supabaseAdmin
            .from("events")
            .select("slug, updated_at")
            .eq("status", "published"),
        ]);

        const articleUrls = (articlesRes.data ?? []).map((a) => ({
          loc: `${SITE_URL}/articulos/${a.slug}`,
          lastmod: a.updated_at ?? a.published_at ?? now,
          changefreq: "weekly",
          priority: "0.8",
        }));

        const eventUrls = (eventsRes.data ?? []).map((e) => ({
          loc: `${SITE_URL}/eventos/${e.slug}`,
          lastmod: e.updated_at ?? now,
          changefreq: "weekly",
          priority: "0.7",
        }));

        const all = [...staticUrls, ...articleUrls, ...eventUrls];

        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          all
            .map(
              (u) =>
                `  <url>\n` +
                `    <loc>${escapeXml(u.loc)}</loc>\n` +
                `    <lastmod>${u.lastmod}</lastmod>\n` +
                `    <changefreq>${u.changefreq}</changefreq>\n` +
                `    <priority>${u.priority}</priority>\n` +
                `  </url>`,
            )
            .join("\n") +
          `\n</urlset>\n`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
