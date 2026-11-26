"""SB-26: check-rules.py must fail on a deliberate mismatch of the generated catalog.

Copies the files the checks read into a temporary folder, changes one thing per run and calls
`python scripts/check-rules.py --root <copy>`: the untouched copy must pass, every changed copy must fail with the expected
message. Nothing in the repository is written. SB-28: the catalog under test is the live one (set_catalog.py --vivo), which took
the place of the SB-26 candidate.

    python -X utf8 tools/set-catalog/prova-errori.py
"""
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
DOCS = ("docs/sets/base.md", "client-debug/src/assets/docs/sets/base.md")
ANNEX = "docs/rules-catalog.json"
COPY = [
    "docs/game-rules.md", "docs/sets", ANNEX, "docs/design/set-base/testi",
    "client-debug/src/assets/docs", "server/src/main/java", "server/src/main/resources/cards.sqlite",
    "server/src/main/resources/sets", "server/src/test/resources/set-base/bozza.json",
    "server/src/test/resources/set-base/mazzi-prova.json", "scripts/check-rules.py", "tools/set-catalog/set_catalog.py",
    "tools/set-catalog/nomi-classi.json", "server/src/test/java/com/gsc/bm/model/cards/base/SetBaseIds.java",
]


def edit_doc(copy, change):
    """The same change in the set document and in its client copy, so that only the field under test differs."""
    for name in DOCS:
        path = copy / name
        path.write_text(change(path.read_text(encoding="utf-8")), encoding="utf-8", newline="\n")


def changed_cost(copy):
    edit_doc(copy, lambda t: t.replace("· Costo 10 V · Priorità 1", "· Costo 11 V · Priorità 1", 1))


def changed_full_text(copy):
    edit_doc(copy, lambda t: t.replace("Quando la carta si risolve: infliggi", "Quando la carta si risolve: infliggi subito", 1))


def changed_short_text(copy):
    path = copy / ANNEX
    data = json.loads(path.read_text(encoding="utf-8"))
    data["cards"][0]["description"] = data["cards"][0]["description"].replace("[[HIT]]", "[[CUT]]", 1) + " Di più."
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")


def changed_bot_style(copy):
    edit_doc(copy, lambda t: t.replace("Stile del computer: prudente.", "Stile del computer: aggressivo.", 1))


def changed_set_file(copy):
    path = copy / "server/src/test/resources/set-base/bozza.json"
    text = path.read_text(encoding="utf-8")
    path.write_text(re.sub(r'"priority": 0,', '"priority": 1,', text, count=1), encoding="utf-8", newline="\n")


def changed_id_constant(copy):
    path = copy / "server/src/test/java/com/gsc/bm/model/cards/base/SetBaseIds.java"
    text = path.read_text(encoding="utf-8")
    path.write_text(text.replace('"bruiser.Glare"', '"bruiser.Stare"', 1), encoding="utf-8", newline="\n")


CASES = [
    ("copia intatta", None, None),
    ("numero cambiato nella scheda (costo)", changed_cost, "cost of the sheet differs from the set file"),
    ("testo completo cambiato nella scheda", changed_full_text, "sheet differs from the full text of the annex"),
    ("testo breve cambiato nell'allegato", changed_short_text, "short text differs from the SB-25 generator"),
    ("stile del computer cambiato nella scheda", changed_bot_style, "computer style of the sheet differs from the set file"),
    ("numero cambiato nel file del set dopo la generazione", changed_set_file, "changed after the generation"),
    ("costante degli id cambiata a mano", changed_id_constant, "SetBaseIds.java: not what the generator writes"),
]


def main():
    failures = 0
    for label, change, expected in CASES:
        with tempfile.TemporaryDirectory() as tmp:
            copy = Path(tmp)
            for rel in COPY:
                source, target = ROOT / rel, copy / rel
                if source.is_dir():
                    shutil.copytree(source, target, ignore=shutil.ignore_patterns("__pycache__"))
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(source, target)
            if change:
                change(copy)
            run = subprocess.run([sys.executable, "-X", "utf8", str(copy / "scripts/check-rules.py"), "--root", str(copy)],
                                 capture_output=True, text=True, encoding="utf-8")
            last = (run.stderr.strip().splitlines() or [""])[-1]
            ok = run.returncode == 0 if expected is None else (run.returncode != 0 and expected in last)
            failures += not ok
            print(f"{'OK ' if ok else 'NO '} {label}: uscita {run.returncode}" + (f" — {last}" if expected else ""))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
