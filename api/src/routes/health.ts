import { Router } from "express";
import type  { Request, Response } from "express";
const r = Router();

r.get("/healthz", (_req: Request, res: Response) => res.json ({ ok: true}));

export default r;