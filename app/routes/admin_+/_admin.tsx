import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBullhorn,
	faTachometerAlt,
	faUsers,
	faBars,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { data, NavLink, Outlet, redirect } from "react-router";
import type { Route } from "./+types/_admin";
import { requireUserId } from "#app/utils/auth.server.js";
import { db } from "database/context";
import { users } from "database/schema";
import { eq } from "drizzle-orm";
import { GeneralErrorBoundary } from "#app/components/ui/error-boundary.js";

export async function isAdmin(userId: string) {
	const [user] = await db
		.select({
			role: users.role,
		})
		.from(users)
		.where(eq(users.id, userId));

	if (!user) return false;

	return user.role !== "admin";
}
export async function loader({ request }: Route.LoaderArgs) {
	const userId = await requireUserId(request);
	if (!userId) {
		return redirect("/login");
	}

	if (!isAdmin(userId)) {
		return redirect("/");
	}
	console.log("admin authenticated");
	return data(
		{},
		{
			status: 200,
		},
	);
}

const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navItems = [
		{
			icon: faTachometerAlt,
			label: "Dashboard",
			to: "/admin/dashboard",
		},
		{
			icon: faBullhorn,
			label: "Campaigns",
			to: "/admin/Campaigns",
		},
		{
			icon: faBullhorn,
			label: "new",
			to: "/admin/Campaigns/new",
		},
	];

	const Sidebar = ({ mobile = false }) => (
		<div className={`bg-accent p-4 ${mobile ? "w-full" : "w-64"}`}>
			<div className="flex items-center justify-between mb-8">
				<h2 className="text-h5 font-bold text-brand">Admin Portal</h2>
				{mobile && (
					<button
						onClick={() => setSidebarOpen(false)}
						className="text-muted-foreground hover:text-primary"
					>
						<FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
					</button>
				)}
			</div>
			<nav className="space-y-2">
				{navItems.map((item, index) => (
					<NavLink
						key={index}
						to={item.to}
						className={({ isActive }) => `
    flex items-center p-3 rounded-md transition-colors
    ${
			isActive
				? "bg-muted text-primary font-medium"
				: "text-primary hover:bg-muted/70"
		}
  `}
						end={true} // This ensures exact path matching
					>
						<FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
						<span className="ml-3">{item.label}</span>
					</NavLink>
				))}
			</nav>
		</div>
	);

	return (
		<div className="min-h-screen bg-background">
			{/* Mobile Sidebar (overlay) */}
			{sidebarOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
						onClick={() => setSidebarOpen(false)}
					></div>

					{/* Sidebar */}
					<div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-background shadow-xl">
						<Sidebar mobile={true} />
					</div>
				</div>
			)}

			<div className="flex">
				{/* Desktop Sidebar (always visible on md+ screens) */}
				<div className="hidden md:block min-h-screen">
					<Sidebar />
				</div>

				<div className="flex-1 overflow-auto">
					{/* Top Navigation Bar */}
					<div className="bg-background border-b border-border p-4">
						<div className="flex justify-between items-center">
							<div>
								{/* Mobile menu button */}
								<button
									className="md:hidden text-primary"
									onClick={() => setSidebarOpen(true)}
								>
									<FontAwesomeIcon icon={faBars} className="w-5 h-5" />
								</button>
							</div>
						</div>
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
