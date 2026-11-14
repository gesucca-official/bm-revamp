# Bozza di riferimento 1.5

**Versione 1.0 del documento — 14 novembre 2026 — consolidata, nessun cambio di comportamento** ([D96](../../set-base-decisioni.md#decisioni-del-proprietario)). Non è normativa: è la bozza del playground, che vale fino a SB-28 ([D50](../../set-base-decisioni.md#decisioni-del-proprietario)). Le regole con cui si gioca sono in [regole-playground.md](regole-playground.md); le fonti normative restano [docs/game-rules.md](../../game-rules.md) e [docs/sets/base.md](../../sets/base.md).

## Cos'è

La **bozza di riferimento** è la bozza su cui si misura e si fa la prova umana, scelta in [D92](../../set-base-decisioni.md#decisioni-del-proprietario): la **1.5**. È fatta così:

- **`bozza.json`** (`server/src/test/resources/set-base/bozza.json`, il braccio A del passo 3 di SB-16g, con la correzione 1.5 di [D90](../../set-base-decisioni.md#decisioni-del-proprietario): Gargantuesco Impatto 34 HIT, Chiave da tredici 18 CUT, Lavoro fatto bene 14 + 4 per oggetto);
- **con il Bancone del braccio B**: la carta «Il bancone regge, io pure» è quella di `bancone-b.json` (`server/src/test/resources/set-base/bancone-b.json`), che aggiunge il POISON ×0,5 per il turno ([D82](../../set-base-decisioni.md#decisioni-del-proprietario) (4); braccio B scelto in [D89](../../set-base-decisioni.md#decisioni-del-proprietario) (1)). La sostituzione è quella di `SetBaseArms.armB` (test del server): nient'altro differisce fra i due bracci;
- **formato 20 carte e 2 copie** ([D94](../../set-base-decisioni.md#decisioni-del-proprietario) (1), che conferma D1 dopo [SB-16h](../../set-base-plan.md#sb-16h--prova-esplorativa-della-dimensione-del-mazzo)); cinque starter da 20 carte regolari (120 titoli nel set, [D60](../../set-base-decisioni.md#decisioni-del-proprietario), [D79](../../set-base-decisioni.md#decisioni-del-proprietario)).

Misure e rapporti della 1.5: [correzione 1.5](../../reports/set-base/sb-16g-15-report.md), [SB-16h](../../reports/set-base/sb-16h-report.md), [ricalcolo coi criteri euristici](../../reports/set-base/criteri-euristici-1.5.md) ([D93](../../set-base-decisioni.md#decisioni-del-proprietario)). Con la soglia minima di [D95](../../set-base-decisioni.md#decisioni-del-proprietario) restano fuori Spazienzio–Piera 30,1%, Mara–Celestina 31,5% e Mara–Piera 34,8%. La bozza cambia in [SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima) (correzione 1.6); da quel momento questo documento si rigenera e il numero di versione cambia.

## Nota: il server della prova umana legge solo `bozza.json`

**Oggi il server della prova umana legge solo `bozza.json`, cioè il braccio A** (Bancone senza POISON). Per giocare il braccio B serve un file di bozza a parte, con il Bancone di `bancone-b.json`, passato con `-Draft` (`./scripts/dev.ps1 -Task Server -Bozza -Draft <file>`, [setup](../../setup.md#avvio-con-la-bozza-del-set-base-sb-8)). **La soluzione è un punto della Fase A di SB-16i**; fino ad allora la bozza giocata contro il computer è quella del braccio A.

## Come rigenerare le liste

Le liste e i testi qui sotto sono generati da [genera-bozza-di-riferimento.py](genera-bozza-di-riferimento.py), che legge (senza modificarli) `bozza.json` e `bancone-b.json`, applica la sostituzione del Bancone e scrive solo la sezione fra i due marcatori:

```bash
python docs/design/set-base/genera-bozza-di-riferimento.py --scrivi
```

Per controllare che il documento sia allineato ai due file: `python docs/design/set-base/genera-bozza-di-riferimento.py --verifica`. Senza opzioni lo script stampa la sezione e non scrive nulla. Chi cambia `bozza.json` o `bancone-b.json` rigenera la sezione nello stesso commit.

## I cinque starter

I testi sono quelli dei campi `gui` della bozza (provvisori fino a SB-25). Il numero «SPA-AR1» ecc. è lo slot della [griglia](griglia.md).

<!-- inizio generato -->

Generato da `genera-bozza-di-riferimento.py` da `bozza.json` (SHA-256 `6f705bacf1a9…`) e `bancone-b.json` (SHA-256 `9cd203a58909…`). Formato `sb-6b/1`, set `base` versione «bozza»; regole dei mazzi: 20 carte regolari, massimo 2 copie, 2 bound, basic fissa, last resort obbligatoria. Rarità: C comune, NC non comune, R rara.

Il file contiene 76 carte (basic, bound, last resort, azioni e oggetti; i personaggi sono a parte), 5 personaggi e 5 starter.

### Starter di Spazienzio de la Ucciso — `starter-spazienzio`

Personaggio: **Spazienzio de la Ucciso** (C), salute 75, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 10 · NC 9 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto, come Grab. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 V a sé. |
| bound | **SVEGLIAMOCI MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 V: Infliggi 34 danni da colpo al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 V: HIT pari a 6 + V residua / 2. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia GARGANTUESCO IMPATTO SUL TU. Se lo trovi: +25 V, +15 A. Se non lo trovi: +5 V, +5 A. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni (questo e i tre successivi); +10 V. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 V: annulla la mossa del bersaglio se arriva dopo. Niente A al bersaglio. |
| 2 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 V: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 2 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 A: HIT e CUT ricevuti ×0,6 in questo turno. +3 H a sé. |
| 1 | **Mattone del cantiere** (`base.com.MattoneDelCantiere`) | C | GEN-06 · 15 V: 24 HIT al bersaglio. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | GEN-07 · 20 V: 30 HIT al bersaglio; azzera T e L del bersaglio. |
| 1 | **Denti stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 A a sé; +10 V a sé. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | OGG-01 · Consumato: +12 V, +10 L, +3 T. |
| 1 | **Posacenere di vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, il prossimo HIT inflitto ×1,5, uso singolo. |
| 1 | **TI FACCIO SPAZIO** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia SPEDIAMOTI DUNQUE IN O-AHIO. Se lo trovi: +15 V, +15 A. Se non lo trovi: +5 V, +5 A. |

### Starter di Mara Contromano — `starter-mara`

Personaggio: **Mara Contromano** (C), salute 70, A 40; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Preso al volo** (`base.mara.PresoAlVolo`) | C | MAR-BA · Basic: −5 A a sé, poi consuma un proprio oggetto. |
| bound | **Passo stretto** (`base.mara.bound.PassoStretto`) | C | MAR-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Cambio marcia** (`base.mara.bound.CambioMarcia`) | C | MAR-BO2 · Bound: +6 A a sé. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. |
| 1 | **Cinghiata di traverso** (`base.mara.CinghiataDiTraverso`) | R | MAR-AR1 · 20 A: Infliggi danni da taglio pari a 18 più metà della tua A residua, arrotondata per difetto. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | MAR-AR2 · 15 A: 25 CUT al bersaglio. |
| 2 | **Sorpasso in curva** (`base.mara.SorpassoInCurva`) | C | MAR-AR3 · −8 A al bersaglio; 3 CUT al bersaglio. |
| 2 | **Tra due paraurti** (`base.mara.TraDueParaurti`) | NC | MAR-AR4 · 5 A: HIT e CUT ricevuti ×0,4 in questo turno. +5 A a sé. |
| 2 | **Slalom d'avvicinamento** (`base.mara.Slalom`) | NC | MAR-AR5 · Annuncia Sgommata. Se lo trovi: +15 A. Se non lo trovi: +5 A. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Sputo da posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 A: 12 POISON al bersaglio. |
| 1 | **Tartaruga sul marciapiede** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 A: HIT e CUT ricevuti ×0,6 in questo turno. +3 H a sé. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 A: ruba un oggetto lontano e lo mette vicino a sé. |
| 2 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 A. |
| 2 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 HEALTH, +3 T. |
| 1 | **Giubbotto di finta pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni (questo e i due successivi). |
| 1 | **Ti stringo la curva** (`base.mara.TiStringoLaCurva`) | NC | MAR-AR6 · Annuncia Cinghiata di traverso. Se lo trovi: +20 A. Se non lo trovi: +5 A. |

### Starter di Celestina Bucatina — `starter-tossico`

Personaggio: **Celestina Bucatina** (NC), salute 70, A 35, T 15; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 11 · NC 7 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 T a sé, poi consuma un proprio oggetto. Tutto è droga. |
| bound | **Ago Marcio e Spezzato** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: 3 CUT al bersaglio. |
| bound | **Raschiare il fondo** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +7 T a sé. |
| last resort | **L'ultima dose** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort di Celestina: 2 HIT a sé; 7 POISON e +4 T al bersaglio. |
| 2 | **Dose in preparazione** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia Tossicone Scatarrante. Se lo trovi: +10 T, +5 A. Se non lo trovi: +5 T. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 T: Infliggi 18 danni da veleno al bersaglio. Il bersaglio guadagna 5 T. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagna HEALTH pari a T / 2, poi perde tutta la T. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 T: annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **C'è del sangue nella mia droga** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 T: Trasferisci tutta la tua T residua al bersaglio e togligli l'immunità a T. Infliggi anche 12 danni da veleno. A fine turno ottieni l'immunità a T. |
| 2 | **Grab** (`com.Grab`) | C | GEN-01 · Consuma un proprio oggetto. |
| 1 | **Rincorsa dal marciapiede** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 A: +5 V a sé; 12 HIT al bersaglio. |
| 1 | **Steal** (`com.Steal`) | C | GEN-02 · 10 A: ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **Fasciatura col fazzolettaccio** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 A a sé; +8 HEALTH a sé. |
| 2 | **Pasticca trovata sul bancone** (`base.items.PasticcaTrovataSulBancone`) | C | OGG-12 · Consumato: +12 T. |
| 2 | **Panino del kebab dimenticato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +12 HEALTH, +3 T. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a T e L; +20 L, +20 T; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia C'è del sangue nella mia droga. Se lo trovi: +20 T. Se non lo trovi: +5 T. |

### Starter di Piera Ultimo Giro — `starter-pino`

Personaggio: **Piera Ultimo Giro** (NC), salute 85, A 15, L 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 13 · NC 6 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo lo finisco io** (`base.pino.QuestoLoFiniscoIo`) | NC | PIN-BA · Basic: +5 L a sé, poi consuma un proprio oggetto. |
| bound | **Cinque minuti e vado** (`base.pino.bound.CinqueMinutiEVado`) | C | PIN-BO1 · Bound: +5 L a sé. |
| bound | **Spallata al bancone** (`base.pino.bound.SpallataAlBancone`) | C | PIN-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **L'ultimo giro** (`base.pino.UltimoGiro`) | NC | LR-PIN · Last resort di Piera: 2 HIT a sé; HIT pari a 12 più la propria L residua al bersaglio, poi azzera la propria L. |
| 2 | **Testata da ultimo giro** (`base.pino.TestataDaUltimoGiro`) | C | PIN-AR1 · 5 L: 5 HIT a sé; 25 HIT al bersaglio. |
| 2 | **Estasi da Coca Etilene** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua L. Infliggi danni da colpo pari a 18 più la L spesa. |
| 2 | **Il bancone regge, io pure** (`base.pino.IlBanconeRegge`) | C | PIN-AR3 · In questo turno moltiplica per 0,5 i danni da colpo e da veleno che ricevi. Guadagni 5 L. |
| 2 | **Un altro e arrivo** (`base.pino.OffroIo`) | NC | PIN-AR4 · Annuncia Estasi da Coca Etilene. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. |
| 1 | **Rutto a distanza sociale** (`base.pino.RuttoADistanzaSociale`) | R | PIN-AR5 · 5 L: Spendi tutta la tua L residua. Il bersaglio perde A pari alla L spesa. Infliggi danni da colpo pari a 14 più il doppio della L spesa. |
| 2 | **Grab** (`com.Grab`) | C | GEN-01 · Consuma un proprio oggetto. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 1 | **Fasciatura col fazzolettaccio** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 A a sé; +8 HEALTH a sé. |
| 2 | **Amaro nel bicchiere di plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | OGG-05 · Consumato: +20 L, −5 A. |
| 2 | **Peroni da 66, calda** (`com.items.RottenBeer`) | C | OGG-02 · Consumato: +10 L. |
| 1 | **Tennents Super** (`com.items.AnotherRottenBeer`) | NC | OGG-03 · Consumato: +10 L; crea il token BrokenBeerBottle vicino a sé. |
| 1 | **Prima il brindisi** (`base.pino.PrimaIlBrindisi`) | NC | PIN-AR6 · Annuncia Rutto a distanza sociale. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. |

### Starter di Beppe Bulletta — `starter-gigi`

Personaggio: **Beppe Bulletta** (NC), salute 80, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 10 · NC 9 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo torna utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 V a sé, poi consuma un proprio oggetto. |
| bound | **Una stretta e passa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 V a sé. |
| bound | **Colpo di cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: 3 HIT al bersaglio. |
| last resort | **Last Resort: Banzai!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. |
| 2 | **Smontiamo tutto** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 V: distrugge un oggetto lontano. |
| 2 | **Chiave da tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 V: Infliggi 18 danni da taglio al bersaglio. |
| 2 | **Preparo il lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · Infliggi 4 danni da taglio al bersaglio. Annuncia Chiave da tredici. Se lo trovi: +15 V. Se non lo trovi: +5 V. |
| 1 | **Sotto il cofano** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 V: In questo turno moltiplica per 0,5 i danni da colpo e per 0,75 quelli da taglio che ricevi. Guadagni 5 V e 5 A. |
| 1 | **Lavoro fatto bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 V: Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo. |
| 2 | **Steal** (`com.Steal`) | C | GEN-02 · 10 A: ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **GABBIANO DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 V: 18 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 7 HIT al bersaglio. |
| 2 | **Guanti da officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 2 | **Giubbotto di finta pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni (questo e i due successivi). |
| 2 | **Casco da lavoro** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,8 per 3 turni. |
| 1 | **Espresso del distributore** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 A. |
| 1 | **Una stretta di prova** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · Infliggi 4 danni da taglio al bersaglio. Annuncia Lavoro fatto bene. Se lo trovi: +10 V. Se non lo trovi: +5 V. |

<!-- fine generato -->
