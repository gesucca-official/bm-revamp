# Botte Micidiali — Set Base

Versione **1.0 — 23 novembre 2026**. Documento del set `base`, con le schede normative delle sue carte (regolamento, R00 e R07). Richiede il regolamento 2.0.

Questo documento è generato da `tools/set-catalog/set_catalog.py --vivo` dal file del set `server/src/main/resources/sets/base.json`, che lo stesso comando ricava dalla bozza `server/src/test/resources/set-base/bozza.json` (versione 1.7 del file) togliendo i mazzi di prova: non si modifica a mano, si cambia la bozza e si rigenera (decisioni D175 e D183 del piano Set Base; il formato del file è descritto in `docs/formato-file-set.md`). Il regolamento governa il sistema, le schede governano le carte: una scheda deroga a una regola solo se lo dice esplicitamente. La scheda normativa di ogni carta è il suo **testo completo**; il testo breve stampato sulla carta è nell'allegato ed è descrittivo: in caso di dubbio prevale la scheda. Ruoli, guadagni e danno nominale sono descrittivi (R07a).

Nelle schede H, A, V, T e L sono le risorse (HEALTH, ALERTNESS, VIOLENCE, TOXICITY, ALCOHOL) e HIT, CUT e POISON i tipi di danno; sulle carte stampate e nel client sono simboli. Ogni scheda indica in testa nome, tipologia e sottotipo, rarità, costo e priorità, poi l'identificatore stabile della classe e, se c'è, lo slot della carta stampata.

## S1 — Contenuto e starter

Il set comprende **124 carte: 7 personaggio, 99 azione e 18 oggetto**, oltre a un token oggetto generato durante il gioco, «Bottiglia Spaccata». Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte alla preparazione secondo R01a.

Rarità (R07): 42 COMMON, 56 UNCOMMON, 19 RARE, 7 PROTAGONIST.

Ogni starter è conforme a R02: 20 carte regolari, oltre alla base, alle due legate scelte e all'ultima risorsa. Le composizioni sono qui e nell'allegato.

Ogni starter ha un nome e una categoria (D182): **base** Spazienzio e Mara; **avanzati** Celestina, Piera e Beppe. La quick assegna a caso uno dei 5 starter, base o avanzato (R01).

| Starter | Nome | Categoria | Personaggio | Base | Legate | Ultima risorsa |
|---|---|---|---|---|---|---|
| `starter-spazienzio` | Spazienzio | base | SPAZIENZIO DE LA UCCISO | ADOPERIAMOTI | LIEVE FASTIDIO e SVEGLIAMOCI - MA TU NO | Addosso!!! |
| `starter-mara` | Mara | base | Mara Contromano | Requisire al Volo | Sventare l'Assassinio e Semaforo Rosso | Addosso!!! |
| `starter-tossico` | Celestina | avanzato | Celestina Bucatina | Desiderio Incontrollabile | Fondo del Posacenere e Rintanarsi nel Cappotto | L'Ultimo Tiro |
| `starter-pino` | Piera | avanzato | Piera Pinot | Fino all'Ultima Goccia | Posto Fisso e Violenta Spruzzata di Seltz | Ultimo Giro |
| `starter-gigi` | Beppe | avanzato | Beppe Bulletta | Questo Torna Utile | Cuffie e Testa Bassa e Colpo col Cacciavite | Addosso!!! |

**`starter-spazienzio`**, SPAZIENZIO DE LA UCCISO: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| SGOMBERIAMOVI | base | `base.bruiser.TiFaccioSpazio` | 1 |
| Denti Stretti | base | `base.com.DentiStretti` | 1 |
| Foratone da 28 | base | `base.com.MattoneDelCantiere` | 1 |
| Tecnica del Carapace Mentale | base | `base.com.TartarugaSulMarciapiede` | 2 |
| Posacenere di Vetro | base | `base.items.PosacenereDiVetro` | 1 |
| SPEDIAMOTI DUNQUE IN O-AHIO | base | `bruiser.ExtremelyViolentBlow` | 1 |
| PAZIENZA: FINITA | base | `bruiser.Glare` | 2 |
| ORMALE GUARIAMOTI | base | `bruiser.HealingBlow` | 1 |
| NON GIOCARE COL COLTELLO NO | base | `bruiser.MadeOfStone` | 2 |
| GABBIANO, DUNQUE VOLIAMOTI | base | `bruiser.SeagullFly` | 2 |
| GARGANTUESCO IMPATTO SUL TU | base | `bruiser.SuperImpact` | 2 |
| FAI BASTA | base | `bruiser.YouStop` | 2 |
| Negroni Trovato per Terra | base | `com.items.CocktailOnTheGround` | 2 |

**`starter-mara`**, Mara Contromano: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| Spintone | base | `base.com.Spintone` | 1 |
| Sputo nel Posacenere | base | `base.com.SputoDaPosacenere` | 2 |
| Tecnica del Carapace Mentale | base | `base.com.TartarugaSulMarciapiede` | 1 |
| Espresso della Macchinetta | base | `base.items.EspressoDelDistributore` | 2 |
| Ghiaccio nel Tovagliolo | base | `base.items.GhiaccioNelTovagliolo` | 1 |
| Giubbotto di Finta Pelle | base | `base.items.GiubbottoDiFintaPelle` | 1 |
| Kebab Abbandonato | base | `base.items.PaninoDelKebab` | 2 |
| Lazo del Rider | base | `base.mara.CinghiataDiTraverso` | 1 |
| Sgommata | base | `base.mara.Sgommata` | 2 |
| Slalom d'Avvicinamento | base | `base.mara.Slalom` | 2 |
| Agilità Innaturale | base | `base.mara.SorpassoInCurva` | 2 |
| Traiettoria Imprevedibile | base | `base.mara.TiStringoLaCurva` | 1 |
| Unta e Bisunta | base | `base.mara.TraDueParaurti` | 2 |

**`starter-tossico`**, Celestina Bucatina: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| Fasciatura d'Emergenza | base | `base.com.FasciaturaColFazzolettaccio` | 1 |
| Estrema Fretta di Alcolizzarsi | base | `base.com.RincorsaDalMarciapiede` | 1 |
| Kebab Abbandonato | base | `base.items.PaninoDelKebab` | 2 |
| Pasticca Abbandonata | base | `base.items.PasticcaTrovataSulBancone` | 2 |
| Un Assaggino | base | `base.tossico.UnAssaggino` | 1 |
| Afferrare | base | `com.Grab` | 2 |
| Furto con Destrezza | base | `com.Steal` | 1 |
| Mescolone Micidiale | base | `com.items.MarvelousCocktail` | 1 |
| Riflessi Aumentati dalla Speed | base | `junkie.AmphetamineReflexes` | 2 |
| Tossicone Scatarrante | base | `junkie.Cough` | 2 |
| Fare l'Inventario | base | `junkie.MethDrivenRage` | 2 |
| Metabolismo Corrotto | base | `junkie.PervertedMetabolism` | 2 |
| Trascinare nel Tunnel | base | `junkie.ToxicBloodDrain` | 1 |

**`starter-pino`**, Piera Pinot: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| Due Dita in Gola | base | `base.com.DueDitaInGola` | 1 |
| Fasciatura d'Emergenza | base | `base.com.FasciaturaColFazzolettaccio` | 1 |
| Spintone | base | `base.com.Spintone` | 2 |
| Amaro nel Bicchiere di Plastica | base | `base.items.AmaroNelBicchiereDiPlastica` | 2 |
| Alla Goccia | base | `base.pino.GoingBerserk` | 2 |
| Avamposto Fortificato al Bancone | base | `base.pino.IlBanconeRegge` | 2 |
| Un Altro e Arrivo | base | `base.pino.OffroIo` | 2 |
| Un Altro... Grappino... | base | `base.pino.PrimaIlBrindisi` | 1 |
| Rutto a Bruciapelo | base | `base.pino.RuttoADistanzaSociale` | 1 |
| Scompenso da Ultimo Giro | base | `base.pino.TestataDaUltimoGiro` | 2 |
| Afferrare | base | `com.Grab` | 1 |
| Doppio Malto da Discount | base | `com.items.AnotherRottenBeer` | 1 |
| Bionda da 66, Calda | base | `com.items.RottenBeer` | 2 |

**`starter-gigi`**, Beppe Bulletta: 20 carte regolari.

| Carta | Set | Identificatore | Copie |
|---|---|---|---:|
| Due Dita in Gola | base | `base.com.DueDitaInGola` | 1 |
| Spintone | base | `base.com.Spintone` | 1 |
| Chiave da Tredici | base | `base.gigi.ChiaveDaTredici` | 2 |
| Preparare il Lavoro | base | `base.gigi.ColpoDiChiaveInglese` | 2 |
| Lavoro Fatto Bene | base | `base.gigi.LavoroFattoBene` | 1 |
| Secondo Bagagliaio | base | `base.gigi.SottoIlCofano` | 1 |
| Metodo Empirico | base | `base.gigi.UnaStrettaDiProva` | 1 |
| Casco da Cantiere | base | `base.items.CascoDaLavoro` | 2 |
| Espresso della Macchinetta | base | `base.items.EspressoDelDistributore` | 1 |
| Giubbotto di Finta Pelle | base | `base.items.GiubbottoDiFintaPelle` | 2 |
| Guanti da Officina | base | `base.items.GuantiDaOfficina` | 2 |
| Disassemblare | base | `bruiser.BreakYourToy` | 2 |
| GABBIANO, DUNQUE VOLIAMOTI | base | `bruiser.SeagullFly` | 1 |
| Furto con Destrezza | base | `com.Steal` | 1 |

## S2 — Carte personaggio

| Personaggio | H | A | V | T | L | Capacità oggetti | Immunità iniziale | Base |
|---|---:|---:|---:|---:|---:|---:|---|---|
| SPAZIENZIO DE LA UCCISO | 70 | 20 | 25 | 0 | 0 | 1 | Nessuna | ADOPERIAMOTI |
| Mara Contromano | 65 | 45 | 0 | 0 | 0 | 2 | Nessuna | Requisire al Volo |
| Celestina Bucatina | 65 | 35 | 0 | 20 | 0 | 2 | TOXICITY | Desiderio Incontrollabile |
| Piera Pinot | 80 | 15 | 0 | 0 | 15 | 2 | Nessuna | Fino all'Ultima Goccia |
| Beppe Bulletta | 75 | 25 | 25 | 0 | 0 | 3 | Nessuna | Questo Torna Utile |
| Sergio Sommerso | 85 | 35 | 10 | 0 | 0 | 2 | Nessuna | Messo in Conto |
| Duccio Braccio Teso | 115 | 15 | 0 | 0 | 0 | 2 | Nessuna | Prima gli Italiani |

