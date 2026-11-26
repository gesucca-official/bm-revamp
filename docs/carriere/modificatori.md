# Botte Micidiali — Catalogo dei modificatori di incontro

Versione **0.1 — 26 novembre 2026**. Documento normativo dei modificatori di incontro concreti che le carriere nominano: per ciascuno il
nome, il testo che si mostra a chi gioca, la primitiva e i parametri.

Il catalogo è subordinato al [regolamento](../game-rules.md) come un documento di set (R00): il regolamento definisce il sistema dei
modificatori e le sue cinque primitive (R08a), il catalogo le applica e non ne crea di nuove. Una riga del catalogo che contraddice R08a
non vale. È condiviso fra le carriere (decisione DC5 (4) del [piano CA-0](../ca-plan.md#decisioni)): una storia nomina un modificatore con
`[Modificatori: …]` (formato delle carriere, [F5](formato.md#f5--partite)) e lo strumento lo risolve qui ([F11](formato.md#f11--il-cast-e-il-catalogo)).
La tabella di [M3](#m3--modificatori) è la fonte unica che lo strumento legge.

## M1 — Come si legge

Una riga della tabella di M3 per modificatore, con cinque colonne:

- **Id:** l'identificativo, in `codice`. È il nome ridotto come ogni identificativo del formato ([F1](formato.md#f1--il-file)): minuscole
  senza accenti, trattini al posto di spazi e apostrofi («la cantina è buia» → `la-cantina-e-buia`). La storia scrive il nome, lo
  strumento lo riduce e cerca l'id.
- **Nome:** il nome che si mostra a chi gioca (R08a (2)).
- **Testo:** la frase che si mostra a chi gioca prima della partita e al tavolo (R08a (2)). Dice che cosa cambia, senza nominare regole.
- **Primitiva:** una delle cinque di R08a: Vista, Pesca, Recupero, Bersagli, Protezione.
- **Parametri:** in `codice`, `nome: valore` separati da `;`; un valore con più posti li separa con `,`.

Un **posto** è `giocatore` (chi gioca la carriera), `computer` (tutti i computer della partita) oppure l'identificativo di un
avversario nel cast (`prototipi/carriere/dati/cast.json`), per esempio `sergio`.

## M2 — Parametri

| Primitiva | Parametri | Limiti |
|---|---|---|
| Vista | `chi`: il posto che vede o non vede; `di`: il posto guardato, diverso da `chi`; `cosa`: `mano` (`chi` vede la mano di `di`) o `tavolo` (`chi` non vede risorse e oggetti di `di`) | un posto per parametro |
| Pesca | `chi`: un posto; `volte`: N, quante pescate al più dopo ogni mossa | N da 2 a 3 |
| Recupero | `chi`: un posto; `ogni`: K, ogni quanti turni | K da 2 a 5 |
| Bersagli | `chi`: uno o più computer (avversari per nome, o `computer`); `verso`: uno o più posti fra cui scelgono | solo in tutti contro tutti; `chi` non è mai `giocatore` |
| Protezione | `chi`: il posto i cui oggetti sono protetti | un posto |

Ogni avversario nominato deve sedere al tavolo come avversario della partita su ogni percorso che ci arriva; `giocatore` e `computer`
ci sono sempre. Il **punto** a cui un modificatore deroga, per R08a (6), è la sua primitiva per il posto `chi` (per Vista, per la coppia
`chi` e `di`); `computer` comprende ogni avversario. Due modificatori della stessa partita sullo stesso punto rendono la carriera non
valida.

## M3 — Modificatori

I sei della campagna principale (`docs/design/carriere/principale-dialoghi.md`), letture decise in DC5: S1 con la lettura (a), Recupero
ogni 3 turni con l'ultima carta regolare scartata.

| Id | Nome | Testo | Primitiva | Parametri |
|---|---|---|---|---|
| `ce-l-hanno-tutti-con-te` | Ce l'hanno tutti con te | Sergio e Duccio se la prendono solo con te, quando la carta lo permette. | Bersagli | `chi: sergio, duccio; verso: giocatore` |
| `il-cane-difende-le-sue-cose` | Il cane difende le sue cose | Gli oggetti di Piera non si toccano: le tue carte non possono bersagliarli, rubarli, scambiarli o distruggerli. | Protezione | `chi: piera` |
| `la-cantina-e-buia` | La cantina è buia | Al buio non vedi le risorse e gli oggetti di Piera: solo i tuoi e le carte mostrate. | Vista | `chi: giocatore; di: piera; cosa: tavolo` |
| `ha-letto-i-tuoi-messaggi` | Ha letto i tuoi messaggi | Sergio vede le carte che hai in mano. | Vista | `chi: sergio; di: giocatore; cosa: mano` |
| `ha-comprato-il-mazzo` | Ha comprato il mazzo | Dopo ogni mossa Sergio pesca fino a due carte invece di una. | Pesca | `chi: sergio; volte: 2` |
| `societa-apri-e-chiudi` | Società apri e chiudi | Ogni 3 turni l'ultima carta che Sergio ha scartato gli torna in mano, e la vedi. | Recupero | `chi: sergio; ogni: 3` |

## Versioni

La versione del catalogo cambia con ogni riga aggiunta, tolta o cambiata e con ogni cambio di M1 e M2; si aggiorna prima questo
documento, con la motivazione, poi lo strumento e i pacchetti nella stessa modifica. Un modificatore cambiato cambia l'impronta dei
modificatori nei pacchetti delle carriere che lo usano, e la loro versione si alza ([F13](formato.md#f13--versioni)). Una primitiva
nuova non entra qui: chiede una revisione del regolamento.

## Revisioni

- **0.1 — 26 novembre 2026, CA-0e:** prima versione, col regolamento 2.3 (R08a). I sei modificatori della campagna principale:
  «ce l'hanno tutti con te» (III3b), «il cane difende le sue cose» e «la cantina è buia» (S1, lettura (a)), «ha letto i tuoi
  messaggi», «ha comprato il mazzo» e «società apri e chiudi» (S2, Recupero ogni 3 turni). Limiti dei parametri (Pesca da 2 a 3,
  Recupero da 2 a 5) e testi per chi gioca scelti dall'esecutore, da rivedere col proprietario. Decisione del proprietario DC5 del
  [piano CA-0](../ca-plan.md#decisioni) («Come raccomandi tu»). Motivazione: le storie nominano i modificatori, il regolamento ne dà il
  sistema; il catalogo li rende concreti e controllabili. Nessuna partita cambia finché non esistono le partite di carriera (CA-0f).
