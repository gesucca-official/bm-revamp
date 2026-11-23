# Carte stampabili di Botte Micidiali

Generatore riutilizzabile, senza elenco carte o effetti mantenuto a mano. Non modifica database, regole o client. Richiede Python 3.10+ e **ReportLab**; usa Arial di Windows (incorporato nel PDF), oppure DejaVu Sans su Linux. Nessuna immagine esterna.

Da SB-28 (regolamento 2.0, Set Base 1.0) la stampa legge il **file del set vivo**, `server/src/main/resources/sets/base.json`: lo stesso che legge il server. La versione del set stampata è quella del documento del set (`docs/sets/base.md`, «Set Base 1.0»; il file conserva quella della bozza congelata, 1.7), la versione del regolamento è letta da `docs/game-rules.md`. Il generatore della stampa dello 0.1, che leggeva il catalogo SQLite e le schede del documento del set, è uscito con quel set (archiviato in `docs/history/set-base-0.1.md`).

Da PowerShell, nella radice `E:\bm`:

```powershell
python -m pip install -r tools/print-cards/requirements.txt
python tools/print-cards/generate.py
```

Risultati: `output/pdf/botte-micidiali-carte.pdf` e relativo `.manifest.json`, con set, versione del regolamento, impronta del file del set, inventario, copie e coordinate in mm. Il PDF contiene i 124 fronti (7 personaggi e 117 carte), poi la guida al tavolo (simboli, lettura della carta, parole chiave, composizione degli starter) e il libretto dei testi completi (125 voci, token compreso). Una copia di ciascuna carta **non è un mazzo**. I due PDF vivi in `output/pdf/` (`botte-micidiali-carte.pdf`, `botte-micidiali-starter.pdf`) sono nel repository e si rigenerano quando cambia il set.

## Configurazione

```powershell
# Due copie di ogni carta; dimensioni e spazi espliciti
python tools/print-cards/generate.py --copies 2 --width-mm 62 --height-mm 87 --margin-mm 9 --gap-mm 3
# Quantità differenti per singola carta, lasciando le altre a una copia
python tools/print-cards/generate.py --copies-file tools/print-cards/copies.example.json
# Altra destinazione; eseguibile anche da una cartella differente
python tools/print-cards/generate.py --output output/pdf/prova.pdf
```

`--copies-file` accetta un oggetto JSON `identificatore completo: quantità` (gli identificatori del file del set, elencati nel manifest), senza abbreviazioni. Le quantità sostituiscono `--copies` solo per le carte indicate; 0 omette la carta. Usare `--copies 0 --copies-file ...` per una selezione esclusiva. Il file di esempio è solo un esempio di quantità.

Opzione aggiuntiva: `--font-dir`, che richiede `arial.ttf` + `arialbd.ttf`, oppure `DejaVuSans.ttf` + `DejaVuSans-Bold.ttf`.

## Stampa degli starter

```powershell
# Elenca i cinque starter (nome e categoria, D182) senza creare PDF
python tools/print-cards/generate.py --list-starters
# Un mazzo: 25 fronti, personaggio compreso
python tools/print-cards/generate.py --starter Mara --output output/pdf/starter-mara.pdf
# Tutti gli starter: 125 fronti
python tools/print-cards/generate.py --all-starters
# Due copie di ogni starter; una selezione (ripetere lo stesso --starter aggiunge un altro mazzo)
python tools/print-cards/generate.py --all-starters --copies 2 --output output/pdf/starter-doppi.pdf
python tools/print-cards/generate.py --starter Spazienzio --starter Celestina --output output/pdf/starter-selezionati.pdf
# Token o quantità puntuali dopo il calcolo dei mazzi
python tools/print-cards/generate.py --all-starters --copies-file tools/print-cards/copies.example.json --output output/pdf/starter-con-token.pdf
```

