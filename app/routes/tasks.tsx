import { Form, useLoaderData } from "react-router";
import { ZodError } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import {
  createTask,
  deleteTask,
  updateTaskStatus,
} from "~/features/tasks/mutations.server";
import { getTasksByUserId } from "~/features/tasks/queries.server";
import { createTaskSchema } from "~/features/tasks/validations";
import { requireUserId } from "~/lib/session.server";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const tasks = await getTasksByUserId(userId);

  return { tasks };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "create");
  const rawData = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    status: "todo",
    priority: String(formData.get("priority") || "medium"),
    dueDate: String(formData.get("dueDate") || ""),
  };

  try {
    if (intent === "delete") {
      const taskId = formData.get("taskId");

      if (typeof taskId !== "string" || !taskId) {
        return { error: "Task id is required" };
      }

      await deleteTask({ taskId, userId });

      return { success: true };
    }

    if (intent === "update-status") {
      const taskId = formData.get("taskId");

      if (typeof taskId !== "string" || !taskId) {
        return { error: "Task id is required" };
      }
      
      const status = String(formData.get("status") || "");

      if (status !== "todo" && status !== "in_progress" && status !== "done") {
        return { error: "Invalid status" };
      }

      await updateTaskStatus({
        taskId,
        userId,
        status,
      });

      return { success: true };
    }

    const parsedData = createTaskSchema.parse(rawData);
    await createTask({
      userId,
      title: parsedData.title,
      description: parsedData.description,
      status: parsedData.status,
      priority: parsedData.priority,
      dueDate: parsedData.dueDate ? new Date(parsedData.dueDate) : undefined,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        error: error.issues[0]?.message || "Invalid task data",
      };
    }

    return {
      error: "Something went wrong",
    };
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "todo":
      return "Todo";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function getPriorityLabel(priority: string) {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    default:
      return priority;
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "todo":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "in_progress":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "done":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default:
      return "";
  }
}

function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case "low":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "high":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "";
  }
}

export default function TasksPage() {
  const { tasks } = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Create and manage your ZenithTask tasks.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
          </CardHeader>

          <CardContent>
            <Form method="post" className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Finish dashboard UI"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Add task details..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  defaultValue="medium"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due date</Label>
                <Input id="dueDate" name="dueDate" type="date" />
              </div>

              <div className="md:col-span-2">
                <Button type="submit">Create Task</Button>
              </div>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center">
                <div className="mb-3 rounded-full bg-background p-3 shadow-sm">
                  <span className="text-2xl">✅</span>
                </div>

                <h3 className="text-lg font-semibold">No tasks yet</h3>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create your first task and start tracking your progress with
                  ZenithTask.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group rounded-xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-base font-semibold">
                            {task.title}
                          </h2>

                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                              task.status,
                            )}`}
                          >
                            {getStatusLabel(task.status)}
                          </span>

                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(
                              task.priority,
                            )}`}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>

                        {task.description ? (
                          <p className="max-w-2xl text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        ) : null}

                        {task.dueDate ? (
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        {task.status !== "todo" ? (
                          <Form method="post">
                            <input
                              type="hidden"
                              name="intent"
                              value="update-status"
                            />
                            <input
                              type="hidden"
                              name="taskId"
                              value={task.id}
                            />
                            <input type="hidden" name="status" value="todo" />
                            <Button size="sm" variant="outline">
                              Todo
                            </Button>
                          </Form>
                        ) : null}

                        {task.status !== "in_progress" ? (
                          <Form method="post">
                            <input
                              type="hidden"
                              name="intent"
                              value="update-status"
                            />
                            <input
                              type="hidden"
                              name="taskId"
                              value={task.id}
                            />
                            <input
                              type="hidden"
                              name="status"
                              value="in_progress"
                            />
                            <Button size="sm" variant="outline">
                              Start
                            </Button>
                          </Form>
                        ) : null}

                        {task.status !== "done" ? (
                          <Form method="post">
                            <input
                              type="hidden"
                              name="intent"
                              value="update-status"
                            />
                            <input
                              type="hidden"
                              name="taskId"
                              value={task.id}
                            />
                            <input type="hidden" name="status" value="done" />
                            <Button size="sm">Done</Button>
                          </Form>
                        ) : null}

                        <Form method="post">
                          <input type="hidden" name="intent" value="delete" />
                          <input type="hidden" name="taskId" value={task.id} />
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </Form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
