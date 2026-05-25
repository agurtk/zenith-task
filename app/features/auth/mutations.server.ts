import { db } from "~/lib/db/client.server";
import { users } from "~/lib/db/schema";

type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export async function createUser(input: CreateUserInput) {
  const [user] = await db.insert(users).values(input).returning();

  return user;
}
