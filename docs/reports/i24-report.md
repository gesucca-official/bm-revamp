# I24 — Draw persistente degli attivi al riavvio

26 ottobre 2026. **Completato e verificato nel perimetro I24.** Incremento limitato a I24, dopo ricognizione di I14/I19b/I26 e riesecuzione delle rispettive regressioni. R06/Q14 recepita **prima del codice** nel regolamento **1.6**, copia client identica e riferimenti delle 37 descrizioni SQLite/allegato aggiornati. Nessuna modifica a effetti, numeri, starter, mazzi o bilanciamento. [Contratto](../match-archive.md#chiusura-al-riavvio-i24), [API](../api.md#ricevuta-di-riavvio-i24), [roadmap](../roadmap.md).

## Prerequisiti e conservazione

Letti AGENTS.md, regolamento, decisioni aggiornate e roadmap. Verificati i percorsi reali: I14 finalizza una volta e chiude i clock nel processo vivo; I19b fornisce V003, registro persistente, commit atomici idempotenti e batch di recupero; I26 usa processi Node reali con REST/SockJS/STOMP. Prima di I24 l'avvio recuperava gli eventi senza chiudere gli attivi. Le rispettive regressioni sono incluse nella verifica Spring separata.

E:/bm è un contenitore, con due repository annidati e molte modifiche preesistenti, conservate. Stato Git letto usando safe.directory limitato ai singoli comandi, senza cambiare configurazione globale. Nessun reset, checkout o pulizia dei sorgenti. Copie precedenti dei file applicativi toccati in `.build-logs/i24-before`; manifest dei file consegnati in `.build-logs/i24-manifest.json`. Tutte le prove applicative usano database sintetici separati; nessun database applicativo reale aperto o migrato. Il catalogo incluso cambia soltanto i riferimenti testuali 1.5→1.6; confronto di tutte le tabelle con la copia precedente riuscito.

## Implementazione

L'inizializzatore Spring dell'archivio recupera prima le scritture durevoli I19b. Se rimangono errori/eventi non persistiti, l'avvio fallisce: non presenta il servizio come pronto con chiusure mancanti. Se il journal contiene già un esito reale, lo conserva. Poi usa esclusivamente gli attivi LOG004, senza inventare registrazioni storiche.

Ogni match viene ricontrollato in una transazione SQLite IMMEDIATE. OUTCOME draw e marker terminale del registro sono committati insieme; se già concluso non viene eseguita alcuna scrittura. Un'interruzione a metà lascia entrambi assenti; i match già committati rimangono invariati e al prossimo avvio si chiudono i restanti. La copia locale si riconcilia dopo il commit. Nessuna migrazione aggiuntiva, modifica dei checksum V001–V003, UPDATE/DELETE di eventi o dati precedenti.

L'OUTCOME tecnico conserva gameId/modalità, `outcomeReason="riavvio server"`, draw/winner nullo e sequenza/hash del prefisso interrotto. Non fabbrica uno stato finale del motore: l'ultimo snapshot e la mossa pending rimangono nel prefisso storico, senza risolverli. Nessun `Game`, clock o factory ripristinato; nessun Elo.

`resume`, in assenza di una partita/ricevuta del processo vivo, restituisce al solo partecipante dell'ultima ammissione una ricevuta `finished/archived` con motivo e draw, senza `view`. Una nuova ammissione supera la ricevuta precedente; gli export per ID restano consultabili. Il debug mostra un solo dialogo «Pareggio — riavvio server» e Continue lascia l'hub disponibile senza sottoscrizioni/leave del vecchio match. Nessuna cronologia o presa visione persistente: senza nuova partita l'esito può riapparire al login successivo.

## Prove dirette e client

`MatchRestartTest`: quattro casi nuovi, indipendenti dall'avvio web.

- Più attivi e un concluso, tre inizializzazioni ripetute; prefissi/concluso identici, un OUTCOME tecnico, nessuna registrazione di un prefisso storico non registrato. Autorizzazione, ricevuta privata e integrità SQLite.
- Errore dopo inserimento OUTCOME ma prima del marker: rollback di entrambi, avvio negato e successiva chiusura unica.
- Esito naturale già durevole nel journal ma non in SQLite: recuperato byte per byte prima della selezione degli attivi; non sostituito da draw. Guasto ancora presente impedisce l'avvio.
- Due writer di finalizzazione concorrenti: un solo terminale; nuova ammissione supera la vecchia ricevuta senza perdere l'export.

Una nuova prova client controlla motivo, draw, dialogo unico, Continue e assenza di sottoscrizioni/leave/mosse verso il match archiviato. Una ricevuta ritardata non può cancellare un nuovo match già aperto: il caso è verificato nella stessa prova. Due attesi della sola versione normativa (Java e CLI) sono aggiornati da 1.5 a 1.6; nessun atteso di gioco cambiato per accettare regressioni.

## Server e CLI con riavvii reali

`RestartCliTest` avvia JVM distinte con l'applicazione Spring reale e processi Node del CLI I26 (`cli-restart-test.cjs`). Tre scenari indipendenti, ciascuno con **quattro attivi**, uno per modalità: quick1vCom, open1vCom con mazzo salvato via CLI, quick1v1 con mossa pending, quickFFA con due umani e un bot. Un quinto match è già concluso per leave. Ogni scenario usa otto account sintetici, database e directory di recupero nuovi. Il clock congelato evita scadenze durante l'orchestrazione; l'hook di guasto è soltanto nel processo di test, senza endpoint o flag nel server distribuito.

| Scenario | Verifica |
|---|---|
| Arresto pulito | Chiusura esplicita del contesto, exit 0; quattro attivi ancora registrati prima del nuovo avvio; poi quattro draw e concluso invariato |
| Crash | Terminazione forzata della JVM con trasporti ancora aperti; stesso archivio al nuovo avvio, esiti consultabili da tutti gli umani |
| Interruzione durante finalizzazione | Dopo il primo draw committato, pausa dopo l'INSERT del secondo OUTCOME e prima del marker/commit; fuori dalla transazione il secondo esito è assente e restano tre attivi. Kill, rollback verificato, nuovo avvio completa gli altri tre |
| Ripetizione | Tre avvii successivi per ciascuno scenario; stessi byte/hash/export, un solo OUTCOME per match, nessun nuovo evento sui conclusi |
| Conservazione | Tutti i prefissi invariati; account, mazzo, schema/checksum e righe sintetiche pregresse di LOG001/LOG002 identiche. integrity_check e foreign_key_check riusciti |
| Accesso e assenza restore | Ricevuta privata per ogni umano, export identico fra partecipanti, estraneo negato e vecchie destinazioni view/move rifiutate |

Evidenze conservate in `.build-logs/i24-{clean,crash,interrupted}-evidence`: fixture, SQLite, batch, log di ogni JVM, tre export CLI per scenario. Rilettura indipendente Python/SQLite confronta stringhe JSON e hash con gli export, senza ricostruire il JSON originale. I primi tentativi del runner bloccati dall'input/timer Node sono conservati nei log; il runner chiude le risorse e termina esplicitamente dopo lo scenario. Non sono regressioni del server. Il controllo finale trasversale di tutti i manifest I19c resta aperto.

## Presentazione reale nel debug

JAR locale, account sintetico devAlice, database dedicato registrato in `.build-logs/i24-ux-path.txt`, porte loopback 18224/14224. Partita quick contro bot/starter casuali avviata dal browser; crash senza logout; restart sullo stesso DB, login e dialogo «Pareggio — riavvio server» con spiegazione del draw. Continue riporta all'hub con scelta nuova partita disponibile; logout riuscito. Nessuna ricostruzione di mani o runtime. Screenshot `.build-logs/i24-ux-restart-draw.png` e `i24-ux-hub.png`.

Export successivo via CLI: complete/OK, due eventi INITIAL/OUTCOME, ricevuta corretta e byte/hash identici a SQLite letto indipendentemente (`i24-ux-export.json`). Un ulteriore avvio dello stesso DB con la build client finale ripresenta il medesimo draw, Continue/hub e logout corretti; screenshot aggiornati alla build finale. Processi e schede temporanei chiusi, dati/evidenze conservati. SHA-256 del JAR verificato: `d8d00715621570ab5ddbe0a92fb4bc8767e8132153b365d1dfb506138a3b159d`; classi/risorse identiche al build e nessun hook di test nel pacchetto. Build client di produzione riuscita, hash Angular finale `380cb14845b778e6084b`; rimane l'avviso di budget bundle (2,22 MB rispetto a 2 MB), senza errore di compilazione.

## Verifiche finali e limiti

Verifiche obbligatorie eseguite separatamente sullo stato finale:

- `./scripts/build.ps1 -Task Test -Offline`: **249 server + 28 client PASS**, zero failure/error/skipped server; `.build-logs/i24-test-accepted.log`.
- `python scripts/check-rules.py`: **PASS**, regolamento/copia client/versione/testi/catalogo/starter e integrità SQLite; `.build-logs/i24-rules-final.log`.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **356 test PASS**, zero failure/error/skipped, inclusi avvio completo e regressioni I14/I19b/I26; `.build-logs/i24-context-accepted.log`. I 356 comprendono anche gli unit, non sono 356 test aggiuntivi.
- Tre nuovi scenari server/CLI: **PASS** anche nella suite completa, inclusa interruzione durante transazione e vecchie destinazioni view/move negate. Build JAR, build client e presentazione reale del client finale: **PASS**.

La prima esecuzione completa (`i24-context-final.log`) aveva 354 verdi e due controlli CLI fermi alla versione 1.5; aggiornato il solo atteso normativo, la nuova esecuzione completa è interamente verde. I log precedenti sono conservati e non presentati come accettazione finale. Nessun blocco residuo nei criteri I24.

Limiti ereditati da I19b: un evento mai scritto su nessuno dei due supporti prima del crash non è ricostruibile; il draw chiude i prefissi durevoli senza inventare eventi mancanti. Corruzione/perdita di entrambi i supporti e hosting con più processi operativi sullo stesso DB non sono certificati. Nessuna retention, restore giocabile, Elo o approvazione della base. I19c e I22 rimangono aperti.

**Aggiornamento successivo, 26 ottobre 2026:** I19c è stato completato con verifica manifest/export trasversale; esiti, prove e limiti sono nel [report I19c](i19c-report.md). I22 resta aperto.
