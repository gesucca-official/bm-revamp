"""SB-24 Fase B: mutazioni di controlla-nomi.py; ognuna deve far fallire prova-controlla-nomi.py.

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-24/mutazioni.py   (le copie mutate vanno in una cartella temporanea)
Scrive l'esito di ogni mutazione ed esce con 1 se una sopravvive.
"""
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CONTROLLO = ROOT / "docs/design/set-base/controlla-nomi.py"
PROVA = Path(__file__).resolve().with_name("prova-controlla-nomi.py")
MUTAZIONI = [
    ("N1 senza i nomi di classe", "if chiave in classi_minuscole or CAMEL", "if False and chiave in classi_minuscole or CAMEL"),
    ("N1 senza il CamelCase", "or CAMEL.match(nome.strip())", "or False"),
    ("N1 senza le descrizioni", "for citato in parola_di_classe.findall(descrizione):", "for citato in []:"),
    ("N2 senza «da inventare»", 're.compile(r"da inventare", re.I)', 're.compile(r"xyzxyz")'),
    ("N2 senza la parola chiave", 'if chiave.startswith("last resort"):', "if False:"),
    ("N3 senza ripetuti", "if chiave in visti:", "if False:"),
    ("N3 con maiuscole distinte", 'chiave = " ".join(nome.split()).casefold()', "chiave = nome"),
    ("N4 senza flavour", "if flavour is not None and not flavour.strip():", "if False:"),
]


def main():
    testo = CONTROLLO.read_text(encoding="utf-8")
    sopravvissute = 0
    with tempfile.TemporaryDirectory() as cartella:
        for nome, prima, dopo in MUTAZIONI:
            if testo.count(prima) != 1:
                raise SystemExit(f"{nome}: frammento non trovato una sola volta")
            mutato = Path(cartella) / "controlla-nomi.py"
            # La copia sta fuori dal repository: ROOT, che il controllo calcola dal proprio percorso, si fissa sulla radice vera.
            mutato.write_text(testo.replace(prima, dopo).replace(
                'ROOT = Path(__file__).resolve().parents[2].parent', f'ROOT = Path(r"{ROOT}")'), encoding="utf-8")
            esito = subprocess.run([sys.executable, "-X", "utf8", str(PROVA), str(mutato)], capture_output=True, text=True,
                                   encoding="utf-8")
            uccisa = esito.returncode == 1
            sopravvissute += not uccisa
            casi = [r[5:].split(":")[0] for r in esito.stdout.splitlines() if r.startswith("NO")]
            print(("uccisa      " if uccisa else "SOPRAVVIVE  ") + nome + (": " + ", ".join(casi) if casi else ""))
    return 1 if sopravvissute else 0


if __name__ == "__main__":
    sys.exit(main())
