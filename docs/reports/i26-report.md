# I26 — completato, 24 ottobre 2026

CLI `scripts/bm-cli.cjs`, runtime Node 12.22.12 e trasporti del lock esistente. Nessuna nuova dipendenza, endpoint di bypass o duplicazione del motore. Nessuna modifica di comportamento di gioco: regolamento 1.3, catalogo SQLite e copia client restano invariati. I12 e incrementi successivi non avviati.

Verificato lo stato effettivo prima delle modifiche: il round CLI esisteva; le prove di duplicato/accesso estraneo erano soltanto Java. Conservati sorgenti e prove precedenti. La directory fornita non contiene metadati Git utilizzabili: non è stato possibile produrre un diff Git né distinguere attribuzioni precedenti tramite Git.

## Criteri e prove automatiche

Asserzioni nel runner JUnit esistente `WebSocketIdentityTest`, server Spring su porta casuale, database SQLite temporanei di `SqliteContextSupport`; Node è un processo distinto e usa il trasporto reale. `scripts/cli-security-test.cjs` è lo scenario richiamato dal test, senza server simulato.

| Criterio | Evidenza verificata |
|---|---|
| REST e CONNECT autenticati, sottoscrizioni private, più account/processi | Login valido, password errata rifiutata, secondo CONNECT dello stesso account rifiutato; viste private con mano propria visibile e altrui numerica |
| Profilo/catalogo/mazzi | 37 carte non personaggio nel profilo; creazione, lettura e cancellazione del mazzo sintetico; assenza del mazzo nel profilo di un altro account |
| Quattro modalità | Join e vista reali quick 1vCom, open 1vCom con mazzo salvato, quick 1v1 con due account e FFA; eventi joined, add-bot, start anticipato e ready FFA; leave inviato in ciascuna modalità |
| Vista/mossa I09, target e scelte | Target nullo rifiutato recuperabilmente; carta bound con DISCARD_ONE valido accettata e scelta inesistente rifiutata; duplicato rifiutato, una sola mossa pendente e turno ancora zero |
| Primo round I10 | Fixture quick: SuperImpact/Struggle, turno 1, HEALTH umano 90 e bot 55 secondo R07; vista aggiornata dopo errore recuperabile |
| Accesso estraneo | CLI di un terzo account tenta la vista di una partita altrui: sottoscrizione negata, richiesta fallita, nessuna vista ricevuta, stato pendente invariato |
| File/stdin e output stabile | Esecuzione del programma principale in entrambi i modi; parsing di ogni riga stdout come JSON, connected e result/profile presenti, stderr vuoto sul successo |
| Diagnostica e codici | Password sintetiche assenti da stdout/stderr; login errato, JSON invalido, comando null e file inesistente producono exit 1; successo/logout exit 0 |
| Attese e risorse | Timeout evento breve realmente scaduto, poi profilo ancora funzionante; CONNECT duplicato limitato; tutti i processi devono terminare entro i limiti del runner, senza kill sul percorso riuscito; cleanup in finally anche sui fallimenti |

Correzioni CLI: controllo input null e parametri di attesa, propagazione della chiusura STOMP alle attese, risveglio in close, chiusura stream/readline su logout ed errore file, mantenimento degli indici after anche oltre 10.000 eventi. Il CLI conserva gli eventi fino alla chiusura: il consumo cresce con la durata dello scenario. Guida corretta al campo wire `choices`, non `additionalActions`.

## Comandi ed esiti

- `./scripts/build.ps1 -Task Test -Offline`: **PASS**, 123 test server e 18 client.
- `python scripts/check-rules.py`: **PASS**, regolamento/copia client, testi/starter e integrità SQLite coerenti.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **PASS**, 179 test, zero failure/error/skipped. Include entrambi gli scenari CLI; log finale `.build-logs/i26-context.log`.
- `./scripts/measure-cli.ps1`: **PASS**, cinque processi indipendenti; dati conservati in [i26-baseline.json](i26-baseline.json). Nessuna soglia prestazionale imposta.

## Baseline overhead

Windows x64, Node v12.22.12, dipendenze già installate, cache del filesystem non svuotata. Misura di memoria dopo caricamento CLI e creazione Client non connesso, prima della raccolta metadati; non comprende server o browser. Cinque campioni, intervalli osservati:

| Misura | Min–max |
|---|---|
| Avvio processo → uscita `--help`, misurato dall'esterno | 100,498–127,600 ms |
| Caricamento modulo CLI, misurato internamente | 57,452–59,656 ms |
| RSS a vuoto | 40,449–40,652 MiB |
| Heap usato a vuoto | 4,987–5,040 MiB |

Due dipendenze dirette di trasporto (`sockjs-client` 1.5.0 e `stompjs` 2.3.3), 16 pacchetti nella chiusura transitiva effettivamente risolta, 2.366.772 byte di file installati (esclusi sottodirectory node_modules e link). Risoluzione relativa a ciascun pacchetto, comprese versioni annidate; versioni confrontate con il lock. Hash SHA-256 del lock e versioni sono nei campioni. Il tempo processWallMs del raccoglitore comprende anche scansione e metadati e non sostituisce il tempo di avvio CLI. Questi valori descrivono questa macchina; non sono garanzie, confronti con browser o misure di login/rete.

## UX e limiti di perimetro

Nessuna nuova prova UX manuale: file/stdin e contratto testuale sono automatici, le 18 prove client precedenti sono conservate. I26 certifica i comandi delle quattro modalità e il round deterministico richiesto, non partite complete multiplayer/open o accettazione UX dei successivi incrementi. I relativi criteri restano nelle loro consegne. Reconnect, timer e nuovi esiti non implementati qui. Nessun criterio I26 rimasto aperto.
