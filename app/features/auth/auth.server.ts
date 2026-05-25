import bcrypt from "bcryptjs";
import { createUser } from "./mutations.server";
import { getUserByEmail } from "./queries.server";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const passwordHash = await hashPassword(input.password);

  return createUser({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
  });
}

export async function loginUser(input: { email: string; password: string }) {
  const user = await getUserByEmail(input.email.toLowerCase());

  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!isValidPassword) {
    return null;
  }

  return user;
}
