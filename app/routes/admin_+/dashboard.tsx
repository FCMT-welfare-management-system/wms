import {
	faBullhorn,
	faPeopleGroup,
	faDollarSign,
	faUserPlus,
	faChartBar,
	faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AdminDashboard() {
	const dashboardMetrics = [
		{
			title: "Total Active Campaigns",
			value: 15, // Replace with actual count
			icon: faBullhorn,
		},
		{
			title: "Total System Members",
			value: 520, // Replace with actual count
			icon: faPeopleGroup,
		},
		{
			title: "Total Funds Raised (KES)",
			value: "1,258,500", // Replace with actual sum
			icon: faDollarSign,
		},
	];

	return (
		<div className="p-4 md:p-6">
			<div className="text-center mb-8">
				<h1 className="text-h3 font-bold text-brand mb-2">Admin Dashboard</h1>
				<p className="text-body-md text-muted-foreground">
					Welcome to the Admin Dashboard. Get an overview of the system, monitor
					key metrics, and manage welfare operations.
				</p>
			</div>

			{/* Stats Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
				{dashboardMetrics.map((metric, index) => (
					<div
						key={index}
						className="bg-card rounded-lg shadow-md p-4 md:p-6 border border-border h-42"
					>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-body-sm md:text-body-md font-medium text-muted-foreground">
								{metric.title}
							</h3>
							<span className="text-brand">
								<FontAwesomeIcon
									icon={metric.icon}
									className="w-5 h-5 md:w-6 md:h-6"
								/>
							</span>
						</div>
						<div className="text-h5 md:text-h4 font-bold text-brand">
							{metric.value}
						</div>
					</div>
				))}
			</div>

			{/* Quick Actions Section */}
			<div className="mt-8 md:mt-10 border-t border-border pt-6">
				<h2 className="text-h5 font-bold text-brand mb-4">Quick Actions</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
					{/* Create New Campaign Card */}
					<div className="bg-card rounded-lg shadow-md p-4 md:p-5 border border-border hover:border-brand transition-colors cursor-pointer">
						<div className="flex items-center mb-3">
							<span className="text-brand p-2 bg-accent rounded-md">
								<FontAwesomeIcon icon={faBullhorn} className="w-5 h-5" />
							</span>
							<h3 className="text-body-md font-medium ml-3">
								Create New Campaign
							</h3>
						</div>
						<p className="text-body-sm text-muted-foreground">
							Initiate a new welfare campaign for students in need.
						</p>
					</div>

					{/* Manage Users Card */}
					<div className="bg-card rounded-lg shadow-md p-4 md:p-5 border border-border hover:border-brand transition-colors cursor-pointer">
						<div className="flex items-center mb-3">
							<span className="text-brand p-2 bg-accent rounded-md">
								<FontAwesomeIcon icon={faUserPlus} className="w-5 h-5" />
							</span>
							<h3 className="text-body-md font-medium ml-3">Manage Users</h3>
						</div>
						<p className="text-body-sm text-muted-foreground">
							Add new student accounts or manage existing user access.
						</p>
					</div>
				</div>
			</div>

			{/* Recent Activity Section */}
			<div className="mt-8 md:mt-10 border-t border-border pt-6">
				<h2 className="text-h5 font-bold text-brand mb-4">Recent Activity</h2>
				<div className="bg-card rounded-lg shadow-md border border-border overflow-hidden">
					<div className="p-3 md:p-4 border-b border-border bg-muted">
						<div className="grid grid-cols-3 md:grid-cols-5 font-medium text-body-sm md:text-body-md">
							<div className="col-span-2">Activity</div>
							<div className="col-span-1 hidden md:block">User</div>
							<div className="col-span-1">Status</div>
							<div className="col-span-1 hidden sm:block">Date</div>
						</div>
					</div>

					<div className="divide-y divide-border">
						{/* Activity Item 1 */}
						<div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
							<div className="grid grid-cols-3 md:grid-cols-5 text-body-xs md:text-body-sm">
								<div className="col-span-2 text-primary">
									New campaign created
								</div>
								<div className="col-span-1 text-muted-foreground hidden md:block">
									John Doe
								</div>
								<div className="col-span-1">
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
										Pending
									</span>
								</div>
								<div className="col-span-1 text-muted-foreground hidden sm:block">
									Mar 16
								</div>
							</div>
						</div>

						{/* Activity Item 2 */}
						<div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
							<div className="grid grid-cols-3 md:grid-cols-5 text-body-xs md:text-body-sm">
								<div className="col-span-2 text-primary">
									User account created
								</div>
								<div className="col-span-1 text-muted-foreground hidden md:block">
									Admin
								</div>
								<div className="col-span-1">
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-brand text-accent-foreground">
										Complete
									</span>
								</div>
								<div className="col-span-1 text-muted-foreground hidden sm:block">
									Mar 15
								</div>
							</div>
						</div>

						{/* Activity Item 3 */}
						<div className="p-3 md:p-4 hover:bg-muted/50 transition-colors">
							<div className="grid grid-cols-3 md:grid-cols-5 text-body-xs md:text-body-sm">
								<div className="col-span-2 text-primary">
									Campaign funds disbursed
								</div>
								<div className="col-span-1 text-muted-foreground hidden md:block">
									Jane Smith
								</div>
								<div className="col-span-1">
									<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-brand text-accent-foreground">
										Complete
									</span>
								</div>
								<div className="col-span-1 text-muted-foreground hidden sm:block">
									Mar 14
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Chart Section */}
			<div className="mt-8 md:mt-10 border-t border-border pt-6">
				<h2 className="text-h5 font-bold text-brand mb-4">
					Campaign Performance
				</h2>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-card rounded-lg shadow-md p-4 md:p-5 border border-border">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-body-md font-medium">
								Funds Raised (Monthly)
							</h3>
							<FontAwesomeIcon
								icon={faChartBar}
								className="text-brand w-5 h-5"
							/>
						</div>
						<div className="h-48 md:h-64 flex items-center justify-center bg-muted/50 rounded-md">
							<span className="text-muted-foreground text-body-sm">
								Chart Placeholder
							</span>
						</div>
					</div>
					<div className="bg-card rounded-lg shadow-md p-4 md:p-5 border border-border">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-body-md font-medium">
								Campaign Distribution
							</h3>
							<FontAwesomeIcon
								icon={faChartLine}
								className="text-brand w-5 h-5"
							/>
						</div>
						<div className="h-48 md:h-64 flex items-center justify-center bg-muted/50 rounded-md">
							<span className="text-muted-foreground text-body-sm">
								Chart Placeholder
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
