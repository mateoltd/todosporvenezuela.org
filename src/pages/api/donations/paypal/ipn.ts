import type { APIRoute } from "astro";
import {
  donationJson,
  isDonationWritesDisabledError,
  recordDonation,
} from "../../../../lib/donations/progress";
import { parsePayPalIpnDonation, verifyPayPalIpn } from "../../../../lib/donations/paypal";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();

  if (!rawBody) {
    return donationJson({ ok: false, error: "empty_ipn_body" }, { status: 400 });
  }

  const verification = await verifyPayPalIpn(rawBody);

  if (!verification.verified) {
    console.warn("PayPal IPN verification failed");
    return donationJson(
      { ok: false, error: "paypal_ipn_not_verified", paypal: verification.text },
      { status: 400 },
    );
  }

  const donation = parsePayPalIpnDonation(new URLSearchParams(rawBody));

  if ("reason" in donation) {
    console.info("PayPal IPN ignored", { reason: donation.reason });
    return donationJson({ ok: true, ignored: true, reason: donation.reason });
  }

  try {
    const result = await recordDonation(donation);

    return donationJson({
      ok: true,
      inserted: result.inserted,
      progress: result.snapshot,
    });
  } catch (error) {
    if (isDonationWritesDisabledError(error)) {
      console.info("PayPal IPN ignored", { reason: "donation_writes_disabled" });
      return donationJson({
        ok: true,
        ignored: true,
        reason: "donation_writes_disabled",
      });
    }

    console.error("PayPal IPN donation recording failed", error);
    return donationJson({ ok: false, error: "recording_failed" }, { status: 500 });
  }
};
