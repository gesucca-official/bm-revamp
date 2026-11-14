# Livelli di forza e difficoltà del bot — proposta per Q2

**Versione 0.1 — 14 novembre 2026. Motivazione: il proprietario ha chiesto un bot «che giochi bene, con vari livelli di forza e difficoltà», perché «il single player contro il computer è una modalità fondamentale nel gioco» ([D76](../../set-base-plan.md#decisioni-del-proprietario)). Q2 è aperta e va rifatta; qui si propone cosa sono i livelli, come si misurano e quando farli. Fase A con STOP: solo questo documento, nessuna attuazione, nessuna misura, nessuna partita simulata.**

Fonti: D76 e [D77](../../set-base-plan.md#decisioni-del-proprietario); righe Q1 e Q2 e blocchi SB-29, SB-30 del [piano](../../set-base-plan.md); [rapporto del bot consapevole del colpo letale](../../reports/set-base/sb-16g-bot-letale-report.md); [rapporto del passo 2](../../reports/set-base/sb-16g-2b2-report.md) per stili e politiche; [roadmap](../../product-roadmap.md) per single player e carriera; il codice dei bot. Metodo: [orchestrazione](../../orchestrazione-lavoro.md).

## 1. Stato attuale

### Correzione di una premessa

Il mandato di questa proposta supponeva che i bot vivessero solo nei sorgenti di test. **Non è così**: bot, stili, politiche, vista e previsione stanno già nel codice di produzione del server, in `server/src/main/java/com/gsc/bm/model/game/bot/` (`BotView`, `BotPlayer`, `BotPolicy`, `LegalMove`, i tre stili, `RandomPolicy`, `SoughtHitPolicy`, `LethalAwarePolicy`, `StyleSupport`, `TurnForecast`). Nei sorgenti di test vivono solo il **runner e il banco di misura** (`server/src/test/java/com/gsc/bm/sim/`: `Bench*`, `ChargeMeasureTest`, `LethalBotMeasureTest`, `TurnForecastFidelityTest`, ecc.). Cambia il lavoro da fare: non c'è da «portare» il bot nel server, c'è da **collegarlo alla partita viva** e da **farlo scegliere per livello**.

### Il computer della partita viva

`ComPlayer` (`model/game/ComPlayer.java`) sceglie **a caso**: mescola la mano, prova le carte dall'ultima e gioca la prima mossa valida; bersaglio e oggetti a caso; scarta una carta a caso. Non guarda salute, risorse, priorità, né ciò che l'avversario mostra. Il commento nel codice dice «for now this fabulous AI is just random choices». `PlayerFactoryServiceImpl.craftRandomComPlayer()` lo crea per quick contro computer, open contro computer e bot della FFA; il motore lo richiama da `Game.isReadyToResolveMoves()` → `autoSubmitComPlayersMove()`, in modo sincrono, quando la partita controlla se può risolvere il turno. Contro computer non esiste timeout mossa (regolamento, sezione sui tempi).

### I bot del banco

`BotPlayer extends ComPlayer` sceglie attraverso una `BotPolicy` che vede solo `BotView`: mano propria, risorse e oggetti di tutti, stati, carte avversarie scoperte dalla ricerca (D58), mosse del round precedente; **niente** mano coperta, ordine del mazzo, mosse pendenti. Il contratto è «una politica senza stato, ogni numero casuale dal `Random` dato» (le partite si copiano con la serializzazione Java). Quattro stili:

| Stile | Come sceglie |
|---|---|
| casuale (`RandomPolicy`) | carta a caso, poi modo di giocarla a caso |
| aggressivo | punteggio a pesi fissi: danno ×3, priorità, +1000 se uccide, bonus per DISRUPT/COUNTER |
| prudente | pesi orientati alla difesa e alla salute |
| risorse | pesi orientati alle risorse e allo sblocco dei danni |

Intorno allo stile stanno due involucri: `SoughtHitPolicy` (tiene o gioca il colpo trovato dalla ricerca; D74 fissa «gioca il turno dopo») e, dal 13 novembre, `LethalAwarePolicy` con `TurnForecast`: prevede **il turno in corso** su copie della vista (gruppi di velocità, stati, gettoni, corazza, ricerca, veleno) e restringe le mosse a quelle salve, o a quelle che portano sicuramente a terra. Fedeltà al motore 6.542 turni su 6.542; guadagno contro il bot senza previsione 52,64% delle partite decisive, ma 50–51% a parità di stile euristico e 59,7% per il casuale: la restrizione scatta nel 4,6% delle decisioni e cambia la scelta nello 0,69% ([rapporto](../../reports/set-base/sb-16g-bot-letale-report.md)).

### Cosa è collegato alla partita viva e cosa no

| Elemento | Dove vive | In partita viva oggi |
|---|---|---|
| `ComPlayer` casuale | produzione | **sì**, è l'unico computer |
| `BotPlayer`, stili, `SoughtHitPolicy` | produzione | solo col profilo `bozza` (`BozzaPlayerFactory`, `app.bozza.bot`: **uno stile per tutto il server**, non per partita) |
| `LethalAwarePolicy`, `TurnForecast` | produzione | solo col profilo `bozza` e regole `d50`: con le regole vive 1.13 l'involucro «passa la mano» (`Ruleset.playground()`), perché la previsione implementa D50 |
| Scelta del livello da parte di chi gioca | — | **non esiste**: nessun parametro di livello nel protocollo d'ingresso, nel client, nella CLI o nell'archivio (che registra solo il nome della politica) |
| Runner, banco, misure, test di fedeltà | test | no: sono strumenti di bilanciamento |

**Differenza fra i due computer, in una riga.** Il computer vivo non ha nessuna conoscenza del gioco e non lo si può confrontare con un giocatore; i bot del banco giocano da euristici e, con le regole `d50`, vedono il turno in corso. Il computer vivo è anche **il livello «facile» di SB-30** così com'è.

**Cosa servirebbe portare nel server per le partite normali:** (1) una fabbrica che crei `BotPlayer` per livello in `PlayerFactoryService`, anche per i bot della FFA; (2) una previsione valida con le regole vive: dopo SB-28 le regole d50 diventano le vive e il cancello `playground()` cade, senza lavoro in più; prima di SB-28 i livelli forti ci sono solo nel profilo `bozza`; (3) livello nel protocollo d'ingresso, nel client, nella CLI e nell'archivio; (4) un tempo di risposta controllato (§3); (5) la prova «nessuna informazione nascosta» come test permanente (§2).

## 2. Livelli proposti

**Regola ferma, per tutti i livelli: nessuno bara.** Ogni livello decide dalla `BotView`: mano propria, tavolo pubblico, storia pubblica. Niente mano coperta dell'avversario, ordine del mazzo (nemmeno del proprio), mosse pendenti. La differenza fra livelli è **conoscenza pubblica usata, orizzonte di previsione e qualità della scelta**, mai informazione in più né risorse in più. Il livello non cambia carte, salute o risorse: i mazzi più forti sono un'altra leva delle carriere (CA-3: «la difficoltà viene da bot più bravi e mazzi più forti»).

**Prova permanente anti-barare** (nuova, a costo basso): per ogni livello, due partite identiche nella vista pubblica ma diverse in ciò che non si può vedere (mano avversaria, ordine del mazzo, mosse pendenti, esito dei dadi/ricerche non ancora avvenuti) devono produrre la **stessa mossa** a parità di seme. È una proprietà, non una speranza: se un livello legge un dato nascosto il test cade. Vale anche per il livello massimo, e vale oggi per `BotView` solo per costruzione (nessun riferimento al motore): il test lo rende verificabile.

| # | Livello (nome provvisorio) | Chi è | Sa | Ignora | Come sceglie | Come si riconosce |
|---|---|---|---|---|---|---|
| 1 | **Facile** | Il computer attuale, senza cambiare | Solo le mosse legali e pagabili | Tutto: salute, risorse, colpi mostrati, status | Carta a caso, bersaglio a caso (`RandomPolicy`); con il «gioca il colpo trovato il turno dopo» di D74, perché chi impara veda la meccanica | Gioca carte scoordinate, spreca difese, non punisce mai. Adatto al tutorial e a chi inizia |
| 2 | **Normale** | Euristico di stile, **senza previsione** (il bot di SB-4/passo 1) | Costi, priorità, danno nominale, ruoli, risorse proprie e altrui; il colpo trovato e scoperto da lui | Il turno in corso: non calcola se il colpo mostrato è letale, non conta gettoni e corazza, non guarda l'ordine dei gruppi | Punteggio a pesi dello stile, spareggio col seme | Ha una **personalità** (aggressivo, prudente, risorse) che si legge nel gioco; è prevedibile e quindi battibile per costruzione. È il livello «onesto ma ingenuo» che il proprietario ha giudicato stupido il 13 novembre: va tenuto come gradino, non come obiettivo |
| 3 | **Difficile** | Il bot di D76–D77, già consegnato nel banco | Tutto il livello 2, più la **previsione del turno in corso**: colpi mostrati e pagabili, gettoni, stati, corazza, gruppi di velocità, ricerca | Oltre il turno: non pianifica, non stima mani coperte; un colpo che l'avversario ha in mano coperta non conta (D77 punto 4) | `TurnForecast` restringe le mosse a salve e letali; lo stile sceglie fra le rimaste. Patta invece di sconfitta (D77 punto 2); evita le mosse che si espongono da sole (D77 punto 3) | Si para quando serve, sfrutta il gettone e gli stati negativi dell'avversario, chiude quando può. **Non è imbattibile**: contro il colpo non mostrato è cieco, e lo si può sorprendere tenendo un colpo coperto |
| 4 | **Maestro** | Nuovo: ricerca su più turni con **mano avversaria ipotizzata** | Tutto il livello 3, più: storia pubblica dei turni (carte già giocate, ricerche, risorse spese), **ciò che una mano avversaria potrebbe contenere** rispetto a quanto è noto del mazzo (§3), e un modello dello stile dell'avversario | Solo ciò che nessun giocatore può sapere: la mano vera, l'ordine del mazzo, la mossa pendente | Campiona più mani avversarie coerenti con la vista pubblica, gioca avanti alcuni turni ciascuna e sceglie la mossa che regge meglio (§3) | Prende **rischi calcolati**: tiene un colpo forte quando l'avversario non lo teme, sa che un avversario coperto può avere il colpo che lui ha già visto cercare, para di più contro chi ha già fatto danni forti, **cambia gioco contro un avversario che ripete lo stesso schema** |

### Perché non è «sbaglia a caso»

Un livello più facile non è un livello che a volte fa mosse casuali, perché quello si sente subito come stupidità e non insegna niente. Si propone di distinguere i livelli per **cosa il bot capisce**: il Normale ha una personalità e un buco preciso (il turno in corso); il Difficile lo chiude; il Maestro guarda oltre. Così chi gioca può **imparare** a battere ciascun livello (sorprenderlo con ciò che non vede) invece di sperare nella fortuna. Un rumore piccolo e dichiarato (ad esempio, con un seme dato, scegliere una volta su dieci la seconda mossa migliore) è una manopola in più, non il fondamento di un livello: si valuta solo se la scala di §4 non basta.

### Livelli e personaggi

Gli stili sono tre e i personaggi cinque (più Sergio e Duccio): si propone che lo **stile sia un'impronta del personaggio** (Spazienzio aggressivo, ecc.), deciso dai documenti del set o della carriera, non scelto a caso a ogni partita; il livello è invece una scelta di chi gioca (quick) o dell'incontro (carriera). Resta la domanda 6.

### Regola sul superboss

Il roadmap (D11) dice che per il 100% «un superboss finale può anche barare», mentre CA-3 dice che la difficoltà non viene «mai da bot che vedono informazioni nascoste». Le due frasi si conciliano così: **nessun livello bara; un superboss «che bara» è un modificatore di incontro dichiarato** (CA-0: i modificatori sono deroghe alle regole, definiti dal regolamento e dalla carriera, e il giocatore li legge prima dello scontro), non un livello del bot. Domanda 2.

## 3. Idee per il livello forte, con costo e rischio

Il punto di partenza è favorevole: la `BotView` è una copia dei dati pubblici senza riferimento al motore, `TurnForecast` gioca già su copie della vista e concorda col motore in 6.542 turni su 6.542, e il tavolo è a mosse **simultanee** e nascoste (le mosse pendenti non si vedono). Quindi il problema è un gioco a informazione imperfetta e a mosse simultanee: la mano avversaria è nascosta, e la sua mossa anche.

### 3.1 Previsione su più turni sulla vista (costo medio, rischio basso)

Estendere `TurnForecast` oltre il turno: dopo la mossa propria e quella ipotizzata dell'avversario, il turno seguente. Serve prevedere cosa **si pesca** (ordine del mazzo ignoto: va campionato, anche per il proprio mazzo, perché il bot non lo vede), cosa **gioca l'avversario** (un suo stile ipotizzato, §3.3) e come si evolvono timer, veleno e gettoni. Il rischio è la fedeltà: ogni regola ripetuta fuori dal motore è un luogo dove divergere (nel passo 1 di D76 ne sono servite quattro correzioni al primo giro, da 1.230 su 1.246 turni a 6.542 su 6.542). Si controlla con un test come `TurnForecastFidelityTest` esteso a due turni, che resta la rete di sicurezza.

### 3.2 Ricerca per determinizzazione, Monte Carlo (costo medio-alto, rischio medio)

Per ogni decisione: campionare *N* mondi coerenti con la vista (mano avversaria dal sottoinsieme di carte possibili, ordine del mio mazzo e del suo), valutare ogni mossa legale giocandola contro l'avversario ipotizzato per qualche turno, e scegliere la mossa con il risultato medio migliore. Con numeri casuali comuni fra le mosse (stessi *N* mondi) si riduce molto il rumore del confronto. Punti da decidere:

- **Dove si valuta la partita.** Con il motore vero si evita di riscrivere ogni carta, ma il motore non si deve consultare «dal vero»: i mondi vanno **costruiti dalla vista**, non copiati dalla partita, altrimenti si legge la mano vera. Con `TurnForecast` esteso si resta nella vista, ma le carte Java che non sanno descriversi (per ora quasi nessuna della bozza) non si prevedono. Si propone di partire dal secondo, con valutazione finale euristica (salute, risorse, minacce) dopo 2–3 turni, e di valutare il motore in una fase successiva solo se serve.
- **Che mani sono «coerenti».** Dipende da quanto è noto del mazzo avversario. Il giocatore umano **sa** il mazzo di uno starter che conosce; in open con mazzo personalizzato no. Il Maestro dovrebbe usare ciò che un giocatore esperto sa: le liste degli starter pubblici e le carte già viste in partita. Domanda 3. Se la lista non è nota, il campione si fa sulle carte già viste più quelle del personaggio.
- **Mosse simultanee.** Una ricerca che assume «l'avversario sceglie la mia peggiore» (minimax) dà un bot troppo pessimista; una che assume un avversario fisso è sfruttabile. Si propone di valutare ogni mossa contro la **distribuzione** degli avversari ipotizzati (una mossa per ogni mano campionata, scelta dal suo stile), cioè contro una miscela, con eventuale regret matching sulla matrice mossa×mossa per i casi chiave (colpo letale in gioco). Serve provarlo: il rischio è tecnico e di taratura, non di regole.

### 3.3 Modello dell'avversario (costo basso-medio, rischio basso)

Il Maestro tiene una stima, aggiornata dalla storia pubblica, di quale stile sembra giocare l'avversario (aggressivo, prudente, risorse) e di quanto tiene un colpo mostrato. Si usa per scegliere le mosse dell'avversario nei mondi campionati. Con un umano il modello è rumoroso: serve un'euristica semplice (frequenze di categoria di mossa) e non un'inferenza sofisticata. Il rischio è sovrastimare il segnale su poche mosse; si mitiga con una stima di partenza neutra.

### 3.4 Valutazione finale, alternative e cosa non si propone

Un valutatore di fine orizzonte (differenza di salute attesa, minacce pagabili, costi in risorse) tarabile col banco. Si scarta, per ora, di **addestrare** una politica (apprendimento per rinforzo o reti): richiede infrastruttura nuova, un set che ancora cambia, e rende il bot opaco da correggere. Si scarta anche di barare per la forza (vedi regola ferma).

### 3.5 Tempo di risposta

**Cosa sappiamo:** la misura di D76 ha fatto 288.000 partite (due bot per partita, circa 12 turni) in 72,55 s con 8 thread: circa **2 ms di CPU per partita intera**, cioè nell'ordine di **0,1 ms per decisione compreso il motore** (stima mia dai numeri del rapporto, non una misura: i thread potrebbero non essere saturi). Il costo dei livelli 1–3 è quindi trascurabile.

**Per il Maestro** (stima da confermare con una sonda prima di attuare): una decisione con ~12 mosse legali e 40 mondi, 2–3 turni di orizzonte, sono ~500 simulazioni di pochi turni, cioè **0,2–1 s** su un core del server, in proporzione alla profondità e al numero di mondi. Con 40 mondi il rumore della stima è di circa ±8 punti: sufficiente per distinguere colpi letali e prudenza, non per rifiniture, e per questo servono i numeri casuali comuni. La decisione è asincrona rispetto al giocatore umano solo se la si sposta fuori dal punto in cui oggi viene chiamata: `autoSubmitComPlayersMove()` gira dentro `isReadyToResolveMoves()`, cioè in sincrono sul percorso dell'invio. **Soglie proposte:** Facile, Normale, Difficile sotto 50 ms; Maestro **mediana sotto 1 s, tetto duro 2 s** con un tempo massimo configurabile; allo scadere il Maestro gioca la migliore mossa trovata finora (l'algoritmo deve essere interrompibile). Un indicatore «sta pensando» nel client conta quanto la velocità: oltre ~1 s senza segnale sembra un blocco. Il server è condiviso fra partite: il costo va misurato in partite contemporanee, non su una sola (SB-30 richiede già «tempo di scelta che non rallenta il turno»). Domanda 4.

## 4. Come si misura la forza

### 4.1 Con i bot del banco

Il banco esiste già (SB-7, runner con seme, 15 incontri, posti alternati, seme condiviso). Si propone una **scala a giro completo** fra i quattro livelli:

- Ogni coppia di livelli (6 coppie, più gli specchi) sugli stessi 15 incontri di personaggi, mazzi e semi, posti alternati. Il livello si misura **in media su tutti i personaggi**, non su uno solo (nel rapporto di D76 il bot nuovo vinceva il 59,9% con Celestina e il 45,7% con Piera: il personaggio pesa quasi quanto il livello).
- Esito: quota di vittorie sulle sole partite decise (le patte a parte, come in D76), con intervallo; da cui un punteggio per livello (modello Bradley–Terry o Elo del banco) e le tre quote fra livelli adiacenti.
- **Tassi attesi proposti** (da confermare con la prima misura, sono obiettivi di progetto): livelli adiacenti **60–70%** per quello più forte; livelli a distanza 2 **almeno 80%**; Facile contro Maestro **oltre il 95%**. Una coppia adiacente sotto il 55% vuol dire che i due livelli non si distinguono e si rivede il più forte; sopra l'85% vuol dire che c'è un salto troppo grande e manca un gradino.
- **Nessun livello deve perdere con quello più debole in nessun incontro** (sotto il 50% in una cella è un difetto da leggere, non da mediare).
- Il Normale contro il Difficile è già misurato in D76: **52,64%** (50–51% a parità di stile). Quindi **oggi la distanza fra 2 e 3 è molto sotto l'obiettivo del 60–70%**: la differenza è netta solo per un colpo letale mostrato, che è raro (3,6% delle decisioni). Le due possibilità sono (a) accettare che il Difficile sia «sicuro nei casi giusti» e non molto più forte in media, o (b) rafforzare il Difficile con 3.1 (previsione su due turni, che dà gradini più larghi di una difesa ben calibrata). Domanda aperta per il proprietario solo dopo la prima misura della scala, non prima.
- **Costo di calcolo.** I livelli 1–3 costano nell'ordine delle misure di D76: pochi minuti. Con il Maestro a 0,2–1 s per decisione, una partita costa ~5–25 s di CPU: 15 incontri × 2 posti × 100 semi = 3.000 partite sono 4–20 ore di CPU, **da 30 minuti a 3 ore con 8 thread**: il campione per i livelli alti sarà più piccolo (intervalli più larghi) o si useranno orizzonti ridotti per la misura. Le misure dei livelli non sono giri di bilanciamento: si propone un **budget dedicato**, distinto da D68 (domanda 7).
- **Condizione di validità:** la scala va rifatta quando cambiano le carte in modo importante, perché i bot leggono il testo stampato delle carte (`PrintedEffects`) e la forza relativa dipende dal pool. Si salva con la stessa identità e firma (SHA della bozza) dei rapporti di D76.

### 4.2 Con un umano

I numeri non dicono se il livello è giusto da giocare. Proposta di prova, breve e ripetibile:

1. **Prova alla cieca**: il proprietario (e, quando c'è, una persona fuori dal progetto, come Q12) gioca almeno 5 partite contro ciascun livello senza sapere quale, con lo stesso starter, e per ciascuna annota: «stupido / giusto / duro / ingiusto / noioso» e se ha vinto.
2. **Riconoscere il livello**: alla fine indovina quale era quale. Se non si distinguono due livelli, la scala non regge anche se i numeri dicono il contrario.
3. **Sospetto di barare**: per ogni mossa che sembra «sapere» la mano coperta il bot deve poter spiegare, dal registro, su quale dato pubblico ha deciso. Serve registrare nell'archivio il livello e, per i livelli 3 e 4, un riepilogo della decisione (mossa restrizione, stima del turno): è un lavoro piccolo ma va previsto nel contratto dell'archivio (SB-30).
4. **Vittorie del giocatore**: obiettivo di progetto da discutere, non misurato: Facile 85–95% (per un principiante, 70%), Normale 65–75%, Difficile 45–60%, Maestro 25–45% contro un giocatore esperto. Sono ordini di grandezza per il giudizio, non soglie da imporre al bilanciamento.
5. **Tenere distinte le due letture.** Un bot forte «non è per forza divertente» (rischio di SB-30). Un Maestro che pareggia con tutti i mazzi non è il Maestro giusto per la carriera, e un Facile che perde sempre non insegna: la prova umana può decidere di *non* rendere un livello più forte, ed è il suo ruolo.

## 5. Quando farlo, dipendenze, stima

### Dipendenze

- **SB-28 (trasferimento nella partita viva).** Le regole `d50` diventano le vive e il cancello `Ruleset.playground()` cade: Difficile e Maestro funzionano nella partita viva senza lavoro di regole. Prima di SB-28 i livelli forti stanno solo nel profilo `bozza` (che c'è già, uno stile per server).
- **SB-29 (quick con categorie) e Q1.** I livelli sono un secondo parametro della quick contro computer; si possono progettare insieme (protocollo d'ingresso, client e CLI).
- **Carriere.** CA-0 e CA-1 dipendono da SB-30 (roadmap: «tutta la carriera dipende dalla qualità dei bot, quindi da SB-30 e probabilmente da più livelli»). Il prototipo CA-0a gioca con partite simulate e non ne ha bisogno ora. La carriera assegna il livello a ogni incontro e può darne uno diverso per boss; il livello deve quindi essere un parametro di `ComPlayer`/partita, non una modalità del server.
- **FFA.** I bot della FFA scelgono i bersagli con regole che sono modificatori di incontro (CA-0). I livelli si definiscono per partite a due e per la FFA valgono per le sole mosse; la selezione del bersaglio resta alle regole della carriera. La previsione e le scale di §4 sono misurate a due; una misura FFA va fatta a parte (come già avvertito in D76).
- **Carte ancora in cambiamento** (passo 3 di SB-16g, SB-17/18 per Sergio e Duccio): il Maestro dipende dalla leggibilità delle carte e va tarato **dopo** che il pool si ferma; il Facile e il Normale non dipendono da nulla.

### Raccomandazione

**Dividere SB-30 in due blocchi e anticipare solo il secondo in playground, senza toccare la partita viva prima di SB-28.**

1. **SB-30a — livelli 1–3 e collegamento alla partita viva**, in SB-30 dopo SB-28 e SB-29. Usa codice che esiste già. È ciò che sblocca CA-1 e il single player. Include la scala di misura (4.1) per i tre livelli e la prova «nessuna informazione nascosta».
2. **SB-30b — Maestro**, **anticipato nel playground** come prototipo (profilo `bozza`, nessun effetto sulla partita viva e nessun cambio ai bot del banco: il banco SB-7 e i bot di D76 restano identici byte per byte), da avviare dopo il passo 3 di SB-16g e in parallelo con la sequenza SB-17…SB-27. Motivi: (a) è il blocco con più rischio tecnico e tempo; conviene scoprirlo presto; (b) è indipendente dal trasferimento perché lavora sulla vista; (c) un bot forte è anche uno **strumento di bilanciamento** (mostra carte rotte che i bot deboli non sfruttano); (d) la carriera non può essere sensata senza un avversario forte per i boss. Il rischio dell'anticipo è la taratura su un pool ancora in cambiamento: si accetta, rifacendo la scala a pool fermo.

L'alternativa «tutto dentro SB-30» è più semplice ma lascia scoprire il rischio del Maestro quando le carriere lo stanno già aspettando. L'alternativa «tutto subito» sposta lavoro sulla partita viva che SB-28 cambierà comunque.

### Stima a blocchi

Una **sessione di esecutore** è un'unità di lavoro con rapporto e STOP; S ≈ 1 sessione, M ≈ 2, L ≈ 3–4. Stime di ordine di grandezza.

| Blocco | Contenuto | Dimensione | Quando |
|---|---|---|---|
| B0 | Risposte alle domande di questo documento; scelta dei nomi e delle soglie | — (proprietario) | ora |
| B1 | Livello nel protocollo d'ingresso, nel client, nella CLI e nell'archivio; fabbrica di `BotPlayer` per livello anche per la FFA; stile come impronta del personaggio | M | SB-30a, dopo SB-28/SB-29 |
| B2 | Prova permanente «nessuna informazione nascosta» e registrazione della decisione nell'archivio | S | SB-30a |
| B3 | Scala di misura 1–3 sul banco con intervalli e quote; confronto con gli obiettivi di 4.1 | S–M | SB-30a |
| B4 | Sonda di costo e fedeltà per il Maestro (tempo per decisione, rumore, previsione a due turni sulla vista) | S | SB-30b, subito dopo il passo 3 di SB-16g |
| B5 | Maestro prototipo: previsione su più turni, mondi coerenti, valutazione finale, modello dell'avversario, interruzione al tempo massimo | L | SB-30b |
| B6 | Misura della scala a quattro livelli, taratura, prova umana alla cieca (4.2) | M | SB-30b, a pool fermo |
| B7 | Esecuzione fuori dal percorso sincrono, indicatore «sta pensando», prova con partite contemporanee | M | dopo SB-28, in SB-30 |

Totale: circa **6–8 sessioni per SB-30a più B7** (B1–B3, B7: M+S+S/M+M) **e 6–8 per SB-30b** (B4–B6: S+L+M), da fare in parallelo a sequenze di carte e non in aggiunta a esse. Le misure del Maestro sono la parte più cara in tempo macchina (§4.1).

## 6. Domande al proprietario

1. **Quanti livelli e che nomi?** Si propongono quattro (Facile, Normale, Difficile, Maestro). Tre bastano se preferisci togliere il Maestro dal Set Base e rimandarlo a quando le carriere lo chiedono; in tal caso SB-30 resta com'è e il Maestro diventa un blocco a parte. Nomi diversi, con il tono del gioco, da proporre?
2. **Nessun livello bara, nemmeno il massimo?** Raccomando di sì, con la prova permanente di §2. Il superboss «che può anche barare» (D11) lo trattiamo come **modificatore di incontro dichiarato** nella carriera e non come livello, e riconcilio la contraddizione apparente con CA-3 in quel senso. Confermi, oppure vuoi che il solo livello massimo legga la mano coperta (e allora lo dichiariamo ai giocatori, perché altrimenti sembra un difetto)?
3. **Che cosa può sapere il Maestro del mazzo avversario?** Le liste degli starter e le carte già viste sono informazione che un giocatore esperto ha: le usiamo? In open con un mazzo personalizzato non c'è lista nota: ci si limita alle carte già viste?
4. **Tempo al tavolo.** Mediana del Maestro sotto 1 s e tetto 2 s, con un «sta pensando» nel client, e gli altri livelli istantanei. Va bene, o preferisci un tetto più basso a costo di una forza minore?
5. **Il Normale resta il bot «senza previsione»**, quello che hai giudicato stupido il 13 novembre, come gradino intermedio e prevedibile, oppure deve già pararsi (cioè coincidere con il Difficile di oggi, e il Difficile diventare il livello con la previsione su due turni)? In questo secondo caso i livelli sono 1 casuale, 2 consapevole del turno, 3 a due turni e 4 Maestro.
6. **Chi sceglie il livello, e lo stile?** Il livello lo sceglie chi gioca in quick contro computer e lo fissa l'incontro in carriera? Lo stile (aggressivo, prudente, risorse) è un'impronta del personaggio o va a caso a ogni partita?
7. **Budget di calcolo delle misure dei livelli**, distinto da quello di D68 (il residuo del bilanciamento resta intatto)? Servono ore di CPU per il Maestro: quante vuoi concederne per il giro di taratura e quante per la scala finale?
8. **Quando.** Confermi la divisione: SB-30a dopo SB-28 e SB-29, e SB-30b (il Maestro) anticipato nel playground dopo il passo 3 di SB-16g, in parallelo alla sequenza delle carte e senza toccare la partita viva né il banco?
9. **Manopola del rumore.** Vuoi, in caso la scala non dia tassi accettabili tra Normale e Difficile (oggi 52,64%), che si provi un livello con un piccolo errore dichiarato, oppure preferisci che i gradini si facciano solo con la capacità (previsione) e mai con l'errore?

## Stato del documento

Versione 0.1: proposta, non approvata. Nessuna decisione registrata: la regia aggiorna il piano (Q2) dopo le risposte. Non sono stati modificati regolamento, documenti del set, codice, test, catalogo, client né piano.
