# SB-17 — Fase B4: Lo rivendo basic e Fare il vago bound (rapporto)

**16 novembre 2026. Esito: la proposta A4 approvata in [D118](../../set-base-decisioni.md#decisioni-del-proprietario) è in bozza
(Lo rivendo basic di Sergio, Lo metto in conto fuori, Fare il vago bound, mazzo di prova con Espresso ×1 e Santino ×2); verifiche
verdi; il giro corto esce dalla soglia D95 **dal basso** anche con la riserva R1. Scostamento dichiarato, STOP per il proprietario.**
Al giro finale (R1: +8 HEALTH) Sergio è sotto contro Celestina (15,4%), Piera (17,5%), Mara (27,0%) e Beppe (33,4%); Spazienzio
passa (47,1%, non supera il 69,7%); nello specchio le patte salgono al 18,9%. Il jar del server è ricostruito per la prova.

## Stato

| Passo | Esito |
|---|---|
| Documenti | regole-playground 1.3 (RP-25 riscritta, RP-26 ridotta, § 6 dei bot), griglia (CES-BA Lo rivendo con la deroga a D3, CES-BO3 Fare il vago con la deroga a «bound senza parate», deroga di SB-17 sulla vecchia CES-BO3 ritirata, note ⁶ e ⁷); commit `53cb385` |
| Passo 0 | identico (sotto) |
| Dati, codice, test | `bozza.json` (93 carte), `DataCards`, `PrintedEffects`, `BotView`, `TurnForecast`, `StyleSupport`; test Sb17CardsTest, Sb17, SetBaseDraftTest, Sb17MeasureTest, fedeltà |
| Verifiche | tutte verdi (§ 2) |
| Giro | 2 giri, R1 usata una volta; fuori D95 dal basso (§ 3) |
| Jar | `./scripts/build.ps1 -Task Server -Offline` |

## 1. Cosa cambia nel codice (§ 6 della proposta)

- **Caricatore** (`DataCards`): il passo `vendi` vale solo nel `self` di una **basic** con `targets` solo `NEAR_ITEM`, una volta,
  esclusivo con `consume`, con il solo ramo `seHai`; rifiutato in bound, last resort, regolare e oggetto; `seNo` rifiutato. La
  vendita prende l'oggetto bersagliato dalla mossa; **nessun ripiego sul più vecchio**: se l'oggetto non c'è più, «Nothing to
  sell» e niente guadagno (D118 (2)). Il ramo di vendita della bound è tolto. Gli status di durata 0 nelle bound erano già
  ammessi: nessun cambio.
- **Bot**: `BotView` offre **una sola mossa** della basic di vendita, sul proprio oggetto meno prezioso (`StyleSupport.itemWorth`);
  `TurnForecast` e `ViewTable` tolgono l'oggetto bersagliato e applicano `seHai`, niente se manca (`TurnForecast.sell`, ora
  pubblico per i test); gli stili leggono il ricavato e non l'effetto dell'oggetto venduto. La parata di Fare il vago è letta dal
  previsore come quella di una regolare (ruolo `DEFENSE`, status `INPUT`): la politica letale la gioca contro un colpo mostrato.
- **`PrintedEffects`**: solo il javadoc di `SELL` (1.3).

