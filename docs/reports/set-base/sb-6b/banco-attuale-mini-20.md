# Banco SB-7 — attuale.json + mini.json

> SB-6b: set di oggi con la mini-espansione di prova

| Voce | Valore |
|---|---|
| Bozza | `server/attuale.json + mini.json` |
| SHA-256 | `7fa7cf1da3ae87aa9a3faf1bd563a6a33d63ddcc343eb340a0d3c1104de802e4` |
| Formato | sb-6b/1: 20 carte, al massimo 2 copie, 2 bound |
| Banco | sb-7/1 |
| Mazzi | starter-bruiser, starter-junkie, mini.spazienzio, mini.tossico |
| Stili | aggressivo, prudente, risorse: 9 coppie |
| Semi | 7000000–7000019, posti alternati (semi pari: A gioca per primo) |
| Partite | 20 per cella, 90 celle, 1800 in tutto |
| Tetto delle bound | 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33; 8 usi contro un manichino |
| Tempi | non qui: nel file `.tempi.txt` accanto, perché questo testo resti uguale a ogni esecuzione |

Quota = vittorie / (vittorie + sconfitte), patte e limite esclusi. Intervalli di Wilson al 95%: coprono solo l'errore di campionamento, **non i limiti dei bot**. Con molte celle, circa una su venti cade fuori per caso.

## Invarianti

1800 partite, 39588 turni di giocatore controllati.

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
| tetto-bound | valore per uso entro il tetto, nessun accumulo, nulla che resti sull'avversario | 4 bound su 5 |

## Matrice dei mazzi

Somma delle 9 coppie di stili, a pari peso.

| A | B | partite | vittorie A | vittorie B | patte | limite | quota A [IC 95%] | quota del primo posto |
|---|---|---:|---:|---:|---:|---:|---|---|
| starter-bruiser | starter-bruiser | 180 | 74 | 59 | 47 | 0 | 0,556 [0,472–0,638] | 0,459 [0,376–0,543] |
| starter-bruiser | starter-junkie | 180 | 4 | 170 | 6 | 0 | 0,023 [0,009–0,058] | 0,523 [0,449–0,596] |
| starter-bruiser | mini.spazienzio | 180 | 76 | 67 | 37 | 0 | 0,531 [0,450–0,611] | 0,350 [0,276–0,431] |
| starter-bruiser | mini.tossico | 180 | 0 | 178 | 2 | 0 | 0,000 [0,000–0,021] | 0,500 [0,427–0,573] |
| starter-junkie | starter-junkie | 180 | 60 | 60 | 60 | 0 | 0,500 [0,412–0,588] | 0,592 [0,502–0,675] |
| starter-junkie | mini.spazienzio | 180 | 165 | 6 | 9 | 0 | 0,965 [0,926–0,984] | 0,468 [0,395–0,543] |
| starter-junkie | mini.tossico | 180 | 14 | 137 | 29 | 0 | 0,093 [0,056–0,150] | 0,530 [0,450–0,608] |
| mini.spazienzio | mini.spazienzio | 180 | 72 | 63 | 45 | 0 | 0,533 [0,449–0,615] | 0,326 [0,253–0,409] |
| mini.spazienzio | mini.tossico | 180 | 6 | 160 | 14 | 0 | 0,036 [0,017–0,077] | 0,434 [0,361–0,510] |
| mini.tossico | mini.tossico | 180 | 78 | 26 | 76 | 0 | 0,750 [0,659–0,823] | 0,423 [0,333–0,519] |

### Per coppia di stili

Quota di A, con lo stile di A in riga e quello di B in colonna.

**starter-bruiser contro starter-bruiser**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,583 [0,320–0,807] | 0,067 [0,012–0,298] | 0,692 [0,424–0,873] |
| prudente | 0,813 [0,570–0,934] | 0,308 [0,127–0,576] | 0,846 [0,578–0,957] |
| risorse | 0,625 [0,386–0,815] | 0,588 [0,360–0,784] | 0,500 [0,290–0,710] |

