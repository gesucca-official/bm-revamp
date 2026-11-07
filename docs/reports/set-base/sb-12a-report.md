# SB-12a — Giro coi bot sugli starter base: rapporto

**Fatto il 7 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, anche +6 A». In tre giri, coi bot e
col banco di SB-7, gli starter base di Spazienzio «Pazienza finita» e Mara «Consegna sul muso» passano da **0,937 a 0,520** per Spazienzio,
e le partite da 13,5–16,5 a **11,1–11,3 turni**. Con la bound di Mara a +6 A, approvata dopo il terzo giro, la bozza finale sta a **0,525**
e 11,3 turni. Invarianti a zero in modo stretto dopo ogni giro. Cambiano solo numeri: la salute dei due personaggi, cinque costi in A di Mara
(D38), il danno di Sgommata e il guadagno di Cambio marcia. Nessuna carta tagliata, ridisegnata o tolta da uno starter.

È la prima metà di SB-12 ([D40](../../set-base-plan.md#decisioni-del-proprietario)); la prova umana è SB-12b e richiede SB-8. Il codice
cambia solo in `server/src/test`. Non sono toccati:
- regolamento, catalogo SQLite, allegato, client, `scripts/check-rules.py` e `scripts/cli-*.cjs` (sono di SB-1, che lavora in parallelo);
- protocollo, classi di produzione e bot;
- le risorse di test `sb-5/`, `sb-6a/`, `sb-11a/` e i file del filone C4.

Nulla della bozza raggiunge la partita viva (SB-28).

## Tetti fissati prima di partire

- **Giri: 3 al massimo**, come propone Q5. Usati tutti e tre.
- **Calcolo: 2 ore** di tempo reale per banco e listino. Usati circa 40 minuti, su 8 thread con Java 11, compresa la rimisura della bozza
  approvata; altri 25 minuti circa sono passati ad aspettare che finissero le verifiche di SB-1, come chiede D40 (una verifica alla volta).

**Ordine delle correzioni**, secondo il piano: prima i numeri, poi costo e priorità, infine il ridisegno. Il punto di partenza di D38 è un
costo; gli altri passi sono numeri. Il ridisegno non è servito.

## Strumenti e due controlli

Ogni variante è la bozza del passo prima con una o più modifiche, scritta in `tmp/sim/sb12a/` da uno script; poi la matrice del banco
(`BenchMeasureTest#matrix`). Tutte le varianti con SHA-256 e lettura sono in [varianti diagnostiche](sb-12a/varianti-diagnostiche.md).

1. **Lo strumento riproduce SB-11b.** La variante «costi −5 A e HEALTH 95» rifatta da zero dà 8345 vittorie, 5724 sconfitte e 1931 patte:
   0,593 [0,585–0,601], identica a SB-11b.
2. **Il lavoro di SB-1 non sposta le misure.** Dalle 18:39 il working tree contiene modifiche di SB-1 a `server/src/main` (carte, factory,
   regole dei mazzi), che le mie corse compilano. Rilanciata a metà blocco, la stessa variante dà le stesse partite cella per cella.

**Un difetto delle mie varianti, corretto.** I bot euristici leggono il danno nominale dal testo della carta (`gui.damageAmount`), non dal
passo `damage`. Le prime varianti di danno cambiavano il numero ma non il testo. Le ho rifatte col testo coerente: la quota non cambia al
terzo decimale (0,526 → 0,525 per Sgommata 26; 0,500 → 0,500 al giro 2). Le matrici dei giri usano i testi giusti, e un test nuovo controlla
che nella bozza costo, danno e testo coincidano per le carte corrette. Non è un difetto del bot: legge i dati pubblici, come previsto da SB-4.

## Giro 1 — Matchup: D38, poi Sgommata 26

**Correzioni.**
- Punto di partenza di D38: costi di Mara −5 A su Cinghiata (10 → 5), Sgommata (20 → 15), Slalom (15 → 10), Paraurti (10 → 5) e Sputo
  (10 → 5); HEALTH di Mara 85 → 95. Misurato: 0,593.
- Secondo passo: **Sgommata 22 → 26 CUT**. Fra sei candidati a 1000 partite per cella (Cinghiata 14, Sputo 14, A di Mara 45, HEALTH di
  Mara 100, V di Spazienzio 20) è quello che arriva nel 45–55% (0,525) e accorcia le partite di Mara; salute di Mara e V di Spazienzio
  arrivano allo stesso punto ma allungano partite già troppo lunghe.

**Misure.** [Matrice](sb-12a/sb7-giro1t-2000.md) ([dati](sb-12a/sb7-giro1t-2000.json)), bozza [`bozze/giro1.json`](sb-12a/bozze/giro1.json),
SHA-256 `24fbb67b1787dcbe31ab9c132fbc0e50ff78fff7ff9df3903bafc6ad99237a52`; 2000 partite per cella, quattro stili, semi
7.000.000–7.001.999, posti alternati; invarianti a zero su 96.000 partite.

| Incontro | Quota di A [IC 95%] | Turni medi (10°–90°) | Patte |
|---|---|---|---:|
| Spazienzio contro Spazienzio | 0,498 [0,492–0,503] | 13,5 (9–18) | 13,8% |
| **Spazienzio contro Mara** | **0,525 [0,519–0,531]** | 13,5 (10–18) | 11,6% |
| Mara contro Mara | 0,499 [0,493–0,505] | 13,8 (10–18) | 11,6% |

Mazzo esaurito: Spazienzio 26,1%, Mara 36,1%. Senza il bot attuale (`com`) la quota di Spazienzio è 0,485.

**Lettura.** Il matchup è nel criterio; la durata no. Le partite però durano 10–12,6 turni fra gli stili aggressivo e risorse e 15–18 con
prudente e `com`, che giocano bound e difese e allungano: una parte dell'eccesso viene dai bot.

## Giro 2 — Durata: salute 85 e 80

**Correzione.** **Salute iniziale −15 a tutti e due: Spazienzio 100 → 85, Mara 95 → 80.** Resta la distanza di D38 (Mara 5 sotto
Spazienzio). Provati 90/85, 85/80 e 80/75: la durata media scende a 12,0, 11,2 e 10,3 turni, il matchup resta fra 0,497 e 0,510, i mazzi
esauriti calano fino al 7–10%. Ho scelto **85/80** perché sta sotto 12 con margine e i mazzi esauriti diventano pochi senza schiacciare le
partite verso il basso. Altre leve per la durata non ce n'erano fra i numeri: il tetto delle bound di danno è 3 (D36), la last resort è
fissata dalla griglia, e alzare tutti i danni avrebbe riscritto i prezzi della griglia.

**Misure.** [Matrice](sb-12a/sb7-giro2t-2000.md) ([dati](sb-12a/sb7-giro2t-2000.json)), bozza [`bozze/giro2.json`](sb-12a/bozze/giro2.json),
SHA-256 `a53bac95c81708d99c8c68cf8dd4155f1d5f576441dd25607b1fea5ab45eb158`; stesse impostazioni; invarianti a zero.

| Incontro | Quota di A [IC 95%] | Turni medi (10°–90°) | Patte |
|---|---|---|---:|
| Spazienzio contro Spazienzio | 0,497 [0,491–0,503] | 11,3 (7–16) | 12,6% |
| **Spazienzio contro Mara** | **0,500 [0,494–0,506]** | 11,1 (7–16) | 10,1% |
| Mara contro Mara | 0,499 [0,493–0,505] | 10,9 (7–16) | 9,9% |

Mazzo esaurito: Spazienzio 10,3%, Mara 14,5%.

**Lettura.** Durata e mazzi esauriti tornano nei criteri. Ma la somma dei quattro stili nasconde una cosa: **senza `com` Spazienzio sta a
0,450**, sul bordo. Il bot attuale gioca Mara molto male (nello specchio di Mara perde 0,015 contro l'aggressivo), e questo regala punti a
Spazienzio nella somma.

**Controllo dei bot, prima di toccare carte (punto 5).** Sulle carte che i bot giocano poco o in svantaggio, due prove a 1000 partite per
cella: renderle più economiche, e toglierle dallo starter al posto di carte semplici.

| Carta | Prova | Risultato |
|---|---|---|
| Steal (Mara) | costo 10 → 5 A | giocata nell'8,0% delle partite invece del 7,5%: non è il prezzo |
| Steal | sostituita da una seconda Slalom | Mara +2 punti |
| Paraurti (Mara) | due copie sostituite da Slalom e Tartaruga | Mara +2,5 punti |
| Tartaruga (Mara) | sostituita da Slalom | Mara +2,7 punti |
| YouStop (Spazienzio) | due copie sostituite da Mattone e HealingBlow | Spazienzio +8,4 punti |
| Tartaruga (Spazienzio) | due copie sostituite da Mattone e Denti stretti | Spazienzio +6 punti |

In mano a questi bot **ogni parata del turno e ogni contromossa vale meno di un colpo semplice**, per tutti e due. È il limite noto: i bot
non leggono la mossa dell'avversario, che è proprio ciò che fa rendere una parata «in questo turno» o un annullamento. Steal in più non
trova bersagli: Spazienzio ha un posto solo per gli oggetti e li consuma presto, e i bot la valutano con un punteggio fisso senza guardare
l'oggetto. **Nessuna di queste carte è tagliata o indebolita.**

## Giro 3 — Centrare il matchup fra gli stili: Sgommata 25

**Correzione.** **Sgommata 26 → 25 CUT.** Quattro candidati a favore di Spazienzio (Sgommata 25 e 24, HEALTH di Mara 78, Cinghiata 11): il
più piccolo che mette dentro il 45–55% con margine sia la somma dei quattro stili sia quella dei tre euristici. Il punto medio fra le due
letture torna a circa 0,50; la durata non cambia.

**Misure, sulla bozza vera.** [Matrice](sb-12a/sb7-giro3-2000.md) ([dati](sb-12a/sb7-giro3-2000.json),
[tempi](sb-12a/sb7-giro3-2000.tempi.txt)) della bozza `server/src/test/resources/set-base/bozza.json` di quel momento, copiata in
[`bozze/giro3.json`](sb-12a/bozze/giro3.json), SHA-256 **`441b1ecd63042165d30804143a50628bc495fe17a2859906b5fcf18ef4841cf4`**, con lo stesso
contenuto della variante scelta; 2000 partite per cella, stili aggressivo, prudente, risorse e `com` (16 coppie), semi 7.000.000–7.001.999,
posti alternati. Il file della matrice si chiamava `sb7-bozza-2000`: l'ho rinominato per far posto a quello della bozza approvata.

| Incontro | Quota di A [IC 95%] | Turni medi [IC 95%] | Mediana (10°–90°) | Patte |
|---|---|---|---|---:|
| Spazienzio contro Spazienzio | 0,497 [0,491–0,503] | 11,33 [11,29–11,37] | 11 (7–16) | 12,6% |
| **Spazienzio contro Mara** | **0,520 [0,514–0,526]** | 11,25 [11,21–11,29] | 11 (7–16) | 10,4% |
| Mara contro Mara | 0,499 [0,494–0,505] | 11,11 [11,07–11,14] | 11 (7–16) | 10,0% |

**Invarianti:** zero violazioni su 96.000 partite e 2.155.712 turni di giocatore; mai senza mosse, mai il limite dei 200 turni, sei bound
su sei entro il tetto coi predefiniti D33/D36.

**Dispersione fra gli stili**, Spazienzio contro Mara:

| Lettura | Quota di Spazienzio |
|---|---|
| Quattro stili, 16 coppie (il criterio) | **0,520** |
| Tre stili euristici, 9 coppie | 0,476 |
| Stessi stili sui due lati | aggressivo 0,314 · prudente 0,483 · risorse 0,709 · `com` 0,698 |
| Coppie estreme | 0,147 (`com` contro aggressivo) e 0,977 (risorse contro `com`) |

La dispersione è grande e viene dai bot: lo stile risorse gioca bene Spazienzio (accumula V per i colpi grossi), l'aggressivo gioca bene
Mara, `com` gioca male Mara. Il criterio è la somma dei quattro; la somma dei tre euristici sta anch'essa nel 45–55%.

**Durata per stile** (stesso stile sui due lati, nei tre incontri): aggressivo 8,5–9,6 turni, risorse 7,9–9,8, prudente 14,2–15,3,
`com` 13,4–15,9.

**Mazzi esauriti e last resort:** Spazienzio 10,4% e 6,5%, Mara 15,3% e 10,7% (erano 27,9% e 58,3% di mazzo esaurito in SB-11b).

**Risorse a fine partita:** a Spazienzio restano 4,7 V se vince e 16,0 se perde; a Mara 1,3 A se vince e 11,3 se perde (prima finiva
sotto zero). La A di Spazienzio (16–23) resta quasi intera: la spende solo la Tartaruga.

**Carte**, su tutti gli stili:

| | Carte |
|---|---|
| Più giocate | SPA-BO2 3 HIT (3,79 a partita, 94,4%), Spintone (86,4%), Sputo, Cinghiata e Sgommata (81–82%) |
| Quasi mai | **Steal** (7,5% delle partite): mancano i bersagli e il bot non la valuta; non è il prezzo (vedi il giro 2) |
| Rare per natura | Struggle (5,2% e 8,0%): la last resort arriva in mano di rado ora che le partite sono più corte |
| Giocate in svantaggio | Paraurti (34%, quota se giocata 0,285), Tartaruga di Mara (23%, 0,277), YouStop (31,5%, 0,385), Tartaruga di Spazienzio (37,6%, 0,407) |
| Ferme in mano oltre 1,5 turni | Glare 2,43, MadeOfStone 2,26, YouStop 2,49, Tartaruga 2,49 e Denti stretti 2,18 per Spazienzio; Paraurti 4,01, Sorpasso 3,43, Spintone 2,12 e Tartaruga 2,79 per Mara |

**Lettura.** «Quasi sempre» lo sono la bound di danno (sempre in mano, e i bot la giocano troppo: vedi D36) e Spintone, la carta gratuita da
un'unità: nessuna carta regolare a costo lo è. «Quasi mai» resta solo Steal, per i limiti dei bot dichiarati sopra.

## Dopo il giro 3 — Cambio marcia +6 A, decisione del proprietario

La misura di D36 e B2 sulla bozza del giro 3 (più sotto) ha trovato la bound +8 A di Mara a circa 4,5 HEALTH equivalenti per uso, sopra il
tetto di 4. Il tetto dei giri era raggiunto, quindi l'ho proposta al proprietario invece di applicarla. **Il proprietario ha approvato:
«Approvo, anche +6 A».** MAR-BO2 passa da +8 a +6 A, testi compresi (`gains`, `description`).

**Misure sulla bozza approvata.** [Matrice](sb-12a/sb7-bozza-2000.md) ([dati](sb-12a/sb7-bozza-2000.json),
[tempi](sb-12a/sb7-bozza-2000.tempi.txt)) di `server/src/test/resources/set-base/bozza.json`, SHA-256
**`bf7b97ce2b6f1ea039ff706d4d916ebe83a78d6e7972dd68fbe15d0fd8db0c39`**, con lo stesso contenuto della variante diagnostica `q-cambio6`;
stesse impostazioni del giro 3.

| Incontro | Quota di A [IC 95%] | Turni medi | Mediana (10°–90°) | Patte |
|---|---|---|---|---:|
| Spazienzio contro Spazienzio | 0,497 [0,491–0,503] | 11,33 | 11 (7–16) | 12,6% |
| **Spazienzio contro Mara** | **0,525 [0,520–0,531]** | 11,26 | 11 (7–16) | 10,4% |
| Mara contro Mara | 0,499 [0,493–0,505] | 11,28 | 11 (7–16) | 9,5% |

- **Invarianti:** zero su 96.000 partite e 2.167.492 turni di giocatore; sei bound su sei entro il tetto.
- **Dispersione:** 0,479 coi tre stili euristici; stessi stili aggressivo 0,314, prudente 0,483, risorse 0,710, `com` 0,716; coppie
  estreme 0,149 e 0,980.
- **Durata per stile:** aggressivo 8,6–9,6, risorse 7,9–10,0, prudente 14,2–15,3, `com` 13,4–16,3.
- **Mazzi esauriti e last resort:** Spazienzio 10,5% e 6,5%, Mara 16,3% e 11,6%.
- **Carte:** come al giro 3. Cambio marcia si gioca nel 31,7% delle partite (0,71 a partita) invece del 40,5%; Steal nel 7,4%.
- **Risorse a fine partita:** a Mara restano 0,3 A se vince e 9,2 se perde.

## Stato finale contro i criteri

Bozza approvata, SHA-256 `bf7b97ce…8db0c39`:

| Criterio | Obiettivo | Esito | |
|---|---|---|---|
| Matchup fra starter base | 45–55% | 0,525 [0,520–0,531]; 0,479 coi soli euristici; stessi stili 0,31–0,72 | ✓, con la dispersione dichiarata |
| Durata | circa 6–12 turni | 11,3 di media, mediana 11, 10°–90° 7–16; 8–10 coi bot forti, 13–16 coi deboli | ✓ |
| Patte | poche | 9,5–12,6% | da giudicare (sotto) |
| Mazzi esauriti | pochi | 10,5% e 16,3% | ✓ |
| Turni senza mosse | zero | zero su 96.000 partite | ✓ |
| Carte quasi sempre o quasi mai | nessuna | Steal quasi mai; per il resto nessuna, coi limiti dei bot dichiarati | ✓ coi limiti |

**Le patte.** Restano intorno a una partita su dieci in tutti i giri (6–19% in SB-11b; fra due bot prudenti fino al 31%). Una patta è zero superstiti:
il regolamento fa proseguire una mossa già presentata anche se l'autore muore (R04) e dà patta a zero superstiti (R06), quindi due giocatori che si colpiscono a fondo nello
stesso turno muoiono insieme. È una proprietà della regola, non dei numeri degli starter: né la salute né i danni la spostano (10,0–10,6% con
salute 90, 85 o 80). Se una partita su dieci è troppo, la leva è il regolamento, e la decisione è del proprietario.

## D36, B2 e listino sugli starter corretti

`ListinoMeasureTest`, `-Dsim.listinoBase=set-base -Dsim.listinoAnchor=7`, gruppi `costo`, `tipo`, `salute` e `tettostarter`, tre stili
euristici. Bisezione 400, griglia 2000 e curve 2000 partite per stile e punto. Lanciato due volte, 679.200 partite ciascuna:
- **sulla bozza del giro 3** (base derivata SHA-256 `5be5c747…a78c1e8f`, 340 secondi): [testo](sb-12a/sb12a-listino-giro3-costo+tipo+salute+tettostarter.md),
  [dati](sb-12a/sb12a-listino-giro3-costo+tipo+salute+tettostarter.json);
- **sulla bozza approvata** (base derivata SHA-256 `1375ff68…457d6823`, 279 secondi): [testo](sb-12a/sb12a-listino-costo+tipo+salute+tettostarter.md),
  [dati](sb-12a/sb12a-listino-costo+tipo+salute+tettostarter.json).

Il listino scrive i file col nome `sb11b-listino-*`: li ho copiati come `sb12a-listino-*`. Le tabelle sotto sono del giro 3, con i valori
della bozza approvata dove cambiano.

### D36 e B2

Criterio di D33: quota della bound (più una nulla) contro due nulle al massimo 0,60. Criterio di D38: salute equivalente per uso al
massimo 4, stimata come in SB-11b con la pendenza della salute dei contesti del listino (Spazienzio 2,01 ± 0,09 punti per HEALTH, Mara
3,33 ± 0,09).

| Bound | Starter | Quota [IC 95%] | Giocate a partita | +10 punti | Salute equivalente per uso | ≤ 4 |
|---|---|---|---:|---|---:|---|
| SPA-BO1 +5 V | Spazienzio | 0,578 [0,565–0,592] | 1,02 | ✓ | 3,8 | ✓ |
| SPA-BO2 3 HIT | Spazienzio | 0,316 [0,304–0,329] | 4,11 | ✓ | −2,2 | ✓ |
| SPA-BO3 «TESTA AL MURO» | Spazienzio | 0,543 [0,530–0,557] | 1,05 | ✓ | 2,0 | ✓ |
| MAR-BO1 3 CUT | Mara | 0,694 [0,681–0,706] | 2,32 | ✗ | 2,5 | ✓ |
| **MAR-BO2 +8 A (B2)** | Mara | **0,723 [0,710–0,735]** | 1,49 | ✗ | **4,5** | **✗** |
| MAR-BO3 2 CUT | Mara | 0,640 [0,627–0,653] | 2,40 | ✗ | 1,7 | ✓ |
| sonda 3 HIT | Mara | 0,702 [0,689–0,714] | 2,30 | ✗ | 2,6 | ✓ |
| sonda 2 HIT | Mara | 0,647 [0,634–0,660] | 2,39 | ✗ | 1,8 | ✓ |
| **MAR-BO2 +6 A, bozza approvata** | Mara | **0,679 [0,666–0,691]** | 1,64 | ✗ | **3,3** | **✓** |

Sulla bozza approvata la pendenza della salute di Mara è 3,36 ± 0,09 e le altre bound danno le stesse quote al terzo decimale.

**Lettura:**
- **Spazienzio** sta nei due criteri. La bound di danno vale meno di una nulla perché i bot la giocano quattro volte a partita scartando
  carte buone: limite dei bot, come in SB-11b.
- **Mara** supera ancora i +10 punti con ogni bound, anche se molto meno di SB-11b (0,64–0,72 invece di 0,77–0,89): il criterio dei +10
  punti resta più severo nel suo specchio. Con la salute equivalente, che D38 ha scelto come misura per lei, **le bound di danno stanno
  sotto 4** (3 CUT a 2,5).
- **B2, la bound +8 A, è l'unica sopra 4: circa 4,5** (4,1–4,9 con gli intervalli). In SB-11b valeva 2,5: ora che le carte di Mara costano
  meno, la A in più rende di più, e la bound si gioca meno spesso ma vale di più a ogni uso.
- **Variante diagnostica:** +6 A invece di +8 (SHA-256 `f7dd999d…7c99efee`). Quota 0,679 [0,666–0,691], 1,64 giocate: **circa 3,3 per
  uso**, dentro il tetto. Il matchup quasi non si muove: 0,528 [0,520–0,536] a 1000 partite per cella (0,522 la bozza), 0,487 senza `com`,
  durata uguale. Il tetto dei giri era raggiunto, quindi l'ho proposta al proprietario, che l'ha **approvata**; rimisurata sulla bozza
  approvata, resta a circa 3,3.

### Listino con l'àncora a 7 HIT

| Voce | Contesto | SB-12a [IC 95%] | SB-11b |
|---|---|---|---|
| 10 V | Spazienzio | 17,9 HIT [17,7–18,0], 1,09 per V | 18,4 |
| 20 V | Spazienzio | 37,3 HIT [37,2–37,5], 1,52 per V | 38,9 |
| 30 V | Spazienzio | 72,9 HIT [72,1–73,7], 2,20 per V | 75,7 |
| 10 A | Mara | 16,6 HIT [16,5–16,7], 0,96 per A; con +6 A 17,4, 1,04 per A | 16,7 |
| 20 A | Mara | 29,5 HIT [29,4–29,6], 1,13 per A; con +6 A 30,3, 1,16 per A | 30,0 |
| 10 A | Spazienzio | 8,8 HIT, 0,18 per A | 8,8 |
| 5 L | Spazienzio | impagabile: piatta fino a 57 HIT | uguale |
| CUT, POISON | Spazienzio | 0,87 e 0,96 HIT per unità | 0,85 e 0,95 |
| CUT, POISON | Mara | 0,99 e 1,02 HIT per unità | 0,99 e 1,02 |
| Salute iniziale | Spazienzio, Mara | 2,01 ± 0,09 e 3,33 ± 0,09 punti per HEALTH (Mara 3,36 con +6 A) | 1,83 e 4,06 |

**Lettura:**
- I prezzi delle risorse quasi non cambiano: **la A di Mara vale sempre circa 1 HIT** e la V oltre 20 resta molto più cara. Con questi
  prezzi le carte di Mara ora stanno sulla linea: Cinghiata (5 A, 12 CUT) e Sputo (5 A, 12 POISON) a circa 12, Sgommata (15 A, 25 CUT)
  circa 2 HIT sopra. Quelle di Spazienzio sopra 10 V restano sotto la linea (HealingBlow 30 contro circa 37; SuperImpact 40 per 25 V), ma il
  matchup è pari: la V iniziale 25 e le cariche (Glare, MadeOfStone, Cocktail) compensano. La regola «picco condizionato, media in linea» va
  guardata sull'intero starter, non carta per carta.
- La salute pesa di più per Spazienzio (2,01 punti per HEALTH invece di 1,83) e meno per Mara (3,33 invece di 4,06): le due scale si
  avvicinano, coerente con partite più corte e più equilibrate.

## Codice e bozza

Tutto in `server/src/test`.

| File | Cosa cambia |
|---|---|
| `resources/set-base/bozza.json` | Salute di Spazienzio 85 e di Mara 80; costi in A di Cinghiata 5, Sgommata 15, Paraurti 5, Slalom 10, Sputo 5; Sgommata 25 CUT; Cambio marcia +6 A. Testi (`description`, `damageAmount`, `gains`) allineati. SHA-256 da `74540167…fe02ee94` a `441b1ecd…ef4841cf4` (giro 3), poi a `bf7b97ce…8db0c39` (approvata) |
| `java/.../sim/SetBaseDraftTest.java` | Una prova nuova, `theStartersCarryTheSb12aCorrections`: salute, cinque costi in A, Sgommata e Cambio marcia, compresi i testi che i bot leggono. Le otto prove di SB-11b restano com'erano |

Nessun test esistente indebolito, nessun atteso cambiato. La prova nuova sa fallire: è scritta sui valori nuovi, quindi la bozza di SB-11b
la fa fallire alla prima asserzione (salute 100 e 85 invece di 85 e 80).

## Documenti di progetto

- [Griglia](../../design/set-base/griglia.md): una nota per ogni numero cambiato (righe di PG-SPA, PG-MAR, MAR-BO2, MAR-AR1, AR2, AR4, AR5 e
  GEN-17, col valore vecchio barrato; B2 precisata fra le decisioni) e la sezione [Correzioni di SB-12a](../../design/set-base/griglia.md#correzioni-di-sb-12a) con giro e motivo.
  Slalom passa da F2 a F1. Il resto della griglia non cambia.
- [Schede](../../design/set-base/schede-personaggi.md): HEALTH di Spazienzio e Mara con una nota e il riferimento a D38 e D41; tabella dei
  valori iniziali aggiornata. Il resto delle schede non cambia.

## Cosa non è provato

- **I bot.** Ogni numero dice come giocano questi bot. In particolare:
  - giocano male parate del turno e contromosse, per tutti e due: senza YouStop Spazienzio guadagna 8 punti, senza Paraurti Mara 2,5;
  - **l'equilibrio poggia su questo errore in modo asimmetrico**: Spazienzio porta quattro carte che i bot sprecano (YouStop e Tartaruga,
    circa 14 punti), Mara quattro che valgono meno (Paraurti, Tartaruga, Steal, circa 7). Un umano che legge l'avversario potrebbe spostare
    il matchup verso Spazienzio;
  - giocano troppo la bound di danno, valutano Steal senza guardare l'oggetto, non preparano un colpo con l'equip;
  - lo stile cambia molto l'esito (da 0,15 a 0,98 per coppia di stili).
- **La salute equivalente** è una stima: usa la pendenza dei contesti del listino, non degli starter.
- **La scala della salute.** Spazienzio e Mara sono scesi di 15; i personaggi avanzati e da booster restano sulla scala di SB-9 (100–130).
  Contro gli starter corretti, partite più lunghe e più salute potrebbero pesare: è una domanda per SB-13, non provata qui.
- **Sputo è una generica**: a 5 A vale per chiunque la metta in mazzo. Nel set di oggi la usa solo Mara; Rocco (SB-18) la avrà.
- **Il divertimento.** Nessuna partita umana: il simulatore misura l'equilibrio, non se diverte.
- **`TestServerContext` non lanciato:** il blocco tocca solo `server/src/test` e i documenti; contesto Spring, CLI e classi di produzione non
  cambiano per opera di questo blocco.

## Verifiche

Eseguite una alla volta, dopo aver aspettato che finissero le verifiche di SB-1 (Maven, Java e `verify-all` del client).

**Prima del giudizio**, sulla bozza del giro 3, col lavoro di SB-1 ancora da committare nel working tree:
- `./scripts/build.ps1 -Task Test -Offline`: **verde**, in 89 secondi. Maven 588 test, 0 falliti, 7 saltati (le misure a richiesta);
  `SetBaseDraftTest` 9 su 9; client 37 su 37. Il totale di Maven (579 in SB-11b, più la mia prova) comprende anche test di SB-1.
- `python scripts/check-rules.py`: allineato; anche questo leggeva i file di SB-1 in corso.

**Dopo l'approvazione**, sulla bozza approvata e su SB-1 ormai committato (`32cea0e`), col working tree che contiene solo questo blocco:
- `./scripts/build.ps1 -Task Test -Offline`: **verde**, in 76 secondi. Maven 588 test, 0 falliti, 7 saltati; `SetBaseDraftTest` 9 su 9,
  compreso il controllo su Cambio marcia +6 A; client 37 su 37.
- `python scripts/check-rules.py`: regolamento e copia client allineati; 39 carte e 1 token; starter conformi a R02 1.12; SQLite integro.
- **La prova nuova sa fallire:** con la bozza di SB-11b al posto di quella corretta, `theStartersCarryTheSb12aCorrections` fallisce con
  `expected: <{…BigBadBruiser=85, …Mara=80}> but was: <{…BigBadBruiser=100, …Mara=85}>`. Poi ho rimesso la bozza corretta e ricontrollato
  lo SHA-256.
- `TestServerContext`: non lanciato, per il motivo detto sopra.

## Decisioni del proprietario

Le correzioni dei giri le ho prese con la delega del proprietario sui numeri (D38: «a questo livello di dettaglio mi fido di te»): salute
85 e 80, costi di D38, Sgommata 25, Steal e le contromosse tenute. Al rapporto il proprietario ha risposto **«Approvo, anche +6 A»**,
registrato nel piano come **D41**: approvate le correzioni dei tre giri e, in più, Cambio marcia da +8 a +6 A, applicata e misurata sopra.

La domanda posta riguardava solo questi due punti. Restano quindi raccomandazioni, da riprendere nei blocchi che le toccano:
1. **La scala della salute** degli altri personaggi: SB-13 parte dalla salute di SB-9 meno 15 come ipotesi per gli avanzati, e la misura.
2. **Le patte** al 10%: tenerle fino alla prova umana; poi, se devono scendere, una domanda sul regolamento.
3. **Steal nello starter di Mara:** tenerla per la prova umana invece di sostituirla con una seconda Slalom (+2 punti per Mara).

## Cosa serve a SB-12b

1. SB-8, la bozza giocabile da umani, con i valori della bozza approvata (SHA-256 `bf7b97ce…8db0c39`).
2. Guardare soprattutto parate e contromosse: se un umano le gioca bene, il matchup si sposta verso Spazienzio (vedi sopra). Una manciata
   di partite non lo misura, ma lo fa vedere.
3. Durata percepita: 11 turni di media sono pochi o tanti per una partita umana?
4. Patte, Steal e il nome dei due starter in partita.

## Cosa serve a SB-13

- **Base stabile:** gli starter base sono pronti come base per i bot: matchup, durata, mazzi esauriti e invarianti nei criteri, e tutte le
  bound entro il tetto di D38. La bozza di riferimento è quella approvata (SHA-256 `bf7b97ce…8db0c39`).
- **Scala:** salute di Spazienzio 85 e Mara 80; le schede degli avanzati sono ancora sulla scala di SB-9.
- **Prezzi:** A di Mara circa 1 HIT, V oltre 20 molto più cara, CUT contro Spazienzio 0,87.
- **Metodo:** testi delle carte sempre allineati ai numeri nelle varianti, perché i bot li leggono; tre letture del matchup (quattro stili,
  tre euristici, stessi stili).
- D40: SB-13 resta dopo SB-12 intero; se la prova umana tarda, il proprietario può anticiparlo dopo SB-12a.
