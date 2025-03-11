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
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface NavProps {
	isLoggedIn?: boolean;
}

export default function Nav({ isLoggedIn = false }: NavProps) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [hasJSLoaded, setHasJSLoaded] = useState(false);

	// Mark JS as loaded after initial render
	useEffect(() => {
		setHasJSLoaded(true);
	}, []);

	// Close mobile menu on window resize to desktop size
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

			{isLoggedIn ? (
				<>
					{/* Mobile Menu Button */}
					<button
						className="ml-auto md:hidden text-white p-2"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						aria-label="Toggle menu"
					>
						<FontAwesomeIcon
							icon={isMenuOpen ? faTimes : faBars}
							className="text-xl"
						/>
					</button>

					{/* Desktop Navigation */}
					<nav className="hidden md:block flex-1">
						<ul className="flex ml-6 h-full items-center">
							<NavItem
								to="/member/dashboard"
								icon={faTachometerAlt}
								label="Dashboard"
							/>
							<NavItem
								to="/member/campaigns"
								icon={faDonate}
								label="Campaigns"
							/>
							<NavItem
								to="/member/history"
								icon={faHistory}
								label="Contribution History"
							/>
							<NavItem to="/member/profile" icon={faUser} label="Profile" />
							<NavItem to="/member/help" icon={faQuestionCircle} label="Help" />
						</ul>
					</nav>

					{/* Mobile Navigation Dropdown/Drawer - with progressive enhancement */}
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
							<MobileNavItem
								to="/member/profile"
								icon={faUser}
								label="Profile"
							/>
							<MobileNavItem
								to="/member/help"
								icon={faQuestionCircle}
								label="Help"
							/>
						</ul>
					</div>
				</>
			) : (
				/* For non-logged in users */
				<>
					<Button variant={"default"} className="ml-auto">
						<Link to="/login">Log In</Link>
					</Button>
				</>
			)}
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
