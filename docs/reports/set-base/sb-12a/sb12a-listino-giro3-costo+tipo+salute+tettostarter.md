# Listino di potenza SB-10a — misure

> SB-12a: listino con l'àncora a 7 HIT sugli starter corretti (bozza set-base/bozza.json, SHA-256 441b1ecd…ef4841cf4); tetto sugli starter veri

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `server/derivata dalla bozza bozza.json, contesti del listino, ancora 7 HIT` |
| SHA-256 | `5be5c747772093bf1a10172b6792ed307ec6ed0beb65c1671503781fa78c1e8f` |
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
| costo-V10-spazienzio | ctx-spazienzio | Sonda: costo 10 V, priorità 1, x HIT | 17,9 [17,7–18,0] | 1,09 [1,07–1,10] danni per unità | 0,0418 | 15,2 / 20,7 / 16,4 | 14: 0,338 · 16: 0,415 · 18: 0,516 · 20: 0,596 · 22: 0,665 | dentro l'intervallo |
| costo-V20-spazienzio | ctx-spazienzio | Sonda: costo 20 V, priorità 1, x HIT | 37,3 [37,2–37,5] | 1,52 [1,51–1,52] danni per unità | 0,0216 | 36,9 / 45,2 / 31,5 | 30: 0,338 · 33: 0,408 · 36: 0,478 · 39: 0,533 · 42: 0,599 | dentro l'intervallo |
| costo-V30-spazienzio | ctx-spazienzio | Sonda: costo 30 V, priorità 1, x HIT | 72,9 [72,1–73,7] | 2,20 [2,17–2,22] danni per unità | 0,0072 | 69,1 / 131,4 / 33,4 | 66: 0,452 · 69: 0,471 · 72: 0,490 · 75: 0,518 · 78: 0,537 | dentro l'intervallo |
| costo-A10-mara | ctx-mara | Sonda: costo 10 A, priorità 1, x HIT | 16,6 [16,5–16,7] | 0,96 [0,95–0,97] danni per unità | 0,0620 | 15,5 / 20,1 / 15,3 | 12: 0,222 · 14: 0,332 · 16: 0,460 · 18: 0,595 · 20: 0,711 | dentro l'intervallo |
| costo-A20-mara | ctx-mara | Sonda: costo 20 A, priorità 1, x HIT | 29,5 [29,4–29,6] | 1,13 [1,12–1,13] danni per unità | 0,0365 | 27,8 / 35,2 / 27,9 | 24: 0,306 · 27: 0,394 · 30: 0,518 · 33: 0,640 · 36: 0,731 | dentro l'intervallo |
| costo-A10-spazienzio | ctx-spazienzio | Sonda: costo 10 A, priorità 1, x HIT | 8,8 [8,6–9,0] | 0,18 [0,16–0,20] danni per unità | 0,0374 | 8,0 / 11,9 / 6,9 | 4: 0,322 · 6: 0,397 · 8: 0,468 · 10: 0,537 · 12: 0,626 | dentro l'intervallo |
| costo-L5-spazienzio | ctx-spazienzio | Sonda: costo 5 L, priorità 1, x HIT | ≥ 57 | — | 0,0002 | piatta / piatta / piatta | 49: 0,181 · 51: 0,182 · 53: 0,182 · 55: 0,182 · 57: 0,183 | oltre l'intervallo: anche a x = 57 la sonda vale meno del riferimento |

## Tipi di danno

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| tipo-CUT-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x CUT | 8,1 [7,9–8,2] | 0,87 [0,86–0,88] HIT per unità | 0,0550 | 7,5 / 8,7 / 7,8 | 6: 0,393 · 7: 0,436 · 8: 0,495 · 9: 0,547 · 10: 0,613 | dentro l'intervallo |
| tipo-POISON-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 1, x POISON | 7,3 [7,2–7,4] | 0,96 [0,95–0,98] HIT per unità | 0,0626 | 7,2 / 7,3 / 7,2 | 5: 0,362 · 6: 0,422 · 7: 0,477 · 8: 0,544 · 9: 0,614 | dentro l'intervallo |
| tipo-CUT-mara | ctx-mara | Sonda: gratuita, priorità 1, x CUT | 7,1 [7,0–7,1] | 0,99 [0,98–1,00] HIT per unità | 0,0962 | 7,1 / 7,2 / 6,8 | 5: 0,306 · 6: 0,392 · 7: 0,495 · 8: 0,596 · 9: 0,685 | dentro l'intervallo |
| tipo-POISON-mara | ctx-mara | Sonda: gratuita, priorità 1, x POISON | 6,8 [6,8–6,9] | 1,02 [1,01–1,03] HIT per unità | 0,0975 | 7,1 / 6,6 / 6,8 | 5: 0,319 · 6: 0,414 · 7: 0,523 · 8: 0,621 · 9: 0,703 | dentro l'intervallo |

