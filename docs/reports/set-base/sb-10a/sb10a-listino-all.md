# Listino di potenza SB-10a — misure

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `classpath:/sb-10a/listino-base.json` |
| SHA-256 | `87fa95f18772385258c51c05de784487beb4fa0dc9a67062d6783fff35b7b1b1` |
| Misure | all |
| Stili | aggressivo, prudente, risorse, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Danno per unità di risorsa pagata

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| costo-V10-spazienzio | ctx-spazienzio | Sonda: costo 10 V, priorità 1, x HIT | 20,7 [20,6–20,8] | 1,07 [1,06–1,08] danni per unità | 0,0536 | 20,9 / 20,1 / 21,3 | 16: 0,263 · 18: 0,346 · 20: 0,456 · 22: 0,554 · 24: 0,695 | dentro l'intervallo |
| costo-V20-spazienzio | ctx-spazienzio | Sonda: costo 20 V, priorità 1, x HIT | 33,0 [32,9–33,1] | 1,15 [1,14–1,15] danni per unità | 0,0337 | 33,5 / 31,0 / 33,2 | 27: 0,292 · 30: 0,400 · 33: 0,513 · 36: 0,608 · 39: 0,693 | dentro l'intervallo |
| costo-V30-spazienzio | ctx-spazienzio | Sonda: costo 30 V, priorità 1, x HIT | 53,1 [52,6–53,6] | 1,44 [1,42–1,45] danni per unità | 0,0135 | 53,9 / 48,0 / 63,3 | 48: 0,423 · 51: 0,479 · 54: 0,518 · 57: 0,551 · 60: 0,590 | dentro l'intervallo |
| costo-V10-neutro | ctx-neutro | Sonda: costo 10 V, priorità 1, x HIT | 30,9 [30,4–31,4] | 2,09 [2,04–2,14] danni per unità | 0,0128 | 15,0 / piatta / 13,4 | 28: 0,461 · 30: 0,484 · 32: 0,522 · 34: 0,541 · 36: 0,561 | dentro l'intervallo |
| costo-V20-neutro | ctx-neutro | Sonda: costo 20 V, priorità 1, x HIT | ≥ 110 | — | -0,0000 | piatta / piatta / piatta | 98: 0,070 · 101: 0,070 · 104: 0,070 · 107: 0,070 · 110: 0,070 | oltre l'intervallo: anche a x = 110 la sonda vale meno del riferimento |
| costo-V30-neutro | ctx-neutro | Sonda: costo 30 V, priorità 1, x HIT | ≥ 160 | — | 0,0000 | piatta / piatta / piatta | 147: 0,008 · 150: 0,008 · 153: 0,008 · 156: 0,008 · 159: 0,008 | oltre l'intervallo: anche a x = 160 la sonda vale meno del riferimento |
| costo-A10-mara | ctx-mara | Sonda: costo 10 A, priorità 1, x HIT | 15,5 [15,4–15,6] | 0,55 [0,54–0,56] danni per unità | 0,0724 | 16,6 / 14,3 / 15,1 | 12: 0,229 · 14: 0,394 · 16: 0,555 · 18: 0,705 · 20: 0,799 | dentro l'intervallo |
| costo-A20-mara | ctx-mara | Sonda: costo 20 A, priorità 1, x HIT | 26,1 [26,0–26,2] | 0,80 [0,80–0,81] danni per unità | 0,0300 | 27,6 / 22,4 / 24,9 | 21: 0,339 · 24: 0,447 · 27: 0,524 · 30: 0,633 · 33: 0,695 | dentro l'intervallo |
| costo-A10-neutro | ctx-neutro | Sonda: costo 10 A, priorità 1, x HIT | 12,2 [12,2–12,3] | 0,22 [0,22–0,23] danni per unità | 0,1029 | 12,4 / 11,6 / 12,8 | 8: 0,046 · 10: 0,270 · 12: 0,500 · 14: 0,730 · 16: 0,845 | dentro l'intervallo |
| costo-A20-neutro | ctx-neutro | Sonda: costo 20 A, priorità 1, x HIT | 18,2 [18,1–18,3] | 0,41 [0,41–0,42] danni per unità | 0,0530 | 19,1 / 15,2 / 20,2 | 12: 0,139 · 15: 0,344 · 18: 0,528 · 21: 0,652 · 24: 0,779 | dentro l'intervallo |
| costo-A10-spazienzio | ctx-spazienzio | Sonda: costo 10 A, priorità 1, x HIT | 10,3 [10,2–10,4] | 0,03 [0,02–0,04] danni per unità | 0,0513 | 10,4 / 10,8 / 9,9 | 6: 0,294 · 8: 0,372 · 10: 0,469 · 12: 0,585 · 14: 0,701 | dentro l'intervallo |
| costo-T10-tossico | ctx-tossico | Sonda: costo 10 T, priorità 1, x HIT | 10,5 [10,4–10,6] | 0,05 [0,04–0,06] danni per unità | 0,1000 | 10,5 / 10,9 / 10,1 | 6: 0,096 · 8: 0,185 · 10: 0,423 · 12: 0,683 · 14: 0,857 | dentro l'intervallo |
| costo-T20-tossico | ctx-tossico | Sonda: costo 20 T, priorità 1, x HIT | 12,6 [12,5–12,7] | 0,13 [0,13–0,14] danni per unità | 0,0636 | 12,6 / 16,5 / 10,6 | 6: 0,106 · 9: 0,214 · 12: 0,434 · 15: 0,751 · 18: 0,803 | dentro l'intervallo |
| costo-L5-neutro | ctx-neutro | Sonda: costo 5 L, priorità 1, x HIT | ≥ 60 | — | 0,0000 | piatta / piatta / piatta | 52: 0,055 · 54: 0,055 · 56: 0,055 · 58: 0,055 · 60: 0,055 | oltre l'intervallo: anche a x = 60 la sonda vale meno del riferimento |
| costo-L10-neutro | ctx-neutro | Sonda: costo 10 L, priorità 1, x HIT | ≥ 60 | — | 0,0000 | piatta / piatta / piatta | 52: 0,005 · 54: 0,005 · 56: 0,005 · 58: 0,005 · 60: 0,005 | oltre l'intervallo: anche a x = 60 la sonda vale meno del riferimento |
| costo-L5-spazienzio | ctx-spazienzio | Sonda: costo 5 L, priorità 1, x HIT | 39,6 [39,0–40,1] | 5,91 [5,80–6,03] danni per unità | 0,0124 | 31,3 / 46,3 / 31,0 | 34: 0,437 · 36: 0,449 · 38: 0,478 · 40: 0,509 · 42: 0,530 | dentro l'intervallo |
| costo-H10-rocco | ctx-rocco | Sonda: costo 10 H, priorità 1, x HIT | 22,3 [22,2–22,5] | 1,23 [1,22–1,25] danni per unità | 0,0505 | 22,1 / 23,3 / 21,4 | 18: 0,273 · 20: 0,392 · 22: 0,487 · 24: 0,586 · 26: 0,680 | dentro l'intervallo |
| costo-H20-rocco | ctx-rocco | Sonda: costo 20 H, priorità 1, x HIT | 34,8 [34,7–34,9] | 1,24 [1,23–1,24] danni per unità | 0,0403 | 34,5 / 37,4 / 32,9 | 27: 0,192 · 30: 0,304 · 33: 0,423 · 36: 0,552 · 39: 0,673 | dentro l'intervallo |
| costo-H10-neutro | ctx-neutro | Sonda: costo 10 H, priorità 1, x HIT | 20,6 [20,5–20,6] | 1,06 [1,05–1,06] danni per unità | 0,1009 | 20,3 / 20,9 / 20,4 | 16: 0,070 · 18: 0,191 · 20: 0,448 · 22: 0,667 · 24: 0,843 | dentro l'intervallo |
| costo-H20-neutro | ctx-neutro | Sonda: costo 20 H, priorità 1, x HIT | 32,4 [32,3–32,5] | 1,12 [1,11–1,12] danni per unità | 0,0670 | 31,3 / 33,7 / 31,4 | 27: 0,111 · 30: 0,323 · 33: 0,597 · 36: 0,791 · 39: 0,885 | dentro l'intervallo |

