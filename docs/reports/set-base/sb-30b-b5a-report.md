# SB-30b — B5a: tavola su più turni e testo stampato

14 novembre 2026. Base `618b9f3`, successiva a `0af33b5`, allineata a `origin/main` dopo fetch.
Attuazione di B5a del [progetto](../../design/set-base/sb-30b-progetto.md#5-piano-a-blocchi),
approvato in [D85 e D91](../../set-base-plan.md#decisioni-del-proprietario).
Nessun Difficile, Maestro, campionatore o scala. Nessun push; STOP dopo il commit.

## Cosa cambia

- Nuova `model.game.bot.ViewTable`, port della tavola di `Sb30bWorld`: copie indipendenti, risorse, immunità, stati con durata,
  uso singolo e conversione, costi prima dei gruppi di velocità, autore a terra, contromosse, oggetti, scarto, pesca/ricerca,
  gettoni e segni, TOXICITY, ALCOHOL e scadenze. `forecast` usa solo vista e catalogo di testo pubblico, con varianti d'ordine
  e ricerca; `world` riceve mani e mazzi concreti già campionati dal chiamante. Non campiona e non legge partite.
  `copy`, `view`, `playTurn`, `health` e `resources` permettono di proseguire e ramificare la previsione.
- `PrintedEffects.Step` espone additivamente nome/descrizione, durata, uso singolo ed equip dello stato, binding cercato e
  tipi del gettone; `DataCards.printed` li copia dalla definizione. Liste, insiemi e mappe esportati dal caricatore sono copie.
- Per chiudere gli scarti della sonda serve anche il testo consumato di due oggetti Java: `PrintedEffects.consumedText` è una
  lettura pubblica supplementare per il catalogo della nuova tavola. La bottiglia rotta usa la propria fabbrica pubblica dello
  stato; la Tennents legge la quantità dal campo pubblico `gains` e dichiara la bottiglia che crea (`spawnedItem`).
  Le due carte Java continuano a non implementare `PrintedEffects.Source`: nessun bot esistente usa questa lettura o i campi nuovi.
- La tavola distingue le copie trovate anche quando hanno testo uguale, mantiene visibili le carte mostrate dell'avversario,
  conta le pescate ignote senza inventarne le carte, preserva la capienza del campo e il conto alla rovescia D71 nel mondo
  concreto, anche per un gettone la cui copia non è più mostrata.

Le sole classi esistenti modificate sono `PrintedEffects` e `DataCards`. Bot esistenti, `TurnForecast`, `BotView`, banco e motore
restano invariati nei sorgenti. Invariati anche `TurnForecastFidelityTest`, sonda B4, bozza, regolamento, `docs/sets`, catalogo,
client, piano e README. Non toccati `prototipi/carriere` e `docs/design/carriere`.
Nessun atteso esistente cambiato; i nuovi test verificano il comportamento già vigente, senza modifiche normative.
Confronto diretto con i blob della base: **186 file Java esistenti di main identici byte per byte**, escluse le due classi
autorizzate; identico anche il sorgente di `TurnForecastFidelityTest`.

## Fedeltà permanente e quattro scarti chiusi

`ViewTableFidelityTest` è sempre attivo: stessi 300 semi, mazzi, politiche e filtri di `TurnForecastFidelityTest`, per A e B.
Al primo turno confronta **l'insieme completo delle varianti di salute** con `TurnForecast.variants`, oltre che con il motore.
A due turni confronta salute e tutte e cinque le risorse con le mosse effettivamente giocate.

| Insieme sulla bozza 1.5 | A | B |
|---|---:|---:|
| Primo turno: equivalenza delle varianti e fedeltà | 5.526/5.526 | 5.536/5.536 |
| Due turni: salute | 3.026/3.026 | 3.032/3.032 |
| Due turni: tutte le risorse | 3.026/3.026 | 3.032/3.032 |
| Viste a due turni escluse per oggetti arrivati fra i turni | 1.878 | 1.882 |
| Round esclusi per timer/mossa vuota | 72 | 73 |

I numeri della [sonda B4](sb-30b-sonda-report.md#fedeltà-a-due-turni-fidelityjson), 5.412 e 2.934, precedono la 1.5.
Sul port iniziale e sulla 1.5 erano riprodotti **gli stessi quattro scarti**, A 2.982/2.986 sulla salute e 2.954/2.986 sulle
risorse. Non dipendevano dall'effetto di Spallata: mancava il consumo dell'oggetto Java nel turno precedente.

| Seme e finestra | Causa | Chiusura |
|---|---|---|
| 7.100.093, turni 7→8, entrambi i posti | Grab consuma Broken Beer Bottle al turno 7. Al turno 8 Spintone 7 HIT diventa 10 CUT: salute di seat-1 **29→19**, non 22. La sonda perdeva l'equip fra i turni | Test permanente sui due posti: salute prevista uguale al motore, senza escludere la finestra |
| 7.100.115, turni 8→9, entrambi i posti | Questo lo finisco io consuma Broken Beer Bottle al turno 8. Spallata 3 HIT diventa 4 CUT, poi il gettone di PAZIENZA lo porta a 6: salute di seat-1 **62→56**, non 58/59 | Stessa prova esplicita sui due posti, in entrambi i bracci |

Il test esige **quattro finestre di regressione per braccio**, per impedire che spariscano per un filtro.
Gli ulteriori scarti delle risorse venivano dal consumo della Tennents senza il suo guadagno di ALCOHOL.
Modellarne anche la creazione pubblica della bottiglia riporta nel campione 40 viste di A e 40 di B che il port iniziale
classificava come oggetto ignoto: la creazione è nota dal testo, la pesca resta ignota.

**Esclusione confermata:** un oggetto pescato fra i turni non è prevedibile in modo `forecast`. Le relative finestre restano
escluse, conteggiate e non dichiarate fedeli. Il modo `world` verifica invece la pesca concreta, l'arrivo degli oggetti e
l'espulsione del più vecchio a capienza piena; qui non si misura la fedeltà statistica di un campionatore.

## Test mirati e mutazioni

Sette test di `ViewTableTest`: durata e indipendenza delle copie; uso singolo applicato a tutti i colpi dello stesso turno
e rimosso a fine turno; tipi del gettone, guadagni di ricerca e ordine rispetto al veleno periodico; pesca concreta e capienza;
ricerca senza vulnerabilità ma con carta mostrata; ultima copia assente con un turno intero residuo; divieto d'importare
tipi del motore o riflessione. Due test di `PrintedEffectsCompletionTest` controllano la copia dei metadati, l'indipendenza
dalle collezioni della definizione e il testo supplementare degli oggetti Java, lasciando intatta l'interfaccia usata dai bot.

Quattro mutazioni, tutte uccise da asserzioni, non da errori di compilazione:

| Mutazione in `ViewTable` | Test che cade |
|---|---|
| Il contatore della durata non diminuisce | `statusDurationAndCopiesCarryIntoTheNextTurn` |
| L'uso singolo non imposta la scadenza | `singleUseConvertsEveryHitInItsTurnThenExpires` |
| Il gettone amplifica tutti i tipi invece dei soli stampati | `searchUsesItsPrintedTypesAndKeepsTheTokenThroughPeriodicDamage` |
| Guadagni di ricerca trovata/fallita invertiti | stesso test della ricerca |

Mutanti compilati in `target/classes` con `javac` dal rispettivo sorgente temporaneo, poi `mvn surefire:test -Dtest=ViewTableTest`;
sorgente di prodotto mai sostituito. Classe originale ricompilata nel `finally`, prima delle verifiche finali.

## Identità e verifiche

Risultati finali registrati in [evidence.json](sb-30b-b5a/evidence.json).

| Verifica | Esito |
|---|---|
| `ChargeMeasureTest#measure`, passo 0 B 1.5, 4 semi per cella | **8.640 partite**, matrice JSON/Markdown, osservazioni, bozza e braccio identici byte per byte a `tmp/sb16g15/step0-B` |
| `ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, regole 1.13 | **480.000 partite**, JSON 266.868 B e Markdown 26.111 B identici byte per byte alla base della 1.5; SHA-256 `069817b8…486c` e `966af023…19be` |
| `TurnForecastFidelityTest` invariato | **A 5.526/5.526, B 5.536/5.536**, 72/73 esclusi per timer, esattamente come nella 1.5; eseguito nella suite ordinaria |
| `./scripts/build.ps1 -Task Test -Offline` | **811 test server, 0 falliti/errori, 17 saltati; client-debug 37/37** |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **928 test, 0 falliti/errori, 17 saltati**, contesto applicativo e CLI compresi; verifica separata |
| Client-web Test, Build, Size con `BM_OUT` | **356/356**, build e limiti verdi; JS gzip 352.574 B, totale gzip 1.762.731 B, texture 27.729.048 B entro 32 MiB |
| `python scripts/check-rules.py`, `python scripts/check-links.py`, `git diff --check` | Verdi; nessun rosso finale, nessuna voce del registro da aggiungere |

## Tempo speso

Il budget B5a conta l'orologio delle corse dedicate alla logica nuova, compilazione compresa, come nella sonda.
Le verifiche obbligatorie e d'identità sono registrate separatamente, come nella sezione «Tempo speso» del rapporto B4.
Nessuna misura o altro Maven contemporaneo; controllo dei processi Java prima delle corse. Nessun giro dei livelli.

| Calcolo B5a | Secondi |
|---|---:|
| Port iniziale: riproduzione dei quattro scarti sulla 1.5 | 38,486 |
| Testo degli oggetti completato, fedeltà A/B | 40,014 |
| Prima compilazione dei nuovi casi mirati, errore nel tipo della fixture del test | 22,280 |
| Fixture corretta, casi mirati e fedeltà | 42,672 |
| Prova finale mirata, copie e gettoni | 55,364 |
| Quattro mutazioni, compilazioni e ripristino compresi | 63,721 |
| Traccia diagnostica sui due semi, compilazione compresa | 3,570 |
| **Totale B5a** | **266,107 / 300** |

Rossi intermedi chiusi: quattro scarti già documentati dalla sonda; fixture nuova con lista anziché insieme, corretta senza
cambiare il prodotto o attesi esistenti. Nessun rilancio di una misura per cercare un esito favorevole.
Tempi delle verifiche e traccia diagnostica riportati nell'evidenza finale. Log, mutanti, comandi ausiliari e uscite intere:
`%TEMP%/bm-sb30b-b5a-20261114/`.

| Verifiche obbligatorie, fuori dal budget B5a | Secondi di orologio |
|---|---:|
| Identità passo 0 (banco: 23,881 s) | 55,150 |
| Identità viva | 233,724 |
| Test ordinari | 207,583 |
| Contesto Spring completo | 761,429 |
| Client-web Test / Build / Size | 16,310 / 22,941 / 1,252 |

La lunga verifica Spring include i riavvii reali di JVM di `RestartCliTest`; nessun timeout o rosso R3.

## Comandi riproducibili

Da `server/`, JDK 11, Maven, impostazioni e repository di `.tools` come nella sonda:

```powershell
& $mvn @common test '-Dtest=ViewTableTest,ViewTableFidelityTest,PrintedEffectsCompletionTest'
& $mvn @common test '-Dtest=TurnForecastFidelityTest'
& $mvn @common test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.chargeGames=4' `
  '-Dsim.arm=B' '-Dsim.chargeOut=../tmp/sb30b-b5a/step0-B'
& $mvn @common test '-Dtest=ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft' '-Dsim.rules=1.13' `
  "-Dsim.liveReference=$env:TEMP/bm-sb16g2b2-live"
```

La cartella storica viva è **2b2**, la stessa della 1.5: il percorso è nell'intestazione e deve coincidere per l'identità byte
per byte. Non è stata normalizzata alcuna intestazione. Il riferimento storico ha impronta `faf265fa…d7c5`.

## Non verificato e domande numerate

Timer, stati sulle risorse e parte «x» non descritta restano fuori dal modello, come dichiarato nel progetto. Il completamento
supplementare copre i due oggetti Java necessari alla bozza attuale; altri oggetti Java senza testo numerico restano opachi.
Il conto D71 per ultima copia assente è esatto nel mondo concreto; in previsione non si inventa il contenuto del mazzo.
Fedeltà campionata in duello; nessuna prova FFA o concorrenza, nessuna misura di forza, costo dei livelli o prova umana.
Nessuna verifica Playwright: il client non cambia. Lo stato di piano e README resta alla regia.

1. Nessuna domanda bloccante. La regia può valutare B5b sul presente contratto pubblico della tavola, lasciando campionatore,
   memoria e Maestro a B5c.
