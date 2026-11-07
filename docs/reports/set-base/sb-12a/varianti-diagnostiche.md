# SB-12a — Varianti diagnostiche

Varianti usate per scegliere le correzioni dei giri, oppure per controllare i bot prima di toccare una carta. **Nella bozza c'è solo ciò che
è indicato come giro.** Ogni variante è generata in `tmp/sim/sb12a/` dalla bozza del passo precedente con una o più modifiche, e riscritta
con l'indentazione di Python: per questo lo SHA-256 è diverso da quello di `bozza.json` anche a parità di contenuto. Le bozze dei giri 1 e 2
sono copiate in [`bozze/`](bozze/); quella del giro 3 è `server/src/test/resources/set-base/bozza.json`, con lo stesso contenuto della variante
`r3c-sgom25` (controllato confrontando i due JSON).

Banco SB-7 (`BenchMeasureTest#matrix`, banco sb-7/1), 1000 partite per cella salvo dove indicato, stili aggressivo, prudente, risorse e com
(16 coppie), semi 7.000.000–7.000.999, posti alternati, `-Dsim.strict=true`: **nessun invariante violato in nessuna variante**. Quota di
Spazienzio contro Mara, somma delle 16 coppie di stili (16.000 partite), Wilson al 95%. «Senza com»: le 9 coppie dei tre stili euristici.
Turni medi negli incontri Spazienzio–Spazienzio, Spazienzio–Mara e Mara–Mara.

**Controllo dello strumento.** `r1-d38` è la variante «costi −5 A e HEALTH 95» di SB-11b scritta di nuovo da zero: dà 8345 vittorie,
5724 sconfitte e 1931 patte, cioè 0,593 [0,585–0,601], identica a quella del [rapporto SB-11b](../sb-11b/varianti-diagnostiche.md).
Rilanciata alle 18:59, con le modifiche di SB-1 a `server/src/main` già nel working tree, dà **le stesse partite cella per cella**: il lavoro
parallelo non ha toccato il motore che il banco usa.

**Testi delle carte.** I bot euristici leggono il danno nominale da `gui.damageAmount` (`BotView.CardSeen.nominalDamage`). Le prime varianti
di danno (`r1x-cing14`, `r1x-sgom26`, `r1x-sputo14`) e le varianti costruite su di loro (`r2x-*`, `r3x-*`) cambiavano il danno senza il testo,
quindi i bot vedevano ancora il numero vecchio. Le ho rifatte col testo coerente (`r1t-*`, `giro1t`, `giro2t`): **la quota non cambia** al
terzo decimale (Sgommata 26: 0,526 → 0,525; giro 2 a 2000 per cella: 0,500 → 0,500), quindi le letture delle `r2x` e `r3x` restano valide.
Le matrici dei giri sono quelle coi testi coerenti.

## Giro 1: il secondo passo, dopo D38

Base: `r1-d38` (D38: costi di Mara −5 A su Cinghiata, Sgommata, Slalom, Paraurti e Sputo; HEALTH di Mara 95).

| Variante | Modifica | SHA-256 | Spazienzio contro Mara | Turni S–S / S–M / M–M | Mazzo esaurito S / M |
|---|---|---|---|---|---|
| r1-d38 | punto di partenza D38 | `cca76243…bb40b69d` | 0,593 [0,585–0,601] | 13,6 / 14,0 / 14,7 | 27,7% / 45,7% |
| r1t-cing14 | Cinghiata 12 → 14 CUT | `f7985aab…f548c7c4` | 0,552 [0,543–0,560] | 13,6 / 13,8 / 14,2 | 26,8% / 39,5% |
| **r1t-sgom26** | **Sgommata 22 → 26 CUT** | `1c9cf116…4e80187d` | **0,525 [0,517–0,533]** | 13,6 / 13,6 / 13,8 | 26,5% / 36,5% |
| r1t-sputo14 | Sputo 12 → 14 POISON | `b97514d8…11e885d3` | 0,548 [0,540–0,556] | 13,6 / 13,7 / 14,2 | 26,8% / 38,8% |
| r1x-maraA45 | A iniziale di Mara 40 → 45 | `0117ea5e…982ed9f4` | 0,526 [0,518–0,534] | 13,6 / 13,6 / 13,9 | 26,3% / 38,6% |
| r1x-mara100 | HEALTH di Mara 95 → 100 | `afeaf680…25175873` | 0,522 [0,514–0,531] | 13,6 / 14,3 / 15,5 | 28,6% / 54,7% |
| r1x-spaV20 | V iniziale di Spazienzio 25 → 20 | `cf4641cb…ff55ebeb` | 0,496 [0,488–0,505] | 14,4 / 14,4 / 14,7 | 34,4% / 47,3% |

