# Banco SB-7 — bozza.json

> SB-16b variante alcol4

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

480000 partite, 13101470 turni di giocatore controllati.

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
| tetto-bound | valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario | 1 bound su 15 |

## Matrice dei mazzi

Somma delle 16 coppie di stili, a pari peso.

| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |
|---|---|---:|---:|---:|---:|---:|---|---|
| starter-spazienzio | starter-spazienzio | 32000 | 15320 | 15529 | 1151 | 0 | 0,497 [0,491–0,502] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 15093 | 15716 | 1191 | 0 | 0,490 [0,484–0,495] | 0,509 [0,503–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 12895 | 16891 | 2214 | 0 | 0,433 [0,427–0,439] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-pino | 32000 | 9952 | 19846 | 2202 | 0 | 0,334 [0,329–0,339] | 0,501 [0,495–0,507] |
| starter-spazienzio | starter-gigi | 32000 | 12209 | 18383 | 1408 | 0 | 0,399 [0,394–0,405] | 0,508 [0,502–0,513] |
| starter-mara | starter-mara | 32000 | 15183 | 15298 | 1519 | 0 | 0,498 [0,493–0,504] | 0,499 [0,493–0,505] |
| starter-mara | starter-tossico | 32000 | 16081 | 13564 | 2355 | 0 | 0,542 [0,537–0,548] | 0,502 [0,496–0,507] |
| starter-mara | starter-pino | 32000 | 14646 | 13472 | 3882 | 0 | 0,521 [0,515–0,527] | 0,504 [0,498–0,510] |
| starter-mara | starter-gigi | 32000 | 14953 | 15694 | 1353 | 0 | 0,488 [0,482–0,494] | 0,505 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 12974 | 12643 | 6383 | 0 | 0,506 [0,500–0,513] | 0,492 [0,485–0,498] |
| starter-tossico | starter-pino | 32000 | 16940 | 11005 | 4055 | 0 | 0,606 [0,600–0,612] | 0,500 [0,494–0,506] |
| starter-tossico | starter-gigi | 32000 | 15737 | 12727 | 3536 | 0 | 0,553 [0,547–0,559] | 0,504 [0,498–0,509] |
| starter-pino | starter-pino | 32000 | 10311 | 10030 | 11659 | 0 | 0,507 [0,500–0,514] | 0,474 [0,467–0,481] |
| starter-pino | starter-gigi | 32000 | 16077 | 11107 | 4816 | 0 | 0,591 [0,586–0,597] | 0,507 [0,501–0,513] |
| starter-gigi | starter-gigi | 32000 | 13015 | 12786 | 6199 | 0 | 0,504 [0,498–0,511] | 0,502 [0,496–0,508] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,494 [0,471–0,516] | 0,537 [0,515–0,559] | 0,361 [0,341–0,383] | 0,641 [0,619–0,662] |
| prudente | 0,453 [0,431–0,476] | 0,497 [0,473–0,521] | 0,215 [0,197–0,234] | 0,552 [0,530–0,574] |
| risorse | 0,643 [0,621–0,664] | 0,781 [0,762–0,799] | 0,498 [0,476–0,520] | 0,818 [0,800–0,834] |
| com | 0,348 [0,327–0,370] | 0,437 [0,415–0,460] | 0,187 [0,170–0,205] | 0,482 [0,460–0,504] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,331 [0,310–0,352] | 0,396 [0,374–0,418] | 0,372 [0,351–0,394] | 0,805 [0,787–0,822] |
| prudente | 0,203 [0,186–0,222] | 0,311 [0,289–0,333] | 0,272 [0,253–0,293] | 0,818 [0,800–0,835] |
| risorse | 0,586 [0,565–0,608] | 0,758 [0,738–0,776] | 0,679 [0,659–0,700] | 0,971 [0,963–0,977] |
| com | 0,148 [0,133–0,165] | 0,268 [0,249–0,289] | 0,197 [0,180–0,215] | 0,686 [0,665–0,707] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,324 [0,303–0,346] | 0,406 [0,384–0,429] | 0,346 [0,325–0,368] | 0,629 [0,607–0,651] |
| prudente | 0,098 [0,085–0,112] | 0,194 [0,175–0,213] | 0,081 [0,069–0,094] | 0,480 [0,458–0,503] |
| risorse | 0,678 [0,656–0,699] | 0,803 [0,784–0,820] | 0,759 [0,740–0,778] | 0,883 [0,868–0,897] |
| com | 0,201 [0,184–0,220] | 0,283 [0,263–0,304] | 0,183 [0,166–0,201] | 0,539 [0,516–0,561] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,191 [0,174–0,209] | 0,169 [0,152–0,186] | 0,201 [0,184–0,220] | 0,634 [0,611–0,656] |
| prudente | 0,034 [0,027–0,043] | 0,022 [0,016–0,030] | 0,021 [0,016–0,029] | 0,571 [0,546–0,595] |
| risorse | 0,504 [0,481–0,526] | 0,565 [0,542–0,588] | 0,601 [0,578–0,623] | 0,973 [0,965–0,979] |
| com | 0,122 [0,108–0,137] | 0,128 [0,114–0,143] | 0,123 [0,109–0,138] | 0,561 [0,538–0,584] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,198 [0,181–0,217] | 0,358 [0,337–0,379] | 0,314 [0,293–0,334] | 0,702 [0,681–0,723] |
| prudente | 0,049 [0,040–0,060] | 0,181 [0,164–0,199] | 0,121 [0,107–0,137] | 0,632 [0,609–0,654] |
| risorse | 0,415 [0,394–0,437] | 0,758 [0,738–0,776] | 0,678 [0,657–0,698] | 0,931 [0,919–0,941] |
| com | 0,079 [0,068–0,092] | 0,191 [0,174–0,209] | 0,158 [0,142–0,175] | 0,598 [0,576–0,620] |

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
| aggressivo | 0,754 [0,734–0,774] | 0,811 [0,793–0,828] | 0,757 [0,738–0,776] | 0,915 [0,902–0,927] |
| prudente | 0,397 [0,374–0,420] | 0,518 [0,495–0,541] | 0,373 [0,351–0,396] | 0,755 [0,735–0,774] |
| risorse | 0,647 [0,624–0,669] | 0,731 [0,710–0,751] | 0,645 [0,623–0,667] | 0,870 [0,854–0,884] |
| com | 0,082 [0,070–0,095] | 0,067 [0,056–0,079] | 0,029 [0,023–0,038] | 0,365 [0,344–0,387] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,675 [0,652–0,696] | 0,822 [0,803–0,839] | 0,795 [0,775–0,813] | 0,990 [0,985–0,994] |
| prudente | 0,325 [0,302–0,348] | 0,390 [0,367–0,415] | 0,361 [0,337–0,385] | 0,894 [0,879–0,907] |
| risorse | 0,515 [0,491–0,538] | 0,651 [0,628–0,674] | 0,618 [0,594–0,641] | 0,960 [0,950–0,968] |
| com | 0,031 [0,024–0,039] | 0,025 [0,019–0,033] | 0,021 [0,015–0,028] | 0,314 [0,292–0,336] |

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
| aggressivo | 0,522 [0,496–0,547] | 0,427 [0,402–0,453] | 0,127 [0,111–0,145] | 0,656 [0,634–0,678] |
| prudente | 0,605 [0,580–0,629] | 0,497 [0,469–0,526] | 0,102 [0,087–0,118] | 0,783 [0,763–0,801] |
| risorse | 0,887 [0,870–0,902] | 0,902 [0,886–0,916] | 0,501 [0,473–0,529] | 0,786 [0,766–0,803] |
| com | 0,353 [0,332–0,376] | 0,224 [0,205–0,244] | 0,222 [0,204–0,242] | 0,509 [0,486–0,531] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,679 [0,656–0,701] | 0,833 [0,814–0,850] | 0,800 [0,780–0,819] | 0,986 [0,980–0,990] |
| prudente | 0,299 [0,277–0,321] | 0,344 [0,321–0,367] | 0,376 [0,353–0,399] | 0,953 [0,942–0,961] |
| risorse | 0,548 [0,524–0,572] | 0,702 [0,679–0,724] | 0,704 [0,682–0,726] | 0,992 [0,987–0,995] |
| com | 0,233 [0,214–0,253] | 0,289 [0,269–0,310] | 0,282 [0,261–0,303] | 0,619 [0,596–0,641] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,384 [0,361–0,408] | 0,805 [0,786–0,823] | 0,725 [0,704–0,746] | 0,951 [0,940–0,959] |
| prudente | 0,156 [0,140–0,173] | 0,491 [0,467–0,515] | 0,370 [0,347–0,394] | 0,928 [0,915–0,939] |
| risorse | 0,294 [0,273–0,316] | 0,752 [0,732–0,772] | 0,648 [0,625–0,671] | 0,974 [0,966–0,980] |
| com | 0,126 [0,112–0,142] | 0,301 [0,280–0,322] | 0,251 [0,231–0,271] | 0,632 [0,610–0,654] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,469 [0,433–0,506] | 0,659 [0,623–0,694] | 0,770 [0,740–0,797] | 0,995 [0,990–0,997] |
| prudente | 0,402 [0,367–0,438] | 0,512 [0,478–0,545] | 0,687 [0,657–0,716] | 0,992 [0,987–0,995] |
| risorse | 0,256 [0,227–0,287] | 0,339 [0,309–0,370] | 0,522 [0,491–0,554] | 0,992 [0,986–0,995] |
| com | 0,003 [0,001–0,007] | 0,008 [0,005–0,013] | 0,010 [0,006–0,016] | 0,514 [0,488–0,540] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,318 [0,295–0,341] | 0,922 [0,908–0,935] | 0,818 [0,798–0,837] | 0,986 [0,980–0,990] |
| prudente | 0,410 [0,385–0,435] | 0,898 [0,882–0,912] | 0,802 [0,781–0,821] | 0,994 [0,990–0,997] |
| risorse | 0,247 [0,227–0,269] | 0,804 [0,784–0,824] | 0,667 [0,642–0,691] | 0,990 [0,984–0,993] |
| com | 0,007 [0,004–0,011] | 0,045 [0,037–0,055] | 0,028 [0,021–0,036] | 0,646 [0,623–0,668] |

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
| starter-spazienzio | starter-spazienzio | 11,37 [11,33–11,40] | 11 | 7–16 | 3–22 | 0,036 [0,034–0,038] | 0 |
| starter-spazienzio | starter-mara | 11,15 [11,11–11,18] | 11 | 7–16 | 4–22 | 0,037 [0,035–0,039] | 0 |
| starter-spazienzio | starter-tossico | 12,96 [12,93–13,00] | 13 | 9–17 | 4–23 | 0,069 [0,066–0,072] | 0 |
| starter-spazienzio | starter-pino | 14,72 [14,69–14,75] | 15 | 11–18 | 6–24 | 0,069 [0,066–0,072] | 0 |
| starter-spazienzio | starter-gigi | 12,64 [12,61–12,67] | 12 | 9–17 | 4–23 | 0,044 [0,042–0,046] | 0 |
| starter-mara | starter-mara | 10,65 [10,61–10,68] | 10 | 7–15 | 5–22 | 0,047 [0,045–0,050] | 0 |
| starter-mara | starter-tossico | 12,13 [12,09–12,16] | 12 | 8–16 | 4–24 | 0,074 [0,071–0,077] | 0 |
| starter-mara | starter-pino | 14,11 [14,08–14,13] | 14 | 11–17 | 6–23 | 0,121 [0,118–0,125] | 0 |
| starter-mara | starter-gigi | 12,14 [12,11–12,17] | 12 | 9–15 | 7–22 | 0,042 [0,040–0,045] | 0 |
| starter-tossico | starter-tossico | 16,86 [16,82–16,90] | 18 | 12–20 | 3–28 | 0,199 [0,195–0,204] | 0 |
| starter-tossico | starter-pino | 15,67 [15,64–15,69] | 16 | 12–18 | 6–24 | 0,127 [0,123–0,130] | 0 |
| starter-tossico | starter-gigi | 14,16 [14,13–14,19] | 14 | 11–17 | 6–24 | 0,111 [0,107–0,114] | 0 |
| starter-pino | starter-pino | 16,87 [16,85–16,89] | 17 | 15–19 | 7–25 | 0,364 [0,359–0,370] | 0 |
| starter-pino | starter-gigi | 15,44 [15,42–15,46] | 15 | 13–18 | 9–24 | 0,151 [0,147–0,154] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,194 [0,189–0,198] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,443 [0,441–0,446] | 16,8% | 10,8% | 17,17 | 17 |
| starter-mara | 192000 | 0,510 [0,508–0,512] | 18,1% | 11,9% | 15,76 | 16 |
| starter-tossico | 192000 | 0,531 [0,529–0,534] | 52,1% | 44,2% | 16,08 | 16 |
| starter-pino | 192000 | 0,525 [0,523–0,528] | 81,8% | 76,0% | 14,78 | 14 |
| starter-gigi | 192000 | 0,497 [0,494–0,499] | 68,6% | 58,8% | 13,81 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,9 | 14,8 | 25 |
| starter-spazienzio | T | 1,9 | 3,5 | 0 |
| starter-spazienzio | L | 0,1 | 0,9 | 0 |
| starter-spazienzio | A | 26,2 | 17,6 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,9 | 4,1 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 3,1 | 12,3 | 15 |
| starter-tossico | V | 8,2 | 6,6 | 0 |
| starter-tossico | T | 10,4 | 18,1 | 10 |
| starter-tossico | L | 2,3 | 3,2 | 0 |
| starter-tossico | A | 11,7 | 11,9 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 0,9 | 3,0 | 0 |
| starter-pino | L | 0,2 | 4,0 | 5 |
| starter-pino | A | 0,2 | 0,1 | 0 |
| starter-gigi | V | 2,9 | 11,4 | 15 |
| starter-gigi | T | 0,7 | 2,2 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,1 | 25,4 | 10 |

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
| base.com.DentiStretti | 0,30 | 30,3% | 0,562 (+0,119) | 0,00 | 2,13 |
| base.com.MattoneDelCantiere | 0,44 | 44,1% | 0,515 (+0,071) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,2% | 0,300 (−0,143) | 0,10 | 2,58 |
| bruiser.ExtremelyViolentBlow | 0,85 | 64,3% | 0,429 (−0,014) | 1,63 | 1,42 |
| bruiser.Glare | 0,74 | 55,0% | 0,570 (+0,126) | 0,00 | 2,46 |
| bruiser.HealingBlow | 0,32 | 32,3% | 0,547 (+0,104) | 3,16 | 0,53 |
| bruiser.MadeOfStone | 1,04 | 70,9% | 0,483 (+0,039) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,09 | 78,6% | 0,475 (+0,032) | 1,58 | 1,03 |
| bruiser.SuperImpact | 0,59 | 54,8% | 0,581 (+0,138) | 5,01 | 0,60 |
| bruiser.YouStop | 0,45 | 33,3% | 0,289 (−0,154) | 1,42 | 2,54 |
| bruiser.character.LittleRage | 0,77 | 31,3% | 0,345 (−0,099) | 0,02 | 11,59 |
| bruiser.character.LittleSmack | 4,15 | 95,7% | 0,432 (−0,011) | 0,02 | 8,20 |
| com.basic.BruiserGrab | 0,87 | 68,0% | 0,345 (−0,099) | 5,71 | 5,78 |
| com.last.Struggle | 0,15 | 9,1% | 0,477 (+0,033) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,39 | 87,9% | 0,544 (+0,034) | 0,00 | 2,16 |
| base.com.SputoDaPosacenere | 1,23 | 83,9% | 0,558 (+0,048) | 0,74 | 1,28 |
| base.com.TartarugaSulMarciapiede | 0,25 | 24,6% | 0,290 (−0,220) | 0,80 | 2,93 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,2% | 0,556 (+0,046) | 0,73 | 1,26 |
| base.mara.PresoAlVolo | 1,51 | 79,3% | 0,469 (−0,041) | 2,45 | 7,85 |
| base.mara.Sgommata | 1,21 | 85,6% | 0,586 (+0,076) | 1,53 | 0,85 |
| base.mara.Slalom | 0,53 | 53,3% | 0,550 (+0,040) | 0,88 | 1,14 |
| base.mara.SorpassoInCurva | 1,31 | 83,5% | 0,533 (+0,023) | 0,00 | 3,50 |
| base.mara.TraDueParaurti | 0,49 | 35,5% | 0,307 (−0,203) | 1,20 | 4,32 |
| base.mara.bound.CambioMarcia | 0,74 | 32,9% | 0,314 (−0,196) | 0,04 | 11,02 |
| base.mara.bound.PassoStretto | 1,69 | 81,5% | 0,474 (−0,036) | 0,04 | 10,08 |
| com.Steal | 0,09 | 8,7% | 0,087 (−0,423) | 1,95 | 2,34 |
| com.last.Struggle | 0,13 | 8,8% | 0,552 (+0,042) | 0,00 | 1,07 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 64,4% | 0,532 (+0,001) | 0,00 | 1,97 |
| base.com.RincorsaDalMarciapiede | 1,56 | 91,5% | 0,557 (+0,026) | 0,25 | 1,06 |
| base.tossico.bound.RaschiareIlFondo | 0,85 | 32,3% | 0,406 (−0,125) | 0,13 | 13,80 |
| com.Grab | 0,37 | 32,7% | 0,450 (−0,081) | 1,44 | 3,60 |
| com.Steal | 0,09 | 9,5% | 0,310 (−0,221) | 0,85 | 2,32 |
| com.basic.ToxicGrab | 2,06 | 94,5% | 0,544 (+0,013) | 3,73 | 8,98 |
| junkie.AmphetamineReflexes | 0,51 | 40,0% | 0,424 (−0,107) | 3,98 | 2,89 |
| junkie.Cough | 1,15 | 76,8% | 0,613 (+0,082) | 2,75 | 1,38 |
| junkie.LethalHeroinDose | 0,89 | 39,6% | 0,517 (−0,014) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,37 | 85,7% | 0,550 (+0,019) | 2,62 | 0,74 |
| junkie.PervertedMetabolism | 1,15 | 73,1% | 0,493 (−0,038) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 10,0% | 0,610 (+0,079) | 1,49 | 1,70 |
| junkie.character.PatheticBlade | 4,03 | 97,9% | 0,535 (+0,004) | 0,13 | 10,62 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,31 | 78,6% | 0,501 (−0,024) | 0,00 | 4,43 |
| base.com.Spintone | 1,73 | 94,4% | 0,551 (+0,026) | 0,00 | 1,49 |
| base.pino.GoingBerserk | 1,75 | 94,9% | 0,554 (+0,029) | 0,00 | 1,12 |
| base.pino.IlBanconeRegge | 1,28 | 81,7% | 0,529 (+0,003) | 0,00 | 3,23 |
| base.pino.OffroIo | 0,15 | 13,0% | 0,140 (−0,385) | 3,69 | 1,31 |
| base.pino.QuestoLoFiniscoIo | 0,98 | 52,1% | 0,424 (−0,101) | 2,28 | 12,35 |
| base.pino.RuttoADistanzaSociale | 0,21 | 20,7% | 0,417 (−0,108) | 4,69 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,94 | 67,9% | 0,599 (+0,074) | 6,14 | 0,63 |
| base.pino.UltimoGiro | 1,69 | 70,4% | 0,626 (+0,100) | 0,00 | 0,52 |
| base.pino.bound.CinqueMinutiEVado | 1,06 | 37,9% | 0,336 (−0,189) | 0,19 | 14,37 |
| base.pino.bound.SpallataAlBancone | 4,08 | 99,1% | 0,528 (+0,002) | 0,19 | 11,34 |
| com.Grab | 0,44 | 37,9% | 0,402 (−0,124) | 0,87 | 4,01 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,534 (+0,037) | 5,80 | 0,84 |
| base.com.Spintone | 0,85 | 84,6% | 0,557 (+0,060) | 0,00 | 0,99 |
| base.gigi.ChiaveDaTredici | 1,62 | 92,4% | 0,531 (+0,034) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,7% | 0,554 (+0,057) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 75,0% | 0,575 (+0,078) | 1,05 | 1,01 |
| base.gigi.QuestoTornaUtile | 1,99 | 76,6% | 0,407 (−0,090) | 1,15 | 10,55 |
| base.gigi.SottoIlCofano | 0,33 | 32,7% | 0,309 (−0,187) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,61 | 97,3% | 0,494 (−0,003) | 0,15 | 9,92 |
| base.gigi.bound.UnaStrettaEPassa | 1,07 | 41,8% | 0,453 (−0,044) | 0,15 | 12,46 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,126 (−0,371) | 2,89 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,546 (+0,050) | 2,64 | 0,60 |
| com.Steal | 0,20 | 16,1% | 0,136 (−0,361) | 1,35 | 3,90 |
| com.last.Struggle | 0,95 | 52,1% | 0,626 (+0,130) | 0,00 | 0,65 |

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
| base.pino.bound.CinqueMinutiEVado | base.character.Pino | 8,50 | 7,38 | 0,00 → 0,00 | 5,00 | L +80 | **viola**: valore per uso 8,50 oltre il tetto 4,00 | più di una funzione |
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
