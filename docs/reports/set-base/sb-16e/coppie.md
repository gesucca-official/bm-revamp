# SB-16e — misure delle coppie

Osservazione: 400 semi per cella, 96.000 partite per giro, posti alternati. Le copie cercate sono seguite per identità.

## round-1

| Personaggio | Partite di posto | Cariche scelte/risolte | Ricerche trovate/tentate | Colpo già in mano alla carica | Colpi scelti/risolti | Parati da stati / eventi danno | Corazza | Esposizioni punite |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 38400 | 27829/27492 | 20039/27492 | 10276 | 27332/25953 | 1762/25953 | 2783 | 9943 |
| Mara | 38400 | 10835/10825 | 6951/10825 | 2541 | 51035/49483 | 4150/49483 | 0 | 8957 |
| Celestina | 38400 | 14364/14282 | 8323/14282 | 5596 | 57486/55659 | 0/55659 | 0 | 10494 |
| Piera | 38400 | 29502/29322 | 13911/29322 | 2409 | 67708/66272 | 5234/66272 | 10535 | 18633 |
| Beppe | 38400 | 17956/17846 | 5864/17846 | 2871 | 29462/28876 | 1831/28876 | 2181 | 14089 |

| Personaggio | Copie trovate giocate/risolte | Scartate per bound | Inutilizzate a fine partita | Attesa media turni | Annullati a terra/contromossa (tutti i colpi) | Danno assorbito stati/corazza | Eventi esposizione / danno extra | Cariche sopravvissute/risolte |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 8939/8340 | 1798 | 9302 | 2.67 | 728/651 | 31795/8690 | 10065/51444 | 26296/27492 |
| Mara | 4946/4683 | 905 | 1100 | 1.54 | 710/842 | 48614/0 | 12131/51154 | 9735/10825 |
| Celestina | 5000/4791 | 2249 | 1074 | 2.48 | 471/1356 | 0/0 | 13633/58165 | 13628/14282 |
| Piera | 11639/11298 | 1837 | 435 | 1.52 | 426/1010 | 39924/26212 | 20938/94512 | 28511/29322 |
| Beppe | 4120/4044 | 723 | 1021 | 2.23 | 156/430 | 11018/4964 | 18607/73503 | 16865/17846 |

### Esaurimento e finali

| Personaggio | Mazzo esaurito / partite di posto | Accesso alla last resort / partite di posto |
|---|---:|---:|
| Spazienzio | 9202/38400 | 4311/38400 |
| Mara | 11738/38400 | 5302/38400 |
| Celestina | 24325/38400 | 17979/38400 |
| Piera | 31643/38400 | 26350/38400 |
| Beppe | 29091/38400 | 19919/38400 |

Specchio Piera: 6.400 partite; 1897 patte, di cui 1456 con entrambe ad A=0. Differenza assoluta di A nel finale: 0: 4065, 1–5: 1938, 6–15: 395, oltre 15: 2.
I contatori `drawWithEndDamage`, `drawWithSelfDamage`, `drawReciprocalMoves` classificano la presenza di danni nell’ultimo turno, con precedenza fine turno → sé → mosse reciproche. Non provano quale evento sia stato letale: non sono usati come attribuzione causale.

### Ultimi danni letali negli specchi

Ogni riga: 6.400 partite. `opponent` è danno dell’avversario, `self` danno proprio, `end` fine turno; le coppie descrivono l’ultimo passaggio da salute positiva a zero di ciascun giocatore. Per due danni avversari si confrontano i gruppi fissati dopo i costi.

| Specchio | Patte osservate | Ultimi danni letali (numero di partite) |
|---|---:|---|
| Celestina | 1404 | end+end: 12; end+opponent: 37; end+self: 21; opponent+opponent-same-group: 359; opponent+self: 743; self+self: 232 |
| Piera | 1897 | opponent+opponent-same-group: 696; opponent+self: 1111; self+self: 90 |
| Beppe | 877 | opponent+opponent-same-group: 353; opponent+self: 483; self+self: 41 |

### Controlli con gli stessi semi (500 per cella)

