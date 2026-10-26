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

The app currently assumes it is served from the site root: `index.html` loads
`/src/app.js` and `/favicon.ico`, and the router uses paths such as `/about`.
Deploying under a subpath (for example `/input-tips/` or `/tips/`) requires the
base-path changes described in [Option E2](#e2-copy-the-app-into-publictips-as-a-same-origin-page).
A subdomain or custom domain avoids the issue entirely.

## Option A: GitHub Pages

Free, zero build. There are two ways to publish.

### A1. Deploy from a branch

In the repository settings, choose Pages → Build and deployment → Deploy from a
branch → `main` → `/root`. This publishes the whole repository, including
`docs/` and `serve.py`, which is harmless but public.

### A2. Publish only the static subset with Actions

This publishes just `index.html`, `favicon.ico`, and `src/`, so the server code
and docs stay out of the site.

Before the first run, enable Pages and set its source to **GitHub Actions**:
Settings → Pages → Build and deployment → Source → GitHub Actions. The deploy
step cannot create the site itself; if Pages is disabled or still set to branch
deployment, `actions/deploy-pages` fails with
`Failed to create deployment (status: 404)`.

Create `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run server tests
        run: python3 -m unittest -v test_serve.py

      - name: Assemble static site
        run: |
          mkdir -p _site
          cp index.html favicon.ico _site/
          cp -R src _site/src
          cp _site/index.html _site/404.html

      - uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The workflow runs on every push to `main`, or manually via **Run workflow**.

The assembly step creates the `404.html` copy in the artifact, so Pages serves
the app shell for unknown paths and client-side routes survive a hard refresh.
It deliberately copies `src/` as a directory; anything else in the repo is not
published.

If you use a custom domain, add it to the artifact before upload:

```sh
echo "tips.example.com" > _site/CNAME
```

and configure the DNS records in the repository's Pages settings.

### GitHub Pages caveats

- **Project pages use a subpath.** `https://<user>.github.io/<repo>/` is not the
  site root, so the app's root-absolute assets and routes break. Use a custom
  domain, a user/org root site, or apply the base-path changes from
  [Option E2](#e2-copy-the-app-into-publictips-as-a-same-origin-page) (using the
  repository name as the prefix).
- **Deep links return HTTP 404.** `404.html` renders the app, but the status
  code is still 404. Acceptable for a demo; weaker for SEO.

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

## Option E: Existing Astro site

There are two ways to put the demo into an Astro personal site: isolate it in an
iframe, or copy it into `public/` and serve it from a subpath.

### E1. Iframe a separately deployed instance

This is the lowest-risk option. Deploy the app on its own origin first (Option A
with a custom domain, Option B, or Option C), then embed that URL. Because the
iframe has its own document, the app's root-absolute assets and routes keep
working unchanged.

Create `src/components/TipsEmbed.astro`:

```astro
---
interface Props {
  src?: string;
  title?: string;
}

const {
  src = "https://tips.example.com",
  title = "TIPS numeric input demo",
} = Astro.props;
---

<iframe src={src} title={title} loading="lazy" class="tips-embed"></iframe>

<style>
  .tips-embed {
    width: 100%;
    height: 34rem;
    border: 1px solid var(--border, #dbdbdb);
    border-radius: 0.5rem;
  }
</style>
```

Then use it in an `.mdx` post:

```mdx
import TipsEmbed from "../../components/TipsEmbed.astro";

Some prose about the TIPS demo.

<TipsEmbed />
```

Iframes do not grow to fit their content, so pick a fixed height that shows the
whole demo, or add a small resize script. Because the iframe is cross-origin,
the host page cannot style the demo; the app keeps its own theme toggle and
`localStorage`.

### E2. Copy the app into `public/tips/` as a same-origin page

Astro copies everything in `public/` verbatim to `dist/`, so this creates a
standalone page at `/tips/`:

```sh
mkdir -p public/tips
cp -R index.html favicon.ico src public/tips/
```

Then make three changes so the app does not escape `/tips/`:

1. In `public/tips/index.html`, change the root-absolute asset references to
   relative ones:

   ```html
   <link rel="shortcut icon" href="./favicon.ico" />
   <script type="module" src="./src/app.js"></script>
   ```

2. In `public/tips/src/app.js`, scope the router and prefix the route paths:

   ```js
   <${LocationProvider} scope="/tips">
     ...
     <${Route} path="/tips" component=${Home} />
     <${Route} path="/tips/about" component=${About} />
     <${Route} default component=${NotFound} />
   ```

3. In `public/tips/src/components/navbar.js` and `public/tips/src/routes/404.js`,
   change links, active checks, and `route()` calls to use the `/tips/` prefix
   (for example `href="/tips/"` and `route("/tips/about")`).

Use a trailing slash on the home link (`/tips/`). Relative asset paths resolve
from the current directory, so `/tips/about` and `/tips/` both load
`/tips/src/app.js`, but a link to `/tips` (no slash) would look for
`/src/app.js`.

The Astro dev server serves `/tips/`, but it will not handle deep links such as
`/tips/about` unless your host rewrites them. Scope the fallback from Option B
or C to the `/tips` prefix:

```text
# Netlify / Cloudflare Pages, in public/_redirects
/tips/*  /tips/index.html  200
```

Or add a `vercel.json` rewrite:

```json
{
  "rewrites": [{ "source": "/tips/:path*", "destination": "/tips/index.html" }]
}
```

Existing files take precedence, so `/tips/src/app.js` is still served as a real
asset. GitHub Pages cannot scope a `404.html` to a subdirectory, so use E1 there
instead. Test deep links on the deployed host, not in `astro dev`, because the
dev server does not apply these rewrite rules.

`public/tips/` is a copy of the app, so re-copy it and reapply the base-path
edits whenever the source app changes. If that maintenance burden is unwanted,
use E1.

## Optional CI

Run the server tests on every push:

```sh
python3 -m unittest -v test_serve.py
```

The suite only covers the Python server's fallback and asset behavior; it does
not exercise the browser app.
