"""Check an already running local I04 client/backend without accounts or SMTP."""
import base64
import hashlib
import json
import os
import socket
import urllib.request

opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
for path in ['/rest/sign-up/users/I04Smoke/available',
             '/rest/sign-up/mail/i04%40example.invalid/available', '/ws/info']:
    with opener.open('http://127.0.0.1:4200' + path, timeout=10) as response:
        body = json.load(response)
        assert response.status == 200
        if path == '/ws/info':
            assert body['websocket'] is True
        else:
            assert isinstance(body, bool)
        print('PASS HTTP 200 JSON', path)

with socket.create_connection(('127.0.0.1', 4200), timeout=10) as connection:
    key = base64.b64encode(os.urandom(16)).decode()
    connection.sendall(('GET /ws/websocket HTTP/1.1\r\nHost: localhost:4200\r\n'
                        'Origin: http://localhost:4200\r\nUpgrade: websocket\r\n'
                        'Connection: Upgrade\r\nSec-WebSocket-Key: ' + key + '\r\n'
                        'Sec-WebSocket-Version: 13\r\n\r\n').encode())
    header = b''
    while b'\r\n\r\n' not in header:
        chunk = connection.recv(4096)
        if not chunk:
            raise RuntimeError('Connection closed before WebSocket handshake')
        header += chunk
        assert len(header) < 65536
    text = header.decode(errors='replace')
    assert ' 101 ' in text.split('\r\n')[0], text
    accept = base64.b64encode(hashlib.sha1(
        (key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').encode()).digest()).decode()
    assert accept in text, text
    print('PASS WebSocket upgrade 101 with valid accept key (no STOMP login)')
