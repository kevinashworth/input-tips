import { html } from "htm/preact";

export default function About() {
	return html`
		<section class="section">
			<div class="container">
				<h1 class="title">About</h1>
				<p class="subtitle">Quick note about the TIPS tech.</p>
				<div class="content">
					<p>
						This page is served with no build step: Preact, Hooks, Signals, and HTM are loaded
						from a CDN via an import map, styled with Bulma, and routed with preact-iso.
					</p>
				</div>
			</div>
		</section>
	`;
}
