import http from "http";

interface BenchmarkResult {
  endpoint: string;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  durationMs: number;
  avgLatencyMs: number;
  p95LatencyMs: number;
  requestsPerSecond: number;
}

async function fetchAsync(url: string): Promise<{ success: boolean; latency: number }> {
  const start = Date.now();
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        res.resume();
        res.on("end", () => {
          const latency = Date.now() - start;
          resolve({ success: res.statusCode === 200 || res.statusCode === 304, latency });
        });
      })
      .on("error", () => {
        resolve({ success: false, latency: Date.now() - start });
      });
  });
}

async function runBenchmark(endpoint: string, total: number = 100, concurrency: number = 10): Promise<BenchmarkResult> {
  const latencies: number[] = [];
  let successful = 0;
  let failed = 0;

  const startTime = Date.now();
  let remaining = total;

  async function worker() {
    while (remaining > 0) {
      remaining--;
      const res = await fetchAsync(`http://localhost:3000${endpoint}`);
      latencies.push(res.latency);
      if (res.success) successful++;
      else failed++;
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const durationMs = Date.now() - startTime;
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length || 0;
  const p95Latency = latencies[Math.floor(latencies.length * 0.95)] || 0;
  const rps = (total / durationMs) * 1000;

  return {
    endpoint,
    totalRequests: total,
    successfulRequests: successful,
    failedRequests: failed,
    durationMs,
    avgLatencyMs: Math.round(avgLatency),
    p95LatencyMs: Math.round(p95Latency),
    requestsPerSecond: Math.round(rps),
  };
}

async function main() {
  console.log("======================================================");
  console.log("  EUTHIAL API LOAD & STRESS BENCHMARK SUITE (#85)");
  console.log("======================================================");

  const endpoints = [
    "/api/analytics/metrics",
    "/api/admin/stats",
    "/api/iot/lock-status",
  ];

  for (const ep of endpoints) {
    console.log(`▶ Benchmarking ${ep} (100 reqs, 10 concurrent workers)...`);
    const result = await runBenchmark(ep, 100, 10);
    console.log(`  Requests:  ${result.successfulRequests}/${result.totalRequests} OK`);
    console.log(`  Avg Latency: ${result.avgLatencyMs} ms`);
    console.log(`  p95 Latency: ${result.p95LatencyMs} ms`);
    console.log(`  Throughput:  ${result.requestsPerSecond} req/sec\n`);
  }

  console.log("🎉 ALL LOAD TESTING BENCHMARKS COMPLETED SUCCESSFULLY!");
}

main().catch(console.error);
