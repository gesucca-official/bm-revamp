# I05 — Identita locali di sviluppo

23 ottobre 2026. Completato: due account sintetici persistenti, provisioning senza email, accesso REST e STOMP dal browser verificato. Nessuna regola di gioco modificata. Nessuna partita completa certificata.

## Scelta e comportamento

Provisioning esplicito all'avvio, anziche un nuovo endpoint pubblico. Il componente [DevelopmentAccounts](../../server/src/main/java/com/gsc/bm/conf/DevelopmentAccounts.java) richiede profilo `local` e `app.dev.seed-accounts=true`; rifiuta il provisioning prima delle scritture se server.address non e `127.0.0.1`. Il flag e normalmente assente/disattivato. Il normale profilo di test non crea account.

| Username | Password sintetica locale | Ruolo | Email |
|---|---|---|---|
| devAlice | local-alice | USER | null |
| devBob | local-bob | USER | null |

Queste sono credenziali pubbliche di sviluppo, non credenziali reali. Nel file SQLite si salva solo un hash BCrypt. Non si creano admin, mazzi o partite. Non viene chiamato il servizio email. Gli account persistono anche riavviando senza il flag.

[UserCredentialsRepository.createIfAbsent](../../server/src/main/java/com/gsc/bm/repo/external/UserCredentialsRepository.java) esegue INSERT parametrizzata con ON CONFLICT DO NOTHING: username esistente, password, email, ruolo e dati collegati restano invariati. Non usa l'upsert save per il provisioning. Se i nomi esistono gia, le password documentate potrebbero non essere quelle salvate: il log dichiara che l'identita e stata preservata. Nessun reset automatico. Questa scelta risolve la decisione tecnica di provisioning minimo indicata come R01 nei vecchi documenti; non modifica R01 del regolamento.

## Client

- [SignInComponent](../../client-debug/src/app/connection/sign-in/sign-in.component.ts): richiesta credenziali con timeout 10 secondi, errore visibile se REST non risponde, blocco degli invii duplicati e ripristino spinner.
- [WebsocketService.connect](../../client-debug/src/app/service/websocket.service.ts): callback di errore e attesa massima 10 secondi per CONNECT; chiusura del socket se fallisce. Disabilitato debug STOMP che poteva stampare il frame CONNECT con password. I 10 secondi sono un timeout tecnico di connessione, non un timeout di gioco.
- Il contratto REST `/rest/sign-in/validate` e STOMP CONNECT login/passcode resta quello esistente. Nessuna nuova autorizzazione, gestione completa reconnect o sessione unica introdotta. I06 deve verificare anche CONNECT diretto e destinazioni private; il controllo preflight legacy da solo non le protegge.

## Avvio manuale

Da E:/bm, prima compilare se necessario:

```powershell
./scripts/build.ps1 -Task Server -Offline
./scripts/build.ps1 -Task Client -Offline
```

In un terminale:

```powershell
./scripts/dev.ps1 -Task Server -SeedAccounts
```

In un secondo:

```powershell
./scripts/dev.ps1 -Task Client
```

Aprire **http://localhost:4200/hub**, usare uno degli account sopra. Per provare entrambi usare due schede con account diversi. Agli avvii successivi il flag SeedAccounts non e necessario. Ctrl+C arresta i processi. Chiudere le schede di prova prima di ricominciare, dato che il ciclo logout/disconnessione completo resta da verificare in I07. La schermata Register usa ancora email ed e differita: non usarla per creare questi account.

Non compilare il server mentre il JAR e in esecuzione: Windows puo impedirne la rimozione durante clean.

## Verifiche eseguite

| Comando o percorso | Risultato |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | 69 test server e 9 client verdi, controllo regole/catalogo verde |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 77 test server, zero failure/error/skipped, BUILD SUCCESS |
| `./scripts/build.ps1 -Task Server -Offline` | JAR compilato e impacchettato |
| `./scripts/build.ps1 -Task Client -Offline` | Build produzione riuscita; warning bundle iniziale circa 2,21 MB oltre budget 2 MB |
| `python scripts/smoke-dev-accounts.py` | Due processi JAR su porte effimere: primo con seed, secondo senza; credenziali valide per due utenti, rifiuto errate/sconosciute, hash e record identici al riavvio |
| Browser password errata devAlice | Dialog Log In Failed; nuovo tentativo possibile |
| Browser devAlice con password valida | CONNECT STOMP riuscito, hub visibile, profilo devAlice/USER ricevuto |
| Browser devBob in seconda scheda | Secondo accesso riuscito; hub mostra due utenti connessi, nessun errore console rilevato nei due hub |

Test nuovi: [DevelopmentAccountsTest](../../server/src/test/java/com/gsc/bm/DevelopmentAccountsTest.java), 4 casi: provisioning e rilettura/autenticazione, duplicati preservati, attivazione solo profilo+flag espliciti, rifiuto bind pubblico prima delle scritture. [sign-in.spec.ts](../../client-debug/tests/sign-in.spec.ts), 3 casi: esito valido, invalido e trasporto REST offline; verificano callback, spinner e messaggi. Il timeout/errore STOMP non e coperto da un test automatico dedicato.

Una prima esecuzione dei test e fallita mentre una build clean concorrente modificava lo stesso target (Unable to create test class): errore della procedura di verifica, ripetuta sequenzialmente con successo. Un clean successivo e fallito per JAR ancora aperto da Windows; dopo arresto del processo e riuscito. Gli avvisi npm sulla cache update-check non hanno impedito build/test. Nessun problema di questi richiede modifiche globali all'ambiente.

Evidenze: `.build-logs/i05-tests.log` (tentativo iniziale), `i05-tests-final.log`, `i05-context.log`, `i05-server-build-final.log`, `i05-client-build.log`, `i05-smoke.log`; log browser-backend e DB sintetico sotto `.build-logs/i05/`, ulteriore DB nuovo per ogni smoke. Nessuna modifica a database applicativi preesistenti o uso di credenziali reali. Le prove browser sono manuali tramite strumenti UI, non una suite E2E persistente.

## Limiti

La prova certifica identita persistenti e accesso all'hub, non sicurezza completa, logout/reconnect, sessione unica resistente a corse, recupero password o registrazione email. Nessun match, salvataggio mazzi via UI o Elo provato. L'interfaccia continua a selezionare Graphic per default; la scelta debug resta disponibile e il relativo percorso partita si verifica negli incrementi successivi. Prossimo incremento I06.
