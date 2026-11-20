"""Misure di SB-21f sul banco di SB-19, una alla volta."""
import argparse
import hashlib
from pathlib import Path
import runpy
import subprocess
import sys

sys.dont_write_bytecode = True
EVIDENZE = Path(__file__).resolve().parent
RAPPORTI = EVIDENZE.parent
RADICE = EVIDENZE.parents[3]
GIRO = RAPPORTI / "sb-21/giro-3b"
AREA = RADICE / "server/target/sb-21f"
TESTI = RADICE / "docs/design/set-base/testi"
SHA_RIF = "26670945940bc08bba826da5fc7740392eb3797874bfb80a343ba02ac4a5eb7d"

sys.path.insert(0, str(GIRO))
import misura as banco
import riepiloga
from misura import leggi, salva

banco.AREA = riepiloga.AREA = AREA
banco.EVIDENZE = riepiloga.EVIDENZE = EVIDENZE
banco.BUDGET = 6000


def sha(dati):
    return hashlib.sha256(dati).hexdigest()


def comando(script, *opzioni):
    subprocess.run([sys.executable, "-B", "-X", "utf8", str(script), *map(str, opzioni)],
                   cwd=RADICE, check=True)


def passo0(shell, bozza):
    if sha(bozza.read_bytes()) != SHA_RIF:
        raise SystemExit("STOP: il passo 0 richiede la bozza consegnata da SB-21e")
    banco.misura(shell, "feasibility", "rif", bozza)
    fattibilita = AREA / "feasibility-sb21g3b-rif"
    matrice = leggi(fattibilita / "matrix.json")
    esito = matrice["invarianti"]
    atteso = leggi(RAPPORTI / "sb-21e/passo-0.json")["feasibility"]
    # SB-21e conservò le impronte della fattibilità del D149, con la stessa matrice di partite.
    sha_d149 = b"1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc"
    invariati = {f: sha((fattibilita / f).read_bytes().replace(SHA_RIF.encode("ascii"), sha_d149))
                 for f in ("matrix.json", "matrix.md", "deck-observations.json", "in-play.json")}
    if (esito["partite"] != 16128 or any(esito["violazioni"].values())
            or any(b["viola"] for b in matrice["tettoBound"])
            or matrice["intestazione"]["sha256"] != SHA_RIF
            or any(h != atteso[f] for f, h in invariati.items())):
        raise SystemExit("STOP: fattibilità diversa dal riferimento")
    verifica = dict(bozza=SHA_RIF, fattibilita=esito, fattibilitaImpronte=invariati)
    salva(EVIDENZE / "passo-0.json", verifica)

    banco.misura(shell, "round", "rif", bozza)
    riepiloga.matrice("rif")
    rif = riepiloga.cartella("rif")
    comando(RAPPORTI / "sb-19/analyze.py", "rif", rif, rif / "rif")
    normalizza = runpy.run_path(str(RAPPORTI / "sb-20c/confronta-rif.py"))["byte_misura"]
    files, dati = normalizza(rif, rif / "rif")
    storico = leggi(RAPPORTI / "sb-21e/passo-1.json")
    confronti = {f: [storico["impronte"][f][2], sha(body)] for f, body in files.items()}
    copia = sha((rif / "draft.json").read_bytes())
    assert copia == sha((fattibilita / "draft.json").read_bytes())
    verifica.update(rif=dati, rifImpronte=confronti, copia=copia)
    salva(EVIDENZE / "passo-0.json", verifica)
    if dati != storico["nuovo"] or any(a != b for a, b in confronti.values()):
        raise SystemExit("STOP: Rif diverso dal consegnato di SB-21e")
    riepiloga.verifica_starter("rif", "rif")


CARTA = "base.pino.GoingBerserk"
ESTASI = "base.com.EstasiDaCocaEtilene"
PIERA = "costruito-piera"
RIFERIMENTI = riepiloga.RIFERIMENTI


def carte(dati):
    return {c["binding"]: c for c in dati["cards"]}


def controlli(copia):
    comando(TESTI / "genera-testi.py", "--scrivi", copia)
    comando(TESTI.parent / "controlla-numeri.py", copia)
    comando(TESTI / "controlla-testi.py", copia)


