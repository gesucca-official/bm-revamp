"""Stampa i testi generati, oppure scrivili con --scrivi: i tre campi stampati di ogni carta e nome e descrizione dei suoi stati
nella bozza, conservandone la formattazione, e il testo completo di carte, personaggi e token in testi-completi.json (D142, D169,
D170)."""
import argparse
import json
from pathlib import Path
import re
import sys

from testi_stampati import BOZZA, CAMPI_STAMPATI, COMPLETI_JSON, analizza, documento_completi, leggi, passi_di_stato


STRINGA_JSON = r'"(?:\\.|[^"\\])*"'
BLOCCO_GUI = re.compile(r'"gui"\s*:\s*(\{(?:[^{}"]|' + STRINGA_JSON + r')*\})')
BLOCCO_STATO = re.compile(r'\{\s*"op"\s*:\s*"status"(?:[^{}"]|' + STRINGA_JSON + r')*\}')
CAMPO_GUI = re.compile(r'("(?P<nome>' + "|".join(CAMPI_STAMPATI) + r')"\s*:\s*)(' + STRINGA_JSON + r')')
CAMPO_STATO = re.compile(r'("(?P<nome>name|description)"\s*:\s*)(' + STRINGA_JSON + r')')


def sostituisci_campi(blocco, regola, nuovi):
    """Riscrive nel testo di un oggetto JSON piatto solo i campi indicati, lasciando com'è il resto."""
    def aggiorna(campo):
        valore = nuovi[campo["nome"]]
        if json.loads(campo[3]) == valore:
            return campo[0]
        return campo[1] + json.dumps(valore, ensure_ascii=False)
    return regola.sub(aggiorna, blocco)


def sostituisci(contenuto, bozza, righe):
    """La bozza riscritta: l'n-esimo blocco gui è quello dell'n-esima carta (personaggi e mazzi non ne hanno); l'n-esimo stato del
    file è l'n-esimo stato delle carte nell'ordine in cui sono scritte."""
    guis = [generati for _, _, generati in righe]
    stati = [stato for _, _, generati in righe for stato in generati["stati"]]
    if len(guis) != len(bozza["cards"]):
        raise ValueError("ogni carta deve avere i suoi testi generati")
    pos = {"gui": 0, "stato": 0}

    def aggiorna_gui(m):
        i = pos["gui"]
        pos["gui"] += 1
        if i >= len(guis):
            raise ValueError("più blocchi gui che carte")
        nuovi = {campo: guis[i][campo] for campo in CAMPI_STAMPATI}
        return m[0][:m.start(1) - m.start()] + sostituisci_campi(m[1], CAMPO_GUI, nuovi)

    def aggiorna_stato(m):
        i = pos["stato"]
        pos["stato"] += 1
        if i >= len(stati):
            raise ValueError("più stati nel file che nelle carte")
        nome, descrizione = stati[i]
        return sostituisci_campi(m[0], CAMPO_STATO, {"name": nome, "description": descrizione})

    aggiornato = BLOCCO_GUI.sub(aggiorna_gui, contenuto)
    aggiornato = BLOCCO_STATO.sub(aggiorna_stato, aggiornato)
    if pos["gui"] != len(guis) or pos["stato"] != len(stati):
        raise ValueError("blocchi gui o stati diversi da quelli delle carte")
    atteso = json.loads(contenuto)
    for carta, (_, _, generati) in zip(atteso["cards"], righe):
        carta["gui"].update({campo: generati[campo] for campo in CAMPI_STAMPATI})
    for carta, (_, _, generati) in zip(atteso["cards"], righe):
        for passo, (nome, descrizione) in zip(stati_in_ordine(carta), generati["stati"]):
            passo["name"], passo["description"] = nome, descrizione
    if json.loads(aggiornato) != atteso:
        raise ValueError("la riscrittura deve aggiornare solo i tre campi stampati e nome e descrizione degli stati")
    return aggiornato


def stati_in_ordine(carta):
    """Gli oggetti stato di una carta nello stesso ordine di testi_stampati.stati_carta (ordine del file)."""
    for chiave, valore in carta.items():
        if chiave in ("self", "target", "inPlay"):
            yield from passi_di_stato(valore)


def main():
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("bozza", nargs="?", type=Path, default=BOZZA)
    cli.add_argument("--completi", type=Path, default=COMPLETI_JSON, help="il file dei testi completi da scrivere")
    cli.add_argument("--scrivi", action="store_true", help="aggiorna bozza e testi completi")
    args = cli.parse_args()
    try:
        contenuto = args.bozza.read_bytes().decode("utf-8")
        bozza = leggi(contenuto)
        righe, voci, errori = analizza(bozza)
        if errori:
            print("\n".join(errori), file=sys.stderr)
            return 1
        if args.scrivi:
            nuovo = sostituisci(contenuto, bozza, righe)
            if nuovo != contenuto:
                args.bozza.write_bytes(nuovo.encode("utf-8"))
            completi = documento_completi(voci).encode("utf-8")
            if not args.completi.exists() or args.completi.read_bytes() != completi:
                args.completi.write_bytes(completi)
            print(f"{len(righe)} carte e {sum(len(g['stati']) for _, _, g in righe)} stati generati in {args.bozza}; "
                  f"{len(voci)} testi completi in {args.completi}")
        else:
            uscita = {slot: {**{c: g[c] for c in CAMPI_STAMPATI}, "stati": g["stati"]} for slot, _, g in righe}
            print(json.dumps(uscita, ensure_ascii=False, indent=2))
    except (OSError, ValueError) as errore:
        print(f"{args.bozza}: {errore}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
