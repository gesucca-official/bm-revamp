# SB-20c — Testi stampati della bozza, proposta di Fase A

## In breve

Generare i testi dagli effetti a dati, dichiarare per binding la prosa delle carte Java e leggere i loro numeri dai parametri. Salvare il risultato in `bozza.json` e controllarlo a ogni correzione di SB-21. STOP alla proposta secondo [D138 (2) e (4), D139 e D141](../../set-base-decisioni.md#decisioni-del-proprietario). Glossario, italiano semplice, campione editoriale approvato e prova di ingombro sono in [SB-25](../../set-base-plan.md#sb-25--testi-delle-carte-per-i-giocatori).

## Come arriva il testo oggi

| Percorso | Lettura e resa |
|---|---|
| Bozza | `BozzaDraft` carica le sorgenti con `DraftSource`. `Draft` legge il blocco `gui` per entrambe le famiglie di carte e trasferisce `description`, `gains`, `damage` e `damageAmount` sulla carta. `BozzaCardFactory` avvolge la descrizione in `<p>`, anteponendo i paragrafi delle parole chiave applicabili. La vista della carta espone `effect` e i riepiloghi. [Profilo bozza](../../../server/src/main/java/com/gsc/bm/bozza/BozzaCardFactory.java) |
| Vivo | `CardFactoryServiceImpl.buildHtml` legge la descrizione SQLite e aggiunge le parole chiave di basic, fallback, first strike e last strike dal repository delle parole chiave. Guadagni e danno arrivano separatamente dal catalogo. [Factory del vivo](../../../server/src/main/java/com/gsc/bm/service/factories/CardFactoryServiceImpl.java) |
| Client web | `contracts.ts` riceve stringhe in `effect`, `gains`, `damage` e `damageAmount`. `readability.ts` legge `+n H` / `+x H` e analoghi, e importi come `HIT 15` o `HIT 12+x`. Il volto Pixi usa costi strutturati, guadagni, danno e l'eventuale `inPlay` per disegnare glifi. Ispezione e collezione estraggono con `effect()` il testo dell'ultimo paragrafo e già disegnano le pillole dei guadagni. [Parser](../../../client-web/src/readability.ts) · [Interfaccia](../../../client-web/src/ui.tsx) |
| Client debug | Mano, dettagli oggetto e collezione mostrano `effect` come HTML Angular. Con il nuovo testo vedrebbero per esempio «+5 [[A]]» in chiaro. [Mano](../../../client-debug/src/app/client-debug/card-in-hand/card-in-hand.component.html) |
| SB-20a | Il generatore legge direttamente `gui.description`, ricava l'identità dal prefisso dello slot e rimuove quel prefisso dal campo «Testo stampato». La pagina usa testo e campi modificabili, perciò mostra i segnaposto in chiaro. [Generatore della pagina](revisione/genera-pagina.py) |
| Stampa | `tools/print-cards` legge il catalogo SQLite in sola lettura e impagina in PDF il testo della scheda normativa, verificandolo contro la descrizione SQLite. Per usare i segnaposto in PDF dovrà riceverli e disegnarli o stamparli in chiaro. [Generatore di stampa](../../../tools/print-cards/generate.py) |

## Sintassi e resa

`[[H]]` HEALTH, `[[A]]` ALERTNESS, `[[V]]` VIOLENCE, `[[T]]` TOXICITY, `[[L]]` ALCOHOL. La forma è esatta e distingue maiuscole e minuscole. Spazi, numeri e segni stanno fuori, come in `−5 [[A]]`. Riservare `[[` e rifiutare ogni altra sequenza con quell'apertura, anche nei nomi interpolati. Danni e durate restano `HIT`, `CUT`, `POISON` e «in questo turno» / «per 3 turni». Il formato si applica alla prosa di `description`. `gains`, `damageAmount` e `inPlay` conservano le grammatiche che alimentano le pillole e i consumatori server.

Le parentesi quadre sono caratteri ordinari in JSON e nel testo HTML. Serializzare il JSON e fare l'escape HTML della descrizione nella fabbrica bozza, prima di aggiungere paragrafo e parole chiave. Dopo l'estrazione del paragrafo, il web divide la stringa in testo e risorse ammesse, rende il testo con React e usa i glifi esistenti con un nome accessibile. Un lettore che ignora la sintassi vede «25 [[V]]»; un token sconosciuto ricevuto dal web resta leggibile in chiaro.

## Prova sulle 116 carte

Eseguire dalla radice `python -X utf8 docs/design/set-base/testi/genera-testi.py`. Il [prototipo](testi/genera-testi.py) legge un'unica istantanea del JSON. Scrive in `%TEMP%` i tre campi prima/dopo per ogni slot, i conteggi e l'impronta SHA-256. Esecuzione di riferimento in `%TEMP%\sb-20c-oelc780k.json`, bozza `d8d20308fa30e4559160241f0cd2daf53a76d9a7da4e7fb622c8b20ae42546fa`.

| Origine della descrizione | Carte | Tre campi uguali | Almeno un campo diverso |
|---|---:|---:|---:|
| Generata dagli `ops` | 99 | 40 | 59 |
| Dichiarata per classe Java, con valori dai `params` | 17 | 7 | 10 |
| Totale | 116 | 47 | 69 |

Confronto esatto dopo aver ridotto nella sola descrizione `[[X]]` a `X` e `HEALTH` a `H`. Differenze per campo: `description` 69, `gains` 1 (ROC-AR5 `+6 HEALTH` → `+6 H`), `damageAmount` 0. Contano punteggiatura, ordine e precisazioni. Il riepilogo del danno esclude autodanni, extra condizionali e incrementi di «Rincara»; i guadagni mostrano il premio a ricerca riuscita o il ricavato a vendita riuscita. Gli stati degli `ops` seguono `turns + 1` (D38 (2), [R05](../../game-rules.md#r05--danni-e-stati)); i parametri Java dei timer seguono la semantica della classe. Il testo mette il gettone nel ramo di ricerca riuscita ed esclude il log `say`.

**Testo dichiarato a mano, 17 carte.** Il JSON indica binding e parametri ma lascia alle classi la semantica seguente.

| Slot | Logica da dichiarare |
|---|---|
| SPA-AR5, TOS-AR4 | Annullamento di una mossa successiva, rispettivamente del bersaglio e delle mosse dirette a sé. |
| GEN-02, GIG-AR1, GEN-03, GEN-04 | Furto, distruzione, scambio con limiti di capacità e copia casuale di oggetti. |
| TOS-AR5, OGG-04, OGG-15 | Trasferimento e immunità differita; timer che cancella stati e immunità e infligge veleno; immunità periodica temporanea. |
| LR-PIN, PIN-AR2, PIN-AR5 | Lettura e spesa di L, danno variabile, rincari o perdita di A del bersaglio. |
| OGG-03, GEN-10 | Creazione del token e rimozione degli equip, con guadagno o danno. |
| GIG-AR5 | Danno per oggetto proprio sul campo. |
| CES-AR2, CES-AR3 | Contrattacco con quota e tipo del danno base; annullamento che lascia il gettone. |

Alcune classi espongono già `PrintedEffects` usati dai bot. Usarli per verificare i modelli, incluso l'ordine di spesa di LR-PIN.

### Campione prodotto

| Slot | Descrizione senza prefisso dello slot |
|---|---|
| SPA-AR1 | 25 [[V]]: 35 HIT al bersaglio. |
| MAR-AR1 | 20 [[A]]: CUT al bersaglio pari a 18 più metà della tua [[A]] residua, arrotondata per difetto. Gioca d'anticipo: 5 CUT al bersaglio. |
| CES-AR1 | 5 [[A]]: −10 [[A]] al bersaglio; 4 HIT al bersaglio. Annuncia «Lo sanno tutti» o «Conto salato». Se lo trovi: +15 [[A]]; gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5). Se non lo trovi: +5 [[A]]. |
| CES-AR4 | 5 [[A]]: 8 HIT al bersaglio. Se il bersaglio ha un gettone di vulnerabilità: 6 HIT al bersaglio. |
| CES-AR7 | Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: +8 [[H]] a sé. Se l'oggetto non c'è più, niente. |
| OGG-11 | Consumato: equip, HIT ricevuto ×0,75 per 3 turni. |
| OGG-17 | In campo: a fine turno −3 [[A]]. Consumato: +15 [[V]]. |
| GEN-21 | 5 [[V]]: equip, HIT inflitto ×1,5 e convertito in CUT, uso singolo (resta fino a fine turno dopo l'uso). |
| LR-PIN | Last resort: 2 HIT a sé. Spendi tutta la tua [[L]] residua. HIT pari a 12 più la [[L]] spesa al bersaglio. Rincara 4 (1 a sé). |
| OGG-04 | Consumato: immunità a [[T]] e [[L]]; +20 [[L]], +20 [[T]]; timer 5 che toglie tutte le immunità e gli stati, poi 20 POISON. |
| CES-AR2 | 15 [[A]]: Annulla la mossa del bersaglio se arriva dopo; se era un colpo, gli infligge metà del suo danno base, dello stesso tipo. |

## Scelte prese e piano per la Fase B

1. Dopo il via, chiudere SB-20c sulla bozza successiva a SB-20b. Applicare poi l'export SB-20a per identità stabile, con soli nomi, flavour e illustrazioni, e rigenerare le citazioni dei nomi nello stesso diff (D138). Rigenerare la pagina dopo l'export come indicato nelle [Scelte prese di SB-20b](../../reports/set-base/sb-20b-report.md#scelte-prese).
2. Rendere stabile il generatore in `docs/design/set-base/testi/`. Salvare in `bozza.json` i tre campi, conservando il prefisso dello slot per SB-20a. Aggiungere un controllo di uguaglianza esatta con l'uscita deterministica per entrambe le famiglie, con errore per slot e campo oppure token o schema sconosciuto. Usarlo a ogni diff di SB-21 insieme a R1–R4. R4 resta un controllo sui numeri, incapace di distinguere lo stesso numero sul bersaglio sbagliato o nel ramo sbagliato. Verificare le frasi Java anche contro classe e `PrintedEffects` quando disponibili; il solo confronto con il modello non intercetta variazioni della logica Java. Verificare che alterare costo, durata, risorsa o nome cercato senza rigenerare produca un errore.
3. Limitare il server a `BozzaCardFactory` per l'escape, con prova di caricamento e resa dell'HTML dei due tipi di carta. Nel web, intervenire in `ui.tsx`, `table.tsx`, `collection.tsx` e negli stili necessari. Verificare accessibilità, ripiego testuale, parole chiave, volto e ispezione. I campi di riepilogo alimentano anche bot e `Contromossa`: verificare pari valori interpretati e una prova deterministica su bozza a seme fisso; su ROC-AR5 il parser bot legge già H dal prefisso HEALTH.
4. Applicare [aree protette](../../aree-protette.md) (`Sempre`, server fuori deroga, client web): diff, link, regole, `Test`, `TestServerContext` con prova di isolamento del profilo e `verify-match-manifests.py`. Rifare il jar, eseguire web `Test` / `Build` / `Size` con `BM_OUT`, poi `Verify` e `VerifyLayout` a 1366×768, 844×390 e 1920×1080 e `VerifyDecks` a 1366×768 e 844×390. Per geometria aggiungere `Verify` / `VerifyFfa` / `VerifyAim` / `VerifyLayout` a 750×292 contro la base. Conservare `BASE_750` e i limiti di `Size`. Affiancare ai verificatori del vivo una prova esplicita profilo bozza su volto, ispezione e collezione. Le verifiche esclusive vanno a turno.

## Verifiche della Fase A

Prototipo sulle 116 carte, campione e lista manuale verificati contro il JSON in TEMP. Tre mutazioni intercettate (durata R05, danno condizionale, quota Java). Verdi `git diff --check`, `python scripts/check-links.py` (0 link rotti), `python scripts/check-rules.py` e `controlla-numeri.py` (0 violazioni). Le prove server e client sono previste in Fase B.

## Domande

1. Salvare i testi generati in bozza e verificarli in SB-21? **Raccomandazione** sì, rende il diff leggibile e mantiene per entrambi i caricatori lo stesso valore pubblicato.
2. Adottare `[[H]]` e analoghi nella prosa, con glifi web e testo in chiaro negli altri lettori? **Raccomandazione** sì, mantiene le grammatiche dei riepiloghi e permette una migrazione locale al profilo bozza.
3. Applicare l'export SB-20a dopo SB-20c, rigenerando insieme al cambio di nomi? **Raccomandazione** sì, segue D138 e permette al proprietario di finire la revisione sulla pagina che sta usando.
