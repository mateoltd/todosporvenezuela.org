import type { APIRoute } from "astro";
import { getDonationEnvConfig } from "../../../lib/donations/config";
import { getDonationSnapshot } from "../../../lib/donations/progress";

export const prerender = false;

const encoder = new TextEncoder();

const encodeEvent = (event: string, data: unknown) =>
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

const isClosedControllerError = (error: unknown) =>
  error instanceof TypeError &&
  ((error as { code?: string }).code === "ERR_INVALID_STATE" ||
    error.message.toLowerCase().includes("controller is already closed"));

export const GET: APIRoute = () => {
  const { sseIntervalMs: intervalMs, sseMaxDurationMs: maxDurationMs } =
    getDonationEnvConfig();
  let closed = false;
  let intervalId: ReturnType<typeof setInterval> | undefined;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const clearTimers = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = undefined;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  };

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let lastPayload = "";

      const close = () => {
        if (closed) return;
        closed = true;
        clearTimers();

        try {
          controller.close();
        } catch (error) {
          if (!isClosedControllerError(error)) throw error;
        }
      };

      const enqueue = (chunk: Uint8Array) => {
        if (closed) return;

        try {
          controller.enqueue(chunk);
        } catch (error) {
          if (!isClosedControllerError(error)) throw error;
          closed = true;
          clearTimers();
        }
      };

      const sendSnapshot = async () => {
        if (closed) return;

        try {
          const snapshot = await getDonationSnapshot();
          if (closed) return;

          const payload = JSON.stringify(snapshot);

          if (payload !== lastPayload) {
            lastPayload = payload;
            enqueue(encodeEvent("progress", snapshot));
          } else {
            enqueue(encoder.encode(": heartbeat\n\n"));
          }
        } catch (error) {
          if (closed) return;
          console.error("Donation progress SSE read failed", error);
          enqueue(encodeEvent("error", { ok: false }));
        }
      };

      void sendSnapshot();
      intervalId = setInterval(() => void sendSnapshot(), intervalMs);
      timeoutId = setTimeout(close, maxDurationMs);
    },
    cancel() {
      closed = true;
      clearTimers();
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
