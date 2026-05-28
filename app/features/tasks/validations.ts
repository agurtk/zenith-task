import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "./types";

export const createTaskSchema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),

  description: z.string().optional(),

  status: z.enum(TASK_STATUSES),

  priority: z.enum(TASK_PRIORITIES),

  dueDate: z.string().optional(),
});

export const deleteTaskSchema = z.object({
  taskId: z.uuid("Invalid task id"),
});

export const updateTaskStatusSchema = z.object({
  taskId: z.uuid("Invalid task id"),

  status: z.enum(TASK_STATUSES),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
