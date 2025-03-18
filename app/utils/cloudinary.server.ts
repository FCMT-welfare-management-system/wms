import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface ImageInput {
	id?: string;
	file?: File;
	altText?: string;
	contentType?: string;
}

interface CloudinaryUploadResponse {
	public_id: string;
	secure_url: string;
	width: number;
	height: number;
	resource_type: string;
}

export interface CloudinaryUploadResult {
	cloudinaryId: string;
	url: string;
	altText?: string;
	contentType: string;
	width: number;
	height: number;
}

export async function uploadImages(
	images: ImageInput[] | undefined,
): Promise<CloudinaryUploadResult[]> {
	if (!images || images.length === 0) {
		return [];
	}

	const uploadResults: CloudinaryUploadResult[] = [];

	for (const image of images) {
		if (!image.file && image.id) {
			uploadResults.push({
				cloudinaryId: image.id,
				url: "",
				altText: image.altText || "",
				contentType: image.contentType || "",
				width: 0,
				height: 0,
			});
			continue;
		}

		if (!image.file) {
			continue;
		}

		try {
			const arrayBuffer = await image.file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const publicId =
				image.id ||
				`campaign_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

			const uploadResult = await new Promise<CloudinaryUploadResponse>(
				(resolve, reject) => {
					cloudinary.uploader
						.upload_stream(
							{
								public_id: publicId,
								resource_type: "image",
								folder: "campaigns",
							},
							(error, result) => {
								if (error) {
									reject(error);
									return;
								}
								if (!result) {
									console.log("erorr uploading image");
									reject(new Error("No result from Cloudinary upload"));
									return;
								}
								resolve(result as CloudinaryUploadResponse);
							},
						)
						.end(buffer);
				},
			);

			uploadResults.push({
				cloudinaryId: uploadResult.public_id,
				url: uploadResult.secure_url,
				altText: image.altText || "",
				contentType: image.file.type,
				width: uploadResult.width,
				height: uploadResult.height,
			});
		} catch (error) {
			console.error("Error uploading image to Cloudinary:", error);
		}
	}

	return uploadResults;
}
