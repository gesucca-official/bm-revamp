# Botte Micidiali — monorepo locale

Server, client debug, CLI, strumenti e documentazione condividono questa repository.
La fonte normativa è [docs/game-rules.md](docs/game-rules.md), versione 1.6;
le decisioni sono in [docs/open-questions.md](docs/open-questions.md).

| Cartella | Contenuto |
|---|---|
| `bm-server/` | Server Spring Boot, catalogo SQLite, migrazioni e test Java |
| `bm-web-client/` | Client Angular debug, asset e test client |
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
./scripts/build.ps1 -Task Server -Offline
./scripts/build.ps1 -Task Client -Offline
./scripts/dev.ps1 -Task Server -SeedAccounts
# In un secondo terminale:
./scripts/dev.ps1 -Task Client
```

Aprire `http://localhost:4200/hub`. Il provisioning è locale e facoltativo;
account sintetici: `devAlice/local-alice`, `devBob/local-bob`.
Il primo download richiede rete; `-Offline` richiede le cache Maven/npm già popolate.
Le cache, `node_modules`, `target` e `dist` sono escluse da Git e ricostruibili.

```powershell
./scripts/build.ps1 -Task Test -Offline
python scripts/check-rules.py
./scripts/build.ps1 -Task TestServerContext -Offline
python scripts/verify-match-manifests.py
```

Il contesto Spring separato comprende anche gli scenari CLI e i riavvii reali.
Eseguirlo prima del confronto dei manifest. I test ordinari da soli non
certificano l'avvio applicativo. [Guida locale](docs/setup.md),
[CLI](docs/cli.md), [candidato I22](docs/reports/i22-report.md).

## Conservazione

I sorgenti sono rimasti nei percorsi originali. La configurazione `.gitattributes`
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
La base richiede approvazione esplicita del proprietario sul candidato verificato.
