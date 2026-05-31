import {
  createTaskSchema,
  deleteTaskSchema,
  updateTaskStatusSchema,
} from "./validations";

export function parseCreateTaskForm(formData: FormData) {
  return createTaskSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    status: "todo",
    priority: formData.get("priority") || "medium",
    dueDate: formData.get("dueDate") || undefined,
  });
}

export function parseDeleteTaskForm(formData: FormData) {
  return deleteTaskSchema.parse({
    taskId: formData.get("taskId"),
  });
}

export function parseUpdateTaskStatusForm(formData: FormData) {
  return updateTaskStatusSchema.parse({
    taskId: formData.get("taskId"),
    status: formData.get("status"),
  });
}
