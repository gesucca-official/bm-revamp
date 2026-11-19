"""Riproduce le misure dei compensi del giro 3a (D148)."""
import argparse
import hashlib
import itertools
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

EVIDENZE = Path(__file__).resolve().parent
AREA = Path(tempfile.gettempdir()) / "bm-sb21-g3a"
BUDGET = 7000

sys.path.insert(0, str(EVIDENZE.parent / "giro-1"))
from analizza import PIERA, quota_contro
from prepara import BOZZA, ESTASI, RADICE, RIFERIMENTI, TESTI

sys.path.insert(0, str(EVIDENZE.parents[1] / "sb-20"))
from matrice import aggrega, leggi, salva, starter

LANCIO = EVIDENZE.parents[1] / "sb-19" / "run.ps1"
ESTASI_B1 = [(ESTASI, '"base": 18', '"base": 10, "perAlcohol": 2')]
ID_PIERA = "base.character.Pino"
COMPENSI = {
    "h90": [(ID_PIERA, '"HEALTH": 80', '"HEALTH": 90')],
    "h100": [(ID_PIERA, '"HEALTH": 80', '"HEALTH": 100')],
    "l15": [(ID_PIERA, '"ALCOHOL": 10', '"ALCOHOL": 15')],
    "l20": [(ID_PIERA, '"ALCOHOL": 10', '"ALCOHOL": 20')],
    "basic10": [("base.pino.QuestoLoFiniscoIo", '"amount": 5', '"amount": 10')],
    "basic15": [("base.pino.QuestoLoFiniscoIo", '"amount": 5', '"amount": 15')],
    "basic20": [("base.pino.QuestoLoFiniscoIo", '"amount": 5', '"amount": 20')],
    # SB-16d: +6 L raggiunge 5,10 con la corazza. Si sonda +4 L.
    "bound4": [("base.pino.bound.CinqueMinutiEVado", '"amount": 5', '"amount": 4')],
}


def registra_tempi():
    misure = sorted((leggi(p) for p in AREA.glob("*-attempt.json")), key=lambda m: m["startedUtc"])
    totale = sum(m["wallSeconds"] for m in misure)
    salva(EVIDENZE / "tempi.json", dict(limiteSecondi=BUDGET, totaleSecondi=totale, misure=misure))
    return totale


def lancia(shell, nome, bozza, righe=(), avversari=()):
    residuo = BUDGET - registra_tempi()
    if residuo <= 0:
        raise SystemExit("STOP 4: budget esaurito")
    etichetta = f"sb21g3a-{nome}"
    marcatore = AREA / f"round-{etichetta}-attempt.json"
    if marcatore.exists():
        if leggi(marcatore)["exit"] != 0:
            raise SystemExit(f"STOP 2: misura già tentata: {marcatore}")
        dati = matrice(nome)
        if dati["intestazione"]["sha256"] != impronta(bozza):
            raise SystemExit(f"STOP 2: impronta diversa per la misura {nome}")
        return dati
    comando = [shell, "-NoProfile", "-File", str(LANCIO), "-Phase", "round",
               "-Label", etichetta, "-Draft", str(bozza), "-OutputRoot", str(AREA)]
    if righe:
        comando += ["-Rows", ",".join(righe), "-Foes", ",".join(avversari)]
    with subprocess.Popen(comando, cwd=RADICE) as processo:
        try:
            esito = processo.wait(timeout=residuo)
        except subprocess.TimeoutExpired:
            subprocess.run(["taskkill", "/PID", str(processo.pid), "/T", "/F"], check=True)
            processo.wait()
            misura = leggi(marcatore)
            misura.update(wallSeconds=residuo, exit="STOP 4")
            salva(marcatore, misura)
            registra_tempi()
            raise SystemExit("STOP 4: budget esaurito")
    registra_tempi()
    if esito:
        raise SystemExit(f"STOP 2: misura {nome} fallita ({esito})")
    return matrice(nome)


def cartella(nome):
    return AREA / f"round-sb21g3a-{nome}"


def matrice(nome, fase="round"):
    percorso = AREA / f"{fase}-sb21g3a-{nome}" / "matrix.json"
    dati = leggi(percorso)
    if any(dati["invarianti"]["violazioni"].values()) or any(b["viola"] for b in dati["tettoBound"]):
        raise SystemExit(f"STOP 2: invarianti o tetto bound in {percorso}")
    return dati


def impronta(percorso):
    return hashlib.sha256(percorso.read_bytes()).hexdigest()


def cambia(testo, identificatore, prima, dopo):
    inizio = re.compile(r'\{\s*"(?:id|binding)"\s*:\s*"' + re.escape(identificatore) + r'"')
    posizione, = inizio.finditer(testo)
    _, fine = json.JSONDecoder().raw_decode(testo, posizione.start())
    scheda = testo[posizione.start():fine]
    if scheda.count(prima) != 1:
        raise ValueError(f"{identificatore}: occorre un solo frammento {prima}")
    return testo[:posizione.start()] + scheda.replace(prima, dopo) + testo[fine:]


def prepara(nome, origine, cambi):
    testo = origine.read_bytes().decode("utf-8")
    for identificatore, prima, dopo in cambi:
        testo = cambia(testo, identificatore, prima, dopo)
    bozza = AREA / f"{nome}.json"
    bozza.write_bytes(testo.encode("utf-8"))
    for script, opzioni in (
        (TESTI, ["--scrivi"]),
        (TESTI.parents[1] / "controlla-numeri.py", []),
        (TESTI.with_name("controlla-testi.py"), []),
    ):
        subprocess.run([sys.executable, "-X", "utf8", str(script), str(bozza), *opzioni], check=True)
    return bozza


def misura_compenso(shell, nome, leve):
    cambi = ESTASI_B1 + list(itertools.chain.from_iterable(COMPENSI[l] for l in leve))
    bozza = prepara(nome, BOZZA, cambi)
    # Riproduce il lato A delle sette coppie del Rif.
    gira_a = lancia(shell, f"{nome}-a", bozza, RIFERIMENTI[:3], (PIERA,))
    gira_b = lancia(shell, f"{nome}-b", bozza, (PIERA,), RIFERIMENTI[3:])
    coppie = aggrega(gira_a) | aggrega(gira_b)
    quote = {avv: quota_contro(coppie, PIERA, avv) for avv in RIFERIMENTI}
    fuori = {avv: q for avv, q in quote.items() if not 35 <= q <= 65}
    esito = dict(leve=leve, cambi=cambi, sha256=impronta(bozza), quote=quote, fuori=fuori)
    salva(EVIDENZE / f"compenso-{nome}.json", esito)
    print(json.dumps(esito), flush=True)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    cli.add_argument("azione", choices=("singoli", "combinazioni"))
    args = cli.parse_args()
    matrice("rif", fase="feasibility")
    matrice("rif")
    if args.azione == "singoli":
        starter(cartella("rif"), EVIDENZE / "matrice-rif.json")
        for nome in ("h90", "h100", "l15", "l20", "basic10", "bound4"):
            misura_compenso(args.shell, nome, [nome])
    else:
        for basic in ("basic10", "basic15", "basic20"):
            misura_compenso(args.shell, f"l15-{basic}", ["l15", basic])


if __name__ == "__main__":
    main()
