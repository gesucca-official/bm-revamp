# SB-14 — Varianti diagnostiche

Varianti usate per scegliere le correzioni dei giri di Pino, oppure per controllare i bot prima di toccare una carta. **Nella bozza c'è solo
ciò che è indicato come giro.** Ogni variante è generata in `tmp/sim/sb14/var/` dalla bozza del giro precedente con uno script che cambia
anche i testi (costo, danno nominale, guadagni), perché i bot li leggono; il JSON è riscritto con l'indentazione di Python, quindi lo SHA-256 è
diverso da quello della bozza anche a parità di contenuto. Le bozze dei giri 1 e 2 sono in [`bozze/`](bozze/); quella del giro 3 è
`server/src/test/resources/set-base/bozza.json`, con lo stesso contenuto della variante `h4` (controllato confrontando i due JSON).

Banco SB-7 (`BenchMeasureTest#matrix`, banco sb-7/1), mazzi `starter-pino`, `starter-tossico`, `starter-spazienzio` e `starter-mara` (dieci
incontri), stili aggressivo, prudente, risorse e com (16 coppie), posti alternati, `-Dsim.strict=true`. Varianti: 1000 partite per cella, semi
7.000.000–7.000.999; matrici dei giri: 2000, semi 7.000.000–7.001.999. Misure in una copia di HEAD (`ff2b45d`) più i file di SB-14
(`tmp/sb14-build`), perché il caricatore di SB-6b era in modifica nel checkout. **Nessun invariante violato in nessuna variante.**

Colonne: quota di Pino contro Spazienzio, Mara e Tossico sulla somma delle 16 coppie (fra parentesi le 9 coppie dei tre stili euristici);
patte dello specchio; turni medi contro Spazienzio, Mara, Tossico e nello specchio; mazzo di Pino esaurito (su tutte le sue partite); turni
in mano da morta di Testata, Offro io e Rutto (percentuale); la cella di controllo Spazienzio contro Mara (vittorie, sconfitte, patte: attese
7557, 6754, 1689); violazioni degli invarianti.

**Controllo degli starter approvati.** In ogni variante la cella Spazienzio contro Mara è identica (7557, 6754, 1689); nelle matrici dei tre
giri le 96 celle degli incontri fra Spazienzio, Mara e Tossico coincidono una per una con la matrice finale di SB-13 (`sb-13/sb7-giro3-2000.json`).

## Giro 1 → giro 2: le leve

Base: la bozza del giro 1 (la griglia, salute 95). Giro 1 a 2000 partite: 0,122 (0,106), 0,099 (0,014), 0,099 (0,017), specchio 0,505.

