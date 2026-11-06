# Listino di potenza SB-10a — misure

> SB-11b fase A: listino con l'àncora a 7 HIT sui contesti degli starter nuovi (bozza set-base/bozza.json, SHA-256 7d3fe0cd…2b42b8c); tetto sugli starter veri

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `server/derivata dalla bozza bozza.json, contesti del listino, ancora 7 HIT` |
| SHA-256 | `b9b21a32246d3f71b83c264e533515efb5f07c7776ce986e41f6cdb3e1a06673` |
| Àncora | 7 HIT (SB-11a, -Dsim.listinoAnchor; SB-10a e SB-10b: 10) |
| Misure | costo+tipo+salute+tettostarter |
| Stili | aggressivo, prudente, risorse, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Danno per unità di risorsa pagata

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| costo-V10-spazienzio | ctx-spazienzio | Sonda: costo 10 V, priorità 1, x HIT | 18,4 [18,3–18,6] | 1,14 [1,13–1,16] danni per unità | 0,0437 | 15,3 / 21,7 / 17,4 | 14: 0,313 · 16: 0,383 · 18: 0,480 · 20: 0,573 · 22: 0,656 | dentro l'intervallo |
| costo-V20-spazienzio | ctx-spazienzio | Sonda: costo 20 V, priorità 1, x HIT | 38,9 [38,8–39,1] | 1,60 [1,59–1,60] danni per unità | 0,0241 | 38,1 / 44,0 / 34,4 | 33: 0,362 · 36: 0,424 · 39: 0,490 · 42: 0,591 · 45: 0,640 | dentro l'intervallo |
| costo-V30-spazienzio | ctx-spazienzio | Sonda: costo 30 V, priorità 1, x HIT | 75,7 [75,0–76,4] | 2,29 [2,27–2,31] danni per unità | 0,0086 | 73,0 / 107,7 / 31,1 | 69: 0,441 · 72: 0,465 · 75: 0,496 · 78: 0,525 · 81: 0,541 | dentro l'intervallo |
| costo-A10-mara | ctx-mara | Sonda: costo 10 A, priorità 1, x HIT | 16,7 [16,6–16,8] | 0,97 [0,96–0,98] danni per unità | 0,0692 | 16,6 / 19,1 / 15,5 | 12: 0,166 · 14: 0,304 · 16: 0,463 · 18: 0,607 · 20: 0,707 | dentro l'intervallo |
| costo-A20-mara | ctx-mara | Sonda: costo 20 A, priorità 1, x HIT | 30,0 [29,9–30,1] | 1,15 [1,15–1,16] danni per unità | 0,0355 | 29,5 / 32,2 / 29,2 | 24: 0,274 · 27: 0,393 · 30: 0,514 · 33: 0,622 · 36: 0,693 | dentro l'intervallo |
| costo-A10-spazienzio | ctx-spazienzio | Sonda: costo 10 A, priorità 1, x HIT | 8,8 [8,6–9,0] | 0,18 [0,16–0,20] danni per unità | 0,0387 | 7,9 / 13,5 / 7,1 | 4: 0,306 · 6: 0,397 · 8: 0,478 · 10: 0,543 · 12: 0,619 | dentro l'intervallo |
| costo-L5-spazienzio | ctx-spazienzio | Sonda: costo 5 L, priorità 1, x HIT | ≥ 57 | — | 0,0003 | piatta / piatta / piatta | 49: 0,138 · 51: 0,138 · 53: 0,138 · 55: 0,139 · 57: 0,140 | oltre l'intervallo: anche a x = 57 la sonda vale meno del riferimento |

## Tipi di danno

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| tipo-CUT-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x CUT | 8,2 [8,1–8,3] | 0,85 [0,84–0,87] HIT per unità | 0,0562 | 7,7 / 8,8 / 8,2 | 6: 0,377 · 7: 0,433 · 8: 0,492 · 9: 0,540 · 10: 0,604 | dentro l'intervallo |
| tipo-POISON-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x POISON | 7,3 [7,2–7,4] | 0,95 [0,94–0,97] HIT per unità | 0,0637 | 7,3 / 7,3 / 7,3 | 5: 0,350 · 6: 0,414 · 7: 0,483 · 8: 0,543 · 9: 0,604 | dentro l'intervallo |
| tipo-CUT-mara | ctx-mara | Sonda: gratuita, priorità 1, x CUT | 7,0 [7,0–7,1] | 0,99 [0,99–1,00] HIT per unità | 0,1390 | 7,0 / 7,1 / 7,0 | 5: 0,228 · 6: 0,334 · 7: 0,494 · 8: 0,641 · 9: 0,770 | dentro l'intervallo |
| tipo-POISON-mara | ctx-mara | Sonda: gratuita, priorità 1, x POISON | 6,9 [6,8–6,9] | 1,02 [1,01–1,02] HIT per unità | 0,1395 | 7,0 / 6,7 / 7,0 | 5: 0,244 · 6: 0,357 · 7: 0,519 · 8: 0,663 · 9: 0,789 | dentro l'intervallo |

