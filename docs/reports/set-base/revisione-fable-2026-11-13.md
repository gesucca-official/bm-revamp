# Revisione indipendente prima di SB-16g Fase 2b — 13 novembre 2026

Revisione in sola lettura su `main` a `46c53cc`. Nessun file del progetto è stato modificato: questo rapporto è l'unico file scritto.
Tempo: circa un'ora. Le prove sul motore sono state fatte con quattro test di sonda in una **copia** di `server/` fuori dal
repository (cartella temporanea), con lo stesso Maven e lo stesso deposito locale; i casi sono trascritti sotto, così si rifanno.

Ogni rilievo dice: gravità, **CONFERMATO** (con prova) o **IPOTESI**, regola o decisione toccata, correzione proposta, chi decide.

## Risposta alla domanda sulla vulnerabilità «tre stati con timer di due turni»

**È atteso fino alla 2b, non è un difetto del motore.** Prova:

- Le cinque carte di caricamento della bozza sono ancora quelle di SB-16d (variante c). Il loro passo `search` non ha il campo
  `vulnerability`, e l'esposizione è scritta come normali passi `status` con `turns: 1`: tre per Mara, Celestina, Piera e Beppe
  (HIT, CUT, POISON), uno solo per Spazienzio (HIT). Vedi `server/src/test/resources/set-base/bozza.json:583-615` (Piera) e `:83-106`
  (Spazienzio). In tutta la bozza `vulnerability` non compare mai.
- Il motore della 2a rivista crea il gettone D69 solo se la carta lo chiede (`DataCards.java:381-384`, `Game.java:230-231`). Con le
  carte di oggi quindi **il gettone legato al nome non nasce mai**: del lavoro della 2a si vede solo la carta trovata a faccia in su.
- Il client raggruppa in un solo segnalino gli stati con lo stesso `exposure` (`client-web/src/readability.ts:106-110`); i tre stati
  della bozza non hanno `exposure` e restano tre segnalini.

Da controllare alla consegna della 2b: un solo segnalino «Vulnerabile ×1,5» con «∞», nessuno stato `status` residuo sulle dieci
carte di caricamento, testi delle carte allineati a D69.

Il doppio punto («…il prossimo.. finisce a fine turno») invece è un piccolo difetto vero del client: vedi C1.

## Area 1 — Motore con le regole d50

Letti per intero `Game`, `Move`, `Player`, `Character`, `Ruleset`, `Status`, `Vulnerability`, `DataCards` (passi e controlli),
`BotView`. Corretti alla lettura, senza rilievi: gruppi di velocità (priorità e A dopo i costi), annullamento «a terra» con le
mosse su di sé conservate, pavimento a zero, corazza L/4 dopo gli stati e solo sui HIT, ordine dei timer per creazione
(`LinkedHashSet`), ricerca che ripiega sulla pesca, gettone che resta dopo lo scarto, pulizia a fine partita, eliminazione e forfait.

### M1 — Il gettone va via a fine gruppo di velocità: per chi è veloce costa quasi niente

- **Gravità:** importante. **Meccanismo CONFERMATO**, **effetto sul bilanciamento IPOTESI**.
- **Prova del meccanismo:** `Game.java:199-203` chiama `settleGroup` al cambio di gruppo; test esistente
  `VulnerabilitaD69Test.insideASpeedGroupTheTokenGoesAtTheEndOfTheGroup`. D69 ha tolto il minimo di due turni di D59.
- **Conseguenza:** nel turno del caricamento l'avversario sceglie senza sapere (scelta simultanea), quindi il gettone punisce
  solo per caso. Nel turno dopo, se il colpo cercato si risolve in un gruppo più veloce dei colpi avversari, il gettone sparisce
  **prima** che quei colpi arrivino. Per Mara (A 40) o per un colpo di priorità alta la vulnerabilità vale di fatto un solo turno
  «cieco»; per Spazienzio (A 20) e Piera (A 15) vale due turni pieni. La stessa carta ha un prezzo diverso secondo la velocità.
