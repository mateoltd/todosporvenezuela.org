import { getPayPalNotifyUrl } from "./paypal";

export interface DonationAmount {
  value: number;
  note: string;
  popular?: boolean;
}

export interface DonationConfig {
  paypalUrl: string;
  paypalNotifyUrl: string;
  paypal: {
    env: "production" | "sandbox";
    hostedButtonId: string;
    business: string;
  };
  amounts: DonationAmount[];
  pagoMovil: {
    banco: string;
    telefono: string;
    documento: string;
    titular: string;
    contacto: string;
  };
  binance: { payId: string; coin: string };
}

// Datos de cobro. Son PUBLIC_* porque se renderizan en el HTML estático
// del modal; no pongas secretos aquí.
export function buildDonationConfig(
  env: Record<string, string | undefined>,
  origin: string,
): DonationConfig {
  const getEnv = (key: string, fallback = "") => env[key]?.trim() || fallback;

  const donationEnv: "production" | "sandbox" =
    getEnv("PUBLIC_DONATION_ENV", getEnv("PUBLIC_PAYPAL_ENV", "production")) ===
    "sandbox"
      ? "sandbox"
      : "production";

  const getModeEnv = (prefix: string, key: string, fallback = "") =>
    getEnv(
      `PUBLIC_${prefix}_${donationEnv.toUpperCase()}_${key}`,
      getEnv(`PUBLIC_${prefix}_${key}`, fallback),
    );

  const defaultPaypalUrl =
    donationEnv === "sandbox"
      ? "https://www.sandbox.paypal.com/donate"
      : "https://www.paypal.com/donate";

  const defaultPagoMovil = {
    banco: "Mercantil",
    telefono: "04123058665",
    documento: "32532287",
    titular: "",
    contacto: "+58 412 3058665",
  };

  return {
    paypalUrl: getModeEnv("PAYPAL", "DONATE_URL", defaultPaypalUrl),
    paypalNotifyUrl: getPayPalNotifyUrl(origin),
    paypal: {
      env: donationEnv,
      hostedButtonId: getModeEnv("PAYPAL", "HOSTED_BUTTON_ID"),
      business: getModeEnv("PAYPAL", "BUSINESS"),
    },
    amounts: [
      { value: 5, note: "Hidratación para quien lo necesita" },
      { value: 10, note: "Alimentación básica", popular: true },
      { value: 20, note: "Insumos médicos y primeros auxilios" },
      { value: 35, note: "Apoyo para zonas remotas" },
    ],
    pagoMovil: {
      banco: getEnv("PUBLIC_PAGO_MOVIL_BANCO", defaultPagoMovil.banco),
      telefono: getEnv("PUBLIC_PAGO_MOVIL_TELEFONO", defaultPagoMovil.telefono),
      documento: getEnv(
        "PUBLIC_PAGO_MOVIL_DOCUMENTO",
        defaultPagoMovil.documento,
      ),
      titular: getEnv("PUBLIC_PAGO_MOVIL_TITULAR", defaultPagoMovil.titular),
      contacto: getEnv(
        "PUBLIC_PAGO_MOVIL_CONTACTO",
        defaultPagoMovil.contacto,
      ),
    },
    binance: {
      payId: getEnv("PUBLIC_BINANCE_PAY_ID"),
      coin: getEnv("PUBLIC_BINANCE_COIN", "USDT").toUpperCase(),
    },
  };
}
