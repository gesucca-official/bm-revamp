"""Banco SB-21h Fase B (D159, D160). Dalla radice: python -B -X utf8 <script> --shell <pwsh> <fase> ...

Budget di banco 9.000 s (D160 (4)), contato dai file *-attempt.json in server/target/sb-21h-b; le verifiche sono fuori budget.
Il vecchio tetto delle bound (D33/D36) e' superato da D159: qui resta solo diagnostica, non ferma la misura.
"""
import argparse
import hashlib
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
EVID = Path(__file__).resolve().parent
RAPPORTI = EVID.parents[1]
ROOT = EVID.parents[4]
AREA = ROOT / "server/target/sb-21h-b"
SHA_G = "bb182da96a63c958fe8cddd55fb966329258e749b57742d17a229321950f91be"

sys.path.insert(0, str(RAPPORTI / "sb-21g"))
sys.path.insert(0, str(ROOT / "docs/design/set-base/testi"))
import sb21g as g  # noqa: E402

f, b, r = g.f, g.banco, g.riepiloga
for mod in (g, f, b, r):
    mod.AREA = AREA
    mod.EVIDENZE = EVID
b.BUDGET = 9000
# Da qui in poi le misure usano la copia del lanciatore SB-19 con -Seed (identica col seme predefinito): run.ps1 e search.ps1 qui.
b.LANCIO = EVID
leggi, salva, digest = b.leggi, b.salva, g.digest
RIF = r.RIFERIMENTI


def matrice(etichetta):
    """Come riepiloga.matrice, ma il tetto D33/D36 e' solo diagnostica (D159)."""
    dati = leggi(r.cartella(etichetta) / "matrix.json")
    if any(dati["invarianti"]["violazioni"].values()):
        raise SystemExit(f"STOP 2: invarianti in {etichetta}")
    return dati


r.matrice = matrice
f.riepiloga.matrice = matrice


def passo0(shell):
    if digest(b.BOZZA) != SHA_G:
        raise SystemExit("STOP: la bozza non e' quella consegnata da SB-21g")
    copia = AREA / "rif.json"
    copia.write_bytes(b.BOZZA.read_bytes())
    for fase in ("feasibility", "round"):
        if not (AREA / f"{fase}-sb21g3b-rif-attempt.json").exists():
            b.misura(shell, fase, "rif", copia)
    fatt = leggi(AREA / "feasibility-sb21g3b-rif/matrix.json")
    assert fatt["invarianti"]["partite"] == 16128 and not any(fatt["invarianti"]["violazioni"].values())
    r.starter(r.cartella("rif"), EVID / "matrice-rif.json")
    nuova = leggi(EVID / "matrice-rif.json")
    storica = leggi(RAPPORTI / "sb-21g/matrice-h.json")
    identica = nuova == storica
    salva(EVID / "passo-0.json", dict(
        bozza=SHA_G, fattibilitaPartite=16128,
        fattibilita={x: digest(AREA / "feasibility-sb21g3b-rif" / x)
                     for x in ("matrix.json", "matrix.md", "draft.json", "deck-observations.json", "in-play.json")},
        rifPartite=nuova["invarianti"]["partite"], rifIdenticaAllaConsegnaSb21g=identica,
        rif={x: digest(r.cartella("rif") / x) for x in ("matrix.json", "matrix.md", "draft.json", "deck-observations.json")}))
    if not identica:
        raise SystemExit("STOP 2: Rif diverso dalla matrice consegnata da SB-21g")
    b.tempi()


import copy  # noqa: E402
import bound  # noqa: E402

NOMI = ["spazienzio", "mara", "celestina", "piera", "beppe", "sergio", "duccio"]
# Slot (a), (b), (c) per personaggio, nell'ordine di RIF.
SLOT = [("SPA-BO2", "SPA-BO1", "SPA-BO3"), ("MAR-BO1", "MAR-BO2", "MAR-BO3"), ("TOS-BO1", "TOS-BO2", "TOS-BO3"),
        ("PIN-BO2", "PIN-BO1", "PIN-BO3"), ("GIG-BO2", "GIG-BO1", "GIG-BO3"), ("CES-BO2", "CES-BO3", "CES-BO1"),
        ("ROC-BO1", "ROC-BO3", "ROC-BO2")]
RIGHE = ("a", "b", "c", "ab", "null")


def mods(argomenti):
    out = []
    for x in argomenti:
        bnd, campo, v = x.split(":")
        out.append((bnd, campo, v if v == "del" else float(v) if "." in v else int(v)))
    return out


def candidata(nome, modifiche, base=None):
    """La bozza con le bound di D160 (e le modifiche), testi rigenerati e controlli D143: AREA/<nome>.json."""
    dest = AREA / f"{nome}.json"
    bound.costruisci(base or (AREA / "rif.json"), dest, modifiche)
    f.controlli(dest)
    salva(AREA / f"{nome}-modifiche.json", [list(m) for m in modifiche])
    return dest


