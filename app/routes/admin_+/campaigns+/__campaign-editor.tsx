import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
	getFormProps,
	getInputProps,
	getTextareaProps,
	useForm,
	getFieldsetProps,
	FormProvider,
	type FieldMetadata,
} from "@conform-to/react";
import { Form } from "react-router";
import type { Info } from "./+types/$campaignId.edit";
import { z } from "zod";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCalendarAlt,
	faImage,
	faPlusCircle,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Field, TextareaField } from "#app/components/forms.js";
import { Button } from "#app/components/ui/button";
import { Label } from "#app/components/ui/label";
import { ErrorList } from "#app/components/ui/errorList";

export const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

export const campaignCategories = [
	"tuition_assistance",
	"medical_emergency",
	"housing_support",
	"books_supplies",
	"food_security",
	"transport_assistance",
	"tech_resources",
	"other",
] as const;
export const campaignStatus = ["active", "completed", "cancelled"] as const;

const ImageFieldsetSchema = z.object({
	id: z.string().optional(),
	file: z
		.instanceof(File)
		.optional()
		.refine(
			(file) => !file || file.size <= MAX_UPLOAD_SIZE,
			"File size must be less than 3MB",
		),
	altText: z.string().optional(),
	contentType: z.string().optional(),
	url: z.string().optional(),
});

export type ImageFieldset = z.infer<typeof ImageFieldsetSchema>;

export const CampaignSchema = z.object({
	title: z
		.string()
		.min(10, { message: "Title must be at least 10 characters" })
		.max(200),
	description: z
		.string()
		.min(20, { message: "Description must be at least 20 characters" }),
	goal: z.number().min(1000, { message: "Goal must be at least 1,000 KES" }),
	category: z.enum(campaignCategories),
	raised: z.number().default(0),
	status: z.enum(campaignStatus).default("active"),
	startDate: z.date(),
	endDate: z.date().optional(),
	images: z.array(ImageFieldsetSchema).max(5).optional(),
});

export default function CampaignEditor({
	campaign,
	actionData,
}: {
	campaign?: Info["loaderData"]["campaign"];
	actionData?: Info["actionData"];
}) {
	const [form, fields] = useForm({
		id: "campaign-creation-form",
		constraint: getZodConstraint(CampaignSchema),
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: CampaignSchema });
		},
		defaultValue: {
			...campaign,
			images: campaign?.images || [{}],
		},
		shouldRevalidate: "onBlur",
	});

	const imageList = fields.images.getFieldList();

	return (
		<div className="bg-background p-8 rounded-lg shadow-md max-w-4xl mx-auto">
			<h2 className="text-h3 font-bold text-brand mb-6">Create New Campaign</h2>

			<FormProvider context={form.context}>
				<Form
					method="post"
					className="space-y-4"
					{...getFormProps(form)}
					encType="multipart/form-data"
				>
					<Field
						labelProps={{ children: "Campaign Title" }}
						inputProps={{
							...getInputProps(fields.title, { type: "text" }),
							placeholder: "Enter campaign title",
							className: "w-full",
						}}
						errors={fields.title.errors}
					/>

					<TextareaField
						labelProps={{ children: "Campaign Description" }}
						textareaProps={{
							...getTextareaProps(fields.description),
							placeholder: "Describe the campaign purpose and goals",
							rows: 5,
							className: "w-full",
						}}
						errors={fields.description.errors}
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Field
							labelProps={{ children: "Fundraising Goal (KES)" }}
							inputProps={{
								...getInputProps(fields.goal, { type: "number" }),
								placeholder: "Goal amount in KES",
								min: 10,
								step: 1000,
							}}
							errors={fields.goal.errors}
						/>
						<Field
							labelProps={{ children: "Raised" }}
							inputProps={{
								...getInputProps(fields.raised, { type: "number" }),
								placeholder: "raised amount in KES",
								min: 10,
								step: 1000,
							}}
							errors={fields.raised.errors}
						/>
						<div>
							<Label htmlFor={fields.category.id}>Category</Label>
							<select
								id={fields.category.id}
								name={fields.category.name}
								className="w-full p-2 border border-input rounded-md bg-background"
								aria-invalid={Boolean(fields.category.errors?.length)}
								aria-describedby={fields.category.errorId}
							>
								<option value="">Select category</option>
								{campaignCategories.map((category) => (
									<option key={category} value={category}>
										{category
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1),
											)
											.join(" ")}
									</option>
								))}
							</select>
							<ErrorList
								id={fields.category.errorId}
								errors={fields.category.errors}
							/>
						</div>
						<div>
							<Label htmlFor={fields.status.id}>Campaign Status</Label>
							<select
								id={fields.status.id}
								name={fields.status.name}
								className="w-full p-2 border border-input rounded-md bg-background"
								aria-invalid={Boolean(fields.status.errors?.length)}
								aria-describedby={fields.status.errorId}
							>
								<option value="">Select the campaign status</option>
								{campaignStatus.map((status) => (
									<option key={status} value={status}>
										{status
											.split("_")
											.map(
												(word) => word.charAt(0).toUpperCase() + word.slice(1),
											)
											.join(" ")}
									</option>
								))}
							</select>
							<ErrorList
								id={fields.status.errorId}
								errors={fields.status.errors}
							/>
						</div>
					</div>
					<Field
						labelProps={{
							children: (
								<div className="flex items-center gap-2">
									<FontAwesomeIcon
										icon={faCalendarAlt}
										className="text-brand-secondary"
									/>
									<span>Start Date</span>
								</div>
							),
						}}
						inputProps={{
							...getInputProps(fields.startDate, { type: "date" }),
						}}
						errors={fields.startDate.errors}
					/>

					<Field
						labelProps={{
							children: (
								<div className="flex items-center gap-2">
									<FontAwesomeIcon
										icon={faCalendarAlt}
										className="text-brand-secondary"
									/>
									<span>End Date (Optional)</span>
								</div>
							),
						}}
						inputProps={{
							...getInputProps(fields.endDate, { type: "date" }),
						}}
						errors={fields.endDate.errors}
					/>
					<div className="mt-8">
						<Label htmlFor={fields.images?.id}>
							<div className="flex items-center gap-2 mb-2">
								<FontAwesomeIcon
									icon={faImage}
									className="text-brand-secondary"
								/>
								<span>Campaign Images (Max 5)</span>
							</div>
						</Label>
						<ul className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
							{imageList.map((imageMeta, index) => (
								<li
									key={imageMeta.key}
									className="relative border border-border p-4 rounded-md"
								>
									<ImageChooser meta={imageMeta} />
									{index > 0 && (
										<button
											type="button"
											className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center"
											{...form.remove.getButtonProps({
												name: fields.images.name,
												index,
											})}
										>
											<FontAwesomeIcon icon={faTrash} size="xs" />
											<span className="sr-only">Remove image {index + 1}</span>
										</button>
									)}
								</li>
							))}
						</ul>

						{imageList.length < 5 && (
							<Button
								type="button"
								variant="outline"
								className="flex items-center gap-2"
								{...form.insert.getButtonProps({ name: fields.images.name })}
							>
								<FontAwesomeIcon icon={faPlusCircle} />
								<span>Add another image</span>
							</Button>
						)}
					</div>

					{form.errors && (
						<div className="rounded-md bg-destructive/10 p-3">
							<div className="flex gap-2 text-destructive">
								<ErrorList id={form.errorId} errors={form.errors} />
							</div>
						</div>
					)}

					<div className="flex justify-end gap-4 mt-8 pt-4 border-t border-border">
						<Button
							type="button"
							variant="outline"
							{...form.reset.getButtonProps()}
						>
							Reset
						</Button>
						<Button variant="accent" type="submit" className="px-8">
							Create Campaign
						</Button>
					</div>
				</Form>
			</FormProvider>
		</div>
	);
}

