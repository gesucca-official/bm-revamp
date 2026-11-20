"""SB-21z (D161 (4)): ricerca automatica sulle leve dei personaggi, a 100 semi per cella.

Ogni passo sceglie il personaggio la cui riga pesa di piu' sulla funzione obiettivo (sb21z.costo), prova a muovere una sua leva
(salute o risorsa iniziale, a passi di 5: numeri belli) e rimisura solo la sua riga (7 coppie, specchio compreso): le leve
di un personaggio non toccano le altre coppie. Tiene la mossa solo se l'obiettivo scende. Riprende da cerca-stato.json.

Uso dalla radice: python -B -X utf8 docs/reports/set-base/sb-21z/cerca.py <bozza base> <cartella matrice base>... --secondi N
"""
import argparse
from collections import Counter
import json
from pathlib import Path
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sb21z as z  # noqa: E402

# Leve per personaggio: (id, campo, minimo, massimo). La prima e' la salute.
LEVE = {
    "starter-spazienzio": [("bruiser.character.BigBadBruiser", "resources.HEALTH", 50, 130),
                           ("bruiser.character.BigBadBruiser", "resources.VIOLENCE", 0, 40)],
    "starter-mara": [("base.character.Mara", "resources.HEALTH", 50, 130),
                     ("base.character.Mara", "resources.ALERTNESS", 20, 60)],
    "starter-tossico": [("junkie.character.ToxicJunkie", "resources.HEALTH", 50, 130),
                        ("junkie.character.ToxicJunkie", "resources.TOXICITY", 0, 40)],
    "starter-pino": [("base.character.Pino", "resources.HEALTH", 50, 130),
                     ("base.character.Pino", "resources.ALCOHOL", 0, 40)],
    "starter-gigi": [("base.character.Gigi", "resources.HEALTH", 50, 130),
                     ("base.character.Gigi", "resources.VIOLENCE", 0, 40)],
    "prova-sergio": [("base.character.Cesira", "resources.HEALTH", 50, 130),
                     ("base.character.Cesira", "resources.ALERTNESS", 10, 50)],
    "prova-duccio": [("base.character.Rocco", "resources.HEALTH", 70, 150),
                     ("base.character.Rocco", "resources.ALERTNESS", 5, 40)],
}
STATO = z.AREA / "cerca-stato.json"
LOG = z.AREA / "cerca.log"


def log(*x):
    riga = " ".join(str(v) for v in x)
    print(riga, flush=True)
    with LOG.open("a", encoding="utf-8") as f:
        f.write(riga + "\n")


def tabella_da(cartelle):
    return {f"{a}|{b}": dict(k) for (a, b), k in z.coppie(cartelle).items()}


def esito(tab):
    return z.esito({tuple(k.split("|")): Counter(v) for k, v in tab.items()})


def valore(bozza, ident, campo):
    d = z.leggi(bozza)
    obj = next(c for c in d["characters"] if c["id"] == ident)
    return obj["resources"][campo.split(".")[1]]


def costo_riga(e, mazzo):
    sotto = dict(e, coppie=[r for r in e["coppie"] if mazzo in (r["a"], r["b"])])
    return z.costo(dict(sotto, turni=0, patte=0))