def varianti(d, specifiche):
    """Copie di misura di una bound con altri valori: chi:etichetta:slot(a|b|c):campo=valore[,campo=valore].
    La copia ha binding probe.var.<chi>.<etichetta>, testi rigenerati (i bot leggono i guadagni stampati) e il mazzo
    h-<chi>-<etichetta> = mazzo della riga di quello slot con la copia al posto della bound."""
    from testi_stampati import genera, slot_di
    nomi = {c["binding"]: c["gui"]["name"] for c in d["cards"]}
    per_slot = {c["gui"]["description"].split(" ")[0]: c for c in d["cards"]}
    mazzi = {m["id"]: m for m in d["decks"]}
    for spec in specifiche:
        chi, tag, lettera, campi = spec.split(":", 3)
        i = NOMI.index(chi)
        orig = per_slot[SLOT[i]["abc".index(lettera)]]
        c = copy.deepcopy(orig)
        c["binding"] = f"probe.var.{chi}.{tag}"
        for cv in campi.split(","):
            campo, v = cv.split("=")
            *perc, k = campo.split(".")
            sede = c
            for x in perc:
                sede = sede[int(x)] if isinstance(sede, list) else sede[x]
            sede[int(k) if isinstance(sede, list) else k] = float(v) if "." in v else int(v)
        c["gui"].update(genera(c, slot_di(c["gui"]), nomi))
        c["gui"]["name"] = f"{orig['gui']['name']} {tag}"  # la mano cerca le carte per nome: ogni copia ha il suo
        d["cards"].append(c)
        riga = copy.deepcopy(mazzi[f"h-{chi}-{lettera}"])
        riga["id"] = f"h-{chi}-{tag}"
        riga["bound"] = [c["binding"] if x == orig["binding"] else x for x in riga["bound"]]
        assert c["binding"] in riga["bound"] and riga["id"] not in mazzi
        d["decks"].append(riga)


def sonde(nome, modifiche, specifiche=()):
    """Copia di misura: per ogni personaggio due bound nulle (copie strumentali di (a) e (b): ruolo NONE, se', priorita' 0,
    nessun effetto, come Listino.nullBound) e i mazzi h-<chi>-{a,b,c,ab,null} dallo starter di riferimento."""
    src = candidata(nome, modifiche)
    d = leggi(src)
    per_slot = {c["gui"]["description"].split(" ")[0]: c for c in d["cards"]}
    for i, chi in enumerate(NOMI):
        a, z, c = (per_slot[x] for x in SLOT[i])
        nulle = []
        for j, carta in enumerate((a, z)):
            n = copy.deepcopy(carta)
            n["binding"] = f"probe.null.{chi}{j}"
            n.pop("self", None)
            n.pop("target", None)
            n["priority"] = 0
            n["targets"] = ["SELF"]
            n["gui"].update(name=f"Nulla {chi}{j}", description="Bound nulla strumentale", role="NONE", gains="—", damage="—",
                            damageAmount="—")
            d["cards"].append(n)
            nulle.append(n["binding"])
        mazzo = next(m for m in d["decks"] if m["id"] == RIF[i])
        for tag, bs in (("a", [a["binding"], nulle[1]]), ("b", [nulle[0], z["binding"]]), ("c", [c["binding"], nulle[1]]),
                        ("ab", [a["binding"], z["binding"]]), ("null", nulle)):
            nd = copy.deepcopy(mazzo)
            nd["id"] = f"h-{chi}-{tag}"
            nd["bound"] = bs
            d["decks"].append(nd)
    varianti(d, specifiche)
    dest = AREA / f"sonde-{nome}.json"
    salva(dest, d)
    return dest


def misura_bound(shell, nome, chi, seme=None, righe=RIGHE):
    pref = f"h-{chi}-"
    etichetta = f"b-{nome}-{chi}" + (f"-s{seme}" if seme else "")
    opzioni = ["-Rows", ",".join(pref + x for x in righe), "-Foes", pref + "null"]
    if seme:
        opzioni += ["-Seed", str(seme)]
    b.misura(shell, "round", etichetta, AREA / f"sonde-{nome}.json", *opzioni)
    return etichetta


def esito_bound(etichetta, chi, righe=RIGHE):
    gruppi = r.aggrega(matrice(etichetta))
    obs = leggi(r.cartella(etichetta) / "deck-observations.json")
    out = {}
    for tag in righe:
        a = f"h-{chi}-{tag}"
        e = r.esito(gruppi, a, f"h-{chi}-null")
        ob = obs.get(f"{a}|h-{chi}-null|heur", {})
        giocate = {k[5:-6]: n / ob["games"] for k, n in ob.items()
                   if k.startswith("card/") and k.endswith("/plays") and ob.get("games")
                   and ("bound" in k or "character.Little" in k or "character.Pathetic" in k or "character.Rotten" in k)}
        com = r.esito(gruppi, a, f"h-{chi}-null", "com")
        out[tag] = dict(quota=e["quota"], patte=e["percentualePatte"], turni=e["turni"], partite=e["partite"],
                        quotaCom=com["quota"], giocatePerPosto=giocate)
    for tag in righe:
        if tag != "null":
            out[tag]["delta"] = out[tag]["quota"] - out["null"]["quota"]
    return out