**starter-bruiser contro starter-junkie**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,059 [0,010–0,270] | 0,000 [0,000–0,168] | 0,000 [0,000–0,168] |
| prudente | 0,053 [0,009–0,246] | 0,000 [0,000–0,161] | 0,000 [0,000–0,161] |
| risorse | 0,100 [0,028–0,301] | 0,000 [0,000–0,161] | 0,000 [0,000–0,161] |

**starter-bruiser contro mini.spazienzio**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,278 [0,125–0,509] | 0,500 [0,280–0,720] | 0,313 [0,142–0,556] |
| prudente | 0,714 [0,454–0,883] | 0,867 [0,621–0,963] | 0,643 [0,388–0,837] |
| risorse | 0,375 [0,185–0,614] | 0,611 [0,386–0,797] | 0,563 [0,332–0,769] |

**starter-bruiser contro mini.tossico**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,000 [0,000–0,161] | 0,000 [0,000–0,176] | 0,000 [0,000–0,161] |
| prudente | 0,000 [0,000–0,161] | 0,000 [0,000–0,161] | 0,000 [0,000–0,161] |
| risorse | 0,000 [0,000–0,161] | 0,000 [0,000–0,161] | 0,000 [0,000–0,161] |

**starter-junkie contro starter-junkie**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,706 [0,469–0,867] | 0,167 [0,047–0,448] | 0,471 [0,262–0,690] |
| prudente | 0,647 [0,413–0,827] | 0,333 [0,061–0,792] | 0,667 [0,391–0,862] |
| risorse | 0,529 [0,310–0,738] | 0,143 [0,040–0,399] | 0,636 [0,354–0,848] |

**starter-junkie contro mini.spazienzio**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,900 [0,699–0,972] | 0,895 [0,686–0,971] | 0,895 [0,686–0,971] |
| prudente | 1,000 [0,832–1,000] | 1,000 [0,839–1,000] | 1,000 [0,832–1,000] |
| risorse | 1,000 [0,816–1,000] | 1,000 [0,839–1,000] | 1,000 [0,824–1,000] |

**starter-junkie contro mini.tossico**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,222 [0,090–0,452] | 0,211 [0,085–0,433] | 0,263 [0,118–0,488] |
| prudente | 0,000 [0,000–0,204] | 0,000 [0,000–0,176] | 0,000 [0,000–0,242] |
| risorse | 0,000 [0,000–0,184] | 0,059 [0,010–0,270] | 0,000 [0,000–0,194] |

**mini.spazienzio contro mini.spazienzio**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,556 [0,337–0,754] | 0,750 [0,468–0,911] | 0,571 [0,326–0,786] |
| prudente | 0,286 [0,117–0,546] | 0,533 [0,301–0,752] | 0,714 [0,454–0,883] |
| risorse | 0,313 [0,142–0,556] | 0,647 [0,413–0,827] | 0,467 [0,248–0,699] |

**mini.spazienzio contro mini.tossico**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,067 [0,012–0,298] | 0,211 [0,085–0,433] | 0,063 [0,011–0,283] |
| prudente | 0,000 [0,000–0,161] | 0,000 [0,000–0,168] | 0,000 [0,000–0,161] |
| risorse | 0,000 [0,000–0,176] | 0,000 [0,000–0,161] | 0,000 [0,000–0,168] |

**mini.tossico contro mini.tossico**

| A \ B | aggressivo | prudente | risorse |
|---|---|---|---|
| aggressivo | 0,727 [0,434–0,903] | 0,545 [0,280–0,787] | 0,818 [0,523–0,949] |
| prudente | 0,923 [0,667–0,986] | 0,875 [0,529–0,978] | 0,929 [0,685–0,987] |
| risorse | 0,667 [0,391–0,862] | 0,500 [0,237–0,763] | 0,714 [0,454–0,883] |

