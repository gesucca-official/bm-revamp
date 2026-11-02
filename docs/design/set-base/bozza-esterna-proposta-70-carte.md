> **Bozza esterna, conservata come serbatoio di idee.** Copia invariata di una proposta precedente. Non è normativa, non è approvata e non si tiene aggiornata: dove contrasta col [piano del Set Base](../../set-base-plan.md#bozza-esterna-di-carte) prevale il piano, e le sue carte entrano nel set solo passando dai blocchi del piano.

# Botte Micidiali — Proposta del primo Set Base

Documento di progettazione raccolto dalla conversazione il 2 novembre 2026.

**Stato: proposta da revisionare, non ancora approvata o implementata. Il bilanciamento non è validato.**

Le 70 carte complessive costituiscono il **primo Set Base**, non un'espansione separata. Il progetto conserva le 39 carte esistenti e propone 31 nuove carte. Copie e token generati sono esclusi dal conteggio. Questo documento raccoglie le nuove schede proposte e i relativi starter; non riproduce tutte le schede delle 39 carte esistenti.

Riferimenti della proposta originale: `E:\bm\AGENTS.md`, regolamento autorevole `docs/game-rules.md` versione 1.5, `docs/rules-catalog.json` e catalogo SQLite. Questi riferimenti descrivono quanto consultato durante la progettazione, non una nuova verifica dello stato attuale della repository.

## Convenzioni e regole applicate

- H = HEALTH; A = ALERTNESS; V = VIOLENCE; T = TOXICITY; L = ALCOHOL.
- P = priorità: prevale il valore maggiore; a parità conta A dopo il pagamento dei costi. L'ordine resta poi fissato.
- Danni e valori sono precedenti ai modificatori. Le risorse seguono R05, senza nuovi tetti o pavimenti.
- Una basic non costa risorse o scarti aggiuntivi e rimane in mano.
- Una bound non costa risorse, richiede lo scarto di un'altra carta ammessa da R02 e rimane in mano. Una bound annullata non scarta la carta aggiuntiva.
- Le azioni regolari vengono scartate dopo l'uso.
- Durata 0: turno corrente. Durata 2: turno corrente e due successivi. I modificatori numerici troncano secondo R05.
- Le associazioni ai personaggi indicano identità tematica e starter; non introducono vincoli di compatibilità assenti dai mazzi personalizzati attuali.
- Tutte le nuove azioni regolari e tutti gli oggetti sono utilizzabili da qualsiasi personaggio.
- Per tutti e tre i nuovi starter la last resort è Struggle, già esistente.

## 1. Pino l'Ultimo Giro

**Concept:** frequentatore del bancone, lento e resistente, entra nella rissa già alticcio. Accumula ALCOHOL per spenderlo nelle mosse; non converte automaticamente l'alcol in danno.

| Tipo | H | A | V | T | L | Capacità oggetti | Immunità iniziali |
|---|---:|---:|---:|---:|---:|---:|---|
| Personaggio | 110 | 15 | 10 | 0 | 10 | 2 | Effetto periodico di ALCOHOL |

L'immunità impedisce il calo periodico di A e L, non i costi o le variazioni di L né i danni POISON. Nessun'altra capacità passiva.

| Nome | Tipo / sottotipo | Associazione | Costo | P | Bersaglio | Effetto in ordine |
|---|---|---|---|---:|---|---|
| Questo lo finisco io | Azione / basic | Pino | — | 0 | Oggetto vicino | A sé: +5 L; poi consuma come Grab. Il +5 L avviene anche se l'oggetto è scomparso prima della risoluzione. |
| Cinque minuti e vado | Azione / bound | Pino | Scarto bound | 1 | Avversario | A sé: +5 L; poi 5 HIT al bersaglio. |
| Il bancone regge, io pure | Azione / bound | Pino | Scarto bound | 2 | Sé | Aggiunge stato GOOD INPUT: HIT ricevuto ×0,75, durata 0; poi +5 L. Non riduce CUT o POISON. |

Le bound generano alcol consumando scarti disponibili. L generata durante la risoluzione non può pagare la mossa già presentata.

## 2. Mara Contromano

**Concept:** rider che ha lasciato la bici contro il muro. Cerca la precedenza, colpisce di taglio e consuma oggetti prima che vengano sottratti. Spende A rischiando di perdere il proprio vantaggio di velocità.

| Tipo | H | A | V | T | L | Capacità oggetti | Immunità iniziali |
|---|---:|---:|---:|---:|---:|---:|---|
| Personaggio | 85 | 40 | 10 | 0 | 0 | 2 | Nessuna |

Nessuna schivata automatica, immunità ai danni o altra capacità passiva.

| Nome | Tipo / sottotipo | Associazione | Costo | P | Bersaglio | Effetto in ordine |
|---|---|---|---|---:|---|---|
| Preso al volo | Azione / basic | Mara | — | 2 | Oggetto vicino | A sé: −10 A; poi consuma come Grab. Perde A anche se l'oggetto è scomparso. La perdita è un effetto: non modifica l'ordine già fissato. |
| Passo stretto | Azione / bound | Mara | Scarto bound | 1 | Avversario | A sé: +5 A; poi 3 CUT al bersaglio. |
| Tra due paraurti | Azione / bound | Mara | Scarto bound | 2 | Sé | Aggiunge due stati GOOD INPUT: HIT ricevuto ×0,75 e CUT ricevuto ×0,75, entrambi durata 0. Nessuna protezione da POISON. |

La basic non garantisce precedenza contro altre mosse di priorità 2. Le difese mitigano, senza annullare mosse.

## 3. Gigi del Carro Attrezzi

**Concept:** meccanico chiamato per la macchina sbagliata. Costruisce V con piccoli colpi, mantiene più oggetti vicino a sé e smonta quelli degli altri. Gli equip richiedono il normale consumo degli oggetti.

| Tipo | H | A | V | T | L | Capacità oggetti | Immunità iniziali |
|---|---:|---:|---:|---:|---:|---:|---|
| Personaggio | 100 | 25 | 15 | 0 | 0 | 3 | Nessuna |

Nessun bonus automatico dagli oggetti sul campo e nessun'altra capacità passiva.

| Nome | Tipo / sottotipo | Associazione | Costo | P | Bersaglio | Effetto in ordine |
|---|---|---|---|---:|---|---|
| Questo torna utile | Azione / basic | Gigi | — | −1 | Oggetto vicino | A sé: −5 A, poi +5 V; infine consuma come Grab. Entrambe le variazioni avvengono anche se l'oggetto è scomparso. |
| Una stretta e passa | Azione / bound | Gigi | Scarto bound | 1 | Avversario | A sé: +5 V; poi 3 HIT al bersaglio. |
| Smontiamo tutto | Azione / bound | Gigi | Scarto bound | 0 | Oggetto lontano | Ricontrolla e distrugge l'oggetto scelto senza applicarne gli effetti. Se scomparso, non distrugge altro; lo scarto bound rimane speso. |

Smontiamo tutto distrugge oggetti sul campo, non equip già attivati. Per questi rimane rilevante BadEducation.

## 4. Tredici azioni regolari comuni

Tutte: tipo **Azione**, sottotipo **Regolare**, nessuna associazione esclusiva. Effetti immediati, salvo stati descritti. Scarto dopo l'uso.

| Nome | Costo | P | Bersaglio | Effetto preciso |
|---|---|---:|---|---|
| Mattone del cantiere | 10 V | 0 | Avversario | 18 HIT. |
| Chiave da tredici | 5 V | 1 | Avversario | 8 CUT. |
| Cinghiata di traverso | 10 A | 1 | Avversario | 12 CUT. |
| Rincorsa dal marciapiede | 10 A | 0 | Avversario | A sé: +10 V; poi 15 HIT al bersaglio. |
| Testata da ultimo giro | 10 L | 1 | Avversario | A sé: 5 HIT; poi 25 HIT al bersaglio, anche se l'autodanno uccide l'autore. |
| Rutto a distanza sociale | 5 L | 1 | Avversario | Il bersaglio perde 10 A, poi riceve 5 HIT. |
| Oh, guarda là | 5 A | 2 | Avversario | Il bersaglio perde 10 A. Non annulla o riordina la sua mossa corrente. |
| Denti stretti | — | 0 | Sé | −5 A, poi +10 V. |
| Tartaruga sul marciapiede | 5 A | 2 | Sé | Due stati GOOD INPUT: HIT ricevuto ×0,60 e CUT ricevuto ×0,60, entrambi durata 0. |
| Due dita in gola | — | 1 | Sé | Subisce 5 HIT, poi azzera T e L con l'operazione di svuotamento di R05. Non rimuove stati, timer o immunità. |
| Fasciatura col fazzolettaccio | 5 A | 0 | Sé | Perde 5 V, poi guadagna 10 H. La perdita di V è un effetto, non un requisito: può portarla sotto zero. La cura può superare H iniziale. |
| Sputo da posacenere | 5 T | 1 | Avversario | 5 POISON. Non aggiunge T. |
| Parli troppo vicino | 5 V + 5 A | 2 | Avversario | 5 HIT, poi il bersaglio perde 5 A. Non annulla la sua mossa. |

Due dita in gola esegue gli svuotamenti anche con autodanno letale, coerentemente con R04.

## 5. Sei oggetti comuni

Tutti: tipo **Oggetto**, nessun sottotipo speciale, nessuna associazione esclusiva. Entrano sul campo alla pesca, occupano capacità e non si attivano alla sola pesca.

**Costo proprio:** nessuno. **Priorità:** quella dell'azione che li consuma. **Destinatario:** il consumatore.

| Nome | Effetto preciso del consumo |
|---|---|
| Amaro nel bicchiere di plastica | +20 L, poi −5 A. |
| Espresso del distributore | +15 A, poi +5 T. |
| Panino del kebab dimenticato | +10 H, poi +5 T. Nessun nuovo limite alla cura. |
| Mezza minerale sgasata | Azzera L. Non modifica T, A, immunità, stati o timer. |
| Guanti da officina | Aggiunge equip GOOD OUTPUT: HIT inflitti ×1,25, senza conversione, durata 2. Non singleUse. |
| Giubbotto di finta pelle | Aggiunge equip GOOD INPUT: CUT ricevuti ×0,75, durata 2. Non riduce HIT o POISON. Non singleUse. |

Ogni applicazione di equip crea uno stato indipendente. Si accumulano secondo R05 e sono rimovibili da BadEducation. Non si introducono slot equip o divieti di accumulo. La capacità degli oggetti limita il campo, non gli equip già attivati.

Gli effetti sono da collocare nell'effetto sul consumatore chiamato da Grab: non richiedono di cambiare la regola che esclude la logica speciale dell'oggetto dal consumo tramite Grab.

## 6. Mazzi preconfigurati

Ogni starter ha **20 carte regolari: 14 azioni e 6 oggetti**. Personaggio, basic, due bound e last resort sono predisposti separatamente. Gli identificatori delle carte preesistenti sono quelli usati nel regolamento originale consultato.

### Pino — Chiude quando dico io

| Carta regolare | Tipo | Copie |
|---|---|---:|
| Testata da ultimo giro | Azione | 2 |
| Rutto a distanza sociale | Azione | 2 |
| Rincorsa dal marciapiede | Azione | 2 |
| Denti stretti | Azione | 2 |
| Mattone del cantiere | Azione | 2 |
| CantFeelAnything | Azione esistente | 2 |
| GoingBerserk | Azione esistente | 2 |
| Amaro nel bicchiere di plastica | Oggetto | 2 |
| RottenBeer | Oggetto esistente | 2 |
| CocktailOnTheGround | Oggetto esistente | 2 |
| **Totale regolari** | | **20** |

Slot separati: Pino; **Questo lo finisco io** (basic); **Cinque minuti e vado** e **Il bancone regge, io pure** (bound); **Struggle** (last resort).

### Mara — Consegna sul muso

| Carta regolare | Tipo | Copie |
|---|---|---:|
| Cinghiata di traverso | Azione | 2 |
| Chiave da tredici | Azione | 2 |
| Oh, guarda là | Azione | 2 |
| Tartaruga sul marciapiede | Azione | 2 |
| Parli troppo vicino | Azione | 2 |
| Steal | Azione esistente | 2 |
| ShuffleFeet | Azione esistente | 2 |
| Espresso del distributore | Oggetto | 2 |
| Mezza minerale sgasata | Oggetto | 2 |
| Panino del kebab dimenticato | Oggetto | 2 |
| **Totale regolari** | | **20** |

Slot separati: Mara; **Preso al volo** (basic); **Passo stretto** e **Tra due paraurti** (bound); **Struggle** (last resort).

### Gigi — Intervento sul posto

| Carta regolare | Tipo | Copie |
|---|---|---:|
| Mattone del cantiere | Azione | 2 |
| Chiave da tredici | Azione | 2 |
| Rincorsa dal marciapiede | Azione | 2 |
| Denti stretti | Azione | 2 |
| BreakYourToy | Azione esistente | 2 |
| BadEducation | Azione esistente | 2 |
| Grab | Azione esistente | 2 |
| Guanti da officina | Oggetto | 2 |
| Giubbotto di finta pelle | Oggetto | 2 |
| Espresso del distributore | Oggetto | 2 |
| **Totale regolari** | | **20** |

Slot separati: Gigi; **Questo torna utile** (basic); **Una stretta e passa** e **Smontiamo tutto** (bound); **Struggle** (last resort).

Gli starter preesistenti di Bruiser e Junkie restano invariati. Il Set Base comprende quindi cinque personaggi con i rispettivi starter.

## 7. Sinergie, contromosse e rischi di bilanciamento

| Area | Sinergie e contromosse | Rischio da verificare |
|---|---|---|
| Pino | Alimenta GoingBerserk e le nuove mosse a costo L. HealingBlow azzera il carburante. CUT e POISON aggirano la sua bound difensiva. | Immunità L e generazione ripetibile potrebbero rendere troppo affidabili i 30 HIT di GoingBerserk. Considerare bassa A e consumo degli scarti. |
| Mara | Consuma oggetti prima di molte mosse di furto/distruzione. StunningBlow, RottenSmile e alcol erodono A; POISON ignora le difese. | A iniziale 40 può rendere YouStop e WhatchaDoin troppo affidabili. I costi in A riducono però la precedenza già al pagamento. |
| Gigi | Equip e generazione V sostengono i colpi esistenti. Grab regolare è più rapido della sua basic. Furti, ShuffleFeet e distruzione disturbano il campo; BadEducation rimuove equip. | Distruzione ripetibile tramite bound potenzialmente oppressiva contro mazzi basati sugli oggetti, soprattutto in 1v1. |
| Cure e pulizia | Due dita in gola contrasta T; Fasciatura converte risorse e tempo in salute. Junkie sfrutta panino ed espresso grazie all'immunità periodica T. | La pulizia gratuita potrebbe indebolire troppo le strategie di tossicità. Junkie ha già PervertedMetabolism, ma gli altri ottengono una risposta autonoma. |
| Equip | Guanti e BrokenBeerBottle dipendono dall'ordine: la conversione in CUT può impedire modificatori HIT successivi. Giubbotto contrasta CUT anche da conversione. | Accumuli e troncamenti possono produrre danni o protezioni estremi con molte copie. Nessun limite implicito proposto. |
| FFA e costruzione libera | Difese applicate a tutte le mosse successive compatibili; bound utilizzabili anche su altri personaggi nei mazzi personalizzati. | Provare attacchi concentrati, bound incrociate, molte copie e mazzi quasi solo oggetti. Gli starter non coprono questi estremi. |

Il bilanciamento non è validato. V, A, T e L non sono risorse di valore automaticamente equivalente: contano disponibilità, effetti periodici, precedenza e generatori.

## 8. Supporto necessario e decisioni aperte

Gli effetti usano risorse, danni, stati, equip, bersagli e interazioni con oggetti già previsti. Non viene proposta una nuova regola generale per realizzarli. Serviranno comunque nuove classi, registrazioni di catalogo, descrizioni, immagini, starter e verifiche delle interazioni.

Supporto da assicurare nell'interfaccia:

- Distinguere immunità periodiche e danno POISON.
- Distinguere costi in A e perdite di A durante gli effetti.
- Rendere leggibili equip, moltiplicatori e scadenze; durata 2 include tre turni contando quello corrente.
- Distinguere oggetti sul campo ed equip attivi, con le rispettive contromosse.

**Modifica di regola da valutare separatamente:** nella versione consultata, R01 assegna casualmente soltanto Bruiser o Junkie nelle modalità quick. Includere i tre nuovi personaggi nella selezione casuale richiede un'estensione esplicita della regola. La presenza delle carte e degli starter nella proposta non costituisce approvazione automatica di questa modifica.

Non vengono introdotti esclusività delle bound, limiti di copie, slot equip o nuove modalità di passaggio. Eventuali scelte in tal senso sarebbero ulteriori modifiche di regolamento.

L'eventuale implementazione dovrà partire dall'aggiornamento versionato e motivato del regolamento, seguito nella stessa modifica da codice, test, descrizioni SQLite e copia client. Verifiche di progetto: `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`; l'avvio Spring completo rimane una verifica separata.

## 9. Conteggio del primo Set Base

| Tipologia / sottotipo | Esistenti | Nuove | Totale |
|---|---:|---:|---:|
| Personaggi | 2 | 3 | **5** |
| Azioni regolari | 26 | 13 | **39** |
| Azioni basic | 2 | 3 | **5** |
| Azioni bound | 4 | 6 | **10** |
| Azioni last resort | 1 | 0 | **1** |
| **Totale azioni (subtotale)** | **33** | **22** | **55** |
| Oggetti del catalogo | 4 | 6 | **10** |
| **Totale set** | **39** | **31** | **70** |

BrokenBeerBottle rimane il token generato esistente, escluso dal conteggio. Nessun nuovo token proposto. SoberUp resta fuori catalogo. Le copie negli starter non aumentano il numero di carte distinte.
