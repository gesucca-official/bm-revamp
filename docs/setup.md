# Preparazione, avvio e verifiche

La base I22 è stata approvata il 26 ottobre 2026: regolamento **1.6**, schema
applicativo **V001–V003**, client debug e CLI, quattro modalità locali.
Il client corrente è `client-debug/` (prima `bm-web-client/`): Phaser e il
selettore grafico/debug sono stati rimossi, senza modificare il gioco.
Il server è in `server/` (prima `bm-server/`); il nome Maven e il JAR
`bm-server-0.0.1-SNAPSHOT.jar` restano invariati.
I percorsi nei report, nei manifest PDF e negli script del candidato storico I22 identificano
lo snapshot originale e restano invariati; nei report soltanto la destinazione dei
collegamenti ai sorgenti è stata aggiornata a `server/` e `client-debug/`.
Stato corrente e indice dei documenti in [docs/README.md](README.md). La scena C0
del client animato ha una guida propria in [client-c0/revision](../client-c0/revision/README.md),
con runtime Node isolato. La [roadmap](roadmap.md) conserva criteri e risultati; le precedenti istruzioni
operative sono nello [storico](history/setup-pre-i22.md).

## Prima installazione

Servono Windows x64, PowerShell, Git e Python 3.12. Dalla radice del clone:

```powershell
python scripts/bootstrap.py
./scripts/build.ps1 -Task Install
./scripts/build.ps1 -Task Server
./scripts/build.ps1 -Task Client
```

Il bootstrap installa Java, Maven e Node nelle versioni e con i checksum di
[`toolchain.json`](../scripts/toolchain.json), senza cambiare le impostazioni
globali. Il primo download e la prima risoluzione delle dipendenze richiedono
rete. Le successive build possono usare `-Offline` se `.tools/m2`,
`.tools/npm-cache` e `client-debug/node_modules` sono già popolati.
La toolchain recupera lo stack legacy; la pubblicazione dei sorgenti non
certifica un servizio pronto per l'esposizione pubblica.

## Avvio locale

```powershell
./scripts/dev.ps1 -Task Server -SeedAccounts
# In un secondo terminale, sempre dalla radice:
./scripts/dev.ps1 -Task Client
```

Aprire `http://localhost:4200/hub`. Gli account sintetici facoltativi sono
`devAlice/local-alice`, `devBob/local-bob`, `devCarol/local-carol`,
`devDave/local-dave` e `devErin/local-erin`; il provisioning non sovrascrive
identità esistenti. Ai riavvii basta `./scripts/dev.ps1 -Task Server`.
Fermare i processi con Ctrl+C prima di ricompilare. Non usare Procfile,
`start:heroku` o `server.js` legacy per l'avvio locale. [Guida CLI](cli.md).

Il server ascolta su `127.0.0.1:8080`, context path `/api`. Con `dev.ps1` i dati
sono in `server/data/bm.sqlite`; `BM_DATABASE_PATH` consente un percorso
alternativo. Usare un filesystem locale, un solo processo server e un file
separato dal catalogo. Conservare insieme SQLite e `<database>.match-recovery`.
Non occorrono PostgreSQL, SMTP o credenziali reali. La configurazione condivisa
`application-local.yml` è versionata; i segreti restano fuori dal repository.

## Avvio con la bozza del Set Base (SB-8)

Per le prove umane del Set Base (SB-12b, SB-16) il server può giocare la bozza del set invece del catalogo. Il
client web non cambia: il server gli manda le carte e la collezione della bozza.

```powershell
./scripts/build.ps1 -Task Server -Offline          # jar aggiornato, una volta dopo ogni pull
./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts
# In un secondo terminale, dalla radice:
./client-web/run.ps1 -Task Serve                   # http://127.0.0.1:4320
```

- **Profilo:** `--spring.profiles.active=local,bozza`. Il profilo `bozza` parte solo insieme a `local` (o `test`) e mai con
  `heroku`; una bozza non valida ferma l'avvio col messaggio del caricatore.
- **Dati separati:** `server/data/bm-bozza.sqlite` (o `BM_DATABASE_PATH`); account, mazzi salvati e partite della bozza non si
  mescolano con quelli del profilo normale. Gli account sintetici si creano anche qui con `-SeedAccounts`.
- **Bozza:** `server/src/test/resources/set-base/bozza.json`, letta da file e non dal jar: per cambiare un numero basta
  riavviare il server. `-Draft <percorsi>` ne sceglie un'altra (più set separati da `;`, come `-Dsim.draft`).
- **Il proprio starter:** in «Con un tuo mazzo» (open 1vCom) compaiono i cinque starter della bozza come mazzi pronti, in sola lettura
  (`starter-spazienzio`, `starter-mara`, `starter-tossico`, `starter-pino`, `starter-gigi`). La collezione e l'editor mostrano
  le carte della bozza; i mazzi costruiti con quelle carte si salvano nel database della bozza.
- **Quick 1vCom, quick 1v1 e FFA:** starter a caso dalla riserva `-Pool` (predefinita: i cinque), per esempio
  `-Pool 'starter-spazienzio,starter-mara'` per giocare solo quel matchup.
- **Computer:** `-Com` sceglie il suo mazzo (`pool` = a caso dalla riserva, predefinito, oppure uno starter) e `-Bot` il suo
  stile: `risorse` (predefinito), `aggressivo`, `prudente` (i bot euristici di SB-4) o `casuale` (il computer della partita viva).
  Esempio: `./scripts/dev.ps1 -Task Server -Bozza -Com starter-spazienzio -Bot prudente`.
- **Partite:** l'archivio le marca con `versions.draft` (fonti con SHA-256, set e versione «bozza», riserva, computer e stile),
  oltre al database separato.
- Senza `-Bozza` il server è quello di sempre: nessuna carta, personaggio o mazzo della bozza è raggiungibile.

## Verifiche

```powershell
./scripts/build.ps1 -Task Test -Offline
python scripts/check-rules.py
./scripts/build.ps1 -Task TestServerContext -Offline
python scripts/verify-match-manifests.py
```

La suite ordinaria esegue test server e client. La verifica Spring separata
comprende integrazioni, scenari CLI e riavvii reali e rigenera le evidenze
necessarie al controllo dei manifest. I test ordinari da soli non certificano
l'avvio applicativo. I comandi usano fixture sintetiche separate dai dati locali.

Il candidato storico `I22-3e71300e057687ba` resta legato alla revisione originale.
`python scripts/i22-candidate.py --verify --snapshot` richiede anche gli
artefatti e le evidenze locali originali: non è una verifica eseguibile dal solo
clone. Eseguirla prima di rigenerare build o prove, che possono cambiare hash e
ID. Le modifiche successive non ricevono automaticamente l'approvazione I22.
[Report, approvazione e limiti](reports/i22-report.md).
