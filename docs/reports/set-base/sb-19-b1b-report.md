# SB-19 — Fase B1b: rinforzo delle carte nuove con la banda di D131 (rapporto)

**18 novembre 2026. Fase B1b di [D131](../../set-base-decisioni.md#decisioni-del-proprietario): le otto carte nuove diverse da Grappa (OGG-16) provano
varianti più forti, tutte nello stesso giro; vince, per ogni carta, la variante scelta con la regola qui sotto, scritta prima di misurare. Un solo STOP,
alla fine, con le domande al proprietario. Nessun codice dei bot, nulla della B2 (RP-27, Conto del tavolo sei, Sigaretta accesa).**

## Stato (ripartenza)

- Scritto prima di misurare: varianti con prezzo e posizione (§ 1), regola di scelta e riserva (§ 2), mazzi d'isolamento (§ 3), budget (§ 4). Misure: **non ancora fatte** in questo punto del file.

## 1. Le varianti (scritte prima di misurare)

**Prezzo e curva.** Listino D33 ([listino.md](../../design/set-base/listino.md)): una carta gratuita di priorità 1 che vale l'àncora fa 10 HIT; **1 V = 1,07 HIT** (a 10 V), **1 A = 0,55 HIT** (contesto di Mara),
1 HEALTH ≈ 1,15 HIT, 1 CUT = 1 HIT; la priorità vale ±0,5. La *linea* di una carta è 10 + prezzo del costo (HIT equivalenti che deve valere l'effetto). **Curva degli starter:** nel listino le 13 azioni di Spazienzio stanno a
una mediana di **0,66 della linea** (HIT equivalenti / linea: 0,50–0,92); la curva è 0,66 × linea. «Sopra la curva» = valore stimato dell'effetto − curva, in HIT equivalenti. Il valore dell'effetto è una **stima**
(assunzioni dichiarate): A e HEALTH ai prezzi sopra; l'HIT in arrivo che le parate e i moltiplicatori toccano ≈ 12 per turno; Elemosina 4,1 (listino, BeggingMoney); Maleducazione = i suoi HIT; Minerale 3 a +5 A (proposta A) più 0,55 per ogni A oltre. È l'ordine di grandezza, non una misura: decide la misura (§ 5).

Tutte: stesso effetto e stesso ruolo, solo numeri, costo o priorità; nessuna meccanica nuova, nessuna annulla-mosse generica, nessun costo in HEALTH.

| Carta (slot) | Variante | Costo, priorità | Effetto | Prezzo costo | Linea | Valore stimato | Sopra la curva |
|---|---|---|---|---:|---:|---:|---:|
| **Mano lesta** (GEN-19) — B1 | oggi (V0) | 0, 1 | −5 A al bersaglio, +5 A a sé | 0 | 10 | 5,5 | −1,1 |
| | V1 | 0, 1 | ±8 A | 0 | 10 | 8,8 | +2,2 |
| | V2 | 0, 1 | ±10 A | 0 | 10 | 11,0 | +4,4 |
| | V3 | 0, 1 | ±15 A | 0 | 10 | 16,5 | +9,9 |
| **Coccio di bottiglia** (GEN-21) | oggi (V0) | 5 V, 1 | prossimo HIT ×1,5 → CUT | 5,4 | 15,4 | 7,0 | −3,1 |
| | V1 | 5 V, 1 | ×2 | 5,4 | 15,4 | 13,0 | +2,9 |
| | V2 | 5 V, 1 | ×2,5 | 5,4 | 15,4 | 19,0 | +8,9 |
| | V3 | 0, 1 | ×2 | 0 | 10 | 13,0 | +6,4 |
| **Elemosina molesta** (GEN-04) | oggi (V0) | 10 A, 0 | copia un oggetto del bersaglio | 5,5 | 15,5 | 4,1 | −6,1 |
| | V1 | 5 A, 0 | idem | 2,8 | 12,8 | 4,1 | −4,3 |
| | V2 | 0, 0 | idem | 0 | 10 | 4,1 | −2,5 |
| | V3 | 0, 1 | idem | 0 | 10 | 4,1 (priorità) | −2,5 |
| **Non sento niente** (GEN-11) | oggi (V0) | 10 V, 2 | HIT ricevuto ×0,35 nel turno; +5 A | 10,7 | 20,7 | 10,6 | −3,1 |
| | V1 | 5 V, 2 | idem | 5,4 | 15,4 | 10,6 | +0,5 |
| | V2 | 10 V, 2 | ×0,25 | 10,7 | 20,7 | 11,8 | −1,9 |
| | V3 | 5 V, 2 | ×0,25 | 5,4 | 15,4 | 11,8 | +1,7 |
| **Mezza minerale sgasata** (OGG-08) | oggi (V0) | oggetto | azzera L; +5 A | 0 | 10 | 3,0 | −3,6 |
| | V1 | oggetto | azzera L; +10 A | 0 | 10 | 5,8 | −0,9 |
| | V2 | oggetto | +15 A | 0 | 10 | 8,5 | +1,9 |
| | V3 | oggetto | +20 A | 0 | 10 | 11,3 | +4,7 |
| **Maleducazione** (GEN-10) | oggi (V0) | 5 V, 1 | toglie gli equip; 8 HIT | 5,4 | 15,4 | 8,0 | −2,1 |
| | V1 | 5 V, 1 | 10 HIT | 5,4 | 15,4 | 10,0 | −0,1 |
| | V2 | 5 V, 1 | 12 HIT | 5,4 | 15,4 | 12,0 | +1,9 |
| | V3 | 0, 1 | 12 HIT | 0 | 10 | 12,0 | +5,4 |
| **Secondo fiato** (GEN-20) | V1 (A1 della B1) | 0, 0 | +15 HEALTH; HIT e CUT ricevuti ×1,25 per 2 turni | 0 | 10 | 7,2 | +0,6 |
| | V2 (in bozza) | 0, 0 | +12 HEALTH, idem | 0 | 10 | 3,8 | −2,8 |
| **Colpo allo stomaco** (GEN-08) | invariata (V0) | 15 V, 1 | 10 HIT; +10 T al bersaglio | 16,1 | 26,1 | 24,6 (listino) | +7,4 |

**Colpo allo stomaco non ha varianti più forti:** [D131 (4)](../../set-base-decisioni.md#decisioni-del-proprietario) la lascia com'è, la sua media in isolamento della B1 sta già nella banda (+6,43) e il solo punto debole è il
confronto con Spazienzio (+17,25, sopra +15), che una variante più forte peggiorerebbe. Resta V0 e la carta è **segnalata**, senza misura nuova (nessuna misura per carta ferma: stessi semi, stesso numero). È la domanda 1.
**Grappa (OGG-16)** resta com'è, il mazzo d'isolamento Estasi + Grappa esce dai criteri e va a SB-20 (D131 (3)). **Maleducazione** e **Colpo** contano come candidate col valore di oggi solo perché il loro isolamento della B1 (stessi semi) già sta nella banda in media.

## 2. Regola di scelta e riserva (scritta prima di misurare)

**Isolamento.** Per ogni variante, un mazzo d'isolamento: il mazzo di riferimento della carta con il **solo scambio di quella carta** (le due copie del mazzo con le aggiunte, [make-iso.py](sb-19/make-iso.py)); stessa partenza e stessi semi della B1, contro i sette
mazzi di riferimento, 12 stili letali × 12, 100 semi per cella, d50. Il mazzo di isolamento della carta è quello in cui la sua aggiunta è stata più debole nella B1 (Mano lesta, Elemosina: Mara; Coccio, Maleducazione, Colpo: Beppe; Secondo fiato: Mara);
dove la B1 non ne aveva uno, quello di un mazzo senza il conflitto di ruolo (Non sento niente: Spazienzio, parata e V; Minerale: Duccio, senza L da difendere).

**Banda (D131 (1)).** Un isolamento *sta nella banda* se: guadagno medio sui sette riferimenti (specchio col proprio riferimento incluso, come nella B1) **fra 0 e +10**; **nessun confronto oltre +15**; **patte ≤ 10 %** in ogni confronto; **durata ≤ 12 turni** fuori dagli specchi. La fascia 35–65 % di D95 non è un criterio dei mazzi con carte da booster.

**Scelta.** Per ogni carta vince la variante il cui isolamento sta nella banda **più vicina a +5** (distanza dal guadagno medio a +5). Se nessuna ci sta, vince la più vicina alla banda (la distanza dalla banda, in punti, sommando lo scarto della media e l'eccesso del massimo oltre +15 e delle patte e della durata) e la carta è
**segnalata**. A parità, la meno cara in costo; poi la più bassa. Una carta senza varianti più forti resta com'è e vale V0.

**Mazzi con le aggiunte.** Con le varianti scelte nella bozza, i nove mazzi (B1) si misurano come in B1 (63 coppie, 100 semi, stesse condizioni) e **devono stare nella stessa banda** (ogni mazzo contro il suo riferimento). Gli scambi di carte dei mazzi non cambiano, tranne se una carta tolta è chiaramente di un altro ruolo (dichiarato in § 6).
Il mazzo di Equip e quello di Estasi + Grappa non sono criteri (equip è un controllo del rischio 3, Estasi + Grappa esce dai criteri): si misurano e si riportano.

**Riserva (una sola, scritta prima).** Se dopo il giro dei nove mazzi un mazzo sta fuori dalla banda, **una sola volta** si sostituisce, in quel mazzo e per la sola carta responsabile (quella con la maggiore distanza dalla banda nella stessa direzione dell'uscita), la variante scelta con la variante
successiva più vicina a +5 in direzione opposta all'uscita (più forte se l'uscita è in giù, più debole se in su); si rimisura **solo** quel mazzo. Se l'uscita persiste, o non c'è una variante in quella direzione, il mazzo è segnalato e la carta resta com'è.
La riserva non si applica ai mazzi che non sono criteri.

**Cosa non si fa.** Nessun codice dei bot; nessun valore atteso cambiato per tornare al verde; gli attesi si cambiano solo per le varianti scelte, uno per uno.

## 3. Mazzi d'isolamento (id)

`iso-mara-mano` (Mara, Mano lesta ×2 al posto di Spintone, Sputo), `iso-beppe-coccio` (Beppe, Coccio ×2 al posto di Giubbotto ×2), `iso-mara-elemosina` (Mara, Elemosina ×2 al posto di Tartaruga, Giubbotto),
`iso-spazienzio-nsn` (Spazienzio, Non sento niente ×2 al posto di Tartaruga ×2; **nuovo**), `iso-duccio-minerale` (Duccio, Mezza minerale ×2 al posto di Ghiaccio, Fasciatura; **nuovo**), `iso-beppe-maleducazione` (Beppe, Maleducazione ×2 al posto di Due dita, Casco),
`iso-mara-fiato` (Mara, Secondo fiato ×2 al posto di Panino ×2). Una copia della bozza per livello di variante ([b1b/make-variants.py](sb-19/b1b/make-variants.py)): `v1`, `v2`, `v3` con i sette mazzi (Secondo fiato: V1 = +15 in `v1`, V2 = +12 in `v2`, assente in `v3`).

## 4. Budget

1.800 s di misure (il lanciatore scrive i secondi di ogni giro in `budget.json`). Previsione: tre giri di isolamento ≈ 600 s, nove mazzi ≈ 290 s, «Rif» ≈ 110 s, fattibilità ≈ 40 s, riserva ≈ 150 s: ≈ 1.200 s. A budget finito, STOP.
