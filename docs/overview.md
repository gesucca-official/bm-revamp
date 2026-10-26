> **Stato documentale — 26 ottobre 2026:** roadmap della base completata e
> [archiviata](history/roadmap-base-i22.md), con approvazione I22 già registrata.
> Le indicazioni datate di incrementi prossimi/aperti e priorità della base
> restano storico, non attività correnti. La nuova roadmap client è ancora
> [in preparazione](client-roadmap-preparation.md), senza piano approvato.

## Quadro corrente I22 — 26 ottobre 2026

Prerequisiti tecnici della base acquisiti: quick 1vCom, open 1vCom, quick 1v1 e
FFA, mazzi strutturalmente validi, identità/sessione unica, CLI, clock e forfait,
reconnect 30 s nel processo vivo, archivio completo e restart-draw senza restore.
Regolamento 1.6; Elo e backlog futuro esclusi. Monorepo unico preparato con
cronologie e lavoro preesistente conservati. Il proprietario ha approvato esplicitamente il candidato I22 e i limiti il
26 ottobre 2026; roadmap della base conclusa: [report corrente I22](reports/i22-report.md).
Le ricognizioni datate sotto non descrivono automaticamente lacune ancora aperte.

> La base I22 è completata e approvata. **I26/F39 è completato**: la CLI è disponibile per gli scenari applicativi automatici non UX; unit e integrazioni mirate restano diretti, browser/debug per UX. [Guida CLI](cli.md), [report I26](reports/i26-report.md), [roadmap archiviata](history/roadmap-base-i22.md).

> Aggiornamento normativo 23 ottobre 2026: il [Regolamento ufficiale 1.0](game-rules.md) prevale su questo documento per le regole di gioco. Le indicazioni precedenti «codice come riferimento provvisorio», le questioni sulle regole già risolte da R01–R07 e i risultati di test qui riportati sono storici; le richieste non implementate restano roadmap. Verifiche attuali: [conformità](rules-conformance.md).

**Aggiornamento I03:** contesto Spring, repository SQLite e JAR locale ora verificati; PostgreSQL sostituito da file applicativo separato, catalogo read-only. 73 test server nel profilo completo, nessun errore; controlli delle regole preesistenti superati e nessuna modifica alle regole in I03. La diagnosi storica di datasource non avviabile e IdClass mazzi incoerente è superata dalla nuova implementazione. [Report corrente](reports/i03-report.md). Partita/browser, autorizzazioni e log asincroni completi restano da verificare.

# Botte Micidiali — ricognizione del progetto

**Stato più recente I02:** harness isolato verificato (8 test server + 4 client passati e mutazioni rilevate); contesto completo ancora rosso, nessuna partita end-to-end verificata. [Report I02](reports/i02-report.md). I censimenti iniziali sotto sono precedenti all'aggiunta delle suite.

Analisi del 23 ottobre 2026 delle copie locali `bm-server` e `bm-web-client`. Questa documentazione descrive il codice disponibile, non certifica un prodotto funzionante. Non sono stati modificati sorgenti o configurazioni applicative.

## Come leggere i documenti

Le guide, il regolamento e i documenti di stato si trovano direttamente in `docs/`. La cartella [reports](reports/) raccoglie i report degli incrementi, il rapporto di verifica e l'audit storico, con la matrice I12 e i dati di baseline I26 allegati.

- **V — verificato**: osservato nel sorgente, nella configurazione o nel database SQLite incluso; non equivale a una prova end-to-end.
- **D — deduzione**: conseguenza ragionata dei percorsi esaminati, da confermare con test.
- **M — mancante/non verificato**: informazione assente nelle copie esaminate o verifica non completata.

Le citazioni indicano file e metodi; i riferimenti al catalogo indicano tabella e chiave. Le assenze si riferiscono soltanto alle due copie locali, esclusi gli interni Git. Il censimento comprende 155 file server e 125 client, incluse configurazioni, risorse e wrapper; non contiene `node_modules` o `target`.

## Struttura rilevata

| Area | Contenuto verificato e fonte |
|---|---|
| Server | Java, Maven, Spring Boot; ingresso [BmServerApplication.java](../bm-server/src/main/java/com/gsc/bm/BmServerApplication.java), dipendenze [pom.xml](../bm-server/pom.xml) |
| API | Controller HTTP in `api/rest/users` e `api/rest/panel`; controller STOMP in `api/ws`; [contratti ricostruiti](api.md) |
| Motore | `model/game`, `model/cards`, `Character`, risorse, danni, stati e timer; [dominio](domain-model.md) |
| Servizi | `service/session`, `service/account`, `service/factories`, `service/view`: sessioni, code, account, costruzione carte e viste |
| Persistenza | Repository JPA `repo/internal` e `repo/external`; [cards.sqlite](../bm-server/src/main/resources/cards.sqlite) incluso; PostgreSQL esterno configurato ma non disponibile per verifica |
| Client | Angular, schermate account/collezione/mazzi, client debug e Phaser; [AppModule](../bm-web-client/src/app/app.module.ts) |
| Risorse | Immagini di carte/personaggi, CSS, favicon; [regolamento preesistente](../bm-web-client/src/assets/docs/rules.md) |
| Esecuzione | Maven wrapper, Angular CLI, proxy locale, Express e Procfile Heroku; [setup](setup.md) |
| Test | Un solo test server `contextLoads`; nessun test automatico client trovato; componente dimostrativo Phaser con dati fissi |
| Documentazione | Due README quasi identici e incompleti; regolamento discorsivo da confrontare con il codice |

