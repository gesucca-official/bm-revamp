"""SB-16e: tables from measured JSON only. Full ablation reports stay in TEMP."""
import collections
import json
import os
import pathlib
import shutil

ROOT = pathlib.Path(__file__).resolve().parent
NAMES = dict(zip(("spazienzio", "mara", "tossico", "pino", "gigi"),
                 ("Spazienzio", "Mara", "Celestina", "Piera", "Beppe")))


def name(deck):
    return NAMES[deck.removeprefix("starter-")]


def load(path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def stats(pair):
    return pair["quotaA"], pair["patte"] / pair["partite"] * 100, pair["turniTotali"] / pair["partite"]


def render():
    text = ["# SB-16e — tutti gli incontri per giro\n\n",
            "Quote sulle partite decisive; patte su tutte le partite. Ogni riga della matrice: 32.000 partite, 16 coppie di stili.\n"]
    pairs_text = ["# SB-16e — misure delle coppie\n\n",
                  "Osservazione: 400 semi per cella, 96.000 partite per giro, posti alternati. Le copie cercate sono seguite per identità.\n"]
    for folder in sorted(ROOT.glob("round-*")):
        if not (folder / "matrix.json").exists():
            continue
        matrix = load(folder / "matrix.json")
        label = folder.name
        text += [f"\n## {label}\n\n", "| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |\n|---|---:|---:|---:|---:|---:|---:|\n"]
        for p in matrix["coppie"]:
            q, d, t = stats(p)
            text += [f'| {name(p["A"])}–{name(p["B"])} | {p["vittorieA"]} | {p["vittorieB"]} | {p["patte"]} | {q:.3f} | {d:.2f} | {t:.2f} |\n']
        text += ["\n### Celle per stile oltre il 10% di patte\n\n",
                 "La soglia D51 si giudica sull’incontro aggregato; le celle evidenziano dipendenze dal bot. Tutte le celle, anche quelle sotto soglia, sono nel JSON.\n",
                 "| Incontro | Stile A | Stile B | Patte/partite | Patte % | Turni |\n|---|---|---|---:|---:|---:|\n"]
        for p in matrix["celle"]:
            if p["patte"] / p["partite"] > .10:
                text += [f'| {name(p["A"])}–{name(p["B"])} | {p["stileA"]} | {p["stileB"]} | {p["patte"]}/{p["partite"]} | {stats(p)[1]:.2f} | {stats(p)[2]:.2f} |\n']
        if not (folder / "pairs.json").exists():
            continue
        counters = collections.defaultdict(collections.Counter)
        for row in load(folder / "pairs.json"):
            counters[row["a"]].update(row["aCounts"])
            counters[row["b"]].update(row["bCounts"])
        pairs_text += [f"\n## {label}\n\n", "| Personaggio | Partite di posto | Cariche scelte/risolte | Ricerche trovate/tentate | Colpo già in mano alla carica | Colpi scelti/risolti | Parati da stati / eventi danno | Corazza | Esposizioni punite |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n"]
        for deck, c in counters.items():
            pairs_text += [f'| {name(deck)} | {c["seatGames"]} | {c["chargeChosen"]}/{c["chargeResolved"]} | {c["searchFound"]}/{c["searchAttempt"]} | {c["hitAlreadyInHandAtCharge"]} | {c["hitChosen"]}/{c["hitResolved"]} | {c["hitParried"]}/{c["hitDamageEvents"]} | {c["hitArmored"]} | {c["exposureWindowsPunished"]} |\n']
        pairs_text += ["\n| Personaggio | Copie trovate giocate/risolte | Scartate per bound | Inutilizzate a fine partita | Attesa media turni | Annullati a terra/contromossa (tutti i colpi) | Danno assorbito stati/corazza | Eventi esposizione / danno extra | Cariche sopravvissute/risolte |\n|---|---:|---:|---:|---:|---:|---:|---:|---:|\n"]
        for deck, c in counters.items():
            delay = c["foundDelayTurns"] / max(1, c["foundChosen"])
            pairs_text += [f'| {name(deck)} | {c["foundChosen"]}/{c["foundResolved"]} | {c["foundDiscardedForBound"]} | {c["foundUnusedAtEnd"]} | {delay:.2f} | {c["hitVoidedDown"]}/{c["hitVoidedCounter"]} | {c["hitDefenseAbsorbed"]}/{c["hitArmorAbsorbed"]} | {c["exposureDamageEvents"]}/{c["exposureExtraDamage"]} | {c["chargeSurvivedTurn"]}/{c["chargeResolved"]} |\n']
        pairs_text += ["\n### Esaurimento e finali\n\n",
                       "| Personaggio | Mazzo esaurito / partite di posto | Accesso alla last resort / partite di posto |\n|---|---:|---:|\n"]
        for deck, c in counters.items():
            pairs_text += [f'| {name(deck)} | {c["deckExhaustedGames"]}/{c["seatGames"]} | {c["lastResortReachedGames"]}/{c["seatGames"]} |\n']
        mirror = collections.Counter()
        for row in load(folder / "pairs.json"):
            if row["a"] == row["b"] == "starter-pino":
                mirror.update(row["aCounts"])
                mirror.update(row["bCounts"])
        pairs_text += [f'\nSpecchio Piera: 6.400 partite; {mirror["drawGames"]} patte, di cui {mirror["drawBothAZero"]} con entrambe ad A=0. '
                       f'Differenza assoluta di A nel finale: 0: {mirror["finalAbsADelta-0"]}, 1–5: {mirror["finalAbsADelta-1-5"]}, '
                       f'6–15: {mirror["finalAbsADelta-6-15"]}, oltre 15: {mirror["finalAbsADelta-16+"]}.\n',
                       "I contatori `drawWithEndDamage`, `drawWithSelfDamage`, `drawReciprocalMoves` classificano la presenza di danni nell’ultimo turno, "
                       "con precedenza fine turno → sé → mosse reciproche. Non provano quale evento sia stato letale: non sono usati come attribuzione causale.\n"]
        pairs_text += ["\n### Ultimi danni letali negli specchi\n\n",
                       "Ogni riga: 6.400 partite. `opponent` è danno dell’avversario, `self` danno proprio, `end` fine turno; le coppie descrivono "
                       "l’ultimo passaggio da salute positiva a zero di ciascun giocatore. Per due danni avversari si confrontano i gruppi fissati dopo i costi.\n\n",
                       "| Specchio | Patte osservate | Ultimi danni letali (numero di partite) |\n|---|---:|---|\n"]
        for deck in ("starter-tossico", "starter-pino", "starter-gigi"):
            causes = collections.Counter()
            for row in load(folder / "pairs.json"):
                if row["a"] == row["b"] == deck:
                    causes.update(row["aCounts"])
                    causes.update(row["bCounts"])
            details = "; ".join(f'{k.removeprefix("drawLethal-")}: {v}' for k, v in sorted(causes.items()) if k.startswith("drawLethal-"))
            pairs_text += [f'| {name(deck)} | {causes["drawGames"]} | {details} |\n']
        pairs_text += ["\n### Controlli con gli stessi semi (500 per cella)\n\n",
                       "Una coppia spenta ripristina solo il vecchio slot di caricamento di SB-16c, conserva il colpo e tutte le altre carte/numeri. Misura l’intero ridisegno dello slot, non la ricerca isolata.\n",
                       "| Variante | Incontro A–B | Quota A (Δ pp) | Patte % (Δ pp) | Turni (Δ) |\n|---|---|---:|---:|---:|\n"]
        control_path = folder / "control-500.json"
        if control_path.exists():
            control = {(p["A"], p["B"]): p for p in load(control_path)["coppie"]}
            for path in sorted(folder.glob("*.json")):
                variant = path.stem
                if variant in ("matrix", "pairs", "draft", "control-500"):
                    continue
                data = load(path)
                for p in data["coppie"]:
                    if variant.startswith("pair-off-"):
                        affected = list(NAMES)[int(variant[-1])]
                        if not any(x.endswith(affected) for x in (p["A"], p["B"])):
                            continue
                    if variant.startswith("piera-") and "starter-pino" not in (p["A"], p["B"]):
                        continue
                    if variant == "poison-8" and "starter-tossico" not in (p["A"], p["B"]):
                        continue
                    q, d, t = stats(p)
                    q0, d0, t0 = stats(control[p["A"], p["B"]])
                    pairs_text += [f'| {variant} | {name(p["A"])}–{name(p["B"])} | {q:.3f} ({(q-q0)*100:+.2f}) | {d:.2f} ({d-d0:+.2f}) | {t:.2f} ({t-t0:+.2f}) |\n']
        # Keep full primary matrices and observations; archive verbose ablation reports outside git.
        scratch = pathlib.Path(os.environ["TEMP"]) / "bm-sb16e" / label
        scratch.mkdir(parents=True, exist_ok=True)
        for path in folder.glob("*.json"):
            if path.stem in ("matrix", "pairs", "draft"):
                continue
            data = load(path)
            if "mazzi" in data:
                shutil.copy2(path, scratch / path.name)
                compact = {k: data[k] for k in ("intestazione", "invarianti", "coppie", "tettoBound")}
                path.write_text(json.dumps(compact, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    (ROOT / "incontri.md").write_text("".join(text), encoding="utf-8")
    (ROOT / "coppie.md").write_text("".join(pairs_text), encoding="utf-8")


if __name__ == "__main__":
    render()
