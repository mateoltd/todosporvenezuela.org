import { describe, expect, it, vi } from "vitest";
import {
  buildDonationConfig,
  getDonationCallbackBaseUrl,
  getDonationEnvConfig,
} from "./config";

vi.mock("astro:env/server", () => ({
  getSecret: () => undefined,
}));

describe("donation config", () => {
  it("uses the request origin for sandbox callbacks even with a production site URL", () => {
    const donation = buildDonationConfig("https://preview.example.workers.dev", {
      PUBLIC_DONATION_ENV: "sandbox",
      PUBLIC_SITE_URL: "https://todosporvenezuela.org",
    });

    expect(donation.paypalNotifyUrl).toBe(
      "https://preview.example.workers.dev/api/donations/paypal/ipn",
    );
  });

  it("keeps production callbacks on the canonical public site URL", () => {
    const donation = buildDonationConfig("https://preview.example.workers.dev", {
      PUBLIC_DONATION_ENV: "production",
      PUBLIC_SITE_URL: "https://todosporvenezuela.org",
    });

    expect(donation.paypalNotifyUrl).toBe(
      "https://todosporvenezuela.org/api/donations/paypal/ipn",
    );
  });

  it("keeps preview callbacks on the request origin even in production mode", () => {
    const donation = buildDonationConfig("https://preview.example.workers.dev", {
      DONATION_DEPLOYMENT_ENV: "preview",
      PUBLIC_DONATION_ENV: "production",
      PUBLIC_SITE_URL: "https://todosporvenezuela.org",
    });

    expect(donation.paypalNotifyUrl).toBe(
      "https://preview.example.workers.dev/api/donations/paypal/ipn",
    );
  });

  it("allows an explicit callback base URL override", () => {
    expect(
      getDonationCallbackBaseUrl("https://preview.example.workers.dev", {
        DONATION_CALLBACK_BASE_URL: "https://payments.example.org/callbacks",
        PUBLIC_DONATION_ENV: "sandbox",
        PUBLIC_SITE_URL: "https://todosporvenezuela.org",
      }),
    ).toBe("https://payments.example.org");
  });

  it("requires writes to be explicitly enabled", () => {
    expect(
      getDonationEnvConfig({ PUBLIC_DONATION_ENV: "production" })
        .donationWritesEnabled,
    ).toBe(false);
    expect(
      getDonationEnvConfig({ PUBLIC_DONATION_ENV: "sandbox" })
        .donationWritesEnabled,
    ).toBe(false);
    expect(
      getDonationEnvConfig({
        DONATION_DEPLOYMENT_ENV: "preview",
        PUBLIC_DONATION_ENV: "production",
      }).donationWritesEnabled,
    ).toBe(false);
    expect(
      getDonationEnvConfig({
        DONATION_ENABLE_WRITES: "true",
        PUBLIC_DONATION_ENV: "sandbox",
      }).donationWritesEnabled,
    ).toBe(true);
  });
});
