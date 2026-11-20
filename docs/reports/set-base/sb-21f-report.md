# SB-21f — Bilanciamento dopo D156

**Starter promossi, STOP per Piera costruita e per due isolamenti.** Il compenso tiene 21/21 coppie nel 35–65%, con tre fuori obiettivo. Piera costruita vince ancora tutti e sei gli scontri. La quota più bassa della bozza consegnata è 56,21% contro Beppe. Il candidato sul motore a L più vicino arriva al 60,02% contro Beppe e manca ancora una sconfitta.

La bozza consegnata conserva Giro secco gratuito a 10 HIT più la L spesa, 0 HIT a sé, ed Estasi rara a 40 HIT per 10 T + 10 L. Si tengono Testata da ultimo giro a 35 HIT e 5 HIT a sé e Piera a 79 salute. SHA-256 `0e56eebbc3aa224cca5ba06fe1997d151fc4c4f6aa2d1f3f87120e2af6aebe81`. Banco **5.974,56 s su 6.000**, comprese fattibilità, ricerca, tutte le prove e la copia arrotondata.

**Copia arrotondata.** Nel campione rapido la quota si sposta in media di 12,67 punti sulle 21 coppie. L’incrocio Piera–Duccio cambia di 46,57 punti.

## Passi 0 e 1

Bozza d’ingresso `26670945940bc08bba826da5fc7740392eb3797874bfb80a343ba02ac4a5eb7d`. Fattibilità verde (16.128 partite), con matrice e osservazioni uguali alle impronte storiche, riportando lo SHA nell’intestazione a D149. Rif su 403.200 partite con le sei impronte normalizzate uguali a SB-21e. Le copie serializzate della bozza coincidono nelle due corse. Zero violazioni di partita e delle bound. Codice misurato identico alla consegna di SB-21e. [Impronte](sb-21f/passo-0.json).

| Prova | Quota o guadagno medio | Massimo per confronto | Giocate a partita | Esito |
| --- | ---: | ---: | ---: | --- |
| Starter, solo D156 | 19/21 nel 35–65%, 5 fuori obiettivo | — | — | No. Piera 32,93% contro Celestina, 32,41% contro Beppe. Patte 4,407%, turni 9,054. |
| Giro secco in Spazienzio | +3,02 pp | +7,58 pp | 1,169 | In banda |
| Giro secco in Mara | +6,84 pp | +10,26 pp | 1,359 | In banda |
| Giro secco in Beppe | −14,70 pp | −2,57 pp | 1,547 | STOP, sotto banda |
| Estasi in Celestina | −6,50 pp | +13,96 pp | 0,468 | STOP, sotto banda |

Banda D131 da 0 a +10 pp di media e al massimo +15 pp per incontro. Due copie di Giro secco al posto di GABBIANO DUNQUE VOLIAMOTI, Sputo da posacenere o Chiave da tredici, come in SB-21e. Per Estasi, A ha due Grappa al posto di due Panino. B usa anche due Estasi al posto di due Tossicone. Nel controllo com–com, guadagni medi nello stesso ordine +2,29, −3,62, −15,77 e +0,93 pp. [Starter](sb-21f/verifica-starter-d156.json) · [Giro secco](sb-21f/isolamenti-giro-secco.json) · [Estasi](sb-21f/isolamento-estasi.json).

## Passo 2 — Compensi provati

Le cinque prove partono tutte dai soli valori di D156. Il riferimento SB-21e ha 21/21 coppie nel 35–65%, 3 fuori obiettivo, patte al 4,224% e durata media di 8,954 turni. Le colonne delle fasce e degli aggregati devono passare insieme.

| Prova | Nel 35–65% | Fuori obiettivo | Patte agg. | Turni agg. | Fasce per coppia | Tetto bound | Esito |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L iniziale 15 → 20 | No, 20/21 | No, 4 | No, 4,295% | No, 8,975 | Sì | Sì | Scartata |
| Testata 25 → 30 HIT | Sì, 21/21 | Sì, 3 | No, 4,312% | No, 8,971 | No, specchio Piera 10,037% di patte | Sì | Scartata |
| Testata 25 → 35 HIT | No, 20/21 | No, 4 | No, 4,265% | Sì, 8,882 | Sì | Sì | Scartata |
| Testata a 30 HIT e L iniziale 16 | — | — | — | — | — | No, 4,75 su 4,00 | Scartata |
| Testata a 35 HIT e salute 82 → 79 | Sì, 21/21 | Sì, 3 | Sì, 4,217% | Sì, 8,813 | Sì | Sì | Tenuta |

