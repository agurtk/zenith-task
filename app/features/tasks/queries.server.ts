import { desc, eq } from "drizzle-orm";

import { db } from "~/lib/db/client.server";
import { tasks } from "~/lib/db/schema";

export async function getTasksByUserId(userId: string) {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .orderBy(desc(tasks.createdAt));
}
