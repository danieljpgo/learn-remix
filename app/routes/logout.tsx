import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/server/users.server";

// reason that we're using an action (rather than a loader) is because we want to avoid CSRF problems by using a POST request rather than a GET request.
export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

// loader is just here in case someone somehow lands here, we'll just redirect them back home
export const loader: LoaderFunction = async () => {
  return redirect("/");
};
