import { Form } from "react-router";

import { Button } from "~/components/ui/button";

import type { Task } from "~/lib/db/schema";
import { TaskPriorityBadge } from "./task-priority-badge";
import { TaskStatusBadge } from "./task-status-badge";
import { EditTaskDialog } from "./edit-task-dialog";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="group rounded-xl border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold">{task.title}</h2>
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
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
              <input type="hidden" name="intent" value="update-status" />

              <input type="hidden" name="taskId" value={task.id} />

              <input type="hidden" name="status" value="todo" />

              <Button size="sm" variant="outline">
                Todo
              </Button>
            </Form>
          ) : null}

          {task.status !== "in_progress" ? (
            <Form method="post">
              <input type="hidden" name="intent" value="update-status" />

              <input type="hidden" name="taskId" value={task.id} />

              <input type="hidden" name="status" value="in_progress" />

              <Button size="sm" variant="outline">
                Start
              </Button>
            </Form>
          ) : null}

          {task.status !== "done" ? (
            <Form method="post">
              <input type="hidden" name="intent" value="update-status" />

              <input type="hidden" name="taskId" value={task.id} />

              <input type="hidden" name="status" value="done" />

              <Button size="sm">Done</Button>
            </Form>
          ) : null}
          <EditTaskDialog task={task} />
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
  );
}
