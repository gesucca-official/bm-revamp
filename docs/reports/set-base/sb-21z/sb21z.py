"""Banco SB-21z (D161): bozza con numeri belli, misure degli starter a semi scelti, criteri assoluti, ricerca sulle leve.

Dalla radice: python -B -X utf8 docs/reports/set-base/sb-21z/sb21z.py <comando> ...
Area di lavoro server/target/sb-21z; evidenze in questa cartella. Le misure passano da run.ps1 (copia di quello di SB-21h con -Games).
"""
from collections import Counter, defaultdict
import copy
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import time

sys.dont_write_bytecode = True
EVID = Path(__file__).resolve().parent
ROOT = EVID.parents[3]
AREA = ROOT / "server/target/sb-21z"
TESTI = ROOT / "docs/design/set-base/testi"
SHELL = "powershell"
sys.path.insert(0, str(EVID))
import belli  # noqa: E402

RIF = ("starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino", "starter-gigi", "prova-sergio", "prova-duccio")
NOMI = ("spazienzio", "mara", "celestina", "piera", "beppe", "sergio", "duccio")
PERS = ("bruiser.character.BigBadBruiser", "base.character.Mara", "junkie.character.ToxicJunkie", "base.character.Pino",
        "base.character.Gigi", "base.character.Cesira", "base.character.Rocco")

# D161 (2): criteri assoluti.
QUOTA = (35, 65)
TURNI_MEDI = 10
TURNI_SPECCHIO = 15
PATTE = 6
PATTE_SPECCHIO = 12


def leggi(p):
    return json.loads(Path(p).read_text(encoding="utf-8-sig"))


def salva(p, d):
    Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=1) + "\n", encoding="utf-8", newline="\n")


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


# ---------------------------------------------------------------- bozza

def _blocchi(testo, sezione, chiave):
    """Posizioni (inizio, fine) degli oggetti della sezione ("cards" o "characters"), per valore di chiave."""
    dec = json.JSONDecoder()
    i = testo.index("[", testo.index(f'"{sezione}"')) + 1
    out = {}
    while True:
        while testo[i] in " \r\n\t,":
            i += 1
        if testo[i] == "]":
            return out
        obj, fine = dec.raw_decode(testo, i)
        out[obj[chiave]] = (i, fine, obj)
        i = fine


def _imposta(obj, campo, valore):
    *percorso, k = campo.split(".")
    sede = obj
    for p in percorso:
        sede = sede[int(p)] if isinstance(sede, list) else sede[p]
    if isinstance(sede, list):
        k = int(k)
    prima = sede[k] if (k in sede if isinstance(sede, dict) else k < len(sede)) else None
    if valore == "del":
        del sede[k]
    else:
        sede[k] = valore
    return prima


def _scalari(testo, i, percorso, out):
    """Scansione minima del JSON: posizioni (inizio, fine) di ogni scalare per percorso puntato. Restituisce la fine del valore."""
    ws = " \r\n\t"
    while testo[i] in ws:
        i += 1
    if testo[i] == "{":
        i += 1
        while True:
            while testo[i] in ws + ",":
                i += 1
            if testo[i] == "}":
                return i + 1
            chiave, i = json.JSONDecoder().raw_decode(testo, i)
            while testo[i] in ws + ":":
                i += 1
            i = _scalari(testo, i, (*percorso, chiave), out)
    if testo[i] == "[":
        i += 1
        n = 0
        while True:
            while testo[i] in ws + ",":
                i += 1
            if testo[i] == "]":
                return i + 1
            i = _scalari(testo, i, (*percorso, str(n)), out)
            n += 1
    _, fine = json.JSONDecoder().raw_decode(testo, i)
    out[".".join(percorso)] = (i, fine)
    return fine


def _cancella_campo(blocco, campo):
    """Toglie «"k": v» (con la virgola) da un oggetto del blocco: solo per scalari."""
    pos = {}
    _scalari(blocco, 0, (), pos)
    a, z = pos[campo]
    k = campo.split(".")[-1]
    inizio = blocco.rindex(f'"{k}"', 0, a)
    prima = blocco[:inizio].rstrip()
    if prima.endswith(","):
        return prima[:-1] + blocco[z:]
    dopo = blocco[z:].lstrip()
    assert dopo.startswith(","), campo
    return blocco[:inizio] + dopo[1:].lstrip()


