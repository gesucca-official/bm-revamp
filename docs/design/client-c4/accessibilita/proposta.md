# C4-8a — Accessibilità e residui O21: Fase A (proposta)

10 novembre 2026. Base: `main` a `ac1e885` («C4-1c: phase A proposal…»), tirata con fast-forward da `25353ce` (due commit: C4-1c Fase A e rapporto O20; il server è cambiato, jar rifatto con `./scripts/build.ps1 -Task Server -Offline`, `check-rules.py` verde). Tavolo costruito da quel commit (C4-10 e C4-11 compresi). **Fase A: solo analisi, proposta e domande. Nessun codice di prodotto è cambiato**; il prototipo è nella [patch](prototipo.patch). Le scelte sono del proprietario; poi la Fase B.

Evidenze: [`docs/reports/client-c4/c4-8a/fase-a/`](../../../reports/client-c4/c4-8a/fase-a/README.md) (circa 8 MB, D13). Gli script di sonda sono in [`sonde/`](../../../reports/client-c4/c4-8a/fase-a/sonde/) (fuori da `client-web/tools`, dichiarati qui sotto).

## Sintesi

**Il gioco si completa da tastiera.** Due partite intere contro il computer (13 e 10 turni, movimento ridotto, 1366×768) sono state giocate **solo con Tab, Invio, Spazio ed Esc**: scelta, bersaglio, scarto, conferma, annullamento con il pulsante e con Esc, esito, «Nuova partita»; più una partita con movimento normale (4 turni) e una in FFA a cinque (3 turni). Non c'è un blocco. I difetti sono di **visibilità del focus**, **continuità del focus** e **contrasto di alcuni simboli e controlli della shell**, tutti piccoli da correggere. I **testi del tavolo passano la soglia di D12 con margine** (minimo misurato 5,75:1 sul disegno reale).

**Problemi trovati, per gravità**

