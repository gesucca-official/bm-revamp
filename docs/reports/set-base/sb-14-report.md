# SB-14 — Pino l'Ultimo Giro: bozza dello starter e giro coi bot: rapporto

**Fatto l'8 novembre 2026, in attesa del giudizio del proprietario.** Lo starter di Pino, **«Chiude quando dico io»**, è nella bozza del Set
Base come nella [griglia](../../design/set-base/griglia.md), senza scostamenti nella composizione. GoingBerserk riprogettata e «L'ultimo
giro» usano la classe Java di B1, scritta nei sorgenti di test: il passo 0 l'ha segnalata e il proprietario ha deciso «Tutto in SB-14».

In tre giri coi bot Pino passa da **0,122, 0,099 e 0,099** contro Spazienzio, Mara e Tossico a **0,591, 0,559 e 0,431**, con lo specchio
a 0,503. Invarianti a zero in modo stretto dopo ogni giro.

Cambiano solo numeri di Pino, con la delega di D38:
- salute 110 → 95 → 100;
- L iniziale 10 → 20;
- Estasi da Coca Etilene (PIN-AR2) da 3 + L a 10 + L;
- L'ultimo giro (LR-PIN) da 6 + L a 12 + L;
- Testata 20 → 25 → 20 HIT, cioè com'era.

Nessuna carta tagliata, ridisegnata o tolta dallo starter. Gli starter di Spazienzio, Mara e Tossico sono identici, cella per cella, a quelli
approvati in SB-12a e SB-13.

Il codice cambia solo in `server/src/test`. Non sono toccati:
- regolamento, documento del set, catalogo SQLite, allegato, client, `scripts/` e `tools/`;
- protocollo, classi di produzione e bot;
- il caricatore e le risorse di SB-6b, che ha lavorato in parallelo e ha committato durante il blocco (`e8389f7`);
- i file del filone C4.

Nulla della bozza raggiunge la partita viva (SB-28).

## Passo 0 — Fattibilità

Due carte non si scrivono coi passi di oggi: **GoingBerserk riprogettata (PIN-AR2) e «L'ultimo giro» (LR-PIN)**, che fanno danno pari
alla L residua e poi la azzerano.
- R04, punto 4, applica la logica speciale, poi gli effetti su sé, poi quelli sul bersaglio (`AbstractCard`, righe 44–46).
- Nei dati `Amount` legge la risorsa dell'autore quando il passo si applica, quindi l'azzeramento su sé arriverebbe prima del danno.
- Nella lista `target` i passi `empty` e `lose` agiscono sul bersaglio, non sull'autore.
- Nessuna classe esistente legge una risorsa e colpisce: `ToxicBloodDrain` travasa T, `GoingBerserk` ha 10 L e 30 HIT fissi, senza `@Tunable`.

La griglia l'aveva già deciso (B1: una classe Java che memorizza, azzera e colpisce). Mi sono fermato e ho proposto di dividere il blocco;
il proprietario ha risposto **«Tutto in SB-14»**. La classe vive nei sorgenti di test e **non tocca il caricatore** di SB-6b: `Draft` e
`SimulationCatalog` trovano una classe Java dal binding con `Class.forName("com.gsc.bm.model.cards." + binding)`, quindi il pacchetto di test
`com.gsc.bm.model.cards.base.pino` si carica dal binding `base.pino.…`.

| Slot | Carta | Via |
|---|---|---|
| PG-PIN | Pino l'Ultimo Giro | dati: risorse, capacità 2, nessuna immunità (D28). La L che cala è il motore (R06) |
| PIN-BA | Questo lo finisco io | dati: `gain` +5 L a sé, poi `consume` |
| PIN-BO1 | Cinque minuti e vado | dati: `gain` +10 L a sé |
| PIN-BO2 | Spallata al bancone | dati: `damage` 3 HIT |
| PIN-BO3 | Coccio | dati: `damage` 2 CUT |
| LR-PIN | L'ultimo giro | **Java nuova** `base.pino.UltimoGiro` (sottoclasse di quella sotto, `lastResort` nel costruttore): 5 HIT a sé, HIT pari a 6 + L, L a zero; `exclusiveTo` Pino |
| PIN-AR1 | Testata da ultimo giro | dati: costo 5 L; 5 HIT a sé, 20 HIT |
| PIN-AR2 | Estasi da Coca Etilene | **Java nuova** `base.pino.GoingBerserk`: `@Tunable base 3, selfHit 0`; memorizza la L, la azzera, colpisce |
| PIN-AR3 | Il bancone regge, io pure | dati: `status` INPUT HIT ×0,5 `turns: 0`, `gain` +5 L |
| PIN-AR4 | Offro io | dati: costo 5 L; `gain` +20 L nella lista `target` |
| PIN-AR5 | Rutto a distanza sociale | dati: costo 5 L; `lose` ALERTNESS `{base 0, of ALCOHOL}` al bersaglio, poi 5 HIT |
| GEN-01, 16, 18 | Grab, Fasciatura, Spintone | dati, già nella bozza |
| OGG-02 | Peroni da 66, calda | dati col binding `com.items.RottenBeer` (+10 L), come Kebab in SB-13: la classe dà +5 fisso |
| OGG-03 | Tennents Super | Java `AnotherRottenBeer`, `alcohol 10`; crea il token `BrokenBeerBottle` |
| OGG-05 | Amaro nel bicchiere di plastica | dati: +20 L, −5 A |