## Tipi di danno

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| tipo-CUT-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x CUT | 9,9 [9,8–10,0] | 1,01 [1,00–1,02] HIT per unità | 0,0677 | 10,4 / 9,2 / 10,6 | 8: 0,379 · 9: 0,432 · 10: 0,505 · 11: 0,575 · 12: 0,646 | dentro l'intervallo |
| tipo-POISON-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x POISON | 9,5 [9,4–9,6] | 1,05 [1,04–1,07] HIT per unità | 0,0688 | 10,1 / 8,5 / 10,6 | 7: 0,339 · 8: 0,395 · 9: 0,453 · 10: 0,536 · 11: 0,612 | dentro l'intervallo |
| tipo-CUT-mara | ctx-mara | Sonda: gratuita, priorità 1, x CUT | 10,0 [9,9–10,1] | 1,00 [0,99–1,01] HIT per unità | 0,0798 | 9,8 / 10,1 / 10,1 | 9: 0,431 · 10: 0,485 · 11: 0,582 · 12: 0,656 · 13: 0,744 | dentro l'intervallo |
| tipo-POISON-mara | ctx-mara | Sonda: gratuita, priorità 1, x POISON | 9,9 [9,8–9,9] | 1,01 [1,01–1,02] HIT per unità | 0,0764 | 9,9 / 9,5 / 10,1 | 8: 0,357 · 9: 0,441 · 10: 0,497 · 11: 0,592 · 12: 0,663 | dentro l'intervallo |
| tipo-CUT-rocco | ctx-rocco | Sonda: gratuita, priorità 1, x CUT | 10,2 [10,1–10,3] | 0,98 [0,97–0,99] HIT per unità | 0,0685 | 9,5 / 10,8 / 10,3 | 7: 0,291 · 8: 0,342 · 9: 0,408 · 10: 0,501 · 11: 0,555 | dentro l'intervallo |
| tipo-POISON-rocco | ctx-rocco | Sonda: gratuita, priorità 1, x POISON | 9,5 [9,4–9,6] | 1,06 [1,05–1,07] HIT per unità | 0,0724 | 9,5 / 8,9 / 10,3 | 7: 0,329 · 8: 0,382 · 9: 0,462 · 10: 0,549 · 11: 0,608 | dentro l'intervallo |
| tipo-CUT-neutro | ctx-neutro | Sonda: gratuita, priorità 1, x CUT | 9,9 [9,9–10,0] | 1,01 [1,00–1,01] HIT per unità | 0,1676 | 9,9 / 9,9 / 10,0 | 8: 0,165 · 9: 0,340 · 10: 0,532 · 11: 0,716 · 12: 0,816 | dentro l'intervallo |
| tipo-POISON-neutro | ctx-neutro | Sonda: gratuita, priorità 1, x POISON | 9,9 [9,9–9,9] | 1,01 [1,01–1,01] HIT per unità | 0,1685 | 9,9 / 9,8 / 10,0 | 8: 0,168 · 9: 0,344 · 10: 0,536 · 11: 0,723 · 12: 0,822 | dentro l'intervallo |

## Priorità

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| priorita-0-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 0, x HIT | 9,6 [9,5–9,7] | -0,4 [-0,5–-0,3] HIT rispetto alla priorità 1 | 0,0693 | 9,7 / 9,6 / 9,6 | 8: 0,400 · 9: 0,441 · 10: 0,518 · 11: 0,596 · 12: 0,669 | dentro l'intervallo |
| priorita-2-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 2, x HIT | 9,5 [9,4–9,6] | -0,5 [-0,6–-0,4] HIT rispetto alla priorità 1 | 0,0721 | 9,9 / 8,9 / 9,9 | 8: 0,407 · 9: 0,446 · 10: 0,535 · 11: 0,616 · 12: 0,683 | dentro l'intervallo |
| priorita-0-mara | ctx-mara | Sonda: gratuita, priorità 0, x HIT | 9,8 [9,8–9,9] | -0,2 [-0,2–-0,1] HIT rispetto alla priorità 1 | 0,0737 | 9,9 / 9,9 / 9,8 | 8: 0,364 · 9: 0,443 · 10: 0,501 · 11: 0,593 · 12: 0,658 | dentro l'intervallo |
| priorita-2-mara | ctx-mara | Sonda: gratuita, priorità 2, x HIT | 9,9 [9,8–9,9] | -0,1 [-0,2–-0,1] HIT rispetto alla priorità 1 | 0,0761 | 9,9 / 9,8 / 9,9 | 8: 0,360 · 9: 0,440 · 10: 0,499 · 11: 0,594 · 12: 0,663 | dentro l'intervallo |
| priorita-0-neutro | ctx-neutro | Sonda: gratuita, priorità 0, x HIT | 10,0 [10,0–10,1] | 0,0 [0,0–0,1] HIT rispetto alla priorità 1 | 0,1652 | 9,9 / 10,2 / 10,0 | 8: 0,158 · 9: 0,313 · 10: 0,509 · 11: 0,690 · 12: 0,795 | dentro l'intervallo |
| priorita-2-neutro | ctx-neutro | Sonda: gratuita, priorità 2, x HIT | 10,0 [9,9–10,0] | -0,0 [-0,1–0,0] HIT rispetto alla priorità 1 | 0,1664 | 9,9 / 10,0 / 10,0 | 8: 0,163 · 9: 0,331 · 10: 0,523 · 11: 0,707 · 12: 0,808 | dentro l'intervallo |

