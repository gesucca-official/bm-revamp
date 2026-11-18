# SB-19 — Fase B2a: timer nella vista dei bot e pesche escluse nella fedeltà

**18 novembre 2026. Fase B2a di [D133](../../set-base-decisioni.md#decisioni-del-proprietario). Fatto e tutto verde: la patch della B2 è assorbita (due oggetti, dieci mazzi, braccio «malus»), la griglia è a 123 carte, `ViewTable` modella i timer, la fedeltà esclude e dichiara le pesche. STOP finale per la revisione; la B2 può ripartire dal passo 2 (mutazioni sul motore, giro, ricerca «dopo», client, prova).**

## Stato (ripartenza)

- **Commit:** `dfa8fc0` (patch, griglia, bozza di riferimento, attesi per D130) e il commit dei bot e della fedeltà (sotto). Niente push.
- **Verde:** passo 0 identico, identità viva identica, «Rif» identico, `TurnForecastFidelityTest` e `ViewTableFidelityTest` al 100% su tutti i bracci, suite completa, contesto Spring e manifest.
- **Non fatto (resta alla B2, D133 (2)):** giro M1/M2, isolamenti, ricerca «dopo», client (pillola del malus), jar, prova del proprietario. Qui nessuna misura oltre ai cancelli.

## 1. Patch e griglia (passi 1–2)

`git apply` di [b2-bozza-e-fedelta.patch](sb-19/b2/b2-bozza-e-fedelta.patch) senza conflitti: i due oggetti (OGG-17, OGG-18), i dieci mazzi, il braccio «malus» delle due prove di fedeltà.

- **Griglia** ([griglia.md](../../design/set-base/griglia.md)): righe OGG-17 (NC) e OGG-18 (R), titolo «Oggetti (18)», nota ¹¹, tabelle di controllo a **123 carte, 44 C / 59 NC / 20 R** (oggetti 8/6/4, ruoli RESOURCES 34, 116 carte giocabili).
- `rarita-bozza.py --check`: «rarità come la griglia». `genera-bozza-di-riferimento.py --scrivi` poi `--verifica`: allineato (116 carte, 21 mazzi di prova).
- **Attesi cambiati solo per D130**, uno per uno:

| Atteso | Prima → dopo | Perché |
|---|---|---|
| `SetBaseDraftTest.theDraftLoadsWithTheTwoStartersAndAllTheirCards`, insieme dei mazzi | + i dieci della B2 (`Sb19.DECKS_B2`) | mazzi nuovi della patch |
| `theDraftPassesTheBenchInvariantsStrictly`, partite | 136 → 351 coppie × 9 × 12 | 26 mazzi invece di 16 |
| `everyPairOfStylesFinishesItsGames`, partite | 136 → 351 coppie × stili² × 2 | idem |
| `everyCardAndCharacterHasTheGridRarity`, elenchi della griglia | + OGG-17 in NC, + OGG-18 in R | slot nuovi |
| stesso test, conteggi per rarità | C 42, NC 55 → 56, R 17 → 18 (116 carte) | due carte |
| `Bozza16Test.the16ChangesExactlyWhatD97Approved` | atteso invariato; `Sb19.without` toglie anche i due oggetti e i dieci mazzi | la 1.6b resta quella approvata, come nella B1 |

Nessuna soglia cambiata.

## 2. Timer in `ViewTable` (passo 3)

Passo 0 d'identità **prima** di toccare `ViewTable`: base e codice nuovo sulla bozza di 6630ebf (`step0.ps1`, 8.640 partite): tutti i file **identici byte per byte**, salvo `seconds.txt`.

Il motore ha i timer come `Timer` con una funzione Java; la vista pubblica ne mostra solo nome e turni restanti. Perché la tavola li giochi «come il motore» il testo delle carte deve dire cosa fanno:

| Dove | Cosa |
|---|---|
| `PrintedEffects` | Lista **separata** `timers` (come `inPlay`), vuota per ogni carta di oggi; costruttori vecchi invariati; `TimerText`: nome, turni, immunità date, immunità tolte, «azzera tutto», veleno. |
| `ToxicBloodDrain`, `MarvelousCocktail`, `SantinoDellaPortinaia` | `printedEffects()` dichiara il proprio timer (nome e durata letti dai campi; il timer del motore non cambia). Il primo e il secondo sono carte vive: solo dato, nessun bot vivo lo legge. |
| `ViewTable` | I timer della vista scorrono a ogni fine turno, **dopo** gli effetti periodici e **prima** degli stati, nell'ordine d'inizio; a zero scattano e spariscono: dànno o tolgono immunità, «azzera» immunità e stati, poi veleno. Una carta giocata e non annullata, o un oggetto consumato, avvia i suoi timer sull'autore, e il turno in cui è giocata conta. Un timer che il catalogo non conosce scorre e basta. La copia non condivide la lista. |

`TurnForecast` **non cambia**: prevede un solo turno e i timer che scattano fuori dal turno corrente non toccano la salute di quel turno; il suo test di fedeltà lascia fuori, come prima, i turni che cominciano con un timer. `BadTrip` non ha testo stampato e non è in bozza: non modellato.

La vista usa `ViewTable` solo in `DifficilePolicy`, e solo con `d50`: la partita viva non lo raggiunge.

## 3. Fedeltà (passo 4)

`ViewTableFidelityTest`, [dati](sb-19/b2a/evidence/fidelity-b2a.json). Finestre di due turni, contate per posto.

**Esclusione per pesca, dichiarata e contata per causa.** Nel secondo turno di una finestra si escludono solo: (a) un oggetto con effetto «In campo» che una pesca del turno mette su un campo (**532** finestre), (b) uno che era sul campo a inizio turno ed è sparito mentre una pesca riempiva un campo ormai pieno (**36**). La pesca si legge dal mazzo vero (identità delle carte, per riflessione, solo nel test). Ogni altro cambio del campo resta confrontato. Nei bracci senza oggetti col malus l'esclusione è vuota, e il test lo asserisce.

**Timer.** Con la tavola che li gioca, i turni che cominciano con un timer entrano nel confronto (prima erano saltati: 72, 73, 62, 138, 24, 91). Solo l'equivalenza col previsore di un turno (`TurnForecast`) li salta ancora. Dichiarato: è un'esclusione tolta, non aggiunta.

| Braccio | Prima (finestre confrontate, salute) | Dopo | Esclusione per pesca |
|---|---:|---:|---:|
| A | 3.026 | 3.156 | 0 |
| B | 3.032 | 3.162 | 0 |
| 1.6 | 2.966 | 3.070 | 0 |
| sergio | 3.952 | 4.230 | 0 |
| duccio | 4.108 | 4.142 | 0 |
| **malus** | 5.018/5.024 (rosso) | **4.592/4.592** | 532 + 36 |

Primo turno e risorse: 100% su ogni braccio (malus 8.342/8.342, risorse 4.592/4.592). Bracci vecchi con finestre **uguali o più** e tutti al 100%. Nel «malus»: minimo di finestre confrontate **4.000** (4.592), contatori della B2 con le loro soglie: turni con un oggetto col malus 687 (≥500), effetti applicati 702 (≥500), oggetti passati di campo 11 (≥5). Soglia del test invariata. `TurnForecastFidelityTest`: invariato, 100% su ogni braccio, stessi turni della B2 (malus 8.160/8.160).

**Le 446 finestre della B2** (diagnosi nel [rapporto](sb-19-b2-report.md#4-la-fedeltà-rossa-diagnosi)): 440 per pesca, ora escluse e contate; 4 per il timer di «C'è del sangue», ora modellato; 2 per una Sigaretta pescata, esclusa.

## 4. Mutazioni (sulla parte nuova)

Nove, su `ViewTable` e sull'esclusione, ognuna fa fallire almeno un test (`ViewTableTest`, 8 nuovi, e `ViewTableFidelityTest`):

| Mutazione | Uccisa da |
|---|---|
| i timer scattano prima degli effetti periodici | prova dell'ordine, fedeltà |
| la carta non avvia il timer | prove di avvio e di annullo, fedeltà |
| un timer avviato anche da una carta annullata | prova della carta annullata |
| scatta un turno dopo (`>=` al posto di `>`) | sei prove, fedeltà |
| «azzera» non toglie gli stati | prova del timer che azzera |
| l'oggetto consumato non avvia il timer | prova dell'oggetto consumato |
| esclusione larga (ogni oggetto pescato) | asserzione «nessun braccio vecchio esclude» |
| esclusione senza il caso «scalzato» | fedeltà «malus» |
| nessuna esclusione | fedeltà «malus» |

In più, una prova che nome e durata dei timer scritti nelle tre carte coincidono con i `Timer` che il motore crea.

## 5. Verifiche eseguite

| Verifica | Esito |
|---|---|
| Passo 0 d'identità, bozza di 6630ebf, 8.640 partite | identico byte per byte (base 10,9 s, nuova 18,7 s), salvo `seconds.txt` |
| Identità viva 1.13 (`liveBenchOnTheSameHistoricalDraft`, 480.000 partite, 66 s) | `final-live.json` ca131721… (266.869 B) e `final-live.md` 16d3bde4… (26.112 B): **identici** alla base di SB-18 B2, riscritti dopo il codice |
| «Rif» sulla bozza con la patch (28 coppie, 403.200 partite, 118 s) | celle identiche, 0 violazioni: [identity-rif-b2a.json](sb-19/b2a/evidence/identity-rif-b2a.json), uguale a quello della B2. `matrix.json` uguale al giro della B2 salvo due righe d'intestazione (percorso e SHA della bozza, che ora ha i due oggetti) |
| `ViewTableFidelityTest`, `TurnForecastFidelityTest` | 100% su tutti i bracci (§ 3) |
| `./scripts/build.ps1 -Task Test -Offline` | 921 test, 0 falliti, 23 saltati; client 37/37 |
| `-Task TestServerContext -Offline`, `verify-match-manifests.py` | 1.039 test, 0 falliti; `allChecks: PASS` |
| `git diff --check`, `check-links.py`, `check-rules.py` | puliti |

Budget: 118 s di «Rif» su 2.400, più passo 0 e identità fuori budget. Mai due Maven o misure insieme.

## 6. Cosa tocca e non tocca

Sorgenti: `PrintedEffects` e tre carte (dato, non letto dai bot vivi), `ViewTable`; test: `ViewTableTest`, i due test di fedeltà, `Sb19`, `SetBaseDraftTest`. Nessun altro bot, nessuna misura oltre ai cancelli. Il catalogo SQLite, il regolamento e il documento del set non cambiano (nessuna carta viva cambia testo).

## 7. Scelte prese

- Il testo del timer sta in una lista separata di `PrintedEffects`, come `inPlay`: l'altra via (dedurlo dal nome della carta) avrebbe messo nomi di carte nei bot.
- Esclusione per pesca ristretta agli oggetti col malus: non toglie finestre ai bracci vecchi.
- Timer all'inizio del turno ora confrontati (esclusione tolta, non aggiunta); il previsore di un turno non è chiamato a concordare.
- Il caso «scalzato» si riconosce da un campo pieno dopo una pesca: può escludere una finestra giusta in cui un oggetto è stato consumato e poi sostituito dalla pesca; è contata a parte.

## 8. Cosa giudica il proprietario

Niente da giocare. La B2 riprende da D133 (2): mutazioni sul motore e prove del caricatore, giro, ricerca, client, prova.

## 9. Domande

Nessuna.

## Evidenze e riproduzione

[fidelity-b2a.json](sb-19/b2a/evidence/fidelity-b2a.json), [identity-rif-b2a.json](sb-19/b2a/evidence/identity-rif-b2a.json). Strumenti: [step0.ps1](sb-19/b2/step0.ps1) (`-OutputRoot %TEMP%\bm-sb19-b2a`), [run.ps1](sb-19/run.ps1) `-Phase round -Label rif-b2a -Draft classpath:/set-base/bozza.json`, [analyze.py](sb-19/analyze.py) `identity`. Uscite grezze in `%TEMP%\bm-sb19-b2a`: `step0-base`, `step0-new`, `round-rif-b2a`, `live-before`, `full-test.log`, `context.log`; mutazioni nella cartella di lavoro della sessione.
