# Botte Micidiali — server

Server Spring Boot con catalogo SQLite in sola lettura e database applicativo
SQLite separato. La base I22 è approvata; identità, mazzi, partite ed eventi sono
persistenti. Il riavvio chiude le partite attive in pareggio, senza ripristino giocabile.

Eseguire dalla radice del monorepo:

```powershell
./scripts/build.ps1 -Task Server -Offline
./scripts/dev.ps1 -Task Server -SeedAccounts
```

Per il primo download, i dati locali e le verifiche consultare la
[guida di avvio](../docs/setup.md). Il contesto Spring ha un controllo separato:
`./scripts/build.ps1 -Task TestServerContext -Offline`.

[Regolamento ufficiale](../docs/game-rules.md) · [API](../docs/api.md) ·
[Persistenza](../docs/data-model.md) · [Monorepo](../README.md) ·
[Contributi e diritti](../CONTRIBUTING.md)
