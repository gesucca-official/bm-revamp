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

Generato da `genera-bozza-di-riferimento.py` dal solo `bozza.json` (SHA-256 `ea5f77b6b36a…`). Formato `sb-6b/1`, set `base` versione «1.7»; regole dei mazzi: 20 carte regolari, massimo 2 copie, 2 bound, basic fissa, last resort obbligatoria; il mazzo si mischia dopo ogni ricerca. Rarità: C comune, NC non comune, R rara.

Il file contiene 117 carte (basic, bound, last resort, azioni e oggetti; i personaggi sono a parte), 7 personaggi, 5 starter e, di prova, 21 mazzo/i (l'id che comincia per `starter-` è uno starter, ogni altro mazzo è di prova: non è nella riserva predefinita del server).

### Starter di SPAZIENZIO DE LA UCCISO — `starter-spazienzio`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 10 · NC 9 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | Consumi un tuo oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | 25 [[V]]: 35 [[HIT]] all'avversario. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 6 più metà della [[V]] che ti resta. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | Per 4 turni, contando questo, subisci metà dei [[CUT]] che subiresti. +10 [[V]]. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | 5 [[V]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. |
| 2 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | 10 [[V]]: 20 [[HIT]] all'avversario. Su questo danno contano solo i tuoi stati positivi. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +2 [[H]]. |
| 1 | **Foratone da 28** (`base.com.MattoneDelCantiere`) | C | 15 [[V]]: 25 [[HIT]] all'avversario. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | 20 [[V]]: 30 [[HIT]] all'avversario. Azzeri la [[T]] e la [[L]] dell'avversario. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | Perdi 5 [[A]]. +10 [[V]]. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | Quando lo consumi: +10 [[V]], +10 [[L]], +2 [[T]]. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | Quando lo consumi: infliggi una volta e mezza i [[HIT]] che infliggeresti (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |

### Starter di Mara Contromano — `starter-mara`

Personaggio: **Mara Contromano** (P), salute 65, A 45; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 11 · NC 8 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Requisire al Volo** (`base.mara.PresoAlVolo`) | C | Perdi 5 [[A]]. Consumi un tuo oggetto. |
| bound | **Sventare l'Assassinio** (`base.mara.bound.PassoStretto`) | C | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[CUT]] all'avversario. |
| bound | **Semaforo Rosso** (`base.mara.bound.CambioMarcia`) | C | +5 [[A]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 1 | **Lazo del Rider** (`base.mara.CinghiataDiTraverso`) | R | 20 [[A]]: [[CUT]] all'avversario pari a 20 più metà della [[A]] che ti resta. Gioca d'anticipo: 5 [[CUT]] all'avversario. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | 15 [[A]]: 25 [[CUT]] all'avversario. Gioca d'anticipo: in questo turno l'avversario infligge tre quarti dei danni che infliggerebbe. |
| 2 | **Agilità Innaturale** (`base.mara.SorpassoInCurva`) | C | L'avversario perde 8 [[A]]. 4 [[CUT]] all'avversario. Gioca d'anticipo: +4 [[A]]. |
| 2 | **Unta e Bisunta** (`base.mara.TraDueParaurti`) | NC | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +5 [[A]]. |
| 2 | **Slalom d'Avvicinamento** (`base.mara.Slalom`) | NC | Annuncia «Sgommata» o «Lazo del Rider». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | 5 [[A]]: 10 [[POISON]] all'avversario. |
| 1 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +2 [[H]]. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Giubbotto di Finta Pelle** (`base.items.GiubbottoDiFintaPelle`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[CUT]] che subiresti (equipaggiamento). |
| 1 | **Traiettoria Imprevedibile** (`base.mara.TiStringoLaCurva`) | NC | Annuncia «Lazo del Rider» o «Sgommata». Se lo trovi: +20 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 1 | **Ghiaccio nel Tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | Quando lo consumi: +10 [[H]]. Azzeri la tua [[T]]. |

### Starter di Celestina Bucatina — `starter-tossico`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 11 · NC 7 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | +5 [[T]]. Consumi un tuo oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | +2 [[T]]. 2 [[CUT]] all'avversario. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | +2 [[T]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | Subisci 2 [[HIT]]. 8 [[POISON]] all'avversario. L'avversario guadagna 4 [[T]]. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | 10 [[T]]: 20 [[POISON]] all'avversario. L'avversario guadagna 5 [[T]]. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | Guadagni [[H]] pari a metà della tua [[T]]. Perdi tutta la tua [[T]]. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | 10 [[T]]: annulli le mosse contro di te che si risolvono dopo la tua. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | 10 [[T]]: dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]]. 10 [[POISON]] all'avversario. A fine turno diventi immune a [[T]]. |
| 2 | **Afferrare** (`com.Grab`) | C | Consumi un tuo oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | 10 [[A]]: +5 [[V]]. 10 [[HIT]] all'avversario. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | 10 [[A]]: prendi un oggetto dell'avversario e mettilo accanto a te. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | Perdi 5 [[A]]. +8 [[H]]. |
| 2 | **Pasticca Abbandonata** (`base.items.PasticcaTrovataSulBancone`) | C | Quando lo consumi: +10 [[T]]. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | Quando lo consumi: diventi immune a [[T]] e [[L]]; +20 [[L]], +20 [[T]]. Alla fine del quinto turno, contando questo, perdi tutte le immunità e tutti gli stati, poi subisci 20 [[POISON]]. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |

### Starter di Piera Pinot — `starter-pino`

Personaggio: **Piera Pinot** (P), salute 80, A 15, L 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Fino all'Ultima Goccia** (`base.pino.QuestoLoFiniscoIo`) | NC | +15 [[L]]. Consumi un tuo oggetto. |
| bound | **Posto Fisso** (`base.pino.bound.CinqueMinutiEVado`) | C | +5 [[L]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Violenta Spruzzata di Seltz** (`base.pino.bound.SpallataAlBancone`) | C | Perdi un quarto della tua [[T]]. 2 [[HIT]] all'avversario. |
| last resort | **Ultimo Giro** (`base.pino.UltimoGiro`) | NC | Subisci 2 [[HIT]]. Spendi tutta la tua [[L]]. [[HIT]] all'avversario pari a 10 più la [[L]] spesa. Rincara 4 (2 a te). |
| 2 | **Scompenso da Ultimo Giro** (`base.pino.TestataDaUltimoGiro`) | C | 5 [[L]]: subisci 5 [[HIT]]. 35 [[HIT]] all'avversario. |
| 2 | **Alla Goccia** (`base.pino.GoingBerserk`) | NC | Spendi tutta la tua [[L]]. [[HIT]] all'avversario pari a 10 più la [[L]] spesa. |
| 2 | **Avamposto Fortificato al Bancone** (`base.pino.IlBanconeRegge`) | C | In questo turno subisci tre quarti dei [[HIT]] e metà dei [[POISON]] che subiresti. +5 [[L]]. |
| 2 | **Un Altro e Arrivo** (`base.pino.OffroIo`) | NC | Annuncia «Alla Goccia» o «Rutto a Bruciapelo». Se lo trovi: +15 [[L]], +35 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Rutto a Bruciapelo** (`base.pino.RuttoADistanzaSociale`) | R | 5 [[L]]: spendi tutta la [[L]] che ti resta. L'avversario perde [[A]] pari alla [[L]] spesa. [[HIT]] all'avversario pari a 15 più il doppio della [[L]] spesa. |
| 1 | **Afferrare** (`com.Grab`) | C | Consumi un tuo oggetto. |
| 2 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | Perdi 5 [[A]]. +8 [[H]]. |
| 2 | **Amaro nel Bicchiere di Plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | Quando lo consumi: +20 [[L]]. Perdi 5 [[A]]. |
| 2 | **Bionda da 66, Calda** (`com.items.RottenBeer`) | C | Quando lo consumi: +10 [[L]]. |
| 1 | **Doppio Malto da Discount** (`com.items.AnotherRottenBeer`) | NC | Quando lo consumi: +10 [[L]]. Accanto a te compare una Bottiglia Spaccata. |
| 1 | **Un Altro... Grappino...** (`base.pino.PrimaIlBrindisi`) | NC | Annuncia «Rutto a Bruciapelo» o «Alla Goccia». Se lo trovi: +15 [[L]], +35 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | Subisci 5 [[HIT]]. Azzeri la tua [[T]] e la tua [[L]]. |

### Starter di Beppe Bulletta — `starter-gigi`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 14 titoli (C 9 · NC 10 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | +4 [[V]]. Consumi un tuo oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | +2 [[V]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | 5 [[V]]: distruggi un oggetto dell'avversario. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | 10 [[V]]: 20 [[CUT]] all'avversario. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | 4 [[CUT]] all'avversario. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | 5 [[V]]: in questo turno subisci metà dei [[HIT]] e tre quarti dei [[CUT]] che subiresti. +5 [[V]], +5 [[A]]. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 15 più 4 per ogni tuo oggetto in campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | 10 [[A]]: prendi un oggetto dell'avversario e mettilo accanto a te. |
| 1 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | 10 [[V]]: 20 [[HIT]] all'avversario. Su questo danno contano solo i tuoi stati positivi. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | Quando lo consumi: per 3 turni, contando questo, infliggi una volta e un quarto i [[HIT]] che infliggeresti (equipaggiamento). |
| 2 | **Giubbotto di Finta Pelle** (`base.items.GiubbottoDiFintaPelle`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[CUT]] che subiresti (equipaggiamento). |
| 2 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[HIT]] che subiresti (equipaggiamento). |
| 1 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 1 | **Metodo Empirico** (`base.gigi.UnaStrettaDiProva`) | NC | 4 [[CUT]] all'avversario. Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici». Se lo trovi: +10 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | Subisci 5 [[HIT]]. Azzeri la tua [[T]] e la tua [[L]]. |

### Mazzo di prova di Sergio Sommerso — `prova-sergio`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 7 · NC 11 · R 2).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | +8 [[A]]. Consumi un tuo oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | 5 [[A]]: l'avversario perde 10 [[A]]. 4 [[HIT]] all'avversario. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | 15 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se era un attacco, gli rimandi metà dei danni fissi scritti sulla sua carta, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | 10 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | 5 [[A]]: 8 [[HIT]] all'avversario. Se l'avversario è Vulnerabile: 6 [[HIT]] all'avversario. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | 15 [[A]]: 25 [[HIT]] all'avversario. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | 10 [[A]]: l'avversario perde [[A]] pari a metà della [[A]] che ti resta. [[HIT]] all'avversario pari a 5 più metà della [[A]] che ti resta. |
| 1 | **STORDIAMOTI HO DETTO** (`bruiser.StunningBlow`) | NC | 10 [[V]]: l'avversario perde 10 [[A]]. 10 [[HIT]] all'avversario. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +2 [[H]]. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 1 | **Santino di San Briaco** (`base.items.SantinoDellaPortinaia`) | R | Quando lo consumi: diventi immune a [[L]] per 3 turni. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 1 | **Svegliaaah!** (`base.com.AcquaInFaccia`) | NC | 5 [[A]]: azzeri la [[L]] dell'avversario. 4 [[HIT]] all'avversario. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | Vendi il tuo oggetto scelto, che esce senza il suo effetto: +8 [[H]]. Se non c'è più, niente. |

### Mazzo di prova di Duccio Braccio Teso — `prova-duccio`

Personaggio: **Duccio Braccio Teso** (P), salute 115, A 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 12 · NC 7 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Prima gli Italiani** (`base.rocco.PrimaIo`) | R | Consumi un tuo oggetto. +4 [[H]]. |
| bound | **Rinfrescata Arrogante** (`base.rocco.bound.Colpetto`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **(Dis)onore alla Bandiera** (`base.rocco.bound.AlzoLaVoce`) | NC | +8 [[A]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Non Mi Hai Fatto Niente** (`base.rocco.NeHoPreseDiPeggio`) | R | Subisci 6 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **La Storia la Scrivono i Vincitori** (`base.rocco.TeLoSpiegoIo`) | NC | 4 [[HIT]] all'avversario. Annuncia «Craniata Patriottica» o «Testa Dura». Se lo trovi: +6 [[H]] e diventi Vulnerabile. Se non lo trovi: +2 [[H]]. |
| 2 | **Craniata Patriottica** (`base.rocco.Capocciata`) | NC | 30 [[H]]: 25 [[HIT]] all'avversario. |
| 1 | **Testa Dura** (`base.rocco.TestaDura`) | R | 35 [[H]]: 30 [[HIT]] all'avversario. |
| 2 | **Nocche Sbucciate** (`base.rocco.NoccheSbucciate`) | C | 15 [[H]]: 20 [[HIT]] all'avversario. |
| 2 | **Stoico come un Busto di Bronzo** (`base.rocco.Incassare`) | C | In questo turno subisci metà dei [[HIT]] che subiresti. +4 [[H]]. |
| 2 | **E Allora...?** (`base.rocco.EAllora`) | NC | 10 [[H]]: in questo turno subisci metà dei [[HIT]] che subiresti. 8 [[HIT]] all'avversario. |
| 2 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | 5 [[A]]: 10 [[POISON]] all'avversario. |
| 1 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +2 [[H]]. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | Perdi 5 [[A]]. +8 [[H]]. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Ghiaccio nel Tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | Quando lo consumi: +10 [[H]]. Azzeri la tua [[T]]. |

### Mazzo di prova di SPAZIENZIO DE LA UCCISO — `prova-b1-spazienzio`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 7 · NC 10 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | Consumi un tuo oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | 25 [[V]]: 35 [[HIT]] all'avversario. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 6 più metà della [[V]] che ti resta. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | Per 4 turni, contando questo, subisci metà dei [[CUT]] che subiresti. +10 [[V]]. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | 5 [[V]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | Perdi 5 [[A]]. +10 [[V]]. |
| 2 | **Negroni Trovato per Terra** (`com.items.CocktailOnTheGround`) | C | Quando lo consumi: +10 [[V]], +10 [[L]], +2 [[T]]. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | Quando lo consumi: infliggi una volta e mezza i [[HIT]] che infliggeresti (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | 5 [[V]]: in questo turno subisci un quarto dei [[HIT]] che subiresti. +5 [[A]]. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | 15 [[V]]: 10 [[HIT]] all'avversario. L'avversario guadagna 10 [[T]]. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | 5 [[V]]: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |

### Mazzo di prova di Mara Contromano — `prova-b1-mara`

Personaggio: **Mara Contromano** (P), salute 65, A 45; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 9 · NC 6 · R 5).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Requisire al Volo** (`base.mara.PresoAlVolo`) | C | Perdi 5 [[A]]. Consumi un tuo oggetto. |
| bound | **Sventare l'Assassinio** (`base.mara.bound.PassoStretto`) | C | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[CUT]] all'avversario. |
| bound | **Semaforo Rosso** (`base.mara.bound.CambioMarcia`) | C | +5 [[A]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 1 | **Lazo del Rider** (`base.mara.CinghiataDiTraverso`) | R | 20 [[A]]: [[CUT]] all'avversario pari a 20 più metà della [[A]] che ti resta. Gioca d'anticipo: 5 [[CUT]] all'avversario. |
| 2 | **Sgommata** (`base.mara.Sgommata`) | NC | 15 [[A]]: 25 [[CUT]] all'avversario. Gioca d'anticipo: in questo turno l'avversario infligge tre quarti dei danni che infliggerebbe. |
| 2 | **Agilità Innaturale** (`base.mara.SorpassoInCurva`) | C | L'avversario perde 8 [[A]]. 4 [[CUT]] all'avversario. Gioca d'anticipo: +4 [[A]]. |
| 2 | **Unta e Bisunta** (`base.mara.TraDueParaurti`) | NC | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +5 [[A]]. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | 5 [[A]]: 10 [[POISON]] all'avversario. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 1 | **Traiettoria Imprevedibile** (`base.mara.TiStringoLaCurva`) | NC | Annuncia «Lazo del Rider» o «Sgommata». Se lo trovi: +20 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 1 | **Ghiaccio nel Tovagliolo** (`base.items.GhiaccioNelTovagliolo`) | NC | Quando lo consumi: +10 [[H]]. Azzeri la tua [[T]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | Copia accanto a te un oggetto a caso dell'avversario. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | In questo turno e nel prossimo subisci una volta e un quarto i [[HIT]] e [[CUT]] che subiresti. +10 [[H]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b1-celestina`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 7 · NC 7 · R 6).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | +5 [[T]]. Consumi un tuo oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | +2 [[T]]. 2 [[CUT]] all'avversario. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | +2 [[T]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | Subisci 2 [[HIT]]. 8 [[POISON]] all'avversario. L'avversario guadagna 4 [[T]]. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | 10 [[T]]: 20 [[POISON]] all'avversario. L'avversario guadagna 5 [[T]]. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | Guadagni [[H]] pari a metà della tua [[T]]. Perdi tutta la tua [[T]]. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | 10 [[T]]: annulli le mosse contro di te che si risolvono dopo la tua. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | 10 [[T]]: dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]]. 10 [[POISON]] all'avversario. A fine turno diventi immune a [[T]]. |
| 1 | **Afferrare** (`com.Grab`) | C | Consumi un tuo oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | 10 [[A]]: +5 [[V]]. 10 [[HIT]] all'avversario. |
| 2 | **Pasticca Abbandonata** (`base.items.PasticcaTrovataSulBancone`) | C | Quando lo consumi: +10 [[T]]. |
| 1 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | Quando lo consumi: diventi immune a [[T]] e [[L]]; +20 [[L]], +20 [[T]]. Alla fine del quinto turno, contando questo, perdi tutte le immunità e tutti gli stati, poi subisci 20 [[POISON]]. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | Copia accanto a te un oggetto a caso dell'avversario. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | In questo turno e nel prossimo subisci una volta e un quarto i [[HIT]] e [[CUT]] che subiresti. +10 [[H]]. |

### Mazzo di prova di Piera Pinot — `prova-b1-piera`

Personaggio: **Piera Pinot** (P), salute 80, A 15, L 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 8 · NC 9 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Fino all'Ultima Goccia** (`base.pino.QuestoLoFiniscoIo`) | NC | +15 [[L]]. Consumi un tuo oggetto. |
| bound | **Posto Fisso** (`base.pino.bound.CinqueMinutiEVado`) | C | +5 [[L]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Violenta Spruzzata di Seltz** (`base.pino.bound.SpallataAlBancone`) | C | Perdi un quarto della tua [[T]]. 2 [[HIT]] all'avversario. |
| last resort | **Ultimo Giro** (`base.pino.UltimoGiro`) | NC | Subisci 2 [[HIT]]. Spendi tutta la tua [[L]]. [[HIT]] all'avversario pari a 10 più la [[L]] spesa. Rincara 4 (2 a te). |
| 2 | **Scompenso da Ultimo Giro** (`base.pino.TestataDaUltimoGiro`) | C | 5 [[L]]: subisci 5 [[HIT]]. 35 [[HIT]] all'avversario. |
| 2 | **Alla Goccia** (`base.pino.GoingBerserk`) | NC | Spendi tutta la tua [[L]]. [[HIT]] all'avversario pari a 10 più la [[L]] spesa. |
| 2 | **Avamposto Fortificato al Bancone** (`base.pino.IlBanconeRegge`) | C | In questo turno subisci tre quarti dei [[HIT]] e metà dei [[POISON]] che subiresti. +5 [[L]]. |
| 2 | **Un Altro e Arrivo** (`base.pino.OffroIo`) | NC | Annuncia «Alla Goccia» o «Rutto a Bruciapelo». Se lo trovi: +15 [[L]], +35 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Rutto a Bruciapelo** (`base.pino.RuttoADistanzaSociale`) | R | 5 [[L]]: spendi tutta la [[L]] che ti resta. L'avversario perde [[A]] pari alla [[L]] spesa. [[HIT]] all'avversario pari a 15 più il doppio della [[L]] spesa. |
| 2 | **Amaro nel Bicchiere di Plastica** (`base.items.AmaroNelBicchiereDiPlastica`) | C | Quando lo consumi: +20 [[L]]. Perdi 5 [[A]]. |
| 1 | **Doppio Malto da Discount** (`com.items.AnotherRottenBeer`) | NC | Quando lo consumi: +10 [[L]]. Accanto a te compare una Bottiglia Spaccata. |
| 1 | **Un Altro... Grappino...** (`base.pino.PrimaIlBrindisi`) | NC | Annuncia «Rutto a Bruciapelo» o «Alla Goccia». Se lo trovi: +15 [[L]], +35 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[L]], +10 [[A]]. |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | Subisci 5 [[HIT]]. Azzeri la tua [[T]] e la tua [[L]]. |
| 2 | **Grappa della Casa** (`base.items.GrappaDellaCasa`) | R | Quando lo consumi: +25 [[L]]. Perdi 5 [[A]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Acqua Minerale Sgasata** (`base.items.MezzaMineraleSgasata`) | NC | Quando lo consumi: azzeri la tua [[L]]. +20 [[A]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-beppe`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 6 · NC 11 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | +4 [[V]]. Consumi un tuo oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | +2 [[V]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | 5 [[V]]: distruggi un oggetto dell'avversario. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | 10 [[V]]: 20 [[CUT]] all'avversario. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | 4 [[CUT]] all'avversario. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | 5 [[V]]: in questo turno subisci metà dei [[HIT]] e tre quarti dei [[CUT]] che subiresti. +5 [[V]], +5 [[A]]. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 15 più 4 per ogni tuo oggetto in campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | 10 [[A]]: prendi un oggetto dell'avversario e mettilo accanto a te. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | Quando lo consumi: per 3 turni, contando questo, infliggi una volta e un quarto i [[HIT]] che infliggeresti (equipaggiamento). |
| 1 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[HIT]] che subiresti (equipaggiamento). |
| 1 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 1 | **Metodo Empirico** (`base.gigi.UnaStrettaDiProva`) | NC | 4 [[CUT]] all'avversario. Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici». Se lo trovi: +10 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | 15 [[V]]: 10 [[HIT]] all'avversario. L'avversario guadagna 10 [[T]]. |
| 2 | **PERMESSO SCUSA PUOI SMETTERLA** (`bruiser.BadEducation`) | NC | 5 [[V]]: togli all'avversario i suoi equipaggiamenti. 8 [[HIT]] all'avversario. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | 5 [[V]]: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |

### Mazzo di prova di Sergio Sommerso — `prova-b1-sergio`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 6 · NC 11 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | +8 [[A]]. Consumi un tuo oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | 5 [[A]]: l'avversario perde 10 [[A]]. 4 [[HIT]] all'avversario. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | 15 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se era un attacco, gli rimandi metà dei danni fissi scritti sulla sua carta, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | 10 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | 5 [[A]]: 8 [[HIT]] all'avversario. Se l'avversario è Vulnerabile: 6 [[HIT]] all'avversario. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | 15 [[A]]: 25 [[HIT]] all'avversario. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | 10 [[A]]: l'avversario perde [[A]] pari a metà della [[A]] che ti resta. [[HIT]] all'avversario pari a 5 più metà della [[A]] che ti resta. |
| 2 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | Vendi il tuo oggetto scelto, che esce senza il suo effetto: +8 [[H]]. Se non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | 5 [[V]]: in questo turno subisci un quarto dei [[HIT]] che subiresti. +5 [[A]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | Copia accanto a te un oggetto a caso dell'avversario. |

### Mazzo di prova di Duccio Braccio Teso — `prova-b1-duccio`

Personaggio: **Duccio Braccio Teso** (P), salute 115, A 15; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 10 · NC 7 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Prima gli Italiani** (`base.rocco.PrimaIo`) | R | Consumi un tuo oggetto. +4 [[H]]. |
| bound | **Rinfrescata Arrogante** (`base.rocco.bound.Colpetto`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **(Dis)onore alla Bandiera** (`base.rocco.bound.AlzoLaVoce`) | NC | +8 [[A]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Non Mi Hai Fatto Niente** (`base.rocco.NeHoPreseDiPeggio`) | R | Subisci 6 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 1 | **La Storia la Scrivono i Vincitori** (`base.rocco.TeLoSpiegoIo`) | NC | 4 [[HIT]] all'avversario. Annuncia «Craniata Patriottica» o «Testa Dura». Se lo trovi: +6 [[H]] e diventi Vulnerabile. Se non lo trovi: +2 [[H]]. |
| 2 | **Craniata Patriottica** (`base.rocco.Capocciata`) | NC | 30 [[H]]: 25 [[HIT]] all'avversario. |
| 1 | **Testa Dura** (`base.rocco.TestaDura`) | R | 35 [[H]]: 30 [[HIT]] all'avversario. |
| 2 | **Nocche Sbucciate** (`base.rocco.NoccheSbucciate`) | C | 15 [[H]]: 20 [[HIT]] all'avversario. |
| 2 | **Stoico come un Busto di Bronzo** (`base.rocco.Incassare`) | C | In questo turno subisci metà dei [[HIT]] che subiresti. +4 [[H]]. |
| 2 | **E Allora...?** (`base.rocco.EAllora`) | NC | 10 [[H]]: in questo turno subisci metà dei [[HIT]] che subiresti. 8 [[HIT]] all'avversario. |
| 2 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Sputo nel Posacenere** (`base.com.SputoDaPosacenere`) | C | 5 [[A]]: 10 [[POISON]] all'avversario. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | In questo turno e nel prossimo subisci una volta e un quarto i [[HIT]] e [[CUT]] che subiresti. +10 [[H]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Acqua Minerale Sgasata** (`base.items.MezzaMineraleSgasata`) | NC | Quando lo consumi: azzeri la tua [[L]]. +20 [[A]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-equip`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 4 · NC 13 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | +4 [[V]]. Consumi un tuo oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | +2 [[V]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | 5 [[V]]: distruggi un oggetto dell'avversario. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | 10 [[V]]: 20 [[CUT]] all'avversario. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | 4 [[CUT]] all'avversario. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | 5 [[V]]: in questo turno subisci metà dei [[HIT]] e tre quarti dei [[CUT]] che subiresti. +5 [[V]], +5 [[A]]. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 15 più 4 per ogni tuo oggetto in campo. |
| 1 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | 10 [[V]]: 20 [[HIT]] all'avversario. Su questo danno contano solo i tuoi stati positivi. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | Quando lo consumi: per 3 turni, contando questo, infliggi una volta e un quarto i [[HIT]] che infliggeresti (equipaggiamento). |
| 1 | **Espresso della Macchinetta** (`base.items.EspressoDelDistributore`) | C | Quando lo consumi: +15 [[A]]. |
| 1 | **Metodo Empirico** (`base.gigi.UnaStrettaDiProva`) | NC | 4 [[CUT]] all'avversario. Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici». Se lo trovi: +10 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | 5 [[V]]: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 2 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | Quando lo consumi: infliggi una volta e mezza i [[HIT]] che infliggeresti (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 2 | **PERMESSO SCUSA PUOI SMETTERLA** (`bruiser.BadEducation`) | NC | 5 [[V]]: togli all'avversario i suoi equipaggiamenti. 8 [[HIT]] all'avversario. |

### Mazzo di prova di Beppe Bulletta — `prova-b1-estasi`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 8 · NC 9 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | +4 [[V]]. Consumi un tuo oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | +2 [[V]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | 5 [[V]]: distruggi un oggetto dell'avversario. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | 4 [[CUT]] all'avversario. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | 5 [[V]]: in questo turno subisci metà dei [[HIT]] e tre quarti dei [[CUT]] che subiresti. +5 [[V]], +5 [[A]]. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 15 più 4 per ogni tuo oggetto in campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | 10 [[A]]: prendi un oggetto dell'avversario e mettilo accanto a te. |
| 1 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | 10 [[V]]: 20 [[HIT]] all'avversario. Su questo danno contano solo i tuoi stati positivi. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | Quando lo consumi: per 3 turni, contando questo, infliggi una volta e un quarto i [[HIT]] che infliggeresti (equipaggiamento). |
| 2 | **Giubbotto di Finta Pelle** (`base.items.GiubbottoDiFintaPelle`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[CUT]] che subiresti (equipaggiamento). |
| 2 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[HIT]] che subiresti (equipaggiamento). |
| 1 | **Due Dita in Gola** (`base.com.DueDitaInGola`) | NC | Subisci 5 [[HIT]]. Azzeri la tua [[T]] e la tua [[L]]. |
| 2 | **Alla Goccia** (`base.pino.GoingBerserk`) | NC | Spendi tutta la tua [[L]]. [[HIT]] all'avversario pari a 10 più la [[L]] spesa. |
| 2 | **Grappa della Casa** (`base.items.GrappaDellaCasa`) | R | Quando lo consumi: +25 [[L]]. Perdi 5 [[A]]. |

### Mazzo di prova di SPAZIENZIO DE LA UCCISO — `prova-b2-spazienzio`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 5 · NC 12 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | Consumi un tuo oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | 25 [[V]]: 35 [[HIT]] all'avversario. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 6 più metà della [[V]] che ti resta. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | Per 4 turni, contando questo, subisci metà dei [[CUT]] che subiresti. +10 [[V]]. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | 5 [[V]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | Perdi 5 [[A]]. +10 [[V]]. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | Quando lo consumi: infliggi una volta e mezza i [[HIT]] che infliggeresti (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | 5 [[V]]: in questo turno subisci un quarto dei [[HIT]] che subiresti. +5 [[A]]. |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | 15 [[V]]: 10 [[HIT]] all'avversario. L'avversario guadagna 10 [[T]]. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | 5 [[V]]: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | In campo, a fine turno: perdi 4 [[A]]. Quando lo consumi: +15 [[V]]. |

### Mazzo di prova di Beppe Bulletta — `prova-b2-beppe`

Personaggio: **Beppe Bulletta** (P), salute 75, A 25, V 25; oggetti 3; immunità: nessuna. Regolari: **20** carte, 12 titoli (C 5 · NC 12 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Questo Torna Utile** (`base.gigi.QuestoTornaUtile`) | NC | +4 [[V]]. Consumi un tuo oggetto. |
| bound | **Cuffie e Testa Bassa** (`base.gigi.bound.UnaStrettaEPassa`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **Colpo col Cacciavite** (`base.gigi.bound.ColpoDiCacciavite`) | C | +2 [[V]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Disassemblare** (`bruiser.BreakYourToy`) | NC | 5 [[V]]: distruggi un oggetto dell'avversario. |
| 2 | **Chiave da Tredici** (`base.gigi.ChiaveDaTredici`) | NC | 10 [[V]]: 20 [[CUT]] all'avversario. |
| 2 | **Preparare il Lavoro** (`base.gigi.ColpoDiChiaveInglese`) | NC | 4 [[CUT]] all'avversario. Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene». Se lo trovi: +15 [[V]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]]. |
| 1 | **Secondo Bagagliaio** (`base.gigi.SottoIlCofano`) | C | 5 [[V]]: in questo turno subisci metà dei [[HIT]] e tre quarti dei [[CUT]] che subiresti. +5 [[V]], +5 [[A]]. |
| 1 | **Lavoro Fatto Bene** (`base.gigi.LavoroFattoBene`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 15 più 4 per ogni tuo oggetto in campo. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | 10 [[A]]: prendi un oggetto dell'avversario e mettilo accanto a te. |
| 2 | **Guanti da Officina** (`base.items.GuantiDaOfficina`) | NC | Quando lo consumi: per 3 turni, contando questo, infliggi una volta e un quarto i [[HIT]] che infliggeresti (equipaggiamento). |
| 1 | **Casco da Cantiere** (`base.items.CascoDaLavoro`) | C | Quando lo consumi: per 3 turni, contando questo, subisci tre quarti dei [[HIT]] che subiresti (equipaggiamento). |
| 2 | **AMMALIAMOTI DI BOTTE** (`bruiser.SickeningBlow`) | C | 15 [[V]]: 10 [[HIT]] all'avversario. L'avversario guadagna 10 [[T]]. |
| 2 | **PERMESSO SCUSA PUOI SMETTERLA** (`bruiser.BadEducation`) | NC | 5 [[V]]: togli all'avversario i suoi equipaggiamenti. 8 [[HIT]] all'avversario. |
| 2 | **Coccio di Bottiglia** (`base.com.CoccioDiBottiglia`) | R | 5 [[V]]: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | In campo, a fine turno: perdi 4 [[A]]. Quando lo consumi: +15 [[V]]. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-sergio-conto`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 13 · R 3).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | +8 [[A]]. Consumi un tuo oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | 5 [[A]]: l'avversario perde 10 [[A]]. 4 [[HIT]] all'avversario. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | 15 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se era un attacco, gli rimandi metà dei danni fissi scritti sulla sua carta, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | 10 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | 5 [[A]]: 8 [[HIT]] all'avversario. Se l'avversario è Vulnerabile: 6 [[HIT]] all'avversario. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | 15 [[A]]: 25 [[HIT]] all'avversario. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | 10 [[A]]: l'avversario perde [[A]] pari a metà della [[A]] che ti resta. [[HIT]] all'avversario pari a 5 più metà della [[A]] che ti resta. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | Vendi il tuo oggetto scelto, che esce senza il suo effetto: +8 [[H]]. Se non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | 5 [[V]]: in questo turno subisci un quarto dei [[HIT]] che subiresti. +5 [[A]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | Copia accanto a te un oggetto a caso dell'avversario. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | In campo, a fine turno: perdi 4 [[A]]. Quando lo consumi: +15 [[V]]. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-sergio-sigaretta`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 11 · R 5).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | +8 [[A]]. Consumi un tuo oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | 5 [[A]]: l'avversario perde 10 [[A]]. 4 [[HIT]] all'avversario. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | 15 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se era un attacco, gli rimandi metà dei danni fissi scritti sulla sua carta, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | 10 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | 5 [[A]]: 8 [[HIT]] all'avversario. Se l'avversario è Vulnerabile: 6 [[HIT]] all'avversario. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | 15 [[A]]: 25 [[HIT]] all'avversario. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | 10 [[A]]: l'avversario perde [[A]] pari a metà della [[A]] che ti resta. [[HIT]] all'avversario pari a 5 più metà della [[A]] che ti resta. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | Vendi il tuo oggetto scelto, che esce senza il suo effetto: +8 [[H]]. Se non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | 5 [[V]]: in questo turno subisci un quarto dei [[HIT]] che subiresti. +5 [[A]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | Copia accanto a te un oggetto a caso dell'avversario. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | In campo, a fine turno: +2 [[T]]. Quando lo consumi: +10 [[A]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b2-celestina`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 5 · NC 7 · R 8).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | +5 [[T]]. Consumi un tuo oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | +2 [[T]]. 2 [[CUT]] all'avversario. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | +2 [[T]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | Subisci 2 [[HIT]]. 8 [[POISON]] all'avversario. L'avversario guadagna 4 [[T]]. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | 10 [[T]]: 20 [[POISON]] all'avversario. L'avversario guadagna 5 [[T]]. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | Guadagni [[H]] pari a metà della tua [[T]]. Perdi tutta la tua [[T]]. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | 10 [[T]]: annulli le mosse contro di te che si risolvono dopo la tua. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | 10 [[T]]: dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]]. 10 [[POISON]] all'avversario. A fine turno diventi immune a [[T]]. |
| 1 | **Afferrare** (`com.Grab`) | C | Consumi un tuo oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | 10 [[A]]: +5 [[V]]. 10 [[HIT]] all'avversario. |
| 1 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | Quando lo consumi: diventi immune a [[T]] e [[L]]; +20 [[L]], +20 [[T]]. Alla fine del quinto turno, contando questo, perdi tutte le immunità e tutti gli stati, poi subisci 20 [[POISON]]. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Ce l'Hai Due Spicci?** (`base.com.BeggingMoney`) | R | Copia accanto a te un oggetto a caso dell'avversario. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | In questo turno e nel prossimo subisci una volta e un quarto i [[HIT]] e [[CUT]] che subiresti. +10 [[H]]. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | In campo, a fine turno: +2 [[T]]. Quando lo consumi: +10 [[A]]. |

### Mazzo di prova di Celestina Bucatina — `prova-b2-rischio9`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 5 · NC 9 · R 6).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | +5 [[T]]. Consumi un tuo oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | +2 [[T]]. 2 [[CUT]] all'avversario. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | +2 [[T]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | Subisci 2 [[HIT]]. 8 [[POISON]] all'avversario. L'avversario guadagna 4 [[T]]. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | 10 [[T]]: 20 [[POISON]] all'avversario. L'avversario guadagna 5 [[T]]. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | Guadagni [[H]] pari a metà della tua [[T]]. Perdi tutta la tua [[T]]. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | 10 [[T]]: annulli le mosse contro di te che si risolvono dopo la tua. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | 10 [[T]]: dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]]. 10 [[POISON]] all'avversario. A fine turno diventi immune a [[T]]. |
| 1 | **Afferrare** (`com.Grab`) | C | Consumi un tuo oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | 10 [[A]]: +5 [[V]]. 10 [[HIT]] all'avversario. |
| 1 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | Quando lo consumi: diventi immune a [[T]] e [[L]]; +20 [[L]], +20 [[T]]. Alla fine del quinto turno, contando questo, perdi tutte le immunità e tutti gli stati, poi subisci 20 [[POISON]]. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Riprendere Fiato** (`base.com.SecondoFiato`) | R | In questo turno e nel prossimo subisci una volta e un quarto i [[HIT]] e [[CUT]] che subiresti. +10 [[H]]. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | In campo, a fine turno: +2 [[T]]. Quando lo consumi: +10 [[A]]. |
| 2 | **Scatto Repentino** (`base.com.ShuffleFeet`) | NC | Scambia tutti i tuoi oggetti con quelli dell'avversario; ognuno ne tiene quanti ne può tenere. |

### Mazzo di prova di Sergio Sommerso — `prova-b2-rischio10`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 11 titoli (C 4 · NC 15 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | +8 [[A]]. Consumi un tuo oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | 5 [[A]]: l'avversario perde 10 [[A]]. 4 [[HIT]] all'avversario. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | 15 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se era un attacco, gli rimandi metà dei danni fissi scritti sulla sua carta, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | 10 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | 5 [[A]]: 8 [[HIT]] all'avversario. Se l'avversario è Vulnerabile: 6 [[HIT]] all'avversario. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | 15 [[A]]: 25 [[HIT]] all'avversario. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | 10 [[A]]: l'avversario perde [[A]] pari a metà della [[A]] che ti resta. [[HIT]] all'avversario pari a 5 più metà della [[A]] che ti resta. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | Vendi il tuo oggetto scelto, che esce senza il suo effetto: +8 [[H]]. Se non c'è più, niente. |
| 2 | **GENTILE IL TUO CAREZZO** (`bruiser.CantFeelAnything`) | NC | 5 [[V]]: in questo turno subisci un quarto dei [[HIT]] che subiresti. +5 [[A]]. |
| 2 | **Mano Lesta** (`base.com.ManoLesta`) | C | +5 [[A]]. L'avversario perde 5 [[A]]. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | In campo, a fine turno: perdi 4 [[A]]. Quando lo consumi: +15 [[V]]. |
| 2 | **Scatto Repentino** (`base.com.ShuffleFeet`) | NC | Scambia tutti i tuoi oggetti con quelli dell'avversario; ognuno ne tiene quanti ne può tenere. |

### Mazzo di prova di SPAZIENZIO DE LA UCCISO — `iso-b2-conto`

Personaggio: **SPAZIENZIO DE LA UCCISO** (P), salute 70, A 20, V 25; oggetti 1; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 8 · NC 11 · R 1).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **ADOPERIAMOTI** (`com.basic.BruiserGrab`) | C | Consumi un tuo oggetto. |
| bound | **LIEVE FASTIDIO** (`bruiser.character.LittleRage`) | C | +5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti. |
| bound | **SVEGLIAMOCI - MA TU NO** (`bruiser.character.LittleSmack`) | C | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **GARGANTUESCO IMPATTO SUL TU** (`bruiser.SuperImpact`) | NC | 25 [[V]]: 35 [[HIT]] all'avversario. |
| 1 | **SPEDIAMOTI DUNQUE IN O-AHIO** (`bruiser.ExtremelyViolentBlow`) | R | 10 [[V]]: [[HIT]] all'avversario pari a 6 più metà della [[V]] che ti resta. |
| 2 | **PAZIENZA: FINITA** (`bruiser.Glare`) | NC | Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO». Se lo trovi: +25 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **NON GIOCARE COL COLTELLO NO** (`bruiser.MadeOfStone`) | C | Per 4 turni, contando questo, subisci metà dei [[CUT]] che subiresti. +10 [[V]]. |
| 2 | **FAI BASTA** (`bruiser.YouStop`) | NC | 5 [[V]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. |
| 2 | **GABBIANO, DUNQUE VOLIAMOTI** (`bruiser.SeagullFly`) | C | 10 [[V]]: 20 [[HIT]] all'avversario. Su questo danno contano solo i tuoi stati positivi. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +2 [[H]]. |
| 1 | **Foratone da 28** (`base.com.MattoneDelCantiere`) | C | 15 [[V]]: 25 [[HIT]] all'avversario. |
| 1 | **ORMALE GUARIAMOTI** (`bruiser.HealingBlow`) | NC | 20 [[V]]: 30 [[HIT]] all'avversario. Azzeri la [[T]] e la [[L]] dell'avversario. |
| 1 | **Denti Stretti** (`base.com.DentiStretti`) | C | Perdi 5 [[A]]. +10 [[V]]. |
| 1 | **Posacenere di Vetro** (`base.items.PosacenereDiVetro`) | NC | Quando lo consumi: infliggi una volta e mezza i [[HIT]] che infliggeresti (equipaggiamento). Dopo il primo uso dura solo fino a fine turno. |
| 1 | **SGOMBERIAMOVI** (`base.bruiser.TiFaccioSpazio`) | NC | Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU». Se lo trovi: +15 [[V]], +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[V]], +5 [[A]]. |
| 2 | **Conto del Tavolo Sei** (`base.items.ContoDelTavoloSei`) | NC | In campo, a fine turno: perdi 4 [[A]]. Quando lo consumi: +15 [[V]]. |

### Mazzo di prova di Celestina Bucatina — `iso-b2-sigaretta`

Personaggio: **Celestina Bucatina** (P), salute 65, A 35, T 20; oggetti 2; immunità: T. Regolari: **20** carte, 13 titoli (C 9 · NC 7 · R 4).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Desiderio Incontrollabile** (`com.basic.ToxicGrab`) | NC | +5 [[T]]. Consumi un tuo oggetto. |
| bound | **Fondo del Posacenere** (`junkie.character.PatheticBlade`) | C | +2 [[T]]. 2 [[CUT]] all'avversario. |
| bound | **Rintanarsi nel Cappotto** (`base.tossico.bound.RaschiareIlFondo`) | C | +2 [[T]]. In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **L'Ultimo Tiro** (`junkie.LethalHeroinDose`) | NC | Subisci 2 [[HIT]]. 8 [[POISON]] all'avversario. L'avversario guadagna 4 [[T]]. Rincara 5. |
| 2 | **Fare l'Inventario** (`junkie.MethDrivenRage`) | NC | Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel». Se lo trovi: +10 [[T]], +5 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Tossicone Scatarrante** (`junkie.Cough`) | NC | 10 [[T]]: 20 [[POISON]] all'avversario. L'avversario guadagna 5 [[T]]. |
| 2 | **Metabolismo Corrotto** (`junkie.PervertedMetabolism`) | C | Guadagni [[H]] pari a metà della tua [[T]]. Perdi tutta la tua [[T]]. |
| 2 | **Riflessi Aumentati dalla Speed** (`junkie.AmphetamineReflexes`) | NC | 10 [[T]]: annulli le mosse contro di te che si risolvono dopo la tua. |
| 1 | **Trascinare nel Tunnel** (`junkie.ToxicBloodDrain`) | R | 10 [[T]]: dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]]. 10 [[POISON]] all'avversario. A fine turno diventi immune a [[T]]. |
| 2 | **Afferrare** (`com.Grab`) | C | Consumi un tuo oggetto. |
| 1 | **Estrema Fretta di Alcolizzarsi** (`base.com.RincorsaDalMarciapiede`) | C | 10 [[A]]: +5 [[V]]. 10 [[HIT]] all'avversario. |
| 1 | **Furto con Destrezza** (`com.Steal`) | C | 10 [[A]]: prendi un oggetto dell'avversario e mettilo accanto a te. |
| 1 | **Fasciatura d'Emergenza** (`base.com.FasciaturaColFazzolettaccio`) | C | Perdi 5 [[A]]. +8 [[H]]. |
| 2 | **Kebab Abbandonato** (`base.items.PaninoDelKebab`) | C | Quando lo consumi: +10 [[H]], +2 [[T]]. |
| 1 | **Mescolone Micidiale** (`com.items.MarvelousCocktail`) | R | Quando lo consumi: diventi immune a [[T]] e [[L]]; +20 [[L]], +20 [[T]]. Alla fine del quinto turno, contando questo, perdi tutte le immunità e tutti gli stati, poi subisci 20 [[POISON]]. |
| 1 | **Un Assaggino** (`base.tossico.UnAssaggino`) | NC | Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante». Se lo trovi: +20 [[T]] e diventi Vulnerabile. Se non lo trovi: +5 [[T]]. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | In campo, a fine turno: +2 [[T]]. Quando lo consumi: +10 [[A]]. |

### Mazzo di prova di Sergio Sommerso — `iso-b2-sigaretta-sergio`

Personaggio: **Sergio Sommerso** (P), salute 85, A 35, V 10; oggetti 2; immunità: nessuna. Regolari: **20** carte, 13 titoli (C 5 · NC 11 · R 4).

| Copie | Carta | Rarità | Testo |
|---:|---|---|---|
| basic | **Messo in Conto** (`base.cesira.LoMettoInConto`) | R | +8 [[A]]. Consumi un tuo oggetto. |
| bound | **Tecnica Manipolatoria** (`base.cesira.bound.Battutina`) | NC | Perdi un quarto della tua [[T]] e un quarto della tua [[L]]. 2 [[HIT]] all'avversario. |
| bound | **Fare il Vago** (`base.cesira.bound.FareIlVago`) | NC | In questo turno subisci tre quarti dei danni che subiresti. |
| last resort | **Addosso!!!** (`com.last.Struggle`) | C | Subisci 5 [[HIT]]. 10 [[HIT]] all'avversario. Rincara 5 (2 a te). |
| 2 | **Opportuna Distrazione** (`base.cesira.OhGuardaLa`) | NC | 5 [[A]]: l'avversario perde 10 [[A]]. 4 [[HIT]] all'avversario. Annuncia «Segreto di Pulcinella» o «Conto Salato». Se lo trovi: +15 [[A]] e diventi Vulnerabile. Se non lo trovi: +5 [[A]]. |
| 2 | **Buon Vecchio Ricatto** (`base.cesira.Ricatto`) | NC | 15 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se era un attacco, gli rimandi metà dei danni fissi scritti sulla sua carta, dello stesso tipo. |
| 1 | **Copione Già Visto** (`base.cesira.LoSapevo`) | NC | 10 [[A]]: se la mossa dell'avversario si risolve dopo la tua, la annulli. Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile. |
| 2 | **Conto Salato** (`base.cesira.ContoSalato`) | NC | 5 [[A]]: 8 [[HIT]] all'avversario. Se l'avversario è Vulnerabile: 6 [[HIT]] all'avversario. |
| 2 | **Segreto di Pulcinella** (`base.cesira.LoSannoTutti`) | C | 15 [[A]]: 25 [[HIT]] all'avversario. |
| 1 | **Scherzo Oltre il Limite** (`base.cesira.Malelingue`) | R | 10 [[A]]: l'avversario perde [[A]] pari a metà della [[A]] che ti resta. [[HIT]] all'avversario pari a 5 più metà della [[A]] che ti resta. |
| 1 | **STORDIAMOTI HO DETTO** (`bruiser.StunningBlow`) | NC | 10 [[V]]: l'avversario perde 10 [[A]]. 10 [[HIT]] all'avversario. |
| 2 | **Tecnica del Carapace Mentale** (`base.com.TartarugaSulMarciapiede`) | C | 5 [[A]]: in questo turno subisci metà dei [[HIT]] e [[CUT]] che subiresti. +2 [[H]]. |
| 1 | **Spintone** (`base.com.Spintone`) | C | 8 [[HIT]] all'avversario. |
| 1 | **Santino di San Briaco** (`base.items.SantinoDellaPortinaia`) | R | Quando lo consumi: diventi immune a [[L]] per 3 turni. |
| 1 | **Svegliaaah!** (`base.com.AcquaInFaccia`) | NC | 5 [[A]]: azzeri la [[L]] dell'avversario. 4 [[HIT]] all'avversario. |
| 2 | **Fiuto per gli Affari** (`base.cesira.LoRivendo`) | NC | Vendi il tuo oggetto scelto, che esce senza il suo effetto: +8 [[H]]. Se non c'è più, niente. |
| 2 | **Sigaretta Accesa** (`base.items.SigarettaAccesa`) | R | In campo, a fine turno: +2 [[T]]. Quando lo consumi: +10 [[A]]. |

<!-- fine generato -->
