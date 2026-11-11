# Registro dei rossi noti

Rossi già presenti e attribuiti, per non riprovarli sul commit di base a ogni blocco ([contratto
dell'esecutore](../orchestrazione-lavoro.md#contratto-dellesecutore)). Un rosso che corrisponde a una voce (verifica, misura,
firma) si dichiara «noto, voce Rn». Se cambia qualcosa (conteggi più alti, messaggio diverso, altra misura) è un rosso **nuovo** e si
prova sulla base. Chi chiude una voce la sposta in «Chiuse» nel commit che la chiude. Aperto il 10 novembre 2026 dalla regia.

## Aperte

| Voce | Verifica e misura | Firma | Attribuzione | Da quando, fonte |
|---|---|---|---|---|
| R1 | `VerifyLayout` 750×292 | `layoutProblems` per turno duello **6/6/6**, FFA **11/11/11** (tipi: «no round cards», posti sopra la mano, frecce, primi piani); totale 47–48; a volte una riga `chips` (gettone di immunità di tossicità non trovato nell'ispezione, già nelle basi di [C4-5b](client-c4/c4-5b/fase-b/base-750x292/layout-750x292.json)) | Limite della misura minima: regola 18 chiede solo di non peggiorare (`BASE_750` in `client-web/tests/readability.test.ts`); adattamento completo all'app futura (O22) | C4-7-ter, ultimo confronto [C4-8a Fase B](client-c4/c4-8a.md#fase-b): 48 |
| R2 | `VerifyAim` e `VerifyLayout` desktop (1366×768, 1920×1080) | Solo cadenza: intervalli entro 20 ms sotto il 95% (e talvolta input oltre 100 ms), **nessun** problema di geometria | Carico della macchina: rossi anche sulla base sull'altra macchina il 10 novembre 2026, verdi qui a macchina ferma nella fase da sole di `VerifyAll -Parallel 4`. Si rilancia **da sola, a macchina ferma**, prima di parlarne; se resta rossa così è nuova | [C4-11 Fase B](client-c4/c4-11.md#c4-11--fase-b), [C4-1c Fase B](client-c4/c4-1c.md#c4-1c--fase-b) |
| R3 | `./scripts/build.ps1 -Task TestServerContext -Offline` | Test che pilotano il server con la CLI di client-debug: «Event timeout» o «clock coordination stalled» (`QuickDuelCliTest`, `QuickFfaCliTest`, `WebSocketIdentityTest.cliRejectsDuplicateMoveAndForeignAccess`); insieme variabile da un giro all'altro | Ambiente o tempi della CLI su una macchina: rossi anche senza modifiche il 9 novembre 2026; **verde** (765, 0 falliti) il 10 novembre 2026 in C4-1c. Causa non indagata | [rapporto O20](o20-report.md#verifiche), [C4-1c Fase B](client-c4/c4-1c.md#c4-1c--fase-b) |
| R4 | `VerifyFfa` 750×292 | `queueExit` verde, poi la prima asserzione sul tavolo al turno 0 con **13 messaggi** (sovrapposizioni fra il proprio posto e un computer nei due sensi, un posto «over the hand», un ventaglio «fan over devAlice») | Limite della misura minima, come R1: la FFA non entra a 750×292 (D6 (d)); regola 18 chiede che `queueExit` resti verde | Base [C4-1b](client-c4/c4-1b.md#base-a-750292-regola-18) e [C4-2](client-c4/c4-2.md); registrato da [C4-9](client-c4/c4-9.md#rossi), 11 novembre 2026 |
| R5 | `VerifyAim` (qualunque misura), scenario `keyboard-ffa` | ««Nuova partita» from the keyboard did not start a game» e «Tab never reaches the menu», solo quando la FFA dello scenario arriva a un esito (`end.over` o `end.eliminated` veri) | Ramo dello script, non del client: `kbdLeave` (C4-8a) dopo «Nuova partita» aspetta una mano, ma in FFA «Nuova partita» rimette in coda FFA (D11 di C2b). Dipende dalla partita: verde quando lo scenario finisce senza esito. Correzione dello script in un blocco a parte (proprietario, 11 novembre 2026: «R5, fix it later») | [C4-12](client-c4/c4-12.md#rossi), matrice dell'11 novembre 2026; attribuzione dal codice, non riprovato sulla base |

## Chiuse

| Voce | Verifica e misura | Chiusa da |
|---|---|---|
| — | `VerifyAim` 844×390, frecce che attraversano ✓ e × | v1 di [C4-11](client-c4/c4-11.md#c4-11--fase-b), 10 novembre 2026 |
| — | `VerifyFfa` sotto carico, «no playable card» con il clock di 30 s | attesa sulla condizione di [C4-1c Fase B](client-c4/c4-1c.md#c4-1c--fase-b), 10 novembre 2026 |
