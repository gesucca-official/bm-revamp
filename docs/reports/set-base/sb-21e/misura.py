"""Riproduce SB-21e con il banco SB-19, in serie e con un budget cumulativo di 5.500 s."""
import argparse
from copy import deepcopy
import hashlib
from pathlib import Path
import runpy
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True
EVIDENZE = Path(__file__).resolve().parent
RADICE = EVIDENZE.parents[3]
AREA = RADICE / "server/target/sb-21e"
GIRO = EVIDENZE.parent / "sb-21/giro-3b"
TESTI = RADICE / "docs/design/set-base/testi"
PIERA = "costruito-piera"
CARTA = "base.pino.GoingBerserk"
TESTATA = "base.pino.TestataDaUltimoGiro"
BANCONE = "base.pino.IlBanconeRegge"
RINFORZI = {TESTATA, BANCONE}
ESTASI = "base.com.EstasiDaCocaEtilene"
GRAPPA = "base.items.GrappaDellaCasa"
A, B = "iso-estasi-grappa", "iso-estasi-celestina"

sys.path.insert(0, str(GIRO))
import misura as banco
import riepiloga
from misura import leggi, salva

banco.AREA = riepiloga.AREA = AREA
banco.EVIDENZE = riepiloga.EVIDENZE = EVIDENZE
banco.BUDGET = 5500


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def comando(script, *opzioni):
    subprocess.run([sys.executable, "-B", "-X", "utf8", str(script), *map(str, opzioni)],
                   cwd=RADICE, check=True)


def coppie(nome, a, avversari):
    gruppi = riepiloga.aggrega(riepiloga.matrice(nome))
    return {b: {g: riepiloga.esito(gruppi, a, b, g) for g in ("heur", "mixed", "com")} for b in avversari}


def stili(nome):
    return [[c[k] for k in ("A", "B", "stileA", "stileB", "vittorieA", "vittorieB", "patte", "turniTotali")]
            for c in riepiloga.matrice(nome)["celle"]]


def passo0(shell, bozza):
    attesi = leggi(EVIDENZE.parent / "sb-21t/passo-0.json")
    if sha(bozza) != "1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc":
        raise SystemExit("STOP: il passo 0 richiede la bozza D149")
    esiti = {}
    for fase, atteso in attesi.items():
        out = AREA / f"{fase}-sb21g3b-rif"
        if not (out / "matrix.json").exists():
            banco.misura(shell, fase, "rif", bozza)
        if fase == "round":
            comando(EVIDENZE.parent / "sb-19/analyze.py", "rif", out, out / "rif")
        impronte = {f: sha(out / f) for f in atteso["file"]}
        esiti[fase] = impronte
        salva(EVIDENZE / "passo-0.json", esiti)
        if impronte != {f: v["sha256"] for f, v in atteso["file"].items()}:
            raise SystemExit(f"STOP: impronte del passo 0 diverse in {fase}")
    banco.tempi()


def passo1(shell, bozza):
    if not (riepiloga.cartella("passo-1") / "matrix.json").exists():
        banco.misura(shell, "round", "passo-1", bozza)
    rif, nuovo = map(riepiloga.cartella, ("rif", "passo-1"))
    comando(EVIDENZE.parent / "sb-19/analyze.py", "rif", nuovo, nuovo / "rif")
    normalizza = runpy.run_path(str(EVIDENZE.parent / "sb-20c/confronta-rif.py"))["byte_misura"]
    a, dati_a = normalizza(rif, rif / "rif")
    b, dati_b = normalizza(nuovo, nuovo / "rif")
    storico = leggi(GIRO / "identita-round.json")["sha256"]
    impronte = {f: [storico[f], hashlib.sha256(a[f]).hexdigest(), hashlib.sha256(b[f]).hexdigest()]
                for f in a}
    salva(EVIDENZE / "passo-1.json", dict(rif=dati_a, nuovo=dati_b, impronte=impronte))
    if any(len(set(v)) != 1 for v in impronte.values()):
        raise SystemExit("STOP: differenza nel banco degli starter dopo il cambio dati")


def scambi():
    return [s for s in leggi(GIRO / "scambi.json") if s["carta"] == CARTA]


