import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { TASK_PRIORITIES, TASK_STATUSES } from "~/features/tasks/types";

export const taskStatusEnum = pgEnum("task_status", TASK_STATUSES);

export const taskPriorityEnum = pgEnum("task_priority", TASK_PRIORITIES);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  email: text("email").notNull().unique(),

  passwordHash: text("password_hash").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),

  description: text("description"),

  status: taskStatusEnum("status").default("todo").notNull(),

  priority: taskPriorityEnum("priority").default("medium").notNull(),

  dueDate: timestamp("due_date"),

  completedAt: timestamp("completed_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),

  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