`--starter` accetta l'identificatore del mazzo (anche senza `starter-`), il nome dello starter (Spazienzio, Mara, Celestina, Piera, Beppe), l'identificatore o il nome visualizzato del personaggio, tra virgolette se contiene spazi; maiuscole e minuscole non contano. Con `--all-starters` l'uscita predefinita è `output/pdf/botte-micidiali-starter.pdf`.

Un mazzo conta personaggio + base + 2 legate + ultima risorsa + 20 carte = 25 fronti. Le copie condivise fra mazzi si **sommano**; i fronti restano raggruppati per carta e la guida riporta le composizioni per dividerli. `--copies` moltiplica i mazzi, `--copies-file` imposta poi quantità assolute. Il token Bottiglia Spaccata nasce in partita e non fa parte dei mazzi: si aggiunge col JSON (l'esempio ne mette 4).

## Bozze

Con `--bozza` la sorgente è una bozza nel formato del file del set invece del set vivo: senza percorso la bozza del repository, `server/src/test/resources/set-base/bozza.json` (7 personaggi, 117 carte, i 5 starter e i mazzi di misura), oppure il percorso indicato. Ogni fronte porta «BOZZA PROVVISORIA» e la guida si apre con l'avviso di bozza non normativa. Uscite: `output/pdf/bozza-set-base.pdf` o `output/pdf/bozza-starter.pdf`, che non vanno aggiunte al repository.

```powershell
python tools/print-cards/generate.py --bozza
python tools/print-cards/generate.py --bozza --list-starters
python tools/print-cards/generate.py --bozza --starter starter-spazienzio --output output/pdf/bozza-starter-spazienzio.pdf
# I 5 starter-*; con --all-decks anche i mazzi di misura (prova-*, iso-*)
python tools/print-cards/generate.py --bozza --all-starters --all-decks
python tools/print-cards/generate.py --bozza altra-bozza.json --copies 0 --copies-file tools/print-cards/copies.example.json
```

Un nome di personaggio con più mazzi di misura e nessuno starter (Sergio Sommerso e Duccio Braccio Teso nella bozza) è ambiguo: l'errore elenca gli identificatori da usare.

## Cosa c'è sulla carta e nella guida

- **Fronti.** Nome, tipo e rarità (comune, non comune, rara; i personaggi PROTAGONISTA, P, senza pallini: regolamento, R07), costo, priorità, bersaglio, ruolo ed eventuale danno nominale (simbolo e quantità), testo breve, flavour in corsivo a 7,5 pt (D166 (2)), slot e identificatore. Personaggi: risorse iniziali, capacità oggetti con l'immunità, base e legate (2 a scelta). Nella fascia in alto il set («SET BASE 1.0», o «BOZZA PROVVISORIA»); al piede set e versione, versione del regolamento («reg. 2.0») e i primi 12 caratteri dello SHA-256 del file: una stampa vecchia si riconosce dall'impronta, che il manifest riporta intera. Le carte senza `targets` (quelle con classe Java) stampano «Bersaglio: come da testo». Una rarità sconosciuta interrompe la generazione.
- **Simboli.** I segnaposto `[[H]] [[A]] [[V]] [[T]] [[L]]` e quelli di danno `[[HIT]] [[CUT]] [[POISON]]` (D168 (1)) diventano i simboli vettoriali del client, portati da `client-web/src/symbols.ts` e `readability.ts` in `symbols_pdf.py` (stesse forme e colori, nessun glifo di font). Un segnaposto sconosciuto o non chiuso interrompe la generazione. `SymbolPortTest` confronta colori e forme letterali con i sorgenti TypeScript: se il client cambia un simbolo il test fallisce e `symbols_pdf.py` va riallineato.
- **Guida.** Rinvio al regolamento e al documento del set, istruzioni di stampa con controllo da 50 mm, legenda dei simboli (risorse, ruoli, danni), lettura della carta, regole delle parole chiave e di ciò che le carte presuppongono (metà e quarti, mai sotto zero, chi si muove prima, Gioca d'anticipo, Rincara, Annuncia, Vulnerabile, stati e durate, equipaggiamento, Immune, fine turno, corazza dell'alcol), ognuna con la regola del regolamento da cui viene (SB-28: i rimandi alle regole del playground, RP-n, sono diventati rimandi al regolamento 2.0 secondo `docs/design/set-base/sb-28/corrispondenza.md`), e composizione dei mazzi stampati (o degli starter con il catalogo).
- **Testi completi.** Dopo la guida, un libretto con il testo completo (D170) di ogni voce stampata, da `docs/design/set-base/testi/testi-completi.json`: nel catalogo le 125 voci, nei mazzi le voci stampate più il token. In caso di dubbio prevale sul testo breve.
- **Testi che non entrano.** Non si tronca né si riduce: ogni carta è disposta una volta su una pagina di prova e tutte le carte che non entrano vengono elencate insieme prima di scrivere il PDF. Il flavour conta: un fronte che non entra col flavour è rifiutato e il messaggio dice quanto resterebbe senza. Col formato predefinito 62 × 87 mm entrano tutte (prova d'ingombro di SB-25 B2: `docs/reports/set-base/sb-25/ingombro-stampa.py`).
- **Riesecuzione.** Il file è riletto a ogni esecuzione; un mazzo non valido (carta mancante, 20 carte, 2 copie, 2 legate del proprio personaggio) è un errore esplicito.

## Stampa e taglio

- Carta **A4**, stampa a colori, solo fronte, **dimensioni effettive / 100%**, senza adattamento alla pagina e senza modalità senza bordi che ingrandisca il foglio.
- Impostazioni iniziali: taglio **62 × 87 mm**, 9 fronti per foglio in griglia 3 × 3, spazio di taglio 3 mm. Griglia centrata; segni esterni lunghi 1 mm distanziati di 0,5 mm dalla carta.
- Prima di stampare tutto, misurare il segmento da 50 mm della guida e una carta. La precisione finale dipende dalla stampante e dal taglio, non certificabili dal PDF.
- Stampa le sole pagine dei fronti se non serve la guida. Segui i piccoli segni esterni, usando righello e taglierina. Inserisci davanti a una carta di supporto nella sleeve; verifica prima una sleeve reale.

## Verifiche riproducibili

```powershell
python -m pip install pypdf
python tools/print-cards/verify.py
python tools/print-cards/verify.py output/pdf/botte-micidiali-starter.pdf
python tools/print-cards/test_generator.py   # set vivo, bozze, mazzi, errori e porting dei simboli
python scripts/check-rules.py
# Poppler deve essere disponibile nel PATH per il controllo visivo
pdftoppm -r 120 -png output/pdf/botte-micidiali-carte.pdf tmp/pdfs/print-cards/page
# senza Poppler: PyMuPDF (python -m pip install pymupdf), una pagina in PNG
python -c "import fitz; fitz.open('output/pdf/botte-micidiali-carte.pdf')[0].get_pixmap(dpi=120).save('tmp/pdfs/print-cards/p01.png')"
```

`verify.py` verifica il PDF predefinito, oppure un percorso come primo argomento, contro il file del set nominato nel suo manifest (che non deve essere cambiato dopo la stampa): inventario e quantità (catalogo, mazzi, override), dimensioni A4, rettangoli di taglio effettivamente presenti nel PDF, margini, assenza di sovrapposizioni, nome, identificatore e impronta su ogni foglio, marchio di bozza solo nelle bozze, testi completi presenti e nessun rimando alle regole del playground nella guida. Revisionare comunque le pagine renderizzate, soprattutto dopo aggiunte o modifiche.

La generazione usa solo ReportLab; pypdf e Poppler servono alla verifica. Nessuna modifica alle meccaniche del gioco.
