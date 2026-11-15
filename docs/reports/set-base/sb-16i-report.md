# SB-16i — Fase B: attuazione e misura della correzione 1.6

**15 novembre 2026.** Fase B di [SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima), sul progetto approvato ([proposta 1.6](../../design/set-base/sb-16i-proposta.md)) con le modifiche di [D97](../../set-base-decisioni.md#decisioni-del-proprietario), che prevale. Solo playground (`d50`): regolamento 1.13, `docs/sets`, catalogo, client e `docs/api.md` invariati. Regole: [regole-playground.md](../../design/set-base/regole-playground.md) 1.1; carte: [bozza di riferimento 1.6](../../design/set-base/bozza-di-riferimento.md).

## In breve

- **Codice (A):** «Annuncia X o Y» con la scelta del giocatore all'invio (campo facoltativo della mossa, non ancora nel protocollo), rimescolamento dopo ogni ricerca sotto `rules.searchShuffle`, «Gioca d'anticipo», «Rincara» con contatore pubblico per giocatore e per titolo; bot: regola condivisa fra due nomi, tossicità su di sé, anticipo, Rincara. Tutto solo con `d50`.
- **Cancelli (B):** passo 0 della 1.5 identico byte per byte a SB-16h **al secondo tentativo** (il primo ha trovato un mio cambio di comportamento nello specchio di Celestina, corretto); identità viva 1.13 identica; fedeltà di `TurnForecast` e `ViewTable` sui tre effetti nuovi (con un rosso vero trovato e corretto: il Ghiaccio consumato); mutazioni 15/15.
- **Bozza (C):** la 1.6 in `bozza.json`, la 1.5 congelata in `set-base/storico/1.5/bozza.json`.
- **Misura (D):** giro unico di 648.000 partite. **Fuori dalla soglia minima 3 incontri su 15:** Spazienzio–Mara 26,5% e Mara–Piera 77,6% (Mara da più debole a più forte, soprattutto per Sorpasso in curva d'anticipo nell'89% delle giocate) e le patte dello specchio di Celestina 12,1%. Ricerche fallite 34,0% → 21,2%; entrambi i nomi disponibili nel 39,5% delle giocate. **Correzione numerica non eseguita:** nessuna riserva scritta agisce su questi scostamenti. Spesi 1.014,7 s su 3.300.
- **STOP:** cinque domande in fondo.

## Cosa cambia nel codice (A)

Tutto dietro `Ruleset.playground()` (`d50`), con valori di default che lasciano identico il comportamento: senza i campi nuovi nella bozza e con le regole 1.13 nulla cambia. Perimetro dell'eccezione di D97 (domanda 8): `com/gsc/bm/sim`, `model/cards/base`, `model/game` (`Game`, `Move`), `model/Character`, `model/cards/PrintedEffects`, il package dei bot, test e risorse di test del server. Regolamento, `docs/sets`, catalogo, client, `docs/api.md` e protocollo della partita viva **non toccati**.

| Punto | Motore | Formato della bozza | Bot |
|---|---|---|---|
| «Annuncia X o Y» | `Character.requestSearchAmong`; `Move.searchChoice` (facoltativo, non ancora nel protocollo: `@JsonIgnore`) controllato all'invio (nome stampato e con una copia nel mazzo); `Game` registra all'invio i nomi disponibili e alla ricerca usa la scelta o il primo stampato disponibile, nessuno = ricerca fallita; gettone sul nome trovato; `Move.search.announced` pubblico | passo `search` con `cards` (1–2 binding distinti) al posto di `card`; `Draft` controlla ogni nome come prima (carta della bozza, mai un oggetto) | regola unica in `BotView.legalMoves` (`LegalMove.search`): il colpo pagabile nel turno dopo contando `foundGains`; entrambi o nessuno: più danno nominale (nessuno: prima il meno costoso); `BotView.Self.searchable` dà i nomi annunciati con una copia nel mazzo |
| Rimescolamento | dopo ogni ricerca giocata (trovata o no) `Collections.shuffle(deck, random)` del giocatore, solo se `Character.searchShuffle()` | `rules.searchShuffle` (facoltativo, falso se manca); `Draft` lo passa ai personaggi che crea, anche al server del profilo `bozza` | — |
| «Gioca d'anticipo» | `Game`: deciso quando la mossa si risolve, dall'ordine già fissato (gruppo successivo del bersaglio); `Character.isAhead()` durante la risoluzione; `Move.ahead` pubblico e riga «Gioca d'anticipo: sì/no» | passo `anticipo` con `steps` annidati (niente ricerche, consumi, anticipi); `PrintedEffects.Step.ahead` | stili: stima pubblica (priorità della carta contro quella delle carte scoperte del bersaglio, poi A dopo il costo); `TurnForecast` e `ViewTable` dall'ordine simulato, mai contro una mossa non nota |
| «Rincara» | `Character.countPlay` a ogni giocata (annullate comprese), per titolo; `Move.plays` pubblico per le carte con la parola chiave | `perPlay` negli importi (0 se manca); `L'ultimo giro` con `@Tunable(optional = true)` `perPlay` e `perPlaySelf` | `BotView.Seat.plays`; stili, `TurnForecast` e `ViewTable` contano il contatore |
| Tossicità | — (solo dati: `empty`) | `base.items.GhiaccioNelTovagliolo`, `base.com.DueDitaInGola` | stili: azzeramento della propria T se non immuni (T/2 per due turni, meno i danni a sé), col peso di ciascuno stile sulla salute |

Altro: `PrintedEffects` delle carte a dati costruiti una volta per definizione (prima a ogni lettura); `DifficilePolicy.sought` legge la lista; nel Difficile `Play` porta la scelta. **Il Difficile non entra nel giro** (D85 (8)): i suoi test restano verdi, il costo si rimisura in B5c.

**Nulla può cambiare il mazzo fra la giocata e la ricerca** (D97 (2)), verificato nel codice: nessuna carta, viva o di bozza, tocca il mazzo di un altro giocatore (nessun uso di `getDeck`, `drawCard` o `searchCard` fuori da `Player` e `Game`); ogni giocatore ha una sola mossa per turno; l'autore pesca solo dopo la propria ricerca. Il motore lo controlla comunque: confronta i nomi disponibili all'invio con quelli alla ricerca e, se differissero, ferma la partita invece di cercare in un altro mazzo (`Sb16iRulesTest`). Nelle 673.920 partite dei passi 0 e del giro non è mai successo.

## Cancelli (B), prima di cambiare la bozza

| Cancello | Esito |
|---|---|
| **Passo 0 d'identità** (codice nuovo, 1.5 = `bozza.json` + `bancone-b.json`, liste 20/2, 4 semi, 8.640 partite) | **Primo tentativo non identico, secondo identico byte per byte.** Il primo (58,5 s di orologio) differiva solo nelle 81 celle dello specchio di Celestina: gli stili valutavano anche le **perdite** di T su di sé, e nello specchio Celestina perde l'immunità dopo «C'è del sangue», quindi Metabolismo e «C'è del sangue» venivano letti come pulizia. Corretto: gli stili valutano solo l'**azzeramento** (EMPTY) della propria T, che è ciò che fanno le due carte nuove. Secondo tentativo (42,6 s): `matrix.json`, `observations.json`, `draft.json`, `deck-observations.json` identici a `step0-20-2` di SB-16h, `matrix.md` identico al passo 0 storico della 1.5 ([impronte](sb-16i/identity.json), [primo tentativo](sb-16i/identity-try1.json)) |
| Identità viva 1.13 (480.000 partite, come `live-identity.json`) | **identica byte per byte** (JSON 266.868 B, Markdown 26.111 B), nella stessa cartella delle basi ([impronte](sb-16i/live-identity.json)); un primo confronto in una cartella nuova differiva solo per il percorso nell'intestazione |
| `check-rules.py` | invariato e verde |
| Fedeltà di `TurnForecast` e `ViewTable` | 1.5 congelata, bracci A e B: come prima (5.526/5.526 e 5.536/5.536; `ViewTable` a due turni 3.026/3.026 e 3.032/3.032). **1.6, coi tre effetti nuovi: `TurnForecast` 5.290/5.290; `ViewTable` primo turno 5.290/5.290, due turni 2.888/2.888 in salute e risorse.** Il primo confronto sulla 1.6 ha trovato un rosso vero: il Ghiaccio (oggetto consumato) azzera la T, e i due modelli non applicavano gli EMPTY degli oggetti; corretto. Sulla 1.6 52 finestre a due turni dopo una carta Java senza testo stampato che prende o distrugge un oggetto lontano (Steal, «Smontiamo tutto») sono contate a parte: è un limite preesistente di `ViewTable`, che il campione della 1.6 incontra per la prima volta (seme 7.100.197, turno 12: «Smontiamo tutto» distrugge la Pasticca che Celestina consuma subito dopo); i bracci della 1.5 restano controllati come prima, senza questa esclusione |
| Mutazioni sui rami nuovi | **15/15 rilevate** e verde dopo il ripristino: ordine e disponibilità dei nomi, scelta ignorata, rimescolamento mai e sempre, anticipo nello stesso gruppo, per sola priorità, senza mossa del bersaglio, con la propria mossa annullata, contatore che salta le mosse annullate, `perPlay` a zero che cresce, scelta dei bot senza pagabilità, tossicità ignorata dagli stili, anticipo nello stesso gruppo in `TurnForecast`, contatore fermo in `ViewTable` ([dati](sb-16i/mutations.json), [esecutore](sb-16i/mutations.py)) |
| Contesto Spring separato | verde, verifica distinta dai test unitari (972 test, 0 falliti, 20 saltati), sul codice finale con la 1.6 |

Dopo il cancello d'identità il codice è cambiato solo in punti che la 1.5 non raggiunge: un commento di `StyleSupport`, gli EMPTY degli oggetti consumati in `TurnForecast` e `ViewTable` (nessun oggetto della 1.5 ha un passo `empty`, controllato sulla copia congelata).

## Misura (D)

Budget D97 di 3.300 s di orologio, mai insieme ad altre misure (nessun processo Java prima di ogni corsa). Runner: [sb-16i-run.ps1](sb-16i-run.ps1); analisi di sola lettura: [sb-16i-analyze.py](sb-16i-analyze.py).

| Voce | Partite | Orologio (s) | Banco (s) | Tetto della voce | Esito |
|---|---:|---:|---:|---:|---|
| Passo 0 d'identità, primo tentativo | 8.640 | 58,53 | 26,40 | 150 (insieme) | non identico (specchio di Celestina, sopra) |
| Passo 0 d'identità, secondo tentativo | 8.640 | 42,56 | 29,82 | 150 (insieme) | identico byte per byte |
| Passo 0 di fattibilità sulla 1.6 | 8.640 | 58,95 | **22,01** (≤ 34,5) | 150 | fattibile: stima 22,01 × 40 + 120 = 1.000 s ≤ 1.500 |
| Giro unico 1.6 (15 incontri × 144 celle × 300 semi, 7.000.000–7.000.299, otto thread) | 648.000 | **854,70** | 809,00 | 1.500 | completato; invarianti e bound a zero |
| Correzione numerica | — | 0 | — | 1.500 | **non eseguita** (sotto, «Correzione numerica») |
| **Totale** | **673.920** | **1.014,74** | | **3.300** | residuo 2.285,26 s, nessun rilancio oltre quello d'identità |

[Registro del budget](sb-16i/budget.json), [fattibilità](sb-16i/feasibility.json). Nelle 673.920 partite il controllo «il mazzo non cambia fra giocata e ricerca» non è mai scattato (sarebbe stato un errore della corsa).

### I 15 incontri sui soli euristici

Quota del primo nominato sulle decisive, patte e turni su tutte le partite fra due bot euristici (D93); 1.5 dal [ricalcolo](criteri-euristici-1.5.md); previsione della [sezione 8 della proposta](../../design/set-base/sb-16i-proposta.md#8-effetti-attesi-sugli-incontri). Tabella completa, anche con tutti gli stili e com contro com: [riepilogo del giro](sb-16i/round-summary.md).

| Incontro | 1.6: quota / patte / turni | 1.5: quota / patte / turni | Quota 1.6 − 1.5 | Previsione | Fuori dalla soglia D95 |
|---|---|---|---:|---|---|
| Spazienzio–Spazienzio | 50,82% / 3,87% / 8,83 | 50,30 / 3,60 / 9,10 | +0,52 | invariato | — |
| Spazienzio–Mara | **26,48%** / 1,87% / 8,52 | 58,20 / 3,50 / 9,10 | −31,72 | 50–56 | **quota, 8,52 punti sotto 35** |
| Spazienzio–Celestina | 40,69% / 5,01% / 9,82 | 36,40 / 5,00 / 10,10 | +4,29 | 35–40 | — |
| Spazienzio–Piera | 40,48% / 1,48% / 9,05 | 30,10 / 1,30 / 9,60 | +10,38 | 35–41 | — (rientra) |
| Spazienzio–Beppe | 48,87% / 1,66% / 7,61 | 48,30 / 1,60 / 8,00 | +0,57 | 46–52 | — |
| Mara–Mara | 48,20% / 4,27% / 9,22 | 50,30 / 4,50 / 8,80 | −2,10 | invariato; patte 4–6 | — |
| Mara–Celestina | 60,91% / 7,20% / 9,70 | 31,50 / 5,20 / 9,60 | +29,41 | 36–42 | — (rientra, ma oltre la previsione) |
| Mara–Piera | **77,64%** / 2,19% / 8,53 | 34,80 / 5,40 / 9,30 | +42,84 | 40–46 | **quota, 12,64 punti sopra 65** |
| Mara–Beppe | 54,84% / 1,56% / 7,46 | 36,40 / 1,00 / 7,50 | +18,44 | 40–46 | — |
| Celestina–Celestina | 49,64% / **12,14%** / 14,14 | 49,60 / 7,70 / 14,50 | +0,04 | invariato; turni 14,0–14,4; patte 7–9 | **patte, 2,14 punti sopra 10** (specchio: la durata non conta) |
| Celestina–Piera | 62,45% / 7,95% / 10,44 | 61,80 / 8,10 / 11,00 | +0,65 | 57–62 | — |
| Celestina–Beppe | 42,98% / 8,78% / 8,86 | 46,00 / 9,55 / 9,20 | −3,02 | 42–47; patte 8–10 | — |
| Piera–Piera | 49,66% / 6,84% / 9,90 | 50,00 / 9,88 / 11,10 | −0,34 | patte 8–10 | — |
| Piera–Beppe | 43,22% / 0,79% / 7,57 | 50,30 / 1,70 / 8,30 | −7,08 | 46–51 | — |
| Beppe–Beppe | 49,97% / 9,02% / 6,47 | 55,80 / 9,00 / 6,80 | −5,83 | invariato | — |

**Fuori dalla soglia minima: 3 incontri su 15** (nella 1.5 erano 3: Spazienzio–Piera, Mara–Celestina, Mara–Piera). I tre della 1.5 sulla quota sono rientrati o si sono rovesciati, ma **Mara è passata da più debole a più forte**: +31,7 punti contro Spazienzio, +29,4 contro Celestina, +42,8 contro Piera, +18,4 contro Beppe. La previsione aveva sottostimato di molto l'effetto della velocità. Lettura dai contatori: Sorpasso in curva è d'anticipo nell'89,5% delle giocate (priorità 2), quindi quasi sempre +8 A a Mara e −8 A al bersaglio, uno scarto di 16 A che mantiene Mara nel gruppo di velocità precedente anche nel turno dopo; la Sgommata è d'anticipo nel 39,4% e dimezza la risposta del bersaglio, la Cinghiata nel 33,4%. Contro Piera (A 15, salute 80, Bancone ×0,65) l'effetto è il più forte. Le patte dello specchio di Celestina salgono di 4,4 punti: la dose che cresce (Rincara 5, 1 a sé) chiude le partite anche col contraccolpo, quindi più morti simultanee. Turni: tutti entro 12 fuori dagli specchi; lo specchio di Celestina scende da 14,50 a 14,14 (previsione 14,0–14,4). Altri spostamenti fuori dalla previsione ma dentro la soglia: Piera–Beppe 43,2 (previsto 46–51), Beppe–Beppe 50,0 (era 55,8, previsto invariato), Mara–Beppe 54,8 (previsto 40–46).

### Correzione numerica

**Non eseguita.** D97 la ammette solo per un incontro fuori dalla soglia e solo fra le riserve scritte nella proposta: Amaro +20 → +15 L, «Due dita in gola» a Spazienzio al posto di Denti stretti, incremento del contraccolpo di Rincara. Nessuna agisce sui tre scostamenti nella direzione giusta:

- **Mara–Piera 77,6%**: Amaro +15 L toglie corazza e carburante a Piera, quindi peggiora l'incontro;
- **Spazienzio–Mara 26,5%**: «Due dita in gola» a Spazienzio serve contro la T di Celestina; contro Mara Spazienzio ha solo la T dei propri Negroni (+3 T), e togliere Denti stretti (+10 V) lo indebolisce;
- **patte dello specchio di Celestina 12,1%**: un contraccolpo più alto porta più morti simultanee, quindi alza le patte (sezione 4 della proposta).

Usare una riserva nella direzione sbagliata sarebbe una taratura fuori dal mandato; le leve che servono (sull'anticipo di Mara, sul contraccolpo della dose) sono domande al proprietario. Budget residuo 2.285 s, non speso.

### Cosa dicono i contatori nuovi (soli euristici)

**Scelta fra due nomi.** Su 636.470 caricamenti giocati, al momento della scelta **entrambi i nomi sono nel mazzo nel 39,5%**, uno solo nel 39,0%, nessuno nel 21,5%. Per caricamento la scelta vera va dal 20,4% (Slalom) al 50,7% (PAZIENZA: FINITA). Con due nomi la regola dei bot sceglie sempre lo stesso colpo per carta, salvo TI FACCIO SPAZIO: Impatto per PAZIENZA (45.142 su 45.142), Chiave per i due caricamenti di Beppe, Estasi per quelli di Piera, Tossicone per quelli di Celestina, **Sgommata anche per «Ti stringo la curva»** (17.243 su 17.243), che è fatta per la Cinghiata: con 25 di danno nominale contro 18 la regola «a pari pagabilità il più forte» preferisce la Sgommata; TI FACCIO SPAZIO sceglie O-Ahio 8.715 volte e Impatto 7.074 (Impatto si paga col premio solo con almeno 10 V propri). [Tabella per caricamento](sb-16i/round-summary.md#scelta-fra-due-nomi-soli-euristici).

**Ricerche fallite: 34,0% → 21,2%** (685.145 e 626.497 ricerche; 1.5 dal 20/2 di SB-16h). Per mazzo: Spazienzio 28,0 → 12,2%, Mara 37,4 → 24,5%, Celestina 39,4 → 22,9%, Piera 33,6 → 23,1%, Beppe 34,4 → 23,3%. La stima della proposta era 12–18%: il rimescolamento e i colpi già giocati lasciano senza copie più spesso del previsto entrambi i nomi.

**Last resort.** Partite finite con una last resort: Spazienzio 5,1 → 4,6%, Mara 2,6 → 5,1%, Celestina 23,5 → 23,1%, Piera 10,6 → 6,0%, Beppe 4,9 → 4,2%. Fra chi la gioca, giocate medie per partita: Celestina 1,91 (il 24,1% la gioca tre volte o più), gli altri 1,29–1,45 (1,6–6,5% tre o più). **Fase di last resort** (turni dalla prima last resort giocata, da chiunque, alla fine): media 1,79 turni; 1 turno nel 46,6% delle partite in cui c'è, 2 nel 33,4%, 3 nel 14,7%, 4 o più nel 5,4% (nessuna oltre 6). La 1.5 non aveva questo contatore: il confronto diretto si potrà fare solo con una misura apposta. Mazzi esauriti: Mara 7,2 → 12,4% (un'azione in più, Steal esce per un oggetto), Piera 22,6 → 14,8%, gli altri in calo.

**Gioca d'anticipo** (sì / no): Sorpasso in curva 167.905 / 19.772 (89,5%), Sgommata 78.252 / 120.186 (39,4%), Cinghiata 31.219 / 62.251 (33,4%).

## Bozza 1.6 (C)

`server/src/test/resources/set-base/bozza.json` è la 1.6, Bancone del braccio B dentro: due nomi sui dieci caricamenti (premi della 1.5 invariati), «Gioca d'anticipo» su Sorpasso in curva, Sgommata e Cinghiata di traverso, Ghiaccio nel tovagliolo a Mara al posto di Steal, Due dita in gola a Piera al posto di un Grab e a Beppe al posto di uno Steal, Rincara su Banzai 5 (2), L'ultima dose 5 (1), L'ultimo giro 4 (1), Bancone HIT ×0,65 e POISON ×0,5, salute di Piera 80, `searchShuffle` vero. `Bozza16Test` controlla che rispetto alla 1.5 cambi solo questo. La 1.5 è congelata byte per byte in `set-base/storico/1.5/bozza.json` (SHA-256 `6f705bacf1a9…`, lo stesso della bozza di riferimento 1.5), `bancone-b.json` invariato; il nome del file resta `bozza.json` perché il nome entra nell'intestazione delle matrici storiche. `SetBaseArms.armB` è un'identità sulle bozze che hanno già il Bancone B.

**Attesi e file letti dai test, con la decisione (D97).** Nessun atteso cambiato per accettare una regressione.

| Test | Cosa cambia | Perché |
|---|---|---|
| `Correzione15Test`, `PotenzaD82Test`, `DeckSizeVariantsTest`, `LethalAwarePolicyTest` | leggono `SetBaseArms.FROZEN_15` | riproducono misure o casi scritti sulla 1.5; nessun atteso cambiato. Il caso nuovo della 1.6 (la Sgommata d'anticipo diventa una salvezza contro un colpo letale mostrato) è in `Sb16iBotsTest`, accanto allo stesso caso sulla 1.5 |
| `TurnForecastFidelityTest`, `ViewTableFidelityTest` | 1.5 congelata (bracci A e B, attesi invariati) **più** la 1.6; sulla 1.6 la mossa porta la scelta della ricerca e le finestre a due turni dopo una carta Java che prende o distrugge un oggetto lontano sono contate a parte | cancello di fedeltà sui tre effetti nuovi; il limite di `ViewTable` è preesistente (sopra) |
| `SetBaseDraftTest` | salute di Piera 80; liste di Piera e Beppe; 12 stati con durata (+ il POISON del Bancone); Bancone 20 HIT → 13; GEN-15 e OGG-14 NC nell'elenco delle rarità; 78 carte | descrive la bozza corrente contro la griglia: valori decisi in D97, griglia aggiornata nello stesso commit |
| `VulnerabilitaD69Test` | la carta modificata usa `card` invece di `cards`; in più controlla un oggetto fra due nomi | stessa verifica di D70, ora anche sulla lista |
| `ChargeMeasureTest`, `StarterBalanceMeasureTest` | le copie osservate del personaggio portano l'impostazione `searchShuffle`; contatori SB-16h anche senza variante (`sim.deckObserve`) e contatori SB-16i in un file a parte (`sim.sb16iCounters`) | senza, il banco avrebbe misurato la 1.6 senza rimescolamento; i file storici restano identici (cancello d'identità) |

## Campi nuovi per il passo del client

Client e `docs/api.md` non sono stati toccati (D97 (4)–(5)). Il passo del client dovrà mostrare, o rendere scrivibili, questi campi. Tutti esistono solo con `d50` e mancano quando non servono, quindi con le regole 1.13 la vista resta identica.

| Dove | Campo | Oggi | Cosa serve al client |
|---|---|---|---|
| Mossa inviata | `searchChoice` (binding di uno dei due nomi annunciati) | nel motore e usato dai bot; `@JsonIgnore`, **non ancora nel protocollo** | renderlo scrivibile nel JSON della mossa e documentarlo in `docs/api.md`; il pop-up della scelta. Senza campo vale il primo nome stampato disponibile; un nome non stampato o senza copie nel mazzo rende la mossa illegale |
| Vista del giocatore (propria) | nomi annunciati con almeno una copia nel mazzo, per le carte in mano che annunciano due nomi | solo nella vista dei bot (`BotView.Self.searchable`) | un campo della vista propria (`ClientSelfPlayerView`, in `service/view`, fuori dal perimetro di questo blocco) da cui il pop-up legge le alternative; nessun ordine né conteggio |
| Mossa risolta (pubblica) | `search.announced` | presente quando la carta annuncia due nomi; `search.card` è il nome scelto, `search.found` e `search.revealed` come prima | «Ricerca: «X» o «Y», scelta «Y», trovata (mostrata a tutti)» oppure «nessuna delle due nel mazzo, pesca normale» |
| Mossa risolta (pubblica) | `ahead` (vero o falso) | presente solo per le carte con «Gioca d'anticipo»; anche riga del rapporto «Gioca d'anticipo: sì/no» | «Gioca d'anticipo: sì, prima di «Z»» oppure «no» |
| Mossa risolta (pubblica) | `plays` (giocate precedenti della carta da parte del suo autore) | presente solo per le carte con «Rincara» | «giocata n volte» |
| Vista dei personaggi (pubblica) | contatore delle giocate per titolo | nel motore (`Character.playCounts()`) e nella vista dei bot (`BotView.Seat.plays`); **non** nella vista del client | accanto alla last resort, propria e dell'avversario: «giocata n volte · prossima: … al bersaglio, … a sé»; serve un campo in `ClientCharacterView` |
| Testi delle carte | «Annuncia X o Y», «Gioca d'anticipo: …», «Rincara X (Y a sé)» | già nel campo `gui` della bozza | nessun codice; eventuale evidenza della parola chiave |
| Registro del turno | «searched the deck for X or Y: chose and found …», «none in the deck, normal draw» | nel motore | come le righe di ricerca di oggi |

## Documenti (E)

[regole-playground.md](../../design/set-base/regole-playground.md) 1.1 (RP-13…RP-24, sezione 4 con le due parole chiave, sezione 6 per i bot, sezione 7 vuota); [bozza-di-riferimento.md](../../design/set-base/bozza-di-riferimento.md) 1.6, rigenerata dal solo `bozza.json` col generatore aggiornato; [griglia](../../design/set-base/griglia.md) (sezione «Correzione 1.6», righe delle carte toccate, PG-PIN, starter); riga e sezione di SB-16i nel [piano](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima); [indice](../../README.md) (prossimo passo).

## Verifiche

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | verde: **855 test server, 0 falliti/errori, 20 saltati** (misure opt-in); **37/37** client-debug |
| Contesto Spring completo (`./scripts/build.ps1 -Task TestServerContext -Offline`) | verde: 972 test, 0 falliti/errori, 20 saltati |
| `python scripts/check-rules.py` | verde, invariato (39 carte vive e 1 token) |
| Test nuovi | `Sb16iRulesTest` 16, `Sb16iBotsTest` 6, `Bozza16Test` 3: verdi |
| Mutazioni | **15/15 rilevate** e verde dopo il ripristino: ordine e disponibilità dei nomi, scelta ignorata, rimescolamento mai e sempre, anticipo nello stesso gruppo, per sola priorità, senza mossa del bersaglio, con la propria mossa annullata, contatore che salta le mosse annullate, `perPlay` a zero che cresce, scelta dei bot senza pagabilità, tossicità ignorata dagli stili, anticipo nello stesso gruppo in `TurnForecast`, contatore fermo in `ViewTable` ([dati](sb-16i/mutations.json), [esecutore](sb-16i/mutations.py)) |
| `python docs/reports/set-base/sb-6b/rarita-bozza.py --check`, `genera-bozza-di-riferimento.py --verifica` | verdi |
| `git diff --check`, `python scripts/check-links.py` | verdi; 343 file e 0 link rotti |

**Rossi.** Nessun rosso residuo. Durante il blocco: il primo passo 0 d'identità (corretto, sopra), il Ghiaccio nei modelli dei bot (corretto), un test che vieta nomi di carte nei sorgenti degli stili (il mio commento li citava: riscritto), e il limite preesistente di `ViewTable` sulle carte Java senza testo (dichiarato). Nessuna voce nuova nel registro dei rossi noti.

**Non verificato.** Client, Playwright, FFA (l'anticipo con più avversari è coperto solo da un test a tre posti), mazzi costruiti, prova umana; il Difficile coi tre effetti nuovi oltre ai suoi test (costo da rimisurare in B5c); la vista del client per scelta, anticipo e contatore (passo del client).

## Evidenze e riproduzione

In [sb-16i/](sb-16i/), 0,4 MB: impronte d'identità, budget, fattibilità, riepiloghi del passo 0 e del giro, JSON finali minificati e compressi (matrice, osservazioni, contatori SB-16h e SB-16i, bozza), mutazioni ed esecutore, [manifesto con SHA-256](sb-16i/manifest.json). Uscite e log integrali: `%TEMP%\bm-sb16i`. Dalla radice, su un percorso nuovo (non è un'autorizzazione a un secondo giro):

```powershell
./docs/reports/set-base/sb-16i-run.ps1 -Phase step0 -OutputRoot "$env:TEMP/bm-sb16i-riproduzione"
python docs/reports/set-base/sb-16i-analyze.py feasibility "$env:TEMP/bm-sb16i-riproduzione"
./docs/reports/set-base/sb-16i-run.ps1 -Phase round -OutputRoot "$env:TEMP/bm-sb16i-riproduzione"
python docs/reports/set-base/sb-16i-analyze.py summarize "$env:TEMP/bm-sb16i-riproduzione" round "$env:TEMP/bm-sb16i-riproduzione/summary"
```

Il passo 0 d'identità si ripete con `-Phase identity -Draft classpath:/set-base/storico/1.5/bozza.json` e `sb-16i-analyze.py identity`.

## Cosa giudica il proprietario

- Se accettare che Mara, da più debole, sia diventata più forte (fuori sopra contro Piera, quasi contro Spazienzio) e con quale leva correggerla: nessuna riserva scritta lo fa.
- Se la regola dei bot fra due nomi va bene così (sceglie quasi sempre il colpo più forte, anche quando la carta è fatta per l'altro).
- La prova umana breve della 1.6, dopo il passo del client.

## Domande al proprietario

1. **Mara troppo forte.** Spazienzio–Mara 26,5% e Mara–Piera 77,6% sui soli euristici. Nessuna riserva scritta interviene, quindi non ho fatto la correzione (2.285 s di budget residuo). Vuoi una seconda Fase A breve con leve su Mara (per esempio Sorpasso in curva senza il +8 A, oppure l'anticipo solo sulla Sgommata), o passare a SB-17 con lo scostamento dichiarato (D95 (3))?
2. **Patte dello specchio di Celestina 12,1%** (era 7,7%): la dose che cresce col contraccolpo porta morti simultanee. Togliere il contraccolpo di Rincara a L'ultima dose («Rincara 5»), o accettare lo scostamento in uno specchio?
3. **Scelta dei bot fra due nomi.** La regola di D97 («a pari pagabilità il più forte per danno nominale») fa cercare a «Ti stringo la curva» sempre la Sgommata (25) e mai la Cinghiata (18 più A/2), per cui la carta è fatta. Va bene, o il danno nominale deve contare la parte variabile (per la Cinghiata 18 + A/2)?
4. **Stili e tossicità.** Per tenere identica la 1.5 gli stili valutano solo l'azzeramento della propria T, non le perdite parziali (la proposta diceva «empty/lose»). Va bene, finché non arriva una carta che abbassa la T senza azzerarla?
5. **Passo del client.** Confermi che il prossimo è il passo del client (pop-up della scelta, anticipo, contatore; campi sopra), poi la prova umana breve della 1.6, indipendentemente dalla risposta alla domanda 1?
