"""SB-20b (D139 (5)): controllo di sola lettura dei numeri della bozza con le regole R1–R4.

Le regole sono i predicati della sezione 3 della proposta (docs/design/set-base/sb-20b-proposta.md), adottati in D139 (1);
R0 («non multiplo di 5») è scartata e qui non c'è. Non scrive niente: stampa le violazioni ed esce con 1 se ce n'è almeno una.

Uso, dalla radice del repository:
  python docs/design/set-base/controlla-numeri.py [BOZZA]      (predefinita: server/src/test/resources/set-base/bozza.json)

R1 Non interi        ogni importo, costo, risorsa iniziale e parametro Java è un intero; fuori: `factor` e `percent` (R2).
R2 Moltiplicatori    ogni `factor` è multiplo di 0,25 fra 0,25 e 2; `percent` solo 50.
R3 Fuori scala       un importo > 5 è in scala se è multiplo di 5, 6 o 7, oppure se lo stesso valore compare su almeno 5 carte;
                     esclusi priorità, turni, divisori, `perPlay`, `perItem`, `perAlcohol` (e `perPlaySelf`, stesso ruolo).
R4 Testo e dati      ogni numero di `gui.description`, `gui.gains` e `gui.damageAmount` è nei dati (o ne deriva: turni + 1) e ogni
                     importo dei dati è nel testo, salvo fattori, divisori e percentuali (scritti anche a parole: «metà»).

Valori tenuti per decisione (sez. 5 della proposta): una lista esplicita qui sotto, ognuno con la sua riga del registro. Un valore
tenuto che cambia nella bozza non è più coperto e torna una violazione.
"""
import json
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DEFAULT = ROOT / 'server/src/test/resources/set-base/bozza.json'

# (slot, regola, campo, valore): tenuti per decisione del proprietario.
TENUTI = {
    ('PIN-AR3', 'R2', 'factor', 0.65): 'D97 (4): Bancone HIT ×0,65',
    ('MAR-AR2', 'R2', 'factor', 0.8): 'D99 (1): Sgommata, anticipo ×0,8',
    ('ROC-AR1', 'R3', 'HEALTH', 16): 'D127 (2): costo di Duccio 16 HEALTH',
    ('ROC-AR4', 'R3', 'amount', 26): 'D125 (1), D127: colpo di Duccio 26 HIT',
    ('ROC-AR6', 'R3', 'HEALTH', 33): 'D127 (2): costo di Duccio 33 HEALTH',
}

NON_IMPORTI = {'priority', 'turns', 'divide', 'perPlay', 'perPlaySelf', 'perItem', 'perAlcohol', 'factor', 'percent'}
QUARTI = {0.25 * i for i in range(1, 9)}
SLOT = re.compile(r'^\s*([A-Z]{2,3}-[A-Z0-9]+)\s*·\s*')
NUMERO = re.compile(r'(?<![\w])\d+(?:,\d+)?')


def numeri(x, campo='', fuori=('gui',)):
    """Coppie (campo, valore) di tutte le foglie numeriche, fuori dai campi indicati."""
    if isinstance(x, dict):
        for k, v in x.items():
            if k not in fuori:
                yield from numeri(v, k, fuori)
    elif isinstance(x, list):
        for v in x:
            yield from numeri(v, campo, fuori)
    elif isinstance(x, (int, float)) and not isinstance(x, bool):
        yield campo, x


def testo_numeri(s):
    return [float(n.replace(',', '.')) for n in NUMERO.findall(s or '')]


def slot_di(carta):
    m = SLOT.match(carta.get('gui', {}).get('description', ''))
    return m.group(1) if m else carta.get('binding') or carta.get('id')


def controlla(bozza):
    violazioni, tenuti = [], []

    def segnala(slot, regola, campo, valore, perche):
        chiave = (slot, regola, campo, valore)
        if chiave in TENUTI:
            tenuti.append(f'{slot} {regola} {campo}={valore}: {TENUTI[chiave]}')
        else:
            violazioni.append(f'{slot} {regola} {campo}={valore}: {perche}')

    carte = [(slot_di(c), c) for c in bozza['cards']]

    # R1 sulle risorse iniziali dei personaggi.
    for p in bozza['characters']:
        for campo, v in numeri(p.get('resources', {})):
            if not isinstance(v, int):
                segnala(p['id'], 'R1', campo, v, 'risorsa iniziale non intera')

    # Vocabolario di R3: su quante carte compare ogni importo.
    carte_per_valore = defaultdict(set)
    for slot, c in carte:
        for campo, v in numeri(c):
            if campo not in NON_IMPORTI:
                carte_per_valore[v].add(slot)

    for slot, c in carte:
        dati = list(numeri(c))
        for campo, v in dati:
            if campo in ('factor', 'percent'):
                if campo == 'factor' and v not in QUARTI:
                    segnala(slot, 'R2', campo, v, 'fattore fuori dalla scala dei quarti (0,25–2)')
                if campo == 'percent' and v != 50:
                    segnala(slot, 'R2', campo, v, 'percentuale diversa da 50')
                continue
            if not isinstance(v, int):
                segnala(slot, 'R1', campo, v, 'valore non intero')
                continue
            if campo in NON_IMPORTI:
                continue
            if v > 5 and not (v % 5 == 0 or v % 6 == 0 or v % 7 == 0) and len(carte_per_valore[v]) < 5:
                segnala(slot, 'R3', campo, v, f'fuori scala (non multiplo di 5, 6 o 7; su {len(carte_per_valore[v])} carte)')

        # R4: testo → dati e dati → testo.
        gui = c.get('gui', {})
        descrizione = SLOT.sub('', gui.get('description', ''), count=1)
        stampati = testo_numeri(descrizione) + testo_numeri(gui.get('gains')) + testo_numeri(gui.get('damageAmount'))
        ammessi = {float(v) for _, v in dati} | {float(v) + 1 for campo, v in dati if campo == 'turns'}
        for n in stampati:
            if n not in ammessi:
                segnala(slot, 'R4', 'testo', n, 'numero stampato che i dati non hanno')
        visti = set(stampati)
        for campo, v in dati:
            if campo in NON_IMPORTI or v == 0:
                continue
            if float(v) not in visti:
                segnala(slot, 'R4', campo, v, 'importo dei dati che il testo non stampa')
    return list(dict.fromkeys(violazioni)), list(dict.fromkeys(tenuti))


def main():
    percorso = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    bozza = json.loads(percorso.read_text(encoding='utf-8'))
    violazioni, tenuti = controlla(bozza)
    print(f'{percorso}: {len(bozza["cards"])} carte, {len(bozza["characters"])} personaggi')
    for t in tenuti:
        print('  tenuto   ', t)
    for v in violazioni:
        print('  VIOLAZIONE', v)
    usati = {t.split(' ', 1)[0] for t in tenuti}
    for chiave, perche in TENUTI.items():
        if chiave[0] not in usati:
            print('  nota      valore tenuto non più presente:', chiave, '-', perche)
    print('esito:', 'violazioni' if violazioni else 'nessuna violazione', f'({len(violazioni)})')
    return 1 if violazioni else 0


if __name__ == '__main__':
    sys.exit(main())
