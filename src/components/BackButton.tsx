import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import chevronRight from "#/assets/icons/chevron-right.svg";
import Icon from "./Icon";

const classes =
	"inline-flex h-chip items-center gap-xs rounded-md border border-border bg-surface pr-md pl-sm text-button text-text-primary transition hover:bg-surface-subtle active:bg-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

/** Boton volver (Figma 5:9): regresa en el historial o, si no hay, al listado */
export default function BackButton() {
	const router = useRouter();
	const canGoBack = useCanGoBack();

	const content = (
		<>
			<Icon
				src={chevronRight}
				className="size-6 rotate-180 text-text-secondary"
			/>
			Volver
		</>
	);

	if (canGoBack) {
		return (
			<button
				type="button"
				onClick={() => router.history.back()}
				className={classes}
			>
				{content}
			</button>
		);
	}

	return (
		<Link to="/" className={classes}>
			{content}
		</Link>
	);
}
