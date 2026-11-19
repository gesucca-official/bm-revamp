"""Controlla l'uguaglianza esatta dei tre campi stampati col generatore (D142)."""
import argparse
from pathlib import Path
import sys

from testi_stampati import BOZZA, analizza, errore_token, leggi


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("bozza", nargs="?", type=Path, default=BOZZA)
    args = cli.parse_args()
    try:
        bozza = leggi(args.bozza.read_bytes())
    except (OSError, ValueError) as errore:
        print(f"{args.bozza}: {errore}", file=sys.stderr)
        return 1

    righe, errori = analizza(bozza)
    for slot, gui, generati in righe:
        for campo, atteso in generati.items():
            attuale = gui.get(campo)
            problema = errore_token(campo, attuale)
            if problema:
                errori.append(f"{slot} gui.{campo}: {problema}")
            elif attuale != atteso:
                errori.append(f"{slot} gui.{campo}: atteso {atteso!r}, trovato {attuale!r}")

    if errori:
        print("\n".join(errori), file=sys.stderr)
        return 1
    print(f"{len(righe)} carte: description, gains e damageAmount coincidono col generatore")
    return 0


if __name__ == "__main__":
    sys.exit(main())
