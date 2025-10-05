#!/usr/bin/env python3
"""
n8n Webhook Proxy Server for Testing
Forwards requests to actual n8n webhook and returns responses
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime
import urllib.request
import urllib.error

# Your actual n8n webhook URL (set via environment variable for security)
import os
N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'https://your-n8n-instance.com/webhook/your-webhook-id')

class WebhookHandler(BaseHTTPRequestHandler):

    def _set_headers(self, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)

        try:
            # Parse incoming JSON
            data = json.loads(post_data.decode('utf-8'))

            # Log incoming request
            print(f"\n{'='*60}")
            print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] Forwarding request to n8n")
            print(f"{'='*60}")
            print(f"Session ID: {data.get('sessionId', 'N/A')}")
            print(f"Message: {data.get('message', 'N/A')}")
            print(f"Timestamp: {data.get('timestamp', 'N/A')}")
            print(f"{'='*60}\n")

            # Forward request to n8n webhook
            req = urllib.request.Request(
                N8N_WEBHOOK_URL,
                data=post_data,
                headers={'Content-Type': 'application/json'}
            )

            with urllib.request.urlopen(req, timeout=30) as response:
                n8n_response = response.read()
                n8n_data = json.loads(n8n_response.decode('utf-8'))

                # Log n8n response
                print(f"[OK] Received response from n8n:")
                print(f"  {json.dumps(n8n_data, indent=2)}\n")

                # Forward n8n response back to client
                self._set_headers(200)
                self.wfile.write(n8n_response)

        except urllib.error.HTTPError as e:
            error_msg = f"n8n webhook error: {e.code} {e.reason}"
            print(f"[ERROR] {error_msg}")
            print(f"[ERROR] URL: {N8N_WEBHOOK_URL}\n")
            self._set_headers(e.code)
            self.wfile.write(json.dumps({"error": error_msg}).encode('utf-8'))

        except urllib.error.URLError as e:
            error_msg = f"Failed to reach n8n webhook: {str(e.reason)}"
            print(f"[ERROR] {error_msg}\n")
            self._set_headers(503)
            self.wfile.write(json.dumps({"error": error_msg}).encode('utf-8'))

        except Exception as e:
            error_msg = f"Error processing request: {str(e)}"
            print(f"[ERROR] {error_msg}\n")
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": error_msg}).encode('utf-8'))

    def log_message(self, format, *args):
        # Suppress default logging
        pass

def run_server(port=5000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, WebhookHandler)

    print(f"""
================================================================
          Mock n8n Webhook Server - Testing Mode
================================================================

Server running on: http://localhost:{port}
Webhook endpoint:  http://localhost:{port}/webhook/test

Update your .env file:
VITE_N8N_WEBHOOK_URL=http://localhost:{port}/webhook/test

Press Ctrl+C to stop the server
""")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