def prova(shell, bozza, nome, base, self_hit, salute, alcol, basic, da, testata_danno, testata_self, bancone_alcol):
    dati = leggi(bozza)
    carta, = (c for c in dati["cards"] if c["binding"] == CARTA)
    carta["params"].update(base=base, selfHit=self_hit)
    piera, = (c for c in dati["characters"] if c["id"] == banco.PERSONAGGI["piera"])
    if salute is not None:
        piera["resources"]["HEALTH"] = salute
    if alcol is not None:
        piera["resources"]["ALCOHOL"] = alcol
    if basic is not None:
        carta_basic, = (c for c in dati["cards"] if c["binding"] == piera["basic"])
        guadagno, = (p for p in carta_basic["self"] if p.get("resource") == "ALCOHOL")
        guadagno["amount"] = basic
    testata, = (c for c in dati["cards"] if c["binding"] == TESTATA)
    if testata_danno is not None:
        testata["target"][0]["amount"] = testata_danno
    if testata_self == 0:
        del testata["self"]
    if bancone_alcol is not None:
        bancone, = (c for c in dati["cards"] if c["binding"] == BANCONE)
        guadagno, = (p for p in bancone["self"] if p.get("resource") == "ALCOHOL")
        guadagno["amount"] = bancone_alcol
    copia = AREA / f"{nome}.json"
    salva(copia, dati)
    comando(TESTI / "genera-testi.py", "--scrivi", copia)
    comando(TESTI.parent / "controlla-numeri.py", copia)
    comando(TESTI / "controlla-testi.py", copia)

    specifica = AREA / "scambi-giro-secco.json"
    salva(specifica, scambi())
    riepiloga.isola(copia, specifica, nome)
    starter_piera = "starter-pino"
    iso = f"iso-{nome}"
    mazzi_iso = [s["id"] for s in scambi()]
    derivata = AREA / f"isolamenti-{nome}.json"
    etichetta = f"starter-{nome}"
    indice_piera = riepiloga.RIFERIMENTI.index(starter_piera)
    prima_di_piera = riepiloga.RIFERIMENTI[:indice_piera]
    riusa_scontri = False
    if da:
        origine = leggi(AREA / f"{da}.json")
        aggiornata = leggi(copia)
        # Nei sei altri isolamenti le leve e le carte di compenso di Piera sono assenti.
        for chiave, valore in origine.items():
            if chiave in ("cards", "characters"):
                id_campo, leve = (("binding", RINFORZI | {piera["basic"]}) if chiave == "cards" else ("id", {piera["id"]}))
                assert [x for x in valore if x[id_campo] not in leve] == [
                    x for x in aggiornata[chiave] if x[id_campo] not in leve
                ], chiave
            else:
                assert valore == aggiornata[chiave], chiave
        banco.misura(shell, "round", iso, derivata, "-Rows", starter_piera,
                     "-Foes", ",".join(riepiloga.RIFERIMENTI[indice_piera:]))
        banco.misura(shell, "round", etichetta, derivata,
                     "-Rows", ",".join((*prima_di_piera, *mazzi_iso)), "-Foes", starter_piera)
        grezzi_iso = [f"iso-{da}", etichetta]
        carte_senza_rinforzi = lambda d: [c for c in d["cards"] if c["binding"] not in RINFORZI]
        riusa_scontri = (origine["characters"] == aggiornata["characters"]
                         and carte_senza_rinforzi(origine) == carte_senza_rinforzi(aggiornata)
                         and all(not RINFORZI & d["cards"].keys()
                                 for d in leggi(GIRO / "ricerca-prima.json")["liste"].values()))
    else:
        banco.misura(shell, "round", iso, derivata, "-Rows", ",".join((starter_piera, *mazzi_iso)))
        banco.misura(shell, "round", etichetta, copia,
                     "-Rows", ",".join(prima_di_piera), "-Foes", starter_piera)
        grezzi_iso = [iso]
    starter(copia, nome, starter_piera, (iso, etichetta))
    riepiloga.guadagni(nome, specifica, nome, grezzi_iso)

    if riusa_scontri:
        shutil.copyfile(EVIDENZE / f"scontri-{da}.json", EVIDENZE / f"scontri-{nome}.json")
    else:
        diretti(shell, copia, nome)


def starter(copia, nome, piera, etichette):
    # I riferimenti esclusa Piera non usano la carta né le sue leve.
    dati = leggi(copia)
    fissi = set(riepiloga.RIFERIMENTI) - {piera}
    for d in dati["decks"]:
        if d["id"] in fissi:
            assert d["character"] != banco.PERSONAGGI["piera"] and not (RINFORZI | {CARTA}) & d["cards"].keys()
    rif_base = "passo-1"
    matrice = riepiloga.matrice(rif_base)
    esiti = [c for e in etichette for c in riepiloga.matrice(e)["celle"]]
    chiave = lambda c: tuple(c[k] for k in ("A", "stileA", "B", "stileB"))
    per_cella = {chiave(c): c for c in esiti}
    matrice["celle"] = [per_cella[chiave(c)] if piera in (c["A"], c["B"]) else c
                         for c in matrice["celle"]]
    matrice["invarianti"]["turniDiGiocatore"] = 2 * sum(c["turniTotali"] for c in matrice["celle"])
    osservazioni = leggi(riepiloga.cartella(rif_base) / "deck-observations.json")
    osservate = {k: v for e in etichette
                 for k, v in leggi(riepiloga.cartella(e) / "deck-observations.json").items()}
    for k in osservazioni:
        if piera in k.split("|"):
            osservazioni[k] = osservate[k]
    cartella = riepiloga.cartella(nome)
    cartella.mkdir()
    salva(cartella / "matrix.json", {k: matrice[k] for k in ("celle", "invarianti", "tettoBound")})
    salva(cartella / "deck-observations.json", osservazioni)
    rif = EVIDENZE / "matrice-rif.json"
    shutil.copyfile(GIRO / "matrice-rif.json", rif)
    try:
        riepiloga.verifica_starter(nome, nome)
    finally:
        rif.unlink()


