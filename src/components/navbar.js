import { useEffect, useRef, useState } from "preact/hooks";
import { html } from "htm/preact";
import { useLocation } from "preact-iso";
import { theme, resolvedTheme, setTheme } from "../theme.js";

function SunIcon() {
	return html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></svg>`;
}

function MoonIcon() {
	return html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>`;
}

function SystemIcon() {
	return html`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>`;
}

const LABELS = { system: "System", light: "Light", dark: "Dark" };

function useIsMobile(breakpoint = 1024) {
	const query = `(max-width: ${breakpoint - 1}px)`;
	const [isMobile, setIsMobile] = useState(
		typeof matchMedia === "function" ? matchMedia(query).matches : false
	);

	useEffect(() => {
		if (typeof matchMedia !== "function") return;
		const mql = matchMedia(query);
		const onChange = (event) => setIsMobile(event.matches);
		if (typeof mql.addEventListener === "function") {
			mql.addEventListener("change", onChange);
			return () => mql.removeEventListener("change", onChange);
		} else if (typeof mql.addListener === "function") {
			mql.addListener(onChange);
			return () => mql.removeListener(onChange);
		}
	}, [query]);

	return isMobile;
}

export function Navbar() {
	const { path, route } = useLocation();
	const [open, setOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const dropdownRef = useRef(null);
	const isMobile = useIsMobile();

	useEffect(() => {
		if (!open) return;
		const onDocClick = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpen(false);
			}
		};
		document.addEventListener("click", onDocClick);
		return () => document.removeEventListener("click", onDocClick);
	}, [open]);

	const go = (event, to) => {
		event.preventDefault();
		setOpen(false);
		setMenuOpen(false);
		route(to);
	};

	const pick = (mode) => {
		setTheme(mode);
		setOpen(false);
	};

	const active = resolvedTheme.value;
	const TriggerIcon =
		theme.value === "system" ? SystemIcon : active === "dark" ? MoonIcon : SunIcon;

	return html`
		<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
			<div class="navbar-brand">
				<a class="navbar-item has-text-weight-bold" href="/" onClick=${(e) => go(e, "/")}>
					TIPS
				</a>
				<a
					role="button"
					tabindex="0"
					class="navbar-burger ${menuOpen ? "is-active" : ""}"
					aria-label="menu"
					aria-expanded=${menuOpen ? "true" : "false"}
					onClick=${() => setMenuOpen(!menuOpen)}
					onKeyDown=${(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							setMenuOpen(!menuOpen);
						}
					}}
				>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>

			<div class="navbar-menu ${menuOpen ? "is-active" : ""}">
				<div class="navbar-start">
					<a
						class="navbar-item ${path === "/" ? "is-active" : ""}"
						href="/"
						onClick=${(e) => go(e, "/")}
						>Home</a
					>
					<a
						class="navbar-item ${path === "/about" ? "is-active" : ""}"
						href="/about"
						onClick=${(e) => go(e, "/about")}
						>About</a
					>
					<a
						class="navbar-item ${path === "/doesnotexist" ? "is-active" : ""}"
						href="/doesnotexist"
						onClick=${(e) => go(e, "/about")}
						>Does Not Exist</a
					>
				</div>

				<div class="navbar-end">
					<div class="navbar-item">
						<div class="dropdown ${isMobile ? "is-left" : "is-right"} ${open ? "is-active" : ""}" ref=${dropdownRef}>
							<div class="dropdown-trigger">
								<button
									class="button is-primary is-inverted"
									aria-haspopup="true"
									aria-controls="theme-menu"
									title="Theme: ${LABELS[theme.value]}"
									onClick=${() => setOpen(!open)}
								>
									<span class="icon"><${TriggerIcon} /></span>
								</button>
							</div>
							<div class="dropdown-menu" id="theme-menu" role="menu">
								<div class="dropdown-content">
									${["system", "light", "dark"].map(
										(mode) => html`
											<a
												key=${mode}
												class="dropdown-item ${theme.value === mode ? "is-active" : ""}"
												href="#"
												onClick=${(e) => {
													e.preventDefault();
													pick(mode);
												}}
												>${LABELS[mode]}</a
											>
										`
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	`;
}
