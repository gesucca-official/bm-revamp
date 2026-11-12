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
| priorita-0-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 0, x HIT | 7,0 [6,9–7,1] | 0,0 [-0,1–0,1] HIT rispetto alla priorità 1 | 0,0671 | 7,0 / 7,3 / 6,7 | 5: 0,367 · 6: 0,431 · 7: 0,489 · 8: 0,565 · 9: 0,635 | dentro l'intervallo |
| priorita-2-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 2, x HIT | 7,0 [6,9–7,0] | -0,0 [-0,1–0,0] HIT rispetto alla priorità 1 | 0,0658 | 7,0 / 7,0 / 6,8 | 5: 0,375 · 6: 0,437 · 7: 0,497 · 8: 0,570 · 9: 0,637 | dentro l'intervallo |
| priorita-0-mara | ctx-mara | Sonda: gratuita, priorità 0, x HIT | 7,1 [7,0–7,1] | 0,1 [-0,0–0,1] HIT rispetto alla priorità 1 | 0,0976 | 7,2 / 7,1 / 6,9 | 5: 0,306 · 6: 0,386 · 7: 0,494 · 8: 0,602 · 9: 0,686 | dentro l'intervallo |
| priorita-2-mara | ctx-mara | Sonda: gratuita, priorità 2, x HIT | 6,9 [6,9–7,0] | -0,1 [-0,1–-0,0] HIT rispetto alla priorità 1 | 0,1002 | 7,1 / 6,8 / 6,9 | 5: 0,306 · 6: 0,402 · 7: 0,513 · 8: 0,612 · 9: 0,701 | dentro l'intervallo |

## A iniziale (precedenza)

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| allerta-10-spazienzio | ctx-spazienzio | A iniziale -10 | 0,488 [0,474–0,502] | 16,2% | — | — | — | — |
| allerta-3-spazienzio | ctx-spazienzio | A iniziale -3 | 0,486 [0,472–0,500] | 16,3% | — | — | — | — |
| allerta-1-spazienzio | ctx-spazienzio | A iniziale -1 | 0,486 [0,472–0,500] | 16,3% | — | — | — | — |
| allerta+1-spazienzio | ctx-spazienzio | A iniziale +1 | 0,466 [0,452–0,479] | 16,2% | — | — | — | — |
| allerta+3-spazienzio | ctx-spazienzio | A iniziale +3 | 0,466 [0,452–0,479] | 16,2% | — | — | — | — |
| allerta+10-spazienzio | ctx-spazienzio | A iniziale +10 | 0,463 [0,449–0,476] | 16,1% | — | — | — | — |
| allerta-10-mara | ctx-mara | A iniziale -10 | 0,210 [0,199–0,221] | 15,4% | — | — | — | — |
| allerta-3-mara | ctx-mara | A iniziale -3 | 0,389 [0,376–0,403] | 18,5% | — | — | — | — |
| allerta-1-mara | ctx-mara | A iniziale -1 | 0,434 [0,420–0,448] | 19,0% | — | — | — | — |
| allerta+1-mara | ctx-mara | A iniziale +1 | 0,529 [0,515–0,543] | 19,8% | — | — | — | — |
| allerta+3-mara | ctx-mara | A iniziale +3 | 0,578 [0,564–0,591] | 19,8% | — | — | — | — |
| allerta+10-mara | ctx-mara | A iniziale +10 | 0,748 [0,736–0,759] | 15,0% | — | — | — | — |
