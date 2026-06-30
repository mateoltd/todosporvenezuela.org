# Donation Environments

This project treats payment mode, callback origin, and donation storage writes as separate concerns.

## Production

Production should use:

```sh
PUBLIC_DONATION_ENV=production
DONATION_DEPLOYMENT_ENV=production
PUBLIC_SITE_URL=https://todosporvenezuela.org
DONATION_ENABLE_WRITES=true
DONATION_REDIS_PREFIX=tpv:donations
```

Required payment/storage secrets:

```sh
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
PUBLIC_PAYPAL_PRODUCTION_BUSINESS=
```

Optional PayPal receiver allowlists:

```sh
PAYPAL_RECEIVER_EMAILS=
PAYPAL_RECEIVER_IDS=
```

If the allowlists are empty, the IPN receiver check falls back to the configured PayPal business value for the active mode.

## Preview

Preview should default to safe reads and no writes:

```sh
PUBLIC_DONATION_ENV=sandbox
DONATION_DEPLOYMENT_ENV=preview
DONATION_ENABLE_WRITES=false
DONATION_REDIS_PREFIX=tpv:donations:preview
```

`PUBLIC_SITE_URL` can stay set to the production canonical URL for SEO/canonical rendering. Payment callbacks in sandbox mode, and preview deployments marked with `DONATION_DEPLOYMENT_ENV=preview`, use the request origin unless `DONATION_CALLBACK_BASE_URL` is set.

Preview can share the same Redis instance only if the prefix is isolated. Prefer a separate Redis/Upstash instance for full end-to-end payment testing.

To intentionally test Preview writes:

```sh
DONATION_ENABLE_WRITES=true
DONATION_REDIS_PREFIX=tpv:donations:preview
```

Do not enable Preview writes with the production Redis prefix.

Deploy Preview with:

```sh
pnpm deploy:cf:preview
```

Astro generates a Worker deploy config under `dist/server`. The preview deploy script rewrites that generated config to use the `todosporvenezuela-preview` Worker, workers.dev URLs, no production routes, sandbox payment mode, disabled writes, and the preview Redis prefix. Avoid using plain `wrangler deploy --env preview` for this Astro app unless the generated config is verified first.

## Callback Origin

Callback resolution order:

1. `DONATION_CALLBACK_BASE_URL`, if set.
2. Current request origin for sandbox mode or `DONATION_DEPLOYMENT_ENV=preview`.
3. `PUBLIC_SITE_URL` for production.

This keeps production canonical URLs stable while preventing Preview payments from posting back to production by accident.

## PayPal

PayPal mode follows `PUBLIC_DONATION_ENV`.

Sandbox uses:

```sh
PUBLIC_PAYPAL_SANDBOX_DONATE_URL=https://www.sandbox.paypal.com/donate
PUBLIC_PAYPAL_SANDBOX_BUSINESS=
```

Production uses:

```sh
PUBLIC_PAYPAL_PRODUCTION_DONATE_URL=https://www.paypal.com/donate
PUBLIC_PAYPAL_PRODUCTION_BUSINESS=
```

Only override `PAYPAL_IPN_VERIFY_URL` for local/custom testing. Normal sandbox/production verification URLs are selected automatically.
