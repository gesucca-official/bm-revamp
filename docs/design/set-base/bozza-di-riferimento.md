# Bozza di riferimento 1.6b

**Versione 1.4 del documento — 22 novembre 2026 — bozza congelata 1.7 ([SB-24](../../set-base-plan.md#sb-24--flavour-finale-e-congelamento), [D166](../../set-base-decisioni.md#decisioni-del-proprietario)).** Stessi numeri della bozza di [D162](../../set-base-decisioni.md#decisioni-del-proprietario); cambiano nomi, flavour (nella [griglia](griglia.md#nomi-flavour-e-illustrazioni-sb-24)) e la rarità P dei personaggi. Le liste generate qui sotto portano i nomi nuovi; il riepilogo storico che segue resta con i nomi del suo momento.

**Versione 1.3 del documento — 20 novembre 2026 — bozza SB-21g.** Revisione di importi e fattori con D158 e controllo del bilanciamento. I valori correnti sono nelle liste generate e nella [griglia](griglia.md). [Rapporto SB-21g](../../reports/set-base/sb-21g-report.md).

**Versione 1.2 del documento — 15 novembre 2026 — bozza 1.6b** ([SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima), Fase B2, [D99](../../set-base-decisioni.md#decisioni-del-proprietario)): la 1.6 con la leva A su Mara. Versione 1.1 (15 novembre 2026, Fase B, [D97](../../set-base-decisioni.md#decisioni-del-proprietario)): la bozza 1.6, che resta nel commit 336e0ff e in [`sb-16i/round-draft.json.gz`](../../reports/set-base/sb-16i/round-draft.json.gz). Versione 1.0 (14 novembre 2026, [D96](../../set-base-decisioni.md#decisioni-del-proprietario)): la bozza 1.5. Non è normativa: è la bozza del playground, che vale fino a SB-28 ([D50](../../set-base-decisioni.md#decisioni-del-proprietario)). Le regole con cui si gioca sono in [regole-playground.md](regole-playground.md) (1.1); le fonti normative restano [docs/game-rules.md](../../game-rules.md) e [docs/sets/base.md](../../sets/base.md).

## Cos'è

La **bozza di riferimento** è la bozza su cui si misura e si fa la prova umana: dalla Fase B2 di SB-16i la **1.6b**, scritta tutta in **`bozza.json`** (`server/src/test/resources/set-base/bozza.json`), Bancone del braccio B compreso. Il riepilogo seguente descrive il passaggio storico dalla 1.5 alla 1.6b (proposta 1.6 con le modifiche di D97, poi la leva A di D99 (1)):

- **«Annuncia X o Y»** sui dieci caricamenti: il secondo nome è il colpo dell'altro caricamento dello stesso personaggio; sceglie il giocatore quando gioca la carta, fra i nomi con almeno una copia nel mazzo; premi della 1.5 invariati; **dopo ogni ricerca il mazzo si mischia** (`rules.searchShuffle`);
- **«Gioca d'anticipo»** su Sorpasso in curva (+4 A a sé), Sgommata (in questo turno il bersaglio infligge danni ×0,8) e Cinghiata di traverso (+5 CUT); nella 1.6 erano +8 A, ×0,5 e +10 CUT (leva A, [D99](../../set-base-decisioni.md#decisioni-del-proprietario) (1));
- **«Rincara»** sulle last resort: Banzai!!! 5 (2 a sé), L'ultima dose 5 (1 a sé), L'ultimo giro 4 (1 a sé);
- **Ghiaccio nel tovagliolo** (OGG-14) a Mara al posto di Steal; **Due dita in gola** (GEN-15) a Piera al posto di un Grab e a Beppe al posto di uno Steal;
- **Il bancone regge, io pure**: HIT ×0,65 e POISON ×0,5 nel turno; **salute di Piera 80**;
- formato **20 carte e 2 copie** ([D94](../../set-base-decisioni.md#decisioni-del-proprietario) (1)).

Misura della 1.6b: [rapporto SB-16i B2](../../reports/set-base/sb-16i-b2-report.md); della 1.6: [rapporto SB-16i](../../reports/set-base/sb-16i-report.md). **La 1.5** resta riproducibile: `set-base/storico/1.5/bozza.json` (braccio A, copia byte per byte) più `bancone-b.json` (`SetBaseArms.armB`); misure e rapporti della 1.5: [correzione 1.5](../../reports/set-base/sb-16g-15-report.md), [SB-16h](../../reports/set-base/sb-16h-report.md), [ricalcolo coi criteri euristici](../../reports/set-base/criteri-euristici-1.5.md).

## Il server della prova umana

Il server col profilo `bozza` legge `bozza.json`, quindi **gioca la bozza SB-21g così com'è misurata**, senza file a parte né `-Draft`. La nota della versione 1.0 sul braccio A è chiusa. La scelta fra due nomi, l'anticipo e il contatore di Rincara si vedono nel client dopo il passo del client di SB-16i; fino ad allora la ricerca prende il primo nome disponibile.

## Come rigenerare le liste

Le liste e i testi qui sotto sono generati da [genera-bozza-di-riferimento.py](genera-bozza-di-riferimento.py), che legge (senza modificarlo) il solo `bozza.json` e scrive solo la sezione fra i due marcatori:

```bash
python docs/design/set-base/genera-bozza-di-riferimento.py --scrivi
```

Per controllare che il documento sia allineato: `python docs/design/set-base/genera-bozza-di-riferimento.py --verifica`. Senza opzioni lo script stampa la sezione e non scrive nulla. Chi cambia `bozza.json` rigenera la sezione nello stesso commit.

## I cinque starter

I testi sono quelli dei campi `gui` della bozza (provvisori fino a SB-25). Il numero «SPA-AR1» ecc. è lo slot della [griglia](griglia.md).

<!-- inizio generato -->

Generato da `genera-bozza-di-riferimento.py` dal solo `bozza.json` (SHA-256 `65bc46cf0b33…`). Formato `sb-6b/1`, set `base` versione «1.7»; regole dei mazzi: 20 carte regolari, massimo 2 copie, 2 bound, basic fissa, last resort obbligatoria; il mazzo si mischia dopo ogni ricerca. Rarità: C comune, NC non comune, R rara.

Il file contiene 117 carte (basic, bound, last resort, azioni e oggetti; i personaggi sono a parte), 7 personaggi, 5 starter e, di prova, 21 mazzo/i (l'id che comincia per `starter-` è uno starter, ogni altro mazzo è di prova: non è nella riserva predefinita del server).

### Starter di SPAZIENZIO DE LA UCCISO — `starter-spazienzio`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 10 · NC 9 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 2 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 20 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +2 [[H]] a sé. |
| 1 | **Foratone da 28** (`base.com.MattoneDelCantiere`) | C | GEN-06 · 15 [[V]]: 25 HIT al bersaglio. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | GEN-07 · 20 [[V]]: 30 HIT al bersaglio; Azzera [[T]] del bersaglio; Azzera [[L]] del bersaglio. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | OGG-01 · Consumato: +10 [[V]]; +10 [[L]]; +2 [[T]]. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |

### Starter di Mara Contromano — `starter-mara`

Personaggio: **Mara Contromano** (P), salute 65, A 45; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 11 · NC 8 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Requisire al Volo** (`base.mara.PresoAlVolo`) | C | MAR-BA · Basic: −5 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Sventare l'Assassinio** (`base.mara.bound.PassoStretto`) | C | MAR-BO1 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 CUT al bersaglio. |
| bound | **Semaforo Rosso** (`base.mara.bound.CambioMarcia`) | C | MAR-BO2 · Bound: +5 [[A]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 1 | **Lazo del Rider** (`base.mara.CinghiataDiTraverso`) | R | MAR-AR1 · 20 [[A]]: CUT al bersaglio pari a 20 più metà della tua [[A]] residua, arrotondata per difetto. Gioca d'anticipo: 5 CUT al bersaglio. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | MAR-AR2 · 15 [[A]]: 25 CUT al bersaglio. Gioca d'anticipo: Il bersaglio: HIT, CUT e POISON inflitti ×0,75 in questo turno. |
| 2 | **Agilità Innaturale** (`base.mara.SorpassoInCurva`) | C | MAR-AR3 · Gioca d'anticipo: +4 [[A]] a sé. −8 [[A]] al bersaglio; 4 CUT al bersaglio. |
| 2 | **Unta e Bisunta** (`base.mara.TraDueParaurti`) | NC | MAR-AR4 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +5 [[A]] a sé. |
| 2 | **Slalom d'Avvicinamento** (`base.mara.Slalom`) | NC | MAR-AR5 · Annuncia «Sgommata» o «Lazo del Rider». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 10 POISON al bersaglio. |
| 1 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +2 [[H]] a sé. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Giubbotto di Finta Pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni. |
| 1 | **Traiettoria Imprevedibile** (`base.mara.TiStringoLaCurva`) | NC | MAR-AR6 · Annuncia «Lazo del Rider» o «Sgommata». Se lo trovi: +20 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 1 | **Ghiaccio nel Tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | OGG-14 · Consumato: +10 [[H]]; Azzera [[T]]. |

### Starter di Celestina Bucatina — `starter-tossico`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 11 · NC 7 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: +2 [[T]] a sé; 2 CUT al bersaglio. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +2 [[T]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 8 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 20 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 10 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 2 | **Afferrare** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 10 HIT al bersaglio. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Pasticca Abbandonata** (`base.items.PasticcaTrovataSulBancone`) | C | OGG-12 · Consumato: +10 [[T]]. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |

### Starter di Piera Pinot — `starter-pino`

Personaggio: **Piera Pinot** (P), salute 80, A 15, L 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Fino all'Ultima Goccia** (`base.pino.QuestoLoFiniscoIo`) | NC | PIN-BA · Basic: +15 [[L]] a sé; consuma un proprio oggetto. |
| bound | **Posto Fisso** (`base.pino.bound.CinqueMinutiEVado`) | C | PIN-BO1 · Bound: +5 [[L]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Violenta Spruzzata di Seltz** (`base.pino.bound.SpallataAlBancone`) | C | PIN-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| last resort | **Ultimo Giro** (`base.pino.UltimoGiro`) | NC | LR-PIN · Last resort: 2 HIT a sé. Spendi tutta la tua [[L]] residua. 10 HIT al bersaglio, più la [[L]] spesa. Rincara 4 (2 a sé). |
| 2 | **Scompenso da Ultimo Giro** (`base.pino.TestataDaUltimoGiro`) | C | PIN-AR1 · 5 [[L]]: 5 HIT a sé; 35 HIT al bersaglio. |
| 2 | **Alla Goccia** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a 10 più la [[L]] spesa. |
| 2 | **Avamposto Fortificato al Bancone** (`base.pino.IlBanconeRegge`) | C | PIN-AR3 · HIT ricevuto ×0,75 in questo turno; POISON ricevuto ×0,5 in questo turno; +5 [[L]] a sé. |
| 2 | **Un Altro e Arrivo** (`base.pino.OffroIo`) | NC | PIN-AR4 · Annuncia «Alla Goccia» o «Rutto a Bruciapelo». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Rutto a Bruciapelo** (`base.pino.RuttoADistanzaSociale`) | R | PIN-AR5 · 5 [[L]]: Spendi tutta la tua [[L]] residua. Il bersaglio perde [[A]] pari alla [[L]] spesa. Infliggi danni da colpo pari a 15 più il doppio della [[L]] spesa. |
| 1 | **Afferrare** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Amaro nel Bicchiere di Plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | OGG-05 · Consumato: +20 [[L]]; −5 [[A]]. |
| 2 | **Bionda da 66, Calda** (`com.items.RottenBeer`) | C | OGG-02 · Consumato: +10 [[L]]. |
| 1 | **Doppio Malto da Discount** (`com.items.AnotherRottenBeer`) | NC | OGG-03 · Consumato: +10 [[L]]; crea il token «Bottiglia Spaccata» vicino a sé. |
| 1 | **Un Altro... Grappino...** (`base.pino.PrimaIlBrindisi`) | NC | PIN-AR6 · Annuncia «Rutto a Bruciapelo» o «Alla Goccia». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |

### Starter di Beppe Bulletta — `starter-gigi`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 14 titoli (C 9 · NC 10 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: +2 [[V]] a sé; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 20 CUT al bersaglio. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 15 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 20 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 2 | **Giubbotto di Finta Pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni. |
| 2 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 1 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Metodo Empirico** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · 4 CUT al bersaglio. Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici». Se lo trovi: +10 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |

### Mazzo di prova di Sergio Sommerso — `prova-sergio`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 7 · NC 11 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +8 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 25 HIT al bersaglio. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 1 | **STORDIAMOTI HO DETTO** (`bruiser.StunningBlow`) | NC | GEN-09 · 10 [[V]]: −10 [[A]] al bersaglio; 10 HIT al bersaglio. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +2 [[H]] a sé. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 1 | **Santino di San Briaco** (`base.items.SantinoDellaPortinaia`) | R | OGG-15 · Consumato: immunità all'effetto periodico di [[L]] per 3 turni. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Svegliaaah!** (`base.com.AcquaInFaccia`) | NC | GEN-22 · 5 [[A]]: Azzera [[L]] del bersaglio; 4 HIT al bersaglio. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |

### Mazzo di prova di Duccio Braccio Teso — `prova-duccio`

Personaggio: **Duccio Braccio Teso** (P), salute 115, A 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Prima gli Italiani** (`base.rocco.PrimaIo`) | R | ROC-BA · Basic: consuma un proprio oggetto; +4 [[H]] a sé. |
| bound | **Rinfrescata Arrogante** (`base.rocco.bound.Colpetto`) | NC | ROC-BO1 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **(Dis)onore alla Bandiera** (`base.rocco.bound.AlzoLaVoce`) | NC | ROC-BO3 · Bound: +8 [[A]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Non Mi Hai Fatto Niente** (`base.rocco.NeHoPreseDiPeggio`) | R | LR-ROC · Last resort: 6 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **La Storia la Scrivono i Vincitori** (`base.rocco.TeLoSpiegoIo`) | NC | ROC-AR5 · 4 HIT al bersaglio. Annuncia «Craniata Patriottica» o «Testa Dura». Se lo trovi: +6 [[H]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +2 [[H]]. |
| 2 | **Craniata Patriottica** (`base.rocco.Capocciata`) | NC | ROC-AR4 · 30 [[H]]: 25 HIT al bersaglio. |
| 1 | **Testa Dura** (`base.rocco.TestaDura`) | R | ROC-AR6 · 35 [[H]]: 30 HIT al bersaglio. |
| 2 | **Nocche Sbucciate** (`base.rocco.NoccheSbucciate`) | C | ROC-AR1 · 15 [[H]]: 20 HIT al bersaglio. |
| 2 | **Stoico come un Busto di Bronzo** (`base.rocco.Incassare`) | C | ROC-AR2 · HIT ricevuto ×0,5 in questo turno; +4 [[H]] a sé. |
| 2 | **E Allora...?** (`base.rocco.EAllora`) | NC | ROC-AR3 · 10 [[H]]: HIT ricevuto ×0,5 in questo turno; 8 HIT al bersaglio. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 10 POISON al bersaglio. |
| 1 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +2 [[H]] a sé. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Ghiaccio nel Tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | OGG-14 · Consumato: +10 [[H]]; Azzera [[T]]. |

### Mazzo di prova di SPAZIENZIO DE LA UCCISO — `prova-b1-spazienzio`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 7 · NC 10 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | OGG-01 · Consumato: +10 [[V]]; +10 [[L]]; +2 [[T]]. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |

### Mazzo di prova di Mara Contromano — `prova-b1-mara`

Personaggio: **Mara Contromano** (P), salute 65, A 45; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 9 · NC 6 · R 5).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Requisire al Volo** (`base.mara.PresoAlVolo`) | C | MAR-BA · Basic: −5 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Sventare l'Assassinio** (`base.mara.bound.PassoStretto`) | C | MAR-BO1 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 CUT al bersaglio. |
| bound | **Semaforo Rosso** (`base.mara.bound.CambioMarcia`) | C | MAR-BO2 · Bound: +5 [[A]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 1 | **Lazo del Rider** (`base.mara.CinghiataDiTraverso`) | R | MAR-AR1 · 20 [[A]]: CUT al bersaglio pari a 20 più metà della tua [[A]] residua, arrotondata per difetto. Gioca d'anticipo: 5 CUT al bersaglio. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | MAR-AR2 · 15 [[A]]: 25 CUT al bersaglio. Gioca d'anticipo: Il bersaglio: HIT, CUT e POISON inflitti ×0,75 in questo turno. |
| 2 | **Agilità Innaturale** (`base.mara.SorpassoInCurva`) | C | MAR-AR3 · Gioca d'anticipo: +4 [[A]] a sé. −8 [[A]] al bersaglio; 4 CUT al bersaglio. |
| 2 | **Unta e Bisunta** (`base.mara.TraDueParaurti`) | NC | MAR-AR4 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +5 [[A]] a sé. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 10 POISON al bersaglio. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Traiettoria Imprevedibile** (`base.mara.TiStringoLaCurva`) | NC | MAR-AR6 · Annuncia «Lazo del Rider» o «Sgommata». Se lo trovi: +20 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 1 | **Ghiaccio nel Tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | OGG-14 · Consumato: +10 [[H]]; Azzera [[T]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +10 [[H]] a sé. |

### Mazzo di prova di Celestina Bucatina — `prova-b1-celestina`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 7 · NC 7 · R 6).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: +2 [[T]] a sé; 2 CUT al bersaglio. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +2 [[T]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 8 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 20 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 10 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 1 | **Afferrare** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 10 HIT al bersaglio. |
| 2 | **Pasticca Abbandonata** (`base.items.PasticcaTrovataSulBancone`) | C | OGG-12 · Consumato: +10 [[T]]. |
| 1 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +10 [[H]] a sé. |

### Mazzo di prova di Piera Pinot — `prova-b1-piera`

Personaggio: **Piera Pinot** (P), salute 80, A 15, L 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 8 · NC 9 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Fino all'Ultima Goccia** (`base.pino.QuestoLoFiniscoIo`) | NC | PIN-BA · Basic: +15 [[L]] a sé; consuma un proprio oggetto. |
| bound | **Posto Fisso** (`base.pino.bound.CinqueMinutiEVado`) | C | PIN-BO1 · Bound: +5 [[L]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Violenta Spruzzata di Seltz** (`base.pino.bound.SpallataAlBancone`) | C | PIN-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| last resort | **Ultimo Giro** (`base.pino.UltimoGiro`) | NC | LR-PIN · Last resort: 2 HIT a sé. Spendi tutta la tua [[L]] residua. 10 HIT al bersaglio, più la [[L]] spesa. Rincara 4 (2 a sé). |
| 2 | **Scompenso da Ultimo Giro** (`base.pino.TestataDaUltimoGiro`) | C | PIN-AR1 · 5 [[L]]: 5 HIT a sé; 35 HIT al bersaglio. |
| 2 | **Alla Goccia** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a 10 più la [[L]] spesa. |
| 2 | **Avamposto Fortificato al Bancone** (`base.pino.IlBanconeRegge`) | C | PIN-AR3 · HIT ricevuto ×0,75 in questo turno; POISON ricevuto ×0,5 in questo turno; +5 [[L]] a sé. |
| 2 | **Un Altro e Arrivo** (`base.pino.OffroIo`) | NC | PIN-AR4 · Annuncia «Alla Goccia» o «Rutto a Bruciapelo». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Rutto a Bruciapelo** (`base.pino.RuttoADistanzaSociale`) | R | PIN-AR5 · 5 [[L]]: Spendi tutta la tua [[L]] residua. Il bersaglio perde [[A]] pari alla [[L]] spesa. Infliggi danni da colpo pari a 15 più il doppio della [[L]] spesa. |
| 2 | **Amaro nel Bicchiere di Plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | OGG-05 · Consumato: +20 [[L]]; −5 [[A]]. |
| 1 | **Doppio Malto da Discount** (`com.items.AnotherRottenBeer`) | NC | OGG-03 · Consumato: +10 [[L]]; crea il token «Bottiglia Spaccata» vicino a sé. |
| 1 | **Un Altro... Grappino...** (`base.pino.PrimaIlBrindisi`) | NC | PIN-AR6 · Annuncia «Rutto a Bruciapelo» o «Alla Goccia». Se lo trovi: +15 [[L]], +35 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |
| 2 | **Grappa della Casa** (`base.items.GrappaDellaCasa`) | R | OGG-16 · Consumato: +25 [[L]]; −5 [[A]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Acqua Minerale Sgasata** (`base.items.MezzaMineraleSgasata`) | NC | OGG-08 · Consumato: Azzera [[L]]; +20 [[A]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-beppe`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 6 · NC 11 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: +2 [[V]] a sé; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 20 CUT al bersaglio. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 15 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 1 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 1 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Metodo Empirico** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · 4 CUT al bersaglio. Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici». Se lo trovi: +10 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **PERMESSO SCUSA PUOI SMETTERLA** (`bruiser.BadEducation`) | NC | GEN-10 · 5 [[V]]: Toglie gli equip al bersaglio; 8 HIT al bersaglio. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |

### Mazzo di prova di Sergio Sommerso — `prova-b1-sergio`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 6 · NC 11 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +8 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 25 HIT al bersaglio. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |

### Mazzo di prova di Duccio Braccio Teso — `prova-b1-duccio`

Personaggio: **Duccio Braccio Teso** (P), salute 115, A 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 10 · NC 7 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Prima gli Italiani** (`base.rocco.PrimaIo`) | R | ROC-BA · Basic: consuma un proprio oggetto; +4 [[H]] a sé. |
| bound | **Rinfrescata Arrogante** (`base.rocco.bound.Colpetto`) | NC | ROC-BO1 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **(Dis)onore alla Bandiera** (`base.rocco.bound.AlzoLaVoce`) | NC | ROC-BO3 · Bound: +8 [[A]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Non Mi Hai Fatto Niente** (`base.rocco.NeHoPreseDiPeggio`) | R | LR-ROC · Last resort: 6 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 1 | **La Storia la Scrivono i Vincitori** (`base.rocco.TeLoSpiegoIo`) | NC | ROC-AR5 · 4 HIT al bersaglio. Annuncia «Craniata Patriottica» o «Testa Dura». Se lo trovi: +6 [[H]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +2 [[H]]. |
| 2 | **Craniata Patriottica** (`base.rocco.Capocciata`) | NC | ROC-AR4 · 30 [[H]]: 25 HIT al bersaglio. |
| 1 | **Testa Dura** (`base.rocco.TestaDura`) | R | ROC-AR6 · 35 [[H]]: 30 HIT al bersaglio. |
| 2 | **Nocche Sbucciate** (`base.rocco.NoccheSbucciate`) | C | ROC-AR1 · 15 [[H]]: 20 HIT al bersaglio. |
| 2 | **Stoico come un Busto di Bronzo** (`base.rocco.Incassare`) | C | ROC-AR2 · HIT ricevuto ×0,5 in questo turno; +4 [[H]] a sé. |
| 2 | **E Allora...?** (`base.rocco.EAllora`) | NC | ROC-AR3 · 10 [[H]]: HIT ricevuto ×0,5 in questo turno; 8 HIT al bersaglio. |
| 2 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | GEN-17 · 5 [[A]]: 10 POISON al bersaglio. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +10 [[H]] a sé. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Acqua Minerale Sgasata** (`base.items.MezzaMineraleSgasata`) | NC | OGG-08 · Consumato: Azzera [[L]]; +20 [[A]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-equip`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 4 · NC 13 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: +2 [[V]] a sé; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 20 CUT al bersaglio. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 15 più 4 per ogni tuo oggetto sul campo. |
| 1 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 20 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 1 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | OGG-06 · Consumato: +15 [[A]]. |
| 1 | **Metodo Empirico** (`base.gigi.UnaStrettaDiProva`) | NC | GIG-AR6 · 4 CUT al bersaglio. Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici». Se lo trovi: +10 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **PERMESSO SCUSA PUOI SMETTERLA** (`bruiser.BadEducation`) | NC | GEN-10 · 5 [[V]]: Toglie gli equip al bersaglio; 8 HIT al bersaglio. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-estasi`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 8 · NC 9 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: +2 [[V]] a sé; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 15 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 20 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 2 | **Giubbotto di Finta Pelle** (`base.items.GiubbottoDiFintaPelle`) | C | OGG-10 · Consumato: equip, CUT ricevuto ×0,75 per 3 turni. |
| 2 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | GEN-15 · 5 HIT a sé; Azzera [[T]] a sé; Azzera [[L]] a sé. |
| 2 | **Alla Goccia** (`base.pino.GoingBerserk`) | NC | PIN-AR2 · Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a 10 più la [[L]] spesa. |
| 2 | **Grappa della Casa** (`base.items.GrappaDellaCasa`) | R | OGG-16 · Consumato: +25 [[L]]; −5 [[A]]. |

### Mazzo di prova di SPAZIENZIO DE LA UCCISO — `prova-b2-spazienzio`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 5 · NC 12 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −4 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b2-beppe`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 5 · NC 12 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | GIG-BA · Basic: +4 [[V]] a sé; consuma un proprio oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | GIG-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | GIG-BO2 · Bound: +2 [[V]] a sé; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | GIG-AR1 · 5 [[V]]: Distrugge un oggetto lontano. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | GIG-AR2 · 10 [[V]]: 20 CUT al bersaglio. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | GIG-AR3 · 4 CUT al bersaglio. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | GIG-AR4 · 5 [[V]]: HIT ricevuto ×0,5 in questo turno; CUT ricevuto ×0,75 in questo turno; +5 [[V]] a sé; +5 [[A]] a sé. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | GIG-AR5 · 10 [[V]]: Infliggi danni da colpo pari a 15 più 4 per ogni tuo oggetto sul campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | OGG-09 · Consumato: equip, HIT inflitto ×1,25 per 3 turni. |
| 1 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | OGG-11 · Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | GEN-08 · 15 [[V]]: 10 HIT al bersaglio; +10 [[T]] al bersaglio. |
| 2 | **PERMESSO SCUSA PUOI SMETTERLA** (`bruiser.BadEducation`) | NC | GEN-10 · 5 [[V]]: Toglie gli equip al bersaglio; 8 HIT al bersaglio. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | GEN-21 · 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −4 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-sergio-conto`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 13 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +8 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 25 HIT al bersaglio. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −4 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-sergio-sigaretta`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 11 · R 5).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +8 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 25 HIT al bersaglio. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b2-celestina`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 5 · NC 7 · R 8).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: +2 [[T]] a sé; 2 CUT al bersaglio. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +2 [[T]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 8 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 20 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 10 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 1 | **Afferrare** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 10 HIT al bersaglio. |
| 1 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | GEN-04 · Copia vicino a te un oggetto casuale del bersaglio. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +10 [[H]] a sé. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b2-rischio9`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 5 · NC 9 · R 6).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: +2 [[T]] a sé; 2 CUT al bersaglio. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +2 [[T]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 8 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 20 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 10 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 1 | **Afferrare** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 10 HIT al bersaglio. |
| 1 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | GEN-20 · HIT e CUT ricevuti ×1,25 per 2 turni; +10 [[H]] a sé. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |
| 2 | **Scatto Repentino** (`base.com.ShuffleFeet`) | NC | GEN-03 · Scambia tutti gli oggetti col bersaglio, rispettando le capacità. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-rischio10`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 15 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +8 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 25 HIT al bersaglio. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | GEN-11 · 5 [[V]]: HIT ricevuto ×0,25 in questo turno; +5 [[A]] a sé. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | GEN-19 · +5 [[A]] a sé; −5 [[A]] al bersaglio. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −4 [[A]]. Consumato: +15 [[V]]. |
| 2 | **Scatto Repentino** (`base.com.ShuffleFeet`) | NC | GEN-03 · Scambia tutti gli oggetti col bersaglio, rispettando le capacità. |

### Mazzo di prova di SPAZIENZIO DE LA UCCISO — `iso-b2-conto`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 8 · NC 11 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | SPA-BA · Basic: consuma un proprio oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | SPA-BO1 · Bound: +5 [[V]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | SPA-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | SPA-AR1 · 25 [[V]]: 35 HIT al bersaglio. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | SPA-AR2 · 10 [[V]]: HIT al bersaglio pari a 6 più metà della tua [[V]] residua, arrotondata per difetto. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | SPA-AR3 · Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | SPA-AR4 · CUT ricevuto ×0,5 per 4 turni; +10 [[V]] a sé. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | SPA-AR5 · 5 [[V]]: Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio. |
| 2 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | GEN-05 · 10 [[V]]: 20 HIT al bersaglio; dell'autore valgono solo gli stati GOOD. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +2 [[H]] a sé. |
| 1 | **Foratone da 28** (`base.com.MattoneDelCantiere`) | C | GEN-06 · 15 [[V]]: 25 HIT al bersaglio. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | GEN-07 · 20 [[V]]: 30 HIT al bersaglio; Azzera [[T]] del bersaglio; Azzera [[L]] del bersaglio. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | GEN-14 · −5 [[A]] a sé; +10 [[V]] a sé. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | OGG-13 · Consumato: equip, HIT inflitto ×1,5, uso singolo (resta fino a fine turno dopo l'uso). |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | SPA-AR6 · Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | OGG-17 · In campo: a fine turno −4 [[A]]. Consumato: +15 [[V]]. |

### Mazzo di prova di Celestina Bucatina — `iso-b2-sigaretta`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 9 · NC 7 · R 4).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | TOS-BA · Basic: +5 [[T]] a sé; consuma un proprio oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | TOS-BO1 · Bound: +2 [[T]] a sé; 2 CUT al bersaglio. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | TOS-BO2 · Bound: +2 [[T]] a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | LR-TOS · Last resort: 2 HIT a sé; 8 POISON al bersaglio; +4 [[T]] al bersaglio. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | TOS-AR1 · Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | TOS-AR2 · 10 [[T]]: 20 POISON al bersaglio; +5 [[T]] al bersaglio. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | TOS-AR3 · Guadagno di [[H]] a sé pari a metà della tua [[T]] residua, arrotondata per difetto; Perdita di [[T]] a sé pari a [[T]] residua. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | TOS-AR4 · 10 [[T]]: Annulla le mosse dirette a sé che arrivano dopo. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | TOS-AR5 · 10 [[T]]: Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. 10 POISON al bersaglio. A fine turno ottieni l'immunità a [[T]]. |
| 2 | **Afferrare** (`com.Grab`) | C | GEN-01 · consuma un proprio oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | GEN-12 · 10 [[A]]: +5 [[V]] a sé; 10 HIT al bersaglio. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | GEN-02 · 10 [[A]]: Ruba un oggetto lontano e lo mette vicino a sé. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | GEN-16 · −5 [[A]] a sé; +8 [[H]] a sé. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | OGG-07 · Consumato: +10 [[H]]; +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | OGG-04 · Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | TOS-AR6 · Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[T]]. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

### Mazzo di prova di Sergio Sommerso — `iso-b2-sigaretta-sergio`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 5 · NC 11 · R 4).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | CES-BA · Basic: +8 [[A]] a sé; consuma un proprio oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | CES-BO2 · Bound: Perdita di [[T]] a sé pari a un quarto della tua [[T]] residua, arrotondato per difetto; Perdita di [[L]] a sé pari a un quarto della tua [[L]] residua, arrotondato per difetto; 2 HIT al bersaglio. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | CES-BO3 · Bound: HIT, CUT e POISON ricevuti ×0,75 in questo turno. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | LR-STR · Last resort: 5 HIT a sé; 10 HIT al bersaglio. Rincara 5 (2 a sé). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | CES-AR1 · 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | CES-AR2 · 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | CES-AR3 · 10 [[A]]: Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | CES-AR4 · 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | CES-AR5 · 15 [[A]]: 25 HIT al bersaglio. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | CES-AR6 · 10 [[A]]: Perdita di [[A]] al bersaglio pari a metà della tua [[A]] residua, arrotondata per difetto; HIT al bersaglio pari a 5 più metà della tua [[A]] residua, arrotondata per difetto. |
| 1 | **STORDIAMOTI HO DETTO** (`bruiser.StunningBlow`) | NC | GEN-09 · 10 [[V]]: −10 [[A]] al bersaglio; 10 HIT al bersaglio. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | GEN-13 · 5 [[A]]: HIT e CUT ricevuti ×0,5 in questo turno; +2 [[H]] a sé. |
| 1 | **Spintone** (`base.com.Spintone`) | C | GEN-18 · 8 HIT al bersaglio. |
| 1 | **Santino di San Briaco** (`base.items.SantinoDellaPortinaia`) | R | OGG-15 · Consumato: immunità all'effetto periodico di [[L]] per 3 turni. |
| 1 | **Svegliaaah!** (`base.com.AcquaInFaccia`) | NC | GEN-22 · 5 [[A]]: Azzera [[L]] del bersaglio; 4 HIT al bersaglio. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | CES-AR7 · Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | OGG-18 · In campo: a fine turno +2 [[T]]. Consumato: +10 [[A]]. |

<!-- fine generato -->
