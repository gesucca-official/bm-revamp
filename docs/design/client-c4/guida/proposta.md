# C4-10 — Guida visiva: Fase A (proposta)

7 novembre 2026. Base `c09b946` su main («C4-10: lower the cut sound to the level of the hit», Fase 0), checkout pulito alla partenza.
**Fase A pronta; il proprietario ha scelto B con ritocchi il 9 novembre 2026 ([scelta](#scelta-del-proprietario)). Fase B non avviata.** Nessun codice di prodotto cambiato: i
prototipi sono una patch fuori dal prodotto ([`prototipo.patch`](prototipo.patch), vedi [sotto](#prototipi-come-sono-stati-provati)).

Fonti: [piano, C4-10](../../../client-c4-plan.md#c4-10--guida-visiva), regole di non regressione 1–18, riga C4-10 della matrice,
[D15](../../../client-c4-plan.md#decisioni-del-proprietario); [O29 e O30](../../../client-roadmap.md#osservazioni-registrate-durante-c4);
[prova di C4-7 del 7 novembre 2026](../../../reports/client-c4-report.md#c4-7--prova-del-proprietario-del-7-novembre-2026),
[C4-7-ter Fase B](../../../reports/client-c4-report.md#c4-7-ter--fase-b), [C4-10 Fase 0](../../../reports/client-c4-report.md#c4-10--fase-0).

**Obiettivo (D15).** Lo sguardo deve andare da solo su ciò che succede e su ciò che il giocatore deve fare, senza leggere:
«un giocatore che vuole giocare, beh, vuole giocare, non leggere». Nessun testo nuovo sullo schermo, nessun elenco.

## Scelta del proprietario

9 novembre 2026, prova dal vivo dei tre prototipi sul tavolo vero (patch [`prototipo.patch`](prototipo.patch) più la
scelta da indirizzo `?guida=`), base `7ef7e00`. Parole del proprietario:

> guida A non mi piace, le ombre sulle carte in mano hanno dei bug strani generando dei coni. in generale fa l'ambiente
> troppo buio. il glow sulle pila delle carte giocate il turno precedente è fastidioso
>
> guida B è la strada giusta, le animazioni sono perfette. il balletto che fanno le carte in mano può essere più veloce e
> meno intensa, basta poco per richiamare l'attenzione sulla mano di carte. il glow sulla pila delle carte giocate c'è
> anche in questa versione, va tolto, non mi piace
>
> guida C è troppo buia, non mi piace
>
> direi che la scelta ricade su B, con quegli accorgimenti che ho detto

Su O29 e O30, alle domande della sessione: O29 «Niente, solo tolto»; O30 «andrebbe bene se il riquadro da cliccare o
toccare fosse perfettamente centrato sulla carta, adesso è storto. poi farei trasparire leggermente di più la carta
sotto».

**Quindi, per la Fase B:**

1. **Strategia B «Richiamo»**, con le animazioni del prototipo (pulsazione di bersagli, carta posata e ✓, pulsazione
   leggera degli avversari in attesa, autore e bersaglio che crescono in sequenza, tremito al colpo). **Ritocco:** l'onda
   sulla mano nella scelta e nello scarto più veloce e meno ampia; basta poco per richiamare lo sguardo. Valori da
   proporre nella Fase B, da far confermare dal vivo.
2. **O29:** il riquadro giallo non si disegna e **nessun bagliore** sulle carte del round (né quello di O29 (a) né altri).
   Il testo resta nel `role="status"` nascosto per il lettore di schermo; le note dopo un salto di turni (D4,
   `roundNote`) restano visibili come oggi; «Ultimo turno» resta il percorso completo.
3. **O30 (a)**, a tutte le misure ufficiali, con due correzioni: ✓ e × **centrati esattamente sulla carta scartata**
   (nel prototipo erano spostati), e il riquadro **più trasparente**, così la carta sotto si vede di più.
4. Scartate A e C: «troppo buie»; in A anche ombre a cono sulle carte in mano (difetto del prototipo, non indagato).

Le [istruzioni per la Fase B](#istruzioni-per-la-fase-b-strategia-a-o29-a-o30-a) sono state scritte per A: per B valgono
struttura, file e verifiche, con i costi e i rischi della [sezione B](#b--richiamo-movimento-e-pulsazione) (onda e
scale rispetto agli `hits`, tremito rispetto allo strato HTML, misure di `VerifyLayout` con l'onda ferma, Safari).
Non detti nella prova: dispositivo usato, movimento ridotto, volume del taglio della Fase 0.

## Scelte richieste al proprietario

1. **Strategia di guida:** A «Riflettore» (luce e ombra, raccomandata), B «Richiamo» (movimento e pulsazione) o
   C «Contrasto» (colore spento e scala). Si possono chiedere ritocchi (intensità, durate) o un ibrido dichiarato (per
   esempio A con lo scuotimento del colpo di B).
2. **O29, riepilogo giallo:** (a) sostituirlo con un bagliore sulle carte del round, raccomandata; (b) tenerlo ma solo a
   sequenza finita, accanto alle carte del round; (c) lasciarlo com'è.
3. **O30, conferma sullo scarto:** (a) ✓ e × sulla carta scartata a tutte le misure ufficiali, raccomandata; (b) solo
   sopra gli 550 px di altezza (schermi grandi), come dice O30 alla lettera; (c) nessun cambiamento.

## Diagnosi sul tavolo vero

Partite reali su server locale (database temporaneo), Edge/Playwright su PC, duello (quick 1vCom) e FFA con quattro
computer, 1366×768 e 844×390, tre turni ciascuna, con lo script [`guide-captures.mjs`](../../../../client-web/tools/guide-captures.mjs).
In ogni momento del turno una cattura e le posizioni degli elementi che dovrebbero tirare lo sguardo
([misure](misure.json)). Le catture «oggi» sono nella cartella [`catture`](catture/).

| Momento | Dove dovrebbe stare l'attenzione | Cosa oggi la porta altrove | Catture |
|---|---|---|---|
| **Scelta della carta** | La propria mano: è il proprio turno | Nulla distingue «tocca a te» da «aspetta»: la mano ha lo stesso peso del portacenere, del Negroni e delle postazioni avversarie. L'unico segno è il testo «Scegli una carta» in basso a sinistra, a 600 px dalla mano a 1366×768. | [duello 1366](catture/oggi-duel-1366-scelta.jpg), [FFA 844](catture/oggi-ffa-844-scelta.jpg) |
| **Mira** | Carta scelta e bersagli ammessi | Già buona: frecce pulsanti e contorno petrolio (C3-3). Difetti minori: una carta senza bersagli ammessi non dà alcun segno; in FFA le frecce sono fino a quattro e il resto del tavolo resta acceso quanto i bersagli. | [FFA 1366](catture/oggi-ffa-1366-mira.jpg) |
| **Conferma** | La carta posata col ✓ e il bersaglio | Il testo della calata («Carta → Bersaglio», «Controlla la calata e conferma») è in basso a sinistra, da **440 a 680 px** dalla carta col ✓ a 1366×768 e da **250 a 570 px** a 844×390: lo sguardo va e viene. In FFA i contorni petrolio restano accesi su tutti i bersagli ammessi anche dopo la scelta. | [duello 1366](catture/oggi-duel-1366-conferma.jpg) |
| **Scarto** (carta legata) | La mano, poi la carta scartata, poi il ✓ | Il ✓ resta sulla carta posata: **523 px** dalla carta scartata (duello 1366), **708 px** (FFA 1366), **220 px** (duello 844), **422 px** (FFA 844). È O30. La scritta «SCARTO» vinaccia sulla carta si legge poco. | [duello 1366](catture/oggi-duel-1366-scarto.jpg), [FFA 844](catture/oggi-ffa-844-scarto.jpg) |
| **Attesa** (mossa inviata) | Gli avversari: si aspetta loro | Il tavolo si schiarisce appena (alfa 0,86) e il testo dice «Invio in corso»; nessun segno su chi si aspetta. Contro il computer dura pochi millisecondi; fra umani dura fino al clock. | [FFA 1366](catture/oggi-ffa-1366-attesa.jpg) |
| **Sequenza** | Autore e bersaglio della carta che si sta risolvendo | **Il riepilogo giallo compare all'inizio della sequenza**, in alto, con il racconto completo del round in parole mentre le carte volano: in ogni cattura da 350 ms in poi. La mano resta piena e luminosa sotto, il suggerimento dice già «Scegli una carta» (giusto per la regola 4, ma tira lo sguardo). In FFA i primi piani al centro non dicono di chi sono se non leggendo il nome: le cinque postazioni restano tutte accese. | [duello 1366](catture/oggi-duel-1366-sequenza.jpg), [duello 844](catture/oggi-duel-844-sequenza.jpg), [FFA 1366](catture/oggi-ffa-1366-sequenza.jpg) |
| **Colpo** | Il bersaglio colpito | Ci sono già impronta del danno, onda per HIT, scossa e oscuramento del personaggio (C3-5) e il suono (C4-7-ter): il colpo è leggibile ma piccolo rispetto al resto del tavolo acceso; nessun lampo, il tavolo non reagisce. | stesse catture di sequenza |
| **Dopo la sequenza** | Strisce del riepilogo sulle postazioni, poi la mano | Il riepilogo giallo resta ancora fino a 6 s e copre, in FFA a 1366×768, la zona del Negroni a destra; in duello sta sopra l'avversario. | [duello 1366](catture/oggi-duel-1366-dopo.jpg) |
| **Esito** | Il pannello | Il pannello è centrale e il suono parte con lui (C4-7-ter): nessun problema di attenzione rilevato. Non catturato di nuovo in questa fase. | — |

**Sintesi.** I due punti peggiori sono la **sequenza** (tutto il tavolo resta acceso e il riepilogo giallo racconta in
parole quello che le carte stanno mostrando) e i **comandi lontani dal punto d'azione** (testo della calata in basso a
sinistra, ✓ lontano dallo scarto). Il terzo è la mancanza di un segno «tocca a te» nella scelta. La mira funziona già.

## Strategie

Tutte e tre usano lo stesso **fuoco** calcolato a ogni frame dagli elementi del tavolo (gli `hits` della scena e le
postazioni del `tableLayout`), mai da posizioni fisse, quindi seguono la geometria di C4-11:

| Momento | Elementi a fuoco |
|---|---|
| Scelta | carte della mano |
| Mira | carta scelta e bersagli che `Model.allows` ammette |
| Conferma | carta posata, bersaglio scelto e, se c'è, carta scartata |
| Scarto | carte regolari della mano e carta posata |
| Attesa | personaggi e plance degli avversari ancora in gioco |
| Sequenza | personaggio e plancia di autore e bersaglio della carta in corso (intervallo dal costo all'atterraggio di ciascuna carta, già calcolato dalla scena) |
| Esito, nessuna partita | nessuno |

La selezione vince sulla sequenza: se il giocatore sceglie una carta durante la sequenza (regola 4), il fuoco passa
subito alla mira. Nessuna strategia cambia durate, calendario o tetto di 20 s della sequenza, né aggiunge attese al
percorso di input: il fuoco si ricalcola nel `tick` già esistente, senza timer.

### A — Riflettore (luce e ombra) · raccomandata

**Cosa cambia.** Un velo scuro (inchiostro `#0b0604`) copre il tavolo **sotto** frecce, carte in volo e primi piani, con
fori arrotondati sugli elementi a fuoco. Intensità per momento: scelta 0,22, mira/conferma/scarto 0,42, attesa 0,20,
sequenza 0,50; il velo entra ed esce in circa 150 ms. Al colpo, un lampo chiaro (0,6 → 0 in 220 ms) sul bersaglio.
Le carte in volo e i primi piani restano sopra il velo: in sequenza la scena «si spegne» e resta acceso solo ciò che
accade. Il guscio HTML (✓/×, testi, menu) resta sopra e non viene oscurato.

**Catture.** Duello: [scelta 1366](catture/A-duel-1366-scelta.jpg), [conferma 1366](catture/A-duel-1366-conferma.jpg),
[scarto 1366](catture/A-duel-1366-scarto.jpg), [sequenza 1366](catture/A-duel-1366-sequenza.jpg),
[sequenza 844](catture/A-duel-844-sequenza.jpg). FFA: [mira 1366](catture/A-ffa-1366-mira.jpg),
[sequenza 1366](catture/A-ffa-1366-sequenza.jpg), [sequenza 844](catture/A-ffa-844-sequenza.jpg),
[scarto 844](catture/A-ffa-844-scarto.jpg).

**Costo.** Basso: un solo `Graphics` ridisegnato per frame (un rettangolo e da 2 a 10 fori), nessun filtro, nessuna
texture; circa 60 righe in `scene.ts`. Nessuna geometria cambiata.

**Rischi sulle regole 1–9.** Nessuno sulla logica: il velo è solo disegno, non tocca stato, `hits`, viste o calendario.
Regola 5: con movimento ridotto il velo compare senza dissolvenza e senza lampo, stessa informazione. Regola 2: alla fine
della sequenza il fuoco passa alla scelta da solo. Rischio di leggibilità: le strisce del riepilogo e le plance fuori
fuoco restano leggibili sotto un velo 0,2–0,5 (da giudicare nelle catture). Regola 11: il fuoco non porta informazioni
nuove, rinforza quelle che hanno già forma e testo.

**Safari e movimento ridotto.** È la strategia più leggera per Safari: niente filtri né cambi di scala, un poligono pieno
per frame. Con movimento ridotto è statica.

### B — Richiamo (movimento e pulsazione)

**Cosa cambia.** Nessun velo: si muove ciò che chiede un gesto. Nella scelta le carte della mano «respirano» con
un'onda che le solleva una dopo l'altra (14 px, 8 px compatto) ogni 3,6 s; nello scarto la stessa onda sulle sole
regolari, più spessa. In mira e conferma i bersagli ammessi, la carta posata e il bersaglio pulsano di scala (±3,5%);
il ✓ pulsa (CSS). In attesa gli avversari pulsano appena (±1,5%). In sequenza autore e bersaglio della carta in corso
crescono del 7% e al colpo tutto il tavolo trema per 180 ms (6 px, 3 px compatto).

**Catture.** Duello: [scelta 1366](catture/B-duel-1366-scelta.jpg), [conferma 1366](catture/B-duel-1366-conferma.jpg),
[sequenza 1366](catture/B-duel-1366-sequenza.jpg), [sequenza 844](catture/B-duel-844-sequenza.jpg). FFA:
[mira 1366](catture/B-ffa-1366-mira.jpg), [sequenza 1366](catture/B-ffa-1366-sequenza.jpg). Il movimento non si vede in
una cattura ferma: va giudicato dal vivo (vedi [come provare](#come-provare-i-prototipi-dal-vivo)).

**Costo.** Medio: trasformazioni di scala e posizione su nodi che `draw()` ricrea, quindi serve ricordare e ripristinare
la posizione di riposo; tremito del contenitore `world` e di `fx`. Circa 50 righe in `scene.ts` e 10 in `style.css`.

**Rischi sulle regole 1–9.** Le carte che si sollevano e i bersagli che crescono si spostano rispetto ai loro `hits`
(fino a 14 px e 3,5%): un tocco proprio sul bordo può cadere fuori. Il tremito sposta per 180 ms tutto il tavolo rispetto
allo strato semantico HTML. Le misure di `VerifyLayout` (sovrapposizioni, primi piani) leggono i nodi: un'onda in corso
può cambiare un conteggio, quindi andrebbe ferma durante le misure. Regola 5: con movimento ridotto non resta nulla
della guida (il contorno resta quello di oggi).

**Safari e movimento ridotto.** Ridisegni di scala su molti nodi a ogni frame: è il tipo di carico che su Safari è già
stato segnalato poco fluido (C4-8b). Con movimento ridotto tutto si spegne: la guida sparisce.

### C — Contrasto (colore spento e scala)

**Cosa cambia.** Ciò che è fuori fuoco si spegne di colore (tinta grigia sui nodi del tavolo, sullo sfondo e sugli
oggetti di scena; più forte in sequenza), ciò che è a fuoco resta a colori pieni e cresce del 4–6%; al colpo il bersaglio
fa un «pugno» di scala (+12% che rientra in 240 ms) con un lampo bianco.

**Catture.** Duello: [scelta 1366](catture/C-duel-1366-scelta.jpg), [conferma 1366](catture/C-duel-1366-conferma.jpg),
[sequenza 1366](catture/C-duel-1366-sequenza.jpg), [sequenza 844](catture/C-duel-844-sequenza.jpg). FFA:
[mira 1366](catture/C-ffa-1366-mira.jpg), [sequenza 1366](catture/C-ffa-1366-sequenza.jpg).

**Costo.** Medio: tinta su ogni figlio di `world` a ogni frame, e convivenza con l'oscuramento del personaggio colpito
di C3-5, che usa anch'esso la tinta (vanno coordinati: nel prototipo un nodo che sta scuotendo non viene ritinto).
Circa 30 righe.

**Rischi sulle regole 1–9.** Regola 11: la tinta grigia cambia i colori di risorse, ruoli e danni sulle carte fuori
fuoco; forma e numeri restano, ma la cattura in scala di grigi di C4-8a va rifatta. La scala cambia i bordi rispetto agli
`hits` come in B (meno, 4–6%). Regola 5: con movimento ridotto resta la tinta senza scala né pugno.

**Safari e movimento ridotto.** La tinta è economica su WebGL; la scala per frame no, come in B. Con movimento ridotto
resta metà della guida (il colore).

### Dove va la luce: misura grezza

Luminanza media (YAVG 0–255, FFmpeg `signalstats`) della zona della mano propria e della fascia alta (avversari e centro)
nelle catture; secondo turno, sequenza a 1,3 s. Non misura la leggibilità, solo dove la scena mette la luce
([tutte le righe](misure.json)).

| 1366×768, duello / FFA | Oggi | A | B | C |
|---|---|---|---|---|
| Mano nella scelta | 121 / 124 | 113 / 99 | 122 / 120 | 121 / 120 |
| Fascia alta nella scelta | 59 / 67 | 51 / 54 | 59 / 70 | 46 / 50 |
| Mano in conferma (non a fuoco) | 119 / 124 | 72 / 63 | 122 / 120 | 65 / 65 |
| Mano in sequenza (non a fuoco) | 114 / 128 | 61 / 56 | 111 / 109 | 65 / 66 |

A e C tolgono circa metà della luce a ciò che non è a fuoco (in sequenza e in conferma); B non cambia la luce, conta sul
movimento. Nella scelta A spegne di poco il resto del tavolo e lascia accesa la mano (la mano scende un po' in FFA
perché il velo arriva sui bordi delle carte di sinistra, coperte da quelle accanto). Con movimento ridotto A dà gli stessi
valori senza dissolvenza: conferma 70 / 72, scelta 110 / 104 ([conferma](catture/A-ridotto-duel-1366-conferma.jpg),
[dopo il turno, senza sequenza](catture/A-ridotto-duel-1366-dopo.jpg), [attesa FFA](catture/A-ridotto-ffa-1366-attesa.jpg)).

### Confronto e raccomandazione

| | A Riflettore | B Richiamo | C Contrasto |
|---|---|---|---|
| Porta lo sguardo nella sequenza | **forte** (tutto il resto si spegne, primi piani e voli sopra) | medio (autore e bersaglio crescono, il resto resta acceso) | forte (resto grigio) |
| Dice «tocca a te» nella scelta | medio (velo leggero, mano accesa) | **forte** (onda sulla mano) | medio |
| Colpo che «si sente» | lampo | **tremito del tavolo** | pugno e lampo |
| Geometria e `hits` | invariati | spostamenti fino a 14 px e 3,5% | scala 4–6% |
| Colori (regola 11) | invariati, solo più scuri | invariati | cambiati fuori fuoco |
| Movimento ridotto | uguale senza dissolvenza e lampo | la guida sparisce | resta il colore |
| Safari | un poligono per frame | scala per frame su molti nodi | tinta + scala |
| Costo | basso | medio | medio |

**Raccomandazione: A**, eventualmente con il **tremito del colpo di B** come ibrido (solo al colpo, 180 ms, mai con
movimento ridotto), se dal vivo il lampo da solo non basta a far «sentire» il colpo. A è l'unica che non sposta nulla
rispetto agli `hits` e ai controlli, non cambia i colori, resta intera con movimento ridotto ed è la più leggera per
Safari; risolve il punto peggiore della diagnosi (la sequenza) meglio delle altre.

## O29 — Riepilogo giallo in alto

Il riepilogo breve (`toast` di `table.tsx`, C3-6) ripete in parole ciò che dicono già le **carte del round al centro**
(nome della carta e autore, nell'ordine di `resolvedMoves`) e le **strisce del riepilogo** sulle postazioni (variazioni
per posto). Compare all'arrivo della vista, cioè **all'inizio della sequenza**, e resta 6 s.

- **(a) Raccomandata: sostituirlo con un segno visivo.** Il riquadro giallo non si disegna; alla fine della sequenza il
  riquadro delle carte del round (che già apre «Ultimo turno», `round-link`) si illumina con tre impulsi chiari per i
  6 s in cui oggi c'è il riepilogo; con movimento ridotto il contorno chiaro resta fermo. Il testo non sparisce: resta
  in un `role="status"` nascosto alla vista, per lettore di schermo. **Le note dopo un salto di turni (D4, `roundNote`)
  restano come oggi**, testo visibile, perché quell'informazione non è altrove sul tavolo. «Ultimo turno» resta il
  percorso completo (regola 16): carte del round, menu e pannello d'esito. [Catture: dopo la sequenza col bagliore,
  1366](catture/A-duel-1366-dopo.jpg), [844](catture/A-duel-844-dopo.jpg).
- **(b)** Tenerlo, ma solo **a sequenza finita** e accanto alle carte del round, più piccolo. Toglie il conflitto con la
  sequenza ma resta un testo da leggere.
- **(c)** Lasciarlo com'è.

Nel prototipo (a) è attivo insieme a qualunque strategia. Da controllare in Fase B: `VerifyLayout` e `VerifyResolution`
oggi cercano il riepilogo (`briefProblems`, `toast`): con (a) il controllo passa sul `role="status"` e sul bagliore,
senza rilassare soglie; è un cambiamento degli attesi che richiede questa decisione registrata (regola 16).

## O30 — Conferma dello scarto sulla carta scelta

Con una carta legata, dopo la scelta dello scarto, ✓ e × passano **dalla carta posata alla carta scartata**, nella mano,
dove lo sguardo già si trova; la carta posata conserva freccia e contorno. È lo stesso modello di ✓ e × di C4-2 (metà
alta conferma, metà bassa annulla la calata), con la stessa semantica: nessun comportamento nuovo. Tastiera e tocco
restano completi (regola 12): sono gli stessi pulsanti HTML spostati.

Distanza fra carta scartata e ✓: da 523/708 px (duello/FFA 1366) e 220/422 px (duello/FFA 844) a **0**.
[Catture: duello 1366](catture/A-duel-1366-scarto.jpg), [FFA 844](catture/A-ffa-844-scarto.jpg).

- **(a) Raccomandata: a tutte le misure ufficiali.** A 844×390 la carta scartata sollevata misura circa 150×200 px: i
  due pulsanti restano sopra 44 px.
- **(b)** Solo con il tavolo non compatto (altezza ≥ 550 px), come dice O30.
- **(c)** Nessun cambiamento.

## Prototipi: come sono stati provati

- **Fuori dal prodotto.** La patch [`prototipo.patch`](prototipo.patch) (su `c09b946`, SHA-256 `5a8d2b9ab3e947ab…`, `git apply --check` verde sul commit di questa proposta) tocca `src/scene.ts`,
  `src/table.tsx` e `src/style.css` e si attiva solo con `localStorage['bm.guide']` = `A`, `B` o `C`; senza la chiave il
  client si comporta come oggi. **Non è nel commit**: il codice di prodotto committato è invariato. È codice di prova,
  non da applicare così in Fase B (vedi sotto).
- **Strumento.** [`client-web/tools/guide-captures.mjs`](../../../../client-web/tools/guide-captures.mjs), committato:
  avvia da sé il server su database temporaneo (8080 libera), richiede l'anteprima su 4320, imposta la chiave con
  `BM_GUIDE`, gioca duello e FFA e scrive catture e posizioni. Non è una verifica e non fallisce. Esempio:
  `BM_GUIDE=A BM_TURNS=2 BM_OUT=%TEMP%\guida node tools/guide-captures.mjs` (variabili: `BM_SIZES`, `BM_MODES`,
  `BM_REDUCED=1`, `BM_TO_END=1`).

### Come provare i prototipi dal vivo

1. `git apply docs/design/client-c4/guida/prototipo.patch` su un checkout pulito di `c09b946` o successivo compatibile.
2. `./client-web/run.ps1 -Task Build`, poi `Serve` (o `Physical` per l'iPhone) con il server locale.
3. Nella console del browser: `localStorage.setItem('bm.guide','A')` (o `B`, `C`), ricaricare; `removeItem` per tornare
   a oggi. Su iPhone: aprire una volta l'indirizzo con `?` e la console di Safari remota, oppure chiedere alla regia una
   build con la chiave preimpostata.
4. `git checkout -- client-web/src` per togliere la patch.

## Istruzioni per la Fase B (strategia A, O29 (a), O30 (a))

Scritte perché una sessione nuova implementi la scelta senza altro contesto. Se il proprietario sceglie B o C, valgono la
stessa struttura e le note di rischio della strategia scelta.

**Prima.** Registrare la scelta in questa cartella (`scelte.md`) e nel rapporto. Nessuna modifica a regolamento, server,
protocollo, catalogo, `client-debug`, Set Base, audio.

**`src/readability.ts`.** Una funzione pura `guideFocus(input)` che, dati fase del modello, selezione, bersaglio, scarto,
`choosingDiscard`, carte regolari, `hits`, postazioni del layout, istante della sequenza e intervalli delle carte
(`{from,to,hit,author,target}`), restituisce `{kind, boxes, hit?}` come nella tabella del fuoco; e `guideVeil(kind)` con
le intensità. Pura e testabile come `aimArrows` e `confirmButtons`.

**`src/scene.ts`.** Un `Graphics` `guideG` fra `world` e `aimLayer` (`stage.addChild(background, decor, world, guideG,
aimLayer, fx)`), `eventMode='none'`. In `beginSequence`, per ogni carta, l'intervallo `{from: P.cost.at, to: end, hit,
author, target}` accanto a `stats.schedule` (stessi tempi, nessun tempo nuovo). In `tick`, dopo `drawAim`, ridisegno del
velo: rettangolo pieno e un `cut()` per foro (margine 7 px, 10 in sequenza), dissolvenza esponenziale (0,18 per frame),
lampo al colpo; con `reduced` velo diretto e niente lampo. Esporre in `window.__bm.state` il fuoco (`guide:{kind,boxes,alpha}`)
per le verifiche. Pulire gli intervalli in `stopEffects`. Dove il prototipo prende scorciatoie (calcolo dentro la scena,
`cut()` su riquadri non ruotati), la Fase B usa la funzione pura e i riquadri degli `hits`.

**`src/table.tsx` e `src/style.css`.** O29 (a): niente riquadro `.toast` se `roundNote` è vuoto; testo in un `role="status"`
nascosto (classe `.sr-only`); classe `guide-glow` su `.round-link` per i 6 s del riepilogo, con
`@media (prefers-reduced-motion: reduce)` statico. Le note di `roundNote` restano visibili come oggi. O30 (a): con
`model.discard` scelto, `confirmAt` usa il riquadro della carta scartata invece della carta posata; `covers` segue da sé.
Nel prototipo il riquadro è quello dell'`hit` sollevato, che comprende l'area del sollevamento ed è un po' più alto della
carta disegnata ([cattura](catture/A-duel-1366-scarto.jpg)): in Fase B usare il riquadro della carta come è disegnata
(posizione sollevata, `H.w×H.h` per lo zoom), e la sua rotazione come fa lo strato semantico.

**Test (`client-web/tests`).** `guideFocus` per ogni momento (scelta, mira con 1 e 4 bersagli, conferma con e senza
scarto, scarto, attesa, sequenza a metà di ogni carta, selezione durante la sequenza che vince, esito vuoto); il velo non
ha fori fuori schermo; con `reduced` niente lampo; O30: la conferma segue la carta scartata e cambia carta se cambia lo
scarto; O29: con nota visibile il riepilogo resta, senza nota diventa stato nascosto. Mutazioni: togliere la priorità
della selezione, togliere il cambio di `confirmAt`, ridare il riquadro giallo devono far fallire almeno un test.

**Verifiche (matrice C4-10).** `Verify` (+750), `VerifyFfa`, `VerifyAim`, `VerifyResolution` completa, `VerifyLayout`
(+750), più `Test`, `Build`, `Size`, `build.ps1 -Task Test -Offline`, `check-rules.py`. In `VerifyLayout` e
`VerifyResolution` il controllo del riepilogo breve diventa: stato nascosto presente con lo stesso testo, bagliore su
`round-link`, nessun `.toast` visibile senza nota; le altre soglie e `BASE_750` invariati. `VerifyAim` deve trovare ✓ e
× sulla carta scartata, sempre ≥ 44 px. Con movimento ridotto (`VerifyAim reduced`, `VerifyResolution reduced`) il velo
c'è ed è fermo. Catture finali con [`guide-captures.mjs`](../../../../client-web/tools/guide-captures.mjs) e
`BM_REDUCED=1`.

**Da non fare.** Cambiare durate o calendario della sequenza (O19 è di C5), aggiungere attese all'input, legare il velo
a coordinate fisse, oscurare il guscio HTML, togliere «Ultimo turno».

## Verificato e non verificato

**Verificato:** catture su partite reali in Edge/PC, duello e FFA, 1366×768 e 844×390, prima e con i tre prototipi
(due o tre turni per partita, 0 errori di pagina); A anche con movimento ridotto emulato a 1366×768; posizioni, distanze
e luminanza lette dalla scena, dal DOM e dalle catture ([misure](misure.json)). Jar ricostruito in locale
(`aa312de0c47327e7`).

**Non verificato:** iPhone e Safari (fluidità, costo del velo e delle scale), fluidità percepita in generale (le catture
sono fotogrammi fermi, il movimento di B non si vede), effetto sui lettori di schermo del `role="status"` nascosto, il
pannello d'esito con le strategie, il movimento ridotto di B e C (solo letto nel codice, non catturato), partite fra
due umani (attesa lunga). Nessuna verifica di Fase B eseguita sui prototipi: non sono prodotto.
