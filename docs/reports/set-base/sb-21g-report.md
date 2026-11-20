# SB-21g — Numeri della bozza e bilanciamento

**Bozza conforme a D158 e starter promossi.** Tutte le 21 coppie nel 35–65%, 2 fuori obiettivo contro 3 di SB-21f. Patte 4,164% e durata media 8,702 turni. Tutte le 21 bound entro D33/D36. Le due quote fuori obiettivo sono Mara–Beppe e Mara–Duccio.

Piera costruita vince 6/6. Incroci costruito–starter oltre il 70% 35/35 contro 32/35 di SB-21f.

SHA-256 della bozza `bb182da96a63c958fe8cddd55fb966329258e749b57742d17a229321950f91be`.

## Passo 0

Ingresso SB-21f `0e56eebbc3aa224cca5ba06fe1997d151fc4c4f6aa2d1f3f87120e2af6aebe81`. Le 16.128 partite di fattibilità riproducono i cinque file della verifica rapida della consegna SB-21f byte per byte. Rif con 403.200 partite, identico alla matrice ricomposta di SB-21f per tutte le 4.032 celle, le 147 voci di osservazione e il tetto di ogni bound. Zero violazioni. Il codice misurato coincideva con SB-21f. [Impronte](sb-21g/passo-0.json) · [Rif](sb-21g/matrice-rif.json).

Il proprietario ha confermato l’uso del checkout dopo aver chiuso i processi locali con «si scusami, chiuso».

## Valori D158

| Voce | Prima → consegna | Motivo |
| --- | --- | --- |
| Mara, salute iniziale | 69 → 70 | Entrambi i vicini misurati. A 68 Mara–Beppe scende al 34,89% nella passata B. A 70 la correzione E recupera 3,84 pp su quella coppia rispetto a C. |
| Piera, salute iniziale | 79 → 78 | Entrambi i vicini misurati. Si tiene 78 con il compenso a 14 L, verificato contro tutti gli starter. |
| Spintone | 7 → 8 HIT | I due vicini passano D143. A 8 la prova C recupera Mara–Beppe con 68 salute e abbrevia la matrice. |
| Raschiare il fondo | +7 → +6 T | Vicino inferiore, costo pesato 0,90/4. |
| L’ultima dose | 7 → 8 POISON base | Vicino superiore, misurato nelle prove C e D. Nella prova D accorcia lo specchio da 13,780 a 13,694 turni. |
| Lo metto in conto | +7 → +8 A | Vicino superiore, provato nelle combinazioni che recuperano le coppie di Sergio. |
| Testa dura | 33 → 35 HEALTH | Valore del proprietario. |
| Il bancone regge, io pure | HIT ×0,65 → ×0,75 | Provati entrambi i fattori. A parità di resto, G contro F riduce patte e turni e lascia lo stesso numero di coppie fuori obiettivo. |
| Sgommata, tre status di anticipo | HIT, CUT e POISON ×0,8 → ×0,75 | Trovati nell’audit delle carte. Il fattore ammesso più vicino vale per tutti e tre. |

L’audit ricorsivo copre risorse, effetti, costi e parametri Java di 7 personaggi e 117 carte. Il 50% di Ricatto e i divisori 2 rappresentano la metà. Il divisore 1 di Metabolismo Corrotto rappresenta la perdita integrale di T. Gli incrementi per oggetto o giocata sono importi. Nessun conflitto con R1–R4 di D143. I testi generati e le descrizioni degli status riprendono i valori della bozza. Motore e bot leggono il fattore dagli stessi dati tramite gli effetti stampati. Giro secco conserva 10 + L spesa e 0 HIT a sé, Estasi 40 HIT per 10 T + 10 L.

## Passo 1 — Vicini conformi

| Prova | Nel 35–65% | Fuori obiettivo ≤3 | Patte | Turni | Fasce per coppia | Bound | D149 (4) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rif SB-21f | 21/21 | 3 · Sì | 4,217% · Sì | 8,813 · Sì | Sì | Sì | Sì |
| A · Mara 70, Piera 80, Bancone ×0,75, quattro 7 → 6 | 21/21 | 5 · No | 4,393% · No | 8,923 · No | No | Sì | No |
| B da A · Mara 68, Piera 78, Bancone ×0,5 | 20/21 (Mara–Beppe 34,89%) | 4 · No | 4,298% · No | 8,864 · No | No | Sì | No |