## 2. Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check`, `check-links.py`, `check-rules.py` | verdi (375 file, 0 link rotti; regolamento 1.13 e Set Base 0.1 allineati) |
| `rarita-bozza.py --check` | rarità come la griglia |
| Passo 0 (b2/step0.ps1, 1.6b, 8.640 partite) | base 9,96 s, nuovo 10,24 s: file identici tranne `seconds.txt` |
| Identità viva (480.000 partite, 1.13) | `final-live.json` `ca131721…` (266.869 B), `final-live.md` `16d3bde4…` (26.112 B): identici alla B3; 79,6 s |
| `-Task Test -Offline` | 894 test, 0 falliti, 21 saltati, client 37/37 (rifatta dopo R1, 67,2 s) |
| `-Task TestServerContext -Offline` + `verify-match-manifests.py` | 1.012 test, 0 falliti, 21 saltati, 481,0 s; manifest PASS |
| Fedeltà `TurnForecastFidelityTest` | sergio 7.546/7.546 (Lo rivendo 392, Fare il vago 543); bracci A 5.526, B 5.536, 1.6 5.408, tutti 100% |
| Fedeltà `ViewTableFidelityTest` | prima 7.546/7.546, due 4.862/4.862 (Lo rivendo 395, Fare il vago 544) |
| Mutazioni ([script](sb-17/b4/mutations.py), [esiti](sb-17/b4/mutations.json)) | 7/8 uccise, 149 s |

I numeri di fedeltà sono del primo stato (+6); dopo R1 le fedeltà girano nella suite, al 100% richiesto dai test.

**Mutazione sopravvissuta:** «gli stili contano il testo dell'oggetto anche in una vendita». È equivalente sugli oggetti di oggi:
nessuno ha un testo che cambi la scelta dello stile quando la basic lo vende, quindi nessun test può distinguerla. Si tiene la
guardia (`usesItem && !sells`) per gli oggetti col malus di SB-19 (D117 (3)).

**Attesi cambiati, tutti per D118:**

- `SetBaseDraftTest.durationsFollowTheR05Reading`: 12 → 14 status letti con R05 (i due di Fare il vago, HIT e CUT, durata 0).
- `Sb17.CARDS`: Lo rivendo come basic, `bound.FareIlVago` al posto di `bound.LoRivendo`.
- `Sb17CardsTest`: la sezione di Lo rivendo riscritta (basic su un proprio oggetto, vende senza l'effetto, niente con l'oggetto
  sparito, stampa, una sola mossa sul meno prezioso, previsore, 15 rifiuti del caricatore); nuova sezione di Fare il vago (parata
  del turno, 21 poi 28 di danno, il bot para un colpo letale mostrato).
- Fedeltà: i contatori di vendita ora contano Lo rivendo e Fare il vago (entrambi > 0).
- Ricavato +6 → +8 per la riserva R1 (bozza, test, griglia, regole-playground, bozza di riferimento).

## 3. Giro

Lanciatore e semi della B2 ([run.ps1](sb-17/run.ps1)), regole `d50`, 12 stili letali, 144 celle, 300 semi, 259.200 partite per
giro. Quote di Sergio sui soli euristici: quota / patte / turni.

| Incontro | Partenza (D116, giro 2) | Giro 1 (+6) | Giro 2, R1 (+8) |
|---|---|---|---|
| Sergio–Sergio | 46,37% / 4,93% / 11,88 | 47,47% / **16,26%** / 17,78 | 48,25% / **18,92%** / 18,30 |
| Sergio–Spazienzio | 69,68% / 2,10% / 9,52 | 43,88% / 7,05% / 11,75 | 47,10% / 7,48% / 11,86 |
| Sergio–Mara | 63,39% / 4,11% / 10,63 | **23,67%** / 6,84% / **12,90** | **27,04%** / 8,68% / **13,15** |
| Sergio–Celestina | 38,20% / 6,25% / 11,23 | **15,07%** / 4,16% / 11,97 | **15,41%** / 4,35% / **12,15** |
| Sergio–Piera | 50,90% / 5,39% / 10,51 | **15,86%** / 5,51% / **12,58** | **17,47%** / 5,87% / **12,76** |
| Sergio–Beppe | 57,96% / 2,95% / 8,40 | **30,92%** / 3,55% / 10,23 | **33,36%** / 4,54% / 10,36 |

In grassetto i valori fuori D95. Violazioni 0, bound oltre il tetto 0 in entrambi i giri. Esiti: [giro 1](sb-17/b4/round-1.md),
[giro 2](sb-17/b4/round-2.md).

