# SB-18 — Fase B1e: giro esplorativo sulle leve di Duccio (rapporto)

**17 novembre 2026. Fase B1e di [D125](../../set-base-decisioni.md#decisioni-del-proprietario) (2), come la [B5e di SB-17](sb-17-b5e-report.md):
cinque copie complete della V3 della [Fase B](sb-18-b-report.md), ognuna su una leva sola (L5: due), «Ultimo colpo» fuori da tutte
(D125 (3)), bot e `bozza.json` invariati, nessuna riserva, solo dati. Le copie sono in [sb-18/b1e/](sb-18/b1e/).**

## Esito

**Una leva basta ad arrivare in zona D95: i costi.** Contro i cinque starter, sui soli euristici, la quota media di Duccio è 92,1% nella V3 e:
**L1** (salute 85) 60,0% (**−32,1 punti**), **L2** (1 HIT per HEALTH) 80,9% (**−11,2**), **L3** (costi doppi) 44,7% (**−47,4**), **L4** (niente cure
proprie) 88,0% (**−4,2**), **L5** (L1 + L3) 11,5% (**−80,6**, quasi la somma di −32,1 e −47,4: nella zona le due leve si sommano). Incontri fuori D95: V3 5, L1 2,
L2 5, **L3 1**, L4 5, L5 5 (L5 fuori per eccesso: Duccio perde). **L3 ha un solo incontro fuori, Mara al 26,3%** (8,7 punti sotto 35);
L1 ne ha due (Spazienzio 69,0%, Celestina 71,6%). Le attese scritte prima erano troppo prudenti su L1, L3 e L2 (§ 5). Raccomandazione per la B2 (§ 6): **V3 con i costi
a circa ×1,85 (Nocche 15 H, E allora? 9 H, Capocciata 26 H, Testa dura 30 H), stessi HIT, salute 110**, con la riserva scritta prima; ma la finestra D95 non lascia margine
a Mara e a Spazienzio, e va detto (domande 1–3). Budget **391 s su 600**; violazioni, turni senza mosse e bound oltre il tetto a zero in tutti i giri.

## 1. Le varianti e i numeri, scritti prima di misurare

Partenza: la V3 (salute 110, A 15; Nocche sbucciate 8 H: 18 HIT, E allora? 5 H: ×0,5 e 8 HIT, Capocciata 14 H: 26 HIT, Testa dura 16 H: 30 HIT,
senza «Ultimo colpo»; Te lo spiego io 4 HIT, +6 H / +2 H; Incassare +3 H; Prima io +3 H). Il resto del mazzo e di `bozza.json` non cambia.

**Da dove vengono i numeri.** Il listino ([D33](../../set-base-decisioni.md#decisioni-del-proprietario) (2) e (3)): una carta gratuita vale circa 6–8 HIT;
le carte a costo della 1.6b stanno su circa **7 HIT di base più 1,5 HIT per unità di costo pesata** (Mattone 15 V: 7 + 1,5 × 11,25 = 24 HIT; GARGANTUESCO 25 V:
7 + 1,5 × 18,75 = 35 contro i 34 stampati). Con HEALTH a peso 1 la V3 sta sul listino (Nocche 8 H → 19 contro 18; Capocciata 14 H → 28 contro 26; Testa dura
16 H → 31 contro 30), e non basta: la HEALTH è anche la vita, e in 6 turni di partita Duccio ne ha ancora da spendere. Dalla Fase B (§ 5 del suo rapporto,
V3): spesa 37,2, recuperata 7,0, persa per danni 59,3, partite di 6,3 turni; a fine partita gli resta in media **circa 20 di salute** (110 − 37 + 7 − 59). Ogni
leva che toglie a Duccio più di quel margine lo porta in zona 50%; per questo le dimensioni sotto sono misurate in «salute equivalente» sulla V3.

| | Leva | Numeri | Perché questi | Peso stimato sulla V3 |
|---|---|---|---|---|
| **L1** | salute di partenza | **85** (da 110), A 15 | la cima degli starter (Sergio 85, Beppe 80, Spazienzio 75, Mara 70) | −25 di salute, quasi tutto il margine di 20 |
| **L2** | HIT per HEALTH | **1 HIT per HEALTH sopra una base gratuita di 7 HIT**: Nocche 8 H → **15** HIT, Capocciata 14 H → **21**, Testa dura 16 H → **23**; costi e E allora? (8 HIT) invariati | meno del 1,5 del listino, che per la HEALTH-vita è generoso; 7 è la base di D33 (3) | −13 HIT a partita (0,91 × 3 + 1,06 × 5 + 0,71 × 7), circa un quinto del danno da HIT |
| **L3** | costi | **il doppio, stesso danno**: Nocche **16** H, E allora? **10** H, Capocciata **28** H, Testa dura **32** H | RP-2 le tiene in mano a salute pari al costo, quindi a salute bassa i colpi grandi restano fermi, e il bot prudente ne gioca meno | +37 di spesa a parità di giocate (valore 37,2 della V3), meno per le giocate che i bot rinunciano a fare |
| **L4** | cure | **niente recupero di salute proprio**: Prima io senza +3 H (solo consuma), Incassare senza +3 H, Te lo spiego io senza premio (resta caricamento da 4 HIT con la ricerca); gli oggetti del mazzo (Panino, Ghiaccio, Fasciatura) non sono di Duccio e restano | è tutto ciò che il suo set ricarica da solo | −4/−5 di salute a partita (le cure proprie pesano circa 0,3 × 3 + 0,59 × 4 + 0,16 × 3 sui 7 recuperati) |
| **L5** | **L1 + L3** | salute **85** e costi **doppi** (16 / 10 / 28 / 32), HIT della V3 | scelta prima di misurare: sono le due leve più grosse in salute equivalente (−25 e circa −37); L2 vale −13 e L4 −5, quindi non cambierebbero da sole la zona | −25 e −37: probabile sovra-correzione |

**Scelte di forma.** Per costruzione tutte le varianti partono dalla V3 con sostituzioni di testo esatte (`sb-18/b1e/bozza-l1.json`…`l5.json`); cambiano solo i
numeri sopra, le descrizioni stampate (codice di slot compreso) e i campi `gains`/`damageAmount` coerenti. Il lanciatore `sb-18/run.ps1` ha il parametro
`-Variant` limitato a `c`, `v1`, `v2`, `v3` e il parametro `-Draft`: si usa `-Variant v3 -Draft <copia> -OutputRoot <cartella per variante>`, così
nome del giro e file del tentativo non si scontrano, senza toccare il lanciatore.

**Attese scritte prima di misurare** (quota media di Duccio contro i cinque starter, soli euristici; la V3 sta a 92,1%): L1 fra −10 e −25 punti, L2 fra −4 e −10,
L3 fra −10 e −25, L4 meno di −3, L5 sotto il 50% (sovra-correzione possibile, fino a vicino a zero). Se L5 supera di molto il bersaglio, la B2 sceglie un
punto fra una leva e L5, non L5; la regola per sceglierlo è nella § 6.

## 2. Fattibilità

Le cinque copie si caricano e si giocano: 4 semi per cella, 3.456 partite per variante, 0 violazioni, 0 turni senza mosse legali, 0 bound oltre il tetto, 0 pagamenti a zero.
**Nessun rifiuto del caricatore**, anche per la ricerca senza premio in HEALTH di L4. Nessuna correzione al banco, al lanciatore o a `server/src/main`. (Con 4 semi per
cella le quote sono rumore: non si leggono.)

## 3. Quota / patte / turni (soli euristici, 259.200 partite per giro, criteri D95)

Quota di Duccio sulle decisive, patte, turni medi; 300 semi per cella, un solo giro per variante, stessi semi e stili della Fase B. **Grassetto: incontro fuori D95** (quota fra 35% e 65%,
patte ≤ 10%, durata ≤ 12 turni fuori dallo specchio). La V3 è il giro della Fase B, non rilanciato ([riepilogo](sb-18/b/round-v3.md)). Specchio: la quota non conta.

| Incontro | V3 (controllo) | L1 salute 85 | L2 HIT per H | L3 costi ×2 | L4 senza cure | L5 L1 + L3 |
|---|---|---|---|---|---|---|
| Duccio–Duccio | 48,58% / 6,46% / 6,76 | 47,04% / 8,50% / 5,21 | 50,79% / 5,93% / 7,67 | 50,62% / 8,99% / 5,95 | 50,76% / 7,72% / 6,72 | 50,47% / 8,96% / 4,82 |
| Duccio–Spazienzio | **93,49%** / 0,07% / 5,82 | **69,02%** / 1,52% / 6,06 | **86,55%** / 0,39% / 6,80 | 55,43% / 1,44% / 6,63 | **89,90%** / 0,23% / 5,84 | **17,09%** / 1,48% / 6,96 |
| Duccio–Mara | **85,30%** / 0,26% / 6,38 | 40,09% / 1,93% / 6,20 | **68,89%** / 1,91% / 7,68 | **26,29%** / 2,90% / 6,89 | **79,38%** / 1,27% / 6,48 | **4,10%** / 0,79% / 6,18 |
| Duccio–Celestina | **93,56%** / 2,84% / 6,72 | **71,62%** / 5,72% / 6,66 | **83,01%** / 4,79% / 8,12 | 49,52% / 4,79% / 7,10 | **90,45%** / 3,40% / 6,81 | **12,56%** / 2,78% / 6,99 |
| Duccio–Piera | **93,58%** / 0,36% / 6,15 | 58,46% / 1,77% / 6,54 | **83,33%** / 1,32% / 7,41 | 41,84% / 3,60% / 7,32 | **89,90%** / 0,59% / 6,21 | **9,28%** / 1,95% / 7,25 |
| Duccio–Beppe | **94,68%** / 0,06% / 5,29 | 60,77% / 0,71% / 5,64 | **82,94%** / 0,30% / 6,22 | 50,39% / 1,28% / 6,21 | **90,11%** / 0,22% / 5,37 | **14,38%** / 0,55% / 6,19 |
| **Incontri fuori D95** | 5 | 2 | 5 | **1** | 5 | 5 |
| Punti oltre la soglia (somma) | 135,61 | 10,64 | 79,72 | **8,71** | 114,74 | 117,59 |
| Quota media sui cinque starter | 92,12% | 59,99% | 80,94% | 44,69% | 87,95% | 11,48% |
| Quota media, tutti gli stili | 88,78% | 59,35% | 76,81% | 46,49% | 83,52% | 14,74% |

Dettaglio fuori D95: L1 Spazienzio +4,02, Celestina +6,62; L3 Mara −8,71; L2 e L4 tutti gli starter oltre 65 (L2 da +3,89 di Mara a +21,55 di Spazienzio); L5 tutti
sotto 35 (da −30,9 di Mara a −17,9 di Spazienzio). Violazioni 0, turni senza mosse legali 0, bound oltre il tetto 0 in tutti i giri. Patte dello specchio: 5,9–9,0% in tutte
(L3 8,99% e L5 8,96% vicino al 10%); durata 4,8–8,1 turni, mai oltre 12. Esiti completi: [L1](sb-18/b1e/round-l1.md), [L2](sb-18/b1e/round-l2.md),
[L3](sb-18/b1e/round-l3.md), [L4](sb-18/b1e/round-l4.md), [L5](sb-18/b1e/round-l5.md); confronto in [compare.md](sb-18/b1e/compare.md) (`sb-18/analyze.py compare`).

## 4. Letture della § 5 della Fase B, per variante

Soli euristici, per partita e per posto di Duccio (170.100 posti-partita per variante); definizioni come nella § 5 della Fase B. «Ultimo colpo» è fuori da tutte: i suicidi
per costo non esistono (RP-2) e i pagamenti a zero sono 0.

| Lettura | V3 | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|---|
| Mazzo esaurito (rif. Sergio B6: 26,7%) | 0,03% | 0,01% | 0,11% | 0,07% | 0,00% | 0,07% |
| Turni per partita | 6,27 | 5,93 | 7,37 | 6,58 | 6,31 | 6,17 |
| Salute spesa a partita (scheda: 30–40) | 37,20 | 33,03 | 41,39 | **60,33** | 36,37 | 47,08 |
| Salute recuperata a partita | 6,99 | 9,18 | 9,32 | 13,13 | 2,78 | 17,21 |
| Salute persa per danni a partita | 59,27 | 53,39 | 64,45 | 56,94 | 58,02 | 52,68 |
| Turni di Duccio con salute sotto 30 | 14,12% | 31,78% | 19,52% | 33,69% | 15,63% | 46,31% |
| Bound sul totale delle giocate | 3,07% | 2,89% | 3,63% | 5,44% | 3,33% | 5,55% |
| **Bound sulle giocate con salute sotto 30** | 6,53% | 5,44% | 7,51% | 12,21% | 8,03% | 10,67% |
| Last resort: partite in cui è giocata | 0,00% | 0,00% | 0,01% | 0,00% | 0,00% | 0,00% |
| Pagamenti a zero (morti pagando) | 0 | 0 | 0 | 0 | 0 | 0 |
| Ricerche di Te lo spiego io fallite | 2,05% | 2,51% | 4,37% | 4,84% | 2,71% | 4,24% |

**Giocate a partita delle carte a costo HEALTH** (salute spesa a partita dalla carta fra parentesi):

| Carta | V3 | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|---|
| Nocche sbucciate | 0,91 (7,3) | 0,84 (6,7) | 1,01 (8,1) | 0,80 (12,8) | 0,92 (7,3) | 0,62 (9,9) |
| E allora? | 0,74 (3,7) | 0,66 (3,3) | 0,87 (4,3) | 0,65 (6,5) | 0,76 (3,8) | 0,54 (5,4) |
| Capocciata | 1,06 (14,8) | 0,92 (12,9) | 1,19 (16,7) | 0,82 (22,9) | 1,04 (14,6) | 0,61 (17,2) |
| Testa dura | 0,71 (11,4) | 0,63 (10,2) | 0,77 (12,3) | 0,57 (18,1) | 0,67 (10,7) | 0,45 (14,5) |
| Prima io (basic) | 0,16 | 0,29 | 0,24 | 0,48 | 0,17 | 0,72 |
| Te lo spiego io | 0,59 | 0,56 | 0,72 | 0,70 | 0,51 | 0,70 |

**Per stile** (aggressivo, prudente, risorse; tempi sommati): la salute spesa a partita sta entro 1 punto fra gli stili in ogni variante (V3 37,6 / 37,6 / 37,9; L1 33,6 / 34,0 / 33,8;
L2 41,9 / 42,1 / 42,3; L3 62,5 / 62,7 / 61,7; L4 37,0 / 36,9 / 36,9; L5 49,9 / 49,5 / 48,7). Il prudente gioca di più E allora? e meno Testa dura in tutte (per esempio L3: Testa dura 0,61 /
0,49 / 0,67). Nessuno stile evita il costo; dettaglio nel JSON di ogni giro.

Le letture dicono, senza spiegarlo oltre: i costi doppi spendono 60 di salute a partita (non 74: i bot giocano meno i colpi grandi, 0,57–0,82 a partita contro 0,71–1,06) e portano Duccio
sotto 30 di salute per un terzo dei turni; **nemmeno così la HEALTH esaurisce il mazzo** (sotto lo 0,2% ovunque, partite di 5,9–7,4 turni) e le bound restano il 3–6% delle giocate (10–12%
a salute sotto 30 in L3 e L5). L2 allunga la partita di un turno (7,37) senza spostare molto la quota. La salute recuperata cresce nelle varianti con meno salute (più oggetti giocati con la
basic: Prima io da 0,16 a 0,72 giocate) e scende a 2,8 solo in L4.

## 5. Quanto sposta ogni leva

Quota media contro i cinque starter, soli euristici, rispetto alla V3 (92,12%). Attese scritte nella § 1, in punti:

| Leva | Quota media | Spostamento | Attesa scritta | Per unità di «salute equivalente» della § 1 | Logit per unità |
|---|---|---|---|---|---|
| L1 salute 85 (−25) | 59,99% | **−32,13** | −10…−25 | 1,29 per punto di salute | da −0,07 a −0,10 per punto di salute, uniforme fra gli starter |
| L2 1 HIT per H (−13 HIT a partita) | 80,94% | **−11,18** | −4…−10 | 0,86 per HIT | — |
| L3 costi ×2 (+37 di spesa a parità di giocate) | 44,69% | **−47,43** | −10…−25 | 1,28 per punto di spesa stimata (la spesa reale sale di 23) | da −2,4 a −3,0 per +100% di costi |
| L4 senza cure (−5 di salute) | 87,95% | **−4,18** | meno di −3 | 0,84 | — |
| L5 = L1 + L3 | 11,48% | **−80,64** | sotto il 50% | somma delle due: −79,56 | |

Le attese erano troppo prudenti: la mia stima in «salute equivalente» pesava ogni punto circa 0,5 punti di quota, nella zona 92 → 45 ne pesa circa 1,3 (salute e costi) e 0,85 (HIT e cure).
Le leve non sono equivalenti fra loro: i costi pesano più della salute di partenza (47 contro 32) anche se spendono solo 23 di salute in più, perché a salute bassa RP-2 ferma i colpi grandi e il
bot ripiega sulle bound (12% delle giocate a salute sotto 30 contro 6,5%). **Mara è l'incontro più sensibile alle leve sulla salute** (L1 −45 punti contro −24 di Spazienzio; L3 −59 contro −38). Una lettura
plausibile, non misurata: contro la CUT di Mara le difese sull'HIT di Duccio (Incassare, E allora?) valgono poco, e ogni punto di salute pesa di più. La somma di L1 e L3 è quasi additiva (−79,6 prevista contro −80,6 misurata), il che
rende utile interpolare, ma a L5 si è già alla coda (11%): oltre non si legge più nulla.

## 6. Raccomandazione per la Fase B2

**Candidato: la V3 con i costi a circa ×1,85 e nient'altro.** Nocche sbucciate **15** H (da 8), E allora? **9** H (da 5), Capocciata **26** H (da 14), Testa dura **30** H (da 16); HIT, salute 110, A 15, cure e Te lo spiego io
come nella V3; «Ultimo colpo» fuori (D125 (3)).

**Perché i costi e non la salute.** È la leva dell'identità (D27, D47: «si fa male dandole»); da sola porta la media a 44,7% con un solo incontro fuori (L1 ne ha due, Spazienzio e Celestina oltre 65). Ha però una pendenza meno uniforme
fra starter (+100% di costi: Mara −3,0 logit, Spazienzio −2,4), quindi lo scarto Mara–Spazienzio cresce da 9 a 29 punti: è il motivo del margine nullo qui sotto. Non servono L2 (11 punti, costa le giocate) né L4 (4 punti: le cure
sono parte della lettura «la salute torna giocando il suo gioco» e sono in mano a poche giocate).

**Interpolazione, con l'ipotesi forte.** Fra V3 (×1) e L3 (×2), lineare in logit per ogni starter, il fattore ×1,85 dà: Spazienzio 64,2%, Mara 35,2%, Celestina 59,5%, Piera 53,0%, Beppe 60,9% (media 54,6%).
Sono **tutti dentro 35–65, ma Mara e Spazienzio a 0,8 punti dal bordo**: la finestra dei 30 punti è larga quanto lo scarto Mara–Spazienzio (circa 29 punti a ×1,85), quindi basta un errore di
interpolazione di un punto per uscire. Fattore ×1,8 (Nocche 14, E allora? 9, Capocciata 25, Testa dura 29): Mara 38,4%, Spazienzio 67,0% (fuori); ×1,9 (15 / 10 / 27 / 30): Mara 32,0% (fuori). Il punto è uno solo.

**Riserve scritte ora, per la B2** (come la R1 di SB-17, D34 (5)): **R1: fattore dei costi ±0,1** (Nocche ±1, E allora? ±1, Capocciata ±2, Testa dura ±3), una volta sola, nel verso che porta la media verso il 50%
(−0,1 se Spazienzio supera 65, +0,1 se Mara scende sotto 35; se i due sono fuori insieme, nessuna riserva: è un limite della finestra, domanda 2). Un passo vale circa 6 punti sulla media (dall'interpolazione: da 57,8% a 51,3%
fra ×1,8 e ×1,9). **R2: salute ±5** solo se R1 non basta o per ridurre lo scarto fra Mara e gli altri (Mara pesa 0,086 logit per punto, Spazienzio 0,075); ±5 vale circa ±10 punti attorno al 50%.
La ±10 di D34 (5) qui sarebbe troppo grossa (circa ±19 punti attorno al 50%) e non si dà. Nessuna riserva su HIT né su cure.

**Prima della B2 un passo di taratura?** Con una sola interpolazione fra due punti e nessun margine, la raccomandazione è **un giro piccolo prima della B2** (Fase B1f: ×1,7 / ×1,85 / ×2 sulla V3, 3 varianti, circa 250 s, solo dati), oppure aprire la B2 con
quel giro dentro la sua prima misura. La regia sceglie con te (domanda 1). I numeri esatti per la B1f si scrivono prima di misurare.

## 7. Codice toccato

**Nessun file di `server/src/main`, nessuna modifica al banco `Sb18MeasureTest` né al lanciatore `run.ps1`.** Il lanciatore ha `-Variant` limitato a `c|v1|v2|v3` e `-Draft` libero: si è usato
`-Variant v3 -Draft <copia> -OutputRoot <cartella per variante>`, così i file di tentativo non si scontrano (nome del giro `round-v3` in ogni cartella; i riepiloghi nel repository sono rinominati `round-lN`).
Solo dati: [sb-18/b1e/](sb-18/b1e/) (cinque bozze, cinque riepiloghi, `compare.md`). `bozza.json`, `b/bozza-v3.json` e gli altri documenti non sono toccati; il passo 0 d'identità non serve, perché il banco non è cambiato.

## 8. Verifiche

`git diff --check` (anche sui file nuovi, con `git add -N`), `check-links.py` (397 file, 0 rotti) e `check-rules.py`: verdi. `./scripts/build.ps1 -Task Test -Offline`: 896 test, 0 falliti, 0 errori, 22 saltati
(fra cui `Sb18MeasureTest#round`, che gira solo con `-Dsim.sb18Out`), client 37/37, con `bozza.json` invariata. Nessuna identità viva né contesto Spring né passo 0: `server/src/main` e il banco non cambiano
(`git diff --stat` mostra solo documenti e dati).

## 9. Budget, scelte prese, non verificato

**Budget.** Fattibilità 16,3 + 7,3 + 7,1 + 7,2 + 7,2 = 45,2 s; giri 56,6 + 79,3 + 73,1 + 69,6 + 66,7 = 345,4 s; totale **390,6 s su 600** (il primo giro include la compilazione a freddo). Mai due Maven o misure insieme
(nessun processo `java` prima dei giri; il lancio dei cinque giri è una sola catena sequenziale).

**Scelte prese.** (1) Il riferimento V3 è il giro della Fase B, non rilanciato: stessi semi e stessi stili, stesso codice. (2) L2 lascia E allora? a 8 HIT (non è nominata nella proposta) e L3 la raddoppia. (3) L4 tocca solo le cure
proprie di Duccio, non gli oggetti del mazzo (Panino, Ghiaccio, Fasciatura, di bozza). (4) L5 = L1 + L3 con i numeri pieni delle due, non a mezza forza, perché si possa leggere l'additività; sovra-corregge, e il confronto ne dà il valore. (5) L'interpolazione della § 6 è una stima,
non una misura.

**Non verificato.** Qualsiasi punto fra V3 e L3 (la § 6 è una stima); la sensibilità a salute e costi insieme in zona intermedia; l'effetto con i bot di fine corsa (`com`: media L3 60,2%, già più alta degli euristici); le difese contro CUT (Mara) come leva (non misurata); il tetto
D36 su Duccio con la banca bound; la prova del proprietario. Nulla di tutto ciò è un criterio di questo giro.

**Cosa giudica il proprietario.** Se i costi (non la salute) sono la leva giusta per Duccio, e se accetta uno scostamento su Mara se la finestra non basta.

## 10. Domande al proprietario

1. **Giro di taratura prima della B2?** Il candidato è un'interpolazione con margine di 0,8 punti a Mara e Spazienzio. Raccomandazione: **sì, una Fase B1f piccola** (×1,7, ×1,85, ×2 sulla V3, 250 s) e poi B2 sulla variante che vince; in alternativa la B2 parte con il candidato ×1,85 e le riserve R1 e R2 e il rischio di un secondo giro.
2. **Se la finestra D95 non basta** (Mara sotto 35 quando Spazienzio è sotto 65, o l'inverso), si accetta lo scostamento dichiarato su un incontro, come per Celestina in D122? Raccomandazione: sì, fino a 5 punti, scritto nel registro prima della B2.
3. **Le cure restano** (Prima io +3, Incassare +3, premio del caricamento +6 / +2) o escono come in L4? L4 sposta solo 4 punti: raccomandazione, restano; sono la lettura «la HEALTH torna giocando il suo gioco» e non pesano sulla quota.
4. **Le patte dello specchio** salgono con i costi (V3 6,5%, L3 9,0%, L5 9,0%): il candidato è sotto 10%, ma il margine si riduce. Si accetta, o si richiede una riserva sulle patte?