A tiene tutte le coppie nel 35–65%. B sposta in media le sei coppie di Mara di 1,93 pp dal Rif contro 2,76 in A, e quelle di Piera di 2,05 contro 1,92. La posizione di Mara contro Beppe fa scartare B come consegna. Le due prove cambiano anche il Bancone. F e G lo confrontano a parità di salute e risorse.

## Passo 2 — Riequilibrio

| Prova | Nel 35–65% | Fuori obiettivo ≤3 | Patte | Turni | Fasce per coppia | Bound | D149 (4) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| C da B · Spintone, L’ultima dose e Lo metto in conto a 8 | 21/21 | 7 · No | 4,308% · No | 8,689 · Sì | No | Sì | No |
| D da A · due carte a 8 come in C, Spintone a 6, Duccio 118 salute | 21/21 | 5 · No | 4,329% · No | 8,903 · No | No | Sì | No |
| E da C · Mara 70, Piera 14 L, Tossicone 20 POISON | 21/21 | 5 · No | 4,207% · Sì | 8,694 · Sì | Sì | Sì | No |
| F da E · Lo sanno tutti 25 HIT | 21/21 | 4 · No | 4,263% · No | 8,665 · Sì | Sì | Sì | No |
| G da F · Bancone HIT ×0,75 | 21/21 | 4 · No | 4,225% · No | 8,631 · Sì | Sì | Sì | No |
| **H da G · Spazienzio 78 salute, tenuta** | 21/21 | 2 · Sì | 4,164% · Sì | 8,702 · Sì | Sì | Sì | Sì |

C prova i vicini superiori per recuperare Mara–Beppe e accorciare gli scontri. D prova a recuperare Duccio–Mara, ma porta Beppe–Duccio fuori obiettivo e peggiora due durate. E accelera lo specchio di Celestina col Tossicone, recupera Mara–Beppe con la salute e limita Piera–Sergio con la L. F rientra contro Piera e Celestina con un punto in più a Lo sanno tutti, facendo uscire Spazienzio–Sergio dalla fascia obiettivo. G confronta direttamente i due fattori del Bancone. H recupera Spazienzio contro Mara e Sergio usando una sola leva.

**Compensi tenuti oltre a D158.** Spazienzio 75 → 78 HEALTH, Piera 15 → 14 L iniziale, Tossicone Scatarrante 18 → 20 POISON, Lo sanno tutti 24 → 25 HIT.

| Coppia | Rif | A | B | H | Com–com H |
| --- | --- | --- | --- | --- | --- |
| Spazienzio–Mara | 46,42% | 44,00% | 47,54% | 47,45% | 59,18% |
| Spazienzio–Celestina | 47,56% | 47,57% | 47,57% | 47,72% | 67,43% |
| Spazienzio–Piera | 43,00% | 45,39% | 44,35% | 48,89% | 70,44% |
| Spazienzio–Beppe | 50,69% | 51,90% | 51,90% | 55,06% | 81,31% |
| Spazienzio–Sergio | 43,90% | 46,18% | 46,18% | 43,57% | 54,76% |
| Spazienzio–Duccio | 44,73% | 47,19% | 47,19% | 48,89% | 47,33% |
| Mara–Celestina | 59,93% | 58,34% | 55,35% | 59,08% | 62,98% |
| Mara–Piera | 53,58% | 55,95% | 55,71% | 57,63% | 62,25% |
| Mara–Beppe | 36,78% | 40,08% | 34,89% | 39,04% | 70,20% |
| Mara–Sergio | 41,92% | 44,11% | 40,84% | 41,60% | 39,16% |
| Mara–Duccio | 59,76% | 64,50% | 58,96% | 64,23% | 39,70% |
| Celestina–Piera | 55,13% | 56,49% | 58,49% | 58,50% | 53,89% |
| Celestina–Beppe | 41,65% | 42,15% | 42,15% | 42,92% | 56,86% |
| Celestina–Sergio | 60,36% | 61,87% | 61,87% | 57,94% | 55,52% |
| Celestina–Duccio | 40,89% | 43,97% | 43,97% | 45,06% | 35,19% |
| Piera–Beppe | 43,31% | 43,30% | 42,96% | 44,27% | 56,96% |
| Piera–Sergio | 63,42% | 62,53% | 62,71% | 54,65% | 48,86% |
| Piera–Duccio | 50,31% | 54,85% | 54,69% | 46,88% | 34,75% |
| Beppe–Sergio | 50,06% | 50,95% | 50,95% | 44,49% | 19,53% |
| Beppe–Duccio | 41,30% | 44,76% | 44,76% | 41,27% | 24,83% |
| Sergio–Duccio | 55,72% | 60,15% | 60,15% | 59,53% | 59,31% |

