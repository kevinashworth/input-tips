import { useEffect, useRef, useState } from "preact/hooks";
import { html } from "htm/preact";
import { useLocation } from "preact-iso";
import { theme, resolvedTheme, setTheme } from "../theme.js";
import { BASE, withBase } from "../base.js";

import MoonIcon from "../icons/moon.js";
import SunIcon from "../icons/sun.js";
import SystemIcon from "../icons/system.js";

const LABELS = { system: "System", light: "Light", dark: "Dark" };
const HOME = withBase("/");
const HOME_PATH = BASE || "/";
const ABOUT = withBase("/about");

export function Navbar() {
  const { path, route } = useLocation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    route(to);
  };

  const pick = (mode) => {
    setTheme(mode);
    setOpen(false);
  };

  const active = resolvedTheme.value;
  const TriggerIcon = theme.value === "system" ? SystemIcon : active === "dark" ? MoonIcon : SunIcon;

  return html`
    <nav class="navbar is-primary" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <div class="dropdown  is-left ${open ? "is-active" : ""}" ref=${dropdownRef}>
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
                  `,
                )}
              </div>
            </div>
          </div>
        </div>
        <a
          class="navbar-item ${path === HOME_PATH ? "is-active" : ""}"
          href=${HOME}
          onClick=${(e) => go(e, HOME)}
          >Home</a
        >
        <a class="navbar-item ${path === ABOUT ? "is-active" : ""}" href=${ABOUT} onClick=${(e) => go(e, ABOUT)}
          >About TIPS</a
        >
      </div>
    </nav>
  `;
}
