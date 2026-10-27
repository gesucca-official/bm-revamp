# C0 — Contratti, schizzi e prova tecnica del client animato

**Aggiornamento dopo la revisione del proprietario, 26 ottobre 2026:**
la grafica è stata respinta. Le misure e le prove sotto riguardano solo la
prima scena; non validano il rifacimento richiesto con mano fisica, calata,
carte oggetto e mani avversarie coperte. La [roadmap v4](../client-roadmap.md)
e il [piano C0-R1–R5](../design/client-c0/bar-table-revision.md) sostituiscono
la direzione visiva e l'elenco dei soli due punti residui di questo rapporto.
Il rapporto originale resta evidenza tecnica storica; C0 è ancora aperta.

**26 ottobre 2026 — elaborati e prototipo consegnati; gate C0 ancora aperto.**
La raccomandazione resta **Angular supportato, TypeScript, DOM/SVG e Web
Animations**, senza renderer aggiuntivo. La scena passa le prove automatiche
sul PC; non è disponibile un dispositivo touch fisico. Non si dichiara C0
completata e C1 non è iniziata.

## Risultati salvati

- [Checklist P01–P44](../client-c0-parity.md): ogni funzione/secondario del
  debug ha fonte, percorso, API, destinazione proposta e caso di prova.
  Distingue O operative nel codice, C condizionate dalla configurazione, L lacune.
  Le caselle del futuro client restano aperte: non attestano parità già raggiunta.
- [Duello](../design/client-c0/duel.png), [FFA a cinque](../design/client-c0/ffa-five.png),
  [schema carta](../design/client-c0/card.png), con [SVG e inventario](../design/client-c0/README.md).
- [Contratto interazione](../design/client-c0/interaction-contract.md): tre
  payload realizzabili oggi, invio distinto da accettazione, pending, rifiuto,
  drop/resume, restart senza vista, duplicati e limiti di ordinamento.
- [Laboratorio e istruzioni](../../client-c0/README.md): una sola scena locale,
  toolchain e lock autonomi; nessun account/API server/motore/client nativo.
- [Roadmap v3](../client-roadmap.md): decisioni, evidenze e gate residuo.

Letti AGENTS (unico file applicabile trovato, incluse sottocartelle),
CONTRIBUTING, roadmap v2, regolamento 1.6, setup/API e sorgenti debug/server
necessari. Le modifiche documentali già presenti nel workspace sono state
conservate. Nessuna modifica a regole, bilanciamento, catalogo, server, bot,
codice debug, suoi package/lock o `scripts/toolchain.json`.

## Contratti effettivamente disponibili

La fonte normativa rimane R00–R09. Il nuovo percorso usa la stessa superficie
del debug, inclusi SMTP/admin quando configurati e rispettivi errori quando
indisponibili. Non aggiunge onboarding, console, pass umano, replay o archivio UI.

Le fonti correnti confermano `turn`, `dead`, `bindingName`, `pendingMove`,
deadline epoch, forfeits e ricevuta restart. Diverse sezioni storiche di API
sono superate; la checklist rimanda ai sorgenti correnti. La vista privata
contiene solo la propria mano completa, gli avversari hanno un conteggio e
nessuno vede l'ordine dei mazzi. Non c'è token REST per CONNECT STOMP.

I tre esempi non richiedono API nuove: ordinaria con `choices:null`, bound
con `DISCARD_ONE`, oggetto con proprietario in targetId e nome in TARGET_ITEM.
SELF è esplicito. Nessun pagamento al SEND; nessuna sostituzione dopo pending.
Il topic move testuale non è un ACK correlato: rileggere la vista. Avanzamento
turno/report/esito devono essere interpretati insieme, senza dedurre il successo
degli effetti dal solo invio. Dopo drop non ritrasmettere: resume e stato attuale.

Duplicati verificati nei sorgenti: `getCardFromHand` cerca per nome con
`findAny`, `getItem` prende il primo omonimo iterato, uguaglianza carte per
nome. Due pulsanti/copie nel prototipo non introducono un'istanza wire:
le due Peroni dello stesso proprietario producono esattamente lo stesso comando.
Il confronto è coperto dall'automazione, non da una nuova partita di rete.