Una coppia spenta ripristina solo il vecchio slot di caricamento di SB-16c, conserva il colpo e tutte le altre carte/numeri. Misura l’intero ridisegno dello slot, non la ricerca isolata.
| Variante | Incontro A–B | Quota A (Δ pp) | Patte % (Δ pp) | Turni (Δ) |
|---|---|---:|---:|---:|
| p3-off | Spazienzio–Spazienzio | 0.489 (-0.09) | 3.56 (-0.34) | 11.26 (-0.27) |
| p3-off | Spazienzio–Mara | 0.545 (+1.70) | 3.76 (-0.33) | 11.12 (-0.11) |
| p3-off | Spazienzio–Celestina | 0.344 (-0.54) | 5.40 (-0.07) | 13.00 (-0.12) |
| p3-off | Spazienzio–Piera | 0.372 (-1.67) | 5.94 (-0.69) | 14.18 (-0.14) |
| p3-off | Spazienzio–Beppe | 0.441 (+0.23) | 4.36 (-0.34) | 12.36 (-0.01) |
| p3-off | Mara–Mara | 0.506 (+0.25) | 4.38 (-0.40) | 10.58 (-0.01) |
| p3-off | Mara–Celestina | 0.378 (-1.55) | 6.65 (-0.54) | 12.48 (-0.03) |
| p3-off | Mara–Piera | 0.520 (-4.68) | 10.24 (-1.84) | 13.53 (-0.01) |
| p3-off | Mara–Beppe | 0.485 (-1.95) | 3.76 (-0.98) | 11.89 (+0.16) |
| p3-off | Celestina–Celestina | 0.494 (+0.00) | 22.01 (+0.00) | 18.31 (+0.00) |
| p3-off | Celestina–Piera | 0.759 (+0.00) | 8.91 (+0.00) | 15.03 (+0.00) |
| p3-off | Celestina–Beppe | 0.695 (+1.56) | 8.28 (-0.86) | 13.84 (+0.05) |
| p3-off | Piera–Piera | 0.510 (+0.00) | 29.43 (+0.00) | 16.48 (+0.00) |
| p3-off | Piera–Beppe | 0.566 (+4.52) | 12.75 (-1.82) | 14.83 (+0.11) |
| p3-off | Beppe–Beppe | 0.514 (+0.51) | 11.94 (-1.76) | 13.24 (+0.21) |
| pair-off-0 | Spazienzio–Spazienzio | 0.486 (-0.31) | 4.01 (+0.11) | 11.72 (+0.19) |
| pair-off-0 | Spazienzio–Mara | 0.516 (-1.21) | 4.16 (+0.08) | 11.32 (+0.09) |
| pair-off-0 | Spazienzio–Celestina | 0.340 (-0.87) | 5.78 (+0.30) | 13.27 (+0.14) |
| pair-off-0 | Spazienzio–Piera | 0.374 (-1.48) | 7.05 (+0.42) | 14.49 (+0.17) |
| pair-off-0 | Spazienzio–Beppe | 0.425 (-1.44) | 4.59 (-0.11) | 12.50 (+0.13) |
| pair-off-1 | Spazienzio–Mara | 0.492 (-3.56) | 3.96 (-0.13) | 11.23 (+0.00) |
| pair-off-1 | Mara–Mara | 0.513 (+0.98) | 4.81 (+0.04) | 10.80 (+0.21) |
| pair-off-1 | Mara–Celestina | 0.423 (+3.02) | 7.52 (+0.34) | 12.59 (+0.08) |
| pair-off-1 | Mara–Piera | 0.571 (+0.42) | 12.32 (+0.25) | 13.61 (+0.07) |
| pair-off-1 | Mara–Beppe | 0.536 (+3.14) | 4.65 (-0.09) | 11.84 (+0.10) |
| pair-off-2 | Spazienzio–Celestina | 0.397 (+4.82) | 5.92 (+0.45) | 12.45 (-0.67) |
| pair-off-2 | Mara–Celestina | 0.467 (+7.41) | 6.64 (-0.55) | 11.61 (-0.89) |
| pair-off-2 | Celestina–Celestina | 0.497 (+0.27) | 18.84 (-3.18) | 15.98 (-2.33) |
| pair-off-2 | Celestina–Piera | 0.679 (-8.03) | 9.53 (+0.61) | 14.66 (-0.37) |
| pair-off-2 | Celestina–Beppe | 0.591 (-8.88) | 8.74 (-0.40) | 13.20 (-0.59) |
| pair-off-3 | Spazienzio–Piera | 0.381 (-0.77) | 7.06 (+0.44) | 14.86 (+0.54) |
| pair-off-3 | Mara–Piera | 0.579 (+1.19) | 13.15 (+1.08) | 14.10 (+0.56) |
| pair-off-3 | Celestina–Piera | 0.781 (+2.18) | 9.55 (+0.64) | 15.46 (+0.43) |
| pair-off-3 | Piera–Piera | 0.517 (+0.75) | 35.50 (+6.07) | 17.00 (+0.52) |
| pair-off-3 | Piera–Beppe | 0.515 (-0.57) | 15.36 (+0.79) | 15.14 (+0.42) |
| pair-off-4 | Spazienzio–Beppe | 0.404 (-3.49) | 4.90 (+0.20) | 12.59 (+0.22) |
| pair-off-4 | Mara–Beppe | 0.472 (-3.32) | 5.08 (+0.34) | 12.00 (+0.27) |
| pair-off-4 | Celestina–Beppe | 0.693 (+1.34) | 9.35 (+0.21) | 14.04 (+0.25) |
| pair-off-4 | Piera–Beppe | 0.524 (+0.29) | 15.79 (+1.21) | 15.00 (+0.27) |
| pair-off-4 | Beppe–Beppe | 0.504 (-0.47) | 20.84 (+7.14) | 13.64 (+0.60) |
| piera-no-a | Spazienzio–Piera | 0.378 (-1.02) | 6.73 (+0.10) | 14.60 (+0.28) |
| piera-no-a | Mara–Piera | 0.562 (-0.47) | 12.43 (+0.35) | 13.80 (+0.26) |
| piera-no-a | Celestina–Piera | 0.772 (+1.32) | 9.39 (+0.47) | 15.30 (+0.27) |
| piera-no-a | Piera–Piera | 0.512 (+0.18) | 35.34 (+5.91) | 16.99 (+0.50) |
| piera-no-a | Piera–Beppe | 0.538 (+1.67) | 14.74 (+0.16) | 14.97 (+0.24) |
| piera-no-search | Spazienzio–Piera | 0.385 (-0.31) | 6.40 (-0.22) | 14.20 (-0.13) |
| piera-no-search | Mara–Piera | 0.562 (-0.52) | 11.75 (-0.32) | 13.39 (-0.15) |
| piera-no-search | Celestina–Piera | 0.759 (-0.03) | 9.53 (+0.61) | 14.94 (-0.09) |
| piera-no-search | Piera–Piera | 0.509 (-0.04) | 28.65 (-0.78) | 16.32 (-0.16) |
| piera-no-search | Piera–Beppe | 0.512 (-0.90) | 14.25 (-0.33) | 14.63 (-0.09) |
| poison-8 | Spazienzio–Celestina | 0.390 (+4.12) | 6.83 (+1.35) | 13.66 (+0.54) |
| poison-8 | Mara–Celestina | 0.464 (+7.05) | 8.76 (+1.58) | 13.02 (+0.52) |
| poison-8 | Celestina–Celestina | 0.498 (+0.33) | 22.45 (+0.44) | 18.89 (+0.58) |
| poison-8 | Celestina–Piera | 0.696 (-6.26) | 12.70 (+3.79) | 15.60 (+0.57) |
| poison-8 | Celestina–Beppe | 0.621 (-5.81) | 11.59 (+2.45) | 14.40 (+0.61) |

