> Stato corrente I22, 26 ottobre 2026: candidato `I22-3e71300e057687ba`
> verificato e approvato esplicitamente dal proprietario insieme ai limiti del
> [report I22](reports/i22-report.md); [registrazione](reports/i22-approval.json).
> I22 e roadmap della base conclusi. Nessuna decisione di gioco aggiunta, nessun
> deploy o backlog futuro. Le note datate sotto sono storiche.

> Stato 26 ottobre 2026: **R06 recepita nel regolamento 1.6 e I24 completato dopo verifica I14/I19b/I26.** Arresto pulito e crash chiudono gli attivi persistenti in draw una sola volta; motivo privato consultabile «riavvio server», senza restore giocabile o Elo. Conclusi e dati precedenti conservati; ripetizioni e interruzione durante finalizzazione verificate con server/CLI su DB isolati, presentazione nel debug finale confermata. 249 server + 28 client, contesto Spring separato 356 e check-rules PASS. [Report I24](reports/i24-report.md). I19c/I22 restano aperti; le note datate sotto sono storiche.

> Stato 26 ottobre 2026: **I19b completato** dopo I17a/b. R05 applicata al contratto I19a per tutte le quattro modalità/cicli di vita, con registro persistente e finalizzazioni atomiche idempotenti, recupero scritture e prove dirette/CLI. Nessuna nuova decisione di gioco o modifica del regolamento 1.5. [Report I19b](reports/i19b-report.md), [contratto e limiti](match-archive.md). Restano I24/I19c: nessun restart→draw o restore giocabile implementato. Le note datate sotto restano storiche.