| Variante | Modifica | SHA-256 | contro Spazienzio | contro Mara | contro Tossico | Specchio | Turni | Esaurito | Morte % | Controllo | Invarianti |
|---|---|---|---|---|---|---|---|---|---|---|---|
| g1-immune | immune a L (D28), solo confronto | `f0c645f1…b262f1dd` | 0,528 (0,507) | 0,512 (0,330) | 0,400 (0,268) | patte 22% | 13,3 / 13,1 / 14,3 / 14,3 | 54% | 40/39/52 | 7557/6754/1689 | 0 |
| v-L20 | L iniziale 20 | `cad2f40b…a3d3a8ec` | 0,177 (0,170) | 0,154 (0,059) | 0,115 (0,032) | patte 28% | 14,9 / 14,4 / 15,2 / 18,2 | 79% | 80/73/85 | 7557/6754/1689 | 0 |
| v-H110 | salute 110 | `d24de5db…e8338247` | 0,285 (0,295) | 0,266 (0,156) | 0,131 (0,034) | patte 33% | 16,3 / 16,2 / 16,4 / 20,3 | 90% | 84/78/88 | 7557/6754/1689 | 0 |
| v-c3 | costi 3 L (Testata, Offro io, Rutto) | `f6351b8b…ad463751` | 0,162 (0,156) | 0,135 (0,036) | 0,108 (0,022) | patte 32% | 14,8 / 14,3 / 15,1 / 18,0 | 80% | 77/68/82 | 7557/6754/1689 | 0 |
| v-gb6 | Estasi base 6 | `63475bda…4645fa3e` | 0,198 (0,197) | 0,142 (0,038) | 0,115 (0,027) | patte 31% | 14,9 / 14,3 / 15,2 / 18,2 | 79% | 83/78/87 | 7557/6754/1689 | 0 |
| v-ug10 | L ultimo giro base 10 | `3748ebf7…905edc61` | 0,249 (0,267) | 0,176 (0,044) | 0,139 (0,035) | patte 38% | 14,9 / 14,2 / 15,2 / 17,6 | 80% | 83/78/87 | 7557/6754/1689 | 0 |
| v-tes25 | Testata 25 HIT | `a130b37a…77b5d734` | 0,206 (0,213) | 0,157 (0,061) | 0,125 (0,042) | patte 23% | 14,8 / 14,2 / 15,2 / 18,0 | 78% | 83/77/87 | 7557/6754/1689 | 0 |
| v-A25 | A iniziale 25 | `0af7f3c7…c2847655` | 0,129 (0,116) | 0,100 (0,017) | 0,098 (0,016) | patte 31% | 15,1 / 14,4 / 15,2 / 18,8 | 80% | 83/78/88 | 7557/6754/1689 | 0 |
| b-noGB | Estasi ×2 → Spintone | `69cf9e5f…98dbd2f3` | 0,179 (0,183) | 0,129 (0,034) | 0,106 (0,021) | patte 30% | 15,0 / 14,4 / 15,2 / 18,4 | 80% | 83/76/86 | 7557/6754/1689 | 0 |
| b-noOffro | Offro io ×2 → Spintone | `30c7d8e4…dbf460ad` | 0,226 (0,229) | 0,156 (0,051) | 0,124 (0,037) | patte 33% | 14,9 / 14,1 / 15,2 / 18,2 | 79% | 84/—/87 | 7557/6754/1689 | 0 |
| b-noRutto | Rutto → Spintone | `42e4d633…0f195ecf` | 0,150 (0,141) | 0,115 (0,026) | 0,103 (0,021) | patte 33% | 15,0 / 14,3 / 15,2 / 18,4 | 80% | 85/80/— | 7557/6754/1689 | 0 |
| b-noBancone | Bancone ×2 → Spintone | `917208d1…6a922859` | 0,216 (0,224) | 0,187 (0,071) | 0,131 (0,043) | patte 27% | 14,4 / 14,2 / 15,1 / 17,4 | 76% | 83/80/87 | 7557/6754/1689 | 0 |
| b-tesFree | Testata gratuita | `a832f6cd…b930174b` | 0,369 (0,420) | 0,250 (0,130) | 0,165 (0,077) | patte 36% | 13,8 / 13,4 / 14,6 / 16,3 | 76% | 0/82/91 | 7557/6754/1689 | 0 |
| c1 | salute 110, L 20, Estasi 6, ultimo giro 10, Testata 25 | `32b548e4…67835224` | 0,661 (0,765) | 0,693 (0,735) | 0,450 (0,475) | patte 29% | 14,9 / 15,0 / 15,8 / 17,3 | 83% | 80/72/84 | 7557/6754/1689 | 0 |
| c2 | c1 e costi 3 L | `85e1e888…f3c35c54` | 0,697 (0,805) | 0,755 (0,816) | 0,506 (0,565) | patte 28% | 14,5 / 14,6 / 15,6 / 16,7 | 81% | 74/64/79 | 7557/6754/1689 | 0 |
| c3 | c1 con salute 125 | `fcf42565…e33a4951` | 0,817 (0,915) | 0,887 (0,963) | 0,621 (0,727) | patte 29% | 15,3 / 15,4 / 16,5 / 18,4 | 87% | 80/71/83 | 7557/6754/1689 | 0 |
| c4 | c1 e immune a L | `09e2e035…ad0d108b` | 0,905 (0,951) | 0,971 (0,991) | 0,907 (0,948) | patte 25% | 11,7 / 11,5 / 12,9 / 13,3 | 37% | 36/33/45 | 7557/6754/1689 | 0 |
| d1 | salute 110, ultimo giro 10 | `fcc16667…f5df32d6` | 0,471 (0,531) | 0,419 (0,313) | 0,227 (0,130) | patte 38% | 16,0 / 15,9 / 16,3 / 18,7 | 90% | 83/78/87 | 7557/6754/1689 | 0 |
| d2 | d1 ed Estasi 6 | `efe7a4fe…47054e48` | 0,549 (0,627) | 0,510 (0,449) | 0,290 (0,221) | patte 39% | 15,7 / 15,7 / 16,2 / 18,3 | 89% | 83/77/87 | 7557/6754/1689 | 0 |
| d3 | salute 105, ultimo giro 10, Estasi 6, Testata 25 | `8fe8a282…8e854714` | 0,543 (0,629) | 0,487 (0,431) | 0,317 (0,267) | patte 30% | 15,1 / 15,0 / 15,7 / 17,4 | 83% | 83/77/87 | 7557/6754/1689 | 0 |
| d4 | salute 100, ultimo giro 10, Estasi 6, Testata 25, L 20 | `1fdb3386…ee156e4b` | 0,527 (0,613) | 0,492 (0,455) | 0,343 (0,313) | patte 28% | 14,4 / 14,3 / 15,2 / 16,5 | 76% | 79/72/84 | 7557/6754/1689 | 0 |
| d5 | salute 110, ultimo giro 10, L 20 | `8bec5179…b3174e73` | 0,518 (0,587) | 0,524 (0,475) | 0,287 (0,220) | patte 35% | 15,7 / 15,7 / 16,2 / 18,2 | 89% | 80/72/85 | 7557/6754/1689 | 0 |
| e1 | d4 e costi 3 L | `c4068a49…bf698044` | 0,566 (0,660) | 0,568 (0,564) | 0,394 (0,391) | patte 27% | 14,0 / 14,1 / 15,0 / 15,9 | 74% | 74/64/79 | 7557/6754/1689 | 0 |
| e2 | d4 con salute 105 | `8f906b11…0ee92a86` | 0,593 (0,688) | 0,594 (0,599) | 0,393 (0,389) | patte 28% | 14,7 / 14,7 / 15,6 / 16,9 | 80% | 80/72/84 | 7557/6754/1689 | 0 |
| e3 | d4 con Estasi 8 | `f37234a9…c8e47a75` | 0,574 (0,671) | 0,550 (0,545) | 0,396 (0,393) | patte 28% | 14,2 / 14,1 / 15,1 / 16,1 | 74% | 79/71/83 | 7557/6754/1689 | 0 |
| e4 | salute 95, ultimo giro 12, Estasi 8, Testata 25, L 20 | `71ea6ee6…6cc48fbb` | 0,532 (0,624) | 0,473 (0,427) | 0,394 (0,393) | patte 29% | 13,8 / 13,6 / 14,7 / 15,5 | 69% | 79/71/83 | 7557/6754/1689 | 0 |
| e5 | d4 con Testata 28 | `771b96ae…5552d3f1` | 0,561 (0,653) | 0,540 (0,530) | 0,390 (0,387) | patte 24% | 14,2 / 14,1 / 15,1 / 16,1 | 73% | 79/71/83 | 7557/6754/1689 | 0 |
| f1 | e4 con salute 100 | `24485324…340f6c64` | 0,600 (0,699) | 0,578 (0,582) | 0,451 (0,481) | patte 30% | 14,1 / 14,0 / 15,0 / 15,9 | 74% | 79/71/83 | 7557/6754/1689 | 0 |
| f2 | e4 con salute 105 | `95c42d62…dceffb8f` | 0,664 (0,770) | 0,677 (0,723) | 0,511 (0,575) | patte 31% | 14,3 / 14,4 / 15,3 / 16,3 | 78% | 79/71/83 | 7557/6754/1689 | 0 |
| f3 | e4 con Estasi 10 (giro 2) | `82c3bd64…2dc2b957` | 0,575 (0,677) | 0,530 (0,514) | 0,444 (0,473) | patte 28% | 13,6 / 13,4 / 14,5 / 15,1 | 66% | 79/71/83 | 7557/6754/1689 | 0 |
| f4 | e4 con ultimo giro 14 | `750b22a4…220603a2` | 0,554 (0,648) | 0,497 (0,457) | 0,436 (0,462) | patte 31% | 13,8 / 13,6 / 14,6 / 15,3 | 69% | 79/71/83 | 7557/6754/1689 | 0 |

