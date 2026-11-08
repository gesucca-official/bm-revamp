# SB-13 — Tossico del Serraglio: bozza dello starter e giro coi bot: rapporto

**Fatto l'8 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo entrambi» ([D43](../../set-base-plan.md#decisioni-del-proprietario)). Lo starter del Tossico, **«Tutto è droga»**, è nella bozza del Set
Base come nella [griglia](../../design/set-base/griglia.md), senza scostamenti nella composizione. In tre giri coi bot passa da 0,483 contro
Spazienzio e **0,403 contro Mara** a **0,529 e 0,479**, con lo specchio a 0,507. Invarianti a zero in modo stretto dopo ogni giro.

Cambiano solo numeri del Tossico, con la delega di D38:
- salute 100 → 80;
- T iniziale 10 → 20;
- Tossicone Scatarrante 5 → 8 POISON;
- Raschiare il fondo +10 → +7 T.

Nessuna carta tagliata, ridisegnata o tolta dallo starter. Gli starter base sono identici, cella per cella, a quelli approvati in SB-12a.

Il blocco è anticipato da [D42](../../set-base-plan.md#decisioni-del-proprietario), dopo SB-12a e prima della prova umana degli starter
base (SB-12b). Il codice cambia solo in `server/src/test`. Non sono toccati:
- regolamento, catalogo SQLite, allegato, client, `scripts/` e `tools/`: ci lavora SB-2 in parallelo;
- protocollo, classi di produzione e bot;
- le risorse di test `sb-5/`, `sb-6a/`, `sb-11a/` e i file del filone C4.

Nulla della bozza raggiunge la partita viva (SB-28).

## Passo 0 — Fattibilità

Ogni carta dello starter si scrive coi passi di oggi o con una classe Java esistente e i suoi parametri `@Tunable`. **Nessun passo nuovo e
nessuna classe nuova**, quindi il blocco non si è diviso.

| Slot | Carta | Via |
|---|---|---|
| PG-TOS | Tossico del Serraglio | dati: risorse, capacità 2, `immunities: ["TOXICITY"]`; l'immunità all'effetto periodico di T è quella del motore (R06) |
| TOS-BA | Desiderio Incontrollabile | dati: `gain` +5 T a sé, poi `consume` (SB-11a) |
| TOS-BO1 | Ago Marcio e Spezzato | dati: `damage` 3 CUT |
| TOS-BO2 | Raschiare il fondo | dati: `gain` T a sé |
| TOS-BO3 | Ghigno co' i' Denti Marci | dati: `damage` 2 POISON |
| LR-TOS | L'ultima dose | dati: 5 HIT a sé; 7 POISON e `gain` +4 T al bersaglio; `exclusiveTo` il Tossico |
| TOS-AR1 | Rabbia Psicotica da Meth | dati: costo 10 T; 5 HIT a sé, 15 HIT al bersaglio |
| TOS-AR2 | Tossicone Scatarrante | dati: costo 10 T; POISON e +5 T al bersaglio |
| TOS-AR3 | Metabolismo Corrotto | dati: `gain` HEALTH con `amount {base 0, of TOXICITY, divide 2}`, poi `lose` tutta la T |
| TOS-AR4 | Riflessi Aumentati dalla Speed | Java `AmphetamineReflexes`: annullamento; costo e priorità dalla bozza, nessun parametro |
| TOS-AR5 | C'è del sangue nella mia droga | Java `ToxicBloodDrain`, `turns: 1`: travaso di T, immunità tolta al bersaglio, timer |
| GEN-01, 02, 12, 16 | Grab, Steal, Rincorsa, Fasciatura | dati (`consume` per Grab) e Java `Steal` |
| OGG-04 | Mescolone Micidiale | Java `MarvelousCocktail`, quattro parametri (20 L, 20 T, timer 5, 20 POISON) |
| OGG-07, OGG-12 | Kebab, Pasticca | dati |

**Due letture del codice, da tenere per i testi (SB-25):**
- **Timer di TOS-AR5.** Rende l'immunità a T **all'autore**, non al bersaglio. Serve al Tossico che l'ha persa; il bersaglio la perde per
  sempre. La griglia diceva «timer 1 che gliela rende», ambiguo.
- **Timer di OGG-04.** Toglie **tutte** le immunità, compresa quella propria del Tossico. Il Tossico resta senza finché non gioca TOS-AR5,
  e la sua T diventa veleno per lui.

Un difetto estetico di `AmphetamineReflexes`: la lista dei giocatori annullati non si svuota, quindi la riga del rapporto può nominare
annullamenti di turni precedenti. Non tocca l'esito; la classe è di produzione e non l'ho cambiata.

## Bozza e convenzioni

[`server/src/test/resources/set-base/bozza.json`](../../../server/src/test/resources/set-base/bozza.json), formato `sb-6a/1`, finale
SHA-256 **`1c1d4a62adbe91846dd9920f29dac636c05fdc90d953b43af5ae90f6254bcc1e`**. Binding come in SB-11b:
- le carte di oggi tengono il binding della loro classe, anche se ora sono a dati (`junkie.Cough`, `com.basic.ToxicGrab`);
- le Java parametriche tengono la classe (`junkie.ToxicBloodDrain`);
- le nuove hanno il prefisso `base.` (`base.tossico.bound.RaschiareIlFondo`, `base.items.PasticcaTrovataSulBancone`).

Lo slot apre `gui.description`.

| Blocco | Contenuto |
|---|---|
| Personaggio | `junkie.character.ToxicJunkie` «Tossico del Serraglio»: H 80, A 35, V 0, T 20, L 0, capacità 2, immune a T |
| Basic, bound, last resort | TOS-BA; TOS-BO1 3 CUT e TOS-BO2 +7 T nello starter; TOS-BO3 2 POISON nella collezione; LR-TOS «L'ultima dose» |
| Archetipo (9) | Meth 2, Tossicone 2, Metabolismo 2, Riflessi 2, travaso 1 |
| Generiche (6) | Grab 2, Rincorsa 2, Steal 1, Fasciatura 1 |
| Oggetti (5) | Pasticca 2, Kebab 2, Mescolone 1 |

Regole dei mazzi del regolamento 1.12:
- 20 carte regolari, al massimo 2 copie;
- basic propria e fissa;
- due bound proprie diverse e gratuite;
- last resort propria, gratuita e senza bersaglio oggetto.

12 carte distinte, 2 rare (travaso e Mescolone).

**Nomi.** Lo starter si chiama **«Tutto è droga»**: è il flavour di `EverythingIsDrug`, che la basic assorbe, ed è la frase del Junkie. Le
carte di oggi tengono il nome italiano del catalogo, così il flavour resta. Le nuove hanno il nome di lavoro della griglia.
Il nome dello starter non ha un campo nel formato: l'id resta `starter-tossico`.

## Tetti fissati prima di partire

- **Giri: 3 al massimo** (Q5). Usati tutti e tre.
- **Calcolo: circa 2 ore.** Usati circa 75 minuti di banco e listino su 8 thread con Java 11. Altri 20 minuti circa sono passati ad aspettare
  le verifiche di SB-2 (una verifica alla volta).
- **Delega:** numeri, costi e priorità del Tossico (D38). Ridisegni, cambi d'identità o di criterio: al proprietario. Non è servito nessuno
  dei tre; una leva (A iniziale sopra quella di Mara) l'ho scartata proprio perché cambierebbe l'identità.

## Gli starter base restano identici

**Prova.** Con lo stesso seme e le stesse impostazioni di SB-12a la bozza dà gli stessi numeri sui base:
- 2000 partite per cella, stili aggressivo, prudente, risorse e `com`, semi 7.000.000–7.001.999, posti alternati;
- in tutti e tre i giri **le 48 celle dei tre incontri fra base coincidono una per una** con la matrice approvata di SB-12a
  (`sb-12a/sb7-bozza-2000.json`): vittorie, sconfitte, patte, primo posto, turni, mediana e percentili;
- Spazienzio contro Mara: 15.071 vittorie, 13.615 sconfitte, 3314 patte, **0,525**;
- in tutte le 34 varianti a 1000 partite per cella la stessa cella dà 7557, 6754 e 1689;
- nel listino, costo, tipo e `tettostarter` dei base coincidono con quelli di SB-12a riga per riga.

**Il lavoro parallelo di SB-2** (regolamento 1.13, `server/pom.xml`, `MatchVersions`, `cards.sqlite`) era nel working tree durante quasi
tutte le misure e le mie corse lo compilavano: le prove sopra mostrano che non sposta il banco.

**Un errore mio, corretto.** Verso le 01:22 ho lanciato un gruppo di varianti mentre girava un Maven di SB-2: il controllo dei processi
c'era, ma lo script partiva lo stesso. Le mie misure non ne risentono (cella di controllo identica). Ho avvisato SB-2 perché rilanciasse
eventuali verifiche di quella finestra. Da lì ogni mio lancio aspetta in automatico che non giri un Maven o un Java del repository.

## Giro 1 — La bozza della griglia

**Bozza.** Lo starter come nella griglia, coi valori della scheda e la salute di SB-9 meno 15 (85) come ipotesi da misurare (raccomandazione 1
di D41). [Matrice](sb-13/sb7-giro1-2000.md) ([dati](sb-13/sb7-giro1-2000.json)), bozza [`bozze/giro1.json`](sb-13/bozze/giro1.json),
SHA-256 `cc93a90bfaa89b053a8a8ee31416a4a1479e18faf28a3826bf59adb78e43fd67`; mazzi Tossico, Spazienzio e Mara (sei incontri), 2000 partite
per cella, 192.000 partite; invarianti a zero.

| Incontro | Quota del Tossico [IC 95%] | Senza `com` | Turni medi | Patte |
|---|---|---|---:|---:|
| contro Spazienzio | 0,483 [0,477–0,488] | 0,508 | 13,8 | 12,3% |
| **contro Mara** | **0,403 [0,397–0,408]** | **0,299** | 13,2 | 11,4% |
| specchio | 0,503 [0,497–0,509] | 0,501 | 17,6 | 26,7% |

**Lettura: il Tossico è a secco di carburante.** Con gli stili euristici le carte da 10 T restano morte in mano per il 45–80% dei turni in cui
le ha (Meth, Tossicone, Riflessi). Lo stile prudente non gioca mai la bound di T e il travaso non lo gioca quasi nessuno. Contro Mara, che
chiude in fretta, il criterio dei 40% è al limite, e i soli euristici stanno a 0,30. Le partite durano 1,5–2 turni più dei base, lo specchio 6.

## Giro 2 — T 20, salute 80, Tossicone 8

**Varianti** (1000 partite per cella, [tabella](sb-13/varianti-diagnostiche.md#giro-1--giro-2-le-leve)): quattordici varianti. In sintesi:
- **T e salute** sono le leve più forti. T 20 vale circa +9 punti contro Spazienzio e +13 contro Mara; +10 HEALTH circa +12 e +17.
- **Il danno delle carte pagate in T** conta meno, perché restano morte finché manca la T. Meth 18 e Tossicone 10 porterebbero il prezzo
  della T oltre 0,5 danni per T (D34).

**Correzioni.**
- **T iniziale 10 → 20**, per il carburante.
- **Salute 85 → 80**, per ricentrare contro Spazienzio (T 20 da sola lo porta a 0,569) e accorciare.
- **Tossicone Scatarrante 5 → 8 POISON**: era la carta più debole dell'archetipo (3,9 HIT in SB-10a) e 8 resta nella forchetta della T.

**Misure.** [Matrice](sb-13/sb7-giro2-2000.md) ([dati](sb-13/sb7-giro2-2000.json)), bozza [`bozze/giro2.json`](sb-13/bozze/giro2.json),
SHA-256 `115d7771ae772354331fc0100a92c694fb63490ef086462c3a6681d88201ba7b`; stesse impostazioni; invarianti a zero.

| Incontro | Quota del Tossico [IC 95%] | Senza `com` | Turni medi | Patte |
|---|---|---|---:|---:|
| contro Spazienzio | 0,563 [0,557–0,569] | 0,594 | 12,7 | 10,4% |
| contro Mara | 0,508 [0,502–0,514] | 0,443 | 12,1 | 10,8% |
| specchio | 0,510 [0,503–0,516] | 0,512 | 16,6 | 24,1% |

### Controllo dei bot, prima di toccare carte (punto 7)

Sette varianti sulla bozza del giro 2: ogni carta complessa tolta e sostituita da una semplice
([tabella](sb-13/varianti-diagnostiche.md#controllo-dei-bot-punto-7-sul-giro-2)).

| Carta | Prova | Tossico contro Spazienzio / Mara |
|---|---|---|
| Riflessi, la contromossa (TOS-AR4) | ×2 sostituita da Spintone | +5,2 / +5,2 punti |
| Metabolismo, la cura col veleno (TOS-AR3) | ×2 sostituita da Spintone | +5,2 / +4,9 |
| Grab | ×2 sostituita da Spintone | +4,3 / +4,3 |
| Steal | sostituita da Fasciatura | +5,0 / +5,8 |
| Mescolone (OGG-04) | sostituito da Fasciatura | **+7,7 / +8,2** |
| Travaso (TOS-AR5) | sostituito da Fasciatura | +0,4 / +1,1: quasi mai giocato (0,01 a partita con gli euristici) |
| Bound di T (TOS-BO2) | TOS-BO3 al suo posto | −5,0 / −4,0: la generatrice serve |

**Lettura.** In mano a questi bot ogni carta complessa del Tossico vale meno di un colpo semplice, come le parate e le contromosse dei base
in SB-12a. I bot non leggono la mossa dell'avversario, non sanno quando svuotare la T col Metabolismo e non prevedono i timer. Il Mescolone
costa di più perché il suo timer toglie anche l'immunità propria del Tossico, e i bot non giocano il travaso che gliela renderebbe:
è il rischio «immunità persa» della scheda, misurato. **Nessuna di queste carte è indebolita o tolta.**

**Leve scartate per il giro 3** ([tabella](sb-13/varianti-diagnostiche.md#giro-2--giro-3-leve-contro-mara-e-durata-scartate)):
- **La priorità di Meth o Tossicone** non sposta nulla.
- **La A sopra quella di Mara** aiuta solo contro di lei (+1,7 punti), ma rovescerebbe l'ordine a parità di priorità della scheda (Mara prima
  del Tossico): cambio d'identità.
- **La salute più bassa** accorcia di poco e porta i soli euristici contro Mara sotto 0,40.

## Il listino sul giro 2, e il motivo del giro 3

`ListinoMeasureTest`, `-Dsim.listinoBase=set-base -Dsim.listinoAnchor=7`, gruppi `costo`, `tipo`, `salute`, `veleno`, `tettostarter` e il
nuovo `tettoavanzati`, tre stili euristici; bisezione 400, griglia 2000 e curve 2000 partite per stile e punto; 916.800 partite.
[Testo](sb-13/sb13-listino-giro2-costo+tipo+salute+veleno+tettostarter+tettoavanzati.md),
[dati](sb-13/sb13-listino-giro2-costo+tipo+salute+veleno+tettostarter+tettoavanzati.json).

Il contesto del Tossico è lo starter con Grab e Rincorsa (le sue due generiche in due copie) al posto delle àncore, come per i base.

- **Prezzo della T:** 10 T valgono 10,4 HIT contro l'àncora a 7, cioè **0,34 danni per T**, dentro la forchetta 0,3–0,5 di D34.
- **Salute equivalente per uso** (criterio di D38, al massimo 4), con la pendenza della salute del contesto del Tossico (1,94 punti per HEALTH):
  TOS-BO1 2,1 e TOS-BO3 1,7, ma **TOS-BO2 +10 T circa 4,6 [4,2–5,0], sopra il tetto**.

Con la T iniziale a 20 la bound di T rende più di quanto prevedeva la griglia: il peso di D33 (0,15 per T a chi è immune) la metteva a 1,5
unità.

## Giro 3 — Raschiare il fondo +7 T

**Varianti** (1000 partite per cella e listino per ciascuna, [tabella](sb-13/varianti-diagnostiche.md#giro-3-la-bound-di-t)):

| TOS-BO2 | Salute equivalente per uso [IC 95%] | Tossico contro Spazienzio / Mara |
|---|---|---|
| +10 T | 4,6 [4,2–5,0] | 0,561 / 0,508 |
| +8 T | 3,9 [3,5–4,3] | 0,533 / 0,486 |
| **+7 T** | **3,6 [3,2–4,0]** | 0,527 / 0,480 |
| +6 T | 3,5 [3,1–3,9] | 0,523 / 0,476 |

**Correzione: Raschiare il fondo +10 → +7 T**, testi compresi. È il valore più alto con tutto l'intervallo sotto 4; a +8 l'intervallo lo
supera. Come Cambio marcia in SB-12a: la bound si gioca di rado, ma vale molto a ogni uso.

**Misure sulla bozza finale.** [Matrice](sb-13/sb7-giro3-2000.md) ([dati](sb-13/sb7-giro3-2000.json),
[tempi](sb-13/sb7-giro3-2000.tempi.txt)) di `server/src/test/resources/set-base/bozza.json`, SHA-256 **`1c1d4a62…254bcc1e`**, con lo stesso
contenuto della variante `x2-rasch7`; 2000 partite per cella, quattro stili, semi 7.000.000–7.001.999, posti alternati.

| Incontro | Quota del Tossico [IC 95%] | Turni medi | Mediana (10°–90°) | Patte |
|---|---|---:|---|---:|
| **contro Spazienzio** | **0,529 [0,523–0,535]** | 12,8 | 13 (9–17) | 10,8% |
| **contro Mara** | **0,479 [0,474–0,485]** | 12,2 | 12 (8–17) | 10,8% |
| specchio | 0,507 [0,501–0,513] | 16,6 | 17 (11–20) | 22,4% |
| Spazienzio contro Mara (controllo) | 0,525 [0,520–0,531] | 11,3 | 11 (7–16) | 10,4% |

**Invarianti:** zero violazioni su 192.000 partite e 4.831.228 turni di giocatore. Mai senza mosse, mai il limite dei 200 turni, e nove bound
su nove entro il tetto di D33 e D36 contro il manichino (TOS-BO1 4 unità col danno pesato 4/3, TOS-BO2 1,05, TOS-BO3 2,67).

**Dispersione fra gli stili.** Quota del Tossico, con lo stile del Tossico prima:

| Lettura | Contro Spazienzio | Contro Mara |
|---|---|---|
| Quattro stili, 16 coppie (il criterio) | **0,529** | **0,479** |
| Tre stili euristici, 9 coppie | 0,558 | 0,412 |
| Stessi stili sui due lati | aggressivo 0,598 · prudente 0,791 · risorse 0,212 · `com` 0,403 | aggressivo 0,216 · prudente 0,651 · risorse 0,359 · `com` 0,610 |
| Coppie estreme | 0,073 (`com` contro risorse) e 0,899 (risorse contro prudente) | 0,067 (`com` contro aggressivo) e 0,975 (risorse contro `com`) |

Per stile, il Tossico vince 0,500 con l'aggressivo, 0,549 col prudente, 0,697 con risorse e 0,292 con `com`. È la stessa dispersione degli
starter base: lo stile cambia l'esito più delle carte. Lo stile risorse gioca bene il Tossico, `com` lo gioca male (accumula T che non spende:
a fine partita gli restano 20–34 T). Contro Mara il Tossico soffre l'aggressivo, che chiude prima che il veleno lavori.

**Durata per stile**, stesso stile sui due lati:

| Incontro | aggressivo | prudente | risorse | `com` |
|---|---:|---:|---:|---:|
| contro Spazienzio | 11,0 | 16,1 | 11,0 | 14,0 |
| contro Mara | 10,1 | 14,6 | 11,5 | 14,6 |
| specchio | 15,4 | 19,3 | 18,4 | 14,1 |

**Mazzi esauriti e last resort:**
- Tossico 50,6% e 44,7%, su tutte le sue partite; metà sono lo specchio, il più lungo.
- Spazienzio 12,9% e 8,4%, Mara 18,4% e 13,1%, compresi gli incontri col Tossico. In SB-12a erano 10,5% e 16,3%.

**Risorse a fine partita:** al Tossico restano 11,2 T se vince e 19,4 se perde. Con 10 T per carta, chi perde muore con due carte pagabili
in serbatoio.

**Carte del Tossico**, su tutti gli stili:

| | Carte |
|---|---|
| Più giocate | TOS-BO1 3 CUT (3,98 a partita, 97,4%), la basic (93,2%), Rincorsa (90,6%), Meth (85,4%), Tossicone (77,1%) |
| Quota se giocata più alta | Tossicone 0,571 (+0,068), il travaso 0,569 (+0,066) quando arriva a giocarlo |
| Quasi mai | Steal (8,8%), il travaso (9,8%, quasi solo `com`) |
| Giocate in svantaggio | Raschiare il fondo (31,6%, quota se giocata 0,352), Riflessi (39,6%, 0,413), Grab (31,7%, 0,401), Metabolismo (70,0%, 0,465) |
| Morte in mano a lungo | la basic 3,5 turni (capacità 2, cinque oggetti), Riflessi 3,9, Tossicone 2,5, Meth 2,5 |

**Carte d'archetipo davvero giocate:**
- Meth, Tossicone e Metabolismo sono giocati nel 70–85% delle partite, Riflessi nel 39,6%.
- Il travaso, rara a una copia, nel 9,8%: è il limite dei bot del controllo sopra.
- Last resort propria nel 40,9% delle partite: chiude, non allunga (0,97 a partita, quota se giocata 0,510).

## Listino sulla bozza finale

Stessi gruppi e impostazioni del giro 2, base derivata SHA-256 `757a8f42…58d9eb06`, 916.800 partite.
[Testo](sb-13/sb13-listino-costo+tipo+salute+veleno+tettostarter+tettoavanzati.md),
[dati](sb-13/sb13-listino-costo+tipo+salute+veleno+tettostarter+tettoavanzati.json).

| Voce | Contesto | Valore misurato [IC 95%] | Riferimento |
|---|---|---|---|
| **10 T** | Tossico | **10,9 HIT [10,9–11,0], 0,39 per T** | D34: 0,3–0,5 per T |
| 20 T | Tossico | 19,7 HIT [19,5–19,8], 0,63 per T | nessuna carta del set costa 20 T |
| 1 T al bersaglio | Spazienzio, Mara | circa 14–17 HIT per T, intervalli larghi | i bot non leggono T sul bersaglio |
| 1 T al bersaglio | Tossico (specchio) | nulla: piatta fino a 40 T | il bersaglio è immune |
| Salute iniziale | Tossico | 1,97 ± 0,10 punti per HEALTH | Spazienzio 2,01, Mara 3,36 |
| 10 V, 10 A, CUT, POISON | Spazienzio, Mara | identici a SB-12a | — |

**Bound, salute equivalente per uso** (D38, al massimo 4; criterio di D33, +10 punti, riportato per confronto):

| Bound | Quota (più una nulla) contro due nulle [IC 95%] | Giocate a partita | +10 punti | Salute equivalente per uso [IC 95%] | ≤ 4 |
|---|---|---:|---|---|---|
| TOS-BO1 3 CUT | 0,709 [0,696–0,722] | 5,08 | ✗ | 2,1 [2,0–2,2] | ✓ |
| **TOS-BO2 +7 T** | 0,624 [0,610–0,638] | 1,75 | ✗ | **3,6 [3,2–4,0]** | ✓ |
| TOS-BO3 2 POISON | 0,650 [0,637–0,664] | 4,45 | ✗ | 1,7 [1,6–1,9] | ✓ |
| sonda 3 HIT | 0,709 [0,696–0,722] | 5,08 | ✗ | 2,1 | ✓ |
| sonda 2 HIT | 0,650 [0,636–0,663] | 4,47 | ✗ | 1,7 | ✓ |

**Lettura:**
- **Tutte e tre le bound stanno sotto 4.** Come per Mara, superano il criterio dei +10 punti, che nello specchio del Tossico è severo:
  23–24% di patte, e la salute vale meno di 2 punti per HEALTH.
- **La T del Tossico è prezzata nella forchetta.** Meth (15 HIT, 5 a sé) sta poco sotto la linea di 10,9; Tossicone (8 POISON) sta
  sotto con il solo danno, ma i 5 T al bersaglio valgono molto secondo questo listino. È la carta del Tossico con la quota se giocata più
  alta: da guardare (sotto).
- **Il peso di D33 per la T** (0,15 a chi è immune) è troppo basso per il Tossico di oggi. Misurata, la T vale 0,4–0,6 HIT, e +7 T valgono
  circa 3,6 HEALTH per uso. Il banco del tetto con quel peso dà TOS-BO2 a 1,05 unità e non lo avrebbe fermato: per i blocchi successivi
  conviene la salute equivalente.

**Cosa misura e cosa no:**
- Misura il prezzo di 10 e 20 T contro un'àncora gratuita, nel contesto dello starter.
- Non misura il valore di T come carburante nel tempo, né il travaso: le curve usano le carte e i bot di oggi.
- Il «T al bersaglio» è una bisezione su una sonda che i bot giocano per i suoi 5 HIT: dice che la T sui non immuni pesa molto, non quanto
  esattamente (intervalli 11–32 HIT per T).

## Stato finale contro i criteri

Bozza finale, SHA-256 `1c1d4a62…254bcc1e`:

| Criterio (SB-13) | Obiettivo | Esito | |
|---|---|---|---|
| Matchup contro Spazienzio | 40–60% | 0,529 [0,523–0,535]; 0,558 coi soli euristici; stessi stili 0,21–0,79 | ✓, con la dispersione dichiarata |
| Matchup contro Mara | 40–60% | 0,479 [0,474–0,485]; 0,412 coi soli euristici; stessi stili 0,22–0,65 | ✓, con la dispersione dichiarata |
| Specchio | — | 0,507 | ✓ |
| Carte d'archetipo giocate | davvero giocate | quattro su cinque nel 40–85% delle partite circa; il travaso nel 9,8% (bot) | ✓ coi limiti dei bot |
| Durata | confrontata coi base (11,3) | 12,8 e 12,2 contro i base; **specchio 16,6** | da giudicare |
| Patte | confrontate coi base (9,5–12,6%) | 10,8% contro i base; **specchio 22,4%** | da giudicare |
| Mazzi esauriti | confrontati coi base | Tossico 50,6% (metà nello specchio); base 12,9% e 18,4% | da giudicare |
| Turni senza mosse | zero | zero su 192.000 partite | ✓ |
| Bound entro D33 e D36 | tetto del banco | nove su nove | ✓ |
| Bound, salute equivalente per uso | al massimo 4 | 2,1 / 3,6 / 1,7 | ✓ |
| Prezzo della T | 0,3–0,5 danni per T | 0,39 a 10 T | ✓ |
| Starter base invariati | identici a SB-12a | 48 celle su 48 identiche | ✓ |

**Lo specchio è lungo per costruzione.** Due Tossici immuni non si avvelenano: i 5 T del Tossicone e i 4 della last resort diventano
carburante per l'avversario, e il Metabolismo li trasforma in salute. Senza Metabolismo lo specchio scende a 13,8 turni (variante `b3`).
La carta che ci è progettata contro è il travaso, che toglie l'immunità al bersaglio, ma i bot non lo giocano. Con i soli numeri non si
accorcia senza spostare gli altri due incontri. È il personaggio che la scheda vuole «lento a chiudere», ma 16,6 turni e una patta su
cinque sono un dato da far vedere al proprietario.

## Codice e bozza

Tutto in `server/src/test`.

| File | Cosa cambia |
|---|---|
| `resources/set-base/bozza.json` | Personaggio, 15 carte nuove nella bozza (basic, tre bound, last resort, cinque d'archetipo, tre generiche, due oggetti) e lo starter `starter-tossico`; Kebab e Steal erano già nella bozza. SHA-256 da `bf7b97ce…8db0c39` (SB-12a) a `1c1d4a62…254bcc1e`. Le carte dei base non cambiano |
| `java/.../sim/SetBaseDraftTest.java` | Tre prove nuove; quattro esistenti adeguate alla bozza che cresce (sotto) |
| `java/.../sim/Listino.java` | Contesto del Tossico nella base del Set Base, solo se la bozza ha il suo starter (Grab e Rincorsa al posto delle àncore); gruppo nuovo `tettoavanzati` per le bound degli starter avanzati, fuori da `all` |
| `java/.../sim/ListinoReport.java` | Titolo del gruppo nuovo e colonna «per uso» anche per lui |
| `java/.../sim/ListinoMeasureTest.java` | Solo il commento: gruppi e contesti nuovi |

**Senza lo starter del Tossico** il listino è quello di prima: un test lo controlla. Il gruppo `tettostarter` non cambia, quindi le sue misure
di SB-11b e SB-12a restano le stesse. La base di SB-10a resta controllata da `ListinoAnchorTest`.

**Prove nuove** in `SetBaseDraftTest`:
1. `theToxicStarterFollowsTheGridWithTheSb13Corrections`:
   - risorse, capacità e immunità del Tossico; basic, bound e last resort propria (`exclusiveTo`);
   - la composizione esatta dello starter (archetipo 9, generiche 6, oggetti 5);
   - la bound di T entro +10 (D34) e a +7, coi testi;
   - i quattro costi da 10 T nel testo, Tossicone 8 POISON coi testi;
   - lo slot all'inizio della descrizione delle dieci carte del Tossico.
2. `theToxicMechanicsWorkOnHandBuiltStates`: su stati costruiti a mano, il Tossico immune non subisce il periodico di T e Spazienzio sì;
   inoltre Tossicone, Metabolismo (T / 2 di salute, poi T a zero), l'ultima dose e la bound di T.
3. `theListinoBaseHasTheToxicContextAndItsBoundCurves`: contesto del Tossico con le àncore, starter intatto, cinque curve
   `tettoavanzati`; senza lo starter del Tossico il contesto non nasce.

**Prove esistenti adeguate, nessuna indebolita.** La bozza è un file che cresce (SB-11b); dove una prova contava l'insieme della bozza ora
conta anche il Tossico. I controlli sono più larghi, non più deboli:

| Prova | Prima | Ora |
|---|---|---|
| `theDraftLoadsWithTheTwoStartersAndAllTheirCards` | personaggi e mazzi esattamente {Spazienzio, Mara}; terze bound di due | esattamente {Spazienzio, Mara, Tossico}; terza bound del Tossico (TOS-BO3) fuori dallo starter |
| `theStartersRespectTheFormat` | due starter | tre starter, stessi controlli |
| `theDraftPassesTheBenchInvariantsStrictly` | 6 bound, 3 coppie di mazzi | 9 bound, 6 coppie di mazzi, stessi invarianti stretti |
| `everyPairOfStylesFinishesItsGames` | 3 coppie di mazzi | 6 coppie |
| `everyBasicMechanicIsInOneOfTheTwoStarters` | gli starter | i soli due starter base (`BASE_STARTERS`), com'era: la copertura resta un requisito dei base |
| `theStartersCarryTheSb12aCorrections` | mappa esatta delle saluti | la stessa mappa esatta dei due base, il Tossico escluso perché ha la sua prova |

Gli altri controlli restano com'erano: durate secondo R05, nomi di Spazienzio in maiuscolo, base del listino. Nessun atteso è stato cambiato
per tornare al verde: ogni numero nuovo viene dal contenuto aggiunto alla bozza.

**Le prove nuove sanno fallire.** Con la bozza del giro 2 al posto di quella finale le due prove del Tossico falliscono con
`expected: <7> but was: <10>` (la bound di T). Poi ho rimesso la bozza finale e ricontrollato lo SHA-256.

## Documenti di progetto

- **[Griglia](../../design/set-base/griglia.md).**
  - PG-TOS (H e T), TOS-BO2 e TOS-AR2 col valore vecchio barrato e la nota ⁵;
  - nome dello starter;
  - una «Nota di SB-13» sotto gli starter, con le due letture dei timer;
  - la sezione [Correzioni di SB-13](../../design/set-base/griglia.md#correzioni-di-sb-13), con giro e motivo.
- **[Scheda del Tossico](../../design/set-base/schede-personaggi.md#3-tossico-del-serraglio--avanzato).** Nota di SB-13 sui valori iniziali
  (HEALTH 80, T 20), tabella dei valori iniziali aggiornata.
- [Piano](../../set-base-plan.md) e [indice](../README.md): stato di SB-13.

## Cosa non è provato

- **I bot.** Ogni numero dice come giocano questi bot.
  - **Il Tossico paga ai bot un pedaggio più alto dei base.** Ogni sua carta complessa vale 4–8 punti meno di un colpo semplice (Spazienzio
    circa 14 punti in tutto, Mara circa 7, in SB-12a). Non si sommano, ma la direzione è chiara: un umano che sa quando svuotare la T, quando
    annullare e quando travasare potrebbe rendere il Tossico **più forte** di quanto misurato. I numeri di questo giro lo compensano in parte
    (T 20): se la prova umana lo trova forte, la prima leva è la T iniziale.
  - Nessuno stile sa gestire il timer del Mescolone (svuotare la T o giocare il travaso prima che scada); `com` accumula T che non spende.
  - **Nessuno stile nuovo.** Il piano lo chiede «prima di correggere le carte» quando un mazzo complesso lo richiede. Qui nessuna carta
    complessa è stata corretta: sono cambiati la salute, la T iniziale, il danno di una carta d'attacco e la bound. Gli stili sono codice di
    produzione, fuori dal perimetro. Uno stile che legge il timer e il travaso è una proposta per dopo la prova umana.
- **Il valore della T al bersaglio** è misurato in modo grezzo; Tossicone potrebbe essere sopra la linea per un umano che punta al veleno lungo.
- **I mazzi esauriti del Tossico** sono contati su tutte le sue partite: il banco non li separa per incontro, e lo specchio pesa la metà.
- **Il divertimento.** Nessuna partita umana: il simulatore misura l'equilibrio, non se diverte, né se si capisce l'immunità persa.
- **`TestServerContext` non lanciato:** il blocco tocca solo `server/src/test` e i documenti; contesto Spring, CLI e classi di produzione
  non cambiano per opera di questo blocco.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero Maven, Java o verifiche del client di questo repository. Il working tree
contiene anche il lavoro di SB-2 non ancora committato (regolamento 1.13, catalogo, `pom.xml`, client): le verifiche lo comprendono.

- `./scripts/build.ps1 -Task Test -Offline`: **verde**, in 176 secondi.
  - Maven 591 test, 0 falliti, 7 saltati (le misure a richiesta); erano 588 in SB-12a, più le mie tre prove.
  - `SetBaseDraftTest` 12 su 12.
  - `ListinoAnchorTest`, `ListinoTest`, `BenchTest`, `PlaygroundTest` e le prove di SB-11a passano.
  - Client 37 su 37.
- `python scripts/check-rules.py`: verde. «Regolamento 1.13 e Set Base 0.1 allineati alle copie client», con il lavoro di SB-2 in corso;
  39 carte e 1 token; starter conformi a R02 1.12; SQLite integro.
- `TestServerContext`: non lanciato, per il motivo detto sopra.

## Cosa deve giudicare il proprietario

Le correzioni dei giri le ho prese con la delega di D38 (numeri, costi e priorità del Tossico):
1. **Salute del Tossico 80, T iniziale 20, Tossicone 8 POISON, Raschiare il fondo +7 T.** Il Tossico passa da 0,483 e 0,403 a 0,529 e
   0,479, con tutte le bound sotto 4 HEALTH equivalenti per uso e la T a 0,39 danni per T.
2. **Il nome dello starter, «Tutto è droga».**
3. **Lo specchio lungo** (16,6 turni, 22% di patte) e **il mazzo del Tossico che si esaurisce spesso**: proprietà del personaggio che la
   scheda vuole lento, o da correggere con un ridisegno (Metabolismo o T al bersaglio immune) in un blocco successivo?
4. **Il Mescolone toglie anche l'immunità propria del Tossico.** È il testo della carta di oggi, conservata dalla griglia, ed è il rischio
   «immunità persa» della scheda. Coi bot costa circa 8 punti: tenerlo per la prova umana, come le contromosse in SB-12a?

## Cosa serve a SB-14

- **Base stabile:** starter base invariati, con le carte della bozza approvata in SB-12a; Tossico come qui, se approvato. Il giro di Pino
  va contro tre starter.
- **Scala della salute:** il Tossico è sceso da 100 a 80, non a 85: la salute di SB-9 meno 15 è un buon punto di partenza per Pino (110 → 95),
  da misurare.
- **Carburante:** come per il Tossico, guardare subito le carte morte in mano per mancanza della risorsa (L per Pino, che decade).
- **Metodo:** testi allineati ai numeri nelle varianti; salute equivalente per uso col listino (gruppo `tettoavanzati`: aggiungere
  `starter-pino` a `Listino.ADVANCED_STARTERS` e il contesto di Pino a `SET_BASE_CONTEXTS`); tre letture del matchup.
- **Bot:** i limiti visti qui (timer, risorse accumulate e non spese) valgono anche per l'alcol di Pino.

## Cosa serve alla prova umana degli avanzati (SB-16)

1. SB-8 con la bozza di questo blocco.
2. Il Tossico giocato da un umano: Riflessi, Metabolismo, travaso e Mescolone sono le carte che i bot giocano peggio. Se un umano le gioca
   bene, il Tossico sale; vanno guardate per prime.
3. Lo specchio del Tossico: durata percepita, patte, e se il travaso lo chiude come dovrebbe.
4. Leggibilità: immunità persa col Mescolone, timer del travaso che rende l'immunità a chi lo gioca. Annotare per SB-31.
