import { html } from "htm/preact";
import { useLocation } from "preact-iso";
import { withBase } from "../base.js";

export default function NotFound() {
  const { path, route } = useLocation();
  const home = withBase("/");

  return html`
    <section class="section">
      <div class="container has-text-centered">
        <h1 class="title is-1">404</h1>
        <p class="subtitle">Page not found</p>
        <div class="content">
          <p>No route matched <code>${path}</code>.</p>
          <a
            class="button is-primary"
            href=${home}
            onClick=${(e) => {
              e.preventDefault();
              route(home);
            }}
            >Back home</a
          >
        </div>
      </div>
    </section>
  `;
}
