# SB-17 — Fase B5e: quattro varianti di Sergio (rapporto)

**16 novembre 2026. Blocco esplorativo di [D120](../../set-base-decisioni.md#decisioni-del-proprietario). Controllo: il giro 2 della
[B4](sb-17-b4-report.md) (Lo rivendo +8 HEALTH). `bozza.json` resta allo stato della B4; le varianti sono copie in
[sb-17/b5e/](sb-17/b5e/).**

## 1. Le varianti e le scelte di carte (scritte prima di misurare)

Tutte: basic e Fare il vago bound come nella B4 salvo dove detto, Battutina, mazzo di prova di 20 carte, al più 2 copie. Il mazzo
della B4 è: Oh guarda là ×2, Ricatto ×2, Lo sapevo ×2, Conto salato ×2, Lo sanno tutti ×2, Malelingue, Stordiamoti, Sgambetto,
Tartaruga ×2, Spintone, Santino ×2, Espresso, Acqua in faccia.

Carte da togliere (V2, V3): le meno giocate al giro 2 della B4 (giocate per partita): Lo sapevo 0,07, Ricatto 0,10, Sgambetto 0,20.
Si toglie **una copia di ciascuna**, così le due contromosse restano nel mazzo (una lettura a testa) e Sergio non perde la sua
identità; Sgambetto è l'unica generica fra le tre.

| Variante | Basic | Cambi al mazzo della B4 | Perché |
|---|---|---|---|
| **V1** | Lo rivendo: +6 A e +3 HEALTH (6 unità: +3 A valgono 1,5 unità a 0,5 l'una nel banco di D119 e +3 HEALTH 3; resta sul prezzo di D118) | nessuno | domanda del proprietario: A e H insieme; isola l'effetto del ricavato |
| **V2** | Lo rivendo +8 HEALTH (B4) | −Lo sapevo, −Ricatto, −Sgambetto; **+Sorpasso in curva ×2** (MAR-AR3, F0, −8 A al bersaglio, 3 CUT, in anticipo +4 A a sé), **+Slalom ×1** (MAR-AR5, F0, annuncia carte di Mara: in un mazzo di Sergio il ripiego fisso è +5 A) | A senza costo e con precedenza 2, dalla griglia, senza carte nuove; Sorpasso dà A e toglie A al bersaglio (stessa famiglia di Oh, guarda là); Slalom è A a vuoto, pura generatrice. Non si prendono le parate Tra due paraurti / Sotto il cofano: danno A solo a rimborso del costo |
| **V3** | Lo rivendo +8 HEALTH (B4) | −Lo sapevo, −Ricatto, −Sgambetto; **+Grab ×2** (GEN-01, F0, consuma un proprio oggetto con il suo effetto), **+Steal ×1** (GEN-02, 10 A, ruba un oggetto lontano: rifornisce Grab e Lo rivendo); oggetti Espresso ×2 e Santino ×1 | Grab è la carta indicata; Steal dà più oggetti da usare o vendere. Espresso ×2 (+15 A l'uno) e Santino ×1 come D118 prima dell'ultima modifica: più effetti da usare. Stessi 3 oggetti della B4 |
| **V4** | Lo metto in conto: +5 A, poi consuma (come la B3) | Lo rivendo carta regolare ×2 (UNCOMMON, pr. 1, bersaglio un proprio oggetto, +8 HEALTH, niente effetto dell'oggetto); −Lo sapevo, −Sgambetto; Espresso ×2 e Santino ×1 | slot per le due Lo rivendo da una carta di poco gioco e dalla meno giocata fra le generiche; Ricatto ×2 resta, è il cuore di Sergio. Richiede il caricatore: `vendi` oggi è ammesso solo in una basic |

Le carte di Sergio «in collezione» non entrano: Mi informo è una bound, che il mazzo di prova non può contenere.

Nota sul lanciatore: `-Draft` vuole il percorso del file **senza** il prefisso `file:` (il caricatore lo rifiuta); usati percorsi
assoluti. Nessun'altra deviazione di metodo.

## 2. Esito

**Raccomandazione: V4 (Lo metto in conto basic, Lo rivendo carta regolare ×2).** È l'unica variante che porta Sergio dentro D95
quasi ovunque: un solo incontro fuori (Celestina, quota 3,44 punti sotto la soglia), contro 3–4 delle altre e 4 del controllo.
Le patte restano basse in tutti gli incontri (≤ 5,4%, specchio 2,0%), le partite non si allungano. V1 sposta poco: il ricavato non è
la leva. V2 e V3 salgono ma restano a 4 incontri fuori.

## 3. Quote / patte / turni (soli euristici, 259.200 partite per giro, criteri D95 come nella B4)

Controllo = giro 2 della B4. In grassetto i valori fuori D95. Un solo giro per variante, 300 semi per cella.

| Incontro | Controllo B4 | V1 | V2 | V3 | V4 |
|---|---|---|---|---|---|
| Sergio–Sergio | 48,25% / **18,92%** / 18,30 | 47,50% / 4,65% / 15,68 | 49,16% / **10,47%** / 16,85 | 49,99% / 9,07% / 16,14 | 47,54% / 1,99% / 13,66 |
| Sergio–Spazienzio | 47,10% / 7,48% / 11,86 | 46,90% / 3,96% / 11,17 | 50,67% / 5,01% / 10,97 | 50,35% / 5,18% / 11,04 | 59,24% / 2,83% / 10,57 |
| Sergio–Mara | **27,04%** / 8,68% / **13,15** | **34,80%** / 3,91% / **12,10** | 44,07% / 5,86% / **12,27** | 37,11% / 6,14% / **12,31** | 48,47% / 3,00% / 11,40 |
| Sergio–Celestina | **15,41%** / 4,35% / **12,15** | **19,57%** / 3,69% / 11,62 | **26,71%** / 3,68% / 11,57 | **24,81%** / 4,59% / 11,57 | **31,56%** / 5,36% / 11,32 |
| Sergio–Piera | **17,47%** / 5,87% / **12,76** | **24,23%** / 3,59% / 11,92 | **31,59%** / 2,23% / 11,93 | **29,87%** / 4,25% / 12,01 | 38,44% / 3,51% / 11,45 |
| Sergio–Beppe | **33,36%** / 4,54% / 10,36 | 35,11% / 1,98% / 9,81 | 43,52% / 2,67% / 9,46 | 40,26% / 3,49% / 9,63 | 45,92% / 2,10% / 9,23 |
| **Incontri fuori D95** | 5 (4 dal basso, specchio per patte) | 3 | 4 (specchio per patte) | 4 | **1** |

Fuori D95, dettaglio (punti oltre la soglia): V1 Mara quota 0,20 e durata 0,10, Celestina 15,43, Piera 10,77; V2 specchio patte 0,47,
Mara durata 0,27, Celestina 8,29, Piera 3,41; V3 Mara durata 0,31, Celestina 10,19, Piera 5,13; V4 Celestina 3,44. Violazioni 0,
bound oltre il tetto 0 in tutti i giri. Esiti completi: [V1](sb-17/b5e/round-v1.md), [V2](sb-17/b5e/round-v2.md),
[V3](sb-17/b5e/round-v3.md), [V4](sb-17/b5e/round-v4.md).

Spazienzio sale a 59,2% in V4 (soglia 69,7%): sotto.

## 4. Letture (non criteri)

| Lettura | Controllo B4 | V1 | V2 | V3 | V4 |
|---|---|---|---|---|---|
| Mazzo esaurito | 43,23% | 32,98% | 38,78% | 36,29% | **27,48%** |
| Fare il vago: partite / giocate per partita | 46,48% / 3,82 | 44,96% / 3,74 | 40,89% / 3,66 | 43,46% / 3,71 | 40,35% / 3,34 |
| Fare il vago giocata contro un colpo mostrato | 16,9% | 17,1% | 14,9% | 15,3% | 15,8% |
| Battutina: partite / giocate per partita | 61,41% / 3,47 | 58,64% / 2,05 | 50,52% / 1,71 | 58,02% / 2,53 | 57,03% / 1,68 |
| A spesa a partita (lato di Sergio) | 33,10 | 38,82 | 35,13 | 35,64 | 40,14 |
| Last Resort: Banzai!!! (partite) | 24,91% | 13,80% | 18,61% | 15,87% | 8,30% |
| Lo rivendo (partite / giocate) | 56,72% / 1,14 | 55,40% / 0,94 | 43,47% / 0,77 | 42,69% / 0,72 | 19,53% / 0,22 (regolare) |
| Lo metto in conto (partite / giocate) | — | — | — | — | 52,47% / 0,64 (basic) |
| Oggetti venduti: Santino / Espresso | 133.495 / 60.138 | 115.219 / 44.562 | 92.869 / 37.260 | 49.923 / 72.481 | 22.649 / 13.952 |
| Carte nuove giocate | — | — | Sorpasso in curva 56,99% / 0,91; Slalom 27,65% / 0,28 | Grab 22,06% / 0,24; Steal quasi mai (731 giocate in tutto il giro, sotto la soglia della tabella) | — |
| Ricerche di Oh, guarda là fallite | 1,29% | 7,64% | 32,22% | 3,64% | 7,26% |

Oggetti consumati: il giro non conta i consumi; si leggono dalle giocate di Grab (V3, 0,24 a partita) e di Lo metto in conto (V4,
0,64 a partita, una per ogni giocata).

Letture:

- **La A è la leva, non il ricavato.** V4 e V1 danno A subito (+5 e +6 per giocata): le giocate di Battutina scendono da 3,5 a
  1,7–2,1 e il mazzo si esaurisce meno (da 43% a 27–33%). V1 sta a metà strada: la A per giocata è quasi quella di Lo metto in
  conto, ma resta la basic che non consuma l'oggetto e non lo usa.
- **V2:** Sorpasso in curva si gioca in quasi sei partite su dieci; Slalom (A a vuoto) in poco più di una su quattro. Le ricerche di
  Oh, guarda là falliscono il 32% (dall'1% del controllo): non ne ho verificata la causa; il mazzo ha meno copie delle altre carte
  di Sergio, ma Lo sanno tutti e Conto salato non sono state toccate. Lettura da indagare, non provata.
- **V3:** Grab si gioca in una partita su cinque; Steal quasi mai (731 giocate in tutto il giro). Con Espresso ×2 si vende più
  Espresso (72.481) che Santino (49.923), come vuole la regola del meno prezioso. Il mazzo esaurito scende di 7 punti, meno che in V1
  e V4.
- **V4:** Lo rivendo da carta regolare si gioca in una partita su cinque, quindi il ricavato conta poco; la basic dà A ogni volta
  che c'è un oggetto. Il Banzai!!! cala all'8% e le patte quasi spariscono: Sergio arriva meno spesso a mazzo vuoto.

## 5. Codice toccato (solo per V4)

Il caricatore rifiutava `vendi` in una regolare. Ammesso con deroga del playground (sim): in una carta ACTION non last resort, con
`targets` solo `NEAR_ITEM`, una sola volta, esclusivo con `consume`; il resto del controllo (self, un solo passo, seHai) è
invariato. [`DataCards.java`](../../../server/src/main/java/com/gsc/bm/sim/DataCards.java) è l'unico file di codice; un test
(`Sb17CardsTest.theLoaderRefusesASaleOutOfPlace`: la regolare con NEAR_ITEM carica; con SELF e come last resort no). Nessun
cambio ai bot: BotView offre la mossa di una regolare col suo oggetto come per Grab; il giro mostra che i bot la giocano (0,22 a
partita). **Passo 0** prima e dopo: 8.640 partite, tutti i file identici tranne `seconds.txt`.

Il resto non è toccato: regolamento, `docs/sets/`, catalogo, client, api, griglia, regole-playground, `bozza.json`.

## 6. Verifiche

`git diff --check`, `check-links.py` (381 file, 0 rotti), `check-rules.py`: verdi. `-Task Test -Offline`: 894 test, 0 falliti,
21 saltati, client 37/37, con `bozza.json` invariata. Passo 0 prima e dopo la modifica del caricatore: identico.

## 7. Budget

Orologio di muro: giri 105,9 + 111,7 + 104,0 + 102,9 = 424,5 s; fattibilità 4 × circa 8 s (3 prima del codice, 1 dopo);
totale circa 457 s su 600. Fuori budget: passo 0 (base 10,3 s, nuovo 22,8 s) e verifiche.

## 8. Domande al proprietario

1. **Quale variante** passa alla fase con le verifiche complete e la tua prova? La regia raccomanda **V4**: una Lo rivendo da
   regolare (+8 HEALTH) e Lo metto in conto di nuovo basic. Per portare anche Celestina dentro D95 servirebbe una riserva
   (per esempio +2 A sulla basic) nella fase successiva.
2. **Lo rivendo come carta regolare** richiede una deroga a D118 (la vendita non è più della basic) e la modifica al caricatore,
   oggi solo sim. Va portata nel regolamento/regole-playground e nel client (la carta propone già il bersaglio oggetto)? O si
   preferisce V1/V2, che non toccano il caricatore?
3. **Fare il vago** resta una bound di difesa leggera in tutte le varianti: si gioca 3,3–3,8 volte a partita, una su sei contro
   un colpo mostrato. Si vuole comunque la correzione dei bot (D119 (2)) o si lascia com'è?
