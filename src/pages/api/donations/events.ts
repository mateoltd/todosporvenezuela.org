import type { APIRoute } from "astro";
import { getDonationEnv, getDonationSnapshot } from "../../../lib/donations/progress";

export const prerender = false;

const encoder = new TextEncoder();

const toPositiveNumber = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const encodeEvent = (event: string, data: unknown) =>
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

export const GET: APIRoute = () => {
  const intervalMs = toPositiveNumber(getDonationEnv("DONATION_SSE_INTERVAL_MS"), 3000);
  const maxDurationMs = toPositiveNumber(getDonationEnv("DONATION_SSE_MAX_DURATION_MS"), 25000);
  let closed = false;
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let lastPayload = "";

      const close = () => {
        if (closed) return;
        closed = true;
        if (intervalId) clearInterval(intervalId);
        if (timeoutId) clearTimeout(timeoutId);
        controller.close();
      };

      const sendSnapshot = async () => {
        try {
          const snapshot = await getDonationSnapshot();
          const payload = JSON.stringify(snapshot);

          if (payload !== lastPayload) {
            lastPayload = payload;
            controller.enqueue(encodeEvent("progress", snapshot));
          } else {
            controller.enqueue(encoder.encode(": heartbeat\n\n"));
          }
        } catch (error) {
          console.error("Donation progress SSE read failed", error);
          controller.enqueue(encodeEvent("error", { ok: false }));
        }
      };

      void sendSnapshot();
      intervalId = setInterval(() => void sendSnapshot(), intervalMs);
      timeoutId = setTimeout(close, maxDurationMs);
    },
    cancel() {
      closed = true;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-store, no-cache, max-age=0, must-revalidate",
      "CDN-Cache-Control": "no-store",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
      "Surrogate-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
};
