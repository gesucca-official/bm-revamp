# O20 — motivo dell'esito dopo un forfait

9 novembre 2026. Blocco solo server, test e documenti propri. Regolamento, set, catalogo, protocollo e client non toccati.
Voce nelle [domande aperte](../open-questions.md#o20--motivo-dellesito-dopo-un-forfait), significato dei motivi in [api.md](../api.md).

## Diagnosi (confermata sul codice)

- FFA con due umani e tre computer, entrambi gli umani in timeout. R06: le scadenze simultanee non chiudono la FFA se restano almeno due
  partecipanti, e contro computer non c'è clock: proseguire è conforme.
- `GameSessionServiceImpl.expireDue` applica i forfait e chiama `advanceAfterForfeit(game, "timeout")`; `leaveGame` chiama
  `advanceAfterForfeit(game, "leave")`.
- `advanceAfterForfeit` risolve i round con `game.resolveMoves`, che con soli computer vivi si richiama da sé
  (`Game.resolveMoves`, ultime righe): i round restanti si risolvono in una sola chiamata. Atteso, non cambiato.
- Difetto: alla fine `finalizeOnce(game, reason)` registrava il motivo del forfait anche se la partita si era chiusa nella risoluzione, e
  `Game.noteOutcome` tiene il primo motivo. Stesso difetto con `leave`, e quando il forfait completa le mosse del round e quel round
  uccide l'ultimo avversario.
- Lettori di `outcomeReason`: `ViewExtractorService` (vista), `MatchSnapshot` (journal/archivio), `MatchArchiveService` e
  `MatchEventRepository` (solo il valore «riavvio server», non toccato), `client-web/src/lifecycle.ts` (mappa `combat` su «Rissa conclusa al
  tavolo», `timeout` su «Tempo scaduto»). Unico altro chiamante di `finalizeOnce`: `submitMoveToGame`, che passa già `combat`.

## Modifica

`GameSessionServiceImpl.advanceAfterForfeit`: all'ingresso, se la partita non è ancora finita dopo i forfait (`!game.isOver()`), il motivo
diventa `combat`; altrimenti resta quello del forfait. Due righe. Se la risoluzione fallisce e viene ripristinata, la partita non è finita e
`finalizeOnce` non registra nulla, come prima.

Invariati: vincitore, HEALTH, `forfeits`, log, journal, archivio, chiusura al riavvio, protocollo (nessun valore nuovo).

## Test

Nuovo `OutcomeReasonTest` (clock controllabile di `LifecycleClockTest`, computer con `Random` seminato):

| Caso | Atteso | Prima della correzione |
|---|---|---|
| FFA, 2 umani in timeout + 3 computer: partita finita, vincitore computer | `combat` | **fallisce** (`timeout`) |
| `leave` dell'ultimo umano in FFA con 2 computer | `combat` | **fallisce** (`leave`) |
| timeout che completa il round e quel round uccide l'ultimo avversario | `combat` | **fallisce** (`timeout`) |
| `leave` che completa il round e quel round uccide l'ultimo avversario | `combat` | **fallisce** (`leave`) |
| duello con timeout simultaneo: patta | `timeout` | verde |
| forfait che lascia un solo superstite (FFA a 3) | `timeout` | verde |
| `leave` in 1vCom | `leave` | verde |
| mossa letale in duello | `combat` | verde |

Prima della correzione: 8 test, 4 falliscono, 4 verdi. Con la correzione: 8/8 verdi. Con due computer identici la partita può finire in
patta (si uccidono nello stesso round): il test sul `leave` accetta patta o vincitore computer, il motivo è `combat` comunque.

## Mutazione

Tolta temporaneamente la riga `if (!game.isOver()) { reason = "combat"; }`: `OutcomeReasonTest` 8 test, 4 falliscono (gli stessi quattro).
Riga ripristinata; `git diff` mostra solo le due righe della correzione.

## Verifiche

- `./scripts/build.ps1 -Task Test -Offline` (con la correzione): **verde**. Server 655 test, 0 falliti, 0 errori, 7 saltati; client-debug 37/37.
- `python scripts/check-rules.py`: **verde** (exit 0).
- `./scripts/build.ps1 -Task TestServerContext -Offline` (contesto Spring, verifica separata): **rosso, 765 test, 9 falliti, 0 errori, 7 saltati**.
  I nove sono tutti «Event timeout» o «clock coordination stalled» di test che pilotano il server con la CLI Node 12 di client-debug:
  `QuickDuelCliTest` (3: `simultaneousJoinsCreateTwoDisjointDuels`, `completeDuelsWithPrivateViewsAndIndependentJournals`,
  `duelDeadlinesAndReconnect[5]`), `QuickFfaCliTest` (5 istanze di `ffaQueueAndLifecycle`), `WebSocketIdentityTest.cliRejectsDuplicateMoveAndForeignAccess`.
  **Non dipendono da O20**: rilanciate le stesse classi **senza** la correzione (tolta temporaneamente, poi ripristinata, `git diff` identico),
  falliscono allo stesso modo: `WebSocketIdentityTest` 1 su 9 (stesso test), `QuickDuelCliTest` 4 su 10, `QuickFfaCliTest` 6 su 13, con gli stessi
  messaggi. L'insieme esatto dei test rossi varia da un giro all'altro (timeout); il test di `WebSocketIdentityTest` non coinvolge forfait né esiti.
  Causa non indagata (fuori perimetro): probabile problema di ambiente o di tempi della CLI su questa macchina. Non è un avvio applicativo
  riuscito: il contesto Spring non va dichiarato verde.

## Non verificato

- Nessuna partita reale dal client: il comportamento è provato a livello di servizio con clock finto, non con una FFA vera via WebSocket.
- Il client mostra ora «Rissa conclusa al tavolo» per questo caso solo per lettura di `client-web/src/lifecycle.ts`; non rieseguito lo scenario
  `ffaForfeit` di C3 né altre verifiche del client.
- README, roadmap e piani non aggiornati (spettano alla regia).
