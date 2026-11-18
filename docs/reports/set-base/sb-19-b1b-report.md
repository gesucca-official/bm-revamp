# SB-19 — Fase B1b: rinforzo delle carte nuove con la banda di D131 (rapporto)

**18 novembre 2026. Fase B1b di [D131](../../set-base-decisioni.md#decisioni-del-proprietario): le otto carte nuove diverse da Grappa (OGG-16) provano
varianti più forti, tutte nello stesso giro; vince, per ogni carta, la variante scelta con la regola qui sotto, scritta prima di misurare. Un solo STOP,
alla fine, con le domande al proprietario. Nessun codice dei bot, nulla della B2 (RP-27, Conto del tavolo sei, Sigaretta accesa).**

## Stato (ripartenza)

- **Rif identico** alla B1 numero per numero (4.032 incontri, 403.200 partite, 0 violazioni; § 7). Nessuno STOP.
- Misurate **tre varianti per carta in isolamento** e due rimisure di Secondo fiato (+15 e +12); budget **1.049 s su 1.800** (§ 5, [budget.json](sb-19/b1b/evidence/budget.json)).
- **Quasi nessuna variante porta una carta nella banda:** il limite non sono i numeri ma quanto poco i bot giocano le carte (Mano lesta 0,12 giocate per partita; Coccio dà lo stesso risultato con ×1,5, ×2 e ×2,5). La sola correzione che sposta davvero è lo **scambio dei mazzi** di Mara e Duccio: Mano lesta prendeva il posto di carte di danno, ora quello di carte della sua famiglia, e da −13,5 passa a **+4,4** in isolamento (§ 6).
- Scelte con la regola (§ 5): **Elemosina gratis, Non sento niente 5 V ×0,25, Mezza minerale +20 A**; restano Mano lesta ±5, Coccio ×1,5, Maleducazione 8 HIT, Colpo allo stomaco e Secondo fiato +12. Carte segnalate (fuori banda): sei su otto.
- **Nove mazzi con le aggiunte: nessuno sta nella banda** (§ 7); Mara + sale a +11,64 (in su, per Secondo fiato +12 con Elemosina), gli altri restano in giù. La riserva, per come è scritta, non ha una variante che cambi qualcosa (§ 7).
- Bozza, griglia, `Sb19CardsTest`, bozza-di-riferimento aggiornati insieme (§ 9). **STOP per il proprietario**: domande in § 8.

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

## 5. Isolamenti per variante e scelta

Tre giri (`v1`, `v2`, `v3`; `v2` e `v3` rilanciati con un'etichetta nuova dopo un errore di caricamento a 0 costo nelle carte Java, 3 s: ora `make-variants.py` tiene il campo `cost` anche a 0) più un giro di rifinitura per le due carte il cui mazzo d'isolamento è stato rivisto (§ 6).
Guadagno medio sui sette riferimenti (specchio incluso) / massimo / patte massime, 100 semi per cella ([iso-b1b.md](sb-19/b1b/evidence/iso-b1b.md), [iso2-b1b.md](sb-19/b1b/evidence/iso2-b1b.md)). **Nella banda** = media 0…+10, massimo ≤ +15, patte ≤ 10 %, durata ≤ 12.
V0 è il valore di oggi, dalla B1 (stessi semi).

| Carta (mazzo d'isolamento) | V0 | V1 | V2 | V3 | Scelta |
|---|---|---|---|---|---|
| **Mano lesta** (Mara, scambio B1: Spintone, Sputo) | −13,46 / −9,75 | −12,91 | −12,65 | −12,01 / −7,39 | (scartato: § 6) |
| **Mano lesta** (Mara, scambio rivisto: Slalom ×2) | **+4,36** / +9,44 / 6,9 %: in banda | +6,74 / +12,67: in banda | +7,64 / +13,69: in banda | +10,21 / +18,17: fuori (media e massimo) | **V0 (±5)**, 0,64 da +5 |
| **Coccio di bottiglia** (Beppe, Giubbotto ×2) | −12,15 / −8,25 | −12,15 | −12,15 | −12,29 | **V0** (V0, V1 e V2 identici; a parità la più bassa); **segnalata** |
| **Elemosina molesta** (Mara, Tartaruga e Giubbotto: scambio B1) | −4,38 | −4,46 | −3,89 | −3,89 | (scartato: § 6) |
| **Elemosina molesta** (Celestina, Steal e Grab: stessa famiglia) | +0,22 / +4,78 / patte 12,7 % | +0,06 / 12,5 % | −0,14 / 12,1 % | −0,14 / 12,1 % | **V2 (gratis)**; fuori banda solo per le patte; **segnalata** |
| **Non sento niente** (Spazienzio, Tartaruga ×2) | — | −1,53 | −1,77 | −1,17 / +2,02 | **V3 (5 V, ×0,25)**; fuori banda (media); **segnalata** |
| **Mezza minerale sgasata** (Duccio, Ghiaccio e Fasciatura) | — | −1,80 | −1,73 | −1,60 / +3,57 | **V3 (+20 A)**; fuori banda (media); **segnalata** |
| **Maleducazione** (Beppe, Due dita e Casco) | +3,76 / +9,92 / patte 12,95 % | +8,18 / +15,46 / 13,4 % | +11,85 / +20,31 | +16,48 / +25,49 | **V0** (più vicina alla banda: 2,95, solo le patte; V1 3,83); **segnalata** |
| **Secondo fiato** (Mara, Panino ×2) | +15 (V1): **+15,22** / +21,93 | **+12 (V2): +9,86** / +15,81 (Piera) | — | — | **+12**, fuori banda per 0,81 nel massimo; **segnalata** |
| **Colpo allo stomaco** (Beppe, Gabbiano e Spintone) | +6,43 / +17,25 (Spazienzio) | — | — | — | **V0** (D131 (4)); media in banda, massimo oltre +15; **segnalata** |

Letture:

- **I numeri non muovono quello che i bot non giocano.** Mano lesta si gioca 0,12 volte a partita e sale di appena 1,5 punti passando da ±5 a ±15 con lo scambio B1. Coccio ha lo stesso identico risultato a ×1,5, ×2 e ×2,5: la carta o non si gioca o l'equip non arriva a colpire; a costo 0 cambia di 0,14. Non ho toccato i bot (fuori perimetro): è la domanda 1.
- **Maleducazione** è l'unica che reagisce ai numeri, e reagisce troppo (+4 punti per 2 HIT in più); V0 resta la più vicina a +5. Le sue patte (12,95 %) vengono dal mazzo di Beppe, non dalla carta.
- **Elemosina** ha un'uscita per le patte (12,7 %), che è la nota dello specchio di Celestina (12,58 % nel riferimento, D131 (4)): non è un effetto della carta.
- **Secondo fiato**: la rimisura a +15 dà +15,22 (nella B1 +15,36: la differenza, 0,14 punti, non la spiego, è dell'ordine del rumore); a +12, +9,86 di media (nella B1 +9,83) ma il confronto con Piera è +15,81.

## 6. Scambi dei mazzi rivisti (dichiarato)

La regola ammette di rivedere gli scambi solo se una carta tolta è chiaramente di un altro ruolo. Nella B1 Mano lesta (DISRUPT) prendeva il posto di carte di **danno** (Spintone, Sputo) nei mazzi di Mara, Piera e Duccio: il mazzo perdeva danno, non una carta di pari ruolo. Rivisti:

| Mazzo | B1 | B1b |
|---|---|---|
| Mara | −Spintone, −Sputo, +Mano lesta ×2 | **−Slalom d'avvicinamento ×2** (generatrice di A), +Mano lesta ×2 |
| Duccio | −Spintone ×2, +Mano lesta ×2 | **−Te lo spiego io, −Tartaruga**, +Mano lesta ×2 (resta una Te lo spiego io: DISRUPT) |
| Piera | −Spintone ×2, +Mano lesta ×2 | invariato: nessuna carta di famiglia da togliere senza toccare il motore di L (Rutto, Estasi); resta segnalato |

L'isolamento di Mano lesta passa da −13,46 a +4,36 (stessa carta, stessi numeri): **il −13,5 della B1 veniva dallo scambio, non dalla carta**. Elemosina è una carta di ITEMS e Mara non ha carte di quel ruolo da dare: l'isolamento di Elemosina si è misurato nel mazzo di Celestina, dove prende il posto di Steal e Grab (ITEMS). Altri scambi invariati: Non sento niente prende il posto di Tartaruga (DEFENSE), Maleducazione di Due dita e Casco (OTHER),
Coccio di Giubbotto (OTHER), Secondo fiato di Panino (RESOURCES), Mezza minerale di Ghiaccio e Fasciatura (pulizie e cure). Mezza minerale in Piera con Grappa ×2 resta un conflitto di ruolo (azzera la L che Grappa dà): non l'ho toccato, è la domanda 3.

## 7. I nove mazzi con le aggiunte contro la banda

Con le varianti scelte e gli scambi rivisti nella bozza: 63 coppie, 100 semi, 217,5 s ([decks-b1b.md](sb-19/b1b/evidence/decks-b1b.md)); violazioni 0. Confronto con la B1 (A1, valori della proposta):

| Mazzo | B1 (A1) | B1b | Massimo (B1b) | Patte max | Nella banda |
|---|---:|---:|---|---:|---|
| Spazienzio + | −7,05 | **−4,51** | +7,26 (specchio) | 5,9 % | no (giù) |
| Mara + | −0,87 (con Secondo fiato +12: −6,35) | **+11,64** | +19,57 (Mara) | 8,5 % | no (su, +1,6; massimo oltre +15) |
| Celestina + | +2,30 (+12: −3,90) | **−3,92** | +3,78 | 11,0 % | no (giù; patte, nota dello specchio) |
| Piera + | −8,93 | **−8,68** | −3,00 | 8,0 % | no (giù) |
| Beppe + | −0,02 | −0,02 | +9,60 | 12,2 % | no (patte: nota dello specchio di Beppe) |
| Sergio + | −20,06 | **−17,00** | −8,36 | 4,4 % | no (giù) |
| Duccio + | −7,57 (+12: −10,10) | **−1,90** | +2,68 | 5,8 % | no (giù, vicino) |
| Equip (Beppe; non criterio) | −3,94 | −3,94 | +1,12 | 11,7 % | n.a. |
| Estasi + Grappa (non criterio) | +21,20 | +21,20 | +29,06 | 10,4 % | n.a. |

Progresso reale solo dove cambia lo scambio (Mara, Duccio). **Riserva:** per come è scritta («in quel mazzo e per la sola carta responsabile») non è applicabile: la bozza ha un solo valore per carta, quindi cambiarlo toccherebbe tutti i mazzi che la contengono. Anche letta globalmente, non c'è una variante che cambi qualcosa: per i mazzi in giù le carte responsabili sono Coccio (V0, V1 e V2 danno lo stesso risultato), Non sento niente e Mezza minerale (già alla variante più forte); per Mara + in su la carta responsabile è Secondo fiato, già a +12, la più debole delle due varianti. Non applicata e dichiarato qui, senza cambiare soglie.

**«Rif»** identico: giro del 18 novembre contro quello della B1, 4.032 incontri e 403.200 partite uguali ([identity-rif-b1b.json](sb-19/b1b/evidence/identity-rif-b1b.json)).

## 8. Domande per il proprietario

1. **Bot e carte ferme.** Mano lesta (0,12 giocate per partita) e Coccio (identico a ×1,5, ×2 e ×2,5) non reagiscono ai numeri: il limite è come le giocano i bot, non il valore della carta. Fuori dal perimetro della B1b (nessun codice dei bot). **Do la lettura di queste carte a un blocco dei bot, o le lascio così?** Raccomandazione: lasciarle e farle leggere dai bot in SB-20.
2. **I mazzi con le aggiunte restano fuori dalla banda** (sei in giù, Mara + in su). Gli scambi sono stati rivisti dove il ruolo non tornava (§ 6); le uscite che restano sono di carte che i bot non giocano. **Le leggo come limite dei bot e non della carta, e passo alla B2?** Alternativa: tolgo le carte ferme (Coccio) dai mazzi.
3. **Mezza minerale in Piera con Grappa ×2** azzera la L che Grappa dà: scambio di ruolo contrario. **Lo cambio (Mezza minerale esce dal mazzo di Piera, resta nel solo Duccio e va sotto le due carte per mazzo), o lo lascio per SB-20, dove si decide Grappa?**
4. **Mara + +11,64** (su): Secondo fiato +12 con Elemosina gratis e Mano lesta ±5. **Tengo +12 (D131 (2)) o la abbasso a +10?** Nessuna variante più debole misurata: servirebbe un giro nuovo.
5. **Elemosina gratis, Non sento niente 5 V ×0,25, Mezza minerale +20 A** sono ora in bozza: ok come esito della regola (sono segnalate, fuori banda per poco)?

## 9. Verifiche

- Bozza (`bozza.json`): tre carte riscritte (Elemosina, Non sento niente, Mezza minerale; Mano lesta resta a ±5), due mazzi (Mara, Duccio); descrizioni e guadagni della GUI riscritti dai valori. Griglia: righe GEN-04, GEN-11, OGG-08, nota ¹⁰ e paragrafo dei mazzi. `Sb19CardsTest`: attesi cambiati **solo** per le tre carte scelte (costo, Non sento niente 5 V ×0,25, Elemosina gratis, Mezza minerale +20 A) e prova dei due scambi dei mazzi.
- Nessun codice di gioco: né `BeggingMoney` né altre classi cambiate (solo dati, e costo 0 nella bozza); passo 0 d'identità e deroga non servono, e il Rif identico lo conferma.
- Eseguite alla fine: vedi la riga del commit (`git diff --check`, `check-links.py`, `check-rules.py`, `./scripts/build.ps1 -Task Test -Offline`, `rarita-bozza.py --check`, `genera-bozza-di-riferimento.py --scrivi` e `--verifica`, `./scripts/build.ps1 -Task Server -Offline`).
- Strumenti: [b1b/](sb-19/b1b/) (`make-variants.py`, `analyze-b1b.py`, `apply-variants.py`, `revise-decks.py`).

Tempi: 1.049 s su 1.800 ([budget.json](sb-19/b1b/evidence/budget.json)).
