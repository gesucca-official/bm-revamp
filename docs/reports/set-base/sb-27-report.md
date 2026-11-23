# SB-27 Fase A — Le 19 carte d'effetto speciale in forma definitiva

**Chiuso il 23 novembre 2026** ([D181](../../set-base-decisioni.md#decisioni-del-proprietario)): il proprietario, «Sì, chiudi».

**Revisione della regia, 23 novembre 2026:** accettata, Fase A chiusa; risposte alle domande nel [piano](../../set-base-plan.md#sb-27--carte-deffetto-speciale-in-forma-definitiva).

**Esito:** fatto, in attesa di revisione. Le 11 classi del set nuovo tengono solo la logica e prendono ogni numero dal file del set; le 19 carte hanno test scritti dalla scheda (70 casi), nessuna differenza fra carta e scheda; suite completa verde; corsa d'identità uguale salvo l'impronta della bozza nell'intestazione della matrice (vedi «Corsa d'identità»). Nuova impronta della bozza `325926e3…`.

Base `21b7767`. Prompt della regia del 23 novembre 2026 con la correzione del proprietario sui parametri spenti; due STOP risolti in
sessione dal proprietario (sotto, «Deviazioni»). Fonte: [D177](../../set-base-decisioni.md#decisioni-del-proprietario), le schede
del [documento del Set Base 1.0 candidato](../../sets/base.md).

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

- [D168 (4)](../../set-base-decisioni.md#decisioni-del-proprietario), rinvio confermato dalla regia: il token creato da
  `AnotherRottenBeer` prende il nome dal file del set («Bottiglia Spaccata»). `Sb27BottleNameReproTest` diventa un test ordinario.

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

**Fase B consegnata, STOP per la revisione della regia.** L'inventario copre tutte le 125 voci. La fase B aggiunge 436 casi ordinari per le 106 voci rimanenti e per le clausole comuni. Le 19 carte speciali conservano i 70 casi della fase A, con ulteriori prove comuni. La sola clausola rinviata a SB-28 è il nome selezionabile del token (D168 (4)). Base del blocco `ed73a7d`, ultima ripresa da `000822e`.

Al controllo preliminare erano presenti quattro artefatti non tracciati in `output/pdf/`. Il proprietario ha autorizzato a proseguire: «Procedi lasciandoli al loro posto». Restano fuori dal commit.

### Scostamento SPA-AR3 — PAZIENZA: FINITA

La scheda SPA-AR3 prima di D178 dice «la mostri a tutti finché resta in mano». [RP-16 e RP-18](../../design/set-base/regole-playground.md)
descrivono la scadenza del promemoria da due prospettive. RP-16 fa cadere gettone e promemoria a fine turno quando si gioca il nome.
RP-18 lega la visibilità alla copia trovata. Il caso che distingue le letture è giocare l'altra copia, già in mano al momento della ricerca.

1. SPAZIENZIO parte con una copia di «GARGANTUESCO IMPATTO SUL TU» in mano e una nel mazzo. Gioca «PAZIENZA: FINITA»,
   sale a 50 V e 35 A e mostra la copia trovata.
2. Al turno dopo gioca la copia già in mano. L'avversario subisce 35 HIT, la copia giocata esce e Vulnerabile termina.
   La copia trovata resta in mano. Atteso dalla frase originaria della scheda: 1 copia mostrata. Osservato: 0.
3. La rimozione di fine turno in `Game.resolveMoves` include i promemoria soddisfatti anche se `Player.holds` conferma che la copia
   trovata è ancora in mano. Nel primo giro motore, bozza e scheda coincidevano con la base del blocco.

Il primo giro mirato aveva rilevato un solo rosso (`expected: <1> but was: <0>`). L'evidenza di quel giro è nel commit `0714493`.

### Deviazione autorizzata — D178

Il proprietario ha risposto «correggiamo la frase». La decisione conferma che la carta mostrata è un promemoria che finisce con
Vulnerabile (RP-16 e RP-18). La sola frase `se_trovi` di `testi_stampati.py` dice ora che la copia si mostra finché resta in mano
e finché dura il Vulnerabile legato a lei. Sono stati rigenerati i testi completi e il catalogo candidato nel commit `361bd7e`.
Le 12 schede interessate sono SPA-AR3, SPA-AR6, MAR-AR5, MAR-AR6, TOS-AR1, TOS-AR6, PIN-AR4, PIN-AR6, GIG-AR3, GIG-AR6,
CES-AR1 e ROC-AR5. Il confronto con `9449d19` ha rilevato solo la frase nei 12 testi completi e le impronte dei file derivati,
anche nel confronto del contenuto SQLite. Testi brevi e tutti i campi `gui` coincidono byte per byte con la base.

Il [caso dell'altra copia](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java) è entrato nella suite con
l'atteso D178 di zero copie visibili. Il giro mirato lo ha confermato. Il vecchio file diagnostico è stato tolto.

### Nuovo scostamento SPA-AR3 × OGG-04 — scadenza del timer di Mescolone Micidiale

La scheda nella versione D178 richiedeva sia che la copia fosse in mano sia che il Vulnerabile legato durasse ancora. RP-29 e la scheda di OGG-04 dicono che alla fine del quinto turno, contando il consumo,
Mescolone Micidiale rimuove anche Vulnerabile.

1. SPAZIENZIO gioca PAZIENZA: FINITA, trova una copia di GARGANTUESCO IMPATTO SUL TU e la mostra.
2. Nel turno successivo consuma Mescolone Micidiale. Dopo altri tre turni ha ancora 70 H, Vulnerabile e la copia mostrata.
3. Al quinto turno dal consumo, il timer scatta, SPAZIENZIO scende a 50 H, tutti i suoi stati Vulnerabile scompaiono e la copia
   trovata resta in mano. Atteso dalla scheda D178: zero copie mostrate. Osservato: una.

`Game.resolveMoves` trattiene il promemoria quando la copia è ancora in mano e il gettone non è stato soddisfatto da una giocata,
anche quando il timer lo ha rimosso. `Player.getShownRevealed` filtra per presenza in mano. La vista pubblica usa quel risultato.
Il motore e la bozza coincidono con la base della ripresa.

Il giro mirato della seconda ripresa aveva rilevato un solo rosso (`expected: <0> but was: <1>`). L'evidenza è
nel commit `ff2009e`.

### Deviazione autorizzata — D179

Il proprietario ha risposto «sì, allinea la frase al motore». Nei testi completi delle stesse 12 schede di Annuncia la copia
trovata «va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome». Regole del playground
1.8, RP-29: il timer di Mescolone rimuove il gettone Vulnerabile e la copia ancora in mano resta mostrata. [Regole del playground](../../design/set-base/regole-playground.md)

Il commit `a7f428a` contiene la sola frase `se_trovi`, i testi completi e il catalogo rigenerati, l'intestazione 1.8 e
la frase aggiunta a RP-29. Il confronto con `6145d6a` ha confermato che il catalogo e SQLite cambiano solo per i 12 testi
completi e per le impronte derivate. Tutti i campi `gui` e i testi brevi coincidono con la base.

Il caso di Mescolone è entrato in [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java)
con l'atteso D179 di una copia mostrata. Il caso dell'altra copia conserva l'atteso di zero copie mostrate. Il vecchio
diagnostico è stato tolto.

### Terzo scostamento — annuncio omonimo dopo Mescolone

Il testo completo di SPA-AR3 e SPA-AR6 e RP-15/RP-16 fanno finire un Vulnerabile quando si gioca il nome corrispondente.
Se ci sono più gettoni, finisce il più vecchio. Il caso distingue un promemoria rimasto in mano da un gettone attivo.
[Schede del candidato](../../sets/base.md)

1. PAZIENZA: FINITA trova la prima copia di GARGANTUESCO IMPATTO SUL TU. Il timer di Mescolone rimuove quel Vulnerabile e la
   prima copia resta visibile, come prevede D179.
2. SGOMBERIAMOVI trova la seconda copia dello stesso nome. Ora sono mostrate due copie e c'è un solo gettone Vulnerabile,
   quello del secondo annuncio.
3. Si gioca la prima copia. Esce dalla mano, la seconda resta. Atteso a fine turno: zero gettoni Vulnerabile. Osservato: il
   gettone del secondo annuncio è ancora attivo.

`Game.resolveMoves` soddisfa la prima voce con quel nome nell'elenco dei promemoria. La voce scelta è ancora presente dopo
Mescolone, benché il suo gettone sia già stato rimosso. Il confronto con `6145d6a` conferma che il motore e la bozza sono identici.

Il diagnostico fu l'unico rosso nel giro mirato di 93 casi. L'evidenza è nel commit `316fd7d`.

### Deviazione autorizzata — D180

Il proprietario ha risposto «sì, correggi il motore». RP-15, nelle regole del playground 1.9, esplicita che la giocata omonima
soddisfa il gettone più vecchio ancora attivo. Nel ramo `playground()` di `Game.resolveMoves`, i promemoria omonimi senza
gettone entrano nella rimozione di fine turno insieme al promemoria soddisfatto. Il caso già diagnosticato verifica zero
Vulnerabile dopo la giocata. Un secondo caso verifica zero copie mostrate quando la copia del promemoria senza gettone è
ancora in mano e viene giocata l'altra copia. Entrambi entrano in `Sb27SpazienzioCardsTest` accanto ai casi D178 e D179.

#### Identità SB-23 20/2

Due corse esclusive da 403.200 partite ciascuna, prima su `2bbbcbd` (158,09 s) e poi con D180 (178,37 s). Comando identico
alla fase A con `run.ps1 -Phase round -Label r20-2 -Games 100 -Seed 7000000`, bozza dal classpath e la stessa lista di sette
mazzi come righe e avversari. Uscite in `%TEMP%/bm-sb27-d180-2bbbcbd/{ref,new}/round-r20-2`.

| File | Byte | SHA-256, identico prima e dopo |
|---|---:|---|
| `matrix.json` | 1.604.211 | `5ca36649069459ffc15b0a9c10c4d2abd46311d897e8a9e2ad80174df439ae7c` |
| `deck-observations.json` | 565.051 | `87aa84d65f8b04edb86ddac8af6458bf7a817c9391cb93b4260aec0eb219c468` |

Il confronto ha letto tutti i byte dei due file di ciascuna corsa.

### Banco e scelte

- Banco d50 della fase A, estratto in `Sb27Table`. Le prove usano l'ordine del turno di `Game`, carte della bozza e attesi
  letterali dalla scheda. Le mosse di appoggio sono sintetiche. I casi di Annuncia usano anche il personaggio della bozza. Nel caso del secondo annuncio il seme del banco mantiene nel mazzo la seconda copia fino al secondo annuncio.
- I due primi rossi su L erano errori nel calcolo del test. A fine turno R06 sottrae metà della L più uno, quindi 10 L
  diventano 4 e 12 L diventano 5. Il giro mirato ha confermato la correzione. I casi e gli attesi della fase A sono intatti.
- Lo scarto di un oggetto venduto è osservabile come uscita dal campo. Il modello non espone una pila di scarti da leggere.
  Per l'equipaggiamento OUTPUT di un oggetto, un attacco dell'autore prima del consumo nello stesso turno richiederebbe una
  seconda mossa dell'autore. Il banco prova i danni dei turni successivi e, per la corazza INPUT, anche il turno di consumo.

### Verifiche D180

- `./scripts/build.ps1 -Task Test -Offline` verde. Server: 1.073 casi, zero fallimenti, zero errori, 23 saltati.
  Client di debug: 37 su 37. La fase B conta 23 casi ordinari e i 70 casi della fase A passano.
- `python scripts/check-rules.py`, `python scripts/check-rules.py --candidate` e
  `python tools/set-catalog/set_catalog.py --check` verdi. SHA-256 di `bozza.json`
  `325926e35d371ad169848a5930924472ddfdd94a71b73a959fac0ed2dda83d8d`.
- Per `Game.java` si applica la tabella «Partita viva». `TestServerContext -Offline` verde con 1.191 casi,
  zero fallimenti, zero errori e 23 saltati. `verify-match-manifests.py` PASS.
- `git diff --check` pulito e diff da `2bbbcbd` entro i perimetri autorizzati. I documenti toccati hanno zero link rotti.
  Il controllo globale segnala gli otto riferimenti mancanti preesistenti sotto `docs/design/carriere/`.

#### STOP 2 — identità della partita viva

La misura aggiuntiva prescritta per `Game.java` si ferma prima delle 480.000 partite. Il banco
`ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft` usa `Draft.fromFile` direttamente sulla bozza storica
`%TEMP%/bm-sb16g2b2-live/base-draft.json`, SHA-256 `faf265fad50ee0bedca125209f7008434a73660131f786ad272800235567d7c5`.
Il caricatore rifiuta `base.pino.UltimoGiro` con «parametro mancante params.perPlay».
La prova mirata con il codice di produzione della base `2bbbcbd` restituisce lo stesso errore prima di simulare.
La correzione D180 è stata ripristinata dopo il confronto e la bozza storica è intatta. L’identità viva resta da verificare.
Il log del confronto sulla base è in `%TEMP%/bm-sb27-d180-2bbbcbd/live-on-base.log`.

### Risoluzione dello STOP 2 — caricatori di misura

La regia ha autorizzato la sostituzione in base alla risposta del proprietario allo STOP 1/2 della fase A:
«Route the tests that load historical drafts through it». La lacuna risale alla fase A. Il banco vivo era rimasto fuori
dall’instradamento verso `BozzeStoriche` perché si avvia solo con una proprietà esplicita.

- `ChargeMeasureTest` instrada la fixture del banco vivo con `fromFile`. `DifficileMeasureTest` e `Sb30bProbeTest`
  instradano le risorse dei rispettivi banchi con `fromClasspath`. `Listino` applica l’adattatore ai tre ingressi
  di `baseDraft`, usato da `ListinoMeasureTest`.
- `SetBaseArms.measureDraft` instrada la fonte singola configurabile di `BenchMeasureTest`, `ChargeMeasureTest`,
  `LethalBotMeasureTest`, `PlaygroundMeasureTest`, `Sb17MeasureTest`, `Sb18MeasureTest`, `Sb19MeasureTest`,
  `StarterBalanceMeasureTest` e `StarterLotMeasureTest`. Le selezioni di più set conservano la composizione
  di `Draft.load`. La trasformazione in memoria del braccio B resta com’era.
- `ListinoAnchorTest` e `StarterRedesignTest` sono test ordinari. `DeckSizePhaseTest` usa già la fixture adattata
  tramite `DeckSizeVariantsTest`. Il caricatore di produzione e le bozze conservano i contenuti precedenti.

`ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft` ha completato due corse esclusive da 480.000 partite con
`-Dsim.rules=1.13` e la stessa fixture storica. Primo giro su `2bbbcbd` con i soli caricatori di prova instradati
(110,78 s). Secondo sul codice `67a01b2` con lo stesso instradamento (111,64 s). Uscite in
`%TEMP%/bm-sb27-live-reroute-67a01b2/{base,d180}`.

| File | Byte | SHA-256 identico nei due giri |
|---|---:|---|
| `final-live.json` | 266.869 | `ca131721c9bd6549c8e302bdfcd959a41b9c99903f911ba6a78f9186641e49a4` |
| `final-live.md` | 26.112 | `16d3bde4c385cc3a353e1720707dce5e9367f170db1b4a6377407c0c385ecef4` |

Entrambi i file coincidono byte per byte, con le stesse impronte del riferimento vivo storico. L’impronta della
fixture è rimasta `faf265fad50ee0bedca125209f7008434a73660131f786ad272800235567d7c5`.

### Verifiche della ripresa per l’identità viva

- `./scripts/build.ps1 -Task Test -Offline` verde. Server 1.194 casi, zero fallimenti, zero errori, 23 saltati.
  Client di debug 37 su 37. `BozzeStoricheTest` conferma che il caricatore di prova lascia intatta la bozza 1.7.
- `check-rules.py`, `check-rules.py --candidate` e `set_catalog.py --check` verdi. SHA-256 di `bozza.json`
  `325926e35d371ad169848a5930924472ddfdd94a71b73a959fac0ed2dda83d8d`.
- Il diff da `67a01b2` contiene solo test e documenti autorizzati. `git diff --check` pulito. I due documenti
  modificati hanno zero link rotti. Il controllo globale segnala gli otto riferimenti mancanti preesistenti
  di `docs/design/carriere/`. Il contesto Spring e i manifest restano documentati nella verifica D180.

### Rinvio a SB-28 — nome selezionabile della Bottiglia Spaccata

La scheda TOKEN e OGG-03 chiamano il token «Bottiglia Spaccata». In d50, il consumo di Doppio Malto crea l’oggetto con il
binding atteso `com.tokens.BrokenBeerBottle`. `Card.getName()` restituisce però `Broken Beer Bottle`. `Game.getItem`
confronta il nome della mossa con quello restituito dalla carta. Il nome della scheda quindi non individua l’oggetto sul server.

Il [caso diagnostico](../../../server/src/test/java/com/gsc/bm/sim/Sb27BottleNameTest.java) è l’unico rosso del giro mirato su oggetti, personaggi e token
(32 casi). Atteso `Bottiglia Spaccata`, osservato `Broken Beer Bottle`. Per riprodurlo, copiare il sorgente in
`server/src/test/java/com/gsc/bm/sim/` ed eseguire `Sb27BottleNameReproTest` con Maven offline. Il motore e le schede
coincidono con `67a01b2`. I casi separati verificano creazione, consumo e durata dell’equipaggiamento con il binding corretto.

La regia rinvia il nome selezionabile a SB-28 insieme ai nomi delle classi condivise col vivo (D168 (4)).
La prova rimane come evidenza per la lista di SB-28. Le clausole di gioco del token sono coperte dalla suite ordinaria.

### Inventario e copertura

L'inventario distingue 117 carte, sette personaggi e un token. Per le 19 carte speciali il primo riferimento è `Sb27SpecialCardsTest`. Il conteggio comprende le invocazioni parametrizzate della riga. Il caso di base di MAR-AR5 e MAR-AR6 è un solo metodo condiviso. I casi comuni già presenti nella suite sono indicati sotto e non si sommano ai totali.

| Slot | Nome | Tipo | Classe di test | Casi | Clausole coperte |
|---|---|---|---|---:|---|
| PG-SPA | SPAZIENZIO DE LA UCCISO | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 1 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio |
| PG-MAR | Mara Contromano | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 1 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio |
| PG-TOS | Celestina Bucatina | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 2 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio, T periodica bloccata e POISON diretto applicato |
| PG-PIN | Piera Pinot | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 1 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio |
| PG-GIG | Beppe Bulletta | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 1 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio |
| PG-CES | Sergio Sommerso | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 1 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio |
| PG-ROC | Duccio Braccio Teso | Personaggio | [Sb27CharacterSheetsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CharacterSheetsTest.java) | 1 | H/A/V/T/L iniziali, immunità, basic, capienza e perdita del più vecchio |
| SPA-BA | ADOPERIAMOTI | Azione, Base | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | basic gratuita, priorità e bersaglio, consumo del solo oggetto scelto, permanenza in mano, oggetto rubato prima della risoluzione; nome, tipo, costo, priorità e bersaglio |
| SPA-BO1 | LIEVE FASTIDIO | Azione, Legata al personaggio | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 4 | bound gratuita, priorità e bersaglio, +5 V, tre quarti di HIT/CUT/POISON e del veleno periodico, cumulo, danno precedente e scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| SPA-BO2 | SVEGLIAMOCI - MA TU NO | Azione, Legata al personaggio | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | priorità e bersaglio, quarti di T e L arrotondati per difetto, T letta dopo la mossa precedente, 2 HIT, permanenza in mano; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| SPA-BO3 | VIOLENZAZIONE | Azione, Legata al personaggio | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | priorità, costo e bersaglio, 4 HIT a sé e +8 V, permanenza in mano; nome, tipo, costo, priorità e bersaglio |
| SPA-AR1 | GARGANTUESCO IMPATTO SUL TU | Azione, Regolare | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 25 V, priorità, 35 HIT al solo avversario scelto; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| SPA-AR2 | SPEDIAMOTI DUNQUE IN O-AHIO | Azione, Regolare | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 V, priorità e bersaglio, 12 HIT da 13 V rimaste, metà arrotondata per difetto; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| SPA-AR3 | PAZIENZA: FINITA | Azione, Regolare | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27SpazienzioAnnounceTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioAnnounceTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 17 | scelta predefinita, esplicita e automatica, premio pieno, ripiego e annullamento, Vulnerabile su HIT/CUT/POISON e sul veleno periodico, giocata dell’altra copia e timer di OGG-04. Chiusura del promemoria senza gettone quando si gioca l’altra copia (D180); nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| SPA-AR4 | NON GIOCARE COL COLTELLO NO | Azione, Regolare | [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | +10 V, metà dei CUT per quattro turni, HIT invariati, ritorno al danno intero al quinto turno; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| SPA-AR5 | FAI BASTA | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 5 | annulla una mossa ancora da risolvere, che tiene costo e pescata; su una mossa già risolta nulla; a pari priorità e pari A vale l'ordine di entrata; nome, tipo, costo, priorità e bersaglio; mossa bersaglio assente |
| SPA-AR6 | SGOMBERIAMOVI | Azione, Regolare | [Sb27SpazienzioAnnounceTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioAnnounceTest.java), [Sb27SpazienzioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpazienzioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 15 | scelta predefinita, esplicita e automatica, premio pieno, ripiego e annullamento, Vulnerabile su HIT/CUT/POISON e sul veleno periodico, secondo annuncio omonimo dopo il timer, fine del gettone attivo e di entrambi i promemoria (D180); nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| MAR-BA | Requisire al Volo | Azione, Base | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | perde 5 A prima del consumo, pavimento a zero, oggetto scelto e oggetto distrutto; nome, tipo, costo, priorità e bersaglio |
| MAR-BO1 | Sventare l'Assassinio | Azione, Legata al personaggio | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | quarti di T e L arrotondati per difetto, 2 CUT attraverso la corazza, bound in mano; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| MAR-BO2 | Semaforo Rosso | Azione, Legata al personaggio | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 4 | +5 A, tre quarti sui tre tipi e sul veleno periodico, cumulo, mosse anteriori, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| MAR-BO3 | Tagliare la Strada | Azione, Legata al personaggio | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 7 | −4 A solo al bersaglio, pari gruppo, annullamento successivo, pavimento a zero; nome, tipo, costo, priorità e bersaglio; mossa bersaglio assente, successiva annullata, bersaglio già a terra con mossa successiva |
| MAR-AR1 | Lazo del Rider | Azione, Regolare | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 7 | costo 20 A, metà arrotondata della A residua, 5 CUT in anticipo, pari gruppo dopo i costi; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; mossa bersaglio assente, successiva annullata, bersaglio già a terra con mossa successiva |
| MAR-AR2 | Sgommata | Azione, Regolare | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 8 | costo 15 A, 25 CUT, malus su tre tipi e su autodanno, stesso gruppo e scadenza; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza; mossa bersaglio assente, successiva annullata, bersaglio già a terra con mossa successiva |
| MAR-AR3 | Agilità Innaturale | Azione, Regolare | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 6 | 4 CUT, −8 A, pavimento a zero, +4 A solo in anticipo; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; mossa bersaglio assente, successiva annullata, bersaglio già a terra con mossa successiva |
| MAR-AR4 | Unta e Bisunta | Azione, Regolare | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | pagamento prima dell’ordine, rimborso, metà HIT/CUT, POISON intero e scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| MAR-AR5 | Slalom d'Avvicinamento | Azione, Regolare | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 1 condiviso + 9 | ordine stampato, premio +15 A e Vulnerabile, ricerca vuota e pesca ordinaria; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| MAR-AR6 | Traiettoria Imprevedibile | Azione, Regolare | [Sb27MaraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27MaraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 1 condiviso + 9 | ordine inverso, premio +20 A e Vulnerabile, ricerca vuota e pesca ordinaria; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| TOS-BA | Desiderio Incontrollabile | Azione, Base | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | +5 T, consumo del solo oggetto scelto, oggetto distrutto, basic in mano; nome, tipo, costo, priorità e bersaglio |
| TOS-BO1 | Fondo del Posacenere | Azione, Legata al personaggio | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | +2 T, 2 CUT attraverso la corazza, bound in mano; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| TOS-BO2 | Rintanarsi nel Cappotto | Azione, Legata al personaggio | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | +2 T, tre quarti dei tre tipi e del veleno periodico, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| TOS-BO3 | Tagliare la Dose | Azione, Legata al personaggio | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | cura di un quarto prima della perdita di metà T, arrotondamenti; nome, tipo, costo, priorità e bersaglio |
| LR-TOS | L'Ultimo Tiro | Azione, Ultima risorsa | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27RincaraClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27RincaraClausesTest.java) | 5 | 2 HIT a sé, 8 POISON e +4 T al bersaglio, Rincara dopo uso e annullamento, ripescata a mazzo vuoto; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; mossa annullata conta, mosse avversarie escluse |
| TOS-AR1 | Fare l'Inventario | Azione, Regolare | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 10 | ordine stampato, +10 T e +5 A con Vulnerabile, +5 T e pesca ordinaria se assente; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| TOS-AR2 | Tossicone Scatarrante | Azione, Regolare | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 T, 20 POISON e +5 T sul bersaglio immune; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| TOS-AR3 | Metabolismo Corrotto | Azione, Regolare | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | cura di metà T arrotondata dopo una mossa precedente, perdita di tutta T; nome, tipo, costo, priorità e bersaglio |
| TOS-AR4 | Riflessi Aumentati dalla Speed | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 7 | annulla una mossa contro di te o contro un tuo oggetto; lascia la mossa che l'avversario gioca su sé e quella già risolta; annulla la mossa di ogni avversario (tre giocatori); nome, tipo, costo, priorità e bersaglio; mossa bersaglio assente |
| TOS-AR5 | Trascinare nel Tunnel | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 6 | dà la T dopo il costo, poi avvelena (b perde 10 + 10); toglie l'immunità al bersaglio, anche quella del personaggio; ti fa immune solo dopo il veleno di questo turno; non immune prima della fine del turno; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| TOS-AR6 | Un Assaggino | Azione, Regolare | [Sb27CelestinaCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27CelestinaCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 10 | ordine stampato, +20 T con Vulnerabile, +5 T e pesca ordinaria se assente; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| PIN-BA | Fino all'Ultima Goccia | Azione, Base | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | +15 L prima del consumo, birra e acqua, oggetto distrutto e basic in mano; nome, tipo, costo, priorità e bersaglio |
| PIN-BO1 | Posto Fisso | Azione, Legata al personaggio | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | +5 L, tre quarti dei tre tipi e del veleno, corazza dopo gli stati, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| PIN-BO2 | Violenta Spruzzata di Seltz | Azione, Legata al personaggio | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | quarto di T arrotondato, 2 HIT soggetti alla corazza, bound in mano; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| PIN-BO3 | Schiarirsi le Idee | Azione, Legata al personaggio | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | guadagno di A prima della perdita di L, metà arrotondate e decadimento; nome, tipo, costo, priorità e bersaglio |
| LR-PIN | Ultimo Giro | Azione, Ultima risorsa | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27RincaraClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27RincaraClausesTest.java) | 8 | HIT 10 + L spesa e 2 a te (2/13); il danno a sé viene prima della spesa, quindi l'armatura alcolica lo riduce (0/22); Rincara conta le giocate annullate e solo le tue (4/14, poi 6/18); ignora le giocate dell'avversario; su Vulnerabile arrotonda per difetto (16); nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; mossa annullata conta, mosse avversarie escluse |
| PIN-AR1 | Scompenso da Ultimo Giro | Azione, Regolare | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 5 L prima dei 5 HIT a sé e dei 35 al bersaglio, corazza basata sulla L residua; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| PIN-AR2 | Alla Goccia | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 6 | 10 + L spesa (22); senza L 10; armatura del bersaglio (20); Vulnerabile (16); nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| PIN-AR3 | Avamposto Fortificato al Bancone | Azione, Regolare | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | tre quarti HIT, metà POISON anche periodico, CUT intero, +5 L e scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| PIN-AR4 | Un Altro e Arrivo | Azione, Regolare | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 10 | ordine stampato, premi pieno e ridotto, decadimento, promemoria e Vulnerabile; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| PIN-AR5 | Rutto a Bruciapelo | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 6 | L dopo il costo, toglie A, HIT 15 + 2 × L (29, b a 3 A); A non sotto 0 (45); con solo il costo non spende altro (15); armatura (27); nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| PIN-AR6 | Un Altro... Grappino... | Azione, Regolare | [Sb27PieraCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27PieraCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java) | 10 | ordine inverso, premi pieno e ridotto, decadimento, promemoria e Vulnerabile; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto |
| GIG-BA | Questo Torna Utile | Azione, Base | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | +4 V, oggetto scelto e oggetto distrutto, basic in mano; nome, tipo, costo, priorità e bersaglio |
| GIG-BO1 | Cuffie e Testa Bassa | Azione, Legata al personaggio | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | +5 V, tre quarti dei tre tipi e del veleno periodico, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GIG-BO2 | Colpo col Cacciavite | Azione, Legata al personaggio | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | +2 V, 2 HIT e bound in mano; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GIG-BO3 | Affilare gli Utensili | Azione, Legata al personaggio | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 5 | conversione in CUT, tre quarti, corazza, scadenza, autodanno, modificatori successivi e rimozione equip; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GIG-AR1 | Disassemblare | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | distrugge l'oggetto scelto senza effetto; oggetto già sparito: nulla; nome, tipo, costo, priorità e bersaglio |
| GIG-AR2 | Chiave da Tredici | Azione, Regolare | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 V, 20 CUT attraverso la corazza; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GIG-AR3 | Preparare il Lavoro | Azione, Regolare | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 11 | 4 CUT anche a ricerca fallita, ordine di Annuncia e premi +15/+5 V; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GIG-AR4 | Secondo Bagagliaio | Azione, Regolare | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | costo 5 V, metà HIT, tre quarti CUT, POISON intero, +5 V/+5 A e scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GIG-AR5 | Lavoro Fatto Bene | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 7 | 15 senza oggetti; + 4 per oggetto, gettoni compresi (23); equipaggiamenti non contati; oggetti contati all'inizio della sua risoluzione (19); Vulnerabile (22); nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GIG-AR6 | Metodo Empirico | Azione, Regolare | [Sb27BeppeCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BeppeCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 11 | 4 CUT anche a ricerca fallita, ordine di Annuncia e premi +10/+5 V; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto; tipo e metà per difetto del danno fisso restituito da Ricatto |
| CES-BA | Messo in Conto | Azione, Base | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | +8 A, solo l’oggetto scelto, guadagno anche se distrutto, basic in mano; nome, tipo, costo, priorità e bersaglio |
| CES-BO1 | Discutiamone in Privato | Azione, Legata al personaggio | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 6 | annulla una mossa successiva che Annuncia e resta in mano; lascia risolvere una mossa senza Annuncia; annuncio già risolto o mossa già annullata: nulla; nome, tipo, costo, priorità e bersaglio; mossa bersaglio assente |
| CES-BO2 | Tecnica Manipolatoria | Azione, Legata al personaggio | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | quarti T/L arrotondati, 2 HIT, bound in mano; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| CES-BO3 | Fare il Vago | Azione, Legata al personaggio | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | tre quarti di HIT/CUT/POISON e veleno periodico, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| CES-AR1 | Opportuna Distrazione | Azione, Regolare | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 11 | costo 5 A, perdita A e 4 HIT con ricerca riuscita o fallita, premi e pavimento; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto; tipo e metà per difetto del danno fisso restituito da Ricatto |
| CES-AR2 | Buon Vecchio Ricatto | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 10 | annulla un attacco e rimanda metà del danno fisso (15); arrotonda per difetto ogni tipo (12, 5 + 5); non attacco: nulla; già risolta: nulla; già annullata: nulla; solo la parte fissa (Lazo 10, Scompenso 17); niente Rincara (Addosso 5); il danno passa per gli stati del bersaglio (Vulnerabile 22); nome, tipo, costo, priorità e bersaglio; mossa bersaglio assente |
| CES-AR3 | Copione Già Visto | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27OpponentTimingTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27OpponentTimingTest.java) | 7 | annulla una mossa ancora da risolvere; sulla carta annunciata tiene l'avversario Vulnerabile (colpo dopo: 15); su un'altra carta annulla e basta; carta annunciata già annullata: il gettone finisce senza effetto; nome, tipo, costo, priorità e bersaglio; mossa bersaglio assente o già risolta |
| CES-AR4 | Conto Salato | Azione, Regolare | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 4 | costo 5 A, 8 HIT, altri 6 su Vulnerabile ancora attivo durante la giocata del nome; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| CES-AR5 | Segreto di Pulcinella | Azione, Regolare | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 15 A, 25 HIT prima della corazza; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| CES-AR6 | Scherzo Oltre il Limite | Azione, Regolare | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 A, metà arrotondata della A residua, perdita A, HIT variabile e pavimento; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| CES-AR7 | Fiuto per gli Affari | Azione, Regolare | [Sb27SergioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SergioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | vendita senza effetto consumo o In campo, 8 H, nessun guadagno con oggetto distrutto; nome, tipo, costo, priorità e bersaglio |
| ROC-BA | Prima gli Italiani | Azione, Base | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | oggetto scelto e oggetto distrutto, cura 4 in entrambi, basic in mano; nome, tipo, costo, priorità e bersaglio |
| ROC-BO1 | Rinfrescata Arrogante | Azione, Legata al personaggio | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | quarti T/L arrotondati e 2 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| ROC-BO2 | Rialziamoci e Partite! | Azione, Legata al personaggio | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 4 | cura 4 da 1 a 30 H (30 → 34, 1 → 5), sopra 30 nulla (31); legge la salute dopo le mosse precedenti (35 − 7 + 4 = 32); a terra si risolve e non è annullata, a 0 non dà nulla; resta in mano; nome, tipo, costo, priorità e bersaglio |
| ROC-BO3 | (Dis)onore alla Bandiera | Azione, Legata al personaggio | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | +8 A, tre quarti dei tre tipi e veleno periodico, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| LR-ROC | Non Mi Hai Fatto Niente | Azione, Ultima risorsa | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27RincaraClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27RincaraClausesTest.java) | 4 | 6/10 HIT, secondo uso 8/15, ripescata a mazzo vuoto; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; mossa annullata conta, mosse avversarie escluse |
| ROC-AR1 | Nocche Sbucciate | Azione, Regolare | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 15 H rifiutato a 15, accettato a 16, 20 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| ROC-AR2 | Stoico come un Busto di Bronzo | Azione, Regolare | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | cura 4 H, dimezza solo HIT, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| ROC-AR3 | E Allora...? | Azione, Regolare | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 4 | costo 10 H, dimezza solo HIT subiti, 8 HIT all’avversario e scadenza; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| ROC-AR4 | Craniata Patriottica | Azione, Regolare | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 30 H rifiutato a 30, accettato a 31, 25 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| ROC-AR5 | La Storia la Scrivono i Vincitori | Azione, Regolare | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27AnnounceClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27AnnounceClausesTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 11 | 4 HIT in entrambi gli esiti, Craniata predefinita, +6/+2 H, promemoria e Vulnerabile; nome, tipo, costo, priorità e bersaglio; scelta esplicita e ripiego sul nome nel mazzo, annullamento e scarto dell’annuncio, scarto dell’ultima copia, Vulnerabile fino al termine anche se la giocata è annullata, rimescolamento su successo e ricerca a vuoto; tipo e metà per difetto del danno fisso restituito da Ricatto |
| ROC-AR6 | Testa Dura | Azione, Regolare | [Sb27DuccioCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27DuccioCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 35 H rifiutato a 35, accettato a 36, 30 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-01 | Afferrare | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 3 | solo l’oggetto scelto, effetto del consumo e oggetto distrutto, scarto della carta; nome, tipo, costo, priorità e bersaglio |
| GEN-02 | Furto con Destrezza | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 5 | prende l'oggetto scelto; oltre la capienza perde il proprio più vecchio; oggetto non più lì: nulla; l'effetto «In campo» passa al ladro (Conto, −4 A); nome, tipo, costo, priorità e bersaglio |
| GEN-03 | Scatto Repentino | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 4 | scambia tutti gli oggetti; oltre la capienza perde i più vecchi ricevuti; un lato vuoto: passano tutti, con il loro «In campo»; nome, tipo, costo, priorità e bersaglio |
| GEN-04 | Ce l'Hai Due Spicci? | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 6 | copia un oggetto che l'avversario tiene; uno a caso fra due; senza oggetti nulla; oltre la capienza perde il proprio più vecchio; la copia è solo tua; nome, tipo, costo, priorità e bersaglio |
| GEN-05 | GABBIANO, DUNQUE VOLIAMOTI | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 V, 20 HIT, equip positivo sì, stato negativo proprio escluso, entrambi gli stati del bersaglio; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-06 | Foratone da 28 | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 15 V e 25 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-07 | ORMALE GUARIAMOTI | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 20 V, 30 HIT prima di azzerare T/L, corazza prima dell’azzeramento; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-08 | AMMALIAMOTI DI BOTTE | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 15 V, 10 HIT e +10 T prima del veleno periodico; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-09 | STORDIAMOTI HO DETTO | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 V, −10 A col pavimento e 10 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-10 | PERMESSO SCUSA PUOI SMETTERLA | Azione, Regolare | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 4 | toglie gli equipaggiamenti, poi 8 HIT; lascia gli altri stati (6, «Guardia»); nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-11 | GENTILE IL TUO CAREZZO | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | costo 5 V, un quarto solo dei HIT, +5 A, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GEN-12 | Estrema Fretta di Alcolizzarsi | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 A, +5 V e 10 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-13 | Tecnica del Carapace Mentale | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | costo 5 A, metà HIT/CUT, POISON intero, +2 H, scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GEN-14 | Denti Stretti | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | −5 A col pavimento e +10 V; nome, tipo, costo, priorità e bersaglio |
| GEN-15 | Due Dita in Gola | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | 5 HIT a sé con corazza prima di svuotare T/L; nome, tipo, costo, priorità e bersaglio |
| GEN-16 | Fasciatura d'Emergenza | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | −5 A col pavimento e cura da 8 H; nome, tipo, costo, priorità e bersaglio |
| GEN-17 | Sputo nel Posacenere | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 5 A, 10 POISON attraverso corazza e immunità T; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-18 | Spintone | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | 8 HIT prima della corazza; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-19 | Mano Lesta | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java) | 2 | +5 A propria e −5 A al bersaglio col pavimento; nome, tipo, costo, priorità e bersaglio |
| GEN-20 | Riprendere Fiato | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | +10 H, HIT e CUT ×1,25, POISON intero, durata e scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GEN-21 | Coccio di Bottiglia | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | costo 5 V, attende il primo HIT, due conversioni nello stesso turno, corazza e scadenza; nome, tipo, costo, priorità e bersaglio; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| GEN-22 | Svegliaaah! | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 5 A, azzeramento L prima dei 4 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-23 | Sgambetto | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | costo 10 A, −10 V col pavimento, 5 HIT; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| GEN-24 | Estasi da Coca Etilene | Azione, Regolare | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java) | 3 | servono entrambe T e L, costo 10+10, 40 HIT senza periodici residui; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto |
| LR-STR | Addosso!!! | Azione, Ultima risorsa | [Sb27GenericCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27GenericCardsTest.java), [Sb27ActionSheetTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ActionSheetTest.java), [Sb27FixedDamageTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27FixedDamageTest.java), [Sb27RincaraClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27RincaraClausesTest.java) | 4 | 5/10 HIT, secondo uso 7/15, ripescata a mazzo vuoto; nome, tipo, costo, priorità e bersaglio; tipo e metà per difetto del danno fisso restituito da Ricatto; mossa annullata conta, mosse avversarie escluse |
| OGG-01 | Negroni Trovato per Terra | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +10 V/+10 L/+2 T solo al consumo |
| OGG-02 | Bionda da 66, Calda | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +10 L solo al consumo |
| OGG-03 | Doppio Malto da Discount | Oggetto | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 2 | lascia una bottiglia e dà 10 L; bottiglia a capienza piena perde la più vecchia |
| OGG-04 | Mescolone Micidiale | Oggetto | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 1 | cronologia di cinque turni: T e L bloccate, poi via tutto e veleno. Interazioni del timer con il promemoria riportate in SPA-AR3 e SPA-AR6 |
| OGG-05 | Amaro nel Bicchiere di Plastica | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +20 L/−5 A al consumo e decadimento |
| OGG-06 | Espresso della Macchinetta | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +15 A solo al consumo |
| OGG-07 | Kebab Abbandonato | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +10 H/+2 T, veleno periodico |
| OGG-08 | Acqua Minerale Sgasata | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, azzera L e +20 A al consumo |
| OGG-09 | Guanti da Officina | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | consumo, soli HIT inflitti ×1,25, scadenza, rimozione con PERMESSO; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| OGG-10 | Giubbotto di Finta Pelle | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | consumo, solo CUT subiti ×0,75, tre turni, rimozione con PERMESSO; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| OGG-11 | Casco da Cantiere | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | consumo, solo HIT subiti ×0,75, tre turni, rimozione con PERMESSO; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| OGG-12 | Pasticca Abbandonata | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +10 T solo al consumo e veleno periodico |
| OGG-13 | Posacenere di Vetro | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java), [Sb27StatusClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27StatusClausesTest.java) | 3 | attesa del primo HIT, ×1,5 per due HIT nello stesso turno, scadenza e rimozione con PERMESSO; destinatario, fattore, tipi, marcatura equipaggiamento, durata individuale e scadenza |
| OGG-14 | Ghiaccio nel Tovagliolo | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +10 H e T a zero al consumo |
| OGG-15 | Santino di San Briaco | Oggetto | [Sb27SpecialCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27SpecialCardsTest.java) | 2 | blocca la L per tre turni contando questo, poi la L agisce (L 4, A 55); un secondo Santino non allunga |
| OGG-16 | Grappa della Casa | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java) | 1 | pesca in campo, +25 L/−5 A al consumo e decadimento |
| OGG-17 | Conto del Tavolo Sei | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java), [Sb27InPlayClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27InPlayClausesTest.java) | 4 | In campo nel turno di pesca e dopo la copia, −4 A, pavimento, nessun danno, +15 V e stop dopo consumo; furto, scambio e copia; vendita, distruzione e capienza |
| OGG-18 | Sigaretta Accesa | Oggetto | [Sb27ItemCardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27ItemCardsTest.java), [Sb27InPlayClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27InPlayClausesTest.java) | 4 | In campo +2 T dopo il veleno, turno di arrivo e furto, immunità, +10 A e stop al consumo; furto, scambio e copia; vendita, distruzione e capienza |
| TOKEN | Bottiglia Spaccata | Oggetto, Token | [Sb27BottleTokenTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BottleTokenTest.java), [Sb27TokenClausesTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27TokenClausesTest.java), [Sb27BottleNameReproTest](../../../server/src/test/java/com/gsc/bm/sim/Sb27BottleNameTest.java) | 4 | creazione, tipo e binding, permanenza in campo, consumo, stati separati, HIT→CUT ×1,5, corazza, più colpi e scadenza, conversione anche su di sé prima degli stati CUT del bersaglio e rimozione con PERMESSO. Nome selezionabile rinviato a SB-28 |

### Clausole comuni e limiti del banco

- **Annuncia, tutte le 12 schede.** I casi per slot verificano entrambe le scelte, il ripiego quando solo un nome è nel mazzo, la ricerca senza risultato, la pesca e il rimescolamento. Verificano la copia mostrata, lo scarto dell'annuncio e dell'ultima copia, il turno supplementare e la giocata che chiude il promemoria anche se annullata. Per tutte le carte la scelta è validata da `Move.isValidFor` e l'effetto passa per lo stesso percorso di ricerca di `Game`. La scelta estranea alla scheda, il nome senza copie e la copia esaurita prima della ricerca sono quindi coperti da `Sb16iRulesTest#aChoiceNotPrintedOrWithoutACopyIsRefused` e `theEngineStopsIfTheDeckChangedBetweenThePlayAndTheSearch`. Visibilità pubblica e riservatezza del resto della mano e del mazzo sono provate da `RegoleD50Test#theViewPublishesTheFoundCardToEveryoneAndNothingElseOfTheHandOrDeck`.
- **Vulnerabile, tutte le 12 schede.** La ricerca genera lo stesso tipo di stato indipendentemente dalla carta che l'ha iniziata. `VulnerabilitaD69Test` verifica tutti i tipi di danno, il POISON periodico nel turno della giocata, due fattori moltiplicati con il più vecchio che scade per primo e lo scarto quando un'altra copia è ancora nel mazzo. I casi per slot verificano il fattore effettivo e il nome che soddisfa il gettone. D178–D180 coprono promemoria omonimi, rimozione col timer e giocata del nome dopo il timer. Il caso della parata ricade nello stesso trattamento della singola giocata del nome. La deroga di Copione Già Visto ha il suo caso della fase A.
- **R02, R04 e RP-1.** La convalida della carta scartabile, la permanenza delle legate in mano, la pesca e il pagamento anticipato passano dai controlli comuni di `Move` e dal turno di `Game`. `RulesConformanceTest#r02_boundDiscardsAndOnlyDrawsOne` e `r04_alertnessIsMeasuredAfterAllCosts` coprono questi percorsi. Per una legata annullata nel playground vale la prova `RegoleD50Test#aVoidedBoundDoesNotDiscard`. Per le contromosse il costo e la pesca dell'annullato sono esercitati con FAI BASTA e risolti da `Game` per tutte. L'ordine a parità è comune alle contromosse e coperto da `faiBastaAtEqualPriorityAndAlertnessFollowsTheOrderOfEntry`. Le quattro schede di anticipo esercitano ciascuna il bersaglio senza mossa, annullato dopo e già a terra con mossa più lenta. `Sb16iRulesTest` verifica che la soglia sia il gruppo di velocità calcolato con priorità e A dopo i costi, e che l'effetto di chi gioca annullato non si applichi. I modificatori delle quattro carte usano tutti quell'esito.
- **R05, R06, RP-4 e RP-6.** I danni diretti e a sé passano per `Character.inflictDamage` e `takeDamage`. Le letture e le perdite si verificano nelle prove delle carte con valori residui (compresi dispari per metà e quarti). `RulesConformanceTest#r05_damageStacksButResourceUsesFirstMatch`, `Sb27MaraCardsTest#semaforoAffectsOnlyLaterDamageAndStacksInAcquisitionOrder` e `Sb27SpazienzioCardsTest#lieveFastidioDoesNotReduceAnEarlierHitAndStacksWithAnExistingStatus` coprono l'ordine comune, compreso il mancato effetto sui colpi già risolti. `RegoleD50Test` copre il pavimento di tutte le risorse e la corazza applicata dopo gli stati, ai soli HIT, anche autoinflitti. Il motore verifica l'immunità soltanto negli effetti periodici. TOS-BA, TOS-AR2, TOS-AR4, TOS-AR5, TOS-AR7 e PG-TOS provano anche guadagno, costo, perdita, rimozione e POISON diretto nel banco.
- **Consumo, campo e capienza.** Ogni oggetto ha un caso di pesca/creazione o di effetto nel banco. Pesca, furto, scambio, copia e creazione inseriscono l'oggetto nella stessa coda limitata. Il limite viene verificato per i sette personaggi; Furto, Scatto, Spicci e Doppio Malto hanno anche casi diretti a capienza piena. Se l'oggetto del consumo è sparito, il ramo comune delle carte a dati salta solo il consumo e mantiene gli altri passi. Il caso diretto di Desiderio Incontrollabile e `ConsumeEquipStatesTest#stepsAroundConsumeStillRunWhenTheItemVanished` coprono lo stesso ramo, con effetti prima e dopo il passo; le classi Java corrispondenti hanno i riferimenti della fase A. Conto e Sigaretta provano separatamente cambio di titolare, copia, vendita, distruzione e scalzamento. Per lo scarto, il gioco consente di osservare uscita dal campo, assenza di effetto e impossibilità di consumare ancora la copia. Il modello non espone una pila separata. Per un equipaggiamento sui danni inflitti, attacco e consumo dello stesso autore nello stesso turno richiederebbero due mosse, escluse da R03. Le prove osservano i turni successivi; per equipaggiamenti su danni subiti osservano anche il turno di consumo.
- **Dati editoriali.** Rarità, titolo del personaggio e testo descrittivo sono dati del catalogo. Il personaggio nel motore è identificato dal binding. Gli oggetti si verificano in campo e al consumo poiché non dichiarano una priorità o un costo di giocata. Gli attesi di costo nelle azioni conservano esplicitamente il caso GEN-04 deliberato nella revisione della fase A (costo a zero presente nella mappa).
- **Decisioni per la regia.** Resta da recepire in SB-28 il nome selezionabile del token, già deciso dalla regia. Durante la ripresa i casi aggiunti sono coerenti con le schede. Nessuna nuova decisione richiesta.

### Verifiche di consegna

- `./scripts/build.ps1 -Task Test -Offline` verde. Server 1.486 casi, zero fallimenti, zero errori e 23 saltati. Client di debug 37 su 37. La fase B aggiunge 292 casi nella ripresa finale ai 144 già verdi. I 70 casi della fase A restano verdi.
- `check-rules.py`, `check-rules.py --candidate`, `set_catalog.py --check` e `controlla-testi.py` verdi. La bozza conserva lo SHA-256 `325926e35d371ad169848a5930924472ddfdd94a71b73a959fac0ed2dda83d8d`.
- Il diff da `000822e` è limitato alle otto nuove classi di test, al rapporto e alle tre posizioni del piano. Da `ed73a7d` valgono le eccezioni già documentate per D178–D180 e per i caricatori storici di test. `git diff --check` verde e zero link rotti nei due documenti. I quattro artefatti PDF e manifest non tracciati restano fuori dal commit.
