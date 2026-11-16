# SB-17 — Fase B2: Sergio A2 in bozza e giro

**Esito.** Sergio A2 è in bozza come da D110. Il rosso di fedeltà della prima chiusura è corretto in `BotView` come da D111:
passo 0 identico, identità viva identica, fedeltà al 100%, contesto e manifest verdi, mutazioni 3/3. Il giro è stato fatto con
**le due riserve permesse (R1, poi R3)**. Al giro finale Sergio resta **sotto la soglia D95 contro Celestina (24,9%) e Piera
(33,7%)** ed è dentro negli altri quattro incontri, specchio compreso (patte 5,9%). Il giro intermedio (solo R1) era il migliore:
un solo incontro fuori, Spazienzio al 68,3% (domanda 1). Spesi 486,2 s su 1.000. **STOP per il proprietario a fine giri.**

Stato (tappe): D111 registrata; cancelli verdi; giri 1–3 e ricerca fatti; suite e contesto finali verdi; rapporto chiuso.

## Cosa cambia

**Dati (D110 (1)).**

- **Lo sanno tutti** (`base.cesira.LoSannoTutti`, CES-AR5, COMMON) prende il posto di Fare il vago, tolta dalla bozza. Valori di
  partenza: 15 A, priorità 1, 20 HIT; dopo le riserve: **20 A, 24 HIT**.
- **Conto salato**: 8 HIT, **+6** sul gettone.
- **Oh, guarda là**: annuncia **Lo sanno tutti o Conto salato**.
- **prova-sergio** (20 carte): bound Battutina e Frecciatina al volo; Lo sanno tutti ×2, STORDIAMOTI ×1, Tartaruga ×2,
  Spintone ×1. Scatto Repentino esce dal mazzo; Mi informo e Scatto Repentino restano nella collezione.
- Salute 85 invariata; rarità invariate (93 carte: 38 C, 45 NC, 10 R).
- Nella griglia: CES-AR1, AR4, AR5 (con le due riserve barrate), BO1, BO3 e la riga di Sergio fra i ruoli.

**Codice del bot (D111).** `BotView.CardSeen` ha un campo nuovo, `consumed`: per un oggetto che non sa descriversi (Java, `effects`
nullo) contiene il testo consumato letto da `PrintedEffects.consumedText`. Lo legge **solo** la previsione di un Grab
(`TurnForecast.consume`, tramite `consumedEffects()`). Gli stili continuano a leggere `effects`: il confine degli oggetti Java per le
loro scelte non si sposta, come chiede il javadoc di `consumedText`. Il costruttore storico resta, quindi i test che costruiscono
`CardSeen` non cambiano. In `ViewTable` cambia solo la copia della carta, che porta il campo nuovo.

**Causa del rosso (dalla prima chiusura).** Al seme 7100203, turno 3, Piera consuma Tennents Super (classe Java
`AnotherRottenBeer`) con Grab prima dello STORDIAMOTI di Sergio. Il motore applica l'armatura di L 10 (67 → 57); la previsione,
senza il +10 L, dava 67 → 55.

## Attesi cambiati (D110, D111)

1. `Sb17.CARDS`: `LoSannoTutti` al posto di `FareIlVago`.
2. `Sb17CardsTest`:
   - Conto salato sul gettone 30 → **21**, in due test;
   - annuncio di Oh, guarda là;
   - nuovo test di Lo sanno tutti (priorità 1, **24** HIT base, **20** A pagati, con le riserve citate negli attesi).
3. `SetBaseDraftTest`:
   - stati con durata 14 → **12** (spariscono i due di Fare il vago);
   - terza bound di Sergio fuori dai mazzi: **Mi informo** (era Frecciatina al volo).
4. `TurnForecastFidelityTest`: il quarto contatore del braccio «sergio» conta Lo sanno tutti al posto dello scambio di Scatto
   Repentino. Lo scambio dei vassoi esce dal campione del braccio «sergio»; le altre prove di `ShuffleFeet` restano.

Nessun atteso sugli starter cambia.

## Cancelli (fuori budget, D111 (2)–(5))

