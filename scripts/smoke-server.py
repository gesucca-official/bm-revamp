"""Start the packaged server twice on loopback with a fresh synthetic SQLite database.

No credentials, SMTP, shared database or remote application endpoint is used.
Outputs stay under .build-logs; no running game is created or restored.
"""
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import time
import urllib.request
import uuid

ROOT = Path(__file__).resolve().parent.parent
manifest = json.loads((ROOT / 'scripts/toolchain.json').read_text())
java = next(t for t in manifest['tools'] if t['name'] == 'java')
executable = ROOT / '.tools' / java['directory'] / 'bin/java.exe'
jar = ROOT / 'server/target/bm-server-0.0.1-SNAPSHOT.jar'
run = ROOT / '.build-logs' / ('i03-smoke-' + uuid.uuid4().hex)
run.mkdir(parents=True)
database = run / 'application.sqlite'
env = {k: v for k, v in os.environ.items()
       if not k.startswith(('SPRING_', 'JDBC_', 'MAIL_', 'HTTP_AUTH_', 'STOMP_', 'LOG_',
                            'BM_DATABASE_', 'APP_', 'SERVER_', 'JAVA_', 'JDK_JAVA_', '_JAVA_'))}
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))


def check_start(number, expected_available):
    log = run / ('startup-' + str(number) + '.log')
    with log.open('w', encoding='utf-8') as output:
        process = subprocess.Popen([
            str(executable), '-jar', str(jar), '--spring.profiles.active=local',
            '--server.address=127.0.0.1', '--server.port=0', '--app.mail.enabled=false',
            '--app.database.path=' + str(database)
        ], cwd=ROOT / 'server', env=env, stdout=output, stderr=subprocess.STDOUT)
        try:
            deadline = time.monotonic() + 60
            port = None
            while time.monotonic() < deadline:
                text = log.read_text(encoding='utf-8', errors='replace')
                match = re.search(r'Tomcat started on port\(s\): (\d+)', text)
                if match:
                    port = int(match.group(1))
                    break
                if process.poll() is not None:
                    raise RuntimeError('Server exited before startup; see ' + str(log))
                time.sleep(0.2)
            if port is None:
                raise RuntimeError('Startup timeout; see ' + str(log))
            url = f'http://127.0.0.1:{port}/api/rest/v1/sign-up/users/i03-smoke/available'
            with opener.open(url, timeout=5) as response:
                assert response.status == 200
                actual = json.load(response)
            assert actual is expected_available, (actual, expected_available)
            print(f'PASS packaged startup {number}: HTTP 200, available={actual}', flush=True)
        finally:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=10)


check_start(1, True)
# Seed only this new synthetic smoke file; never a pre-existing application database.
with sqlite3.connect(database) as db:
    db.execute('INSERT INTO USR001_CREDENTIALS VALUES (?,?,?,?)',
               ('i03-smoke', 'synthetic@example.invalid', 'synthetic-not-a-login-hash', 'USER'))
check_start(2, False)
with sqlite3.connect(database) as db:
    assert db.execute('pragma integrity_check').fetchone()[0] == 'ok'
    assert db.execute('select version from BM_SCHEMA_VERSION order by version').fetchall() == [(1,), (2,), (3,)]
print('PASS synthetic account survives server process restart; no game restore performed', flush=True)
print('Evidence:', run, flush=True)
