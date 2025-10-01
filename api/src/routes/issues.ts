// src/routes/issues.ts
import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { createIssueSchema, updateIssueStatusSchema } from "../lib/validate.js";

const r = Router();

// POST /api/boards/:slug/issues — create issue
r.post("/api/boards/:slug/issues", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const input = createIssueSchema.parse(req.body);

  const board = await prisma.board.findUnique({ where: { slug }, select: { id: true } });
  if (!board) return res.status(404).json({ error: "Board not found" });

  const issue = await prisma.issue.create({
    data: { boardId: board.id, title: input.title, description: input.description },
    select: { id: true, title: true, status: true, createdAt: true },
  });

  res.status(201).json(issue);
});

// PATCH /api/issues/:id/status — update status
r.patch("/api/issues/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = updateIssueStatusSchema.parse(req.body);

  const updated = await prisma.issue.update({
    where: { id },
    data: { status },
    select: { id: true, title: true, status: true },
  });

  res.json(updated);
});

// GET /api/boards/:slug/issues — list issues (filter + pagination)
r.get("/api/boards/:slug/issues", async (req: Request, res: Response) => {
  const { slug } = req.params;
  const status = (req.query.status as string) || undefined;
  const take = Math.min(parseInt(String(req.query.take ?? "20"), 10), 100);
  const cursor = (req.query.cursor as string | undefined) ?? undefined;

  const board = await prisma.board.findUnique({ where: { slug }, select: { id: true } });
  if (!board) return res.status(404).json({ error: "Board not found" });

  const issues = await prisma.issue.findMany({
    where: { boardId: board.id, ...(status ? { status } : {}) },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: { id: true, title: true, status: true, createdAt: true },
  });

  const nextCursor = issues.length === take ? issues[issues.length - 1].id : null;
  res.json({ items: issues, nextCursor });
});

export default r;