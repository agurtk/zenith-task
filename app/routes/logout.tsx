import { logout } from "~/lib/session.server";

export async function action({ request }: { request: Request }) {
  return logout(request);
}
