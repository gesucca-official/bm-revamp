# Listino di potenza SB-10a — misure

> SB-10b: tetto in partita con i predefiniti di D33

| Voce | Valore |
|---|---|
| Banco | sb-10a/1 su sb-7/1 |
| Bozza base | `classpath:/sb-10a/listino-base.json` |
| SHA-256 | `87fa95f18772385258c51c05de784487beb4fa0dc9a67062d6783fff35b7b1b1` |
| Misure | tettopartita+salute |
| Stili | aggressivo, prudente, risorse, stesso stile sui due lati salvo dove indicato |
| Bisezione | 400 partite per stile e punto, semi da 8000000 |
| Griglia | 5 punti, 2000 partite per stile e punto, semi da 8500000 (disgiunti) |
| Curve | 2000 partite per stile e cella, semi da 8200000 |
| Tempi | nel file `.tempi.txt` accanto |

Quota: vittorie / (vittorie + sconfitte) del mazzo sonda, patte escluse, Wilson al 95%. Punto di indifferenza: radice della retta pesata fra quota e x sulla griglia, intervallo al 95% col metodo delta (bersaglio compreso nei non specchi). Ogni bozza derivata ha il suo SHA-256 nel file di dati. I valori misurano come giocano **questi bot**.

## Tetto in partita (SB-10b): bound da 4 unità e una nulla contro due nulle

| cella | contesto | variante | quota sonda [IC 95%] | patte | giocate per partita | quota delle mosse | salute equivalente per partita | per uso |
|---|---|---|---|---:|---:|---:|---:|---:|
| tettopartita-danno-4HIT-neutro | ctx-neutro | danno-4HIT | 0,998 [0,996–0,999] | 17,8% | 6,09 | 33,8% | saturato | — |
| tettopartita-danno-3HIT-neutro | ctx-neutro | danno-3HIT | 0,969 [0,963–0,974] | 32,6% | 6,09 | 32,8% | saturato | — |
| tettopartita-danno-2HIT-neutro | ctx-neutro | danno-2HIT | 0,843 [0,831–0,855] | 45,2% | 5,61 | 29,5% | 7,2 | 1,28 |
| tettopartita-risorsa-5V-neutro | ctx-neutro | risorsa-5V | 0,793 [0,777–0,808] | 58,9% | 2,70 | 14,0% | 6,1 | 2,28 |
| tettopartita-danno-4HIT-spazienzio | ctx-spazienzio | danno-4HIT | 0,475 [0,461–0,488] | 17,3% | 3,77 | 35,7% | -1,0 | -0,26 |
| tettopartita-danno-3HIT-spazienzio | ctx-spazienzio | danno-3HIT | 0,445 [0,432–0,459] | 15,6% | 3,43 | 32,1% | -2,1 | -0,62 |
| tettopartita-danno-2HIT-spazienzio | ctx-spazienzio | danno-2HIT | 0,476 [0,462–0,490] | 15,9% | 2,58 | 24,2% | -0,9 | -0,36 |
| tettopartita-risorsa-5V-spazienzio | ctx-spazienzio | risorsa-5V | 0,559 [0,545–0,573] | 15,6% | 1,11 | 10,6% | 2,3 | 2,05 |
| tettopartita-danno-4HIT-mara | ctx-mara | danno-4HIT | 0,813 [0,802–0,823] | 13,0% | 3,13 | 30,8% | 9,1 | 2,91 |
| tettopartita-danno-3HIT-mara | ctx-mara | danno-3HIT | 0,725 [0,713–0,737] | 15,5% | 3,23 | 30,7% | 6,6 | 2,03 |
| tettopartita-danno-2HIT-mara | ctx-mara | danno-2HIT | 0,616 [0,603–0,630] | 17,4% | 2,75 | 25,5% | 3,4 | 1,23 |
| tettopartita-risorsa-8A-mara | ctx-mara | risorsa-8A | 0,473 [0,459–0,487] | 17,3% | 0,91 | 8,0% | -0,8 | -0,86 |
| tettopartita-danno-4HIT-rocco | ctx-rocco | danno-4HIT | 0,715 [0,703–0,728] | 14,1% | 2,52 | 26,5% | 8,7 | 3,44 |
| tettopartita-danno-3HIT-rocco | ctx-rocco | danno-3HIT | 0,658 [0,645–0,670] | 14,0% | 2,51 | 25,9% | 6,3 | 2,52 |
| tettopartita-danno-2HIT-rocco | ctx-rocco | danno-2HIT | 0,547 [0,533–0,560] | 14,0% | 1,92 | 19,6% | 1,9 | 0,98 |
| tettopartita-risorsa-8A-rocco | ctx-rocco | risorsa-8A | 0,485 [0,472–0,499] | 14,1% | 0,62 | 6,2% | -0,6 | -0,95 |
| tettopartita-danno-4HIT-tossico | ctx-tossico | danno-4HIT | 0,657 [0,643–0,670] | 19,1% | 6,24 | 43,4% | 4,3 | 0,70 |
| tettopartita-danno-3HIT-tossico | ctx-tossico | danno-3HIT | 0,583 [0,569–0,597] | 20,5% | 5,93 | 39,1% | 2,3 | 0,39 |
| tettopartita-danno-2HIT-tossico | ctx-tossico | danno-2HIT | 0,452 [0,438–0,467] | 20,3% | 5,66 | 35,7% | -1,3 | -0,23 |
| tettopartita-risorsa-26T-tossico | ctx-tossico | risorsa-26T | 0,589 [0,575–0,602] | 15,7% | 1,95 | 12,8% | 2,5 | 1,27 |
| tettopartita-risorsa-10T-tossico | ctx-tossico | risorsa-10T | 0,547 [0,533–0,561] | 18,1% | 1,90 | 12,2% | 1,3 | 0,68 |

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

