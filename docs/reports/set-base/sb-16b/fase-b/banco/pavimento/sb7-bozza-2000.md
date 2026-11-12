# Banco SB-7 — bozza.json

> SB-16b variante pavimento

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
| starter-spazienzio | starter-spazienzio | 32000 | 15323 | 15534 | 1143 | 0 | 0,497 [0,491–0,502] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 15074 | 15739 | 1187 | 0 | 0,489 [0,484–0,495] | 0,509 [0,503–0,514] |
| starter-spazienzio | starter-tossico | 32000 | 13847 | 15848 | 2305 | 0 | 0,466 [0,461–0,472] | 0,500 [0,495–0,506] |
| starter-spazienzio | starter-pino | 32000 | 12516 | 17333 | 2151 | 0 | 0,419 [0,414–0,425] | 0,499 [0,493–0,504] |
| starter-spazienzio | starter-gigi | 32000 | 12078 | 18541 | 1381 | 0 | 0,394 [0,389–0,400] | 0,507 [0,502–0,513] |
| starter-mara | starter-mara | 32000 | 15183 | 15298 | 1519 | 0 | 0,498 [0,493–0,504] | 0,499 [0,493–0,505] |
| starter-mara | starter-tossico | 32000 | 16474 | 13140 | 2386 | 0 | 0,556 [0,551–0,562] | 0,503 [0,497–0,508] |
| starter-mara | starter-pino | 32000 | 15751 | 12355 | 3894 | 0 | 0,560 [0,555–0,566] | 0,505 [0,499–0,511] |
| starter-mara | starter-gigi | 32000 | 14953 | 15694 | 1353 | 0 | 0,488 [0,482–0,494] | 0,505 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 13055 | 12731 | 6214 | 0 | 0,506 [0,500–0,512] | 0,492 [0,486–0,498] |
| starter-tossico | starter-pino | 32000 | 16664 | 11424 | 3912 | 0 | 0,593 [0,588–0,599] | 0,500 [0,494–0,506] |
| starter-tossico | starter-gigi | 32000 | 14516 | 13958 | 3526 | 0 | 0,510 [0,504–0,516] | 0,505 [0,500–0,511] |
| starter-pino | starter-pino | 32000 | 10612 | 10462 | 10926 | 0 | 0,504 [0,497–0,510] | 0,501 [0,494–0,507] |
| starter-pino | starter-gigi | 32000 | 12162 | 14639 | 5199 | 0 | 0,454 [0,448–0,460] | 0,505 [0,499–0,511] |
| starter-gigi | starter-gigi | 32000 | 13015 | 12786 | 6199 | 0 | 0,504 [0,498–0,511] | 0,502 [0,496–0,508] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,491 [0,469–0,513] | 0,539 [0,517–0,561] | 0,357 [0,337–0,379] | 0,642 [0,620–0,663] |
| prudente | 0,454 [0,431–0,476] | 0,497 [0,473–0,520] | 0,211 [0,193–0,229] | 0,560 [0,537–0,582] |
| risorse | 0,645 [0,624–0,666] | 0,782 [0,764–0,800] | 0,498 [0,476–0,520] | 0,818 [0,801–0,835] |
| com | 0,341 [0,321–0,363] | 0,437 [0,415–0,459] | 0,185 [0,169–0,203] | 0,485 [0,463–0,507] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,330 [0,310–0,351] | 0,394 [0,373–0,416] | 0,372 [0,351–0,394] | 0,805 [0,787–0,822] |
| prudente | 0,203 [0,186–0,222] | 0,310 [0,289–0,332] | 0,271 [0,252–0,292] | 0,818 [0,800–0,835] |
| risorse | 0,586 [0,564–0,607] | 0,757 [0,738–0,776] | 0,679 [0,658–0,699] | 0,971 [0,963–0,977] |
| com | 0,147 [0,132–0,164] | 0,267 [0,248–0,287] | 0,196 [0,179–0,214] | 0,686 [0,665–0,706] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,407 [0,384–0,429] | 0,403 [0,381–0,426] | 0,358 [0,337–0,380] | 0,696 [0,675–0,717] |
| prudente | 0,190 [0,173–0,209] | 0,193 [0,175–0,212] | 0,091 [0,079–0,105] | 0,574 [0,551–0,597] |
| risorse | 0,731 [0,710–0,750] | 0,802 [0,783–0,819] | 0,762 [0,742–0,781] | 0,904 [0,890–0,917] |
| com | 0,248 [0,229–0,269] | 0,282 [0,262–0,303] | 0,185 [0,168–0,203] | 0,579 [0,557–0,601] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,281 [0,261–0,301] | 0,232 [0,213–0,251] | 0,276 [0,256–0,297] | 0,835 [0,817–0,851] |
| prudente | 0,075 [0,064–0,087] | 0,041 [0,033–0,051] | 0,060 [0,050–0,071] | 0,826 [0,807–0,843] |
| risorse | 0,606 [0,584–0,627] | 0,681 [0,659–0,702] | 0,703 [0,682–0,724] | 0,989 [0,984–0,993] |
| com | 0,156 [0,141–0,173] | 0,150 [0,134–0,166] | 0,158 [0,142–0,175] | 0,678 [0,656–0,699] |

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
| aggressivo | 0,491 [0,469–0,514] | 0,726 [0,705–0,746] | 0,615 [0,593–0,637] | 0,984 [0,977–0,989] |
| prudente | 0,263 [0,244–0,284] | 0,490 [0,467–0,513] | 0,384 [0,362–0,407] | 0,937 [0,925–0,947] |
| risorse | 0,382 [0,360–0,404] | 0,613 [0,591–0,635] | 0,499 [0,476–0,521] | 0,970 [0,961–0,976] |
| com | 0,017 [0,012–0,024] | 0,068 [0,058–0,080] | 0,032 [0,025–0,041] | 0,495 [0,472–0,518] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,779 [0,759–0,797] | 0,811 [0,793–0,828] | 0,763 [0,744–0,782] | 0,921 [0,909–0,933] |
| prudente | 0,445 [0,422–0,468] | 0,518 [0,495–0,541] | 0,381 [0,359–0,404] | 0,785 [0,766–0,803] |
| risorse | 0,678 [0,656–0,699] | 0,731 [0,710–0,751] | 0,650 [0,627–0,671] | 0,880 [0,864–0,893] |
| com | 0,095 [0,083–0,110] | 0,066 [0,056–0,078] | 0,030 [0,023–0,038] | 0,397 [0,375–0,420] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,733 [0,711–0,753] | 0,863 [0,846–0,878] | 0,839 [0,821–0,856] | 0,991 [0,986–0,994] |
| prudente | 0,379 [0,356–0,403] | 0,447 [0,423–0,472] | 0,419 [0,394–0,444] | 0,924 [0,911–0,935] |
| risorse | 0,577 [0,553–0,600] | 0,715 [0,693–0,737] | 0,675 [0,652–0,698] | 0,964 [0,955–0,971] |
| com | 0,043 [0,035–0,053] | 0,033 [0,026–0,042] | 0,026 [0,020–0,034] | 0,374 [0,351–0,397] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,329 [0,308–0,350] | 0,797 [0,779–0,814] | 0,690 [0,669–0,710] | 0,976 [0,969–0,982] |
| prudente | 0,175 [0,159–0,193] | 0,587 [0,564–0,609] | 0,442 [0,419–0,465] | 0,906 [0,892–0,918] |
| risorse | 0,253 [0,234–0,273] | 0,679 [0,658–0,700] | 0,532 [0,509–0,554] | 0,958 [0,949–0,966] |
| com | 0,007 [0,004–0,011] | 0,042 [0,034–0,052] | 0,025 [0,019–0,033] | 0,402 [0,380–0,425] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,526 [0,500–0,551] | 0,387 [0,362–0,412] | 0,110 [0,095–0,126] | 0,654 [0,632–0,675] |
| prudente | 0,637 [0,612–0,661] | 0,497 [0,469–0,526] | 0,111 [0,096–0,128] | 0,813 [0,794–0,830] |
| risorse | 0,895 [0,878–0,909] | 0,898 [0,882–0,913] | 0,497 [0,469–0,525] | 0,807 [0,788–0,824] |
| com | 0,357 [0,335–0,379] | 0,196 [0,178–0,214] | 0,204 [0,187–0,223] | 0,507 [0,484–0,529] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,590 [0,566–0,613] | 0,698 [0,676–0,720] | 0,685 [0,662–0,706] | 0,962 [0,952–0,969] |
| prudente | 0,381 [0,358–0,405] | 0,413 [0,390–0,436] | 0,448 [0,425–0,472] | 0,972 [0,963–0,978] |
| risorse | 0,614 [0,591–0,637] | 0,753 [0,732–0,773] | 0,749 [0,727–0,769] | 0,990 [0,985–0,994] |
| com | 0,173 [0,157–0,191] | 0,219 [0,201–0,239] | 0,219 [0,201–0,239] | 0,568 [0,545–0,591] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,268 [0,248–0,290] | 0,683 [0,660–0,704] | 0,584 [0,560–0,607] | 0,909 [0,895–0,921] |
| prudente | 0,156 [0,140–0,173] | 0,491 [0,467–0,515] | 0,370 [0,347–0,394] | 0,931 [0,918–0,941] |
| risorse | 0,284 [0,263–0,306] | 0,734 [0,713–0,754] | 0,628 [0,605–0,650] | 0,974 [0,965–0,980] |
| com | 0,094 [0,082–0,108] | 0,236 [0,217–0,256] | 0,191 [0,174–0,210] | 0,585 [0,562–0,607] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,492 [0,459–0,525] | 0,594 [0,558–0,629] | 0,742 [0,712–0,770] | 0,996 [0,993–0,998] |
| prudente | 0,431 [0,395–0,467] | 0,519 [0,485–0,553] | 0,677 [0,647–0,706] | 0,998 [0,995–0,999] |
| risorse | 0,268 [0,240–0,298] | 0,341 [0,312–0,372] | 0,510 [0,478–0,541] | 0,996 [0,993–0,998] |
| com | 0,001 [0,000–0,004] | 0,001 [0,000–0,004] | 0,002 [0,001–0,005] | 0,512 [0,487–0,538] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,141 [0,125–0,159] | 0,755 [0,731–0,777] | 0,541 [0,515–0,567] | 0,973 [0,965–0,979] |
| prudente | 0,175 [0,157–0,194] | 0,748 [0,724–0,770] | 0,570 [0,544–0,596] | 0,992 [0,987–0,995] |
| risorse | 0,101 [0,087–0,116] | 0,578 [0,551–0,604] | 0,386 [0,361–0,412] | 0,983 [0,976–0,988] |
| com | 0,000 [0,000–0,002] | 0,004 [0,002–0,007] | 0,003 [0,001–0,007] | 0,472 [0,448–0,496] |

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
| starter-spazienzio | starter-mara | 11,14 [11,11–11,18] | 11 | 7–16 | 4–22 | 0,037 [0,035–0,039] | 0 |
| starter-spazienzio | starter-tossico | 12,81 [12,77–12,84] | 13 | 8–17 | 4–23 | 0,072 [0,069–0,075] | 0 |
| starter-spazienzio | starter-pino | 14,31 [14,28–14,34] | 14 | 11–18 | 6–24 | 0,067 [0,065–0,070] | 0 |
| starter-spazienzio | starter-gigi | 12,61 [12,58–12,64] | 12 | 9–17 | 4–23 | 0,043 [0,041–0,045] | 0 |
| starter-mara | starter-mara | 10,65 [10,61–10,68] | 10 | 7–15 | 5–22 | 0,047 [0,045–0,050] | 0 |
| starter-mara | starter-tossico | 12,06 [12,03–12,10] | 12 | 8–16 | 4–24 | 0,075 [0,072–0,077] | 0 |
| starter-mara | starter-pino | 13,93 [13,90–13,95] | 14 | 11–17 | 6–23 | 0,122 [0,118–0,125] | 0 |
| starter-mara | starter-gigi | 12,14 [12,11–12,17] | 12 | 9–15 | 7–22 | 0,042 [0,040–0,045] | 0 |
| starter-tossico | starter-tossico | 16,61 [16,57–16,65] | 17 | 11–20 | 3–28 | 0,194 [0,190–0,199] | 0 |
| starter-tossico | starter-pino | 15,20 [15,17–15,23] | 16 | 12–18 | 5–24 | 0,122 [0,119–0,126] | 0 |
| starter-tossico | starter-gigi | 13,99 [13,96–14,02] | 14 | 10–17 | 5–23 | 0,110 [0,107–0,114] | 0 |
| starter-pino | starter-pino | 16,09 [16,08–16,11] | 16 | 15–18 | 7–24 | 0,341 [0,336–0,347] | 0 |
| starter-pino | starter-gigi | 15,11 [15,09–15,13] | 15 | 13–17 | 9–24 | 0,162 [0,158–0,167] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,194 [0,189–0,198] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,462 [0,460–0,464] | 15,7% | 10,0% | 17,17 | 17 |
| starter-mara | 192000 | 0,518 [0,516–0,521] | 17,8% | 11,6% | 15,75 | 16 |
| starter-tossico | 192000 | 0,513 [0,511–0,516] | 49,3% | 41,4% | 16,06 | 16 |
| starter-pino | 192000 | 0,480 [0,477–0,482] | 77,2% | 70,1% | 14,69 | 14 |
| starter-gigi | 192000 | 0,527 [0,525–0,530] | 68,0% | 58,1% | 13,81 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,9 | 14,9 | 25 |
| starter-spazienzio | T | 1,9 | 3,4 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 25,9 | 17,4 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 2,0 | 4,0 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 3,2 | 12,4 | 15 |
| starter-tossico | V | 8,2 | 6,5 | 0 |
| starter-tossico | T | 10,2 | 18,0 | 10 |
| starter-tossico | L | 1,8 | 4,7 | 0 |
| starter-tossico | A | 12,1 | 12,6 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 1,1 | 2,5 | 0 |
| starter-pino | L | 0,2 | 4,3 | 5 |
| starter-pino | A | 0,2 | 0,1 | 0 |
| starter-gigi | V | 2,9 | 11,9 | 15 |
| starter-gigi | T | 0,8 | 2,1 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,2 | 25,1 | 10 |

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
| base.com.DentiStretti | 0,30 | 29,9% | 0,578 (+0,117) | 0,00 | 2,14 |
| base.com.MattoneDelCantiere | 0,44 | 43,8% | 0,536 (+0,074) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,1% | 0,317 (−0,144) | 0,09 | 2,57 |
| bruiser.ExtremelyViolentBlow | 0,84 | 64,1% | 0,448 (−0,014) | 1,61 | 1,41 |
| bruiser.Glare | 0,73 | 54,6% | 0,590 (+0,128) | 0,00 | 2,45 |
| bruiser.HealingBlow | 0,32 | 32,2% | 0,568 (+0,106) | 3,13 | 0,53 |
| bruiser.MadeOfStone | 1,03 | 70,7% | 0,502 (+0,040) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,08 | 78,4% | 0,495 (+0,033) | 1,57 | 1,02 |
| bruiser.SuperImpact | 0,59 | 54,6% | 0,600 (+0,138) | 4,93 | 0,60 |
| bruiser.YouStop | 0,45 | 33,2% | 0,305 (−0,157) | 1,41 | 2,54 |
| bruiser.character.LittleRage | 0,76 | 31,3% | 0,359 (−0,103) | 0,01 | 11,48 |
| bruiser.character.LittleSmack | 4,12 | 95,6% | 0,451 (−0,011) | 0,01 | 8,12 |
| com.basic.BruiserGrab | 0,87 | 67,5% | 0,362 (−0,100) | 5,66 | 5,73 |
| com.last.Struggle | 0,13 | 8,3% | 0,527 (+0,065) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,39 | 87,8% | 0,553 (+0,035) | 0,00 | 2,16 |
| base.com.SputoDaPosacenere | 1,23 | 83,8% | 0,567 (+0,048) | 0,73 | 1,28 |
| base.com.TartarugaSulMarciapiede | 0,25 | 24,5% | 0,299 (−0,219) | 0,79 | 2,93 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,1% | 0,565 (+0,046) | 0,72 | 1,26 |
| base.mara.PresoAlVolo | 1,50 | 79,0% | 0,477 (−0,041) | 2,43 | 7,83 |
| base.mara.Sgommata | 1,21 | 85,6% | 0,595 (+0,077) | 1,52 | 0,85 |
| base.mara.Slalom | 0,53 | 53,3% | 0,560 (+0,041) | 0,87 | 1,14 |
| base.mara.SorpassoInCurva | 1,30 | 83,4% | 0,542 (+0,024) | 0,00 | 3,50 |
| base.mara.TraDueParaurti | 0,49 | 35,4% | 0,316 (−0,202) | 1,18 | 4,32 |
| base.mara.bound.CambioMarcia | 0,73 | 32,7% | 0,319 (−0,200) | 0,04 | 10,99 |
| base.mara.bound.PassoStretto | 1,68 | 81,3% | 0,483 (−0,036) | 0,04 | 10,04 |
| com.Steal | 0,09 | 8,7% | 0,090 (−0,429) | 1,94 | 2,35 |
| com.last.Struggle | 0,12 | 8,6% | 0,567 (+0,049) | 0,00 | 1,08 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 63,7% | 0,514 (+0,001) | 0,00 | 1,99 |
| base.com.RincorsaDalMarciapiede | 1,55 | 91,1% | 0,542 (+0,029) | 0,22 | 1,05 |
| base.tossico.bound.RaschiareIlFondo | 0,83 | 32,0% | 0,374 (−0,140) | 0,11 | 13,61 |
| com.Grab | 0,37 | 32,4% | 0,417 (−0,096) | 1,42 | 3,57 |
| com.Steal | 0,09 | 9,3% | 0,277 (−0,236) | 0,84 | 2,32 |
| com.basic.ToxicGrab | 2,04 | 94,3% | 0,526 (+0,012) | 3,67 | 8,84 |
| junkie.AmphetamineReflexes | 0,49 | 39,2% | 0,408 (−0,106) | 3,93 | 2,86 |
| junkie.Cough | 1,14 | 76,4% | 0,595 (+0,081) | 2,70 | 1,36 |
| junkie.LethalHeroinDose | 0,83 | 37,0% | 0,511 (−0,003) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,36 | 85,4% | 0,534 (+0,020) | 2,60 | 0,73 |
| junkie.PervertedMetabolism | 1,13 | 72,4% | 0,470 (−0,043) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 9,8% | 0,563 (+0,050) | 1,48 | 1,70 |
| junkie.character.PatheticBlade | 3,98 | 97,7% | 0,519 (+0,006) | 0,11 | 10,46 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,32 | 78,8% | 0,454 (−0,025) | 0,00 | 4,20 |
| base.com.Spintone | 1,71 | 94,0% | 0,507 (+0,027) | 0,00 | 1,46 |
| base.pino.GoingBerserk | 1,73 | 94,4% | 0,510 (+0,031) | 0,00 | 1,10 |
| base.pino.IlBanconeRegge | 1,26 | 81,0% | 0,483 (+0,003) | 0,00 | 3,21 |
| base.pino.OffroIo | 0,14 | 12,7% | 0,117 (−0,363) | 3,63 | 1,29 |
| base.pino.QuestoLoFiniscoIo | 0,94 | 51,6% | 0,381 (−0,098) | 2,20 | 11,99 |
| base.pino.RuttoADistanzaSociale | 0,20 | 20,0% | 0,383 (−0,097) | 4,61 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,93 | 67,5% | 0,545 (+0,065) | 5,95 | 0,61 |
| base.pino.UltimoGiro | 1,42 | 64,5% | 0,614 (+0,134) | 0,00 | 0,44 |
| base.pino.bound.CinqueMinutiEVado | 1,01 | 37,5% | 0,290 (−0,190) | 0,13 | 13,98 |
| base.pino.bound.SpallataAlBancone | 4,02 | 98,9% | 0,483 (+0,003) | 0,13 | 10,97 |
| com.Grab | 0,44 | 37,5% | 0,352 (−0,128) | 0,86 | 3,99 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,565 (+0,038) | 5,72 | 0,84 |
| base.com.Spintone | 0,85 | 84,5% | 0,591 (+0,064) | 0,00 | 0,98 |
| base.gigi.ChiaveDaTredici | 1,61 | 92,4% | 0,563 (+0,036) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,6% | 0,588 (+0,061) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 74,9% | 0,608 (+0,081) | 1,04 | 1,00 |
| base.gigi.QuestoTornaUtile | 1,98 | 76,5% | 0,437 (−0,090) | 1,14 | 10,47 |
| base.gigi.SottoIlCofano | 0,32 | 32,5% | 0,335 (−0,192) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,60 | 97,3% | 0,524 (−0,003) | 0,15 | 9,84 |
| base.gigi.bound.UnaStrettaEPassa | 1,06 | 41,8% | 0,471 (−0,056) | 0,15 | 12,38 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,135 (−0,392) | 2,88 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,577 (+0,050) | 2,60 | 0,60 |
| com.Steal | 0,20 | 16,1% | 0,144 (−0,383) | 1,35 | 3,90 |
| com.last.Struggle | 0,88 | 51,3% | 0,674 (+0,147) | 0,00 | 0,65 |

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
