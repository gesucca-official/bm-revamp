#!/usr/bin/env python3
"""Riepilogo per la revisione di un blocco di lavoro (docs/orchestrazione-lavoro.md, «Come si rivede una relazione»).

Uso: python scripts/review-block.py <base>..<testa> [--scope glob,glob,...] [--max-lines N]

Stampa, con la sola libreria standard e git:
  - i file toccati per categoria (prodotto, test, strumenti, documenti, evidenze, altro) con righe e byte,
    e quelli fuori da --scope (glob sul percorso con barre, `*` attraversa le cartelle);
  - nei test le righe cambiate con assert, expect, BASE_750 o attesi numerici;
  - negli strumenti le righe cambiate che contengono numeri (possibili soglie);
  - il peso delle evidenze aggiunte, con avviso oltre 3 MB;
  - per ogni run-summary.json aggiunto: esiti verdi su totali e nomi dei rossi;
  - i messaggi dei commit.
È uno specchio dei fatti, non un giudizio: i punti segnalati vanno letti nel diff.
"""
import fnmatch
import json
import re
import subprocess
import sys

EVIDENCE_WARN_BYTES = 3 * 1024 * 1024
CATEGORIES = ["prodotto", "test", "strumenti", "documenti", "evidenze", "altro"]

PRODUCT_PREFIXES = ("client-web/src/", "server/src/main/", "docs/sets/")
PRODUCT_FILES = ("client-web/index.html", "docs/game-rules.md", "docs/rules-catalog.json")
TOOL_PREFIXES = ("client-web/tools/", "scripts/")
TOOL_FILES = ("client-web/run.ps1",)
TEST_PREFIXES = ("client-web/tests/", "server/src/test/")

TEST_LINE = re.compile(
    r"\b(assert\w*|expect\w*|BASE_750)\b|\.(toBe\w*|toEqual|toStrictEqual|toMatch\w*|toHaveLength)\b"
    r"|(===?|!==?|<=|>=|<|>)\s*-?\d|\(\s*-?\d+(\.\d+)?\s*[,)]"
)
NUMBER = re.compile(r"(?<![\w.#$])-?\d+(?:[.,]\d+)?")


def git(*args, text=True):
    p = subprocess.run(["git", "-c", "core.quotepath=off", *args], capture_output=True)
    if p.returncode != 0:
        sys.exit(f"git {' '.join(args)}: {p.stderr.decode('utf-8', 'replace').strip()}")
    return p.stdout.decode("utf-8", "replace") if text else p.stdout


def category(path):
    if path.startswith("docs/reports/") and not path.endswith(".md"):
        return "evidenze"
    if path.startswith(PRODUCT_PREFIXES) or path in PRODUCT_FILES:
        return "prodotto"
    if path.startswith(TEST_PREFIXES):
        return "test"
    if path.startswith(TOOL_PREFIXES) or path in TOOL_FILES:
        return "strumenti"
    if path.endswith(".md"):
        return "documenti"
    return "altro"


def changed_files(base, head):
    status = {}
    parts = git("diff", "--name-status", "-z", "--no-renames", base, head).split("\0")
    for i in range(0, len(parts) - 1, 2):
        status[parts[i + 1]] = parts[i][0]
    stats = {}
    parts = git("diff", "--numstat", "-z", "--no-renames", base, head).split("\0")
    for rec in parts:
        if not rec:
            continue
        a, d, path = rec.split("\t", 2)
        stats[path] = (None, None) if a == "-" else (int(a), int(d))
    return status, stats


def blob_sizes(base, head, status):
    specs = []
    for path, st in status.items():
        specs.append(f"{base if st == 'D' else head}:{path}")
    sizes = {}
    if not specs:
        return sizes
    p = subprocess.run(["git", "cat-file", "--batch-check"], input="\n".join(specs) + "\n",
                       capture_output=True, text=True, encoding="utf-8")
    # una riga di uscita per riga di ingresso, nello stesso ordine: "<oid> <tipo> <byte>" oppure "<spec> missing"
    for spec, line in zip(specs, p.stdout.splitlines()):
        fields = line.split()
        if len(fields) == 3 and fields[2].isdigit():
            sizes[spec.split(":", 1)[1]] = int(fields[2])
    return sizes


def fmt_bytes(n):
    if n >= 1024 * 1024:
        return f"{n / 1024 / 1024:.2f} MB"
    if n >= 1024:
        return f"{n / 1024:.1f} KB"
    return f"{n} B"


def changed_lines(base, head, path):
    """Righe cambiate di un file: (segno, numero, testo)."""
    out = []
    old_no = new_no = 0
    for raw in git("diff", "-U0", "--no-renames", base, head, "--", path).splitlines():
        m = re.match(r"@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@", raw)
        if m:
            old_no, new_no = int(m.group(1)), int(m.group(2))
            continue
        if raw.startswith("+++") or raw.startswith("---") or raw.startswith("diff ") or raw.startswith("index "):
            continue
        if raw.startswith("+"):
            out.append(("+", new_no, raw[1:]))
            new_no += 1
        elif raw.startswith("-"):
            out.append(("-", old_no, raw[1:]))
            old_no += 1
    return out


def show_lines(items, limit):
    for sign, no, text in items[:limit]:
        t = text.strip()
        if len(t) > 150:
            t = t[:147] + "..."
        print(f"    {sign}{no}: {t}")
    if len(items) > limit:
        print(f"    ... altre {len(items) - limit} righe")


