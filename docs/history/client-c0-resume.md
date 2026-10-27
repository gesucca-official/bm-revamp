# Punto di ripresa C0-R2–R5

> **Documento storico archiviato, concluso.** Punto di ripresa scritto durante
> la sospensione del 27 ottobre 2026, prima in `docs/reports/`. La ripresa ha
> completato misure finali, rapporto, inventario e allineamento della roadmap;
> in seguito la prova fisica e la revisione del proprietario hanno **chiuso C0**
> ([esiti](../reports/client-c0-r5-procedure.md#esiti)). Stato corrente
> nell'[indice della documentazione](../README.md#stato-corrente). Attività
> restanti, comandi e note sul workspace sotto descrivono soltanto il momento
> della sospensione: non sono istruzioni attuali.

27 ottobre 2026. **Lavoro sospeso su richiesta del proprietario per limite
di utilizzo. C0 aperta; C1 non iniziata.** Questo documento serve al modello
che riprenderà il lavoro. Non è un rapporto finale di accettazione.

## Richiesta da completare

Il proprietario ha approvato i tre mockup R1 come riferimento visivo, poi ha
autorizzato C0-R2–R5: una sola scena interattiva con DTO sintetici, verifiche
di interazioni/interruzioni/leggibilità/fluidità/peso. Regole, server,
catalogo e debug invariati. Separare desktop reale, emulazione e touch fisico;
lasciare C0 aperta se manca un criterio essenziale. Alla consegna verificare
la corretta esecuzione di C0 e spiegare come proseguire la roadmap dopo il
cambio grafico. Non iniziare C1.

Leggere AGENTS.md, CONTRIBUTING.md, docs/game-rules.md (1.6),
[roadmap corrente](../client-roadmap.md) e
[revisione bar](../design/client-c0/bar-table-revision.md).
**Questi ultimi due documenti contengono ancora paragrafi obsoleti R1**:
la loro riconciliazione è un lavoro restante, non un nuovo divieto di R2.
Non usare subagenti: non richiesti. Nessun commit richiesto.

## Risultato presente

- App nuova isolata in [client-c0/revision](../../client-c0/revision/README.md).
  Il vecchio laboratorio Angular in client-c0 resta storico, non è stato
  migrato né usato come fonte grafica. Duello e FFA sono configurazioni
  della stessa scena. Nessuna connessione REST/STOMP o motore delle regole.
- PixiJS 8.22.0, React/ReactDOM 19.3.1, TypeScript 5.9.3, Vite 8.3.5;
  Node 24.13.0 e npm 11.6.2 isolati in .tools/client-c0.
  Dipendenze installate, package-lock presente, produzione in dist.
- [Approvazione R1](../design/client-c0/r1/approval.md): duello, FFA cinque,
  carta/ispezione; file identificati da SHA-256 in r1/assets.json.
- Nuove PNG sorgenti in docs/design/client-c0/r2-assets: table.png e atlas.png.
  WebP di produzione in revision/public/art, manifest con hash e dimensioni.
  Tavolo, 12 illustrazioni nuove, cornici/dorsi/testi separati. Nessun asset
  precedente. Nessuna immagine R1 intera usata come schermata cliccabile.
- Screenshot reali della build in docs/design/client-c0/r2-screenshots:
  desktop, landscape-emulated, relative ispezioni, portrait, context-restored.

Il codice ha ventaglio proprio, quattro mani coperte dai conteggi, nove
carte oggetto alle capacità 1/3/1/3/1, scelta/drop/check, bound con scarto,
riordino locale drag/scambio/tastiera, dettagli HTML, focus e movimento
ridotto. Pending/rifiuto/drop/ripresa sono iniezioni sintetiche nel laboratorio.
Clock assoluto sintetico continuo, nessun esito calcolato localmente.
Animazioni da identità pubblicate nelle mosse, trasferimento osservabile
fra viste e delta aggregati: nessun parsing dei report per inventare effetti.
Portrait richiede rotazione; il minimo 844×390 resta da approvare fisicamente.

## Ultime correzioni e verifiche concluse

Il processo di verifica avviato prima della sospensione è **terminato con
exit code 0**. Nessuna misura è lasciata a metà. Non avviare subito altre
suite pesanti: prima leggere le evidenze già disponibili.

- 8 test di stato PASS; build TypeScript/produzione PASS.
- Verify ora esegue sia tools/verify.mjs sia tools/lifecycle.mjs: PASS
  desktop 1366×768, landscape emulato 844×390, portrait emulato 390×844;
  10 ulteriori controlli lifecycle PASS. Log finale locale:
  .build-logs/client-c0-r2/verification-final.log.
- [verification.json](../reports/client-c0-r2/verification.json) e
  [lifecycle.json](../reports/client-c0-r2/lifecycle.json): comandi ordinari/bound/oggetti,
  SELF, copie equivalenti, zero invii da cancel/riordino, touch nativo iniettato
  via CDP, zoom/orientamento emulati, focus rimosso recuperato, clock durante
  drop, perdita/ripristino WebGL tramite vera estensione, teardown React.
  Il background headless usa anche segnale sintetico: è dichiarato nel test.
- [size.json](../reports/client-c0-r2/size.json) aggiornato dopo l'ultima build:
  **255386 byte JS gzip, 941002 byte totali gzip**, PASS sui budget
  512000 / 1048576. Include TUTTI i file produzione, anche chunk facoltativi,
  texture e manifest. PNG di revisione esclusi perché non distribuiti.
- [performance.json](../reports/client-c0-r2/performance.json): due catture di 60+ s
  completate in Edge visibile su Windows, Ryzen 5950X, 32 GiB, RTX 2060.
  Desktop: 60.16 s, 7211 frame, p95 8.5 ms, 99.986% entro 20 ms,
  input massimo 27.4 ms. Touch emulato sullo STESSO PC: 61.88 s,
  7275 frame, p95 8.6 ms, 99.931% entro 33 ms, input massimo 25 ms.
  Raw frame/input in frames-desktop.json e frames-touch-emulated.json.
  È input→frame software, non latenza hardware di un dito.
  **Queste misure precedono le ultimissime correzioni sotto**: ripetere una
  sola cattura finale dopo congelamento del codice, o dichiarare precisamente
  la differenza. Non attribuire questi numeri a un telefono fisico.
- Verifiche base già eseguite: Test -Offline PASS (251 server + 36 debug),
  check-rules.py PASS, TestServerContext -Offline PASS (358, include avvio
  Spring, casi sovrapposti agli unitari), verify-match-manifests.py PASS.
  Log locali in .build-logs/client-c0-r2/{base-test,rules,context,manifests}.log.
  Server/regole/debug non cambiati dopo queste suite: non serve ripeterle
  solo per documentazione. Non confondere unitari e avvio applicativo.

Correzioni appena incluse nell'ultima build e verificate:

1. Una vista dello stesso turno senza pending non sblocca un SEND in corso
   o incerto. Solo pending, turno nuovo, rifiuto o snapshot di ripresa
   esplicito chiariscono l'esito. Model.receive ha quarto argomento recovered.
2. Drop su proprio oggetto vicino alla fascia mano dà precedenza al bersaglio
   compatibile, evitando un riordino involontario. Verificato via browser.
3. «Annulla ordine» ripristina anche l'anteprima tastiera, come Escape.
4. Dettaglio oggetto non presenta priorità propria: vale quella dell'azione
   che lo consuma. Nessuna descrizione SQLite modificata.
5. Fixture dopo turno esplicita costo VIOLENCE di Ada e due decrementi deck;
   resta uno snapshot fisso, non un calcolo della scelta dell'utente.

Correzioni precedenti rilevanti: pulsanti touch eseguono un solo click anche
subito dopo un drag catturato (PressButton); renderer getter tollera init
asincrona; input Pixi disattivato, un solo controller native Pointer Events;
ordine hit test corrisponde ai livelli grafici; dettaglio senza suffissi
normativi; animazioni precomposte, niente testo ricreato per frame.

## Lavoro restante, in ordine

1. Audit finale mirato del codice e delle catture. I nomi miniatura sono
   abbreviati ma il dettaglio è completo. Verificare eventuali criteri ancora
   scoperti senza espandere C0 a un client completo. Non aggiungere C1.
2. Congelare codice e rifare Measure una volta (2 campioni 60+ s) con Edge
   visibile. Non eseguire altri carichi pesanti contemporaneamente.
3. Scrivere docs/reports/client-c0-r2-report.md: matrice C0-R1–R5,
   prove effettive/emulazione/limiti, metriche e link alle evidenze. C0 **aperta**
   per touch fisico e breve giudizio umano sulla scena interattiva/minimo.
   L'approvazione delle immagini non certifica automaticamente i gesti.
4. Riconciliare roadmap v6 (data 27/10), bar-table-revision.md,
   docs/design/client-c0/README.md, r1/README.md e client-c0/README.md.
   Eliminare le affermazioni correnti «R1 in attesa», «R2 non implementata»,
   «stop prima del prototipo», «nessun pacchetto installato». Conservare
   i rapporti storici come storici, senza riscriverli come prove nuove.
   Registrare R1 approvata, R2–R4 implementate e testate, R5 parziale,
   gate C0 aperto; C1–C5 future.
5. Documentare provenienza nuovi asset (r2-assets/README.md e inventario).
   tools/assets.mjs fa SOLO compressione WebP via sharp, nessun ritocco.
   Le PNG imagegen sono state generate da riferimento R1 approvato:
   table = exec-aab12c73-7003-424c-83e8-715bb6c57ae0.png,
   atlas = exec-fb70fe18-8ea7-4404-bb7d-6fc4e8d2a941.png,
   nella cartella generated_images della chat
   01a17a11-6e74-7d13-a1e6-66d75266dfd9 sotto C:/Users/gesucca/.codex.
   I prompt R2 erano in store del tool, ma dopo la ripresa risultano persi:
   **non inventare prompt esatti**. Se irrecuperabili dichiarare la lacuna,
   fornendo solo un riepilogo etichettato come ricostruzione. Prompt R1 salvati.
6. Rimuovere solo i residui temporanei noti: r2-screenshots/touch-debug.png
   e client-c0-r2/verification-failure.txt (test ora verdi). Controllare link
   locali, accuratezza dei README e diff finale.
7. Confrontare gli hash protetti e il diff con
   .build-logs/client-c0-r2/protected-before.json e protected-before.diff.
   Questi coprono regole/catalogo/debug e diff server/client-debug/cli.
   Non sovrascrivere modifiche preesistenti dell'utente.
8. Consegna italiana con anteprima/link scena, rapporto e roadmap, criteri
   mancanti e percorso successivo. Prima prova fisica e revisione umana;
   solo a gate chiuso C1 login→quick 1vCom→partita→esito. C2 parità 44 percorsi
   e FFA, C3 risoluzione osservabile, C4 art/audio/layout, C5 playtest.
   La grafica approvata entra già in C1, non va rimandata a C4.

## Comandi utili

Dalla radice E:/bm, PowerShell:

```powershell
./client-c0/revision/run.ps1 -Task Build
./client-c0/revision/run.ps1 -Task Test
./client-c0/revision/run.ps1 -Task Verify
./client-c0/revision/run.ps1 -Task Size
$env:C0_HEADED = '1'
./client-c0/revision/run.ps1 -Task Measure
Remove-Item Env:C0_HEADED
./client-c0/revision/run.ps1 -Task Serve
```

Serve: http://127.0.0.1:4310, solo build sintetica. Gli script browser aprono
un server temporaneo su porta casuale e lo chiudono a fine prova. Non è
necessario lasciare processi in background per riprendere. Il comando shell
predefinito talvolta fallisce con helper_unknown_error: exec_command con
sandbox_permissions require_escalated ha funzionato tramite revisione
automatica. apply_patch funziona. Non aggiungere nuovi servizi o deploy.

## Stato del workspace da preservare

Già sporchi prima di R2: README.md, client-debug/README.md, docs/api.md,
architecture.md, client-roadmap-preparation.md, data-model.md, domain-model.md,
feature-inventory.md, open-questions.md, overview.md, roadmap.md,
technical-debt.md. Già non tracciati: client-c0/, docs/client-c0-parity.md,
docs/client-roadmap.md, docs/design/, docs/reports/client-c0-report.md e
docs/reports/client-c0/. Nuovi esiti R2 sono sotto docs/reports/client-c0-r2/.
Non ripristinare il workspace e non includere cache/log/database applicativi.
