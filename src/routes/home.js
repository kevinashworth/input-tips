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
        <p class="subtitle">A styled number input built from a text input.</p>
        <div class="content">
          <p>
            Compare the browser's native <code>type="number"</code> field with a TIPS input: a
            <code>type="text"</code> field that uses <code>inputmode</code>, <code>pattern</code>, and
            <code>size</code> to accept numbers. Change <b>count</b> anywhere below and all three controls stay in sync.
          </p>
          <p>
            Try them in <b>dark mode</b> too: the native number field keeps its light-colored arrows, while the TIPS
            input does not.
          </p>
          <p><a href="/about">Read more about TIPS and this demo</a></p>
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
      </div>
    </section>
  `;
}
