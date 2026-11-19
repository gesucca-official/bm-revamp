"""Riproduce le misure di SB-21t con il banco di SB-19 e l'analisi del giro 3b."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True
EVIDENZE = Path(__file__).resolve().parent
RADICE = EVIDENZE.parents[3]
AREA = Path(tempfile.gettempdir()) / "bm-sb21t"
GIRO = EVIDENZE.parent / "sb-21/giro-3b"
LANCIO = EVIDENZE.parent / "sb-19"
BOZZA = RADICE / "server/src/test/resources/set-base/bozza.json"
TESTI = RADICE / "docs/design/set-base/testi"
BUDGET = 3000
ESTASI = "base.pino.GoingBerserk"

sys.path.insert(0, str(GIRO))
import riepiloga
from misura import leggi, salva

# Riusa la convenzione dei nomi del giro 3b in una cartella distinta.
riepiloga.AREA = AREA
riepiloga.EVIDENZE = AREA


def comando(*argomenti):
    return subprocess.run(argomenti, cwd=RADICE, check=True)


def tempi():
    misure = sorted((leggi(p) for p in AREA.glob("*-attempt.json")), key=lambda m: m["startedUtc"])
    totale = sum(m["wallSeconds"] for m in misure)
    for m in misure:
        p = Path(m["draft"])
        m["draft"] = ("%TEMP%/bm-sb21t/" + p.relative_to(AREA).as_posix()
                      if p.is_relative_to(AREA) else p.relative_to(RADICE).as_posix())
    salva(EVIDENZE / "tempi.json", dict(limiteSecondi=BUDGET, totaleSecondi=totale, misure=misure))
    return totale


def misura(shell, fase, nome, bozza, *opzioni):
    residuo = BUDGET - tempi()
    if residuo <= 0:
        raise SystemExit("STOP 4: budget di misura esaurito")
    etichetta = f"sb21g3b-{nome}"
    marcatore = AREA / f"{fase}-{etichetta}-attempt.json"
    if marcatore.exists():
        raise SystemExit(f"STOP: {fase} {etichetta} già tentata")
    argomenti = [shell, "-NoProfile", "-File", str(LANCIO / "run.ps1"), "-Label", etichetta,
                 "-Draft", str(bozza), "-OutputRoot", str(AREA), "-Phase", fase, *opzioni]
    with subprocess.Popen(argomenti, cwd=RADICE) as processo:
        try:
            esito = processo.wait(timeout=residuo)
        except subprocess.TimeoutExpired:
            subprocess.run(["taskkill", "/PID", str(processo.pid), "/T", "/F"], check=True)
            processo.wait()
            salva(marcatore, dict(leggi(marcatore), wallSeconds=residuo, exit="STOP 4"))
            tempi()
            raise SystemExit("STOP 4: budget di misura esaurito")
    tempi()
    if esito:
        raise SystemExit(f"Misura {etichetta} fallita ({esito})")


def controlla_bozza(copia):
    comando(sys.executable, "-B", "-X", "utf8", str(TESTI / "genera-testi.py"), "--scrivi", str(copia))
    comando(sys.executable, "-B", "-X", "utf8", str(TESTI / "controlla-testi.py"), str(copia))
    comando(sys.executable, "-B", "-X", "utf8", str(TESTI.parent / "controlla-numeri.py"), str(copia))


def cap(shell, tetto):
    nome = f"tetto-{tetto}"
    copia = AREA / f"{nome}.json"
    if hashlib.sha256(BOZZA.read_bytes()).hexdigest() != "1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc":
        raise SystemExit("La copia di misura richiede la bozza D149 di ingresso")
    dati = leggi(BOZZA)
    estasi, = (c for c in dati["cards"] if c["binding"] == ESTASI)
    estasi["params"]["maxDamage"] = tetto
    salva(copia, dati)
    controlla_bozza(copia)
    shutil.copyfile(GIRO / "matrice-rif.json", AREA / "matrice-rif.json")
    misura(shell, "round", f"{nome}-starter", copia)
    riepiloga.verifica_starter(f"{nome}-starter", nome)

    nuovi = AREA / f"{nome}-costruiti.json"
    dati = leggi(copia)
    dati["decks"].extend(leggi(GIRO / "ricerca-prima.json")["liste"].values())
    salva(nuovi, dati)
    costruiti = ",".join(riepiloga.COSTRUITI)
    avversari = ",".join((*riepiloga.COSTRUITI, *riepiloga.STARTER))
    misura(shell, "round", f"{nome}-diretti", nuovi, "-Rows", costruiti, "-Foes", avversari)
    riepiloga.scontri(nome, [f"{nome}-diretti"])
    for tipo in ("matrice", "verifica-starter", "scontri"):
        file = f"{tipo}-{nome}.json"
        shutil.copyfile(AREA / file, EVIDENZE / file)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    cli.add_argument("tetto", type=int, choices=(35, 30))
    args = cli.parse_args()
    cap(args.shell, args.tetto)


if __name__ == "__main__":
    main()
