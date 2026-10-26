## Percorso verso la base — 24 ottobre 2026

[Roadmap corrente](../docs/roadmap.md): I01–I11 completati nei rispettivi ambiti; prossimo I26, client CLI testuale minimo per test automatici applicativi non UX, ancora da realizzare. Il client web debug resta il percorso di gioco e verifica UX. Elo rinviato; obiettivo finale base locale verificata e approvata esplicitamente dal proprietario in I22. Questa revisione modifica soltanto documenti. [Stato effettivo](../docs/implementation-status.md) e [avvio/verifiche](../docs/setup.md).

## Regolamento ufficiale

Il [regolamento corrente](../docs/game-rules.md) prevale su codice, test e testi delle carte. Prima si modifica il regolamento, poi si allineano implementazione, test e documenti. [Verifica di conformità](../docs/rules-conformance.md).

# BOTTE MICIDIALI Server

Botte Micidiali is a card game of my own invention. It shamelessly robs some elements from other successful card games such as Magic: The Gathering, Yu-Gi Oh!, Hearthstone and the such, but it includes some concepts and mechanics never seen before. 

## What's this?
Botte Micidiali is a card game that mimics what happens in a street brawl among big, bad and ugly thugs. Cards represents the character you play, actions you can do and objects you can use to kill others and remain alive yourself.

Up to five bad guys play their cards all at the same time, performing actions on others or objects around them. Knowing who to attack and when to do it, rather than defending or buffing oneself is a crucial skill. 

## State of the Project
```
// TODO: write a sensible README for this project
```

I don't think I need to elaborate further about this.

## License 

All rights reserved.

*All*.

*Rights*.

*Reserved*.

Yeah, that's it. I will not grant any License on this code, at least until I have *perfectly clear* where this entire thing is going to end. If any of you have anything to say on the matter that might make me change my mind, please do by all means.

## Contributions

I am of course well inclined to accept contributions, but be aware there is no such thing as a predefined Contributor License Agreement. 

Please contact me if you are interested in such matters; otherwise, I will simply accept any good Pull Requests as donations, write a thing or two about the contributor somewhere in the app itself and call it a day. 


## Avvio locale dopo I03

PostgreSQL non è più richiesto. Il JAR usa un catalogo SQLite read-only e un file applicativo separato, `./data/bm.sqlite` relativo alla directory di avvio (override `BM_DATABASE_PATH` o `--app.database.path`). Profilo locale predefinito, ascolto su 127.0.0.1:8080; nessun account predefinito o invio SMTP attivo.

Dalla directory comune del workspace: `./scripts/build.ps1 -Task TestServerContext -Offline` verifica contesto e persistenza su file temporanei, `./scripts/build.ps1 -Task Server -Offline` produce il JAR. Istruzioni complete in [setup](../docs/setup.md) e [report I03](../docs/reports/i03-report.md). Il bootstrap delle API non certifica ancora una partita completa o il client browser.
