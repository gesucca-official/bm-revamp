# SB-30b — Progetto tecnico del Difficile e del Maestro

**Versione 0.1 — 14 novembre 2026. Motivazione: il proprietario ha deciso quattro livelli di bot, con il Difficile che prevede due turni e il Maestro che cerca su più turni con mani campionate, nessuno che bara ([D85](../../set-base-plan.md#decisioni-del-proprietario)), e ha anticipato i due livelli forti nel playground, in parallelo al bilanciamento ([D89](../../set-base-plan.md#decisioni-del-proprietario)). Questa è la Fase A di SB-30b: progetto, sonda di costo e fedeltà (B4 della [proposta](bot-livelli-proposta.md#stima-a-blocchi)) e proposta di budget. STOP dopo il commit: nessuna classe esistente toccata, nessuna misura di livelli o di bilanciamento.**

Fonti: [proposta dei livelli](bot-livelli-proposta.md) (approvata in D85), D76, D77, D85, D89 e la sezione [SB-30](../../set-base-plan.md#sb-30--bot-nelle-partite-contro-computer) del piano, [rapporto del bot consapevole del colpo letale](../../reports/set-base/sb-16g-bot-letale-report.md), codice in `server/src/main/java/com/gsc/bm/model/game/bot/`. Numeri della sonda: [rapporto](../../reports/set-base/sb-30b-sonda-report.md).

## 1. Punto di partenza

- `BotView` è una copia dei dati pubblici senza riferimenti al motore; `BotView.legalMoves()` è l'unico modo di creare una `LegalMove`. I costruttori di `BotView` e delle classi annidate sono pubblici (Lombok `@Value`): una vista si può **costruire** da uno stato simulato, e ogni politica esistente ci gioca sopra senza cambiare.
- `TurnForecast` prevede **il turno in corso** e restituisce solo la salute a fine turno: non porta avanti risorse, stati con la loro durata, gettoni, mano e mazzo. La classe interna `Turn` è privata. Per due o più turni serve quindi uno stato che sopravviva alla fine del turno.
- Il testo stampato (`PrintedEffects`) non dice tre cose che sono scritte sulla carta e quindi pubbliche: **durata e uso singolo** di uno stato, **la carta cercata** da una ricerca, **i tipi di danno** del gettone. Nella sonda le legge una tabella di test dalla definizione della carta a dati; nel prototipo vanno esposte come testo (§5, domanda 3).
- `BotPolicy` chiede politiche senza stato e il banco condivide **la stessa istanza** di politica fra partite e thread (`Bench.Settings.styles`). Il Maestro ha bisogno di memoria della partita (§2.4): va creato **per giocatore**, con una `PlayerSource` come fa già `LethalBotMeasureTest`, senza cambiare il banco.

## 2. Architettura

Tutto in classi **nuove** del pacchetto `bot`; `TurnForecast`, `LethalAwarePolicy`, stili, banco e motore restano identici byte per byte. Il Normale resta `LethalAwarePolicy` (D85 punto 5).

```text
            BotView (+ liste pubbliche degli starter, D85.3)
               │
   ┌───────────┴─────────────┐
   │                         │
DifficilePolicy          MaestroPolicy ── PublicMemory (solo dalle viste ricevute)
   │                         │              │
   │                         └── WorldSampler (mani e mazzi coerenti con la vista)
   │                                        │
   └──────────── ViewTable ─────────────────┘   (stato su copie, più turni)
                     │
          view(seat) → BotView → stili e Normale come modelli e rollout
```

### 2.1 `ViewTable`: la tavola su copie, più turni

Porta il turno di `TurnForecast` a uno stato che continua (la sonda lo prova in `Sb30bWorld`, sorgenti di test). Contiene per ogni posto risorse, immunità, stati (moltiplicatori con durata, uso singolo, gettone e carta che lo chiude; gli altri stati come opachi che scadono), oggetti, mano, mazzo, segni delle ricerche. Un turno:

1. costi di tutti, poi gruppi di velocità per priorità e ALERTNESS dopo i costi, spareggio per posto al tavolo (pubblico);
2. autore a terra a inizio gruppo annullato, salvo su sé o «Ultimo colpo» (D50 punto 1); segno soddisfatto se l'autore gioca la carta che lo chiude;
3. passi stampati come `TurnForecast` (danno con stati in uscita e in entrata, uso singolo consumato, corazza L/4, pavimento a zero; guadagni, perdite, stati, consumo di un oggetto, immunità, contromosse), poi scarto della carta giocata e **pesca o ricerca** dal mazzo, gettone solo se trova (D71–D72);
4. fine turno come il motore: gettoni soddisfatti chiusi, ultima copia assente (D71), POISON della TOXICITY, effetto ALCOHOL (ALERTNESS −L/2, L −(L/2+1)), durate che scadono.

Due modi. **Previsione**: mano avversaria nota solo come numero, nessun mazzo, ricerca trovata o no come variante (come oggi). **Mondo**: mani e mazzi concreti da `WorldSampler`; la ricerca trova ciò che il mazzo campionato contiene, la pesca segue l'ordine campionato. `view(posto)` restituisce una `BotView` di quel posto, con cui gli stili scelgono le mosse dell'avversario e i propri seguiti.

**Fedeltà** (sonda, 300 partite reali `d50`): al primo turno **5.412/5.412** come `TurnForecast`; a due turni, con le mosse davvero giocate nei due turni, **2.930/2.934 sulla salute e 2.902/2.934 su tutte le risorse** quando fra i due turni non arriva un oggetto nuovo in campo; quando arriva (pescato a fine del primo turno, ignoto a chi prevede) 1.666/1.858. Il secondo caso non è un errore del modello: in modo mondo la pesca è campionata. I 4 scarti restanti (2 situazioni viste dai due posti, con «Spallata al bancone» nella coppia) sono da spiegare all'inizio di B5.

Non coperto, come oggi: i **timer** (non stampati), gli stati che agiscono su una risorsa invece che su un danno, la parte «x» di una carta che non sa descriversi (nella bozza non ce ne sono). Il test di fedeltà li esclude o li dichiara come `TurnForecastFidelityTest`.

Equivalenza: un test permanente controlla che `ViewTable` al primo turno dia **le stesse varianti** di `TurnForecast.variants` sul campione di fedeltà. Così le due previsioni non si separano. Fare delegare `TurnForecast` a `ViewTable` è una semplificazione possibile **dopo** SB-28, non ora (cambierebbe una classe del Normale).

### 2.2 Difficile: previsione su due turni, senza mani campionate

Il Difficile vede ciò che vede il Normale (nessuna mano coperta, D77 punto 4), ma due turni:

1. **Restrizione del Normale** sul turno in corso (`TurnForecast.prefer`, invariata): salvo prima di tutto, colpo sicuramente letale se c'è, patta invece di sconfitta (D77).
2. Fra le mosse rimaste, per ogni mossa *m1* contro ogni colpo mostrato e pagabile e contro «nessuna mossa nota», in ogni variante: la miglior risposta propria *m2* dalla mano rimasta (più la carta trovata se la variante lo dice), contro i colpi che l'avversario mostra al secondo turno, in ogni variante. Valore di *m1* = caso peggiore sulle minacce pubbliche e sulle varianti, migliore sulle proprie risposte.
3. Valutazione a fine del secondo turno con la stessa funzione del Maestro (§2.6); lo **stile spareggia** le mosse entro una soglia, così la personalità resta.

Cosa guadagna sul Normale: vede il colpo mostrato che arriverà al turno dopo (una carta trovata oggi si gioca domani, D74), il gettone che si accende o si spegne, il veleno e l'alcol che passano il turno, la risorsa che non basterà per pararsi. Cosa non vede: la mano coperta e la pesca. Costo: §3.3.

### 2.3 Maestro: ricerca per determinizzazione

Ogni decisione:

1. **Campiona *N* mondi** con `WorldSampler` (§2.4), ciascuno con il suo seme derivato dal `Random` dato.
2. **Numeri casuali comuni:** in ogni mondo si gioca **ogni mossa legale** con lo stesso seme. Il confronto fra mosse vede lo stesso mondo, la stessa pesca, la stessa scelta dell'avversario quando non dipende dalla mia mossa.
3. Per *H* turni (proposto 3): al primo turno la mia mossa candidata contro la mossa che il **modello avversario** sceglie dalla sua vista del mondo (simultanea: non vede la mia); poi entrambi scelgono col Normale del proprio stile.
4. Valore a fine orizzonte (§2.6), media sui mondi; si sceglie la media migliore; a parità decide lo stile.
5. **Anytime:** i mondi sono il ciclo esterno. A ogni mondo finito tutte le mosse hanno lo stesso numero di valutazioni; allo scadere del tempo massimo si sceglie su quelli finiti (§2.7).

**Avversario ipotizzato.** Nella sonda una miscela dei tre stili del Normale, uno per mondo a rotazione: nessun minimax (bot troppo pessimista) e nessun avversario fisso (sfruttabile), come chiede la proposta (§3.2). In B5 i pesi della miscela si stimano dalla storia pubblica (frequenza di parate, cure, colpi, cariche), partendo da pesi uguali (§3.3 della proposta). Il regret matching sui casi con colpo letale in gioco resta un'aggiunta da provare solo se la scala lo chiede.

### 2.4 Mani e mazzi dalla sola vista pubblica

`WorldSampler` costruisce un mondo da tre fonti, tutte pubbliche:

- la **vista** (mano propria, mano mostrata dell'avversario, oggetti in campo, numero di carte in mano e nel mazzo, gettoni, ultimo round);
- le **liste pubbliche**: lo starter di ciascuno, come deciso in D85 punto 3; con un mazzo personalizzato solo le carte già viste e quelle del personaggio;
- `PublicMemory`, la memoria del Maestro, aggiornata **solo** dalle viste che riceve a ogni decisione: carte giocate da ciascuno, carte trovate e ricerche fallite (pubbliche, D50 punto 6), oggetti arrivati in campo, carte proprie pescate.

Regole di campionamento:

- **Mio mazzo:** la mia lista meno le carte che ho visto passare (mano, giocate, oggetti in campo), in ordine casuale: nemmeno il proprio ordine è noto (proposta §2).
- **Mano avversaria coperta:** le carte fisse del personaggio (base e legate, pubbliche), le carte mostrate, poi un campione senza ripetizione dal resto della lista meno le carte già viste uscire; **senza oggetti** (un oggetto pescato va in campo, non resta in mano).
- **Mazzo avversario:** il resto, in ordine casuale, della lunghezza pubblica.
- **Vincoli pubblici:** una ricerca fallita dice che in quel momento il mazzo non aveva copie di quella carta; il campione la rispetta (scarto e nuova estrazione, al più un numero fisso di tentativi, poi il campione libero).
- Nessuna inferenza dalle mosse dell'avversario sulla sua mano (il «perché non ha giocato X») nel prototipo: è il punto in cui si potrebbe barare di fatto senza volerlo e va proposto a parte, con prova.

La sonda usa una versione semplificata (senza memoria: toglie solo le carte dell'ultimo round) e misura quindi un costo e un rumore realistici, non una qualità di gioco.

### 2.5 Stato e contratto `BotPolicy`

Il Maestro ha stato (`PublicMemory`), quindi:

- un'istanza **per giocatore** e per partita, creata dalla fabbrica (`PlayerSource` nel banco, la fabbrica di SB-30a in partita viva), mai condivisa;
- serializzabile, come il resto del giocatore: le copie del motore la copiano;
- aggiornata **solo** dentro `choose(view, …)` e solo con dati della vista: non è un canale per altro.

L'alternativa, aggiungere a `BotView` la storia pubblica completa, toccherebbe una classe che tutti i bot usano: si propone dopo il prototipo, se serve (domanda 4).

### 2.6 Valutazione a fine orizzonte

Partita finita: +1 vittoria, −1 sconfitta, 0 patta. Altrimenti, nella sonda, differenza di salute / 100 limitata a ±0,95. In B5 si aggiungono termini piccoli e tarabili sul banco: colpi mostrati e pagabili dalle due parti, gettoni attivi, veleno e alcol che matureranno, carte in mano che si possono pagare al turno dopo. **La sonda dice che la valutazione conta:** con N = 100, il Maestro a 2 e a 3 turni sceglie la stessa mossa solo nel **63%** delle decisioni. La taratura della valutazione è quindi il centro di B6, non un dettaglio.

### 2.7 Tempo massimo e riproducibilità

- Il Maestro riceve un tempo massimo (proposto: si ferma a **800 ms**, sotto il tetto di 2 s con margine per macchine più lente e partite contemporanee, B7). Lo controlla **fra un mondo e l'altro**: un mondo costa da 1 a 6 ms nella sonda, quindi l'interruzione arriva al più qualche millisecondo dopo. Se il tempo scade prima del primo mondo, gioca la scelta del Normale.
- Un tempo massimo rende la scelta dipendente dalla macchina. **Nelle misure** si usa quindi un *N* fisso senza tempo massimo (partite ripetibili con il seme, come oggi); il tempo massimo è la rete di sicurezza della partita giocata. L'archivio registra *N* usato e mondi completati.
- Un thread per decisione. Parallelizzare i mondi su più core è possibile ma non proposto: il server è condiviso (proposta §3.5).

## 3. Costo misurato (sonda B4)

Un thread, 150 decisioni da partite reali `d50` della bozza (Normale contro Normale, stili e mazzi misti), mediana 9 mosse legali (massimo 14). Dettagli e comandi nel [rapporto](../../reports/set-base/sb-30b-sonda-report.md).

### 3.1 Maestro: costo per decisione

| Mondi *N* | Orizzonte | Mediana | P90 | Massimo |
|---:|---:|---:|---:|---:|
| 10 | 2 turni | 15 ms | 23 ms | 33 ms |
| 40 | 2 turni | 61 ms | 89 ms | 133 ms |
| 100 | 2 turni | 153 ms | 222 ms | 350 ms |
| 10 | 3 turni | 23 ms | 36 ms | 56 ms |
| 40 | 3 turni | 91 ms | 145 ms | 210 ms |
| 100 | 3 turni | 229 ms | 352 ms | 565 ms |
| 400 | 2 turni (riferimento) | 611 ms | 875 ms | 1.743 ms |

Il costo è lineare in *N* e nelle mosse: circa **0,17 ms per mondo e mossa a 2 turni, 0,26 ms a 3 turni**. Il Normale costa 0,11 ms per decisione (mediana; P90 0,20 ms). Con *N* = 100 e 3 turni la mediana è un quarto della soglia di D85 (1 s) e il massimo un terzo del tetto (2 s): resta margine per la memoria, il modello dell'avversario e la valutazione più ricca di B5.

### 3.2 Rumore della scelta al variare di *N*

Contro un riferimento con *N* = 400 su mondi indipendenti, a 2 turni:

| *N* | Stessa mossa del riferimento | Perdita media rispetto al riferimento | Errore standard della mossa scelta |
|---:|---:|---:|---:|
| 10 | 80,0% | 0,010 | 0,073 |
| 40 | 88,0% | 0,0036 | 0,038 |
| 100 | 90,7% | 0,0014 | 0,024 |

Le unità sono quelle della valutazione: 0,01 vale un punto di salute di differenza. Le mosse su cui *N* = 100 e *N* = 400 non concordano hanno valori quasi uguali (perdita media 0,0014): oltre 100 mondi si guadagna poco.

### 3.3 Difficile: due turni esaustivi

Limite superiore del Difficile di §2.2, senza potature né cache: ogni mossa propria contro ogni colpo mostrato e «nessuna mossa», in tutte le 8 varianti; poi ogni risposta propria contro i colpi mostrati al secondo turno, in tutte le varianti. Sulle stesse 150 decisioni: **mediana 5,8 ms, P90 11,6 ms, massimo 22,8 ms**, da 3.912 (mediana) a 11.952 turni simulati. Il Difficile resta «istantaneo» nel senso di D85 punto 4 (sotto 50 ms) anche senza ottimizzare.

### 3.4 Nessuna informazione nascosta

La sonda ha provato in piccolo la prova permanente (§4): 20 posizioni reali, mano coperta dell'avversario cambiata in 20 su 20, mazzi rimescolati; viste identiche, **stessa mossa e stessi valori per mossa** in 20 su 20.

## 4. Come si dimostra «nessuna informazione nascosta»

La prova permanente della proposta (§2), per tutti i livelli, in tre parti:

1. **Confine dei tipi.** Difficile e Maestro implementano `BotPolicy` e ricevono solo `BotView`, `LegalMove` e `Random`. Gli altri ingressi sono pubblici per decisione: le liste degli starter (D85 punto 3) e la `PublicMemory`, che si costruisce solo da viste. Un test legge i sorgenti delle classi nuove del pacchetto `bot` e fallisce se importano `Game`, `Player`, `ComPlayer`, `Character`, `Move` o `java.lang.reflect`.
2. **Proprietà sul comportamento** (la prova della proposta). Per ogni livello, *K* posizioni da partite reali; per ciascuna una copia della partita in cui cambia solo ciò che non si vede: mano coperta dell'avversario (scambi con carte del mazzo di nome diverso), ordine di entrambi i mazzi, **mossa già inviata dall'avversario** (in partita viva l'umano può inviare prima del computer), stato del generatore dell'avversario. Le viste devono essere uguali e la mossa scelta, a parità di seme, identica; per il Maestro anche i valori per mossa. Se un livello legge un dato nascosto il test cade.
3. **Memoria.** Due partite con la stessa sequenza di viste e diverso nascosto portano a memorie uguali (stesso confronto, sulla serializzazione della memoria).

Il prototipo di 2 è nella sonda (`Sb30bProbeTest#hiddenInformationDoesNotChangeTheChoice`). In B5 diventa un test sempre attivo (pochi secondi con *N* piccolo), per Normale, Difficile e Maestro.

Nota: il `Random` del giocatore è lo stesso che ha mescolato il mazzo all'inizio. Una politica che ne ricostruisse lo stato potrebbe in teoria risalire all'ordine del mazzo: il divieto di `java.lang.reflect` e l'uso del solo `Random` per estrarre numeri chiudono la strada; la prova 2 col generatore dell'avversario cambiato lo rende visibile se accadesse.

## 5. Piano a blocchi

Stime aggiornate dalla sonda. S ≈ 1 sessione, M ≈ 2, L ≈ 3–4 (come la proposta).

| Blocco | Contenuto | Dimensione | Calcolo |
|---|---|---|---|
| **B5a** | `ViewTable` nel pacchetto `bot` (dalla sonda), testo stampato completato con durata, uso singolo, carta cercata e tipi del gettone (domanda 3), equivalenza col primo turno di `TurnForecast`, fedeltà a due turni permanente con i 4 scarti spiegati, mutazioni | M | ≤ 300 s |
| **B5b** | `DifficilePolicy`, scenari espliciti (colpo mostrato al turno dopo, gettone che scade, veleno, risorsa che manca), prova anti-barare sempre attiva per Normale e Difficile, costo sotto 50 ms al P90 | S–M | ≤ 300 s |
| **B5c** | `PublicMemory`, `WorldSampler` (regole di §2.4), `MaestroPolicy` con numeri comuni, miscela di stili, tempo massimo, anti-barare per il Maestro, costo con *N* e *H* scelti, piccola partita di prova contro il Normale (non una scala) | M–L | ≤ 1.200 s |
| **B6** | Scala a quattro livelli sul banco, taratura della valutazione e dei pesi della miscela, prova umana alla cieca (proposta §4.2) | M | budget §6 |

Prima stima della proposta: B4–B6 = 6–8 sessioni. Dopo la sonda: **B5 5–6 sessioni, B6 2**. Il rischio tecnico più grosso (costo) è chiuso: il Maestro sta nella soglia con margine. Restano due rischi di taratura, non di tempo: la valutazione a fine orizzonte (§2.6, il 63%) e il campionamento su una bozza ancora in cambiamento (la scala si rifà a pool fermo, D85).

## 6. Budget proposto per B5 e B6 (D85 punto 7)

Le misure dei livelli non sono giri di bilanciamento: budget **separato** da D68 e dai 7.200 s della proposta 1.5, mai in contemporanea con una misura di bilanciamento (D85 punto 8, D89).

Stima del costo di una partita: 12 decisioni per posto del Maestro (ordine di grandezza della proposta, §4.1; da confermare in B5), costo per decisione della tabella 3.1, 8 thread con resa lineare (**non verificata**). Scala della proposta: 15 incontri × 2 posti × 100 semi = 3.000 partite per coppia; le coppie col Maestro sono 3 più lo specchio (due Maestri per partita).

| Opzione | Maestro nelle misure | CPU per partita col Maestro | Una scala completa (8 thread) | Taratura B6 | Totale B6 | Rischio |
|---|---|---:|---:|---:|---:|---|
| **A, consigliata** | *N* = 100, 3 turni (quello giocato) | ~2,8 s | ~1,5 h | ~3 h | **≤ 18.000 s** | misura il Maestro vero |
| B | *N* = 40, 3 turni | ~1,1 s | ~35 min | ~1,5 h | ≤ 9.000 s | Maestro misurato un po' più debole di quello giocato (88% di scelte uguali al riferimento a 2 turni) |
| C | *N* = 40, 2 turni, 50 semi | ~0,7 s | ~10 min | ~45 min | ≤ 3.600 s | intervalli ±2,6 punti invece di ±1,8; orizzonte diverso da quello giocato |

B5 in tutte le opzioni: **≤ 1.800 s** (somma della colonna «Calcolo» di §5), compresa una partita di prova Maestro contro Normale di qualche centinaio di partite.

Regole proposte per il budget: contato in secondi di orologio del test come i giri di D68; tetto dichiarato prima di ogni corsa; la scala completa si fa **una volta** a pool fermo (D85), le iterazioni di taratura a campione ridotto (30 semi); se una stima sbaglia di più del doppio, STOP e nuova proposta.

## 7. Domande al proprietario

1. **Difficile senza mani campionate.** Il Difficile vede due turni ma, come il Normale, non considera la mano coperta né la pesca: il campionamento resta la differenza del Maestro. Confermi? (Alternativa: Difficile con pochi mondi a 2 turni, cioè un Maestro ridotto; più forte, ma i due livelli diventano la stessa cosa a due intensità.)
2. **Budget di calcolo dei livelli:** opzione A (≤ 1.800 s per B5, ≤ 18.000 s per B6, separati da D68 e dalla 1.5), B o C?
3. **Testo stampato completato in B5.** Per prevedere due turni servono durata e uso singolo degli stati, carta cercata e tipi del gettone, che sono scritti sulla carta ma non in `PrintedEffects`. Aggiungerli è un cambio **additivo** a due classi esistenti (`PrintedEffects`, `DataCards`), che nessun bot di oggi legge: proposto con le prove d'identità (banco vivo, fedeltà, `ChargeMeasureTest` sul passo 3). Va bene, o preferisci che B5 lo eviti con una tabella separata (più fragile, da tenere allineata alla bozza)?
4. **Memoria del Maestro** in un'istanza per giocatore (§2.5), invece di aggiungere la storia pubblica a `BotView`. D'accordo per il prototipo?
5. **Misure ripetibili:** nel banco il Maestro gioca con *N* fisso e senza tempo massimo; il tempo massimo (800 ms, tetto 2 s) vale solo in partita. D'accordo?

## Stato del documento

Versione 0.1, Fase A: progetto e sonda **consegnati, da approvare**. Nessuna classe esistente modificata; classi nuove solo nei sorgenti di test (`Sb30bWorld`, `Sb30bProbeTest`), attive solo con `-Dsim.sb30b`. Non toccati: regolamento, `docs/sets`, catalogo, client, partita viva, banco, bozza, piano, README.
