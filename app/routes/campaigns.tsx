import { useState } from "react";
import { Button } from "#app/components/ui/button";

// Mock data for campaigns
const mockCampaigns = [
	{
		id: "1",
		title: "Student Emergency Fund",
		category: "Emergency",
		goal: 500000,
		raised: 325000,
		description:
			"Providing immediate financial assistance to students facing unexpected hardships and emergencies.",
		createdAt: "2025-01-15",
		imageUrl: "/images/emergency-fund.jpg",
	},
	{
		id: "2",
		title: "Mental Health Awareness Week",
		category: "Health",
		goal: 200000,
		raised: 87500,
		description:
			"Supporting activities and resources for promoting mental health awareness and wellbeing among students.",
		createdAt: "2025-02-01",
		imageUrl: "/images/mental-health.jpg",
	},
	{
		id: "3",
		title: "Computer Lab Equipment Upgrade",
		category: "Education",
		goal: 750000,
		raised: 425000,
		description:
			"Upgrading essential computer lab equipment to enhance learning experiences for all students.",
		createdAt: "2025-02-20",
		imageUrl: "/images/computer-lab.jpg",
	},
	{
		id: "4",
		title: "Sports Team Uniforms",
		category: "Sports",
		goal: 150000,
		raised: 112500,
		description:
			"Providing new uniforms for university sports teams to represent our institution with pride.",
		createdAt: "2025-03-05",
		imageUrl: "/images/sports-uniforms.jpg",
	},
	{
		id: "5",
		title: "Scholarship Fund for Disadvantaged Students",
		category: "Education",
		goal: 1000000,
		raised: 650000,
		description:
			"Creating opportunities for academically talented students from disadvantaged backgrounds.",
		createdAt: "2025-02-10",
		imageUrl: "/images/scholarship.jpg",
	},
];

// Format currency (Kenyan Shillings)
const formatCurrency = (amount: number) => {
	return new Intl.NumberFormat("en-KE", {
		style: "currency",
		currency: "KES",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export default function Campaigns() {
	const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

	// Mock function to handle donation action
	const handleDonate = (campaignId: string) => {
		setSelectedCampaign(campaignId);
		//INFO:  In the future, this could navigate to a donation form or open a modal
		console.log(`Donating to campaign ID: ${campaignId}`);
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col space-y-4">
				<h1 className="text-3xl font-bold text-foreground">
					Student Welfare Campaigns
				</h1>
				<p className="text-muted-foreground">
					Support our ongoing initiatives to improve student welfare and
					educational experiences.
				</p>
			</div>

			{/* Card based layout for small screens */}
			<div className="mt-8 grid gap-6 md:hidden">
				{mockCampaigns.map((campaign) => (
					<div
						key={campaign.id}
						className="rounded-lg border border-border bg-card p-4 shadow-sm"
					>
						<div className="flex flex-col space-y-3">
							<h3 className="text-lg font-semibold">{campaign.title}</h3>
							<div className="flex justify-between text-sm">
								<span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
									{campaign.category}
								</span>
								<span className="text-muted-foreground">
									{new Date(campaign.createdAt).toLocaleDateString()}
								</span>
							</div>

							<div className="mt-2 space-y-1">
								<div className="flex justify-between text-sm">
									<span>Goal:</span>
									<span className="font-medium">
										{formatCurrency(campaign.goal)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span>Raised:</span>
									<span className="font-medium">
										{formatCurrency(campaign.raised)}
									</span>
								</div>
							</div>

							{/* Progress bar */}
							<div className="mt-2">
								<div className="h-2 w-full rounded-full bg-muted">
									<div
										className="h-2 rounded-full bg-brand"
										style={{
											width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%`,
										}}
									/>
								</div>
								<div className="mt-1 text-right text-xs text-muted-foreground">
									{Math.round((campaign.raised / campaign.goal) * 100)}% funded
								</div>
							</div>

							<Button
								variant="brand"
								className="mt-3"
								fullWidth
								onClick={() => handleDonate(campaign.id)}
							>
								Donate Now
							</Button>
						</div>
					</div>
				))}
			</div>

			{/* Table layout for medium and larger screens */}
			<div className="mt-8 hidden overflow-x-auto rounded-lg border border-border md:block">
				<table className="w-full">
					<thead className="border-b border-border bg-muted/50">
						<tr>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Title
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Category
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Goal (Ksh)
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Raised (Ksh)
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Progress
							</th>
							<th className="p-4 text-left font-medium text-muted-foreground">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-border">
						{mockCampaigns.map((campaign) => (
							<tr
								key={campaign.id}
								className="bg-card transition-colors hover:bg-muted/20"
							>
								<td className="p-4">
									<div className="font-medium">{campaign.title}</div>
									<div className="text-xs text-muted-foreground">
										Created {new Date(campaign.createdAt).toLocaleDateString()}
									</div>
								</td>
								<td className="p-4">
									<span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
										{campaign.category}
									</span>
								</td>
								<td className="p-4">{formatCurrency(campaign.goal)}</td>
								<td className="p-4">{formatCurrency(campaign.raised)}</td>
								<td className="p-4">
									<div className="flex w-full max-w-[200px] items-center gap-2">
										<div className="h-2 w-full rounded-full bg-muted">
											<div
												className="h-2 rounded-full bg-brand"
												style={{
													width: `${Math.min(100, (campaign.raised / campaign.goal) * 100)}%`,
												}}
											/>
										</div>
										<span className="whitespace-nowrap text-xs text-muted-foreground">
											{Math.round((campaign.raised / campaign.goal) * 100)}%
										</span>
									</div>
								</td>
								<td className="p-4">
									<Button
										variant="brand"
										size="sm"
										onClick={() => handleDonate(campaign.id)}
									>
										Donate
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Empty state - only show if no campaigns */}
			{mockCampaigns.length === 0 && (
				<div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
					<div className="text-muted-foreground">
						No active campaigns available at the moment.
					</div>
					<p className="mt-2 text-sm text-muted-foreground">
						Check back later for opportunities to support student welfare
						initiatives.
					</p>
				</div>
			)}

			{/* Additional information section */}
			<div className="mt-12 rounded-lg border border-border bg-muted/20 p-6">
				<h2 className="text-xl font-semibold">About Our Campaigns</h2>
				<p className="mt-2 text-muted-foreground">
					All donations go directly to supporting student welfare initiatives.
					Our campaigns are verified and monitored to ensure funds are used for
					their intended purpose.
				</p>
				<div className="mt-4 flex flex-wrap gap-2">
					<Button variant="outline" href="/about-campaigns" size="sm">
						Learn More
					</Button>
					<Button variant="ghost" href="/campaign-history" size="sm">
						View Past Campaigns
					</Button>
				</div>
			</div>
		</div>
	);
}
