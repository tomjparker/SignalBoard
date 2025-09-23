import client from "prom-client";

// Get default process metrics (node)

client.collectDefaultMetrics({ prefix: "api_" });

export const httpLatency = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request latency (s)",
    labelNames: ["method", "path", "status"],
    buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
});

export const registry = client.register;