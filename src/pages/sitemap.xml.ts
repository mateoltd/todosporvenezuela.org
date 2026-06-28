import type { APIRoute } from "astro";
import {
  getLocaleContent,
  modifiedDate,
  siteUrlFallback,
} from "../data/campaign";
import {
  getAlternateLinks,
  getLocalizedUrl,
  supportedLocales,
  type LocalizedRouteKey,
  type SupportedLocale,
} from "../i18n/config";
import { normalizeSiteUrl } from "../lib/config/env";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const routePriority: Record<LocalizedRouteKey, string> = {
  home: "1.0",
  transparency: "0.8",
};

const routeChangeFreq: Record<LocalizedRouteKey, string> = {
  home: "hourly",
  transparency: "daily",
};

const renderAlternateLinks = (routeKey: LocalizedRouteKey, siteBaseUrl: string) =>
  getAlternateLinks(routeKey, siteBaseUrl)
    .map(
      ({ hreflang, href }) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}" />`,
    )
    .join("\n");

const renderUrl = (
  routeKey: LocalizedRouteKey,
  locale: SupportedLocale,
  siteBaseUrl: string,
) => {
  const content = getLocaleContent(locale);
  const loc = getLocalizedUrl(routeKey, locale, siteBaseUrl);
  const imageUrl = new URL(content.socialImage.path, `${siteBaseUrl}/`).href;
  const imageXml =
    routeKey === "home"
      ? `
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(content.pageTitle)}</image:title>
      <image:caption>${escapeXml(content.pageDescription)}</image:caption>
    </image:image>`
      : "";

  return `  <url>
    <loc>${escapeXml(loc)}</loc>
${renderAlternateLinks(routeKey, siteBaseUrl)}
    <lastmod>${modifiedDate}</lastmod>
    <changefreq>${routeChangeFreq[routeKey]}</changefreq>
    <priority>${routePriority[routeKey]}</priority>${imageXml}
  </url>`;
};

export const GET: APIRoute = ({ site, url }) => {
  const siteBaseUrl = normalizeSiteUrl(
    import.meta.env.PUBLIC_SITE_URL || site?.toString() || url.origin,
    siteUrlFallback,
  );
  const urls = (["home", "transparency"] as const).flatMap((routeKey) =>
    supportedLocales.map((locale) => renderUrl(routeKey, locale, siteBaseUrl)),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
