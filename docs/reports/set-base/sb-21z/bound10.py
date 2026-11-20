"""SB-21z: criterio D159 (2) sulle bound di una bozza: una bound vera piu' una nulla contro due nulle, specchio del personaggio,
100 semi per cella, 12 stili euristici. Le sonde sono quelle di SB-21h (sb21h.sonde), costruite sulla bozza data.

Uso dalla radice: python -B -X utf8 docs/reports/set-base/sb-21z/bound10.py <bozza> <etichetta> [personaggi...] [--seme N]
"""
import argparse
from collections import Counter
import json
from pathlib import Path
import sys

QUI = Path(__file__).resolve().parent
sys.path.insert(0, str(QUI))
sys.path.insert(0, str(QUI.parent / "sb-21h/fase-b"))
import sb21z as z  # noqa: E402
import sb21h  # noqa: E402

RIGHE = ("a", "b", "c", "null")


def quote(cartella, chi):
    g = {r: Counter() for r in RIGHE}
    m = z.leggi(Path(cartella) / "matrix.json")
    assert not any(m["invarianti"]["violazioni"].values())
    for x in m["celle"]:
        if z.gruppo(x["stileA"], x["stileB"]) != "heur":
            continue
        a, b, va, vb = x["A"], x["B"], x["vittorieA"], x["vittorieB"]
        if a == f"h-{chi}-null" and b != a:
            a, b, va, vb = b, a, vb, va
        assert b == f"h-{chi}-null", (a, b)
        k = g[a.rsplit("-", 1)[1]]
        k["va"] += va
        k["vb"] += vb
        k["n"] += x["partite"]
    q = {r: 100 * k["va"] / (k["va"] + k["vb"]) for r, k in g.items()}
    return {r: dict(quota=q[r], delta=q[r] - q["null"]) for r in RIGHE}


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("bozza")
    cli.add_argument("etichetta")
    cli.add_argument("chi", nargs="*", default=list(sb21h.NOMI))
    cli.add_argument("--seme", type=int, default=7000000)
    a = cli.parse_args()
    sb21h.AREA = z.AREA
    sb21h.candidata = lambda nome, modifiche: Path(a.bozza)
    sonde = sb21h.sonde(a.etichetta, [])
    esiti = {}
    uscita = z.AREA / f"bound10-{a.etichetta}-{a.seme}.json"
    if uscita.exists():
        esiti = z.leggi(uscita)
    for chi in a.chi:
        if chi in esiti:
            continue
        righe = tuple(f"h-{chi}-{r}" for r in RIGHE)
        cart = z.misura(f"b10-{a.etichetta}-{chi}-{a.seme}", sonde, 100, righe=righe, avversari=(f"h-{chi}-null",), seme=a.seme)
        esiti[chi] = quote(cart, chi)
        z.salva(uscita, esiti)
        print(chi, {r: round(v["delta"], 1) for r, v in esiti[chi].items() if r != "null"}, flush=True)


if __name__ == "__main__":
    main()
