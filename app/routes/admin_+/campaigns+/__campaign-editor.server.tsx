import {
	uploadImages,
	deleteCloudinaryImages,
} from "#app/utils/cloudinary.server.js";
import { parseWithZod } from "@conform-to/zod";
import { parseFormData } from "@mjackson/form-data-parser";
import { db } from "database/context";
import { campaignImages, campaigns } from "database/schema";
import { data, redirect, type ActionFunctionArgs } from "react-router";
import { CampaignSchema, MAX_UPLOAD_SIZE } from "./__campaign-editor";
import { and, eq, notInArray } from "drizzle-orm";
import { requireUserId } from "#app/utils/auth.server.js";
import { isAdmin } from "../_admin";

interface CampaignResult {
	id: string;
}

export async function action({ request, params }: ActionFunctionArgs) {
	const userId = await requireUserId(request);
	if (!isAdmin(userId))
		throw data(
			{},
			{
				status: 400,
			},
		);
	const formData = await parseFormData(request, {
		maxFileSize: MAX_UPLOAD_SIZE,
	});

	const campaignId = params.campaignId;
	const isUpdate = !!campaignId;

	const submission = await parseWithZod(formData, {
		schema: CampaignSchema.superRefine(async (data, ctx) => {
			const campaignData = {
				title: data.title,
				description: data.description,
				goal: data.goal,
				category: data.category,
				raised: data.raised,
				status: data.status,
				startDate: data.startDate,
				endDate: data.endDate,
			};

			let resultCampaign: CampaignResult;

			if (isUpdate) {
				const updateResult = await db
					.update(campaigns)
					.set(campaignData)
					.where(eq(campaigns.id, campaignId as string))
					.returning({ id: campaigns.id });

				resultCampaign = updateResult[0];

				if (data.images?.length) {
					const existingImageIds = data.images
						.filter((img) => img.id)
						.map((img) => img.id as string);

					const imagesToDelete = await db
						.select({ cloudinaryId: campaignImages.cloudinaryId })
						.from(campaignImages)
						.where(
							and(
								eq(campaignImages.campaignId, campaignId as string),
								notInArray(campaignImages.id, existingImageIds),
							),
						);

					if (imagesToDelete.length > 0) {
						const cloudinaryIds = imagesToDelete
							.map((img) => img.cloudinaryId)
							.filter((id): id is string => id !== null && id !== undefined);

						if (cloudinaryIds.length > 0) {
							await deleteCloudinaryImages(cloudinaryIds);
						}
					}

					if (existingImageIds.length > 0) {
						await db
							.delete(campaignImages)
							.where(
								and(
									eq(campaignImages.campaignId, campaignId as string),
									notInArray(campaignImages.id, existingImageIds),
								),
							);
					} else {
						await db
							.delete(campaignImages)
							.where(eq(campaignImages.campaignId, campaignId as string));
					}

					const newImages = data.images.filter(
						(img) => img.file instanceof File,
					);
					if (newImages.length > 0) {
						const cloudinaryImages = await uploadImages(newImages);
						const imagesToInsert = cloudinaryImages.map((image) => ({
							campaignId: resultCampaign.id,
							...image,
						}));

						await db.insert(campaignImages).values(imagesToInsert);
					}
				}
			} else {
				const insertResult = await db
					.insert(campaigns)
					.values(campaignData)
					.returning({ id: campaigns.id });

				resultCampaign = insertResult[0];

				if (data.images?.length) {
					const imagesToUpload = data.images.filter(
						(img) => img.file instanceof File,
					);

					if (imagesToUpload.length > 0) {
						const cloudinaryImages = await uploadImages(imagesToUpload);
						const imagesToInsert = cloudinaryImages.map((image) => ({
							campaignId: resultCampaign.id,
							...image,
						}));

						await db.insert(campaignImages).values(imagesToInsert);
					}
				}
			}

			return { id: resultCampaign.id, ...data };
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

	return redirect("/admin/campaigns");
}