## T al bersaglio

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| veleno-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | 3,4 [3,3–3,5] | 1,46 [1,42–1,51] HIT per 1 T | 0,0601 | 2,9 / 6,4 / 3,0 | 0: 0,257 · 2: 0,429 · 4: 0,580 · 6: 0,680 · 8: 0,733 | dentro l'intervallo |
| veleno-mara | ctx-mara | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | 7,3 [7,0–7,6] | 0,69 [0,66–0,72] HIT per 1 T | 0,0216 | 12,7 / piatta / -4,8 | 4: 0,408 · 6: 0,486 · 8: 0,535 · 10: 0,560 · 12: 0,588 | dentro l'intervallo |
| veleno-neutro | ctx-neutro | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | 4,0 [3,9–4,1] | 1,24 [1,22–1,27] HIT per 1 T | 0,0736 | 1,8 / piatta / 1,6 | 0: 0,005 · 2: 0,533 · 4: 0,646 · 6: 0,662 · 8: 0,667 | dentro l'intervallo |
| veleno-tossico | ctx-tossico | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | ≥ 40 | — | 0,0000 | piatta / piatta / piatta | 32: 0,097 · 34: 0,097 · 36: 0,097 · 38: 0,097 · 40: 0,098 | oltre l'intervallo: anche a x = 40 la sonda vale meno del riferimento |

## L che decade

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| decadimento-spesa-neutro | ctx-neutro | Sonda: 2 × (+x L) e 2 × (10 L → 25 HIT) contro 2 × (+10 V) e 2 × (10 V → 25 HIT) | ≥ 40 | — | 0,0000 | piatta / piatta / piatta | 32: 0,255 · 34: 0,255 · 36: 0,255 · 38: 0,255 · 40: 0,255 | oltre l'intervallo: anche a x = 40 la sonda vale meno del riferimento |
| decadimento-neutro | ctx-neutro | Sonda: 2 × (+x L) contro 2 × (+10 V), spese del contesto | 20,3 [20,2–20,4] | 0,49 [0,49–0,50] V per 1 L | 0,0522 | 19,7 / piatta / 20,7 | 16: 0,327 · 18: 0,354 · 20: 0,374 · 22: 0,684 · 24: 0,684 | dentro l'intervallo |

## Non specchio

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| nonspecchio-V10-spazienzio-mara | ctx-spazienzio | Sonda: costo 10 V, priorità 1, x HIT; Spazienzio contro Mara (Spazienzio con 25 HEALTH in meno) | 19,3 [19,1–19,5] | 0,93 [0,91–0,95] danni per unità | 0,0418 | 20,0 / 17,6 / 20,6 | 16: 0,413 · 18: 0,501 · 20: 0,608 · 22: 0,657 · 24: 0,753 | dentro l'intervallo |
| nonspecchio-V20-spazienzio-mara | ctx-spazienzio | Sonda: costo 20 V, priorità 1, x HIT; Spazienzio contro Mara (Spazienzio con 25 HEALTH in meno) | 31,0 [30,7–31,2] | 1,05 [1,04–1,06] danni per unità | 0,0359 | 31,4 / 29,7 / 31,8 | 24: 0,302 · 27: 0,409 · 30: 0,539 · 33: 0,632 · 36: 0,729 | dentro l'intervallo |
| nonspecchio-CUT-spazienzio-mara | ctx-spazienzio | Sonda: gratuita, priorità 1, x CUT; Spazienzio contro Mara (Spazienzio con 25 HEALTH in meno) | 10,3 [10,1–10,4] | 0,98 [0,96–0,99] HIT per unità | 0,0528 | 10,4 / 9,8 / 10,6 | 8: 0,436 · 9: 0,485 · 10: 0,558 · 11: 0,591 · 12: 0,647 | dentro l'intervallo |
| nonspecchio-CUT-mara-spazienzio | ctx-mara | Sonda: gratuita, priorità 1, x CUT; Mara contro Spazienzio (Spazienzio con 25 HEALTH in meno) | 10,1 [10,0–10,2] | 0,99 [0,98–1,00] HIT per unità | 0,0721 | 10,3 / 9,7 / 10,5 | 8: 0,299 · 9: 0,355 · 10: 0,434 · 11: 0,510 · 12: 0,582 | dentro l'intervallo |