Il controllo com–com ha 7 coppie su 21 fuori dal 35–65%. Tutte le prove hanno zero violazioni. Per ogni variante i JSON [prove](sb-21g/prove-h.json) elencano i binding cambiati presenti nei mazzi, le coppie riusate senza quei binding e il valore massimo di ogni bound. Matrici a 100 semi per cella con [partenza](sb-21g/matrice-d158a.json) e [consegna](sb-21g/matrice-h.json).

## Passo 3 — Isolamenti

Guadagni in punti percentuali. Banda D131 da 0 a +10 pp di media e al più +15 pp in ciascuna coppia.

| Prova | Media | Massimo | Media com–com | Giocate/partita | D131 |
| --- | --- | --- | --- | --- | --- |
| Giro secco in Spazienzio | 3,48 | 8,42 | 1,52 | 1,173 | In banda |
| Giro secco in Mara | 7,12 | 11,67 | -2,24 | 1,348 | In banda |
| Giro secco in Beppe | -13,04 | -2,72 | -14,39 | 1,516 | Sotto banda |
| Estasi in Celestina | -8,34 | 9,13 | 1,08 | 0,447 | Sotto banda |

Stessi mazzi e scambi di SB-21f. Due Giro secco al posto di GABBIANO DUNQUE VOLIAMOTI, Sputo da posacenere o Chiave da tredici. Estasi aggiunge due copie al posto di due Tossicone al controllo con due Grappa al posto di due Panino. Gli esiti sono informativi per D131. [Giro secco](sb-21g/isolamenti-giro-secco.json) · [Estasi](sb-21g/isolamento-estasi.json).

## Passo 4 — Costruiti

Ricerca dei sette in 3.882,69 s, poi 907.200 partite dirette, zero violazioni. Quote percentuali del mazzo in riga nelle sole decisive fra euristici. La riga di Piera evidenzia i sei incroci di D150 (3).

### Costruiti contro costruiti

| Mazzo | Spazienzio | Mara | Celestina | Piera | Beppe | Sergio | Duccio |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Spazienzio | 51,94 | 54,12 | 40,74 | 15,84 | 24,33 | 43,35 | 37,74 |
| Mara | 45,88 | 51,81 | 33,86 | 12,36 | 14,61 | 28,61 | 6,50 |
| Celestina | 59,26 | 66,14 | 48,80 | 26,92 | 31,88 | 60,43 | 40,18 |
| Piera | **84,16** | **87,64** | **73,08** | 50,73 | **62,97** | **90,51** | **95,90** |
| Beppe | 75,67 | 85,39 | 68,12 | 37,03 | 49,40 | 53,26 | 71,75 |
| Sergio | 56,65 | 71,39 | 39,57 | 9,49 | 46,74 | 51,06 | 50,24 |
| Duccio | 62,26 | 93,50 | 59,82 | 4,10 | 28,25 | 49,76 | 45,66 |

- Piera è l’unica a vincere 6/6, con quote da 62,97% a 95,90%. La condizione D150 (3) resta aperta, come in SB-21f. Mara è l’unica a perdere 6/6.
- Quote aggregate fra costruiti di Spazienzio e Mara: 36,03% e 23,96%. In SB-21f erano 20,01% e 12,50%.

### Costruiti contro starter

| Mazzo | Spazienzio | Mara | Celestina | Piera | Beppe |
| --- | --- | --- | --- | --- | --- |
| Spazienzio | 86,01 | 91,51 | 97,84 | 84,79 | 93,18 |
| Mara | 88,94 | 94,79 | 99,36 | 88,53 | 89,33 |
| Celestina | 92,74 | 92,71 | 94,47 | 93,80 | 94,07 |
| Piera | **97,06** | **98,57** | **99,78** | **97,31** | **96,92** |
| Beppe | 97,66 | 98,28 | 99,33 | 96,10 | 98,93 |
| Sergio | 93,12 | 98,19 | 98,75 | 93,04 | 98,40 |
| Duccio | 98,38 | 99,40 | 100,00 | 95,23 | 100,00 |

