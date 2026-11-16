# SB-17 — Fase B3: Lo rivendo (rapporto)

**16 novembre 2026. Esito: STOP 1 prima di scrivere documenti e codice, per la condizione scritta nel prompt.** Far scegliere
l'oggetto all'umano chiede codice fuori dalla deroga del playground (validatore del comando, `api`) e codice del client; nel motore
non c'è una scelta del giocatore alla risoluzione che un umano possa usare con una carta che bersaglia sé. Nessun file di gioco
cambiato, nessuna misura, nessuna verifica costosa lanciata. Segue una proposta (§ 3) e le domande al proprietario (§ 4).

## Stato

- Preliminare: working tree pulito, `git fetch` fatto, main avanti di 2 commit su origin/main (non pushati, del proprietario), origin
  non avanti.
- Diagnosi: letti D112–D114, la [proposta A3](../../design/set-base/sb-17-proposta-a3.md), le
  [regole del playground](../../design/set-base/regole-playground.md) 1.1 e la [deroga](../../aree-protette.md#playground-e-misure);
  cercati nel motore, nel validatore e nel client i meccanismi di scelta esistenti.
- Modifica: solo questo rapporto. Passo 0, codice, verifiche e giro non eseguiti.

## 1. I meccanismi di scelta che esistono

| Meccanismo | Dove | Perché non basta per Lo rivendo |
|---|---|---|
| `choices.TARGET_ITEM` (Grab, Steal, BreakYourToy; `consume` di `DataCards`) | `Move`, `Move.isValidFor`, `MoveCommandValidator`, client `model.ts` | È un **bersaglio**: il validatore (`api/ws/MoveCommandValidator.java`, righe 45–50) rifiuta `TARGET_ITEM` («Unexpected item») per una carta senza `NEAR_ITEM`/`FAR_ITEM`; con `NEAR_ITEM` lo esige («Item required») e `Move.isValidFor` rende la carta ingiocabile senza oggetti, contro R03 e contro il ramo +2 HEALTH. Il client lo manda solo quando il bersaglio cliccato è un oggetto (`t.itemIndex`). |
| `searchChoice` («Annuncia X o Y», RP-13, RP-23) | `Move`, `Move.isValidFor`, validatore, client `table.tsx` | Il motore accetta solo un nome stampato nella ricerca della carta e con una copia nel mazzo; il client apre la scelta solo con due nomi di ricerca. Riusarlo per un oggetto cambia `Move` (modello vivo) e il client. |
| `DISCARD_ONE` | idem | È lo scarto della bound, già usato da Lo rivendo stessa. |

Per i **bot** la strada c'è senza uscire dal perimetro del prompt: una mossa con `TARGET_ITEM` su una carta che bersaglia sé passa
`Move.isValidFor` (che controlla l'oggetto solo per `NEAR_ITEM`/`FAR_ITEM`), i bot non passano dal validatore, `DataCards` legge già
`choices` per `consume`, e `BotView.legalMoves` può generare una mossa per oggetto come fa con lo scarto. Per l'**umano** no: ogni
via passa da `api` (fuori deroga, quindi identità viva e contesto obbligatori e un perimetro che il prompt non dà) e dal client
(fuori perimetro).

## 2. Cosa non ho scritto e perché

Non ho scritto la riga RP 1.2, CES-BO3 in griglia, `bozza.json` né codice: la riga RP dovrebbe nominare il meccanismo di scelta, e
quello per l'umano oggi non esiste. Scrivere i documenti prima della decisione avrebbe fissato una lettura di R03 che potrebbe
cambiare con la risposta alla domanda 1.

## 3. Proposta

**Raccomandata — A: scelta nel motore ora, per l'umano col passo del client (come RP-23).** Lo stesso schema già in vigore per
«Annuncia X o Y»: la scelta è un campo facoltativo della mossa; **se la mossa non la dice, vale il più vecchio dei propri oggetti**;
il campo per l'umano arriva con il prossimo passo del client.

- Riga RP 1.2: Lo rivendo bersaglia sé; l'oggetto si sceglie fra i propri oggetti in campo con `choices.TARGET_ITEM` (campo della
  mossa, non bersaglio: nessun controllo di presenza alla giocata, la carta resta giocabile senza oggetti); alla risoluzione, se
  l'oggetto scelto c'è ancora esce senza effetto, +7 HEALTH; se manca o la mossa non lo dice e non hai oggetti, +2 HEALTH; se la
  mossa non lo dice e hai oggetti, il più vecchio. Nel profilo `bozza` l'umano oggi vende quindi il più vecchio.
- Codice tutto nel perimetro del prompt: `DataCards` (passo `vendi`), `PrintedEffects`, `TurnForecast`, `BotView`/`LegalMove` (una
  mossa per oggetto proprio, più la mossa senza scelta se non ci sono oggetti) e stili (il meno prezioso, mai un Espresso se c'è un
  Santino). Verifiche come nel prompt.
- Poi un blocco del client piccolo (fuori da SB-17 o come sua coda): validatore che accetta `TARGET_ITEM` con le regole del
  playground su una carta col passo `vendi`, e nel client una finestra «Quale oggetto vendi?» come quella di `searchChoice`. Con le
  verifiche di `api` (identità viva, `TestServerContext`, manifest) e del client.
- Costo per la prova finale del proprietario: finché il passo del client non c'è, il proprietario vende sempre il più vecchio;
  i bot scelgono.

**B: tutto in B3.** Prompt allargato a `MoveCommandValidator` e al client (finestra di scelta). Stessa logica di A, ma con il
blocco del client dentro la B3: più verifiche (area client con le Playwright che la regia sceglie), budget e perimetro da
riscrivere. Il proprietario prova subito con la scelta.

**C (non raccomandata): bersaglio `NEAR_ITEM`.** Esiste già tutto, client compreso, ma è un bersaglio d'oggetto in una bound:
viola R03 e toglie il ramo senza oggetti (la carta non si gioca senza oggetti).

## 4. Domande al proprietario

1. A (scelta nel motore e nei bot ora, l'umano vende il più vecchio fino al passo del client), B (validatore e client dentro la
   B3) o C?
2. Con A: il passo del client per la scelta va in coda a SB-17 prima della prova finale, o dopo, insieme ai due blocchi piccoli
   del client già in attesa (`12+x`, `restOn`)?