## Tetto delle bound contro il manichino

Parametri: 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1.

| bound | personaggio | valore per uso (medio / massimo) | danno | parato | guadagni pesati | viola | motivi |
|---|---|---:|---:|---:|---:|---|---|
| listino.tetto.danno-2HIT-mara | prova.mara | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-2HIT-neutro | sonda.neutro | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-2HIT-rocco | prova.rocco | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-2HIT-spazienzio | bruiser.character.BigBadBruiser | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-2HIT-tossico | junkie.character.ToxicJunkie | 2,00 / 2,00 | 2,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-3HIT-mara | prova.mara | 3,00 / 3,00 | 3,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-3HIT-neutro | sonda.neutro | 3,00 / 3,00 | 3,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-3HIT-rocco | prova.rocco | 3,00 / 3,00 | 3,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-3HIT-spazienzio | bruiser.character.BigBadBruiser | 3,00 / 3,00 | 3,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-3HIT-tossico | junkie.character.ToxicJunkie | 3,00 / 3,00 | 3,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-4HIT-mara | prova.mara | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-4HIT-neutro | sonda.neutro | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-4HIT-rocco | prova.rocco | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-4HIT-spazienzio | bruiser.character.BigBadBruiser | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.tetto.danno-4HIT-tossico | junkie.character.ToxicJunkie | 4,00 / 4,00 | 4,00 | 0,00 | 0,00 | no |  |
| listino.tetto.risorsa-10T-tossico | junkie.character.ToxicJunkie | 1,50 / 1,50 | 0,00 | 0,00 | 1,50 | no |  |
| listino.tetto.risorsa-26T-tossico | junkie.character.ToxicJunkie | 3,90 / 3,90 | 0,00 | 0,00 | 3,90 | no |  |
| listino.tetto.risorsa-5V-neutro | sonda.neutro | 3,75 / 3,75 | 0,00 | 0,00 | 3,75 | no |  |
| listino.tetto.risorsa-5V-spazienzio | bruiser.character.BigBadBruiser | 3,75 / 3,75 | 0,00 | 0,00 | 3,75 | no |  |
| listino.tetto.risorsa-8A-mara | prova.mara | 4,00 / 4,00 | 0,00 | 0,00 | 4,00 | no |  |
| listino.tetto.risorsa-8A-rocco | prova.rocco | 4,00 / 4,00 | 0,00 | 0,00 | 4,00 | no |  |
