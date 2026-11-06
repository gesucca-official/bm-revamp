# Banco SB-7 — bozza.json

> SB-11b, prima fotografia

| Voce | Valore |
|---|---|
| Bozza | `server/src/test/resources/set-base/bozza.json` |
| SHA-256 | `745401672b1c3dcd20d871d7b17e45687017cd9e827674ec56c298a4fe02ee94` |
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

96000 partite, 2804374 turni di giocatore controllati.

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
| starter-spazienzio | starter-mara | 32000 | 28132 | 1877 | 1991 | 0 | 0,937 [0,935–0,940] | 0,506 [0,500–0,511] |
| starter-mara | starter-mara | 32000 | 13028 | 12937 | 6035 | 0 | 0,502 [0,496–0,508] | 0,503 [0,497–0,510] |

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
| aggressivo | 0,865 [0,848–0,880] | 0,979 [0,971–0,985] | 0,904 [0,890–0,916] | 0,982 [0,975–0,987] |
| prudente | 0,926 [0,913–0,937] | 0,994 [0,990–0,997] | 0,956 [0,945–0,964] | 0,994 [0,990–0,997] |
| risorse | 0,998 [0,996–0,999] | 1,000 [0,997–1,000] | 0,999 [0,997–1,000] | 1,000 [0,998–1,000] |
| com | 0,735 [0,714–0,755] | 0,897 [0,882–0,910] | 0,787 [0,767–0,805] | 0,939 [0,927–0,949] |

**starter-mara contro starter-mara**

| A \ B | aggressivo | prudente | risorse | com |
|---|---|---|---|---|
| aggressivo | 0,508 [0,483–0,534] | 0,886 [0,870–0,901] | 0,679 [0,656–0,702] | 0,984 [0,977–0,989] |
| prudente | 0,095 [0,081–0,110] | 0,514 [0,487–0,541] | 0,249 [0,228–0,272] | 0,800 [0,779–0,818] |
| risorse | 0,321 [0,298–0,344] | 0,772 [0,750–0,792] | 0,506 [0,481–0,531] | 0,943 [0,932–0,953] |
| com | 0,015 [0,011–0,022] | 0,197 [0,178–0,217] | 0,050 [0,041–0,062] | 0,506 [0,481–0,531] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-spazienzio | starter-spazienzio | 13,52 [13,48–13,56] | 13 | 9–18 | 3–23 | 0,138 [0,134–0,141] | 0 |
| starter-spazienzio | starter-mara | 13,78 [13,74–13,82] | 14 | 9–18 | 5–23 | 0,062 [0,060–0,065] | 0 |
| starter-mara | starter-mara | 16,52 [16,49–16,54] | 17 | 14–19 | 9–23 | 0,189 [0,184–0,193] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-spazienzio | 96000 | 0,654 [0,651–0,657] | 27,9% | 20,1% | 17,39 | 17 |
| starter-mara | 96000 | 0,340 [0,337–0,343] | 58,3% | 44,9% | 16,71 | 17 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-spazienzio | V | 6,1 | 17,1 | 25 |
| starter-spazienzio | T | 1,6 | 2,0 | 0 |
| starter-spazienzio | L | 0,1 | 0,9 | 0 |
| starter-spazienzio | A | 19,5 | 18,1 | 5 |
| starter-mara | V | 0,0 | 0,1 | 0 |
| starter-mara | T | 2,6 | 3,5 | 0 |
| starter-mara | L | 0,0 | 0,0 | 0 |
| starter-mara | A | -2,9 | 4,9 | 20 |

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
| base.com.DentiStretti | 0,33 | 32,6% | 0,737 (+0,083) | 0,00 | 2,10 |
| base.com.MattoneDelCantiere | 0,47 | 46,5% | 0,717 (+0,063) | 1,95 | 0,61 |
| base.com.TartarugaSulMarciapiede | 0,63 | 40,6% | 0,575 (−0,080) | 0,16 | 2,66 |
| bruiser.ExtremelyViolentBlow | 0,91 | 67,5% | 0,648 (−0,006) | 1,69 | 1,46 |
| bruiser.Glare | 0,79 | 57,4% | 0,730 (+0,076) | 0,00 | 2,56 |
| bruiser.HealingBlow | 0,34 | 34,3% | 0,727 (+0,073) | 3,36 | 0,55 |
| bruiser.MadeOfStone | 1,12 | 74,6% | 0,691 (+0,036) | 0,00 | 2,42 |
| bruiser.SeagullFly | 1,16 | 82,2% | 0,684 (+0,030) | 1,68 | 1,10 |
| bruiser.SuperImpact | 0,63 | 57,4% | 0,770 (+0,116) | 5,68 | 0,67 |
| bruiser.YouStop | 0,48 | 35,2% | 0,562 (−0,092) | 1,51 | 2,62 |
| bruiser.character.LittleRage | 0,86 | 32,3% | 0,570 (−0,084) | 0,02 | 12,72 |
| bruiser.character.LittleSmack | 4,64 | 96,8% | 0,649 (−0,005) | 0,02 | 8,95 |
| com.basic.BruiserGrab | 1,01 | 73,4% | 0,605 (−0,049) | 6,34 | 6,27 |
| com.last.Struggle | 0,25 | 16,6% | 0,711 (+0,057) | 0,00 | 0,53 |

**starter-mara**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| base.com.Spintone | 1,65 | 93,0% | 0,363 (+0,024) | 0,00 | 1,87 |
| base.com.SputoDaPosacenere | 1,06 | 75,9% | 0,384 (+0,045) | 3,02 | 1,15 |
| base.com.TartarugaSulMarciapiede | 0,25 | 24,7% | 0,163 (−0,176) | 1,64 | 1,87 |
| base.mara.CinghiataDiTraverso | 1,05 | 75,3% | 0,384 (+0,044) | 3,07 | 1,11 |
| base.mara.PresoAlVolo | 2,84 | 97,8% | 0,345 (+0,006) | 4,93 | 7,84 |
| base.mara.Sgommata | 0,76 | 66,7% | 0,420 (+0,080) | 5,77 | 0,65 |
| base.mara.Slalom | 0,31 | 31,2% | 0,306 (−0,034) | 2,74 | 0,84 |
| base.mara.SorpassoInCurva | 1,63 | 92,9% | 0,363 (+0,023) | 0,00 | 2,78 |
| base.mara.TraDueParaurti | 0,39 | 31,1% | 0,134 (−0,206) | 3,30 | 2,70 |
| base.mara.bound.CambioMarcia | 1,67 | 61,3% | 0,355 (+0,015) | 0,10 | 13,84 |
| base.mara.bound.PassoStretto | 3,35 | 94,4% | 0,344 (+0,004) | 0,10 | 12,15 |
| com.Steal | 0,07 | 7,4% | 0,075 (−0,265) | 2,26 | 1,26 |
| com.last.Struggle | 0,59 | 39,9% | 0,568 (+0,229) | 0,00 | 0,67 |

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
