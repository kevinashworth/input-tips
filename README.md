# input-tips

A bare-bones Preact app with **no build step**. Served as static files with a
tiny stdlib-only Python server (`serve.py`).

## Tech

- **Preact v11** — UI library, via CDN import map.
- **HTM** — JSX-like tagged templates instead of compiled JSX.
- **Preact Signals** — reactive state.
- **preact-iso** — routing (`LocationProvider` + `Router`).
- **Bulma 1.0.4** — CSS framework (CDN), with built-in light/dark `data-theme` support.

No npm, no bundler. Dependencies load from esm.sh/cdnjs via the `<script type="importmap">` in `index.html`.

## Structure

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

## Run

```sh
python3 serve.py                 # http://127.0.0.1:8000
python3 serve.py 8080            # custom port
python3 serve.py --host 0.0.0.0
```

`serve.py` is a plain static server plus an **SPA fallback**: any path that
isn't a real file is answered with `index.html`, so client-side routes like
`/about` load on direct navigation and hard refresh. Missing assets (paths with
a file extension) still 404, and directory listings are disabled.

## Test

```sh
python3 -m unittest test_serve
```

See [docs/VENDORING.md](docs/VENDORING.md) to switch from CDN to fully local dependencies.