## Carte attuali: gemella a solo danno

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| carta-Glare | ctx-spazienzio | Gemella di bruiser.Glare: gratuita, priorità 0, x HIT | 6,6 [6,4–6,9] | 6,6 [6,4–6,9] HIT equivalenti | 0,0300 | 6,2 / 5,3 / 8,0 | 4: 0,431 · 6: 0,471 · 8: 0,539 · 10: 0,596 · 12: 0,669 | dentro l'intervallo |
| carta-MadeOfStone | ctx-spazienzio | Gemella di bruiser.MadeOfStone: gratuita, priorità 0, x HIT | 6,5 [6,3–6,8] | 6,5 [6,3–6,8] HIT equivalenti | 0,0289 | 5,8 / 9,9 / 4,0 | 4: 0,440 · 6: 0,476 · 8: 0,532 · 10: 0,601 · 12: 0,666 | dentro l'intervallo |
| carta-CantFeelAnything | ctx-spazienzio | Gemella di bruiser.CantFeelAnything: costo 20 V, priorità 2, x HIT | 23,6 [23,3–23,9] | 23,6 [23,3–23,9] HIT equivalenti | 0,0218 | 24,8 / 22,8 / 23,3 | 20: 0,436 · 22: 0,455 · 24: 0,488 · 26: 0,559 · 28: 0,602 | dentro l'intervallo da x = 10; a x = 0 la sonda, mai giocata, vale più della carta |
| carta-HealingBlow | ctx-spazienzio | Gemella di bruiser.HealingBlow: costo 20 V, priorità 1, x HIT | 29,6 [29,2–29,9] | 29,6 [29,2–29,9] HIT equivalenti | 0,0234 | 29,4 / 29,8 / 29,5 | 24: 0,363 · 26: 0,424 · 28: 0,467 · 30: 0,510 · 32: 0,554 | dentro l'intervallo |
| carta-SickeningBlow | ctx-spazienzio | Gemella di bruiser.SickeningBlow: costo 15 V, priorità 1, x HIT | 24,6 [24,4–24,9] | 24,6 [24,4–24,9] HIT equivalenti | 0,0277 | 25,9 / 22,1 / 26,3 | 22: 0,422 · 24: 0,484 · 26: 0,548 · 28: 0,595 · 30: 0,642 | dentro l'intervallo |
| carta-StunningBlow | ctx-spazienzio | Gemella di bruiser.StunningBlow: costo 15 V, priorità 1, x HIT | 15,6 [15,0–16,1] | 15,6 [15,0–16,1] HIT equivalenti | 0,0116 | 14,4 / piatta / 13,4 | 12: 0,469 · 14: 0,477 · 16: 0,493 · 18: 0,527 · 20: 0,560 | dentro l'intervallo da x = 10; a x = 0 la sonda, mai giocata, vale più della carta |
| carta-ExtremelyViolentBlow | ctx-spazienzio | Gemella di bruiser.ExtremelyViolentBlow: costo 20 V, priorità 1, x HIT | ≤ 10 | — | -0,0055 | piatta / piatta / piatta | 10: 0,531 · 12: 0,480 · 14: 0,472 · 16: 0,468 · 18: 0,481 | sotto l'intervallo: già a x = 10 la sonda vale più del riferimento (e a x = 0 la sonda, mai giocata, vale più della carta) |
| carta-SeagullFly | ctx-spazienzio | Gemella di bruiser.SeagullFly: costo 10 V, priorità 1, x HIT | 14,3 [14,0–14,6] | 14,3 [14,0–14,6] HIT equivalenti | 0,0250 | 14,6 / 13,8 / 14,5 | 12: 0,450 · 14: 0,485 · 16: 0,542 · 18: 0,596 · 20: 0,645 | dentro l'intervallo |
| carta-SuperImpact | ctx-spazienzio | Gemella di bruiser.SuperImpact: costo 25 V, priorità 0, x HIT | 39,3 [38,8–39,8] | 39,3 [38,8–39,8] HIT equivalenti | 0,0133 | 38,5 / 39,8 / 39,8 | 36: 0,456 · 38: 0,485 · 40: 0,510 · 42: 0,530 · 44: 0,566 | dentro l'intervallo |
| carta-YouStop | ctx-spazienzio | Gemella di bruiser.YouStop: costo 5 V, priorità 2, x HIT | ≤ 10 | — | 0,0274 | 8,8 / 7,1 / 9,4 | 10: 0,540 · 12: 0,599 · 14: 0,658 · 16: 0,710 · 18: 0,759 | sotto l'intervallo: già a x = 10 la sonda vale più del riferimento (e a x = 0 la sonda, mai giocata, vale più della carta) |
| carta-WhatchaDoin | ctx-spazienzio | Gemella di bruiser.WhatchaDoin: costo 10 A + 10 V, priorità 2, x HIT | 13,6 [13,1–14,1] | 13,6 [13,1–14,1] HIT equivalenti | 0,0137 | 12,4 / 19,7 / 13,7 | 10: 0,472 · 12: 0,460 · 14: 0,493 · 16: 0,526 · 18: 0,576 | dentro l'intervallo da x = 10; a x = 0 la sonda, mai giocata, vale più della carta |
| carta-BadEducation | ctx-spazienzio | Gemella di bruiser.BadEducation: costo 10 V, priorità 1, x HIT | 10,4 [9,8–11,0] | 10,4 [9,8–11,0] HIT equivalenti | 0,0175 | 9,4 / 11,8 / 10,7 | 10: 0,508 · 12: 0,520 · 14: 0,544 · 16: 0,597 · 18: 0,643 | dentro l'intervallo da x = 10; a x = 0 la sonda, mai giocata, vale più della carta |
| carta-BreakYourToy | ctx-spazienzio | Gemella di bruiser.BreakYourToy: costo 10 V, priorità 1, x HIT | 14,2 [13,9–14,6] | 14,2 [13,9–14,6] HIT equivalenti | 0,0177 | 13,2 / 17,9 / 13,1 | 10: 0,443 · 12: 0,448 · 14: 0,480 · 16: 0,529 · 18: 0,580 | dentro l'intervallo da x = 10; a x = 0 la sonda, mai giocata, vale più della carta |
| carta-MethDrivenRage | ctx-tossico | Gemella di junkie.MethDrivenRage: costo 5 T, priorità 1, x HIT | 11,4 [11,3–11,5] | 11,4 [11,3–11,5] HIT equivalenti | 0,0689 | 11,4 / 11,1 / 11,7 | 8: 0,219 · 10: 0,503 · 12: 0,506 · 14: 0,671 · 16: 0,814 | dentro l'intervallo |
| carta-Cough | ctx-tossico | Gemella di junkie.Cough: costo 10 T, priorità 1, x HIT | 3,9 [3,7–4,1] | 3,9 [3,7–4,1] HIT equivalenti | 0,0462 | 3,8 / 3,3 / 4,5 | 2: 0,502 · 4: 0,430 · 6: 0,512 · 8: 0,716 · 10: 0,808 | dentro l'intervallo |
| carta-GoingBerserk | ctx-tossico | Gemella di junkie.GoingBerserk: costo 10 L, priorità 1, x HIT | 31,9 [30,7–33,0] | 31,9 [30,7–33,0] HIT equivalenti | 0,0063 | 33,3 / 30,2 / 31,7 | 26: 0,462 · 28: 0,473 · 30: 0,495 · 32: 0,500 · 34: 0,512 | dentro l'intervallo |
| carta-PervertedMetabolism | ctx-tossico | Gemella di junkie.PervertedMetabolism: gratuita, priorità 1, x HIT | 8,3 [8,2–8,4] | 8,3 [8,2–8,4] HIT equivalenti | 0,0555 | 6,1 / 12,0 / 6,1 | 4: 0,280 · 6: 0,348 · 8: 0,465 · 10: 0,627 · 12: 0,697 | dentro l'intervallo |
| carta-EverythingIsDrug | ctx-tossico | Gemella di junkie.EverythingIsDrug: gratuita, priorità 1, x HIT | ≤ 10 | — | 0,0124 | 4,7 / piatta / -44,1 | 10: 0,851 · 12: 0,849 · 14: 0,890 · 16: 0,926 · 18: 0,936 | sotto l'intervallo: già a x = 10 la sonda vale più del riferimento (e a x = 0 la sonda, mai giocata, vale più della carta) |
| carta-AmphetamineReflexes | ctx-tossico | Gemella di junkie.AmphetamineReflexes: costo 10 T, priorità 2, x HIT | 4,3 [4,1–4,5] | 4,3 [4,1–4,5] HIT equivalenti | 0,0477 | 4,1 / 5,1 / 4,5 | 2: 0,492 · 4: 0,395 · 6: 0,541 · 8: 0,668 · 10: 0,810 | dentro l'intervallo |
| carta-ToxicBloodDrain | ctx-tossico | Gemella di junkie.ToxicBloodDrain: costo 10 T, priorità 1, x HIT | 4,5 [4,3–4,7] | 4,5 [4,3–4,7] HIT equivalenti | 0,0467 | 5,3 / 3,3 / 5,2 | 2: 0,472 · 4: 0,409 · 6: 0,482 · 8: 0,687 · 10: 0,788 | dentro l'intervallo |
| carta-BadTrip | ctx-tossico | Gemella di junkie.BadTrip: costo 10 A, priorità 2, x HIT | 3,6 [3,4–3,9] | 3,6 [3,4–3,9] HIT equivalenti | 0,0396 | 4,5 / 3,2 / 3,5 | 2: 0,512 · 4: 0,473 · 6: 0,494 · 8: 0,695 · 10: 0,785 | dentro l'intervallo |
| carta-BeggingMoney | ctx-tossico | Gemella di junkie.BeggingMoney: costo 25 T, priorità 0, x HIT | 4,1 [3,9–4,3] | 4,1 [3,9–4,3] HIT equivalenti | 0,0396 | 3,8 / 3,9 / 4,4 | 2: 0,498 · 4: 0,435 · 6: 0,514 · 8: 0,652 · 10: 0,772 | dentro l'intervallo |
| carta-LethalHeroinDose | ctx-tossico | Gemella di junkie.LethalHeroinDose: gratuita, priorità 1, x HIT | 4,6 [4,4–4,8] | 4,6 [4,4–4,8] HIT equivalenti | 0,0506 | 4,3 / 5,0 / 4,7 | 2: 0,501 · 4: 0,336 · 6: 0,496 · 8: 0,714 · 10: 0,801 | dentro l'intervallo |

