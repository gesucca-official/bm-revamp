# Banco SB-7 — bozza.json

> SB-16b variante morto

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json` |
| SHA-256 | `c43b37a5385a9b786c00a8c6254cbfaa125a6efba6d3cb782ecd9408de842cda` |
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

480000 partite, 12996946 turni di giocatore controllati.

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
| starter-spazienzio | starter-spazienzio | 32000 | 15323 | 15533 | 1144 | 0 | 0,497 [0,491–0,502] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 15959 | 15025 | 1016 | 0 | 0,515 [0,510–0,521] | 0,509 [0,503–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 14036 | 15708 | 2256 | 0 | 0,472 [0,466–0,478] | 0,500 [0,494–0,506] |
| starter-spazienzio | starter-pino | 32000 | 12896 | 17259 | 1845 | 0 | 0,428 [0,422–0,433] | 0,499 [0,493–0,504] |
| starter-spazienzio | starter-gigi | 32000 | 12078 | 18541 | 1381 | 0 | 0,394 [0,389–0,400] | 0,507 [0,502–0,513] |
| starter-mara | starter-mara | 32000 | 15278 | 15357 | 1365 | 0 | 0,499 [0,493–0,504] | 0,501 [0,495–0,506] |
| starter-mara | starter-tossico | 32000 | 15515 | 14307 | 2178 | 0 | 0,520 [0,515–0,526] | 0,505 [0,499–0,510] |
| starter-mara | starter-pino | 32000 | 14560 | 14946 | 2494 | 0 | 0,493 [0,488–0,499] | 0,504 [0,499–0,510] |
| starter-mara | starter-gigi | 32000 | 13366 | 17203 | 1431 | 0 | 0,437 [0,432–0,443] | 0,505 [0,499–0,510] |
| starter-tossico | starter-tossico | 32000 | 13059 | 12752 | 6189 | 0 | 0,506 [0,500–0,512] | 0,492 [0,486–0,498] |
| starter-tossico | starter-pino | 32000 | 16783 | 11476 | 3741 | 0 | 0,594 [0,588–0,600] | 0,500 [0,494–0,505] |
| starter-tossico | starter-gigi | 32000 | 14330 | 14227 | 3443 | 0 | 0,502 [0,496–0,508] | 0,504 [0,499–0,510] |
| starter-pino | starter-pino | 32000 | 13611 | 13292 | 5097 | 0 | 0,506 [0,500–0,512] | 0,504 [0,498–0,510] |
| starter-pino | starter-gigi | 32000 | 12154 | 14711 | 5135 | 0 | 0,452 [0,446–0,458] | 0,505 [0,499–0,511] |
| starter-gigi | starter-gigi | 32000 | 13015 | 12786 | 6199 | 0 | 0,504 [0,498–0,511] | 0,502 [0,496–0,508] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,491 [0,469–0,513] | 0,539 [0,517–0,561] | 0,357 [0,337–0,379] | 0,642 [0,621–0,663] |
| prudente | 0,454 [0,431–0,476] | 0,497 [0,473–0,520] | 0,211 [0,193–0,229] | 0,560 [0,537–0,582] |
| risorse | 0,645 [0,624–0,666] | 0,782 [0,764–0,800] | 0,498 [0,476–0,520] | 0,818 [0,801–0,835] |
| com | 0,341 [0,321–0,363] | 0,437 [0,415–0,459] | 0,185 [0,169–0,203] | 0,485 [0,463–0,507] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,335 [0,314–0,356] | 0,451 [0,429–0,473] | 0,384 [0,362–0,405] | 0,807 [0,789–0,824] |
| prudente | 0,229 [0,210–0,248] | 0,462 [0,438–0,485] | 0,307 [0,286–0,328] | 0,822 [0,804–0,839] |
| risorse | 0,594 [0,572–0,615] | 0,798 [0,780–0,815] | 0,687 [0,666–0,707] | 0,972 [0,964–0,979] |
| com | 0,165 [0,149–0,182] | 0,330 [0,309–0,351] | 0,205 [0,188–0,224] | 0,690 [0,669–0,711] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,412 [0,390–0,435] | 0,410 [0,388–0,433] | 0,367 [0,345–0,388] | 0,699 [0,677–0,719] |
| prudente | 0,191 [0,174–0,210] | 0,195 [0,177–0,214] | 0,092 [0,080–0,106] | 0,576 [0,554–0,599] |
| risorse | 0,741 [0,721–0,761] | 0,812 [0,794–0,829] | 0,772 [0,752–0,790] | 0,908 [0,895–0,921] |
| com | 0,253 [0,234–0,273] | 0,288 [0,268–0,308] | 0,191 [0,174–0,209] | 0,584 [0,561–0,606] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,283 [0,263–0,304] | 0,236 [0,217–0,255] | 0,284 [0,264–0,305] | 0,840 [0,822–0,856] |
| prudente | 0,079 [0,068–0,092] | 0,042 [0,034–0,052] | 0,063 [0,053–0,075] | 0,837 [0,819–0,854] |
| risorse | 0,610 [0,588–0,631] | 0,692 [0,671–0,713] | 0,719 [0,699–0,739] | 0,989 [0,984–0,993] |
| com | 0,158 [0,142–0,175] | 0,155 [0,139–0,171] | 0,164 [0,149–0,182] | 0,686 [0,665–0,707] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,192 [0,175–0,210] | 0,353 [0,332–0,374] | 0,310 [0,290–0,330] | 0,701 [0,680–0,721] |
| prudente | 0,047 [0,039–0,058] | 0,170 [0,154–0,189] | 0,113 [0,099–0,128] | 0,629 [0,606–0,651] |
| risorse | 0,413 [0,391–0,435] | 0,755 [0,735–0,773] | 0,673 [0,652–0,694] | 0,931 [0,919–0,941] |
| com | 0,076 [0,065–0,089] | 0,185 [0,169–0,203] | 0,149 [0,134–0,165] | 0,594 [0,572–0,616] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,466–0,511] | 0,806 [0,787–0,823] | 0,627 [0,605–0,648] | 0,983 [0,976–0,988] |
| prudente | 0,201 [0,184–0,220] | 0,494 [0,470–0,518] | 0,290 [0,270–0,311] | 0,887 [0,872–0,901] |
| risorse | 0,372 [0,350–0,393] | 0,700 [0,679–0,720] | 0,494 [0,471–0,516] | 0,964 [0,955–0,972] |
| com | 0,019 [0,014–0,026] | 0,117 [0,103–0,133] | 0,034 [0,027–0,043] | 0,498 [0,475–0,521] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,760 [0,740–0,779] | 0,793 [0,774–0,811] | 0,745 [0,725–0,764] | 0,915 [0,901–0,926] |
| prudente | 0,353 [0,332–0,375] | 0,365 [0,343–0,388] | 0,253 [0,234–0,273] | 0,725 [0,704–0,745] |
| risorse | 0,657 [0,635–0,678] | 0,700 [0,679–0,721] | 0,626 [0,604–0,648] | 0,871 [0,856–0,886] |
| com | 0,096 [0,083–0,110] | 0,065 [0,055–0,077] | 0,031 [0,024–0,039] | 0,397 [0,375–0,420] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,705 [0,684–0,725] | 0,824 [0,805–0,840] | 0,796 [0,777–0,814] | 0,979 [0,971–0,984] |
| prudente | 0,191 [0,174–0,210] | 0,209 [0,190–0,229] | 0,193 [0,175–0,212] | 0,804 [0,785–0,822] |
| risorse | 0,546 [0,523–0,568] | 0,650 [0,627–0,672] | 0,595 [0,572–0,618] | 0,931 [0,919–0,942] |
| com | 0,043 [0,035–0,053] | 0,033 [0,026–0,042] | 0,027 [0,020–0,035] | 0,361 [0,339–0,383] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,303 [0,283–0,324] | 0,765 [0,746–0,783] | 0,657 [0,635–0,677] | 0,974 [0,966–0,980] |
| prudente | 0,087 [0,075–0,101] | 0,337 [0,315–0,360] | 0,229 [0,210–0,249] | 0,853 [0,836–0,868] |
| risorse | 0,217 [0,199–0,236] | 0,637 [0,615–0,658] | 0,490 [0,468–0,512] | 0,951 [0,940–0,959] |
| com | 0,007 [0,004–0,011] | 0,039 [0,031–0,049] | 0,023 [0,018–0,031] | 0,396 [0,374–0,419] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,524 [0,499–0,549] | 0,388 [0,364–0,414] | 0,110 [0,095–0,126] | 0,653 [0,631–0,675] |
| prudente | 0,636 [0,611–0,660] | 0,497 [0,469–0,526] | 0,111 [0,095–0,128] | 0,813 [0,794–0,830] |
| risorse | 0,894 [0,877–0,908] | 0,898 [0,882–0,913] | 0,496 [0,468–0,524] | 0,807 [0,788–0,824] |
| com | 0,355 [0,333–0,378] | 0,195 [0,177–0,213] | 0,203 [0,186–0,222] | 0,507 [0,484–0,529] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,591 [0,567–0,614] | 0,695 [0,672–0,717] | 0,686 [0,663–0,707] | 0,962 [0,953–0,970] |
| prudente | 0,381 [0,358–0,405] | 0,412 [0,389–0,436] | 0,449 [0,425–0,472] | 0,972 [0,964–0,979] |
| risorse | 0,615 [0,592–0,638] | 0,750 [0,728–0,770] | 0,747 [0,726–0,767] | 0,990 [0,985–0,994] |
| com | 0,176 [0,159–0,194] | 0,219 [0,200–0,238] | 0,219 [0,201–0,239] | 0,570 [0,547–0,593] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,258 [0,237–0,279] | 0,675 [0,653–0,697] | 0,578 [0,554–0,601] | 0,908 [0,894–0,921] |
| prudente | 0,142 [0,127–0,159] | 0,485 [0,461–0,509] | 0,361 [0,339–0,385] | 0,931 [0,918–0,941] |
| risorse | 0,260 [0,240–0,281] | 0,718 [0,696–0,738] | 0,612 [0,588–0,635] | 0,972 [0,964–0,979] |
| com | 0,091 [0,079–0,105] | 0,232 [0,214–0,252] | 0,188 [0,170–0,206] | 0,584 [0,561–0,606] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,503 [0,478–0,529] | 0,463 [0,437–0,490] | 0,622 [0,597–0,647] | 0,996 [0,993–0,998] |
| prudente | 0,573 [0,546–0,599] | 0,515 [0,489–0,540] | 0,677 [0,653–0,700] | 0,998 [0,995–0,999] |
| risorse | 0,398 [0,373–0,424] | 0,337 [0,314–0,362] | 0,509 [0,484–0,534] | 0,996 [0,993–0,998] |
| com | 0,001 [0,000–0,003] | 0,001 [0,000–0,004] | 0,002 [0,001–0,005] | 0,517 [0,493–0,540] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,140 [0,124–0,158] | 0,755 [0,731–0,777] | 0,538 [0,512–0,564] | 0,970 [0,962–0,977] |
| prudente | 0,175 [0,157–0,194] | 0,748 [0,724–0,770] | 0,570 [0,544–0,596] | 0,991 [0,985–0,994] |
| risorse | 0,098 [0,085–0,113] | 0,578 [0,551–0,604] | 0,386 [0,360–0,411] | 0,981 [0,974–0,987] |
| com | 0,000 [0,000–0,002] | 0,004 [0,002–0,007] | 0,003 [0,001–0,007] | 0,461 [0,437–0,484] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,497 [0,469–0,526] | 0,948 [0,936–0,957] | 0,869 [0,852–0,884] | 0,991 [0,986–0,995] |
| prudente | 0,055 [0,045–0,067] | 0,534 [0,504–0,564] | 0,234 [0,211–0,259] | 0,962 [0,952–0,969] |
| risorse | 0,131 [0,116–0,148] | 0,781 [0,757–0,803] | 0,509 [0,479–0,540] | 0,977 [0,970–0,983] |
| com | 0,009 [0,005–0,014] | 0,037 [0,029–0,047] | 0,023 [0,017–0,030] | 0,506 [0,482–0,530] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,036 [0,034–0,038] | 0 |
| starter-spazienzio | starter-mara | 11,26 [11,23–11,30] | 11 | 7–16 | 4–22 | 0,032 [0,030–0,034] | 0 |
| starter-spazienzio | starter-tossico | 12,77 [12,73–12,80] | 13 | 8–17 | 4–23 | 0,071 [0,068–0,073] | 0 |
| starter-spazienzio | starter-pino | 14,27 [14,24–14,30] | 14 | 10–18 | 6–24 | 0,058 [0,055–0,060] | 0 |
| starter-spazienzio | starter-gigi | 12,61 [12,58–12,64] | 12 | 9–17 | 4–23 | 0,043 [0,041–0,045] | 0 |
| starter-mara | starter-mara | 11,28 [11,24–11,31] | 11 | 7–16 | 5–22 | 0,043 [0,040–0,045] | 0 |
| starter-mara | starter-tossico | 12,19 [12,15–12,22] | 12 | 8–17 | 4–24 | 0,068 [0,065–0,071] | 0 |
| starter-mara | starter-pino | 14,24 [14,21–14,27] | 14 | 11–17 | 6–23 | 0,078 [0,075–0,081] | 0 |
| starter-mara | starter-gigi | 12,32 [12,29–12,35] | 12 | 9–16 | 7–22 | 0,045 [0,043–0,047] | 0 |
| starter-tossico | starter-tossico | 16,60 [16,56–16,64] | 17 | 11–20 | 3–28 | 0,193 [0,189–0,198] | 0 |
| starter-tossico | starter-pino | 15,19 [15,16–15,22] | 16 | 12–18 | 5–24 | 0,117 [0,113–0,120] | 0 |
| starter-tossico | starter-gigi | 13,97 [13,94–14,00] | 14 | 10–17 | 5–23 | 0,108 [0,104–0,111] | 0 |
| starter-pino | starter-pino | 16,10 [16,08–16,12] | 16 | 15–18 | 7–24 | 0,159 [0,155–0,163] | 0 |
| starter-pino | starter-gigi | 15,10 [15,09–15,12] | 15 | 13–17 | 9–24 | 0,160 [0,156–0,165] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,194 [0,189–0,198] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,468 [0,466–0,471] | 15,9% | 10,1% | 17,17 | 17 |
| starter-mara | 192000 | 0,489 [0,487–0,491] | 21,8% | 15,0% | 15,90 | 16 |
| starter-tossico | 192000 | 0,517 [0,515–0,520] | 49,4% | 41,5% | 16,06 | 16 |
| starter-pino | 192000 | 0,491 [0,488–0,493] | 77,9% | 70,8% | 14,70 | 14 |
| starter-gigi | 192000 | 0,538 [0,536–0,540] | 68,5% | 58,7% | 13,82 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,9 | 15,0 | 25 |
| starter-spazienzio | T | 1,9 | 3,4 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 25,3 | 17,0 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,9 | 4,2 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 1,3 | 9,1 | 15 |
| starter-tossico | V | 8,2 | 6,5 | 0 |
| starter-tossico | T | 10,2 | 18,0 | 10 |
| starter-tossico | L | 1,8 | 4,7 | 0 |
| starter-tossico | A | 11,5 | 12,2 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 0,9 | 2,3 | 0 |
| starter-pino | L | 0,1 | 4,1 | 5 |
| starter-pino | A | -19,1 | -42,9 | 0 |
| starter-gigi | V | 3,0 | 12,0 | 15 |
| starter-gigi | T | 0,8 | 2,2 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,0 | 25,0 | 10 |

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
| base.com.DentiStretti | 0,30 | 29,8% | 0,583 (+0,115) | 0,00 | 2,14 |
| base.com.MattoneDelCantiere | 0,44 | 43,9% | 0,543 (+0,074) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,1% | 0,326 (−0,142) | 0,10 | 2,57 |
| bruiser.ExtremelyViolentBlow | 0,84 | 64,0% | 0,454 (−0,014) | 1,61 | 1,41 |
| bruiser.Glare | 0,73 | 54,6% | 0,595 (+0,127) | 0,00 | 2,46 |
| bruiser.HealingBlow | 0,32 | 32,2% | 0,575 (+0,106) | 3,14 | 0,53 |
| bruiser.MadeOfStone | 1,03 | 70,6% | 0,509 (+0,041) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,08 | 78,5% | 0,502 (+0,033) | 1,57 | 1,02 |
| bruiser.SuperImpact | 0,59 | 54,6% | 0,606 (+0,138) | 4,94 | 0,60 |
| bruiser.YouStop | 0,45 | 33,2% | 0,313 (−0,155) | 1,41 | 2,53 |
| bruiser.character.LittleRage | 0,76 | 31,3% | 0,364 (−0,104) | 0,01 | 11,49 |
| bruiser.character.LittleSmack | 4,12 | 95,6% | 0,457 (−0,011) | 0,01 | 8,13 |
| com.basic.BruiserGrab | 0,87 | 67,5% | 0,369 (−0,099) | 5,66 | 5,73 |
| com.last.Struggle | 0,13 | 8,4% | 0,534 (+0,066) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,43 | 88,6% | 0,521 (+0,032) | 0,00 | 2,15 |
| base.com.SputoDaPosacenere | 1,24 | 83,5% | 0,535 (+0,046) | 0,88 | 1,23 |
| base.com.TartarugaSulMarciapiede | 0,25 | 25,0% | 0,245 (−0,244) | 0,88 | 2,84 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,0% | 0,534 (+0,045) | 0,86 | 1,21 |
| base.mara.PresoAlVolo | 1,58 | 79,3% | 0,437 (−0,052) | 2,59 | 7,92 |
| base.mara.Sgommata | 1,09 | 83,0% | 0,565 (+0,076) | 2,02 | 0,84 |
| base.mara.Slalom | 0,53 | 52,7% | 0,522 (+0,033) | 1,00 | 1,07 |
| base.mara.SorpassoInCurva | 1,34 | 84,2% | 0,511 (+0,022) | 0,00 | 3,47 |
| base.mara.TraDueParaurti | 0,50 | 35,7% | 0,259 (−0,230) | 1,34 | 4,23 |
| base.mara.bound.CambioMarcia | 0,76 | 33,9% | 0,338 (−0,152) | 0,04 | 11,29 |
| base.mara.bound.PassoStretto | 1,88 | 83,6% | 0,456 (−0,033) | 0,04 | 10,17 |
| com.Steal | 0,09 | 8,7% | 0,089 (−0,401) | 1,98 | 2,26 |
| com.last.Struggle | 0,17 | 11,7% | 0,582 (+0,092) | 0,00 | 0,89 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 63,7% | 0,519 (+0,001) | 0,00 | 1,99 |
| base.com.RincorsaDalMarciapiede | 1,55 | 91,1% | 0,547 (+0,029) | 0,22 | 1,05 |
| base.tossico.bound.RaschiareIlFondo | 0,83 | 32,0% | 0,377 (−0,141) | 0,11 | 13,61 |
| com.Grab | 0,37 | 32,4% | 0,423 (−0,095) | 1,42 | 3,57 |
| com.Steal | 0,09 | 9,3% | 0,279 (−0,239) | 0,84 | 2,31 |
| com.basic.ToxicGrab | 2,04 | 94,3% | 0,530 (+0,012) | 3,67 | 8,85 |
| junkie.AmphetamineReflexes | 0,49 | 39,2% | 0,413 (−0,104) | 3,93 | 2,86 |
| junkie.Cough | 1,14 | 76,5% | 0,598 (+0,081) | 2,70 | 1,36 |
| junkie.LethalHeroinDose | 0,83 | 37,1% | 0,515 (−0,002) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,36 | 85,5% | 0,538 (+0,020) | 2,60 | 0,73 |
| junkie.PervertedMetabolism | 1,13 | 72,4% | 0,475 (−0,042) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 9,8% | 0,566 (+0,048) | 1,48 | 1,70 |
| junkie.character.PatheticBlade | 3,98 | 97,6% | 0,523 (+0,006) | 0,11 | 10,46 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,32 | 78,9% | 0,467 (−0,024) | 0,00 | 4,21 |
| base.com.Spintone | 1,71 | 94,0% | 0,516 (+0,025) | 0,00 | 1,47 |
| base.pino.GoingBerserk | 1,74 | 94,4% | 0,519 (+0,028) | 0,00 | 1,10 |
| base.pino.IlBanconeRegge | 1,26 | 81,1% | 0,494 (+0,003) | 0,00 | 3,22 |
| base.pino.OffroIo | 0,15 | 12,7% | 0,133 (−0,358) | 3,64 | 1,29 |
| base.pino.QuestoLoFiniscoIo | 0,94 | 51,7% | 0,389 (−0,102) | 2,20 | 12,02 |
| base.pino.RuttoADistanzaSociale | 0,20 | 20,0% | 0,404 (−0,087) | 4,62 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,93 | 67,7% | 0,547 (+0,057) | 5,96 | 0,61 |
| base.pino.UltimoGiro | 1,43 | 65,2% | 0,607 (+0,116) | 0,00 | 0,45 |
| base.pino.bound.CinqueMinutiEVado | 1,02 | 37,5% | 0,302 (−0,189) | 0,14 | 14,01 |
| base.pino.bound.SpallataAlBancone | 4,02 | 98,9% | 0,494 (+0,003) | 0,14 | 11,01 |
| com.Grab | 0,44 | 37,5% | 0,363 (−0,128) | 0,86 | 3,99 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,575 (+0,038) | 5,74 | 0,84 |
| base.com.Spintone | 0,85 | 84,6% | 0,602 (+0,064) | 0,00 | 0,98 |
| base.gigi.ChiaveDaTredici | 1,62 | 92,4% | 0,574 (+0,036) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,7% | 0,599 (+0,062) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 75,1% | 0,619 (+0,081) | 1,04 | 1,00 |
| base.gigi.QuestoTornaUtile | 1,99 | 76,6% | 0,449 (−0,089) | 1,14 | 10,49 |
| base.gigi.SottoIlCofano | 0,33 | 32,5% | 0,347 (−0,191) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,61 | 97,3% | 0,535 (−0,002) | 0,15 | 9,86 |
| base.gigi.bound.UnaStrettaEPassa | 1,07 | 41,8% | 0,476 (−0,062) | 0,15 | 12,40 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,138 (−0,400) | 2,88 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,587 (+0,049) | 2,61 | 0,61 |
| com.Steal | 0,20 | 16,1% | 0,148 (−0,390) | 1,35 | 3,90 |
| com.last.Struggle | 0,89 | 51,8% | 0,681 (+0,143) | 0,00 | 0,65 |

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
| base.pino.bound.CinqueMinutiEVado | base.character.Pino | 3,50 | 3,50 | 0,00 → 0,00 | 0,00 | L +80 | entro il tetto | — |
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
