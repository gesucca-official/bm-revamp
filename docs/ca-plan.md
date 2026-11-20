# Piano CA-0 — Motore e formato delle carriere

Scritto il 20 novembre 2026, a banco fra il proprietario e la regia delle carriere, e approvato dal proprietario lo stesso giorno
(«Approvo»). È il piano di [CA-0](product-roadmap.md#ca--carriera-single-player) della roadmap del prodotto. **Solo piano:** non introduce
regole attive (R00 del [regolamento](game-rules.md)). Il metodo è quello di [orchestrazione-lavoro.md](orchestrazione-lavoro.md); le
verifiche si scelgono dalla [tabella delle aree](aree-protette.md).

> **Ripartenza** (aggiornata il 20 novembre 2026). La aggiorna chi chiude un blocco e la regia a ogni decisione.
>
> - **In vigore:** confini di [DC1](#decisioni): niente `client-web`, `server`, regolamento e documenti di set fino a C5 e SB-28. Le storie
>   restano nel [serbatoio](design/carriere/README.md), senza valore normativo ([DC4](#decisioni)). Il [prototipo](design/carriere/prototipo.md)
>   (CA-0a) resta il posto dove provare le storie; il formato è il [formato delle carriere 0.1](carriere/formato.md) (CA-0b).
> - **In attesa:** nulla.
> - **Prossimo:** [CA-0c](#ca-0c--strumento-delle-carriere), lo strumento delle carriere sul [formato 0.1](carriere/formato.md).
> - **Fuori dal piano, nel serbatoio:** le due immagini del secondo giro delle bocche, quando torna lo strumento di generazione
>   ([riga di CA-0a](product-roadmap.md#lavori-anticipati)).
> - **Decisioni da leggere:** DC1–DC4.

## Obiettivo e chiusura

Una carriera scritta in markdown di regia diventa un **pacchetto con una versione**: un controllo automatico lo valida e il gioco vero lo
legge. Il prototipo ha mostrato che il formato regge sul tutorial, sulla campagna principale con i dialoghi veri e su una mini-carriera di
prova. CA-0 lo trasforma in uno strumento del progetto, senza riscrivere le storie.

**Criterio di chiusura di CA-0:** la mini-carriera «prova» del prototipo si gioca nell'app vera, con scena di dialogo, bacheca, partite
contro computer, progressi e achievement salvati lato server. Il tutorial vero è CA-1.

## Confini e dipendenze

- **Subito, in parallelo a C5 e al Set Base ([D22](product-roadmap.md#decisioni-del-proprietario)):** CA-0b, CA-0c, CA-0d. Scrivono solo in
  `docs/carriere/`, `tools/carriere/`, `prototipi/carriere/` e nei documenti di questo filone; più, per CA-0c, una riga nuova nella tabella
  delle aree e il comando in `CONTRIBUTING.md`.
- **Dopo SB-28:** CA-0e (modificatori di incontro nel regolamento). **Dopo SB-30 ed EC-0:** CA-0f (motore lato server). **Dopo C5:**
  CA-0g (client).
- **Macchina:** il portatile, sullo stesso checkout del Set Base. I due filoni non condividono file scritti né input misurati: il prototipo
  e lo strumento usano il Node isolato di `.tools/client-c0`, non Maven né le porte di gioco. Le misure lunghe del Set Base non si
  disturbano: niente `Misura`, `Banco` o `Registra` del prototipo mentre gira una misura.
- **Commit:** prefisso del blocco («CA-0b: …»). Rapporti in `docs/reports/ca/<blocco>.md`, evidenze nella cartella omonima.

## Blocchi

| Blocco | Cosa | Quando | Passo | Stato |
|---|---|---|---|---|
| CA-0a | Prototipo delle carriere | — | a fasi | **Chiuso** il 12 novembre 2026 ([chiusura](design/carriere/prototipo.md#chiusura)) |
| [CA-0b](#ca-0b--formato-delle-carriere-01) | Formato delle carriere 0.1, documento normativo | subito | con proposta | **Chiuso** il 21 novembre 2026 ([rapporto](reports/ca/ca-0b.md), [formato 0.1](carriere/formato.md)) |
| [CA-0c](#ca-0c--strumento-delle-carriere) | Strumento: convertitore, validazione, controllo del grafo | dopo CA-0b | diretto | — |
| CA-0d | Pacchetto JSON con versione e impronte, controllato come `check-rules.py` controlla le carte | dopo CA-0c | diretto | — |
| CA-0e | Modificatori di incontro nel regolamento, con la precedenza di R00 | dopo SB-28 | con proposta | — |
| CA-0f | Motore lato server: progressi, segni, achievement, ricompense protette dal farming | dopo SB-30 ed EC-0 | con proposta | — |
| CA-0g | Scena di dialogo e bacheca nella shell React, banco della fluidità nel client | dopo C5 | a fasi | — |

### CA-0b — Formato delle carriere 0.1

**Risultato:** `docs/carriere/formato.md`, documento normativo con versione e cronologia come [`docs/sets/base.md`](sets/base.md),
subordinato al regolamento. Descrive tutto ciò che il convertitore del prototipo accetta sulle tre storie e nient'altro:

- il **markdown di regia**: preambolo e `[Carriera: …]`, nodi `## X — titolo`, battute ed espressioni, stacchi, corsivo e telefono,
  comandi fra parentesi quadre, partite, catena e ritento, scelte mute e messaggi, «a scelta», segni e condizioni, sblocchi e obbligatori,
  nodi segreti e tasche, uscite (anche condizionate), finali, achievement con indizi progressivi;
- il **cast**: personaggi, espressioni, espressioni future, ripieghi, alias, sfondi e varianti, sprite;
- le **garanzie del controllo**: che cosa è un errore e che cosa un avviso (raggiungibilità, vicoli ciechi, obbligatori su ogni percorso,
  segreti e achievement raggiungibili, battute che non si vedono mai), e il tetto degli stati;
- la **regola della versione**: che cosa cambia la versione del formato e che cosa la versione di una carriera. I modificatori di incontro
  sono solo un posto riservato fino a CA-0e.

Le estensioni nate nel prototipo entrano solo se usate da una storia vera; quelle rimaste solo nella storia di prova si segnalano come
domande. Il serbatoio ([regole del formato](design/carriere/README.md#come-si-scrivono-le-scene)) rimanda al documento invece di
ripeterlo.

**Perimetro:** `docs/carriere/formato.md` (nuovo), `docs/reports/ca/ca-0b.md`, la riga e la sezione di CA-0b e la Ripartenza di questo
piano, la sezione «Come si scrivono le scene» del serbatoio (solo il rimando). **Letture:** `prototipi/carriere/src/formato.ts`,
`converti.ts`, `valida.ts`, `grafo.ts`, `dati/cast.json`, le tre storie, i rapporti delle fasi del prototipo per le decisioni.
**Protetto:** le storie e il prototipo non cambiano. **Verifiche:** quelle «Sempre» per i soli documenti.
**Fatto quando:** ogni costrutto che il convertitore accetta sulle tre storie è descritto, con un esempio preso da una storia; nessuna
regola descritta manca al convertitore senza essere segnata come domanda; proposta, STOP, decisione del proprietario, poi la versione 0.1.

**Stato:** chiuso il 21 novembre 2026. [`docs/carriere/formato.md`](carriere/formato.md) è in vigore nella versione 0.1, con la
[decisione del proprietario](reports/ca/ca-0b.md#decisione-del-proprietario) sulle domande 1–4.

### CA-0c — Strumento delle carriere

**Risultato:** `tools/carriere/`, in TypeScript ([DC2](#decisioni)), con il Node isolato di `.tools/client-c0` e dipendenze proprie:
convertitore, validazione e controllo del grafo estratti dal prototipo, con le loro prove, e un comando che converte e controlla tutte le
storie del serbatoio. Il prototipo usa lo strumento al posto della sua copia ([DC3](#decisioni)): un solo convertitore.

**Perimetro:** `tools/carriere/**` (nuovo), `prototipi/carriere/**`, una riga nuova in [aree-protette.md](aree-protette.md) («se cambia
una storia, il cast, il formato o lo strumento → il controllo delle carriere»), il comando in `CONTRIBUTING.md`, rapporto e stato di
questo piano. **Protetto:** le storie del serbatoio; i numeri del controllo sulle tre storie (nodi, stati, finali, avvisi) uguali a quelli
del prototipo prima dell'estrazione; le prove del prototipo verdi. **Dal formato 0.1:** lo strumento rifiuta ciò che il formato non ammette, quindi la storia di prova va adattata alla 0.1 (niente «giri
n»); un `**Ritento.**` che dopo una `[Sconfitta: …]` non si vede mai è un avviso candidato ([discrepanza 4 di CA-0b](reports/ca/ca-0b.md)).
**Fatto quando:** il comando dello strumento dà gli stessi numeri del
prototipo, il prototipo li ottiene passando dallo strumento, e la tabella delle aree ha la riga nuova.

## Decisioni

| Id | Data | Decisione | Fonte |
|---|---|---|---|
| DC1 | 20 novembre 2026 | CA-0 in due parti: formato, strumento e pacchetto subito; modificatori, motore e client dopo SB-28, SB-30 ed EC-0 e C5. Prima di allora niente `client-web`, `server`, regolamento e documenti di set | Piano approvato dal proprietario: «Approvo» |
| DC2 | 20 novembre 2026 | Lo strumento è in TypeScript, riusando il codice del prototipo e il linguaggio del client | Stesso |
| DC3 | 20 novembre 2026 | Il prototipo diventa un utilizzatore dello strumento: un solo convertitore | Stesso |
| DC4 | 20 novembre 2026 | Adesso diventa normativo solo il formato; storie e dialoghi restano nel serbatoio, senza valore normativo, fino all'avvio di CA-1 e CA-2 | Stesso |
