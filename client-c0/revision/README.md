# C0 — Il tavolo del bar

Una sola scena PixiJS/TypeScript con shell React, basata sui mockup R1
approvati. FFA cinque e duello sono configurazioni dello stesso tavolo.
Solo DTO sintetici, nessun account, rete REST/STOMP, risolutore o C1.
Regolamento, server, catalogo e debug non sono modificati.

## Avvio

Dalla radice del repository, Windows / PowerShell:

```powershell
# Solo se manca il runtime isolato già usato in C0:
./client-c0/run.ps1 -Task Bootstrap
./client-c0/revision/run.ps1 -Task Install
./client-c0/revision/run.ps1 -Task Build
./client-c0/revision/run.ps1 -Task Serve
```

Aprire [il tavolo](http://127.0.0.1:4310). Serve usa la build di produzione,
solo loopback; Ctrl+C lo ferma. Install accetta `-Offline` a cache popolata.
Per sviluppo: dalla cartella revision, `npm start` con il Node isolato nel PATH.
Le versioni e le integrità sono fissate in `package-lock.json`; nessun runtime
globale o dipendenza del debug viene cambiato.

## Gesti

- Scegli una carta, poi una carta personaggio o una carta oggetto. Puoi
  trascinare direttamente sul bersaglio. Check conferma, × o Escape annullano.
- Per una bound scegli anche lo scarto dalla mano: sono ammesse solo le
  azioni regolari. Nessuna carta è consumata prima di una vista successiva.
- Trascina entro la mano per riordinare. «Riordina» permette di scambiare
  due carte con click/tap; tastiera: focus su carta, frecce, Invio oppure Escape.
- «Dettagli carta» apre il testo. Tab+I ispeziona la carta con focus;
  personaggi e oggetti si ispezionano direttamente senza una scelta attiva.
  I dettagli rimangono consultabili durante l'attesa. Escape richiude.
- Il menu ••• apre riepilogo e laboratorio. Il laboratorio dichiara i dati
  sintetici e permette di iniettare pending, rifiuto, disconnessione, ripresa,
  nuova vista, conteggi 0/1/6/4, testo lungo, morte e forfait.

Il check crea solo un'anteprima dei cinque campi wire. «Mossa accettata»
inietta una ricevuta sintetica della scelta, senza risolverla. «Vista turno
successivo» carica uno snapshot fisso: non dipende dalla carta scelta.
Il countdown usa una scadenza assoluta sintetica; a zero non decide un esito.
Non invia automaticamente comandi dopo la disconnessione.

In portrait compare la richiesta di ruotare: cinque sedi e mano non sono
ridotte a una pagina lunga. Il gesto viene cancellato, il clock continua.
Landscape obbligatorio per decisione del proprietario alla chiusura di C0;
su iPhone 16 Pro Safari offre 750×292 CSS px, giudicati sufficienti.

## Verifiche ripetibili

```powershell
./client-c0/revision/run.ps1 -Task Test
./client-c0/revision/run.ps1 -Task Build
./client-c0/revision/run.ps1 -Task Verify
./client-c0/revision/run.ps1 -Task Size
$env:C0_HEADED = '1'
./client-c0/revision/run.ps1 -Task Measure
Remove-Item Env:C0_HEADED
```

Verify include i flussi browser e i casi di ciclo di vita. Measure esegue
almeno 60 secondi per desktop e landscape touch **emulato sullo stesso PC**.
Con `C0_HEADED=1` Edge resta visibile; lasciare il PC libero da altri carichi.
Senza la variabile la misura è headless e va dichiarata come tale. Nessuna
emulazione equivale a un telefono. Gli script usano Edge installato.

`-Task Physical` serve la stessa build su loopback per un telefono collegato
via inoltro USB e salva la cattura di 65 s inviata dal dispositivo; solo la
pagina servita da questo comando riceve la sonda di misura. Il file resta un
candidato finché l'operatore non attesta modello e input fisico. Per iPhone,
`C0_PHYSICAL_HOST=lan` apre un solo indirizzo privato con codice d'accesso;
`C0_PHYSICAL_PROBE=0` serve la build senza sonda per la revisione umana:
[procedura C0-R5](../../docs/reports/client-c0-r5-procedure.md).

Le evidenze sono in [docs/reports/client-c0-r2](../../docs/reports/client-c0-r2/)
e le catture in [r2-screenshots](../../docs/design/client-c0/r2-screenshots/).
Il [rapporto](../../docs/reports/client-c0-r2-report.md) distingue implementazione,
prove automatiche, misure e criteri mancanti. I controlli del repository
rimangono quelli di AGENTS/CONTRIBUTING, incluso il contesto Spring separato.

## Confini del codice

- `src/model.ts`: selezione, riconciliazione delle copie per nome, ordine
  locale e cinque campi del comando. Nessun effetto delle carte calcolato qui.
- `src/scene.ts`: tavolo, illustrazioni, geometria, un controller Pointer Events,
  movimento e interruzioni. Il sistema eventi Pixi è scollegato per evitare
  due gestori concorrenti. HTML semantico non intercetta i puntatori del tavolo.
- `src/main.tsx`: shell, dettagli HTML, accesso al laboratorio e adattatore
  dei pulsanti touch; tutti gli input convergono sugli stessi intenti.
- `tools/fixtures.py`: lettura SQLite in sola lettura; metadati e snapshot
  fissati, conformi ai DTO correnti. Non genera turni eseguendo regole.
- `window.__c0`: strumentazione della sola prova, non un servizio di gioco.
  Espone telemetria e iniezione di fixture; non è un contratto per C1.

Le carte giocate in animazione provengono solo da `resolvedMoves` pubblicate.
Un trasferimento aggregato richiede una diminuzione/aumento osservabile dello
stesso oggetto, con proprietari non ambigui. I delta sono differenze fra viste
finali, non attribuzioni inventate ai singoli effetti. Nessun fronte avversario
è ricostruito dai conteggi, nessuna pesca è dedotta dal conteggio invariato.

## Risorse grafiche

[Provenienza e prompt](../../docs/design/client-c0/r2-assets/README.md).
Solo il nuovo riferimento R1 approvato è usato per generare tavolo vuoto e
atlante di illustrazioni. Cornici, dorsi, testi e numeri sono disegnati dalla
scena; i nomi vengono dal catalogo. Le PNG sorgenti non entrano nella build.
`tools/assets.mjs` produce le WebP senza ritocchi, con sola compressione.
Nessun asset precedente, font remoto o audio incluso.
