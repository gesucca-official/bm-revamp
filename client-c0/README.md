# Botte Micidiali — laboratorio C0

**Scena corrente:** [il tavolo del bar Pixi/React in revision](revision/README.md),
basato sui tre mockup R1 approvati. Avvio sulla porta 4310; rapporto e stato
del gate in [C0-R2–R5](../docs/reports/client-c0-r2-report.md).
**C0 chiusa, C1 non iniziata** ([esiti](../docs/reports/client-c0-r5-procedure.md#esiti)). Le istruzioni sotto riguardano soltanto il
laboratorio Angular storico della prima grafica respinta, sulla porta 4300.

## Storico: prima prova Angular

Una sola scena Angular DOM/SVG a dati sintetici, separata da `client-debug`.
Nessun account, trasporto REST/STOMP, motore, regola simulata o client nativo.
Non è C1 e non certifica parità o una partita reale.

**Grafica della prima prova respinta dal proprietario.** Questo laboratorio
resta invariato come evidenza tecnica; non implementa ancora il tavolo del bar,
il riordino/drag, gli oggetti come carte o i ventagli avversari richiesti nella
[revisione C0-R1–R5](../docs/design/client-c0/bar-table-revision.md).

## Avvio e verifiche

Dalla radice del repository, Windows x64 / PowerShell / Python:

```powershell
./client-c0/run.ps1 -Task Bootstrap
./client-c0/run.ps1 -Task Install
./client-c0/run.ps1 -Task Build
./client-c0/run.ps1 -Task Serve
```

Aprire [la scena locale](http://127.0.0.1:4300). Fermare Serve con Ctrl+C.
Bootstrap usa lo zip ufficiale Node 24.13.0 verificato SHA256; il digest
misurato è `ca2742695be8de44027d71b3f53a4bdb36009b95575fe1ae6f7f0b5ce091cb88`.
Node/npm e cache sono in `.tools/client-c0`; pacchetti e lock in `client-c0`.
Nessuna installazione globale o modifica alla toolchain Node 12 del debug.
Install usa `npm ci`, ripetibile anche con `-Offline` a cache popolata.

```powershell
./client-c0/run.ps1 -Task Verify
./client-c0/run.ps1 -Task Size
# Due catture di 60 s sullo stesso PC con finestra del browser:
$env:C0_HEADED = '1'
./client-c0/run.ps1 -Task Measure
Remove-Item Env:C0_HEADED
```

Le prove usano Microsoft Edge installato (`channel: msedge`), senza scaricare
altri browser. Verify è headless; Measure è headless se non si imposta la
variabile. La seconda cattura usa viewport/touch **emulati sul PC**, non un
telefono. Tenere il browser visibile e il PC libero da altri carichi per le
misure confrontabili. Il server di prova parte su una porta loopback libera
e viene chiuso dai due script, senza backend.

Evidenze in `docs/reports/client-c0/`; screenshot in
`docs/design/client-c0/screenshots/`. Size applica gzip livello 9 a ogni
risorsa effettiva; non usa la stima transfer della CLI Angular. Non confrontare
il peso della scena con quello del futuro client completo a parità C2.

## Uso della scena

Selezionare una carta con click/tap o Tab+Enter, poi bersaglio/oggetto e scarto
quando richiesto. Testo completo nel pannello, senza hover obbligatorio.
Conferma compone soltanto il comando e blocca il doppio invio. Risorse invariate
finché non si carica un'altra fixture.

«Scenari della prova» espone input del laboratorio: rifiuto, drop, pending
fissa di Steal, clock nello stesso turno, vista successiva con trasferimento,
impatto e delta aggregato, morte/forfait/valore negativo. Non sono risposte
del server. Il tempo del countdown è sintetico ed è dichiarato nella scena.
La fixture pending non viene generata dal comando scelto. Per il caso coerente
selezionare Steal → Bice → Peroni → Conferma → Vista pending Steal.

Riparti ristabilisce lo snapshot iniziale, non avvia una partita. Salta effetti,
Escape, nuova vista, resize, selezione, preferenza ridotta e scheda nascosta
cancellano la decorazione. L'input non aspetta la fine della sequenza.
La UI mantiene la vista finale come sola sorgente dei numeri.

## Sorgenti e confini

- `src/contracts.ts`: ritaglio dei DTO Java correnti. Nessun contratto nuovo.
- `src/fixtures.ts`: snapshot precostituiti conformi alle forme dei DTO;
  nessuna promessa che siano una trascrizione di un match eseguito.
- `tools/fixtures.py`: legge il catalogo SQLite in sola lettura, ricompone
  le descrizioni con le keyword come CardFactory, trascrive pochi metadati
  dai costruttori Java. Non contiene risoluzione/costi applicati o RNG.
- `src/main.ts`: scelta locale, anteprima comando, applicazione vista e
  sole animazioni; nessun parsing del report per calcolare regole.
- `window.__c0.stats`: sola telemetria del laboratorio, non un game service.
- `tools/sketches.py`: produce i tre SVG originali; per PNG, dalla cartella
  `client-c0`, eseguire `node tools/render-sketches.mjs` con Node isolato.

Rigenerazione volontaria dei soli elaborati:

```powershell
python client-c0/tools/fixtures.py
python client-c0/tools/sketches.py
```

Non importare art, CSS, font o dipendenze dal debug. Qui si usano font di
sistema e vettori/CSS originali; non occorrono risorse esterne o crediti
di terzi aggiuntivi. Restano i diritti del repository, senza nuova licenza.

[Rapporto C0](../docs/reports/client-c0-report.md) ·
[Checklist](../docs/client-c0-parity.md) ·
[Contratto interazione](../docs/design/client-c0/interaction-contract.md) ·
[Roadmap](../docs/client-roadmap.md)
