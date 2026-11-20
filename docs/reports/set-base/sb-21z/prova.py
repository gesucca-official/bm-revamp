"""SB-21z: prova manuale sopra lo stato della ricerca. Applica modifiche in piu' (id|binding:campo:valore), rimisura le righe
dei mazzi indicati a 100 semi, stampa l'esito complessivo; con --tieni aggiorna cerca-stato.json.

Uso: python -B -X utf8 prova.py <nome> --righe starter-gigi[,..] --mod base.character.Gigi:resources.HEALTH:75 ... [--tieni]
"""
import argparse
import json
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sb21z as z  # noqa: E402
import cerca as c  # noqa: E402


def valore(v):
    if v == "del":
        return v
    try:
        return json.loads(v)
    except ValueError:
        return v


cli = argparse.ArgumentParser()
cli.add_argument("nome")
cli.add_argument("--righe", required=True)
cli.add_argument("--mod", nargs="*", default=[])
cli.add_argument("--tieni", action="store_true")
a = cli.parse_args()
st = z.leggi(c.STATO)
mods = [list(m) for m in st["mods"]]
for m in a.mod:
    b, campo, v = m.split(":", 2)
    mods = [x for x in mods if not (x[0] == b and x[1] == campo)] + [[b, campo, valore(v)]]
bozza = z.AREA / f"p-{a.nome}.json"
z.applica(st["base"], bozza, [tuple(m) for m in mods])
righe = tuple(a.righe.split(","))
tab = dict(st["tab"])
for r in righe:
    cart = z.misura(f"p-{a.nome}-{r}", bozza, 100, righe=(r,), avversari=z.RIF)
    tab = {k: v for k, v in tab.items() if r not in k.split("|")}
    tab.update(c.tabella_da([cart]))
e = c.esito(tab)
z.stampa(e, f"{a.nome} {a.mod}")
for m in z.RIF:
    print(f"   scarto {m}: {sum(q - 50 for q in z.riga(m, e).values()) / 6:+.1f}")
print("   violazioni", e["violazioni"])
if a.tieni:
    st["mods"], st["tab"] = mods, tab
    st.setdefault("manuali", []).append(dict(nome=a.nome, mod=a.mod, righe=righe, costo=z.costo(e)))
    z.salva(c.STATO, st)
    print("   tenuta")
