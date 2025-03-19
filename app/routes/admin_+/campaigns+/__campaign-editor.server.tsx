import { uploadImages } from "#app/utils/cloudinary.server.js";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import { db } from "database/context";
import { campaignImages, campaigns } from "database/schema";
import { data, redirect, type ActionFunctionArgs } from "react-router";
import { CampaignSchema, MAX_UPLOAD_SIZE } from "./__campaign-editor";

export async function action({ request, params }: ActionFunctionArgs) {
	const formData = await parseFormData(request, {
		maxFileSize: MAX_UPLOAD_SIZE,
	});
	const submission = await parseWithZod(formData, {
		schema: CampaignSchema.superRefine(async (data, ctx) => {
			const [campaign] = await db
				.insert(campaigns)
				.values({
					title: data.title,
					description: data.description,
					goal: data.goal,
					category: data.category,
					raised: data.raised,
					status: data.status,
					startDate: data.startDate,
					endDate: data.endDate,
				})
				.returning({ id: campaigns.id });
			const cloudinaryImages = await uploadImages(data.images);
			const images = cloudinaryImages.map((image) => {
				return {
					campaignId: campaign.id,
					...image,
				};
			});
			await db.insert(campaignImages).values(images);
			return { id: campaign.id, ...data };
		}),
		async: true,
	});
	if (submission.status !== "success")
		return data(
			{
				result: submission.reply(),
			},
			{
				status: 400,
			},
		);

	//FIX:  make use redirect to the updated campaignId instead
	return redirect(`/admin/campaigns/`);
}
