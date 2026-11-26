# Piano CA-0 — Motore e formato delle carriere

Scritto il 20 novembre 2026, a banco fra il proprietario e la regia delle carriere, e approvato dal proprietario lo stesso giorno
(«Approvo»). È il piano di [CA-0](product-roadmap.md#ca--carriera-single-player) della roadmap del prodotto. **Solo piano:** non introduce
regole attive (R00 del [regolamento](game-rules.md)). Il metodo è quello di [orchestrazione-lavoro.md](orchestrazione-lavoro.md); le
verifiche si scelgono dalla [tabella delle aree](aree-protette.md).

> **Ripartenza** (aggiornata il 26 novembre 2026). La aggiorna chi chiude un blocco e la regia a ogni decisione.
>
> - **In vigore:** confini di [DC1](#decisioni): niente `client-web` e `server` fino a C5, SB-30 ed EC-0. Regolamento **2.3** con i
>   modificatori di incontro (R08a) e Set Base 1.0.4 (CA-0e); il [catalogo dei modificatori](carriere/modificatori.md) 0.1 dice quelli
>   concreti. Nessuna partita li applica fino a CA-0f. Le storie restano nel [serbatoio](design/carriere/README.md), senza valore normativo ([DC4](#decisioni)).
>   Il [prototipo](design/carriere/prototipo.md) (CA-0a) resta il posto dove provare le storie; il formato è il
>   [formato delle carriere 0.2](carriere/formato.md) (CA-0b, CA-0e).
> - **In attesa:** nulla.
> - **Prossimo:** la parte di strumento di CA-0 è finita (CA-0c: `tools/carriere/`; CA-0d: pacchetti versionati con impronte in
>   `tools/carriere/pacchetti/`, [rapporto](reports/ca/ca-0d.md)). **CA-0e chiuso** il 26 novembre 2026 ([DC8](#decisioni)).
>   CA-0f aspetta SB-30, che nel Set Base viene dopo i lotti di SB-32 e C5, ed EC-0, non ancora partito; CA-0g aspetta C5.
> - **Fuori dal piano, nel serbatoio:** dialoghi della campagna principale completi e mockup alla 0.3.7 sui dialoghi veri
>   ([riga](product-roadmap.md#lavori-anticipati)); illustrazioni approvate e adottate dal prototipo il 21 novembre 2026, con i
>   ripieghi dell'[elenco](design/carriere/illustrazioni.md#campagna-principale) per le espressioni che non si generano; secondo giro delle
>   bocche adottato. Restano aperti la prova del prototipo su un telefono vero e l'idea, non decisa, di rinominare il nodo F1
>   ([prossimi passi](design/carriere/principale.md#prossimi-passi)).
> - **Decisioni da leggere:** DC1–DC8.

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
| [CA-0c](#ca-0c--strumento-delle-carriere) | Strumento: convertitore, validazione, controllo del grafo | dopo CA-0b | diretto | **Chiuso** il 21 novembre 2026 ([rapporto](reports/ca/ca-0c.md)) |
| [CA-0d](#ca-0d--pacchetto-delle-carriere) | Pacchetto JSON con versione e impronte, controllato come `check-rules.py` controlla le carte | dopo CA-0c | diretto | **Chiuso** il 21 novembre 2026 ([rapporto](reports/ca/ca-0d.md)) |
| [CA-0e](#ca-0e--modificatori-di-incontro) | Modificatori di incontro nel regolamento, con la precedenza di R00 | dopo SB-28 | con proposta | Proposta decisa ([DC5](#decisioni)); **Chiuso** il 26 novembre 2026 ([rapporto](reports/ca/ca-0e.md), [DC8](#decisioni)) |
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

**Stato:** chiuso il 21 novembre 2026. [Rapporto](reports/ca/ca-0c.md): `tools/carriere/` senza dipendenze proprie (solo il Node isolato), 22 prove
dello strumento e 117 del prototipo verdi, stessi numeri di prima sulle tre storie, avviso nuovo per il ritento dopo una `[Sconfitta: …]`.

## CA-0d — Pacchetto delle carriere

**Risultato:** ogni carriera (tutorial, prova, principale) è un file JSON committato in `tools/carriere/pacchetti/<id>.json`, prodotto dallo
strumento: forma del pacchetto, `formato: "0.1"`, id, `versione`, le impronte (storia e cast usato) e la carriera convertita. La versione di
ogni carriera è in `tools/carriere/carriere.json`, perché il markdown non la dichiara ([F13](carriere/formato.md#f13--versioni)).
`run.ps1 -Task Package` scrive i pacchetti; `-Task Check` li confronta in sola lettura con quello che si genererebbe e fallisce se mancano,
sono in più, sono fuori data, o se storia o cast usato sono cambiati senza alzare la versione.

**Stato:** chiuso il 21 novembre 2026. [Rapporto](reports/ca/ca-0d.md): 3 pacchetti riproducibili, 27 prove dello strumento (5 nuove) e 117 del
prototipo verdi, numeri delle tre storie invariati. Il convertitore ora ignora BOM e CRLF della storia.

### CA-0e — Modificatori di incontro

**Risultato:** il regolamento definisce i modificatori di incontro come sistema (primitive, dichiarazione al tavolo, precedenza nello
stile di R00, solo partite di carriera, nessun bot che bara da solo) e un catalogo dice quelli concreti che le storie nominano; il
formato e lo strumento li risolvono e li controllano. Passo con proposta.

**Stato:** proposta del 26 novembre 2026 ([rapporto](reports/ca/ca-0e.md)): sei primitive in una sezione nuova R08a, catalogo
`docs/carriere/modificatori.md`, formato 0.2, principale 2. Decisa il 26 novembre 2026 ([DC5](#decisioni)): cinque primitive, senza
Mazzo. Attuata il 26 novembre 2026 dopo la chiusura di SB-34 ([DC6](#decisioni), [DC7](#decisioni)): regolamento 2.3 con R08a, Set Base
1.0.4 (solo il regolamento richiesto), [catalogo dei modificatori](carriere/modificatori.md) 0.1 coi sei della principale, formato 0.2, strumento che
risolve e controlla i modificatori, pacchetti di forma 2 con principale alla versione 2 ([attuazione](reports/ca/ca-0e.md#attuazione)). **Chiuso** il 26 novembre 2026
dopo la revisione della regia ([DC8](#decisioni), [chiusura](reports/ca/ca-0e.md#chiusura)).

## Decisioni

| Id | Data | Decisione | Fonte |
|---|---|---|---|
| DC1 | 20 novembre 2026 | CA-0 in due parti: formato, strumento e pacchetto subito; modificatori, motore e client dopo SB-28, SB-30 ed EC-0 e C5. Prima di allora niente `client-web`, `server`, regolamento e documenti di set | Piano approvato dal proprietario: «Approvo» |
| DC2 | 20 novembre 2026 | Lo strumento è in TypeScript, riusando il codice del prototipo e il linguaggio del client | Stesso |
| DC3 | 20 novembre 2026 | Il prototipo diventa un utilizzatore dello strumento: un solo convertitore | Stesso |
| DC4 | 20 novembre 2026 | Adesso diventa normativo solo il formato; storie e dialoghi restano nel serbatoio, senza valore normativo, fino all'avvio di CA-1 e CA-2 | Stesso |
| DC5 | 26 novembre 2026 | Proposta di CA-0e approvata con le raccomandazioni della regia: (1) attuazione dopo la **chiusura** di SB-30a, come regolamento 2.3; (2) S1, lettura (a): Protezione degli oggetti di Piera e Vista in meno per il giocatore; (3) Recupero ogni 3 turni, l'ultima carta regolare scartata, deterministico e mostrato; (4) catalogo condiviso `docs/carriere/modificatori.md`; (5) **niente primitiva Mazzo** finché una storia vera non la usa, come per le estensioni del formato (CA-0b): le primitive sono cinque | Proprietario: «Come raccomandi tu», sulla [revisione della regia](reports/ca/ca-0e.md#decisione-del-proprietario) |
| DC6 | 26 novembre 2026 | L'attuazione di CA-0e aspetta anche la chiusura di SB-34: SB-34 scrive `docs/sets/base.md` e `scripts/check-rules.py`, e il set deve richiedere il regolamento pubblicato, quindi il passaggio alla 2.3 tocca lo stesso documento | Proprietario: «aspettiamo di chiudere anche sb 34 a questo punto» |
| DC7 | 26 novembre 2026 | Eccezione a DC1 per l'attuazione di CA-0e, solo per il passaggio di versione: il regolamento 2.3 porta il Set Base alla 1.0.4 (il set richiede il regolamento pubblicato), quindi possono cambiare `server/src/main/resources/sets/base.json` (generato) e la riga della versione in `MatchArchiveTest.java`; nessun codice di `server/src/main` | Proprietario: «Sì, approvo» |
| DC8 | 26 novembre 2026 | CA-0e chiuso con le raccomandazioni della regia sulle domande 1–3 dell'attuazione: (1) i testi dei sei modificatori restano come li ha scritti l'esecutore; (2) i limiti dei parametri restano nel catalogo, non nel regolamento; (3) i PDF di stampa rimasti al Set Base 1.0.2 sono del Set Base: si segnalano alla sua regia, nessun lavoro delle carriere | Proprietario: «Sì, chiudi» |
