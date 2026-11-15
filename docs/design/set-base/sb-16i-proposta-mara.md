# SB-16i — Fase A2: leve su Mara (proposta 0.1)

**15 novembre 2026.** Fase A2 di [SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima), voluta da [D98](../../set-base-decisioni.md#decisioni-del-proprietario). Passo con proposta: **in attesa del proprietario**. Nessuna misura nuova, solo i dati della [Fase B](../../reports/set-base/sb-16i-report.md) ([riepilogo](../../reports/set-base/sb-16i/round-summary.md), `round-sb16i-observations.json.gz`, `round-deck-observations.json.gz`). Quote sui soli euristici (D93), dal lato di Mara.

## In breve

- Il Sorpasso d'anticipo è quasi uguale contro tutti (96,7–98,4%): **non spiega** perché Mara guadagni +18 punti contro Beppe e +43 contro Piera. Lo spiegano la **Sgommata** e la **Cinghiata d'anticipo**, frequenti solo contro i lenti.
- **Leva raccomandata: A, «anticipo dosato»**, solo numeri in `bozza.json`: Sorpasso +4 A, Sgommata ×0,8, Cinghiata +5 CUT. Attesi Spazienzio–Mara 36–42%, Mara–Piera 59–65%.
- Domanda 3 del rapporto (scelta dei bot fra due nomi): **non insieme alla leva**. Sposta Mara di ±2 punti, ma cambia anche le scelte di Piera e richiede codice dei bot.
- Fase B2: al massimo 2.100 s su 2.285, con una correzione di riserva scritta qui e valida nei due sensi.

## 1. Diagnosi

| Mara contro | Quota 1.5 → 1.6 | Sorpasso d'anticipo | Sgommata d'anticipo (per partita) | Cinghiata d'anticipo (per partita) |
|---|---|---:|---:|---:|
| Spazienzio | 41,8 → 73,5 (+31,7) | 96,7% | 73,0% (1,00) | 58,9% (0,38) |
| Piera | 34,8 → 77,6 (+42,8) | 96,7% | 61,1% (0,83) | 67,1% (0,47) |
| Celestina | 31,5 → 60,9 (+29,4) | 98,4% | 35,1% (0,52) | 26,8% (0,19) |
| Beppe | 36,4 → 54,8 (+18,4) | 98,1% | 20,1% (0,25) | 14,0% (0,08) |
| Mara (specchio) | 50,3 → 48,2 | 74,0% | 23,0% | 13,6% |

**Perché soprattutto Spazienzio e Piera.** I colpi grossi di Spazienzio (Impatto 34, 0,93 a partita; Mattone 24) hanno priorità 0: la Sgommata (priorità 1) arriva prima senza guardare l'ALERTNESS e dimezza proprio l'Impatto annunciato e mostrato, 17 danni per volta. Piera gioca a priorità 1 ma con A 15, meno 8 per ogni Sorpasso: Mara arriva prima anche dopo il costo (40 − 15 = 25). Beppe ha A 25, quanto Mara dopo quel costo: stesso gruppo, nessun anticipo. Celestina (A 35) sta nel mezzo.

**Scomposizione stimata.** Il guadagno di Mara ha due parti.

- **Una parte piatta di circa 15–19 punti contro tutti.** È la parte che resta contro Beppe, dove l'anticipo dei colpi è raro. Somma tre cose che i dati non separano: il Ghiaccio al posto di uno Steal che i bot non giocavano mai, le ricerche fallite di Mara scese da 37,4% a 24,5% e il +8 A del Sorpasso (circa 10 A a partita). Il peso del Sorpasso ha quindi un tetto: stimo 3–10 punti, non i 30–40 che suggerirebbe l'89,5%.
- **Una parte concentrata**, che segue le Sgommate e le Cinghiate d'anticipo per partita: circa 14–18 punti contro Spazienzio, 19–24 contro Piera, 7–11 contro Celestina, 0–4 contro Beppe. Vale circa 12–17 punti per ogni giocata d'anticipo di colpo a partita. La Sgommata ne porta circa due terzi, la Cinghiata circa un terzo (+10 CUT su 0,38–0,47 giocate a partita contro i lenti).
- **Avversari.** Contro Mara, Piera perde solo 5 di salute (85 → 80; il Bancone non tocca i CUT): circa 3–5 dei 42,8 punti. Spazienzio guadagna circa 2 punti dalle ricerche (fallite da 28% a 12%).

## 2. Leve sulle carte di Mara

Le stime riducono la parte concentrata in proporzione all'effetto tolto e la parte piatta per la quota del Sorpasso (3–10 punti, incerta). Sono intervalli di ragionamento, non misure.

| | **A — anticipo dosato** (raccomandata) | B — anticipo solo sulla Sgommata | C — Sorpasso senza +8 A |
|---|---|---|---|
| Sorpasso in curva | −8 A e 3 CUT al bersaglio. Gioca d'anticipo: **+4 A** a sé. | −8 A e 3 CUT al bersaglio. *(testo 1.5)* | −8 A e 3 CUT al bersaglio. *(testo 1.5)* |
| Sgommata | 15 A: 25 CUT al bersaglio. Gioca d'anticipo: in questo turno il bersaglio infligge danni **×0,8**. | invariata (×0,5) | invariata (×0,5) |
| Cinghiata di traverso | 20 A: … 18 più metà della tua A residua … Gioca d'anticipo: **+5 CUT**. | senza anticipo *(testo 1.5)* | invariata (+10) |
| Spazienzio–Mara (oggi 26,5) | **36–42** | 34–42 | 29–37 |
| Mara–Piera (oggi 77,6) | **59–65** | 60–69 | 64–74 |
| Mara–Celestina (oggi 60,9) | 50–56 | 47–56 | 51–58 |
| Mara–Beppe (oggi 54,8) | 47–53 | 43–51 | 45–52 |
| Cosa cambia | solo numeri in `bozza.json` (delega D38) | dati, ma toglie la parola chiave a due carte: è un cambio di funzionamento (D53, D97 (1)) | dati, toglie la parola chiave al Sorpasso |

**A.** Toglie circa il 55% della parte concentrata (il risparmio della Sgommata passa da metà a un quinto, il picco della Cinghiata si dimezza) e metà del Sorpasso. Agisce dove l'anticipo è frequente, quindi pesa poco su Beppe (−2/−7) e Celestina (−5/−11). «Gioca d'anticipo» resta sulle tre carte (D97 (1)) e porta ancora circa metà della risalita di Mara dalla 1.5: resta decisivo (D95 (1)). «×0,8» si legge come il «×0,65» del Bancone (D78). Rischio: Mara–Piera vicino al bordo alto, coperto dalla correzione di riserva (sezione 4).

**B.** Lo spunto «anticipo solo sulla Sgommata». Tiene l'effetto più tematico (arrivo prima, la tua risposta vale metà), ma con il dimezzamento pieno la stima su Piera è più incerta. Pesa di più su Beppe, perché toglie tutto il Sorpasso, che è piatto. Il raro perde il picco legato alla velocità (D63).

**C.** Lo spunto «Sorpasso senza il +8 A». È la leva meno mirata: abbassa Mara in modo uniforme e lascia intatta la parte concentrata, che è quella che porta fuori soglia Spazienzio e Piera. Probabilmente non basta per nessuno dei due.

Con tutte le leve lo specchio di Mara resta intorno al 50% e gli incontri senza Mara non cambiano. Codice di prodotto: nessuno, perché i bot leggono fattori e importi dai dati (`StyleSupport.guard` ed `extraDamage`, `TurnForecast`, `ViewTable`). Nella B2 si adeguano, come atteso deliberato che cita la decisione, i test che fissano i numeri della 1.6: `Sb16iBotsTest` (la Sgommata che salva da un Impatto letale) e, con B o C, `Bozza16Test` e l'elenco delle carte in [regole-playground.md](regole-playground.md).

## 3. Domanda 3 del rapporto: la parte variabile nella scelta dei bot

Oggi «Ti stringo la curva» sceglie sempre la Sgommata (25 contro 18). Contando 18 + A/2, con l'A prevista dopo premio e costo (circa 30), la Cinghiata varrebbe circa 33 e verrebbe scelta quasi sempre, anche da Slalom quando la paga.

- **Effetto su Mara:** le scelte a due nomi sono 0,13–0,17 a partita (Ti stringo 0,10–0,13, Slalom 0,02–0,05). Spostarle dalla Sgommata alla Cinghiata cambia Mara di **±2 punti**, sotto l'incertezza delle leve.
- **Effetto fuori da Mara:** la regola è di tutti i bot. I caricamenti di Piera oggi scelgono sempre l'Estasi (18 contro 14); con la parte variabile (18 + L contro 14 + 2L), con L sopra 4 sceglierebbero il Rutto, che toglie A a Mara. Cambierebbe Piera contro tutti, e un solo giro non separerebbe le due cause.
- **Costo:** codice dei bot (`BotView.searchChoice`), quindi passo 0 d'identità (circa 60 s del budget), identità viva (480.000 partite, fuori budget come nella Fase B), test di fedeltà e mutazioni.

**Raccomandazione:** nella B2 resta la regola di D97; la parte variabile si decide a parte, col lavoro sui bot o dopo la prova umana.

## 4. Fase B2: budget e correzione numerica

Seme, partite e bot come nella Fase B: 15 incontri × 144 celle × 300 semi (7.000.000–7.000.299), otto thread, stessi stili, Difficile escluso. Mai insieme ad altre misure.

| Voce | Partite | Tetto (orologio) |
|---|---:|---:|
| Passo 0 di fattibilità sulla bozza A2 | 8.640 | 100 s |
| Giro | 648.000 | 1.000 s |
| Al massimo una correzione: solo il giro (stesso codice, solo numeri) | 648.000 | 1.000 s |
| **Totale** | | **2.100 s** (residuo D98: 2.285 s) |

- **Fattibilità**, tarata sulla Fase B (passo 0 di 22,01 s di banco, giro di 854,7 s d'orologio): s0 × 38 + 80 ≤ 1.000 s, cioè **s0 ≤ 24,2 s di banco**. Se non passa: STOP. La correzione parte solo se dopo il giro il residuo è almeno 1,1 volte l'orologio del giro.
- **Niente passo 0 d'identità:** la leva A non tocca codice (con la domanda 3 sì, sezione 3).
- **Controllo gratuito:** i 10 incontri senza Mara devono restare identici, cella per cella, al giro della Fase B, perché stessi semi e stesse carte. Se non lo sono, è un rosso da spiegare (STOP 3) prima di leggere le quote.

**Come la correzione agisce su Mara.** Le riserve di D97 non toccano Mara. Questa proposta ne scrive due nuove, sui numeri della leva scelta, una per direzione. Si decide sul giro con una regola scritta prima:

| Esito del giro | Correzione (leva A) | (leva B) |
|---|---|---|
| Mara ancora forte (Spazienzio–Mara sotto 35 o Mara–Piera sopra 65) e nessun incontro di Mara fuori in basso | Sgommata ×0,8 → **×0,9** (stima altri −2/−5 contro Spazienzio e Piera) | Sgommata ×0,5 → **×0,65** |
| Mara troppo debole (un suo incontro fuori in basso) e nessuno fuori in alto | Sorpasso +4 → **+8 A** (valore 1.6) | Sorpasso **−10 A** al bersaglio invece di −8 |
| Fuori nei due sensi, oppure tutti dentro | nessuna correzione: scostamenti dichiarati, poi il passo del client (D98 (3)) | idem |

Le patte dello specchio di Celestina (12,1%) non sono di Mara. Restano la domanda 2 del rapporto (domanda 4 sotto).

## 5. Scelte prese

- La parte piatta non si separa nelle sue tre cause: la dichiaro come incertezza.
- Ghiaccio non toccato: è la risposta alla tossicità di D95.
- La 1.6 non si congela in `set-base/storico/`: non è approvata, resta nel commit 336e0ff e in `round-draft.json.gz`.

## 6. Domande

1. **Leva:** approvi A (Sorpasso +4 A, Sgommata ×0,8, Cinghiata +5 CUT), o preferisci B o C?
2. **Correzione di riserva:** approvi le due correzioni della sezione 4 per la leva scelta e la regola che decide quale applicare?
3. **Domanda 3 del rapporto:** nella B2 resta la regola dei bot di D97, e la parte variabile si decide più avanti (raccomandato)? Oppure la vuoi ora, con codice dei bot, passo 0 d'identità e identità viva?
4. **Domanda 2 del rapporto:** se decidi ora la Rincara di «L'ultima dose» (contraccolpo tolto), entra nello stesso giro della B2? È solo un dato, non costa budget, ma il controllo gratuito scende a 6 incontri senza Mara né Celestina.
