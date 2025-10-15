#!/usr/bin/env python3
"""
Simple HTTP server for BLD Memory Trainer development.
Run: python serve.py
"""

import http.server
import socketserver
import os

PORT = 8000
DIRECTORY = "."

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Allow ES modules
        self.send_header('Access-Control-Allow-Origin', '*')
        # Serve .ts files with JavaScript MIME type for development
        if self.path.endswith('.ts'):
            self.send_header('Content-Type', 'application/javascript')
        super().end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🧠 BLD Memory Trainer development server running...")
        print(f"📍 Open http://localhost:{PORT}/public/ in your browser")
        print(f"Press Ctrl+C to stop the server")
        httpd.serve_forever()


