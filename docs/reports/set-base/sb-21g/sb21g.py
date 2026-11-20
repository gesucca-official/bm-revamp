"""Banco SB-21g. Dalla radice: python -B -X utf8 <script> --shell <pwsh> <fase>."""
import argparse
from collections import defaultdict
import hashlib
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
EVIDENZE = Path(__file__).resolve().parent
RAPPORTI = EVIDENZE.parent
RADICE = EVIDENZE.parents[3]
AREA = RADICE / "server/target/sb-21g"
PRECEDENTE = RADICE / "server/target/sb-21f"
SHA_RIF = "0e56eebbc3aa224cca5ba06fe1997d151fc4c4f6aa2d1f3f87120e2af6aebe81"

sys.path.insert(0, str(RAPPORTI / "sb-21f"))
import sb21f as f

f.AREA = f.banco.AREA = f.riepiloga.AREA = AREA
f.EVIDENZE = f.banco.EVIDENZE = f.riepiloga.EVIDENZE = EVIDENZE
banco, riepiloga = f.banco, f.riepiloga
leggi, salva = f.leggi, f.salva
RIFERIMENTI = f.RIFERIMENTI
FATTORI = {0.25, 0.5, 0.75, 1.25, 1.5, 2}
NON_IMPORTI = {"gui", "priority", "turns", "capacity", "divide", "percent"}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def cella(c):
    return tuple(c[k] for k in ("A", "B", "stileA", "stileB"))


def passo0(shell):
    if digest(banco.BOZZA) != SHA_RIF:
        raise SystemExit("STOP: SHA della bozza SB-21f diverso")
    for fase in ("feasibility", "round"):
        if not (AREA / f"{fase}-sb21g3b-rif-attempt.json").exists():
            banco.misura(shell, fase, "rif", banco.BOZZA)
        tentativo = leggi(AREA / f"{fase}-sb21g3b-rif-attempt.json")
        assert tentativo["exit"] == 0 and tentativo["wallSeconds"] > 0
    rapida = AREA / "feasibility-sb21g3b-rif"
    storico_rapida = PRECEDENTE / "feasibility-sb21g3b-rapida-base"
    file_rapida = ("matrix.json", "matrix.md", "draft.json", "deck-observations.json", "in-play.json")
    impronte = {file: digest(rapida / file) for file in file_rapida}
    assert all(sha == digest(storico_rapida / file) for file, sha in impronte.items())
    corrente = riepiloga.matrice("rif")
    dir_corrente = riepiloga.cartella("rif")
    dir_storica = PRECEDENTE / "round-sb21g3b-testata35-h79"
    storico = leggi(dir_storica / "matrix.json")
    assert corrente["intestazione"]["sha256"] == SHA_RIF
    assert corrente["invarianti"]["partite"] == 403200
    assert {cella(c): c for c in corrente["celle"]} == {cella(c): c for c in storico["celle"]}
    assert leggi(dir_corrente / "deck-observations.json") == leggi(dir_storica / "deck-observations.json")
    for lato in ("a", "b"):
        parziale = leggi(PRECEDENTE / f"round-sb21g3b-testata35-h79-{lato}" / "matrix.json")
        assert corrente["tettoBound"] == parziale["tettoBound"]
    assert digest(dir_corrente / "draft.json") == impronte["draft.json"]
    riepiloga.verifica_starter("rif", "rif")
    atteso = leggi(RAPPORTI / "sb-21f/verifica-starter-testata35-h79.json")
    verifica = leggi(EVIDENZE / "verifica-starter-rif.json")
    assert verifica["aggregate"]["dopo"] == atteso["aggregate"]["dopo"]
    assert verifica["fuoriObiettivo"] == atteso["fuoriObiettivo"]
    salva(EVIDENZE / "passo-0.json", dict(bozza=SHA_RIF, fattibilita=impronte,
          rifPartite=403200, rifCelleIdentiche=len(corrente["celle"]), rifOsservazioniIdentiche=True,
          rifBoundIdentiche=True, rifImpronte={file: digest(dir_corrente / file) for file in file_rapida}))
    banco.tempi()


def numeri(x, percorso=()):
    if isinstance(x, dict):
        for k, v in x.items():
            if k not in NON_IMPORTI:
                yield from numeri(v, (*percorso, k))
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from numeri(v, (*percorso, str(i)))
    elif type(x) in (int, float):
        yield ".".join(percorso), x


def brutti(dati):
    for scheda in dati["characters"] + dati["cards"]:
        binding = scheda.get("binding", scheda.get("id"))
        for campo, n in numeri(scheda):
            if campo.split(".")[-1] == "factor":
                fuori = n not in FATTORI
            else:
                fuori = type(n) is float or abs(n) in (7, 9) or abs(n) >= 10 and abs(n) % 10 in (1, 3, 7, 9)
            if fuori:
                yield binding, campo, n


