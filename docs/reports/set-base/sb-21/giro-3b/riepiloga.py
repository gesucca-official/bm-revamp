"""Prepara liste temporanee e riassume le misure di SB-21, giro 3b."""
import argparse
from collections import Counter, defaultdict
from copy import deepcopy
from itertools import combinations
from pathlib import Path
import sys

from misura import AREA, BOZZA, EVIDENZE, PERSONAGGI, leggi, misura, salva

sys.path.insert(0, str(EVIDENZE.parents[1] / "sb-20"))
from matrice import aggrega, quota, starter
from analisi import osservazioni

RIFERIMENTI = (
    "starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino",
    "starter-gigi", "prova-sergio", "prova-duccio",
)
STARTER = RIFERIMENTI[:5]
COSTRUITI = tuple(f"costruito-{nome}" for nome in PERSONAGGI)


def cartella(etichetta):
    return AREA / f"round-sb21g3b-{etichetta}"


def matrice(etichetta):
    dati = leggi(cartella(etichetta) / "matrix.json")
    if any(dati["invarianti"]["violazioni"].values()) or any(b["viola"] for b in dati["tettoBound"]):
        raise SystemExit(f"STOP 2: invarianti o tetto bound in {etichetta}")
    return dati


def quota_convalida(convalida):
    vittorie = sum(c["vittorie"] for c in convalida.values())
    sconfitte = sum(c["sconfitte"] for c in convalida.values())
    return 100 * vittorie / (vittorie + sconfitte)


def finalisti(bozza, passata, ripetuti, precedente):
    dati = leggi(bozza)
    nomi = {c["binding"]: c.get("gui", {}).get("name", c["binding"]) for c in dati["cards"]}
    evidenze = {}
    liste = {}
    for nome, personaggio in PERSONAGGI.items():
        if nome not in ripetuti:
            evidenze[nome] = precedente[nome]
        else:
            ricerca = leggi(AREA / f"sb7-ricerca-sb21g3b-{passata}-{nome}-1.json")
            assert len(ricerca["ricerche"]) == 2
            assert all(r["personaggio"] == personaggio for r in ricerca["ricerche"])
            candidati = [
                (r["partenza"], i, m)
                for r in ricerca["ricerche"]
                for i, m in enumerate(r["mazzi"])
                if m["etichetta"] in ("ultimo", "precedente")
            ]
            partenza, indice, vincitore = max(candidati, key=lambda c: quota_convalida(c[2]["convalida"]))
            evidenze[nome] = dict(ricerca=ricerca, passataRicerca=passata,
                                  partenza=partenza, indice=indice, vincitore=vincitore)
        m = evidenze[nome]["vincitore"]
        liste[nome] = dict(id=f"costruito-{nome}", character=personaggio,
                           bound=m["bound"], lastResort=m["lastResort"], cards=m["carte"])
    dati["decks"].extend(liste.values())
    salva(AREA / f"costruiti-{passata}.json", dati)
    frequenze = Counter(k for m in liste.values() for k in m["cards"])
    righe = []
    for k, n in sorted(frequenze.items(), key=lambda c: (-c[1], c[0])):
        per_mazzo = {nome: m["cards"][k] for nome, m in liste.items() if k in m["cards"]}
        righe.append(dict(carta=k, nome=nomi[k], mazzi=n, copie=sum(per_mazzo.values()), perMazzo=per_mazzo))
    salva(EVIDENZE / f"ricerca-{passata}.json", dict(personaggi=evidenze, frequenze=righe, liste=liste))


def isola(bozza, specifica, passata):
    dati = leggi(bozza)
    mazzi = {m["id"]: m for m in dati["decks"]}
    for s in leggi(specifica):
        nuovo = deepcopy(mazzi[s["controllo"]])
        nuovo["id"] = s["id"]
        carte = nuovo["cards"]
        assert s["carta"] not in carte and sum(s["tolte"].values()) == 2
        for carta, copie in s["tolte"].items():
            assert 0 < copie <= carte[carta]
            carte[carta] -= copie
            if not carte[carta]:
                del carte[carta]
        carte[s["carta"]] = 2
        assert set(carte.values()) <= {1, 2} and sum(carte.values()) == 20
        assert nuovo["id"] not in mazzi
        mazzi[nuovo["id"]] = nuovo
        dati["decks"].append(nuovo)
    salva(AREA / f"isolamenti-{passata}.json", dati)


def misura_isolamenti(shell, bozza, specifica, passata, riferimenti):
    isola(bozza, specifica, passata)
    derivata = AREA / f"isolamenti-{passata}.json"
    prove = leggi(specifica)
    etichette = []
    for i, rif in enumerate(RIFERIMENTI):
        varianti = [r["id"] for r in prove if r["controllo"] == rif]
        if not varianti:
            continue
        gruppi = [(varianti, RIFERIMENTI[i:])]
        if i > 0:
            gruppi.append((RIFERIMENTI[:i], varianti))
        for lato, (righe, avversari) in enumerate(gruppi):
            nome = f"iso-{passata}-{i}-{lato}"
            misura(shell, "round", nome, derivata,
                   "-Rows", ",".join(righe), "-Foes", ",".join(avversari))
            etichette.append(nome)
    guadagni(riferimenti, specifica, passata, etichette)


