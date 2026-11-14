# Piano Set Base — storico

> **Origine.** Questo documento raccoglie, parola per parola, il testo che [docs/set-base-plan.md](../set-base-plan.md) conteneva prima del consolidamento della documentazione del Set Base (decisione D96, 14 novembre 2026; piano di partenza: commit `8f2608a`). I titoli sono quelli del piano. **Non è normativo e non è aggiornato**: lo stato vero è nel [piano](../set-base-plan.md), le decisioni sono nel [registro](../set-base-decisioni.md#decisioni-del-proprietario). Gli unici adattamenti rispetto al piano sono i target dei link (percorsi relativi a `docs/history/` e ancore che puntano al piano o al registro): le parole non sono cambiate. Prova: [verifica-spostamenti.py](../reports/set-base/consolidamento/verifica-spostamenti.py).

## Testa del piano

*Righe 6–11 del piano prima del consolidamento: premessa e «Stato in breve» al 14 novembre 2026.*

Il lavoro procede su istruzione del proprietario, a blocchi, anche due in parallelo con file separati
([metodo](../orchestrazione-lavoro.md#sessioni-avviate-dalla-regia)). I blocchi che non toccano il client partono senza aspettarne la fine
([D30](../set-base-decisioni.md#decisioni-del-proprietario)); quelli che lo toccano (SB-1, SB-2, poi SB-8) sono anticipati in parallelo a C4 con paletti scritti
nella loro sezione ([D40, D42](../set-base-decisioni.md#decisioni-del-proprietario)). **Stato in breve:** fondamenta, strumenti, progetto e i cinque starter
(base e avanzati) chiusi e approvati (tabella dei [blocchi](#blocchi)); chiusa anche SB-8, la bozza giocabile da umani (D46). **Al passaggio alla regia unica (10 novembre 2026):** nessun blocco in corso, nessun esecutore attivo, nessun prompt in sospeso, working tree pulito. **Prove umane SB-12b e SB-16 fatte il 12 novembre 2026**, giudizio nelle sezioni dei due blocchi. **SB-16b fatta il 12 novembre 2026** (Fase A e B, decisioni [D50–D53](../set-base-decisioni.md#decisioni-del-proprietario)). **SB-16c fatta il 12 novembre 2026**, domande risposte ([D54](../set-base-decisioni.md#decisioni-del-proprietario)). **SB-16d attuata il 12 novembre 2026** (proposta approvata D55, invarianti e bound verdi; [rapporto](../reports/set-base/sb-16d-report.md)). SB-16e, SB-16e2 (D56, D57), SB-16f0 e la prova umana [SB-16f](#sb-16f--prova-umana-degli-starter-rifatti) fatti fra il 12 e il 13 novembre 2026. **Prossimo:** [SB-16g](#sb-16g--coppie-caricamento-colpo-seconda-passata), Fase 2b **passo 1 fatto** e prova umana breve fatta il 13 novembre 2026: meccanica approvata (D75). **Bot consapevole del colpo letale** (D76) consegnato il 13 novembre 2026 ([rapporto](../reports/set-base/sb-16g-bot-letale-report.md)), risposte del proprietario registrate il 14 novembre 2026 ([D77](../set-base-decisioni.md#decisioni-del-proprietario)): nessuna prova, si va avanti. Q9 decisa in D78 («Annuncia»). Proposta 1.3 delle carte **approvata** il 14 novembre 2026 ([D79](../set-base-decisioni.md#decisioni-del-proprietario)). **Prossimo:** passo 2 (frequenza), poi passo 3. Budget residuo: 2 giri e 7.078 s; poi SB-17. Il costo in salute di Duccio è deciso ([D47](../set-base-decisioni.md#decisioni-del-proprietario)). Stato corrente
nell'[indice della documentazione](../README.md#stato-corrente).

*Righe 13–19: fonti lette per scrivere il piano il 2 novembre 2026.*

Fonti lette: [istruzioni](../../AGENTS.md), [indice](../README.md), [regolamento](../game-rules.md),
[allegato](../rules-catalog.json), [appunti sul set](../../IDEAS.md), [CLI](../cli.md),
[piano C3](../client-c3-plan.md) come modello, [roadmap del client](../client-roadmap.md) (O9,
O15–O18), [bozza esterna di carte](../design/set-base/bozza-esterna-proposta-70-carte.md), `cards.sqlite`, `scripts/check-rules.py`, `tools/print-cards/` e, nel server,
`Game`, `Player`, `ComPlayer`, `AbstractCard`, alcune carte, le factory, `MatchVersions` e la
validazione dei mazzi. Non sono state lette tutte le carte e non è stata giocata nessuna
partita per questo piano: ciò che è dedotto e non provato è indicato come tale.

## Cosa c'è oggi

*Fotografia di partenza del 2 novembre 2026, sostituita nel piano da un riassunto.*

Verificato nei sorgenti il 2 novembre 2026: è la fotografia di partenza. Dove un blocco chiuso l'ha superata, lo dice la colonna di destra.

| Ambito | Stato | Conseguenza per il piano |
|---|---|---|
| Set | 39 carte: 2 personaggi, 2 basic, 4 bound, 1 last resort, 26 azioni regolari, 4 oggetti; più 1 token. `SoberUp` è fuori catalogo | Ne servono **fino a 76 nuove** |
| Carte | Una classe Java per carta con i valori scritti nel costruttore e negli effetti, per esempio `SuperImpact` (25 V, 40 HIT). `CardFactoryServiceImpl` le carica con `Class.forName` | Cambiare un numero richiede una ricompilazione: serve il playground (SB-5, SB-6) |
| Catalogo | `cards.sqlite`: `CRD001_GUI`, `CRD002_KEYWORDS`, `CRD003_CHARACTERS`, `DCK001_STARTERS`, `DCK002_STARTERS_CH` con due colonne bound. Nessun campo set o rarità | Da estendere (SB-2, SB-28). **Fatto in SB-2:** colonne `C_SET` e `C_RARITY`, rarità vuote fino a SB-28 |
| Regole ↔ carte | R07 e R07a elencano ogni carta; R04 e R05 citano carte specifiche (Grab, Steal, SeagullFly, MadeOfStone…). `check-rules.py` legge le tabelle di R07; `rules-v1-cards.tsv` è il contratto dei test; `MatchVersions` legge la versione delle regole | La separazione regole/set deve adeguare tutto questo (SB-2). **Fatto in SB-2:** regolamento 1.13 senza carte, schede in [Set Base 0.1](../sets/base.md) |
| Mazzi | Il server chiede solo regolare non vuoto e massimo sei carte iniziali (`UserAccountServiceImpl`); `client-web/src/deck.ts` ammette fino a 5 bound, senza limiti di copie | Da sostituire (SB-1). **Fatto in SB-1:** regole dei mazzi di R02 1.12 su server ed editor |
| Mazzi sintetici | `verify-decks.mjs` (4 Glare), `cli-open-complete-test.cjs`, `cli-restart-test.cjs` (una carta), `cli-security-test.cjs` (12 SuperImpact) e le verifiche che si basano sulla D8 del piano C3 violano le nuove regole | Vanno riscritti in SB-1, senza indebolire ciò che provano. **Fatto in SB-1** |
| Quick | `PlayerFactoryServiceImpl.randomPlayer` sceglie fra due personaggi scritti nel codice | Da riscrivere (SB-29) |
| Bot | `ComPlayer` è casuale: mescola la mano e gioca la prima mossa valida per `isValidFor`. Riceve l'intero `Game` | Vista limitata a R08 e stili fatti in SB-4, non usati dal server fino a SB-30 |
| Motore | Nessun import di Spring sotto `model`; i test creano `new Game(players, mode, false)` (`GameFixtures`). Le factory invece sono servizi Spring | Runner diretto **provato** in SB-3, con un caricatore proprio |
| Casualità | `Collections.shuffle` senza seme in `Player`, `ComPlayer`, `BeggingMoney`; `Math.random` in `PlayerFactoryServiceImpl` | Fonte con seme fatta in SB-3; resta `Math.random` in `PlayerFactoryServiceImpl`, da riscrivere in SB-29 |
| CLI | [`bm-cli.cjs`](../cli.md) passa sempre da server, login, REST, SockJS/STOMP e archivio. Le modalità non permettono di scegliere il matchup, e l'open si gioca solo contro il bot casuale | Adatta alle prove end-to-end, non alle simulazioni di massa |
| Testi delle carte | La descrizione in SQLite è il testo normativo di R07 più «Riferimento: Regolamento 1.10, R02-R07», e `check-rules.py` impone che coincidano. Il giocatore legge quindi `abs(T)`, «15 HIT: solo GOOD dell'autore», lettere al posto delle risorse. Le parole chiave in `CRD002_KEYWORDS` sono in inglese | Testo normativo e testo per i giocatori vanno separati (SB-25) |
| Illustrazioni | 40 provvisorie generate ex novo (O9), con prompt e provenienza registrati e sorgenti fuori da git. Atlante unico 8×6 da 256 px, cioè 48 riquadri; `atlas.mjs` costruisce dall'allegato e si ferma se le sorgenti non coincidono. Un nome sconosciuto usa il segnaposto | Le carte nuove compaiono col segnaposto fino a SB-32; un atlante non basta |

## Bozza esterna di carte

*Copertura della bozza esterna (stima del 2 novembre 2026):*

Copre circa 31 degli slot nuovi. **Copertura massima**, sommando carte attuali e candidate: carte riprogettate o scartate la riducono.

| Blocco | Nel set | Attuali + bozza | Da inventare |
|---|---:|---:|---:|
| Personaggi | 7 | 5 | 2 (Sergio, Duccio) |
| Basic | 7 | 5 | 2 |
| Bound | 21 | 10 | 11 (la bozza ne ha due per personaggio) |
| Last resort | 4 | 1 | 3 |
| Azioni regolari | 60 | 39 | 21 |
| Oggetti | 16 | 10 | 6 |
| **Totale** | **115** | **70** | **45** |

*Ciò che non vale più:*

**Ciò che non vale più:**

- **70 carte, cinque personaggi, nessun limite di copie, nessuna esclusività delle bound, starter di Bruiser e Junkie invariati, regolamento 1.5:** superati da D1, D2, D6, D7 e D14.
- **«Smontiamo tutto» come bound:** bersaglia un oggetto e viola il [vincolo sulle bound](../set-base-plan.md#nessun-giocatore-senza-mosse). L'idea può vivere come azione regolare.
- **Immunità di Pino all'effetto periodico di L:** contrasta con l'identità di L che decade. Esclusa da D28; la variante si prova solo nel playground (SB-14).

## Blocchi

### Tabella dei blocchi e ordine seguito

*Righe della tabella dei blocchi e paragrafo «Ordine seguito» sostituiti nel piano da testi brevi.*

| Fase | Blocco | Contenuto | Dipende da | Stato |
|---|---|---|---|---|
| | SB-16g | Coppie caricamento-colpo, seconda passata | SB-16f | Fase 1 fatta; risposte registrate D59–D68; divisione 2a/2b approvata; 2a consegnata il 13 novembre 2026 ([rapporto](../reports/set-base/sb-16g-2a-report.md)); **D69** la rivede (gettone legato al nome, senza timer): **2a rivista** lo stesso giorno; domande risposte in D70; consulto esterno il 13 novembre 2026 ([consulto di design](../reports/set-base/consulto-design-fable-2026-11-13.md), [revisione indipendente](../reports/set-base/revisione-fable-2026-11-13.md)); **2b passo 1 fatto** il 13 novembre 2026: D71–D73, cinque caricamenti e tre politiche, 648.000 partite; invarianti/bound verdi, criteri di bilanciamento ancora fuori soglia ([rapporto](../reports/set-base/sb-16g-2b1-report.md)). prova umana breve fatta lo stesso giorno, meccanica approvata (**D75**); **bot consapevole del colpo letale (D76) consegnato** lo stesso giorno ([rapporto](../reports/set-base/sb-16g-bot-letale-report.md)), risposte in **D77** (14 novembre 2026); Q9 decisa in **D78**; **proposta 1.3** (14 novembre 2026, [carte concrete](../design/set-base/sb-16g-proposta.md)) **approvata in D79** lo stesso giorno; **2b passo 2 consegnato** il 14 novembre 2026 ([rapporto](../reports/set-base/sb-16g-2b2-report.md)): proposta 1.3 attuata, 648.000 partite in 738,001 s; invarianti/bound verdi, 11 incontri fuori criterio; STOP sui numeri; domande risposte in **D80**; **proposta 1.4 del passo 3** (14 novembre 2026, [documento](../design/set-base/sb-16g-proposta.md#passo-3--proposta-corrente-14)) **approvata in D82** lo stesso giorno; attuazione **fermata il 14 novembre 2026 prima di toccare bozza o codice** ([rapporto](../reports/set-base/sb-16g-2b3-report.md)): travaso con POISON diretto e Rutto non si esprimono coi dati senza classi in `server/src/main`; supporto mirato approvato in D84 (classe nuova D86 provata e abbandonata, D88); **passo 3 consegnato** lo stesso giorno: 1.4 attuata, passo 0 fattibile, **giro finale A/B 1.296.000 partite**, invarianti a zero e bound entro 4, **11 incontri su 15 fuori in entrambi i bracci** (Spazienzio ora sotto quota, Beppe sopra); STOP con proposta e quattro domande; residuo D68 **0 giri/4.682,655 s**; braccio B e proposta 1.5 in D89, 1.5 approvata in **D90**; **correzione 1.5 consegnata** lo stesso giorno ([rapporto](../reports/set-base/sb-16g-15-report.md)): un giro da 648.000 partite, identità dei 6 incontri senza Spazienzio né Beppe verificata, **7 dei 9 incontri con Spazienzio o Beppe in criterio**, fuori Spazienzio–Mara e Spazienzio–Piera; cancello completo non raggiunto (6 su 15); STOP con i dati; budget D90 **0 giri/6.666,322 s** |
| | SB-16h | Prova esplorativa della dimensione del mazzo (SB-23 anticipata, D81) | SB-16g | **Fase B consegnata il 14 novembre 2026** ([rapporto](../reports/set-base/sb-16h-report.md)), D83/D92/D93: cinque varianti e misto, **3.672.000 partite**, identità 20/2 completa col giro 1.5, invarianti a zero e bound entro 4. Fuori D93 **8/6/6/6/5** incontri (20/2, 25/2, 25/3, 30/2, 30/3); **nessuna alternativa soddisfa D83**. Giro unico: **3.214,403 s su 7.200**, passo 0 fuori budget. **Chiusa in D94**: formato 20/2, «Annuncia» con due nomi nella 1.6 |
| | SB-16i | Correzione 1.6: meccaniche di sistema e soglia minima (D95) | SB-16h |  |

**Ordine seguito.** SB-3, SB-4 e SB-5; poi, con [D30](../set-base-decisioni.md#decisioni-del-proprietario), SB-9 → SB-6a → SB-7 → SB-7b → SB-10a → SB-10b →
SB-11a → SB-11b → SB-12a ([D31, D32, D37, D40](../set-base-decisioni.md#decisioni-del-proprietario)), con SB-1 in parallelo a C4 (D40); poi SB-13 e SB-2 (D42),
SB-6b e SB-14 (D43, D44), SB-15 con le rarità della griglia nella bozza (D45), poi SB-8 (fase A approvata con «Approvo tutto»), solo server
e senza file del client. SB-8 approvato (D46). Prove umane SB-12b e SB-16 fatte il 12 novembre 2026. Revisione critica delle regole [SB-16b](#sb-16b--revisione-critica-delle-regole) fatta il 12 novembre 2026 (D50–D53). SB-16c fatta il 12 novembre 2026, domande risposte (D54). SB-16d attuata (D55), invarianti e bound verdi. SB-16e, SB-16e2, SB-16f0 e la prova umana SB-16f fatti (D56, D57). **Prossimo:** [SB-16g](#sb-16g--coppie-caricamento-colpo-seconda-passata), Fase 2b **passo 1 fatto** e prova umana breve fatta il 13 novembre 2026: meccanica approvata (D75). **Bot consapevole del colpo letale** (D76) consegnato il 13 novembre 2026 ([rapporto](../reports/set-base/sb-16g-bot-letale-report.md)), risposte del proprietario registrate il 14 novembre 2026 ([D77](../set-base-decisioni.md#decisioni-del-proprietario)): nessuna prova, si va avanti. Q9 decisa in D78 («Annuncia»). Proposta 1.3 delle carte **approvata** il 14 novembre 2026 ([D79](../set-base-decisioni.md#decisioni-del-proprietario)). **Prossimo:** passo 2 (frequenza), poi passo 3. Budget residuo: 2 giri e 7.078 s; poi SB-17. SB-30 può
essere anticipato per le carte attuali, se il bot si dimostra utile prima: è una scelta del proprietario.

### SB-1 — Regole dei mazzi

**Anticipato da [D40](../set-base-decisioni.md#decisioni-del-proprietario)**, in parallelo a C4: i blocchi C4 rimasti (C4-10, C4-11, C4-8a, C4-8b, C4-9) non toccano
l'editor dei mazzi (`deck.ts`, `collection.tsx`). Paletti: niente modifiche a `client-web/src/style.css`, su cui lavorano C4-10, C4-11 e C4-8a;
`verify-decks.mjs` riscritto e pushato prima che parta C4-8a, che usa `VerifyDecks`; dopo il pull l'altra macchina rifà il jar, perché cambiano
regolamento e validazione del server.

**SB-1 fatto il 7 novembre 2026 e approvato dal proprietario l'8 novembre**, con le sue parole: «Sì, entrambi» ([D42](../set-base-decisioni.md#decisioni-del-proprietario)), dopo la revisione della regia. Regolamento **1.12**: R02 con le regole dei mazzi concordate per
starter e mazzi personalizzati, R03 senza la lacuna del giocatore vivo senza mosse, tre carte iniziali. `DeckRules` le applica al salvataggio e
all'avvio open; basic e last resort riservate con la colonna `C_EXCLUSIVE_TO` (carta `exclusiveToCharacter`, Q1), bound con
`boundToCharacter`. I mazzi salvati prima restano nel profilo ma non si giocano (Q2). Editor di client-web e client-debug che prevengono e
segnalano (Q3). Mazzi sintetici di `verify-decks.mjs`, `verify-resolution.mjs` e delle tre CLI riscritti in regola: nessun caso raro perso
nello scenario open misurato prima e dopo (Q4); lo stato «vivo senza mosse» non si provoca più. Da fare in C4: la frase del menu al tavolo
su R03 (Q5). [Rapporto SB-1](../reports/set-base/sb-1-report.md).

**Perimetro.** Prossima versione del regolamento: R02 con le [regole dei mazzi concordate](../set-base-plan.md#regole-dei-mazzi-concordate), R03 senza la lacuna
del giocatore senza mosse, R01a e il conteggio delle carte iniziali coerenti. Poi validazione in `UserAccountServiceImpl`, editor di
`client-web` (`deck.ts`) e `client-debug`, test, catalogo e copia del debug. I mazzi salvati sono provvisori: **si possono perdere, senza
migrazione**; quelli non validi si rifiutano o si eliminano, secondo la via più semplice.

**Completamento verificabile.** I due starter restano validi e la partita non cambia. Mazzi con 19 o 21 carte, una terza copia, bound
altrui, bound duplicate, basic altrui o senza last resort vengono rifiutati da server ed editor. I mazzi sintetici di verifiche e CLI sono
riscritti e continuano a provare gli stessi casi; `TestServerContext` e `VerifyDecks` verdi.

**Rischi.** Le verifiche del client si appoggiano a mazzi fuori regola per provocare casi rari (D8 del piano C3): riscriverli senza
perdere copertura è la parte più delicata. Oggi Bruiser e Junkie hanno solo due bound, quindi la scelta esiste solo dal Set Base in poi.

### SB-2 — Separazione fra regolamento e set

**Anticipato da [D42](../set-base-decisioni.md#decisioni-del-proprietario)**, in parallelo a C4 e con una fase A che si ferma. A differenza di SB-1 tocca il client: la pagina
pubblica del regolamento (`public.tsx`, `rules.ts`) mostra R07 e R07a, e `verify-public.mjs`, che le controlla, è usato anche da C4-8a. Paletti:
niente modifiche a `client-web/src/style.css`, `readability.ts`, `scene.ts`, `table.tsx` (C4-10, C4-11, C4-8a; i commenti che citano R07 restano);
`verify-public.mjs` e ogni altro strumento di verifica toccato pushati prima che parta C4-8a; dopo il pull l'altra macchina rifà il jar.

**SB-2 fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» ([D43](../set-base-decisioni.md#decisioni-del-proprietario)). Fase A approvata con «vanno bene tutte le raccomandazioni». Regolamento **1.13**: R00 con la precedenza fra regolamento e documenti di set, R07 «Carte e documenti di set» con convenzioni e rarità, R07a con le sole definizioni; R04 e R05 senza citazioni di carte, con lo stesso esito sulle carte di oggi (la durata 3 di MadeOfStone passa alla scheda). Documento del set [`docs/sets/base.md`](../sets/base.md), **Set Base 0.1**, con le 39 carte e il token di prima; colonne `C_SET` e `C_RARITY` (vuota) nel catalogo, allegato del set, descrizioni «Riferimento: Set Base 0.1.»; archivio con `versions.sets`; `check-rules.py` rifiuta i disallineamenti fra documento, allegato e catalogo; pagina pubblica e `VerifyPublic` col set. [Rapporto SB-2](../reports/set-base/sb-2-report.md).

**Perimetro.** Nuova versione del regolamento secondo la [struttura concordata](../set-base-plan.md#struttura-per-set-ed-espansioni): R07 e R07a passano a un
documento per il set attuale; R04 e R05 si ripuliscono dalle citazioni di carte senza cambiarne il senso. `check-rules.py`, allegato,
`MatchVersions`, `tools/print-cards`, copia nel debug e documenti che rimandano a R07 si adeguano. Campi set e rarità previsti nel
catalogo. **Le carte del Set Base entrano nel documento solo a bilanciamento concluso** (SB-28).

**Completamento verificabile.** Nessun effetto cambia: `CatalogEffectsTest`, `RulesConformanceTest` e contratti verdi senza toccare gli
attesi. `check-rules.py` rifiuta un disallineamento fra documento del set, allegato e catalogo. L'archivio partite registra anche la
versione del set.

**Rischi.** Riscrivere R04 e R05 può cambiare una regola senza volerlo: ogni frase spostata va confrontata. AGENTS e R00 vanno aggiornati.

### SB-3 — Runner senza server e seme

**Chiuso il 5 novembre 2026**, anticipato rispetto a D22 su istruzione del proprietario: la partita non cambia, salvo l'ordine prima
arbitrario dei timer simultanei, ora quello d'inserimento (R06 non garantisce precedenze). 200 partite vere rigiocate nel motore senza divergenze.
[Rapporto](../reports/set-base/sb-3-report.md).

**Perimetro.** Controllo aperto dal piano: una partita completa in-process, senza Spring, con caricatore proprio delle carte. Fonte di casualità
con seme iniettabile in `Player`, `ComPlayer`, `BeggingMoney` e negli altri punti trovati; il comportamento di gioco non cambia. Il runner resta
fuori dall'artefatto distribuito. Usa il bot casuale attuale.

**Completamento verificabile.** Stesso seme, stessa partita, evento per evento. Partite di controllo coerenti con il server reale (via CLI) sulle
stesse regole. Partite al secondo misurate e dichiarate, così si sa quanto costa una matrice. Prima misura di base **Bruiser contro Junkie**,
registrata anche se il bot casuale dice poco.

**Rischi.** Dipendenze nascoste da Spring o dai log per turno.

### SB-4 — Vista limitata e bot euristici

**Chiuso il 5 novembre 2026**, anticipato rispetto a D22 su istruzione del proprietario: regole e carte non cambiano, il server usa ancora il casuale.
Aggressivo, prudente e attento alle risorse battono il casuale in tutti gli abbinamenti. Stile contro stile, Bruiser contro Junkie euristico vince al massimo il 4,6%:
una carta legata gratuita ripetuta basta a chiudere in 7–8 turni, dato per SB-10 e Q3. [Rapporto](../reports/set-base/sb-4-report.md).

**Perimetro.** Il bot riceve **solo ciò che un giocatore può vedere** (R08), non l'intero `Game`, altrimenti bara. Primo bot euristico e **più stili
di gioco** (aggressivo, prudente, attento alle risorse), riutilizzabili anche in `ComPlayer` senza riscrittura. **Il casuale resta**, come livello
facile e come metro.

**Completamento verificabile.** Ogni bot euristico batte nettamente il casuale; se non lo fa va rifatto. Un test prova che il bot non può leggere mano o
mazzo altrui. Con Bruiser e Junkie gli stili producono risultati dichiarati e confrontati.

**Rischi.** Euristiche legate alle carte attuali: devono basarsi su costi, ruolo e danno, non su nomi.

### SB-5 — Prova del formato dati

**Chiuso il 5 novembre 2026**, anticipato rispetto a D22 su istruzione del proprietario: la prova sta nei test, partita e regole non cambiano.
Decisione: JSON con sei passi per le carte semplici, Java per le altre. 20 carte su 37 a dati, identiche alle classi Java in 16.000 partite.
I numeri delle 17 carte in Java restano nel codice: da risolvere in SB-6 (fatto in SB-6a). Con i passi `consume` ed `equip` di SB-11a le carte a dati salgono a 23 su 37. [Rapporto](../reports/set-base/sb-5-report.md).

**Perimetro.** Secondo controllo aperto. Esprimere carte come dati: costo, priorità, bersaglio, effetti su sé e sul bersaglio, a partire da primitive
già esistenti. **Soluzione ibrida:** le carte semplici sono dati, quelle davvero strane (come `WhatchaDoin`) restano in Java con i numeri esposti come
parametri. Si convertono in prova alcune carte per tipo.

**Completamento verificabile.** Una carta convertita si comporta come l'originale nei test d'effetto esistenti. Conteggio di quante delle 33 azioni e dei
4 oggetti possono essere dati, con l'elenco di quelle che restano in Java. Decisione documentata sul formato.

**Rischi.** Un linguaggio per gli effetti troppo ricco: deve coprire le meccaniche di base, non anticipare le espansioni.

### SB-6 — Playground e mini-espansione di prova

Diviso da [D30](../set-base-decisioni.md#decisioni-del-proprietario) in due blocchi. **SB-6a, nucleo del playground,** anticipato e senza SB-2: bozza in file con carte a
dati, carte Java parametriche, personaggi, mazzi e parametri del formato, validazione al caricamento, identità con il set di oggi.
**SB-6b, più set e mini-espansione,** dopo SB-2 e SB-6a: caricamento da più set contemporaneamente, campi set e rarità, mini-espansione di prova.
Il perimetro che segue vale per i due blocchi insieme.

**SB-6a fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «sb6a dovrebbe aver fatto,
procediamo?». Bozza in JSON con carte a dati, carte Java coi numeri
come parametri (`@Tunable`, valori di oggi come predefiniti), personaggi, mazzi e parametri del formato, rifiutata alla lettura se
errata. La bozza «attuale» gioca come il catalogo in 400 partite a ogni esecuzione e in 10.000 una tantum; una bozza di prova con
Mara e Rocco di SB-9 gira senza modifiche al motore. [Rapporto](../reports/set-base/sb-6a-report.md).

**SB-6b fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» ([D44](../set-base-decisioni.md#decisioni-del-proprietario)). Fase A approvata con «Approvo tutte». Formato `sb-6b/1`:
un file per set, con testata (id, nome, versione) e `requires`; i file `sb-6a/1` si leggono come prima e sono il set `base`. Più set
si caricano insieme (`Draft.load`, `-Dsim.draft` con più fonti separate da `;`), con id unici e prefisso del set, visibilità limitata
ai set richiesti e rifiuto chiaro di set mancanti, id ripetuti, carte di set non caricati, rarità fuori vocabolario e mazzi misti
contro R02. Rarità facoltativa su carte e personaggi, col vocabolario di R07 controllato da `check-rules.py`; le carte di oggi restano
senza rarità fino a SB-28, e quelle della bozza del Set Base le scrive il prossimo blocco che la tocca (Q5, script pronto). Una
mini-espansione di prova di cinque carte, con una terza bound di Spazienzio e una carta Java parametrica nei sorgenti di test, si
carica con la bozza «attuale» e con quella del Set Base, gioca partite intere e una matrice col banco senza violazioni, e non cambia
nessuna partita fra mazzi di base. Motore, regolamento, set e catalogo non cambiano. [Rapporto](../reports/set-base/sb-6b-report.md).

**Perimetro.** Una **bozza di set** in file, caricata dal runner, in cui si cambia ciò che si vuole: numeri, carte, personaggi, starter e **parametri del
formato** (20 o 25 carte, 2 o 3 copie). Da più set contemporaneamente. Nessun legame col regolamento. Una **mini-espansione fittizia di poche carte**,
solo di prova, verifica la struttura multi-set, comprese bound aggiuntive di un personaggio esistente.

**Completamento verificabile.** Cambiare un numero non richiede ricompilazione. Una bozza errata viene rifiutata con un messaggio chiaro. Aggiungere la
mini-espansione **non tocca motore né regole generali**; se li tocca, si corregge qui, quando costa poco.

**Rischi.** La bozza che diverge dalla partita viva: le carte non convertite passano dalle stesse classi.

### SB-7 — Banco di misura e invarianti

**SB-7 fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» (SB-7 e SB-7b). Un comando a richiesta produce la matrice dei matchup per coppia
di mazzi e di stili, con intervalli di Wilson, e un rapporto in testo e in dati, identico byte per byte a parità di seme e bozza. Lo stesso
comando controlla otto invarianti in partita e il tetto delle bound sulla ripetizione, con tetto e pesi come parametri. Una ricerca per
mutazione, convalidata su semi disgiunti, ritrova una carta volutamente superiore. Ogni controllo è provato su una bozza costruita per
violarlo. Prima fotografia sulla bozza «attuale» e su quella di prova: nessun invariante violato, tutte e quattro le bound attuali oltre il
tetto. Una matrice da 7 personaggi costa circa 7 minuti su un thread. [Rapporto](../reports/set-base/sb-7-report.md).

**Perimetro.** Un comando che produce la **matrice dei matchup** per stile di bot e un rapporto: esiti con intervallo di confidenza, durata, patte, mazzi
esauriti, tempo fino alla last resort, risorse inutilizzate, carte per giocata e per vittoria quando giocate, carte morte in mano. Controlli automatici
sulla bozza: **zero turni senza mosse legali**, [vincoli delle bound e delle last resort](../set-base-plan.md#nessun-giocatore-senza-mosse), tetto di debolezza sulla
ripetizione. Ricerca automatica di mazzi forti (per mutazione) con limiti di copie e formato.

**Completamento verificabile.** Rapporto riproducibile col seme. Un mazzo costruito apposta per violare un invariante viene segnalato. La ricerca ritrova un
mazzo volutamente superiore inserito come prova.

**Rischi.** Falsa precisione: un intervallo di confidenza non corregge i limiti del bot.

### SB-7b — Bot e costo in HEALTH

Aggiunto da [D31](../set-base-decisioni.md#decisioni-del-proprietario): mini-blocco prima di SB-10, perché la prima fotografia di SB-7 mostra Rocco che muore pagando in
HEALTH fino a 180 volte su 9000 partite con lo stile aggressivo, e le misure di SB-10 su Sant'Incasso ne sarebbero falsate.

**SB-7b fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno** («Approvo entrambi»). Sulla bozza di prova le morti pagando scendono da 310 a 0
su 27.000 partite di Rocco, con la stessa HEALTH spesa per partita. Sulla bozza «attuale» il rapporto del banco resta identico byte per
byte. [Rapporto](../reports/set-base/sb-7b-report.md).

**Perimetro.** Gli stili euristici di `model/game/bot` tengono conto del costo in HEALTH. Una mossa che costa almeno la salute rimasta non
si gioca mai, nemmeno se ucciderebbe l'avversario: pagando si muore prima degli effetti (R04), quindi si arriva al massimo a una patta, e
una contromossa può lasciare solo la morte (fase A approvata). La salute spesa pesa come danno subito. Nessuna regola o carta cambia; il server non usa ancora i bot (SB-30).
Le contromosse sottostimate restano fuori, a SB-17.

**Completamento verificabile.** Sulla bozza di prova di SB-9 le morti pagando misurate dal banco di SB-7 scendono a zero, salvo le mosse
che uccidono l'avversario. Gli stili battono ancora il casuale come in SB-4; `BotStylesTest` verde senza toccare gli attesi. Matrice di SB-7
rilanciata e confrontata con la prima fotografia.

**Rischi.** Uno stile troppo cauto con la salute che non paga mai: il banco lo mostra nella HEALTH spesa per partita.

### SB-8 — Bozza giocabile da umani

**SB-8 fatto il 10 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo SB-8» ([D46](../set-base-decisioni.md#decisioni-del-proprietario)). Fase A approvata dal proprietario con «Approvo tutto»
(undici domande con le raccomandazioni, un blocco solo, solo server). Profilo di sviluppo `bozza`, solo con `local` (o `test`) e mai
con `heroku`: la bozza si legge da file (`set-base/bozza.json`, fuori dal jar), su un database separato `bm-bozza.sqlite`. La
collezione è la bozza, i cinque starter sono mazzi pronti in open 1vCom, quick 1vCom, 1v1 e FFA pescano da una riserva, il computer
gioca uno stile euristico di SB-4 (predefinito `risorse`) o il casuale di oggi. Caricatore (`Draft`, `DataCards`, `PlayerSource`) e
classi Java di bozza spostati in `server/src/main` con `git mv`; una piccola cucitura del catalogo (`CatalogSource`) fa leggere a
collezione, convalida dei mazzi e viste dei personaggi la stessa SQLite di prima, o la bozza col profilo. Nessun file del client:
client-web gioca la bozza con i ripieghi che ha già. L'archivio marca le partite con `versions.draft`. Col profilo normale nessuna
carta, personaggio o mazzo della bozza è raggiungibile (`BozzaProfileOffContextTest`); partite reali con carte di bozza via CLI
(`BozzaCliTest`) e nel browser. Avvio in [setup](../setup.md#avvio-con-la-bozza-del-set-base-sb-8); regola del diff dei giri precisata in
[metodo e criteri](../set-base-plan.md#bilanciamento-metodo-e-criteri). [Rapporto](../reports/set-base/sb-8-report.md).

**Perimetro.** Il server di sviluppo avvia partite con la bozza, senza toccare il catalogo di produzione; `client-web` le mostra, anche per carte **senza
illustrazione**. Serve a tutte le prove umane, con un controllo end-to-end via CLI.

**Completamento verificabile.** Partita reale con una carta di bozza, a 1366×768 e 844×390. Col profilo normale nessuna carta di bozza è raggiungibile.
`TestServerContext` verde.

**Rischi.** Il client presume dati del catalogo come ruolo, danno e immagini: i campi mancanti devono avere un ripiego.

### SB-9 — Schede dei personaggi

**Chiuso il 6 novembre 2026** con l'approvazione del proprietario a tutte le raccomandazioni: [schede dei personaggi](../design/set-base/schede-personaggi.md).
Nomi provvisori Cesira la Malalingua e Rocco «Sant'Incasso»; Spazienzio invariato, Tossico con capacità 2, Mara e Pino con V 0; Q10 e Q6 decise (D28, D29).
Valori iniziali e indicazioni sulle bound sono ipotesi da misurare in SB-10. [Rapporto](../reports/set-base/sb-9-report.md).

**Perimetro.** Scheda di ciascuno dei sette, attingendo alla [bozza esterna](#bozza-esterna-di-carte): nome, chi è, come picchia, risorsa, rischio, valori iniziali (salute e capacità comprese), versione propria del triangolo
attacco-difesa-contromossa. Revisione dei concept col proprietario, **senza consumare le cartucce creative**: quanto eccede il perimetro va all'elenco per le
espansioni. Bozza di tono coerente con Spazienzio de la Ucciso e il Tossico del Serraglio.

**Completamento verificabile.** Sette schede approvate dal proprietario, compresi nomi almeno provvisori. Nessuna risorsa o parola chiave nuova.

**Rischi.** Personaggi troppo simili sul piano delle risorse: V, T, L e A coprono solo quattro identità su sette. Malalingua, Gigi e Sant'Incasso si distinguono per
strategia e devono comunque pagare con le risorse di base.

### SB-10 — Griglia degli slot e listino di potenza

Diviso da [D32](../set-base-decisioni.md#decisioni-del-proprietario) in due blocchi. **SB-10a, listino di potenza e tetto delle bound,** è di sole misure: danno per
risorsa, valore della priorità, valore di L che decade, tetto delle bound e suoi pesi, posizione delle carte attuali rispetto al listino.
**SB-10b, griglia degli slot,** è di progetto e usa il listino. Il perimetro che segue vale per i due blocchi insieme.

**SB-10a fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, scrivi», insieme alle quattro
raccomandazioni del rapporto ([D33](../set-base-decisioni.md#decisioni-del-proprietario)). Il [listino](../design/set-base/listino.md) è misurato con duelli fra
carta sonda e àncora (gratuita, 10 HIT), su cinque contesti e tre stili di bot. In sintesi:
- V costa circa 1,1 danni per unità fino a 20 V e di più oltre;
- A e la T del Tossico costano poco, HEALTH circa 1,1–1,2;
- CUT, POISON e HIT si equivalgono e la priorità vale quasi niente;
- la precedenza è ordinale;
- L guadagnata vale circa metà di V e, come costo, è quasi sempre impagabile.

Proposti tetto delle bound a 4 unità e nuovi pesi. Nella ricerca dei mazzi un mutante sostituisce il migliore solo oltre un errore
standard. [Rapporto](../reports/set-base/sb-10a-report.md).

**SB-10b fatto il 6 novembre 2026.** Principi e griglia approvati dal proprietario lo stesso giorno, con le sue parole: «Approvo tutte»
(fase A, [D34](../set-base-decisioni.md#decisioni-del-proprietario); fase B, [D35](../set-base-decisioni.md#decisioni-del-proprietario)). La
[griglia](../design/set-base/griglia.md) dà un posto a tutte le 115 carte, con ruolo, fascia di costo, rarità, starter e motivo; mappa le 39 carte di
oggi e le 31 della bozza esterna. I predefiniti del banco sono quelli di D33. La misura in partita conferma il tetto di 4 unità per le
bound di risorsa ma non per quelle di danno; il proprietario ha scelto il tetto 3 per il danno ([D36](../set-base-decisioni.md#decisioni-del-proprietario)).
[Rapporto](../reports/set-base/sb-10b-report.md).

**Perimetro.** Griglia delle circa 115 carte: slot per archetipo, ruolo, costo e rarità, secondo il [budget](../set-base-plan.md#il-set-in-numeri), con le candidate della [bozza esterna](#bozza-esterna-di-carte) assegnate agli slot; numero di carte distinte per starter (10–15); quali generiche compaiono in quali
starter; curva dei costi rispetto ai 3 slot regolari in mano. **Listino di potenza** ricavato dalle carte attuali e misurato: danno per risorsa, valore della priorità,
valore di L che decade. Distribuzione delle rarità con il [paletto](../set-base-plan.md#rarità). Verifica del tetto delle bound. Revisione degli effetti poco evidenti di L.

**Completamento verificabile.** Ogni slot ha un motivo; il totale è fra 110 e 120. Ogni carta attuale è mappata: conservata, riprogettata o sostituita, flavour compreso. Ogni carta della bozza è assegnata a uno slot o scartata con un motivo.
Listino e tetto delle bound confermati da misure.

**Rischi.** Una griglia troppo rigida frena le idee: gli slot si possono scambiare, purché il totale tenga.

### SB-11 — Bozza degli starter base

Diviso da [D37](../set-base-decisioni.md#decisioni-del-proprietario) in due blocchi. **SB-11a, passi `consume` ed `equip` del formato dati,** prepara ciò che gli
starter base richiedono secondo la [griglia](../design/set-base/griglia.md): la presa di oggetti delle basic e di Grab, gli equip da oggetti
con uso singolo e conversione del danno (Giubbotto e Posacenere, decisione B4 di D35), l'àncora del listino come parametro. **SB-11b, bozza
degli starter base,** scrive gli starter di Spazienzio e Mara con quei passi. Il perimetro che segue vale per SB-11b.

**SB-11a fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, scrivi». Il formato dati, nei soli sorgenti di test, ha il passo
`consume` (presa di un oggetto vicino, con i passi prima e dopo nell'ordine scritto), il passo `equip` dentro `status` (flusso, uso singolo
o durata, conversione del tipo) e il campo `basic`. Grab, BruiserGrab, ToxicGrab e il token BrokenBeerBottle scritti a dati coincidono
con le classi Java su 200 stati casuali con oggetti presenti, assenti e spariti, e in partite intere; Giubbotto, Posacenere, BadEducation e la
scadenza secondo R05 sono provati su stati costruiti a mano. Dopo SB-5 le carte a dati sono 23 su 37, le altre 14 restano in Java. L'àncora del
listino è un parametro (`-Dsim.listinoAnchor`, 10 di difetto, 7 per l'unità di D33). Regolamento, catalogo, client e classi di produzione non
cambiano. [Rapporto](../reports/set-base/sb-11a-report.md).

**SB-11b fatto il 6 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, maiuscolo nei dati»; con
SB-11a, **SB-11 è chiuso**. Le risposte alle domande della fase A sono in
[D38 e D39](../set-base-decisioni.md#decisioni-del-proprietario).
- **La bozza.** È un file unico che crescerà, `server/src/test/resources/set-base/bozza.json`, con gli starter di Spazienzio «Pazienza finita»
  e di Mara «Consegna sul muso» come nella griglia. Le carte di oggi tengono il binding della loro classe, le nuove hanno il prefisso `base.`.
- **Controlli.** Invarianti di SB-7 a zero in modo stretto su 96.000 partite; tutte le meccaniche di base coperte.
- **Il risultato centrale.** **Spazienzio batte Mara 0,937**, mentre gli specchi stanno a 0,50. Partite di 13,5–16,5 turni.
- **D36 e B2.** D36 regge per Spazienzio ma non per Mara, nemmeno con 2 di danno; la bound +8 A supera il criterio nello specchio, ma
  toglierla peggiora Mara.
- **Listino a 7 HIT.** La A di Mara vale circa 1 HIT, non 0,6.

Nulla è bilanciato qui: i correttivi sono misurati su varianti e passano a SB-12. [Rapporto](../reports/set-base/sb-11b-report.md).

**Perimetro.** Spazienzio riprogettato e Mara: personaggio, basic, tre bound, last resort, azioni d'archetipo e generiche per due mazzi da 20. Nomi provvisori. Le carte
devono mostrare danno, difesa, priorità, oggetti e almeno una contromossa.

**Completamento verificabile.** Controlli di SB-7 verdi. Ogni meccanica di base compare in almeno uno dei due mazzi. Solo bozza.

**Rischi.** Semplicità contro interesse: il mazzo base deve insegnare senza annoiare.

### SB-12 — Giro sugli starter base e prova umana

Diviso da [D40](../set-base-decisioni.md#decisioni-del-proprietario) in due blocchi. **SB-12a, giro coi bot,** porta gli starter base ai criteri con il banco e
non aspetta il client. **SB-12b, prova umana,** sono le partite del proprietario e richiede SB-8. Il perimetro che segue vale per i due insieme.
Con [D42](../set-base-decisioni.md#decisioni-del-proprietario) SB-13 parte dopo SB-12a, senza aspettare SB-12b.

**SB-12a fatto il 7 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo, anche +6 A» ([D41](../set-base-decisioni.md#decisioni-del-proprietario)).
Tre giri coi bot (il massimo di Q5), circa 40 minuti di calcolo su un tetto di 2 ore; correzioni decise con la delega di D38.
- **Giri.** 1: punto di partenza di D38 e Sgommata 22 → 26 CUT (0,525). 2: salute di Spazienzio 100 → 85 e di Mara 95 → 80, per la durata
  (0,500, 11 turni). 3: Sgommata 26 → 25, per centrare il matchup anche senza il bot attuale (0,520). Poi, approvata dal proprietario,
  Cambio marcia (MAR-BO2) da +8 a +6 A.
- **Esito sulla bozza approvata.** Spazienzio contro Mara **0,525** [0,520–0,531] (0,479 coi soli stili euristici), partite di **11,3
  turni**, mazzi esauriti 10–16%, patte 10–13%, invarianti a zero su 96.000 partite. Bozza SHA-256 `bf7b97ce…8db0c39`.
- **Bot.** Parate del turno, contromosse e Steal valgono meno di un colpo semplice in mano ai bot, per tutti e due: tenute, non tagliate.
- **D36 e B2.** Tutte le bound stanno sotto 4 HEALTH equivalenti per uso; la +8 A di Mara ne valeva circa 4,5, la +6 A circa 3,3.
- **Listino a 7 HIT.** Prezzi quasi invariati: A di Mara circa 1 HIT, V oltre 20 molto più cara.

Restano raccomandazioni per i blocchi che le toccano: scala della salute degli altri personaggi (SB-13), patte e Steal (SB-12b). Dettagli
nel [rapporto](../reports/set-base/sb-12a-report.md).

**SB-12b fatto il 12 novembre 2026, giudizio registrato.** Il proprietario: «gli starter base mi sembrano abbastanza bilanciati fra loro, anche se nelle mie partite mara mi sembra un po' piu debole di spazienzio. potrebbe essere solo una sensazione però, è evidenza aneddotica». Concorda coi bot: Spazienzio contro Mara 0,525 in SB-12a, dentro il 45–55%. **Osservazione assegnata:** nessun cambio ora, perché è evidenza aneddotica e i numeri sono nei criteri; si riguarda nella prima misura del set intero e nei giri di correzione (SB-20, SB-21) e nella prova con mazzi costruiti (SB-22). Prova del 12 novembre 2026 sulla bozza attuale, con `./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts` e il client servito; nessun problema tecnico. Numero di partite e accoppiamenti non dichiarati. Durante le stesse prove, alla regia: il salvataggio in extremis di Piera, che resta ([D48](../set-base-decisioni.md#decisioni-del-proprietario)); l'alcol che riduce i danni per tutti, rimandato alla Fase B di [SB-16b](#sb-16b--revisione-critica-delle-regole) (D49); quantità di danno e barriera sull'impatto, osservazione del client [O32](../client-roadmap.md#osservazioni-registrate-durante-c4), dopo C5.

*Stato precedente.* **SB-12b, stato al 10 novembre 2026: prossimo, aspetta le partite del proprietario.** SB-8 è chiuso (D46): la bozza si gioca con
`./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts` e `./client-web/run.ps1 -Task Serve` ([avvio](../setup.md#avvio-con-la-bozza-del-set-base-sb-8)).
Da guardare, dal [rapporto SB-12a](../reports/set-base/sb-12a-report.md#cosa-serve-a-sb-12b): parate e contromosse giocate da un umano (il
matchup potrebbe spostarsi verso Spazienzio), durata percepita (11 turni di media), patte, Steal, i nomi dei due starter. La regia ha
proposto una scheda di prova sul modello di quella di C3-7; il 10 novembre 2026 il proprietario ha deciso di non usarla, anche per
SB-16: «la scheda di prova non importa, segnalerò le impressioni della prova umana così come mi vengono». La regia le registra nelle
sezioni dei blocchi interessati. La bozza giocata è quella di oggi, con le
correzioni di D41–D45 e i nomi del flavour; le prove umane occupano le porte 8080 e 4320 come le verifiche del client.

**Perimetro.** Giro di bilanciamento fino ai criteri, poi partite del proprietario. Il risultato è la **base stabile** per i blocchi successivi.

**Punto di partenza da SB-11b** ([D38](../set-base-decisioni.md#decisioni-del-proprietario)):
- **Matchup:** Spazienzio contro Mara 0,937. Primo passo: costi di Mara −5 A su Cinghiata, Sgommata, Slalom, Paraurti e Sputo, e HEALTH di
  Mara 95 (misurato 0,593). Poi un secondo passo.
- **Prezzi del listino a 7 HIT:** la A di Mara vale circa 1 HIT, la V oltre 20 è molto più cara.
- **Durata:** sopra l'obiettivo.
- **D36 e B2:** si rimisurano sugli starter corretti, anche come salute equivalente per uso (al massimo 4).
- **Bot:** prima di tagliare carte, controllare se sono i bot a giocarle male.

**Completamento verificabile.** Matchup 45–55%, durata e invarianti nei limiti. Giudizio del proprietario registrato, con le osservazioni assegnate.

**Rischi.** Fermarsi ai numeri: se diverte poco, si torna a SB-11.

### SB-13, SB-14, SB-15 — Starter avanzati

Un blocco per personaggio, nell'ordine **Celestina Bucatina, Piera Ultimo Giro, Beppe Bulletta**.

**SB-13 anticipato da [D42](../set-base-decisioni.md#decisioni-del-proprietario)** dopo SB-12a, perché la prova umana (SB-12b) aspetta SB-2, SB-6b e SB-8. Gli starter
base stabili sono quelli della bozza approvata in SB-12a (D41). Se SB-12b cambierà gli starter base, il giro di Celestina si rilancia contro i nuovi.
SB-14 resta dopo SB-13; se e quando anticiparlo prima di SB-12b lo decide il proprietario.

**SB-13 fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» ([D43](../set-base-decisioni.md#decisioni-del-proprietario)): numeri e nome dello starter approvati; specchio lungo e Mescolone che toglie l'immunità propria restano fino alla prova umana degli avanzati (SB-16). Lo starter del Tossico, **«Tutto è droga»**, è nella bozza come
nella griglia, senza blocchi da dividere: ogni carta si scrive coi passi di oggi o con le classi Java esistenti. Tre giri coi bot (il massimo
di Q5), circa 75 minuti di calcolo su un tetto di 2 ore; correzioni decise con la delega di D38, solo numeri del Tossico.
- **Giri.** 1: la griglia con la salute di SB-9 meno 15 (85): 0,483 contro Spazienzio, **0,403 contro Mara**, carte da 10 T morte in mano per
  metà dei turni. 2: **T iniziale 10 → 20, salute 80, Tossicone Scatarrante 8 POISON**. 3: **Raschiare il fondo +10 → +7 T**, perché valeva
  circa 4,6 HEALTH equivalenti per uso.
- **Esito.** Tossico contro Spazienzio **0,529**, contro Mara **0,479** (0,558 e 0,412 coi soli euristici), specchio 0,507. Partite di 12,8
  e 12,2 turni; specchio 16,6 turni con il 22% di patte. Invarianti a zero su 192.000 partite. Bozza SHA-256 `1c1d4a62…254bcc1e`.
- **Starter base invariati:** le 48 celle dei loro incontri coincidono una per una con SB-12a.
- **Listino a 7 HIT.** La T vale 0,39 danni per T a 10 T. Le tre bound stanno sotto 4 HEALTH equivalenti per uso (2,1, 3,6, 1,7); il peso
  di D33 per la T (0,15) le sottostima.
- **Bot.** Contromossa, cura col veleno, travaso, Grab, Steal e Mescolone valgono meno di un colpo semplice in mano ai bot: tenute, non
  tagliate. Il Mescolone costa circa 8 punti perché il suo timer toglie anche l'immunità del Tossico.

Da giudicare: le quattro correzioni, il nome dello starter, lo specchio lungo e il mazzo che si esaurisce spesso, il Mescolone. Dettagli
nel [rapporto](../reports/set-base/sb-13-report.md).

**SB-14 fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» ([D44](../set-base-decisioni.md#decisioni-del-proprietario)): numeri del giro 3 e nome dello starter approvati; partite lunghe, Offro io e il Bancone restano fino alla prova umana degli avanzati (SB-16). Lo starter di Pino, **«Chiude quando dico io»**, è nella bozza come
nella griglia. Il passo 0 ha trovato che GoingBerserk riprogettata e «L'ultimo giro» chiedono la classe Java di B1, e il proprietario ha
deciso di farla nello stesso blocco («Tutto in SB-14»): vive nei sorgenti di test (`base.pino.GoingBerserk` e la sottoclasse last resort
`base.pino.UltimoGiro`) e non tocca il caricatore. Tre giri coi bot (il massimo di Q5), circa 105 minuti di calcolo su un tetto di 2 ore;
correzioni decise con la delega di D38, solo numeri di Pino.
- **Giri.** 1: la griglia con la salute di SB-9 meno 15 (95): **0,122 contro Spazienzio, 0,099 contro Mara e Tossico**; carte da 5 L morte in
  mano per l'80–88% dei turni, e due stili su tre che non bevono. 2: **L iniziale 10 → 20, Estasi da Coca Etilene da 3 a 10 + L, L'ultimo giro
  da 6 a 12 + L**, Testata 20 → 25. 3: **Testata di nuovo 20**, perché a 25 stava sopra il prezzo della L, e **salute 95 → 100**.
- **Esito.** Pino contro Spazienzio **0,591**, contro Mara **0,559**, contro il Tossico **0,431** (0,692, 0,549 e 0,451 coi soli euristici),
  specchio 0,503. Partite di 14,2–15,1 turni; specchio di 16,1 turni con il 35% di patte; mazzo esaurito nel 77% delle partite. Invarianti a
  zero su 320.000 partite. Bozza SHA-256 `36788562…182cd2f27d5`.
- **Starter approvati invariati:** le 96 celle fra Spazienzio, Mara e Tossico coincidono una per una con SB-13.
- **Listino a 7 HIT.** 5 L valgono 14,5 HIT nel contesto di Pino, e Testata (15 netti) è in linea. Le tre bound stanno sotto 4 HEALTH
  equivalenti per uso (2,5, 2,0, 1,5).
- **Bot e immunità.** Offro io e il Bancone valgono meno di un colpo semplice in mano ai bot: tenuti. Con l'immunità a L (D28, solo
  confronto) Pino vince l'83–91%: il rischio di Q10 è misurato e la scelta di D28 resta.

Da giudicare: le correzioni, il giro 3 contro il giro 2, il nome dello starter, le partite lunghe col mazzo che si esaurisce, Offro io e il
Bancone, le rarità della bozza proposte da SB-6b (Q5). Dettagli nel [rapporto](../reports/set-base/sb-14-report.md).

**SB-15 fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo SB-15» ([D45](../set-base-decisioni.md#decisioni-del-proprietario)). Due parti, due commit.
- **Parte 1, le rarità** (D44, punto 6): la bozza è nel formato `sb-6b/1`, set `base` in versione «bozza», e ogni carta e personaggio ha la
  rarità della griglia. La matrice dei quattro starter approvati coincide con quella finale di SB-14 in 160 celle su 160.
- **Parte 2, Gigi.** Lo starter di Gigi, **«Intervento sul posto»**, è nella bozza come nella griglia. Il passo 0 ha trovato che la rara
  «Lavoro fatto bene» chiede la classe Java di D35, e il proprietario ha deciso «Sì, tutto in SB-15»: vive nei sorgenti di test
  (`base.gigi.LavoroFattoBene`) e non tocca il caricatore. Due giri coi bot su un massimo di tre, circa 55 minuti di calcolo su un tetto di
  2 ore; correzioni decise con la delega di D38, solo numeri di Gigi.
- **Giri.** 1: la griglia con la salute di SB-9 meno 15 (85): **0,148 contro Spazienzio, 0,127 contro Mara, 0,123 contro il Tossico, 0,126
  contro Pino**; carte pagate in V morte in mano fino all'88% dei turni. 2: **V iniziale 15 → 25, salute 95, Chiave da tredici 12 CUT,
  «Lavoro fatto bene» da 10 a 5 V**, le due carte sulla linea della fascia F1. Il terzo giro non è servito.
- **Esito.** Gigi contro Spazienzio **0,589**, contro Mara **0,539**, contro il Tossico **0,470**, contro Pino **0,482** (0,649, 0,541,
  0,503 e 0,444 coi soli euristici), specchio 0,503. Partite di 12,3–15,1 turni; contro Pino il 28% di patte; mazzo esaurito nel 68% delle
  partite. Invarianti a zero su 480.000 partite. Bozza SHA-256 `c4accca1…f0a2ecf`.
- **Starter approvati invariati:** le 160 celle fra Spazienzio, Mara, Tossico e Pino coincidono una per una con SB-14.
- **Listino a 7 HIT.** Nel contesto di Gigi 5 V valgono 14,5 HIT e 10 V 24,6. Le tre bound stanno sotto 4 HEALTH equivalenti per uso (3,0,
  1,8, 1,4).
- **Bot.** Steal e Smontiamo tutto valgono meno di un colpo semplice in mano ai bot: tenuti. La capacità 3 vale circa 4 punti.

Da giudicare: le correzioni, i due giri invece di tre, il nome dello starter, il mazzo che si esaurisce e le patte contro Pino, Steal e
Smontiamo tutto, Mattone e SeagullFly morti in mano. Dettagli nel [rapporto](../reports/set-base/sb-15-report.md).

**Perimetro.** Bozza dello starter (Junkie riprogettato sul primo blocco, conservandone il flavour), poi giro contro tutti gli starter già stabili, **senza toccarli se non
serve**; se serve, lo si dichiara e si rilancia la matrice.

**Completamento verificabile.** Matchup 40–60% con gli starter stabili, compresi quelli base. Invarianti verdi. Carte d'archetipo davvero giocate dal mazzo.

**Rischi.** Bot che gioca male i mazzi complessi: si aggiunge uno stile prima di correggere le carte. Piera: uso di L che decade o, con l'immunità, GoingBerserk troppo affidabile. Beppe: tavoli vuoti e distruzione ripetibile. Celestina: pulizie gratuite delle altre carte.

### SB-16 — Prova umana degli avanzati

**Perimetro.** Partite del proprietario con i tre avanzati, anche contro i base.

**Completamento verificabile.** Giudizio registrato. Osservazioni assegnate ai blocchi interessati, rifatti se serve.

**Rischi.** Complessità poco leggibile sul tavolo: va annotata per SB-31.

**Fatto il 12 novembre 2026, giudizio registrato.** Il proprietario: «anche gli starter avanzati mi sembrano ok, con celestina che sembra leggermente piu debole di beppe bulletta». **I bot dicono il contrario:** Beppe contro Celestina (il Tossico) 0,470 [0,464–0,476] in [SB-15](../reports/set-base/sb-15-report.md), cioè Celestina un poco avanti, dentro il 40–60%. Una spiegazione possibile, non provata: le carte di Celestina sono quelle che i bot giocano peggio (sotto), e un umano può giocarle in un altro modo. **Osservazione assegnata:** nessun cambio ora; si riguarda in SB-20, SB-21 e SB-22, prima leva la T iniziale di Celestina (D43). Leggibilità sul tavolo: nessuna segnalazione per SB-31. Prova del 12 novembre 2026 sulla bozza attuale, con `./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts` e il client servito; nessun problema tecnico. Numero di partite e accoppiamenti non dichiarati. Durante le stesse prove, alla regia: il salvataggio in extremis di Piera, che resta ([D48](../set-base-decisioni.md#decisioni-del-proprietario)); l'alcol che riduce i danni per tutti, rimandato alla Fase B di [SB-16b](#sb-16b--revisione-critica-delle-regole) (D49); quantità di danno e barriera sull'impatto, osservazione del client [O32](../client-roadmap.md#osservazioni-registrate-durante-c4), dopo C5.

*Stato precedente.* **Stato al 10 novembre 2026: prossimo, aspetta le partite del proprietario** (richiede SB-8, chiuso con D46). Da guardare, dai rapporti
[SB-13](../reports/set-base/sb-13-report.md), [SB-14](../reports/set-base/sb-14-report.md) e [SB-15](../reports/set-base/sb-15-report.md): le carte
che i bot giocano peggio (Celestina: Riflessi, Metabolismo, travaso e Mescolone che toglie l'immunità propria; Piera: «bevi poi
spendi», Testata, Offro io, il Bancone; Beppe: Steal, Smontiamo tutto, oggetti sul tavolo per «Lavoro fatto bene», Mattone e SeagullFly
ferme in mano); specchi lunghi e patte (Celestina 22%, Piera 35%, Beppe contro Piera 28%); mazzi esauriti spesso. Prime leve se un
avanzato risulta forte: T iniziale di Celestina (D43); L iniziale di Piera, poi Estasi (D44); V iniziale di Beppe, poi la salute (D45).
Un cambio di composizione di uno starter è un cambio della griglia e lo decide il proprietario.

### SB-16b — Revisione critica delle regole

**Origine ([D49](../set-base-decisioni.md#decisioni-del-proprietario)).** Il proprietario, 12 novembre 2026, alla fine delle prove umane: «prevediamo a un punto opportuno di SB una attività di valutazione critica dello stato delle regole del gioco, in cui un agente potentissimo impersona un game designer esperto e analizza cosa potrebbe essere cambiato per rendere il gioco più divertente, più soddisfacente, complesso ma non inutilmente complicato, poi mi propone le cose che ha trovato. io farò lo stesso e gli dirò le miee idee e insieme decideremo come agire».

**Perché qui** (punto scelto dalla regia, su delega del proprietario: «a un punto opportuno»). Dopo le prove umane dei cinque starter,
con le impressioni fresche; prima di SB-17 e SB-18, così Sergio e Duccio nascono con le regole decise e gli eventuali giri da rifare
riguardano solo i cinque starter; prima del resto del pool (SB-19) e della prima misura del set intero (SB-20).

**Fase A — analisi del game designer.** Un esecutore col modello più potente disponibile e sforzo massimo impersona un game designer
esperto. Legge il [regolamento](../game-rules.md), il [documento del set](../sets/base.md), le [schede dei personaggi](../design/set-base/schede-personaggi.md),
la [griglia](../design/set-base/griglia.md), il [listino](../design/set-base/listino.md), i rapporti dei giri coi bot e le impressioni delle prove
umane SB-12b e SB-16; può giocare partite coi bot del runner. Cerca cosa cambiare nel sistema (regolamento) e, se serve, nel set, per un
gioco più divertente e più soddisfacente, profondo ma non inutilmente complicato. Per ogni proposta: il problema, con l'evidenza; il cambio;
l'effetto atteso al tavolo; il costo (regolamento, server, client, bot, giri di bilanciamento da rifare); i rischi e cosa si perde. Proposte
in ordine di valore, anche «niente da cambiare» dove è il caso. Lavora da solo: le idee del proprietario arrivano in Fase B, e il prompt
della Fase A chiede di non leggere l'elenco qui sotto. Le decisioni già prese ([D48](../set-base-decisioni.md#decisioni-del-proprietario) e le precedenti) si
rispettano o si discutono apertamente, con il motivo. Solo rapporto: nessuna modifica a regolamento, set, codice o test.

**Fase A fatta il 12 novembre 2026.** [Rapporto](../reports/set-base/sb-16b-report.md). Tre proposte, in ordine di valore:
**P1**, chi è a terra non colpisce (R04: la mossa di un autore già morto all'inizio del suo gruppo di velocità si annulla, salvo quelle
su di sé, quindi il salvataggio di D48 resta); **P2**, l'ultimo a cadere (R06: se muoiono tutti vince chi ha più HEALTH); **P3**, nessuna
parata pura nella griglia. Misure coi bot, circa 8 minuti di calcolo: patte da 16,9% a 9,4% con P1 e allo 0,9% con P1 e P2, durata
invariata; con P1 Spazienzio–Beppe va a 0,395, mezzo punto fuori dai criteri. Sette domande al proprietario per la Fase B, fra cui
D12 (playground o gioco vivo). L'esecutore dichiara di aver letto per errore l'elenco qui sotto.

**Fase B — confronto.** Il proprietario porta le sue idee; si discute proposta per proposta. Ogni scelta diventa una decisione registrata,
compresa quella di non cambiare nulla.

**Fase B fatta il 12 novembre 2026**, con il proprietario, proposta per proposta: decisioni [D50–D53](../set-base-decisioni.md#decisioni-del-proprietario), misure
aggiuntive nel [rapporto](../reports/set-base/sb-16b-report.md#fase-b--decisioni-e-misure-aggiuntive).
- **Adottate:** P1, chi è a terra non colpisce; costi pagati solo con quello che si ha, con l'eccezione «Ultimo colpo» scritta sulla
  carta; pavimento a zero per tutte le risorse; corazza dell'alcol a L/4 sui colpi; ricerca al posto della pesca; P3, nessuna parata
  pura; P5, il ritmo caricare-colpire-parare; P4, ordine dei timer, nel regolamento 1.14 a SB-28. Pavimento, corazza e ricerca sono
  idee del proprietario; P5 nasce dalle sue risposte sulle prove umane.
- **Scartate:** P2 e lo spareggio sulla HEALTH di inizio turno («questa cosa dello spareggio proprio non mi piace»): la patta resta un
  esito, e il criterio del 10% (D51) si raggiunge con le carte.
- **Dove:** nel playground fino a SB-28 (D12): il gioco vivo e il regolamento 1.13 non cambiano fino al trasferimento.
- **Prove umane, risposte del proprietario.** Sul turno decisivo: «nel turno decisivo sì, nel corso del gioco in realtà no. non sentivo
  una vera scelta, o una vera strategia da ideare e seguire, o delle scelte tattiche, c'era solo da accumulare risorse per tirare il
  colpo più forte possibile e uccidere l'avversario più velocemente di quanto non lo stesse facendo già lui». Sulla fine a mazzo vuoto:
  «non mi è sembrata male in realtà, a quel punto ognuno aveva già giocato tutte le sue carte, quindi ci stava». Sulle parate: «le carte
  di pura difesa sono state quelle che ho preferito meno e che ho scartato più spesso per usare le bound. non riuscivo a tenermele per
  pararmi da colpi potenti dell'avversario, più che altro perché non avevo modo di riuscire a intuire quando li avrebbe usati». Con la
  sua avvertenza: «non sono un giocatore bravissimo né molto attento».
- **Calcolo:** circa 6 minuti in più coi bot (pavimento, spareggio di inizio turno, corazza a L/4 e L/2), 14 in tutto.

**Fase C — solo se si cambia qualcosa.** Prima il regolamento (1.14) o il documento del set, con versione e motivazione (AGENTS); poi test,
server, catalogo, bot e client se toccati. I giri di bilanciamento da rifare si decidono secondo i cambi, con le parole del proprietario:
«se dobbiamo rifare dei giri di bilanciamento a seguito di quei cambi, pace, li rifaremo, ma valuteremo a seconda di cosa vogliamo cambiare, se mai decidessimo che c'è da cambiare qualcosa». Può diventare più blocchi.
Diventa i blocchi SB-16c, SB-16d, SB-16e e SB-16f ([D53](../set-base-decisioni.md#decisioni-del-proprietario)).

**Idee del proprietario per la Fase B** (non fanno parte della Fase A):

- **Alcol che riduce i danni ricevuti, come regola per tutti** (12 novembre 2026, durante le prove): «mi sa che il tasso alcolemico come risorsa non fa molto, potrebbe ridurre il danno? uno diventa insensibile al dolore quando è brillo»; alla scelta fra le sole carte
  di Piera e una regola per tutti: «mi piacerebbe una regola per tutti, ma aspettiamo a cambiare le regole». Da pesare: oggi ALCOHOL è un costo e a fine turno toglie ALERTNESS (R06); con la regola il
  «giro offerto» di Piera, che dà alcol a tutti gli avversari, li renderebbe più lenti ma anche più resistenti.
  **Discussa in Fase B:** adottata come corazza dei soli colpi, a L/4 (D50, punto 5).

### SB-16c — Regole decise in SB-16b nel playground

**Fatto il 12 novembre 2026**; domande risposte dal proprietario lo stesso giorno (D54). [Rapporto](../reports/set-base/sb-16c-report.md).
- **Interruttore:** `Ruleset` (`1.13` o `d50`). Il profilo `bozza` parte con `d50` (`app.bozza.regole`), il runner usa
  `-Dsim.rules=d50`.
- **Test:** 30 nuovi, uno o più per ogni caso qui sotto; dieci mutazioni, tutte uccise.
- **Interruttore spento:** test di prima verdi, banco SB-7 identico alla base di SB-16b.
- **Interruttore acceso:** invarianti di partita a zero. Il banco coincide in ogni campo con la misura «P1 + pavimento + L/4» di SB-16b.
  Il tetto delle bound segnala CinqueMinutiEVado, che con la corazza para: domanda al proprietario.
- **Domande nel rapporto:** quattro, risposte dal proprietario lo stesso giorno ([D54](../set-base-decisioni.md#decisioni-del-proprietario)). Si tiene tutto com'è;
  CinqueMinutiEVado si corregge in SB-16d.

**Perimetro.** Le regole di [D50](../set-base-decisioni.md#decisioni-del-proprietario) nel server, dietro un interruttore acceso solo dal profilo `bozza` e dal
runner:
- P1: gruppi di velocità; chi è a terra all'inizio del proprio gruppo non colpisce, ma le mosse su di sé restano;
- costi pagati solo con quello che si ha; la HEALTH non si paga fino a 0, salvo le carte con «Ultimo colpo», che si risolvono anche a terra;
- pavimento a zero per tutte le risorse;
- corazza dell'alcol: HIT ricevuti ridotti di L/4;
- ricerca al posto della pesca, come passo nuovo del formato della bozza;
- nel registro del turno, il motivo dell'annullamento («a terra») e la carta cercata.

Nei bot, un'euristica per reagire a un caricamento visibile e per giocare il colpo dopo il caricamento. Il prototipo di SB-16b
([diff](../reports/set-base/sb-16b/fase-b/variante-regole-fase-b.diff)) è un esperimento, non un punto di partenza obbligato.

**Completamento verificabile.** Test di conformità per ogni regola:
- colpo di un autore già a terra, annullato; cura su di sé che lo salva (D48); colpo reciproco nello stesso gruppo; bound annullata che
  non scarta;
- costo in HEALTH che porterebbe a 0, rifiutato, e accettato con «Ultimo colpo»;
- risorse che non scendono sotto zero;
- corazza sui HIT e non su CUT e POISON, anche sui danni a sé;
- ricerca: carta già in mano, già scartata o assente; mazzo vuoto; oggetto trovato; carta cercata scartata con una bound; due ricerche
  nello stesso turno; ricerca di chi è a terra.

A interruttore spento la partita viva è identica: test di oggi verdi e banco SB-7 uguale cella per cella. A interruttore acceso,
invarianti a zero sul banco.

**Rischi.** È un blocco di regole: tocca il motore (`Game`, `Character`, `Move`, la pesca), non solo `com.gsc.bm.sim` e le carte di
bozza, e lo dichiara. Regolamento, documento del set, catalogo e client non cambiano fino a SB-28 (D12, D50).

### SB-16d — Riprogettazione dei cinque starter (P3 e P5)

**Fatto il 12 novembre 2026; proposta approvata (D55).** Il proprietario: «approvo, poi cmq le ritestiamo estensivamente».
[Proposta 0.2](../design/set-base/sb-16d-proposta.md) attuata nella sola bozza dopo SB-16c; [rapporto](../reports/set-base/sb-16d-report.md).

- Nove slot approvati, cinque coppie con `search`, esposizioni visibili per due turni e difese con cura/rimborso; griglia aggiornata.
  Copie, rarità, composizioni e valori iniziali conservati. Nessun cambiamento a motore, client, catalogo, regolamento o documento del set.
- CinqueMinutiEVado corretta sotto D38/D54 con **+10 → +5 L**, solo numero: valore per uso **3,75**, tetto 4 invariato; +6 varrebbe 5,10.
- Quattordici nuovi test delle carte, inclusi ricerca e chi è a terra; suite verde (server 702, 7 saltati; client-debug 37).
- Un solo banco SB-7 con `d50`, 480.000 partite: **otto invarianti a zero e zero bound in violazione**. Nessun giro di bilanciamento.
  Patte globali 10,06%, cinque incontri ancora oltre il 10%, fra cui gli specchi di Piera 29,15%, Celestina 21,85% e Beppe 14,00%:
  criteri da raggiungere in SB-16e, non dichiarati superati. Prossimo SB-16e, poi prova umana SB-16f. STOP prima dei giri.

**Da SB-16c ([D54](../set-base-decisioni.md#decisioni-del-proprietario)).**
- **CinqueMinutiEVado:** va corretta. Con la corazza dell'alcol (D50, punto 5) supera il tetto delle bound: valore per uso 8,50 contro 4.
- **Il caricamento è un effetto, non un tipo di carta.** Lo può avere anche un colpo. Serve a dire all'avversario «ho in mano una
  carta potente, ma sono vulnerabile»: lui sceglie se colpire o difendersi.
- **Dove sta la ricerca:** nel motore il passo `search` vale in ogni carta che si gioca e poi pesca, cioè azioni regolari, bound e last
  resort. Non vale in basic e oggetti.

**Perimetro.** Proposta delle carte da cambiare nei cinque starter secondo i principi di [D52](../set-base-decisioni.md#decisioni-del-proprietario):
- nessuna parata pura: ogni difesa che vale solo nel turno dà anche circa +5 della risorsa del personaggio, o una piccola cura per le
  generiche;
- il ritmo caricare-colpire-parare: colpo annunciato da uno stato visibile, accumulo rischioso con un'esposizione che dura anche il
  turno dopo, una coppia caricamento-colpo con ricerca per personaggio.

Con le regole di D50: senza valori negativi l'abs nei testi non serve più, la corazza dell'alcol pesa sugli incontri, priorità e A
contano con P1. La [griglia](../design/set-base/griglia.md) si aggiorna con i principi e gli slot toccati. Prima la proposta, che il
proprietario approva per funzionamento e composizione (D45, punto 7); poi la bozza.

**Completamento verificabile.** Proposta approvata; griglia aggiornata; bozza con le carte nuove e le classi o i passi necessari;
invarianti a zero.

**Rischi.** Troppi cambi insieme: le misure non dicono più quale pesa, quindi pochi cambi per starter. Durata: un colpo annunciato
costa due turni.

### SB-16e — Giro sui cinque starter con le regole nuove

**Eseguito il 12 novembre 2026, STOP al terzo giro (D53).** [Rapporto](../reports/set-base/sb-16e-report.md),
[tutti gli incontri e specchi per giro](../reports/set-base/sb-16e/incontri.md), [coppie e ablazioni](../reports/set-base/sb-16e/coppie.md).
Tetto fissato prima: 3 giri e 2 ore di calcolo, compresi listino e controlli delle coppie; regole D50 e quattro stili invariati.
Nel giro finale invarianti e bound a zero violazioni, ma Piera è fuori quota contro Mara e Celestina; patte negli specchi
Celestina **22,32%**, Piera **17,78%**, Beppe **8,22%**. Sei incontri oltre i 12 turni medi: equilibrio non dichiarato raggiunto.
Bozza e griglia conservano i numeri del terzo giro sotto D38/D53, funzioni e liste di D55 invariate. Prima leva su Piera:
L iniziale 20→10 nel giro 2; salute 100→85 nel giro 3, poi recupero A del caricamento 10→20 e Testata 20→25.
Proposte da decidere prima di proseguire: un solo nuovo lotto numerico su recupero A e danni a sé delle last resort;
per SB-16f, carta cercata e motivo «a terra» mostrati nel flusso ordinario del client (oggi solo nel testo inglese richiudibile).
Nessun quarto giro, nessun ridisegno o intervento sul client in questo blocco.

**Perimetro.** Giro coi bot con le regole di D50 e le carte di SB-16d, fino ai criteri:
- base contro base 45–55%, gli altri incontri 40–60%;
- durata circa 6–12 turni;
- **patte al massimo al 10% in ogni incontro, specchi compresi** (D51);
- invarianti a zero.

Al massimo 3 giri e 2 ore di calcolo. Delega come D38 per i numeri (salute, costi, danni, risorse iniziali, valore della corazza) e per
le aggiunte di P3; funzionamento delle carte e composizione degli starter si propongono al proprietario. Leve già note: Piera con la
corazza, prima la L iniziale e poi la salute (D44); Beppe contro Spazienzio (0,395 con P1). Per ogni coppia con ricerca, misure dedicate:
con e senza la coppia; quante volte il colpo è cercato, giocato, parato; quante volte l'esposizione è punita; effetto su durata e patte.
Listino di priorità e A da rimisurare.

**Completamento verificabile.** Criteri raggiunti o, se in 3 giri non tornano, stop con una proposta invece di forzare. Rapporto con le
misure delle coppie.

**Rischi.** Lo specchio di Piera è il caso più difficile: 34% di patte con P1 e pavimento, 36% con la corazza. I bot leggono male: le
misure sottostimano letture e corazza.

### SB-16e2 — Lotto numerico dopo lo STOP di SB-16e

**Autorizzato da [D56](../set-base-decisioni.md#decisioni-del-proprietario), domanda 1 del [rapporto SB-16e](../reports/set-base/sb-16e-report.md#domande-numerate-al-proprietario).**
Un solo lotto, al massimo 30 minuti di calcolo: controllo col profilo del giro 3 di SB-16e e tre varianti prefissate,
(a) Un altro e arrivo +20→+35 A, (b) danno a sé di L’ultima dose e L’ultimo giro 5→2, (c) entrambe. Stessi semi, matrice,
stili e regole `d50`; criteri di D16 e D51 invariati. Nella bozza la variante che li soddisfa tutti, altrimenti quella con meno
violazioni, dichiarando i criteri falliti, e stop. Niente secondo lotto.

**Eseguito il 12 novembre 2026, criteri non raggiunti.** [Rapporto](../reports/set-base/sb-16e2-report.md),
[incontri per profilo](../reports/set-base/sb-16e2/incontri.md). Un lotto, 971,7 s su 1.800; controllo identico al giro 3.
Tutti e quattro i profili hanno 10 violazioni (2 patte, 2 quote, 6 durate); invarianti e bound a zero. Adottata nella bozza la
variante **(c)**: Un altro e arrivo +35 A, danno a sé di L'ultima dose e L'ultimo giro 2 HIT. Rispetto al controllo, specchio di
Celestina 22,32 → 18,57% di patte, di Piera 17,78 → 13,07%; Mara–Piera 0.653 e Celestina–Piera 0.662 ancora fuori quota.
(b) e (c) erano pari sulle regole fissate prima; spareggio esteso dichiarato nel rapporto. Domande al proprietario: ridisegno
o prova umana con questi numeri; conferma di (c) su (b).

### SB-16f0 — Leggibilità della ricerca e dell’annullamento

**Autorizzato da [D56](../set-base-decisioni.md#decisioni-del-proprietario), domanda 2 del [rapporto SB-16e](../reports/set-base/sb-16e-report.md#domande-numerate-al-proprietario).**
Prima della prova umana SB-16f, il minimo intervento proposto lì: binding ed esito della ricerca e motivo dell’annullamento come
campi strutturati opzionali nella vista del playground; nel client la carta trovata pubblicamente ispezionabile riusando la pesca
esistente e «annullata: a terra» nel riepilogo italiano. Lo fa un esecutore dopo SB-16e2.

**Fatto il 12 novembre 2026.** [Rapporto](../reports/set-base/sb-16f0-report.md). La mossa pubblica ha due campi opzionali in sola
lettura, `voidReason` e `search` (`card`, `found`, `revealed`). Mancano con le regole vive e non dicono niente della mano o del mazzo
oltre la carta rivelata. Nel client, «Ultimo turno» scrive «Annullata: a terra.» e la riga della ricerca, riuscita o fallita, con
il pulsante che apre la carta trovata nell’ispezione. In sequenza la carta trovata dall’avversario esce scoperta, col volo di pesca
che c’era già. Il test di confine di SB-16e è aggiornato per D56; dieci test nuovi (5 server, 5 client). Mutazioni 10/10.
Test, contesto Spring completo e catture verdi; niente Playwright, come chiesto.

### SB-16f — Prova umana degli starter rifatti

**Perimetro.** Partite del proprietario con i cinque starter dopo SB-16e, prima di SB-17: letture a metà partita, colpi annunciati e
ricerche, parate con aggiunta, corazza dell'alcol, turno decisivo con P1.

**Completamento verificabile.** Giudizio registrato; osservazioni assegnate ai blocchi interessati.

**Rischi.** Il client deve mostrare la carta cercata e il motivo dell'annullamento: se non lo fa, serve un piccolo intervento prima
della prova, da decidere col proprietario.

**Fatto il 13 novembre 2026, giudizio registrato.** Il proprietario, sulle carte che cercano i colpi annunciati: «ne vorrei di piu, per vederne almeno una o due a partita»; «dovrebbero dare le risorse necessarie a giocare il colpo che cercano»; «i colpi annunciati cercati dovrebbero essere potenti»; «ci dovrebbe essere qualche malus se non si giocano il turno successivo, altrimenti uno li puo usare le carte che cercano solo come tutori che danno risorse, e tenersi il colpo potente per dopo. potrebbe essere una scelta che un giocatore fa, ma ci deve essere una conseguenza». Sul resto: «il resto mi sembra a posto». Prova sul PC e sul telefono, con la bozza e le regole d50; numero di partite e accoppiamenti non dichiarati. **Problema tecnico:** il server si è fermato da solo una volta senza errori nel log (ultima riga una partita alle 10:25); riavviato, poi nessun altro arresto. Da riguardare se ricapita.

**Lettura della regia sulla bozza di oggi** (variante c). Caricamento e colpo cercato: Spazienzio +15 V e +15 A, colpo 25 V per 40 HIT (il caricamento da solo non basta a pagarlo); Mara +15 A, colpo 15 A per 25 CUT; Celestina +10 T, colpo 10 T per 12 POISON; Piera +15 L e +35 A, colpo gratuito da 10 + L HIT; Beppe +10 V, colpo 5 V per 6 + 4 per oggetto HIT. Una sola carta di caricamento per starter. Oggi l'unico costo è l'esposizione per due turni, che nasce dal caricamento e non dal tenere il colpo.

**Osservazioni assegnate:** tutte e quattro a una seconda passata sulle coppie caricamento-colpo dei cinque starter, prima di SB-17, da decidere col proprietario (blocco [SB-16g](#sb-16g--coppie-caricamento-colpo-seconda-passata), aperto il 13 novembre 2026). Il malus per chi non gioca il colpo il turno dopo è un funzionamento nuovo (D45, punto 7; D8).

*Stato precedente.* **Stato al 13 novembre 2026: prossimo.** Si gioca con i numeri di SB-16e2, variante (c), sapendo che i criteri dei bot non sono
raggiunti (specchi di Celestina e Piera, Piera contro Mara e Celestina, quattro incontri lunghi): [D57](../set-base-decisioni.md#decisioni-del-proprietario).
Da guardare anche quei finali, la leggibilità di SB-16f0 sul tavolo e se le partite sembrano lunghe. Dopo la prova si decide se
ridisegnare le last resort o il finale degli specchi.

### SB-16g — Coppie caricamento-colpo, seconda passata

**Origine.** Le quattro osservazioni del proprietario nella prova umana [SB-16f](#sb-16f--prova-umana-degli-starter-rifatti), tutte
sulle carte che cercano i colpi annunciati: più frequenti (una o due per partita), risorse sufficienti a giocare il colpo cercato,
colpi cercati potenti, una conseguenza per chi carica e non gioca il colpo il turno dopo. Aperto dal proprietario il 13 novembre 2026
(«procediamo»), dopo la proposta della regia.

**Fase 1 fatta il 13 novembre 2026:** [proposta](../design/set-base/sb-16g-proposta.md) consegnata; risposte del proprietario registrate una alla volta. **Risposta 1 registrata in D59:** scelta F, vulnerabilità per il turno del tutore e quello successivo, poi finché la copia cercata resta in mano. **D60:** totale 120 approvato. **D61:** schema approvato per tutti i cinque starter: due copie dello stesso caricamento NC verso due copie dello stesso colpo NC, più un caricamento verso un colpo raro; revisione delle sostituzioni nella proposta. **D62:** anche il secondo caricamento è NC. **D63:** approvata la direzione risorse sufficienti dopo il fine turno, colpo NC potente/affidabile e raro con picco maggiore condizionato. **D64:** vulnerabilità a HIT, CUT e POISON approvata per tutti, con possibilità future di altri effetti o fattori più severi. **D65:** approvato il legame alla precisa copia, con uscita effettiva e ricerca fallita gestite come proposto. **D66:** cumulo moltiplicativo di vulnerabilità indipendenti approvato. **D67:** inclusa la valutazione di una difesa regolare estesa al POISON, con funzionamento da presentare prima della modifica. **D68:** divisione 2a/2b approvata. **Fase 1 fatta, risposte registrate D59–D68.** Carte concrete e sostituzioni aggiornate allo schema D61–D63 devono ancora essere ripresentate e approvate prima dell’inserimento nella bozza. **STOP dopo la registrazione; nessuna attuazione avviata o autorizzata da questa registrazione.**

**Fase 1 — proposta.** Per ciascuno dei cinque starter: quante carte di caricamento (copie o una seconda carta che cerca, con la
composizione che cambia di conseguenza); cosa dà il caricamento rispetto al costo del colpo; quanto vale il colpo cercato; la
conseguenza se il colpo non si gioca il turno dopo, scritta come andrebbe sulla carta, con le meccaniche esistenti (D8) o, se serve
qualcosa di nuovo, dichiarandolo. Effetto atteso su patte, durata e criteri; cosa serve nella bozza e nei bot. Il funzionamento e la
composizione li approva il proprietario (D45, punto 7): STOP dopo la proposta.

**Fase 2 — divisione approvata (D68). 2a consegnata il 13 novembre 2026** ([rapporto](../reports/set-base/sb-16g-2a-report.md)): carta scoperta e vulnerabilità F nel motore con le regole `d50`, vista, client e test; regole vive invariate. Le cinque domande hanno avuto risposta in **D69**, che cambia il legame: gettone sul giocatore legato al nome della carta cercata, senza timer, tolto solo giocando una carta con quel nome; la carta scoperta resta come vista. **2a rivista secondo D69** (stesso rapporto); le due domande hanno avuto risposta in **D70** (ricerca fallita per due turni; nessuna ricerca di oggetti, rifiutata dal caricatore). **2b passo 1 fatto** il 13 novembre 2026; dettagli sotto e nel [rapporto](../reports/set-base/sb-16g-2b1-report.md).

**Consulto esterno e 2b in tre passi (13 novembre 2026).** Prima della 2b il proprietario ha fatto fare a un modello esterno un [consulto di design](../reports/set-base/consulto-design-fable-2026-11-13.md), con approfondimento su partite e simulazioni, e una [revisione indipendente](../reports/set-base/revisione-fable-2026-11-13.md). Esiti principali: col gettone tolto a fine gruppo, chi diventa veloce col caricamento (Piera, Mara) non subisce danni amplificati; una ricerca fallita costa meno di una riuscita (22–61% dei caricamenti); i bot non leggono il gettone. Decisioni **D71–D73** sulle regole, **D74** sull'organizzazione. La 2b si fa in tre passi, nello stesso budget complessivo di tre giri e due ore di calcolo:

1. **Passo 1 — regole e bot, nessuna carta nuova.** D71 (fine turno, uscita, carta mostrata), D72 (ricerca fallita) e D73 («Ultimo colpo») nel motore con le regole `d50`; correzione della carta che cerca il proprio nome (rilievo M3 della revisione); avviso del client prima di scartare l'ultima copia di una carta che tiene un gettone; i cinque caricamenti di oggi con il gettone e testi allineati; bot che leggono gettoni e carte scoperte, con le tre politiche; un giro di misura con taratura delle risorse della ricerca fallita. Poi **breve prova umana** (Spazienzio lento, Piera o Mara veloci).
2. **Passo 2 — frequenza.** Schema D61–D62 (due caricamenti NC verso due colpi NC, uno verso un raro) con i danni di oggi, dopo l'approvazione della proposta 1.3 aggiornata a D78. Costi ed effetti dei colpi attuali; la proposta esplicita la sola anticipazione PAZIENZA +25 V per finanziare Impatto da zero (D63), approvata in D79. Bot nuovi in tutte le tre politiche (D77).
3. **Passo 3 — potenza.** Proposta corrente **1.4**, selettiva dopo i dati del passo 2 (D80), al posto della tabella 1.2 storica; funzionamenti e Bancone POISON (D67) da approvare. Giro finale A potenza / B potenza più Bancone POISON, nuovo passo 0 sui bracci effettivi, misurando anche turni da metà salute e finali in un turno; nessun avvio in Fase A.

**Passo 1 consegnato il 13 novembre 2026** ([rapporto](../reports/set-base/sb-16g-2b1-report.md), [contratto d50 1.0](../design/set-base/sb-16g-2b1-rules.md)). D71–D73, M3, avviso prima dello scarto dell'ultima copia e punteggiatura degli stati; cinque caricamenti con ×1,5 HIT/CUT/POISON e ripiego D72; tre politiche su vista pubblica. Un giro: **648.000 partite in 121,958 s**, invarianti e bound a zero; 6,881% patte globali, specchi Celestina 19,32% e Piera 14,38% ancora fuori soglia. Danni e liste invariati. Risorse di ricerca fallita mantenute alla partenza arrotondata: SPA +5 V/+5 A, MAR +5 A, TOS +5 T, PIN +5 L/+10 A, GIG +5 V. **Residuo D68 dopo il passo 1: 2 giri, 7.078,042 s. Lo STOP per la prova umana è stato poi soddisfatto da D75; resta lo STOP prima delle carte concrete del passo 2.**

**Prova umana breve fatta il 13 novembre 2026**, sulla consegna del passo 1, contro il computer. Impressioni del proprietario, testuali:

- «il bot con cui si gioca sul client è stupido, non si para se sa che col colpo potente che ho cercato verrebbe ucciso, né sfrutta il mio status negativo per farmi più danni e uccidermi»
- «il bot va fatto giocare bene, con vari livelli di forza e difficoltà, anche perché poi il single player contro il computer è una modalità fondamentale nel gioco»
- «la meccanica delle carte che cercano i colpi potenti che abbiamo creato oggi è molto carina, la approvo»
- «credo di non avere altro da segnalare nella prova umana»

**Lettura della regia.** Il bot conferma la prima osservazione nel codice: `StyleSupport.rhythm` aggiunge solo pesi fissi (pararsi +15 se l'avversario mostra un colpo forte; contro un bersaglio col gettone 1,5 volte il danno del colpo), senza calcolare se il colpo mostrato o quello amplificato sono letali; su punteggi in cui un colpo normale vale 30–45 spesso non bastano. Ne segue che anche le misure del passo 1 (4,4–6,7 danni in più per ricerca riuscita) sono un minimo, contro avversari che non puniscono. Nessuna osservazione su leggibilità del gettone, avviso dello scarto o ripiego di D72: Q10 resta aperta senza urgenza, le risorse del ripiego restano quelle del passo 1. Decisioni: **D75** (meccanica approvata) e **D76** (bot consapevole del colpo letale prima del passo 2; livelli di forza in Q2).

**Bot consapevole del colpo letale consegnato il 13 novembre 2026** ([rapporto](../reports/set-base/sb-16g-bot-letale-report.md)), punto 1 di D76, solo con le regole `d50`. `LethalAwarePolicy` avvolge ogni stile e il computer della bozza. Con la sola vista pubblica e senza pianificare oltre il turno, prevede il turno (`TurnForecast`). Se un colpo scoperto e pagabile lo porterebbe a terra, tiene solo le mosse più sicure: parata, contromossa, cura o colpo che arriva prima. Gioca un colpo che porta sicuramente a terra l'avversario, gettoni, stati, corazza e ordine dei gruppi compresi. Nei casi incerti gioca tutte le varianti. La previsione concorda col motore in 6.542 turni reali su 6.542; 16 scenari espliciti; sei mutazioni rilevate. Gioco vivo 1.13 identico byte per byte. Misura di confronto fuori budget D68, 288.000 partite in 72,55 s, semi del passo 1: il bot nuovo vince il **52,64%** delle decisive contro quello del passo 1 (euristici a parità di stile 50,2–51,4%, casuale 59,7%). Patte 6,37% contro 7,00%. Costo del gettone per ricerca riuscita quasi invariato (amplificazione 4,91 contro 4,86). I passi 2 e 3 misureranno coi bot nuovi (`-Dsim.bots=passo1` riproduce il passo 1). Nessuna carta cambiata; Q2 fuori perimetro. **Residuo D68 invariato: 2 giri, 7.078,042 s. STOP dopo il rapporto, cinque domande numerate.**

**Risposte alle cinque domande registrate il 14 novembre 2026 in [D77](../set-base-decisioni.md#decisioni-del-proprietario).** Nessuna prova umana contro il bot nuovo: si va avanti. Patta scelta quando la sconfitta è inevitabile, mosse che espongono il bot evitate da sé, colpi in mano coperta non considerati fino ai livelli di forza (Q2), bot nuovi in tutte e tre le politiche di `ChargeMeasureTest` per i passi 2 e 3. Q9 decisa lo stesso giorno in [D78](../set-base-decisioni.md#decisioni-del-proprietario): «Annuncia» e, in generale, parole chiave ragionevoli che accorcino i testi. **Proposta 1.3 consegnata, in attesa di approvazione** il 14 novembre 2026 ([documento](../design/set-base/sb-16g-proposta.md)): Fase A, solo documenti. «Annuncia» definita una volta secondo d50 1.0, dieci caricamenti con ripieghi del passo 1, colpi ai danni/costi attuali per il passo 2; unica anticipazione numerica proposta PAZIENZA +15→+25 V per D63. Sostituzioni e liste ricontrollate: 20 regolari per starter, 120 slot, 45 C/55 NC/20 R. Aumenti della 1.2 e difesa POISON separati al passo 3. Nessun'altra parola chiave proposta; quattro domande numerate nel documento. Nessuna bozza, contratto, regola, carta, codice o test modificati, nessuna misura: budget residuo intatto **2 giri/7.078,042 s**. **Approvata dal proprietario lo stesso giorno in [D79](../set-base-decisioni.md#decisioni-del-proprietario)** («Approvo tutto»): sì alle quattro domande. **Prossimo:** il passo 2 sulle carte della 1.3; il passo 3 resta fermo fino alla sua proposta di funzionamento.

**Passo 2 consegnato il 14 novembre 2026**, secondo D79 ([rapporto](../reports/set-base/sb-16g-2b2-report.md)). Contratto d50 1.1 con la sola parola «Annuncia», dieci caricamenti e cinque nuovi NC, liste da 20 conformi alla proposta 1.3, griglia 120 slot/45 C/55 NC/20 R. Danni/costi/effetti dei colpi invariati; PAZIENZA +25 V/+15 A e Preparo verso Chiave. Bot e previsione generici sugli effetti pubblici, verificati sui dieci titoli senza nuove informazioni nascoste. Passo 0 fuori budget: 8.640 partite/22,726 s, stima conservativa 2.676,695 s, fattibile. **Un giro: 648.000 partite/738,001141 s**, 15.155.192 turni di giocatore senza violazioni e bound entro 4. Annunci per partita Spazienzio/Mara/Celestina/Piera/Beppe **0,862/0,596/0,497/1,089/0,345**, con distribuzioni nel rapporto; non garantite una o due per tutti. **11 incontri fuori criterio**, Spazienzio sopra quota contro tutti, specchi Celestina 18,32% e Beppe 15,67% di patte. Piera rientra aggregata all'8,55%, resta lunga. Nessuna taratura dopo il giro. **Residuo D68: 1 giro/6.340,0406251 s (6.340,041 s)**. STOP dopo il commit: prossimo una proposta separata del passo 3, potenza e Bancone POISON da approvare prima dell'attuazione; il giro residuo resta intatto. **Domande del rapporto risposte il 14 novembre 2026 in [D80](../set-base-decisioni.md#decisioni-del-proprietario):** sì alle priorità del passo 3 e al giro finale a due bracci.

**Stato: proposta 1.4 del passo 3 consegnata e approvata** il 14 novembre 2026 ([D82](../set-base-decisioni.md#decisioni-del-proprietario), «Si a tutte»); prossimo l'attuazione con passo 0 e giro finale. ([documento corrente](../design/set-base/sb-16g-proposta.md#passo-3--proposta-corrente-14)). Fase A con STOP dopo il commit, soltanto i tre documenti autorizzati: nessuna bozza, contratto, griglia, carta, codice, test, regola o misura modificati/eseguiti. Diagnosi D80 e leve candidate: Impatto 40→30 HIT, senza togliere il finanziamento di PAZIENZA; annunci offensivi da 4 CUT per Beppe e colpi più efficaci; picchi condizionati dei rari con conti da zero a N+1; pressione e differenze di A per gli specchi Celestina/Beppe. Sotto il cofano +5 A è proposta separata fuori coppia, non una sostituzione; liste D79 ferme. Le dieci righe della potenza 1.2 sono riesaminate una per una e restano come storico. Bancone POISON diretto/periodico solo nel braccio B, funzionamento ancora da approvare. Disegno concreto: 648.000 partite per braccio, stessi semi/bot del passo 2, 1.296.000 totali nello stesso ultimo giro; nuovo passo 0 di 8.640 partite per braccio e stima conservativa comprensiva del campione entro **1 giro/6.340,0406251 s (6.340,041 s)**. Nessun rilancio se fattibilità o criteri non tornano. Incertezze e cinque domande nel documento; questa consegna non approva le carte né avvia il giro. **Prossimo:** giudizio del proprietario sulla 1.4; soltanto dopo approvazione, attuazione e nuovo passo 0 dei due bracci.

**Passo 3, attuazione fermata il 14 novembre 2026** ([rapporto](../reports/set-base/sb-16g-2b3-report.md)), prima di modificare bozza, codice o test. Tutta la 1.4 sta nei dati e nei parametri esistenti, salvo due funzionamenti: il travaso con 12 POISON diretti (`junkie.ToxicBloodDrain` è una classe viva con il solo parametro `turns`) e il Rutto con L memorizzata dopo il costo, azzerata, −A e 14+2×L (manca un moltiplicatore nei dati e nella previsione, e gli effetti su sé precedono quelli sul bersaglio). Classi solo di test scartate: il profilo `bozza` avvia il jar. Proposta raccomandata: classe del playground per il Rutto, parametro `poison` (0 di default) nella classe del travaso, campo `times` in `PrintedEffects` letto dalla previsione, con identità viva e fedeltà come cancelli. Nessuna misura: **residuo D68 intatto, 1 giro/6.340,041 s**. **Prossimo:** risposta del proprietario alle due domande del rapporto, poi attuazione, passo 0 e giro come prefissati.

**Passo 3 consegnato il 14 novembre 2026**, seconda parte dello stesso [rapporto](../reports/set-base/sb-16g-2b3-report.md#parte-2--attuazione-passo-0-e-giro-finale-a-due-bracci-d82-d84-d88), sul codice del giro confermato da D88. Proposta 1.4 in bozza e griglia, liste D79 ferme; classe del Rutto, `poison` facoltativo nella classe viva del travaso (valore vivo 0), `times` nella previsione; braccio B con `-Dsim.arm=B` e il solo Bancone POISON ×0,5. Suite 793 e contesto Spring 910 verdi, gioco vivo 1.13 identico byte per byte, previsione fedele su entrambi i bracci, mutazioni rilevate, `check-rules.py` identico alla base su 38 carte. Passo 0 fattibile (s0 43,125 s, stima 5.014,6 s); **giro: A 648.000 partite in 658,138 s, B 648.000 in 849,394 s** (B completato dopo l'interruzione, D87), invarianti a zero, bound entro 4. **11 incontri su 15 fuori criterio in entrambi i bracci:** Spazienzio 57,4% contro Mara e 33–38% contro gli altri, Beppe 1,53 annunci a partita e vincente contro tutti; patte globali 3,8%, specchi Celestina e Beppe rientrati nelle patte, Celestina–Celestina ancora 12,98 turni. B porta Celestina–Piera da 64,13% a 61,53% e cambia solo gli incontri con Piera. Episodi registrati nel rapporto: messaggi non arrivati, interruzione, clic non valido, D86 provata e abbandonata. **Residuo D68: 0 giri/4.682,655 s.** STOP con proposta (braccio B, proposta 1.5 su Spazienzio e Beppe con budget nuovo) e quattro domande.

**Correzione 1.5 consegnata il 14 novembre 2026** ([rapporto](../reports/set-base/sb-16g-15-report.md)), secondo D90 sul braccio B scelto in D89: Impatto 30 → 34 HIT, Chiave da tredici 22 → 18 CUT, Lavoro fatto bene 14 + 7 → 14 + 4 per oggetto, nient'altro (bozza, griglia, test con D90 citata, `Correzione15Test`). Suite 801 verde, previsione fedele su entrambi i bracci. Passo 0 18,735 s (stima 2.246,5 s ≤ 7.200 s); cancello d'identità superato, 864/864 celle dei 6 incontri senza Spazienzio né Beppe identiche al passo 0 e al giro del braccio B. **Un giro: 648.000 partite in 501,243 s**, invarianti a zero, bound entro 4. **7 dei 9 incontri con Spazienzio o Beppe in criterio** (B: 2): Beppe a 52–55% contro gli altri starter, Beppe–Beppe 5,99% di patte e 7,63 turni; fuori Spazienzio–Mara 61,82% (ora anche contro gli euristici di Mara) e Spazienzio–Piera 37,67%. Celle per politica fuori 19/81 nei 9 e 51/135 in tutto; **cancello completo D16/D51 non raggiunto** (6 su 15, i 4 esclusi da D89 più i 2 di Spazienzio). Lavoro fatto bene da 3.792 a 526 finali in un turno, Impatto da 2.267 a 4.411. Budget D90: **0 giri/6.666,322 s**. STOP con i dati e quattro domande.

**Stati coerenti con la sequenza del turno, correzione del client il 13 novembre 2026** ([rapporto](../reports/set-base/stati-in-sequenza-report.md)). Segnalazione del proprietario dopo la prova umana: il gettone «viene visualizzato a inizio turno, prima che la carta tutore che da risorse sia risolta» e «sparisce subito all'inizio del turno in cui giochi la carta a cui è legato, non quando dovrebbe». Il motore era corretto (gettone creato al passo del caricamento, tolto a fine turno, D71); il client disegnava i segnalini degli stati dalla vista finale anche durante la sequenza. Ora gli stati partono dalla vista precedente: il gettone compare al passo del caricamento e resta per tutto il turno del colpo; gli altri stati compaiono al passo della mossa che li crea quando il rapporto lo dice senza ambiguità, altrimenti a fine sequenza. Solo client, nessuna regola cambiata. Catture prima/dopo nel rapporto; il giudizio sulla comprensibilità resta al proprietario.

- **2a — supporto tecnico e presentazione:** D58 e D64–D66, rivisti da D69 e D71: carta trovata mostrata solo in mano, gettone sul giocatore legato al nome, cumulo indipendente moltiplicativo, fine turno della giocata e uscita un turno dopo che il nome manca da mano e mazzo; vista del server e client, con test. Supporto limitato al playground, senza trasferimento alla partita viva. La presenza dei test non equivale ad avvio applicativo riuscito: contesto Spring e avvio reale si verificano separatamente.
- **2b — carte, bot e bilanciamento:** prima dell’inserimento nella bozza, ripresentare e far approvare coppie concrete e sostituzioni compatibili con D60–D63: 120 carte nel set, 20 regolari per starter; due copie di un caricamento NC verso due copie di un colpo NC e un diverso caricamento NC verso un raro. Poi carte nella bozza, relativi test e griglia coerenti, bot con mano scoperta e le tre politiche già decise, giro coi criteri D16/D51. Inclusa la valutazione della difesa dal POISON (D67), il cui eventuale funzionamento concreto richiede approvazione prima della modifica.

Per **2b** il tetto originario è **3 giri e 2 ore cumulative di calcolo**; dopo il passo 1 restano **2 giri e 7.078,042 s**, delega dei numeri come D38 e misure dedicate delle coppie: caricamenti giocati, colpi cercati giocati subito/tenuti/parati, conseguenze scattate e confronto delle tre politiche. Il budget non si moltiplica con la divisione in sottofasi. Se criteri o budget non tornano, STOP con dati e proposta. La registrazione originaria di D68 non autorizzava l’avvio; il passo 1 è stato poi richiesto espressamente dal proprietario e consegnato come indicato sopra. Il passo 2 è ora attuato con D79; il passo 3 resta fermo fino alla proposta e approvazione dei funzionamenti. Residuo attuale: **1 giro/6.340,041 s**.

**Bot nella Fase 2** (13 novembre 2026, proposta della regia, «Si aggiungi» del proprietario; attuata nel passo 1 e completata da D76–D77 sopra). All'apertura del blocco l'euristica di SB-16c legge solo la ricerca del round precedente, e in SB-16e il ritmo caricare-colpire non è automatico (Spazienzio attende in media 2,43 turni e lascia inutilizzate circa metà delle copie trovate). Due aggiunte: **(1)** i bot leggono le carte scoperte in mano finché restano lì (D58); **(2)** tre politiche su tenere o giocare il colpo cercato, misurate a confronto: «gioca sempre il turno dopo», «tieni se l'avversario si è parato», «a caso». Se i criteri reggono con tutte e tre, la conseguenza è robusta; se una politica domina, la conseguenza va rivista. I bot misurano numeri e casi estremi; se la scelta è interessante lo giudica la prova umana. Un bot che pianifica più turni avanti non fa parte di questo blocco.

**Completamento verificabile.** La Fase A del passo 3 consegna la proposta 1.4, conti e funzionamenti, due bracci e passo 0 prefissati, verifiche documentali e commit, poi STOP in attesa del proprietario. Non chiude SB-16g. Per completare il blocco restano: proposta approvata e registrata come decisione; attuazione in bozza e griglia con liste D79 ferme; passo 0 fattibile e unico giro finale A/B nel residuo; otto invarianti a zero e bound entro 4, criteri D16/D51 per incontri/specchi e politiche; rapporto con le misure delle coppie, delle tre politiche, turni da metà salute e finali in un turno. Se criteri o budget non tornano, STOP con proposta, nessun rilancio. Dopo, una breve prova umana del proprietario prima di SB-17.

**Rischi.** Più caricamenti e colpi più forti accorciano le partite e cambiano gli incontri già misurati in SB-16e2. Il malus deve
lasciare la scelta di tenere il colpo, con un prezzo: non deve diventare un obbligo.

### SB-16h — Prova esplorativa della dimensione del mazzo

**Origine.** Idea del proprietario del 14 novembre 2026: «a che punto ci converrebbe testare se il gioco migliora o meno aumentando le
carte consentite nel mazzo? ora abbiamo 20 fisse, ma se fosser 25? o 30? o un range fra 20 e 30?». Anticipa la parte di misura di
SB-23 ([D81](../set-base-decisioni.md#decisioni-del-proprietario)): deciso il formato prima di Sergio, Duccio e del bilanciamento del set intero, un cambio non
costringe a rifare SB-17–SB-21.

**Perché ora.** Nel passo 2 di SB-16g il mazzo si esaurisce nel 44–50% delle partite di Celestina, Piera e Beppe, e gli specchi lunghi
finiscono spesso in patta: due problemi su cui la dimensione agisce direttamente. «Annuncia» cerca nel mazzo, quindi un mazzo più grande
non rende meno affidabile il colpo cercato; diluisce le altre carte.

**Fase A — proposta e STOP.** Varianti da misurare, almeno 20/2 (riferimento), 25/2, 25/3, 30/2 e 30/3; come comporre gli starter più grandi
(con 3 copie bastano copie di carte presenti, con 2 copie servono titoli in più, che sono una scelta di composizione da approvare, D45
punto 7); cosa si misura (quote, patte, durata, mazzi esauriti, annunci per partita, carte morte in mano, costanza dei mazzi). Il range
20–30 si valuta come domanda di design, non come variante del banco: senza un incentivo chi costruisce sceglie il minimo, che diventa
il formato vero. Il proprietario approva varianti e composizioni.

**Fase B — misura.** Solo nel playground, con le carte del passo 3 di SB-16g, bot nuovi e stessi semi. Budget proprio, fissato nella Fase
A, separato dal residuo D68 di SB-16g. Le regole dei mazzi (R02 1.12) non cambiano: se il proprietario sceglie un formato diverso, si
riapre SB-1 con una nuova versione del regolamento e si rilanciano le misure.

**Completamento verificabile.** Dati presentati al proprietario, che decide il formato (chiude Q7). SB-23 resta per la valutazione finale
sul set intero e coi mazzi costruiti.

**Rischi.** Più copie aumentano la costanza delle combo; mazzi più grandi possono allungare le partite che oggi sono già lunghe (specchi).

**Fase A consegnata il 14 novembre 2026**, in parallelo al passo 3 di SB-16g: [proposta 0.1](../design/set-base/sb-16h-proposta.md) con cinque varianti (20/2, 25/2, 25/3, 30/2, 30/3), composizioni annidate per i cinque starter, range sconsigliato come formato e misurato solo con un braccio misto facoltativo, budget proprio di un giro e 7.200 s, dieci domande al proprietario. Nessuna misura. **Approvata lo stesso giorno in [D83](../set-base-decisioni.md#decisioni-del-proprietario)**, con le due aggiunte al criterio di scelta. **Fase B consegnata il 14 novembre 2026**, sulla bozza 1.5 scelta in D92, con i criteri D93 ([rapporto](../reports/set-base/sb-16h-report.md)). Cinque varianti 20/2, 25/2, 25/3, 30/2 e 30/3, più dieci incontri misti 20 contro 30, 300 semi per cella e otto thread in sequenza. Cancello d’identità: 20/2 identico byte per byte alla 1.5 su matrice JSON/Markdown, osservazioni e bozza, sia al passo 0 sia nel giro intero. Passo 0: 48.960 partite, 61,124 s di banco, stima 6.996,499 s; **giro unico: 3.672.000 partite in 3.214,403 s di orologio**, invarianti a zero su 72.223.546 turni di giocatore, bound entro 4. Fuori D93 **8/6/6/6/5** incontri su 15; esaurimenti euristici **15,64/2,47/2,11/0,99/1,55%**. **Nessuna alternativa soddisfa tutto D83:** 25/2 introduce patte e durata dello specchio di Piera, 25/3 e 30/2 nuove uscite di quota; 30/3 peggiora Mara–Piera e allunga Celestina–Celestina da 14,48 a 16,69 turni. Nel misto il vantaggio dipende dal personaggio e dalla lista. **Budget D83: 0 giri e 3.985,597 s residui**, passo 0 e verifiche fuori budget. Nessuna bozza, regola o lista viva cambiata. **STOP: scelta del formato (Q7) e prova umana al proprietario**, prima della proposta 1.6 di D92 e di SB-17. **Chiusa il 14 novembre 2026 in [D94](../set-base-decisioni.md#decisioni-del-proprietario):** il formato resta 20/2 (Q7); le ricerche fallite si affrontano sulle carte, con un «Annuncia» di al massimo due nomi nella proposta 1.6 ([nota sulle ricerche fallite](../reports/set-base/ricerche-fallite-20-2.md)).
