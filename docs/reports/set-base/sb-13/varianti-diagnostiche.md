# SB-13 — Varianti diagnostiche

Varianti usate per scegliere le correzioni dei giri del Tossico, oppure per controllare i bot prima di toccare una carta. **Nella bozza c'è solo
ciò che è indicato come giro.** Ogni variante è generata in `tmp/sim/sb13/var/` dalla bozza del passo precedente con uno script che cambia
anche i testi (costo, danno nominale, guadagni), perché i bot li leggono; il JSON è riscritto con l'indentazione di Python, quindi lo SHA-256
è diverso da quello di `bozza.json` anche a parità di contenuto. Le bozze dei giri 1 e 2 sono in [`bozze/`](bozze/); quella del giro 3 è
`server/src/test/resources/set-base/bozza.json` (SHA-256 `1c1d4a62…254bcc1e`), con lo stesso contenuto della variante `x2-rasch7`
(controllato confrontando i due JSON).

Banco SB-7 (`BenchMeasureTest#matrix`, banco sb-7/1), mazzi `starter-tossico`, `starter-spazienzio` e `starter-mara` (sei incontri), stili
aggressivo, prudente, risorse e com (16 coppie), posti alternati, `-Dsim.strict=true`. Matrici dei giri: 2000 partite per cella, semi
7.000.000–7.001.999; varianti: 1000 per cella, semi 7.000.000–7.000.999. **Nessun invariante violato in nessuna variante.** Quota del
Tossico sulla somma delle 16 coppie, Wilson al 95%; fra parentesi le 9 coppie dei tre stili euristici. Mazzo esaurito: su tutte le partite
del Tossico, metà delle quali sono lo specchio.

**Controllo degli starter base.** In ogni variante e in ogni giro la cella Spazienzio contro Mara è identica: 7557 vittorie, 6754 sconfitte e
1689 patte a 1000 partite per cella; a 2000, le 48 celle dei tre incontri fra base coincidono una per una con la matrice approvata di SB-12a.

## Giri

| Variante | Modifica | SHA-256 | Tossico contro Spazienzio (senza com) | Tossico contro Mara (senza com) | Specchio | Turni T–S / T–M / T–T | Mazzo del Tossico esaurito |
|---|---|---|---|---|---|---|---|
| giro 1 | bozza della griglia, salute 85 | `cc93a90b…8e43fd67` | 0,483 [0,477–0,488] (0,508) | 0,403 [0,397–0,408] (0,299) | 0,503, patte 27% | 13,8 / 13,2 / 17,6 | 58% |
| giro 2 | T 20, salute 80, Tossicone 8 | `115d7771…8201ba7b` | 0,563 [0,557–0,569] (0,594) | 0,508 [0,502–0,514] (0,443) | 0,510, patte 24% | 12,7 / 12,1 / 16,6 | 50% |
| giro 3 | Raschiare +7 T (bozza finale) | `1c1d4a62…254bcc1e` | 0,529 [0,523–0,535] (0,558) | 0,479 [0,474–0,485] (0,412) | 0,507, patte 22% | 12,8 / 12,2 / 16,6 | 51% |

## Giro 1 → giro 2: le leve

Base: la bozza del giro 1 (starter della griglia, salute 85).

