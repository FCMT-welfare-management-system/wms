import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import type { Route } from "../+types/_index";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Sign Up - Kabarak Student Welfare Management System" },
		{
			name: "description",
			content:
				"Create an account for the Kabarak Student Welfare Management System",
		},
	];
}

export default function SignupPage() {
	return (
		<div className="flex-1 flex justify-center items-center px-4 py-12">
			<div className="w-full max-w-md bg-background/80 backdrop-blur-sm rounded-lg shadow-md p-8">
				<div className="flex justify-center mb-6">
					<img
						src="/kabu-logo-Beveled-shadow.png"
						alt="Kabarak University Logo"
						className="h-16"
					/>
				</div>

				<h2 className="text-h4 font-bold text-brand text-center mb-6">
					Sign Up
				</h2>

				<form className="space-y-6">
					{/* Email Field */}
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-body-sm text-muted-foreground block"
						>
							Email
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								<FontAwesomeIcon icon={faEnvelope} />
							</div>
							<input
								id="email"
								type="email"
								className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
								placeholder="University email address"
								required
							/>
						</div>
					</div>

					{/* Password Field */}
					<div className="space-y-2">
						<label
							htmlFor="password"
							className="text-body-sm text-muted-foreground block"
						>
							Password
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								<FontAwesomeIcon icon={faLock} />
							</div>
							<input
								id="password"
								type="password"
								className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
								placeholder="Password"
								required
							/>
						</div>
					</div>

					{/* Confirm Password Field */}
					<div className="space-y-2">
						<label
							htmlFor="confirmPassword"
							className="text-body-sm text-muted-foreground block"
						>
							Confirm Password
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
								<FontAwesomeIcon icon={faLock} />
							</div>
							<input
								id="confirmPassword"
								type="password"
								className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
								placeholder="Confirm password"
								required
							/>
						</div>
					</div>

					{/* Submit Button */}
					<Button variant="accent" fullWidth type="submit">
						Sign Up
					</Button>
				</form>

				<div className="mt-8 pt-6 border-t border-border text-center">
					<p className="text-muted-foreground">
						Already have an account?{" "}
						<Link
							to="/login"
							className="text-brand font-medium hover:underline"
						>
							Log in
						</Link>
					</p>
				</div>

				<div className="mt-6 text-center">
					<Link to="/" className="text-brand hover:underline text-body-sm">
						Back to Home
					</Link>
				</div>
			</div>
		</div>
	);
}
