import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCloudUploadAlt,
	faLock,
	faChartLine,
	faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Button } from "../components/ui/button";
import type { Route } from "./+types/_index";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Kabarak Student Welfare Management System" },
		{
			name: "description",
			content:
				"A student-run platform dedicated to fostering a supportive community, providing financial assistance, and promoting student well-being.",
		},
	];
}

export function loader({ context }: Route.LoaderArgs) {
	return { message: context.VALUE_FROM_NETLIFY };
}

// Feature data for mapping
const features = [
	{
		title: "Easy Contributions",
		description: "Donate to campaigns quickly and securely through M-Pesa.",
		icon: faCloudUploadAlt,
		key: "1",
	},
	{
		title: "Secure Transactions",
		description:
			"Your financial information is protected with robust security measures.",
		icon: faLock,
		key: "2",
	},
	{
		title: "Transparent Reporting",
		description:
			"Track campaign progress and see how your contributions are used.",
		icon: faChartLine,
		key: "3",
	},
	{
		title: "Dedicated Support",
		description: "Get help when you need it with our support resources.",
		icon: faUserCircle,
		key: "4",
	},
];

export default function Home({ loaderData }: Route.ComponentProps) {
	return (
		<main className="flex flex-col min-h-screen bg-gradient-to-b from-muted to-accent-brand/30">
			{/* Hero Section */}
			<section className="flex flex-col items-center px-4 pt-16 pb-20 md:pt-24 md:pb-32">
				<div className="max-w-3xl w-full bg-background/60  rounded-lg shadow-md p-8 md:p-12 flex flex-col items-center">
					<h1 className="text-h3 md:text-h2 font-bold text-brand mb-4 text-center">
						Support. Connect. Thrive.
					</h1>
					<p className="text-body-md text-center text-muted-foreground mb-8 max-w-xl">
						A student-run platform dedicated to fostering a supportive
						community, providing financial assistance, and promoting student
						well-being.
					</p>
					<Button
						variant="accent"
						size="lg"
						href="/signup"
						className="font-medium"
					>
						Get Started
					</Button>
				</div>
			</section>

			{/* Features Section */}
			<section className="px-4 py-16 md:py-24 max-w-6xl mx-auto w-full">
				<h2 className="text-h4 md:text-h3 font-bold text-brand text-center mb-12">
					Key Features
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
					{features.map((feature) => (
						<div
							key={feature.key}
							className="bg-background rounded-lg shadow-md border border-border hover:border-brand/20 hover:shadow-lg transition-shadow p-6 flex flex-col items-center"
						>
							<div className="mb-4 text-accent-brand text-body-xl">
								<FontAwesomeIcon icon={feature.icon} size="1x" />
							</div>
							<h3 className="text-body-lg font-semibold mb-2 text-foreground text-center">
								{feature.title}
							</h3>
							<p className="text-muted-foreground text-center text-body-sm">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="px-4 py-12 md:py-20 max-w-4xl mx-auto w-full mb-16">
				<div className="bg-primary rounded-xl shadow-lg p-8 md:p-12 text-center text-primary-foreground">
					<h2 className="text-h4 md:text-h3 font-bold mb-4">
						Make a Difference Today
					</h2>
					<p className="text-body-md mb-8 max-w-2xl mx-auto">
						Join our community and support fellow students in need. Every
						contribution makes a difference in building a supportive and
						thriving environment for all.
					</p>
					<Button
						variant="accent"
						size="lg"
						href="/signup"
						className="font-medium"
					>
						Get Started
					</Button>
				</div>
			</section>
		</main>
	);
}
