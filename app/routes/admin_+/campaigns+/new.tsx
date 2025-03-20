import CampaignEditor from "./__campaign-editor";
import type { Route } from "./+types/new";
import { GeneralErrorBoundary } from "#app/components/ui/error-boundary.js";

//INFO: This might may change if the action for updates won't work with creating a new campaign
export { action } from "./__campaign-editor.server";

export default function NewCampaign({ actionData }: Route.ComponentProps) {
	return <CampaignEditor actionData={actionData} />;
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />;
}
