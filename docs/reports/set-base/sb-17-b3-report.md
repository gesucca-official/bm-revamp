# SB-17 — Fase B3: Lo rivendo (rapporto)

**16 novembre 2026. Esito: Lo rivendo funziona in bozza, con la scelta dell'oggetto nel motore e nei bot (D114, D115); verifiche
verdi; il giro corto esce dalla soglia D95 anche con la riserva R1. STOP per il proprietario.** Al giro finale (R1: +5 HEALTH con
l'oggetto) Sergio è **sopra** contro Spazienzio (74,9%, soglia 68,3%) e Mara (69,2%); dentro negli altri quattro incontri, specchio
compreso. Una diagnosi di fattibilità indica che il salto rispetto alla B2 viene soprattutto dai ritocchi del mazzo di prova (§ 3
della proposta A3), non dalla bound (§ 5).

Prima chiusura, alle 13: STOP prima del codice (la scelta dell'umano chiedeva validatore e client). Il proprietario ha scelto
«A, client dopo» ([D115](../../set-base-decisioni.md#decisioni-del-proprietario), commit `7b1dd5e`): scelta nel motore ora, campo
facoltativo, il più vecchio se la mossa non lo dice; il passo del client dopo.

## Stato

- Documenti: [regole del playground](../../design/set-base/regole-playground.md#9-vendere-un-oggetto-12-sb-17) **1.2** (RP-25, RP-26 e
  la regola dei bot nella § 6); in [griglia](../../design/set-base/griglia.md) la deroga di SB-17 al principio delle bound, CES-BO3
  e la nota ⁶; `bozza.json` con Lo rivendo NC, Frecciatina fuori, `prova-sergio` come la § 3 della proposta (93 carte).
- Codice: `DataCards` (passo `vendi`, rifiuti del caricatore), `PrintedEffects` (passo `SELL` e segno di ramo), `TurnForecast` e
  `ViewTable` (la vendita e il ramo dell'esito), `BotView` (la scelta dell'oggetto, una regola per tutti i bot) e `StyleSupport`
  (valore degli oggetti, guadagni del ramo nel piano). Più i contatori di Lo rivendo in `Sb17MeasureTest`, per le letture.
- Giro: due giri da 259.200 partite, il secondo con R1. Budget di orologio **260,5 s su 500**.
- Nessun push. Fuori perimetro non toccati: regolamento, `docs/sets/`, catalogo, client, `api`.

## 1. La lettura di R03 (RP-25, RP-26)

Lo rivendo bersaglia **sé**; l'oggetto è un **campo facoltativo della mossa** (`choices.TARGET_ITEM`), non un bersaglio: alla
giocata non si controlla e la carta si gioca anche senza oggetti. Alla risoluzione, dopo lo scarto della bound: se l'oggetto scelto
è ancora fra i propri esce dal campo **senza il suo effetto** (registro «Sold Item X») e vale il ramo con l'oggetto; se manca, o non
ci sono oggetti, il ramo senza oggetti (+2 HEALTH); se la mossa non dice la scelta, il più vecchio. Il caricatore accetta `vendi`
solo in `self`, una volta, con `seHai`/`seNo` di soli `gain`, `lose`, `say`, in una carta non oggetto con bersaglio solo `SELF`, mai
con `consume`, mai dentro `anticipo` o `gettone`.

L'umano oggi non manda il campo (il validatore `api` lo rifiuta su una carta che bersaglia sé, RP-26): **vende il più vecchio** fino
al passo del client (D115 (2)). I bot scelgono: il proprio oggetto **meno prezioso** per `StyleSupport.itemWorth` (guadagni pesati
come il banco delle bound, D33/D36: HEALTH 1, V 0,75, A 0,5, L 0,35, T 0,15; equipaggiamento o svuota-T 3; immunità 0,5), il più
vecchio a pari valore. Santino 0,5, Peroni 3,5, Espresso 7,5: **mai un Espresso se c'è un Santino** (test e mutazione).

## 2. Verifiche

| Verifica | Esito |
|---|---|
| Passo 0 sulla 1.6b (`b2/step0.ps1`, 8.640 partite, prima di cambiare la bozza) | **identico** alla base della B2: `arm.txt`, osservazioni, `draft.json`; `matrix.json` e `matrix.md` diversi solo per il percorso della bozza nell'intestazione |
| `./scripts/build.ps1 -Task Test -Offline` | verde, 892 test (21 saltati), 37 test del client; rilanciata dopo R1, verde |
| Identità viva 1.13 (480.000 partite, `%TEMP%/bm-sb16g2b2-live`) | **identica byte per byte** alle impronte della B2 (JSON 266.869 B `ca131721…`, Markdown 26.112 B `16d3bde4…`) |
| `-Task TestServerContext -Offline` e `verify-match-manifests.py` | verdi (1.010 test, 21 saltati; manifest PASS), rilanciati sulla bozza finale ([impronte](sb-17/b3/identity.json)) |
| Fedeltà `TurnForecastFidelityTest`, `ViewTableFidelityTest` | **100%** su tutti i bracci; sergio sulla bozza finale: 6.282/6.282 turni; Lo rivendo nel campione 234 volte con l'oggetto e 168 senza (prima di R1: 246 e 172) |
| Mutazioni ([script](sb-17/b3/mutations.py), [esiti](sb-17/b3/mutations.json)) | **8/8 uccise** da asserzioni: rami scambiati, nessuna vendita senza scelta, ripiego sul più vecchio con l'oggetto sparito, bot sull'oggetto più prezioso, previsione e tavolo coi due rami, caricatore con bersagli diversi da SELF e dentro `anticipo` |
| `genera-bozza-di-riferimento.py --scrivi`, poi `--verifica` | allineata (rigenerata dopo R1) |
| `git diff --check`, `check-links.py`, `check-rules.py` | verdi |

**Test nuovi** (`Sb17CardsTest`, 9): oggetto scelto venduto senza effetto (niente immunità del Santino, niente A dell'Espresso),
il più vecchio senza scelta, +2 senza oggetti, +2 con l'oggetto scelto assente, +2 con l'oggetto distrutto prima nello stesso turno
da «Smontiamo tutto» (priorità 1), effetti stampati, scelta dei bot, previsione dei due rami, 11 rifiuti del caricatore.

**Attesi cambiati.** Nessun atteso preesistente: `SetBaseDraftTest` cambia solo un commento; `Sb17.CARDS` (il campione delle carte
di Sergio) passa da Frecciatina a Lo rivendo (D114); le fedeltà contano in più i due rami di Lo rivendo e li esigono nel campione.
Con R1 cambiano i +7 dei test nuovi in +5 (`Sb17CardsTest`: due esiti, l'effetto stampato, la previsione).

## 3. Giro

Lanciatore e semi della B2 ([run.ps1](sb-17/run.ps1), `-OutputRoot %TEMP%\bm-sb17-b3\run`): regole `d50`, 12 stili letali, 144 celle
per incontro, 300 semi, 259.200 partite per giro. Quote di Sergio sulle decisive, soli euristici (D93); invarianti 0 e bound oltre il
tetto 0 in entrambi i giri. In colonna B2 il giro 2 della B2, cioè lo stato di partenza (D112).

| Incontro | B2, giro 2 (partenza) | Giro 1 (D114: +7) | **Giro 2 (+R1: +5)** | D95 al giro 2 |
|---|---|---|---|---|
| Sergio–Sergio | 47,1% / 3,3% / 11,2 | 47,8% / 8,1% / 11,9 | 46,4% / 5,2% / 11,3 | dentro |
| Sergio–Spazienzio | 68,3% / 2,0% / 9,3 | **76,9%** / 2,3% / 9,3 | **74,9%** / 2,5% / 9,2 | **quota +9,9** (soglia 68,3%) |
| Sergio–Mara | 62,8% / 3,9% / 10,4 | **72,8%** / 4,6% / 10,5 | **69,2%** / 3,8% / 10,3 | **quota +4,2** |
| Sergio–Celestina | 38,3% / 6,4% / 11,1 | 46,2% / 8,6% / 11,1 | 45,3% / 7,6% / 11,0 | dentro |
| Sergio–Piera | 49,3% / 5,9% / 10,3 | 58,9% / 6,5% / 10,5 | 55,2% / 5,5% / 10,3 | dentro |
| Sergio–Beppe | 57,9% / 2,8% / 8,3 | **66,7%** / 3,3% / 8,2 | 64,7% / 2,3% / 8,1 | dentro |

Quota / patte / turni medi. Dettagli: [giro 1](sb-17/b3/round-1.md), [giro 2](sb-17/b3/round-2.md). Patte entro il 10% e durata entro
12 turni in ogni incontro di entrambi i giri.

**Riserva.** Dopo il giro 1 tre incontri oltre il 65% (Spazienzio oltre il 68,3%): **R1**, Lo rivendo con l'oggetto +7 → +5 HEALTH,
ramo senza invariato (bozza, griglia, RP-25 e test). Dopo il giro 2 Spazienzio e Mara restano fuori: la riserva era una sola.
**Scostamento dichiarato e STOP**, come scritto nella proposta.

## 4. Letture (non criteri)

| Lettura | B2, giro 2 | Giro 1 | Giro 2 (+R1) |
|---|---|---|---|
| Partite con Lo rivendo; giocate per partita | — | 35,4%; 0,53 | 24,9%; 0,34 |
| Quota del ramo con l'oggetto | — | 96,6% | 93,6% |
| Oggetti venduti: Santino / Peroni / Espresso | — | 56,5% / 29,6% / 13,9% | 55,2% / 31,3% / 13,5% |
| Lo metto in conto: partite; giocate per partita | 75,1%; 1,07 | 77,2%; 1,18 | 78,0%; 1,23 |
| Battutina: giocate per partita | 2,29 | 1,76 | 1,73 |
| Mazzo esaurito | 6,0% | 19,6% | 14,8% |

L'Espresso si vende solo quando è l'unico oggetto o accanto all'altro Espresso: la regola «mai un Espresso se c'è un Santino» vale.
Lo rivendo si gioca poco e quasi sempre con un oggetto; con R1 il bot la sceglie ancora meno.

## 5. Da dove viene il salto (diagnosi, 4 semi per cella)

Lo rivendo cura in media meno di 2 HEALTH a partita: non spiega 10–20 punti. Due fattibilità di diagnosi, dentro la quota di
fattibilità del budget (colonna «tutti gli stili», circa 576 partite per incontro; solo indicative):

| Incontro | Bozza di HEAD (Frecciatina, mazzo B2) | Lo rivendo (+5), mazzo B2 | Bozza B3 (+7, mazzo § 3) |
|---|---|---|---|
| Sergio–Spazienzio | 57,7% | 66,1% | 71,2% |
| Sergio–Mara | 40,1% | 43,8% | 68,2% |
| Sergio–Celestina | 50,3% | 51,3% | 65,1% |
| Sergio–Piera | 60,0% | 59,2% | 72,7% |
| Sergio–Beppe | 62,1% | 64,2% | 86,3% |

([HEAD](sb-17/b3/diag-head.md), [solo la bound](sb-17/b3/diag-bound-only.md), [bozza B3](sb-17/b3/feasibility.md).) Con il mazzo
della B2 la bound sposta poco; il salto arriva coi ritocchi del mazzo (Santino 1 → 2, Peroni 1, Acqua in faccia e una Tartaruga
fuori). Una lettura possibile, non misurata: con 5 oggetti su 20 invece di 3, Lo metto in conto (basic, consuma un proprio oggetto)
è più spesso giocabile e Sergio perde meno turni. Il mazzo esaurito triplicato va nella stessa direzione.

## 6. Domande al proprietario

1. Quale stato tenere in bozza? (a) Questo (R1, Spazienzio e Mara sopra, scostamento dichiarato); (b) Lo rivendo con R1 ma il mazzo
   della B2 (3 oggetti), che la diagnosi indica vicino alla partenza, da misurare con un giro; (c) una via di mezzo sul mazzo (per
   esempio Acqua in faccia di nuovo al posto della Peroni), da misurare con un giro.
2. La prova finale del proprietario si fa su questo stato, come previsto, o dopo la scelta della domanda 1?

## 7. Lo STOP 1 prima del codice

Alle 13 la B3 si era fermata prima di documenti e codice (commit `ed40100`, il testo intero è in quel commit): nel motore c'erano
tre meccanismi di scelta (`choices.TARGET_ITEM`, `searchChoice`, `DISCARD_ONE`), ma per l'umano ogni via passava dal validatore del
comando (`api/ws/MoveCommandValidator.java`, che rifiuta `TARGET_ITEM` su una carta senza bersaglio d'oggetto) e dal client, fuori
dal perimetro. Proposte: A (scelta nel motore e nei bot ora, l'umano vende il più vecchio fino al passo del client), B (validatore e
client dentro la B3), C (bersaglio `NEAR_ITEM`, contro R03). Il proprietario ha scelto A, col client dopo: D115. Il link di D115
punta ora a questa sezione, perché il rapporto dello STOP è stato riscritto in questo.

## 8. Giro sul mazzo intermedio (D116)

**16 novembre 2026 (esecutore). Esito: il mazzo intermedio (giro 1) lascia fuori D95 Spazienzio (72,9%) e Mara (67,2%); il mazzo
della B2 con Lo rivendo R1 (giro 2) ne lascia fuori uno solo, Spazienzio (69,7%). Resta in bozza il giro 2. Scostamento dichiarato:
Spazienzio 69,7% contro la soglia del 68,3% (+1,4 punti). STOP per il proprietario, poi la prova finale (D116 (2)).**

Solo dati: `bozza.json` (`prova-sergio`), bozza di riferimento rigenerata, questa sezione e il piano. Niente codice, nessun atteso di
test cambiato (nessun test conta il mazzo di `prova-sergio`; il server resta verde, 892 test, 21 saltati). Lanciatore e semi della B2
([run.ps1](sb-17/run.ps1), `-OutputRoot %TEMP%\bm-sb17-b3b\run`), regole `d50`, 259.200 partite per giro, invarianti 0 e bound oltre il
tetto 0 in entrambi. Lo rivendo con R1 (+5 con l'oggetto, +2 senza). Dettagli: [giro 1](sb-17/b3b/round-1.md), [giro 2](sb-17/b3b/round-2.md).

- **Giro 1:** Santino ×2, Espresso ×2, Acqua in faccia ×1, Tartaruga ×1, niente Peroni (4 oggetti). Orologio 66,9 s (70,4 di parete).
- **Giro 2:** Santino ×1, Espresso ×2, Tartaruga ×2, Acqua in faccia ×1, niente Peroni (3 oggetti). Orologio 67,3 s (70,7 di parete).
- Budget di orologio: 134,2 s su 240 (giro 1: 66,9 su 120; giro 2: 67,3 su 120).

Quota / patte / turni medi, soli euristici (D93), colonna del giro 2 della B3 (mazzo di Peroni, R1) a confronto:

| Incontro | B3, giro 2 (Peroni, 5 oggetti) | **Giro 1 (intermedio, 4 oggetti)** | **Giro 2 (mazzo B2, R1)** | D95 |
|---|---|---|---|---|
| Sergio–Sergio | 46,4% / 5,2% / 11,3 | 45,5% / 5,3% / 11,3 | 46,4% / 4,9% / 11,9 | dentro |
| Sergio–Spazienzio | 74,9% / 2,5% / 9,2 | **72,9%** / 1,6% / 9,3 | **69,7%** / 2,1% / 9,5 | fuori in entrambi (quota +7,89 e +4,68 per l'analisi; soglia 68,3%) |
| Sergio–Mara | 69,2% / 3,8% / 10,3 | **67,2%** / 3,2% / 10,4 | 63,4% / 4,1% / 10,6 | giro 1 fuori (+2,2), giro 2 dentro |
| Sergio–Celestina | 45,3% / 7,6% / 11,0 | 41,4% / 7,1% / 11,1 | 38,2% / 6,3% / 11,2 | dentro |
| Sergio–Piera | 55,2% / 5,5% / 10,3 | 53,8% / 5,6% / 10,3 | 50,9% / 5,4% / 10,5 | dentro |
| Sergio–Beppe | 64,7% / 2,3% / 8,1 | 58,6% / 2,8% / 8,2 | 58,0% / 3,0% / 8,4 | dentro |

Patte entro il 10% e durata entro 12 turni in ogni incontro di entrambi i giri.

**Letture della § 4 (non criteri):**

| Lettura | B3, giro 2 | Giro 1 | Giro 2 |
|---|---|---|---|
| Partite con Lo rivendo; giocate per partita | 24,9%; 0,34 | 23,95%; 0,31 | 21,72%; 0,26 |
| Quota del ramo con l'oggetto | 93,6% | 90,5% | 86,0% |
| Oggetti venduti: Santino / Peroni / Espresso | 55,2% / 31,3% / 13,5% | 79,7% / — / 20,3% | 58,8% / — / 41,2% |
| Lo metto in conto: partite; giocate per partita | 78,0%; 1,23 | 77,0%; 1,13 | 74,0%; 1,04 |
| Battutina: giocate per partita | 1,73 | 1,87 | 2,31 |
| Mazzo esaurito | 14,8% | 9,4% | 8,0% |

Quota del ramo e oggetti venduti sono somme dei contatori «Effetti nuovi» di Sergio in tutti gli incontri euristici dei due `round-N.md`.
Con un solo Santino (giro 2) l'Espresso viene venduto spesso, perché dopo il Santino è l'unico oggetto o è accanto a un altro Espresso; con due Santino
(giro 1) la regola «mai un Espresso se c'è un Santino» lo protegge di più.

**Lettura.** Togliere la Peroni e rimettere Acqua in faccia (giro 1) toglie circa 2 punti a Spazienzio e Mara, non basta: il mazzo
della B2 (un solo Santino, due Tartarughe) li porta a 69,7% e 63,4%, con Lo rivendo R1 che da sola costa poco (cfr. § 5). Lo stato
migliore per D95 è il giro 2. Per portare anche Spazienzio sotto il 68,3% servirebbe un'altra leva, fuori dal perimetro di D116.

**Stato in bozza.** `prova-sergio` col mazzo della B2: Santino ×1, Espresso ×2, Tartaruga ×2, Acqua in faccia ×1, Oh guarda là ×2,
Ricatto ×2, Lo sapevo ×2, Conto salato ×2, Lo sanno tutti ×2, Malelingue, STORDIAMOTI, Sgambetto, Spintone ×1 (20 carte); bound Battutina
e Lo rivendo (R1). Verifiche: `git diff --check`, `check-links.py` (372 file, 0 rotti), `check-rules.py`, `rarita-bozza.py --check`,
bozza di riferimento `--scrivi` e `--verifica` allineata, `./scripts/build.ps1 -Task Test -Offline` verde (892 test, 21 saltati; 37 del client).
