import { Link } from "react-router";
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
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import { Button } from "./ui/button";

interface NavProps {
	username: string | undefined;
}

export default function Nav({ username }: NavProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasJSLoaded, setHasJSLoaded] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
	const userDropdownRef = useRef<HTMLDivElement>(null);

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
					<NavItem
						to="/member/dashboard"
						icon={faTachometerAlt}
						label="Dashboard"
					/>
					<NavItem to="/member/campaigns" icon={faDonate} label="Campaigns" />
					<NavItem
						to="/member/history"
						icon={faHistory}
						label="Contribution History"
					/>
					<NavItem to="/member/profile" icon={faUser} label="Profile" />
					<NavItem to="/member/help" icon={faQuestionCircle} label="Help" />
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
										to="/member/profile"
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
									<div className="border-t border-gray-200"></div>
									<Link
										to="/logout"
										className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
										onClick={() => setIsUserDropdownOpen(false)}
									>
										Sign out
									</Link>
								</div>
							</div>
						)}
					</div>
				) : (
					<Button variant={"default"} href="/login">
						log in
					</Button>
				)}
			</div>

			{/* Mobile Header Controls - Always show hamburger menu */}
			<div className="flex items-center ml-auto gap-3 md:hidden">
				{/* Conditional Profile or Login - Mobile */}
				{username ? (
					<Link to="/member/profile" className="flex items-center relative">
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
					<Button variant={"default"} href="/login">
						log in
					</Button>
				)}

				{/* Mobile Menu Button - Always show */}
				<button
					className="text-white p-2"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					aria-label="Toggle menu"
				>
					<FontAwesomeIcon
						icon={isMenuOpen ? faTimes : faBars}
						className="text-xl"
					/>
				</button>
			</div>

			{/* Mobile Navigation Dropdown/Drawer - Always shows all navigation links */}
			<div
				className={`
					absolute top-16 left-0 right-0 bg-brand shadow-lg md:hidden 
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
					<MobileNavItem
						to="/member/dashboard"
						icon={faTachometerAlt}
						label="Dashboard"
					/>
					<MobileNavItem
						to="/member/campaigns"
						icon={faDonate}
						label="Campaigns"
					/>
					<MobileNavItem
						to="/member/history"
						icon={faHistory}
						label="Contribution History"
					/>
					<MobileNavItem to="/member/profile" icon={faUser} label="Profile" />
					<MobileNavItem
						to="/member/help"
						icon={faQuestionCircle}
						label="Help"
					/>

					{/* Conditional Sign out option in mobile menu */}
					{username ? (
						<li className="border-t border-brand-darker">
							<Link
								to="/logout"
								className="flex items-center gap-3 px-6 py-4 text-white hover:bg-brand-darker transition-colors"
							>
								<span>Sign out</span>
							</Link>
						</li>
					) : (
						<li className="border-t border-brand-darker">
							<Link
								to="/login"
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

// Desktop Navigation Item
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