## Salute iniziale (moneta comune)

Pendenza per contesto, retta per (0; 0,5): ctx-neutro 4,77 ± 0,08 punti per 1 HEALTH; ctx-spazienzio 2,58 ± 0,09 punti per 1 HEALTH; ctx-mara 3,43 ± 0,09 punti per 1 HEALTH; ctx-rocco 2,48 ± 0,09 punti per 1 HEALTH; ctx-tossico 3,60 ± 0,09 punti per 1 HEALTH.

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| salute-10-neutro | ctx-neutro | HEALTH iniziale -10 | 0,053 [0,048–0,060] | 9,8% | — | — | — | — |
| salute-5-neutro | ctx-neutro | HEALTH iniziale -5 | 0,206 [0,195–0,218] | 16,4% | — | — | — | — |
| salute+5-neutro | ctx-neutro | HEALTH iniziale +5 | 0,790 [0,779–0,801] | 15,9% | — | — | — | — |
| salute+10-neutro | ctx-neutro | HEALTH iniziale +10 | 0,957 [0,951–0,962] | 10,3% | — | — | — | — |
| salute-10-spazienzio | ctx-spazienzio | HEALTH iniziale -10 | 0,241 [0,229–0,254] | 21,1% | — | — | — | — |
| salute-5-spazienzio | ctx-spazienzio | HEALTH iniziale -5 | 0,365 [0,351–0,379] | 23,8% | — | — | — | — |
| salute+5-spazienzio | ctx-spazienzio | HEALTH iniziale +5 | 0,638 [0,624–0,652] | 24,7% | — | — | — | — |
| salute+10-spazienzio | ctx-spazienzio | HEALTH iniziale +10 | 0,750 [0,737–0,762] | 22,3% | — | — | — | — |
| salute-10-mara | ctx-mara | HEALTH iniziale -10 | 0,173 [0,163–0,184] | 12,8% | — | — | — | — |
| salute-5-mara | ctx-mara | HEALTH iniziale -5 | 0,318 [0,305–0,330] | 15,6% | — | — | — | — |
| salute+5-mara | ctx-mara | HEALTH iniziale +5 | 0,681 [0,668–0,694] | 16,0% | — | — | — | — |
| salute+10-mara | ctx-mara | HEALTH iniziale +10 | 0,850 [0,840–0,859] | 14,0% | — | — | — | — |
| salute-10-rocco | ctx-rocco | HEALTH iniziale -10 | 0,250 [0,238–0,262] | 18,6% | — | — | — | — |
| salute-5-rocco | ctx-rocco | HEALTH iniziale -5 | 0,364 [0,351–0,378] | 20,3% | — | — | — | — |
| salute+5-rocco | ctx-rocco | HEALTH iniziale +5 | 0,633 [0,619–0,647] | 20,6% | — | — | — | — |
| salute+10-rocco | ctx-rocco | HEALTH iniziale +10 | 0,737 [0,724–0,749] | 17,5% | — | — | — | — |
| salute-10-tossico | ctx-tossico | HEALTH iniziale -10 | 0,124 [0,115–0,133] | 14,5% | — | — | — | — |
| salute-5-tossico | ctx-tossico | HEALTH iniziale -5 | 0,243 [0,230–0,256] | 34,6% | — | — | — | — |
| salute+5-tossico | ctx-tossico | HEALTH iniziale +5 | 0,662 [0,645–0,678] | 49,1% | — | — | — | — |
| salute+10-tossico | ctx-tossico | HEALTH iniziale +10 | 0,813 [0,800–0,824] | 29,3% | — | — | — | — |

## A iniziale (precedenza)

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| allerta-10-neutro | ctx-neutro | A iniziale -10 | 0,497 [0,482–0,511] | 20,0% | — | — | -0,1 | — |
| allerta-3-neutro | ctx-neutro | A iniziale -3 | 0,497 [0,482–0,511] | 20,0% | — | — | -0,1 | — |
| allerta-1-neutro | ctx-neutro | A iniziale -1 | 0,497 [0,482–0,511] | 20,0% | — | — | -0,1 | — |
| allerta+1-neutro | ctx-neutro | A iniziale +1 | 0,497 [0,482–0,511] | 20,0% | — | — | -0,1 | — |
| allerta+3-neutro | ctx-neutro | A iniziale +3 | 0,497 [0,482–0,511] | 20,0% | — | — | -0,1 | — |
| allerta+10-neutro | ctx-neutro | A iniziale +10 | 0,497 [0,482–0,511] | 20,0% | — | — | -0,1 | — |
| allerta-10-spazienzio | ctx-spazienzio | A iniziale -10 | 0,491 [0,476–0,506] | 25,3% | — | — | -0,3 | — |
| allerta-3-spazienzio | ctx-spazienzio | A iniziale -3 | 0,493 [0,479–0,508] | 25,7% | — | — | -0,3 | — |
| allerta-1-spazienzio | ctx-spazienzio | A iniziale -1 | 0,493 [0,479–0,508] | 25,7% | — | — | -0,3 | — |
| allerta+1-spazienzio | ctx-spazienzio | A iniziale +1 | 0,507 [0,492–0,522] | 26,0% | — | — | 0,3 | — |
| allerta+3-spazienzio | ctx-spazienzio | A iniziale +3 | 0,507 [0,492–0,522] | 26,1% | — | — | 0,3 | — |
| allerta+10-spazienzio | ctx-spazienzio | A iniziale +10 | 0,513 [0,499–0,528] | 26,2% | — | — | 0,5 | — |
| allerta-10-mara | ctx-mara | A iniziale -10 | 0,371 [0,358–0,385] | 15,9% | — | — | -3,8 | — |
| allerta-3-mara | ctx-mara | A iniziale -3 | 0,418 [0,405–0,432] | 17,5% | — | — | -2,4 | — |
| allerta-1-mara | ctx-mara | A iniziale -1 | 0,418 [0,405–0,432] | 17,6% | — | — | -2,4 | — |
| allerta+1-mara | ctx-mara | A iniziale +1 | 0,497 [0,483–0,511] | 16,6% | — | — | -0,1 | — |
| allerta+3-mara | ctx-mara | A iniziale +3 | 0,497 [0,483–0,511] | 16,6% | — | — | -0,1 | — |
| allerta+10-mara | ctx-mara | A iniziale +10 | 0,524 [0,510–0,538] | 16,5% | — | — | 0,7 | — |

