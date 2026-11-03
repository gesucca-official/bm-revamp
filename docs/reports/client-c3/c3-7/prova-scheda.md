# C3-7 — Scheda di prova del proprietario

3 novembre 2026. Regolamento **1.10**. Scheda per il giudizio del proprietario su **desktop (Edge)** e **iPhone
(Safari, landscape)** al termine di C3 (D11 del [piano C3](../../../client-c3-plan.md#decisioni-del-proprietario)).
La parte automatica è nel [rapporto C3](../../client-c3-report.md#c3-7--consolidamento). **C3-7 è fatto, in attesa del tuo
giudizio**: C3 si chiude solo dopo questa prova.

Scopo: giudicare se il round si capisce guardando il tavolo e se la sequenza è piacevole senza togliere tempo per
scegliere. Le verifiche automatiche dicono che i dati sono giusti, non che **siano belli o leggibili**: questo lo
giudichi solo tu. Nessuna regola si cambia per un'osservazione; la finitura (grafica, simboli, cornici, suoni) va a
C4, il ritmo e l'eventuale versione velocizzata (O19) a C5 ([roadmap](../../../client-roadmap.md#osservazioni-registrate-durante-c3)).

## Avvio (prima della sessione)

Dalla radice del repository, Windows / PowerShell. Il server si avvia dal sorgente corrente: **ricostruisci il jar**
(quello in `server/target` può essere vecchio e senza `damageAmount`, e il volto delle carte non mostrerebbe gli importi).

1. **Jar aggiornato:**

   ```powershell
   ./scripts/build.ps1 -Task Server -Offline
   ```

2. **Database dedicato**, per non toccare `server/data`:

   ```powershell
   New-Item -ItemType Directory -Force "$env:TEMP\bm-prova-c3"
   $env:BM_DATABASE_PATH = "$env:TEMP\bm-prova-c3\bm.sqlite"
   ```

3. **Server** nello stesso terminale (porta 8080, account di prova `devAlice` / `local-alice`, `devBob` / `local-bob`):

   ```powershell
   ./scripts/dev.ps1 -Task Server -SeedAccounts
   ```

4. **Client**, in un secondo terminale. Desktop da solo: `./client-web/run.ps1 -Task Serve` e
   `http://127.0.0.1:4320`. Con l'iPhone nella stessa Wi-Fi: `./client-web/run.ps1 -Task Physical`, che ricompila e stampa
   `http://192.168.x.x:4320/?k=…` (stesso indirizzo con codice per tutti i dispositivi, PC compreso; il codice cambia a
   ogni avvio; se Windows lo chiede, «Reti private»).
5. **Dopo la prova:** Ctrl+C sui due terminali; `Remove-Item Env:BM_DATABASE_PATH`; la cartella `bm-prova-c3` si può cancellare.

Un account non può stare su due dispositivi insieme: usa `devAlice` sul desktop e `devBob` sull'iPhone, oppure una
prova alla volta.

## Partite da giocare

| # | Partita | Dispositivo | Cosa serve |
|---|---|---|---|
| P1 | «Contro il computer» (quick 1vCom), almeno 6 turni, fino all'esito se puoi | Desktop | Voci 1–14 |
| P2 | «Tutti contro tutti» con computer fino a cinque posti, almeno 4 turni | Desktop | Voci 1, 5, 7, 12, 14 |
| P3 | Duello fra due persone (`devAlice` contro `devBob`), almeno 4 turni | Desktop + iPhone | Voci 13–14: il tempo per scegliere |
| P4 | Quick 1vCom e FFA con computer | iPhone landscape | Voci 1–14, con attenzione a tocco e dimensioni |
| P5 | Una partita con «Riduci movimento» attivo nel sistema | Desktop (e iPhone) | Voce 12 |

Sul desktop prova anche una finestra più piccola (circa 844×390) per vedere la scala; non è il minimo supportato.

## Da ricordare mentre giochi

- La sequenza gioca **una carta per volta**: un tocco (o un tasto) sul tavolo passa al passo successivo; scegliere una
  carta della mano o «Salta effetti» la chiude. Il clock di 30 s tra persone non si ferma mai.
- Ordine per ogni carta (D13): **costo → primo piano di chi gioca → volo e impatto → primo piano del bersaglio → variazioni**.
- Il volto della carta ha tipo e importo del **danno nominale** (non quello reale, che stati e difese possono cambiare);
  la **priorità** si legge solo nell'ispezione (i).
- Segna anche ciò che è solo «strano» o «brutto»: le osservazioni di finitura vanno a C4, non sono difetti di C3.

## Voci da giudicare

**Esito:** ✔ ok · ~ ok con riserve · ✘ non va · — non provato. **Dispositivo:** D = desktop, I = iPhone. Una riga per
dispositivo e voce; le note sono parole tue, anche brevi.

| # | Voce | Cosa guardare | D esito | D nota | I esito | I nota |
|---|---|---|---|---|---|---|
| 1 | **Leggibilità del tavolo e scala (D14)** | Il tuo personaggio è visibilmente più grande degli altri; risorse, personaggi e oggetti si leggono senza zoom; le carte dell'ultimo round al centro, il mazzo e gli scarti accanto al tuo posto. Nulla è sovrapposto o fuori schermo (nota: 750×292 non entra, O22). | ☐ | | ☐ | |
| 2 | **Frecce dei bersagli (O6)** | Scegliendo o trascinando una carta, le frecce vanno solo ai bersagli ammessi, non coprono ✓/×, non confondono in FFA. Scompaiono quando la scelta è bloccata. | ☐ | | ☐ | |
| 3 | **Una carta per volta, il tocco avanza (D12)** | La sequenza è seguibile; un tocco sul tavolo passa al passo dopo; scegliere una carta o «Salta effetti» chiude; lo stato finale è quello della partita. | ☐ | | ☐ | |
| 4 | **Ordine di ogni carta (D13)** | Costo prima della carta; primo piano di chi gioca (con la carta accanto); volo e impatto; primo piano del bersaglio; poi le variazioni. L'ordine si capisce e non c'è un passo che sembra fuori posto. | ☐ | | ☐ | |
| 5 | **Primi piani** | Chi gioca e il bersaglio si riconoscono, non coprono altro, durano né troppo né poco (circa 1 s e mezzo secondo). In FFA i posti centrali. | ☐ | | ☐ | |
| 6 | **Scritte** | Le scritte delle risorse («Salute −7») restano leggibili abbastanza e non si accavallano; sul telefono si leggono. | ☐ | | ☐ | |
| 7 | **Oggetti e carte animati** | Oggetti consumati, rubati, comparsi; carte giocate che vanno alla pila; pesche dal mazzo (le tue scoperte, quelle altrui dorsi): si capisce cosa succede? | ☐ | | ☐ | |
| 8 | **Volto della carta** | In mano, nel primo piano, nel catalogo e nell'editor: tipo e importo del danno (colpo, taglio) si leggono e si distinguono; costo e variazioni restano chiari; la priorità non c'è sul volto ma c'è nell'ispezione. Sulle carte piccole al centro c'è solo il simbolo. | ☐ | | ☐ | |
| 9 | **Impatti per tipo (O7)** | Un colpo (stella rossa con il cuore giallo e un'onda d'urto che si espande sul bersaglio) e un taglio (coltello con il riflesso celeste) sono distinguibili; la carta del personaggio colpito vibra e si scurisce per ogni danno, colpo o taglio (quanto scura, quanto a lungo: ti piace?); le carte senza danno hanno il segno del loro ruolo (difesa, risorse, contrasto, disturbo, oggetti). Estetica, dimensione, durata, colore: ti piacciono? | ☐ | | ☐ | |
| 10 | **Enfasi** | «ANNULLATA» con croce sul bersaglio; «ELIMINATO» con anello e scossa del posto; banner «VITTORIA», «SCONFITTA» o «PAREGGIO» alla fine. Troppo, poco, giusto? | ☐ | | ☐ | |
| 11 | **Riepilogo e «Ultimo turno»** | Le strisce accanto ai posti (simbolo e numero con segno) si leggono e non coprono nulla; la riga breve non copre i posti in FFA; «Ultimo turno» dice prima i fatti in italiano, poi il testo del server; dopo un salto di turni dice quanti sono stati risolti. | ☐ | | ☐ | |
| 12 | **Movimento ridotto** | Con «Riduci movimento» nessuna sequenza, nessuna scossa, ma il riepilogo statico c'è e «Ultimo turno» funziona; il volto delle carte ha comunque il segno del danno. Vuoi il segno anche statico sul bersaglio? (O21) | ☐ | | ☐ | |
| 13 | **Durata complessiva** | Due mosse circa 7–10 s; FFA con cinque mosse fino a circa 20 s. Ti sembra accettabile? Sulle partite lunghe stanca? Segna quale round e quanto. | ☐ | | ☐ | |
| 14 | **Tempo per scegliere (A2)** | Contro una persona, la sequenza «toglie troppo tempo» ai 30 s della mossa? Hai mai finito la sequenza con troppo poco clock per scegliere? Se sì: quando, in che partita, quanto clock era rimasto (misure: [rapporto](../../client-c3-report.md#c3-7--consolidamento)). | ☐ | | ☐ | |
| 15 | **iPhone: tocco e dimensioni** | Solo iPhone: le carte della mano si toccano senza errori, il tocco che avanza non invia mosse per sbaglio, i primi piani non coprono i pulsanti, il landscape tiene. | — | — | ☐ | |
| 16 | **Voce libera** | Qualunque altra cosa: bella, brutta, confusa, mancante. | ☐ | | ☐ | |

## Osservazioni

Una riga per osservazione. **Tappa**: **C3** solo un difetto del comportamento descritto nel piano (da correggere prima
di chiudere); **C4** finitura (grafica, cornici, simboli, dimensioni, suoni, prestazioni, aspetto); **C5** ritmo e
playtest, compresa una versione velocizzata; **Regole** un dubbio sul gioco (solo annotato, passa da
`docs/game-rules.md`).

| # | Voce | Dispositivo | Cosa è successo / cosa pensi | Tappa C3/C4/C5/Regole | Note |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

## Giudizio del proprietario

Data, dispositivi usati, partite giocate, difetti C3 aperti (se ce ne sono C3 resta aperta fino alla correzione e alla
riverifica), osservazioni passate a C4/C5, decisione su A2 (clock più lungo: solo con un segnale dalla voce 14) e su C3:

> _da compilare_
