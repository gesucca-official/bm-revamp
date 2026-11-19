"""Riassume le 28 coppie del «Rif» con i criteri SB-20."""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path


def leggi(file):
    return json.loads(file.read_text(encoding="utf-8-sig"))


def salva(file, dato):
    file.write_text(json.dumps(dato, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8", newline="\n")


def gruppo(a, b):
    casuali = a.endswith("/com") + b.endswith("/com")
    return ("heur", "mixed", "com")[casuali]


def aggrega(matrice):
    gruppi = defaultdict(Counter)
    for cella in matrice["celle"]:
        chiave = cella["A"], cella["B"], gruppo(cella["stileA"], cella["stileB"])
        for campo in ("partite", "vittorieA", "vittorieB", "patte", "turniTotali"):
            gruppi[chiave][campo] += cella[campo]
    return gruppi


def quota(c):
    return 100 * c["vittorieA"] / (c["vittorieA"] + c["vittorieB"])


def starter(cartella, uscita):
    matrice = leggi(cartella / "matrix.json")
    obs = leggi(cartella / "deck-observations.json")
    gruppi = aggrega(matrice)
    coppie = []
    for (a, b, g), c in gruppi.items():
        esauriti = sum(obs.get(k, {}).get("exhausted", 0) for k in {f"{a}|{b}|{g}", f"{b}|{a}|{g}"})
        posti = sum(obs.get(k, {}).get("games", 0) for k in {f"{a}|{b}|{g}", f"{b}|{a}|{g}"})
        assert posti == 2 * c["partite"], (a, b, g, posti)
        riga = dict(a=a, b=b, gruppo=g, quota=quota(c), percentualePatte=100*c["patte"]/c["partite"],
                    turni=c["turniTotali"]/c["partite"], esauriti=esauriti, posti=posti, **c)
        soglia = 45 if {a, b} == {"starter-spazienzio", "starter-mara"} else 40
        fuori = []
        if g == "heur":
            if a != b and not soglia <= riga["quota"] <= 100 - soglia:
                fuori.append("quota")
            if riga["percentualePatte"] > 10:
                fuori.append("patte")
            if not 6 <= riga["turni"] <= 12:
                fuori.append("durata")
        if g == "com" and a != b and not 35 <= riga["quota"] <= 65:
            fuori.append("controllo")
        riga["fuori"] = fuori
        coppie.append(riga)
    salva(uscita, {"invarianti": matrice["invarianti"], "coppie": coppie})


if __name__ == "__main__":
    starter(Path(sys.argv[1]), Path(sys.argv[2]))
