# CA-0c — Strumento delle carriere

21 novembre 2026, esecutore avviato dalla regia delle carriere. Blocco [CA-0c](../../ca-plan.md#ca-0c--strumento-delle-carriere), passo
diretto.

**Esito:** **chiuso** il 21 novembre 2026. Convertitore, validazione e controllo del grafo sono in `tools/carriere/`; il prototipo li
importa da lì (un solo convertitore, [DC3](../../ca-plan.md#decisioni)). Il comando dello strumento dà gli stessi numeri che il
prototipo dava prima dell'estrazione. Nessun file protetto toccato (storie del serbatoio, `server/`, `client-web/`, regolamento, set).

## Cosa c'è

- `tools/carriere/src/`: `formato.ts` (tipi), `converti.ts`, `valida.ts`, `grafo.ts` — spostati con `git mv` dal prototipo — e
  `serbatoio.ts` (nuovo: le tre storie, il cast, `convertiCarriera` e le righe di riepilogo, condivisi con il prototipo).
- `tools/carriere/strumenti/controlla.ts`: il comando. Per ogni storia stampa avvisi ed errori, poi nodi, battute, partite, scelte,
  achievement e, se la conversione è pulita, nodi raggiunti, stati, fini, finali, segreti, catene e obbligatori. Esce con 1 se c'è un
  errore di conversione, di validità o di grafo.
- `tools/carriere/run.ps1 -Task Check|Test`, con il Node isolato di `.tools/client-c0`. **Dipendenze proprie: nessuna.** Il codice è
  TypeScript eseguito da Node con `--experimental-strip-types`, come le prove del prototipo; `typescript` e `@types/node` non sono nella
  cache npm offline di `.tools` e non servono a eseguirlo. Le tipizzazioni dei quattro moduli le controlla `tsc` del prototipo
  (`run.ps1 -Task Build`), che li importa: verde.
- `tools/carriere/tests/`: `converti.test.ts` (spostato), `grafo.test.ts` (la parte sul controllo del grafo e sulla validità),
  `aiuto.ts`. 22 prove, verdi.

## Cosa è cambiato nel prototipo

- `src/formato.ts`, `converti.ts`, `valida.ts`, `grafo.ts` e `tests/converti.test.ts` non ci sono più: gli import puntano a
  `tools/carriere/src/`. `idFinale` (prima in `motore.ts`, ma usato dal grafo) vive ora in `converti.ts` accanto a `slug`; `motore.ts` lo
  riesporta.
- `tests/grafo.test.ts` è diviso: il controllo del grafo è nello strumento, la prova di disposizione e stati della mappa resta nel
  prototipo come `tests/mappa.test.ts`.
- `strumenti/carriere.ts` riesporta dallo strumento; `strumenti/converti.ts` usa le sue righe di riepilogo; `strumenti/controlla.ts` è
  tolto e `npm run check` lancia quello dello strumento. `run.ps1 -Task Check` lancia solo `check` (lo strumento converte da sé le stesse
  storie); `Build`, `Dev` e `Phone` convertono come prima, scrivendo `dati/generati/`.

## Formato 0.1

- **«giri n» fuori:** tolta dal tipo `Condizione`, dal convertitore (ora «condizione non riconosciuta»), dalla validazione, dal grafo e
  dalla valutazione del motore. Il contatore `account.giri` resta nel motore (lo usano le prove e il salvataggio), solo non è più una condizione.
- **Prova adattata:** l'indizio «se giri 1» di «Fiuto da segugio» è ora «se esplorato Nodo E» (il retrobottega, dove l'indizio dice di
  guardare). La prova del motore che lo verificava costruisce l'account con il nodo E esplorato; la prova del grafo sull'indizio
  impossibile usa la nuova forma.
- **Avviso nuovo (discrepanza 4 di [CA-0b](ca-0b.md)):** controllo piccolo e pulito in `converti.ts`, dopo la risoluzione delle
  destinazioni: una partita con `**Ritento.**` e `[Sconfitta: …]` segnala «dopo una sconfitta si va al ramo, il ritento non si vede
  mai». Con questo, il `**Ritento.**` morto del nodo C della prova («STAVOLTA LA CONSEGNIAMO NOI.») è stato tolto dalla storia di prova,
  altrimenti la prova avrebbe un avviso. Prova nuova in `converti.test.ts` (l'avviso c'è con il ritento, la prova pulita non ne ha).

## Numeri, prima e dopo

Prima: `run.ps1 -Task Check` del prototipo sul commit di partenza. Dopo: `tools/carriere/run.ps1 -Task Check` e `prototipi/carriere/run.ps1
-Task Check` (le due uscite sono identiche).

| Storia | Nodi raggiunti | Stati | Fini completate / fallite | Finali | Errori / avvisi |
|---|---|---|---|---|---|
| tutorial | 6/6 | 12 | 2 / 0 | completata (2) | 0 / 0 |
| prova | 8/8 | 15 | 4 / 0 | grappino-e-tornato (2), grappino-scappa-di-nuovo (2) | 0 / 0 |
| principale | 27/27 | 665 | 104 / 0 | disco-pub (52), il-serraglio-resta (36), il-serraglio-e-di-tutti (16) | 0 / 49 |

Identici prima e dopo, anche segreti, catene e obbligatori. L'unica differenza di tutta l'uscita è nella riga di conversione della prova:
**3 → 2 battute di ritento** (la riga tolta). Nodi, stati, finali e avvisi della prova non cambiano.

Prove: prototipo 138 → 117, strumento 0 → 22: **139 in tutto** (138 più la prova nuova dell'avviso). `run.ps1 -Task Build` del prototipo
(`tsc` e `vite build`) verde.

## Domande aperte

1. **Dipendenze dello strumento.** Nessuna dipendenza propria: se si vuole un `tsc` dello strumento (con `typescript` e `@types/node`)
   serve prima averli in cache con la rete, un'azione fuori dal perimetro. Basta per CA-0d? In alternativa lo strumento resta senza `tsc`
   proprio e si fida del `Build` del prototipo.
2. **Il formato menziona «giri n»** (sezione sulle estensioni rimaste fuori): ora il convertitore la rifiuta davvero, quindi il testo è
   coerente; non l'ho toccato (fuori dal perimetro).
3. **`Check` del prototipo** non riscrive più `dati/generati/` (lo fa `Convert`, `Build` e `Dev`): voluto, per non convertire due volte.

## Verifiche eseguite

`tools/carriere/run.ps1 -Task Test` (22 verdi) e `-Task Check` (0 errori); `prototipi/carriere/run.ps1 -Task Test` (117 verdi), `-Task
Check` (0 errori, uscita identica a quella dello strumento) e `-Task Build` (verde). Non eseguiti `Misura`, `Banco`, `Registra`. Nessun
push; i file del Set Base non sono toccati né messi in stage.