| # | Gravità | Problema | Evidenza |
|---|---|---|---|
| P1 | **Alta** | Il focus su **Conferma/Annulla** (✓ ×) si vede appena: l'anello è dentro la metà (offset −5 px), azzurro su carta chiara; solo il **45%** dei punti dell'anello ha 3:1 con ciò che gli sta accanto. È il controllo centrale di ogni mossa da tastiera. | [`ring-confirm.json`](../../../reports/client-c4/c4-8a/fase-a/ring-confirm.json), [cattura](../../../reports/client-c4/c4-8a/fase-a/ring-orig-confirm.jpg) |
| P2 | **Alta** | L'anello di focus (`#8cdbdd`) contro la **carta crema** è 1,11:1 (e 1,37:1 contro le monete): dove l'anello passa su una carta vicina (ventaglio della mano, mano dell'avversario) sparisce. Posti dell'anello ≥ 3:1: carte della mano 88–100%, personaggi e oggetti 97–100%, **gettone di stato 76%**. | [`ring-duel-1366x768.json`](../../../reports/client-c4/c4-8a/fase-a/ring-duel-1366x768.json) |
| P3 | **Alta** | **Il focus si perde a ogni turno** (13 turni su 13 e 10 su 10, in due partite) e dopo «Annulla»: chi gioca da tastiera riparte dal primo Tab dopo ogni mossa. Con Esc resta sul bersaglio. | [`kbd-*.json`](../../../reports/client-c4/c4-8a/fase-a/kbd-duel-1366x768-reduced.json) |
| P4 | Media | Shell: **segnaposto 3,93:1** (soglia 4,5:1) nei campi email, nome mazzo e ricerca; **bordo dei campi e dei pulsanti 2,9:1** (soglia 3:1 per i componenti); `--empty-text` 3,29:1 su foglio. | [`controls.json`](../../../reports/client-c4/c4-8a/fase-a/controls.json), [`contrast-static.json`](../../../reports/client-c4/c4-8a/fase-a/contrast-static.json) |
| P5 | Media | Simboli sotto 3:1: **cuore della salute su plancia scura 2,32:1**; **alcol su moneta 2,5:1**; **tossicità su moneta 2,95:1**. Hanno già numero e posizione (regola 11 rispettata), ma il simbolo non si vede bene. | [`contrast-static.json`](../../../reports/client-c4/c4-8a/fase-a/contrast-static.json), [grigi](../../../reports/client-c4/c4-8a/fase-a/color-1366x768-aim-gray.jpg) |
| P6 | Media | **Ordine di Tab** non prevedibile: gli avversari vengono prima della mano o dopo a seconda della partita; in FFA servono **8–11 Tab** dall'inizio per arrivare alla prima carta della mano; la (i) si raggiunge solo dopo il menu (resta il tasto I). Le frecce non fanno nulla (solo Maiusc+frecce riordinano). | [`focus-*.json`](../../../reports/client-c4/c4-8a/fase-a/focus-ffa-1366x768.json) |
| P7 | Media | **D5 (b) non ancora fatto:** «Ultimo turno» non dice il tipo di danno (verificato in partita). | [`reduced-on-1366x768.json`](../../../reports/client-c4/c4-8a/fase-a/reduced-on-1366x768.json) |
| P8 | Media | `role=radio` e `role=tab` senza frecce e senza `tabpanel` (modalità di gioco, schede dell'hub). Tab e Invio funzionano. | [`hub-keys.json`](../../../reports/client-c4/c4-8a/fase-a/hub-keys.json) |
| P9 | Bassa | **Testo ampliato:** nessun effetto, 67 `font-size` su 67 sono in px. Lo zoom di pagina funziona (nessun overflow orizzontale né testo tagliato a 200% e con spaziatura WCAG 1.4.12 su tutte le schermate HTML). | [`shell.json`](../../../reports/client-c4/c4-8a/fase-a/shell.json) |
| P10 | Bassa | Con movimento ridotto il riepilogo breve del turno è **solo per il lettore di schermo** (effetto di O29); restano le strisce di variazioni e le carte del round. | [cattura](../../../reports/client-c4/c4-8a/fase-a/reduced-on-1366x768-after-round-0700ms.jpg) |
| P11 | Bassa | La freccia di mira (opaca, contorno INK) copre il titolo del bersaglio a 844×390 (2,23:1 su 9 px, 7 px in FFA); testo da 7 a 9 px sul compatto. | [`contrast-duel-844x390.json`](../../../reports/client-c4/c4-8a/fase-a/contrast-duel-844x390.json) |

**Proposta in breve.** CSS e piccoli cambi di focus, **senza toccare sequenza, regole, server, catalogo**: anello a due toni su tutti i controlli del tavolo (patch verificata: posti ≥ 3:1 dal 45% all'86% su ✓ × e dal 76% al 99% sui gettoni; le carte al 100%); dopo la scelta del bersaglio il focus va su ✓ e dopo il turno o l'annullamento torna sulla prima carta (dalla tastiera soltanto); mano per prima nell'ordine di Tab e frecce lungo la mano; tre token della shell ritoccati (segnaposto, bordo dei controlli, testo vuoto); bordo ai tre simboli sotto 3:1 (forma prima del colore, regola 11); riga «Danno nominale» in «Ultimo turno» (D5 b); frecce sulle radio e sulle schede; testo ampliato e testo da 7 px dichiarati limiti. O21: **ExtremelyViolentBlow osservata sul volto in partita reale (V 45 → «32»)**, resta solo POISON, che nessuna carta usa. Lettore di schermo: D12 (d), con la [scheda di prova](#scheda-di-prova-con-voiceover-dieci-minuti) se il proprietario ha dieci minuti.

**Domande al proprietario:** [11 domande numerate](#domande-al-proprietario) in fondo.

## Metodo, misure e limiti

- **Misure:** 1366×768, 844×390, 1920×1080 e 750×292 dove ha senso (focus). Tavolo vero (build di `main`, jar rifatto), server su database temporaneo, Edge via Playwright, **una sonda alla volta**. Duello (`quick/1vCom`, `open/1vCom` con mazzo sintetico) e FFA a cinque.
- **Contrasto sul disegno reale** ([`measure.mjs`](../../../reports/client-c4/c4-8a/fase-a/sonde/measure.mjs)): uno screenshot senza perdita e, per ogni testo, il rettangolo e il colore di riempimento. I testi Pixi vengono dalla scena, **servita con una copia modificata del bundle fornita da Playwright** (il prodotto non cambia: un gancio che espone la scena, che non esiste nel codice); i testi HTML dal DOM, scartando strato semantico, testo nascosto, elementi coperti da altro. Il fondo è il colore dominante dei pixel **piatti** (non bordi dei glifi né bordi antialias) sotto al testo; il rapporto è WCAG 2.x. «Tipico» è il fondo dominante, «basso» il decimo percentile (texture). Alle soglie di D12: 4,5:1 testo, 3:1 testo grande (da 24 px, o 18,66 px per Impact, tenuto per grassetto) e simboli.
- **Anello di focus:** 76 punti lungo i quattro lati del rettangolo (ruotato come la carta), campionati a 4,5 px (l'anello), 9 px (fuori) e 1,2 px (dentro) dal bordo. Si riporta la quota di punti con ≥ 3:1 rispetto ad almeno uno dei due lati.
- **Zoom al 200%:** emulato con la **dimensione CSS che dà lo zoom** (1366×768 → 683×384; 1920×1080 → 960×540). Non è lo zoom vero del browser (stessa densità di pixel). Spaziatura del testo di WCAG 1.4.12 iniettata con CSS.
- **Colori:** grigi e simulazione di deuteranopia e protanopia con le matrici di Machado (gravità 1,0), applicate con un filtro sull'intera pagina: approssimazione, non una prova.

## Analisi

### 1. Focus: controlli, visibilità, ordine

**Controlli.** Ogni controllo interattivo del tavolo è un `<button>`: i `hits` dello strato semantico (mano, carta in anteprima, personaggi, oggetti, gettoni di stato), il menu, la (i), ✓ e ×, il riquadro delle carte del round, la nota dopo un salto, e i pulsanti di finestre e pannello d'esito. **Tutti hanno un focus visibile** (`:focus-visible`, 3 px `#8cdbdd`, offset 3 px; 3 px `#38616a` nelle finestre e nella shell; 5 px dentro la metà su ✓ e ×). Le finestre sono `<dialog>` modali: il focus entra su «Chiudi», Tab ci resta, Esc chiude e il focus **torna** al pulsante di partenza (verificato: menu → «Apri menu»).

**Tab (partita da zero, un solo giro, `focus-*.json`), fermate totali compreso il menu:** duello 10 a 1366×768, 9 a 1920×1080, 12 a 844×390 e a 750×292 (con gettoni e oggetti); FFA 17 a 1366×768, 14 a 844×390. L'ordine è quello dei `hits` nella vista, cioè **l'ordine dei giocatori della vista**: in una partita gli avversari prima della mano, in un'altra il giocatore prima (a 1366 il computer, a 844 «Tu»), con i gettoni di stato in mezzo e il menu dopo la mano. La (i) di una carta appare dopo il menu: non si arriva con Tab alla (i) della carta a fuoco (resta il tasto I, citato nel testo del menu).

**Cattura.** [Carta](../../../reports/client-c4/c4-8a/fase-a/focus-duel-1366x768-t03.jpg), [personaggio](../../../reports/client-c4/c4-8a/fase-a/focus-duel-1366x768-t00.jpg), [gettone FFA 844](../../../reports/client-c4/c4-8a/fase-a/focus-ffa-844x390-t05.jpg), [750×292](../../../reports/client-c4/c4-8a/fase-a/focus-duel-750x292-t03.jpg), [1920×1080](../../../reports/client-c4/c4-8a/fase-a/focus-duel-1920x1080-t03.jpg). Sulla mano il focus **solleva** la carta (×1,15) e la contorna: due segnali oltre all'anello.

**Misura dell'anello** (come sopra, 1366×768 duello; [file](../../../reports/client-c4/c4-8a/fase-a/ring-duel-1366x768.json)):

| Controllo | Posti ≥ 3:1 (con almeno un lato) |
|---|---|
| Personaggio, oggetto | 97–100% |
| Carta della mano | 88–100% |
| Gettone di stato | 76% |
| **✓ e × (offset −5 px)** | **45%** (minimo 1,0:1) |

Il colore dell'anello è 1,11:1 sulla carta crema e 10,1:1 sul legno scuro, 5,0:1 sul legno medio. Nel caso peggiore (✓ e ×) l'anello sta dentro la metà, sulla carta in trasparenza, a 1:1.

**Opzioni**

| | Cosa | Costo | Rischio | File | Regole a rischio |
|---|---|---|---|---|---|
| **1a (prototipata, raccomandata)** | Fascia scura attorno all'anello (`box-shadow` 9 px `#140c08`, token `--focus-halo`) sui `.semantic` e sui pulsanti HTML del tavolo; su ✓ e × anello a −6 px con fascia interna scura. | S (CSS, 3 regole e 1 token) | Basso: non cambia layout. La fascia di 9 px sul gettone 31×18 lo allarga otticamente solo a fuoco. Il test dei token CSS (`style.test.ts`) richiede token: rispettato. | `style.css` | 17, 18 (nessuna misura cambia) |
| 1b | Anello bianco-crema invece di azzurro | S | Perde il legame con il colore dei bersagli; su carta crema fa lo stesso 1:1 | `style.css` | 11 |
| 1c | Nulla: solo dichiarare | 0 | P1 e P2 restano; la tastiera funziona | — | 12 |

**Dopo la patch** (stesse sonde, anteprima su 4321, [`prototipo/`](../../../reports/client-c4/c4-8a/fase-a/prototipo/)): ✓ e × **86% e 78%** (da 45%); gettoni **99–100%** (da 76%); mano, personaggi e oggetti **100%**. Cattura: [prima](../../../reports/client-c4/c4-8a/fase-a/ring-orig-confirm.jpg), [dopo](../../../reports/client-c4/c4-8a/fase-a/prototipo/ring-proto-confirm.jpg). ✓ e × restano sotto il 100% perché l'angolo e la corona del pulsante arrotondato cadono su un'altra parte della carta: per il resto serve il giudizio del proprietario sulla cattura.

**Dipende da C4-11?** Poco: l'anello è in pixel dello schermo e segue i `hits`, che con b1 crescono (×1,215 a 1920×1080) e con O28 si spostano nelle aree sicure; la fascia e l'anello restano dello stesso spessore. Se C4-11 cambiasse l'ombra delle carte o la pila compatta (a2) andrebbero solo rivisti a occhio.

### 2. Partita da sola tastiera

**Cosa si può fare oggi** (verificato, duello a 1366×768 e FFA, ripetuto con Spazio al posto di Invio):

| Passo | Come | Esito |
|---|---|---|
| Scegliere la carta | Tab alla carta, Invio o Spazio | Funziona; `aria-pressed` e anteprima |
| Scegliere il bersaglio | Tab al personaggio o all'oggetto, Invio | Funziona; un bersaglio non ammesso annulla (come col mouse) |
| Scartare (carta legata) | Tab a una regolare, Invio | Funziona (scarti riusciti in tutte le partite: 10, 7, 4 e 3) |
| Confermare | Tab a «Conferma calata», Invio | Funziona; **6 Tab dal bersaglio** (6–12 a seconda del turno) |
| Annullare | «Annulla calata» (Invio) oppure Esc | Funziona; **dopo il pulsante il focus va a nulla**; dopo Esc resta sul bersaglio |
| Uscire | menu → «Abbandona la partita» → «Sì, abbandona» (10 + 6 + 1 Tab) | Funziona fino all'hub; il focus non è su nulla ([`leave.json`](../../../reports/client-c4/c4-8a/fase-a/leave.json)) |
| Ispezionare | I sulla carta o sul personaggio; Esc chiude e il focus torna | Funziona |
| Esito e nuova partita | Tab (1) su «Nuova partita», Invio | Funziona (2 partite su 2: ho perso, il pannello e la nuova partita sono gli stessi in caso di vittoria) |
| Riordinare la mano | Maiusc+frecce | Funziona |

**Dove si blocca o si perde.** Mai in modo definitivo. **Cosa manca:** (a) il focus si perde dopo ogni turno e dopo «Annulla» (P3); (b) ✓ è **6 Tab** lontano dal bersaglio, e in FFA la mano è lontana (8–11 Tab dall'inizio); (c) le frecce non muovono lungo la mano; (d) la (i) non è nell'ordine naturale. Con movimento normale (sequenza in corso) ogni tasto la porta a termine (`reason: input`, regola 4), come col mouse: **non cambia nulla** rispetto a oggi.

**Opzioni (cumulabili)**

| | Cosa | Costo | Rischio | File | Regole a rischio |
|---|---|---|---|---|---|
| **2a (prototipata)** | Dopo la scelta del bersaglio (e dello scarto, se serve) **il focus va su «Conferma»**, solo se l'ultimo input era da tastiera: Invio conferma, Esc annulla (già così). | S | Basso: non cambia stato né invii. Un focus programmatico non invia nulla. | `table.tsx` | **1–9** (la sequenza non tocca; prova: 4 turni con movimento normale, `ends` identici), 12 |
| **2b (prototipata)** | Al nuovo turno o dopo l'annullamento, **se il focus è perso e l'ultimo input era da tastiera**, la prima carta della mano prende il focus. | S | Medio: il focus solleva la carta (×1,15) e disegna l'alone; durante una sequenza lo fa mentre la scena gira. Provato: nessuna interruzione, nessun `end` in più. Da rivedere in Fase B con `VerifyResolution` e `VerifyAim`. | `table.tsx` | **1–9**, 11 |
| **2c (prototipata)** | **Mano per prima nell'ordine di Tab** (ordinamento stabile dello strato semantico, solo DOM); frecce sinistra/destra lungo la mano. | S | Basso: i `hits` e le misure non cambiano; l'ordine visivo non è l'ordine di Tab. `table.key` già gestisce Maiusc+frecce. | `table.tsx`, `scene.ts` | 17 |
| 2d | La (i) raggiungibile con Tab subito dopo la carta a fuoco | M | Medio: la (i) è un elemento posizionato che appare e sparisce con l'hover | `table.tsx`, `style.css` | 12 |
| 2e | Nulla: dichiarare i limiti | 0 | — | — | 12 |

Con la patch (2a+2b+2c), provata in duello (movimento ridotto 3 turni e normale 4 turni): **focus perso 0 volte** (era una per turno), focus su ✓ subito dopo il bersaglio, dopo «Annulla» e dopo Esc sulla prima carta ([`prototipo/kbd-*.json`](../../../reports/client-c4/c4-8a/fase-a/prototipo/)). I numeri di Tab riportati dalla sonda per il prototipo (15–16) sono un artefatto: la sonda cerca «Conferma» con Tab mentre il focus c'è già.

**Dipende da C4-11?** Sì su un punto: con a2 (pila compatta) l'etichetta della pila (autore e conteggio) non è nello strato semantico, solo nel riquadro «Carte del round: apri Ultimo turno» (vedi punto 7). b1 e O28 non cambiano nulla: lo strato semantico segue i `hits`.

**Verifica nuova (Fase B, solo disegno).** Uno scenario **`keyboard`** di `VerifyAim` o una `VerifyKeyboard` nuova: partita intera da sola tastiera in duello e FFA (almeno 6 turni, movimento ridotto) più 3 turni a movimento normale; per ogni turno controlla: la mossa parte con un solo invio, il focus non è mai su `document.body` mentre si può scegliere, l'ordine di Tab ha la mano per prima, l'anello ha ≥ 90% di punti con 3:1 (funzione di misura riusabile da [`p5-ring.mjs`](../../../reports/client-c4/c4-8a/fase-a/sonde/p5-ring.mjs)).

### 3. Contrasto (D12: WCAG 2.2 AA come obiettivo)

**Testi sul disegno reale.** Cinque configurazioni × più stati del tavolo (inizio, carta scelta, bersaglio scelto o scarto, finestre menu, «Ultimo turno», ispezioni carta e personaggio) + pannello d'esito: da 30 a 49 coppie uniche di testo e fondo per configurazione ([`contrast-*.json`](../../../reports/client-c4/c4-8a/fase-a/)). **Nessuna coppia di testo reale sotto la soglia.** Minimi tipici: crema su colore del ruolo «RISORSE» **5,75:1** (15,9 px), crema su «OGGETTI» 5,81:1, la (i) 5,8:1, testo del server 6,55:1, titoli del report 6,79:1; testo scuro sulla carta 9,5–10,7:1; numeri chiari sulla plancia 14,8:1 sul fondo scuro. Gli unici valori sotto soglia sono artefatti dichiarati: «Salta effetti» (fuori dallo scorrimento della finestra) e il titolo del bersaglio coperto dalla **freccia di mira** (P11), che è un'occlusione, non un contrasto.

**Simboli e componenti** (accoppiamenti piatti, calcolati dalle costanti del disegno; [`contrast-static.json`](../../../reports/client-c4/c4-8a/fase-a/contrast-static.json), 62 coppie, 12 sotto soglia):

| Accoppiamento | Rapporto | Soglia | Proposta (prima forma o bordo, poi colore: regola 11) |
|---|---:|---:|---|
| Cuore (salute `#a3313d`) su plancia scura | **2,32** | 3 | Contorno chiaro 1 px attorno al glifo sulla plancia |
| Alcol `#c98d1f` su moneta/pillola | **2,50** | 3 | Contorno scuro (INK) 1 px |
| Tossicità `#78962c` su moneta/pillola | **2,95** | 3 | Contorno scuro (INK) 1 px |
| Accenti del danno (giallo, azzurro, verde chiaro) su pillola | 1,16–1,39 | — | **Decorativi**: il simbolo si riconosce dal colore principale e dalla forma (esplosione, coltello, goccia): eccezione dichiarata |
| Anello di focus azzurro su carta/moneta | 1,11 / 1,37 | 3 | Vedi punto 1 (fascia scura) |
| Alone dei bersagli ammessi (petrolio `#6eafaf`) su carta | 1,76 | 3 | Sta sempre sul legno (6,4:1 sul legno scuro, 3,2:1 sul legno medio); sulla carta c'è già l'anello e la freccia; eccezione dichiarata |
| Bordo dei campi e dei pulsanti della shell | **2,90** | 3 | `--border-panel` `#9b7652` → `#936f4d` (3,2:1 sul foglio) |
| Segnaposto (misurato) | **3,93** | 4,5 | Colore `--placeholder` `#6b5443` (5,0:1) |
| `--empty-text` su foglio | **3,29** | 4,5 | `#6f5744` (4,74:1) |

Tutte le altre coppie (testo crema su colore di ruolo e sui fondi dei gettoni, glifi di ruolo sul colore, risorse sulla plancia salvo la salute, danni su pillola, freccia contro il suo contorno) passano.

**Cosa la misura automatica non vede.** (a) Le **illustrazioni** (le carte e le pillole che stanno sull'arte: la misura campiona solo ciò che sta sotto il testo, e sotto il testo c'è sempre un fondo pieno); (b) la **texture del legno** sotto il testo di HTML al tavolo (orologio, «T1»: tipico 12,4:1, basso 3,1:1); (c) le **scritte durante la sequenza** (stampigli ANNULLATA/ELIMINATO, etichette delle variazioni, primi piani): non misurate, si vedono in movimento; (d) il **disegno sotto filtri** (un `AlphaFilter` sullo strato delle frecce); (e) la percezione del testo da 7–9 px sul compatto, che il rapporto di contrasto non giudica.

**Opzioni**

| | Cosa | Costo | Rischio | File | Regole a rischio |
|---|---|---|---|---|---|
| **3a (CSS prototipato)** | Tre token della shell (`--border-panel`, `--empty-text`, `--placeholder`). Misurato in anteprima: **nessun campo o pulsante sotto soglia** | S | Basso: i bordi diventano un poco più scuri | `style.css` | 11 |
| **3b (non prototipata)** | Contorno di 1 px ai tre simboli (cuore su plancia, alcol e tossicità su moneta) in `glyph()` di `scene.ts` e in `SvgMark` della shell (stessi `symbols.ts`: **due disegni**) | M | Medio: lo stesso simbolo si disegna in Pixi e in SVG (C4-3, test `symbols.test.ts`); un contorno cambia le impronte dei test di forma e il costo in texture non cambia | `symbols.ts`, `scene.ts`, `ui.tsx`, test | 11, 16 |
| 3c | Colore più chiaro per la salute su fondo scuro invece del contorno | S | Cambia un colore approvato (C3-7); la regola 11 chiede prima forma o bordo | `readability.ts` (`RES_COLOR`) | 11, 16 |
| 3d | Nulla: elencare le tre eccezioni | 0 | Il simbolo ha sempre il numero accanto | — | — |

**Dipende da C4-11?** L'ombra più profonda e morbida e la pila compatta non toccano i colori. Con b1 (carte ×1,215) i testi crescono: il minimo misurato (5,75:1) non cambia.

**Verifica nuova (Fase B).** Un test unitario `contrast.test.ts` che calcola il rapporto di ogni coppia di colori **dalle costanti** (`RES_COLOR`, `ROLE_COLOR`, `DAMAGE_COLOR`, `INK`, `PAPER`, token CSS) e fallisce sotto soglia, con un **elenco di eccezioni dichiarate** (accenti del danno, alone sulla carta). Per il disegno reale una funzione `window.__bm.texts()` (rettangolo e colore di ogni testo disegnato) permetterebbe la misura senza il bundle modificato: la scrive la Fase B di C4-8a, la usano `Verify` e `VerifyLayout` come controllo, la sonda di questa Fase resta nel repository come riferimento.

### 4. Zoom al 200% e testo ampliato (schermate HTML)

**Zoom di pagina.** Alle dimensioni che dà il 200% (683×384, 960×540, e a 100% 1366×768 e 844×390): home, regole, accedi, registrati, hub, collezione, editor del mazzo, profilo, menu del tavolo. **Nessun overflow orizzontale, nessun elemento fuori dalla finestra, nessun testo tagliato, nessun controllo sotto 44 px**, anche con la spaziatura del testo di WCAG 1.4.12 (interlinea 1,5, lettere 0,12 em, parole 0,16 em, paragrafi 2 em) ([`shell.json`](../../../reports/client-c4/c4-8a/fase-a/shell.json), [catture a 683×384](../../../reports/client-c4/c4-8a/fase-a/shell-683x384-hub.jpg)). Il foglio scorre in verticale; il menu del tavolo scorre dentro la finestra.

**Il tavolo a quelle dimensioni.** A 960×540 (200% su 1920×1080) e a 683×384 (200% su 1366×768, **sotto il minimo garantito di 844×390**, D6) il tavolo **regge**: duello e FFA si disegnano nel layout compatto, tutti i `hits` sono nello schermo salvo le due carte dei bordi della mano (rotazione), e la finestra del menu scorre ([cattura FFA 683×384](../../../reports/client-c4/c4-8a/fase-a/zoom-ffa-683x384.jpg), [`zoom-table.json`](../../../reports/client-c4/c4-8a/fase-a/zoom-table.json)). Il testo è piccolo (7–9 px nelle carte compatte).

**Testo ampliato (impostazione «dimensione del testo» del browser o del sistema).** **Non ha effetto**: tutte le 67 dichiarazioni `font-size` di `style.css` sono in px; `index.html` non dichiara dimensioni e il testo di Pixi è in px. Con lo zoom di pagina il testo si ingrandisce; con la sola dimensione di base no.

**Opzioni**

| | Cosa | Costo | Rischio | File | Regole a rischio |
|---|---|---|---|---|---|
| **4a (raccomandata)** | Dichiarare il limite: lo zoom di pagina soddisfa il «ridimensiona testo» (1.4.4); la dimensione di base del sistema non è seguita | 0 | Nessuno; è la copertura che D12 chiede | — | — |
| 4b | Convertire i 67 `font-size` in `rem` (la shell; il tavolo resta in px perché è un canvas) | L | Alto: tutte le schermate, ogni misura di `VerifyPublic`, `VerifyProfile`, `VerifyDecks`, `VerifyModes`; il test dei token | `style.css`, test | 17 |

**Dipende da C4-11?** No (la shell non cambia).

### 5. Movimento ridotto su tutte le animazioni

**Inventario delle animazioni** (da `style.css` e `scene.ts`) **e stato con `prefers-reduced-motion: reduce`:**

| Animazione | Origine | Con movimento ridotto |
|---|---|---|
| Sequenza del round (voli, primi piani, impatti, stampigli, scossone) | C3-4/C3-5 | **Non parte** (`plays` falso): il round compare nello stato finale con le variazioni |
| Onda sulla mano, pulsazione dei bersagli e delle carte, crescita di autore e bersaglio, tremito al colpo (C4-10 «Richiamo») | `guideMotion` | `{pose:{},shake:0}`: **nessun movimento** |
| ✓ che pulsa | CSS `guide-pulse` | `animation: none` |
| Suggerimento «Scegli una carta» che pulsa (`ask`) | CSS | Bagliore fisso |
| Pulsazione delle frecce di mira | `tick` | Alpha 1 fisso |
| Impatto e scossone del personaggio colpito | `impactMotion`, `shakes` | Nessuna rotazione, nessun salto, nessun scossone (e comunque il round non parte) |
| C4-11: **pila delle carte del round**, **ombra**, **crescita (b1)** | `CARD_SHADOW`, `growth`, pila a2 | **Statici per costruzione** (sono disegni, non animazioni) |
| Transizioni CSS | — | **Non ce ne sono** (nessuna `transition` in `style.css`) |

Cambiando l'impostazione a partita in corso (`matchMedia` `change`) la scena si interrompe e ridisegna senza animazioni (`interrupt('reduced motion')`).

**Stessa informazione (regola 5).** Provato in partita reale, 4 turni, movimento ridotto ([`reduced-on-1366x768.json`](../../../reports/client-c4/c4-8a/fase-a/reduced-on-1366x768.json), [cattura a 0,7 s](../../../reports/client-c4/c4-8a/fase-a/reduced-on-1366x768-after-round-0700ms.jpg)): nessuna sequenza (`running: false`), le **carte del round** restano al centro, le **strisce di variazione** accanto alle plance (−15, +5, +10…), le plance aggiornate e «Ultimo turno» completo. **Cambia una cosa, introdotta da C4-10 O29:** il **riepilogo breve** («Turno 1: tu → …») non si disegna più (testo solo per il lettore di schermo, `data-testid=brief`, classe `sr-only`), mentre prima restava 6 s sullo schermo. Con movimento normale lo sostituisce la sequenza, con movimento ridotto non c'è nulla che lo sostituisca se non le strisce e le carte. L'informazione c'è, ma per sapere che cosa ha fatto ogni carta (e dopo D5 b che tipo di danno) bisogna aprire «Ultimo turno».

**Opzioni**

| | Cosa | Costo | Rischio | File | Regole a rischio |
|---|---|---|---|---|---|
| **5a (raccomandata)** | Lasciare: strisce e carte del round bastano a vedere cosa è cambiato; D5 (b) aggiunge il tipo di danno nel report; il proprietario giudica la cattura | 0 | Contraddice O29 se si riapre | — | 5 |
| 5b | Con movimento ridotto soltanto, mostrare di nuovo il riepilogo breve (6 s) | S | Riapre una scelta del proprietario (O29, «Niente, solo tolto»); un riquadro in più dove manca spazio sul compatto | `readability.ts` (`shortSummary`), `table.tsx` | 5, 16, 17 |
| 5c | Segno statico sul bersaglio (D5 a, già scartata) | — | Scartata dal proprietario il 6 novembre | — | — |

**Dipende da C4-11?** No: pila, ombra e crescita sono statiche. Se il proprietario cambiasse a2 (pila) il testo per il lettore di schermo andrebbe verificato di nuovo.

**Verifica nuova.** `VerifyResolution` ha già lo scenario `reduced`. Da aggiungere: dopo ogni round a movimento ridotto, `guide.moved === 0` e `guide.shake === 0`, nessun nodo spostato rispetto al riposo, `shortSummary` coerente con la scelta di 5a o 5b.

### 6. Simboli oltre al colore (regola 11)

Controllo per ispezione del codice e delle catture in grigi e in due simulazioni di daltonismo ([grigi](../../../reports/client-c4/c4-8a/fase-a/color-1366x768-aim-gray.jpg), [deuteranopia](../../../reports/client-c4/c4-8a/fase-a/color-1366x768-aim-deut.jpg), protanopia, a 1366×768 e 844×390, in `color-*`). **Nessuna informazione trovata che passi solo dal colore:**

| Informazione | Segno oltre al colore |
|---|---|
| Risorsa | Simbolo proprio + numero + posizione fissa della riga |
| Danno | Forma (esplosione, coltello, goccia) + numero (+ parola nell'ispezione) |
| Ruolo | Parola + glifo + forma del timbro; senza ruolo: timbro vuoto |
| Tipologia | Cornice per forma + parola (`subtype`) |
| Non pagabile | Carta più spenta + «!» sul costo + «risorse insufficienti» nell'etichetta |
| Bersaglio ammesso | Alone + freccia (forma) + hint «Scegli il bersaglio sul tavolo» |
| Bersaglio scelto | Freccia verso di lui + ✓ ×; l'alone cambia colore (crema) ma c'è la freccia |
| Carta scelta / a fuoco | Sollevata e ingrandita + alone |
| Stati del personaggio | Forma del gettone + testo breve + testo esteso nell'etichetta |
| Valore negativo | Segno meno + numero |
| Pulsanti non attivi | Bordo tratteggiato (forma) |
| Esito, errori | Testo (`role="alert"`) |
| Scheda o modalità scelta (hub) | Fondo azzurro e bordo più marcato: **da giudicare sulla cattura in grigi** ([hub](../../../reports/client-c4/c4-8a/fase-a/color-1366x768-hub-gray.jpg)) |

**Aperto:** nei grigi il **cuore della salute** si distingue poco dal fondo (P5) ed è l'unico simbolo dove la forma da sola non basta; l'alone delle carte non adatte alla scelta (legate, che aspettano lo scarto) è un cambio di opacità. **Da giudicare dal proprietario** (regola 11: «cattura in scala di grigi giudicata dal proprietario»).

**Dipende da C4-11?** No.

### 7. Etichette accessibili dello strato semantico

Albero di accessibilità del tavolo prima, dopo la scelta, dopo il bersaglio e dopo il round, duello 1366×768 e 844×390, FFA 844×390 ([`color-aria.json`](../../../reports/client-c4/c4-8a/fase-a/color-aria.json)). **Seguono le cornici e i volti:** ogni carta dice nome, tipologia (`AZIONE BASE/LEGATA/REGOLARE`), ruolo, costo, **danno col tipo e l'importo** («danno colpo 13» con la V reale), guadagno, priorità, copia, «risorse insufficienti» e «non scartabile» quando conta; i personaggi dicono nome, salute e risorse; i gettoni dicono titolo e spiegazione. Cambia con lo stato (carta in anteprima `[pressed]`, «Seleziona una carta regolare da scartare», «Conferma calata [disabled]»). Il riepilogo del turno è una regione `status` («Turno 1: tu → …»).

**Mancano:** (a) il **numero di carte dei mazzi e degli scarti** (pile) non è letto nello strato; (b) la **pila compatta** di C4-11 (autore in cima, conteggio, segno dell'annullata) non ha etichetta: sul tavolo compatto il riquadro è «Carte del round: apri Ultimo turno» senza dire quante né di chi; (c) il numero di carte in mano degli avversari (dorsi) non è letto (solo nell'ispezione).

**Opzioni**

| | Cosa | Costo | Rischio | File |
|---|---|---|---|---|
| **7a** | L'etichetta del riquadro del round dice autore e numero delle carte mostrate («Carte del round: 2, in cima ‹carta›, di ‹giocatore›; apri Ultimo turno») e l'etichetta del personaggio aggiunge «mazzo N carte» (dati già nella vista) | S | Basso: solo testo; tocca l'etichetta del personaggio, che qualche test confronta | `table.tsx`, `scene.ts`, test |
| 7b | Nulla: dichiarare | 0 | Il lettore non sa quante carte restano | — |

**Dipende da C4-11?** Sì: l'etichetta della pila segue a2. Se il proprietario togliesse o cambiasse a2, 7a cambierebbe di conseguenza. Se è la cascata di C3-L, resta «Carte del round» senza conteggio.

### 8. O21 e D5

**ExtremelyViolentBlow con la V reale sul volto: osservata.** Come provocarlo: mazzo sintetico entro R02 1.12 (20 regolari, al massimo 2 copie, basic e due legate del personaggio, ultima risorsa; è il mazzo «C3 contrasti» di `verify-resolution.mjs` con due copie di `bruiser.ExtremelyViolentBlow`, salvato con l'editor) in `open/1vCom`, giocando un turno dopo l'altro (sonda [`p7-blow.mjs`](../../../reports/client-c4/c4-8a/fase-a/sonde/p7-blow.mjs)). Alla mano di turno 8 la carta compare con **V = 45**: la pillola in basso a destra dice **«32»** (= 20 + trunc((45 − 20)/2), formula di R07a/`damageText`) e l'ispezione, aperta da tastiera, dice «**colpo 32**. Quello inflitto può differire: stati e difese». Nel catalogo e per le carte di altri turni, dove la V non è nota, la pillola dice «20+» (coperto dai test unitari). Evidenze: [volto](../../../reports/client-c4/c4-8a/fase-a/blow-face-zoom-turn8.jpg), [ispezione](../../../reports/client-c4/c4-8a/fase-a/blow-inspection.jpg), [`blow.json`](../../../reports/client-c4/c4-8a/fase-a/blow.json). **O21, punto Blow: chiudibile.** La carta non è stata giocata fino alla risoluzione (il danno inflitto non è oggetto di O21).

**D5 (b): tipo di danno in «Ultimo turno».** Provato: le righe di una mossa nel report sono costo nominale, guadagno nominale, oggetto, scarto; **nessuna riga di danno** (`roundReport`, `resolution.ts`, nessun gancio per il catalogo oltre a `costOf` e `gainsOf`).

| | Cosa | Costo | Rischio | File | Regole |
|---|---|---|---|---|---|
| **8a** | Una riga «**Danno nominale:** colpo 15.» (tipo + importo nominale come in `damageLabel`; «20+» per le carte con x, e la V si dichiara: «colpo 20+ (più metà della V residua di chi gioca)») con un gancio `damageOf` nel contesto di `roundReport`, come `gainsOf` | S | Medio: **cambiano gli attesi** del test del report (`resolution.test.ts`) e i controlli di frase di `VerifyResolution report`; D5 (b) è la decisione registrata che lo autorizza (regola 16) | `resolution.ts`, `table.tsx`, `resolution.test.ts`, `verify-resolution.mjs` (C4-1c) | 16, 5 |

**Dipende da C4-11?** No. **Verifica nuova:** nel test `roundReport`, per ogni carta del catalogo con danno, la riga c'è e coincide con `damageLabel`; in `VerifyResolution report`, ogni mossa con carta di danno ha la riga.

**Gli altri residui di O21 e cosa resta** ([roadmap](../../../client-roadmap.md)):

| Residuo | Stato | Cosa resta |
|---|---|---|
| POISON | Simbolo e impatto solo in unità; **nessuna carta del Set Base ha POISON come danno** (`MarvelousCocktail` lo infligge con il timer, senza importo R07a) | Resta **dichiarato**: si chiude quando una carta di un set lo usa. Non si può provare in partita oggi |
| ExtremelyViolentBlow, V reale | **Osservato** (V 45 → 32) | Chiudibile |
| Carte piccole del round (36–40 px): solo il simbolo | Invariato; l'importo è nell'ispezione; con a2 la pila compatta mostra una carta | Nessuna azione |
| Movimento ridotto: segno statico sul bersaglio | **D5 (b):** niente segno, tipo nel report | Fase B: 8a sopra |
| Controllo delle scritte a 844×390 in FFA (`LABEL.read`) | Il guasto di C3-6 non si è riprodotto; soglia invariata | Nessuna azione in 8a; resta una verifica della matrice finale |

### 9. Consegne aperte dal Set Base a C4

Elenco in [orchestrazione, «Allineamento fra le macchine»](../../../orchestrazione-lavoro.md#allineamento-fra-le-macchine).

1. **Strumenti di verifica cambiati dal Set Base** (mazzi sintetici entro R02 1.12; pagina pubblica 1.13 e Set Base 0.1; `check-rules.py`; CLI): **toccano C4-8a.** Il mazzo sintetico di Blow esiste già in `verify-resolution.mjs` («C3 contrasti», valido per R02 1.12: il server lo ha accettato nella mia sonda con lo stesso contenuto); la Fase B aggiunge, in quello scenario `open`, il **controllo del volto con la V reale** (testo della pillola = `20 + trunc((V − 20)/2)`) senza mazzi nuovi. `VerifyPublic` e `VerifyDecks` sono nella riga di C4-8a della matrice: si eseguono sul codice finale. **Gli strumenti li tocca C4-1c** (Fase B su un'altra macchina): la Fase B di C4-8a si coordina con quel rapporto prima di toccare `verify-resolution.mjs`.
2. **`client-web/tests/readability.test.ts`**, una riga cambiata da SB-2 (Q8): **non è toccata da questa proposta** salvo 3b (contorno ai simboli) o 5b (`shortSummary`); in quel caso il pull può avere un conflitto di una riga. La consegna si toglie dalla sezione nel commit che la chiude (Fase B).

## Prototipo (patch)

[`prototipo.patch`](prototipo.patch): 7,8 KB, tre file (`style.css`, `table.tsx`, `scene.ts`), **`git apply --check` verde su `main` a `ac1e885`**. Il prodotto del repository **non è stato toccato** (stato pulito salvo i file della Fase A); il prototipo è stato costruito e provato in una copia fuori dal repository (`%TEMP%\c48a-proto`, anteprima su 4321, stesso server temporaneo). Contiene:

- **1a e 3a (CSS):** fascia scura del focus (`--focus-halo`), ✓ e × con anello a −6 px e fascia interna, `--border-panel`, `--empty-text`, `--placeholder`.
- **2a, 2b, 2c (TS):** modalità tastiera (ultimo input da tastiera), focus su «Conferma» dopo il bersaglio, focus sulla prima carta quando il focus è perso (turno nuovo, annullamento), mano per prima nello strato semantico, frecce lungo la mano.
- **Non contiene** 3b, 7a, 8a, le frecce di radio e schede, né la funzione `texts()`.

**Cosa è stato provato sul prototipo:** `tsc --noEmit` verde, **307 test su 307** (la suite del client sulla copia, che richiede i file di `docs/`), build, e le sonde contro l'anteprima: anello (✓ × 45% → 86% e 78%; gettoni 76% → 99–100%), partita da tastiera (focus perso 0 volte, focus su ✓ dopo il bersaglio, dopo l'annullamento e dopo Esc sulla prima carta; con movimento normale la sequenza si interrompe solo con il tasto, come prima), campi e pulsanti della shell (nessuno sotto soglia). **Non provato:** `VerifyAim`, `VerifyResolution`, `VerifyLayout`, le misure di input e fotogrammi, Safari, la prova umana. In Fase B i giri mirati di D16 sono quelli sotto.

## Verifiche e scenari da aggiungere in Fase B (solo il disegno; gli strumenti li tocca C4-1c)

Con D16, per C4-8a: `Verify` (duello e FFA da tastiera sul codice finale), `VerifyDecks`, `VerifyPublic`, `VerifyAim` (`reduced`, `touch`), `VerifyResolution` (`reduced`, `interrupt`, `report`, `open`), e a 750×292 la regola 18 (`BASE_750` invariato; `layoutProblems` che possono solo scendere). `VerifyLayout` solo se si toccano misure. Il resto alla matrice di fine C4.

| Scenario nuovo | Dove | Cosa controlla |
|---|---|---|
| Partita da tastiera | `VerifyAim` (`keyboard`) o nuova `VerifyKeyboard` | Duello e FFA: scelta, bersaglio, scarto, conferma, annullamento, esito, nuova partita; il focus non è mai perso mentre si può scegliere; mano prima nell'ordine; anello con ≥ 90% di punti a 3:1 |
| Contrasto dalle costanti | `tests/contrast.test.ts` (unitario) | Ogni coppia di colori del disegno sopra la soglia, con elenco di eccezioni dichiarate |
| Contrasto sul disegno | `window.__bm.texts()` + controllo in `Verify` | Ogni testo Pixi a ≥ 4,5:1 (≥ 3:1 se grande) sui pixel reali |
| Movimento ridotto | `VerifyResolution reduced` | `guide.moved === 0`, nessuno scossone, stesse strisce e carte del round |
| D5 (b) | `roundReport` (test) e `VerifyResolution report` | Riga «Danno nominale» per ogni mossa con danno |
| Blow con V reale | `VerifyResolution open` | Pillola = `20 + trunc((V−20)/2)` a ogni turno in cui la carta è in mano |
| Radio e schede | `VerifyPublic`/`VerifyDecks` | Le frecce spostano la selezione, Tab entra una volta nel gruppo |

Ogni modifica ai test unitari che cambia un atteso (solo 8a) si dichiara con la decisione che lo autorizza (D5 b).

## Scheda di prova con VoiceOver (dieci minuti)

D12 (d): **«dichiarato non provato»**, salvo che il proprietario faccia questa prova. Non è automatizzabile qui. Su Mac, Safari, con VoiceOver (Cmd+F5); oppure iPhone con VoiceOver (tre tocchi sul tasto laterale) in orizzontale. Si annota: **va bene / non va / non chiaro**.

| # | Passo | Cosa dovresti sentire | Esito |
|---|---|---|---|
| 1 | Accedi e apri l'hub. Passa fra le schede e le modalità | Nome delle schede («Gioca, selezionata»), delle modalità («Contro il computer, selezionata») | |
| 2 | Avvia «Contro il computer» | «Tavolo di Botte Micidiali»; la frase «Scegli una carta» | |
| 3 | Passa fra gli elementi del tavolo (VO+freccia destra) | Ogni carta: nome, tipologia, ruolo, costo, danno, guadagno; ogni personaggio: nome, salute, risorse. **Domanda: le etichette sono troppo lunghe? L'ordine ha senso?** | |
| 4 | Scegli una carta (VO+Spazio), poi un bersaglio | «Scegli il bersaglio sul tavolo», poi «Controlla la calata e conferma» | |
| 5 | Trova «Conferma calata» e attivala | Un solo annuncio; la mossa parte | |
| 6 | Aspetta il turno | «Turno 1: tu → … · Computer → …» (una volta, non due) | |
| 7 | Apri il menu → «Ultimo turno» | Elenco delle mosse, con costi e guadagni (e, se si fa D5 b, il danno) | |
| 8 | Riprendi a giocare; **chiedi: dove sono finito dopo il turno?** | Il focus dovrebbe tornare da qualche parte utile | |
| 9 | Finisci la partita o abbandona | Il titolo dell'esito e «Nuova partita» | |
| 10 | Note libere | Annunci doppi, silenzi, cose non dette (mazzo, carte in mano degli avversari) | |

## Domande al proprietario

Raccomandazioni in grassetto. Una domanda senza risposta non viene eseguita in Fase B.

1. **Anello di focus a due toni (1a): sì o no?** **Sì**, come nella patch: fascia scura attorno all'anello su tavolo e ✓ ×. Se preferisci un altro aspetto (bianco, più spesso) si cambia in un punto solo.
2. **Focus da tastiera (2a, 2b, 2c): tutti e tre?** **Sì**: ✓ prende il focus dopo il bersaglio, la mano torna a fuoco dopo il turno o l'annullamento, la mano è prima nell'ordine di Tab e le frecce la percorrono. Valgono solo se l'ultimo input era la tastiera. La **2d** (la (i) in ordine) **no**: resta il tasto I.
3. **Simboli sotto 3:1 (3b contorno, 3c colore più chiaro, 3d nulla):** **3b**, contorno di 1 px su cuore, alcol e tossicità; costa di più perché i simboli sono disegnati due volte (Pixi e SVG). Se vuoi risparmiare, **3d** con le tre eccezioni elencate (hanno già il numero accanto).
4. **Token della shell (3a: segnaposto, bordo, testo vuoto): sì?** **Sì**, sono tre colori un poco più scuri; guarda la [schermata del profilo o del registrati](../../../reports/client-c4/c4-8a/fase-a/shell-683x384-editor.jpg).
5. **Movimento ridotto: 5a (lasciare così, con il tipo di danno nel report) o 5b (riportare il riepilogo breve solo per chi ha il movimento ridotto)?** **5a**: strisce e carte del round restano a vista; 5b riapre una tua scelta (O29). Giudica la [cattura](../../../reports/client-c4/c4-8a/fase-a/reduced-on-1366x768-after-round-0700ms.jpg).
6. **D5 (b), formato della riga:** «Danno nominale: colpo 15.» e, per le carte con x, «Danno nominale: colpo 20+ (più metà della V residua di chi gioca).» **Va bene?** Cambia gli attesi del test del report: lo autorizza D5 (b).
7. **Testo ampliato (4a o 4b):** **4a**, dichiararlo: lo zoom di pagina (200% e oltre) funziona su ogni schermata HTML, la dimensione di base del sistema no. 4b è un blocco intero (67 dichiarazioni, tutte le schermate) e va in C5 se serve.
8. **Frecce sulle radio e sulle schede dell'hub (P8): sì?** **Sì**, è piccolo (hub, collezione) e porta il comportamento al modello ARIA; solo Tab e Invio non cambiano.
9. **Etichette del lettore (7a: numero di carte del round e del mazzo): sì?** **Sì**, solo testo; **se cambi la pila compatta (a2) di C4-11, andrà rivisto**.
10. **Freccia di mira sopra il titolo del bersaglio a 844×390 (P11) e testo da 7–9 px sul compatto: eccezione dichiarata?** **Sì**, dichiarata: sono un effetto di D6 (844×390 come minimo) e di a2/a3 di C4-11; cambiarli significa toccare geometria (regole 17 e 18).
11. **VoiceOver:** hai dieci minuti per la [scheda](#scheda-di-prova-con-voiceover-dieci-minuti)? **Se sì, prima della Fase B**, così le correzioni vedono i risultati; **altrimenti D12 (d): dichiarato non provato**. (E O21: **chiudere il punto di ExtremelyViolentBlow**, lasciare POISON dichiarato.)

## Scelta del proprietario

10 novembre 2026, alla regia, parole del proprietario: **«Tutte raccomandate»**. Valgono quindi le raccomandazioni in grassetto delle
undici domande:

1. Anello di focus a due toni (1a), come nella patch.
2. 2a, 2b e 2c sì (✓ a fuoco dopo il bersaglio, mano a fuoco dopo il turno o l'annullamento, mano prima nell'ordine e frecce lungo
   la mano), solo se l'ultimo input era la tastiera; 2d no (resta il tasto I).
3. 3b: contorno di 1 px su cuore, alcol e tossicità.
4. 3a: i tre token della shell (segnaposto, bordo dei controlli, testo vuoto).
5. 5a: movimento ridotto com'è, con il tipo di danno nel report.
6. D5 (b) nel formato «Danno nominale: colpo 15.» e, per le carte con x, «Danno nominale: colpo 20+ (più metà della V residua di chi
   gioca).»; l'atteso del test del report cambia per D5 (b).
7. 4a: il testo ampliato di sistema si dichiara come limite (lo zoom di pagina funziona).
8. Frecce sulle radio e sulle schede dell'hub (P8).
9. 7a: etichette del lettore con il numero di carte del round e del mazzo.
10. P11 e testo da 7–9 px sul compatto: eccezione dichiarata.
11. VoiceOver: D12 (d), dichiarato non provato, salvo una prova del proprietario con la scheda; O21: chiuso il punto di
    ExtremelyViolentBlow, POISON resta dichiarato.

## Relazione della Fase A

**Cosa ho fatto.** Preliminare: albero pulito, `git fetch`, `main` indietro di due commit (C4-1c Fase A, rapporto O20): pull con fast-forward; poiché sono cambiati `server/` (e un test) ho rifatto il jar (`BUILD SUCCESS`), `check-rules.py` verde, porte 8080 e 4320 libere (c'era un processo `node.exe` preesistente che non ascoltava su quelle porte, non toccato). Lette: orchestrazione (insidie, allineamento, consegne), piano C4 (regole 1–18, D5, D12, D16, C4-8a, matrice, C4-10, C4-11), roadmap (O21), rapporto (C4-10 e C4-11), `game-rules.md` (partita da tastiera), `CONTRIBUTING.md`, README del client, `table.tsx`, `ui.tsx`, parti di `scene.ts` e `readability.ts`, `style.css` (token, focus, animazioni), `hub.tsx`, `collection.tsx`, `resolution.ts` (`roundReport`).

**Sonde** ([`sonde/`](../../../reports/client-c4/c4-8a/fase-a/sonde/), fuori da `client-web/tools`, in Playwright con Edge, una alla volta, ognuna con il suo server e il suo database temporaneo; tutte scrivono solo nella cartella delle evidenze):

| Script | Cosa |
|---|---|
| `lib.mjs`, `measure.mjs` | Server temporaneo, Edge, accesso; misura del contrasto sui pixel (con la copia del bundle) |
| `p1-focus.mjs` | Ordine di Tab e anello su ogni fermata; duello 1366×768, 844×390, 1920×1080, 750×292; FFA 1366×768 e 844×390 |
| `p2-keyboard.mjs` | Partita da tastiera (duello ridotto 13 e 10 turni, duello normale 4, FFA ridotto 3), con annullamento, scarto, esito, nuova partita |
| `p3-contrast.mjs` | Contrasto sul disegno reale, cinque configurazioni, stati del tavolo, finestre |
| `p4-shell.mjs`, `p6-misc.mjs`, `p12-zoomtable.mjs`, `p13-hubkeys.mjs`, `p14-leave.mjs` | Schermate HTML a 100% e 200% con spaziatura del testo, campi e bordi, tavolo a 683×384 e 960×540, tastiera nell'hub, uscita dalla tastiera |
| `p5-ring.mjs`, `p10-htmlfocus.mjs`, `p11-confirm-ring.mjs` | Contrasto dell'anello; focus sui controlli HTML del tavolo; anello di ✓ e × |
| `p7-blow.mjs` | ExtremelyViolentBlow con la V reale (`open/1vCom`, mazzo sintetico) |
| `p8-reduced.mjs` | Round con movimento ridotto e testo di «Ultimo turno» |
| `p9-color-aria.mjs` | Grigi e daltonismo; albero di accessibilità |

**Giri.** Il prototipo è stato costruito in `%TEMP%\c48a-proto` (copia di `client-web` e dei documenti che i test leggono) con `tsc` e `vite build` della copia, 307 test su 307 nella copia, anteprima su 4321. Alla fine ho fermato le anteprime e rimosso la copia. **Verifiche finali** (alla chiusura): `./client-web/run.ps1 -Task Test` (307 verdi, albero del repository senza modifiche di prodotto), `./scripts/build.ps1 -Task Test -Offline`, `python scripts/check-rules.py`, `git diff --check`, `git status` con i soli file di questa Fase A; vedi la sezione finale del [rapporto della Fase](../../../reports/client-c4/c4-8a/fase-a/README.md#verifiche-finali).

**Cosa non è verificato.** Lettore di schermo (D12 d); Safari, iPhone e tastiera hardware su iPad; **zoom vero del browser** (emulato con la dimensione CSS: stessa densità di pixel, quindi il testo non è rasterizzato più grande); testo ampliato di sistema (solo ispezione statica dei `font-size`); contrasto delle scritte **in movimento** (stampigli, etichette, primi piani) e sul legno sotto testi HTML (solo due valori); illustrazioni e texture; il giudizio a occhio delle catture in grigi e in daltonismo, che è del proprietario; la partita da tastiera in FFA oltre 3 turni e a 844×390 oltre l'ordine di Tab; vittoria da tastiera (le due partite intere sono finite con la mia eliminazione: il pannello è lo stesso); la fine della partita per tempo o forfait da tastiera; l'anello su Windows in modalità contrasto elevato; `VerifyAim`, `VerifyResolution`, `VerifyLayout` e fotogrammi sul prototipo. **Fragilità delle sonde:** l'avvio dell'FFA con «Aggiungi computer» è scaduto qualche volta (non indagato; ho reso più paziente l'attesa nello script di sonda, non nel prodotto).

**Non toccato.** Nessun file di prodotto, test, strumento (`client-web/tools`, `run.ps1`, `CONTRIBUTING.md`, `docs/orchestrazione-lavoro.md`), nessun documento comune (piano, `docs/README.md`, rapporto): si aggiornano in Fase B.
