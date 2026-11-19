"""Misura e confronta le quattro varianti di Estasi (D147) con lo stesso banco del giro 1."""
import argparse
from hashlib import sha256
from pathlib import Path
import subprocess
import sys
import tempfile

EVIDENZE = Path(__file__).resolve().parent
RADICE = EVIDENZE.parents[4]
AREA = Path(tempfile.gettempdir()) / "bm-sb21-g2"
LANCIO = EVIDENZE.parents[1] / "sb-19"
BUDGET = 5500

sys.path.insert(0, str(EVIDENZE.parent / "giro-1"))
from analizza import PIERA, confronta, quota_contro, uscite
from prepara import BOZZA, ESTASI, RIFERIMENTI, SCAMBI_ESTASI, TESTI, scambia

sys.path.insert(0, str(EVIDENZE.parents[1] / "sb-20"))
from matrice import aggrega, leggi, salva, starter

VARIANTI = {"a1": (5, 18, 1), "a2": (10, 18, 1), "b1": (0, 10, 2), "b2": (0, 6, 2)}


def registra_tempi():
    tentativi = sorted((leggi(p) for p in AREA.glob("*-attempt.json")), key=lambda a: a["startedUtc"])
    righe = [{k: a[k] for k in ("phase", "label", "rows", "foes", "characters", "gamesPerCell",
                                "startedUtc", "wallSeconds", "exit") if k in a}
             for a in tentativi]
    totale = sum(a["wallSeconds"] for a in righe)
    salva(EVIDENZE / "tempi.json", {"limiteSecondi": BUDGET, "totaleSecondi": totale, "misure": righe})
    return totale


def lancia(shell, script, fase, etichetta, bozza, opzioni):
    residuo = BUDGET - registra_tempi()
    if residuo <= 0:
        raise SystemExit("STOP 4: budget esaurito")
    marcatore = AREA / f"{fase}-{etichetta}-attempt.json"
    if marcatore.exists():
        raise SystemExit(f"Misura già tentata: {marcatore}")
    comando = [shell, "-NoProfile", "-File", str(LANCIO / script),
               "-Label", etichetta, "-Draft", str(bozza), "-OutputRoot", str(AREA), *opzioni]
    with subprocess.Popen(comando, cwd=RADICE) as processo:
        try:
            esito = processo.wait(timeout=residuo)
        except subprocess.TimeoutExpired:
            subprocess.run(["taskkill", "/PID", str(processo.pid), "/T", "/F"], check=True)
            processo.wait()
            dati = leggi(marcatore)
            dati.update(wallSeconds=residuo, exit="STOP 4")
            salva(marcatore, dati)
            registra_tempi()
            raise SystemExit("STOP 4: budget esaurito")
    registra_tempi()
    if esito:
        raise SystemExit(esito)


def giro(shell, nome, bozza, righe, avversari):
    lancia(shell, "run.ps1", "round", f"sb21g2-{nome}", bozza,
           ["-Phase", "round", "-Rows", ",".join(righe), "-Foes", ",".join(avversari)])


def prepara(nome, costo, base, moltiplicatore):
    bozza = leggi(BOZZA)
    estasi, = (c for c in bozza["cards"] if c["binding"] == ESTASI)
    estasi["cost"] = {"ALCOHOL": costo} if costo else {}
    estasi["params"].update(base=base, perAlcohol=moltiplicatore)
    mazzi = {m["id"]: m for m in bozza["decks"]}
    for scambio in SCAMBI_ESTASI:
        bozza["decks"].append(scambia(mazzi, *scambio))
    copia = AREA / f"{nome}.json"
    salva(copia, bozza)
    for script, opzioni in (
        (TESTI, ["--scrivi"]),
        (TESTI.parents[1] / "controlla-numeri.py", []),
        (TESTI.with_name("controlla-testi.py"), []),
    ):
        subprocess.run([sys.executable, "-X", "utf8", str(script), str(copia), *opzioni], check=True)
    return copia


def cartella(nome):
    return AREA / f"round-sb21g2-{nome}"


def gruppi(nome):
    matrice = leggi(cartella(nome) / "matrix.json")
    if any(matrice["invarianti"]["violazioni"].values()) or any(b["viola"] for b in matrice["tettoBound"]):
        raise SystemExit(f"STOP 2: violazione invarianti o tetto bound in {nome}")
    return aggrega(matrice)


def analizza(nome, prima, copia):
    piera = gruppi(f"{nome}-piera-a") | gruppi(f"{nome}-piera-b")
    controllo = prima | piera
    matrice = gruppi(f"{nome}-iso")
    isolamenti = [confronta(matrice, controllo, mazzo, controllo_id)
                  for mazzo, controllo_id, _, _ in SCAMBI_ESTASI]
    coppie = [{"avversario": avv, "prima": quota_contro(prima, PIERA, avv),
                "dopo": quota_contro(controllo, PIERA, avv)}
               for avv in RIFERIMENTI]
    fuori = uscite(prima, piera)
    distanza = sum(abs(c["dopo"] - c["prima"]) for c in coppie if c["avversario"] != PIERA) / (len(coppie) - 1)
    return dict(sha256=sha256(copia.read_bytes()).hexdigest(), isolamenti=isolamenti, piera=coppie,
                usciteStarter=fuori, distanzaMediaPiera=distanza,
                passa=not fuori and all(i["passa"] for i in isolamenti))


def misura_varianti(shell):
    prima = gruppi("rif")
    esiti = {}
    for nome, (costo, base, moltiplicatore) in VARIANTI.items():
        copia = prepara(nome, costo, base, moltiplicatore)
        giro(shell, f"{nome}-iso", copia, [s[0] for s in SCAMBI_ESTASI], RIFERIMENTI)
        # Stesso lato di partenza per ciascun seme di «Rif», come nel giro 1.
        giro(shell, f"{nome}-piera-a", copia, RIFERIMENTI[:3], (PIERA,))
        giro(shell, f"{nome}-piera-b", copia, (PIERA,), RIFERIMENTI[3:])
        dati = analizza(nome, prima, copia)
        esiti[nome] = dict(costo=costo, base=base, perAlcohol=moltiplicatore, **dati)
        salva(EVIDENZE / "varianti.json", {"varianti": esiti})
        print(f"{nome.upper()}: passa={dati['passa']}, distanza media Piera={dati['distanzaMediaPiera']:.2f}", flush=True)
    scelto = min((v for v in esiti if esiti[v]["passa"]),
                 key=lambda v: (esiti[v]["distanzaMediaPiera"], v[0]), default=None)
    salva(EVIDENZE / "varianti.json", {"varianti": esiti, "scelto": scelto})
    starter(cartella("rif"), EVIDENZE / "matrice-starter-prima.json")
    print(f"Estasi scelta: {scelto.upper() if scelto else 'nessuna'}", flush=True)


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", default="powershell.exe")
    misura_varianti(cli.parse_args().shell)
