# SB-16i — Fase B2: leva A su Mara, misura

**15 novembre 2026.** Fase B2 di [SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima), voluta da [D99](../../set-base-decisioni.md#decisioni-del-proprietario) sulla [proposta della Fase A2](../../design/set-base/sb-16i-proposta-mara.md), la cui sezione 4 è vincolante. Solo dati della bozza: codice, regolamento, `docs/sets`, catalogo e client invariati. Carte: [bozza di riferimento 1.6b](../../design/set-base/bozza-di-riferimento.md). **Stato: in attesa del proprietario.**

## In breve

- **Bozza 1.6b**, cioè la 1.6 più la leva A di D99 (1), solo numeri e testi delle tre carte in `bozza.json`: Sorpasso in curva d'anticipo +8 → **+4 A** a sé; Sgommata d'anticipo ×0,5 → **×0,8**; Cinghiata di traverso d'anticipo +10 → **+5 CUT**.
- **Misura:** un giro di 648.000 partite, stessi semi e stessi bot della Fase B. I 10 incontri senza Mara sono **identici cella per cella** al giro della Fase B (1.440 celle su 1.440).
- **Mara rientra:** Spazienzio–Mara 26,5 → **38,8%**, Mara–Piera 77,6 → **61,9%**, dentro le stime della proposta (36–42 e 59–65). Mara–Celestina 48,0% e Mara–Beppe 44,3%, un po' sotto le stime (50–56 e 47–53) ma dentro la soglia.
- **Fuori dalla soglia D95: 1 incontro su 15**, le patte dello specchio di Celestina (12,14%, invariate rispetto alla 1.6), scostamento già accettato in D99 (4).
- **Correzione: nessuna.** La regola della sezione 4 dà la riga «tutti dentro»: nessun incontro di Mara fuori né in alto né in basso.
- **Budget:** spesi **703,8 s su 2.100**, compreso un passo 0 fallito per la fattibilità (a batteria) e ripetuto a rete con l'approvazione del proprietario.
- **Attesi cambiati:** uno, in `Sb16iBotsTest` (D99 (7)).

## Cosa cambia

Solo `server/src/test/resources/set-base/bozza.json`, 5 righe: il passo dell'anticipo e il testo delle tre carte. Per la Sgommata cambiano i tre stati `SGOMMATA - HIT/CUT/POISON` (fattore e descrizione). Nessun'altra carta è toccata. `git diff --stat 336e0ff -- server scripts`, al momento della misura, mostrava solo `bozza.json`. La 1.6 misurata resta nel commit 336e0ff e in [`sb-16i/round-draft.json.gz`](sb-16i/round-draft.json.gz). Non la congelo in `set-base/storico/`: non è approvata (proposta A2, sezione 5).

[bozza-di-riferimento.md](../../design/set-base/bozza-di-riferimento.md) passa alla versione 1.2 del documento, «bozza 1.6b» (scelta della regia), con le liste rigenerate. Nessun altro documento riporta i numeri 1.6 delle tre carte: `regole-playground.md` cambiava solo con le leve B o C.

## Misura

Runner e analisi della Fase B, usati senza modificarli ([sb-16i-run.ps1](sb-16i-run.ps1), [sb-16i-analyze.py](sb-16i-analyze.py)). Confronto e impacchettamento nuovi, di sola lettura, in [sb-16i-b2/compare.py](sb-16i-b2/compare.py) e [sb-16i-b2/pack.py](sb-16i-b2/pack.py). Nessun processo Java prima di ogni corsa.

| Voce | Partite | Orologio (s) | Banco (s) | Tetto della voce | Esito |
|---|---:|---:|---:|---:|---|
| Passo 0 di fattibilità, primo tentativo (`%TEMP%\bm-sb16i-b2`) | 8.640 | 73,66 | **27,19** (> 24,2) | 100 | **STOP**: portatile a batteria, piano Bilanciato, CPU al 44% da altre applicazioni |
| Passo 0 di fattibilità, ripetuto a rete con l'approvazione del proprietario (`%TEMP%\bm-sb16i-b2r`) | 8.640 | 22,74 | **16,15** (≤ 24,2) | 100 | fattibile: stima 16,15 × 38 + 80 = 694 s ≤ 1.000; uscite identiche byte per byte al primo tentativo |
| Giro 1.6b (15 incontri × 144 celle × 300 semi, 7.000.000–7.000.299, otto thread) | 648.000 | **607,42** | 600,23 | 1.000 | completato; invarianti e tetto delle bound a zero |
| Correzione (`fix-round`) | — | 0 | — | 1.000 | **non eseguita**: regola «tutti dentro». Il budget l'avrebbe ammessa (residuo 1.396 s ≥ 1,1 × 607) |
| **Totale** | **664.920** | **703,82** | | **2.100** | residuo 1.396,18 s |

[Registro del budget](sb-16i-b2/budget.json), [fattibilità](sb-16i-b2/feasibility.json). Il primo passo 0 conta nel budget: è un tentativo fallito.

### Controllo dei 10 incontri senza Mara

`compare.py check`: **1.440 celle su 1.440 identiche** (tutti i contatori e i percentili di ogni cella) al giro della Fase B ([`sb-16i/round-matrix.json.gz`](sb-16i/round-matrix.json.gz)). Lo STOP 3 non scatta: le quote si possono leggere.

### I 15 incontri sui soli euristici

Quota del primo nominato sulle decisive, patte e turni su tutte le partite fra due bot euristici (D93). 1.6 dal [giro della Fase B](sb-16i/round-summary.md), 1.5 dal [ricalcolo](criteri-euristici-1.5.md). Tabella generata: [b2-round-table.md](sb-16i-b2/b2-round-table.md). Tutti gli stili, com contro com e contatori: [riepilogo del giro](sb-16i-b2/round-summary.md). Lì le colonne dicono «1.6» perché l'analisi della Fase B non si modifica: si legga 1.6b.

| Incontro | 1.6b: quota / patte / turni | 1.6: quota / patte / turni | 1.5: quota / patte / turni | Quota 1.6b − 1.6 | Stima A2 | Fuori dalla soglia D95 |
|---|---|---|---|---:|---|---|
| Spazienzio–Spazienzio | 50,82% / 3,87% / 8,83 | 50,82 / 3,87 / 8,83 | 50,30 / 3,60 / 9,10 | 0 | — | — |
| Spazienzio–Mara | **38,77%** / 2,88% / 8,99 | 26,48 / 1,87 / 8,52 | 58,20 / 3,50 / 9,10 | +12,29 | 36–42 | — (rientra) |
| Spazienzio–Celestina | 40,69% / 5,01% / 9,82 | 40,69 / 5,01 / 9,82 | 36,40 / 5,00 / 10,10 | 0 | — | — |
| Spazienzio–Piera | 40,48% / 1,48% / 9,05 | 40,48 / 1,48 / 9,05 | 30,10 / 1,30 / 9,60 | 0 | — | — |
| Spazienzio–Beppe | 48,87% / 1,66% / 7,61 | 48,87 / 1,66 / 7,61 | 48,30 / 1,60 / 8,00 | 0 | — | — |
| Mara–Mara | 47,75% / 5,43% / 9,43 | 48,20 / 4,27 / 9,22 | 50,30 / 4,50 / 8,80 | −0,45 | ~50 | — |
| Mara–Celestina | 47,97% / 7,51% / 10,06 | 60,91 / 7,20 / 9,70 | 31,50 / 5,20 / 9,60 | −12,94 | 50–56 | — |
| Mara–Piera | **61,91%** / 4,60% / 9,00 | 77,64 / 2,19 / 8,53 | 34,80 / 5,40 / 9,30 | −15,73 | 59–65 | — (rientra) |
| Mara–Beppe | 44,28% / 1,84% / 7,61 | 54,84 / 1,56 / 7,46 | 36,40 / 1,00 / 7,50 | −10,56 | 47–53 | — |
| Celestina–Celestina | 49,64% / **12,14%** / 14,14 | 49,64 / 12,14 / 14,14 | 49,60 / 7,70 / 14,50 | 0 | — | **patte, 2,14 punti sopra 10** (accettate, D99 (4)) |
| Celestina–Piera | 62,45% / 7,95% / 10,44 | 62,45 / 7,95 / 10,44 | 61,80 / 8,10 / 11,00 | 0 | — | — |
| Celestina–Beppe | 42,98% / 8,78% / 8,86 | 42,98 / 8,78 / 8,86 | 46,00 / 9,55 / 9,20 | 0 | — | — |
| Piera–Piera | 49,66% / 6,84% / 9,90 | 49,66 / 6,84 / 9,90 | 50,00 / 9,88 / 11,10 | 0 | — | — |
| Piera–Beppe | 43,22% / 0,79% / 7,57 | 43,22 / 0,79 / 7,57 | 50,30 / 1,70 / 8,30 | 0 | — | — |
| Beppe–Beppe | 49,97% / 9,02% / 6,47 | 49,97 / 9,02 / 6,47 | 55,80 / 9,00 / 6,80 | 0 | — | — |

**Fuori dalla soglia minima: 1 incontro su 15** (nella 1.6 erano 3, nella 1.5 3). Dal lato di Mara le quote vanno da 44,3% (Beppe) a 61,9% (Piera): il divario fra i lenti e gli altri resta, ma con 17,6 punti invece dei 51 della 1.6. Turni entro 12 fuori dagli specchi. Le patte di Mara–Piera salgono da 2,2 a 4,6%, ancora lontane dal 10%.

### Regola della sezione 4

| Condizione | Valore | Esito |
|---|---|---|
| Spazienzio–Mara sotto 35 | 38,77 | no |
| Mara–Piera sopra 65 | 61,91 | no |
| Un incontro di Mara fuori in basso (quota di Mara sotto 35) | minimo 44,28 (Beppe) | nessuno |
| Un incontro di Mara fuori in alto (quota di Mara sopra 65) | massimo 61,91 (Piera) | nessuno |

Riga: **«tutti dentro» → nessuna correzione**: scostamenti dichiarati, poi il passo del client (D98 (3), D99 (6)). Le patte dello specchio di Celestina non sono di Mara e non entrano nella regola (proposta A2, sezione 4; D99 (4)).

### Cosa dicono i contatori (soli euristici)

- **Gioca d'anticipo, 1.6b (1.6):** Sorpasso in curva 89,7% (89,5%), Sgommata 37,3% (39,4%), Cinghiata 29,9% (33,4%). La frequenza dell'anticipo cambia poco: la leva agisce sull'effetto, come voleva la proposta.
- **Ricerche fallite di Mara:** 24,4% (1.6: 24,5%). Gli altri mazzi sono invariati entro 0,3 punti; dove cambiano, dipende solo dagli incontri con Mara.
- **Mara** finisce con una last resort nel 7,1% delle partite (1.6: 5,1%) ed esaurisce il mazzo nel 14,3% (1.6: 12,4%): partite un po' più lunghe (negli incontri di Mara turni da +0,15 a +0,47).
- **Scelta fra due nomi:** come nella Fase B, «Ti stringo la curva» sceglie sempre la Sgommata (19.809 su 19.809). La regola di D97 resta (D99 (3)).

## Attesi cambiati (D99 (7))

| Test | Prima (1.6) | Dopo (1.6b) | Perché |
|---|---|---|---|
| `Sb16iBotsTest.anAheadSgommataIsASaveAgainstAShownLethalHit`, attesa su `/set-base/bozza.json` | `{Sgommata, Tra due paraurti}`: con ×0,5 l'Impatto mostrato (34) fa 17 su 25 di salute, quindi la Sgommata d'anticipo salva | `{Tra due paraurti}`: con ×0,8 restano 27 su 25, ancora letale; resta solo la parata | numero 1.6 della Sgommata cambiato dalla leva A, D99 (1) e (7) |

Cambiano il messaggio dell'asserzione e il commento del metodo («scales it (1.6: halves it, a save)»). Lo scenario e l'attesa sulla 1.5 non cambiano, e nemmeno il nome del test. Nessun altro test fissava i numeri 1.6 delle tre carte: `Bozza16Test` controlla solo che l'anticipo ci sia (`hasAhead`), e con la leva A c'è ancora.

## Verifiche

| Verifica | Esito |
|---|---|
| `git diff --stat 336e0ff -- server scripts` al momento della misura | solo `bozza.json` (5 righe) |
| 10 incontri senza Mara contro la Fase B | identici, 1.440 celle su 1.440 |
| Invarianti e tetto delle bound del giro | 0 violazioni su 648.000 partite |
| `./scripts/build.ps1 -Task Test -Offline` prima dell'atteso | 1 fallito, quello previsto (`Sb16iBotsTest`, sopra); nessun altro rosso |
| `./scripts/build.ps1 -Task Test -Offline` dopo l'atteso | verde: **855 test server, 0 falliti/errori, 20 saltati** (misure opt-in); **37/37** client-debug |
| `python scripts/check-rules.py` | verde, invariato (39 carte e 1 token) |
| `python docs/reports/set-base/sb-6b/rarita-bozza.py --check` | verde («rarità come la griglia») |
| `python docs/design/set-base/genera-bozza-di-riferimento.py --verifica` | verde |
| `git diff --check`, `python scripts/check-links.py` | verdi; 349 file e 0 link rotti |

**Rossi.** Solo l'atteso deliberato, sopra. Nessuna voce nuova nel registro dei rossi noti. Le righe `MATCH_ARCHIVE_*_FAILED` nel log di Maven sono log di test del server fuori dal perimetro, che passano. **Mutazioni:** nessuna, perché non c'è logica nuova.

**Non verificato.** Il contesto Spring completo: non richiesto, perché cambiano solo dati di test. Poi client, prova umana, FFA e il Difficile.

## Evidenze e riproduzione

In [sb-16i-b2/](sb-16i-b2/), circa 0,33 MB: budget, fattibilità, tabella B2, riepilogo del giro, JSON finali minificati e compressi (matrice, osservazioni, contatori SB-16h e SB-16i, bozza, matrice del passo 0) e il [manifesto con SHA-256](sb-16i-b2/manifest.json) degli originali. Uscite e log integrali: `%TEMP%\bm-sb16i-b2` (primo passo 0) e `%TEMP%\bm-sb16i-b2r`. Dalla radice, su un percorso nuovo (non è un'autorizzazione a un altro giro):

```powershell
./docs/reports/set-base/sb-16i-run.ps1 -Phase step0 -OutputRoot "$env:TEMP/bm-sb16i-b2-riproduzione"
./docs/reports/set-base/sb-16i-run.ps1 -Phase round -OutputRoot "$env:TEMP/bm-sb16i-b2-riproduzione"
python docs/reports/set-base/sb-16i-b2/compare.py check "$env:TEMP/bm-sb16i-b2-riproduzione" round
python docs/reports/set-base/sb-16i-b2/compare.py table "$env:TEMP/bm-sb16i-b2-riproduzione" round "$env:TEMP/bm-sb16i-b2-riproduzione/b2-round-table"
```

La soglia di fattibilità della B2 (s0 ≤ 24,2 s) la applica chi lancia: `sb-16i-analyze.py feasibility` contiene quella della Fase B (34,5 s) e non si modifica.

## Scelte prese

- **Passo 0 ripetuto su un percorso nuovo** (`bm-sb16i-b2r`), con l'approvazione del proprietario, e giro sullo stesso percorso. Il primo tentativo conta nel budget.
- **Regola della sezione 4 letta sui soli incontri di Mara**, specchio escluso dalla quota come in D95. Lo specchio di Celestina non impedisce la riga «tutti dentro».
- **Atteso:** cambia l'attesa e non lo scenario (salute 25, Impatto 34), così il test fissa il nuovo numero invece di cercare un caso in cui la Sgommata salvi ancora.
- **Titolo del documento:** «Bozza di riferimento 1.6b», versione 1.2 (scelta della regia nel prompt).

## Cosa giudica il proprietario

- **L'adozione della 1.6b** come bozza per il passo del client (scelta fra due nomi, anticipo, contatore) e per la prova umana breve (D99 (6)). Con la 1.6b resta fuori solo lo scostamento già accettato (patte dello specchio di Celestina).
- Se «Gioca d'anticipo» resta abbastanza decisivo: dal suo lato Mara sale di 8–27 punti sulla 1.5 contro tutti (Beppe +7,9, Celestina +16,5, Spazienzio +19,4, Piera +27,1), ma la Sgommata non salva più da un colpo mostrato che uccide di poco (l'atteso cambiato). La prova umana dirà se la velocità di Mara «si sente» (D95).

## Domande al proprietario

1. **Adozione:** la 1.6b è la bozza del passo del client e della prova umana breve?
