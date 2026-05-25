import { Form, useLoaderData } from "react-router";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { requireUserId } from "~/lib/session.server";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);

  return {
    userId,
  };
}

export default function DashboardPage() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              ZenithTask Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back. Here is your productivity overview.
            </p>
          </div>

          <Form method="post" action="/logout">
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </Form>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Tasks</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">0</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">0</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">0</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overdue</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold">0</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Debug</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Logged in user id: {userId}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