def controllo_d149(nome):
    """D149 (4) contro la consegna di SB-21g (matrice-rif.json qui = matrice-h.json di SB-21g, passo 0): tutte le coppie nel
    35-65%, fuori obiettivo al piu' 2 (quelle di SB-21g), patte e durate aggregate non peggiori, per coppia non piu' lontane dalle
    fasce (patte 0-10%, turni 6-12) di SB-21g; in piu' i limiti di D95 (patte <= 10%, durata <= 12 fuori dagli specchi)."""
    r.verifica_starter(nome, nome)
    v = leggi(EVID / f"verifica-starter-{nome}.json")
    dopo = [x for x in leggi(EVID / f"matrice-{nome}.json")["coppie"] if x["gruppo"] == "heur"]
    d95 = [(x["a"], x["b"]) for x in dopo if x["percentualePatte"] > 10 or (x["a"] != x["b"] and x["turni"] > 12)]
    v["d95"] = d95
    v["passa"] = (not v["fuori35_65"] and len(v["fuoriObiettivo"]) <= 2 and not any(v["regressioni"].values())
                  and all(v["aggregate"]["dopo"][k] <= v["aggregate"]["prima"][k] for k in ("patte", "turni")) and not d95)
    salva(EVID / f"verifica-starter-{nome}.json", v)
    return v


def starter_pieno(shell, nome, modifiche):
    """Bozza con le bound (e le modifiche a bound.py), matrice completa dei sette riferimenti, controllo D149 (4)."""
    dest = candidata(nome, modifiche)
    b.misura(shell, "round", nome, dest)
    return controllo_d149(nome)


def starter_da(shell, nome, rif, modifiche):
    """Ribilanciamento come SB-21g: copia di <rif> con binding:campo:valore, si rimisurano solo le coppie toccate."""
    g.starter(shell, AREA / f"{rif}.json", nome, rif, modifiche)
    return controllo_d149(nome)


def evidenze():
    """Raccoglie in fase-b gli esiti per bound (AREA/esito-*.json) e le modifiche dei candidati (AREA/<nome>-modifiche.json)."""
    esiti = {p.stem[len("esito-"):]: leggi(p) for p in sorted(AREA.glob("esito-*.json"))}
    salva(EVID / "esiti-bound.json", esiti)
    salva(EVID / "candidati.json", {p.stem[:-len("-modifiche")]: leggi(p) for p in sorted(AREA.glob("*-modifiche.json"))})
    return len(esiti)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("--shell", required=True)
    sub = cli.add_subparsers(dest="fase", required=True)
    sub.add_parser("passo0")
    so = sub.add_parser("sonde")
    so.add_argument("nome")
    so.add_argument("modifiche", nargs="*")
    so.add_argument("--varianti", nargs="*", default=[])
    bo = sub.add_parser("bound")
    bo.add_argument("nome")
    bo.add_argument("chi", nargs="+", choices=NOMI)
    bo.add_argument("--seme", type=int)
    bo.add_argument("--righe", default=",".join(RIGHE))
    sp = sub.add_parser("starter")
    sp.add_argument("nome")
    sp.add_argument("modifiche", nargs="*")
    sd = sub.add_parser("starter-da")
    sd.add_argument("nome")
    sd.add_argument("rif")
    sd.add_argument("modifiche", nargs="+")
    sub.add_parser("evidenze")
    es = sub.add_parser("esito")
    es.add_argument("etichetta")
    es.add_argument("chi")
    args = cli.parse_args()
    AREA.mkdir(parents=True, exist_ok=True)
    if args.fase == "passo0":
        passo0(args.shell)
    elif args.fase == "sonde":
        print(sonde(args.nome, mods(args.modifiche), args.varianti))
    elif args.fase == "bound":
        for chi in args.chi:
            et = misura_bound(args.shell, args.nome, chi, args.seme, tuple(args.righe.split(",")))
            esito = esito_bound(et, chi, tuple(args.righe.split(",")))
            salva(AREA / f"esito-{et}.json", esito)
            print(chi, {k: round(v.get("delta", v["quota"]), 2) for k, v in esito.items()}, flush=True)
    elif args.fase == "evidenze":
        print(evidenze())
    elif args.fase == "starter":
        v = starter_pieno(args.shell, args.nome, mods(args.modifiche))
        print(json.dumps({k: v[k] for k in ("passa", "fuori35_65", "fuoriObiettivo", "aggregate", "d95")}, ensure_ascii=False))
    elif args.fase == "starter-da":
        v = starter_da(args.shell, args.nome, args.rif, mods(args.modifiche))
        print(json.dumps({k: v[k] for k in ("passa", "fuori35_65", "fuoriObiettivo", "aggregate", "d95")}, ensure_ascii=False))
    elif args.fase == "esito":
        print(json.dumps(esito_bound(args.etichetta, args.chi), ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
