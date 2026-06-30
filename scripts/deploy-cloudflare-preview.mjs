import { readFileSync, writeFileSync } from "node:fs";

const sourcePath = "dist/server/wrangler.json";
const outputPath = "dist/server/wrangler.preview.json";

const config = JSON.parse(readFileSync(sourcePath, "utf8"));

delete config.configPath;
delete config.userConfigPath;
delete config.topLevelName;
delete config.definedEnvironments;
delete config.legacy_env;

config.name = "todosporvenezuela-preview";
config.routes = [];
config.workers_dev = true;
config.preview_urls = true;
config.keep_vars = true;
config.vars = {
  DONATION_DEPLOYMENT_ENV: "preview",
  PUBLIC_DONATION_ENV: "sandbox",
  PUBLIC_SITE_URL: "https://todosporvenezuela.org",
  DONATION_CALLBACK_BASE_URL: "",
  DONATION_ENABLE_WRITES: "false",
  DONATION_REDIS_PREFIX: "tpv:donations:preview",
};

writeFileSync(outputPath, `${JSON.stringify(config, null, 2)}\n`);

console.log(`Wrote Cloudflare preview deploy config to ${outputPath}`);
