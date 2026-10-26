# I04 — Browser, proxy e route locali

23 ottobre 2026. Completato il percorso di accettazione I04 nel browser integrato, con client Angular su loopback:4200 e JAR I03 su loopback:8080. Database sintetico separato in `.build-logs/i04/application.sqlite`; nessun account reale o SMTP utilizzato. Nessuna regola di gioco modificata.

## Modifiche

- `bm-web-client/src/app/app.component.ts`: eliminata dipendenza DatePipe non fornita e sostituzione globale di console.error.
- `src/app/service/client-error-handler.ts` e `app.module.ts`: ErrorHandler Angular esplicito, console mantenuta, al massimo un invio in corso, timeout 5 secondi, errori del trasporto assorbiti senza nuovi invii. Non intercetta ogni console.error e non garantisce telemetria completa (I19).
- `proxy.config.json`: backend IPv4 esplicito e upgrade WebSocket abilitato. Riscritture /rest→/api/rest/v1 e /ws→/api/ws/v1 mantenute.
- `connection/sign-up/sign-up.component.ts`: prefisso /rest e codifica dei parametri disponibilità; controllo null nel matcher (errore riprodotto nel browser); spinner ripristinato e messaggio visibile se verifica/registrazione falliscono. Registrazione con email resta incompleta e disabilitata nel profilo locale, non è provisioning I05.
- `app.module.ts`: wildcard solo redirect, senza componente incompatibile; `client-phaser/phaser-client.component.ts`: accesso diretto senza connessione o scelta partita reindirizzato a /hub prima di accedere a gameType.
- `src/styles.css`: rimossi tre import automatici Google Fonts; restano fallback locali. Collegamenti esterni volontari nella home e server.js storico non vengono convertiti in questo incremento.
- `scripts/dev.ps1`: avvio in primo piano con strumenti I01 fissati, bind client loopback. Nessuna modifica globale del PATH. `scripts/check-local-proxy.py`: controlli ripetibili di HTTP/JSON e handshake WebSocket senza login.

## Verifiche effettive

| Prova | Risultato |
|---|---|
| `./scripts/build.ps1 -Task Client -Offline` | Build produzione riuscita; warning bundle iniziale 2,21 MB oltre budget 2 MB di circa 218 kB |
| `./scripts/build.ps1 -Task Test -Offline` | 65 test server e 6 client verdi, inclusi 2 nuovi test gestione errori; controllo regolamento/catalogo verde |
| Home → Read Rules | Regolamento ufficiale 1.0 visualizzato come HTML, heading e tabelle presenti |
| Apertura diretta /hub e /sign-up | Campi e pulsanti visibili, invio vuoto disabilitato; nessun errore runtime nella verifica finale |
| URL inesistente /i04-missing | Redirect alla home |
| Apertura diretta /phaser senza sessione | Redirect a /hub, nessun tentativo di join partita |
| Send Code con I04Smoke / i04@example.invalid | Messaggio Request failed, nessun falso successo email, schermata utilizzabile |
| `python scripts/check-local-proxy.py` | Due endpoint disponibilità HTTP 200 JSON boolean; /ws/info HTTP 200 con websocket=true; /ws/websocket upgrade 101 e Sec-WebSocket-Accept valido |
| Console browser finale su home/rules/hub/sign-up/wildcard/phaser | Nessun errore runtime rilevato |

La prima prova WebSocket prima del riavvio del dev server è andata in timeout: il processo aveva ancora la configurazione proxy precedente. Dopo riavvio con ws=true la prova ripetibile passa. Una prima apertura browser è avvenuta prima che Angular ascoltasse: connection refused di avvio, non errore del backend. Sono stati riscontrati avvisi locali npm sull'accesso alla cache update-check, senza fallimento dei comandi. Nessuna configurazione globale è stata modificata per risolverli.

Evidenze locali: `.build-logs/i04/server.log`, `client-restart.log`, `build-final.log`, `tests-final.log`, `proxy-final.log`. Browser controllato tramite API UI nella sessione; nessun runner E2E browser persistente aggiunto. I due nuovi test automatici provano fallimento del log senza ricorsione e limite degli invii concorrenti/ripresa.

## Ripetere la prova

Da E:/bm, dopo build I01/I03 e dipendenze installate, aprire due terminali:

```powershell
./scripts/dev.ps1 -Task Server
```

```powershell
./scripts/dev.ps1 -Task Client
```

Aprire **http://localhost:4200** (origine autorizzata dal server). Attendere compilazione prima di navigare. Un terzo terminale può eseguire `python scripts/check-local-proxy.py`. Arrestare ciascun processo con Ctrl+C. Se si modifica il proxy occorre riavviare il client. Il server usa normalmente `bm-server/data/bm.sqlite`; la verifica I04 ha invece passato esplicitamente il file sintetico sopra indicato.

## Limiti e prossimo incremento

Non verificati login STOMP, sottoscrizioni private, creazione account utilizzabile, azioni, partita completa, responsive/mobile o Phaser collegato. Handshake WebSocket riuscito non significa autenticazione riuscita. Il contesto server completo non è stato rieseguito in I04: resta la prova I03 da 73 test, mentre il JAR è stato riavviato realmente per le prove browser/proxy. Server.js/hosting remoto restano I21. Prossimo incremento: I05 identità minime di sviluppo.
