# SB-22 — Guida alla prova umana

Preparata dalla regia il 21 novembre 2026, dopo [D162](../../set-base-decisioni.md#decisioni-del-proprietario). La bozza è il candidato z2 di [SB-21z](sb-21z-report.md), congelato. Non si fanno altri giri di misura: si gioca, si annota e si correggono solo le cose notate al tavolo.

## Avvio

Una volta dopo ogni pull, perché il jar deve contenere le varianti Java di SB-21h (Ne riparliamo fuori, Mi rialzo):

```powershell
./scripts/build.ps1 -Task Server -Offline
```

Server della bozza, con i sette costruiti in aggiunta agli starter:

```powershell
./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Draft "src/test/resources/set-base/bozza.json;src/test/resources/set-base/sb-22/costruiti.json"
```

Client, in un secondo terminale:

```powershell
./client-web/run.ps1 -Task Serve
```

Poi si apre http://127.0.0.1:4320. «Con un tuo mazzo» offre gli starter (`starter-*`) e i costruiti (`sb22.costruito-*`). Il computer usa uno starter a caso. Per affrontare un mazzo preciso si aggiunge `-Com <mazzo>`, per esempio `-Com sb22.costruito-duccio`; per lo stile del bot, `-Bot prudente` o `-Bot aggressivo` (predefinito `risorse`). Account locali: quelli creati da `-SeedAccounts` (`docs/setup.md`).

Il file `server/src/test/resources/set-base/sb-22/costruiti.json` contiene le liste di [liste-z2.json](sb-21z/liste-z2.json), senza carte proprie. Lo controlla `Sb22DecksTest`. Avvio e partita con `sb22.costruito-duccio` verificati dalla regia il 21 novembre 2026 su un database temporaneo.

Per il tavolo vero: `tools/print-cards/generate.py --bozza` (serve il modulo Python `reportlab`).

## Cosa giocare

In ordine di importanza. Bastano due o tre partite per riga.

1. **Spazienzio** (salute 70), starter contro due o tre starter. È il personaggio misurato peggio: coi bot sembrava forte per come lo giocano loro ([SB-21z](sb-21z-report.md#spazienzio-il-salto-viene-dai-bot)).
2. **Le bound nuove** di D159, negli starter: la difesa ×0,75 di un turno, la risorsa con danno, la pulizia. È la domanda nata in SB-22: avere modo di pararsi e caricare.
3. **Costruiti contro costruiti**, con `-Com`. Le coppie più sbilanciate misurate coi bot:
   - Duccio contro Mara (98%), Sergio (93%), Spazienzio (92%);
   - Beppe contro Duccio (89%);
   - Sergio contro Mara (91%).

   La forza dei costruiti segue la salute (Duccio 115 in testa; Spazienzio, Mara e Celestina in coda).
4. **Piera** contro Beppe e Duccio, e contro uno starter: era la consegna di [SB-21t](sb-21t-report.md#consegna-a-sb-22).
5. **Una o due FFA** («Tutti contro tutti»).
6. **Q12**, prova con una persona fuori dal progetto: un'ora di gioco osservata senza aiutare, poi tre domande. Va fatta prima del giudizio finale ([D105](../../set-base-decisioni.md#decisioni-del-proprietario)).

## Cosa annotare

Per ogni partita, una riga basta: mazzi, chi vince, turni a occhio, e se è stata **bella**, **noiosa** o **senza speranza**.

Da segnalare a parte:

- una carta che non si gioca mai, o che si gioca sempre;
- un numero scomodo da contare a mente;
- un testo che si capisce male;
- un momento in cui non c'era niente di sensato da fare.

## Come si chiude

Il giudizio del proprietario è il criterio decisivo di SB-22. Le note tornano alla regia, che propone solo correzioni puntuali (D162). Ogni correzione cambia la bozza, i test e la bozza di riferimento nella stessa modifica. Poi si va a SB-23 e SB-24.
