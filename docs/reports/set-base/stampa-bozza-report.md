# Stampa della bozza del Set Base — rapporto dell'esecutore

**Esito.** Fatto e verificato dentro il perimetro. `tools/print-cards/generate.py --bozza` stampa le 123 carte della bozza (7 personaggi, 116 carte) e i mazzi, con simboli vettoriali del client. Tutte le carte entrano a 62 × 87 mm con testo a 9 pt, nessuna ha richiesto di fermarsi (STOP 6 non scattato). Il modo vivo è identico byte per byte a prima. Un solo rosso preesistente, non mio (sotto). Un commit, nessun push.

## Cosa cambia

- `tools/print-cards/bozza.py` (nuovo): lettura di `bozza.json` a ogni esecuzione, validazione (formato `sb-6b/1`, mazzi da 20 carte con al più 2 copie, 2 legate del proprio personaggio, riferimenti esistenti), fronti, mazzi, guida, manifest.
- `tools/print-cards/symbols_pdf.py` (nuovo): porting di forme e colori di `client-web/src/symbols.ts` e `readability.ts` (5 risorse, 7 ruoli, 3 danni, contorno scuro di tossicità e alcol sul fondo chiaro). Nessun glifo di font.
- `generate.py`: solo `--bozza [percorso]`, `--all-decks` e il ramo che smista prima di leggere il catalogo; `--output` ha ora il default calcolato (stesso valore di prima nel modo vivo).
- `test_generator.py`, `README.md` (sezione «Bozza del Set Base»), `VERIFICATION.md`.

## Comandi

```powershell
python tools/print-cards/generate.py --bozza                       # 123 fronti -> output/pdf/bozza-set-base.pdf
python tools/print-cards/generate.py --bozza --list-starters       # i 26 mazzi
python tools/print-cards/generate.py --bozza --starter starter-spazienzio --output output/pdf/bozza-starter-spazienzio.pdf
python tools/print-cards/generate.py --bozza --all-starters        # i 5 starter-*; con --all-decks tutti i 26
```

`--starter` accetta id del mazzo (anche senza `starter-`), id del personaggio o nome visualizzato. `--copies` e `--copies-file` hanno lo stesso significato del modo vivo.

## Equivalenza del modo vivo

Generati prima e dopo la modifica: catalogo, `--all-starters`, `--starter BigBadBruiser --copies 2`. Manifest, testo estratto (pypdf) e byte dei PDF **identici** in tutti e tre i casi (il PDF usa `invariant=1`, quindi anche i timestamp coincidono). Un test (`test_live_mode_is_not_touched`) tiene fermo che il modo vivo non scriva chiavi o testi della bozza.

## Verifiche

| Verifica | Esito |
|---|---|
| `python tools/print-cards/test_generator.py` | 14 test OK (8 del modo bozza, 3 sul porting dei simboli, 3 preesistenti) |
| 7 mutazioni sulla logica nuova (segnaposto, conteggio mazzo, default di `--all-starters`, elenco overflow, colore, forma, margine delle righe) | tutte uccise; l'ultima ha richiesto un test in più sulla larghezza delle righe |
| `verify.py tmp/pdfs/baseline/live.pdf` e `.../after/live.pdf` (PDF vivo appena generato) | OK |
| `verify.py` senza argomento | **ROSSO preesistente**: controlla `output/pdf/botte-micidiali-carte.pdf` (versionato, 26 ottobre), obsoleto: `bruiser.MadeOfStone: effetto incompleto`. Non toccati né il PDF né `verify.py` né `load_catalog`. Non è nel registro dei rossi noti: propongo la voce o la rigenerazione dei due PDF versionati (fuori dal mio perimetro). |
| `git diff --check`, `check-links.py` (441 file, 0 rotti), `check-rules.py` | OK |
| Render e lettura delle pagine (PyMuPDF, 130 dpi) | catalogo 16 pagine (14 fogli + 2 di guida) e starter 5 pagine: simboli, intestazioni, testi leggibili, nulla di troncato |
| `build.ps1`, Maven, client | **non eseguiti**, per la misura SB-21t in corso nello stesso checkout; `tools/print-cards` non è importato da server o client |

Poppler non è nel PATH: ho reso le pagine con PyMuPDF in un venv nella cartella temporanea della sessione, fuori dal repository. Sul computer ho installato con pip `reportlab` e `pypdf` (mancavano; nessun file del repository toccato).

## Carte che hanno richiesto cura di layout

Nessuna oltre il disegno generale. Il caso più pieno è `bruiser.Glare` (7 righe di testo, il massimo fra le carte); 6 carte hanno il nome su due righe (per esempio `GARGANTUESCO IMPATTO SUL TU`) e restano dentro. Per far entrare tutto: niente promemoria di regole vive sulla carta (riguardano le regole 1.13, non d50), codice di slot spostato nel piè (`CES-AR1 · identificatore`) invece che in testa al testo, piè su due righe da 6 pt. A 40 × 55 mm la generazione si rifiuta e elenca tutte le carte che non entrano.

## Impronta e riesecuzione

`bozza.json` usato: SHA-256 `1923ed9b0e71d95884376745f0ada4563c1baa40285907923417406ede9644cc` (sul piè di ogni fronte: `1923ed9b0e71`). Dopo SB-21t basta lo stesso comando: la bozza è riletta a ogni esecuzione e la nuova impronta compare su carte, titolo del PDF e manifest. Le stampe vecchie si riconoscono dall'impronta.

## Scelte prese

1. `--all-starters` in modo bozza stampa i 5 `starter-*`; `--all-decks` aggiunge i 21 mazzi di misura (`prova-*`, `iso-*`: 650 fronti, 73 fogli, non è una stampa da tavolo).
2. Un nome di personaggio con più mazzi di misura e nessuno starter (Sergio Sommerso, Duccio Braccio Teso) è ambiguo: l'errore elenca gli id. Con uno starter unico il nome lo sceglie.
3. Ruolo e danno nominale sono stampati con i simboli del client sotto bersaglio e priorità (il modo vivo non li mostra).
4. I PDF generati (`output/pdf/bozza-*.pdf` e manifest) sono non tracciati e non messi nel commit.

## Per il proprietario

Aprire `output/pdf/bozza-set-base.pdf` a 100%, controllare il segmento da 50 mm e una carta tagliata nella sleeve; giudicare leggibilità e disposizione.

## Domande

1. **24 o 25 fronti?** Il prompt dice «un mazzo = 24 fronti» nei test ma «personaggio + base + 2 legate + last resort + 20 carte» nel conteggio: sono 25 (e nel modo vivo uno starter è 25). Ho usato 25 e testato 25. Se 24 era voluto (personaggio non stampato?), dirlo.
2. Il campo dei costi nella bozza si chiama `cost` (non `costs`); le 17 carte con classe Java non hanno `targets`, quindi stampano «Bersaglio: come da testo». Va bene, o si vuole il bersaglio esplicito nel JSON?
3. Registrare il rosso di `verify.py` sul PDF versionato (o rigenerare i due PDF vivi) è lavoro della regia.