## round-2

| Personaggio | Partite di posto | Cariche scelte/risolte | Ricerche trovate/tentate | Colpo già in mano alla carica | Colpi scelti/risolti | Parati da stati / eventi danno | Corazza | Esposizioni punite |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 38400 | 23945/23632 | 18380/23632 | 8165 | 25369/24080 | 1662/24080 | 2659 | 8480 |
| Mara | 38400 | 8435/8427 | 6104/8427 | 1782 | 46584/45313 | 3623/45313 | 0 | 6886 |
| Celestina | 38400 | 13901/13823 | 8488/13823 | 5480 | 47762/46116 | 0/46116 | 0 | 10182 |
| Piera | 38400 | 29721/29543 | 14863/29543 | 2370 | 67156/65827 | 5427/65827 | 9811 | 18592 |
| Beppe | 38400 | 14651/14562 | 5503/14562 | 2384 | 26446/25934 | 1646/25934 | 1872 | 11257 |

| Personaggio | Copie trovate giocate/risolte | Scartate per bound | Inutilizzate a fine partita | Attesa media turni | Annullati a terra/contromossa (tutti i colpi) | Danno assorbito stati/corazza | Eventi esposizione / danno extra | Cariche sopravvissute/risolte |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 7873/7278 | 1553 | 8954 | 2.44 | 749/540 | 30324/5166 | 8560/43767 | 22627/23632 |
| Mara | 4096/3903 | 794 | 1214 | 1.53 | 664/607 | 42735/0 | 9294/40608 | 7500/8427 |
| Celestina | 4745/4438 | 1748 | 1995 | 2.29 | 757/889 | 0/0 | 13123/55657 | 12460/13823 |
| Piera | 12515/12179 | 1824 | 524 | 1.49 | 396/933 | 37568/17909 | 21013/95043 | 28874/29543 |
| Beppe | 3365/3300 | 672 | 1466 | 2.05 | 188/324 | 10003/3252 | 14543/57919 | 13470/14562 |

