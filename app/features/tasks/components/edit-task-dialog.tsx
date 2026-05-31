import { Form } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

import type { Task } from "~/lib/db/schema";

type EditTaskDialogProps = {
  task: Task;
};

export function EditTaskDialog({ task }: EditTaskDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Update the task details and save your changes.
          </DialogDescription>
        </DialogHeader>

        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="update-task" />
          <input type="hidden" name="taskId" value={task.id} />

          <div className="space-y-2">
            <Label htmlFor={`title-${task.id}`}>Title</Label>
            <Input
              id={`title-${task.id}`}
              name="title"
              defaultValue={task.title}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${task.id}`}>Description</Label>
            <Textarea
              id={`description-${task.id}`}
              name="description"
              defaultValue={task.description ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`priority-${task.id}`}>Priority</Label>

            <select
              id={`priority-${task.id}`}
              name="priority"
              defaultValue={task.priority}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`dueDate-${task.id}`}>Due date</Label>
            <Input
              id={`dueDate-${task.id}`}
              name="dueDate"
              type="date"
              defaultValue={
                task.dueDate
                  ? new Date(task.dueDate).toISOString().slice(0, 10)
                  : ""
              }
            />
          </div>

          <Button type="submit" className="w-full">
            Save changes
          </Button>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
