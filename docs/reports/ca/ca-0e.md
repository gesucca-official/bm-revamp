# CA-0e — Modificatori di incontro: proposta

Proposta del 26 novembre 2026, passo con proposta ([piano](../../ca-plan.md#ca-0e--modificatori-di-incontro)). **Esito:** in attesa
della decisione del proprietario. Nulla è applicato.

## In breve

Un **modificatore di incontro** è una deroga dichiarata a una regola, valida per una sola partita di carriera. Il regolamento ne definisce
sei **primitive** (Vista, Pesca, Mazzo, Recupero, Bersagli, Protezione) con i parametri; un **catalogo** normativo nuovo,
`docs/carriere/modificatori.md`, dà a ciascun modificatore concreto nome, testo mostrato e primitiva; la storia lo nomina e lo strumento
lo risolve, con errore se non esiste. Bara solo chi ha un modificatore dichiarato e mostrato; fino a CA-0f la partita viva non cambia.

## 1. Inventario

| Nodo | Testo | Cosa fa in partita | Regola derogata | Primitiva |
|---|---|---|---|---|
| III3b, FFA a tre | ce l'hanno tutti con te | Sergio e Duccio bersagliano solo il giocatore, quando la carta lo consente | scelta del bersaglio del computer (livello, regola del computer di SB-30a) | Bersagli |
| S1, duello contro Piera | il cane difende le sue cose | **Solo accennato.** (a) gli oggetti di Piera non si toccano: le carte del giocatore non possono rubarli, distruggerli o bersagliarli; (b) solo racconto, nessun effetto | (a) R03/R04 sui bersagli degli oggetti | (a) Protezione |
| S1 | la cantina è buia | **Solo accennato.** (a) il giocatore non vede risorse e oggetti di Piera, solo i propri e le carte mostrate; (b) solo racconto (lo sfondo è già la cantina) | (a) R08, tavolo pubblico | (a) Vista, in meno |
| S2, superboss | ha letto i tuoi messaggi | Sergio vede la mano del giocatore (principale.md, S2) | R08; la regola del computer «solo informazioni di un giocatore» (SB-30a, 2.2) | Vista, in più |
| S2 | ha comprato il mazzo | Sergio pesca due volte (principale.md, S2) | R02, «una sola pesca» | Pesca |
| S2 | società apri e chiudi | «Ogni tanto» una carta scartata da Sergio torna in mano (principale.md, S2) | R02, gli scarti non tornano | Recupero |
| Tutorial, ripiego non scritto | mazzi accorciati | Mazzo regolare sotto le 20 carte, perché la last resort arrivi presto | R02, 20 carte regolari | Mazzo |

Vista in più serve solo con un livello che sfrutta la mano: lo fissa l'incontro (D85 (6)) e si misura in CA-3.

## 2. Il sistema: testo proposto per il regolamento

Sezione nuova **R08a**, dopo R08 perché deroga soprattutto a informazioni e confini, più una frase in R00 e una in R01. Bozza, **non applicata**:

> **R00, Modificatori di incontro (2.x).** Una partita di carriera può avere modificatori di incontro (R08a). Un modificatore deroga solo
> alle regole che la sua primitiva nomina, e solo per quella partita; su quel punto prevale su regolamento e schede, in ogni altro caso
> valgono loro come sempre.
>
> **R01**, in coda alle modalità: «Le partite di carriera seguono le modalità che la carriera dichiara e possono avere modificatori (R08a);
> le quick, open e PvP non ne hanno mai».
>
> ## R08a — Modificatori di incontro (2.x)
>
> Un modificatore di incontro cambia una regola per una sola partita di una carriera. È definito nel catalogo dei modificatori
> (`docs/carriere/modificatori.md`) con un nome, un testo per chi gioca e una delle primitive qui sotto, con i suoi parametri. Ogni
> parametro indica un **posto** della partita: il giocatore, un avversario per nome, o tutti i computer.
>
> 1. **Dove.** Solo nelle partite di carriera contro il computer. Quick, open e PvP non hanno mai modificatori, nemmeno a richiesta.
> 2. **Dichiarati e mostrati.** I modificatori di una partita si mostrano a chi gioca, con nome e testo, prima che la partita inizi e per
>    tutta la partita al tavolo; l'archivio della partita li registra. Non esistono modificatori nascosti, casuali senza dirlo, o che
>    cambiano durante la partita.
> 3. **Il computer non bara da solo.** Senza modificatori il computer usa le sole informazioni di un giocatore e nessun vantaggio
>    (regola del computer, D85). Un vantaggio in più viene solo da un modificatore dichiarato; il livello del computer non cambia.
> 4. **Primitive.**
>    - **Vista:** un posto vede la mano di un altro, oppure non vede le risorse e gli oggetti di un altro (R08).
>    - **Pesca:** dopo ogni mossa risolta un posto pesca fino a N volte, una dopo l'altra, finché la mano è sotto sei (R02); una ricerca
>      (R02a) prende il posto della prima pesca soltanto.
>    - **Mazzo:** il mazzo regolare di un posto ha N carte invece di 20, scelte dall'incontro fra quelle del suo mazzo (R02); basic, bound e
>      last resort non cambiano.
>    - **Recupero:** ogni K turni, dopo gli effetti di fine turno, l'ultima carta regolare scartata da un posto torna nella sua mano, se è
>      sotto sei, e si mostra a tutti (R02).
>    - **Bersagli:** in tutti contro tutti, i computer indicati scelgono il bersaglio solo fra i posti indicati quando la carta lo consente,
>      altrimenti come sempre.
>    - **Protezione:** gli oggetti di un posto non possono essere bersagliati, rubati, scambiati o distrutti dalle carte degli altri (R03, R04).
> 5. **Cosa non toccano.** Le schede delle carte, l'ordine di risoluzione (R04), danni e stati (R05), vittoria, patta e tempi (R06),
>    le scelte dell'umano. Non creano risorse né parole chiave. Una primitiva nuova chiede una revisione di questo regolamento.
> 6. **Precedenza.** Su ciò che la sua primitiva nomina un modificatore prevale sul regolamento e sulle schede; altrove non vale. Due
>    modificatori della stessa partita non possono derogare allo stesso punto per lo stesso posto: la carriera non è valida.
>
> R01, R02, R08 e la regola del computer rimandano a R08a con un inciso («salvo i modificatori di incontro, R08a»).

**Coperti:** tutto l'inventario, letture (a). **Fuori:** il bersaglio di default in FFA («di norma non si accaniscono tutti sul
giocatore», roadmap), che è comportamento del livello e non deroga (SB-30a e blocchi sui bot); i mazzi conformi a R02 scelti
dall'incontro, che non derogano (CA-0f); le letture (b) di S1.

## 3. Dichiarazione

- **Dove:** `docs/carriere/modificatori.md`, normativo, con versione e revisioni, subordinato al regolamento come un documento di set,
  condiviso fra le carriere. Per ogni modificatore una riga di tabella che lo strumento legge (fonte unica): **id** (lo slug che lo
  strumento già produce, `ce-l-hanno-tutti-con-te`), **nome**, **testo** per chi gioca, **primitiva**, **parametri** (posti con gli id del cast).
- **Risoluzione:** ogni nome di `[Modificatori: …]` → slug → riga del catalogo; il pacchetto porta i modificatori risolti e l'impronta
  del catalogo, come per il cast.
- **Errori nuovi (F12):** nome sconosciuto; posto assente dalla partita su qualche percorso; Bersagli in un duello; due modificatori sullo
  stesso punto e posto; parametri fuori limite. Catalogo cambiato senza alzare la versione della carriera: errore di `-Task Check`.
- **Al giocatore:** nome e testo sulla bacheca e prima della partita, un elenco breve al tavolo (CA-0g); il prototipo mostra i nomi.

## 4. Versioni e conseguenze

- **Regolamento:** 2.1 → minore (2.2 o 2.3, domanda 1): nessuna partita esistente cambia, perché R08a vale solo per le partite di
  carriera, che R01 oggi non ha. Per R00 e AGENTS.md basta che la revisione lo dica («nessuna partita ha modificatori finché le partite
  di carriera non entrano con CA-0f»); il server non cambia comportamento. La copia `client-debug/src/assets/docs/rules.md` resta
  identica (`check-rules.py`): non è `client-web` né `server`, DC1 la consente.
- **Formato:** 0.1 → **0.2**: F5, F11 (il catalogo), F12 (errori nuovi), F13 (cade il posto riservato), revisione.
- **Catalogo:** nasce alla 0.1 con i sei della principale (quattro se S1 resta racconto).
- **Pacchetti:** si rigenerano col formato 0.2; **principale** 1 → 2; tutorial e prova restano alla 1.
- **Server, per CA-0f** (solo letto): le partite contro computer nascono in `GameFactoryServiceImpl` senza posto per i modificatori;
  Vista passa da `BotView.of` e `ClientOpponentView`, Pesca dalla pesca dopo lo scarto in `Game`, Bersagli da `ComPlayer.choseTarget`
  e dalle policy di `BotPlayer`; Recupero chiede una pila degli scarti, che oggi non c'è (`Player.discardCard`). La prova «nessuna
  informazione nascosta» (D85) resta per ogni partita senza Vista.

**L'attuazione toccherebbe:** `docs/game-rules.md` e la copia `client-debug/src/assets/docs/rules.md`; `docs/carriere/formato.md`;
`docs/carriere/modificatori.md` nuovo; `tools/carriere/src/` e prove; `tools/carriere/pacchetti/*.json` e `carriere.json`;
`docs/ca-plan.md` e questo rapporto. Le storie no. Verifiche: `check-rules.py` e `build.ps1 -Task Test -Offline` (esclusiva, con
turno), `tools/carriere/run.ps1 -Task Test` e `-Task Check`, `check-links.py`.

## Scelte prese

- Sei primitive generiche, non una regola per modificatore; una primitiva nuova chiede una revisione del regolamento.
- R08a accanto a informazioni e confini; precedenza in R00, nello stile della scheda che deroga solo se lo dice.
- Catalogo fuori dalle storie, che restano nel serbatoio senza valore normativo (DC4).
- Pesca N finché la mano è sotto sei; la ricerca sostituisce solo la prima pesca. I modificatori valgono per tutta la partita.

## Domande

1. **Ordine con SB-30a.** Vista e Bersagli derogano alla regola «Il computer» che SB-30a B1 scrive in R03 nella 2.2, già in corso su
   questo checkout (non committata al 26 novembre). **Raccomando:** attuare CA-0e dopo il commit di B1, come **2.3**.
2. **S1, letture.** «Il cane difende le sue cose» e «la cantina è buia»: (a) Protezione degli oggetti di Piera e Vista in meno per il
   giocatore, o (b) solo racconto, tolti dal tag? **Raccomando (a)**: gioco senza entità nuove; con (b) Protezione esce.
3. **«Ogni tanto» di Sergio.** **Raccomando** ogni 3 turni, l'ultima carta regolare scartata, deterministico e mostrato; in alternativa
   ogni turno con probabilità dichiarata (più vicino al testo, meno leggibile).
4. **Dove vive il catalogo.** **Raccomando** `docs/carriere/modificatori.md` condiviso; in alternativa una sezione per carriera
   nel pacchetto, che obbliga a ripetere i modificatori riusati.
5. **Mazzi accorciati del tutorial.** Primitiva Mazzo subito, o solo se la misura col runner lo chiede? **Raccomando** subito nel
   regolamento (costa una riga, evita una revisione dopo), ma nessun modificatore concreto nel catalogo finché il tutorial non lo usa.
