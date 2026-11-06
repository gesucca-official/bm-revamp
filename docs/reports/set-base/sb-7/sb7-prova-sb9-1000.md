# Banco SB-7 — prova-sb9.json

> Prima fotografia SB-7: dati di prova, non di bilanciamento. Carte e bot di oggi, nessuna correzione.

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/sb-6a/prova-sb9.json` |
| SHA-256 | `f4d5eb2411da85cbed644840b6b940861d7e9acbea107417fe6dd2e49b349d0e` |
| Formato | sb-6a/1: 20 carte, al massimo 2 copie, 2 bound |
| Banco | sb-7/1 |
| Mazzi | prova-mara, prova-rocco |
| Stili | aggressivo, prudente, risorse: 9 coppie |
| Semi | 7000000–7000999, posti alternati (semi pari: A gioca per primo) |
| Partite | 1000 per cella, 27 celle, 27000 in tutto |
| Tetto delle bound | 5 unità ±20%; pesi V 1 · A 1 · T 1 se immune, 0 se no · L 0,5 · HEALTH 1; 8 usi contro un manichino |
| Tempi | non qui: nel file `.tempi.txt` accanto, perché questo testo resti uguale a ogni esecuzione |

Quota = vittorie / (vittorie + sconfitte), patte e limite esclusi. Intervalli di Wilson al 95%: coprono solo l'errore di campionamento, **non i limiti dei bot**. Con molte celle, circa una su venti cade fuori per caso.

## Invarianti

27000 partite, 570652 turni di giocatore controllati.

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
| tetto-bound | valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario | 0 bound su 4 |

## Matrice dei mazzi

Somma delle 9 coppie di stili, a pari peso.

| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |
|---|---|---:|---:|---:|---:|---:|---|---|
| prova-mara | prova-mara | 9000 | 3869 | 3880 | 1251 | 0 | 0,499 [0,488–0,510] | 0,488 [0,477–0,499] |
| prova-mara | prova-rocco | 9000 | 0 | 8824 | 176 | 0 | 0,000 [0,000–0,000] | 0,499 [0,489–0,510] |
| prova-rocco | prova-rocco | 9000 | 3423 | 3534 | 2043 | 0 | 0,492 [0,480–0,504] | 0,528 [0,516–0,540] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**prova-mara contro prova-mara**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,483 [0,446–0,521] | 1,000 [0,996–1,000] | 0,480 [0,444–0,516] |
| prudente | 0,003 [0,001–0,009] | 0,490 [0,456–0,523] | 0,004 [0,002–0,010] |
| risorse | 0,523 [0,487–0,559] | 1,000 [0,996–1,000] | 0,508 [0,472–0,545] |

**prova-mara contro prova-rocco**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,000 [0,000–0,004] | 0,000 [0,000–0,004] | 0,000 [0,000–0,004] |
| prudente | 0,000 [0,000–0,004] | 0,000 [0,000–0,004] | 0,000 [0,000–0,004] |
| risorse | 0,000 [0,000–0,004] | 0,000 [0,000–0,004] | 0,000 [0,000–0,004] |

**prova-rocco contro prova-rocco**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,487 [0,449–0,525] | 0,645 [0,610–0,678] | 0,698 [0,666–0,729] |
| prudente | 0,361 [0,328–0,396] | 0,514 [0,478–0,549] | 0,558 [0,524–0,592] |
| risorse | 0,263 [0,233–0,294] | 0,439 [0,405–0,474] | 0,466 [0,432–0,500] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| prova-mara | prova-mara | 13,33 [13,29–13,38] | 13 | 11–16 | 10–19 | 0,139 [0,132–0,146] | 0 |
| prova-mara | prova-rocco | 8,81 [8,76–8,86] | 9 | 5–12 | 3–13 | 0,020 [0,017–0,023] | 0 |
| prova-rocco | prova-rocco | 9,56 [9,52–9,60] | 10 | 7–12 | 3–14 | 0,227 [0,218–0,236] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| prova-mara | 27000 | 0,319 [0,313–0,324] | 26,9% | 19,3% | 15,00 | 15 |
| prova-rocco | 27000 | 0,694 [0,688–0,700] | 12,0% | 5,1% | 13,00 | 13 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| prova-mara | V | 9,2 | 10,9 | 0 |
| prova-mara | T | 0,0 | 0,0 | 0 |
| prova-mara | L | 0,0 | 0,1 | 0 |
| prova-mara | A | 0,7 | 16,5 | 15 |
| prova-rocco | V | 7,5 | 13,3 | 0 |
| prova-rocco | T | 0,0 | 0,0 | 0 |
| prova-rocco | L | 0,0 | 0,0 | 0 |
| prova-rocco | A | 16,4 | 22,2 | 10 |

## Costo pagato in HEALTH

Morte pagando: il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore (R04: muore, e la mossa prosegue). «Senza uccidere»: l'avversario è ancora vivo a fine turno.

| mazzo | stile | partite | HEALTH spesa per partita | morti pagando | senza uccidere | sconfitte | patte |
|---|---|---:|---:|---:|---:|---:|---:|
| prova-mara | aggressivo | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| prova-mara | prudente | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| prova-mara | risorse | 9000 | 0,00 | 0 | 0 | 0 | 0 |
| prova-rocco | aggressivo | 9000 | 40,66 | 180 | 86 | 86 | 94 |
| prova-rocco | prudente | 9000 | 43,11 | 49 | 25 | 25 | 24 |
| prova-rocco | risorse | 9000 | 40,20 | 81 | 40 | 40 | 41 |

## Carte

Per mazzo, su tutti gli stili. *Giocate*: scelte e pagate, anche se poi annullate. *Quota se giocata*: nelle partite in cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo. *Morta*: turni in mano senza essere una mossa legale; *ferma*: turni in mano, legale ma non scelta; entrambe per partita in cui la carta è stata in mano.

**prova-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| bruiser.Glare | 0,32 | 31,9% | 0,571 (+0,252) | 0,00 | 1,58 |
| bruiser.MadeOfStone | 0,55 | 31,7% | 0,091 (−0,227) | 0,00 | 5,51 |
| com.Grab | 0,00 | 0,0% | — | 0,63 | 2,72 |
| com.ShuffleFeet | 0,00 | 0,0% | — | 0,00 | 1,99 |
| com.Steal | 0,00 | 0,0% | — | 1,33 | 1,84 |
| com.basic.BruiserGrab | 0,01 | 0,5% | 0,029 (−0,290) | 1,74 | 10,08 |
| com.last.Struggle | 0,21 | 11,6% | 0,817 (+0,499) | 0,00 | 0,84 |
| prova.mara.ColpoDiStriscio | 4,30 | 69,4% | 0,466 (+0,148) | 0,05 | 7,48 |
| prova.mara.Contromano | 0,22 | 19,4% | 0,587 (+0,268) | 0,00 | 4,26 |
| prova.mara.Scarto | 3,29 | 32,5% | 0,077 (−0,242) | 0,05 | 8,49 |
| prova.mara.Sgommata | 1,07 | 73,9% | 0,445 (+0,126) | 1,38 | 1,84 |
| prova.mara.Sorpasso | 0,88 | 58,7% | 0,478 (+0,159) | 0,78 | 1,75 |
| prova.mara.TaglioRapido | 0,98 | 66,8% | 0,459 (+0,140) | 1,27 | 2,08 |

**prova-rocco**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| bruiser.Glare | 0,39 | 30,2% | 0,602 (−0,092) | 0,00 | 4,09 |
| bruiser.MadeOfStone | 0,37 | 21,7% | 0,467 (−0,227) | 0,00 | 4,96 |
| com.Grab | 0,00 | 0,0% | — | 0,40 | 4,22 |
| com.ShuffleFeet | 0,00 | 0,0% | — | 0,00 | 3,01 |
| com.Steal | 0,00 | 0,0% | — | 0,42 | 1,93 |
| com.basic.BruiserGrab | 0,00 | 0,0% | 0,000 (−0,694) | 0,84 | 8,47 |
| prova.rocco.Colpetto | 4,66 | 98,6% | 0,695 (+0,001) | 0,00 | 4,65 |
| prova.rocco.ColpoPagato | 1,70 | 98,9% | 0,703 (+0,009) | 0,20 | 0,00 |
| prova.rocco.Contrattacco | 1,58 | 94,1% | 0,698 (+0,004) | 0,08 | 0,16 |
| prova.rocco.Fiato | 0,08 | 3,2% | 0,074 (−0,620) | 0,00 | 9,23 |
| prova.rocco.Incassare | 0,47 | 28,3% | 0,629 (−0,065) | 0,00 | 3,26 |
| prova.rocco.PorgiLAltraGuancia | 0,05 | 4,9% | 0,592 (−0,102) | 0,00 | 0,05 |

## Tetto delle bound

8 usi di fila contro un manichino da 1000 HEALTH; salute di tutti alzata a 1000. Valore per uso = danno inflitto (anche periodico) + danno parato su un colpo di prova da 10 HIT + salute propria + guadagni immediati pesati. Tetto: 5 unità ±20%; pesi V 1 · A 1 · T 1 se immune, 0 se no · L 0,5 · HEALTH 1.

| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |
|---|---|---:|---:|---|---:|---|---|---|
| prova.mara.ColpoDiStriscio | prova.mara | 5,00 | 5,00 | 5,00 → 5,00 | 0,00 | — | entro il tetto | — |
| prova.mara.Scarto | prova.mara | 3,00 | 3,00 | 0,00 → 0,00 | 3,00 | — | entro il tetto | — |
| prova.rocco.Colpetto | prova.rocco | 5,00 | 5,00 | 5,00 → 5,00 | 0,00 | — | entro il tetto | — |
| prova.rocco.Fiato | prova.rocco | 5,00 | 5,00 | 0,00 → 0,00 | 0,00 | — | entro il tetto | cura |

## Limiti

- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.
- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.
- Il «+x» del catalogo è stimato 5 dai bot.
