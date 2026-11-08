# Listino di potenza SB-10a — misure

> SB-14 giro 2

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `server/derivata dalla bozza giro2.json, contesti del listino, ancora 7 HIT` |
| SHA-256 | `d5e5033bfd839422974a906ad390c732471cc9f0a8417f656922317b91fc6e07` |
| Àncora | 7 HIT (SB-11a, -Dsim.listinoAnchor; SB-10a e SB-10b: 10) |
| Misure | costo+salute+tettoavanzati |
| Stili | aggressivo, prudente, risorse, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Danno per unità di risorsa pagata

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| costo-V10-spazienzio | ctx-spazienzio | Sonda: costo 10 V, priorità 1, x HIT | 17,9 [17,7–18,0] | 1,09 [1,07–1,10] danni per unità | 0,0418 | 15,2 / 20,7 / 16,4 | 14: 0,338 · 16: 0,415 · 18: 0,516 · 20: 0,596 · 22: 0,665 | dentro l'intervallo |
| costo-V20-spazienzio | ctx-spazienzio | Sonda: costo 20 V, priorità 1, x HIT | 37,3 [37,2–37,5] | 1,52 [1,51–1,52] danni per unità | 0,0216 | 36,9 / 45,2 / 31,5 | 30: 0,338 · 33: 0,408 · 36: 0,478 · 39: 0,533 · 42: 0,599 | dentro l'intervallo |
| costo-V30-spazienzio | ctx-spazienzio | Sonda: costo 30 V, priorità 1, x HIT | 72,9 [72,1–73,7] | 2,20 [2,17–2,22] danni per unità | 0,0072 | 69,1 / 131,4 / 33,4 | 66: 0,452 · 69: 0,471 · 72: 0,490 · 75: 0,518 · 78: 0,537 | dentro l'intervallo |
| costo-A10-mara | ctx-mara | Sonda: costo 10 A, priorità 1, x HIT | 17,4 [17,3–17,5] | 1,04 [1,03–1,05] danni per unità | 0,0595 | 16,4 / 20,0 / 16,4 | 14: 0,291 · 16: 0,408 · 18: 0,548 · 20: 0,673 · 22: 0,754 | dentro l'intervallo |
| costo-A20-mara | ctx-mara | Sonda: costo 20 A, priorità 1, x HIT | 30,3 [30,2–30,4] | 1,16 [1,16–1,17] danni per unità | 0,0385 | 29,0 / 35,2 / 29,0 | 24: 0,268 · 27: 0,356 · 30: 0,486 · 33: 0,621 · 36: 0,714 | dentro l'intervallo |
| costo-A10-spazienzio | ctx-spazienzio | Sonda: costo 10 A, priorità 1, x HIT | 8,8 [8,6–9,0] | 0,18 [0,16–0,20] danni per unità | 0,0374 | 8,0 / 11,9 / 6,9 | 4: 0,322 · 6: 0,397 · 8: 0,468 · 10: 0,537 · 12: 0,626 | dentro l'intervallo |
| costo-T10-tossico | ctx-tossico | Sonda: costo 10 T, priorità 1, x HIT | 10,9 [10,9–11,0] | 0,39 [0,39–0,40] danni per unità | 0,0818 | 12,3 / 10,5 / 10,8 | 6: 0,127 · 8: 0,216 · 10: 0,410 · 12: 0,612 · 14: 0,748 | dentro l'intervallo |
| costo-T20-tossico | ctx-tossico | Sonda: costo 20 T, priorità 1, x HIT | 19,7 [19,5–19,8] | 0,63 [0,63–0,64] danni per unità | 0,0450 | 19,8 / 19,5 / 19,7 | 12: 0,154 · 15: 0,276 · 18: 0,445 · 21: 0,566 · 24: 0,685 | dentro l'intervallo |
| costo-L5-spazienzio | ctx-spazienzio | Sonda: costo 5 L, priorità 1, x HIT | ≥ 57 | — | 0,0002 | piatta / piatta / piatta | 49: 0,181 · 51: 0,182 · 53: 0,182 · 55: 0,182 · 57: 0,183 | oltre l'intervallo: anche a x = 57 la sonda vale meno del riferimento |
| costo-L5-pino | ctx-pino | Sonda: costo 5 L, priorità 1, x HIT | 13,4 [13,3–13,5] | 1,28 [1,26–1,30] danni per unità | 0,0678 | 12,2 / 14,9 / 11,8 | 10: 0,272 · 12: 0,382 · 14: 0,567 · 16: 0,675 · 18: 0,804 | dentro l'intervallo |

