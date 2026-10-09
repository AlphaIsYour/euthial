# Euthial Load Testing Suite (k6 & Benchmark) — Issue #85

Stress testing suite for Euthial protocol API endpoints, telemetry, and contract event webhooks.

## 🚀 Running Tests

### Option 1: Native Node / TSX Benchmark (Zero external installs)
```bash
pnpm test:load
```
Benchmarks 100 requests per endpoint across concurrent workers, reporting throughput (RPS), average latency, and p95 response time.

### Option 2: Using k6 CLI
```bash
# Public API stress test (100 VUs)
k6 run load-tests/scenarios/api-stress.js

# Webhook stress test
k6 run load-tests/scenarios/webhook-load.js
```

### Option 3: Using Docker
```bash
docker run --rm -i -v $(pwd)/load-tests:/scripts grafana/k6 run /scripts/scenarios/api-stress.js
```
