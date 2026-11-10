# Tutorial — la prima sera al bar

> Scaletta di progetto, senza valore normativo ([regole del serbatoio](README.md#regole-del-serbatoio)). Idee del proprietario del
> 10 novembre 2026; le aggiunte della regia sono segnate *Variante della regia*. I dialoghi veri si scrivono dopo; qui ci sono scene,
> partite e cosa insegnano.

**Forma.** Lineare: quattro scene e tre partite, che presentano Mara, Spazienzio e Piera. Ogni vittoria sblocca lo starter del personaggio
appena giocato (D18). Le partite sono guidate a metà: i primi turni con mosse suggerite, poi libere con indizi. Se il giocatore perde,
ritenta con i dialoghi saltabili (D15). Il tutorial si può saltare, per chi ha già giocato.

## Scene e partite

### Scena 0 — Davanti al bar

Il giocatore decide di provare un bar nuovo, **[nome del bar da inventare]**, con la sua combriccola di amici. Il nome potrebbe diventare
anche il nome del gioco, se viene in mente qualcosa di meglio di «Botte Micidiali».

Arriva **Mara**, in bici, con la consegna ancora calda: è la sua presentazione. Dice qualcosa di strano, uno dei suoi pipponi complottisti o
due frasi senza senso, e fa scappare tutti. Al giocatore però non permette di andarsene.

- *Variante della regia*, perché Mara lo trattiene: è convinta che il giocatore sia il cliente della consegna; oppure le serve un testimone
  per il complotto che sta scoprendo nel bar; oppure «da soli lì dentro non si entra, c'è il segnale».
- **La combriccola che scappa tornerà** nella carriera principale: quando si sblocca il PvP, a circa un terzo, «i tuoi amici tornano al bar».

### Scena 1 — Il trambusto

Dall'interno si sente un gran trambusto. Mara trascina dentro il giocatore. Trovano **Spazienzio** che sta dando di matto: è la sua
presentazione. Vedendo due persone nuove, le aggredisce.

### Partita 1 — Mara contro Spazienzio (duello)

Mara prende le parti del giocatore, che gioca **Mara** con lo starter «Consegna sul muso». Spazienzio è il bot, con mosse scriptate per
mostrare il contrasto fra i due: lei rapida, lui lento e pesante.

**Insegna:** costo delle carte e A come precedenza; CUT a priorità alta; la difesa del turno; una bound, che si gioca scartando un'altra
carta e resta in mano; la lettura del round, con il colpo grosso di Spazienzio che arriva da lontano.

**Vittoria:** sblocca «Consegna sul muso».

### Scena 2 — Il cane di Piera

Spazienzio si calma, si fa per dire, e urla che cosa lo aveva fatto arrabbiare: **il cane di Piera** lo ha fatto inciampare. **Piera** lo
sente, nella sua lingua della grappa, e si arrabbia. Spazienzio scarica la colpa sul giocatore: «È COLPA DI QUESTO QUA!». Piera viene
addosso al giocatore, e Spazienzio, che non vede l'ora di perdere di nuovo la pazienza, prende le parti di uno appena conosciuto:
«VA BENE, VA BENE, CI PENSO IO».

Piera è il primo personaggio avanzato che il giocatore incontra: si fa conoscere da avversaria, come Sergio e Duccio nella principale.

### Partita 2 — Spazienzio contro Piera (duello)

Il giocatore gioca **Spazienzio** con lo starter «Pazienza finita». Piera è il bot, col suo starter «Chiude quando dico io», ma con mosse
scriptate semplici: la sua L che cala è complicata, e qui il giocatore deve pensare al proprio personaggio.

**Insegna:** accumulo di V; colpo grosso a priorità bassa contro colpo rapido; parata che riduce l'HIT e carica V; annullamento con
«Fermati!», la contromossa della sua [scheda](../set-base/schede-personaggi.md#1-spazienzio-de-la-ucciso--base).

**Vittoria:** sblocca «Pazienza finita».

### Scena 3 — Con chi stai?

La lite si allarga ai tre: Mara, Spazienzio e Piera, col cane in mezzo. **Prima scelta muta** (D16): si offrono sia Mara sia Spazienzio, e il
giocatore sceglie con chi andare. Nel tutorial le due scelte portano alla stessa partita, ma insegnano il gesto che nella principale
ramifica il percorso.

- *Variante della regia:* la scelta lascia un segno (`tutorial_con = mara | spazienzio`) che la carriera principale può usare per una
  battuta di chi è stato lasciato: «MI HAI MOLLATO PER QUELLA?».

### Partita 3 — Tutti contro tutti a tre (FFA)

Il giocatore gioca il personaggio scelto, con il suo starter; gli altri due sono bot. R01 consente di partire con tre giocatori (avvio
anticipato con almeno due iscritti).

**Insegna:** più avversari e bersagli, frecce di mira, chi colpisce chi nel round; **la last resort**, che entra in mano quando il mazzo
regolare finisce.

**La last resort senza barare sul mazzo.** Con 20 carte regolari e 3 in mano all'inizio, ne restano 17 nel mazzo: servono almeno una
quindicina di turni prima che compaia. L'idea è scriptare i bot perché la partita duri abbastanza (giocano lenti, si difendono, si
colpiscono anche fra loro), con mazzi conformi a R02. Prima di deciderlo va misurato col runner con seme quanto dura una partita così e se
la last resort arriva al momento giusto. **Ripiego:** mazzi accorciati per il tutorial, come modificatore di incontro dichiarato nel
documento della carriera.

### Scena 4 — Chiusura e aggancio

La rissa finisce. Il tutorial si chiude con un aggancio alla carriera principale, da scrivere quando ci sarà la sua storia.

- *Variante della regia:* Mara esce e la bici non c'è più: «COMPLOTTO!».

## Cosa insegna, in sintesi

| Partita | Personaggio del giocatore | Avversari | Meccaniche |
|---|---|---|---|
| 1 | Mara | Spazienzio | Costi, A e precedenza, CUT, difesa del turno, bound, lettura del round |
| 2 | Spazienzio | Piera | V, colpo grosso contro colpo rapido, parata che carica, annullamento |
| 3 | Mara o Spazienzio | gli altri due | FFA, bersagli multipli, frecce, last resort |

Restano fuori, per la principale: oggetti ed equip in dettaglio, POISON, la L di Piera, il mazzo costruito e l'editor.

## Domande aperte

1. **Nome del bar,** forse anche titolo del gioco.
2. **Perché Mara trattiene il giocatore,** fra le varianti sopra o un'altra.
3. **La combriccola:** quanti amici, se hanno un nome e se parlano. Il giocatore no, loro possono.
4. **La last resort nella partita a tre:** da misurare col runner; se non arriva al momento giusto, mazzi accorciati.
5. **L'aggancio finale,** quando c'è la storia della principale.
