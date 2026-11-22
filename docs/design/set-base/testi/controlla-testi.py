"""Controlla i testi della bozza contro il generatore (D142, D169, D170): uguaglianza esatta dei tre campi stampati di ogni carta, di
nome e descrizione dei suoi stati e del file dei testi completi; poi il gergo, nel testo breve e nel testo completo (SB-25 B1)."""
import argparse
from pathlib import Path
import sys

from testi_stampati import (BOZZA, CAMPI_STAMPATI, COMPLETI_JSON, analizza, carica_slot, documento_completi, errore_token,
                            gergo, leggi, stati_carta)


def controlla(bozza, completi, slot=None):
    """Gli errori dei testi della bozza e del file dei testi completi (il contenuto in byte, o None se manca)."""
    slot = carica_slot() if slot is None else slot
    righe, voci, errori = analizza(bozza, slot)
    noti = list(slot.values())
    for codice, carta, generati in righe:
        gui = carta["gui"]
        for campo in CAMPI_STAMPATI:
            attuale, atteso = gui.get(campo), generati[campo]
            problema = errore_token(campo, attuale)
            if problema:
                errori.append(f"{codice} gui.{campo}: {problema}")
            elif attuale != atteso:
                errori.append(f"{codice} gui.{campo}: atteso {atteso!r}, trovato {attuale!r}")
        for problema in gergo(gui.get("description"), noti):
            errori.append(f"{codice} gui.description: {problema}")
        attuali = [(passo.get("name"), passo.get("description")) for passo, _, _ in stati_carta(carta)]
        for i, (attuale, atteso) in enumerate(zip(attuali, generati["stati"])):
            if tuple(attuale) != tuple(atteso):
                errori.append(f"{codice} stato {i + 1}: atteso {tuple(atteso)!r}, trovato {tuple(attuale)!r}")
            problema = errore_token("description", attuale[1])
            if problema:
                errori.append(f"{codice} stato {i + 1}: {problema}")
            for problema in gergo(attuale[1], noti):
                errori.append(f"{codice} stato {i + 1} description: {problema}")
    for binding, voce in voci.items():
        for problema in gergo(voce["breve"], noti):
            errori.append(f"{voce['slot']} testo breve: {problema}")
        for i, paragrafo in enumerate(voce["completo"]):
            problema = errore_token("description", paragrafo)
            if problema:
                errori.append(f"{voce['slot']} testo completo, paragrafo {i + 1}: {problema}")
            for problema in gergo(paragrafo, noti, completo=True):
                errori.append(f"{voce['slot']} testo completo, paragrafo {i + 1}: {problema}")
    if completi is None:
        errori.append(f"{COMPLETI_JSON.name}: manca; si genera con genera-testi.py --scrivi")
    elif completi != documento_completi(voci).encode("utf-8"):
        errori.append(f"{COMPLETI_JSON.name}: diverso dal generatore; si rigenera con genera-testi.py --scrivi")
    return righe, voci, errori


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("bozza", nargs="?", type=Path, default=BOZZA)
    cli.add_argument("--completi", type=Path, default=COMPLETI_JSON)
    args = cli.parse_args()
    try:
        bozza = leggi(args.bozza.read_bytes())
        completi = args.completi.read_bytes() if args.completi.exists() else None
        righe, voci, errori = controlla(bozza, completi)
    except (OSError, ValueError) as errore:
        print(f"{args.bozza}: {errore}", file=sys.stderr)
        return 1
    if errori:
        print("\n".join(errori), file=sys.stderr)
        return 1
    stati = sum(len(g["stati"]) for _, _, g in righe)
    print(f"{len(righe)} carte e {stati} stati: campi stampati, nomi e descrizioni coincidono col generatore; "
          f"{len(voci)} testi completi coincidono; nessun gergo")
    return 0


if __name__ == "__main__":
    sys.exit(main())
