"""Stampa i tre campi per slot, oppure aggiornali in bozza con --scrivi (D142)."""
import argparse
import json
from pathlib import Path
import re
import sys

from testi_stampati import BOZZA, CAMPI_STAMPATI, analizza, leggi, slot_di


STRINGA_JSON = r'"(?:\\.|[^"\\])*"'
BLOCCO_GUI = re.compile(r'"gui"\s*:\s*(\{(?:[^{}"]|' + STRINGA_JSON + r')*\})')
NOMI_CAMPO = "|".join(CAMPI_STAMPATI)
CAMPO_GUI = re.compile(r'("(?P<nome>' + NOMI_CAMPO + r')"\s*:\s*)(' + STRINGA_JSON + r')')


def sostituisci(contenuto, bozza, per_slot):
    def aggiorna_blocco(m):
        gui = json.loads(m[1])
        slot = slot_di(gui)
        if not slot or slot[1] not in per_slot:
            raise ValueError("gui: blocco senza slot riconosciuto")
        nuovi = per_slot[slot[1]]

        def aggiorna_campo(campo):
            valore = nuovi[campo["nome"]]
            if json.loads(campo[3]) == valore:
                return campo[0]
            return campo[1] + json.dumps(valore, ensure_ascii=False)

        return m[0][:m.start(1) - m.start()] + CAMPO_GUI.sub(aggiorna_campo, m[1])

    aggiornato, blocchi = BLOCCO_GUI.subn(aggiorna_blocco, contenuto)
    for carta in bozza["cards"]:
        gui = carta["gui"]
        gui.update(per_slot[slot_di(gui)[1]])
    if blocchi != len(per_slot) or json.loads(aggiornato) != bozza:
        raise ValueError("la riscrittura deve aggiornare esattamente i tre campi stampati di ogni carta")
    return aggiornato


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("bozza", nargs="?", type=Path, default=BOZZA)
    cli.add_argument("--scrivi", action="store_true", help="aggiorna la bozza conservandone la formattazione")
    args = cli.parse_args()
    try:
        contenuto = args.bozza.read_bytes().decode("utf-8")
        bozza = leggi(contenuto)
        righe, errori = analizza(bozza)
        if errori:
            print("\n".join(errori), file=sys.stderr)
            return 1
        per_slot = {slot: generati for slot, _, generati in righe}
        if args.scrivi:
            nuovo = sostituisci(contenuto, bozza, per_slot)
            if nuovo != contenuto:
                args.bozza.write_bytes(nuovo.encode("utf-8"))
            print(f"{len(per_slot)} carte generate in {args.bozza}")
        else:
            print(json.dumps(per_slot, ensure_ascii=False, indent=2))
    except (OSError, ValueError) as errore:
        print(f"{args.bozza}: {errore}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