## Durata, patte e limite

Turni risolti fino alla fine della partita.

| A | B | turni medi [IC 95%] | mediana | 10°–90° percentile | minimo–massimo | patte [IC 95%] | limite |
|---|---|---|---:|---|---|---|---:|
| starter-bruiser | starter-bruiser | 12,05 [11,60–12,50] | 11 | 9–17 | 7–20 | 0,261 [0,202–0,330] | 0 |
| starter-bruiser | starter-junkie | 7,89 [7,78–8,00] | 8 | 7–9 | 7–10 | 0,033 [0,015–0,071] | 0 |
| starter-bruiser | mini.spazienzio | 11,41 [11,01–11,82] | 11 | 8–16 | 3–19 | 0,206 [0,153–0,270] | 0 |
| starter-bruiser | mini.tossico | 8,41 [8,30–8,52] | 8 | 8–9 | 7–11 | 0,011 [0,003–0,040] | 0 |
| starter-junkie | starter-junkie | 13,95 [13,57–14,33] | 15 | 9–16 | 7–17 | 0,333 [0,269–0,405] | 0 |
| starter-junkie | mini.spazienzio | 7,91 [7,78–8,03] | 8 | 7–9 | 6–10 | 0,050 [0,027–0,092] | 0 |
| starter-junkie | mini.tossico | 14,02 [13,73–14,30] | 14 | 12–16 | 7–17 | 0,161 [0,115–0,222] | 0 |
| mini.spazienzio | mini.spazienzio | 11,33 [10,94–11,72] | 11 | 8–15 | 5–18 | 0,250 [0,192–0,318] | 0 |
| mini.spazienzio | mini.tossico | 8,66 [8,50–8,81] | 8 | 8–10 | 7–12 | 0,078 [0,047–0,126] | 0 |
| mini.tossico | mini.tossico | 14,35 [14,16–14,54] | 14 | 13–16 | 12–18 | 0,422 [0,352–0,495] | 0 |

## Mazzi esauriti e last resort

Per mazzo, su tutte le sue partite. Turno di arrivo: il primo in cui la last resort è in mano.

| mazzo | partite | quota | mazzo esaurito | last resort arrivata | turno medio di arrivo | mediana |
|---|---:|---|---:|---:|---:|---:|
| starter-bruiser | 900 | 0,280 [0,249–0,313] | 9,6% | 7,7% | 16,28 | 16 |
| starter-junkie | 900 | 0,637 [0,602–0,671] | 33,0% | 25,9% | 14,59 | 14 |
| mini.spazienzio | 900 | 0,285 [0,254–0,319] | 8,8% | 6,1% | 15,80 | 16 |
| mini.tossico | 900 | 0,824 [0,794–0,850] | 15,1% | 6,3% | 16,32 | 16 |

## Risorse inutilizzate a fine partita

Media a fine partita, per chi vince e per chi perde (patte e limite esclusi). Il costo più alto nel mazzo serve da riferimento.

| mazzo | risorsa | vincitore | perdente | costo più alto nel mazzo |
|---|---|---:|---:|---:|
| starter-bruiser | V | 1,8 | 11,2 | 25 |
| starter-bruiser | T | 2,6 | 21,7 | 0 |
| starter-bruiser | L | 0,7 | 1,3 | 0 |
| starter-bruiser | A | 37,9 | 41,9 | 10 |
| starter-junkie | V | 0,0 | 0,0 | 0 |
| starter-junkie | T | 52,6 | 99,7 | 10 |
| starter-junkie | L | 2,6 | 3,3 | 10 |
| starter-junkie | A | 26,7 | 17,7 | 10 |
| mini.spazienzio | V | 1,9 | 5,9 | 25 |
| mini.spazienzio | T | 3,0 | 20,2 | 0 |
| mini.spazienzio | L | 0,5 | 0,6 | 0 |
| mini.spazienzio | A | 40,6 | 38,9 | 5 |
| mini.tossico | V | 0,0 | 0,0 | 0 |
| mini.tossico | T | 52,1 | 84,7 | 10 |
| mini.tossico | L | 0,0 | 0,0 | 0 |
| mini.tossico | A | 27,3 | 24,6 | 10 |