**M:** nel censimento non risultano migrazioni SQL, Dockerfile/Compose, pipeline CI, specifiche OpenAPI/AsyncAPI, configurazione locale effettiva o fixture per il database account. Il file `application-local.yml` è esplicitamente ignorato da Git nel server.

## Stato attuale

**V:** il progetto contiene un motore di gioco concreto. `Game.submitMove/resolveMoves` gestisce mosse simultanee, costi, priorità, risoluzione ed effetti di fine turno; `Player` gestisce mano e pesca. Le modalità costruite da [GameFactoryServiceImpl](../bm-server/src/main/java/com/gsc/bm/service/factories/GameFactoryServiceImpl.java) sono quick 1vCom, quick multiplayer e open 1vCom. Le code arrivano a due giocatori per 1v1 e cinque per FFA.

**V:** SQLite contiene 37 carte di catalogo, due personaggi, quattro keyword, 30 righe di composizione dei mazzi e due assegnazioni di carte iniziali; entrambi i mazzi regolari sommano 20 carte. Tutte le classi nominate dal catalogo e tutte le immagini non nulle del catalogo carte esistono nelle copie locali. Questo verifica i riferimenti, non l'eseguibilità delle carte.

**V:** la “collezione” restituisce a tutti l'intero catalogo: [UserAccountServiceImpl.getUserCardCollection](../bm-server/src/main/java/com/gsc/bm/service/account/UserAccountServiceImpl.java). Non sono state trovate meccaniche di acquisizione, scambio, valuta o proprietà individuale delle carte. **D:** è un prototipo di combattimento e costruzione mazzi; la componente collezionabile non è ancora un sistema economico/progressivo.

**D:** non è prudente considerarlo pronto per utenti reali: identità dei comandi non legata al principal, validazioni incomplete, contratti client/server divergenti e ciclo di vita delle partite fragile. Evidenze e priorità sono in [technical-debt.md](technical-debt.md).

## Verifiche effettive e limiti

**V:** censimento dei file, lettura dei percorsi applicativi, confronto tra client/server e catalogo; SQLite aperto con `mode=ro`, `PRAGMA integrity_check` = `ok`, `foreign_key_check` senza righe. Stato Git pulito per entrambe le repository prima dell'analisi.

**M:** build server e test non completati: wrapper Maven 3.6.3 non disponibile e download bloccato; un secondo tentativo con Maven 3.9.9 già presente, offline, fallisce sul parent Spring Boot 2.4.3 assente. Build client fallita prima della compilazione perché `ng` non è installato localmente. Nessuna verifica browser, SMTP, PostgreSQL, partita completa, concorrenza o deployment. Non è stato eseguito un audit CVE delle dipendenze.

## Decisioni del proprietario integrate

Le [risposte Q01–Q18](open-questions.md) definiscono il nuovo obiettivo: debug locale e tutte le modalità attuali, regolamento 1.3 come fonte normativa, nessun limite di legalità dei mazzi per ora, bot casuale, una sessione/account, reconnect nella partita del processo vivo, 30 secondi/mossa e forfait se ci sono altri umani, nessun timeout mossa vsCom, restart→draw senza restore, dati completi per analisi set e CLI I26 per automazione non UX. Rating Elo rinviato.

Versioni/stack sono liberi; DDL storico perso, persistenza da ricostruire senza obbligo PostgreSQL. Nessun host disponibile. Email obbligatoria, admin, Phaser, client finali desktop/web/mobile, economia e set/regolamento definitivi sono successivi. Nessuno di questi requisiti nuovi è dichiarato implementato o verificato.

I01–I11 sono acquisiti: SQLite e provisioning locale sono già scelti e verificati. Restano coordinamento dei timer (finestra reconnect già fissata a 30 s), struttura minima dei mazzi, transizioni forfait/FFA, granularità dei dati e restart pulito/crash. Elo e priorità delle piattaforme sono differiti; I22 chiude con approvazione della base.

## Documenti

[Architettura](architecture.md) · [Dominio](domain-model.md) · [Regole](game-rules.md) · [API](api.md) · [Dati](data-model.md) · [Avvio](setup.md) · [Stato implementazione](implementation-status.md) · [Debito tecnico](technical-debt.md).

## Inventario delle directory

**V:** censimento ricorsivo delle directory con file propri, esclusi gli interni `.git`; i numeri contano i file direttamente nella directory, non nelle sottodirectory. Questo inventario include anche risorse e configurazioni che non costituiscono funzionalità applicative.

