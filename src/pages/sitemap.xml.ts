import type { APIRoute } from "astro";
import {
  getLocaleContent,
  modifiedDate,
  siteUrlFallback,
} from "../data/campaign";
import {
  defaultLocale,
  getAlternateLinks,
  getLocalizedUrl,
  getTransparencyDayUrl,
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

const renderTransparencyDayUrls = (siteBaseUrl: string) => {
  const days = getLocaleContent(defaultLocale).transparency.days;

  return days.map((day) => {
    const alternates = supportedLocales
      .flatMap((locale) => {
        const localized = getLocaleContent(locale).transparency.days.find(
          (entry) => entry.dayNumber === day.dayNumber,
        );
        return localized
          ? [{ locale, slug: localized.slug }]
          : [];
      })
      .map(
        ({ locale, slug }) =>
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(getTransparencyDayUrl(locale, slug, siteBaseUrl))}" />`,
      )
      .join("\n");

    return supportedLocales
      .flatMap((locale) => {
        const localized = getLocaleContent(locale).transparency.days.find(
          (entry) => entry.dayNumber === day.dayNumber,
        );
        if (!localized) return [];

        return [
          `  <url>
    <loc>${escapeXml(getTransparencyDayUrl(locale, localized.slug, siteBaseUrl))}</loc>
${alternates}
    <lastmod>${modifiedDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
        ];
      })
      .join("\n");
  });
};

export const GET: APIRoute = ({ site, url }) => {
  const siteBaseUrl = normalizeSiteUrl(
    import.meta.env.PUBLIC_SITE_URL || site?.toString() || url.origin,
    siteUrlFallback,
  );
  const urls = [
    ...(["home", "transparency"] as const).flatMap((routeKey) =>
      supportedLocales.map((locale) => renderUrl(routeKey, locale, siteBaseUrl)),
    ),
    ...renderTransparencyDayUrls(siteBaseUrl),
  ];
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
