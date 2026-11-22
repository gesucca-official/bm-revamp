"""SB-24 Fase B (D166): scrive nella bozza nomi, flavour, rarità P dei personaggi e versione 1.7, conservando la formattazione.

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-24/applica.py [--scrivi]
Senza --scrivi controlla soltanto che la bozza sia già quella attesa (esce con 1 se no). Dopo la scrittura vanno rigenerati i testi
stampati (genera-testi.py --scrivi), che portano i nomi nuovi negli «Annuncia» e il nome del token in OGG-03.
Tocca solo: `name` e `rarity` dei personaggi più un campo `flavour`; `gui.name` più `gui.flavour` delle carte; `set.version`.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import nomi  # noqa: E402

BOZZA = nomi.ROOT / "server/src/test/resources/set-base/bozza.json"
VERSIONE = "1.7"


def stringa(valore):
    return json.dumps(valore, ensure_ascii=False)


def applica(testo, finali):
    bozza = json.loads(testo)
    vecchia = '"set": {"id": "base", "name": "Set Base", "version": "bozza"}'
    if testo.count(vecchia) == 1:
        testo = testo.replace(vecchia, vecchia.replace('"bozza"', stringa(VERSIONE)))
    for p in bozza["characters"]:
        v = finali[nomi.PG[p["id"]]]
        prima = '{"id": %s, "rarity": %s, "name": %s,' % (stringa(p["id"]), stringa(p["rarity"]), stringa(p["name"]))
        if p.get("flavour") is not None:
            continue
        assert testo.count(prima) == 1, prima
        dopo = '{"id": %s, "rarity": %s, "name": %s, "flavour": %s,' % (
            stringa(p["id"]), stringa(nomi.RARITA[v["rarita"]]), stringa(v["nome"]), stringa(v["flavour"]))
        testo = testo.replace(prima, dopo)
    for c in bozza["cards"]:
        gui = c["gui"]
        if "flavour" in gui:
            continue
        slot = gui["description"].split(" · ")[0]
        v = finali[slot]
        if nomi.RARITA[v["rarita"]] != c["rarity"]:
            raise SystemExit(f"{slot}: la rarità della carta cambierebbe, fuori da D166")
        inizio = re.compile(r'"binding"\s*:\s*' + re.escape(stringa(c["binding"]))).search(testo).end()
        nome = re.compile(r'("gui"\s*:\s*\{(\s*)"name"\s*:\s*)' + re.escape(stringa(gui["name"])) + r',').search(testo, inizio)
        assert nome, c["binding"]
        separatore = nome[2] if "\n" in nome[2] else " "
        dopo = nome[1] + stringa(v["nome"]) + "," + separatore + '"flavour": ' + stringa(v["flavour"]) + ","
        testo = testo[:nome.start()] + dopo + testo[nome.end():]
    return testo


def atteso(bozza, finali):
    errori = []
    if bozza["set"]["version"] != VERSIONE:
        errori.append("set.version")
    for p in bozza["characters"]:
        v = finali[nomi.PG[p["id"]]]
        if (p["name"], p.get("flavour"), p["rarity"]) != (v["nome"], v["flavour"], nomi.RARITA[v["rarita"]]):
            errori.append(p["id"])
    for c in bozza["cards"]:
        v = finali[c["gui"]["description"].split(" · ")[0]]
        if (c["gui"]["name"], c["gui"].get("flavour"), c["rarity"]) != (v["nome"], v["flavour"], nomi.RARITA[v["rarita"]]):
            errori.append(c["binding"])
    return errori


def main():
    finali = nomi.finali()
    testo = BOZZA.read_bytes().decode("utf-8")
    if "--scrivi" in sys.argv:
        nuovo = applica(testo, finali)
        json.loads(nuovo)
        BOZZA.write_bytes(nuovo.encode("utf-8"))
        testo = nuovo
    errori = atteso(json.loads(testo), finali)
    if errori:
        print("non come D166: " + ", ".join(errori))
        return 1
    print(f"bozza {VERSIONE}: nomi, flavour e rarità come D166 su {len(finali) - 1} voci")
    return 0


if __name__ == "__main__":
    sys.exit(main())
