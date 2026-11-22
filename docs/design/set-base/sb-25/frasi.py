#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SB-25 Fase A: prototipo delle frasi nuove dei testi per i giocatori. Ritirato nella Fase B1.

Le frasi approvate (glossario e campione, D170) sono passate senza cambiamenti nel generatore,
docs/design/set-base/testi/testi_stampati.py, che oggi scrive il testo breve in gui.description e il testo completo in
docs/design/set-base/testi/testi-completi.json (genera-testi.py --scrivi, controllo in controlla-testi.py). Il prototipo com'era
alla revisione del proprietario si legge con:

    git show dce3733:docs/design/set-base/sb-25/frasi.py

e gira solo su quella versione della bozza e del generatore. Per la stessa ragione genera-revisione.py, che lo importava, non
rigenera più revisione.html: la pagina resta com'era alla revisione approvata.
"""
import sys


def main():
    print(__doc__.strip(), file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
