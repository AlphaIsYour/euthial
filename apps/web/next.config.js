const { withSentryConfig } = require("@sentry/nextjs/config");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      "@x402/evm/exact/client": false,
      "@x402/core/client": false,
      "@x402/svm/exact/client": false,
      "@x402/evm": false,
      "@metamask/connect-evm": false,
      "@safe-global/safe-apps-sdk": false,
      "@safe-global/safe-apps-provider": false,
      "@coinbase/wallet-sdk": false,
      "@base-org/account": false,
      "@react-native-async-storage/async-storage": false,
    };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
};

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  release: process.env.SENTRY_RELEASE,

  // Keep CI logs clean unless Sentry upload/debugging is explicitly needed.
  silent: !process.env.SENTRY_DEBUG,

  // Upload additional source maps so Sentry can show complete stack traces.
  widenClientFileUpload: true,

  // Prevent browser users from downloading generated source maps.
  hideSourceMaps: true,

  // Tree-shake Sentry logger calls from production bundles.
  disableLogger: true,

  // Proxy browser events through the app to reduce ad-blocker drops.
  tunnelRoute: "/monitoring",

  // Enable automatic Vercel cron monitor instrumentation when deployed there.
  automaticVercelMonitors: true,
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
