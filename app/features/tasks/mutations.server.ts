import { db } from "~/lib/db/client.server";
import { tasks } from "~/lib/db/schema";
import type { TaskStatus, TaskPriority } from "./types";
import { taskOwnerWhere } from "./db-helpers.server";

type CreateTaskDbInput = {
  userId: string;
  title: string;
  description: string | undefined;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | undefined;
};

export async function createTask(input: CreateTaskDbInput) {
  const [task] = await db
    .insert(tasks)
    .values({
      userId: input.userId,
      title: input.title,
      description: input.description || null,
      status: input.status,
      priority: input.priority,
      dueDate: input.dueDate || null,
    })
    .returning();

  return task;
}

export async function deleteTask(input: { taskId: string; userId: string }) {
  await db.delete(tasks).where(taskOwnerWhere(input.taskId, input.userId));
}

export async function updateTaskStatus(input: {
  taskId: string;
  userId: string;
  status: TaskStatus;
}) {
  const completedAt = input.status === "done" ? new Date() : null;

  const [task] = await db
    .update(tasks)
    .set({
      status: input.status,
      completedAt,
      updatedAt: new Date(),
    })
    .where(taskOwnerWhere(input.taskId, input.userId))
    .returning();

  return task;
}
