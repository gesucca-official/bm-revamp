# SB-15 — Gigi del Carro Attrezzi: rarità nella bozza, bozza dello starter e giro coi bot: rapporto

**Parte 1 fatta l'8 novembre 2026.** La bozza del Set Base è nel formato `sb-6b/1` e ogni carta e personaggio ha la rarità della
[griglia](../../design/set-base/griglia.md), come ha deciso il proprietario con D44, punto 6. Le partite non cambiano: la matrice dei
quattro starter approvati coincide con quella finale di SB-14 cella per cella.

**Parte 2 ferma al passo 0, in attesa del proprietario.** Lo starter di Gigi chiede una classe Java nuova per una sola carta, la rara
«Lavoro fatto bene» (GIG-AR5), come la griglia aveva già previsto. Il resto si scrive coi passi dati di oggi o con classi Java esistenti.

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

## Verifiche della parte 1

Eseguite nel checkout, una alla volta, dopo aver controllato che non girassero Maven o Java di questo repository.

- `./scripts/build.ps1 -Task Test -Offline`: **verde**. Maven 643 test, 0 falliti, 7 saltati (le misure a richiesta);
  `SetBaseDraftTest` 16 su 16, con la prova nuova; `MultiSetTest`, `PlaygroundTest`, `ListinoTest` e `BenchTest` verdi; client 37 su 37.
- `python scripts/check-rules.py`: **verde**, «rarità ammesse (COMMON, UNCOMMON, RARE, anche nel caricatore delle bozze)».
- `TestServerContext`: non lanciato. Il blocco tocca solo `server/src/test` e i documenti: contesto Spring, CLI e classi di produzione
  non cambiano.
