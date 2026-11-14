# SB-16g — correzione 1.5: attuazione e misura (D90)

14 novembre 2026. Base `e87d8ec`. Attuazione della [correzione 1.5](../../design/set-base/sb-16g-proposta.md#passo-3b--correzione-15)
approvata in [D90](../../set-base-plan.md#decisioni-del-proprietario) sulla bozza di riferimento scelta in D89, il braccio B del
[passo 3](sb-16g-2b3-report.md#parte-2--attuazione-passo-0-e-giro-finale-a-due-bracci-d82-d84-d88); passo 0, cancello d'identità
e un solo giro con budget nuovo. Evidenze in [sb-16g-15/](sb-16g-15/).

## Attuazione, attesi e perimetro

**Bozza e griglia.** Tre numeri di tre carte in `server/src/test/resources/set-base/bozza.json`, con testo breve e danno mostrato
allineati alla tabella «Carte che cambiano nella 1.5»; il braccio B resta bozza + `set-base/bancone-b.json` (`-Dsim.arm=B`), come nel passo 3.

| Carta (binding) | Braccio B del passo 3 | 1.5 |
|---|---|---|
| GARGANTUESCO IMPATTO SUL TU (`bruiser.SuperImpact`) | 25 V; 30 HIT | 25 V; **34 HIT** — «Infliggi 34 danni da colpo al bersaglio.» |
| Chiave da tredici (`base.gigi.ChiaveDaTredici`) | 10 V; 22 CUT | 10 V; **18 CUT** — «Infliggi 18 danni da taglio al bersaglio.» |
| Lavoro fatto bene (`base.gigi.LavoroFattoBene`) | 10 V; 14 + 7 per oggetto | 10 V; **14 + 4** per oggetto (`perItem` 4) — «Infliggi danni da colpo pari a 14 più 4 per ogni tuo oggetto sul campo.» |

Binding, ordine delle carte, rarità, priorità, costi, premi, liste e Bancone B invariati. [Griglia](../../design/set-base/griglia.md#correzione-15-di-sb-16g-d90):
valori barrati nelle righe SPA-AR1, GIG-AR2, GIG-AR5 e una sezione «Correzione 1.5». Nessun file del regolamento, di `docs/sets`, del catalogo,
di `server/src/main`, del client, di client-debug o delle carriere toccato.

**Attesi cambiati con D90** (citata in ogni riga; nessuno per accettare regressioni):

- `PotenzaD82Test`: i numeri della 1.4 sulla bozza diventano 34 HIT, 18 CUT e `perItem` 4; i colpi risolti contro motore e previsione
  0→34, 22→18, 14 + 4 × 2. L'insieme delle 14 carte cambiate rispetto al passo 2 resta lo stesso.
- `SetBaseDraftTest`: Chiave 18 CUT con danno mostrato e testo; `perItem` 4.
- `StarterRedesignTest`: danni dei colpi trovati, Impatto 34 e Chiave 18.
- `LethalAwarePolicyTest`: commenti a 34 HIT; il solo caso con soglia esatta (corazza del bersaglio: 34 − 20/4 = 29) passa da salute
  25/26 a **29/30**, perché resti «letale a 29, non a 30»; gli altri casi conservano la propria intenzione con 34 (non letale a 40, 51 col gettone, 24 su 25 con L 40).

**Test nuovo `Correzione15Test`:** la bozza differisce dallo snapshot del passo 3 (`draft-A.json`) e il braccio B da quello misurato
(`draft-B.json`) **solo** nei tre campi delle tre carte, con stesso ordine delle carte (stesse mescolate, D88); costi e finanziamento da zero
(PAZIENZA +25 V, Preparo +15 V, Una stretta +10 V); i tre colpi sul braccio B risolti dal motore e fra le varianti della previsione:
Impatto 34, Chiave 18, Lavoro 14/18/22/26 con 0/1/2/3 oggetti. Nessuna logica nuova con rami, quindi nessuna mutazione (contratto:
non su costanti).

## Verifiche sul codice finale

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | verde: server **801 test, 0 falliti/errori, 17 saltati** (793/13 del passo 3, +4 di `Correzione15Test`, +4 saltati di `Sb30bProbeTest` da `3f51fed`); client-debug 37/37; `check-rules.py` verde |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | verde: **918 test, 0 falliti/errori, 17 saltati** |
| Identità viva 1.13 (`liveBenchOnTheSameHistoricalDraft`) | 480.000 partite, dopo il giro: JSON 266.868 B e Markdown 26.111 B **identici** alla base, stessa fixture e cartella del passo 3 ([impronte](sb-16g-15/live-identity.json)) |
| `TurnForecastFidelityTest` | A **5.526/5.526** turni, B **5.536/5.536** (72 e 73 esclusi per timer); i conteggi cambiano perché cambiano le partite campione |
| `python scripts/check-rules.py` | verde |
| `check-links.py`, `git diff --check` | verdi: 314 file, 0 link rotti |
| Playwright, suite client-web | non eseguite: nessun file del client toccato |

## Passo 0, cancello d'identità e giro

**Processi.** Nessun processo `java` attivo prima del passo 0 e prima del giro; nessun'altra misura o Maven durante entrambi.

**Passo 0**, braccio B 1.5, 4 semi per cella (i primi quattro del giro), otto thread: **8.640 partite in 18,735 s** (Maven 25,50 s di orologio).
Regola D90: s0 + 112,5 × s0 + 120 = **2.246,5 s ≤ 7.200 s** (s0 ≤ 62,38 s), fattibile; anche coi secondi di orologio 3.014,4 s
([fattibilità](sb-16g-15/feasibility.json)). Invarianti a zero.

**Cancello d'identità** ([script](sb-16g-15/identity.py)): sulle celle dei 6 incontri senza Spazienzio né Beppe ogni campo di ogni cella
(vittorie per posto, patte, limite, vittorie del primo posto, turni totali, mediana, P10, P90, minimo, massimo) e i totali d'incontro.

| Confronto | Celle identiche | Totali d'incontro identici | Differenze |
|---|---|---|---|
| Passo 0 contro step0-B del passo 3 | **864/864** (3.456 partite) | 6/6 | 0 ([dati](sb-16g-15/identity-step0.json)) |
| Giro contro il braccio B del passo 3 | **864/864** (259.200 partite) | 6/6 | 0 ([dati](sb-16g-15/identity-round.json)) |

Cambia solo l'impronta della bozza nell'intestazione, come atteso. Limite dichiarato: il banco non scrive le singole partite; il
confronto «partita per partita» è sulla cella di 4 o 300 partite con la distribuzione dei turni, la granularità più fine disponibile.

**Giro unico**, semi 7.000.000–7.000.299, 300 per cella, bot e politiche del passo 3, otto thread: **648.000 partite in 501,243 s**
(508,18 s di orologio). Otto invarianti a **zero** su 12.460.728 turni di giocatore, nessun limite di durata, bound entro 4.

| Voce | Banco (s) | Orologio Maven (s) |
|---|---:|---:|
| Passo 0 | 18,735 | 25,501 |
| Giro | 501,243 | 508,177 |
| Campioni falliti, diagnosi | 0 | 0 |
| **Totale nel budget D90** | **519,978** | **533,678** |

**Budget D90: un giro usato su uno; residuo 0 giri e 6.666,322 s** contando l'orologio ([registro](sb-16g-15/budget.json)). Residuo D68 non
usato. Nessuna taratura dopo il passo 0 o dopo il giro, nessun rilancio.

## Risultati: 15 incontri contro il braccio B

Riferimento appaiato: braccio B del passo 3, stessi semi. Quote sulle decisive, patte su tutte le partite. Criteri D16/D51: quota 40–60%
(45–55% per Spazienzio–Mara), patte ≤ 10%, turni medi 6–12; gli specchi solo patte e durata. Dettagli nel [riepilogo](sb-16g-15/summary.md).

| Incontro | Braccio B quota / patte / turni | 1.5 quota / patte / turni | Δ quota | Stima 1.5 | Fuori (B → 1.5) |
|---|---|---|---:|---|---|
| Spazienzio–Spazienzio | 51,90% / 2,44% / 9,67 | 50,82% / 2,78% / 9,24 | −1,08 | in quota, −0,3 turni | — → — |
| Spazienzio–Mara | **57,42%** / 2,84% / 9,41 | **61,82%** / 2,69% / 9,11 | +4,40 | 58–62%, resta fuori | quota → **quota** |
| Spazienzio–Celestina | **37,25%** / 4,67% / 10,25 | 41,97% / 4,92% / 9,98 | +4,72 | 40–44% | quota → — |
| Spazienzio–Piera | **33,16%** / 1,57% / 10,39 | **37,67%** / 1,69% / 10,09 | +4,51 | 40–46% | quota → **quota** |
| Spazienzio–Beppe | **37,61%** / 0,98% / 7,98 | 55,19% / 1,47% / 8,49 | +17,58 | 47–53% | quota → — |
| Mara–Mara | 50,25% / 3,33% / 8,80 | identico | 0 | identico | — |
| Mara–Celestina | **34,84%** / 4,59% / 9,46 | identico | 0 | identico | quota |
| Mara–Piera | **37,70%** / 3,74% / 9,59 | identico | 0 | identico | quota |
| Mara–Beppe | **29,32%** / 0,55% / 7,23 | 42,09% / 1,08% / 7,97 | +12,78 | 38–44% | quota → — |
| Celestina–Celestina | 50,20% / 5,35% / **12,98** | identico | 0 | identico | durata |
| Celestina–Piera | **61,53%** / 6,73% / 10,91 | identico | 0 | identico | quota |
| Celestina–Beppe | **34,43%** / 5,85% / 8,43 | 52,06% / 7,06% / 9,32 | +17,63 | 41–47% | quota → — |
| Piera–Piera | 50,00% / 6,43% / 11,64 | identico | 0 | identico | — |
| Piera–Beppe | **37,04%** / 0,80% / 8,14 | 53,84% / 1,33% / 9,01 | +16,80 | 43–49% | quota → — |
| Beppe–Beppe | 51,85% / 7,61% / 6,41 | 53,42% / 5,99% / 7,63 | +1,58 | turni 7–8, patte 8–9% | — → — |

Totale: **6 incontri su 15 fuori** (B: 11); celle incontro × politiche fuori **51/135** (B: 89); celle incontro × stili 150/240 (B: 163).
Patte globali 3,95% (B 3,83%), turni medi 9,62 (B 9,42).

### Giudizio sui 9 incontri con Spazienzio o Beppe (D90, punto 4)

- **7 su 9 in criterio** (B: 2 su 9): Spazienzio–Spazienzio, Spazienzio–Celestina, Spazienzio–Beppe, Mara–Beppe, Celestina–Beppe,
  Piera–Beppe, Beppe–Beppe.
- **2 fuori, entrambi su Spazienzio:** **Spazienzio–Mara 61,82%** (finestra 45–55%), come stimato; **Spazienzio–Piera 37,67%**
  (sotto 40%), sotto la stima 40–46%.
- **Celle per politica nei 9: 19 fuori su 81** (B: 57): Spazienzio–Mara 9/9, Spazienzio–Piera 7/9, Spazienzio–Celestina 1/9
  (RANDOM/ALWAYS 39,54%), Mara–Beppe 2/9 (Mara RANDOM contro ALWAYS 38,32% e HOLD_IF_DEFENDED 39,20%).
- **Cancello completo D16/D51 non raggiunto:** 6 incontri su 15 fuori, i 4 esclusi da D89 per costruzione (Mara–Celestina,
  Mara–Piera, Celestina–Piera, durata di Celestina–Celestina) più i 2 di Spazienzio. Poiché i 9 non tornano tutti in criterio, per D90
  punto 4 è **STOP con i dati**.

Rispetto alla stima: Beppe è sceso più del previsto (i tre incontri Beppe–starter a 52–55% invece di 41–49%, Spazienzio–Beppe 55,19%
invece di 47–53%); Spazienzio è salito di circa 4,5 punti contro Mara, Celestina e Piera, il minimo delle stime.

**Spazienzio–Mara non è più fuori soltanto per Mara `com`:** Spazienzio vince il 57,6/56,9/55,3% contro Mara aggressivo/prudente/risorse
(B: 51,0/52,2/51,5) e il 77,2% contro `com` (B: 74,8). La premessa di D90 punto 5 vale ancora per la maggior parte dello scarto, non per tutto.
**Spazienzio–Piera** dipende dalla corazza: 23,8/30,4/33,8% contro Piera aggressivo/prudente/risorse, 63,0% contro `com`.

### Quote per stile di Spazienzio e Beppe

Quota sulle decisive dello stile contro ogni starter, politiche e stili avversari aggregati, specchi esclusi. Braccio B → 1.5.

| Stile di Spazienzio | contro Mara | contro Celestina | contro Piera | contro Beppe |
|---|---|---|---|---|
| aggressivo | 57,6 → **61,6** | 42,2 → **47,8** | 38,4 → **43,8** | 43,0 → **60,1** |
| prudente | 49,7 → **53,6** | 14,1 → **14,5** | 15,0 → **16,2** | 25,1 → **39,6** |
| risorse | 69,9 → **75,3** | 61,5 → **68,2** | 49,4 → **54,7** | 51,3 → **71,5** |
| com | 51,9 → **56,3** | 32,0 → **38,3** | 29,8 → **35,7** | 31,0 → **49,0** |

| Stile di Beppe | contro Spazienzio | contro Mara | contro Celestina | contro Piera |
|---|---|---|---|---|
| aggressivo | 70,5 → **54,1** | 80,3 → **69,1** | 81,2 → **64,4** | 73,5 → **57,2** |
| prudente | 73,2 → **57,3** | 83,7 → **73,4** | 77,4 → **60,5** | 78,0 → **63,0** |
| risorse | 68,2 → **49,9** | 76,0 → **63,7** | 74,8 → **54,9** | 70,2 → **51,1** |
| com | 37,5 → **18,0** | 42,5 → **25,0** | 29,7 → **14,2** | 30,1 → **13,4** |

Lo stile prudente di Spazienzio (0,05 annunci a partita) resta al 14–16% contro Celestina e Piera; lo scarto fra stili di Beppe
(euristici 50–73%, `com` 13–25%) resta ampio, ora con gli euristici vicini alla quota e `com` molto sotto.

### Letture del «Disegno della misura»

- **Annunci per partita** (B → 1.5): Spazienzio 0,902 → 0,876 (aggressivo 1,10 → 1,08, prudente 0,06 → 0,05, risorse 1,53 → 1,47,
  com 0,93 → 0,91); Beppe **1,529 → 1,738** (aggressivo 1,75 → 2,00, prudente 1,57 → 1,83, risorse 1,75 → 1,97, com 1,05 → 1,14):
  partite più lunghe di Beppe, più caricamenti; gli altri starter invariati entro 0,02.
- **Turni da metà salute e finali in un turno per carta** (tutti gli starter che subiscono): Impatto 18.153 → **22.583** e
  2.267 → **4.411** finali (contro Beppe 264 → 1.261, contro Piera 93 → 310); Lavoro fatto bene 18.376 → **2.550** e 3.792 → **526**;
  Chiave da tredici 1.005 → 917 e 312 → 74. Totale turni da metà salute 90.157 → 78.242, finali 13.102 → 11.883. Lavoro non è più la
  prima carta dei finali: ora Impatto è la prima sia dei finali sia dei turni da metà salute (seconde travaso 1.632 e Cinghiata 15.069).
- **Carte cambiate giocate quando in mano:** Impatto 70,05% → 74,09%; Chiave 94,19% → 93,87%; Lavoro 89,74% → 89,66%.
- **4 CUT effettivi di Beppe** (mosse / salute tolta): Preparo riuscite 201.969 → 212.312 / 834.707 → 880.445, fallite 64.646 → 90.388 /
  253.539 → 358.454; Una stretta riuscite 77.968 → 81.629 / 323.586 → 341.299, fallite 51.835 → 66.081 / 208.127 → 266.581. Circa
  4,0 di salute tolta per mossa, come nel passo 3.
- **Beppe–Beppe:** patte 7,61% → **5,99%**, turni 6,41 → **7,63**: in criterio, più lungo, patte in calo invece della salita stimata.
- **Politiche:** dettaglio nel [riepilogo](sb-16g-15/summary.md#celle-incontro--politiche-fuori-soglia-15); fuori soglia per politica
  restano quasi solo gli incontri già fuori nel complesso.

## Rossi

Nessun rosso nuovo. Rossi di bilanciamento D16/D51 sopra. Nessuna soglia cambiata.

## Non verificato

Playwright, suite client-web, prova umana, misura FFA, trasferimento vivo. Il bilanciamento non è dichiarato chiuso. Le stime della 1.5
erano a occhio; il rapporto le confronta, non le ricalibra.

## Domande numerate

1. Con 7 dei 9 incontri in criterio e i 2 fuori entrambi su Spazienzio (Mara 61,82%, Piera 37,67%), la 1.5 diventa la bozza di
   riferimento per SB-16h Fase B e la prova umana breve (D89, punto 3)?
2. Spazienzio–Mara è ora fuori anche contro gli euristici di Mara (55–58%): resta da correggere su Mara come in D90 punto 5, o
   va riaperta su Spazienzio insieme a Spazienzio–Piera, che va nella direzione opposta?
3. Spazienzio–Piera (sotto quota soprattutto contro gli euristici di Piera e con lo stile prudente al 16%) va in una proposta
   successiva, insieme ai 4 incontri esclusi da D89?
4. Lo scarto fra stili di Beppe (`com` al 13–25%) va portato nella proposta della regia sul peso del bot casuale nei criteri (D90, punto 5)?

## Comandi riproducibili

Dalla radice, con Java e Maven del checkout come nel [passo 3](sb-16g-2b3-report.md#comandi-riproducibili). Da `server/`, passo 0 con
`-Dsim.chargeGames=4` e uscita `../tmp/sb16g15/step0-B`, giro con `300`:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.chargeGames=300' `
  '-Dsim.arm=B' '-Dsim.chargeOut=../tmp/sb16g15/round-B'
```

Dalla radice, senza partite: `python docs/reports/set-base/sb-16g-15/identity.py tmp/sb16g2b3/round-B tmp/sb16g15/round-B OUT.json`
(e lo stesso con `step0-B`); `python docs/reports/set-base/sb-16g-15/summarize.py tmp/sb16g15/round-B OUT` (riferimento letto da
`sb-16g-2b3/matrix-B.json` e `observations-B.json`). `matrix.json`, `observations.json` e `draft.json` del giro sono in [sb-16g-15/](sb-16g-15/).
