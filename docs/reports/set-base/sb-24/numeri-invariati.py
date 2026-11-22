"""SB-24 Fase B (D166 (3)): prova che la bozza 1.7 ha gli stessi numeri e gli stessi dati della bozza di partenza.

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-24/numeri-invariati.py [COMMIT_BASE]   (predefinito 627eb92)
Toglie da entrambe le bozze solo ciò che la Fase B può cambiare e confronta il resto, che deve essere identico:
- `set.version`; nome, flavour e rarità dei personaggi; `gui.name` e `gui.flavour` delle carte;
- in `gui.description` i nomi fra «» (gli «Annuncia») e il nome del token in OGG-03, sostituiti da un segnaposto: il resto
  della descrizione, numeri compresi, resta nel confronto.
Le rarità delle carte, salute, risorse, costi, danni, guadagni, perdite, parametri, priorità, mazzi e regole restano nel confronto.
Esce con 0 se identiche.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PERCORSO = "server/src/test/resources/set-base/bozza.json"


def spoglia(bozza):
    bozza = json.loads(json.dumps(bozza))
    bozza["set"].pop("version")
    for p in bozza["characters"]:
        for campo in ("name", "flavour", "rarity"):
            p.pop(campo, None)
    for c in bozza["cards"]:
        gui = c["gui"]
        gui.pop("name")
        gui.pop("flavour", None)
        d = re.sub(r"«[^»]*»", "«»", gui["description"])
        gui["description"] = d.replace("BrokenBeerBottle", "«»")
    return bozza


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "627eb92"
    prima = json.loads(subprocess.run(["git", "show", f"{base}:{PERCORSO}"], cwd=ROOT, capture_output=True, check=True).stdout
                       .decode("utf-8"))
    dopo = json.loads((ROOT / PERCORSO).read_text(encoding="utf-8"))
    a, b = spoglia(prima), spoglia(dopo)
    if a != b:
        sa = json.dumps(a, ensure_ascii=False, indent=1, sort_keys=True).splitlines()
        sb = json.dumps(b, ensure_ascii=False, indent=1, sort_keys=True).splitlines()
        import difflib
        print("\n".join(list(difflib.unified_diff(sa, sb, lineterm=""))[:60]))
        return 1
    cambiati = sum(1 for c0, c1 in zip(prima["cards"], dopo["cards"]) if c0["gui"]["name"] != c1["gui"]["name"])
    print(f"numeri invariati rispetto a {base}: {len(dopo['cards'])} carte, {len(dopo['characters'])} personaggi, "
          f"{len(dopo['decks'])} mazzi, regole identiche; cambiano solo nomi ({cambiati} carte), flavour, rarità dei personaggi, "
          f"versione {prima['set']['version']} -> {dopo['set']['version']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
