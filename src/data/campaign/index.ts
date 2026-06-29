import { defaultLocale, type SupportedLocale } from "../../i18n/config";
import { enContent } from "./en";
import { esContent } from "./es";
import { buildFaqs } from "./faqs";
import { fillCoin } from "./shared";
import type { CampaignContent } from "./types";

export type {
  CampaignContent,
  CampaignFaq,
  CampaignOrganizer,
  DonationModalCopy,
  TransparencyDay,
} from "./types";
export { buildFaqs };

export const siteUrlFallback = "https://todosporvenezuela.org";
export const publishedDate = "2026-06-27";
export const modifiedDate = "2026-06-28";

const campaignContent: Record<SupportedLocale, CampaignContent> = {
  en: enContent,
  es: esContent,
};

export const getLocaleContent = (locale: SupportedLocale = defaultLocale) =>
  campaignContent[locale];

export const localizeCoinText = (value: string, coin: string) =>
  fillCoin(value, coin.trim().toUpperCase() || "USDT");
