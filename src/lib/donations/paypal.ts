import {
  getDonationEnvConfig,
  getDonationSiteBaseUrl,
  parseAmountToCents,
} from "./config";

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

export const getPayPalItemName = () => getDonationEnvConfig().paypalItemName;

export const getPayPalItemNumber = () => getDonationEnvConfig().paypalItemNumber;

export const getPayPalNotifyUrl = (fallbackSiteUrl = "") => {
  const siteUrl = getDonationSiteBaseUrl(fallbackSiteUrl);
  return siteUrl ? new URL("/api/donations/paypal/ipn", siteUrl).toString() : "";
};

export const getPayPalIpnVerifyUrl = () => {
  return getDonationEnvConfig().paypalIpnVerifyUrl;
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
  const { paypalReceiverEmails: allowedEmails, paypalReceiverIds: allowedIds } =
    getDonationEnvConfig();

  if (!allowedEmails.length && !allowedIds.length) return true;

  const receiverEmail = (raw.receiver_email || raw.business || "").toLowerCase();
  const receiverId = (raw.receiver_id || "").toLowerCase();

  return (
    (receiverEmail && allowedEmails.includes(receiverEmail)) ||
    (receiverId && allowedIds.includes(receiverId))
  );
};

export const parsePayPalIpnDonation = (params: URLSearchParams): ParsedIpn => {
  const config = getDonationEnvConfig();
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
