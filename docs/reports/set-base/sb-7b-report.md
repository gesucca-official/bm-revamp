# SB-7b — Bot e costo in HEALTH: rapporto

**Fatto il 6 novembre 2026, in attesa del giudizio del proprietario.** Gli stili euristici non si uccidono più pagando in HEALTH. La
salute spesa pesa come danno subito, con un peso diverso per ciascuno stile.

| Misura | Prima | Dopo |
|---|---:|---:|
| Morti pagando sulla bozza di prova di SB-9, 27.000 partite di Rocco | 310 | **0** |
| HEALTH spesa per partita | circa 40 | circa 40 |

Che la HEALTH spesa non sia calata dice che gli stili non sono diventati timorosi.

**Sulle carte di oggi non cambia nulla:** il rapporto di SB-7 sulla bozza «attuale» esce identico byte per byte.

Regolamento, carte, catalogo, client e protocollo non cambiano. Il server usa ancora il bot casuale e non questi stili, fino a SB-30.
I bot non sono normativi: il regolamento non va toccato.

**Origine.** Decisione [D31](../../set-base-plan.md#decisioni-del-proprietario) del proprietario: «Prima di SB-10». Il proprietario ha
approvato la proposta della fase A con «Sì, procedi». La proposta cambiava anche una frase del piano: dove il piano diceva «salvo che
uccida l'avversario», ora dice che la mossa suicida è esclusa sempre (vedi sotto).

## Cosa cambia

In `server/src/main/java/com/gsc/bm/model/game/bot/`:

| File | Cambiamento |
|---|---|
| `StyleSupport.java` | `Plan` separa `healthCost` dagli altri costi: `costTotal` ora esclude HEALTH. `suicidal` vale quando il costo in HEALTH è almeno pari alla salute rimasta. `choose` scarta le mosse suicide se esiste un'altra mossa legale |
| `AggressivePolicy.java` | −1 a punto di HEALTH pagata. Il danno inflitto vale 3 a punto, quindi un colpo forte vale ancora il prezzo |
| `PrudentPolicy.java` | −2 × bisogno di sicurezza a punto, come il peso che dà alle cure |
| `ResourceAwarePolicy.java` | −1,5 a punto quando ha meno salute dell'avversario, −0,6 altrimenti, come il peso che dà alle cure. Prima il costo in HEALTH era del tutto ignorato |

**Perché il suicidio è escluso anche quando ucciderebbe l'avversario.** Un costo si paga prima degli effetti (R04). Uccidere pagando
porta quindi al massimo a una patta, e una contromossa può annullare il colpo lasciando solo la morte. Il bot non sa giudicare se una
patta valga più che continuare a giocare. Se tutte le mosse legali fossero suicide, il bot ne gioca una: oggi non succede, perché bound e
last resort sono gratuite.

Lo spareggio casuale fra mosse di pari punteggio non cambia. Quando non ci sono costi in HEALTH, le mosse, i punteggi e le estrazioni sono
gli stessi di prima: lo prova la bozza «attuale», che nessuna carta in HEALTH contiene.

## Prove

`BotHealthCostTest` (nuovo, in `server/src/test/java/com/gsc/bm/sim/`) usa partite vere della bozza di prova, con la mano e la salute di
Rocco impostate a mano:

1. `noStylePaysWithItsLastHealthEvenToKill`: nessuno stile, in 50 estrazioni, gioca la mossa che costa esattamente la salute rimasta.
   - Salute 15: il colpo da 15 HEALTH che ucciderebbe Mara.
   - Salute 10: il contrattacco da 10 HEALTH.
2. `healthPaidWeighsLikeDamageTaken`: fra il colpo pagato e un suo gemello gratuito, ogni stile sceglie il gratuito, con le due carte in
   entrambi gli ordini della mano.
3. `aggressiveStillPaysHealthForAStrongHit`: con 100 di salute l'aggressivo paga ancora 15 per un colpo da 35.
4. `aSuicidalMoveIsStillChosenWhenItIsTheOnlyOne`: se è l'unica mossa legale, viene giocata senza errori.

**Le prove sanno fallire.** Le ho eseguite su una copia del codice di prima, in un worktree temporaneo poi rimosso:

- falliscono la 1 (l'aggressivo gioca il colpo da 15 con salute 15) e la 2 (lo stile «risorse» pareggia i due colpi);
- la 3 e la 4 passano anche prima: proteggono dall'eccesso opposto, cioè uno stile che non paga mai.

**Un difetto della prima versione del test.** Con `new Random(seed)` e semi consecutivi piccoli, il primo `nextInt(2)` è quasi sempre lo
stesso, e il pareggio dello stile «risorse» non si vedeva. Ora i semi passano da `SplittableRandom` e le carte compaiono in entrambi gli
ordini.

## Misure con il banco di SB-7

Stessi semi e impostazioni della prima fotografia: 1000 partite per cella, 3 stili, semi 7.000.000–7.000.999.

**Bozza «attuale».** Testo `7aff3eee…`, dati `bd349c42…`: **identici** a quelli di SB-7.

**Bozza `prova-sb9.json`** ([testo](sb-7b/sb7-prova-sb9-1000.md)). La fotografia di prima è in
[sb-7/](sb-7/sb7-prova-sb9-1000.md).

| | SB-7 | SB-7b |
|---|---:|---:|
| Morti pagando, aggressivo / prudente / risorse | 180 / 49 / 81 | **0 / 0 / 0** |
| HEALTH spesa per partita, aggressivo / prudente / risorse | 40,66 / 43,11 / 40,20 | 40,47 / 43,09 / 39,61 |
| Rocco contro Rocco: patte | 22,7% | 21,8% |
| Rocco contro Rocco: turni medi | 9,56 | 9,65 |
| Mara contro Rocco: vittorie di Rocco | 8824 su 9000 | 8834 su 9000 |
| Invarianti violati | 0 | 0 |

La differenza è piccola perché le morti pagando erano poco più dell'1% delle partite di Rocco, e metà erano patte. Il dato da tenere è che
ora sono zero. **Sono dati di prova, non di bilanciamento:** Mara non vince mai contro Rocco con le carte di prova, prima e dopo.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero processi Maven o Java altrui.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.** Maven 493 test, 0 falliti, 6 saltati (le misure a richiesta). I test sono i 489
  di SB-7 più i 4 nuovi. Client 36 su 36.
- `python scripts/check-rules.py`: regolamento e copia client allineati.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **verde.** 600 test, 0 falliti, 6 saltati, 6:25 min. L'ho lanciato perché il
  blocco tocca codice di produzione, anche se nessuna classe Spring usa questi stili.
- `BotStylesTest`, `BotViewTest`, `PlaygroundTest` e `BenchTest` sono verdi senza toccare un atteso.

**Incidente durante il lavoro.** Per la prima prova sul codice di prima avevo usato `git stash`. Dopo `git stash pop` l'indice di git era
vuoto: tutti i file risultavano cancellati e di nuovo da aggiungere, mentre i file su disco e i commit erano intatti. Ho ricostruito
l'indice da HEAD con `git reset` (solo l'indice, i file restano) e ho controllato che restassero solo le modifiche di SB-7b. La causa
non è accertata. La prova finale è stata rifatta su un worktree separato.

## Cosa non è provato

- **Le contromosse** restano sottostimate: SB-17, come deciso. La stima «+x = 5» non cambia.
- **Le carte di prova di Rocco non mettono alla prova i pesi** della salute spesa: costano 10 e 15. Uno stile potrebbe comunque pagare
  troppa salute in una serie di turni senza mai arrivare al suicidio. Il banco lo mostrerebbe nella HEALTH spesa e nelle sconfitte; con
  le carte vere di Sant'Incasso va riguardato in SB-18.
- **Gli stili non prevedono il danno in arrivo:** possono pagare salute e poi morire per il colpo dell'avversario nello stesso turno. È
  una lettura dell'avversario, non un costo.

## Cosa resta

- **SB-10** può partire: il banco misura senza suicidi dei bot.
- **SB-7** resta in attesa del giudizio del proprietario.
