# C4-7-ter — Colpi per tipo di danno ed esito col pannello: Fase A

7 novembre 2026. Base `e283f522311633fac5a09efa194949b2f2919cc5` su main, checkout inizialmente pulito; contiene il commit richiesto `e283f52`. **Proposta pronta, in attesa della scelta del proprietario. Solo documenti; nessun codice di prodotto, test o asset distribuito modificato.** C4-7 resta non approvato dopo la prova del 7 novembre.

## Decisioni acquisite e perimetro

[D15 e prova](../../../reports/client-c4-report.md#c4-7--prova-del-proprietario-del-7-novembre-2026) prevalgono sulle proposte storiche di C4-7 e C4-7-bis: esito quando compare il pannello, senza spostare il pannello; un suono per colpo, HIT tonfo e CUT lama; eliminare il click iniziale dell'invio su iPhone. Restano `jingles_SAX10.ogg` per vittoria e `jingles_SAX07.ogg` per sconfitta/pareggio, Web Audio, sessione ambient, silenzioso prevalente, volume/muto nel menu, selezione/invio/rifiuto e nessuna attesa sull'input. Nessun recupero dopo salto, interruzione, background o riconnessione. Nessuna informazione affidata solo al suono (regola 13). Nessuna modifica di gioco: regolamento, server, protocollo, catalogo, debug e Set Base esclusi.

## Diagnosi del click di confirmation_001.ogg

Prove eseguite fuori repository, Edge headless/Playwright su Windows, Web Audio `OfflineAudioContext` mono a 48 kHz, stesso OGG di `public/audio`; confronto indipendente con FFmpeg. Sono prove del segnale, **non riproduzione fisica del difetto su iPhone**.

| Ipotesi | Prova e risultato | Interpretazione |
|---|---|---|
| Attacco nel file | Edge: durata decodificata 0,289833 s, primo campione −0,00028993; campioni 2–11: 0,02828, 0,07520, 0,11950, 0,16474, 0,20945, 0,25317, 0,29704, 0,33939, 0,38161, 0,42255; picco assoluto nei primi 5 ms 0,898749. FFmpeg trova 0,898729. | Attacco molto rapido già nel contenuto, confermato da due decoder. Il salto iniziale da zero è piccolo: non attribuire il click a un grosso campione iniziale non nullo. |
| Avvio della sorgente | Render della sorgente a 10 ms, guadagno unitario: differenza massima dai primi 10.000 campioni decodificati = 0. | Sul percorso offline di Edge l'avvio non aggiunge un impulso al file. Non esclude un transitorio hardware/Safari. |
| Campione muto di sblocco | Buffer a un canale, un frame, 22050 Hz, collegato all'uscita come `unlock()`: render, picco assoluto = 0. Il codice lo avvia una sola volta per pagina, non a ogni invio. | Nessun click nel segnale di sblocco provato. Non esclude il risveglio dell'uscita audio di iOS. |
| Decodifica | Due `decodeAudioData` dello stesso file: differenza massima 0. FFmpeg concorda sull'attacco forte con differenze minime da decoder/ricampionamento. | Non c'è un transitorio intermittente aggiunto dal decoder Edge. Safari resta da provare. |
| Attacco di guadagno | Rampa lineare 0→1 in 5 ms, sorgente allo stesso istante: campione iniziale da −0,00028993 a 0; massima differenza tra campioni nei primi 5 ms da 0,046922 a 0,039033 (−16,8%). | Riduce l'asprezza iniziale senza rinviare il comando; l'efficacia percepita richiede ascolto A/B su iPhone. |

**Raccomandazione:** un GainNode per la sola sorgente `send`, inizializzato a zero e portato a uno in **5 ms**, poi collegato al master esistente. Usare `ctx.currentTime` sia per `start(t)` sia per l'automazione, nessun timer/attesa sull'input, nessuna rampa sul master che alteri altri suoni. Il file resta originale e il suo hash resta invariato: nessuna conversione. La pagina offre originale, 5 ms e 8 ms. Se 5 ms non basta, giudicare 8 ms prima di una conversione; non dichiarare risolto il difetto iPhone sulla sola misura Edge. Il guadagno per sorgente si pulisce a fine riproduzione. Gli errori di automazione restano silenziosi, senza bloccare l'invio.

Riproducibilità della misura: `decodeAudioData(bytes.slice(0))` due volte in `OfflineAudioContext(1,48000,48000)`; creare una sorgente col buffer ottenuto, collegarla via gain all'uscita, `start(0.01)`; nella variante `gain.setValueAtTime(0,0.01)` e `linearRampToValueAtTime(1,0.015)`; `startRendering()`. Confrontare uscita da indice 480 col buffer, calcolare massimo assoluto e massimo di `abs(x[i]-x[i-1])` nei 240 campioni iniziali. Ripetere con `createBuffer(1,1,22050)` per lo sblocco. Secondo decoder: FFmpeg, OGG→PCM f32le mono/48000 solo in memoria. Nessun file audio convertito salvato.

## Fonte, download autorizzato e ascolto locale

Licenza esplicita CC0 sulle pagine ufficiali consultate il 7 novembre 2026: [Kenney Impact Sounds](https://kenney.nl/assets/impact-sounds), **1.0 (2019)**, e [Kenney RPG Audio](https://kenney.nl/assets/rpg-audio), **1.0 (2014)**. Autore Kenney (RPG: Kenney Vleugels); entrambi i `License.txt` inclusi confermano CC0 1.0. Nessun'altra fonte, mirror o servizio esterno.

Scaricati con il flusso normale del browser sulle pagine ufficiali, «Download» → «Continue without donating...». Il tool web non gestiva il contenuto ZIP; il browser integrato non si avviava per errore dell'ambiente. Un tentativo proposto di download diretto è stato respinto dal controllo automatico (vincolo del flusso normale e marker in `.git`): non è stato eseguito. Il download riuscito è avvenuto con Edge/Playwright tramite i pulsanti della pagina, in cartella nuova temporanea, senza marker nel repository.

| Pacchetto | Byte | SHA-256 |
|---|---:|---|
| impact-sounds.zip | 800850 | `029d734af1582474edf3a694d1b0cebc97c1c152f2f39fa34d4c2bafc5de77f8` |
| rpg-audio.zip | 964837 | `6dbeaf8544da958d8f2adcb4a4a4b76c1ade34a05f8ab9edccd327da7375f38b` |

Totale **1.765.687 B**, sotto i 5 MB autorizzati. Cartella di ascolto: `%TEMP%\bm-c4-7-ter-20261107-listen`; ZIP, licenze, misure, script della diagnosi e pagina restano fuori dal repository. Nessun file aggiunto a `public/audio`, nessun cambio all'inventario di distribuzione.

Pagina: **http://192.168.1.79:8767/**. PC e iPhone sulla stessa rete domestica, aprire in Edge/Safari; disattivare il silenzioso su iPhone, partire dal 20% e confrontare un candidato alla volta. Ogni pressione ferma il precedente. Il messaggio «Avvio richiesto» non certifica un suono udito. Prima i candidati HIT e CUT, poi POISON, confronto conferma e infine i suoni attuali per giudicare la distinzione. Le proposte sono in cima ai gruppi; massimo tre file candidati per tipo.

Il server è legato solo all'IP privato `192.168.1.79`, porta 8767, accetta solo indirizzi 192.168.1.*, serve esclusivamente `www`, senza elenco delle directory; nessun tunnel, hosting o pubblicazione. HTTP 200 e pulsanti di riproduzione controllati su Edge a 390×844: zero errori di pagina e nessuno scorrimento orizzontale. Raggiungibilità dall'iPhone e firewall **non verificati**; se non apre, controllare stessa Wi-Fi e autorizzazione della rete privata, senza aprire porte sul router. Indirizzo soggetto a cambio della rete. Per arrestare: leggere `server.pid` nella cartella e fermare solo quel processo Python; per riavviare `python "$env:TEMP/bm-c4-7-ter-20261107-listen/serve.py"` se l'IP è ancora quello.

## Candidati (originali, nessuna conversione)

Durate del contenitore misurate con ffprobe; byte e SHA-256 dei file originali. I motivi sono raccomandazioni da giudicare all'ascolto, non una certificazione di timbro o distinguibilità. Nessun ascolto umano svolto dall'esecutore.

| Tipo | File | Secondi | Byte | Motivo |
|---|---|---:|---:|---|
| HIT | `impactPunch_heavy_000.ogg` | 0.649025 | 11617 | Proposta: tonfo pieno da pugno, coerente col colpo. |
| HIT | `impactPunch_heavy_001.ogg` | 0.535941 | 10861 | Alternativa di tonfo pesante da confrontare senza cambiare volume. |
| HIT | `impactPunch_medium_000.ogg` | 0.430544 | 8800 | Alternativa meno pesante per sequenze fitte. |
| CUT | `knifeSlice.ogg` | 0.599542 | 15532 | Proposta: gesto di lama, distinto da click e jingle. |
| CUT | `knifeSlice2.ogg` | 0.568792 | 15099 | Seconda variante della lama per confronto. |
| CUT | `drawKnife1.ogg` | 0.399708 | 11134 | Alternativa metallica: rischio di sembrare estrazione anziché colpo. |
| POISON | `impactSoft_medium_000.ogg` | 0.118005 | 5351 | Alternativa propria: impulso morbido; non identifica davvero il veleno. Preferisco nessuno. |

**POISON: raccomando nessuno.** Il veleno non è un pugno e questi pacchetti non offrono un gorgoglio riconoscibile senza elaborazione. La pagina mette prima il silenzio, poi «come HIT» e l'impulso morbido `impactSoft_medium_000.ogg` come suono proprio. Il segno visivo resta, nessuna perdita d'informazione. Se si preferisce un vero suono di veleno, proporre un'altra fonte e fermarsi prima di scaricare. La scelta raccomandata porta a sette file distribuiti: tre di input, due esiti e due colpi (un file in più rispetto ai sei di oggi, rimuovendo il vecchio impatto); questo supera di uno l'indicazione iniziale 4–6 di D2 per soddisfare D15, senza aggiungere musica.

### Impronte dei candidati

- `impactPunch_heavy_000.ogg`: `b33a8f14068aec24ec69ba85e5e87fdc41228975f6a1a3e44a6e7d6fc3d9f8d8`.
- `impactPunch_heavy_001.ogg`: `f92f5cb6ba4ff2766497292ffd90865654317eeca976f5652e0708dbdcdc0dd9`.
- `impactPunch_medium_000.ogg`: `486988aa2d6440ffc4c62a0e8ccf3c23673ba84424bd4723378d451b7255eb5c`.
- `knifeSlice.ogg`: `4cd96dc630bed9840c15f1dd2306da2cc56a4da26a5d3f1a03c5a7265ac5e54f`.
- `knifeSlice2.ogg`: `6c2064d0ef988d1ec3d56868e823ea8823a5cac00f2742560052633529407def`.
- `drawKnife1.ogg`: `276403e72c3b71c47bc24db3083970c23f8e5551ffa78f436f83483c56f3f0bb`.
- `impactSoft_medium_000.ogg`: `7d3ba0bb5e60a11b5d3e558c141303dcf494256675fbf753c0d252d2cf0481e3`.

## Regole proposte, tutte da scegliere prima della Fase B

Il tipo segue **il danno nominale e lo stesso `impactOf` del segno visivo**, non una deduzione dal delta HEALTH o dal log del server: conversioni, immunità, veleno di fine turno e danno a sé non sono attribuibili a colpi distinti dal protocollo corrente. Un «colpo» qui è il punto `hitAt` di una carta risolta non annullata con tipo nominale sonoro; non ogni sottrazione di Salute. Struggle resta un colpo della carta, non due per il danno a sé e al bersaglio. Questa limitazione va mantenuta esplicita anche nel rapporto B.

| Caso | Raccomandazione | Alternativa e motivo della scelta |
|---|---|---|
| Carta con più tipi | **Una emissione per carta**, scegliendo CUT > HIT > POISON; POISON silenzioso non sopprime un HIT/CUT. Stesso criterio indipendente dall'ordine del testo, tipi duplicati deduplicati. | Un suono per tipo simultaneo è più fedele ai simboli ma rende un solo colpo una miscela; nessuna sequenza aggiuntiva né variazione delle durate. |
| Carta senza danno, sconosciuta o annullata | **Nessun colpo sonoro**; restano simbolo di ruolo o ANNULLATA. | Un tonfo per ogni posa confonderebbe difesa, risorse, annullamento e danno. |
| Colpi vicini/sovrapposti | **Ogni colpo ha la propria sorgente**, senza fermare il precedente; nessuna coda né ritardo. Se più eventi partono nello stesso aggiornamento, gain 1/N per ciascuno del gruppo. | Sopprimere il precedente perde un colpo; serializzare crea ritardo. Verificare somma e pulizia delle sorgenti. |
| Tocco sul vuoto che scavalca più colpi | **Tutti i colpi raggiunti o scavalcati**, una volta ciascuno, al tocco, coi propri file e gain 1/N; segnare consumati anche i silenziosi. Niente suoni per colpi successivi al punto d'arrivo. | Solo l'ultimo evita sovrapposizioni ma perde colpi chiesti dal proprietario. La normale progressione temporale consuma ogni punto una volta; un frame tardivo non recupera una sequenza interrotta. |
| Scelta dalla mano che termina la sequenza | **Scarta i colpi pendenti**: selezione e invio restano come oggi, nessun recupero al comando. | Non trasformare un input di gioco in un recupero audio. |
| Esito e colpi nel round finale | **Esito al pannello, colpi ai loro punti usuali**, senza sostituirsi. L'esito ha identità separata dalla sequenza e parte una sola volta anche se questa viene chiusa da input. | Nessun impatto fittizio al pannello; niente spostamento del pannello o delle animazioni. |
| Pannello nuovo dal vivo senza sequenza (movimento ridotto, forfait, tempo) | **Esito immediato al pannello**, purché evento nuovo ricevuto da connessione continua in pagina visibile; loss per sconfitta/pareggio, win solo se vincitore. | Richiedere una sequenza renderebbe questi esiti muti senza motivo. Nessun colpo ricostruito. |
| Pannello su riconnessione o partita riaperta | **Muto**, inclusa la prima vista già finale al montaggio: è storia, non nuovo esito. Consumarlo senza emissione; nessun recupero allo sblocco/decodifica tardiva o ritorno in primo piano. | Il suono su ogni montaggio violerebbe il divieto di recuperi tardivi. Serve provenienza della transizione, non solo `panel=true`. |
| FFA: propria morte, «Resta a guardare» (D11) | **Loss al primo pannello personale nuovo dal vivo**, anche se la partita continua. Resta a guardare non ripete né ferma la sequenza degli altri; all'esito finale nessun secondo esito personale. Identità per partita e giocatore, conservata fra viste/render. | Risuonare alla fine globale darebbe due sconfitte nella stessa partita. Nessun cambio del flusso D11. |
| «Nuova partita» o «Torna all'hub» subito dopo il pannello | **Interrompe tutti i suoni**, compreso l'esito già partito; il nuovo tavolo non recupera nulla. | Lasciar finire la fanfara porta l'audio nella partita o schermata nuova. Il giro Verify deve comunque osservare l'avvio prima dell'uscita. |
| «Salta effetti» | **Ferma colpi ed esito già attivi e scarta i colpi pendenti**; l'esito già avviato al pannello rimane consumato. Se l'esito arriva più tardi come nuovo evento dal vivo, suona al nuovo pannello; lo skip non silenzia eventi futuri della partita. | Nessun recupero sonoro causato dallo skip. |
| Interruzione, resize, background, disconnessione | **Background, disconnessione e reset fermano e consumano tutto l'audio attivo/pendente**, nessuna ripresa. **Interruzione e resize** (comprese barra di Safari/`visualViewport`, `pointercancel`, Esc, vista nuova, movimento ridotto) **fermano e consumano solo i colpi del round**; il jingle d'esito e i suoni dell'interfaccia proseguono e quelli rimandati non si annullano (J2, scelta del proprietario del 10 novembre 2026, [C4-11](../spazio/proposta.md#scelta-del-proprietario): «va bene la correzione j2»). Resize non cambia la regola visiva esistente. | Il pannello resta leggibile e non produce una seconda emissione al rientro. Prima di J2 anche l'interruzione fermava tutto, e un ridimensionamento troncava il jingle che parte col pannello. |
| Muto, volume zero, contesto non pronto, file mancante | **Consuma comunque l'evento**, senza coda, eccezioni né attesa; riattivare il suono non ripete nulla. | Sblocco e decodifica non diventano nuovi eventi di gioco. |

## Sonde, test e controlli proposti

`check-audio-probe.mjs` oggi impone massimo un suono per round e richiede una sequenza aperta anche per l'esito: queste due condizioni sono **deliberatamente superate da D15**. Non basta togliere le asserzioni: sostituirle con identità e conteggi più precisi.

- `verify-audio-probe`: conservare tracciamento fetch→decode→buffer→start, pagina, tempo monotono, controlli console/errori/origini, media vietato e sblocco muto separato. Aggiungere identità del colpo (partita, turno, indice mossa), tipo nominale, file atteso, tempo/punto raggiunto, motivo del consumo (tempo/tocco/scarto), generazione. Il piano dei colpi va confrontato anche ai dati delle mosse e ai segni visivi osservati, per non validare un piano audio incompleto contro sé stesso.
- Esito: registrare passaggio al pannello e identità personale separata, origine live/storica, risultato e visibilità/connessione; correlare `start` del file all'evento e all'apparizione DOM `.outcome` mediante osservazione della pagina. Avvio nello stesso aggiornamento del pannello, prima di ogni comando di uscita; riportare differenza fra i due tempi, senza riusare una tolleranza di secondi. Nessun `running` richiesto per l'esito; rimane obbligatorio per i colpi.
- Checker: esattamente un avvio per ciascun colpo sonoro raggiunto con audio disponibile; nessuno per carte mute/annullate o punti non raggiunti, niente duplicati a vista ripetuta; tipo/file coerenti. Un esito esatto per pannello personale live idoneo, nessuno storico; win/loss corretti, pareggio loss. Verificare che navigazione, skip e interruzioni fermino le sorgenti, senza start successivi nella generazione chiusa. Nessuna deroga globale a errori HTTP: giro mancanti distingue solo gli URL audio intenzionalmente rimossi e continua a vietare tutti gli altri errori.
- Conservare `--blocked`: zero eventi udibili; mantenere copertura `--require=win,loss,input`. `input` diventa esito già avviato al pannello **prima** che un tocco chiuda la sequenza, non esito rimandato al tocco. `VerifyOutcomeAudio` deve includere lascia scorrere, tocchi, skip, resize e uscita immediata, più pannelli senza sequenza, vista finale ripetuta, FFA/watch e storici. Verify ufficiale deve contenere esiti anche se lascia immediatamente il tavolo.
- Test unitari: uno per ciascuna riga della tabella, più backend che registra le automazioni di gain (solo send, 0→1 in 5 ms, stesso start; master/volume invariati), doppia decodifica/errore, risorse pulite e nessuna attesa. HIT e CUT su seconda/quinta carta, multi-tipo, senza danno, void, tocchi con 0/1/N colpi, sovrapposizioni, esito prima del primo colpo e indipendente dall'input. Regressioni storiche conservate dove non superate da D15; attesi modificati solo per regole approvate e dichiarati nel rapporto.
- Prova di sensibilità come C4-7-bis: copiare sorgenti e nuovi test **fuori repository**, mutare separatamente alla semantica di `c197517` (primo colpo soltanto; drop unico; esito colpo/coda e sostitutivo; nessun attacco). Registrare test falliti per ciascuna mutazione. I controlli già validi su c197517 (muto, errori, interruzione) devono restare verdi: non inventare un rosso per essi. Una funzione assente/import fallito non dimostra sensibilità al comportamento.

## Fase B dopo la scelta

Copiare solo i file scelti in `public/audio`, rimuovere `drop_004.ogg` se inutilizzato, aggiornare inventario (autore, fonte ufficiale, versione/licenza, byte, SHA-256) e crediti esistenti per i due pacchetti. Nessuna conversione proposta. Nessuna soglia, atteso o BASE_750 cambiati per recuperare un verde.

Verifiche **una alla volta**, prima di ciascuna porte 8080/4320 libere e nessun Java/Maven altrui; attendere/chiedere se lavora Set Base. Ricostruire qui il jar con `./scripts/build.ps1 -Task Server` (Offline dopo il primo giro). Poi, con sonda e BM_OUT separati:

1. `./client-web/run.ps1 -Task VerifyAll -Only 'test,build,size,verify,layout'`, esito osservato anche in Verify che esce subito.
2. VerifyResolution quick e interrupt.
3. Verify con audio negato e poi file mancanti (ripristino nel finally).
4. VerifyOutcomeAudio e checker `--require=win,loss,input`.
5. 750×292, `-Only 'build,verify,layout' -Measures 750x292`: confronto con C4-7-bis (Verify timeout status-tip; 48 problemi layout, duello 6/6/6 e FFA 11/11/11; BASE_750 2 posti [6,6,6,5], 5 posti [11,11,12,14]). Nessun giro ripetuto per cercare il verde.
6. `./scripts/build.ps1 -Task Test -Offline`, poi `python scripts/check-rules.py`. Contesto Spring distinto, non dedotto dai test unitari.

Evidenze finali in `docs/reports/client-c4/c4-7-ter/`, circa 5–10 MB secondo D13, JSON finali e sole catture utili; limiti Size rigidi e texture 32 MiB invariati (D9). Rapporto «C4-7-ter — Fase B», piano/roadmap/indice e README client se cambia: «C4-7: fatto dopo C4-7-ter, in attesa del giudizio del proprietario». iPhone, Safari, silenzioso, suono realmente udito e latenza vanno dichiarati non verificati finché il proprietario non prova.

## Scelta richiesta

Scegliere HIT, CUT e trattamento POISON; giudicare il confronto della conferma (5 ms raccomandati, 8 ms alternativa); approvare o correggere le regole della tabella. Esito col pannello, file degli esiti e un suono per colpo sono già decisi e non si riaprono. Fino alla scelta nessuna Fase B.