### Esaurimento e finali

| Personaggio | Mazzo esaurito / partite di posto | Accesso alla last resort / partite di posto |
|---|---:|---:|
| Spazienzio | 5511/38400 | 2348/38400 |
| Mara | 6502/38400 | 2695/38400 |
| Celestina | 16866/38400 | 12251/38400 |
| Piera | 29762/38400 | 24319/38400 |
| Beppe | 17642/38400 | 9728/38400 |

Specchio Piera: 6.400 partite; 1937 patte, di cui 1410 con entrambe ad A=0. Differenza assoluta di A nel finale: 0: 3806, 1–5: 1989, 6–15: 601, oltre 15: 4.
I contatori `drawWithEndDamage`, `drawWithSelfDamage`, `drawReciprocalMoves` classificano la presenza di danni nell’ultimo turno, con precedenza fine turno → sé → mosse reciproche. Non provano quale evento sia stato letale: non sono usati come attribuzione causale.

### Ultimi danni letali negli specchi

Ogni riga: 6.400 partite. `opponent` è danno dell’avversario, `self` danno proprio, `end` fine turno; le coppie descrivono l’ultimo passaggio da salute positiva a zero di ciascun giocatore. Per due danni avversari si confrontano i gruppi fissati dopo i costi.

| Specchio | Patte osservate | Ultimi danni letali (numero di partite) |
|---|---:|---|
| Celestina | 1389 | end+end: 26; end+opponent: 77; end+self: 20; opponent+opponent-same-group: 353; opponent+self: 738; self+self: 175 |
| Piera | 1937 | opponent+opponent-same-group: 683; opponent+self: 1170; self+self: 84 |
| Beppe | 532 | opponent+opponent-same-group: 378; opponent+self: 149; self+self: 5 |

### Controlli con gli stessi semi (500 per cella)