def main(argv):
    scope = []
    max_lines = 25
    spec = None
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--scope":
            i += 1
            scope = [s.strip() for s in argv[i].split(",") if s.strip()]
        elif a.startswith("--scope="):
            scope = [s.strip() for s in a.split("=", 1)[1].split(",") if s.strip()]
        elif a == "--max-lines":
            i += 1
            max_lines = int(argv[i])
        elif spec is None:
            spec = a
        else:
            sys.exit("uso: review-block.py <base>..<testa> [--scope glob,...] [--max-lines N]")
        i += 1
    if not spec:
        sys.exit("uso: review-block.py <base>..<testa> [--scope glob,...] [--max-lines N]")
    if ".." in spec:
        base, _, head = spec.partition("..")
    else:
        base, head = spec + "~1", spec
    base, head = base or "HEAD", head or "HEAD"

    status, stats = changed_files(base, head)
    sizes = blob_sizes(base, head, status)
    print(f"== {base}..{head}: {len(status)} file toccati ==")

    by_cat = {c: [] for c in CATEGORIES}
    for path in sorted(status):
        by_cat[category(path)].append(path)
    for c in CATEGORIES:
        paths = by_cat[c]
        if not paths:
            continue
        add = sum((stats.get(p, (0, 0))[0] or 0) for p in paths)
        dele = sum((stats.get(p, (0, 0))[1] or 0) for p in paths)
        total = sum(sizes.get(p, 0) for p in paths if status[p] != "D")
        print(f"\n[{c}] {len(paths)} file, +{add} -{dele} righe, {fmt_bytes(total)}")
        shown = paths if c != "evidenze" or len(paths) <= 12 else paths[:12]
        for p in shown:
            a, d = stats.get(p, (0, 0))
            rows = "binario" if a is None else f"+{a} -{d}"
            print(f"  {status[p]} {p}  ({rows}, {fmt_bytes(sizes.get(p, 0))})")
        if len(shown) < len(paths):
            print(f"  ... altri {len(paths) - len(shown)} file di evidenze (peso sotto)")

    if scope:
        out = [p for p in sorted(status) if not any(fnmatch.fnmatch(p, g) for g in scope)]
        print(f"\n== Fuori da --scope ({', '.join(scope)}): {len(out)} ==")
        for p in out:
            print(f"  {status[p]} [{category(p)}] {p}")
        if not out:
            print("  nessuno")

    print("\n== Test: righe con assert, expect, BASE_750 o attesi numerici ==")
    found = False
    for p in by_cat["test"]:
        items = [x for x in changed_lines(base, head, p) if TEST_LINE.search(x[2])]
        if items:
            found = True
            print(f"  {p}: {len(items)} righe")
            show_lines(items, max_lines)
    if not found:
        print("  nessuna")

    print("\n== Strumenti: righe cambiate con numeri (possibili soglie) ==")
    found = False
    for p in by_cat["strumenti"]:
        items = [x for x in changed_lines(base, head, p) if NUMBER.search(x[2])]
        if items:
            found = True
            print(f"  {p}: {len(items)} righe")
            show_lines(items, max_lines)
    if not found:
        print("  nessuna")

    print("\n== Evidenze aggiunte in git ==")
    ev = by_cat["evidenze"]
    added = {}
    for p in ev:
        if status[p] == "D":
            continue
        a, d = stats.get(p, (0, 0))
        key = "/".join(p.split("/")[:5])
        added[key] = added.get(key, 0) + sizes.get(p, 0)
    total = sum(added.values())
    for k, v in sorted(added.items(), key=lambda kv: -kv[1])[:15]:
        print(f"  {fmt_bytes(v):>10}  {k}")
    print(f"  totale: {fmt_bytes(total)} in {len(ev)} file")
    if total > EVIDENCE_WARN_BYTES:
        print(f"  AVVISO: oltre 3 MB ({fmt_bytes(total)}): il contratto indica al più 3 MB per fase")

    print("\n== run-summary.json aggiunti ==")
    summaries = [p for p in ev if p.endswith("run-summary.json") and status[p] == "A"]
    for p in summaries:
        try:
            data = json.loads(git("show", f"{head}:{p}"))
            results = data.get("results", [])
            ok = [r for r in results if r.get("ok")]
            reds = [f"{r.get('name')}@{r.get('measure')}" for r in results if not r.get("ok")]
            flags = []
            if data.get("quick"):
                flags.append("rapido")
            if not data.get("equivalentToConsolidation", True):
                flags.append("non equivalente al consolidamento")
            if data.get("warnings"):
                flags.append(f"{len(data['warnings'])} avvisi")
            tail = f"  [{', '.join(flags)}]" if flags else ""
            print(f"  {p}: {len(ok)}/{len(results)} verdi, rossi: {', '.join(reds) if reds else 'nessuno'}{tail}")
        except (ValueError, KeyError) as e:
            print(f"  {p}: illeggibile ({e})")
    if not summaries:
        print("  nessuno")

    print("\n== Commit ==")
    log = git("log", "--reverse", "--format=%h %an %ad%n%B%x00", "--date=short", f"{base}..{head}")
    for entry in log.split("\0"):
        entry = entry.strip("\n")
        if entry.strip():
            first, _, rest = entry.partition("\n")
            print(f"  {first}")
            for l in rest.strip("\n").splitlines():
                print(f"    {l}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
