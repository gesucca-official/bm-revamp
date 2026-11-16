# SB-17 — Fase A2: ricerca sugli starter e Sergio riprogettato

**16 novembre 2026.** Fase A2 di [SB-17](../../set-base-plan.md#sb-17-sb-18--personaggi-da-booster), da [D109](../../set-base-decisioni.md#decisioni-del-proprietario) (1) e (2). Solo proposta: codice, test e `bozza.json` non toccati. STOP per il proprietario.

> **Stato 1 (16/11, 13:35).** Ricerca di diagnosi fatta: 628,7 s di orologio su 900, bozza con la stessa impronta della Fase B. Prossimo: lettura e proposta.
>
> **Stato 2 (16/11, 14:10).** Proposta scritta; `git diff --check` e `check-links.py` verdi. STOP per il proprietario.

## 1. Ricerca di diagnosi (D109 (2))

`BenchMeasureTest#search` sui personaggi dei cinque starter, con gli stessi parametri della ricerca della Fase B: regole `d50`, 8 thread, i tre stili euristici, al massimo 25 generazioni, partenza starter e casuale, stessi semi (ricerca da 7100000, convalida 7900000–7900299), avversari tutti i mazzi della bozza (`4ee884cf…`, la stessa della Fase B). Misura esclusiva: **628,7 s su 900**. Evidenze in [a2-search](../../reports/set-base/sb-17/a2-search/search.md) (riepilogo, [JSON](../../reports/set-base/sb-17/a2-search/search.json), [tentativo](../../reports/set-base/sb-17/a2-search/attempt.json), [lanciatore](../../reports/set-base/sb-17/a2-search/run.ps1), [analisi](../../reports/set-base/sb-17/a2-search/analyze.py), che classifica le carte con l'ID della griglia).

Quota di convalida = vittorie / (vittorie + sconfitte) del mazzo vincitore («ultimo») su tutti gli avversari; «contro gli starter» esclude prova-sergio, specchio compreso. Sergio dalla [ricerca della Fase B](../../reports/set-base/sb-17/search.md).

| Personaggio | Partenza | Mazzo migliore | Contro gli starter | Lo starter | Archetipo proprio: starter → migliore | Archetipo altrui | Generiche e oggetti |
|---|---|---:|---|---:|---|---:|---:|
| Spazienzio | starter | 88,5% | 79,2–91,5% | 47,0% | 10 → 1 | 9 | 10 |
| Spazienzio | casuale | 95,4% | 90,3–98,6% | | 10 → 0 | 8 | 12 |
| Mara | starter | 95,6% | 90,7–96,5% | 53,4% | 10 → 4 | 2 | 14 |
| Mara | casuale | 88,2% | 79,8–91,4% | | 10 → 3 | 5 | 12 |
| Celestina | starter | 96,3% | 92,3–98,0% | 61,5% | 10 → 4 | 7 | 9 |
| Celestina | casuale | 92,1% | 88,2–97,5% | | 10 → 4 | 6 | 10 |
| Piera | starter | 99,4% | 97,5–100% | 52,7% | 10 → 2 | 2 | 16 |
| Piera | casuale | 77,3% | 70,5–79,3% | | 10 → 4 | 6 | 10 |
| Beppe | starter | 92,1% | 85,2–97,2% | 61,3% | 9 → 3 | 6 | 11 |
| Beppe | casuale | 99,5% | 98,7–99,8% | | 9 → 3 | 3 | 14 |
| *Sergio (Fase B)* | starter | 97,2% | 95,4–99,4% | 21,8% | 11 → 0 | 6 | 14 |
| *Sergio (Fase B)* | casuale | 92,9% | 89,7–94,0% | | 11 → 1 | 10 | 9 |

## 2. Lettura

**Il 95% viene dal pool, e vale per tutti.** Ogni personaggio, con un mazzo costruito, batte gli starter fra il 77% e il 99,5%: il criterio «il migliore al 65–70%» è superato da tutti, non solo da Sergio. I mazzi vincitori tengono al più 4 delle 9–11 carte d'archetipo proprie e le sostituiscono con carte altrui, oggetti e generiche.

**Che cosa ricorre** (mazzi vincitori delle 12 ricerche):

- **Estasi da Coca Etilene** (PIN-AR2, «spendi tutta la L, 18 più la L spesa»): 2 copie in **tutte le 10 ricerche dei personaggi diversi da Piera**. Per chi non ha L è un colpo da 18 senza costo: l'elemento singolo più forte del pool.
- **Sgommata** (MAR-AR2, 15 A: 25 CUT): in 7 ricerche su 12. Poi, sparse, Cinghiata, Un altro e arrivo, Smontiamo tutto, Chiave da tredici.
- **Oggetti** (Amaro, Panino, Ghiaccio, Tennents, Giubbotto): ciascuno in 7–9 ricerche su 12. Fra le generiche Sputo, Spintone e GABBIANO.
- **Le carte di Sergio negli altri mazzi:** Conto salato in 4 ricerche (8 HIT per 5 A, anche senza gettone), Ricatto e Oh, guarda là in 2, Malelingue in 1. Sono usabili, non inutili.

**Che cosa è proprio di Sergio.** Lo starter parte al 21,8% (gli altri fra 47% e 61,5%) e le sue carte d'archetipo spariscono del tutto (0–1 tenute, gli altri 1–4); nella Fase B le due ricerche tengono entrambe Battutina e **Frecciatina al volo**, non Mi informo. Contro i mazzi costruiti prova-sergio perde il 95–100%. Quindi: il pool spiega il 95%, ma **la debolezza dello starter di Sergio è sua** e va corretta sulle sue carte, come chiede D109 (1).

## 3. Proposta: Sergio A2

Tre interventi, tutti nei dati di `bozza.json` (nessuna classe Java nuova, nessun cambio di motore o bot: il passo `gettone` e l'«Annuncia» a due nomi esistono già).

| Slot | Oggi (Fase B) | Proposta A2 | Perché |
|---|---|---|---|
| CES-AR5 C ×2 | Fare il vago: 5 A, pr. 2, CUT ×0,5 e HIT ×0,75, +5 A | **«Lo sanno tutti»**: 15 A, pr. 1, **20 HIT** al bersaglio | il colpo proprio non condizionato; più debole di Sgommata (25 CUT con anticipo, stesso costo) e di Estasi; Fare il vago era giocata nel 34% e Sergio ha già due contromosse come difesa (D52 (1): nessuna parata pura) |
| CES-AR4 NC ×2 | Conto salato: 5 A, 8 HIT, **+12** col gettone | 5 A, 8 HIT, **+6** col gettone (14; 21 con la vulnerabilità) | meno danno nella condizione (D109 (1)); la base resta a 8 per non renderla più appetibile agli altri mazzi, dove già compare |
| CES-AR1 NC ×2 | Oh, guarda là: annuncia Conto salato o Malelingue | annuncia **Lo sanno tutti o Conto salato** | la ricerca trova di più (Malelingue è a copia singola, 21,7% di ricerche fallite) e il premio +15 A paga il colpo nuovo da 15 A |
| PG-CES | H 85, A 30, V 10 | invariata | la salute 85 è la riserva della Fase B: si tiene come partenza |

Rarità dei titoli invariata (C 1, NC 4, R 1): Lo sanno tutti prende il posto comune di Fare il vago. Ricatto, Lo sapevo e Malelingue invariate.

**Mazzo di prova rivisto** (20 carte, 2 copie): bound **Battutina e Frecciatina al volo** (quelle scelte da entrambe le ricerche; Mi informo, giocata nel 6,2%, resta nella collezione); basic e last resort invariate.

| Copie | Carta | Cambio |
|---:|---|---|
| 2 | Oh, guarda là | annuncio nuovo |
| 2 | Ricatto | — |
| 2 | Lo sapevo | — |
| 2 | Conto salato | +6 col gettone |
| 2 | **Lo sanno tutti** | nuova, al posto di Fare il vago |
| 1 | Malelingue | — |
| 1 | STORDIAMOTI HO DETTO | da 2 a 1: costa 10 V e Sergio parte con V 10, la seconda copia resta in mano |
| 1 | Sgambetto | — |
| 1 | Acqua in faccia | — |
| 2 | Tartaruga sul marciapiede | da 1 a 2: unica difesa rimasta |
| 1 | **Spintone** (GEN-18) | nuova nel mazzo, al posto di Scatto Repentino (3,4%): 7 HIT senza costo, già nella bozza |
| 1 | Santino della portinaia | — |
| 2 | Espresso del distributore | — |

11 d'archetipo, 6 generiche, 3 oggetti. Spintone non è fra le generiche della griglia per Sergio (D107): è la deviazione da approvare (domanda 4).

**Stima (dal listino, non misurata).** Sergio passa da circa 8 HIT a turno a circa 11–12: due colpi da 20 e uno Spintone in più, meno 12 HIT nella condizione di Conto salato che si avverava nel 4–22% delle giocate. Contro Spazienzio (38,7%) il margine verso il 65% è largo; contro Mara e Beppe (26%, 23%) il colpo dovrebbe bastare a entrare; **Celestina e Piera (3,6%, 7,2%) restano il rischio maggiore**: 28–31 punti sono molti per un solo colpo, e un'entrata nella soglia lì non è garantita nemmeno con le riserve. Lo specchio si accorcia (più danno, una difesa in meno): le patte dovrebbero scendere, ma il 14,4% di partenza con 16,2 turni e il mazzo esaurito nel 32% non danno margine.

## 4. Fase B2: criteri, riserve, budget

**Criteri** (D95 (2) e (4), patte dello specchio comprese per D51 e D109): sui soli euristici (D93) ogni incontro di Sergio con gli starter fra 35% e 65%; patte al massimo 10% in ogni incontro, **specchio compreso**; durata entro 12 turni fuori dallo specchio; invarianti e bound oltre il tetto a zero. Da guardare, non vincolanti: carte quasi sempre o quasi mai giocate, mazzo esaurito, `com` contro `com`.

**Riserve, scritte ora e applicate in quest'ordine**, al più una per giro, al più **2 giri di riserva** dopo il primo; si applica la prima la cui condizione vale sul giro appena fatto:

| # | Condizione | Correzione |
|---|---|---|
| R1 | due o più incontri sotto 35% | Lo sanno tutti 20 → **24 HIT** |
| R2 | ancora due o più incontri sotto 35% dopo R1 | Conto salato base 8 → **10 HIT** (la condizione resta +6) |
| R3 | un incontro oltre 65% | Lo sanno tutti costo 15 → **20 A** |
| R4 | patte dello specchio oltre 10% con le quote dentro, o un incontro oltre 65% dopo R3 | salute 85 → **80** |

Un solo incontro sotto 35% non fa scattare R1 né R2: si dichiara (D95 (3): poi si passa comunque). Le riserve non toccano le carte degli starter.

**Budget di orologio: 1.000 s**, fissato ora, misure esclusive come nella Fase B ([lanciatore](../../reports/set-base/sb-17/run.ps1), stessi 300 semi per cella e 12 stili letali):

| Voce | Tetto |
|---|---:|
| Fattibilità (4 semi) | 50 |
| Giro 1 | 200 |
| Due giri di riserva | 2 × 200 |
| Ricerca per mutazione di Sergio (stessi parametri), solo per contare le carte proprie tenute | 200 |
| Riserva | 150 |
| **Totale** | **1.000** |

Fuori budget: suite, fedeltà dei bot sul mazzo nuovo, contesto Spring, manifesti. Passo 0 e identità viva non servono se cambiano solo dati di bozza; con una classe Java tornano come nella Fase B, senza allargare il budget. La ricerca di Sergio è una lettura, non un cancello (sezione 5).

## 5. Il problema del pool: cosa comporta per il piano

Nessuna modifica alle carte degli starter, come chiede il prompt. Ma i dati dicono che:

1. **Il criterio dei mazzi costruiti (65–70% contro gli starter) oggi non è raggiungibile da nessuno.** Non va usato come cancello in SB-17 né in SB-18: per Sergio e Duccio vale la soglia minima D95 sullo starter o sul mazzo di prova, e la ricerca resta una lettura.
2. **Estasi da Coca Etilene** è il caso più netto (2 copie in 10 ricerche su 10): una carta d'archetipo che diventa un colpo gratuito per chi non ha la risorsa. È un tema per SB-19 e SB-20 (le carte d'archetipo giocate fuori dal loro personaggio), insieme a Sgommata e al peso degli oggetti, che i bot usano molto.
3. **Limite noto:** la ricerca trova ciò che i bot sanno giocare, e gli starter li giocano gli stessi bot: parte del 95% può venire dai bot, non solo dal pool.
4. Quando: filone dedicato prima di SB-19, o voce in ingresso a SB-19/SB-20 con questi dati. Raccomando la seconda: il pool non è finito (D95). Domanda 5.

## 6. Domande al proprietario

1. **Lo sanno tutti al posto di Fare il vago** (15 A, priorità 1, 20 HIT, comune ×2), o un settimo titolo d'archetipo tenendo Fare il vago? Raccomando la sostituzione.
2. **Conto salato 8 + 6 sul gettone** (da 8 + 12) e **Oh, guarda là che annuncia Lo sanno tutti o Conto salato**: va bene?
3. **Criteri, riserve R1–R4 e budget di 1.000 s** come nella sezione 4, con Celestina e Piera dichiarate come rischio maggiore?
4. **Mazzo di prova:** bound Battutina e Frecciatina al volo, fuori Mi informo e Scatto Repentino, STORDIAMOTI a 1, Tartaruga a 2, **Spintone** dentro (non fra le generiche della griglia per Sergio)?
5. **Pool:** voce in ingresso a SB-19/SB-20 con questi dati (raccomandato), o un filone dedicato prima di SB-18?
