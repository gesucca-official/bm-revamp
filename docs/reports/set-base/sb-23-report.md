# SB-23 — Conferma del formato, strada B: starter a 20/2 contro 25/3

21 novembre 2026. Esecutore Sonnet, a banco di misura ([D164](../../set-base-decisioni.md#decisioni-del-proprietario), [proposta](../../design/set-base/sb-23-proposta.md)). Bozza: quella di D162 (`bozza.json`, z2), invariata. Il rapporto misura e non decide: formato e registro sono della regia.

## Esito

**Verdetto D164: si conferma 20/2, SB-23 si può chiudere.** Le due soglie non scattano a 20/2:

| Soglia D164 (20/2) | Euristici | Tutti gli stili | Esito |
|---|---:|---:|---|
| Ricerche fallite sopra il 25% | 16,9% | 17,6% | non scatta |
| Finali in last resort fuori dal 5–15% delle partite | 8,4% | 9,9% | non scatta |

- Rispetto a SB-16h (bozza a cinque starter): le ricerche fallite scendono da 33,6% a 17,6% (tutti gli stili), le last resort restano al livello di allora (9,5% contro 9,9%), nel 5–15% che il proprietario aveva accettato in D94. Il calo delle ricerche è coerente con «Annuncia» a due nomi (SB-16i), ma la causa non è isolata da questa misura. A 20/2 tre starter hanno last resort sopra il 10% (Celestina 19,2%, Sergio 17,5%, Piera 11,4%) e Piera ricerche fallite al 28,0%: sono dati per starter, non soglie di D164.
- **20/2 passa i criteri D161 sulle coppie** (21 coppie fra 35.7 e 63.5%, durata media 8.46, patte 3.94%, specchi nei limiti). **25/3 non li passa**: 4 coppie fuori dal 35–65% (Celestina–Beppe 30,7; Mara–Duccio 67,2; Piera–Duccio 68,8; Piera–Sergio 72,3) e lo specchio di Beppe al 16,1% di patte (limite 12). Le liste 25/3 non sono bilanciate: il bilanciamento di D162 è fatto a 20/2.
- 25/3 abbassa last resort (2,1%), ricerche fallite (4,9%) ed esauriti (3,3%), come in SB-16h, ma peggiora i criteri di coppia.
- Tempo di banco: **903 s** di misura nella JVM (559 s e 393 s di orologio dei due Maven), contro il tetto di 7.200 s.

## Tabella 20/2 contro 25/3

403.200 partite per formato (28 coppie × 144 celle × 100 semi da 7.000.000; 12 stili con consapevolezza del colpo letale per lato). Contatori come in SB-16h: sono per posto-partita (due per partita); le ricerche fallite sono rapportate alle ricerche eseguite; le regolari non scelte sono turni in mano senza scegliere il titolo, per partita e per posto, escluse basic, bound e last resort.

| Gruppo | Formato | Finali in last resort | Ricerche fallite | Mazzi esauriti | Turni medi | Regolari non scelte a partita |
|---|---|---:|---:|---:|---:|---:|
| Euristici (criterio D161) | 20/2 | 8,4% | 16,9% | 12,5% | 8.46 | 17.59 |
|  | 25/3 | 2,1% | 4,9% | 3,3% | 8.19 | 16.25 |
| Tutti gli stili (come D94) | 20/2 | 9,9% | 17,6% | 14,9% | 8.94 | 19.02 |
|  | 25/3 | 2,4% | 5,5% | 3,9% | 8.68 | 17.73 |

Per starter, solo stili euristici (20/2 / 25/3):

| Starter | Finali last resort % | Ricerche fallite % | Esauriti % | Turni | Regolari non scelte |
|---|---|---|---|---|---|
| Spazienzio | 1,8 / 0,3 | 11,1 / 3,5 | 3,5 / 0,5 | 7.68 / 7.58 | 15.9 / 15.0 |
| Mara | 4,2 / 0,6 | 23,2 / 5,7 | 9,2 / 1,1 | 7.86 / 7.48 | 15.4 / 13.7 |
| Celestina | 19,2 / 4,6 | 22,8 / 7,3 | 23,9 / 6,9 | 10.26 / 9.78 | 22.7 / 20.7 |
| Piera | 11,4 / 0,9 | 28,0 / 6,9 | 20,1 / 2,0 | 9.26 / 8.47 | 19.9 / 17.2 |
| Beppe | 3,5 / 0,9 | 20,3 / 6,1 | 8,1 / 1,7 | 6.60 / 6.45 | 13.3 / 12.1 |
| Sergio | 17,5 / 7,1 | 7,3 / 4,3 | 22,3 / 10,6 | 10.69 / 11.06 | 22.5 / 23.2 |
| Duccio | 1,2 / 0,0 | 5,0 / 1,4 | 0,6 / 0,0 | 6.89 / 6.53 | 13.6 / 11.9 |

## Criteri D161 sulle coppie

| Criterio | 20/2 | 25/3 |
|---|---|---|
| Coppie fra 35 e 65% | 21/21 (min 35.7, max 63.5) — **sì** | 17/21 (min 30.7, max 72.3) — **no** |
| Durata media ≤ 10 turni | 8.46 — sì | 8.19 — sì |
| Turni di ogni specchio ≤ 15 | max 13,91 (Sergio) — sì | max 14,96 (Sergio) — sì, a filo |
| Patte ≤ 6% in totale | 3.94% — sì | 3.19% — sì |
| Patte ≤ 12% in ogni specchio | max 11,28% (Beppe) — sì | Beppe 16,12% — **no** |

Specchi (turni/patte %), 20/2: Spazienzio 7.6/1.32, Mara 7.56/3.2, Celestina 13.34/10.2, Piera 10.13/7.69, Beppe 5.61/11.28, Sergio 13.91/0.98, Duccio 6.36/6.75. 25/3: Spazienzio 7.42/2.19, Mara 7.12/2.17, Celestina 12.87/4.72, Piera 8.63/4.44, Beppe 5.67/16.12, Sergio 14.96/0.46, Duccio 5.73/6.33.

Tutte le coppie, quota del primo nome (%), turni e patte (%), solo euristici:

| Coppia | Quota 20/2 | Quota 25/3 | Turni 20/2 | Turni 25/3 | Patte 20/2 | Patte 25/3 |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio – Spazienzio | 55.7 | 47.9 | 7.60 | 7.42 | 1.3 | 2.2 |
| Spazienzio – Mara | 48.4 | 44.9 | 7.25 | 6.91 | 1.3 | 0.6 |
| Spazienzio – Celestina | 53.4 | 55.5 | 9.35 | 9.24 | 5.5 | 4.6 |
| Spazienzio – Piera | 53.2 | 43.4 | 8.19 | 7.75 | 1.9 | 1.3 |
| Spazienzio – Beppe | 59.5 | 63.2 | 6.40 | 6.28 | 1.2 | 0.7 |
| Spazienzio – Sergio | 43.8 | 41.2 | 8.66 | 9.36 | 0.6 | 0.3 |
| Spazienzio – Duccio | 41.5 | 39.7 | 6.37 | 6.23 | 1.6 | 2.1 |
| Mara – Mara | 49.8 | 49.5 | 7.56 | 7.12 | 3.2 | 2.2 |
| Mara – Celestina | 63.1 | 62.1 | 8.99 | 8.16 | 6.7 | 4.8 |
| Mara – Piera | 55.7 | 52.2 | 8.60 | 7.78 | 3.9 | 2.9 |
| Mara – Beppe | 43.1 | 51.2 | 6.28 | 6.03 | 0.4 | 0.6 |
| Mara – Sergio | 35.7 | 51.5 | 10.10 | 10.33 | 1.6 | 0.3 |
| Mara – Duccio | 58.9 | 67.2 | 6.54 | 6.36 | 3.4 | 2.1 |
| Celestina – Celestina | 47.9 | 60.7 | 13.34 | 12.87 | 10.2 | 4.7 |
| Celestina – Piera | 56.5 | 39.6 | 10.76 | 9.83 | 9.4 | 6.8 |
| Celestina – Beppe | 40.0 | 30.7 | 7.99 | 7.53 | 7.7 | 7.7 |
| Celestina – Sergio | 56.0 | 52.1 | 11.14 | 11.04 | 5.7 | 4.4 |
| Celestina – Duccio | 48.0 | 39.4 | 7.18 | 6.70 | 6.2 | 5.3 |
| Piera – Piera | 47.3 | 53.5 | 10.13 | 8.63 | 7.7 | 4.4 |
| Piera – Beppe | 52.8 | 56.2 | 7.04 | 6.45 | 1.4 | 0.6 |
| Piera – Sergio | 60.3 | 72.3 | 11.41 | 11.22 | 2.6 | 1.2 |
| Piera – Duccio | 50.0 | 68.8 | 7.84 | 7.43 | 3.3 | 2.2 |
| Beppe – Beppe | 50.9 | 50.6 | 5.61 | 5.67 | 11.3 | 16.1 |
| Beppe – Sergio | 42.4 | 42.5 | 7.88 | 8.29 | 1.6 | 0.6 |
| Beppe – Duccio | 43.2 | 45.2 | 6.01 | 5.68 | 1.0 | 0.4 |
| Sergio – Sergio | 48.2 | 52.4 | 13.91 | 14.96 | 1.0 | 0.5 |
| Sergio – Duccio | 63.5 | 59.5 | 8.46 | 8.35 | 2.0 | 3.2 |
| Duccio – Duccio | 53.3 | 53.2 | 6.36 | 5.73 | 6.8 | 6.3 |

Le quote hanno un errore tipico di circa ±3 punti a 100 semi per cella (SB-21z). Le mescolate cambiano con la dimensione: il confronto è descrittivo, non appaiato.

## Le 35 aggiunte 25/3

Regola (SB-16h): le liste da 20 restano dentro quelle da 25; **ogni mazzo ha 5 carte a 2 copie che passano a 3**; raro e tutore (la sesta azione) restano a 1 copia, quindi non sono mai candidati; basic, bound e last resort invariati. Scelta fra le carte a 2 copie nell'ordine della lista del mazzo: le prime tre del personaggio, la prima generica, il primo oggetto; se una categoria non basta si riempie con oggetti, generiche, poi personaggio. È una regola meccanica, nessuna scelta di valore; si rifà con `sb23.py liste`.

| Mazzo | Carte che passano da 2 a 3 |
|---|---|
| Spazienzio | GARGANTUESCO IMPATTO SUL TU, PAZIENZA: FINITA, NON GIOCARE COL COLTELLO NO, Tartaruga sul marciapiede, Negroni Trovato per Terra |
| Mara | Sgommata, Sorpasso in curva, Tra due paraurti, Sputo da posacenere, Espresso del distributore |
| Celestina | Dose in preparazione, Tossicone Scatarrante, Metabolismo Corrotto, Grab, Pasticca trovata sul bancone |
| Piera | Testata da ultimo giro, Giro secco, Il bancone regge, io pure, Spintone, Amaro nel bicchiere di plastica |
| Beppe | Smontiamo tutto, Chiave da tredici, Preparo il lavoro, Guanti da officina, Giubbotto di finta pelle (nessuna generica a 2 copie: due oggetti) |
| Sergio | Oh, guarda là, Ricatto, Conto salato, Tartaruga sul marciapiede, Espresso del distributore |
| Duccio | Te lo spiego io, Capocciata, Nocche sbucciate, Spintone, Panino del kebab dimenticato |

Liste: [25-3.json](../../../server/src/test/resources/set-base/sb-23/25-3.json). Test: [Sb23ListsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb23ListsTest.java) (25 esatte, massimo 3 copie, stessi titoli, annidamento 20 ⊂ 25, parti fisse identiche, raro e tutore singoli, esattamente 5 aggiunte per mazzo).

## Evidenze e riproduzione

Evidenze in [sb-23/](sb-23/): `analisi.json` (criteri e contatori), `r20-2-*` e `r25-3-*` (matrice e osservazioni compresse), file `attempt` (tempi). Dalla radice, un Maven alla volta:

1. `python -B -X utf8 docs/reports/set-base/sb-23/sb23.py liste` (scrive anche `server/target/sb-23/bozza-25-3.json`: la bozza con i soli sette mazzi, dimensione 25 e copie 3).
2. 20/2: `powershell -File docs/reports/set-base/sb-21z/run.ps1 -Phase round -Label r20-2 -Draft classpath:/set-base/bozza.json -OutputRoot <radice>/server/target/sb-23 -Games 100 -Seed 7000000 -Rows <i sette id> -Foes <i sette id>`.
3. 25/3: lo stesso con `-Label r25-3 -Draft <radice>/server/target/sb-23/bozza-25-3.json`.
4. `python -B -X utf8 docs/reports/set-base/sb-23/sb23.py analizza server/target/sb-23/round-r20-2 server/target/sb-23/round-r25-3`.

I sette id: starter-spazienzio, starter-mara, starter-tossico, starter-pino, starter-gigi, prova-sergio, prova-duccio.

## Scelte prese

- **Nessun codice del banco cambiato:** si riusa `Sb19MeasureTest#round` e `run.ps1` di SB-21z con una bozza da file. Il passo 0 d'identità non serve (nessun file che la misura esegue è toccato; l'unico Java nuovo è il test delle liste). Controllo di coerenza: il 20/2 di questa serie (solo semi da 7.000.000) è dello stesso ordine di z2 su due serie: durata 8.46 contro 8,52, patte 3.94% contro 4,10%, patte dello specchio di Beppe 11,28% (11,28%), turni di Sergio 13,91 (13,81). Il confronto riga per riga esatto non è possibile: `matrice-z2.json` fonde due serie e non conserva la prima da sola.
- **Soglie D164 su euristici e su tutti gli stili:** i numeri di D94 (9,5% e 33,6%) erano su tutti gli stili; le conclusioni coincidono.
- **Mazzi non di riferimento:** il file 25/3 per il banco contiene solo i sette mazzi (gli altri, a 20 carte, non passerebbero la convalida a 25).
- **Nessuna ritaratura:** un solo giro per formato, liste non toccate dopo la misura.
