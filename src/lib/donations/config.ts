import { z } from "zod";
import {
  cleanEnvString,
  envString,
  getEnv,
  getEnvSource,
  normalizeSiteUrl,
  optionalEnvString,
  optionalEnvUrl,
  positiveIntegerEnv,
  type EnvSource,
} from "../config/env";

export interface DonationAmount {
  value: number;
  note: string;
  popular?: boolean;
}

export interface DonationConfig {
  paypalUrl: string;
  paypalNotifyUrl: string;
  paypal: {
    env: "production" | "sandbox";
    hostedButtonId: string;
    business: string;
  };
  amounts: DonationAmount[];
  pagoMovil: {
    banco: string;
    telefono: string;
    documento: string;
    titular: string;
    contacto: string;
  };
  binance: { payId: string; coin: string };
}

export interface DonationRuntimeConfig {
  adminMaxTopUpCents: number;
  adminPassword: string;
  adminToken: string;
  adminUsername: string;
  baselineCents: number;
  binanceCoin: string;
  binancePayId: string;
  currency: string;
  donationEnv: "production" | "sandbox";
  goalCents: number;
  keys: {
    recentEvents: string;
    total: string;
    updatedAt: string;
  };
  pagoMovil: {
    banco: string;
    telefono: string;
    documento: string;
    titular: string;
    contacto: string;
  };
  paypalBusiness: string;
  paypalDonateUrl: string;
  paypalHostedButtonId: string;
  paypalIpnVerifyUrl: string;
  paypalItemName: string;
  paypalItemNumber: string;
  paypalReceiverEmails: string[];
  paypalReceiverIds: string[];
  progressPollMs: number;
  publicSiteUrl: string;
  redisPrefix: string;
  redisRestReadOnlyToken: string;
  redisRestToken: string;
  redisRestUrl: string;
  sseIntervalMs: number;
  sseMaxDurationMs: number;
}

const defaultPagoMovil = {
  banco: "Mercantil",
  telefono: "04123058665",
  documento: "32532287",
  titular: "",
  contacto: "+58 412 3058665",
};

export const parseAmountToCents = (value: number | string | null | undefined) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value * 100) : 0;
  }

  const normalized = String(value ?? "")
    .trim()
    .replace(/[$,\s]/g, "");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? Math.round(parsed * 100) : 0;
};

const centsFromEnv = z
  .preprocess((value) => {
    const raw = cleanEnvString(value);
    if (!raw) return undefined;

    const normalized = raw.replace(/[$,\s]/g, "");
    if (!/^\d+(\.\d+)?$/.test(normalized)) return raw;

    const cents = parseAmountToCents(raw);
    return cents > 0 ? cents : raw;
  }, z.number().int().positive().optional());

const currencyCode = z
  .preprocess(
    (value) => cleanEnvString(value)?.toUpperCase(),
    z.string().regex(/^[A-Z]{3}$/).optional(),
  );

const donationEnvMode = z
  .preprocess(
    (value) => cleanEnvString(value)?.toLowerCase(),
    z.enum(["production", "sandbox"]).optional(),
  );

const csvList = optionalEnvString.transform((value) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean),
);

