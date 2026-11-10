#!/usr/bin/env python3
"""Controlla i link relativi e le ancore dei documenti Markdown del repository.

Documenti controllati: docs/**/*.md, CONTRIBUTING.md, AGENTS.md, client-web/README.md.
Ignora i link http/https/mailto e i blocchi di codice. Le ancore sono calcolate come le
genera GitHub (minuscole, punteggiatura tolta, spazi in trattini, suffisso -1, -2 per i
titoli doppi). Solo libreria standard.

Uso: python scripts/check-links.py [file.md ...]
Esce con 1 se ci sono link rotti e li elenca (file:riga: motivo -> destinazione).
"""
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
EXTRA = ["CONTRIBUTING.md", "AGENTS.md", "client-web/README.md"]

FENCE = re.compile(r"^\s{0,3}(```+|~~~+)")
HEADING = re.compile(r"^\s{0,3}(#{1,6})\s+(.*?)\s*#*\s*$")
INLINE_LINK = re.compile(r"!?\[(?:[^\[\]]|\[[^\]]*\])*\]\(\s*(<[^>]*>|[^)\s]*)(?:\s+(?:\"[^\"]*\"|'[^']*'))?\s*\)")
REF_DEF = re.compile(r"^\s{0,3}\[[^\]]+\]:\s*(<[^>]*>|\S+)")
CODE_SPAN = re.compile(r"(`+)(.+?)\1")
SKIP_SCHEMES = ("http://", "https://", "mailto:", "tel:", "ftp://", "data:")


def slug_text(raw):
    """Testo di un titolo come lo vede GitHub prima di calcolare l'ancora."""
    t = re.sub(r"!?\[([^\]]*)\]\([^)]*\)", r"\1", raw)  # link -> testo
    t = re.sub(r"<[^>]+>", "", t)  # tag html
    t = t.replace("`", "").replace("*", "")
    return t


def slugify(raw):
    t = slug_text(raw).strip().lower()
    out = []
    for ch in t:
        if ch in (" ", "-"):
            out.append("-" if ch == " " else "-")
        elif ch == "_" or unicodedata.category(ch)[0] in ("L", "N") or unicodedata.category(ch) == "Mn":
            out.append(ch)
    return "".join(out)


def read_lines(path):
    return path.read_text(encoding="utf-8").splitlines()


_anchor_cache = {}


def anchors_of(path):
    if path in _anchor_cache:
        return _anchor_cache[path]
    seen = {}
    result = set()
    in_fence = False
    for line in read_lines(path):
        if FENCE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        m = HEADING.match(line)
        if not m:
            continue
        slug = slugify(m.group(2))
        n = seen.get(slug, 0)
        seen[slug] = n + 1
        result.add(slug if n == 0 else f"{slug}-{n}")
    # ancore esplicite <a name="..."> / id="..."
    text = path.read_text(encoding="utf-8")
    for m in re.finditer(r"<a\s+[^>]*(?:name|id)=[\"']([^\"']+)[\"']", text):
        result.add(m.group(1))
    _anchor_cache[path] = result
    return result


def iter_links(path):
    in_fence = False
    for no, line in enumerate(read_lines(path), 1):
        if FENCE.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        stripped = CODE_SPAN.sub(lambda m: " " * len(m.group(0)), line)
        for m in INLINE_LINK.finditer(stripped):
            yield no, m.group(1)
        m = REF_DEF.match(stripped)
        if m:
            yield no, m.group(1)


def check_file(path):
    problems = []
    for no, target in iter_links(path):
        if target.startswith("<") and target.endswith(">"):
            target = target[1:-1]
        target = target.strip()
        if not target or target.lower().startswith(SKIP_SCHEMES):
            continue
        if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target):
            continue
        file_part, _, anchor = target.partition("#")
        file_part = unquote(file_part)
        anchor = unquote(anchor)
        if file_part == "":
            dest = path
        elif file_part.startswith("/"):
            dest = (ROOT / file_part.lstrip("/")).resolve()
        else:
            dest = (path.parent / file_part).resolve()
        if not dest.exists():
            problems.append((no, "file mancante", target))
            continue
        if anchor and dest.is_file() and dest.suffix.lower() == ".md":
            if re.fullmatch(r"L\d+(C\d+)?(-L\d+(C\d+)?)?", anchor):
                continue
            if anchor.lower() not in anchors_of(dest):
                problems.append((no, "ancora mancante", target))
    return problems


def default_files():
    files = sorted((ROOT / "docs").rglob("*.md"))
    for extra in EXTRA:
        p = ROOT / extra
        if p.exists():
            files.append(p)
    return files


def main(argv):
    files = [Path(a).resolve() for a in argv] if argv else default_files()
    broken = 0
    for f in files:
        for no, reason, target in check_file(f):
            broken += 1
            print(f"{f.relative_to(ROOT).as_posix()}:{no}: {reason} -> {target}")
    print(f"{len(files)} file controllati, {broken} link rotti")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
