import { signal, computed, effect } from "@preact/signals";

const STORAGE_KEY = "theme";

function readStored() {
	try {
		const value = localStorage.getItem(STORAGE_KEY);
		if (value === "light" || value === "dark" || value === "system") {
			return value;
		}
	} catch (e) {}
	return "system";
}

// User's chosen mode: "light" | "dark" | "system"
export const theme = signal(readStored());

// Whether the OS currently prefers dark.
const systemPrefersDark = signal(
	typeof matchMedia === "function" &&
		matchMedia("(prefers-color-scheme: dark)").matches
);

if (typeof matchMedia === "function") {
	const mql = matchMedia("(prefers-color-scheme: dark)");
	const onChange = (event) => {
		systemPrefersDark.value = event.matches;
	};
	if (typeof mql.addEventListener === "function") {
		mql.addEventListener("change", onChange);
	} else if (typeof mql.addListener === "function") {
		mql.addListener(onChange);
	}
}

// Effective mode after resolving "system".
export const resolvedTheme = computed(() =>
	theme.value === "system"
		? systemPrefersDark.value
			? "dark"
			: "light"
		: theme.value
);

export function setTheme(next) {
	if (next !== "light" && next !== "dark" && next !== "system") return;
	theme.value = next;
	try {
		localStorage.setItem(STORAGE_KEY, next);
	} catch (e) {}
}

// Keep <html data-theme> in sync with the chosen mode.
// "system" leaves the attribute unset so Bulma's prefers-color-scheme rules apply,
// matching the pre-paint bootstrap in index.html.
effect(() => {
	const mode = theme.value;
	if (mode === "system") {
		delete document.documentElement.dataset.theme;
	} else {
		document.documentElement.dataset.theme = mode;
	}
});
