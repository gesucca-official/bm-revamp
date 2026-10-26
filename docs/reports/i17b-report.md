# I17b — Quick FFA

**I17b completato, 25 ottobre 2026.** Verifica applicativa FFA contro il regolamento 1.5. Nessuna modifica alle meccaniche, alle carte, ai clock o alle scelte Q09/R02/R04; nessuna nuova persistenza I19b.

## Prerequisiti e preservazione

Letti AGENTS.md, regolamento, decisioni aggiornate, roadmap e report I17a/I14/I23/I13/I26. La verifica reale dei prerequisiti passa dalle suite e dal contesto Spring completo: include dieci scenari I17a, sette lifecycle I14/I23, I13 e trasporto I26. La prova UX I17a già acquisita è conservata, senza attribuirle la nuova verifica FFA.

Il workspace radice non è una repository Git; le due repository annidate contengono molte modifiche preesistenti. Stato iniziale in `.build-logs/i17b-before-{server,client}-status.txt`, hash dei file in `i17b-before-manifest.json`, copie dei soli file toccati in `i17b-before/`. Usata l'eccezione safe.directory soltanto per i singoli comandi di lettura Git; nessuna configurazione globale, reset, checkout o commit. Differenze della sola attività in `i17b-task.diff`.

## Correzioni

- Ready FFA prima pubblico: la prova `early` riproduce `FFA ready contaminated an unrelated session` (`i17b-reproduction.log`). Ora tutti e tre i percorsi (quinto join, aggiunta bot, start anticipato) inviano `/user/queue/game/quick/ffa/ready` ai soli umani entrati nella partita. CLI, debug, allowlist, test e API allineati; vecchio topic negato. Anche il precedente scenario CLI di sicurezza/modalità è adeguato al cambiamento intenzionale del canale, senza cambiare attesi del motore. La lista joined della coda resta pubblica.
- La factory deduceva 1v1 dal numero di giocatori: una FFA anticipata con due umani era etichettata `quick1v1`. Ora riceve la modalità della coda e conserva `quickFFA`, verificato anche nell'export riletto da SQLite. La coda 1v1 conserva la propria modalità.

Si applicano R01/R08 già vigenti; regolamento e copia client restano identici alla versione 1.5, catalogo SQLite invariato. Non è introdotto un proprietario: start e aggiunta bot restano disponibili ai partecipanti, compreso il secondo arrivato. Forfait, prosecuzione e reconnect già implementati da I14/I23 sono verificati sul percorso FFA reale senza riscriverli.

## Fixture e prove CLI

`QuickFfaCliTest` avvia Spring su porta casuale e SQLite temporaneo, quindi `scripts/cli-quick-ffa-test.cjs` usa sei account sintetici con login REST e trasporti SockJS/STOMP separati. Controller, code, factory partita, servizio, validazione, viste e archivio sono reali. Il clock è iniettato e controllato tramite file, senza endpoint di bypass; solo la preparazione dei giocatori è nota e clonata. Umani HEALTH 100 con basic/Struggle; il bot usa la policy casuale reale su carte ShuffleFeet note, senza danni casuali. Queste fixture non sono mazzi salvati dell'editor e non cambiano starter/policy di produzione.

Il runner attende la conferma mossa del proprio autore prima di avanzare il clock: il primo tentativo evidenziava una sincronizzazione insufficiente quando un broadcast altrui veniva scambiato per la propria conferma. Corretta l'attesa del runner mantenendo gli attesi normativi, non modificato il gioco per accettare quell'errore.

