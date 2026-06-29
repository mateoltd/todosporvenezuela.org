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

  it("resolves request locale by path, cookie, then default", () => {
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

    expect(resolveRequestLocale({})).toBe(defaultLocale);
    expect(resolveRequestLocale({ cookieValue: "fr", preferredLocale: "fr-FR" })).toBe(
      defaultLocale,
    );
  });

  it("does not infer locale from browser or device language", () => {
    expect(resolveRequestLocale({ preferredLocale: "en-GB" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ preferredLocale: "en-AU" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ preferredLocale: "ES-VE" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ preferredLocale: "  en-GB  " })).toBe(defaultLocale);
  });

  it("falls back to the default locale for unknown or empty input", () => {
    expect(resolveRequestLocale({ preferredLocale: "pt" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ preferredLocale: "" })).toBe(defaultLocale);
    expect(resolveRequestLocale({ cookieValue: "fr" })).toBe(defaultLocale);
    expect(resolveRequestLocale({})).toBe(defaultLocale);
  });

  it("generates language-level alternate links with Spanish x-default", () => {
    expect(getAlternateLinks("home", "https://example.org")).toEqual([
      { hreflang: "es", href: "https://example.org/es/" },
      { hreflang: "en", href: "https://example.org/en/" },
      { hreflang: "x-default", href: "https://example.org/es/" },
    ]);
  });
});
