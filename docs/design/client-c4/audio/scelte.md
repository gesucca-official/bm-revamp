# C4-7 — Scelta del proprietario

6 novembre 2026. Il proprietario approva la proposta della Fase A (`25867a8`): «i suoni li approvo».

Scelti: `click_001.ogg` (selezione), `confirmation_001.ogg` (invio), `error_001.ogg` (rifiuto), `drop_004.ogg` (impatto), `confirmation_002.ogg` (esito unico per vittoria, sconfitta e pareggio). Volume iniziale 20%, attivo; volume e muto nel menu «Al tavolo» come proposto.

Autorizzato il download del solo pacchetto [Kenney Interface Sounds](https://kenney.nl/assets/interface-sounds) dalla pagina ufficiale; nessun mirror. Se il file supera 2 MB o la licenza inclusa non è CC0, fermarsi prima dell'uso. Copiare solo i cinque file approvati e inventariarli con peso e SHA-256.

## C4-7-bis — Scelte sulla Fase A

6 novembre 2026, sulla [diagnosi e proposta](proposta-esito.md) (`d4467ec`). Parole del proprietario:

1. «Suoni: strada A. Autorizzato il download del pacchetto «Music Jingles» solo dalla pagina ufficiale https://kenney.nl/assets/music-jingles, tetto 2 MB, licenza CC0 inclusa, in una cartella nuova fuori dal repository, solo per l'ascolto. Misura durate e pesi dei file SAX e PIZZI e tieni quelli sotto 2 s. Prepara una pagina d'ascolto locale, servita in LAN e apribile anche da iPhone, senza pubblicarla all'esterno: al massimo 8 candidati per la vittoria e 8 per la sconfitta, con la tua proposta in cima e una riga di motivo per ciascuno. Poi fermati e dammi istruzioni per aprirla: i due file li scelgo io. Pareggio: stesso suono della sconfitta.»
2. «Momento: opzione 1, sul colpo decisivo. Se la fine non viene da una carta, all'inizio della coda. Un tocco che scavalca quel punto o chiude la sequenza fa suonare l'esito una volta, al tocco. «Salta effetti», interruzioni, background e riconnessione restano muti, senza recuperi tardivi. Il pannello d'esito non cambia. La regola del ridimensionamento non cambia in questo blocco.»
3. «Web Audio: sì, come nella proposta (contesto unico, buffer decodificati una volta, GainNode per volume e muto, ripiego silenzioso, audioSession 'ambient' dove esiste).»

La scelta dei due file (vittoria; sconfitta e pareggio) segue l'ascolto e sarà registrata qui.

### Scelta dei file dopo l'ascolto

6 novembre 2026, sulla pagina d'ascolto in LAN (8 candidati per esito, Kenney «Music Jingles» 1.0, CC0). Parole del proprietario: «sconfitta SAX07 vittoria SAX10».

Scelti: `jingles_SAX10.ogg` per la vittoria; `jingles_SAX07.ogg` per la sconfitta e, come deciso, per il pareggio. `confirmation_002.ogg` esce da `public/audio` e dall'inventario.

Osservazione del proprietario sulla stessa pagina: «su un iphone 15 (mia moglie) dice riprodotto, ma non si sente niente anche alzando il volume. su un iphone 16 pro (mio) si sentono tutti». La pagina suona con Web Audio, come il gioco dopo C4-7-bis. Ipotesi non verificata: l'iPhone 15 era in modalità silenziosa, che Web Audio rispetta (`audioSession` 'ambient', scelto dal proprietario), mentre un elemento `<audio>` può suonare comunque. Da riprovare sul dispositivo con la modalità silenziosa disattivata.
