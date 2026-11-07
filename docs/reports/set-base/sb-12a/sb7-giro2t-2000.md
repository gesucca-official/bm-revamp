# Banco SB-7 — giro2t.json

> SB-12a, giro 2: giro 1 e salute iniziale -15 a entrambi (Spazienzio 85, Mara 80)

| Voce | Valore |
|---|---|
| Bozza | `tmp/sim/sb12a/giro2t.json` |
| SHA-256 | `a53bac95c81708d99c8c68cf8dd4155f1d5f576441dd25607b1fea5ab45eb158` |
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

96000 partite, 2132496 turni di giocatore controllati.

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
| starter-spazienzio | starter-mara | 32000 | 14376 | 14381 | 3243 | 0 | 0,500 [0,494–0,506] | 0,510 [0,504–0,515] |
| starter-mara | starter-mara | 32000 | 14383 | 14449 | 3168 | 0 | 0,499 [0,493–0,505] | 0,501 [0,495–0,507] |

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
| aggressivo | 0,294 [0,274–0,316] | 0,422 [0,400–0,445] | 0,361 [0,339–0,384] | 0,802 [0,783–0,819] |
| prudente | 0,213 [0,194–0,232] | 0,458 [0,434–0,483] | 0,282 [0,261–0,303] | 0,827 [0,808–0,843] |
| risorse | 0,567 [0,543–0,590] | 0,786 [0,767–0,804] | 0,670 [0,648–0,692] | 0,971 [0,963–0,978] |
| com | 0,136 [0,121–0,152] | 0,307 [0,286–0,328] | 0,180 [0,163–0,198] | 0,685 [0,663–0,706] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,487 [0,463–0,511] | 0,820 [0,801–0,837] | 0,653 [0,630–0,675] | 0,983 [0,977–0,988] |
| prudente | 0,187 [0,170–0,206] | 0,486 [0,461–0,510] | 0,272 [0,252–0,292] | 0,877 [0,862–0,892] |
| risorse | 0,343 [0,321–0,365] | 0,738 [0,717–0,758] | 0,501 [0,477–0,525] | 0,965 [0,956–0,973] |
| com | 0,018 [0,013–0,025] | 0,128 [0,113–0,144] | 0,028 [0,021–0,036] | 0,496 [0,473–0,520] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 11,33 [11,29–11,37] | 11 | 7–16 | 3–22 | 0,126 [0,123–0,130] | 0 |
| starter-spazienzio | starter-mara | 11,12 [11,09–11,16] | 11 | 7–16 | 4–22 | 0,101 [0,098–0,105] | 0 |
| starter-mara | starter-mara | 10,87 [10,83–10,91] | 10 | 7–16 | 5–22 | 0,099 [0,096–0,102] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 96000 | 0,500 [0,497–0,503] | 10,3% | 6,4% | 17,28 | 17 |
| starter-mara | 96000 | 0,500 [0,497–0,503] | 14,5% | 10,2% | 16,03 | 16 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 4,7 | 15,9 | 25 |
| starter-spazienzio | T | 1,2 | 1,6 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 22,7 | 16,3 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,1 | 2,2 | 0 |
| starter-mara | L | 0,0 | 0,0 | 0 |
| starter-mara | A | 1,4 | 11,7 | 15 |

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
| base.com.DentiStretti | 0,27 | 26,9% | 0,608 (+0,108) | 0,00 | 2,19 |
| base.com.MattoneDelCantiere | 0,41 | 41,4% | 0,589 (+0,089) | 1,82 | 0,59 |
| base.com.TartarugaSulMarciapiede | 0,56 | 37,5% | 0,403 (−0,097) | 0,10 | 2,49 |
| bruiser.ExtremelyViolentBlow | 0,78 | 60,9% | 0,481 (−0,019) | 1,53 | 1,35 |
| bruiser.Glare | 0,67 | 52,0% | 0,618 (+0,118) | 0,00 | 2,42 |
| bruiser.HealingBlow | 0,30 | 30,2% | 0,604 (+0,104) | 2,91 | 0,53 |
| bruiser.MadeOfStone | 0,94 | 66,8% | 0,559 (+0,059) | 0,00 | 2,26 |
| bruiser.SeagullFly | 1,01 | 75,3% | 0,546 (+0,046) | 1,49 | 0,98 |
| bruiser.SuperImpact | 0,56 | 52,4% | 0,666 (+0,166) | 4,39 | 0,58 |
| bruiser.YouStop | 0,42 | 31,4% | 0,381 (−0,119) | 1,35 | 2,48 |
| bruiser.character.LittleRage | 0,71 | 30,2% | 0,389 (−0,111) | 0,01 | 10,55 |
| bruiser.character.LittleSmack | 3,77 | 94,4% | 0,489 (−0,011) | 0,01 | 7,48 |
| com.basic.BruiserGrab | 0,79 | 62,6% | 0,427 (−0,073) | 5,10 | 5,37 |
| com.last.Struggle | 0,07 | 5,1% | 0,622 (+0,122) | 0,00 | 0,50 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,32 | 85,8% | 0,539 (+0,039) | 0,00 | 2,12 |
| base.com.SputoDaPosacenere | 1,16 | 81,1% | 0,555 (+0,055) | 0,74 | 1,19 |
| base.com.TartarugaSulMarciapiede | 0,23 | 22,8% | 0,283 (−0,217) | 0,80 | 2,80 |
| base.mara.CinghiataDiTraverso | 1,16 | 81,3% | 0,552 (+0,052) | 0,72 | 1,15 |
| base.mara.PresoAlVolo | 1,37 | 72,3% | 0,439 (−0,061) | 2,36 | 7,22 |
| base.mara.Sgommata | 1,05 | 81,2% | 0,595 (+0,095) | 1,66 | 0,81 |
| base.mara.Slalom | 0,50 | 49,6% | 0,539 (+0,039) | 0,86 | 1,08 |
| base.mara.SorpassoInCurva | 1,20 | 78,5% | 0,534 (+0,034) | 0,00 | 3,42 |
| base.mara.TraDueParaurti | 0,45 | 33,8% | 0,293 (−0,207) | 1,13 | 4,00 |
| base.mara.bound.CambioMarcia | 0,79 | 39,5% | 0,389 (−0,111) | 0,02 | 10,14 |
| base.mara.bound.PassoStretto | 1,56 | 75,7% | 0,464 (−0,036) | 0,02 | 9,37 |
| com.Steal | 0,07 | 7,5% | 0,112 (−0,388) | 2,08 | 2,10 |
| com.last.Struggle | 0,10 | 7,5% | 0,605 (+0,105) | 0,00 | 0,97 |