A 20 L Piera supera il 65% contro Sergio. Testata a 30 recupera le quote ma lascia patte e durata oltre il Rif. A 35 chiude prima, ma Piera arriva al 68,76% contro Sergio. Aggiungere una L alla variante a 30 viola il tetto di «Cinque minuti e vado» al terzo uso (3 HIT parati più 1,75 per la L). La stessa prova con 15 L arriva a 3,75, come il Rif. Il proprietario al rosso ha risposto «Scarta il candidato e continua». Ho tenuto il danno rapido della variante a 35 e ridotto la salute di Piera per correggere le quote contro Sergio e Spazienzio. [L20](sb-21f/verifica-starter-l20.json) · [Testata 30](sb-21f/verifica-starter-testata30.json) · [Testata 35](sb-21f/verifica-starter-testata35.json) · [Tetto](sb-21f/tetto-testata30-l16.json) · [Compenso tenuto](sb-21f/verifica-starter-testata35-h79.json).

Nel controllo com–com si contano 7 coppie fuori 35–65% con i soli valori di D156 e 5 con il compenso tenuto. [Matrice iniziale](sb-21f/matrice-d156.json) · [Matrice compensata](sb-21f/matrice-testata35-h79.json).

## Passo 3 — Costruiti

Ricerca dei sette personaggi in 3.530,38 s, poi 907.200 partite dirette e zero violazioni. Le matrici riportano la quota percentuale sulle decisive per il mazzo di riga con due bot euristici. [Ricerca e liste](sb-21f/ricerca-h79.json) · [Scontri e com–com](sb-21f/scontri-h79.json) · [Stili](sb-21f/stili-h79.json).

### Costruiti contro costruiti

| | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Spazienzio | 52,50 | 67,52 | 26,91 | 12,31 | 6,16 | 5,50 | 3,71 |
| Mara | 32,48 | 52,21 | 20,44 | 5,22 | 5,18 | 7,50 | 5,88 |
| Celestina | 73,09 | 79,56 | 54,30 | 33,00 | 23,98 | 46,33 | 21,41 |
| Piera | **87,69** | **94,78** | **67,00** | 56,96 | **56,21** | **66,71** | **65,65** |
| Beppe | 93,84 | 94,82 | 76,02 | 43,79 | 47,10 | 61,68 | 35,30 |
| Sergio | 94,50 | 92,50 | 53,67 | 33,29 | 38,32 | 52,95 | 36,18 |
| Duccio | 96,29 | 94,12 | 78,59 | 34,35 | 64,70 | 63,82 | 48,15 |

### Costruiti contro starter

| | Spazienzio | Mara | Celestina | Piera | Beppe |
| --- | ---: | ---: | ---: | ---: | ---: |
| Spazienzio | 84,82 | 78,32 | 94,81 | 84,11 | 81,91 |
| Mara | 75,03 | 69,38 | 85,78 | 65,11 | 65,81 |
| Celestina | 92,10 | 95,68 | 99,22 | 95,51 | 94,59 |
| Piera | **96,69** | **95,58** | **99,63** | **95,81** | **96,12** |
| Beppe | 97,77 | 98,99 | 99,33 | 95,46 | 98,48 |
| Sergio | 96,84 | 99,67 | 99,78 | 95,04 | 98,89 |
| Duccio | 97,13 | 99,55 | 99,63 | 94,85 | 99,85 |

