"""Seal or verify the local I22 candidate; no network, deployment or approval."""
import argparse
import hashlib
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'docs/reports/i22-candidate.json'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def git(*args):
    return subprocess.check_output(
        ['git', '-c', f'safe.directory={ROOT.as_posix()}', '-C', str(ROOT), *args])


def sources():
    names = git('ls-files', '--cached', '--others', '--exclude-standard', '-z').decode('utf-8').split('\0')
    return {name: sha(ROOT / name) for name in sorted(names)
            if name and name != MANIFEST.relative_to(ROOT).as_posix()}


def fingerprint(files):
    return hashlib.sha256(json.dumps(files, sort_keys=True,
                                    separators=(',', ':')).encode()).hexdigest()


def create():
    manifest_name = MANIFEST.relative_to(ROOT).as_posix()
    changed = set(git('diff', 'HEAD', '--name-only').decode('utf-8').splitlines())
    untracked = set(git('ls-files', '--others', '--exclude-standard').decode('utf-8').splitlines())
    assert changed <= {manifest_name} and untracked <= {manifest_name}, 'Commit the complete source snapshot first'
    files = sources()
    logs = ROOT / '.build-logs'
    ordinary = (logs / 'i22-test.log').read_text(encoding='utf-8-sig')
    context = (logs / 'i22-context.log').read_text(encoding='utf-8-sig')
    for text, count in ((ordinary, 249), (context, 356)):
        assert re.search(rf'Tests run: {count}, Failures: 0, Errors: 0, Skipped: 0', text)
        assert 'BUILD SUCCESS' in text
    assert 'Tests: 28, passed: 28, failed: 0' in ordinary
    assert 'Regolamento e copia client allineati: 39 carte' in (logs / 'i22-rules.log').read_text(encoding='utf-8-sig')
    assert 'BUILD SUCCESS' in (logs / 'i22-server-build.log').read_text(encoding='utf-8-sig')
    assert 'Hash: 380cb14845b778e6084b' in (logs / 'i22-client-build.log').read_text(encoding='utf-8-sig')
    assert 'PASS' in (logs / 'i22-smoke.log').read_text(encoding='utf-8-sig')
    assert 'BUILD SUCCESS' in (logs / 'i22-clean-server.log').read_text(encoding='utf-8-sig')
    clean_client = (logs / 'i22-clean-client.log').read_text(encoding='utf-8-sig')
    clean_hash = re.search(r'Build at: .* - Hash: ([0-9a-f]+) - Time:', clean_client)
    assert clean_hash, 'Missing successful clean client build'
    audit = json.loads((logs / 'i19c-manifest.json').read_text(encoding='utf-8-sig'))
    assert (audit['ordinaryMatches'], audit['lifecycleMatches'], audit['restartActiveMatches']) == (7, 12, 12)
    paths = ['bm-server/target/bm-server-0.0.1-SNAPSHOT.jar']
    paths += [p.relative_to(ROOT).as_posix() for p in
              sorted((ROOT / 'bm-web-client/dist/bm-web-client').rglob('*')) if p.is_file()]
    assert len(paths) > 1
    evidence = ['i22-test.log', 'i22-context.log', 'i22-rules.log',
                'i22-server-build.log', 'i22-client-build.log', 'i22-smoke.log',
                'i22-clean-server.log', 'i22-clean-client.log', 'i22-clean-compare.json',
                'i22-repeat-1.log', 'i22-repeat-2.log', 'i22-toolchain.json',
                'i22-bm-server-history-check.log', 'i22-bm-web-client-history-check.log',
                'i19c-manifest.json', 'i22-manifests.log', 'i22-preservation.json',
                'i13-ux-outcome.png', 'i16-ux-selected.png', 'i16-ux-rejected.png',
                'i17a-ux-evidence/bob-pending-restored.jpg', 'i17b-ux-summary.json',
                'i24-ux-restart-draw.png', 'i24-ux-hub.png']
    before = json.loads((ROOT / '.repository-history/before.json').read_text(encoding='utf-8'))
    result = {
        'schemaVersion': 1, 'candidateId': 'I22-' + fingerprint(files)[:16],
        'date': '2026-10-26', 'status': 'candidato verificato',
        'ownerApproval': None, 'sourceRevision': git('rev-parse', 'HEAD').decode().strip(),
        'sourceTreeSha256': fingerprint(files), 'sources': files,
        'legacyRevisions': {name: entry['head'] for name, entry in before.items()},
        'rulesVersion': '1.6', 'databaseSchema': [1, 2, 3],
        'clientBuildHash': '380cb14845b778e6084b',
        'cleanClientBuildHash': clean_hash.group(1),
        'tests': {'serverOrdinary': 249, 'client': 28, 'serverContextIncludingUnits': 356,
                  'failures': 0, 'errors': 0, 'skipped': 0},
        'archiveAudit': audit,
        'artifacts': {name: sha(ROOT / name) for name in paths},
        'evidence': {'.build-logs/' + name: sha(logs / name) for name in evidence},
        'toolchain': json.loads((ROOT / 'scripts/toolchain.json').read_text()),
        'ux': 'Prove separate I13/I15/I16/I17/I14-I23/I24 conservate; nessuna nuova interazione I22.',
    }
    MANIFEST.write_text(json.dumps(result, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    print('PASS candidate:', result['candidateId'])


def verify(snapshot=False):
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    if snapshot:
        # Approval records may update documentation after the immutable candidate was sealed.
        with tarfile.open(fileobj=io.BytesIO(git('archive', '--format=tar', manifest['sourceRevision']))) as archive:
            current = {entry.name: hashlib.sha256(archive.extractfile(entry).read()).hexdigest()
                       for entry in archive.getmembers() if entry.isfile()
                       and entry.name != MANIFEST.relative_to(ROOT).as_posix()}
    else:
        current = sources()
    assert current == manifest['sources'], 'Versioned source files changed; candidate is stale'
    assert fingerprint(current) == manifest['sourceTreeSha256']
    for group in ('artifacts', 'evidence'):
        for name, digest in manifest[group].items():
            path = ROOT / name
            assert path.is_file() and sha(path) == digest, f'Missing or changed {group}: {name}'
    assert manifest['ownerApproval'] is None, 'Owner approval must be recorded separately'
    print('PASS verified' + (' snapshot' if snapshot else '') + ':', manifest['candidateId'])


def compare_clean():
    clean = ROOT / '.build-logs/i22-clean-source'
    paths = git('ls-files', '-z', 'bm-server', 'bm-web-client', 'docs/game-rules.md',
                'docs/rules-catalog.json', 'scripts/build.ps1', 'scripts/toolchain.json').decode().strip('\0').split('\0')
    for name in paths:
        assert sha(ROOT / name) == sha(clean / name), f'Clean input differs: {name}'
    jar = Path('bm-server/target/bm-server-0.0.1-SNAPSHOT.jar')
    with zipfile.ZipFile(ROOT / jar) as built, zipfile.ZipFile(clean / jar) as rebuilt:
        entries = {n: hashlib.sha256(built.read(n)).hexdigest() for n in built.namelist() if not n.endswith('/')}
        other = {n: hashlib.sha256(rebuilt.read(n)).hexdigest() for n in rebuilt.namelist() if not n.endswith('/')}
        assert entries.keys() == other.keys()
        different = [n for n in entries if entries[n] != other[n]]
        assert not any(n.startswith('BOOT-INF/') or n.endswith('.class') for n in different), different
        assert not any('RestartServerProcess' in n or 'Test.class' in n for n in entries)
        for resource, source in [('analysis/game-rules.md', 'docs/game-rules.md'),
                                 ('analysis/rules-catalog.json', 'docs/rules-catalog.json'),
                                 ('cards.sqlite', 'bm-server/src/main/resources/cards.sqlite')]:
            assert built.read('BOOT-INF/classes/' + resource) == (ROOT / source).read_bytes()
    result = {'status': 'PASS', 'identicalBuildInputs': len(paths),
              'identicalApplicationJarEntries': sum(n.startswith('BOOT-INF/classes/') for n in entries),
              'otherDifferentJarEntries': different, 'jarByteIdentical': sha(ROOT / jar) == sha(clean / jar),
              'clientNote': 'Both production builds succeeded; cross-path byte reproducibility is not asserted.',
              'sharedCache': '.tools and installed node_modules only; target and dist rebuilt'}
    (ROOT / '.build-logs/i22-clean-compare.json').write_text(json.dumps(result, indent=2) + '\n')
    print('PASS clean comparison:', json.dumps(result))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--verify', action='store_true')
    mode.add_argument('--compare-clean', action='store_true')
    parser.add_argument('--snapshot', action='store_true', help='Verify the sealed Git revision instead of the current working files')
    args = parser.parse_args()
    if args.snapshot and not args.verify:
        parser.error('--snapshot requires --verify')
    if args.verify:
        verify(snapshot=args.snapshot)
    elif args.compare_clean:
        compare_clean()
    else:
        create()
