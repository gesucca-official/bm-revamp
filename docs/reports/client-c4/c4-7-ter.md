# C4-7-ter — Fase A

7 novembre 2026, base `e283f522311633fac5a09efa194949b2f2919cc5` su main, checkout pulito alla partenza e commit richiesto presente. **Fase A pronta, in attesa della scelta del proprietario. C4-7 resta non approvato; Fase B non avviata.** [Proposta completa, misure, regole, controlli e istruzioni di ascolto](../../design/client-c4/audio/proposta-colpi.md).

**Solo documenti.** Regolamento, server, protocollo, catalogo, client-debug, file del Set Base, codice e test del client, asset e inventario distribuiti invariati. Nessun atteso, soglia o BASE_750 cambiato.

**Click:** nel file decodificato il picco nei primi 5 ms è 0,898749 (Edge) e 0,898729 (FFmpeg). Il render Web Audio dell'avvio coincide coi campioni decodificati (differenza 0); sblocco muto con picco 0; doppia decodifica identica. Provato il contenuto dell'attacco forte, non la causa hardware del click su iPhone. Rampa proposta di 5 ms sul guadagno della sola sorgente send, senza ritardare l'invio: campione iniziale a zero e salto massimo nei primi 5 ms ridotto del 16,8%. Pagina A/B con originale, 5 ms e alternativa 8 ms. Nessun audio convertito o modificato.

**Candidati:** Kenney Impact Sounds 1.0 e RPG Audio 1.0, CC0 esplicita sulle pagine ufficiali e nelle licenze incluse; download dal normale flusso delle pagine con Edge/Playwright in cartella nuova fuori repository. Un tentativo diretto proposto è stato respinto dal controllo automatico e non eseguito; nessun aggiramento, nessun mirror. ZIP 800850 + 964837 = **1.765.687 byte**, sotto 5 MB. Proposte HIT `impactPunch_heavy_000.ogg` (11617 B, 0,649025 s) e CUT `knifeSlice.ogg` (15532 B, 0,599542 s); tre candidati per gruppo. POISON raccomandato silenzioso, alternative come HIT o `impactSoft_medium_000.ogg` (5351 B, 0,118005 s). SHA-256 individuali e dei pacchetti nella proposta.

