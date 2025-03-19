import CampaignEditor from "./__campaign-editor";
import type { Route } from "./+types/new";

//INFO: This might may change if the action for updates won't work with creating a new campaign
export { action } from "./__campaign-editor.server";

export default function NewCampaign({ actionData }: Route.ComponentProps) {
	return <CampaignEditor actionData={actionData} />;
}
