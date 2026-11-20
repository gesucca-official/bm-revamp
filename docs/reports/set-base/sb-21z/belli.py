"""SB-21z (D161 (3)): numeri belli davvero. Uso: python -B -X utf8 belli.py <bozza.json>
Ogni quantita' da 10 in su e' multiplo di 5; sotto 10 solo 0, 2, 4, 5, 6, 8; fattori solo 0,25 0,5 0,75 1,25 1,5 2.
Esclusi priorita', la soglia «vivo» di Mi rialzo (healthAtLeast 1, non stampata), turni, copie, divisori e percentuali; i campi per* seguono la regola; solo perAlcohol 1 (non stampato) e' ammesso."""
import json
import sys
from pathlib import Path

FATTORI = {0.25, 0.5, 0.75, 1.25, 1.5, 2}
PICCOLI = {0, 2, 4, 5, 6, 8}
ESCLUSI = {"gui", "healthAtLeast", "priority", "turns", "capacity", "divide", "percent", "items", "copies", "cards", "decks"}


def numeri(x, percorso=()):
    if isinstance(x, dict):
        for k, v in x.items():
            if k not in ESCLUSI:
                yield from numeri(v, (*percorso, k))
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from numeri(v, (*percorso, str(i)))
    elif type(x) in (int, float):
        yield ".".join(percorso), x


def bello(campo, n):
    ultimo = campo.split(".")[-1]
    if ultimo == "factor":
        return n in FATTORI
    if ultimo == "perAlcohol" and n == 1:
        return True  # «10 piu' la L spesa»: l'1 non si stampa (D156)
    if type(n) is float:
        return False
    n = abs(n)
    return n in PICCOLI if n < 10 else n % 5 == 0


def brutti(dati):
    for scheda in dati["characters"] + dati["cards"]:
        chi = scheda.get("binding", scheda.get("id"))
        nome = scheda.get("gui", {}).get("name", scheda.get("name", ""))
        slot = scheda.get("gui", {}).get("description", "").split(" ")[0]
        for campo, n in numeri(scheda):
            if not bello(campo, n):
                yield chi, slot, nome, campo, n


if __name__ == "__main__":
    dati = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8-sig"))
    righe = list(brutti(dati))
    for r in righe:
        print(*r, sep=" | ")
    print("brutti:", len(righe))
    sys.exit(1 if righe else 0)
