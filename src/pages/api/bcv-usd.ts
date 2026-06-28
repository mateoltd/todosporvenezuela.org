import type { APIRoute } from "astro";

const OFFICIAL_USD_RATE_URL = "https://finanzasdigital.com/category/tasa-bcv/feed/";

type BcvUsdRate = {
  currency: "USD";
  rate: number;
  rateText: string;
  valueDate: string | null;
  source: "FinanzasDigital";
  sourceName: string;
  sourceUrl: string;
  fetchedAt: string;
};

const spanishMonths: Record<string, string> = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "public, max-age=900, s-maxage=900, stale-while-revalidate=3600",
};

const errorHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const decodeXmlText = (value: string) =>
  value
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#039;", "'")
    .replaceAll("&apos;", "'");

const firstMatch = (value: string, pattern: RegExp) =>
  decodeXmlText(value.match(pattern)?.[1]?.trim() ?? "");

const parseBcvNumber = (value: string) => {
  const parsed = Number(value.trim().replace(/\./g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parseSpanishDate = (value: string) => {
  const match = value
    .toLowerCase()
    .match(/(\d{1,2})\s+de\s+([a-z]+)\s+de\s+(\d{4})/i);

  if (!match) return null;

  const [, day, monthName, year] = match;
  const month = spanishMonths[monthName];
  if (!month) return null;

  return `${year}-${month}-${day.padStart(2, "0")}T00:00:00-04:00`;
};

const formatRateText = (value: number) =>
  new Intl.NumberFormat("es-VE", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  }).format(value);

const fetchOfficialUsdRate = async (): Promise<Omit<BcvUsdRate, "fetchedAt">> => {
  const response = await fetch(OFFICIAL_USD_RATE_URL, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml" },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Finanzas Digital responded with status ${response.status}`);
  }

  const rss = await response.text();
  const latestItem = rss.match(/<item\b[\s\S]*?<\/item>/i)?.[0] ?? "";
  const title = firstMatch(latestItem, /<title>([\s\S]*?)<\/title>/i);
  const sourceUrl = firstMatch(latestItem, /<link>([\s\S]*?)<\/link>/i) || OFFICIAL_USD_RATE_URL;

  const rateMatch = title.match(/:\s*([\d.,]+)\s*Bs\/USD/i);
  const rate = rateMatch ? parseBcvNumber(rateMatch[1]) : null;
  const valueDate = parseSpanishDate(title);

  if (!rate || !valueDate) {
    throw new Error("Could not parse mirrored BCV USD rate");
  }

  return {
    currency: "USD",
    rate,
    rateText: formatRateText(rate),
    valueDate,
    source: "FinanzasDigital",
    sourceName: "Reporte Diario Tasa BCV",
    sourceUrl,
  };
};

export const GET: APIRoute = async () => {
  try {
    const bcvRate: BcvUsdRate = {
      ...(await fetchOfficialUsdRate()),
      fetchedAt: new Date().toISOString(),
    };

    return new Response(JSON.stringify(bcvRate), { headers: jsonHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "No se pudo consultar la tasa oficial del BCV.",
        detail: error instanceof Error ? error.message : "Unknown error",
      }),
      { headers: errorHeaders, status: 502 },
    );
  }
};
