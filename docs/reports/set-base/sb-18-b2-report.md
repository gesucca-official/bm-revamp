# SB-18 — Fase B2: taratura dei costi, Duccio in bozza, giro con riserve (rapporto)

**17 novembre 2026. Fase B2 di [D126](../../set-base-decisioni.md#decisioni-del-proprietario) (2): giro di taratura sui costi della V3, scelta con la regola scritta,
variante in `bozza.json` con le verifiche complete, correzione di `unlockedDamage`, test del costo in HEALTH, giro con le riserve R1 e R2. Un solo STOP, alla fine.**

## Stato (ripartenza)

- Tappa 1, taratura: copie scritte (`sb-18/b2/bozza-k170.json`, `bozza-k185.json`, da `make-copies.py`); numeri nella § 1, scritti prima di misurare.
- Tappa 2, scelta: K170 3 incontri fuori, K185 1 (Mara 33,94%), L3 1 (Mara 26,29%); a pari, media K185 52,32% contro L3 44,69%: **vince K185**.
- Tappa 3, documenti e codice: griglia ROC-* con K185; bozza = K185 (più `LR-ROC` nella descrizione della last resort); correzione di `unlockedDamage`; test. Passo 0 e identità viva identici; fedeltà 100%; mutazioni 6/6.
- Tappa 4, giro 1 sulla bozza: Mara 33,91% (−1,09), media 52,25%; R1 nel verso scritto (+0,1, § 4), numeri scritti prima di misurare.
- Tappa 5, riserve: R1 (×1,95) Mara 26,45%; R2 (salute 115) Mara **33,00%**, gli altri dentro, media 51,75%: **scostamento dichiarato** di 2,00 punti (D126 (3)).
- Tappa 6: verifiche verdi (§ 6), bozza di riferimento rigenerata, jar costruito; 337,4 s di misure su 450. **STOP per il proprietario.**

## 1. Taratura: numeri e regola, scritti prima di misurare

Due copie della V3 ([b/bozza-v3.json](sb-18/b/bozza-v3.json)) che cambiano **solo i costi** (cifra di `cost` e descrizione stampata), con il fattore
applicato ai costi della V3 (Nocche sbucciate 8, E allora? 5, Capocciata 14, Testa dura 16) e arrotondato all'intero più vicino, a metà verso il basso
([make-copies.py](sb-18/b2/make-copies.py)). Salute 110, A 15, HIT, cure e Te lo spiego io come nella V3; «Ultimo colpo» fuori (D125 (3)).

| | Fattore | Nocche sbucciate | E allora? | Capocciata | Testa dura |
|---|---|---:|---:|---:|---:|
| V3 (Fase B) | ×1 | 8 | 5 | 14 | 16 |
| **K170** | ×1,7 | **14** | **8** | **24** | **27** |
| **K185** | ×1,85 | **15** | **9** | **26** | **30** |
| L3 (B1e, già misurata) | ×2 | 16 | 10 | 28 | 32 |

Un giro ciascuna col banco `Sb18MeasureTest` e il lanciatore `sb-18/run.ps1` della Fase B (300 semi per cella, 259.200 partite, stessi semi e stili);
la L3 non si rilancia. **Regola di scelta (D126 (2)):** vince chi ha meno incontri fuori D95; a pari, la quota media di Duccio sui cinque starter più
vicina al 50%; poi le patte dello specchio più basse.

**Riserve del giro finale, scritte ora** (una volta ciascuna, nell'ordine): **R1** fattore dei costi ±0,1 (Nocche ±1, E allora? ±1, Capocciata ±2,
Testa dura ±3) nel verso che porta la media verso il 50%, se un solo lato è fuori; **R2** salute ±5 se R1 non basta. Se resta fuori un incontro entro
5 punti, scostamento dichiarato (D126 (3)); oltre, STOP.

## 2. Taratura: esito e scelta

| Incontro (soli euristici) | V3 ×1 | K170 ×1,7 | **K185 ×1,85** | L3 ×2 |
|---|---|---|---|---|
| Duccio–Spazienzio | **93,49%** | **68,64%** | 61,87% | 55,43% |
| Duccio–Mara | **85,30%** | 42,22% | **33,94%** | **26,29%** |
| Duccio–Celestina | **93,56%** | **67,62%** | 58,70% | 49,52% |
| Duccio–Piera | **93,58%** | 58,63% | 50,05% | 41,84% |
| Duccio–Beppe | **94,68%** | **67,32%** | 57,06% | 50,39% |
| Incontri fuori D95 | 5 | 3 | **1** | 1 |
| Quota media sui cinque starter | 92,12% | 60,89% | **52,32%** | 44,69% |
| Patte dello specchio | 6,46% | 7,30% | 7,45% | 8,99% |

**Scelta con la regola scritta:** K185 e L3 hanno un incontro fuori ciascuna; a pari, la media più vicina al 50% è K185 (2,32 punti contro 5,31).
Vince **K185** (Nocche sbucciate 15, E allora? 9, Capocciata 26, Testa dura 30 HEALTH), la candidata della B1e. Mara resta 1,06 punti
sotto 35: l'interpolazione della B1e (35,2%) era 1,3 punti troppo ottimista. Tabelle complete: [compare-taratura.md](sb-18/b2/compare-taratura.md),
riepiloghi [K170](sb-18/b2/round-k170.md) e [K185](sb-18/b2/round-k185.md). Tempi: 57,1 s e 64,1 s.

## 3. Duccio in bozza

`bozza.json` è la copia K185 con una sola differenza di testo: la descrizione della last resort apre con `LR-ROC` (la riga della griglia) al
posto di `ROC-LR`, perché `rarita-bozza.py --check` e `SetBaseDraftTest` leggono lo slot dalla descrizione. Righe `ROC-*`, `PG-ROC` e
`LR-ROC` della [griglia](../../design/set-base/griglia.md#azioni-darchetipo-42) coi valori K185 e i nomi di lavoro di D124 (5), nota ⁹; Duccio a
2 C / 3 NC / 1 R (D124 (6)). `regole-playground.md` non cambia: RP-2 dice già che un costo in HEALTH si paga solo sopra il costo.

## 4. Giro finale e riserve

**Giro 1** (bozza K185, codice con la correzione): Mara **33,91%** (−1,09), Spazienzio 61,78%, Celestina 58,66%, Piera 49,83%, Beppe 57,09%;
media **52,25%**; specchio 7,54% di patte. Un solo lato è fuori (Mara sotto 35): si applica R1.

**R1, verso scritto prima di misurare.** La regola dice «nel verso che porta la media verso il 50%»: la media è 52,25%, sopra il 50%, quindi
il verso è **+0,1** (costi più alti, Duccio più debole), che è anche il «+0,1 se Mara scende sotto 35» della B1e (§ 6). Lo applico così com'è
scritto, anche se sposta Mara più in basso: il verso opposto (×1,75: 14 / 8 / 24 / 27) coincide coi numeri della K170, già misurata con tre
incontri fuori. **R1 = ×1,95: Nocche sbucciate 16, E allora? 10, Capocciata 28, Testa dura 33 HEALTH** (15 + 1, 9 + 1, 26 + 2, 30 + 3).
Attesa (interpolazione fra K185 e L3, non una misura): Mara fra 28% e 31%, Spazienzio circa 57%.

**Giro 2** (R1, ×1,95): Mara **26,45%** (−8,55), Spazienzio 54,41%, Celestina 48,29%, Piera 40,62%, Beppe 49,11%; media **43,78%**; specchio
8,79% di patte. Tempo 78,5 s. Come previsto dal verso scritto, R1 allontana Mara: non basta, si applica R2.

**R2, verso scritto prima di misurare.** La media è 43,78%, sotto il 50%: il verso che la porta verso il 50% è **+5 di salute**. R2 si somma a
R1 (le riserve sono in ordine, una volta ciascuna, e R1 non si ritira). **R2 = salute 115**, costi di R1 (16 / 10 / 28 / 33), A 15, il resto
invariato. Attesa (non una misura): Mara intorno al 30%, quindi probabilmente oltre i 5 punti dello scostamento dichiarabile.

**Giro 3** (R1 + R2: costi 16 / 10 / 28 / 33, salute 115): tempo 77,4 s.

| Incontro (soli euristici) | Giro 1 (K185) | Giro 2 (R1) | **Giro 3 (R1 + R2)** | D95 |
|---|---|---|---|---|
| Duccio–Spazienzio | 61,78% | 54,41% | **61,82%** | 35–65% |
| Duccio–Mara | 33,91% | 26,45% | **33,00%** | 35–65% |
| Duccio–Celestina | 58,66% | 48,29% | **57,14%** | 35–65% |
| Duccio–Piera | 49,83% | 40,62% | **49,43%** | 35–65% |
| Duccio–Beppe | 57,09% | 49,11% | **57,35%** | 35–65% |
| Quota media sui cinque starter | 52,25% | 43,78% | **51,75%** | — |
| Patte dello specchio (euristici) | 7,54% | 8,79% | **7,53%** | ≤ 10% |
| Patte più alte contro uno starter | 5,60% | 4,67% | **5,81%** (Celestina) | ≤ 10% |
| Turni per partita, specchio | 5,99 | 5,92 | **6,19** | ≤ 12 |

Partite 259.200 per giro; violazioni 0; bound oltre il tetto 0. Tabelle complete: [compare-giro.md](sb-18/b2/compare-giro.md) (con la K185
della taratura accanto), riepiloghi [giro 1](sb-18/b2/round-1.md), [giro 2](sb-18/b2/round-2.md), [giro 3](sb-18/b2/round-3.md).

**Esito con la regola scritta.** Dopo R1 e R2 resta fuori un solo incontro, Duccio–Mara, a **2,00 punti** sotto il 35%: entro i 5 punti, quindi
**scostamento dichiarato** (D126 (3)), niente STOP per la soglia. Bozza finale: **salute 115, costi 16 / 10 / 28 / 33 HEALTH**, HIT 18 / 8 / 26 / 30.
Lettura: R1 e R2 quasi si compensano (fattore +0,1 sui costi contro +5 di salute: per Mara −7,5 e +6,6 punti); la bozza finale sta sul giro 1,
con Mara ancora sotto. Il collo resta Mara: Duccio vince il 61,8% contro Spazienzio con 3,2 punti di margine, quindi una leva unica non porta
Mara a 35 senza far uscire Spazienzio (la B1e lo aveva già visto, § 6).

## 5. Letture (non criteri), accanto alla § 5 della Fase B

Per partita e per posto di Duccio, soli euristici, 170.100 posti-partita per giro; stesse definizioni della Fase B.

| Lettura | V3 (Fase B) | K185 (taratura) | Giro 1 | Giro 2 (R1) | **Giro 3 (finale)** |
|---|---|---|---|---|---|
| Mazzo esaurito | 0,03% | 0,05% | 0,06% | 0,07% | **0,09%** |
| Turni per partita | 6,27 | 6,49 | 6,48 | 6,56 | **6,59** |
| Salute spesa a partita (scheda: 30–40) | 37,20 | 58,34 | 58,40 | 60,68 | **62,98** |
| Salute recuperata a partita (proposta: 15–20) | 6,99 | 11,88 | 11,85 | 13,14 | **12,32** |
| Salute persa per danni a partita | 59,27 | 56,71 | 56,64 | 56,69 | **57,39** |
| Bound sul totale delle giocate | 3,07% | 5,10% | 5,06% | 5,40% | **5,40%** |
| Bound sulle giocate con salute sotto 30 | 6,53% | 11,59% | 11,56% | 12,17% | **12,75%** |
| Last resort: partite in cui è giocata | 0,00% | 0,00% | 0,00% | 0,00% | **0,00%** |
| Pagamenti a zero senza «Ultimo colpo» | 0 | 0 | 0 | 0 | **0** |
| Ricerche di Te lo spiego io fallite | 2,05% | 4,69% | 4,68% | 4,74% | **5,16%** |

La riga «Turni di Duccio con salute sotto 30» non si confronta con la Fase B (14,12% nella V3): nei giri della B2 vale 31,0–33,6%, perché con
costi quasi doppi pagare porta spesso la salute sotto 30. Si legge fra i giri della B2.

**Carte a costo HEALTH nel giro finale** (giocate a partita; salute spesa a partita dalla carta): Nocche sbucciate 0,82 (13,1), E allora? 0,65 (6,5),
Capocciata 0,86 (24,0), Testa dura 0,59 (19,3); Te lo spiego io, gratuita, 0,69. Contro la V3 (0,91 / 0,74 / 1,06 / 0,71) i bot le giocano un po'
meno ma spendono di più: la salute spesa (63) supera la forbice della scheda (30–40) e la recuperata (12) resta sotto la stima della proposta.
Nessuno muore pagando; la last resort non si gioca mai (come nella Fase B); Alzo la voce quasi mai (0,80% delle partite).

## 6. Verifiche

| Verifica | Esito |
|---|---|
| Passo 0 d'identità, prima di cambiare bozza e codice ([step0.ps1](sb-18/b2/step0.ps1)) | 8.640 partite sulla 1.6b, base 10,46 s e nuova 16,93 s: tutti i file identici byte per byte salvo `seconds.txt` ([identity.json](sb-18/b2/identity.json)) |
| Identità viva (`ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft`, 480.000 partite, 61,1 s) | `final-live.json` ca131721… (266.869 B), `final-live.md` 16d3bde4… (26.112 B): identici alle impronte della B4 di SB-17, con la cartella d'uscita nell'intestazione uguale (come in SB-16i) |
| `./scripts/build.ps1 -Task Test -Offline` (bozza finale) | 902 test, 0 falliti, 22 saltati; client 37/37 |
| `-Task TestServerContext -Offline` e `verify-match-manifests.py` | 1.020 test, 0 falliti, 22 saltati; manifesti `allChecks: PASS` |
| Fedeltà col braccio di Duccio (bozza finale) | `TurnForecastFidelityTest` 6.734/6.734 turni (carte a costo HEALTH nel campione: 241 / 268 / 289 / 197); `ViewTableFidelityTest` prima 6.734/6.734, due salute 4.108/4.108, risorse 4.108/4.108 (265 / 278 / 332 / 233) |
| Tetto D36 sulle bound di Duccio (`BoundCap`, banco del tetto) | Colpetto 4,0 di 4,0, Alzo la voce 4,0 di 4,0, Gomitata 2,67 di 4,0: nessuna oltre |
| Mutazioni (6, su correzione e costo in HEALTH; [mutations.json](sb-18/b2/mutations.json)) | 6/6 uccise, rilanciate sulla bozza finale; file ripristinati |
| `rarita-bozza.py --check` | rarità come la griglia |
| Bozza di riferimento | `genera-bozza-di-riferimento.py --scrivi`, poi `--verifica`: allineata |
| `git diff --check`, `check-links.py`, `check-rules.py` | puliti |
| `./scripts/build.ps1 -Task Server -Offline` | jar costruito per la prova del proprietario |

Mai due Maven o misure insieme. Budget delle misure: 337,4 s su 450 ([budget.json](sb-18/b2/budget.json)). Durante le misure era attivo un
processo `node` estraneo al repository (nessun `java` oltre al banco).

**Attesi cambiati, tutti per D126 (Duccio in bozza):** `SetBaseDraftTest` bound 18 → 21, partite dei banchi 21 → 28 coppie, carte di stato
14 → 16 (Incassare, E allora?), conti per rarità 38 / 10 / 46 → 40 / 13 / 52 (105 carte), più Duccio, `prova-duccio`, `PG-ROC` e le rarità
delle righe `ROC-*` negli elenchi; `Bozza16Test` toglie anche Duccio (`Sb18.without`) per restare sui cinque starter; nelle due prove di fedeltà
un braccio in più, `duccio`, con 400 semi invece di 300 per restare sopra il minimo di 5.000 turni controllati (soglia invariata).
Nuovi: `Sb18CardsTest` (salute 115, costi 16 / 10 / 28 / 33, HIT, mazzo; costo in HEALTH; tetto D36) e `UnlockedDamageHealthTest` (correzione
di `unlockedDamage`, sulla Capocciata vera, coi numeri letti dalla bozza). Nessun atteso cambiato per tornare al verde.

## 7. Scelte prese

- **Codice in `server/src/main`:** solo `StyleSupport.Situation.unlockedDamage` (§ 3 della proposta): con d50 una HEALTH si paga con salute
  sopra il costo, «Ultimo colpo» sempre; regole vive e altre risorse come prima. Cambia i giri di pochissimo (K185 contro giro 1: Mara −0,03).
- **`regole-playground.md` invariato:** RP-2 copre già il costo in HEALTH; nessuna riga per Duccio.
- **Descrizione della last resort** con `LR-ROC` (riga della griglia) invece di `ROC-LR`, per gli strumenti che leggono lo slot.
- **Verso di R1 letto alla lettera** (media sopra il 50%: costi più alti), anche se allontanava Mara; scritto prima di misurare (§ 4).
- **R2 sommata a R1**, non al posto: le riserve sono in ordine e una volta ciascuna.
- **400 semi nel braccio `duccio`** delle prove di fedeltà invece di abbassarne la soglia.
- **`UnlockedDamageHealthTest` legge costo e danno della Capocciata dalla bozza** invece di scriverli, così le riserve non lo toccano; le
  relazioni controllate (pari al costo no, +1 sì, uguaglianza per le altre risorse) restano le stesse.

## 8. Osservazioni fuori perimetro

- `StyleSupport.affordableAfter` legge ancora una HEALTH con `>=`: con d50 un bot può stimare pagabile una carta a salute pari al costo. Non
  cambia la legalità (motore e `BotView` la rifiutano) e non era nel perimetro; da guardare con la regia se serve.
- La last resort «Ne ho prese di peggio» non si gioca mai e Alzo la voce quasi mai: partite brevi (6,6 turni) e mazzo che non si esaurisce.

## 9. Non verificato

- Nessuna prova a mano nel client: il jar è per la prova del proprietario.
- Gli stili non euristici sono nel giro ma non sono criterio (D93); le loro quote sono nei riepiloghi.

## 10. Domande per il proprietario

1. Accetti lo **scostamento dichiarato** su Duccio–Mara (33,00%, 2 punti sotto D95) con la bozza finale (salute 115, costi 16 / 10 / 28 / 33)?
2. R1 e R2 si sono quasi annullate: tieni la bozza finale o torni alla K185 pura (salute 110, costi 15 / 9 / 26 / 30, Mara 33,91%, più vicina
   a 35 e con costi più bassi)? Gli altri numeri sono quasi gli stessi.
3. Salute spesa 63 a partita contro i 30–40 della scheda: si aggiorna la scheda o è un segnale per SB-20 e SB-21?
