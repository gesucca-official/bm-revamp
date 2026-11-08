# Listino di potenza SB-10a — misure

> SB-13 giro 2 (bozza 115d7771)

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `server/derivata dalla bozza bozza.json, contesti del listino, ancora 7 HIT` |
| SHA-256 | `4f8c153e39b2751a3c662b39de4703bb695e7874cbd26c703c9133fecaaaa82b` |
| Àncora | 7 HIT (SB-11a, -Dsim.listinoAnchor; SB-10a e SB-10b: 10) |
| Misure | costo+tipo+salute+veleno+tettostarter+tettoavanzati |
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
| costo-T10-tossico | ctx-tossico | Sonda: costo 10 T, priorità 1, x HIT | 10,4 [10,3–10,5] | 0,34 [0,33–0,35] danni per unità | 0,0890 | 11,0 / 10,5 / 10,1 | 6: 0,128 · 8: 0,238 · 10: 0,470 · 12: 0,673 · 14: 0,805 | dentro l'intervallo |
| costo-T20-tossico | ctx-tossico | Sonda: costo 20 T, priorità 1, x HIT | 17,8 [17,7–18,0] | 0,54 [0,54–0,55] danni per unità | 0,0478 | 18,0 / 19,5 / 16,4 | 12: 0,195 · 15: 0,361 · 18: 0,554 · 21: 0,664 · 24: 0,764 | dentro l'intervallo |
| costo-L5-spazienzio | ctx-spazienzio | Sonda: costo 5 L, priorità 1, x HIT | ≥ 57 | — | 0,0002 | piatta / piatta / piatta | 49: 0,181 · 51: 0,182 · 53: 0,182 · 55: 0,182 · 57: 0,183 | oltre l'intervallo: anche a x = 57 la sonda vale meno del riferimento |

## Tipi di danno

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| tipo-CUT-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x CUT | 8,1 [7,9–8,2] | 0,87 [0,86–0,88] HIT per unità | 0,0550 | 7,5 / 8,7 / 7,8 | 6: 0,393 · 7: 0,436 · 8: 0,495 · 9: 0,547 · 10: 0,613 | dentro l'intervallo |
| tipo-POISON-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x POISON | 7,3 [7,2–7,4] | 0,96 [0,95–0,98] HIT per unità | 0,0626 | 7,2 / 7,3 / 7,2 | 5: 0,362 · 6: 0,422 · 7: 0,477 · 8: 0,544 · 9: 0,614 | dentro l'intervallo |
| tipo-CUT-mara | ctx-mara | Sonda: gratuita, priorità 1, x CUT | 7,1 [7,0–7,1] | 0,99 [0,98–1,00] HIT per unità | 0,0971 | 7,1 / 7,2 / 6,9 | 5: 0,305 · 6: 0,388 · 7: 0,495 · 8: 0,595 · 9: 0,687 | dentro l'intervallo |
| tipo-POISON-mara | ctx-mara | Sonda: gratuita, priorità 1, x POISON | 6,8 [6,8–6,9] | 1,02 [1,01–1,03] HIT per unità | 0,0983 | 7,1 / 6,6 / 6,9 | 5: 0,318 · 6: 0,411 · 7: 0,523 · 8: 0,620 · 9: 0,706 | dentro l'intervallo |

## T al bersaglio

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| veleno-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | 0,3 [0,2–0,4] | 16,99 [11,62–31,55] HIT per 1 T | 0,0645 | 0,5 / -0,3 / 0,9 | 0: 0,368 · 2: 0,690 · 4: 0,830 · 6: 0,889 · 8: 0,919 | dentro l'intervallo |
| veleno-mara | ctx-mara | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | 0,4 [0,3–0,5] | 13,71 [10,57–19,51] HIT per 1 T | 0,0756 | 0,9 / -0,0 / 0,2 | 0: 0,307 · 2: 0,744 · 4: 0,901 · 6: 0,952 · 8: 0,971 | dentro l'intervallo |
| veleno-tossico | ctx-tossico | Sonda: gratuita, priorità 1, 5 HIT e +x T al bersaglio | ≥ 40 | — | -0,0002 | piatta / piatta / piatta | 32: 0,104 · 34: 0,103 · 36: 0,103 · 38: 0,103 · 40: 0,102 | oltre l'intervallo: anche a x = 40 la sonda vale meno del riferimento |

