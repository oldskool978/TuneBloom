import argparse
import functools
import http.server
import os
import socketserver
import sys
import webbrowser
from pathlib import Path
from typing import Any

ROOT_DIR = Path(__file__).parent.parent.resolve()


class TuneBloomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format: str, *args: Any) -> None:
        try:
            msg = format % args
            if "favicon.ico" in msg or "com.chrome.devtools" in msg:
                return
        except Exception:
            pass
        super().log_message(format, *args)

    def do_GET(self) -> None:
        if self.path == "/favicon.ico" or "appspecific/com.chrome.devtools" in self.path:
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, HEAD")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()

    def guess_type(self, path: str) -> str:
        if path.endswith(".wasm"):
            return "application/wasm"
        if path.endswith(".js") or path.endswith(".mjs"):
            return "application/javascript"
        if path.endswith(".opus"):
            return "audio/ogg"
        if path.endswith(".wav"):
            return "audio/wav"
        return super().guess_type(path)


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True


def main() -> None:
    parser = argparse.ArgumentParser(description="TuneBloom Boompus Local AudioWorklet Test Server")
    parser.add_argument("--port", type=int, default=8080, help="Local HTTP port (Default: 8080)")
    parser.add_argument("--no-browser", action="store_true", help="Do not auto-launch browser")
    args = parser.parse_args()

    os.chdir(str(ROOT_DIR))
    handler = functools.partial(TuneBloomHTTPRequestHandler, directory=str(ROOT_DIR))

    with ThreadingHTTPServer(("", args.port), handler) as httpd:
        url = f"http://localhost:{args.port}/test/test_bench.html"
        print("================================================================================")
        print("            TUNEBLOOM BOOMPUS WEBAUDIO / WASM TEST SERVER                       ")
        print("================================================================================")
        print(f"  Testbench URL     : {url}")
        print("  Isolation Headers : COOP (same-origin), COEP (require-corp), CORS (*)")
        print("--------------------------------------------------------------------------------")
        print("  Press Ctrl+C to terminate server.")
        print("================================================================================")

        if not args.no_browser:
            webbrowser.open(url)

        httpd.timeout = 0.5
        try:
            while True:
                httpd.handle_request()
        except KeyboardInterrupt:
            print("\n[*] Server shutdown cleanly.")
            sys.exit(0)


if __name__ == "__main__":
    main()