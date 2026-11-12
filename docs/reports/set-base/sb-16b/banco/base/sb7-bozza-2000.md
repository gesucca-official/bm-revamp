# Banco SB-7 — bozza.json

> SB-16b variante base

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
| starter-spazienzio | starter-spazienzio | 32000 | 13894 | 14063 | 4043 | 0 | 0,497 [0,491–0,503] | 0,501 [0,495–0,507] |
| starter-spazienzio | starter-mara | 32000 | 15071 | 13615 | 3314 | 0 | 0,525 [0,520–0,531] | 0,510 [0,504–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 13422 | 15132 | 3446 | 0 | 0,470 [0,464–0,476] | 0,500 [0,494–0,506] |
| starter-spazienzio | starter-pino | 32000 | 11016 | 16463 | 4521 | 0 | 0,401 [0,395–0,407] | 0,498 [0,492–0,504] |
| starter-spazienzio | starter-gigi | 32000 | 11333 | 16564 | 4103 | 0 | 0,406 [0,400–0,412] | 0,508 [0,502–0,514] |
| starter-mara | starter-mara | 32000 | 14449 | 14496 | 3055 | 0 | 0,499 [0,493–0,505] | 0,500 [0,495–0,506] |
| starter-mara | starter-tossico | 32000 | 14808 | 13788 | 3404 | 0 | 0,518 [0,512–0,524] | 0,504 [0,498–0,510] |
| starter-mara | starter-pino | 32000 | 11900 | 14936 | 5164 | 0 | 0,443 [0,437–0,449] | 0,504 [0,498–0,510] |
| starter-mara | starter-gigi | 32000 | 12961 | 14940 | 4099 | 0 | 0,465 [0,459–0,470] | 0,507 [0,501–0,513] |
| starter-tossico | starter-tossico | 32000 | 12583 | 12249 | 7168 | 0 | 0,507 [0,501–0,513] | 0,492 [0,486–0,498] |
| starter-tossico | starter-pino | 32000 | 15003 | 11315 | 5682 | 0 | 0,570 [0,564–0,576] | 0,500 [0,494–0,506] |
| starter-tossico | starter-gigi | 32000 | 14264 | 12603 | 5133 | 0 | 0,531 [0,525–0,537] | 0,505 [0,499–0,511] |
| starter-pino | starter-pino | 32000 | 10502 | 10368 | 11130 | 0 | 0,503 [0,496–0,510] | 0,501 [0,494–0,508] |
| starter-pino | starter-gigi | 32000 | 12118 | 10962 | 8920 | 0 | 0,525 [0,519–0,531] | 0,505 [0,499–0,512] |
| starter-gigi | starter-gigi | 32000 | 12059 | 11896 | 8045 | 0 | 0,503 [0,497–0,510] | 0,504 [0,497–0,510] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,465–0,512] | 0,520 [0,496–0,543] | 0,341 [0,319–0,363] | 0,642 [0,620–0,664] |
| prudente | 0,468 [0,444–0,491] | 0,495 [0,470–0,520] | 0,192 [0,174–0,211] | 0,567 [0,544–0,590] |
| risorse | 0,673 [0,650–0,695] | 0,804 [0,785–0,822] | 0,499 [0,475–0,523] | 0,832 [0,814–0,848] |
| com | 0,345 [0,324–0,368] | 0,427 [0,404–0,450] | 0,173 [0,156–0,191] | 0,490 [0,467–0,513] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,314 [0,293–0,336] | 0,441 [0,418–0,464] | 0,382 [0,360–0,405] | 0,825 [0,807–0,842] |
| prudente | 0,231 [0,212–0,251] | 0,483 [0,458–0,507] | 0,317 [0,295–0,339] | 0,853 [0,836–0,868] |
| risorse | 0,611 [0,588–0,634] | 0,819 [0,801–0,836] | 0,710 [0,689–0,731] | 0,980 [0,973–0,985] |
| com | 0,148 [0,133–0,165] | 0,322 [0,301–0,344] | 0,200 [0,182–0,219] | 0,716 [0,695–0,737] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,401 [0,379–0,424] | 0,399 [0,377–0,422] | 0,353 [0,332–0,376] | 0,699 [0,677–0,719] |
| prudente | 0,186 [0,169–0,205] | 0,202 [0,183–0,222] | 0,094 [0,082–0,109] | 0,580 [0,557–0,603] |
| risorse | 0,749 [0,728–0,769] | 0,819 [0,801–0,836] | 0,778 [0,758–0,796] | 0,910 [0,897–0,922] |
| com | 0,243 [0,224–0,264] | 0,274 [0,253–0,295] | 0,179 [0,163–0,198] | 0,584 [0,561–0,606] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,238 [0,219–0,259] | 0,194 [0,176–0,214] | 0,236 [0,217–0,257] | 0,831 [0,812–0,848] |
| prudente | 0,037 [0,029–0,047] | 0,019 [0,014–0,027] | 0,028 [0,021–0,037] | 0,817 [0,797–0,836] |
| risorse | 0,617 [0,593–0,640] | 0,690 [0,666–0,713] | 0,743 [0,721–0,764] | 0,993 [0,989–0,996] |
| com | 0,132 [0,117–0,148] | 0,131 [0,117–0,148] | 0,139 [0,123–0,156] | 0,671 [0,648–0,693] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,167 [0,151–0,185] | 0,355 [0,334–0,378] | 0,319 [0,298–0,341] | 0,719 [0,697–0,739] |
| prudente | 0,048 [0,039–0,059] | 0,202 [0,183–0,223] | 0,129 [0,113–0,146] | 0,671 [0,648–0,694] |
| risorse | 0,385 [0,362–0,409] | 0,789 [0,770–0,808] | 0,724 [0,702–0,744] | 0,944 [0,933–0,954] |
| com | 0,070 [0,060–0,083] | 0,188 [0,170–0,207] | 0,154 [0,138–0,171] | 0,604 [0,581–0,627] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,486 [0,462–0,510] | 0,819 [0,801–0,836] | 0,663 [0,640–0,685] | 0,988 [0,983–0,992] |
| prudente | 0,188 [0,170–0,206] | 0,498 [0,474–0,523] | 0,288 [0,268–0,310] | 0,903 [0,889–0,916] |
| risorse | 0,339 [0,317–0,362] | 0,704 [0,682–0,724] | 0,492 [0,469–0,516] | 0,970 [0,961–0,976] |
| com | 0,014 [0,010–0,020] | 0,097 [0,084–0,111] | 0,030 [0,023–0,038] | 0,499 [0,475–0,522] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,774 [0,753–0,793] | 0,810 [0,791–0,828] | 0,770 [0,750–0,789] | 0,916 [0,903–0,928] |
| prudente | 0,345 [0,323–0,367] | 0,353 [0,330–0,376] | 0,253 [0,234–0,274] | 0,728 [0,707–0,748] |
| risorse | 0,657 [0,634–0,679] | 0,697 [0,675–0,719] | 0,625 [0,602–0,648] | 0,874 [0,858–0,888] |
| com | 0,084 [0,072–0,098] | 0,055 [0,045–0,066] | 0,026 [0,020–0,034] | 0,391 [0,369–0,413] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,642 [0,618–0,666] | 0,783 [0,761–0,803] | 0,756 [0,734–0,777] | 0,978 [0,971–0,984] |
| prudente | 0,130 [0,115–0,147] | 0,140 [0,123–0,158] | 0,117 [0,102–0,134] | 0,787 [0,767–0,806] |
| risorse | 0,457 [0,432–0,482] | 0,596 [0,571–0,620] | 0,540 [0,515–0,564] | 0,928 [0,916–0,939] |
| com | 0,028 [0,022–0,036] | 0,018 [0,013–0,025] | 0,015 [0,011–0,022] | 0,297 [0,276–0,320] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,354 [0,331–0,378] | 0,843 [0,825–0,859] | 0,752 [0,731–0,772] | 0,981 [0,974–0,986] |
| prudente | 0,080 [0,069–0,094] | 0,375 [0,351–0,400] | 0,245 [0,225–0,266] | 0,877 [0,861–0,892] |
| risorse | 0,231 [0,212–0,252] | 0,701 [0,679–0,723] | 0,558 [0,534–0,582] | 0,960 [0,950–0,967] |
| com | 0,007 [0,004–0,011] | 0,038 [0,030–0,047] | 0,023 [0,017–0,031] | 0,386 [0,363–0,410] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,529 [0,503–0,555] | 0,340 [0,316–0,366] | 0,089 [0,075–0,105] | 0,655 [0,633–0,677] |
| prudente | 0,676 [0,651–0,700] | 0,497 [0,469–0,526] | 0,118 [0,101–0,136] | 0,816 [0,798–0,834] |
| risorse | 0,913 [0,898–0,926] | 0,895 [0,878–0,910] | 0,500 [0,470–0,529] | 0,811 [0,792–0,828] |
| com | 0,352 [0,330–0,375] | 0,189 [0,171–0,208] | 0,199 [0,182–0,218] | 0,506 [0,484–0,529] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,556 [0,531–0,581] | 0,672 [0,648–0,696] | 0,660 [0,635–0,683] | 0,962 [0,952–0,970] |
| prudente | 0,314 [0,291–0,338] | 0,357 [0,333–0,381] | 0,386 [0,362–0,411] | 0,971 [0,962–0,978] |
| risorse | 0,576 [0,550–0,601] | 0,719 [0,696–0,742] | 0,721 [0,698–0,743] | 0,991 [0,986–0,995] |
| com | 0,167 [0,150–0,185] | 0,210 [0,192–0,230] | 0,212 [0,194–0,231] | 0,563 [0,539–0,586] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,282 [0,260–0,305] | 0,721 [0,699–0,742] | 0,627 [0,603–0,651] | 0,916 [0,902–0,928] |
| prudente | 0,156 [0,139–0,174] | 0,559 [0,534–0,584] | 0,410 [0,386–0,436] | 0,943 [0,931–0,952] |
| risorse | 0,283 [0,261–0,305] | 0,773 [0,752–0,793] | 0,677 [0,653–0,700] | 0,980 [0,972–0,985] |
| com | 0,091 [0,079–0,105] | 0,238 [0,219–0,258] | 0,191 [0,174–0,210] | 0,590 [0,567–0,613] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,487 [0,453–0,521] | 0,577 [0,540–0,613] | 0,734 [0,703–0,762] | 0,997 [0,993–0,999] |
| prudente | 0,447 [0,411–0,484] | 0,519 [0,485–0,553] | 0,682 [0,652–0,711] | 0,998 [0,995–0,999] |
| risorse | 0,275 [0,246–0,306] | 0,336 [0,307–0,367] | 0,510 [0,478–0,541] | 0,996 [0,993–0,998] |
| com | 0,001 [0,000–0,003] | 0,001 [0,000–0,004] | 0,002 [0,001–0,005] | 0,514 [0,489–0,540] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,191 [0,170–0,215] | 0,918 [0,901–0,933] | 0,740 [0,712–0,766] | 0,987 [0,981–0,991] |
| prudente | 0,259 [0,234–0,286] | 0,879 [0,859–0,896] | 0,754 [0,727–0,779] | 0,996 [0,992–0,998] |
| risorse | 0,136 [0,118–0,156] | 0,754 [0,727–0,779] | 0,568 [0,536–0,599] | 0,992 [0,987–0,995] |
| com | 0,000 [0,000–0,002] | 0,004 [0,002–0,007] | 0,003 [0,001–0,007] | 0,514 [0,489–0,539] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,498 [0,469–0,527] | 0,964 [0,954–0,972] | 0,949 [0,936–0,959] | 0,994 [0,990–0,997] |
| prudente | 0,033 [0,026–0,043] | 0,530 [0,496–0,564] | 0,259 [0,232–0,288] | 0,962 [0,952–0,970] |
| risorse | 0,061 [0,050–0,074] | 0,750 [0,722–0,776] | 0,508 [0,474–0,541] | 0,978 [0,970–0,984] |
| com | 0,008 [0,005–0,013] | 0,035 [0,028–0,045] | 0,023 [0,017–0,031] | 0,501 [0,476–0,526] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,126 [0,123–0,130] | 0 |
| starter-spazienzio | starter-mara | 11,26 [11,23–11,30] | 11 | 7–16 | 4–22 | 0,104 [0,100–0,107] | 0 |
| starter-spazienzio | starter-tossico | 12,77 [12,73–12,80] | 13 | 8–17 | 4–23 | 0,108 [0,104–0,111] | 0 |
| starter-spazienzio | starter-pino | 14,27 [14,24–14,30] | 14 | 10–18 | 6–24 | 0,141 [0,138–0,145] | 0 |
| starter-spazienzio | starter-gigi | 12,61 [12,58–12,64] | 12 | 9–17 | 4–23 | 0,128 [0,125–0,132] | 0 |
| starter-mara | starter-mara | 11,28 [11,24–11,31] | 11 | 7–16 | 5–22 | 0,095 [0,092–0,099] | 0 |
| starter-mara | starter-tossico | 12,19 [12,15–12,22] | 12 | 8–17 | 4–24 | 0,106 [0,103–0,110] | 0 |
| starter-mara | starter-pino | 14,24 [14,21–14,27] | 14 | 11–17 | 6–23 | 0,161 [0,157–0,165] | 0 |
| starter-mara | starter-gigi | 12,32 [12,29–12,35] | 12 | 9–16 | 7–22 | 0,128 [0,124–0,132] | 0 |
| starter-tossico | starter-tossico | 16,60 [16,56–16,64] | 17 | 11–20 | 3–28 | 0,224 [0,219–0,229] | 0 |
| starter-tossico | starter-pino | 15,19 [15,16–15,22] | 16 | 12–18 | 5–24 | 0,178 [0,173–0,182] | 0 |
| starter-tossico | starter-gigi | 13,97 [13,94–14,00] | 14 | 10–17 | 5–23 | 0,160 [0,156–0,164] | 0 |
| starter-pino | starter-pino | 16,10 [16,08–16,12] | 16 | 15–18 | 7–24 | 0,348 [0,343–0,353] | 0 |
| starter-pino | starter-gigi | 15,10 [15,09–15,12] | 15 | 13–17 | 9–24 | 0,279 [0,274–0,284] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,251 [0,247–0,256] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,468 [0,465–0,470] | 15,9% | 10,1% | 17,17 | 17 |
| starter-mara | 192000 | 0,484 [0,482–0,486] | 21,8% | 15,0% | 15,90 | 16 |
| starter-tossico | 192000 | 0,519 [0,516–0,521] | 49,4% | 41,5% | 16,06 | 16 |
| starter-pino | 192000 | 0,520 [0,518–0,523] | 77,9% | 70,8% | 14,70 | 14 |
| starter-gigi | 192000 | 0,514 [0,512–0,517] | 68,5% | 58,7% | 13,82 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,8 | 15,7 | 25 |
| starter-spazienzio | T | 2,0 | 3,5 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 25,1 | 16,9 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,9 | 4,3 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 1,1 | 9,7 | 15 |
| starter-tossico | V | 8,2 | 6,6 | 0 |
| starter-tossico | T | 10,3 | 18,4 | 10 |
| starter-tossico | L | 1,8 | 4,8 | 0 |
| starter-tossico | A | 11,5 | 12,4 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 1,0 | 2,6 | 0 |
| starter-pino | L | 0,2 | 4,6 | 5 |
| starter-pino | A | -19,7 | -46,9 | 0 |
| starter-gigi | V | 2,9 | 12,3 | 15 |
| starter-gigi | T | 0,9 | 2,2 | 0 |
| starter-gigi | L | 0,0 | 0,2 | 0 |
| starter-gigi | A | 26,7 | 25,1 | 10 |

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
| base.com.DentiStretti | 0,30 | 29,8% | 0,594 (+0,126) | 0,00 | 2,14 |
| base.com.MattoneDelCantiere | 0,44 | 43,9% | 0,550 (+0,082) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,1% | 0,324 (−0,144) | 0,10 | 2,57 |
| bruiser.ExtremelyViolentBlow | 0,84 | 64,0% | 0,449 (−0,018) | 1,61 | 1,41 |
| bruiser.Glare | 0,73 | 54,6% | 0,599 (+0,132) | 0,00 | 2,46 |
| bruiser.HealingBlow | 0,32 | 32,2% | 0,579 (+0,111) | 3,14 | 0,53 |
| bruiser.MadeOfStone | 1,03 | 70,6% | 0,514 (+0,047) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,08 | 78,5% | 0,503 (+0,035) | 1,57 | 1,02 |
| bruiser.SuperImpact | 0,59 | 54,6% | 0,623 (+0,156) | 4,94 | 0,60 |
| bruiser.YouStop | 0,45 | 33,2% | 0,307 (−0,160) | 1,41 | 2,53 |
| bruiser.character.LittleRage | 0,76 | 31,3% | 0,356 (−0,111) | 0,01 | 11,49 |
| bruiser.character.LittleSmack | 4,12 | 95,6% | 0,456 (−0,012) | 0,01 | 8,13 |
| com.basic.BruiserGrab | 0,87 | 67,5% | 0,364 (−0,103) | 5,66 | 5,73 |
| com.last.Struggle | 0,13 | 8,4% | 0,530 (+0,062) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,43 | 88,6% | 0,518 (+0,034) | 0,00 | 2,15 |
| base.com.SputoDaPosacenere | 1,24 | 83,5% | 0,533 (+0,049) | 0,88 | 1,23 |
| base.com.TartarugaSulMarciapiede | 0,25 | 25,0% | 0,229 (−0,255) | 0,88 | 2,84 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,0% | 0,531 (+0,047) | 0,86 | 1,21 |
| base.mara.PresoAlVolo | 1,58 | 79,3% | 0,427 (−0,057) | 2,59 | 7,92 |
| base.mara.Sgommata | 1,09 | 83,0% | 0,566 (+0,082) | 2,02 | 0,84 |
| base.mara.Slalom | 0,53 | 52,7% | 0,519 (+0,035) | 1,00 | 1,07 |
| base.mara.SorpassoInCurva | 1,34 | 84,2% | 0,506 (+0,022) | 0,00 | 3,47 |
| base.mara.TraDueParaurti | 0,50 | 35,7% | 0,244 (−0,240) | 1,34 | 4,23 |
| base.mara.bound.CambioMarcia | 0,76 | 33,9% | 0,321 (−0,163) | 0,04 | 11,29 |
| base.mara.bound.PassoStretto | 1,88 | 83,6% | 0,448 (−0,036) | 0,04 | 10,17 |
| com.Steal | 0,09 | 8,7% | 0,079 (−0,405) | 1,98 | 2,26 |
| com.last.Struggle | 0,17 | 11,7% | 0,567 (+0,083) | 0,00 | 0,89 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 63,7% | 0,525 (+0,006) | 0,00 | 1,99 |
| base.com.RincorsaDalMarciapiede | 1,55 | 91,1% | 0,550 (+0,031) | 0,22 | 1,05 |
| base.tossico.bound.RaschiareIlFondo | 0,83 | 32,0% | 0,374 (−0,145) | 0,11 | 13,61 |
| com.Grab | 0,37 | 32,4% | 0,422 (−0,097) | 1,42 | 3,57 |
| com.Steal | 0,09 | 9,3% | 0,278 (−0,240) | 0,84 | 2,31 |
| com.basic.ToxicGrab | 2,04 | 94,3% | 0,532 (+0,013) | 3,67 | 8,85 |
| junkie.AmphetamineReflexes | 0,49 | 39,2% | 0,413 (−0,106) | 3,93 | 2,86 |
| junkie.Cough | 1,14 | 76,5% | 0,602 (+0,083) | 2,70 | 1,36 |
| junkie.LethalHeroinDose | 0,83 | 37,1% | 0,513 (−0,006) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,36 | 85,5% | 0,540 (+0,021) | 2,60 | 0,73 |
| junkie.PervertedMetabolism | 1,13 | 72,4% | 0,476 (−0,043) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 9,8% | 0,568 (+0,049) | 1,48 | 1,70 |
| junkie.character.PatheticBlade | 3,98 | 97,6% | 0,525 (+0,006) | 0,11 | 10,46 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,32 | 78,9% | 0,498 (−0,022) | 0,00 | 4,21 |
| base.com.Spintone | 1,71 | 94,0% | 0,552 (+0,031) | 0,00 | 1,47 |
| base.pino.GoingBerserk | 1,74 | 94,4% | 0,555 (+0,035) | 0,00 | 1,10 |
| base.pino.IlBanconeRegge | 1,26 | 81,1% | 0,525 (+0,005) | 0,00 | 3,22 |
| base.pino.OffroIo | 0,15 | 12,7% | 0,130 (−0,390) | 3,64 | 1,29 |
| base.pino.QuestoLoFiniscoIo | 0,94 | 51,7% | 0,409 (−0,112) | 2,20 | 12,02 |
| base.pino.RuttoADistanzaSociale | 0,20 | 20,0% | 0,419 (−0,101) | 4,62 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,93 | 67,7% | 0,592 (+0,072) | 5,96 | 0,61 |
| base.pino.UltimoGiro | 1,43 | 65,2% | 0,673 (+0,153) | 0,00 | 0,45 |
| base.pino.bound.CinqueMinutiEVado | 1,02 | 37,5% | 0,309 (−0,211) | 0,14 | 14,01 |
| base.pino.bound.SpallataAlBancone | 4,02 | 98,9% | 0,524 (+0,003) | 0,14 | 11,01 |
| com.Grab | 0,44 | 37,5% | 0,382 (−0,139) | 0,86 | 3,99 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,555 (+0,040) | 5,74 | 0,84 |
| base.com.Spintone | 0,85 | 84,6% | 0,581 (+0,067) | 0,00 | 0,98 |
| base.gigi.ChiaveDaTredici | 1,62 | 92,4% | 0,552 (+0,037) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,7% | 0,578 (+0,064) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 75,1% | 0,600 (+0,086) | 1,04 | 1,00 |
| base.gigi.QuestoTornaUtile | 1,99 | 76,6% | 0,416 (−0,098) | 1,14 | 10,49 |
| base.gigi.SottoIlCofano | 0,33 | 32,5% | 0,315 (−0,199) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,61 | 97,3% | 0,511 (−0,003) | 0,15 | 9,86 |
| base.gigi.bound.UnaStrettaEPassa | 1,07 | 41,8% | 0,462 (−0,052) | 0,15 | 12,40 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,123 (−0,391) | 2,88 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,567 (+0,053) | 2,61 | 0,61 |
| com.Steal | 0,20 | 16,1% | 0,137 (−0,377) | 1,35 | 3,90 |
| com.last.Struggle | 0,89 | 51,8% | 0,663 (+0,148) | 0,00 | 0,65 |

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
