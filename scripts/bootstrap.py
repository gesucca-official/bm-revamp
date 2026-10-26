"""Install the pinned recovery toolchain locally; never alter global PATH/JAVA_HOME."""
import hashlib
import json
from pathlib import Path
import sys
import urllib.request
import zipfile
from concurrent.futures import ThreadPoolExecutor

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / '.tools'


def install(tool):
    archive = TOOLS / tool['url'].rsplit('/', 1)[1]
    target = TOOLS / tool['directory']
    if target.exists() and (target / '.bm-verified').exists():
        print(tool['name'], 'already installed', flush=True)
        return
    if not archive.exists():
        print('Downloading', tool['name'], flush=True)
        temporary = archive.with_suffix('.download')
        urllib.request.urlretrieve(tool['url'], temporary)
        temporary.replace(archive)
    digest = hashlib.new(tool['algorithm'], archive.read_bytes()).hexdigest()
    if digest != tool['checksum']:
        raise RuntimeError('Checksum mismatch: ' + str(archive))
    with zipfile.ZipFile(archive) as bundle:
        for name in bundle.namelist():
            resolved = (TOOLS / name).resolve()
            if not resolved.is_relative_to(TOOLS.resolve()):
                raise RuntimeError('Unsafe archive entry: ' + name)
        bundle.extractall(TOOLS)
    (target / '.bm-verified').write_text(digest + '\n')
    print('Verified and installed', tool['name'], tool['version'], flush=True)


if __name__ == '__main__':
    if sys.platform != 'win32':
        raise SystemExit('This pinned toolchain targets Windows x64 only.')
    TOOLS.mkdir(exist_ok=True)
    manifest = json.loads((ROOT / 'scripts/toolchain.json').read_text())
    with ThreadPoolExecutor(max_workers=3) as pool:
        list(pool.map(install, manifest['tools']))
