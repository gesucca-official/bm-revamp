# SB-16i — Proposta 1.6 (Fase A)

**Versione 0.1 — 14 novembre 2026 — proposta, nessuna attuazione.** Fase A di [SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima), nata da [D95](../../set-base-decisioni.md#decisioni-del-proprietario) e comprensiva di [D94](../../set-base-decisioni.md#decisioni-del-proprietario) (2). Solo progetto: nessuna partita, nessun codice, nessuna bozza toccata. STOP dopo il commit; il proprietario approva o corregge le [domande](#11-domande-al-proprietario).

**Fonti.** Regole in vigore: [regole-playground.md](regole-playground.md) 1.0; carte e liste: [bozza di riferimento 1.5](bozza-di-riferimento.md) (braccio B); regolamento 1.13 ([R02, R06](../../game-rules.md)) e [docs/sets/base.md](../../sets/base.md) invariati. Dati, senza nuove partite: [criteri euristici 1.5](../../reports/set-base/criteri-euristici-1.5.md), [ricerche fallite 20/2](../../reports/set-base/ricerche-fallite-20-2.md), [SB-16h 20/2](../../reports/set-base/sb-16h-report.md) e [dettagli](../../reports/set-base/sb-16h/details.md), [carte morte 20/2](../../reports/set-base/sb-16h/cards-20-2.md), [B5b, impatto della 1.6](../../reports/set-base/sb-30b-b5b-report.md#impatto-previsto-della-16). Analisi nuova, di sola lettura: [last-resort.py](../../reports/set-base/sb-16i/last-resort.py).

**Principi seguiti.** Testi brevi nella forma di D78, mai un rebus; nessuna risorsa nuova (D8); nessuna regola nuova sulla TOXICITY (D95); 20 carte e 2 copie (D94 (1)); titoli già previsti dalla [griglia](griglia.md) dove possibile, così il set resta a 120 carte e 45 C / 55 NC / 20 R; un cambiamento per problema, perché la Fase B ha un giro e al massimo una correzione numerica (D95 (3)).

## In breve

| Punto | Proposta | Serve codice? |
|---|---|---|
| «Annuncia» a due nomi | «Annuncia X o Y»: cerca X, se nel mazzo non c'è cerca Y; ordine stampato, nessuna scelta; gettone legato al nome trovato | sì: ricerca a lista nel motore del playground |
| Velocità | parola chiave **«D'anticipo: …»** su tre carte di Mara (Sorpasso, Sgommata, Cinghiata) | sì: il motore dice se la mossa precede quella del bersaglio |
| Tossicità | «Ghiaccio nel tovagliolo» (OGG-14) a Mara, «Due dita in gola» (GEN-15) a Piera e Beppe; titoli già in griglia | no: solo dati |
| Last resort | parola chiave **«Rincara X (Y a sé)»**; Banzai 5 (2), L'ultima dose 5 (1), L'ultimo giro 4 (1) | sì: contatore pubblico delle giocate |
| Piera | Bancone: HIT ×0,5 → ×0,65 (POISON ×0,5 invariato); salute 85 → 80 | no: solo dati |
| Bozza | la 1.6 entra direttamente in `bozza.json`, Bancone B compreso; la 1.5 congelata per i test storici | test e generatore |
| Budget | un giro da 648.000 partite più al massimo una correzione; tetto 3.300 s di orologio | — |

## 1. «Annuncia» con al massimo due nomi (D94)

### Definizione aggiornata

> **Annuncia X o Y.** Al posto della pesca che segue la mossa cerchi nel mazzo una carta di nome X; se nel mazzo non c'è nessuna X, una carta di nome Y. **Se la trovi:** va in mano, si mostra a tutti, applichi «Se lo trovi» e ricevi il gettone legato al nome trovato. **Se non trovi né X né Y:** peschi normalmente e applichi «Se non lo trovi».

Con un solo nome la carta resta «Annuncia X» e funziona come oggi (RP-13…RP-22). Tutto il resto delle regole del gettone resta invariato: ×1,5 a HIT, CUT e POISON, durata e uscita (RP-14…RP-17), cumulo (RP-20).

### Quando e come si sceglie il colpo cercato

- **Nessuno sceglie: decide l'ordine stampato.** Si cerca il primo nome; il secondo solo se del primo non resta nessuna copia nel mazzo. La scelta avviene alla ricerca, cioè dopo la mossa, come oggi.
- **Perché così.** Una ricerca fallisce solo se il mazzo non ha più copie ([nota sulle ricerche fallite](../../reports/set-base/ricerche-fallite-20-2.md)); il giocatore sa già quali colpi ha in mano o negli scarti, quindi sa in anticipo cosa troverà. Non serve un'opzione nuova della mossa, né un'interfaccia, né una decisione in più per i bot.
- **Se nel mazzo c'è solo uno dei due:** trovi quello. Se ci sono entrambi: trovi il primo.
- **Alternativa scartata** (domanda 2): far dichiarare il nome al momento della giocata. Dà un po' più di scelta, ma costa un'opzione nuova della mossa, il client, le mosse legali dei bot e una variante in più in `ViewTable`, per un caso raro: con entrambi nel mazzo si vuole quasi sempre il primo.
- **Una parola di gruppo** («Annuncia un colpo di Mara») non serve: due nomi restano leggibili (D94 (2)).

### A quale nome si lega il gettone

Al **nome trovato**, come oggi (D69, D71): lo soddisfa solo una giocata di quel nome; l'altro nome non c'entra. La carta mostrata è la copia trovata (RP-18). Il registro del turno e la vista pubblica dicono quali nomi si cercavano e quale si è trovato.

### Coppie per ogni caricamento

Di norma il raro e il comune dello stesso personaggio (D94). Ogni caricamento tiene come **primo nome** il colpo che cerca oggi, così le due carte restano distinte: il caricamento in due copie punta al colpo NC, il tutore in copia singola al raro. **Un solo «Se lo trovi» per carta**, valido per entrambi i nomi: deve bastare a pagare tutti e due i colpi partendo da zero (D63).

| Caricamento (copie) | Testo 1.6 | Cambia rispetto alla 1.5 |
|---|---|---|
| PAZIENZA: FINITA (2) | Annuncia GARGANTUESCO IMPATTO SUL TU o SPEDIAMOTI DUNQUE IN O-AHIO. Se lo trovi: +25 V, +15 A. Se non lo trovi: +5 V, +5 A. | secondo nome |
| TI FACCIO SPAZIO (1) | Annuncia SPEDIAMOTI DUNQUE IN O-AHIO o GARGANTUESCO IMPATTO SUL TU. Se lo trovi: **+25 V**, +15 A. Se non lo trovi: +5 V, +5 A. | secondo nome; +15 → +25 V, perché Impatto costa 25 V |
| Slalom d'avvicinamento (2) | Annuncia Sgommata o Cinghiata di traverso. Se lo trovi: **+20 A**. Se non lo trovi: +5 A. | secondo nome; +15 → +20 A, perché Cinghiata costa 20 A |
| Ti stringo la curva (1) | Annuncia Cinghiata di traverso o Sgommata. Se lo trovi: +20 A. Se non lo trovi: +5 A. | secondo nome |
| Dose in preparazione (2) | Annuncia Tossicone Scatarrante o C'è del sangue nella mia droga. Se lo trovi: +10 T, +5 A. Se non lo trovi: +5 T. | secondo nome |
| Un assaggino (1) | Annuncia C'è del sangue nella mia droga o Tossicone Scatarrante. Se lo trovi: +20 T. Se non lo trovi: +5 T. | secondo nome |
| Un altro e arrivo (2) | Annuncia Estasi da Coca Etilene o Rutto a distanza sociale. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. | secondo nome |
| Prima il brindisi (1) | Annuncia Rutto a distanza sociale o Estasi da Coca Etilene. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. | secondo nome |
| Preparo il lavoro (2) | 4 CUT al bersaglio. Annuncia Chiave da tredici o Lavoro fatto bene. Se lo trovi: +15 V. Se non lo trovi: +5 V. | secondo nome |
| Una stretta di prova (1) | 4 CUT al bersaglio. Annuncia Lavoro fatto bene o Chiave da tredici. Se lo trovi: +10 V. Se non lo trovi: +5 V. | secondo nome |

Controllo D63 sul secondo nome: O-Ahio 10 V, Cinghiata 20 A, C'è del sangue 10 T, Rutto 5 L, Estasi gratuita, Lavoro 10 V, Chiave 10 V, Sgommata 15 A, Tossicone 10 T, Impatto 25 V: tutti pagabili da zero col premio pieno della carta che li cerca. Gli unici premi che cambiano sono i due in grassetto.

**Effetto atteso sulle ricerche fallite.** Oggi 34% (44,7% sui colpi a copia singola, 28,6% su quelli a due copie). Con due nomi una ricerca fallisce solo se mancano dal mazzo tutte e tre le copie dei due colpi. Stima grezza, ipotizzando una debole correlazione fra le due assenze: **circa 12–18%**. Il dato reale arriva dal giro, coi contatori di SB-16h (che vanno estesi per dire quale nome si è trovato).

## 2. Parola chiave di velocità (D95 (1))

### Nome

| Proposta | Pro | Contro |
|---|---|---|
| **«D'anticipo»** (raccomandata) | si capisce senza spiegazioni; vale per ogni personaggio | — |
| «Sul tempo» | modo di dire della boxe e della scherma («bruciare sul tempo») | meno chiaro a chi non lo conosce |
| «In volata» | molto Mara (strada, corse) | suona di Mara anche sulle carte degli altri |

### Definizione

> **D'anticipo: E.** Se questa mossa si risolve **prima** della mossa del bersaglio, applica anche E.

Precisazioni, da scrivere in [regole-playground.md](regole-playground.md):

1. **«Prima»** significa in un **gruppo di velocità precedente** (RP-1): priorità più alta, oppure stessa priorità e ALERTNESS più alta **dopo i costi**. Nello stesso gruppo le mosse sono simultanee: **nessun anticipo**, nemmeno se l'ordine d'inserimento le mette in fila.
2. **Si decide quando la tua mossa si risolve**, guardando l'ordine già fissato (R04, 3–4): se il bersaglio ha una mossa in un gruppo successivo, E si applica, dopo gli effetti normali della carta.
3. **Il bersaglio non gioca** (nessuna mossa, mossa vuota tolta prima dei costi, eliminato o forfait): nessun anticipo, perché non c'è una mossa da precedere.
4. **La mossa del bersaglio sarà annullata più tardi** (da «FAI BASTA», da «Riflessi», o perché a terra all'inizio del suo gruppo, RP-1): l'anticipo **vale**, perché la tua mossa è comunque arrivata prima. Questo è il caso più importante: chi colpisce prima e manda a terra non riceve risposta (RP-1), e «D'anticipo» lo rende visibile.
5. **La tua mossa è annullata:** nessun effetto, quindi nessun anticipo.
6. **Il bersaglio è già a terra** quando la tua mossa si risolve ma la sua è ancora in attesa in un gruppo successivo: l'anticipo vale (in pratica è irrilevante).
7. Più avversari (FFA): conta solo la mossa del giocatore bersagliato.

Il registro del turno e la vista pubblica dicono «D'anticipo: sì» o «no» per ogni mossa che ha la parola chiave.

### Carte di Mara

Obiettivo: la velocità deve decidere, non solo aggiungere danni. Due leve: **rendere più debole la risposta** del bersaglio e **conservare il vantaggio di velocità** nel turno dopo; un solo picco di danno, sul raro. I costi in A contano: si confronta l'ALERTNESS **dopo** i costi, quindi Mara che spende 15 A per la Sgommata scende da 40 a 25 e diventa raggiungibile da Beppe (25) o da Celestina (35). Spendere A diventa una scelta di ritmo.

| Carta (copie, rarità) | Testo 1.6 | Cosa decide la velocità |
|---|---|---|
| Sorpasso in curva (2, C), priorità 2 | −8 A e 3 CUT al bersaglio. **D'anticipo: +8 A a sé.** | Contro le difese e le contromosse a priorità 2 (Bancone, Tartaruga, Riflessi, FAI BASTA, Sotto il cofano) decide l'ALERTNESS; contro tutto il resto arriva prima. Lo scarto di 16 A prepara l'anticipo del turno dopo. |
| Sgommata (2, NC), 15 A | 25 CUT al bersaglio. **D'anticipo: in questo turno il bersaglio infligge danni ×0,5.** | Mara colpisce prima e sbilancia: la risposta del bersaglio, nello stesso turno, vale metà. Contro un colpo a priorità 0 (Impatto, Mattone) è quasi sempre prima; contro i colpi a priorità 1 decide l'ALERTNESS dopo il costo. |
| Cinghiata di traverso (1, R), 20 A | Infliggi CUT pari a 18 più metà della tua A residua. **D'anticipo: +10 CUT.** | Il picco del raro legato alla preparazione (D63): A alta dà sia più danno sia l'anticipo, e un colpo più grosso prima della risposta manda a terra più spesso un avversario che non risponderà (RP-1). |

Nei dati: un passo «anticipo» che contiene altri passi (per la Sgommata tre stati OUTPUT ×0,5 a turni 0 sul bersaglio, uno per HIT, CUT e POISON, come la Tartaruga ne usa due). Nessuna di queste carte annulla mosse: la griglia esclude gli annullamenti per Mara.

### Candidate per il resto del set (SB-17–SB-19)

Non da attuare ora; da riprendere nei rispettivi blocchi.

- **Sergio** (A, priorità 2, contromosse): CES-AR1 «Oh, guarda là» (−10 A; 4 HIT), CES-AR4 «Parli troppo vicino», CES-AR6 «Malelingue»: «D'anticipo» è naturale per chi vive di priorità 2. Va pensato insieme a Q11 (Sergio che punisce gli annunci).
- **Duccio:** ROC-AR5 «Tre schiaffi, un euro» (6 HIT), un colpo gratuito che con l'anticipo diventa una piccola minaccia di ritmo.
- **Generiche:** GEN-09 `StunningBlow` (−10 A; 12 HIT), GEN-23 «Sgambetto» (−10 V; 5 HIT), GEN-22 «Acqua in faccia»: tecniche di disturbo in cui l'anticipo ha senso. Non su GEN-18 «Spintone», che deve restare il riempitivo onesto.

## 3. Tossicità: carte, non regole (D95 (1), R06 invariata)

### Verifica sulla 1.5

Nelle cinque liste solo due carte tolgono TOXICITY:

- **Metabolismo Corrotto** (Celestina): guadagni HEALTH pari a T/2, poi perdi tutta la T. Celestina è immune alla T: per lei non è una cura ma la conversione della sua risorsa in salute.
- **ORMALE GUARIAMOTI** (Spazienzio, GEN-07): bersaglio `OPPONENT`, **azzera T e L del bersaglio**, non le proprie. **La premessa va precisata:** Spazienzio non può togliersi la propria T. Ormale è invece una risposta preventiva a Celestina: le toglie la scorta prima che la trasferisca con «C'è del sangue», e a Piera toglie la L.

Nessun altro starter ha un modo di abbassarsi la T. La T arriva da Celestina (Tossicone +5 T, «C'è del sangue» che trasferisce tutta la sua T, L'ultima dose +4 T) e dai propri oggetti (Panino del kebab +3 T a Mara, Negroni +3 T a Spazienzio). Con R06 la T non cala da sola e fa POISON T/2 a ogni fine turno: un trasferimento di 20–30 T vale 10–15 danni a turno fino alla fine.

### Proposta

Due titoli **già previsti dalla griglia e non ancora in uno starter**, quindi nessun titolo nuovo: il set resta a 120 e a 45 C / 55 NC / 20 R. Entrambi tolgono **solo la propria T**, mai quella del bersaglio: non spengono gratis il motore di Celestina, per cui la T è la risorsa che spende ([griglia](griglia.md), GEN-15: «costa salute, così non annulla gratis Celestina»). Contro Celestina tolgono il danno periodico, non il suo carburante; il carburante lo toglie già Ormale, nel mazzo di Spazienzio.

| Starter | Esce | Entra | Testo | Perché questa |
|---|---|---|---|---|
| Mara | Steal ×1 (GEN-02, C) | **Ghiaccio nel tovagliolo** ×1 (OGG-14, NC, oggetto) | Consumato: +10 HEALTH; azzera la tua T. | Mara ha salute bassa (70) e porta due Panini (+3 T ciascuno): cura e pulizia insieme. Steal non è mai giocata dai bot (0,0% in [20/2](../../reports/set-base/sb-16h/cards-20-2.md)). L'oggetto resta sul campo finché serve; Mara lo consuma con la basic. Mara esaurisce poco il mazzo (7,2%), quindi la pesca in più dell'oggetto pesa poco. |
| Piera | Grab ×1 (GEN-01, C) | **Due dita in gola** ×1 (GEN-15, NC) | 5 HIT a sé; azzera la tua T e la tua L. | Il sapore è suo. Azzerare la L costa corazza e carburante, ma dopo Estasi, Rutto o L'ultimo giro la L è già a zero: è una scelta di tempo, non una carta gratis. Un'azione e non un oggetto, perché Piera esaurisce già spesso (22,6%). Grab è giocata nel 18,9% delle partite e resta in una copia, più la basic. |
| Beppe | Steal ×1 (GEN-02, C) | **Due dita in gola** ×1 (GEN-15, NC) | 5 HIT a sé; azzera la tua T e la tua L. | Beppe ha già sette oggetti su 20 e l'esaurimento più rapido (turno 10,6): meglio un'azione. Steal è allo 0,0% anche qui. |

Rarità delle copie dopo lo scambio: Mara C 11 · NC 8 · R 1; Piera C 12 · NC 7 · R 1; Beppe C 9 · NC 10 · R 1. Restano 20 carte e al massimo 2 copie (R02, D94).

**Spazienzio.** Nessuna carta nuova: ha Ormale come risposta preventiva contro Celestina e Spazienzio–Celestina è dentro la soglia (36,4%, di poco). Se il giro lo porta sotto il 35%, la correzione numerica può scambiare una carta poco giocata (Denti stretti, 14,6% delle partite) con «Due dita in gola» (domanda 5).

**Candidate generiche per SB-19:** GEN-15 e OGG-14 restano generiche, ora usate negli starter (la loro taratura in SB-19 deve guardare anche gli starter); GEN-22 «Acqua in faccia» (azzera la L del bersaglio) è la gemella contro Piera; una generica che **abbassi** la T del bersaglio (non l'azzeri), per esempio −10 T e 6 HIT, sarebbe la tecnica economica contro Celestina per i mazzi costruiti.

## 4. Last resort che cresce (D95 (1))

### Forma del testo: parola chiave «Rincara»

Da «rincarare la dose». Accorcia il testo e si legge da sola:

> **Rincara X (Y a sé).** Per ogni volta che hai già giocato questa carta nella partita, +X ai danni al bersaglio e +Y ai danni a sé.

La prima giocata usa i numeri stampati, la seconda +X, la terza +2X, come la tassa del comandante di Magic. Senza «(Y a sé)» cresce solo il danno al bersaglio.

### Dove si conta e chi lo vede

- **Per giocatore e per titolo:** «le tue giocate di questa carta in questa partita». Ogni mazzo ha una sola last resort, quindi per la last resort coincide con «per carta»; le giocate dell'avversario non contano. Contare per titolo (non per copia) rende la parola riusabile sulle carte regolari in due copie.
- **Conta ogni giocata, anche annullata:** la mossa è stata mostrata e pagata. Regola semplice e verificabile da tutti.
- **Informazione pubblica.** Ogni giocata è già pubblica nelle mosse risolte; il motore tiene il contatore e lo pubblica nella vista di entrambi i giocatori, accanto alla last resort («giocata 2 volte · prossima: 20 HIT, 9 a sé»). I bot lo leggono dalla vista (R08), senza memoria propria.

### Testi nuovi

| Carta | 1.5 | 1.6 | Sequenza al bersaglio / a sé |
|---|---|---|---|
| Last Resort: Banzai!!! (Spazienzio, Mara, Beppe) | Last resort: 5 HIT a sé; 10 HIT al bersaglio. | Last resort: 5 HIT a sé; 10 HIT al bersaglio. **Rincara 5 (2 a sé).** | 10, 15, 20, 25 / 5, 7, 9, 11 |
| L'ultima dose (Celestina) | Last resort di Celestina: 2 HIT a sé; 7 POISON e +4 T al bersaglio. | Last resort di Celestina: 2 HIT a sé; 7 POISON e +4 T al bersaglio. **Rincara 5 (1 a sé).** | 7, 12, 17, 22 / 2, 3, 4, 5 |
| L'ultimo giro (Piera), facoltativa | Last resort di Piera: 2 HIT a sé; HIT pari a 12 più la propria L residua al bersaglio, poi azzera la propria L. | … **Rincara 4 (1 a sé).** | 12, 16, 20, 24 (+ L) / 2, 3, 4, 5 |

**Perché questi incrementi.**

- **Il danno cresce più del contraccolpo.** Negli specchi entrambi arrivano alla last resort quasi insieme: un contraccolpo che cresce quanto il danno porta a morti simultanee e quindi a **patte**, e gli specchi di Piera (9,88%) e Celestina (7,74%) sono già vicini al 10% (D51). Il contraccolpo cresce, come chiede il proprietario, ma piano.
- **L'ultima dose cresce di più in proporzione** (5 su 7): nello specchio di Celestina, il più lungo (14,5 turni), il bersaglio è immune alla T e l'ultima dose fa solo 7 POISON. Il +4 T resta: contro chi non è immune la dose già cresce da sola.
- **L'ultimo giro** non era nell'elenco di D95 per nome, ma D95 parla di «propria last resort» per tutti; cresce già con la L. Lo propongo con un incremento più piccolo (domanda 6).

### Stima con i dati esistenti

[last-resort.py](../../reports/set-base/sb-16i/last-resort.py) sui contatori del giro 20/2 di SB-16h, soli euristici. Modello dichiaratamente grezzo: la k-esima giocata vale base + (k−1)·X; una partita che oggi si chiude dopo k giocate si chiude quando le giocate con Rincara raggiungono lo stesso danno; k geometrica con la media osservata. Ignora le altre carte, le difese e il contraccolpo.

| Incontro | Partite finite dopo una LR | LR giocata (A / B) | Giocate per partita in cui la si gioca (A / B) | Turni medi risparmiati, proposta | idem con «Rincara pari alla base» |
|---|---:|---:|---:|---:|---:|
| Celestina–Celestina | 53,7% | 46,7% / 46,7% | 2,26 / 2,26 | 0,18 | 0,27 |
| Piera–Piera | 18,5% | 14,6% / 14,6% | 1,10 / 1,10 | 0,00 | 0,00 |
| Celestina–Beppe | 16,6% | 0,5% / 17,0% | 1,00 / 1,70 | 0,02 | 0,04 |
| Celestina–Piera | 14,4% | 4,1% / 15,1% | 1,32 / 1,79 | 0,02 | 0,04 |
| Spazienzio–Beppe | 8,6% | 0,0% / 8,6% | — / 1,50 | 0,00 | 0,01 |
| gli altri dieci | 0–6,5% | ≤ 6,6% | 1,0–1,7 | ≤ 0,005 | ≤ 0,01 |

**Lettura.**

- **Tocca l'11,2% delle partite fra euristici**, quasi tutte negli incontri di Celestina e nello specchio di Piera. Nello specchio di Celestina più di metà delle partite finisce dopo una last resort.
- **Coi bot la fase di last resort è già breve:** in media 1,0–1,8 giocate per chi la gioca, 2,3 nello specchio di Celestina. La crescita accorcia la coda, non la media: col modello, una partita da 4 giocate scende a 3, una da 5–6 a 4. In media lo specchio di Celestina perde **circa 0,2 turni** (0,3 con un incremento pari alla base), cioè 0,3–0,5 turni nelle partite toccate. Gli altri incontri restano praticamente uguali.
- **La lunghezza che il proprietario ha sentito nella prova umana** è probabilmente quella coda: un umano che si difende allunga la fase di last resort più del bot. La crescita serve a quella; la durata media dei giri non sarà la prova che funziona. Per misurarla, la Fase B aggiunge ai contatori la distribuzione delle giocate di last resort per partita (oggi ci sono solo giocate e partite).
- **Rischio sulle quote:** una last resort che cresce rende meno grave esaurire il mazzo, e Celestina è lo starter che esaurisce di più (28,4%). Mara–Celestina può peggiorare un poco per Mara; l'effetto è piccolo perché in quell'incontro solo il 4,8% delle partite arriva alla last resort.

Se il proprietario vuole una chiusura più netta, l'alternativa è «Rincara pari alla base» (Banzai 10, Dose 7): la k-esima giocata vale k volte la prima. Raddoppia l'effetto, con un rischio più alto di patte negli specchi (domanda 6).

## 5. Piera: un po' meno muro contro i colpi (D95 (1))

**Oggi.** Il muro di Piera contro i **colpi** (HIT) è fatto di quattro cose: salute 85, la più alta; corazza dell'alcol L/4 (RP-6, regola di sistema, non si tocca); «Il bancone regge, io pure» (2 copie, priorità 2: HIT e POISON ×0,5 nel turno, +5 L), giocata nel 70,4% delle partite; gli oggetti che danno L (Amaro +20 L). Spazienzio fa solo HIT: è chi soffre di più il muro. Spazienzio–Piera è **30,1%** sui soli euristici, lo scarto più grande del set, mentre col solo casuale Spazienzio vince il 61,4%: le sue carte sono forti, è la difesa giocata bene a fermarle.

| Numero | 1.5 | 1.6 | Perché |
|---|---|---|---|
| Bancone, HIT ricevuto | ×0,5 | **×0,65** | Colpisce proprio il muro contro i colpi. Un Impatto parato passa da 17 a 22 danni prima della corazza. Il POISON ×0,5 resta (braccio B, D89): il Bancone resta la risposta di Piera a Celestina. |
| Salute di Piera | 85 | **80** | Riduce il muro in modo uniforme, anche contro il CUT di Mara (Mara–Piera 34,8%), su cui il Bancone non agisce. Resta la salute più alta del set insieme a Beppe. |

Restano: corazza (regola di sistema), Amaro, carte d'attacco. **Il ruolo resta:** con ×0,65 il Bancone è ancora la parata più forte di Piera contro i colpi, e 80 di salute più la corazza la tengono la più resistente agli HIT. Riserva per la correzione numerica, se Spazienzio–Piera resta sotto il 35%: Amaro +20 → +15 L (meno corazza e meno carburante).

Testo del Bancone 1.6: «In questo turno moltiplica per 0,65 i danni da colpo e per 0,5 quelli da veleno che ricevi. Guadagni 5 L.»

## 6. Supporto nel motore e nei bot

### Formato dati e codice, punto per punto

Regola del piano: un giro non cambia `server/src/main` fuori da `com/gsc/bm/sim` e `com/gsc/bm/model/cards/base`. Tre dei cinque punti richiedono il motore del playground in `model/game` e `model`, come SB-16c (regole d50) e SB-16f0 (vista pubblica): servono un'**eccezione esplicita** del proprietario (domanda 8), con le stesse garanzie di D84 e D88: tutto dietro `Ruleset.playground()`, parametri facoltativi col valore che lascia identico il comportamento, prove d'identità.

| Punto | Già nel formato dati? | Codice in `sim` / `cards/base` | Codice fuori dai due package (eccezione) |
|---|---|---|---|
| Annuncia a due nomi | No: il passo `search` ha un solo `card` | `DataCards.SearchStep`: campo `cards` (1–2 binding distinti, mai oggetti, RP-10), `card` resta per le vecchie bozze; controlli del caricatore | `Character.requestSearch` a lista; `Game`: prova i nomi in ordine; `Move.recordSearch` registra cercati e trovato; `PrintedEffects.Step.searchedCard` → lista (B5b la legge già come lista) |
| D'anticipo | No: nessun passo condizionato, e i passi non conoscono l'ordine | `DataCards`: passo `anticipo` con passi annidati, applicati se l'autore è «in anticipo» | `Game`: prima di `applyEffectTo` dice all'autore se il bersaglio ha una mossa in un gruppo di velocità successivo (la mappa `speed` esiste già, solo nel playground); `Move`: campo pubblico facoltativo `ahead`; `PrintedEffects`: segno «solo d'anticipo» sui passi |
| Tossicità | **Sì**: `gain` HEALTH, `empty` TOXICITY e ALCOHOL, oggetti a dati | due definizioni nuove in `bozza.json` (`base.items.GhiaccioNelTovagliolo`, `base.com.DueDitaInGola`) | nessuno |
| Rincara | No: `Amount` legge solo risorse | `DataCards.Amount`: campi facoltativi `perPlay` (e il suo uso nei danni a sé), default 0; `base.pino.UltimoGiro`: `@Tunable(optional = true)` `perPlay = 0`, `perPlaySelf = 0` | contatore delle giocate per titolo nel personaggio o nel giocatore, incrementato da `Game` a ogni giocata (anche annullata), solo nel playground; pubblicato nella vista solo se non vuoto; `PrintedEffects`: `perPlay` nell'importo |
| Piera | **Sì**: fattore dello stato e salute del personaggio | nessuno | nessuno |

**Partita viva 1.13 identica byte per byte.** Nessuna carta viva cambia: Banzai e L'ultima dose cambiano solo come definizioni a dati della bozza (oggi già sovrascrivono `com.last.Struggle` e `junkie.LethalHeroinDose` nel playground). Ricerca, anticipo e contatore girano solo con `d50`; i campi nuovi della vista pubblica mancano quando sono vuoti, come `search` e `voidReason` di SB-16f0. Cancelli della Fase B: identità viva (come `live-identity.json` di SB-16h), contesto Spring separato dai test unitari, `check-rules.py` invariato, e **prova d'identità del codice**: col codice nuovo e la bozza 1.5 il passo 0 deve coincidere byte per byte con `step0-20-2` di SB-16h. Solo dopo si cambia la bozza. Mutazioni sui rami nuovi: ordine dei nomi, solo il secondo nel mazzo, nessuno dei due; anticipo per priorità, per ALERTNESS, stesso gruppo, bersaglio senza mossa; contatore con mossa annullata; `perPlay` a zero.

### Cosa devono imparare i bot

Senza questo il giro misurerebbe carte che i bot non giocano, come oggi Steal (0,0%).

- **Stili euristici** (`StyleSupport` e i tre stili):
  - **Tossicità:** oggi uno stile valuta la T solo come costo pagato (`spent`). Deve valutare `empty`/`lose` di TOXICITY su di sé quando non è immune: circa T/2 di POISON evitato a ogni fine turno, su un orizzonte breve (2 turni), con il peso di ciascuno stile. Da `PrintedEffects`, non dal testo `gains`.
  - **D'anticipo:** il valore del passo condizionato pesato con una stima pubblica: priorità della carta e propria ALERTNESS dopo il costo, contro l'ALERTNESS dell'avversario e la priorità tipica delle sue carte scoperte; nello stesso gruppo vale zero.
  - **Rincara:** il danno nominale della carta tiene conto del contatore (oggi lo stile legge l'importo stampato).
- **`LethalAwarePolicy` / `TurnForecast`** (livello Normale):
  - minaccia del bersaglio dopo una ricerca a due nomi: invariata, perché la carta trovata è mostrata come oggi; nelle varianti della propria ricerca, «trovato il primo / il secondo / nessuno»;
  - «D'anticipo» nella previsione del turno: con l'ordine dei gruppi già simulato, l'effetto si applica se la propria mossa precede la minaccia; contro «nessuna mossa nota» non si applica (prudente). Una Sgommata d'anticipo diventa una **salvezza** contro un colpo letale mostrato, perché lo dimezza;
  - Rincara: danni al bersaglio e a sé della prossima giocata col contatore pubblico, nel controllo del colpo letale e della patta (D77 (2));
  - fedeltà della previsione: `TurnForecastFidelityTest` senza discrepanze sui tre effetti nuovi (cancello di D84).
- **`ViewTable`** (B5a): ricerca a lista con l'esito «trovato il primo / il secondo / nessuno»; flag d'anticipo calcolato dall'ordine simulato; contatore delle giocate nella tavola, incrementato a ogni giocata simulata. `ViewTableFidelityTest` sui nuovi effetti.
- **Difficile** (la lista di B5b): `sought` restituisce già una lista; le varianti di ricerca passano da due a tre per posto, quindi il costo va rimisurato (oggi P90 7,84 ms contro un tetto di 50 ms); l'anticipo e il contatore arrivano dalla tavola. La prova «nessuna informazione nascosta» resta valida. **Il Difficile non entra nel giro** (D85 (8)).
- **Fuori da SB-16i:** un bot che non annuncia quando entrambi i nomi sono fuori dal mazzo. I giocatori lo sanno fare, ma cambierebbe il bot di misura insieme alle carte: meglio in SB-30, dopo.

### Client della bozza (SB-16f0)

- Testi delle carte: arrivano già dal campo `gui` della bozza, quindi «D'anticipo» e «Rincara» compaiono senza codice.
- **Ricerca a due nomi:** `Move.search` porta i nomi cercati e quello trovato; il riepilogo dice «Ricerca: «X» o «Y», trovata «Y», mostrata a tutti» oppure «nessuna delle due nel mazzo, pesca normale».
- **D'anticipo:** campo facoltativo della mossa pubblica; nel riepilogo «D'anticipo: sì, prima di «Z»» oppure «no: stesso gruppo» / «no: dopo».
- **Contatore:** accanto alla last resort, propria e dell'avversario, «giocata n volte · prossima: … al bersaglio, … a sé».
- Tocca `client-web/src` (`contracts.ts`, `resolution.ts`, la vista della carta) e `docs/api.md`: coordinamento con C4 secondo [l'allineamento fra le macchine](../../orchestrazione-lavoro.md#allineamento-fra-le-macchine), nessun file di C4, jar rifatto prima di ogni verifica del client.

## 7. Bozza giocabile: la 1.6 direttamente in `bozza.json`

**Raccomandazione: sì.** Nella Fase B la 1.6 entra in `server/src/test/resources/set-base/bozza.json`, **col Bancone del braccio B già dentro** (e già con ×0,65). Così il server della prova umana (`application-bozza.yml` legge solo `bozza.json`) gioca esattamente la bozza misurata, senza file a parte né `-Draft`.

Conseguenze da gestire nella stessa Fase B:

- **Storico congelato:** la 1.5 (braccio A più `bancone-b.json`) resta riproducibile in una copia congelata, per esempio `set-base/storico/bozza-1.5.json` e `bancone-b.json` invariato. I test che riproducono misure storiche (identità di SB-16g e SB-16h, `Correzione15Test`, `PotenzaD82Test`, `DeckSizeVariantsTest`, `SetBaseArms`) leggono la copia congelata; quelli che descrivono la bozza corrente leggono `bozza.json`. Nessun atteso cambia per accettare una regressione: cambiano solo i file letti, citando la decisione.
- **Generatore della bozza di riferimento:** dopo la fusione `genera-bozza-di-riferimento.py` legge il solo `bozza.json`, senza sostituzione; [bozza-di-riferimento.md](bozza-di-riferimento.md) si rigenera come «Bozza di riferimento 1.6» e la nota sul braccio A si chiude.
- `SetBaseArms.armB` diventa un'identità sulla bozza corrente; resta per le misure storiche sulla copia congelata.

## 8. Effetti attesi sugli incontri

**Previsioni dichiarate, non promesse.** Soglia minima D95: quota fra 35% e 65% sui soli euristici, patte al massimo 10%, durata entro 12 turni fuori dagli specchi. Quota del primo nominato; 1.5 dal [ricalcolo](../../reports/set-base/criteri-euristici-1.5.md).

| Incontro | 1.5: quota / patte / turni | Previsione 1.6 | Leve principali | Rischio |
|---|---|---|---|---|
| Spazienzio–Spazienzio | 50,3 / 3,6 / 9,1 | invariato | due nomi, Rincara simmetrici | — |
| Spazienzio–Mara | 58,2 / 3,5 / 9,1 | **50–56** | Sgommata d'anticipo dimezza Impatto e Mattone (priorità 0) | Mara potrebbe passare avanti |
| Spazienzio–Celestina | 36,4 / 5,0 / 10,1 | 35–40 | PAZIENZA a due nomi; anche Celestina ne guadagna | **può scendere sotto 35**: riserva «Due dita in gola» a Spazienzio |
| **Spazienzio–Piera** | **30,1** / 1,3 / 9,6 | **35–41** | Bancone ×0,65, salute 80, PAZIENZA a due nomi | può restare appena sotto: riserva Amaro +15 L |
| Spazienzio–Beppe | 48,3 / 1,6 / 8,0 | 46–52 | — | — |
| Mara–Mara | 50,3 / 4,5 / 8,8 | invariato; patte 4–6 | anticipo simmetrico | — |
| **Mara–Celestina** | **31,5** / 5,2 / 9,6 | **36–42** | Ghiaccio contro la T, anticipo contro Celestina (A 35, contesa), due nomi su un mazzo che fallisce il 37% delle ricerche | Rincara della dose e i due nomi di Celestina vanno contro Mara |
| **Mara–Piera** | **34,8** / 5,4 / 9,3 | **40–46** | salute di Piera 80, anticipo contro una Piera lenta (A 15) finché non trova «Un altro e arrivo» (+35 A) | — |
| Mara–Beppe | 36,4 / 1,0 / 7,5 | 40–46 | anticipo, due nomi | Beppe a 25 A dopo il costo della Sgommata è nello stesso gruppo |
| Celestina–Celestina | 49,6 / 7,7 / **14,5** | invariato; turni 14,0–14,4; patte 7–9 | Rincara della dose (circa −0,2 turni), due nomi | specchio, fuori dal limite di durata |
| Celestina–Piera | 61,8 / 8,1 / 11,0 | 57–62 | «Due dita in gola» contro la T; meno muro va nella direzione opposta | patte vicine al 10% |
| Celestina–Beppe | 46,0 / **9,55** / 9,2 | 42–47; patte 8–10 | «Due dita in gola» a Beppe | **patte oltre il 10%** se il contraccolpo pesa |
| Piera–Piera | 50,0 / **9,88** / 11,1 | patte 8–10 | meno muro accorcia; Rincara quasi irrilevante (1,1 giocate) | **patte oltre il 10%** |
| Piera–Beppe | 50,3 / 1,7 / 8,3 | 46–51 | meno muro contro gli HIT di Beppe | — |
| Beppe–Beppe | 55,8 / 9,0 / 6,8 | invariato | — | patte vicine al 10% |

Attesa complessiva: i tre incontri fuori (Spazienzio–Piera, Mara–Celestina, Mara–Piera) rientrano o si avvicinano a meno di 2 punti; nessun incontro nuovo fuori sulla quota; il rischio vero sono le **patte** dei tre specchi o quasi specchi già vicini al 10%. Per questo il contraccolpo cresce poco. La correzione numerica, se serve, tocca prima i numeri riservati: Amaro, la riserva di Spazienzio, l'incremento del contraccolpo.

## 9. Budget della Fase B

Separato da ogni altro budget, **mai insieme ad altre misure** (B5c compreso), Maven da solo sulla macchina (D85 (8), [insidie](../../orchestrazione-lavoro.md#insidie-degli-strumenti-di-verifica-windows)).

**Riferimenti misurati.** Giro 1.5: 648.000 partite in 501,2 s di banco, 508,2 s di orologio ([rapporto 1.5](../../reports/set-base/sb-16g-15-report.md)); lo stesso 20/2 coi contatori di SB-16h: 631,9 s di banco. Passo 0 (8.640 partite): 18,7 s di banco, 25,5 s di orologio. La 1.6 aggiunge poco lavoro ai bot Normali e accorcia un po' le partite: **stima del giro 550–800 s di orologio**.

| Voce | Partite | Tetto (orologio) |
|---|---:|---:|
| Passo 0 d'identità: codice nuovo, bozza 1.5, uguale a `step0-20-2` | 8.640 | 150 s |
| Passo 0 di fattibilità sulla 1.6 | 8.640 | 150 s |
| Giro unico 1.6 (15 incontri × 144 celle × 300 semi, semi 7.000.000–7.000.299, otto thread) | 648.000 | 1.500 s |
| Al massimo una correzione numerica: passo 0 più giro | 656.640 | 1.500 s |
| **Totale** | | **3.300 s** |

Regola di fattibilità, tarata sui giri misurati (giro / passo 0 di banco: 501,2 / 18,7 = 26,8 nella 1.5, 631,9 / 23,4 = 27,1 in SB-16h; la formula più prudente di SB-16h, × 75 × 1,5, darebbe già 2.100 s sulla 1.5): s0 × 40 + 120 ≤ 1.500 s, cioè **s0 ≤ 34,5 s di banco** sul passo 0 di fattibilità. Se non passa, STOP prima del giro e domanda al proprietario (nessuna riduzione dei semi senza decisione). Un campione fallito o un rilancio contano nel budget. Nessuna taratura fra passo 0 e giro; la correzione cambia solo numeri già scritti in questa proposta.

## 10. Aggiornamento di regole-playground.md (Fase B, non ora)

Nuova versione **1.1**, con la fonte nella decisione che approva questa proposta:

- **Sezione 3** («Annuncia X»): RP-13 diventa «Annuncia X» o «Annuncia X o Y» con l'ordine stampato; RP-14 e RP-15 dicono «il nome trovato»; RP-19 «se non trovi né X né Y»; RP-22 aggiunge il campo `cards` del formato.
- **Sezione 4** («Parole chiave»): definizioni di **D'anticipo** (con i sette casi della [sezione 2](#definizione)) e di **Rincara** (contatore per giocatore e per titolo, pubblico, anche sulle giocate annullate).
- **Sezione 5** («Principi di composizione»): il caricamento può annunciare due nomi, di norma il raro e il comune dello stesso personaggio; il premio «Se lo trovi» basta per entrambi (D63).
- **Sezione 6** («Bot e misura»): i bot leggono anche il contatore di Rincara e l'ordine dei gruppi per «D'anticipo»; la misura conta quale nome è stato trovato e la distribuzione delle giocate di last resort.
- **Sezione 7** («Decise, da attuare in SB-16i»): si svuota, perché i contenuti entrano nelle sezioni 3–6.
- **Sezione 8** («Fonti superate»): aggiunge la definizione a un nome della 1.0 per le carte che ne annunciano due.

Nello stesso commit della Fase B: [bozza-di-riferimento.md](bozza-di-riferimento.md) rigenerata come 1.6 e la [griglia](griglia.md) aggiornata (OGG-14 e GEN-15 negli starter, testi dei caricamenti, Bancone, salute di Piera, last resort).

## 11. Domande al proprietario

1. **Nome della parola chiave di velocità:** «D'anticipo», «Sul tempo» o «In volata»? *Raccomando «D'anticipo»*: si capisce senza spiegazioni e vale per tutti i personaggi.
2. **Quale colpo si cerca con due nomi:** ordine stampato (cerca il primo, se manca il secondo) o scelta del giocatore alla giocata? *Raccomando l'ordine stampato*: niente opzione nuova nella mossa, nel client e nei bot, e il giocatore sa già cosa troverà.
3. **Premi:** un solo «Se lo trovi» valido per entrambi i nomi, con TI FACCIO SPAZIO a +25 V e Slalom a +20 A, gli altri invariati? *Raccomando sì*: testo corto e D63 rispettata.
4. **Mara:** «D'anticipo» su Sorpasso in curva (+8 A a sé), Sgommata (il bersaglio infligge ×0,5 nel turno) e Cinghiata di traverso (+10 CUT)? *Raccomando sì*: due effetti di ritmo e un solo picco di danno, sul raro.
5. **Tossicità:** Ghiaccio nel tovagliolo a Mara al posto di Steal; Due dita in gola a Piera al posto di un Grab e a Beppe al posto di uno Steal; niente per Spazienzio, che ha Ormale come risposta preventiva, salvo che il giro lo porti sotto il 35% contro Celestina? *Raccomando sì*, con la riserva per Spazienzio da usare solo nella correzione numerica.
6. **Rincara:** parola chiave «Rincara X (Y a sé)», contatore per giocatore e per titolo, pubblico, che conta anche le giocate annullate; Banzai 5 (2), L'ultima dose 5 (1); e anche L'ultimo giro 4 (1)? *Raccomando sì a tutto, compreso L'ultimo giro*, per coerenza con «la propria last resort» di D95. Alternativa più netta: «pari alla base» (Banzai 10, Dose 7), che raddoppia l'effetto e il rischio di patte negli specchi.
7. **Piera:** Bancone HIT ×0,5 → ×0,65 **e** salute 85 → 80? *Raccomando entrambi*: il Bancone agisce sui colpi di Spazienzio e Beppe, la salute anche sul CUT di Mara; Amaro +15 L resta come riserva.
8. **Perimetro della Fase B:** eccezione esplicita per `model/game` (`Game`, `Move`), `model/Character` o `Player`, `model/cards/PrintedEffects`, il package dei bot, `client-web/src` e `docs/api.md`, sempre dietro `Ruleset.playground()` e coi cancelli della [sezione 6](#formato-dati-e-codice-punto-per-punto)? *Raccomando sì*: senza motore i tre punti di sistema non si esprimono, e i precedenti (SB-16c, SB-16f0, D84) hanno funzionato con queste garanzie.
9. **Bot:** gli stili euristici e il Normale imparano tossicità, anticipo e Rincara nella stessa Fase B, prima del giro; il bot che evita gli annunci a vuoto aspetta SB-30? *Raccomando sì*: senza, le carte nuove resterebbero morte come Steal, e il giro misurerebbe i bot invece delle carte.
10. **Bozza:** la 1.6 entra direttamente in `bozza.json`, col Bancone B, e la 1.5 resta in una copia congelata per i test storici? *Raccomando sì*: il server della prova umana gioca la bozza misurata senza file a parte.
11. **Budget:** passo 0 d'identità e di fattibilità (150 s ciascuno), un giro (1.500 s) e al massimo una correzione (1.500 s), **3.300 s di orologio in tutto**, mai insieme ad altre misure? *Raccomando sì.*
12. **Ordine dopo SB-16i:** SB-17 comunque, con gli scostamenti dichiarati (D95 (3)), e una prova umana breve della 1.6 solo se il proprietario la vuole prima di SB-17? *Raccomando una prova breve*: due delle tre meccaniche (anticipo, Rincara) si giudicano meglio giocando.
