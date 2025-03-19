import { Link } from "react-router";
import { eq, count } from "drizzle-orm";
import { db } from "database/context";
import { campaigns, donations } from "database/schema";
import { Button } from "#app/components/ui/button";
import { Badge } from "#app/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarAlt,
	faArrowLeft,
	faEdit,
	faCheck,
	faTimes,
	faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import type { Route } from "./+types/$campaignId.show";

export async function loader({ params }: Route.LoaderArgs) {
	const { campaignId } = params;

	if (!campaignId) {
		throw new Response("Campaign ID is required", { status: 400 });
	}

	const campaign = await db.query.campaigns.findFirst({
		where: eq(campaigns.id, campaignId),
		with: {
			images: true,
		},
	});

	if (!campaign) {
		throw new Response("Campaign not found", { status: 404 });
	}

	const donorsResult = await db
		.select({ count: count() })
		.from(donations)
		.where(eq(donations.campaignId, campaignId));

	const donorCount = donorsResult[0]?.count || 0;

	const recentDonations = await db.query.donations.findMany({
		where: eq(donations.campaignId, campaignId),
		with: {
			donor: true,
		},
		limit: 5,
		orderBy: (donations, { desc }) => [desc(donations.createdAt)],
	});

	return {
		campaign,
		donorCount,
		recentDonations,
	};
}

// Format currency (Kenyan Shillings)
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-KE", {
		style: "currency",
		currency: "KES",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