#### SPAZIENZIO DE LA UCCISO — Personaggio · PROTAGONIST

`bruiser.character.BigBadBruiser` · slot PG-SPA

Personaggio (regolamento, R01a). Parti con 70 H, 20 A e 25 V; T e L partono da 0 (regolamento, R01). Puoi tenere 1 oggetto vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). La tua azione base è «ADOPERIAMOTI».

#### Mara Contromano — Personaggio · PROTAGONIST

`base.character.Mara` · slot PG-MAR

Personaggio (regolamento, R01a). Parti con 65 H e 45 A; V, T e L partono da 0 (regolamento, R01). Puoi tenere 2 oggetti vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). La tua azione base è «Requisire al Volo».

#### Celestina Bucatina — Personaggio · PROTAGONIST

`junkie.character.ToxicJunkie` · slot PG-TOS

Personaggio (regolamento, R01a). Parti con 65 H, 35 A e 20 T; V e L partono da 0 (regolamento, R01). Puoi tenere 2 oggetti vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). Sei immune a T: la tua T non fa effetto a fine turno; costi, guadagni, perdite e danni POISON restano, e un'altra carta può toglierti l'immunità (regolamento, R07b). La tua azione base è «Desiderio Incontrollabile».

#### Piera Pinot — Personaggio · PROTAGONIST

`base.character.Pino` · slot PG-PIN

Personaggio (regolamento, R01a). Parti con 80 H, 15 A e 15 L; V e T partono da 0 (regolamento, R01). Puoi tenere 2 oggetti vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). La tua azione base è «Fino all'Ultima Goccia».

#### Beppe Bulletta — Personaggio · PROTAGONIST

`base.character.Gigi` · slot PG-GIG

Personaggio (regolamento, R01a). Parti con 75 H, 25 A e 25 V; T e L partono da 0 (regolamento, R01). Puoi tenere 3 oggetti vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). La tua azione base è «Questo Torna Utile».

#### Sergio Sommerso — Personaggio · PROTAGONIST

`base.character.Cesira` · slot PG-CES

Personaggio (regolamento, R01a). Parti con 85 H, 35 A e 10 V; T e L partono da 0 (regolamento, R01). Puoi tenere 2 oggetti vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). La tua azione base è «Messo in Conto».

#### Duccio Braccio Teso — Personaggio · PROTAGONIST

`base.character.Rocco` · slot PG-ROC

Personaggio (regolamento, R01a). Parti con 115 H e 15 A; V, T e L partono da 0 (regolamento, R01). Puoi tenere 2 oggetti vicino a te: quando ne arriva uno in più, anche rubato, scambiato, copiato o creato, sparisce il più vecchio (regolamento, R02). La tua azione base è «Prima gli Italiani».

## S3 — Schede delle carte

Una scheda per carta, raggruppate per personaggio (base, legate, ultima risorsa, poi le altre carte del personaggio); dopo, le azioni generiche, gli oggetti e i token.

### SPAZIENZIO DE LA UCCISO

#### ADOPERIAMOTI — Azione, Base · COMMON · Costo — · Priorità −1

`com.basic.BruiserGrab` · slot SPA-BA

Azione base di SPAZIENZIO DE LA UCCISO (regolamento, R01a). Nessun costo in risorse. Priorità -1. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve: consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

#### LIEVE FASTIDIO — Azione, Legata al personaggio · COMMON · Costo — · Priorità 2

`bruiser.character.LittleRage` · slot SPA-BO1

