# Deploying the site

This app has no build step, so it deploys as plain static files. The only
production-specific concern is the **SPA fallback** that `serve.py` provides
locally: direct visits to routes such as `/about` or `/nope` must return the app
shell, or the router never gets a chance to run.

## What gets deployed

Publish these from the repo root:

```text
index.html
favicon.ico
src/**
```

No build command, no npm install, and no Python in production. `serve.py` and
`test_serve.py` are local-development tools only. Dependencies continue to load
from esm.sh and cdnjs unless you follow [VENDORING.md](VENDORING.md) first.

## Option A: GitHub Pages

Free, zero build. Deploy from the repository settings (Pages → branch `main`,
folder `/root`), or publish only the static subset with an Actions workflow.

GitHub Pages has no rewrite configuration. Use a `404.html` copy of
`index.html` so unknown paths boot the SPA instead of showing Pages' default
404. With an Actions workflow, generate it as part of the publish step:

```sh
cp index.html 404.html
```

Caveat: deep links return HTTP 404 even though the app renders. Acceptable for
a demo; weaker for SEO. Also note that deploying from the branch root exposes
`docs/`, `serve.py`, and similar files, which are harmless but public.

## Option B: Netlify or Cloudflare Pages

Set the build command to none and the publish directory to `.` (or the subset
above). Add a root `_redirects` file:

```text
/*  /index.html  200
```

Existing files are served before the fallback, so `/src/app.js` still resolves.
Note that missing assets now also return `index.html` with a 200 instead of a
404, unlike `serve.py`.

## Option C: Vercel

Use the "Other" framework preset with no build command and output directory
`.`. Add `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Rewrites are applied after the filesystem check, so real assets are still
served directly and only unknown paths fall back to the app shell.

## Option D: Your own server

Run `serve.py` behind a TLS-terminating reverse proxy (Caddy or nginx) and keep
it bound to loopback:

```sh
python3 serve.py --host 127.0.0.1 --port 8000
```

This preserves the exact local behavior, including 404s for missing assets and
disabled directory listings. It is not the recommended option: `serve.py` is a
single-process Python development server, not a hardened production server.

## Optional CI

Run the server tests on every push:

```sh
python3 -m unittest -v test_serve.py
```

The suite only covers the Python server's fallback and asset behavior; it does
not exercise the browser app.
