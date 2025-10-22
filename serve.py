#!/usr/bin/env python3
"""
Simple HTTP server for BLD Memory Trainer development.
Run: python serve.py
"""

import http.server
import socketserver
import os

PORT = 3000
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
    
    def do_GET(self):
        # Check if this is an HTML file that needs API base URL injection
        if self.path.endswith('.html') or self.path == '/' or self.path == '/public/' or self.path == '/public/index.html':
            # Get the API base URL from environment variable
            api_base_url = os.environ.get('API_BASE_URL', 'http://localhost:8000/api/v1')
            
            # Read the HTML file
            if self.path == '/' or self.path == '/public/':
                file_path = 'public/index.html'
            elif self.path == '/public/index.html':
                file_path = 'public/index.html'
            else:
                file_path = self.path.lstrip('/')
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Inject the API base URL script
                script_tag = f'<script>window.API_BASE_URL = "{api_base_url}";</script>'
                
                # Insert the script tag before the closing head tag or at the beginning of body
                if '</head>' in content:
                    content = content.replace('</head>', f'{script_tag}\n</head>')
                elif '<body>' in content:
                    content = content.replace('<body>', f'<body>\n{script_tag}')
                else:
                    content = f'{script_tag}\n{content}'
                
                # Send the modified content
                self.send_response(200)
                self.send_header('Content-Type', 'text/html; charset=utf-8')
                self.end_headers()
                self.wfile.write(content.encode('utf-8'))
                return
                
            except FileNotFoundError:
                # If file not found, fall back to default behavior
                pass
        
        # For all other files, use the default behavior
        super().do_GET()

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print("🧠 BLD Memory Trainer development server running...")
        print(f"📍 Open http://localhost:{PORT}/public/ in your browser")
        print("Press Ctrl+C to stop the server")
        httpd.serve_forever()


