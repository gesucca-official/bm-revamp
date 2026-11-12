# Listino di potenza SB-10a — misure

> SB-16e_rules_d50_five_starters

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `server/derivata dalla bozza bozza.json, contesti del listino, ancora 7 HIT` |
| SHA-256 | `dccda3ef38688d36308ef1863b630708fbc81e06ad2c63801ba9b21411a3c38e` |
| Àncora | 7 HIT (SB-11a, -Dsim.listinoAnchor; SB-10a e SB-10b: 10) |
| Misure | priorita+allerta |
| Stili | aggressivo, prudente, risorse, com, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Priorità

| misura | contesto | sonda | x di indifferenza [IC 95%] | lettura | pendenza (quota per x) | x per stile (aggr./prud./ris.) | griglia | stato |
|---|---|---|---|---|---:|---|---|---|
| priorita-0-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 0, x HIT | 7,4 [7,2–7,5] | 0,4 [0,2–0,5] HIT rispetto alla priorità 1 | 0,0439 | 7,5 / 7,6 / 7,1 | 5: 0,396 · 6: 0,440 · 7: 0,485 · 8: 0,530 · 9: 0,570 | dentro l'intervallo |
| priorita-2-spazienzio | ctx-spazienzio | Sonda: gratuita, priorità 2, x HIT | 6,8 [6,6–6,9] | -0,2 [-0,4–-0,1] HIT rispetto alla priorità 1 | 0,0471 | 7,0 / 6,8 / 6,7 | 5: 0,418 · 6: 0,463 · 7: 0,511 · 8: 0,559 · 9: 0,606 | dentro l'intervallo |
| priorita-0-mara | ctx-mara | Sonda: gratuita, priorità 0, x HIT | 7,2 [7,1–7,3] | 0,2 [0,1–0,3] HIT rispetto alla priorità 1 | 0,0645 | 7,5 / 7,2 / 7,2 | 5: 0,356 · 6: 0,423 · 7: 0,482 · 8: 0,556 · 9: 0,612 | dentro l'intervallo |
| priorita-2-mara | ctx-mara | Sonda: gratuita, priorità 2, x HIT | 6,5 [6,5–6,6] | -0,5 [-0,5–-0,4] HIT rispetto alla priorità 1 | 0,0679 | 6,7 / 6,3 / 6,7 | 5: 0,392 · 6: 0,465 · 7: 0,533 · 8: 0,603 · 9: 0,662 | dentro l'intervallo |
| priorita-0-tossico | ctx-tossico | Sonda: gratuita, priorità 0, x HIT | 7,0 [6,9–7,0] | -0,0 [-0,1–0,0] HIT rispetto alla priorità 1 | 0,0833 | 6,8 / 7,0 / 6,9 | 5: 0,339 · 6: 0,413 · 7: 0,507 · 8: 0,595 · 9: 0,664 | dentro l'intervallo |
| priorita-2-tossico | ctx-tossico | Sonda: gratuita, priorità 2, x HIT | 6,9 [6,8–6,9] | -0,1 [-0,2–-0,1] HIT rispetto alla priorità 1 | 0,0811 | 6,9 / 6,6 / 7,0 | 5: 0,347 · 6: 0,424 · 7: 0,526 · 8: 0,592 · 9: 0,668 | dentro l'intervallo |
| priorita-0-pino | ctx-pino | Sonda: gratuita, priorità 0, x HIT | 7,2 [7,2–7,3] | 0,2 [0,2–0,3] HIT rispetto alla priorità 1 | 0,0943 | 7,4 / 6,9 / 7,2 | 5: 0,294 · 6: 0,380 · 7: 0,471 · 8: 0,585 · 9: 0,663 | dentro l'intervallo |
| priorita-2-pino | ctx-pino | Sonda: gratuita, priorità 2, x HIT | 6,6 [6,5–6,7] | -0,4 [-0,5–-0,3] HIT rispetto alla priorità 1 | 0,0944 | 6,4 / 6,6 / 6,5 | 5: 0,347 · 6: 0,440 · 7: 0,541 · 8: 0,643 · 9: 0,717 | dentro l'intervallo |
| priorita-0-gigi | ctx-gigi | Sonda: gratuita, priorità 0, x HIT | 7,4 [7,4–7,5] | 0,4 [0,4–0,5] HIT rispetto alla priorità 1 | 0,1010 | 7,6 / 7,4 / 7,4 | 5: 0,261 · 6: 0,342 · 7: 0,460 · 8: 0,567 · 9: 0,654 | dentro l'intervallo |
| priorita-2-gigi | ctx-gigi | Sonda: gratuita, priorità 2, x HIT | 6,8 [6,7–6,8] | -0,2 [-0,3–-0,2] HIT rispetto alla priorità 1 | 0,1067 | 6,8 / 6,5 / 6,8 | 5: 0,313 · 6: 0,404 · 7: 0,541 · 8: 0,643 · 9: 0,727 | dentro l'intervallo |

