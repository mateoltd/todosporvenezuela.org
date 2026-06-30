import type { APIRoute } from "astro";
import {
  getDonationAdminChallengeHeaders,
  getDonationAdminHeaders,
  requireDonationAdminApiAuth,
} from "../../../../lib/donations/adminAuth";
import { getDonationEnvConfig } from "../../../../lib/donations/config";
import {
  donationJson,
  isDonationWritesDisabledError,
  recordDonation,
} from "../../../../lib/donations/progress";

export const prerender = false;

type AdjustmentBody = {
  amount?: number | string;
  currency?: string;
  note?: string;
  reference?: string;
  source?: string;
};

const parseAdminAmountToCents = (value: AdjustmentBody["amount"]) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? Math.round(value * 100) : 0;
  }

  const normalized = String(value ?? "")
    .trim()
    .replace(/[$,\s]/g, "");

  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return 0;
  }

  return Math.round(Number(normalized) * 100);
};

const normalizeSource = (value: unknown) =>
  String(value || "manual")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);

export const POST: APIRoute = async ({ request }) => {
  const config = getDonationEnvConfig();
  const auth = requireDonationAdminApiAuth(request);

  if (!auth.ok) {
    const shouldChallenge = auth.status === 401 && !request.headers.has("origin");

    return donationJson(
      { ok: false, error: auth.error },
      {
        status: auth.status,
        headers: shouldChallenge
          ? getDonationAdminChallengeHeaders()
          : getDonationAdminHeaders(),
      },
    );
  }

  const body = (await request.json().catch(() => null)) as AdjustmentBody | null;
  const amountCents = parseAdminAmountToCents(body?.amount);
  const source = normalizeSource(body?.source);
  const reference = String(body?.reference || "").trim();
  const note = String(body?.note || "").trim();
  const currency = String(body?.currency || config.currency).toUpperCase();

  if (!body || amountCents <= 0) {
    return donationJson({ ok: false, error: "invalid_amount" }, { status: 400 });
  }

  if (!reference) {
    return donationJson({ ok: false, error: "reference_required" }, { status: 400 });
  }

  if (!source) {
    return donationJson({ ok: false, error: "invalid_source" }, { status: 400 });
  }

  if (reference.length > 140) {
    return donationJson({ ok: false, error: "reference_too_long" }, { status: 400 });
  }

  if (note.length > 240) {
    return donationJson({ ok: false, error: "note_too_long" }, { status: 400 });
  }

  if (amountCents > config.adminMaxTopUpCents) {
    return donationJson({ ok: false, error: "amount_too_large" }, { status: 400 });
  }

  try {
    const result = await recordDonation({
      amountCents,
      currency,
      id: `admin:${source}:${reference}`,
      raw: { note: note || null, reference },
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
    if (isDonationWritesDisabledError(error)) {
      return donationJson(
        { ok: false, error: "donation_writes_disabled" },
        { status: 403 },
      );
    }

    console.error("Donation admin adjustment failed", error);
    return donationJson({ ok: false, error: "recording_failed" }, { status: 500 });
  }
};
