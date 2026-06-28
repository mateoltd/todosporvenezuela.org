import { createHmac, randomBytes } from "node:crypto";
import { getDonationEnvConfig } from "./config";

type AdminAuth =
  | { ok: true; method: "basic" | "bearer" | "session" }
  | { ok: false; error: string; status: 401 | 403 | 404 | 415 | 503 };

const ADMIN_REALM = "Todos por Venezuela donations";
const ADMIN_CSRF_TTL_MS = 15 * 60 * 1000;
const ADMIN_SESSION_COOKIE = "tpv_donation_admin";
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const decoder = new TextDecoder();
const encoder = new TextEncoder();

const noStoreHeaders = {
  "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
  "CDN-Cache-Control": "no-store",
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'none'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=(), payment=()",
  "Referrer-Policy": "no-referrer",
  "Surrogate-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const;

export const getDonationAdminHeaders = (headers: HeadersInit = {}) => ({
  ...noStoreHeaders,
  ...headers,
});

export const getDonationAdminChallengeHeaders = () =>
  getDonationAdminHeaders({
    "WWW-Authenticate": `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
  });

const constantTimeEqual = (actual: string, expected: string) => {
  const actualBytes = encoder.encode(actual);
  const expectedBytes = encoder.encode(expected);
  const length = Math.max(actualBytes.length, expectedBytes.length);
  let diff = actualBytes.length ^ expectedBytes.length;

  for (let index = 0; index < length; index += 1) {
    diff |= (actualBytes[index] ?? 0) ^ (expectedBytes[index] ?? 0);
  }

  return diff === 0;
};

const decodeBase64 = (value: string) => {
  try {
    return decoder.decode(
      Uint8Array.from(atob(value), (character) => character.charCodeAt(0)),
    );
  } catch {
    return "";
  }
};

const getBasicCredentials = (request: Request) => {
  const authorization = request.headers.get("authorization") || "";
  const [, encoded] = authorization.match(/^Basic\s+(.+)$/i) ?? [];
  const decoded = encoded ? decodeBase64(encoded) : "";
  const separatorIndex = decoded.indexOf(":");

  if (separatorIndex < 0) {
    return { username: "", password: "" };
  }

  return {
    username: decoded.slice(0, separatorIndex),
    password: decoded.slice(separatorIndex + 1),
  };
};

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization") || "";
  const [, token] = authorization.match(/^Bearer\s+(.+)$/i) ?? [];
  return token || request.headers.get("x-donation-admin-token") || "";
};

const getAdminUsername = () => getDonationEnvConfig().adminUsername;
const getAdminPassword = () => getDonationEnvConfig().adminPassword;
const getAdminToken = () => getDonationEnvConfig().adminToken;

const hasBasicAdminCredentials = () => Boolean(getAdminUsername() && getAdminPassword());

const requestHostIsLocal = (url: URL) =>
  url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";

const firstHeaderValue = (value: string | null) => value?.split(",")[0]?.trim().toLowerCase() || "";

const isSecureAdminRequest = (request: Request) => {
  const url = new URL(request.url);
  const forwardedProto = firstHeaderValue(request.headers.get("x-forwarded-proto"));

  return requestHostIsLocal(url) || url.protocol === "https:" || forwardedProto === "https";
};

const normalizedOrigin = (value: string) => {
  try {
    return new URL(value).origin;
  } catch {
    return "";
  }
};

const getAllowedOrigins = (request: Request) => {
  const requestUrl = new URL(request.url);
  const origins = new Set([requestUrl.origin]);
  const publicSiteUrl = getDonationEnvConfig().publicSiteUrl;
  const forwardedHost =
    firstHeaderValue(request.headers.get("x-forwarded-host")) ||
    firstHeaderValue(request.headers.get("host"));
  const forwardedProto = firstHeaderValue(request.headers.get("x-forwarded-proto")) || requestUrl.protocol.replace(":", "");

  if (publicSiteUrl) {
    origins.add(normalizedOrigin(publicSiteUrl));
  }

  if (forwardedHost) {
    origins.add(`${forwardedProto}://${forwardedHost}`);
  }

  return Array.from(origins).filter(Boolean);
};

const isSameOriginRequest = (request: Request) => {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const normalized = normalizedOrigin(origin);
  return Boolean(normalized && getAllowedOrigins(request).includes(normalized));
};

const hasJsonContentType = (request: Request) =>
  request.headers.get("content-type")?.toLowerCase().includes("application/json") ?? false;

const safeDecodeURIComponent = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return "";
  }
};

const parseCookies = (request: Request) =>
  Object.fromEntries(
    (request.headers.get("cookie") || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf("=");
        const name = separatorIndex >= 0 ? part.slice(0, separatorIndex) : part;
        const value = separatorIndex >= 0 ? part.slice(separatorIndex + 1) : "";
        return [name, safeDecodeURIComponent(value)];
      }),
  );

const serializeCookie = (
  name: string,
  value: string,
  request: Request,
  options: { maxAge: number },
) => {
  const cookie = [
    `${name}=${encodeURIComponent(value)}`,
    "HttpOnly",
    `Max-Age=${Math.max(0, Math.floor(options.maxAge))}`,
    "Path=/",
    "SameSite=Strict",
  ];

  if (isSecureAdminRequest(request) && !requestHostIsLocal(new URL(request.url))) {
    cookie.push("Secure");
  }

  return cookie.join("; ");
};

const getCsrfSecret = () => {
  const username = getAdminUsername();
  const password = getAdminPassword();
  const token = getAdminToken();
  return `${username}:${password}:${token}`;
};

const signCsrfToken = (issuedAt: string) =>
  createHmac("sha256", getCsrfSecret())
    .update(`donation-admin-top-up:${issuedAt}`)
    .digest("base64url");

