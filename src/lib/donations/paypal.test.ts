import { beforeEach, describe, expect, it, vi } from "vitest";
import { parsePayPalIpnDonation } from "./paypal";

const secrets = vi.hoisted(() => ({} as Record<string, string | undefined>));

vi.mock("astro:env/server", () => ({
  getSecret: (key: string) => secrets[key],
}));

const validIpn = (overrides: Record<string, string> = {}) =>
  new URLSearchParams({
    item_number: "donacion-terremoto",
    mc_currency: "USD",
    mc_gross: "25.00",
    payment_status: "Completed",
    receiver_id: "PEKSL9K9FH5VC",
    txn_id: "txn-123",
    ...overrides,
  });

describe("PayPal IPN donation parsing", () => {
  beforeEach(() => {
    for (const key of Object.keys(secrets)) delete secrets[key];
    secrets.PUBLIC_PAYPAL_PRODUCTION_BUSINESS = "PEKSL9K9FH5VC";
  });

  it("uses the configured PayPal business id as the default receiver allowlist", () => {
    const donation = parsePayPalIpnDonation(validIpn());

    expect("reason" in donation).toBe(false);
  });

  it("ignores IPNs for a different receiver", () => {
    const donation = parsePayPalIpnDonation(
      validIpn({ receiver_id: "OTHERRECEIVER", business: "other@example.com" }),
    );

    expect(donation).toMatchObject({ reason: "ignored_receiver" });
  });
});
