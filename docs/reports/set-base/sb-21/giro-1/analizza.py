"""Estrae quote, guadagni e scostamenti per SB-21 dalle misure in %TEMP%."""
import argparse
import sys

from misura import AREA, EVIDENZE
from prepara import GRAPPA, RIFERIMENTI, SCAMBI_ESTASI, SCAMBI_GRAPPA

sys.path.insert(0, str(EVIDENZE.parents[1] / "sb-20"))
from matrice import aggrega, leggi, quota, salva, starter


PIERA = RIFERIMENTI[3]
NOMI = dict(zip(RIFERIMENTI, ("Spazienzio", "Mara", "Celestina", "Piera", "Beppe", "Sergio", "Duccio")))


def cartella(etichetta):
    return AREA / f"round-sb21g1-{etichetta}"


def gruppi(etichetta):
    matrice = leggi(cartella(etichetta) / "matrix.json")
    assert not any(matrice["invarianti"]["violazioni"].values())
    assert not any(b["viola"] for b in matrice["tettoBound"])
    return aggrega(matrice)


def quota_contro(matrice, mazzo, avversario):
    diretta = matrice.get((mazzo, avversario, "heur"))
    return quota(diretta) if diretta else 100 - quota(matrice[avversario, mazzo, "heur"])


def confronta(matrice, riferimento, mazzo, controllo, stesse_carte=False):
    righe = []
    for avversario in RIFERIMENTI:
        c = matrice[mazzo, avversario, "heur"]
        attuale = quota(c)
        if avversario == controllo:
            prima = 50.0
        elif stesse_carte:
            prima = quota_contro(matrice, controllo, avversario)
        else:
            prima = quota_contro(riferimento, controllo, avversario)
        righe.append(dict(avversario=avversario, quota=attuale, riferimento=prima,
                          guadagno=attuale-prima, patte=100*c["patte"]/c["partite"],
                          turni=c["turniTotali"]/c["partite"], partite=c["partite"],
                          vittorie=c["vittorieA"], sconfitte=c["vittorieB"]))
    media = sum(r["guadagno"] for r in righe) / len(righe)
    massimo = max(righe, key=lambda r: r["guadagno"])
    return dict(mazzo=mazzo, controllo=controllo, media=media, massimo=massimo["guadagno"],
                avversarioMassimo=massimo["avversario"], passa=0 <= media <= 10 and massimo["guadagno"] <= 15,
                confronti=righe)


def riferimenti_estasi(valore):
    prima = gruppi("rif")
    if valore == 18:
        return prima, {}
    dopo = gruppi(f"piera-{valore}-a") | gruppi(f"piera-{valore}-b")
    return prima | dopo, dopo


def uscite(prima, dopo):
    return [dict(a=a, b=b, prima=quota(prima[a, b, g]), dopo=quota(c))
            for (a, b, g), c in dopo.items()
            if g == "heur" and a != b and 35 <= quota(prima[a, b, g]) <= 65 and not 35 <= quota(c) <= 65]


def isolamenti(estasi):
    inizio = gruppi("rif")
    prova_estasi = {}
    for valore in (18, 15, 12, 10):
        riferimento, dopo = riferimenti_estasi(valore)
        matrice = gruppi(f"estasi-{valore}")
        isolati = [confronta(matrice, riferimento, mazzo, controllo)
                   for mazzo, controllo, _, _ in SCAMBI_ESTASI]
        prova_estasi[valore] = dict(isolamenti=isolati, usciteStarter=uscite(inizio, dopo),
                                   piera=[dict(avversario=a, prima=quota_contro(inizio, PIERA, a),
                                               dopo=quota_contro(riferimento, PIERA, a))
                                          for a in NOMI])
    candidati_estasi = [v for v in (15, 12, 10)
                        if not prova_estasi[v]["usciteStarter"] and all(r["passa"] for r in prova_estasi[v]["isolamenti"])]
    scelto = candidati_estasi[0] if candidati_estasi else None
    salva(EVIDENZE / "isolamenti-estasi.json", dict(varianti=prova_estasi, scelto=scelto))
    for v, dati in prova_estasi.items():
        for r in dati["isolamenti"]:
            print(f'{v:2d}  {r["mazzo"]:24}  {r["media"]:+6.2f}  {r["massimo"]:+6.2f}  {r["passa"]}')
        for fuori in dati["usciteStarter"]:
            print("Fuori fascia starter", fuori)
    print("Estasi scelta", scelto)
    if estasi is None:
        return

    assert estasi == (scelto or 18)
    bozza = leggi(cartella("rif") / "draft.json")
    assert all(GRAPPA not in m["cards"] for m in bozza["decks"] if m["id"] in RIFERIMENTI)
    riferimento, _ = riferimenti_estasi(estasi)
    prove_grappa = {}
    for valore in (25, 20, 15):
        matrice = gruppi(f"grappa-{valore}")
        prove_grappa[valore] = [confronta(matrice, riferimento, mazzo, controllo, controllo == "controllo-piera-mezza")
                               for mazzo, controllo, _, _ in SCAMBI_GRAPPA[1:]]
        for r in prove_grappa[valore]:
            print(f'{valore:2d}  {r["mazzo"]:24}  {r["media"]:+6.2f}  {r["massimo"]:+6.2f}  {r["passa"]}')
    scelto = next((v for v in (20, 15) if all(r["passa"] for r in prove_grappa[v])), None)
    salva(EVIDENZE / "isolamenti-grappa.json", dict(estasi=estasi, varianti=prove_grappa, primaVarianteIdonea=scelto))
    print("Prima variante idonea per Grappa", scelto)


def salva_starter():
    starter(cartella("rif"), EVIDENZE / "matrice-starter.json")


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    sub = cli.add_subparsers(dest="fase", required=True)
    iso = sub.add_parser("isolamenti")
    iso.add_argument("--estasi", type=int)
    sub.add_parser("starter")
    args = cli.parse_args()
    if args.fase == "isolamenti":
        isolamenti(args.estasi)
    else:
        salva_starter()
