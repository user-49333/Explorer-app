import type { ReactNode } from "react";
import { ButtonLink } from "./Button";

type StatusMessageProps = {
	title: string;
	description: ReactNode;
	tone?: "info" | "error";
	action?: boolean;
};

/** Estado vacio / error / 404 con el componente alert de daisyUI */
export default function StatusMessage({
	title,
	description,
	tone = "info",
	action = true,
}: StatusMessageProps) {
	return (
		<section
			role={tone === "error" ? "alert" : "status"}
			className={`alert alert-vertical items-start gap-sm rounded-md border p-lg text-left sm:alert-horizontal ${
				tone === "error"
					? "border-error/30 bg-error/5 text-text-primary"
					: "border-border bg-surface text-text-primary"
			}`}
		>
			<div className="flex flex-col gap-xs">
				<h2 className="text-card">{title}</h2>
				<p className="text-label text-text-secondary">{description}</p>
			</div>
			{action && (
				<ButtonLink to="/" variant="outline" className="w-full sm:w-auto">
					Ir al inicio
				</ButtonLink>
			)}
		</section>
	);
}
