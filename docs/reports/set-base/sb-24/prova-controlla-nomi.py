"""SB-24 Fase B: prova di controlla-nomi.py su copie alterate della bozza 1.7 (in %TEMP%), una per regola.

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-24/prova-controlla-nomi.py [CONTROLLO]
(predefinito docs/design/set-base/controlla-nomi.py; un percorso diverso serve alle mutazioni del controllo). Esce con 1 se un caso
non va come atteso: la bozza vera deve passare, ogni copia alterata deve fallire con la sua regola.
"""
import copy
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"


def carta(b, slot):
    return next(c for c in b["cards"] if c["gui"]["description"].startswith(slot + " · "))


def casi():
    yield "bozza 1.7", None, lambda b: None
    yield "nome di classe Grab", "N1", lambda b: carta(b, "GEN-01")["gui"].update(name="Grab")
    yield "CamelCase fuori dal catalogo", "N1", lambda b: carta(b, "SPA-BO3")["gui"].update(name="TestaAlMuro")
    yield "token col nome di classe", "N1", lambda b: carta(b, "OGG-03")["gui"].update(
        description=carta(b, "OGG-03")["gui"]["description"].replace("«Bottiglia Spaccata»", "BrokenBeerBottle"))
    yield "da inventare", "N2", lambda b: carta(b, "MAR-AR2")["gui"].update(name="Sgommata (da inventare)")
    yield "parola chiave nel nome", "N2", lambda b: carta(b, "LR-STR")["gui"].update(name="Last Resort: Addosso!!!")
    yield "stesso nome su due slot", "N3", lambda b: carta(b, "GEN-02")["gui"].update(name=carta(b, "GEN-01")["gui"]["name"].upper())
    yield "personaggio col nome di una carta", "N3", lambda b: b["characters"][1].update(name=carta(b, "MAR-BA")["gui"]["name"])
    yield "flavour mancante", "N4", lambda b: carta(b, "GEN-05")["gui"].pop("flavour")


def main():
    controllo = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "docs/design/set-base/controlla-nomi.py")
    base = json.loads(BOZZA.read_text(encoding="utf-8"))
    falliti = 0
    with tempfile.TemporaryDirectory() as cartella:
        for nome, regola, altera in casi():
            b = copy.deepcopy(base)
            altera(b)
            percorso = os.path.join(cartella, "bozza.json")
            Path(percorso).write_text(json.dumps(b, ensure_ascii=False), encoding="utf-8")
            esito = subprocess.run([sys.executable, "-X", "utf8", controllo, percorso], capture_output=True, text=True,
                                   encoding="utf-8")
            if regola is None:
                bene = esito.returncode == 0
            else:
                bene = esito.returncode == 1 and any(r.startswith(regola + " ") for r in esito.stdout.splitlines())
            falliti += not bene
            print(("ok   " if bene else "NO   ") + f"{nome}: uscita {esito.returncode}, atteso {regola or 'verde'}")
    return 1 if falliti else 0


if __name__ == "__main__":
    sys.exit(main())
