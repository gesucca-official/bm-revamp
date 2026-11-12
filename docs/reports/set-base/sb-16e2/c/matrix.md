# Banco SB-7 — bozza.json [sb16e2-c]

> SB-16e matrix

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json [sb16e2-c]` |
| SHA-256 | `3eb6a82c9001509156bb4c869f62276ab3c94e5ee6a3ddf1435c69c3d17c5a34` |
| Regole | d50 (playground, D50) |
| Formato | sb-6b/1: 20 carte, al massimo 2 copie, 2 bound |
| Banco | sb-7/1 |
| Mazzi | starter-spazienzio, starter-mara, starter-tossico, starter-pino, starter-gigi |
| Stili | aggressivo, prudente, risorse, com: 16 coppie |
| Semi | 7000000–7001999, posti alternati (semi pari: A gioca per primo) |
| Partite | 2000 per cella, 240 celle, 480000 in tutto |
| Tetto delle bound | 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33; 8 usi contro un manichino |
| Tempi | non qui: nel file `.tempi.txt` accanto, perché questo testo resti uguale a ogni esecuzione |

Quota = vittorie / (vittorie + sconfitte), patte e limite esclusi. Intervalli di Wilson al 95%: coprono solo l'errore di campionamento, **non i limiti dei bot**. Con molte celle, circa una su venti cade fuori per caso.

## Invarianti

480000 partite, 11362034 turni di giocatore controllati.

| Invariante | Cosa controlla | Violazioni |
|---|---|---:|
| senza-mosse | ogni giocatore vivo ha almeno una mossa legale | 0 |
| mossa-vuota | nessun giocatore vivo invia una mossa vuota | 0 |
| bound-gratuite | ogni bound della bozza è gratuita (D2) | 0 |
| basic-bound-in-mano | basic e bound del mazzo sono sempre in mano | 0 |
| last-resort-in-mano | a mazzo vuoto e mano incompleta la last resort è in mano | 0 |
| last-resort-giocabile | la last resort in mano è sempre una mossa legale | 0 |
| bound-giocabile | con una carta regolare da scartare ogni bound in mano è legale | 0 |
| limite-turni | nessuna partita arriva al limite di 200 turni | 0 |
| tetto-bound | valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario | 0 bound su 15 |

## Matrice dei mazzi

Somma delle 16 coppie di stili, a pari peso.

| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |
|---|---|---:|---:|---:|---:|---:|---|---|
| starter-spazienzio | starter-spazienzio | 32000 | 15502 | 15600 | 898 | 0 | 0,498 [0,493–0,504] | 0,502 [0,497–0,508] |
| starter-spazienzio | starter-mara | 32000 | 16349 | 14833 | 818 | 0 | 0,524 [0,519–0,530] | 0,509 [0,504–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 13584 | 16784 | 1632 | 0 | 0,447 [0,442–0,453] | 0,498 [0,493–0,504] |
| starter-spazienzio | starter-pino | 32000 | 14017 | 16639 | 1344 | 0 | 0,457 [0,452–0,463] | 0,503 [0,497–0,508] |
| starter-spazienzio | starter-gigi | 32000 | 15793 | 15213 | 994 | 0 | 0,509 [0,504–0,515] | 0,507 [0,501–0,512] |
| starter-mara | starter-mara | 32000 | 15335 | 15589 | 1076 | 0 | 0,496 [0,490–0,501] | 0,504 [0,499–0,510] |
| starter-mara | starter-tossico | 32000 | 15863 | 14331 | 1806 | 0 | 0,525 [0,520–0,531] | 0,504 [0,498–0,510] |
| starter-mara | starter-pino | 32000 | 19603 | 10428 | 1969 | 0 | 0,653 [0,647–0,658] | 0,506 [0,500–0,512] |
| starter-mara | starter-gigi | 32000 | 17942 | 13458 | 600 | 0 | 0,571 [0,566–0,577] | 0,506 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 12962 | 13094 | 5944 | 0 | 0,497 [0,491–0,504] | 0,496 [0,490–0,502] |
| starter-tossico | starter-pino | 32000 | 19617 | 10020 | 2363 | 0 | 0,662 [0,657–0,667] | 0,497 [0,492–0,503] |
| starter-tossico | starter-gigi | 32000 | 17699 | 11800 | 2501 | 0 | 0,600 [0,594–0,606] | 0,501 [0,496–0,507] |
| starter-pino | starter-pino | 32000 | 13934 | 13884 | 4182 | 0 | 0,501 [0,495–0,507] | 0,491 [0,485–0,497] |
| starter-pino | starter-gigi | 32000 | 14935 | 14679 | 2386 | 0 | 0,504 [0,499–0,510] | 0,507 [0,502–0,513] |
| starter-gigi | starter-gigi | 32000 | 14800 | 14571 | 2629 | 0 | 0,504 [0,498–0,510] | 0,491 [0,485–0,497] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,495 [0,473–0,517] | 0,464 [0,442–0,487] | 0,412 [0,391–0,434] | 0,635 [0,613–0,656] |
| prudente | 0,526 [0,504–0,548] | 0,498 [0,475–0,522] | 0,319 [0,299–0,340] | 0,610 [0,588–0,631] |
| risorse | 0,601 [0,579–0,622] | 0,672 [0,651–0,693] | 0,506 [0,484–0,528] | 0,789 [0,770–0,806] |
| com | 0,339 [0,318–0,360] | 0,405 [0,384–0,427] | 0,199 [0,182–0,218] | 0,506 [0,484–0,528] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,419 [0,397–0,441] | 0,313 [0,293–0,334] | 0,427 [0,406–0,449] | 0,860 [0,844–0,875] |
| prudente | 0,385 [0,363–0,407] | 0,339 [0,318–0,362] | 0,409 [0,387–0,431] | 0,888 [0,873–0,901] |
| risorse | 0,648 [0,626–0,668] | 0,587 [0,565–0,608] | 0,660 [0,638–0,680] | 0,975 [0,968–0,981] |
| com | 0,218 [0,200–0,237] | 0,221 [0,204–0,240] | 0,250 [0,232–0,270] | 0,769 [0,750–0,787] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,351 [0,330–0,373] | 0,375 [0,354–0,397] | 0,346 [0,325–0,367] | 0,734 [0,713–0,753] |
| prudente | 0,106 [0,093–0,121] | 0,164 [0,148–0,182] | 0,087 [0,075–0,101] | 0,607 [0,584–0,629] |
| risorse | 0,681 [0,659–0,701] | 0,744 [0,724–0,763] | 0,703 [0,682–0,723] | 0,936 [0,924–0,946] |
| com | 0,246 [0,227–0,265] | 0,248 [0,229–0,267] | 0,209 [0,192–0,228] | 0,622 [0,600–0,644] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,348 [0,327–0,370] | 0,313 [0,293–0,334] | 0,366 [0,344–0,388] | 0,781 [0,762–0,799] |
| prudente | 0,168 [0,151–0,185] | 0,075 [0,064–0,088] | 0,161 [0,146–0,178] | 0,793 [0,774–0,811] |
| risorse | 0,609 [0,587–0,630] | 0,723 [0,702–0,742] | 0,635 [0,613–0,657] | 0,973 [0,965–0,979] |
| com | 0,230 [0,211–0,249] | 0,223 [0,205–0,242] | 0,214 [0,196–0,233] | 0,698 [0,677–0,718] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,305 [0,285–0,325] | 0,439 [0,417–0,461] | 0,425 [0,404–0,447] | 0,793 [0,774–0,810] |
| prudente | 0,207 [0,189–0,226] | 0,419 [0,396–0,442] | 0,364 [0,343–0,386] | 0,827 [0,810–0,844] |
| risorse | 0,517 [0,495–0,539] | 0,729 [0,709–0,748] | 0,692 [0,672–0,712] | 0,947 [0,936–0,956] |
| com | 0,175 [0,159–0,192] | 0,294 [0,274–0,314] | 0,276 [0,256–0,296] | 0,722 [0,701–0,741] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,495 [0,472–0,517] | 0,601 [0,579–0,623] | 0,553 [0,531–0,575] | 0,964 [0,955–0,972] |
| prudente | 0,384 [0,363–0,406] | 0,508 [0,485–0,531] | 0,463 [0,441–0,486] | 0,954 [0,944–0,962] |
| risorse | 0,440 [0,418–0,462] | 0,518 [0,495–0,540] | 0,489 [0,467–0,511] | 0,954 [0,944–0,962] |
| com | 0,025 [0,019–0,032] | 0,044 [0,036–0,054] | 0,044 [0,036–0,054] | 0,499 [0,477–0,522] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,695 [0,674–0,716] | 0,692 [0,671–0,712] | 0,668 [0,647–0,689] | 0,951 [0,940–0,960] |
| prudente | 0,474 [0,451–0,497] | 0,501 [0,478–0,523] | 0,418 [0,395–0,440] | 0,898 [0,884–0,911] |
| risorse | 0,588 [0,565–0,610] | 0,615 [0,593–0,637] | 0,566 [0,543–0,588] | 0,917 [0,904–0,929] |
| com | 0,049 [0,040–0,060] | 0,025 [0,019–0,033] | 0,029 [0,022–0,037] | 0,372 [0,351–0,394] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,767 [0,747–0,785] | 0,924 [0,911–0,936] | 0,714 [0,693–0,734] | 0,994 [0,989–0,997] |
| prudente | 0,745 [0,724–0,765] | 0,797 [0,776–0,816] | 0,678 [0,656–0,700] | 0,987 [0,981–0,991] |
| risorse | 0,704 [0,683–0,725] | 0,881 [0,865–0,895] | 0,677 [0,656–0,698] | 0,988 [0,982–0,992] |
| com | 0,069 [0,059–0,081] | 0,054 [0,045–0,065] | 0,048 [0,040–0,059] | 0,469 [0,446–0,491] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,420 [0,399–0,442] | 0,697 [0,676–0,717] | 0,655 [0,634–0,676] | 0,978 [0,971–0,984] |
| prudente | 0,625 [0,603–0,646] | 0,868 [0,853–0,883] | 0,797 [0,779–0,814] | 0,984 [0,978–0,989] |
| risorse | 0,347 [0,326–0,368] | 0,625 [0,603–0,646] | 0,564 [0,542–0,585] | 0,950 [0,939–0,959] |
| com | 0,025 [0,019–0,033] | 0,062 [0,052–0,074] | 0,059 [0,050–0,071] | 0,483 [0,460–0,506] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,485 [0,460–0,511] | 0,277 [0,255–0,300] | 0,289 [0,266–0,312] | 0,751 [0,731–0,770] |
| prudente | 0,690 [0,667–0,713] | 0,481 [0,455–0,508] | 0,469 [0,442–0,496] | 0,811 [0,793–0,828] |
| risorse | 0,692 [0,668–0,716] | 0,528 [0,501–0,555] | 0,504 [0,476–0,532] | 0,782 [0,763–0,799] |
| com | 0,256 [0,237–0,277] | 0,192 [0,175–0,211] | 0,240 [0,222–0,260] | 0,497 [0,475–0,519] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,743 [0,722–0,763] | 0,941 [0,929–0,951] | 0,709 [0,687–0,729] | 0,993 [0,988–0,996] |
| prudente | 0,513 [0,490–0,536] | 0,672 [0,650–0,693] | 0,414 [0,391–0,437] | 0,988 [0,983–0,992] |
| risorse | 0,691 [0,669–0,712] | 0,906 [0,892–0,918] | 0,711 [0,690–0,732] | 0,995 [0,991–0,998] |
| com | 0,179 [0,162–0,197] | 0,282 [0,262–0,302] | 0,180 [0,163–0,198] | 0,626 [0,604–0,648] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,444 [0,420–0,467] | 0,864 [0,847–0,879] | 0,720 [0,699–0,740] | 0,965 [0,956–0,972] |
| prudente | 0,322 [0,301–0,344] | 0,730 [0,709–0,751] | 0,527 [0,504–0,550] | 0,972 [0,963–0,978] |
| risorse | 0,406 [0,383–0,429] | 0,854 [0,838–0,870] | 0,680 [0,658–0,701] | 0,976 [0,969–0,982] |
| com | 0,078 [0,066–0,090] | 0,224 [0,206–0,244] | 0,153 [0,138–0,170] | 0,628 [0,606–0,650] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,487 [0,462–0,512] | 0,743 [0,719–0,766] | 0,426 [0,403–0,449] | 0,988 [0,982–0,992] |
| prudente | 0,261 [0,238–0,285] | 0,508 [0,477–0,540] | 0,164 [0,148–0,182] | 0,993 [0,988–0,996] |
| risorse | 0,571 [0,548–0,594] | 0,861 [0,845–0,876] | 0,504 [0,481–0,528] | 0,989 [0,984–0,993] |
| com | 0,012 [0,008–0,018] | 0,006 [0,003–0,011] | 0,007 [0,004–0,011] | 0,501 [0,477–0,524] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,317 [0,296–0,339] | 0,678 [0,656–0,700] | 0,579 [0,557–0,602] | 0,942 [0,931–0,951] |
| prudente | 0,151 [0,135–0,168] | 0,725 [0,703–0,747] | 0,394 [0,371–0,418] | 0,984 [0,978–0,989] |
| risorse | 0,355 [0,334–0,378] | 0,769 [0,749–0,787] | 0,579 [0,557–0,602] | 0,959 [0,950–0,967] |
| com | 0,008 [0,005–0,012] | 0,028 [0,021–0,036] | 0,022 [0,017–0,030] | 0,589 [0,566–0,611] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,512 [0,487–0,536] | 0,844 [0,826–0,860] | 0,756 [0,736–0,775] | 0,982 [0,976–0,987] |
| prudente | 0,157 [0,140–0,175] | 0,508 [0,483–0,533] | 0,407 [0,384–0,430] | 0,956 [0,946–0,964] |
| risorse | 0,243 [0,224–0,262] | 0,589 [0,566–0,612] | 0,510 [0,487–0,533] | 0,951 [0,941–0,960] |
| com | 0,022 [0,016–0,029] | 0,045 [0,037–0,055] | 0,054 [0,045–0,065] | 0,528 [0,505–0,550] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 9,92 [9,88–9,96] | 9 | 6–15 | 2–22 | 0,028 [0,026–0,030] | 0 |
| starter-spazienzio | starter-mara | 9,52 [9,48–9,55] | 9 | 6–14 | 3–23 | 0,026 [0,024–0,027] | 0 |
| starter-spazienzio | starter-tossico | 11,90 [11,86–11,94] | 12 | 7–17 | 2–24 | 0,051 [0,049–0,053] | 0 |
| starter-spazienzio | starter-pino | 12,44 [12,40–12,48] | 13 | 8–17 | 2–23 | 0,042 [0,040–0,044] | 0 |
| starter-spazienzio | starter-gigi | 10,38 [10,35–10,42] | 10 | 7–15 | 2–22 | 0,031 [0,029–0,033] | 0 |
| starter-mara | starter-mara | 8,78 [8,75–8,82] | 8 | 5–13 | 2–22 | 0,034 [0,032–0,036] | 0 |
| starter-mara | starter-tossico | 10,93 [10,90–10,97] | 11 | 7–15 | 2–23 | 0,056 [0,054–0,059] | 0 |
| starter-mara | starter-pino | 11,29 [11,26–11,33] | 11 | 7–15 | 3–22 | 0,062 [0,059–0,064] | 0 |
| starter-mara | starter-gigi | 9,39 [9,37–9,42] | 9 | 6–13 | 3–22 | 0,019 [0,017–0,020] | 0 |
| starter-tossico | starter-tossico | 18,22 [18,17–18,27] | 19 | 12–22 | 3–31 | 0,186 [0,182–0,190] | 0 |
| starter-tossico | starter-pino | 13,80 [13,77–13,84] | 14 | 10–17 | 3–26 | 0,074 [0,071–0,077] | 0 |
| starter-tossico | starter-gigi | 12,39 [12,35–12,42] | 12 | 9–16 | 2–24 | 0,078 [0,075–0,081] | 0 |
| starter-pino | starter-pino | 14,83 [14,80–14,86] | 15 | 12–17 | 4–25 | 0,131 [0,127–0,134] | 0 |
| starter-pino | starter-gigi | 12,88 [12,85–12,91] | 13 | 9–16 | 4–23 | 0,075 [0,072–0,077] | 0 |
| starter-gigi | starter-gigi | 10,84 [10,82–10,87] | 11 | 8–14 | 4–22 | 0,082 [0,079–0,085] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,490 [0,488–0,492] | 9,1% | 5,9% | 17,21 | 17 |
| starter-mara | 192000 | 0,537 [0,535–0,539] | 9,7% | 6,5% | 15,26 | 15 |
| starter-tossico | 192000 | 0,550 [0,548–0,552] | 44,0% | 38,3% | 15,98 | 16 |
| starter-pino | 192000 | 0,455 [0,452–0,457] | 52,3% | 44,3% | 14,59 | 14 |
| starter-gigi | 192000 | 0,469 [0,467–0,471] | 33,2% | 24,6% | 13,47 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,5 | 14,4 | 25 |
| starter-spazienzio | T | 1,9 | 3,5 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 24,1 | 18,0 | 5 |
| starter-mara | V | 0,0 | 0,0 | 0 |
| starter-mara | T | 1,6 | 3,7 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 6,4 | 22,3 | 15 |
| starter-tossico | V | 8,2 | 5,9 | 0 |
| starter-tossico | T | 12,4 | 24,7 | 10 |
| starter-tossico | L | 1,2 | 3,1 | 0 |
| starter-tossico | A | 13,0 | 14,2 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 0,8 | 2,5 | 0 |
| starter-pino | L | 0,2 | 5,0 | 5 |
| starter-pino | A | 19,8 | 14,3 | 0 |
| starter-gigi | V | 3,0 | 13,5 | 15 |
| starter-gigi | T | 0,7 | 2,1 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,4 | 25,6 | 10 |

## Costo pagato in HEALTH

Morte pagando: il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore (R04: muore, e la mossa prosegue). «Senza uccidere»: l'avversario è ancora vivo a fine turno.

| mazzo | stile | partite | HEALTH spesa per partita | morti pagando | senza uccidere | sconfitte | patte |
|---|---|---:|---:|---:|---:|---:|---:|
| starter-spazienzio | aggressivo | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-spazienzio | prudente | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-spazienzio | risorse | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-spazienzio | com | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | aggressivo | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | prudente | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | risorse | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | com | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-tossico | aggressivo | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-tossico | prudente | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-tossico | risorse | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-tossico | com | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-pino | aggressivo | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-pino | prudente | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-pino | risorse | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-pino | com | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-gigi | aggressivo | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-gigi | prudente | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-gigi | risorse | 48000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-gigi | com | 48000 | 0,00 | 0 | 0 | 0 | 0 |

## Carte

Per mazzo, su tutti gli stili. *Giocate*: scelte e pagate, anche se poi annullate. *Quota se giocata*: nelle partite in cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo. *Morta*: turni in mano senza essere una mossa legale; *ferma*: turni in mano, legale ma non scelta; entrambe per partita in cui la carta è stata in mano.

**starter-spazienzio**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.DentiStretti | 0,26 | 25,8% | 0,574 (+0,084) | 0,00 | 2,06 |
| base.com.MattoneDelCantiere | 0,38 | 37,6% | 0,538 (+0,048) | 1,82 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,56 | 38,3% | 0,390 (−0,100) | 0,05 | 2,54 |
| bruiser.ExtremelyViolentBlow | 0,72 | 56,9% | 0,443 (−0,047) | 1,47 | 1,32 |
| bruiser.Glare | 0,62 | 49,7% | 0,607 (+0,117) | 0,00 | 2,35 |
| bruiser.HealingBlow | 0,26 | 26,0% | 0,569 (+0,079) | 2,99 | 0,54 |
| bruiser.MadeOfStone | 0,92 | 65,8% | 0,528 (+0,038) | 0,00 | 1,98 |
| bruiser.SeagullFly | 0,92 | 70,8% | 0,513 (+0,023) | 1,46 | 0,96 |
| bruiser.SuperImpact | 0,66 | 58,3% | 0,631 (+0,141) | 4,45 | 0,59 |
| bruiser.YouStop | 0,41 | 31,1% | 0,353 (−0,137) | 1,26 | 2,29 |
| bruiser.character.LittleRage | 0,68 | 29,9% | 0,384 (−0,105) | 0,01 | 9,99 |
| bruiser.character.LittleSmack | 3,46 | 90,7% | 0,462 (−0,028) | 0,01 | 7,21 |
| com.basic.BruiserGrab | 0,77 | 62,3% | 0,394 (−0,096) | 5,11 | 4,81 |
| com.last.Struggle | 0,08 | 4,9% | 0,504 (+0,014) | 0,00 | 0,48 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,21 | 81,3% | 0,579 (+0,042) | 0,00 | 1,89 |
| base.com.SputoDaPosacenere | 1,18 | 81,2% | 0,591 (+0,054) | 0,21 | 1,21 |
| base.com.TartarugaSulMarciapiede | 0,26 | 26,0% | 0,443 (−0,094) | 0,20 | 2,81 |
| base.mara.CinghiataDiTraverso | 1,19 | 81,8% | 0,592 (+0,055) | 0,20 | 1,19 |
| base.mara.PresoAlVolo | 0,92 | 56,5% | 0,399 (−0,138) | 1,95 | 6,92 |
| base.mara.Sgommata | 1,22 | 86,7% | 0,616 (+0,079) | 0,59 | 0,88 |
| base.mara.Slalom | 0,22 | 21,6% | 0,405 (−0,132) | 0,00 | 3,93 |
| base.mara.SorpassoInCurva | 0,99 | 69,4% | 0,548 (+0,011) | 0,00 | 3,54 |
| base.mara.TraDueParaurti | 0,52 | 38,1% | 0,456 (−0,081) | 0,37 | 4,11 |
| base.mara.bound.CambioMarcia | 0,54 | 24,5% | 0,201 (−0,336) | 0,02 | 9,23 |
| base.mara.bound.PassoStretto | 1,39 | 72,7% | 0,491 (−0,046) | 0,02 | 8,37 |
| com.Steal | 0,08 | 8,1% | 0,121 (−0,416) | 1,22 | 2,47 |
| com.last.Struggle | 0,07 | 4,6% | 0,565 (+0,028) | 0,00 | 1,10 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,63 | 62,6% | 0,574 (+0,024) | 0,00 | 1,69 |
| base.com.RincorsaDalMarciapiede | 1,52 | 89,8% | 0,590 (+0,040) | 0,10 | 0,99 |
| base.tossico.bound.RaschiareIlFondo | 0,70 | 28,2% | 0,358 (−0,192) | 0,18 | 13,37 |
| com.Grab | 0,32 | 28,3% | 0,464 (−0,086) | 1,23 | 3,27 |
| com.Steal | 0,09 | 8,9% | 0,274 (−0,276) | 0,71 | 2,00 |
| com.basic.ToxicGrab | 1,75 | 89,0% | 0,571 (+0,022) | 3,29 | 9,20 |
| junkie.AmphetamineReflexes | 0,53 | 40,4% | 0,485 (−0,065) | 3,67 | 2,74 |
| junkie.Cough | 1,43 | 86,4% | 0,609 (+0,059) | 2,26 | 0,84 |
| junkie.LethalHeroinDose | 1,24 | 35,3% | 0,554 (+0,004) | 0,00 | 0,81 |
| junkie.MethDrivenRage | 0,37 | 29,5% | 0,406 (−0,144) | 0,00 | 6,02 |
| junkie.PervertedMetabolism | 1,02 | 68,5% | 0,511 (−0,039) | 0,00 | 4,08 |
| junkie.ToxicBloodDrain | 0,10 | 9,6% | 0,549 (−0,001) | 1,27 | 1,49 |
| junkie.character.PatheticBlade | 4,56 | 97,5% | 0,558 (+0,008) | 0,18 | 9,50 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,15 | 73,1% | 0,444 (−0,011) | 0,00 | 3,85 |
| base.com.Spintone | 1,55 | 90,2% | 0,485 (+0,030) | 0,00 | 1,64 |
| base.pino.GoingBerserk | 1,66 | 93,4% | 0,484 (+0,029) | 0,00 | 1,20 |
| base.pino.IlBanconeRegge | 1,14 | 74,5% | 0,457 (+0,003) | 0,00 | 2,93 |
| base.pino.OffroIo | 0,76 | 50,4% | 0,437 (−0,017) | 0,00 | 3,60 |
| base.pino.QuestoLoFiniscoIo | 0,79 | 45,3% | 0,374 (−0,080) | 2,15 | 10,41 |
| base.pino.RuttoADistanzaSociale | 0,15 | 15,5% | 0,377 (−0,077) | 4,47 | 0,78 |
| base.pino.TestataDaUltimoGiro | 0,94 | 67,5% | 0,561 (+0,106) | 5,31 | 0,50 |
| base.pino.UltimoGiro | 0,81 | 39,1% | 0,622 (+0,168) | 0,00 | 0,52 |
| base.pino.bound.CinqueMinutiEVado | 0,90 | 35,1% | 0,264 (−0,191) | 0,10 | 12,35 |
| base.pino.bound.SpallataAlBancone | 3,13 | 94,7% | 0,458 (+0,003) | 0,10 | 10,12 |
| com.Grab | 0,37 | 31,9% | 0,391 (−0,063) | 0,85 | 3,59 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,88 | 79,3% | 0,514 (+0,045) | 3,64 | 0,83 |
| base.com.Spintone | 0,75 | 74,8% | 0,536 (+0,067) | 0,00 | 1,03 |
| base.gigi.ChiaveDaTredici | 1,41 | 88,1% | 0,513 (+0,044) | 0,98 | 1,23 |
| base.gigi.ColpoDiChiaveInglese | 0,40 | 40,3% | 0,524 (+0,055) | 0,00 | 3,11 |
| base.gigi.LavoroFattoBene | 0,70 | 70,2% | 0,552 (+0,083) | 0,72 | 1,05 |
| base.gigi.QuestoTornaUtile | 1,34 | 63,2% | 0,373 (−0,095) | 0,94 | 8,84 |
| base.gigi.SottoIlCofano | 0,31 | 31,3% | 0,366 (−0,103) | 1,20 | 2,07 |
| base.gigi.bound.ColpoDiCacciavite | 3,32 | 94,9% | 0,467 (−0,001) | 0,06 | 7,74 |
| base.gigi.bound.UnaStrettaEPassa | 0,80 | 37,9% | 0,401 (−0,068) | 0,06 | 10,25 |
| bruiser.BreakYourToy | 0,17 | 14,1% | 0,127 (−0,342) | 2,19 | 2,57 |
| bruiser.SeagullFly | 0,54 | 54,0% | 0,556 (+0,087) | 1,60 | 0,65 |
| com.Steal | 0,17 | 14,4% | 0,138 (−0,331) | 1,14 | 3,22 |
| com.last.Struggle | 0,33 | 20,1% | 0,604 (+0,135) | 0,00 | 0,78 |

## Tetto delle bound

8 usi di fila contro un manichino da 1000 HEALTH; salute di tutti alzata a 1000. Valore per uso = danno inflitto (anche periodico) + danno parato su un colpo di prova da 10 HIT + salute propria + guadagni immediati pesati. Tetto: 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33.

| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |
|---|---|---:|---:|---|---:|---|---|---|
| base.gigi.bound.ColpoDiCacciavite | base.character.Gigi | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| base.gigi.bound.Lima | base.character.Gigi | 2,67 | 2,67 | 2,00 → 2,00 | 0,00 | — | entro il tetto | — |
| base.gigi.bound.UnaStrettaEPassa | base.character.Gigi | 3,75 | 3,75 | 0,00 → 0,00 | 0,00 | V +40 | entro il tetto | — |
| base.mara.bound.CambioMarcia | base.character.Mara | 3,00 | 3,00 | 0,00 → 0,00 | 0,00 | A +48 | entro il tetto | — |
| base.mara.bound.ColpoDiStriscio | base.character.Mara | 2,67 | 2,67 | 2,00 → 2,00 | 0,00 | — | entro il tetto | — |
| base.mara.bound.PassoStretto | base.character.Mara | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| base.pino.bound.CinqueMinutiEVado | base.character.Pino | 3,75 | 3,63 | 0,00 → 0,00 | 2,00 | L +40 | entro il tetto | più di una funzione |
| base.pino.bound.Coccio | base.character.Pino | 2,67 | 2,67 | 2,00 → 2,00 | 0,00 | — | entro il tetto | — |
| base.pino.bound.SpallataAlBancone | base.character.Pino | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| base.spazienzio.bound.TestaAlMuro | bruiser.character.BigBadBruiser | 3,00 | 3,00 | 0,00 → 0,00 | 0,00 | V +64 | entro il tetto | — |
| base.tossico.bound.RaschiareIlFondo | junkie.character.ToxicJunkie | 1,05 | 1,05 | 0,00 → 0,00 | 0,00 | T +56 | entro il tetto | — |
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 3,75 | 3,75 | 0,00 → 0,00 | 0,00 | V +40 | entro il tetto | — |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| junkie.character.PatheticBlade | junkie.character.ToxicJunkie | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| junkie.character.RottenSmile | junkie.character.ToxicJunkie | 2,67 | 2,67 | 2,00 → 2,00 | 0,00 | — | entro il tetto | — |

## Limiti

- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.
- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.
- Il «+x» del catalogo è stimato 5 dai bot.