def fissi(bozza):
    testo = bozza.read_text(encoding="utf-8")
    righe = testo.splitlines(keepends=True)
    for binding, prima, dopo in (
        (CARTA, '"perAlcohol": 2', '"perAlcohol": 1'),
        (ESTASI, '"amount": 30', '"amount": 40'),
    ):
        indice, = (i for i, r in enumerate(righe) if f'"binding": "{binding}"' in r)
        assert righe[indice].count(prima) == 1, righe[indice]
        righe[indice] = righe[indice].replace(prima, dopo)
    bozza.write_text("".join(righe), encoding="utf-8", newline="\n")
    controlli(bozza)


def passo1(shell, bozza):
    banco.misura(shell, "round", "d156", bozza)
    riepiloga.verifica_starter("d156", "d156")

    scambi = [s for s in leggi(GIRO / "scambi.json") if s["carta"] == CARTA]
    specifica = AREA / "scambi-giro-secco.json"
    salva(specifica, scambi)
    riepiloga.isola(bozza, specifica, "giro-secco")
    copia = AREA / "isolamenti-giro-secco.json"
    banco.misura(shell, "round", "giro-secco", copia, "-Rows", ",".join(s["id"] for s in scambi))
    riepiloga.guadagni("d156", specifica, "giro-secco", ["giro-secco"])
    risultati = EVIDENZE / "isolamenti-giro-secco.json"
    righe = leggi(risultati)
    for r in righe:
        r["uso"] = riepiloga.osservazioni(leggi(copia), [riepiloga.cartella("giro-secco")],
                                          lambda a, b: a == r["id"])["carte"][CARTA]
    salva(risultati, righe)

    a, b = "iso-estasi-grappa", "iso-estasi-celestina"
    specifica = AREA / "scambi-estasi.json"
    salva(specifica, [
        dict(id=a, controllo="starter-tossico", carta="base.items.GrappaDellaCasa",
             tolte={"base.items.PaninoDelKebab": 2}),
        dict(id=b, controllo=a, carta=ESTASI, tolte={"junkie.Cough": 2}),
    ])
    riepiloga.isola(bozza, specifica, "estasi")
    copia = AREA / "isolamenti-estasi.json"
    banco.misura(shell, "round", "estasi", copia, "-Rows", f"{a},{b}")
    gruppi = riepiloga.aggrega(riepiloga.matrice("estasi"))
    confronti = []
    for avversario in RIFERIMENTI:
        for gruppo in ("heur", "mixed", "com"):
            prima = riepiloga.esito(gruppi, a, avversario, gruppo)
            dopo = riepiloga.esito(gruppi, b, avversario, gruppo)
            confronti.append(dict(avversario=avversario, gruppo=gruppo, prima=prima, dopo=dopo,
                                  guadagno=dopo["quota"] - prima["quota"]))
    uso = riepiloga.osservazioni(leggi(copia), [riepiloga.cartella("estasi")],
                                 lambda mazzo, foe: mazzo == b)["carte"][ESTASI]
    guadagni = [r["guadagno"] for r in confronti if r["gruppo"] == "heur"]
    salva(EVIDENZE / "isolamento-estasi.json", dict(scambi=leggi(specifica),
          media=sum(guadagni) / len(guadagni), massimo=max(guadagni), uso=uso, confronti=confronti))


def candidato(bozza, nome, modifiche):
    dati = leggi(bozza)
    schede = {**carte(dati), **{c["id"]: c for c in dati["characters"]}}
    for binding, campo, valore in modifiche:
        percorso = campo.split(".")
        sezione = schede[binding]
        for chiave in percorso[:-1]:
            sezione = sezione[int(chiave)] if isinstance(sezione, list) else sezione[chiave]
        chiave = percorso[-1]
        if isinstance(sezione, list):
            chiave = int(chiave)
        assert sezione[chiave] != valore
        sezione[chiave] = valore
    copia = AREA / f"{nome}.json"
    salva(copia, dati)
    controlli(copia)
    salva(AREA / f"{nome}-modifiche.json", modifiche)
    return copia