def modifiche_d158(mara, piera, bancone):
    return [
        ("base.character.Mara", "resources.HEALTH", mara),
        ("base.character.Pino", "resources.HEALTH", piera),
        *(("base.mara.Sgommata", f"target.1.steps.{i}.factor", 0.75) for i in range(3)),
        ("base.com.Spintone", "target.0.amount", 6),
        ("base.tossico.bound.RaschiareIlFondo", "self.0.amount", 6),
        ("junkie.LethalHeroinDose", "target.0.amount.base", 6),
        ("base.cesira.LoMettoInConto", "self.0.amount", 6),
        ("base.rocco.TestaDura", "cost.HEALTH", 35),
        ("base.pino.IlBanconeRegge", "self.0.factor", bancone),
    ]


def schede(dati):
    return {**f.carte(dati), **{c["id"]: c for c in dati["characters"]}}


def copia(bozza, nome, modifiche):
    dati = leggi(bozza)
    per_binding = schede(dati)
    differenze = []
    status = {}
    for binding, campo, valore in modifiche:
        sezione = per_binding[binding]
        *percorso, chiave = campo.split(".")
        for chiave_parziale in percorso:
            sezione = sezione[int(chiave_parziale)] if isinstance(sezione, list) else sezione[chiave_parziale]
        if isinstance(sezione, list):
            chiave = int(chiave)
        prima = sezione[chiave]
        assert prima != valore, (binding, campo, valore)
        differenze.append(dict(binding=binding, campo=campo, prima=prima, dopo=valore))
        sezione[chiave] = valore
        if chiave == "factor" and "description" in sezione:
            descrizione = sezione["description"]
            sezione["description"] = re.sub(rf"x{re.escape(str(prima))}\b", f"x{valore}", descrizione)
            status[binding, campo] = (sezione["property"], descrizione, sezione["description"])
    assert not (residui := list(brutti(dati))), residui
    destinazione = AREA / f"{nome}.json"
    # Conserva la formattazione della bozza tranne nei valori modificati.
    testo = bozza.read_text(encoding="utf-8")
    for binding in dict.fromkeys(b for b, _, _ in modifiche):
        # Il primo e l'ultimo token JSON della scheda delimitano il blocco originale.
        chiave_id = "binding" if "binding" in per_binding[binding] else "id"
        marcatore = f'"{chiave_id}": "{binding}"'
        inizio = testo.rindex("{", 0, testo.index(marcatore) + 1)
        _, lunghezza = json.JSONDecoder().raw_decode(testo[inizio:])
        blocco = testo[inizio:inizio + lunghezza]
        for d in (d for d in differenze if d["binding"] == binding):
            percorso = d["campo"]
            campo = percorso.rsplit(".", 1)[-1]
            prima, dopo = d["prima"], d["dopo"]
            campo_json = rf'"{re.escape(campo)}"\s*:\s*'
            if (binding, percorso) in status:
                proprieta, descrizione, aggiornata = status[binding, percorso]
                campo_json = rf'"property"\s*:\s*"{proprieta}"\s*,\s*' + campo_json
                blocco = blocco.replace(json.dumps(descrizione, ensure_ascii=False),
                                        json.dumps(aggiornata, ensure_ascii=False))
            pattern = rf'({campo_json}){re.escape(str(prima))}(?=[\s,}}\]])'
            blocco, sostituzioni = re.subn(pattern, lambda m: m[1] + str(dopo), blocco)
            assert sostituzioni == 1, d
        testo = testo[:inizio] + blocco + testo[inizio + lunghezza:]
    assert json.loads(testo) == dati, differenze
    destinazione.write_text(testo, encoding="utf-8", newline="\n")
    f.controlli(destinazione)
    salva(AREA / f"{nome}-modifiche.json", differenze)
    return destinazione


def coppie_da_misurare(bozza, modifiche):
    dati = leggi(bozza)
    personaggi = {c["id"]: c["basic"] for c in dati["characters"]}
    perimetro = {b for b, _, _ in modifiche}
    mazzi = {}
    for m in dati["decks"]:
        if m["id"] in RIFERIMENTI:
            bindings = {m["character"], personaggi[m["character"]], m["lastResort"], *m["bound"], *m["cards"]}
            mazzi[m["id"]] = sorted(bindings & perimetro)
    gruppi = defaultdict(list)
    riuso = []
    for i, a in enumerate(RIFERIMENTI):
        foes = tuple(b for b in RIFERIMENTI[i:] if mazzi[a] or mazzi[b])
        if foes:
            gruppi[foes].append(a)
        riuso.extend((a, b) for b in RIFERIMENTI[i:] if not mazzi[a] and not mazzi[b])
    return gruppi, mazzi, riuso