def esito(gruppi, a, b, gruppo="heur"):
    c = gruppi.get((a, b, gruppo))
    if c is None:
        inversa = gruppi[b, a, gruppo]
        c = dict(inversa, vittorieA=inversa["vittorieB"], vittorieB=inversa["vittorieA"])
    return dict(a=a, b=b, gruppo=gruppo, **c, quota=quota(c), turni=c["turniTotali"]/c["partite"],
                percentualePatte=100*c["patte"]/c["partite"])


def scontri(passata, etichette):
    gruppi, osservati = {}, {}
    invarianti = {}
    stili = defaultdict(Counter)
    for etichetta in etichette:
        dati = matrice(etichetta)
        invarianti[etichetta] = dati["invarianti"]
        gruppi.update(aggrega(dati))
        for cella in dati["celle"]:
            a, b = cella["A"], cella["B"]
            if a == b:
                continue
            for lato, opposto, mazzo, avversario in (("A", "B", a, b), ("B", "A", b, a)):
                if mazzo not in COSTRUITI:
                    continue
                banco = "starter" if avversario in STARTER else "costruiti"
                chiave = (mazzo, banco, cella[f"stile{lato}"], cella[f"stile{opposto}"])
                stili[chiave].update(vittorieA=cella[f"vittorie{lato}"], vittorieB=cella[f"vittorie{opposto}"],
                                     patte=cella["patte"], partite=cella["partite"],
                                     turniTotali=cella["turniTotali"])
        osservati.update(leggi(cartella(etichetta) / "deck-observations.json"))
    costruiti = list(combinations(COSTRUITI, 2)) + [(c, c) for c in COSTRUITI]
    starter_c = [(c, s) for c in COSTRUITI for s in STARTER]
    coppie = [esito(gruppi, a, b, g) for a, b in costruiti + starter_c for g in ("heur", "mixed", "com")]
    for r in coppie:
        a, b, g = (r[k] for k in ("a", "b", "gruppo"))
        lati = [osservati[k] for k in {f"{a}|{b}|{g}", f"{b}|{a}|{g}"}]
        r["esauriti"] = sum(l.get("exhausted", 0) for l in lati)
        r["posti"] = sum(l["games"] for l in lati)
        assert r["posti"] == 2 * r["partite"]
    percentuali = [r["quota"] for r in coppie if r["gruppo"] == "heur" and r["b"] in STARTER]
    metriche = dict(sopra70=sum(q > 70 for q in percentuali), massimo=max(percentuali),
                    eccessoMedio=sum(max(0, q-70) for q in percentuali)/len(percentuali))
    per_mazzo = {}
    for c in COSTRUITI:
        bersagli = {"starter": STARTER, "costruiti": [a for a in COSTRUITI if a != c]}
        per_mazzo[c] = {}
        for banco, avversari in bersagli.items():
            righe = [esito(gruppi, c, a) for a in avversari]
            per_mazzo[c][banco] = dict(
                quota=quota({k: sum(r[k] for r in righe) for k in ("vittorieA", "vittorieB")}),
                minimo=min(righe, key=lambda r: r["quota"])["b"],
                massimo=max(righe, key=lambda r: r["quota"])["b"],
                sfavorevoli=[r["b"] for r in righe if r["quota"] < 50],
                confronti={r["b"]: r["quota"] for r in righe},
            )
    salva(EVIDENZE / f"scontri-{passata}.json",
          dict(metriche=metriche, mazzi=per_mazzo, coppie=coppie, invarianti=invarianti))
    righe_stili = [[*chiave, c["vittorieA"], c["vittorieB"], c["patte"], c["turniTotali"]]
                   for chiave, c in sorted(stili.items())]
    salva(EVIDENZE / f"stili-{passata}.json",
          dict(colonne=["mazzo", "banco", "stile", "stileAvversario", "vittorie", "sconfitte",
                        "patte", "turniTotali"], righe=righe_stili))

    misurata = leggi(cartella(etichette[0]) / "draft.json")
    uso = osservazioni(misurata, [cartella(e) for e in etichette], lambda a, b: a in COSTRUITI)
    uso["controStarter"] = osservazioni(misurata, [cartella(e) for e in etichette],
                                        lambda a, b: a in COSTRUITI and b in STARTER)["carte"]
    salva(EVIDENZE / f"uso-{passata}.json", uso)


