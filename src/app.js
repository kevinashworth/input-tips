import { render } from "preact";
import { html } from "htm/preact";
import { LocationProvider, Router, Route, ErrorBoundary } from "preact-iso";
import { Navbar } from "./components/navbar.js";
import Home from "./routes/home.js";
import About from "./routes/about.js";
import NotFound from "./routes/404.js";

function App() {
	return html`
		<${LocationProvider}>
			<${Navbar} />
			<main>
				<${ErrorBoundary}>
					<${Router}>
						<${Route} path="/" component=${Home} />
						<${Route} path="/about" component=${About} />
						<${Route} default component=${NotFound} />
					<//>
				<//>
			</main>
		</${LocationProvider}>
	`;
}

render(html`<${App} />`, document.getElementById("app"));
