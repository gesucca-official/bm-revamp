# C4-7-bis — Fase A

6 novembre 2026, base `ffb9c2d`. **C4-7: correzione in corso (C4-7-bis), Fase A pronta, in attesa della scelta.** Nessun codice di prodotto cambiato, nessun file audio scaricato. [Diagnosi e proposta](../../design/client-c4/audio/proposta-esito.md).

## Prova del proprietario

Su iPhone: «non si sente fanfara di vittoria ne suono di sconfitta»; «il "tap" di quando si seleziona una carta si sente a volte si e a volte no, e sembra avere un po' di lag»; «le animazioni su safari non sono proprio fluidissime»; «safari in lanscape taglia un sacco di spazio, laterale per l'isola con le fotocamere, in alto per le schede e la barra degli indirizzi»; «quel tooltip giallo in alto che riassume il turno da un po' fastidio visto lo schermo piccolo»; «in generale cmq il gioco mi sta piacendo molto!».

Da PC: «suoni ok da pc, ma non si sentono suoni di vittoria o sconfitta, o se si sentono sono in molto ritardo rispetto all'evento».

Decisione del proprietario sull'esito: «Due distinti» (suono di vittoria e suono di sconfitta distinti, al posto dell'unico `confirmation_002.ogg`).

Nota della regia: nelle sonde di C4-7 il suono di esito compare solo 2 volte (`resolution-finale`) e mai nel giro ufficiale; le verifiche di C4-7 non hanno coperto l'esito. Destinazioni: fluidità su Safari a C4-8b (condizione già prevista, ora attivata), O28 a C4-8b, O29 a C4-8a o C4-8b ([roadmap](../../client-roadmap.md#osservazioni-registrate-durante-c4)).

## Diagnosi

