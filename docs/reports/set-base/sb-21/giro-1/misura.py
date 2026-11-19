"""Esegue in serie i lanciatori SB-19 con il tetto cumulativo di SB-21."""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile
from time import monotonic

from prepara import RADICE, RIFERIMENTI, SCAMBI_ESTASI, SCAMBI_GRAPPA, prepara

AREA = Path(tempfile.gettempdir()) / "bm-sb21-g1"
LANCIO = RADICE / "docs/reports/set-base/sb-19"
EVIDENZE = Path(__file__).resolve().parent
BUDGET = 5500


def tentativi():
    righe = [json.loads(p.read_text(encoding="utf-8-sig")) for p in AREA.glob("*-attempt.json")]
    return sorted(righe, key=lambda a: a["startedUtc"])


def registra():
    righe = tentativi()
    misure = [
        {k: a[k] for k in ("phase", "label", "rows", "foes", "gamesPerCell",
                           "startedUtc", "wallSeconds", "exit") if k in a}
        for a in righe
    ]
    totale = sum(a["wallSeconds"] for a in righe)
    dato = {"limiteSecondi": BUDGET, "totaleSecondi": totale, "misure": misure}
    (EVIDENZE / "tempi.json").write_text(json.dumps(dato, separators=(",", ":")) + "\n", encoding="utf-8")
    return totale


def lancia(shell, script, fase, etichetta, bozza, opzioni):
    residuo = BUDGET - registra()
    if residuo <= 0:
        raise SystemExit("STOP 4: budget esaurito")
    marcatore = AREA / f"{fase}-{etichetta}-attempt.json"
    if marcatore.exists():
        raise SystemExit(f"Misura già tentata: {marcatore}")
    comandi = [shell, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(LANCIO / script),
               "-Label", etichetta, "-Draft", str(bozza), "-OutputRoot", str(AREA), *opzioni]
    inizio = monotonic()
    with subprocess.Popen(comandi, cwd=RADICE) as processo:
        try:
            esito = processo.wait(timeout=residuo)
        except subprocess.TimeoutExpired:
            secondi = min(residuo, monotonic() - inizio)
            subprocess.run(["taskkill", "/PID", str(processo.pid), "/T", "/F"], check=True)
            processo.wait()
            if marcatore.exists():
                dati = json.loads(marcatore.read_text(encoding="utf-8-sig"))
                dati.update(wallSeconds=secondi, exit="STOP 4")
                marcatore.write_text(json.dumps(dati, separators=(",", ":")) + "\n", encoding="utf-8")
            registra()
            raise SystemExit("STOP 4: budget esaurito")
    if marcatore.exists():
        registra()
    if esito:
        raise SystemExit(esito)


def giro(shell, etichetta, bozza, mazzi, avversari=RIFERIMENTI, fase="round"):
    lancia(shell, "run.ps1", fase, etichetta, bozza,
           ["-Phase", fase, "-Rows", ",".join(mazzi), "-Foes", ",".join(avversari)])


def isolamenti(shell, estasi, grappa):
    nome = f"estasi-{estasi}" if grappa is None else f"grappa-{grappa}"
    copia = AREA / f"{nome}.json"
    prepara(copia, estasi, grappa)
    for controllo in ("controlla-numeri.py", "testi/controlla-testi.py"):
        script = RADICE / "docs/design/set-base" / controllo
        subprocess.run([sys.executable, "-X", "utf8", str(script), str(copia)], check=True)
    scambi = SCAMBI_ESTASI if grappa is None else SCAMBI_GRAPPA
    giro(shell, f"sb21g1-{nome}", copia, [s[0] for s in scambi])


def starter_piera(shell, estasi):
    copia = AREA / f"estasi-{estasi}.json"
    # Mantiene l'orientamento di «Rif», quindi il lato di partenza di ogni seme.
    giro(shell, f"sb21g1-piera-{estasi}-a", copia, RIFERIMENTI[:3], RIFERIMENTI[3:4])
    giro(shell, f"sb21g1-piera-{estasi}-b", copia, RIFERIMENTI[3:4], RIFERIMENTI[3:])


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    sub = cli.add_subparsers(dest="fase", required=True)
    sub.add_parser("estasi")
    piera = sub.add_parser("piera")
    piera.add_argument("valori", nargs="+", type=int, choices=(15, 12, 10))
    grappa = sub.add_parser("grappa")
    grappa.add_argument("estasi", type=int, choices=(18, 15, 12, 10))
    args = cli.parse_args()
    if args.fase == "estasi":
        for valore in (18, 15, 12, 10):
            isolamenti(args.shell, valore, None)
    elif args.fase == "piera":
        for valore in args.valori:
            starter_piera(args.shell, valore)
    elif args.fase == "grappa":
        for valore in (25, 20, 15):
            isolamenti(args.shell, args.estasi, valore)
