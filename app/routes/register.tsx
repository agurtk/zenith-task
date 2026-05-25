import { Form, redirect, useActionData } from "react-router";
import { ZodError } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { registerUser } from "~/features/auth/auth.server";
import { getUserByEmail } from "~/features/auth/queries.server";
import { registerSchema } from "~/features/auth/validations";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const rawData = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  try {
    const parsedData = registerSchema.parse(rawData);

    const existingUser = await getUserByEmail(parsedData.email.toLowerCase());

    if (existingUser) {
      return {
        error: "A user with this email already exists.",
      };
    }

    await registerUser(parsedData);

    return redirect("/login");
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.issues[0]?.message || "Invalid form data.",
      };
    }

    return {
      error: "Something went wrong. Please try again.",
    };
  }
}

export default function RegisterPage() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription>
            Start organizing your work with ZenithTask.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form method="post" className="space-y-4">
            {actionData?.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {actionData.error}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" placeholder="Full name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full">
              Create account
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
