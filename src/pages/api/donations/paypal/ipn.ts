import type { APIRoute } from "astro";
import { donationJson, recordDonation } from "../../../../lib/donations/progress";
import { parsePayPalIpnDonation, verifyPayPalIpn } from "../../../../lib/donations/paypal";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rawBody = await request.text();

  if (!rawBody) {
    return donationJson({ ok: false, error: "empty_ipn_body" }, { status: 400 });
  }

  const verification = await verifyPayPalIpn(rawBody);

  if (!verification.verified) {
    return donationJson(
      { ok: false, error: "paypal_ipn_not_verified", paypal: verification.text },
      { status: 400 },
    );
  }

  const donation = parsePayPalIpnDonation(new URLSearchParams(rawBody));

  if ("reason" in donation) {
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
    console.error("PayPal IPN donation recording failed", error);
    return donationJson({ ok: false, error: "recording_failed" }, { status: 500 });
  }
};
