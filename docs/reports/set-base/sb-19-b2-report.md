# SB-19 — Fase B2: oggetti col malus in campo (rapporto di STOP)

**18 novembre 2026. Fase B2 di [D130](../../set-base-decisioni.md#decisioni-del-proprietario): regola, motore, bot, i due oggetti, giro, ricerca «dopo», client e prova del proprietario.
Fermata al passo 2. La fedeltà del braccio nuovo è rossa: il proprietario, interpellato in sessione, ha scelto «STOP qui» (sotto). Regola, motore e bot sono fatti e passano
tutti gli altri cancelli. Bozza e braccio di fedeltà sono in una patch, non in `main`. Giro, ricerca, client e jar non sono fatti.**

## Stato (ripartenza)

- **Fatto e in commit:** `regole-playground.md` 1.5 con RP-27 e RP-28 (commit a sé, prima del codice); motore, caricatore, vista e bot dietro `d50`; osservatore degli oggetti in campo per il banco.
- **Cancelli verdi:** passo 0 identico, identità viva identica, «Rif» identico alla B1b numero per numero, contesto Spring e manifest, suite completa (§ 3).
- **Rosso, causa dello STOP:** il braccio nuovo «malus» di `ViewTableFidelityTest`, 446 finestre su 5.024 (§ 4). `TurnForecastFidelityTest` col braccio nuovo è al 100%.
- **Domanda posta in sessione** (contratto: fedeltà rossa = STOP): «Esclusioni e prosegui» oppure «STOP qui». **Risposta del proprietario: «STOP qui».**
- **Fuori da `main`:** i due oggetti e i dieci mazzi della B2 in `bozza.json`, più il braccio «malus» delle due prove di fedeltà, sono nella patch [b2-bozza-e-fedelta.patch](sb-19/b2/b2-bozza-e-fedelta.patch). Si applica con `git apply`. Così `main` resta verde.
- **Budget:** 133,7 s su 2.400, il solo giro «Rif». Passo 0 e identità viva sono fuori budget, come nei blocchi precedenti.

## 1. Regola (passo 1)

[regole-playground.md](../../design/set-base/regole-playground.md) passa alla versione **1.5**, con RP-27 e RP-28 nella nuova sezione 10, come nella [proposta A2](../../design/set-base/sb-19-proposta-a2.md) § 2. La sezione 6 dice come leggono la regola i bot. Due precisazioni mie, tutte e due dentro la proposta:

- Chi è eliminato dal veleno nello stesso fine turno non subisce l'effetto «In campo» (R06).
- Il caricatore rifiuta `gui.inPlay` quando il campo `inPlay` manca.

Commit `1eb878a`, prima di ogni codice.

## 2. Codice (passo 2)

| Dove | Cosa |
|---|---|
| `PrintedEffects` (`model`) | La lista **separata** `inPlay`, vuota per ogni carta di oggi; il costruttore a un argomento resta. `inPlay(Card)` e `inPlayChange(Step)` sono letti allo stesso modo da motore e bot. |
| `Character.resolveTimeBasedEffects` (`model`) | Solo con `ruleset.playground()` e per chi non è a terra: dopo veleno, L, timer e stati, un oggetto alla volta dal più vecchio. Gli stati non toccano l'effetto (non è un danno) e vale il pavimento a zero. La riga del registro è `(Nome) RISORSA: prima->dopo (differenza)`. |
| `AbstractCard`, `LoadableCard`, `Card.DeserializedCard` | Il testo breve `inPlay`, serializzato solo se c'è (`@JsonInclude(NON_NULL)`): le viste di oggi restano uguali byte per byte. |
| `DataCards`, `Draft` (`sim`) | Il campo `inPlay` (RP-28): solo in un `ITEM`, uno o due passi `lose` A/V o `gain` T/L, quantità fissa e positiva. `gui.inPlay` è obbligatorio col campo e rifiutato senza; non vale nelle carte Java. |
| `ViewTable.endOfTurn` | Applica l'effetto in coda, come il motore. `TurnForecast` non cambia. |
| `StyleSupport`, `BotView` | Vedi sotto. Ogni lettura nuova vale zero senza oggetti col malus in campo. |
| `InPlayObserve`, `Sb19MeasureTest` (test) | Turni in campo, uscite (consumato, venduto, passato, distrutto, scalzato, a fine partita) e T presa da chi non è immune. Scrive `in-play.json` solo se la bozza ha oggetti con `inPlay`: l'uscita di «Rif» non cambia. |

**Bot (§ 5 della proposta).** I pesi sono quelli della vendita: V 0,75, A 0,5, L 0,35, T 0,15. In più, la T presa pesa 1 per punto a chi non è immune e la L il suo peso.

- **Valore di un oggetto** (`itemWorth`, ora con le immunità di chi lo tiene): conta 2 turni d'effetto, quindi l'oggetto col malus diventa il meno prezioso per la vendita.
- **Correzione comune a tutti gli stili** (`inPlayValue`, peso 2 come `COUNTER_WEIGHT`):
  - consumo: più l'effetto del prossimo fine turno evitato;
  - furto di un oggetto lontano: più l'effetto di 2 turni su chi ruba;
  - Scatto Repentino: l'effetto ricevuto meno quello ceduto, 2 turni.
- Elemosina molesta (copia casuale) non ha correzione: l'oggetto copiato non si sceglie (scelta presa).

## 3. Cancelli eseguiti

| Verifica | Esito |
|---|---|
| Passo 0 d'identità ([step0.ps1](sb-19/b2/step0.ps1)), bozza di 6630ebf, braccio B, 8.640 partite | base 18,5 s, nuova 11,1 s: tutti i file **identici byte per byte**, salvo `seconds.txt` |
| Identità viva 1.13 (`liveBenchOnTheSameHistoricalDraft`, 480.000 partite, 82,2 s) | `final-live.json` ca131721… (266.869 B) e `final-live.md` 16d3bde4… (26.112 B): **identici** alla base di SB-18 B2, nella stessa cartella |
| «Rif», codice nuovo sulla bozza della B1b (28 coppie, 100 semi, 133,7 s) | **Identico** alla B1b: 4.032 incontri, 403.200 partite, 0 violazioni, `matrix.json` uguale byte per byte ([identity-rif-b2.json](sb-19/b2/evidence/identity-rif-b2.json)) |
| `TurnForecastFidelityTest` (con la patch) | 100% su tutti i bracci; «malus» 8.160/8.160 turni, con 1.643 turni con un oggetto col malus, 1.754 effetti applicati e 20 oggetti passati di campo |
| `ViewTableFidelityTest` (con la patch) | Bracci vecchi al 100%; **«malus» rosso**: prima 8.160/8.160, salute a due turni 5.018/5.024, risorse 4.578/5.024 (§ 4) |
| `./scripts/build.ps1 -Task Test -Offline`, sul solo commit | 913 test, 0 falliti, 23 saltati; client 37/37 |
| Lo stesso, con la patch applicata | 6 falliti: la fedeltà sopra e 5 attesi della bozza (`SetBaseDraftTest` ×4, `Bozza16Test` ×1) che cambiano coi due oggetti e i mazzi; non li ho aggiornati, perché mi sono fermato |
| `-Task TestServerContext -Offline`, poi `verify-match-manifests.py` | 1.031 test, 0 falliti; `allChecks: PASS` |
| `git diff --check`, `check-links.py`, `check-rules.py` | puliti |

Mai due Maven o misure insieme. Durante i lanci era attivo un solo processo `node`, estraneo al repository.

## 4. La fedeltà rossa: diagnosi

Il braccio «malus» mette in un posto, alternandoli, quattro mazzi B2: rischio 9, rischio 10, Sergio con la Sigaretta, Beppe col Conto. Nell'altro posto ci sono gli starter, due dei quali con Steal. Contatori con soglia minima: almeno 500 turni con un oggetto col malus, almeno 500 effetti applicati, almeno 5 oggetti passati di campo. In `ViewTableFidelityTest` i contatori arrivano a 924, 972 e 10.

Per classificare le 446 finestre diverse (contate per posto) ho usato una copia temporanea del test, poi cancellata. Il riassunto è in [fidelity-malus-diagnosis.json](sb-19/b2/evidence/fidelity-malus-diagnosis.json).

| Causa | Finestre |
|---|---:|
| Risorse: un oggetto col malus **arriva con la pesca nel turno confrontato** e agisce subito (RP-27); la previsione non può conoscere la pesca | 412 |
| Risorse: un oggetto col malus **esce senza essere consumato**, scalzato dalla capacità da un oggetto pescato nel turno | 28 |
| Salute: nel turno prima «C'è del sangue nella mia droga» toglie l'immunità a Celestina e un **timer** la ridà a fine turno; `ViewTable` non modella i timer, e ora la Sigaretta le lascia T addosso dopo il timer | 4 |
| Salute: lo stesso timer, più una Sigaretta pescata nel turno | 2 |

**Lettura.** Nessuna finestra mostra un errore della logica nuova (ordine, chi paga, oggetto scambiato, venduto o consumato). Sono tutte informazione nascosta (la pesca) o una parte già fuori dal modello (i timer). Il test esclude già le finestre con un oggetto pescato *nel primo* turno e i turni con un timer *all'inizio*. Da RP-27 serve escludere anche:

- le finestre in cui un oggetto nuovo entra in campo *nel secondo* turno;
- quelle con un timer scaduto nel turno prima.

Non le ho aggiunte: è la domanda 1.

## 5. Cosa non è fatto

- **Passo 2:** mutazioni (3–8) e prove unitarie del caricatore e del motore. Non sono partite, perché la fedeltà era il cancello prima.
- **Passo 3:** OGG-17 e OGG-18 in griglia (righe, conto 123, rarità 44 C / 59 NC / 20 R, tabelle di controllo); attesi della bozza; `rarita-bozza.py --check`; `genera-bozza-di-riferimento.py`. In bozza ci sono solo nella patch.
- **Passi 4–6:** giro M1/M2, isolamenti, ricerca «dopo», client (pillola del malus, `contracts.ts`, `scene.ts`, `VerifyLayout`), jar e comandi per la prova del proprietario.

**I mazzi della B2 sono già scritti** ([make-bozza-b2.py](sb-19/b2/make-bozza-b2.py), nella patch). Ognuno è un mazzo della B1 con al più 4 copie cambiate, con carte dello stesso ruolo:

| Mazzo | Da | Scambi |
|---|---|---|
| `prova-b2-spazienzio` | `prova-b1-spazienzio` | Negroni ×2 → Conto ×2 |
| `prova-b2-beppe` | `prova-b1-beppe` | Espresso, Una stretta di prova → Conto ×2 |
| `prova-b2-sergio-conto` | `prova-b1-sergio` | Espresso ×2 → Conto ×2 |
| `prova-b2-sergio-sigaretta` | `prova-b1-sergio` | Espresso ×2 → Sigaretta ×2 |
| `prova-b2-celestina` | `prova-b1-celestina` | Pasticca ×2 → Sigaretta ×2 |
| `prova-b2-rischio9` | `prova-b1-celestina` | Pasticca ×2 → Sigaretta ×2; Elemosina ×2 → Scatto ×2 |
| `prova-b2-rischio10` | `prova-b1-sergio` (Mano lesta ×2 già dentro) | Espresso ×2 → Conto ×2; Elemosina ×2 → Scatto ×2 |
| `iso-b2-conto` | `starter-spazienzio` | Negroni ×2 → Conto ×2 |
| `iso-b2-sigaretta` | `starter-tossico` | Pasticca ×2 → Sigaretta ×2 |
| `iso-b2-sigaretta-sergio` | `prova-sergio` | Espresso ×2 → Sigaretta ×2 |

Sergio ha due mazzi distinti: col Conto e con la Sigaretta. Nel suo mazzo della B1 c'è una sola carta RESOURCES, Espresso ×2, e quattro scambi dello stesso ruolo non ci stanno. Lo script scrive anche la copia M2 (Conto +12 V, Sigaretta +1 T).

## 6. Scelte prese

- I pesi dei bot del § 2: peso 2, orizzonte 2 turni, T per chi non è immune a 1 per punto, L al suo peso.
- Nessuna correzione per la copia di Elemosina.
- R06 letto anche per chi muore di veleno nello stesso fine turno.
- I mazzi del § 5, scritti prima di misurare.
- Bozza e braccio di fedeltà fuori da `main`, in patch, per non lasciare la suite rossa.

## 7. Domande per il proprietario

1. **Esclusioni del braccio «malus».** In `ViewTableFidelityTest` escludo, per causa, le finestre in cui nel secondo turno entra in campo un oggetto nuovo (pesca o copia) e quelle con un timer scaduto nel turno prima? Le conterei e le dichiarerei, coi bracci vecchi identici. Poi la B2 ripartirebbe dal passo 2: mutazioni, prove unitarie, poi i passi 3–6. In alternativa, la previsione impara qualcosa di nuovo (i timer di immunità), ma è un blocco dei bot.
2. **Ripartenza dalla patch.** Va bene che la B2 riparta applicando [b2-bozza-e-fedelta.patch](sb-19/b2/b2-bozza-e-fedelta.patch), cioè con i mazzi del § 5 già scritti? O li riscrive la regia?
3. **Pesi dei bot.** Ti vanno bene peso 2 e orizzonte 2 turni (§ 2)? Con questi un bot non ruba il Conto e cede volentieri la Sigaretta con Scatto Repentino. I numeri si vedranno nel giro.

## Evidenze e riproduzione

- Strumenti: [step0.ps1](sb-19/b2/step0.ps1); [make-bozza-b2.py](sb-19/b2/make-bozza-b2.py); giro con [run.ps1](sb-19/run.ps1) `-OutputRoot %TEMP%\bm-sb19-b2`; confronto con [analyze.py](sb-19/analyze.py) `identity`.
- Uscite grezze in `%TEMP%\bm-sb19-b2`: `step0-base`, `step0-new`, `round-rif`, `diag-malus.txt`, `full-test.log` (con la patch), `full-test-code.log`, `context.log`. Basi in `%TEMP%\bm-sb19-b1b\round-rif` e `%TEMP%\bm-sb16g2b2-live`.

# Ripresa (18 novembre 2026)

La B2 riparte dal passo 2 di [D133](../../set-base-decisioni.md#decisioni-del-proprietario) (2), con la bozza, i dieci mazzi e i pesi dei bot già in `main` dalla B2a ([rapporto](sb-19-b2a-report.md)). Lo STOP qui sopra resta com'era. Il rapporto cresce in ordine: prima i criteri, poi le misure.

## R1. Criteri scritti prima di misurare

Giro con gli stessi semi e le stesse celle della B1b ([run.ps1](sb-19/run.ps1), 100 semi, dodici stili letali a lato, 144 celle per abbinamento).

1. **Rif:** i sette riferimenti fra loro, col codice e la bozza di oggi, **identico** a quello della B2a ([identity-rif-b2a.json](sb-19/b2a/evidence/identity-rif-b2a.json)), cella per cella. Una differenza è uno STOP.
2. **Mazzi con gli oggetti (banda di D131):** guadagno medio sul riferimento da cui derivano **fra 0 e +10** (media dei sette confronti, specchio incluso come nel giro della B1b), **nessun confronto oltre +15**. Vale per i sette mazzi di prova e per i tre isolamenti.
3. **Patte ≤ 10%, durata ≤ 12 turni fuori dagli specchi, invarianti a zero** (violazioni, bound oltre il tetto).
4. **La fascia 35–65% vale solo per gli starter fra loro** (D131 (1)); non è un criterio dei mazzi con gli oggetti.
5. **Uscite in giù:** dovute a carte che i bot non giocano si leggono come in D132 (limite dei bot) e si **segnalano**, non si correggono con un valore dell'oggetto. Un mazzo che esce in giù lo segno con la lettura: giocate per partita di ogni carta nuova.
6. **Scelta e riserve (§ 7 della proposta A2):** M1 (valori di D130: Conto −3 A / +15 V, Sigaretta +2 T / +10 A) se passa 1–3 per tutti i mazzi che contengono l'oggetto; se no l'oggetto responsabile prende M2 (R1: Conto +12 V, Sigaretta +1 T); se non basta esce (R2) e il set scende a 122 o 121; se escono tutti e due, STOP. Nessuna soglia si sposta.
7. **Senza soglia, da riportare:** turni in campo per oggetto (fine turni in cui agisce), come esce (consumato, venduto, passato con Steal o con Scatto, distrutto, scalzato, ancora in campo a fine partita), T accumulata da chi non è immune, quante volte i bot rubano o passano un oggetto col malus.
8. **Ricerca «dopo»** (non è un cancello, D110): sul set intero (123), stessi semi e stesso strumento della «prima» della B1; segnalazioni della proposta A: una carta nuova nei mazzi vincenti di almeno 5 personaggi su 7; il massimo contro uno starter più alto di 3 punti.
9. **Budget:** 2.400 s, di cui 1.200 per il giro e gli isolamenti e 1.200 per la ricerca. A budget finito, STOP. Passo 0 e identità viva sono fuori budget, come nei blocchi precedenti.


## R2. Prove unitarie e mutazioni (passo 1)

Prove nuove, tutte verdi (suite: 947 test, 0 falliti, 23 saltati):

- [Sb19InPlayTest](../../../server/src/test/java/com/gsc/bm/sim/Sb19InPlayTest.java), 19 prove. **Caricatore (RP-28):** il campo solo negli `ITEM`; uno o due passi; `lose` solo A o V, `gain` solo T o L; mai HEALTH, nessun altro passo, quantità fissa e positiva; `gui.inPlay` obbligatorio col campo e rifiutato senza (anche in una carta Java); le viste delle altre carte restano uguali. **Motore (RP-27):** ordine a fine turno (dopo veleno e timer, dal più vecchio); chi ha l'oggetto ora, anche nel turno in cui arriva (Steal) e dopo Scatto Repentino; consumato, venduto, scalzato dalla capacità: niente; pavimento a zero; mai HEALTH e gli stati non cambiano l'effetto; R06 (chi muore di veleno nello stesso fine turno non lo subisce); regole vive: nessun effetto; immune a T: la risorsa senza il veleno, che parte dal turno dopo.
- [InPlayBotsTest](../../../server/src/test/java/com/gsc/bm/model/game/bot/InPlayBotsTest.java), 7 prove, ai numeri del listino: peso per turno, valore dell'oggetto a due turni, consumo, vendita (non è un consumo), furto, scambio con la capacità; ogni correzione vale zero senza oggetti col malus.

**Mutazioni, 14, tutte uccise** (sorgente rimesso a posto dopo ognuna; [mut.py](sb-19/b2/mut.py)):

| # | Mutazione | Uccisa da |
|---|---|---|
| M1 | blocco dell'effetto tolto dal motore | 6 prove del motore |
| M2 | effetto applicato anche a chi è eliminato (R06) | prova di R06 |
| M3 | oggetto più recente per primo | prova dell'ordine (la prima esecuzione moriva per un errore di compilazione: rifatta a mano, uccisa dalla prova) |
| M4 | effetto applicato anche con le regole vive | prova delle regole vive |
| M5 | perdita letta come guadagno | prove dei bot e del motore |
| M6 | quantità zero accettata dal caricatore | prova del caricatore |
| M7 | campo accettato fuori da un oggetto | prova del caricatore |
| M8 | `gui.inPlay` senza il campo accettato | prova del caricatore |
| M9 | il valore dell'oggetto ignora l'effetto | prova del valore |
| M10 | T di chi non è immune a costo zero | prova del peso |
| M11 | il consumo non evita l'effetto | prova del consumo |
| M12 | la vendita conta come consumo | prova della vendita |
| M13 | il furto ignora l'effetto | prova del furto |
| M14 | lo scambio non conta quel che si cede | prova dello scambio |

Nessuna equivalente. Il codice di `main` (motore, caricatore, bot) **non è cambiato** in questa ripresa: sono nuovi solo test, strumenti e client. Per questo identità viva, contesto Spring e manifest non sono stati rilanciati (la B2a li ha lasciati verdi sullo stesso codice) e il passo 0 non serve.

## R3. Giro (passo 2)

Stessi semi e celle della B1b (100 semi, 144 celle per abbinamento). Letture complete: [decks-m1](sb-19/b2/evidence/decks-m1.md), [decks-m2](sb-19/b2/evidence/decks-m2.md), [decks-nomalus](sb-19/b2/evidence/decks-nomalus.md), [inplay-m1](sb-19/b2/evidence/inplay-m1.md), [inplay-m2](sb-19/b2/evidence/inplay-m2.md). Budget: Rif 171 s, M1 405 s, M2 395 s, controllo «senza malus» 128 s = **1.099 s su 1.200**.

**Criterio 1, Rif: identico** alla B2a ([identity-rif-b2r.json](sb-19/b2/evidence/identity-rif-b2r.json)): 4.032 celle, 403.200 partite, 0 violazioni.

**Criteri 2 e 3. Media dei sette confronti sul riferimento / massimo confronto / patte massime** (invarianti a zero in tutti i giri; turni massimi ≤ 12,3):

| Mazzo | M1 | M2 | Senza malus |
|---|---|---|---|
| Spazienzio + Conto | −0,02 / +12,89 / 6,3% | −3,77 / +7,17 / 5,4% | — |
| Beppe + Conto | +5,83 / **+17,07** / 6,2% | +5,91 / **+17,34** / 6,3% | +7,20 / +18,07 / 12,9% |
| Sergio + Conto | **−31,19** / −21,24 / 3,4% | **−31,43** / −20,96 / 3,6% | −23,26 / −8,88 / 5,5% |
| Sergio + Sigaretta | **−32,10** / −23,98 / 4,2% | **−27,89** / −19,19 / 3,9% | −18,47 / −7,31 / 4,2% |
| Celestina + Sigaretta | +2,62 / +11,07 / **11,6%** | −2,81 / +3,94 / 8,7% | — |
| Rischio 9 (Celestina, Sigaretta + Scatto) | +2,12 / +9,57 / 9,9% | −3,73 / +3,08 / 9,6% | — |
| Rischio 10 (Sergio, Conto + Scatto) | **−30,83** / −20,09 / 2,9% | **−31,00** / −19,93 / 3,3% | — |
| Iso Spazienzio starter + Conto | +3,57 / +7,11 / 4,7% | −0,08 / +2,51 / 4,5% | — |
| Iso Celestina starter + Sigaretta | +7,90 / +14,23 / 11,0% | +3,04 / +8,75 / 9,7% | — |
| Iso Sergio + Sigaretta | **−22,91** / −14,51 / 4,5% | **−16,17** / −11,07 / 4,7% | — |

**Letture.**

- **Spazienzio + Conto:** dentro la banda con M1 (mazzo −0,02, due centesimi sotto lo zero; isolamento +3,57). Con M2 scende sotto lo zero (−3,77).
- **Beppe + Conto:** il massimo (+17,07, contro Spazienzio) supera +15 in M1 e in M2. Senza il malus il mazzo fa +18,07: l'eccesso viene dai +15 V del consumo (Beppe li usa), non dal malus, che anzi toglie circa un punto. M2 (+12 V) non lo riporta sotto +15 (+17,34).
- **Sergio:** i tre mazzi di Sergio escono in giù di 28–32 punti con entrambi gli oggetti, in M1 e in M2. Senza il malus escono lo stesso (−23 e −18): lo scambio toglie a un mazzo che già vale −17 dalla B1b i suoi unici Espresso (+15 A) e mette un oggetto che Sergio non sa spendere. **Il malus spiega circa 8–14 punti, lo scambio il resto.** Lettura: limite del mazzo scritto e dei bot (come D132), da segnalare.
- **Celestina:** con M1 il mazzo è dentro la banda e l'isolamento fa +7,90 con massimo +14,23; le patte (11,6% e 11,0%) sono quelle dello specchio di Celestina, già uscita nota del riferimento (10,99% nella B1b, D131 (4)). Con M2 la media scende sotto lo zero.
- **Rischio 9** (Sigaretta + Scatto in Celestina): in banda con M1 (+2,12). **Rischio 10** (Conto + Scatto in Sergio): fuori in giù come gli altri mazzi di Sergio.

**Senza soglia (M1, tutte le partite del giro):**

| | Conto | Sigaretta |
|---|---|---|
| Fini turno in cui agisce | 2.209.939 | 2.369.390 |
| Uscita: consumato | 296.488 | 229.154 |
| venduto | 31.426 | 23.713 |
| rubato (Steal) | 3.586 | 3.336 |
| passato con Scatto | 6.755 | 5.294 |
| distrutto | 3.650 | 4.144 |
| scalzato dalla capacità | 75.723 | 97.888 |
| ancora in campo a fine partita | 231.819 | 322.301 |
| Istanze (somma delle uscite) | circa 649.000 | circa 686.000 |
| Turni medi in campo | 3,4 | 3,5 |
| T presa da chi non è immune | — | 1.909.584 (1.719.862 Sergio, 165.156 Celestina senza immunità) |

I bot rubano o passano un oggetto col malus in circa l'1,6% delle istanze di ciascun oggetto (Steal 0,5%, Scatto 1%): raramente. Il malus resta addosso tre turni e mezzo in media. M2 non cambia il quadro (inplay-m2).

**Regola di scelta applicata alla lettera (R1.6).** M1 non passa 1–3 per tutti i mazzi che contengono l'oggetto (Beppe per il Conto: massimo; i mazzi di Sergio per entrambi: media). M2 non basta (Beppe +17,34; Sergio ancora −28/−31). Alla lettera escono tutti e due gli oggetti (R2) e quindi **STOP**: RP-27 resta scritta senza carte e decide il proprietario. **Non ho toccato bozza, griglia, bozza di riferimento né attesi**: gli oggetti restano in `main` coi valori di M1. La domanda 1 dà la lettura che raccomando.

## R4. Ricerca «dopo» (passo 3): parziale, budget superato

Strumento e parametri della «prima» ([search.ps1](sb-19/search.ps1)), sul set a 123, in due lanci (quattro e tre personaggi). **Il primo lancio ha impiegato 1.982 s: da solo supera i 1.200 s della ricerca** (il banco ha 26 mazzi invece di 16, il costo cresce di circa 2,6 volte; la «prima» fece i sette in 847 s). Avevo già avviato il secondo lancio senza aver letto il tempo del primo: l'ho fermato appena visto e non ha prodotto nulla. A budget finito, STOP: **la ricerca copre quattro personaggi su sette** (Spazienzio, Mara, Celestina, Piera; mancano Beppe, Sergio e Duccio). Letture in [search-dopo.md](sb-19/b2/evidence/search-dopo.md).

- **Carte nuove nei mazzi vincenti:** nessuna carta in almeno 5 personaggi su 7. Su quattro misurati, le più presenti sono Mezza minerale sgasata e Secondo fiato (3 su 4); poi Colpo allo stomaco e Maleducazione (2 su 4); Conto, Grappa e Non sento niente (1 su 4). La Sigaretta non compare in nessun mazzo vincente. La segnalazione «5 su 7» non è verificabile con quattro; nessuna carta è già a 4 su 4.
- **Estasi** nel mazzo vincente in **8 ricerche su 8** (14 su 14 prima): problema già noto, a SB-20 (D131 (3)).
- **Massimo contro uno starter,** prima → dopo, partenza starter / casuale: Spazienzio 93,2 / 95,9 → 91,5 / 96,1; Mara 87,7 / 96,2 → **100,0** / 88,4; Celestina 98,8 / 99,1 → 97,4 / 96,8; Piera 92,2 / 90,6 → **95,4** / **98,0**. Sopra i 3 punti: Mara (+12,3, partenza starter), Piera (+3,2 e +7,4). **Il confronto non è alla pari:** il banco ha dieci mazzi nuovi (i massimi sono spesso contro `prova-b2-sergio-conto`, che è debole) e la ricerca è stocastica a 25 generazioni; non lo leggo come effetto delle carte.

## R5. Client (passo 4)

La pillola del malus è disegnata sulla faccia dell'oggetto, nella fascia dei piedi dove un oggetto non ha costi: numero col segno vero (− o +), simbolo della risorsa, mai la lettera; colore dei costi (scuro). Cambiano `contracts.ts` (campo `inPlay` della carta), `readability.ts` (`inPlayOf`, `inPlayText`), `scene.ts` (il disegno e `marks.inPlay` nelle informazioni della faccia), [verify-layout.mjs](../../../client-web/tools/verify-layout.mjs) (`symbolProblems` legge il campo dal catalogo e controlla i simboli in ordine, che un oggetto con l'effetto abbia la pillola e che nessun'altra carta ce l'abbia), più una prova in `readability.test.ts`.

La riga di fine turno (`(Nome) RISORSA: prima->dopo (differenza)`) arriva nel registro come ogni altra riga del motore: non ho aggiunto codice. **Il controllo a occhio nel registro e in «Ultimo turno» è da fare nella tua prova:** non l'ho visto su schermo.

Un primo giro di `readability.test.ts` è uscito rosso per un mio errore (un `\b` di una regex diventato un backspace in un file scritto da uno script): corretto e rilanciato.

## R6. Verifiche eseguite

| Verifica | Esito |
|---|---|
| «Rif» (passo 2) | identico alla B2a, 403.200 partite |
| `./scripts/build.ps1 -Task Test -Offline` | server 947 test, 0 falliti, 23 saltati (921 + 26 nuovi); client-debug 37/37 |
| `TurnForecastFidelityTest`, `ViewTableFidelityTest` | nella suite, 100% (il codice dei bot non è cambiato dalla B2a) |
| `client-web/run.ps1 -Task VerifyAll -ReuseJar -Only 'test,build,size,verify,resolution,layout'` (giro parziale dichiarato: senza `ffa`, `aim`, `lifecycle` e le altre) | 11/11 verdi in 79 min 40 s: `Test`, `Build`, `Size` (texture 82,6% del tetto), `Verify` e `VerifyLayout` a 1366×768, 844×390 e 1920×1080, `VerifyResolution` a 1366×768 e 844×390 |
| `git diff --check`, `check-links.py` (426 file, 0 rotti), `check-rules.py` | puliti |
| `rarita-bozza.py --check`, `genera-bozza-di-riferimento.py --verifica` | allineati (nessun valore cambiato) |
| Jar `./scripts/build.ps1 -Task Server -Offline` in chiusura | ricostruito (`server/target/bm-server-0.0.1-SNAPSHOT.jar`, 16:34) |
| Identità viva (480.000 partite), `TestServerContext`, `verify-match-manifests.py` | **non rilanciati**: nessun file di `model`, dei bot o del caricatore è cambiato in questa ripresa (R2); restano quelli verdi della B2a |

Il primo giro dei `Verify*` singoli è uscito rosso per `ERR_CONNECTION_REFUSED`: i task singoli non avviano il server locale; `VerifyAll` sì. Il primo `readability.test.ts` rosso è descritto in R5. Per un mio errore, due catene del client sono partite insieme (la prima non si era fermata con `TaskStop`): i loro log si sono mescolati, ho scartato quei risultati e rifatto tutto con `VerifyAll`, a macchina ferma.

**Budget.** Giro e isolamenti 1.099 s su 1.200. Ricerca «dopo»: 1.982 s per quattro personaggi, oltre i 1.200 s (R4).

## R7. Domande per il proprietario

1. **Gli oggetti. Quale lettura della regola di scelta?** Alla lettera escono tutti e due (R3), ma l'uscita dei mazzi di Sergio è soprattutto dello scambio dei suoi Espresso (senza malus restano a −23 e −18) e l'eccesso di Beppe viene dai +15 V, non dal malus. *Raccomandazione:* tenere **Sigaretta accesa** a M1 (+2 T): per Celestina è in banda (+7,90 isolato, massimo +14,23, rischio 9 a +2,12) e i bot la passano di rado (1,6% delle istanze). Per il **Conto**, o si tiene a M1 e si rivede il mazzo di Beppe (un solo Conto, o consumo a +12 V con un altro scambio), oppure esce: da solo è dentro la banda solo in Spazienzio. Alternativa: applicare la regola alla lettera e far uscire entrambi (set a 121 e RP-27 scritta senza carte).
2. **I mazzi di Sergio.** Vanno riscritti (togliendo uno solo degli Espresso, o scambiando carte di un altro ruolo) per misurare i due oggetti dove la perdita non viene dallo scambio? Costa un giro (circa 400 s) e un'altra decisione sul budget. *Raccomandazione:* sì, se la domanda 1 tiene almeno un oggetto.
3. **La ricerca «dopo».** Mancano Beppe, Sergio e Duccio, e il banco da 26 mazzi costa 2,6 volte la «prima» (circa 2.600 s per i sette). Si completa con un budget nuovo (circa 1.000 s per i tre che mancano), o si lascia come segnalazione a quattro personaggi e si rifà in SB-20 a banco definitivo? *Raccomandazione:* lasciarla a SB-20.
4. **Il budget del giro.** Si rialza il tetto del giro e degli isolamenti per la domanda 2, o si rinuncia a misurare Sergio con gli oggetti? *Raccomandazione:* un solo giro, 400 s in più.

## R8. Comandi per la tua prova

Il jar è ricostruito. La bozza è letta da file (`server/src/test/resources/set-base/bozza.json`): ha i due oggetti coi valori di M1 e i dieci mazzi della B2 (compresi quelli di Sergio, Celestina e dei rischi 9 e 10).

```powershell
./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts
```

In un secondo terminale, dalla radice:

```powershell
./client-web/run.ps1 -Task Build
./client-web/run.ps1 -Task Serve
```

Il client è su http://127.0.0.1:4320. Per giocare un mazzo di prova contro un bot che ha Scatto Repentino, il computer prende il suo mazzo con `-Com` (esempio da verificare: il primo `dev.ps1` che ho scritto non l'ho eseguito):

```powershell
./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Com prova-b2-rischio9 -Bot aggressivo
```

- **Sergio che vende:** un mazzo con Lo rivendo e l'oggetto: `prova-b2-sergio-sigaretta` o `prova-b2-sergio-conto` (stesse carte dei mazzi di `bozza.json`; per giocarli dalla tua parte devi comporli nell'editor di «Collezione», perché i mazzi di prova non compaiono fra i tuoi starter).
- **Celestina che tiene la Sigaretta:** `prova-b2-celestina`, stessa avvertenza.
- **Il bot con Scatto Repentino:** `-Com prova-b2-rischio9` (Celestina, Sigaretta ×2 e Scatto ×2) o `-Com prova-b2-rischio10` (Sergio, Conto ×2 e Scatto ×2).
- **Da guardare:** la pillola scura sulla faccia dell'oggetto in campo (−3 A, +2 T); la riga di fine turno `(Nome) RISORSA: prima->dopo (differenza)` nel registro e in «Ultimo turno»; che l'oggetto passi a chi lo prende (Steal e Scatto Repentino) e pesi sull'altro; che venduto o consumato non faccia più nulla.

Non ho provato il server con `-Com prova-b2-*` né l'avvio a mano: i comandi qui sopra sono scritti da `docs/setup.md`, non eseguiti.

## Evidenze e riproduzione (ripresa)

Strumenti: [analyze-b2.py](sb-19/b2/analyze-b2.py), [mut.py](sb-19/b2/mut.py) (percorsi della cartella di lavoro della sessione), [run.ps1](sb-19/run.ps1) (`-Phase round -Label rif|m1|m2|nomalus`, `-Rows` coi dieci mazzi), [search.ps1](sb-19/search.ps1) (`-Label dopo1`). Uscite grezze in `%TEMP%\bm-sb19-b2r`: `round-rif`, `round-m1`, `round-m2`, `round-nomalus`, `bozza-m2.json`, `bozza-nomalus.json`, `search-dopo1.log`, `full-test.log`, `verifyall.log`; ricerca in `tmp/sim/sb7-ricerca-bozza-4.json` (non versionato).