Cause provate su sei partite 1vCom vere (Edge headless 1366×768, `dist` di `ffb9c2d`, jar 1.11 delle 11:35, server temporaneo), una azione nel round finale di ciascuna, con una sonda che registra ogni `play` ([script](c4-7-bis/fase-a/outcome-probe.mjs), [risultati](c4-7-bis/fase-a/outcome-probe-1366x768.json)); dettagli, file e righe nella [proposta](../../design/client-c4/audio/proposta-esito.md#cause).

- **(a) confermata, più larga dell'ipotesi:** `advance()` scarta ogni evento audio scavalcato da un tocco; l'esito sta a `total − 700` ms, dopo l'ultima fermata intermedia (`tail.at`), quindi qualsiasi tocco nella coda lo scarta e chiude la sequenza. Tocchi fino alla fine: 0 suoni d'esito; un tocco a 8 563 ms (esito previsto a 9 250): 0.
- **(b) confermata:** lasciando scorrere l'esito suona a 8 448 ms dall'arrivo della vista (9 641 in un'altra partita), 2,9 s dopo l'ultimo impatto; nel round finale l'impatto tace per scelta.
- **(c) ridimensionamento confermato come meccanismo, `blur` smentito:** 60 px di ridimensionamento a 1,5 s chiudono la sequenza (`resize`) e l'esito non suona; un `blur` non la chiude e l'esito suona. Che la barra di Safari produca davvero quel `resize` su iPhone non è verificabile da Edge.
- **(d) confermata:** il pannello d'esito compare subito, con la sequenza appena partita; «Nuova partita» a 1,5 s smonta il tavolo e l'esito non suona. È il motivo per cui il giro ufficiale di C4-7 (4 partite fino all'esito) non ha mai suonato l'esito: `Verify` lascia il tavolo appena vede il pannello.

Il computer ha vinto tutte e sei le partite: la vittoria non è stata provata, il percorso è lo stesso. Proposte (suoni distinti con pareggio come sconfitta, due strade per la fonte, momento con due opzioni, Web Audio) nella [proposta](../../design/client-c4/audio/proposta-esito.md).

## Verifiche della Fase A

Nessuna verifica di prodotto: il codice non è cambiato. `dist` ricostruito da `ffb9c2d` per la sonda; porte 8080 e 4320 libere e nessun Java/Maven esterno prima del lancio, liberate alla fine. `python scripts/check-rules.py`: PASS. `./scripts/build.ps1 -Task Test -Offline`: **571 server, 0 errori, 7 saltati; client-debug 36/36** (cifre del server cresciute con i commit del Set Base dopo C4-7). `TestServerContext` non eseguito. Non verificati iPhone, Safari, interruttore silenzioso, latenza percepita e vittoria.

# C4-7-bis — Fase B

Implementata il 6 novembre 2026, verificata il 7 novembre 2026; base `5184838` (scelte sulla Fase A). **C4-7: fatto, in attesa del giudizio del proprietario.** [Scelte del proprietario](../../design/client-c4/audio/scelte.md#c4-7-bis--scelte-sulla-fase-a), [diagnosi della Fase A](../../design/client-c4/audio/proposta-esito.md).

## File scelti, scaricamento e inventario

Pacchetto [Kenney Music Jingles](https://kenney.nl/assets/music-jingles) scaricato solo dalla pagina ufficiale. Un primo `curl` ha ricevuto 403. Non ho aggirato il controllo: il file viene dal flusso normale della pagina nel browser integrato («Continue without donating»). Il pacchetto, salvato in una cartella nuova fuori dal repository, pesa **1.239.525 byte**, sotto il tetto di 2 MB, con SHA-256 `b729ba57…77197b8`. Il `License.txt` incluso dichiara CC0 1.0.

File SAX e PIZZI misurati; quelli sotto 2 s sono andati su una pagina d'ascolto servita solo in LAN, mai pubblicata, poi fermata: 8 candidati per esito, con la proposta in cima. Parole del proprietario: «sconfitta SAX07 vittoria SAX10». Copiati senza modifiche:

- `jingles_SAX10.ogg` (vittoria): 13.565 B, 0,64 s;
- `jingles_SAX07.ogg` (sconfitta e pareggio): 30.900 B, 1,74 s.

`confirmation_002.ogg` esce da `public/audio` e dall'[inventario](../../design/client-c4/assets/inventory.json) (versione 3, con autore, URL, versione, licenza, peso e SHA-256 per file). Ora i suoni sono sei, 72.912 byte in tutto. La home cita anche Music Jingles fra i materiali CC0.

Osservazione del proprietario sulla pagina d'ascolto, registrata nelle [scelte](../../design/client-c4/audio/scelte.md#scelta-dei-file-dopo-lascolto): l'iPhone 15 «dice riprodotto, ma non si sente niente anche alzando il volume», l'iPhone 16 Pro sente tutto. Ipotesi non verificata: modalità silenziosa attiva, rispettata da Web Audio con la sessione 'ambient'.

## Cause e correzioni

- **(a) Il tocco scartava il suono.** `RoundCue` (`src/sound.ts`) tiene un solo segnale per round, l'impatto oppure l'esito. Un tocco che raggiunge o scavalca il segnale lo fa suonare allora, una volta; vale anche per l'impatto, come chiesto. Lo stesso vale per un tocco che chiude la sequenza.
- **(b) Esito a fine coda.** `roundCue` e `decisiveMove` (`src/resolution.ts`) mettono l'esito sul colpo decisivo: l'arrivo della carta che porta a 0 o meno la Salute di chi muore (Salute ≤ 0 è morte nel regolamento), al 70% del volo come l'impatto. Se la fine non viene da una carta, l'esito va all'inizio della coda: morte a fine turno, forfait, barre solo totali, oppure più morti di cui una non attribuita a una carta.
- **(c) Ridimensionamento:** regola invariata per scelta del proprietario. Un ridimensionamento chiude la sequenza e l'esito tace.
- **(d) Pannello d'esito:** invariato per scelta del proprietario. Compare ancora subito, e «Nuova partita» prima del segnale smonta il tavolo senza suono.
- **Salto, interruzioni, background, riconnessione:** restano muti, senza recuperi tardivi.
- **Fine normale:** a sequenza completa o chiusa da un tocco, un esito già partito non viene troncato. Salto e interruzione invece lo fermano.

Scelta mia, da giudicare: quando la scelta di una carta dalla mano chiude la sequenza (regola 4), suona l'esito ma non l'impatto. L'impatto suona solo con il tempo o con tocchi sul tavolo che lo raggiungono.

**Web Audio.** Un solo `AudioContext` per pagina, con i sei file locali decodificati una volta. Volume e muto passano da un `GainNode` principale e funzionano anche dove `HTMLMediaElement.volume` è ignorato. Ogni suono è un `AudioBufferSourceNode` nuovo; il client non chiama più `HTMLMediaElement.play`.

- **Sblocco:** su `pointerdown`, `touchend`, `click` e `keydown` (in cattura) il contesto viene ripreso. Al primo gesto parte un campione muto di un frame. Niente è atteso sul percorso di input: selezione, invio e rifiuto sono rinviati con `queueMicrotask`.
- **Sessione audio:** `navigator.audioSession.type = 'ambient'` dove esiste.
- **Ripiego silenzioso:** senza contesto, prima di un gesto, con il contesto sospeso o con un file mancante o non decodificabile non suona niente e niente resta in coda.

Nessuna informazione dipende dal suono. Menu, geometria del tavolo e pannello sono invariati.

## Test

- **Nuovo `tests/outcome-sound.test.ts` (4 test).** Usa i round finali registrati dal server vero, più una variante con la morte spostata sulla carta avversaria, e guida l'orologio della sequenza con le fermate vere. Copre:
  - un esito del tipo giusto (vittoria, sconfitta, pareggio come sconfitta) lasciando scorrere;
  - un esito quando si tocca fino alla fine partendo da ogni punto, e con un solo tocco ovunque;
  - colpo decisivo contro coda;
  - salto, interruzioni e scelta di carta.
- **Ricostruiti su `ffb9c2d`.** Su `ffb9c2d` i test nuovi non si caricano, perché mancano le funzioni. Ho riprodotto le sue due semantiche su copie fuori dal repository ([mutazione](c4-7-bis/fase-b/mutazione.json)): «il tocco scarta» fa fallire 2 test su 4, «esito a `total − 700`» 1 su 4.
- **`tests/sound.test.ts`.** Solo la preparazione è adattata a un finto backend Web Audio; i 7 test restano. «Il primo gesto tenta una sola attivazione muta di ciascun lettore» diventa «il primo gesto riprende il contesto e suona un solo campione muto», perché non ci sono più lettori. Aggiunti 4 test: guadagno, nulla prima di un gesto, contesto sospeso (iOS in background), esito non troncato a fine normale.
- **Invariati:** nessun test tolto, nessun atteso, selettore, soglia o `BASE_750` cambiato.
- **Esito:** 255/255 test client.

**Sonda.** `tools/verify-audio-probe.mjs` segue ogni `AudioBufferSourceNode.start` fino al file, attraverso `fetch` e `decodeAudioData`. La scena annuncia inizio (con il segnale) e fine (con il motivo) solo se la sonda definisce `window.__bmAudioTrace`. Ogni record porta la sua pagina.

`tools/check-audio-probe.mjs` fallisce se:
- un round ha più di un suono, un suono fuori da una sequenza aperta, o un suono di tipo diverso dal segnale;
- un round finale chiuso da sé o con un tocco non ha esattamente un esito;
- un round con impatto completato non ha esattamente un impatto;
- compare un `HTMLMediaElement`;
- con `--blocked` suona qualcosa di udibile.

`--require=win,loss,input` impone la copertura. Il nuovo `VerifyOutcomeAudio` gioca 1v1 fra `devAlice` e `devBob` su server temporaneo. Nel round finale ciascuno lascia scorrere, tocca fino alla fine, tocca una volta poco prima del segnale, salta o ridimensiona.

## Verifiche

Jar del 6 novembre 11:35 (`d87271aa76a07c8d`) riutilizzato e dichiarato (`-ReuseJar`). `server/src/main` e `pom.xml` non cambiano da `2c1e23a` (regolamento 1.11); i commit C4 non toccano `server`. L'avviso «STALE JAR» di `VerifyAll` riguarda solo file di test del Set Base (`server/src/test/.../sim`). Prima di ogni giro: porte 8080 e 4320 libere, nessun Java o Maven esterno; un giro alla volta.

| Giro | Esito | Sonda |
|---|---|---|
| `VerifyAll -Only 'test,build,size,verify,layout'` ([evidenze](c4-7-bis/fase-b/ufficiale/)) | **7/7** | 76 round, 12 impatti, massimo 1 per round; 0 esiti, perché `Verify` lascia il tavolo appena vede il pannello (causa d, invariata) |
| `VerifyResolution` ridotto, `quick,interrupt` ([evidenze](c4-7-bis/fase-b/resolution/)) | **5/5** | 32 round, 26 impatti, 1 vittoria e 1 sconfitta a sequenza completa, massimo 1 |
| `Verify` con audio negato (contesto sospeso, `resume()` respinto) ([evidenze](c4-7-bis/fase-b/bloccato/)) | **5/5** con test, build e size | 0 suoni udibili; 2 avvii del campione muto |
| `Verify` con i sei file tolti da `dist/audio` e ripristinati nel `finally` ([evidenze](c4-7-bis/fase-b/mancanti/)) | **2/2** | 0 suoni udibili, nessun errore di pagina |
| `VerifyOutcomeAudio` a 1366×768 e 844×390, 4 partite per misura ([evidenze](c4-7-bis/fase-b/esito/)) | **8/8 partite**, controllo `--require=win,loss,input` verde | esiti: 3 vittorie e 3 sconfitte (desktop), 4 e 2 (compatto); un esito esatto in ogni round finale lasciato scorrere o toccato; nessuno dopo salto o ridimensionamento |
| 750×292 `build,verify,layout` ([evidenze](c4-7-bis/fase-b/m750/)) | build verde; Verify e layout **rossi dichiarati**, dello stesso tipo della Fase 0 di C4-7 | senza sonda |

**750×292 (regola 18).** Verify scade attendendo `status-tip`, come nella Fase 0. Layout: 48 problemi come nella Fase 0, con gli stessi tipi a parte l'ordine delle coppie sovrapposte. Conteggi per turno: duello **6/6/6** (Fase 0: 6/6/5), FFA **11/11/11** (uguale). Nel duello T2 c'è in più «arrow to item», un tipo già presente a T0 e T1 in entrambi i giri. Dipende da dove cadono gli oggetti in questa partita, e il JSON non conserva tutti i conteggi degli oggetti: non attribuisco una causa. C4-7-bis non tocca la geometria (le modifiche a `scene.ts` sono solo suono e traccia). Il confronto con `BASE_750` per numero di oggetti non si può fare dal JSON della partita. Il test `BASE_750`, che lo fa sugli stessi input, è invariato e verde (2 posti [6,6,6,5], 5 posti [11,11,12,14]). Atteso, soglie e base invariati; il giro non è stato ripetuto per cercare un verde.

Tempi dell'esito, misurati dall'inizio della sequenza sull'orologio della pagina ([tempi](c4-7-bis/fase-b/esito/)):
- **Lasciando scorrere:** l'esito parte 8–12 ms dopo il segnale.
- **Toccando fino alla fine:** parte al tocco che scavalca il segnale, a 2,6–3,5 s invece di 8,35–8,75.
- **Con un tocco poco prima del segnale:** parte al tocco (8,63–8,65 s), una sola volta.
- **Dove cade il segnale:** in 7 partite su 8 la morte arriva a fine turno, quindi il segnale è all'inizio della coda (8,35–8,75 s su 9,95–10,35). In una partita desktop la morte viene da una carta, e la vittoria suona sul colpo, a 2,46 s.

Ne segue che, lasciando scorrere una partita che finisce a fine turno, l'esito arriva circa 0,9 s prima di `ffb9c2d` (prima: `total − 700`), ma sempre 8–9 s dopo che il pannello è comparso: il pannello non è cambiato, per scelta.

Size: JS gzip **340.716 / 512.000 B** (C4-7: 339.873), totale **1.733.198 / 4.194.304 B**, atlante massimo 2048 px, texture **27.729.048 / 33.554.432 B**; audio 6 file, **72.912 B**, gzip 60.522 B.

Input massimo nei quattro campioni duello e FFA ([layout](c4-7-bis/fase-b/ufficiale/)):

| Misura | Fase 0 di C4-7 | Fase B di C4-7 | C4-7-bis |
|---|---|---|---|
| Desktop | 17,8 / 15,8 / 21,9 / 29,0 ms | 13,6 / 15,6 / 21,3 / 29,9 ms | **17,9 / 21,9 / 21,9 / 31,5 ms** |
| Compatto | 12,3 / 13,1 / 22,7 / 27,2 ms | 13,9 / 18,9 / 18,4 / 20,8 ms | **15,4 / 15,5 / 20,5 / 21,5 ms** |

Tutti sotto 100 ms. Il massimo desktop cresce di 1,6 ms rispetto a C4-7 e di 2,5 ms rispetto alla Fase 0; quello compatto resta sotto la Fase 0. Partite e campioni sono diversi: questo non prova identità né peggioramento. Il primo gesto, che sblocca il contesto, non è nei campioni. La latenza percepita non è misurata.

`./scripts/build.ps1 -Task Test -Offline`: **579 server, 0 errori, 7 saltati; client-debug 36/36**. Sono 8 in più della Fase A, che girava su `ffb9c2d`, prima del riallineamento sui commit SB-11a e SB-11b. `python scripts/check-rules.py`: PASS. `TestServerContext` non eseguito.

## Non verificato e da riprovare

Non verificati: iPhone, Safari, modalità silenziosa, riproduzione reale udita, decodifica OGG Vorbis su Safari in generale: dipende dalla versione, e dove manca i file non si decodificano e il gioco resta muto. Sulla pagina d'ascolto l'iPhone 16 Pro ha suonato gli stessi OGG con Web Audio, latenza percepita del tocco di selezione. Che la barra di Safari produca un `resize` che chiude la sequenza resta non verificato, e la regola non è cambiata. Le prove sono su Edge via Playwright su PC, con database temporaneo, non su un dispositivo fisico.

Da riprovare, per il proprietario:

- **PC:** una partita lasciata scorrere fino alla fine, e una toccando il tavolo dopo l'ultima carta. L'esito si sente una volta, vittoria o sconfitta secondo il risultato. Se la morte arriva a fine turno, lasciando scorrere arriva ancora circa 8 s dopo il pannello; toccando arriva subito.
- **iPhone 16 Pro:** gli stessi due casi; il tocco di selezione dovrebbe suonare ogni volta e senza ritardo, perché non passa più da `<audio>`; volume e muto dal menu.
- **iPhone 15:** prima con la modalità silenziosa disattivata, poi attivata; nel secondo caso il silenzio è atteso con 'ambient'.
