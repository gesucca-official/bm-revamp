# Banco SB-7 — giro1t.json

> SB-12a, giro 1: D38 (costi di Mara -5 A, HEALTH 95) e Sgommata 26 CUT

| Voce | Valore |
|---|---|
| Bozza | `tmp/sim/sb12a/giro1t.json` |
| SHA-256 | `24fbb67b1787dcbe31ab9c132fbc0e50ff78fff7ff9df3903bafc6ad99237a52` |
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

96000 partite, 2615746 turni di giocatore controllati.

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
| starter-spazienzio | starter-spazienzio | 32000 | 13732 | 13866 | 4402 | 0 | 0,498 [0,492–0,503] | 0,501 [0,495–0,507] |
| starter-spazienzio | starter-mara | 32000 | 14846 | 13436 | 3718 | 0 | 0,525 [0,519–0,531] | 0,509 [0,503–0,515] |
| starter-mara | starter-mara | 32000 | 14116 | 14162 | 3722 | 0 | 0,499 [0,493–0,505] | 0,502 [0,497–0,508] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-spazienzio contro starter-spazienzio**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,500 [0,477–0,523] | 0,509 [0,486–0,533] | 0,270 [0,250–0,291] | 0,586 [0,563–0,609] |
| prudente | 0,498 [0,473–0,522] | 0,494 [0,467–0,520] | 0,125 [0,111–0,142] | 0,529 [0,505–0,553] |
| risorse | 0,732 [0,711–0,752] | 0,876 [0,859–0,890] | 0,502 [0,478–0,525] | 0,823 [0,805–0,840] |
| com | 0,399 [0,376–0,422] | 0,450 [0,427–0,474] | 0,182 [0,165–0,200] | 0,481 [0,458–0,505] |

**starter-spazienzio contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,274 [0,254–0,295] | 0,453 [0,430–0,477] | 0,317 [0,296–0,339] | 0,786 [0,766–0,805] |
| prudente | 0,160 [0,143–0,178] | 0,499 [0,473–0,524] | 0,245 [0,225–0,267] | 0,840 [0,822–0,857] |
| risorse | 0,699 [0,677–0,719] | 0,912 [0,898–0,924] | 0,762 [0,741–0,781] | 0,989 [0,984–0,993] |
| com | 0,149 [0,134–0,166] | 0,363 [0,341–0,386] | 0,186 [0,169–0,204] | 0,699 [0,677–0,720] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,488 [0,464–0,512] | 0,901 [0,886–0,914] | 0,669 [0,646–0,691] | 0,991 [0,986–0,994] |
| prudente | 0,109 [0,096–0,124] | 0,492 [0,466–0,518] | 0,202 [0,184–0,222] | 0,872 [0,855–0,886] |
| risorse | 0,319 [0,298–0,342] | 0,807 [0,787–0,825] | 0,503 [0,480–0,527] | 0,974 [0,966–0,980] |
| com | 0,012 [0,008–0,017] | 0,137 [0,122–0,154] | 0,022 [0,016–0,030] | 0,486 [0,461–0,510] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 13,52 [13,48–13,56] | 13 | 9–18 | 3–23 | 0,138 [0,134–0,141] | 0 |
| starter-spazienzio | starter-mara | 13,55 [13,51–13,58] | 13 | 10–18 | 6–23 | 0,116 [0,113–0,120] | 0 |
| starter-mara | starter-mara | 13,80 [13,77–13,84] | 14 | 10–18 | 7–23 | 0,116 [0,113–0,120] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 96000 | 0,508 [0,505–0,512] | 26,1% | 18,5% | 17,37 | 17 |
| starter-mara | 96000 | 0,492 [0,488–0,495] | 36,1% | 26,9% | 16,10 | 16 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 5,2 | 16,1 | 25 |
| starter-spazienzio | T | 1,5 | 2,0 | 0 |
| starter-spazienzio | L | 0,1 | 1,0 | 0 |
| starter-spazienzio | A | 23,5 | 15,0 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 1,5 | 2,9 | 0 |
| starter-mara | L | 0,0 | 0,0 | 0 |
| starter-mara | A | 0,7 | 9,0 | 15 |

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
| base.com.DentiStretti | 0,33 | 33,0% | 0,644 (+0,135) | 0,00 | 2,10 |
| base.com.MattoneDelCantiere | 0,46 | 46,4% | 0,589 (+0,081) | 1,97 | 0,60 |
| base.com.TartarugaSulMarciapiede | 0,63 | 40,5% | 0,399 (−0,109) | 0,14 | 2,66 |
| bruiser.ExtremelyViolentBlow | 0,90 | 67,4% | 0,500 (−0,008) | 1,72 | 1,46 |
| bruiser.Glare | 0,80 | 57,8% | 0,625 (+0,117) | 0,00 | 2,53 |
| bruiser.HealingBlow | 0,34 | 34,1% | 0,603 (+0,095) | 3,37 | 0,54 |
| bruiser.MadeOfStone | 1,12 | 74,5% | 0,567 (+0,059) | 0,00 | 2,39 |
| bruiser.SeagullFly | 1,16 | 81,7% | 0,545 (+0,037) | 1,69 | 1,08 |
| bruiser.SuperImpact | 0,62 | 56,9% | 0,664 (+0,156) | 5,65 | 0,64 |
| bruiser.YouStop | 0,48 | 35,1% | 0,378 (−0,130) | 1,52 | 2,60 |
| bruiser.character.LittleRage | 0,84 | 32,3% | 0,406 (−0,103) | 0,02 | 12,66 |
| bruiser.character.LittleSmack | 4,60 | 97,1% | 0,502 (−0,007) | 0,02 | 8,91 |
| com.basic.BruiserGrab | 1,00 | 74,0% | 0,438 (−0,071) | 6,25 | 6,28 |
| com.last.Struggle | 0,24 | 15,4% | 0,593 (+0,084) | 0,00 | 0,50 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,55 | 91,7% | 0,522 (+0,031) | 0,00 | 2,22 |
| base.com.SputoDaPosacenere | 1,32 | 86,0% | 0,539 (+0,048) | 1,17 | 1,29 |
| base.com.TartarugaSulMarciapiede | 0,25 | 25,4% | 0,262 (−0,230) | 1,18 | 2,76 |
| base.mara.CinghiataDiTraverso | 1,32 | 86,3% | 0,536 (+0,045) | 1,15 | 1,25 |
| base.mara.PresoAlVolo | 1,93 | 88,1% | 0,466 (−0,025) | 3,02 | 8,77 |
| base.mara.Sgommata | 1,14 | 84,5% | 0,566 (+0,074) | 2,64 | 0,88 |
| base.mara.Slalom | 0,55 | 54,7% | 0,537 (+0,046) | 1,18 | 1,04 |
| base.mara.SorpassoInCurva | 1,49 | 89,6% | 0,520 (+0,029) | 0,00 | 3,52 |
| base.mara.TraDueParaurti | 0,50 | 36,5% | 0,266 (−0,225) | 1,88 | 4,34 |
| base.mara.bound.CambioMarcia | 1,12 | 53,4% | 0,465 (−0,027) | 0,08 | 12,52 |
| base.mara.bound.PassoStretto | 2,12 | 87,8% | 0,472 (−0,020) | 0,08 | 11,52 |
| com.Steal | 0,08 | 8,5% | 0,103 (−0,389) | 2,37 | 1,96 |
| com.last.Struggle | 0,34 | 22,2% | 0,616 (+0,124) | 0,00 | 0,87 |

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
