"""SB-16b: confronto fra varianti di regola sul banco SB-7 (stessi semi, stessa bozza)."""
import json
import sys
from pathlib import Path

SHORT = {"starter-spazienzio": "Spazienzio", "starter-mara": "Mara", "starter-tossico": "Celestina",
         "starter-pino": "Piera", "starter-gigi": "Beppe"}


def load(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def pairs(d):
    out = {}
    for p in d["coppie"]:
        out[(p["A"], p["B"])] = p
    return out


def pct(x):
    return f"{100 * x:.1f}%"


def main():
    names = sys.argv[1].split(",")
    files = sys.argv[2].split(",")
    data = [load(f) for f in files]
    head = data[0]["intestazione"]
    print(f"Bozza {head['bozza']} SHA-256 {head['sha256'][:8]}…{head['sha256'][-8:]}, "
          f"{head['partitePerCella']} partite per cella, {head['partite']} partite, stili {', '.join(head['stili'])}, primo seme {head['primoSeme']}\n")
    # Riepilogo globale
    print("| Variante | Patte | Turni medi | Quota del primo posto | Mazzi esauriti (media dei mazzi) |")
    print("|---|---:|---:|---:|---:|")
    for n, d in zip(names, data):
        games = sum(p["partite"] for p in d["coppie"])
        draws = sum(p["patte"] for p in d["coppie"])
        turns = sum(p["turniTotali"] for p in d["coppie"])
        decided = sum(p["vittorieA"] + p["vittorieB"] for p in d["coppie"])
        first = sum(p["vittoriePrimoPosto"] for p in d["coppie"])
        ex = [m["mazzoEsaurito"] / m["partite"] for m in d["mazzi"].values()]
        print(f"| {n} | {pct(draws / games)} | {turns / games:.2f} | {first / decided:.3f} | {pct(sum(ex) / len(ex))} |")
    print()
    # Per coppia
    keys = list(pairs(data[0]).keys())
    print("| Incontro (quota di A) | " + " | ".join(f"{n}: quota · patte · turni" for n in names) + " |")
    print("|---|" + "---|" * len(names))
    for k in keys:
        row = f"| {SHORT[k[0]]} – {SHORT[k[1]]} |"
        for d in data:
            p = pairs(d)[k]
            row += f" {p['quotaA']:.3f} · {pct(p['patte'] / p['partite'])} · {p['turniTotali'] / p['partite']:.1f} |"
        print(row)
    print()
    # Per mazzo
    print("| Mazzo | " + " | ".join(f"{n}: quota · esaurito · last resort" for n in names) + " |")
    print("|---|" + "---|" * len(names))
    for deck in data[0]["mazzi"]:
        row = f"| {SHORT[deck]} |"
        for d in data:
            m = d["mazzi"][deck]
            q = m["vittorie"] / (m["vittorie"] + m["sconfitte"])
            row += f" {q:.3f} · {pct(m['mazzoEsaurito'] / m['partite'])} · {pct(m['lastResortArrivata'] / m['partite'])} |"
        print(row)


if __name__ == "__main__":
    main()
