# C0-R1 — Decisione di rendering

26 ottobre 2026. Proposta per la prossima prova, non implementazione o
accettazione del gate. La richiesta corrente riapre esplicitamente il confronto
che la versione 4 della roadmap aveva chiuso.

## Scelta

**PixiJS 8 + TypeScript per l'intero tavolo; React + HTML/CSS per la cornice
applicativa e l'ispezione; Vite per sviluppo e build.** Pixi comprende carte,
ventagli, oggetti, personaggi e movimento, non soltanto particelle decorative.
React non possiede le trasformazioni delle carte a ogni frame. Non introdurre
un binding React/Pixi o un secondo gestore dei gesti nella prima prova.

È una scelta progettuale per una scena 2D di carte materialmente sovrapposte,
con coordinate, ordine di disegno e bersagli comuni. Non è un benchmark:
il rifiuto artistico non dimostra che Angular o DOM siano lenti. Le immagini
di R1 non sono screenshot del renderer e non ne attestano le prestazioni.

## Alternative rivalutate

| Opzione | Valutazione per questa scena |
|---|---|
| Angular + DOM/CSS/SVG | Può realizzare questo aspetto: il framework non impone pannelli. Offre continuità per form e servizi, ma il client debug non contiene il tavolo fisico da riusare. Trasformazioni, sovrapposizioni e mira richiedono comunque un controller dedicato. È la soluzione di riserva più semplice se il canvas non supera peso, accessibilità o compatibilità. |
| React + DOM/CSS/SVG | Ha sostanzialmente le stesse capacità grafiche. Cambiare il solo framework non corregge l'art direction; non è la ragione della scelta. |
| PixiJS + shell HTML | Scelto per una scena comune con container, sprite, livelli e hit area, incluse carte ruotate e ventagli. Introduce gestione GPU, texture, testo e focus: costi espliciti da verificare, senza promesse di maggiore velocità o minor peso. |
| Phaser + shell HTML | Offre scene, tween, input e altri servizi di gioco. È valido, ma per una singola scena senza fisica né simulazione locale preferisco un renderer più circoscritto. Nessuna affermazione di peso comparativo senza build. Non si riprende il vecchio Phaser rimosso. |

React viene scelto per una shell separata e un'integrazione imperativa esplicita
del tavolo; comporta ricostruire form, navigazione e sottoscrizioni esistenti.
Angular potrebbe ospitare lo stesso renderer. Il vantaggio atteso viene dalla
separazione del tavolo, non da una superiorità artistica di React. La parità
P01–P44 e il costo del porting restano criteri di accettazione.

## Confini da mantenere nella prova successiva

- Un adattatore TypeScript riceve le viste server; stato autorevole, selezione
  locale e regia visiva restano distinti. Nessun motore delle regole nel client.
- Un controller possiede riordino, mira, scarto e conferma. Pointer, click/tap
  e tastiera chiamano gli stessi intenti. Capture, pointercancel, uscita dal
  canvas, resize, background e nuova vista interrompono il gesto senza invio.
- Pixi disegna il tavolo; React monta/smonta il renderer e aggiorna soltanto
  dati discreti. Niente doppie carte interattive DOM/canvas o listener concorrenti.
- Testi estesi, form, menu e dettagli sono HTML selezionabile e ridimensionabile.
  Nomi e numeri sulle carte saranno dati del catalogo/vista, mai testo incorporato
  nelle texture definitive. L'illustrazione generata in R1 è solo un riferimento.
- L'accessibilità Pixi è opt-in: progettare focus, nomi, ordine di tabulazione,
  annunci e alternativa al drag. Il suo overlay non equivale a accessibilità
  automaticamente verificata. Provare anche carte sovrapposte e FFA al minimo.
- Illustrazioni, cornici e dorso separati in risorse ottimizzate; caricamento
  per necessità. Le PNG di revisione non sono il pacchetto critico di produzione.
- Gestire perdita/ripristino del contesto grafico e indisponibilità del renderer
  senza alterare pending, clock o connessione. Non promettere oggi un fallback
  canvas completo; se la compatibilità richiesta fallisce, rivalutare DOM/SVG.
- Protocollo STOMP/SockJS e payload invariati; nessuna dipendenza nuova installata
  in R1. Le versioni puntuali di React/Vite/TypeScript/Node/Pixi andranno fissate
  insieme nel lock isolato della prova autorizzata, dopo verifica di compatibilità.
  La toolchain Angular esistente documenta solo la prova storica.

## Verifica futura, dopo revisione visiva

Una sola scena sintetica rappresentativa, non due client: FFA cinque con sei
carte proprie, conteggi avversari 0/1/6 e oggetti alle capacità previste.
Conservare le soglie della roadmap: 500 KiB gzip JS critico, 1 MiB complessivo
critico, input entro 100 ms, almeno 95% frame entro 20 ms desktop / 33 ms touch
fisico per 60 secondi. Includere asset, overlay e testo reale nel costo.

Se fallisce, effettuare una semplificazione mirata. Se persiste un problema
necessario di peso, compatibilità, accessibilità o input, confrontare la stessa
scena DOM/SVG prima di decidere; non ampliare automaticamente budget o requisiti.
Confermare la scelta tecnica solo in C0-R5. In questa consegna ci si ferma
alle immagini di C0-R1: niente nuovo prototipo, dipendenze o C1.

## Fonti primarie consultate

Consultazione: 26 ottobre 2026. Le conseguenze progettuali sopra sono valutazioni
per Botte Micidiali; le fonti attestano le primitive, non il risultato del progetto.

- [PixiJS: scena e container](https://pixijs.com/8.x/guides/concepts/scene-graph).
- [PixiJS: eventi, hit testing e cancellazione](https://pixijs.com/8.x/guides/components/events).
- [PixiJS: accessibilità con overlay DOM, opt-in](https://pixijs.com/8.x/guides/components/accessibility).
- [PixiJS: sistemi di testo](https://pixijs.com/8.x/guides/components/scene-objects/text)
  e [gestione degli asset](https://pixijs.com/8.x/guides/components/assets).
- [React: integrazione con sistemi esterni](https://react.dev/learn/escape-hatches).
- [Angular: accesso alle API DOM](https://angular.dev/guide/components/dom-apis).
- [Phaser: scene e servizi](https://docs.phaser.io/phaser/concepts/scenes).
- [Vite: sviluppo e build](https://vite.dev/guide/).