```text
bm-server/ (7 file)
bm-server/.mvn/wrapper/ (3 file)
bm-server/src/main/java/com/gsc/bm/ (1 file)
bm-server/src/main/java/com/gsc/bm/api/rest/panel/ (2 file)
bm-server/src/main/java/com/gsc/bm/api/rest/users/ (2 file)
bm-server/src/main/java/com/gsc/bm/api/ws/ (5 file)
bm-server/src/main/java/com/gsc/bm/conf/db/ (2 file)
bm-server/src/main/java/com/gsc/bm/conf/http/ (1 file)
bm-server/src/main/java/com/gsc/bm/conf/ws/ (4 file)
bm-server/src/main/java/com/gsc/bm/model/ (4 file)
bm-server/src/main/java/com/gsc/bm/model/cards/ (5 file)
bm-server/src/main/java/com/gsc/bm/model/cards/bitch/ (1 file)
bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/ (13 file)
bm-server/src/main/java/com/gsc/bm/model/cards/bruiser/character/ (3 file)
bm-server/src/main/java/com/gsc/bm/model/cards/com/ (3 file)
bm-server/src/main/java/com/gsc/bm/model/cards/com/basic/ (2 file)
bm-server/src/main/java/com/gsc/bm/model/cards/com/items/ (4 file)
bm-server/src/main/java/com/gsc/bm/model/cards/com/last/ (1 file)
bm-server/src/main/java/com/gsc/bm/model/cards/com/tokens/ (1 file)
bm-server/src/main/java/com/gsc/bm/model/cards/junkie/ (10 file)
bm-server/src/main/java/com/gsc/bm/model/cards/junkie/character/ (3 file)
bm-server/src/main/java/com/gsc/bm/model/game/ (6 file)
bm-server/src/main/java/com/gsc/bm/model/game/status/ (5 file)
bm-server/src/main/java/com/gsc/bm/repo/external/ (9 file)
bm-server/src/main/java/com/gsc/bm/repo/internal/ (10 file)
bm-server/src/main/java/com/gsc/bm/service/account/ (2 file)
bm-server/src/main/java/com/gsc/bm/service/account/model/ (3 file)
bm-server/src/main/java/com/gsc/bm/service/factories/ (11 file)
bm-server/src/main/java/com/gsc/bm/service/session/ (10 file)
bm-server/src/main/java/com/gsc/bm/service/session/model/ (3 file)
bm-server/src/main/java/com/gsc/bm/service/view/ (2 file)
bm-server/src/main/java/com/gsc/bm/service/view/model/client/ (5 file)
bm-server/src/main/java/com/gsc/bm/service/view/model/deck/ (1 file)
bm-server/src/main/java/com/gsc/bm/service/view/model/logging/ (4 file)
bm-server/src/main/resources/ (5 file)
bm-server/src/main/resources/META-INF/ (1 file)
bm-server/src/test/java/com/gsc/bm/ (1 file)
bm-web-client/ (13 file)
bm-web-client/src/ (5 file)
bm-web-client/src/app/ (4 file)
bm-web-client/src/app/client-debug/ (3 file)
bm-web-client/src/app/client-debug/card-in-hand/ (3 file)
bm-web-client/src/app/client-debug/character-card/ (3 file)
bm-web-client/src/app/client-debug/code-dialog/ (4 file)
bm-web-client/src/app/client-phaser/ (4 file)
bm-web-client/src/app/client-phaser/scnenes/battle/ (1 file)
bm-web-client/src/app/client-phaser/scnenes/battle/animations/ (4 file)
bm-web-client/src/app/client-phaser/scnenes/battle/model/ (5 file)
bm-web-client/src/app/client-phaser/scnenes/battle/test-battle-scene/ (3 file)
bm-web-client/src/app/connection/choose-game/ (3 file)
bm-web-client/src/app/connection/choose-game/choose-deck-dialog/ (3 file)
bm-web-client/src/app/connection/sign-in/ (3 file)
bm-web-client/src/app/connection/sign-up/ (3 file)
bm-web-client/src/app/home/ (3 file)
bm-web-client/src/app/home/rules/ (3 file)
bm-web-client/src/app/home/sponsor/ (3 file)
bm-web-client/src/app/home/toolbar/ (3 file)
bm-web-client/src/app/model/ (10 file)
bm-web-client/src/app/service/ (4 file)
bm-web-client/src/app/user-hub/ (3 file)
bm-web-client/src/app/user-hub/admin-control-panel/ (3 file)
bm-web-client/src/app/user-hub/collection/ (3 file)
bm-web-client/src/app/user-hub/collection/character-card/ (3 file)
bm-web-client/src/app/user-hub/collection/collection-card/ (3 file)
bm-web-client/src/app/user-hub/collection/edit-deck/ (3 file)
bm-web-client/src/assets/ (2 file)
bm-web-client/src/assets/docs/ (1 file)
bm-web-client/src/assets/img/ (4 file)
bm-web-client/src/assets/img/cards/ (4 file)
bm-web-client/src/assets/img/characters/ (4 file)
bm-web-client/src/environments/ (2 file)
```
