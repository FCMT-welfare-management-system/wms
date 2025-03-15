import {
	data,
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { eq } from "drizzle-orm";
import "./app.css";
import { getUserId } from "./utils/auth.server";
import Nav from "./components/nav";
import { db } from "database/context";
import { users } from "database/schema";

export const links: Route.LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="bg-background">
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export async function loader({ request }: Route.LoaderArgs) {
	const userId = await getUserId(request);
	let user = null;
	if (userId) {
		const userResults = await db
			.select({
				id: users.id,
				username: users.username,
				name: users.name,
				email: users.email,
			})
			.from(users)
			.where(eq(users.id, userId));

		if (userResults.length > 0) {
			user = userResults[0];
		}
	}
	if (userId && !user) {
		console.error("something is wrong user is  Logged in but not found in db");
		//TODO: log the user out
	}
	return data({ user });
}
export default function App({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	return (
		<main>
			<Nav username={user?.username} />
			<Outlet />
			<footer className="mt-auto bg-accent-brand py-6 px-4 text-center text-foreground">
				<p className="text-body-sm">
					KABU Student Welfare Management System ©2025 Team Project
				</p>
			</footer>
		</main>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