## A iniziale (precedenza)

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| allerta-10-spazienzio | ctx-spazienzio | A iniziale -10 | 0,464 [0,453–0,475] | 1,6% | — | — | — | — |
| allerta-3-spazienzio | ctx-spazienzio | A iniziale -3 | 0,470 [0,459–0,481] | 1,4% | — | — | — | — |
| allerta-1-spazienzio | ctx-spazienzio | A iniziale -1 | 0,470 [0,459–0,481] | 1,4% | — | — | — | — |
| allerta+1-spazienzio | ctx-spazienzio | A iniziale +1 | 0,489 [0,478–0,500] | 1,3% | — | — | — | — |
| allerta+3-spazienzio | ctx-spazienzio | A iniziale +3 | 0,490 [0,479–0,501] | 1,3% | — | — | — | — |
| allerta+10-spazienzio | ctx-spazienzio | A iniziale +10 | 0,497 [0,485–0,508] | 1,2% | — | — | — | — |
| allerta-10-mara | ctx-mara | A iniziale -10 | 0,379 [0,368–0,390] | 7,4% | — | — | — | — |
| allerta-3-mara | ctx-mara | A iniziale -3 | 0,457 [0,446–0,469] | 7,3% | — | — | — | — |
| allerta-1-mara | ctx-mara | A iniziale -1 | 0,477 [0,466–0,489] | 6,6% | — | — | — | — |
| allerta+1-mara | ctx-mara | A iniziale +1 | 0,523 [0,512–0,534] | 6,0% | — | — | — | — |
| allerta+3-mara | ctx-mara | A iniziale +3 | 0,541 [0,530–0,552] | 6,2% | — | — | — | — |
| allerta+10-mara | ctx-mara | A iniziale +10 | 0,605 [0,593–0,615] | 4,6% | — | — | — | — |
| allerta-10-tossico | ctx-tossico | A iniziale -10 | 0,442 [0,429–0,455] | 24,5% | — | — | — | — |
| allerta-3-tossico | ctx-tossico | A iniziale -3 | 0,452 [0,440–0,465] | 24,9% | — | — | — | — |
| allerta-1-tossico | ctx-tossico | A iniziale -1 | 0,452 [0,440–0,465] | 24,9% | — | — | — | — |
| allerta+1-tossico | ctx-tossico | A iniziale +1 | 0,552 [0,540–0,565] | 24,6% | — | — | — | — |
| allerta+3-tossico | ctx-tossico | A iniziale +3 | 0,552 [0,540–0,565] | 24,6% | — | — | — | — |
| allerta+10-tossico | ctx-tossico | A iniziale +10 | 0,567 [0,554–0,579] | 24,6% | — | — | — | — |
| allerta-10-pino | ctx-pino | A iniziale -10 | 0,431 [0,419–0,443] | 21,9% | — | — | — | — |
| allerta-3-pino | ctx-pino | A iniziale -3 | 0,469 [0,457–0,482] | 21,2% | — | — | — | — |
| allerta-1-pino | ctx-pino | A iniziale -1 | 0,490 [0,477–0,502] | 21,5% | — | — | — | — |
| allerta+1-pino | ctx-pino | A iniziale +1 | 0,489 [0,476–0,501] | 21,3% | — | — | — | — |
| allerta+3-pino | ctx-pino | A iniziale +3 | 0,509 [0,496–0,521] | 20,4% | — | — | — | — |
| allerta+10-pino | ctx-pino | A iniziale +10 | 0,549 [0,537–0,561] | 20,6% | — | — | — | — |
| allerta-10-gigi | ctx-gigi | A iniziale -10 | 0,390 [0,379–0,401] | 3,1% | — | — | — | — |
| allerta-3-gigi | ctx-gigi | A iniziale -3 | 0,390 [0,379–0,401] | 3,1% | — | — | — | — |
| allerta-1-gigi | ctx-gigi | A iniziale -1 | 0,390 [0,379–0,401] | 3,1% | — | — | — | — |
| allerta+1-gigi | ctx-gigi | A iniziale +1 | 0,591 [0,580–0,602] | 2,7% | — | — | — | — |
| allerta+3-gigi | ctx-gigi | A iniziale +3 | 0,591 [0,580–0,602] | 2,7% | — | — | — | — |
| allerta+10-gigi | ctx-gigi | A iniziale +10 | 0,591 [0,580–0,602] | 2,7% | — | — | — | — |