Piera è l’unico costruito che vince tutti e sei gli incroci. Gli incroci costruito–starter oltre il 70% passano da 35/35 nel giro 3b a 32/35 (91,43%), tutti e tre i rientri per Mara. L’eccesso medio oltre il 70% scende da 25,73 a 22,20 pp. Nel controllo com–com gli incroci oltre il 70% passano da 25/35 a 13/35. Piera com–com perde contro Beppe, Sergio e Duccio. [Giro 3b](sb-21-giro-3b-report.md#ricerca-e-scontri-prima-e-dopo).

## Passo 4 — Motore a L di Piera

La basic entra in gioco 1,35 volte a partita con Piera costruita e 0,31 con lo starter. Ho provato prima quella leva. «Cinque minuti e vado» si gioca 0,03 volte nel costruito e 0,23 nello starter, perciò l’ho usata insieme alla basic per cercare un taglio che rispettasse gli starter. La lista costruita iniziale usa «Ne ho prese di peggio». Ho ridotto la base di «L’ultimo giro» in una sola combinazione per recuperare il margine contro Sergio, poi sono passato alla L iniziale. [Uso](sb-21f/uso-h79.json).

| Candidato | Nel 35–65% | Fuori obiettivo | Patte agg. | Turni agg. | Fasce per coppia e tetto bound | D150 (3) |
| --- | --- | --- | --- | --- | --- | --- |
| Basic +10 L | Sì | Sì, 3 | No, 4,282% | Sì, 8,820 | Sì | — |
| Basic +12 L | Sì | Sì, 3 | No, 4,247% | Sì, 8,817 | Sì | — |
| Basic +14 L | Sì | Sì, 3 | Sì, 4,221% | Sì, 8,815 | Sì | No, vince 6/6 |
| Basic +10 L, bound +2 L | No, Sergio 65,43% | Sì, 3 | No, 4,22443% | Sì, 8,794 | Sì | — |
| Basic +8 L, bound +2 L | No, Sergio 65,02% | Sì, 3 | No, 4,260% | Sì, 8,798 | Sì | — |
| Basic +10 L, bound +3 L | Sì | Sì, 3 | No, 4,276% | Sì, 8,805 | Sì | — |
| Basic +12 L, bound +2 L | No, Sergio 65,67% | Sì, 3 | Sì, 4,211% | Sì, 8,790 | Sì | — |
| Basic +12 L, bound +2 L, ultima risorsa base 10 | No, Sergio 65,30% | Sì, 3 | Sì, 4,210% | Sì, 8,793 | Sì | — |
| Basic +12 L, bound +2 L, L iniziale 14 | Sì | Sì, 3 | Sì, 4,175% | Sì, 8,801 | Sì | No, vince 6/6 |

Le combinazioni senza esito D150 si fermano a D149. Il limite esatto delle patte aggregate è 4,22399%. Le liste di entrambi i candidati ammessi sono state ricercate nuovamente, con i sei altri finalisti fissi. [Starter +14](sb-21f/verifica-starter-basic14.json) · [Starter 12/2/14](sb-21f/verifica-starter-basic12-bound2-l14.json).

| Lista di Piera | Spazienzio | Mara | Celestina | Beppe | Sergio | Duccio |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Compenso starter, H79 | 87,69 | 94,78 | 67,00 | 56,21 | 66,71 | 65,65 |
| Basic +14 L | 95,50 | 96,72 | 83,52 | 74,73 | 82,29 | 86,99 |
| Basic +12 L, bound +2 L, L iniziale 14 | 91,79 | 91,80 | 71,78 | 60,02 | 71,93 | 77,76 |

[Basic +14 L](sb-21f/scontri-piera-basic14.json) · [Basic +12 L, bound +2 L, L iniziale 14](sb-21f/scontri-piera-basic12-bound2-l14.json).

Il residuo dopo gli scontri e il confronto arrotondato è 25,44 s. La ricerca successiva richiederebbe circa nove minuti come le due ricerche di Piera appena svolte. Il candidato 12/2/14 passa gli starter e vince ancora 6/6. La bozza di consegna resta il compenso del passo 2, che lascia il minimo costruito più vicino al 50%.

## Confronto rapido con arrotondamento

Sono cambiati 105 importi nella copia. Salute, risorse e importi fino a 20 sono ai multipli di 2, con gli equidistanti verso il basso. Sopra 20 si usa il multiplo di 5 più vicino. Giro secco ed Estasi conservano integralmente i valori fissati, compreso il coefficiente di Giro secco. I quattro semi per cella sono gli stessi nelle due matrici, 16.128 partite per copia. Il campione fornisce un’indicazione della sensibilità ai numeri. Il controllo D149 di consegna usa la matrice a 100 semi per cella.

| Copia | Coppie nel 35–65% | Fuori obiettivo | Patte | Turni |
| --- | ---: | ---: | ---: | ---: |
| Consegna, campione rapido | 15/21 | 11 | 4,971% | 8,523 |
| Arrotondata, stessi semi | 9/21 | 18 | 3,538% | 8,398 |

Sedici coppie si spostano di almeno 5 pp e dieci di almeno 10 pp. I salti maggiori sono Piera–Duccio (35,84 → 82,41%), Celestina–Piera (53,70 → 24,27%) e Beppe–Sergio (62,89 → 37,74%). Com–com passa da 11 a 17 coppie fuori dal 35–65%. Zero violazioni e tetti verdi sulle due corse. [Importi](sb-21f/arrotondamenti.json) · [Base](sb-21f/matrice-rapida-base.json) · [Arrotondata](sb-21f/matrice-rapida-arrotondata.json).

Il proprietario ha chiesto «valutami anche con tutti i valori arrotondati, sotto il 20 ogni 2, sopra il 20 ogni 5», specificando «Salute, risorse e importi di tutta la bozza» e «non importa analisi estensiva della bozza arrotondata, giusto per vedere se cambia tantissimo o no rispetto alla versione "perfetta" con i numeri brutti». Ha confermato «Sì, usa il checkout attuale in E:\bm, lascia intatti i sei file in output/pdf e riparti dal passo 0 di SB-21f.»

## Riproduzione

Dalla radice, usare [sb21f.py](sb-21f/sb21f.py) con `--shell (Get-Process -Id $PID).Path`, avendo come ingresso la bozza SB-21e (`3587a0f`). Eseguire `passo0`, `fissi` e `passo1` in serie. Per ogni prova starter, usare `starter <nome> d156 starter-pino` con le modifiche qui sotto. Vengono rimisurate tutte le coppie che coinvolgono Piera, nei lati originali, e riusate le altre 21 dopo aver verificato che i loro mazzi non dipendano dalle leve cambiate.

```text
l20           base.character.Pino:resources.ALCOHOL:20
testata30     base.pino.TestataDaUltimoGiro:target.0.amount:30
testata35     base.pino.TestataDaUltimoGiro:target.0.amount:35
testata30-l16 base.pino.TestataDaUltimoGiro:target.0.amount:30 base.character.Pino:resources.ALCOHOL:16
testata35-h79 base.pino.TestataDaUltimoGiro:target.0.amount:35 base.character.Pino:resources.HEALTH:79
```

Per la ricerca usare `costruiti h79` sulla copia `server/target/sb-21f/testata35-h79.json` o sulla bozza con i medesimi valori. Il banco usa d50, otto thread, 12 stili per parte, 100 semi per cella da 7.000.000, alternanza del primo posto. Le quote valgono sulle decisive fra euristici (D93). I grezzi per stile, le copie e i log sono in `server/target/sb-21f`. La ricerca ripete la procedura 3b con una chiamata per personaggio, due partenze sui 26 mazzi, tre stili, 12 mutanti, 16 partite per combinazione, 25 generazioni al massimo, pazienza 10, 300 partite per combinazione di convalida. Semi 7.100.000, 7.900.000 e 7.000.007. [Metodo 3b](sb-21-giro-3b-report.md#metodo) · [Tempi](sb-21f/tempi.json).

Al passo 4 passare `--bozza server/target/sb-21f/testata35-h79.json` a `starter <nome> testata35-h79 starter-pino`. Le tre chiavi delle leve sono `base.pino.QuestoLoFiniscoIo:self.0.amount`, `base.pino.bound.CinqueMinutiEVado:self.0.amount` e `base.character.Pino:resources.ALCOHOL`. Per l’ultima risorsa usare `base.pino.UltimoGiro:params.base`. Accodare `:valore` a ogni chiave. Le etichette sono `basic10`, `basic12`, `basic14`, `basic10-bound2`, `basic8-bound2`, `basic10-bound3`, `basic12-bound2`, `basic12-bound2-lr10`, `basic12-bound2-l14`. Per le due copie promosse eseguire `--bozza <copia> costruiti <nome> --precedente h79`. Per il confronto rapido sulla bozza consegnata usare `arrotonda` e `misura-arrotondata` in serie.

## Verifiche

- `Bozza16Test.the16ChangesExactlyWhatD97Approved` attende Giro secco con coefficiente 1 (D156), Testata a 35 e Piera a 79 salute (compenso tenuto).
- `SetBaseDraftTest.thePinoStarterFollowsTheGrid` e `thePinoMechanicsWorkOnHandBuiltStates` recepiscono gli stessi valori e il testo di Giro secco. `estasiRequiresAndSpendsBothResources` verifica testo e danno a 40 HIT, conservando le asserzioni sui due costi.
- `StarterRedesignTest.theFiveFoundHitsArePlayableWithTheirApprovedDamage` verifica il danno di Giro secco dopo Annuncia con 7 L, quindi 17 HIT.
- `EstasiDamageCapTest.capsD149DamageInTheEngineAndBothBotModels` mantiene tutti gli attesi e fissa a 2 il coefficiente della fixture storica D149. La prima suite ha rilevato cinque attesi legati al coefficiente ereditato dalla bozza. Il test originale è verde (6/6) sulla bozza di ingresso `bf6b470`. Log `server/target/sb-21f/test-offline-primo.log` e `server/target/sb-21f/test-tetto-base.log`.

- Suite offline dopo l’ultima misura verde. Server 960 test rilevati, 23 saltati, zero fallimenti o errori. Client di debug 37/37. Log `server/target/sb-21f/test-offline-finale.log`.
- `git diff --check`, `check-links.py`, `check-rules.py`, D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` verdi. D143 verde anche sulle copie dei candidati e sulla copia arrotondata. Il perimetro tecnico è limitato al playground. Il contesto Spring e la verifica dei manifest appartengono alla partita viva.
