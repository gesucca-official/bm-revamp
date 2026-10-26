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

A ogni esecuzione vengono rilette tutte le righe di `CRD001_GUI` e `CRD003_CHARACTERS`, senza limite fisso al numero di carte. Nomi e descrizioni provengono da SQLite; classificazione, costi, priorità, bersagli, risorse iniziali ed effetti sono confrontati/ricavati dalle tabelle R07 di `docs/game-rules.md`. I token, assenti dal database, sono scoperti dalla sezione `tokens` di `docs/rules-catalog.json`, con effetti da R07. Gli starter sono letti da `DCK001_STARTERS` e `DCK002_STARTERS_CH`.

Aggiungere carte secondo AGENTS.md: prima aggiornare il regolamento, poi database, allegato, test e client. Non occorre aggiornare questo script per aggiunte nei tipi e formati correnti. Una carta aggiunta **solo al database** causa un errore esplicito: mancherebbero dati normativi sufficienti per stamparla correttamente. Nuovi schemi di tabella o nuove meccaniche/tipologie possono richiedere un'estensione del lettore. Lo script rifiuta testi che non entrano anziché troncarli o ridurne automaticamente il carattere. Gli effetti usano 9 pt; i promemoria 7 pt; gli identificatori 6 pt.

Gli unici rinvii specifici completati automaticamente sono MadeOfStone (durata da R05) e BrokenBeerBottle (SingleUse da R05). Nessun effetto è riscritto per armonizzarlo a vecchie descrizioni. In particolare RottenBeer non equipaggia; AnotherRottenBeer genera il token consumandola. SoberUp non viene esportata perché esclusa dal catalogo/regolamento.

## Stampa e taglio

- Carta **A4**, stampa a colori, solo fronte, **dimensioni effettive / 100%**, senza adattamento alla pagina e senza modalità senza bordi che ingrandisca il foglio.
- Impostazioni iniziali: taglio **62 × 87 mm**, 9 fronti per foglio in griglia 3 × 3, spazio di taglio 3 mm. Griglia centrata: margini reali 9 mm orizzontali e 15 mm verticali; segni esterni lunghi 1 mm distanziati di 0,5 mm dalla carta.
- Prima di stampare tutto, misurare il segmento da 50 mm della legenda e una carta. La precisione finale dipende dalla stampante e dal taglio, non certificabili dal PDF.
- Stampa le sole pagine dei fronti se non serve la guida. Segui i piccoli segni esterni, usando righello e taglierina. Inserisci davanti a una carta di supporto nella sleeve; verifica prima una sleeve reale.
- Campiture ridotte, fondo bianco, testi e simboli vettoriali. Colori supportati da forme ed etichette per restare distinguibili anche con resa cromatica variabile.

## Verifiche riproducibili

```powershell
python -m pip install pypdf
python tools/print-cards/verify.py
python tools/print-cards/test_generator.py
./scripts/build.ps1 -Task Test -Offline
python scripts/check-rules.py
# Poppler deve essere disponibile nel PATH per il controllo visivo
pdftoppm -r 120 -png output/pdf/botte-micidiali-carte.pdf tmp/pdfs/print-cards/page
```

`verify.py` verifica il PDF predefinito, oppure un percorso come primo argomento: inventario corrente, quantità, dimensioni A4, rettangoli di taglio effettivamente presenti nel PDF, margini, assenza di sovrapposizioni tra carte e presenza dei testi integrali. Il generatore misura tutti i paragrafi prima di pubblicare il risultato, senza riduzione automatica. Revisionare comunque ogni pagina renderizzata, soprattutto dopo aggiunte o modifiche. La verifica del PDF alternativo presuppone le fonti standard del progetto.

La generazione usa solo ReportLab; pypdf e Poppler servono alla verifica. Nessuna modifica alle meccaniche del gioco. Test di regole e unitari non certificano avvio completo di Spring né partita end-to-end.