| Variante | Modifica | SHA-256 | Tossico contro Spazienzio (senza com) | Tossico contro Mara (senza com) | Specchio | Turni T–S / T–M / T–T | Mazzo del Tossico esaurito |
|---|---|---|---|---|---|---|---|
| v12-t15 | T iniziale 10 → 15 | `f0ea43fd…74af9c75` | 0,518 [0,510–0,526] (0,537) | 0,462 [0,454–0,470] (0,377) | 0,496, patte 27% | 13,6 / 13,1 / 17,6 | 58% |
| v1-t20 | T iniziale 10 → 20 | `33a1e3f9…46fab899` | 0,569 [0,560–0,577] (0,589) | 0,531 [0,522–0,539] (0,467) | 0,503, patte 25% | 13,5 / 13,0 / 17,5 | 58% |
| v2-h95 | HEALTH 85 → 95 | `0711211c…87612efc` | 0,608 [0,600–0,616] (0,651) | 0,578 [0,570–0,586] (0,540) | 0,498, patte 26% | 14,2 / 14,0 / 18,5 | 63% |
| v3-cost8 | costo 10 → 8 T su Meth, Tossicone, Riflessi, travaso | `43e800a5…03adb7ab` | 0,542 [0,534–0,550] (0,572) | 0,478 [0,470–0,486] (0,407) | 0,496, patte 28% | 13,4 / 12,9 / 17,6 | 57% |
| v4-grab8 | basic +5 → +8 T | `8fc76d86…3567dc15` | 0,538 [0,530–0,546] (0,576) | 0,473 [0,465–0,481] (0,408) | 0,493, patte 26% | 13,4 / 12,9 / 17,5 | 57% |
| v5-cough8 | Tossicone 5 → 8 POISON | `6e2d47c2…1692315a` | 0,539 [0,531–0,547] (0,576) | 0,476 [0,468–0,484] (0,410) | 0,494, patte 25% | 13,3 / 12,7 / 17,2 | 54% |
| v6-meth18 | Meth 15 → 18 HIT | `06a6f95d…a0b8c4e3` | 0,515 [0,506–0,523] (0,543) | 0,442 [0,433–0,450] (0,355) | 0,497, patte 25% | 13,5 / 13,0 / 17,1 | 55% |
| v7-t20h80 | T 20, HEALTH 80 | `09dbb072…be94783c` | 0,502 [0,494–0,510] (0,511) | 0,433 [0,425–0,441] (0,332) | 0,504, patte 26% | 13,2 / 12,6 / 17,1 | 55% |
| v8-t20meth18cough8 | T 20, Meth 18, Tossicone 8 | `9322cbff…1ade7cc9` | 0,657 [0,649–0,664] (0,703) | 0,647 [0,639–0,655] (0,654) | 0,507, patte 23% | 12,6 / 12,2 / 16,6 | 50% |
| v9-t20h80m18 | T 20, HEALTH 80, Meth 18 | `8354bb90…c3d5fde4` | 0,535 [0,527–0,543] (0,552) | 0,475 [0,467–0,483] (0,394) | 0,502, patte 24% | 12,9 / 12,4 / 16,5 | 52% |
| v10-t20h75m18c8 | T 20, HEALTH 75, Meth 18, Tossicone 8 | `bcdba8b7…a276d87f` | 0,522 [0,514–0,530] (0,544) | 0,449 [0,441–0,457] (0,366) | 0,500, patte 23% | 12,2 / 11,5 / 15,4 | 43% |
| v11-t20h80c8 | **T 20, HEALTH 80, Tossicone 8** (giro 2) | `fc951a74…08b19be3` | 0,561 [0,553–0,569] (0,587) | 0,508 [0,500–0,516] (0,447) | 0,506, patte 24% | 12,7 / 12,1 / 16,6 | 51% |
| v13-t20h80cost8 | T 20, HEALTH 80, costi 8 T | `883811dc…510e7692` | 0,559 [0,551–0,567] (0,579) | 0,508 [0,499–0,516] (0,435) | 0,507, patte 26% | 12,9 / 12,4 / 17,0 | 54% |
| v14-t20h75m20c10 | T 20, HEALTH 75, Meth 20, Tossicone 10 | `96e75075…e9171290` | 0,573 [0,565–0,581] (0,607) | 0,510 [0,502–0,519] (0,462) | 0,494, patte 22% | 11,7 / 11,0 / 14,4 | 33% |

Lettura: T iniziale e salute sono le leve più forti; il danno delle carte pagate in T conta meno, perché le carte restano morte in mano
finché manca la T. Meth 18 e Tossicone 10 porterebbero il prezzo della T oltre 0,5 danni per T (D34), Tossicone 8 no. Scelta: **T 20, salute
80, Tossicone 8** (`v11`, stesso contenuto della bozza del giro 2). La durata si sposta poco con questi numeri; lo specchio resta sopra 16 turni.

## Controllo dei bot (punto 7), sul giro 2

Ogni variante toglie dallo starter una carta complessa e mette al suo posto una carta semplice. **Solo diagnostica: nessuna di queste
sostituzioni è nella bozza.** Spintone non è una carta del Tossico; serve come colpo semplice da un'unità.

