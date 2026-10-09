"use client";

import Script from "next/script";

interface PlausibleTrackerProps {
  domain?: string;
  customDomain?: string;
}

export function PlausibleTracker({
  domain = "euthial.id",
  customDomain = "https://plausible.io",
}: PlausibleTrackerProps) {
  return (
    <>
      <Script
        defer
        data-domain={domain}
        src={`${customDomain}/js/script.js`}
        strategy="afterInteractive"
      />
    </>
  );
}

/**
 * Custom event tracking helper without cookies or PII
 */
export function trackProtocolEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible(eventName, { props });
  } else {
    // In dev / sandbox mode, log event for debugging
    if (process.env.NODE_ENV === "development") {
      console.log(`[Plausible Event] ${eventName}:`, props);
    }
  }
}
