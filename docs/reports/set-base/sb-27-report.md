# SB-27 Fase A — Le 19 carte d'effetto speciale in forma definitiva

**Revisione della regia, 23 novembre 2026:** accettata, Fase A chiusa; risposte alle domande nel [piano](../../set-base-plan.md#sb-27--carte-deffetto-speciale-in-forma-definitiva).

**Esito:** fatto, in attesa di revisione. Le 11 classi del set nuovo tengono solo la logica e prendono ogni numero dal file del set; le 19 carte hanno test scritti dalla scheda (70 casi), nessuna differenza fra carta e scheda; suite completa verde; corsa d'identità uguale salvo l'impronta della bozza nell'intestazione della matrice (vedi «Corsa d'identità»). Nuova impronta della bozza `325926e3…`.

Base `21b7767`. Prompt della regia del 23 novembre 2026 con la correzione del proprietario sui parametri spenti; due STOP risolti in
sessione dal proprietario (sotto, «Deviazioni»). Fonte: [D177](../../set-base-decisioni.md#decisioni-del-proprietario), le schede
del [documento del Set Base 1.0 candidato](../../../server/src/test/resources/set-base/catalogo/sets/base.md).

## Cosa cambia

- **Le 11 classi del set nuovo** (`model/cards/base`, più la base comune `cesira/Contromossa`) tengono solo la logica: nessun valore
  iniziale di comodo, nessun `optional = true`, nessun parametro che spegne; un numero che manca nel file del set è un errore di
  caricamento. I javadoc rimandano alla scheda (slot e nome).
  - **«Alla Goccia»** (`base.pino.GoingBerserk`): via `selfHit` (0, spento) con il danno a sé, via il tetto `maxDamage` (mai
    usato) e i ganci di Rincara; restano `base` e `perAlcohol`, obbligatori.
  - **«Ultimo Giro»** (`base.pino.UltimoGiro`): non estende più «Alla Goccia»; classe propria con `base`, `selfHit`, `perPlay`,
    `perPlaySelf`, tutti obbligatori; HIT pari a `base` più la L spesa (il fattore 1 è il testo della scheda, «più la L spesa»).
  - **«Ce l'Hai Due Spicci?»** (`base.com.BeggingMoney`): non estende più la classe viva `junkie.BeggingMoney` (che porta
    `alertnessFromTarget`); copia la sua logica di copia, senza la perdita di A, con lo stesso generatore casuale.
  - «Rutto a Bruciapelo», «Lavoro Fatto Bene», «Buon Vecchio Ricatto», «Santino di San Briaco», «Rialziamoci e Partite!»: tolti i
    valori iniziali dei numeri. «Copione Già Visto», «Discutiamone in Privato», «Scatto Repentino»: solo javadoc.
- **Il file del set** perde i due parametri spenti a 0: `selfHit` di «Alla Goccia» e `alertnessFromTarget` di «Ce l'Hai Due
  Spicci?». Numeri e testi invariati ([numeri-invariati.py](sb-27/numeri-invariati.py)). Impronta SHA-256 **`325926e35d371ad169848a5930924472ddfdd94a71b73a959fac0ed2dda83d8d`** (era `a8930ede…`).
- **Il generatore dei testi** (`testi_stampati.py`, deviazione 1) non chiede più quei due parametri e non ammette `maxDamage`.
- **Il catalogo candidato** rigenerato: cambiano solo le righe con l'impronta della bozza (`sets/base.md`, la sua copia client) e il
  `manifest.json` (impronta della bozza e dei due `base.md`); i due `cards.sqlite` sono identici.
- **Test:** nuova suite [`Sb27SpecialCardsTest`](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) (70 casi),
  adattatore di prova [`BozzeStoriche`](../../../server/src/test/java/com/gsc/bm/sim/BozzeStoriche.java) con il suo test (6 casi), 14
  test vecchi adeguati (deviazione 2).

## Deviazioni (parole del proprietario)

1. **`testi_stampati.py`** (STOP 1, il generatore esigeva i due parametri spenti). Il proprietario: «Sì, autorizzalo». Toccate solo
   le righe di `PARAMETRI_JAVA` di «Alla Goccia» e «Ce l'Hai Due Spicci?», i facoltativi (`maxDamage` tolto) e il controllo morto su
   `alertnessFromTarget`. `genera-testi.py --scrivi` lascia identici `testi-completi.json` e ogni campo `gui` della bozza.
