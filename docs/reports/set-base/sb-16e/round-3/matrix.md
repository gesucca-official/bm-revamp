# Banco SB-7 — bozza.json

> SB-16e matrix

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json` |
| SHA-256 | `83e59e4d7f652c22809decacae9893b1393411afdfe379c2f75111f6c6f32c98` |
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

480000 partite, 11293972 turni di giocatore controllati.

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
| starter-spazienzio | starter-tossico | 32000 | 13798 | 16377 | 1825 | 0 | 0,457 [0,452–0,463] | 0,498 [0,492–0,504] |
| starter-spazienzio | starter-pino | 32000 | 14651 | 15409 | 1940 | 0 | 0,487 [0,482–0,493] | 0,502 [0,496–0,507] |
| starter-spazienzio | starter-gigi | 32000 | 15793 | 15213 | 994 | 0 | 0,509 [0,504–0,515] | 0,507 [0,501–0,512] |
| starter-mara | starter-mara | 32000 | 15335 | 15589 | 1076 | 0 | 0,496 [0,490–0,501] | 0,504 [0,499–0,510] |
| starter-mara | starter-tossico | 32000 | 15933 | 14171 | 1896 | 0 | 0,529 [0,524–0,535] | 0,504 [0,498–0,510] |
| starter-mara | starter-pino | 32000 | 20029 | 9676 | 2295 | 0 | 0,674 [0,669–0,680] | 0,504 [0,499–0,510] |
| starter-mara | starter-gigi | 32000 | 17942 | 13458 | 600 | 0 | 0,571 [0,566–0,577] | 0,506 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 12445 | 12411 | 7144 | 0 | 0,501 [0,494–0,507] | 0,497 [0,491–0,503] |
| starter-tossico | starter-pino | 32000 | 20111 | 9086 | 2803 | 0 | 0,689 [0,683–0,694] | 0,499 [0,493–0,505] |
| starter-tossico | starter-gigi | 32000 | 17430 | 11962 | 2608 | 0 | 0,593 [0,587–0,599] | 0,501 [0,496–0,507] |
| starter-pino | starter-pino | 32000 | 13105 | 13204 | 5691 | 0 | 0,498 [0,492–0,504] | 0,490 [0,484–0,496] |
| starter-pino | starter-gigi | 32000 | 12977 | 15902 | 3121 | 0 | 0,449 [0,444–0,455] | 0,507 [0,501–0,513] |
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
| aggressivo | 0,352 [0,331–0,373] | 0,391 [0,370–0,414] | 0,347 [0,326–0,369] | 0,739 [0,719–0,758] |
| prudente | 0,112 [0,098–0,127] | 0,215 [0,197–0,235] | 0,091 [0,079–0,104] | 0,624 [0,601–0,646] |
| risorse | 0,681 [0,659–0,701] | 0,752 [0,732–0,771] | 0,704 [0,683–0,724] | 0,937 [0,925–0,947] |
| com | 0,248 [0,229–0,268] | 0,268 [0,248–0,288] | 0,212 [0,194–0,231] | 0,632 [0,610–0,654] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,354 [0,333–0,376] | 0,342 [0,321–0,364] | 0,369 [0,347–0,391] | 0,812 [0,794–0,829] |
| prudente | 0,182 [0,165–0,200] | 0,189 [0,171–0,208] | 0,167 [0,151–0,185] | 0,845 [0,828–0,861] |
| risorse | 0,615 [0,593–0,637] | 0,749 [0,729–0,768] | 0,658 [0,636–0,679] | 0,975 [0,967–0,981] |
| com | 0,237 [0,219–0,257] | 0,273 [0,254–0,294] | 0,238 [0,219–0,257] | 0,735 [0,715–0,755] |

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
| aggressivo | 0,696 [0,674–0,716] | 0,695 [0,674–0,716] | 0,668 [0,647–0,689] | 0,951 [0,940–0,960] |
| prudente | 0,475 [0,452–0,498] | 0,518 [0,495–0,541] | 0,418 [0,396–0,441] | 0,899 [0,885–0,912] |
| risorse | 0,588 [0,565–0,610] | 0,625 [0,603–0,647] | 0,566 [0,543–0,588] | 0,917 [0,904–0,929] |
| com | 0,049 [0,040–0,060] | 0,032 [0,025–0,041] | 0,029 [0,022–0,037] | 0,386 [0,364–0,408] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,775 [0,755–0,793] | 0,935 [0,923–0,945] | 0,716 [0,695–0,736] | 0,994 [0,990–0,997] |
| prudente | 0,753 [0,732–0,773] | 0,884 [0,868–0,899] | 0,707 [0,685–0,728] | 0,991 [0,986–0,994] |
| risorse | 0,716 [0,695–0,736] | 0,895 [0,881–0,908] | 0,731 [0,711–0,751] | 0,989 [0,983–0,993] |
| com | 0,073 [0,062–0,085] | 0,081 [0,070–0,094] | 0,052 [0,043–0,063] | 0,533 [0,510–0,555] |

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
| aggressivo | 0,489 [0,462–0,516] | 0,302 [0,279–0,327] | 0,168 [0,150–0,188] | 0,695 [0,673–0,716] |
| prudente | 0,692 [0,667–0,716] | 0,510 [0,482–0,538] | 0,272 [0,248–0,297] | 0,775 [0,756–0,793] |
| risorse | 0,845 [0,825–0,863] | 0,719 [0,694–0,743] | 0,503 [0,473–0,532] | 0,764 [0,744–0,783] |
| com | 0,308 [0,287–0,330] | 0,225 [0,206–0,244] | 0,252 [0,233–0,272] | 0,497 [0,475–0,520] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,759 [0,738–0,778] | 0,961 [0,951–0,969] | 0,752 [0,731–0,772] | 0,992 [0,988–0,995] |
| prudente | 0,536 [0,512–0,560] | 0,730 [0,709–0,751] | 0,460 [0,437–0,484] | 0,985 [0,979–0,990] |
| risorse | 0,722 [0,700–0,742] | 0,960 [0,951–0,968] | 0,749 [0,728–0,768] | 0,995 [0,991–0,998] |
| com | 0,185 [0,168–0,203] | 0,328 [0,307–0,350] | 0,186 [0,169–0,205] | 0,633 [0,611–0,654] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,444 [0,420–0,467] | 0,862 [0,846–0,878] | 0,720 [0,699–0,740] | 0,964 [0,955–0,972] |
| prudente | 0,319 [0,298–0,342] | 0,697 [0,675–0,718] | 0,511 [0,488–0,534] | 0,957 [0,947–0,965] |
| risorse | 0,406 [0,383–0,429] | 0,854 [0,837–0,870] | 0,680 [0,658–0,701] | 0,976 [0,969–0,982] |
| com | 0,077 [0,066–0,090] | 0,219 [0,201–0,239] | 0,152 [0,137–0,169] | 0,603 [0,580–0,625] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,484 [0,459–0,510] | 0,846 [0,824–0,865] | 0,433 [0,410–0,457] | 0,985 [0,979–0,990] |
| prudente | 0,140 [0,122–0,161] | 0,504 [0,470–0,537] | 0,110 [0,096–0,126] | 0,979 [0,971–0,984] |
| risorse | 0,562 [0,538–0,586] | 0,903 [0,888–0,916] | 0,493 [0,469–0,517] | 0,986 [0,980–0,990] |
| com | 0,013 [0,009–0,019] | 0,020 [0,014–0,027] | 0,011 [0,007–0,016] | 0,499 [0,474–0,524] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,291 [0,271–0,312] | 0,646 [0,624–0,669] | 0,571 [0,548–0,593] | 0,934 [0,922–0,944] |
| prudente | 0,127 [0,112–0,143] | 0,539 [0,513–0,565] | 0,288 [0,266–0,310] | 0,971 [0,963–0,978] |
| risorse | 0,269 [0,249–0,290] | 0,613 [0,589–0,637] | 0,468 [0,445–0,491] | 0,950 [0,940–0,959] |
| com | 0,007 [0,004–0,011] | 0,019 [0,014–0,026] | 0,020 [0,015–0,027] | 0,499 [0,476–0,523] |

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
| starter-spazienzio | starter-tossico | 11,89 [11,85–11,93] | 12 | 7–17 | 2–24 | 0,057 [0,055–0,060] | 0 |
| starter-spazienzio | starter-pino | 12,43 [12,39–12,47] | 13 | 8–17 | 2–23 | 0,061 [0,058–0,063] | 0 |
| starter-spazienzio | starter-gigi | 10,38 [10,35–10,42] | 10 | 7–15 | 2–22 | 0,031 [0,029–0,033] | 0 |
| starter-mara | starter-mara | 8,78 [8,75–8,82] | 8 | 5–13 | 2–22 | 0,034 [0,032–0,036] | 0 |
| starter-mara | starter-tossico | 10,93 [10,89–10,97] | 11 | 7–15 | 2–23 | 0,059 [0,057–0,062] | 0 |
| starter-mara | starter-pino | 11,28 [11,25–11,31] | 11 | 7–15 | 3–22 | 0,072 [0,069–0,075] | 0 |
| starter-mara | starter-gigi | 9,39 [9,37–9,42] | 9 | 6–13 | 3–22 | 0,019 [0,017–0,020] | 0 |
| starter-tossico | starter-tossico | 17,51 [17,47–17,55] | 19 | 12–21 | 3–28 | 0,223 [0,219–0,228] | 0 |
| starter-tossico | starter-pino | 13,70 [13,67–13,73] | 14 | 10–17 | 3–25 | 0,088 [0,085–0,091] | 0 |
| starter-tossico | starter-gigi | 12,38 [12,35–12,41] | 12 | 9–16 | 2–24 | 0,082 [0,079–0,085] | 0 |
| starter-pino | starter-pino | 14,68 [14,65–14,70] | 15 | 12–17 | 4–25 | 0,178 [0,174–0,182] | 0 |
| starter-pino | starter-gigi | 12,84 [12,81–12,87] | 13 | 9–16 | 4–23 | 0,098 [0,094–0,101] | 0 |
| starter-gigi | starter-gigi | 10,84 [10,82–10,87] | 11 | 8–14 | 4–22 | 0,082 [0,079–0,085] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,497 [0,494–0,499] | 9,0% | 5,8% | 17,21 | 17 |
| starter-mara | 192000 | 0,541 [0,539–0,543] | 9,7% | 6,5% | 15,26 | 15 |
| starter-tossico | 192000 | 0,551 [0,549–0,554] | 43,7% | 37,8% | 15,97 | 16 |
| starter-pino | 192000 | 0,431 [0,429–0,433] | 52,3% | 44,1% | 14,57 | 14 |
| starter-gigi | 192000 | 0,479 [0,476–0,481] | 33,2% | 24,6% | 13,46 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,5 | 14,5 | 25 |
| starter-spazienzio | T | 1,9 | 3,5 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 24,0 | 18,0 | 5 |
| starter-mara | V | 0,0 | 0,0 | 0 |
| starter-mara | T | 1,6 | 3,7 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 6,4 | 22,3 | 15 |
| starter-tossico | V | 8,2 | 5,9 | 0 |
| starter-tossico | T | 12,3 | 23,3 | 10 |
| starter-tossico | L | 1,3 | 3,0 | 0 |
| starter-tossico | A | 13,0 | 14,3 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 0,8 | 2,5 | 0 |
| starter-pino | L | 0,3 | 4,9 | 5 |
| starter-pino | A | 8,9 | 5,9 | 0 |
| starter-gigi | V | 3,1 | 13,6 | 15 |
| starter-gigi | T | 0,7 | 2,1 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,4 | 25,5 | 10 |

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
| base.com.DentiStretti | 0,26 | 25,8% | 0,582 (+0,085) | 0,00 | 2,06 |
| base.com.MattoneDelCantiere | 0,38 | 37,6% | 0,547 (+0,051) | 1,82 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,56 | 38,2% | 0,402 (−0,094) | 0,05 | 2,54 |
| bruiser.ExtremelyViolentBlow | 0,72 | 56,9% | 0,450 (−0,046) | 1,47 | 1,32 |
| bruiser.Glare | 0,62 | 49,7% | 0,613 (+0,116) | 0,00 | 2,35 |
| bruiser.HealingBlow | 0,26 | 26,0% | 0,580 (+0,084) | 2,98 | 0,54 |
| bruiser.MadeOfStone | 0,92 | 65,8% | 0,537 (+0,040) | 0,00 | 1,98 |
| bruiser.SeagullFly | 0,92 | 70,8% | 0,521 (+0,025) | 1,46 | 0,95 |
| bruiser.SuperImpact | 0,65 | 58,2% | 0,638 (+0,141) | 4,44 | 0,59 |
| bruiser.YouStop | 0,41 | 31,1% | 0,363 (−0,133) | 1,26 | 2,29 |
| bruiser.character.LittleRage | 0,68 | 29,9% | 0,391 (−0,106) | 0,01 | 9,99 |
| bruiser.character.LittleSmack | 3,46 | 90,7% | 0,469 (−0,027) | 0,01 | 7,21 |
| com.basic.BruiserGrab | 0,76 | 62,3% | 0,404 (−0,093) | 5,10 | 4,81 |
| com.last.Struggle | 0,07 | 4,8% | 0,556 (+0,059) | 0,00 | 0,48 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,21 | 81,3% | 0,583 (+0,042) | 0,00 | 1,89 |
| base.com.SputoDaPosacenere | 1,18 | 81,2% | 0,595 (+0,054) | 0,21 | 1,21 |
| base.com.TartarugaSulMarciapiede | 0,26 | 26,0% | 0,451 (−0,090) | 0,20 | 2,80 |
| base.mara.CinghiataDiTraverso | 1,19 | 81,7% | 0,596 (+0,055) | 0,20 | 1,19 |
| base.mara.PresoAlVolo | 0,92 | 56,5% | 0,406 (−0,135) | 1,95 | 6,92 |
| base.mara.Sgommata | 1,22 | 86,7% | 0,621 (+0,080) | 0,59 | 0,88 |
| base.mara.Slalom | 0,22 | 21,5% | 0,409 (−0,132) | 0,00 | 3,93 |
| base.mara.SorpassoInCurva | 0,99 | 69,4% | 0,554 (+0,013) | 0,00 | 3,54 |
| base.mara.TraDueParaurti | 0,52 | 38,0% | 0,462 (−0,079) | 0,37 | 4,12 |
| base.mara.bound.CambioMarcia | 0,54 | 24,5% | 0,206 (−0,335) | 0,02 | 9,22 |
| base.mara.bound.PassoStretto | 1,39 | 72,8% | 0,497 (−0,044) | 0,02 | 8,37 |
| com.Steal | 0,08 | 8,1% | 0,127 (−0,414) | 1,22 | 2,47 |
| com.last.Struggle | 0,06 | 4,5% | 0,603 (+0,062) | 0,00 | 1,10 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,62 | 62,5% | 0,578 (+0,027) | 0,00 | 1,68 |
| base.com.RincorsaDalMarciapiede | 1,52 | 89,8% | 0,592 (+0,040) | 0,10 | 0,99 |
| base.tossico.bound.RaschiareIlFondo | 0,69 | 28,2% | 0,362 (−0,189) | 0,13 | 13,16 |
| com.Grab | 0,32 | 28,3% | 0,450 (−0,102) | 1,23 | 3,26 |
| com.Steal | 0,09 | 8,9% | 0,286 (−0,265) | 0,71 | 1,99 |
| com.basic.ToxicGrab | 1,75 | 89,0% | 0,576 (+0,024) | 3,25 | 8,98 |
| junkie.AmphetamineReflexes | 0,52 | 40,2% | 0,472 (−0,079) | 3,64 | 2,67 |
| junkie.Cough | 1,42 | 86,3% | 0,614 (+0,062) | 2,25 | 0,84 |
| junkie.LethalHeroinDose | 1,00 | 34,7% | 0,541 (−0,011) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 0,37 | 29,5% | 0,418 (−0,133) | 0,00 | 5,93 |
| junkie.PervertedMetabolism | 1,02 | 68,5% | 0,514 (−0,037) | 0,00 | 4,03 |
| junkie.ToxicBloodDrain | 0,10 | 9,6% | 0,563 (+0,011) | 1,26 | 1,48 |
| junkie.character.PatheticBlade | 4,56 | 97,5% | 0,560 (+0,008) | 0,13 | 9,29 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,14 | 72,9% | 0,411 (−0,020) | 0,00 | 3,84 |
| base.com.Spintone | 1,55 | 90,3% | 0,460 (+0,029) | 0,00 | 1,53 |
| base.pino.GoingBerserk | 1,66 | 93,3% | 0,460 (+0,029) | 0,00 | 1,22 |
| base.pino.IlBanconeRegge | 1,14 | 74,7% | 0,428 (−0,003) | 0,00 | 2,96 |
| base.pino.OffroIo | 0,74 | 49,3% | 0,422 (−0,009) | 0,00 | 3,87 |
| base.pino.QuestoLoFiniscoIo | 0,78 | 44,2% | 0,362 (−0,069) | 2,12 | 10,37 |
| base.pino.RuttoADistanzaSociale | 0,16 | 15,8% | 0,354 (−0,077) | 4,43 | 0,79 |
| base.pino.TestataDaUltimoGiro | 0,96 | 67,9% | 0,543 (+0,112) | 5,15 | 0,49 |
| base.pino.UltimoGiro | 0,74 | 38,8% | 0,569 (+0,138) | 0,00 | 0,51 |
| base.pino.bound.CinqueMinutiEVado | 0,90 | 35,1% | 0,252 (−0,179) | 0,09 | 12,28 |
| base.pino.bound.SpallataAlBancone | 3,15 | 94,9% | 0,432 (+0,001) | 0,09 | 10,03 |
| com.Grab | 0,35 | 30,5% | 0,363 (−0,068) | 0,83 | 3,50 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,88 | 79,3% | 0,525 (+0,046) | 3,63 | 0,83 |
| base.com.Spintone | 0,75 | 74,7% | 0,548 (+0,069) | 0,00 | 1,03 |
| base.gigi.ChiaveDaTredici | 1,41 | 88,1% | 0,524 (+0,045) | 0,98 | 1,23 |
| base.gigi.ColpoDiChiaveInglese | 0,40 | 40,3% | 0,533 (+0,055) | 0,00 | 3,11 |
| base.gigi.LavoroFattoBene | 0,70 | 70,1% | 0,564 (+0,085) | 0,71 | 1,05 |
| base.gigi.QuestoTornaUtile | 1,34 | 63,2% | 0,386 (−0,093) | 0,94 | 8,84 |
| base.gigi.SottoIlCofano | 0,31 | 31,3% | 0,384 (−0,095) | 1,20 | 2,07 |
| base.gigi.bound.ColpoDiCacciavite | 3,32 | 94,9% | 0,478 (−0,001) | 0,06 | 7,73 |
| base.gigi.bound.UnaStrettaEPassa | 0,80 | 37,9% | 0,408 (−0,071) | 0,06 | 10,25 |
| bruiser.BreakYourToy | 0,17 | 14,1% | 0,134 (−0,345) | 2,19 | 2,57 |
| bruiser.SeagullFly | 0,54 | 54,0% | 0,567 (+0,088) | 1,60 | 0,65 |
| com.Steal | 0,17 | 14,4% | 0,146 (−0,333) | 1,13 | 3,22 |
| com.last.Struggle | 0,32 | 20,0% | 0,646 (+0,167) | 0,00 | 0,77 |

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
