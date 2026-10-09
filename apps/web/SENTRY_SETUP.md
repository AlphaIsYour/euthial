# Sentry Error Monitoring

This Next.js app is instrumented with `@sentry/nextjs` for frontend and backend runtime error capture.

## Required environment variables

Set these in each deployment environment:

```env
NEXT_PUBLIC_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production # development | staging | production
NEXT_PUBLIC_SENTRY_RELEASE=euthial-web@<git-sha-or-version>
```

For server-side events, optionally set a server-only DSN. If it is omitted, server instrumentation falls back to `NEXT_PUBLIC_SENTRY_DSN`.

```env
SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0
SENTRY_ENVIRONMENT=production
SENTRY_RELEASE=euthial-web@<git-sha-or-version>
```

## Source map upload

Source maps are uploaded automatically during `next build` when these CI/CD variables are present:

```env
SENTRY_AUTH_TOKEN=sntrys_...
SENTRY_ORG=<sentry-org-slug>
SENTRY_PROJECT=<sentry-project-slug>
SENTRY_RELEASE=euthial-web@<git-sha-or-version>
NEXT_PUBLIC_SENTRY_RELEASE=euthial-web@<git-sha-or-version>
```

`apps/web/next.config.js` enables `productionBrowserSourceMaps` and wraps the Next.js config with `withSentryConfig`. Browser source maps are hidden from public download while still being uploaded to Sentry.

## Performance monitoring

Performance tracing is enabled via `tracesSampleRate`:

- `production`: `0.2`
- other environments: `1.0`

Browser replay is configured conservatively:

- normal production sessions: `0.05`
- sessions with errors: `1.0`

## Environment tagging

Events are tagged with one of these values, in priority order:

1. `SENTRY_ENVIRONMENT` for server/edge runtime
2. `NEXT_PUBLIC_SENTRY_ENVIRONMENT`
3. `NEXT_PUBLIC_APP_ENV`
4. `NODE_ENV`
5. `development`

Use `development`, `staging`, and `production` consistently in Sentry alert filters.

## Slack/email alerts for critical production errors

Create the alert rule in Sentry dashboard after the project is connected to Slack/email:

1. Go to Sentry project settings for the web project.
2. Add Slack integration and choose the team channel, for example `#euthial-alerts`.
3. Create an Issue Alert rule:
   - Environment filter: `production`
   - Conditions:
     - `A new issue is created`
     - OR `The issue changes state from resolved to unresolved`
     - OR event count exceeds the team's threshold within the chosen time window
   - Filters:
     - level is `error` or `fatal`
   - Actions:
     - Send Slack notification to the team channel
     - Send email notification to project owners/on-call team
4. Create a Performance Alert rule if latency/error-rate SLOs are required.

This dashboard step is required because Slack workspace/channel authorization is managed by Sentry, not by the application code.

## Local smoke test

Run with a development DSN:

```bash
pnpm --filter @euthial/web dev
```

Then trigger a client or API runtime exception in a non-production test environment and confirm the event appears in Sentry with the expected environment and stack trace.
