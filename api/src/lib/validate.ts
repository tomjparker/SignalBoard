import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
});

export const createIssueSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const updateIssueStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "done"]), // or keep it as string if you prefer
});