const donationEnvSchema = z
  .object({
    DONATION_ADMIN_MAX_TOP_UP_USD: centsFromEnv,
    DONATION_ADMIN_PASSWORD: envString(),
    DONATION_ADMIN_TOKEN: envString(),
    DONATION_ADMIN_USERNAME: envString(),
    DONATION_BASELINE_RAISED_USD: centsFromEnv,
    DONATION_CURRENCY: currencyCode,
    DONATION_GOAL_USD: centsFromEnv,
    DONATION_PAYPAL_ITEM_NAME: envString(
      "Ayuda para insumos médicos, alimentación e hidratación en Venezuela.",
    ),
    DONATION_PAYPAL_ITEM_NUMBER: envString("donacion-terremoto"),
    DONATION_REDIS_PREFIX: envString("tpv:donations"),
    DONATION_SSE_INTERVAL_MS: positiveIntegerEnv(3000),
    DONATION_SSE_MAX_DURATION_MS: positiveIntegerEnv(25000),
    KV_REST_API_READ_ONLY_TOKEN: envString(),
    KV_REST_API_TOKEN: envString(),
    KV_REST_API_URL: optionalEnvUrl,
    PAYPAL_IPN_VERIFY_URL: optionalEnvUrl,
    PAYPAL_RECEIVER_EMAILS: csvList,
    PAYPAL_RECEIVER_IDS: csvList,
    PUBLIC_BINANCE_COIN: envString("USDT"),
    PUBLIC_BINANCE_PAY_ID: envString(),
    PUBLIC_DONATION_CURRENCY: currencyCode,
    PUBLIC_DONATION_ENV: donationEnvMode,
    PUBLIC_DONATION_GOAL_USD: centsFromEnv,
    PUBLIC_DONATION_INITIAL_RAISED_USD: centsFromEnv,
    PUBLIC_DONATION_PROGRESS_POLL_MS: positiveIntegerEnv(15000),
    PUBLIC_PAGO_MOVIL_BANCO: envString(defaultPagoMovil.banco),
    PUBLIC_PAGO_MOVIL_CONTACTO: envString(defaultPagoMovil.contacto),
    PUBLIC_PAGO_MOVIL_DOCUMENTO: envString(defaultPagoMovil.documento),
    PUBLIC_PAGO_MOVIL_TELEFONO: envString(defaultPagoMovil.telefono),
    PUBLIC_PAGO_MOVIL_TITULAR: envString(defaultPagoMovil.titular),
    PUBLIC_PAYPAL_BUSINESS: envString(),
    PUBLIC_PAYPAL_DONATE_URL: optionalEnvUrl,
    PUBLIC_PAYPAL_ENV: donationEnvMode,
    PUBLIC_PAYPAL_HOSTED_BUTTON_ID: envString(),
    PUBLIC_PAYPAL_PRODUCTION_BUSINESS: envString(),
    PUBLIC_PAYPAL_PRODUCTION_DONATE_URL: optionalEnvUrl,
    PUBLIC_PAYPAL_PRODUCTION_HOSTED_BUTTON_ID: envString(),
    PUBLIC_PAYPAL_SANDBOX_BUSINESS: envString(),
    PUBLIC_PAYPAL_SANDBOX_DONATE_URL: optionalEnvUrl,
    PUBLIC_PAYPAL_SANDBOX_HOSTED_BUTTON_ID: envString(),
    PUBLIC_SITE_URL: envString(),
    UPSTASH_REDIS_REST_READ_ONLY_TOKEN: envString(),
    UPSTASH_REDIS_REST_TOKEN: envString(),
    UPSTASH_REDIS_REST_URL: optionalEnvUrl,
  })
  .transform((env): DonationRuntimeConfig => {
    const donationEnv = env.PUBLIC_DONATION_ENV ?? env.PUBLIC_PAYPAL_ENV ?? "production";
    const currency = env.DONATION_CURRENCY ?? env.PUBLIC_DONATION_CURRENCY ?? "USD";
    const prefix = env.DONATION_REDIS_PREFIX;
    const defaultPaypalDonateUrl =
      donationEnv === "sandbox"
        ? "https://www.sandbox.paypal.com/donate"
        : "https://www.paypal.com/donate";
    const donationEnvName = donationEnv.toUpperCase() as "PRODUCTION" | "SANDBOX";
    const modePaypalDonateUrl =
      donationEnvName === "SANDBOX"
        ? env.PUBLIC_PAYPAL_SANDBOX_DONATE_URL
        : env.PUBLIC_PAYPAL_PRODUCTION_DONATE_URL;
    const modePaypalBusiness =
      donationEnvName === "SANDBOX"
        ? env.PUBLIC_PAYPAL_SANDBOX_BUSINESS
        : env.PUBLIC_PAYPAL_PRODUCTION_BUSINESS;
    const modePaypalHostedButtonId =
      donationEnvName === "SANDBOX"
        ? env.PUBLIC_PAYPAL_SANDBOX_HOSTED_BUTTON_ID
        : env.PUBLIC_PAYPAL_PRODUCTION_HOSTED_BUTTON_ID;
    const redisRestToken = env.UPSTASH_REDIS_REST_TOKEN || env.KV_REST_API_TOKEN;

    return {
      adminMaxTopUpCents: env.DONATION_ADMIN_MAX_TOP_UP_USD ?? parseAmountToCents("10000"),
      adminPassword: env.DONATION_ADMIN_PASSWORD,
      adminToken: env.DONATION_ADMIN_TOKEN,
      adminUsername: env.DONATION_ADMIN_USERNAME,
      baselineCents:
        env.DONATION_BASELINE_RAISED_USD ??
        env.PUBLIC_DONATION_INITIAL_RAISED_USD ??
        parseAmountToCents("100"),
      binanceCoin: env.PUBLIC_BINANCE_COIN.toUpperCase(),
      binancePayId: env.PUBLIC_BINANCE_PAY_ID,
      currency,
      donationEnv,
      goalCents:
        env.DONATION_GOAL_USD ??
        env.PUBLIC_DONATION_GOAL_USD ??
        parseAmountToCents("800"),
      keys: {
        recentEvents: `${prefix}:events:recent`,
        total: `${prefix}:raised_cents`,
        updatedAt: `${prefix}:updated_at`,
      },
      pagoMovil: {
        banco: env.PUBLIC_PAGO_MOVIL_BANCO,
        telefono: env.PUBLIC_PAGO_MOVIL_TELEFONO,
        documento: env.PUBLIC_PAGO_MOVIL_DOCUMENTO,
        titular: env.PUBLIC_PAGO_MOVIL_TITULAR,
        contacto: env.PUBLIC_PAGO_MOVIL_CONTACTO,
      },
      paypalBusiness: modePaypalBusiness || env.PUBLIC_PAYPAL_BUSINESS,
      paypalDonateUrl: modePaypalDonateUrl || env.PUBLIC_PAYPAL_DONATE_URL || defaultPaypalDonateUrl,
      paypalHostedButtonId:
        modePaypalHostedButtonId || env.PUBLIC_PAYPAL_HOSTED_BUTTON_ID,
      paypalIpnVerifyUrl:
        env.PAYPAL_IPN_VERIFY_URL ??
        (donationEnv === "sandbox"
          ? "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr"
          : "https://ipnpb.paypal.com/cgi-bin/webscr"),
      paypalItemName: env.DONATION_PAYPAL_ITEM_NAME,
      paypalItemNumber: env.DONATION_PAYPAL_ITEM_NUMBER,
      paypalReceiverEmails: env.PAYPAL_RECEIVER_EMAILS,
      paypalReceiverIds: env.PAYPAL_RECEIVER_IDS,
      progressPollMs: env.PUBLIC_DONATION_PROGRESS_POLL_MS,
      publicSiteUrl: normalizeSiteUrl(env.PUBLIC_SITE_URL),
      redisPrefix: prefix,
      redisRestReadOnlyToken:
        env.UPSTASH_REDIS_REST_READ_ONLY_TOKEN ||
        env.KV_REST_API_READ_ONLY_TOKEN ||
        redisRestToken,
      redisRestToken,
      redisRestUrl: (env.UPSTASH_REDIS_REST_URL ?? env.KV_REST_API_URL ?? "").replace(
        /\/+$/,
        "",
      ),
      sseIntervalMs: env.DONATION_SSE_INTERVAL_MS,
      sseMaxDurationMs: env.DONATION_SSE_MAX_DURATION_MS,
    };
  });

