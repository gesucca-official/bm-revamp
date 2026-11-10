# SB-15 — Gigi del Carro Attrezzi: rarità nella bozza, bozza dello starter e giro coi bot: rapporto

**Fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo SB-15» ([D45](../../set-base-plan.md#decisioni-del-proprietario)). Due parti, in due commit.

**Parte 1 (commit `71a263a`).** La bozza del Set Base è nel formato `sb-6b/1` e ogni carta e personaggio ha la rarità della
[griglia](../../design/set-base/griglia.md), come ha deciso il proprietario con D44, punto 6. Le partite non cambiano: la matrice dei
quattro starter approvati coincide con quella finale di SB-14 cella per cella.

**Parte 2.** Lo starter di Gigi, **«Intervento sul posto»**, è nella bozza come nella griglia, senza scostamenti nella composizione. La
rara «Lavoro fatto bene» (GIG-AR5) usa la classe Java nuova prevista dalla griglia, scritta nei sorgenti di test: il passo 0 l'ha
segnalata e il proprietario ha risposto **«Sì, tutto in SB-15»**. In due giri coi bot Gigi passa da **0,148, 0,127, 0,123 e 0,126**
contro Spazienzio, Mara, Tossico e Pino a **0,589, 0,539, 0,470 e 0,482**, con lo specchio a 0,503. Invarianti a zero in modo stretto
dopo ogni giro.

Cambiano solo numeri di Gigi, con la delega di D38:
- salute 100 (scheda) → 85 (giro 1) → 95;
- V iniziale 15 → 25;
- Chiave da tredici 10 → 12 CUT;
- «Lavoro fatto bene» da 10 a 5 V.

Nessuna carta tagliata, ridisegnata o tolta dallo starter. Gli starter di Spazienzio, Mara, Tossico e Pino sono identici, cella per cella,
a quelli approvati.

Il codice cambia solo in `server/src/test`. Non sono toccati:
- regolamento, documento del set, catalogo SQLite, allegato, client, `scripts/` e `tools/`;
- il caricatore (`Draft`, `DataCards`, `SimulationCatalog`) e le risorse `sb-5/`, `sb-6a/`, `sb-6b/`, `sb-11a/`;
- gli starter approvati di Spazienzio, Mara, Tossico e Pino, e i file del filone C4.

Nulla della bozza raggiunge la partita viva (SB-28).

## Parte 1 — Rarità e identità della bozza

**Cosa cambia.** [`server/src/test/resources/set-base/bozza.json`](../../../server/src/test/resources/set-base/bozza.json):
- testata `sb-6b/1` con il set `{"id": "base", "name": "Set Base", "version": "bozza"}`; le regole del formato restano nel set di
  partenza, com'erano;
- `rarity` su 60 carte e 4 personaggi, nel vocabolario di R07 (C → `COMMON`, NC → `UNCOMMON`, R → `RARE`);
- nient'altro: nessun numero, testo, mazzo o binding.

SHA-256 da `36788562…182cd2f27d5` (SB-14) a **`d645a97f946d9cfd8c70f35363d8306d752c18cc14cc7759f3cdf2d5626a68eb`**.

**Come.** Con lo script di SB-6b, [`sb-6b/rarita-bozza.py`](sb-6b/rarita-bozza.py), scritto per questo passaggio (Q5 di SB-6b) e mai
eseguito prima sulla bozza. Prende la rarità dalla riga della griglia il cui ID apre la descrizione della carta («SPA-BA · …»), e quella
dei personaggi dalla riga PG-…. Modifica il file come testo, una riga per voce. Con `--check` rilegge la griglia e conferma: «rarità come
la griglia».

**Nessuna scelta da dichiarare.** Ogni carta della bozza ha il suo slot all'inizio della descrizione, e ogni slot ha una sola rarità
nella griglia. Non è servito ricorrere a D34, punto 6.

| Rarità | Carte | Personaggi |
|---|---:|---:|
| COMMON | 40 | Spazienzio, Mara |
| UNCOMMON | 15 | Tossico, Pino |
| RARE | 5 (ExtremelyViolentBlow, Slalom, ToxicBloodDrain, Mescolone, Rutto) | — |

Le rare negli starter sono una ciascuno, due nel Tossico (ToxicBloodDrain e Mescolone), come dice la griglia («Rare negli starter: 1 o 2
ciascuno»).

**La versione «bozza».** È quella proposta da SB-6b e tiene distinta la bozza in lavorazione dal Set Base 0.1 di `docs/sets/base.md`,
che descrive le carte di oggi. Ha anche un effetto pratico: in `MultiSetTest` la prova «versione richiesta diversa» chiede `base 0.1` e
si aspetta un rifiuto.

### Le partite non cambiano

Matrice dei quattro starter con le impostazioni di SB-14: 2000 partite per cella, stili aggressivo, prudente, risorse e `com`, semi
7.000.000–7.001.999, posti alternati, mazzi nell'ordine Pino, Tossico, Spazienzio, Mara. [Matrice](sb-15/sb7-rarita-2000.md)
([dati](sb-15/sb7-rarita-2000.json), [tempi](sb-15/sb7-rarita-2000.tempi.txt)).

Confronto con `sb-14/sb7-giro3-2000.json`, campo per campo:
- **160 celle su 160 identiche:** vittorie, sconfitte, patte, limite, primo posto, quota e intervallo, turni, mediana, percentili, minimo e
  massimo;
- le 10 coppie, le invarianti (zero violazioni su 320.000 partite), le statistiche per mazzo e per stile e il tetto delle bound sono
  identici;
- cambiano solo l'impronta e il formato nella testata.

| Incontro | Vittorie / sconfitte / patte | Quota |
|---|---|---|
| Spazienzio contro Mara | 15.071 / 13.615 / 3314 | 0,525 |
| Tossico contro Spazienzio | 15.106 / 13.446 / 3448 | 0,529 |
| Tossico contro Mara | 13.680 / 14.854 / 3466 | 0,479 |
| Pino contro Spazienzio | 16.228 / 11.228 / 4544 | 0,591 |
| Pino contro Mara | 14.998 / 11.830 / 5172 | 0,559 |
| Pino contro Tossico | 11.354 / 15.007 / 5639 | 0,431 |

Era atteso: nessun codice legge la rarità (SB-6b, «Cosa non è provato»), né i bot né il banco.

### La prova

`SetBaseDraftTest.everyCardAndCharacterHasTheGridRarity`, nuova:
- la bozza è `sb-6b/1`, con il solo set `base`, nome «Set Base», versione «bozza», senza `requires`;
- ogni carta ha lo slot all'inizio della descrizione e una rarità del vocabolario di R07, uguale a quella dell'elenco dichiarato nella
  prova (gli slot della bozza divisi per rarità, copiati dalla griglia, ciascuno in uno e un solo elenco); ogni carta è del set `base`;
- ogni personaggio ha il suo slot PG-… e la rarità della griglia;
- conteggi 40, 15 e 5; ogni starter ha una o due rare.

La prova non legge i documenti: l'elenco è scritto nel test, e lo script di SB-6b con `--check` confronta la bozza col file della griglia.
Nessun atteso esistente è cambiato.

## Passo 0 — Fattibilità dello starter di Gigi

**Esito: serve una classe Java nuova nei sorgenti di test, per GIG-AR5 «Lavoro fatto bene»** (6 HIT più 4 per ogni proprio oggetto sul
campo). La griglia la prevede già: colonna «Forma» «Java nuova», tabella «Forma» («GIG-AR5 (conta gli oggetti)») e D35 («una classe Java
nuova per la rara di Gigi»).
- `DataCards.Amount` vale `base` più una risorsa dell'autore divisa per `divide`: legge una risorsa, non il numero degli oggetti.
- Nessuna classe esistente conta gli oggetti propri e colpisce: `BreakYourToy`, `Steal`, `Grab`, `ShuffleFeet`, `BeggingMoney` e
  `AnotherRottenBeer` li tolgono, li spostano o li creano.

Come per Pino, la classe non tocca il caricatore: `Draft` trova una classe Java dal binding con
`Class.forName("com.gsc.bm.model.cards." + binding)`, quindi il pacchetto di test `com.gsc.bm.model.cards.base.gigi` si carica dal binding
`base.gigi.…`, e costo e priorità vengono dalla bozza.

| Slot | Carta | Via |
|---|---|---|
| PG-GIG | Gigi del Carro Attrezzi | dati: H (ipotesi 100 − 15 = 85), A 25, V 15, capacità 3, nessuna immunità |
| GIG-BA | Questo torna utile | dati: `gain` +4 V a sé, poi `consume`; priorità 0 |
| GIG-BO1 | Una stretta e passa | dati: `gain` +5 V a sé |
| GIG-BO2 | Colpo di cacciavite | dati: `damage` 3 HIT |
| GIG-BO3 | Lima (collezione) | dati: `damage` 2 CUT, priorità 2 |
| Last resort | Struggle | già nella bozza |
| GIG-AR1 | Smontiamo tutto | Java esistente `bruiser.BreakYourToy`: toglie un oggetto lontano; costo 5 V e priorità 1 dalla bozza (la classe ha 10 V) |
| GIG-AR2 | Chiave da tredici | dati: costo 5 V, 10 CUT |
| GIG-AR3 | Colpo di chiave inglese | dati: 6 HIT |
| GIG-AR4 | Sotto il cofano | dati: costo 5 V; due `status` INPUT, HIT ×0,5 e CUT ×0,75, `turns: 0`, come Tra due paraurti |
| **GIG-AR5** | **Lavoro fatto bene** | **Java nuova**: costo 10 V; HIT pari a 6 + 4 per oggetto proprio sul campo |
| GEN-02, 05, 06, 18 | Steal, SeagullFly, Mattone, Spintone | già nella bozza |
| OGG-06, OGG-10 | Espresso, Giubbotto | già nella bozza |
| OGG-09 | Guanti da officina | `equip`: OUTPUT HIT ×1,25, `turns: 2` (per 3 turni, R05) |
| OGG-11 | Casco da lavoro | `equip`: INPUT HIT ×0,8, `turns: 2` |

**Punti chiesti dalla regia:**
- **Capacità 3:** un dato del personaggio. Il motore tiene gli oggetti in una coda circolare della capacità (`Character`): a tavolo pieno
  un oggetto nuovo, pescato o rubato, scaccia il più vecchio.
- **Oggetti sul tavolo:** gli oggetti pescati vanno sul campo (`Player.drawCard`); la presa li consuma (`consume`).
- **Distruzione:** `BreakYourToy` toglie l'oggetto bersaglio. È una carta pagata e scartata; nessuna bound tocca gli oggetti, quindi
  la distruzione non è ripetibile gratis.
- **Tavoli vuoti:** Smontiamo tutto e Steal a tavolo vuoto non fanno nulla; la legalità delle mosse su un oggetto lontano è già provata
  con Steal negli starter di Mara e del Tossico. Lavoro fatto bene a tavolo vuoto vale 6 HIT per 10 V: è il rischio voluto dalla scheda.

**Proposta al proprietario,** nessun commit della parte 2 prima della risposta:
- **A, raccomandata: tutto in SB-15,** come «Tutto in SB-14». Classe `base.gigi.LavoroFattoBene` con `@Tunable base = 6` e
  `perItem = 4`: conta gli oggetti propri sul campo dopo i costi (gli equip sono oggetti già consumati e non contano), poi colpisce;
  prova su stati costruiti a mano con 0, 1 e 3 oggetti e caricamento dalla bozza. Poi bozza e giri.
- **B: dividere** in SB-15a (classe e prova) e SB-15b (bozza e giri).

**Decisione del proprietario,** riportata dalla chat di regia con le sue parole: **«Sì, tutto in SB-15»**. Opzione A.

## Verifiche della parte 1

Eseguite nel checkout, una alla volta, dopo aver controllato che non girassero Maven o Java di questo repository.

- `./scripts/build.ps1 -Task Test -Offline`: **verde**. Maven 643 test, 0 falliti, 7 saltati (le misure a richiesta);
  `SetBaseDraftTest` 16 su 16, con la prova nuova; `MultiSetTest`, `PlaygroundTest`, `ListinoTest` e `BenchTest` verdi; client 37 su 37.
- `python scripts/check-rules.py`: **verde**, «rarità ammesse (COMMON, UNCOMMON, RARE, anche nel caricatore delle bozze)».
- `TestServerContext`: non lanciato. Il blocco tocca solo `server/src/test` e i documenti: contesto Spring, CLI e classi di produzione
  non cambiano.

## Parte 2 — Lo starter di Gigi

### La classe di «Lavoro fatto bene»

[`base/gigi/LavoroFattoBene.java`](../../../server/src/main/java/com/gsc/bm/model/cards/base/gigi/LavoroFattoBene.java), nei sorgenti
di test, ha due parametri `@Tunable`: `base` (6) e `perItem` (4).
- Nella logica speciale, dopo i costi e prima degli effetti (R04), conta gli oggetti dell'autore ancora sul campo, token compresi.
- Poi infligge al bersaglio HIT pari a `base` più `perItem` per oggetto.
- Gli equip non contano: sono oggetti già consumati, diventati stati.
- Costo e priorità vengono dalla bozza. Non tocca caricatore, formato o classi di produzione.

### Bozza e convenzioni

Bozza finale SHA-256 **`c4accca1cb31f7dea70189b584c29cfeaf67750cb96f41917d14a5027f0a2ecf`**, la stessa del giro 2.

**Binding,** come in SB-13 e SB-14:
- le carte di oggi tengono la classe: Smontiamo tutto è `bruiser.BreakYourToy`, con costo 5 V e priorità 1 scritti nella bozza (la classe
  ha 10 V);
- le nuove hanno il prefisso `base.`, compresa la Java nuova (`base.gigi.LavoroFattoBene`); gli oggetti nuovi sono `base.items.…`.

Lo slot apre `gui.description`, e ogni carta nuova ha la rarità della griglia.

| Blocco | Contenuto |
|---|---|
| Personaggio | `base.character.Gigi` «Gigi del Carro Attrezzi»: H 95, A 25, V 25, capacità 3, nessuna immunità; non comune |
| Basic, bound, last resort | GIG-BA +4 V e presa; nello starter GIG-BO1 +5 V e GIG-BO2 3 HIT; nella collezione GIG-BO3 «Lima», 2 CUT a priorità 2; Struggle |
| Archetipo (7) | Smontiamo tutto 2, Chiave da tredici 2, Colpo di chiave inglese 1, Sotto il cofano 1, Lavoro fatto bene 1 |
| Generiche (6) | Mattone 2, Steal 2, SeagullFly 1, Spintone 1 |
| Oggetti (7) | Guanti da officina 2 (equip, HIT inflitto ×1,25 per 3 turni), Giubbotto 2, Casco da lavoro 2 (equip, HIT ricevuto ×0,8 per 3 turni), Espresso 1 |

Lo starter rispetta le regole dei mazzi del regolamento:
- 20 carte regolari, al massimo 2 copie;
- basic propria e fissa, due bound proprie diverse e gratuite, Struggle come last resort;
- 13 carte distinte, 1 rara («Lavoro fatto bene»).

**Nomi.**
- Lo starter tiene il nome della bozza esterna già nella griglia, **«Intervento sul posto»**. L'id resta `starter-gigi`, perché il nome non
  ha un campo nel formato.
- `BreakYourToy` prende il nome di bozza «Smontiamo tutto», come dice la mappa delle carte attuali nella griglia.
- Le altre carte nuove hanno il nome di lavoro della griglia.

## Tetti fissati prima di partire

- **Giri: 3 al massimo** (Q5). Ne ho usati due: il giro 2 sta già nei criteri, e il listino non ha chiesto correzioni (sotto).
- **Calcolo: circa 2 ore.** Usati circa 55 minuti di banco e listino su 8 thread con Java 11, più 3 minuti per la parte 1:
  - due matrici a 2000 partite per cella, cinque mazzi, 480.000 partite ciascuna;
  - 37 varianti a 1000 partite per cella, sulle sole 64 celle di Gigi contro i quattro starter approvati (64.000 partite ciascuna);
  - due listini, di 817.200 e 1.137.600 partite.
- **Lo strumento delle varianti** è una classe di misura temporanea, non committata. Gioca solo le celle di Gigi con `Bench.playCells`, con
  gli stessi semi e stili della matrice; le bozze delle varianti cambiano numeri e costi, non i testi.
- **Delega:** numeri, costi e priorità di Gigi (D38); ridisegni, cambi d'identità o di criterio restano al proprietario. Nessuna carta tolta o
  sostituita: le sostituzioni sotto sono solo diagnosi.

## Gli starter approvati restano identici

**Prova.** Stesso seme e stesse impostazioni della parte 1: 2000 partite per cella, quattro stili, semi 7.000.000–7.001.999, posti alternati.
I mazzi sono nell'ordine Gigi, Pino, Tossico, Spazienzio, Mara, così le celle senza Gigi hanno lo stesso orientamento di SB-14.

In tutti e due i giri **le 160 celle degli incontri fra Spazienzio, Mara, Tossico e Pino coincidono una per una** con la matrice della
parte 1 (`sb-15/sb7-rarita-2000.json`), che a sua volta è identica a quella finale di SB-14. Coincidono anche le loro 10 coppie:
- Spazienzio contro Mara 15.071, 13.615 e 3314, **0,525**;
- Pino contro Spazienzio 0,591, contro Mara 0,559, contro Tossico 0,431.

Nel listino finale le 17 bisezioni e le 36 curve già misurate in SB-14 coincidono una per una; cambia solo l'impronta della bozza derivata.
Le carte degli altri starter non sono toccate.

## Giro 1 — La bozza della griglia

**Bozza.** Lo starter come nella griglia, coi valori della scheda e la salute di SB-9 meno 15 (85) come ipotesi da misurare.
[Matrice](sb-15/sb7-giro1-2000.md) ([dati](sb-15/sb7-giro1-2000.json)), bozza [`bozze/giro1.json`](sb-15/bozze/giro1.json), SHA-256
`381103a13a9d5bc9088d2adf759baac6dbcc700eea32bad7465f60393be74605`. Cinque mazzi (quindici incontri), 2000 partite per cella, 480.000
partite; invarianti a zero.

| Incontro | Quota di Gigi [IC 95%] | Tre stili euristici | Turni medi | Patte |
|---|---|---|---:|---:|
| contro Spazienzio | **0,148** [0,144–0,152] | 0,126 | 12,9 | 10,6% |
| contro Mara | **0,127** [0,123–0,131] | 0,015 | 11,7 | 6,3% |
| contro Tossico | **0,123** [0,120–0,127] | 0,032 | 13,7 | 8,1% |
| contro Pino | **0,126** [0,122–0,130] | 0,001 | 15,3 | 8,0% |
| specchio | 0,503 | 0,502 | 15,8 | 26,6% |

**Lettura: Gigi non ha V.**
- Le carte pagate in V restano morte in mano, in percentuale dei turni in cui le ha: Mattone (15 V) 88%, «Lavoro fatto bene» (10 V) 78%,
  SeagullFly (10 V) 77%, Chiave da tredici (5 V) 46%.
- Con 15 V iniziali e +4 V per presa, Gigi paga una carta da 5 V ogni due turni. La bound +5 V costa un turno senza colpire, come la bound
  di L di Pino.
- Gioca la bound di danno quattro volte a partita, e il mazzo si esaurisce nel 59% delle partite.

## Giro 2 — Salute 95, V iniziale 25, Chiave 12, «Lavoro fatto bene» a 5 V

**Varianti:** ventotto, a 1000 partite per cella ([tabella](sb-15/varianti-diagnostiche.md#giro-1--giro-2-le-leve)).
- **Le leve singole spostano poco,** in media sui quattro incontri:
  - salute 100 circa +15 punti, V iniziale 30 circa +17;
  - basic +6 V circa +5, «Lavoro fatto bene» a 5 V circa +2, Chiave 12 circa +2;
  - Guanti ×1,5, Colpo di chiave 8 e Sotto il cofano gratuito circa +1–2.
- **Combinate si moltiplicano,** come per Pino. Salute 100 e V 30 portano Gigi da 0,13 a 0,48–0,64; con le quattro carte ritoccate a
  0,68–0,78.
- **Contro Tossico e Pino Gigi resta 7–12 punti più in basso** che contro Spazienzio e Mara, con qualunque combinazione. Le partite lunghe
  consumano il suo mazzo, e il veleno del Tossico passa sotto gli equip, che riducono solo HIT e CUT.

**Correzioni:** la variante `d06`.
- **V iniziale 15 → 25,** per il carburante: +10, come la T del Tossico e la L di Pino.
- **Salute 85 → 95,** verso il 100 della scheda.
- **Chiave da tredici 10 → 12 CUT:** la linea della fascia F1 a 5 V (circa 12–13), come Cinghiata di Mara.
- **«Lavoro fatto bene» da 10 a 5 V.** A 10 V (F2, circa 18–20) i 6 + 4 per oggetto stavano sotto la linea con meno di tre oggetti, e la
  carta restava morta in mano. A 5 V vale 14–18 con due o tre oggetti: «picco condizionato, media in linea» (D34, punto 6).

La `d06` era la variante più equilibrata con la salute sotto la scheda: 0,583, 0,546, 0,465 e 0,479. Le alternative:
- la `d05` (salute 100, V 25, Lavoro a 5 V) stava sopra 0,60 contro Spazienzio;
- la `d08` (salute 90, V 30, Lavoro a 5 V) era più centrata (0,564, 0,502, 0,468, 0,443), ma con +15 V invece di +10 e senza la Chiave
  sulla linea.

**Misure.** [Matrice](sb-15/sb7-giro2-2000.md) ([dati](sb-15/sb7-giro2-2000.json), [tempi](sb-15/sb7-giro2-2000.tempi.txt)) di
`server/src/test/resources/set-base/bozza.json`, SHA-256 **`c4accca1…f0a2ecf`**, uguale alla `d06` salvo i testi; bozza
[`bozze/giro2.json`](sb-15/bozze/giro2.json). 2000 partite per cella, quattro stili, semi 7.000.000–7.001.999, posti alternati.

| Incontro | Quota di Gigi [IC 95%] | Turni medi | Mediana (10°–90°) | Patte |
|---|---|---:|---|---:|
| **contro Spazienzio** | **0,589 [0,583–0,595]** | 12,6 | 12 (9–17) | 13,1% |
| **contro Mara** | **0,539 [0,533–0,545]** | 12,3 | 12 (9–16) | 12,9% |
| **contro Tossico** | **0,470 [0,464–0,476]** | 13,9 | 14 (10–17) | 15,9% |
| **contro Pino** | **0,482 [0,476–0,488]** | 15,1 | 15 (13–17) | 28,1% |
| specchio | 0,503 [0,497–0,510] | 13,9 | 14 (12–16) | 25,1% |
| Spazienzio contro Mara (controllo) | 0,525 [0,520–0,531] | 11,3 | 11 (7–16) | 10,4% |

**Invarianti:** zero violazioni su 480.000 partite e 12.989.642 turni di giocatore.
- Mai senza mosse, mai il limite dei 200 turni.
- Quindici bound su quindici entro il tetto di D33 e D36 contro il manichino: GIG-BO1 3,75 unità, GIG-BO2 4 col danno pesato 4/3,
  GIG-BO3 2,67.

### Controllo dei bot, prima di toccare carte (punto 7)

Nove varianti sulla bozza del giro 2 ([tabella](sb-15/varianti-diagnostiche.md#controllo-dei-bot-punto-7-e-leve-sul-giro-2)):

| Carta | Prova | Gigi contro Spazienzio / Mara / Tossico / Pino |
|---|---|---|
| Steal (GEN-02) | ×2 sostituita da Spintone e Colpo di chiave | **+10,8 / +12,1 / +11,9 / +15,2 punti** |
| Smontiamo tutto (GIG-AR1) | ×2 sostituita da Colpo di chiave e Sotto il cofano | +3,9 / +3,7 / +2,7 / +4,3 |
| «Lavoro fatto bene» | di nuovo a 10 V | −7,2 / −7,9 / −8,1 / −8,7 |
| Capacità | 2 invece di 3 | −3,5 / −3,4 / −3,4 / −4,8 |
| Guanti | ×1,5 invece di ×1,25 | +1,4 / +1,4 / +1,7 / +2,8 |

**Lettura.**
- **Furto e distruzione valgono meno di un colpo semplice in mano ai bot,** come le parate e le contromosse dei base (SB-12a), del Tossico
  (SB-13) e di Pino (SB-14).
  - Steal resta ferma in mano per il 71% dei turni e, quando è giocata, Gigi vince lo 0,145; Smontiamo tutto 48% e 0,123.
  - I bot non scelgono l'oggetto giusto né il momento: rubano e distruggono quello che c'è.
  - **Nessuna carta è indebolita o tolta.**
- La capacità 3 vale circa 4 punti: è l'identità di Gigi, misurata.
- Gli equip contano poco coi bot: i Guanti a ×1,5 danno 1–3 punti.

## Il listino sul giro 2

`ListinoMeasureTest`, `-Dsim.listinoBase=<bozza> -Dsim.listinoAnchor=7`, gruppi `costo`, `salute` e `tettoavanzati`, tre stili euristici;
817.200 partite. [Testo](sb-15/sb15-listino-giro2-costo+salute+tettoavanzati.md),
[dati](sb-15/sb15-listino-giro2-costo+salute+tettoavanzati.json). La bozza del giro 2 è quella finale, quindi i numeri di Gigi coincidono
con quelli del listino finale (sotto).

Il contesto di Gigi è il suo starter con le àncore al posto di Mattone e Steal, le sole generiche in due copie: restano oggetti, equip e
carte d'archetipo pagate in V.

- **Prezzo della V:** 5 V valgono 14,5 HIT [14,5–14,6] contro l'àncora a 7, cioè 1,50 danni per V; 10 V valgono 24,6 [24,5–24,7], cioè 1,76.
- **Chiave a 12 CUT** sta 2,5 sotto la linea di 5 V. «Lavoro fatto bene» a 5 V fa 14 con due oggetti e 18 con tre: in linea, in media.
  Nessuna delle due chiede un altro giro.
- **Bound:** tutte sotto 4 HEALTH equivalenti per uso (sotto).

Il giro 2 rispetta tutti i criteri e il listino non chiede correzioni: il terzo giro non serve.

## Listino sulla bozza finale

Stessi gruppi di SB-14 (`costo`, `tipo`, `salute`, `veleno`, `tettostarter`, `tettoavanzati`), base derivata SHA-256 `51eb12d9…170bad`,
1.137.600 partite. [Testo](sb-15/sb15-listino-costo+tipo+salute+veleno+tettostarter+tettoavanzati.md),
[dati](sb-15/sb15-listino-costo+tipo+salute+veleno+tettostarter+tettoavanzati.json).

| Voce | Contesto | Valore misurato [IC 95%] | Riferimento |
|---|---|---|---|
| **5 V** | Gigi | **14,5 HIT [14,5–14,6], 1,50 per V** | Chiave 12 CUT: 2,5 sotto; Lavoro 14–18 con due o tre oggetti |
| **10 V** | Gigi | **24,6 HIT [24,5–24,7], 1,76 per V** | Spazienzio: 17,9 per 10 V. Per Gigi SeagullFly (18) e Mattone (24 per 15 V) stanno sotto |
| Salute iniziale | Gigi | **4,69 punti per HEALTH** | Spazienzio 2,01, Mara 3,36, Tossico 1,97, Pino 3,83 |
| V, A, T, L, CUT, POISON, T al bersaglio | altri contesti | identici a SB-14 | — |

**Bound, salute equivalente per uso** (D38, al massimo 4; il criterio di D33, +10 punti, è riportato per confronto):

| Bound | Quota (più una nulla) contro due nulle [IC 95%] | Giocate a partita | +10 punti | Salute equivalente per uso | ≤ 4 |
|---|---|---:|---|---|---|
| **GIG-BO1 +5 V** | 0,960 [0,954–0,965] | 3,05 | ✗ | **3,0** (al massimo 3,3) | ✓ |
| GIG-BO2 3 HIT | 0,936 [0,929–0,943] | 4,67 | ✗ | 1,8 (al massimo 2,1) | ✓ |
| GIG-BO3 2 CUT | 0,854 [0,844–0,865] | 4,66 | ✗ | 1,4 (al massimo 2,1) | ✓ |
| sonda 3 HIT | 0,936 [0,929–0,943] | 4,67 | ✗ | 1,8 | ✓ |
| sonda 2 HIT | 0,840 [0,829–0,851] | 4,57 | ✗ | 1,4 | ✓ |

**Come si legge.**
- Nel contesto di Gigi la curva della salute satura: +5 HEALTH vale 0,780, +10 già 0,996. Il rapporto del listino scrive «saturato» e non
  converte.
- Qui la salute equivalente è interpolata fra i punti misurati (+5 e +10), poi divisa per le giocate a partita.
- Il limite superiore non dipende dall'interpolazione. Ogni bound vale meno di +10 HEALTH a partita (quota sotto 0,996), quindi al massimo
  10 diviso le giocate a partita.

**Lettura:**
- **Tutte e tre le bound stanno sotto 4.** Superano il criterio dei +10 punti, come quelle di Mara, del Tossico e di Pino. Nel contesto di
  Gigi la salute vale moltissimo (4,7 punti per HEALTH, la pendenza più ripida dei cinque), e un colpetto ripetuto quattro volte decide.
- **La bound di V è la più vicina al tetto:** 3,0, al massimo 3,3. La V di Gigi è cara (1,5–1,8 danni per V), e i +5 V pesati 0,75
  sottostimano il suo valore, come il peso della T fa per il Tossico.

**Cosa misura e cosa no:**
- Misura il prezzo di 5 e 10 V contro un'àncora gratuita nel contesto di Gigi coi bot di oggi, e il valore delle bound a parità del resto.
- Non misura:
  - «Lavoro fatto bene», che fa una quantità variabile;
  - Smontiamo tutto e Steal, che hanno un oggetto per bersaglio;
  - gli equip, il cui valore dipende dalla durata e dai colpi che seguono.

  Nessuna di queste si prezza con una bisezione di costo.
- Non misura il tavolo vuoto in sé: lo approssima la variante a capacità 2 (−4 punti).

## Stato finale contro i criteri

Bozza finale, SHA-256 `c4accca1…f0a2ecf`:

| Criterio (SB-13–SB-15) | Obiettivo | Esito | |
|---|---|---|---|
| Matchup contro Spazienzio | 40–60% | 0,589 [0,583–0,595]; 0,649 coi soli euristici; stessi stili 0,26–0,85 | ✓ al margine alto, con la dispersione dichiarata |
| Matchup contro Mara | 40–60% | 0,539 [0,533–0,545]; 0,541 coi soli euristici; stessi stili 0,44–0,65 | ✓ |
| Matchup contro Tossico | 40–60% | 0,470 [0,464–0,476]; 0,503 coi soli euristici; stessi stili 0,33–0,72 | ✓ |
| Matchup contro Pino | 40–60% | 0,482 [0,476–0,488]; 0,444 coi soli euristici; stessi stili 0,11–0,79 | ✓, con la dispersione dichiarata |
| Specchio | — | 0,503 | ✓ |
| Carte d'archetipo giocate | davvero giocate | Chiave 92%, Colpo di chiave 85%, Lavoro 75%, Sotto il cofano 32%; Smontiamo tutto 16% (bot) | ✓ coi limiti dei bot |
| Durata | confrontata coi base (11,3), Tossico (12,8), Pino (14,2–15,1) | 12,3–15,1 contro gli altri; specchio 13,9 | in linea con gli avanzati |
| Patte | confrontate coi base (10,4%), Tossico (10,8%), Pino (14–18%) | 13–16% contro base e Tossico, **28% contro Pino**; specchio 25% | da giudicare |
| Mazzi esauriti | confrontati | **Gigi 68,4%**; Pino 77,7%, Tossico 49,3%, base 15,9% e 21,7% | da giudicare |
| Turni senza mosse | zero | zero su 480.000 partite | ✓ |
| Bound entro D33 e D36 | tetto del banco | quindici su quindici | ✓ |
| Bound, salute equivalente per uso | al massimo 4 | 3,0 / 1,8 / 1,4 (al massimo 3,3 / 2,1 / 2,1) | ✓ |
| Prezzo della V | in linea per le comuni | Chiave 12 contro 14,5: un poco sotto | ✓ |
| Starter approvati invariati | identici | 160 celle su 160 | ✓ |

**Dispersione fra gli stili.** Quota di Gigi, con lo stile di Gigi prima:

| Lettura | Contro Spazienzio | Contro Mara | Contro Tossico | Contro Pino |
|---|---|---|---|---|
| Quattro stili, 16 coppie (il criterio) | **0,589** | **0,539** | **0,470** | **0,482** |
| Tre stili euristici, 9 coppie | 0,649 | 0,541 | 0,503 | 0,444 |
| Stessi stili sui due lati: aggressivo · prudente · risorse · `com` | 0,845 · 0,805 · 0,264 · 0,403 | 0,648 · 0,626 · 0,442 · 0,599 | 0,719 · 0,458 · 0,331 · 0,422 | 0,794 · 0,108 · 0,449 · 0,507 |
| Gigi col `com`, contro tutti gli stili | 0,255 | 0,186 | 0,147 | 0,119 |

Per stile, su tutte le sue partite, Gigi vince 0,852 con l'aggressivo, 0,496 col prudente, 0,599 con risorse e **0,159 con `com`**.
- La dispersione è larga come quella di Pino: l'aggressivo gioca Gigi molto bene, perché paga subito le carte da 5 V; `com` lo gioca molto
  male.
- Il criterio sulla media dei quattro stili tiene insieme i due estremi.

**Durata per stile**, stesso stile sui due lati:

| Incontro | aggressivo | prudente | risorse | `com` |
|---|---:|---:|---:|---:|
| contro Spazienzio | 10,0 | 15,2 | 10,4 | 15,5 |
| contro Mara | 9,8 | 14,4 | 11,3 | 16,8 |
| contro Tossico | 11,8 | 15,9 | 14,3 | 15,4 |
| contro Pino | 12,7 | 15,6 | 15,3 | 19,3 |
| specchio | 11,6 | 15,0 | 14,1 | 17,8 |

**Mazzi esauriti e last resort**, su tutte le partite di ciascun mazzo:
- Gigi 68,4% e 58,5%: gioca la bound di danno 3,6 volte a partita, e ogni bound scarta una carta.
- Pino 77,7% e 70,6%; Tossico 49,3% e 41,5%; Spazienzio 15,9% e 10,2%; Mara 21,7% e 14,9%.

**Risorse a fine partita:** a Gigi restano 2,9 V se vince e 12,4 se perde. Quando perde ha V non spesa, cioè carte da 10 e 15 V ferme in
mano.

**Carte di Gigi**, su tutti gli stili:

| | Carte |
|---|---|
| Più giocate | GIG-BO2 3 HIT (3,60 a partita, nel 97% delle partite), la basic (1,98), Chiave da tredici (1,61, 92,5%), GIG-BO1 +5 V (1,07), Struggle (0,88) |
| Quota se giocata più alta | Struggle 0,663, «Lavoro fatto bene» 0,602, Spintone 0,581, Colpo di chiave 0,580, SeagullFly 0,569 |
| Giocate in svantaggio | Smontiamo tutto (quota se giocata 0,123), Steal (0,145), Sotto il cofano (0,314) |
| Morte in mano a lungo, in percentuale dei turni in mano | Mattone 78%, SeagullFly 70%, Smontiamo tutto 49%, «Lavoro fatto bene» 38%, Sotto il cofano 35%, Chiave 33% |

**Carte d'archetipo davvero giocate:**
- Chiave da tredici nel 92% delle partite, Colpo di chiave nell'85%, «Lavoro fatto bene», rara a una copia, nel 75%.
- Sotto il cofano, una copia, nel 32%.
- Smontiamo tutto nel 16%: è il limite dei bot del controllo sopra, e contro Spazienzio (capacità 1) c'è poco da smontare.

**Rischi del piano per Gigi:**
- **Tavoli vuoti.**
  - La capacità 3 vale circa 4 punti.
  - «Lavoro fatto bene» a tavolo vuoto fa 6 HIT per 5 V, sotto la linea: è il rischio voluto dalla scheda.
  - I bot consumano gli oggetti appena possono (la basic due volte a partita), quindi coi bot il tavolo pieno, che serve a «Lavoro fatto
    bene», dura poco.
- **Distruzione ripetibile:** non c'è.
  - Smontiamo tutto è pagata (5 V) e scartata, giocata 0,19 volte a partita, e nessuna bound tocca gli oggetti.
  - Nessun avversario approvato ha carte di distruzione: il rischio si sposta sui mazzi costruiti (SB-19–SB-22).
- **La V di Gigi** (sopra): il motivo dei due ritocchi di carte, e delle generiche care che restano morte in mano.

**Partite e patte contro Pino:** 15,1 turni con il 28% di patte. Due mazzi che si esauriscono (68% e 78%) finiscono a colpi di last resort.
Lo specchio di Gigi è più corto di quelli del Tossico e di Pino: 13,9 turni e 25% di patte, contro 16,6 e 16,1 turni.

## Codice e bozza della parte 2

Tutto in `server/src/test`.

| File | Cosa cambia |
|---|---|
| `java/com/gsc/bm/model/cards/base/gigi/LavoroFattoBene.java` (nuovo) | La classe di D35: `@Tunable base` e `perItem`; conta gli oggetti propri sul campo dopo i costi, poi colpisce |
| `resources/set-base/bozza.json` | Personaggio, undici carte nuove e lo starter `starter-gigi`. Le carte: basic, tre bound, quattro d'archetipo, `BreakYourToy` col costo della bozza, due oggetti. Mattone, Steal, SeagullFly, Spintone, Giubbotto ed Espresso c'erano già. SHA-256 da `d645a97f…626a68eb` (parte 1) a `c4accca1…f0a2ecf`. Le carte degli altri starter non cambiano |
| `java/.../sim/SetBaseDraftTest.java` | Quattro prove nuove; otto esistenti adeguate alla bozza che cresce (sotto) |
| `java/.../sim/Listino.java` | Contesto di Gigi nella base del Set Base, solo se la bozza ha il suo starter, con le àncore al posto di Mattone e Steal; `starter-gigi` in `ADVANCED_STARTERS`; prezzo di 5 e 10 V e curve di salute di Gigi, solo con quel contesto |

**Senza lo starter di Gigi** il listino è quello di prima: una prova controlla che non nascano né il contesto, né le bisezioni, né le curve
di Gigi. Nel listino finale, poi, le misure già fatte in SB-14 coincidono una per una.

**Prove nuove** in `SetBaseDraftTest`:
1. `theGigiStarterFollowsTheGrid`:
   - risorse, capacità 3, nessuna immunità, nome; basic, bound e Struggle;
   - la composizione esatta: archetipo 7, generiche 6, oggetti 7;
   - i costi in V coi testi; Smontiamo tutto col bersaglio oggetto lontano e priorità 1;
   - i numeri del giro 2 coi testi: Chiave 12 CUT, Lavoro 6 + 4 per oggetto a 5 V;
   - le bound +5 V, 3 HIT e 2 CUT, nessuna sugli oggetti; Guanti e Casco come equip;
   - lo slot all'inizio della descrizione delle nove carte di Gigi.
2. `theGigiMechanicsWorkOnHandBuiltStates`, su una partita vera coi tavoli svuotati:
   - «Lavoro fatto bene» con **0, 1 e 3 oggetti** (6, 10 e 18 HIT);
   - la capacità 3: il quarto oggetto scaccia il più vecchio;
   - gli equip non contano come oggetti, e i Guanti moltiplicano l'HIT inflitto dalla carta;
   - Smontiamo tutto che a tavolo vuoto non fa nulla e con un oggetto lontano lo distrugge;
   - Sotto il cofano (HIT ×0,5, CUT ×0,75) e il Casco (HIT ×0,8).
3. `lavoroFattoBeneLoadsFromTheDraftWithItsParameters`: nome, costo 5 V e priorità 1 dalla bozza; la bozza senza `base` o senza `perItem`
   si rifiuta con «parametro mancante», con un parametro in più con «parametro sconosciuto».
4. `theListinoBaseHasTheGigiContextAndItsBoundCurves`:
   - il contesto con le àncore, e oggetti e archetipo intatti; lo starter intatto;
   - cinque curve `tettoavanzati` e i due prezzi della V; ogni bozza derivata valida;
   - senza lo starter di Gigi, niente contesto né misure.

**Prove esistenti adeguate, nessuna indebolita.** I controlli sono più larghi, non più deboli:

| Prova | Prima | Ora |
|---|---|---|
| `theDraftLoadsWithTheTwoStartersAndAllTheirCards` | personaggi e mazzi esattamente {Spazienzio, Mara, Tossico, Pino} | esattamente i cinque, con Gigi; la terza bound di Gigi (Lima) fuori dallo starter |
| `theStartersRespectTheFormat` | quattro starter | cinque, stessi controlli |
| `theDraftPassesTheBenchInvariantsStrictly` | 12 bound, 10 coppie di mazzi | 15 bound, 15 coppie, stessi invarianti stretti |
| `everyPairOfStylesFinishesItsGames` | 10 coppie | 15 coppie |
| `durationsFollowTheR05Reading` | 8 stati | 12: Sotto il cofano («in questo turno», due stati), Guanti e Casco («per 3 turni», `turns: 2`) |
| `theStartersCarryTheSb12aCorrections` | Tossico e Pino esclusi | anche Gigi escluso, perché ha le sue prove; la mappa dei due base resta esatta |
| `theListinoBaseHasThePinoContextAndItsBoundCurves` | dieci curve `tettoavanzati` in tutto | quindici, con Gigi; le cinque di Pino restano contate sul suo starter |
| `everyCardAndCharacterHasTheGridRarity` (parte 1) | 60 carte, 4 personaggi | 71 carte e 5 personaggi: gli undici slot nuovi di Gigi nell'elenco della griglia |

Gli altri controlli restano com'erano. Nessun atteso è stato cambiato per tornare al verde: ogni numero nuovo viene dal contenuto aggiunto
alla bozza.

**Le prove nuove sanno fallire.** Con la bozza del giro 1 al posto di quella finale tre prove di Gigi falliscono:
- `theGigiStarterFollowsTheGrid`: salute 85 e V 15 invece di 95 e 25;
- `lavoroFattoBeneLoadsFromTheDraftWithItsParameters`: costo 10 V invece di 5;
- `theGigiMechanicsWorkOnHandBuiltStates`: la salute di Gigi dopo Sotto il cofano.

Poi ho rimesso la bozza finale e ricontrollato lo SHA-256. Dove una prova riguarda una meccanica legge i numeri dalla bozza; dove riguarda
una correzione dei giri li fissa.

## Documenti di progetto

- **[Griglia](../../design/set-base/griglia.md).**
  - PG-GIG (H e V), GIG-AR2 e GIG-AR5 col valore vecchio barrato e la nota ⁷; la curva dei costi dello starter di Gigi (F1 8, F2 1);
  - il nome dello starter con (SB-15) e una «Nota di SB-15» sotto gli starter;
  - la sezione [Correzioni di SB-15](../../design/set-base/griglia.md#correzioni-di-sb-15), con giro e motivo, e due letture: la V di
    Gigi è cara; furto e distruzione coi bot.
- **[Scheda di Gigi](../../design/set-base/schede-personaggi.md#5-gigi-del-carro-attrezzi--avanzato).** Nota di SB-15 sui valori iniziali
  (HEALTH 95, V 25) e tabella dei valori iniziali aggiornata.
- [Piano](../../set-base-plan.md) e [indice](../../README.md): stato di SB-15.
- Evidenze in [`sb-15/`](sb-15/): le matrici della parte 1 e dei due giri, le bozze dei giri, le [varianti](sb-15/varianti-diagnostiche.md)
  e i due listini.

## Cosa non è provato

- **I bot.** Ogni numero dice come giocano questi bot.
  - **Furto e distruzione:** i bot rubano e distruggono senza scegliere, e Steal e Smontiamo tutto valgono meno di uno Spintone. Un umano
    che toglie il Kebab a Mara o il Mescolone al Tossico al momento giusto userebbe Gigi meglio, quindi Gigi potrebbe essere **più forte** di
    quanto misurato. Se la prova umana lo trova forte, la prima leva è la V iniziale, poi la salute.
  - **Gli oggetti sul tavolo:** i bot consumano subito, e «Lavoro fatto bene» a tavolo pieno si vede poco. Un umano che aspetta di avere tre
    oggetti la gioca meglio.
  - **`com` gioca Gigi male** (0,16) e l'aggressivo molto bene (0,85): la media dei quattro stili tiene insieme due estremi.
- **«Lavoro fatto bene» coi bot.** I bot leggono «HIT 6+x» come 6 più la stima fissa del «+x», non come 6 più 4 per oggetto.
- **Il tavolo vuoto** non è misurato da sé: la variante a capacità 2 è l'approssimazione più vicina.
- **La distruzione ripetibile contro Gigi.** Nessuno starter approvato distrugge oggetti o toglie equip: BadEducation è nella collezione. Il
  rischio della scheda, «chi rimuove gli equip gli cancella il lavoro di più turni», va guardato coi mazzi costruiti.
- **Il divertimento.** Nessuna partita umana: il simulatore non dice se «monta gli attrezzi, poi colpisci» si capisce e diverte.
- **`TestServerContext` non lanciato:** il blocco tocca solo `server/src/test` e i documenti; contesto Spring, CLI e classi di produzione
  non cambiano per opera di questo blocco.

## Verifiche della parte 2

Eseguite nel checkout, una alla volta, dopo aver controllato che non girassero Maven, Java o verifiche del client di questo repository.

- `./scripts/build.ps1 -Task Test -Offline`: **verde**. Maven 647 test, 0 falliti, 7 saltati (le misure a richiesta);
  `SetBaseDraftTest` 20 su 20, con le quattro prove nuove; `ListinoTest`, `BenchTest`, `MultiSetTest` e `PlaygroundTest` verdi; client 37 su 37.
- `python scripts/check-rules.py`: **verde**, come nella parte 1.
- `python docs/reports/set-base/sb-6b/rarita-bozza.py --check`: «rarità come la griglia», con le carte di Gigi.
- `TestServerContext`: non lanciato, per il motivo detto sopra.

## Cosa deve giudicare il proprietario

Le correzioni dei giri le ho prese con la delega di D38 (numeri, costi e priorità di Gigi).

1. **Salute 95, V iniziale 25, Chiave da tredici 12 CUT, «Lavoro fatto bene» a 5 V.** Gigi passa da 0,15, 0,13, 0,12 e 0,13 a 0,589,
   0,539, 0,470 e 0,482, con tutte le bound sotto 4 HEALTH equivalenti per uso e le due carte sulla linea della fascia F1.
   *Raccomando di approvarle.* Contro Spazienzio Gigi è al margine alto (0,583–0,595; 0,649 coi soli euristici): se la prova umana lo trova
   forte, la prima leva è la V iniziale, poi la salute.
2. **Due giri invece di tre.** Il giro 2 sta nei criteri e il listino non chiede correzioni. *Raccomando di fermarsi qui:* un terzo giro
   coi soli numeri sposterebbe l'equilibrio fra Spazienzio e Tossico o Pino, non la sostanza.
3. **Il nome dello starter, «Intervento sul posto»**, quello della bozza esterna già nella griglia. *Raccomando di tenerlo.*
4. **Mazzo esaurito nel 68% delle partite e partite contro Pino con il 28% di patte.** Gigi gioca la bound di danno tre o quattro volte a
   partita, come Pino. *Raccomando di tenerli fino alla prova umana degli avanzati (SB-16),* come per Tossico e Pino (D43, D44).
5. **Steal e Smontiamo tutto valgono coi bot meno di uno Spintone.** *Raccomando di tenerli per la prova umana,* come le contromosse in
   SB-12a, SB-13 e SB-14: sono la contromossa del triangolo di Gigi.
6. **Mattone e SeagullFly morti in mano per il 70–78% dei turni.** Sono generiche condivise con Spazienzio e non si toccano coi numeri; la
   V di Gigi vale 1,5–1,8 danni per V.
   *Raccomando di guardarle alla prova umana.* Se restano morte, la leva è la composizione dello starter, per esempio una Chiave o un Colpo
   di chiave al posto di un Mattone: è un cambio della griglia e lo decide il proprietario.

## Cosa serve a SB-16 (prova umana degli avanzati)

1. SB-8 con la bozza di questo blocco: i cinque starter, e la classe `base.gigi.LavoroFattoBene` accanto a quelle di Pino.
2. Gigi giocato da un umano: aspettare tre oggetti prima di «Lavoro fatto bene», rubare e smontare al momento giusto. È il gioco che i bot
   non fanno: se un umano lo fa bene, Gigi sale, e Steal, Smontiamo tutto e la V iniziale vanno guardati per primi.
3. Gigi contro Pino (durata e patte) e lo specchio di Gigi.
4. Leggibilità: gli equip per 3 turni, la coda degli oggetti che scaccia il più vecchio, «Lavoro fatto bene» che conta il tavolo. Annotare
   per SB-31.

## Cosa serve a SB-8

- La bozza è `sb-6b/1` con le rarità: SB-8 può mostrarle o ignorarle, perché nessun codice le legge.
- Le carte Java della bozza sono nei sorgenti di test: `base.pino.GoingBerserk`, `base.pino.UltimoGiro`, `base.gigi.LavoroFattoBene`.
  Servono nel jar del profilo di sviluppo, come dice SB-6b.
- `BreakYourToy` usa il costo della bozza (5 V), non quello del catalogo (10 V): il caricatore lo fa già per costo e priorità.
- Le undici carte nuove di Gigi non hanno immagine, come quelle degli altri starter.
