import type { TaskPriority, TaskStatus } from "./types";

export function getStatusLabel(status: TaskStatus) {
  switch (status) {
    case "todo":
      return "Todo";

    case "in_progress":
      return "In Progress";

    case "done":
      return "Done";
  }
}

export function getPriorityLabel(priority: TaskPriority) {
  switch (priority) {
    case "low":
      return "Low";

    case "medium":
      return "Medium";

    case "high":
      return "High";
  }
}

export function getStatusBadgeClass(status: TaskStatus) {
  switch (status) {
    case "todo":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "in_progress":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";

    case "done":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
  }
}

export function getPriorityBadgeClass(priority: TaskPriority) {
  switch (priority) {
    case "low":
      return "bg-slate-100 text-slate-700 border-slate-200";

    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";

    case "high":
      return "bg-rose-100 text-rose-700 border-rose-200";
  }
}