function ImageChooser({
	meta,
}: {
	meta: FieldMetadata<ImageFieldset>;
}) {
	const fields = meta.getFieldset();

	// Initialize preview image with existing image URL if available
	const [previewImage, setPreviewImage] = useState<string | null>(
		fields.url?.initialValue || null,
	);
	const [altText, setAltText] = useState(fields.altText.initialValue ?? "");

	const fileInputProps = getInputProps(fields.file, { type: "file" });
	const { key, ...fileInputPropsWithoutKey } = fileInputProps;

	const hasExistingId = !!fields.id?.initialValue;

	return (
		<fieldset {...getFieldsetProps(meta)}>
			{/* Hidden inputs to maintain existing image data during form submission */}
			{hasExistingId && (
				<input
					type="hidden"
					name={fields.id.name}
					value={fields.id.initialValue}
				/>
			)}

			{fields.url?.initialValue && (
				<input
					type="hidden"
					name={fields.url.name}
					value={fields.url.initialValue}
				/>
			)}

			<div className="flex flex-col gap-3">
				<div className="w-full">
					<div className="relative h-48 w-full">
						<label
							htmlFor={fields.file.id}
							className={`group absolute h-48 w-full rounded-lg border-2 border-dashed border-muted-foreground 
                ${!previewImage ? "bg-accent/30 hover:bg-accent/50 cursor-pointer" : ""}`}
						>
							{previewImage ? (
								<div className="relative h-full w-full">
									<img
										src={previewImage}
										alt={altText ?? ""}
										className="h-full w-full rounded-lg object-cover"
									/>
									<div className="absolute bottom-2 right-2 bg-background/80 px-2 py-1 text-xs rounded">
										Click to change
									</div>
								</div>
							) : (
								<div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
									<FontAwesomeIcon icon={faImage} size="2x" />
									<p className="mt-2 text-center text-body-sm">
										Click to upload an image
										<br />
										<span className="text-body-xs">(Max 3MB)</span>
									</p>
								</div>
							)}

							<input
								key={key}
								aria-label="Campaign Image"
								className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
								onChange={(event) => {
									const file = event.target.files?.[0];
									if (file) {
										const reader = new FileReader();
										reader.onloadend = () => {
											setPreviewImage(reader.result as string);
										};
										reader.readAsDataURL(file);
									} else {
										setPreviewImage(null);
									}
								}}
								accept="image/*"
								{...fileInputPropsWithoutKey}
							/>
						</label>
					</div>
					<div className="min-h-[24px] mt-1">
						<ErrorList id={fields.file.errorId} errors={fields.file.errors} />
					</div>
				</div>

				<div className="w-full">
					<Label htmlFor={fields.altText.id}>
						Alt Text (image description)
					</Label>
					<input
						id={fields.altText.id}
						name={fields.altText.name}
						className="w-full p-2 border border-input rounded-md"
						placeholder="Describe the image for accessibility"
						onChange={(e) => setAltText(e.currentTarget.value)}
						value={altText}
					/>

					{/* Hidden input to preserve alt text if no changes */}
					{fields.contentType?.initialValue && (
						<input
							type="hidden"
							name={fields.contentType.name}
							value={fields.contentType.initialValue}
						/>
					)}
				</div>
			</div>

			<div className="min-h-[24px] mt-1">
				<ErrorList id={meta.errorId} errors={meta.errors} />
			</div>
		</fieldset>
	);
}
