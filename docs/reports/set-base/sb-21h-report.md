# SB-21h Fase B — bound nuove: bot, misura per bound, starter

Esecutore, 20 novembre 2026. Fonte: [D160](../../set-base-decisioni.md#decisioni-del-proprietario), [D159](../../set-base-decisioni.md#decisioni-del-proprietario), [proposta approvata](../../design/set-base/sb-21h-bound-proposta.md). Evidenze in [sb-21h/fase-b](sb-21h/fase-b/).

## Esito

**STOP per il proprietario, punto 4 di D160.** Con i bot corretti e i valori tenuti per bound, gli starter **non passano D149 (4)**: 6 coppie fuori dal 35–65%, 9 fuori obiettivo (SB-21g: 2), durata media da 8,70 a 9,13 turni, patte da 4,16% a 4,31%, specchio di Celestina all'11,9% di patte (D95). Le due alternative che il formato dati già consente non bastano: ×0,75 solo su HIT e CUT, 9,05 turni; risorsa della difesa circa dimezzata, 9,01 turni. Nessuna meccanica nuova inventata.

- `bozza.json` torna alla consegna di SB-21g (SHA-256 `bb182da9…f91be`), come vuole D149 (4) quando il controllo non passa.
- Restano consegnati il supporto dei bot (solo playground), le due varianti Java e gli strumenti di misura. Il candidato misurato è in `server/src/test/resources/set-base/sb-21h/candidata-k1.json`, letto dai test di fedeltà e delle varianti.
- La ricerca dei costruiti (punto 3d) **non è stata fatta**: non ha senso su starter fermi. Le matrici dei costruiti mancano.
- Budget: **3.758 s su 9.000** (tetto vero; nessun altro tetto applicato). Questa macchina è circa 2,8 volte più lenta di quella di SB-21g: un giro completo di 403.200 partite costa 473 s contro 138 s.

Il proprietario deve scegliere tre cose:

1. La difesa: tenere ×0,75 su HIT, CUT e POISON e ribilanciare gli starter con altre leve, scegliere una delle due alternative misurate, oppure «solo il prossimo colpo», che chiede il motore.
2. Sergio (b): passa il +10 solo **senza risorsa**, cioè non ha più la forma (b) di D159.
3. Spazienzio: le sonde contro sé stesso non vedono il suo salto di circa 20 punti contro gli altri.

## Bot

Le forme si riconoscono dagli effetti stampati, mai dai nomi. Valgono solo con regole playground e solo per le bound (`isCharacterBound`).

- **Difesa di un turno con guadagno** (`StyleSupport.guardForm`, `guard`). Serve almeno uno status GOOD in ingresso a sé, con fattore minore di 1 su HIT, CUT o POISON, senza conversione e con `turns` 0, più un guadagno di una risorsa diversa da HEALTH.
  - Valore: il colpo più forte che l'avversario mostra, può pagare e risolve dopo la bound (metà sul pari), per (1 − fattore) e per tipo. Almeno `UNSEEN_HIT` = 8 HIT, o `CHARGED_HIT` = 10 contro una carica visibile. Più il veleno periodico evitato (T/2 per (1 − fattore POISON)).
  - Gli stili lo pesano come una cura: Aggressive ×1, o ×2 se è dietro; Prudent ×2 per il bisogno; ResourceAware per il valore della salute. Al posto del bonus fisso DEFENSE e del BRACE del ritmo; il guadagno entra come prima.
  - Una DEFENSE senza guadagno, come «Fare il vago» di SB-21g, si legge come prima.
- **Pulizia parziale di T/L** (`StyleSupport.cleanse`). Conta la quantità vera tolta dopo i costi.
  - T: il veleno risparmiato ((T/2 − T'/2) per l'orizzonte di sempre).
  - L: l'A non drenata a fine turno, meno la corazza persa contro un HIT (L/4 − L'/4).
  - Immunità: nessun valore. Meno il danno della carta migliore in mano che dopo la pulizia non si può più pagare (il carburante).
- **Cura condizionata** (ROC-BO2): il guadagno di HEALTH vale solo dentro la finestra stampata (`healthAtLeast`…`healthAtMost`).
- **Contromossa condizionata** (CES-BO1): annulla solo se la carta del bersaglio contiene «Annuncia» (`ifSearch`).
- `TurnForecast` e `ViewTable` applicano la finestra della cura e la condizione «Annuncia», nelle due varianti Java.

**Identità** (fuori budget, esclusiva):

| Verifica | Esito |
|---|---|
| Passo 0 | Fattibilità 16.128 partite pulita; «Rif» 403.200 partite identica a `matrice-h.json` di SB-21g ([passo-0.json](sb-21h/fase-b/passo-0.json)). |
| Vivo, 1.13, banco storico, codice base contro codice nuovo | `final-live.json` e `.md` identici byte per byte (json `26F4263E…`, md `14E9BBAF…`). |
| Passo 0 sulle bozze precedenti (`bb182da`, `6630ebf`), base contro nuovo | Identiche file per file (escluso `seconds.txt`). |
| Le stesse tre col codice finale (`final`) | Identiche alla base: vivo json `26F4263E…` e md `14E9BBAF…`; passo 0, 7 file su 7 per ciascuna bozza. |

L'hash del vivo differisce dallo storico `ca131721…` per un percorso scritto nell'intestazione, quindi il confronto è fra base e nuovo su questa macchina.

**Test nuovi.** `Sb21hBotFormsTest` (difesa valutata e assente nel vivo, DEFENSE senza guadagno come prima, pulizia, finestra della cura) e `Sb21hBoundTest` (le due varianti in partita e nei testi stampati). Sei mutazioni, tutte prese: guardia a zero, pulizia ignorata, guardia anche nel vivo, finestra della cura ignorata, contromossa su tutto, cura sempre. `TurnForecastFidelityTest` e `ViewTableFidelityTest` hanno due bracci nuovi sul candidato: gli starter, poi i due mazzi con le varianti.

## Misura per bound

Criterio D159: una bound vera più una nulla contro due nulle, specchio del personaggio, posti alternati, 100 semi per cella da 7.000.000, 12 stili. Conferme su semi indipendenti da 7.500.000 o 7.600.000. Δ = quota della riga meno la riga nulla-nulla.

| Personaggio | (a) Δ | (b) Δ | (c) Δ | Verdetto |
|---|---:|---:|---:|---|
| Spazienzio | −5,3 / −9,3 | +8,9 / +4,2 | +1,2 | tutte dentro |
| Mara | +1,6 | +10,7 (+6 A) → **+8,5 / +8,1 con +5 A** | +1,0 | (b) ridotta |
| Celestina | +9,9 / +7,4 | +14,9 / +12,1 (+6 T) → +10,8 / +9,9 (+2) → **+8,2 / +7,8 con +1 T** | −0,9 | (a) confermata; (b) ridotta |
| Piera | −1,8 | −4,3 | +0,8 | tutte dentro |
| Beppe | +5,0 / +6,9 | +8,9 / +10,6 (+5 V); +8,8 / +11,4 (+4); +8,6 (+3) | −0,2 | (b) tenuta a +5 V: 9,75 sulle due serie, abbassare non sposta |
| Sergio | +13,7 (+2 A, 2 HIT) → **+6,5 / +7,9 con +1 A, 1 HIT** | +28,5 (+8 A); +21,5 (+4); +14,3 (+2); +11,5 / +11,6 (+1); **−9,1 senza risorsa** | −7,7 | (a) ridotta; (b) dentro solo senza risorsa |
| Duccio | +1,6 | +0,5 | +0,2 | tutte dentro |

Per Sergio (a) la leva più leggera per prima: +1 A con 2 HIT dà +12,8, +2 A con 1 HIT +10,9, solo 2 HIT +10,4; passa solo +1 A con 1 HIT. Per Sergio (b) ×0,75 solo su HIT e CUT dà gli stessi numeri, perché nello specchio di Sergio non c'è veleno.

I valori vicini a +10 sono giudicati sulle due serie insieme (200 semi per cella). Con 100 semi l'errore è circa ±5 punti.

**Varianti (c)** misurate solo negli specchi, tutte dentro. Il mazzo costruito adatto non è stato misurato: lo STOP viene prima.

## Valori tenuti

Candidato `k1`, dalle bound di D160 ([bound.py](sb-21h/fase-b/bound.py), [candidati.json](sb-21h/fase-b/candidati.json)):

- Mara (b) «Semaforo rosso»: +6 → **+5 A**.
- Celestina (b) «Stretta al giubbotto»: +6 → **+1 T**.
- Sergio (a) «Battutina»: +2 A, 2 HIT → **+1 A, 1 HIT**.
- Sergio (b) «Fare il vago»: +8 A → **nessuna risorsa**. Resta HIT, CUT e POISON ×0,75 di questo turno; i bot lo leggono come una DEFENSE di prima.
- Le altre 17 come D160.

Numeri nel criterio D158. 124 carte, rarità invariate. `controlla-numeri` e `controlla-testi` sono verdi su ogni candidato.

## Starter

Stessi semi e stili di SB-21g, 403.200 partite euristiche per candidato; `com` a parte. Durata in turni medi, patte aggregate.

| Candidato | Fuori 35–65 | Fuori obiettivo | Patte | Turni | D95 |
|---|---:|---:|---:|---:|---|
| Consegna SB-21g | 0 | 2 | 4,16% | 8,70 | — |
| k1 (valori tenuti) | 6 | 9 | 4,31% | 9,13 | specchio Celestina 11,9% patte |
| k2a: k1, Spazienzio (b) +3 V (solo sue coppie) | 5 | 8 | 4,37% | 9,15 | idem |
| k2b: k1, Spazienzio (b) +1 V | 4 | 8 | 4,29% | 9,17 | idem |
| kA: k1, ×0,75 solo su HIT e CUT | 6 | 9 | 4,01% | 9,05 | 10,9% |
| kB: risorse della difesa circa dimezzate | 4 | 7 | 4,08% | 9,01 | 11,9% |

kB vuol dire: Spazienzio +2 V, Mara +2 A, Celestina +1 T, Piera +2 L, Beppe +2 V, Duccio +4 A, Sergio come k1.

Coppie che peggiorano in k1 (quota della prima, SB-21g → k1):

- Spazienzio contro Mara 47,5 → 70,6, Celestina 47,7 → 66,8, Piera 48,9 → 69,5, Beppe 55,1 → 75,6, Sergio 43,6 → 62,9.
- Celestina–Sergio 57,9 → 68,4.
- Mara–Duccio 64,2 → 66,9.

Quasi ogni coppia si allunga di 0,3–1,4 turni; specchio di Sergio da 13,4 a 14,8. Abbassare la risorsa di Spazienzio a +1 V lascia Spazienzio–Beppe al 73%: il salto viene dalla difesa e dalla pulizia, non dalla V.

Matrici: [matrice-rif](sb-21h/fase-b/matrice-rif.json), [k1](sb-21h/fase-b/matrice-k1.json), [kA](sb-21h/fase-b/matrice-kA.json), [kB](sb-21h/fase-b/matrice-kB.json), con le verifiche `verifica-starter-*.json`.

## Costruiti

Non misurati: la ricerca dei sette, i due incroci, Piera 6/6, Mara 0/6, la quota sopra il 70%, Giro secco ed Estasi. Restano quelli di [SB-21g](sb-21g-report.md). Al ritmo di questa macchina la ricerca completa dei sette costerebbe circa 11.000 s, più del budget intero: alla ripresa serve una macchina più veloce o un budget rivisto.

## Scelte prese

- **Binding nuovi** per le due varianti: `base.cesira.bound.NeRiparliamoFuori` (estende la contromossa) e `base.rocco.bound.MiRialzo`. Il passo stampato ha i campi `ifSearch`, `healthAtLeast` e `healthAtMost`, letti da motore, previsione e tavolo. Il testo del generatore per «un quarto» è «un quarto della tua X residua, arrotondato per difetto»; i 117 testi vecchi sono invariati.
- `Sb19MeasureTest`: il verdetto del vecchio tetto (`boundViolations`) non ferma più il giro (D159 (2)); le quantità restano in `matrix.json`. In più c'è il seme iniziale `-Dsim.sb19Seed` per le conferme.
- Sergio (b) senza risorsa è la lettura letterale di D160 («abbassala solo se supera +10»), ma esce dalla forma (b) di D159: decide il proprietario.
- Il ruolo COUNTER di CES-BO1 prende il bonus fisso delle contromosse dai bot; con +0,2 nello specchio non pesa, ma va guardato nei costruiti.

## Riproduzione

Dalla radice, con `$sh` la shell PowerShell. Script in [sb-21h/fase-b](sb-21h/fase-b/); area `server/target/sb-21h-b`.

1. Passo 0: `python -B -X utf8 docs/reports/set-base/sb-21h/fase-b/sb21h.py --shell $sh passo0`
2. Sonde per bound: `sb21h.py ... sonde d160`, poi `bound d160 <chi...> [--seme N] [--righe ...]`. Le varianti di valore si fanno con `sonde vN --varianti chi:tag:slot:campo=valore` (v2–v4: specifiche nel paragrafo sopra).
3. Starter: `sb21h.py ... starter k1 base.mara.bound.CambioMarcia:self.0.amount:5 base.tossico.bound.RaschiareIlFondo:self.0.amount:1 base.cesira.bound.Battutina:self.0.amount:1 base.cesira.bound.Battutina:target.0.amount:1 base.cesira.bound.FareIlVago:self.0:del`. Le stesse liste di kA e kB sono in [candidati.json](sb-21h/fase-b/candidati.json); `starter-da k2a k1 bruiser.character.LittleRage:self.0.amount:3`.
4. Identità: `identita.ps1 -Kind live|step0 -Build base|new|final [-Draft ... -Tag ...]`.
5. Evidenze: `sb21h.py ... evidenze`.

## Verifiche

- Sulla bozza ripristinata: `controlla-numeri` (0 violazioni), `controlla-testi` (117 carte), `genera-bozza-di-riferimento.py --verifica`, `rarita-bozza.py --check consistent`, `check-links.py` (0 rotti), `check-rules.py`, `git diff --check`: verdi.
- `./scripts/build.ps1 -Task Test -Offline`: server 970 test, 0 falliti, 23 saltati; client 37/37. Fedeltà: braccio `sb21h` della previsione 5.986/5.986 turni, con «Ne riparliamo fuori» risolta 350 volte e «Mi rialzo dal marciapiede» 201.
- `-Task TestServerContext -Offline`: 1.088 test, **1 fallito**, `BozzaCliTest.draftMatchesCompleteThroughTheCli` («Missing expected rejection»: il salvataggio di un mazzo pronto non viene rifiutato, riga 107 di `cli-draft-complete-test.cjs`). **Preesistente:** fallisce uguale sul codice di HEAD (`889704b`), con le modifiche messe da parte. Non tocca bot né bound; va segnalato alla regia.
- `verify-match-manifests.py`: PASS.

## Stato

- Fase B: STOP per il proprietario al punto 4 di D160, con bot, varianti e misure consegnati e la bozza di SB-21g.
- Prossimo: la scelta del proprietario sulla difesa, su Sergio (b) e su Spazienzio; poi starter e costruiti alla ripresa.
