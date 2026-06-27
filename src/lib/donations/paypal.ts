import {
  getDonationConfig,
  getDonationEnv,
  parseAmountToCents,
} from "./progress";

type ParsedIpn =
  | {
      amountCents: number;
      currency: string;
      id: string;
      raw: Record<string, string>;
      source: "paypal-ipn";
    }
  | {
      reason: string;
      raw: Record<string, string>;
    };

const csv = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

export const getPayPalItemName = () =>
  getDonationEnv(
    "DONATION_PAYPAL_ITEM_NAME",
    "Ayuda para insumos médicos, alimentación e hidratación en Venezuela.",
  );

export const getPayPalItemNumber = () =>
  getDonationEnv("DONATION_PAYPAL_ITEM_NUMBER", "donacion-terremoto");

export const getPayPalNotifyUrl = (fallbackSiteUrl = "") => {
  const siteUrl = getDonationEnv("PUBLIC_SITE_URL", fallbackSiteUrl).replace(/\/+$/, "");
  return siteUrl ? new URL("/api/donations/paypal/ipn", siteUrl).toString() : "";
};

export const getPayPalIpnVerifyUrl = () => {
  const override = getDonationEnv("PAYPAL_IPN_VERIFY_URL");
  if (override) return override;

  return getDonationEnv("PUBLIC_DONATION_ENV", "production") === "sandbox"
    ? "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr"
    : "https://ipnpb.paypal.com/cgi-bin/webscr";
};

export const verifyPayPalIpn = async (rawBody: string) => {
  const response = await fetch(getPayPalIpnVerifyUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "todosporvenezuela.org PayPal IPN listener",
    },
    body: `cmd=_notify-validate&${rawBody}`,
  });
  const text = (await response.text()).trim();

  return {
    text,
    verified: response.ok && text === "VERIFIED",
  };
};

const paramsToRecord = (params: URLSearchParams) =>
  Array.from(params.entries()).reduce<Record<string, string>>((record, [key, value]) => {
    record[key] = value;
    return record;
  }, {});

const receiverIsAllowed = (raw: Record<string, string>) => {
  const allowedEmails = csv(getDonationEnv("PAYPAL_RECEIVER_EMAILS"));
  const allowedIds = csv(getDonationEnv("PAYPAL_RECEIVER_IDS"));

  if (!allowedEmails.length && !allowedIds.length) return true;

  const receiverEmail = (raw.receiver_email || raw.business || "").toLowerCase();
  const receiverId = (raw.receiver_id || "").toLowerCase();

  return (
    (receiverEmail && allowedEmails.includes(receiverEmail)) ||
    (receiverId && allowedIds.includes(receiverId))
  );
};

export const parsePayPalIpnDonation = (params: URLSearchParams): ParsedIpn => {
  const config = getDonationConfig();
  const raw = paramsToRecord(params);
  const status = raw.payment_status || "";
  const currency = (raw.mc_currency || "").toUpperCase();
  const itemNumber = raw.item_number || "";
  const txnId = raw.txn_id || raw.ipn_track_id || "";
  const amountCents = parseAmountToCents(raw.mc_gross);

  if (status !== "Completed") {
    return { reason: `ignored_payment_status:${status || "missing"}`, raw };
  }

  if (currency !== config.currency) {
    return { reason: `ignored_currency:${currency || "missing"}`, raw };
  }

  if (itemNumber && itemNumber !== getPayPalItemNumber()) {
    return { reason: "ignored_item_number", raw };
  }

  if (!receiverIsAllowed(raw)) {
    return { reason: "ignored_receiver", raw };
  }

  if (!txnId) {
    return { reason: "missing_transaction_id", raw };
  }

  if (amountCents <= 0) {
    return { reason: "invalid_amount", raw };
  }

  return {
    amountCents,
    currency,
    id: `paypal:${txnId}`,
    raw,
    source: "paypal-ipn",
  };
};
