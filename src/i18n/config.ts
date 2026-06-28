export const defaultLocale = "es" as const;

export const supportedLocales = ["es", "en"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export interface AlternateLink {
  hreflang: string;
  href: string;
}

export interface LanguageSelectorOption {
  locale: SupportedLocale;
  href: string;
  label: string;
  shortLabel: string;
}

export const localeDefinitions: Record<
  SupportedLocale,
  {
    path: SupportedLocale;
    codes: readonly string[];
    htmlLang: string;
    ogLocale: string;
    label: string;
    shortLabel: string;
  }
> = {
  es: {
    path: "es",
    codes: ["es", "es-VE", "es-ES", "es-419", "es-US"],
    htmlLang: "es-VE",
    ogLocale: "es_VE",
    label: "Español",
    shortLabel: "ES",
  },
  en: {
    path: "en",
    codes: ["en", "en-US", "en-GB", "en-CA"],
    htmlLang: "en-US",
    ogLocale: "en_US",
    label: "English",
    shortLabel: "EN",
  },
};

export const localizedRoutes = {
  home: {
    es: "/es/",
    en: "/en/",
  },
  transparency: {
    es: "/es/transparencia",
    en: "/en/transparency",
  },
} as const satisfies Record<string, Record<SupportedLocale, string>>;

export type LocalizedRouteKey = keyof typeof localizedRoutes;

const codeToLocale = new Map<string, SupportedLocale>(
  supportedLocales.flatMap((locale) =>
    localeDefinitions[locale].codes.map((code) => [code.toLowerCase(), locale]),
  ),
);

const isSupportedLocale = (value: string | undefined | null): value is SupportedLocale =>
  supportedLocales.includes(value as SupportedLocale);

const resolvePreferredLocalePath = (
  code: string | undefined | null,
): SupportedLocale | undefined => {
  if (!code) return undefined;

  const normalized = code.trim().toLowerCase();
  if (!normalized) return undefined;

  if (codeToLocale.has(normalized)) return codeToLocale.get(normalized);

  const language = normalized.split("-")[0];
  return codeToLocale.get(language);
};

const getLocaleFromPathname = (
  pathname: string,
): SupportedLocale | undefined => {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isSupportedLocale(firstSegment) ? firstSegment : undefined;
};

export const resolveRequestLocale = ({
  cookieValue,
  pathname,
  preferredLocale,
}: {
  cookieValue?: string | null;
  pathname?: string;
  preferredLocale?: string | null;
}): SupportedLocale =>
  (pathname ? getLocaleFromPathname(pathname) : undefined) ??
  (isSupportedLocale(cookieValue)
    ? cookieValue
    : resolvePreferredLocalePath(preferredLocale) ?? defaultLocale);

export const getLocalizedPath = (
  routeKey: LocalizedRouteKey,
  locale: SupportedLocale,
  hash = "",
) => `${localizedRoutes[routeKey][locale]}${hash}`;

export const getLocalizedUrl = (
  routeKey: LocalizedRouteKey,
  locale: SupportedLocale,
  siteBaseUrl: string,
  hash = "",
) => new URL(getLocalizedPath(routeKey, locale, hash), `${siteBaseUrl}/`).href;

export const getAlternateLinks = (
  routeKey: LocalizedRouteKey,
  siteBaseUrl: string,
): AlternateLink[] => {
  const links: AlternateLink[] = supportedLocales.map((locale) => ({
    hreflang: locale,
    href: getLocalizedUrl(routeKey, locale, siteBaseUrl),
  }));

  links.push({
    hreflang: "x-default",
    href: getLocalizedUrl(routeKey, defaultLocale, siteBaseUrl),
  });

  return links;
};
