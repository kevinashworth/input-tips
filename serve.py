#!/usr/bin/env python3
"""Static file server with SPA fallback for the no-build Preact app.

Any URL that does not map to a real file is served index.html, so client-side
routes such as /about, /about/, /deep/nested and arbitrary unknown paths load
correctly on direct navigation and hard reload. Paths that look like assets
(i.e. they have a file extension) still return 404, so a missing script or
stylesheet is obvious instead of silently returning HTML.

Usage:
    python3 serve.py [port]        # default port 8000
    python3 serve.py --host 0.0.0.0 --directory .
"""
import argparse
import os
import sys
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class SPAHandler(SimpleHTTPRequestHandler):
    def _is_fallback_route(self):
        path = urlsplit(self.path).path
        if os.path.exists(self.translate_path(self.path)):
            return False
        # Falls back only for extensionless paths. A route containing a dot
        # (e.g. /release-1.2) is treated as a missing asset and will 404 --
        # a deliberate tradeoff so broken .js/.css fail loudly.
        if os.path.splitext(path)[1]:
            return False
        return True

    def list_directory(self, path):
        # Never expose a browseable file tree (matters when bound to 0.0.0.0).
        self.send_error(HTTPStatus.FORBIDDEN, "Directory listing disabled")
        return None

    def send_head(self):
        if self._is_fallback_route():
            original, self.path = self.path, "/index.html"
            try:
                return super().send_head()
            finally:
                self.path = original
        return super().send_head()


def main():
    parser = argparse.ArgumentParser(description="Serve the app with SPA fallback.")
    parser.add_argument("port", nargs="?", type=int, default=8000)
    parser.add_argument("--host", default="127.0.0.1", help="bind address (default: 127.0.0.1)")
    parser.add_argument("--directory", default=os.path.dirname(os.path.abspath(__file__)))
    args = parser.parse_args()

    if args.host not in ("127.0.0.1", "localhost", "::1"):
        print(
            f"WARNING: binding to {args.host} exposes this dev server to your network. "
            "Local development only.",
            file=sys.stderr,
        )

    handler = lambda *a, **kw: SPAHandler(*a, directory=args.directory, **kw)
    with ThreadingHTTPServer((args.host, args.port), handler) as httpd:
        print(f"Serving {args.directory} at http://{args.host}:{args.port}/ (SPA fallback on)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