Una coppia spenta ripristina solo il vecchio slot di caricamento di SB-16c, conserva il colpo e tutte le altre carte/numeri. Misura l’intero ridisegno dello slot, non la ricerca isolata.
| Variante | Incontro A–B | Quota A (Δ pp) | Patte % (Δ pp) | Turni (Δ) |
|---|---|---:|---:|---:|
| p3-off | Spazienzio–Spazienzio | 0.483 (-0.36) | 2.57 (-0.36) | 9.69 (-0.25) |
| p3-off | Spazienzio–Mara | 0.551 (+1.45) | 2.54 (-0.31) | 9.47 (-0.08) |
| p3-off | Spazienzio–Celestina | 0.692 (-1.28) | 4.79 (-0.26) | 10.26 (-0.09) |
| p3-off | Spazienzio–Piera | 0.340 (-1.53) | 5.45 (-0.30) | 13.67 (-0.15) |
| p3-off | Spazienzio–Beppe | 0.507 (+0.60) | 2.41 (-0.61) | 10.44 (+0.02) |
| p3-off | Mara–Mara | 0.498 (+0.08) | 3.33 (+0.10) | 8.91 (+0.03) |
| p3-off | Mara–Celestina | 0.745 (-3.15) | 4.00 (+0.35) | 9.39 (+0.12) |
| p3-off | Mara–Piera | 0.459 (-4.40) | 9.88 (-1.88) | 13.22 (-0.04) |
| p3-off | Mara–Beppe | 0.543 (-2.58) | 2.35 (+0.38) | 9.78 (+0.26) |
| p3-off | Celestina–Beppe | 0.301 (+2.97) | 6.01 (+0.05) | 10.98 (+0.16) |
| p3-off | Piera–Beppe | 0.678 (+3.17) | 10.74 (-1.50) | 14.13 (+0.10) |
| p3-off | Beppe–Beppe | 0.520 (+0.64) | 7.91 (-0.60) | 11.11 (+0.24) |
| pair-off-0 | Spazienzio–Spazienzio | 0.492 (+0.58) | 2.88 (-0.06) | 10.10 (+0.15) |
| pair-off-0 | Spazienzio–Mara | 0.524 (-1.25) | 2.74 (-0.11) | 9.62 (+0.06) |
| pair-off-0 | Spazienzio–Celestina | 0.698 (-0.71) | 5.36 (+0.31) | 10.48 (+0.12) |
| pair-off-0 | Spazienzio–Piera | 0.338 (-1.68) | 5.86 (+0.11) | 13.96 (+0.14) |
| pair-off-0 | Spazienzio–Beppe | 0.478 (-2.33) | 2.90 (-0.12) | 10.57 (+0.16) |
| pair-off-1 | Spazienzio–Mara | 0.501 (-3.55) | 2.93 (+0.08) | 9.51 (-0.04) |
| pair-off-1 | Mara–Mara | 0.500 (+0.31) | 3.57 (+0.35) | 8.87 (-0.01) |
| pair-off-1 | Mara–Celestina | 0.804 (+2.81) | 3.65 (+0.00) | 9.03 (-0.23) |
| pair-off-1 | Mara–Piera | 0.520 (+1.64) | 11.81 (+0.06) | 13.31 (+0.06) |
| pair-off-1 | Mara–Beppe | 0.602 (+3.31) | 2.14 (+0.16) | 9.49 (-0.04) |
| pair-off-2 | Spazienzio–Celestina | 0.765 (+6.04) | 4.70 (-0.35) | 9.73 (-0.63) |
| pair-off-2 | Mara–Celestina | 0.807 (+3.09) | 2.86 (-0.79) | 8.66 (-0.60) |
| pair-off-2 | Celestina–Celestina | 0.487 (-1.19) | 11.82 (-10.43) | 12.18 (-3.61) |
| pair-off-2 | Celestina–Piera | 0.279 (-8.26) | 8.03 (-2.06) | 13.67 (-0.53) |
| pair-off-2 | Celestina–Beppe | 0.207 (-6.45) | 4.74 (-1.22) | 10.13 (-0.69) |
| pair-off-3 | Spazienzio–Piera | 0.346 (-0.90) | 6.41 (+0.66) | 14.39 (+0.57) |
| pair-off-3 | Mara–Piera | 0.507 (+0.37) | 12.84 (+1.09) | 13.86 (+0.61) |
| pair-off-3 | Celestina–Piera | 0.389 (+2.70) | 10.96 (+0.88) | 14.81 (+0.62) |
| pair-off-3 | Piera–Piera | 0.514 (+1.35) | 37.69 (+7.54) | 17.22 (+0.53) |
| pair-off-3 | Piera–Beppe | 0.646 (-0.03) | 12.28 (+0.04) | 14.51 (+0.48) |
| pair-off-4 | Spazienzio–Beppe | 0.473 (-2.77) | 3.41 (+0.39) | 10.60 (+0.19) |
| pair-off-4 | Mara–Beppe | 0.541 (-2.74) | 2.38 (+0.40) | 9.67 (+0.14) |
| pair-off-4 | Celestina–Beppe | 0.256 (-1.56) | 5.94 (-0.02) | 10.87 (+0.05) |
| pair-off-4 | Piera–Beppe | 0.653 (+0.67) | 13.38 (+1.14) | 14.30 (+0.27) |
| pair-off-4 | Beppe–Beppe | 0.508 (-0.50) | 8.34 (-0.18) | 11.35 (+0.48) |
| piera-no-a | Spazienzio–Piera | 0.346 (-0.88) | 5.45 (-0.30) | 14.07 (+0.25) |
| piera-no-a | Mara–Piera | 0.497 (-0.67) | 12.11 (+0.36) | 13.51 (+0.26) |
| piera-no-a | Celestina–Piera | 0.370 (+0.84) | 10.75 (+0.66) | 14.53 (+0.34) |
| piera-no-a | Piera–Piera | 0.510 (+1.00) | 38.31 (+8.16) | 17.19 (+0.50) |
| piera-no-a | Piera–Beppe | 0.665 (+1.87) | 12.26 (+0.03) | 14.26 (+0.23) |
| piera-no-search | Spazienzio–Piera | 0.347 (-0.78) | 5.46 (-0.29) | 13.66 (-0.16) |
| piera-no-search | Mara–Piera | 0.495 (-0.87) | 10.80 (-0.95) | 13.06 (-0.19) |
| piera-no-search | Celestina–Piera | 0.355 (-0.68) | 9.70 (-0.39) | 14.02 (-0.18) |
| piera-no-search | Piera–Piera | 0.496 (-0.39) | 29.65 (-0.50) | 16.49 (-0.20) |
| piera-no-search | Piera–Beppe | 0.636 (-1.00) | 11.85 (-0.39) | 13.87 (-0.16) |
| poison-8 | Spazienzio–Celestina | 0.754 (+4.96) | 5.55 (+0.50) | 10.69 (+0.33) |
| poison-8 | Mara–Celestina | 0.810 (+3.39) | 2.93 (-0.72) | 9.56 (+0.29) |
| poison-8 | Celestina–Celestina | 0.492 (-0.65) | 23.95 (+1.70) | 16.64 (+0.86) |
| poison-8 | Celestina–Piera | 0.284 (-7.76) | 10.14 (+0.05) | 14.57 (+0.37) |
| poison-8 | Celestina–Beppe | 0.228 (-4.40) | 5.40 (-0.56) | 11.16 (+0.34) |

