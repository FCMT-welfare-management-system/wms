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
} from "@fortawesome/free-solid-svg-icons";

// Define interface for campaign
interface Campaign {
	id: string;
	title: string;
	category: string;
	goal: number;
	raised: number;
	description: string;
	createdAt: string;
	imageUrl: string;
}

const mockCampaigns: Campaign[] = [
	{
		id: "2",
		title: "Mental Health Awareness Week",
		category: "Health",
		goal: 200000,
		raised: 87500,
		description:
			"Supporting activities and resources for promoting mental health awareness and wellbeing among students. This campaign will fund counseling sessions, wellness workshops, and stress management seminars throughout the academic year to ensure students have access to the mental health support they need.",
		createdAt: "2025-02-01",
		imageUrl:
			"https://images.unsplash.com/photo-1573739022854-abceaeb585dc?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "3",
		title: "Computer Lab Equipment Upgrade",
		category: "Education",
		goal: 750000,
		raised: 425000,
		description:
			"Upgrading essential computer lab equipment to enhance learning experiences for all students. The current lab computers are over 5 years old and struggling to run modern software needed for coursework. This upgrade will provide state-of-the-art workstations with industry-standard software.",
		createdAt: "2025-02-20",
		imageUrl:
			"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "4",
		title: "Sports Team Uniforms",
		category: "Sports",
		goal: 150000,
		raised: 112500,
		description:
			"Providing new uniforms for university sports teams to represent our institution with pride. Our teams compete at regional and national levels, and new uniforms will boost team morale and create a stronger sense of identity. The funds will cover uniforms for basketball, volleyball, football, and athletics teams.",
		createdAt: "2025-03-05",
		imageUrl:
			"https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "5",
		title: "Scholarship Fund for Disadvantaged Students",
		category: "Education",
		goal: 1000000,
		raised: 650000,
		description:
			"Creating opportunities for academically talented students from disadvantaged backgrounds. These scholarships will cover tuition, books, and living expenses for students who demonstrate academic excellence but face financial barriers to higher education. Your contribution directly impacts a student's future.",
		createdAt: "2025-02-10",
		imageUrl:
			"https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "6",
		title: "Campus Sustainability Initiative",
		category: "Environment",
		goal: 300000,
		raised: 125000,
		description:
			"Transforming our campus into a more sustainable environment with solar panels, water-saving fixtures, and waste reduction programs. This initiative aims to reduce our carbon footprint and create a model for sustainable campus operations. Projects include installing solar panels on key buildings and implementing a comprehensive recycling program.",
		createdAt: "2025-03-12",
		imageUrl:
			"https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "7",
		title: "Art & Culture Festival",
		category: "Culture",
		goal: 250000,
		raised: 75000,
		description:
			"Celebrating diversity and creativity through an annual arts and culture festival showcasing student talents. This week-long event features music performances, art exhibitions, cultural showcases, and interactive workshops. Funds will cover venue costs, equipment, materials, and honorariums for guest artists and speakers.",
		createdAt: "2025-02-28",
		imageUrl:
			"https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "8",
		title: "Library Resource Expansion",
		category: "Education",
		goal: 450000,
		raised: 280000,
		description:
			"Expanding our library's digital and physical resources to support student research and learning. This campaign will fund new textbooks, research journals, digital subscriptions, and specialized databases across all disciplines. The expansion will ensure students have access to the latest academic resources and create dedicated study spaces.",
		createdAt: "2025-01-20",
		imageUrl:
			"https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "9",
		title: "Student Innovation Hub",
		category: "Technology",
		goal: 800000,
		raised: 220000,
		description:
			"Creating a dedicated space for students to develop entrepreneurial ideas and innovative projects. The Innovation Hub will feature collaborative workspaces, prototyping equipment like 3D printers, mentorship programs, and seed funding for promising student startups. This space will bridge the gap between classroom learning and real-world application.",
		createdAt: "2025-03-01",
		imageUrl:
			"https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop",
	},
	{
		id: "10",
		title: "Campus Food Security Program",
		category: "Welfare",
		goal: 350000,
		raised: 310000,
		description:
			"Tackling student hunger by establishing a campus food pantry and meal voucher system. Many students face food insecurity, which affects their academic performance and wellbeing. This program will ensure all students have reliable access to nutritious food regardless of their financial situation. Your donation helps keep students nourished and focused on their studies.",
		createdAt: "2025-01-05",
		imageUrl:
			"https://images.unsplash.com/photo-1488459716781-31db52582fe9?q=80&w=800&auto=format&fit=crop",
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
	const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>(
		{},
	);

	const toggleCardExpansion = (id: string) => {
		setExpandedCards((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	// Mock function to handle donation action
	const handleDonate = (campaignId: string) => {
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

			{/* Grid layout for all screen sizes */}
			<div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{mockCampaigns.map((campaign) => (
					<div
						key={campaign.id}
						className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all hover:shadow-md"
					>
						{/* Image container with proper aspect ratio */}
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

							{/* Progress section */}
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
											42 donors
										</span>
									</div>
								</div>
							</div>

							{/* Description with expand/collapse functionality */}
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
									onClick={() => handleDonate(campaign.id)}
								>
									Donate Now
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="ml-2"
									onClick={() =>
										console.log(`View details of campaign: ${campaign.id}`)
									}
								>
									<FontAwesomeIcon icon={faEye} className="h-4 w-4" />
								</Button>
							</div>
						</div>
					</div>
				))}
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
					<Button
						variant="outline"
						size="sm"
						onClick={() => (window.location.href = "/about-campaigns")}
					>
						Learn More
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => (window.location.href = "/campaign-history")}
					>
						View Past Campaigns
					</Button>
				</div>
			</div>
		</div>
	);
}