## Costo pagato in HEALTH

Morte pagando: il costo in HEALTH della mossa scelta è almeno pari alla salute del giocatore (R04: muore, e la mossa prosegue). «Senza uccidere»: l'avversario è ancora vivo a fine turno.

| mazzo | stile | partite | HEALTH spesa per partita | morti pagando | senza uccidere | sconfitte | patte |
|---|---|---:|---:|---:|---:|---:|---:|
| starter-bruiser | aggressivo | 300 | 0,00 | 0 | 0 | 0 | 0 |
| starter-bruiser | prudente | 300 | 0,00 | 0 | 0 | 0 | 0 |
| starter-bruiser | risorse | 300 | 0,00 | 0 | 0 | 0 | 0 |
| starter-junkie | aggressivo | 300 | 0,00 | 0 | 0 | 0 | 0 |
| starter-junkie | prudente | 300 | 0,00 | 0 | 0 | 0 | 0 |
| starter-junkie | risorse | 300 | 0,00 | 0 | 0 | 0 | 0 |
| mini.spazienzio | aggressivo | 300 | 0,00 | 0 | 0 | 0 | 0 |
| mini.spazienzio | prudente | 300 | 0,00 | 0 | 0 | 0 | 0 |
| mini.spazienzio | risorse | 300 | 0,00 | 0 | 0 | 0 | 0 |
| mini.tossico | aggressivo | 300 | 0,00 | 0 | 0 | 0 | 0 |
| mini.tossico | prudente | 300 | 0,00 | 0 | 0 | 0 | 0 |
| mini.tossico | risorse | 300 | 0,00 | 0 | 0 | 0 | 0 |

## Carte

Per mazzo, su tutti gli stili. *Giocate*: scelte e pagate, anche se poi annullate. *Quota se giocata*: nelle partite in cui il mazzo la gioca almeno una volta, con lo scarto dalla quota del mazzo. *Morta*: turni in mano senza essere una mossa legale; *ferma*: turni in mano, legale ma non scelta; entrambe per partita in cui la carta è stata in mano.

**starter-bruiser**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| bruiser.BadEducation | 0,21 | 20,8% | 0,388 (+0,108) | 0,91 | 0,66 |
| bruiser.BreakYourToy | 0,00 | 0,0% | — | 0,95 | 0,45 |
| bruiser.CantFeelAnything | 0,00 | 0,2% | 0,000 (−0,280) | 1,83 | 0,63 |
| bruiser.ExtremelyViolentBlow | 0,67 | 54,3% | 0,351 (+0,071) | 4,22 | 0,47 |
| bruiser.Glare | 0,67 | 48,7% | 0,262 (−0,018) | 0,00 | 1,43 |
| bruiser.HealingBlow | 0,60 | 60,4% | 0,310 (+0,031) | 2,00 | 0,17 |
| bruiser.MadeOfStone | 0,35 | 35,1% | 0,441 (+0,161) | 0,00 | 1,30 |
| bruiser.SeagullFly | 0,51 | 51,0% | 0,313 (+0,033) | 0,85 | 0,38 |
| bruiser.SickeningBlow | 0,14 | 14,1% | 0,467 (+0,187) | 1,54 | 0,64 |
| bruiser.StunningBlow | 0,34 | 30,1% | 0,182 (−0,098) | 2,33 | 0,98 |
| bruiser.SuperImpact | 0,42 | 42,3% | 0,423 (+0,143) | 2,59 | 0,02 |
| bruiser.WhatchaDoin | 0,00 | 0,0% | — | 1,24 | 1,43 |
| bruiser.YouStop | 0,15 | 11,2% | 0,608 (+0,328) | 1,01 | 3,77 |
| bruiser.character.LittleRage | 2,36 | 44,9% | 0,319 (+0,039) | 0,00 | 8,00 |
| bruiser.character.LittleSmack | 3,24 | 76,1% | 0,271 (−0,009) | 0,00 | 7,12 |
| com.basic.BruiserGrab | 0,58 | 46,2% | 0,272 (−0,008) | 4,72 | 5,06 |
| com.last.Struggle | 0,11 | 6,7% | 0,543 (+0,263) | 0,00 | 0,58 |