## Tetto sugli starter veri (SB-11b): ogni bound, o una sonda, e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| tettostarter-LittleRage-spazienzio | starter-spazienzio | bruiser.character.LittleRage | 0,578 [0,565–0,592] | 15,5% | 1,02 | 10,3% | — | — |
| tettostarter-LittleSmack-spazienzio | starter-spazienzio | bruiser.character.LittleSmack | 0,316 [0,304–0,329] | 13,3% | 4,11 | 39,5% | — | — |
| tettostarter-TestaAlMuro-spazienzio | starter-spazienzio | base.spazienzio.bound.TestaAlMuro | 0,543 [0,530–0,557] | 15,5% | 1,05 | 10,9% | — | — |
| tettostarter-danno-3HIT-spazienzio | starter-spazienzio | sonda 3 HIT, priorità 1 | 0,316 [0,304–0,329] | 13,3% | 4,11 | 39,5% | — | — |
| tettostarter-danno-2HIT-spazienzio | starter-spazienzio | sonda 2 HIT, priorità 1 | 0,372 [0,359–0,385] | 13,3% | 3,12 | 30,2% | — | — |
| tettostarter-PassoStretto-mara | starter-mara | base.mara.bound.PassoStretto | 0,694 [0,681–0,706] | 13,9% | 2,32 | 19,5% | — | — |
| tettostarter-CambioMarcia-mara | starter-mara | base.mara.bound.CambioMarcia | 0,679 [0,666–0,691] | 14,8% | 1,64 | 13,4% | — | — |
| tettostarter-ColpoDiStriscio-mara | starter-mara | base.mara.bound.ColpoDiStriscio | 0,640 [0,627–0,653] | 14,8% | 2,40 | 19,7% | — | — |
| tettostarter-danno-3HIT-mara | starter-mara | sonda 3 HIT, priorità 1 | 0,702 [0,689–0,714] | 13,5% | 2,30 | 19,4% | — | — |
| tettostarter-danno-2HIT-mara | starter-mara | sonda 2 HIT, priorità 1 | 0,647 [0,634–0,660] | 14,6% | 2,39 | 19,6% | — | — |

## Tetto sugli starter avanzati (SB-13): ogni bound, o una sonda, e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| tettoavanzati-PatheticBlade-tossico | starter-tossico | junkie.character.PatheticBlade | 0,709 [0,696–0,722] | 24,0% | 5,08 | 29,0% | — | — |
| tettoavanzati-RaschiareIlFondo-tossico | starter-tossico | base.tossico.bound.RaschiareIlFondo | 0,661 [0,648–0,675] | 22,7% | 1,80 | 10,2% | — | — |
| tettoavanzati-RottenSmile-tossico | starter-tossico | junkie.character.RottenSmile | 0,651 [0,637–0,664] | 24,2% | 4,45 | 24,9% | — | — |
| tettoavanzati-danno-3HIT-tossico | starter-tossico | sonda 3 HIT, priorità 1 | 0,709 [0,696–0,722] | 24,0% | 5,08 | 29,0% | — | — |
| tettoavanzati-danno-2HIT-tossico | starter-tossico | sonda 2 HIT, priorità 1 | 0,650 [0,636–0,663] | 24,2% | 4,47 | 24,9% | — | — |

## Salute iniziale (moneta comune)

Pendenza per contesto, retta per (0; 0,5): ctx-spazienzio 2,01 ± 0,09 punti per 1 HEALTH; ctx-mara 3,36 ± 0,09 punti per 1 HEALTH; ctx-tossico 1,94 ± 0,10 punti per 1 HEALTH.

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
| salute-10-tossico | ctx-tossico | HEALTH iniziale -10 | 0,287 [0,273–0,302] | 38,9% | — | — | — | — |
| salute-5-tossico | ctx-tossico | HEALTH iniziale -5 | 0,413 [0,396–0,430] | 43,2% | — | — | — | — |
| salute+5-tossico | ctx-tossico | HEALTH iniziale +5 | 0,585 [0,568–0,601] | 43,0% | — | — | — | — |
| salute+10-tossico | ctx-tossico | HEALTH iniziale +10 | 0,686 [0,670–0,701] | 41,7% | — | — | — | — |
