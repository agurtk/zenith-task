import { db } from "~/lib/db/client.server";
import { tasks } from "~/lib/db/schema";

type CreateTaskDbInput = {
  userId: string;
  title: string;
  description: string | undefined;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
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