| Variante | Modifica | SHA-256 | Tossico contro Spazienzio (senza com) | Tossico contro Mara (senza com) | Specchio | Turni T–S / T–M / T–T | Mazzo del Tossico esaurito |
|---|---|---|---|---|---|---|---|
| b1-noDrain | travaso (TOS-AR5) → Fasciatura | `0f9401ad…9831ff64` | 0,565 [0,557–0,574] (0,644) | 0,519 [0,511–0,528] (0,517) | 0,503, patte 24% | 13,1 / 12,7 / 17,6 | 57% |
| b2-noAmph | Riflessi (TOS-AR4) ×2 → Spintone ×2 | `d0b95165…429e1da6` | 0,613 [0,605–0,621] (0,652) | 0,560 [0,552–0,568] (0,530) | 0,491, patte 25% | 11,7 / 11,1 / 14,6 | 38% |
| b3-noPM | Metabolismo (TOS-AR3) ×2 → Spintone ×2 | `51228660…a1c479bd` | 0,613 [0,605–0,621] (0,646) | 0,557 [0,549–0,565] (0,515) | 0,507, patte 25% | 11,6 / 11,0 / 13,8 | 32% |
| b4-noGrab | Grab ×2 → Spintone ×2 | `dc78144f…e4356a7f` | 0,604 [0,596–0,612] (0,641) | 0,551 [0,543–0,559] (0,520) | 0,489, patte 25% | 12,3 / 11,8 / 15,7 | 44% |
| b5-bo3 | bound TOS-BO3 al posto di TOS-BO2 | `9601a558…f5444d38` | 0,511 [0,502–0,519] (0,541) | 0,468 [0,460–0,476] (0,413) | 0,501, patte 22% | 12,9 / 12,2 / 16,7 | 51% |
| b6-noCocktail | Mescolone (OGG-04) → Fasciatura | `8f5d618a…05680378` | 0,638 [0,630–0,646] (0,647) | 0,590 [0,582–0,598] (0,519) | 0,512, patte 33% | 13,6 / 13,1 / 19,3 | 57% |
| b7-noSteal | Steal → Fasciatura | `3398fc2c…a007bd44` | 0,611 [0,603–0,619] (0,654) | 0,566 [0,558–0,574] (0,532) | 0,509, patte 25% | 13,0 / 12,6 / 17,1 | 54% |

Lettura: in mano a questi bot ogni carta complessa del Tossico vale meno di un colpo semplice, come per gli starter base in SB-12a. Il
Mescolone costa di più (circa 8 punti): il suo timer toglie tutte le immunità, compresa quella del Tossico, e i bot non lo prevedono. Il
travaso quasi non si gioca (0,01 a partita con gli stili euristici). Togliere la bound di T peggiora il Tossico di circa 5 punti: la
generatrice serve. Nessuna carta è indebolita.

## Giro 2 → giro 3: leve contro Mara e durata, scartate

| Variante | Modifica | SHA-256 | Tossico contro Spazienzio (senza com) | Tossico contro Mara (senza com) | Specchio | Turni T–S / T–M / T–T | Mazzo del Tossico esaurito |
|---|---|---|---|---|---|---|---|
| r1-a45 | A iniziale 35 → 45 | `02b611af…dad81d74` | 0,560 [0,552–0,568] (0,585) | 0,525 [0,516–0,533] (0,473) | 0,506, patte 24% | 12,7 / 12,1 / 16,6 | 51% |
| p5-h78 | HEALTH 80 → 78 | `bc243d14…d019b71e` | 0,532 [0,524–0,541] (0,553) | 0,468 [0,460–0,476] (0,390) | 0,504, patte 25% | 12,6 / 12,0 / 16,4 | 49% |
| r3-h75 | HEALTH 80 → 75 | `e8dd9219…261eb55f` | 0,490 [0,482–0,499] (0,506) | 0,412 [0,404–0,420] (0,312) | 0,505, patte 25% | 12,4 / 11,7 / 16,1 | 47% |
| r2-a45h75 | A 45, HEALTH 75 | `729fcbcb…f1c24267` | 0,490 [0,481–0,498] (0,504) | 0,425 [0,417–0,433] (0,333) | 0,505, patte 25% | 12,4 / 11,6 / 16,1 | 47% |
| r4-a41h75 | A 41, HEALTH 75 | `a481b72d…8ec3f055` | 0,490 [0,482–0,498] (0,505) | 0,425 [0,417–0,434] (0,333) | 0,505, patte 25% | 12,4 / 11,6 / 16,1 | 47% |
| r5-a45h70 | A 45, HEALTH 70 | `7b26715b…35de5512` | 0,416 [0,408–0,424] (0,421) | 0,340 [0,332–0,348] (0,219) | 0,500, patte 24% | 12,0 / 11,0 / 15,4 | 43% |
| p1-methp2 | Meth a priorità 2 | `7c0c165e…63351302` | 0,564 [0,556–0,572] (0,589) | 0,512 [0,504–0,520] (0,453) | 0,506, patte 24% | 12,6 / 12,1 / 16,5 | 50% |
| p2-coughp2 | Tossicone a priorità 2 | `1f48cf92…8dc89b93` | 0,565 [0,557–0,573] (0,590) | 0,507 [0,499–0,515] (0,446) | 0,503, patte 24% | 12,6 / 12,1 / 16,6 | 50% |
| p3-methp2h75 | Meth a priorità 2, HEALTH 75 | `27828025…6ff95805` | 0,494 [0,486–0,502] (0,509) | 0,416 [0,408–0,424] (0,318) | 0,503, patte 24% | 12,3 / 11,6 / 16,0 | 47% |
| p4-coughp2h78 | Tossicone a priorità 2, HEALTH 78 | `f80923ba…11057c91` | 0,537 [0,529–0,545] (0,556) | 0,467 [0,459–0,475] (0,388) | 0,503, patte 24% | 12,5 / 11,9 / 16,4 | 49% |

