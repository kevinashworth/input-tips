import { html } from "htm/preact";

const tipsInput = `<input
  type="text"
  inputmode="numeric"
  pattern="[0-9]*"
  size={2}
/>`;

export default function About() {
  return html`
    <section class="section">
      <div class="container is-max-tablet">
        <div class="content">
          <h1 class="title">About</h1>

          <h2>What is TIPS?</h2>
          <p>
            TIPS is a small component that presents a number using a <code>type="text"</code> input instead of
            <code>type="number"</code>. The name comes from the four attributes that make it work: <code>type</code>,
            <code>inputmode</code>, <code>pattern</code>, and <code>size</code>.
          </p>
          <p>
            (I suppose it could be called SPIT or PITS but I am calling it <b>TIPS</b>: the <code>type</code>,
            <code>input</code>, <code>pattern</code>, and <code>size</code> attributes on the <code>input</code> element
            are the key to making TIPS happen.)
          </p>
          <p>
            The goal is a number field that looks the same across themes and gives the developer control over its
            appearance, while still handing its parent a real <code>number</code> rather than a string.
          </p>
          <pre class="box">${tipsInput.toString()}</pre>

          <h2>Why not type="number"?</h2>
          <p>
            Browsers draw the spin buttons or up/down arrows on <code>type="number"</code> inputs. These are hard to
            style and, in dark mode, often stay light (depending on your browser). A <code>type="text"</code> input with
            <code>inputmode="numeric"</code>, <code>pattern="[0-9]*"</code>, and <code>size="2"</code> avoids that while
            keeping the numeric keyboard and digit-only behavior.
          </p>
          <p>
            The component here was built for a timer. It accepts digits only, limits the value to two digits, pads it to
            two places, and clamps it to 00 - 59 by default. Up and Down arrows increment and decrement it, matching the
            native number input.
          </p>

          <h2>About this demo</h2>
          <p>
            The home page shows a native number input and the TIPS component side by side, plus Increment and Decrement
            buttons. They all share one <code>count</code> signal, so changing one updates the others.
          </p>
          <p>
            This is intentionally bad UI. This is a demo, not a recommended pattern! The value count itself is not
            clamped, so the buttons can push it outside 00 - 59, but because my two-digit numeric input was built for a
            timer, unexpected bad-UX behavior will occur outside of that range.
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
