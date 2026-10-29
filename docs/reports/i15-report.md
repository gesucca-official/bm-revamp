# I15 — Editor e persistenza mazzi

24 ottobre 2026. Implementazione, verifiche automatiche e accettazione UX I15 completate.

## Stato rilevato

Letto AGENTS.md, unica istruzione di directory trovata. Il workspace non contiene un repository Git radice: nessun reset, checkout o ripristino effettuato. L'editor imponeva 20 regolari, due bound e compatibilità di personaggio; modificava il dato account direttamente. Il servizio salvava binding senza controllare campi, sottotipi o riferimenti. Repository SQLite già parametrico, chiave composta utente/ID e upsert: conservato senza migrazioni. Catalogo disponibile a tutti, senza economia.

## Modifiche

Regolamento 1.4 prima del codice: basic e last resort obbligatorie, regolare non vuoto; massimo sei carte predisposte, contando basic + ogni copia bound prima delle pescate. Personaggio, last resort e regolari esclusi. Conteggio ricavato dal costruttore Player; nessuna decisione indispensabile rimasta. Da zero a cinque bound anche di altro personaggio, senza tetti copie o dimensione regolare. Starter invariati.

Salvataggio: controllo identificativo, personaggio e carte nel catalogo; sottotipi verificati ricostruendo le carte canoniche, senza fidarsi dei flag del payload. Tutti i controlli precedono l'upsert, quindi un input respinto non altera il mazzo precedente. Delete usa esclusivamente la chiave del proprietario autenticato, con validazione ID. Nessuna modifica ai dati utente esistenti o migrazione dei mazzi storici. Copia client, allegato e descrizioni SQLite allineati a 1.4; aggiornati soltanto gli attesi di versione nei test di archivio, senza variare gli esiti di gioco.

Editor: copia indipendente per annullamento, niente 20+2, bound interamente disponibili e azzerabili; ricerca esclude speciali dal regolare e considera la vista scelta. ID immutabile durante modifica; creazione con ID esistente mantiene il contratto upsert. Errore di scrittura mostrato nella collezione senza logout, perdita del profilo o attesa infinita; errore del primo caricamento conserva la gestione precedente. Pesca oggetti iterativa per supportare catene lunghe senza stack overflow, con ordine/capacità invariati.

## Prove automatiche

- `./scripts/build.ps1 -Task Test -Offline`: 219 server + 20 client, tutti verdi (`.build-logs/i15-test-final.log`).
- `python scripts/check-rules.py`: verde; copia client, testi, classificazioni, starter e integrità SQLite.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: 280 server, zero errori/fallimenti (`.build-logs/i15-context.log`). È una prova separata del contesto completo.
- CLI `scripts/cli-security-test.cjs`, invocata dal test Spring isolato: crea, modifica a una regolare/cinque bound duplicate di altro personaggio, rilettura, delete di altro utente innocuo e delete proprio; preservazione dopo basic/last/personaggio mancanti, regolare vuoto, sei bound, liste nulle, carta nulla, binding inesistente e sottotipo errato. Ripristino fixture e scenari preesistenti conservati. Test diretti storage già esistenti conservati.
- Client: annullamento senza mutazione, una/21 regolari, cinque/sei bound, ID vuoto; errore account dopo profilo preserva sessione e dati. Motore: catena di 20.000 oggetti senza overflow e capacità rispettata.
- Build client produzione riuscita; avviso dimensione bundle 2,22 MB rispetto al budget 2 MB. Compilazione editor finale verificata anche dal server Angular isolato.

## UX e limiti

Browser contro server su 18085 e client su 4215, database sintetico `.build-logs/i15-ux.sqlite`; account devAlice isolato. Verificati login, collezione, creazione `I15 UX` con una regolare e zero bound, pulsante disabilitato sul mazzo incompleto e requisiti visibili; salvataggio e presenza nell'elenco. In modifica tutte le quattro bound sono disponibili anche con Bruiser; aggiunta bound, Cancel e riapertura mostrano ancora zero bound. ID in modifica non editabile.

Verificati inoltre riavvio del server isolato e rilettura del mazzo, aggiunta di una bound Junkie al Bruiser, salvataggio dal browser e contatore 2/6. Un trigger temporaneo sul solo database sintetico ha rifiutato UPDATE: l'editor ha mostrato “Account data unavailable”, mantenendo login, profilo e mazzo. Rimosso il trigger, retry riuscito e messaggio scomparso. Evidenze: `.build-logs/i15-editor-error.png` e `.build-logs/i15-editor-saved.png`. Il messaggio specifico di input non valido è verificato via CLI, la presentazione del canale errori via browser. Nessuna modifica ai dati reali, nessuna attività I16.

Durante la verifica un tentativo di login con campi accidentalmente concatenati è stato rifiutato; sostituiti i valori, accesso riuscito. Non è evidenza di un problema di sessione unica.

Tentativi di packaging server bloccati da file target già aperti (SQLite WAL e JAR); non sono stati terminati processi preesistenti per liberarli. Per la prova UX avviate le classi compilate con il classpath esatto del runner Spring, su porte e database separati. Questo limite del packaging è distinto dai test verdi e dall'avvio applicativo riuscito.
