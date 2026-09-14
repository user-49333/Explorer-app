import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import StatusMessage from "./components/StatusMessage";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultStaleTime: 60_000,
		defaultErrorComponent: ({ error }) => (
			<main
				id="contenido"
				className="mx-auto w-full max-w-6xl flex-1 px-lg py-xl"
			>
				<StatusMessage
					tone="error"
					title="No pudimos cargar la información"
					description={
						error instanceof Error
							? error.message
							: "Inténtalo de nuevo en unos segundos."
					}
				/>
			</main>
		),
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
