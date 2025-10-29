import express from "express";
import helmet from "helmet"; // Nice to have for baseline header hygiene, even if not hosting from here. Also reinforces api endpoint
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";

import healthRoute from "./routes/health.js";
import metricsRoute from "./routes/metrics.js";
import boardsRoute from "./routes/boards.js";
import issuesRoute from "./routes/issues.js";
import { httpLatency } from "./metrics.js";
import { prisma } from "./db.js";

const app = express();

app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // allows serving resources to other origins
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allows CORS clients to consume responses
    contentSecurityPolicy: false, // disable CSP entirely for JSON API, its only for HTML safety, which we dont serve here.
  })
)

app.use(cors({ origin: true, credentials: true }));


// For production use:

// app.use(cors({
//   origin: ["http://localhost:5173", "https://app.yourdomain.com"],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

app.use(express.json());

// --- Request latency tracking --- //

app.use((req: Request, res: Response, next: NextFunction) => {
    const end = httpLatency.startTimer({ method: req.method, path: req.path})

    res.on("finish", () => {
        end({ status: String(res.statusCode) });
    });

    next()
});

app.use(healthRoute);
app.use(metricsRoute);
app.use(boardsRoute);
app.use(issuesRoute);

app.get("/readyz", async (_req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({ ok: true });
    } catch (e) {
        res.status(503).json({ok: false});
    }
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => { // Need to switch to err: unknown but this requires type checks so a job for later.
    const status = err?.status ?? 500;
    const message = err?.message ?? "Internal Server Error";
    if (status >= 500) console.error(err);
    res.status(status).json({ error: message });
})

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
    console.log(`Api listening on http://localhost:${port}`)
})