# CA-0b — Formato delle carriere 0.1, proposta

21 novembre 2026, esecutore avviato dalla regia delle carriere. Blocco [CA-0b](../../ca-plan.md#ca-0b--formato-delle-carriere-01),
passo con proposta.

**Esito:** proposta scritta in [`docs/carriere/formato.md`](../../carriere/formato.md), marcata «Proposta, non in vigore». **STOP** per la
decisione del proprietario sulle domande 1–4. Storie, prototipo, regolamento, set, client e server non sono toccati.

## In breve

Il formato 0.1 fissa, in tredici sezioni con un esempio preso da una storia vera per ogni costrutto: il file (preambolo,
`[Carriera: …]`, sezioni, identificativi), i nodi con `segreto`, `tasca` e condizione, battute, alias, figure in ombra, stacchi,
interruzioni, narrazione e telefono, i comandi di scena, le partite (duello, tutti contro tutti, `{segno}`, «gli altri fra», «a scelta
fra», ritento, sconfitta che apre un ramo, catena), le scelte mute e per messaggio con «se c'è», segni, sblocchi, obbligatori, le
condizioni, le uscite anche condizionate, i finali con nome, gli achievement con indizi progressivi, il cast (personaggi, alias,
espressioni, espressioni future, ripieghi, sfondi con varianti e ripieghi, sprite e pose), errori e avvisi del controllo con il tetto di
200 000 stati, la regola delle versioni e il posto riservato ai modificatori di incontro fino a CA-0e.

## Inventario

Costrutti accettati dal convertitore e dal controllo del prototipo, contati sulle tre storie (T tutorial, P principale, R prova).

| Costrutto | T | P | R | Nel formato |
|---|---:|---:|---:|---|
| `[Carriera: …; obbligatori: …]`, nodi `## X — titolo` | 1, 6 | 1, 27 | 1, 8 | F1, F2 |
| `[Nodo: segreto]`, `tasca`, `se …` | — | 6, 2, 1 | 2, —, — | F2 |
| Battute, alias, figure in ombra, `{giocatore}` | 38 | 315 | 14 | F3 |
| `[Stacchi]`, `[Interrotta]` | 2, 3 | 7, 6 | 1, 1 | F3 |
| Narrazione `*…*`, telefono `[Telefono]` + `*«…»*` | 1, 1 | 6, 1 | 2, — | F3 |
| `[Sfondo]`, anche dentro `[Regia: Sfondo: …]` | 5 + 1 | 27 + 2 | 8 | F4 |
| `[Entra]`, `[Esce]`, `[Sprite]`, `[Scossa]`, `[Sfarfallio]`, `[Suono]` | sì | sì, senza Sfarfallio | Entra, Esce | F4 |
| Partite, tutti contro tutti, `{segno}` | 3 | 20 | 3 | F5 |
| «gli altri fra» | 1 | — | — | F5 |
| «a scelta fra», «{segno} o a scelta fra» | — | 4, 1 | — | F5 |
| `**Ritento.**`, `[Sconfitta: → …]` | 3, — | 16, 5 | 3, 1 | F5 |
| `[Modificatori: …]` | — | 3 | — | F5, F13 (riservato) |
| Catena, `[Catena: …]`, `[Catena, prima di X]` | — | 1, 1, 5 | — | F5 |
| Scelta muta, per messaggio, «se c'è», opzioni in riga | 1, 1, —, 1 | 4, —, 1, — | 2, —, —, — | F6 |
| `[Segno]`, `[Sblocca]`, `[Se …] [Segno/Sblocca]` | 1, 3, — | 18, 7, 4 | 2, 1, — | F7 |
| `[Se …]` su battute, narrazioni, messaggi | 2 | 62 | 7 | F3, F8 |
| Condizioni `segno`, `visto`, `vinto`, `esplorato`, `finale`, `non`, `e` | sì (segno, esplorato, non) | tutte | tutte | F8 |
| `→ Vai a`, `→ Torna a: X, scelta`, `→ Fine: completata[, nome]`, uscite condizionate | —, 1, 1, — | 24, 1, 4, 4 nodi | 4, —, 2, — | F9 |
| Achievement, `[Nascosto]`, `[Quando]`, indizi, `[Achievement: …]` | sì | sì | sì | F10 |
| Condizione `giri n` | — | — | 1 | **domanda 1** |
| `Fine: fallita`, `(fuori campo)`, condizioni `perso` e `achievement`, «o», `→ Torna a: X` senza «scelta» | — | — | — | **domanda 2** |

Il controllo sulle tre storie, rifatto con `run.ps1 -Task Check`: tutorial 6/6 nodi, 12 stati, 0 errori, 0 avvisi; prova 8/8, 15 stati,
0 e 0; principale 27/27, 665 stati, 0 errori, 0 avvisi del grafo e 255 avvisi del convertitore, tutti ripieghi del cast.

## Scelte prese

- **Ciò che nessuna storia vera usa resta fuori** dalla 0.1, come chiede il piano; i costrutti della sola prova diventano domande.
- **Lo sfondo dentro `[Regia: Sfondo: …]` è descritto**, perché lo usano tre righe delle storie vere (tutorial Scena 1, principale III4 e
  F3) e DC4 non le fa cambiare; vedi la domanda 4.
- **Il cast entra solo per ciò che il formato usa:** nomi, alias, ombra, espressioni, espressioni future, ripieghi, sfondi con varianti e
  ripieghi, sprite e pose. Velocità, animazione, bocca, misure e posizioni restano della scena di dialogo (CA-0g).
- **La versione di una carriera sta nel pacchetto** (CA-0d), non nel markdown: `[Carriera: …]` non ha un campo di versione. Il
  prototipo scrive oggi `formato: 1` nel JSON; l'allineamento con «0.1» è di CA-0d.
- **La 1.0 del formato arriva quando il gioco legge le carriere** (CA-0f e CA-0g), come il documento del Set Base passa alla 1.0 a
  bilanciamento concluso.
- **La partecipazione alla catena** si scrive come regola esplicita: è in catena solo se ha preso `starter-<personaggio>` in quel giro chi
  ha quello sblocco nella carriera. Nel prototipo è una convenzione ricavata dai nomi.
- **Le misure di scrittura** del serbatoio (battute entro 120–140 caratteri, prima partita entro un minuto e mezzo) non entrano nel
  formato: il controllo non le verifica e restano consigli di stile nel README.

## Dove README, convertitore e storie non combaciano

1. **README, «Come si scrivono le scene»:** dice `[Regia: …]` per cambi di sfondo, entrate, suoni e scosse; il convertitore ha comandi
   propri (`[Sfondo]`, `[Entra]`, `[Esce]`, `[Sprite]`, `[Suono]`, `[Scossa]`, `[Sfarfallio]`) e la regia è solo una nota, salvo
   `Sfondo:` al suo interno. Scrive `[Se segno = …]` per ciò che è `[Se segno x = v]`. Prevede il «fuori campo», che nessuna storia
   usa, e la velocità del testo, che sta nel cast. Dopo la decisione il README rimanda al formato e queste righe non si ripetono più.
2. **Principale, I1:** il cartello sulla serranda è scritto `*«CHIUSO PER CESSIONE ATTIVITÀ. …»*`, cioè come messaggio sul telefono senza
   mittente. Il convertitore lo accetta e non avvisa: è la domanda 3.
3. **Tutorial, epilogo del fallimento:** la scaletta dice che il tutorial «finisce e fallisce», ma il dato è un ritorno alla scelta
   (`→ Torna a: Scena 4, scelta`), come deciso dal proprietario il 10 novembre 2026. Nessuna storia ha quindi una `Fine: fallita`
   (domanda 2).
4. **Prova, nodo C:** la partita ha sia `**Ritento.**` sia `[Sconfitta: …]`; dopo P3 il ritento non si vede mai e nessun controllo lo dice.
   È solo nella storia di prova: nessuna regola, da segnalare allo strumento di CA-0c come possibile avviso.
5. **Condizioni:** il convertitore legge «o» e «e» senza parentesi, con «o» che lega meno; nessuna storia usa «o», quindi il formato
   descrive solo «e» e «non».

## Verifiche

- `./prototipi/carriere/run.ps1 -Task Convert` e `-Task Check`: verdi, numeri sopra; nessun file tracciato cambiato.
- `git diff --check`: pulito sui file del blocco.
- `python scripts/check-links.py`: nessun link rotto nuovo.
- Non eseguite, fuori dal perimetro: `Misura`, `Banco`, `Registra` del prototipo; le verifiche del server.

## Domande per il proprietario

1. **La condizione «giri n»** (giri completati sull'account, almeno n) è usata solo dalla storia di prova, per un indizio che compare dal
   secondo giro. **Proposta:** fuori dalla 0.1, entra quando la usa una storia vera. In alternativa entra subito nella tabella di F8,
   come atomo dell'account.
2. **I costrutti accettati ma mai usati:** `→ Fine: fallita`, `(fuori campo)`, le condizioni `perso N` e `achievement X`, l'operatore
   «o», `→ Torna a: X` senza «scelta». **Proposta:** fuori dalla 0.1; lo strumento di CA-0c li rifiuta con un messaggio che rimanda al
   formato. In alternativa entrano tutti, o solo alcuni (per esempio `Fine: fallita`, che oggi nessuna carriera usa perché il tutorial
   fallisce tornando alla scelta).
3. **Il cartello di I1:** `*«…»*` nel formato è sempre un messaggio sul telefono. **Proposta:** la regola resta, e la riga di I1 diventa
   narrazione (`*CHIUSO PER CESSIONE ATTIVITÀ. …*`) quando la principale passa a CA-2, perché le storie non cambiano adesso (DC4). In
   alternativa il formato ammette un messaggio senza `[Telefono: …]` come scritta in scena, senza notifica.
4. **Lo sfondo dentro una nota di regia** (`[Regia: Sfondo: S1 di sera. …]`, tre righe). **Proposta:** ammesso nella 0.1, come le storie
   lo scrivono. In alternativa il formato chiede sempre `[Sfondo: …]` e le tre righe si correggono con CA-1 e CA-2.

## Dopo la decisione

Si toglie «Proposta, non in vigore», si applicano le risposte con la loro voce nelle Revisioni, si mette il rimando nella sezione «Come
si scrivono le scene» del README e si chiude la riga di CA-0b.
