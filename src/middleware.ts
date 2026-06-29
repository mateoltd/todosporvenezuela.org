import { middleware as i18nMiddleware } from "astro:i18n";
import { defineMiddleware } from "astro:middleware";

const i18n = i18nMiddleware({
  prefixDefaultLocale: true,
  redirectToDefaultLocale: false,
  fallbackType: "redirect",
});

const bypassesI18n = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

export const onRequest = defineMiddleware((context, next) => {
  if (bypassesI18n(context.url.pathname)) {
    return next();
  }

  return i18n(context, next);
});
