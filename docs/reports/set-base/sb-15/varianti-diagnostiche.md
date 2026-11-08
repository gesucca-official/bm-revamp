# SB-15 — Varianti diagnostiche di Gigi

Strumento temporaneo, non committato: solo le celle di Gigi contro i quattro starter approvati (64 celle: 4 avversari, 16 coppie di
stili aggressivo, prudente, risorse e `com`), **1000 partite per cella**, 64.000 partite per variante, semi 7.000.000–7.000.999 per cella,
posti alternati; carte giocate e partite come nel banco (`Bench.playCells`). Le bozze delle varianti cambiano i numeri, non i testi delle
descrizioni (i bot leggono costi, guadagni e danno nominale, che invece cambiano). Quota di Gigi sui quattro stili, fra parentesi coi soli tre
euristici; turni medi; mazzo esaurito di Gigi su tutte le sue partite.

## Giro 1 → giro 2: le leve

Sulla bozza del giro 1 (SHA-256 `381103a1…be74605`): leve singole (`a`, `b`), combinazioni larghe (`c`), poi vicine al punto (`d`).

| Variante | Modifica | Spazienzio | Mara | Tossico | Pino | Turni (S/M/T/P) | Mazzo esaurito |
|---|---|---|---|---|---|---|---:|
| `a0` | nessuna (giro 1) | 0,150 (0,128) | 0,130 (0,019) | 0,123 (0,033) | 0,127 (0,001) | 12,9 / 11,7 / 13,7 / 15,3 | 46,1% |
| `b1` | salute 100 | 0,359 (0,367) | 0,314 (0,201) | 0,216 (0,133) | 0,223 (0,033) | 14,5 / 14,1 / 15,2 / 16,5 | 66,8% |
| `b2` | V iniziale 30 | 0,380 (0,391) | 0,292 (0,171) | 0,291 (0,235) | 0,262 (0,074) | 12,0 / 11,2 / 13,3 / 14,6 | 55,4% |
| `b3` | Lavoro a 5 V | 0,183 (0,163) | 0,147 (0,025) | 0,143 (0,051) | 0,149 (0,004) | 12,7 / 11,6 / 13,6 / 15,1 | 51,4% |
| `b4` | Chiave 12 CUT | 0,179 (0,161) | 0,148 (0,027) | 0,142 (0,051) | 0,148 (0,003) | 12,9 / 11,7 / 13,7 / 15,2 | 45,3% |
| `b5` | Colpo di chiave 8 HIT | 0,167 (0,146) | 0,139 (0,023) | 0,134 (0,044) | 0,137 (0,002) | 12,9 / 11,7 / 13,7 / 15,3 | 45,8% |
| `b6` | Sotto il cofano gratuito | 0,166 (0,146) | 0,138 (0,020) | 0,129 (0,036) | 0,138 (0,001) | 12,9 / 11,7 / 13,7 / 15,2 | 47,3% |
| `b7` | Guanti ×1,5 | 0,174 (0,156) | 0,144 (0,029) | 0,140 (0,053) | 0,145 (0,008) | 12,9 / 11,7 / 13,7 / 15,2 | 45,3% |
| `b8` | basic +6 V | 0,213 (0,198) | 0,169 (0,038) | 0,167 (0,080) | 0,171 (0,013) | 12,8 / 11,6 / 13,7 / 15,2 | 45,5% |
| `b9` | Steal ×2 → Spintone +1, Colpo di chiave +1 | 0,210 (0,194) | 0,171 (0,037) | 0,159 (0,067) | 0,164 (0,006) | 12,8 / 11,7 / 13,8 / 15,2 | 45,8% |
| `b10` | Smontiamo ×2 → Colpo di chiave +1, Sotto il cofano +1 | 0,167 (0,145) | 0,140 (0,022) | 0,132 (0,041) | 0,131 (0,001) | 13,0 / 11,8 / 13,7 / 15,4 | 46,5% |
| `c1` | salute 100, V 30 | 0,625 (0,678) | 0,637 (0,692) | 0,483 (0,519) | 0,525 (0,527) | 13,0 / 13,0 / 14,4 / 15,5 | 70,2% |
| `c2` | salute 100, V 30, Lavoro 5 V, Chiave 12, Colpo 8 | 0,772 (0,873) | 0,782 (0,908) | 0,678 (0,812) | 0,739 (0,918) | 11,8 / 11,8 / 13,5 / 14,7 | 59,1% |
| `c3` | come c2, più Cofano gratuito e basic +6 V | 0,818 (0,928) | 0,827 (0,963) | 0,738 (0,888) | 0,797 (0,982) | 11,4 / 11,3 / 13,2 / 14,5 | 54,6% |
| `c4` | come c2, più Guanti ×1,5 | 0,780 (0,876) | 0,789 (0,912) | 0,690 (0,821) | 0,753 (0,929) | 11,8 / 11,7 / 13,4 / 14,6 | 58,2% |
| `c5` | salute 100, V 25, Lavoro 5 V e base 8, Chiave 12, Colpo 8, basic +6 V, Cofano gratuito, Guanti ×1,5 | 0,787 (0,878) | 0,803 (0,925) | 0,704 (0,838) | 0,777 (0,959) | 11,9 / 11,8 / 13,5 / 14,7 | 57,2% |

