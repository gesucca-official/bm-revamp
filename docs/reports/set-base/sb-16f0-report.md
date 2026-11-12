# SB-16f0 — Leggibilità della ricerca e dell’annullamento

12 novembre 2026. Fase unica, base `813f0da`. Autorizzato da [D56](../../set-base-plan.md#decisioni-del-proprietario), punto 2
(«si a entrambe» alla domanda 2 del [rapporto SB-16e](sb-16e-report.md#domande-numerate-al-proprietario)), già nel repository:
nessun commit di sole approvazioni. Eccezioni al contratto date dal prompt: server main (Move, vista pubblica), protocollo e
`client-web/src`, solo per questo scopo. Non toccati: regolamento, `docs/sets`, catalogo, client-debug, `bozza.json`.

## Cosa cambia

**Server** ([Move](../../../server/src/main/java/com/gsc/bm/model/game/Move.java)). La mossa pubblica, quella che ogni giocatore
riceve in `resolvedMoves`, ha due campi opzionali nuovi, in sola lettura:

- `voidReason`: perché il motore l’ha annullata. Oggi vale solo `a terra` (D50, punto 1).
- `search`: la ricerca che ha preso il posto della pesca (D50, punto 6). Contiene `card` (il binding cercato) e `found`. Se la
  carta è stata trovata c’è anche `revealed`, cioè la carta mostrata a tutti, nella stessa forma delle carte in mano.

Entrambi i campi mancano quando sono vuoti. Con le regole vive il motore non li riempie mai, quindi la vista resta identica
byte per byte. I campi interni `searchedFor` e `searchFound` restano nascosti come prima. Il bot e le misure continuano a leggerli
dai getter.

La vista non pubblica nient’altro. La mano e il mazzo dell’avversario restano due numeri, e la carta pescata al posto di una
ricerca fallita resta privata. Si vedono solo le informazioni già pubbliche per D50, D52 e D54: la carta cercata, l’esito e
la carta trovata. Prima comparivano già nel `moveReport` inglese.

Il motivo dell’annullamento e la ricerca si scrivono solo dopo la risoluzione, quindi la mossa in attesa (`pendingMove`) non li
porta. Un comando che contenga `search` o `voidReason` viene rifiutato come ogni campo non ammesso (`MoveCommandValidator`, invariato).
Il protocollo è aggiornato in [api.md](../../api.md).

**Client web.**

- [contracts.ts](../../../client-web/src/contracts.ts): `Move.voidReason?` e `Move.search?` (`MoveSearch`).
- [resolution.ts](../../../client-web/src/resolution.ts): i fatti del round (`MoveFact`) portano i due campi solo se presenti.
  Nel riepilogo italiano:
  - una mossa annullata con motivo dice **«Annullata: a terra.»**; senza motivo resta la frase di prima, «Annullata durante il
    round (la vista non dice da quale mossa)»;
  - una ricerca riuscita dice «Ricerca al posto della pesca: trovata «X», mostrata a tutti.»;
  - una ricerca fallita dice «Ricerca al posto della pesca: «X» non è nel mazzo, pesca normale.». Il nome viene dal catalogo
    tramite il binding; se manca, si scrive il binding.

  Nella sequenza del round, la carta trovata da un avversario esce dal suo mazzo **a faccia in su**, come una propria pescata,
  e rimpicciolisce nel ventaglio dei dorsi. Prima usciva come un dorso. Le altre pescate dell’avversario restano dorsi.
  Un oggetto trovato va sul campo come già faceva la pesca (D54). La ricerca di una mossa annullata non si mostra mai.
- [table.tsx](../../../client-web/src/table.tsx): sotto la riga della ricerca riuscita c’è il pulsante **«Vedi la carta trovata:
  «X»»**. Apre la stessa ispezione di ogni altra carta (titolo, costo, priorità, danno, ruolo, testo, «di <autore>»).
  Funziona con click, tocco e tastiera.
- [scene.ts](../../../client-web/src/scene.ts): la pescata a faccia in su riusa il volo di pesca che c’era già (`travel`,
  etichetta `drawBack`), quindi `VerifyResolution` conta le pescate come prima. Nessuna animazione nuova.
- [style.css](../../../client-web/src/style.css): il pulsante sta sotto la sua riga.

Il colore non porta da solo nessuna informazione: tutto è scritto. Il movimento ridotto è rispettato perché, quando la sequenza
non parte, il riepilogo dice tutto.

## Attesi cambiati e decisione

Il test `clientReceivesSearchAndVoidOnlyInServerText` (`StarterBalanceMeasureTest`) fissava lo stato precedente: ricerca e
motivo solo nel testo inglese. Per decisione D56 diventa `clientReceivesSearchAndVoidAsStructuredFields`. Ora controlla che i
campi ci siano, che `searchedFor` e `searchFound` restino nascosti e che il testo inglese non cambi. Nessun altro atteso è cambiato.

## Test nuovi

- **Server**, cinque test in [RegoleD50Test](../../../server/src/test/java/com/gsc/bm/sim/RegoleD50Test.java), sezione «SB-16f0».
  Partono da partite vere con le regole `d50` e dalla vista che `ViewExtractorServiceImpl` manda a ciascun giocatore:
  - carta trovata: stessa ricerca nelle due viste; `search` ha solo `card`, `found`, `revealed`; nella vista dell’avversario
    nessun nome della mano o del mazzo dell’autore;
  - ricerca fallita: senza `revealed`, e la carta pescata al suo posto resta privata;
  - mossa annullata «a terra»: c’è `voidReason` e non c’è `search`;
  - regole vive: nessuno dei due campi, in nessuna vista;
  - un comando che porta uno dei due campi viene rifiutato.
- **Client**, [search-void.test.ts](../../../client-web/tests/search-void.test.ts), cinque test sulle viste reali registrate in
  `resolution-views.json`, con l’aggiunta dei soli campi nuovi:
  - frase dell’annullamento;
  - ricerca riuscita, con riga, carta da ispezionare e pescata a faccia in su;
  - ricerca fallita, anche con binding ignoto;
  - oggetto trovato e mossa annullata;
  - regole vive: fatti, riepilogo e pescate identici a prima su tutte le registrazioni.

## Verifiche

| Verifica | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` | **338/338** (333 + 5) |
| `./client-web/run.ps1 -Task Build` | Verde, solito avviso del bundler sui chunk |
| `./client-web/run.ps1 -Task Size`, `BM_OUT` in TEMP | JS gzip **350.657 byte** (+367), totale **1.760.815**, texture **27.729.048**; limiti e tetto C4 rispettati |
| `./scripts/build.ps1 -Task Test -Offline` | Server **718 test, 0 falliti/errori, 10 saltati** (713 + 5); client-debug **37/37** |
| `python scripts/check-rules.py` | Verde, regolamento 1.13 e Set Base 0.1 |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **835 test, 0 falliti/errori, 10 saltati**, 8:29 min. Le righe `MATCH_ARCHIVE_WRITE_FAILED` del log sono scenari di guasto voluti dai test |
| `git diff --check` | Verde |
| `python scripts/check-links.py` | **291 documenti, 0 link rotti** |
| Mutazioni client | **6/6 rilevate** (motivo ignorato, ricerca di mossa annullata a faccia in su, oggetto trovato in mano, riga della ricerca fallita, campi sempre presenti nei fatti, carta offerta con `found:false`), sorgente ripristinato |
| Mutazioni server | **4/4 rilevate** (`search` sempre presente, `found` sempre vero, `voidReason` nullo scritto, `voidReason` di nuovo nascosto), sorgente ripristinato |

Come chiesto dal prompt, niente Playwright di verifica: `Verify` non gira sulla bozza (consegna aperta 2 dell’allineamento).

## Catture sul profilo bozza

Il jar è stato rifatto dopo i test. Il server è partito col profilo `local,bozza` (regole `d50`) su un database temporaneo, con
`./client-web/run.ps1 -Task Serve` sulla 4320. Ho giocato partite quick 1vCom attraverso l’interfaccia, con Edge a 1366×768, il
movimento ridotto attivo e lo specchio Spazienzio contro Spazienzio (`aggressivo`). Lo script è
[captures.mjs](sb-16f0/captures.mjs). Gioca con preferenza la carica PAZIENZA: FINITA, che cerca GARGANTUESCO IMPATTO SUL TU;
con salute bassa preferisce i colpi sull’avversario, l’unico caso in cui una mossa «a terra» si annulla. Quando un round contiene
il caso cercato, apre «Ultimo turno» e salva la cattura.

L’esito delle partite e le ricerche viste sono in [captures.json](sb-16f0/captures.json): nessun errore di pagina. Prima corsa: 8
partite, undici ricerche trovate (quattro del computer) e cinque fallite, nessuna mossa «a terra». Seconda corsa, con la preferenza per i colpi: «a terra»
alla prima partita, al turno 9. Le catture originali in PNG e una corsa con un errore dello script, già corretto, restano in
`%TEMP%\sb16f0-captures*`.

1. [Ricerca trovata dal computer](sb-16f0/1-ricerca-trovata.jpg): «Ricerca al posto della pesca: trovata «GARGANTUESCO IMPATTO
   SUL TU», mostrata a tutti.», con il pulsante. [La carta aperta dal pulsante](sb-16f0/1b-carta-trovata-ispezione.jpg) è
   l’ispezione intera, «di Computer»: costo, priorità, danno nominale, ruolo, bersaglio, testo.
2. [Ricerca senza carta da trovare](sb-16f0/2-ricerca-non-trovata.jpg): «Ricerca al posto della pesca: «GARGANTUESCO IMPATTO
   SUL TU» non è nel mazzo, pesca normale.». Nessun pulsante.
3. [Mossa annullata a terra](sb-16f0/3-annullata-a-terra.jpg): il computer colpisce per primo e mi porta a 0. La mia
   SVEGLIAMOCI MA TU NO, nello stesso turno, dice «Annullata: a terra.».

Durante le partite ci sono stati anche annullamenti senza motivo, per esempio un oggetto scelto e sparito prima. Quelli conservano
la frase di prima, che resta vera.

## Rossi

Nessun rosso nuovo e nessuna voce del registro toccata.

## Non verificato

- Nessuna matrice Playwright, per scelta del prompt. La sequenza con la carta a faccia in su è coperta dai test del piano
  (`timeline`); a schermo non l’ho guardata, perché le catture sono a movimento ridotto.
- FFA con più ricerche nello stesso round: coperta solo dal codice, che tratta ogni posto per sé.
- 750×292 e 844×390 non provati per il pulsante nuovo dentro «Ultimo turno». È una riga di testo con un pulsante in un
  dialogo che già scorre.

## Cosa vedrà il proprietario in SB-16f, e dove

Le informazioni stanno in **Menu → Ultimo turno**, oppure si apre lo stesso dialogo toccando le carte piccole del round al centro.
Sotto «Cosa è successo nel turno N», nella riga di ogni mossa:

- «Annullata: a terra.» per la mossa di chi era già a terra all’inizio del suo gruppo di velocità;
- «Ricerca al posto della pesca: trovata «X», mostrata a tutti.», con il pulsante «Vedi la carta trovata: «X»» che apre la
  carta intera;
- «Ricerca al posto della pesca: «X» non è nel mazzo, pesca normale.».

Durante la sequenza, a movimento normale, la carta trovata dall’avversario esce dal suo mazzo scoperta.

**Resta solo nel testo inglese** (sezione richiudibile «Testo del server»):

- gli effetti delle carte riga per riga: danni, stati, corazza dell’alcol, cure. Il riepilogo italiano dà solo il nominale e le
  variazioni complessive;
- che cosa hanno fatto gli effetti di fine turno: l’italiano dice solo su chi;
- quale mossa ha annullato un’altra, quando la causa non è «a terra»: con le regole di oggi non ne esistono altre.

Restano nel registro del turno del server, che il client non riceve: «is voided» e «searched the deck».

## Cosa giudica il proprietario

Le frasi e il pulsante nelle catture; se la carta scoperta in volo serve o disturba (si vede solo a movimento normale).
