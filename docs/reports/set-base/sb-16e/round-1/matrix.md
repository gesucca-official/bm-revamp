# Banco SB-7 — bozza.json

> SB-16e matrix

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json` |
| SHA-256 | `90c3672a2eb3f5441197c750d0d6e11f5e3c159827d5bce1ff75629677f30862` |
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

480000 partite, 12930290 turni di giocatore controllati.

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
| starter-spazienzio | starter-spazienzio | 32000 | 15300 | 15418 | 1282 | 0 | 0,498 [0,492–0,504] | 0,500 [0,494–0,505] |
| starter-spazienzio | starter-mara | 32000 | 15970 | 14754 | 1276 | 0 | 0,520 [0,514–0,525] | 0,507 [0,502–0,513] |
| starter-spazienzio | starter-tossico | 32000 | 10702 | 19470 | 1828 | 0 | 0,355 [0,349–0,360] | 0,501 [0,496–0,507] |
| starter-spazienzio | starter-pino | 32000 | 11722 | 18086 | 2192 | 0 | 0,393 [0,388–0,399] | 0,502 [0,496–0,507] |
| starter-spazienzio | starter-gigi | 32000 | 13634 | 16889 | 1477 | 0 | 0,447 [0,441–0,452] | 0,507 [0,501–0,513] |
| starter-mara | starter-mara | 32000 | 15291 | 15311 | 1398 | 0 | 0,500 [0,494–0,505] | 0,502 [0,496–0,508] |
| starter-mara | starter-tossico | 32000 | 11756 | 17913 | 2331 | 0 | 0,396 [0,391–0,402] | 0,502 [0,497–0,508] |
| starter-mara | starter-pino | 32000 | 15960 | 12407 | 3633 | 0 | 0,563 [0,557–0,568] | 0,506 [0,500–0,511] |
| starter-mara | starter-gigi | 32000 | 15218 | 15344 | 1438 | 0 | 0,498 [0,492–0,504] | 0,509 [0,503–0,515] |
| starter-tossico | starter-tossico | 32000 | 12575 | 12434 | 6991 | 0 | 0,503 [0,497–0,509] | 0,493 [0,487–0,499] |
| starter-tossico | starter-pino | 32000 | 21934 | 7006 | 3060 | 0 | 0,758 [0,753–0,763] | 0,499 [0,493–0,505] |
| starter-tossico | starter-gigi | 32000 | 19719 | 9309 | 2972 | 0 | 0,679 [0,674–0,685] | 0,498 [0,492–0,504] |
| starter-pino | starter-pino | 32000 | 11397 | 11275 | 9328 | 0 | 0,503 [0,496–0,509] | 0,476 [0,470–0,483] |
| starter-pino | starter-gigi | 32000 | 14009 | 13400 | 4591 | 0 | 0,511 [0,505–0,517] | 0,509 [0,504–0,515] |
| starter-gigi | starter-gigi | 32000 | 13912 | 13609 | 4479 | 0 | 0,506 [0,500–0,511] | 0,490 [0,485–0,496] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,465–0,510] | 0,458 [0,435–0,480] | 0,359 [0,338–0,381] | 0,602 [0,580–0,623] |
| prudente | 0,531 [0,508–0,553] | 0,496 [0,471–0,520] | 0,252 [0,233–0,272] | 0,567 [0,545–0,590] |
| risorse | 0,644 [0,623–0,665] | 0,719 [0,698–0,738] | 0,503 [0,481–0,525] | 0,806 [0,788–0,822] |
| com | 0,395 [0,374–0,417] | 0,438 [0,416–0,460] | 0,206 [0,189–0,224] | 0,510 [0,488–0,532] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,370 [0,349–0,392] | 0,318 [0,298–0,339] | 0,392 [0,371–0,414] | 0,838 [0,821–0,854] |
| prudente | 0,295 [0,274–0,316] | 0,297 [0,275–0,319] | 0,347 [0,325–0,368] | 0,888 [0,873–0,901] |
| risorse | 0,678 [0,657–0,698] | 0,671 [0,650–0,691] | 0,687 [0,666–0,707] | 0,981 [0,974–0,986] |
| com | 0,223 [0,205–0,242] | 0,252 [0,233–0,272] | 0,253 [0,234–0,273] | 0,783 [0,764–0,801] |

**starter-spazienzio contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,223 [0,205–0,242] | 0,270 [0,250–0,290] | 0,221 [0,204–0,240] | 0,643 [0,621–0,664] |
| prudente | 0,037 [0,029–0,046] | 0,098 [0,085–0,113] | 0,018 [0,013–0,025] | 0,493 [0,470–0,516] |
| risorse | 0,563 [0,540–0,585] | 0,635 [0,613–0,656] | 0,566 [0,543–0,588] | 0,871 [0,855–0,885] |
| com | 0,177 [0,161–0,195] | 0,200 [0,182–0,218] | 0,135 [0,120–0,151] | 0,543 [0,521–0,565] |

**starter-spazienzio contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,247 [0,229–0,267] | 0,203 [0,185–0,222] | 0,279 [0,259–0,300] | 0,706 [0,684–0,726] |
| prudente | 0,101 [0,088–0,115] | 0,041 [0,033–0,051] | 0,096 [0,084–0,111] | 0,755 [0,734–0,775] |
| risorse | 0,554 [0,531–0,576] | 0,558 [0,535–0,581] | 0,608 [0,585–0,630] | 0,972 [0,964–0,978] |
| com | 0,189 [0,172–0,208] | 0,156 [0,140–0,173] | 0,194 [0,176–0,212] | 0,641 [0,619–0,662] |

**starter-spazienzio contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,252 [0,233–0,272] | 0,355 [0,334–0,377] | 0,338 [0,318–0,359] | 0,730 [0,710–0,750] |
| prudente | 0,110 [0,096–0,125] | 0,262 [0,242–0,284] | 0,201 [0,184–0,220] | 0,771 [0,752–0,790] |
| risorse | 0,479 [0,457–0,501] | 0,733 [0,713–0,752] | 0,655 [0,633–0,675] | 0,944 [0,933–0,953] |
| com | 0,138 [0,124–0,154] | 0,249 [0,230–0,269] | 0,211 [0,194–0,230] | 0,687 [0,666–0,708] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,506 [0,484–0,528] | 0,648 [0,626–0,670] | 0,555 [0,532–0,577] | 0,978 [0,971–0,984] |
| prudente | 0,360 [0,339–0,382] | 0,494 [0,470–0,518] | 0,457 [0,434–0,479] | 0,960 [0,950–0,968] |
| risorse | 0,438 [0,416–0,460] | 0,546 [0,523–0,568] | 0,488 [0,466–0,510] | 0,964 [0,955–0,972] |
| com | 0,019 [0,014–0,026] | 0,039 [0,031–0,048] | 0,038 [0,030–0,047] | 0,504 [0,481–0,527] |

**starter-mara contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,500 [0,477–0,524] | 0,525 [0,502–0,548] | 0,535 [0,511–0,557] | 0,872 [0,857–0,887] |
| prudente | 0,236 [0,217–0,257] | 0,293 [0,272–0,315] | 0,202 [0,185–0,221] | 0,780 [0,761–0,799] |
| risorse | 0,411 [0,388–0,433] | 0,452 [0,430–0,475] | 0,381 [0,359–0,404] | 0,828 [0,810–0,844] |
| com | 0,026 [0,020–0,035] | 0,016 [0,012–0,023] | 0,009 [0,006–0,014] | 0,328 [0,307–0,349] |

**starter-mara contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,677 [0,655–0,699] | 0,778 [0,758–0,797] | 0,625 [0,602–0,647] | 0,990 [0,984–0,993] |
| prudente | 0,516 [0,490–0,541] | 0,560 [0,534–0,587] | 0,448 [0,423–0,473] | 0,975 [0,967–0,981] |
| risorse | 0,635 [0,613–0,657] | 0,702 [0,680–0,723] | 0,651 [0,629–0,673] | 0,986 [0,980–0,990] |
| com | 0,043 [0,035–0,053] | 0,022 [0,016–0,030] | 0,031 [0,024–0,040] | 0,385 [0,363–0,408] |

**starter-mara contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,329 [0,308–0,350] | 0,696 [0,675–0,716] | 0,600 [0,578–0,621] | 0,967 [0,958–0,974] |
| prudente | 0,390 [0,367–0,413] | 0,688 [0,665–0,710] | 0,569 [0,546–0,591] | 0,963 [0,953–0,970] |
| risorse | 0,264 [0,245–0,284] | 0,598 [0,576–0,620] | 0,488 [0,466–0,510] | 0,950 [0,939–0,959] |
| com | 0,011 [0,007–0,017] | 0,031 [0,024–0,040] | 0,028 [0,021–0,036] | 0,417 [0,394–0,440] |

**starter-tossico contro starter-tossico**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,503 [0,476–0,529] | 0,278 [0,255–0,302] | 0,135 [0,119–0,154] | 0,658 [0,636–0,679] |
| prudente | 0,710 [0,685–0,733] | 0,479 [0,451–0,507] | 0,253 [0,230–0,278] | 0,740 [0,720–0,759] |
| risorse | 0,873 [0,855–0,890] | 0,749 [0,724–0,772] | 0,504 [0,475–0,533] | 0,731 [0,710–0,750] |
| com | 0,355 [0,334–0,377] | 0,277 [0,257–0,298] | 0,283 [0,263–0,304] | 0,500 [0,478–0,522] |

**starter-tossico contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,915 [0,901–0,927] | 0,956 [0,946–0,965] | 0,885 [0,870–0,899] | 0,997 [0,993–0,999] |
| prudente | 0,695 [0,672–0,717] | 0,687 [0,664–0,709] | 0,631 [0,608–0,654] | 0,992 [0,987–0,995] |
| risorse | 0,887 [0,871–0,901] | 0,949 [0,937–0,958] | 0,881 [0,865–0,895] | 0,999 [0,997–1,000] |
| com | 0,306 [0,286–0,328] | 0,365 [0,343–0,387] | 0,286 [0,266–0,306] | 0,657 [0,635–0,678] |

**starter-tossico contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,591 [0,568–0,615] | 0,939 [0,927–0,949] | 0,840 [0,822–0,856] | 0,984 [0,978–0,989] |
| prudente | 0,422 [0,399–0,445] | 0,756 [0,735–0,775] | 0,591 [0,567–0,614] | 0,960 [0,950–0,968] |
| risorse | 0,547 [0,523–0,570] | 0,954 [0,943–0,962] | 0,830 [0,812–0,847] | 0,992 [0,988–0,995] |
| com | 0,147 [0,132–0,164] | 0,337 [0,316–0,359] | 0,255 [0,236–0,275] | 0,660 [0,638–0,681] |

**starter-pino contro starter-pino**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,505 [0,473–0,537] | 0,496 [0,462–0,531] | 0,458 [0,431–0,486] | 0,993 [0,988–0,996] |
| prudente | 0,516 [0,481–0,550] | 0,501 [0,467–0,534] | 0,373 [0,346–0,401] | 0,993 [0,988–0,996] |
| risorse | 0,550 [0,523–0,578] | 0,674 [0,646–0,700] | 0,510 [0,484–0,537] | 0,990 [0,985–0,994] |
| com | 0,005 [0,003–0,010] | 0,005 [0,002–0,009] | 0,006 [0,004–0,011] | 0,489 [0,464–0,515] |

**starter-pino contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,262 [0,241–0,284] | 0,712 [0,688–0,735] | 0,548 [0,524–0,572] | 0,961 [0,952–0,969] |
| prudente | 0,338 [0,314–0,362] | 0,859 [0,841–0,875] | 0,571 [0,545–0,597] | 0,991 [0,986–0,995] |
| risorse | 0,205 [0,186–0,225] | 0,721 [0,697–0,744] | 0,506 [0,482–0,531] | 0,972 [0,963–0,978] |
| com | 0,006 [0,003–0,010] | 0,030 [0,023–0,038] | 0,011 [0,007–0,017] | 0,586 [0,563–0,608] |

**starter-gigi contro starter-gigi**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,504 [0,478–0,530] | 0,919 [0,905–0,932] | 0,779 [0,759–0,797] | 0,991 [0,986–0,994] |
| prudente | 0,082 [0,069–0,096] | 0,522 [0,493–0,551] | 0,280 [0,258–0,303] | 0,973 [0,965–0,980] |
| risorse | 0,222 [0,203–0,241] | 0,742 [0,720–0,764] | 0,506 [0,482–0,529] | 0,967 [0,958–0,974] |
| com | 0,012 [0,008–0,018] | 0,040 [0,032–0,050] | 0,040 [0,032–0,050] | 0,522 [0,499–0,546] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,51 [11,47–11,55] | 11 | 7–17 | 2–22 | 0,040 [0,038–0,042] | 0 |
| starter-spazienzio | starter-mara | 11,20 [11,16–11,23] | 11 | 7–16 | 3–23 | 0,040 [0,038–0,042] | 0 |
| starter-spazienzio | starter-tossico | 13,14 [13,10–13,18] | 13 | 8–18 | 2–24 | 0,057 [0,055–0,060] | 0 |
| starter-spazienzio | starter-pino | 14,31 [14,28–14,34] | 14 | 10–18 | 4–24 | 0,069 [0,066–0,071] | 0 |
| starter-spazienzio | starter-gigi | 12,33 [12,29–12,36] | 12 | 9–17 | 3–23 | 0,046 [0,044–0,049] | 0 |
| starter-mara | starter-mara | 10,51 [10,47–10,54] | 10 | 7–15 | 3–23 | 0,044 [0,042–0,046] | 0 |
| starter-mara | starter-tossico | 12,43 [12,40–12,46] | 13 | 8–16 | 3–24 | 0,073 [0,070–0,076] | 0 |
| starter-mara | starter-pino | 13,49 [13,46–13,52] | 14 | 10–16 | 5–23 | 0,114 [0,110–0,117] | 0 |
| starter-mara | starter-gigi | 11,64 [11,62–11,67] | 12 | 9–15 | 4–23 | 0,045 [0,043–0,047] | 0 |
| starter-tossico | starter-tossico | 18,36 [18,32–18,41] | 20 | 12–22 | 2–29 | 0,218 [0,214–0,223] | 0 |
| starter-tossico | starter-pino | 15,08 [15,05–15,11] | 15 | 11–18 | 3–26 | 0,096 [0,092–0,099] | 0 |
| starter-tossico | starter-gigi | 13,80 [13,77–13,83] | 14 | 10–17 | 3–24 | 0,093 [0,090–0,096] | 0 |
| starter-pino | starter-pino | 16,48 [16,46–16,50] | 16 | 15–19 | 7–26 | 0,292 [0,287–0,297] | 0 |
| starter-pino | starter-gigi | 14,76 [14,73–14,78] | 15 | 12–17 | 7–24 | 0,143 [0,140–0,147] | 0 |
| starter-gigi | starter-gigi | 13,01 [12,99–13,03] | 13 | 11–15 | 6–23 | 0,140 [0,136–0,144] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 192000 | 0,453 [0,451–0,455] | 17,1% | 11,4% | 17,23 | 17 |
| starter-mara | 192000 | 0,489 [0,487–0,491] | 20,2% | 13,6% | 15,25 | 15 |
| starter-tossico | 192000 | 0,620 [0,618–0,622] | 54,8% | 47,4% | 15,92 | 16 |
| starter-pino | 192000 | 0,464 [0,462–0,466] | 76,0% | 69,0% | 14,69 | 14 |
| starter-gigi | 192000 | 0,478 [0,476–0,480] | 62,6% | 52,1% | 13,47 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 5,0 | 14,4 | 25 |
| starter-spazienzio | T | 2,2 | 4,3 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 24,9 | 17,6 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,9 | 4,7 | 0 |
| starter-mara | L | 0,0 | 0,1 | 0 |
| starter-mara | A | 5,7 | 19,7 | 15 |
| starter-tossico | V | 8,3 | 6,3 | 0 |
| starter-tossico | T | 13,8 | 29,8 | 10 |
| starter-tossico | L | 1,3 | 3,1 | 0 |
| starter-tossico | A | 11,9 | 12,3 | 10 |
| starter-pino | V | 0,0 | 0,0 | 0 |
| starter-pino | T | 0,8 | 3,6 | 0 |
| starter-pino | L | 0,2 | 4,3 | 5 |
| starter-pino | A | 1,2 | 1,0 | 0 |
| starter-gigi | V | 3,4 | 14,0 | 15 |
| starter-gigi | T | 0,7 | 2,9 | 0 |
| starter-gigi | L | 0,0 | 0,1 | 0 |
| starter-gigi | A | 27,4 | 25,3 | 10 |

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
| base.com.DentiStretti | 0,30 | 30,5% | 0,561 (+0,108) | 0,00 | 1,97 |
| base.com.MattoneDelCantiere | 0,42 | 41,7% | 0,502 (+0,049) | 1,96 | 0,58 |
| base.com.TartarugaSulMarciapiede | 0,63 | 41,8% | 0,356 (−0,097) | 0,09 | 2,66 |
| bruiser.ExtremelyViolentBlow | 0,80 | 61,8% | 0,419 (−0,034) | 1,64 | 1,39 |
| bruiser.Glare | 0,72 | 54,8% | 0,569 (+0,116) | 0,00 | 2,41 |
| bruiser.HealingBlow | 0,28 | 28,4% | 0,531 (+0,078) | 3,36 | 0,55 |
| bruiser.MadeOfStone | 1,05 | 71,6% | 0,494 (+0,041) | 0,00 | 2,04 |
| bruiser.SeagullFly | 1,03 | 76,3% | 0,473 (+0,020) | 1,62 | 1,03 |
| bruiser.SuperImpact | 0,71 | 61,3% | 0,581 (+0,128) | 5,41 | 0,63 |
| bruiser.YouStop | 0,46 | 34,0% | 0,324 (−0,129) | 1,37 | 2,32 |
| bruiser.character.LittleRage | 0,77 | 31,6% | 0,366 (−0,087) | 0,02 | 11,54 |
| bruiser.character.LittleSmack | 4,06 | 94,4% | 0,435 (−0,018) | 0,02 | 8,26 |
| com.basic.BruiserGrab | 0,93 | 72,5% | 0,376 (−0,077) | 6,00 | 5,40 |
| com.last.Struggle | 0,16 | 9,6% | 0,495 (+0,042) | 0,00 | 0,50 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,39 | 87,1% | 0,527 (+0,038) | 0,00 | 1,96 |
| base.com.SputoDaPosacenere | 1,31 | 85,8% | 0,536 (+0,047) | 0,39 | 1,29 |
| base.com.TartarugaSulMarciapiede | 0,29 | 29,2% | 0,378 (−0,111) | 0,40 | 2,83 |
| base.mara.CinghiataDiTraverso | 1,32 | 86,0% | 0,535 (+0,046) | 0,38 | 1,27 |
| base.mara.PresoAlVolo | 1,24 | 70,0% | 0,402 (−0,087) | 2,22 | 8,17 |
| base.mara.Sgommata | 1,34 | 89,3% | 0,547 (+0,058) | 0,96 | 0,95 |
| base.mara.Slalom | 0,28 | 28,2% | 0,407 (−0,082) | 0,00 | 4,01 |
| base.mara.SorpassoInCurva | 1,24 | 81,1% | 0,516 (+0,027) | 0,00 | 3,72 |
| base.mara.TraDueParaurti | 0,58 | 41,5% | 0,395 (−0,094) | 0,72 | 4,53 |
| base.mara.bound.CambioMarcia | 0,65 | 28,6% | 0,236 (−0,253) | 0,04 | 10,94 |
| base.mara.bound.PassoStretto | 1,74 | 83,2% | 0,466 (−0,023) | 0,04 | 9,84 |
| com.Steal | 0,09 | 9,1% | 0,102 (−0,387) | 1,40 | 2,39 |
| com.last.Struggle | 0,16 | 10,3% | 0,567 (+0,078) | 0,00 | 0,95 |

**starter-tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 0,66 | 66,5% | 0,638 (+0,018) | 0,00 | 1,73 |
| base.com.RincorsaDalMarciapiede | 1,59 | 91,5% | 0,652 (+0,032) | 0,17 | 1,03 |
| base.tossico.bound.RaschiareIlFondo | 0,72 | 27,6% | 0,405 (−0,215) | 0,21 | 14,26 |
| com.Grab | 0,35 | 30,8% | 0,512 (−0,108) | 1,26 | 3,63 |
| com.Steal | 0,09 | 9,3% | 0,337 (−0,283) | 0,75 | 2,10 |
| com.basic.ToxicGrab | 1,81 | 88,9% | 0,625 (+0,005) | 3,37 | 10,02 |
| junkie.AmphetamineReflexes | 0,65 | 48,5% | 0,543 (−0,077) | 3,21 | 2,77 |
| junkie.Cough | 1,50 | 88,1% | 0,670 (+0,050) | 2,10 | 0,89 |
| junkie.LethalHeroinDose | 1,41 | 43,9% | 0,594 (−0,026) | 0,00 | 0,77 |
| junkie.MethDrivenRage | 0,38 | 31,4% | 0,503 (−0,117) | 0,00 | 6,66 |
| junkie.PervertedMetabolism | 1,07 | 71,3% | 0,593 (−0,027) | 0,00 | 4,44 |
| junkie.ToxicBloodDrain | 0,11 | 10,7% | 0,657 (+0,037) | 1,14 | 1,75 |
| junkie.character.PatheticBlade | 4,84 | 98,0% | 0,625 (+0,005) | 0,21 | 10,15 |

**starter-pino**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.FasciaturaColFazzolettaccio | 1,26 | 77,7% | 0,451 (−0,013) | 0,00 | 4,23 |
| base.com.Spintone | 1,68 | 93,7% | 0,490 (+0,026) | 0,00 | 1,64 |
| base.pino.GoingBerserk | 1,75 | 94,9% | 0,489 (+0,025) | 0,00 | 1,15 |
| base.pino.IlBanconeRegge | 1,17 | 75,5% | 0,466 (+0,002) | 0,00 | 3,08 |
| base.pino.OffroIo | 0,78 | 50,5% | 0,404 (−0,060) | 0,00 | 4,87 |
| base.pino.QuestoLoFiniscoIo | 0,90 | 47,7% | 0,353 (−0,111) | 2,26 | 11,94 |
| base.pino.RuttoADistanzaSociale | 0,23 | 22,9% | 0,388 (−0,076) | 4,31 | 0,89 |
| base.pino.TestataDaUltimoGiro | 1,05 | 71,5% | 0,528 (+0,064) | 5,51 | 0,75 |
| base.pino.UltimoGiro | 1,41 | 62,2% | 0,579 (+0,115) | 0,00 | 0,55 |
| base.pino.bound.CinqueMinutiEVado | 0,99 | 36,3% | 0,259 (−0,205) | 0,17 | 13,94 |
| base.pino.bound.SpallataAlBancone | 3,48 | 97,8% | 0,467 (+0,003) | 0,17 | 11,45 |
| com.Grab | 0,40 | 34,3% | 0,361 (−0,103) | 0,85 | 3,79 |

**starter-gigi**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.MattoneDelCantiere | 0,93 | 81,9% | 0,516 (+0,039) | 4,82 | 0,91 |
| base.com.Spintone | 0,83 | 82,6% | 0,537 (+0,059) | 0,00 | 1,03 |
| base.gigi.ChiaveDaTredici | 1,59 | 92,2% | 0,510 (+0,032) | 1,17 | 1,34 |
| base.gigi.ColpoDiChiaveInglese | 0,48 | 48,1% | 0,534 (+0,056) | 0,00 | 3,04 |
| base.gigi.LavoroFattoBene | 0,77 | 77,5% | 0,547 (+0,069) | 0,83 | 1,09 |
| base.gigi.QuestoTornaUtile | 1,64 | 69,7% | 0,385 (−0,093) | 1,03 | 10,42 |
| base.gigi.SottoIlCofano | 0,36 | 36,2% | 0,365 (−0,113) | 1,37 | 2,09 |
| base.gigi.bound.ColpoDiCacciavite | 3,73 | 97,1% | 0,477 (−0,001) | 0,14 | 9,23 |
| base.gigi.bound.UnaStrettaEPassa | 0,96 | 41,9% | 0,428 (−0,050) | 0,14 | 12,00 |
| bruiser.BreakYourToy | 0,19 | 15,6% | 0,125 (−0,353) | 2,42 | 2,69 |
| bruiser.SeagullFly | 0,59 | 59,1% | 0,559 (+0,081) | 2,00 | 0,66 |
| com.Steal | 0,19 | 15,7% | 0,136 (−0,342) | 1,22 | 3,51 |
| com.last.Struggle | 0,84 | 44,4% | 0,611 (+0,133) | 0,00 | 0,69 |

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
