import { redirect } from "react-router";
import { logout } from "~/utils/auth.server";
import type { Route } from "./+types/logout";

export async function loader() {
	// Redirect to home page if someone navigates directly to /logout
	return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
	return logout({ request });
}
