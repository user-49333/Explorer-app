import { createFileRoute } from "@tanstack/react-router";
import { ButtonLink } from "#/components/Button";

export const Route = createFileRoute("/about")({
	head: () => ({ meta: [{ title: "Acerca de — Explorer" }] }),
	component: About,
});

const stack = [
	["React 19", "Interfaz basada en componentes."],
	[
		"TanStack Start + Router",
		"Rutas por archivos, search params tipados y server functions.",
	],
	["Tailwind CSS v4", "Utility classes y Design Tokens definidos con @theme."],
	[
		"daisyUI 5",
		"Componentes base (btn, input, alert, menu) con un tema propio.",
	],
	["REST Countries v5", "Fuente de datos de los países."],
] as const;

/* Clases completas para que Tailwind las detecte al compilar */
const swatches = [
	["primary", "#12507B", "#7CC0F0", "bg-primary"],
	["primary-hover", "#0E3F61", "#A3D3F5", "bg-primary-hover"],
	["primary-active", "#0A2E47", "#C7E4F9", "bg-primary-active"],
	["secondary", "#0F766E", "#2DD4BF", "bg-secondary"],
	["background", "#F4F7FA", "#0B1620", "bg-background"],
	["surface", "#FFFFFF", "#13212E", "bg-surface"],
	["surface-subtle", "#E4EDF5", "#1A2D3D", "bg-surface-subtle"],
	["text-primary", "#10202E", "#E6EDF3", "bg-text-primary"],
	["text-secondary", "#4F6070", "#9FB0C0", "bg-text-secondary"],
	["border", "#D5DEE8", "#2A3F52", "bg-border"],
	["focus", "#0B57D0", "#8AB4F8", "bg-focus"],
	["disabled-surface", "#E3E8EE", "#1F2F3D", "bg-disabled-surface"],
] as const;

function About() {
	return (
		<main
			id="contenido"
			className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-xl px-lg py-lg md:py-xl"
		>
			<header className="flex flex-col gap-sm">
				<p className="text-label text-secondary">Acerca de</p>
				<h1 className="text-title text-text-primary lg:text-display">
					Explorer
				</h1>
				<p className="max-w-[65ch] text-body text-text-secondary">
					Implementación web del diseño “Explorer App — UX/UI Lab 1” realizado
					en Figma. Permite buscar países por nombre o capital, filtrarlos por
					región y consultar su ficha.
				</p>
			</header>

			<section aria-labelledby="stack-title" className="flex flex-col gap-md">
				<h2 id="stack-title" className="text-card text-text-primary">
					Tecnologías
				</h2>
				<ul className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
					{stack.map(([name, description]) => (
						<li
							key={name}
							className="flex flex-col gap-xs rounded-md border border-border bg-surface p-md shadow-card"
						>
							<h3 className="text-card text-text-primary">{name}</h3>
							<p className="text-label text-text-secondary">{description}</p>
						</li>
					))}
				</ul>
			</section>

			<section aria-labelledby="tokens-title" className="flex flex-col gap-md">
				<div className="flex flex-col gap-xs">
					<h2 id="tokens-title" className="text-card text-text-primary">
						Variables de color
					</h2>
					<p className="text-label text-text-secondary">
						Tokens de Figma trasladados a <code>@theme</code> en{" "}
						<code>src/styles.css</code>.
					</p>
				</div>
				<ul className="grid grid-cols-2 gap-md sm:grid-cols-3 lg:grid-cols-6">
					{swatches.map(([token, light, dark, bg]) => (
						<li key={token} className="flex flex-col gap-xs">
							<span className={`h-16 rounded-md border border-border ${bg}`} />
							<span className="text-label text-text-primary">
								color/{token}
							</span>
							<span className="text-label text-text-secondary">
								Light {light} · Dark {dark}
							</span>
						</li>
					))}
				</ul>
			</section>

			<div>
				<ButtonLink to="/">Explorar países</ButtonLink>
			</div>
		</main>
	);
}