**starter-junkie**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| com.Grab | 0,07 | 6,9% | 0,464 (−0,173) | 0,29 | 2,31 |
| com.ShuffleFeet | 0,00 | 0,0% | — | 0,00 | 2,23 |
| com.Steal | 0,00 | 0,0% | — | 0,83 | 1,97 |
| com.basic.ToxicGrab | 0,65 | 42,2% | 0,459 (−0,178) | 1,22 | 9,68 |
| com.last.Struggle | 0,52 | 25,9% | 0,268 (−0,370) | 0,00 | 0,00 |
| junkie.AmphetamineReflexes | 0,60 | 36,8% | 0,538 (−0,099) | 0,15 | 3,70 |
| junkie.BadTrip | 0,00 | 0,0% | — | 0,27 | 2,08 |
| junkie.Cough | 0,01 | 0,7% | 0,000 (−0,637) | 0,08 | 1,34 |
| junkie.EverythingIsDrug | 0,23 | 23,2% | 0,407 (−0,230) | 0,50 | 2,18 |
| junkie.GoingBerserk | 0,26 | 25,9% | 0,503 (−0,135) | 7,41 | 0,00 |
| junkie.LethalHeroinDose | 0,00 | 0,0% | — | 0,00 | 3,95 |
| junkie.MethDrivenRage | 0,80 | 80,1% | 0,581 (−0,056) | 0,01 | 0,07 |
| junkie.PervertedMetabolism | 0,02 | 1,6% | 0,923 (+0,286) | 0,00 | 5,60 |
| junkie.ToxicBloodDrain | 0,01 | 0,7% | 0,800 (+0,163) | 0,06 | 1,44 |
| junkie.character.PatheticBlade | 8,36 | 100,0% | 0,637 (+0,000) | 0,00 | 3,19 |
| junkie.character.RottenSmile | 0,03 | 2,4% | 0,000 (−0,637) | 0,00 | 11,51 |

**mini.spazienzio**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| bruiser.ExtremelyViolentBlow | 0,68 | 60,3% | 0,253 (−0,033) | 3,22 | 0,10 |
| bruiser.Glare | 0,65 | 45,4% | 0,320 (+0,035) | 0,00 | 2,53 |
| bruiser.MadeOfStone | 0,80 | 53,3% | 0,322 (+0,036) | 0,00 | 3,07 |
| bruiser.SuperImpact | 0,76 | 70,9% | 0,396 (+0,111) | 3,66 | 0,00 |
| bruiser.YouStop | 0,28 | 19,2% | 0,177 (−0,108) | 1,76 | 2,03 |
| bruiser.character.LittleSmack | 3,98 | 96,6% | 0,280 (−0,005) | 0,00 | 6,15 |
| com.basic.BruiserGrab | 0,44 | 40,9% | 0,314 (+0,028) | 3,25 | 6,43 |
| com.last.Struggle | 0,08 | 5,7% | 0,500 (+0,215) | 0,00 | 0,07 |
| mini.CalcioAlBidone | 0,98 | 72,8% | 0,290 (+0,005) | 2,25 | 0,59 |
| mini.RintoccoDiCampana | 1,47 | 91,7% | 0,284 (−0,001) | 0,00 | 0,63 |
| mini.Spallucce | 0,00 | 0,0% | — | 0,00 | 3,74 |
| mini.spazienzio.bound.Sbuffata | 0,00 | 0,0% | — | 0,00 | 10,13 |