## Tetto delle bound

8 usi di fila contro un manichino da 1000 HEALTH; salute di tutti alzata a 1000. Valore per uso = danno inflitto (anche periodico) + danno parato su un colpo di prova da 10 HIT + salute propria + guadagni immediati pesati. Tetto: 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33.

| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |
|---|---|---:|---:|---|---:|---|---|---|
| base.mara.bound.CambioMarcia | base.character.Mara | 4,00 | 4,00 | 0,00 → 0,00 | 0,00 | A +64 | entro il tetto | — |
| base.mara.bound.ColpoDiStriscio | base.character.Mara | 2,67 | 2,67 | 2,00 → 2,00 | 0,00 | — | entro il tetto | — |
| base.mara.bound.PassoStretto | base.character.Mara | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |
| base.spazienzio.bound.TestaAlMuro | bruiser.character.BigBadBruiser | 3,00 | 3,00 | 0,00 → 0,00 | 0,00 | V +64 | entro il tetto | — |
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 3,75 | 3,75 | 0,00 → 0,00 | 0,00 | V +40 | entro il tetto | — |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 4,00 | 4,00 | 3,00 → 3,00 | 0,00 | — | entro il tetto | — |

## Limiti

- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.
- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.
- Il «+x» del catalogo è stimato 5 dai bot.