2. **I test vecchi** (STOP 1/2: 28 rossi in 14 classi, tutti da bozze storiche non più caricabili o da logica tolta). Risposta del
   proprietario, citata: «(a) Historical drafts are evidence: do not edit them (server/src/test/resources/set-base/storico/, sb-21h/,
   docs/reports/**). Keep the production loader strict. Add a test-only adapter that upgrades an old draft in memory before loading:
   it drops only the removed switch-off params when they are 0 (selfHit of GoingBerserk, alertnessFromTarget of BeggingMoney,
   maxDamage) and adds to Ultimo Giro the perPlay / perPlaySelf values the old class used when they were missing (state them in the
   report). It refuses anything else, e.g. a non-zero removed param. Route the tests that load historical drafts through it
   (TurnForecastFidelityTest and ViewTableFidelityTest included), and add a small test proving the adapter does exactly this and
   nothing more. (b) Cases that test removed behaviour (the maxDamage cap in EstasiDamageCapTest, optional perAlcohol in
   GoingBerserkTest) are deleted: a deliberate change under D177 (1). Keep any case in those classes that still tests valid
   behaviour. (c) SetBaseDraftTest and Bozza16Test: update the expected JSON, with a comment citing D177.»

## Test e attese cambiati (deviazione 2)

| Test | Cosa cambia |
|---|---|
| `Bozza16Test`, `Correzione15Test`, `DeckSizeVariantsTest`, `LethalAwarePolicyTest`, `PotenzaD82Test`, `TurnForecastFidelityTest`, `ViewTableFidelityTest` | la 1.5 congelata si legge con `BozzeStoriche.fromClasspath` |
| `Sb21hBoundTest`, `TurnForecastFidelityTest`, `ViewTableFidelityTest` | la candidata k1 di SB-21h idem |
| `Sb16iBotsTest#kept` | la bozza data (1.5 o 1.7) idem; sulla 1.7 l'adattatore non cambia nulla |
| `SetBaseDraftTest` (4 punti), `StarterBalanceMeasureTest` | `docs/reports/set-base/sb-16g-2b1/draft.json` con `BozzeStoriche.fromFile` |
| `StarterLotMeasureTest` | `sb-16e/round-3` e `sb-16e2/c` idem |
| `EstasiDamageCapTest` | **cancellati** 5 casi col tetto e quello con `maxDamage` 0; resta il caso senza tetto (motore, `TurnForecast`, `ViewTable` concordi su 10 + 2 × 20 = 50), rinominato |
| `GoingBerserkTest` | **cancellato** il caso con `perAlcohol` omesso; resta quello con `perAlcohol` 1, rinominato |
| `Bozza16Test#the16ChangesExactlyWhatD97Approved` | attesa JSON di «Alla Goccia» senza `selfHit` (commento D177 (1)) |
| `SetBaseDraftTest` riga 498 | da «`selfHit` vale 0» a «`selfHit` non c'è» (commento D177 (1)) |

**L'adattatore** ([`BozzeStoriche`](../../../server/src/test/java/com/gsc/bm/sim/BozzeStoriche.java)): toglie, solo se valgono 0,
`selfHit` e `maxDamage` di «Alla Goccia», `maxDamage` di «Ultimo Giro», `alertnessFromTarget` di «Ce l'Hai Due Spicci?»; scrive i
numeri che la classe di allora usava quando la bozza li taceva: **`perPlay` 0 e `perPlaySelf` 0 per «Ultimo Giro»** e **`perAlcohol`
1 per «Alla Goccia»** (quest'ultimo è fuori dall'elenco letterale del proprietario, ma è la stessa regola: la 1.5 e le bozze di
SB-16/18 non lo scrivono e la classe usava 1; vedi domanda 1). Un parametro tolto diverso da 0 è rifiutato; tutto il resto passa
intatto al caricatore rigoroso. `BozzeStoricheTest` lo prova: 1.5 e k1 cambiano esattamente così, la 1.7 non cambia, il valore non
nullo è rifiutato, un parametro estraneo arriva al caricatore che lo rifiuta, `Draft.fromClasspath` resta rigoroso sulle bozze storiche.

## Le 19 carte contro la scheda

Attesi scritti a mano dalla scheda, mai letti dai parametri; carte caricate dal file del set; regole d50. Tavolo e attrezzi di prova
nel javadoc della classe. Nessuna differenza fra carta e scheda.

Casi di `Sb27SpecialCardsTest`, un metodo per riga di clausola (il nome del metodo comincia col nome breve della carta). 70 casi, tutti verdi.

| Slot | Carta | Casi | Caso base e clausole |
|---|---|---|---|
| SPA-AR5 | FAI BASTA | 3 | annulla una mossa ancora da risolvere, che tiene costo e pescata; su una mossa già risolta nulla; a pari priorità e pari A vale l'ordine di entrata |
| GEN-02 | Furto con Destrezza | 4 | prende l'oggetto scelto; oltre la capienza perde il proprio più vecchio; oggetto non più lì: nulla; l'effetto «In campo» passa al ladro (Conto, −4 A) |
| TOS-AR4 | Riflessi Aumentati dalla Speed | 5 | annulla una mossa contro di te o contro un tuo oggetto; lascia la mossa che l'avversario gioca su sé e quella già risolta; annulla la mossa di ogni avversario (tre giocatori) |
| TOS-AR5 | Trascinare nel Tunnel | 4 | dà la T dopo il costo, poi avvelena (b perde 10 + 10); toglie l'immunità al bersaglio, anche quella del personaggio; ti fa immune solo dopo il veleno di questo turno; non immune prima della fine del turno |
| OGG-04 | Mescolone Micidiale | 1 | cronologia di cinque turni: T e L bloccate, poi via tutto e veleno |
| LR-PIN | Ultimo Giro | 5 | HIT 10 + L spesa e 2 a te (2/13); il danno a sé viene prima della spesa, quindi l'armatura alcolica lo riduce (0/22); Rincara conta le giocate annullate e solo le tue (4/14, poi 6/18); ignora le giocate dell'avversario; su Vulnerabile arrotonda per difetto (16) |
| PIN-AR2 | Alla Goccia | 4 | 10 + L spesa (22); senza L 10; armatura del bersaglio (20); Vulnerabile (16) |
| PIN-AR5 | Rutto a Bruciapelo | 4 | L dopo il costo, toglie A, HIT 15 + 2 × L (29, b a 3 A); A non sotto 0 (45); con solo il costo non spende altro (15); armatura (27) |
| OGG-03 | Doppio Malto da Discount | 2 | lascia una bottiglia e dà 10 L; bottiglia a capienza piena perde la più vecchia |
| GIG-AR1 | Disassemblare | 2 | distrugge l'oggetto scelto senza effetto; oggetto già sparito: nulla |
| GIG-AR5 | Lavoro Fatto Bene | 5 | 15 senza oggetti; + 4 per oggetto, gettoni compresi (23); equipaggiamenti non contati; oggetti contati all'inizio della sua risoluzione (19); Vulnerabile (22) |
| CES-BO1 | Discutiamone in Privato | 4 | annulla una mossa successiva che Annuncia e resta in mano; lascia risolvere una mossa senza Annuncia; annuncio già risolto o mossa già annullata: nulla |
| CES-AR2 | Buon Vecchio Ricatto | 8 | annulla un attacco e rimanda metà del danno fisso (15); arrotonda per difetto ogni tipo (12, 5 + 5); non attacco: nulla; già risolta: nulla; già annullata: nulla; solo la parte fissa (Lazo 10, Scompenso 17); niente Rincara (Addosso 5); il danno passa per gli stati del bersaglio (Vulnerabile 22) |
| CES-AR3 | Copione Già Visto | 4 | annulla una mossa ancora da risolvere; sulla carta annunciata tiene l'avversario Vulnerabile (colpo dopo: 15); su un'altra carta annulla e basta; carta annunciata già annullata: il gettone finisce senza effetto |
| GEN-03 | Scatto Repentino | 3 | scambia tutti gli oggetti; oltre la capienza perde i più vecchi ricevuti; un lato vuoto: passano tutti, con il loro «In campo» |
| OGG-15 | Santino di San Briaco | 2 | blocca la L per tre turni contando questo, poi la L agisce (L 4, A 55); un secondo Santino non allunga |
| ROC-BO2 | Rialziamoci e Partite! | 3 | cura 4 da 1 a 30 H (30 → 34, 1 → 5), sopra 30 nulla (31); legge la salute dopo le mosse precedenti (35 − 7 + 4 = 32); a terra si risolve e non è annullata, a 0 non dà nulla; resta in mano |
| GEN-04 | Ce l'Hai Due Spicci? | 5 | copia un oggetto che l'avversario tiene; uno a caso fra due; senza oggetti nulla; oltre la capienza perde il proprio più vecchio; la copia è solo tua |
| GEN-10 | PERMESSO SCUSA PUOI SMETTERLA | 2 | toglie gli equipaggiamenti, poi 8 HIT; lascia gli altri stati (6, «Guardia») |

## Verifiche

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | **1050 test, 0 fallimenti**, 23 saltati (le misure lunghe, come prima) |
| `Sb27SpecialCardsTest`, `BozzeStoricheTest` | 70 + 6, verdi |
| `python scripts/check-rules.py` e `--candidate` | verdi |
| `python -X utf8 tools/set-catalog/set_catalog.py --check` (dopo la rigenerazione) | verde |
| `controlla-numeri.py`, `controlla-nomi.py`, `testi/controlla-testi.py` | verdi |
| [`sb-27/numeri-invariati.py`](sb-27/numeri-invariati.py) | «Bozza uguale a 21b7767 salvo 2 parametri a 0 tolti: base.pino.GoingBerserk.selfHit, base.com.BeggingMoney.alertnessFromTarget» |
| `genera-testi.py --scrivi` | `testi-completi.json` e i campi `gui` della bozza identici |

Due attese in più rispetto allo STOP 1/2, emerse alla seconda suite completa (stessa regola dell'adattatore):
`Correzione15Test` e `PotenzaD82Test` confrontano la 1.5 adattata con istantanee grezze dei passi 2 e 3 di SB-16g; ora leggono
anche le istantanee con `BozzeStoriche.adatta` (il confronto resta fra pari). In `PotenzaD82Test#theNumbersAreThoseOfProposal14`
l'attesa dei parametri di «Alla Goccia» passa da `{base 18, selfHit 0}` a `{base 18, perAlcohol 1}` (commento D177 (1)).

### Corsa d'identità

Comando, uguale nelle due corse salvo la cartella (`ref` sul commit base `21b7767`, `new` sul lavoro finito):

```powershell
powershell -File docs/reports/set-base/sb-21z/run.ps1 -Phase round -Label r20-2 -Draft classpath:/set-base/bozza.json -OutputRoot $env:TEMP\bm-sb27\<ref|new> -Games 100 -Seed 7000000 -Rows starter-spazienzio,starter-mara,starter-tossico,starter-pino,starter-gigi,prova-sergio,prova-duccio -Foes starter-spazienzio,starter-mara,starter-tossico,starter-pino,starter-gigi,prova-sergio,prova-duccio
```

| File | Riferimento (`21b7767`) | Lavoro finito |
|---|---|---|
| `deck-observations.json` | `87aa84d65f8b04edb86ddac8af6458bf7a817c9391cb93b4260aec0eb219c468` | **identico** |
| `matrix.json` | `fedfa3d64095e0995329a4a9388e9187cf280bdbd6cae3c524e65a4ef9fb67e7` | `5ca36649069459ffc15b0a9c10c4d2abd46311d897e8a9e2ad80174df439ae7c` |

`matrix.json` differisce **solo** nel campo `intestazione.sha256`, l'impronta della bozza misurata (`a8930ede…` → `325926e3…`), che
cambia per la correzione del proprietario. Sostituita quella stringa (64 byte, una sola occorrenza per file), i due file sono uguali
byte per byte (1 604 211 byte ciascuno). Ogni risultato di partita è identico. Lo leggo come identità; la regia confermi (domanda 1).

Il `deck-observations.json` di riferimento coincide con l'evidenza di SB-23; il `matrix.json` no, rispetto alla copia compressa di
SB-23: differenza di forma del file salvato (non indagata oltre, il confronto che conta è fra le due corse di oggi).

## Deroga alla partita viva («Playground e misure»), le tre condizioni

1. Il diff non tocca `server/src/main` fuori da `sim` e `model/cards/base` (nessun file di `sim` toccato), né `cards.sqlite`,
   regolamento, documenti di set, allegato o client. L'unica copia client toccata è quella del catalogo candidato
   (`server/src/test/resources/set-base/catalogo/client-debug/`), che è nei dati di prova.
2. `git grep -nE "com\.gsc\.bm\.(sim|model\.cards\.base)\b" -- server/src/main/java ":!…/sim" ":!…/model/cards/base" ":!…/bozza"`
   non stampa nulla.
3. `cards.sqlite` non cambia, quindi il catalogo vivo non nomina classi di `model/cards/base` (condizione vera dal 15 novembre).

## Lista per SB-28: le otto classi condivise

Oggi nel vivo restano come sono; in SB-28, quando lo 0.1 esce, si puliscono così (numeri dal file del set, D177 (2)).

| Classe (slot) | Valore iniziale vivo → file del set | Parametro spento e logica da togliere | Attese vive che si muovono |
|---|---|---|---|
| `bruiser.YouStop` (SPA-AR5) | `alertnessToTarget = 10` → 0 | **`alertnessToTarget`** con il guadagno di A dell'avversario in `applyEffectOnTarget` | `CatalogEffectsTest#lot3_countersDoNotCancelEarlierMoves` (b a 15 A dopo FAI BASTA), `RulesConformanceTest#r04_counterStillPaysAndDiscards` (30 A di b); `VulnerabilitaD69Test` e `LethalAwarePolicyTest` usano la classe, da rileggere |
| `com.Steal` (GEN-02) | nessun numero; costo 10 A e priorità 0 nel costruttore, uguali al file | — | nessuna |
| `junkie.AmphetamineReflexes` (TOS-AR4) | nessun numero; costo 10 T, priorità 2 uguali | — | nessuna |
| `junkie.ToxicBloodDrain` (TOS-AR5) | `turns = 1` (uguale), `poison = 0` facoltativo → 10 | `optional = true` di `poison` e i rami `poison <= 0` / `poison > 0` (in `applyEffectOnTarget` e nel testo stampato) | `RulesConformanceTest#r07_toxicDrainRestoresImmunityToActorOnly` (senza POISON), `PotenzaD82Test` (`noPoison()`, la classe viva a 1 riga e 3 passi, `theLiveToxicBloodDrainHasNoTunablePoisonInItsDraftsUnlessWritten`), `MissingResourceTest` (solo costo) |
| `com.items.MarvelousCocktail` (OGG-04) | `alcohol 20`, `toxicity 20`, `turns 5`, `poison 20`, uguali | nessuno; solo i valori iniziali | `CatalogEffectsTest`, `RulesConformanceTest` (con i numeri uguali non si muovono) |
| `com.items.AnotherRottenBeer` (OGG-03) | `alcohol = 10`, uguale | nessuno; solo il valore iniziale | nessuna |
| `bruiser.BreakYourToy` (GIG-AR1) | nessun numero; costo 10 V nel costruttore → 5 nel file | — | `CatalogEffectsTest` (V a 15 dopo il costo 10) |
| `bruiser.BadEducation` (GEN-10) | `hitDamage = 10` → 8; costo 10 V → 5 | nessuno; il valore iniziale | `CatalogEffectsTest#lot2_badEducationRemovesOnlyEquipsBeforeDamage` (85 H), `ConsumeEquipStatesTest` (i «suoi 10 HIT») |

Altro per SB-28: il generatore dei testi tiene ancora `alertnessToTarget` per FAI BASTA e la frase «Se la annulli, l'avversario
guadagna…» che a 0 non stampa; `Tunable.optional` resterà usato solo da `ToxicBloodDrain` e si può togliere con lui; «Ultimo Giro»
e «Copione Già Visto» leggono le regole del playground (`playground()`), che in SB-28 diventano le regole vive.

## Scelte prese

- «Ultimo Giro» classe a sé invece di una sottoclasse di «Alla Goccia»: le due schede non condividono più numeri.
- «Ce l'Hai Due Spicci?» classe a sé: la sottoclasse ereditava il parametro spento della classe viva, che non si tocca.
- «Scatto Repentino» resta sottoclasse della carta viva `com.ShuffleFeet` (nessun numero, logica identica): in SB-28, se la carta
  viva esce, la logica va copiata qui.
- Il costruttore di «Ce l'Hai Due Spicci?» ha costo vuoto invece dei 25 T vivi: il costo vero è nel file del set.
- `perAlcohol` resta facoltativo per «Alla Goccia» nel generatore dei testi (la regola del proprietario elencava solo `maxDamage`).
- La copia di «Ce l'Hai Due Spicci?» è lo stesso oggetto carta dell'originale, come nella carta viva (identità della misura); il test
  prova che consumarla non tocca quella dell'avversario.

## Non verificato

- I casi «l'avversario non ha una mossa» di FAI BASTA, Ricatto, Copione: in un duello ogni giocatore muove; in FFA non provato.
- `TestServerContext` e l'identità viva: esentati (le tre condizioni sopra).

## Domande per la regia

1. La matrice della corsa d'identità differisce dal riferimento solo per l'impronta della bozza nell'intestazione, cambiata per la
   correzione del proprietario; tutto il resto è uguale byte per byte. Vale come identità?
2. L'adattatore scrive anche `perAlcohol` 1 per «Alla Goccia» nelle bozze storiche che non lo hanno: senza, la 1.5 non si carica.
   Va bene come estensione della regola del proprietario?
3. Il costo `{"ALERTNESS": 0}` di «Ce l'Hai Due Spicci?» nel file del set è un costo a zero (la scheda dice «Nessun costo in
   risorse»): lo si toglie in Fase B o in SB-28, o resta?

## Fase B

**Stato:** inventario rilevato dalle 125 schede del Set Base 1.0 candidato. Base del blocco: `ed73a7d`.

Al controllo preliminare erano presenti quattro artefatti non tracciati in `output/pdf/`. Il proprietario ha autorizzato a proseguire: «Procedi lasciandoli al loro posto». Restano fuori dal commit.

### Inventario e copertura

Le 19 carte speciali riportano i casi e le clausole della fase A. Un trattino indica una voce ancora senza casi della fase B.

| Slot | Nome | Tipo | Classe di test | Casi | Clausole coperte |
|---|---|---|---|---:|---|
| PG-SPA | SPAZIENZIO DE LA UCCISO | Personaggio | — | — | — |
| PG-MAR | Mara Contromano | Personaggio | — | — | — |
| PG-TOS | Celestina Bucatina | Personaggio | — | — | — |
| PG-PIN | Piera Pinot | Personaggio | — | — | — |
| PG-GIG | Beppe Bulletta | Personaggio | — | — | — |
| PG-CES | Sergio Sommerso | Personaggio | — | — | — |
| PG-ROC | Duccio Braccio Teso | Personaggio | — | — | — |
| SPA-BA | ADOPERIAMOTI | Azione, Base | — | — | — |
| SPA-BO1 | LIEVE FASTIDIO | Azione, Legata al personaggio | — | — | — |
| SPA-BO2 | SVEGLIAMOCI - MA TU NO | Azione, Legata al personaggio | — | — | — |
| SPA-BO3 | VIOLENZAZIONE | Azione, Legata al personaggio | — | — | — |
| SPA-AR1 | GARGANTUESCO IMPATTO SUL TU | Azione, Regolare | — | — | — |
| SPA-AR2 | SPEDIAMOTI DUNQUE IN O-AHIO | Azione, Regolare | — | — | — |
| SPA-AR3 | PAZIENZA: FINITA | Azione, Regolare | — | — | — |
| SPA-AR4 | NON GIOCARE COL COLTELLO NO | Azione, Regolare | — | — | — |
| SPA-AR5 | FAI BASTA | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 3 | annulla una mossa ancora da risolvere, che tiene costo e pescata; su una mossa già risolta nulla; a pari priorità e pari A vale l'ordine di entrata |
| SPA-AR6 | SGOMBERIAMOVI | Azione, Regolare | — | — | — |
| MAR-BA | Requisire al Volo | Azione, Base | — | — | — |
| MAR-BO1 | Sventare l'Assassinio | Azione, Legata al personaggio | — | — | — |
| MAR-BO2 | Semaforo Rosso | Azione, Legata al personaggio | — | — | — |
| MAR-BO3 | Tagliare la Strada | Azione, Legata al personaggio | — | — | — |
| MAR-AR1 | Lazo del Rider | Azione, Regolare | — | — | — |
| MAR-AR2 | Sgommata | Azione, Regolare | — | — | — |
| MAR-AR3 | Agilità Innaturale | Azione, Regolare | — | — | — |
| MAR-AR4 | Unta e Bisunta | Azione, Regolare | — | — | — |
| MAR-AR5 | Slalom d'Avvicinamento | Azione, Regolare | — | — | — |
| MAR-AR6 | Traiettoria Imprevedibile | Azione, Regolare | — | — | — |
| TOS-BA | Desiderio Incontrollabile | Azione, Base | — | — | — |
| TOS-BO1 | Fondo del Posacenere | Azione, Legata al personaggio | — | — | — |
| TOS-BO2 | Rintanarsi nel Cappotto | Azione, Legata al personaggio | — | — | — |
| TOS-BO3 | Tagliare la Dose | Azione, Legata al personaggio | — | — | — |
| LR-TOS | L'Ultimo Tiro | Azione, Ultima risorsa | — | — | — |
| TOS-AR1 | Fare l'Inventario | Azione, Regolare | — | — | — |
| TOS-AR2 | Tossicone Scatarrante | Azione, Regolare | — | — | — |
| TOS-AR3 | Metabolismo Corrotto | Azione, Regolare | — | — | — |
| TOS-AR4 | Riflessi Aumentati dalla Speed | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 5 | annulla una mossa contro di te o contro un tuo oggetto; lascia la mossa che l'avversario gioca su sé e quella già risolta; annulla la mossa di ogni avversario (tre giocatori) |
| TOS-AR5 | Trascinare nel Tunnel | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 4 | dà la T dopo il costo, poi avvelena (b perde 10 + 10); toglie l'immunità al bersaglio, anche quella del personaggio; ti fa immune solo dopo il veleno di questo turno; non immune prima della fine del turno |
| TOS-AR6 | Un Assaggino | Azione, Regolare | — | — | — |
| PIN-BA | Fino all'Ultima Goccia | Azione, Base | — | — | — |
| PIN-BO1 | Posto Fisso | Azione, Legata al personaggio | — | — | — |
| PIN-BO2 | Violenta Spruzzata di Seltz | Azione, Legata al personaggio | — | — | — |
| PIN-BO3 | Schiarirsi le Idee | Azione, Legata al personaggio | — | — | — |
| LR-PIN | Ultimo Giro | Azione, Ultima risorsa | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 5 | HIT 10 + L spesa e 2 a te (2/13); il danno a sé viene prima della spesa, quindi l'armatura alcolica lo riduce (0/22); Rincara conta le giocate annullate e solo le tue (4/14, poi 6/18); ignora le giocate dell'avversario; su Vulnerabile arrotonda per difetto (16) |
| PIN-AR1 | Scompenso da Ultimo Giro | Azione, Regolare | — | — | — |
| PIN-AR2 | Alla Goccia | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 4 | 10 + L spesa (22); senza L 10; armatura del bersaglio (20); Vulnerabile (16) |
| PIN-AR3 | Avamposto Fortificato al Bancone | Azione, Regolare | — | — | — |
| PIN-AR4 | Un Altro e Arrivo | Azione, Regolare | — | — | — |
| PIN-AR5 | Rutto a Bruciapelo | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 4 | L dopo il costo, toglie A, HIT 15 + 2 × L (29, b a 3 A); A non sotto 0 (45); con solo il costo non spende altro (15); armatura (27) |
| PIN-AR6 | Un Altro... Grappino... | Azione, Regolare | — | — | — |
| GIG-BA | Questo Torna Utile | Azione, Base | — | — | — |
| GIG-BO1 | Cuffie e Testa Bassa | Azione, Legata al personaggio | — | — | — |
| GIG-BO2 | Colpo col Cacciavite | Azione, Legata al personaggio | — | — | — |
| GIG-BO3 | Affilare gli Utensili | Azione, Legata al personaggio | — | — | — |
| GIG-AR1 | Disassemblare | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 2 | distrugge l'oggetto scelto senza effetto; oggetto già sparito: nulla |
| GIG-AR2 | Chiave da Tredici | Azione, Regolare | — | — | — |
| GIG-AR3 | Preparare il Lavoro | Azione, Regolare | — | — | — |
| GIG-AR4 | Secondo Bagagliaio | Azione, Regolare | — | — | — |
| GIG-AR5 | Lavoro Fatto Bene | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 5 | 15 senza oggetti; + 4 per oggetto, gettoni compresi (23); equipaggiamenti non contati; oggetti contati all'inizio della sua risoluzione (19); Vulnerabile (22) |
| GIG-AR6 | Metodo Empirico | Azione, Regolare | — | — | — |
| CES-BA | Messo in Conto | Azione, Base | — | — | — |
| CES-BO1 | Discutiamone in Privato | Azione, Legata al personaggio | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 4 | annulla una mossa successiva che Annuncia e resta in mano; lascia risolvere una mossa senza Annuncia; annuncio già risolto o mossa già annullata: nulla |
| CES-BO2 | Tecnica Manipolatoria | Azione, Legata al personaggio | — | — | — |
| CES-BO3 | Fare il Vago | Azione, Legata al personaggio | — | — | — |
| CES-AR1 | Opportuna Distrazione | Azione, Regolare | — | — | — |
| CES-AR2 | Buon Vecchio Ricatto | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 8 | annulla un attacco e rimanda metà del danno fisso (15); arrotonda per difetto ogni tipo (12, 5 + 5); non attacco: nulla; già risolta: nulla; già annullata: nulla; solo la parte fissa (Lazo 10, Scompenso 17); niente Rincara (Addosso 5); il danno passa per gli stati del bersaglio (Vulnerabile 22) |
| CES-AR3 | Copione Già Visto | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 4 | annulla una mossa ancora da risolvere; sulla carta annunciata tiene l'avversario Vulnerabile (colpo dopo: 15); su un'altra carta annulla e basta; carta annunciata già annullata: il gettone finisce senza effetto |
| CES-AR4 | Conto Salato | Azione, Regolare | — | — | — |
| CES-AR5 | Segreto di Pulcinella | Azione, Regolare | — | — | — |
| CES-AR6 | Scherzo Oltre il Limite | Azione, Regolare | — | — | — |
| CES-AR7 | Fiuto per gli Affari | Azione, Regolare | — | — | — |
| ROC-BA | Prima gli Italiani | Azione, Base | — | — | — |
| ROC-BO1 | Rinfrescata Arrogante | Azione, Legata al personaggio | — | — | — |
| ROC-BO2 | Rialziamoci e Partite! | Azione, Legata al personaggio | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 3 | cura 4 da 1 a 30 H (30 → 34, 1 → 5), sopra 30 nulla (31); legge la salute dopo le mosse precedenti (35 − 7 + 4 = 32); a terra si risolve e non è annullata, a 0 non dà nulla; resta in mano |
| ROC-BO3 | (Dis)onore alla Bandiera | Azione, Legata al personaggio | — | — | — |
| LR-ROC | Non Mi Hai Fatto Niente | Azione, Ultima risorsa | — | — | — |
| ROC-AR1 | Nocche Sbucciate | Azione, Regolare | — | — | — |
| ROC-AR2 | Stoico come un Busto di Bronzo | Azione, Regolare | — | — | — |
| ROC-AR3 | E Allora...? | Azione, Regolare | — | — | — |
| ROC-AR4 | Craniata Patriottica | Azione, Regolare | — | — | — |
| ROC-AR5 | La Storia la Scrivono i Vincitori | Azione, Regolare | — | — | — |
| ROC-AR6 | Testa Dura | Azione, Regolare | — | — | — |
| GEN-01 | Afferrare | Azione, Regolare | — | — | — |
| GEN-02 | Furto con Destrezza | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 4 | prende l'oggetto scelto; oltre la capienza perde il proprio più vecchio; oggetto non più lì: nulla; l'effetto «In campo» passa al ladro (Conto, −4 A) |
| GEN-03 | Scatto Repentino | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 3 | scambia tutti gli oggetti; oltre la capienza perde i più vecchi ricevuti; un lato vuoto: passano tutti, con il loro «In campo» |
| GEN-04 | Ce l'Hai Due Spicci? | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 5 | copia un oggetto che l'avversario tiene; uno a caso fra due; senza oggetti nulla; oltre la capienza perde il proprio più vecchio; la copia è solo tua |
| GEN-05 | GABBIANO, DUNQUE VOLIAMOTI | Azione, Regolare | — | — | — |
| GEN-06 | Foratone da 28 | Azione, Regolare | — | — | — |
| GEN-07 | ORMALE GUARIAMOTI | Azione, Regolare | — | — | — |
| GEN-08 | AMMALIAMOTI DI BOTTE | Azione, Regolare | — | — | — |
| GEN-09 | STORDIAMOTI HO DETTO | Azione, Regolare | — | — | — |
| GEN-10 | PERMESSO SCUSA PUOI SMETTERLA | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 2 | toglie gli equipaggiamenti, poi 8 HIT; lascia gli altri stati (6, «Guardia») |
| GEN-11 | GENTILE IL TUO CAREZZO | Azione, Regolare | — | — | — |
| GEN-12 | Estrema Fretta di Alcolizzarsi | Azione, Regolare | — | — | — |
| GEN-13 | Tecnica del Carapace Mentale | Azione, Regolare | — | — | — |
| GEN-14 | Denti Stretti | Azione, Regolare | — | — | — |
| GEN-15 | Due Dita in Gola | Azione, Regolare | — | — | — |
| GEN-16 | Fasciatura d'Emergenza | Azione, Regolare | — | — | — |
| GEN-17 | Sputo nel Posacenere | Azione, Regolare | — | — | — |
| GEN-18 | Spintone | Azione, Regolare | — | — | — |
| GEN-19 | Mano Lesta | Azione, Regolare | — | — | — |
| GEN-20 | Riprendere Fiato | Azione, Regolare | — | — | — |
| GEN-21 | Coccio di Bottiglia | Azione, Regolare | — | — | — |
| GEN-22 | Svegliaaah! | Azione, Regolare | — | — | — |
| GEN-23 | Sgambetto | Azione, Regolare | — | — | — |
| GEN-24 | Estasi da Coca Etilene | Azione, Regolare | — | — | — |
| LR-STR | Addosso!!! | Azione, Ultima risorsa | — | — | — |
| OGG-01 | Negroni Trovato per Terra | Oggetto | — | — | — |
| OGG-02 | Bionda da 66, Calda | Oggetto | — | — | — |
| OGG-03 | Doppio Malto da Discount | Oggetto | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 2 | lascia una bottiglia e dà 10 L; bottiglia a capienza piena perde la più vecchia |
| OGG-04 | Mescolone Micidiale | Oggetto | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 1 | cronologia di cinque turni: T e L bloccate, poi via tutto e veleno |
| OGG-05 | Amaro nel Bicchiere di Plastica | Oggetto | — | — | — |
| OGG-06 | Espresso della Macchinetta | Oggetto | — | — | — |
| OGG-07 | Kebab Abbandonato | Oggetto | — | — | — |
| OGG-08 | Acqua Minerale Sgasata | Oggetto | — | — | — |
| OGG-09 | Guanti da Officina | Oggetto | — | — | — |
| OGG-10 | Giubbotto di Finta Pelle | Oggetto | — | — | — |
| OGG-11 | Casco da Cantiere | Oggetto | — | — | — |
| OGG-12 | Pasticca Abbandonata | Oggetto | — | — | — |
| OGG-13 | Posacenere di Vetro | Oggetto | — | — | — |
| OGG-14 | Ghiaccio nel Tovagliolo | Oggetto | — | — | — |
| OGG-15 | Santino di San Briaco | Oggetto | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 2 | blocca la L per tre turni contando questo, poi la L agisce (L 4, A 55); un secondo Santino non allunga |
| OGG-16 | Grappa della Casa | Oggetto | — | — | — |
| OGG-17 | Conto del Tavolo Sei | Oggetto | — | — | — |
| OGG-18 | Sigaretta Accesa | Oggetto | — | — | — |
| TOKEN | Bottiglia Spaccata | Oggetto, Token | — | — | — |