def matrice_parziale(shell, bozza, nome, rif, mazzo, ordine, avversari):
    # Conserva il lato A/B della matrice di riferimento, oltre all'alternanza del primo posto.
    i = ordine.index(mazzo)
    prima = [m for m in ordine[:i] if m in avversari]
    dopo = [m for m in ordine[i:] if m in avversari]
    etichette = []
    for suffisso, righe, bersagli in (("a", [mazzo], dopo), ("b", prima, [mazzo])):
        if not righe or not bersagli:
            continue
        prova = f"{nome}-{suffisso}"
        banco.misura(shell, "round", prova, bozza, "-Rows", ",".join(righe), "-Foes", ",".join(bersagli))
        etichette.append(prova)
    if rif is None:
        return etichette
    matrice = riepiloga.matrice(rif)
    osservazioni = leggi(riepiloga.cartella(rif) / "deck-observations.json")
    chiave = lambda c: tuple(c[k] for k in ("A", "stileA", "B", "stileB"))
    da_sostituire = {}
    for e in etichette:
        da_sostituire.update({chiave(c): c for c in riepiloga.matrice(e)["celle"]})
        osservazioni.update(leggi(riepiloga.cartella(e) / "deck-observations.json"))
    matrice["celle"] = [da_sostituire.pop(chiave(c), c) for c in matrice["celle"]]
    assert not da_sostituire
    matrice["invarianti"]["turniDiGiocatore"] = 2 * sum(c["turniTotali"] for c in matrice["celle"])
    destinazione = riepiloga.cartella(nome)
    destinazione.mkdir()
    salva(destinazione / "matrix.json", matrice)
    salva(destinazione / "deck-observations.json", osservazioni)
    return [nome]


def starter(shell, bozza, nome, rif, mazzo, modifiche):
    copia = candidato(bozza, nome, modifiche)
    perimetro = {modifica[0] for modifica in modifiche}
    dati = leggi(bozza)
    personaggi = {c["id"]: c["basic"] for c in dati["characters"]}
    for d in dati["decks"]:
        if d["id"] in RIFERIMENTI and d["id"] != mazzo:
            bindings = {d["character"], personaggi[d["character"]], d["lastResort"], *d["bound"], *d["cards"]}
            assert not bindings & perimetro, d["id"]
    matrice_parziale(shell, copia, nome, rif, mazzo, RIFERIMENTI, RIFERIMENTI)
    riepiloga.verifica_starter(nome, nome)


def costruiti(shell, bozza, nome, precedente):
    if precedente:
        base = leggi(EVIDENZE / f"ricerca-{precedente}.json")["personaggi"]
        personaggi = ["piera"]
    else:
        base = {}
        personaggi = list(banco.PERSONAGGI)
    banco.ricerca(shell, bozza, nome, personaggi)
    riepiloga.finalisti(bozza, nome, set(personaggi), base)
    copia = AREA / f"costruiti-{nome}.json"
    if precedente:
        duelli_piera(shell, copia, nome)
    else:
        banco.misura(shell, "round", f"diretti-{nome}", copia, "-Rows", ",".join(riepiloga.COSTRUITI),
                     "-Foes", ",".join((*riepiloga.COSTRUITI, *riepiloga.STARTER)))
        riepiloga.scontri(nome, [f"diretti-{nome}"])


def duelli_piera(shell, copia, nome):
    avversari = [c for c in riepiloga.COSTRUITI if c != PIERA]
    etichette = matrice_parziale(shell, copia, f"diretti-{nome}", None, PIERA,
                                 riepiloga.COSTRUITI, avversari)
    gruppi = {}
    for e in etichette:
        gruppi.update(riepiloga.aggrega(riepiloga.matrice(e)))
    salva(EVIDENZE / f"scontri-piera-{nome}.json",
          [riepiloga.esito(gruppi, PIERA, c, g) for c in avversari for g in ("heur", "mixed", "com")])


IMPORTI_JAVA = {
    "alcohol", "alertnessFromTarget", "alertnessToTarget", "base", "hitDamage",
    "maxDamage", "perItem", "perPlay", "perPlaySelf", "poison", "selfHit", "toxicity",
}


