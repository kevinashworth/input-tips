# Switching to fully vendored dependencies

By default this app loads every dependency (and Bulma) from a CDN via the
import map in `index.html`. No npm install and no build step are required.

"Fully vendored" means every dependency is stored as a static file inside this
repo under `vendor/`, and the import map points at those local files instead of
remote URLs. The app then works completely offline.

```tree
vendor/
  preact.js
  preact-hooks.js
  preact-jsx-runtime.js
  signals.js
  htm-preact.js
  preact-iso.js
  bulma.min.css
```

## 1. Download the JavaScript modules

The CDN we use is [esm.sh](https://esm.sh). Each bare specifier in the import
map maps to one file. Fetch each one with `curl` (or save it from your browser):

```sh
mkdir -p vendor

curl -L "https://esm.sh/preact@11.0.2"            -o vendor/preact.js
curl -L "https://esm.sh/preact@11.0.2/hooks"      -o vendor/preact-hooks.js
curl -L "https://esm.sh/preact@11.0.2/jsx-runtime" -o vendor/preact-jsx-runtime.js
curl -L "https://esm.sh/@preact/signals@2.11.3?external=preact" -o vendor/signals.js
curl -L "https://esm.sh/htm@3.1.1/preact?external=preact"       -o vendor/htm-preact.js
curl -L "https://esm.sh/preact-iso@2.12.2?external=preact"      -o vendor/preact-iso.js
```

## 2. Verify the internal import paths

Open each downloaded file and look at its `import ... from "..."` statements.
esm.sh bundles rewrite their internals to absolute URLs (usually back to
`https://esm.sh/...`). Two ways to handle this:

- **Quick**: leave those internal URLs as-is. The app works online and only the
  top-level specifiers are local. This is *not* fully offline.
- **Fully offline (recommended)**: also download every URL those files import
  and rewrite each import to a relative `./...` path. Repeat until no `https://`
  remains. A small script can automate this:

  ```sh
  # crude loop: grep remote imports, download them, rewrite to ./vendor paths
  grep -rhoE "https://esm\.sh/[^\"']+" vendor/*.js | sort -u
  ```

> The imported files are plain ES modules, so relative paths such as
> `import "/vendor/preact.js"` (or `./preact.js` next to the importer) work in
> the browser with no bundler.

## 3. Point the import map at the local files

Edit `index.html` and replace the CDN URLs:

```html
<script type="importmap">
	{
		"imports": {
			"preact": "./vendor/preact.js",
			"preact/": "./vendor/",
			"preact/hooks": "./vendor/preact-hooks.js",
			"preact/jsx-runtime": "./vendor/preact-jsx-runtime.js",
			"@preact/signals": "./vendor/signals.js",
			"htm/preact": "./vendor/htm-preact.js",
			"preact-iso": "./vendor/preact-iso.js"
		}
	}
</script>
```

## 4. Vendor Bulma

```sh
curl -L "https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css" \
	-o vendor/bulma.min.css
```

Then in `index.html`:

```html
<link rel="stylesheet" href="./vendor/bulma.min.css" />
```

## 5. Serve and test offline

```sh
python3 serve.py 8000
```

Open <http://localhost:8000>, then disconnect the network (or use your browser's
offline mode) and hard-reload. Everything should still work. (`serve.py` adds an
SPA fallback so routes like `/about` load on direct navigation; plain
`python3 -m http.server` still works for the root URL.)

## Common pitfalls

- **Duplicate Preact copies.** Preact must exist as a *single* instance. The
  `?external=preact` query parameter on the CDN URLs exists precisely to prevent
  esm.sh from bundling a second copy. When vendoring, make sure every module that
  needs Preact imports the same `vendor/preact.js` file (adjust its internal
  imports if necessary).
- **MIME types.** Browsers refuse to run ES modules served with the wrong
  `Content-Type`. `python3 -m http.server` serves `.js` correctly, so this only
  bites if you deploy behind a server that mislabels files.
- **Versions.** Keep the versions in `vendor/` in sync with the comment in
  `index.html`. Bump both together.
