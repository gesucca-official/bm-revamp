# SB-17 — Fase A3: le bound di Sergio (proposta)

**16 novembre 2026, passo con proposta ([D113](../../set-base-decisioni.md#decisioni-del-proprietario)). STOP per il proprietario.**
Nessuna misura e nessun codice in questa fase. Si parte dallo stato di D112 (giro 2 della B2: Lo sanno tutti 15 A, 24 HIT).

## 1. Il terzetto proposto

| ID | Nome di lavoro | Pr. | Effetto | Unità per uso | Nel mazzo di prova |
|---|---|---:|---|---|---|
| CES-BO1 | Mi informo | 0 | +8 A a sé (invariata) | 4 | no, collezione (D112 (2)) |
| CES-BO2 | Battutina | 1 | 3 HIT al bersaglio (invariata) | 4 | sì |
| CES-BO3 | **Lo rivendo** (nuova) | 0 | Bersaglio: sé. **Se hai un oggetto:** il tuo oggetto più vecchio esce dal campo **senza il suo effetto**; +7 HEALTH a sé. **Se non ne hai:** +2 HEALTH a sé | 4 netto con l'oggetto, 2 senza | sì |

**Frecciatina al volo esce dalla bozza** (D113: «al posto di Frecciatina al volo»). Battutina resta: è l'unico danno gratuito di
Sergio, giocata nell'80% delle partite al giro 2, e i suoi incontri più deboli (Celestina 38,3%) sono quelli in cui toglierla
pesa di più. Mi informo resta com'è nella collezione. Rarità NC come le altre bound di Sergio; il conto delle carte resta 93.

**Perché salute e non A.** Gli oggetti di Sergio diventano già A con la basic Lo metto in conto (+5 A, poi l'effetto
dell'oggetto) e Mi informo dà A: una seconda via oggetto → A sarebbe un doppione. La salute invece Sergio non la trova altrove
nel mazzo (solo i +3 H di Tartaruga). Il tema regge: Sergio rivende tutto, anche la roba che non gli serve
([scheda § 6](schede-personaggi.md#6-sergio-sommerso-cesira-la-malalingua--booster-concept-nuovo)).

**Variante non raccomandata (domanda 1).** Una seconda bound di scambio al posto di Battutina: «Lo metto all'incasso», con
oggetto +14 A (7 unità lorde, 4 nette), senza +4 A. Toglie a Sergio il colpetto e si sovrappone alla basic.

### Valore rispetto al tetto

Tetto D33/D36: 4 unità per uso per le bound di risorsa; HEALTH pesa 1, A 0,5. Il banco misura i guadagni della bound, non
l'oggetto perso: qui l'oggetto è il **prezzo** della bound, e propongo di contarlo come tale.

- **Regola di prezzo proposta:** valore netto = guadagno − valore dell'oggetto rinunciato, ≤ 4. Un oggetto qualsiasi, preso con
  Lo metto in conto, vale per Sergio almeno i +5 A della basic (2,5 unità) più il suo effetto. Riferimento: l'oggetto più
  povero del mazzo, il Santino (immunità all'effetto periodico di L; per Sergio, che non ha L, quasi nulla): 2,5 + 0,5 ≈ **3**.
- **Con l'oggetto:** +7 HEALTH = 7 unità lorde, **4 nette** sul Santino, **−3** su un Espresso (2,5 + 7,5 = 10). Vendere la
  roba povera conviene, vendere il caffè no.
- **Senza oggetti:** +2 HEALTH = 2 unità, sotto Battutina (4): resta giocabile ma di ripiego.

Il banco delle bound (`BoundCap`) gioca con un mazzo di sole attese e **senza oggetti**: l'invariante «bound oltre il tetto»
vedrà solo il ramo da 2 unità. Il ramo con l'oggetto resta una stima del listino, dichiarata.

## 2. Senza oggetti, la basic e R03

- **R03 (regolamento 1.13): nessuna bound bersaglia oggetti**, perché bound e last resort garantiscono sempre una mossa. Lo
  rivendo bersaglia sé, sceglie l'oggetto da sola (il più vecchio, come la regola di capacità) e ha un ramo senza oggetti:
  la lettera e lo scopo di R03 restano. Il caricatore della bozza continua a rifiutare `consume` in una bound. Cambia invece il
  principio della griglia sulle bound («senza oggetti… né cure»): lo deroga D113, e la riga va scritta in griglia.
- **Quando decide:** alla risoluzione. Se l'oggetto è sparito prima (rubato, distrutto, scalzato dalla capacità) vale il ramo
  senza oggetti, come R04 per chi bersaglia un oggetto scomparso.
- **Il bot:** la previsione (`TurnForecast`) legge il ramo che corrisponde agli oggetti propri visibili e toglie dal campo il più
  vecchio; gli stili leggono i guadagni dello stesso ramo. **Limite dichiarato:** nessuno stile dà un valore all'oggetto perso,
  quindi i bot possono vendere un Espresso. Il giro lo misura (§ 5, letture).
- **Con Lo metto in conto:** nessun conflitto (una mossa per turno), ma le due carte pescano dallo stesso campo. In combinazione:
  il giocatore beve l'oggetto buono con la basic e rivende quello povero; la vendita dà anche un uso all'oggetto più vecchio
  che la capacità 2 butterebbe via alla pesca del terzo. Rischio: meno oggetti per la basic (oggi 75% delle partite).

## 3. Mazzo di prova (20 carte, al più 2 copie)

Bound **Battutina** e **Lo rivendo**. Con 3 oggetti su 20 (Santino ×1, Espresso ×2) la vendita avrebbe poca merce, quasi
sempre un Espresso. Propongo **5 oggetti**:

| Esce | Entra |
|---|---|
| Tartaruga sul marciapiede 2 → 1 (28,6% delle partite al giro 2) | Santino della portinaia 1 → 2 |
| Acqua in faccia ×1 (29,0%) | Peroni da 66, calda ×1 (OGG-02, +10 L: per Sergio solo un po' di corazza) |

Restano intatte le carte delle letture (Ricatto, Lo sapevo, Oh, guarda là) e i colpi. Rischio: ogni oggetto pescato fa pescare
ancora, quindi il mazzo finisce prima (mazzo esaurito 6,0% al giro 2).

## 4. Forma: Java, con codice di bot

I sei passi di oggi non bastano: `consume` è vietato nelle bound e applica l'effetto dell'oggetto. Serve:

1. **`DataCards` (sim, deroga del playground):** passo nuovo `vendi` con due liste annidate (`seHai`, `seNo`) di soli
   guadagni e perdite proprie; solo in `self`, una volta, in carte con bersaglio SELF; non dentro `anticipo` né `gettone`.
   Toglie dal campo il primo oggetto della lista (il più vecchio) senza effetto; riga di registro «Sold Item X».
2. **`PrintedEffects` (modello):** un segno di ramo sugli step, come quello del gettone.
3. **`TurnForecast` e stili (bot):** il ramo secondo gli oggetti visibili; l'oggetto esce dalla previsione.
4. **Documenti, prima del codice:** riga RP nuova in [regole-playground](regole-playground.md) (versione 1.2), CES-BO3 e il
   principio delle bound in [griglia](griglia.md); poi `bozza.json` e la bozza di riferimento rigenerata. Nessun file del
   regolamento, del set o del client.

Verifiche dalla [tabella delle aree](../../aree-protette.md): le «Sempre» (`Test -Offline`, `check-rules.py`); **passo 0
d'identità** prima di cambiare la bozza (codice che la misura esegue); **identità viva** e **`TestServerContext` con i
manifest** (modello e bot sono fuori dalla deroga); **fedeltà** `TurnForecastFidelityTest` e `ViewTableFidelityTest`;
mutazioni 3–8 (ramo con e senza oggetto, scelta del più vecchio, oggetto sparito alla risoluzione, rifiuti del caricatore).

## 5. Giro corto

- **Lanciatore e semi della B2** ([run.ps1](../../reports/set-base/sb-17/run.ps1)): `d50`, 12 stili letali, 144 celle, 300 semi,
  259.200 partite; partenza dallo stato di D112 più § 1 e § 3.
- **Criteri (D95, come nella B2):** ogni incontro fra 35% e 65% sugli euristici, patte ≤ 10%, durata ≤ 12 turni fuori dallo
  specchio, invarianti e bound oltre il tetto a 0. Spazienzio era già fuori (68,3%, scostamento accettato da D112): passa se
  **non supera il 68,3%**.
- **Una riserva, scritta prima. R1:** se un incontro supera il 65% (Spazienzio oltre il 68,3%), Lo rivendo scende a **+5
  HEALTH** con l'oggetto (2 netti), ramo senza invariato. Sotto il 35% non c'è riserva: alzare il guadagno sfora il tetto
  netto. Scostamento dichiarato e STOP.
- **Letture (non criteri):** partite con Lo rivendo, quota del ramo con l'oggetto, quali oggetti si vendono (Espresso
  compreso), uso di Lo metto in conto, mazzo esaurito.
- **Budget di orologio 500 s:** fattibilità 50, giro 200, riserva R1 200, margine 50. Fuori budget come nella B2: passo 0,
  identità viva, suite, contesto, mutazioni.

Poi la prova finale del proprietario col mazzo di prova, che chiude SB-17 (D113 (2)).

## 6. Domande al proprietario

1. Una sola bound di scambio (Lo rivendo, salute, al posto di Frecciatina) come raccomandato, o anche la seconda per A al posto
   di Battutina?
2. Vendita **senza** l'effetto dell'oggetto e sull'oggetto **più vecchio**, scelto in automatico (R03 resta intatta)? L'altra
   via, scegliere l'oggetto, chiede più codice e una rilettura di R03.
3. Prezzo: +7 HEALTH con l'oggetto e +2 senza, con la regola «netto ≤ 4, oggetto di riferimento da 3 unità»?
4. Mazzo: Santino 2 e Peroni 1, fuori una Tartaruga e Acqua in faccia?
5. Forma Java con codice di bot e le verifiche che ne seguono (identità viva, contesto, fedeltà), giro corto con R1 e 500 s?