| Variante | Modifica | Spazienzio | Mara | Tossico | Pino | Turni (S/M/T/P) | Mazzo esaurito |
|---|---|---|---|---|---|---|---:|
| `d01` | salute 100, V 25 | 0,531 (0,560) | 0,518 (0,500) | 0,380 (0,363) | 0,397 (0,260) | 13,6 / 13,4 / 14,8 / 15,9 | 71,3% |
| `d02` | salute 95, V 30 | 0,549 (0,591) | 0,519 (0,511) | 0,416 (0,416) | 0,407 (0,280) | 12,8 / 12,5 / 14,1 / 15,3 | 66,1% |
| `d03` | salute 90, V 30 | 0,467 (0,497) | 0,398 (0,322) | 0,353 (0,324) | 0,325 (0,146) | 12,4 / 11,9 / 13,7 / 15,0 | 61,4% |
| `d04` | salute 95, V 25 | 0,453 (0,471) | 0,401 (0,322) | 0,318 (0,273) | 0,303 (0,108) | 13,3 / 12,9 / 14,4 / 15,6 | 66,3% |
| `d05` | salute 100, V 25, Lavoro 5 V | 0,608 (0,663) | 0,594 (0,623) | 0,461 (0,491) | 0,494 (0,462) | 13,1 / 13,0 / 14,4 / 15,5 | 70,9% |
| `d06` | **salute 95, V 25, Lavoro 5 V, Chiave 12 (scelta: giro 2)** | 0,583 (0,642) | 0,546 (0,555) | 0,465 (0,499) | 0,479 (0,439) | 12,6 / 12,3 / 13,9 / 15,1 | 63,4% |
| `d07` | salute 95, V 25, Lavoro base 8 | 0,471 (0,491) | 0,418 (0,347) | 0,331 (0,291) | 0,319 (0,128) | 13,2 / 12,8 / 14,4 / 15,6 | 65,9% |
| `d08` | salute 90, V 30, Lavoro 5 V | 0,564 (0,629) | 0,502 (0,496) | 0,468 (0,506) | 0,443 (0,380) | 11,9 / 11,5 / 13,3 / 14,6 | 58,8% |
| `d09` | salute 95, V 25, basic +6 V | 0,521 (0,553) | 0,476 (0,437) | 0,381 (0,361) | 0,382 (0,225) | 13,0 / 12,7 / 14,3 / 15,5 | 64,3% |
| `d10` | salute 100, V 20 | 0,449 (0,469) | 0,410 (0,333) | 0,290 (0,231) | 0,304 (0,114) | 14,1 / 13,8 / 15,0 / 16,2 | 69,5% |
| `d11` | salute 90, V 25, Lavoro 5 V, Chiave 12, Colpo 8 | 0,528 (0,578) | 0,469 (0,440) | 0,432 (0,450) | 0,428 (0,347) | 12,1 / 11,7 / 13,5 / 14,8 | 57,3% |
| `d12` | salute 95, V 30, Lavoro base 8 | 0,568 (0,612) | 0,541 (0,544) | 0,434 (0,443) | 0,428 (0,318) | 12,7 / 12,4 / 14,1 / 15,2 | 65,2% |

