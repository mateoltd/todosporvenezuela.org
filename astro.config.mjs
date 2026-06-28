import { defineConfig, envField } from "astro/config";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import { readFile, writeFile } from "node:fs/promises";

const optimizedImagesRoute = {
  src: "^/images/optimized/(.*)$",
  headers: {
    "cache-control": "public, max-age=31536000, immutable"
  },
  continue: true
};

const optimizedImageCacheHeaders = () => ({
  name: "optimized-image-cache-headers",
  hooks: {
    "astro:build:done": async ({ logger }) => {
      const vercelOutputConfig = new URL("./.vercel/output/config.json", import.meta.url);
      const vercelConfig = JSON.parse(await readFile(vercelOutputConfig, "utf8"));
      const routes = Array.isArray(vercelConfig.routes) ? vercelConfig.routes : [];

      vercelConfig.routes = routes.filter((route) => route.src !== optimizedImagesRoute.src);

      const filesystemRouteIndex = vercelConfig.routes.findIndex(
        (route) => route.handle === "filesystem"
      );
      const insertIndex = filesystemRouteIndex >= 0 ? filesystemRouteIndex : 0;
      vercelConfig.routes.splice(insertIndex, 0, optimizedImagesRoute);

      await writeFile(vercelOutputConfig, `${JSON.stringify(vercelConfig, null, "\t")}\n`);
      logger.info("Added immutable cache headers for /images/optimized/*");
    }
  }
});

const serverEnvString = () => envField.string({
  context: "server",
  access: "secret",
  optional: true
});
const serverEnvNumber = () => envField.number({
  context: "server",
  access: "secret",
  optional: true
});
const serverEnvDonationMode = () => envField.enum({
  context: "server",
  access: "secret",
  optional: true,
  values: ["production", "sandbox"]
});

export default defineConfig({
  adapter: vercel(),
  env: {
    schema: {
      DONATION_ADMIN_MAX_TOP_UP_USD: serverEnvString(),
      DONATION_ADMIN_PASSWORD: serverEnvString(),
      DONATION_ADMIN_TOKEN: serverEnvString(),
      DONATION_ADMIN_USERNAME: serverEnvString(),
      DONATION_BASELINE_RAISED_USD: serverEnvString(),
      DONATION_CURRENCY: serverEnvString(),
      DONATION_GOAL_USD: serverEnvString(),
      DONATION_PAYPAL_ITEM_NAME: serverEnvString(),
      DONATION_PAYPAL_ITEM_NUMBER: serverEnvString(),
      DONATION_REDIS_PREFIX: serverEnvString(),
      DONATION_SSE_INTERVAL_MS: serverEnvNumber(),
      DONATION_SSE_MAX_DURATION_MS: serverEnvNumber(),
      KV_REST_API_READ_ONLY_TOKEN: serverEnvString(),
      KV_REST_API_TOKEN: serverEnvString(),
      KV_REST_API_URL: serverEnvString(),
      PAYPAL_IPN_VERIFY_URL: serverEnvString(),
      PAYPAL_RECEIVER_EMAILS: serverEnvString(),
      PAYPAL_RECEIVER_IDS: serverEnvString(),
      PUBLIC_BINANCE_COIN: serverEnvString(),
      PUBLIC_BINANCE_PAY_ID: serverEnvString(),
      PUBLIC_DONATION_CURRENCY: serverEnvString(),
      PUBLIC_DONATION_ENV: serverEnvDonationMode(),
      PUBLIC_DONATION_GOAL_USD: serverEnvString(),
      PUBLIC_DONATION_INITIAL_RAISED_USD: serverEnvString(),
      PUBLIC_DONATION_PROGRESS_POLL_MS: serverEnvNumber(),
      PUBLIC_ORGANIZER_VIDEO_SRC: serverEnvString(),
      PUBLIC_ORGANIZER_VIDEO_TITLE: serverEnvString(),
      PUBLIC_ORGANIZER_VIDEO_URL: serverEnvString(),
      PUBLIC_PAGO_MOVIL_BANCO: serverEnvString(),
      PUBLIC_PAGO_MOVIL_CONTACTO: serverEnvString(),
      PUBLIC_PAGO_MOVIL_DOCUMENTO: serverEnvString(),
      PUBLIC_PAGO_MOVIL_TELEFONO: serverEnvString(),
      PUBLIC_PAGO_MOVIL_TITULAR: serverEnvString(),
      PUBLIC_PAYPAL_BUSINESS: serverEnvString(),
      PUBLIC_PAYPAL_DONATE_URL: serverEnvString(),
      PUBLIC_PAYPAL_ENV: serverEnvDonationMode(),
      PUBLIC_PAYPAL_HOSTED_BUTTON_ID: serverEnvString(),
      PUBLIC_PAYPAL_PRODUCTION_BUSINESS: serverEnvString(),
      PUBLIC_PAYPAL_PRODUCTION_DONATE_URL: serverEnvString(),
      PUBLIC_PAYPAL_PRODUCTION_HOSTED_BUTTON_ID: serverEnvString(),
      PUBLIC_PAYPAL_SANDBOX_BUSINESS: serverEnvString(),
      PUBLIC_PAYPAL_SANDBOX_DONATE_URL: serverEnvString(),
      PUBLIC_PAYPAL_SANDBOX_HOSTED_BUTTON_ID: serverEnvString(),
      PUBLIC_SITE_URL: serverEnvString(),
      UPSTASH_REDIS_REST_READ_ONLY_TOKEN: serverEnvString(),
      UPSTASH_REDIS_REST_TOKEN: serverEnvString(),
      UPSTASH_REDIS_REST_URL: serverEnvString()
    }
  },
  i18n: {
    defaultLocale: "es",
    locales: [
      {
        path: "es",
        codes: ["es", "es-VE", "es-ES", "es-419", "es-US"]
      },
      {
        path: "en",
        codes: ["en", "en-US", "en-GB", "en-CA"]
      }
    ],
    routing: {
      prefixDefaultLocale: true
    }
  },
  output: "server",
  security: {
    checkOrigin: false
  },
  site: process.env.PUBLIC_SITE_URL,
  integrations: [icon(), optimizedImageCacheHeaders()]
});
