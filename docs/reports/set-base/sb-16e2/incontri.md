# SB-16e2 — incontri per controllo e varianti

Generato da [summarize.py](summarize.py). Ogni riga: 32.000 partite, 16 coppie di stili, 2.000 semi per cella da 7.000.000, regole `d50`. Quota A sulle decisive; patte su tutte le partite; turni medi di partita. In grassetto i valori fuori criterio.

## Controllo (giro 3 di SB-16e)

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15502 | 15600 | 898 | 0.498 | 2.81 | 9.92 |
| Spazienzio–Mara | 16349 | 14833 | 818 | 0.524 | 2.56 | 9.52 |
| Spazienzio–Celestina | 13798 | 16377 | 1825 | 0.457 | 5.70 | 11.89 |
| Spazienzio–Piera | 14651 | 15409 | 1940 | 0.487 | 6.06 | **12.43** |
| Spazienzio–Beppe | 15793 | 15213 | 994 | 0.509 | 3.11 | 10.38 |
| Mara–Mara | 15335 | 15589 | 1076 | 0.496 | 3.36 | 8.78 |
| Mara–Celestina | 15933 | 14171 | 1896 | 0.529 | 5.92 | 10.93 |
| Mara–Piera | 20029 | 9676 | 2295 | **0.674** | 7.17 | 11.28 |
| Mara–Beppe | 17942 | 13458 | 600 | 0.571 | 1.88 | 9.39 |
| Celestina–Celestina | 12445 | 12411 | 7144 | 0.501 | **22.32** | **17.51** |
| Celestina–Piera | 20111 | 9086 | 2803 | **0.689** | 8.76 | **13.70** |
| Celestina–Beppe | 17430 | 11962 | 2608 | 0.593 | 8.15 | **12.38** |
| Piera–Piera | 13105 | 13204 | 5691 | 0.498 | **17.78** | **14.68** |
| Piera–Beppe | 12977 | 15902 | 3121 | 0.449 | 9.75 | **12.84** |
| Beppe–Beppe | 14800 | 14571 | 2629 | 0.504 | 8.22 | 10.84 |

Invarianti: 0 violazioni su 480000 partite. Bound: 0 in violazione su 15, massimo 4 (tetto 4).

Osservatore di SB-16e, primi 400 semi per cella (6.400 partite per specchio):

| Specchio | Patte | Patte % | Turni medi | Patte con danno a sé letale | Ultimi danni letali |
|---|---:|---:|---:|---:|---|
| Celestina | 1419 | 22.17 | 17.44 | 936 | end+end: 38; end+opponent: 62; end+self: 20; opponent+opponent-same-group: 383; opponent+self: 696; self+self: 220 |
| Piera | 1180 | 18.44 | 14.64 | 828 | opponent+opponent-same-group: 352; opponent+self: 774; self+self: 54 |

## (a) Un altro e arrivo +35 A

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15502 | 15600 | 898 | 0.498 | 2.81 | 9.92 |
| Spazienzio–Mara | 16349 | 14833 | 818 | 0.524 | 2.56 | 9.52 |
| Spazienzio–Celestina | 13798 | 16377 | 1825 | 0.457 | 5.70 | 11.89 |
| Spazienzio–Piera | 14476 | 15554 | 1970 | 0.482 | 6.16 | **12.42** |
| Spazienzio–Beppe | 15793 | 15213 | 994 | 0.509 | 3.11 | 10.38 |
| Mara–Mara | 15335 | 15589 | 1076 | 0.496 | 3.36 | 8.78 |
| Mara–Celestina | 15933 | 14171 | 1896 | 0.529 | 5.92 | 10.93 |
| Mara–Piera | 19868 | 9858 | 2274 | **0.668** | 7.11 | 11.28 |
| Mara–Beppe | 17942 | 13458 | 600 | 0.571 | 1.88 | 9.39 |
| Celestina–Celestina | 12445 | 12411 | 7144 | 0.501 | **22.32** | **17.51** |
| Celestina–Piera | 20078 | 9124 | 2798 | **0.688** | 8.74 | **13.71** |
| Celestina–Beppe | 17430 | 11962 | 2608 | 0.593 | 8.15 | **12.38** |
| Piera–Piera | 13194 | 13240 | 5566 | 0.499 | **17.39** | **14.69** |
| Piera–Beppe | 13813 | 15215 | 2972 | 0.476 | 9.29 | **12.86** |
| Beppe–Beppe | 14800 | 14571 | 2629 | 0.504 | 8.22 | 10.84 |

Invarianti: 0 violazioni su 480000 partite. Bound: 0 in violazione su 15, massimo 4 (tetto 4).

Osservatore di SB-16e, primi 400 semi per cella (6.400 partite per specchio):

| Specchio | Patte | Patte % | Turni medi | Patte con danno a sé letale | Ultimi danni letali |
|---|---:|---:|---:|---:|---|
| Celestina | 1419 | 22.17 | 17.44 | 936 | end+end: 38; end+opponent: 62; end+self: 20; opponent+opponent-same-group: 383; opponent+self: 696; self+self: 220 |
| Piera | 1164 | 18.19 | 14.66 | 836 | opponent+opponent-same-group: 328; opponent+self: 767; self+self: 69 |

