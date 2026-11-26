# CA-0e — Modificatori di incontro: proposta

Proposta del 26 novembre 2026, passo con proposta ([piano](../../ca-plan.md#ca-0e--modificatori-di-incontro)). **Esito:** proposta
decisa dal proprietario il 26 novembre 2026 ([sotto](#decisione-del-proprietario), DC5 del piano), **attuata** lo stesso giorno
([Attuazione](#attuazione)) e **chiusa** dopo la revisione della regia ([Chiusura](#chiusura)).

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

## Decisione del proprietario

26 novembre 2026. La regia ha rivisto la proposta (commit `6baa711`): perimetro rispettato, inventario completo rispetto ai tre
`[Modificatori: …]` delle storie, classi del server citate esistenti, R02 e R02a letti correttamente. Il proprietario ha risposto «Come
raccomandi tu» alle raccomandazioni della regia:

1. **Ordine con SB-30a:** l'attuazione parte dopo la **chiusura** di SB-30a, non solo dopo il commit di B1, perché SB-30a può ancora
   ritoccare la regola del computer; il regolamento passa alla **2.3**.
2. **S1:** lettura (a), cioè Protezione degli oggetti di Piera e Vista in meno per il giocatore.
3. **«Ogni tanto» di Sergio:** Recupero ogni 3 turni, l'ultima carta regolare scartata, deterministico e mostrato.
4. **Catalogo:** `docs/carriere/modificatori.md`, condiviso fra le carriere.
5. **Mazzi accorciati:** **niente primitiva Mazzo** per ora, contro la raccomandazione dell'esecutore. Come per le estensioni del formato
   (CA-0b), entra solo ciò che una storia vera usa; Mazzo arriverà con una revisione quando il tutorial lo chiederà. Le primitive sono
   cinque: Vista, Pesca, Recupero, Bersagli, Protezione.

Nota della regia, non una domanda: Vista in più («ha letto i tuoi messaggi») non cambia la partita finché nessun livello del computer
usa la mano vista; conterà con un livello più forte, da misurare in CA-3.

## Attuazione

26 novembre 2026, passo diretto (DC5, DC6, DC7). **Esito:** regolamento 2.3 con R08a e Set Base 1.0.4 in vigore, `check-rules.py` verde;
[catalogo dei modificatori](../../carriere/modificatori.md) 0.1 coi sei della principale; [formato](../../carriere/formato.md) 0.2; lo
strumento risolve ogni `[Modificatori: …]` nel catalogo e fallisce sugli errori nuovi; pacchetti di forma 2 rigenerati, principale alla 2,
`-Task Check` verde coi numeri delle tre storie invariati. Partita viva identica: nessun file sotto `server/src/main/java`, nessun
`cards.sqlite`, nessuna scheda; `server/src/main/resources/sets/base.json` non cambia nemmeno (la versione del set sta nel documento).

### Cosa cambia

- **Regolamento 2.3** (`docs/game-rules.md`, copia identica in `client-debug`): R00, paragrafo «Modificatori di incontro (2.3)» con la
  precedenza e il catalogo subordinato come un documento di set; R01, le partite di carriera possono avere modificatori, quick, open e PvP
  mai; **R08a** nuova con le cinque primitive (Vista, Pesca, Recupero, Bersagli, Protezione; niente Mazzo, DC5 (5)) e Recupero «ogni K
  turni (al turno K, 2K, …) … l'ultima carta regolare che un posto ha scartato, se non è già tornata», mostrata a tutti (DC5 (3)); incisi
  in R02 (una sola pesca), R03 (il computer: informazioni e vantaggi) e R08 (viste). La revisione dice che nessuna partita cambia finché
  non esistono le partite di carriera (CA-0f). Nessun nome di carta (`check-rules.py`).
- **Set Base 1.0.4** da `set_catalog.py --vivo`: cambiano solo la riga «Richiede il regolamento 2.3» e una riga di revisione («Nessuna
  scheda cambia»); la revisione 1.0.3 ora dice «Richiedeva il regolamento 2.2», e la 1.0.2 scrive 2.2 fisso invece della costante.
  Rigenerati documento e copia, allegato (solo `version`), manifest. Attesi di versione aggiornati (DC7): tre script CLI,
  `MatchArchiveTest.java` (solo le due righe), `tools/print-cards/test_generator.py`.
- **Catalogo** `docs/carriere/modificatori.md` 0.1: M1 come si legge, M2 parametri e limiti per primitiva, il punto di R08a (6), M3 la
  tabella dei sei (S1 con la lettura (a)). È la fonte unica che lo strumento legge.
- **Formato 0.2:** F5 (i nomi sono modificatori del catalogo, anche sulle catene), F11 «Il cast e il catalogo», F12 errori nuovi, F13
  (cade «Posti riservati»; la versione di una carriera cambia anche coi modificatori che usa), revisione.
- **Strumento** (`tools/carriere/`): `src/modificatori.ts` nuovo (lettura della tabella, controlli delle righe contro M2 e il cast,
  controlli statici, presenza al tavolo, modificatori usati); il grafo, con il catalogo, controlla la presenza degli avversari nominati
  su ogni stato; `convertiCarriera` e i pacchetti aggiungono i controlli statici; `-Task Check` stampa il catalogo. Pacchetto di
  **forma 2**: campo `modificatori` (i modificatori usati, risolti) e `impronte.modificatori` (l'impronta della parte del catalogo
  usata, come per il cast). Un catalogo cambiato su un modificatore usato senza alzare la versione è un errore di `-Task Check`; un
  pacchetto della forma 1 vale come «nessun modificatore risolto», quindi tutorial e prova si rigenerano alla versione 1 e principale
  passa alla **2** (`carriere.json`). Impronte di storia e cast dei tre pacchetti invariate.
- **Prototipo:** `Convert` scrive anche `dati/generati/modificatori.json`; al tavolo di partita e catena, al posto degli id, un elenco
  «Modificatori di incontro» con nome in grassetto e testo.
- **Stato:** piano (riga, sezione, Ripartenza), `aree-protette.md` (riga delle carriere: il catalogo in «Se cambia»), `README.md`
  (Regolamento, documenti, Carriere), `setup.md` (set vivo).

### Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check` | pulito |
| `check-links.py` | 22 link rotti, gli stessi noti; nessuno nuovo |
| `check-rules.py` | verde: «Regolamento 2.3 e Set Base 1.0.4 allineati…; regolamento senza carte citate» |
| `set_catalog.py --vivo`, `prova-errori.py` | rigenerato; tutti i casi OK |
| `tools/print-cards/test_generator.py` | 14 test verdi dopo gli attesi di versione (vedi Rossi) |
| `build.ps1 -Task Test -Offline` | **1529 test, 0 falliti, 0 errori, 23 saltati**, come SB-34 B3; client di debug 54/54 |
| `build.ps1 -Task Server -Offline` (jar) | BUILD SUCCESS, prima del contesto completo |
| `build.ps1 -Task TestServerContext -Offline` (con i test CLI) | **1738 test, 1 fallito**, 23 saltati: `QuickDuelCliTest.aBaseAndAnAdvancedHumanPlayTheirOwnStarters`, «Event timeout», **noto, voce R3**, senza rilancio. Verdi i test che girano gli script CLI con gli attesi nuovi: `MatchArchiveCliTest` (2), `OpenCompleteCliTest` (1), `QuickCompleteCliTest` (2); `MatchArchiveTest` 10/10 |
| `verify-match-manifests.py` | uscita 0, `allChecks` PASS |
| `tools/carriere/run.ps1 -Task Test` | **36 prove verdi** (27 di CA-0d più 9 nuove in `tests/modificatori.test.ts`) |
| `tools/carriere/run.ps1 -Task Package` e `-Task Check` | 3 pacchetti scritti; Check 0 errori, «catalogo dei modificatori 0.1: 6 modificatori, 0 errori» |
| `prototipi/carriere/run.ps1 -Task Test`, `-Task Check`, `-Task Build` | 117 verdi; Check 0 errori; Build verde (`tsc` e `vite`) |

**Numeri delle storie**, identici a [CA-0d](ca-0d.md): tutorial 6 nodi / 12 stati / 2 fini, 0 avvisi; prova 8 / 15 / 4, 0 avvisi;
principale 27 / 665 / 104 (disco-pub 52, il-serraglio-resta 36, il-serraglio-e-di-tutti 16), 49 avvisi di conversione e 0 del grafo.
Il controllo nuovo non aggiunge stati: i segni delle partite erano già nella chiave dello stato.

**Mutazioni** (8, sulla logica nuova; script in `%TEMP%`, `scratchpad/mutazioni.py` della sessione): ognuna fa fallire almeno una prova.
M1 limite inferiore dei numeri; M2 Bersagli in un duello; M3 «computer» comprende gli avversari; M4 «un posto solo»; M5 impronta vuota
per i pacchetti della forma 1; M6 nome sconosciuto; M7 Vista sulla coppia chi e di; M8 presenza al tavolo nel grafo. Al primo giro
M4 (chi gioca nominato come avversario) e M7 sopravvivevano: la clausola di M4 era ridondante (chi gioca non è mai fra gli avversari
risolti) ed è stata tolta, sostituita dalla mutazione su «un posto solo»; per M7 mancava il caso «stesso `chi`, `di` diversi», aggiunto.

### Rossi

- `test_generator.py`, due test (fra cui `test_live_mode_prints_the_live_set_file`): attesi «Set Base 1.0.2» e regolamento 2.2. **Preesistente** per il set: alla base il documento è alla 1.0.3 (SB-34) e l'atteso era 1.0.2,
  come nella voce R19 per SB-29; attesi portati alle versioni vigenti (DC7). Da valutare se aggiungere una voce al registro (domanda 3).
- `TestServerContext`: `QuickDuelCliTest`, «Event timeout»: **noto, voce R3** (stesso test e messaggio di SB-34), non riprovato.

### Non verificato

- Il prototipo con i modificatori non è stato guardato a schermo: Build e prove sono verdi, ma nessuna cattura del tavolo di S2.
- I PDF di stampa in `output/pdf` restano al Set Base 1.0.2 e al regolamento 2.2 (non rigenerati, come chiede il protetto);
  `verify.py` su di essi non è stato lanciato e direbbe «set o regolamento diversi dal manifest», come R20.

### Scelte prese

- Limiti dei parametri nel catalogo (M2), non nel regolamento: Pesca da 2 a 3, Recupero da 2 a 5. Si cambiano con una revisione del
  catalogo.
- Sintassi dei parametri `nome: valore; …` e posti `giocatore`, `computer` o id del cast; per «ce l'hanno tutti con te» Sergio e Duccio per
  nome, non `computer`, così il controllo di presenza vale.
- Il punto di R08a (6) è la primitiva per il posto `chi`, per Vista la coppia `chi`–`di`; `computer` si sovrappone a ogni avversario.
- L'impronta è della parte del catalogo che la carriera usa (come per il cast), non del file intero: un modificatore nuovo non usato non
  alza le versioni. Il pacchetto non porta la versione del catalogo.
- Testi per chi gioca scritti dall'esecutore (M3), in seconda persona.
- In R08a la Vista in meno lascia pubbliche le carte mostrate; il Recupero dice cosa succede se la carta è già tornata o la mano è piena.

### Cosa giudica il proprietario

I testi dei sei modificatori; R08a com'è scritta; i limiti dei parametri.

### Domande

1. **Testi e nomi in M3:** vanno bene, o li riscrive la regia con il tono delle storie?
2. **Limiti:** Pesca da 2 a 3 e Recupero da 2 a 5 bastano, o li vuole nel regolamento invece che nel catalogo?
3. **Stampa:** i PDF vivi e il test di stampa restano indietro a ogni cambio di versione del set (R19, R20 e oggi di nuovo): li si
   rigenera in un blocco a parte, o si aggiunge una voce al registro dei rossi noti?

## Chiusura

26 novembre 2026, revisione della regia sul commit `398dda1`. Perimetro rispettato: nessun file di `server/src/main/java`, nessun
`cards.sqlite`, nessuna scheda; nel server cambiano solo le due righe di versione di `MatchArchiveTest` (DC7). R08a e catalogo
corrispondono a DC5. Rifatte dalla regia: `git diff --check`, `check-links.py` (22 link rotti, nessuno nuovo), `check-rules.py` verde
(regolamento 2.3, Set Base 1.0.4), `tools/carriere/run.ps1 -Task Test` (36 verdi) e `-Task Check` (0 errori, catalogo 0.1 con 6
modificatori e 0 errori, numeri della principale invariati), `prototipi/carriere/run.ps1 -Task Test` (117 verdi). Non rifatte: le
verifiche Maven, esclusive; vale il rapporto, col solo rosso noto R3. Resta non verificato a schermo il tavolo del prototipo con i
modificatori.

Il proprietario ha risposto «Sì, chiudi» alle raccomandazioni della regia sulle domande 1–3 (DC8 del piano): testi dei modificatori
come sono, limiti dei parametri nel catalogo, PDF di stampa segnalati alla regia del Set Base. **CA-0e è chiuso.**
