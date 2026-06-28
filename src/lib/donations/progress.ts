type DonationConfig = {
  baselineCents: number;
  currency: string;
  goalCents: number;
  keys: {
    recentEvents: string;
    total: string;
    updatedAt: string;
  };
  redisRestReadOnlyToken: string;
  redisRestToken: string;
  redisRestUrl: string;
};

export type DonationSnapshot = {
  currency: string;
  goal: number;
  goalCents: number;
  percent: number;
  raised: number;
  raisedCents: number;
  source: "baseline" | "redis" | "fallback";
  updatedAt: string | null;
};

type DonationRecordInput = {
  amountCents: number;
  currency: string;
  id: string;
  raw?: Record<string, unknown>;
  receivedAt?: string;
  source: string;
};

type UpstashResponse<T> = {
  error?: string;
  result?: T;
};

const env = import.meta.env as Record<string, string | undefined>;
const runtimeEnv =
  typeof process === "undefined"
    ? {}
    : (process.env as Record<string, string | undefined>);

export const getDonationEnv = (key: string, fallback = "") =>
  env[key]?.trim() || runtimeEnv[key]?.trim() || fallback;

const getFirstDonationEnv = (keys: string[], fallback = "") => {
  for (const key of keys) {
    const value = getDonationEnv(key);
    if (value) return value;
  }

  return fallback;
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

export const centsToAmount = (cents: number) => Number((cents / 100).toFixed(2));

const toPositiveCents = (value: string, fallback: string) => {
  const cents = parseAmountToCents(value || fallback);
  return cents > 0 ? cents : parseAmountToCents(fallback);
};

const cleanKeyPart = (value: string) =>
  value
    .trim()
    .replace(/[^\w:.-]+/g, "_")
    .slice(0, 180);

export const getDonationConfig = (): DonationConfig => {
  const prefix = getDonationEnv("DONATION_REDIS_PREFIX", "tpv:donations");
  const currency = getDonationEnv(
    "DONATION_CURRENCY",
    getDonationEnv("PUBLIC_DONATION_CURRENCY", "USD"),
  ).toUpperCase();

  return {
    baselineCents: toPositiveCents(
      getDonationEnv(
        "DONATION_BASELINE_RAISED_USD",
        getDonationEnv("PUBLIC_DONATION_INITIAL_RAISED_USD"),
      ),
      "100",
    ),
    currency,
    goalCents: toPositiveCents(
      getDonationEnv("DONATION_GOAL_USD", getDonationEnv("PUBLIC_DONATION_GOAL_USD")),
      "800",
    ),
    keys: {
      recentEvents: `${prefix}:events:recent`,
      total: `${prefix}:raised_cents`,
      updatedAt: `${prefix}:updated_at`,
    },
    redisRestReadOnlyToken: getFirstDonationEnv([
      "UPSTASH_REDIS_REST_READ_ONLY_TOKEN",
      "KV_REST_API_READ_ONLY_TOKEN",
      "UPSTASH_REDIS_REST_TOKEN",
      "KV_REST_API_TOKEN",
    ]),
    redisRestToken: getFirstDonationEnv(["UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_TOKEN"]),
    redisRestUrl: getFirstDonationEnv(["UPSTASH_REDIS_REST_URL", "KV_REST_API_URL"]).replace(
      /\/+$/,
      "",
    ),
  };
};

export const hasRedisConfig = (config = getDonationConfig()) =>
  Boolean(config.redisRestUrl && config.redisRestToken);

export const hasRedisReadConfig = (config = getDonationConfig()) =>
  Boolean(config.redisRestUrl && (config.redisRestReadOnlyToken || config.redisRestToken));

const buildSnapshot = (
  config: DonationConfig,
  redisRaisedCents: number,
  source: DonationSnapshot["source"],
  updatedAt: string | null,
): DonationSnapshot => {
  const raisedCents = config.baselineCents + Math.max(0, redisRaisedCents);
  const percent =
    config.goalCents > 0
      ? Math.max(0, Math.min(100, Math.round((raisedCents / config.goalCents) * 100)))
      : 0;

  return {
    currency: config.currency,
    goal: centsToAmount(config.goalCents),
    goalCents: config.goalCents,
    percent,
    raised: centsToAmount(raisedCents),
    raisedCents,
    source,
    updatedAt,
  };
};

const redisCommand = async <T>(
  config: DonationConfig,
  command: unknown[],
  options: { readOnly?: boolean } = {},
): Promise<T> => {
  const token = options.readOnly
    ? config.redisRestReadOnlyToken || config.redisRestToken
    : config.redisRestToken;

  if (!config.redisRestUrl || !token) {
    throw new Error("Missing Redis REST URL or token");
  }

  const response = await fetch(config.redisRestUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  const data = (await response.json().catch(() => ({}))) as UpstashResponse<T>;

  if (!response.ok || data.error) {
    throw new Error(data.error || `Upstash Redis request failed with ${response.status}`);
  }

  return data.result as T;
};

export const getDonationSnapshot = async (): Promise<DonationSnapshot> => {
  const config = getDonationConfig();

  if (!hasRedisReadConfig(config)) {
    return buildSnapshot(config, 0, "baseline", null);
  }

  try {
    const [redisRaised, updatedAt] = await redisCommand<[string | null, string | null]>(
      config,
      ["MGET", config.keys.total, config.keys.updatedAt],
      { readOnly: true },
    );
    const redisRaisedCents = Number.parseInt(redisRaised ?? "0", 10);

    return buildSnapshot(
      config,
      Number.isFinite(redisRaisedCents) ? redisRaisedCents : 0,
      "redis",
      updatedAt,
    );
  } catch (error) {
    console.error("Donation progress read failed", error);
    return buildSnapshot(config, 0, "fallback", null);
  }
};

export const recordDonation = async (input: DonationRecordInput) => {
  const config = getDonationConfig();

  if (!hasRedisConfig(config)) {
    throw new Error("Donation progress storage is not configured");
  }

  if (input.currency.toUpperCase() !== config.currency) {
    throw new Error(`Expected ${config.currency}, received ${input.currency}`);
  }

  if (!input.id.trim()) {
    throw new Error("Donation event id is required");
  }

  if (input.amountCents <= 0) {
    throw new Error("Donation amount must be greater than zero");
  }

  const receivedAt = input.receivedAt || new Date().toISOString();
  const eventKey = `${getDonationEnv("DONATION_REDIS_PREFIX", "tpv:donations")}:event:${cleanKeyPart(
    input.id,
  )}`;
  const payload = JSON.stringify({
    amountCents: input.amountCents,
    currency: input.currency.toUpperCase(),
    id: input.id,
    raw: input.raw ?? null,
    receivedAt,
    source: input.source,
  });

  const script = `
local inserted = redis.call("SET", KEYS[1], ARGV[1], "NX")
if inserted then
  local total = redis.call("INCRBY", KEYS[2], ARGV[2])
  redis.call("SET", KEYS[3], ARGV[3])
  redis.call("LPUSH", KEYS[4], ARGV[1])
  redis.call("LTRIM", KEYS[4], 0, 99)
  return {1, total}
end
return {0, redis.call("GET", KEYS[2]) or "0"}
`.trim();

  const result = await redisCommand<[number, number | string]>(config, [
    "EVAL",
    script,
    4,
    eventKey,
    config.keys.total,
    config.keys.updatedAt,
    config.keys.recentEvents,
    payload,
    input.amountCents,
    receivedAt,
  ]);
  const inserted = Number(result[0]) === 1;
  const redisRaisedCents = Number.parseInt(String(result[1] ?? "0"), 10);

  return {
    inserted,
    snapshot: buildSnapshot(
      config,
      Number.isFinite(redisRaisedCents) ? redisRaisedCents : 0,
      "redis",
      receivedAt,
    ),
  };
};

export const donationJson = (body: unknown, init?: ResponseInit) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "Content-Type": "application/json",
      "CDN-Cache-Control": "no-store",
      "Surrogate-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