## Tetto sugli starter avanzati (SB-13): ogni bound, o una sonda, e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| tettoavanzati-PatheticBlade-tossico | starter-tossico | junkie.character.PatheticBlade | 0,709 [0,696–0,722] | 24,0% | 5,08 | 29,0% | — | — |
| tettoavanzati-RaschiareIlFondo-tossico | starter-tossico | base.tossico.bound.RaschiareIlFondo | 0,624 [0,610–0,638] | 22,9% | 1,75 | 9,8% | — | — |
| tettoavanzati-RottenSmile-tossico | starter-tossico | junkie.character.RottenSmile | 0,651 [0,637–0,664] | 24,2% | 4,45 | 24,9% | — | — |
| tettoavanzati-danno-3HIT-tossico | starter-tossico | sonda 3 HIT, priorità 1 | 0,709 [0,696–0,722] | 24,0% | 5,08 | 29,0% | — | — |
| tettoavanzati-danno-2HIT-tossico | starter-tossico | sonda 2 HIT, priorità 1 | 0,650 [0,636–0,663] | 24,2% | 4,47 | 24,9% | — | — |
| tettoavanzati-CinqueMinutiEVado-pino | starter-pino | base.pino.bound.CinqueMinutiEVado | 0,556 [0,539–0,572] | 40,8% | 0,70 | 4,6% | — | — |
| tettoavanzati-SpallataAlBancone-pino | starter-pino | base.pino.bound.SpallataAlBancone | 0,757 [0,743–0,770] | 34,3% | 4,23 | 28,2% | — | — |
| tettoavanzati-Coccio-pino | starter-pino | base.pino.bound.Coccio | 0,674 [0,659–0,689] | 36,4% | 3,64 | 23,9% | — | — |
| tettoavanzati-danno-3HIT-pino | starter-pino | sonda 3 HIT, priorità 1 | 0,757 [0,743–0,770] | 34,3% | 4,23 | 28,2% | — | — |
| tettoavanzati-danno-2HIT-pino | starter-pino | sonda 2 HIT, priorità 1 | 0,647 [0,632–0,663] | 37,1% | 3,64 | 23,8% | — | — |

## Salute iniziale (moneta comune)

Pendenza per contesto, retta per (0; 0,5): ctx-spazienzio 2,01 ± 0,09 punti per 1 HEALTH; ctx-mara 3,36 ± 0,09 punti per 1 HEALTH; ctx-tossico 1,97 ± 0,10 punti per 1 HEALTH; ctx-pino 3,20 ± 0,10 punti per 1 HEALTH.

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| salute-10-spazienzio | ctx-spazienzio | HEALTH iniziale -10 | 0,273 [0,261–0,286] | 14,8% | — | — | — | — |
| salute-5-spazienzio | ctx-spazienzio | HEALTH iniziale -5 | 0,375 [0,362–0,389] | 15,6% | — | — | — | — |
| salute+5-spazienzio | ctx-spazienzio | HEALTH iniziale +5 | 0,581 [0,567–0,595] | 16,1% | — | — | — | — |
| salute+10-spazienzio | ctx-spazienzio | HEALTH iniziale +10 | 0,672 [0,659–0,685] | 15,4% | — | — | — | — |
| salute-10-mara | ctx-mara | HEALTH iniziale -10 | 0,182 [0,172–0,193] | 13,0% | — | — | — | — |
| salute-5-mara | ctx-mara | HEALTH iniziale -5 | 0,321 [0,308–0,334] | 17,5% | — | — | — | — |
| salute+5-mara | ctx-mara | HEALTH iniziale +5 | 0,692 [0,679–0,705] | 17,5% | — | — | — | — |
| salute+10-mara | ctx-mara | HEALTH iniziale +10 | 0,838 [0,828–0,848] | 13,8% | — | — | — | — |
| salute-10-tossico | ctx-tossico | HEALTH iniziale -10 | 0,277 [0,263–0,291] | 36,9% | — | — | — | — |
| salute-5-tossico | ctx-tossico | HEALTH iniziale -5 | 0,408 [0,392–0,424] | 41,2% | — | — | — | — |
| salute+5-tossico | ctx-tossico | HEALTH iniziale +5 | 0,586 [0,569–0,602] | 40,0% | — | — | — | — |
| salute+10-tossico | ctx-tossico | HEALTH iniziale +10 | 0,678 [0,663–0,693] | 38,7% | — | — | — | — |
| salute-10-pino | ctx-pino | HEALTH iniziale -10 | 0,179 [0,168–0,191] | 28,2% | — | — | — | — |
| salute-5-pino | ctx-pino | HEALTH iniziale -5 | 0,315 [0,301–0,330] | 34,8% | — | — | — | — |
| salute+5-pino | ctx-pino | HEALTH iniziale +5 | 0,663 [0,648–0,677] | 35,4% | — | — | — | — |
| salute+10-pino | ctx-pino | HEALTH iniziale +10 | 0,807 [0,795–0,819] | 30,0% | — | — | — | — |
