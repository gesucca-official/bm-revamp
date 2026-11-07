# C4-7-ter — Evidenze della Fase B

7 novembre 2026. Scelta del proprietario in `7b93b19`, su proposta `0e26924` e base di prodotto `c197517`. Solo client web, suoni e documenti C4; regolamento e server invariati.

- `ufficiale/`: VerifyAll test/build/size/verify/layout, misure 1366×768 e 844×390, 7/7 verde. Jar ricostruito qui, SHA-256 abbreviato `09966f18e97e23ae`; il giro finale lo riusa dichiaratamente. Build client verificata `b54a1228128dd03e` (hash del contenuto dist calcolato da VerifyAll).
- `resolution/`: quick e interrupt, entrambe le misure, 5/5 verde con test/build/size. JSON reali e sonda separata.
- `blocked/` e `missing/`: Verify su entrambe le misure; zero avvii udibili. File dist ripristinati dopo il giro mancanti. I test, build e size della stessa build sono nel giro ufficiale; queste partite usano direttamente Verify con server e preview temporanei propri.
- Registri `*-audio.jsonl`: avvii Web Audio correlati a file, colpi e pannello; sono chiamate API su Edge/PC, non suoni uditi o misure fisiche di latenza. `*-check.json`: conteggi verificati.
- `mutazioni.json`: prove su copie esterne al repository. Baseline 25/25; primo colpo soltanto, file unico, esito che aspetta la sequenza, esito che sostituisce i colpi e assenza di attacco fanno fallire rispettivamente 1, 1, 3, 1 e 1 test. Nessun import fallito usato come prova.

La prima versione del nuovo checker confrontava due timestamp arrotondati al millisecondo: due chiamate sincrone possono avere millisecondi diversi (osservato 1 ms). La sonda finale marca il turno sincrono del pannello e cancella il marcatore nella prima microtask; il checker richiede lo stesso marcatore alla sorgente. Nessuna tolleranza temporale aggiunta o soglia allentata. Il giro ufficiale è stato ripetuto con questa prova più precisa, senza cambiare il prodotto.

Materiali intermedi, log completi del server e copie mutate restano in `%TEMP%/bm-c4-7-ter-20261107-listen`. Nessun database, credenziale o sorgente mutata incluso. Il rapporto principale distingue verifiche completate, rossi noti e casi coperti solo in unità.

- `outcome/`: otto partite, 16 esiti personali, checker win/loss/input verde per entrambe le misure; include pannello senza sequenza e uscita immediata.
- `m750/`: build e Verify verdi; layout rosso noto, 47 problemi contro 48 della base, stessi conteggi per turno.
- `checker-sensibilita.json`: registro valido accettato; duplicato, esito perso, colpo perso, file errato, esito in un altro turno JS ed elemento media tutti respinti.
- `manifest-check.json` e `verifiche.json`: manifest PASS, test progetto e contesto Spring riportati separatamente. 42 catture finali compresse, circa 7,7 MB complessivi.
