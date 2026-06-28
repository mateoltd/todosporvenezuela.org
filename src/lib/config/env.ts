import { getSecret } from "astro:env/server";
import { z } from "zod";

export type EnvSource = Record<string, string | undefined>;

export const getEnvSource = (env: EnvSource = {}) =>
  new Proxy<Record<string, unknown>>(
    {},
    {
      get(_, property) {
        if (typeof property !== "string") return undefined;
        if (Object.hasOwn(env, property)) return env[property];

        return getSecret(property);
      },
    },
  );

export const cleanEnvString = (value: unknown) => {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed || undefined;
};

export const optionalEnvString = z.preprocess(
  cleanEnvString,
  z.string().optional(),
);

export const envString = (fallback = "") =>
  optionalEnvString.transform((value) => value ?? fallback);

export const optionalEnvUrl = optionalEnvString.pipe(z.url().optional());

export const positiveIntegerEnv = (fallback: number) =>
  z
    .preprocess((value) => {
      const raw = cleanEnvString(value);
      if (!raw) return fallback;

      const parsed = Number(raw);

      return Number.isFinite(parsed) ? parsed : raw;
    }, z.number().int().positive());

export const getEnv = (key: string, fallback = "", env?: EnvSource) =>
  envString(fallback).parse(getEnvSource(env)[key]);

export const getFirstEnv = (
  keys: string[],
  fallback = "",
  env?: EnvSource,
) => {
  const source = getEnvSource(env);

  for (const key of keys) {
    const value = envString().parse(source[key]);
    if (value) return value;
  }

  return fallback;
};

export const normalizeSiteUrl = (value: string, fallback = "") => {
  const normalize = (candidate: string) => {
    const trimmed = candidate.trim();
    if (!trimmed) return "";

    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    try {
      return new URL(withProtocol).origin;
    } catch {
      return "";
    }
  };

  return normalize(value) || normalize(fallback);
};

export const getConfiguredSiteBaseUrl = (fallback = "", env?: EnvSource) =>
  normalizeSiteUrl(getEnv("PUBLIC_SITE_URL", fallback, env), fallback);