**Punti chiesti dalla regia:**
- L che decade: motore (R06), nessuna carta.
- Carte che spendono la L residua: le due sopra, con la classe nuova; il Rutto la legge senza consumarla ed è a dati.
- Immunità: un dato del personaggio, provato come variante (D28).
- Costi in L: tutti 5 o meno (D33).
- A sotto zero: nessuna carta dello starter costa A, e `loseResource` lo ammette (R01). Una prova lo controlla.

**Una lettura del codice per i bot.** `BotView.nominalDamage` legge il primo numero di `gui.damageAmount`, ma il banco stampa «Il «+x» del
catalogo è stimato 5 dai bot»: i bot vedono «HIT 3+x» come circa 8, non come 3+L.

## Bozza e convenzioni

[`server/src/test/resources/set-base/bozza.json`](../../../server/src/test/resources/set-base/bozza.json), formato `sb-6a/1` (si carica
com'è anche col caricatore `sb-6b/1` di SB-6b), finale SHA-256 **`3678856259bd2633ea55bb51b23870b62fff1f08eb783f80a8225182cd2f27d5`**.

**Binding,** come in SB-11b e SB-13:
- le carte di oggi tengono il binding della loro classe, anche quando ora sono a dati (`com.items.RottenBeer`);
- le Java parametriche tengono la classe (`com.items.AnotherRottenBeer`);
- le nuove hanno il prefisso `base.`, comprese le due Java nuove (`base.pino.GoingBerserk`, `base.pino.UltimoGiro`).

Lo slot apre `gui.description`.

| Blocco | Contenuto |
|---|---|
| Personaggio | `base.character.Pino` «Pino l'Ultimo Giro»: H 100, A 15, V 0, T 0, L 20, capacità 2, nessuna immunità |
| Basic, bound, last resort | PIN-BA; PIN-BO1 +10 L e PIN-BO2 3 HIT nello starter; PIN-BO3 2 CUT nella collezione; LR-PIN «L'ultimo giro» |
| Archetipo (9) | Testata 2, Estasi da Coca Etilene 2, Bancone 2, Offro io 2, Rutto 1 |
| Generiche (6) | Grab 2, Spintone 2, Fasciatura 2 |
| Oggetti (5) | Amaro 2, Peroni 2, Tennents 1 |

Regole dei mazzi del regolamento: 20 carte regolari, al massimo 2 copie; basic propria e fissa; due bound proprie diverse e gratuite; last
resort propria, gratuita e senza bersaglio oggetto. 11 carte distinte, 1 rara (Rutto).

**Nomi.**
- Lo starter tiene il nome della bozza esterna, **«Chiude quando dico io»**, come nella griglia; l'id resta `starter-pino`, perché il nome
  non ha un campo nel formato.
- Le carte di oggi tengono il nome italiano del catalogo: PIN-AR2 è «Estasi da Coca Etilene», il nome di `GoingBerserk`; OGG-02 e OGG-03
  sono «Peroni da 66, calda» e «Tennents Super».
- Le nuove hanno il nome di lavoro della griglia.

## Tetti fissati prima di partire

- **Giri: 3 al massimo** (Q5). Usati tutti e tre.
- **Calcolo: circa 2 ore.** Usati circa 105 minuti di banco e listino su 8 thread con Java 11: tre matrici a 2000 partite per cella, 42
  varianti a 1000, due listini.
- **Fermi non miei.**
  - Circa 10 minuti all'inizio, perché il `Draft.java` di SB-6b in modifica non compilava. Da lì le misure girano in una copia di HEAD
    (`ff2b45d`) più i file di SB-14, in `tmp/sb14-build`.
  - Circa 15 minuti senza Maven, cancellato da `.tools` alle 13:50 dalla rimozione di un worktree di SB-6b e ripristinato dalla regia.
- **Delega:** numeri, costi e priorità di Pino (D38). Ridisegni, cambi d'identità o di criterio: al proprietario.
  - L'immunità a L è stata solo una variante di confronto (D28).
  - Non ho tolto né sostituito nessuna carta.

## Gli starter approvati restano identici

**Prova.** Con lo stesso seme e le stesse impostazioni di SB-13:
- 2000 partite per cella, stili aggressivo, prudente, risorse e `com`, semi 7.000.000–7.001.999, posti alternati;
- mazzi nell'ordine Pino, Tossico, Spazienzio, Mara, così le celle senza Pino hanno lo stesso orientamento di SB-13.

In tutti e tre i giri **le 96 celle degli incontri fra Spazienzio, Mara e Tossico coincidono una per una** con la matrice finale di SB-13
(`sb-13/sb7-giro3-2000.json`): vittorie, sconfitte, patte, limite, primo posto, turni, mediana, percentili, minimo e massimo.
- Spazienzio contro Mara: 15.071 vittorie, 13.615 sconfitte, 3314 patte, **0,525**, come in SB-12a e SB-13.
- Tossico contro Spazienzio 0,529, contro Mara 0,479, specchio 0,507, come in SB-13.
- In tutte le 42 varianti a 1000 partite per cella la cella Spazienzio contro Mara dà 7557, 6754 e 1689.
- Nel listino finale le 16 bisezioni e le 27 curve già misurate in SB-13 coincidono una per una; cambia solo l'impronta della bozza derivata.

Le carte di Spazienzio, Mara e Tossico non sono toccate.

## Giro 1 — La bozza della griglia

**Bozza.** Lo starter come nella griglia, coi valori della scheda e la salute di SB-9 meno 15 (95) come ipotesi da misurare.
[Matrice](sb-14/sb7-giro1-2000.md) ([dati](sb-14/sb7-giro1-2000.json)), bozza [`bozze/giro1.json`](sb-14/bozze/giro1.json), SHA-256
`e9b0a357f03cabbfaa73756d4e89904d3d03ef43fe5d07579056adf39f4154f5`; quattro mazzi (dieci incontri), 2000 partite per cella, 320.000 partite;
invarianti a zero.

| Incontro | Quota di Pino [IC 95%] | Tre stili euristici | Turni medi | Patte |
|---|---|---|---:|---:|
| contro Spazienzio | **0,122** [0,118–0,126] | 0,106 | 15,1 | 11,9% |
| contro Mara | **0,099** [0,095–0,102] | 0,014 | 14,4 | 7,4% |
| contro Tossico | **0,099** [0,096–0,102] | 0,017 | 15,2 | 4,7% |
| specchio | 0,505 | 0,502 | 18,8 | 31,6% |

**Lettura: Pino non ha carburante.**
- Testata, Offro io e Rutto (5 L) restano morte in mano per l'83%, il 78% e l'88% dei turni in cui le ha.
- Due stili su tre non giocano mai la bound di L. Il prudente toglie 0,4 punti per ogni L guadagnata; il risorse penalizza la L oltre il
  costo più alto in mano. Il `com` la gioca 3,5 volte a partita e vince meno degli altri.
- Il mazzo si esaurisce nell'80% delle partite.
- L'ultimo giro, a L zero, fa 6 HIT contro i 10 di Struggle.

Con l'immunità a L (variante di D28, solo confronto) Pino sale a 0,528, 0,512 e 0,400: la L che cala, più i bot che non bevono, valgono
circa 40 punti.

**Una lettura della griglia, smentita.** «Giocando PIN-BO1 ogni turno Pino si stabilizza a 8–9 L e paga sempre una carta da 5 L»: ma si
gioca una carta per turno, e il turno della bound è un turno senza la carta pagata. Bere e colpire costano due turni.

## Giro 2 — L 20, Estasi 10, L'ultimo giro 12, Testata 25

**Varianti** (1000 partite per cella, [tabella](sb-14/varianti-diagnostiche.md#giro-1--giro-2-le-leve)): trentuno varianti.
- **Le leve singole spostano poco:** salute 110 circa +16 punti contro Spazienzio, L'ultimo giro a 10 circa +13, Testata 25 circa +8, L 20
  circa +5, costi a 3 L circa +4. La A iniziale non conta.
- **Combinate si moltiplicano.** Salute 110, L 20, Estasi 6, L'ultimo giro 10 e Testata 25 portano Pino da 0,12 a 0,66 contro Spazienzio.
- **Contro il Tossico Pino resta 15–25 punti sotto** gli altri due incontri, con qualunque combinazione. Offro io e Rutto colpiscono la A,
  e il Tossico paga in T; le partite lunghe favoriscono il suo veleno.

**Correzioni.**
- **L iniziale 10 → 20**, per il carburante, come la T del Tossico in SB-13.
- **Estasi da Coca Etilene da 3 a 10 + L.** Con la L che i bot hanno in mano (0–5) valeva meno di uno Spintone.
- **L'ultimo giro da 6 a 12 + L.** Le last resort devono stare vicino a Struggle e chiudere (D29), e Pino ci arriva in più di metà delle
  partite.
- **Testata 20 → 25 HIT.**
- **Salute 95 invariata.**

Era la variante più equilibrata e con le partite più corte (`f3`).

**Misure.** [Matrice](sb-14/sb7-giro2-2000.md) ([dati](sb-14/sb7-giro2-2000.json)), bozza [`bozze/giro2.json`](sb-14/bozze/giro2.json),
SHA-256 `c0edafb2e43316efe9b0019550bce87de184850c35cc9a63697fb692f8a1d3d7`; stesse impostazioni; invarianti a zero.

| Incontro | Quota di Pino [IC 95%] | Tre stili euristici | Turni medi | Patte |
|---|---|---|---:|---:|
| contro Spazienzio | 0,578 [0,572–0,584] | 0,682 | 13,6 | 13,8% |
| contro Mara | 0,526 [0,520–0,532] | 0,505 | 13,4 | 15,0% |
| contro Tossico | 0,449 [0,443–0,455] | 0,482 | 14,6 | 16,8% |
| specchio | 0,505 | 0,510 | 15,1 | 28,7% |

### Controllo dei bot, prima di toccare carte (punto 7)

Sei varianti sulla bozza del giro 2 ([tabella](sb-14/varianti-diagnostiche.md#controllo-dei-bot-punto-7-e-giro-2--giro-3)):

| Carta | Prova | Pino contro Spazienzio / Mara / Tossico |
|---|---|---|
| Offro io (PIN-AR4) | ×2 sostituita da Spintone | +8,7 / +8,5 / +9,5 punti |
| Il bancone regge (PIN-AR3) | ×2 sostituita da Spintone | +4,5 / +13,3 / +11,0 |
| Rutto (PIN-AR5) | sostituito da Spintone | +2,8 / +0,2 / +1,8 |
| Cinque minuti e vado (PIN-BO1) | Coccio al suo posto | +0,3 / +0,3 / −0,4: i bot euristici non la giocano |
| Estasi da Coca Etilene (PIN-AR2) | ×2 sostituita da Spintone | **−13,3 / −16,1 / −17,0**: è la carta che regge Pino |
| Nessuna carta: immunità a L | variante di D28 | **0,832 / 0,905 / 0,868** |

**Lettura.**
- Come le parate e le contromosse dei base (SB-12a) e del Tossico (SB-13), la contromossa e la difesa di Pino valgono meno di un colpo
  semplice in mano ai bot. I bot non leggono la mossa dell'avversario e non sanno che la L al bersaglio rende solo contro chi paga in A.
  **Nessuna carta è indebolita o tolta.**
- **Con l'immunità** e i numeri del giro 2 Pino vince l'83–91%: è il rischio di Q10 («GoingBerserk troppo affidabile»), misurato. La
  scelta di D28 resta.

## Il listino sul giro 2, e il motivo del giro 3

`ListinoMeasureTest`, `-Dsim.listinoBase=<bozza> -Dsim.listinoAnchor=7`, gruppi `costo`, `salute` e `tettoavanzati`, tre stili euristici;
688.800 partite. [Testo](sb-14/sb14-listino-giro2-costo+salute+tettoavanzati.md),
[dati](sb-14/sb14-listino-giro2-costo+salute+tettoavanzati.json).

Il contesto di Pino è il suo starter con Spintone e Fasciatura al posto delle àncore: Grab e gli oggetti, cioè l'economia della L, restano
come nello starter.

- **Prezzo della L:** 5 L valgono 13,4 HIT [13,3–13,5] contro l'àncora a 7, cioè 1,28 danni per L.
- **Testata a 25 HIT** fa 20 HIT netti, con i 5 a sé: sta sopra quella linea di circa metà. Una comune deve stare in linea («picco
  condizionato, media in linea», D34, punto 6).
- **Bound:** 2,5, 1,9 e 1,5 HEALTH equivalenti per uso, sotto il tetto di 4.

## Giro 3 — Testata di nuovo 20, salute 100

**Varianti** (1000 partite per cella): Testata 20 da sola porta Pino contro il Tossico a 0,366, fuori dal criterio.
- Con Testata 22: 0,400, al limite.
- Con Testata 20 e L'ultimo giro 14: 0,412.
- Con Testata 20 e salute 100: 0,426, e 0,589 e 0,561 contro gli altri due.

**Correzione: Testata 25 → 20 HIT** (il valore della griglia) **e salute 95 → 100**, verso il 110 della scheda (`h4`). La salute è la leva
che la griglia dà per prima ai personaggi (D34, punto 5), e Pino è «grosso, regge tutto».

**Misure sulla bozza finale.** [Matrice](sb-14/sb7-giro3-2000.md) ([dati](sb-14/sb7-giro3-2000.json), [tempi](sb-14/sb7-giro3-2000.tempi.txt))
di `server/src/test/resources/set-base/bozza.json`, SHA-256 **`36788562…182cd2f27d5`**, con lo stesso contenuto della variante `h4`;
2000 partite per cella, quattro stili, semi 7.000.000–7.001.999, posti alternati.

| Incontro | Quota di Pino [IC 95%] | Turni medi | Mediana (10°–90°) | Patte |
|---|---|---:|---|---:|
| **contro Spazienzio** | **0,591 [0,585–0,597]** | 14,3 | 14 (10–18) | 14,2% |
| **contro Mara** | **0,559 [0,553–0,565]** | 14,2 | 14 (11–17) | 16,2% |
| **contro Tossico** | **0,431 [0,425–0,437]** | 15,1 | 16 (11–18) | 17,6% |
| specchio | 0,503 [0,496–0,510] | 16,1 | 16 (15–18) | 34,8% |
| Spazienzio contro Mara (controllo) | 0,525 [0,520–0,531] | 11,3 | 11 (7–16) | 10,4% |

**Invarianti:** zero violazioni su 320.000 partite e 8.651.998 turni di giocatore.
- Mai senza mosse, mai il limite dei 200 turni.
- Dodici bound su dodici entro il tetto di D33 e D36 contro il manichino: PIN-BO1 3,5 unità, PIN-BO2 4 col danno pesato 4/3, PIN-BO3 2,67.

**Dispersione fra gli stili.** Quota di Pino, con lo stile di Pino prima:

| Lettura | Contro Spazienzio | Contro Mara | Contro Tossico |
|---|---|---|---|
| Quattro stili, 16 coppie (il criterio) | **0,591** | **0,559** | **0,431** |
| Tre stili euristici, 9 coppie | 0,692 | 0,549 | 0,451 |
| Stessi stili sui due lati | aggressivo 0,753 · prudente 0,985 · risorse 0,252 · `com` 0,310 | aggressivo 0,360 · prudente 0,873 · risorse 0,468 · `com` 0,707 | aggressivo 0,437 · prudente 0,656 · risorse 0,273 · `com` 0,450 |
| Pino col `com`, contro tutti gli stili | 0,157 | 0,236 | 0,125 |
| Coppie estreme | 0,006 (`com` contro risorse) e 0,985 (prudente contro prudente) | 0,015 (`com` contro aggressivo) e 0,986 (risorse contro `com`) | 0,006 (`com` contro risorse) e 0,821 (aggressivo contro `com`) |

Per stile, su tutte le sue partite, Pino vince 0,714 con l'aggressivo, 0,679 col prudente, 0,635 con risorse e **0,143 con `com`**.
- La dispersione è più larga di quella degli altri starter: tre stili euristici giocano Pino bene, `com` lo gioca malissimo.
- `com` gioca la bound di L 3,4 volte a partita e Offro io anche contro chi non paga in A. I tre euristici non bevono, ma giocano Estasi e la
  last resort, gratuite.
- Il criterio sulla media dei quattro stili tiene insieme due errori opposti dei bot.

**Durata per stile**, stesso stile sui due lati:

| Incontro | aggressivo | prudente | risorse | `com` |
|---|---:|---:|---:|---:|
| contro Spazienzio | 11,7 | 15,8 | 12,8 | 17,2 |
| contro Mara | 11,1 | 15,5 | 13,7 | 18,8 |
| contro Tossico | 12,9 | 16,7 | 15,5 | 16,4 |
| specchio | 14,4 | 16,3 | 16,2 | 20,3 |

**Mazzi esauriti e last resort**, su tutte le partite di ciascun mazzo:
- Pino 77,0% e 70,2%: il suo mazzo si consuma anche con la bound, che scarta una carta.
- Tossico 51,6% e 44,3%.
- Spazienzio 15,9% e 10,2%, Mara 22,6% e 15,7%: più che in SB-13 (12,9% e 18,4%), perché ora contano anche le partite lunghe contro Pino.

**Risorse a fine partita:**
- A Pino restano 0,2 L se vince e 4,5 se perde.
- La sua A finisce a −20 se vince e a −46 se perde.
- Nessuna carta si rompe con la A sotto zero (R01; verifica chiesta da Q10).

**Carte di Pino**, su tutti gli stili:

| | Carte |
|---|---|
| Più giocate | PIN-BO2 3 HIT (4,04 a partita, 98,9%), Estasi (1,73, 94,3%), Spintone (1,71), L'ultimo giro (1,45, 64,8%), Fasciatura (1,30) |
| Quota se giocata più alta | L'ultimo giro 0,664 (+0,146), Testata 0,592 (+0,074), Estasi 0,553 |
| Quasi mai | Offro io (12,4% delle partite, quasi solo `com`), Rutto (20,0%) |
| Giocate in svantaggio | Offro io (quota se giocata 0,139), Cinque minuti e vado (0,308), Grab (0,391), la basic (0,414) |
| Morte in mano a lungo | Testata 5,9 turni a partita (79% dei turni in mano), Rutto 4,7 (83%), Offro io 3,6 (71%), la basic 2,1 (capacità 2, cinque oggetti) |

**Carte d'archetipo davvero giocate:**
- Estasi nel 94% delle partite, il Bancone nell'80%, Testata nel 68%.
- Rutto, rara a una copia, nel 20%.
- Offro io nel 12%: è il limite dei bot del controllo sopra, e la contromossa rende solo contro Mara.
- La last resort propria è nel 65% delle partite: chiude, non allunga (1,45 a partita, quota se giocata 0,664).

## Listino sulla bozza finale

Stessi gruppi di SB-13 (`costo`, `tipo`, `salute`, `veleno`, `tettostarter`, `tettoavanzati`), base derivata SHA-256 `71ffb307…488600e4`,
1.008.000 partite. [Testo](sb-14/sb14-listino-costo+tipo+salute+veleno+tettostarter+tettoavanzati.md),
[dati](sb-14/sb14-listino-costo+tipo+salute+veleno+tettostarter+tettoavanzati.json).

| Voce | Contesto | Valore misurato [IC 95%] | Riferimento |
|---|---|---|---|
| **5 L** | Pino | **14,5 HIT [14,5–14,6], 1,51 per L** | Testata: 20 HIT − 5 a sé = 15 netti, in linea |
| 5 L | Spazienzio | ≥ 57 HIT: non si paga mai | come in SB-10a |
| Salute iniziale | Pino | 3,83 punti per HEALTH | Spazienzio 2,01, Mara 3,36, Tossico 1,97 |
| V, A, T, CUT, POISON, T al bersaglio | Spazienzio, Mara, Tossico | identici a SB-13 | — |

**Bound, salute equivalente per uso** (D38, al massimo 4; criterio di D33, +10 punti, riportato per confronto):

| Bound | Quota (più una nulla) contro due nulle [IC 95%] | Giocate a partita | +10 punti | Salute equivalente per uso [IC 95%] | ≤ 4 |
|---|---|---:|---|---|---|
| **PIN-BO1 +10 L** | 0,570 [0,552–0,588] | 0,74 | ✓ | **2,5 [1,8–3,1]** | ✓ |
| PIN-BO2 3 HIT | 0,835 [0,823–0,847] | 4,37 | ✗ | 2,0 [1,9–2,1] | ✓ |
| PIN-BO3 2 CUT | 0,720 [0,704–0,735] | 3,75 | ✗ | 1,5 [1,4–1,6] | ✓ |
| sonda 3 HIT | 0,835 [0,823–0,847] | 4,37 | ✗ | 2,0 | ✓ |
| sonda 2 HIT | 0,682 [0,665–0,698] | 3,75 | ✗ | 1,3 | ✓ |

**Lettura:**
- **Tutte e tre le bound stanno sotto 4.**
  - Le due di danno superano il criterio dei +10 punti, come quelle di Mara e del Tossico. Nel contesto di Pino la salute vale molto
    (3,8 punti per HEALTH) e le partite sono lunghe.
  - La bound di L è debole per natura, come prevedeva la scheda: la L cala, e i bot euristici non la giocano.
- **La L di Pino vale 1,5 danni per L a 5 L,** tre volte la T del Tossico (0,39 a 10 T): la L costa un turno per berla e poi cala. Testata
  è in linea. Estasi e L'ultimo giro non hanno costo e non sono prezzabili con una bisezione di costo.

**Cosa misura e cosa no:**
- Misura il prezzo di 5 L contro un'àncora gratuita, nel contesto di Pino coi bot di oggi, che bevono poco.
- Non misura il valore della L al bersaglio (Offro io), né Estasi e L'ultimo giro, che spendono una quantità variabile.
- Il peso di D33 per la L (0,35) dà PIN-BO1 a 3,5 unità contro il manichino. La salute equivalente in partita è 2,5: il peso, qui, non
  sottostima.

## Stato finale contro i criteri

Bozza finale, SHA-256 `36788562…182cd2f27d5`:

| Criterio (SB-13–SB-15) | Obiettivo | Esito | |
|---|---|---|---|
| Matchup contro Spazienzio | 40–60% | 0,591 [0,585–0,597]; 0,692 coi soli euristici; stessi stili 0,25–0,99 | ✓ al margine alto, con la dispersione dichiarata |
| Matchup contro Mara | 40–60% | 0,559 [0,553–0,565]; 0,549 coi soli euristici; stessi stili 0,36–0,87 | ✓, con la dispersione dichiarata |
| Matchup contro Tossico | 40–60% | 0,431 [0,425–0,437]; 0,451 coi soli euristici; stessi stili 0,27–0,66 | ✓, con la dispersione dichiarata |
| Specchio | — | 0,503 | ✓ |
| Carte d'archetipo giocate | davvero giocate | quattro su cinque nel 20–94% delle partite; Offro io nel 12% (bot) | ✓ coi limiti dei bot |
| Durata | confrontata coi base (11,3) e col Tossico (12,8) | 14,2–15,1 contro gli altri; **specchio 16,1** | da giudicare |
| Patte | confrontate coi base (9,5–12,6%) e col Tossico (10,8%) | 14–18% contro gli altri; **specchio 34,8%** | da giudicare |
| Mazzi esauriti | confrontati | **Pino 77,0%**; Tossico 51,6%, base 15,9% e 22,6% | da giudicare |
| Turni senza mosse | zero | zero su 320.000 partite | ✓ |
| Bound entro D33 e D36 | tetto del banco | dodici su dodici | ✓ |
| Bound, salute equivalente per uso | al massimo 4 | 2,5 / 2,0 / 1,5 | ✓ |
| Costi in L | 5 o meno (D33, D34 punto 7) | 5, 5, 5; Estasi e L'ultimo giro gratuite | ✓ |
| Prezzo della L | in linea per le comuni | Testata 15 netti contro 14,5 | ✓ |
| Starter approvati invariati | identici a SB-13 | 96 celle su 96 | ✓ |

**Rischi del piano per Pino:**
- **L che decade:** è il rischio principale, misurato. Senza correzioni Pino vinceva il 10–12%. Con la L iniziale 20 e le due carte che
  spendono tutta la L a 10 e 12 sta nei criteri. Le carte da 5 L però restano morte in mano per il 70–83% dei turni coi bot.
- **GoingBerserk con l'immunità:** troppo affidabile, misurato. Con l'immunità a L Pino vince l'83–91%; D28 la esclude.
- **Carte morte per mancanza di L:** Testata, Offro io e Rutto (sopra); è il prezzo di «spendi subito».

**Partite lunghe e mazzo che si esaurisce.** Pino gioca la bound di danno quattro volte a partita, e ogni bound scarta una carta. Il suo
mazzo arriva in fondo più spesso di quello del Tossico, e poi vive di L'ultimo giro. Lo specchio dura 16 turni con una patta su tre. Coi soli
numeri si accorcia rendendo Pino più forte (salute più bassa e danni più alti), ma allora esce dal criterio contro Spazienzio. È un dato da
far vedere al proprietario, come lo specchio del Tossico in SB-13.

## Codice e bozza

Tutto in `server/src/test`.

| File | Cosa cambia |
|---|---|
| `java/com/gsc/bm/model/cards/base/pino/GoingBerserk.java` (nuovo) | La classe di B1: `@Tunable base` e `selfHit`; memorizza la L dell'autore dopo i costi, infligge `selfHit` a sé se positivo, azzera la L, infligge al bersaglio `base` + L |
| `java/com/gsc/bm/model/cards/base/pino/UltimoGiro.java` (nuovo) | Sottoclasse last resort (`setLastResort(true)`): la bozza lega una carta Java alla sua classe e prende da lì l'essere last resort |
| `resources/set-base/bozza.json` | Personaggio, 15 carte nuove nella bozza (basic, tre bound, last resort, cinque d'archetipo, tre oggetti) e lo starter `starter-pino`; Grab, Spintone e Fasciatura c'erano già. SHA-256 da `1c1d4a62…254bcc1e` (SB-13) a `36788562…182cd2f27d5`. Le carte degli altri starter non cambiano |
| `java/.../sim/SetBaseDraftTest.java` | Tre prove nuove; sei esistenti adeguate alla bozza che cresce (sotto) |
| `java/.../sim/Listino.java` | Contesto di Pino nella base del Set Base, solo se la bozza ha il suo starter; `starter-pino` in `ADVANCED_STARTERS`; prezzo di 5 L e curve di salute di Pino, solo con quel contesto; nelle curve di salute una last resort Java riservata non si clona (non si può rinominare) e nell'albero derivato perde la riserva |

**Senza lo starter di Pino** il listino è quello di prima: un test lo controlla, e la base di SB-10a ha le stesse bisezioni e curve di prima
(la prima versione non lo garantiva: SB-6b ha trovato `ListinoTest` rosso, corretto prima di ogni misura).

**Prove nuove** in `SetBaseDraftTest`:
1. `thePinoStarterFollowsTheGrid`:
   - risorse, capacità, nessuna immunità, nome; basic, bound e last resort propria (`exclusiveTo`);
   - la composizione esatta dello starter (archetipo 9, generiche 6, oggetti 5);
   - nessuna carta a costo A, costi in L entro 5, i tre costi da 5 L nel testo; bound di L entro +10 coi testi;
   - i numeri dei giri coi testi (Estasi 10 + L, L'ultimo giro 12 + L con 5 a sé, Testata 20);
   - lo slot all'inizio della descrizione delle dieci carte di Pino.
2. `thePinoMechanicsWorkOnHandBuiltStates`, su stati costruiti a mano e su una partita vera per la logica speciale:
   - la L che cala (R06) e la A sotto zero (R01);
   - Estasi e L'ultimo giro (danno, L azzerata, danno a sé solo nella last resort);
   - il Rutto che legge la L senza consumarla, Offro io con la A persa a fine turno, il Bancone.
3. `theListinoBaseHasThePinoContextAndItsBoundCurves`: contesto di Pino con le àncore, starter intatto, cinque curve `tettoavanzati`, il
   prezzo della L, ogni bozza derivata per Pino valida; senza lo starter di Pino il contesto non nasce.

**Prove esistenti adeguate, nessuna indebolita.** I controlli sono più larghi, non più deboli:

| Prova | Prima | Ora |
|---|---|---|
| `theDraftLoadsWithTheTwoStartersAndAllTheirCards` | personaggi e mazzi esattamente {Spazienzio, Mara, Tossico} | esattamente {Spazienzio, Mara, Tossico, Pino}; terza bound di Pino (PIN-BO3) fuori dallo starter |
| `theStartersRespectTheFormat` | tre starter | quattro starter, stessi controlli |
| `theDraftPassesTheBenchInvariantsStrictly` | 9 bound, 6 coppie di mazzi | 12 bound, 10 coppie, stessi invarianti stretti |
| `everyPairOfStylesFinishesItsGames` | 6 coppie | 10 coppie |
| `durationsFollowTheR05Reading` | 7 stati | 8, col Bancone («in questo turno», `turns: 0`) |
| `theStartersCarryTheSb12aCorrections` | il Tossico escluso | Tossico e Pino esclusi: hanno le loro prove; la mappa dei due base resta esatta |
| `theListinoBaseHasTheToxicContextAndItsBoundCurves` | cinque curve `tettoavanzati` | le cinque del Tossico, contate sul suo starter |

Gli altri controlli restano com'erano. Nessun atteso è stato cambiato per tornare al verde: ogni numero nuovo viene dal contenuto aggiunto
alla bozza.

**Le prove nuove sanno fallire.** Con la bozza del giro 2 al posto di quella finale le due prove di Pino falliscono con
`expected: <100> but was: <95>` (la salute). Poi ho rimesso la bozza finale e ricontrollato lo SHA-256. Dove una prova riguarda una
meccanica legge i numeri dalla bozza; dove riguarda una correzione dei giri li fissa.

## Documenti di progetto

- **[Griglia](../../design/set-base/griglia.md).**
  - PG-PIN (H e L), PIN-AR2 e LR-PIN col valore vecchio barrato e la nota ⁶;
  - il nome dello starter con (SB-14) e una «Nota di SB-14» sotto gli starter;
  - la sezione [Correzioni di SB-14](../../design/set-base/griglia.md#correzioni-di-sb-14), con giro e motivo, e due letture: una mossa per
    turno, i bot che non bevono.
- **[Scheda di Pino](../../design/set-base/schede-personaggi.md#4-pino-lultimo-giro--avanzato).** Nota di SB-14 sui valori iniziali
  (HEALTH 100, L 20), tabella dei valori iniziali aggiornata, verifica di Q10 (A sotto zero, variante con immunità).
- [Piano](../../set-base-plan.md) e [indice](../README.md): stato di SB-14.

## Cosa non è provato

- **I bot.** Ogni numero dice come giocano questi bot, e con Pino sbagliano in due direzioni opposte.
  - **I tre euristici non bevono:** non giocano la bound di L e prendono poca L. Le carte da 5 L restano morte; Pino vince con Estasi, la
    last resort e la bound di danno.
  - **`com` beve troppo e spreca:** gioca la bound di L 3,4 volte a partita e Offro io anche contro chi non paga in A. Vince il 14%.
  - Un umano che beve un turno e colpisce il turno dopo userebbe Testata molto di più: Pino potrebbe essere **più forte** di quanto
    misurato. Se la prova umana lo trova forte, la prima leva è la L iniziale, poi Estasi.
  - **Nessuno stile nuovo:** gli stili sono codice di produzione, fuori dal perimetro. Uno stile che sappia «bere poi spendere» è una
    proposta per dopo la prova umana.
- **Estasi e L'ultimo giro coi bot.** I bot leggono «HIT 10+x» come 10 più 5 (la stima fissa del «+x»), non come 10 più la L che hanno.
- **Offro io** rende solo contro chi paga in A (Mara; Cesira in SB-17). Contro Spazienzio e il Tossico è una carta sbagliata da giocare: va
  bene per la scheda («una contromossa che si sbaglia»), ma i bot non lo sanno.
- **Il divertimento.** Nessuna partita umana: il simulatore non dice se «bevi, poi spendi» si capisce e diverte.
- **`TestServerContext` non lanciato:** il blocco tocca solo `server/src/test` e i documenti; contesto Spring, CLI e classi di produzione
  non cambiano per opera di questo blocco.

## Verifiche

Eseguite nel checkout, una alla volta, dopo aver controllato che non girassero Maven, Java o verifiche del client di questo repository. Il
checkout contiene il lavoro di SB-6b già committato (formato `sb-6b/1`): la bozza, ancora `sb-6a/1`, si carica com'è.

- `./scripts/build.ps1 -Task Test -Offline`: **verde**, in 107 secondi.
  - Maven 642 test, 0 falliti, 7 saltati (le misure a richiesta).
  - `SetBaseDraftTest` 15 su 15, più le mie tre prove.
  - `ListinoTest`, `ListinoAnchorTest`, `BenchTest`, `PlaygroundTest` e `MultiSetTest` di SB-6b passano.
  - Client 37 su 37.
- `python scripts/check-rules.py`: verde. «Regolamento 1.13 e Set Base 0.1 allineati alle copie client»; 39 carte e 1 token; rarità ammesse
  anche nel caricatore delle bozze; starter conformi a R02 1.12; SQLite integro.
- `TestServerContext`: non lanciato, per il motivo detto sopra.

## Cosa deve giudicare il proprietario

Le correzioni dei giri le ho prese con la delega di D38 (numeri, costi e priorità di Pino):
1. **Salute 100, L iniziale 20, Estasi 10 + L, L'ultimo giro 12 + L; Testata invariata a 20.** Pino passa da 0,12, 0,10 e 0,10 a 0,591,
   0,559 e 0,431, con tutte le bound sotto 4 HEALTH equivalenti per uso e Testata in linea col prezzo misurato della L.
   *Raccomando di approvarle.* Contro Spazienzio Pino è al margine alto (0,585–0,597): se la prova umana lo trova forte, la prima leva è la
   L iniziale, poi Estasi.
2. **Il giro 3 contro il giro 2.** Il giro 2 (Testata 25, salute 95) era più centrato (0,578, 0,526, 0,449) e più corto (13,4–14,6 turni
   contro 14,2–15,1), ma Testata stava sopra il prezzo della L.
   *Raccomando il giro 3*, perché con un umano che beve Testata si gioca molto di più che coi bot.
3. **Il nome dello starter, «Chiude quando dico io»**, quello della bozza esterna già nella griglia. *Raccomando di tenerlo.*
4. **Partite lunghe, specchio con una patta su tre, mazzo esaurito nel 77% delle partite.** Proprietà del personaggio che beve e aspetta,
   o da correggere con un ridisegno (per esempio una bound di danno che non scarti, o L'ultimo giro senza danno a sé) in un blocco
   successivo? *Raccomando di tenerli fino alla prova umana degli avanzati (SB-16),* come lo specchio del Tossico (D43).
5. **Offro io e il Bancone valgono coi bot meno di uno Spintone.** *Raccomando di tenerli per la prova umana,* come le contromosse in SB-12a
   e SB-13.
6. **Le rarità nella bozza (Q5 di SB-6b).** SB-6b propone che il prossimo blocco che tocca la bozza la porti a `sb-6b/1` con le rarità della
   griglia. Non era nel mandato di SB-14 e SB-6b è ancora da giudicare: non l'ho fatto. *Raccomando un passaggio a sé* dopo il giudizio di
   SB-6b, che cambia solo il formato e lascia invariate le partite.

## Cosa serve a SB-15

- **Base stabile:** Spazienzio, Mara e Tossico come approvati; Pino come qui, se approvato. Il giro di Gigi va contro quattro starter: le
  celle senza Gigi devono coincidere con `sb-14/sb7-giro3-2000.json`, coi mazzi nello stesso ordine e Gigi in testa.
- **Scala della salute:** due avanzati su due sono finiti lontano da SB-9 meno 15 (Tossico 80, Pino 100). Per Gigi (100 nella scheda)
  conviene partire da 85, ma misurare subito anche 90–100.
- **Le leve si moltiplicano:** misurare le combinazioni presto, non solo le leve singole.
- **Metodo:**
  - testi allineati ai numeri nelle varianti;
  - salute equivalente per uso col listino (gruppo `tettoavanzati`: aggiungere `starter-gigi` a `Listino.ADVANCED_STARTERS` e il contesto di
    Gigi a `SET_BASE_CONTEXTS`, facendolo nascere solo se la bozza ha il suo starter, anche nelle bisezioni e nelle curve);
  - una carta Java nuova di Gigi (B5) si scrive come qui, in un pacchetto di test sotto `com.gsc.bm.model.cards.base`;
  - una last resort Java riservata perde la riserva nelle curve di salute del listino.
- **Misure in una copia:** se il caricatore è in modifica, misurare in una copia di HEAD. Una risorsa copiata con la data vecchia non viene
  ricopiata da Maven: aggiornarne la data.

## Cosa serve alla prova umana degli avanzati (SB-16)

1. SB-8 con la bozza di questo blocco.
2. Pino giocato da un umano: «bevi un turno, colpisci il turno dopo». È il gioco che i bot non fanno: se un umano lo fa bene, Pino sale, e
   Testata, Offro io e Rutto vanno guardate per prime.
3. Lo specchio di Pino: durata, patte, e se L'ultimo giro lo chiude.
4. Leggibilità: la L che cala, la A sotto zero, Estasi che azzera la L. Annotare per SB-31.
