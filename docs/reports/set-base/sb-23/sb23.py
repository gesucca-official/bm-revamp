"""SB-23, strada B (D164): liste 25/3 dei sette mazzi di riferimento, bozza 25/3 per il banco, analisi 20/2 contro 25/3.

Dalla radice: python -B -X utf8 docs/reports/set-base/sb-23/sb23.py <liste|audit|analizza> ...
  liste    scrive server/src/test/resources/set-base/sb-23/25-3.json e server/target/sb-23/bozza-25-3.json
  audit    ricostruisce le liste e stampa le 35 aggiunte
  analizza <cartella 20-2> <cartella 25-3>   scrive analisi.json in questa cartella
"""
from collections import Counter, defaultdict
import json
import sys
from pathlib import Path

sys.dont_write_bytecode = True
EVID = Path(__file__).resolve().parent
ROOT = EVID.parents[3]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
LISTE = ROOT / "server/src/test/resources/set-base/sb-23/25-3.json"
AREA = ROOT / "server/target/sb-23"
RIF = ("starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi", "prova-sergio", "prova-duccio")
NOMI = dict(zip(RIF, ("Spazienzio", "Mara", "Celestina", "Piera", "Beppe", "Sergio", "Duccio")))
QUOTA = (35, 65)


def leggi(p):
    return json.loads(Path(p).read_text(encoding="utf-8-sig"))


def salva(p, d, indent=1):
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=indent) + "\n", encoding="utf-8", newline="\n")


def aggiunte(bozza, mazzo):
    """Regola SB-16h: 5 carte a 2 copie passano a 3. Fra le carte a 2 copie, nell'ordine della lista del mazzo: le prime 3
    del personaggio, la prima generica (com.* / base.com.*) che sia un'azione, il primo oggetto; se una categoria non basta
    si riempie con le successive carte a 2 copie (oggetti, generiche, personaggio). Raro e tutore restano a 1 copia: non
    sono mai a 2, quindi non sono candidati."""
    carte = {c["binding"]: c for c in bozza["cards"]}
    due = [b for b, n in mazzo["cards"].items() if n == 2]

    def tipo(b):
        if carte[b].get("kind") == "ITEM":
            return "oggetto"
        return "generica" if (".com." in b or b.startswith("com.")) else "personaggio"

    per = {t: [b for b in due if tipo(b) == t] for t in ("personaggio", "generica", "oggetto")}
    scelte = per["personaggio"][:3] + per["generica"][:1] + per["oggetto"][:1]
    for t in ("oggetto", "generica", "personaggio"):
        for b in per[t]:
            if len(scelte) < 5 and b not in scelte:
                scelte.append(b)
    assert len(scelte) == 5, (mazzo["id"], scelte)
    return scelte


def costruisci():
    bozza = leggi(BOZZA)
    assert bozza["rules"]["deckSize"] == 20 and bozza["rules"]["maxCopies"] == 2
    nomi = {c["binding"]: c["gui"]["name"] for c in bozza["cards"]}
    per_mazzo = {m["id"]: m for m in bozza["decks"]}
    mazzi, audit = {}, {}
    for id_ in RIF:
        m = per_mazzo[id_]
        add = aggiunte(bozza, m)
        nuovo = dict(m["cards"])
        for b in add:
            nuovo[b] += 1
        assert sum(nuovo.values()) == 25 and max(nuovo.values()) <= 3
        mazzi[id_] = nuovo
        audit[id_] = [(b, nomi[b], m["cards"][b]) for b in add]
    salva(LISTE, dict(deckSize=25, maxCopies=3, decks=mazzi))
    grande = json.loads(json.dumps(bozza))
    grande["rules"]["deckSize"] = 25
    grande["rules"]["maxCopies"] = 3
    # i mazzi non di riferimento restano a 20 e fallirebbero la convalida a 25: nel file del banco ci sono solo i sette
    grande["decks"] = [dict(m, cards=mazzi[m["id"]]) for m in grande["decks"] if m["id"] in mazzi]
    salva(AREA / "bozza-25-3.json", grande)
    return audit


def audit():
    for id_, add in costruisci().items():
        print(f"{NOMI[id_]}: " + ", ".join(f"{n} ({v}→{v + 1})" for _, n, v in add))


def gruppo(a, b):
    return ("heur", "mixed", "com")[a.endswith("/com") + b.endswith("/com")]


