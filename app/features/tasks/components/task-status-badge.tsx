import { Badge } from "~/components/ui/badge";

import type { TaskStatus } from "../types";

import { getStatusBadgeClass, getStatusLabel } from "../task-utils";

type TaskStatusBadgeProps = {
  status: TaskStatus;
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  return (
    <Badge variant="outline" className={getStatusBadgeClass(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