**Ascolto:** [pagina solo LAN](http://192.168.1.79:8767/), PC/iPhone sulla stessa rete; su iPhone disattivare il silenzioso. Server legato a IP privato, senza tunnel o pubblicazione, file solo in `%TEMP%\bm-c4-7-ter-20261107-listen`. HTTP 200, avvio dei candidati e della variante conferma verificati con Edge/Playwright, viewport 390×844: nessun errore JS e nessuno scorrimento orizzontale. Pagina lasciata attiva per la scelta; istruzioni di arresto/riavvio nella proposta. Nessun ascolto umano né raggiungibilità dall'iPhone provati dall'esecutore.

**Regole da scegliere:** tipo nominale coerente col segno visivo; una emissione per carta, priorità CUT > HIT > POISON per multi-tipo; nessun colpo sonoro per carte senza danno o annullate; colpi vicini con sorgenti indipendenti; tutti i colpi scavalcati dal tocco al tocco, con guadagno 1/N per emissioni simultanee. Esito indipendente al pannello, una volta per risultato personale live anche senza sequenza; viste storiche/riconnessione mute, nessun doppio esito dopo «Resta a guardare». Navigazione, skip e interruzioni fermano i suoni, niente recuperi. Tabella completa, alternative e motivi nella proposta: sono raccomandazioni, non decisioni già approvate.

**Sonde:** proposto il passaggio dalla guardia unica per round a identità per colpo e per esito personale, conteggio esatto dei punti raggiunti, confronto coi segni visivi e col pannello DOM; conservati errori/origini, divieto HTMLMediaElement, audio bloccato, mancanza file e copertura win/loss/input. Proposti test per ogni regola e mutazioni fuori repository della semantica c197517, senza usare import falliti come prova. Nessuna modifica alle sonde in Fase A.

**Verifiche eseguite:**

- `./scripts/build.ps1 -Task Test -Offline`: **579 server, zero fallimenti/errori, 7 saltati; client-debug 36/36**. Porte 8080 e 4320 libere e nessun Java/Maven esterno prima del lancio; nessun avvio del server per la diagnosi.
- `python scripts/check-rules.py`: **PASS**. `git diff --check`: PASS.
- Client `run.ps1 -Task Test`: **255/255**; `Build`: PASS (avviso Vite di chunk oltre 500 kB non compressi, soglie immutate); `Size`: PASS, JS gzip **340716 / 512000 B**, totale **1733198 / 4194304 B**, texture **27729048 / 33554432 B** per C4. Risultati uguali a C4-7-bis.
- Tentativo aggiuntivo `VerifyAll -Only 'test,build,size'`: **non completato**, exit 2 prima dei test: il lanciatore tenta di ricostruire il jar con Windows PowerShell e non trova `Get-FileHash`. I tre controlli sopra sono stati eseguiti singolarmente con successo; non si dichiara VerifyAll verde e non si cambia il lanciatore in questo blocco. Log in cartella temporanea.

**Non verificato:** nuovo comportamento di prodotto (non implementato), partite vere di C4-7-ter, iPhone/Safari, decodifica e interruttore fisico, suono effettivamente udito, distinguibilità e latenza percepita. `TestServerContext` e `verify-match-manifests.py` non eseguiti: nessuna attestazione di avvio Spring. Verifiche grafiche/750×292 e giri audio di Fase B non eseguiti. Nessuna nuova evidenza grafica da 5–10 MB necessaria in Fase A: misure numeriche nel documento, materiali di ascolto e script temporanei fuori git (D13).

**Al proprietario:** su PC e iPhone ascoltare HIT/CUT e confronto conferma; scegliere POISON e approvare/correggere la tabella delle regole. L'esito col pannello e un suono per colpo sono già decisi. Dopo la scelta si implementa e si esegue la matrice B, affrontando prima il problema del lanciatore; nessun codice di prodotto in questa fase.


# C4-7-ter — Fase B

7 novembre 2026, base `0e26924`; scelta registrata e pushata in `7b93b19`. **C4-7: fatto dopo C4-7-ter, in attesa del giudizio del proprietario.** [Scelte](../../design/client-c4/audio/scelte.md#c4-7-ter--scelta-sulla-fase-a), [regole approvate e diagnosi](../../design/client-c4/audio/proposta-colpi.md), [evidenze finali](c4-7-ter/README.md), [conteggi](c4-7-ter/verifiche.json).

## Risultato e perimetro

HIT usa **impactPunch_heavy_001.ogg** (10861 B, 0,535941 s); CUT **knifeSlice.ogg** (15532 B, 0,599542 s); POISON resta muto. OGG originali Kenney CC0 1.0, da Impact Sounds 1.0 (2019) e RPG Audio 1.0 (2014), scaricati in Fase A tramite pagine ufficiali. Inventario versione 4 con autore, URL ufficiali, licenza, byte e SHA-256; crediti aggiornati nella home esistente. `drop_004.ogg` rimosso. Sette file, **92075 B** totali; nessuna conversione.

`hitCues` segue lo stesso danno **nominale** del segno visivo, non inferisce danni effettivi, conversioni o causalità dai delta Salute. Ogni carta non annullata con HIT/CUT ha il proprio evento `partita/turno/indice`; multi-tipo CUT > HIT > POISON, carte senza danno, sconosciute o annullate mute. Struggle non diventa due colpi per il danno a sé. I colpi ravvicinati hanno sorgenti indipendenti; un tocco consuma tutti e soli i punti raggiunti, una volta ciascuno, con gain 1/N per le emissioni dello stesso aggiornamento. Nessuna coda o variazione del ritmo della sequenza. Scelta dalla mano scarta i pendenti.

L'esito personale è separato dalla sequenza: `OutcomeSounds` rileva una transizione nuova dal vivo e `useLayoutEffect` avvia il jingle quando il pannello è nel DOM, prima del paint. Il pannello non è spostato. Funziona anche senza sequenza; prima vista già finale, riconnessione, reset o esito ricevuto in background sono consumati muti. FFA: una sconfitta al primo pannello personale, niente secondo esito dopo «Resta a guardare». Fine normale/input lasciano finire un suono già partito; navigazione, salto e interruzioni fermano le sorgenti e non recuperano eventi. Il salto non impedisce un esito futuro nuovo dal vivo.

Per l'invio, un GainNode della sola sorgente sale da 0 a 1 in **5 ms**, con automazione e `start` sullo stesso `currentTime`; nessun timer o attesa sul comando. `confirmation_001.ogg` conserva peso e impronta. Selezione e rifiuto mantengono file e transizioni. Restano contesto unico, buffer decodificati una volta, master per volume/muto, preferenze persistenti, sessione ambient e interruttore silenzioso prevalente. Errori e audio non disponibile non bloccano il gioco e non lasciano recuperi; nessuna informazione solo sonora.

Non modificati regolamento, server, protocollo, catalogo, client-debug o file del Set Base. Nessuna geometria cambiata. `BASE_750`, soglie e test estranei all'audio invariati.

## Test e sensibilità

**265/265** test client, con **25** focalizzati su audio ed esito. Le quattro aspettative storiche di C4-7-bis sull'esito al colpo/coda e sulla sostituzione dell'impatto sono superate da D15 e dall'approvazione della Fase A, non mantenute artificialmente. Ricostruiti i test per pannello live, vittoria/sconfitta/pareggio, pannello senza sequenza, viste storiche, riconnessione/reset/background, FFA/watch, ogni colpo (secondo e quinto inclusi), multi-tipo, POISON, carte annullate/sconosciute, tempo e tocchi 0/1/N, input e interruzioni. Backend verifica sorgenti indipendenti, gain 1/N, attacco send esatto, master invariato, consumo in muto/volume zero/file assente/contesto sospeso e arresto dei suoni. Restano le prove di selezione/invio/rifiuto, storage, sblocco, ripiego silenzioso e notifiche accodate.

[Mutazioni su copie fuori repository](c4-7-ter/mutazioni.json): baseline **25/25**; ripristinare separatamente le semantiche di `c197517` (primo colpo soltanto; stesso file di impatto; nessuna emissione dal pannello in attesa della sequenza; esito sostitutivo; nessun attacco send) fa fallire **1, 1, 3, 1, 1** test. Nessun import mancante conta come prova. I controlli già validi sulla base non sono stati forzati a fallire. Nessun atteso cambiato per assorbire una regressione: i cambi semantici dei test sono quelli deliberatamente approvati.

## Sonda e verificatore

Conservati fetch→decode→buffer→start, pagina, errori, origini esterne vietate, divieto HTMLMediaElement e audio negato. Aggiunti identità e consumo per colpo/esito, piano confrontato coi segni d'impatto realmente costruiti, punto raggiunto e tipo/file attesi. Il checker richiede esattamente un avvio per evento disponibile, nessun duplicato, colpi solo nella sequenza aperta e nessun recupero dopo chiusura; per l'esito richiede il pannello già nel DOM. Registra anche gli stop delle sorgenti; arresto e mancata ripresa hanno test unitari. [Sensibilità del checker](c4-7-ter/checker-sensibilita.json): registro valido accettato; duplicato, esito perso, colpo perso, file errato, esito in un altro turno JS e HTMLMediaElement tutti respinti.

La prima nuova asserzione confrontava due timestamp arrotondati al millisecondo: segnalava 1 ms fra due chiamate sincrone. Corretta **senza aggiungere tolleranze temporali**: la sonda marca il turno sincrono del pannello e cancella il marcatore nella prima microtask; lo start deve portare quel marcatore. Ripetuto il giro ufficiale, stesso hash dist, sonda definitiva verde. Gli avvii osservati sono chiamate API, non suoni fisicamente uditi. `input` in `--require=win,loss,input` ora significa esito già avviato al pannello prima che il tocco chiuda la sequenza.

## Verifiche completate, una alla volta

Prima di ciascun giro porte 8080/4320 libere e nessun Java/Maven esterno; mai fermati processi altrui. Prima `./scripts/build.ps1 -Task Server` qui, poi ricostruzione Offline nel primo VerifyAll: jar **09966f18e97e23ae**, riusato dichiaratamente nei giri successivi, nessun jar di un'altra macchina. Il problema di Get-FileHash della Fase A si risolve nel solo ambiente del processo figlio usando i moduli WindowsPowerShell, senza modificare il lanciatore. Build client **b54a1228128dd03e**, invariata nei giri.

| Giro | Esito |
|---|---|
| VerifyAll `-Only 'test,build,size,verify,layout'`, misure ufficiali | **7/7**, ripetuto dopo la correzione della sonda; 76 round, fino a 2 colpi nello stesso round, 3 vittorie e 1 sconfitta al pannello anche dove Verify esce subito |
| VerifyResolution quick e interrupt, entrambe le misure (con test/build/size) | **5/5**; 34 round, fino a 2 colpi/round, 2 sconfitte al pannello, controlli di sequenza e interruzione verdi |
| Verify con audio negato, poi file mancanti, entrambe le misure | **2/2 + 2/2**, zero avvii udibili. Rimossi i sette file solo da dist/audio e ripristinati nel finally; Vite dà fallback HTML, che non si decodifica. Primo runner mancanti fermato prima della rimozione per rename fra dischi, corretto con copia di sicurezza/rimozione dei soli file generati; nessuna modifica al prodotto |
| VerifyOutcomeAudio, entrambe le misure | **8/8 partite**, **16 esiti personali** (4 vittorie e 4 sconfitte per misura), checker **--require=win,loss,input PASS** per entrambe; copre wait, tapAll, tapCross, skip, resize, uscita immediata e movimento ridotto senza sequenza |
| 750×292 `-Only 'build,verify,layout'` | build e Verify **verdi**, layout **rosso preesistente**, confronto sotto; un solo giro, non ripetuto per cercare un verde |
| `./scripts/build.ps1 -Task Test -Offline` | **579 server, zero errori/fallimenti, 7 saltati; client-debug 36/36** |
| `python scripts/check-rules.py` | **PASS** |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | **686 test, 0 fallimenti, 0 errori, 7 saltati**, BUILD SUCCESS; verifica distinta dell'avvio e degli scenari applicativi |
| `python scripts/verify-match-manifests.py` | **PASS**, manifest storici non rigenerati |

**750×292:** [confronto](c4-7-ter/m750/comparison.json) con C4-7-bis: duello **6/6/6 → 6/6/6**, FFA **11/11/11 → 11/11/11**; problemi complessivi **48 → 47**. Normalizzando solo gli ID computer e l'ordine delle coppie sovrapposte, nessun problema aggiunto; manca soltanto il vecchio errore dell'ispezione del gettone. Non si attribuisce una correzione del layout all'audio. Restano carte del round senza spazio, sovrapposizioni, primi piani e posti troppo piccoli. Verify questa volta passa: la base era variabile (gettone coperto dalla mano). BASE_750 sugli stessi input resta **[6,6,6,5]** per 2 posti e **[11,11,12,14]** per 5, test invariato e verde; nessuna soglia o atteso rilassati.

**Size:** JS gzip **341745 / 512000 B**, totale **1751615 / 4194304 B**, atlante massimo 2048 px, texture **27729048 / 33554432 B** per C4 (limite rigido 67108864). Audio 92075 B, gzip 77910 B. Tutto verde; tetti D9 invariati.

**Input**, quattro campioni duello/FFA: desktop **16,1 / 50,7 / 19,6 / 24,5 ms**, compatto **13,5 / 19,4 / 18,5 / 20,0 ms**. Tutti sotto 100 ms. Il primo giro sulla stessa build aveva desktop 12,8/14,6/15,8/29,5 e compatto 14,0/13,6/18,1/24,1; C4-7-bis aveva massimi 31,5 e 21,5. Si registra il picco di 50,7, senza nasconderlo né dedurne identità di prestazioni da partite diverse. Primo gesto di sblocco e latenza sonora percepita non misurati.

Evidenze finali circa **7.68 MB**, JSON e registri più sole catture finali selezionate e compresse (D13). Log completi, copie mutate e materiali intermedi fuori git. Catture osservate su Edge/PC; nessun cambiamento visivo del pannello o della geometria.

## Non verificato e prova del proprietario

Non verificati **iPhone, Safari, interruttore fisico, suono realmente udito e latenza percepita**; l'efficacia dell'attacco di 5 ms sul click segnalato richiede la prova fisica. Pannelli da forfait/tempo, storia finale recuperata e secondo esito FFA dopo «Resta a guardare» sono coperti dal contratto unitario del controller; non esiste un giro audio dedicato sul server vero per ognuno di questi casi. Il giro reale senza sequenza copre movimento ridotto. Il tipo sonoro è nominale come quello visivo: non certifica danno effettivo o conversioni. Non si dichiara verificato ciò che non è stato provato.

Al proprietario: **PC** — lasciare scorrere un round con due colpi e distinguere tonfo/lama, provare tocchi rapidi, vittoria/sconfitta al pannello, uscita immediata, skip e volume/muto; **iPhone** — stessi casi, soprattutto conferma senza click fastidioso e reattività, prima con silenzioso disattivato poi attivato (deve prevalere). In FFA verificare la sconfitta personale e «Resta a guardare» senza secondo jingle alla fine. La scelta dei file e delle regole è già approvata; resta il giudizio sul risultato implementato.

# C4-7-ter — prova del proprietario del 7 novembre 2026

Parole del proprietario dopo una prova della Fase B: «l'unico feedbackc he ho per ora è che il volume del sound effect del taglio è troppo alto rispetto agli altri effetti»; «mettiamo questo fix da fare da qualche parte e poi partiamo con la prossima attività».

Lettura della regia: rilievo sul livello di `knifeSlice.ogg`, non sulla scelta del file o sulle regole. La correzione è la Fase 0 di [C4-10](../../client-c4-plan.md#c4-10--guida-visiva), in un commit a sé; il giudizio su C4-7 si dà dopo di essa. Per decisione del proprietario si parte con C4-10.

Nessun codice cambiato, nessuna verifica eseguita per questa registrazione.
