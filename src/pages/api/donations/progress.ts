import type { APIRoute } from "astro";
import { donationJson, getDonationSnapshot } from "../../../lib/donations/progress";

export const prerender = false;

export const GET: APIRoute = async () => {
  const snapshot = await getDonationSnapshot();
  return donationJson({ ok: true, ...snapshot });
};