| Cancello | Esito |
|---|---|
| Passo 0 sulla 1.6b (`0b8806e`, 8.640 partite), base prima della correzione e codice nuovo, stessa cartella | **identico byte per byte** tranne `seconds.txt`: 0 partite e 0 celle cambiate, quindi la base resta la stessa. `matrix.json` uguale anche a `sb-16i-b2/step0-matrix.json.gz`, salvo il percorso della bozza nell'intestazione (stesso SHA-256). [Impronte](sb-17/b2/identity.json), [lanciatore](sb-17/b2/step0.ps1) |
| Identità viva 1.13 (480.000 partite) | **identica** alla base rilanciata sul checkout prima della correzione e alle impronte della Fase B (JSON 266.869 B, Markdown 26.112 B) |
| Fedeltà, bozza finale | `TurnForecast`: A 5.526, B 5.536, 1.6 5.408, sergio **6.352/6.352**. `ViewTable` sergio: primo turno 6.352/6.352, due turni 3.928/3.928. Nel campione: 66 riflessi, 99 gettoni tenuti, 15 Conto salato sul gettone, 316 Lo sanno tutti |
| Mutazioni | **3/3 uccise** dalle due fedeltà: la previsione ignora il testo consumato; testo dato ai non-oggetti; testo consumato preferito agli effetti stampati ([dati](sb-17/b2/mutations.json), [esecutore](sb-17/b2/mutations.py)) |
| `TestServerContext` e `verify-match-manifests.py` | verdi sulla bozza finale (1.001 test, 0 falliti); manifest PASS |

## Giro

Lanciatore e semi della Fase B ([run.ps1](sb-17/run.ps1), `-OutputRoot %TEMP%\bm-sb17-b2\run`): regole `d50`, 12 stili letali,
144 celle per incontro, 300 semi, 259.200 partite per giro. Quote di Sergio sulle decisive, soli euristici (D93); invarianti 0 e
bound oltre il tetto 0 in tutti i giri.

| Incontro | Giro 1 (D110): quota / patte / turni | Giro 2 (+R1: 24 HIT) | **Giro 3 (+R3: 20 A)** | D95 al giro 3 |
|---|---|---|---|---|
| Sergio–Sergio | 47,1% / 5,1% / 12,5 | 47,1% / 3,3% / 11,2 | 47,8% / **5,9%** / 12,1 | dentro |
| Sergio–Spazienzio | 59,3% / 2,5% / 9,9 | **68,3%** / 2,0% / 9,3 | 58,9% / 3,2% / 9,8 | dentro |
| Sergio–Mara | 50,9% / 4,9% / 11,1 | 62,8% / 3,9% / 10,4 | 48,0% / 5,1% / 10,9 | dentro |
| Sergio–Celestina | **22,2%** / 5,9% / 11,6 | 38,3% / 6,4% / 11,1 | **24,9%** / 5,8% / 11,4 | quota −10,1 |
| Sergio–Piera | **31,0%** / 5,7% / 10,8 | 49,3% / 5,9% / 10,3 | **33,7%** / 6,9% / 10,6 | quota −1,3 |
| Sergio–Beppe | 44,9% / 2,8% / 8,8 | 57,9% / 2,8% / 8,3 | 44,9% / 2,7% / 8,6 | dentro |

Dettagli: [giro 1](sb-17/b2/round-1.md), [giro 2](sb-17/b2/round-2.md), [giro 3](sb-17/b2/round-3.md). Patte entro il 10% in
ogni incontro e giro, specchio compreso; durata entro 12 turni fuori dallo specchio in tutti i giri.

**Riserve, nell'ordine della sezione 4.**

- Dopo il giro 1, due incontri sotto il 35% (Celestina, Piera): **R1**, Lo sanno tutti 20 → 24 HIT.
- Dopo il giro 2 nessun incontro sotto il 35% e uno oltre il 65% (Spazienzio 68,3%): **R3**, costo 15 → 20 A.
- Dopo il giro 3 di nuovo due incontri sotto il 35%: varrebbe R2, ma i due giri di riserva sono finiti. Si passa con lo
  scostamento dichiarato (D95 (3)).

