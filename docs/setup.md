# Preparazione, avvio e verifiche

La base I22 è stata approvata il 26 ottobre 2026: regolamento **1.6**, schema
applicativo **V001–V003**, client debug e CLI, quattro modalità locali.
La [roadmap](roadmap.md) conserva criteri e risultati; le precedenti istruzioni
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
`.tools/npm-cache` e `bm-web-client/node_modules` sono già popolati.
La toolchain recupera lo stack legacy; la pubblicazione dei sorgenti non
certifica un servizio pronto per l'esposizione pubblica.

## Avvio locale

```powershell
./scripts/dev.ps1 -Task Server -SeedAccounts
# In un secondo terminale, sempre dalla radice:
./scripts/dev.ps1 -Task Client
```

Aprire `http://localhost:4200/hub`. Gli account sintetici facoltativi sono
`devAlice/local-alice` e `devBob/local-bob`; il provisioning non sovrascrive
identità esistenti. Ai riavvii basta `./scripts/dev.ps1 -Task Server`.
Fermare i processi con Ctrl+C prima di ricompilare. Non usare Procfile,
`start:heroku` o `server.js` legacy per l'avvio locale. [Guida CLI](cli.md).

Il server ascolta su `127.0.0.1:8080`, context path `/api`. Con `dev.ps1` i dati
sono in `bm-server/data/bm.sqlite`; `BM_DATABASE_PATH` consente un percorso
alternativo. Usare un filesystem locale, un solo processo server e un file
separato dal catalogo. Conservare insieme SQLite e `<database>.match-recovery`.
Non occorrono PostgreSQL, SMTP o credenziali reali. La configurazione condivisa
`application-local.yml` è versionata; i segreti restano fuori dal repository.

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