> Stato 25 ottobre 2026: R02/R04 risolte e recepite nel regolamento 1.5 prima del codice. I14/I23 implementati e verificati: clock mossa continuo, confine escluso, forfait simultanei dei soli scaduti in FFA e rientro 30 s anche vsCom. [Chiarimenti sotto](#chiarimenti-del-proprietario--i14i23-25-ottobre-2026), [report](reports/i14-i23-report.md), [roadmap](roadmap.md). Le indicazioni datate precedenti sono storiche; I19b/I24/I19c restano aperti.

> Pianificazione aggiornata il 24 ottobre 2026: [roadmap della versione base approvata](roadmap.md). I01–I11 acquisiti; prossimo I26, CLI testuale leggero per gli scenari automatici applicativi senza UX (unit e integrazioni mirate restano diretti). Elo/I25/F38 rinviato, fuori dalla base. Chiusura I22 con prove tecniche e UX e approvazione esplicita del proprietario. Nessuna nuova implementazione con questa revisione; regolamento vigente 1.3. I censimenti e i risultati datati sotto restano storici nei rispettivi ambiti.

## Decisione aggiuntiva Q06/R02 - finestra di rientro

Il proprietario ha fissato la finestra di riconnessione a **30 secondi** (23 ottobre 2026). Si applichera al rientro nella partita del processo vivo, anche in vsCom; non introduce un timeout per la mossa vsCom. Resta aperto se il timer della mossa multiplayer continui durante la disconnessione e come coordinare scadenze simultanee. Implementazione prevista in I23/I14, non ancora presente. Nessun forfait o cambio delle regole attive introdotto da I06.

## Decisione tecnica I05 - provisioning minimo

Risolto il provisioning locale precedentemente indicato come R01: flag esplicito `app.dev.seed-accounts=true` nel solo profilo local e bind loopback crea devAlice/devBob, conserva duplicati e non invia email. [Dettagli e prove](reports/i05-report.md). Nessuna modifica a R01 del regolamento. Le domande di autorizzazione, reconnect e gestione account finale restano aperte o in roadmap.

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

# Decisioni del proprietario e questioni residue

Aggiornamento del 23 ottobre 2026. Le risposte Q01–Q18 fornite dal proprietario in chat sono integrate qui come fonte di requisiti. **Non costituiscono funzionalità implementate o verificate.** Restano validi gli esiti di [verification-report.md](E:/bm/docs/reports/verification-report.md). [Inventario](E:/bm/docs/feature-inventory.md) e [roadmap](E:/bm/docs/roadmap.md) recepiscono il nuovo perimetro.

Le formulazioni nella colonna “Risposta” riprendono le risposte del proprietario, normalizzando solo ortografia e punteggiatura. “Definita” chiude la scelta indicata, non tutti i dettagli tecnici collegati. “Provvisoria” indica esplicitamente un riferimento di sviluppo; “Rinviata” esclude per ora la relativa funzionalità dal percorso minimo.

## Risposte e conseguenze

| ID / tema | Risposta del proprietario | Stato della decisione | Conseguenze sul lavoro |
|---|---|---|---|
| Q01 — Stack e versioni | Nessun vincolo, possiamo aggiornare alle versioni che vogliamo e usare lo stack che vogliamo. | Libertà tecnica definita | Il team può confrontare riuso e alternative e motivare versioni/stack. Non è un ordine di riscrittura né una scelta già effettuata; i vincoli di rete osservati restano distinti. F01, I01. |
| Q02 — Database e materiale storico | Non ho più niente, dobbiamo ricostruire il possibile da quello che c'è. Possiamo anche decidere di non usare del tutto PostgreSQL. | Ricostruzione autorizzata; tecnologia da scegliere | Nessuna attesa del DDL originale. Ricostruire dai mapping e dai dati inclusi; confrontare persistenze prima di scegliere. Non è autorizzata la cancellazione di dati o ambienti eventualmente incontrati. F02/F12, I03. |
| Q03 — Regole | Bisognerà raccordare regolamento e codice. Per ora prendiamo buono cosa fa il codice, poi sulle regole ci lavoreremo. | Baseline provvisoria definita | Caratterizzare e documentare il comportamento attuale del motore; non correggere numeri, costi o effetti per farli coincidere con i testi. Crash, contaminazione tra partite e incoerenze di protocollo restano problemi tecnici da isolare; variazioni osservabili vanno segnalate. F18–F23, I08–I13. |
| Q04 — Interfaccia | Per ora usiamo quella di debug, completeremo quella Phaser e aggiungeremo dei client più belli in seguito. | Debug attuale; Phaser e nuove UI rinviate | La prima versione di sviluppo deve essere giocabile nel debug. Phaser non blocca il completamento corrente. F25 attuale, F26 successiva. |
| Q05 — Account ed email | Ancora non è obbligatorio niente, è una cosa che introdurremo in seguito. | Obblighi email/registrazione rinviati | SMTP e verifica email non sono gate della prima partita. Serve comunque un'identità per sessione unica e mazzi: il provisioning minimo degli account resta scelta tecnica da definire (R01), non si presume un guest mode. F05/F36 differite. |
| Q06 — Sessioni e reconnect | Una sola sessione per account, tornare alla stessa partita entro un timeout, forfeit se ci mette troppo tempo. | Requisito definito; coordinamento timer residuo | Vietare sessioni attive simultanee dello stesso account e consentire rientro nella partita del processo vivo. R02 precisa durata e rapporto col clock mossa. F06/F31 richieste adesso. |
| Q07 — Amministrazione | Non ricordo cosa c'era di fatto riguardo a questo, ad ogni modo è una feature che andrà studiata in seguito. | Rinviata | Pannello e modello admin completi non bloccano il debug. La titolarità di account/partite resta necessaria: rinviare ruoli admin non autorizza impersonificazione o accesso ai dati altrui. F28 differita, F07 attuale. |
| Q08 — Limiti mazzi | Per ora nessun limite, visto che siamo ancora in fase di sviluppo delle regole del gioco. Li introdurremo in seguito. | Assenza limiti di gioco provvisoria definita | Non imporre 20 regolari, 2 bound, tetti copie o altri limiti di legalità come requisito attuale. Restano integrità strutturale, binding esistenti e titolarità. R03 riguarda forme che il motore non sa eseguire; non è una licenza a lasciarlo andare in crash. F12/I15. |
| Q09 — Code e modalità | Le code vanno supportate tutte come sono ora. Sul FFA tutti possono fare tutto per ora. | Scope attuale definito | Quick 1vCom, quick 1v1, quick FFA e open 1vCom incluse. FFA: mantenere start anticipato e aggiunta bot senza introdurre un proprietario di lobby o un ruolo privilegiato. Non è autorizzazione a impersonare utenti. Open PvP non richiesto da questa risposta. F14–F16, I16–I17. |
| Q10 — Timeout | VsCom nessun timeout, se altri giocatori umani allora timeout di 30 secondi a mossa, poi forfait. | Regola timeout definita; dettagli residui | Nei match con più umani, ogni umano ha 30 secondi per presentare la mossa; scadenza produce forfait. VsCom non ha timeout mossa. R02/R04 riguardano reconnect, confini temporali ed esito FFA. F24/F32, I14. |
| Q11 — Log | Salviamo tutto per poi analizzare come vanno le partite e sviluppare i set. | Obiettivo raccolta completa definito | Persistenza di mosse, stato/report ed esiti a fini di analisi del gioco: F27 attuale e prioritaria. Non attivare retention/campionamento che scarti dati senza decisione; raccolta completa non significa registrare password, token o segreti. Granularità, esportazione e crescita storage in R05. |
| Q12 — Collezionabile/economia | Per ora non c'è niente di tutto questo, lo introdurremo poi una volta finalizzato il regolamento e il primo set. | Rinviata | Conservare accesso all'intero catalogo per i test. Niente inventario posseduto, acquisizione, scambi, valuta o pagamenti nel piano corrente. F33 differita. |
| Q13 — Contenuti | È ancora tutto in sviluppo. | Pool non definitivo | Le 37 carte e 2 personaggi sono materiale di sviluppo osservato, non un set di lancio approvato. Caratterizzarli senza aggiungere automaticamente SoberUp o nuovi contenuti. F13/F22 attuali, F37 evoluzione. |
| Q14 — Restart | Al riavvio del server tutte le partite in corso finiscono in draw, niente restore o altro. | Regola di esito e assenza restore definite | Reconnect vale solo finché il processo conserva la partita. Al restart esito draw per i match ancora attivi; non ricostruire lo stato giocabile. Registrare gli esiti necessari senza introdurre checkpoint del motore. R06 distingue crash/arresto pulito; Elo rinviato. |
| Q15 — Bot | Per ora è sufficiente casuale, ma in seguito potremmo introdurre queste cose. | Bot casuale sufficiente | Testare legalità e assenza blocchi; nessuna strategia, difficoltà o nuova IA nel piano corrente. F23. |
| Q16 — Piattaforme | Prevedo un client desktop, uno web e un'app mobile, le versioni web attuali sono per ora per testare. | Direzione futura definita; specifiche rinviate | Debug web come strumento di sviluppo, non client pubblico finale. Protocolli e motore non devono dipendere da Phaser; nessuna scelta ora di framework desktop/mobile o equivalenza automatica con web responsive. R07 per priorità future. |
| Q17 — Hosting | Dobbiamo ridecidere tutto da capo, nessun host disponibile per ora. | Baseline locale; hosting da progettare | Gli host storici non sono destinazioni operative. Nessun deploy remoto corrente. Scelta hosting/capacità dopo baseline locale, senza bloccare test locali. F29/I21 successivi. |
| Q18 — Risultati/rating | Sicuramente in seguito lo faremo, ma per ora ci basterà un rating Elo. | Superata il 24 ottobre 2026: Elo rinviato | F38/I25 escluso dalla base dalla nuova decisione del proprietario; parametri e residuo R08 differiti. F35 resta futuro. |

## Revisione del proprietario — 24 ottobre 2026

La richiesta corrente prevale sulla precedente Q18: rimuovere Elo dalla base e rinviarlo. Aggiungere I26/F39, CLI testuale con overhead minimo, come prossimo incremento e ingresso standard per tutti gli scenari automatici applicativi senza UX; conservare unit e integrazioni dirette e prove client esistenti. Browser/debug per UX. Conservare I01–I11, ridefinire i residui e chiudere con una base approvata in I22, senza nuovi sviluppi in questa modifica.

R01 provisioning è risolto da I05; R02 ha finestra reconnect 30 s già decisa, resta il rapporto con il clock mossa. R03–R06 restano da precisare prima dei relativi incrementi; R07 e il residuo Elo R08 sono futuri. Questi ID di domande non sono le sezioni omonime del regolamento. La vecchia Q03 è superata dal regolamento normativo 1.3/R00.

## Perimetro corrente

Versione base locale da approvare, client debug e CLI I26 per automazione non UX, identità account minima con sessione unica, quattro modalità già esposte, regolamento 1.3 come fonte normativa, mazzi senza limiti di legalità di gioco, bot casuale, raccolta completa dei dati di partita, reconnect sul processo vivo, 30 secondi per mossa nei match con altri umani e forfait, restart→draw senza restore; Elo rinviato.

Rinviati: email obbligatoria e recupero account completo, amministrazione, completamento Phaser, client desktop/web/mobile finali, set definitivo e bilanciamento, collezione posseduta/economia, ranking avanzato/premi/replay e hosting pubblico. Un requisito deciso resta assente/parziale finché non implementato e verificato.

## Dettagli residui da non scegliere implicitamente

| ID | Dettaglio da precisare | Perché conta / cosa può proseguire |
|---|---|---|
| R01 (Q05/Q06) | Risolto in I05: provisioning locale opt-in, identità persistenti senza email. | Non riaprire il provisioning già verificato; account finali e recupero restano futuri. |
| R02 (Q06/Q10) | Risolta: finestra reconnect 30 s anche vsCom; clock mossa multiplayer continuo. Termini assoluti, rientro al confine tardivo. | Regolamento 1.5/R06 e I14/I23 verificati con clock controllato e connessioni distinte. Nessun timeout mossa vsCom. |
| R03 (Q08/Q03) | Quali strutture minime rendono un mazzo eseguibile (personaggio, basic/last resort opzionali o obbligatorie, bound arbitrarie, mazzi vuoti/mano iniziale eccedente)? | Nessun limite di gioco imposto; validare riferimenti e input sicuri. Se il motore assume 20+2, esplicitare il punto e adattare separatamente, senza ripristinare limiti vietati. |
| R04 (Q10/Q09) | Risolta il 25 ottobre: primo termine dall’avvio quando la mossa è presentabile, poi dal completamento del turno; termine escluso. In FFA forfait dei soli scaduti/usciti, simultanei applicati insieme, poi conteggio superstiti. | Regolamento 1.5/R06: almeno due proseguono, uno vince, zero draw. I14 verificato, inclusi duplicati e concorrenza. |
| R05 (Q11) | Risolto dalla decisione proprietario del 24 ottobre sotto: stato completo, ordine iniziale, versioni ed export JSON; nessuna telemetria UI o cancellazione. | I19a/b/c verificati sulle quattro modalità e su conclusioni ordinarie, leave/forfait/timeout/reconnect e restart; registro attivi, finalizzazioni idempotenti, recupero e confronto manifest/export/SQLite: [contratto e crescita storage](match-archive.md), [report I19c](reports/i19c-report.md). Nessun segreto, telemetria UI, cancellazione o campionamento. |
| R06 (Q14/Q18) | Risolta e recepita prima del codice nel regolamento 1.6/R06: draw al restart dopo arresto pulito o crash; motivo consultabile «riavvio server». | Chiusura unica dal registro persistente dopo recupero delle scritture durevoli; conclusi e dati precedenti invariati. Ricevuta privata al login, export del partecipante per ID. Nessun restore giocabile o Elo; stato e prove I24 nella roadmap. |
| R07 (Q13/Q16/Q17) | Priorità futura desktop/web/mobile, OS/browser/touch, asset definitivi e hosting/capacità? | Rinviato; non blocca debug locale. Non congelare ora un set o un framework multipiattaforma. |
| R08 (Q18/Q09/Q10/Q14) | Differito: Elo iniziale, K e arrotondamenti; unico rating o per modalità; bot inclusi? Elo FFA (confronti a coppie, posizioni o altro)? Forfait e restart-draw aggiornano il rating? | Differito fuori dalla base: nessuna formula/configurazione o caso numerico richiesto ora. Non usare parametri “standard” senza esplicitarli. |

## Distinzione tra scelta di prodotto e correzione tecnica

La Q03 storica è superata da R00: il regolamento vigente è la fonte normativa. Non rende desiderabili una mano altrui esposta, una contaminazione tra partite, un crash o un protocollo incoerente. Prima di correggere un'anomalia che cambia l'esito osservabile, registrare comportamento precedente, motivazione, effetto e test; le variazioni delle regole o dei valori delle carte richiedono prima versione e motivazione nel regolamento, poi allineamento di test, codice, SQLite e copia client nella stessa modifica. I testi discordanti restano evidenze storiche, non una ragione per cambiare il motore adesso.

Le risposte sbloccano pianificazione e scelte tecniche, non autorizzano implicitamente deploy, uso di credenziali reali o cancellazione di dati. Tutte le modifiche in questa fase sono documentali.

## Decisioni del proprietario — esecuzione roadmap, 24 ottobre 2026

Risposte ricevute durante l'implementazione; requisiti da applicare nei rispettivi incrementi, non comportamenti già attivi:

- R02: il clock mossa continua durante la disconnessione.
- R04: i 30 secondi partono al completamento del turno precedente, quando il giocatore può presentare una mossa. Scadenze simultanee producono draw. In FFA l'abbandono produce forfait del solo giocatore uscente e la partita continua per gli altri.
- R03: basic e last resort obbligatorie; mazzi vuoti vietati; massimo sei carte iniziali.
- R05: stato completo, ordine iniziale e versioni, export JSON senza cancellazioni; nessuna telemetria UI per ora.
- R06: draw al restart anche dopo crash, con motivo visibile «riavvio server».

Queste risposte superano le corrispondenti domande residue sopra. Prima dell'attivazione aggiornare il regolamento secondo R00. Il trattamento della mossa ricevuta esattamente al termine non è stato precisato dalla risposta; non dichiararlo verificato implicitamente.

Chiarimento I15 (24 ottobre 2026): R03 applicata nel regolamento 1.4/R02. Le carte predisposte inizialmente sono basic + bound (ogni copia conta), massimo sei; last resort, personaggio e regolari esclusi dal conteggio. Il modello Player le predispone prima delle pescate. Bound da zero a cinque, anche di altro personaggio; nessun tetto copie o formato 20+2.

## Chiarimenti del proprietario — I14/I23, 25 ottobre 2026

R02/R04 recepite dal regolamento 1.5/R06 prima degli interventi: il clock mossa continua durante disconnect; il primo turno decorre dall’avvio quando la mossa è presentabile. Ricezione esattamente alla scadenza (mossa e rientro): termine scaduto. In FFA scadono solo i partecipanti interessati, applicati insieme a parità di termine, poi si conta: almeno due proseguono, uno vince, zero draw. Questo chiarimento supera la precedente formulazione generica «scadenze simultanee producono draw». Finestra reconnect 30 s anche vsCom, senza timeout mossa vsCom. Stato implementazione e verifiche nella roadmap e nei report I14/I23.
