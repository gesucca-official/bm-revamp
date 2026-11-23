# SB-28 — Corrispondenza fra regole del playground, regolamento 1.14 e regolamento 2.0

Fase A di SB-28, 23 novembre 2026. Accompagna il [regolamento 2.0 candidato](game-rules-2.0.md). Fonti:
[regole del playground 1.9](../regole-playground.md), [regolamento 1.14](../../../game-rules.md),
[proposta di SB-28](../sb-28-proposta.md), [D50](../../../set-base-decisioni.md#decisioni-del-proprietario),
[D78](../../../set-base-decisioni.md#decisioni-del-proprietario), D182. I dubbi di traduzione sono numerati nel
[rapporto](../../../reports/set-base/sb-28-report.md#fase-a) (Dn).

## 1. Da RP-n alla regola 2.0

| RP | Contenuto | Regola 2.0 | Note |
|---|---|---|---|
| RP-1 | Chi è a terra non colpisce, gruppi di velocità, salvataggio in extremis | R04 (punti 3–4, «Chi è a terra non colpisce»); R01 (definizione di «a terra») | Sostituisce la frase 1.14 «continua anche se l'autore muore prima di agire» |
| RP-2 | Costi pagati solo con quello che si ha; costo in HEALTH mai fino a 0 | R03 («Costi pagati con quello che si ha»); R04 punto 2 | |
| RP-3 | «Ultimo colpo» | R07b «Ultimo colpo»; richiamato da R03 e R04 | Nessuna carta del Set Base 1.0 lo usa (D3 del rapporto) |
| RP-4 | Pavimento a zero | R01 («Pavimento a zero»); R05; R06 («HEALTH a 0») | Cade la frase 1.14 «le risorse possono essere negative» |
| RP-5 | Nessuno spareggio | R06 («Nessuno spareggio») | |
| RP-6 | Corazza dell'alcol, L/4 sui HIT | R05 («Corazza dell'alcol»); R01 (L come corazza) | |
| RP-7 | Timer simultanei in ordine di creazione (P4) | R06 punto 3 | Cade la frase 1.14 «Nessuna precedenza garantita fra timer simultanei» |
| RP-8 | La ricerca sostituisce la pesca | R02a (introduzione, punti 1 e 4); R02 | |
| RP-9 | Cercano regolari, bound e last resort; non basic né oggetti | R02a punto 2 | |
| RP-10 | Si cercano solo carte da mano; binding esatti, uno o due | R02a punto 3; R07b Annuncia punto 1 | Il rifiuto del caricatore va nel formato (sezione 3) |
| RP-11 | Carta di ricerca scartata da una bound | R02a punto 6 | |
| RP-12 | Casi limite coperti dai test di SB-16c | R02a punti 1, 4, 6 e ultimo paragrafo | I nomi dei test restano nei test e nel rapporto di SB-16c |
| RP-13 | Annuncia X, Annuncia X o Y, scelta del giocatore, mazzo immutato fino alla ricerca | R07b Annuncia punto 1; R03 (scelta nella mossa); R02a punto 7 | |
| RP-14 | Se la trovi: mostrata, premio, gettone ×1,5 | R07b Annuncia punto 2; R07b Vulnerabile punto 1 | |
| RP-15 | Quale gettone si soddisfa (D180) | R07b Vulnerabile punto 3 | |
| RP-16 | Fine del gettone soddisfatto | R07b Vulnerabile punto 4; R06 punto 4 | D2 del rapporto |
| RP-17 | Uscita senza giocare | R07b Vulnerabile punto 5 | L'avviso del client resta nel testo (D7) |
| RP-18 | Carta mostrata | R07b Annuncia punto 5 (con D179) | |
| RP-19 | Se non la trovi: ripiego | R07b Annuncia punto 3 | |
| RP-20 | Più annunci: fattori moltiplicati | R07b Vulnerabile punto 2 | D1 del rapporto: troncamento per passo, come il motore |
| RP-21 | Gettoni e carte mostrate tolti a fine partita, eliminazione, forfait; «∞» | R06 (paragrafo finale); R07b Vulnerabile punto 7 | |
| RP-22 | Formato: `foundGains`, `missedGains`, `turnsIfNotFound`, `cards` | **Formato del file del set** (sezione 3) | Non è una regola del gioco |
| RP-23 | Premio con due nomi; registro e vista pubblica; scelta nella mossa | R07b Annuncia punti 4 e 7; R03; R08 | I nomi dei campi (`search.card`…) vanno nel formato o in `docs/api.md` |
| RP-24 | Il mazzo si mischia dopo ogni ricerca | R02a punto 5; R02 | L'impostazione `rules.searchShuffle` va nel formato (sezione 3) |
| RP-25 | Vendere è prendere senza l'effetto | R07b Vendi; R04 (eccezione del ricavato) | Vendi è una parola chiave nuova nella lista (D4) |
| RP-26 | Formato del passo `vendi` | **Formato del file del set** (sezione 3) | La «deroga del playground» del caricatore cade: R03 non la richiede |
| RP-27 | Oggetti con un effetto «In campo» | R07b In campo; R06 punto 5; R01a (carta oggetto) | Non è più una deroga a R02 per carta: è la parola chiave |
| RP-28 | Formato del campo `inPlay` | **Formato del file del set** (sezione 3) | |
| RP-29 | Il timer di «Mescolone Micidiale» toglie anche Vulnerabile | R07b Vulnerabile punto 6 (regola generale: chi toglie tutti gli stati toglie i gettoni) | Il caso della carta resta nella sua scheda (OGG-04), che lo dice già |

Le altre parti del documento del playground:

| Sezione | Dove va |
|---|---|
| 4, Gioca d'anticipo (punti 1–7) | R07b Gioca d'anticipo; il passo `anticipo` nel formato |
| 4, Rincara | R07b Rincara; R08 (contatore pubblico); `perPlay` nel formato |
| 4, Le altre (D78: come nasce una parola chiave) | R00 («Parole chiave») |
| 5, Principi di composizione (D52, D60–D63) | Non sono regole di partita: restano vincoli di progetto del set nelle decisioni, fuori dal regolamento |
| 6, Bot e misura | Non sono regole: restano nel playground e nei rapporti; il collegamento dei bot alla partita viva è di SB-30 |
| 7, 8 | Storiche: nessun contenuto normativo |
| Interruttore `Ruleset` (`1.13` / `d50`) | Codice, Fase B: le regole `d50` diventano quelle vive; `1.13` resta per le partite archiviate e le misure storiche |

Dalla 2.0 il documento del playground diventa storico (R09 lo dice). Il suo «Ambito» va aggiornato in Fase B, quando la 2.0 entra in vigore.

## 2. Regole 1.14 che cambiano o spariscono

| Regola 1.14 | Cosa cambia nella 2.0 | Perché |
|---|---|---|
| Intestazione | Versione 2.0; riquadro «candidata» da togliere al passaggio | SB-28 |
| R00 | Aggiunto il paragrafo «Parole chiave (2.0)» | D78 (2), (3) |
| R01, risorse | **Sparisce** «Non esistono tetti o pavimenti generali: le risorse possono essere negative»; restano solo i tetti assenti. Entra «Pavimento a zero» con la definizione di «a terra». L'ALCOHOL è anche corazza | RP-4, RP-6, D50 (3), (5) |
| R01, immunità | La frase si **sposta** in R07b («Immune»), con lo stesso significato; R01 rimanda | Parola chiave definita una volta (D78) |
| R01, quick | **Nessun cambio di testo**: «fra quelli indicati dal documento del set». D182 (1) (cinque starter a caso) si attua elencando nel documento del set i cinque starter | D182 (1) |
| R01a | Carta oggetto: salvo «In campo». Token oggetto: distinto dal gettone | RP-27; D5 del rapporto |
| R02 | La pesca dopo la mossa può essere sostituita dalla ricerca; il mazzo si mischia dopo una ricerca (gli scarti restano fuori) | RP-8, RP-24 |
| R02, mazzi salvati | **Nessun cambio di regola.** D182 (3) (mazzi con carte uscite cancellati) è un'operazione sui dati del passaggio, citata nella revisione 2.0 | D182 (3) |
| R02a | **Nuova:** ricerca al posto della pesca | RP-8…RP-12, RP-24 |
| R03 | Costi pagati con quello che si ha (HEALTH > costo), salvo «Ultimo colpo»; scelta del nome per «Annuncia X o Y» | RP-2, RP-3, RP-13, RP-23 |
| R04, punti 2–5 | Costi col pavimento; gruppi di velocità; annullamento a inizio gruppo; ricerca al posto della pesca | RP-1, RP-2, RP-8 |
| R04, autore morto | **Sparisce** «Una mossa già presentata continua anche se l'autore muore prima di agire o durante il proprio effetto». La sostituisce «Chi è a terra non colpisce»: la mossa continua se l'autore cade durante il proprio effetto o nel proprio gruppo; il salvataggio in extremis (D48) resta per le mosse su di sé | RP-1, D50 (1), D48 |
| R04, mossa annullata | Aggiunto: non cerca | RP-8, RP-12 |
| R04, oggetto scomparso | Aggiunta l'eccezione della vendita (il ricavato non è un «altro effetto») | RP-25 |
| R05 | Corazza dell'alcol nel percorso del danno; pavimento nelle variazioni; il gettone è uno stato | RP-4, RP-6, RP-14 |
| R06, punto 3 | **Sparisce** «Nessuna precedenza garantita fra timer simultanei»: ordine di creazione | RP-7, D50 (7) |
| R06, punto 4 | Con gli stati cadono i gettoni Vulnerabile finiti | RP-16, RP-17 |
| R06, punto 5 | **Nuovo:** effetti «In campo» | RP-27 |
| R06, esito | «HEALTH <= 0 significa morto» diventa «HEALTH a 0 significa morto»; nessuno spareggio; gettoni e carte mostrate tolti a fine partita, eliminazione e forfait | RP-4, RP-5, RP-21 |
| R07 | Le schede usano le parole chiave di R07b e rimandano «regolamento, Rnn» | D170 (2), D78 |
| R07b | **Nuova:** parole chiave | D78; RP-3, RP-13…RP-21, RP-23, RP-25, RP-27, RP-29, sezione 4 |
| R08 | Carte mostrate, gettoni, esito delle ricerche, anticipo e contatore di Rincara pubblici | RP-14, RP-18, RP-23, sezione 4 |
| R09 | Le regole del playground diventano fonte storica | SB-28 |
| R01a (token), R05 (isolamento), R07 (rarità), R07a, R06 (clock, riavvio) | Invariate | — |

Nessuna regola 1.14 sparisce per intero: spariscono le tre frasi segnate sopra (risorse negative, autore morto che agisce, timer senza
precedenza).

## 3. Regole del formato del file del set (RP-22, RP-26, RP-28)

Non sono regole del gioco: dicono come il file del set scrive una carta e che cosa il caricatore accetta. **Dove:** una pagina
`docs/formato-file-set.md`, scritta nella Fase B quando il file del set e il caricatore passano in produzione, con un rimando da R07
(«il formato del file del set è descritto in …»). Fino ad allora restano in [regole-playground.md](../regole-playground.md).
Alternativa: commento di classe di `BozzaDraft` e `BozzaCardFactory`, senza pagina (domanda 2 del rapporto). Il testo da portare:

- **Ricerca (RP-22, RP-10, RP-24).** Passo `search` con `card` (un binding) o `cards` (due binding distinti, nell'ordine stampato),
  mai entrambi; il caricatore rifiuta un binding che è un oggetto. Facoltativi `foundGains` e `missedGains`, mappe di risorse non
  negative: si applica solo la mappa dell'esito, dopo la ricerca; senza queste mappe la ricerca conserva i guadagni esterni.
  `vulnerability` (`factor`, `damage`) descrive il gettone di Annuncia. `turnsIfNotFound` resta leggibile per le bozze storiche e non
  crea gettoni. L'impostazione `rules.searchShuffle` (falsa se manca) mischia il mazzo dopo ogni ricerca: il Set Base 1.0 la mette a
  vero; le bozze storiche non la hanno.
- **Vendita (RP-26).** Passo `vendi` con la sola lista `seHai` di soli `gain`, `lose`, `say` (il ricavato); solo in `self`, una volta,
  in una carta ACTION regolare o basic, con bersaglio solo `NEAR_ITEM`; non dentro `anticipo` né `gettone`, mai insieme a `consume`;
  rifiutato nelle bound, nelle last resort, negli oggetti e col campo `seNo`. L'oggetto arriva dal campo `TARGET_ITEM` della mossa.
- **In campo (RP-28).** Campo facoltativo `inPlay` di una carta `ITEM`: uno o due passi `lose` (A o V) o `gain` (T o L), quantità
  fissa; rifiutati fuori dagli oggetti, ogni altro passo, HEALTH e quantità variabili; richiede il testo breve `gui.inPlay`, rifiutato
  quando il campo manca. Registro: `(Nome) RISORSA: prima->dopo (differenza)`. La vista della carta porta `inPlay` solo se c'è.
- **Gioca d'anticipo e Rincara (sezione 4).** Passo `anticipo` con passi annidati (`steps`), senza ricerche, consumi né altri
  anticipi; la mossa pubblica porta `ahead`. `perPlay` dentro un importo (`{"base": 10, "perPlay": 5}`), 0 se manca; la mossa
  pubblica porta `plays`.
