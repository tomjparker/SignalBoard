import express from "express";
import cors from "cors";
import "dotenv/config";

import health from "./routes/health.js";
import metrics from "./routes/metrics.js";
import { httpLatency } from "./metrics.js";

const app = express();

app.use(cors());
app.use(express.json());

// --- Request latency tracking --- //

app.use(req: Request, res, err)