def starter(shell, bozza, nome, rif, modifiche):
    candidata = copia(bozza, nome, modifiche)
    gruppi, mazzi, riuso = coppie_da_misurare(bozza, modifiche)
    assert gruppi
    if not riuso:
        banco.misura(shell, "round", nome, candidata)
        matrice = riepiloga.matrice(nome)
    else:
        matrice = riepiloga.matrice(rif)
        osservazioni = leggi(riepiloga.cartella(rif) / "deck-observations.json")
        nuove = {}
        for i, (foes, rows) in enumerate(gruppi.items(), 1):
            braccio = f"{nome}-{i}"
            banco.misura(shell, "round", braccio, candidata, "-Rows", ",".join(rows), "-Foes", ",".join(foes))
            parte = riepiloga.matrice(braccio)
            for c in parte["celle"]:
                assert c["A"] in rows and c["B"] in foes and cella(c) not in nuove
                nuove[cella(c)] = c
            osservazioni.update(leggi(riepiloga.cartella(braccio) / "deck-observations.json"))
            matrice["tettoBound"] = parte["tettoBound"]
        rifatte = {(c["A"], c["B"]) for c in nuove.values()}
        assert not rifatte & set(map(tuple, riuso)) and len(rifatte) + len(riuso) == 28
        for c in matrice["celle"]:
            assert (cella(c) in nuove) == ((c["A"], c["B"]) in rifatte)
        matrice["celle"] = [nuove.pop(cella(c), c) for c in matrice["celle"]]
        assert not nuove
        matrice["invarianti"]["turniDiGiocatore"] = 2 * sum(c["turniTotali"] for c in matrice["celle"])
        matrice["intestazione"].update(bozza=str(candidata), sha256=digest(candidata))
        destinazione = riepiloga.cartella(nome)
        destinazione.mkdir()
        salva(destinazione / "matrix.json", matrice)
        salva(destinazione / "deck-observations.json", osservazioni)
    riepiloga.verifica_starter(nome, nome)
    salva(EVIDENZE / f"prove-{nome}.json", dict(base=rif, sha256=digest(candidata),
          modifiche=leggi(AREA / f"{nome}-modifiche.json"), dipendenzeMazzi=mazzi, coppieRiusate=riuso,
          bound={b["bound"]: b["massimo"] for b in matrice["tettoBound"]}))


def isolamenti(shell, bozza, rif):
    CARTA, ESTASI = f.CARTA, f.ESTASI
    GIRO = f.GIRO
    scambi = [s for s in leggi(GIRO / "scambi.json") if s["carta"] == CARTA]
    specifica = AREA / "scambi-giro-secco.json"
    salva(specifica, scambi)
    riepiloga.isola(bozza, specifica, "giro-secco")
    f.controlli(AREA / "isolamenti-giro-secco.json")
    copia = AREA / "isolamenti-giro-secco.json"
    banco.misura(shell, "round", "giro-secco", copia, "-Rows", ",".join(s["id"] for s in scambi))
    riepiloga.guadagni(rif, specifica, "giro-secco", ["giro-secco"])
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
    f.controlli(AREA / "isolamenti-estasi.json")
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


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    cli.add_argument("--bozza", type=Path, default=banco.BOZZA)
    sub = cli.add_subparsers(dest="fase", required=True)
    sub.add_parser("passo0")
    iniziale = sub.add_parser("d158")
    iniziale.add_argument("nome")
    iniziale.add_argument("mara", type=int)
    iniziale.add_argument("piera", type=int)
    iniziale.add_argument("bancone", type=float)
    prova = sub.add_parser("starter")
    prova.add_argument("nome")
    prova.add_argument("rif")
    prova.add_argument("modifiche", nargs="+")
    for fase in ("isolamenti", "costruiti"):
        sub.add_parser(fase).add_argument("nome")
    args = cli.parse_args()
    AREA.mkdir(parents=True, exist_ok=True)
    if args.fase == "passo0":
        passo0(args.shell)
    elif args.fase == "d158":
        starter(args.shell, args.bozza, args.nome, "rif", modifiche_d158(args.mara, args.piera, args.bancone))
    elif args.fase == "starter":
        modifiche = [(b, p, float(v) if "." in v else int(v))
                     for b, p, v in (x.split(":") for x in args.modifiche)]
        starter(args.shell, args.bozza, args.nome, args.rif, modifiche)
    elif args.fase == "isolamenti":
        isolamenti(args.shell, args.bozza, args.nome)
    elif args.fase == "costruiti":
        f.costruiti(args.shell, args.bozza, args.nome, None)


if __name__ == "__main__":
    main()