Incroci oltre il 70%: 35/35 (100,00%) contro 32/35 (91,43%) di SB-21f. Nel controllo com–com, 18/35 rispetto a 13/35. [Ricerca e liste](sb-21g/ricerca-h.json) · [Scontri](sb-21g/scontri-h.json) · [Stili](sb-21g/stili-h.json).

**Banco 5.239,78 s su 6.000.** Lavoro prima degli isolamenti 933,25 s, isolamenti 178,37 s. [Tempi per corsa](sb-21g/tempi.json).

## Riproduzione

In una copia di riproduzione della consegna, riportare solo `bozza.json` ai byte del commit d’ingresso `58667b9`. Dalla radice, lanciare [sb21g.py](sb-21g/sb21g.py) con `--shell (Get-Process -Id $PID).Path`. `passo0` usa le uscite storiche di SB-21f in `server/target/sb-21f`. `d158 d158a 70 80 0.75` misura A. Per ogni prova successiva usare `--bozza server/target/sb-21g/<base>.json starter <nome> <base> <binding:campo:valore>...`. Gli argomenti si leggono dai JSON `prove-<nome>.json` nelle voci `modifiche`. Con `--bozza server/target/sb-21g/h.json`, eseguire in serie `isolamenti h` e `costruiti h`. Matrici complete e log restano in `server/target/sb-21g`.

Banco d50, 8 thread, 12 stili per lato, 100 semi per cella da 7.000.000 con posto iniziale alternato. Fattibilità a 4 semi. Ricerca 3b/SB-21f, un personaggio per chiamata, due partenze sui 26 mazzi, tre stili, 12 mutanti, 16 partite per combinazione, 25 generazioni al massimo, pazienza 10 e convalida a 300 partite per combinazione. Semi 7.100.000, 7.900.000 e 7.000.007. [Metodo 3b](sb-21-giro-3b-report.md#metodo).

## Verifiche

Attesi aggiornati per i valori D158 e per i compensi tenuti.

- `Bozza16Test.the16ChangesExactlyWhatD97Approved` recepisce salute di Spazienzio, Mara e Piera, L di Piera, Spintone, Raschiare il fondo e Tossicone.
- `SetBaseDraftTest.theStartersCarryTheSb12aCorrections` recepisce i due nuovi valori di salute dei personaggi base. `theToxicStarterFollowsTheGridWithTheSb13Corrections` e `theToxicMechanicsWorkOnHandBuiltStates` verificano Raschiare il fondo, Tossicone, L’ultima dose e la salute di Spazienzio. `thePinoStarterFollowsTheGrid` e `thePinoMechanicsWorkOnHandBuiltStates` verificano salute, L, parata del Bancone e la salute da cui parte Spazienzio nei due controlli relativi. `theGigiMechanicsWorkOnHandBuiltStates` usa la salute aggiornata di Spazienzio per ricavare il danno.
- `Sb17CardsTest.loSannoTuttiCostsFifteenAlertnessAndDealsTwentyFiveHit` e `loMettoInContoGivesAlertnessThenConsumesTheItem` verificano 25 HIT e +8 A. `Sb18CardsTest.duccioIsInTheDraftWithTheCalibratedCosts` e `aHealthCostIsOfferedOnlyAboveItsCostAndNobodyDiesPaying` usano 35 per Testa dura.
- `StarterRedesignTest.theFiveFoundHitsArePlayableWithTheirApprovedDamage` verifica i 20 POISON di Tossicone.

Le modifiche al gioco sono dati del playground. I file di produzione, il catalogo vivo, il regolamento, le schede normative e il client ricadono fuori dal diff del blocco. La ricerca delle dipendenze dal vivo dei package esentati è vuota.

Suite offline verde dopo l’ultima misura. Server 960 test rilevati, 23 saltati, zero fallimenti o errori. Client di debug 37/37. Fedeltà `TurnForecastFidelityTest` e `ViewTableFidelityTest` verde. Log `server/target/sb-21g/test-offline-finale.log`.

`git diff --check`, `check-links.py` (446 file, zero link rotti), `check-rules.py`, controlli D143, `genera-bozza-di-riferimento.py --verifica` e `rarita-bozza.py --check` verdi. Gli SHA di tutte e otto le varianti sono stati riprodotti con lo script di consegna. La prova H coincide con `bozza.json` byte per byte.
