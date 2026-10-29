# C2b-7 — Scheda della prova umana B

29 ottobre 2026. Regolamento **1.8**. Scheda per la prova umana B sulla parità
completa del client web (D3, D13 del [piano C2b](../../../history/client-c2b-plan.md#c2b-7--checklist-di-parità-e-prova-umana-b)).
La conduce il proprietario; la parte automatica di C2b-7 è nel
[rapporto C2](../../client-c2-report.md#c2b-7--checklist-di-parità-e-prova-umana-b).
**Sessione fatta il 29 ottobre 2026** dal proprietario (esiti [sotto](#osservazioni)); **C2 chiusa** dal proprietario lo stesso giorno.

Scopo: vedere se persone che non hanno scritto il client riconoscono da sole
**attesa**, **mossa accettata**, **proprio esito** e, in FFA, **il forfait di un
altro con la partita che continua**. Non si misura nulla; le scadenze rare (rientro
oltre 30 s, riavvio, pareggio per tempo) restano alle verifiche automatiche e non
si fanno provocare ai giocatori. Nessuna regola si cambia per un'osservazione:
un dubbio sul gioco va in [questioni aperte](../../../open-questions.md) e passa
da `docs/game-rules.md` (AGENTS.md).

## Partecipanti e tempi

3–5 persone, circa un'ora, un account ciascuno. Un account non può essere usato
su due dispositivi insieme: il secondo accesso viene rifiutato («Credenziali
errate, oppure l'account è già collegato altrove.»).

| Account | Password | Persona | Dispositivo |
|---|---|---|---|
| `devAlice` | `local-alice` | | |
| `devBob` | `local-bob` | | |
| `devCarol` | `local-carol` | | |
| `devDave` | `local-dave` | | |
| `devErin` | `local-erin` | | |

Sono gli account sintetici del profilo locale (D3, commit `30b8855`), validi solo
con `-SeedAccounts` e solo su 127.0.0.1; le password sono pubbliche nel repository
e non vanno riusate altrove.

## Avvio (proprietario, prima della sessione)

Dalla radice del repository, Windows / PowerShell. Prerequisiti: jar del server
costruito dopo `30b8855` (lo è quello usato in C2b-7) e Node del client
(`./client-c0/run.ps1 -Task Bootstrap`, `./client-web/run.ps1 -Task Install`).

1. **Database.** Il database locale `server/data/bm.sqlite` non avviava il server
   in C2b-2 («Conflicting recovery sequence» nel giornale di recupero, file del
   27 ottobre); in C2b-7 non è stato toccato né riprovato. Per non dipendere da
   lui, e per tenere le partite di prova separate, consiglio un database dedicato
   (il server lo crea al primo avvio):

   ```powershell
   New-Item -ItemType Directory -Force "$env:TEMP\bm-prova-b"
   $env:BM_DATABASE_PATH = "$env:TEMP\bm-prova-b\bm.sqlite"
   ```

   Usare invece il database locale è una scelta del proprietario.
2. **Server**, nello stesso terminale (porta 8080):

   ```powershell
   ./scripts/dev.ps1 -Task Server -SeedAccounts
   ```

   Le cinque identità vengono create solo se mancano. Il server è pronto quando
   il passo 4 riesce ad accedere.
3. **Client** in un secondo terminale. Con telefoni o altri PC nella stessa Wi-Fi:

   ```powershell
   ./client-web/run.ps1 -Task Physical
   ```

   Ricompila, serve la build sull'indirizzo privato del PC e stampa
   `http://192.168.x.x:4320/?k=…`. **Lo stesso indirizzo con il codice vale per
   tutti i dispositivi, PC compreso**: mentre `Physical` è attivo
   `127.0.0.1:4320` non risponde. Il codice cambia a ogni avvio. Se Windows chiede
   di consentire Node: basta «Reti private», ed è una decisione del proprietario.
   Solo PC locali, senza telefoni: `./client-web/run.ps1 -Task Serve` e
   `http://127.0.0.1:4320`.
4. **Controllo prima di chiamare le persone:** login di `devAlice` e `devBob` in due
   finestre (una anonima), «Uno contro uno» → «Gioca» per entrambi, una mossa a
   testa, poi «Abbandona» dal menu •••.
5. **Dopo la prova:** Ctrl+C sui due terminali; `Remove-Item Env:BM_DATABASE_PATH`;
   la cartella `bm-prova-b` si può cancellare.

## Da dire ai partecipanti (una volta, all'inizio)

- Si gioca con le regole correnti, le carte sono provvisorie nella grafica.
- Le mosse sono simultanee: il turno si risolve quando tutti hanno scelto.
- **Fra persone ogni mossa ha 30 secondi**; chi non muove perde la partita
  (contro il computer no). Non è un test della pazienza: chi deve fermarsi lo dica.
- Il menu ••• in alto spiega il tavolo e permette di abbandonare.
- Non spiegare altro: le domande dei partecipanti sono osservazioni da annotare.

## Scenari

Ordine consigliato; i tempi sono indicativi. Ogni persona annota (o il
proprietario annota per lei) nella [tabella](#osservazioni) solo ciò che blocca o
non si capisce.

### S1 — Duello fra due persone (circa 15 minuti)

Coppie: «Uno contro uno» → «Gioca» per entrambi. Una partita fino all'esito, poi
«Nuova partita» (rientra nella stessa coda). Con un numero dispari, chi resta
gioca «Contro il computer».

| Ciascuno deve riconoscere | Cosa mostra il client |
|---|---|
| Attesa | Coda 1v1 senza lista pubblica: «In coda», «In attesa di un altro giocatore…» con «Esci dalla coda». |
| Mossa accettata | Dopo ✓: «Mossa ricevuta · In attesa»; fra persone il proprio clock mostra «—». Un rifiuto del server lascia carta e bersaglio scelti con il motivo (in inglese, limite noto). |
| Proprio esito | Pannello «Hai vinto», «Hai perso» o «Pareggio» con il motivo; «Nuova partita», «Torna all'hub». |

### S2 — Tutti contro tutti con computer (circa 20 minuti)

Tutti in «Tutti contro tutti» → «Gioca»; la lista mostra chi siede, in ordine
d'ingresso. Con meno di cinque persone una di loro usa «Aggiungi computer» fino a
cinque posti (la partita parte da sola), oppure «Inizia ora» con almeno due iscritti.
A metà partita **una persona sceglie dal menu ••• «Abbandona la partita»** (forfait).
Se avanza tempo, una seconda FFA con «Inizia ora» e senza computer.

| Ciascuno deve riconoscere | Cosa mostra il client |
|---|---|
| Attesa | Lista della coda con i posti liberi, «Computer 1…4» per i computer. |
| Mossa accettata | Come in S1. |
| Forfait altrui (chi resta) | Il posto di chi ha abbandonato diventa «forfait»; la partita continua; nell'ispezione del suo personaggio la ragione («ha abbandonato»). |
| Proprio esito | Chi abbandona: esito e ritorno all'hub. Chi muore: «Sei fuori dalla partita · Eliminato: puoi guardare fino all'esito», con «Resta a guardare». Alla fine vittoria, sconfitta con il vincitore («Vince …») o pareggio. |

### S3 — Mazzo salvato (circa 15 minuti)

Ognuno: scheda «Collezione» → «Nuovo mazzo»; personaggio, azione base, ultima
risorsa, qualche legata e regolare a scelta; «Salva». Poi «Gioca» → «Con un tuo
mazzo» → scelta del mazzo → partita contro il computer fino all'esito (o abbandono
dopo qualche turno). Facoltativo: modificarlo, «Sovrascrivi», cancellarlo.

| Ciascuno deve riconoscere | Cosa mostra il client |
|---|---|
| Cosa manca al mazzo | Elenco delle mancanze; «Salva» spento finché ce ne sono. |
| Mazzo salvato | Compare nell'elenco e nel dialogo di «Con un tuo mazzo». |
| Attesa, mossa accettata, esito | Come in S1 (contro il computer non c'è il limite di 30 s). |

Nota per chi conduce: un mazzo con base più cinque legate e nessuna regolare in
mano può non avere mosse (limite R03 della base, il gioco non prevede di passare):
si abbandona dal menu. Annotarlo, non correggerlo.

### S4 — Telefono (dentro S1 o S2)

Almeno una persona gioca S1 o S2 dal telefono con l'indirizzo di `Physical`, in
landscape (il tavolo lo chiede; home, regole, moduli e collezione ammettono il
portrait, D7). Stesse cose da riconoscere; in più annotare se carte, oggetti
coperti in FFA (primo tocco alza, secondo sceglie) e pulsanti si toccano senza
errori.

## Osservazioni

Una riga per osservazione. **Tipo**: B = blocco (non si riesce a continuare o a
capire come), I = incomprensione (ci si riesce, ma dopo aver chiesto o sbagliato).
**Tappa**, secondo la [roadmap](../../../client-roadmap.md):

- **C2** — parità e funzione: un percorso del debug che manca o si rompe, un'attesa
  o un esito che il client non mostra, un errore senza messaggio. Va corretto prima
  di chiudere C2.
- **C3** — risoluzione osservabile: cosa è successo nel turno, chi ha colpito chi,
  effetti, riepilogo che copre gli avversari.
- **C4** — finitura: grafica, cornici, simboli, dimensioni, suoni, prestazioni,
  aspetto dei controlli.
- **Regole** — dubbio sul gioco: solo annotato, non è del client.

| # | Scenario | Account / dispositivo | Cosa è successo (parole della persona) | Tipo B/I | Tappa C2/C3/C4/Regole | Note del proprietario |
|---|---|---|---|---|---|---|
| 1 | S1 duello | — | Niente da segnalare, tutto ok. | — | — | |
| 2 | S2 FFA con computer | — | Niente da segnalare, tutto ok. | — | — | |
| 3 | S3 mazzo salvato | — | Non si capisce bene cosa è nel mazzo e cosa no: manca un riepilogo del mazzo corrente. | I | con il nuovo editor (riga 4), deciso dal proprietario | O15 nella roadmap |
| 4 | S3 mazzo salvato | — | L'editor riprende la struttura del debug; si può cambiare per un deckbuilder più funzionale. | proposta | C4 o attività dedicata al deckbuilder | O16; solo client |
| 5 | S3 mazzo salvato | — | In seguito ci sarà la collezione dell'utente: il mazzo si costruisce con le carte che l'utente possiede. | proposta | Regole: attività separata | O17; cambia R02 e server, passa da `docs/game-rules.md` |
| 6 | S3 mazzo salvato | — | Il mazzo si sceglie sempre, non in una coda a parte: uno starter sempre selezionabile per ogni personaggio, oppure un mazzo proprio. | proposta | Regole: attività separata | O18; cambia R00/R02, code e protocollo |
| 7 | S4 telefono | — | Niente da segnalare, tutto ok. | — | — | |

## Riepilogo per persona

| Account | Attesa riconosciuta | Mossa accettata riconosciuta | Proprio esito riconosciuto | In FFA ha continuato dopo il forfait altrui | Telefono |
|---|---|---|---|---|---|
| tutti | sì (S1, S2, S4 «tutto ok») | sì | sì | sì | sì, nessun rilievo |

Esito riferito dal proprietario per scenario, non per persona. Dal log del server: almeno
`devAlice`, `devBob` e `devCarol` in una FFA con due computer; il proxy di `Physical` ha
ammesso un secondo dispositivo in rete locale oltre al PC.

## Giudizio del proprietario

Data, numero di persone, dispositivi, blocchi C2 aperti (se ce ne sono, C2 resta
aperta finché non sono corretti e riverificati), osservazioni passate a C3/C4,
decisione su C2:

> Nessun blocco. Una incomprensione (riepilogo del mazzo, riga 3) e tre proposte sul
> deckbuilder, sulla collezione e sulla scelta del mazzo (righe 4–6), registrate come
> O15–O18 nella [roadmap](../../../client-roadmap.md#osservazioni-della-prova-umana-b-c2b-7).
> Decisione su C2 (29 ottobre 2026): **C2 chiusa**. O15 non si corregge in C2: va con il
> nuovo deckbuilder (O16).
