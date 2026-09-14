import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StatusMessage from "../components/StatusMessage";
import { THEME_INIT_SCRIPT } from "../components/ThemeToggle";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Explorer — Descubre países del mundo" },
			{
				name: "description",
				content:
					"Explorer: busca países por nombre o capital y filtra por región con datos de REST Countries.",
			},
			{ name: "theme-color", content: "#12507B" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
	notFoundComponent: () => (
		<main
			id="contenido"
			className="mx-auto w-full max-w-6xl flex-1 px-lg py-xl"
		>
			<StatusMessage
				title="Página no encontrada"
				description="La dirección que buscas no existe o fue movida."
			/>
		</main>
	),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es" suppressHydrationWarning>
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: script estatico para aplicar el tema antes de pintar */}
				<script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
				<HeadContent />
			</head>
			<body>
				<a
					href="#contenido"
					className="sr-only focus:not-sr-only focus:fixed focus:top-sm focus:left-sm focus:z-50 focus:rounded-md focus:bg-primary focus:px-md focus:py-sm focus:text-text-on-primary"
				>
					Saltar al contenido
				</a>
				<div className="flex min-h-dvh flex-col">
					<Header />
					{children}
					<Footer />
				</div>
				<Scripts />
			</body>
		</html>
	);
}