| Scenario | Atteso e risultato verificato |
|---|---|
| `early` | Due umani, start richiesto dal secondo; ready esclusivo, mani/mazzi/pending private. Duplicato mossa rifiutato. Dopo drop e rientro con clock avanzato di 1 s: stessa pending, mano/risorse e termini originali; replay rifiutato e vecchio trasporto chiuso. Sette round completi con Struggle reciproci da HEALTH 100 a −5: draw. Estraneo negato su vista e mossa contraffatta |
| `full` | Quinto umano avvia automaticamente, esattamente cinque partecipanti. Sette round di mosse concorrenti ad anello: ciascuno perde 15 HEALTH a round, draw finale, 35 mosse accettate e sette round registrati. Sesto account senza ready/accesso. Anche qui rientro con pending nello stesso turno, senza reinvio |
| `bots` | Otto join duplicati occupano un solo posto. Bot aggiunto, uscita dell'ultimo umano pulisce i bot; reinserimento riuscito. Il secondo umano aggiunge il bot e avvia. Il suo leave elimina solo lui; l'altro prosegue dieci round contro il bot fino a vincere con HEALTH 50 |
| `concurrent` | Join C/D/E e due start contemporanei dopo A/B: gruppi reali disgiunti da 2–5, ogni umano al massimo un ready, nessun ready estraneo. Esiti unici, pulizia coda e nuova FFA nelle stesse sessioni |
| `leave` | A e B hanno pending; A lascia due volte. Forfait del solo A, HEALTH ancora 100 prima degli effetti, sua pending annullata. B conserva la mossa e gli altri risolvono contro A: A scende a 60 per gli effetti altrui, B a 95 per il proprio costo. A entra in un'altra FFA mentre la precedente resta attiva. Gli altri proseguono fino alla vittoria B |
| `batch` | C/D/E presentano, A/B scadono insieme a 30 s. Solo A/B in forfait: tre superstiti, round risolto con le loro pending conservate, A a HEALTH 70. Al termine successivo scadono insieme i tre superstiti: draw |
| `move-before` | A invia a 29.999 ms; a 30.000 scadono gli altri quattro, vince A senza risolvere il turno o pagare la sua pending |
| `move-exact`, `move-after`, `all-timeout` | Al termine esatto/oltre, cinque forfait applicati insieme e draw, turno 0 e HEALTH 100; nuova mossa rifiutata |
| `reconnect-before` | Pending di A accettata, drop a 1.000 ms, altri inviano a 29.999 ms e risolvono il turno in assenza di A. Rientro a 29.999 ms dal drop nello stesso match/turno 1, vista privata; nessun reinvio |
| `reconnect-exact`, `reconnect-after` | Stessa sequenza, rientro al/oltre termine del drop: `finished` con il forfait reconnect del solo A e vista della FFA ancora attiva. Gli altri proseguono fino a vincitore; il nuovo clock del turno non estende il reconnect |

Tredici scenari, 15 partite concluse nella prova mirata finale (la corsa join/start può produrre un secondo gruppo valido, verificato senza imporre un ordine di scheduling). Ogni export ha catena SHA-256 contigua, recording complete/OK, nessun evento non persistito e un solo OUTCOME. Export identici per tutti gli umani del match e invariati dopo leave. Dopo cleanup, nuovo repository/servizio archivio rilegge SQLite per ciascun umano, senza recuperare il runtime. Transcript ed export in `.build-logs/i17b-<scenario>-exports.json`; riepilogo della prova mirata in `i17b-summary.json`. I file della suite completa possono essere aggiornati dall'ultima ripetizione.

Il primo contesto completo ha rilevato l'attesa del vecchio topic nel precedente scenario CLI e un timeout della conferma leave nel caso a cinque dopo la partita già conclusa. Conservato in `i17b-context-first-failure.log`. La CLI ora prepara anche la sottoscrizione alla conferma leave durante `watch`, insieme alle viste, prima dei round; nessun retry di comandi o modifica agli esiti per nascondere il problema. Il contesto rieseguito integralmente passa tutti i 329 test. Dopo quel passaggio sono state rafforzate soltanto le asserzioni del runner CLI sul rientro con pending nello stesso turno, sia a due sia a cinque; la suite FFA è stata rieseguita separatamente con le nuove asserzioni: 13 PASS, senza modifiche applicative.

## UX debug con più sessioni

