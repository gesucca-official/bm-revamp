# Banco SB-7 — bozza.json

> SB-16b variante spareggio

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
| starter-spazienzio | starter-spazienzio | 32000 | 15770 | 15892 | 338 | 0 | 0,498 [0,493–0,504] | 0,501 [0,495–0,506] |
| starter-spazienzio | starter-mara | 32000 | 16849 | 14801 | 350 | 0 | 0,532 [0,527–0,538] | 0,509 [0,504–0,515] |
| starter-spazienzio | starter-tossico | 32000 | 15527 | 16214 | 259 | 0 | 0,489 [0,484–0,495] | 0,501 [0,496–0,507] |
| starter-spazienzio | starter-pino | 32000 | 13240 | 18485 | 275 | 0 | 0,417 [0,412–0,423] | 0,498 [0,493–0,504] |
| starter-spazienzio | starter-gigi | 32000 | 13448 | 18202 | 350 | 0 | 0,425 [0,419–0,430] | 0,508 [0,502–0,513] |
| starter-mara | starter-mara | 32000 | 15765 | 15792 | 443 | 0 | 0,500 [0,494–0,505] | 0,501 [0,495–0,506] |
| starter-mara | starter-tossico | 32000 | 16781 | 14923 | 296 | 0 | 0,529 [0,524–0,535] | 0,504 [0,498–0,509] |
| starter-mara | starter-pino | 32000 | 14242 | 17354 | 404 | 0 | 0,451 [0,445–0,456] | 0,503 [0,497–0,508] |
| starter-mara | starter-gigi | 32000 | 14885 | 16673 | 442 | 0 | 0,472 [0,466–0,477] | 0,508 [0,502–0,513] |
| starter-tossico | starter-tossico | 32000 | 15835 | 15544 | 621 | 0 | 0,505 [0,499–0,510] | 0,495 [0,489–0,500] |
| starter-tossico | starter-pino | 32000 | 17014 | 14591 | 395 | 0 | 0,538 [0,533–0,544] | 0,502 [0,496–0,507] |
| starter-tossico | starter-gigi | 32000 | 16290 | 15314 | 396 | 0 | 0,515 [0,510–0,521] | 0,503 [0,498–0,509] |
| starter-pino | starter-pino | 32000 | 15783 | 15321 | 896 | 0 | 0,507 [0,502–0,513] | 0,502 [0,496–0,507] |
| starter-pino | starter-gigi | 32000 | 17175 | 14254 | 571 | 0 | 0,546 [0,541–0,552] | 0,505 [0,499–0,510] |
| starter-gigi | starter-gigi | 32000 | 15702 | 15516 | 782 | 0 | 0,503 [0,497–0,509] | 0,503 [0,498–0,509] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,496 [0,474–0,518] | 0,521 [0,499–0,543] | 0,343 [0,322–0,364] | 0,613 [0,591–0,634] |
| prudente | 0,481 [0,459–0,503] | 0,490 [0,468–0,512] | 0,203 [0,186–0,221] | 0,543 [0,521–0,565] |
| risorse | 0,670 [0,649–0,690] | 0,791 [0,772–0,808] | 0,503 [0,481–0,524] | 0,801 [0,782–0,817] |
| com | 0,384 [0,363–0,405] | 0,445 [0,423–0,466] | 0,201 [0,184–0,219] | 0,487 [0,465–0,509] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,333 [0,313–0,354] | 0,449 [0,427–0,471] | 0,388 [0,367–0,410] | 0,804 [0,786–0,821] |
| prudente | 0,256 [0,237–0,276] | 0,489 [0,467–0,511] | 0,337 [0,316–0,358] | 0,831 [0,814–0,847] |
| risorse | 0,626 [0,604–0,647] | 0,818 [0,800–0,834] | 0,707 [0,687–0,727] | 0,979 [0,972–0,984] |
| com | 0,189 [0,173–0,207] | 0,359 [0,338–0,380] | 0,236 [0,218–0,255] | 0,710 [0,690–0,730] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,419 [0,397–0,441] | 0,424 [0,402–0,446] | 0,372 [0,351–0,394] | 0,691 [0,670–0,711] |
| prudente | 0,229 [0,211–0,248] | 0,290 [0,270–0,310] | 0,145 [0,130–0,161] | 0,586 [0,565–0,608] |
| risorse | 0,746 [0,727–0,765] | 0,815 [0,797–0,831] | 0,779 [0,760–0,797] | 0,900 [0,886–0,913] |
| com | 0,290 [0,271–0,310] | 0,317 [0,297–0,338] | 0,224 [0,206–0,242] | 0,591 [0,569–0,612] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,264 [0,245–0,284] | 0,231 [0,213–0,250] | 0,270 [0,251–0,290] | 0,797 [0,779–0,814] |
| prudente | 0,059 [0,050–0,071] | 0,032 [0,025–0,041] | 0,051 [0,042–0,062] | 0,752 [0,733–0,771] |
| risorse | 0,626 [0,605–0,647] | 0,683 [0,662–0,703] | 0,737 [0,718–0,756] | 0,990 [0,985–0,994] |
| com | 0,177 [0,161–0,195] | 0,171 [0,155–0,188] | 0,188 [0,171–0,206] | 0,654 [0,633–0,675] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,195 [0,178–0,213] | 0,367 [0,346–0,388] | 0,326 [0,306–0,347] | 0,698 [0,677–0,718] |
| prudente | 0,083 [0,071–0,096] | 0,259 [0,241–0,279] | 0,184 [0,168–0,202] | 0,654 [0,633–0,675] |
| risorse | 0,428 [0,407–0,450] | 0,786 [0,767–0,803] | 0,729 [0,709–0,748] | 0,934 [0,923–0,944] |
| com | 0,106 [0,093–0,120] | 0,241 [0,223–0,260] | 0,204 [0,187–0,223] | 0,600 [0,579–0,622] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,466–0,510] | 0,810 [0,793–0,827] | 0,642 [0,620–0,663] | 0,983 [0,977–0,988] |
| prudente | 0,197 [0,180–0,215] | 0,498 [0,476–0,520] | 0,297 [0,277–0,317] | 0,885 [0,870–0,899] |
| risorse | 0,355 [0,334–0,376] | 0,698 [0,677–0,718] | 0,496 [0,474–0,519] | 0,966 [0,957–0,973] |
| com | 0,019 [0,014–0,026] | 0,119 [0,105–0,134] | 0,040 [0,032–0,049] | 0,499 [0,477–0,521] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,762 [0,743–0,780] | 0,794 [0,776–0,811] | 0,755 [0,735–0,773] | 0,902 [0,888–0,914] |
| prudente | 0,362 [0,341–0,383] | 0,396 [0,375–0,418] | 0,277 [0,258–0,297] | 0,722 [0,701–0,741] |
| risorse | 0,659 [0,638–0,679] | 0,701 [0,681–0,721] | 0,632 [0,611–0,653] | 0,862 [0,847–0,877] |
| com | 0,117 [0,104–0,132] | 0,080 [0,069–0,093] | 0,040 [0,032–0,049] | 0,411 [0,390–0,433] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,625 [0,603–0,646] | 0,757 [0,738–0,776] | 0,734 [0,714–0,753] | 0,972 [0,964–0,978] |
| prudente | 0,156 [0,141–0,173] | 0,166 [0,151–0,184] | 0,151 [0,136–0,168] | 0,747 [0,728–0,766] |
| risorse | 0,468 [0,446–0,490] | 0,591 [0,569–0,612] | 0,540 [0,518–0,562] | 0,900 [0,886–0,912] |
| com | 0,037 [0,030–0,046] | 0,029 [0,023–0,037] | 0,025 [0,019–0,032] | 0,318 [0,298–0,339] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,382 [0,360–0,404] | 0,816 [0,798–0,832] | 0,717 [0,697–0,737] | 0,975 [0,967–0,981] |
| prudente | 0,117 [0,104–0,132] | 0,410 [0,388–0,432] | 0,290 [0,270–0,310] | 0,850 [0,834–0,865] |
| risorse | 0,277 [0,258–0,297] | 0,695 [0,674–0,715] | 0,560 [0,538–0,582] | 0,947 [0,937–0,956] |
| com | 0,013 [0,008–0,018] | 0,053 [0,044–0,064] | 0,034 [0,027–0,043] | 0,411 [0,390–0,433] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,520 [0,497–0,542] | 0,387 [0,366–0,409] | 0,145 [0,130–0,161] | 0,651 [0,630–0,672] |
| prudente | 0,633 [0,612–0,654] | 0,496 [0,474–0,519] | 0,182 [0,165–0,199] | 0,796 [0,777–0,813] |
| risorse | 0,853 [0,837–0,868] | 0,830 [0,813–0,846] | 0,497 [0,474–0,519] | 0,795 [0,777–0,812] |
| com | 0,364 [0,343–0,385] | 0,207 [0,190–0,226] | 0,213 [0,195–0,231] | 0,506 [0,484–0,528] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,528 [0,505–0,550] | 0,594 [0,573–0,616] | 0,604 [0,582–0,626] | 0,940 [0,929–0,950] |
| prudente | 0,306 [0,286–0,327] | 0,343 [0,322–0,364] | 0,376 [0,354–0,397] | 0,936 [0,924–0,946] |
| risorse | 0,547 [0,525–0,569] | 0,646 [0,625–0,667] | 0,646 [0,624–0,667] | 0,981 [0,974–0,986] |
| com | 0,184 [0,168–0,202] | 0,218 [0,200–0,237] | 0,225 [0,207–0,244] | 0,536 [0,514–0,558] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,317 [0,297–0,338] | 0,686 [0,665–0,706] | 0,600 [0,578–0,621] | 0,883 [0,868–0,896] |
| prudente | 0,184 [0,168–0,202] | 0,500 [0,478–0,522] | 0,405 [0,383–0,427] | 0,903 [0,889–0,915] |
| risorse | 0,305 [0,285–0,325] | 0,735 [0,715–0,754] | 0,643 [0,621–0,664] | 0,960 [0,951–0,968] |
| com | 0,104 [0,091–0,118] | 0,249 [0,230–0,268] | 0,205 [0,188–0,224] | 0,567 [0,545–0,589] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,501 [0,478–0,523] | 0,563 [0,540–0,585] | 0,663 [0,641–0,684] | 0,994 [0,990–0,997] |
| prudente | 0,475 [0,453–0,498] | 0,513 [0,491–0,536] | 0,635 [0,614–0,657] | 0,995 [0,991–0,997] |
| risorse | 0,376 [0,354–0,398] | 0,374 [0,353–0,396] | 0,507 [0,485–0,529] | 0,992 [0,988–0,995] |
| com | 0,001 [0,000–0,004] | 0,003 [0,001–0,007] | 0,007 [0,004–0,012] | 0,521 [0,499–0,543] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,288 [0,269–0,309] | 0,866 [0,850–0,881] | 0,729 [0,709–0,749] | 0,975 [0,968–0,981] |
| prudente | 0,288 [0,268–0,308] | 0,844 [0,828–0,860] | 0,717 [0,697–0,737] | 0,987 [0,981–0,991] |
| risorse | 0,210 [0,192–0,228] | 0,728 [0,708–0,748] | 0,582 [0,560–0,604] | 0,981 [0,974–0,986] |
| com | 0,000 [0,000–0,002] | 0,016 [0,011–0,022] | 0,009 [0,005–0,014] | 0,537 [0,515–0,559] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,466–0,511] | 0,938 [0,927–0,948] | 0,873 [0,857–0,887] | 0,989 [0,983–0,993] |
| prudente | 0,058 [0,049–0,069] | 0,515 [0,492–0,537] | 0,303 [0,283–0,324] | 0,943 [0,932–0,953] |
| risorse | 0,129 [0,115–0,144] | 0,708 [0,687–0,728] | 0,506 [0,484–0,529] | 0,968 [0,960–0,975] |
| com | 0,014 [0,010–0,020] | 0,062 [0,052–0,073] | 0,040 [0,032–0,050] | 0,509 [0,487–0,531] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,011 [0,009–0,012] | 0 |
| starter-spazienzio | starter-mara | 11,26 [11,23–11,30] | 11 | 7–16 | 4–22 | 0,011 [0,010–0,012] | 0 |
| starter-spazienzio | starter-tossico | 12,77 [12,73–12,80] | 13 | 8–17 | 4–23 | 0,008 [0,007–0,009] | 0 |
| starter-spazienzio | starter-pino | 14,27 [14,24–14,30] | 14 | 10–18 | 6–24 | 0,009 [0,008–0,010] | 0 |
| starter-spazienzio | starter-gigi | 12,61 [12,58–12,64] | 12 | 9–17 | 4–23 | 0,011 [0,010–0,012] | 0 |
| starter-mara | starter-mara | 11,28 [11,24–11,31] | 11 | 7–16 | 5–22 | 0,014 [0,013–0,015] | 0 |
| starter-mara | starter-tossico | 12,19 [12,15–12,22] | 12 | 8–17 | 4–24 | 0,009 [0,008–0,010] | 0 |
| starter-mara | starter-pino | 14,24 [14,21–14,27] | 14 | 11–17 | 6–23 | 0,013 [0,011–0,014] | 0 |
| starter-mara | starter-gigi | 12,32 [12,29–12,35] | 12 | 9–16 | 7–22 | 0,014 [0,013–0,015] | 0 |
| starter-tossico | starter-tossico | 16,60 [16,56–16,64] | 17 | 11–20 | 3–28 | 0,019 [0,018–0,021] | 0 |
| starter-tossico | starter-pino | 15,19 [15,16–15,22] | 16 | 12–18 | 5–24 | 0,012 [0,011–0,014] | 0 |
| starter-tossico | starter-gigi | 13,97 [13,94–14,00] | 14 | 10–17 | 5–23 | 0,012 [0,011–0,014] | 0 |
| starter-pino | starter-pino | 16,10 [16,08–16,12] | 16 | 15–18 | 7–24 | 0,028 [0,026–0,030] | 0 |
| starter-pino | starter-gigi | 15,10 [15,09–15,12] | 15 | 13–17 | 9–24 | 0,018 [0,016–0,019] | 0 |
| starter-gigi | starter-gigi | 13,85 [13,83–13,87] | 14 | 12–16 | 10–23 | 0,024 [0,023–0,026] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,477 [0,475–0,480] | 15,9% | 10,1% | 17,17 | 17 |
| starter-mara | 192000 | 0,487 [0,484–0,489] | 21,8% | 15,0% | 15,90 | 16 |
| starter-tossico | 192000 | 0,506 [0,504–0,508] | 49,4% | 41,5% | 16,06 | 16 |
| starter-pino | 192000 | 0,523 [0,521–0,526] | 77,9% | 70,8% | 14,70 | 14 |
| starter-gigi | 192000 | 0,507 [0,505–0,509] | 68,5% | 58,7% | 13,82 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 5,0 | 15,0 | 25 |
| starter-spazienzio | T | 2,2 | 3,4 | 0 |
| starter-spazienzio | L | 0,2 | 0,9 | 0 |
| starter-spazienzio | A | 24,6 | 17,0 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 2,2 | 4,2 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 1,1 | 8,9 | 15 |
| starter-tossico | V | 8,3 | 6,9 | 0 |
| starter-tossico | T | 10,6 | 17,4 | 10 |
| starter-tossico | L | 1,9 | 4,5 | 0 |
| starter-tossico | A | 11,3 | 12,0 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 1,2 | 2,3 | 0 |
| starter-pino | L | 0,2 | 3,7 | 5 |
| starter-pino | A | -20,0 | -41,7 | 0 |
| starter-gigi | V | 3,0 | 10,8 | 15 |
| starter-gigi | T | 1,0 | 2,0 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,1 | 26,0 | 10 |

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
| base.com.DentiStretti | 0,30 | 29,8% | 0,600 (+0,123) | 0,00 | 2,14 |
| base.com.MattoneDelCantiere | 0,44 | 43,9% | 0,552 (+0,075) | 1,88 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,60 | 39,1% | 0,348 (−0,129) | 0,10 | 2,57 |
| bruiser.ExtremelyViolentBlow | 0,84 | 64,0% | 0,462 (−0,015) | 1,61 | 1,41 |
| bruiser.Glare | 0,73 | 54,6% | 0,601 (+0,124) | 0,00 | 2,46 |
| bruiser.HealingBlow | 0,32 | 32,2% | 0,581 (+0,104) | 3,14 | 0,53 |
| bruiser.MadeOfStone | 1,03 | 70,6% | 0,521 (+0,043) | 0,00 | 2,31 |
| bruiser.SeagullFly | 1,08 | 78,5% | 0,509 (+0,032) | 1,57 | 1,02 |
| bruiser.SuperImpact | 0,59 | 54,6% | 0,622 (+0,144) | 4,94 | 0,60 |
| bruiser.YouStop | 0,45 | 33,2% | 0,336 (−0,142) | 1,41 | 2,53 |
| bruiser.character.LittleRage | 0,76 | 31,3% | 0,381 (−0,097) | 0,01 | 11,49 |
| bruiser.character.LittleSmack | 4,12 | 95,6% | 0,466 (−0,011) | 0,01 | 8,13 |
| com.basic.BruiserGrab | 0,87 | 67,5% | 0,386 (−0,091) | 5,66 | 5,73 |
| com.last.Struggle | 0,13 | 8,4% | 0,523 (+0,046) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,43 | 88,6% | 0,517 (+0,031) | 0,00 | 2,15 |
| base.com.SputoDaPosacenere | 1,24 | 83,5% | 0,531 (+0,044) | 0,88 | 1,23 |
| base.com.TartarugaSulMarciapiede | 0,25 | 25,0% | 0,253 (−0,233) | 0,88 | 2,84 |
| base.mara.CinghiataDiTraverso | 1,24 | 84,0% | 0,530 (+0,043) | 0,86 | 1,21 |
| base.mara.PresoAlVolo | 1,58 | 79,3% | 0,438 (−0,049) | 2,59 | 7,92 |
| base.mara.Sgommata | 1,09 | 83,0% | 0,560 (+0,074) | 2,02 | 0,84 |
| base.mara.Slalom | 0,53 | 52,7% | 0,520 (+0,033) | 1,00 | 1,07 |
| base.mara.SorpassoInCurva | 1,34 | 84,2% | 0,507 (+0,020) | 0,00 | 3,47 |
| base.mara.TraDueParaurti | 0,50 | 35,7% | 0,265 (−0,221) | 1,34 | 4,23 |
| base.mara.bound.CambioMarcia | 0,76 | 33,9% | 0,340 (−0,147) | 0,04 | 11,29 |
| base.mara.bound.PassoStretto | 1,88 | 83,6% | 0,454 (−0,033) | 0,04 | 10,17 |
| com.Steal | 0,09 | 8,7% | 0,099 (−0,388) | 1,98 | 2,26 |
| com.last.Struggle | 0,17 | 11,7% | 0,548 (+0,061) | 0,00 | 0,89 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,64 | 63,7% | 0,507 (+0,002) | 0,00 | 1,99 |
| base.com.RincorsaDalMarciapiede | 1,55 | 91,1% | 0,531 (+0,025) | 0,22 | 1,05 |
| base.tossico.bound.RaschiareIlFondo | 0,83 | 32,0% | 0,377 (−0,129) | 0,11 | 13,61 |
| com.Grab | 0,37 | 32,4% | 0,417 (−0,089) | 1,42 | 3,57 |
| com.Steal | 0,09 | 9,3% | 0,287 (−0,219) | 0,84 | 2,31 |
| com.basic.ToxicGrab | 2,04 | 94,3% | 0,517 (+0,011) | 3,67 | 8,85 |
| junkie.AmphetamineReflexes | 0,49 | 39,2% | 0,409 (−0,097) | 3,93 | 2,86 |
| junkie.Cough | 1,14 | 76,5% | 0,578 (+0,072) | 2,70 | 1,36 |
| junkie.LethalHeroinDose | 0,83 | 37,1% | 0,489 (−0,016) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 1,36 | 85,5% | 0,523 (+0,017) | 2,60 | 0,73 |
| junkie.PervertedMetabolism | 1,13 | 72,4% | 0,468 (−0,038) | 0,00 | 4,38 |
| junkie.ToxicBloodDrain | 0,10 | 9,8% | 0,554 (+0,048) | 1,48 | 1,70 |
| junkie.character.PatheticBlade | 3,98 | 97,6% | 0,511 (+0,005) | 0,11 | 10,46 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,32 | 78,9% | 0,504 (−0,020) | 0,00 | 4,21 |
| base.com.Spintone | 1,71 | 94,0% | 0,548 (+0,024) | 0,00 | 1,47 |
| base.pino.GoingBerserk | 1,74 | 94,4% | 0,550 (+0,027) | 0,00 | 1,10 |
| base.pino.IlBanconeRegge | 1,26 | 81,1% | 0,527 (+0,003) | 0,00 | 3,22 |
| base.pino.OffroIo | 0,15 | 12,7% | 0,162 (−0,361) | 3,64 | 1,29 |
| base.pino.QuestoLoFiniscoIo | 0,94 | 51,7% | 0,433 (−0,091) | 2,20 | 12,02 |
| base.pino.RuttoADistanzaSociale | 0,20 | 20,0% | 0,430 (−0,094) | 4,62 | 0,73 |
| base.pino.TestataDaUltimoGiro | 0,93 | 67,7% | 0,583 (+0,059) | 5,96 | 0,61 |
| base.pino.UltimoGiro | 1,43 | 65,2% | 0,632 (+0,109) | 0,00 | 0,45 |
| base.pino.bound.CinqueMinutiEVado | 1,02 | 37,5% | 0,344 (−0,179) | 0,14 | 14,01 |
| base.pino.bound.SpallataAlBancone | 4,02 | 98,9% | 0,526 (+0,003) | 0,14 | 11,01 |
| com.Grab | 0,44 | 37,5% | 0,406 (−0,117) | 0,86 | 3,99 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,80 | 75,5% | 0,543 (+0,036) | 5,74 | 0,84 |
| base.com.Spintone | 0,85 | 84,6% | 0,560 (+0,053) | 0,00 | 0,98 |
| base.gigi.ChiaveDaTredici | 1,62 | 92,4% | 0,537 (+0,030) | 1,43 | 1,26 |
| base.gigi.ColpoDiChiaveInglese | 0,85 | 84,7% | 0,557 (+0,050) | 0,00 | 1,18 |
| base.gigi.LavoroFattoBene | 0,75 | 75,1% | 0,575 (+0,068) | 1,04 | 1,00 |
| base.gigi.QuestoTornaUtile | 1,99 | 76,6% | 0,422 (−0,085) | 1,14 | 10,49 |
| base.gigi.SottoIlCofano | 0,33 | 32,5% | 0,331 (−0,176) | 1,21 | 1,79 |
| base.gigi.bound.ColpoDiCacciavite | 3,61 | 97,3% | 0,504 (−0,003) | 0,15 | 9,86 |
| base.gigi.bound.UnaStrettaEPassa | 1,07 | 41,8% | 0,471 (−0,036) | 0,15 | 12,40 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,148 (−0,359) | 2,88 | 2,80 |
| bruiser.SeagullFly | 0,50 | 49,7% | 0,552 (+0,045) | 2,61 | 0,61 |
| com.Steal | 0,20 | 16,1% | 0,162 (−0,345) | 1,35 | 3,90 |
| com.last.Struggle | 0,89 | 51,8% | 0,611 (+0,104) | 0,00 | 0,65 |

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
