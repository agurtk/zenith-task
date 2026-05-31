import { Form, useLoaderData } from "react-router";
import { ZodError } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { TaskCard } from "~/features/tasks/components/task-card";
import { TasksEmptyState } from "~/features/tasks/components/tasks-empty-state";

import {
  createTask,
  deleteTask,
  updateTaskStatus,
} from "~/features/tasks/mutations.server";
import { getTasksByUserId } from "~/features/tasks/queries.server";
import { createTaskSchema } from "~/features/tasks/validations";
import { requireUserId } from "~/lib/session.server";
import {
  parseCreateTaskForm,
  parseDeleteTaskForm,
  parseUpdateTaskStatusForm,
} from "~/features/tasks/task-form.server";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const tasks = await getTasksByUserId(userId);

  return { tasks };
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const intent = String(formData.get("intent") || "create");

  try {
    if (intent === "delete") {
      const data = parseDeleteTaskForm(formData);

      await deleteTask({
        taskId: data.taskId,
        userId,
      });

      return { success: true };
    }

    if (intent === "update-status") {
      const data = parseUpdateTaskStatusForm(formData);

      await updateTaskStatus({
        taskId: data.taskId,
        userId,
        status: data.status,
      });

      return { success: true };
    }

    const data = parseCreateTaskForm(formData);
    await createTask({
      userId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
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
              <TasksEmptyState />
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
