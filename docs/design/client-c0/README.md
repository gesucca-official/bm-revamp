# C0 — Direzione visiva

## Direzione approvata e scena corrente

**27 ottobre 2026:** [duello, FFA cinque e carta R1](r1/approval.md) approvati
come riferimento visivo. La [scena Pixi/React](../../../client-c0/revision/README.md)
realizza mano, carte oggetto, dorsi, calata e riordino con dati sintetici.
[Catture della build](r2-screenshots/README.md), [nuovi asset](r2-assets/README.md)
e [rapporto R2–R5](../../reports/client-c0-r2-report.md).
**C0 chiusa** il 27 ottobre 2026 ([esiti](../../reports/client-c0-r5-procedure.md#esiti)); C1 non iniziata.
Il laboratorio Angular sotto resta storico.

## Storico: prima proposta respinta

**Prima proposta respinta dal proprietario il 26 ottobre 2026.** Questi SVG
e PNG sono conservati come storico della prima prova, non come direzione
artistica approvata. La [revisione corrente](bar-table-revision.md) richiede
una partita a carte in un bar marcio: mano fisica, oggetti come carte sul
tavolo e mani avversarie coperte. I nuovi mockup sono nella cartella `r1/`; la
palette e il layout con scroll descritti sotto sono le proposte superate.

26 ottobre 2026. Proposte per una sola revisione breve con il proprietario,
non art definitiva o approvazione implicita. Fumetto/rissa: sagome irregolari,
inchiostro scuro, avorio, ambra; niente immagini attuali.

| Elaborato | Vettore modificabile | Anteprima |
|---|---|---|
| Tavolo duello | [duel.svg](duel.svg) | [duel.png](duel.png) |
| Tavolo FFA a cinque | [ffa-five.svg](ffa-five.svg) | [ffa-five.png](ffa-five.png) |
| Schema carta | [card.svg](card.svg) | [card.png](card.png) |

Il bersaglio Bice ha bordo e nome evidenziati; il collegamento tratteggiato
illustra la scelta esplicita, senza introdurre una nuova zona di gioco. Mano
di sei con base/bound persistenti distinte, costo e priorità separati, propria
salute 120 mostrata senza saturare il numero, oggetti vicino al proprietario,
stati/equip distinti, immunità e timer, clock, riepilogo e conferma.

Palette: carbone `#191d22`, superficie `#2a313a`, carta `#f5edda`, ambra
`#ffbf47`, dettaglio stati `#a8dbdf`. Simboli provvisori: cuore/H salute,
occhio/A allerta, impatto/V violenza, rombo/T tossicità, triangolo/L alcol;
sempre sigla e numero. Le etichette distinguono anche i tipi di carta e non
si affidano al colore. Nel prototipo i glifi sono di sistema; le sagome SVG
sono originali. Nessun download di Game-icons, Kenney, Lucide o Google Fonts.

Inventario: i tre SVG, le relative PNG e le screenshot della scena sono
elaborati originali del progetto, generati il 26 ottobre; fonte
`client-c0/tools/sketches.py`, rasterizzazione Edge. Nessun asset esterno,
nessuna modifica ai diritti riservati del repository. I testi delle carte
vengono dal catalogo del progetto e dal regolamento 1.6.

Proposte non bloccanti:

- UI italiana, nomi GUI reali anche maiuscoli, identificatori wire invariati.
- Font di sistema per C0; eventuale font scelto ex novo in C4. Nessun audio C0.
- Desktop campione: PC Windows disponibile, Edge, viewport 1366×768.
- Touch campione **proposto ma non disponibile alla prova**: Samsung Galaxy
  A54, Chrome stabile, landscape; misurare i CSS pixel reali, non assumere
  che equivalgano al viewport emulato 844×390. Minimo proposto 844×390 landscape.
- Portrait minimo proposto 390×844 con flusso verticale, mano su due righe,
  nessun invito obbligatorio a ruotare. Scroll verticale consentito per
  dettagli/conferma; header con clock resta visibile. Non sono layout di app native.
- Controlli principali almeno 44 CSS px, testo effetto 15 px o più. A schermo
  stretto la lettura avviene nel pannello, senza rimpicciolire tutto il tavolo.

L'automazione verifica accessibilità ai controlli e geometria, non sostituisce
il giudizio umano sulla lettura. Una revisione degli schizzi e la prova fisica
touch restano il gate di accettazione C0. [Rapporto](../../reports/client-c0-report.md).
