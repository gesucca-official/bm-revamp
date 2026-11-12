# Banco SB-7 — bozza.json

> SB-16b variante entrambe

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
| starter-spazienzio | starter-spazienzio | 32000 | 15839 | 16023 | 138 | 0 | 0,497 [0,492–0,503] | 0,499 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 16421 | 15440 | 139 | 0 | 0,515 [0,510–0,521] | 0,509 [0,504–0,514] |
| starter-spazienzio | starter-tossico | 32000 | 15320 | 16486 | 194 | 0 | 0,482 [0,476–0,487] | 0,501 [0,496–0,507] |
| starter-spazienzio | starter-pino | 32000 | 13500 | 18356 | 144 | 0 | 0,424 [0,418–0,429] | 0,498 [0,493–0,504] |
| starter-spazienzio | starter-gigi | 32000 | 12612 | 19251 | 137 | 0 | 0,396 [0,390–0,401] | 0,507 [0,501–0,512] |
| starter-mara | starter-mara | 32000 | 15870 | 15928 | 202 | 0 | 0,499 [0,494–0,505] | 0,501 [0,496–0,507] |
| starter-mara | starter-tossico | 32000 | 16709 | 15098 | 193 | 0 | 0,525 [0,520–0,531] | 0,504 [0,498–0,509] |
| starter-mara | starter-pino | 32000 | 15420 | 16349 | 231 | 0 | 0,485 [0,480–0,491] | 0,504 [0,498–0,509] |
| starter-mara | starter-gigi | 32000 | 13934 | 17925 | 141 | 0 | 0,437 [0,432–0,443] | 0,505 [0,499–0,510] |
| starter-tossico | starter-tossico | 32000 | 15866 | 15538 | 596 | 0 | 0,505 [0,500–0,511] | 0,493 [0,488–0,499] |
| starter-tossico | starter-pino | 32000 | 17734 | 13940 | 326 | 0 | 0,560 [0,554–0,565] | 0,500 [0,494–0,505] |
| starter-tossico | starter-gigi | 32000 | 15521 | 16141 | 338 | 0 | 0,490 [0,485–0,496] | 0,504 [0,498–0,509] |
| starter-pino | starter-pino | 32000 | 15975 | 15577 | 448 | 0 | 0,506 [0,501–0,512] | 0,503 [0,497–0,508] |
| starter-pino | starter-gigi | 32000 | 15128 | 16504 | 368 | 0 | 0,478 [0,473–0,484] | 0,505 [0,500–0,511] |
| starter-gigi | starter-gigi | 32000 | 15828 | 15535 | 637 | 0 | 0,505 [0,499–0,510] | 0,502 [0,497–0,508] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,495 [0,473–0,517] | 0,539 [0,517–0,561] | 0,360 [0,339–0,381] | 0,637 [0,616–0,658] |
| prudente | 0,462 [0,440–0,484] | 0,490 [0,468–0,512] | 0,215 [0,197–0,233] | 0,560 [0,538–0,581] |
| risorse | 0,644 [0,623–0,665] | 0,779 [0,760–0,797] | 0,499 [0,478–0,521] | 0,815 [0,798–0,832] |
| com | 0,351 [0,330–0,372] | 0,435 [0,414–0,457] | 0,187 [0,171–0,205] | 0,484 [0,463–0,506] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,339 [0,318–0,360] | 0,450 [0,429–0,472] | 0,386 [0,365–0,407] | 0,802 [0,784–0,819] |
| prudente | 0,234 [0,216–0,253] | 0,463 [0,441–0,485] | 0,314 [0,294–0,334] | 0,814 [0,796–0,831] |
| risorse | 0,595 [0,573–0,616] | 0,795 [0,776–0,812] | 0,685 [0,664–0,705] | 0,973 [0,964–0,979] |
| com | 0,168 [0,153–0,185] | 0,334 [0,313–0,354] | 0,210 [0,192–0,228] | 0,686 [0,666–0,706] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,422 [0,400–0,444] | 0,416 [0,395–0,438] | 0,376 [0,355–0,397] | 0,692 [0,671–0,712] |
| prudente | 0,220 [0,202–0,239] | 0,270 [0,251–0,290] | 0,128 [0,114–0,143] | 0,582 [0,560–0,603] |
| risorse | 0,738 [0,718–0,757] | 0,808 [0,790–0,825] | 0,770 [0,751–0,788] | 0,900 [0,886–0,913] |
| com | 0,282 [0,262–0,302] | 0,299 [0,279–0,319] | 0,211 [0,194–0,230] | 0,587 [0,565–0,608] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,286 [0,267–0,306] | 0,240 [0,222–0,259] | 0,280 [0,261–0,300] | 0,825 [0,808–0,842] |
| prudente | 0,086 [0,075–0,099] | 0,054 [0,045–0,065] | 0,082 [0,071–0,095] | 0,808 [0,790–0,825] |
| risorse | 0,601 [0,579–0,622] | 0,672 [0,651–0,692] | 0,701 [0,681–0,721] | 0,988 [0,982–0,992] |
| com | 0,160 [0,145–0,177] | 0,159 [0,143–0,176] | 0,169 [0,153–0,186] | 0,674 [0,653–0,694] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,196 [0,179–0,214] | 0,352 [0,332–0,374] | 0,309 [0,289–0,330] | 0,696 [0,675–0,716] |
| prudente | 0,052 [0,043–0,063] | 0,188 [0,171–0,205] | 0,119 [0,105–0,134] | 0,632 [0,610–0,653] |
| risorse | 0,411 [0,390–0,433] | 0,747 [0,728–0,766] | 0,673 [0,652–0,693] | 0,928 [0,916–0,938] |
| com | 0,080 [0,069–0,093] | 0,194 [0,177–0,212] | 0,161 [0,145–0,177] | 0,593 [0,571–0,614] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,466–0,510] | 0,801 [0,783–0,818] | 0,624 [0,603–0,645] | 0,980 [0,973–0,986] |
| prudente | 0,207 [0,189–0,225] | 0,501 [0,478–0,523] | 0,293 [0,274–0,314] | 0,877 [0,861–0,890] |
| risorse | 0,375 [0,354–0,396] | 0,692 [0,672–0,712] | 0,493 [0,471–0,515] | 0,963 [0,954–0,970] |
| com | 0,022 [0,016–0,029] | 0,129 [0,115–0,145] | 0,037 [0,030–0,046] | 0,502 [0,480–0,524] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,755 [0,736–0,774] | 0,785 [0,767–0,803] | 0,739 [0,719–0,758] | 0,902 [0,888–0,914] |
| prudente | 0,368 [0,347–0,389] | 0,388 [0,367–0,410] | 0,274 [0,255–0,294] | 0,721 [0,701–0,740] |
| risorse | 0,655 [0,634–0,676] | 0,690 [0,669–0,710] | 0,624 [0,602–0,645] | 0,861 [0,845–0,876] |
| com | 0,115 [0,102–0,130] | 0,080 [0,069–0,093] | 0,038 [0,031–0,047] | 0,411 [0,389–0,432] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,688 [0,667–0,708] | 0,792 [0,773–0,809] | 0,778 [0,759–0,795] | 0,977 [0,970–0,983] |
| prudente | 0,196 [0,179–0,214] | 0,217 [0,199–0,235] | 0,205 [0,188–0,223] | 0,785 [0,767–0,803] |
| risorse | 0,533 [0,511–0,555] | 0,619 [0,598–0,640] | 0,574 [0,552–0,596] | 0,919 [0,906–0,930] |
| com | 0,046 [0,038–0,056] | 0,039 [0,031–0,048] | 0,033 [0,026–0,042] | 0,365 [0,344–0,386] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,306 [0,286–0,327] | 0,760 [0,741–0,778] | 0,655 [0,634–0,676] | 0,973 [0,964–0,979] |
| prudente | 0,096 [0,084–0,110] | 0,351 [0,331–0,373] | 0,243 [0,225–0,262] | 0,844 [0,828–0,860] |
| risorse | 0,222 [0,204–0,241] | 0,627 [0,605–0,648] | 0,491 [0,470–0,513] | 0,947 [0,937–0,956] |
| com | 0,008 [0,005–0,012] | 0,043 [0,035–0,052] | 0,025 [0,019–0,033] | 0,407 [0,386–0,429] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,517 [0,495–0,539] | 0,411 [0,390–0,433] | 0,150 [0,135–0,167] | 0,655 [0,634–0,675] |
| prudente | 0,616 [0,594–0,637] | 0,496 [0,474–0,519] | 0,171 [0,155–0,188] | 0,799 [0,781–0,816] |
| risorse | 0,845 [0,828–0,861] | 0,843 [0,827–0,859] | 0,495 [0,472–0,517] | 0,793 [0,775–0,811] |
| com | 0,365 [0,344–0,386] | 0,209 [0,191–0,227] | 0,213 [0,196–0,232] | 0,507 [0,485–0,529] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,553 [0,531–0,575] | 0,623 [0,602–0,645] | 0,631 [0,609–0,652] | 0,949 [0,939–0,958] |
| prudente | 0,348 [0,327–0,369] | 0,386 [0,365–0,408] | 0,413 [0,391–0,435] | 0,946 [0,935–0,955] |
| risorse | 0,572 [0,550–0,593] | 0,682 [0,661–0,702] | 0,686 [0,665–0,706] | 0,984 [0,978–0,989] |
| com | 0,188 [0,171–0,205] | 0,223 [0,205–0,241] | 0,227 [0,209–0,246] | 0,546 [0,524–0,568] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,263 [0,244–0,283] | 0,642 [0,621–0,663] | 0,547 [0,525–0,569] | 0,882 [0,867–0,896] |
| prudente | 0,150 [0,135–0,166] | 0,481 [0,459–0,504] | 0,373 [0,352–0,394] | 0,905 [0,891–0,917] |
| risorse | 0,268 [0,249–0,288] | 0,681 [0,660–0,701] | 0,576 [0,554–0,597] | 0,961 [0,952–0,969] |
| com | 0,101 [0,089–0,115] | 0,247 [0,229–0,267] | 0,199 [0,182–0,217] | 0,567 [0,545–0,588] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,509 [0,487–0,531] | 0,465 [0,443–0,488] | 0,601 [0,579–0,622] | 0,995 [0,991–0,997] |
| prudente | 0,568 [0,546–0,590] | 0,508 [0,485–0,530] | 0,641 [0,620–0,662] | 0,997 [0,993–0,999] |
| risorse | 0,427 [0,406–0,450] | 0,363 [0,342–0,385] | 0,507 [0,485–0,529] | 0,994 [0,990–0,997] |
| com | 0,001 [0,000–0,004] | 0,002 [0,001–0,005] | 0,003 [0,001–0,007] | 0,519 [0,497–0,541] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,164 [0,148–0,181] | 0,730 [0,710–0,749] | 0,551 [0,529–0,573] | 0,966 [0,958–0,973] |
| prudente | 0,231 [0,213–0,251] | 0,745 [0,725–0,763] | 0,603 [0,581–0,624] | 0,985 [0,979–0,989] |
| risorse | 0,148 [0,133–0,164] | 0,606 [0,584–0,628] | 0,450 [0,428–0,472] | 0,978 [0,971–0,984] |
| com | 0,000 [0,000–0,002] | 0,007 [0,004–0,011] | 0,006 [0,003–0,010] | 0,486 [0,464–0,508] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,489 [0,466–0,512] | 0,930 [0,918–0,941] | 0,846 [0,830–0,862] | 0,990 [0,985–0,994] |
| prudente | 0,072 [0,061–0,084] | 0,523 [0,501–0,545] | 0,278 [0,258–0,298] | 0,954 [0,944–0,962] |
| risorse | 0,156 [0,141–0,173] | 0,745 [0,725–0,763] | 0,511 [0,489–0,533] | 0,976 [0,968–0,982] |
| com | 0,011 [0,007–0,016] | 0,053 [0,044–0,064] | 0,030 [0,023–0,038] | 0,510 [0,488–0,533] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,004 [0,004–0,005] | 0 |
| starter-spazienzio | starter-mara | 11,26 [11,23–11,30] | 11 | 7–16 | 4–22 | 0,004 [0,004–0,005] | 0 |
| starter-spazienzio | starter-tossico | 12,77 [12,73–12,80] | 13 | 8–17 | 4–23 | 0,006 [0,005–0,007] | 0 |
| starter-spazienzio | starter-pino | 14,27 [14,24–14,30] | 14 | 10–18 | 6–24 | 0,005 [0,004–0,005] | 0 |
| starter-spazienzio | starter-gigi | 12,61 [12,58–12,64] | 12 | 9–17 | 4–23 | 0,004 [0,004–0,005] | 0 |
| starter-mara | starter-mara | 11,28 [11,24–11,31] | 11 | 7–16 | 5–22 | 0,006 [0,006–0,007] | 0 |
| starter-mara | starter-tossico | 12,19 [12,15–12,22] | 12 | 8–17 | 4–24 | 0,006 [0,005–0,007] | 0 |
| starter-mara | starter-pino | 14,24 [14,21–14,27] | 14 | 11–17 | 6–23 | 0,007 [0,006–0,008] | 0 |
| starter-mara | starter-gigi | 12,32 [12,29–12,35] | 12 | 9–16 | 7–22 | 0,004 [0,004–0,005] | 0 |
| starter-tossico | starter-tossico | 16,60 [16,56–16,64] | 17 | 11–20 | 3–28 | 0,019 [0,017–0,020] | 0 |
| starter-tossico | starter-pino | 15,19 [15,16–15,22] | 16 | 12–18 | 5–24 | 0,010 [0,009–0,011] | 0 |
| starter-tossico | starter-gigi | 13,97 [13,94–14,00] | 14 | 10–17 | 5–23 | 0,011 [0,009–0,012] | 0 |
| starter-pino | starter-pino | 16,10 [16,08–16,12] | 16 | 15–18 | 7–24 | 0,014 [0,013–0,015] | 0 |
| starter-pino | starter-gigi | 15,10 [15,09–15,12] | 15 | 13–17 | 9–24 | 0,012 [0,010–0,013] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,020 [0,018–0,021] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,469 [0,467–0,472] | 15,9% | 10,1% | 17,17 | 17 |
| starter-mara | 192000 | 0,489 [0,487–0,491] | 21,8% | 15,0% | 15,90 | 16 |
| starter-tossico | 192000 | 0,507 [0,505–0,509] | 49,4% | 41,5% | 16,06 | 16 |
| starter-pino | 192000 | 0,502 [0,499–0,504] | 77,9% | 70,8% | 14,70 | 14 |
| starter-gigi | 192000 | 0,533 [0,531–0,536] | 68,5% | 58,7% | 13,82 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 5,0 | 14,8 | 25 |
| starter-spazienzio | T | 2,1 | 3,4 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 24,8 | 16,9 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 2,1 | 4,3 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 1,2 | 8,7 | 15 |
| starter-tossico | V | 8,3 | 6,7 | 0 |
| starter-tossico | T | 10,5 | 17,4 | 10 |
| starter-tossico | L | 1,9 | 4,5 | 0 |
| starter-tossico | A | 11,4 | 11,9 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 1,1 | 2,3 | 0 |
| starter-pino | L | 0,2 | 3,8 | 5 |
| starter-pino | A | -19,3 | -41,2 | 0 |
| starter-gigi | V | 3,1 | 11,2 | 15 |
| starter-gigi | T | 0,9 | 2,1 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,4 | 25,7 | 10 |

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
| base.com.DentiStretti | 0,30 | 29,8% | 0,580 (+0,111) | 0,00 | 2,14 |
| base.com.MattoneDelCantiere | 0,44 | 43,9% | 0,540 (+0,071) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,1% | 0,336 (−0,133) | 0,10 | 2,57 |
| bruiser.ExtremelyViolentBlow | 0,84 | 64,0% | 0,456 (−0,013) | 1,61 | 1,41 |
| bruiser.Glare | 0,73 | 54,6% | 0,592 (+0,123) | 0,00 | 2,46 |
| bruiser.HealingBlow | 0,32 | 32,2% | 0,572 (+0,103) | 3,14 | 0,53 |
| bruiser.MadeOfStone | 1,03 | 70,6% | 0,508 (+0,039) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,08 | 78,5% | 0,501 (+0,032) | 1,57 | 1,02 |
| bruiser.SuperImpact | 0,59 | 54,6% | 0,602 (+0,133) | 4,94 | 0,60 |
| bruiser.YouStop | 0,45 | 33,2% | 0,325 (−0,145) | 1,41 | 2,53 |
| bruiser.character.LittleRage | 0,76 | 31,3% | 0,369 (−0,100) | 0,01 | 11,49 |
| bruiser.character.LittleSmack | 4,12 | 95,6% | 0,459 (−0,011) | 0,01 | 8,13 |
| com.basic.BruiserGrab | 0,87 | 67,5% | 0,376 (−0,093) | 5,66 | 5,73 |
| com.last.Struggle | 0,13 | 8,4% | 0,543 (+0,074) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,43 | 88,6% | 0,519 (+0,031) | 0,00 | 2,15 |
| base.com.SputoDaPosacenere | 1,24 | 83,5% | 0,533 (+0,044) | 0,88 | 1,23 |
| base.com.TartarugaSulMarciapiede | 0,25 | 25,0% | 0,259 (−0,230) | 0,88 | 2,84 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,0% | 0,532 (+0,043) | 0,86 | 1,21 |
| base.mara.PresoAlVolo | 1,58 | 79,3% | 0,440 (−0,049) | 2,59 | 7,92 |
| base.mara.Sgommata | 1,09 | 83,0% | 0,561 (+0,073) | 2,02 | 0,84 |
| base.mara.Slalom | 0,53 | 52,7% | 0,520 (+0,032) | 1,00 | 1,07 |
| base.mara.SorpassoInCurva | 1,34 | 84,2% | 0,510 (+0,021) | 0,00 | 3,47 |
| base.mara.TraDueParaurti | 0,50 | 35,7% | 0,271 (−0,218) | 1,34 | 4,23 |
| base.mara.bound.CambioMarcia | 0,76 | 33,9% | 0,342 (−0,146) | 0,04 | 11,29 |
| base.mara.bound.PassoStretto | 1,88 | 83,6% | 0,457 (−0,031) | 0,04 | 10,17 |
| com.Steal | 0,09 | 8,7% | 0,101 (−0,388) | 1,98 | 2,26 |
| com.last.Struggle | 0,17 | 11,7% | 0,575 (+0,086) | 0,00 | 0,89 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 63,7% | 0,506 (−0,001) | 0,00 | 1,99 |
| base.com.RincorsaDalMarciapiede | 1,55 | 91,1% | 0,532 (+0,025) | 0,22 | 1,05 |
| base.tossico.bound.RaschiareIlFondo | 0,83 | 32,0% | 0,377 (−0,130) | 0,11 | 13,61 |
| com.Grab | 0,37 | 32,4% | 0,419 (−0,088) | 1,42 | 3,57 |
| com.Steal | 0,09 | 9,3% | 0,286 (−0,221) | 0,84 | 2,31 |
| com.basic.ToxicGrab | 2,04 | 94,3% | 0,518 (+0,011) | 3,67 | 8,85 |
| junkie.AmphetamineReflexes | 0,49 | 39,2% | 0,412 (−0,095) | 3,93 | 2,86 |
| junkie.Cough | 1,14 | 76,5% | 0,578 (+0,071) | 2,70 | 1,36 |
| junkie.LethalHeroinDose | 0,83 | 37,1% | 0,500 (−0,007) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,36 | 85,5% | 0,525 (+0,017) | 2,60 | 0,73 |
| junkie.PervertedMetabolism | 1,13 | 72,4% | 0,468 (−0,039) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 9,8% | 0,554 (+0,046) | 1,48 | 1,70 |
| junkie.character.PatheticBlade | 3,98 | 97,6% | 0,512 (+0,005) | 0,11 | 10,46 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,32 | 78,9% | 0,481 (−0,021) | 0,00 | 4,21 |
| base.com.Spintone | 1,71 | 94,0% | 0,525 (+0,023) | 0,00 | 1,47 |
| base.pino.GoingBerserk | 1,74 | 94,4% | 0,527 (+0,026) | 0,00 | 1,10 |
| base.pino.IlBanconeRegge | 1,26 | 81,1% | 0,505 (+0,004) | 0,00 | 3,22 |
| base.pino.OffroIo | 0,15 | 12,7% | 0,150 (−0,352) | 3,64 | 1,29 |
| base.pino.QuestoLoFiniscoIo | 0,94 | 51,7% | 0,405 (−0,097) | 2,20 | 12,02 |
| base.pino.RuttoADistanzaSociale | 0,20 | 20,0% | 0,419 (−0,083) | 4,62 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,93 | 67,7% | 0,552 (+0,051) | 5,96 | 0,61 |
| base.pino.UltimoGiro | 1,43 | 65,2% | 0,605 (+0,104) | 0,00 | 0,45 |
| base.pino.bound.CinqueMinutiEVado | 1,02 | 37,5% | 0,321 (−0,180) | 0,14 | 14,01 |
| base.pino.bound.SpallataAlBancone | 4,02 | 98,9% | 0,504 (+0,003) | 0,14 | 11,01 |
| com.Grab | 0,44 | 37,5% | 0,383 (−0,119) | 0,86 | 3,99 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,567 (+0,034) | 5,74 | 0,84 |
| base.com.Spintone | 0,85 | 84,6% | 0,590 (+0,056) | 0,00 | 0,98 |
| base.gigi.ChiaveDaTredici | 1,62 | 92,4% | 0,565 (+0,032) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,7% | 0,587 (+0,054) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 75,1% | 0,605 (+0,072) | 1,04 | 1,00 |
| base.gigi.QuestoTornaUtile | 1,99 | 76,6% | 0,451 (−0,082) | 1,14 | 10,49 |
| base.gigi.SottoIlCofano | 0,33 | 32,5% | 0,357 (−0,177) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,61 | 97,3% | 0,531 (−0,002) | 0,15 | 9,86 |
| base.gigi.bound.UnaStrettaEPassa | 1,07 | 41,8% | 0,481 (−0,053) | 0,15 | 12,40 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,152 (−0,382) | 2,88 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,578 (+0,044) | 2,61 | 0,61 |
| com.Steal | 0,20 | 16,1% | 0,161 (−0,372) | 1,35 | 3,90 |
| com.last.Struggle | 0,89 | 51,8% | 0,651 (+0,117) | 0,00 | 0,65 |

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
