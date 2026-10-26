"""Verify I05 synthetic account provisioning and login across packaged-server restart."""
import json
import os
from pathlib import Path
import re
import sqlite3
import subprocess
import time
import urllib.request
import uuid

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'scripts/toolchain.json').read_text(encoding='utf-8'))
java = next(t for t in manifest['tools'] if t['name'] == 'java')
run = root / '.build-logs' / ('i05-smoke-' + uuid.uuid4().hex)
run.mkdir(parents=True)
database = run / 'application.sqlite'
env = {k: v for k, v in os.environ.items() if not k.startswith((
    'SPRING_', 'JDBC_', 'MAIL_', 'HTTP_AUTH_', 'STOMP_', 'LOG_', 'BM_DATABASE_',
    'APP_', 'SERVER_', 'JAVA_', 'JDK_JAVA_', '_JAVA_'))}
opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
hashes = None
for number in (1, 2):
    log = run / ('startup-' + str(number) + '.log')
    with log.open('w', encoding='utf-8') as output:
        process = subprocess.Popen([
            str(root / '.tools' / java['directory'] / 'bin/java.exe'), '-jar',
            str(root / 'server/target/bm-server-0.0.1-SNAPSHOT.jar'),
            '--spring.profiles.active=local', '--server.address=127.0.0.1', '--server.port=0',
            '--app.mail.enabled=false', '--app.database.path=' + str(database),
            '--app.dev.seed-accounts=' + ('true' if number == 1 else 'false')
        ], cwd=root / 'server', env=env, stdout=output, stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW)
        try:
            deadline = time.monotonic() + 60
            while True:
                text = log.read_text(encoding='utf-8', errors='replace')
                match = re.search(r'Tomcat started on port\(s\): (\d+)', text)
                ready = match and (number == 2 or 'Development account devBob: created' in text)
                if ready:
                    break
                if process.poll() is not None or time.monotonic() > deadline:
                    raise RuntimeError('Startup failed; see ' + str(log))
                time.sleep(0.2)
            base = 'http://127.0.0.1:' + match.group(1) + '/api/rest/v1/sign-in/validate'
            for username, password, expected in [
                ('devAlice', 'local-alice', True), ('devBob', 'local-bob', True),
                ('devAlice', 'wrong', False), ('unknown', 'wrong', False)]:
                request = urllib.request.Request(base, data=json.dumps({
                    'username': username, 'password': password}).encode(),
                    headers={'Content-Type': 'application/json'})
                with opener.open(request, timeout=10) as response:
                    assert json.load(response) is expected
            with sqlite3.connect(database) as db:
                rows = db.execute('SELECT C_USERNAME,T_SALTED_HASH,T_EMAIL,T_ROLE FROM USR001_CREDENTIALS ORDER BY C_USERNAME').fetchall()
                assert len(rows) == 2 and all(r[1].startswith('$2') and r[2] is None and r[3] == 'USER' for r in rows)
                if hashes is not None:
                    assert rows == hashes
                hashes = rows
            print('PASS startup', number, ': two valid identities; invalid/unknown rejected; persistent BCrypt records', flush=True)
        finally:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=10)
print('PASS restart without seeding preserves both identities; evidence:', run)
