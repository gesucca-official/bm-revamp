# Banco SB-7 — bozza.json

> SB-16b variante pavimento-inizio

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

480000 partite, 12916774 turni di giocatore controllati.

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
| starter-spazienzio | starter-spazienzio | 32000 | 15838 | 16052 | 110 | 0 | 0,497 [0,491–0,502] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 15642 | 16262 | 96 | 0 | 0,490 [0,485–0,496] | 0,510 [0,504–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 14701 | 17140 | 159 | 0 | 0,462 [0,456–0,467] | 0,501 [0,495–0,506] |
| starter-spazienzio | starter-pino | 32000 | 13438 | 18430 | 132 | 0 | 0,422 [0,416–0,427] | 0,499 [0,494–0,505] |
| starter-spazienzio | starter-gigi | 32000 | 12828 | 19022 | 150 | 0 | 0,403 [0,397–0,408] | 0,507 [0,502–0,513] |
| starter-mara | starter-mara | 32000 | 15825 | 16046 | 129 | 0 | 0,497 [0,491–0,502] | 0,499 [0,493–0,504] |
| starter-mara | starter-tossico | 32000 | 17534 | 14294 | 172 | 0 | 0,551 [0,545–0,556] | 0,502 [0,497–0,508] |
| starter-mara | starter-pino | 32000 | 17579 | 14176 | 245 | 0 | 0,554 [0,548–0,559] | 0,505 [0,499–0,510] |
| starter-mara | starter-gigi | 32000 | 15724 | 16150 | 126 | 0 | 0,493 [0,488–0,499] | 0,505 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 15872 | 15557 | 571 | 0 | 0,505 [0,499–0,511] | 0,493 [0,488–0,499] |
| starter-tossico | starter-pino | 32000 | 18192 | 13552 | 256 | 0 | 0,573 [0,568–0,579] | 0,501 [0,495–0,506] |
| starter-tossico | starter-gigi | 32000 | 16565 | 15130 | 305 | 0 | 0,523 [0,517–0,528] | 0,504 [0,499–0,510] |
| starter-pino | starter-pino | 32000 | 15809 | 15363 | 828 | 0 | 0,507 [0,502–0,513] | 0,502 [0,496–0,507] |
| starter-pino | starter-gigi | 32000 | 15725 | 15886 | 389 | 0 | 0,497 [0,492–0,503] | 0,506 [0,500–0,511] |
| starter-gigi | starter-gigi | 32000 | 15825 | 15570 | 605 | 0 | 0,504 [0,499–0,510] | 0,501 [0,496–0,507] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,495 [0,473–0,517] | 0,534 [0,512–0,556] | 0,359 [0,339–0,381] | 0,636 [0,615–0,657] |
| prudente | 0,463 [0,441–0,484] | 0,495 [0,473–0,517] | 0,216 [0,198–0,234] | 0,561 [0,539–0,583] |
| risorse | 0,644 [0,623–0,665] | 0,779 [0,760–0,797] | 0,496 [0,474–0,518] | 0,815 [0,797–0,831] |
| com | 0,344 [0,323–0,365] | 0,436 [0,415–0,458] | 0,187 [0,170–0,204] | 0,487 [0,465–0,509] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,331 [0,311–0,352] | 0,394 [0,373–0,416] | 0,377 [0,356–0,399] | 0,799 [0,781–0,816] |
| prudente | 0,224 [0,206–0,243] | 0,336 [0,316–0,357] | 0,292 [0,272–0,312] | 0,806 [0,788–0,823] |
| risorse | 0,585 [0,563–0,606] | 0,754 [0,735–0,773] | 0,677 [0,656–0,697] | 0,971 [0,962–0,977] |
| com | 0,150 [0,135–0,166] | 0,269 [0,250–0,289] | 0,197 [0,180–0,215] | 0,678 [0,658–0,699] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,402 [0,380–0,423] | 0,399 [0,378–0,421] | 0,359 [0,338–0,380] | 0,685 [0,664–0,705] |
| prudente | 0,205 [0,188–0,223] | 0,258 [0,240–0,278] | 0,119 [0,106–0,134] | 0,567 [0,545–0,588] |
| risorse | 0,698 [0,677–0,717] | 0,777 [0,759–0,795] | 0,738 [0,718–0,757] | 0,888 [0,874–0,901] |
| com | 0,249 [0,231–0,268] | 0,287 [0,268–0,308] | 0,188 [0,171–0,206] | 0,564 [0,542–0,585] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,291 [0,272–0,312] | 0,244 [0,226–0,263] | 0,282 [0,262–0,302] | 0,809 [0,791–0,826] |
| prudente | 0,090 [0,079–0,104] | 0,047 [0,039–0,057] | 0,074 [0,063–0,086] | 0,786 [0,767–0,803] |
| risorse | 0,607 [0,585–0,628] | 0,668 [0,647–0,689] | 0,700 [0,679–0,720] | 0,986 [0,980–0,990] |
| com | 0,168 [0,152–0,185] | 0,159 [0,144–0,176] | 0,172 [0,156–0,190] | 0,667 [0,646–0,687] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,193 [0,177–0,211] | 0,355 [0,335–0,377] | 0,313 [0,293–0,333] | 0,700 [0,679–0,719] |
| prudente | 0,070 [0,060–0,083] | 0,227 [0,209–0,246] | 0,157 [0,142–0,174] | 0,627 [0,605–0,648] |
| risorse | 0,412 [0,391–0,434] | 0,750 [0,730–0,768] | 0,670 [0,649–0,690] | 0,929 [0,916–0,939] |
| com | 0,083 [0,071–0,096] | 0,202 [0,185–0,221] | 0,165 [0,150–0,182] | 0,590 [0,568–0,611] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,491 [0,469–0,513] | 0,717 [0,697–0,736] | 0,608 [0,587–0,630] | 0,983 [0,976–0,988] |
| prudente | 0,267 [0,248–0,287] | 0,490 [0,468–0,512] | 0,390 [0,369–0,412] | 0,924 [0,911–0,935] |
| risorse | 0,387 [0,366–0,408] | 0,606 [0,585–0,628] | 0,496 [0,475–0,518] | 0,968 [0,959–0,975] |
| com | 0,019 [0,013–0,025] | 0,072 [0,061–0,084] | 0,035 [0,028–0,044] | 0,490 [0,468–0,512] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,757 [0,738–0,776] | 0,796 [0,778–0,813] | 0,743 [0,724–0,762] | 0,905 [0,891–0,917] |
| prudente | 0,442 [0,421–0,464] | 0,531 [0,509–0,553] | 0,389 [0,368–0,411] | 0,770 [0,751–0,788] |
| risorse | 0,656 [0,635–0,677] | 0,711 [0,691–0,730] | 0,635 [0,613–0,655] | 0,862 [0,846–0,876] |
| com | 0,104 [0,092–0,119] | 0,079 [0,068–0,092] | 0,036 [0,029–0,045] | 0,396 [0,375–0,418] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,710 [0,690–0,730] | 0,816 [0,799–0,833] | 0,795 [0,777–0,812] | 0,987 [0,982–0,992] |
| prudente | 0,386 [0,365–0,408] | 0,459 [0,437–0,481] | 0,431 [0,410–0,453] | 0,904 [0,890–0,916] |
| risorse | 0,573 [0,551–0,595] | 0,680 [0,659–0,700] | 0,650 [0,629–0,671] | 0,954 [0,944–0,962] |
| com | 0,051 [0,042–0,062] | 0,040 [0,032–0,050] | 0,035 [0,028–0,044] | 0,387 [0,366–0,409] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,331 [0,310–0,352] | 0,794 [0,776–0,812] | 0,687 [0,666–0,707] | 0,975 [0,968–0,981] |
| prudente | 0,200 [0,183–0,219] | 0,602 [0,581–0,624] | 0,468 [0,446–0,490] | 0,896 [0,882–0,909] |
| risorse | 0,262 [0,243–0,281] | 0,675 [0,654–0,695] | 0,534 [0,512–0,556] | 0,953 [0,943–0,961] |
| com | 0,010 [0,006–0,015] | 0,053 [0,044–0,063] | 0,035 [0,027–0,043] | 0,417 [0,395–0,439] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,525 [0,503–0,547] | 0,441 [0,419–0,463] | 0,156 [0,141–0,173] | 0,647 [0,626–0,668] |
| prudente | 0,588 [0,566–0,610] | 0,502 [0,479–0,524] | 0,159 [0,143–0,176] | 0,792 [0,774–0,810] |
| risorse | 0,840 [0,823–0,856] | 0,854 [0,837–0,869] | 0,496 [0,474–0,519] | 0,796 [0,778–0,813] |
| com | 0,358 [0,337–0,379] | 0,211 [0,194–0,229] | 0,212 [0,195–0,231] | 0,506 [0,484–0,528] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,579 [0,557–0,601] | 0,653 [0,632–0,674] | 0,655 [0,634–0,676] | 0,952 [0,942–0,960] |
| prudente | 0,365 [0,344–0,386] | 0,394 [0,372–0,416] | 0,423 [0,401–0,445] | 0,949 [0,939–0,958] |
| risorse | 0,596 [0,575–0,618] | 0,701 [0,680–0,720] | 0,694 [0,674–0,714] | 0,987 [0,982–0,992] |
| com | 0,192 [0,176–0,210] | 0,232 [0,214–0,251] | 0,229 [0,211–0,248] | 0,565 [0,543–0,586] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,316 [0,295–0,336] | 0,686 [0,666–0,706] | 0,598 [0,577–0,620] | 0,895 [0,880–0,907] |
| prudente | 0,196 [0,179–0,214] | 0,519 [0,497–0,541] | 0,419 [0,397–0,440] | 0,905 [0,892–0,918] |
| risorse | 0,318 [0,298–0,339] | 0,741 [0,721–0,760] | 0,639 [0,618–0,660] | 0,969 [0,960–0,976] |
| com | 0,107 [0,094–0,121] | 0,258 [0,239–0,277] | 0,210 [0,193–0,229] | 0,583 [0,561–0,604] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,504 [0,481–0,526] | 0,565 [0,542–0,587] | 0,658 [0,636–0,679] | 0,994 [0,990–0,997] |
| prudente | 0,475 [0,453–0,497] | 0,513 [0,491–0,536] | 0,637 [0,615–0,658] | 0,994 [0,990–0,997] |
| risorse | 0,370 [0,349–0,392] | 0,374 [0,352–0,396] | 0,508 [0,485–0,530] | 0,992 [0,988–0,995] |
| com | 0,002 [0,001–0,004] | 0,004 [0,002–0,007] | 0,005 [0,003–0,009] | 0,522 [0,500–0,544] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,229 [0,211–0,249] | 0,789 [0,770–0,806] | 0,602 [0,581–0,624] | 0,961 [0,952–0,969] |
| prudente | 0,231 [0,213–0,250] | 0,777 [0,758–0,795] | 0,640 [0,619–0,661] | 0,982 [0,975–0,987] |
| risorse | 0,156 [0,141–0,173] | 0,635 [0,614–0,656] | 0,485 [0,463–0,507] | 0,973 [0,965–0,980] |
| com | 0,001 [0,000–0,004] | 0,010 [0,006–0,015] | 0,008 [0,005–0,012] | 0,486 [0,464–0,508] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,495 [0,472–0,518] | 0,933 [0,921–0,943] | 0,850 [0,834–0,866] | 0,989 [0,983–0,993] |
| prudente | 0,067 [0,057–0,079] | 0,514 [0,492–0,537] | 0,302 [0,282–0,323] | 0,945 [0,934–0,954] |
| risorse | 0,153 [0,138–0,170] | 0,727 [0,706–0,746] | 0,500 [0,477–0,523] | 0,969 [0,960–0,976] |
| com | 0,011 [0,007–0,016] | 0,066 [0,056–0,078] | 0,037 [0,030–0,046] | 0,507 [0,485–0,529] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,003 [0,003–0,004] | 0 |
| starter-spazienzio | starter-mara | 11,14 [11,11–11,18] | 11 | 7–16 | 4–22 | 0,003 [0,002–0,004] | 0 |
| starter-spazienzio | starter-tossico | 12,81 [12,77–12,84] | 13 | 8–17 | 4–23 | 0,005 [0,004–0,006] | 0 |
| starter-spazienzio | starter-pino | 14,31 [14,28–14,34] | 14 | 11–18 | 6–24 | 0,004 [0,003–0,005] | 0 |
| starter-spazienzio | starter-gigi | 12,61 [12,58–12,64] | 12 | 9–17 | 4–23 | 0,005 [0,004–0,005] | 0 |
| starter-mara | starter-mara | 10,65 [10,61–10,68] | 10 | 7–15 | 5–22 | 0,004 [0,003–0,005] | 0 |
| starter-mara | starter-tossico | 12,06 [12,03–12,10] | 12 | 8–16 | 4–24 | 0,005 [0,005–0,006] | 0 |
| starter-mara | starter-pino | 13,93 [13,90–13,95] | 14 | 11–17 | 6–23 | 0,008 [0,007–0,009] | 0 |
| starter-mara | starter-gigi | 12,14 [12,11–12,17] | 12 | 9–15 | 7–22 | 0,004 [0,003–0,005] | 0 |
| starter-tossico | starter-tossico | 16,61 [16,57–16,65] | 17 | 11–20 | 3–28 | 0,018 [0,016–0,019] | 0 |
| starter-tossico | starter-pino | 15,20 [15,17–15,23] | 16 | 12–18 | 5–24 | 0,008 [0,007–0,009] | 0 |
| starter-tossico | starter-gigi | 13,99 [13,96–14,02] | 14 | 10–17 | 5–23 | 0,010 [0,009–0,011] | 0 |
| starter-pino | starter-pino | 16,09 [16,08–16,11] | 16 | 15–18 | 7–24 | 0,026 [0,024–0,028] | 0 |
| starter-pino | starter-gigi | 15,11 [15,09–15,13] | 15 | 13–17 | 9–24 | 0,012 [0,011–0,013] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,019 [0,017–0,020] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,463 [0,461–0,465] | 15,7% | 10,0% | 17,17 | 17 |
| starter-mara | 192000 | 0,518 [0,516–0,520] | 17,8% | 11,6% | 15,75 | 16 |
| starter-tossico | 192000 | 0,514 [0,512–0,516] | 49,3% | 41,4% | 16,06 | 16 |
| starter-pino | 192000 | 0,492 [0,489–0,494] | 77,2% | 70,1% | 14,69 | 14 |
| starter-gigi | 192000 | 0,514 [0,512–0,516] | 68,0% | 58,1% | 13,81 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 5,0 | 14,7 | 25 |
| starter-spazienzio | T | 2,0 | 3,5 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 25,4 | 17,4 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 2,1 | 4,1 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 3,2 | 12,0 | 15 |
| starter-tossico | V | 8,3 | 6,7 | 0 |
| starter-tossico | T | 10,6 | 17,4 | 10 |
| starter-tossico | L | 2,0 | 4,4 | 0 |
| starter-tossico | A | 11,8 | 12,4 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 1,1 | 2,3 | 0 |
| starter-pino | L | 0,2 | 3,7 | 5 |
| starter-pino | A | 0,2 | 0,1 | 0 |
| starter-gigi | V | 3,1 | 10,9 | 15 |
| starter-gigi | T | 0,9 | 2,0 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,4 | 25,9 | 10 |

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
| base.com.DentiStretti | 0,30 | 29,9% | 0,575 (+0,112) | 0,00 | 2,14 |
| base.com.MattoneDelCantiere | 0,44 | 43,8% | 0,533 (+0,070) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,1% | 0,330 (−0,133) | 0,09 | 2,57 |
| bruiser.ExtremelyViolentBlow | 0,84 | 64,1% | 0,449 (−0,014) | 1,61 | 1,41 |
| bruiser.Glare | 0,73 | 54,6% | 0,584 (+0,121) | 0,00 | 2,45 |
| bruiser.HealingBlow | 0,32 | 32,2% | 0,563 (+0,101) | 3,13 | 0,53 |
| bruiser.MadeOfStone | 1,03 | 70,7% | 0,502 (+0,039) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,08 | 78,4% | 0,494 (+0,032) | 1,57 | 1,02 |
| bruiser.SuperImpact | 0,59 | 54,6% | 0,595 (+0,132) | 4,93 | 0,60 |
| bruiser.YouStop | 0,45 | 33,2% | 0,317 (−0,145) | 1,41 | 2,54 |
| bruiser.character.LittleRage | 0,76 | 31,3% | 0,362 (−0,101) | 0,01 | 11,48 |
| bruiser.character.LittleSmack | 4,12 | 95,6% | 0,452 (−0,010) | 0,01 | 8,12 |
| com.basic.BruiserGrab | 0,87 | 67,5% | 0,369 (−0,094) | 5,66 | 5,73 |
| com.last.Struggle | 0,13 | 8,3% | 0,521 (+0,058) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,39 | 87,8% | 0,551 (+0,033) | 0,00 | 2,16 |
| base.com.SputoDaPosacenere | 1,23 | 83,8% | 0,563 (+0,045) | 0,73 | 1,28 |
| base.com.TartarugaSulMarciapiede | 0,25 | 24,5% | 0,315 (−0,203) | 0,79 | 2,93 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,1% | 0,562 (+0,044) | 0,72 | 1,26 |
| base.mara.PresoAlVolo | 1,50 | 79,0% | 0,479 (−0,039) | 2,43 | 7,83 |
| base.mara.Sgommata | 1,21 | 85,6% | 0,590 (+0,072) | 1,52 | 0,85 |
| base.mara.Slalom | 0,53 | 53,3% | 0,556 (+0,038) | 0,87 | 1,14 |
| base.mara.SorpassoInCurva | 1,30 | 83,4% | 0,540 (+0,023) | 0,00 | 3,50 |
| base.mara.TraDueParaurti | 0,49 | 35,4% | 0,330 (−0,188) | 1,18 | 4,32 |
| base.mara.bound.CambioMarcia | 0,73 | 32,7% | 0,324 (−0,193) | 0,04 | 10,99 |
| base.mara.bound.PassoStretto | 1,68 | 81,3% | 0,485 (−0,033) | 0,04 | 10,04 |
| com.Steal | 0,09 | 8,7% | 0,104 (−0,414) | 1,94 | 2,35 |
| com.last.Struggle | 0,12 | 8,6% | 0,561 (+0,043) | 0,00 | 1,08 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 63,7% | 0,515 (+0,001) | 0,00 | 1,99 |
| base.com.RincorsaDalMarciapiede | 1,55 | 91,1% | 0,540 (+0,026) | 0,22 | 1,05 |
| base.tossico.bound.RaschiareIlFondo | 0,83 | 32,0% | 0,383 (−0,131) | 0,11 | 13,61 |
| com.Grab | 0,37 | 32,4% | 0,425 (−0,089) | 1,42 | 3,57 |
| com.Steal | 0,09 | 9,3% | 0,292 (−0,221) | 0,84 | 2,32 |
| com.basic.ToxicGrab | 2,04 | 94,3% | 0,525 (+0,011) | 3,67 | 8,84 |
| junkie.AmphetamineReflexes | 0,49 | 39,2% | 0,414 (−0,100) | 3,93 | 2,86 |
| junkie.Cough | 1,14 | 76,4% | 0,588 (+0,074) | 2,70 | 1,36 |
| junkie.LethalHeroinDose | 0,83 | 37,0% | 0,506 (−0,008) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,36 | 85,4% | 0,532 (+0,018) | 2,60 | 0,73 |
| junkie.PervertedMetabolism | 1,13 | 72,4% | 0,475 (−0,039) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 9,8% | 0,553 (+0,039) | 1,48 | 1,70 |
| junkie.character.PatheticBlade | 3,98 | 97,7% | 0,519 (+0,005) | 0,11 | 10,46 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,32 | 78,8% | 0,470 (−0,021) | 0,00 | 4,20 |
| base.com.Spintone | 1,71 | 94,0% | 0,515 (+0,023) | 0,00 | 1,46 |
| base.pino.GoingBerserk | 1,73 | 94,4% | 0,517 (+0,026) | 0,00 | 1,10 |
| base.pino.IlBanconeRegge | 1,26 | 81,0% | 0,494 (+0,003) | 0,00 | 3,21 |
| base.pino.OffroIo | 0,14 | 12,7% | 0,139 (−0,353) | 3,63 | 1,29 |
| base.pino.QuestoLoFiniscoIo | 0,94 | 51,6% | 0,404 (−0,088) | 2,20 | 11,99 |
| base.pino.RuttoADistanzaSociale | 0,20 | 20,0% | 0,396 (−0,095) | 4,61 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,93 | 67,5% | 0,549 (+0,057) | 5,95 | 0,61 |
| base.pino.UltimoGiro | 1,42 | 64,5% | 0,597 (+0,106) | 0,00 | 0,44 |
| base.pino.bound.CinqueMinutiEVado | 1,01 | 37,5% | 0,318 (−0,173) | 0,13 | 13,98 |
| base.pino.bound.SpallataAlBancone | 4,02 | 98,9% | 0,494 (+0,003) | 0,13 | 10,97 |
| com.Grab | 0,44 | 37,5% | 0,376 (−0,116) | 0,86 | 3,99 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,549 (+0,035) | 5,72 | 0,84 |
| base.com.Spintone | 0,85 | 84,5% | 0,568 (+0,054) | 0,00 | 0,98 |
| base.gigi.ChiaveDaTredici | 1,61 | 92,4% | 0,545 (+0,030) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,6% | 0,565 (+0,051) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 74,9% | 0,583 (+0,069) | 1,04 | 1,00 |
| base.gigi.QuestoTornaUtile | 1,98 | 76,5% | 0,430 (−0,084) | 1,14 | 10,47 |
| base.gigi.SottoIlCofano | 0,32 | 32,5% | 0,336 (−0,178) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,60 | 97,3% | 0,511 (−0,003) | 0,15 | 9,84 |
| base.gigi.bound.UnaStrettaEPassa | 1,06 | 41,8% | 0,473 (−0,041) | 0,15 | 12,38 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,150 (−0,364) | 2,88 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,558 (+0,044) | 2,60 | 0,60 |
| com.Steal | 0,20 | 16,1% | 0,162 (−0,352) | 1,35 | 3,90 |
| com.last.Struggle | 0,88 | 51,3% | 0,626 (+0,112) | 0,00 | 0,65 |

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
