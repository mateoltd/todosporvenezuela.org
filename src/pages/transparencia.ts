import type { APIRoute } from "astro";
import { getLocalizedPath, resolveRequestLocale } from "../i18n/config";

export const GET: APIRoute = ({ cookies }) => {
  const locale = resolveRequestLocale({
    cookieValue: cookies.get("tpv_locale")?.value,
  });

  return new Response(null, {
    status: 302,
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      Location: getLocalizedPath("transparency", locale),
      Vary: "Cookie",
    },
  });
};