def diretti(shell, copia, nome, finalisti=None):
    dati = leggi(copia)
    liste = deepcopy(leggi(GIRO / "ricerca-prima.json")["liste"])
    if finalisti:
        liste["piera"] = finalisti["piera"]
    dati["decks"].extend(liste.values())
    percorso = AREA / f"costruiti-{nome}.json"
    salva(percorso, dati)
    avversari = [d["id"] for k, d in liste.items() if k != "piera"]
    etichetta = f"diretti-{nome}"
    banco.misura(shell, "round", etichetta, percorso, "-Rows", PIERA, "-Foes", ",".join(avversari))
    salva(EVIDENZE / f"scontri-{nome}.json", coppie(etichetta, PIERA, avversari))


def ricerca(shell, nome):
    copia = AREA / f"{nome}.json"
    banco.ricerca(shell, copia, nome, ["piera"])
    precedente = leggi(GIRO / "ricerca-prima.json")["personaggi"]
    riepiloga.finalisti(copia, nome, {"piera"}, precedente)
    evidenze = EVIDENZE / f"ricerca-{nome}.json"
    dati = leggi(evidenze)
    salva(evidenze, dict(liste=dati["liste"], piera=dati["personaggi"]["piera"]))
    diretti(shell, copia, f"{nome}-ricerca", dati["liste"])


def isola_estasi(shell, bozza):
    specifica = AREA / "scambi-estasi.json"
    salva(specifica, [
        dict(id=A, controllo="starter-tossico", carta=GRAPPA,
             tolte={"base.items.PaninoDelKebab": 2}),
        dict(id=B, controllo=A, carta=ESTASI, tolte={"junkie.Cough": 2}),
    ])
    riepiloga.isola(bozza, specifica, "estasi")
    copia = AREA / "isolamenti-estasi.json"
    banco.misura(shell, "round", "estasi", copia, "-Rows", f"{A},{B}")
    riferimenti = riepiloga.RIFERIMENTI
    prima = coppie("estasi", A, riferimenti)
    dopo = coppie("estasi", B, riferimenti)
    confronti = [dict(avversario=b, prima=prima[b], dopo=dopo[b],
                      guadagno=dopo[b]["heur"]["quota"] - prima[b]["heur"]["quota"])
                 for b in riferimenti]
    uso = riepiloga.osservazioni(leggi(copia), [riepiloga.cartella("estasi")],
                                  lambda a, b: a == B)["carte"][ESTASI]
    guadagni = [r["guadagno"] for r in confronti]
    salva(EVIDENZE / "isolamento-estasi.json",
          dict(scambi=leggi(specifica), media=sum(guadagni) / len(guadagni), massimo=max(guadagni),
               uso=uso, confronti=confronti, stili=stili("estasi")))


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    cli.add_argument("--bozza", type=Path, default=banco.BOZZA)
    cli.add_argument("--proroga", type=int, choices=(120,), default=0, help="tetto aggiuntivo per l'ultima prova (D154)")
    sub = cli.add_subparsers(dest="fase", required=True)
    for fase in ("passo0", "passo1", "estasi"):
        sub.add_parser(fase)
    c = sub.add_parser("prova")
    c.add_argument("nome")
    c.add_argument("base", type=int, choices=(10, 8, 6))
    c.add_argument("self_hit", type=int, choices=(0, 5, 10))
    for campo in ("salute", "alcol", "basic"):
        c.add_argument(f"--{campo}", type=int)
    c.add_argument("--da", help="variante con gli stessi parametri della carta, per misurare solo il compenso di Piera")
    c.add_argument("--testata-danno", type=int, help="danno al bersaglio di Testata da ultimo giro (D153)")
    c.add_argument("--testata-self", type=int, choices=(0,), help="toglie il danno a sé di Testata da ultimo giro (D153)")
    c.add_argument("--bancone-alcol", type=int, help="guadagno di L del Bancone (D153)")
    s = sub.add_parser("ricerca")
    s.add_argument("nome")
    args = cli.parse_args()
    banco.BUDGET = 5500 + args.proroga
    AREA.mkdir(parents=True, exist_ok=True)
    shell, bozza = args.shell, args.bozza.resolve()
    if args.fase == "passo0":
        passo0(shell, bozza)
    elif args.fase == "passo1":
        passo1(shell, bozza)
    elif args.fase == "estasi":
        isola_estasi(shell, bozza)
    elif args.fase == "ricerca":
        ricerca(shell, args.nome)
    else:
        prova(shell, bozza, args.nome, args.base, args.self_hit, args.salute, args.alcol, args.basic,
              args.da, args.testata_danno, args.testata_self, args.bancone_alcol)


if __name__ == "__main__":
    main()