Scelta: **Sgommata 26** (giro 1). Arriva nel 45–55% e accorcia le partite di Mara; la salute di Mara e la V di Spazienzio portano allo
stesso punto ma allungano le partite, già sopra l'obiettivo. È un numero dentro la carta, non un cambio d'identità.

## Giro 2: la durata

Base: il giro 1. Salute iniziale tolta a entrambi, con la stessa distanza di D38 (Mara 5 sotto Spazienzio). Varianti costruite sulla
bozza del giro 1 col testo vecchio di Sgommata (vedi sopra).

| Variante | Spazienzio / Mara | SHA-256 | Spazienzio contro Mara | Turni S–S / S–M / M–M | Mazzo esaurito S / M | Patte S–M |
|---|---|---|---|---|---|---:|
| giro 1 (2000 per cella) | 100 / 95 | `24fbb67b…99237a52` | 0,525 [0,519–0,531] | 13,5 / 13,5 / 13,8 | 26,1% / 36,1% | 11,6% |
| r2x-h90 | 90 / 85 | `67840399…9f55e575` | 0,510 [0,502–0,518] | 12,2 / 12,0 / 12,0 | 15,2% / 20,6% | 10,6% |
| **r2x-h85** | **85 / 80** | `c6dc728b…f5cd31a3` | **0,503 [0,495–0,511]** | 11,4 / 11,2 / 10,9 | 10,5% / 14,7% | 10,2% |
| r2x-h80 | 80 / 75 | `bbdda8b0…55b68636` | 0,497 [0,489–0,505] | 10,6 / 10,3 / 9,9 | 6,9% / 10,0% | 10,0% |

Scelta: **85 / 80** (giro 2). La durata scende sotto 12 con margine, i mazzi esauriti diventano pochi e il matchup resta centrato; 90 / 85
lascia la media sul bordo dei 12 turni. Le patte restano intorno al 10% in tutte e tre: vedi il rapporto.

## Controllo dei bot sulle carte (dopo il giro 2)

Base: il giro 2 (0,503 a 1000 partite per cella). Domanda: le carte che i bot giocano poco o in svantaggio sono deboli, o sono i bot a
giocarle male? Due prove: renderle più economiche (se la frequenza non cambia, non è il prezzo) e toglierle dallo starter al posto di carte
semplici (se il mazzo vince di più senza, i bot non ne ricavano valore).

