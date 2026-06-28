import { defineConfig } from "astro/config";
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

export default defineConfig({
  adapter: vercel(),
  output: "server",
  security: {
    checkOrigin: false
  },
  site: process.env.PUBLIC_SITE_URL,
  integrations: [icon(), optimizedImageCacheHeaders()]
});
