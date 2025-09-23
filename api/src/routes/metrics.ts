import { Router } from "express";
import { registry } from "../metrics.js";

import type { Request, Response } from "express";

const r = Router();

r.get("/metrics", async(_req: Request, res: Response) => {
    res.setHeader("Content-Type", registry.contentType);
    res.end(await registry.metrics());
})

export default r;