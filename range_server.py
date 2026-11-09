import os
import sys
import re
from http.server import SimpleHTTPRequestHandler, HTTPServer

class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    """
    HTTP Request Handler that supports Range requests (HTTP 206 Partial Content).
    Enables seeking in audio (mp3/ogg) and video (mp4/webm) files in all browsers.
    """
    def end_headers(self):
        self.send_header('Accept-Ranges', 'bytes')
        super().end_headers()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        fs = os.fstat(f.fileno())
        total_length = fs.st_size
        range_header = self.headers.get('Range')

        if range_header:
            m = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if m:
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else total_length - 1
                if start >= total_length or end >= total_length or start > end:
                    self.send_error(416, "Requested Range Not Satisfiable")
                    self.send_header('Content-Range', f'bytes */{total_length}')
                    self.end_headers()
                    f.close()
                    return None

                length = end - start + 1
                self.send_response(206, 'Partial Content')
                self.send_header('Content-Type', self.guess_type(path))
                self.send_header('Content-Range', f'bytes {start}-{end}/{total_length}')
                self.send_header('Content-Length', str(length))
                self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
                self.end_headers()
                f.seek(start)
                return f

        self.send_response(200)
        self.send_header('Content-Type', self.guess_type(path))
        self.send_header('Content-Length', str(total_length))
        self.send_header('Last-Modified', self.date_time_string(fs.st_mtime))
        self.end_headers()
        return f

    def copyfile(self, source, outputfile):
        range_header = self.headers.get('Range')
        if range_header:
            m = re.match(r'bytes=(\d+)-(\d*)', range_header)
            if m:
                path = self.translate_path(self.path)
                total_length = os.path.getsize(path)
                start = int(m.group(1))
                end = int(m.group(2)) if m.group(2) else total_length - 1
                length = end - start + 1
                
                buffer_size = 64 * 1024
                bytes_sent = 0
                while bytes_sent < length:
                    to_read = min(buffer_size, length - bytes_sent)
                    buf = source.read(to_read)
                    if not buf:
                        break
                    outputfile.write(buf)
                    bytes_sent += len(buf)
                return

        super().copyfile(source, outputfile)

def run(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, RangeHTTPRequestHandler)
    print(f"Serving HTTP on port {port} with Range request support (HTTP 206)...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run(port)