## (b) danno a sé delle last resort 2

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15502 | 15600 | 898 | 0.498 | 2.81 | 9.92 |
| Spazienzio–Mara | 16349 | 14833 | 818 | 0.524 | 2.56 | 9.52 |
| Spazienzio–Celestina | 13584 | 16784 | 1632 | 0.447 | 5.10 | 11.90 |
| Spazienzio–Piera | 14198 | 16460 | 1342 | 0.463 | 4.19 | **12.45** |
| Spazienzio–Beppe | 15793 | 15213 | 994 | 0.509 | 3.11 | 10.38 |
| Mara–Mara | 15335 | 15589 | 1076 | 0.496 | 3.36 | 8.78 |
| Mara–Celestina | 15863 | 14331 | 1806 | 0.525 | 5.64 | 10.93 |
| Mara–Piera | 19767 | 10226 | 2007 | **0.659** | 6.27 | 11.29 |
| Mara–Beppe | 17942 | 13458 | 600 | 0.571 | 1.88 | 9.39 |
| Celestina–Celestina | 12962 | 13094 | 5944 | 0.497 | **18.57** | **18.22** |
| Celestina–Piera | 19636 | 9985 | 2379 | **0.663** | 7.43 | **13.79** |
| Celestina–Beppe | 17699 | 11800 | 2501 | 0.600 | 7.82 | **12.39** |
| Piera–Piera | 13803 | 13793 | 4404 | 0.500 | **13.76** | **14.81** |
| Piera–Beppe | 14059 | 15367 | 2574 | 0.478 | 8.04 | **12.86** |
| Beppe–Beppe | 14800 | 14571 | 2629 | 0.504 | 8.22 | 10.84 |

Invarianti: 0 violazioni su 480000 partite. Bound: 0 in violazione su 15, massimo 4 (tetto 4).

Osservatore di SB-16e, primi 400 semi per cella (6.400 partite per specchio):

| Specchio | Patte | Patte % | Turni medi | Patte con danno a sé letale | Ultimi danni letali |
|---|---:|---:|---:|---:|---|
| Celestina | 1203 | 18.80 | 18.15 | 493 | end+end: 37; end+opponent: 67; end+self: 6; opponent+opponent-same-group: 606; opponent+self: 445; self+self: 42 |
| Piera | 916 | 14.31 | 14.78 | 442 | opponent+opponent-same-group: 474; opponent+self: 434; self+self: 8 |

## (c) entrambe

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15502 | 15600 | 898 | 0.498 | 2.81 | 9.92 |
| Spazienzio–Mara | 16349 | 14833 | 818 | 0.524 | 2.56 | 9.52 |
| Spazienzio–Celestina | 13584 | 16784 | 1632 | 0.447 | 5.10 | 11.90 |
| Spazienzio–Piera | 14017 | 16639 | 1344 | 0.457 | 4.20 | **12.44** |
| Spazienzio–Beppe | 15793 | 15213 | 994 | 0.509 | 3.11 | 10.38 |
| Mara–Mara | 15335 | 15589 | 1076 | 0.496 | 3.36 | 8.78 |
| Mara–Celestina | 15863 | 14331 | 1806 | 0.525 | 5.64 | 10.93 |
| Mara–Piera | 19603 | 10428 | 1969 | **0.653** | 6.15 | 11.29 |
| Mara–Beppe | 17942 | 13458 | 600 | 0.571 | 1.88 | 9.39 |
| Celestina–Celestina | 12962 | 13094 | 5944 | 0.497 | **18.57** | **18.22** |
| Celestina–Piera | 19617 | 10020 | 2363 | **0.662** | 7.38 | **13.80** |
| Celestina–Beppe | 17699 | 11800 | 2501 | 0.600 | 7.82 | **12.39** |
| Piera–Piera | 13934 | 13884 | 4182 | 0.501 | **13.07** | **14.83** |
| Piera–Beppe | 14935 | 14679 | 2386 | 0.504 | 7.46 | **12.88** |
| Beppe–Beppe | 14800 | 14571 | 2629 | 0.504 | 8.22 | 10.84 |

Invarianti: 0 violazioni su 480000 partite. Bound: 0 in violazione su 15, massimo 4 (tetto 4).

Osservatore di SB-16e, primi 400 semi per cella (6.400 partite per specchio):

| Specchio | Patte | Patte % | Turni medi | Patte con danno a sé letale | Ultimi danni letali |
|---|---:|---:|---:|---:|---|
| Celestina | 1203 | 18.80 | 18.15 | 493 | end+end: 37; end+opponent: 67; end+self: 6; opponent+opponent-same-group: 606; opponent+self: 445; self+self: 42 |
| Piera | 880 | 13.75 | 14.80 | 435 | opponent+opponent-same-group: 445; opponent+self: 426; self+self: 9 |

## Criteri

| Profilo | Violazioni | di cui patte | Patte max % | Patte globali % | Turni medi |
|---|---:|---:|---:|---:|---:|
| (b) danno a sé delle last resort 2 | 10 | 2 | 18.57 | 6.584 | 11.833 |
| (c) entrambe | 10 | 2 | 18.57 | 6.488 | 11.835 |
| Controllo (giro 3 di SB-16e) | 10 | 2 | 22.32 | 7.57 | 11.765 |
| (a) Un altro e arrivo +35 A | 10 | 2 | 22.32 | 7.514 | 11.767 |

Regola di adozione fissata prima in [selection.json](selection.json): prima nell’ordine, **(b) danno a sé delle last resort 2**.
