import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faExclamationTriangle,
	faHome,
	faBan,
	faLock,
	faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";

export function NotFoundComponent() {
	return (
		<div className="flex flex-col items-center justify-center text-center p-8">
			<div className="text-8xl font-bold text-red-600 mb-4">404</div>
			<h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
			<p className="text-gray-600 max-w-md mb-6">
				It seems like you've followed a broken link or entered an incorrect URL.
				Don't worry, it happens to the best of us!
			</p>
			<div className="mt-6">
				<Link
					to="/"
					className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Back to Home</span>
				</Link>
			</div>
		</div>
	);
}

export function UnauthorizedComponent() {
	return (
		<div className="flex flex-col items-center justify-center text-center p-8">
			<div className="text-8xl font-bold text-amber-500 mb-4">
				<FontAwesomeIcon icon={faLock} />
			</div>
			<h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
			<p className="text-gray-600 max-w-md mb-6">
				You don't have permission to access this page. Please log in or contact
				your administrator.
			</p>
			<div className="mt-6 flex gap-4">
				<Link
					to="/login"
					className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
				>
					<span>Login</span>
				</Link>
				<Link
					to="/"
					className="flex items-center gap-2 border border-primary text-primary hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Back to Home</span>
				</Link>
			</div>
		</div>
	);
}

export function ForbiddenComponent() {
	return (
		<div className="flex flex-col items-center justify-center text-center p-8">
			<div className="text-8xl font-bold text-orange-600 mb-4">
				<FontAwesomeIcon icon={faBan} />
			</div>
			<h2 className="text-2xl font-semibold mb-4">Access Forbidden</h2>
			<p className="text-gray-600 max-w-md mb-6">
				You don't have sufficient permissions to access this resource. If you
				believe this is an error, please contact your administrator.
			</p>
			<div className="mt-6">
				<Link
					to="/"
					className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Back to Home</span>
				</Link>
			</div>
		</div>
	);
}

export function ServerErrorComponent() {
	return (
		<div className="flex flex-col items-center justify-center text-center p-8">
			<div className="text-8xl font-bold text-red-700 mb-4">
				<FontAwesomeIcon icon={faExclamationCircle} />
			</div>
			<h2 className="text-2xl font-semibold mb-4">Server Error</h2>
			<p className="text-gray-600 max-w-md mb-6">
				Something went wrong on our servers. We're working on fixing the issue.
				Please try again later or contact support if the problem persists.
			</p>
			<div className="mt-6 flex gap-4">
				<Link
					to="/"
					className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Back to Home</span>
				</Link>
				<button
					onClick={() => window.location.reload()}
					className="flex items-center gap-2 border border-primary text-primary hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
				>
					<span>Try Again</span>
				</button>
			</div>
		</div>
	);
}

export function UnexpectedErrorComponent({ error }: { error: unknown }) {
	return (
		<div className="flex flex-col items-center justify-center text-center p-8">
			<div className="text-8xl font-bold text-red-600 mb-4">
				<FontAwesomeIcon icon={faExclamationTriangle} />
			</div>
			<h2 className="text-2xl font-semibold mb-4">Unexpected Error</h2>
			<p className="text-gray-600 max-w-md mb-6">
				An unexpected error occurred. Our team has been notified.
			</p>
			<div className="p-4 bg-gray-100 rounded-md text-left mb-6 max-w-md overflow-auto">
				<code className="text-sm text-red-600">{getErrorMessage(error)}</code>
			</div>
			<div className="mt-6 flex gap-4">
				<Link
					to="/"
					className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors"
				>
					<FontAwesomeIcon icon={faHome} />
					<span>Back to Home</span>
				</Link>
				<button
					onClick={() => window.location.reload()}
					className="flex items-center gap-2 border border-primary text-primary hover:bg-primary/10 py-2 px-4 rounded-md transition-colors"
				>
					<span>Try Again</span>
				</button>
			</div>
		</div>
	);
}