Lacune conservate: nessun ID comando/evento o revisione monotona della vista,
nessun campione ora server, nessuna timeline completa strutturata degli effetti.
Viste nello stesso turno possono cambiare pending/clock; non ignorarle.
L'assenza di pass umano affidabile resta un limite R03, non un nuovo esito.
SMTP locale disabilitato e Basic ADMIN separato dal ruolo di gioco non sono
lacune da aggirare. Ramo restart senza view disegnato, non simulato come match.

## Stack e isolamento

| Elemento | Versione effettivamente usata |
|---|---|
| Angular common/core/compiler/platform-browser/compiler-cli | 21.2.25 |
| Angular CLI/build | 21.2.28 |
| TypeScript / RxJS / tslib | 5.9.3 / 7.8.2 / 2.8.1 |
| Node / npm | 24.13.0 / 11.6.2 |
| Automazione browser (solo sviluppo) | Playwright 1.56.1, Edge installato |
| Rendering | HTML/CSS, SVG originale, Web Animations API |

Scelta compatibile verificata sulle fonti ufficiali:
[matrice Angular](https://angular.dev/reference/versions),
[supporto Angular](https://angular.dev/reference/releases),
[Node LTS](https://nodejs.org/en/about/previous-releases).
Angular 21 è in LTS fino a giugno 2027; richiede TypeScript ≥5.9 e <6,
accetta Node ^24.0 e RxJS ^7.4. Il registro npm ha confermato le patch fissate.
Angular 22 è disponibile, ma non è necessario per questa prova; 21 LTS
consente la combinazione effettivamente compilata con Node 24.13 e TS 5.9.
Non si assume supporto perpetuo di questa major: ricontrollare patch/supporto
all'avvio dell'implementazione, senza migrare il debug per svolgere C0.

Il carico è soprattutto testo, form e poche carte. Un unico DOM mantiene
focus, lettura, click/touch e layout, mentre WAAPI copre gli accenti richiesti.
L'esperienza Angular/TS è già presente nel codice del progetto; non è un
vincolo di prodotto né prova della disponibilità di un manutentore futuro.
Nessuna nuova evidenza giustifica riaprire React o Phaser. Nessun bisogno di
fisica/simulazione client. **Pixi non valutato:** manca il fallimento grafico
persistente dopo semplificazione previsto dalla roadmap. Un telefono non
disponibile non è un motivo per introdurre un renderer.

Runtime e cache in `.tools/client-c0`, Node da zip ufficiale con SHA256
verificato, dipendenze in `client-c0/node_modules`, lock separato, PATH solo
durante lo script. Node 12/Angular 11 e cache del debug non sono alterati.
Le dipendenze non vengono installate globalmente. Build produzione AOT,
senza source map, senza zone.js, renderer, font o asset remoti.

## Scena e verifiche di interazione

Snapshot scritti a mano conformi alle forme di ClientGameView/Card/Character:
cinque player; mano propria sei carte (base, bound, azione lunga, Steal,
due SuperImpact); mani avversarie solo conteggio; oggetti omonimi; stato
MADE OF STONE, immunità, timer Bad Trip. Snapshot distinti per pending,
clock stesso turno, risultato aggregato, morte/forfait/H negativo.

Nomi ed effetti arrivano da SQLite **in sola lettura**, incluse le keyword
come in CardFactory; binding/flag/costi/target trascritti dai costruttori.
Le immagini e gli sprite sono null: nessun asset precedente importato.
Le funzioni serializzate di stati/timer sono oggetti opachi, mai eseguiti.
I valori prima/dopo sono precostituiti, non calcolati da un motore client.
Questa successione non è un archivio di un match effettivamente eseguito e
non dimostra conformità di una risoluzione completa di cinque mosse.

Le decorazioni sono una traccia fissa del laboratorio: trasferimento 300 ms,
impatto 250 ms, delta aggregato 250 ms. Il DOM riceve immediatamente la vista
finale. Cancellazione tramite generation, `Animation.cancel()` e rimozione
degli elementi FX; nessuna seconda copia dello stato di gioco o dei testi.
Tre accenti, circa 0,8 s complessivi misurati, contro soglia proposta 2 s.
Integrazione C1 dovrà mostrare soltanto transizioni dimostrabili dai DTO.

[Risultati browser dettagliati](client-c0/verification.json) e screenshot:
[desktop](../design/client-c0/screenshots/desktop.png),
[landscape emulato](../design/client-c0/screenshots/touch-emulated.png),
[portrait emulato](../design/client-c0/screenshots/portrait-emulated.png).
Verificati sui tre viewport:

- sei controlli carta distinti, testo lungo completo a 15 px, scelta esplicita;
  input pointer/tap emulato/Tab+Enter ed Escape, nessun drag o hover obbligatorio;
- composizione ordinaria/bound/FAR_ITEM/NEAR_ITEM, scarto richiesto,
  distinzione proprietario/nome oggetto, copie omonime e assenza costo anticipato;
- invio locale con doppio click bloccato, rifiuto correggibile, drop incerto,
  pending fissa senza reinvio;
- nuova vista durante sequenza cancella FX, nodo con focus conservato;
  stesso turno aggiorna clock senza perdere scarto/focus; vista duplicata
  non rianima il round; nuova vista rende subito utilizzabile il nuovo input;
- sequenza intera sotto 2 s, resize interrompe FX, preferenza movimento ridotto
  del browser elimina voli mantenendo numeri e report;
- H 120 e H −5 leggibili, morto/forfait distinguibili, esclusi dai nuovi bersagli;
- nessun overflow orizzontale nei tre viewport, altezza dei controlli essenziali
  ≥44 CSS px, nessun errore pagina o richiesta esterna.

Revisione visiva delle PNG effettuata durante il lavoro; corretto il
collegamento al bersaglio negli schizzi, compattata la fascia del personaggio
proprio nel prototipo e reso fisso il countdown personale durante lo scroll.
Lo scroll verticale per lettura/conferma è una proposta, soprattutto a
844×390; la praticità richiede ancora giudizio umano su touch fisico.
I testi dei bottoni oggetto sono densi sul landscape: non si dichiara che
il solo controllo geometrico certifichi leggibilità/soddisfazione.
Il listener background cancella le animazioni nel codice; sospensione/ripresa
fisica di browser mobile e focus di tecnologie assistive non provati qui.

## Peso effettivo della build

<!-- C0_SIZE_START -->
| Risorsa iniziale | Byte non compressi | Byte gzip |
|---|---:|---:|
| JavaScript `main-GF5FFFJV.js` | 172377 | 50377 (49,20 KiB) |
| CSS `styles-UOJQYLYT.css` | 7702 | 2410 |
| HTML | 778 | 506 |
| **Totale critico** | **180857** | **53293 (52,04 KiB)** |
| Codice differito | 0 | 0 |

Entrambi i budget rispettati per la scena C0. Build finale del 26 ottobre,
misure gzip delle 19:00:14 e catture terminate alle 19:02:17, ora di Roma.
<!-- C0_SIZE_END -->

Fonte: [file e byte gzip](client-c0/build-size.json), compressione gzip livello 9
su JS/CSS/HTML effettivamente prodotti, distinta dalla stima transfer Angular.
Nessun codice differito in C0, nessun font/asset esterno. I budget proposti
sono 500 KiB gzip JS e 1 MiB complessivo. Il payload include le fixture della
prova; non è una misura o stima della prima partita futura a parità C2.
Editor/admin/trasporto/asset futuri andranno misurati quando esisteranno.

## Fluidità e input misurati

PC disponibile: Gigabyte B450 AORUS M, Ryzen 9 5950X, circa 32 GiB RAM,
RTX 2060, Windows NT build 26200; Edge **156.0.4314.42**. Build produzione,
browser con finestra (`C0_HEADED=1`), DPR 1, pagina visible, nessun carico
Spring in esecuzione durante le catture. Due catture rAF di 60 s, stessa
scena/successione, cambio fixture ogni 3 s e 24 click/tap campionati per
scenario. I dati includono sequenze complete e cancellate da nuovo input.

<!-- C0_METRICS_START -->
| Cattura sul PC | Desktop 1366×768 | Touch **emulato** 844×390 |
|---|---:|---:|
| Intervalli rAF nella finestra 60 s | 7177 | 7201 |
| Cadenza media rAF / s | 119,75 | 120,00 |
| Intervallo p95 | 8,4 ms | 8,5 ms |
| Intervalli entro soglia (20 / 33 ms) | 99,972% | 100% |
| Intervallo massimo | 75,2 ms | 8,6 ms |
| Campioni input | 24 | 24 |
| Input → feedback p95 | 7,3 ms | 16,6 ms |
| Input → feedback massimo | 65,3 ms | 16,6 ms |
| Soglie C0 nel campione | PASS | PASS **solo emulazione** |

Due intervalli desktop superano 20 ms; sono inclusi nei dati e il 95% richiesto
rimane superato. Non si presenta il p95 come garanzia di assenza di frame lenti.
La sequenza intera nelle prove browser dura 808,0 ms desktop, 807,8 ms landscape
emulato e 816,0 ms portrait emulato. Sul touch fisico: **non misurato**.
<!-- C0_METRICS_END -->

[Misure e intervalli grezzi](client-c0/measurements.json). Il criterio è almeno
95% intervalli ≤20 ms desktop e ≤33 ms touch, nessun input UI campionato >100 ms.
La frequenza rAF osservata sul PC è circa 120 Hz, superiore all'obiettivo 60;
non è una misura esterna dei fotogrammi effettivamente presentati dal monitor.
Input = `Event.timeStamp` → rAF dopo aggiornamento Angular: proxy strumentale
del feedback, non misura fotonica o prova di tutti gli input possibili.
Nessun ritardo di rete incluso: il prototipo non fa richieste di gioco.

Il landscape emulato gira sullo **stesso PC**, senza CPU/rete simulate e non
misura browser/GPU/touch di un telefono. Non si estrapolano prestazioni né
peso del client completo, e non si chiamano le due catture «due dispositivi».
Proposta secondo campione: Galaxy A54/Chrome stabile, annotando versione e
viewport effettivi. Minimo proposto landscape 844×390; portrait 390×844
verticale, senza rotazione obbligatoria. Dispositivo/browser diversi sono
accettabili se rappresentativi e registrati, senza cambiare le soglie in
modo da nascondere un fallimento.

## Verifiche del repository

| Comando / verifica | Risultato effettuato |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | PASS: 251 test server, 36 test debug client |
| `python scripts/check-rules.py` | PASS: 39 carte + token, tipi/testi/starter, copia client e integrità SQLite |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | PASS: 358 test del profilo, 0 failure/error/skipped; include avvio Spring e scenari applicativi |
| `python scripts/verify-match-manifests.py` | PASS, tutti i controlli; manifest I22 non modificati |
| C0 production Build / Verify / Size | PASS; dati nei JSON sopra |
| C0 Measure | Catture sul PC effettuate; risultato emulato distinto dal touch fisico mancante |

Il profilo context include anche test sovrapposti alla suite ordinaria: non
sommare 251 e 358 come casi unici. L'avvio Spring riuscito appartiene alle
prove della base, **non** certifica il collegamento del prototipo al server.
I log locali di esecuzione restano in `tmp/` non versionato; gli elaborati
contengono solo metriche/fixture sintetiche. Catalogo SHA256 invariato:
`0e3cbb3574c95985ef417ec8a92daedf3d358f0a1cbb7c1201d6fc7ea9c938ee`.

## Cosa manca prima di C1

1. Eseguire **la stessa scena di produzione per 60 s su touch fisico**,
   riportando modello/browser/viewport e frame/input, verificando anche
   lettura, tap, resize/orientamento, background e ripresa. L'emulazione non
   soddisfa questo criterio essenziale. In caso di fallimento seguire una
   semplificazione mirata e il trigger Pixi della roadmap, senza aprire
   altri motori per un problema di layout/API.
2. Registrare **una sola breve revisione del proprietario** degli schizzi e
   della lettura sul minimo proposto, in particolare mano/bersaglio/clock/
   conferma e scroll verticale; confermare o correggere le proposte non
   bloccanti. Questa consegna rende il risultato concretamente valutabile.
3. Se entrambi passano, aggiornare il gate C0 con l'evidenza e la decisione
   finale sullo stack. Fino ad allora C0 resta in validazione e C1 non parte.

Responsabile manutenzione e disponibilità giocatori restano organizzativi;
SMTP/admin dedicati servono alle prove positive C2, non impediscono la prova
grafica C0. Nessuna implementazione login/partita reale, nuova regola o client
desktop/mobile dedicato è stata anticipata.