## Tetto sugli starter veri (SB-11b): ogni bound, o una sonda, e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| tettostarter-LittleRage-spazienzio | starter-spazienzio | bruiser.character.LittleRage | 0,597 [0,583–0,610] | 16,3% | 1,37 | 11,5% | — | — |
| tettostarter-LittleSmack-spazienzio | starter-spazienzio | bruiser.character.LittleSmack | 0,281 [0,269–0,294] | 13,4% | 5,03 | 40,2% | — | — |
| tettostarter-TestaAlMuro-spazienzio | starter-spazienzio | base.spazienzio.bound.TestaAlMuro | 0,566 [0,552–0,580] | 15,8% | 1,39 | 12,1% | — | — |
| tettostarter-danno-3HIT-spazienzio | starter-spazienzio | sonda 3 HIT, priorità 1 | 0,281 [0,269–0,294] | 13,4% | 5,03 | 40,2% | — | — |
| tettostarter-danno-2HIT-spazienzio | starter-spazienzio | sonda 2 HIT, priorità 1 | 0,348 [0,336–0,362] | 14,2% | 3,83 | 31,0% | — | — |
| tettostarter-PassoStretto-mara | starter-mara | base.mara.bound.PassoStretto | 0,873 [0,863–0,882] | 20,8% | 5,74 | 32,9% | — | — |
| tettostarter-CambioMarcia-mara | starter-mara | base.mara.bound.CambioMarcia | 0,862 [0,852–0,872] | 18,6% | 3,63 | 21,2% | — | — |
| tettostarter-ColpoDiStriscio-mara | starter-mara | base.mara.bound.ColpoDiStriscio | 0,772 [0,760–0,784] | 25,5% | 5,80 | 32,4% | — | — |
| tettostarter-danno-3HIT-mara | starter-mara | sonda 3 HIT, priorità 1 | 0,885 [0,875–0,893] | 20,1% | 5,72 | 32,9% | — | — |
| tettostarter-danno-2HIT-mara | starter-mara | sonda 2 HIT, priorità 1 | 0,788 [0,775–0,799] | 25,0% | 5,79 | 32,5% | — | — |

## Salute iniziale (moneta comune)

Pendenza per contesto, retta per (0; 0,5): ctx-spazienzio 1,83 ± 0,09 punti per 1 HEALTH; ctx-mara 4,06 ± 0,09 punti per 1 HEALTH.

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| salute-10-spazienzio | ctx-spazienzio | HEALTH iniziale -10 | 0,304 [0,292–0,317] | 16,3% | — | — | — | — |
| salute-5-spazienzio | ctx-spazienzio | HEALTH iniziale -5 | 0,397 [0,383–0,410] | 17,1% | — | — | — | — |
| salute+5-spazienzio | ctx-spazienzio | HEALTH iniziale +5 | 0,582 [0,568–0,595] | 18,9% | — | — | — | — |
| salute+10-spazienzio | ctx-spazienzio | HEALTH iniziale +10 | 0,670 [0,657–0,683] | 18,6% | — | — | — | — |
| salute-10-mara | ctx-mara | HEALTH iniziale -10 | 0,116 [0,107–0,125] | 16,2% | — | — | — | — |
| salute-5-mara | ctx-mara | HEALTH iniziale -5 | 0,272 [0,259–0,285] | 24,1% | — | — | — | — |
| salute+5-mara | ctx-mara | HEALTH iniziale +5 | 0,747 [0,734–0,759] | 26,4% | — | — | — | — |
| salute+10-mara | ctx-mara | HEALTH iniziale +10 | 0,897 [0,889–0,906] | 19,7% | — | — | — | — |
