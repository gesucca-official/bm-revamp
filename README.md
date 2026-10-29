# Botte Micidiali — monorepo

Gioco di carte con scelte simultanee ambientato in una rissa. Server, client
debug, CLI, strumenti e documentazione condividono questo repository.
La base locale I22 è approvata dal 26 ottobre 2026; la roadmap è conclusa
nel suo perimetro. La pubblicazione dei sorgenti non costituisce un deploy.
La fonte normativa è [docs/game-rules.md](docs/game-rules.md), versione 1.8;
le decisioni sono in [docs/open-questions.md](docs/open-questions.md).
Stato corrente e indice dei documenti: [docs/README.md](docs/README.md).

| Cartella | Contenuto |
|---|---|
| `server/` | Server Spring Boot, catalogo SQLite, migrazioni e test Java |
| `client-debug/` | Client Angular debug, asset e test client |
| `client-web/` | Client web animato (Pixi/React/Vite) collegato al server: tutte le modalità, collezione e mazzi, profilo e admin (C1, C2a, C2b); chiusura di C2 in attesa della prova umana B |
| `client-c0/` | Scena C0 congelata del client animato in `revision/` (Pixi/React, dati sintetici) e laboratorio Angular storico |
| `scripts/` | Toolchain fissata, build, CLI e verifiche applicative |
| `docs/` | Regolamento, contratti, roadmap e report |
| `tools/print-cards/` | Generatore e verificatore delle carte stampabili già esistenti |
| `output/pdf/` | PDF e manifest stampabili già prodotti, conservati |

## Preparazione e avvio

Windows x64 e Python 3.12; Java, Maven e Node sono fissati in
`scripts/toolchain.json`. Eseguire dalla radice:

```powershell
python scripts/bootstrap.py
./scripts/build.ps1 -Task Install
./scripts/build.ps1 -Task Server
./scripts/build.ps1 -Task Client
./scripts/dev.ps1 -Task Server -SeedAccounts
# In un secondo terminale:
./scripts/dev.ps1 -Task Client
```

Aprire `http://localhost:4200/hub`. Il provisioning è locale e facoltativo;
account sintetici: `devAlice/local-alice`, `devBob/local-bob`, `devCarol/local-carol`,
`devDave/local-dave`, `devErin/local-erin` (cinque umani per le prove FFA).
Il primo download richiede rete; `-Offline` richiede le cache Maven/npm già popolate.
Le cache, `node_modules`, `target` e `dist` sono escluse da Git e ricostruibili.

Le quattro verifiche da eseguire prima di proporre una modifica sono elencate
in [CONTRIBUTING.md](CONTRIBUTING.md) e spiegate nella [guida locale](docs/setup.md#verifiche):
il contesto Spring separato, che comprende scenari CLI e riavvii reali, va
eseguito prima del confronto dei manifest; i test ordinari da soli non
certificano l'avvio applicativo. [Guida locale](docs/setup.md),
[CLI](docs/cli.md), [candidato I22](docs/reports/i22-report.md).

## Conservazione

I sorgenti correnti sono in `client-debug/` e `server/` (prima `bm-web-client/` e `bm-server/`). La configurazione `.gitattributes`
conserva i byte e le terminazioni di riga originali anche nei nuovi checkout,
per mantenere verificabili le impronte. Le due precedenti directory Git sono
archiviate integralmente in `.repository-history/bm-server.git` e
`.repository-history/bm-web-client.git`, escluse dal nuovo Git. L'archivio include
stato iniziale, patch binarie e inventario SHA-256 dei file e dei metadati;
mantenerne una copia insieme alle evidenze locali se si trasferisce il lavoro.
Non è incluso in un clone del monorepo.

I database applicativi e i journal di recupero restano locali: conservare insieme
SQLite e `<database>.match-recovery`. Il catalogo in `src/main/resources` è invece
versionato. Non sono stati eliminati dati, configurati remote o effettuati deploy.
Base approvata esplicitamente dal proprietario il 26 ottobre 2026: candidato
`I22-3e71300e057687ba`, con i limiti del report accettati. Verifica dello snapshot
approvato e degli artefatti/evidenze locali:
`python scripts/i22-candidate.py --verify --snapshot`.

## Contributi e pubblicazione

[Guida ai contributi](CONTRIBUTING.md) · [Preparazione GitHub](docs/publishing.md) ·
[Verifiche automatiche](.github/workflows/verify.yml).

Tutti i diritti riservati, come nei repository originali. Non è stata concessa
una licenza open source; codice, illustrazioni e materiali di gioco non ricevono
nuovi permessi di utilizzo con questa pulizia.

## Roadmap

La roadmap della base è [archiviata come completata](docs/roadmap.md).
La [roadmap del client web animato](docs/client-roadmap.md) pianifica la parità
funzionale con il debug, dalla prima partita completa alla rifinitura visiva,
come base per futuri client desktop e mobile. **C0 è chiusa** (scena sintetica
in [`client-c0/revision/`](client-c0/revision/README.md)); **C1 è chiusa**
in [`client-web/`](client-web/README.md): quick 1vCom completa sul server reale. Di **C2** sono chiusi
C2a e O9; la parità con il debug (C2b) è implementata e verificata in automatico
(checklist P01–P44, C2b-7), mentre la prova umana B e il giudizio del proprietario
sono ancora da fare.
Stato corrente e classificazione dei documenti: [indice della documentazione](docs/README.md).
