# SB-17 — Fase A4: Lo rivendo come basic di Sergio (proposta)

**16 novembre 2026, passo con proposta ([D117](../../set-base-decisioni.md#decisioni-del-proprietario)). STOP per il proprietario.**
Nessuna misura e nessun codice in questa fase. Si parte dallo stato in bozza dopo il giro 2 di D116: mazzo della B2, Lo rivendo
bound con R1, Spazienzio al 69,7% (scostamento dichiarato), gli altri incontri dentro D95
([rapporto B3, § 8](../../reports/set-base/sb-17-b3-report.md#8-giro-sul-mazzo-intermedio-d116)).

## 1. Il quadro

L'idea del proprietario (D117): Sergio non usa gli oggetti, li rivende. La basic diventa la vendita, le bound diventano un colpetto
e una difesa leggera. Il kit di Sergio dopo la A4:

| Slot | Oggi | Dopo la A4 |
|---|---|---|
| CES-BA (basic) | Lo metto in conto: +5 A, poi consuma un proprio oggetto (pr. 1) | **Lo rivendo**: vende un proprio oggetto bersagliato, **+6 HEALTH** (pr. 1) |
| CES-BO2 (bound) | Battutina: 3 HIT (pr. 1) | invariata |
| CES-BO3 (bound) | Lo rivendo: vende un oggetto scelto, +5 / +2 HEALTH (pr. 0) | **Fare il vago** (nome di lavoro): HIT e CUT ricevuti **×0,75** in questo turno (pr. 2) |
| CES-BO1 (collezione) | Mi informo: +8 A | invariata, nella collezione |
| Lo metto in conto | basic | **esce dalla bozza** (§ 2.4) |

Le carte d'archetipo, la salute (85) e la last resort non cambiano. Il conto delle carte resta 93: Lo metto in conto esce, entra
Fare il vago. I nomi restano di lavoro fino a SB-24 (D113 (3)); «Fare il vago» riprende il nome della difesa che Sergio aveva in
Fase A ([griglia, CES-AR5](griglia.md#azioni-darchetipo-43)).

Confine: gli oggetti col malus per chi li ha in campo e le carte che anticipano o rubano risorse sono di SB-19 (D117 (3)). Qui gli
oggetti del mazzo di prova restano quelli di oggi; con la basic di vendita i futuri oggetti col malus avranno in Sergio un cliente
naturale, ma non si progettano ora.

## 2. Lo rivendo come basic

### 2.1 Effetto

> **Lo rivendo** (CES-BA, basic, pr. 1, bersaglio: un proprio oggetto). Vendi l'oggetto: esce dal campo **senza il suo effetto**.
> +6 HEALTH a sé.

- **Bersaglio `NEAR_ITEM`**, come Lo metto in conto e tutte le basic (R03 permette alle basic di bersagliare oggetti; il vincolo è
  solo su bound e last resort). Il giocatore sceglie l'oggetto col bersaglio, come oggi per ogni basic: nessuna scelta in più.
- **Senza oggetti non si gioca**, come ogni basic (R03: l'oggetto richiesto deve esserci). Il ramo «senza oggetti» (+2 HEALTH) non
  serve più: esisteva solo perché una bound deve restare sempre giocabile.
- **Oggetto sparito alla risoluzione** (rubato, distrutto, scalzato dalla capacità): nessuna vendita e **nessun guadagno**; il
  registro dice «Nothing to sell». Il guadagno è il ricavato della vendita, non un «altro effetto» della carta nel senso di R04:
  senza merce non c'è ricavato. È diverso da Lo metto in conto, dove i +5 A arrivavano comunque (domanda 3).
- Priorità **1**, quella di Lo metto in conto: la vendita arriva prima di Steal (pr. 0); contro Smontiamo tutto (pr. 1) decide la
  A dopo i costi.

### 2.2 Prezzo rispetto alle basic degli altri

Le basic di oggi danno **il tratto più l'effetto dell'oggetto**; Lo rivendo dà un ricavato fisso e butta l'effetto. Unità del
banco (D33: HEALTH 1, V 0,75, A 0,5, L 0,35, T 0,15):

| Basic | Tratto | Unità del tratto | Più l'oggetto? |
|---|---|---:|---|
| ADOPERIAMOTI (Spazienzio, pr. −1) | nessuno, lenta | 0 | sì |
| Preso al volo (Mara, pr. 2) | −5 A | −2,5 | sì |
| Desiderio Incontrollabile (Celestina, pr. 1) | +5 T | 0,75 | sì |
| Questo lo finisco io (Piera, pr. 0) | +5 L | 1,75 | sì |
| Questo torna utile (Beppe, pr. 0) | +4 V | 3 | sì |
| Lo metto in conto (Sergio oggi, pr. 1) | +5 A | 2,5 | sì |
| ROC-BA (Duccio, da fare) | +3 HEALTH | 3 | sì |
| **Lo rivendo (Sergio, pr. 1)** | +6 HEALTH | **6** | **no** |

Sul mazzo di prova (Santino ×1, Espresso ×2) Lo metto in conto valeva per Sergio 2,5 + 0,5 = 3 unità sul Santino e 2,5 + 7,5 = 10
sull'Espresso: in media **≈ 7,7** per oggetto. Lo rivendo a **+6** sta un po' sotto: tratto alto, ma niente oggetto, e il resto
della basic non cambia (gratuita, permanente, una mossa del turno). La scelta di +6 tiene conto di «un po' forte» (D117) e della
bound di difesa che arriva (§ 3). Il ricavato è **fisso** per ogni oggetto: vendere il Santino, che a Sergio non serve, rende quanto
vendere un Espresso. Il bot vende quindi il meno prezioso, e la regola di oggi resta (§ 5).

**Il conto della A.** La A è la moneta delle letture e Lo metto in conto ne portava molta: +5 A a giocata più i +15 A dell'Espresso,
circa **15 A a partita** al giro 2 di D116 (stima: 1,04 giocate a partita, 5 A più i 10 A medi dell'oggetto). Con Lo rivendo quella A non c'è più; le fonti restano i 30
iniziali, Oh, guarda là (+15 / +5) e la bound Mi informo, che però è nella collezione. È la variazione più grossa della A4 e va nella
direzione di «un po' forte». La variante con A è nella domanda 1.

### 2.3 Che cosa succede all'oggetto venduto

Esce dal campo **senza il suo effetto**, come con Lo rivendo bound (RP-25): va negli scarti come un oggetto consumato, ma nessuno
dei suoi effetti si applica, nemmeno immunità, equip o timer. Il registro scrive «Sold Item X» come oggi.

### 2.4 Lo metto in conto fuori dalla basic

R02 vuole **una sola basic fissa** per personaggio: Lo metto in conto non può restare nella collezione come seconda basic.
Due vie: (a) **eliminarla** dalla bozza; (b) rifarla come azione regolare, che sarebbe un Grab con +5 A (GEN-01 c'è già, gratuito).
Raccomando **(a)**: un Grab con A in più toglierebbe senso alla vendita nello stesso mazzo. Lo slot CES-BA passa a Lo rivendo.

Lo rivendo come basic deroga a **D3** («ogni basic è una presa di oggetti con un tratto personale»): resta una presa del proprio
oggetto, ma senza il suo effetto. La riga va scritta in griglia con la deroga di SB-17, al posto di quella su CES-BO3.

## 3. Una bound di difesa leggera

### 3.1 Effetto e priorità

> **Fare il vago** (CES-BO3, bound, pr. 2, bersaglio: sé). HIT e CUT ricevuti ×0,75 in questo turno.

- **Una funzione sola:** para per il solo turno corrente, senza guadagni (lezione 2 di SB-4 nella
  [scheda](schede-personaggi.md#cosa-insegna-sb-4-sulle-bound); la scheda di Sergio prevede già «una parata del turno» fra le sue
  bound, [§ 6](schede-personaggi.md#6-sergio-sommerso-cesira-la-malalingua--booster-concept-nuovo)). D52 (1), «nessuna parata
  pura», vale per le azioni regolari; una bound con una parata e un guadagno sarebbe a due funzioni.
- **Priorità 2**, come tutte le difese del set: arriva prima dei colpi a priorità 1 e 0, nello stesso gruppo delle mosse a 2
  (Ricatto, Lo sapevo, Tartaruga) secondo la A.
- **Niente POISON:** contro Celestina (38,2%, l'incontro più basso) non aiuta, ed è voluto: il veleno resta la risposta al lettore.
- **Tetto (D33/D36):** il banco delle bound para contro un colpo di prova da 10 HIT e conta 1 unità per HIT evitato. ×0,75 evita
  2,5 HIT: **2,5 unità**, sotto il tetto di 4, sotto Battutina (4) e sopra il vecchio ramo senza oggetti di Lo rivendo (2). ×0,6
  arriverebbe al tetto e sarebbe la Tartaruga gratis.

Deroga da scrivere in griglia: il principio approvato 3 della Fase A dice «bound senza parate». D117 chiede una bound di difesa
leggera; la deroga vale solo per CES-BO3, come quella di Lo rivendo che si ritira (§ 4).

### 3.2 Confronto con le difese della griglia

| Carta | Tipo | Costo | Pr. | Effetto nel turno | Altro |
|---|---|---|---:|---|---|
| Tartaruga sul marciapiede (GEN-13) | generica | 5 A | 2 | HIT e CUT ×0,6 | +3 HEALTH |
| Tra due paraurti (MAR-AR4) | Mara | 5 A | 2 | HIT e CUT ×0,4 | +5 A |
| Sotto il cofano (GIG-AR4) | Beppe | 5 V | 2 | HIT ×0,5, CUT ×0,75 | +5 V, +5 A |
| Il bancone regge, io pure (PIN-AR3) | Piera | — | 2 | HIT ×0,65, POISON ×0,5 | +5 L |
| NON GIOCARE COL COLTELLO NO (SPA-AR4) | Spazienzio | — | 0 | CUT ×0,5 per 4 turni | +10 V |
| GEN-11 (collezione) | generica | 10 V | 2 | HIT ×0,35 | — |
| **Fare il vago (CES-BO3)** | **bound** | **—, una carta scartata** | **2** | **HIT e CUT ×0,75** | **—** |

È la più debole per turno, ma **sempre in mano**: costa solo lo scarto di una carta. Contro i colpi grossi rende: 34 HIT di
GARGANTUESCO IMPATTO diventano 25, 24 di Lo sanno tutti diventano 18. Contro i colpetti quasi niente (3 HIT diventano 2). Il rischio
è il ciclo «parata ogni turno»: lo frena il costo dello scarto (la mano si consuma e il mazzo finisce prima) e il fatto che una
parata non fa danno. L'invariante «bound oltre il tetto» e la durata delle partite lo misurano.

## 4. Parate e contromosse nel mazzo di prova

Il mazzo di prova di oggi ([bozza di riferimento](bozza-di-riferimento.md#mazzo-di-prova-di-sergio-sommerso--prova-sergio)),
confrontato con gli starter (parate = difese del turno e equip di difesa; contromosse = annullamenti):

| Mazzo | Parate (copie) | Contromosse (copie) | Totale su 20 |
|---|---|---|---:|
| prova-sergio | Tartaruga ×2 | Ricatto ×2, Lo sapevo ×2 | 6 |
| Spazienzio | Tartaruga ×2, NON GIOCARE COL COLTELLO ×2 | FAI BASTA ×2 | 6 |
| Mara | Tra due paraurti ×2, Tartaruga ×1, Giubbotto ×1 | — | 4 |
| Celestina | — (Metabolismo Corrotto ×2 cura) | Riflessi ×2 | 2 (4 con le cure) |
| Piera | Il bancone regge ×2 | — | 2 |
| Beppe | Sotto il cofano ×1, Giubbotto ×2, Casco ×2 | — | 5 |

Il proprietario ha l'impressione di «poche parate». Nel mazzo le difese pure sono 2 su 20, come Spazienzio e meno di Mara e Beppe;
le contromosse (4) sono le più numerose del set, ma chiedono di leggere bene (Ricatto nel 18% delle partite, Lo sapevo nel 25% al
giro 2 della B2). **Con Fare il vago la parata è sempre in mano**: la sensazione dovrebbe sparire senza toccare il mazzo.

**Ritocchi del mazzo (20 carte, al più 2 copie).** Raccomando **un solo cambio**, legato alla basic e non alle parate:

| Esce | Entra | Perché |
|---|---|---|
| Espresso del distributore 2 → 1 | Santino della portinaia 1 → 2 | Con la vendita l'effetto non conta: il numero di oggetti resta 3 e la merce è la stessa. L'Espresso venduto è A buttata, e il bot lo vende quando è l'unico oggetto (41% delle vendite al giro 2 di D116). Con due Santino lo vende di rado, e il giocatore umano non è tentato di tenerlo per la Lo metto in conto che non c'è più. |

Tre oggetti come oggi: la diagnosi della B3 ([§ 5](../../reports/set-base/sb-17-b3-report.md#5-da-dove-viene-il-salto-diagnosi-4-semi-per-cella))
lega i salti di forza al numero di oggetti, quindi non lo cambio. Le Tartarughe restano 2; una terza parata nel mazzo (Tartaruga
in più al posto di Spintone) resta come variante per la domanda 4, da non provare insieme alla bound.

## 5. Che cosa resta di RP-25, RP-26 e D115 (2)

- **RP-25** si riscrive: la vendita è l'effetto di una **basic che bersaglia un proprio oggetto** (`NEAR_ITEM`), letta come ogni
  presa; R03 non ha bisogno di nessuna lettura, perché il vincolo sugli oggetti riguarda solo bound e last resort. Restano «senza il
  suo effetto» e «Sold Item X»; il ramo «senza oggetti» e il ripiego sul più vecchio cadono; con l'oggetto sparito nessun guadagno
  (§ 2.1). Versione **1.3** di [regole-playground.md](regole-playground.md), prima del codice.
- **RP-26** cade quasi tutta: il campo facoltativo `choices.TARGET_ITEM` su una carta che bersaglia sé non serve più. Il bersaglio
  d'oggetto di una basic passa già dal campo `TARGET_ITEM` che il validatore del comando accetta con `NEAR_ITEM` e che il client già
  propone per Lo metto in conto e le altre basic. Resta la riga sul formato: passo `vendi` con la sola lista `seHai` (o un guadagno
  diretto), solo in `self`, una volta, in una carta **basic** con bersaglio `NEAR_ITEM`; il caricatore torna a rifiutare `vendi`
  nelle bound, come `consume`.
- **D115 (2): il passo del client per la scelta dell'oggetto non serve più.** Con la basic l'umano sceglie l'oggetto come
  bersaglio, già oggi, nel profilo `bozza`. Si chiude senza codice del client e senza toccare `api`; si annota nel piano.
- **Griglia:** la deroga di SB-17 su CES-BO3 si ritira (la bound non usa più oggetti e non cura); entrano la deroga a D3 per CES-BA
  (§ 2.4) e quella al principio «bound senza parate» per CES-BO3 (§ 3.1); la nota ⁶ si riscrive.

## 6. Forma, codice dei bot, verifiche

**Forma: dati**, col passo `vendi` che c'è già, spostato nella basic.

- Lo rivendo: `{"basic": true, "priority": 1, "targets": ["NEAR_ITEM"], "self": [{"op": "vendi", "seHai": [{"op": "gain", "resource": "HEALTH", "amount": 6}]}]}`.
- Fare il vago: due `status` INPUT di turno (HIT e CUT, fattore 0,75, `turns` 0) e un `say`, come Tartaruga, in una carta BOUND.
  Da controllare se il caricatore ammette `status` nelle bound; se no, ammetterlo solo con durata 0 (una riga di `DataCards`).

**Codice da toccare** (nella deroga del playground, salvo i bot):

1. `DataCards` (`sim`): `vendi` legge l'oggetto dal bersaglio della mossa (`NEAR_ITEM`), non più dalla scelta su una carta SELF;
   i rifiuti del caricatore si invertono (basic sì, bound no); il ripiego sul più vecchio esce.
2. `BotView` (bot, fuori dalla deroga): oggi offre una sola mossa per scarto col proprio oggetto meno prezioso; con la basic offrirà
   una sola mossa di Lo rivendo, sul bersaglio meno prezioso per `StyleSupport.itemWorth`, a parità il più vecchio. Stessa regola,
   letta dal bersaglio.
3. `TurnForecast` e `ViewTable` (bot): tolgono dal campo l'oggetto bersagliato e applicano `seHai`; con l'oggetto sparito nulla.
   Il segno di ramo di `PrintedEffects` resta per `seHai`.
4. `StyleSupport` e stili: la difesa di una bound si legge come quella di una regolare (la consapevolezza del colpo letale, D76,
   già sceglie le parate); da controllare con un test che il bot giochi Fare il vago contro un colpo mostrato letale.
5. Test: `Sb17CardsTest` si riscrive per la basic (vendita del bersaglio senza effetto, oggetto sparito senza guadagno, rifiuti del
   caricatore, bot sul meno prezioso, previsione) e per la bound di difesa; `Sb17.CARDS` e le fedeltà contano Lo rivendo come basic
   e Fare il vago. Attesi cambiati solo per D117, dichiarati.

**Verifiche** ([aree protette](../../aree-protette.md)): le «Sempre» (`git diff --check`, `check-links.py`, `check-rules.py`,
`./scripts/build.ps1 -Task Test -Offline`); **passo 0 d'identità** sulla bozza prima di cambiarla (il codice della misura cambia);
`BotView`, `TurnForecast`, `ViewTable` e `StyleSupport` sono bot, fuori dalla deroga: **identità viva** (480.000 partite, impronte
della B3) e **`TestServerContext` con `verify-match-manifests.py`**; **fedeltà** `TurnForecastFidelityTest` e
`ViewTableFidelityTest` al 100% coi rami della basic nel campione; **mutazioni** sul guadagno con l'oggetto sparito, sul bot che
vende il più prezioso, sul caricatore che accetta `vendi` in una bound, sulla previsione senza la rimozione del bersaglio; bozza di
riferimento `--scrivi` e `--verifica`; `rarita-bozza.py --check`.

Fuori perimetro come nelle fasi B: regolamento, `docs/sets/`, catalogo, client, `api`.

## 7. Effetti attesi e giro corto

Partenza: giro 2 di D116 (Spazienzio 69,7%, Mara 63,4%, Beppe 58,0%, Piera 50,9%, Celestina 38,2%, specchio 46,4%).

| Incontro | Lo rivendo basic (−A, +HEALTH) | Fare il vago | Atteso |
|---|---|---|---|
| Sergio–Spazienzio | meno A per le letture: giù | i colpi grossi da 25–34 HIT pesano meno: su | circa fermo, rischio sopra il 69,7% |
| Sergio–Mara | giù | CUT ×0,75 su Sgommata e Cinghiata: su | fermo |
| Sergio–Beppe | giù | su (HIT e CUT) | fermo o un po' giù |
| Sergio–Piera | giù | su (HIT) | fermo |
| Sergio–Celestina | giù | niente contro POISON | **giù, rischio sotto il 35%** |
| Specchio | — | parate in entrambi i mazzi: partite più lunghe | patte e durata da guardare |

**Giro corto.** Lanciatore e semi della B2 ([run.ps1](../../reports/set-base/sb-17/run.ps1)), regole `d50`, 12 stili letali, 144 celle,
300 semi, 259.200 partite. Criteri D95 come nella B3: ogni incontro fra 35% e 65% sui soli euristici, patte ≤ 10%, durata ≤ 12 turni
fuori dallo specchio, invarianti e bound oltre il tetto a 0; Spazienzio passa se **non supera il 69,7%** (lo scostamento di oggi).

**Una riserva, scritta prima. R1:** se dopo il giro un incontro è fuori da un solo lato, il ricavato di Lo rivendo cambia di
**2 HEALTH nel verso che serve** (+6 → +4 se qualcuno è sopra, +6 → +8 se Celestina o un altro è sotto il 35%), e si rifà il giro.
Se ci sono incontri fuori da entrambi i lati, o fuori anche dopo R1: scostamento dichiarato e STOP. Le letture (non criteri):
partite e giocate di Lo rivendo, oggetti venduti, giocate di Fare il vago e quota contro un colpo mostrato, mazzo esaurito, A media
spesa a partita.

**Budget di orologio: 300 s.** Fattibilità 30, giro 120 (un giro di D116 ha preso 67 s), riserva R1 120, margine 30. Fuori budget
come nelle B: passo 0, identità viva, suite, contesto, mutazioni.

Poi una prova del proprietario col mazzo di prova, che chiude SB-17 (D113 (2)).

## 8. Domande al proprietario

1. **Ricavato della vendita:** +6 HEALTH (raccomandato: salute, che Sergio non trova altrove, e la A che perde lo rende meno forte)
   oppure un ricavato in A (+10 A, 5 unità), che tiene le letture finanziate ma rende la vendita un doppione di Lo metto in conto
   senza l'oggetto? **Raccomando +6 HEALTH.**
2. **Lo metto in conto:** eliminata dalla bozza (raccomandato), o rifatta come azione regolare nella collezione?
3. **Oggetto sparito alla risoluzione:** nessun guadagno (raccomandato: il ricavato è la vendita), o il guadagno arriva comunque
   come gli «altri effetti» di R04, come faceva Lo metto in conto con i +5 A?
4. **Bound di difesa:** Fare il vago, HIT e CUT ×0,75 nel turno, priorità 2, senza guadagni (raccomandato), oppure più leggera
   (×0,8, 2 unità) o con una piccola parte di risorsa (×0,8 e +2 A, due funzioni, fuori dalla lezione 2 di SB-4)? E il mazzo:
   solo Espresso 2 → 1 e Santino 1 → 2 (raccomandato), o anche una terza Tartaruga al posto di Spintone?
5. **Forma e giro:** dati col passo `vendi` spostato nella basic, codice dei bot e le verifiche della § 6, il passo del client di
   D115 (2) chiuso perché non serve più, giro corto con R1 (±2 HEALTH) e 300 s? **Raccomando sì.**