## round-3

| Personaggio | Partite di posto | Cariche scelte/risolte | Ricerche trovate/tentate | Colpo già in mano alla carica | Colpi scelti/risolti | Parati da stati / eventi danno | Corazza | Esposizioni punite |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 38400 | 23871/23558 | 18421/23558 | 8113 | 25317/24019 | 1658/24019 | 2600 | 8217 |
| Mara | 38400 | 8287/8279 | 6101/8279 | 1708 | 46434/45034 | 3627/45034 | 0 | 6811 |
| Celestina | 38400 | 13936/13860 | 8148/13860 | 5440 | 54332/52480 | 0/52480 | 0 | 10153 |
| Piera | 38400 | 27890/27727 | 15841/27727 | 2210 | 64349/62706 | 4791/62706 | 9249 | 16651 |
| Beppe | 38400 | 14936/14847 | 5554/14847 | 2434 | 26663/26123 | 1657/26123 | 1836 | 11481 |

| Personaggio | Copie trovate giocate/risolte | Scartate per bound | Inutilizzate a fine partita | Attesa media turni | Annullati a terra/contromossa (tutti i colpi) | Danno assorbito stati/corazza | Eventi esposizione / danno extra | Cariche sopravvissute/risolte |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Spazienzio | 7922/7300 | 1544 | 8955 | 2.43 | 747/551 | 30234/5189 | 8302/43688 | 22488/23558 |
| Mara | 4067/3818 | 771 | 1263 | 1.52 | 724/676 | 42772/0 | 9183/39909 | 7343/8279 |
| Celestina | 4687/4445 | 2070 | 1391 | 2.55 | 705/1147 | 0/0 | 13131/55346 | 13064/13860 |
| Piera | 12768/12373 | 1680 | 1393 | 1.78 | 769/874 | 31773/17110 | 18924/87666 | 26429/27727 |
| Beppe | 3397/3323 | 667 | 1490 | 2.05 | 203/337 | 10070/3331 | 14843/58943 | 13651/14847 |

### Esaurimento e finali

| Personaggio | Mazzo esaurito / partite di posto | Accesso alla last resort / partite di posto |
|---|---:|---:|
| Spazienzio | 5102/38400 | 2174/38400 |
| Mara | 5883/38400 | 2528/38400 |
| Celestina | 19510/38400 | 14283/38400 |
| Piera | 23131/38400 | 16700/38400 |
| Beppe | 17861/38400 | 9361/38400 |

