import { eq } from "drizzle-orm";

import { db } from "~/lib/db/client.server";
import { users } from "~/lib/db/schema";

export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  return user;
}
