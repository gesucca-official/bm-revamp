# Carte stampabili di Botte Micidiali

Generatore riutilizzabile, senza elenco carte o effetti mantenuto a mano. Non modifica database, regole o client. Richiede Python 3.10+ e **ReportLab**; usa Arial di Windows (incorporato nel PDF), oppure DejaVu Sans su Linux. Nessuna immagine esterna.

Da PowerShell, nella radice `E:\bm`:

```powershell
python -m pip install -r tools/print-cards/requirements.txt
python tools/print-cards/generate.py
```

Risultati: `output/pdf/botte-micidiali-carte.pdf` e relativo `.manifest.json`, con inventario, copie, coordinate in mm e impronte delle fonti. Il PDF contiene prima i fronti, poi legenda, composizione starter dal database e testo normativo R02-R06. Una copia di ciascuna carta **non è un mazzo starter completo**.

## Configurazione

```powershell
# Due copie di ogni carta; dimensioni e spazi espliciti
python tools/print-cards/generate.py --copies 2 --width-mm 62 --height-mm 87 --margin-mm 9 --gap-mm 3
# Quantità differenti per singola carta, lasciando le altre a una copia
python tools/print-cards/generate.py --copies-file tools/print-cards/copies.example.json
# Altra destinazione; eseguibile anche da una cartella differente
python tools/print-cards/generate.py --output output/pdf/prova.pdf
```

`--copies-file` accetta un oggetto JSON `identificatore completo: quantità`, senza abbreviazioni. Le quantità sostituiscono `--copies` solo per le carte indicate; 0 omette la carta. Usare `--copies 0 --copies-file ...` per una selezione esclusiva. Gli identificatori sono nel manifest. Il file di esempio è solo un esempio di quantità, non un catalogo duplicato.

Opzioni aggiuntive: `--database`, `--rules`, `--annex`, `--font-dir`. Quest'ultima richiede `arial.ttf` + `arialbd.ttf`, oppure `DejaVuSans.ttf` + `DejaVuSans-Bold.ttf`.

## Stampa degli starter

```powershell
# Elenca gli starter senza creare o modificare PDF
python tools/print-cards/generate.py --list-starters
# Un mazzo completo (25 fronti oggi, incluso il personaggio)
python tools/print-cards/generate.py --starter BigBadBruiser --output output/pdf/starter-bruiser.pdf
# Tutti gli starter disponibili: attualmente 50 fronti totali
python tools/print-cards/generate.py --all-starters --output output/pdf/botte-micidiali-starter.pdf
# Due copie di ogni starter disponibile
python tools/print-cards/generate.py --all-starters --copies 2 --output output/pdf/starter-doppi.pdf
# Una selezione di mazzi; ripetere lo stesso --starter aggiunge un altro mazzo
python tools/print-cards/generate.py --starter BigBadBruiser --starter ToxicJunkie --output output/pdf/starter-selezionati.pdf
# Aggiungi token o modifica quantità dopo il calcolo dei mazzi
python tools/print-cards/generate.py --all-starters --copies-file tools/print-cards/copies.example.json --output output/pdf/starter-con-token.pdf
```

`--starter` accetta identificatore completo, nome breve della classe (per esempio `ToxicJunkie`) o nome visualizzato del personaggio, tra virgolette se contiene spazi. Il confronto ignora maiuscole/minuscole. Se un nome è ambiguo, usare l'identificatore completo mostrato da `--list-starters`. `--starter` è ripetibile; non si combina con `--all-starters`.

La modalità starter conta automaticamente il personaggio, ogni slot delle carte iniziali (basic, bound e last resort) e le quantità delle carte regolari. Le copie condivise tra mazzi si **sommano**, comprese le last resort. I fronti restano raggruppati per carta: per dividerli nei mazzi, seguire le composizioni riportate nella guida. Il manifest registra selezione e quantità finali.

Con `--starter` o `--all-starters`, **`--copies` moltiplica i mazzi**; `--copies-file` imposta poi quantità assolute per le singole carte. Senza selezione starter, restano valide le opzioni di stampa del catalogo descritte sopra. I token generati in partita non fanno parte degli starter e vanno aggiunti esplicitamente tramite JSON; l'esempio include 4 BrokenBeerBottle.

Gli starter sono individuati dai proprietari nelle due tabelle SQLite: nessun elenco fisso di personaggi o quantità nel codice. Un nuovo starter con personaggio, carte e riferimenti normativi validi compare automaticamente nell'elenco e in `--all-starters`, usando lo schema attuale delle tabelle. Quantità non positive, riferimenti mancanti, mazzi regolari assenti e sottotipi iniziali non validi vengono segnalati prima di scrivere il PDF. Il regolamento e il gioco non vengono modificati.