R3 ha tolto più di quanto R1 aveva dato: il giro 3 è vicino al giro 1.

**Carte (giro 3, euristici).**

- **Quasi sempre:** Lo sanno tutti 92,3%, Battutina 84,7%, Lo metto in conto 82,6%.
- **Quasi mai:** Frecciatina al volo 0,5% (priorità 2, 2 HIT: la bound più debole, presa nel mazzo per D110), last resort 2,6%.
- Le contromosse si giocano poco: Ricatto 18,1%, Lo sapevo 24,9%.
- Ricerche fallite di Oh, guarda là 4,8% (21,7% nella Fase B); mazzo esaurito 7,9% (32,0%).

## Ricerca per mutazione (lettura, D110 (2))

`BenchMeasureTest#search` con i parametri della Fase B (25 generazioni, tre stili euristici, tutti i mazzi della bozza come
avversari), sulla bozza finale ([rapporto](sb-17/b2/search.md)).

| Partenza | Quota di convalida | Carte di Sergio tenute |
|---|---|---|
| prova-sergio | 98,9% | **2 su 20**: Lo sanno tutti ×1, Ricatto ×1 (bound Frecciatina e Mi informo) |
| casuale | 99,6% | **0** |

Lo starter in convalida fa 43,9%. I mazzi trovati usano di nuovo Estasi da Coca Etilene ×2, Sgommata e gli oggetti: è il problema
del pool, in ingresso a SB-19/SB-20 (D110 (2)). Rispetto alla Fase B la ricerca tiene un titolo d'archetipo in più (Lo sanno tutti).

## Budget

| Voce | Tetto | Speso (orologio) |
|---|---:|---:|
| Fattibilità | 50 | 8,8 |
| Giro 1 | 200 | 115,9 |
| Giri di riserva | 2 × 200 | 107,2 + 114,1 |
| Ricerca | 200 | 140,2 |
| Riserva | 150 | 0 |
| **Totale** | **1.000** | **486,2** |

Fuori budget ([budget](sb-17/b2/budget.json)): passo 0 (11,2 + 11,3), identità viva (74,4 + 78,2), suite, contesto, mutazioni
(67), diagnosi della prima chiusura. Mai due Maven o misure insieme (nessun Java attivo prima di ogni avvio).

## Verifiche

`./scripts/build.ps1 -Task Test -Offline` verde sulla bozza finale (883 test, 0 falliti); `-Task TestServerContext` verde
(1.001); `verify-match-manifests.py` PASS; `check-rules.py`, `check-links.py` (0 rotti), `git diff --check` e
`rarita-bozza.py --check` verdi. Area «solo dati della bozza»: il diff è di dati, test e documenti, più i tre file del bot
autorizzati da D111; nessun altro file di `server/src/main`.

## Dichiarazioni

1. Nella prima chiusura nessuna misura era partita: il giro è stato fatto tutto dopo la correzione.
2. `bozza-di-riferimento.md` non è rigenerata (fuori perimetro): come scritto in SB-17t, la rigenera la regia dopo la B2.
3. Con le regole vive nulla cambia: Tennents Super è una carta viva, ma il campo nuovo lo legge solo la previsione, e l'identità
   viva lo conferma.

## Cosa giudica il proprietario

Quale stato di Sergio tenere: il giro 3 è l'ultimo applicato ed è quello in bozza.

## Domande

1. Si tiene la bozza del giro 3 (R1 + R3: due incontri sotto, Celestina 24,9% e Piera 33,7%) o si torna a quella del giro 2 (solo R1:
   un incontro sopra, Spazienzio 68,3%, con gli altri cinque dentro)? Il giro 2 è più vicino alla soglia D95 nel complesso.
2. Frecciatina al volo, giocata nello 0,5% delle partite: torna Mi informo nel mazzo di prova, o resta per SB-25/SB-20?
3. Si chiude SB-17 con lo scostamento dichiarato (D95 (3)) e si passa a SB-18?
