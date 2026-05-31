import { and, count, eq, lt, ne } from "drizzle-orm";

import { db } from "~/lib/db/client.server";
import { tasks } from "~/lib/db/schema";

export async function getDashboardStats(userId: string) {
  const now = new Date();

  const [total] = await db
    .select({ value: count() })
    .from(tasks)
    .where(eq(tasks.userId, userId));

  const [completed] = await db
    .select({ value: count() })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), eq(tasks.status, "done")));

  const [pending] = await db
    .select({ value: count() })
    .from(tasks)
    .where(and(eq(tasks.userId, userId), ne(tasks.status, "done")));

  const [overdue] = await db
    .select({ value: count() })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        ne(tasks.status, "done"),
        lt(tasks.dueDate, now),
      ),
    );

  return {
    total: total?.value,
    completed: completed?.value,
    pending: pending?.value,
    overdue: overdue?.value,
  };
}