## Nuove carte

A ogni esecuzione vengono rilette tutte le righe di `CRD001_GUI` e `CRD003_CHARACTERS`, senza limite fisso al numero di carte. Nomi e descrizioni provengono da SQLite; classificazione, costi, priorità, bersagli, risorse iniziali ed effetti sono confrontati/ricavati dalle schede del documento del set, `docs/sets/base.md` (opzione `--set`; dal regolamento 1.13 le carte non sono più in R07). L'allegato `docs/rules-catalog.json` deve dichiarare lo stesso set e la stessa versione. I token, assenti dal database, sono scoperti dalla sezione `tokens` dell'allegato, con effetti dal documento del set. Sulle carte si stampano versione del regolamento e del set. Gli starter sono letti da `DCK001_STARTERS` e `DCK002_STARTERS_CH`.

Aggiungere carte secondo AGENTS.md: prima aggiornare il documento del set, poi database, allegato, test e client. Non occorre aggiornare questo script per aggiunte nei tipi e formati correnti. Una carta aggiunta **solo al database** causa un errore esplicito: mancherebbero dati normativi sufficienti per stamparla correttamente. Nuovi schemi di tabella o nuove meccaniche/tipologie possono richiedere un'estensione del lettore. Lo script rifiuta testi che non entrano anziché troncarli o ridurne automaticamente il carattere. Gli effetti usano 9 pt; i promemoria 7 pt; gli identificatori 6 pt.

L'unico rinvio specifico completato automaticamente è BrokenBeerBottle (SingleUse da R05); la durata di MadeOfStone è nella sua scheda dal regolamento 1.13. Nessun effetto è riscritto per armonizzarlo a vecchie descrizioni. In particolare RottenBeer non equipaggia; AnotherRottenBeer genera il token consumandola. SoberUp non viene esportata perché esclusa dal catalogo/regolamento.

## Stampa e taglio

- Carta **A4**, stampa a colori, solo fronte, **dimensioni effettive / 100%**, senza adattamento alla pagina e senza modalità senza bordi che ingrandisca il foglio.
- Impostazioni iniziali: taglio **62 × 87 mm**, 9 fronti per foglio in griglia 3 × 3, spazio di taglio 3 mm. Griglia centrata: margini reali 9 mm orizzontali e 15 mm verticali; segni esterni lunghi 1 mm distanziati di 0,5 mm dalla carta.
- Prima di stampare tutto, misurare il segmento da 50 mm della legenda e una carta. La precisione finale dipende dalla stampante e dal taglio, non certificabili dal PDF.
- Stampa le sole pagine dei fronti se non serve la guida. Segui i piccoli segni esterni, usando righello e taglierina. Inserisci davanti a una carta di supporto nella sleeve; verifica prima una sleeve reale.
- Campiture ridotte, fondo bianco, testi e simboli vettoriali. Colori supportati da forme ed etichette per restare distinguibili anche con resa cromatica variabile.

## Bozza del Set Base

Con `--bozza` la sorgente non è il catalogo vivo (SQLite, `docs/sets/base.md`, `docs/rules-catalog.json`) ma la bozza del Set Base, `server/src/test/resources/set-base/bozza.json` (o il percorso indicato): 7 personaggi, 116 carte e i mazzi. Serve a stampare la bozza corrente per giocare di persona. **Non è normativa**: le regole del playground sono in `docs/design/set-base/regole-playground.md` (profilo d50) e la guida le richiama senza riprodurle. Il modo vivo resta invariato (stessi PDF e stessi manifest, byte per byte).

```powershell
# Le 123 carte della bozza (7 personaggi + 116 carte), una copia ciascuna
python tools/print-cards/generate.py --bozza
# Elenca i 26 mazzi (starter-* e mazzi di misura prova-*, iso-*) senza creare PDF
python tools/print-cards/generate.py --bozza --list-starters
# Un mazzo: identificatore (anche senza "starter-"), identificatore del personaggio o nome visualizzato
python tools/print-cards/generate.py --bozza --starter starter-spazienzio --output output/pdf/bozza-starter-spazienzio.pdf
python tools/print-cards/generate.py --bozza --starter "Beppe Bulletta" --copies 2
# I 5 starter-*; con --all-decks tutti i 26 mazzi
python tools/print-cards/generate.py --bozza --all-starters
python tools/print-cards/generate.py --bozza --all-starters --all-decks
# Un'altra bozza, quantità puntuali
python tools/print-cards/generate.py --bozza altra-bozza.json --copies 0 --copies-file tools/print-cards/copies.example.json
```

