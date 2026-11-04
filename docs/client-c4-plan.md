# Piano C4 — Rifinire grafica e uso su schermi diversi

3 novembre 2026. Regolamento **1.10**, [roadmap del client](client-roadmap.md) versione 38, HEAD di partenza
`a807aa0`. **Solo piano:** nessun codice client, nessuna modifica a regole, server, protocollo, catalogo o
`client-debug`. C0, C1, C2 e C3 sono chiuse. Stato corrente nell'[indice della documentazione](README.md#stato-corrente).

**D3, D4, D6, D9, D11, D13 e D14 sono confermate dal proprietario il 3 novembre 2026; D7 e D10 non servono più dopo la revisione di D6; le altre decisioni non sono prese.** Le voci restanti di D1–D14 sono proposte con una raccomandazione: decide il
proprietario. Le decisioni già prese altrove sono citate con la loro fonte e non si riaprono qui.

**Stato di C4-1, C4-1b, C4-3, C4-2 e C4-4.** C4-4 (cornici per tipologia e segno del ruolo: filetto medio) è fatto e **approvato dal proprietario** il 4 novembre 2026 ([rapporto](reports/client-c4-report.md#c4-4--cornici-per-tipologia-e-segno-del-ruolo-o8-con-o14)). C4-2 (dimensioni, bersagli da 44 px, conferma sulla carta, tutela di 750×292) è fatto il 4 novembre 2026 e **in attesa del giudizio del proprietario** ([rapporto](reports/client-c4-report.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292)). C4-3 (simboli, font, inventario) è fatto il 3 novembre 2026 e **in attesa del giudizio del proprietario** sul campione ([rapporto](reports/client-c4-report.md#c4-3--simboli-font-e-inventario-degli-asset)). C4-1 (strumenti, `VerifyAll`) è committato in `a6f6b1a`. C4-1b (misura di partenza) è eseguita il
3 novembre 2026 sulla stessa build: giro ufficiale 23 su 23 verde, base a 750×292 registrata; numeri nel
[rapporto](reports/client-c4-report.md#c4-1b--misura-di-partenza). I criteri di [C4-1](#c4-1--strumenti-di-verifica-o23) restano quelli con cui
si è giudicato lo strumento.

Fonti lette: [istruzioni](../AGENTS.md), [contributi](../CONTRIBUTING.md), [indice](README.md), [roadmap](client-roadmap.md)
(C4, C5, «Asset iniziali e condizioni di utilizzo», O1–O23, «Direzione visiva e interazioni», «Decisioni ancora aperte»),
[piano C3](client-c3-plan.md) come modello, [rapporto C3](reports/client-c3-report.md) (C3-L, C3-5, C3-7),
[README del client](../client-web/README.md), [procedura ed esiti C0-R5](reports/client-c0-r5-procedure.md#esiti),
[piano Set Base](set-base-plan.md#sb-32--illustrazioni-del-set), [provenienza C0](design/client-c0/r2-assets/README.md) e
[O9](design/client-c2/o9-art/README.md), i sorgenti e gli strumenti di `client-web`.

## Obiettivo e regole comuni

**Risultato di C4 (roadmap):** identità provvisoria coerente in tutte le schermate e controlli utilizzabili anche senza
hover, su desktop e su touch, fino al minimo reale deciso in [D6](#decisioni-del-proprietario). Il server resta l'unico
giudice; C4 cambia presentazione, geometria e strumenti, non il gioco.

Valgono per **ogni** blocco, come in C3:

- **Un blocco = una sessione = un commit**, in ordine, solo dopo l'istruzione del proprietario. Un blocco non si chiude con i
  soli test unitari.
- **Prima proposta, poi codice, nei blocchi visivi** (C4-3, C4-2, C4-4, C4-5a, C4-5b, C4-6): catture sul tavolo vero con le
  opzioni, scelta del proprietario, implementazione, come ha funzionato C3-L. Le prove di C3 hanno portato revisioni in quasi
  tutti i blocchi visibili (C3-2, C3-4, C3-L, C3-7): è previsto che accada anche qui, e una revisione è un commit proprio.
- **Partite reali** sul server locale, su database temporaneo, guidate da Edge/Playwright. Misure ufficiali: **1366×768 e
  844×390**. Scene sintetiche e fixture valgono per i test unitari, non come partita reale.
- **iPhone e 750×292: bene se funziona, senza diventare un obiettivo** ([D6](#decisioni-del-proprietario)). Il client web serve soprattutto a provare il gioco;
  il supporto vero al telefono arriverà con l'app ([Q16](open-questions.md)). Il lavoro già fatto non si perde: 750×292 è protetta dalla regola 18 e un
  miglioramento economico si fa, ma nessun blocco si apre o si allunga per quella misura. Edge sul PC non sostituisce l'iPhone: ciò che non è provato si dichiara.
- Verifiche: `./client-web/run.ps1 -Task Test`, `Build`, `Size`, quelle del blocco
  ([matrice](#verifiche-da-rieseguire-per-blocco)) e quelle di AGENTS: `./scripts/build.ps1 -Task Test -Offline` e
  `python scripts/check-rules.py`. Il contesto Spring ha una verifica separata, eseguita in C4-9.
- Documenti nello stesso commit: `client-web/README.md`, una sezione «C4-n» in `docs/reports/client-c4-report.md` (creato al
  primo blocco), la revisione della roadmap, le righe P toccate della [checklist](client-c0-parity.md). Evidenze in
  `docs/reports/client-c4/c4-n/`, secondo [D13](#decisioni-del-proprietario).
- Testi nuovi in italiano; identificatori wire, nomi carta e testo del server invariati.
- La FFA conserva quattro mani avversarie coperte e gli oggetti come carte presso le postazioni; nessun pannello testuale al
  posto del tavolo.
- Scaricare un asset da Internet richiede il consenso del proprietario nella sessione del blocco, con file, fonte e peso.

## Perimetro

| Voce | Cosa resta da fare | Blocco |
|---|---|---|
| [O23](client-roadmap.md#osservazioni-registrate-durante-c3) | Lancio unico delle verifiche, soglie invariate | C4-1 |
| [O22](client-roadmap.md#osservazioni-registrate-durante-c3) | Solo non regressione e miglioramenti economici a 750×292; l'adattamento completo passa all'app futura (D6) | C4-1b, C4-2, C4-9 |
| [O12](client-roadmap.md#osservazioni-del-proprietario-dopo-c1), finitura | Dimensioni su desktop e touch, bersagli da 44 px, carte piccole del round | C4-2 |
| [O10](client-roadmap.md#osservazioni-del-proprietario-dopo-c1) | Simboli al posto delle lettere rimaste, famiglia coerente; la priorità è già fuori dal volto ([C3-5](client-c3-plan.md#c3-5--volto-della-carta-ed-effetti-per-tipo-di-danno-o7)) | C4-3 |
| [O8 con O14](client-roadmap.md#osservazioni-del-proprietario-dopo-c1) | Cornice per tipologia e segno del ruolo nella stessa grafica | C4-4 |
| [O2](client-roadmap.md#osservazioni-del-proprietario-dopo-c1) | Sfondo con sedute da bar marcio | C4-5a |
| Coerenza delle schermate | Hub, form, editor, catalogo, profilo e dialoghi con l'identità del tavolo; riserve C0 B3 e B6 su bound, ✓ e × | C4-5b |
| [O9](client-roadmap.md#osservazioni-del-proprietario-dopo-c1), sostituzioni | **Opzionale**, D1: solo dove un'illustrazione non regge | C4-6 |
| Suoni | **Opzionale**, D2: con volume e muto, mai necessari al gioco | C4-7 |
| Accessibilità | Focus visibile, contrasto, movimento ridotto, tastiera, zoom del testo | C4-8a |
| [O21](client-roadmap.md#osservazioni-registrate-durante-c3) | Residui di C3-5 e C3-6 (tabella sotto) | C4-2, C4-8a, D5 |
| Prestazioni | 60 fps come obiettivo su desktop, budget di download, ridisegno incrementale (riserva C0) solo se serve | C4-1b, C4-8b |

**O21, voce per voce:**

| Residuo | Destinazione |
|---|---|
| ExtremelyViolentBlow con V reale mai vista sul volto | C4-8a: mazzo sintetico in open 1vCom (metodo D8 di C3) e controllo in partita reale |
| POISON provato solo in unità | Resta un limite dichiarato: nessuna carta lo usa; si controlla il disegno, non una partita |
| Carte piccole del round (36–40 px) con il solo simbolo | C4-2, insieme a O12; «Ultimo turno» resta il percorso completo |
| Segno statico sul bersaglio con movimento ridotto | [D5](#decisioni-del-proprietario), poi C4-8a |
| Controllo delle scritte a 844×390 in FFA | Chiuso e approvato il 2 novembre 2026; `end` e `gap` restano registrati, nessun lavoro |

### Cosa non è in C4

- **O19 (sequenza velocizzata) resta a C5:** si decide dopo la prova umana del ritmo. C4 non cambia le durate della sequenza
  né il tetto di 20 s.
- **O20 (FFA a timeout con vincitore computer) resta al proprietario**, da valutare a parte. Non riguarda il client e nessun
  blocco di C4 ne dipende.
- **A2 (clock più lungo):** nessun segnale dai dati di C3, non proposto.
- **O15, O16 (deckbuilder)** nell'attività successiva dedicata; **O17, O18** dal regolamento. C4-5b rende l'editor coerente, non
  lo riprogetta.
- **Illustrazioni finali del set:** [SB-32](set-base-plan.md#sb-32--illustrazioni-del-set) (decisione D24 del piano Set Base).
- **Adattamento completo a 750×292 (O22) e cattura fisica su iPhone:** all'app futura, secondo D6.
- **Prova umana C, `window.__bm`, guida di avvio:** C5. Nessun deploy, PWA, app nativa, 3D o sfondo video.
- **Regole, server, protocollo, catalogo, `client-debug`:** nessuna modifica. Se un blocco scopre di averne bisogno si ferma e
  si riparte dal regolamento, come prescrive AGENTS.

## Cosa c'è oggi

Controllato il 3 novembre 2026 sui sorgenti di `a807aa0`; corretto dopo C4-1b con la misura su `a6f6b1a` (stesso client). Dove è indicata una sonda, è un calcolo fatto per questo piano con
le funzioni del client, senza partite reali: serve a dimensionare, non è un'evidenza di blocco. Dove è indicata la «misura di C4-1b», sono partite reali.

| Tema | Stato verificato | Conseguenza |
|---|---|---|
| Altezza minima | Sotto 550 px le dimensioni compatte sono fisse: mano 120×166, cioè il 57% di 292 px. Sonda con `tableLayout` e `layoutProblems`, 0–3 oggetti per posto: **larghezza 750, nessun problema da 384 px in duello e da 417 px in FFA**; larghezza 844, da 384 e da **389 px** (a 844×390 la FFA entra con 1 px di margine). A 750×292: 5–6 problemi in duello, 11–14 in FFA (posti sovrapposti, un posto sopra la mano, nessun posto per le carte del round e per i primi piani, frecce). **Misura di C4-1b, partite reali a 750×292: `layoutProblems` 6 in duello e 11 in FFA, identici a ogni turno** (la sonda era giusta, con una voce in meno in FFA); `Verify` verde, `VerifyFfa`, `VerifyAim` e `VerifyLayout` rossi come atteso. | Mancano circa **92 px di altezza in duello e 125 in FFA**, e non basta rimpicciolire la mano. Con D6 non si colmano in C4: questi numeri diventano la base della regola 18. Le dimensioni compatte valgono sotto i 550 px, quindi anche a 844×390: restano in uso e verificate. |
| Spazio su iPhone | `index.html` non ha `viewport-fit=cover`. 750×292 è ciò che Safari lascia su iPhone 16 Pro. | **Ipotesi non provata:** potrebbe recuperare larghezza nelle aree laterali, non altezza. Da provare solo se costa poco; non cambia la conclusione sopra. |
| Sfondo | `scene.ts` **stira** `table.webp` (1672×941, rapporto 1,78) sull'intero schermo: a 844×390 l'altezza è schiacciata a circa l'82%, a 750×292 a circa il 69%. | O2 non è solo rigenerare le sedie: sedute e tavolo si deformano al variare del formato. C4-5a deve scegliere fra ritaglio e zone sicure. |
| Cornici | Un solo `frame()` per tutte le carte; la tipologia è solo testo (`subtype`) e il token risulta «OGGETTO». Il token non ha un campo nel wire: si riconosce da `bindingName` (`com.tokens.…`). Catalogo e volto delle carte sono disegnati **due volte**: Pixi (`scene.ts`) e HTML (`ui.tsx`, `collection.tsx`, `style.css`). | C4-4 tocca due disegni e deve avere un ripiego per i nomi sconosciuti, perché il Set Base «rispetta» le decisioni di C4. |
| Simboli | **Dopo C4-3: un solo sistema (`symbols.ts`) per Pixi e HTML, nessuna lettera di risorsa su volto, plance e gettoni.** Prima di C4-3: quindici simboli **già disegnati nel progetto** in `glyph` (5 risorse, 3 danni, 7 ruoli); quelli del danno sono stati rifiniti e approvati nella prova di C3-7. **Lettere rimaste:** monete del costo (`scene.ts`, `LETTER`), guadagni (`gainText`), gettoni di immunità (`chipsOf`). | Il residuo reale di O10 è piccolo; pesa su D3. |
| Font | **Dopo C4-3: Impact (ripiego Arial Narrow) e Arial; tolti Georgia e Consolas; ✓ e ✕ sono forme proprie.** Prima: tre famiglie: Impact (tutto il testo Pixi, `.brand`), Arial (shell), Georgia (la «i»). Nessun font distribuito. `stripPlan` assume una larghezza delle cifre di 0,62 volte il corpo; la disposizione di strisce e riga breve dipende dal font. | **Il font va deciso prima della geometria minima**: ecco perché C4-3 precede C4-2. |
| Crediti | **Dopo C4-3: nessun asset di terzi è entrato, quindi nessuna pagina crediti serve; inventario in `docs/design/client-c4/assets/`.** Prima: nessuna pagina crediti. La home dice che codice e illustrazioni sono riservati, senza distinguere materiali di terzi. | Con un asset CC BY o OFL servono crediti e licenze consultabili e una frase corretta sui diritti. |
| Controlli sotto 44 px | Scansione statica di `style.css`, da confermare sul DOM: `.presence button.link` 32 e 36, `.public button.link` 32, `.server-text summary` 36, `.slot summary` 36 e 40, `button.back` 40. La (i) è 28 px con 10 px di area invisibile per lato: 48 px. Gettoni di stato nel tavolo: 31×18 a 844×390, 41×24 in FFA a 1366×768 ([C3-L](reports/client-c3-report.md#misure-dopo-c3-l-partite-reali)); **confermati da C4-1b**: gettoni 61×36 (duello 1366×768), 41×24 (FFA 1366×768), 46×27 e 37×27 (duello 844×390), 46×27 e 31×18 (FFA 844×390); 31×18 anche a 750×292. Non è un elenco DOM completo dei controlli sotto 44 px. **Dopo C4-2:** al tavolo sotto 44 px restano solo i gettoni di stato (D8); elenco DOM nel [rapporto](reports/client-c4-report.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292). Quelli di hub, pubblico e profilo restano a C4-5b. | Lista di partenza di C4-2 e C4-5b; D8 per i gettoni. |
| Contrasto | Calcolo su tinte piene, indicativo: testo su carta 10,7:1; timbri di ruolo 5,8–9,4:1. Da controllare sul disegno reale: colori delle risorse su `#38271f` (HEALTH 2,1:1, ALERTNESS e VIOLENCE 3,1–3,2:1) e su carta (ALCOHOL 2,0:1, TOXICITY 2,4:1), focus `#6eafaf` su carta 1,8:1. | Nessun difetto dichiarato: C4-8a misura sul disegno reale. |
| Peso | JS gzip 330459 byte su 512000; totale gzip 1113651 su 4194304; texture decodificate 18,9 MB su 64 MB ([size.json](reports/client-c3/c3-7/size.json)). **Rimisurato in C4-1b, identico** ([size.json](reports/client-c4/c4-1b/size.json)): JS 80–83% del tetto di D9 poi tolto (400 KB), totale 51% (2,2 MB, tolto), texture 56% (32 MiB). Atlante con 7 riquadri liberi su 48 (non rimisurato). **C4-3:** JS 331 828 B (83,0% del tetto), totale 1 115 170 B (50,7%), texture invariate (56,3%); `size.mjs` ora legge WebP, PNG, JPEG, GIF e AVIF e controlla il tetto a parte dai limiti rigidi (dopo la revisione di D9, solo le texture). Prima di C4-3 leggeva solo le WebP. | C'è margine; per le texture va diviso col Set Base (D9 rivista). Altri formati raster non verrebbero contati nelle texture: da correggere prima di usarli. |
| Misura fisica | L'ultima cattura su iPhone è **C0, su scena sintetica**: frame p95 19 ms, input 116 ms contro 100, deroga accettata; costo principale il ricostruire tutto il tavolo a ogni tocco. Da allora, in C3 si è aggiunta tutta la sequenza. `client-web` **non ha** lo strumento di cattura (`physical-probe.js` è in `client-c0/revision/tools`) e `npm run measure` punta a un `tools/measure.mjs` che non esiste. Le misure in Edge girano a 120 Hz senza vincoli reali (confermato da C4-1b: cadenza 120 Hz). **Base su desktop di C4-1b, con la sequenza intera:** p95 8,5–13,2 ms in duello e FFA, picchi isolati fino a 105 ms in FFA a 1366×768, input massimo 28,8 ms; sequenze al massimo 19,7 s. | Lo stato su iPhone è **ignoto** e, secondo D6, non si misura in C4: lo strumento di C0 resta dov'è, disponibile per l'app futura. Su iPhone vale la prova facoltativa del proprietario. |
| Debito di C3 | Dopo i ritocchi di C3-7 **non sono state rieseguite** `Verify`, `VerifyModes`, `VerifyLifecycle`, `VerifyFfa`, `VerifyPublic`, `VerifyProfile`, `VerifyResolution` completa e `VerifyAim` (che già non aveva `touch`, `reduced`, `pending`). Il [rapporto](reports/client-c3-report.md#verifiche-sulla-build-finale-2) diceva di ripeterle a un commit di chiusura; la chiusura ha cambiato solo documenti. **Saldato il 3 novembre 2026 da C4-1b:** tutte verdi (23 su 23, 98 min 05 s), `VerifyAim` con `touch`, `reduced` e `pending`. | Il giro di C4-1b è la base di confronto. |
| Evidenze | `docs/reports/client-c3` traccia **1880 file per 223 MB**, di cui 48 MB la sola C3-7. C4-1b: 12 MB (97 catture su 338). | Da non ripetere (D13). |
| Licenze, consultate oggi | [Game-icons](https://game-icons.net/about.html): CC BY 3.0, autore da citare. [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds): CC0, 100 file, versione 1.0 del 2020, formato non indicato. [Play](https://raw.githubusercontent.com/google/fonts/main/ofl/play/OFL.txt): OFL 1.1, © 2011 Jonas Hecksher, Playtypes, e-types AS, **nomi riservati Play, Playtype, Playtype Sans**. Kenney UI Pack e Lucide non ricontrollati: non sono previsti. | Un sottoinsieme o una conversione di Play può contare come versione modificata e chiedere un altro nome: da chiarire con le FAQ della OFL prima di includerlo. Ogni pagina si ricontrolla all'inclusione. |

## Regole di non regressione

**Ereditate:** le [regole 1–9 del piano C3](client-c3-plan.md#regole-di-non-regressione) restano valide e controllate da
`VerifyResolution`: una risoluzione si anima al massimo una volta; lo stato finale è la vista del server; nessuna risoluzione
inventata; le animazioni non bloccano invio né clock; movimento ridotto e salto conservano le informazioni; la pending dello
stesso turno non tocca la sequenza; la sequenza non si ferma alla prima eliminazione; privacy; tetto di 20 s per round.

**Nuove di C4:**

| # | Regola | Come si controlla |
|---|---|---|
| 10 | **Nessun asset senza provenienza e licenza.** Ogni file distribuito ha nell'inventario file, autore, URL, versione o data, licenza, modifiche e SHA-256. | Test che percorre `public/` e i font e fallisce per un file assente dall'inventario o con impronta diversa. |
| 11 | **Nessuna informazione affidata solo al colore.** Tipologia, ruolo, risorsa, danno, pagabilità, bersaglio ammesso hanno anche forma o testo. | Dati del disegno nelle verifiche (`FaceInfo`) e cattura in scala di grigi giudicata dal proprietario. |
| 12 | **Nessuna azione essenziale solo con drag o hover.** Tocco e click completano ogni azione; la tastiera anche. | Percorsi con tocco emulato e una partita da sola tastiera (C4-8a). |
| 13 | **Il gioco non dipende dall'audio.** | `Verify` con audio bloccato e file mancanti: stesso esito, nessun errore. Tutta l'informazione ha un segno visivo. |
| 14 | **Nessun asset dai quattro giochi di riferimento né da Internet con diritti incerti.** | Fonte ammessa nell'inventario (generato ex novo con registro, oppure licenza esplicita sulla pagina del file); controllo umano a ogni inclusione. |
| 15 | **Nessuna dipendenza remota in partita:** niente CDN, font remoti o tracciamenti. | Durante le verifiche, nessuna richiesta verso un'origine diversa dalla pagina. |
| 16 | **Nessuna funzione tolta per fare spazio o per la grafica:** righe P01–P44 invariate; nessuna soglia rilassata e nessun atteso cambiato per accettare una regressione (AGENTS). Un atteso cambia solo per una decisione registrata del proprietario. | Diff degli attesi citato nel rapporto; giro completo in C4-9. |
| 17 | **Le misure già valide non peggiorano:** a 1366×768 e 844×390 i fattori e le dimensioni di C3-L restano o crescono, salvo decisione. | Test sui fattori ottenuti; `VerifyLayout`. |
| 18 | **750×292 non peggiora:** ciò che a quella misura funziona alla base di C4-1b continua a funzionare, e il codice compatto non si toglie. | Test che fissa il numero di `layoutProblems` della base, che può solo scendere; a C4-2 e C4-9, `Verify`, `VerifyFfa`, `VerifyAim` e `VerifyLayout` a 750×292: passa ciò che passava alla base. Non è un obiettivo di adattamento e non chiede prove su iPhone. |

## Blocchi

Numeri della bozza del proprietario, con le tre correzioni di D14 sotto. Opzionali segnati con *.

| Blocco | Contenuto | Dipende da | Modello, sforzo | Perché |
|---|---|---|---|---|
| C4-1 | Strumenti di verifica (O23) | — | Sonnet, alto | Ben delimitato, ma un controllo indebolito senza accorgersene sarebbe costoso |
| C4-1b | Misura di partenza: giro completo e base a 750×292 | C4-1 | Sonnet, medio | Misura; il giudizio è sui numeri |
| C4-3 | Simboli, font, inventario e crediti | C4-1b, D3, D4 | Sonnet, alto | Licenze da leggere bene |
| C4-2 | Finitura delle dimensioni e tutela di 750×292 | C4-3, D6, D8 | Opus, medio | Geometria delicata, ma senza una nuova disposizione: la FFA a 844×390 entra con 1 px di margine |
| C4-4 | Cornici per tipologia e segno del ruolo | C4-3, C4-2 | Opus, medio | Giudizio visivo su due disegni, codice non difficile |
| C4-5a | Sfondo e identità del bar (O2) | D11 | Sonnet, medio | Processo di asset e poca geometria |
| C4-5b | Coerenza di hub, form, editor, catalogo | C4-3, C4-4 | Sonnet, medio | CSS esteso e ripetitivo, con verifiche già esistenti |
| C4-6* | Illustrazioni delle carte | C4-4, D1, D11 | Sonnet, medio | Lista corta e processo noto |
| C4-7* | Suoni | D2 | Sonnet, medio | Piccolo; l'attenzione va alla regola 13 |
| C4-8a | Accessibilità e residui O21 | tutti i blocchi visivi | Sonnet, alto | Molti percorsi, controlli nuovi |
| C4-8b | Prestazioni e budget | tutti i blocchi visivi | Opus, alto | Ridisegno incrementale in `scene.ts`: rischio più alto di regressioni |
| C4-9 | Consolidamento e giudizio del proprietario | tutti | Opus, medio | Serve soprattutto dichiarare con esattezza cosa è provato |

**Correzioni alla bozza** (confermate dal proprietario, [D14](#decisioni-del-proprietario)):

1. **C4-3 prima di C4-2.** Il font cambia le larghezze su cui si basano `stripPlan`, riga breve e volti: fare la geometria minima
   prima vorrebbe dire rifarla e riverificarla. I numeri restano quelli della bozza; cambia l'ordine. Con D4 (a) Impact resta e su Windows
   le larghezze del font non cambiano: l'ordine regge perché i simboli al posto delle lettere cambiano le stesse misure.
2. **Nuovo C4-1b.** C4-1 è strumento; serve una misura di partenza prima di aggiungere peso e grafica.
   È anche il punto in cui si salda il debito di C3 e si fissa la base di 750×292 per la regola 18.
3. **C4-5 e C4-8 divisi in due.** Sfondo e shell hanno rischi e verifiche diversi. Accessibilità e prestazioni pure: il ridisegno
   incrementale non deve finire nello stesso commit di una decina di correzioni di accessibilità.

**Una correzione anche a C4-1:** «avvia il server una volta» vale per `Verify` e `VerifyModes`, che oggi non lo avviano. Non può
valere per `VerifyLifecycle` (riavvio), `VerifyPublic` (lo ferma per l'ultimo scenario) e `VerifyProfile` (due avvii con
configurazioni diverse). Il criterio giusto è **un solo punto che avvia i server, e al più uno per volta**.

### Ordine e parallelo

**Ordine (D14):** C4-1 → C4-1b → C4-3 → C4-2 → C4-4 → C4-5a → C4-5b → C4-6* → C4-7* → C4-8a → C4-8b → C4-9. C4-8b viene dopo
tutti gli asset, perché il peso e la cadenza vanno misurati su quelli veri.

| Blocco | `scene.ts` | `readability.ts` | `style.css` | Shell (`ui`, `table`, `collection`, `hub`, `public`, `profile`) | Strumenti | Asset e inventario |
|---|---|---|---|---|---|---|
| C4-1 | | | | | ● | |
| C4-1b | | | | | ● | |
| C4-3 | ● | ● | ● | ● | ● | ● |
| C4-2 | ● | ● | ● | ● | ● | |
| C4-4 | ● | ● | ● | ● | ● | |
| C4-5a | ● (stiramento) | | | | | ● |
| C4-5b | | | ● | ● | ● | |
| C4-6* | | | | | | ● |
| C4-7* | ● (agganci) | | | ● (menu) | ● | ● |
| C4-8a | ● | ● | ● | ● | ● | |
| C4-8b | ● | ● | | | ● | |

**Non possono andare in parallelo:** C4-3, C4-2, C4-4, C4-8a, C4-8b fra loro; C4-5b con C4-3, C4-2, C4-4 e C4-8a (`style.css` e
shell); C4-9 con qualunque altro. **Possono andare in parallelo solo le parti senza codice:** selezione di simboli e font e bozza
dell'inventario (C4-3), generazione della texture (C4-5a), generazione delle illustrazioni (C4-6), scelta dei suoni (C4-7), mentre
un altro blocco lavora sul client. Quelle parti producono file e registro; l'integrazione rientra in fila.

**Tre limiti pratici.** (1) Le verifiche non vanno in parallelo su una stessa macchina: usano porte e account comuni, e le misure di
frame si disturbano. (2) `run.ps1` cerca Node in `.tools/` della radice, ignorato da git, e così `node_modules`: un worktree non è
pronto senza preparazione. (3) C4-1 è committato (`a6f6b1a`): nessuna sessione lavora più su `client-web/` fuori dal blocco in corso.

### C4-1 — Strumenti di verifica (O23)

**Perimetro.** Solo strumenti, nessun effetto sul gioco. Un lancio unico che:

- serializza le verifiche e impedisce due giri insieme;
- ha un solo punto che avvia i server, al più uno per volta: uno condiviso per `Verify` e `VerifyModes`, propri per chi li ferma o
  riavvia di proposito;
- sceglie la build e la dichiara: ricostruisce il jar dal sorgente, riuso solo esplicito; registra HEAD, modifiche non committate,
  hash di jar e `dist`;
- conserva solo le esecuzioni finali: evidenze in una cartella temporanea, copiate nel repository solo dopo un giro completo e verde;
- `Size` scrive dove indicato, non in `docs/reports/client-c2/size.json`;
- offre `BM_SCENARIOS` ridotti per i controlli rapidi, dichiarati **non equivalenti** al consolidamento e non pubblicabili;
- non tocca soglie né attesi;
- ferma solo i processi che ha avviato e rifiuta porte occupate da altri.

Rimuove o corregge lo script `measure` che punta a un file inesistente.

**Dipendenze.** Nessuna. D13, confermata, stabilisce cosa si pubblica: JSON finali sempre; catture solo finali e compresse, circa 10 MB per blocco; il resto in cartella temporanea. Copiare l'intera cartella delle evidenze non basta.

**File toccati.** `client-web/tools/` (nuovo lancio; `size.mjs`), `run.ps1`, `package.json`, `README.md`, documenti comuni.

**Rischi.** Un controllo che passa a vuoto: un giro può risultare verde senza aver visto il caso, come è già capitato col jar vecchio
in C3. Una rifattorizzazione degli script dei server che cambia ciò che provano. Windows: albero di processi, stderr con PowerShell
5.1, anteprima sulla 4320 non propria.

**Completamento verificabile.**

- Un giro completo a 1366×768 e 844×390 dà gli stessi esiti delle singole verifiche, con i contatori di casi visti confrontabili con
  le evidenze di C3-7.
- Diff di soglie e attesi vuoto, dichiarato.
- Prove negative: jar vecchio, porta occupata, secondo lancio, verifica che fallisce: ognuna produce il segnale previsto e nessuna
  evidenza pubblicata.
- Un contatore di casi a zero è segnalato.
- La durata del giro rapido è misurata e riportata, non stimata.

**Verifiche.** Tutte, attraverso il lancio unico; test e `check-rules.py`.

### C4-1b — Misura di partenza

**Perimetro.**

1. **Giro completo** sul client di `a807aa0` (il codice del client non cambia con C4-1), `VerifyAim` compresi `touch`, `reduced` e
   `pending`: salda il debito di C3 e fissa la base. Un rosso qui è un difetto da trattare, non una nuova base.
2. **Base a 750×292 per la regola 18:** `Verify`, `VerifyFfa`, `VerifyAim` e `VerifyLayout` a quella misura, in Edge con tocco emulato, e catture di duello e
   FFA in partita reale. Si registra cosa passa e cosa no, e il numero di `layoutProblems`, senza correggere nulla. Il confronto col giudizio del proprietario su iPhone,
   che non ha segnalato blocchi, dice quanto quei problemi pesano davvero.

**Dipendenze.** C4-1.

**File toccati.** Documenti comuni, evidenze; `client-web/tools/` solo se la misura 750×292 richiede un parametro.

**Rischi.** Il giro completo dura circa due ore e mezza. Un rosso a 750×292 non è un difetto da correggere qui: è la base dichiarata. Un rosso alle misure ufficiali sì.

**Completamento verificabile.** Base documentata nel rapporto: esiti, peso, durate e frame su desktop in duello e FFA con sequenza; esiti e catture a 750×292.
La tabella «Cosa c'è oggi» è corretta dove la misura la smentisce, e D8 e D9 ricevono i numeri veri.

**Verifiche.** Tutte alle misure ufficiali; le quattro della base a 750×292.

**Esito (3 novembre 2026, `a6f6b1a`).** Giro ufficiale 23 su 23 verde in 98 min 05 s, nessun avviso, `VerifyAim` con `touch`, `reduced` e `pending`; base a 750×292: `Verify` verde, `VerifyFfa`, `VerifyAim` e `VerifyLayout` rossi (6 `layoutProblems` in duello, 11 in FFA). Dettagli nel [rapporto](reports/client-c4-report.md#c4-1b--misura-di-partenza).

### C4-3 — Famiglia di simboli, font e inventario degli asset

**Perimetro.** Secondo D3 (confermata: i simboli del progetto, Game-icons solo per lacune reali) e D4 (confermata: font di sistema, Impact e Arial).

- Sostituisce le lettere rimaste (monete del costo, guadagni, immunità) con simboli, sempre col numero. Le lettere restano dove
  servono al testo consultabile.
- Un solo sistema di simboli per Pixi e HTML, com'è già `DAMAGE_SHAPES`.
- Riduce le famiglie di font a Impact e Arial, togliendo Georgia dalla «i», senza cambiare il font del tavolo; nessun font distribuito e nessuna richiesta remota.
- **Inventario unico** in `docs/design/client-c4/assets/`: file, autore, URL, versione o data, licenza, modifiche, destinazione,
  SHA-256; comprende anche `table.webp` e `atlas.webp`, che rimandano alle provenienze esistenti.
- Se entra un asset di terzi: **pagina «Crediti e licenze»** raggiungibile dalla home, testi di licenza distribuiti e frase sui diritti
  corretta: i materiali di terzi restano sotto la loro licenza. I documenti dei diritti si allineano nello stesso commit.
- Test della regola 10 ed estensione di `size.mjs` ai formati usati.

**Dipendenze.** C4-1b; D3, D4, D11 per il registro. Il campione dei font su volti veri è stato guardato su Edge il 3 novembre 2026.

**File toccati.** `scene.ts`, `readability.ts`, `ui.tsx`, `collection.tsx`, `public.tsx`, `style.css`, `tools/size.mjs`, nuovi test,
`docs/design/client-c4/assets/`.

**Rischi.**

- Il font dipende dal dispositivo: Impact potrebbe mancare su iOS (non verificato). Secondo D4 e D6 è un limite accettato, da dichiarare.
- Glifi usati oggi (`→`, `✓`, `×`, `−`, `▲`, `✕`) possono uscire da un font di ripiego diverso per dispositivo.
- Le icone esterne dettagliate a 14–18 px diventano macchie e stonano accanto ai simboli approvati.
- Misurare testo su Safari è già costato in C0: niente misure in più nel ridisegno.
- Il volto approvato è esplicitamente da non snaturare (O14).

**Completamento verificabile.** Nessuna lettera di risorsa sul volto, nelle plance e nei gettoni, sempre col numero; stesso simbolo
in Pixi e HTML; test della regola 10 verde e provato con un file non registrato; nessuna richiesta esterna; crediti raggiungibili e
coerenti con l'inventario, se servono; `Size` verde; giudizio del proprietario sul campione.

**Verifiche.** `Verify`, `VerifyDecks`, `VerifyPublic`, `VerifyLayout`, `VerifyResolution` (`quick`, `ffa`), a due misure.

**Esito (3 novembre 2026, build `1ab2185` più le modifiche del blocco).** Fatto, **in attesa del giudizio del proprietario** sul [campione](reports/client-c4/c4-3/campione/README.md). Nessun asset di terzi, quindi nessuna pagina crediti. Test del client 205 su 205; `Size` verde contro limiti rigidi e tetti di D9 (JS 83,0% del tetto); `Verify`, `VerifyDecks`, `VerifyPublic`, `VerifyLayout` e `VerifyResolution` (`quick`, `ffa`) verdi a 1366×768 e 844×390; regola 18: `layoutProblems` 6 in duello e 11 in FFA come alla base, `Verify` a 750×292 verde in un giro su tre (come la base: tre su sei, causa nel gettone di stato sotto la mano). Non verificato: iPhone, Impact su iOS, scala di grigi. Dettagli nel [rapporto](reports/client-c4-report.md#c4-3--simboli-font-e-inventario-degli-asset).

### C4-2 — Finitura delle dimensioni e tutela di 750×292

**Stato: fatto il 4 novembre 2026, in attesa del giudizio del proprietario** ([rapporto](reports/client-c4-report.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292)). In corso d'opera il proprietario ha deciso che ✓ e × stanno sulla carta scelta, divisa a metà, e che la carta aspetta il più vicino possibile a dove è stata rilasciata.

**Perimetro.** Secondo D6 e D8.

- **Tutela di 750×292:** il test e le verifiche della regola 18. Miglioramenti solo se economici: nessuna nuova classe di disposizione, nessuna cessione da decidere,
  misure ufficiali invariate (regola 17). Quello che non rientra va nell'elenco per l'app futura.
- O12: finitura delle dimensioni su desktop e touch; carte piccole del round.
- Bersagli da 44 px sul tavolo e nei controlli della partita.
- `viewport-fit=cover` solo se costa poco e non cambia le misure ufficiali, con le aree sicure.
- Cambio di orientamento e resize provati su partita reale (limite dichiarato della regola 1 in C3-7).
- Il test «750×292 non entra» resta com'è: registra un limite noto.

**Dipendenze.** C4-3; D6, D8; i numeri di C4-1b. Prima del codice: schemi sullo sfondo vero, come in C3-L.

**File toccati.** `readability.ts`, `scene.ts`, `table.tsx`, `style.css`, `index.html`, `tests/readability.test.ts`, `tools/verify-layout.mjs`,
`verify-ffa.mjs`, `verify-aim.mjs`, documenti comuni.

**Rischi.** Allargare 750×292 fino a farne di nuovo l'obiettivo del blocco: si ferma al primo miglioramento che non è economico. La FFA a 844×390 entra con 1 px di margine:
i bersagli più grandi non devono farla uscire. Testo sul volto sotto la soglia di leggibilità. `fitScale` costa fino a 150 ms a
ogni misura nuova: non deve scattare a ogni barra di Safari che appare.

**Completamento verificabile.**

- Regola 18: `layoutProblems` a 750×292 non aumenta rispetto alla base; passa ciò che passava alla base di C4-1b.
- Fattori e dimensioni di C3-L invariati a 1366×768 e 844×390.
- Elenco DOM dei controlli sotto 44 px vuoto, salvo eccezioni di D8.
- Giudizio del proprietario su desktop; prova su iPhone facoltativa.

**Verifiche.** `Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout`, `VerifyResolution` (`quick`, `ffa`), alle due misure; regola 18 a 750×292;
`VerifyLifecycle` a una misura per il pannello d'esito.

### C4-4 — Cornici per tipologia e segno del ruolo (O8 con O14)

**Stato: fatto e approvato dal proprietario il 4 novembre 2026** ([rapporto](reports/client-c4-report.md#c4-4--cornici-per-tipologia-e-segno-del-ruolo-o8-con-o14)). Il proprietario ha scelto la V1, filetto, nello spessore medio.

**Perimetro.** Cornice o fregio diverso per personaggio, azione regolare, base, legata, ultima risorsa, oggetto e token, **mantenendo la
scritta**. Segno del ruolo definitivo integrato nella stessa grafica, con il simbolo di C4-3. Stesse cornici in mano, nei primi piani, nel
catalogo e nell'editor. Ripiego neutro per una carta senza ruolo o con tipologia ignota, come chiede il Set Base. Dorso e carte piccole
del round compresi.

**Dipendenze.** C4-3, C4-2 per le dimensioni più piccole. Nessuna D propria, ma è un blocco a proposta: 2–3 varianti su carte vere, poi scelta.

**File toccati.** `scene.ts` (`frame`, `face`, `card`), `readability.ts` (tipologia come funzione pura), `ui.tsx`, `collection.tsx`,
`style.css`, test, `verify-layout.mjs`, documenti comuni.

**Rischi.** Il volto attuale **piace** (O14): rischio di snaturarlo. Colore da solo non basta (regola 11). Le cornici tolgono area al testo
sulle carte piccole. Il costo del ridisegno aumenta. Token riconosciuto da `bindingName`: è un dato wire stabile ma non un campo dedicato;
dichiararlo.

**Completamento verificabile.** Controllo in unità su tutto il catalogo: ogni classe ha la cornice della sua tipologia, uguale all'allegato del
regolamento; il token ha la sua. In partita reale la mano e gli oggetti mostrano la cornice attesa. Volti dentro i riquadri: costo, danno e testo
come in C3-5. Cattura in scala di grigi: le tipologie restano distinguibili. Giudizio del proprietario.

**Verifiche.** `Verify`, `VerifyDecks`, `VerifyLayout`, `VerifyResolution` (`quick`, `ffa`), alle misure ufficiali.

### C4-5a — Sfondo e identità del bar (O2)

**Perimetro.** Nuova texture con sedute consumate e spaiate, stessa palette, con il processo e il registro di D11. **Toglie lo stiramento**:
ritaglio con una zona sicura centrale e dettagli periferici sacrificabili, così a 750×292 e a 1366×768 la scena non si deforma. Stessa
identità nella scritta decorativa del tavolo, senza coprire i posti.

**Dipendenze.** D11 (confermata: genera il proprietario, l'agente scrive prompt e registro). La generazione può andare in parallelo; l'integrazione è in fila. Non dipende dalle cornici, ma si giudica meglio dopo.

**File toccati.** `public/art/table.webp`, `scene.ts` (solo `resize`), `style.css` (`.brand`), inventario, `docs/design/client-c4/`, documenti comuni.

**Rischi.** Il prompt va salvato e committato **prima** di generare: i prompt letterali di C0-R2 sono andati persi. Lo strumento del proprietario può non
essere quello di R1: stile da giudicare accanto a carte e plance. La direzione R1 è approvata e non va
rifatta: si correggono le sedie, non il bar. Leggibilità di carte e plance sopra un fondo più ricco. Peso entro D9.

**Completamento verificabile.** Registro completo e test della regola 10 verde; nessuna deformazione alle tre misure (proporzioni calcolate nel
test); posti e testi leggibili sopra il nuovo fondo (contrasto misurato in C4-8a); `Size` verde; giudizio del proprietario su desktop, iPhone facoltativo.

**Verifiche.** `Verify`, `VerifyLayout`, alle misure ufficiali.

### C4-5b — Coerenza di tutte le schermate

**Perimetro.** Un inventario e una finitura delle schermate:

- home, regole, accesso, registrazione, richiesta di rotazione;
- hub, code, lista FFA, «Al bar»;
- catalogo, elenco mazzi, editor;
- profilo, amministrazione;
- dialoghi, menu •••, strumenti, «Ultimo turno», pannello d'esito.

Stessi colori, caratteri, pulsanti e stati (attivo, disabilitato, errore), con token CSS invece di tinte ripetute; controlli da 44 px; aspetto di
✓, × e scarto delle bound (riserve C0 B3 e B6). Catalogo, editor e admin possono restare sobri, ma completi e leggibili. L'editor non cambia struttura:
O15 e O16 restano fuori.

**Dipendenze.** C4-3, C4-4.

**File toccati.** `style.css`, `hub.tsx`, `collection.tsx`, `public.tsx`, `profile.tsx`, `table.tsx`, `ui.tsx`, verifiche delle stesse schermate,
documenti comuni, righe P toccate.

**Rischi.** `style.css` compresso su poche righe rende i diff difficili da rileggere: riformattarlo prima, in un passo separato e senza cambi di
regole. Le verifiche leggono testi e selettori: non devono perdere presa. Tentazione di riprogettare: fuori perimetro.

**Completamento verificabile.** Cattura di ogni schermata dell'inventario a 1366×768 e 844×390, e in portrait per quelle che lo ammettono;
nessuna tinta fuori dai token (controllo sul sorgente); nessun controllo sotto 44 px sulle schermate touch, salvo D8; nessuna funzione persa
(regola 16); giudizio del proprietario.

**Verifiche.** `VerifyPublic`, `VerifyModes`, `VerifyDecks`, `VerifyProfile`, `VerifyLifecycle`, `VerifyFfa`, alle misure ufficiali.

### C4-6* — Illustrazioni delle carte (opzionale)

**Perimetro.** Secondo D1. Con la raccomandazione: sostituire **solo** le illustrazioni che non reggono accanto alle cornici nuove, da una lista
approvata, con il processo di D11. Nessuna guida di stile né lotti: sono di [SB-32](set-base-plan.md#sb-32--illustrazioni-del-set).

**Dipendenze.** C4-4, D1, D11. Da saltare se D1 dice no.

**File toccati.** `public/art/atlas.webp`, `manifest.json`, `tools/atlas.mjs` se serve, `tests/art.test.ts`, `docs/design/client-c2/o9-art/`,
inventario, documenti comuni.

**Rischi.** D24 del Set Base dice di non generare ciò che può sparire. I PNG sorgente O9 sono solo su questo PC e `Atlas` non si riesegue da un clone
pulito: una loro perdita bloccherebbe il blocco. Stile diverso fra lotti, e rispetto alle illustrazioni O9 se lo strumento del proprietario non è lo stesso.

**Completamento verificabile.** Ogni riquadro sostituito ha registro e impronta; nessun duplicato, atlante ≤ 2048 px; `Size` verde; leggibili sul
volto, nell'ispezione e nei primi piani; giudizio del proprietario.

**Verifiche.** `VerifyLayout`, `VerifyDecks`; test `art`.

### C4-7* — Suoni (opzionale)

**Perimetro.** Secondo D2: pochi suoni per selezione, invio, rifiuto, impatto ed esito, da fonte registrata. Volume e muto nel menu, ricordati nel
browser; un suono non porta mai un'informazione che manca a schermo; rispetta salto, interruzione e fine sequenza. Nessuna musica.

**Dipendenze.** D2; dopo C4-5b per il menu. Scelta dei suoni in parallelo.

**File toccati.** nuovo `src/sound.ts`, `public/audio/`, agganci in `scene.ts` e `table.tsx`, `tools/size.mjs` se serve, verifica, inventario, documenti comuni.

**Rischi.** Su iOS l'audio parte solo dopo un gesto e l'interruttore silenzioso prevale. Latenza che degrada l'input. Suono su eventi
interrotti, o doppio su una vista ripetuta (regola 1). Fastidio in sequenze da 20 s con cinque carte.

**Completamento verificabile.** Partita completa con audio assente, bloccato e file mancanti: stesso esito, nessun errore (regola 13). Un suono per evento, mai
due per la stessa risoluzione. Muto ricordato. Input non peggiorato alle misure ufficiali. `Size` verde. Giudizio del proprietario.

**Verifiche.** `Verify` (con audio bloccato), `VerifyResolution` (`quick`, `interrupt`).

### C4-8a — Accessibilità e residui O21

**Perimetro.**

- Focus visibile e ordine prevedibile su tavolo e shell, con contorno che si legga anche sopra la carta.
- Contrasto misurato sul disegno reale secondo D12.
- Partita da sola tastiera (scelta, bersaglio, scarto, conferma, annullamento).
- Zoom e testo ampliato nelle schermate HTML.
- Movimento ridotto riprovato su tutte le animazioni nuove.
- Simboli oltre al colore (regola 11).
- O21: `ExtremelyViolentBlow` con V reale; D5.
- Le etichette accessibili seguono volti e cornici nuove.

**Dipendenze.** Tutti i blocchi visivi; D5, D12.

**File toccati.** `style.css`, `scene.ts`, `table.tsx`, `readability.ts`, test, una verifica nuova o scenari aggiunti, documenti comuni, righe P toccate.

**Rischi.** Pixi non ha testo reale: i controlli passano dallo strato semantico. Colori delle risorse approvati che non passano la soglia: si
aggiunge forma o bordo prima di cambiarli. Una verifica automatica del contrasto non vede le texture. Il lettore di schermo non è verificabile dagli
strumenti automatici.

**Completamento verificabile.** Partita reale completa da sola tastiera; controllo del contrasto sugli accoppiamenti del disegno, con ogni eccezione
elencata; ogni controllo interattivo ha un focus visibile (cattura); movimento ridotto senza scosse né voli, stessa informazione (regola 5);
`ExtremelyViolentBlow` osservata sul volto in partita; lettore di schermo provato o dichiarato non provato (D12).

**Verifiche.** `VerifyAim` (`reduced`, `touch`), `VerifyResolution` (`reduced`, `interrupt`, `report`), `VerifyPublic`, `VerifyDecks`, `Verify`.

### C4-8b — Prestazioni e budget

**Perimetro.** Secondo D9, sugli asset finali.

- Nuova misura su desktop sul client completo, duello e FFA con sequenza, con lo stesso criterio di C3-L e la base di C4-1b.
- Se quel criterio non regge, l'input è peggiorato o il proprietario segnala un disagio grave provando su iPhone: ridisegno incrementale (riserva di C0: ogni tocco che cambia la scelta ricostruisce il tavolo) e
  riduzione delle decorazioni **prima** di rivalutare il renderer, come da roadmap. Distinguere il ritardo di rete.
- Caricamento mirato e, dove rende, compressione degli asset.
- Picchi isolati fino a 115 ms in FFA misurati in C3-L.

**Dipendenze.** Tutti i blocchi visivi; D9.

**File toccati.** `scene.ts`, `readability.ts`, eventualmente `art.ts`, documenti comuni.

**Rischi.** Il ridisegno incrementale è la modifica più pericolosa di C4: disegno e sequenza sono intrecciati (`staged`, `overInfo`, stati intermedi) e un
elemento non ridisegnato smentirebbe la regola 2. Se la misura di partenza e quella finale sono già entro soglia, **non si fa**. Le misure in Edge girano senza i vincoli di un telefono: non dicono nulla sull'iPhone, e va dichiarato. Un solo tentativo
mirato per passo, come in C0; le soglie non cambiano per farle passare.

**Completamento verificabile.** Desktop con lo stesso criterio di C3-L, confrontato con la base di C4-1b; `Size` entro i limiti rigidi e il tetto delle texture (D9 rivista).
Regole 1–9 verdi; a sequenza finita ogni plancia e ogni oggetto coincidono con la vista.

**Verifiche.** `Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout`, `VerifyResolution` completa.

### C4-9 — Consolidamento e giudizio del proprietario

**Perimetro.** Nessuna funzione nuova salvo correzioni di blocchi emersi. Giro completo sulla stessa build; regole 1–18 dichiarate una per una; righe P
aggiornate; inventario riconciliato coi file distribuiti; budget e soglie riassunti; scheda di prova per il proprietario su desktop, con una parte facoltativa su iPhone, sul modello
della [scheda di C3-7](reports/client-c3/c3-7/prova-scheda.md). Roadmap con «C4 chiusa» solo dopo il suo giudizio. La prova umana C e O19 restano a C5.

**Dipendenze.** Tutti.

**File toccati.** Documenti, evidenze, correzioni puntuali.

**Rischi.** Modifiche dopo il consolidamento, come i ritocchi di C3-7: ogni commit successivo deve dichiarare cosa si riesegue, e la chiusura non deve
lasciare debiti. Osservazioni di ritmo: vanno a C5.

**Completamento verificabile.** Tutte le verifiche verdi sulla **stessa** build dell'ultimo commit di codice; test del client e del repository, `check-rules.py`,
`verify-match-manifests.py` e contesto Spring come esiti separati; regola 18 a 750×292; nessun asset senza registro; giudizio registrato con ciò che
non è provato.

**Verifiche.** Tutte.

## Verifiche da rieseguire per blocco

● completa alle misure ufficiali · ○ scenari ridotti o una misura, dichiarati · vuoto: non serve, il blocco non tocca quel percorso. `Test`, `Build`, `Size`,
`build.ps1 -Task Test -Offline` e `check-rules.py` valgono **sempre**. «750» indica che si aggiunge il controllo a 750×292 della regola 18. La prova su iPhone è facoltativa e non compare (D6).

| Blocco | Verify | Modes | Lifecycle | Ffa | Decks | Public | Profile | Resolution | Aim | Layout |
|---|---|---|---|---|---|---|---|---|---|---|
| C4-1 | ● | ● | ● | ● | ● | ● | ● | ● | ● | ● |
| C4-1b | ● 750 | ● | ● | ● 750 | ● | ● | ● | ● | ● 750 | ● 750 |
| C4-3 | ● | | | | ● | ● | | ○ | | ● |
| C4-2 | ● 750 | | ○ | ● 750 | | | | ○ | ● 750 | ● 750 |
| C4-4 | ● | | | | ● | | | ○ | | ● |
| C4-5a | ● | | | | | | | | | ● |
| C4-5b | | ● | ● | ● | ● | ● | ● | | | |
| C4-6* | | | | | ● | | | | | ● |
| C4-7* | ● | | | | | | | ○ | | |
| C4-8a | ● | | | | ● | ● | | ○ | ○ | |
| C4-8b | ● | | | ● | | | | ● | ● | ● |
| C4-9 | ● 750 | ● | ● | ● 750 | ● | ● | ● | ● | ● 750 | ● 750 |

## Decisioni del proprietario

**D3, D4, D6, D8, D9, D11, D13 e D14 sono confermate; D7 e D10 non servono più; le altre sono da decidere.** Le raccomandazioni sono proposte motivate. Ordine di urgenza in [fondo](#ordine-di-urgenza).

| ID | Domanda | Opzioni | Raccomandazione e motivo | Cosa blocca | Se si rimanda |
|---|---|---|---|---|---|
| D1 | Illustrazioni individuali in C4 | (a) nessuna; (b) solo quelle che non reggono, da lista approvata; (c) tutte e 40 | **(b).** D24 del Set Base dice di generarle a carte finalizzate: tutte ora rischia lavoro che sparisce. La roadmap chiede di sostituirle «dove serve», e dove serve si vede solo dopo le cornici. | C4-6 | Non blocca altro. Vale (a) e C4-6 si salta; si può aprire fino a C4-8b. |
| D2 | Audio | (a) no; (b) 4–6 suoni con volume basso e muto, nessuna musica; (c) anche ambiente o musica | **(b), per ultimo e primo da tagliare.** Costa poco, la fonte è CC0 e la prova C può giudicarlo; (c) porta peso e fastidio in sequenze da 20 s. Volume iniziale basso, attivo. | C4-7 | Non blocca altro. Se non è deciso prima di C4-9, la prova C si fa senza suoni. |
| D3 | Simboli | (a) Game-icons per tutti (CC BY 3.0); (b) tutti disegnati da noi; (c) i nostri, Game-icons solo per lacune reali | **(c), confermata dal proprietario il 3 novembre 2026, con l'attesa che le lacune siano poche o nessuna.** Esistono già 15 simboli propri, quelli del danno approvati in C3-7, e il residuo di O10 è fatto di soli costi, guadagni e immunità, tutti coperti dai simboli delle risorse. Sostituirli non migliora e aggiunge attribuzioni per ogni icona. Questo si discosta dalla roadmap, che indicava Game-icons come fonte principale. | C4-3 | Blocca C4-3 e a catena C4-2, C4-4, C4-5b. |
| D4 | Font | (a) quelli di sistema, ridotti a due; (b) Play (OFL); (c) altro OFL scelto su campione | **(a), confermata dal proprietario il 3 novembre 2026 dopo il campione: Impact e Arial.** Il volto attuale piace, zero peso e zero licenze. Sul campione (Edge, Windows; 1366×768, 844×390, 750×292) Play Bold rende meglio i numeri, ma ha titoli più larghi del 22% in media, più troncamenti e diverse etichette tagliate; non ha `→`, `✓`, `▲`, `✕`. Play Regular è troppo sottile sulle carte. Impact non è distribuito e potrebbe mancare su iOS (non verificato): secondo D6 il controllo non blocca, e se manca si accetta il ripiego. | C4-3 (solo font), a catena C4-2 | Decisa. |
| D5 | Segno statico sul bersaglio con movimento ridotto (O21) | (a) sì, sul bersaglio; (b) no, ma tipo di danno in «Ultimo turno»; (c) no, nulla di nuovo | **(b).** Con movimento ridotto il tipo si legge già sul volto e sulla carta piccola al centro. Un segno fisso sul bersaglio toglie spazio dove la striscia già manca in FFA compatta, e con più mosse suggerirebbe un'attribuzione che il server non dà (D1 di C3). `roundReport` oggi non riporta il tipo: basta una riga. | Una parte di C4-8a | Non blocca. Vale (c): resta un limite dichiarato. |
| D6 | 750×292 resta il minimo supportato | (a) sì, duello e FFA; (b) sì per il duello, FFA da 844×390; (c) no, minimo 844×390; (d) minimo garantito 844×390, con 750×292 protetta dalla regola 18 | **(d), scelta dal proprietario il 3 novembre 2026; sostituisce (a), confermata poco prima lo stesso giorno.** Il proprietario: il web è un client, il supporto vero al telefono arriverà con l'app; non si spreca tanto lavoro, ma non si perde quello fatto e non si ignora quella misura. Oggi a larghezza 750 servirebbero 384 px di altezza in duello e 417 in FFA, misurati con le funzioni del client; un futuro contenitore a schermo intero recupererà lo spazio della barra del browser. **Limite dichiarato:** la FFA su iPhone in Safari resta con i problemi noti, compreso un posto fuori schermo. | C4-2, regola 18 | Decisa. |
| D7 | Cosa cede sotto i 384 px, in ordine. **Non serve più in C4 (D6, 3 novembre 2026);** proposta conservata per l'app futura | Proposta: 1. primi piani nel proprio posto anziché al centro; 2. carte del round ridotte alla sola ultima, con «Ultimo turno»; 3. mano più piccola e più alzata al tocco; 4. oggetti più sovrapposti; 5. mani coperte più piccole; mai togliere bersagli | **Quest'ordine, da giudicare sulle catture.** Toglie prima ciò che si ritrova altrove (decisioni di presentazione) e tiene le carte come oggetti sul tavolo. Le mani coperte restano tutte e quattro. | Nessun blocco | Non si decide in C4. |
| D8 | Cosa deve avere 44 px | (a) ogni elemento toccabile; (b) tutti i controlli, ma i gettoni di stato possono restare più piccoli se lo stesso contenuto è raggiungibile altrove; (c) solo i controlli principali | **(b), confermata dal proprietario il 3 novembre 2026.** La roadmap chiede 44 px per i target principali; i gettoni 31×18 in una FFA piena non possono crescere senza coprire il personaggio. C4-2 deve provare che il loro contenuto è raggiungibile col tocco su un'area più grande o dall'ispezione. **Numeri di C4-1b (partite reali, desktop e 844×390):** gettoni da 31×18 (FFA e duello a 844×390, e a 750×292) a 61×36 (duello a 1366×768); 41×24 in FFA a 1366×768; nessuna misura è a 44 px. | C4-2, C4-5b | Decisa; prova del contenuto raggiungibile nel [rapporto](reports/client-c4-report.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292). |
| D9 | Budget di download | (a) soli limiti attuali (JS 500 KB, totale 4 MB, atlante 2048 px, texture 64 MB); (b) limiti attuali più tetto di C4: **JS ≤ 400 KB, totale ≤ 2,2 MB, texture ≤ 32 MB** | **(b).** Il Set Base stima 1,7 MB e 38 MB per i suoi atlanti: con (a) C4 potrebbe consumare il margine che gli serve. I tetti lasciano circa 0,7 MB e 6 MB secondo quelle stime, che **non sono misure**. I limiti rigidi non si alzano. **Confermata dal proprietario il 3 novembre 2026 con l'opzione (b): JS ≤ 400 KB, totale ≤ 2,2 MB, texture ≤ 32 MB; limiti rigidi invariati.** **Numeri veri di C4-1b:** JS gzip 330 459 B (82,6% di 400 KB; margine circa 69,5 KB), totale gzip 1 113 651 B (50,6% di 2,2 MB; margine circa 1,09 MB), texture 18 876 320 B (56% di 32 MiB; margine 14,0 MiB). `size.mjs` applica anche i tetti dal C4-3 (controllo distinto dai limiti rigidi). **Rivista dal proprietario il 3 novembre 2026, dopo C4-3: restano solo il limite rigido di C2 (JS 500 KB, totale 4 MB, atlante 2048 px, texture 64 MB) e il tetto di C4 sulle texture decodificate (≤ 32 MiB). I tetti di JS (400 KB) e totale (2,2 MB) sono tolti.** Motivo: il client si serve in locale fino a C5, 2,2 o 4,4 MB gzip non pesano sulle connessioni di oggi e si scaricano una volta (poi cache); i limiti rigidi fermano già un errore accidentale; ciò che costa davvero su un telefono è la memoria delle texture, per cui il tetto resta. Per un client online su rete mobile il peso tornerebbe da valutare. | C4-3 per gli asset, C4-5a, C4-6, C4-7, C4-8b | Decisa, rivista. |
| D10 | Soglie di prestazioni su iPhone. **Non serve più in C4 (D6, 3 novembre 2026);** proposta conservata per l'app futura | Frame: (a) soglia C0 (≥ 95% ≤ 33 ms) come vincolo e 60 fps come obiettivo riportato; (b) 60 fps come vincolo. Input: (c) ≤ 100 ms senza deroga; (d) ≤ 100 ms come obiettivo, vincolo «non peggio dei 116 ms di C0» | **(a) e (d).** La roadmap dice «puntare a 60 fps» e lascia le soglie di C0; un vincolo a 60 fps su iPhone chiederebbe di tagliare molta grafica senza che nessuno abbia segnalato disagio. La deroga di C0 resta motivata, ma non si allarga: se il client supera i 116 ms si interviene. | Nessun blocco | Non si decide in C4. |
| D11 | Generazione degli asset e registro | Generazione: (a) il proprietario genera con il suo strumento, l'agente scrive prompt e registro; (b) una sessione con uno strumento di generazione, come C0 e O9. Registro: (c) come O9, sorgenti e prompt fuori da git; (d) prompt letterale tracciato e salvato prima di generare, sorgente tracciata solo per lo sfondo | **(a) e (d), confermate dal proprietario il 3 novembre 2026.** Il proprietario genera con il suo strumento e consegna i file; l'agente scrive e committa il prompt prima della generazione, poi registra e integra. Il registro serve perché i prompt di C0-R2 sono andati persi e i PNG di O9 sono solo su questo PC. Solo immagini nuove, riferimento ammesso solo a materiali del progetto (R1, `table.png`), mai i quattro giochi né Internet. Il proprietario indica strumento, modello, versione e data; nel registro anche i termini d'uso dello strumento, C2PA se esposto. | C4-5a, C4-6 | Decisa. La chiusura di O2 dipende dall'immagine del proprietario. |
| D12 | Riferimento di accessibilità e lettore di schermo | Contrasto: (a) WCAG 2.2 AA come obiettivo (4,5:1 testo, 3:1 testo grande e simboli), senza dichiarare conformità; (b) nessuna soglia. Lettore: (c) una breve prova del proprietario con VoiceOver; (d) dichiarato non provato | **(a) e (d); (c) se il proprietario ha dieci minuti.** La soglia rende il controllo ripetibile; le eccezioni si elencano. Il lettore non è automatizzabile qui e in C5 non è un criterio: meglio un limite onesto che una promessa. | C4-8a | C4-8a parte con la raccomandazione. |
| D13 | Evidenze nel repository | (a) come C3; (b) JSON finali sempre; catture solo finali, compresse, circa 10 MB per blocco, il resto in cartella temporanea; (c) nessuna cattura | **(b), confermata dal proprietario il 3 novembre 2026.** C3 traccia 223 MB in 1880 file: resta per sempre nella cronologia. Le catture servono al giudizio, non vanno tenute tutte. Il tetto è un'indicazione, non una soglia di verifica. | C4-1 (cosa si pubblica) | Decisa e applicata: C4-1 è committato (`a6f6b1a`) e C4-1b ha pubblicato 12 MB. |
| D14 | Ordine e divisione dei blocchi | (a) la bozza: C4-2 prima di C4-3, nessun C4-1b, C4-5 e C4-8 interi; (b) [correzioni proposte](#blocchi) | **(b), confermata dal proprietario il 3 novembre 2026.** Il font condiziona la geometria; lo stato su iPhone è ignoto; sfondo e shell, accessibilità e prestazioni hanno rischi diversi. Costa due commit in più. | Ordine dopo C4-1 | Non si può partire dopo C4-1 senza. |

### Ordine di urgenza

1. **D13:** confermata il 3 novembre 2026.
2. **D14:** confermata il 3 novembre 2026.
3. **D4 e D3:** confermate il 3 novembre 2026.
4. **D11:** confermata il 3 novembre 2026; la generazione ha tempi propri e può avanzare in parallelo.
5. **D6, D8:** servivano a C4-2; D6 è confermata il 3 novembre 2026 e fa cadere D7 e D10; D8 è confermata il 3 novembre 2026.
6. **D9:** confermata il 3 novembre 2026, opzione (b); rivista lo stesso giorno: tetto solo sulle texture (32 MiB), tetti di JS e totale tolti.
7. **D1, D2:** scelte di perimetro, senza blocchi per gli altri.
8. **D12, D5:** prima di C4-8a.

## Cosa questo piano ha e non ha verificato

**Verificato:** lettura delle fonti indicate; misure della geometria con le funzioni del client (non in partita reale); tinte e accoppiamenti
calcolati dai sorgenti; scansione statica di `style.css`; i pesi dalle evidenze di C3-7; le tre pagine di licenza alla data di questo piano. Dopo la stesura, per D4: campione dei font sulle viste registrate, con il codice reale della scena,
su Edge a tre dimensioni, e copertura dei glifi di Play; Play è stato scaricato solo in una cartella temporanea e non è nel repository.

**Non verificato:** nessuna partita reale, verifica Playwright o build lanciata per questo piano; nulla su iPhone, quindi nemmeno se Impact è presente su iOS; il campione dei font mostra solo il canvas, non la shell HTML; nessuna icona scaricata;
`viewport-fit=cover` è un'ipotesi; i contrasti non sono misurati sul disegno composto;
il tetto delle texture di D9 si regge su stime del piano Set Base. Dopo la stesura, C4-1 è stato committato e C4-1b ha eseguito il giro completo e la base a 750×292 (rapporto).
