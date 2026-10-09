import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 20 },  // Ramp up to 20 users
    { duration: "20s", target: 50 },  // Ramp up to 50 users
    { duration: "10s", target: 100 }, // Peak at 100 users
    { duration: "10s", target: 0 },   // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests should be below 500ms
    http_req_failed: ["rate<0.01"],   // Less than 1% errors
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";

export default function () {
  // 1. Benchmark Telemetry & Metrics
  const metricsRes = http.get(`${BASE_URL}/api/analytics/metrics`);
  check(metricsRes, {
    "metrics status is 200": (r) => r.status === 200,
    "has TVL": (r) => JSON.parse(r.body).tvlIdr > 0,
  });

  // 2. Benchmark Public Admin Stats
  const statsRes = http.get(`${BASE_URL}/api/admin/stats`);
  check(statsRes, {
    "stats status is 200": (r) => r.status === 200,
  });

  // 3. Benchmark IoT Lock Status
  const iotRes = http.get(`${BASE_URL}/api/iot/lock-status`);
  check(iotRes, {
    "iot status is 200": (r) => r.status === 200,
  });

  sleep(0.1);
}
