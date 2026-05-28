import { and, eq } from "drizzle-orm";

import { tasks } from "~/lib/db/schema";

export function taskOwnerWhere(taskId: string, userId: string) {
  return and(eq(tasks.id, taskId), eq(tasks.userId, userId));
}
