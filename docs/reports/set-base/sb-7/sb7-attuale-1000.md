# Banco SB-7 — attuale.json

> Prima fotografia SB-7: dati di prova, non di bilanciamento. Carte e bot di oggi, nessuna correzione.

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/sb-6a/attuale.json` |
| SHA-256 | `123c880d37792fd28ec6b6b5f615b48928b499e174107673304954ef491ab293` |
| Formato | sb-6a/1: 20 carte, al massimo 2 copie, 2 bound |
| Banco | sb-7/1 |
| Mazzi | starter-bruiser, starter-junkie |
| Stili | aggressivo, prudente, risorse: 9 coppie |
| Semi | 7000000–7000999, posti alternati (semi pari: A gioca per primo) |
| Partite | 1000 per cella, 27 celle, 27000 in tutto |
| Tetto delle bound | 5 unità ±20%; pesi V 1 · A 1 · T 1 se immune, 0 se no · L 0,5 · HEALTH 1; 8 usi contro un manichino |
| Tempi | non qui: nel file `.tempi.txt` accanto, perché questo testo resti uguale a ogni esecuzione |

Quota = vittorie / (vittorie + sconfitte), patte e limite esclusi. Intervalli di Wilson al 95%: coprono solo l'errore di campionamento, **non i limiti dei bot**. Con molte celle, circa una su venti cade fuori per caso.

## Invarianti

27000 partite, 610628 turni di giocatore controllati.

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
| tetto-bound | valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario | 4 bound su 4 |

## Matrice dei mazzi

Somma delle 9 coppie di stili, a pari peso.

| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |
|---|---|---:|---:|---:|---:|---:|---|---|
| starter-bruiser | starter-bruiser | 9000 | 3605 | 3589 | 1806 | 0 | 0,501 [0,490–0,513] | 0,491 [0,479–0,503] |
| starter-bruiser | starter-junkie | 9000 | 117 | 8659 | 224 | 0 | 0,013 [0,011–0,016] | 0,503 [0,493–0,513] |
| starter-junkie | starter-junkie | 9000 | 3067 | 3033 | 2900 | 0 | 0,503 [0,490–0,515] | 0,498 [0,485–0,510] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-bruiser contro starter-bruiser**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,493 [0,458–0,527] | 0,340 [0,308–0,373] | 0,501 [0,467–0,535] |
| prudente | 0,669 [0,637–0,700] | 0,489 [0,449–0,529] | 0,620 [0,586–0,652] |
| risorse | 0,492 [0,458–0,525] | 0,407 [0,373–0,442] | 0,488 [0,454–0,522] |

**starter-bruiser contro starter-junkie**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,037 [0,027–0,051] | 0,004 [0,002–0,010] | 0,004 [0,002–0,011] |
| prudente | 0,026 [0,017–0,038] | 0,000 [0,000–0,004] | 0,002 [0,001–0,007] |
| risorse | 0,042 [0,031–0,057] | 0,003 [0,001–0,009] | 0,004 [0,002–0,011] |

**starter-junkie contro starter-junkie**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,518 [0,484–0,551] | 0,273 [0,243–0,306] | 0,494 [0,459–0,529] |
| prudente | 0,735 [0,703–0,764] | 0,532 [0,463–0,599] | 0,774 [0,740–0,805] |
| risorse | 0,515 [0,480–0,550] | 0,211 [0,181–0,245] | 0,470 [0,432–0,508] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-bruiser | starter-bruiser | 11,85 [11,79–11,92] | 11 | 8–17 | 5–20 | 0,201 [0,193–0,209] | 0 |
| starter-bruiser | starter-junkie | 7,82 [7,80–7,84] | 8 | 7–9 | 6–14 | 0,025 [0,022–0,028] | 0 |
| starter-junkie | starter-junkie | 14,25 [14,20–14,30] | 15 | 10–16 | 6–19 | 0,322 [0,313–0,332] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-bruiser | 27000 | 0,316 [0,310–0,322] | 11,5% | 9,1% | 16,20 | 16 |
| starter-junkie | 27000 | 0,704 [0,697–0,710] | 37,4% | 30,2% | 14,72 | 14 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-bruiser | V | 2,2 | 10,7 | 25 |
| starter-bruiser | T | 2,9 | 20,0 | 0 |
| starter-bruiser | L | 0,6 | 1,2 | 0 |
| starter-bruiser | A | 36,5 | 40,3 | 10 |
| starter-junkie | V | 0,0 | 0,0 | 0 |
| starter-junkie | T | 60,5 | 104,9 | 10 |
| starter-junkie | L | 2,7 | 3,9 | 10 |
| starter-junkie | A | 24,5 | 13,3 | 10 |

## Costo pagato in HEALTH

Morte pagando: il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore (R04: muore, e la mossa prosegue). «Senza uccidere»: l'avversario è ancora vivo a fine turno.

| mazzo | stile | partite | HEALTH spesa per partita | morti pagando | senza uccidere | sconfitte | patte |
|---|---|---:|---:|---:|---:|---:|---:|
| starter-bruiser | aggressivo | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-bruiser | prudente | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-bruiser | risorse | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-junkie | aggressivo | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-junkie | prudente | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| starter-junkie | risorse | 9000 | 0,00 | 0 | 0 | 0 | 0 |

## Carte

Per mazzo, su tutti gli stili. *Giocate*: scelte e pagate, anche se poi annullate. *Quota se giocata*: nelle partite in cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo. *Morta*: turni in mano senza essere una mossa legale; *ferma*: turni in mano, legale ma non scelta; entrambe per partita in cui la carta è stata in mano.

**starter-bruiser**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| bruiser.BadEducation | 0,34 | 34,1% | 0,328 (+0,012) | 1,12 | 1,00 |
| bruiser.BreakYourToy | 0,00 | 0,0% | — | 1,15 | 0,51 |
| bruiser.CantFeelAnything | 0,02 | 2,3% | 0,277 (−0,038) | 1,76 | 0,72 |
| bruiser.ExtremelyViolentBlow | 0,78 | 62,5% | 0,331 (+0,015) | 3,47 | 0,43 |
| bruiser.Glare | 0,67 | 48,4% | 0,310 (−0,006) | 0,00 | 1,53 |
| bruiser.HealingBlow | 0,49 | 49,1% | 0,396 (+0,081) | 2,05 | 0,13 |
| bruiser.MadeOfStone | 0,42 | 42,2% | 0,389 (+0,073) | 0,00 | 1,45 |
| bruiser.SeagullFly | 0,51 | 51,1% | 0,377 (+0,062) | 1,18 | 0,54 |
| bruiser.SickeningBlow | 0,16 | 16,4% | 0,549 (+0,233) | 1,70 | 0,79 |
| bruiser.StunningBlow | 0,32 | 28,1% | 0,238 (−0,078) | 2,42 | 1,10 |
| bruiser.SuperImpact | 0,41 | 41,3% | 0,459 (+0,144) | 2,81 | 0,01 |
| bruiser.WhatchaDoin | 0,00 | 0,0% | — | 1,19 | 1,36 |
| bruiser.YouStop | 0,14 | 11,1% | 0,592 (+0,277) | 1,10 | 3,49 |
| bruiser.character.LittleRage | 2,47 | 47,1% | 0,339 (+0,023) | 0,00 | 8,04 |
| bruiser.character.LittleSmack | 3,06 | 74,7% | 0,329 (+0,013) | 0,00 | 7,45 |
| com.basic.BruiserGrab | 0,57 | 47,0% | 0,320 (+0,004) | 3,98 | 5,96 |
| com.last.Struggle | 0,15 | 8,1% | 0,592 (+0,277) | 0,00 | 0,48 |

**starter-junkie**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| com.Grab | 0,06 | 6,2% | 0,508 (−0,195) | 0,49 | 2,97 |
| com.ShuffleFeet | 0,00 | 0,0% | — | 0,00 | 2,22 |
| com.Steal | 0,00 | 0,0% | — | 0,75 | 2,01 |
| com.basic.ToxicGrab | 0,73 | 44,7% | 0,521 (−0,183) | 1,31 | 10,07 |
| com.last.Struggle | 0,64 | 29,7% | 0,537 (−0,167) | 0,00 | 0,03 |
| junkie.AmphetamineReflexes | 0,60 | 35,9% | 0,657 (−0,047) | 0,18 | 4,00 |
| junkie.BadTrip | 0,00 | 0,0% | — | 0,24 | 2,54 |
| junkie.Cough | 0,01 | 0,7% | 0,041 (−0,663) | 0,07 | 1,54 |
| junkie.EverythingIsDrug | 0,23 | 23,0% | 0,530 (−0,173) | 0,36 | 2,36 |
| junkie.GoingBerserk | 0,28 | 28,0% | 0,557 (−0,147) | 6,97 | 0,00 |
| junkie.LethalHeroinDose | 0,00 | 0,0% | — | 0,00 | 3,43 |
| junkie.MethDrivenRage | 0,83 | 82,8% | 0,665 (−0,039) | 0,01 | 0,03 |
| junkie.PervertedMetabolism | 0,02 | 1,6% | 0,781 (+0,078) | 0,00 | 5,50 |
| junkie.ToxicBloodDrain | 0,01 | 0,7% | 0,892 (+0,189) | 0,08 | 1,58 |
| junkie.character.PatheticBlade | 8,68 | 100,0% | 0,704 (+0,000) | 0,00 | 3,42 |
| junkie.character.RottenSmile | 0,04 | 2,4% | 0,058 (−0,646) | 0,00 | 12,07 |

## Tetto delle bound

8 usi di fila contro un manichino da 1000 HEALTH; salute di tutti alzata a 1000. Valore per uso = danno inflitto (anche periodico) + danno parato su un colpo di prova da 10 HIT + salute propria + guadagni immediati pesati. Tetto: 5 unità ±20%; pesi V 1 · A 1 · T 1 se immune, 0 se no · L 0,5 · HEALTH 1.

| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |
|---|---|---:|---:|---|---:|---|---|---|
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 8,00 | 8,00 | 0,00 → 0,00 | 3,00 | V +40 | **viola**: valore per uso 8,00 oltre il tetto 6,00 | più di una funzione |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 10,00 | 10,00 | 5,00 → 5,00 | 0,00 | A +40 | **viola**: valore per uso 10,00 oltre il tetto 6,00 | più di una funzione |
| junkie.character.PatheticBlade | junkie.character.ToxicJunkie | 30,00 | 21,00 | 7,00 → 25,00 | 0,00 | T +40 | **viola**: valore per uso 30,00 oltre il tetto 6,00; si accumula: danno 7,00 al primo uso, 25,00 all'uso 8; resta sull'avversario: T +40 | più di una funzione |
| junkie.character.RottenSmile | junkie.character.ToxicJunkie | 5,00 | 5,00 | 0,00 → 0,00 | 0,00 | A +40 | **viola**: resta sull'avversario: A -40 | — |

## Limiti

- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.
- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.
- Il «+x» del catalogo è stimato 5 dai bot.
