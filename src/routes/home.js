import { html } from "htm/preact";
import { useSignal } from "@preact/signals";

export default function Home() {
  const count = useSignal(0);

  return html`
    <section class="section">
      <div class="container">
        <h1 class="title">Home</h1>
        <p class="subtitle">A bare-bones Preact no-build app with Signals via HTM.</p>

        <div class="box">
          <p class="mb-3">Signals counter: <strong>${count}</strong></p>
          <div class="buttons">
            <button class="button is-primary" onClick=${() => (count.value += 1)}>Increment</button>
            <button class="button" onClick=${() => (count.value -= 1)}>Decrement</button>
          </div>
        </div>
      </div>
    </section>
  `;
}