## Bound: una sonda e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| bound-danno-2-neutro | ctx-neutro | danno-2 | 0,843 [0,831–0,855] | 45,2% | 5,61 | 29,5% | 7,2 | 1,28 |
| bound-danno-4-neutro | ctx-neutro | danno-4 | 0,998 [0,996–0,999] | 17,8% | 6,09 | 33,8% | saturato | — |
| bound-danno-6-neutro | ctx-neutro | danno-6 | 1,000 [0,999–1,000] | 0,0% | 6,96 | 45,1% | saturato | — |
| bound-danno-8-neutro | ctx-neutro | danno-8 | 1,000 [0,999–1,000] | 0,0% | 6,39 | 47,7% | saturato | — |
| bound-danno-10-neutro | ctx-neutro | danno-10 | 1,000 [0,999–1,000] | 0,0% | 6,88 | 61,1% | saturato | — |
| bound-risorsa-2-neutro | ctx-neutro | risorsa-2 | 0,513 [0,494–0,532] | 55,8% | 2,05 | 10,6% | 0,3 | 0,13 |
| bound-risorsa-4-neutro | ctx-neutro | risorsa-4 | 0,666 [0,647–0,684] | 58,5% | 2,61 | 13,5% | 3,5 | 1,34 |
| bound-risorsa-6-neutro | ctx-neutro | risorsa-6 | 0,802 [0,786–0,817] | 59,4% | 2,88 | 14,9% | 6,3 | 2,20 |
| bound-risorsa-8-neutro | ctx-neutro | risorsa-8 | 0,819 [0,803–0,833] | 58,5% | 2,88 | 15,0% | 6,7 | 2,32 |
| bound-risorsa-10-neutro | ctx-neutro | risorsa-10 | 0,945 [0,935–0,953] | 56,9% | 3,13 | 16,4% | saturato | — |
| bound-parata-0.75-neutro | ctx-neutro | parata-0.75 | 0,253 [0,238–0,268] | 42,9% | 7,16 | 35,5% | -5,2 | -0,72 |
| bound-parata-0.5-neutro | ctx-neutro | parata-0.5 | 0,416 [0,399–0,432] | 41,7% | 6,78 | 33,2% | -1,8 | -0,26 |
| bound-parata-0.25-neutro | ctx-neutro | parata-0.25 | 0,779 [0,766–0,792] | 38,3% | 5,72 | 28,2% | 5,9 | 1,02 |
| bound-struggle-neutro | ctx-neutro | struggle | 0,918 [0,910–0,925] | 13,9% | 6,79 | 60,1% | saturato | — |
| bound-veleno-2-neutro | ctx-neutro | veleno-2 | 0,993 [0,991–0,995] | 6,6% | 3,20 | 19,1% | saturato | — |
| bound-veleno-5-neutro | ctx-neutro | veleno-5 | 0,997 [0,995–0,998] | 1,9% | 2,72 | 18,9% | saturato | — |
| bound-danno-2-spazienzio | ctx-spazienzio | danno-2 | 0,476 [0,462–0,490] | 15,9% | 2,58 | 24,2% | -0,9 | -0,36 |
| bound-danno-4-spazienzio | ctx-spazienzio | danno-4 | 0,475 [0,461–0,488] | 17,3% | 3,77 | 35,7% | -1,0 | -0,26 |
| bound-danno-6-spazienzio | ctx-spazienzio | danno-6 | 0,597 [0,583–0,610] | 17,3% | 4,03 | 39,4% | 3,8 | 0,93 |
| bound-danno-8-spazienzio | ctx-spazienzio | danno-8 | 0,742 [0,729–0,754] | 17,2% | 4,03 | 41,9% | 9,4 | 2,32 |
| bound-danno-10-spazienzio | ctx-spazienzio | danno-10 | 0,847 [0,836–0,856] | 14,1% | 4,07 | 45,1% | 13,4 | 3,30 |
| bound-risorsa-2-spazienzio | ctx-spazienzio | risorsa-2 | 0,494 [0,481–0,508] | 14,6% | 1,13 | 10,6% | -0,2 | -0,19 |
| bound-risorsa-4-spazienzio | ctx-spazienzio | risorsa-4 | 0,517 [0,503–0,531] | 15,0% | 1,14 | 10,7% | 0,7 | 0,58 |
| bound-risorsa-6-spazienzio | ctx-spazienzio | risorsa-6 | 0,559 [0,545–0,572] | 15,6% | 1,13 | 10,7% | 2,3 | 2,01 |
| bound-risorsa-8-spazienzio | ctx-spazienzio | risorsa-8 | 0,583 [0,569–0,597] | 16,0% | 1,18 | 11,2% | 3,2 | 2,74 |
| bound-risorsa-10-spazienzio | ctx-spazienzio | risorsa-10 | 0,627 [0,614–0,641] | 16,1% | 1,25 | 12,2% | 4,9 | 3,96 |
| bound-parata-0.75-spazienzio | ctx-spazienzio | parata-0.75 | 0,384 [0,371–0,398] | 13,3% | 4,24 | 36,1% | -4,5 | -1,06 |
| bound-parata-0.5-spazienzio | ctx-spazienzio | parata-0.5 | 0,441 [0,427–0,455] | 15,4% | 4,30 | 35,1% | -2,3 | -0,53 |
| bound-parata-0.25-spazienzio | ctx-spazienzio | parata-0.25 | 0,568 [0,554–0,581] | 16,6% | 3,99 | 31,8% | 2,6 | 0,66 |
| bound-struggle-spazienzio | ctx-spazienzio | struggle | 0,503 [0,488–0,517] | 24,9% | 3,72 | 43,4% | 0,1 | 0,03 |
| bound-veleno-2-spazienzio | ctx-spazienzio | veleno-2 | 0,537 [0,524–0,551] | 15,3% | 1,62 | 15,5% | 1,4 | 0,89 |
| bound-veleno-5-spazienzio | ctx-spazienzio | veleno-5 | 0,658 [0,644–0,671] | 15,9% | 1,53 | 15,2% | 6,1 | 4,00 |
| bound-danno-2-mara | ctx-mara | danno-2 | 0,616 [0,603–0,630] | 17,4% | 2,75 | 25,5% | 3,4 | 1,23 |
| bound-danno-4-mara | ctx-mara | danno-4 | 0,813 [0,802–0,823] | 13,0% | 3,13 | 30,8% | 9,1 | 2,91 |
| bound-danno-6-mara | ctx-mara | danno-6 | 0,931 [0,924–0,937] | 8,4% | 3,13 | 33,6% | saturato | — |
| bound-danno-8-mara | ctx-mara | danno-8 | 0,978 [0,974–0,982] | 4,5% | 3,05 | 35,6% | saturato | — |
| bound-danno-10-mara | ctx-mara | danno-10 | 0,989 [0,986–0,991] | 2,7% | 3,25 | 40,7% | saturato | — |
| bound-risorsa-2-mara | ctx-mara | risorsa-2 | 0,499 [0,485–0,513] | 17,5% | 0,57 | 4,9% | -0,0 | -0,05 |
| bound-risorsa-4-mara | ctx-mara | risorsa-4 | 0,475 [0,461–0,489] | 17,6% | 0,76 | 6,6% | -0,7 | -0,95 |
| bound-risorsa-6-mara | ctx-mara | risorsa-6 | 0,476 [0,462–0,490] | 17,4% | 0,87 | 7,6% | -0,7 | -0,82 |
| bound-risorsa-8-mara | ctx-mara | risorsa-8 | 0,473 [0,459–0,487] | 17,3% | 0,91 | 8,0% | -0,8 | -0,86 |
| bound-risorsa-10-mara | ctx-mara | risorsa-10 | 0,471 [0,457–0,485] | 17,2% | 1,38 | 12,1% | -0,9 | -0,62 |
| bound-parata-0.75-mara | ctx-mara | parata-0.75 | 0,390 [0,377–0,404] | 13,0% | 4,08 | 32,6% | -3,2 | -0,78 |
| bound-parata-0.5-mara | ctx-mara | parata-0.5 | 0,485 [0,471–0,499] | 14,2% | 3,94 | 30,4% | -0,4 | -0,11 |
| bound-parata-0.25-mara | ctx-mara | parata-0.25 | 0,653 [0,640–0,667] | 17,2% | 3,24 | 25,2% | 4,5 | 1,38 |
| bound-struggle-mara | ctx-mara | struggle | 0,744 [0,732–0,756] | 18,3% | 3,11 | 40,2% | 7,1 | 2,29 |
| bound-attuale-LittleSmack-spazienzio | ctx-spazienzio | bruiser.character.LittleSmack | 0,514 [0,500–0,528] | 17,7% | 4,03 | 38,5% | 0,6 | 0,14 |
| bound-attuale-LittleRage-spazienzio | ctx-spazienzio | bruiser.character.LittleRage | 0,615 [0,601–0,628] | 15,7% | 3,00 | 27,7% | 4,4 | 1,49 |
| bound-attuale-PatheticBlade-tossico | ctx-tossico | junkie.character.PatheticBlade | 0,596 [0,583–0,610] | 12,0% | 5,80 | 43,4% | 2,7 | 0,46 |
| bound-attuale-RottenSmile-tossico | ctx-tossico | junkie.character.RottenSmile | 0,301 [0,288–0,314] | 22,2% | 5,24 | 32,6% | -5,5 | -1,05 |
| bound-attuale-ColpoDiStriscio-mara | ctx-mara | prova.mara.ColpoDiStriscio | 0,818 [0,807–0,828] | 14,2% | 3,42 | 33,6% | 9,3 | 2,71 |
| bound-attuale-Scarto-mara | ctx-mara | prova.mara.Scarto | 0,360 [0,348–0,373] | 12,2% | 3,82 | 31,7% | -4,1 | -1,07 |
| bound-attuale-Colpetto-rocco | ctx-rocco | prova.rocco.Colpetto | 0,751 [0,739–0,762] | 13,5% | 2,52 | 26,8% | 10,1 | 4,01 |
| bound-attuale-Fiato-rocco | ctx-rocco | prova.rocco.Fiato | 0,682 [0,669–0,695] | 17,2% | 1,64 | 15,8% | 7,3 | 4,48 |
| bound-attuale-Colpetto-neutro | ctx-neutro | sonda.neutro.Colpetto | 1,000 [0,999–1,000] | 0,0% | 6,38 | 38,4% | saturato | — |
| bound-attuale-Riparo-neutro | ctx-neutro | sonda.neutro.Riparo | 0,239 [0,225–0,253] | 42,7% | 7,21 | 35,8% | -5,5 | -0,76 |

