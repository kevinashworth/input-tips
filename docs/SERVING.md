# Serving and testing the app

This is a no-build Preact app. `serve.py` is a small static file server with an
SPA fallback, and `test_serve.py` is its test suite. Neither requires any
third-party Python packages.

## `serve.py`

```sh
python3 serve.py [port]                 # default: 8000, bound to 127.0.0.1
python3 serve.py --host 0.0.0.0 --directory . 8000
```

It subclasses `SimpleHTTPRequestHandler` and changes three behaviors:

- **SPA fallback.** Any extensionless URL that does not map to a real file
  (e.g. `/about`, `/deep/nested`, `/nope`) serves `index.html`, so client-side
  routes survive direct navigation and hard reloads.
- **Assets still fail loudly.** A missing path with a file extension
  (`/nope.js`, `/nope.css`) returns 404 instead of HTML. Note this also means a
  route containing a dot (e.g. `/release-1.2`) is treated as an asset.
- **No directory listings.** Requesting a directory (`/src/`, `/docs/`) returns
  403 rather than a browseable file tree. This matters if the server is bound
  to a non-loopback address.

The server is threaded (`ThreadingHTTPServer`) and prints a warning when bound
to a non-local host, since it is intended for local development only.

## `test_serve.py`

```sh
python3 -m unittest -v test_serve.py
```

The suite starts `serve.py`'s handler on an ephemeral port in a background
thread, so it does not touch port 8000 and needs no running server. Each test
opens a real HTTP connection and checks the status codes:

| Test | Expectation |
| --- | --- |
| root serves index | `/` → 200 `text/html` |
| routes fall back to index | `/about`, `/about/`, `/deep/nested`, `/nope`, `/about?x=1` → 200 HTML |
| existing assets are served | `/src/app.js`, `/src/theme.js` → 200 |
| missing assets 404 | `/nope.js`, `/nope.css` → 404 |
| directory listing disabled | `/src/`, `/docs/` → 403 |
| HEAD on a route | `HEAD /about` → 200 |

Add a case here when changing fallback rules, extension handling, or directory
behavior.
