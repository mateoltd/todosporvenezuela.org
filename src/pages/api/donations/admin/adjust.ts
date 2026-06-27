import type { APIRoute } from "astro";
import {
  donationJson,
  getDonationEnv,
  parseAmountToCents,
  recordDonation,
} from "../../../../lib/donations/progress";

export const prerender = false;

type AdjustmentBody = {
  amount?: number | string;
  currency?: string;
  reference?: string;
  source?: string;
};

const getBearerToken = (request: Request) => {
  const authorization = request.headers.get("authorization") || "";
  const [, token] = authorization.match(/^Bearer\s+(.+)$/i) ?? [];
  return token || request.headers.get("x-donation-admin-token") || "";
};

export const POST: APIRoute = async ({ request }) => {
  const adminToken = getDonationEnv("DONATION_ADMIN_TOKEN");

  if (!adminToken) {
    return donationJson({ ok: false, error: "admin_adjustment_not_configured" }, { status: 503 });
  }

  if (getBearerToken(request) !== adminToken) {
    return donationJson({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as AdjustmentBody | null;
  const amountCents = parseAmountToCents(body?.amount);
  const source = String(body?.source || "manual").trim().toLowerCase();
  const reference = String(body?.reference || "").trim();
  const currency = String(body?.currency || getDonationEnv("DONATION_CURRENCY", "USD")).toUpperCase();

  if (!body || amountCents <= 0) {
    return donationJson({ ok: false, error: "invalid_amount" }, { status: 400 });
  }

  if (!reference) {
    return donationJson({ ok: false, error: "reference_required" }, { status: 400 });
  }

  try {
    const result = await recordDonation({
      amountCents,
      currency,
      id: `admin:${source}:${reference}`,
      raw: { reference },
      source: `admin:${source}`,
    });

    return donationJson(
      {
        ok: true,
        inserted: result.inserted,
        progress: result.snapshot,
      },
      { status: result.inserted ? 201 : 200 },
    );
  } catch (error) {
    console.error("Donation admin adjustment failed", error);
    return donationJson({ ok: false, error: "recording_failed" }, { status: 500 });
  }
};