Specchio Piera: 6.400 partite; 1180 patte, di cui 714 con entrambe ad A=0. Differenza assoluta di A nel finale: 0: 2350, 1–5: 735, 6–15: 1400, oltre 15: 1915.
I contatori `drawWithEndDamage`, `drawWithSelfDamage`, `drawReciprocalMoves` classificano la presenza di danni nell’ultimo turno, con precedenza fine turno → sé → mosse reciproche. Non provano quale evento sia stato letale: non sono usati come attribuzione causale.

### Ultimi danni letali negli specchi

Ogni riga: 6.400 partite. `opponent` è danno dell’avversario, `self` danno proprio, `end` fine turno; le coppie descrivono l’ultimo passaggio da salute positiva a zero di ciascun giocatore. Per due danni avversari si confrontano i gruppi fissati dopo i costi.

| Specchio | Patte osservate | Ultimi danni letali (numero di partite) |
|---|---:|---|
| Celestina | 1419 | end+end: 38; end+opponent: 62; end+self: 20; opponent+opponent-same-group: 383; opponent+self: 696; self+self: 220 |
| Piera | 1180 | opponent+opponent-same-group: 352; opponent+self: 774; self+self: 54 |
| Beppe | 532 | opponent+opponent-same-group: 378; opponent+self: 149; self+self: 5 |

### Controlli con gli stessi semi (500 per cella)

