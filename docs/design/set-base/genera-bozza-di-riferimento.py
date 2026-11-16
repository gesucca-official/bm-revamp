#!/usr/bin/env python3
"""Genera le liste e i testi dei cinque starter della bozza di riferimento (formato 20/2 di D94).

Dalla 1.6 (SB-16i, D97) legge, senza modificarlo, il solo server/src/test/resources/set-base/bozza.json, che contiene già
il Bancone del braccio B: nessuna sostituzione. La 1.5 resta in set-base/storico/1.5/bozza.json più bancone-b.json.

Uso (dalla radice del repository):
    python docs/design/set-base/genera-bozza-di-riferimento.py            # stampa la sezione generata
    python docs/design/set-base/genera-bozza-di-riferimento.py --verifica # esce con 1 se il documento è indietro
    python docs/design/set-base/genera-bozza-di-riferimento.py --scrivi   # riscrive solo la sezione fra i marcatori

I marcatori sono le due righe «<!-- inizio generato -->» e «<!-- fine generato -->» di bozza-di-riferimento.md.
Solo libreria standard.
"""
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
DOC = Path(__file__).resolve().with_name("bozza-di-riferimento.md")
START, END = "<!-- inizio generato -->", "<!-- fine generato -->"
RES = {"HEALTH": "salute", "ALERTNESS": "A", "VIOLENCE": "V", "TOXICITY": "T", "ALCOHOL": "L"}
RARITY = {"COMMON": "C", "UNCOMMON": "NC", "RARE": "R"}


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:12]


def load():
    return json.loads(BOZZA.read_text(encoding="utf-8"))


def cell(text):
    return str(text).replace("|", "\\|").replace("\n", " ")


def card_line(card, copies=None):
    gui = card.get("gui", {})
    name = gui.get("name", card["binding"])
    rar = RARITY.get(card.get("rarity"), card.get("rarity", "—"))
    first = f"{copies}" if copies is not None else "1"
    return f"| {first} | **{cell(name)}** (`{card['binding']}`) | {rar} | {cell(gui.get('description', ''))} |"


def generate():
    draft = load()
    rules = draft["rules"]
    cards = {c["binding"]: c for c in draft["cards"]}
    chars = {c["id"]: c for c in draft["characters"]}
    starters = [d for d in draft["decks"] if d["id"].startswith("starter-")]
    tests = [d for d in draft["decks"] if not d["id"].startswith("starter-")]
    out = [
        f"Generato da `genera-bozza-di-riferimento.py` dal solo `bozza.json` (SHA-256 `{sha(BOZZA)}…`). "
        f"Formato `{draft['format']}`, set `{draft['set']['id']}` versione «{draft['set']['version']}»; "
        f"regole dei mazzi: {rules['deckSize']} carte regolari, massimo {rules['maxCopies']} copie, "
        f"{rules['boundChoices']} bound, basic fissa, last resort obbligatoria"
        + ("; il mazzo si mischia dopo ogni ricerca" if rules.get("searchShuffle") else "")
        + ". Rarità: C comune, NC non comune, R rara.",
        "",
        f"Il file contiene {len(cards)} carte (basic, bound, last resort, azioni e oggetti; i personaggi sono a parte), "
        f"{len(draft['characters'])} personaggi, {len(starters)} starter e, di prova, {len(tests)} mazzo/i "
        "(l'id che comincia per `starter-` è uno starter, ogni altro mazzo è di prova: non è nella riserva predefinita del server).",
        "",
    ]
    for deck in draft["decks"]:
        ch = chars[deck["character"]]
        res = ", ".join(f"{RES.get(k, k)} {v}" for k, v in ch["resources"].items() if v)
        imm = ", ".join(RES.get(i, i) for i in ch.get("immunities", [])) or "nessuna"
        regs = deck["cards"]
        total = sum(regs.values())
        by_rar = {}
        for b, n in regs.items():
            r = RARITY.get(cards[b].get("rarity"), cards[b].get("rarity", "—"))
            by_rar[r] = by_rar.get(r, 0) + n
        slots = " · ".join(f"{r} {by_rar[r]}" for r in ("C", "NC", "R") if r in by_rar)
        out += [
            f"### {'Starter' if deck in starters else 'Mazzo di prova'} di {ch['name']} — `{deck['id']}`",
            "",
            f"Personaggio: **{ch['name']}** ({RARITY.get(ch.get('rarity'), ch.get('rarity'))}), {res}; oggetti {ch.get('items', 0)}; "
            f"immunità: {imm}. Regolari: **{total}** carte, {len(regs)} titoli ({slots}).",
            "",
            "| Copie | Carta | Rarità | Testo |",
            "|---:|---|---|---|",
            card_line(cards[ch["basic"]]).replace("| 1 |", "| basic |", 1),
        ]
        for b in deck["bound"]:
            out.append(card_line(cards[b]).replace("| 1 |", "| bound |", 1))
        out.append(card_line(cards[deck["lastResort"]]).replace("| 1 |", "| last resort |", 1))
        for b, n in regs.items():
            out.append(card_line(cards[b], n))
        out.append("")
    return "\n".join(out).rstrip() + "\n"


def splice(doc, section):
    a, b = doc.index(START), doc.index(END)
    return doc[: a + len(START)] + "\n\n" + section + "\n" + doc[b:]


def main(argv):
    section = generate()
    if "--scrivi" in argv or "--verifica" in argv:
        doc = DOC.read_text(encoding="utf-8")
        new = splice(doc, section)
        if "--verifica" in argv:
            if new != doc:
                print("bozza-di-riferimento.md non è allineato: rigenerare con --scrivi")
                return 1
            print("bozza-di-riferimento.md allineato a bozza.json")
            return 0
        DOC.write_text(new, encoding="utf-8", newline="\n")
        print("sezione generata riscritta in", DOC.name)
        return 0
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stdout.write(section)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
