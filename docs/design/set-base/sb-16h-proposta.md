# SB-16h — Proposta delle varianti della dimensione del mazzo (Fase A)

**Versione 0.1 — 14 novembre 2026.** Prima stesura della Fase A di
[SB-16h](../../set-base-plan.md#sb-16h--prova-esplorativa-della-dimensione-del-mazzo), chiesta da
[D81](../../set-base-plan.md#decisioni-del-proprietario). **Motivazione:** il proprietario vuole sapere se il gioco migliora con più
carte nel mazzo («se fosser 25? o 30? o un range fra 20 e 30?») prima di Sergio, Duccio e del bilanciamento del set intero, così che un
cambio di formato non costringa a rifare SB-17–SB-21. Nel passo 2 di SB-16g il mazzo si esaurisce nel 44–50% delle partite di
Celestina, Piera e Beppe e gli specchi lunghi finiscono spesso in patta: sono i due fenomeni su cui la dimensione agisce di più.

**Stato: proposta, STOP.** Nessuna attuazione, nessuna misura, nessuna partita simulata. Il regolamento non cambia: R02 1.12
([20 carte regolari, al massimo 2 copie](../../game-rules.md#r02--mazzo-mano-e-oggetti), D1) resta in vigore finché il proprietario non
sceglie un altro formato. Il proprietario approva varianti, composizioni (D45 punto 7) e budget; le domande sono in fondo.

Fonti lette: [piano](../../set-base-plan.md) (SB-16h, SB-23, regole dei mazzi, metodo di bilanciamento, D1, D45, D50, D61–D63, D68,
D76–D77, D79–D81, Q7); [R02](../../game-rules.md#r02--mazzo-mano-e-oggetti); [rapporto del passo 2](../../reports/set-base/sb-16g-2b2-report.md);
[liste D79](sb-16g-proposta.md#liste-complete-e-conto-delle-120-carte); [griglia](griglia.md); la bozza
`server/src/test/resources/set-base/bozza.json` e il banco in `server/src/test/java/com/gsc/bm/sim/` solo per il lavoro tecnico.

## 1. Varianti da misurare

| Variante | Carte regolari | Copie massime | Ruolo nella misura |
|---|---:|---:|---|
| **20/2** | 20 | 2 | Riferimento: liste D79 con le carte del passo 3, rimisurate nello stesso giro |
| **25/2** | 25 | 2 | Più grande e **più varia**: entrano titoli nuovi, le copie esistenti non cambiano |
| **25/3** | 25 | 3 | Più grande e **più costante**: nessun titolo nuovo, salgono a 3 copie solo carte presenti |
| **30/2** | 30 | 2 | Come 25/2, un passo oltre |
| **30/3** | 30 | 3 | Come 25/3, un passo oltre |

Le cinque varianti formano un disegno 2×2 (25 o 30 carte, 2 o 3 copie) più il riferimento. Le composizioni sono **annidate**:
25/2 è contenuta in 30/2 e 25/3 in 30/3 (sezione 2), così un andamento monotono da 20 a 30 si legge senza cambi di lista in mezzo.
A parità di dimensione, X/2 e X/3 confrontano **varietà contro costanza**, il cuore della domanda.

**Considerate e non proposte:**

- **20/3** (stessa dimensione, terza copia): isolerebbe l'effetto della copia, ma a 20 carte una terza copia obbliga a togliere titoli
  dalle liste D79, cioè a cambiare l'identità dello starter senza che la dimensione cambi. L'effetto della copia si legge già da
  25/2 contro 25/3. Si può aggiungere se il proprietario lo vuole (domanda 1).
- **40 o più:** escluso da D1, perché senza rimescolamento un mazzo così grande non arriverebbe mai alla last resort e aggirerebbe la
  pressione del mazzo che finisce.
- **Range 20–30 come variante del banco:** non è un mazzo, è una scelta del costruttore; si tratta come domanda di design nella
  sezione 3, con un braccio facoltativo che ne misura il nocciolo.

## 2. Composizione degli starter allargati

### Principi (da approvare)

1. **Fissi in ogni variante:** personaggio, basic, due bound e last resort come nelle liste D79 (R02 1.12).
2. **Il raro e il suo tutore restano a 1 copia.** Lo schema D61–D62 (2 caricamenti NC → 2 colpi NC; 1 tutore NC → 1 raro) resta
   riconoscibile in tutte le varianti: nelle X/2 è identico, nelle X/3 la coppia NC sale a **3 caricamenti → 3 colpi**, insieme, così
   il rapporto 1:1 di D61 non cambia. Il secondo raro di Celestina (Mescolone Micidiale) resta a 1.
3. **X/3: solo carte già presenti.** Nessun titolo nuovo. A 25/3 salgono a 3 la coppia NC (+2) e poi una carta per categoria (+3):
   - archetipo: la carta a 2 copie fuori dalla coppia con la rarità più bassa; a pari rarità quella che fa danno, perché le difese
     allungano le partite;
   - generiche: la generica a 2 copie con la rarità più bassa; a pari rarità quella che fa danno;
   - oggetti: l'oggetto a 2 copie con la rarità più bassa; a pari rarità quello che dà la risorsa principale del personaggio.

   A 30/3 tutte le carte a 2 copie salgono a 3; i posti che restano vanno alle carte a 1 copia (mai raro o tutore), prima le comuni, poi
   per tenere le proporzioni fra archetipo, generiche e oggetti. Steal resta a 1 dove si può, perché nel passo 2 è sotto il 10% di uso
   con Mara e Celestina.
4. **X/2: titoli nuovi, copie esistenti invariate.** Entrano solo generiche e oggetti **già scritti nella bozza** (sono in un altro
   starter), mai rari. L'archetipo non cresce: ogni starter usa già i suoi sei titoli d'archetipo, e con raro e tutore a 1 il massimo è 10
   copie (9 per Beppe). Criteri per scegliere i titoli, in ordine:
   1. pagabili con la risorsa del personaggio e coerenti con il suo triangolo;
   2. un ruolo che nello starter manca (cura, riempitivo sempre giocabile, presa per gli oggetti, difesa da un tipo di danno);
   3. niente carte che danneggiano chi le usa senza immunità (Pasticca, +12 T, fuori da Celestina) e niente oggetti di L fuori da Piera;
   4. a 25/2 due titoli a 2 copie e uno a 1; a 30/2 quel titolo sale a 2 e ne entrano altri due a 2.

   Se i titoli adatti finiscono (succede solo a Mara a 30/2), si riportano a 2 le carte che D79 aveva ridotto da 2 a 1.
5. **Pool limitato alla bozza.** Le 12 generiche e i 4 oggetti della griglia non ancora scritti (StunningBlow, CantFeelAnything,
   «Acqua in faccia»…) sono lavoro di SB-19: farli entrare qui vorrebbe dire progettare carte nuove in un blocco di formato (domanda 6).

### Liste per starter

Copie per variante; «—» = assente. Ruolo: **car** caricamento NC, **colpo** colpo NC cercato, **tut** tutore, **R** raro cercato.
In grassetto i valori che cambiano rispetto a 20/2.

**Spazienzio** (V e A)

| Titolo | Ruolo; rarità | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---|---:|---:|---:|---:|---:|
| GARGANTUESCO IMPATTO SUL TU | colpo; NC | 2 | 2 | **3** | 2 | **3** |
| SPEDIAMOTI DUNQUE IN O-AHIO | R | 1 | 1 | 1 | 1 | 1 |
| PAZIENZA: FINITA | car; NC | 2 | 2 | **3** | 2 | **3** |
| NON GIOCARE COL COLTELLO NO | difesa; C | 2 | 2 | **3** | 2 | **3** |
| FAI BASTA | contromossa; NC | 2 | 2 | 2 | 2 | **3** |
| TI FACCIO SPAZIO | tut; NC | 1 | 1 | 1 | 1 | 1 |
| GABBIANO DUNQUE VOLIAMOTI | generica, danno; C | 2 | 2 | **3** | 2 | **3** |
| Tartaruga sul marciapiede | generica, difesa; C | 2 | 2 | 2 | 2 | **3** |
| Mattone del cantiere | generica, danno; C | 1 | 1 | 1 | 1 | **2** |
| ORMALE GUARIAMOTI | generica; NC | 1 | 1 | 1 | 1 | 1 |
| Denti stretti | generica, risorse; C | 1 | 1 | 1 | 1 | **2** |
| Negroni Trovato per Terra | oggetto; C | 2 | 2 | **3** | 2 | **3** |
| Posacenere di vetro | oggetto; NC | 1 | 1 | 1 | 1 | **2** |
| Spintone | nuovo: riempitivo F0 | — | **2** | — | **2** | — |
| Panino del kebab dimenticato | nuovo: cura | — | **2** | — | **2** | — |
| Rincorsa dal marciapiede | nuovo: colpo a costo A, +5 V | — | **1** | — | **2** | — |
| Espresso del distributore | nuovo: +15 A | — | — | — | **2** | — |
| Casco da lavoro | nuovo: difesa da HIT | — | — | — | **2** | — |

Perché: Spazienzio non ha cure né un colpo gratuito; Rincorsa trasforma A in V, la sua economia. Espresso e Casco a 30/2 perché
Gabbiano, Mattone e Denti ci sono già e le altre generiche costano risorse che non usa.

**Mara** (A)

| Titolo | Ruolo; rarità | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---|---:|---:|---:|---:|---:|
| Cinghiata di traverso | R | 1 | 1 | 1 | 1 | 1 |
| Sgommata | colpo; NC | 2 | 2 | **3** | 2 | **3** |
| Sorpasso in curva | disturbo; C | 2 | 2 | **3** | 2 | **3** |
| Tra due paraurti | difesa; NC | 2 | 2 | 2 | 2 | **3** |
| Slalom d'avvicinamento | car; NC | 2 | 2 | **3** | 2 | **3** |
| Ti stringo la curva | tut; NC | 1 | 1 | 1 | 1 | 1 |
| Spintone | generica; C | 1 | 1 | 1 | **2** | **2** |
| Sputo da posacenere | generica, POISON; C | 2 | 2 | **3** | 2 | **3** |
| Tartaruga sul marciapiede | generica, difesa; C | 1 | 1 | 1 | **2** | **2** |
| Steal | generica; C | 1 | 1 | 1 | 1 | 1 |
| Espresso del distributore | oggetto, +15 A; C | 2 | 2 | **3** | 2 | **3** |
| Panino del kebab dimenticato | oggetto; C | 2 | 2 | 2 | 2 | **3** |
| Giubbotto di finta pelle | oggetto; C | 1 | 1 | 1 | 1 | **2** |
| Rincorsa dal marciapiede | nuovo: colpo a costo A | — | **2** | — | **2** | — |
| Grab | nuovo: presa F0, priorità 1 | — | **2** | — | **2** | — |
| Casco da lavoro | nuovo: difesa da HIT | — | **1** | — | **2** | — |
| Fasciatura col fazzolettaccio | nuovo: cura gratuita | — | — | — | **2** | — |

Perché: Rincorsa costa A come le sue carte; Grab aiuta a consumare cinque oggetti; il Casco copre l'HIT, mentre il Giubbotto copre solo
il CUT. Mara ha poche generiche adatte (quasi tutte le altre costano V): a 30/2 si riportano a 2 Spintone e Tartaruga, ridotti da D79.

**Celestina** (T, immune)

| Titolo | Ruolo; rarità | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---|---:|---:|---:|---:|---:|
| Dose in preparazione | car; NC | 2 | 2 | **3** | 2 | **3** |
| Tossicone Scatarrante | colpo; NC | 2 | 2 | **3** | 2 | **3** |
| Metabolismo Corrotto | risorse, cura; C | 2 | 2 | **3** | 2 | **3** |
| Riflessi Aumentati dalla Speed | contromossa; NC | 2 | 2 | 2 | 2 | **3** |
| C'è del sangue nella mia droga | R | 1 | 1 | 1 | 1 | 1 |
| Un assaggino | tut; NC | 1 | 1 | 1 | 1 | 1 |
| Grab | generica; C | 2 | 2 | **3** | 2 | **3** |
| Rincorsa dal marciapiede | generica; C | 1 | 1 | 1 | 1 | **2** |
| Steal | generica; C | 1 | 1 | 1 | 1 | **2** |
| Fasciatura col fazzolettaccio | generica; C | 1 | 1 | 1 | 1 | **2** |
| Pasticca trovata sul bancone | oggetto, +12 T; C | 2 | 2 | **3** | 2 | **3** |
| Panino del kebab dimenticato | oggetto; C | 2 | 2 | 2 | 2 | **3** |
| Mescolone Micidiale | oggetto; R | 1 | 1 | 1 | 1 | 1 |
| Sputo da posacenere | nuovo: POISON diretto | — | **2** | — | **2** | — |
| Spintone | nuovo: riempitivo F0 | — | **2** | — | **2** | — |
| Espresso del distributore | nuovo: +15 A | — | **1** | — | **2** | — |
| Tartaruga sul marciapiede | nuovo: difesa | — | — | — | **2** | — |
| Giubbotto di finta pelle | nuovo: difesa da CUT | — | — | — | **2** | — |

Perché: Sputo è POISON come la sua identità; Espresso paga A per Rincorsa, Steal e Sputo. **Scelta da segnalare:** a 30/3 Steal sale a 2
perché è l'unica carta a 1 rimasta che non sia raro o tutore. A 30/2 entrano due difese: possono allungare lo specchio di Celestina, già
al 18,32% di patte.

**Piera** (L)

| Titolo | Ruolo; rarità | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---|---:|---:|---:|---:|---:|
| Testata da ultimo giro | danno; C | 2 | 2 | **3** | 2 | **3** |
| Estasi da Coca Etilene | colpo; NC | 2 | 2 | **3** | 2 | **3** |
| Il bancone regge, io pure | difesa; C | 2 | 2 | 2 | 2 | **3** |
| Un altro e arrivo | car; NC | 2 | 2 | **3** | 2 | **3** |
| Rutto a distanza sociale | R | 1 | 1 | 1 | 1 | 1 |
| Prima il brindisi | tut; NC | 1 | 1 | 1 | 1 | 1 |
| Grab | generica; C | 2 | 2 | 2 | 2 | **3** |
| Spintone | generica, danno; C | 2 | 2 | **3** | 2 | **3** |
| Fasciatura col fazzolettaccio | generica; C | 1 | 1 | 1 | 1 | **2** |
| Amaro nel bicchiere di plastica | oggetto, +20 L; C | 2 | 2 | **3** | 2 | **3** |
| Peroni da 66, calda | oggetto; C | 2 | 2 | 2 | 2 | **3** |
| Tennents Super | oggetto; NC | 1 | 1 | 1 | 1 | **2** |
| Tartaruga sul marciapiede | nuovo: difesa a costo A | — | **2** | — | **2** | — |
| Panino del kebab dimenticato | nuovo: cura | — | **2** | — | **2** | — |
| Rincorsa dal marciapiede | nuovo: colpo a costo A | — | **1** | — | **2** | — |
| Sputo da posacenere | nuovo: POISON a costo A | — | — | — | **2** | — |
| Guanti da officina | nuovo: HIT inflitto ×1,25 | — | — | — | **2** | — |

Perché: i caricamenti di Piera danno fino a +35 A, che oggi non ha dove spendere; Tartaruga, Rincorsa e Sputo la usano. I Guanti
amplificano i suoi colpi HIT. Testata batte Bancone a 25/3 perché fa danno; Bancone è anche la carta candidata di D67 nel passo 3.

**Beppe** (V, oggetti)

| Titolo | Ruolo; rarità | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---|---:|---:|---:|---:|---:|
| Smontiamo tutto | oggetti; NC | 2 | 2 | **3** | 2 | **3** |
| Chiave da tredici | colpo; NC | 2 | 2 | **3** | 2 | **3** |
| Preparo il lavoro | car; NC | 2 | 2 | **3** | 2 | **3** |
| Sotto il cofano | difesa; C | 1 | 1 | 1 | 1 | **2** |
| Lavoro fatto bene | R | 1 | 1 | 1 | 1 | 1 |
| Una stretta di prova | tut; NC | 1 | 1 | 1 | 1 | 1 |
| Steal | generica; C | 2 | 2 | **3** | 2 | **3** |
| GABBIANO DUNQUE VOLIAMOTI | generica; C | 1 | 1 | 1 | 1 | 1 |
| Spintone | generica; C | 1 | 1 | 1 | 1 | **2** |
| Guanti da officina | oggetto; NC | 2 | 2 | 2 | 2 | **3** |
| Giubbotto di finta pelle | oggetto; C | 2 | 2 | 2 | 2 | **3** |
| Casco da lavoro | oggetto; C | 2 | 2 | **3** | 2 | **3** |
| Espresso del distributore | oggetto; C | 1 | 1 | 1 | 1 | **2** |
| Mattone del cantiere | nuovo: colpo grosso a V | — | **2** | — | **2** | — |
| Grab | nuovo: presa per gli equip | — | **2** | — | **2** | — |
| Denti stretti | nuovo: +10 V | — | **1** | — | **2** | — |
| Panino del kebab dimenticato | nuovo: cura | — | — | — | **2** | — |
| Tartaruga sul marciapiede | nuovo: difesa | — | — | — | **2** | — |

Perché: Mattone era nello starter di Beppe a 2 copie prima di D79 e usa la sua V; gli equip si attivano solo consumandoli, e Grab è la
presa più rapida; Denti dà V. A 25/3 sale il Casco, non il Giubbotto: entrambi comuni ed equip, il Casco copre l'HIT, il danno più diffuso.
A 30/3 Spintone batte GABBIANO perché è gratuito.

### Sintesi

Copie archetipo / generiche / oggetti e titoli distinti; coppia NC e raro in copie.

| Starter | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---|---|---|---|---|
| Spazienzio | 10/7/3; 13 | 10/10/5; 16 | 13/8/4; 13 | 10/11/9; 18 | 14/11/5; 13 |
| Mara | 10/5/5; 13 | 10/9/6; 16 | 13/6/6; 13 | 10/13/7; 17 | 14/8/8; 13 |
| Celestina | 10/5/5; 13 | 10/9/6; 16 | 13/6/6; 13 | 10/11/9; 18 | 14/9/7; 13 |
| Piera | 10/5/5; 12 | 10/8/7; 15 | 13/6/6; 12 | 10/11/9; 17 | 14/8/8; 12 |
| Beppe | 9/4/7; 13 | 9/9/7; 16 | 12/5/8; 13 | 9/12/9; 18 | 13/6/11; 13 |
| Coppia NC + tutore + raro | 2+2+1+1 | 2+2+1+1 | 3+3+1+1 | 2+2+1+1 | 3+3+1+1 |

### Scelte che toccano l'identità dello starter (D45 punto 7)

Le approva il proprietario (domande 2–5):

1. **Nelle X/2 l'archetipo scende da metà a un terzo del mazzo** (10 su 30). È una conseguenza del limite a 2 copie con sei titoli
   d'archetipo, non una scelta di gusto: a 30/2 lo starter è per due terzi fatto di generiche e oggetti condivisi. Alternativa: portare
   a 2 anche raro e tutore nelle X/2 (archetipo 12), che però cambia lo schema D61–D62 e la rarità dello starter.
2. **Nelle X/3 la coppia NC sale a 3+3:** la firma dello starter diventa più frequente, il raro più raro (1 su 25 o 30).
3. **Titoli nuovi negli starter:** Mattone torna in Beppe; Grab entra in Mara e Beppe; Sputo in Celestina e Piera; Kebab in
   Spazienzio, Piera e Beppe; Casco in Spazienzio e Mara; Guanti in Piera; Rincorsa, Spintone, Espresso, Tartaruga, Fasciatura, Denti e
   Giubbotto dove indicato.
4. **Carte ridotte da D79 che tornano a 2** nelle varianti grandi: Spintone e Tartaruga (Mara), Rincorsa e Fasciatura (Celestina),
   Fasciatura (Piera).
5. **Steal a 2 in Celestina a 30/3**, nonostante l'uso basso.

## 3. Il range 20–30 come domanda di design

**Cosa succede senza incentivo.** Se il mazzo può avere da 20 a 30 carte e nulla premia le carte in più, chi costruisce sceglie il
minimo: con meno carte vede più spesso le migliori, e la costanza vale più della varietà. Il minimo diventa il formato vero, e il
massimo resta un numero sulla carta, oppure una trappola per i principianti che mettono «tutte le carte belle» e giocano un mazzo
peggiore. Nei giochi di carte collezionabili con un minimo e nessun incentivo, la gran parte dei mazzi competitivi sta sul minimo.

**Incentivi che esistono in altri giochi, in termini generali:**

1. **Il mazzo come orologio o come vita:** chi finisce il mazzo perde o viene punito. Un mazzo grande allunga il tempo prima della
   punizione.
2. **Carte che contano il mazzo:** effetti più forti se il mazzo ha almeno N carte, o se ne restano molte.
3. **Un prezzo per il mazzo piccolo:** meno carte iniziali o una penalità di partenza sotto una soglia.
4. **Un vincolo di composizione:** più titoli distinti richiesti, oppure copie massime che crescono con la dimensione.
5. **Dimensione fissa:** si toglie la scelta, come oggi. È la soluzione più comune nei giochi pensati per partite brevi.

**Bote Micidiali ha già un incentivo del primo tipo.** Senza rimescolamento, a mazzo vuoto resta la last resort, che per tre starter
su cinque è Struggle e fa male anche a chi la gioca. Un mazzo da 30 la rimanda di circa dieci turni. L'incentivo però vale solo per i mazzi
lenti: un mazzo veloce, che chiude prima del mazzo vuoto, sceglierebbe comunque 20. Il range creerebbe quindi una scelta vera fra
«veloce e costante» e «lento e resistente», ma con un rischio preciso: **i mazzi lenti userebbero il range per sfuggire a Struggle**,
che secondo il piano è proprio ciò che chiude le partite lunghe. Gli specchi lunghi (Celestina 18,68 turni) peggiorerebbero.

**Se e come misurarlo.** Il nocciolo del range è una domanda semplice: **lo stesso personaggio a 20 batte se stesso a 30, o
viceversa?** Se a 20 vince sempre, il range collassa sul minimo; se a 30 vince sempre, collassa sul massimo; se dipende dal personaggio
o dall'avversario, il range crea una scelta. Si misura con un **braccio misto facoltativo**: ciascun personaggio a 20/2 contro se stesso
a 30/2 e a 30/3 (10 incontri), con le stesse misure.

**Raccomandazione:** **non adottare il range ora e non trattarlo come variante.** Nella Fase B si misura il braccio misto, che costa poco
(sezione 5); se il proprietario sceglie un formato fisso più grande, il range si chiude con quel dato. Il range si riapre solo se il
braccio misto mostra che la dimensione migliore dipende dal personaggio, e in quel caso con un incentivo progettato (meglio un vincolo
di composizione o il mazzo come orologio, già presente) e non con la sola libertà di scelta.

## 4. Ipotesi attese per variante

**Sono ipotesi, non risultati:** nessuna partita è stata giocata per scriverle. Le probabilità di pesca sono calcolate con la formula
ipergeometrica, senza contare gli oggetti, che fanno pescare un'altra carta, né «Annuncia», che va a prendere il colpo nel mazzo.

| Calcolo (prime 8 carte regolari viste, circa al quinto turno) | 20/2 | 25/2 | 25/3 | 30/2 | 30/3 |
|---|---:|---:|---:|---:|---:|
| Almeno una copia del colpo NC | 65% | 55% | 70% | 47% | 62% |
| Almeno una carta della coppia (caricamento o colpo) | 90% | 81% | 93% | 73% | 87% |
| Il raro entro le prime 12 carte | 60% | 48% | 48% | 40% | 40% |
| Densità del caricamento NC nel mazzo | 10,0% | 8,0% | 12,0% | 6,7% | 10,0% |

| Misura | Ipotesi | La conferma | La smentisce |
|---|---|---|---|
| Mazzi esauriti | Calano molto con la dimensione: a 20/2 il mazzo finisce verso il 16°–17° turno, a 25 circa 5 turni dopo, a 30 circa 10. Per Celestina, Piera e Beppe dal 44–50% a meno del 25% a 25 e meno del 10% a 30. Più oggetti (30/2) accorciano il mazzo | Calo di almeno metà a 30 | Calo piccolo perché le partite si allungano quanto il mazzo |
| Durata | Cresce poco negli incontri veloci (6–12 turni, il mazzo non finisce), cresce negli specchi lunghi perché Struggle arriva più tardi | Incontri sotto 12 turni quasi invariati; specchi Celestina e Beppe più lunghi | Durata invariata anche negli specchi: allora Struggle non era ciò che li chiudeva |
| Patte | Due spinte opposte: meno doppie cadute sotto Struggle, ma partite più lunghe. X/3 dovrebbe ridurle (mazzo costante, finali più decisi); X/2 incerta | Patte degli specchi Celestina/Beppe sotto il 10% in almeno una X/3 | Patte in crescita con la dimensione in tutte le varianti |
| Annunci per partita | Negli incontri brevi seguono la densità del caricamento: circa −20% a 25/2, −33% a 30/2, +20% a 25/3, invariati a 30/3; nei lunghi crescono con le carte viste | Ordine 25/3 > 20/2 ≈ 30/3 > 25/2 > 30/2 | Annunci indipendenti dalla densità |
| Ricerche fallite | Calano nelle X/3 (tre copie del colpo) e un po' anche nelle X/2 (il colpo è più spesso ancora nel mazzo) | Calo in tutte le varianti, più forte nelle X/3 | Fallite in aumento |
| Costanza | Sale nelle X/3, scende nelle X/2; misurata come turno della prima giocata del colpo NC (media e P10–P90) e quota di partite senza colpo NC | Dispersione minore in 25/3 che in 20/2, maggiore in 30/2 | Nessuna differenza fra X/2 e X/3 |
| Carte morte in mano | Crescono nelle X/2, perché entrano generiche meno adatte; restano simili nelle X/3 | Più turni in mano senza essere scelte per i titoli nuovi | Titoli nuovi usati quanto quelli D79 |
| Quote | Il vantaggio di chi ha la combo più forte può crescere nelle X/3; nelle X/2 gli starter si avvicinano, perché le generiche condivise pesano di più | Forbice delle quote più stretta in 30/2, più larga in 30/3 | Forbice indipendente dalla variante |

**Cosa renderebbe interessante un cambio di formato** (proposta da confermare, domanda 9): una variante che dimezza i mazzi esauriti e
riduce le patte degli specchi senza portare oltre 12 turni altri incontri, senza allargare la forbice delle quote e senza far crescere le
carte morte. Se nessuna variante migliora queste misure insieme, resta 20/2 e Q7 si chiude con i dati.

## 5. Disegno della Fase B

**Carte.** La bozza alla fine del passo 3 di SB-16g, con il braccio che il proprietario sceglierà dopo il giro finale D80 (con o senza
l'estensione POISON del Bancone). Questo disegno non dipende dai numeri del passo 3: le liste 20/2 sono quelle della bozza di quel
momento, e le varianti si ottengono con le regole e le tabelle della sezione 2, che toccano solo copie e titoli. Se il passo 3 cambiasse
una lista D79 (oggi ferme per D80), le tabelle si rifanno con gli stessi principi e si ripresentano.

**Bot e semi.** Bot D76–D77 in tutte e tre le politiche del gettone, quattro stili, 15 incontri compresi gli specchi, posti alternati,
semi 7.000.000–7.000.299 condivisi fra le varianti, come nel passo 2. Con dimensioni diverse lo stesso seme dà mescolate diverse: gli
aggregati restano descrittivi, non confronti appaiati.

**Misure.** Quelle del passo 2 (quote sulle decisive, patte, turni e P10–P90, mazzi esauriti per starter, annunci per partita con
distribuzione 0/1/2/3+, ricerche riuscite e fallite, invarianti, bound entro il tetto) più:

- turno di esaurimento del mazzo, per starter;
- costanza: turno della prima giocata del colpo NC e del raro, media e P10–P90, e quota di partite in cui non vengono giocati;
- carte morte: turni in mano senza essere scelte e quota di partite in cui il titolo è giocato, **per tutti i titoli**, non solo per i
  dieci caricamenti;
- quota di partite chiuse durante Struggle o la last resort propria.

**Braccio misto facoltativo** (sezione 3): ciascun personaggio a 20/2 contro se stesso a 30/2 e a 30/3, 10 incontri, stesse misure.

**Passo 0 di fattibilità, fuori budget.** 4 semi per cella per ogni variante e per il braccio misto. Controlla: liste valide (somme,
copie massime, parti fisse identiche alla 20/2, annidamento 25 ⊂ 30), invarianti a zero, nessuna partita al limite di 200 turni
(`SimulationRunner.MAX_TURNS`), bound entro il tetto, tempi. Stima conservativa come nel passo 2: tempo misurato ×75×1,5 più 120 s.
Non si usano i risultati del campione per ritoccare le liste.

**Budget proposto, separato da D68:** **un giro, al più 7.200 s cumulativi di calcolo**. Stima: il passo 2 ha giocato 648.000 partite
in 738 s; con le partite più lunghe delle varianti grandi (fattore 1,0–1,4) le cinque varianti costano circa 4.400 s e il braccio misto
circa 600 s, in tutto circa 5.000 s. Se la stima del passo 0 supera il budget, **si scende a 150 semi per cella per tutti**, deciso ora,
senza togliere varianti; se non basta ancora, STOP e domanda al proprietario. Nessun secondo giro, nessuna taratura, nessun rilancio se
i dati non piacciono.

**Lavoro tecnico necessario.** Il playground è già parametrico: le regole del mazzo stanno nel blocco `rules` della bozza (`deckSize: 20`,
`maxCopies: 2`); `Draft` le legge e convalida ogni starter contro quei valori (in `server/src/main/java/com/gsc/bm/sim/Draft.java`, righe
783–789), e `DeckSearch` le usa per la ricerca dei mazzi. I bot non contengono il 20: vedono solo la dimensione corrente del mazzo in
`BotView`. Il 20/2 della partita viva è in `server/src/main/java/com/gsc/bm/service/account/DeckRules.java`
(`REGULAR_CARDS = 20, MAX_COPIES = 2`) e **non si tocca**. Quindi:

1. Un file per variante nelle risorse di test (per esempio `set-base/sb-16h/25-3.json`) con dimensione, copie massime e le cinque liste.
2. Una classe di test nel package `com.gsc.bm.sim` che parte dal JSON della bozza (`Draft.json()`), sostituisce `rules.deckSize`,
   `rules.maxCopies` e le carte degli starter, e la rilegge con `Draft.parse`, cioè con la stessa convalida rigorosa. È lo schema che
   `BenchTest` usa già per modificare la bozza in memoria. Una composizione di più file con `-Dsim.draft` non basta, perché le
   espansioni non possono portare regole proprie.
3. Una misura dedicata, o un'opzione di `ChargeMeasureTest` che sceglie la variante e scrive le uscite per variante. Il controllo che
   oggi confronta le liste con la proposta 1.3 va generalizzato alle liste della variante.
4. I contatori nuovi della sezione «Misure» (esaurimento, costanza, carte morte per tutti i titoli).
5. Test: liste valide e annidate; la 20/2 coincide con la bozza; `DeckRules` rifiuta ancora un mazzo da 25 (non regressione di R02).

Nessun file di `server/src/main` cambia, neppure `com/gsc/bm/sim` o le carte di bozza: regolamento, `docs/sets`, catalogo, client e
classi vive restano come sono. Verifiche della Fase B: `./scripts/build.ps1 -Task Test -Offline`, `python scripts/check-rules.py`,
`git diff --check`. Stima: una sessione per strumenti, passo 0 e giro, con evidenze minificate entro 3 MB.

**Dopo la Fase B.** Dati al proprietario, che sceglie il formato e chiude Q7. Se sceglie un formato diverso da 20/2: nuova versione di R02,
riapertura di SB-1, liste definitive degli starter approvate di nuovo e rilancio delle misure del set. SB-23 resta per la conferma sul set
intero e coi mazzi costruiti.

## 6. Domande numerate al proprietario

1. **Varianti:** approvi 20/2, 25/2, 25/3, 30/2 e 30/3, senza 20/3 e senza mazzi oltre 30? Oppure aggiungiamo 20/3 per isolare la
   terza copia (costa circa un sesto del giro in più)?
2. **Schema D61 nelle varianti:** raro e tutore restano a 1 copia ovunque; nelle X/3 la coppia NC sale a 3+3 insieme. Va bene?
3. **X/2 come «più varietà»:** entrano titoli nuovi e le copie esistenti non cambiano (tranne Mara a 30/2), invece di raddoppiare prima
   le carte a 1 copia. Va bene questo contrasto con le X/3?
4. **Composizioni:** approvi i titoli che entrano e le carte che salgono, starter per starter, comprese le scelte d'identità della
   sezione 2 (Mattone di nuovo in Beppe, Steal a 2 in Celestina a 30/3, due difese in più in Celestina a 30/2)?
5. **Archetipo a un terzo nelle X/2:** lo accetti come parte della misura, o preferisci che nelle X/2 raro e tutore salgano a 2
   (archetipo a 12, schema D61 cambiato)?
6. **Pool:** solo titoli già scritti nella bozza, senza anticipare carte di SB-19. Va bene?
7. **Range:** niente range ora; nella Fase B il braccio misto (ogni personaggio a 20/2 contro se stesso a 30/2 e a 30/3). Lo includiamo?
8. **Budget:** un giro, al più 7.200 s, separato da D68; passo 0 fuori budget; 150 semi per cella se la stima supera il budget. Approvi?
9. **Criterio di scelta:** cambieresti formato per una variante che dimezza i mazzi esauriti e riduce le patte degli specchi senza
   allungare oltre 12 turni altri incontri, senza allargare la forbice delle quote e senza far crescere le carte morte? Vuoi aggiungere
   o togliere qualcosa?
10. **Quando:** la Fase B parte dopo il giro finale D80 del passo 3 e la tua scelta del braccio, prima di SB-17. Confermi?