def guadagni(riferimenti, specifica, passata, etichette):
    gruppi = {}
    for etichetta in etichette:
        gruppi.update(aggrega(matrice(etichetta)))
    rif = aggrega(matrice(riferimenti))
    righe = []
    for s in leggi(specifica):
        confronti = []
        for a in RIFERIMENTI:
            dopo = esito(gruppi, s["id"], a)
            prima = 50 if a == s["controllo"] else esito(rif, s["controllo"], a)["quota"]
            com_dopo = esito(gruppi, s["id"], a, "com")["quota"]
            com_prima = 50 if a == s["controllo"] else esito(rif, s["controllo"], a, "com")["quota"]
            confronti.append(dict(dopo, riferimento=prima, guadagno=dopo["quota"]-prima,
                                  guadagnoCom=com_dopo-com_prima))
        media = sum(r["guadagno"] for r in confronti) / len(confronti)
        peggiore = max(confronti, key=lambda r: r["guadagno"])
        righe.append(dict(s, media=media, massimo=peggiore["guadagno"], avversarioMassimo=peggiore["b"],
                          mediaCom=sum(r["guadagnoCom"] for r in confronti)/len(confronti),
                          sottoBanda=media < 0, sopraBanda=media > 10 or peggiore["guadagno"] > 15,
                          confronti=confronti))
    salva(EVIDENZE / f"isolamenti-{passata}.json", righe)


def verifica_starter(etichetta, passata):
    matrice(etichetta)
    uscita = EVIDENZE / f"matrice-{passata}.json"
    starter(cartella(etichetta), uscita)
    prima = {(r["a"], r["b"]): r for r in leggi(EVIDENZE / "matrice-rif.json")["coppie"] if r["gruppo"] == "heur"}
    dopo = {(r["a"], r["b"]): r for r in leggi(uscita)["coppie"] if r["gruppo"] == "heur"}
    assert prima.keys() == dopo.keys()

    def scarto(x, minimo, massimo):
        return max(0, minimo-x, x-massimo)

    regressioni = {
        campo: [dict(a=a, b=b, prima=prima[a,b][campo], dopo=r[campo]) for (a, b), r in dopo.items()
                if scarto(r[campo], basso, alto) > scarto(prima[a,b][campo], basso, alto)]
        for campo, basso, alto in (("percentualePatte", 0, 10), ("turni", 6, 12))
    }
    oltre = [(a, b) for (a, b), r in dopo.items() if a != b and not 35 <= r["quota"] <= 65]
    fuori = [(a, b) for (a, b), r in dopo.items() if "quota" in r["fuori"]]
    aggregate = {nome: dict(patte=sum(r["patte"] for r in m.values())/sum(r["partite"] for r in m.values()),
                            turni=sum(r["turniTotali"] for r in m.values())/sum(r["partite"] for r in m.values()))
                 for nome, m in (("prima", prima), ("dopo", dopo))}
    verdi = not oltre and len(fuori) <= 3 and not any(regressioni.values())
    verdi &= all(aggregate["dopo"][k] <= aggregate["prima"][k] for k in ("patte", "turni"))
    salva(EVIDENZE / f"verifica-starter-{passata}.json", dict(passa=verdi, fuori35_65=oltre,
          fuoriObiettivo=fuori, regressioni=regressioni, aggregate=aggregate))


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--bozza", type=Path, default=BOZZA)
    sub = cli.add_subparsers(dest="fase", required=True)
    f = sub.add_parser("finalisti")
    f.add_argument("passata")
    f.add_argument("--precedente")
    f.add_argument("--ripetuti", nargs="*", choices=PERSONAGGI, default=list(PERSONAGGI))
    i = sub.add_parser("isola")
    i.add_argument("passata")
    i.add_argument("specifica", type=Path)
    m = sub.add_parser("misura-iso")
    m.add_argument("passata")
    m.add_argument("specifica", type=Path)
    m.add_argument("riferimenti")
    m.add_argument("--shell", required=True)
    s = sub.add_parser("scontri")
    s.add_argument("passata")
    s.add_argument("etichette", nargs="+")
    g = sub.add_parser("guadagni")
    g.add_argument("passata")
    g.add_argument("riferimenti")
    g.add_argument("specifica", type=Path)
    g.add_argument("etichette", nargs="+")
    r = sub.add_parser("starter")
    r.add_argument("passata")
    r.add_argument("etichetta")
    args = cli.parse_args()
    if args.fase == "finalisti":
        precedente = leggi(EVIDENZE / f"ricerca-{args.precedente}.json")["personaggi"] if args.precedente else {}
        finalisti(args.bozza, args.passata, args.ripetuti, precedente)
    elif args.fase == "isola":
        isola(args.bozza, args.specifica, args.passata)
    elif args.fase == "misura-iso":
        misura_isolamenti(args.shell, args.bozza, args.specifica, args.passata, args.riferimenti)
    elif args.fase == "scontri":
        scontri(args.passata, args.etichette)
    elif args.fase == "guadagni":
        guadagni(args.riferimenti, args.specifica, args.passata, args.etichette)
    else:
        verifica_starter(args.etichetta, args.passata)


if __name__ == "__main__":
    main()
