# Banco SB-7 — bozza.json [sb16e2-a]

> SB-16e matrix

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json [sb16e2-a]` |
| SHA-256 | `509395725af7c6fb1e7489ae414e9875f5f1c882515a6419678e98d193e601f1` |
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

480000 partite, 11296650 turni di giocatore controllati.

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
| starter-spazienzio | starter-pino | 32000 | 14476 | 15554 | 1970 | 0 | 0,482 [0,476–0,488] | 0,501 [0,496–0,507] |
| starter-spazienzio | starter-gigi | 32000 | 15793 | 15213 | 994 | 0 | 0,509 [0,504–0,515] | 0,507 [0,501–0,512] |
| starter-mara | starter-mara | 32000 | 15335 | 15589 | 1076 | 0 | 0,496 [0,490–0,501] | 0,504 [0,499–0,510] |
| starter-mara | starter-tossico | 32000 | 15933 | 14171 | 1896 | 0 | 0,529 [0,524–0,535] | 0,504 [0,498–0,510] |
| starter-mara | starter-pino | 32000 | 19868 | 9858 | 2274 | 0 | 0,668 [0,663–0,674] | 0,506 [0,500–0,511] |
| starter-mara | starter-gigi | 32000 | 17942 | 13458 | 600 | 0 | 0,571 [0,566–0,577] | 0,506 [0,500–0,511] |
| starter-tossico | starter-tossico | 32000 | 12445 | 12411 | 7144 | 0 | 0,501 [0,494–0,507] | 0,497 [0,491–0,503] |
| starter-tossico | starter-pino | 32000 | 20078 | 9124 | 2798 | 0 | 0,688 [0,682–0,693] | 0,499 [0,493–0,505] |
| starter-tossico | starter-gigi | 32000 | 17430 | 11962 | 2608 | 0 | 0,593 [0,587–0,599] | 0,501 [0,496–0,507] |
| starter-pino | starter-pino | 32000 | 13194 | 13240 | 5566 | 0 | 0,499 [0,493–0,505] | 0,487 [0,481–0,494] |
| starter-pino | starter-gigi | 32000 | 13813 | 15215 | 2972 | 0 | 0,476 [0,470–0,482] | 0,508 [0,502–0,513] |
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
| aggressivo | 0,349 [0,328–0,371] | 0,340 [0,319–0,362] | 0,372 [0,350–0,394] | 0,799 [0,781–0,817] |
| prudente | 0,179 [0,162–0,197] | 0,180 [0,162–0,199] | 0,181 [0,165–0,200] | 0,830 [0,812–0,847] |
| risorse | 0,610 [0,588–0,631] | 0,748 [0,728–0,767] | 0,640 [0,618–0,661] | 0,974 [0,966–0,980] |
| com | 0,233 [0,215–0,252] | 0,269 [0,250–0,290] | 0,221 [0,203–0,240] | 0,727 [0,706–0,746] |

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
| aggressivo | 0,767 [0,747–0,786] | 0,934 [0,922–0,944] | 0,716 [0,696–0,736] | 0,994 [0,989–0,997] |
| prudente | 0,750 [0,729–0,770] | 0,881 [0,864–0,896] | 0,704 [0,682–0,725] | 0,988 [0,983–0,992] |
| risorse | 0,704 [0,683–0,725] | 0,895 [0,880–0,908] | 0,682 [0,661–0,703] | 0,988 [0,982–0,992] |
| com | 0,070 [0,059–0,082] | 0,081 [0,070–0,094] | 0,050 [0,041–0,060] | 0,529 [0,506–0,552] |

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
| aggressivo | 0,750 [0,729–0,770] | 0,961 [0,951–0,969] | 0,745 [0,724–0,765] | 0,992 [0,987–0,995] |
| prudente | 0,527 [0,504–0,551] | 0,730 [0,709–0,751] | 0,454 [0,431–0,477] | 0,985 [0,979–0,990] |
| risorse | 0,716 [0,695–0,737] | 0,960 [0,951–0,968] | 0,763 [0,742–0,782] | 0,995 [0,991–0,998] |
| com | 0,188 [0,171–0,206] | 0,328 [0,307–0,350] | 0,192 [0,175–0,211] | 0,632 [0,609–0,653] |

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
| aggressivo | 0,488 [0,463–0,513] | 0,850 [0,829–0,869] | 0,453 [0,429–0,477] | 0,984 [0,978–0,989] |
| prudente | 0,138 [0,120–0,158] | 0,505 [0,471–0,538] | 0,131 [0,116–0,148] | 0,978 [0,971–0,984] |
| risorse | 0,542 [0,518–0,566] | 0,874 [0,857–0,889] | 0,502 [0,478–0,527] | 0,988 [0,982–0,992] |
| com | 0,014 [0,010–0,021] | 0,023 [0,017–0,031] | 0,011 [0,007–0,016] | 0,505 [0,481–0,530] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,317 [0,296–0,338] | 0,672 [0,649–0,693] | 0,578 [0,556–0,600] | 0,939 [0,928–0,949] |
| prudente | 0,127 [0,112–0,143] | 0,542 [0,516–0,568] | 0,288 [0,266–0,311] | 0,971 [0,963–0,978] |
| risorse | 0,351 [0,329–0,373] | 0,749 [0,728–0,769] | 0,567 [0,544–0,589] | 0,958 [0,948–0,966] |
| com | 0,008 [0,005–0,012] | 0,023 [0,017–0,031] | 0,022 [0,016–0,029] | 0,512 [0,489–0,535] |

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
| starter-spazienzio | starter-pino | 12,42 [12,38–12,46] | 13 | 8–17 | 2–23 | 0,062 [0,059–0,064] | 0 |
| starter-spazienzio | starter-gigi | 10,38 [10,35–10,42] | 10 | 7–15 | 2–22 | 0,031 [0,029–0,033] | 0 |
| starter-mara | starter-mara | 8,78 [8,75–8,82] | 8 | 5–13 | 2–22 | 0,034 [0,032–0,036] | 0 |
| starter-mara | starter-tossico | 10,93 [10,89–10,97] | 11 | 7–15 | 2–23 | 0,059 [0,057–0,062] | 0 |
| starter-mara | starter-pino | 11,28 [11,25–11,31] | 11 | 7–15 | 3–22 | 0,071 [0,068–0,074] | 0 |
| starter-mara | starter-gigi | 9,39 [9,37–9,42] | 9 | 6–13 | 3–22 | 0,019 [0,017–0,020] | 0 |
| starter-tossico | starter-tossico | 17,51 [17,47–17,55] | 19 | 12–21 | 3–28 | 0,223 [0,219–0,228] | 0 |
| starter-tossico | starter-pino | 13,71 [13,68–13,74] | 14 | 10–17 | 3–25 | 0,087 [0,084–0,091] | 0 |
| starter-tossico | starter-gigi | 12,38 [12,35–12,41] | 12 | 9–16 | 2–24 | 0,082 [0,079–0,085] | 0 |
| starter-pino | starter-pino | 14,69 [14,67–14,72] | 15 | 12–17 | 4–25 | 0,174 [0,170–0,178] | 0 |
| starter-pino | starter-gigi | 12,86 [12,83–12,89] | 13 | 9–16 | 4–23 | 0,093 [0,090–0,096] | 0 |
| starter-gigi | starter-gigi | 10,84 [10,82–10,87] | 11 | 8–14 | 4–22 | 0,082 [0,079–0,085] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,496 [0,493–0,498] | 9,0% | 5,8% | 17,21 | 17 |
| starter-mara | 192000 | 0,540 [0,538–0,542] | 9,6% | 6,4% | 15,26 | 15 |
| starter-tossico | 192000 | 0,551 [0,549–0,554] | 43,7% | 37,8% | 15,97 | 16 |
| starter-pino | 192000 | 0,438 [0,435–0,440] | 52,2% | 44,1% | 14,58 | 14 |
| starter-gigi | 192000 | 0,475 [0,472–0,477] | 33,2% | 24,6% | 13,46 | 14 |

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
| starter-pino | T | 0,7 | 2,5 | 0 |
| starter-pino | L | 0,3 | 5,0 | 5 |
| starter-pino | A | 20,1 | 14,3 | 0 |
| starter-gigi | V | 3,1 | 13,5 | 15 |
| starter-gigi | T | 0,8 | 2,1 | 0 |
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
| base.com.DentiStretti | 0,26 | 25,8% | 0,580 (+0,084) | 0,00 | 2,06 |
| base.com.MattoneDelCantiere | 0,38 | 37,6% | 0,546 (+0,050) | 1,82 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,56 | 38,3% | 0,401 (−0,095) | 0,05 | 2,54 |
| bruiser.ExtremelyViolentBlow | 0,72 | 56,9% | 0,449 (−0,047) | 1,47 | 1,32 |
| bruiser.Glare | 0,62 | 49,7% | 0,612 (+0,116) | 0,00 | 2,35 |
| bruiser.HealingBlow | 0,26 | 26,0% | 0,578 (+0,082) | 2,98 | 0,54 |
| bruiser.MadeOfStone | 0,92 | 65,8% | 0,536 (+0,040) | 0,00 | 1,97 |
| bruiser.SeagullFly | 0,92 | 70,8% | 0,520 (+0,024) | 1,46 | 0,95 |
| bruiser.SuperImpact | 0,66 | 58,2% | 0,637 (+0,141) | 4,44 | 0,59 |
| bruiser.YouStop | 0,41 | 31,1% | 0,362 (−0,134) | 1,26 | 2,29 |
| bruiser.character.LittleRage | 0,68 | 29,9% | 0,390 (−0,106) | 0,01 | 9,99 |
| bruiser.character.LittleSmack | 3,46 | 90,7% | 0,468 (−0,028) | 0,01 | 7,21 |
| com.basic.BruiserGrab | 0,76 | 62,3% | 0,403 (−0,093) | 5,10 | 4,81 |
| com.last.Struggle | 0,07 | 4,8% | 0,549 (+0,053) | 0,00 | 0,49 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,21 | 81,3% | 0,582 (+0,042) | 0,00 | 1,89 |
| base.com.SputoDaPosacenere | 1,18 | 81,2% | 0,594 (+0,054) | 0,21 | 1,21 |
| base.com.TartarugaSulMarciapiede | 0,26 | 26,0% | 0,450 (−0,090) | 0,20 | 2,81 |
| base.mara.CinghiataDiTraverso | 1,19 | 81,8% | 0,595 (+0,055) | 0,20 | 1,19 |
| base.mara.PresoAlVolo | 0,91 | 56,5% | 0,404 (−0,136) | 1,95 | 6,92 |
| base.mara.Sgommata | 1,22 | 86,7% | 0,620 (+0,080) | 0,59 | 0,88 |
| base.mara.Slalom | 0,22 | 21,6% | 0,409 (−0,131) | 0,00 | 3,93 |
| base.mara.SorpassoInCurva | 0,99 | 69,4% | 0,552 (+0,012) | 0,00 | 3,54 |
| base.mara.TraDueParaurti | 0,52 | 38,1% | 0,462 (−0,078) | 0,36 | 4,11 |
| base.mara.bound.CambioMarcia | 0,54 | 24,5% | 0,205 (−0,335) | 0,02 | 9,22 |
| base.mara.bound.PassoStretto | 1,39 | 72,7% | 0,495 (−0,045) | 0,02 | 8,37 |
| com.Steal | 0,08 | 8,1% | 0,126 (−0,414) | 1,22 | 2,47 |
| com.last.Struggle | 0,06 | 4,5% | 0,599 (+0,059) | 0,00 | 1,10 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,63 | 62,5% | 0,578 (+0,027) | 0,00 | 1,68 |
| base.com.RincorsaDalMarciapiede | 1,52 | 89,8% | 0,591 (+0,040) | 0,10 | 0,99 |
| base.tossico.bound.RaschiareIlFondo | 0,69 | 28,2% | 0,362 (−0,189) | 0,13 | 13,16 |
| com.Grab | 0,32 | 28,3% | 0,449 (−0,102) | 1,23 | 3,26 |
| com.Steal | 0,09 | 8,9% | 0,286 (−0,265) | 0,71 | 1,99 |
| com.basic.ToxicGrab | 1,75 | 89,0% | 0,575 (+0,024) | 3,26 | 8,98 |
| junkie.AmphetamineReflexes | 0,52 | 40,3% | 0,472 (−0,079) | 3,64 | 2,67 |
| junkie.Cough | 1,42 | 86,4% | 0,613 (+0,062) | 2,25 | 0,84 |
| junkie.LethalHeroinDose | 1,00 | 34,7% | 0,540 (−0,011) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 0,37 | 29,5% | 0,419 (−0,132) | 0,00 | 5,93 |
| junkie.PervertedMetabolism | 1,02 | 68,5% | 0,514 (−0,037) | 0,00 | 4,03 |
| junkie.ToxicBloodDrain | 0,10 | 9,6% | 0,563 (+0,012) | 1,26 | 1,48 |
| junkie.character.PatheticBlade | 4,56 | 97,5% | 0,559 (+0,008) | 0,13 | 9,29 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,15 | 73,1% | 0,420 (−0,017) | 0,00 | 3,84 |
| base.com.Spintone | 1,55 | 90,2% | 0,467 (+0,030) | 0,00 | 1,64 |
| base.pino.GoingBerserk | 1,66 | 93,4% | 0,467 (+0,029) | 0,00 | 1,20 |
| base.pino.IlBanconeRegge | 1,14 | 74,5% | 0,436 (−0,002) | 0,00 | 2,93 |
| base.pino.OffroIo | 0,76 | 50,4% | 0,425 (−0,012) | 0,00 | 3,60 |
| base.pino.QuestoLoFiniscoIo | 0,79 | 45,3% | 0,374 (−0,063) | 2,14 | 10,35 |
| base.pino.RuttoADistanzaSociale | 0,15 | 15,5% | 0,357 (−0,081) | 4,44 | 0,78 |
| base.pino.TestataDaUltimoGiro | 0,94 | 67,5% | 0,554 (+0,117) | 5,26 | 0,50 |
| base.pino.UltimoGiro | 0,74 | 38,8% | 0,577 (+0,139) | 0,00 | 0,51 |
| base.pino.bound.CinqueMinutiEVado | 0,90 | 35,1% | 0,257 (−0,181) | 0,09 | 12,29 |
| base.pino.bound.SpallataAlBancone | 3,13 | 94,7% | 0,440 (+0,002) | 0,09 | 10,06 |
| com.Grab | 0,37 | 31,9% | 0,379 (−0,059) | 0,85 | 3,58 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,88 | 79,3% | 0,520 (+0,046) | 3,64 | 0,83 |
| base.com.Spintone | 0,75 | 74,8% | 0,543 (+0,068) | 0,00 | 1,03 |
| base.gigi.ChiaveDaTredici | 1,41 | 88,1% | 0,519 (+0,044) | 0,98 | 1,23 |
| base.gigi.ColpoDiChiaveInglese | 0,40 | 40,3% | 0,530 (+0,055) | 0,00 | 3,11 |
| base.gigi.LavoroFattoBene | 0,70 | 70,2% | 0,559 (+0,084) | 0,71 | 1,05 |
| base.gigi.QuestoTornaUtile | 1,34 | 63,2% | 0,381 (−0,093) | 0,94 | 8,84 |
| base.gigi.SottoIlCofano | 0,31 | 31,3% | 0,377 (−0,098) | 1,20 | 2,07 |
| base.gigi.bound.ColpoDiCacciavite | 3,32 | 94,9% | 0,473 (−0,001) | 0,06 | 7,74 |
| base.gigi.bound.UnaStrettaEPassa | 0,80 | 37,9% | 0,405 (−0,069) | 0,06 | 10,25 |
| bruiser.BreakYourToy | 0,17 | 14,1% | 0,133 (−0,341) | 2,19 | 2,57 |
| bruiser.SeagullFly | 0,54 | 54,0% | 0,562 (+0,088) | 1,60 | 0,65 |
| com.Steal | 0,17 | 14,4% | 0,145 (−0,330) | 1,14 | 3,22 |
| com.last.Struggle | 0,32 | 20,0% | 0,632 (+0,157) | 0,00 | 0,78 |

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
