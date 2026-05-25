import { Form, useActionData } from "react-router";
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

import { loginUser } from "~/features/auth/auth.server";
import { loginSchema } from "~/features/auth/validations";

import { createUserSession } from "~/lib/session.server";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const rawData = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  try {
    const parsedData = loginSchema.parse(rawData);

    const user = await loginUser(parsedData);

    if (!user) {
      return {
        error: "Invalid email or password",
      };
    }

    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.issues[0]?.message || "Invalid form data",
      };
    }

    return {
      error: "Something went wrong",
    };
  }
}

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  return (
    <main className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>

          <CardDescription>Login to your ZenithTask account.</CardDescription>
        </CardHeader>

        <CardContent>
          <Form method="post" className="space-y-4">
            {actionData?.error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {actionData.error}
              </div>
            ) : null}

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
              Login
            </Button>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
