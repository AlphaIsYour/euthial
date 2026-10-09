import * as Sentry from "@sentry/nextjs";

const environment =
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ||
  process.env.NEXT_PUBLIC_APP_ENV ||
  process.env.NODE_ENV ||
  "development";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
  enabled: Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN),

  // Capture performance traces. Keep production sampling conservative by default.
  tracesSampleRate: environment === "production" ? 0.2 : 1.0,

  // Capture a small sample of replay sessions, and all sessions where an error occurs.
  replaysSessionSampleRate: environment === "production" ? 0.05 : 0,
  replaysOnErrorSampleRate: 1.0,

});
