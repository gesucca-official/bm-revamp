# SB-4 — Vista limitata e bot euristici: rapporto

**Chiuso il 5 novembre 2026.** Tre stili di bot battono nettamente il casuale con tutti e quattro gli abbinamenti, su semi
mai usati per tararli. Il server non li usa: gioca ancora col casuale fino a SB-30, regole e carte non cambiano.

**Il risultato da leggere per primo:** quando entrambi giocano con un bot euristico, Bruiser contro Junkie finisce quasi
sempre con Junkie vincitore (Bruiser tra 0% e 4,6%). Vedi [Stile contro stile](#stile-contro-stile).

## Cosa è stato scritto

Nel pacchetto `com.gsc.bm.model.game.bot`:

- `BotView`: la copia di ciò che R08 lascia vedere a un giocatore, con le mosse legali (`LegalMove`). Il bot non riceve il `Game`.
- `BotPolicy`, `BotPlayer`, `RandomPolicy`: il contratto, l'adattatore verso `ComPlayer` (non usato dal server, SB-30) e il casuale sulla vista.
- `AggressivePolicy`, `PrudentPolicy`, `ResourceAwarePolicy`: tre implementazioni di `BotPolicy`, senza campi non costanti.
- `StyleSupport` (supporto comune, package-private): legge ogni mossa legale come numeri (danno nominale, guadagni, costi,
  priorità, bersaglio, ruolo, oggetto consumato), sceglie il punteggio massimo e spareggia con il `Random` ricevuto.
  Ogni stile fornisce `score` (punteggio della mossa) e `keep` (quanto vale tenere una carta, per scegliere lo scarto
  delle carte legate al personaggio).

Nessuna modifica a motore, carte, catalogo, regolamento, `pom.xml`, client.

Le decisioni usano solo `BotView`, le mosse legali e il `Random`. Nessun nome o binding di carta o personaggio.
Il «+x» del catalogo (quantità variabile) è stimato 5 (`StyleSupport.VARIABLE`), per danni e guadagni.

## Come decide ogni stile

**Aggressivo.** Punteggio dominato dal danno nominale al bersaglio (×3, più 2 per punto di priorità, così colpisce prima).
Una mossa che porta l'avversario a zero vale +1000, una che ne toglie metà +10. Disturbo +8, contrasto +9, difesa +1.
Nei turni senza colpo valuta i guadagni (anche quelli dell'oggetto consumato) che sbloccano la carta di danno più forte
in mano che oggi non può pagare. Ignora i propri costi (0,1 a punto) e la propria salute, tranne due cose che lo
farebbero morire prima di chiudere: non prende tossicità se non è immune, e spende la propria tossicità quando lo
avvelena. Se è dietro di salute, valuta un po' le cure. Tiene in mano le carte che fanno più danno.

**Prudente.** Calcola un bisogno di sicurezza fra 0,2 e 1 dal confronto fra la propria salute e quella dell'avversario.
Difese (40×bisogno + 2×priorità), contrasti (25×bisogno + 2×priorità) e cure (2×bisogno per punto) pesano più quando sta
peggio; il danno pesa di più quando è davanti. Evita tossicità o alcol che subirebbe, la ultima risorsa (−8), costi
(0,2 a punto) e soprattutto costi che gli toglierebbero la possibilità di pagare una difesa o un contrasto che ora può
giocare (−10 e −5). Se ha un timer a due turni o meno, valuta di più la difesa. Tiene difese, contrasti e cure.

**Attento alle risorse.** Valuta guadagni e spese rispetto alla *domanda* della mano (il costo più alto per risorsa fra
le carte in mano): i guadagni utili a pagarla valgono 0,9, il resto poco. Usa gli effetti periodici di R06: se non è
immune, la tossicità che prende costa 1,4 a punto e spendere quella che ha vale 0,6; l'alcol costa 0,5 e spenderlo vale 0,5
(l'alcol cala da solo e toglie ALERTNESS). Con immunità la tossicità è solo moneta. ALERTNESS vale di più se è dietro
l'avversario nell'ordine a parità di priorità. Valuta gli oggetti (+5 se consumarne uno evita che il più vecchio
scompaia a capienza piena; prendere o distruggere quelli altrui), la salute (di più se è sotto) e i timer. Danno ×2,2.
Penalizza di 6 ripetere la stessa mossa senza danno del turno precedente (lo ricava da `lastRound`).

## Revisione: cosa è cambiato rispetto alla prima consegna

La prima consegna superava la soglia, ma la revisione ha guardato anche *come* giocavano gli stili:

- **Il prudente non era prudente.** Con Bruiser giocava danno nell'84% delle mosse e difesa nel 10%, meno del casuale (30%).
  Corretti i pesi: difesa da 12 a 40, contrasto da 8 a 25, costi da 0,5 a 0,2. Sui semi di taratura 0–1999 il Bruiser
  prudente ora difende nel 42% delle mosse e fa danno nel 50%. Vince anche di più: la prudenza non era il suo punto debole.
- **Nuovo test** `prudentReallyDefendsMoreThanAggressive`: il prudente deve difendere almeno 20 punti percentuali più
  dell'aggressivo. Provato coi pesi vecchi: fallisce (17,7% contro 7,8%).
- **Nuova misura** `BotStylesMeasureTest.matrix`, stile contro stile: il piano chiede risultati confrontati fra stili, e
  la prima consegna misurava solo contro il casuale.
- Tolto `CardSeen.gainsToSelf`, che nessuno stile usava.

Il Junkie prudente resta poco difensivo perché il suo starter non ha carte di difesa: contrasto nel 10% delle mosse.

## Misura finale

Un'unica esecuzione, dopo l'ultima modifica agli stili, senza ritocchi dopo averla vista:

```
mvn -o test -Dtest=BotStylesMeasureTest -Dsim.bots=5000 -Dsim.firstSeed=3000000
```

Semi 3000000–3004999, posti alternati (lo stile gioca per primo sui semi pari). File in `tmp/sim/`, non versionati.
Quota = vittorie / (vittorie + sconfitte). Nessuna partita a limite di turni.

### Stile contro il casuale

| stile | stile con | casuale con | partite | vittorie | sconfitte | patte | limite | quota | turni medi |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| casuale sulla vista | Bruiser | Bruiser | 5000 | 2230 | 2245 | 525 | 0 | 0,498 | 15,57 |
| casuale sulla vista | Bruiser | Junkie | 5000 | 1721 | 2959 | 320 | 0 | 0,368 | 13,08 |
| casuale sulla vista | Junkie | Bruiser | 5000 | 3007 | 1672 | 321 | 0 | 0,643 | 13,11 |
| casuale sulla vista | Junkie | Junkie | 5000 | 2410 | 2411 | 179 | 0 | 0,500 | 12,81 |
| aggressivo | Bruiser | Bruiser | 5000 | 3248 | 1248 | 504 | 0 | 0,722 | 12,31 |
| aggressivo | Bruiser | Junkie | 5000 | 3046 | 1491 | 463 | 0 | 0,671 | 10,95 |
| aggressivo | Junkie | Bruiser | 5000 | 4783 | 121 | 96 | 0 | 0,975 | 8,15 |
| aggressivo | Junkie | Junkie | 5000 | 2999 | 1738 | 263 | 0 | 0,633 | 11,43 |
| prudente | Bruiser | Bruiser | 5000 | 3516 | 978 | 506 | 0 | 0,782 | 15,47 |
| prudente | Bruiser | Junkie | 5000 | 2722 | 1916 | 362 | 0 | 0,587 | 12,53 |
| prudente | Junkie | Bruiser | 5000 | 4997 | 0 | 3 | 0 | 1,000 | 8,19 |
| prudente | Junkie | Junkie | 5000 | 3648 | 1133 | 219 | 0 | 0,763 | 12,88 |
| risorse | Bruiser | Bruiser | 5000 | 3409 | 1105 | 486 | 0 | 0,755 | 12,37 |
| risorse | Bruiser | Junkie | 5000 | 3246 | 1338 | 416 | 0 | 0,708 | 11,11 |
| risorse | Junkie | Bruiser | 5000 | 4968 | 15 | 17 | 0 | 0,997 | 8,03 |
| risorse | Junkie | Junkie | 5000 | 3359 | 1477 | 164 | 0 | 0,695 | 11,67 |

Il controllo (casuale sulla vista) sta vicino alle quote di partenza, come previsto; il J/B 0,643 è un po' sopra lo 0,629 di SB-3.

### Scarto rispetto alle quote di partenza (soglia: +0,10)

| stile | B/B (0,493) | B/J (0,363) | J/B (0,629) | J/J (0,504) |
|---|---:|---:|---:|---:|
| aggressivo | +0,229 | +0,308 | +0,346 | +0,129 |
| prudente | +0,289 | +0,224 | +0,371 | +0,259 |
| risorse | +0,262 | +0,345 | +0,368 | +0,191 |

Tutti e dodici gli scarti superano 0,10. Il più stretto è l'aggressivo Junkie contro Junkie (+0,129).
Errore di campionamento su 5000 partite: circa ±0,01. Controprova: aggressivo e risorse non sono cambiati in revisione,
e sui semi 1000000 e 2000000 hanno dato quote che differiscono da queste al massimo di 0,019.

### Stile contro stile

Stessi semi, Bruiser con lo stile di riga, Junkie con lo stile di colonna. Quota di Bruiser su vittorie più sconfitte, 5000 partite
per casella, nessuna a limite di turni.

| Bruiser \ Junkie | casuale | aggressivo | prudente | risorse |
|---|---:|---:|---:|---:|
| casuale | 0,369 | 0,025 | 0,000 | 0,003 |
| aggressivo | 0,688 | 0,046 | 0,005 | 0,009 |
| prudente | 0,605 | 0,040 | 0,000 | 0,004 |
| risorse | 0,718 | 0,045 | 0,001 | 0,009 |

Turni medi: circa 8 quando il Junkie è euristico, 11–13 quando è casuale.

**Lettura.** Appena il Junkie sceglie le mosse invece di pescarle a caso, Bruiser non vince più, qualunque stile usi. Gli
stili non vanno confrontati fra loro in questa tabella: decide il personaggio.

**Causa.** Il Junkie euristico gioca «Ago Marcio e Spezzato» (carta legata, gratis, +5 T a sé; 5 CUT e +5 T al bersaglio) nel
78–90% delle mosse. Il danno periodico di T/2 cresce a ogni uso e, con i 5 CUT, uccide in 7–8 turni. Ripetere una sola
carta gratuita è esattamente ciò che il casuale non fa, ed è per questo che la misura di SB-3 (0,363) non lo mostrava.

**Conseguenze.** Non è un difetto dei bot e non è stato corretto: le carte attuali restano invariate e il Set Base le riprogetta.

- SB-10 e i giri di bilanciamento partono con un caso noto: una carta gratuita che scala col proprio effetto periodico.
- Q3 (anticipare il bot sulle carte attuali): un bot normale con Junkie schiaccerebbe chi gioca Bruiser. Anticiparlo
  richiede prima di decidere cosa fare di quella carta.

## Test e verifiche

- `./scripts/build.ps1 -Task TestServer -Offline`: **BUILD SUCCESS, 295 test, 0 falliti, 3 saltati** (le misure con proprietà `sim.*`).
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **BUILD SUCCESS, 402 test, 0 falliti, 3 saltati**.
- `python scripts/check-rules.py`: regolamento e copia client allineati.
- `BotStylesTest`, tutti verdi:
  1. `everyStylePlaysCompleteGames`: 200 partite per stile contro il casuale del gioco: nessuna eccezione, nessun `TURN_LIMIT`.
     `stylesPlayEachOtherToTheEnd`: anche gli stili uno contro l'altro, nessun `TURN_LIMIT`.
  2. `gamesAreReproducibleAndSurviveACopy`: stessa traccia a parità di seme e stesso seguito dopo copia a metà partita.
  3. `stylesChooseDifferently`: sulle stesse viste ogni coppia di stili sceglie mosse diverse in almeno il 15% dei casi.
  4. `prudentReallyDefendsMoreThanAggressive`: vedi la revisione.
  5. `sourcesNeverNameCardsOrCharacters`: nomi presi da `cards.sqlite`, cercati nei sorgenti; il test prova anche di saper fallire.
  6. `stylesHoldNoState`: nessun campo non statico o non finale negli stili.
- `BotViewTest`: il bot non può leggere mano o mazzo altrui.

**Prove una tantum della revisione**, con i pesi di prima consegna del prudente e non ripetute dopo la correzione, che tocca
solo tre costanti; il test che le eseguiva non è stato conservato:

- Determinismo su 6 JVM con hash d'identità diversi, 1.600 partite a stili misti: tracce identiche.
- 800 partite a tre giocatori: tutte concluse (il bersaglio scelto è sempre vivo, il test relativo è in `BotViewTest`).
- Scelte diverse tra stili su 5.370 viste: 42%, 33%, 41%.

## Tentativi falliti (tutti sui semi 0–1999, 2000 partite)

1. Prima versione, quote: aggressivo 0,697/0,658/0,968/0,526 (Junkie/Junkie sotto soglia); prudente tutto sopra soglia;
   risorse 0,757/0,735/0,365/0,645 (Junkie/Bruiser sotto soglia).
2. Risorse: contando le partite per carta, il Junkie ripeteva quasi a ogni turno la stessa mossa di disturbo (circa 9
   volte a partita) senza mai chiudere. Corretto: guadagni «+x» contati solo come stima per il valore, non per sbloccare
   carte; disturbo ridotto (2–4 invece di 7); danno ×2,2 invece di ×1,6; penalità se ripete una mossa senza danno.
   Dopo: 0,749/0,720/0,998/0,697.
3. Aggressivo Junkie/Junkie: spamma la carta legata. Primi cambi (contrasto 9, cure se dietro) senza alcun effetto. Poi:
   niente tossicità in più se non è immune → 0,576; spendere la propria tossicità quando lo avvelena → 0,638.
4. Prudente: pesi 25/16/0,25 → Bruiser difesa 29%, quote 0,752/0,564/1,000/0,752. Pesi 40/25/0,2, tenuti → difesa 42%,
   quote 0,784/0,590/0,999/0,776.

## Cosa non è stato verificato

- Solo Bruiser e Junkie. Niente set diverso da quello attuale: l'indipendenza dai nomi è controllata sui sorgenti, non
  misurata su altre carte. Lo farà SB-7 col playground.
- Il «+x» stimato a 5 e le costanti dei punteggi sono tarate sulle carte attuali.
- Nessuna partita contro persone. Gli stili sono giudicati dalle quote e dalle carte giocate, non da quanto è divertente affrontarli.
- Con più avversari è provato solo che le partite finiscono, non la qualità delle scelte.
- `BotPlayer` non è stato provato nel server reale: è il perimetro di SB-30.
