import type { APIRoute } from "astro";
import { siteUrlFallback } from "../data/campaign";

const normalizeSiteUrl = (value: string) => {
  const candidate = value.trim() || siteUrlFallback;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;

  return new URL(withProtocol).origin;
};

export const GET: APIRoute = ({ site, url }) => {
  const siteBaseUrl = normalizeSiteUrl(
    import.meta.env.PUBLIC_SITE_URL || site?.toString() || url.origin
  );
  const sitemapUrl = new URL("/sitemap.xml", `${siteBaseUrl}/`).href;
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl}`, ""].join(
    "\n"
  );

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
