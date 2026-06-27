import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";

export default defineConfig({
  adapter: vercel(),
  output: "server",
  security: {
    checkOrigin: false
  },
  site: process.env.PUBLIC_SITE_URL,
  integrations: [icon()]
});
