import { html } from "htm/preact";

export default function About() {
  return html`
    <section class="section">
      <div class="container is-max-tablet">
        <div class="content">
          <h1 class="title">About</h1>
          <h2>About TIPS</h2>
          <p>
            For reasons to do with the way browsers implement form inputs ~ most particularly, the appearance of
            <code>type="number"</code> inputs in <b>dark mode</b> ~ I want to use a <code>type="text"</code> input
            element inside a React component (or Preact, or Svelte, or such). And as long as we are building a
            component, to the parent of this component, the value should appear as a <code>number</code>.
          </p>
          <p>
            I suppose it could be called SPIT or PITS but I am calling it <b>TIPS</b>: the <code>type</code>,
            <code>input</code>, <code>pattern</code>, and <code>size</code> attributes on the <code>input</code> element
            are the key to making TIPS happen.
          </p>
          <h2>About this site</h2>
          <p>
            These pages are served with no build step: Preact, Hooks, Signals, and HTM are loaded from a CDN via an
            import map, styled with Bulma, and routed with preact-iso. I could have spun up a little Next.js / React /
            TypeScript site, but I wanted to explore these tools instead.
          </p>
        </div>
      </div>
    </section>
  `;
}
