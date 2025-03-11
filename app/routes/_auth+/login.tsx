import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/ui/button";
import type { Route } from "./+types/_auth/login";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Login - Kabarak Student Welfare Management System" },
		{
			name: "description",
			content: "Login to access the Kabarak Student Welfare Management System",
		},
	];
}

export default function LoginPage() {
	return (
		<main className="flex flex-col min-h-screen bg-gradient-to-b from-muted to-accent-brand/30">
			{/* Login Card */}
			<div className="flex-1 flex justify-center items-center px-4 py-12">
				<div className="w-full max-w-md bg-background/80 backdrop-blur-sm rounded-lg shadow-md p-8">
					<h2 className="text-h4 font-bold text-brand text-center mb-6">
						Login
					</h2>

					<form className="space-y-6">
						<div className="space-y-2">
							<label
								htmlFor="email"
								className="text-body-sm text-muted-foreground block"
							>
								Email
							</label>
							<div className="relative">
								<div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
									<FontAwesomeIcon icon={faUser} />
								</div>
								<input
									id="email"
									type="email"
									className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
									placeholder="Email address"
									required
								/>
							</div>
						</div>

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

						<Button variant="accent" fullWidth type="submit">
							Log In
						</Button>

						<div className="text-center text-body-sm text-muted-foreground">
							<Link
								to="/forgot-password"
								className="text-brand hover:underline"
							>
								Forgot password?
							</Link>
						</div>
					</form>

					<div className="mt-8 pt-6 border-t border-border text-center">
						<p className="text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/signup"
								className="text-brand font-medium hover:underline"
							>
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
