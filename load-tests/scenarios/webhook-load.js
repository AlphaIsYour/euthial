import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 10 },
    { duration: "15s", target: 30 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(95)<800"],
  },
};

const BASE_URL = __ENV.TARGET_URL || "http://localhost:3000";

export default function () {
  const payload = JSON.stringify({
    eventType: "DEPOSIT_CONFIRMED",
    recipientEmail: "loadtest@euthial.id",
    data: {
      investorName: "Stress Test Investor",
      amountIdr: 10000000,
      tranche: "SENIOR",
    },
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(`${BASE_URL}/api/webhooks/contract-events`, payload, params);

  check(res, {
    "webhook responds 200 or 429": (r) => r.status === 200 || r.status === 429,
  });

  sleep(0.2);
}
