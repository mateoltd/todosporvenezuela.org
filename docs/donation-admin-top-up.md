# Donation Admin Top-Up

Fast context for agents: this is the private manual adjustment path for donation totals when a payment method does not auto-report, like Binance or Pago Movil.

## Files

- `src/pages/admin/donations/top-up.astro`: private browser page.
- `src/pages/api/donations/admin/session.ts`: login/logout endpoint for the browser UI.
- `src/pages/api/donations/admin/adjust.ts`: API endpoint used by the page and future automations.
- `src/lib/donations/adminAuth.ts`: shared auth, CSRF, no-cache, noindex, and browser security headers.
- `src/lib/donations/progress.ts`: Redis-backed donation storage and idempotent event recording.

## Env Vars

Required for the private page:

```sh
DONATION_ADMIN_USERNAME=
DONATION_ADMIN_PASSWORD=
```

Optional for API automation:

```sh
DONATION_ADMIN_TOKEN=
DONATION_ADMIN_MAX_TOP_UP_USD=10000
```

`DONATION_ADMIN_MAX_TOP_UP_USD` defaults to `10000` if unset or invalid.

Manual adjustments also require donation writes to be enabled for the environment. See `docs/donation-environments.md` for the Production/Preview write policy.

## Browser Page

Route:

```text
/admin/donations/top-up
```

The page is intentionally not linked anywhere public. It shows a small custom login form and checks `DONATION_ADMIN_USERNAME` and `DONATION_ADMIN_PASSWORD` server-side.

If username/password are missing, the page returns `404`. If credentials are wrong, the login API returns `401` and the page stays on the login form.

Successful login sets a signed HttpOnly `tpv_donation_admin` session cookie. The cookie is HMAC-signed with the admin secrets, expires after 8 hours, uses `SameSite=Strict`, and is marked `Secure` outside localhost.

The page shows the current donation snapshot and submits:

- `amount`
- `source`
- `reference`
- optional `note`

## API

Route:

```text
POST /api/donations/admin/adjust
```

Payload:

```json
{
  "amount": "25.00",
  "currency": "USD",
  "source": "binance",
  "reference": "binance-2026-06-28-001",
  "note": "optional internal note"
}
```

Response:

```json
{
  "ok": true,
  "inserted": true,
  "progress": {}
}
```

`inserted: false` means the same `source` and `reference` were already recorded, so the total did not change.

## Auth Modes

For the browser UI:

```text
POST /api/donations/admin/session
DELETE /api/donations/admin/session
```

`POST` validates username/password and sets the signed session cookie. `DELETE` clears it.

For direct Basic-auth API use:

```sh
curl -u "$DONATION_ADMIN_USERNAME:$DONATION_ADMIN_PASSWORD" \
  -H "Content-Type: application/json" \
  -d '{"amount":"25.00","currency":"USD","source":"binance","reference":"binance-2026-06-28-001"}' \
  https://todosporvenezuela.org/api/donations/admin/adjust
```

For automation:

```sh
curl -H "Authorization: Bearer $DONATION_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":"25.00","currency":"USD","source":"pago_movil","reference":"pm-2026-06-28-001"}' \
  https://todosporvenezuela.org/api/donations/admin/adjust
```

The legacy `X-Donation-Admin-Token` header also works, but prefer `Authorization: Bearer`.

## Safeguards

- HTTPS is required except on localhost.
- API auth is checked before request validation hints are returned.
- API requires `Content-Type: application/json`.
- Browser-originated session or Basic-auth submissions require a short-lived CSRF token from the page.
- Cross-origin browser requests are rejected.
- Admin responses use no-store cache headers.
- Admin responses send `X-Robots-Tag: noindex, nofollow, noarchive`.
- `robots.txt` disallows `/admin/` and `/api/donations/admin/`.
- Browser security headers deny framing and restrict scripts, styles, images, forms, and connections to self.
- Amount must be positive, have at most two decimals, and stay under `DONATION_ADMIN_MAX_TOP_UP_USD`.
- `reference` is required and capped at 140 chars.
- `note` is capped at 240 chars.
- `source` is normalized to a short machine-safe token.

## Idempotency

Manual entries are recorded with this event id:

```text
admin:${source}:${reference}
```

`recordDonation()` stores that event with Redis `SET ... NX`; duplicate event ids do not increment the total again. Use stable transaction/comprobante ids for `reference`.

## Agent Notes

- Do not add this page to public nav, sitemap, or marketing flows.
- Keep auth changes centralized in `adminAuth.ts`.
- Preserve API compatibility for session, Basic auth, and bearer token clients.
- When changing validation, keep browser and automation use cases aligned.
- If a future automation polls Binance/Pago Movil, have it generate deterministic references so retries stay idempotent.