**mini.tossico**

| carta | giocate per partita | partite in cui è giocata | quota se giocata (scarto) | morta | ferma |
|---|---:|---:|---|---:|---:|
| com.Grab | 0,00 | 0,0% | — | 0,60 | 3,04 |
| com.Steal | 0,00 | 0,0% | — | 0,72 | 2,43 |
| com.basic.ToxicGrab | 0,09 | 8,6% | 0,473 (−0,351) | 1,55 | 10,32 |
| com.last.Struggle | 0,07 | 6,3% | 0,857 (+0,034) | 0,00 | 0,00 |
| junkie.AmphetamineReflexes | 0,50 | 31,7% | 0,864 (+0,041) | 0,38 | 4,41 |
| junkie.Cough | 0,00 | 0,0% | — | 0,15 | 2,62 |
| junkie.MethDrivenRage | 1,39 | 82,2% | 0,777 (−0,047) | 0,00 | 0,00 |
| junkie.PervertedMetabolism | 0,04 | 3,0% | 0,880 (+0,056) | 0,00 | 6,52 |
| junkie.ToxicBloodDrain | 0,00 | 0,0% | — | 0,18 | 1,62 |
| junkie.character.PatheticBlade | 8,25 | 100,0% | 0,824 (+0,000) | 0,00 | 3,71 |
| junkie.character.RottenSmile | 0,00 | 0,0% | — | 0,00 | 11,96 |
| mini.RintoccoDiCampana | 1,62 | 95,4% | 0,818 (−0,006) | 0,00 | 0,08 |
| mini.Spallucce | 0,00 | 0,0% | — | 0,00 | 6,05 |

## Tetto delle bound

8 usi di fila contro un manichino da 1000 HEALTH; salute di tutti alzata a 1000. Valore per uso = danno inflitto (anche periodico) + danno parato su un colpo di prova da 10 HIT + salute propria + guadagni immediati pesati. Tetto: 4 unità ±0%; pesi V 0,75 · A 0,5 · T 0,15 se immune, 0 se no · L 0,35 · HEALTH 1; danno inflitto 1,33.

| bound | personaggio | valore massimo | valore medio | danno 1° → ultimo uso | parato massimo | guadagni (somma) | esito | note |
|---|---|---:|---:|---|---:|---|---|---|
| bruiser.character.LittleRage | bruiser.character.BigBadBruiser | 6,75 | 6,75 | 0,00 → 0,00 | 3,00 | V +40 | **viola**: valore per uso 6,75 oltre il tetto 4,00 | più di una funzione |
| bruiser.character.LittleSmack | bruiser.character.BigBadBruiser | 9,17 | 9,17 | 5,00 → 5,00 | 0,00 | A +40 | **viola**: valore per uso 9,17 oltre il tetto 4,00 | più di una funzione |
| junkie.character.PatheticBlade | junkie.character.ToxicJunkie | 34,08 | 22,08 | 7,00 → 25,00 | 0,00 | T +40 | **viola**: valore per uso 34,08 oltre il tetto 4,00; si accumula: danno 7,00 al primo uso, 25,00 all'uso 8; resta sull'avversario: T +40 | più di una funzione |
| junkie.character.RottenSmile | junkie.character.ToxicJunkie | 2,50 | 2,50 | 0,00 → 0,00 | 0,00 | A +40 | **viola**: resta sull'avversario: A -40 | — |
| mini.spazienzio.bound.Sbuffata | bruiser.character.BigBadBruiser | 3,00 | 3,00 | 0,00 → 0,00 | 0,00 | V +32 | entro il tetto | — |

## Limiti

- I numeri dicono come giocano **questi bot**: un intervallo di confidenza non corregge un bot che gioca male.
- Nessuno stile tiene conto del costo in HEALTH; le contromosse hanno un valore fisso o legato alla propria salute.
- Il «+x» del catalogo è stimato 5 dai bot.
