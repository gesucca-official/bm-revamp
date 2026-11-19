"""Estrae le scelte dei bot euristici dal «Rif»; non avvia partite."""
from collections import Counter
from pathlib import Path
import sys

from matrice import leggi, salva


def osservazioni(bozza, cartelle, filtro):
    deck = {m["id"]: m for m in bozza["decks"]}
    basic = {c["id"]: c["basic"] for c in bozza["characters"]}
    nomi = {c["binding"]: c.get("gui", {}).get("name", c["binding"]) for c in bozza["cards"]}
    per_carta, per_mazzo = {k: Counter() for k in nomi}, {}
    for cartella in cartelle:
        obs = leggi(cartella / "deck-observations.json")
        for chiave, metriche in obs.items():
            a, b, gruppo = chiave.split("|")
            if gruppo != "heur" or not filtro(a, b):
                continue
            m = deck[a]
            carte = set(m["cards"]) | set(m["bound"]) | {m["lastResort"], basic[m["character"]]}
            for k in carte:
                p = f"card/{k}/"
                c = Counter(partite=metriche["games"], **{
                    campo: metriche.get(p + campo, 0)
                    for campo in ("plays", "playedGames", "handTurns", "unchosenTurns")
                })
                per_carta[k].update(c)
                per_mazzo.setdefault(a, {}).setdefault(k, Counter()).update(c)

    def arricchisci(c):
        if not c:
            return {"partite": 0}
        return dict(**c, percentuale=100*c["playedGames"]/c["partite"], perPartita=c["plays"]/c["partite"],
                    sceltaPerTurnoInMano=100*c["plays"]/c["handTurns"] if c["handTurns"] else None)

    return dict(carte={k: dict(nome=nomi[k], **arricchisci(c)) for k, c in per_carta.items()},
                perMazzo={d: {k: arricchisci(c) for k, c in carte.items()}
                          for d, carte in per_mazzo.items()})


if __name__ == "__main__":
    cartella, uscita = map(Path, sys.argv[1:])
    salva(uscita, osservazioni(leggi(cartella / "draft.json"), [cartella], lambda a, b: True))