export const createDonationAdminCsrfToken = () => {
  const issuedAt = Date.now().toString(36);
  return `${issuedAt}.${signCsrfToken(issuedAt)}`;
};

const validateDonationAdminCsrfToken = (request: Request) => {
  const token = request.headers.get("x-donation-admin-csrf") || "";
  const [issuedAt, signature] = token.split(".");
  const issuedAtMs = Number.parseInt(issuedAt || "", 36);
  const ageMs = Date.now() - issuedAtMs;

  if (!issuedAt || !signature || !Number.isFinite(issuedAtMs)) return false;
  if (ageMs < -60_000 || ageMs > ADMIN_CSRF_TTL_MS) return false;

  return constantTimeEqual(signature, signCsrfToken(issuedAt));
};

const signSessionToken = (issuedAt: string, nonce: string) =>
  createHmac("sha256", getCsrfSecret())
    .update(`donation-admin-session:${issuedAt}:${nonce}`)
    .digest("base64url");

const validateDonationAdminSession = (request: Request) => {
  if (!hasBasicAdminCredentials()) return false;

  const token = parseCookies(request)[ADMIN_SESSION_COOKIE] || "";
  const [issuedAt, nonce, signature] = token.split(".");
  const issuedAtMs = Number.parseInt(issuedAt || "", 36);
  const ageMs = Date.now() - issuedAtMs;

  if (!issuedAt || !nonce || !signature || !Number.isFinite(issuedAtMs)) return false;
  if (ageMs < -60_000 || ageMs > ADMIN_SESSION_TTL_MS) return false;

  return constantTimeEqual(signature, signSessionToken(issuedAt, nonce));
};

export const createDonationAdminSessionCookie = (request: Request) => {
  const issuedAt = Date.now().toString(36);
  const nonce = randomBytes(18).toString("base64url");
  const value = `${issuedAt}.${nonce}.${signSessionToken(issuedAt, nonce)}`;

  return serializeCookie(ADMIN_SESSION_COOKIE, value, request, {
    maxAge: ADMIN_SESSION_TTL_MS / 1000,
  });
};

export const createDonationAdminLogoutCookie = (request: Request) =>
  serializeCookie(ADMIN_SESSION_COOKIE, "", request, { maxAge: 0 });

export const verifyDonationAdminCredentials = (username: string, password: string) =>
  hasBasicAdminCredentials() &&
  constantTimeEqual(username, getAdminUsername()) &&
  constantTimeEqual(password, getAdminPassword());

export const requireDonationAdminLoginRequest = (request: Request): AdminAuth => {
  if (!hasBasicAdminCredentials()) {
    return { ok: false, error: "admin_page_not_configured", status: 404 };
  }

  if (!isSecureAdminRequest(request)) {
    return { ok: false, error: "https_required", status: 403 };
  }

  if (!hasJsonContentType(request)) {
    return { ok: false, error: "json_required", status: 415 };
  }

  if (!isSameOriginRequest(request)) {
    return { ok: false, error: "invalid_origin", status: 403 };
  }

  return { ok: true, method: "session" };
};

export const requireDonationAdminPageAuth = (request: Request): AdminAuth => {
  if (!hasBasicAdminCredentials()) {
    return { ok: false, error: "admin_page_not_configured", status: 404 };
  }

  if (!isSecureAdminRequest(request)) {
    return { ok: false, error: "https_required", status: 403 };
  }

  if (validateDonationAdminSession(request)) {
    return { ok: true, method: "session" };
  }

  const expectedUsername = getAdminUsername();
  const expectedPassword = getAdminPassword();
  const credentials = getBasicCredentials(request);
  const valid =
    constantTimeEqual(credentials.username, expectedUsername) &&
    constantTimeEqual(credentials.password, expectedPassword);

  if (!valid) {
    return { ok: false, error: "unauthorized", status: 401 };
  }

  return { ok: true, method: "basic" };
};

const requireDonationAdminCredentials = (request: Request): AdminAuth => {
  const adminToken = getAdminToken();
  const bearerToken = getBearerToken(request);

  if (adminToken && bearerToken && constantTimeEqual(bearerToken, adminToken)) {
    return { ok: true, method: "bearer" };
  }

  if (validateDonationAdminSession(request)) {
    return { ok: true, method: "session" };
  }

  if (hasBasicAdminCredentials()) {
    const expectedUsername = getAdminUsername();
    const expectedPassword = getAdminPassword();
    const credentials = getBasicCredentials(request);
    const valid =
      constantTimeEqual(credentials.username, expectedUsername) &&
      constantTimeEqual(credentials.password, expectedPassword);

    if (valid) {
      return { ok: true, method: "basic" };
    }
  }

  if (!adminToken && !hasBasicAdminCredentials()) {
    return { ok: false, error: "admin_adjustment_not_configured", status: 503 };
  }

  return { ok: false, error: "unauthorized", status: 401 };
};

export const requireDonationAdminApiAuth = (request: Request): AdminAuth => {
  if (!isSecureAdminRequest(request)) {
    return { ok: false, error: "https_required", status: 403 };
  }

  const credentials = requireDonationAdminCredentials(request);

  if (!credentials.ok) {
    return credentials;
  }

  if (!hasJsonContentType(request)) {
    return { ok: false, error: "json_required", status: 415 };
  }

  if (!isSameOriginRequest(request)) {
    return { ok: false, error: "invalid_origin", status: 403 };
  }

  if (
    request.headers.has("origin") &&
    credentials.method !== "bearer" &&
    !validateDonationAdminCsrfToken(request)
  ) {
    return { ok: false, error: "csrf_required", status: 403 };
  }

  return credentials;
};
