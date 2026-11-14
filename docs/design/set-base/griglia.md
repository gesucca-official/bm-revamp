# Griglia degli slot del Set Base

> **Stato: approvata dal proprietario il 6 novembre 2026** (SB-10b). Principi della fase A e griglia della fase B, ciascuno con le
> parole «Approvo tutte»: vedi [Decisioni del proprietario](#decisioni-del-proprietario). Dopo la misura del tetto in partita il
> proprietario ha scelto il tetto 3 per le bound di danno («Sì, danno a 3», D36): vedi [Tetto in partita](#tetto-in-partita).
> **SB-16d, 12 novembre 2026 (D52, D54, D55):** nove slot riprogettati secondo la [proposta approvata](sb-16d-proposta.md),
> più PIN-BO1 ridotta da +10 a +5 L sotto la delega D38: valore per uso 3,75 con D50, tetto 4 invariato.
> SB-12a ha corretto coi bot alcuni numeri degli starter base, approvati dal proprietario: vedi [Correzioni di SB-12a](#correzioni-di-sb-12a).
> **Non normativo:** il regolamento vigente è
> [game-rules.md](../../game-rules.md) e la partita viva non cambia. Nessuna carta è scritta qui come dato giocabile: le carte nascono in
> SB-11 e nei blocchi seguenti, che possono scambiare gli slot purché i totali tengano ([piano, SB-10](../../set-base-plan.md#sb-10--griglia-degli-slot-e-listino-di-potenza)).
> **Nomi dei personaggi dell'8 novembre 2026** ([schede](schede-personaggi.md), [serbatoio di flavour](flavour.md)): Piera (era Pino),
> Beppe (Gigi), Celestina (il Tossico), Sergio (Cesira) e Duccio (Rocco). Gli ID degli slot non cambiano; le note, le correzioni e le
> decisioni dei blocchi passati restano con i nomi del loro momento. I nomi di lavoro delle carte di Sergio e Duccio legati ai concept
> vecchi si rifanno in SB-17, SB-18 o SB-24.

**Perché esiste.** Il [piano](../../set-base-plan.md#il-set-in-numeri) fissa 120 carte (D60/D79), ma senza una griglia ogni blocco
progetterebbe le sue carte da solo, e alla fine il set avrebbe buchi (meccaniche mai usate) e doppioni (tre parate uguali). La griglia dà
a ogni carta del set un posto, un ruolo, una fascia di costo, una rarità e un motivo prima di scriverla. Usa i prezzi misurati del
[listino](listino.md), i triangoli delle [schede dei personaggi](schede-personaggi.md) e le idee della
[bozza esterna](bozza-esterna-proposta-70-carte.md).

Fonti: [piano](../../set-base-plan.md) (D1–D33), [listino](listino.md) e [rapporto SB-10a](../../reports/set-base/sb-10a-report.md),
[schede](schede-personaggi.md) e [rapporto SB-9](../../reports/set-base/sb-9-report.md), [regolamento 1.11](../../game-rules.md) (R01a,
R02, R04–R07a), [formato dati di SB-5](../../reports/set-base/sb-5-report.md#decisione-sul-formato), bozze `attuale.json` e
`prova-sb9.json` di SB-6a.

> **SB-16g 2b2, 14 novembre 2026 (D79):** attuata la [proposta 1.3](sb-16g-proposta.md): dieci caricamenti con «Annuncia» ([contratto d50 1.1](sb-16g-2b1-rules.md)), cinque nuovi NC, liste da 20; 120 slot, 45 C / 55 NC / 20 R. Solo PAZIENZA anticipa +25 V; danni, costi ed effetti dei colpi invariati. Le note delle fasi precedenti sono storiche.

## Principi approvati nella fase A

Il proprietario ha approvato tutte e otto le raccomandazioni con «Approvo tutte» (6 novembre 2026):

1. **Budget 115:** 37 azioni d'archetipo (6 per Cesira e Rocco, 5 per gli altri) e 23 generiche; il resto come da piano.
2. **Starter da 12 carte distinte** (5 d'archetipo, 4 generiche, 3 oggetti), con varianti per Gigi (più oggetti) e Spazienzio (meno).
3. **Bound senza parate:** generatrice, colpetto e una variante a una sola funzione.
4. **T del Tossico più scarsa,** carte prezzate a circa 0,3–0,5 danni per T, bound di T al massimo +10 fino a SB-13.
5. **Costi in HEALTH solo nell'archetipo di Rocco;** salute di Mara e Rocco invariata, prima leva nei giri di SB-12 e SB-18.
6. **Tre rarità,** circa 54 comuni, 41 non comuni e 20 rare, con la regola «picco condizionato, media in linea».
7. **Pino:** costi di 5 L o meno, carte che spendono la L residua, bound di L fino a +10, GoingBerserk riprogettata; testo del listino
   sul calo di L corretto (fatto: vedi [L e Pino](#l-e-pino)).
8. **Formato dati:** due passi nuovi (equip dentro `status`, `consume`), il resto in Java con i numeri come parametri.

## Taratura SB-16e (D38/D53)

12 novembre 2026, versione di taratura 0.1, soli numeri nel playground. Dopo il giro 2 (Celestina 55/10 T, Piera 100/10 L),
il giro 3 usa salute Spazienzio 75, Mara 70, Celestina 70, Piera 85 e Beppe 80; T iniziale Celestina 15 e Dose in preparazione
+10 T; L iniziale Piera 10, Un altro e arrivo +20 A e Testata 25 HIT. Funzioni e liste conservate. Motivi e confronto dei tre giri nel
[rapporto](../../reports/set-base/sb-16e-report.md). Le note dei blocchi precedenti conservano i valori storici.

**Lotto SB-16e2 (D56/D38).** Variante (c) adottata: Un altro e arrivo +20 → **+35 A**; danno a sé di L'ultima dose e
L'ultimo giro 5 → **2 HIT**. Nessuna variante soddisfa i criteri: dieci violazioni come il controllo. Misure nel
[rapporto SB-16e2](../../reports/set-base/sb-16e2-report.md).

## Principi aggiunti con SB-16d (D52, D54, D55)

- **Nessuna parata pura del turno:** un premio che resta anche senza attacco, circa +5 della risorsa personale o una piccola cura
  per le generiche. GEN-13 cura 3; MAR-AR4 rimborsa 5 A e GIG-AR4 5 V, senza eliminare il requisito di pagare il costo.
  Le contromosse restano letture senza rendita garantita. GEN-11, CES-AR5 e ROC-AR2 nascono con questo principio nei loro blocchi.
- **Caricare–colpire–parare:** un effetto di caricamento annuncia il colpo con stati BAD INPUT visibili. L'esposizione dura il turno
  corrente e il successivo (`turns: 1`), anche se si rinuncia al colpo; nessun nuovo tipo di carta o risorsa (D54).
- **Una coppia con ricerca per personaggio:** una carta esatta al posto della pesca successiva, mostrata; se manca, pesca normale.
  Nei cinque starter: SPA-AR3 → SPA-AR1, MAR-AR5 → MAR-AR2, TOS-AR1 → TOS-AR2, PIN-AR4 → PIN-AR2, GIG-AR3 → GIG-AR5.
  Per Sergio e Duccio la coppia si progetta nei rispettivi blocchi. I caricamenti qui sono regolari; nessuna ricerca nelle bound.
- **D50:** risorse non negative, chi è a terra all'inizio del gruppo non attacca salvo eccezione esplicita sulla carta, corazza L/4
  dopo gli stati soltanto sull'HIT. Nessuna nuova eccezione «Ultimo colpo» in questi starter. Priorità, A e prezzi si rimisurano in SB-16e.
- **PIN-BO1:** solo il guadagno cambia, da +10 a +5 L (D38/D54); 8,50 → 3,75 per uso nel banco D50. La corazza deriva dal sistema,
  non da uno stato di parata aggiunto alla bound. Tetto, tolleranza, pesi e regole del banco restano quelli approvati.

Questa sezione descrive SB-16d; D79 aggiorna sotto copie, rarità e due ricerche per starter. Valori iniziali e danni restano invariati.
Le sezioni di correzioni SB-12a–SB-15 e le misure precedenti restano storiche; per questi dieci slot valgono le righe aggiornate.
Nessun bilanciamento in SB-16d: [rapporto](../../reports/set-base/sb-16d-report.md), poi misure estese in SB-16e e prova umana SB-16f.

## Principi aggiunti con SB-16g 2b2 (D61–D63, D78–D79)

Le righe degli slot e le liste sotto attuano la proposta 1.3: 120 titoli/slot,
42 azioni d'archetipo, 45 C / 55 NC / 20 R. Le cinque nuove carte sono NC.
Ogni starter contiene due copie di un caricamento NC verso due copie di un colpo NC,
più un diverso caricamento NC verso un colpo R in singola copia.
«Annuncia X» segue il contratto d50 1.1: nome, fine turno, uscita D71 e ripiego senza gettone.
Preparo cerca ora Chiave da tredici; Una stretta di prova cerca Lavoro fatto bene.
Ogni caricamento finanzia da zero il suo colpo dopo il fine turno nel caso nominale D63.
Le formule dei colpi, costi ed effetti restano quelle di oggi: nessun anticipo della potenza
del passo 3 o della difesa POISON. PAZIENZA è la sola eccezione di risorse, +25 V/+15 A.
Le sezioni SB-10/SB-16d e le correzioni dei blocchi precedenti documentano la storia.

## Potenza del passo 3 di SB-16g (D82, D84)

14 novembre 2026, [proposta 1.4](sb-16g-proposta.md#passo-3--proposta-corrente-14) attuata nelle righe sopra (barrati i valori del passo 2):
Impatto 30 HIT; Ti stringo +20 A e Cinghiata 20 A per 18 + A residua/2 CUT; Dose +5 A, Tossicone 18 POISON, Un assaggino +20 T
e travaso con 12 POISON diretti; Estasi 18 + L spesa; Rutto 14 + 2×L spesa e −A pari alla stessa L, poi L azzerata; Preparo e Una stretta
infliggono 4 CUT a un avversario anche a ricerca fallita, Preparo +15 V; Chiave 22 CUT/10 V; Lavoro 14 + 7 per oggetto/10 V;
Sotto il cofano anche +5 A. Liste, copie, binding, priorità e rarità invariati (D79). Il Bancone con POISON ×0,5 esiste solo come
variante del braccio B del giro finale, `set-base/bancone-b.json`; la bozza resta col Bancone del passo 2 fino alla scelta del braccio.

## Correzione 1.5 di SB-16g (D90)

14 novembre 2026, [correzione 1.5](sb-16g-proposta.md#passo-3b--correzione-15) attuata nelle righe sopra sul braccio B scelto in D89
(bozza + `set-base/bancone-b.json`): Impatto 30 → **34 HIT** (25 V); Chiave da tredici 22 → **18 CUT** (10 V); Lavoro fatto bene
14 + 7 → **14 + 4** per oggetto (10 V). Nient'altro: liste, copie, binding, priorità, rarità, premi e Bancone del braccio B invariati.

## Come si legge

- **ID dello slot:** stabile per tutto il piano, anche se la carta cambia nome. Prefissi: `PG` personaggi, `XXX-BA` basic, `XXX-BO`
  bound, `LR` last resort, `XXX-AR` archetipo, `GEN` generiche, `OGG` oggetti; `SPA` Spazienzio, `MAR` Mara, `TOS` Celestina (il Tossico), `PIN` Piera (Pino),
  `GIG` Beppe (Gigi), `CES` Sergio (Cesira), `ROC` Duccio (Rocco).
- **Unità U:** il valore di una carta gratuita in linea, circa **7 HIT** (D33). **Fasce di costo** delle azioni:

  | Fascia | Costo tipico | Valore atteso (HIT equivalenti) |
  |---|---|---|
  | F0 | gratuita | ≈ 7 (1 U) |
  | F1 | 5 V · 5–10 A · 10 T · ≤ 5 L · 5–8 HEALTH | ≈ 12–13 (1,8 U) |
  | F2 | 10 V · 15–20 A · 10–12 HEALTH | ≈ 18–20 (2,7 U) |
  | F3 | 15–20 V · 20 HEALTH | ≈ 24–29 (3,7 U) |
  | F4 | 25 V o più | ≈ 38–40 (5,5 U); intasa la mano |

  Prezzi del listino: 1 V ≈ 1,1 HIT fino a 20 V, poi di più; 1 A ≈ 0,6; 1 HEALTH ≈ 1,15; T di Celestina 0,3–0,5 (decisione 4, da misurare);
  L come costo non misurata per Piera. CUT, HIT e POISON valgono uguale, la priorità non si paga. **Le linee a unità 7 sono stimate** togliendo
  circa 3 HIT a quelle misurate con l'àncora da 10: SB-11 le rimisura.
- **Bound:** al posto della fascia, le **unità per uso** col banco di SB-7, i pesi di D33 (V 0,75, A 0,5, T 0,15 per chi è immune,
  L 0,35, HEALTH 1) e il danno inflitto a 4/3 (D36). Tetto 4, tolleranza 0: al massimo 3 di danno o 4 unità di risorsa.
- **Numeri «indicativi»:** danni, costi e durate sono il punto di partenza per i blocchi delle carte, non valori decisi.
- **Starter:** copie nello starter; «—» vuol dire che la carta si trova solo nella collezione.
- **Candidata:** carta attuale (identificatore di R07), carta della bozza esterna («bozza»), carta della bozza di prova di SB-6a
  («prova»), oppure «da inventare» (con un nome di lavoro).
- **Forma:** `dati` = esprimibile con i sei passi di oggi; `consume` o `equip` = serve quel passo nuovo; `Java` = classe esistente con i
  numeri come parametri; `Java nuova` = classe da scrivere.

## La griglia

### Personaggi (7)

Concept approvati in SB-9. Numeri correnti della bozza dopo [SB-16e](#taratura-sb-16e-d38d53); le note conservano la storia
di SB-12a–SB-15. Nessun cambiamento al gioco vivo.

| ID | Personaggio | Tipo | Valori iniziali | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---|---|---|---|---|
| PG-SPA | Spazienzio de la Ucciso | Personaggio, base | H 75 (SB-16e), A 20, V 25, capacità 1 | C | Spazienzio | `BigBadBruiser`, conservato | Il metro del set (SB-9); salute precedente 85¹ | dati |
| PG-MAR | Mara Contromano | Personaggio, base | H 70 (SB-16e), A 40, capacità 2 | C | Mara | bozza, V 10 → 0 | Contrasto di Spazienzio; salute precedente 80¹ | dati |
| PG-TOS | Celestina Bucatina | Personaggio, avanzato | H 70, A 35, T 15 (SB-16e), capacità 2, immune all'effetto periodico di T | NC | Celestina | `ToxicJunkie`, capacità 3 → 2 | T come carburante e veleno; precedenti 80/20⁵ | dati |
| PG-PIN | Piera Ultimo Giro | Personaggio, avanzato | H 85, A 15, L 10 (SB-16e), capacità 2 | NC | Piera | bozza, V 10 → 0, nessuna immunità (D28) | L da spendere subito; precedenti 100/20⁶ | dati |
| PG-GIG | Beppe Bulletta | Personaggio, avanzato | H 80 (SB-16e), A 25, V 25⁷, capacità 3 | NC | Beppe | bozza | Oggetti ed equip; salute precedente 95⁷ | dati |
| PG-CES | Sergio Sommerso | Personaggio, booster | H 90, A 30, V 10, capacità 2 | R | — | da inventare (concept SB-9) | Contromosse e letture | dati |
| PG-ROC | Duccio Braccio Teso | Personaggio, booster | H 130, A 15, capacità 2 | R | — | da inventare (concept SB-9; personaggio di prova SB-6a) | La salute come risorsa (D27) | dati |

**Salute iniziale (cautela di SB-10a).** A 2,5–4,8 punti di quota per 1 HEALTH, Mara a −15 vale sulla carta da −37 a −72 punti e Duccio
a +30 da +75 a +144. La griglia le compensa con le carte, senza cambiare i valori (decisione 5): Mara ha costi in A bassi, una bound di A e
due difese pagate in A; Duccio spende circa 30–40 di salute a partita. Se in SB-12 Mara resta sotto il 45%, la prima leva è la salute
(85 → 90–95), prima delle carte; per Duccio la stessa domanda va in SB-18.

¹ **SB-12a, giri 1 e 2** ([correzioni](#correzioni-di-sb-12a)). Giro 1: Mara 85 → 95, il punto di partenza di D38. Giro 2: salute tolta a
tutti e due, Spazienzio 100 → 85 e Mara 95 → 80, con la stessa distanza; motivo: la durata (13,5–13,8 turni, ora 11,1–11,3) e i mazzi
esauriti (fino al 36%, ora 10–15%), con il matchup che non si sposta. La salute degli avanzati e dei booster non cambia qui: SB-13 deve
decidere se seguire la stessa scala (vedi il [rapporto](../../reports/set-base/sb-12a-report.md)).

⁵ **SB-13, giri 1–3** ([correzioni](#correzioni-di-sb-13)). Giro 1: salute del Tossico 100 → 85, l'ipotesi della scala dei base (SB-9 meno 15,
raccomandazione 1 di D41). Giro 2: salute 85 → 80 e T iniziale 10 → 20, perché con 10 T le carte pagate in T restavano morte in mano per metà
dei turni e il Tossico perdeva contro Mara (0,403); Tossicone Scatarrante 5 → 8 POISON. Giro 3: Raschiare il fondo +10 → +7 T, per il tetto
di 4 HEALTH equivalenti per uso. In attesa del giudizio del proprietario.

⁶ **SB-14, giri 1–3** ([correzioni](#correzioni-di-sb-14)). Giro 1: salute di Pino 110 → 95, l'ipotesi della scala dei base (SB-9 meno 15).
Giro 2: L iniziale 10 → 20, PIN-AR2 da 3 a 10 + L, LR-PIN da 6 a 12 + L, perché le carte da 5 L restavano morte in mano per l'80–88% dei
turni e Pino vinceva il 10–12%; Testata 20 → 25. Giro 3: Testata di nuovo a 20, perché a 25 stava sopra il prezzo misurato della L, e salute
95 → 100. In attesa del giudizio del proprietario.

⁷ **SB-15, giri 1 e 2** ([correzioni](#correzioni-di-sb-15)). Giro 1: salute di Gigi 100 → 85, l'ipotesi della scala dei base (SB-9 meno 15).
Giro 2: salute 85 → 95 e V iniziale 15 → 25, perché le carte pagate in V restavano morte in mano (Mattone 88%, «Lavoro fatto bene» 78% dei
turni in mano) e Gigi vinceva il 12–15%; GIG-AR2 10 → 12 CUT e GIG-AR5 da 10 a 5 V, sulla linea della fascia F1. In attesa del giudizio
del proprietario.

### Basic (7)

Tutte prese di un proprio oggetto (D3), gratuite, permanenti; il tratto è il passo prima della presa.

| ID | Personaggio | Tipo | Ruolo | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| SPA-BA | Spazienzio | Azione, basic | ITEMS | −1 | Consuma come Grab | C | Spazienzio | `BruiserGrab`, conservata | Il tratto è la lentezza; con capacità 1 gli oggetti sono pochi | consume |
| MAR-BA | Mara | Azione, basic | ITEMS | 2 | −5 A a sé, poi consuma | C | Mara | bozza «Preso al volo», −10 → −5 A | Consuma prima che le rubino l'oggetto, pagando precedenza | consume |
| TOS-BA | Celestina | Azione, basic | ITEMS | 1 | +5 T a sé, poi consuma | NC | Celestina | `ToxicGrab`, riprogettata (assorbe il flavour di `EverythingIsDrug`) | «Tutto è droga»: oggi perde metà della A, che è un tratto solo punitivo | consume |
| PIN-BA | Piera | Azione, basic | ITEMS | 0 | +5 L a sé, poi consuma | NC | Piera | bozza «Questo lo finisco io» | Beve quello che trova | consume |
| GIG-BA | Beppe | Azione, basic | ITEMS | 0 | +4 V a sé, poi consuma | NC | Beppe | bozza «Questo torna utile», senza −5 A, priorità −1 → 0 | Ogni oggetto gli dà moneta per gli attrezzi; diversa da quella di Spazienzio | consume |
| CES-BA | Sergio | Azione, basic | ITEMS | 1 | +5 A a sé, poi consuma | R | — | da inventare («Me lo tengo io») | Raccoglie e tiene da parte | consume |
| ROC-BA | Duccio | Azione, basic | ITEMS | 0 | Consuma, poi +3 HEALTH | R | — | da inventare («La mancia») | La sua risorsa è la salute; la cura è limitata dagli oggetti, non ripetibile come una bound | consume |

### Bound (21)

Tutte con una sola funzione, entro 4 unità per uso col danno pesato 4/3 (D36: al massimo 3 di danno), senza bersagliare oggetti, senza nulla che resti sull'avversario, senza oggetti,
token, equip, cure o annullamenti. Le prime due di ogni personaggio con starter sono nello starter (comuni), la terza nella collezione.

| ID | Personaggio | Tipo | Ruolo | Pr. | Effetto indicativo | Unità per uso | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---:|---|---|---|---|---|
| SPA-BO1 | Spazienzio | Azione, bound | RESOURCES | 0 | +5 V a sé | 3,75 | C | Spazienzio | `LittleRage`, riprogettata: tolta la parata | Generatrice; due funzioni oggi, 6,75 unità | dati |
| SPA-BO2 | Spazienzio | Azione, bound | DAMAGE | 1 | 3 HIT | 4 | C | Spazienzio | `LittleSmack`, riprogettata: tolti +5 A | Colpetto; oggi 7,5 unità e +0,1 HEALTH per uso | dati |
| SPA-BO3 | Spazienzio | Azione, bound | RESOURCES | 0 | 3 HIT a sé, +8 V a sé | 3 (6 − 3) | NC | — | da inventare («TESTA AL MURO», SB-11b) | Variante: carica più forte, pagata con la salute | dati |
| MAR-BO1 | Mara | Azione, bound | DAMAGE | 1 | 3 CUT | 4 | C | Mara | bozza «Passo stretto», senza +5 A | Colpetto | dati |
| MAR-BO2 | Mara | Azione, bound | RESOURCES | 0 | ~~+8~~ +6 A a sé⁴ | ~~4~~ 3 | C | Mara | da inventare («Cambio marcia») | Generatrice: Mara paga tutto in A (decisione B2) | dati |
| MAR-BO3 | Mara | Azione, bound | DAMAGE | 2 | 2 CUT | 2,67 | NC | — | prova «Colpo di striscio», 5 → 2 CUT | Variante veloce | dati |
| TOS-BO1 | Celestina | Azione, bound | DAMAGE | 1 | 3 CUT | 4 | C | Celestina | `PatheticBlade`, riprogettata: niente T a sé né al bersaglio | Colpetto; oggi si accumula e lascia T +40 | dati |
| TOS-BO2 | Celestina | Azione, bound | RESOURCES | 0 | +~~10~~ 7 T a sé⁵ | ~~1,5~~ 1,05 | C | Celestina | da inventare («Raschiare il fondo») | Generatrice di carburante; +10 per la decisione 4, anche se il tetto ammetterebbe +26 | dati |
| TOS-BO3 | Celestina | Azione, bound | DAMAGE | 2 | 2 POISON | 2,67 | NC | — | `RottenSmile`, riprogettata («alito marcio») | Variante: POISON diretto. Oggi lascia A −40 e vale −1,1 HEALTH per uso | dati |
| PIN-BO1 | Piera | Azione, bound | RESOURCES | 0 | +5 L a sé | 3,75 con D50 | C | Piera | bozza «Cinque minuti e vado», +10 → +5 L (D38/D54) | Generatrice; sola riduzione numerica per rientrare nel tetto con la corazza | dati |
| PIN-BO2 | Piera | Azione, bound | DAMAGE | 1 | 3 HIT | 4 | C | Piera | da inventare («Spallata al bancone») | Colpetto | dati |
| PIN-BO3 | Piera | Azione, bound | DAMAGE | 1 | 2 CUT | 2,67 | NC | — | da inventare («Coccio») | Variante: il vetro taglia | dati |
| GIG-BO1 | Beppe | Azione, bound | RESOURCES | 0 | +5 V a sé | 3,75 | C | Beppe | bozza «Una stretta e passa», senza i 3 HIT | Generatrice della moneta degli attrezzi | dati |
| GIG-BO2 | Beppe | Azione, bound | DAMAGE | 1 | 3 HIT | 4 | C | Beppe | da inventare («Colpo di cacciavite») | Colpetto, amplificato dai guanti | dati |
| GIG-BO3 | Beppe | Azione, bound | DAMAGE | 2 | 2 CUT | 2,67 | NC | — | da inventare («Lima») | Variante veloce | dati |
| CES-BO1 | Sergio | Azione, bound | RESOURCES | 0 | +8 A a sé | 4 | NC | — | da inventare («Affacciarsi») | Generatrice: le letture costano A | dati |
| CES-BO2 | Sergio | Azione, bound | DAMAGE | 1 | 3 HIT | 4 | NC | — | da inventare («Battuta») | Colpetto | dati |
| CES-BO3 | Sergio | Azione, bound | DAMAGE | 2 | 2 HIT | 2,67 | NC | — | da inventare («Frecciatina al volo») | Variante veloce; nessun annullamento né −A (decisione 8 di SB-9) | dati |
| ROC-BO1 | Duccio | Azione, bound | DAMAGE | 0 | 3 HIT | 4 | NC | — | prova «Colpetto», 5 → 3 HIT | Colpetto | dati |
| ROC-BO2 | Duccio | Azione, bound | DAMAGE | 2 | 2 HIT | 2,67 | NC | — | da inventare («Diretto») | Variante veloce | dati |
| ROC-BO3 | Duccio | Azione, bound | RESOURCES | 0 | +8 A a sé | 4 | NC | — | da inventare («Saltellare»); sostituisce la prova «Fiato» (+5 HEALTH, una cura) | Duccio ha la A più bassa | dati |

⁴ **SB-12a, dopo il giro 3, decisione del proprietario** ([correzioni](#correzioni-di-sb-12a), D41): MAR-BO2 da +8 a +6 A. Sugli
starter corretti la +8 A valeva circa 4,5 HEALTH equivalenti per uso, sopra il tetto di 4 scelto da D38 per Mara; la +6 A circa 3,3, col
matchup quasi fermo.

### Last resort (4)

Gratuite, sempre giocabili, senza bersaglio oggetto né condizioni, nessun annullamento; netto vicino a Struggle e almeno 5 di danno a sé,
così chiudono la partita (D29).

| ID | Personaggio | Tipo | Ruolo | Pr. | Effetto indicativo | Rarità | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|
| LR-STR | generica | Azione, last resort | DAMAGE | 1 | 5 HIT a sé, 10 HIT | C | `Struggle`, conservata | Spazienzio, Mara, Beppe, Sergio | dati |
| LR-TOS | Celestina | Azione, last resort | DAMAGE | 1 | ~~5~~ 2 HIT a sé (SB-16e2), 7 POISON e +4 T al bersaglio | NC | `LethalHeroinDose`, riprogettata («L'ultima dose») | Oggi costa salute solo con T alta e il bot non la gioca; qui chiude col veleno | dati |
| LR-PIN | Piera | Azione, last resort | DAMAGE | 1 | ~~5~~ 2 HIT a sé (SB-16e2), HIT pari a ~~6~~ 12⁶ + L residua, poi azzera L | NC | da inventare («L'ultimo giro») | L'ultima carta è l'ultimo bicchiere | Java nuova, la stessa di PIN-AR2 (decisione B1) |
| LR-ROC | Duccio | Azione, last resort | DAMAGE | 0 | 6 HIT a sé, 12 HIT | R | prova «Porgi l'altra guancia» | Il danno a sé è un effetto, non un costo in HEALTH: resta gratuita | dati |

### Azioni d'archetipo (42)

Ogni archetipo ha attacco, difesa e contromossa (§ [triangoli](#triangoli)). Nei cinque starter ogni archetipo ha sei titoli; rarità e copie sono quelle di D79 sotto. Sergio: 2 C, 3 NC, 1 R. Duccio: 3 C, 2 NC, 1 R.

**Spazienzio (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| SPA-AR1 | Azione, regolare | DAMAGE | F4 (25 V) | 0 | ~~40~~ ~~30~~ 34 HIT (passo 3, D82; correzione 1.5, D90) | NC | 2 | `SuperImpact`, conservata | Attacco: il colpo grosso; in linea con l'unità a 7 | dati |
| SPA-AR2 | Azione, regolare | DAMAGE | F2 (10 V) | 1 | HIT pari a 6 + V residua / 2 | R | 1 | `ExtremelyViolentBlow`, riprogettata (oggi 20 V e 20 + V/2) | Quantità variabile; oggi peggio di una carta morta. Media sotto la linea, picco se accumula | dati |
| SPA-AR3 | Azione, regolare | RESOURCES | F0 | 0 | Annuncia GARGANTUESCO IMPATTO SUL TU. Se lo trovi: +25 V, +15 A. Se non lo trovi: +5 V, +5 A. | NC | 2 | `Glare`, «PAZIENZA: FINITA», D55 | Annuncio D79; premio pieno e ripiego alternativi | dati + search |
| SPA-AR4 | Azione, regolare | DEFENSE | F0 | 0 | CUT ricevuto ×0,5 per 4 turni; +10 V | C | 2 | `MadeOfStone`, conservata | Difesa che carica, contro chi lo taglia (Mara) | dati |
| SPA-AR5 | Azione, regolare | COUNTER | F1 (5 V) | 2 | Annulla la mossa successiva dell'avversario | NC | 2 | `YouStop`, riprogettata: tolti i +10 A regalati all'avversario | Contromossa «Fermati!»; sotto il listino anche per i bot (SB-17) | Java |
| SPA-AR6 | Azione, regolare | RESOURCES | F0 | 0 | Annuncia SPEDIAMOTI DUNQUE IN O-AHIO. Se lo trovi: +15 V, +15 A. Se non lo trovi: +5 V, +5 A. | NC | 1 | `base.bruiser.TiFaccioSpazio`, «TI FACCIO SPAZIO» | Secondo annuncio verso il raro, D79 | dati + search |

**Mara (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| MAR-AR1 | Azione, regolare | DAMAGE | F1 (~~10~~ ~~5~~ 20 A², passo 3) | 1 | ~~12 CUT~~ CUT pari a 18 più metà della A residua (passo 3, D82) | R | 1 | bozza «Cinghiata di traverso» | Picco con A preparata | dati |
| MAR-AR2 | Azione, regolare | DAMAGE | F2 (~~20~~ 15 A²) | 1 | ~~22~~ 25 CUT³ | NC | 2 | prova «Sgommata», 15 A → 20 A | Il taglio grosso, pagato in precedenza | dati |
| MAR-AR3 | Azione, regolare | DISRUPT | F0 | 2 | −8 A al bersaglio; 3 CUT | C | 2 | prova «Sorpasso in curva», resa gratuita | Contromossa senza annullare: le toglie la parità | dati |
| MAR-AR4 | Azione, regolare | DEFENSE | F1 (5 A) | 2 | HIT e CUT ricevuti ×0,4 nel turno; +5 A | NC | 2 | «Tra due paraurti», D55 | Difesa che rimborsa il costo anche senza attacco | dati |
| MAR-AR5 | Azione, regolare | RESOURCES | F0 | 2 | Annuncia Sgommata. Se lo trovi: +15 A. Se non lo trovi: +5 A. | NC | 2 | «Slalom d'avvicinamento», già Slalom, D55 | Annuncio D79; premio pieno e ripiego alternativi | dati + search |
| MAR-AR6 | Azione, regolare | RESOURCES | F0 | 2 | Annuncia Cinghiata di traverso. Se lo trovi: ~~+15~~ +20 A. Se non lo trovi: +5 A. | NC | 1 | `base.mara.TiStringoLaCurva`, «Ti stringo la curva» | Secondo annuncio verso il raro, D79 | dati + search |

² **SB-12a, giro 1** ([correzioni](#correzioni-di-sb-12a)): costi in A −5 su Cinghiata, Sgommata, Paraurti e Slalom (e su GEN-17), il punto di
partenza di D38. Motivo: il listino a 7 HIT di SB-11b dà alla A di Mara circa 1 HIT, non 0,6; con Spazienzio a 0,937 le sue carte stavano
sotto la linea. Slalom scende in F1. ³ **Giri 1 e 3:** Sgommata 22 → 26 CUT nel giro 1 (dopo D38 Spazienzio vinceva ancora 0,593), 26 → 25
nel giro 3 per centrare il matchup fra i quattro stili (0,522) e i tre euristici (0,484).

**Celestina (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| TOS-AR1 | Azione, regolare | RESOURCES | F0 | 1 | Annuncia Tossicone Scatarrante. Se lo trovi: +10 T, +5 A (passo 3). Se non lo trovi: +5 T. | NC | 2 | «Dose in preparazione», già `MethDrivenRage`, D55; numero SB-16e | Annuncio D79; premio pieno e ripiego alternativi | dati + search |
| TOS-AR2 | Azione, regolare | DAMAGE | F1 (10 T) | 1 | ~~12~~ 18 POISON (passo 3, D82) e +5 T al bersaglio | NC | 2 | `Cough`, «Tossicone Scatarrante», 8 → 12 POISON (D55) | Colpo cercato, utile anche nello specchio immune alla T | dati |
| TOS-AR3 | Azione, regolare | RESOURCES | F0 | 1 | Guadagna T/2 HEALTH; perde T | C | 2 | `PervertedMetabolism`, conservata | Difesa: curarsi col veleno; 8,3 HIT, in linea | dati |
| TOS-AR4 | Azione, regolare | COUNTER | F1 (10 T) | 2 | Annulla le mosse successive dirette a lei | NC | 2 | `AmphetamineReflexes`, conservata | Contromossa; sotto il listino anche per i bot | Java |
| TOS-AR5 | Azione, regolare | DISRUPT | F1 (10 T) | 1 | Trasferisce la T residua dopo il costo al bersaglio, azzera la propria e toglie l'immunità del bersaglio, poi 12 POISON (passo 3, D82, parametro `poison` D84); a fine turno, dopo il periodico, l'autore ottiene immunità a T | R | 1 | `ToxicBloodDrain`, conservata | Combo con TOS-BO2: accettata perché costa una carta pagata (SB-9), da misurare in SB-13 | Java |
| TOS-AR6 | Azione, regolare | RESOURCES | F0 | 1 | Annuncia C'è del sangue nella mia droga. Se lo trovi: ~~+10~~ +20 T. Se non lo trovi: +5 T. | NC | 1 | `base.tossico.UnAssaggino`, «Un assaggino» | Secondo annuncio verso il raro, D79 | dati + search |

**Piera (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| PIN-AR1 | Azione, regolare | DAMAGE | F1 (5 L) | 1 | 5 HIT a sé; 25 HIT | C | 2 | bozza «Testata da ultimo giro», 20 → 25 HIT in SB-16e | Attacco: costo basso (D33), pressione con meno salute | dati |
| PIN-AR2 | Azione, regolare | DAMAGE | F0 | 1 | HIT pari a ~~3~~ ~~10⁶~~ 18 (passo 3) + L residua, poi azzera L | NC | 2 | `GoingBerserk`, riprogettata (oggi 10 L, spesso impagabile) | Spendi tutto subito; mai morta | Java nuova: memorizza la L, la azzera, poi colpisce (decisione B1) |
| PIN-AR3 | Azione, regolare | DEFENSE | F0 | 2 | HIT ricevuto ×0,5 nel turno; +5 L. Solo nel braccio B del passo 3: anche POISON ×0,5 nel turno, periodico incluso (D67, D82) | C | 2 | bozza «Il bancone regge, io pure» (era una bound); variante B in `set-base/bancone-b.json` | Difesa che lo rifornisce | dati |
| PIN-AR4 | Azione, regolare | RESOURCES | F0 | 1 | Annuncia Estasi da Coca Etilene. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. | NC | 2 | «Un altro e arrivo», già Offro io, D55; numeri SB-16e e SB-16e2 | Annuncio D79; premio pieno e ripiego alternativi | dati + search |
| PIN-AR5 | Azione, regolare | DISRUPT | F1 (5 L) | 1 | Spende tutta la L residua dopo il costo: il bersaglio perde A pari alla L spesa e subisce HIT pari a 14 più il doppio della L spesa (passo 3, D82) | R | 1 | bozza «Rutto a distanza sociale», riprogettata a quantità variabile | Picco con tanta L | Java nuova `base.pino.RuttoADistanzaSociale` (D84): memorizza, azzera, poi colpisce |
| PIN-AR6 | Azione, regolare | RESOURCES | F0 | 1 | Annuncia Rutto a distanza sociale. Se lo trovi: +15 L, +35 A. Se non lo trovi: +5 L, +10 A. | NC | 1 | `base.pino.PrimaIlBrindisi`, «Prima il brindisi» | Secondo annuncio verso il raro, D79 | dati + search |

**Beppe (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| GIG-AR1 | Azione, regolare | ITEMS | F1 (5 V) | 1 | Distrugge un oggetto lontano | NC | 2 | `BreakYourToy` riprogettata come bozza «Smontiamo tutto» (era una bound) | Contromossa; distruzione pagata e scartata, non ripetibile | Java |
| GIG-AR2 | Azione, regolare | DAMAGE | F1 (~~5~~ 10 V, passo 3) | 1 | ~~10~~ ~~12~~ ~~22~~ 18 CUT⁷ (passo 3, D82; correzione 1.5, D90) | NC | 2 | bozza «Chiave da tredici», 8 → 10 CUT | Attacco medio | dati |
| GIG-AR3 | Azione, regolare | RESOURCES | F0 | 1 | 4 CUT al bersaglio (passo 3). Annuncia Chiave da tredici. Se lo trovi: ~~+10~~ +15 V. Se non lo trovi: +5 V. | NC | 2 | «Preparo il lavoro», già Colpo di chiave inglese, D55 | Annuncio D79; premio pieno e ripiego alternativi | dati + search |
| GIG-AR4 | Azione, regolare | DEFENSE | F1 (5 V) | 2 | HIT ricevuto ×0,5 e CUT ×0,75 nel turno; +5 V, +5 A (passo 3, D82) | C | 1 | «Sotto il cofano», D55 | Copertura e rimborso; non genera V nette, la A separa i gruppi dal turno dopo | dati |
| GIG-AR5 | Azione, regolare | DAMAGE | ~~F2 (10 V)~~ ~~F1 (5 V)⁷~~ F2 (10 V, passo 3) | 1 | ~~6~~ 14 HIT più ~~4~~ ~~7~~ 4 per ogni proprio oggetto sul campo (passo 3, D82; correzione 1.5, D90) | R | 1 | da inventare («Lavoro fatto bene») | Picco a tavolo pieno, debole a tavolo vuoto | Java nuova: conta gli oggetti propri, poi colpisce (`base.gigi.LavoroFattoBene`, SB-15) |
| GIG-AR6 | Azione, regolare | RESOURCES | F0 | 1 | 4 CUT al bersaglio (passo 3). Annuncia Lavoro fatto bene. Se lo trovi: +10 V. Se non lo trovi: +5 V. | NC | 1 | `base.gigi.UnaStrettaDiProva`, «Una stretta di prova» | Secondo annuncio verso il raro, D79 | dati + search |

**Sergio (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| CES-AR1 | Azione, regolare | DISRUPT | F1 (5 A) | 2 | −10 A al bersaglio; 4 HIT | C | — | bozza «Oh, guarda là», più 4 HIT | Attacco: la frecciatina | dati |
| CES-AR2 | Azione, regolare | COUNTER | F2 (15 A) | 2 | Annulla la mossa successiva e ne esegue l'effetto sul bersaglio come autore | NC | — | `WhatchaDoin`, riprogettata: 10 V + 10 A → 15 A | Il suo cuore; oggi non si gioca mai per i costi doppi | Java |
| CES-AR3 | Azione, regolare | COUNTER | F1 (10 A) | 2 | Annulla le mosse successive dirette a lei | NC | — | da inventare («Lo sapevo») | Seconda lettura | Java (classe di `AmphetamineReflexes`) |
| CES-AR4 | Azione, regolare | DISRUPT | F1 (5 V + 5 A) | 2 | 5 HIT; −5 A al bersaglio | NC | — | bozza «Parli troppo vicino» | Usa la V come seconda risorsa | dati |
| CES-AR5 | Azione, regolare | DEFENSE | F1 (5 A) | 2 | CUT ricevuto ×0,5 e HIT ×0,75 nel turno | C | — | da inventare («Fare la vaga») | Difesa | dati |
| CES-AR6 | Azione, regolare | DISRUPT | F1 (10 A) | 2 | Il bersaglio perde A pari a metà della A residua di Sergio; 5 HIT | R | — | da inventare («Malelingue») | Picco con A alta | dati |

**Duccio (6)**

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| ROC-AR1 | Azione, regolare | DAMAGE | F2 (12 HEALTH) | 0 | 22 HIT | C | — | prova «Colpo pagato col sangue», 15 → 12 HEALTH, 35 → 22 HIT | Attacco; la prova stava 11 HIT sopra la linea | dati |
| ROC-AR2 | Azione, regolare | DEFENSE | F0 | 2 | HIT ricevuto ×0,5 nel turno | C | — | prova «Incassare» | Difesa; nulla contro CUT e POISON | dati |
| ROC-AR3 | Azione, regolare | DEFENSE | F1 (8 HEALTH) | 2 | HIT ricevuto ×0,5 nel turno; 8 HIT | NC | — | prova «Contrattacco» | Contromossa: para e risponde; sprecata se l'avversario non attacca | dati |
| ROC-AR4 | Azione, regolare | DAMAGE | F3 (20 HEALTH) | 0 | 30 HIT | NC | — | da inventare («Uppercut della sagra») | Il colpo grosso, che lo avvicina allo zero | dati |
| ROC-AR5 | Azione, regolare | DAMAGE | F0 | 1 | 6 HIT | C | — | da inventare («Tre schiaffi, un euro») | Il colpo gratuito per i turni senza salute da spendere | dati |
| ROC-AR6 | Azione, regolare | RESOURCES | F0 | 0 | +15 HEALTH; HIT ricevuto ×1,25 per 2 turni | R | — | da inventare («Secondo fiato») | Picco: la cura vale doppio per lui (SB-9); rischio di partite lunghe da misurare in SB-18 | dati |

### Azioni generiche (23)

Giocabili da tutti. Nessuna annulla mosse (Mara non deve averne) e nessuna costa HEALTH (decisione 5).

| ID | Tipo | Ruolo | Fascia | Pr. | Effetto indicativo | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---:|---|---|---|---|---|---|
| GEN-01 | Azione, regolare | ITEMS | F0 | 1 | Consuma un proprio oggetto | C | Celestina 2, Piera 2 | `Grab`, conservata | Presa più rapida di molte basic | consume |
| GEN-02 | Azione, regolare | ITEMS | F1 (10 A) | 0 | Ruba un oggetto lontano | C | Mara 1, Celestina 1, Beppe 2 | `Steal`, conservata | Furto; oggi mai giocata, da rimisurare con avversari ricchi di oggetti | Java |
| GEN-03 | Azione, regolare | ITEMS | F0 | −1 | Scambia tutti gli oggetti | NC | — | `ShuffleFeet`, conservata | Scambio; tecnica contro Beppe | Java |
| GEN-04 | Azione, regolare | ITEMS | F1 (10 A) | 0 | Copia vicino a sé un oggetto casuale del bersaglio | R | — | `BeggingMoney`, riprogettata: 25 T → 10 A, niente −10 A | Copia; aperta a tutti | Java |
| GEN-05 | Azione, regolare | DAMAGE | F2 (10 V) | 1 | 18 HIT (solo stati GOOD dell'autore) | C | Spazienzio 2, Beppe 1 | `SeagullFly`, 15 → 18 HIT | Colpo medio a V; oggi sotto la linea | dati |
| GEN-06 | Azione, regolare | DAMAGE | F3 (15 V) | 0 | 24 HIT | C | Spazienzio 1, Beppe 2 | bozza «Mattone del cantiere», 10 V/18 → 15 V/24 | Colpo grosso generico, diverso da GEN-05 | dati |
| GEN-07 | Azione, regolare | DAMAGE | F3 (20 V) | 1 | 30 HIT; azzera T e L del bersaglio | NC | Spazienzio 1 | `HealingBlow`, conservata | Tecnica contro Celestina e Piera; in linea | dati |
| GEN-08 | Azione, regolare | DAMAGE | F3 (15 V) | 1 | 10 HIT; +10 T al bersaglio | C | — | `SickeningBlow`, conservata | Veleno per chi non è Celestina; in linea con l'unità a 7 | dati |
| GEN-09 | Azione, regolare | DISRUPT | F2 (10 V) | 1 | −10 A al bersaglio; 12 HIT | NC | — | `StunningBlow`, 15 → 10 V, 10 → 12 HIT | Oggi peggio di una carta morta: la precedenza è ordinale | dati |
| GEN-10 | Azione, regolare | OTHER | F1 (5 V) | 1 | Toglie gli equip al bersaglio; 8 HIT | NC | — | `BadEducation`, 10 → 5 V | Tecnica contro Beppe, ora che gli equip esistono | Java |
| GEN-11 | Azione, regolare | DEFENSE | F2 (10 V) | 2 | HIT ricevuto ×0,35 nel turno | NC | — | `CantFeelAnything`, 20 → 10 V, tolti +10 A | Parata forte; oggi quasi mai giocata | dati |
| GEN-12 | Azione, regolare | DAMAGE | F1 (10 A) | 0 | +5 V a sé; 12 HIT | C | Celestina 2 | bozza «Rincorsa dal marciapiede», +10 → +5 V, 15 → 12 HIT | Colpo a costo A aperto a tutti | dati |
| GEN-13 | Azione, regolare | DEFENSE | F1 (5 A) | 2 | HIT e CUT ricevuti ×0,6 nel turno; +3 HEALTH | C | Spazienzio 2, Mara 1 | «Tartaruga sul marciapiede», D55 | Difesa generica con piccola cura anche se non viene attaccata | dati |
| GEN-14 | Azione, regolare | RESOURCES | F0 | 0 | −5 A a sé; +10 V | C | Spazienzio 1 | bozza «Denti stretti» | Carica per chi usa V | dati |
| GEN-15 | Azione, regolare | OTHER | F0 | 1 | 5 HIT a sé; azzera la propria T e la propria L | NC | — | bozza «Due dita in gola» | Pulizia propria; costa salute, così non annulla gratis Celestina | dati |
| GEN-16 | Azione, regolare | RESOURCES | F0 | 0 | −5 A a sé; +8 HEALTH | C | Celestina 1, Piera 2 | bozza «Fasciatura col fazzolettaccio», resa gratuita | Cura generica; la perdita di A è un effetto, quindi è giocabile anche da Piera | dati |
| GEN-17 | Azione, regolare | DAMAGE | F1 (~~10~~ 5 A²) | 1 | 12 POISON | C | Mara 2 | bozza «Sputo da posacenere», 5 T → 10 A | POISON diretto per tutti: aggira le parate contro HIT e CUT | dati |
| GEN-18 | Azione, regolare | DAMAGE | F0 | 1 | 7 HIT | C | Mara 2, Piera 2, Beppe 1 | da inventare («Spintone») | La carta da un'unità: riempitivo onesto, mai morto | dati |
| GEN-19 | Azione, regolare | DAMAGE | F2 (10 V + 5 L) | 1 | 25 HIT | R | — | da inventare («Bottigliata») | Picco condizionato: serve sia V sia L (Cocktail, Grappa) | dati |
| GEN-20 | Azione, regolare | DAMAGE | F3 (20 V) | 0 | 30 HIT; HIT ricevuto ×1,25 per 2 turni | R | — | da inventare («Sedia in testa») | Picco più alto, con un rischio | dati |
| GEN-21 | Azione, regolare | OTHER | F1 (5 V) | 1 | Equip: il prossimo HIT inflitto ×1,5 e convertito in CUT, uso singolo | R | — | da inventare («Coccio di bottiglia»), effetto del token `BrokenBeerBottle` | Prepara il colpo e aggira le parate contro HIT | equip |
| GEN-22 | Azione, regolare | DISRUPT | F1 (5 A) | 2 | Azzera la L del bersaglio; 3 HIT | NC | — | da inventare («Acqua in faccia») | Tecnica economica contro Piera | dati |
| GEN-23 | Azione, regolare | DISRUPT | F1 (10 A) | 2 | Il bersaglio perde 10 V; 5 HIT | R | — | da inventare («Sgambetto») | Picco contro chi accumula V (Spazienzio, Beppe) | dati |

² **SB-12a, giro 1:** GEN-17 da 10 a 5 A con le carte di Mara (D38), perché nello starter base la usa solo lei. È una generica: chi la
mette in un altro starter (Duccio, SB-18) la prende a 5 A, e il suo prezzo va riguardato lì.

### Oggetti (16) e token

Si consumano con una presa; il loro valore è quello di una presa, non di uno slot in mano (listino).

| ID | Tipo | Ruolo | Effetto del consumo, indicativo | Valore stimato | Rarità | Starter | Candidata | Motivo | Forma |
|---|---|---|---|---|---|---|---|---|---|
| OGG-01 | Oggetto | RESOURCES | +12 V, +10 L, +3 T | ≈ 12,5 unità | C | Spazienzio 2 | `CocktailOnTheGround`, +20/+15/+5 → +12/+10/+3 | Il più ricco del set di oggi (20–21 unità) | dati |
| OGG-02 | Oggetto | RESOURCES | +10 L | 3,5 | C | Piera 2 | `RottenBeer`, +5 → +10 L | +5 L diventano 2 a fine turno: oggi è quasi vuota | dati |
| OGG-03 | Oggetto | RESOURCES | +10 L; crea `BrokenBeerBottle` vicino a sé | ≈ 8,5 | NC | Piera 1 | `AnotherRottenBeer`, conservata | Token | Java |
| OGG-04 | Oggetto | RESOURCES | Immunità a T e L; +20 L, +20 T; timer 5 che toglie immunità e stati e fa 20 POISON | non quotabile | R | Celestina 1 | `MarvelousCocktail`, conservata | Timer e immunità | Java |
| OGG-05 | Oggetto | RESOURCES | +20 L; −5 A | ≈ 4,5 | C | Piera 2 | bozza «Amaro nel bicchiere di plastica» | La presa grande di Piera: 20 → 9 L il turno dopo | dati |
| OGG-06 | Oggetto | RESOURCES | +15 A | 7,5 | C | Mara 2, Beppe 1 | bozza «Espresso del distributore», senza +5 T | La T avvelenava chi non è immune | dati |
| OGG-07 | Oggetto | RESOURCES | +12 HEALTH; +3 T | ≈ 12 | C | Mara 2, Celestina 2 | bozza «Panino del kebab dimenticato», +10/+5 → +12/+3 | Cura; la T è carburante per Celestina e un piccolo veleno per gli altri | dati |
| OGG-08 | Oggetto | OTHER | Azzera la propria L | secondo il contesto | NC | — | bozza «Mezza minerale sgasata» | Controlla la propria L; Offro io riprogettata in SB-16d | dati |
| OGG-09 | Oggetto | OTHER | Equip: HIT inflitto ×1,25 per 3 turni | ≈ 5–8 | NC | Beppe 2 | bozza «Guanti da officina» | Equip d'attacco | equip |
| OGG-10 | Oggetto | OTHER | Equip: CUT ricevuto ×0,75 per 3 turni | ≈ 3–8 | C | Mara 1, Beppe 2 | bozza «Giubbotto di finta pelle» | Equip di difesa contro CUT | equip |
| OGG-11 | Oggetto | OTHER | Equip: HIT ricevuto ×0,8 per 3 turni | ≈ 4–8 | C | Beppe 2 | da inventare («Casco da lavoro») | Equip di difesa contro HIT | equip |
| OGG-12 | Oggetto | RESOURCES | +12 T | 1,8 per chi è immune | C | Celestina 2 | da inventare («Pasticca trovata sul bancone») | Carburante; veleno per gli altri | dati |
| OGG-13 | Oggetto | OTHER | Equip: il prossimo HIT inflitto ×1,5, uso singolo | picco con SuperImpact | NC | Spazienzio 1 | da inventare («Posacenere di vetro») | L'oggetto di chi tira colpi grossi; capacità 1 | equip |
| OGG-14 | Oggetto | RESOURCES | +10 HEALTH; azzera la propria T | ≈ 10 | NC | — | da inventare («Ghiaccio nel tovagliolo») | Cura e pulizia per i mazzi costruiti | dati |
| OGG-15 | Oggetto | OTHER | Immunità all'effetto periodico di L; timer 3 che la toglie | secondo il contesto | R | — | da inventare («Santino della portinaia») | Tecnica contro l'alcol altrui | Java (classe di `MarvelousCocktail`) |
| OGG-16 | Oggetto | RESOURCES | +25 L; −5 A | ≈ 6,3 | R | — | da inventare («Grappa della casa») | Picco per chi spende L; con GEN-19 | dati |
| token | Token (non contato) | OTHER | Equip: HIT inflitto ×1,5 convertito in CUT, uso singolo | — | — | da OGG-03 | `BrokenBeerBottle`, conservato | Unico token del set | equip |

## Starter

Basic, due bound comuni e last resort a parte (R01a). «Archetipo · generiche · oggetti» in copie; il nome proprio viene dalla bozza dove
c'è.

| Starter | Basic, bound, last resort | Archetipo | Generiche | Oggetti | Distinte | Rare |
|---|---|---|---|---|---:|---:|
| Spazienzio «Pazienza finita» | SPA-BA · SPA-BO1, SPA-BO2 · Struggle | GARGANTUESCO IMPATTO SUL TU 2, SPEDIAMOTI DUNQUE IN O-AHIO 1, PAZIENZA: FINITA 2, NON GIOCARE COL COLTELLO NO 2, FAI BASTA 2, TI FACCIO SPAZIO 1 (**10**) | GABBIANO DUNQUE VOLIAMOTI 2, Tartaruga sul marciapiede 2, Mattone del cantiere 1, ORMALE GUARIAMOTI 1, Denti stretti 1 (**7**) | Negroni Trovato per Terra 2, Posacenere di vetro 1 (**3**) | 13 | 1 |
| Mara «Consegna sul muso» | MAR-BA · MAR-BO1, MAR-BO2 · Struggle | Cinghiata di traverso 1, Sgommata 2, Sorpasso in curva 2, Tra due paraurti 2, Slalom d'avvicinamento 2, Ti stringo la curva 1 (**10**) | Spintone 1, Sputo da posacenere 2, Tartaruga sul marciapiede 1, Steal 1 (**5**) | Espresso del distributore 2, Panino del kebab dimenticato 2, Giubbotto di finta pelle 1 (**5**) | 13 | 1 |
| Celestina «Tutto è droga» | TOS-BA · TOS-BO1, TOS-BO2 · L'ultima dose | Dose in preparazione 2, Tossicone Scatarrante 2, Metabolismo Corrotto 2, Riflessi Aumentati dalla Speed 2, C'è del sangue nella mia droga 1, Un assaggino 1 (**10**) | Grab 2, Rincorsa dal marciapiede 1, Steal 1, Fasciatura col fazzolettaccio 1 (**5**) | Pasticca trovata sul bancone 2, Panino del kebab dimenticato 2, Mescolone Micidiale 1 (**5**) | 13 | 2 |
| Piera «Chiude quando dico io» | PIN-BA · PIN-BO1, PIN-BO2 · L'ultimo giro | Testata da ultimo giro 2, Estasi da Coca Etilene 2, Il bancone regge, io pure 2, Un altro e arrivo 2, Rutto a distanza sociale 1, Prima il brindisi 1 (**10**) | Grab 2, Spintone 2, Fasciatura col fazzolettaccio 1 (**5**) | Amaro nel bicchiere di plastica 2, Peroni da 66, calda 2, Tennents Super 1 (**5**) | 12 | 1 |
| Beppe «Intervento sul posto» | GIG-BA · GIG-BO1, GIG-BO2 · Struggle | Smontiamo tutto 2, Chiave da tredici 2, Preparo il lavoro 2, Sotto il cofano 1, Lavoro fatto bene 1, Una stretta di prova 1 (**9**) | Steal 2, GABBIANO DUNQUE VOLIAMOTI 1, Spintone 1 (**4**) | Guanti da officina 2, Giubbotto di finta pelle 2, Casco da lavoro 2, Espresso del distributore 1 (**7**) | 13 | 1 |

Composizioni D79: archetipo/generiche/oggetti in copie 10/7/3, 10/5/5, 10/5/5, 10/5/5 e 9/4/7. Le generiche ridotte restano nel pool; Mattone esce solo dallo starter di Beppe. Rarità delle copie C/NC/R: 10/9/1, 12/7/1, 11/7/2, 13/6/1, 10/9/1.

**Nota di SB-11b** ([rapporto](../../reports/set-base/sb-11b-report.md)): i due starter base sono scritti nella bozza
`server/src/test/resources/set-base/bozza.json` come in questa tabella, senza scostamenti. Il proprietario ha scelto il nome dello starter
di Spazienzio, **«Pazienza finita»**, e ha deciso che i nomi visualizzati delle sue carte (slot `SPA-*`) restino tutti in maiuscolo, perché
«ha perso la pazienza e urla»: SPA-BO3 si chiama quindi «TESTA AL MURO». Le durate «per N turni» valgono `turns: N − 1` (R05): il
Giubbotto ha `turns: 2`, come MadeOfStone ha `turns: 3` per 4 turni.

**Nota di SB-13** ([rapporto](../../reports/set-base/sb-13-report.md)): lo starter del Tossico è scritto nella stessa bozza come in questa
tabella, senza scostamenti nella composizione; i numeri cambiati sono in [Correzioni di SB-13](#correzioni-di-sb-13). Il nome proprio è
**«Tutto è droga»**, il flavour di `EverythingIsDrug` che la basic assorbe. Le carte di oggi tengono il loro nome italiano del catalogo
(«Desiderio Incontrollabile», «Ago Marcio e Spezzato», «Rabbia Psicotica da Meth»…); le nuove usano il nome di lavoro della griglia
(«Raschiare il fondo», «L'ultima dose», «Pasticca trovata sul bancone»). Due letture del codice, da tenere per SB-25: il timer di
TOS-AR5 rende l'immunità a T **all'autore**, non al bersaglio (serve al Tossico che l'ha persa); il timer di OGG-04 toglie **tutte** le
immunità, compresa quella propria del Tossico, che resta senza finché non gioca TOS-AR5.

**Nota di SB-14** ([rapporto](../../reports/set-base/sb-14-report.md)): lo starter di Pino è scritto nella stessa bozza come in questa
tabella, senza scostamenti nella composizione; il nome proprio resta quello della bozza esterna, **«Chiude quando dico io»**, e i numeri
cambiati sono in [Correzioni di SB-14](#correzioni-di-sb-14). PIN-AR2 e LR-PIN usano la classe di B1, scritta nei sorgenti di test
(`base.pino.GoingBerserk` e la sottoclasse `base.pino.UltimoGiro`, che è last resort). PIN-AR2 tiene il nome del catalogo di
`GoingBerserk`, «Estasi da Coca Etilene»; OGG-02 e OGG-03 tengono «Peroni da 66, calda» e «Tennents Super»; le nuove usano il nome di lavoro.

**Nota di SB-15** ([rapporto](../../reports/set-base/sb-15-report.md)): lo starter di Gigi è scritto nella stessa bozza come in questa
tabella, senza scostamenti nella composizione; il nome proprio resta quello della bozza esterna, **«Intervento sul posto»**, e i numeri
cambiati sono in [Correzioni di SB-15](#correzioni-di-sb-15). GIG-AR5 usa la classe Java di D35, scritta nei sorgenti di test
(`base.gigi.LavoroFattoBene`): conta gli oggetti propri sul campo dopo i costi (gli equip non contano: sono oggetti già consumati) e poi
colpisce. GIG-AR1 è la classe di oggi `BreakYourToy` col nome di bozza «Smontiamo tutto», e costo e priorità scritti nella bozza (5 V, 1);
le nuove usano il nome di lavoro. La stessa modifica porta la bozza al formato `sb-6b/1` con le rarità di questa griglia su ogni carta e
personaggio (D44, punto 6), senza cambiare le partite.

**Generiche condivise:** 11 distinte su 20 usi. Ogni starter ne condivide almeno 2, nessuna è in più di 3 starter, e le due base
condividono solo Tartaruga. Restano nella collezione 12 generiche (GEN-03, 04, 08, 09, 10, 11, 15, 19–23) e 4 oggetti (OGG-08, 14, 15, 16).

**Mazzi di prova dei personaggi da booster** (SB-17, SB-18; forma, non composizione fissata):

| Mazzo | Archetipo | Generiche, di preferenza fuori dagli starter | Oggetti |
|---|---|---|---|
| Sergio | 6 distinte, 11 carte | StunningBlow, Sgambetto, ShuffleFeet, Acqua in faccia, Tartaruga (6 carte) | Santino 1, Espresso 2 |
| Duccio | 6 distinte, 11 carte | Spintone, Fasciatura, Sputo, Grab (5 carte) | Ghiaccio 2, Kebab 2 |

La ricerca per mutazione di SB-7 dà poi il mazzo più forte di ciascuno come limite superiore: contro gli starter può arrivare al 65–70%.

## Triangoli

| Personaggio | Attacco | Difesa | Contromossa |
|---|---|---|---|
| Spazienzio | SPA-AR1, SPA-AR2 | SPA-AR4 | SPA-AR5 (annulla) |
| Mara | MAR-AR1, MAR-AR2 (preparata da MAR-AR5) | MAR-AR4 | MAR-AR3 e la basic (−A e anticipo, **senza annullare**) |
| Celestina | TOS-AR2 (preparata da TOS-AR1) | TOS-AR3 | TOS-AR4 (annulla) |
| Piera | PIN-AR1, PIN-AR2 (preparata da PIN-AR4) | PIN-AR3 | PIN-AR5 (−A) |
| Beppe | GIG-AR2, GIG-AR5 (preparata da GIG-AR3), OGG-09 | GIG-AR4, OGG-10, OGG-11 | GIG-AR1 (distrugge); GEN-02 |
| Sergio | CES-AR1, CES-AR6 | CES-AR5 | CES-AR2, CES-AR3 (annullano) |
| Duccio | ROC-AR1, ROC-AR4 | ROC-AR2 | ROC-AR3 (para e risponde) |

Coppie da tenere distinte (SB-9): Mara non annulla, Sergio sì; Beppe non ha colpi oltre F2, salvo GEN-06 in prestito.

## Mappa delle carte attuali

Le 37 carte e i 2 personaggi di R07. Posizione rispetto al listino misurata in SB-10a con l'àncora da 10 HIT; con l'unità a 7 le linee
scendono di circa 3 HIT (stima). «Peggio di morta»: una gemella mai giocata la batte.

| Carta | Esito | Slot | Flavour | Listino | Motivo |
|---|---|---|---|---|---|
| `BigBadBruiser` | conservata | PG-SPA | invariato | — | Metro del set (SB-9) |
| `ToxicJunkie` | riprogettata (capacità 3 → 2) | PG-TOS | invariato | — | Gli oggetti diventano di Beppe (SB-9) |
| `LittleSmack` | riprogettata | SPA-BO2 | nome e tono | oltre il tetto (7,5) | Una funzione: 3 HIT |
| `LittleRage` | riprogettata | SPA-BO1 | nome e tono | oltre il tetto (6,75) | Una funzione: +5 V; niente parata |
| `PatheticBlade` | riprogettata | TOS-BO1 | nome e tono | oltre il tetto per struttura | 3 CUT, niente T che resta |
| `RottenSmile` | riprogettata | TOS-BO3 | nome; il sorriso diventa alito | oltre il tetto per struttura; dannosa (−1,1 per uso) | 2 POISON, niente −A che resta |
| `BruiserGrab` | conservata | SPA-BA | invariato | non quotabile | Il tratto è la lentezza |
| `ToxicGrab` | riprogettata | TOS-BA | nome; assorbe «tutto è droga» | non quotabile | +5 T invece di perdere metà della A |
| `Struggle` | conservata | LR-STR | invariato | in linea col ruolo | Last resort generica |
| `Grab` | conservata | GEN-01 | invariato | non quotabile | Presa generica |
| `Steal` | conservata | GEN-02 | invariato | non quotabile; mai giocata (SB-7) | Furto |
| `ShuffleFeet` | conservata | GEN-03 | invariato | non quotabile; mai giocata | Scambio |
| `BadEducation` | riprogettata (10 → 5 V, 10 → 8 HIT) | GEN-10 | invariato | sotto; peggio di morta | Ora che gli equip ci sono, serve come tecnica |
| `BreakYourToy` | riprogettata, passa a Beppe | GIG-AR1 | prende il nome di bozza «Smontiamo tutto» | sotto; peggio di morta (il bot non la sceglie) | La distruzione è la contromossa di Beppe |
| `CantFeelAnything` | riprogettata (20 → 10 V, senza +10 A) | GEN-11 | invariato | sotto; peggio di morta | Parata forte a un costo pagabile |
| `ExtremelyViolentBlow` | riprogettata (10 V, 6 + V/2) | SPA-AR2 | invariato | molto sotto; peggio di morta | Il bot legge «20+x»; ora picco solo con molta V |
| `Glare` | carica più ricerca (D55) | SPA-AR3 | invariato | da rimisurare in SB-16e | Carica rischiosa che cerca SPA-AR1 |
| `HealingBlow` | conservata | GEN-07 | invariato | in linea | Tecnica contro T e L |
| `MadeOfStone` | conservata | SPA-AR4 | invariato | in linea (6,5) | Difesa che carica |
| `SeagullFly` | riprogettata (15 → 18 HIT) | GEN-05 | invariato | sotto | Colpo medio in linea |
| `SickeningBlow` | conservata | GEN-08 | invariato | in linea | Veleno generico |
| `StunningBlow` | riprogettata (10 V, 12 HIT) | GEN-09 | invariato | sotto; peggio di morta | −10 A vale poco: costo più basso |
| `SuperImpact` | conservata | SPA-AR1 | invariato | in linea | Il colpo grosso |
| `YouStop` | riprogettata (senza +10 A all'avversario) | SPA-AR5 | invariato | sotto; peggio di morta (bot) | Contromossa di Spazienzio; non si elimina (SB-17) |
| `WhatchaDoin` | riprogettata (15 A), passa a Sergio | CES-AR2 | invariato | sotto; peggio di morta (costi doppi) | Il cuore di Sergio (SB-9) |
| `AmphetamineReflexes` | conservata | TOS-AR4 | invariato | sotto (bot) | Contromossa di Celestina |
| `BadTrip` | **sostituita** | — | idea conservata in TOS-AR5 | sotto | Timer e immunità li copre ToxicBloodDrain; raddoppiare T contrasta la decisione 4 |
| `BeggingMoney` | riprogettata (10 A, niente −10 A), generica | GEN-04 | invariato | sotto | La copia di oggetti resta nel set, aperta a tutti |
| `Cough` | riprogettata (12 POISON e +5 T, D55) | TOS-AR2 | invariato | sotto (3,9) | Intossicare: POISON diretto |
| `EverythingIsDrug` | **sostituita** | TOS-BA | nella basic | sotto; peggio di morta | Consumare un oggetto senza effetti per T non serve |
| `GoingBerserk` | riprogettata (gratuita, L residua) | PIN-AR2 | invariato; passa a Piera | vale il suo danno, ma spesso impagabile | D33: niente costi in L oltre 5 |
| `LethalHeroinDose` | riprogettata, last resort | LR-TOS | invariato | sotto; il bot non la gioca | D29: l'ultima dose |
| `MethDrivenRage` | caricamento gratuito di T (D55) | TOS-AR1 | Dose in preparazione | da rimisurare in SB-16e | Cerca TOS-AR2 e si espone |
| `PervertedMetabolism` | conservata | TOS-AR3 | invariato | in linea (8,3) | Difesa di Celestina |
| `ToxicBloodDrain` | conservata | TOS-AR5 | invariato | sotto | Rara di Celestina |
| `CocktailOnTheGround` | riprogettata (+12 V, +10 L, +3 T) | OGG-01 | invariato | stima 20–21 unità | Troppo ricco |
| `RottenBeer` | riprogettata (+10 L) | OGG-02 | invariato | stima 1,75 | Quasi vuota |
| `AnotherRottenBeer` | conservata | OGG-03 | invariato | stima 3,5 più il token | Token |
| `MarvelousCocktail` | conservata | OGG-04 | invariato | non quotabile | Rara di Celestina |

Conteggio sulle 39: 16 conservate (`BigBadBruiser` compreso), 21 riprogettate (`ToxicJunkie` compreso), 2 sostituite; nessun flavour
scartato senza un posto.

## Mappa della bozza esterna

Le 31 carte nuove della [proposta](bozza-esterna-proposta-70-carte.md). Tutte assegnate; nessuna scartata.

| Carta della bozza | Slot | Cambiamento |
|---|---|---|
| Pino l'Ultimo Giro | PG-PIN | V 10 → 0, nessuna immunità (D28) |
| Mara Contromano | PG-MAR | V 10 → 0 |
| Gigi del Carro Attrezzi | PG-GIG | invariato |
| Questo lo finisco io | PIN-BA | invariata |
| Preso al volo | MAR-BA | −10 → −5 A |
| Questo torna utile | GIG-BA | +4 V, senza −5 A, priorità 0 |
| Cinque minuti e vado | PIN-BO1 | +5 L (D38/D54): 3,75 per uso con D50, tetto invariato |
| Il bancone regge, io pure | PIN-AR3 | da bound ad azione regolare: niente parate fra le bound |
| Passo stretto | MAR-BO1 | solo 3 CUT |
| Tra due paraurti | MAR-AR4 | da bound ad azione pagata |
| Una stretta e passa | GIG-BO1 | solo +5 V |
| Smontiamo tutto | GIG-AR1 | da bound (bersaglia un oggetto) ad azione pagata, unita a `BreakYourToy` |
| Mattone del cantiere | GEN-06 | 15 V, 24 HIT, per non doppiare SeagullFly |
| Chiave da tredici | GIG-AR2 | 10 CUT |
| Cinghiata di traverso | MAR-AR1 | invariata |
| Rincorsa dal marciapiede | GEN-12 | +5 V, 12 HIT |
| Testata da ultimo giro | PIN-AR1 | 5 L, 25 HIT (numero SB-16e, prima 20) |
| Rutto a distanza sociale | PIN-AR5 | −A pari alla L residua |
| Oh, guarda là | CES-AR1 | più 4 HIT; passa a Sergio, perché Mara ha già Sorpasso |
| Denti stretti | GEN-14 | invariata |
| Tartaruga sul marciapiede | GEN-13 | aggiunge cura 3 (D55) |
| Due dita in gola | GEN-15 | invariata |
| Fasciatura col fazzolettaccio | GEN-16 | gratuita, −5 A, +8 HEALTH |
| Sputo da posacenere | GEN-17 (e l'idea in TOS-AR2) | 10 A, 12 POISON: generica vera |
| Parli troppo vicino | CES-AR4 | passa a Sergio |
| Amaro nel bicchiere di plastica | OGG-05 | invariato |
| Espresso del distributore | OGG-06 | senza +5 T |
| Panino del kebab dimenticato | OGG-07 | +12 HEALTH, +3 T |
| Mezza minerale sgasata | OGG-08 | invariata |
| Guanti da officina | OGG-09 | invariati |
| Giubbotto di finta pelle | OGG-10 | invariato |

Dalla bozza si tengono anche i nomi propri di tre starter. **Non** si tengono: l'immunità di Pino (D28), le bound a due funzioni, le
bound che bersagliano oggetti, gli starter di Bruiser e Junkie invariati e il regolamento 1.5 (piano, «Ciò che non vale più»).

## Tabelle di controllo

**Per blocco**

| Blocco | Piano | Griglia |
|---|---:|---:|
| Personaggi | 7 | 7 |
| Basic | 7 | 7 |
| Bound | 21 | 21 |
| Last resort | 4 | 4 |
| Azioni d'archetipo | 42 (D79) | 42 |
| Azioni generiche | 25 → 23 (decisione 1) | 23 |
| Oggetti | 16 | 16 |
| **Totale** | **120** | **120** |

**Per personaggio** (carte legate: basic, bound, archetipo, last resort propria)

| Personaggio | Basic | Bound | Archetipo | Last resort | Totale |
|---|---:|---:|---:|---|---:|
| Spazienzio | 1 | 3 | 6 | Struggle | 10 |
| Mara | 1 | 3 | 6 | Struggle | 10 |
| Celestina | 1 | 3 | 6 | propria | 11 |
| Piera | 1 | 3 | 6 | propria | 11 |
| Beppe | 1 | 3 | 6 | Struggle | 10 |
| Sergio | 1 | 3 | 6 | Struggle | 10 |
| Duccio | 1 | 3 | 6 | propria | 11 |
| **Totale** | 7 | 21 | 42 | 3 | **73** |

Più Struggle, 23 generiche, 16 oggetti e 7 personaggi: 120.

**Per rarità**

| Blocco | C | NC | R |
|---|---:|---:|---:|
| Personaggi | 2 | 3 | 2 |
| Basic | 2 | 3 | 2 |
| Bound | 10 | 11 | 0 |
| Last resort | 1 | 2 | 1 |
| Archetipo | 11 | 24 | 7 |
| Generiche | 11 | 7 | 5 |
| Oggetti | 8 | 5 | 3 |
| **Totale** | **45** | **55** | **20** |

D79 porta l’archetipo a 11 C / 24 NC / 7 R. Nota storica: la tabella della fase A dava all'archetipo 19, 9 e 9, che non torna con i totali approvati (54, 41, 20): qui 20, 10 e 7 (decisione B3).
Rare negli starter: 1 o 2 ciascuno.

**Per ruolo** (le 113 carte giocabili; ruoli di R07a)

| Ruolo | Basic | Bound | Last resort | Archetipo | Generiche | Oggetti | Totale |
|---|---:|---:|---:|---:|---:|---:|---:|
| DAMAGE | | 13 | 4 | 12 | 9 | | 38 |
| DEFENSE | | | | 7 | 2 | | 9 |
| RESOURCES | | 8 | | 12 | 2 | 10 | 32 |
| COUNTER | | | | 4 | | | 4 |
| DISRUPT | | | | 6 | 3 | | 9 |
| ITEMS | 7 | | | 1 | 4 | | 12 |
| OTHER | | | | | 3 | 6 | 9 |

**Curva storica SB-10/SB-15 dei costi per starter** (prima di D79; azioni regolari, in copie)

| Starter | F0 | F1 | F2 | F3 | F4 | Azioni |
|---|---:|---:|---:|---:|---:|---:|
| Obiettivo della fase A (su 14–15) | 5–6 | 4–5 | 3 | 1–2 | ≤ 2 | |
| Spazienzio | 5 | 4 | 4 | 2 | 2 | 17 |
| Mara | 5 | 7 | 3 | 0 | 0 | 15 |
| Celestina | 7 | 8 | 0 | 0 | 0 | 15 |
| Piera | 12 | 3 | 0 | 0 | 0 | 15 |
| Beppe | 2 | ~~7~~ 8⁷ | ~~2~~ 1⁷ | 2 | 0 | 13 |

L'obiettivo era tagliato su Spazienzio, che è l'unico con costi alti per natura. Mara, Celestina e Piera pagano con risorse economiche o
limitate (A, T, L fino a 5): la loro curva si appiattisce su F0 e F1, e la scelta diventa *quando* pagare, non *se*. Da guardare in
SB-11–SB-15 con il banco: nessuna carta ferma in mano più di circa 1,5 turni a partita nel proprio starter, e risorse generate entro ±20%
di quelle spese.

**Copertura delle meccaniche di base**

| Meccanica | Slot | In uno starter base |
|---|---|---|
| HIT | SPA-AR1, GEN-05, GEN-18, ROC-AR1… | Spazienzio |
| CUT | MAR-AR1/2, GIG-AR2, bound | Mara |
| POISON diretto | GEN-17, TOS-AR2, TOS-BO3, LR-TOS | Mara (GEN-17) |
| Veleno da T sul bersaglio | GEN-08, TOS-AR2, TOS-AR5, LR-TOS | — (Celestina) |
| −A sul bersaglio | MAR-AR3, GEN-09, CES-AR1/4/6, PIN-AR5 | Mara |
| Ricerca esatta e caricamento visibile | SPA-AR3, MAR-AR5, TOS-AR1, PIN-AR4, GIG-AR3 | entrambi |
| Svuotare il bersaglio | GEN-07, GEN-22 | Spazienzio (GEN-07) |
| −V sul bersaglio | GEN-23 | — |
| Cure | GEN-13, OGG-07, GEN-16, TOS-AR3, ROC-AR6, OGG-14, ROC-BA | Mara (OGG-07) |
| Pulizia propria | GEN-15, OGG-08, OGG-14 | — |
| Stati INPUT, durata 0 e oltre | SPA-AR3/4, MAR-AR4, GEN-13, GEN-11… | entrambi |
| Stati OUTPUT ed equip da oggetti | OGG-09/10/11/13, GEN-21, token | entrambi (OGG-10, OGG-13) |
| Conversione di tipo, uso singolo | token, GEN-21; OGG-13 (uso singolo) | Spazienzio (OGG-13) |
| Timer e immunità | OGG-04, TOS-AR5, OGG-15 | — (Celestina) |
| Token | OGG-03 → `BrokenBeerBottle` | — (Piera) |
| Annullamenti | SPA-AR5, TOS-AR4, CES-AR2/3 | Spazienzio |
| Prendere, rubare, scambiare, distruggere, copiare | basic, GEN-01/02/03/04, GIG-AR1 | entrambi (basic, GEN-02) |
| Quantità variabile | SPA-AR2, PIN-AR2/5, CES-AR6, LR-PIN | entrambi |
| Danno a sé | Struggle, PIN-AR1, GEN-15, SPA-BO3, last resort | entrambi (Struggle) |
| Costo in HEALTH | ROC-AR1/3/4 | — (Duccio) |
| Costi in V, A, T, L | ovunque | V e A |
| Priorità da −1 a 2 | ovunque | entrambi |
| Capacità degli oggetti | PG-*, GIG-AR5 | entrambi (1 e 2) |

SB-11 chiede che ogni meccanica di base compaia in uno dei due mazzi base: mancano T sul bersaglio, alcol, timer, token e costo in
HEALTH, che sono l'identità degli avanzati e dei booster, come vuole il piano.

**Forma** (dove serve lavoro sul formato)

| Forma | Slot | Quante |
|---|---|---:|
| `consume` (passo nuovo) | 7 basic, GEN-01 | 8 |
| `equip` (passo nuovo dentro `status`) | OGG-09/10/11/13, GEN-21, token | 5 + token |
| Java esistente, numeri come parametri | SPA-AR5, TOS-AR4/5, CES-AR2, GIG-AR1, GEN-02/03/04/10, OGG-03/04 | 11 |
| Java esistente usata da una seconda carta | CES-AR3 (`AmphetamineReflexes`), OGG-15 (`MarvelousCocktail`) | 2 |
| Java nuova | GIG-AR5 (conta gli oggetti); PIN-AR2 e LR-PIN (una classe sola che memorizza e azzera L); PIN-AR5 dal passo 3 di SB-16g (D84) | 3 classi, 4 carte |
| dati di oggi | il resto | ≈ 85 |

Il passo `equip` serve già in SB-11 (Giubbotto nello starter di Mara, Posacenere in quello di Spazienzio), non solo in SB-15.
**Nota di SB-11a:** i passi `consume` ed `equip` esistono nei sorgenti di test, provati sulle classi Java che sostituiscono
([rapporto](../../reports/set-base/sb-11a-report.md)); le forme `consume` ed `equip` di questa tabella sono quindi esprimibili, e restano
da scrivere solo le carte (SB-11b). Il caso
«due carte sulla stessa classe Java» va provato nella bozza di SB-6a, che oggi lega una carta Java al nome della sua classe.

<a id="l-e-pino"></a>
## L e Piera

**Lettura storica precedente a SB-16d.** Le formule di decadimento restano; con D50 A si ferma a zero e L dà corazza.
PIN-BO1 ora dà +5 L, non +10; PIN-AR4 ora carica +15 L e +35 A (SB-16e2; +20 A in SB-16e, prima +10 A) e cerca Estasi, senza dare L al bersaglio.
Le vecchie stime di regime e di disturbo seguenti descrivono la versione misurata in SB-14; le nuove misure sono nel
[rapporto SB-16e](../../reports/set-base/sb-16e-report.md).

**La formula.** A fine turno, con L > 0 e senza immunità, si perde A pari a L/2 e poi L pari a L/2 + 1, a divisione intera (R06;
`Character.java`, righe 54–58).

| L a fine turno | A persa | L il turno dopo |
|---:|---:|---:|
| 1–2 | 0–1 | 0 |
| 5 | 2 | 2 |
| 10 | 5 | 4 |
| 11 | 5 | 5 |
| 15 | 7 | 7 |
| 20 | 10 | 9 |
| 21 | 10 | 10 |

Due frasi dei documenti erano sbagliate. Il [listino](listino.md#l-e-gli-effetti-poco-evidenti) scriveva la quantità persa (6, 8, 11) al
posto di quella che resta, e una presa da 18 al posto di 21 per pagare 10 L il turno dopo: **corretto in questa fase**. Il piano
([letture del regolamento](../../set-base-plan.md#letture-del-regolamento-che-guidano-il-progetto)) dice che L «si ferma a 1 o 2 senza
azzerarsi mai»: invece 1 e 2 vanno a zero. Le conclusioni non cambiano: L non è una riserva.

**Effetti poco evidenti e come li usa Piera:**

- **Spendere il turno dopo.** La L presa durante la risoluzione non paga la mossa già presentata. Con un costo di 5 L serve una presa di
  almeno 11 il turno prima: PIN-BO1 (+10, più quanto resta), OGG-05 (+20) e OGG-02 (+10). Il valore iniziale L 10 paga una carta da 5
  subito, al primo turno.
- **Regime con la bound.** Giocando PIN-BO1 ogni turno, Piera si stabilizza a 8–9 L all'inizio del turno: paga sempre una carta da 5 L.
- **A sotto zero.** Nello stesso regime Piera perde circa 9–10 A a fine turno: da 15 scende a 5, poi a −4, poi a −13. R01 lo ammette.
  Conseguenza: nessuna carta a costo A nel suo starter, e GEN-16 (la perdita di A è un effetto, non un costo) è l'unica cura che può
  usare. La precedenza persa vale poco (è ordinale), e Piera arriva comunque ultima: è il suo rischio.
- **L sull'avversario.** PIN-AR4 dà +20 L: a fine turno l'avversario perde 10 A, poi 4, poi 2, cioè circa 16 A in quattro turni. Per
  la precedenza conta poco, perché Piera è già la più lenta. Il valore vero è un altro: **toglie moneta a chi paga in A** (Mara, Sergio,
  Celestina con le generiche). Contro Spazienzio vale poco: va bene, è una contromossa che si sbaglia.
- **Spendere tutto.** PIN-AR2 e LR-PIN fanno danno pari alla L residua e poi la azzerano, come approvato. Il regolamento però applica gli
  effetti su sé *prima* di quelli sul bersaglio (R04): con i passi di oggi l'azzeramento arriverebbe prima del danno. Serve una classe
  Java che memorizzi la L, la azzeri e poi colpisca, come già fa `ToxicBloodDrain` con la T (decisione B1).
- **Rutto (PIN-AR5)** legge la L residua senza consumarla: è a dati. *Dal passo 3 di SB-16g (D82, D84) la spende e la azzera, con una classe Java propria.*
- **I bot.** Leggono solo i propri guadagni e il danno nominale. «HIT 3 + x» rischia di essere sopravvalutato come «20+x» di
  `ExtremelyViolentBlow`: da guardare in SB-14.
- **L agli altri come costo nascosto.** Il Cocktail (OGG-01) dà +10 L anche a Spazienzio, che perde così 5 A a fine turno. La Bottigliata
  (GEN-19) è l'unica carta che premia la L presa da chi non è Piera.
- **La variante con immunità** (D28) si prova solo nel playground in SB-14.

## Idee fuori perimetro, per le espansioni

Da riportare nell'elenco [«Idee per le espansioni»](../../set-base-plan.md#idee-per-le-espansioni) del piano:

- **Danno moltiplicato per una risorsa** (per esempio due HIT per ogni L): il formato sa solo dividere, e il campo nuovo servirebbe a
  una carta sola.
- **Contromosse generiche,** aperte a tutti (un «Ma che fai?»): fuori dal Set Base perché darebbero annullamenti a Mara.
- **Bound di parata** che valgono solo contro il colpo successivo, oltre il tetto per una parata forte: richiedono una regola di consumo.
- **«Tavolo ribaltato»:** distruggere tutti gli oggetti sul campo, propri e altrui.
- **Cassetta degli attrezzi:** un oggetto che crea un token attrezzo (Beppe); vicino all'idea già in elenco di costruire oggetti.
- **Equip permanenti,** senza durata: oggi il passo `status` chiede sempre i turni.

## Correzioni di SB-12a

Giro coi bot sugli starter base, al massimo tre giri ([rapporto](../../reports/set-base/sb-12a-report.md), D38 e la delega del proprietario sui
numeri). Ogni numero cambiato, col giro e il motivo; il resto della griglia non cambia.

| Slot | Numero | Prima | Dopo | Giro | Motivo |
|---|---|---|---|---|---|
| PG-MAR | HEALTH | 85 | 95, poi 80 | 1, 2 | D38; poi la durata, insieme a Spazienzio |
| PG-SPA | HEALTH | 100 | 85 | 2 | La durata e i mazzi esauriti, a matchup fermo |
| MAR-AR1 Cinghiata | costo | 10 A | 5 A | 1 | D38: la A di Mara vale circa 1 HIT (listino a 7 HIT) |
| MAR-AR2 Sgommata | costo | 20 A | 15 A | 1 | D38 |
| MAR-AR2 Sgommata | danno | 22 CUT | 26, poi 25 CUT | 1, 3 | Secondo passo dopo D38 (0,593 → 0,525); poi centratura fra gli stili |
| MAR-AR4 Paraurti | costo | 10 A | 5 A | 1 | D38 |
| MAR-AR5 Slalom | costo | 15 A | 10 A | 1 | D38 |
| GEN-17 Sputo | costo | 10 A | 5 A | 1 | D38 |
| MAR-BO2 Cambio marcia | guadagno | +8 A | +6 A | dopo il giro 3, decisione del proprietario | B2 valeva circa 4,5 HEALTH equivalenti per uso, sopra il tetto di 4; con +6 A circa 3,3 |

Esito sui bot, con Cambio marcia a +6 A: Spazienzio contro Mara **0,525** [0,520–0,531] (0,479 senza il bot attuale), partite di 11,3
turni, mazzi esauriti 10–16%, invarianti a zero, tutte le bound entro 4 HEALTH equivalenti per uso. Steal, le difese e le contromosse
restano come sono: le varianti mostrano che sono i bot a giocarle male. Correzioni approvate dal proprietario («Approvo, anche +6 A», D41).

## Correzioni di SB-13

Giro coi bot sullo starter del Tossico, al massimo tre giri ([rapporto](../../reports/set-base/sb-13-report.md), delega di D38 sui
numeri). Ogni numero cambiato, col giro e il motivo; il resto della griglia e gli starter base non cambiano.

| Slot | Numero | Prima | Dopo | Giro | Motivo |
|---|---|---|---|---|---|
| PG-TOS | HEALTH | 100 | 85, poi 80 | 1, 2 | Giro 1: la scala dei base, SB-9 meno 15 (D41). Giro 2: ricentrare dopo T 20 (0,569 → 0,561 contro Spazienzio) e accorciare |
| PG-TOS | T iniziale | 10 | 20 | 2 | Le carte da 10 T restavano morte in mano per il 45–80% dei turni con gli stili euristici; contro Mara 0,403 (0,299 senza `com`) |
| TOS-AR2 Tossicone Scatarrante | danno | 5 POISON | 8 POISON | 2 | La carta più debole dell'archetipo (3,9 HIT in SB-10a); resta nella forchetta di D34 per la T |
| TOS-BO2 Raschiare il fondo | guadagno | +10 T | +7 T | 3 | Con T 20 la bound valeva circa 4,6 HEALTH equivalenti per uso, sopra il tetto di 4; con +7 circa 3,6 |

Esito sui bot, bozza finale: Tossico contro Spazienzio **0,529**, contro Mara **0,479**, specchio 0,507; partite di 12,8, 12,2 e 16,6 turni.
Le carte complesse (contromossa, cura col veleno, travaso, Mescolone, Steal, Grab) restano: le varianti mostrano che sono i bot a giocarle
male. In attesa del giudizio del proprietario.

## Correzioni di SB-14

Giro coi bot sullo starter di Pino, al massimo tre giri ([rapporto](../../reports/set-base/sb-14-report.md), delega di D38 sui numeri). Ogni
numero cambiato, col giro e il motivo; il resto della griglia e gli starter già approvati non cambiano.

| Slot | Numero | Prima | Dopo | Giro | Motivo |
|---|---|---|---|---|---|
| PG-PIN | HEALTH | 110 | 95, poi 100 | 1, 3 | Giro 1: la scala dei base, SB-9 meno 15. Giro 3: compensa Testata riportata a 20 |
| PG-PIN | L iniziale | 10 | 20 | 2 | Le carte da 5 L restavano morte in mano per l'80–88% dei turni; Pino vinceva il 10–12% |
| PIN-AR2 Estasi da Coca Etilene | danno fisso | 3 + L | 10 + L | 2 | Con la L dei bot (0–5) valeva meno di uno Spintone; ora è la carta che regge Pino (vale 13–17 punti più di uno Spintone) |
| LR-PIN L'ultimo giro | danno fisso | 6 + L | 12 + L | 2 | A L zero faceva 6 HIT contro i 10 di Struggle, mentre le last resort devono stare vicino a Struggle e chiudere (D29); Pino ci arriva in più di metà delle partite |
| PIN-AR1 Testata da ultimo giro | danno | 20 HIT | 25, poi 20 HIT | 2, 3 | A 25 (20 netti) stava sopra il prezzo misurato della L, 13,4 HIT per 5 L: una comune deve stare in linea (D34, punto 6) |

**Due letture per i blocchi successivi.**
- **Una mossa per turno.** La sezione «L e Pino» dice che, giocando PIN-BO1 ogni turno, Pino paga sempre una carta da 5 L: ma il turno
  della bound è un turno senza la carta pagata. Bere e colpire costano due turni, quindi una carta pagata in L rende la metà di quanto
  sembra sulla carta.
- **I bot non bevono.** Lo stile prudente toglie 0,4 punti per ogni L guadagnata, lo stile risorse penalizza la L in eccesso: senza
  immunità nessuno dei due gioca la bound di L. Lo stile `com` la gioca di continuo e vince il 10–21%.

## Correzioni di SB-15

Giro coi bot sullo starter di Gigi, due giri su un massimo di tre ([rapporto](../../reports/set-base/sb-15-report.md), delega di D38 sui
numeri). Ogni numero cambiato, col giro e il motivo; il resto della griglia e gli starter già approvati non cambiano.

| Slot | Numero | Prima | Dopo | Giro | Motivo |
|---|---|---|---|---|---|
| PG-GIG | HEALTH | 100 | 85, poi 95 | 1, 2 | Giro 1: la scala dei base, SB-9 meno 15. Giro 2: con 85 Gigi vinceva il 12–15%; insieme alla V iniziale riporta i matchup nel 40–60% |
| PG-GIG | V iniziale | 15 | 25 | 2 | Le carte pagate in V restavano morte in mano (Mattone 88%, SeagullFly 77%, «Lavoro fatto bene» 78% dei turni in mano); come la T del Tossico e la L di Pino, il carburante iniziale sale di 10 |
| GIG-AR2 Chiave da tredici | danno | 10 CUT | 12 CUT | 2 | La linea della fascia F1 a 5 V (circa 12–13 HIT equivalenti, come Cinghiata di Mara); il listino nel contesto di Gigi dà 14,5 HIT per 5 V: resta un poco sotto |
| GIG-AR5 Lavoro fatto bene | costo | 10 V | 5 V | 2 | A 10 V (F2, circa 18–20 HIT) i 6 + 4 per oggetto stavano sotto la linea con meno di tre oggetti e la carta restava morta in mano; a 5 V con due o tre oggetti vale 14–18, «picco condizionato, media in linea» (D34, punto 6). Riportata a 10 V Gigi perde 7–9 punti |

**Due letture per i blocchi successivi.**
- **La V di Gigi è cara.** Nel suo contesto 5 V valgono 14,5 HIT e 10 V 24,6 HIT, contro i 17,9 di 10 V per Spazienzio: Gigi spende la V su
  carte da 5 e non arriva quasi mai a 15. Mattone (15 V) e SeagullFly (10 V), generiche condivise con Spazienzio, restano morte in mano per
  il 70–78% dei turni: è un tema di composizione dello starter, non di numeri, da guardare alla prova umana.
- **Furto e distruzione coi bot.** Steal e Smontiamo tutto valgono meno di un colpo semplice in mano ai bot (sostituiti, Gigi sale di
  11–15 e di 3–4 punti), come le contromosse degli altri starter.

## Tetto in partita

Misura di controllo chiesta da D33 (dettagli, semi e SHA-256 nel [rapporto SB-10b](../../reports/set-base/sb-10b-report.md#tetto-in-partita)):
una bound sonda e una nulla contro due nulle, negli stessi contesti di SB-10a, 2000 partite per stile e cella, tre stili. Criterio: quota
della sonda entro +10 punti (0,60).

| Bound | Spazienzio | Tossico | Rocco (prova) | Mara (prova) | Neutro |
|---|---:|---:|---:|---:|---:|
| 4 HIT | 0,475 ✓ | 0,657 ✗ | 0,715 ✗ | 0,813 ✗ | 0,998 ✗ |
| 3 HIT | 0,445 ✓ | 0,583 ✓ | 0,658 ✗ | 0,725 ✗ | 0,969 ✗ |
| 2 HIT | 0,476 ✓ | 0,452 ✓ | 0,547 ✓ | 0,616 ✗ | 0,843 ✗ |
| Risorsa propria da 4 unità (+5 V, +8 A, +26 T) | 0,559 ✓ | 0,589 ✓ | 0,485 ✓ | 0,473 ✓ | 0,793 ✗ |
| +10 T (griglia, decisione 4) | — | 0,547 ✓ | — | — | — |

**Esito: il tetto di 4 unità regge per le bound di risorsa, non per quelle di danno.** Una bound di danno da 4 resta entro +10 punti solo
con Spazienzio; 3 HIT reggono anche col Tossico; Rocco e Mara di prova superano il criterio fino a 3 e 2 HIT, perché le loro carte regolari
di prova sono deboli (SB-10a) e un danno gratuito ripetuto pesa molto. Il neutro amplifica, come in SB-10a, e non decide.

**Decisione del proprietario (D36, 6 novembre 2026, «Sì, danno a 3»):** tetto di **4 unità per le bound di risorsa** e di **3 per quelle
di danno**; nel banco il danno inflitto pesa 4/3. Le bound di danno della griglia passano da 4 a 3 e le varianti da 3 a 2. Da riconfermare
in SB-11 sullo starter vero di Mara e in SB-18 su Rocco; se lì 3 supera ancora i +10 punti, si scende a 2.

## Decisioni del proprietario

6 novembre 2026. Fase A (principi): «Approvo tutte», vedi [Principi approvati](#principi-approvati-nella-fase-a). Fase B (questa
griglia, con le cinque domande sotto): «Approvo tutte». Valgono quindi tutte le raccomandazioni:

| Decisione | Contenuto | Dove |
|---|---|---|
| B1 | PIN-AR2 e LR-PIN spendono tutta la L con **una classe Java** che memorizza, azzera e colpisce, come `ToxicBloodDrain` | Griglia, SB-14 |
| B2 | **MAR-BO2 (+8 A) nello starter di Mara**, misurata in SB-11; la variante veloce di danno (oggi 2 CUT a priorità 2, D36) come alternativa pronta. **Precisata dopo SB-12a** («Approvo, anche +6 A», D41): resta nello starter a **+6 A** | Griglia, SB-11, SB-12a |
| B3 | Rarità dell'archetipo **20, 10, 7**; totali 54, 41, 20 | Griglia |
| B4 | **Giubbotto e Posacenere negli starter base:** il passo `equip` serve da SB-11 | Griglia, SB-11 |
| B5 | **Una classe Java nuova per GIG-AR5** («Lavoro fatto bene») | Griglia, SB-15 |
| D55 | Cinque coppie con ricerca e nove slot approvati: «approvo, poi cmq le ritestiamo estensivamente». P3, esposizioni e recupero di A di Piera; numeri da tarare in SB-16e | [Proposta](sb-16d-proposta.md), SB-16d |
| D38/D54 | PIN-BO1 +10 → +5 L, solo numero: 3,75 per uso con corazza D50, tetto 4 invariato | [Rapporto SB-16d](../../reports/set-base/sb-16d-report.md) |
| D36 | Dopo la misura in partita, con «Sì, danno a 3»: **tetto 4 unità per le bound di risorsa, 3 per quelle di danno** (danno pesato 4/3 nel banco) | Griglia, banco, SB-11, SB-18 |

### Domande poste

1. **Spendere tutta la L** (PIN-AR2 e LR-PIN): una classe Java che memorizzi, azzeri e colpisca, come `ToxicBloodDrain`, oppure carte a
   dati che leggono la L senza azzerarla, con danno più basso (per esempio 3 + L/2)? *Raccomando la classe Java: serve a due carte e
   mantiene l'identità di L.*
2. **La bound di A di Mara nello starter** (MAR-BO2): SB-10a ha misurato che +A ripetuta non aiuta la Mara di prova, ma con costi in A veri
   il suo starter spenderebbe più A di quanta ne genera. *Raccomando di tenerla nello starter e di misurarla in SB-11, con 3 CUT a
   priorità 2 come alternativa pronta.*
3. **Rarità dell'archetipo:** 20 comuni, 10 non comuni e 7 rare, invece dei 19, 9 e 9 della tabella della fase A, che non tornavano con i
   totali approvati. *Raccomando 20, 10, 7.*
4. **Equip già in SB-11:** Giubbotto e Posacenere negli starter base richiedono il passo `equip` da SB-11. *Raccomando di tenerli: mostrano
   gli equip da oggetti nel set base. L'alternativa è spostarli negli avanzati e anticipare meno lavoro.*
5. **Una classe Java nuova per Gigi** (GIG-AR5, colpo che cresce con gli oggetti sul campo). *Raccomando di sì: è la sua rara e rende
   visibile il «debole a tavolo vuoto».*
