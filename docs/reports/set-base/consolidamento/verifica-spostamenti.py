#!/usr/bin/env python3
"""Verifica di sola lettura del consolidamento D96 (docs/set-base-plan.md).

Confronta il piano prima del consolidamento (commit di partenza, di norma 8f2608a) con il piano
attuale, lo storico (docs/history/set-base-plan-storico.md) e il registro delle decisioni
(docs/set-base-decisioni.md). Per ogni riga non vuota tolta dal piano controlla che compaia
identica nello storico o nel registro. Unici adattamenti ammessi: i target dei link (percorsi
relativi alla nuova cartella e ancore che puntano al piano o al registro) e, nel registro, la
colonna «Stato» aggiunta in fondo alle righe della tabella. Le parole non cambiano.

Uso: python docs/reports/set-base/consolidamento/verifica-spostamenti.py [--before REV] [--lista]
Esce con 1 se una riga tolta dal piano non si ritrova. Non scrive nulla.
"""
import argparse
import difflib
import importlib.util
import posixpath
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PLAN = "docs/set-base-plan.md"
STORICO = "docs/history/set-base-plan-storico.md"
REGISTRO = "docs/set-base-decisioni.md"
LOCAL_DOCS = (PLAN, STORICO, REGISTRO)

spec = importlib.util.spec_from_file_location("check_links", ROOT / "scripts" / "check-links.py")
check_links = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_links)
LINK = check_links.INLINE_LINK
HEAD = re.compile(r"^(#{1,6})\s+(.*?)\s*#*\s*$")


def git_show(rev, path):
    out = subprocess.run(["git", "show", f"{rev}:{path}"], cwd=ROOT, capture_output=True, check=True)
    return out.stdout.decode("utf-8")


def read(path):
    return (ROOT / path).read_text(encoding="utf-8")


def norm(line, file_path):
    """Riga con i target dei link ridotti alla loro destinazione (file + ancora)."""
    base = posixpath.dirname(file_path)
    out, last = [], 0
    for m in LINK.finditer(line):
        target = m.group(1)
        s, e = m.span(1)
        if target.startswith("<") and target.endswith(">"):
            target = target[1:-1]
        if re.match(r"^[a-zA-Z][a-zA-Z0-9+.-]*:", target):
            res = target
        else:
            path, _, anchor = target.partition("#")
            if path == "":
                res = "#" + anchor
            else:
                full = posixpath.normpath(posixpath.join(base, path))
                res = full + ("#" + anchor if anchor else "")
                if full in LOCAL_DOCS and anchor:
                    res = "#" + anchor
        out.append(line[last:s])
        out.append("<" + res + ">")
        last = e
    out.append(line[last:])
    return "".join(out)


def nonblank(lines):
    return [l for l in lines if l.strip()]


STATO = re.compile(r"\s\|\s[^|]*\|\s*$")


def senza_stato(l):
    """Riga del registro senza la colonna «Stato» aggiunta in fondo."""
    if l.strip() == "|---|---|---|---|":
        return "|---|---|---|"
    return STATO.sub(" |", l)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--before", default="8f2608a", help="commit del piano prima del consolidamento")
    ap.add_argument("--lista", action="store_true", help="elenca anche ogni riga tolta (numero di riga prima)")
    args = ap.parse_args()

    old = git_show(args.before, PLAN).splitlines()
    new = read(PLAN).splitlines()
    storico = read(STORICO).splitlines()
    registro = read(REGISTRO).splitlines()

    old_c = Counter(norm(l, PLAN) for l in nonblank(old))
    new_c = Counter(norm(l, PLAN) for l in nonblank(new))
    removed = old_c - new_c
    added = new_c - old_c

    dest = Counter()
    where = {}
    for l in nonblank(storico):
        n = norm(l, STORICO)
        dest[n] += 1
        where.setdefault(n, "storico")
    for l in nonblank(registro):
        n = norm(senza_stato(l) if l.lstrip().startswith("|") else l, REGISTRO)
        dest[n] += 1
        where.setdefault(n, "registro")

    tot_removed = sum(removed.values())
    found_st = found_reg = 0
    missing = []
    for n, c in removed.items():
        have = dest.get(n, 0)
        if have >= c:
            if where[n] == "storico":
                found_st += c
            else:
                found_reg += c
        else:
            missing.append((n, c, have))

    print(f"Piano prima ({args.before}): {len(old)} righe ({sum(1 for l in old if l.strip())} non vuote), {len(chr(10).join(old))} caratteri")
    print(f"Piano dopo: {len(new)} righe ({sum(1 for l in new if l.strip())} non vuote), {len(chr(10).join(new))} caratteri")
    print(f"Storico: {len(storico)} righe, {len(chr(10).join(storico))} caratteri")
    print(f"Registro: {len(registro)} righe, {len(chr(10).join(registro))} caratteri")
    print(f"Righe non vuote tolte dal piano: {tot_removed}")
    print(f"  ritrovate identiche nello storico: {found_st}")
    print(f"  ritrovate identiche nel registro: {found_reg}")
    print(f"  non ritrovate: {sum(c for _, c, _ in missing)}")
    print(f"Righe non vuote nuove nel piano (riassunti, indici, rimandi): {sum(added.values())}")

    # righe sostituite da un riassunto: blocchi 'replace' fra piano prima e dopo
    sm = difflib.SequenceMatcher(a=old, b=new, autojunk=False)
    print("\nRighe tolte e sostituite da testo nuovo nel piano (riassunti), con la destinazione")
    print("| Righe prima | Non vuote | Righe dopo | Destinazione |")
    print("|---|---:|---|---|")
    st_norm = [norm(l, STORICO) for l in storico]
    reg_norm = [norm(senza_stato(l) if l.lstrip().startswith("|") else l, REGISTRO) for l in registro]
    heads = []
    for i, l in enumerate(storico):
        m = HEAD.match(l)
        if m:
            heads.append((i, m.group(2)))
    n_rep = n_del = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag not in ("replace", "delete"):
            continue
        chunk = [l for l in old[i1:i2] if l.strip()]
        if not chunk:
            continue
        first = norm(chunk[0], PLAN)
        if first in st_norm:
            pos = st_norm.index(first)
            h = [t for p, t in heads if p <= pos]
            d = "storico, «" + (h[-1] if h else "?") + "»"
        elif first in reg_norm:
            d = "registro, righe D1–D96"
        else:
            d = "ritrovata solo in parte (vedi sopra)" if False else "storico/registro"
        newr = f"{j1 + 1}–{j2}" if tag == "replace" and j2 > j1 else "—"
        if tag == "replace":
            n_rep += len(chunk)
        else:
            n_del += len(chunk)
        print(f"| {i1 + 1}–{i2} | {len(chunk)} | {newr} | {d} |")
    print(f"\nRighe non vuote sostituite da un riassunto: {n_rep}; spostate senza sostituto: {n_del}")

    if args.lista:
        print("\nRighe tolte (prima del consolidamento):")
        pool = Counter(removed)
        for no, l in enumerate(old, 1):
            if not l.strip():
                continue
            n = norm(l, PLAN)
            if pool.get(n, 0) > 0:
                pool[n] -= 1
                print(f"{no}: {l[:100]}")

    if missing:
        print("\nRIGHE NON RITROVATE:")
        for n, c, have in missing:
            print(f"  (servono {c}, trovate {have}) {n[:140]}")
        return 1
    print("\nEsito: ogni riga tolta dal piano compare identica nello storico o nel registro.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
