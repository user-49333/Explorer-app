import { Link } from "@tanstack/react-router";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
	{ to: "/", label: "Países" },
	{ to: "/about", label: "Acerca de" },
] as const;

const navLinkClasses =
	"rounded-pill px-md py-sm text-button text-text-secondary transition hover:bg-surface-subtle hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus data-[status=active]:bg-surface-subtle data-[status=active]:text-primary";

/** Header (Figma 6:7): titulo + subtitulo; en tablet/desktop suma la navegacion horizontal */
export default function Header() {
	return (
		<header className="sticky top-0 z-40 bg-surface shadow-header">
			<div className="mx-auto flex max-w-6xl items-center justify-between gap-md px-lg pt-lg pb-md md:py-md">
				<Link
					to="/"
					className="flex flex-col gap-xs rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
				>
					<span className="text-title text-text-primary">Explorer</span>
					<span className="text-label text-text-secondary md:hidden lg:block">
						Descubre países del mundo
					</span>
				</Link>

				<div className="flex items-center gap-sm">
					{/* Tablet y desktop */}
					<nav aria-label="Principal" className="hidden md:block">
						<ul className="flex items-center gap-xs">
							{navLinks.map((link) => (
								<li key={link.to}>
									<Link
										to={link.to}
										activeOptions={{ exact: true, includeSearch: false }}
										className={navLinkClasses}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* Mobile: menu desplegable de daisyUI */}
					<nav
						aria-label="Principal"
						className="dropdown dropdown-end md:hidden"
					>
						<button
							type="button"
							className="btn h-chip min-h-chip rounded-pill border border-border bg-surface px-md text-button text-text-primary shadow-none"
						>
							Menú
						</button>
						<ul className="menu dropdown-content z-50 mt-sm w-48 gap-xs rounded-md border border-border bg-surface p-sm shadow-card">
							{navLinks.map((link) => (
								<li key={link.to}>
									<Link
										to={link.to}
										activeOptions={{ exact: true, includeSearch: false }}
										className="rounded-sm py-sm text-button text-text-secondary data-[status=active]:bg-surface-subtle data-[status=active]:text-primary"
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