export const getDonationEnvConfig = (env?: EnvSource) => {
  const result = donationEnvSchema.safeParse(getEnvSource(env));

  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
      .join("; ");

    throw new Error(`Invalid donation environment configuration: ${details}`);
  }

  return result.data;
};

export const getDonationEnv = (key: string, fallback = "", env?: EnvSource) =>
  getEnv(key, fallback, env);

export const getDonationSiteBaseUrl = (fallbackSiteUrl = "", env?: EnvSource) => {
  const publicSiteUrl = getDonationEnvConfig(env).publicSiteUrl;
  return publicSiteUrl || normalizeSiteUrl(fallbackSiteUrl);
};

const getPayPalNotifyUrl = (siteUrl: string) =>
  siteUrl ? new URL("/api/donations/paypal/ipn", siteUrl).toString() : "";

// Datos de cobro. Son PUBLIC_* porque se renderizan en el HTML estático
// del modal; no pongas secretos aquí.
export function buildDonationConfig(
  origin: string,
  env?: EnvSource,
): DonationConfig {
  const config = getDonationEnvConfig(env);
  const siteUrl = config.publicSiteUrl || normalizeSiteUrl(origin);

  return {
    paypalUrl: config.paypalDonateUrl,
    paypalNotifyUrl: getPayPalNotifyUrl(siteUrl),
    paypal: {
      env: config.donationEnv,
      hostedButtonId: config.paypalHostedButtonId,
      business: config.paypalBusiness,
    },
    amounts: [
      { value: 5, note: "Hidratación para quien lo necesita" },
      { value: 10, note: "Alimentación básica", popular: true },
      { value: 20, note: "Insumos médicos y primeros auxilios" },
      { value: 35, note: "Apoyo para zonas remotas" },
    ],
    pagoMovil: config.pagoMovil,
    binance: {
      payId: config.binancePayId,
      coin: config.binanceCoin,
    },
  };
}
