"""Riproduce le misure del giro 3a rifatto (D149)."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile

EVIDENZE = Path(__file__).resolve().parent
AREA = Path(tempfile.gettempdir()) / "bm-sb21-g3abis"
BUDGET = 7000

sys.path.insert(0, str(EVIDENZE.parent / "giro-1"))
from analizza import NOMI, PIERA, confronta, quota_contro
from prepara import BOZZA, ESTASI, RADICE, RIFERIMENTI, SCAMBI_ESTASI, TESTI, scambia

sys.path.insert(0, str(EVIDENZE.parents[1] / "sb-20"))
from matrice import aggrega, leggi, salva, starter

LANCIO = EVIDENZE.parents[1] / "sb-19" / "run.ps1"
ESTASI_B1 = [(ESTASI, '"base": 18', '"base": 10, "perAlcohol": 2')]
ID_PIERA = "base.character.Pino"
CELESTINA = RIFERIMENTI[2]
SERGIO = RIFERIMENTI[5]
ID_CELESTINA = "junkie.character.ToxicJunkie"
PIERA_LEVE = {
    "h90": (ID_PIERA, '"HEALTH": 80', '"HEALTH": 90'),
    "l15": (ID_PIERA, '"ALCOHOL": 10', '"ALCOHOL": 15'),
    "basic15": ("base.pino.QuestoLoFiniscoIo", '"amount": 5', '"amount": 15'),
}
CELESTINA_LEVE = {
    "h65": (ID_CELESTINA, '"HEALTH": 70', '"HEALTH": 65'),
    "h60": (ID_CELESTINA, '"HEALTH": 70', '"HEALTH": 60'),
    "a30": (ID_CELESTINA, '"ALERTNESS": 35', '"ALERTNESS": 30'),
    "t10": (ID_CELESTINA, '"TOXICITY": 15', '"TOXICITY": 10'),
    "bound6": ("base.tossico.bound.RaschiareIlFondo", '"amount": 7', '"amount": 6'),
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
    etichetta = f"sb21g3abis-{nome}"
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
    return AREA / f"round-sb21g3abis-{nome}"


def matrice(nome, fase="round"):
    percorso = AREA / f"{fase}-sb21g3abis-{nome}" / "matrix.json"
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
    cambi = ESTASI_B1 + [PIERA_LEVE[l] for l in leve]
    bozza = prepara(nome, BOZZA, cambi)
    gira_a = lancia(shell, f"{nome}-a", bozza, RIFERIMENTI[:3], (PIERA,))
    gira_b = lancia(shell, f"{nome}-b", bozza, (PIERA,), RIFERIMENTI[3:])
    coppie = aggrega(gira_a) | aggrega(gira_b)
    quote = {avv: quota_contro(coppie, PIERA, avv) for avv in RIFERIMENTI}
    return dict(leve=leve, cambi=cambi, sha256=impronta(bozza), quote=quote)


def minimo_piera(prova):
    return min(q for avv, q in prova["quote"].items() if avv != PIERA)


def misura_piera(shell):
    riferimento = leggi(EVIDENZE.parent / "giro-3a/compenso-l15-basic15.json")
    prove = {"l15-basic15": riferimento}
    for nome, leve in (("h90-l15", ["h90", "l15"]),
                       ("h90-l15-basic15", ["h90", "l15", "basic15"])):
        prove[nome] = misura_compenso(shell, nome, leve)
        salva(EVIDENZE / "compensi.json", dict(prove=prove))
    scelto = max(prove, key=lambda nome: minimo_piera(prove[nome]))
    salva(EVIDENZE / "compensi.json", dict(prove=prove, scelto=scelto))
    compensata = prepara("piera", BOZZA, prove[scelto]["cambi"])
    assert impronta(compensata) == prove[scelto]["sha256"]
    misura_starter(shell, "piera", compensata)


def chiave(riga):
    return riga["a"], riga["b"]


def euristiche(dati):
    return [r for r in dati["coppie"] if r["gruppo"] == "heur"]


def fuori(dati, criterio):
    return [r for r in euristiche(dati) if criterio in r["fuori"]]


def fuori_minimo(dati):
    return [r for r in euristiche(dati) if r["a"] != r["b"] and not 35 <= r["quota"] <= 65]


def scarto(q, minimo, massimo):
    return max(minimo - q, q - massimo, 0)


def riepiloga(nome):
    dati = leggi(EVIDENZE / f"matrice-{nome}.json")
    for r in euristiche(dati):
        a, b = map(NOMI.get, chiave(r))
        q = r["quota"]
        fascia = " fuori 35–65" if a != b and not 35 <= q <= 65 else ""
        print(f"{a:11} {b:11} {q:6.2f}% {r['percentualePatte']:6.2f}% patte"
              f" {r['turni']:6.2f} turni {' '.join(r['fuori'])}{fascia}")
    print(f"Fuori obiettivo: {len(fuori(dati, 'quota'))}; fuori minimo: {len(fuori_minimo(dati))}")


def misura_starter(shell, nome, bozza):
    lancia(shell, nome, bozza)
    starter(cartella(nome), EVIDENZE / f"matrice-{nome}.json")
    riepiloga(nome)


def misura_personaggio(shell, nome, bozza, personaggio, origine):
    indice = RIFERIMENTI.index(personaggio)
    lanci = []
    if indice:
        lancia(shell, f"{nome}-a", bozza, RIFERIMENTI[:indice], (personaggio,))
        lanci.append(f"{nome}-a")
    lancia(shell, f"{nome}-b", bozza, (personaggio,), RIFERIMENTI[indice:])
    lanci.append(f"{nome}-b")
    coppie = {}
    for lancio in lanci:
        uscita = AREA / f"matrice-{lancio}.json"
        starter(cartella(lancio), uscita)
        coppie.update({(*chiave(r), r["gruppo"]): r for r in leggi(uscita)["coppie"]})
    prima = leggi(EVIDENZE / f"matrice-{origine}.json")
    assert len(coppie) == len(RIFERIMENTI) * 3 and all(personaggio in k[:2] for k in coppie)
    dopo = [coppie.pop((*chiave(r), r["gruppo"])) if personaggio in chiave(r) else r
            for r in prima["coppie"]]
    assert not coppie
    salva(EVIDENZE / f"matrice-{nome}.json",
          dict(lanci=lanci, coppieRipreseDa=origine, sha256=impronta(bozza), coppie=dopo))
    riepiloga(nome)


def misura_celestina(shell, nome, leve):
    bozza = prepara(nome, AREA / "piera.json", [CELESTINA_LEVE[l] for l in leve])
    misura_personaggio(shell, nome, bozza, CELESTINA, "piera")
    dati = leggi(EVIDENZE / f"matrice-{nome}.json")
    dopo = {chiave(r): r for r in euristiche(dati)}
    prima = leggi(EVIDENZE / "matrice-piera.json")
    coppie_bersaglio = ((CELESTINA, PIERA), (CELESTINA, SERGIO))
    punteggio = sum(scarto(dopo[c]["quota"], 40, 60) for c in coppie_bersaglio)
    uscite = [chiave(r) for r in euristiche(prima) if CELESTINA in chiave(r)
              and chiave(r) not in coppie_bersaglio
              and 35 <= r["quota"] <= 65 and not 35 <= dopo[chiave(r)]["quota"] <= 65]
    print(f"{nome}: distanza dagli obiettivi {punteggio:.3f}; nuove uscite {uscite}")


def fine(shell, nome):
    bozza = AREA / f"{nome}.json"
    contenuto = leggi(bozza)
    ingresso = leggi(BOZZA)
    for k in ("format", "set", "rules", "decks"):
        assert contenuto[k] == ingresso[k], k
    assert matrice(nome)["intestazione"]["sha256"] == impronta(bozza)
    mazzi = {m["id"]: m for m in contenuto["decks"]}
    for scambio in SCAMBI_ESTASI:
        contenuto["decks"].append(scambia(mazzi, *scambio))
    copia = AREA / f"{nome}-iso.json"
    salva(copia, contenuto)
    iso = lancia(shell, f"{nome}-iso", copia, [s[0] for s in SCAMBI_ESTASI], RIFERIMENTI)
    gruppi_iso = aggrega(iso)
    riferimento = aggrega(matrice(nome))
    confronti = [confronta(gruppi_iso, riferimento, mazzo, controllo)
                 for mazzo, controllo, _, _ in SCAMBI_ESTASI]
    for c in confronti:
        c["passa"] = c["media"] <= 10 and c["massimo"] <= 15
    prima = leggi(EVIDENZE / "matrice-rif.json")
    dopo = leggi(EVIDENZE / f"matrice-{nome}.json")
    misure = {"patte": ("percentualePatte", 0, 10), "durata": ("turni", 6, 12)}
    regressioni = {}
    antecedenti = {chiave(r): r for r in euristiche(prima)}
    for criterio, (campo, minimo, massimo) in misure.items():
        regressioni[criterio] = [dict(a=r["a"], b=r["b"], prima=antecedenti[chiave(r)][campo],
                                    dopo=r[campo]) for r in fuori(dopo, criterio)
                                 if scarto(r[campo], minimo, massimo) >
                                 scarto(antecedenti[chiave(r)][campo], minimo, massimo)]
    criteri = dict(fasciaMinima=not fuori_minimo(dopo),
                   menoFuoriObiettivo=len(fuori(dopo, "quota")) < len(fuori(prima, "quota")),
                   patte=not regressioni["patte"], durata=not regressioni["durata"],
                   estasi=all(c["passa"] for c in confronti))
    esito = dict(nome=nome, sha256=impronta(bozza), criteri=criteri, regressioni=regressioni,
                 isolamenti=confronti, passa=all(criteri.values()))
    salva(EVIDENZE / "controllo-finale.json", esito)
    print(esito)


def inventario():
    registra_tempi()
    righe = []
    for file in sorted(AREA.glob("*/matrix.json")):
        dati = leggi(file)
        violazioni = dati["invarianti"]["violazioni"]
        oltre = [b for b in dati["tettoBound"] if b["viola"]]
        assert not any(violazioni.values()) and not oltre, file
        righe.append(dict(misura=file.parent.name, partite=dati["invarianti"]["partite"],
                          violazioni=violazioni, boundOltreIlTetto=len(oltre)))
    salva(EVIDENZE / "invarianti-misure.json", righe)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", default="powershell.exe")
    azioni = cli.add_subparsers(dest="azione", required=True)
    for azione in ("piera", "inventario"):
        azioni.add_parser(azione)
    celestina = azioni.add_parser("celestina")
    celestina.add_argument("nome")
    celestina.add_argument("leve", nargs="+", choices=CELESTINA_LEVE)
    prova = azioni.add_parser("prova")
    prova.add_argument("nome")
    prova.add_argument("origine")
    prova.add_argument("cambi", type=Path, help="file JSON con le leve, indicizzate dal nome della prova")
    completa = azioni.add_parser("completa")
    completa.add_argument("nome")
    completa.add_argument("origine")
    finale = azioni.add_parser("fine")
    finale.add_argument("nome")
    args = cli.parse_args()
    for fase in ("feasibility", "round"):
        assert all(leggi(EVIDENZE / f"identita-{fase}.json")["file-identici"].values())
        matrice("rif", fase=fase)
    if args.azione == "piera":
        starter(cartella("rif"), EVIDENZE / "matrice-rif.json")
        misura_piera(args.shell)
    elif args.azione == "celestina":
        misura_celestina(args.shell, args.nome, args.leve)
    elif args.azione == "prova":
        prova = leggi(args.cambi)[args.nome]
        bozza = prepara(args.nome, AREA / f"{args.origine}.json", prova["cambi"])
        if "personaggio" in prova:
            misura_personaggio(args.shell, args.nome, bozza, prova["personaggio"], args.origine)
        else:
            misura_starter(args.shell, args.nome, bozza)
        prima = leggi(EVIDENZE / f"matrice-{args.origine}.json")
        dopo = leggi(EVIDENZE / f"matrice-{args.nome}.json")
        preesistenti = {chiave(r) for r in fuori_minimo(prima)}
        uscite = [chiave(r) for r in fuori_minimo(dopo) if chiave(r) not in preesistenti]
        d = len(fuori(prima, "quota")) - len(fuori(dopo, "quota"))
        print(f"{args.nome}: diminuzione fuori obiettivo {d}, nuove uscite {uscite}")
    elif args.azione == "completa":
        bozza = AREA / f"{args.origine}.json"
        misura_starter(args.shell, args.nome, bozza)
        attesa = leggi(EVIDENZE / f"matrice-{args.origine}.json")
        intera = leggi(EVIDENZE / f"matrice-{args.nome}.json")
        assert intera["coppie"] == attesa["coppie"], "La matrice completa differisce dalla matrice composta"
        (AREA / f"{args.nome}.json").write_bytes(bozza.read_bytes())
    elif args.azione == "fine":
        fine(args.shell, args.nome)
    inventario()


if __name__ == "__main__":
    main()