**Lettura.** Le leve singole spostano poco (al massimo +16 punti contro Spazienzio con la salute 110); combinate si moltiplicano (c1: da
0,12 a 0,66). La leva più forte è l'immunità a L, che però cambia l'identità (D28). Contro il Tossico Pino resta 15–25 punti sotto gli altri
due incontri con qualunque combinazione: le sue contromosse (L e −A al bersaglio) non servono contro chi paga in T, e le partite lunghe
favoriscono il veleno. Il giro 2 è la variante `f3`.

## Controllo dei bot (punto 7) e giro 2 → giro 3

Base: la bozza del giro 2 (L 20, Estasi 10, ultimo giro 12, Testata 25). Giro 2 a 2000 partite: 0,578 (0,682), 0,526 (0,505), 0,449 (0,482),
specchio 0,505.

| Variante | Modifica | SHA-256 | contro Spazienzio | contro Mara | contro Tossico | Specchio | Turni | Esaurito | Morte % | Controllo | Invarianti |
|---|---|---|---|---|---|---|---|---|---|---|---|
| g2-noOffro | Offro io ×2 → Spintone | `5e747942…e630665f` | 0,665 (0,776) | 0,611 (0,667) | 0,544 (0,636) | patte 27% | 13,1 / 12,8 / 14,2 / 14,7 | 60% | 79/—/82 | 7557/6754/1689 | 0 |
| g2-noRutto | Rutto → Spintone | `6b777378…10dc9e49` | 0,606 (0,712) | 0,528 (0,513) | 0,467 (0,515) | patte 29% | 13,4 / 13,2 / 14,4 / 14,8 | 65% | 80/72/— | 7557/6754/1689 | 0 |
| g2-noBancone | Bancone ×2 → Spintone | `7491f594…fae614d0` | 0,623 (0,732) | 0,659 (0,716) | 0,559 (0,660) | patte 23% | 12,7 / 12,8 / 14,0 / 13,8 | 52% | 79/73/82 | 7557/6754/1689 | 0 |
| g2-noGB | Estasi ×2 → Spintone | `51a3a08c…f4a637c9` | 0,445 (0,526) | 0,365 (0,269) | 0,279 (0,217) | patte 29% | 14,3 / 14,0 / 14,9 / 16,2 | 75% | 78/69/82 | 7557/6754/1689 | 0 |
| g2-noCinque | bound di L → Coccio | `1284382f…f7dad4dc` | 0,581 (0,681) | 0,529 (0,525) | 0,445 (0,477) | patte 28% | 13,6 / 13,4 / 14,6 / 15,2 | 65% | 82/75/85 | 7557/6754/1689 | 0 |
| g2-immune | immune a L | `ee192600…0709a5c2` | 0,832 (0,897) | 0,905 (0,941) | 0,868 (0,929) | patte 21% | 10,7 / 10,5 / 11,9 / 10,7 | 18% | 34/31/43 | 7557/6754/1689 | 0 |
| h1 | Testata 20 | `403c035e…09cf4cfd` | 0,519 (0,608) | 0,454 (0,394) | 0,366 (0,349) | patte 35% | 14,0 / 13,8 / 14,8 / 15,7 | 72% | 79/72/83 | 7557/6754/1689 | 0 |
| h2 | Testata 22 | `3a0013fd…3b85c1a6` | 0,543 (0,637) | 0,485 (0,442) | 0,400 (0,404) | patte 32% | 13,8 / 13,6 / 14,7 / 15,5 | 70% | 79/71/83 | 7557/6754/1689 | 0 |
| h3 | Testata 20, ultimo giro 14 | `586bc09b…6d121b8f` | 0,542 (0,633) | 0,476 (0,424) | 0,412 (0,425) | patte 35% | 13,9 / 13,7 / 14,7 / 15,5 | 72% | 79/72/83 | 7557/6754/1689 | 0 |
| h4 | Testata 20, salute 100 | `944964f4…fd11a735` | 0,589 (0,686) | 0,561 (0,554) | 0,426 (0,444) | patte 35% | 14,3 / 14,2 / 15,1 / 16,1 | 77% | 79/72/84 | 7557/6754/1689 | 0 |

**Lettura.** Offro io e il Bancone valgono in mano ai bot meno di uno Spintone (da 4 a 13 punti), il Rutto circa quanto uno Spintone, la
bound di L quasi nulla (i bot euristici non la giocano). Estasi da Coca Etilene è la carta che regge Pino: sostituirla costa 13–17 punti.
Con l'immunità a L Pino vince l'83–91%. Il giro 3 è la variante `h4`.