def main():
    cli = argparse.ArgumentParser()
    cli.add_argument("base")
    cli.add_argument("matrici", nargs="+")
    cli.add_argument("--secondi", type=float, default=3600)
    cli.add_argument("--passi", type=int, default=999)
    a = cli.parse_args()
    if STATO.exists():
        st = z.leggi(STATO)
    else:
        tab = {}
        for m in a.matrici:  # le misure successive (righe rimisurate) sostituiscono le coppie, non si sommano
            tab.update(tabella_da([m]))
        st = dict(base=a.base, mods=[], tab=tab, n=0, pendenza=0.8, storia=[], bloccati=[])
        z.salva(STATO, st)
    t0 = time.time()
    while time.time() - t0 < a.secondi and st["n"] < a.passi:
        e = esito(st["tab"])
        log(f"-- passo {st['n']} costo={z.costo(e):.1f} passa={e['passa']} turni={e['turni']:.2f} patte={e['patte']:.2f} "
            f"fuori={e['fuori']}")
        if e["passa"] and all(40 <= r["quota"] <= 60 for r in e["coppie"] if r["a"] != r["b"]):
            log("tutto nel 40-60 e nei criteri: fine")
            break
        def scarto(m):
            return abs(sum(q - 50 for q in z.riga(m, e).values()) / 6)
        # Prima il personaggio piu' lontano dal 50% in media (una coppia storta pesa su due righe: si muove chi sbaglia in media).
        candidati = sorted((m for m in z.RIF if m not in st["bloccati"]), key=lambda m: (-round(scarto(m)), -costo_riga(e, m)))
        if not candidati or (scarto(candidati[0]) < 2 and costo_riga(e, candidati[0]) < 1):
            log("nessun personaggio da muovere: fine")
            break
        mazzo = candidati[0]
        dev = sum(q - 50 for q in z.riga(mazzo, e).values()) / 6
        corrente = dict((m[0] + "|" + m[1], m[2]) for m in st["mods"])
        bozza_ora = z.AREA / "cerca-corrente.json"
        z.applica(st["base"], bozza_ora, [tuple(m) for m in st["mods"]])
        prove = []
        ident, campo, lo, hi = LEVE[mazzo][0]
        h = valore(bozza_ora, ident, campo)
        passo = max(5, min(20, 5 * round(abs(dev) / st["pendenza"] / 5)))
        segno = -1 if dev > 0 else 1
        for p in dict.fromkeys((passo, 5)):
            prove.append((ident, campo, h + segno * p))
        ident2, campo2, lo2, hi2 = LEVE[mazzo][1]
        r = valore(bozza_ora, ident2, campo2)
        prove.append((ident2, campo2, r + segno * 5))
        migliorato = False
        for ident_, campo_, v in prove:
            lo_, hi_ = next((l, hh) for i_, c_, l, hh in LEVE[mazzo] if i_ == ident_ and c_ == campo_)
            if not lo_ <= v <= hi_:
                continue
            firma = json.dumps(sorted([m for m in st["mods"] if not (m[0] == ident_ and m[1] == campo_)] + [[ident_, campo_, v]]))
            if firma in st.setdefault("provati", []):
                continue
            st["provati"].append(firma)
            st["n"] += 1
            nome = f"c{st['n']}-{mazzo}-{campo_.split('.')[1].lower()}{v}"
            mods = [m for m in st["mods"] if not (m[0] == ident_ and m[1] == campo_)] + [[ident_, campo_, v]]
            bozza = z.AREA / f"{nome}.json"
            z.applica(st["base"], bozza, [tuple(m) for m in mods])
            t = time.time()
            cart = z.misura(nome, bozza, 100, righe=(mazzo,), avversari=z.RIF)
            nuova = {k: v_ for k, v_ in st["tab"].items() if mazzo not in k.split("|")}
            nuova.update(tabella_da([cart]))
            e2 = esito(nuova)
            prima_v = valore(bozza_ora, ident_, campo_)
            dev2 = sum(q - 50 for q in z.riga(mazzo, e2).values()) / 6
            log(f"   {nome}: {campo_} {prima_v}->{v} dev {dev:+.1f}->{dev2:+.1f} costo {z.costo(e):.1f}->{z.costo(e2):.1f} "
                f"({time.time() - t:.0f}s)")
            st["storia"].append(dict(nome=nome, mazzo=mazzo, campo=campo_, prima=prima_v, dopo=v, dev=dev, dev2=dev2,
                                     costo=z.costo(e), costo2=z.costo(e2)))
            if campo_.endswith("HEALTH") and v != prima_v and abs(dev2 - dev) > 0.5:
                stima = abs(dev2 - dev) / abs(v - prima_v)
                st["pendenza"] = round(0.5 * st["pendenza"] + 0.5 * min(2.0, max(0.2, stima)), 3)
            if z.costo(e2) < z.costo(e):
                st["mods"], st["tab"] = mods, nuova
                st["bloccati"] = []
                migliorato = True
                z.salva(STATO, st)
                break
            z.salva(STATO, st)
        if not migliorato:
            st["bloccati"].append(mazzo)
            log(f"   {mazzo}: nessuna leva migliora, bloccato fino al prossimo miglioramento")
            z.salva(STATO, st)
    e = esito(st["tab"])
    z.stampa(e, f"stato dopo {st['n']} prove; mods={st['mods']}")


if __name__ == "__main__":
    main()
