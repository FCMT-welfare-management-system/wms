import { db } from "database/context";
import { eq } from "drizzle-orm";
import { campaigns } from "database/schema";
import type { Route } from "./+types/$campaignId.edit";
import CampaignEditor from "./__campaign-editor";
import { GeneralErrorBoundary } from "#app/components/ui/error-boundary.js";

export { action } from "./__campaign-editor.server";

export async function loader({ request, params }: Route.LoaderArgs) {
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

	return {
		campaign,
	};
}

export default function CampaignEdit({
	actionData,
	loaderData,
}: Route.ComponentProps) {
	return (
		<CampaignEditor actionData={actionData} campaign={loaderData.campaign} />
	);
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
