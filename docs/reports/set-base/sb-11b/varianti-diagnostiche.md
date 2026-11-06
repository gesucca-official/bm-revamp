# SB-11b — Varianti diagnostiche (non applicate)

Solo per orientare le proposte al proprietario: **nessuna di queste varianti è nella bozza**. Ognuna è la bozza
`server/src/test/resources/set-base/bozza.json` della fase A (SHA-256 `7d3fe0cd…2b42b8c`, prima che SPA-BO3 diventasse «TESTA AL
MURO»: un nome che queste partite non usano) con una o due modifiche, generata in `tmp/sim/sb11b/`.

Banco SB-7 (`BenchMeasureTest#matrix`), 1000 partite per cella, stili aggressivo, prudente, risorse e com (16 coppie), semi
7.000.000–7.000.999, posti alternati, `-Dsim.strict=true`: nessun invariante violato in nessuna variante. Quota di Spazienzio contro
Mara, somma delle 16 coppie di stili (16.000 partite), Wilson al 95%. Gli specchi restano fra 0,493 e 0,505.

| Variante | Modifica | SHA-256 | Spazienzio contro Mara |
|---|---|---|---|
| bozza (2000 per cella) | — | `7d3fe0cd…2b42b8c` | 0,937 [0,935–0,940] |
| mos-turno | MadeOfStone: CUT ×0,5 solo nel turno (`turns` 3 → 0) | `45094699…6e04ed5` | 0,920 [0,915–0,924] |
| mos-075 | MadeOfStone: CUT ×0,75 per 4 turni | `aff9fd35…483d7f5` | 0,930 [0,926–0,934] |
| mara-95 | Mara HEALTH 85 → 95 | `145a9fa0…6b3bf1e` | 0,867 [0,861–0,873] |
| mos-turno+mara-95 | le due insieme | `13bd2e38…1297fed` | 0,830 [0,823–0,836] |
| mara-striscio | starter di Mara con MAR-BO3 (2 CUT, pr. 2) al posto di MAR-BO2 (+8 A) | `9e937cfb…ed57e6b` | 0,951 [0,948–0,955] |
| mara-costi-meno5 | −5 A al costo di Cinghiata, Sgommata, Slalom, Paraurti e Sputo | `7ad35ca4…21f18ed` | 0,743 [0,736–0,750] |
| costi-meno5+mara-95 | costi −5 A e HEALTH 95 | `5f025d8b…85c5576` | 0,593 [0,585–0,601] |
| spazienzio-v15 | Spazienzio V iniziale 25 → 15 | `d277268d…ec2e5fb` | 0,839 [0,833–0,845] |

Lettura: MadeOfStone non è la causa principale; pesano il prezzo della A di Mara (il listino a 7 HIT la misura a circa 1 HIT per A
nel suo contesto, la griglia la prezza 0,6) e la sua salute. Nessuna leva da sola arriva al 45–55%; la coppia costi e salute arriva a
0,593. La bound +8 A conta: senza (variante mara-striscio) Mara perde di più.
