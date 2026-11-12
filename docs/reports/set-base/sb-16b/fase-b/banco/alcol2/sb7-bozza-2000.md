# Banco SB-7 — bozza.json

> SB-16b variante alcol2

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

480000 partite, 13250610 turni di giocatore controllati.

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
| starter-spazienzio | starter-spazienzio | 32000 | 15319 | 15513 | 1168 | 0 | 0,497 [0,491–0,502] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 15117 | 15692 | 1191 | 0 | 0,491 [0,485–0,496] | 0,509 [0,504–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 12510 | 17306 | 2184 | 0 | 0,420 [0,414–0,425] | 0,500 [0,494–0,506] |
| starter-spazienzio | starter-pino | 32000 | 7107 | 22926 | 1967 | 0 | 0,237 [0,232–0,241] | 0,497 [0,492–0,503] |
| starter-spazienzio | starter-gigi | 32000 | 12330 | 18211 | 1459 | 0 | 0,404 [0,398–0,409] | 0,508 [0,503–0,514] |
| starter-mara | starter-mara | 32000 | 15183 | 15298 | 1519 | 0 | 0,498 [0,493–0,504] | 0,499 [0,493–0,505] |
| starter-mara | starter-tossico | 32000 | 15879 | 13769 | 2352 | 0 | 0,536 [0,530–0,541] | 0,501 [0,496–0,507] |
| starter-mara | starter-pino | 32000 | 13312 | 14807 | 3881 | 0 | 0,473 [0,468–0,479] | 0,502 [0,496–0,508] |
| starter-mara | starter-gigi | 32000 | 14953 | 15694 | 1353 | 0 | 0,488 [0,482–0,494] | 0,505 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 12881 | 12597 | 6522 | 0 | 0,506 [0,499–0,512] | 0,492 [0,486–0,498] |
| starter-tossico | starter-pino | 32000 | 16163 | 11574 | 4263 | 0 | 0,583 [0,577–0,589] | 0,501 [0,496–0,507] |
| starter-tossico | starter-gigi | 32000 | 16502 | 12062 | 3436 | 0 | 0,578 [0,572–0,583] | 0,504 [0,498–0,510] |
| starter-pino | starter-pino | 32000 | 9774 | 9615 | 12611 | 0 | 0,504 [0,497–0,511] | 0,441 [0,434–0,448] |
| starter-pino | starter-gigi | 32000 | 20900 | 7003 | 4097 | 0 | 0,749 [0,744–0,754] | 0,505 [0,500–0,511] |
| starter-gigi | starter-gigi | 32000 | 13015 | 12786 | 6199 | 0 | 0,504 [0,498–0,511] | 0,502 [0,496–0,508] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,497 [0,474–0,519] | 0,532 [0,509–0,554] | 0,363 [0,342–0,384] | 0,636 [0,614–0,657] |
| prudente | 0,454 [0,432–0,477] | 0,497 [0,473–0,520] | 0,217 [0,199–0,236] | 0,546 [0,523–0,568] |
| risorse | 0,643 [0,621–0,664] | 0,780 [0,761–0,798] | 0,497 [0,475–0,519] | 0,818 [0,800–0,834] |
| com | 0,357 [0,335–0,378] | 0,442 [0,420–0,465] | 0,191 [0,174–0,209] | 0,481 [0,459–0,503] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,331 [0,311–0,352] | 0,397 [0,376–0,419] | 0,373 [0,352–0,395] | 0,805 [0,787–0,822] |
| prudente | 0,204 [0,186–0,223] | 0,315 [0,293–0,337] | 0,274 [0,254–0,294] | 0,818 [0,800–0,835] |
| risorse | 0,587 [0,565–0,608] | 0,758 [0,738–0,776] | 0,680 [0,659–0,700] | 0,971 [0,963–0,978] |
| com | 0,149 [0,134–0,165] | 0,270 [0,251–0,290] | 0,198 [0,181–0,216] | 0,688 [0,667–0,709] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,301 [0,281–0,322] | 0,407 [0,384–0,429] | 0,345 [0,324–0,366] | 0,604 [0,582–0,626] |
| prudente | 0,076 [0,065–0,089] | 0,196 [0,178–0,216] | 0,079 [0,067–0,092] | 0,443 [0,420–0,466] |
| risorse | 0,645 [0,623–0,666] | 0,804 [0,785–0,821] | 0,756 [0,736–0,775] | 0,865 [0,849–0,880] |
| com | 0,182 [0,165–0,200] | 0,284 [0,264–0,304] | 0,182 [0,165–0,200] | 0,514 [0,491–0,536] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,129 [0,115–0,145] | 0,111 [0,098–0,126] | 0,123 [0,109–0,139] | 0,381 [0,359–0,404] |
| prudente | 0,017 [0,013–0,024] | 0,010 [0,007–0,016] | 0,008 [0,005–0,013] | 0,213 [0,193–0,234] |
| risorse | 0,353 [0,332–0,374] | 0,414 [0,391–0,436] | 0,433 [0,410–0,456] | 0,918 [0,905–0,929] |
| com | 0,090 [0,078–0,104] | 0,102 [0,089–0,116] | 0,100 [0,088–0,114] | 0,426 [0,403–0,449] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,204 [0,187–0,223] | 0,363 [0,342–0,385] | 0,319 [0,299–0,340] | 0,704 [0,683–0,724] |
| prudente | 0,054 [0,045–0,065] | 0,190 [0,173–0,209] | 0,130 [0,115–0,146] | 0,636 [0,614–0,659] |
| risorse | 0,419 [0,397–0,441] | 0,760 [0,741–0,779] | 0,682 [0,661–0,702] | 0,932 [0,920–0,942] |
| com | 0,082 [0,070–0,095] | 0,195 [0,178–0,213] | 0,163 [0,147–0,180] | 0,600 [0,578–0,622] |

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
| aggressivo | 0,748 [0,727–0,767] | 0,811 [0,793–0,828] | 0,749 [0,729–0,768] | 0,902 [0,888–0,915] |
| prudente | 0,384 [0,361–0,407] | 0,518 [0,495–0,541] | 0,367 [0,345–0,389] | 0,731 [0,710–0,750] |
| risorse | 0,638 [0,616–0,660] | 0,731 [0,710–0,751] | 0,639 [0,617–0,661] | 0,860 [0,844–0,875] |
| com | 0,080 [0,069–0,093] | 0,067 [0,056–0,079] | 0,029 [0,023–0,038] | 0,352 [0,331–0,374] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,593 [0,570–0,616] | 0,774 [0,754–0,794] | 0,744 [0,723–0,765] | 0,986 [0,980–0,991] |
| prudente | 0,257 [0,237–0,279] | 0,329 [0,307–0,353] | 0,300 [0,278–0,323] | 0,835 [0,817–0,852] |
| risorse | 0,436 [0,412–0,459] | 0,596 [0,572–0,620] | 0,552 [0,528–0,576] | 0,935 [0,923–0,945] |
| com | 0,022 [0,016–0,029] | 0,023 [0,017–0,030] | 0,016 [0,011–0,022] | 0,251 [0,231–0,272] |

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
| aggressivo | 0,519 [0,493–0,544] | 0,445 [0,419–0,471] | 0,136 [0,119–0,154] | 0,651 [0,629–0,673] |
| prudente | 0,581 [0,555–0,606] | 0,497 [0,469–0,526] | 0,100 [0,086–0,117] | 0,772 [0,752–0,791] |
| risorse | 0,876 [0,858–0,891] | 0,909 [0,893–0,923] | 0,500 [0,471–0,528] | 0,777 [0,757–0,795] |
| com | 0,353 [0,331–0,375] | 0,234 [0,215–0,254] | 0,234 [0,216–0,254] | 0,509 [0,486–0,531] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,670 [0,647–0,693] | 0,833 [0,814–0,850] | 0,800 [0,780–0,819] | 0,988 [0,982–0,992] |
| prudente | 0,211 [0,192–0,231] | 0,276 [0,255–0,298] | 0,285 [0,264–0,307] | 0,905 [0,890–0,918] |
| risorse | 0,461 [0,437–0,485] | 0,633 [0,610–0,657] | 0,625 [0,601–0,648] | 0,986 [0,980–0,990] |
| com | 0,274 [0,254–0,295] | 0,354 [0,333–0,376] | 0,333 [0,312–0,355] | 0,629 [0,606–0,651] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,474 [0,450–0,498] | 0,837 [0,819–0,854] | 0,773 [0,752–0,792] | 0,962 [0,952–0,969] |
| prudente | 0,156 [0,140–0,173] | 0,491 [0,467–0,515] | 0,370 [0,347–0,394] | 0,928 [0,915–0,939] |
| risorse | 0,307 [0,286–0,330] | 0,761 [0,741–0,781] | 0,657 [0,634–0,679] | 0,975 [0,967–0,981] |
| com | 0,170 [0,154–0,188] | 0,352 [0,330–0,374] | 0,299 [0,279–0,320] | 0,664 [0,642–0,685] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,507 [0,471–0,543] | 0,712 [0,680–0,742] | 0,764 [0,735–0,791] | 0,969 [0,959–0,976] |
| prudente | 0,267 [0,238–0,298] | 0,530 [0,495–0,564] | 0,652 [0,621–0,682] | 0,940 [0,928–0,951] |
| risorse | 0,239 [0,212–0,269] | 0,364 [0,333–0,396] | 0,516 [0,483–0,548] | 0,941 [0,929–0,951] |
| com | 0,033 [0,026–0,042] | 0,060 [0,050–0,072] | 0,064 [0,054–0,077] | 0,521 [0,495–0,546] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,607 [0,583–0,631] | 0,980 [0,973–0,986] | 0,953 [0,942–0,962] | 0,991 [0,986–0,994] |
| prudente | 0,672 [0,648–0,695] | 0,959 [0,949–0,967] | 0,919 [0,905–0,931] | 0,996 [0,993–0,998] |
| risorse | 0,533 [0,508–0,558] | 0,935 [0,922–0,946] | 0,886 [0,870–0,901] | 0,993 [0,989–0,996] |
| com | 0,092 [0,079–0,105] | 0,333 [0,311–0,356] | 0,234 [0,215–0,254] | 0,802 [0,782–0,820] |

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
| starter-spazienzio | starter-spazienzio | 11,41 [11,37–11,45] | 11 | 7–16 | 3–22 | 0,037 [0,035–0,039] | 0 |
| starter-spazienzio | starter-mara | 11,16 [11,12–11,19] | 11 | 7–16 | 4–22 | 0,037 [0,035–0,039] | 0 |
| starter-spazienzio | starter-tossico | 13,03 [13,00–13,07] | 13 | 9–18 | 4–24 | 0,068 [0,066–0,071] | 0 |
| starter-spazienzio | starter-pino | 15,06 [15,03–15,09] | 15 | 11–19 | 6–25 | 0,061 [0,059–0,064] | 0 |
| starter-spazienzio | starter-gigi | 12,67 [12,64–12,70] | 13 | 9–17 | 4–23 | 0,046 [0,043–0,048] | 0 |
| starter-mara | starter-mara | 10,65 [10,61–10,68] | 10 | 7–15 | 5–22 | 0,047 [0,045–0,050] | 0 |
| starter-mara | starter-tossico | 12,15 [12,11–12,18] | 12 | 8–16 | 4–24 | 0,074 [0,071–0,076] | 0 |
| starter-mara | starter-pino | 14,30 [14,27–14,33] | 14 | 11–17 | 6–23 | 0,121 [0,118–0,125] | 0 |
| starter-mara | starter-gigi | 12,14 [12,11–12,17] | 12 | 9–15 | 7–22 | 0,042 [0,040–0,045] | 0 |
| starter-tossico | starter-tossico | 16,98 [16,95–17,02] | 18 | 12–20 | 3–28 | 0,204 [0,199–0,208] | 0 |
| starter-tossico | starter-pino | 16,02 [15,99–16,05] | 16 | 13–19 | 6–24 | 0,133 [0,130–0,137] | 0 |
| starter-tossico | starter-gigi | 14,22 [14,19–14,25] | 14 | 11–17 | 6–24 | 0,107 [0,104–0,111] | 0 |
| starter-pino | starter-pino | 17,66 [17,64–17,68] | 17 | 16–20 | 10–26 | 0,394 [0,389–0,399] | 0 |
| starter-pino | starter-gigi | 15,74 [15,72–15,76] | 15 | 14–19 | 9–25 | 0,128 [0,124–0,132] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,194 [0,189–0,198] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,426 [0,424–0,428] | 17,7% | 11,6% | 17,16 | 17 |
| starter-mara | 192000 | 0,501 [0,499–0,504] | 18,5% | 12,2% | 15,77 | 16 |
| starter-tossico | 192000 | 0,535 [0,533–0,538] | 53,7% | 45,8% | 16,09 | 16 |
| starter-pino | 192000 | 0,587 [0,585–0,590] | 84,8% | 79,9% | 14,84 | 14 |
| starter-gigi | 192000 | 0,465 [0,463–0,468] | 68,8% | 59,0% | 13,81 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,9 | 14,5 | 25 |
| starter-spazienzio | T | 1,9 | 3,5 | 0 |
| starter-spazienzio | L | 0,1 | 0,9 | 0 |
| starter-spazienzio | A | 26,2 | 17,9 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,9 | 4,1 | 0 |
| starter-mara | L | 0,0 | 0,0 | 0 |
| starter-mara | A | 3,1 | 12,2 | 15 |
| starter-tossico | V | 8,1 | 6,6 | 0 |
| starter-tossico | T | 10,6 | 18,0 | 10 |
| starter-tossico | L | 2,6 | 2,5 | 0 |
| starter-tossico | A | 11,5 | 11,7 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 0,9 | 3,6 | 0 |
| starter-pino | L | 0,2 | 3,5 | 5 |
| starter-pino | A | 0,2 | 0,1 | 0 |
| starter-gigi | V | 2,9 | 10,9 | 15 |
| starter-gigi | T | 0,7 | 2,1 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,1 | 25,6 | 10 |

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
| base.com.DentiStretti | 0,31 | 30,6% | 0,540 (+0,114) | 0,00 | 2,13 |
| base.com.MattoneDelCantiere | 0,44 | 44,3% | 0,492 (+0,066) | 1,89 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,3% | 0,288 (−0,138) | 0,10 | 2,59 |
| bruiser.ExtremelyViolentBlow | 0,85 | 64,4% | 0,410 (−0,016) | 1,64 | 1,42 |
| bruiser.Glare | 0,75 | 55,5% | 0,545 (+0,119) | 0,00 | 2,45 |
| bruiser.HealingBlow | 0,32 | 32,4% | 0,524 (+0,098) | 3,19 | 0,53 |
| bruiser.MadeOfStone | 1,04 | 71,1% | 0,462 (+0,036) | 0,00 | 2,32 |
| bruiser.SeagullFly | 1,09 | 78,7% | 0,455 (+0,029) | 1,59 | 1,03 |
| bruiser.SuperImpact | 0,60 | 55,0% | 0,560 (+0,134) | 5,06 | 0,60 |
| bruiser.YouStop | 0,45 | 33,5% | 0,276 (−0,150) | 1,42 | 2,54 |
| bruiser.character.LittleRage | 0,77 | 31,4% | 0,332 (−0,094) | 0,02 | 11,67 |
| bruiser.character.LittleSmack | 4,17 | 95,8% | 0,414 (−0,012) | 0,02 | 8,27 |
| com.basic.BruiserGrab | 0,88 | 68,3% | 0,329 (−0,097) | 5,76 | 5,82 |
| com.last.Struggle | 0,17 | 9,8% | 0,415 (−0,011) | 0,00 | 0,48 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,39 | 87,9% | 0,534 (+0,033) | 0,00 | 2,17 |
| base.com.SputoDaPosacenere | 1,24 | 83,9% | 0,548 (+0,047) | 0,75 | 1,28 |
| base.com.TartarugaSulMarciapiede | 0,25 | 24,7% | 0,281 (−0,220) | 0,81 | 2,93 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,2% | 0,547 (+0,045) | 0,74 | 1,26 |
| base.mara.PresoAlVolo | 1,52 | 79,5% | 0,460 (−0,042) | 2,46 | 7,86 |
| base.mara.Sgommata | 1,21 | 85,6% | 0,576 (+0,075) | 1,54 | 0,85 |
| base.mara.Slalom | 0,53 | 53,4% | 0,541 (+0,040) | 0,89 | 1,14 |
| base.mara.SorpassoInCurva | 1,31 | 83,6% | 0,524 (+0,022) | 0,00 | 3,50 |
| base.mara.TraDueParaurti | 0,49 | 35,5% | 0,298 (−0,203) | 1,21 | 4,33 |
| base.mara.bound.CambioMarcia | 0,74 | 33,0% | 0,308 (−0,193) | 0,04 | 11,06 |
| base.mara.bound.PassoStretto | 1,69 | 81,6% | 0,465 (−0,036) | 0,04 | 10,11 |
| com.Steal | 0,09 | 8,7% | 0,085 (−0,416) | 1,96 | 2,34 |
| com.last.Struggle | 0,14 | 9,1% | 0,529 (+0,027) | 0,00 | 1,06 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,65 | 65,0% | 0,535 (−0,001) | 0,00 | 1,95 |
| base.com.RincorsaDalMarciapiede | 1,57 | 91,6% | 0,559 (+0,024) | 0,26 | 1,07 |
| base.tossico.bound.RaschiareIlFondo | 0,86 | 32,3% | 0,424 (−0,111) | 0,14 | 13,91 |
| com.Grab | 0,38 | 32,9% | 0,465 (−0,070) | 1,45 | 3,62 |
| com.Steal | 0,09 | 9,5% | 0,336 (−0,199) | 0,86 | 2,33 |
| com.basic.ToxicGrab | 2,08 | 94,6% | 0,548 (+0,013) | 3,78 | 9,04 |
| junkie.AmphetamineReflexes | 0,51 | 40,4% | 0,431 (−0,104) | 4,01 | 2,90 |
| junkie.Cough | 1,15 | 76,9% | 0,616 (+0,081) | 2,79 | 1,39 |
| junkie.LethalHeroinDose | 0,94 | 41,2% | 0,523 (−0,012) | 0,00 | 0,78 |
| junkie.MethDrivenRage | 1,38 | 85,8% | 0,551 (+0,016) | 2,64 | 0,75 |
| junkie.PervertedMetabolism | 1,16 | 73,7% | 0,500 (−0,036) | 0,00 | 4,36 |
| junkie.ToxicBloodDrain | 0,10 | 10,1% | 0,634 (+0,099) | 1,50 | 1,70 |
| junkie.character.PatheticBlade | 4,04 | 98,0% | 0,539 (+0,004) | 0,14 | 10,72 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,30 | 78,1% | 0,563 (−0,024) | 0,00 | 4,67 |
| base.com.Spintone | 1,74 | 94,7% | 0,610 (+0,023) | 0,00 | 1,52 |
| base.pino.GoingBerserk | 1,76 | 95,2% | 0,613 (+0,026) | 0,00 | 1,14 |
| base.pino.IlBanconeRegge | 1,29 | 82,3% | 0,589 (+0,002) | 0,00 | 3,23 |
| base.pino.OffroIo | 0,15 | 13,2% | 0,200 (−0,387) | 3,74 | 1,32 |
| base.pino.QuestoLoFiniscoIo | 1,02 | 52,6% | 0,505 (−0,083) | 2,38 | 12,68 |
| base.pino.RuttoADistanzaSociale | 0,21 | 21,5% | 0,488 (−0,100) | 4,76 | 0,74 |
| base.pino.TestataDaUltimoGiro | 0,95 | 68,2% | 0,666 (+0,079) | 6,30 | 0,64 |
| base.pino.UltimoGiro | 1,98 | 75,3% | 0,648 (+0,060) | 0,00 | 0,61 |
| base.pino.bound.CinqueMinutiEVado | 1,09 | 38,2% | 0,420 (−0,167) | 0,27 | 14,71 |
| base.pino.bound.SpallataAlBancone | 4,14 | 99,2% | 0,589 (+0,001) | 0,27 | 11,67 |
| com.Grab | 0,45 | 38,2% | 0,480 (−0,108) | 0,88 | 4,02 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,501 (+0,036) | 5,85 | 0,84 |
| base.com.Spintone | 0,85 | 84,7% | 0,520 (+0,055) | 0,00 | 0,99 |
| base.gigi.ChiaveDaTredici | 1,62 | 92,4% | 0,497 (+0,031) | 1,44 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,8% | 0,518 (+0,053) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 75,0% | 0,537 (+0,072) | 1,06 | 1,01 |
| base.gigi.QuestoTornaUtile | 1,99 | 76,7% | 0,379 (−0,087) | 1,15 | 10,61 |
| base.gigi.SottoIlCofano | 0,33 | 32,8% | 0,285 (−0,181) | 1,20 | 1,78 |
| base.gigi.bound.ColpoDiCacciavite | 3,61 | 97,3% | 0,461 (−0,004) | 0,16 | 9,97 |
| base.gigi.bound.UnaStrettaEPassa | 1,07 | 41,8% | 0,430 (−0,036) | 0,16 | 12,52 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,118 (−0,347) | 2,89 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,513 (+0,047) | 2,66 | 0,60 |
| com.Steal | 0,20 | 16,1% | 0,128 (−0,337) | 1,35 | 3,90 |
| com.last.Struggle | 1,00 | 52,3% | 0,566 (+0,101) | 0,00 | 0,65 |

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
| base.pino.bound.CinqueMinutiEVado | base.character.Pino | 13,50 | 11,00 | 0,00 → 0,00 | 10,00 | L +80 | **viola**: valore per uso 13,50 oltre il tetto 4,00 | para tutto il colpo di prova, più di una funzione |
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