- **Regola toccata:** D69 (fine gruppo), D59 (minimo tolto), D52 («accumulo rischioso, con un'esposizione che dura anche il turno dopo»).
- **Proposta:** nella 2b misurare a parte «danno ricevuto con il gettone attivo» per personaggio; se il divario è netto, togliere
  il gettone a fine turno invece che a fine gruppo, oppure tarare i fattori per velocità.
- **Decide:** proprietario (è una regola di gioco già decisa in D69).

### M2 — «Ultimo colpo» non si può giocare con HEALTH sotto il costo

- **Gravità:** importante come coerenza con D50, oggi **latente**: nessuna carta della bozza ha `lastBlow`.
- **CONFERMATO.** Sonda: carta `{"lastBlow":true,"cost":{"HEALTH":10}}`, autore con HEALTH 5, regole d50 → rifiutata con
  «cant be cast with current resources». Causa: il controllo generale dei costi (`Move.java:186-190`) vale anche per HEALTH e
  viene prima dell'eccezione (`Move.java:192`, `healthCostAllowed`); lo stesso in `BotView.java:186`.
- **Regola toccata:** D50 punto 2: con «Ultimo colpo» «si può pagare anche fino a 0 **o sotto**». Il test di SB-16c copre solo il
  caso «esattamente fino a 0» (`RegoleD50Test.ultimoColpoPaysDownToZeroAndResolvesFromTheGround`).
- **Proposta:** decidere la lettura e scriverla: o «Ultimo colpo» salta il controllo sulla HEALTH (si paga quel che c'è, si va a 0),
  o D50 perde «o sotto». Poi un test per il caso HEALTH < costo.
- **Decide:** proprietario.

### M3 — Una carta che cerca il proprio nome perde subito segnalino e carta scoperta

- **Gravità:** minore, **latente** (nessuna carta della bozza né della proposta 2b cerca se stessa).
- **CONFERMATO.** Sonda: carta «Eco» con `{"op":"search","card":"t.Eco","vulnerability":{"factor":1.5,"turnsIfNotFound":2}}`,
  seconda copia nel mazzo. Dopo il turno: ricerca riuscita (`found=true, copy=1`), ma zero stati e zero carte scoperte. Causa: la
  carta giocata entra in `played` (`Game.java:216`) prima che nasca il suo segno (`:230`), e a fine gruppo `settleGroup` lo
  considera soddisfatto (`:306-314`).
- **Regola toccata:** D69 (a); D54 («il caricamento è un effetto che possono avere varie carte, anche colpi»).
- **Proposta:** in `settleGroup` ignorare i segni creati dalla stessa mossa, oppure far rifiutare al caricatore un `search` del
  proprio binding. Un test.
- **Decide:** regia (è un difetto tecnico); il proprietario solo se vuole colpi che cercano la propria copia.

### M4 — Un costo può essere pagato solo in parte se uno stato moltiplica la perdita di quella risorsa

- **Gravità:** minore, **latente** (la bozza non ha stati sulle risorse: tutti gli `status` hanno `property` HIT, CUT o POISON).
- **CONFERMATO.** Sonda: V 10, costo 10 V, stato BAD che raddoppia la perdita di V. La mossa è accettata, V va a 0 invece di
  pagare 20, il colpo si risolve. Il controllo guarda il costo scritto (`Move.java:186-190`), il pagamento passa dagli stati
  (`Move.java:210-212`, `Character.java:163`) e il pavimento nasconde la differenza (`Character.java:186`).
- **Regola toccata:** D50 punti 2 e 3. Diventa vivo con l'idea di D64 («consumo aumentato di risorse per giocare le carte»).
- **Proposta:** quando quella vulnerabilità verrà proposta, decidere se il controllo usa il costo maggiorato. Fino ad allora niente.
- **Decide:** proprietario, al momento di D64.

### M5 — Il gettone può restare per tutta la partita

- **Gravità:** minore (comportamento voluto da D69), **CONFERMATO**. Sonda: caricamento che trova l'unica copia del colpo, copia
  scartata con una bound, sei turni dopo i tre stati `Vulnerable` ci sono ancora e nessuna carta è mostrata.
- **Rischio (IPOTESI):** con il colpo raro in copia unica la trappola è facile da far scattare per sbaglio, e in mano resta un
  ×1,5 senza uscita. Su telefono va detto chiaramente **prima** dello scarto.
- **Proposta:** nel client, un avviso quando si sceglie come scarto di una bound l'ultima copia di una carta che tiene un gettone.
- **Decide:** proprietario.

### M6 — Note minori sul codice (CONFERMATE alla lettura)

- `Game.java:230-231`: se la carta chiede la vulnerabilità ma la ricerca non viene eseguita perché la mano non è sotto sei
  (`:220`), nasce comunque il gettone anonimo di due turni, senza riga di ricerca nel rapporto. Non raggiungibile con le carte di
  oggi (una carta giocata lascia sempre la mano a cinque). Minore.
- `Game.java:228-229`: un oggetto trovato dalla ricerca dà il gettone anonimo. Non raggiungibile dalla bozza (D70, rifiutato dal
  caricatore), resta nel motore per chi costruisce carte nei test. Minore.
- Due gettoni: il danno si tronca a ogni passaggio (`Character.java:198`), quindi ×1,5 due volte non è sempre ×2,25 esatto
  (7 → 10 → 15, contro 15,75). Coerente con R05, da sapere per i testi. Minore.
- `Ruleset.java:9-15`: il commento elenca cinque regole e non cita carta scoperta e gettone (D58, D69), che pure dipendono
  dall'interruttore. Minore.

## Area 2 — Separazione dal gioco vivo

**Nessun rilievo.** Prove:

- L'interruttore si accende solo con il bean `BozzaDraft`, che esiste solo col profilo `bozza` (`BozzaDraft.java:38`,
  `GameFactoryServiceImpl.java:31-36`); il valore sta in `application-bozza.yml:13`.
- Ogni ramo nuovo del motore è dietro `ruleset.playground()`: `Game.java:188, 198, 216, 221, 230, 234`; `Character.java:150, 186`;
  `Move.java:203`. Con le regole 1.13 `takeRequestedSearch` e `dropRevealed` non fanno nulla.
- I campi nuovi delle viste sono assenti quando vuoti (`voidReason`, `search`, `exposure`, `factor`, `untilPlayed`, `revealed`).
- `python scripts/check-rules.py`: regolamento 1.13 e Set Base 0.1 allineati, 39 carte e 1 token. `check-links.py`: 294 file,
  0 link rotti. `verify-match-manifests.py`: PASS.
- Suite completa `./scripts/build.ps1 -Task Test -Offline`: verde (740 test del server, 0 falliti).

Osservazione (non un rilievo): la bozza sta in `server/src/test/resources/` ma i passi `search`, `Vulnerability` e il caricatore
stanno in `src/main`. È dichiarato dal piano (SB-16c, «tocca il motore»), quindi la separazione regge sull'interruttore e sui test
«a interruttore spento», non sulla distanza fisica dei sorgenti.

## Area 3 — Coerenza fra documenti, bozza, codice e client

### K1 — La proposta 2b e il motore dicono cose diverse sulla carta mostrata dopo uno scarto

- **Gravità:** importante. **CONFERMATO.**
- **Prova:** `docs/design/set-base/sb-16g-proposta.md:45`: «Il colpo mostrato rimane nella vista come promemoria finché c'è il
  relativo gettone, **anche se la copia trovata viene scartata**». Il motore mostra la carta solo se quella copia è in mano
  (`Player.java:149-153`, commento in `Game.java:301-304`); sonda M5: dopo lo scarto `shown=0` con il gettone ancora attivo.
  D69 (d) dice «a faccia in su nella mano finché c'è il suo gettone» e non decide il caso dello scarto.
- **Proposta:** scegliere una delle due prima di approvare la proposta. Tenere il promemoria (come scrive la proposta) è più
  leggibile: il segnalino dice già il nome, ma la carta è ciò che l'avversario riconosce.
- **Decide:** proprietario.

### K2 — Le carte di caricamento della bozza descrivono regole superate

- **Gravità:** minore, atteso fino alla 2b. **CONFERMATO.** I testi dicono «per 2 turni (questo e il successivo)» e «mostralo
  all'avversario» (`bozza.json:565`); D69 dice gettone senza timer. Spazienzio è esposto ai soli HIT (`bozza.json:83-86, 111`),
  D64 vuole tutti i danni «compreso Spazienzio». Tutto rientra nella riscrittura della 2b: va controllato che non resti indietro.
- **Decide:** regia.

### K3 — L'indice dello stato è fermo a prima di SB-16g

- **Gravità:** minore. **CONFERMATO.** `docs/README.md:10` «Aggiornato al 12 novembre 2026»; `:22` «Decisioni D1–D58» e
  «Prossima: SB-16g», mentre il piano ha D70 e la 2a rivista consegnata. `:64` dice ancora «decisioni D1–D49». Nel piano, il
  punto «2a» (`set-base-plan.md:987`) descrive ancora D59 e D65 (legame alla copia, minimo di due turni), corretti solo dalla riga
  `:985`.
- **Proposta:** aggiornare l'indice alla chiusura della 2b; nel piano, riscrivere il punto 2a secondo D69.
- **Decide:** regia.

## Area 4 — Client ed esperienza utente

**Non ho giocato dal vivo: il tempo non è bastato per avviare server e client.** I rilievi vengono dalla lettura del codice.

### C1 — Doppio punto nel testo degli stati della bozza

- **Gravità:** minore. **CONFERMATO alla lettura.** `readability.ts`, in `chipsOf`: il testo è
  `` `${statusText(name,description)}. …${lasting}.` ``; le descrizioni della bozza finiscono già col punto (`bozza.json:585`).
  Risultato: «…il prossimo.. finisce a fine turno.», come visto nel consulto.
- **Proposta:** togliere il punto finale della descrizione prima di comporre la frase. **Decide:** regia.

### C2 — Una mossa annullata da una contromossa non dice da chi

- **Gravità:** minore. **CONFERMATO alla lettura.** `resolution.ts:289`: senza `voidReason` il riepilogo scrive «Annullata durante
  il round (la vista non dice da quale mossa)». Il motore mette il motivo solo per «a terra» (`Game.java:267-268`); FAI BASTA e
  Riflessi Aumentati non lo scrivono.
- **Proposta:** far scrivere il motivo anche alle contromosse («annullata da FAI BASTA di …»), come campo della stessa vista.
- **Decide:** regia; tocca le carte Java, quindi dopo la 2b.

### C3 — La carta scoperta dell'avversario è sempre disegnata in fondo al ventaglio

- **Gravità:** minore. **IPOTESI** (non vista a schermo). `scene.ts:355-357`: le carte scoperte occupano le ultime posizioni del
  ventaglio e, durante la sequenza, quella trovata nel round arriva col volo di pesca. Su telefono il dorso è piccolo: la fascia
  «SCOPERTA ×1,5» è alta fra 11 e 22 px (`scene.ts:187`). Da guardare su iPhone nella prova umana dopo la 2b.

## Area 5 — Game design

Tutte **IPOTESI**, fondate sui numeri dei rapporti SB-16e e SB-16e2 e sul comportamento del motore; decide il proprietario.

- **G1 (importante).** Vedi M1: il prezzo del caricamento dipende dalla velocità di chi carica.
- **G2 (importante).** Una ricerca **fallita** costa meno di una riuscita: due turni di gettone anonimo contro un gettone senza
  scadenza. Con due copie del colpo NC, chi ha già pescato entrambe gioca il caricamento per le risorse (D63: «risorse sufficienti
  a giocare il colpo») e paga il prezzo minore. È l'uso «tutore che dà risorse» che il proprietario voleva scoraggiare in SB-16f.
  Misura per la 2b: quota di caricamenti giocati con ricerca fallita, per politica.
- **G3 (importante).** Patte (D51): con «chi è a terra non colpisce» gli specchi hanno spesso la stessa A e quindi lo stesso
  gruppo, dove i colpi restano simultanei. Colpi più forti e ×1,5 nella 2b accorciano le partite ma rendono più probabile il
  doppio KO nello stesso gruppo. Gli specchi di Celestina (18,57%) e Piera (13,07%) sono già fuori soglia: nella 2b vanno letti
  per primi, prima delle quote.
- **G4 (minore).** A parità di priorità e A, l'ordine dentro il gruppo è l'ordine di ingresso in partita (`Game.java:184`). Per i
  danni non conta, ma una contromossa «annulla se arriva dopo» (FAI BASTA) funziona solo per chi è seduto prima. Esiste già nel
  gioco vivo; con D50 («dentro un gruppo le mosse restano simultanee») diventa una contraddizione visibile.
- **G5 (minore).** Gettone permanente (M5): una punizione senza uscita non è una scelta, è un errore che si paga per tutta la
  partita. Valutare un'uscita costosa (per esempio: il gettone cade quando il mazzo non ha più copie e la mano nemmeno).

## Area 6 — Bot e test

- **B1 (importante, atteso per la 2b). CONFERMATO.** Le politiche dei bot non leggono né il gettone né le carte scoperte: in
  `StyleSupport` e nelle `*Policy` l'unico uso è la carta trovata nel round precedente (`StyleSupport.java:61`). `BotView` espone
  già `exposure`, `untilPlayed` e `revealed`. Senza questo le misure della 2b non dicono niente sul prezzo del gettone: va fatto
  **prima** del primo giro, non insieme.
- **B2 (minore). Buchi di copertura CONFERMATI** (casi senza test): «Ultimo colpo» con HEALTH sotto il costo (M2); ricerca del
  proprio nome (M3); costo con stato sulla risorsa (M4); gettone e FFA a più di due giocatori (tutti i test D69 sono a due);
  gettone su un autore a terra che si salva con una cura su di sé (D48).
- **B3 (minore). IPOTESI.** I bot non sanno valutare: tenere il colpo cercato sapendo che il gettone resta; colpire chi ha il
  gettone invece di pararsi; lo scarto che rende permanente il gettone. Le tre politiche previste coprono solo il primo punto.

## Verifiche eseguite

| Verifica | Esito |
|---|---|
| `python scripts/check-rules.py` | verde |
| `python scripts/check-links.py` | 294 file, 0 link rotti |
| `python scripts/verify-match-manifests.py` | PASS |
| Quattro test di sonda (copia fuori dal repository, regole d50) | eseguiti, esiti in M2–M5 |
| `./scripts/build.ps1 -Task Test -Offline` | verde: server 740 test, 0 falliti, 10 saltati; client-debug verde (uscita 0) |

## I cinque rilievi più importanti

1. **M1/G1** — il gettone va via a fine gruppo di velocità: chi è veloce paga un turno «cieco», chi è lento due turni pieni.
2. **K1** — proposta 2b e motore in disaccordo sulla carta mostrata dopo lo scarto: da decidere prima di approvare la proposta.
3. **G2** — la ricerca fallita costa meno di quella riuscita: il caricamento resta un buon «tutore di risorse».
4. **B1** — i bot non leggono gettone e carte scoperte: senza, il giro della 2b non misura la conseguenza.
5. **M2** — «Ultimo colpo» non paga «sotto zero» come scrive D50: latente, da decidere prima che nasca una carta che lo usa.

## Aree non coperte

- **Partita dal vivo** su `dev.ps1 -Bozza` e client web, e la leggibilità su telefono: non fatte. Area 4 è solo lettura del codice.
- **Contesto Spring completo** (`TestServerContext`): non eseguito; il rosso noto R3 non è stato riguardato.
- **Carte Java della bozza** (YouStop, AmphetamineReflexes, ToxicBloodDrain, GoingBerserk, LavoroFattoBene…): non lette una per
  una contro le regole d50; in particolare non ho verificato se qualcuna cambia una risorsa senza passare dal pavimento a zero.
- **Runner `-Dsim.rules=d50`** e banco SB-7: nessuna partita o seme riprodotto; nessuna misura nuova.
- **FFA** con le regole d50: solo lettura del codice.
- **Client debug** e copie delle regole: solo `check-rules.py`.
- **Proposta 2b**: lette le regole comuni e i testi dei caricamenti, non i numeri delle dieci coppie né il conto delle 120 carte.
