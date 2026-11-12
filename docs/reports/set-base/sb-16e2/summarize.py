"""SB-16e2: tables and criteria from the measured JSON only (derived from sb-16e/summarize.py).

Writes incontri.md and criteria.json; compacts each matrix.json (drops per-cell detail, kept in TEMP).
"""
import collections
import json
import os
import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parent
NAMES = dict(zip(("spazienzio", "mara", "tossico", "pino", "gigi"),
                 ("Spazienzio", "Mara", "Celestina", "Piera", "Beppe")))
ORDER = ("control", "a", "b", "c")
LABELS = {"control": "Controllo (giro 3 di SB-16e)", "a": "(a) Un altro e arrivo +35 A",
          "b": "(b) danno a sé delle last resort 2", "c": "(c) entrambe"}
BASE = {"starter-spazienzio", "starter-mara"}


def name(deck):
    return NAMES[deck.removeprefix("starter-")]


def load(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def stats(p):
    return p["quotaA"], p["patte"] / p["partite"] * 100, p["turniTotali"] / p["partite"]


def violations(matrix):
    out = []
    for p in matrix["coppie"]:
        q, d, t = stats(p)
        label = f'{name(p["A"])}–{name(p["B"])}'
        if p["A"] != p["B"]:
            lo, hi = (.45, .55) if {p["A"], p["B"]} == BASE else (.40, .60)
            if not lo <= q <= hi:
                out.append({"criterio": "quota", "incontro": label, "valore": q, "soglia": [lo, hi]})
        if d > 10:
            out.append({"criterio": "patte", "incontro": label, "valore": round(d, 2), "soglia": 10})
        if not 6 <= t <= 12:
            out.append({"criterio": "durata", "incontro": label, "valore": round(t, 2), "soglia": [6, 12]})
    for k, v in matrix["invarianti"]["violazioni"].items():
        if v:
            out.append({"criterio": "invariante", "incontro": k, "valore": v, "soglia": 0})
    for b in matrix["tettoBound"]:
        if b["viola"]:
            out.append({"criterio": "tetto-bound", "incontro": b["bound"], "valore": b["massimo"], "soglia": 4})
    return out


def mirrors(folder):
    rows = load(folder / "mirrors.json")
    result = {}
    for deck in ("starter-tossico", "starter-pino"):
        c = collections.Counter()
        for row in rows:
            if row["a"] == deck:
                c.update(row["aCounts"]); c.update(row["bCounts"])
        self_lethal = sum(v for k, v in c.items() if k.startswith("drawLethal-") and "self" in k)
        result[deck] = {"partite": c["games"], "patte": c["drawGames"], "turni": c["turns"],
                        "patteConDannoASeLetale": self_lethal,
                        "cause": {k.removeprefix("drawLethal-"): v for k, v in sorted(c.items()) if k.startswith("drawLethal-")},
                        "patteEntrambeA0": c["drawBothAZero"]}
    return result


def render():
    text = ["# SB-16e2 — incontri per controllo e varianti\n\n",
            "Generato da [summarize.py](summarize.py). Ogni riga: 32.000 partite, 16 coppie di stili, 2.000 semi per cella da 7.000.000, regole `d50`. "
            "Quota A sulle decisive; patte su tutte le partite; turni medi di partita. In grassetto i valori fuori criterio.\n"]
    criteria = {}
    for v in ORDER:
        folder = ROOT / v
        if not (folder / "matrix.json").exists():
            continue
        matrix = load(folder / "matrix.json")
        bad = violations(matrix)
        badset = {(x["incontro"], x["criterio"]) for x in bad}
        text += [f"\n## {LABELS[v]}\n\n", "| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |\n|---|---:|---:|---:|---:|---:|---:|\n"]
        for p in matrix["coppie"]:
            q, d, t = stats(p)
            label = f'{name(p["A"])}–{name(p["B"])}'
            fq = f"**{q:.3f}**" if (label, "quota") in badset else f"{q:.3f}"
            fd = f"**{d:.2f}**" if (label, "patte") in badset else f"{d:.2f}"
            ft = f"**{t:.2f}**" if (label, "durata") in badset else f"{t:.2f}"
            text += [f'| {label} | {p["vittorieA"]} | {p["vittorieB"]} | {p["patte"]} | {fq} | {fd} | {ft} |\n']
        inv = matrix["invarianti"]
        bounds = matrix["tettoBound"]
        text += [f'\nInvarianti: {sum(inv["violazioni"].values())} violazioni su {inv["partite"]} partite. '
                 f'Bound: {sum(b["viola"] for b in bounds)} in violazione su {len(bounds)}, massimo {max(b["massimo"] for b in bounds)} (tetto 4).\n']
        m = mirrors(folder) if (folder / "mirrors.json").exists() else {}
        if m:
            text += ["\nOsservatore di SB-16e, primi 400 semi per cella (6.400 partite per specchio):\n\n",
                     "| Specchio | Patte | Patte % | Turni medi | Patte con danno a sé letale | Ultimi danni letali |\n|---|---:|---:|---:|---:|---|\n"]
            for deck, s in m.items():
                causes = "; ".join(f"{k}: {n}" for k, n in s["cause"].items())
                text += [f'| {name(deck)} | {s["patte"]} | {s["patte"] / s["partite"] * 100:.2f} | {s["turni"] / s["partite"]:.2f} | {s["patteConDannoASeLetale"]} | {causes} |\n']
        seconds = (folder / "seconds.txt").read_text().strip() if (folder / "seconds.txt").exists() else None
        criteria[v] = {"violazioni": len(bad), "patteViolate": sum(x["criterio"] == "patte" for x in bad),
                       "pattePercentualeMassima": round(max(stats(p)[1] for p in matrix["coppie"]), 2),
                       "patteGlobali": round(sum(p["patte"] for p in matrix["coppie"]) / sum(p["partite"] for p in matrix["coppie"]) * 100, 3),
                       "turniMedi": round(sum(p["turniTotali"] for p in matrix["coppie"]) / sum(p["partite"] for p in matrix["coppie"]), 3),
                       "dettaglio": bad, "specchiOsservati": m, "secondi": seconds, "sha256": matrix["intestazione"]["sha256"]}
        # Per-cell detail stays in TEMP; the compact matrix keeps header, invariants, matchups and bound cap.
        if "celle" in matrix:
            scratch = pathlib.Path(os.environ["TEMP"]) / "bm-sb16e2" / v
            scratch.mkdir(parents=True, exist_ok=True)
            shutil.copy2(folder / "matrix.json", scratch / "matrix.json")
            compact = {k: matrix[k] for k in ("intestazione", "invarianti", "coppie", "tettoBound")}
            (folder / "matrix.json").write_text(json.dumps(compact, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    ranking = sorted(criteria, key=lambda k: (criteria[k]["violazioni"], criteria[k]["patteViolate"], criteria[k]["pattePercentualeMassima"]))
    text += ["\n## Criteri\n\n", "| Profilo | Violazioni | di cui patte | Patte max % | Patte globali % | Turni medi |\n|---|---:|---:|---:|---:|---:|\n"]
    for v in ranking:
        c = criteria[v]
        text += [f'| {LABELS[v]} | {c["violazioni"]} | {c["patteViolate"]} | {c["pattePercentualeMassima"]} | {c["patteGlobali"]} | {c["turniMedi"]} |\n']
    text += [f"\nRegola di adozione fissata prima in [selection.json](selection.json): prima nell’ordine, **{LABELS[ranking[0]]}**.\n"]
    (ROOT / "incontri.md").write_text("".join(text), encoding="utf-8")
    (ROOT / "criteria.json").write_text(json.dumps({"ordine": ranking, "profili": criteria}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    render()