Azione legata a SPAZIENZIO DE LA UCCISO (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 V. 2. Ottieni lo stato positivo «LIEVE FASTIDIO», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### SVEGLIAMOCI - MA TU NO — Azione, Legata al personaggio · COMMON · Costo — · Priorità 1

`bruiser.character.LittleSmack` · slot SPA-BO2

Azione legata a SPAZIENZIO DE LA UCCISO (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Perdi un quarto della tua T. 2. Perdi un quarto della tua L. 3. Infliggi 2 HIT all'avversario.

La tua T e la tua L si leggono quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 HIT.

#### VIOLENZAZIONE — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 0

`base.spazienzio.bound.TestaAlMuro` · slot SPA-BO3

Azione legata a SPAZIENZIO DE LA UCCISO (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Subisci 4 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci. 2. Guadagni 8 V.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

#### GARGANTUESCO IMPATTO SUL TU — Azione, Regolare · UNCOMMON · Costo 25 V · Priorità 0

`bruiser.SuperImpact` · slot SPA-AR1

Azione regolare (regolamento, R01a). Costo: 25 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 35 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 35 HIT.

#### SPEDIAMOTI DUNQUE IN O-AHIO — Azione, Regolare · RARE · Costo 10 V · Priorità 1

`bruiser.ExtremelyViolentBlow` · slot SPA-AR2

Azione regolare (regolamento, R01a). Costo: 10 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi all'avversario HIT pari a 6 più metà della V che ti resta.

La tua V si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 6 HIT.

#### PAZIENZA: FINITA — Azione, Regolare · UNCOMMON · Costo — · Priorità 0

`bruiser.Glare` · slot SPA-AR3

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su di te.

Annuncia «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «GARGANTUESCO IMPATTO SUL TU» o «SPEDIAMOTI DUNQUE IN O-AHIO»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 25 V e 15 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 V e 5 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

#### NON GIOCARE COL COLTELLO NO — Azione, Regolare · COMMON · Costo — · Priorità 0

`bruiser.MadeOfStone` · slot SPA-AR4

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «NON GIOCARE COL COLTELLO NO»: da quando la carta si risolve per 4 turni, contando questo, fino agli effetti di fine turno dell'ultimo compresi, subisci metà dei CUT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Guadagni 10 V.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### FAI BASTA — Azione, Regolare · UNCOMMON · Costo 5 V · Priorità 2

`bruiser.YouStop` · slot SPA-AR5

Azione regolare (regolamento, R01a). Costo: 5 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, se la mossa dell'avversario che hai scelto deve ancora risolversi, la annulli; se si è già risolta, o l'avversario non ha una mossa, non succede niente. Deve ancora risolversi vuol dire che viene dopo la tua nell'ordine di risoluzione del turno: priorità più bassa, oppure pari priorità e meno A dopo i costi, oppure pari priorità e pari A se il suo giocatore viene dopo di te nell'ordine d'inserimento nella partita (regolamento, R04). Una mossa annullata non ha effetti, ma il suo costo è già pagato e il suo giocatore pesca come sempre (regolamento, R04).

#### SGOMBERIAMOVI — Azione, Regolare · UNCOMMON · Costo — · Priorità 0

`base.bruiser.TiFaccioSpazio` · slot SPA-AR6

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su di te.

Annuncia «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «SPEDIAMOTI DUNQUE IN O-AHIO» o «GARGANTUESCO IMPATTO SUL TU»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 15 V e 15 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 V e 5 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

### Mara Contromano

#### Requisire al Volo — Azione, Base · COMMON · Costo — · Priorità 2

`base.mara.PresoAlVolo` · slot MAR-BA

Azione base di Mara Contromano (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve, nell'ordine: 1. Perdi 5 A. 2. Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Sventare l'Assassinio — Azione, Legata al personaggio · COMMON · Costo — · Priorità 1

`base.mara.bound.PassoStretto` · slot MAR-BO1

Azione legata a Mara Contromano (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Perdi un quarto della tua T. 2. Perdi un quarto della tua L. 3. Infliggi 2 CUT all'avversario.

La tua T e la tua L si leggono quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 CUT.

#### Semaforo Rosso — Azione, Legata al personaggio · COMMON · Costo — · Priorità 2

`base.mara.bound.CambioMarcia` · slot MAR-BO2

Azione legata a Mara Contromano (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 A. 2. Ottieni lo stato positivo «Semaforo Rosso», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Tagliare la Strada — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 2

`base.mara.bound.ColpoDiStriscio` · slot MAR-BO3

Azione legata a Mara Contromano (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: Gioca d'anticipo (regolamento, R07b): se la tua mossa si risolve in un gruppo di velocità precedente a quello della mossa dell'avversario che hai scelto, cioè con priorità più alta, oppure con pari priorità e più A dopo i costi, succede anche questo: l'avversario perde 4 A. Nello stesso gruppo di velocità, o se l'avversario non ha una mossa, no; vale anche se la sua mossa sarà annullata più tardi o se lui è già a terra con la mossa ancora da risolvere.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Lazo del Rider — Azione, Regolare · RARE · Costo 20 A · Priorità 1

`base.mara.CinghiataDiTraverso` · slot MAR-AR1

Azione regolare (regolamento, R01a). Costo: 20 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Infliggi all'avversario CUT pari a 20 più metà della A che ti resta. 2. Gioca d'anticipo (regolamento, R07b): se la tua mossa si risolve in un gruppo di velocità precedente a quello della mossa dell'avversario che hai scelto, cioè con priorità più alta, oppure con pari priorità e più A dopo i costi, succede anche questo: infliggi 5 CUT all'avversario. Nello stesso gruppo di velocità, o se l'avversario non ha una mossa, no; vale anche se la sua mossa sarà annullata più tardi o se lui è già a terra con la mossa ancora da risolvere.

La tua A si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 20 CUT.

#### Sgommata — Azione, Regolare · UNCOMMON · Costo 15 A · Priorità 1

`base.mara.Sgommata` · slot MAR-AR2

Azione regolare (regolamento, R01a). Costo: 15 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Infliggi 25 CUT all'avversario. 2. Gioca d'anticipo (regolamento, R07b): se la tua mossa si risolve in un gruppo di velocità precedente a quello della mossa dell'avversario che hai scelto, cioè con priorità più alta, oppure con pari priorità e più A dopo i costi, succede anche questo: l'avversario riceve lo stato negativo «Sgommata», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, l'avversario infligge tre quarti dei danni che infliggerebbe, arrotondando per difetto. Vale anche sui HIT, CUT e POISON che l'avversario si infligge da solo. Non cambia i danni delle mosse che si sono risolte prima. Nello stesso gruppo di velocità, o se l'avversario non ha una mossa, no; vale anche se la sua mossa sarà annullata più tardi o se lui è già a terra con la mossa ancora da risolvere.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 25 CUT.

#### Agilità Innaturale — Azione, Regolare · COMMON · Costo — · Priorità 2

`base.mara.SorpassoInCurva` · slot MAR-AR3

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Gioca d'anticipo (regolamento, R07b): se la tua mossa si risolve in un gruppo di velocità precedente a quello della mossa dell'avversario che hai scelto, cioè con priorità più alta, oppure con pari priorità e più A dopo i costi, succede anche questo: guadagni 4 A. Nello stesso gruppo di velocità, o se l'avversario non ha una mossa, no; vale anche se la sua mossa sarà annullata più tardi o se lui è già a terra con la mossa ancora da risolvere. 2. L'avversario perde 8 A. 3. Infliggi 4 CUT all'avversario.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 4 CUT.

#### Unta e Bisunta — Azione, Regolare · UNCOMMON · Costo 5 A · Priorità 2

`base.mara.TraDueParaurti` · slot MAR-AR4

Azione regolare (regolamento, R01a). Costo: 5 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «Unta e Bisunta», uno per ciascuno di HIT e CUT: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci metà dei HIT e CUT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Guadagni 5 A.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Slalom d'Avvicinamento — Azione, Regolare · UNCOMMON · Costo — · Priorità 2

`base.mara.Slalom` · slot MAR-AR5

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca su di te.

Annuncia «Sgommata» o «Lazo del Rider» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Sgommata» o «Lazo del Rider»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 15 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

#### Traiettoria Imprevedibile — Azione, Regolare · UNCOMMON · Costo — · Priorità 2

`base.mara.TiStringoLaCurva` · slot MAR-AR6

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca su di te.

Annuncia «Lazo del Rider» o «Sgommata» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Lazo del Rider» o «Sgommata»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 20 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

### Celestina Bucatina

#### Desiderio Incontrollabile — Azione, Base · UNCOMMON · Costo — · Priorità 1

`com.basic.ToxicGrab` · slot TOS-BA

Azione base di Celestina Bucatina (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 T. 2. Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

#### Fondo del Posacenere — Azione, Legata al personaggio · COMMON · Costo — · Priorità 1

`junkie.character.PatheticBlade` · slot TOS-BO1

Azione legata a Celestina Bucatina (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 2 T. 2. Infliggi 2 CUT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 CUT.

#### Rintanarsi nel Cappotto — Azione, Legata al personaggio · COMMON · Costo — · Priorità 2

`base.tossico.bound.RaschiareIlFondo` · slot TOS-BO2

Azione legata a Celestina Bucatina (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni 2 T. 2. Ottieni lo stato positivo «Rintanarsi nel Cappotto», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Tagliare la Dose — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 0

`junkie.character.RottenSmile` · slot TOS-BO3

Azione legata a Celestina Bucatina (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni H pari a un quarto della tua T. 2. Perdi metà della tua T.

La tua T si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### L'Ultimo Tiro — Azione, Ultima risorsa · UNCOMMON · Costo — · Priorità 1

`junkie.LethalHeroinDose` · slot LR-TOS

Ultima risorsa, riservata a Celestina Bucatina (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Subisci 2 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci. 2. Infliggi 8 POISON all'avversario. Più 5 per ogni volta che l'hai già giocata (Rincara, sotto). 3. L'avversario guadagna 4 T.

Rincara 5 (regolamento, R07b): per ogni volta che hai già giocato questa carta in questa partita, anche annullata, i danni all'avversario crescono di 5; le giocate dell'avversario non contano.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 8 POISON.

#### Fare l'Inventario — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`junkie.MethDrivenRage` · slot TOS-AR1

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su di te.

Annuncia «Tossicone Scatarrante» o «Trascinare nel Tunnel» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Tossicone Scatarrante» o «Trascinare nel Tunnel»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 10 T e 5 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 T. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

#### Tossicone Scatarrante — Azione, Regolare · UNCOMMON · Costo 10 T · Priorità 1

`junkie.Cough` · slot TOS-AR2

Azione regolare (regolamento, R01a). Costo: 10 T, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Infliggi 20 POISON all'avversario. 2. L'avversario guadagna 5 T.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 20 POISON.

#### Metabolismo Corrotto — Azione, Regolare · COMMON · Costo — · Priorità 1

`junkie.PervertedMetabolism` · slot TOS-AR3

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni H pari a metà della tua T. 2. Perdi tutta la tua T.

La tua T si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Riflessi Aumentati dalla Speed — Azione, Regolare · UNCOMMON · Costo 10 T · Priorità 2

`junkie.AmphetamineReflexes` · slot TOS-AR4

Azione regolare (regolamento, R01a). Costo: 10 T, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca su di te.

Quando la carta si risolve annulli la mossa di ogni avversario che si gioca contro di te o contro un tuo oggetto e deve ancora risolversi. Deve ancora risolversi vuol dire che viene dopo la tua nell'ordine di risoluzione del turno: priorità più bassa, oppure pari priorità e meno A dopo i costi, oppure pari priorità e pari A se il suo giocatore viene dopo di te nell'ordine d'inserimento nella partita (regolamento, R04). Le mosse che si sono già risolte, e quelle che gli avversari giocano su sé stessi o sui propri oggetti, restano. Una mossa annullata non ha effetti, ma il suo costo è già pagato e il suo giocatore pesca come sempre (regolamento, R04).

#### Trascinare nel Tunnel — Azione, Regolare · RARE · Costo 10 T · Priorità 1

`junkie.ToxicBloodDrain` · slot TOS-AR5

Azione regolare (regolamento, R01a). Costo: 10 T, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. All'inizio della risoluzione si legge la T che ti resta dopo aver pagato il costo. 2. Perdi tutta quella T. 3. Togli all'avversario l'immunità a T, anche quella del suo personaggio; resta tolta finché un'altra carta non gliela ridà (regolamento, R07b). 4. L'avversario guadagna la T che hai perso. 5. Infliggi 10 POISON all'avversario. 6. Alla fine di questo turno, dopo il veleno di fine turno, diventi immune a T: la tua T non ti avvelena più a fine turno finché un'altra carta non ti toglie l'immunità; costi, guadagni, perdite e danni POISON restano (regolamento, R07b).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 POISON.

#### Un Assaggino — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.tossico.UnAssaggino` · slot TOS-AR6

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su di te.

Annuncia «Trascinare nel Tunnel» o «Tossicone Scatarrante» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Trascinare nel Tunnel» o «Tossicone Scatarrante»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 20 T e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 T. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

### Piera Pinot

#### Fino all'Ultima Goccia — Azione, Base · UNCOMMON · Costo — · Priorità 0

`base.pino.QuestoLoFiniscoIo` · slot PIN-BA

Azione base di Piera Pinot (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 15 L. 2. Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

#### Posto Fisso — Azione, Legata al personaggio · COMMON · Costo — · Priorità 2

`base.pino.bound.CinqueMinutiEVado` · slot PIN-BO1

Azione legata a Piera Pinot (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 L. 2. Ottieni lo stato positivo «Posto Fisso», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Violenta Spruzzata di Seltz — Azione, Legata al personaggio · COMMON · Costo — · Priorità 1

`base.pino.bound.SpallataAlBancone` · slot PIN-BO2

Azione legata a Piera Pinot (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Perdi un quarto della tua T. 2. Infliggi 2 HIT all'avversario.

La tua T si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 HIT.

#### Schiarirsi le Idee — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 0

`base.pino.bound.Coccio` · slot PIN-BO3

Azione legata a Piera Pinot (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni A pari a metà della tua L. 2. Perdi metà della tua L.

La tua L si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Ultimo Giro — Azione, Ultima risorsa · UNCOMMON · Costo — · Priorità 1

`base.pino.UltimoGiro` · slot LR-PIN

Ultima risorsa, riservata a Piera Pinot (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. All'inizio della risoluzione si legge la tua L: è la L spesa. 2. Subisci 2 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci; arriva prima di spendere la L, quindi la corazza dell'alcol lo riduce (regolamento, R05). 3. Spendi tutta la tua L: scende a 0. 4. Infliggi all'avversario HIT pari a 10 più la L spesa.

Rincara 4 (2 a te) (regolamento, R07b): per ogni volta che hai già giocato questa carta in questa partita, anche annullata, i HIT all'avversario crescono di 4 e quelli che infliggi a te stesso di 2; le giocate dell'avversario non contano.

La L spesa è quella letta all'inizio della risoluzione, prima di ogni altro effetto della carta.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

#### Scompenso da Ultimo Giro — Azione, Regolare · COMMON · Costo 5 L · Priorità 1

`base.pino.TestataDaUltimoGiro` · slot PIN-AR1

Azione regolare (regolamento, R01a). Costo: 5 L, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Subisci 5 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci. 2. Infliggi 35 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 35 HIT.

#### Alla Goccia — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.pino.GoingBerserk` · slot PIN-AR2

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. All'inizio della risoluzione si legge la tua L: è la L spesa. 2. Spendi tutta la tua L: scende a 0. 3. Infliggi all'avversario HIT pari a 10 più la L spesa.

La L spesa è quella letta all'inizio della risoluzione, prima di ogni altro effetto della carta.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

#### Avamposto Fortificato al Bancone — Azione, Regolare · COMMON · Costo — · Priorità 2

`base.pino.IlBanconeRegge` · slot PIN-AR3

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «Avamposto Fortificato al Bancone»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei HIT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Ottieni lo stato positivo «Avamposto Fortificato al Bancone»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci metà dei POISON che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 3. Guadagni 5 L.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Un Altro e Arrivo — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.pino.OffroIo` · slot PIN-AR4

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su di te.

Annuncia «Alla Goccia» o «Rutto a Bruciapelo» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Alla Goccia» o «Rutto a Bruciapelo»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 15 L e 35 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 L e 10 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

#### Rutto a Bruciapelo — Azione, Regolare · RARE · Costo 5 L · Priorità 1

`base.pino.RuttoADistanzaSociale` · slot PIN-AR5

Azione regolare (regolamento, R01a). Costo: 5 L, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. All'inizio della risoluzione si legge la L che ti resta dopo aver pagato il costo: è la L spesa. 2. Spendi tutta la tua L: scende a 0. 3. L'avversario perde A pari alla L spesa; non scende sotto 0 (regolamento, R01). 4. Infliggi all'avversario HIT pari a 15 più il doppio della L spesa.

La L spesa è quella letta all'inizio della risoluzione, prima di ogni altro effetto della carta.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 15 HIT.

#### Un Altro... Grappino... — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.pino.PrimaIlBrindisi` · slot PIN-AR6

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su di te.

Annuncia «Rutto a Bruciapelo» o «Alla Goccia» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Rutto a Bruciapelo» o «Alla Goccia»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 15 L e 35 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 L e 10 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

### Beppe Bulletta

#### Questo Torna Utile — Azione, Base · UNCOMMON · Costo — · Priorità 0

`base.gigi.QuestoTornaUtile` · slot GIG-BA

Azione base di Beppe Bulletta (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 4 V. 2. Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

#### Cuffie e Testa Bassa — Azione, Legata al personaggio · COMMON · Costo — · Priorità 2

`base.gigi.bound.UnaStrettaEPassa` · slot GIG-BO1

Azione legata a Beppe Bulletta (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 V. 2. Ottieni lo stato positivo «Cuffie e Testa Bassa», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Colpo col Cacciavite — Azione, Legata al personaggio · COMMON · Costo — · Priorità 1

`base.gigi.bound.ColpoDiCacciavite` · slot GIG-BO2

Azione legata a Beppe Bulletta (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 2 V. 2. Infliggi 2 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 HIT.

#### Affilare gli Utensili — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 0

`base.gigi.bound.Lima` · slot GIG-BO3

Azione legata a Beppe Bulletta (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 0. Si gioca su di te.

Quando la carta si risolve: ottieni l'equipaggiamento positivo «Affilare gli Utensili»: da quando la carta si risolve fino alla fine del prossimo turno, effetti di fine turno compresi, i HIT che infliggi diventano CUT e ne infliggi tre quarti, arrotondando per difetto; da CUT non li cambiano più gli stati su HIT presi dopo questo, ma quelli su CUT, e la corazza dell'alcol non li riduce (regolamento, R05). Vale anche sui HIT che infliggi a te stesso. Non cambia i danni delle mosse che si sono risolte prima. È un equipaggiamento: «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Disassemblare — Azione, Regolare · UNCOMMON · Costo 5 V · Priorità 1

`bruiser.BreakYourToy` · slot GIG-AR1

Azione regolare (regolamento, R01a). Costo: 5 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca su un oggetto di un avversario, che scegli.

Quando la carta si risolve distruggi l'oggetto dell'avversario che hai scelto: esce dal campo senza effetto. Se l'oggetto non c'è più, non succede niente.

#### Chiave da Tredici — Azione, Regolare · UNCOMMON · Costo 10 V · Priorità 1

`base.gigi.ChiaveDaTredici` · slot GIG-AR2

Azione regolare (regolamento, R01a). Costo: 10 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 20 CUT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 20 CUT.

#### Preparare il Lavoro — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.gigi.ColpoDiChiaveInglese` · slot GIG-AR3

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 4 CUT all'avversario.

Annuncia «Chiave da Tredici» o «Lavoro Fatto Bene» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Chiave da Tredici» o «Lavoro Fatto Bene»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 15 V e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 V. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 4 CUT.

#### Secondo Bagagliaio — Azione, Regolare · COMMON · Costo 5 V · Priorità 2

`base.gigi.SottoIlCofano` · slot GIG-AR4

Azione regolare (regolamento, R01a). Costo: 5 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «Secondo Bagagliaio»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci metà dei HIT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Ottieni lo stato positivo «Secondo Bagagliaio»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei CUT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 3. Guadagni 5 V. 4. Guadagni 5 A.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Lavoro Fatto Bene — Azione, Regolare · RARE · Costo 10 V · Priorità 1

`base.gigi.LavoroFattoBene` · slot GIG-AR5

Azione regolare (regolamento, R01a). Costo: 10 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve infliggi all'avversario HIT pari a 15 più 4 per ogni oggetto che hai in campo. Gli oggetti si contano all'inizio della risoluzione, dopo i costi: contano anche i token; gli equipaggiamenti no, perché sono stati e non oggetti.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 15 HIT.

#### Metodo Empirico — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.gigi.UnaStrettaDiProva` · slot GIG-AR6

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 4 CUT all'avversario.

Annuncia «Lavoro Fatto Bene» o «Chiave da Tredici» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Lavoro Fatto Bene» o «Chiave da Tredici»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 10 V e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 V. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 4 CUT.

### Sergio Sommerso

#### Messo in Conto — Azione, Base · RARE · Costo — · Priorità 1

`base.cesira.LoMettoInConto` · slot CES-BA

Azione base di Sergio Sommerso (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 8 A. 2. Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

#### Discutiamone in Privato — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 2

`base.cesira.bound.NeRiparliamoFuori` · slot CES-BO1

Azione legata a Sergio Sommerso (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, se la mossa dell'avversario che hai scelto deve ancora risolversi e la sua carta contiene Annuncia (regolamento, R02a e R07b), la annulli; altrimenti non succede niente. Deve ancora risolversi vuol dire che viene dopo la tua nell'ordine di risoluzione del turno: priorità più bassa, oppure pari priorità e meno A dopo i costi, oppure pari priorità e pari A se il suo giocatore viene dopo di te nell'ordine d'inserimento nella partita (regolamento, R04). Una mossa annullata non ha effetti, ma il suo costo è già pagato e il suo giocatore pesca come sempre (regolamento, R04).

Se un'altra carta l'ha già annullata, non succede niente.

#### Tecnica Manipolatoria — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 1

`base.cesira.bound.Battutina` · slot CES-BO2

Azione legata a Sergio Sommerso (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Perdi un quarto della tua T. 2. Perdi un quarto della tua L. 3. Infliggi 2 HIT all'avversario.

La tua T e la tua L si leggono quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 HIT.

#### Fare il Vago — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 2

`base.cesira.bound.FareIlVago` · slot CES-BO3

Azione legata a Sergio Sommerso (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve: ottieni lo stato positivo «Fare il Vago», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Opportuna Distrazione — Azione, Regolare · UNCOMMON · Costo 5 A · Priorità 2

`base.cesira.OhGuardaLa` · slot CES-AR1

Azione regolare (regolamento, R01a). Costo: 5 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. L'avversario perde 10 A. 2. Infliggi 4 HIT all'avversario.

Annuncia «Segreto di Pulcinella» o «Conto Salato» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Segreto di Pulcinella» o «Conto Salato»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 15 A e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 5 A. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 4 HIT.

#### Buon Vecchio Ricatto — Azione, Regolare · UNCOMMON · Costo 15 A · Priorità 2

`base.cesira.Ricatto` · slot CES-AR2

Azione regolare (regolamento, R01a). Costo: 15 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, se la mossa dell'avversario che hai scelto deve ancora risolversi, la annulli; se si è già risolta, o l'avversario non ha una mossa, non succede niente. Deve ancora risolversi vuol dire che viene dopo la tua nell'ordine di risoluzione del turno: priorità più bassa, oppure pari priorità e meno A dopo i costi, oppure pari priorità e pari A se il suo giocatore viene dopo di te nell'ordine d'inserimento nella partita (regolamento, R04). Una mossa annullata non ha effetti, ma il suo costo è già pagato e il suo giocatore pesca come sempre (regolamento, R04).

Se un'altra carta l'ha già annullata, non succede niente.

Se l'hai annullata ed era un attacco, infliggi all'avversario metà dei suoi danni fissi, dello stesso tipo, arrotondando per difetto. I danni fissi sono quelli scritti sulla sua carta contro l'avversario: non la parte letta dalle risorse o dagli oggetti, non Rincara, non i danni di Gioca d'anticipo e di «Se l'avversario è Vulnerabile»; i danni che la sua carta infliggeva a lui stesso non contano. Il testo completo di ogni carta li dice.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

#### Copione Già Visto — Azione, Regolare · UNCOMMON · Costo 10 A · Priorità 2

`base.cesira.LoSapevo` · slot CES-AR3

Azione regolare (regolamento, R01a). Costo: 10 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, se la mossa dell'avversario che hai scelto deve ancora risolversi, la annulli; se si è già risolta, o l'avversario non ha una mossa, non succede niente. Deve ancora risolversi vuol dire che viene dopo la tua nell'ordine di risoluzione del turno: priorità più bassa, oppure pari priorità e meno A dopo i costi, oppure pari priorità e pari A se il suo giocatore viene dopo di te nell'ordine d'inserimento nella partita (regolamento, R04). Una mossa annullata non ha effetti, ma il suo costo è già pagato e il suo giocatore pesca come sempre (regolamento, R04).

Se un'altra carta l'ha già annullata, non succede niente.

Se la carta che annulli ha il nome a cui è legato il Vulnerabile dell'avversario, quella giocata non lo fa finire: l'avversario resta Vulnerabile finché non gioca un'altra carta con quel nome (regolamento, R07b).

#### Conto Salato — Azione, Regolare · UNCOMMON · Costo 5 A · Priorità 1

`base.cesira.ContoSalato` · slot CES-AR4

Azione regolare (regolamento, R01a). Costo: 5 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Infliggi 8 HIT all'avversario. 2. Se, quando questo effetto si applica, l'avversario è Vulnerabile, cioè ha almeno un gettone di vulnerabilità di qualunque carta (regolamento, R07b): infliggi 6 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 8 HIT.

#### Segreto di Pulcinella — Azione, Regolare · COMMON · Costo 15 A · Priorità 1

`base.cesira.LoSannoTutti` · slot CES-AR5

Azione regolare (regolamento, R01a). Costo: 15 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 25 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 25 HIT.

#### Scherzo Oltre il Limite — Azione, Regolare · RARE · Costo 10 A · Priorità 1

`base.cesira.Malelingue` · slot CES-AR6

Azione regolare (regolamento, R01a). Costo: 10 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. L'avversario perde A pari a metà della A che ti resta. 2. Infliggi all'avversario HIT pari a 5 più metà della A che ti resta.

La tua A si legge quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 5 HIT.

#### Fiuto per gli Affari — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.cesira.LoRivendo` · slot CES-AR7

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve: vendi il tuo oggetto che hai scelto: esce dal campo senza il suo effetto (nessun guadagno, immunità, equipaggiamento o effetto In campo) e va negli scarti, poi guadagni 8 H. Se quando la carta si risolve l'oggetto non è più fra i tuoi (rubato, distrutto, scalzato da un altro), non vendi niente e non guadagni niente (regolamento, R07b).

### Duccio Braccio Teso

#### Prima gli Italiani — Azione, Base · RARE · Costo — · Priorità 0

`base.rocco.PrimaIo` · slot ROC-BA

Azione base di Duccio Braccio Teso (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve, nell'ordine: 1. Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04). 2. Guadagni 4 H.

#### Rinfrescata Arrogante — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 1

`base.rocco.bound.Colpetto` · slot ROC-BO1

Azione legata a Duccio Braccio Teso (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Perdi un quarto della tua T. 2. Perdi un quarto della tua L. 3. Infliggi 2 HIT all'avversario.

La tua T e la tua L si leggono quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima della tua e dopo gli effetti che lo precedono su questa carta. Metà e quarti si arrotondano per difetto.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 2 HIT.

#### Rialziamoci e Partite! — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 0

`base.rocco.bound.MiRialzo` · slot ROC-BO2

Azione legata a Duccio Braccio Teso (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 0. Si gioca su di te.

Quando la carta si risolve, se hai da 1 a 30 H, guadagni 4 H; altrimenti niente. La H si legge in quel momento, dopo le mosse che si sono risolte prima della tua. La carta si gioca su di te, quindi si risolve anche se sei a terra (regolamento, R04), ma a 0 H non recuperi niente.

#### (Dis)onore alla Bandiera — Azione, Legata al personaggio · UNCOMMON · Costo — · Priorità 2

`base.rocco.bound.AlzoLaVoce` · slot ROC-BO3

Azione legata a Duccio Braccio Teso (regolamento, R01a). Nessun costo in risorse. Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene all'inizio del suo effetto, e questa carta resta in mano (regolamento, R02). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Guadagni 8 A. 2. Ottieni lo stato positivo «(Dis)onore alla Bandiera», uno per ciascuno di HIT, CUT e POISON: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci tre quarti dei danni che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Non Mi Hai Fatto Niente — Azione, Ultima risorsa · RARE · Costo — · Priorità 0

`base.rocco.NeHoPreseDiPeggio` · slot LR-ROC

Ultima risorsa, generica (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Subisci 6 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci. Più 2 per ogni volta che l'hai già giocata (Rincara, sotto). 2. Infliggi 10 HIT all'avversario. Più 5 per ogni volta che l'hai già giocata (Rincara, sotto).

Rincara 5 (2 a te) (regolamento, R07b): per ogni volta che hai già giocato questa carta in questa partita, anche annullata, i danni all'avversario crescono di 5 e quelli che infliggi a te stesso di 2; le giocate dell'avversario non contano.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

#### Nocche Sbucciate — Azione, Regolare · COMMON · Costo 15 H · Priorità 0

`base.rocco.NoccheSbucciate` · slot ROC-AR1

Azione regolare (regolamento, R01a). Costo: 15 H, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 20 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 20 HIT.

#### Stoico come un Busto di Bronzo — Azione, Regolare · COMMON · Costo — · Priorità 2

`base.rocco.Incassare` · slot ROC-AR2

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «Stoico come un Busto di Bronzo»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci metà dei HIT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Guadagni 4 H.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### E Allora...? — Azione, Regolare · UNCOMMON · Costo 10 H · Priorità 2

`base.rocco.EAllora` · slot ROC-AR3

Azione regolare (regolamento, R01a). Costo: 10 H, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «E Allora...?»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci metà dei HIT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Infliggi 8 HIT all'avversario.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 8 HIT.

#### Craniata Patriottica — Azione, Regolare · UNCOMMON · Costo 30 H · Priorità 0

`base.rocco.Capocciata` · slot ROC-AR4

Azione regolare (regolamento, R01a). Costo: 30 H, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 25 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 25 HIT.

#### La Storia la Scrivono i Vincitori — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.rocco.TeLoSpiegoIo` · slot ROC-AR5

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 4 HIT all'avversario.

Annuncia «Craniata Patriottica» o «Testa Dura» (regolamento, R02a e R07b): al posto della pesca che segue la tua mossa cerchi nel mazzo una carta col nome «Craniata Patriottica» o «Testa Dura»: il nome lo scegli quando giochi questa carta, fra quelli di cui hai ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due). Se la trovi, va in mano e la mostri a tutti finché resta in mano e finché non giochi una carta con quel nome; guadagni 6 H e diventi Vulnerabile, legato al nome che hai trovato. Se nel mazzo non ce n'è nessuna, peschi normalmente e guadagni 2 H. I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, non cerchi niente (regolamento, R02a). Vulnerabile (regolamento, R07b): subisci una volta e mezza i danni che subiresti, HIT, CUT e POISON, veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata col nome ne fa finire uno solo, il più vecchio.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 4 HIT.

#### Testa Dura — Azione, Regolare · RARE · Costo 35 H · Priorità 0

`base.rocco.TestaDura` · slot ROC-AR6

Azione regolare (regolamento, R01a). Costo: 35 H, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 30 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 30 HIT.

### Azioni generiche

#### Afferrare — Azione, Regolare · COMMON · Costo — · Priorità 1

`com.Grab` · slot GEN-01

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su un tuo oggetto, che scegli.

Quando la carta si risolve: consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma gli altri effetti della carta valgono (regolamento, R04).

#### Furto con Destrezza — Azione, Regolare · COMMON · Costo 10 A · Priorità 0

`com.Steal` · slot GEN-02

Azione regolare (regolamento, R01a). Costo: 10 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca su un oggetto di un avversario, che scegli.

Quando la carta si risolve prendi l'oggetto dell'avversario che hai scelto e lo metti vicino a te: da quel momento è tuo. Se così superi gli oggetti che puoi tenere, sparisce il tuo oggetto più vecchio (regolamento, R02). Se l'oggetto non c'è più, non prendi niente. Un effetto In campo dell'oggetto, da quel momento, agisce su di te (regolamento, R07b).

#### Scatto Repentino — Azione, Regolare · UNCOMMON · Costo — · Priorità −1

`base.com.ShuffleFeet` · slot GEN-03

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità -1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve scambi tutti i tuoi oggetti con tutti quelli dell'avversario che hai scelto. Se uno dei due riceve più oggetti di quanti ne può tenere, spariscono i più vecchi fra quelli che riceve (regolamento, R02). Gli effetti In campo seguono gli oggetti (regolamento, R07b).

#### Ce l'Hai Due Spicci? — Azione, Regolare · RARE · Costo — · Priorità 0

`base.com.BeggingMoney` · slot GEN-04

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve copi accanto a te un oggetto a caso fra quelli dell'avversario che hai scelto: lui tiene il suo, tu ne hai uno uguale. Se l'avversario non ha oggetti, non succede niente. Se così superi gli oggetti che puoi tenere, sparisce il tuo più vecchio (regolamento, R02).

#### GABBIANO, DUNQUE VOLIAMOTI — Azione, Regolare · COMMON · Costo 10 V · Priorità 1

`bruiser.SeagullFly` · slot GEN-05

Azione regolare (regolamento, R01a). Costo: 10 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 20 HIT all'avversario. Su questo danno contano solo i tuoi stati positivi (gli equipaggiamenti sono stati positivi); gli stati dell'avversario contano tutti (regolamento, R05).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 20 HIT.

#### Foratone da 28 — Azione, Regolare · COMMON · Costo 15 V · Priorità 0

`base.com.MattoneDelCantiere` · slot GEN-06

Azione regolare (regolamento, R01a). Costo: 15 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 25 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 25 HIT.

#### ORMALE GUARIAMOTI — Azione, Regolare · UNCOMMON · Costo 20 V · Priorità 1

`bruiser.HealingBlow` · slot GEN-07

Azione regolare (regolamento, R01a). Costo: 20 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Infliggi 30 HIT all'avversario. 2. Azzeri la T dell'avversario: scende a 0 qualunque valore abbia. 3. Azzeri la L dell'avversario: scende a 0 qualunque valore abbia.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 30 HIT.

#### AMMALIAMOTI DI BOTTE — Azione, Regolare · COMMON · Costo 15 V · Priorità 1

`bruiser.SickeningBlow` · slot GEN-08

Azione regolare (regolamento, R01a). Costo: 15 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Infliggi 10 HIT all'avversario. 2. L'avversario guadagna 10 T.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

#### STORDIAMOTI HO DETTO — Azione, Regolare · UNCOMMON · Costo 10 V · Priorità 1

`bruiser.StunningBlow` · slot GEN-09

Azione regolare (regolamento, R01a). Costo: 10 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. L'avversario perde 10 A. 2. Infliggi 10 HIT all'avversario.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

#### PERMESSO SCUSA PUOI SMETTERLA — Azione, Regolare · UNCOMMON · Costo 5 V · Priorità 1

`bruiser.BadEducation` · slot GEN-10

Azione regolare (regolamento, R01a). Costo: 5 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Togli all'avversario tutti i suoi equipaggiamenti: sono stati, non oggetti in campo (regolamento, R01a e R05). 2. Infliggi 8 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 8 HIT.

#### GENTILE IL TUO CAREZZO — Azione, Regolare · UNCOMMON · Costo 5 V · Priorità 2

`bruiser.CantFeelAnything` · slot GEN-11

Azione regolare (regolamento, R01a). Costo: 5 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «GENTILE IL TUO CAREZZO»: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci un quarto dei HIT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Guadagni 5 A.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Estrema Fretta di Alcolizzarsi — Azione, Regolare · COMMON · Costo 10 A · Priorità 0

`base.com.RincorsaDalMarciapiede` · slot GEN-12

Azione regolare (regolamento, R01a). Costo: 10 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 0. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 V. 2. Infliggi 10 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

#### Tecnica del Carapace Mentale — Azione, Regolare · COMMON · Costo 5 A · Priorità 2

`base.com.TartarugaSulMarciapiede` · slot GEN-13

Azione regolare (regolamento, R01a). Costo: 5 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato positivo «Tecnica del Carapace Mentale», uno per ciascuno di HIT e CUT: da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi, subisci metà dei HIT e CUT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Guadagni 2 H.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Denti Stretti — Azione, Regolare · COMMON · Costo — · Priorità 0

`base.com.DentiStretti` · slot GEN-14

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Perdi 5 A. 2. Guadagni 10 V.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Due Dita in Gola — Azione, Regolare · UNCOMMON · Costo — · Priorità 1

`base.com.DueDitaInGola` · slot GEN-15

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Subisci 5 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci. 2. Azzeri la tua T: scende a 0 qualunque valore abbia. 3. Azzeri la tua L: scende a 0 qualunque valore abbia.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

#### Fasciatura d'Emergenza — Azione, Regolare · COMMON · Costo — · Priorità 0

`base.com.FasciaturaColFazzolettaccio` · slot GEN-16

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Perdi 5 A. 2. Guadagni 8 H.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Sputo nel Posacenere — Azione, Regolare · COMMON · Costo 5 A · Priorità 1

`base.com.SputoDaPosacenere` · slot GEN-17

Azione regolare (regolamento, R01a). Costo: 5 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 10 POISON all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 POISON.

#### Spintone — Azione, Regolare · COMMON · Costo — · Priorità 1

`base.com.Spintone` · slot GEN-18

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 8 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 8 HIT.

#### Mano Lesta — Azione, Regolare · COMMON · Costo — · Priorità 1

`base.com.ManoLesta` · slot GEN-19

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Guadagni 5 A. 2. L'avversario perde 5 A.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Riprendere Fiato — Azione, Regolare · RARE · Costo — · Priorità 0

`base.com.SecondoFiato` · slot GEN-20

Azione regolare (regolamento, R01a). Nessun costo in risorse. Priorità 0. Si gioca su di te.

Quando la carta si risolve, nell'ordine: 1. Ottieni lo stato negativo «Riprendere Fiato», uno per ciascuno di HIT e CUT: da quando la carta si risolve fino alla fine del prossimo turno, effetti di fine turno compresi, subisci una volta e un quarto i HIT e CUT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. 2. Guadagni 10 H.

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Coccio di Bottiglia — Azione, Regolare · RARE · Costo 5 V · Priorità 1

`base.com.CoccioDiBottiglia` · slot GEN-21

Azione regolare (regolamento, R01a). Costo: 5 V, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca su di te.

Quando la carta si risolve: ottieni l'equipaggiamento positivo «Coccio di Bottiglia»: da quando la carta si risolve finché non cambia un danno; dal primo danno che cambia vale ancora, su ogni danno, fino alla fine di quel turno, i HIT che infliggi diventano CUT e ne infliggi una volta e mezza, arrotondando per difetto; da CUT non li cambiano più gli stati su HIT presi dopo questo, ma quelli su CUT, e la corazza dell'alcol non li riduce (regolamento, R05). Vale anche sui HIT che infliggi a te stesso. Non cambia i danni delle mosse che si sono risolte prima. È un equipaggiamento: «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Svegliaaah! — Azione, Regolare · UNCOMMON · Costo 5 A · Priorità 2

`base.com.AcquaInFaccia` · slot GEN-22

Azione regolare (regolamento, R01a). Costo: 5 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Azzeri la L dell'avversario: scende a 0 qualunque valore abbia. 2. Infliggi 4 HIT all'avversario.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 4 HIT.

#### Sgambetto — Azione, Regolare · RARE · Costo 10 A · Priorità 2

`base.com.Sgambetto` · slot GEN-23

Azione regolare (regolamento, R01a). Costo: 10 A, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 2. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. L'avversario perde 10 V. 2. Infliggi 5 HIT all'avversario.

Nessuna risorsa scende sotto 0 (regolamento, R01).

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 5 HIT.

#### Estasi da Coca Etilene — Azione, Regolare · RARE · Costo 10 T + 10 L · Priorità 1

`base.com.EstasiDaCocaEtilene` · slot GEN-24

Azione regolare (regolamento, R01a). Costo: 10 T e 10 L, che paghi prima di ogni effetto del turno (regolamento, R04). Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve: infliggi 40 HIT all'avversario.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 40 HIT.

#### Addosso!!! — Azione, Ultima risorsa · COMMON · Costo — · Priorità 1

`com.last.Struggle` · slot LR-STR

Ultima risorsa, generica (regolamento, R01a). Nessun costo in risorse. Priorità 1. Si gioca contro un avversario, che scegli.

Quando la carta si risolve, nell'ordine: 1. Subisci 5 HIT: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui danni che infliggi sia quelli sui danni che subisci. Più 2 per ogni volta che l'hai già giocata (Rincara, sotto). 2. Infliggi 10 HIT all'avversario. Più 5 per ogni volta che l'hai già giocata (Rincara, sotto).

Rincara 5 (2 a te) (regolamento, R07b): per ogni volta che hai già giocato questa carta in questa partita, anche annullata, i danni all'avversario crescono di 5 e quelli che infliggi a te stesso di 2; le giocate dell'avversario non contano.

Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando ogni volta per difetto (regolamento, R05); i HIT che subisce chi ha L si riducono poi di un quarto della sua L, senza scendere sotto 0 (regolamento, R05).

Danni fissi, quelli che «Buon Vecchio Ricatto» rimanda: infliggi 10 HIT.

### Oggetti

#### Negroni Trovato per Terra — Oggetto · COMMON · Costo — · Priorità —

`com.items.CocktailOnTheGround` · slot OGG-01

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Guadagni 10 V. 2. Guadagni 10 L. 3. Guadagni 2 T.

#### Bionda da 66, Calda — Oggetto · COMMON · Costo — · Priorità —

`com.items.RottenBeer` · slot OGG-02

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: guadagni 10 L.

#### Doppio Malto da Discount — Oggetto · UNCOMMON · Costo — · Priorità —

`com.items.AnotherRottenBeer` · slot OGG-03

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Accanto a te compare una Bottiglia Spaccata, un token oggetto (regolamento, R01a): occupa un posto fra gli oggetti che puoi tenere, e se ne hai già il massimo sparisce il più vecchio (regolamento, R02). Per usarla la consumi con una carta che si gioca su un tuo oggetto; il suo testo completo dice cosa fa. 2. Guadagni 10 L.

#### Mescolone Micidiale — Oggetto · RARE · Costo — · Priorità —

`com.items.MarvelousCocktail` · slot OGG-04

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Diventi immune a T e a L: da questo fine turno la tua T non ti avvelena e la tua L non ti fa perdere A né L; costi, guadagni, perdite e danni POISON restano (regolamento, R07b). 2. Guadagni 20 L e 20 T. 3. Alla fine del quinto turno, contando questo, dopo gli effetti di T e L di quel turno (ancora bloccati), perdi tutte le immunità, anche quelle del tuo personaggio, e tutti gli stati: positivi, negativi, equipaggiamenti e Vulnerabile. Poi subisci 20 POISON, che nessuno stato cambia perché non ne hai più. Dal turno dopo la tua T e la tua L tornano a fare effetto a fine turno.

#### Amaro nel Bicchiere di Plastica — Oggetto · COMMON · Costo — · Priorità —

`base.items.AmaroNelBicchiereDiPlastica` · slot OGG-05

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Guadagni 20 L. 2. Perdi 5 A.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Espresso della Macchinetta — Oggetto · COMMON · Costo — · Priorità —

`base.items.EspressoDelDistributore` · slot OGG-06

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: guadagni 15 A.

#### Kebab Abbandonato — Oggetto · COMMON · Costo — · Priorità —

`base.items.PaninoDelKebab` · slot OGG-07

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Guadagni 10 H. 2. Guadagni 2 T.

#### Acqua Minerale Sgasata — Oggetto · UNCOMMON · Costo — · Priorità —

`base.items.MezzaMineraleSgasata` · slot OGG-08

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Azzeri la tua L: scende a 0 qualunque valore abbia. 2. Guadagni 20 A.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Guanti da Officina — Oggetto · UNCOMMON · Costo — · Priorità —

`base.items.GuantiDaOfficina` · slot OGG-09

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: ottieni l'equipaggiamento positivo «Guanti da Officina»: da quando la carta si risolve per 3 turni, contando questo, fino agli effetti di fine turno dell'ultimo compresi, infliggi una volta e un quarto i HIT che infliggeresti, arrotondando per difetto. Vale anche sui HIT che infliggi a te stesso. Non cambia i danni delle mosse che si sono risolte prima. È un equipaggiamento: «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Giubbotto di Finta Pelle — Oggetto · COMMON · Costo — · Priorità —

`base.items.GiubbottoDiFintaPelle` · slot OGG-10

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: ottieni l'equipaggiamento positivo «Giubbotto di Finta Pelle»: da quando la carta si risolve per 3 turni, contando questo, fino agli effetti di fine turno dell'ultimo compresi, subisci tre quarti dei CUT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. È un equipaggiamento: «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Casco da Cantiere — Oggetto · COMMON · Costo — · Priorità —

`base.items.CascoDaLavoro` · slot OGG-11

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: ottieni l'equipaggiamento positivo «Casco da Cantiere»: da quando la carta si risolve per 3 turni, contando questo, fino agli effetti di fine turno dell'ultimo compresi, subisci tre quarti dei HIT che subiresti, arrotondando per difetto. Non cambia i danni delle mosse che si sono risolte prima. È un equipaggiamento: «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Pasticca Abbandonata — Oggetto · COMMON · Costo — · Priorità —

`base.items.PasticcaTrovataSulBancone` · slot OGG-12

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: guadagni 10 T.

#### Posacenere di Vetro — Oggetto · UNCOMMON · Costo — · Priorità —

`base.items.PosacenereDiVetro` · slot OGG-13

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi: ottieni l'equipaggiamento positivo «Posacenere di Vetro»: da quando la carta si risolve finché non cambia un danno; dal primo danno che cambia vale ancora, su ogni danno, fino alla fine di quel turno, infliggi una volta e mezza i HIT che infliggeresti, arrotondando per difetto. Vale anche sui HIT che infliggi a te stesso. Non cambia i danni delle mosse che si sono risolte prima. È un equipaggiamento: «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, nell'ordine in cui sono stati presi (regolamento, R05).

#### Ghiaccio nel Tovagliolo — Oggetto · UNCOMMON · Costo — · Priorità —

`base.items.GhiaccioNelTovagliolo` · slot OGG-14

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Guadagni 10 H. 2. Azzeri la tua T: scende a 0 qualunque valore abbia.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Santino di San Briaco — Oggetto · RARE · Costo — · Priorità —

`base.items.SantinoDellaPortinaia` · slot OGG-15

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi diventi immune a L: la tua L non ti fa perdere A né L a fine turno; costi, guadagni e perdite restano (regolamento, R07b). L'immunità finisce alla fine del terzo turno, contando questo, dopo l'effetto di fine turno della L, che quindi resta bloccato in tutti e 3 i turni. La fine toglie l'immunità a L anche se nel frattempo ne avevi un'altra, per esempio da un secondo «Santino di San Briaco».

#### Grappa della Casa — Oggetto · RARE · Costo — · Priorità —

`base.items.GrappaDellaCasa` · slot OGG-16

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

Quando lo consumi, nell'ordine: 1. Guadagni 25 L. 2. Perdi 5 A.

Nessuna risorsa scende sotto 0 (regolamento, R01).

#### Conto del Tavolo Sei — Oggetto · UNCOMMON · Costo — · Priorità —

`base.items.ContoDelTavoloSei` · slot OGG-17

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

In campo (regolamento, R07b): finché l'oggetto è in campo, alla fine di ogni turno chi lo ha vicino perde 4 A, dopo i suoi altri effetti di fine turno. Agisce anche nel turno in cui arriva e colpisce chi lo ha in quel momento, anche se l'ha rubato, scambiato o copiato. Non è un danno: stati e parate non lo cambiano, nessuna risorsa scende sotto 0 e la H non cambia mai. Consumato, venduto, distrutto o scalzato prima della fine del turno, non agisce.

Quando lo consumi: guadagni 15 V.

#### Sigaretta Accesa — Oggetto · RARE · Costo — · Priorità —

`base.items.SigarettaAccesa` · slot OGG-18

Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto (regolamento, R01a).

In campo (regolamento, R07b): finché l'oggetto è in campo, alla fine di ogni turno chi lo ha vicino guadagna 2 T, dopo i suoi altri effetti di fine turno. Agisce anche nel turno in cui arriva e colpisce chi lo ha in quel momento, anche se l'ha rubato, scambiato o copiato. Non è un danno: stati e parate non lo cambiano, nessuna risorsa scende sotto 0 e la H non cambia mai. Consumato, venduto, distrutto o scalzato prima della fine del turno, non agisce. La T che dà avvelena dal turno dopo; a chi è immune resta la T senza il veleno.

Quando lo consumi: guadagni 10 A.

### Token

#### Bottiglia Spaccata — Oggetto, Token · — · Costo — · Priorità —

`com.tokens.BrokenBeerBottle` · slot TOKEN

Token oggetto, creato da «Doppio Malto da Discount» (regolamento, R01a): in campo segue le regole degli oggetti, compreso il numero di oggetti che puoi tenere (regolamento, R02). Fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto.

Quando lo consumi ottieni un equipaggiamento positivo: i tuoi HIT diventano CUT e ne infliggi una volta e mezza, arrotondando per difetto; da CUT non li cambiano più gli stati su HIT presi dopo questo, ma quelli su CUT, e la corazza dell'alcol non li riduce (regolamento, R05). Vale anche sui HIT che infliggi a te stesso. Dura finché non cambia un danno; dal primo danno che cambia vale ancora, su ogni danno, fino alla fine di quel turno; «PERMESSO SCUSA PUOI SMETTERLA» lo toglie (regolamento, R01a e R05).

Ogni Bottiglia Spaccata consumata dà un equipaggiamento suo, indipendente dagli altri (regolamento, R05).

## S4 — Ruoli, guadagni e danno nominale

Campi descrittivi definiti in R07a, generati dagli stessi dati delle schede; in caso di dubbio prevale la scheda. x indica una quantità variabile.

| Carta | Identificatore | Ruolo | Guadagni a sé | Danno nominale | Importo nominale |
|---|---|---|---|---|---|
| SPAZIENZIO DE LA UCCISO | `bruiser.character.BigBadBruiser` | — | — | — | — |
| Mara Contromano | `base.character.Mara` | — | — | — | — |
| Celestina Bucatina | `junkie.character.ToxicJunkie` | — | — | — | — |
| Piera Pinot | `base.character.Pino` | — | — | — | — |
| Beppe Bulletta | `base.character.Gigi` | — | — | — | — |
| Sergio Sommerso | `base.character.Cesira` | — | — | — | — |
| Duccio Braccio Teso | `base.character.Rocco` | — | — | — | — |
| ADOPERIAMOTI | `com.basic.BruiserGrab` | ITEMS | — | — | — |
| LIEVE FASTIDIO | `bruiser.character.LittleRage` | DEFENSE | +5 V | — | — |
| SVEGLIAMOCI - MA TU NO | `bruiser.character.LittleSmack` | DAMAGE | — | HIT | HIT 2 |
| VIOLENZAZIONE | `base.spazienzio.bound.TestaAlMuro` | RESOURCES | +8 V | — | — |
| GARGANTUESCO IMPATTO SUL TU | `bruiser.SuperImpact` | DAMAGE | — | HIT | HIT 35 |
| SPEDIAMOTI DUNQUE IN O-AHIO | `bruiser.ExtremelyViolentBlow` | DAMAGE | — | HIT | HIT 6+x |
| PAZIENZA: FINITA | `bruiser.Glare` | RESOURCES | +25 V, +15 A | — | — |
| NON GIOCARE COL COLTELLO NO | `bruiser.MadeOfStone` | DEFENSE | +10 V | — | — |
| FAI BASTA | `bruiser.YouStop` | COUNTER | — | — | — |
| SGOMBERIAMOVI | `base.bruiser.TiFaccioSpazio` | RESOURCES | +15 V, +15 A | — | — |
| Requisire al Volo | `base.mara.PresoAlVolo` | ITEMS | — | — | — |
| Sventare l'Assassinio | `base.mara.bound.PassoStretto` | DAMAGE | — | CUT | CUT 2 |
| Semaforo Rosso | `base.mara.bound.CambioMarcia` | DEFENSE | +5 A | — | — |
| Tagliare la Strada | `base.mara.bound.ColpoDiStriscio` | DISRUPT | — | — | — |
| Lazo del Rider | `base.mara.CinghiataDiTraverso` | DAMAGE | — | CUT | CUT 20+x |
| Sgommata | `base.mara.Sgommata` | DAMAGE | — | CUT | CUT 25 |
| Agilità Innaturale | `base.mara.SorpassoInCurva` | DISRUPT | — | CUT | CUT 4 |
| Unta e Bisunta | `base.mara.TraDueParaurti` | DEFENSE | +5 A | — | — |
| Slalom d'Avvicinamento | `base.mara.Slalom` | RESOURCES | +15 A | — | — |
| Traiettoria Imprevedibile | `base.mara.TiStringoLaCurva` | RESOURCES | +20 A | — | — |
| Desiderio Incontrollabile | `com.basic.ToxicGrab` | ITEMS | +5 T | — | — |
| Fondo del Posacenere | `junkie.character.PatheticBlade` | DAMAGE | +2 T | CUT | CUT 2 |
| Rintanarsi nel Cappotto | `base.tossico.bound.RaschiareIlFondo` | DEFENSE | +2 T | — | — |
| Tagliare la Dose | `junkie.character.RottenSmile` | RESOURCES | +x H | — | — |
| L'Ultimo Tiro | `junkie.LethalHeroinDose` | DAMAGE | — | POISON | POISON 8 |
| Fare l'Inventario | `junkie.MethDrivenRage` | RESOURCES | +10 T, +5 A | — | — |
| Tossicone Scatarrante | `junkie.Cough` | DAMAGE | — | POISON | POISON 20 |
| Metabolismo Corrotto | `junkie.PervertedMetabolism` | RESOURCES | +x H | — | — |
| Riflessi Aumentati dalla Speed | `junkie.AmphetamineReflexes` | COUNTER | — | — | — |
| Trascinare nel Tunnel | `junkie.ToxicBloodDrain` | DISRUPT | — | POISON | POISON 10 |
| Un Assaggino | `base.tossico.UnAssaggino` | RESOURCES | +20 T | — | — |
| Fino all'Ultima Goccia | `base.pino.QuestoLoFiniscoIo` | ITEMS | +15 L | — | — |
| Posto Fisso | `base.pino.bound.CinqueMinutiEVado` | DEFENSE | +5 L | — | — |
| Violenta Spruzzata di Seltz | `base.pino.bound.SpallataAlBancone` | DAMAGE | — | HIT | HIT 2 |
| Schiarirsi le Idee | `base.pino.bound.Coccio` | RESOURCES | +x A | — | — |
| Ultimo Giro | `base.pino.UltimoGiro` | DAMAGE | — | HIT | HIT 10+x |
| Scompenso da Ultimo Giro | `base.pino.TestataDaUltimoGiro` | DAMAGE | — | HIT | HIT 35 |
| Alla Goccia | `base.pino.GoingBerserk` | DAMAGE | — | HIT | HIT 10+x |
| Avamposto Fortificato al Bancone | `base.pino.IlBanconeRegge` | DEFENSE | +5 L | — | — |
| Un Altro e Arrivo | `base.pino.OffroIo` | RESOURCES | +15 L, +35 A | — | — |
| Rutto a Bruciapelo | `base.pino.RuttoADistanzaSociale` | DISRUPT | — | HIT | HIT 15+x |
| Un Altro... Grappino... | `base.pino.PrimaIlBrindisi` | RESOURCES | +15 L, +35 A | — | — |
| Questo Torna Utile | `base.gigi.QuestoTornaUtile` | ITEMS | +4 V | — | — |
| Cuffie e Testa Bassa | `base.gigi.bound.UnaStrettaEPassa` | DEFENSE | +5 V | — | — |
| Colpo col Cacciavite | `base.gigi.bound.ColpoDiCacciavite` | DAMAGE | +2 V | HIT | HIT 2 |
| Affilare gli Utensili | `base.gigi.bound.Lima` | OTHER | — | — | — |
| Disassemblare | `bruiser.BreakYourToy` | ITEMS | — | — | — |
| Chiave da Tredici | `base.gigi.ChiaveDaTredici` | DAMAGE | — | CUT | CUT 20 |
| Preparare il Lavoro | `base.gigi.ColpoDiChiaveInglese` | RESOURCES | +15 V | CUT | CUT 4 |
| Secondo Bagagliaio | `base.gigi.SottoIlCofano` | DEFENSE | +5 V, +5 A | — | — |
| Lavoro Fatto Bene | `base.gigi.LavoroFattoBene` | DAMAGE | — | HIT | HIT 15+x |
| Metodo Empirico | `base.gigi.UnaStrettaDiProva` | RESOURCES | +10 V | CUT | CUT 4 |
| Messo in Conto | `base.cesira.LoMettoInConto` | ITEMS | +8 A | — | — |
| Discutiamone in Privato | `base.cesira.bound.NeRiparliamoFuori` | COUNTER | — | — | — |
| Tecnica Manipolatoria | `base.cesira.bound.Battutina` | DAMAGE | — | HIT | HIT 2 |
| Fare il Vago | `base.cesira.bound.FareIlVago` | DEFENSE | — | — | — |
| Opportuna Distrazione | `base.cesira.OhGuardaLa` | DISRUPT | +15 A | HIT | HIT 4 |
| Buon Vecchio Ricatto | `base.cesira.Ricatto` | COUNTER | — | — | — |
| Copione Già Visto | `base.cesira.LoSapevo` | COUNTER | — | — | — |
| Conto Salato | `base.cesira.ContoSalato` | DAMAGE | — | HIT | HIT 8 |
| Segreto di Pulcinella | `base.cesira.LoSannoTutti` | DAMAGE | — | HIT | HIT 25 |
| Scherzo Oltre il Limite | `base.cesira.Malelingue` | DISRUPT | — | HIT | HIT 5+x |
| Fiuto per gli Affari | `base.cesira.LoRivendo` | ITEMS | +8 H | — | — |
| Prima gli Italiani | `base.rocco.PrimaIo` | ITEMS | +4 H | — | — |
| Rinfrescata Arrogante | `base.rocco.bound.Colpetto` | DAMAGE | — | HIT | HIT 2 |
| Rialziamoci e Partite! | `base.rocco.bound.MiRialzo` | RESOURCES | — | — | — |
| (Dis)onore alla Bandiera | `base.rocco.bound.AlzoLaVoce` | DEFENSE | +8 A | — | — |
| Non Mi Hai Fatto Niente | `base.rocco.NeHoPreseDiPeggio` | DAMAGE | — | HIT | HIT 10 |
| Nocche Sbucciate | `base.rocco.NoccheSbucciate` | DAMAGE | — | HIT | HIT 20 |
| Stoico come un Busto di Bronzo | `base.rocco.Incassare` | DEFENSE | +4 H | — | — |
| E Allora...? | `base.rocco.EAllora` | COUNTER | — | HIT | HIT 8 |
| Craniata Patriottica | `base.rocco.Capocciata` | DAMAGE | — | HIT | HIT 25 |
| La Storia la Scrivono i Vincitori | `base.rocco.TeLoSpiegoIo` | DISRUPT | +6 H | HIT | HIT 4 |
| Testa Dura | `base.rocco.TestaDura` | DAMAGE | — | HIT | HIT 30 |
| Afferrare | `com.Grab` | ITEMS | — | — | — |
| Furto con Destrezza | `com.Steal` | ITEMS | — | — | — |
| Scatto Repentino | `base.com.ShuffleFeet` | ITEMS | — | — | — |
| Ce l'Hai Due Spicci? | `base.com.BeggingMoney` | ITEMS | — | — | — |
| GABBIANO, DUNQUE VOLIAMOTI | `bruiser.SeagullFly` | DAMAGE | — | HIT | HIT 20 |
| Foratone da 28 | `base.com.MattoneDelCantiere` | DAMAGE | — | HIT | HIT 25 |
| ORMALE GUARIAMOTI | `bruiser.HealingBlow` | DAMAGE | — | HIT | HIT 30 |
| AMMALIAMOTI DI BOTTE | `bruiser.SickeningBlow` | DAMAGE | — | HIT | HIT 10 |
| STORDIAMOTI HO DETTO | `bruiser.StunningBlow` | DISRUPT | — | HIT | HIT 10 |
| PERMESSO SCUSA PUOI SMETTERLA | `bruiser.BadEducation` | OTHER | — | HIT | HIT 8 |
| GENTILE IL TUO CAREZZO | `bruiser.CantFeelAnything` | DEFENSE | +5 A | — | — |
| Estrema Fretta di Alcolizzarsi | `base.com.RincorsaDalMarciapiede` | DAMAGE | +5 V | HIT | HIT 10 |
| Tecnica del Carapace Mentale | `base.com.TartarugaSulMarciapiede` | DEFENSE | +2 H | — | — |
| Denti Stretti | `base.com.DentiStretti` | RESOURCES | +10 V | — | — |
| Due Dita in Gola | `base.com.DueDitaInGola` | OTHER | — | — | — |
| Fasciatura d'Emergenza | `base.com.FasciaturaColFazzolettaccio` | RESOURCES | +8 H | — | — |
| Sputo nel Posacenere | `base.com.SputoDaPosacenere` | DAMAGE | — | POISON | POISON 10 |
| Spintone | `base.com.Spintone` | DAMAGE | — | HIT | HIT 8 |
| Mano Lesta | `base.com.ManoLesta` | DISRUPT | +5 A | — | — |
| Riprendere Fiato | `base.com.SecondoFiato` | RESOURCES | +10 H | — | — |
| Coccio di Bottiglia | `base.com.CoccioDiBottiglia` | OTHER | — | — | — |
| Svegliaaah! | `base.com.AcquaInFaccia` | DISRUPT | — | HIT | HIT 4 |
| Sgambetto | `base.com.Sgambetto` | DISRUPT | — | HIT | HIT 5 |
| Estasi da Coca Etilene | `base.com.EstasiDaCocaEtilene` | DAMAGE | — | HIT | HIT 40 |
| Addosso!!! | `com.last.Struggle` | DAMAGE | — | HIT | HIT 10 |
| Negroni Trovato per Terra | `com.items.CocktailOnTheGround` | RESOURCES | +10 V, +10 L, +2 T | — | — |
| Bionda da 66, Calda | `com.items.RottenBeer` | RESOURCES | +10 L | — | — |
| Doppio Malto da Discount | `com.items.AnotherRottenBeer` | RESOURCES | +10 L | — | — |
| Mescolone Micidiale | `com.items.MarvelousCocktail` | RESOURCES | +20 L, +20 T | — | — |
| Amaro nel Bicchiere di Plastica | `base.items.AmaroNelBicchiereDiPlastica` | RESOURCES | +20 L | — | — |
| Espresso della Macchinetta | `base.items.EspressoDelDistributore` | RESOURCES | +15 A | — | — |
| Kebab Abbandonato | `base.items.PaninoDelKebab` | RESOURCES | +10 H, +2 T | — | — |
| Acqua Minerale Sgasata | `base.items.MezzaMineraleSgasata` | OTHER | +20 A | — | — |
| Guanti da Officina | `base.items.GuantiDaOfficina` | OTHER | — | — | — |
| Giubbotto di Finta Pelle | `base.items.GiubbottoDiFintaPelle` | OTHER | — | — | — |
| Casco da Cantiere | `base.items.CascoDaLavoro` | OTHER | — | — | — |
| Pasticca Abbandonata | `base.items.PasticcaTrovataSulBancone` | RESOURCES | +10 T | — | — |
| Posacenere di Vetro | `base.items.PosacenereDiVetro` | OTHER | — | — | — |
| Ghiaccio nel Tovagliolo | `base.items.GhiaccioNelTovagliolo` | RESOURCES | +10 H | — | — |
| Santino di San Briaco | `base.items.SantinoDellaPortinaia` | OTHER | — | — | — |
| Grappa della Casa | `base.items.GrappaDellaCasa` | RESOURCES | +25 L | — | — |
| Conto del Tavolo Sei | `base.items.ContoDelTavoloSei` | RESOURCES | +15 V | — | — |
| Sigaretta Accesa | `base.items.SigarettaAccesa` | RESOURCES | +10 A | — | — |
| Bottiglia Spaccata | `com.tokens.BrokenBeerBottle` | OTHER | — | — | — |

## Revisioni

- **1.0 — 23 novembre 2026, SB-28:** il Set Base entra nella partita viva e sostituisce la 0.1, archiviata in `docs/history/set-base-0.1.md`. **Richiede il regolamento 2.0**, che porta nel sistema le regole del playground con cui il set è stato bilanciato (D50, D78, D183). Generata dal file del set `server/src/main/resources/sets/base.json` (SHA-256 `de7088d20b90095d4d489aa55a373ff2b1256a8bfdfe8badd459f71fd24b89ba`), ricavato dalla bozza `server/src/test/resources/set-base/bozza.json` (SHA-256 `a969dff08aaa80895f9345c6f1d5787699469c90adc806e3880c48e58e964f9b`), con i testi completi di SB-25 `docs/design/set-base/testi/testi-completi.json` (SHA-256 `ef7cd3ea9e0c3bf0f52dd7c6c6296cdc05b4ac92afc1e5592ca7a9c5158b6ae7`) e gli slot `docs/design/set-base/testi/slot.json` (SHA-256 `48bc14dd58706e7d8ca9bb3583e5d4eaa714bff591233ffb549635a8a35176f7`). Schede = testi completi approvati in D174, coi rimandi al regolamento (D183); testo breve, guadagni e danno nominale dal generatore di SB-25; starter con nome e categoria (D182). Al passaggio i mazzi personalizzati salvati che contengono carte dello 0.1 uscite dal set si cancellano (D182 (3)).