Lettura: la priorità di Meth o Tossicone non sposta nulla. La A sopra quella di Mara aiuta solo contro di lei (+1,7 punti) ma rovescia
l'ordine a parità di priorità della scheda (Mara prima del Tossico), quindi è un cambio d'identità: scartata. La salute più bassa accorcia di
poco e porta i soli euristici contro Mara sotto 0,40: scartata.

## Giro 3: la bound di T

Base: la bozza del giro 2. Matrice a 1000 partite per cella; salute equivalente per uso dal listino (`-Dsim.listinoBase=<variante>`,
gruppi `salute` e `tettoavanzati`, 2000 partite per stile e cella, semi da 8.200.000), con la pendenza della salute del contesto del Tossico.
Dati in `tmp/sim/sb13/var/listino-x*.json`, non copiati qui; la stessa misura sulla bozza finale è nel listino del rapporto.

| Variante | Modifica | SHA-256 | Tossico contro Spazienzio (senza com) | Tossico contro Mara (senza com) | Specchio | Turni T–S / T–M / T–T | Mazzo del Tossico esaurito |
|---|---|---|---|---|---|---|---|
| x1-rasch8 | Raschiare +10 → +8 T | `25f34e6e…851e6856` | 0,533 [0,525–0,542] (0,556) | 0,486 [0,478–0,495] (0,422) | 0,503, patte 23% | 12,8 / 12,2 / 16,6 | 51% |
| x2-rasch7 | **Raschiare +10 → +7 T** (giro 3) | `a98d0259…68ce06d0` | 0,527 [0,518–0,535] (0,550) | 0,480 [0,472–0,488] (0,418) | 0,503, patte 22% | 12,8 / 12,2 / 16,6 | 51% |
| x3-rasch6 | Raschiare +10 → +6 T | `d094fce9…e4bd545b` | 0,523 [0,514–0,531] (0,549) | 0,476 [0,468–0,484] (0,416) | 0,503, patte 22% | 12,8 / 12,2 / 16,6 | 51% |

| Bound TOS-BO2 | Quota della bound (più una nulla) contro due nulle [IC 95%] | Giocate a partita | Pendenza della salute (punti per HEALTH) | Salute equivalente per uso [IC 95%] |
|---|---|---:|---:|---|
| +10 T (giro 2) | 0,661 [0,647–0,675] | 1,80 | 1,94 | 4,6 [4,2–5,0] ✗ |
| +8 T | 0,632 [0,618–0,646] | 1,73 | 1,94 | 3,9 [3,5–4,3] |
| **+7 T** | 0,624 [0,610–0,638] | 1,75 | 1,97 | **3,6 [3,2–4,0]** ✓ |
| +6 T | 0,623 [0,609–0,637] | 1,79 | 1,96 | 3,5 [3,1–3,9] ✓ |

Scelta: **+7 T**, il valore più alto con tutto l'intervallo sotto 4; +8 lo supera in parte. +6 non cambia quasi nulla rispetto a +7.
