export function TasksEmptyState() {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 p-8 text-center">
      <div className="mb-3 rounded-full bg-background p-3 shadow-sm">
        <span className="text-2xl">✅</span>
      </div>

      <h3 className="text-lg font-semibold">No tasks yet</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first task and start tracking your progress with ZenithTask.
      </p>
    </div>
  );
}
