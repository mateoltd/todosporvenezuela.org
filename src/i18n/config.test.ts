import { describe, expect, it } from "vitest";
import {
  defaultLocale,
  getAlternateLinks,
  getLocalizedPath,
  getLocalizedUrl,
  resolveRequestLocale,
} from "./config";

describe("i18n config", () => {
  it("builds localized paths and urls from the route map", () => {
    expect(getLocalizedPath("home", "es")).toBe("/es/");
    expect(getLocalizedPath("home", "en", "#faq")).toBe("/en/#faq");
    expect(getLocalizedPath("transparency", "es")).toBe("/es/transparencia");
    expect(getLocalizedUrl("transparency", "en", "https://example.org")).toBe(
      "https://example.org/en/transparency",
    );
  });

  it("resolves request locale by path, cookie, preferred locale, then default", () => {
    expect(
      resolveRequestLocale({
        cookieValue: "es",
        pathname: "/en/missing",
        preferredLocale: "es-419",
      }),
    ).toBe("en");

    expect(
      resolveRequestLocale({
        cookieValue: "en",
        preferredLocale: "es-419",
      }),
    ).toBe("en");

    expect(resolveRequestLocale({ preferredLocale: "en-GB" })).toBe("en");
    expect(resolveRequestLocale({ preferredLocale: "es-419" })).toBe("es");
    expect(resolveRequestLocale({ preferredLocale: "en-AU" })).toBe("en");
    expect(resolveRequestLocale({ preferredLocale: "es-MX" })).toBe("es");
    expect(resolveRequestLocale({ cookieValue: "fr", preferredLocale: "fr-FR" })).toBe(
      defaultLocale,
    );
  });

  it("normalizes preferred locale codes by case and whitespace", () => {
    expect(resolveRequestLocale({ preferredLocale: "ES-VE" })).toBe("es");
    expect(resolveRequestLocale({ preferredLocale: "  en-GB  " })).toBe("en");
  });

  it("falls back to the default locale for unknown or empty input", () => {
    expect(resolveRequestLocale({ preferredLocale: "pt" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ preferredLocale: "" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ cookieValue: "fr" })).toBe(defaultLocale);
    expect(resolveRequestLocale({})).toBe(defaultLocale);
  });

  it("generates deduped alternate links with Spanish x-default", () => {
    const links = getAlternateLinks("home", "https://example.org");
    const hreflangs = links.map((link) => link.hreflang);

    expect(new Set(hreflangs).size).toBe(hreflangs.length);
    expect(links).toContainEqual({
      hreflang: "x-default",
      href: "https://example.org/es/",
    });
    expect(links).toContainEqual({
      hreflang: "en-US",
      href: "https://example.org/en/",
    });
  });
});
