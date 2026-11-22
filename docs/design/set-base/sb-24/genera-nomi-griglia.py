#!/usr/bin/env python3
"""SB-24 Fase B (D166): la sezione «Nomi, flavour e illustrazioni» della griglia, generata dalla bozza congelata.

Nome, flavour e rarità vengono da server/src/test/resources/set-base/bozza.json; l'illustrazione, che la bozza non porta (è un
appunto per SB-32), dalla revisione del proprietario (sb-24/revisione-proprietario.json) o, dove lui non l'ha cambiata, dalla
proposta (sb-24/proposta.json). Il token non è nella bozza: il suo nome viene dalla revisione. Se i nomi della revisione e della
bozza non coincidono si ferma.

Uso (dalla radice del repository):
    python -X utf8 docs/design/set-base/sb-24/genera-nomi-griglia.py             # stampa la sezione
    python -X utf8 docs/design/set-base/sb-24/genera-nomi-griglia.py --verifica  # esce con 1 se la griglia è indietro
    python -X utf8 docs/design/set-base/sb-24/genera-nomi-griglia.py --scrivi    # riscrive solo la sezione fra i marcatori
I marcatori sono «<!-- inizio nomi generati -->» e «<!-- fine nomi generati -->» di griglia.md.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
QUI = Path(__file__).resolve().parent
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
GRIGLIA = QUI.parent / "griglia.md"
START, END = "<!-- inizio nomi generati -->", "<!-- fine nomi generati -->"
PG = {
    "bruiser.character.BigBadBruiser": "PG-SPA", "base.character.Mara": "PG-MAR",
    "junkie.character.ToxicJunkie": "PG-TOS", "base.character.Pino": "PG-PIN",
    "base.character.Gigi": "PG-GIG", "base.character.Cesira": "PG-CES", "base.character.Rocco": "PG-ROC",
}
RARITA = {"COMMON": "C", "UNCOMMON": "NC", "RARE": "R", "PROTAGONIST": "P"}


def cella(testo):
    return testo.replace("|", "\\|").replace("\n", " ")


def voci():
    bozza = json.loads(BOZZA.read_text(encoding="utf-8"))
    proposta = {v["slot"]: v for v in json.loads((QUI / "proposta.json").read_text(encoding="utf-8"))["voci"]}
    revisione = json.loads((QUI / "revisione-proprietario.json").read_text(encoding="utf-8"))["voci"]
    righe = {}
    for p in bozza["characters"]:
        righe[PG[p["id"]]] = (p["name"], RARITA[p["rarity"]], p.get("flavour", ""))
    for c in bozza["cards"]:
        slot = c["gui"]["description"].split(" · ")[0]
        righe[slot] = (c["gui"]["name"], RARITA[c["rarity"]], c["gui"].get("flavour", ""))
    token = revisione.get("TOKEN", {})
    righe["TOKEN"] = (token.get("nome", proposta["TOKEN"]["nome"]), "—", token.get("flavour", proposta["TOKEN"]["flavour"]))
    if set(righe) != set(proposta):
        raise SystemExit("bozza e proposta non hanno gli stessi slot")
    out = []
    for slot in proposta:  # l'ordine della proposta e della pagina di revisione
        nome, rarita, flavour = righe[slot]
        r = revisione.get(slot, {})
        atteso = r.get("nome", proposta[slot]["nome"])
        if nome != atteso:
            raise SystemExit(f"{slot}: la bozza dice «{nome}», la revisione «{atteso}»")
        illustrazione = r.get("illustrazione", proposta[slot]["illustrazione"])
        out.append((slot, nome, rarita, flavour, illustrazione))
    return bozza, out


def sezione():
    bozza, righe = voci()
    conti = {}
    for _, _, rarita, _, _ in righe:
        conti[rarita] = conti.get(rarita, 0) + 1
    testa = [
        f"Generata da `sb-24/genera-nomi-griglia.py` da `bozza.json` versione «{bozza['set']['version']}» e dalla revisione del "
        f"proprietario ([D166](../../set-base-decisioni.md#decisioni-del-proprietario)). {len(righe)} voci: 7 personaggi, "
        f"{len(bozza['cards'])} carte e il token; rarità C {conti.get('C', 0)} · NC {conti.get('NC', 0)} · R {conti.get('R', 0)} · "
        f"P {conti.get('P', 0)}. L'illustrazione è un appunto per SB-32, non un prompt.",
        "",
        "| Slot | Nome | Rarità | Flavour | Illustrazione |",
        "|---|---|---|---|---|",
    ]
    corpo = [f"| {s} | {cella(n)} | {r} | {cella(f)} | {cella(i)} |" for s, n, r, f, i in righe]
    return "\n".join(testa + corpo)


def main():
    testo = GRIGLIA.read_text(encoding="utf-8")
    if START not in testo or END not in testo:
        raise SystemExit("marcatori assenti in griglia.md")
    prima, resto = testo.split(START, 1)
    _, dopo = resto.split(END, 1)
    nuovo = prima + START + "\n\n" + sezione() + "\n\n" + END + dopo
    if "--scrivi" in sys.argv:
        if nuovo != testo:
            GRIGLIA.write_bytes(nuovo.encode("utf-8"))
        print("sezione dei nomi riscritta in griglia.md")
    elif "--verifica" in sys.argv:
        if nuovo != testo:
            print("griglia.md non è allineata: rigenerare con --scrivi")
            return 1
        print("griglia.md allineata a bozza.json e alla revisione")
    else:
        print(sezione())
    return 0


if __name__ == "__main__":
    sys.exit(main())