Due schede del browser integrato, devAlice/devBob, identità e connessioni contemporanee distinte (confermate dal log server), database nuovo `.build-logs/i17b-ux.sqlite`. Non è isolamento dei profili browser: l'app usa sessioni in memoria e le due connessioni autenticano account diversi. Edge era stato individuato, ma l'acquisizione nativa era molto più lenta; la prova è stata completata nel browser integrato. Starter, bot, casualità e tempo reali, nessuna fixture del motore.

Entrambi vedono lista A/B e pulsanti Start/Add Com Player. Bob aggiunge il bot, Alice avvia a tre. Begin reciproco con lo stesso bot ComPlayer_3341; mani diverse e risorse pubbliche. Alice usa Metabolismo Corrotto, Bob abbandona: torna all'hub con conferma forfait; Alice prosegue, riceve Turn Resolution, HEALTH 100→105 e TOXICITY 10→0, bot con oggetto consumato e timer 4. Il forfait di Bob non conclude la partita. Drop e login di Alice: DISCONNECTED `22:24:23.162Z`, RECONNECTED `22:24:25.995Z`, circa 2,83 s, stesso match/stato/termine mossa. La scadenza mossa successiva produce il vincitore ComPlayer_3341 con motivo timeout, un solo dialogo finale, Continue e hub. Logout dei due account confermato; campi sintetici svuotati manualmente prima della chiusura delle schede.

Partita `b972c0e29e5f608878b5b316fe7866a1035b1ecd52bea4932d909e079207dc79`: due CLI autentiche dopo logout esportano documenti uguali, `quickFFA`, tre partecipanti, 13 eventi, una mossa umana, un round, un solo OUTCOME; forfait Bob=leave e Alice=move timeout. Rilettura indipendente SQLite confronta sequenze/hash/JSON con l'export, integrity_check=ok. Script ripetibile a server locale avviato: `.tools/node-v12.22.12-win-x64/node.exe .build-logs/i17b-ux-export-verify.cjs`. Export, riepilogo e PASS in `i17b-ux-exports.json`, `i17b-ux-summary.json`, `i17b-ux-export-check.log`.

Screenshot originali in `.build-logs/i17b-ux-evidence/`: code Alice/Bob, mani, round di Alice dopo uscita Bob, hub Bob, rientro Alice ed esito finale. Log server/client `i17b-ux-server.log` e `i17b-ux-client.log`. Questa è una breve verifica UX, non una ripetizione sul browser di tutti i casi deterministici CLI.

## Verifiche

- `./scripts/build.ps1 -Task Test -Offline`: **237 server + 27 client PASS**, `i17b-test-final.log`.
- `python scripts/check-rules.py`: **PASS**, `i17b-rules-final.log`; regolamento/copia/catalogo invariati.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **329 server PASS**, zero failure/error/skipped, `i17b-context-final.log`. Comprende I17a (10), I14/I23 (7), I13, I26 e I17b (13); primo fallimento conservato e correzioni descritte sopra.
- `QuickFfaCliTest` mirato finale dopo le asserzioni aggiuntive pending: **13 PASS**, zero failure/error/skipped, `i17b-ffa-final.log`; non sono cambiati sorgenti applicativi dopo il contesto completo.
- Pacchetto server offline senza clean: **PASS**, `i17b-package-final.log`. Compilazione Angular dev: **PASS**, `i17b-ux-client.log`. Controlli whitespace delle due repository superati.
- UX multiaccount ed export/SQLite indipendente: **PASS**, evidenze sopra. Schede e servizi temporanei arrestati, dati conservati.

## Perimetro residuo

I19b resta aperto: nessun registro persistente degli attivi, retry di scrittura, nuovo schema o formato di esportazione. I24 restart-draw, I19c e I22 non sono chiusi. Le verifiche usano il processo vivo; non dichiarano restore dopo restart o esaustività di tutte le combinazioni di carte e scheduling.

**Nessun blocco residuo I17b.**