def applica(ingresso, uscita, modifiche, schede_intere=None, belli_obbligatori=True):
    """Copia della bozza con modifiche (binding o id, campo puntato, valore | "del") e schede intere {binding: scheda}.
    Cambia i numeri al loro posto (impaginazione conservata); una scheda intera o un campo nuovo riscrive l'oggetto su una riga.
    Poi rigenera i testi stampati e fa i controlli (D143, D161 (3))."""
    testo = Path(ingresso).read_text(encoding="utf-8")
    per_obj = defaultdict(list)
    for b, c, v in modifiche:
        per_obj[b].append((c, v))
    sostituzioni = []
    for sezione, chiave in (("cards", "binding"), ("characters", "id")):
        for b, (a, z, obj) in _blocchi(testo, sezione, chiave).items():
            if not (b in per_obj or (schede_intere and b in schede_intere)):
                continue
            blocco = testo[a:z]
            atteso = copy.deepcopy(schede_intere[b]) if schede_intere and b in schede_intere else copy.deepcopy(obj)
            for c, v in per_obj.get(b, ()):
                _imposta(atteso, c, v)
            if schede_intere and b in schede_intere:
                blocco = json.dumps(atteso, ensure_ascii=False)
            else:
                for c, v in per_obj[b]:
                    pos = {}
                    _scalari(blocco, 0, (), pos)
                    if v == "del":
                        blocco = _cancella_campo(blocco, c)
                    elif c in pos:
                        i, f = pos[c]
                        blocco = blocco[:i] + json.dumps(v) + blocco[f:]
                    else:
                        blocco = json.dumps(atteso, ensure_ascii=False)
                        break
            assert json.loads(blocco) == atteso, b
            sostituzioni.append((a, z, blocco))
    trovati = set(per_obj) | set(schede_intere or {})
    assert len(sostituzioni) == len(trovati), (trovati, len(sostituzioni))
    for a, z, s in sorted(sostituzioni, reverse=True):
        testo = testo[:a] + s + testo[z:]
    json.loads(testo)
    Path(uscita).write_text(testo, encoding="utf-8", newline="\n")
    controlli(uscita, belli_obbligatori)
    return uscita


def controlli(bozza, belli_obbligatori=True):
    subprocess.run([sys.executable, "-B", "-X", "utf8", str(TESTI / "genera-testi.py"), "--scrivi", str(bozza)], check=True,
                   cwd=ROOT, stdout=subprocess.DEVNULL)
    subprocess.run([sys.executable, "-B", "-X", "utf8", str(TESTI / "controlla-testi.py"), str(bozza)], check=True, cwd=ROOT,
                   stdout=subprocess.DEVNULL)
    if belli_obbligatori:
        residui = list(belli.brutti(leggi(bozza)))
        assert not residui, residui


# ---------------------------------------------------------------- misure

def misura(nome, bozza, giochi=25, righe=RIF, avversari=RIF, seme=7000000):
    """Lancia run.ps1 (fase round) e restituisce la cartella. Una misura gia' fatta con lo stesso nome si riusa."""
    AREA.mkdir(parents=True, exist_ok=True)
    out = AREA / f"round-{nome}"
    tentativo = AREA / f"round-{nome}-attempt.json"
    if tentativo.exists():
        t = leggi(tentativo)
        if t.get("exit") == 0 and (out / "matrix.json").exists():
            return out
        raise SystemExit(f"STOP: misura {nome} tentata e non riuscita")
    cmd = [SHELL, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(EVID / "run.ps1"), "-Phase", "round", "-Label", nome,
           "-Draft", str(bozza), "-OutputRoot", str(AREA), "-Games", str(giochi), "-Seed", str(seme),
           "-Rows", ",".join(righe), "-Foes", ",".join(avversari)]
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if r.returncode:
        print(r.stdout[-3000:], r.stderr[-3000:])
        raise SystemExit(f"STOP: misura {nome} fallita")
    return out


def gruppo(a, b):
    return ("heur", "mixed", "com")[a.endswith("/com") + b.endswith("/com")]