| Variante | Modifica | SHA-256 | Spazienzio contro Mara | Lettura |
|---|---|---|---|---|
| r3x-steal5 | Steal 10 → 5 A | `b48f90db…0742ab8f` | 0,503 [0,495–0,512] | Steal giocata nell'8,0% delle partite invece del 7,5%: non è il prezzo |
| r3x-nosteal | Mara: Steal → seconda Slalom | `6cb4b852…df99040b` | 0,483 [0,475–0,491] | Mara +2 punti senza Steal |
| r3x-noparaurti | Mara: due Paraurti → seconda Slalom e seconda Tartaruga | `a043d5e8…307a844d` | 0,478 [0,470–0,486] | Mara +2,5 punti senza Paraurti |
| r3x-notartm | Mara: Tartaruga → seconda Slalom | `066c1411…b39b10b6` | 0,476 [0,468–0,484] | Mara +2,7 punti senza Tartaruga |
| r3x-noyoustop | Spazienzio: due YouStop → secondo Mattone e seconda HealingBlow | `bf5278fd…afd933e0` | 0,587 [0,579–0,595] | Spazienzio +8,4 punti senza YouStop |
| r3x-notarts | Spazienzio: due Tartaruga → secondo Mattone e secondi Denti stretti | `628fe302…f3998d34` | 0,563 [0,554–0,571] | Spazienzio +6 punti senza Tartaruga |

Lettura: in mano a questi bot **ogni contromossa e ogni difesa del turno vale meno di un colpo semplice**, per tutti e due i personaggi, e
Steal non si gioca perché mancano i bersagli (Spazienzio ha un solo posto per gli oggetti e li consuma presto) e perché i bot la valutano
con un punteggio fisso, senza guardare l'oggetto. È coerente con i limiti noti dei bot (SB-10a, SB-11b): non leggono la mossa
dell'avversario, che è ciò che fa rendere una parata del turno o un annullamento. **Nessuna di queste carte è tagliata o indebolita.**

## Giro 3: centrare il matchup fra gli stili

Base: il giro 2 col testo coerente (`giro2t`, 0,500 a 2000 per cella, ma 0,450 senza com). Si cerca un ritocco piccolo che metta dentro il
45–55% con margine sia la somma dei quattro stili sia quella dei tre euristici.

| Variante | Modifica | SHA-256 | Quattro stili | Senza com | Turni S–S / S–M / M–M |
|---|---|---|---:|---:|---|
| **r3c-sgom25** | **Sgommata 26 → 25 CUT** | `fef7e190…afe8dd8e` | **0,522** | **0,484** | 11,4 / 11,3 / 11,2 |
| r3c-sgom24 | Sgommata 26 → 24 CUT | `2228d84b…8ce25f40` | 0,539 | 0,506 | 11,4 / 11,4 / 11,4 |
| r3c-mara78 | HEALTH di Mara 80 → 78 | `756deb21…8500c835` | 0,535 | 0,499 | 11,4 / 11,0 / 10,5 |
| r3c-cing11 | Cinghiata 12 → 11 CUT | `4f7c1f43…7081d3e2` | 0,526 | 0,489 | 11,4 / 11,3 / 11,2 |

Scelta: **Sgommata 25** (giro 3). Il punto medio fra le due letture va a circa 0,50, la durata non cambia; è il ritocco più piccolo sulla
carta che il giro 1 aveva già spostato.

## Dopo il giro 3: Cambio marcia +6 A

Base: la bozza del giro 3 (`441b1ecd…ef4841cf4`). La misura di D36 e B2 trova MAR-BO2 (+8 A) a circa 4,5 HEALTH equivalenti per uso, sopra
il tetto di 4. Variante proposta al proprietario e **approvata** («Approvo, anche +6 A»): è il contenuto della bozza finale.

| Variante | Modifica | SHA-256 | Quattro stili | Senza com | Turni S–S / S–M / M–M |
|---|---|---|---:|---:|---|
| r3c-sgom25 (= giro 3) | — | `fef7e190…afe8dd8e` | 0,522 | 0,484 | 11,4 / 11,3 / 11,2 |
| **q-cambio6** | **Cambio marcia +8 → +6 A**, con `gains` e `description` | `f7dd999d…7c99efee` | **0,528** [0,520–0,536] | **0,487** | 11,4 / 11,3 / 11,3 |

Tetto sugli starter veri (`tettostarter`, 2000 partite per stile, tre stili): +6 A a 0,679 [0,666–0,691] con 1,64 giocate a partita,
circa 3,3 HEALTH equivalenti per uso.