Uscite: `output/pdf/bozza-set-base.pdf` (catalogo) oppure `output/pdf/bozza-starter.pdf` (mazzi) con il relativo `.manifest.json`; si cambia con `--output`. Le stampe della bozza non vanno aggiunte al repository: cambiano a ogni revisione.

- **Fronti.** Nome, tipo e rarità, costo, priorità, bersaglio, ruolo ed eventuale danno nominale, testo stampato, codice di slot e identificatore. Personaggi: risorse iniziali, capacità oggetti, immunità, base e legate. Ogni fronte porta «BOZZA PROVVISORIA», la versione del set, il profilo delle regole (`d50`, letto dal titolo di `regole-playground.md`) e i primi 12 caratteri dello SHA-256 di `bozza.json`: una stampa vecchia si riconosce dall'impronta, che il manifest riporta intera. Le carte senza `targets` nella bozza (quelle con classe Java) stampano «Bersaglio: come da testo».
- **Simboli.** I segnaposto `[[H]] [[A]] [[V]] [[T]] [[L]]` diventano i simboli vettoriali del client, portati da `client-web/src/symbols.ts` e `readability.ts` in `symbols_pdf.py` (stesse forme e colori; il contorno scuro di tossicità e alcol sul fondo chiaro come sul tavolo; nessun glifo di font). Un segnaposto sconosciuto o non chiuso interrompe la generazione. `SymbolPortTest` confronta colori e forme letterali con i sorgenti TypeScript: se il client cambia un simbolo il test fallisce e `symbols_pdf.py` va riallineato. Le forme calcolate (stella del danno, ottagono del contrasto, colpo e taglio) sono portate con la stessa formula; il test ne controlla i parametri.
- **Mazzi.** Conteggio = personaggio + base + 2 legate + ultima risorsa + 20 carte = 25 fronti. Le copie condivise fra mazzi si sommano. `--all-starters` stampa i soli `starter-*` (i giocabili; i `prova-*` e `iso-*` sono mazzi di misura e darebbero 650 fronti); `--all-decks` li include. Un nome di personaggio con più mazzi di misura e nessuno starter (oggi Sergio Sommerso e Duccio Braccio Teso) è ambiguo: l'errore elenca gli identificatori da usare. `--copies` moltiplica i mazzi, `--copies-file` imposta quantità assolute (identificatori della bozza).
- **Guida.** Avviso di bozza, rinvio a `regole-playground.md`, istruzioni di stampa con controllo da 50 mm, legenda dei simboli (risorse, ruoli, danni), lettura della carta e composizione dei mazzi stampati (o degli starter con il catalogo).
- **Testi che non entrano.** Come nel modo vivo non si tronca né si riduce: ogni carta è disposta una volta su una pagina di prova e tutte le carte che non entrano vengono elencate insieme (identificatore, lunghezza del testo, motivo) prima di scrivere il PDF. Con il formato predefinito 62 × 87 mm entrano tutte, a 9 pt per il testo.
- **Riesecuzione.** Dopo una modifica di `bozza.json` basta rilanciare lo stesso comando: la bozza è riletta a ogni esecuzione e un mazzo non valido (carta mancante, 20 carte, 2 copie, 2 legate del proprio personaggio) è un errore esplicito.

## Verifiche riproducibili

```powershell
python -m pip install pypdf
python tools/print-cards/verify.py
python tools/print-cards/test_generator.py   # include i test del modo bozza e del porting dei simboli
./scripts/build.ps1 -Task Test -Offline
python scripts/check-rules.py
# Poppler deve essere disponibile nel PATH per il controllo visivo
pdftoppm -r 120 -png output/pdf/botte-micidiali-carte.pdf tmp/pdfs/print-cards/page
```

`verify.py` verifica il PDF predefinito, oppure un percorso come primo argomento: inventario corrente, quantità, dimensioni A4, rettangoli di taglio effettivamente presenti nel PDF, margini, assenza di sovrapposizioni tra carte e presenza dei testi integrali. Il generatore misura tutti i paragrafi prima di pubblicare il risultato, senza riduzione automatica. Revisionare comunque ogni pagina renderizzata, soprattutto dopo aggiunte o modifiche. La verifica del PDF alternativo presuppone le fonti standard del progetto.

La generazione usa solo ReportLab; pypdf e Poppler servono alla verifica. Nessuna modifica alle meccaniche del gioco. Test di regole e unitari non certificano avvio completo di Spring né partita end-to-end.