def coppie(cartelle):
    """{(a, b): dict(partite, va, vb, patte, turni)} sui soli stili euristici, con a e b in ordine di RIF."""
    g = defaultdict(Counter)
    for c in cartelle:
        m = leggi(Path(c) / "matrix.json")
        assert not any(m["invarianti"]["violazioni"].values()), c
        for x in m["celle"]:
            if gruppo(x["stileA"], x["stileB"]) != "heur":
                continue
            a, b, va, vb = x["A"], x["B"], x["vittorieA"], x["vittorieB"]
            if RIF.index(a) > RIF.index(b):
                a, b, va, vb = b, a, vb, va
            k = g[a, b]
            k["partite"] += x["partite"]
            k["va"] += va
            k["vb"] += vb
            k["patte"] += x["patte"]
            k["turni"] += x["turniTotali"]
    return g


def esito(g):
    """Quote, durate, patte e criteri D161 (2) da coppie()."""
    righe = []
    for (a, b), k in g.items():
        righe.append(dict(a=a, b=b, quota=100 * k["va"] / max(1, k["va"] + k["vb"]), turni=k["turni"] / k["partite"],
                          patte=100 * k["patte"] / k["partite"], partite=k["partite"]))
    righe.sort(key=lambda r: (RIF.index(r["a"]), RIF.index(r["b"])))
    tot = sum(g[k]["partite"] for k in g)
    turni = sum(g[k]["turni"] for k in g) / tot
    patte = 100 * sum(g[k]["patte"] for k in g) / tot
    fuori = [(r["a"], r["b"], round(r["quota"], 1)) for r in righe if r["a"] != r["b"] and not QUOTA[0] <= r["quota"] <= QUOTA[1]]
    fuori4060 = [(r["a"], r["b"], round(r["quota"], 1)) for r in righe if r["a"] != r["b"] and not 40 <= r["quota"] <= 60]
    specchi = [(r["a"], round(r["turni"], 2), round(r["patte"], 2)) for r in righe if r["a"] == r["b"]]
    viol = dict(quota=fuori, turniMedi=turni > TURNI_MEDI, patte=patte > PATTE,
                specchiTurni=[s for s in specchi if s[1] > TURNI_SPECCHIO],
                specchiPatte=[s for s in specchi if s[2] > PATTE_SPECCHIO])
    passa = not fuori and not viol["turniMedi"] and not viol["patte"] and not viol["specchiTurni"] and not viol["specchiPatte"]
    return dict(passa=passa, turni=turni, patte=patte, fuori=fuori, fuori4060=fuori4060, specchi=specchi, violazioni=viol,
                coppie=righe)


def costo(e):
    """Funzione obiettivo della ricerca: zero se tutto nel 40-60 e nei limiti; i criteri D161 pesano molto di piu'."""
    c = 0.0
    for r in e["coppie"]:
        if r["a"] == r["b"]:
            c += 4 * max(0, r["turni"] - (TURNI_SPECCHIO - 0.5)) ** 2 + max(0, r["patte"] - (PATTE_SPECCHIO - 1)) ** 2
            continue
        d = abs(r["quota"] - 50)
        c += 0.02 * d ** 2 + max(0, d - 10) ** 2 + 10 * max(0, d - 14) ** 2
    c += 50 * max(0, e["turni"] - (TURNI_MEDI - 0.3)) ** 2 + 10 * max(0, e["patte"] - (PATTE - 0.5)) ** 2
    return c


def stampa(e, titolo=""):
    print(f"== {titolo} passa={e['passa']} turni={e['turni']:.2f} patte={e['patte']:.2f} costo={costo(e):.1f}")
    for r in e["coppie"]:
        segno = "" if r["a"] == r["b"] or 40 <= r["quota"] <= 60 else (" *" if QUOTA[0] <= r["quota"] <= QUOTA[1] else " **")
        print(f"   {r['a']:>18} {r['b']:>18} {r['quota']:5.1f} t={r['turni']:5.2f} p={r['patte']:5.2f}{segno}")
    sys.stdout.flush()


def riga(nome_mazzo, e):
    """Quote del mazzo contro gli altri sei (dal suo lato)."""
    out = {}
    for r in e["coppie"]:
        if r["a"] == r["b"]:
            continue
        if r["a"] == nome_mazzo:
            out[r["b"]] = r["quota"]
        elif r["b"] == nome_mazzo:
            out[r["a"]] = 100 - r["quota"]
    return out


if __name__ == "__main__":
    comando, *args = sys.argv[1:]
    if comando == "esito":
        stampa(esito(coppie(args)), " + ".join(Path(a).name for a in args))
    elif comando == "belli":
        for r in belli.brutti(leggi(args[0])):
            print(*r, sep=" | ")
