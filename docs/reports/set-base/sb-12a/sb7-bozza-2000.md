# Banco SB-7 — bozza.json

> SB-12a approvato: giro 3 e Cambio marcia +6 A (B2, decisione del proprietario)

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json` |
| SHA-256 | `bf7b97ce2b6f1ea039ff706d4d916ebe83a78d6e7972dd68fbe15d0fd8db0c39` |
| Formato | sb-6a/1: 20 carte, al massimo 2 copie, 2 bound |
| Banco | sb-7/1 |
| Mazzi | starter-spazienzio, starter-mara |
| Stili | aggressivo, prudente, risorse, com: 16 coppie |
| Semi | 7000000–7001999, posti alternati (semi pari: A gioca per primo) |
| Partite | 2000 per cella, 48 celle, 96000 in tutto |
| Tetto delle bound | 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33; 8 usi contro un manichino |
| Tempi | non qui: nel file `.tempi.txt` accanto, perché questo testo resti uguale a ogni esecuzione |

Quota = vittorie / (vittorie + sconfitte), patte e limite esclusi. Intervalli di Wilson al 95%: coprono solo l'errore di campionamento, **non i limiti dei bot**. Con molte celle, circa una su venti cade fuori per caso.

## Invarianti

96000 partite, 2167492 turni di giocatore controllati.

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
| tetto-bound | valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario | 0 bound su 6 |

## Matrice dei mazzi

Somma delle 16 coppie di stili, a pari peso.

| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |
|---|---|---:|---:|---:|---:|---:|---|---|
| starter-spazienzio | starter-spazienzio | 32000 | 13894 | 14063 | 4043 | 0 | 0,497 [0,491–0,503] | 0,501 [0,495–0,507] |
| starter-spazienzio | starter-mara | 32000 | 15071 | 13615 | 3314 | 0 | 0,525 [0,520–0,531] | 0,510 [0,504–0,515] |
| starter-mara | starter-mara | 32000 | 14449 | 14496 | 3055 | 0 | 0,499 [0,493–0,505] | 0,500 [0,495–0,506] |

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

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,486 [0,462–0,510] | 0,819 [0,801–0,836] | 0,663 [0,640–0,685] | 0,988 [0,983–0,992] |
| prudente | 0,188 [0,170–0,206] | 0,498 [0,474–0,523] | 0,288 [0,268–0,310] | 0,903 [0,889–0,916] |
| risorse | 0,339 [0,317–0,362] | 0,704 [0,682–0,724] | 0,492 [0,469–0,516] | 0,970 [0,961–0,976] |
| com | 0,014 [0,010–0,020] | 0,097 [0,084–0,111] | 0,030 [0,023–0,038] | 0,499 [0,475–0,522] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,126 [0,123–0,130] | 0 |
| starter-spazienzio | starter-mara | 11,26 [11,23–11,30] | 11 | 7–16 | 4–22 | 0,104 [0,100–0,107] | 0 |
| starter-mara | starter-mara | 11,28 [11,24–11,31] | 11 | 7–16 | 5–22 | 0,095 [0,092–0,099] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 96000 | 0,509 [0,505–0,512] | 10,5% | 6,5% | 17,28 | 17 |
| starter-mara | 96000 | 0,492 [0,488–0,495] | 16,3% | 11,6% | 16,08 | 16 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,7 | 16,0 | 25 |
| starter-spazienzio | T | 1,2 | 1,6 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 22,6 | 16,2 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,1 | 2,3 | 0 |
| starter-mara | L | 0,0 | 0,0 | 0 |
| starter-mara | A | 0,3 | 9,2 | 15 |

## Costo pagato in HEALTH

Morte pagando: il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore (R04: muore, e la mossa prosegue). «Senza uccidere»: l'avversario è ancora vivo a fine turno.

| mazzo | stile | partite | HEALTH spesa per partita | morti pagando | senza uccidere | sconfitte | patte |
|---|---|---:|---:|---:|---:|---:|---:|
| starter-spazienzio | aggressivo | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-spazienzio | prudente | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-spazienzio | risorse | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-spazienzio | com | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | aggressivo | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | prudente | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | risorse | 24000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-mara | com | 24000 | 0,00 | 0 | 0 | 0 | 0 |

## Carte

Per mazzo, su tutti gli stili. *Giocate*: scelte e pagate, anche se poi annullate. *Quota se giocata*: nelle partite in cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo. *Morta*: turni in mano senza essere una mossa legale; *ferma*: turni in mano, legale ma non scelta; entrambe per partita in cui la carta è stata in mano.

**starter-spazienzio**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.DentiStretti | 0,27 | 27,0% | 0,615 (+0,107) | 0,00 | 2,18 |
| base.com.MattoneDelCantiere | 0,41 | 41,5% | 0,596 (+0,088) | 1,82 | 0,59 |
| base.com.TartarugaSulMarciapiede | 0,56 | 37,6% | 0,410 (−0,098) | 0,10 | 2,49 |
| bruiser.ExtremelyViolentBlow | 0,79 | 61,1% | 0,489 (−0,019) | 1,53 | 1,35 |
| bruiser.Glare | 0,67 | 52,1% | 0,626 (+0,117) | 0,00 | 2,43 |
| bruiser.HealingBlow | 0,30 | 30,3% | 0,613 (+0,105) | 2,92 | 0,53 |
| bruiser.MadeOfStone | 0,95 | 67,0% | 0,567 (+0,058) | 0,00 | 2,26 |
| bruiser.SeagullFly | 1,01 | 75,5% | 0,554 (+0,046) | 1,49 | 0,98 |
| bruiser.SuperImpact | 0,56 | 52,5% | 0,674 (+0,166) | 4,42 | 0,58 |
| bruiser.YouStop | 0,42 | 31,5% | 0,388 (−0,121) | 1,35 | 2,49 |
| bruiser.character.LittleRage | 0,71 | 30,3% | 0,396 (−0,113) | 0,01 | 10,59 |
| bruiser.character.LittleSmack | 3,79 | 94,4% | 0,498 (−0,011) | 0,01 | 7,51 |
| com.basic.BruiserGrab | 0,80 | 62,9% | 0,434 (−0,075) | 5,12 | 5,39 |
| com.last.Struggle | 0,07 | 5,3% | 0,626 (+0,118) | 0,00 | 0,50 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,35 | 86,8% | 0,531 (+0,040) | 0,00 | 2,11 |
| base.com.SputoDaPosacenere | 1,15 | 80,9% | 0,548 (+0,056) | 0,88 | 1,17 |
| base.com.TartarugaSulMarciapiede | 0,23 | 22,9% | 0,280 (−0,212) | 0,88 | 2,74 |
| base.mara.CinghiataDiTraverso | 1,15 | 81,1% | 0,545 (+0,053) | 0,86 | 1,14 |
| base.mara.PresoAlVolo | 1,47 | 75,1% | 0,441 (−0,051) | 2,46 | 7,35 |
| base.mara.Sgommata | 1,03 | 80,8% | 0,582 (+0,090) | 1,84 | 0,79 |
| base.mara.Slalom | 0,49 | 49,3% | 0,529 (+0,038) | 0,96 | 1,04 |
| base.mara.SorpassoInCurva | 1,24 | 80,0% | 0,527 (+0,036) | 0,00 | 3,41 |
| base.mara.TraDueParaurti | 0,46 | 34,0% | 0,289 (−0,203) | 1,29 | 3,95 |
| base.mara.bound.CambioMarcia | 0,71 | 31,7% | 0,314 (−0,178) | 0,03 | 10,53 |
| base.mara.bound.PassoStretto | 1,80 | 79,9% | 0,464 (−0,028) | 0,03 | 9,44 |
| com.Steal | 0,07 | 7,4% | 0,098 (−0,393) | 2,14 | 2,05 |
| com.last.Struggle | 0,11 | 8,8% | 0,616 (+0,125) | 0,00 | 0,97 |

## Tetto delle bound

8 usi di fila contro un manichino da 1000 HEALTH; salute di tutti alzata a 1000. Valore per uso = danno inflitto (anche periodico) + danno parato su un colpo di prova da 10 HIT + salute propria + guadagni immediati pesati. Tetto: 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33.

| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |
|---|---|---:|---:|---|---:|---|---|---|
| base.mara.bound.CambioMarcia | base.character.Mara | 3,00 | 3,00 | 0,00 → 0,00 | 0,00 | A +48 | entro il tetto | — |
| base.mara.bound.ColpoDiStriscio | base.character.Mara | 2,67 | 2,67 | 2,00 → 2,00 | 0,00 | — | entro il tetto | — |
| base.mara.bound.PassoStretto | base.character.Mara | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| base.spazienzio.bound.TestaAlMuro | bruiser.character.BigBadBruiser | 3,00 | 3,00 | 0,00 → 0,00 | 0,00 | V +64 | entro il tetto | — |
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 3,75 | 3,75 | 0,00 → 0,00 | 0,00 | V +40 | entro il tetto | — |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |

## Limiti

- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.
- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.
- Il «+x» del catalogo è stimato 5 dai bot.
