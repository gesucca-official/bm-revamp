# C4-7-bis — Esito non udito o in ritardo: diagnosi e proposta, Fase A

6 novembre 2026, base `ffb9c2d`. **Solo diagnosi e proposta:** nessun codice di prodotto cambiato, nessun file audio scaricato. Le cause sono provate su partite vere (sonda descritta sotto), non dedotte; dove una prova su iPhone non è possibile da Edge lo dico.

## Prova del proprietario

Registrata con le sue parole nel [rapporto C4](../../../reports/client-c4-report.md#c4-7-bis--fase-a). In breve: su iPhone e su PC l'esito non si sente o arriva molto dopo l'evento; su iPhone il tocco di selezione è intermittente e in ritardo. Decisione già presa: **«Due distinti»** (vittoria e sconfitta separate, al posto dell'unico `confirmation_002.ogg`).

## Come è stato provato

Sonda Playwright [`outcome-probe.mjs`](../../../reports/client-c4/c4-7-bis/fase-a/outcome-probe.mjs), conservata tra le evidenze e non tra gli strumenti (non è un verificatore e non tocca quelli esistenti; si lancia con il Node di `client-web` passando una cartella d'uscita, porte 8080 e 4320 libere): server temporaneo dal jar `server/target/bm-server-0.0.1-SNAPSHOT.jar` (regolamento 1.11, costruito il 6 novembre alle 11:35, prima di SB-11a; il client non dipende da quel cambiamento), `dist` ricostruito da `ffb9c2d`, `vite preview` su 4320, Edge headless 1366×768, partite 1vCom vere con `devAlice`. Uno script di pagina registra ogni `HTMLMediaElement.play` con l'orologio della pagina e il momento in cui compare il pannello `.outcome`; nel round finale di ogni partita si applica **una** azione. Il conteggio è di chiamate `play`, non di suoni uditi. [Risultati](../../../reports/client-c4/c4-7-bis/fase-a/outcome-probe-1366x768.json).

Sei partite vere, una azione per partita nel round finale (tempi dall'apparire del pannello d'esito, che coincide con l'arrivo della vista finale e l'avvio della sequenza). Il computer ha vinto tutte e sei: **le vittorie non sono state provate**, ma il percorso del codice è lo stesso (cambia solo il testo del banner).

| Azione nel round finale | Round | Durata prevista; coda; impatti | Suono d'esito | Fine della sequenza |
|---|---|---|---|---|
| Lascia scorrere | T19 | 9 150 ms; coda da 7 550; 2 555 e 5 505 | **1, a 8 448 ms** | `complete` |
| Tocchi sul tavolo vuoto fino alla fine (15 tocchi, primo a 182 ms) | T10 | 9 950; 8 350; 2 555 e 5 505 | **0** | `input` |
| Un solo tocco nella coda (a 8 563 ms; esito previsto a 9 250) | T18 | 9 950; 8 350; 2 155 e 5 505 | **0** | `input` |
| Ridimensiona la finestra di 60 px (a 1 514 ms) | T11 | 10 350; 8 750; 2 555 e 5 905 | **0** | `resize`, a 1 532 ms |
| Evento `blur` della finestra (a 1 519 ms) | T13 | 10 350; 8 750; 2 555 e 5 905 | **1, a 9 641 ms** | `complete` |
| «Nuova partita» sul pannello (a 1 528 ms) | T16 | 10 350; 8 750; 2 555 e 5 905 | **0** | tavolo smontato |

In nessun round finale suona l'impatto (sostituito dall'esito, come previsto). Nessun errore di pagina.

Riscontro sulle evidenze già committate di C4-7: nel giro ufficiale (`ufficiale-finale`, 4 partite giocate fino all'esito da `Verify`, 2 vinte e 2 perse) **zero** suoni d'esito non muti: `Verify` preme «Nuova partita» appena compare il pannello, ben prima della fine della coda. In `resolution-finale` i due suoni d'esito arrivano a sequenza **completa** (round finali di 9 150 e 9 350 ms).

## Cause

| Ipotesi | Esito | Prova | Dove |
|---|---|---|---|
| (a) `advance()` scarta gli eventi audio con `elapsed < at <= next` | **Confermata, con un meccanismo più largo dell'ipotesi.** Ogni tocco scarta gli eventi audio che scavalca, non solo quello che cade sul punto d'arrivo. Per l'esito: le ultime fermate sono `tail.at` e `total`; l'evento d'esito sta a `total − 700` ms, quindi un tocco nella coda salta a `total`, scarta l'esito e chiude la sequenza (`finish('input')` → `endRound`). Lo stesso vale per l'impatto, a `flight.at + 0,7·flight.dur`, scavalcato dal tocco che va a `target.at`. | Modalità «tocchi fino alla fine» e «un tocco nella coda» della sonda. | `client-web/src/scene.ts:635-636` (`advance`), `client-web/src/resolution.ts:363-366` (`nextStop`), `scene.ts:548` e `scene.ts:593` (eventi audio) |
| (b) l'esito parte a `tailEnd`, con il banner a fine coda | **Confermata.** Il suono parte a `total − 700` ms dall'arrivo della vista: dopo tutte le carte, la pesca, la fine turno e il timbro «ELIMINATO». | Modalità «lascia scorrere»: 1 suono a 8 448 ms su 9 150, 2,9 s dopo l'ultimo impatto e 0,9 s dopo l'inizio della coda; in un'altra partita 9 641 ms su 10 350. | `scene.ts:589` e `scene.ts:593`; `PACE.outcome` in `resolution.ts:328` |
| (d) il pannello d'esito | **Confermata: è il «molto ritardo» percepito.** Il pannello con titolo, motivo e «Nuova partita» compare **appena arriva la vista finale**, sopra il tavolo, mentre la sequenza è appena partita; il suono arriva 8,4–9,6 s dopo il testo. Chi preme «Nuova partita» o «Torna all'hub» prima smonta il tavolo (`stopAll`) e il suono non parte mai: così `Verify`. | Modalità «Nuova partita»; riscontro su `ufficiale-finale`. | `client-web/src/table.tsx:62-64` (`finished`, `panel`), `table.tsx:106-107`, smontaggio `table.tsx:55`; `main.tsx:65` (`key={gameId}`) |
| (c) iOS: `resize` di `visualViewport` o `blur` chiudono la sequenza | **Ridimensionamento: meccanismo confermato su Edge; occorrenza su iPhone non verificabile da qui.** Un `resize` della finestra o di `visualViewport` chiama `interrupt` con chiusura della sequenza, e con lei l'esito; la barra di Safari che compare o scompare cambia `visualViewport`. **`blur`: smentita**: `interrupt('window blur', true, false)` non chiude la sequenza. | Modalità «ridimensiona» e «blur». | `scene.ts:136-138`, `scene.ts:462` |
| Altro emerso | Nel round finale anche il primo impatto tace per scelta (l'esito sostituisce l'impatto, `scene.ts:548`): il colpo decisivo è muto e il suono arriva quasi 3 s dopo. | Modalità «lascia scorrere». | `scene.ts:548` |

Sintesi: su PC lasciando scorrere l'esito **suona**, ma 8–9 s dopo il pannello e quasi 3 s dopo l'ultimo colpo; avanzando col tocco o lasciando il tavolo dal pannello **non suona**. Su iPhone si aggiungono il tocco (che lì è il modo naturale di andare avanti) e i cambi di `visualViewport`.

## Suoni distinti

Restano le regole di C4-7: brevi (indicativamente sotto 2 s), coerenti col bar, fonte CC0 con licenza esplicita sulla pagina ufficiale dell'autore, download solo da lì. **Pareggio: lo stesso suono della sconfitta**, non un terzo file: il pareggio è raro, nessuno dei due vince, e un suono neutro in più aggiungerebbe un file da scegliere per un caso che il testo «PAREGGIO» già distingue; il suono di vittoria non deve mai accompagnare un risultato che non è una vittoria.

### Strada A, raccomandata — Kenney «Music Jingles»

[Pagina ufficiale](https://kenney.nl/assets/music-jingles): Kenney, 85 file, **Creative Commons CC0**, versione 1.0 (2014). Sono 17 jingle brevi suonati con cinque strumenti; i nomi seguono lo schema `jingles_<STRUMENTO><NN>.ogg` (`NES`, `HIT`, `PIZZI`, `SAX`, `STEEL`, da `00` a `16`). Per un bar marcio propongo di scegliere fra **`SAX`** (sassofono: il più vicino al locale) e **`PIZZI`** (archi pizzicati, leggeri), escludendo `NES` (8 bit) e `HIT`.

Limiti dichiarati: la pagina ufficiale **non dichiara peso né durate dei singoli file** e ha un solo ascolto, un'anteprima di 13 s che concatena più jingle senza dire quali. Il peso dello zip è dichiarato **1,1 MB** soltanto sulla [vecchia scheda OpenGameArt del 2014](https://lpc.opengameart.org/node/22000) (`jingleSounds_Kenney.zip`), che non userei per scaricare. Non ho trovato pagine d'ascolto per singolo file, quindi **non posso proporre ora due nomi precisi da ascoltare** né attribuire loro un carattere.

Proposta: autorizzare il download del pacchetto dalla pagina ufficiale (tetto **2 MB**, licenza inclusa CC0, cartella nuova fuori dal repository) **solo per l'ascolto**; misuro durate e pesi dei 34 file `SAX` e `PIZZI` e tengo quelli sotto 2 s; ti preparo una pagina privata con i candidati da ascoltare anche su iPhone; tu scegli vittoria e sconfitta; solo allora copio i due file nel repository e inventario. Costa un passaggio in più.

### Strada B, ascoltabile subito — Kenney «Interface Sounds» (stesso pacchetto di C4-7)

Pacchetto già scaricato e autorizzato in C4-7 ([pagina ufficiale](https://kenney.nl/assets/interface-sounds), CC0 1.0, versione 1.0, 834 536 byte), quindi nessuna fonte nuova; ma sono suoni d'interfaccia, non una fanfara. Ascolto con **Play** sulle pagine individuali già usate in C4-7 (identificano autore e licenza; non si scarica di lì); peso e durata come dichiarati da quelle pagine.

| Uso | File | Peso; durata | Ascolto |
|---|---|---|---|
| Vittoria | `confirmation_004.ogg` | 12 KB; 0,490 s | [Confirmation 004](https://instrictlogic.com/AssetLibrary/sounds/samples/confirmation-004-05f4b050/) |
| Vittoria, alternativa | `confirmation_003.ogg` | 9 KB; 0,322 s | [Confirmation 003](https://instrictlogic.com/AssetLibrary/sounds/samples/confirmation-003-848b6727/) |
| Sconfitta e pareggio | `error_006.ogg` | 8 KB; 0,500 s | [Error 006](https://instrictlogic.com/AssetLibrary/sounds/samples/error-006-bcda3bee/) |
| Sconfitta, alternative | `error_003.ogg`, `error_005.ogg` | 12 KB; 0,533 s — 7 KB; 0,497 s | [Error 003](https://instrictlogic.com/AssetLibrary/sounds/samples/error-003-4a623f77/), [Error 005](https://instrictlogic.com/AssetLibrary/sounds/samples/error-005-5bcc0934/) |

Le sconfitte proposte sono le «error» più lunghe, perché `error_001.ogg` è già il rifiuto della mossa e i due eventi non devono confondersi; da giudicare all'ascolto se suonano come una sconfitta o come un errore.

In entrambe le strade `confirmation_002.ogg` esce da `public/audio` e dall'inventario se non è scelto.

## Il momento dell'esito

Regole che restano: al massimo un suono di sequenza per risoluzione (l'esito sostituisce l'impatto); niente recuperi tardivi dopo «Salta effetti», interruzione, background o riconnessione; il pannello d'esito senza sequenza resta muto; nessuna attesa sul percorso di input.

**Opzione 1, raccomandata — sul colpo decisivo.** L'esito suona dove oggi suonerebbe l'impatto della carta che chiude la partita: nel round finale, l'impatto dell'ultima carta che colpisce un posto eliminato in quel round; se la fine non viene da una carta (fine turno, forfait, tempo) suona all'inizio della coda, col timbro «ELIMINATO»/«FORFAIT». Banner invariato. Nella partita misurata gli impatti delle due carte cadono a 2,56 e 5,51 s dall'arrivo della vista: il suono passerebbe da 8,45 s a uno di questi due istanti, sul colpo che si vede. Col tocco: se un tocco scavalca o raggiunge quel punto, l'esito suona **al tocco**, una volta; se il tocco porta direttamente alla fine (`finish('input')`) e l'esito non è ancora suonato, suona al tocco. «Salta effetti» resta muto.

**Opzione 2 — col banner, come oggi, ma salvato dal tocco.** Il suono resta a fine coda col banner; si corregge solo il tocco (al tocco che scavalca o chiude la coda, l'esito suona una volta). È la correzione minima, ma lascia il ritardo che il proprietario ha sentito su PC.

Il ritardo percepito dipende anche dal pannello che compare subito (causa d): con entrambe le opzioni il testo «Hai vinto/perso» precede il suono di qualche secondo. Spostare il pannello a fine sequenza cambierebbe un comportamento visivo esistente; **non lo propongo in questo blocco**, ma lo segnalo come scelta possibile.

Per il `resize` di `visualViewport` (causa c), propongo di **non** cambiare la regola dell'interruzione in questo blocco: il ridimensionamento che interrompe la sequenza è una scelta di C3 legata al ricalcolo della geometria. Conseguenza dichiarata: su iPhone, se la barra di Safari cambia durante il round finale, l'esito tace (il pannello resta). Da riprovare dopo, con O28 in C4-8b.

## Web Audio per iOS

Proposta tecnica per la Fase B, in `src/sound.ts`, con la stessa interfaccia verso `scene.ts` e `table.tsx`:

- **Contesto unico.** Un `AudioContext` creato al montaggio del tavolo (nasce sospeso: nessun suono prima di un gesto). Al primo gesto reale (`pointerdown`, `touchend`, `keydown` in cattura, come oggi) `resume()` dentro il gestore e un buffer muto di un campione, per lo sblocco su iOS. Nessuna attesa: la promessa non è attesa dal percorso di input.
- **File decodificati una volta.** `fetch` dei soli file locali (`/audio/...`) e `decodeAudioData` in background al montaggio; i buffer restano in memoria (pochi KB decodificati). Un file che manca o non si decodifica resta muto.
- **Riproduzione.** Per ogni suono un `AudioBufferSourceNode` nuovo collegato a un **`GainNode` principale**: niente `currentTime=0` né `play()` su un elemento che può essere ancora in riproduzione o in caricamento, che è l'origine probabile del tocco intermittente e del ritardo su iOS. Le sorgenti della sequenza restano tracciate per `stopRound`/`stopAll` (`stop()`).
- **Volume e muto.** Il guadagno vale `muted ? 0 : volume`; funziona anche dove `HTMLMediaElement.volume` è ignorato (iOS, dove oggi il 20% suona al 100%). Muto ferma anche i suoni in corso, come oggi.
- **Ripiego silenzioso.** Senza `AudioContext`, con contesto non sbloccato, `state` diverso da `running` (anche l'`interrupted` di iOS per una telefonata) o buffer assente: nessun suono, nessuna eccezione, partita invariata (regola 13). Nessun ritorno a `HTMLMediaElement`.
- **Interruttore silenzioso.** Web Audio su iOS segue l'interruttore (oggi l'elemento `<audio>` può suonare comunque): coerente col piano («l'interruttore silenzioso prevale»). Dove esiste (`navigator.audioSession`, Safari recente) propongo `type='ambient'`, che lo rende esplicito e non interrompe la musica di altre app.
- **Verifiche.** La sonda attuale osserva `HTMLMediaElement.play`: andrà estesa ad `AudioBufferSourceNode.start` (stessa idea, solo fuori dai verificatori esistenti). Audio negato diventa contesto che non parte o `decodeAudioData` che fallisce.

**Non verificabile da Edge:** sblocco reale su iOS, interruttore silenzioso, latenza percepita, decodifica OGG nella versione di Safari del proprietario (se `decodeAudioData` rifiuta l'OGG, su iPhone tutto tace: oggi i suoni si sentono «a volte», quindi il formato sembra supportato, ma non è provato per Web Audio; un ripiego in M4A/AAC sarebbe una conversione da dichiarare e inventariare), stato `interrupted`, fluidità. Solo la prova del proprietario su iPhone li chiude.

## Cosa autorizzare

1. **Suoni.** Strada A: download del pacchetto «Music Jingles» dalla [pagina ufficiale](https://kenney.nl/assets/music-jingles), tetto 2 MB, licenza inclusa CC0, solo per l'ascolto; poi la scelta su una pagina d'ascolto. Oppure strada B: i file scelti dalla tabella, dal pacchetto «Interface Sounds» già autorizzato (tetto 2 MB come in C4-7). Pareggio come sconfitta, salvo diversa scelta.
2. **Momento.** Opzione 1 (colpo decisivo, raccomandata) o 2 (col banner).
3. **Web Audio** come sopra.
