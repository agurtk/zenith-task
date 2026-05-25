import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),

  description: z.string().optional(),

  status: z.enum(["todo", "in_progress", "done"]),

  priority: z.enum(["low", "medium", "high"]),

  dueDate: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
