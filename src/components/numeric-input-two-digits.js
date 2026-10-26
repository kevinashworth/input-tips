import { useRef } from "preact/hooks";
import { html } from "htm/preact";
import { useSignal } from "@preact/signals";

const DEFAULT_MAX = 59;
const DEFAULT_MIN = 0;

const clamp = (num, min, max) => (Number.isNaN(num) ? min : Math.max(min, Math.min(num, max)));

const format = (num) => num.toString().padStart(2, "0");
const parseDigits = (str) => str.replace(/\D/g, "").slice(0, 2);

export default function NumericInputTwoDigits({
  max = DEFAULT_MAX,
  min = DEFAULT_MIN,
  name = "numeric-input-two-digits",
  onInput = () => {},
  value = 0,
  ...rest
}) {
  const inputRef = useRef(null);
  const isFocused = useSignal(false);
  const draft = useSignal(null);

  const committedValue = clamp(value, min, max);
  const committedString = format(committedValue);
  const displayValue = isFocused.value && draft.value !== null ? draft.value : committedString;

  const commit = (input) => {
    const digits = parseDigits(input);
    const num = digits === "" ? min : clamp(Number(digits), min, max);
    onInput(num);
  };

  const handleInput = (e) => {
    draft.value = parseDigits(e.target.value);
  };

  const handleFocus = () => {
    isFocused.value = true;
    draft.value = committedString;
    inputRef.current?.select();
  };

  const handleBlur = () => {
    commit(draft.value ?? committedString);
    isFocused.value = false;
    draft.value = null;
  };

  const handleKeyDown = (e) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();

    const currentString = draft.value ?? committedString;
    const current = currentString === "" ? min : clamp(Number(currentString), min, max);
    const next = clamp(current + (e.key === "ArrowUp" ? 1 : -1), min, max);

    draft.value = format(next);
    onInput(next);
  };

  return html`
    <div>
      <input
        inputmode="numeric"
        maxlength=${2}
        name=${name}
        onblur=${handleBlur}
        onfocus=${handleFocus}
        oninput=${handleInput}
        onkeydown=${handleKeyDown}
        pattern="[0-9]*"
        ref=${inputRef}
        size=${2}
        type="text"
        value=${displayValue}
        ...${rest}
      />
    </div>
  `;
}
