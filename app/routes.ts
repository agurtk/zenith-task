import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("register", "routes/register.tsx"),
  route("login", "routes/login.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("logout", "routes/logout.tsx"),
  route("tasks", "routes/tasks.tsx"),
] satisfies RouteConfig;