def arrotonda(bozza):
    dati = leggi(bozza)
    modifiche = []

    def numero(mappa, chiave, percorso):
        prima = mappa[chiave]
        assert type(prima) is int, percorso
        valore = abs(prima)
        dopo = 2 * (valore // 2) if valore < 20 else 5 * ((valore + 2) // 5)
        if prima < 0:
            dopo = -dopo
        if prima != dopo:
            mappa[chiave] = dopo
            modifiche.append([f"{percorso}.{chiave}", prima, dopo])

    def mappa_importi(mappa, percorso):
        for chiave in mappa:
            numero(mappa, chiave, percorso)

    def effetti(lista, percorso):
        for i, effetto in enumerate(lista):
            qui = f"{percorso}.{i}"
            amount = effetto.get("amount")
            if isinstance(amount, int):
                numero(effetto, "amount", qui)
            elif isinstance(amount, dict):
                for chiave in ("base", "perPlay", "cap"):
                    if chiave in amount:
                        numero(amount, chiave, f"{qui}.amount")
            for chiave in ("foundGains", "missedGains"):
                if chiave in effetto:
                    mappa_importi(effetto[chiave], f"{qui}.{chiave}")
            for chiave in ("steps", "seHai"):
                effetti(effetto.get(chiave, []), f"{qui}.{chiave}")

    for personaggio in dati["characters"]:
        mappa_importi(personaggio["resources"], f"{personaggio['id']}.resources")
    for carta in dati["cards"]:
        binding = carta["binding"]
        mappa_importi(carta.get("cost", {}), f"{binding}.cost")
        params = carta.get("params", {})
        for chiave in params:
            if chiave in IMPORTI_JAVA:
                numero(params, chiave, f"{binding}.params")
        for chiave in ("self", "target", "inPlay"):
            effetti(carta.get(chiave, []), f"{binding}.{chiave}")

    assert carte(leggi(bozza))[CARTA] == carte(dati)[CARTA]
    assert carte(leggi(bozza))[ESTASI] == carte(dati)[ESTASI]
    copia = AREA / "arrotondata.json"
    salva(copia, dati)
    controlli(copia)
    salva(EVIDENZE / "arrotondamenti.json", dict(
        bozzaOrigine=sha(bozza.read_bytes()), bozzaCopia=sha(copia.read_bytes()), modifiche=modifiche))


def misura_arrotondata(shell, bozza):
    copia = AREA / "arrotondata.json"
    for nome, percorso in (("rapida-base", bozza), ("rapida-arrotondata", copia)):
        banco.misura(shell, "feasibility", nome, percorso)
        riepiloga.starter(AREA / f"feasibility-sb21g3b-{nome}", EVIDENZE / f"matrice-{nome}.json")


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    cli.add_argument("--bozza", type=Path, default=banco.BOZZA)
    sub = cli.add_subparsers(dest="fase", required=True)
    for fase in ("passo0", "fissi", "passo1", "arrotonda", "misura-arrotondata"):
        sub.add_parser(fase)
    prova = sub.add_parser("starter")
    prova.add_argument("nome")
    prova.add_argument("rif")
    prova.add_argument("mazzo", choices=RIFERIMENTI)
    prova.add_argument("modifiche", nargs="+", help="binding:campo:valore")
    ricerca = sub.add_parser("costruiti")
    ricerca.add_argument("nome")
    ricerca.add_argument("--precedente")
    args = cli.parse_args()
    AREA.mkdir(parents=True, exist_ok=True)
    bozza = args.bozza.resolve()
    if args.fase == "passo0":
        passo0(args.shell, bozza)
    elif args.fase == "fissi":
        fissi(bozza)
    elif args.fase == "passo1":
        passo1(args.shell, bozza)
    elif args.fase == "arrotonda":
        arrotonda(bozza)
    elif args.fase == "misura-arrotondata":
        misura_arrotondata(args.shell, bozza)
    elif args.fase == "starter":
        modifiche = [(c, k, int(v)) for c, k, v in (m.split(":") for m in args.modifiche)]
        starter(args.shell, bozza, args.nome, args.rif, args.mazzo, modifiche)
    elif args.fase == "costruiti":
        costruiti(args.shell, bozza, args.nome, args.precedente)


if __name__ == "__main__":
    main()
