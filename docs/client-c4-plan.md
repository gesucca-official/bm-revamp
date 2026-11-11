# Piano C4 — Rifinire grafica e uso su schermi diversi

3 novembre 2026. Regolamento **1.10**, [roadmap del client](client-roadmap.md) versione 38, HEAD di partenza
`a807aa0`. **Solo piano:** nessun codice client, nessuna modifica a regole, server, protocollo, catalogo o
`client-debug`. C0, C1, C2 e C3 sono chiuse. Stato corrente nell'[indice della documentazione](README.md#stato-corrente).

**Tutte le decisioni sono prese: D3, D4, D6, D8, D9, D11, D13 e D14 dal proprietario il 3 novembre 2026; D1, D2, D5 e D12 il 6 novembre 2026; D15 il 7 novembre 2026; D16 il 10 novembre 2026; D7 e D10 non servono più dopo la revisione di D6.** Le decisioni già prese altrove sono citate con la loro fonte e non si riaprono qui.

**Stato all'11 novembre 2026.** Approvati dal proprietario tutti i blocchi fino a C4-10 (C4-6* saltato) e, l'11 novembre 2026, [C4-1c](#c4-1c--verifiche-più-veloci) (verifiche in parallelo: giro completo 25/25 verde in 41:43 con `-Parallel 4`), [C4-11](#c4-11--spazio-e-profondità) (spazio e profondità) e [C4-8a](#c4-8a--accessibilità-e-residui-o21) (accessibilità) e [C4-8b](#c4-8b--prestazioni-e-budget) (prestazioni, ricerca dei primi piani più veloce). **Prossimo: C4-9**, poi la [matrice completa di fine C4](#matrice-completa-di-fine-c4) e C5. Metodo di verifica: [D16](#decisioni-del-proprietario). Lo stato di ogni blocco è nella sua riga della [tabella dei blocchi](#blocchi) e nella sua sezione; i rapporti sono elencati lì. Il regolamento è alla 1.11 o successiva (cinque risorse per posto): le verifiche grafiche fino a C4-5b sono anteriori.

**Stato di C4-1, C4-1b, C4-3, C4-2, C4-4 e C4-5a.** C4-5a è **approvato dal proprietario il 5 novembre 2026; O2 chiusa**. Le osservazioni O26 e O27 della prova sono assegnate a C4-5a-bis ([stato del blocco](reports/client-c4/c4-5a-bis.md#c4-5a-bis): O26 e O27 approvate dal proprietario il 5 novembre 2026 dopo una partita vera; scelta A pieno/0,75/sopra, 236 unità e giri ufficiali verdi sul jar pre-SB-3/SB-4, contesto corrente verde, nuovo giro grafico sul jar corrente non svolto con accettazione esplicita del proprietario) ([rapporto](reports/client-c4/c4-5a.md#c4-5a--integrazione-dello-sfondo-del-tavolo-o2)). C4-4 (cornici per tipologia e segno del ruolo: filetto medio) è fatto e **approvato dal proprietario** il 4 novembre 2026 ([rapporto](reports/client-c4/c4-4.md#c4-4--cornici-per-tipologia-e-segno-del-ruolo-o8-con-o14)). C4-2 (dimensioni, bersagli da 44 px, conferma sulla carta, tutela di 750×292) è fatto e **approvato dal proprietario** il 4 novembre 2026 ([rapporto](reports/client-c4/c4-2.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292)). C4-3 (simboli, font, inventario) è fatto il 3 novembre 2026 e **approvato dal proprietario il 4 novembre 2026** sul campione ([rapporto](reports/client-c4/c4-3.md#c4-3--simboli-font-e-inventario-degli-asset)). C4-1 (strumenti, `VerifyAll`) è committato in `a6f6b1a`. C4-1b (misura di partenza) è eseguita il
3 novembre 2026 sulla stessa build: giro ufficiale 23 su 23 verde, base a 750×292 registrata; numeri nel
[rapporto](reports/client-c4/c4-1b.md#c4-1b--misura-di-partenza). I criteri di [C4-1](#c4-1--strumenti-di-verifica-o23) restano quelli con cui
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
  844×390**; per `Verify` e `VerifyLayout` anche **1920×1080** dal 10 novembre 2026 (scelta del proprietario in C4-11,
  [domanda 7](design/client-c4/spazio/proposta.md#scelta-del-proprietario)). Da C4-1c `VerifyAll` la include automaticamente per quelle due verifiche; `-Measures` resta per i giri dichiarati, non equivalenti al consolidamento. Scene sintetiche e fixture valgono per i test unitari, non come partita reale.
- **iPhone e 750×292: bene se funziona, senza diventare un obiettivo** ([D6](#decisioni-del-proprietario)). Il client web serve soprattutto a provare il gioco;
  il supporto vero al telefono arriverà con l'app ([Q16](open-questions.md)). Il lavoro già fatto non si perde: 750×292 è protetta dalla regola 18 e un
  miglioramento economico si fa, ma nessun blocco si apre o si allunga per quella misura. Edge sul PC non sostituisce l'iPhone: ciò che non è provato si dichiara.
- Verifiche: `./client-web/run.ps1 -Task Test`, `Build`, `Size`, quelle del blocco
  ([matrice](#verifiche-da-rieseguire-per-blocco)) e quelle di AGENTS: `./scripts/build.ps1 -Task Test -Offline` e
  `python scripts/check-rules.py`. Il contesto Spring ha una verifica separata, eseguita in C4-9.
- **Decisione di metodo ([D16](#decisioni-del-proprietario), 10 novembre 2026).** Il proprietario: «mi piace il compromesso».
  A ogni blocco di C4 le verifiche economiche (test, build, size, test del server, `check-rules.py`) più **solo** le verifiche
  Playwright legate a ciò che il blocco tocca; la [matrice completa a fine C4](#matrice-completa-di-fine-c4), prima di C5, con le
  correzioni allora. Le approvazioni dei blocchi restano soggette a quella matrice. In più C4-11 è stato sovrapposto a C4-1c,
  in deroga all'ordine in serie dei blocchi.
- Documenti nello stesso commit: `client-web/README.md`, il rapporto del blocco in `docs/reports/client-c4/c4-n.md` (diviso per
  blocco il 10 novembre 2026; [indice](reports/client-c4-report.md)), la revisione della roadmap, le righe P toccate della [checklist](client-c0-parity.md). Evidenze in
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
| Suoni | **Opzionale**, D2: con volume e muto, mai necessari al gioco | C4-7, C4-7-ter |
| Guida visiva | Far intuire senza testo cosa succede e cosa fare (D15); riepilogo giallo del turno ([O29](client-roadmap.md#osservazioni-registrate-durante-c4)); conferma dello scarto sulla carta (O30) | C4-10 |
| Spazio e profondità | Schermi piccoli affollati, grandi spogli, tavolo senza profondità (D15); spazio tolto da Safari ([O28](client-roadmap.md#osservazioni-registrate-durante-c4)) | C4-11 |
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
- **O20 (FFA a timeout con vincitore computer) chiusa il 10 novembre 2026** fuori da C4: solo il motivo dell'esito, corretto nel server
  ([rapporto](reports/o20-report.md)). Nessun blocco di C4 ne dipende; lo scenario `ffaForfeit` rientra nella matrice di fine C4.
- **A2 (clock più lungo):** nessun segnale dai dati di C3, non proposto.
- **O15, O16 (deckbuilder)** nell'attività successiva dedicata; **O17, O18** dal regolamento. C4-5b rende l'editor coerente, non
  lo riprogetta.
- **Illustrazioni finali del set:** [SB-32](set-base-plan.md#sb-32--illustrazioni-del-set) (decisione D24 del piano Set Base).
- **Adattamento completo a 750×292 (O22) e cattura fisica su iPhone:** all'app futura, secondo D6.
- **Prova umana C, `window.__bm`, guida di avvio:** C5. Nessun deploy, PWA, app nativa, renderer 3D o sfondo video. La profondità visiva
  disegnata (ombre, piani, luce, rilievo) è invece di [C4-11](#c4-11--spazio-e-profondità).
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
| Controlli sotto 44 px | Scansione statica di `style.css`, da confermare sul DOM: `.presence button.link` 32 e 36, `.public button.link` 32, `.server-text summary` 36, `.slot summary` 36 e 40, `button.back` 40. La (i) è 28 px con 10 px di area invisibile per lato: 48 px. Gettoni di stato nel tavolo: 31×18 a 844×390, 41×24 in FFA a 1366×768 ([C3-L](reports/client-c3-report.md#misure-dopo-c3-l-partite-reali)); **confermati da C4-1b**: gettoni 61×36 (duello 1366×768), 41×24 (FFA 1366×768), 46×27 e 37×27 (duello 844×390), 46×27 e 31×18 (FFA 844×390); 31×18 anche a 750×292. Non è un elenco DOM completo dei controlli sotto 44 px. **Dopo C4-2:** al tavolo sotto 44 px restano solo i gettoni di stato (D8); elenco DOM nel [rapporto](reports/client-c4/c4-2.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292). Quelli di hub, pubblico e profilo restano a C4-5b. | Lista di partenza di C4-2 e C4-5b; D8 per i gettoni. |
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
| 17 | **Le misure già valide non peggiorano:** a 1366×768 e 844×390 i fattori e le dimensioni di C3-L restano o crescono, salvo decisione. Dal 10 novembre 2026 anche a 1920×1080, con base i giri `Verify` e `VerifyLayout` della [Fase B di C4-11](reports/client-c4/c4-11.md#c4-11--fase-b). | Test sui fattori ottenuti; `VerifyLayout`. |
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
| C4-7-ter | Suoni dei colpi per tipo di danno, esito col pannello, click della conferma | C4-7-bis | Opus, alto | Tempi della sequenza e audio su iOS, già corretti due volte |
| C4-10 | Guida visiva | C4-7-ter, D15 | Opus, alto | Giudizio visivo e animazioni dentro la sequenza: regole 1–9 a rischio |
| C4-1c | Verifiche più veloci (parallelo, divisione per scenari): **fatto, approvato dal proprietario l'11 novembre 2026; scelta «Sì, tutte» del 10 novembre 2026** | C4-1 | Opus, alto | Strumenti condivisi con il Set Base; un controllo indebolito o un tempo falsato dal carico passerebbero inosservati |
| C4-11 | Spazio e profondità: **fatto, approvato dal proprietario l'11 novembre 2026** | C4-10, D15 | Opus, alto | Geometria per misura dello schermo e tetto delle texture quasi pieno |
| C4-8a | Accessibilità e residui O21: **Fase B fatta, approvata dal proprietario l'11 novembre 2026** ([rapporto](reports/client-c4/c4-8a.md#fase-b)) | tutti i blocchi visivi | Sonnet, alto | Molti percorsi, controlli nuovi |
| C4-8b | Prestazioni e budget: **fatto, approvato dal proprietario l'11 novembre 2026 («Sì, chiudi»)** (STOP del punto 3, strumento di misura nuovo, ricerca dei primi piani più veloce a risultato identico; picchi FFA al livello di C4-1b, input FFA un poco sopra; [rapporto](reports/client-c4/c4-8b.md)) | tutti i blocchi visivi | Opus, alto | Ridisegno incrementale in `scene.ts`: rischio più alto di regressioni |
| C4-9 | Consolidamento e giudizio del proprietario: **Fase A fatta, STOP per il giudizio del proprietario (11 novembre 2026)** (matrice completa 25/25 verde sulla build di `61ff59f`, 750×292 con i soli rossi R1 e R4 della base; [rapporto](reports/client-c4/c4-9.md), [scheda di prova](reports/client-c4/c4-9/prova-scheda.md)) | tutti | Opus, medio | Serve soprattutto dichiarare con esattezza cosa è provato |

La colonna «Modello, sforzo» è indicativa: per i blocchi ancora da eseguire la proposta accompagna il prompt e l'esecutore lo sceglie il proprietario ([metodo](orchestrazione-lavoro.md#proposta-di-modello-e-sforzo)).

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
configurazioni diverse). Il criterio giusto è **un solo punto che avvia i server, al più un server per esecuzione, e al più N esecuzioni per volta**.

### Ordine e parallelo

**Ordine (D14, D15):** C4-1 → C4-1b → C4-3 → C4-2 → C4-4 → C4-5a → C4-5b → C4-6* → C4-7* → C4-7-ter → C4-10 → C4-1c → C4-11 → C4-8a → C4-8b → C4-9 (C4-6* saltato per D1 (a), 6 novembre 2026; C4-7-ter, C4-10 e C4-11 aggiunti con D15 il 7 novembre 2026). I numeri 10 e 11 non indicano l'ordine: i due blocchi vengono **prima** di C4-8a. C4-8a e C4-8b vengono dopo
tutti gli asset e tutte le animazioni, perché movimento ridotto, peso e cadenza vanno misurati su quelli veri.
**Deroga del 10 novembre 2026 ([D16](#decisioni-del-proprietario)):** la Fase B di C4-11 è stata svolta mentre C4-1c (strumenti, su un'altra macchina) era in corso; C4-11 non tocca gli strumenti e i cambi di C4-1c ai documenti comuni si uniscono al rebase. Dopo C4-9, prima di C5, la [matrice completa di fine C4](#matrice-completa-di-fine-c4).

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
| C4-7-ter | ● (agganci) | | | ● | ● | ● |
| C4-10 | ● | ● | ● | ● | ● | |
| C4-11 | ● | ● | ● | ● | ● | ● se servono immagini |
| C4-8a | ● | ● | ● | ● | ● | |
| C4-8b | ● | ● | | | ● | |

**Non possono andare in parallelo:** C4-3, C4-2, C4-4, C4-7-ter, C4-10, C4-11, C4-8a, C4-8b fra loro; C4-5b con C4-3, C4-2, C4-4 e C4-8a (`style.css` e
shell); C4-9 con qualunque altro. **Possono andare in parallelo solo le parti senza codice:** selezione di simboli e font e bozza
dell'inventario (C4-3), generazione della texture (C4-5a), generazione delle illustrazioni (C4-6), scelta dei suoni (C4-7), mentre
un altro blocco lavora sul client. Quelle parti producono file e registro; l'integrazione rientra in fila.

**Tre limiti pratici.** (1) Una sola VerifyAll per macchina; il pool isolato arriva a N=4 per il consolidamento, aim e layout da sole dopo 15 s di quiete. Fuori dal lancio unico le verifiche usano porte e account comuni e vanno in serie. (2) `run.ps1` cerca Node in `.tools/` della radice, ignorato da git, e così `node_modules`: un worktree non è
pronto senza preparazione. (3) C4-1 è committato (`a6f6b1a`): nessuna sessione lavora più su `client-web/` fuori dal blocco in corso.

### C4-1 — Strumenti di verifica (O23)

**Perimetro.** Solo strumenti, nessun effetto sul gioco. Un lancio unico che:

- serializza le verifiche per default e impedisce due giri insieme; con `-Parallel N` isola fino a N esecuzioni (ufficiale N≤4);
- ha un solo punto che avvia i server, al più un server per esecuzione, e al più N esecuzioni per volta: uno condiviso per `Verify` e `VerifyModes`, propri per chi li ferma o
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

- Un giro completo a 1366×768 e 844×390, più Verify e VerifyLayout a 1920×1080 da C4-1c, dà gli stessi esiti delle singole verifiche, con i contatori di casi visti confrontabili con
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

**Esito (3 novembre 2026, `a6f6b1a`).** Giro ufficiale 23 su 23 verde in 98 min 05 s, nessun avviso, `VerifyAim` con `touch`, `reduced` e `pending`; base a 750×292: `Verify` verde, `VerifyFfa`, `VerifyAim` e `VerifyLayout` rossi (6 `layoutProblems` in duello, 11 in FFA). Dettagli nel [rapporto](reports/client-c4/c4-1b.md#c4-1b--misura-di-partenza).

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

**Esito (3 novembre 2026, build `1ab2185` più le modifiche del blocco).** Fatto, **approvato dal proprietario il 4 novembre 2026** sul [campione](reports/client-c4/c4-3/campione/README.md). Nessun asset di terzi, quindi nessuna pagina crediti. Test del client 205 su 205; `Size` verde contro limiti rigidi e tetti di D9 (JS 83,0% del tetto); `Verify`, `VerifyDecks`, `VerifyPublic`, `VerifyLayout` e `VerifyResolution` (`quick`, `ffa`) verdi a 1366×768 e 844×390; regola 18: `layoutProblems` 6 in duello e 11 in FFA come alla base, `Verify` a 750×292 verde in un giro su tre (come la base: tre su sei, causa nel gettone di stato sotto la mano). Non verificato: iPhone, Impact su iOS, scala di grigi. Dettagli nel [rapporto](reports/client-c4/c4-3.md#c4-3--simboli-font-e-inventario-degli-asset).

### C4-2 — Finitura delle dimensioni e tutela di 750×292

**Stato: fatto e approvato dal proprietario il 4 novembre 2026** ([rapporto](reports/client-c4/c4-2.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292)). In corso d'opera il proprietario ha deciso che ✓ e × stanno sulla carta scelta, divisa a metà, e che la carta aspetta il più vicino possibile a dove è stata rilasciata.

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

**Stato: fatto e approvato dal proprietario il 4 novembre 2026** ([rapporto](reports/client-c4/c4-4.md#c4-4--cornici-per-tipologia-e-segno-del-ruolo-o8-con-o14)). Il proprietario ha scelto la V1, filetto, nello spessore medio.

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

**Stato, 4 novembre 2026: fatto, in attesa del giudizio del proprietario.** O2 resta aperta; [verifiche, Size e catture sul tavolo vero](reports/client-c4/c4-5a.md#c4-5a--integrazione-dello-sfondo-del-tavolo-o2). Giro ufficiale 7/7 verde; a 750×292 conteggi invariati e rossi preesistenti dichiarati nel rapporto; controlli separati Spring/manifest rossi e diagnosticati, senza modifiche fuori ambito.

**Decisione del proprietario del 4 novembre 2026 (sostituisce l'obiettivo precedente «nessuna deformazione alle tre misure»).** Scelto **piano 2 stirato a riempire la scena**, più sottobicchiere, Negroni e posacenere separati, senza stiramento: modalità **S** di [layers/NOTA.md](design/client-c4/background/layers/NOTA.md#formule-proposte-e-simulazioni). Motivo fornito: il proprietario ha giudicato la simulazione **S-piano2 la migliore**. La scelta della simulazione non costituisce approvazione dell'integrazione sul tavolo vero.

**Perimetro.** Riferimento 2006×784: sx=W/2006, sy=H/784; piano W×H, origine (0,0). Centro di ogni sprite (xi×sx, yi×sy); scala uniforme √(sx×sy), dopo la normalizzazione altezza nominale/altezza intrinseca della texture. Ombre separate dal codice con i parametri di NOTA.md. Nessuna modifica a posti, carte, mano, pile o comandi; decorazioni senza interazione (O24 futuro). Stessa scritta decorativa, da ritoccare solo se copre posti.

**Deformazione ammessa del solo piano.** Rapporto verticale relativo sy/sx−1 (negativo = lieve schiacciamento verticale); il test applica i massimi seguenti, arrotondati verso l'alto, senza tollerare deformazione degli sprite:

| Scena | sy/sx−1 calcolato | Massimo assoluto ammesso |
|---|---:|---:|
| 1366×768 | +43,8551% | 43,86% |
| 844×390 | +18,2325% | 18,24% |
| 750×292 | −0,3823% | 0,39% |

**Dipendenze.** D11; prompt e originali già tracciati in [background/layers](design/client-c4/background/layers/NOTA.md). Il proprietario fornisce in questa sessione i termini: «quelli delle immagini generate da te»; titolo/URL/versione e condizioni specifiche non verificati restano tali nei registri. Solo riferimenti del progetto, hash coincidenti con le schede (regola 14). Altri candidati archiviati, mai in public/.

**File toccati.** `public/art/table.webp`, tre WebP con alfa, geometria pura dello sfondo, `scene.ts`, relativo test, inventario, registri e documenti comuni. `style.css` solo se occorre spostare `.brand`.

**Rischi.** Il piano è volutamente deformato; gli oggetti uniformi possono raccordarsi in modo approssimativo al bordo. Leggibilità su un fondo più chiaro e ricco, aloni degli sprite, costo in FFA e texture entro D9 rivista. Non si deducono licenze o versioni non esposte.

**Completamento verificabile.** Registri e regole 10/14 verificati; confronto di almeno due qualità WebP, bordi su legno chiaro/scuro; copertura completa, centri proporzionali e scala uniforme degli sprite alle tre misure anche dopo resize consecutivi; deformazione del piano entro i massimi sopra; geometria di gioco e BASE_750 invariate; posti e testi osservati sul tavolo vero (contrasto formale a C4-8a); `Size` prima/dopo nei limiti rigidi e 32 MiB di texture; giudizio del proprietario ancora richiesto sul risultato integrato.

**Verifiche.** `VerifyAll -Only 'test,build,size,verify,layout'` alle misure ufficiali; `Verify` e `VerifyLayout` aggiuntive a 750×292 per regola 18, dichiarando i rossi preesistenti senza rilassare soglie. Verifiche comuni di AGENTS. O2: «fatto, in attesa del giudizio del proprietario» solo dopo l'integrazione e le prove.

### C4-5b — Coerenza di tutte le schermate

**Stato: approvato dal proprietario il 6 novembre 2026** («giudizio su c4-5b positivo»). A generale/editor/admin; B di calata, con invito singolo allo scarto e nessuna ripetizione a sinistra. [Scelta](design/client-c4/screens/scelte.md), [dopo](reports/client-c4/c4-5b/dopo/README.md), [esiti finali](reports/client-c4/c4-5b.md#fase-b--esiti-finali-e-cosa-giudicare). Riformattazione equivalente conclusa in `11bc95e`; [inventario](design/client-c4/screens/inventario.md), [censimento](design/client-c4/screens/censimento.md), [proposta A/B](design/client-c4/screens/proposta.md), [rapporto](reports/client-c4/c4-5b.md#c4-5b). Scelta ricevuta; token e finitura applicati nei sei gruppi di commit. Giro ufficiale 19/19 verde, unità finali 240/240; 750 rosso dichiarato con BASE_750 invariato.

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

**Verifiche.** `Test`, `Build`, `Size`, `Verify`, `VerifyPublic`, `VerifyModes`, `VerifyDecks`, `VerifyProfile`, `VerifyLifecycle`, `VerifyFfa`, `VerifyLayout`, alle misure ufficiali; `Verify` e `VerifyLayout` anche a 750×292, con BASE_750 invariato e rossi preesistenti dichiarati. `VerifyAll -Only 'test,build,size,verify,modes,lifecycle,ffa,decks,public,profile,layout'`; giro 750 separato `-Only 'build,verify,layout' -Measures 750x292`. Le verifiche sempre obbligatorie del repository restano quelle della matrice.

### C4-6* — Illustrazioni delle carte (opzionale)

**Perimetro.** Secondo D1. Con la raccomandazione: sostituire **solo** le illustrazioni che non reggono accanto alle cornici nuove, da una lista
approvata, con il processo di D11. Nessuna guida di stile né lotti: sono di [SB-32](set-base-plan.md#sb-32--illustrazioni-del-set).

**Dipendenze.** C4-4, D1, D11. Da saltare se D1 dice no.

**Stato (6 novembre 2026): saltato.** D1 (a): restano le 40 illustrazioni O9 fino a [SB-32](set-base-plan.md#sb-32--illustrazioni-del-set).

**File toccati.** `public/art/atlas.webp`, `manifest.json`, `tools/atlas.mjs` se serve, `tests/art.test.ts`, `docs/design/client-c2/o9-art/`,
inventario, documenti comuni.

**Rischi.** D24 del Set Base dice di non generare ciò che può sparire. I PNG sorgente O9 sono solo su questo PC e `Atlas` non si riesegue da un clone
pulito: una loro perdita bloccherebbe il blocco. Stile diverso fra lotti, e rispetto alle illustrazioni O9 se lo strumento del proprietario non è lo stesso.

**Completamento verificabile.** Ogni riquadro sostituito ha registro e impronta; nessun duplicato, atlante ≤ 2048 px; `Size` verde; leggibili sul
volto, nell'ispezione e nei primi piani; giudizio del proprietario.

**Verifiche.** `VerifyLayout`, `VerifyDecks`; test `art`.

### C4-7* — Suoni (opzionale)

**C4-7: approvato dal proprietario il 9 novembre 2026**, dopo C4-7-ter e la Fase 0 di C4-10 ([prova](reports/client-c4/c4-10.md#c4-10--prova-del-proprietario-del-9-novembre-2026)). [Proposta](design/client-c4/audio/proposta.md), [scelta](design/client-c4/audio/scelte.md) e [Fase B](reports/client-c4/c4-7.md#c4-7--fase-b) di C4-7: cinque suoni Kenney CC0, volume iniziale 20%, muto e volume nel menu. Fase 0 misurata su 1.11 e approvata dal proprietario.

**C4-7-bis.** Prova del proprietario del 6 novembre 2026: esito non udito (o molto in ritardo) su PC e iPhone; tocco di selezione intermittente e con ritardo su iPhone. Decisione: suono di vittoria e suono di sconfitta distinti («Due distinti»). [Diagnosi e proposta della Fase A](design/client-c4/audio/proposta-esito.md); [scelte](design/client-c4/audio/scelte.md): Kenney Music Jingles, «sconfitta SAX07 vittoria SAX10», pareggio come sconfitta, esito sul colpo decisivo, Web Audio. Fase B fatta il 7 novembre 2026: [rapporto](reports/client-c4/c4-7-bis.md#c4-7-bis--fase-b). Provata dal proprietario il 7 novembre 2026: tocco di selezione ora pronto su iPhone; restano i punti di C4-7-ter.

**C4-7-ter — Fase B fatta (7 novembre 2026), approvata con C4-7 il 9 novembre 2026.** [Scelta](design/client-c4/audio/scelte.md#c4-7-ter--scelta-sulla-fase-a), [rapporto](reports/client-c4/c4-7-ter.md#c4-7-ter--fase-b): 265 test client; ufficiale 7/7, resolution 5/5, audio negato/mancanti verdi, 8 partite esito verdi; 750 layout rosso noto, conteggi non peggiorati. POISON senza suono; conferma con attacco 5 ms. La proposta e le sue regole sono approvate; non è ancora approvato il risultato implementato. [Prova del proprietario del 7 novembre 2026](reports/client-c4/c4-7-ter.md#c4-7-ter--prova-del-proprietario-del-7-novembre-2026): unico rilievo «il volume del sound effect del taglio è troppo alto rispetto agli altri effetti»; la correzione è la **Fase 0 di C4-10** e il giudizio su C4-7 si dà dopo di essa. Dalla [prova del 7 novembre 2026](reports/client-c4/c4-7.md#c4-7--prova-del-proprietario-del-7-novembre-2026), decisioni del proprietario:

- **Esito col pannello.** Il suono di vittoria o sconfitta parte quando compare il pannello d'esito, cioè quando la partita è finita, non alla fine della sequenza; il pannello non si sposta più tardi. Parole del proprietario: «il suono di vittoria e sconfitta non deve arrivare 8-9secondi dopo il pannello che dice che la partita è finita, ma contestualmente ad esso. e non deve comparire più tardi, ma quando la partita è finita».
- **Un suono per ogni colpo**, non uno per round: oggi suona solo l'impatto della prima carta del round, per cui in 1v1 il colpo dell'avversario che gioca dopo non si sente.
- **Suoni per tipo di danno:** un tonfo per HIT («servirebbe un bel tonfo per far capire che uno è stato menato»), un suono di lama per CUT; POISON da proporre (suono proprio, come HIT, o nessuno).
- **Click iniziale della conferma su iPhone** da eliminare, distinguendo fra file e riproduzione.
- Invariati: muto e volume nel menu, Web Audio, interruttore silenzioso che prevale (l'iPhone 15 della prova lo aveva attivo: silenzio atteso, non un difetto).

Prima proposta (candidati da ascoltare, regole per carte con più tipi di danno, colpi ravvicinati, tocchi che ne scavalcano più d'uno, esito e colpi nello stesso round finale, pannello senza sequenza), poi codice. Le regole del perimetro sotto cambiano come indicato.

**Perimetro.** Secondo D2: pochi suoni per selezione, invio, rifiuto, colpi ed esito, da fonte registrata. Volume e muto nel menu, ricordati nel
browser; un suono non porta mai un'informazione che manca a schermo; rispetta salto, interruzione e fine sequenza. Nessuna musica. **Da C4-7-ter (D15):** i colpi suonano uno per uno, col suono del loro tipo di danno, e l'esito suona col pannello; cadono «al massimo un suono di sequenza per risoluzione» e «l'esito sostituisce l'impatto» di C4-7 e C4-7-bis.

**Dipendenze.** D2; dopo C4-5b per il menu. Scelta dei suoni in parallelo.

**File toccati.** nuovo `src/sound.ts`, `public/audio/`, agganci in `scene.ts` e `table.tsx`, `tools/size.mjs` se serve, verifica, inventario, documenti comuni.

**Rischi.** Su iOS l'audio parte solo dopo un gesto e l'interruttore silenzioso prevale. Latenza che degrada l'input. Suono su eventi
interrotti, o doppio su una vista ripetuta (regola 1). Fastidio in sequenze da 20 s con cinque carte.

**Completamento verificabile.** Partita completa con audio assente, bloccato e file mancanti: stesso esito, nessun errore (regola 13). Un suono per evento e
nessun doppione sulla stessa risoluzione ripetuta (regola 1); da C4-7-ter un suono per colpo e l'esito col pannello. Muto ricordato. Input non peggiorato alle misure ufficiali. `Size` verde. Giudizio del proprietario.

**Verifiche.** `Verify` (con audio bloccato), `VerifyResolution` (`quick`, `interrupt`); da C4-7-bis anche `VerifyOutcomeAudio`.

### C4-10 — Guida visiva

**Perché (D15).** Prova del proprietario del 7 novembre 2026: «ho notato che giocandoci l'attenzione non si sa mai dove debba andare, gli occhi vagano da un punto all'altro: valuetrei di aggiungere delle animazioni, dei resize, o delle altre strategie per guidare l'attenzione del giocatore verso cosa sta succedeno in quel momento e verso cosa deve fare»; «non aggiungerei elenchi o altre cose, ma valuterei strategie visive per far intuire cosa bisogna fare. un giocatore che vuole giocare, beh, vuole giocare, non leggere»; il gioco «ha un feel meccanico, non ancora tanto da videogioco».

**Fase 0 — volume del taglio (dalla prova di C4-7-ter): fatta, approvata il 9 novembre 2026.** Il proprietario, il 7 novembre 2026: «il volume del sound effect del taglio è troppo alto rispetto agli altri effetti». Prima della guida visiva, in un commit a sé: misurare il volume dei sette file distribuiti, allineare `knifeSlice.ogg` al tonfo di HIT con un guadagno proprio della sorgente (moltiplicato per l'1/N dei colpi simultanei), senza toccare il master, senza convertire il file e senza cambiare gli altri suoni; un test che fallisce senza il guadagno. Giudizio del proprietario all'ascolto, insieme alla prova di C4-10.

**Fase A — proposta** (7 novembre 2026). [Proposta](design/client-c4/guida/proposta.md) con diagnosi sul tavolo vero, tre strategie prototipate (A «Riflettore», raccomandata; B «Richiamo»; C «Contrasto»), O29 (bagliore sulle carte del round al posto del riquadro giallo) e O30 (✓ e × sulla carta scartata); [rapporto](reports/client-c4/c4-10.md#c4-10--fase-a). Prototipi fuori dal commit.

**Scelta del proprietario (9 novembre 2026), dopo la prova dal vivo:** strategia **B «Richiamo»**, con l'onda sulla mano più veloce e meno ampia; **O29:** riquadro giallo tolto e nessun bagliore sulle carte del round (testo solo per il lettore di schermo, note dopo un salto come oggi); **O30 (a)** con ✓ e × centrati sulla carta scartata e riquadro più trasparente. A e C scartate («troppo buie»). [Parole e dettagli](design/client-c4/guida/proposta.md#scelta-del-proprietario).

**Fase B: fatta e approvata dal proprietario il 9 novembre 2026** ([rapporto](reports/client-c4/c4-10.md#c4-10--fase-b); [prova](reports/client-c4/c4-10.md#c4-10--prova-del-proprietario-del-9-novembre-2026): «mi sembra tutto adatto a quello che abbiamo corretto»). B «Richiamo» con l'onda più bassa e più rapida (valori in `GUIDE`, `readability.ts`, confermati alla prova), O29 senza riquadro giallo e senza bagliore (testo in uno stato nascosto, note dopo un salto visibili), O30 (a) con ✓ e × centrati sulla carta scartata sollevata e più trasparenti. Tolta la frase del menu su R03 (consegna 1 del Set Base). Corretto in corso d'opera un difetto portato da O30 (il click sintetico dopo il tocco cadeva su × e annullava lo scarto). Matrice verde alle misure ufficiali tranne aim 844, rosso anche sulla base; 750×292 come C4-7-ter.

**Perimetro.**

- Strategie **visive** per portare lo sguardo su ciò che succede e su ciò che il giocatore deve fare: movimento, ingrandimento, luce e oscuramento, pulsazione, colpi che «si sentono» a schermo (con i suoni di C4-7-ter). **Nessun testo nuovo sullo schermo** e nessun elenco.
- Il riepilogo giallo del turno in alto ([O29](client-roadmap.md#osservazioni-registrate-durante-c4)): da rivedere o sostituire con un segno visivo.
- La conferma dello scarto sulla carta scelta, almeno sugli schermi grandi (O30), per non spostare lo sguardo da una parte all'altra.
- Prima proposta (prototipi sul tavolo vero, con catture o brevi registrazioni da giudicare a occhio), poi codice.

**Dipendenze.** C4-7-ter (i colpi sonori e visivi vanno insieme), D15.

**File toccati.** `scene.ts`, `table.tsx`, `readability.ts`, `style.css`, test, verifiche, documenti comuni.

**Rischi.** Animazioni dentro la sequenza: regole 1–9, in particolare durate e tetto di 20 s invariati (O19 resta a C5) e nessuna attesa sul percorso di input. Togliere il riepilogo giallo non deve togliere informazioni (regola 16): «Ultimo turno» resta il percorso completo. Peso sulla fluidità di Safari, già segnalata (C4-8b). Le strategie vanno legate agli elementi del tavolo, non a posizioni fisse, perché C4-11 cambia la geometria.

**Completamento verificabile.** Regole 1–9 verdi; nessuna informazione tolta; movimento ridotto con lo stesso contenuto senza animazione (rifinito in C4-8a); input non peggiorato alle misure ufficiali; giudizio del proprietario.

**Verifiche.** `Verify`, `VerifyFfa`, `VerifyAim`, `VerifyResolution` completa, `VerifyLayout`; 750×292 secondo la regola 18.

### C4-1c — Verifiche più veloci

**Stato: fatto, approvato dal proprietario l'11 novembre 2026 («Approvo C4-1c»; soggetto alla matrice completa di fine C4, D16); scelta «Sì, tutte» del 10 novembre 2026** (10 novembre 2026; [proposta](design/client-c4/verifiche/proposta.md), [rapporto Fase B](reports/client-c4/c4-1c.md#c4-1c--fase-b)). Previsto prima della Fase B di C4-11; per decisione del proprietario ([D16](#decisioni-del-proprietario)) i due si sono sovrapposti.

Scelta del proprietario del 10 novembre 2026: «Sì, tutte». Fase B autorizzata: N=4 (`-Parallel 4`), `-Split resolution,ffa`, aim e layout da sole dopo 15 s di quiete; attese sulla condizione in Ffa e tempo massimo per parte; leva e) esclusa; parallelo pubblicabile come consolidamento dopo la Fase B con un giro verde a N=4; altra macchina senza obbligo, prova a N=2 prima del parallelo.

**Perché.** Il giro completo in serie dura circa 100 minuti, due terzi dei quali sono di `VerifyResolution`, e le verifiche sono il collo di bottiglia dello sviluppo.

**Perimetro.** Solo strumenti: esecuzioni in parallelo, ognuna con server, database temporaneo, anteprima e cartella proprie, e divisione per scenari di `VerifyResolution` e `VerifyFfa`. Nessuna soglia, nessun atteso, nessuno scenario tolto, nessun orologio finto. Le verifiche che misurano fotogrammi e input restano da sole. Il criterio è «al più un server per esecuzione, e al più N esecuzioni per volta»; il metodo impone una sola VerifyAll per macchina. Limite per parte 15 min, chiusura verificata per PID e comando; nessun rilancio automatico. 1920×1080 inclusa solo per Verify e VerifyLayout.

**Esito Fase B.** Giro N=4 **25/25 verde in 41:43**, prove di guasto passate; Ffa prima/dopo e percorso seriale verificati. Il proprietario ha poi scelto «Sì, salta il secondo giro» per accorciare l’ETA: variabilità fra due giri completi non verificata. Confronti e limiti nel [rapporto](reports/client-c4/c4-1c.md#c4-1c--fase-b). Nessuna soglia, atteso o codice di prodotto cambiato.

### C4-11 — Spazio e profondità

**Perché (D15).** Prova del proprietario del 7 novembre 2026: «il gioco sugli schermi piccoli è affollato, mentre sugli schermi grandi è un po' spoglio»; «il gioco manca di tridimensionalità».

**Fase B** (10 novembre 2026): **fatta, approvata dal proprietario l'11 novembre 2026** («Approvo C4-11», alla domanda della regia «l'hai provato dal vivo e lo approvi?»; soggetto alla matrice completa di fine C4, D16). Scelta del proprietario del 10 novembre ([proposta](design/client-c4/spazio/proposta.md#scelta-del-proprietario)): a1 + a2 con il segno vinaccia sul conteggio della pila, b1 attenuato (circa ×1,215 a 1920×1080), ombra un po' più profonda e morbida senza c1 né c2, d (O28), v1 in `aimArrows`, J2 per il jingle, 1920×1080 misura ufficiale per `Verify` e `VerifyLayout`. Codice e verifiche in due tempi (B1 codice e test unitari, B2 verifiche mirate secondo D16); [rapporto](reports/client-c4/c4-11.md#c4-11--fase-b). **a3** (cornice degli avversari ridotta sul compatto) non è implementata: resta una **riserva** per prove future su mobile.

**Fase A — proposta** (9 novembre 2026): pronta, poi scelta dal proprietario. [Proposta](design/client-c4/spazio/proposta.md) con diagnosi sul tavolo vero (1366×768, 844×390 e 1920×1080 diagnostica), opzioni prototipate per schermi piccoli (a1, a2), grandi (b1, b2), profondità (c1, c2) e O28 (d), causa e correzione del rosso di `VerifyAim` a 844×390 (v1), opzioni per il jingle d'esito (J0, J1, J2) e sette domande numerate; [rapporto](reports/client-c4/c4-11.md#c4-11--fase-a). Prototipi fuori dal commit.

**Perimetro.**

- **Schermi piccoli:** meno affollamento, con il secondario compresso o raggiungibile su richiesta; lo spazio tolto da Safari in orizzontale ([O28](client-roadmap.md#osservazioni-registrate-durante-c4): aree sicure, `viewport-fit=cover`, se economici).
- **Schermi grandi:** usare lo spazio (carte e postazioni più generose, decorazione del bar, respiro).
- **Profondità disegnata:** ombre, piani sovrapposti, luce, rilievo delle carte e del tavolo, in Pixi 2D; nessun renderer 3D.
- **Dalla prova di C4-10** ([destinazioni](reports/client-c4/c4-10.md#c4-10--destinazioni-della-regia)): `VerifyAim` rosso a 844×390 in FFA e in attesa, con una freccia verso un computer sopra ✓/× quando la carta scelta è una legata al personaggio (preesistente, rosso anche sulla base `d70be28`), da chiudere o dichiarare; con O28 su iPhone, il jingle d'esito troncato da un ridimensionamento (barra di Safari, `visualViewport`), perché `interrupt` ferma l'audio anche senza sequenza in corso: è conforme alla regola approvata, e cambiarla è una decisione del proprietario.
- Prima proposta (catture alle misure ufficiali, con le opzioni), poi codice.

**Dipendenze.** C4-10, D15; D11 se servono immagini nuove.

**File toccati.** `scene.ts`, `readability.ts`, `style.css`, `index.html` per O28, asset e inventario se servono, test, verifiche, documenti comuni.

**Rischi.** Regole 16, 17 e 18: nessuna funzione tolta per fare spazio, fattori alle misure ufficiali che non scendono salvo decisione, 750×292 che non peggiora. Il tetto delle texture è quasi pieno (27 729 048 byte su 33 554 432, cioè 32 MiB, dopo C4-7-bis): ombre e luci vanno disegnate in codice o con texture piccole. Peso sulla fluidità di Safari (C4-8b). O28 non è verificabile da Edge.

**Completamento verificabile.** `VerifyLayout` verde alle misure ufficiali con fattori non peggiorati; regola 18; `Size` entro il tetto delle texture; catture prima e dopo; giudizio del proprietario, anche su iPhone per O28 se lo prova.

**Verifiche.** `Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout`, `VerifyResolution` ridotta; 750×292 secondo la regola 18. **Con D16 (10 novembre 2026)** eseguite solo quelle legate a ciò che il blocco tocca: `Verify` e `VerifyLayout` a 1366×768, 844×390 e 1920×1080, `VerifyLayout` e `Verify` a 750×292, `VerifyAim` a 1366×768 e 844×390, `VerifyOutcomeAudio` per J2; `VerifyFfa` e `VerifyResolution` rimandati alla [matrice completa di fine C4](#matrice-completa-di-fine-c4) ([rapporto](reports/client-c4/c4-11.md#c4-11--fase-b)).

### C4-8a — Accessibilità e residui O21

**Stato: Fase B fatta il 10 novembre 2026, approvata dal proprietario l'11 novembre 2026 («Approvo», dopo una partita completa da tastiera e la correzione dell'ordine di Tab)** ([rapporto](reports/client-c4/c4-8a.md#fase-b)); scelte del
proprietario del 10 novembre 2026 («Tutte raccomandate») nella [proposta](design/client-c4/accessibilita/proposta.md#scelta-del-proprietario).
Fatti i punti 1–10 (anello a due toni, tastiera 2a/2b/2c, contorno ai tre simboli, tre token della shell, riga «Danno nominale» (D5 b), frecce su
radio e schede, etichette 7a; 4a, 5a e P11 dichiarati). Verifiche D16 verdi (un rosso di `VerifyAim` 1366×768 era dello scenario da tastiera appena aggiunto, corretto; `VerifyLayout` 750×292: R1).
Non provato: lettore di schermo (D12 d). Dalla Fase A: la partita si completa già
da sola tastiera; i difetti sono di visibilità e continuità del focus e di contrasto di alcuni simboli e controlli della shell.
ExtremelyViolentBlow osservata con la V reale in partita, ora controllata a ogni turno in `VerifyResolution open` (O21: resta solo POISON, che nessuna carta usa).

**Perimetro.**

- Focus visibile e ordine prevedibile su tavolo e shell, con contorno che si legga anche sopra la carta.
- Contrasto misurato sul disegno reale secondo D12.
- Partita da sola tastiera (scelta, bersaglio, scarto, conferma, annullamento).
- Zoom e testo ampliato nelle schermate HTML.
- Movimento ridotto riprovato su tutte le animazioni nuove, comprese quelle di C4-10 e C4-11.
- Consegne dal filone Set Base (strumenti di verifica cambiati, mazzi sintetici entro R02 1.12; la frase del menu su R03 l'ha tolta C4-10): elenco in [orchestrazione, «Allineamento fra le macchine»](orchestrazione-lavoro.md#allineamento-fra-le-macchine).
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

**Condizione attivata (6 novembre 2026).** Nella prova di C4-7 il proprietario ha segnalato su iPhone: «le animazioni su safari non sono proprio fluidissime». È la segnalazione da iPhone prevista sopra: C4-8b la tratta come disagio da misurare e affrontare con lo stesso ordine (ridisegno incrementale e decorazioni prima del renderer), distinguendo il ritardo di rete; quanto sia grave va chiarito col proprietario, e le misure in Edge non lo dimostrano. Dal 7 novembre 2026 (D15) O28 (spazio tolto da Safari in orizzontale) passa a C4-11 e O29 (riepilogo giallo) a C4-10 ([roadmap](client-roadmap.md#osservazioni-registrate-durante-c4)); C4-8b misura anche le animazioni e la profondità aggiunte da quei blocchi.

**Condizione rientrata (11 novembre 2026).** Alla domanda della regia «Nell'ultima prova su iPhone, dopo C4-10 e C4-11, com'era la fluidità?» il proprietario ha risposto «Accettabile ora». La segnalazione del 6 novembre non attiva più il ridisegno incrementale: C4-8b lo fa solo se la misura su desktop esce dal criterio di C3-L o l'input peggiora rispetto a C4-1b, e in quel caso si ferma con numeri, diagnosi e opzioni prima di scrivere codice.

**Stato (11 novembre 2026): STOP del punto 3, senza codice.** Misura su desktop a 1366×768, 844×390 e 1920×1080, da sole e a macchina ferma: tutte verdi, criterio di C3-L rispettato ovunque (quota entro soglia ≥ 98,9%, input ≤ 41,5 ms), duello e 844×390 uguali o migliori di C4-1b; in FFA a 1366×768 l'input massimo per turno (21,9–41,5 ms su otto turni) e i picchi isolati (128–146 ms, sistematici) superano la base. Diagnosi, opzioni in ordine e `Size` (verde, texture 82,6% del tetto) nel [rapporto](reports/client-c4/c4-8b.md); asset e codice invariati. Le misure in Edge non dicono nulla sull'iPhone.

**Scelta del proprietario (11 novembre 2026)** sullo STOP, alla domanda «Come procede C4-8b?»: «Misura, poi sfocature». Si fa l'opzione 0 del [rapporto](reports/client-c4/c4-8b.md#opzioni-in-ordine) (strumento di misura nuovo che localizza i picchi FFA) e poi l'opzione 1(a) (le sfocature dello sfondo in una texture ferma, stessa resa); il resto solo se la misura mostra che serve. Il punto 2 (compressione e caricamento mirato) resta fermo finché il proprietario non risponde.

**Opzione 0 fatta (11 novembre 2026).** Lo strumento nuovo `client-web/tools/draw-probe.mjs` localizza i picchi FFA all'arrivo della vista, in `beginSequence`, soprattutto nella ricerca del posto dei primi piani (`closeUp`, 30–85 ms); le sfocature dello sfondo costano in CPU 0,02–0,18 ms per frame e non sono nei picchi ([rapporto](reports/client-c4/c4-8b.md#opzione-0-la-misura-scelta-del-proprietario-misura-poi-sfocature)). L'opzione 1(a) **non è fatta**: la misura ne smentisce la premessa; si attende la scelta del proprietario.

**Scelta del proprietario (11 novembre 2026)** dopo la misura, alla domanda «Cosa faccio al posto delle sfocature?»: «Velocizza closeUp». Si rende più veloce la ricerca del posto dei primi piani (`closeUp` in `readability.ts`) **con lo stesso risultato**, provato da un test di uguaglianza contro la funzione attuale; le sfocature restano come sono.

**Stato (11 novembre 2026): fatto, approvato dal proprietario.** Alla domanda «Chiudo C4-8b così?» ha risposto «Sì, chiudi»: C4-8b si chiude senza ridisegno né decorazioni ridotte. Risposte del proprietario dell'11 novembre 2026 alle due domande rimaste: punto 2 (compressione e caricamento mirato) «rimandiamolo a quando il client vivrà da qualche parte che non sia il locale», cioè quando il client sarà servito in rete (coerente con D9 rivista: per un client online il peso torna da valutare); sfocature dello sfondo (1a) lasciate come sono, «confermo». `closeUp` più veloce con lo stesso risultato (`61ff59f`, test di uguaglianza contro la ricerca di prima, 9 mutazioni prese): a 1366×768 i picchi FFA scendono da 128–146 a 58–101 ms (C4-1b 101–105), l'input FFA massimo per turno da 21,9–41,5 a 17,9–30,9 ms (C4-1b 23,2 e 18,8); criterio di C3-L rispettato alle tre misure; `Verify`, `VerifyAim`, `VerifyLayout` verdi alle tre misure. Sfocature, decorazioni, ridisegno incrementale, asset e caricamento non toccati; il punto 2 aspetta la risposta del proprietario. Le misure in Edge non dicono nulla sull'iPhone ([rapporto](reports/client-c4/c4-8b.md#prima-e-dopo-con-closeup-più-veloce)).

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
Residui da chiudere qui: il giro grafico sul jar corrente, non rifatto dopo i commit SB-3/SB-4 ([limite accettato a C4-5a-bis](reports/client-c4/c4-5a-bis.md#c4-5a-bis)), e la verifica dei termini d'uso
reali dello strumento di generazione delle immagini, che nell'[inventario](design/client-c4/assets/README.md) risultano non verificati.

**Dipendenze.** Tutti.

**File toccati.** Documenti, evidenze, correzioni puntuali.

**Rischi.** Modifiche dopo il consolidamento, come i ritocchi di C3-7: ogni commit successivo deve dichiarare cosa si riesegue, e la chiusura non deve
lasciare debiti. Osservazioni di ritmo: vanno a C5.

**Completamento verificabile.** Tutte le verifiche verdi sulla **stessa** build dell'ultimo commit di codice; test del client e del repository, `check-rules.py`,
`verify-match-manifests.py` e contesto Spring come esiti separati; regola 18 a 750×292; nessun asset senza registro; giudizio registrato con ciò che
non è provato.

**Verifiche.** Tutte.

**Stato (11 novembre 2026): Fase A fatta, STOP per il giudizio del proprietario.** Nessun codice cambiato. Sulla stessa build (commit `091b1f1`, ultimo di codice `61ff59f`, `dist` `433dccadf326d201`, jar rifatto dal sorgente attuale, che chiude il residuo di C4-5a-bis): `VerifyAll -Parallel 4 -Split 'resolution,ffa'` **25/25 verde**, nessun controllo perso rispetto a C4-1c Fase B; regola 18 a 750×292 con `Verify` e `VerifyAim` verdi, `VerifyLayout` rosso noto R1, `VerifyFfa` rosso come alla base di C4-1b (registrato come R4); test del client 328/328, `build.ps1 -Task Test` verde, `check-rules.py` e `verify-match-manifests.py` PASS, contesto Spring 775 test e 0 falliti; `Verify` con audio negato 3/3 senza avvii udibili né origini esterne. Regole 1–18 dichiarate una per una, righe P, inventario riconciliato, budget contro D9 rivista (texture 82,6% del tetto) nel [rapporto](reports/client-c4/c4-9.md). Rimandati: il punto 2 di C4-8b (finché il client non sarà servito fuori dal locale); a C5 la prova umana C, O19 e le osservazioni di ritmo. Dichiarazione dell'IA nella pagina pubblica: «Rimanda (b)» (proprietario, 11 novembre 2026), si fa quando il client sarà servito fuori dal locale, come il punto 2 di C4-8b. Aperte per il proprietario: i termini d'uso dello strumento di immagini, la [prova della scheda](reports/client-c4/c4-9/prova-scheda.md). **C4 non è chiusa** finché il proprietario non giudica.

### Matrice completa di fine C4

Comando del giro ufficiale (25 esiti, 1920×1080 solo per Verify e VerifyLayout):

```powershell
./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa'
```

A parte, regola 18: `-Measures 750x292 -Only 'test,build,size,verify,ffa,aim,layout'` (giro dichiarato).

**Perché ([D16](#decisioni-del-proprietario), 10 novembre 2026).** Dal 10 novembre ogni blocco esegue solo le verifiche economiche e le Playwright legate a ciò che tocca. Prima di C5 si esegue **tutta** la [matrice](#verifiche-da-rieseguire-per-blocco) sulla stessa build: tutte le verifiche a 1366×768 e 844×390, `Verify` e `VerifyLayout` anche a 1920×1080, la regola 18 a 750×292; i giri rimandati dai blocchi (per C4-11: `VerifyFfa`, `VerifyResolution`, `VerifyLifecycle`, `VerifyDecks`, `VerifyPublic`, `VerifyProfile`, `VerifyModes`) vi rientrano. Un rosso trovato allora si prova sulla base del blocco che lo ha portato e si corregge con test; le approvazioni dei blocchi restano soggette a questa matrice. Può coincidere con il giro completo di C4-9, se nessun codice cambia dopo.

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
| C4-5a | ● 750 | | | | | | | | | ● 750 |
| C4-5b | ● 750 | ● | ● | ● | ● | ● | ● | | | ● 750 |
| C4-6* | | | | | ● | | | | | ● |
| C4-7* | ● | | | | | | | ○ | | |
| C4-7-ter | ● 750 | | | | | | | ○ | | ● 750 |
| C4-10 | ● 750 | | | ● | | | | ● | ● | ● 750 |
| C4-1c | ● 1920 | ● | ● | ● | ● | ● | ● | ● | ● | ● 1920 |
| C4-11 | ● 750 · 1920 | | | ● 750 | | | | ○ | ● 750 | ● 750 · 1920 |
| C4-8a | ● | | | | ● | ● | | ○ | ○ | |
| C4-8b | ● | | | ● | | | | ● | ● | ● |
| C4-9 | ● 750 · 1920 | ● | ● | ● 750 | ● | ● | ● | ● | ● 750 | ● 750 · 1920 |
| Fine C4 | ● 750 · 1920 | ● | ● | ● 750 | ● | ● | ● | ● | ● 750 | ● 750 · 1920 |

**Dal 10 novembre 2026 ([D16](#decisioni-del-proprietario))** la riga di un blocco indica il massimo; il blocco esegue le Playwright legate a ciò che tocca e dichiara le altre come rimandate alla riga «Fine C4». «1920» indica 1920×1080 per `Verify` e `VerifyLayout`. Per C4-11 eseguiti: `Verify` e `VerifyLayout` a 1366×768, 844×390, 1920×1080 e 750×292; `VerifyAim` a 1366×768 e 844×390; `VerifyOutcomeAudio` (J2); rimandati `VerifyFfa`, `VerifyResolution` e gli altri ([rapporto](reports/client-c4/c4-11.md#c4-11--fase-b)).

## Decisioni del proprietario

**Tutte prese: D3, D4, D6, D8, D9, D11, D13 e D14 il 3 novembre 2026; D1, D2, D5 e D12 il 6 novembre 2026; D15 il 7 novembre 2026; D16 il 10 novembre 2026; D7 e D10 non servono più.** Le raccomandazioni restano come motivazione. Ordine di urgenza in [fondo](#ordine-di-urgenza).

| ID | Domanda | Opzioni | Raccomandazione e motivo | Cosa blocca | Se si rimanda |
|---|---|---|---|---|---|
| D1 | Illustrazioni individuali in C4 | (a) nessuna; (b) solo quelle che non reggono, da lista approvata; (c) tutte e 40 | **(b).** D24 del Set Base dice di generarle a carte finalizzate: tutte ora rischia lavoro che sparisce. La roadmap chiede di sostituirle «dove serve», e dove serve si vede solo dopo le cornici. **Decisa dal proprietario il 6 novembre 2026: (a)**, «lasciamo perdere la generazione di altre illustrazioni, è in corso in parallelo SB per creare il primo set base. teniamoci le illustrazioni che abbiamo per ora, poi tanto andranno rifatte per le carte definitive». | C4-6 | Decisa: C4-6 si salta. |
| D2 | Audio | (a) no; (b) 4–6 suoni con volume basso e muto, nessuna musica; (c) anche ambiente o musica | **(b), per ultimo e primo da tagliare.** Costa poco, la fonte è CC0 e la prova C può giudicarlo; (c) porta peso e fastidio in sequenze da 20 s. Volume iniziale basso, attivo. **Confermata dal proprietario il 6 novembre 2026: (b).** | C4-7 | Decisa. |
| D3 | Simboli | (a) Game-icons per tutti (CC BY 3.0); (b) tutti disegnati da noi; (c) i nostri, Game-icons solo per lacune reali | **(c), confermata dal proprietario il 3 novembre 2026, con l'attesa che le lacune siano poche o nessuna.** Esistono già 15 simboli propri, quelli del danno approvati in C3-7, e il residuo di O10 è fatto di soli costi, guadagni e immunità, tutti coperti dai simboli delle risorse. Sostituirli non migliora e aggiunge attribuzioni per ogni icona. Questo si discosta dalla roadmap, che indicava Game-icons come fonte principale. | C4-3 | Blocca C4-3 e a catena C4-2, C4-4, C4-5b. |
| D4 | Font | (a) quelli di sistema, ridotti a due; (b) Play (OFL); (c) altro OFL scelto su campione | **(a), confermata dal proprietario il 3 novembre 2026 dopo il campione: Impact e Arial.** Il volto attuale piace, zero peso e zero licenze. Sul campione (Edge, Windows; 1366×768, 844×390, 750×292) Play Bold rende meglio i numeri, ma ha titoli più larghi del 22% in media, più troncamenti e diverse etichette tagliate; non ha `→`, `✓`, `▲`, `✕`. Play Regular è troppo sottile sulle carte. Impact non è distribuito e potrebbe mancare su iOS (non verificato): secondo D6 il controllo non blocca, e se manca si accetta il ripiego. | C4-3 (solo font), a catena C4-2 | Decisa. |
| D5 | Segno statico sul bersaglio con movimento ridotto (O21) | (a) sì, sul bersaglio; (b) no, ma tipo di danno in «Ultimo turno»; (c) no, nulla di nuovo | **(b).** Con movimento ridotto il tipo si legge già sul volto e sulla carta piccola al centro. Un segno fisso sul bersaglio toglie spazio dove la striscia già manca in FFA compatta, e con più mosse suggerirebbe un'attribuzione che il server non dà (D1 di C3). `roundReport` oggi non riporta il tipo: basta una riga. **Confermata dal proprietario il 6 novembre 2026: (b).** | Una parte di C4-8a | Decisa. |
| D6 | 750×292 resta il minimo supportato | (a) sì, duello e FFA; (b) sì per il duello, FFA da 844×390; (c) no, minimo 844×390; (d) minimo garantito 844×390, con 750×292 protetta dalla regola 18 | **(d), scelta dal proprietario il 3 novembre 2026; sostituisce (a), confermata poco prima lo stesso giorno.** Il proprietario: il web è un client, il supporto vero al telefono arriverà con l'app; non si spreca tanto lavoro, ma non si perde quello fatto e non si ignora quella misura. Oggi a larghezza 750 servirebbero 384 px di altezza in duello e 417 in FFA, misurati con le funzioni del client; un futuro contenitore a schermo intero recupererà lo spazio della barra del browser. **Limite dichiarato:** la FFA su iPhone in Safari resta con i problemi noti, compreso un posto fuori schermo. | C4-2, regola 18 | Decisa. |
| D7 | Cosa cede sotto i 384 px, in ordine. **Non serve più in C4 (D6, 3 novembre 2026);** proposta conservata per l'app futura | Proposta: 1. primi piani nel proprio posto anziché al centro; 2. carte del round ridotte alla sola ultima, con «Ultimo turno»; 3. mano più piccola e più alzata al tocco; 4. oggetti più sovrapposti; 5. mani coperte più piccole; mai togliere bersagli | **Quest'ordine, da giudicare sulle catture.** Toglie prima ciò che si ritrova altrove (decisioni di presentazione) e tiene le carte come oggetti sul tavolo. Le mani coperte restano tutte e quattro. | Nessun blocco | Non si decide in C4. |
| D8 | Cosa deve avere 44 px | (a) ogni elemento toccabile; (b) tutti i controlli, ma i gettoni di stato possono restare più piccoli se lo stesso contenuto è raggiungibile altrove; (c) solo i controlli principali | **(b), confermata dal proprietario il 3 novembre 2026.** La roadmap chiede 44 px per i target principali; i gettoni 31×18 in una FFA piena non possono crescere senza coprire il personaggio. C4-2 deve provare che il loro contenuto è raggiungibile col tocco su un'area più grande o dall'ispezione. **Numeri di C4-1b (partite reali, desktop e 844×390):** gettoni da 31×18 (FFA e duello a 844×390, e a 750×292) a 61×36 (duello a 1366×768); 41×24 in FFA a 1366×768; nessuna misura è a 44 px. | C4-2, C4-5b | Decisa; prova del contenuto raggiungibile nel [rapporto](reports/client-c4/c4-2.md#c4-2--finitura-delle-dimensioni-e-tutela-di-750292). |
| D9 | Budget di download | (a) soli limiti attuali (JS 500 KB, totale 4 MB, atlante 2048 px, texture 64 MB); (b) limiti attuali più tetto di C4: **JS ≤ 400 KB, totale ≤ 2,2 MB, texture ≤ 32 MB** | **(b).** Il Set Base stima 1,7 MB e 38 MB per i suoi atlanti: con (a) C4 potrebbe consumare il margine che gli serve. I tetti lasciano circa 0,7 MB e 6 MB secondo quelle stime, che **non sono misure**. I limiti rigidi non si alzano. **Confermata dal proprietario il 3 novembre 2026 con l'opzione (b): JS ≤ 400 KB, totale ≤ 2,2 MB, texture ≤ 32 MB; limiti rigidi invariati.** **Numeri veri di C4-1b:** JS gzip 330 459 B (82,6% di 400 KB; margine circa 69,5 KB), totale gzip 1 113 651 B (50,6% di 2,2 MB; margine circa 1,09 MB), texture 18 876 320 B (56% di 32 MiB; margine 14,0 MiB). `size.mjs` applica anche i tetti dal C4-3 (controllo distinto dai limiti rigidi). **Rivista dal proprietario il 3 novembre 2026, dopo C4-3: restano solo il limite rigido di C2 (JS 500 KB, totale 4 MB, atlante 2048 px, texture 64 MB) e il tetto di C4 sulle texture decodificate (≤ 32 MiB). I tetti di JS (400 KB) e totale (2,2 MB) sono tolti.** Motivo: il client si serve in locale fino a C5, 2,2 o 4,4 MB gzip non pesano sulle connessioni di oggi e si scaricano una volta (poi cache); i limiti rigidi fermano già un errore accidentale; ciò che costa davvero su un telefono è la memoria delle texture, per cui il tetto resta. Per un client online su rete mobile il peso tornerebbe da valutare. | C4-3 per gli asset, C4-5a, C4-6, C4-7, C4-8b | Decisa, rivista. |
| D10 | Soglie di prestazioni su iPhone. **Non serve più in C4 (D6, 3 novembre 2026);** proposta conservata per l'app futura | Frame: (a) soglia C0 (≥ 95% ≤ 33 ms) come vincolo e 60 fps come obiettivo riportato; (b) 60 fps come vincolo. Input: (c) ≤ 100 ms senza deroga; (d) ≤ 100 ms come obiettivo, vincolo «non peggio dei 116 ms di C0» | **(a) e (d).** La roadmap dice «puntare a 60 fps» e lascia le soglie di C0; un vincolo a 60 fps su iPhone chiederebbe di tagliare molta grafica senza che nessuno abbia segnalato disagio. La deroga di C0 resta motivata, ma non si allarga: se il client supera i 116 ms si interviene. | Nessun blocco | Non si decide in C4. |
| D11 | Generazione degli asset e registro | Generazione: (a) il proprietario genera con il suo strumento, l'agente scrive prompt e registro; (b) una sessione con uno strumento di generazione, come C0 e O9. Registro: (c) come O9, sorgenti e prompt fuori da git; (d) prompt letterale tracciato e salvato prima di generare, sorgente tracciata solo per lo sfondo | **(a) e (d), confermate dal proprietario il 3 novembre 2026.** Il proprietario genera con il suo strumento e consegna i file; l'agente scrive e committa il prompt prima della generazione, poi registra e integra. Il registro serve perché i prompt di C0-R2 sono andati persi e i PNG di O9 sono solo su questo PC. Solo immagini nuove, riferimento ammesso solo a materiali del progetto (R1, `table.png`), mai i quattro giochi né Internet. Il proprietario indica strumento, modello, versione e data; nel registro anche i termini d'uso dello strumento, C2PA se esposto. | C4-5a, C4-6 | Decisa. La chiusura di O2 dipende dall'immagine del proprietario. |
| D12 | Riferimento di accessibilità e lettore di schermo | Contrasto: (a) WCAG 2.2 AA come obiettivo (4,5:1 testo, 3:1 testo grande e simboli), senza dichiarare conformità; (b) nessuna soglia. Lettore: (c) una breve prova del proprietario con VoiceOver; (d) dichiarato non provato | **(a) e (d); (c) se il proprietario ha dieci minuti.** La soglia rende il controllo ripetibile; le eccezioni si elencano. Il lettore non è automatizzabile qui e in C5 non è un criterio: meglio un limite onesto che una promessa. **Confermata dal proprietario il 6 novembre 2026: (a) e (d).** | C4-8a | Decisa. |
| D13 | Evidenze nel repository | (a) come C3; (b) JSON finali sempre; catture solo finali, compresse, circa 10 MB per blocco, il resto in cartella temporanea; (c) nessuna cattura | **(b), confermata dal proprietario il 3 novembre 2026.** C3 traccia 223 MB in 1880 file: resta per sempre nella cronologia. Le catture servono al giudizio, non vanno tenute tutte. Il tetto è un'indicazione, non una soglia di verifica. | C4-1 (cosa si pubblica) | Decisa e applicata: C4-1 è committato (`a6f6b1a`) e C4-1b ha pubblicato 12 MB. **Indicazione rivista il 10 novembre 2026** con la revisione del metodo: circa 3 MB per fase ([contratto dell'esecutore](orchestrazione-lavoro.md#contratto-dellesecutore)). |
| D14 | Ordine e divisione dei blocchi | (a) la bozza: C4-2 prima di C4-3, nessun C4-1b, C4-5 e C4-8 interi; (b) [correzioni proposte](#blocchi) | **(b), confermata dal proprietario il 3 novembre 2026.** Il font condiziona la geometria; lo stato su iPhone è ignoto; sfondo e shell, accessibilità e prestazioni hanno rischi diversi. Costa due commit in più. | Ordine dopo C4-1 | Non si può partire dopo C4-1 senza. |
| D16 | Quante verifiche Playwright per blocco | (a) la matrice per ogni blocco, in serie; (b) il compromesso: per blocco verifiche economiche e solo le Playwright legate a ciò che tocca, matrice completa alla fine di C4, prima di C5 | **(b), decisa dal proprietario il 10 novembre 2026: «mi piace il compromesso».** Le approvazioni dei blocchi restano soggette alla matrice finale; le correzioni si fanno allora. Con la stessa decisione C4-11 è stato sovrapposto a C4-1c, in deroga all'ordine in serie. | Tutti i blocchi dopo C4-11; [matrice completa di fine C4](#matrice-completa-di-fine-c4) | Decisa. |
| D15 | Cosa fare della prova del 7 novembre 2026 | Proposta della regia: C4-7-ter per i suoni; due blocchi nuovi, C4-10 (guida visiva, con O29 e O30) e C4-11 (spazio e profondità, con O28), prima di C4-8a | **Approvata dal proprietario il 7 novembre 2026** («mi sembra un buon piano»). Guida solo visiva, senza testi né elenchi a schermo, su sua indicazione. | C4-7-ter, C4-10, C4-11 | Decisa. |

### Ordine di urgenza

1. **D13:** confermata il 3 novembre 2026.
2. **D14:** confermata il 3 novembre 2026.
3. **D4 e D3:** confermate il 3 novembre 2026.
4. **D11:** confermata il 3 novembre 2026; la generazione ha tempi propri e può avanzare in parallelo.
5. **D6, D8:** servivano a C4-2; D6 è confermata il 3 novembre 2026 e fa cadere D7 e D10; D8 è confermata il 3 novembre 2026.
6. **D9:** confermata il 3 novembre 2026, opzione (b); rivista lo stesso giorno: tetto solo sulle texture (32 MiB), tetti di JS e totale tolti.
7. **D1, D2:** confermate il 6 novembre 2026, D1 (a) e D2 (b).
8. **D12, D5:** confermate il 6 novembre 2026, D12 (a) e (d), D5 (b).
9. **D15:** approvata il 7 novembre 2026.
10. **D16:** decisa il 10 novembre 2026 (metodo di verifica).

## Cosa questo piano ha e non ha verificato

**Verificato:** lettura delle fonti indicate; misure della geometria con le funzioni del client (non in partita reale); tinte e accoppiamenti
calcolati dai sorgenti; scansione statica di `style.css`; i pesi dalle evidenze di C3-7; le tre pagine di licenza alla data di questo piano. Dopo la stesura, per D4: campione dei font sulle viste registrate, con il codice reale della scena,
su Edge a tre dimensioni, e copertura dei glifi di Play; Play è stato scaricato solo in una cartella temporanea e non è nel repository.

**Non verificato:** nessuna partita reale, verifica Playwright o build lanciata per questo piano; nulla su iPhone, quindi nemmeno se Impact è presente su iOS; il campione dei font mostra solo il canvas, non la shell HTML; nessuna icona scaricata;
`viewport-fit=cover` è un'ipotesi; i contrasti non sono misurati sul disegno composto;
il tetto delle texture di D9 si regge su stime del piano Set Base. Dopo la stesura, C4-1 è stato committato e C4-1b ha eseguito il giro completo e la base a 750×292 (rapporto).
