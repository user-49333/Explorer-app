import { createLink, type LinkComponent } from "@tanstack/react-router";
import { type AnchorHTMLAttributes, forwardRef } from "react";

/**
 * Button (Figma 4:10) sobre el componente btn de daisyUI.
 * Estados: Default, Hover, Active y Disabled con los tokens primary-*.
 */
export const buttonVariants = {
	primary:
		"border-0 bg-primary text-text-on-primary hover:bg-primary-hover active:bg-primary-active",
	outline:
		"border border-border bg-surface text-text-primary hover:border-primary hover:bg-surface-subtle active:bg-border",
} as const;

export function buttonClasses(
	variant: keyof typeof buttonVariants = "primary",
) {
	return `btn h-control min-h-control rounded-md px-lg text-button shadow-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:bg-disabled-surface disabled:text-disabled-text aria-disabled:pointer-events-none aria-disabled:border-0 aria-disabled:bg-disabled-surface aria-disabled:text-disabled-text ${buttonVariants[variant]}`;
}

type ButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	variant?: keyof typeof buttonVariants;
};

const ButtonAnchor = forwardRef<HTMLAnchorElement, ButtonAnchorProps>(
	({ variant = "primary", className = "", ...props }, ref) => (
		<a
			ref={ref}
			className={`${buttonClasses(variant)} ${className}`}
			{...props}
		/>
	),
);

const CreatedButtonLink = createLink(ButtonAnchor);

export const ButtonLink: LinkComponent<typeof ButtonAnchor> = (props) => (
	<CreatedButtonLink preload="intent" {...props} />
);
