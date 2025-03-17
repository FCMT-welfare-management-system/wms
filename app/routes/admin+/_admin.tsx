import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faBullhorn,
	faTachometerAlt,
	faUsers,
	faFileAlt,
	faBars,
	faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Outlet } from "react-router";

// Changed component name from AdminDashboard to AdminLayout
const AdminLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const navItems = [
		{ icon: faTachometerAlt, label: "Dashboard", active: true },
		{ icon: faBullhorn, label: "Campaigns", active: false },
		{ icon: faUsers, label: "Users", active: false },
		{ icon: faFileAlt, label: "Reports", active: false },
	];

	// Sidebar component (to reuse for both desktop and mobile)
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
					<a
						key={index}
						href="#"
						className={`flex items-center p-3 rounded-md ${
							item.active
								? "bg-muted text-primary"
								: "text-primary hover:bg-muted"
						}`}
					>
						<FontAwesomeIcon icon={item.icon} className="w-5 h-5" />
						<span className="ml-3">{item.label}</span>
					</a>
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
