"""SB-27 Fase A: prova che la bozza ha gli stessi numeri e gli stessi testi della bozza 1.7 di partenza (adattato da sb-25).

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-27/numeri-invariati.py [COMMIT_BASE]   (predefinito 21b7767)
Unica differenza ammessa: un parametro di una carta Java che vale 0 nella bozza di partenza e manca in quella nuova (i parametri
che spegnevano una parte della carta, tolti con la loro logica). Tutto il resto, testi brevi, nomi, descrizioni degli stati,
flavour compresi, deve essere identico. Stampa i parametri tolti ed esce con 0 se tutto torna.
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PERCORSO = "server/src/test/resources/set-base/bozza.json"


def main():
    base = sys.argv[1] if len(sys.argv) > 1 else "21b7767"
    prima = json.loads(subprocess.run(["git", "show", f"{base}:{PERCORSO}"], cwd=ROOT, capture_output=True, check=True).stdout
                       .decode("utf-8"))
    dopo = json.loads((ROOT / PERCORSO).read_text(encoding="utf-8"))
    nuove = {c["binding"]: c for c in dopo["cards"]}
    tolti = []
    for c in prima["cards"]:
        nuova = nuove.get(c["binding"])
        if nuova is None or "params" not in c:
            continue
        for nome, valore in list(c["params"].items()):
            if nome not in nuova.get("params", {}):
                if valore != 0:
                    print(f"{c['binding']}: params.{nome} tolto ma valeva {valore}, non 0")
                    return 1
                del c["params"][nome]
                tolti.append(f"{c['binding']}.{nome}")
    if prima != dopo:
        sa = json.dumps(prima, ensure_ascii=False, indent=1, sort_keys=True).splitlines()
        sb = json.dumps(dopo, ensure_ascii=False, indent=1, sort_keys=True).splitlines()
        import difflib
        print("\n".join(list(difflib.unified_diff(sa, sb, lineterm=""))[:60]))
        return 1
    print(f"Bozza uguale a {base} salvo {len(tolti)} parametri a 0 tolti: {', '.join(tolti)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
