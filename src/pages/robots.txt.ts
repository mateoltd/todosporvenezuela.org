import type { APIRoute } from "astro";
import { getConfiguredSiteBaseUrl } from "../lib/config/env";

export const GET: APIRoute = ({ site, url }) => {
  const siteBaseUrl = getConfiguredSiteBaseUrl(site?.toString() || url.origin);
  const sitemapUrl = new URL("/sitemap.xml", `${siteBaseUrl}/`).href;
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin/",
    "Disallow: /api/donations/admin/",
    "",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
