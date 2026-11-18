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
