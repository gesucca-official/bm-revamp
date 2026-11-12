# Listino di potenza SB-10a — misure

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `server/derivata dalla bozza bozza.json, contesti del listino, ancora 7 HIT` |
| SHA-256 | `679f3bff0e61703d7634b1ff1290573244c6bc94264cb96372bd49866bb61a68` |
| Àncora | 7 HIT (SB-11a, -Dsim.listinoAnchor; SB-10a e SB-10b: 10) |
| Misure | priorita+allerta |
| Stili | aggressivo, prudente, risorse, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Priorità

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| priorita-0-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 0, x HIT | 7,3 [7,2–7,5] | 0,3 [0,2–0,5] HIT rispetto alla priorità 1 | 0,0581 | 7,3 / 7,6 / 7,1 | 6: 0,425 · 7: 0,474 · 8: 0,540 · 9: 0,597 · 10: 0,654 | dentro l'intervallo |
| priorita-2-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 2, x HIT | 6,8 [6,7–6,9] | -0,2 [-0,3–-0,1] HIT rispetto alla priorità 1 | 0,0613 | 6,9 / 6,9 / 6,6 | 5: 0,391 · 6: 0,451 · 7: 0,506 · 8: 0,576 · 9: 0,635 | dentro l'intervallo |
| priorita-0-mara | ctx-mara | Sonda: gratuita, priorità 0, x HIT | 7,3 [7,2–7,3] | 0,3 [0,2–0,3] HIT rispetto alla priorità 1 | 0,0895 | 7,4 / 7,2 / 7,2 | 5: 0,305 · 6: 0,377 · 7: 0,476 · 8: 0,575 · 9: 0,653 | dentro l'intervallo |
| priorita-2-mara | ctx-mara | Sonda: gratuita, priorità 2, x HIT | 6,8 [6,7–6,8] | -0,2 [-0,3–-0,2] HIT rispetto alla priorità 1 | 0,0942 | 6,9 / 6,7 / 6,7 | 5: 0,331 · 6: 0,428 · 7: 0,530 · 8: 0,622 · 9: 0,705 | dentro l'intervallo |

## A iniziale (precedenza)

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| allerta-10-spazienzio | ctx-spazienzio | A iniziale -10 | 0,457 [0,444–0,470] | 2,3% | — | — | — | — |
| allerta-3-spazienzio | ctx-spazienzio | A iniziale -3 | 0,466 [0,453–0,479] | 2,2% | — | — | — | — |
| allerta-1-spazienzio | ctx-spazienzio | A iniziale -1 | 0,468 [0,455–0,481] | 2,3% | — | — | — | — |
| allerta+1-spazienzio | ctx-spazienzio | A iniziale +1 | 0,481 [0,468–0,494] | 2,3% | — | — | — | — |
| allerta+3-spazienzio | ctx-spazienzio | A iniziale +3 | 0,483 [0,470–0,496] | 2,3% | — | — | — | — |
| allerta+10-spazienzio | ctx-spazienzio | A iniziale +10 | 0,493 [0,480–0,506] | 2,7% | — | — | — | — |
| allerta-10-mara | ctx-mara | A iniziale -10 | 0,211 [0,200–0,222] | 6,8% | — | — | — | — |
| allerta-3-mara | ctx-mara | A iniziale -3 | 0,395 [0,383–0,408] | 7,3% | — | — | — | — |
| allerta-1-mara | ctx-mara | A iniziale -1 | 0,437 [0,424–0,450] | 7,4% | — | — | — | — |
| allerta+1-mara | ctx-mara | A iniziale +1 | 0,532 [0,519–0,545] | 7,2% | — | — | — | — |
| allerta+3-mara | ctx-mara | A iniziale +3 | 0,573 [0,560–0,586] | 7,1% | — | — | — | — |
| allerta+10-mara | ctx-mara | A iniziale +10 | 0,746 [0,734–0,757] | 4,4% | — | — | — | — |
