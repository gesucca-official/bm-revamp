"""SB-25 Fase B1 (D169, D170): prova che la bozza ha gli stessi numeri e gli stessi dati della bozza 1.7 di partenza.

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-25/numeri-invariati.py [COMMIT_BASE]   (predefinito dce3733)
Toglie da entrambe le bozze solo ciò che la Fase B1 può cambiare e confronta il resto, che deve essere identico:
- `gui.description` di ogni carta (il testo breve; il codice di slot che lo apriva ora è in docs/design/set-base/testi/slot.json);
- `name` e `description` di ogni stato delle carte, ovunque si trovi (self, target, inPlay, dentro anticipo, gettone e vendi).
Tutto il resto resta nel confronto: `gui.gains` e `gui.damageAmount` (D168 (4)), nomi, flavour, ruoli, rarità, salute, risorse,
costi, danni, guadagni, perdite, fattori, durate e tipi degli stati, parametri, priorità, bersagli, mazzi, regole, versione.
Controlla anche che il codice di slot tolto da ogni descrizione di partenza sia quello di slot.json per la stessa carta.
Esce con 0 se tutto torna.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PERCORSO = "server/src/test/resources/set-base/bozza.json"
SLOT = ROOT / "docs/design/set-base/testi/slot.json"


def stati(nodo):
    """Ogni oggetto stato dentro un nodo JSON, a qualunque profondità."""
    if isinstance(nodo, dict):
        if nodo.get("op") == "status":
            yield nodo
        for valore in nodo.values():
            yield from stati(valore)
    elif isinstance(nodo, list):
        for valore in nodo:
            yield from stati(valore)


def spoglia(bozza):
    bozza = json.loads(json.dumps(bozza))
    conti = {"descrizioni": 0, "stati": 0}
    for c in bozza["cards"]:
        c["gui"].pop("description")
        conti["descrizioni"] += 1
        for s in stati(c):
            s.pop("name")
            s.pop("description")
            conti["stati"] += 1
    return bozza, conti


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "dce3733"
    prima = json.loads(subprocess.run(["git", "show", f"{base}:{PERCORSO}"], cwd=ROOT, capture_output=True, check=True).stdout
                       .decode("utf-8"))
    dopo = json.loads((ROOT / PERCORSO).read_text(encoding="utf-8"))
    (a, conti_a), (b, conti_b) = spoglia(prima), spoglia(dopo)
    if a != b or conti_a != conti_b:
        sa = json.dumps(a, ensure_ascii=False, indent=1, sort_keys=True).splitlines()
        sb = json.dumps(b, ensure_ascii=False, indent=1, sort_keys=True).splitlines()
        import difflib
        print("\n".join(list(difflib.unified_diff(sa, sb, lineterm=""))[:60]) or f"conti diversi: {conti_a} {conti_b}")
        return 1
    slot = json.loads(SLOT.read_text(encoding="utf-8"))["slot"]
    sbagliati = [c["binding"] for c in prima["cards"] if not c["gui"]["description"].startswith(slot.get(c["binding"], "?") + " · ")]
    if sbagliati:
        print(f"codice di slot di partenza diverso da slot.json: {sbagliati}")
        return 1
    con_prefisso = [c["binding"] for c in dopo["cards"] if c["gui"]["description"].startswith(slot[c["binding"]])]
    if con_prefisso:
        print(f"descrizioni che si aprono ancora col codice di slot: {con_prefisso}")
        return 1
    cambiate = sum(1 for c0, c1 in zip(prima["cards"], dopo["cards"]) if c0["gui"]["description"] != c1["gui"]["description"])
    stati_cambiati = sum(1 for s0, s1 in zip(stati(prima["cards"]), stati(dopo["cards"]))
                         if (s0["name"], s0["description"]) != (s1["name"], s1["description"]))
    print(f"numeri invariati rispetto a {base}: {len(dopo['cards'])} carte, {len(dopo['characters'])} personaggi, "
          f"{len(dopo['decks'])} mazzi, regole e versione «{dopo['set']['version']}» identiche; cambiano solo {cambiate} descrizioni "
          f"(il codice di slot tolto coincide con slot.json per tutte) e nome o descrizione di {stati_cambiati} stati su "
          f"{conti_b['stati']}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
