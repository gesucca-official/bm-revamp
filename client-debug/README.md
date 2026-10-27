# Botte Micidiali — client-debug

Client Angular debug per giocare e verificare l'interazione della base I22
approvata. Include hub, mazzi, quattro modalità e gestione di timeout/reconnect.
La sezione animata Phaser e le sue dipendenze sono state rimosse.
Le immagini condivise con la collezione restano disponibili.

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
La [roadmap del client web animato](../docs/client-roadmap.md) pianifica le stesse
funzionalità del debug con una nuova esperienza di gioco. Implementazione non
avviata; asset attuali esclusi dal nuovo client. La
[ricognizione preparatoria](../docs/client-roadmap-preparation.md) resta disponibile.
