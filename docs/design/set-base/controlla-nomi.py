"""SB-24 Fase B (D166): controllo di sola lettura che la bozza non abbia nomi provvisori.

Uso, dalla radice del repository:
  python -X utf8 docs/design/set-base/controlla-nomi.py [BOZZA]   (predefinita: server/src/test/resources/set-base/bozza.json)

Esce con 1 e stampa ogni violazione se ce n'è almeno una, altrimenti con 0. Le voci sono i personaggi (`name`), le carte (`gui.name`)
e il token che una descrizione nomina fra «» dopo «crea il token». Una voce è provvisoria se:
N1 Inglese di catalogo  il nome è il nome di classe di una carta, di un personaggio o di un token dell'allegato del set vivo
                        (docs/rules-catalog.json: Grab, Steal, BrokenBeerBottle, Struggle…), oppure è una parola sola in CamelCase
                        (`SuperImpact`); una descrizione che cita uno di quei nomi di classe come parola intera conta come N1.
N2 Segnaposto           il nome o il flavour contengono «da inventare», «nome di lavoro», «provvisorio» o «provvisoria», «TODO» (parola intera),
                        «???» oppure
                        il nome comincia con «Last Resort» (la parola chiave stampata, non un nome).
N3 Nome ripetuto        lo stesso nome (senza distinguere maiuscole e spazi) su due voci.
N4 Flavour mancante     una carta o un personaggio senza flavour (D166: la bozza congelata ne ha uno per voce).
Solo libreria standard.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2].parent
DEFAULT = ROOT / "server/src/test/resources/set-base/bozza.json"
ALLEGATO = ROOT / "docs/rules-catalog.json"
SEGNAPOSTI = (re.compile(r"da inventare", re.I), re.compile(r"nome di lavoro", re.I), re.compile(r"provvisori[oa]", re.I),
              re.compile(r"\bTODO\b"), re.compile(r"\?\?\?"))
CAMEL = re.compile(r"^[A-Z][a-z]+(?:[A-Z][a-z0-9]*)+$")
TOKEN = re.compile(r"crea il token «([^»]+)»")


def classi_del_catalogo():
    allegato = json.loads(ALLEGATO.read_text(encoding="utf-8"))
    return {voce["class"].split(".")[-1] for chiave in ("cards", "characters", "tokens") for voce in allegato.get(chiave, [])}


def voci(bozza):
    """(etichetta, nome, flavour o None se la voce non ne ha bisogno, descrizione)."""
    out = []
    for p in bozza["characters"]:
        out.append((f"personaggio {p['id']}", p["name"], p.get("flavour", ""), ""))
    tokens = {}
    for c in bozza["cards"]:
        gui = c["gui"]
        slot = gui.get("description", "").split(" · ")[0]
        out.append((f"{slot} ({c['binding']})", gui["name"], gui.get("flavour", ""), gui.get("description", "")))
        for nome in TOKEN.findall(gui.get("description", "")):
            tokens[nome] = slot
    for nome, slot in tokens.items():
        out.append((f"token creato da {slot}", nome, None, ""))
    return out


def controlla(bozza, classi):
    errori = []
    classi_minuscole = {c.casefold() for c in classi}
    parola_di_classe = re.compile(r"\b(" + "|".join(sorted(map(re.escape, classi), key=len, reverse=True)) + r")\b")
    visti = {}
    for etichetta, nome, flavour, descrizione in voci(bozza):
        chiave = " ".join(nome.split()).casefold()
        if chiave in classi_minuscole or CAMEL.match(nome.strip()):
            errori.append(f"N1 {etichetta}: «{nome}» è un nome inglese di catalogo")
        for citato in parola_di_classe.findall(descrizione):
            errori.append(f"N1 {etichetta}: la descrizione cita {citato}, nome di classe del catalogo")
        testi = nome + "\n" + (flavour or "")
        for segno in SEGNAPOSTI:
            trovato = segno.search(testi)
            if trovato:
                errori.append(f"N2 {etichetta}: contiene «{trovato.group()}»")
        if chiave.startswith("last resort"):
            errori.append(f"N2 {etichetta}: «{nome}» comincia con la parola chiave Last Resort")
        if chiave in visti:
            errori.append(f"N3 {etichetta}: «{nome}» è già il nome di {visti[chiave]}")
        else:
            visti[chiave] = etichetta
        if flavour is not None and not flavour.strip():
            errori.append(f"N4 {etichetta}: flavour mancante")
    return errori


def main():
    percorso = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    bozza = json.loads(percorso.read_text(encoding="utf-8"))
    errori = controlla(bozza, classi_del_catalogo())
    if errori:
        print("\n".join(errori))
    n = len(voci(bozza))
    print(f"{percorso}: {n} voci, {len(errori)} violazioni")
    return 1 if errori else 0


if __name__ == "__main__":
    sys.exit(main())
