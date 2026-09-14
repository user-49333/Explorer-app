import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const THEMES = { light: "explorer", dark: "explorer-dark" } as const;

type Mode = keyof typeof THEMES;

const STORAGE_KEY = "theme";

/**
 * Se ejecuta en el <head> antes de pintar para evitar el parpadeo de tema:
 * usa la preferencia guardada o, si no hay, la del sistema operativo.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("${STORAGE_KEY}");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.setAttribute("data-theme",d?"${THEMES.dark}":"${THEMES.light}")}catch(e){}})();`;

function applyMode(mode: Mode) {
	document.documentElement.setAttribute("data-theme", THEMES[mode]);
}

/** Boton de tema claro / oscuro (btn de daisyUI con iconos sol y luna) */
export default function ThemeToggle() {
	const [mode, setMode] = useState<Mode>("light");

	useEffect(() => {
		const current =
			document.documentElement.getAttribute("data-theme") === THEMES.dark
				? "dark"
				: "light";
		setMode(current);

		// Sin preferencia guardada, sigue los cambios del sistema
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = (event: MediaQueryListEvent) => {
			if (localStorage.getItem(STORAGE_KEY)) return;
			const next = event.matches ? "dark" : "light";
			applyMode(next);
			setMode(next);
		};
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	}, []);

	function toggle() {
		const next = mode === "dark" ? "light" : "dark";
		applyMode(next);
		setMode(next);
		localStorage.setItem(STORAGE_KEY, next);
	}

	const label = mode === "dark" ? "Activar modo claro" : "Activar modo oscuro";

	// Los iconos dependen del data-theme (no del estado) para no parpadear al hidratar
	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={label}
			title={label}
			className="btn grid size-chip min-h-chip shrink-0 place-items-center overflow-hidden rounded-pill border border-border bg-surface p-0 text-text-primary shadow-none hover:border-primary hover:bg-surface-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
		>
			<Sun
				aria-hidden="true"
				className="col-start-1 row-start-1 size-5 transition duration-300 in-data-[theme=explorer-dark]:rotate-90 in-data-[theme=explorer-dark]:opacity-0"
			/>
			<Moon
				aria-hidden="true"
				className="col-start-1 row-start-1 size-5 -rotate-90 opacity-0 transition duration-300 in-data-[theme=explorer-dark]:rotate-0 in-data-[theme=explorer-dark]:opacity-100"
			/>
		</button>
	);
}