// Format date
const formatDate = (date: string) => {
	return new Date(date).toLocaleDateString("en-KE", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const statusStyles = {
	active: "bg-green-100 text-green-800",
	completed: "bg-blue-100 text-blue-800",
	cancelled: "bg-red-100 text-red-800",
};

const statusIcons = {
	active: faCheck,
	completed: faCheck,
	cancelled: faTimes,
};

export default function CampaignShow({ loaderData }: Route.ComponentProps) {
	const { campaign, donorCount, recentDonations } = loaderData;

	const mainImage =
		campaign.images.length > 0
			? campaign.images[0].url
			: "https://placehold.co/1200x600/gray/white?text=No+Image";

	// Calculate progress percentage
	const progressPercentage = Math.min(
		100,
		Math.round((campaign.raised / campaign.goal) * 100),
	);

	return (
		<div className="container mx-auto px-4 py-8">
			<Link
				to="/admin/campaigns"
				className="flex items-center text-sm text-muted-foreground mb-6 hover:text-foreground"
			>
				<FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back to
				Campaigns
			</Link>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main content area */}
				<div className="lg:col-span-2 space-y-6">
					{/* Campaign image */}
					<div className="relative rounded-lg overflow-hidden h-80">
						<img
							src={mainImage}
							alt={campaign.title}
							className="w-full h-full object-cover"
						/>
						<Badge
							className={`absolute top-4 right-4 ${statusStyles[campaign.status as keyof typeof statusStyles]}`}
						>
							<FontAwesomeIcon
								icon={
									statusIcons[campaign.status as keyof typeof statusIcons] ||
									faExclamationTriangle
								}
								className="mr-1"
							/>
							{campaign.status.charAt(0).toUpperCase() +
								campaign.status.slice(1)}
						</Badge>
					</div>

					{/* Campaign header */}
					<div>
						<div className="flex justify-between items-center">
							<h1 className="text-3xl font-bold text-foreground">
								{campaign.title}
							</h1>
							<Badge variant="outline" className="text-sm">
								{campaign.category
									.replace("_", " ")
									.split(" ")
									.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
									.join(" ")}
							</Badge>
						</div>
						<div className="flex items-center text-sm text-muted-foreground mt-2">
							<FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
							Created on {formatDate(campaign.createdAt.toString())}
						</div>
					</div>

					{/* Progress section */}
					<div className="bg-card rounded-lg p-6 border border-border">
						<div className="flex justify-between">
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

						<div className="mt-4">
							<div className="h-3 w-full rounded-full bg-muted overflow-hidden">
								<div
									className="h-full rounded-full bg-brand"
									style={{
										width: `${progressPercentage}%`,
									}}
								/>
							</div>
							<div className="mt-2 text-center text-sm">
								<span className="font-bold">{progressPercentage}%</span> funded
								by <span className="font-bold">{donorCount}</span> donors
							</div>
						</div>
					</div>

					<div className="bg-card rounded-lg p-6 border border-border">
						<h2 className="text-xl font-bold mb-3">About This Campaign</h2>
						<p className="text-muted-foreground whitespace-pre-line">
							{campaign.description}
						</p>
					</div>

					<div className="bg-card rounded-lg p-6 border border-border">
						<h2 className="text-xl font-bold mb-3">Campaign Timeline</h2>
						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Start Date</p>
								<p className="font-semibold">
									{formatDate(campaign.startDate.toString())}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">End Date</p>
								<p className="font-semibold">
									{campaign.endDate
										? formatDate(campaign.endDate.toString())
										: "No end date set"}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Last Updated</p>
								<p className="font-semibold">
									{formatDate(campaign.updatedAt.toString())}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Status</p>
								<p className="font-semibold capitalize">{campaign.status}</p>
							</div>
						</div>
					</div>

					{campaign.images.length > 1 && (
						<div className="bg-card rounded-lg p-6 border border-border">
							<h2 className="text-xl font-bold mb-3">Campaign Images</h2>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{campaign.images.map((image, index) => (
									<div
										key={image.id}
										className="rounded-lg overflow-hidden h-40"
									>
										<img
											src={image.url}
											alt={image.altText || `Campaign image ${index + 1}`}
											className="w-full h-full object-cover"
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="space-y-6">
					<div className="bg-card rounded-lg p-6 border border-border">
						<h2 className="text-xl font-bold mb-4">Campaign Actions</h2>
						<div className="space-y-3">
							<Button
								variant="brand"
								className="w-full flex items-center justify-center"
								href={`/admin/campaigns/${campaign.id}/edit`}
							>
								<FontAwesomeIcon icon={faEdit} className="mr-2" /> Update
								Campaign
							</Button>

							<Button
								variant="outline"
								className="w-full"
								href={`/admin/campaigns/${campaign.id}/donations`}
							>
								View All Donations
							</Button>
						</div>
					</div>

					{/* Campaign statistics */}
					<div className="bg-card rounded-lg p-6 border border-border">
						<h2 className="text-xl font-bold mb-3">Campaign Statistics</h2>
						<div className="grid grid-cols-2 gap-4">
							<div className="bg-muted/30 p-3 rounded-lg text-center">
								<p className="text-3xl font-bold">{donorCount}</p>
								<p className="text-xs text-muted-foreground">Total Donors</p>
							</div>
							<div className="bg-muted/30 p-3 rounded-lg text-center">
								<p className="text-3xl font-bold">
									{formatCurrency(campaign.raised)}
								</p>
								<p className="text-xs text-muted-foreground">Total Raised</p>
							</div>
							<div className="bg-muted/30 p-3 rounded-lg text-center">
								<p className="text-3xl font-bold">{progressPercentage}%</p>
								<p className="text-xs text-muted-foreground">Funded</p>
							</div>
							<div className="bg-muted/30 p-3 rounded-lg text-center">
								<p className="text-3xl font-bold">
									{campaign.raised > 0 && donorCount > 0
										? formatCurrency(Math.round(campaign.raised / donorCount))
										: formatCurrency(0)}
								</p>
								<p className="text-xs text-muted-foreground">Avg Donation</p>
							</div>
						</div>
					</div>

					{/* Recent donations */}
					<div className="bg-card rounded-lg p-6 border border-border">
						<h2 className="text-xl font-bold mb-3">Recent Donations</h2>
						{recentDonations.length > 0 ? (
							<ul className="space-y-3">
								{recentDonations.map((donation) => (
									<li
										key={donation.id}
										className="border-b border-border pb-3 last:border-0"
									>
										<div className="flex justify-between items-center">
											<span className="font-medium">
												{donation.anonymous ? "Anonymous" : donation.donor.name}
											</span>
											<span className="font-bold">
												{formatCurrency(donation.amount)}
											</span>
										</div>
										{donation.message && (
											<p className="text-sm text-muted-foreground mt-1 italic">
												"{donation.message}"
											</p>
										)}
										<p className="text-xs text-muted-foreground mt-1">
											{new Date(donation.createdAt).toLocaleDateString()}
										</p>
									</li>
								))}
							</ul>
						) : (
							<p className="text-muted-foreground text-center py-3">
								No donations yet
							</p>
						)}

						<Button
							variant="ghost"
							className="w-full mt-3 text-sm"
							href={`/admin/campaigns/${campaign.id}/donations`}
						>
							View All Donations
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
