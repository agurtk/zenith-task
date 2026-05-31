import { Form, useLoaderData } from "react-router";
import { getDashboardStats } from "~/features/dashboard/queries.server";
import { Button } from "~/components/ui/button";

import { requireUserId } from "~/lib/session.server";

import { DashboardStatCard } from "~/features/dashboard/components/dashborad-stat-card";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDashed,
  ListTodo,
} from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);

  const stats = await getDashboardStats(userId);

  return {
    userId,
    stats,
  };
}

export default function DashboardPage() {
  const { stats } = useLoaderData<typeof loader>();

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      description: "All tasks in your workspace",
      icon: <ListTodo className="size-4" />,
    },
    {
      title: "Completed",
      value: stats.completed,
      description: "Tasks marked as done",
      icon: <CheckCircle2 className="size-4" />,
    },
    {
      title: "Pending",
      value: stats.pending,
      description: "Tasks still in progress",
      icon: <CircleDashed className="size-4" />,
    },
    {
      title: "Overdue",
      value: stats.overdue,
      description: "Tasks past their due date",
      icon: <AlertTriangle className="size-4" />,
    },
  ];

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

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {statCards.map((card) => (
            <DashboardStatCard
              key={card.title}
              title={card.title}
              value={card.value}
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