**Lettura.** Le leve singole spostano poco; salute e V iniziale insieme si moltiplicano. Le carte di Gigi ritoccate da sole valgono 2–4
punti, ma sopra salute e V salgono di 15–25. Contro Tossico e Pino Gigi resta 7–12 punti sotto gli incontri coi base, con qualunque
combinazione.

## Controllo dei bot (punto 7) e leve sul giro 2

Sulla bozza del giro 2 (SHA-256 `c4accca1…f0a2ecf`), senza i testi aggiornati nella `e00`, che coincide con la `d06`.

| Variante | Modifica | Spazienzio | Mara | Tossico | Pino | Turni (S/M/T/P) | Mazzo esaurito |
|---|---|---|---|---|---|---|---:|
| `e00` | nessuna (giro 2, controllo) | 0,583 (0,642) | 0,546 (0,555) | 0,465 (0,499) | 0,479 (0,439) | 12,6 / 12,3 / 13,9 / 15,1 | 63,4% |
| `e01` | Steal ×2 → Spintone +1, Colpo di chiave +1 | 0,691 (0,767) | 0,667 (0,734) | 0,584 (0,666) | 0,631 (0,742) | 12,0 / 11,8 / 13,6 / 14,8 | 58,1% |
| `e02` | Smontiamo ×2 → Colpo di chiave +1, Sotto il cofano +1 | 0,622 (0,675) | 0,583 (0,594) | 0,492 (0,532) | 0,522 (0,508) | 12,6 / 12,3 / 13,9 / 15,2 | 61,5% |
| `e03` | capacità 2 | 0,548 (0,592) | 0,512 (0,497) | 0,431 (0,443) | 0,431 (0,336) | 12,8 / 12,5 / 14,0 / 15,2 | 66,7% |
| `e04` | salute 100 | 0,658 (0,724) | 0,657 (0,723) | 0,525 (0,589) | 0,588 (0,659) | 12,9 / 12,8 / 14,2 / 15,3 | 67,1% |
| `e05` | salute 90 | 0,499 (0,541) | 0,429 (0,375) | 0,401 (0,405) | 0,386 (0,267) | 12,3 / 11,8 / 13,6 / 14,8 | 58,7% |
| `e06` | V iniziale 20 | 0,475 (0,503) | 0,416 (0,346) | 0,344 (0,313) | 0,339 (0,173) | 13,2 / 12,8 / 14,3 / 15,5 | 65,4% |
| `e07` | Guanti ×1,5 | 0,597 (0,653) | 0,560 (0,573) | 0,482 (0,522) | 0,507 (0,488) | 12,5 / 12,3 / 13,9 / 15,0 | 62,6% |
| `e08` | Lavoro di nuovo a 10 V | 0,511 (0,547) | 0,467 (0,427) | 0,384 (0,375) | 0,392 (0,259) | 13,1 / 12,7 / 14,3 / 15,5 | 63,4% |

**Lettura.** Senza Steal Gigi guadagna 11–15 punti, senza Smontiamo tutto 3–4: sono i bot a giocare male furto e distruzione, come
parate e contromosse negli altri starter. La capacità 3 vale circa 4 punti; «Lavoro fatto bene» riportata a 10 V ne costa 7–9; la salute
vale circa 6–12 punti ogni 5 HEALTH; la V iniziale circa 11–14 punti ogni 5 V.
