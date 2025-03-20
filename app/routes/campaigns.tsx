import { useState } from "react";
import { Button } from "#app/components/ui/button";
import { Badge } from "#app/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarAlt,
	faEye,
	faUsers,
	faChevronDown,
	faChevronUp,
	faHandHoldingHeart,
} from "@fortawesome/free-solid-svg-icons";
import { count, desc, eq } from "drizzle-orm";
import type { Route } from "./+types/campaigns";
import { db } from "database/context";
import { campaigns, donations } from "database/schema";
import { GeneralErrorBoundary } from "#app/components/ui/error-boundary.js";

interface Campaign {
	id: string;
	title: string;
	category: string;
	goal: number;
	raised: number;
	description: string;
	createdAt: string;
	imageUrl: string;
	donorCount: number;
}

export async function loader({ request }: Route.LoaderArgs) {
	const campaignsData = await db.query.campaigns.findMany({
		orderBy: [desc(campaigns.createdAt)],
		with: {
			images: {
				limit: 1,
			},
		},
	});

	const campaignsWithDonorCounts = await Promise.all(
		campaignsData.map(async (campaign) => {
			const donorsResult = await db
				.select({ count: count() })
				.from(donations)
				.where(eq(donations.campaignId, campaign.id));

			const donorCount = donorsResult[0]?.count || 0;

			return {
				id: campaign.id,
				title: campaign.title,
				category: campaign.category,
				goal: campaign.goal,
				raised: campaign.raised,
				description: campaign.description,
				createdAt: campaign.createdAt.toISOString(),
				imageUrl:
					campaign.images[0]?.url ||
					"https://placehold.co/800x400/gray/white?text=No+Image",
				donorCount,
			};
		}),
	);

	return { campaigns: campaignsWithDonorCounts };
}

const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-KE", {
		style: "currency",
		currency: "KES",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export default function Campaigns({ loaderData }: Route.ComponentProps) {
	const { campaigns } = loaderData;
	const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
		{},
	);

	const toggleCardExpansion = (id: string) => {
		setExpandedCards((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col space-y-4">
				<h1 className="text-3xl font-bold text-foreground">
					Student Welfare Campaigns
				</h1>
				<p className="text-muted-foreground">
					Support student initiatives and make a difference by contributing to
					these fundraising campaigns.
				</p>
			</div>

			<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{campaigns.map((campaign) => (
					<div
						key={campaign.id}
						className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
					>
						<div className="relative h-48 w-full overflow-hidden">
							<img
								src={campaign.imageUrl}
								alt={campaign.title}
								className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
							/>
							<Badge
								className="absolute left-3 top-3 bg-background/80 backdrop-blur-sm"
								variant="outline"
							>
								{campaign.category}
							</Badge>
						</div>

						<div className="p-5">
							<div className="mb-3 flex items-center justify-between">
								<h3 className="text-lg font-bold">{campaign.title}</h3>
								<div className="flex items-center text-xs text-muted-foreground">
									<FontAwesomeIcon
										icon={faCalendarAlt}
										className="mr-1 h-3 w-3"
									/>
									{new Date(campaign.createdAt).toLocaleDateString()}
								</div>
							</div>

							<div className="mb-4 mt-3">
								<div className="flex justify-between text-sm">
									<span>
										Raised:{" "}
										<span className="font-semibold">
											{formatCurrency(campaign.raised)}
										</span>
									</span>
									<span>
										Goal:{" "}
										<span className="font-semibold">
											{formatCurrency(campaign.goal)}
										</span>
									</span>
								</div>

								<div className="mt-2">
									<div className="h-2 w-full rounded-full bg-muted">
										<div
											className="h-2 rounded-full bg-brand"
											style={{
												width: `${Math.min(
													100,
													(campaign.raised / campaign.goal) * 100,
												)}%`,
											}}
										/>
									</div>
									<div className="mt-1 flex justify-between text-xs text-muted-foreground">
										<span>
											{Math.round((campaign.raised / campaign.goal) * 100)}%
											funded
										</span>
										<span>
											<FontAwesomeIcon
												icon={faUsers}
												className="mr-1 h-3 w-3"
											/>{" "}
											{campaign.donorCount} donors
										</span>
									</div>
								</div>
							</div>

							<div className="mb-4">
								<div
									className={`relative overflow-hidden transition-all duration-300 ${
										expandedCards[campaign.id] ? "max-h-40" : "max-h-12"
									}`}
								>
									<p className="text-sm text-muted-foreground">
										{campaign.description}
									</p>
									{!expandedCards[campaign.id] && (
										<div className="absolute bottom-0 left-0 h-6 w-full bg-gradient-to-t from-card to-transparent" />
									)}
								</div>
								<button
									onClick={() => toggleCardExpansion(campaign.id)}
									className="mt-1 flex items-center text-xs text-brand hover:text-brand/80"
								>
									{expandedCards[campaign.id] ? (
										<>
											Show less{" "}
											<FontAwesomeIcon
												icon={faChevronUp}
												className="ml-1 h-3 w-3"
											/>
										</>
									) : (
										<>
											Show more{" "}
											<FontAwesomeIcon
												icon={faChevronDown}
												className="ml-1 h-3 w-3"
											/>
										</>
									)}
								</button>
							</div>

							<div className="flex items-center justify-between">
								<Button
									variant="brand"
									className="w-full"
									href={`/campaigns/${campaign.id}/donate`}
								>
									<FontAwesomeIcon
										icon={faHandHoldingHeart}
										className="mr-2 h-4 w-4"
									/>
									Donate Now
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="ml-2"
									href={`/campaigns/${campaign.id}`}
								>
									<FontAwesomeIcon icon={faEye} className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Empty state - only show if no campaigns */}
			{campaigns.length === 0 && (
				<div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
					<div className="text-muted-foreground">
						No campaigns available at the moment.
					</div>
					<p className="mt-2 text-sm text-muted-foreground">
						Check back later for upcoming student welfare initiatives.
					</p>
				</div>
			)}
		</div>
	);
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
