# C4-5a — Checklist per il blocco d'integrazione successivo

**Aggiornamento d’integrazione, 4 novembre 2026:** la decisione del proprietario in [layers/decisione-proprietario.md](layers/decisione-proprietario.md) prevale sulla proposta cover di questa checklist: **piano 2 stirato, tre sprite uniformi, modalità S**. Formule e massimi di deformazione ammessi nel [piano aggiornato](../../../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2). Il registro delle prove è nel [rapporto C4-5a](../../../reports/client-c4/c4-5a.md#c4-5a--integrazione-dello-sfondo-del-tavolo-o2). Giudizio sul tavolo vero ancora richiesto; O2 non si chiude.


4 novembre 2026. **Checklist originata nella preparazione; stato aggiornato dall’integrazione C4-5a.** La preparazione iniziale non aveva eseguito questi passi. Questa preparazione produce soltanto quattro documenti nuovi nella cartella background; non chiude C4-5a né O2 e non aggiorna l'inventario.

Fonti: [C4-5a](../../../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2), [regole 10 e 14](../../../client-c4-plan.md#regole-di-non-regressione), D6/D9/D11/D13, [inventario corrente](../assets/README.md), [AGENTS.md](../../../../AGENTS.md).

## Ricezione, proposta e giudizio

- [x] Attendere che il blocco sul client dell'altra sessione sia concluso; rileggere istruzioni e sorgenti correnti. L'integrazione rientra nell'ordine del piano, anche se la generazione può avvenire in parallelo. Non assumere che gli hash della preparazione descrivano il nuovo HEAD.
- [x] Ricevere il file originale e i dati del proprietario. Completare una scheda del [registro](registro-generazione.md) per tentativo, con prompt letterale, commit precedente alla generazione, riferimenti e hash, strumento/modello/versione/data, termini d'uso e C2PA/seed se esposti. Dichiarare i dati non esposti o non verificati.
- [x] Controllare umanamente la provenienza (regola 14): solo i riferimenti del progetto ammessi, nessun asset dei quattro giochi, di Internet o delle proposte respinte. Confrontare gli SHA-256 degli allegati con quelli preparati.
- [x] Conservare e tracciare la sorgente originale dello sfondo in docs/design/client-c4/background/ con un nome concordato e hash. D11 richiede la sorgente tracciata per lo sfondo; non sovrascrivere table.png storico di C0-R2.
- [x] Preparare la proposta visiva sul tavolo vero, accanto alle carte e alle plance correnti, con i ritagli alle tre misure. Far scegliere/giudicare al proprietario prima dell'implementazione definitiva, secondo “prima proposta, poi codice” del piano. Annotare eventuali strumenti provvisori di anteprima nel blocco successivo. La decisione S della sessione autorizza l’integrazione; il giudizio finale sul tavolo vero resta pendente.
- [ ] Giudicare sedie/sgabelli consumati, spaiati e rattoppati, stessa palette, legno e luce R1, nessun cambio d'identità del bar. Verificare che i dettagli importanti sopravvivano ai ritagli e alle coperture; l'area proposta nella specifica è un'ipotesi, non una garanzia.
- [ ] Se occorre rigenerare, salvare e committare il nuovo prompt letterale prima del tentativo, registrando il precedente come respinto/da correggere. Non ricostruire a posteriori un prompt perduto.

## Asset, ritaglio e inventario

- [x] Leggere le dimensioni effettive. Applicare o aggiornare la [specifica](specifica-ritaglio.md), ricalcolando i numeri se cambia rapporto o layout. Originale consigliato 2560×1000; WebP consigliata 2048×800. Scelta successiva del proprietario: deformazione del solo piano secondo S; sprite sempre uniformi.
- [x] Convertire in WebP e registrare strumento/versione, filtro di ridimensionamento, qualità e modalità di compressione, ritaglio permanente se presente, gestione metadati/C2PA, hash prima/dopo e peso finale. La qualità 74 di C0-R2 è un dato storico, non un'impostazione già approvata per la nuova immagine.
- [x] Sostituire **client-web/public/art/table.webp** con la derivata approvata; lasciare la sorgente documentale fuori da public/ e dal download della build.
- [x] In **client-web/src/scene.ts**, limitare la modifica dello sfondo a resize come previsto da C4-5a: modalità S, piano a tutta scena e tre sprite uniformi ai centri proporzionali, senza cambiare la geometria degli elementi sovrapposti. Controllare che il primo resize e quelli successivi usino le dimensioni intrinseche della texture, non quelle già scalate.
- [x] Valutare la scritta decorativa separata dal bitmap in **client-web/src/style.css**, selettore .brand, come previsto dal piano: stessa identità, senza coprire i posti. Non disegnare testo nella texture per sostituirla.
- [x] Aggiornare **docs/design/client-c4/assets/inventory.json** e **README.md** nella stessa cartella soltanto in questo blocco futuro. Voce di art/table.webp: file, kind, author, url, version/data, license, modifications, destination, sha256; collegare registro e sorgente. Per una generazione senza URL di download indicare esplicitamente l'assenza, non inventare un URL.
- [x] Riportare le condizioni effettive dello strumento e la provenienza; non ereditare automaticamente dati di imagegen C0-R2. Valutare thirdParty ed eventuali crediti/licenze secondo l'inventario e le condizioni applicabili, senza dichiarare diritti esclusivi non documentati.
- [x] Aggiornare i documenti comuni richiesti dal piano: client-web/README.md, sezione C4-5a di docs/reports/client-c4-report.md, docs/client-roadmap.md e righe pertinenti di docs/client-c0-parity.md. Aggiornare stato/indice/piano quando necessario alla chiusura, in quel blocco. Non eliminare la lacuna storica dei prompt C0-R2: i nuovi prompt non la sanano retroattivamente.

## Test e verifiche da eseguire allora

- [x] Aggiungere una prova geometrica significativa della modalità S per **1366×768, 844×390, 750×292**: copertura completa del piano e deformazione entro i massimi dichiarati nel piano; sprite con scale X e Y uguali, centri proporzionali e rapporto della texture conservato. Includere cambi consecutivi di dimensione per intercettare accumulo di scala/offset. Lo stiramento del piano è ora la decisione esplicita del proprietario del 4 novembre 2026; non modificare attesi della geometria di gioco o soglie per accettare regressioni.
- [x] Eseguire **Build** e poi **Test** del client con ./client-web/run.ps1. Il test **client-web/tests/assets.test.ts** controlla regola 10 su public/ e, se presente, dist/: nessun file mancante dall'inventario, hash diverso, voce orfana o campo obbligatorio vuoto. Dopo la sostituzione serve una build aggiornata perché il dist precedente conserva il vecchio hash.
- [x] Il test prova la corrispondenza dei dati, non la validità dei diritti: completare anche il controllo umano del registro e della regola 14.
- [x] Eseguire **Size** con ./client-web/run.ps1, indirizzando BM_OUT alla cartella temporanea delle evidenze del blocco per evitare la destinazione storica predefinita. Controllare limiti rigidi C2 (JS gzip 500 KiB, totale gzip 4 MiB, atlanti massimo 2048×2048, texture 64 MiB) e tetto C4 rivisto di **32 MiB complessivi per le texture decodificate**. I vecchi tetti JS 400 KB e totale 2,2 MB sono stati rimossi da D9; non ripristinarli. Non alzare i limiti.
- [x] Eseguire **Verify e VerifyLayout** alle misure ufficiali **1366×768 e 844×390**, come richiesto per C4-5a. Usare il lancio seriale e la gestione dei server/evidenze di C4-1, senza sovrapporre altre verifiche sulla macchina; partite reali con database temporaneo e build identificata. Una sonda geometrica non sostituisce queste prove.
- [x] Alle tre misure controllare sul risultato reale la sola deformazione del piano deliberata in S e le forme uniformi degli sprite, sedute riconoscibili, carte/plance/testi leggibili, mano alzata, pile, scritta e stati della risoluzione; duello e FFA. Per 750×292 documentare i limiti e rispettare la non regressione della regola 18, senza convertirla in un nuovo obiettivo di adattamento o rilassare attesi. La matrice C4-5a non impone qui il giro completo 750 di C4-2/C4-9; eventuali prove aggiuntive vanno dichiarate.
- [x] Eseguire le verifiche comuni di AGENTS: **./scripts/build.ps1 -Task Test -Offline** e **python scripts/check-rules.py**. Nessuna regola di gioco cambia con questa sostituzione grafica.
- [x] Distinguere unità verdi da avvio applicativo. Il contesto Spring completo ha la verifica separata del consolidamento C4-9: non dichiararlo riuscito sulla base dei soli test unitari di questo blocco.
- [x] Lasciare la misura formale del contrasto a C4-8a come da piano, riportando nel frattempo il giudizio visivo e gli eventuali problemi. Nessuna prova fisica iPhone obbligatoria; se il proprietario la esegue, registrare dispositivo, contesto ed esito, senza equipararla all'emulazione Edge.

## Chiusura del blocco futuro

- [x] Conservare soltanto le evidenze finali richieste da D13 in docs/reports/client-c4/c4-5a/ dopo il giro, con HEAD/build, misure, esiti e limiti; bozze e calcoli temporanei fuori dal repository.
- [ ] Ottenere e registrare il giudizio del proprietario sul risultato integrato su desktop, distinguendolo dall'approvazione del file isolato. Chiudere O2 solo dopo questo giudizio e i criteri verificabili di C4-5a.
- [x] Commit del blocco d'integrazione con asset, registro completato, inventario, codice, test e documentazione coerenti. Nessun push è autorizzato da questa checklist.

C4-5a-prep non aveva eseguito l’integrazione. I passi marcati ora sono documentati nel rapporto C4-5a; il giudizio sul tavolo vero e la chiusura di O2 restano al proprietario.
