import { Form, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTachometerAlt,
	faDonate,
	faHistory,
	faUser,
	faQuestionCircle,
	faBars,
	faTimes,
	faUserCircle,
	faChevronDown,
	faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";

interface NavProps {
	username: string | undefined;
	role: "user" | "admin" | undefined;
}

export default function Nav({ username, role }: NavProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasJSLoaded, setHasJSLoaded] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const userDropdownRef = useRef<HTMLDivElement>(null);

	const isAdmin = role === "admin";

	useEffect(() => {
		setHasJSLoaded(true);

		// Close dropdown when clicking outside
		const handleClickOutside = (event: MouseEvent) => {
			if (
				userDropdownRef.current &&
				!userDropdownRef.current.contains(event.target as Node)
			) {
				setIsUserDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768 && isMenuOpen) {
				setIsMenuOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isMenuOpen]);

	return (
		<header className="flex items-center bg-brand h-16 px-4 md:px-6 relative">
			{/* Logo Section */}
			<div className="flex items-center">
				<img
					src="/kabu-logo-Beveled-shadow.png"
					alt="Kabarak University Logo"
					className="h-[50px] md:h-[60px]"
				/>
			</div>

			{/* Desktop Navigation - Always shown */}
			<nav className="hidden md:block flex-1">
				<ul className="flex ml-6 h-full items-center">
					<NavItem to="/" icon={faTachometerAlt} label="Dashboard" />
					<NavItem to="/campaigns" icon={faDonate} label="Campaigns" />
					<NavItem to="/" icon={faHistory} label="Contribution History" />
					<NavItem to="/" icon={faUser} label="Profile" />
					<NavItem to="/" icon={faQuestionCircle} label="Help" />
					{isAdmin && (
						<NavItem to="/admin" icon={faShieldAlt} label="Admin Dashboard" />
					)}
				</ul>
			</nav>

			{/* Conditional Profile Widget or Login Button - Desktop */}
			<div className="hidden md:flex items-center ml-auto">
				{username ? (
					<div className="relative" ref={userDropdownRef}>
						<button
							className="flex items-center gap-2 text-white px-3 py-2 hover:bg-brand-darker rounded-md transition-colors"
							onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
						>
							<FontAwesomeIcon
								icon={faUserCircle}
								size="2x"
								className="text-primary-foreground"
							/>
							<div className="flex flex-col items-start">
								<span className="text-sm font-medium">{username}</span>
								<span className="text-xs opacity-80">View Profile</span>
							</div>
							<FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
						</button>

						{/* User Dropdown */}
						{isUserDropdownOpen && (
							<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg z-10">
								<div className="py-1">
									<Link
										to="/"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={() => setIsUserDropdownOpen(false)}
									>
										Your Profile
									</Link>
									<Link
										to="/settings"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={() => setIsUserDropdownOpen(false)}
									>
										Settings
									</Link>
									{/* Admin link in dropdown too */}
									{isAdmin && (
										<Link
											to="/admin"
											className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
											onClick={() => setIsUserDropdownOpen(false)}
										>
											Admin Dashboard
										</Link>
									)}
									<div className="border-t border-gray-200"></div>
									<Form
										className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										method="post"
										action="/logout"
									>
										<button type="submit" className="w-full text-left">
											Log out
										</button>
									</Form>
								</div>
							</div>
						)}
					</div>
				) : (
					<Button variant={"default"} href="/login">
						Log in
					</Button>
				)}
			</div>

			{/* Mobile navigation controls */}
			<div className="md:hidden ml-auto flex items-center gap-3">
				{/* Conditional Profile or Login - Mobile */}
				{username ? (
					<Link to="/" className="flex items-center relative">
						<div className="relative">
							<FontAwesomeIcon
								icon={faUserCircle}
								className="text-primary-foreground text-3xl"
							/>
							<span className="absolute -bottom-3 left-0 right-0 text-center text-xs text-white font-medium truncate max-w-[40px]">
								{username.split(" ")[0]}
							</span>
						</div>
					</Link>
				) : (
					<Button variant={"default"} href="/login" size="sm">
						Log in
					</Button>
				)}

				{/* Hamburger Menu Button - FIXED */}
				<button
					className="text-white p-2 block"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Toggle menu"
				>
					<FontAwesomeIcon
						icon={isMenuOpen ? faTimes : faBars}
						className="text-xl"
					/>
					{/* Fallback in case icon doesn't load */}
					<span className="sr-only">Menu</span>
				</button>
			</div>

			{/* Mobile Menu Dropdown */}
			<div
				className={`
					absolute top-16 left-0 right-0 bg-brand shadow-lg z-50 md:hidden
					${hasJSLoaded ? (isMenuOpen ? "block" : "hidden") : "block md:hidden"}
				`}
			>
				{/* For non-JS environments, use checkbox hack for toggle */}
				{!hasJSLoaded && (
					<>
						<input
							type="checkbox"
							id="menu-toggle"
							className="hidden peer"
							aria-label="Toggle mobile menu"
						/>
						<label
							htmlFor="menu-toggle"
							className="absolute top-[-3rem] right-4 md:hidden text-white p-2 cursor-pointer"
						>
							<FontAwesomeIcon icon={faBars} className="text-xl" />
						</label>
					</>
				)}

				<ul
					className={`
					flex flex-col w-full
					${!hasJSLoaded ? "hidden peer-checked:block" : ""}
				`}
				>
					{/* All navigation links shown regardless of login status */}
					<MobileNavItem to="/" icon={faTachometerAlt} label="Dashboard" />
					<MobileNavItem to="/campaigns" icon={faDonate} label="Campaigns" />
					<MobileNavItem to="/" icon={faHistory} label="Contribution History" />
					<MobileNavItem to="/" icon={faUser} label="Profile" />
					<MobileNavItem to="/" icon={faQuestionCircle} label="Help" />

					{/* Admin Dashboard link in mobile menu - only shown for admins */}
					{isAdmin && (
						<MobileNavItem
							to="/admin"
							icon={faShieldAlt}
							label="Admin Dashboard"
						/>
					)}

					{/* Conditional Sign out option in mobile menu */}
					{username ? (
						<li className="border-t border-brand-darker">
							<Form method="post" action="/logout">
								<button
									type="submit"
									className="flex w-full items-center gap-3 px-6 py-4 text-white hover:bg-brand-darker transition-colors"
								>
									Log out
								</button>
							</Form>
						</li>
					) : (
						<li className="border-t border-brand-darker">
							<Link
								to="/login"
								prefetch="intent"
								className="flex items-center gap-3 px-6 py-4 text-white hover:bg-brand-darker transition-colors"
							>
								<span>Log In</span>
							</Link>
						</li>
					)}
				</ul>
			</div>
		</header>
	);
}

function NavItem({
	to,
	icon,
	label,
}: { to: string; icon: any; label: string }) {
	return (
		<li className="px-3 lg:px-5 h-full flex items-center text-white hover:text-gray-200 transition-colors cursor-pointer border-b-2 border-transparent hover:border-white">
			<Link to={to} className="flex items-center gap-2 h-full">
				<span className="text-lg text-primary-muted">
					<FontAwesomeIcon
						icon={icon}
						className="text-brand-secondary opacity-80"
					/>
				</span>
				<span>{label}</span>
			</Link>
		</li>
	);
}

// Mobile Navigation Item
function MobileNavItem({
	to,
	icon,
	label,
}: { to: string; icon: any; label: string }) {
	return (
		<li className="border-b border-brand-darker">
			<Link
				to={to}
				prefetch="intent"
				className="flex items-center gap-3 px-6 py-4 text-white hover:bg-brand-darker transition-colors"
			>
				<span className="text-lg text-primary-muted">
					<FontAwesomeIcon
						icon={icon}
						className="text-brand-secondary opacity-80"
					/>
				</span>
				<span>{label}</span>
			</Link>
		</li>
	);
}
