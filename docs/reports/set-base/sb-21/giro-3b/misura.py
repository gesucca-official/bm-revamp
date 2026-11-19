"""Lancia le misure SB-21 3b una alla volta, entro 9.000 secondi cumulativi."""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile

EVIDENZE = Path(__file__).resolve().parent
RADICE = EVIDENZE.parents[4]
AREA = Path(tempfile.gettempdir()) / "bm-sb21-g3b"
LANCIO = EVIDENZE.parents[1] / "sb-19"
BOZZA = RADICE / "server/src/test/resources/set-base/bozza.json"
BUDGET = 9000
PERSONAGGI = {
    "spazienzio": "bruiser.character.BigBadBruiser",
    "mara": "base.character.Mara",
    "celestina": "junkie.character.ToxicJunkie",
    "piera": "base.character.Pino",
    "beppe": "base.character.Gigi",
    "sergio": "base.character.Cesira",
    "duccio": "base.character.Rocco",
}


def leggi(percorso):
    return json.loads(percorso.read_text(encoding="utf-8-sig"))


def salva(percorso, dati):
    percorso.write_text(json.dumps(dati, ensure_ascii=False, separators=(",", ":")) + "\n",
                         encoding="utf-8", newline="\n")


def tempi():
    misure = sorted((leggi(p) for p in AREA.glob("*-attempt.json")), key=lambda m: m["startedUtc"])
    totale = sum(m["wallSeconds"] for m in misure)
    salva(EVIDENZE / "tempi.json", dict(limiteSecondi=BUDGET, totaleSecondi=totale, misure=misure))
    return totale


def misura(shell, fase, nome, bozza, *opzioni):
    residuo = BUDGET - tempi()
    if residuo <= 0:
        raise SystemExit("STOP 4: budget esaurito")
    etichetta = f"sb21g3b-{nome}"
    marcatore = AREA / f"{fase}-{etichetta}-attempt.json"
    if marcatore.exists():
        raise SystemExit(f"STOP 2: {fase} {etichetta} già tentata")
    script = "search.ps1" if fase == "search" else "run.ps1"
    comando = [shell, "-NoProfile", "-File", str(LANCIO / script), "-Label", etichetta,
               "-Draft", str(bozza), "-OutputRoot", str(AREA), *opzioni]
    if fase != "search":
        comando.extend(("-Phase", fase))
    with subprocess.Popen(comando, cwd=RADICE) as processo:
        try:
            esito = processo.wait(timeout=residuo)
        except subprocess.TimeoutExpired:
            subprocess.run(["taskkill", "/PID", str(processo.pid), "/T", "/F"], check=True)
            processo.wait()
            precedente = leggi(marcatore)
            salva(marcatore, dict(precedente, wallSeconds=residuo, exit="STOP 4"))
            tempi()
            raise SystemExit("STOP 4: budget esaurito")
    tempi()
    if esito:
        raise SystemExit(f"STOP 2: {fase} {etichetta} fallita ({esito})")


def ricerca(shell, bozza, passata, personaggi):
    for nome in personaggi:
        etichetta = f"{passata}-{nome}"
        copia = AREA / f"sb21g3b-{etichetta}.json"
        base = f"sb7-ricerca-{copia.stem}-1"
        uscite = [RADICE / "tmp/sim" / f"{base}{s}" for s in (".json", ".md", ".tempi.txt")]
        if any(p.exists() for p in uscite):
            raise SystemExit(f"STOP 2: uscite già presenti per {etichetta}")
        shutil.copyfile(bozza, copia)
        misura(shell, "search", etichetta, copia, "-Characters", PERSONAGGI[nome])
        for uscita in uscite:
            shutil.move(uscita, AREA / uscita.name)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    cli.add_argument("--bozza", type=Path, default=BOZZA)
    sub = cli.add_subparsers(dest="fase", required=True)
    ricerca_cli = sub.add_parser("ricerca")
    ricerca_cli.add_argument("passata")
    ricerca_cli.add_argument("personaggi", nargs="+", choices=PERSONAGGI)
    giro = sub.add_parser("round")
    giro.add_argument("nome")
    giro.add_argument("--righe", default="")
    giro.add_argument("--avversari", default="")
    args = cli.parse_args()
    if args.fase == "ricerca":
        ricerca(args.shell, args.bozza.resolve(), args.passata, args.personaggi)
    else:
        opzioni = []
        if args.righe:
            opzioni.extend(("-Rows", args.righe))
        if args.avversari:
            opzioni.extend(("-Foes", args.avversari))
        misura(args.shell, "round", args.nome, args.bozza.resolve(), *opzioni)


if __name__ == "__main__":
    main()
