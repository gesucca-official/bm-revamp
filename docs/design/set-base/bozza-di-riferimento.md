# Bozza di riferimento 1.6b

**Versione 1.2 del documento — 15 novembre 2026 — bozza 1.6b** ([SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima), Fase B2, [D99](../../set-base-decisioni.md#decisioni-del-proprietario)): la 1.6 con la leva A su Mara. Versione 1.1 (15 novembre 2026, Fase B, [D97](../../set-base-decisioni.md#decisioni-del-proprietario)): la bozza 1.6, che resta nel commit 336e0ff e in [`sb-16i/round-draft.json.gz`](../../reports/set-base/sb-16i/round-draft.json.gz). Versione 1.0 (14 novembre 2026, [D96](../../set-base-decisioni.md#decisioni-del-proprietario)): la bozza 1.5. Non è normativa: è la bozza del playground, che vale fino a SB-28 ([D50](../../set-base-decisioni.md#decisioni-del-proprietario)). Le regole con cui si gioca sono in [regole-playground.md](regole-playground.md) (1.1); le fonti normative restano [docs/game-rules.md](../../game-rules.md) e [docs/sets/base.md](../../sets/base.md).

## Cos'è

La **bozza di riferimento** è la bozza su cui si misura e si fa la prova umana: dalla Fase B2 di SB-16i la **1.6b**, scritta tutta in **`bozza.json`** (`server/src/test/resources/set-base/bozza.json`), Bancone del braccio B compreso. Rispetto alla 1.5 (proposta 1.6 con le modifiche di D97, poi la leva A di D99 (1)):

- **«Annuncia X o Y»** sui dieci caricamenti: il secondo nome è il colpo dell'altro caricamento dello stesso personaggio; sceglie il giocatore quando gioca la carta, fra i nomi con almeno una copia nel mazzo; premi della 1.5 invariati; **dopo ogni ricerca il mazzo si mischia** (`rules.searchShuffle`);
- **«Gioca d'anticipo»** su Sorpasso in curva (+4 A a sé), Sgommata (in questo turno il bersaglio infligge danni ×0,8) e Cinghiata di traverso (+5 CUT); nella 1.6 erano +8 A, ×0,5 e +10 CUT (leva A, [D99](../../set-base-decisioni.md#decisioni-del-proprietario) (1));
- **«Rincara»** sulle last resort: Banzai!!! 5 (2 a sé), L'ultima dose 5 (1 a sé), L'ultimo giro 4 (1 a sé);
- **Ghiaccio nel tovagliolo** (OGG-14) a Mara al posto di Steal; **Due dita in gola** (GEN-15) a Piera al posto di un Grab e a Beppe al posto di uno Steal;
- **Il bancone regge, io pure**: HIT ×0,65 e POISON ×0,5 nel turno; **salute di Piera 80**;
- formato **20 carte e 2 copie** ([D94](../../set-base-decisioni.md#decisioni-del-proprietario) (1)).

Misura della 1.6b: [rapporto SB-16i B2](../../reports/set-base/sb-16i-b2-report.md); della 1.6: [rapporto SB-16i](../../reports/set-base/sb-16i-report.md). **La 1.5** resta riproducibile: `set-base/storico/1.5/bozza.json` (braccio A, copia byte per byte) più `bancone-b.json` (`SetBaseArms.armB`); misure e rapporti della 1.5: [correzione 1.5](../../reports/set-base/sb-16g-15-report.md), [SB-16h](../../reports/set-base/sb-16h-report.md), [ricalcolo coi criteri euristici](../../reports/set-base/criteri-euristici-1.5.md).

## Il server della prova umana

Il server col profilo `bozza` legge `bozza.json`, quindi **gioca la 1.6b così com'è misurata**, senza file a parte né `-Draft`. La nota della versione 1.0 sul braccio A è chiusa. La scelta fra due nomi, l'anticipo e il contatore di Rincara si vedono nel client dopo il passo del client di SB-16i; fino ad allora la ricerca prende il primo nome disponibile.

## Come rigenerare le liste

Le liste e i testi qui sotto sono generati da [genera-bozza-di-riferimento.py](genera-bozza-di-riferimento.py), che legge (senza modificarlo) il solo `bozza.json` e scrive solo la sezione fra i due marcatori:

```bash
python docs/design/set-base/genera-bozza-di-riferimento.py --scrivi
```

Per controllare che il documento sia allineato: `python docs/design/set-base/genera-bozza-di-riferimento.py --verifica`. Senza opzioni lo script stampa la sezione e non scrive nulla. Chi cambia `bozza.json` rigenera la sezione nello stesso commit.

## I cinque starter

I testi sono quelli dei campi `gui` della bozza (provvisori fino a SB-25). Il numero «SPA-AR1» ecc. è lo slot della [griglia](griglia.md).

<!-- inizio generato -->

Generato da `genera-bozza-di-riferimento.py` dal solo `bozza.json` (SHA-256 `1923ed9b0e71…`). Formato `sb-6b/1`, set `base` versione «bozza»; regole dei mazzi: 20 carte regolari, massimo 2 copie, 2 bound, basic fissa, last resort obbligatoria; il mazzo si mischia dopo ogni ricerca. Rarità: C comune, NC non comune, R rara.

Il file contiene 116 carte (basic, bound, last resort, azioni e oggetti; i personaggi sono a parte), 7 personaggi, 5 starter e, di prova, 21 mazzo/i (l'id che comincia per `starter-` è uno starter, ogni altro mazzo è di prova: non è nella riserva predefinita del server).

### Starter di Spazienzio de la Ucciso — `starter-spazienzio`

Personaggio: **Spazienzio de la Ucciso** (C), salute 75, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 10 · NC 9 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé. |
| bound | **SVEGLIAMOCI MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 2 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 2 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +3 [[H]] a sé. |
| 1 | **Mattone del cantiere** (`base.com.MattoneDelCantiere`) | C | GEN-06 · 15 [[V]]: 24 HIT al bersaglio. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | GEN-07 · 20 [[V]]: 30 HIT al bersaglio; Azzera [[T]] del bersaglio; Azzera [[L]] del bersaglio. |
| 1 | **Denti stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | OGG-01 · Consumato: +12 [[V]]; +10 [[L]]; +3 [[T]]. |
| 1 | **Posacenere di vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **TI FACCIO SPAZIO** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |

### Starter di Mara Contromano — `starter-mara`

Personaggio: **Mara Contromano** (C), salute 69, A 40; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 11 · NC 8 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Preso al volo** (`base.mara.PresoAlVolo`) | C | MAR-BA · Basic: −5 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Passo stretto** (`base.mara.bound.PassoStretto`) | C | MAR-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Cambio marcia** (`base.mara.bound.CambioMarcia`) | C | MAR-BO2 · Bound: +6 [[A]] a sé. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 1 | **Cinghiata di traverso** (`base.mara.CinghiataDiTraverso`) | R | MAR-AR1 · 20 [[A]]: CUT al bersaglio pari a 18 più metà della tua [[A]] residua, arrotondata per difetto. Gioca d'anticipo: 5 CUT al bersaglio. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | MAR-AR2 · 15 [[A]]: 25 CUT al bersaglio. Gioca d'anticipo: Il bersaglio: HIT, CUT e POISON inflitti ×0,8 in questo turno. |
| 2 | **Sorpasso in curva** (`base.mara.SorpassoInCurva`) | C | MAR-AR3 · Gioca d'anticipo: +4 [[A]] a sé. −8 [[A]] al bersaglio; 3 CUT al bersaglio. |
| 2 | **Tra due paraurti** (`base.mara.TraDueParaurti`) | NC | MAR-AR4 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +5 [[A]] a sé. |
| 2 | **Slalom d'avvicinamento** (`base.mara.Slalom`) | NC | MAR-AR5 · Annuncia «Sgommata» o «Cinghiata di traverso». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Sputo da posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 12 POISON al bersaglio. |
| 1 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +3 [[H]] a sé. |
| 2 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 2 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Giubbotto di finta pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni. |
| 1 | **Ti stringo la curva** (`base.mara.TiStringoLaCurva`) | NC | MAR-AR6 · Annuncia «Cinghiata di traverso» o «Sgommata». Se lo trovi: +20 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 1 | **Ghiaccio nel tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | OGG-14 · Consumato: +10 [[H]]; Azzera [[T]]. |

### Starter di Celestina Bucatina — `starter-tossico`

Personaggio: **Celestina Bucatina** (NC), salute 66, A 35, T 15; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 11 · NC 7 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Ago Marcio e Spezzato** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Raschiare il fondo** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +7 [[T]] a sé. |
| last resort | **L'ultima dose** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 7 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5 (1 a sé). |
| 2 | **Dose in preparazione** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «C'è del sangue nella mia droga». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 18 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **C'è del sangue nella mia droga** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 12 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 2 | **Grab** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Rincorsa dal marciapiede** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 12 HIT al bersaglio. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **Fasciatura col fazzolettaccio** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Pasticca trovata sul bancone** (`base.items.PasticcaTrovataSulBancone`) | C | OGG-12 · Consumato: +12 [[T]]. |
| 2 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «C'è del sangue nella mia droga» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |

### Starter di Piera Ultimo Giro — `starter-pino`

Personaggio: **Piera Ultimo Giro** (NC), salute 82, A 15, L 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo lo finisco io** (`base.pino.QuestoLoFiniscoIo`) | NC | PIN-BA · Basic: +15 [[L]] a sé; consuma un proprio oggetto. |
| bound | **Cinque minuti e vado** (`base.pino.bound.CinqueMinutiEVado`) | C | PIN-BO1 · Bound: +5 [[L]] a sé. |
| bound | **Spallata al bancone** (`base.pino.bound.SpallataAlBancone`) | C | PIN-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **L'ultimo giro** (`base.pino.UltimoGiro`) | NC | LR-PIN · Last resort: 2 HIT a sé. Spendi tutta la tua [[L]] residua. 12 HIT al bersaglio, più la [[L]] spesa. Rincara 4 (1 a sé). |
| 2 | **Testata da ultimo giro** (`base.pino.TestataDaUltimoGiro`) | C | PIN-AR1 · 5 [[L]]: 5 HIT a sé; 25 HIT al bersaglio. |
| 2 | **Estasi da Coca Etilene** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a 10 più il doppio della [[L]] spesa. |
| 2 | **Il bancone regge, io pure** (`base.pino.IlBanconeRegge`) | C | PIN-AR3 · HIT ricevuto ×0,65 in questo turno; POISON ricevuto ×0,5 in questo turno; +5 [[L]] a sé. |
| 2 | **Un altro e arrivo** (`base.pino.OffroIo`) | NC | PIN-AR4 · Annuncia «Estasi da Coca Etilene» o «Rutto a distanza sociale». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Rutto a distanza sociale** (`base.pino.RuttoADistanzaSociale`) | R | PIN-AR5 · 5 [[L]]: Spendi tutta la tua [[L]] residua. Il bersaglio perde [[A]] pari alla [[L]] spesa. Infliggi danni da colpo pari a 14 più il doppio della [[L]] spesa. |
| 1 | **Grab** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 1 | **Fasciatura col fazzolettaccio** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Amaro nel bicchiere di plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | OGG-05 · Consumato: +20 [[L]]; −5 [[A]]. |
| 2 | **Peroni da 66, calda** (`com.items.RottenBeer`) | C | OGG-02 · Consumato: +10 [[L]]. |
| 1 | **Tennents Super** (`com.items.AnotherRottenBeer`) | NC | OGG-03 · Consumato: +10 [[L]]; crea il token BrokenBeerBottle vicino a sé. |
| 1 | **Prima il brindisi** (`base.pino.PrimaIlBrindisi`) | NC | PIN-AR6 · Annuncia «Rutto a distanza sociale» o «Estasi da Coca Etilene». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Due dita in gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |

### Starter di Beppe Bulletta — `starter-gigi`

Personaggio: **Beppe Bulletta** (NC), salute 80, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 14 titoli (C 9 · NC 10 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo torna utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Una stretta e passa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé. |
| bound | **Colpo di cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Smontiamo tutto** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 18 CUT al bersaglio. |
| 2 | **Preparo il lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da tredici» o «Lavoro fatto bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Sotto il cofano** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro fatto bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Guanti da officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 2 | **Giubbotto di finta pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni. |
| 2 | **Casco da lavoro** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 1 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Una stretta di prova** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · 4 CUT al bersaglio. Annuncia «Lavoro fatto bene» o «Chiave da tredici». Se lo trovi: +10 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Due dita in gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |

### Mazzo di prova di Sergio Sommerso — `prova-sergio`

Personaggio: **Sergio Sommerso** (R), salute 85, A 30, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 7 · NC 11 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Lo metto in conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +7 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Battutina** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: 3 HIT al bersaglio. |
| bound | **Fare il vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT e CUT ricevuti ×0,75 in questo turno. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Oh, guarda là** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Lo sapevo** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Lo sanno tutti** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 24 HIT al bersaglio. |
| 1 | **Malelingue** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 1 | **STORDIAMOTI HO DETTO** (`bruiser.StunningBlow`) | NC | GEN-09 · 10 [[V]]: −10 [[A]] al bersaglio; 12 HIT al bersaglio. |
| 2 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +3 [[H]] a sé. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 1 | **Santino della portinaia** (`base.items.SantinoDellaPortinaia`) | R | OGG-15 · Consumato: immunità all'effetto periodico di [[L]] per 3 turni. |
| 2 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Acqua in faccia** (`base.com.AcquaInFaccia`) | NC | GEN-22 · 5 [[A]]: Azzera [[L]] del bersaglio; 3 HIT al bersaglio. |
| 2 | **Lo rivendo** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |

### Mazzo di prova di Duccio Braccio Teso — `prova-duccio`

Personaggio: **Duccio Braccio Teso** (R), salute 115, A 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Prima io** (`base.rocco.PrimaIo`) | R | ROC-BA · Basic: consuma un proprio oggetto; +3 [[H]] a sé. |
| bound | **Colpetto** (`base.rocco.bound.Colpetto`) | NC | ROC-BO1 · Bound: 3 HIT al bersaglio. |
| bound | **Alzo la voce** (`base.rocco.bound.AlzoLaVoce`) | NC | ROC-BO3 · Bound: +8 [[A]] a sé. |
| last resort | **Ne ho prese di peggio** (`base.rocco.NeHoPreseDiPeggio`) | R | LR-ROC · Last resort: 6 HIT a sé; 12 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Te lo spiego io** (`base.rocco.TeLoSpiegoIo`) | NC | ROC-AR5 · 4 HIT al bersaglio. Annuncia «Capocciata» o «Testa dura». Se lo trovi: +6 [[H]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +2 [[H]]. |
| 2 | **Capocciata** (`base.rocco.Capocciata`) | NC | ROC-AR4 · 28 [[H]]: 26 HIT al bersaglio. |
| 1 | **Testa dura** (`base.rocco.TestaDura`) | R | ROC-AR6 · 33 [[H]]: 30 HIT al bersaglio. |
| 2 | **Nocche sbucciate** (`base.rocco.NoccheSbucciate`) | C | ROC-AR1 · 16 [[H]]: 18 HIT al bersaglio. |
| 2 | **Incassare** (`base.rocco.Incassare`) | C | ROC-AR2 · HIT ricevuto ×0,5 in questo turno; +3 [[H]] a sé. |
| 2 | **E allora?** (`base.rocco.EAllora`) | NC | ROC-AR3 · 10 [[H]]: HIT ricevuto ×0,5 in questo turno; 8 HIT al bersaglio. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Sputo da posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 12 POISON al bersaglio. |
| 1 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +3 [[H]] a sé. |
| 1 | **Fasciatura col fazzolettaccio** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Ghiaccio nel tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | OGG-14 · Consumato: +10 [[H]]; Azzera [[T]]. |

### Mazzo di prova di Spazienzio de la Ucciso — `prova-b1-spazienzio`

Personaggio: **Spazienzio de la Ucciso** (C), salute 75, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 7 · NC 10 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé. |
| bound | **SVEGLIAMOCI MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 1 | **Denti stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | OGG-01 · Consumato: +12 [[V]]; +10 [[L]]; +3 [[T]]. |
| 1 | **Posacenere di vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **TI FACCIO SPAZIO** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **Non sento niente** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Colpo allo stomaco** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **Coccio di bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |

### Mazzo di prova di Mara Contromano — `prova-b1-mara`

Personaggio: **Mara Contromano** (C), salute 69, A 40; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 9 · NC 6 · R 5).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Preso al volo** (`base.mara.PresoAlVolo`) | C | MAR-BA · Basic: −5 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Passo stretto** (`base.mara.bound.PassoStretto`) | C | MAR-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Cambio marcia** (`base.mara.bound.CambioMarcia`) | C | MAR-BO2 · Bound: +6 [[A]] a sé. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 1 | **Cinghiata di traverso** (`base.mara.CinghiataDiTraverso`) | R | MAR-AR1 · 20 [[A]]: CUT al bersaglio pari a 18 più metà della tua [[A]] residua, arrotondata per difetto. Gioca d'anticipo: 5 CUT al bersaglio. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | MAR-AR2 · 15 [[A]]: 25 CUT al bersaglio. Gioca d'anticipo: Il bersaglio: HIT, CUT e POISON inflitti ×0,8 in questo turno. |
| 2 | **Sorpasso in curva** (`base.mara.SorpassoInCurva`) | C | MAR-AR3 · Gioca d'anticipo: +4 [[A]] a sé. −8 [[A]] al bersaglio; 3 CUT al bersaglio. |
| 2 | **Tra due paraurti** (`base.mara.TraDueParaurti`) | NC | MAR-AR4 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +5 [[A]] a sé. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Sputo da posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 12 POISON al bersaglio. |
| 2 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Ti stringo la curva** (`base.mara.TiStringoLaCurva`) | NC | MAR-AR6 · Annuncia «Cinghiata di traverso» o «Sgommata». Se lo trovi: +20 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 1 | **Ghiaccio nel tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | OGG-14 · Consumato: +10 [[H]]; Azzera [[T]]. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Elemosina molesta** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Secondo fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +12 [[H]] a sé. |

### Mazzo di prova di Celestina Bucatina — `prova-b1-celestina`

Personaggio: **Celestina Bucatina** (NC), salute 66, A 35, T 15; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 7 · NC 7 · R 6).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Ago Marcio e Spezzato** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Raschiare il fondo** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +7 [[T]] a sé. |
| last resort | **L'ultima dose** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 7 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5 (1 a sé). |
| 2 | **Dose in preparazione** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «C'è del sangue nella mia droga». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 18 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **C'è del sangue nella mia droga** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 12 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 1 | **Grab** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Rincorsa dal marciapiede** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 12 HIT al bersaglio. |
| 2 | **Pasticca trovata sul bancone** (`base.items.PasticcaTrovataSulBancone`) | C | OGG-12 · Consumato: +12 [[T]]. |
| 1 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «C'è del sangue nella mia droga» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Elemosina molesta** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Secondo fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +12 [[H]] a sé. |

### Mazzo di prova di Piera Ultimo Giro — `prova-b1-piera`

Personaggio: **Piera Ultimo Giro** (NC), salute 82, A 15, L 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 8 · NC 9 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo lo finisco io** (`base.pino.QuestoLoFiniscoIo`) | NC | PIN-BA · Basic: +15 [[L]] a sé; consuma un proprio oggetto. |
| bound | **Cinque minuti e vado** (`base.pino.bound.CinqueMinutiEVado`) | C | PIN-BO1 · Bound: +5 [[L]] a sé. |
| bound | **Spallata al bancone** (`base.pino.bound.SpallataAlBancone`) | C | PIN-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **L'ultimo giro** (`base.pino.UltimoGiro`) | NC | LR-PIN · Last resort: 2 HIT a sé. Spendi tutta la tua [[L]] residua. 12 HIT al bersaglio, più la [[L]] spesa. Rincara 4 (1 a sé). |
| 2 | **Testata da ultimo giro** (`base.pino.TestataDaUltimoGiro`) | C | PIN-AR1 · 5 [[L]]: 5 HIT a sé; 25 HIT al bersaglio. |
| 2 | **Estasi da Coca Etilene** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a 10 più il doppio della [[L]] spesa. |
| 2 | **Il bancone regge, io pure** (`base.pino.IlBanconeRegge`) | C | PIN-AR3 · HIT ricevuto ×0,65 in questo turno; POISON ricevuto ×0,5 in questo turno; +5 [[L]] a sé. |
| 2 | **Un altro e arrivo** (`base.pino.OffroIo`) | NC | PIN-AR4 · Annuncia «Estasi da Coca Etilene» o «Rutto a distanza sociale». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Rutto a distanza sociale** (`base.pino.RuttoADistanzaSociale`) | R | PIN-AR5 · 5 [[L]]: Spendi tutta la tua [[L]] residua. Il bersaglio perde [[A]] pari alla [[L]] spesa. Infliggi danni da colpo pari a 14 più il doppio della [[L]] spesa. |
| 2 | **Amaro nel bicchiere di plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | OGG-05 · Consumato: +20 [[L]]; −5 [[A]]. |
| 1 | **Tennents Super** (`com.items.AnotherRottenBeer`) | NC | OGG-03 · Consumato: +10 [[L]]; crea il token BrokenBeerBottle vicino a sé. |
| 1 | **Prima il brindisi** (`base.pino.PrimaIlBrindisi`) | NC | PIN-AR6 · Annuncia «Rutto a distanza sociale» o «Estasi da Coca Etilene». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Due dita in gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |
| 2 | **Grappa della casa** (`base.items.GrappaDellaCasa`) | R | OGG-16 · Consumato: +25 [[L]]; −5 [[A]]. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Mezza minerale sgasata** (`base.items.MezzaMineraleSgasata`) | NC | OGG-08 · Consumato: Azzera [[L]]; +20 [[A]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-beppe`

Personaggio: **Beppe Bulletta** (NC), salute 80, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 6 · NC 11 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo torna utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Una stretta e passa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé. |
| bound | **Colpo di cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Smontiamo tutto** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 18 CUT al bersaglio. |
| 2 | **Preparo il lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da tredici» o «Lavoro fatto bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Sotto il cofano** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro fatto bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 2 | **Guanti da officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 1 | **Casco da lavoro** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 1 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Una stretta di prova** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · 4 CUT al bersaglio. Annuncia «Lavoro fatto bene» o «Chiave da tredici». Se lo trovi: +10 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 2 | **Colpo allo stomaco** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **Maleducazione** (`bruiser.BadEducation`) | NC | GEN-10 · 5 [[V]]: Toglie gli equip al bersaglio; 8 HIT al bersaglio. |
| 2 | **Coccio di bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |

### Mazzo di prova di Sergio Sommerso — `prova-b1-sergio`

Personaggio: **Sergio Sommerso** (R), salute 85, A 30, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 6 · NC 11 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Lo metto in conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +7 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Battutina** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: 3 HIT al bersaglio. |
| bound | **Fare il vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT e CUT ricevuti ×0,75 in questo turno. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Oh, guarda là** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Lo sapevo** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Lo sanno tutti** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 24 HIT al bersaglio. |
| 1 | **Malelingue** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 2 | **Lo rivendo** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **Non sento niente** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Elemosina molesta** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |

### Mazzo di prova di Duccio Braccio Teso — `prova-b1-duccio`

Personaggio: **Duccio Braccio Teso** (R), salute 115, A 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 10 · NC 7 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Prima io** (`base.rocco.PrimaIo`) | R | ROC-BA · Basic: consuma un proprio oggetto; +3 [[H]] a sé. |
| bound | **Colpetto** (`base.rocco.bound.Colpetto`) | NC | ROC-BO1 · Bound: 3 HIT al bersaglio. |
| bound | **Alzo la voce** (`base.rocco.bound.AlzoLaVoce`) | NC | ROC-BO3 · Bound: +8 [[A]] a sé. |
| last resort | **Ne ho prese di peggio** (`base.rocco.NeHoPreseDiPeggio`) | R | LR-ROC · Last resort: 6 HIT a sé; 12 HIT al bersaglio. Rincara 5 (2 a sé). |
| 1 | **Te lo spiego io** (`base.rocco.TeLoSpiegoIo`) | NC | ROC-AR5 · 4 HIT al bersaglio. Annuncia «Capocciata» o «Testa dura». Se lo trovi: +6 [[H]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +2 [[H]]. |
| 2 | **Capocciata** (`base.rocco.Capocciata`) | NC | ROC-AR4 · 28 [[H]]: 26 HIT al bersaglio. |
| 1 | **Testa dura** (`base.rocco.TestaDura`) | R | ROC-AR6 · 33 [[H]]: 30 HIT al bersaglio. |
| 2 | **Nocche sbucciate** (`base.rocco.NoccheSbucciate`) | C | ROC-AR1 · 16 [[H]]: 18 HIT al bersaglio. |
| 2 | **Incassare** (`base.rocco.Incassare`) | C | ROC-AR2 · HIT ricevuto ×0,5 in questo turno; +3 [[H]] a sé. |
| 2 | **E allora?** (`base.rocco.EAllora`) | NC | ROC-AR3 · 10 [[H]]: HIT ricevuto ×0,5 in questo turno; 8 HIT al bersaglio. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Sputo da posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 12 POISON al bersaglio. |
| 2 | **Secondo fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +12 [[H]] a sé. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Mezza minerale sgasata** (`base.items.MezzaMineraleSgasata`) | NC | OGG-08 · Consumato: Azzera [[L]]; +20 [[A]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-equip`

Personaggio: **Beppe Bulletta** (NC), salute 80, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 4 · NC 13 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo torna utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Una stretta e passa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé. |
| bound | **Colpo di cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Smontiamo tutto** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 18 CUT al bersaglio. |
| 2 | **Preparo il lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da tredici» o «Lavoro fatto bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Sotto il cofano** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro fatto bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo. |
| 1 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Guanti da officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 1 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Una stretta di prova** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · 4 CUT al bersaglio. Annuncia «Lavoro fatto bene» o «Chiave da tredici». Se lo trovi: +10 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 2 | **Coccio di bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Posacenere di vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Maleducazione** (`bruiser.BadEducation`) | NC | GEN-10 · 5 [[V]]: Toglie gli equip al bersaglio; 8 HIT al bersaglio. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-estasi`

Personaggio: **Beppe Bulletta** (NC), salute 80, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 8 · NC 9 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo torna utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Una stretta e passa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé. |
| bound | **Colpo di cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Smontiamo tutto** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Preparo il lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da tredici» o «Lavoro fatto bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Sotto il cofano** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro fatto bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Guanti da officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 2 | **Giubbotto di finta pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni. |
| 2 | **Casco da lavoro** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 1 | **Due dita in gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |
| 2 | **Estasi da Coca Etilene** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a 10 più il doppio della [[L]] spesa. |
| 2 | **Grappa della casa** (`base.items.GrappaDellaCasa`) | R | OGG-16 · Consumato: +25 [[L]]; −5 [[A]]. |

### Mazzo di prova di Spazienzio de la Ucciso — `prova-b2-spazienzio`

Personaggio: **Spazienzio de la Ucciso** (C), salute 75, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 5 · NC 12 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé. |
| bound | **SVEGLIAMOCI MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 1 | **Denti stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 1 | **Posacenere di vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **TI FACCIO SPAZIO** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **Non sento niente** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Colpo allo stomaco** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **Coccio di bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Conto del tavolo sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −3 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b2-beppe`

Personaggio: **Beppe Bulletta** (NC), salute 80, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 5 · NC 12 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo torna utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Una stretta e passa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé. |
| bound | **Colpo di cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Smontiamo tutto** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 18 CUT al bersaglio. |
| 2 | **Preparo il lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da tredici» o «Lavoro fatto bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Sotto il cofano** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro fatto bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 2 | **Guanti da officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 1 | **Casco da lavoro** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 2 | **Colpo allo stomaco** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **Maleducazione** (`bruiser.BadEducation`) | NC | GEN-10 · 5 [[V]]: Toglie gli equip al bersaglio; 8 HIT al bersaglio. |
| 2 | **Coccio di bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Conto del tavolo sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −3 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-sergio-conto`

Personaggio: **Sergio Sommerso** (R), salute 85, A 30, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 13 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Lo metto in conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +7 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Battutina** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: 3 HIT al bersaglio. |
| bound | **Fare il vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT e CUT ricevuti ×0,75 in questo turno. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Oh, guarda là** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Lo sapevo** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Lo sanno tutti** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 24 HIT al bersaglio. |
| 1 | **Malelingue** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Lo rivendo** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **Non sento niente** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Elemosina molesta** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Conto del tavolo sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −3 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-sergio-sigaretta`

Personaggio: **Sergio Sommerso** (R), salute 85, A 30, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 11 · R 5).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Lo metto in conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +7 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Battutina** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: 3 HIT al bersaglio. |
| bound | **Fare il vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT e CUT ricevuti ×0,75 in questo turno. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Oh, guarda là** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Lo sapevo** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Lo sanno tutti** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 24 HIT al bersaglio. |
| 1 | **Malelingue** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Lo rivendo** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **Non sento niente** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Elemosina molesta** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Sigaretta accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b2-celestina`

Personaggio: **Celestina Bucatina** (NC), salute 66, A 35, T 15; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 5 · NC 7 · R 8).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Ago Marcio e Spezzato** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Raschiare il fondo** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +7 [[T]] a sé. |
| last resort | **L'ultima dose** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 7 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5 (1 a sé). |
| 2 | **Dose in preparazione** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «C'è del sangue nella mia droga». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 18 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **C'è del sangue nella mia droga** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 12 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 1 | **Grab** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Rincorsa dal marciapiede** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 12 HIT al bersaglio. |
| 1 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «C'è del sangue nella mia droga» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Elemosina molesta** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Secondo fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +12 [[H]] a sé. |
| 2 | **Sigaretta accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b2-rischio9`

Personaggio: **Celestina Bucatina** (NC), salute 66, A 35, T 15; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 5 · NC 9 · R 6).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Ago Marcio e Spezzato** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Raschiare il fondo** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +7 [[T]] a sé. |
| last resort | **L'ultima dose** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 7 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5 (1 a sé). |
| 2 | **Dose in preparazione** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «C'è del sangue nella mia droga». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 18 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **C'è del sangue nella mia droga** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 12 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 1 | **Grab** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Rincorsa dal marciapiede** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 12 HIT al bersaglio. |
| 1 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «C'è del sangue nella mia droga» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Secondo fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +12 [[H]] a sé. |
| 2 | **Sigaretta accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |
| 2 | **Scatto Repentino** (`base.com.ShuffleFeet`) | NC | GEN-03 · Scambia tutti gli oggetti col bersaglio, rispettando le capacità. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-rischio10`

Personaggio: **Sergio Sommerso** (R), salute 85, A 30, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 15 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Lo metto in conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +7 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Battutina** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: 3 HIT al bersaglio. |
| bound | **Fare il vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT e CUT ricevuti ×0,75 in questo turno. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Oh, guarda là** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Lo sapevo** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Lo sanno tutti** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 24 HIT al bersaglio. |
| 1 | **Malelingue** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Lo rivendo** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **Non sento niente** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Conto del tavolo sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −3 [[A]]. Consumato: +15 [[V]]. |
| 2 | **Scatto Repentino** (`base.com.ShuffleFeet`) | NC | GEN-03 · Scambia tutti gli oggetti col bersaglio, rispettando le capacità. |

### Mazzo di prova di Spazienzio de la Ucciso — `iso-b2-conto`

Personaggio: **Spazienzio de la Ucciso** (C), salute 75, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 8 · NC 11 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé. |
| bound | **SVEGLIAMOCI MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 2 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 2 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +3 [[H]] a sé. |
| 1 | **Mattone del cantiere** (`base.com.MattoneDelCantiere`) | C | GEN-06 · 15 [[V]]: 24 HIT al bersaglio. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | GEN-07 · 20 [[V]]: 30 HIT al bersaglio; Azzera [[T]] del bersaglio; Azzera [[L]] del bersaglio. |
| 1 | **Denti stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 1 | **Posacenere di vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **TI FACCIO SPAZIO** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **Conto del tavolo sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −3 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Celestina Bucatina — `iso-b2-sigaretta`

Personaggio: **Celestina Bucatina** (NC), salute 66, A 35, T 15; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 9 · NC 7 · R 4).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Ago Marcio e Spezzato** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Raschiare il fondo** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +7 [[T]] a sé. |
| last resort | **L'ultima dose** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 7 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5 (1 a sé). |
| 2 | **Dose in preparazione** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «C'è del sangue nella mia droga». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 18 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **C'è del sangue nella mia droga** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 12 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 2 | **Grab** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Rincorsa dal marciapiede** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 12 HIT al bersaglio. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **Fasciatura col fazzolettaccio** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 [[H]]; +3 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «C'è del sangue nella mia droga» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Sigaretta accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

### Mazzo di prova di Sergio Sommerso — `iso-b2-sigaretta-sergio`

Personaggio: **Sergio Sommerso** (R), salute 85, A 30, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 5 · NC 11 · R 4).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Lo metto in conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +7 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Battutina** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: 3 HIT al bersaglio. |
| bound | **Fare il vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT e CUT ricevuti ×0,75 in questo turno. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Oh, guarda là** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Lo sapevo** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Lo sanno tutti** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 24 HIT al bersaglio. |
| 1 | **Malelingue** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 1 | **STORDIAMOTI HO DETTO** (`bruiser.StunningBlow`) | NC | GEN-09 · 10 [[V]]: −10 [[A]] al bersaglio; 12 HIT al bersaglio. |
| 2 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +3 [[H]] a sé. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 1 | **Santino della portinaia** (`base.items.SantinoDellaPortinaia`) | R | OGG-15 · Consumato: immunità all'effetto periodico di [[L]] per 3 turni. |
| 1 | **Acqua in faccia** (`base.com.AcquaInFaccia`) | NC | GEN-22 · 5 [[A]]: Azzera [[L]] del bersaglio; 3 HIT al bersaglio. |
| 2 | **Lo rivendo** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **Sigaretta accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

<!-- fine generato -->