## Handicap per il non specchio

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| handicap-20 | ctx-spazienzio | Spazienzio con 20 HEALTH in meno contro Mara | 0,709 [0,696–0,721] | 17,0% | 0,00 | 0,0% | 8,1 | — |
| handicap-30 | ctx-spazienzio | Spazienzio con 30 HEALTH in meno contro Mara | 0,377 [0,364–0,391] | 16,8% | 0,00 | 0,0% | -4,8 | — |
| handicap-40 | ctx-spazienzio | Spazienzio con 40 HEALTH in meno contro Mara | 0,122 [0,113–0,131] | 11,5% | 0,00 | 0,0% | -14,7 | — |
| handicap-50 | ctx-spazienzio | Spazienzio con 50 HEALTH in meno contro Mara | 0,025 [0,021–0,029] | 5,1% | 0,00 | 0,0% | saturato | — |
| handicap-60 | ctx-spazienzio | Spazienzio con 60 HEALTH in meno contro Mara | 0,004 [0,002–0,006] | 1,1% | 0,00 | 0,0% | saturato | — |

## Slot della mano

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| slot-morte-neutro | ctx-neutro | 4 carte morte contro 4 carte di passo | 0,568 [0,551–0,586] | 48,7% | 0,00 | 0,0% | 1,4 | — |
| slot-passo-neutro | ctx-neutro | 4 carte di passo contro 4 àncore | 0,005 [0,003–0,007] | 0,7% | 0,00 | 0,0% | saturato | — |
| slot-morte-spazienzio | ctx-spazienzio | 4 carte morte contro 4 carte di passo | 0,515 [0,500–0,530] | 25,5% | 0,00 | 0,0% | 0,6 | — |
| slot-passo-spazienzio | ctx-spazienzio | 4 carte di passo contro 4 àncore | 0,256 [0,244–0,269] | 20,9% | 0,00 | 0,0% | -9,4 | — |
| slot-morte-mara | ctx-mara | 4 carte morte contro 4 carte di passo | 0,295 [0,282–0,307] | 14,7% | 0,00 | 0,0% | -6,0 | — |
| slot-passo-mara | ctx-mara | 4 carte di passo contro 4 àncore | 0,113 [0,105–0,122] | 9,6% | 0,00 | 0,0% | -11,3 | — |

## Tetto delle bound contro il manichino

Parametri: 5 unità ±20%; pesi V 1 · A 1 · T 1 se immune, 0 se no · L 0,5 · HEALTH 1.

