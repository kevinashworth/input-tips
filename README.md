# input-tips

TIPS is a styled number input built from a text input.

```jsx
<input
  type="text"
  inputmode="numeric"
  pattern="[0-9]*"
  size={2}
/>
```

See the [demo](https://kevinashworth.github.io/input-tips/) to compare the browser's native `type="number"` field with a TIPS input: a `type="text"` field that uses `inputmode`, `pattern`, and `size` to accept numbers. Try them in **dark mode** too: in certain browsers, the native number field keeps its light-colored arrows, while the TIPS input does not.

## What is TIPS?

TIPS is a small component that presents a number using a `type="text"` input instead of `type="number"`. The name comes from the four attributes that make it work: `type`, `inputmode`, `pattern`, and `size`.

(I suppose it could be called SPIT or PITS but I am calling it **TIPS**: the `type`, `input`, `pattern`, and `size` attributes on the `input` element are the key to making TIPS happen.)

The goal is a number field that looks the same across themes and gives the developer control over its appearance, while still handing its parent a real `number` rather than a string.

If you want to use it in your React or Preact project, just grab the [code](src/components/numeric-input-two-digits.js).

## Why not type="number"?

Some browsers draw the up/down arrows on `type="number"` inputs. These are hard to style and, in dark mode, often stay light (depending on your browser). A `type="text"` input with `inputmode="numeric"`, `pattern="[0-9]*"`, and `size="2"` avoids that while keeping the numeric keyboard and digit-only behavior.

The component here was built for a timer and it is 2-digits long. It accepts digits only, limits the value to two digits, pads it to two places, and clamps it to 00 - 59 by default. Up and Down arrows increment and decrement it, matching the native number input.

## About these demo pages

The home page shows a native number input and the TIPS component side by side, plus Increment and Decrement buttons. They all share one `count` signal, so changing one updates the others.

This is intentionally bad UI. This is a demo, not a recommended pattern! The value count itself is not clamped, so the buttons can push it outside 00 - 59, but because my two-digit numeric input was built for a timer, unexpected bad-UX behavior will occur outside of that range.

.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀

.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀.𓈒𓂂𓏲܀

#### About the Repo

A bare-bones Preact app with **no build step**. Served as static files with a
tiny stdlib-only Python server (`serve.py`).

#### Tech

- **Preact v11** — UI library, via CDN import map.
- **HTM** — JSX-like tagged templates instead of compiled JSX.
- **Preact Signals** — reactive state.
- **preact-iso** — routing (`LocationProvider` + `Router`).
- **Bulma 1.0.4** — CSS framework (CDN), with built-in light/dark `data-theme` support.

No npm, no bundler. Dependencies load from esm.sh/cdnjs via the `<script type="importmap">` in `index.html`.

#### Structure

```text
index.html            import map, Bulma, theme bootstrap
serve.py              static server with SPA fallback
test_serve.py         tests for the static server
src/app.js            router + layout
src/theme.js              light/dark/system store (signals + localStorage)
src/components/navbar.js  navbar, burger menu, theme dropdown
src/routes/               home, about, 404
docs/VENDORING.md         how to vendor deps for offline use
```

#### Run

```sh
python3 serve.py                 # http://127.0.0.1:8000
python3 serve.py 8080            # custom port
python3 serve.py --host 0.0.0.0
```

`serve.py` is a plain static server plus an **SPA fallback**: any path that
isn't a real file is answered with `index.html`, so client-side routes like
`/about` load on direct navigation and hard refresh. Missing assets (paths with
a file extension) still 404, and directory listings are disabled.

#### Test

```sh
python3 -m unittest test_serve
```

See [docs/VENDORING.md](docs/VENDORING.md) to switch from CDN to fully local dependencies.
