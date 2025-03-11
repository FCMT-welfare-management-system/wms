import React from "react";
import { Link } from "react-router";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/misc";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				brand: "bg-brand text-white hover:bg-brand-darker",
				accent: "bg-accent-brand text-foreground hover:bg-accent-brand/90",
			},
			size: {
				default: "h-10 px-4 py-2",
				xs: "h-7 px-2 text-xs",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				xl: "h-12 rounded-md px-10 text-lg",
				icon: "h-10 w-10",
			},
			fullWidth: {
				true: "w-full",
			},
			rounded: {
				default: "rounded-md",
				full: "rounded-full",
				none: "rounded-none",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
			rounded: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	href?: string;
	external?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			rounded,
			fullWidth,
			asChild = false,
			href,
			external = false,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		// If href is provided, render as Link or anchor depending on external flag
		if (href && !disabled) {
			if (external) {
				return (
					<a
						href={href}
						className={cn(
							buttonVariants({
								variant,
								size,
								rounded,
								fullWidth,
								className,
							}),
						)}
						target="_blank"
						rel="noopener noreferrer"
					>
						{children}
					</a>
				);
			}

			return (
				<Link
					to={href}
					className={cn(
						buttonVariants({
							variant,
							size,
							rounded,
							fullWidth,
							className,
						}),
					)}
				>
					{children}
				</Link>
			);
		}

		// Otherwise render a regular button
		return (
			<button
				className={cn(
					buttonVariants({
						variant,
						size,
						rounded,
						fullWidth,
						className,
					}),
				)}
				ref={ref}
				disabled={disabled}
				{...props}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";

export { Button, buttonVariants };
