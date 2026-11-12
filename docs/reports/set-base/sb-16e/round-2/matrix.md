# Banco SB-7 — bozza.json

> SB-16e matrix

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json` |
| SHA-256 | `1082b5cdd530ffee89afa954c37cb5d66d3cd2ac62f9f0cea2053176749099e0` |
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

480000 partite, 11320544 turni di giocatore controllati.

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
| starter-spazienzio | starter-tossico | 32000 | 21482 | 8922 | 1596 | 0 | 0,707 [0,701–0,712] | 0,503 [0,497–0,509] |
| starter-spazienzio | starter-pino | 32000 | 10813 | 19251 | 1936 | 0 | 0,360 [0,354–0,365] | 0,502 [0,496–0,507] |
| starter-spazienzio | starter-gigi | 32000 | 15793 | 15213 | 994 | 0 | 0,509 [0,504–0,515] | 0,507 [0,501–0,512] |
| starter-mara | starter-mara | 32000 | 15335 | 15589 | 1076 | 0 | 0,496 [0,490–0,501] | 0,504 [0,499–0,510] |
| starter-mara | starter-tossico | 32000 | 23960 | 6979 | 1061 | 0 | 0,774 [0,770–0,779] | 0,503 [0,497–0,508] |
| starter-mara | starter-pino | 32000 | 14323 | 13949 | 3728 | 0 | 0,507 [0,501–0,512] | 0,504 [0,498–0,510] |
| starter-mara | starter-gigi | 32000 | 17942 | 13458 | 600 | 0 | 0,571 [0,566–0,577] | 0,506 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 12329 | 12467 | 7204 | 0 | 0,497 [0,491–0,503] | 0,492 [0,486–0,499] |
| starter-tossico | starter-pino | 32000 | 10314 | 18389 | 3297 | 0 | 0,359 [0,354–0,365] | 0,499 [0,493–0,505] |
| starter-tossico | starter-gigi | 32000 | 8125 | 22024 | 1851 | 0 | 0,269 [0,265–0,275] | 0,497 [0,492–0,503] |
| starter-pino | starter-pino | 32000 | 11107 | 11312 | 9581 | 0 | 0,495 [0,489–0,502] | 0,488 [0,482–0,495] |
| starter-pino | starter-gigi | 32000 | 17864 | 10070 | 4066 | 0 | 0,640 [0,634–0,645] | 0,506 [0,501–0,512] |
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
| aggressivo | 0,637 [0,615–0,658] | 0,691 [0,669–0,711] | 0,653 [0,631–0,674] | 0,910 [0,896–0,922] |
| prudente | 0,425 [0,403–0,448] | 0,583 [0,560–0,606] | 0,423 [0,401–0,446] | 0,862 [0,846–0,877] |
| risorse | 0,908 [0,895–0,920] | 0,951 [0,941–0,960] | 0,915 [0,901–0,926] | 0,987 [0,981–0,991] |
| com | 0,471 [0,449–0,494] | 0,579 [0,557–0,601] | 0,439 [0,417–0,462] | 0,811 [0,793–0,828] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,237 [0,219–0,257] | 0,179 [0,163–0,197] | 0,257 [0,237–0,277] | 0,653 [0,630–0,674] |
| prudente | 0,076 [0,065–0,089] | 0,031 [0,024–0,040] | 0,086 [0,074–0,099] | 0,688 [0,666–0,710] |
| risorse | 0,513 [0,491–0,535] | 0,521 [0,498–0,544] | 0,565 [0,542–0,587] | 0,955 [0,945–0,963] |
| com | 0,158 [0,143–0,175] | 0,119 [0,105–0,134] | 0,171 [0,155–0,189] | 0,582 [0,560–0,605] |

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
| aggressivo | 0,949 [0,938–0,958] | 0,973 [0,964–0,979] | 0,950 [0,940–0,959] | 0,995 [0,991–0,997] |
| prudente | 0,892 [0,877–0,905] | 0,942 [0,931–0,952] | 0,890 [0,876–0,904] | 0,987 [0,981–0,991] |
| risorse | 0,878 [0,862–0,892] | 0,936 [0,924–0,946] | 0,873 [0,857–0,887] | 0,984 [0,978–0,989] |
| com | 0,175 [0,159–0,193] | 0,205 [0,187–0,223] | 0,127 [0,113–0,142] | 0,592 [0,570–0,614] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,606 [0,582–0,628] | 0,719 [0,697–0,740] | 0,557 [0,533–0,580] | 0,985 [0,979–0,990] |
| prudente | 0,390 [0,366–0,414] | 0,403 [0,377–0,430] | 0,355 [0,332–0,379] | 0,942 [0,930–0,951] |
| risorse | 0,559 [0,536–0,582] | 0,648 [0,625–0,671] | 0,589 [0,566–0,612] | 0,979 [0,971–0,984] |
| com | 0,030 [0,023–0,038] | 0,011 [0,007–0,016] | 0,022 [0,017–0,030] | 0,313 [0,292–0,334] |

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
| aggressivo | 0,492 [0,466–0,518] | 0,402 [0,377–0,429] | 0,206 [0,186–0,228] | 0,758 [0,738–0,777] |
| prudente | 0,598 [0,572–0,624] | 0,467 [0,438–0,495] | 0,227 [0,205–0,251] | 0,835 [0,817–0,851] |
| risorse | 0,782 [0,759–0,803] | 0,769 [0,745–0,791] | 0,506 [0,477–0,536] | 0,808 [0,789–0,825] |
| com | 0,245 [0,226–0,265] | 0,165 [0,149–0,183] | 0,200 [0,183–0,219] | 0,493 [0,471–0,516] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,317 [0,295–0,339] | 0,538 [0,512–0,564] | 0,340 [0,318–0,364] | 0,957 [0,947–0,965] |
| prudente | 0,071 [0,060–0,084] | 0,083 [0,071–0,096] | 0,050 [0,041–0,061] | 0,786 [0,766–0,804] |
| risorse | 0,281 [0,261–0,303] | 0,490 [0,465–0,514] | 0,334 [0,312–0,356] | 0,979 [0,972–0,985] |
| com | 0,051 [0,042–0,061] | 0,088 [0,076–0,102] | 0,045 [0,037–0,055] | 0,410 [0,388–0,433] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,092 [0,080–0,106] | 0,337 [0,315–0,359] | 0,237 [0,218–0,257] | 0,817 [0,799–0,834] |
| prudente | 0,032 [0,025–0,040] | 0,141 [0,126–0,158] | 0,082 [0,070–0,095] | 0,731 [0,711–0,751] |
| risorse | 0,074 [0,063–0,087] | 0,325 [0,304–0,347] | 0,225 [0,207–0,245] | 0,831 [0,813–0,847] |
| com | 0,006 [0,003–0,010] | 0,040 [0,032–0,050] | 0,027 [0,021–0,035] | 0,356 [0,335–0,378] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,469 [0,437–0,501] | 0,569 [0,534–0,604] | 0,400 [0,373–0,427] | 0,992 [0,987–0,995] |
| prudente | 0,433 [0,399–0,468] | 0,464 [0,427–0,502] | 0,232 [0,209–0,257] | 0,997 [0,994–0,999] |
| risorse | 0,587 [0,559–0,614] | 0,777 [0,753–0,800] | 0,491 [0,464–0,517] | 0,991 [0,986–0,994] |
| com | 0,004 [0,002–0,008] | 0,004 [0,002–0,007] | 0,005 [0,002–0,009] | 0,499 [0,474–0,525] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,438 [0,415–0,462] | 0,867 [0,850–0,883] | 0,723 [0,702–0,743] | 0,984 [0,977–0,988] |
| prudente | 0,506 [0,480–0,533] | 0,973 [0,964–0,980] | 0,845 [0,826–0,862] | 0,998 [0,995–0,999] |
| risorse | 0,414 [0,390–0,439] | 0,918 [0,904–0,931] | 0,724 [0,701–0,745] | 0,986 [0,980–0,991] |
| com | 0,027 [0,021–0,035] | 0,083 [0,072–0,097] | 0,039 [0,032–0,049] | 0,731 [0,710–0,751] |

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
| starter-spazienzio | starter-tossico | 10,30 [10,25–10,35] | 10 | 5–16 | 1–24 | 0,050 [0,048–0,052] | 0 |
| starter-spazienzio | starter-pino | 13,81 [13,78–13,85] | 14 | 10–18 | 4–23 | 0,061 [0,058–0,063] | 0 |
| starter-spazienzio | starter-gigi | 10,38 [10,35–10,42] | 10 | 7–15 | 2–22 | 0,031 [0,029–0,033] | 0 |
| starter-mara | starter-mara | 8,78 [8,75–8,82] | 8 | 5–13 | 2–22 | 0,034 [0,032–0,036] | 0 |
| starter-mara | starter-tossico | 9,13 [9,09–9,17] | 9 | 4–14 | 2–23 | 0,033 [0,031–0,035] | 0 |
| starter-mara | starter-pino | 13,21 [13,19–13,24] | 13 | 10–16 | 5–22 | 0,117 [0,113–0,120] | 0 |
| starter-mara | starter-gigi | 9,39 [9,37–9,42] | 9 | 6–13 | 3–22 | 0,019 [0,017–0,020] | 0 |
| starter-tossico | starter-tossico | 15,83 [15,78–15,87] | 17 | 10–20 | 3–27 | 0,225 [0,221–0,230] | 0 |
| starter-tossico | starter-pino | 14,22 [14,19–14,26] | 15 | 10–18 | 2–26 | 0,103 [0,100–0,106] | 0 |
| starter-tossico | starter-gigi | 10,81 [10,77–10,85] | 11 | 6–16 | 2–24 | 0,058 [0,055–0,060] | 0 |
| starter-pino | starter-pino | 16,69 [16,67–16,71] | 16 | 15–19 | 7–26 | 0,299 [0,294–0,304] | 0 |
| starter-pino | starter-gigi | 14,04 [14,02–14,07] | 14 | 11–16 | 6–23 | 0,127 [0,123–0,131] | 0 |
| starter-gigi | starter-gigi | 10,84 [10,82–10,87] | 11 | 8–14 | 4–22 | 0,082 [0,079–0,085] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,517 [0,515–0,519] | 9,7% | 6,2% | 17,21 | 17 |
| starter-mara | 192000 | 0,555 [0,553–0,558] | 10,6% | 6,8% | 15,32 | 15 |
| starter-tossico | 192000 | 0,348 [0,346–0,351] | 38,0% | 32,4% | 16,09 | 16 |
| starter-pino | 192000 | 0,575 [0,572–0,577] | 70,7% | 63,8% | 14,74 | 14 |
| starter-gigi | 192000 | 0,503 [0,501–0,505] | 33,5% | 25,5% | 13,48 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,5 | 14,7 | 25 |
| starter-spazienzio | T | 2,1 | 2,8 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 23,8 | 18,0 | 5 |
| starter-mara | V | 0,0 | 0,0 | 0 |
| starter-mara | T | 1,8 | 2,9 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 7,1 | 22,5 | 15 |
| starter-tossico | V | 8,3 | 5,6 | 0 |
| starter-tossico | T | 12,1 | 16,4 | 10 |
| starter-tossico | L | 1,3 | 2,6 | 0 |
| starter-tossico | A | 12,8 | 16,8 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 1,4 | 2,1 | 0 |
| starter-pino | L | 0,2 | 5,0 | 5 |
| starter-pino | A | 1,9 | 1,3 | 0 |
| starter-gigi | V | 3,1 | 14,0 | 15 |
| starter-gigi | T | 1,1 | 1,1 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,3 | 25,3 | 10 |

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
| base.com.DentiStretti | 0,26 | 25,6% | 0,586 (+0,069) | 0,00 | 2,06 |
| base.com.MattoneDelCantiere | 0,38 | 37,5% | 0,559 (+0,042) | 1,81 | 0,59 |
| base.com.TartarugaSulMarciapiede | 0,56 | 38,4% | 0,417 (−0,100) | 0,05 | 2,53 |
| bruiser.ExtremelyViolentBlow | 0,71 | 56,5% | 0,466 (−0,050) | 1,47 | 1,33 |
| bruiser.Glare | 0,62 | 49,6% | 0,616 (+0,100) | 0,00 | 2,35 |
| bruiser.HealingBlow | 0,26 | 26,1% | 0,590 (+0,073) | 2,98 | 0,55 |
| bruiser.MadeOfStone | 0,91 | 65,3% | 0,549 (+0,032) | 0,00 | 1,98 |
| bruiser.SeagullFly | 0,92 | 70,5% | 0,537 (+0,020) | 1,45 | 0,97 |
| bruiser.SuperImpact | 0,66 | 58,5% | 0,650 (+0,133) | 4,42 | 0,60 |
| bruiser.YouStop | 0,41 | 31,1% | 0,376 (−0,141) | 1,24 | 2,30 |
| bruiser.character.LittleRage | 0,68 | 29,8% | 0,402 (−0,114) | 0,01 | 9,95 |
| bruiser.character.LittleSmack | 3,43 | 89,9% | 0,486 (−0,031) | 0,01 | 7,20 |
| com.basic.BruiserGrab | 0,76 | 61,5% | 0,412 (−0,105) | 5,09 | 4,79 |
| com.last.Struggle | 0,08 | 5,2% | 0,538 (+0,021) | 0,00 | 0,50 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,20 | 80,8% | 0,592 (+0,036) | 0,00 | 1,90 |
| base.com.SputoDaPosacenere | 1,18 | 81,1% | 0,605 (+0,050) | 0,23 | 1,22 |
| base.com.TartarugaSulMarciapiede | 0,26 | 25,9% | 0,455 (−0,100) | 0,22 | 2,78 |
| base.mara.CinghiataDiTraverso | 1,18 | 81,6% | 0,607 (+0,052) | 0,22 | 1,20 |
| base.mara.PresoAlVolo | 0,94 | 56,6% | 0,411 (−0,144) | 1,97 | 6,89 |
| base.mara.Sgommata | 1,23 | 86,8% | 0,634 (+0,079) | 0,60 | 0,90 |
| base.mara.Slalom | 0,22 | 21,9% | 0,421 (−0,134) | 0,00 | 3,92 |
| base.mara.SorpassoInCurva | 0,99 | 68,5% | 0,558 (+0,003) | 0,00 | 3,55 |
| base.mara.TraDueParaurti | 0,52 | 37,6% | 0,463 (−0,093) | 0,39 | 4,14 |
| base.mara.bound.CambioMarcia | 0,55 | 24,8% | 0,214 (−0,341) | 0,02 | 9,23 |
| base.mara.bound.PassoStretto | 1,39 | 71,9% | 0,501 (−0,054) | 0,02 | 8,39 |
| com.Steal | 0,08 | 8,2% | 0,132 (−0,424) | 1,24 | 2,44 |
| com.last.Struggle | 0,07 | 4,7% | 0,565 (+0,010) | 0,00 | 1,15 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,62 | 61,7% | 0,400 (+0,051) | 0,00 | 1,39 |
| base.com.RincorsaDalMarciapiede | 1,43 | 86,0% | 0,394 (+0,046) | 0,07 | 0,97 |
| base.tossico.bound.RaschiareIlFondo | 0,60 | 25,7% | 0,225 (−0,123) | 0,07 | 12,01 |
| com.Grab | 0,29 | 26,4% | 0,312 (−0,036) | 1,28 | 3,04 |
| com.Steal | 0,08 | 7,9% | 0,182 (−0,166) | 0,71 | 2,00 |
| com.basic.ToxicGrab | 1,69 | 84,9% | 0,388 (+0,040) | 3,23 | 7,76 |
| junkie.AmphetamineReflexes | 0,44 | 34,6% | 0,286 (−0,062) | 3,93 | 2,40 |
| junkie.Cough | 1,25 | 79,8% | 0,421 (+0,073) | 2,56 | 0,82 |
| junkie.LethalHeroinDose | 0,64 | 29,3% | 0,489 (+0,141) | 0,00 | 0,65 |
| junkie.MethDrivenRage | 0,37 | 30,4% | 0,300 (−0,048) | 0,00 | 5,37 |
| junkie.PervertedMetabolism | 1,09 | 72,4% | 0,338 (−0,010) | 0,00 | 3,08 |
| junkie.ToxicBloodDrain | 0,08 | 8,1% | 0,400 (+0,052) | 1,46 | 1,33 |
| junkie.character.PatheticBlade | 4,10 | 94,8% | 0,365 (+0,016) | 0,07 | 8,52 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,19 | 74,1% | 0,559 (−0,016) | 0,00 | 4,29 |
| base.com.Spintone | 1,66 | 93,3% | 0,605 (+0,030) | 0,00 | 1,62 |
| base.pino.GoingBerserk | 1,74 | 94,8% | 0,606 (+0,031) | 0,00 | 1,14 |
| base.pino.IlBanconeRegge | 1,19 | 76,8% | 0,572 (−0,003) | 0,00 | 2,80 |
| base.pino.OffroIo | 0,79 | 50,9% | 0,506 (−0,069) | 0,00 | 4,35 |
| base.pino.QuestoLoFiniscoIo | 0,93 | 50,3% | 0,456 (−0,119) | 2,30 | 11,55 |
| base.pino.RuttoADistanzaSociale | 0,17 | 16,8% | 0,443 (−0,132) | 4,62 | 0,88 |
| base.pino.TestataDaUltimoGiro | 0,97 | 68,7% | 0,661 (+0,086) | 6,09 | 0,72 |
| base.pino.UltimoGiro | 1,26 | 57,0% | 0,676 (+0,101) | 0,00 | 0,59 |
| base.pino.bound.CinqueMinutiEVado | 1,01 | 37,2% | 0,337 (−0,238) | 0,16 | 13,60 |
| base.pino.bound.SpallataAlBancone | 3,45 | 97,0% | 0,577 (+0,002) | 0,16 | 11,17 |
| com.Grab | 0,41 | 35,0% | 0,456 (−0,119) | 0,85 | 3,43 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,88 | 79,4% | 0,548 (+0,045) | 3,59 | 0,84 |
| base.com.Spintone | 0,74 | 74,1% | 0,564 (+0,061) | 0,00 | 1,04 |
| base.gigi.ChiaveDaTredici | 1,40 | 87,8% | 0,544 (+0,041) | 0,96 | 1,24 |
| base.gigi.ColpoDiChiaveInglese | 0,40 | 39,6% | 0,537 (+0,034) | 0,00 | 3,11 |
| base.gigi.LavoroFattoBene | 0,70 | 69,6% | 0,580 (+0,078) | 0,71 | 1,05 |
| base.gigi.QuestoTornaUtile | 1,32 | 62,1% | 0,398 (−0,105) | 0,94 | 8,79 |
| base.gigi.SottoIlCofano | 0,31 | 30,9% | 0,392 (−0,111) | 1,16 | 2,09 |
| base.gigi.bound.ColpoDiCacciavite | 3,27 | 94,3% | 0,499 (−0,004) | 0,07 | 7,71 |
| base.gigi.bound.UnaStrettaEPassa | 0,80 | 37,5% | 0,414 (−0,089) | 0,07 | 10,18 |
| bruiser.BreakYourToy | 0,17 | 14,1% | 0,143 (−0,360) | 2,18 | 2,57 |
| bruiser.SeagullFly | 0,54 | 53,8% | 0,584 (+0,081) | 1,58 | 0,66 |
| com.Steal | 0,17 | 14,4% | 0,155 (−0,348) | 1,15 | 3,21 |
| com.last.Struggle | 0,36 | 20,9% | 0,597 (+0,094) | 0,00 | 0,80 |

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