## Tetto sugli starter veri (SB-11b): ogni bound, o una sonda, e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| tettostarter-LittleRage-spazienzio | starter-spazienzio | bruiser.character.LittleRage | 0,578 [0,565–0,592] | 15,5% | 1,02 | 10,3% | — | — |
| tettostarter-LittleSmack-spazienzio | starter-spazienzio | bruiser.character.LittleSmack | 0,316 [0,304–0,329] | 13,3% | 4,11 | 39,5% | — | — |
| tettostarter-TestaAlMuro-spazienzio | starter-spazienzio | base.spazienzio.bound.TestaAlMuro | 0,543 [0,530–0,557] | 15,5% | 1,05 | 10,9% | — | — |
| tettostarter-danno-3HIT-spazienzio | starter-spazienzio | sonda 3 HIT, priorità 1 | 0,316 [0,304–0,329] | 13,3% | 4,11 | 39,5% | — | — |
| tettostarter-danno-2HIT-spazienzio | starter-spazienzio | sonda 2 HIT, priorità 1 | 0,372 [0,359–0,385] | 13,3% | 3,12 | 30,2% | — | — |
| tettostarter-PassoStretto-mara | starter-mara | base.mara.bound.PassoStretto | 0,694 [0,681–0,706] | 13,9% | 2,32 | 19,5% | — | — |
| tettostarter-CambioMarcia-mara | starter-mara | base.mara.bound.CambioMarcia | 0,723 [0,710–0,735] | 13,9% | 1,49 | 12,7% | — | — |
| tettostarter-ColpoDiStriscio-mara | starter-mara | base.mara.bound.ColpoDiStriscio | 0,640 [0,627–0,653] | 14,8% | 2,40 | 19,7% | — | — |
| tettostarter-danno-3HIT-mara | starter-mara | sonda 3 HIT, priorità 1 | 0,702 [0,689–0,714] | 13,5% | 2,30 | 19,4% | — | — |
| tettostarter-danno-2HIT-mara | starter-mara | sonda 2 HIT, priorità 1 | 0,647 [0,634–0,660] | 14,6% | 2,39 | 19,6% | — | — |

## Salute iniziale (moneta comune)

Pendenza per contesto, retta per (0; 0,5): ctx-spazienzio 2,01 ± 0,09 punti per 1 HEALTH; ctx-mara 3,33 ± 0,09 punti per 1 HEALTH.

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| salute-10-spazienzio | ctx-spazienzio | HEALTH iniziale -10 | 0,273 [0,261–0,286] | 14,8% | — | — | — | — |
| salute-5-spazienzio | ctx-spazienzio | HEALTH iniziale -5 | 0,375 [0,362–0,389] | 15,6% | — | — | — | — |
| salute+5-spazienzio | ctx-spazienzio | HEALTH iniziale +5 | 0,581 [0,567–0,595] | 16,1% | — | — | — | — |
| salute+10-spazienzio | ctx-spazienzio | HEALTH iniziale +10 | 0,672 [0,659–0,685] | 15,4% | — | — | — | — |
| salute-10-mara | ctx-mara | HEALTH iniziale -10 | 0,185 [0,175–0,196] | 13,1% | — | — | — | — |
| salute-5-mara | ctx-mara | HEALTH iniziale -5 | 0,323 [0,310–0,336] | 17,5% | — | — | — | — |
| salute+5-mara | ctx-mara | HEALTH iniziale +5 | 0,691 [0,678–0,704] | 17,2% | — | — | — | — |
| salute+10-mara | ctx-mara | HEALTH iniziale +10 | 0,835 [0,824–0,845] | 13,4% | — | — | — | — |
