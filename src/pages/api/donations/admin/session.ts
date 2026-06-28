import type { APIRoute } from "astro";
import {
  createDonationAdminLogoutCookie,
  createDonationAdminSessionCookie,
  getDonationAdminHeaders,
  requireDonationAdminLoginRequest,
  verifyDonationAdminCredentials,
} from "../../../../lib/donations/adminAuth";
import { donationJson } from "../../../../lib/donations/progress";

export const prerender = false;

type LoginBody = {
  password?: string;
  username?: string;
};

export const POST: APIRoute = async ({ request }) => {
  const auth = requireDonationAdminLoginRequest(request);

  if (!auth.ok) {
    return donationJson(
      { ok: false, error: auth.error },
      { status: auth.status, headers: getDonationAdminHeaders() },
    );
  }

  const body = (await request.json().catch(() => null)) as LoginBody | null;
  const username = String(body?.username || "");
  const password = String(body?.password || "");

  if (!verifyDonationAdminCredentials(username, password)) {
    return donationJson(
      { ok: false, error: "unauthorized" },
      { status: 401, headers: getDonationAdminHeaders() },
    );
  }

  return donationJson(
    { ok: true },
    {
      status: 201,
      headers: getDonationAdminHeaders({
        "Set-Cookie": createDonationAdminSessionCookie(request),
      }),
    },
  );
};

export const DELETE: APIRoute = async ({ request }) =>
  donationJson(
    { ok: true },
    {
      headers: getDonationAdminHeaders({
        "Set-Cookie": createDonationAdminLogoutCookie(request),
      }),
    },
  );
