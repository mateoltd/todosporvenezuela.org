import type { APIRoute } from "astro";
import {
  modifiedDate,
  pageDescription,
  pageTitle,
  siteUrlFallback,
  socialImage
} from "../data/campaign";

const normalizeSiteUrl = (value: string) => {
  const candidate = value.trim() || siteUrlFallback;
  const withProtocol = /^https?:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;

  return new URL(withProtocol).origin;
};

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = ({ site, url }) => {
  const siteBaseUrl = normalizeSiteUrl(
    import.meta.env.PUBLIC_SITE_URL || site?.toString() || url.origin
  );
  const homeUrl = new URL("/", `${siteBaseUrl}/`).href;
  const imageUrl = new URL(socialImage.path, homeUrl).href;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${escapeXml(homeUrl)}</loc>
    <lastmod>${modifiedDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(pageTitle)}</image:title>
      <image:caption>${escapeXml(pageDescription)}</image:caption>
    </image:image>
  </url>
</urlset>
`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
