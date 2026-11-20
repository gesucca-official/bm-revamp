"""SB-21z (D161 (2), (4)): ricerca dei sette costruiti (strumento SB-7, come SB-21g, con -Generations) e scontri diretti.

Uso dalla radice:
  python -B -X utf8 docs/reports/set-base/sb-21z/costruiti.py ricerca <bozza> <passata> [personaggi...] [--generazioni 15]
  python -B -X utf8 docs/reports/set-base/sb-21z/costruiti.py diretti <bozza> <passata>
Le liste vincitrici si scelgono come in SB-21 3b (riepiloga.finalisti): fra «ultimo» e «precedente» delle due ricerche, la quota
di convalida piu' alta. Criteri D161 (2): nessun costruito vince tutti e sei gli scontri, nessuno scontro fra costruiti oltre il 70%.
"""
import argparse
from collections import Counter
from pathlib import Path
import shutil
import subprocess
import sys
import time

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sb21z as z  # noqa: E402

PERS = dict(zip(z.NOMI, z.PERS))
COSTRUITI = tuple(f"costruito-{n}" for n in z.NOMI)


def ricerca(bozza, passata, nomi, generazioni):
    for nome in nomi:
        copia = z.AREA / f"z-{passata}-{nome}.json"
        uscita = z.AREA / f"sb7-ricerca-{copia.stem}-1.json"
        if uscita.exists():
            continue
        shutil.copyfile(bozza, copia)
        t = time.time()
        cmd = [z.SHELL, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(z.EVID / "search.ps1"), "-Label",
               f"{passata}-{nome}", "-Draft", str(copia), "-Characters", PERS[nome], "-OutputRoot", str(z.AREA),
               "-Generations", str(generazioni)]
        r = subprocess.run(cmd, cwd=z.ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode:
            print(r.stdout[-2000:], r.stderr[-2000:])
            raise SystemExit(f"STOP: ricerca {nome} fallita")
        base = f"sb7-ricerca-{copia.stem}-1"
        for s in (".json", ".md", ".tempi.txt"):
            shutil.move(z.ROOT / "tmp/sim" / f"{base}{s}", z.AREA / f"{base}{s}")
        print(f"ricerca {nome}: {time.time() - t:.0f}s", flush=True)


def quota_convalida(conv):
    v = sum(c["vittorie"] for c in conv.values())
    s = sum(c["sconfitte"] for c in conv.values())
    return 100 * v / (v + s)


def finalisti(bozza, passata):
    dati = z.leggi(bozza)
    liste = {}
    for nome, personaggio in PERS.items():
        ric = z.leggi(z.AREA / f"sb7-ricerca-z-{passata}-{nome}-1.json")
        cand = [(r["partenza"], m) for r in ric["ricerche"] for m in r["mazzi"] if m["etichetta"] in ("ultimo", "precedente")]
        partenza, m = max(cand, key=lambda c: quota_convalida(c[1]["convalida"]))
        liste[nome] = dict(id=f"costruito-{nome}", character=personaggio, bound=m["bound"], lastResort=m["lastResort"],
                           cards=m["carte"])
    dati["decks"].extend(liste.values())
    uscita = z.AREA / f"costruiti-{passata}.json"
    z.salva(uscita, dati)
    nomi = {c["binding"]: c["gui"]["name"] for c in dati["cards"]}
    freq = Counter(k for m in liste.values() for k in m["cards"])
    z.salva(z.EVID / f"liste-{passata}.json", dict(liste=liste, frequenze=[
        dict(carta=k, nome=nomi.get(k, k), mazzi=n) for k, n in sorted(freq.items(), key=lambda c: (-c[1], c[0]))]))
    return uscita


def diretti(bozza, passata):
    copia = finalisti(bozza, passata)
    cart = z.misura(f"diretti-{passata}", copia, 100, righe=COSTRUITI, avversari=COSTRUITI + z.RIF)
    m = z.leggi(cart / "matrix.json")
    g = {}
    for x in m["celle"]:
        if z.gruppo(x["stileA"], x["stileB"]) != "heur":
            continue
        k = g.setdefault((x["A"], x["B"]), Counter())
        k["va"] += x["vittorieA"]
        k["vb"] += x["vittorieB"]
        k["n"] += x["partite"]
        k["turni"] += x["turniTotali"]
        k["patte"] += x["patte"]

    def q(a, b):
        if (a, b) in g:
            k = g[a, b]
            return 100 * k["va"] / (k["va"] + k["vb"])
        k = g[b, a]
        return 100 * k["vb"] / (k["va"] + k["vb"])

    fra = {a: {b: round(q(a, b), 1) for b in COSTRUITI if b != a} for a in COSTRUITI}
    contro_starter = {a: {b: round(q(a, b), 1) for b in z.RIF} for a in COSTRUITI}
    vittorie = {a: sum(v > 50 for v in fra[a].values()) for a in COSTRUITI}
    oltre70 = sorted({tuple(sorted((a, b))) + (max(v, 100 - v),) for a in COSTRUITI for b, v in fra[a].items()
                      if v > 70 or v < 30})
    esito = dict(fraCostruiti=fra, controStarter=contro_starter, vittorie=vittorie, oltre70=oltre70,
                 dominio=[a for a, n in vittorie.items() if n == 6],
                 passa=not oltre70 and not any(n == 6 for n in vittorie.values()))
    z.salva(z.EVID / f"scontri-{passata}.json", esito)
    print("vittorie", vittorie)
    print("oltre il 70%", oltre70)
    for a in COSTRUITI:
        print(f"   {a:>22}", " ".join(f"{fra[a].get(b, 0):5.1f}" if b != a else "  -  " for b in COSTRUITI),
              "| starter", " ".join(f"{v:5.1f}" for v in contro_starter[a].values()))
    print("passa", esito["passa"])
    return esito


if __name__ == "__main__":
    cli = argparse.ArgumentParser()
    cli.add_argument("fase", choices=("ricerca", "diretti"))
    cli.add_argument("bozza")
    cli.add_argument("passata")
    cli.add_argument("nomi", nargs="*", default=list(z.NOMI))
    cli.add_argument("--generazioni", type=int, default=15)
    a = cli.parse_args()
    if a.fase == "ricerca":
        ricerca(Path(a.bozza), a.passata, a.nomi, a.generazioni)
    else:
        diretti(Path(a.bozza), a.passata)
