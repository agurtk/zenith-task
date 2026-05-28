import { Badge } from "~/components/ui/badge";

import type { TaskPriority } from "../types";

import { getPriorityBadgeClass, getPriorityLabel } from "../task-utils";

type TaskPriorityBadgeProps = {
  priority: TaskPriority;
};

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  return (
    <Badge variant="outline" className={getPriorityBadgeClass(priority)}>
      {getPriorityLabel(priority)}
    </Badge>
  );
}