**R1.** Dopo il giro 1 gli incontri fuori lo erano dal solo lato basso (più patte e durata, che non sono un lato della quota):
+6 → +8, giro rifatto. Dopo R1 restano fuori quattro incontri, sempre dal basso, più patte e durata: scostamento dichiarato e
STOP, come scritto nella § 7 della proposta. R1 sposta poco (+0,3–3,4 punti): il ricavato non è la leva.

**Budget:** 224,4 s di muro su 300 (giro 1: 109,0 s d'orologio, 123,4 di muro; giro 2: 89,9 e 101,0). Fuori budget: passo 0,
identità, suite, contesto, mutazioni ([budget.json](sb-17/b4/budget.json), [identity.json](sb-17/b4/identity.json)).

## 4. Letture (non criteri, § 7)

| Lettura | Giro 1 (+6) | Giro 2 (+8) | Partenza (D116) |
|---|---|---|---|
| Lo rivendo: partite in cui è giocata / giocate per partita | 54,09% / 1,07 | 56,72% / 1,14 | (Lo metto in conto 74,00% / 1,04) |
| Oggetti venduti: Santino / Espresso | 125.697 / 56.221 | 133.495 / 60.138 | — |
| Fare il vago: partite / giocate per partita | 46,47% / 3,82 | 46,48% / 3,82 | — |
| Fare il vago contro un colpo mostrato | 16,8% delle giocate | 16,9% | — |
| Battutina: partite / giocate per partita | 61,28% / 3,35 | 61,41% / 3,47 | 78,42% / 2,31 |
| Mazzo esaurito | 41,37% | 43,23% | 8,01% |
| A spesa a partita (lato di Sergio) | 33,05 | 33,10 | non contata |
| Last Resort: Banzai!!! (partite) | 22,75% | 24,91% | 2,79% |
| Ricerche di Oh, guarda là fallite | 1,22% | 1,29% | 4,52% |

Lettura della regia da fare, non un criterio: le partite di Sergio si allungano e il mazzo si esaurisce in quattro partite su dieci
(da una su dodici). Le cause più probabili, in ordine:

1. **Fare il vago giocata a vuoto.** Con la bound sempre in mano i bot la giocano 3,8 volte a partita, e solo una volta su sei
   contro un colpo mostrato: un turno senza guadagni né danno. Lo stesso con Battutina, che passa da 2,3 a 3,5 giocate. Nello
   specchio entrambi i Sergio parano: patte al 19%, 18 turni.
2. **Meno A.** Lo metto in conto dava A a ogni basic; Lo rivendo dà HEALTH e consuma gli oggetti (al più 2 a partita). Lo sanno
   tutti scende da 1,55 a 1,10 giocate, Conto salato da 1,13 a 0,72, Oh, guarda là da 0,96 a 0,56.
3. Il ricavato in HEALTH non compensa: R1 ne aggiunge 2 e la quota sale di 0,3–3,4 punti.

Nessun nuovo giro di diagnosi: il budget non lo prevede e la proposta chiede lo STOP.

## 5. Domande al proprietario

1. **Fare il vago.** Tenere la bound di difesa leggera e insegnare ai bot a giocarla solo contro un colpo mostrato o probabile
   (codice dei bot, nessun cambio di carta), oppure darle un piccolo guadagno, oppure tornare a una bound d'altro tipo?
2. **La A di Sergio.** Senza Lo metto in conto Sergio gioca meno letture e disturbi. Ridare A altrove (per esempio a Lo rivendo:
   +A invece di +HEALTH, o insieme), oppure accettare un Sergio più lento e rivedere il mazzo di prova?
3. **Prova del proprietario.** Farla comunque su questo stato (il jar è pronto), per sentire la basic di vendita, o dopo un
   ritocco deciso dalle domande 1–2?

## 6. Fuori perimetro

Regolamento, `docs/sets/`, catalogo, client, api: non toccati. Il passo del client di D115 (2) non serve più: l'oggetto è il
bersaglio della basic, che il client propone già (D118 (6)).
