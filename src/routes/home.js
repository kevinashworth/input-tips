import { html } from "htm/preact";
import { signal, useSignal } from "@preact/signals";

import NumericInputTwoDigits from "../components/numeric-input-two-digits.js";

const showBulmaInputClass = signal(true);

export default function Home() {
  const count = useSignal(0);

  function handleChangeEvent(e) {
    const val = e.currentTarget.value ?? 0;
    count.value = Number(val);
  }

  function handleChangeNumber(value) {
    count.value = Number(value);
  }

  function toggleBulmaInputClass() {
    showBulmaInputClass.value = !showBulmaInputClass.value;
  }

  const inputTypeNumber = `<input
  oninput={handleChangeEvent}
  size={2}
  type="number"
  value={count}
/>`;

  const numberInputTwoDigits = `<input
  inputmode="numeric"
  oninput={handleChangeNumber}
  pattern="[0-9]*"
  size={2}
  type="text"
  value={count}
/>`;

  return html`
    <section class="section">
      <div class="container is-max-tablet">
        <h1 class="title">TIPS</h1>
        <h2 class="subtitle">Why do I call it TIPS?</h2>
        <div class="content">
          <p>
            This demo allows a quick comparison between an HTML input with <code>type="number"</code>, and an HTML input
            with <code>type="text"</code>, along with <code>inputmode</code>, <code>pattern</code>, and
            <code>size</code>
            attributes. Which spells an acronym that I'm calling <b>TIPS</b>.
          </p>
          <p>
            Below is bad UI/UX, but for the purposes of this demo site, <b>count</b> appears in each of the items on
            this page, and can be controlled by all of them. Modify it one place, expect it to be updated in the other
            places. Because my two-digit numeric input was built for a timer, it has default min and max values of 00
            and 59. Unexpected bad-UX behavior will probably occur outside of that range.
          </p>
          <p>
            Be sure to look at the inputs in <b>dark mode</b>: the always-white arrows are a big part of what motivated
            me to look into alternatives.
          </p>
        </div>
        <div class="fixed-grid has-2-cols">
          <div class="grid">
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell">
              <div class="box">
                <p>count: <strong>${count}</strong></p>
                <div class="buttons">
                  <button class="button is-primary is-small" onClick=${() => (count.value += 1)}>Increment</button>
                  <button class="button is-small" onClick=${() => (count.value -= 1)}>Decrement</button>
                </div>
              </div>
            </div>
            <div class="cell">
              <div class="box">
                This is a simple piece of state, built with <code>useSignal</code> from <code>@preact/signals</code>
              </div>
            </div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell">
              <div class="box">
                <p>input type=number</p>
                <div class="buttons">
                  <input
                    class=${showBulmaInputClass.value ? "input" : ""}
                    name="input-type-number"
                    oninput=${handleChangeEvent}
                    size=${2}
                    type="number"
                    value=${count}
                  />
                </div>
              </div>
            </div>
            <div class="cell">
              <pre class="box">${inputTypeNumber.toString()}</pre>
            </div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell">
              <div class="box">
                <p>numeric-input-two-digits (00 to 59)</p>
                <div class="buttons">
                  <${NumericInputTwoDigits}
                    class=${showBulmaInputClass.value ? "input" : ""}
                    onInput=${handleChangeNumber}
                    value=${count.value}
                  />
                </div>
              </div>
            </div>
            <div class="cell">
              <pre class="box">${numberInputTwoDigits.toString()}</pre>
            </div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell">
              <label class="checkbox">
                <input class="mr-2" type="checkbox" checked=${showBulmaInputClass} onChange=${toggleBulmaInputClass} />
                Style with Bulma <code>class="input"</code>
              </label>
            </div>
            <div class="cell" />
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
            <div class="cell block has-text-centered">༶ ༶ ༶ ༶ ༶ ༶ ༶</div>
          </div>
        </div>
        <h2 class="subtitle">A Note about Arrow Keys</h2>
        <p>
          An HTML <code>input</code> of <code>type="number"</code> lets you increment and decrement the value of the
          input by typing the up and down arrows. This is built-in to the browser. The same up/down functionality is
          part of my numeric-input-two-digits.
        </p>
      </div>
    </section>
  `;
}
