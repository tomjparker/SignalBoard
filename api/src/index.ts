import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import "dotenv/config";

import healthRoute from "./routes/health.js";
import metricsRoute from "./routes/metrics.js";
import { httpLatency } from "./metrics.js";

const app = express();

app.use(cors());
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

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
    console.log(`Api listening on http://localhost:${port}`)
})