def coppie(cartella):
    g = defaultdict(Counter)
    m = leggi(Path(cartella) / "matrix.json")
    assert not any(m["invarianti"]["violazioni"].values()), cartella
    for x in m["celle"]:
        if gruppo(x["stileA"], x["stileB"]) != "heur":
            continue
        a, b, va, vb = x["A"], x["B"], x["vittorieA"], x["vittorieB"]
        if RIF.index(a) > RIF.index(b):
            a, b, va, vb = b, a, vb, va
        k = g[a, b]
        k["partite"] += x["partite"]; k["va"] += va; k["vb"] += vb; k["patte"] += x["patte"]; k["turni"] += x["turniTotali"]
    return m, g


def criteri(g):
    righe = [dict(a=a, b=b, quota=100 * k["va"] / max(1, k["va"] + k["vb"]), turni=k["turni"] / k["partite"],
                  patte=100 * k["patte"] / k["partite"], partite=k["partite"]) for (a, b), k in g.items()]
    righe.sort(key=lambda r: (RIF.index(r["a"]), RIF.index(r["b"])))
    tot = sum(k["partite"] for k in g.values())
    turni = sum(k["turni"] for k in g.values()) / tot
    patte = 100 * sum(k["patte"] for k in g.values()) / tot
    fuori = [(r["a"], r["b"], round(r["quota"], 1)) for r in righe if r["a"] != r["b"] and not QUOTA[0] <= r["quota"] <= QUOTA[1]]
    specchi = [(r["a"], round(r["turni"], 2), round(r["patte"], 2)) for r in righe if r["a"] == r["b"]]
    viol = dict(quota=fuori, turniMedi=turni > 10, patte=patte > 6,
                specchiTurni=[s for s in specchi if s[1] > 15], specchiPatte=[s for s in specchi if s[2] > 12])
    passa = not fuori and not viol["turniMedi"] and not viol["patte"] and not viol["specchiTurni"] and not viol["specchiPatte"]
    quote = [r["quota"] for r in righe if r["a"] != r["b"]]
    return dict(passa=passa, turni=turni, patte=patte, fuori=fuori, specchi=specchi, violazioni=viol, coppie=righe,
                min=min(quote), max=max(quote))


def misure(c, regolari):
    n = c["games"]
    mano = sum(v for k, v in c.items() if k.startswith("card/") and k.endswith("/handTurns") and k.split("/")[1] in regolari)
    non = sum(v for k, v in c.items() if k.startswith("card/") and k.endswith("/unchosenTurns") and k.split("/")[1] in regolari)
    return dict(postiPartita=n, turni=c["turns"] / n, esauriti=c["exhausted"] / n, annunci=c["announcements"] / n,
                ricerche=c["searchMissed"] + c["searchFound"],
                ricercheFallite=c["searchMissed"] / max(1, c["searchMissed"] + c["searchFound"]),
                finaliLastResort=c["endWithAnyLastResort"] / n, finaliLastResortScelta=c["endWithAnyChosenLastResort"] / n,
                dopoLastResort=c["endAfterAnyLastResort"] / n, regolariNonScelteAPartita=non / n, quotaMano=non / max(1, mano))


def contatori(cartella, regolari):
    oss = leggi(Path(cartella) / "deck-observations.json")
    tot, deck = defaultdict(Counter), defaultdict(Counter)
    for key, c in oss.items():
        d, _, g = key.split("|")
        tot[g].update(c)
        tot["tutti"].update(c)
        if g == "heur":
            deck[d].update(c)
    return dict(gruppi={g: misure(c, regolari) for g, c in tot.items()},
                perMazzoHeur={d: misure(c, regolari) for d, c in deck.items()})


def analizza(c20, c25):
    res = {}
    for nome, cart in (("20-2", c20), ("25-3", c25)):
        m, g = coppie(cart)
        regolari = {b for d in leggi(Path(cart) / "draft.json")["decks"] for b in d["cards"]}
        res[nome] = dict(partite=m["intestazione"]["partite"], secondi=float((Path(cart) / "seconds.txt").read_text()),
                         criteri=criteri(g), contatori=contatori(cart, regolari))
    salva(EVID / "analisi.json", res)
    for nome, r in res.items():
        print(nome, r["partite"], "partite", round(r["secondi"], 1), "s, criteri D161 passa:", r["criteri"]["passa"])
    return res


if __name__ == "__main__":
    cmd = sys.argv[1]
    if cmd == "liste":
        costruisci()
        print("ok")
    elif cmd == "audit":
        audit()
    elif cmd == "analizza":
        analizza(sys.argv[2], sys.argv[3])
