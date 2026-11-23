# Botte Micidiali — Mini-espansione di prova

Versione **0.1 — di prova**. Documento del set `mini`, con le schede normative delle sue carte (regolamento, R00 e R07).

Questo documento è generato da `tools/set-catalog/set_catalog.py` dal file del set `server/src/test/resources/sb-6b/mini.json` (versione 0.1 del file): non si modifica a mano, si cambia il file del set e si rigenera (decisione D175 del piano Set Base). Il regolamento governa il sistema, le schede governano le carte: una scheda deroga a una regola solo se lo dice esplicitamente. La scheda normativa di ogni carta è il suo **testo completo**; il testo breve stampato sulla carta è nell'allegato ed è descrittivo: in caso di dubbio prevale la scheda. Ruoli, guadagni e danno nominale sono descrittivi (R07a).

Nelle schede H, A, V, T e L sono le risorse (HEALTH, ALERTNESS, VIOLENCE, TOXICITY, ALCOHOL) e HIT, CUT e POISON i tipi di danno; sulle carte stampate e nel client sono simboli. Ogni scheda indica in testa nome, tipologia e sottotipo, rarità, costo e priorità, poi l'identificatore stabile della classe e, se c'è, lo slot della carta stampata.

## S1 — Contenuto e starter

Il set comprende **5 carte: 0 personaggio, 4 azione e 1 oggetto**. Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte alla preparazione secondo R01a.

Rarità (R07): 2 COMMON, 1 UNCOMMON, 1 RARE, 1 senza rarità.

Il set richiede il set `base`: le sue carte possono comparire in mazzi con quelle dei set richiesti, e le carte legate di questo set si aggiungono a quelle che il personaggio ha già.

Il set non ha starter. I mazzi del file, che possono mescolare carte di più set, sono:

- `mini.spazienzio`, di SPAZIENZIO DE LA UCCISO: base ADOPERIAMOTI, legate SVEGLIAMOCI - MA TU NO e Sbuffata, ultima risorsa Addosso!!!.
- `mini.tossico`, di Celestina Bucatina: base Desiderio Incontrollabile, legate Tagliare la Dose e Fondo del Posacenere, ultima risorsa Addosso!!!.

**`mini.spazienzio`**, SPAZIENZIO DE LA UCCISO: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| SPEDIAMOTI DUNQUE IN O-AHIO | base | `bruiser.ExtremelyViolentBlow` | 2 |
| PAZIENZA: FINITA | base | `bruiser.Glare` | 2 |
| NON GIOCARE COL COLTELLO NO | base | `bruiser.MadeOfStone` | 2 |
| GARGANTUESCO IMPATTO SUL TU | base | `bruiser.SuperImpact` | 2 |
| FAI BASTA | base | `bruiser.YouStop` | 2 |
| Negroni Trovato per Terra | base | `com.items.CocktailOnTheGround` | 2 |
| Calcio al bidone | mini | `mini.CalcioAlBidone` | 2 |
| Rintocco di campana | mini | `mini.RintoccoDiCampana` | 2 |
| Spallucce | mini | `mini.Spallucce` | 2 |
| Lattina schiacciata | mini | `mini.items.LattinaSchiacciata` | 2 |

**`mini.tossico`**, Celestina Bucatina: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| Afferrare | base | `com.Grab` | 2 |
| Furto con Destrezza | base | `com.Steal` | 2 |
| Mescolone Micidiale | base | `com.items.MarvelousCocktail` | 1 |
| Riflessi Aumentati dalla Speed | base | `junkie.AmphetamineReflexes` | 2 |
| Tossicone Scatarrante | base | `junkie.Cough` | 2 |
| Fare l'Inventario | base | `junkie.MethDrivenRage` | 2 |
| Metabolismo Corrotto | base | `junkie.PervertedMetabolism` | 2 |
| Trascinare nel Tunnel | base | `junkie.ToxicBloodDrain` | 1 |
| Rintocco di campana | mini | `mini.RintoccoDiCampana` | 2 |
| Spallucce | mini | `mini.Spallucce` | 2 |
| Lattina schiacciata | mini | `mini.items.LattinaSchiacciata` | 2 |

## S2 — Carte personaggio

Il set non ha carte personaggio.

## S3 — Schede delle carte

Una scheda per carta, raggruppate per personaggio (base, legate, ultima risorsa, poi le altre carte del personaggio); dopo, le azioni generiche, gli oggetti e i token.

### SPAZIENZIO DE LA UCCISO (personaggio del set `base`)

#### Sbuffata — Azione, Legata al personaggio · COMMON · Costo — · Priorità 1

`mini.spazienzio.bound.Sbuffata`

Azione legata a SPAZIENZIO DE LA UCCISO (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca su di te.

Quando la carta si risolve: guadagni 4 V.

### Azioni generiche

#### Calcio al bidone — Azione, Regolare · RARE · Costo 10 V · Priorità 1

`mini.CalcioAlBidone`

Azione regolare (regolamento, R01a). Costo: 10 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 12 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regole del playground, RP-6).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 12 HIT.

#### Rintocco di campana — Azione, Regolare · UNCOMMON · Costo 5 A · Priorità 0

`mini.RintoccoDiCampana`

Solo prova di SB-6b. HIT pari a 4 più 3 per oggetto vicino al bersaglio.

#### Spallucce — Azione, Regolare · — · Costo — · Priorità 2

`mini.Spallucce`

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca su di te.

Quando la carta si risolve: guadagni 6 A.

### Oggetti

#### Lattina schiacciata — Oggetto · COMMON · Costo — · Priorità —

`mini.items.LattinaSchiacciata`

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: guadagni 8 A.

## S4 — Ruoli, guadagni e danno nominale

Campi descrittivi definiti in R07a, generati dagli stessi dati delle schede; in caso di dubbio prevale la scheda. x indica una quantità variabile.

| Carta | Identificatore | Ruolo | Guadagni a sé | Danno nominale | Importo nominale |
|---|---|---|---|---|---|
| Sbuffata | `mini.spazienzio.bound.Sbuffata` | RESOURCES | +4 V | — | — |
| Calcio al bidone | `mini.CalcioAlBidone` | DAMAGE | — | HIT | HIT 12 |
| Rintocco di campana | `mini.RintoccoDiCampana` | DAMAGE | — | HIT | HIT 4+x |
| Spallucce | `mini.Spallucce` | RESOURCES | +6 A | — | — |
| Lattina schiacciata | `mini.items.LattinaSchiacciata` | RESOURCES | +8 A | — | — |

## Revisioni

- **0.1 — SB-26, prova del formato:** generata dal file del set `server/src/test/resources/sb-6b/mini.json` (SHA-256 `6491f3b9636dad2b9ee3b9c5d0af655966e79370e046d6e69b50687a2c097529`). Testo breve, guadagni, danno nominale e testo completo dal generatore di SB-25. Il generatore dei testi di SB-25 non conosce `mini.RintoccoDiCampana`: per queste carte testo breve, guadagni, danno nominale e scheda sono il testo del file.
