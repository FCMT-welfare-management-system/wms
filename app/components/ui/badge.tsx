import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "#app/utils/misc";

const badgeVariants = cva(
	"inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground",
				secondary: "border-transparent bg-secondary text-secondary-foreground",
				outline: "text-foreground border-border",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground",
				ghost: "border-transparent bg-muted text-muted-foreground",
				brand: "border-transparent bg-brand text-white",
				accent: "border-transparent bg-accent-brand text-foreground",
			},
			size: {
				default: "h-6",
				sm: "h-5 text-[10px]",
				lg: "h-7 px-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
	return (
		<div
			className={cn(badgeVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
