import http.server
import json
import os
import sys
import base64
import time
import re
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

from backend.db import init_db
from backend.api import handle_api_request

DATA_DIR = os.path.abspath('data')
UPLOADS_DIR = os.path.abspath(os.path.join('assets', 'uploads'))
CONTENT_FILE = os.path.join(DATA_DIR, 'site-content.json')

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

class CMSHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # 1. Check REST API handlers
        if self.path.startswith('/api/'):
            # Legacy site content JSON
            if self.path == '/api/content' or self.path == '/api/content/':
                self.send_response(200)
                self.send_header('Content-Type', 'application/json; charset=utf-8')
                self.end_headers()
                if os.path.exists(CONTENT_FILE):
                    with open(CONTENT_FILE, 'rb') as f:
                        self.wfile.write(f.read())
                else:
                    self.wfile.write(b'{}')
                return

            # Check database REST APIs
            res = handle_api_request(self, 'GET', self.path)
            if res is not False:
                return

        # Clean URL redirects
        clean = self.path.split('?')[0].rstrip('/')
        if clean == '/admin':
            self.send_response(302)
            self.send_header('Location', '/admin.html')
            self.end_headers()
            return

        super().do_GET()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if self.path.startswith('/api/'):
            # Legacy site content save
            if self.path == '/api/content' or self.path == '/api/content/':
                try:
                    data = json.loads(post_data.decode('utf-8'))
                    with open(CONTENT_FILE, 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'ok', 'message': 'Content saved successfully'}).encode('utf-8'))
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
                return

            # Legacy image upload
            if self.path == '/api/upload' or self.path == '/api/upload/':
                try:
                    req = json.loads(post_data.decode('utf-8'))
                    filename = req.get('filename', f'upload_{int(time.time()*1000)}.png')
                    filename = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
                    data_url = req.get('dataUrl', '')
                    if ',' in data_url:
                        header, b64_str = data_url.split(',', 1)
                    else:
                        b64_str = data_url
                    raw_bytes = base64.b64decode(b64_str)
                    save_path = os.path.join(UPLOADS_DIR, filename)
                    with open(save_path, 'wb') as f:
                        f.write(raw_bytes)
                    rel_url = f'assets/uploads/{filename}'
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'ok', 'url': rel_url, 'filename': filename}).encode('utf-8'))
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.end_headers()
                    self.wfile.write(json.dumps({'status': 'error', 'message': str(e)}).encode('utf-8'))
                return

            # Database REST APIs
            res = handle_api_request(self, 'POST', self.path, post_data)
            if res is not False:
                return

        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        if self.path.startswith('/api/'):
            res = handle_api_request(self, 'PUT', self.path, post_data)
            if res is not False:
                return
        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            res = handle_api_request(self, 'DELETE', self.path)
            if res is not False:
                return
        self.send_response(404)
        self.end_headers()

    def log_message(self, format, *args):
        sys.stderr.write("%s - - [%s] %s\n" % (self.address_string(), self.log_date_time_string(), format % args))

if __name__ == '__main__':
    init_db()
    port = 8080
    server = ThreadingHTTPServer(('0.0.0.0', port), CMSHandler)
    server.daemon_threads = True
    print(f"EarthGlaze Full E-Commerce Server running on http://localhost:{port}/")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
