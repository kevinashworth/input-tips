import http.client
import socket
import threading
import time
import unittest
from functools import partial
from pathlib import Path

from serve import SPAHandler
from http.server import ThreadingHTTPServer

ROOT = Path(__file__).resolve().parent


class ServeTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = ThreadingHTTPServer(
            ("127.0.0.1", 0), partial(SPAHandler, directory=str(ROOT))
        )
        cls.httpd.daemon_threads = True
        cls.port = cls.httpd.server_address[1]
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls._wait_until_ready()

    @classmethod
    def _wait_until_ready(cls, timeout=5.0):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            with socket.socket() as sock:
                sock.settimeout(0.5)
                if sock.connect_ex(("127.0.0.1", cls.port)) == 0:
                    return
            time.sleep(0.05)
        raise RuntimeError("server did not become ready")

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=5)

    def request(self, path, method="GET"):
        conn = http.client.HTTPConnection("127.0.0.1", self.port, timeout=10)
        try:
            conn.request(method, path)
            resp = conn.getresponse()
            resp.read()
            return resp.status, resp.getheader("Content-Type") or ""
        finally:
            conn.close()

    def test_root_serves_index(self):
        status, ctype = self.request("/")
        self.assertEqual(status, 200)
        self.assertIn("text/html", ctype)

    def test_routes_fall_back_to_index(self):
        for path in ("/about", "/about/", "/deep/nested", "/doesnotexist", "/about?x=1"):
            with self.subTest(path=path):
                status, ctype = self.request(path)
                self.assertEqual(status, 200)
                self.assertIn("text/html", ctype)

    def test_existing_asset_is_served(self):
        for path in ("/src/app.js", "/src/theme.js"):
            with self.subTest(path=path):
                status, _ = self.request(path)
                self.assertEqual(status, 200)

    def test_missing_asset_404s(self):
        for path in ("/nope.js", "/nope.css"):
            with self.subTest(path=path):
                status, _ = self.request(path)
                self.assertEqual(status, 404)

    def test_directory_listing_disabled(self):
        for path in ("/src/", "/docs/"):
            with self.subTest(path=path):
                status, _ = self.request(path)
                self.assertEqual(status, 403)

    def test_head_on_route(self):
        status, _ = self.request("/about", method="HEAD")
        self.assertEqual(status, 200)


if __name__ == "__main__":
    unittest.main()