Una coppia spenta ripristina solo il vecchio slot di caricamento di SB-16c, conserva il colpo e tutte le altre carte/numeri. Misura l’intero ridisegno dello slot, non la ricerca isolata.
| Variante | Incontro A–B | Quota A (Δ pp) | Patte % (Δ pp) | Turni (Δ) |
|---|---|---:|---:|---:|
| p3-off | Spazienzio–Spazienzio | 0.483 (-0.36) | 2.57 (-0.36) | 9.69 (-0.25) |
| p3-off | Spazienzio–Mara | 0.551 (+1.45) | 2.54 (-0.31) | 9.47 (-0.08) |
| p3-off | Spazienzio–Celestina | 0.450 (-0.93) | 5.41 (-0.25) | 11.77 (-0.13) |
| p3-off | Spazienzio–Piera | 0.458 (-2.21) | 5.64 (-0.25) | 12.34 (-0.12) |
| p3-off | Spazienzio–Beppe | 0.507 (+0.60) | 2.41 (-0.61) | 10.44 (+0.02) |
| p3-off | Mara–Mara | 0.498 (+0.08) | 3.33 (+0.10) | 8.91 (+0.03) |
| p3-off | Mara–Celestina | 0.498 (-3.00) | 5.90 (-0.10) | 11.06 (+0.04) |
| p3-off | Mara–Piera | 0.620 (-5.51) | 7.58 (+0.24) | 11.44 (+0.11) |
| p3-off | Mara–Beppe | 0.543 (-2.58) | 2.35 (+0.38) | 9.78 (+0.26) |
| p3-off | Celestina–Beppe | 0.619 (+2.23) | 7.31 (-0.85) | 12.44 (+0.05) |
| p3-off | Piera–Beppe | 0.513 (+5.34) | 9.04 (-0.49) | 12.95 (+0.11) |
| p3-off | Beppe–Beppe | 0.520 (+0.64) | 7.91 (-0.60) | 11.11 (+0.24) |
| pair-off-0 | Spazienzio–Spazienzio | 0.492 (+0.58) | 2.88 (-0.06) | 10.10 (+0.15) |
| pair-off-0 | Spazienzio–Mara | 0.524 (-1.25) | 2.74 (-0.11) | 9.62 (+0.06) |
| pair-off-0 | Spazienzio–Celestina | 0.447 (-1.20) | 5.64 (-0.03) | 12.05 (+0.15) |
| pair-off-0 | Spazienzio–Piera | 0.466 (-1.37) | 6.19 (+0.30) | 12.64 (+0.18) |
| pair-off-0 | Spazienzio–Beppe | 0.478 (-2.33) | 2.90 (-0.12) | 10.57 (+0.16) |
| pair-off-1 | Spazienzio–Mara | 0.501 (-3.55) | 2.93 (+0.08) | 9.51 (-0.04) |
| pair-off-1 | Mara–Mara | 0.500 (+0.31) | 3.57 (+0.35) | 8.87 (-0.01) |
| pair-off-1 | Mara–Celestina | 0.565 (+3.66) | 6.10 (+0.10) | 10.99 (-0.03) |
| pair-off-1 | Mara–Piera | 0.701 (+2.56) | 7.59 (+0.25) | 11.25 (-0.08) |
| pair-off-1 | Mara–Beppe | 0.602 (+3.31) | 2.14 (+0.16) | 9.49 (-0.04) |
| pair-off-2 | Spazienzio–Celestina | 0.493 (+3.41) | 5.74 (+0.07) | 11.24 (-0.67) |
| pair-off-2 | Mara–Celestina | 0.574 (+4.54) | 5.69 (-0.31) | 10.21 (-0.82) |
| pair-off-2 | Celestina–Celestina | 0.492 (-1.16) | 15.66 (-6.55) | 14.68 (-2.76) |
| pair-off-2 | Celestina–Piera | 0.626 (-6.77) | 8.31 (+0.14) | 13.14 (-0.51) |
| pair-off-2 | Celestina–Beppe | 0.512 (-8.43) | 8.35 (+0.19) | 11.70 (-0.69) |
| pair-off-3 | Spazienzio–Piera | 0.497 (+1.68) | 6.44 (+0.55) | 13.22 (+0.77) |
| pair-off-3 | Mara–Piera | 0.712 (+3.69) | 8.38 (+1.04) | 12.11 (+0.77) |
| pair-off-3 | Celestina–Piera | 0.741 (+4.73) | 8.03 (-0.15) | 14.21 (+0.56) |
| pair-off-3 | Piera–Piera | 0.510 (+0.27) | 28.71 (+10.40) | 15.55 (+0.89) |
| pair-off-3 | Piera–Beppe | 0.428 (-3.20) | 10.85 (+1.32) | 13.58 (+0.75) |
| pair-off-4 | Spazienzio–Beppe | 0.473 (-2.77) | 3.41 (+0.39) | 10.60 (+0.19) |
| pair-off-4 | Mara–Beppe | 0.541 (-2.74) | 2.38 (+0.40) | 9.67 (+0.14) |
| pair-off-4 | Celestina–Beppe | 0.602 (+0.55) | 8.36 (+0.20) | 12.65 (+0.25) |
| pair-off-4 | Piera–Beppe | 0.444 (-1.63) | 11.31 (+1.79) | 13.10 (+0.26) |
| pair-off-4 | Beppe–Beppe | 0.508 (-0.50) | 8.34 (-0.18) | 11.35 (+0.48) |
| piera-no-a | Spazienzio–Piera | 0.486 (+0.60) | 6.00 (+0.11) | 12.83 (+0.38) |
| piera-no-a | Mara–Piera | 0.693 (+1.75) | 8.55 (+1.21) | 11.71 (+0.38) |
| piera-no-a | Celestina–Piera | 0.721 (+2.75) | 8.59 (+0.41) | 13.99 (+0.34) |
| piera-no-a | Piera–Piera | 0.510 (+0.30) | 27.61 (+9.30) | 15.32 (+0.66) |
| piera-no-a | Piera–Beppe | 0.464 (+0.41) | 9.75 (+0.22) | 13.21 (+0.37) |
| piera-no-search | Spazienzio–Piera | 0.480 (+0.00) | 5.94 (+0.05) | 12.44 (-0.02) |
| piera-no-search | Mara–Piera | 0.673 (-0.24) | 7.17 (-0.16) | 11.28 (-0.05) |
| piera-no-search | Celestina–Piera | 0.698 (+0.47) | 8.60 (+0.42) | 13.62 (-0.03) |
| piera-no-search | Piera–Piera | 0.502 (-0.49) | 18.40 (+0.09) | 14.63 (-0.03) |
| piera-no-search | Piera–Beppe | 0.454 (-0.61) | 9.32 (-0.20) | 12.82 (-0.01) |
| poison-8 | Spazienzio–Celestina | 0.505 (+4.64) | 6.15 (+0.49) | 12.42 (+0.52) |
| poison-8 | Mara–Celestina | 0.594 (+6.58) | 6.45 (+0.45) | 11.49 (+0.47) |
| poison-8 | Celestina–Celestina | 0.499 (-0.42) | 23.44 (+1.23) | 18.09 (+0.66) |
| poison-8 | Celestina–Piera | 0.631 (-6.31) | 10.96 (+2.79) | 14.29 (+0.64) |
| poison-8 | Celestina–Beppe | 0.534 (-6.30) | 9.81 (+1.65) | 13.02 (+0.62) |
