# Botte Micidiali — client web

Client Angular debug per giocare e verificare l'interazione della base I22
approvata. Include hub, mazzi, quattro modalità e gestione di timeout/reconnect.
Il client Phaser resta un prototipo storico.

Eseguire dalla radice del monorepo, con il server già avviato:

```powershell
./scripts/build.ps1 -Task Client -Offline
./scripts/dev.ps1 -Task Client
```

Aprire `http://localhost:4200/hub`. Primo download e account sintetici nella
[guida di avvio](../docs/setup.md). I test client si eseguono con
`./scripts/build.ps1 -Task TestClient -Offline`.
Le configurazioni Heroku sono storiche; il percorso locale usa il proxy incluso.

[Regolamento ufficiale](../docs/game-rules.md) · [Monorepo](../README.md) ·
[Contributi e diritti](../CONTRIBUTING.md)

## Roadmap

La roadmap della base è [archiviata come completata](../docs/roadmap.md).
La [preparazione della roadmap client](../docs/client-roadmap-preparation.md)
raccoglie le decisioni da concordare; non è un piano di implementazione.