| bound | personaggio | valore per uso (medio / massimo) | danno | parato | guadagni pesati | viola | motivi |
|---|---|---:|---:|---:|---:|---|---|
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 8,00 / 8,00 | 0,00 | 3,00 | 5,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 10,00 / 10,00 | 5,00 | 0,00 | 5,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| junkie.character.PatheticBlade | junkie.character.ToxicJunkie | 21,00 / 30,00 | 16,00 | 0,00 | 5,00 | sì | valore per uso 30,00 oltre il tetto 6,00; si accumula: danno 7,00 al primo uso, 25,00 all'uso 8; resta sull'avversario: T +40 |
| junkie.character.RottenSmile | junkie.character.ToxicJunkie | 5,00 / 5,00 | 0,00 | 0,00 | 5,00 | sì | resta sull'avversario: A -40 |
| listino.bound.danno-10-mara | prova.mara | 10,00 / 10,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| listino.bound.danno-10-neutro | sonda.neutro | 10,00 / 10,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| listino.bound.danno-10-spazienzio | bruiser.character.BigBadBruiser | 10,00 / 10,00 | 10,00 | 0,00 | 0,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| listino.bound.danno-2-mara | prova.mara | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-2-neutro | sonda.neutro | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-2-spazienzio | bruiser.character.BigBadBruiser | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-4-mara | prova.mara | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-4-neutro | sonda.neutro | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-4-spazienzio | bruiser.character.BigBadBruiser | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-6-mara | prova.mara | 6,00 / 6,00 | 6,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-6-neutro | sonda.neutro | 6,00 / 6,00 | 6,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-6-spazienzio | bruiser.character.BigBadBruiser | 6,00 / 6,00 | 6,00 | 0,00 | 0,00 | no |  |
| listino.bound.danno-8-mara | prova.mara | 8,00 / 8,00 | 8,00 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.danno-8-neutro | sonda.neutro | 8,00 / 8,00 | 8,00 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.danno-8-spazienzio | bruiser.character.BigBadBruiser | 8,00 / 8,00 | 8,00 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.parata-0.25-mara | prova.mara | 8,00 / 8,00 | 0,00 | 8,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.parata-0.25-neutro | sonda.neutro | 8,00 / 8,00 | 0,00 | 8,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.parata-0.25-spazienzio | bruiser.character.BigBadBruiser | 8,00 / 8,00 | 0,00 | 8,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.parata-0.5-mara | prova.mara | 5,00 / 5,00 | 0,00 | 5,00 | 0,00 | no |  |
| listino.bound.parata-0.5-neutro | sonda.neutro | 5,00 / 5,00 | 0,00 | 5,00 | 0,00 | no |  |
| listino.bound.parata-0.5-spazienzio | bruiser.character.BigBadBruiser | 5,00 / 5,00 | 0,00 | 5,00 | 0,00 | no |  |
| listino.bound.parata-0.75-mara | prova.mara | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| listino.bound.parata-0.75-neutro | sonda.neutro | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| listino.bound.parata-0.75-spazienzio | bruiser.character.BigBadBruiser | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| listino.bound.risorsa-10-mara | prova.mara | 10,00 / 10,00 | 0,00 | 0,00 | 10,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| listino.bound.risorsa-10-neutro | sonda.neutro | 10,00 / 10,00 | 0,00 | 0,00 | 10,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| listino.bound.risorsa-10-spazienzio | bruiser.character.BigBadBruiser | 10,00 / 10,00 | 0,00 | 0,00 | 10,00 | sì | valore per uso 10,00 oltre il tetto 6,00 |
| listino.bound.risorsa-2-mara | prova.mara | 2,00 / 2,00 | 0,00 | 0,00 | 2,00 | no |  |
| listino.bound.risorsa-2-neutro | sonda.neutro | 2,00 / 2,00 | 0,00 | 0,00 | 2,00 | no |  |
| listino.bound.risorsa-2-spazienzio | bruiser.character.BigBadBruiser | 2,00 / 2,00 | 0,00 | 0,00 | 2,00 | no |  |
| listino.bound.risorsa-4-mara | prova.mara | 4,00 / 4,00 | 0,00 | 0,00 | 4,00 | no |  |
| listino.bound.risorsa-4-neutro | sonda.neutro | 4,00 / 4,00 | 0,00 | 0,00 | 4,00 | no |  |
| listino.bound.risorsa-4-spazienzio | bruiser.character.BigBadBruiser | 4,00 / 4,00 | 0,00 | 0,00 | 4,00 | no |  |
| listino.bound.risorsa-6-mara | prova.mara | 6,00 / 6,00 | 0,00 | 0,00 | 6,00 | no |  |
| listino.bound.risorsa-6-neutro | sonda.neutro | 6,00 / 6,00 | 0,00 | 0,00 | 6,00 | no |  |
| listino.bound.risorsa-6-spazienzio | bruiser.character.BigBadBruiser | 6,00 / 6,00 | 0,00 | 0,00 | 6,00 | no |  |
| listino.bound.risorsa-8-mara | prova.mara | 8,00 / 8,00 | 0,00 | 0,00 | 8,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.risorsa-8-neutro | sonda.neutro | 8,00 / 8,00 | 0,00 | 0,00 | 8,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.risorsa-8-spazienzio | bruiser.character.BigBadBruiser | 8,00 / 8,00 | 0,00 | 0,00 | 8,00 | sì | valore per uso 8,00 oltre il tetto 6,00 |
| listino.bound.struggle-mara | prova.mara | 5,00 / 5,00 | 10,00 | 0,00 | 0,00 | no |  |
| listino.bound.struggle-neutro | sonda.neutro | 5,00 / 5,00 | 10,00 | 0,00 | 0,00 | no |  |
| listino.bound.struggle-spazienzio | bruiser.character.BigBadBruiser | 5,00 / 5,00 | 10,00 | 0,00 | 0,00 | no |  |
| listino.bound.veleno-2-mara | prova.mara | 4,50 / 8,00 | 4,50 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00; si accumula: danno 1,00 al primo uso, 8,00 all'uso 8; resta sull'avversario: T +16 |
| listino.bound.veleno-2-neutro | sonda.neutro | 4,50 / 8,00 | 4,50 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00; si accumula: danno 1,00 al primo uso, 8,00 all'uso 8; resta sull'avversario: T +16 |
| listino.bound.veleno-2-spazienzio | bruiser.character.BigBadBruiser | 4,50 / 8,00 | 4,50 | 0,00 | 0,00 | sì | valore per uso 8,00 oltre il tetto 6,00; si accumula: danno 1,00 al primo uso, 8,00 all'uso 8; resta sull'avversario: T +16 |
| listino.bound.veleno-5-mara | prova.mara | 11,00 / 20,00 | 11,00 | 0,00 | 0,00 | sì | valore per uso 20,00 oltre il tetto 6,00; si accumula: danno 2,00 al primo uso, 20,00 all'uso 8; resta sull'avversario: T +40 |
| listino.bound.veleno-5-neutro | sonda.neutro | 11,00 / 20,00 | 11,00 | 0,00 | 0,00 | sì | valore per uso 20,00 oltre il tetto 6,00; si accumula: danno 2,00 al primo uso, 20,00 all'uso 8; resta sull'avversario: T +40 |
| listino.bound.veleno-5-spazienzio | bruiser.character.BigBadBruiser | 11,00 / 20,00 | 11,00 | 0,00 | 0,00 | sì | valore per uso 20,00 oltre il tetto 6,00; si accumula: danno 2,00 al primo uso, 20,00 all'uso 8; resta sull'avversario: T +40 |
| prova.mara.ColpoDiStriscio | prova.mara | 5,00 / 5,00 | 5,00 | 0,00 | 0,00 | no |  |
| prova.mara.Scarto | prova.mara | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
| prova.rocco.Colpetto | prova.rocco | 5,00 / 5,00 | 5,00 | 0,00 | 0,00 | no |  |
| prova.rocco.Fiato | prova.rocco | 5,00 / 5,00 | 0,00 | 0,00 | 0,00 | no | cura |
| sonda.neutro.Colpetto | sonda.neutro | 5,00 / 5,00 | 5,00 | 0,00 | 0,00 | no |  |
| sonda.neutro.Riparo | sonda.neutro | 3,00 / 3,00 | 0,00 | 3,00 | 0,00 | no |  |
