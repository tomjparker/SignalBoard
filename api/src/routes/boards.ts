// src/routes/boards.ts
import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../db.js";
import { createBoardSchema } from "../lib/validate.js";
import type { Prisma } from "../db.js";

const r = Router();

// GET /api/boards — list boards
r.get("/api/boards", async (_req: Request, res: Response) => {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, createdAt: true },
  });
  res.json(boards);
});

// POST /api/boards — create board
r.post("/api/boards", async (req: Request, res: Response) => {
  const body = createBoardSchema.parse(req.body);
  const created = await prisma.board.create({ data: body });
  res.status(201).json(created);
});

// GET /api/boards/:slug — board + first page of issues
r.get("/api/boards/:slug", async (req: Request<{ slug: string }>, res: Response) => {
  const { slug } = req.params; // String
  const where: Prisma.BoardWhereUniqueInput = { slug };
  const take = Math.min(parseInt(String(req.query.take ?? "20"), 10), 100);
  const cursor = (req.query.cursor as string | undefined) ?? undefined;

  const board = await prisma.board.findUnique({
    where,
    select: { id: true, name: true, slug: true, createdAt: true },
  });
  
  if (!board) return res.status(404).json({ error: "Board not found" });

  const issues = await prisma.issue.findMany({
    where: { boardId: board.id },
    orderBy: { createdAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    select: { id: true, title: true, status: true, createdAt: true },
  });

  // Only applies when we have more pages
  const last = issues.at(-1) // errors at undefined if arr empty
  const nextCursor = take > 0 && issues.length === take && last ? last.id : null;

  res.json({ board, issues, nextCursor });

});

export default r;
