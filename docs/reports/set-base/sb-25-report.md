# SB-25 — Testi delle carte per i giocatori

## Verbi dei danni (D173)

Esecutore, 23 novembre 2026, sul commit di base `4a6395e`. Passo diretto ([D173](../../set-base-decisioni.md#decisioni-del-proprietario)),
prompt della regia. Evidenze: `ingombro-stampa.json` e `ingombro-client.json` in [sb-25/](sb-25/), rigenerate; pagina
[revisione-b.html](../../design/set-base/sb-25/revisione-b.html) rigenerata.

### Esito

**Consegnato, nessuno STOP sul testo; due domande per la regia (sotto).** In ogni testo che vede il giocatore una quantità di danno ha
davanti «infliggi» o «subisci». I testi completi cambiano solo per il verbo; nessun numero, costo, priorità, bersaglio o regola cambia.

**Conteggio prima e dopo, con lo stesso criterio.** Una quantità di danno è un numero o una frazione davanti al simbolo di un tipo di
danno, oppure il simbolo seguito da «pari a»; ha il verbo se «infliggi/infligge», «subisci/subisce» o il condizionale sta nella stessa
frase; un elenco come «subisci metà dei `[[HIT]]` e tre quarti dei `[[CUT]]`» ha il verbo una volta, in testa.

| | prima | dopo |
|---|---|---|
| testi brevi con un danno senza verbo | 46 su 125 | 0 |
| frasi dei testi completi | 46 | 0 |
| stati (nome e descrizione) e token | 0 | 0 |

La regia aveva contato 40 brevi: con questo criterio sono 46, perché entrano anche i «`[[HIT]]` all'avversario pari a …» delle carte che
spendono una risorsa (Ultimo Giro, Alla Goccia, Rutto a Bruciapelo, Lavoro Fatto Bene, Lazo del Rider e simili) e le carte con un
autodanno prima del danno («Subisci 5 `[[HIT]]`. 10 `[[HIT]]` …»). Le 46 frasi dei completi sono tutte la stessa: la nota «Danni fissi,
quelli che «Buon Vecchio Ricatto» rimanda: …». Gli stati dicevano già «subisce» / «infligge» e il token «ne infliggi una volta e mezza»:
niente da cambiare.

### Cosa cambia

- **`docs/design/set-base/testi/testi_stampati.py`, testo breve:** le carte a dati dicono «infliggi 10 `[[HIT]]` all'avversario» e
  «infliggi `[[HIT]]` all'avversario pari a …», anche dentro «Gioca d'anticipo:» e «Se l'avversario è Vulnerabile:»; le carte Java
  (Trascinare nel Tunnel, Ultimo Giro, Alla Goccia, Rutto a Bruciapelo, Lavoro Fatto Bene, PERMESSO SCUSA PUOI SMETTERLA) aprono la frase
  col verbo.
- **Testo completo:** la nota dei danni fissi diventa «…rimanda: infliggi 2 `[[HIT]]`.» (con due tipi, «infliggi 2 `[[HIT]]` e 3
  `[[CUT]]`»). Il resto è identico, verificato paragrafo per paragrafo (46 paragrafi cambiati, un verbo ciascuno).
- **Regola di forma nel controllo:** `gergo()` respinge una quantità di danno senza verbo nella stessa frase («danno senza verbo»), nel
  breve e nel completo, così le meccaniche future non la perdono. `controlla-testi.py` e `genera-testi.py` non cambiano.
- **File scritti da `genera-testi.py --scrivi`:** `bozza.json` (46 `gui.description`, nient'altro: confrontato campo per campo con la
  versione di partenza, il resto della bozza è identico) e `testi-completi.json` (46 brevi, 46 paragrafi).
- **Evidenze e pagina:** `ingombro-stampa.json`, `ingombro-client.json`, `revisione-b.html` rigenerati. `simboli.json` non cambia: i
  simboli non dipendono dai testi, quindi non è rigenerato. `frasi.py` e il glossario non cambiano: la regola di forma è nel generatore.
- **Fuori dall'elenco del perimetro, conseguenze meccaniche di D173 (domanda 1):** `SetBaseDraftTest.java`, quattro attesi di testo
  breve (Alla Goccia, Ultimo Giro, Scompenso da Ultimo Giro, Estasi da Cocaetilene) ora col verbo, con «D173» nel messaggio; e
  `docs/design/set-base/bozza-di-riferimento.md`, il documento generato dalla bozza, riscritto da `genera-bozza-di-riferimento.py
  --scrivi` (174 righe, tutte per il verbo, più l'impronta; `--verifica` torna allineato).

Esempi: «Subisci 5 `[[HIT]]`. 10 `[[HIT]]` all'avversario. Rincara 5 (2 a te).» diventa «Subisci 5 `[[HIT]]`. Infliggi 10 `[[HIT]]`
all'avversario. Rincara 5 (2 a te).»; «5 `[[A]]`: 10 `[[POISON]]` all'avversario.» diventa «5 `[[A]]`: infliggi 10 `[[POISON]]`
all'avversario.»; «Gioca d'anticipo: 5 `[[CUT]]` all'avversario» diventa «Gioca d'anticipo: infliggi 5 `[[CUT]]` all'avversario».

**Impronta di `server/src/test/resources/set-base/bozza.json`:**
`a8930edeb822028918d8fcd4c78fce2e4ffda007b2edca883ff48528290b527d` (era `ea5f77b6b36a88298ad2756b14e40ba8e40afcb14b9dd468ee572ba42a2047ac`):
cambiano solo i testi brevi.

### Scelte prese

1. **Il verbo sta nella frase del danno, non in quella di contorno.** Dopo un costo il testo resta in minuscola («10 `[[V]]`: infliggi 20
   `[[HIT]]` all'avversario»). Nel completo il verbo della nota dei danni fissi è «infliggi», come per chi gioca la carta (il lettore è
   chi la gioca; «Buon Vecchio Ricatto» rimanda una frazione di quei danni).
2. **«Rincara 4 (2 a te)» e «crescono di 4» non cambiano.** Non sono danni con un simbolo ma l'aumento per giocata, definito dalla parola
   chiave nelle regole del playground. Se il proprietario vuole il verbo anche lì, è una frase nuova da scrivere (domanda 2).
3. **Una regola nel controllo, non solo nel generatore.** È il modo perché la forma resti valida per le meccaniche future (D173 (1)).

### Verifiche

| Verifica | Esito |
|---|---|
| `controlla-numeri.py` | nessuna violazione (0) |
| `testi/controlla-testi.py` | 117 carte e 44 stati, 125 testi completi coincidono, nessun gergo (con la regola nuova) |
| `controlla-nomi.py` | 125 voci, 0 violazioni |
| `numeri-invariati.py` | verde: numeri, dati e regole identici; cambiano solo descrizioni e stati |
| `sb-25/prova-controlla-testi.py` | tutti i casi come attesi |
| `ingombro-stampa.py` | 124 fronti, 124 entrano col flavour; margine minimo 1,33 mm (Mara Contromano, un personaggio: invariato); i 46 fronti allungati (di 9 o 18 caratteri) hanno margine minimo 10,01 mm come prima |
| `ingombro-client.mjs` (jar non rifatto: la bozza si legge da file) | 117 carte; 1366×768 e 844×390: testo e testo più flavour entrano tutti nella vista dell'ispezione, margini minimi 444 e 155 px come prima, 0 errori di pagina |
| `tools/print-cards/test_generator.py` | 16 verdi (stampa un `UnicodeDecodeError` di un sottoprocesso: non verificato se preesistente) |
| `tools/print-cards/verify.py` | OK (40 voci, 40 fronti) |
| `./scripts/build.ps1 -Task Test -Offline` | 979 test, 0 rossi. Il primo giro aveva 2 rossi in `SetBaseDraftTest` (testo breve atteso senza verbo), il secondo un terzo, emerso dopo i primi due: aggiornati i quattro attesi con D173, poi verde |
| `check-rules.py` | verde (regolamento 1.14, 39 carte, SQLite integro) |
| `check-links.py` | 465 file, 8 link rotti, tutti nelle cartelle Carriera (noti) |
| `genera-bozza-di-riferimento.py --verifica` | allineato (dopo `--scrivi`) |

### Non verificato

L'aspetto della carta stampata e dell'ispezione non è guardato carta per carta: le prove misurano l'ingombro. Il PDF vivo in
`output/pdf/` non è rigenerato (SB-28).

### Domande per la regia

1. `SetBaseDraftTest.java` (quattro attesi) e `bozza-di-riferimento.md` sono fuori dall'elenco del perimetro ma si rompono per D173 (test
   rosso, documento generato indietro): li ho aggiornati con i loro mezzi e citando D173. Se preferisci altrimenti, i due file si
   riportano alla base con `git checkout 4a6395e -- <file>`.
2. «Rincara N» (e «crescono di N» nel completo) dice un aumento di danno senza simbolo e senza verbo: lo lascio com'è (scelta 2). Vuoi
   che anche lì ci sia il verbo?

## Simbolo del veleno (D172)

Esecutore, 22 novembre 2026, sul commit di base `4def5bf`. Passo diretto ([D172](../../set-base-decisioni.md#decisioni-del-proprietario)),
prompt della regia. Evidenze in [sb-25/](sb-25/) (file `d172-*`). La [proposta A](../../design/set-base/sb-25/veleno-proposta.html)
è il disegno di partenza.

### Esito

**Consegnato, con due rossi dello strumento da leggere (sotto: uno noto, R2; uno nuovo, rosso anche sulla base); STOP per la revisione della regia.** Il danno POISON è ora un teschio verde scuro
(`#5f8a1f`) davanti a un matraccio verde chiaro (`#b4e06a`) bordato di verde scuro, in tutti i punti in cui compare: testi delle carte
(`EffectText`), distintivo del danno (`DamageMark`), guida dei simboli, impatto sul tavolo, stampa viva e stampa della bozza. I due colori
non sono cambiati; la goccia resta solo alla tossicità; gli altri 14 simboli sono come prima. Nessun numero e nessun testo della bozza è
stato toccato.

**Impronta di `server/src/test/resources/set-base/bozza.json`:** `ea5f77b6b36a88298ad2756b14e40ba8e40afcb14b9dd468ee572ba42a2047ac`, uguale a quella della B2 (ricalcolata prima del commit).

### Cosa cambia

- **`client-web/src/symbols.ts`:** POISON non è più un poligono unico ma ha le sue righe di strati, come ALERTNESS e ITEMS: matraccio
  (un solo poligono, riempimento accent, bordo main), teschio (cerchio e rettangolo arrotondato, main), occhi, naso e denti (strato
  `light`, il colore della carta). Una opzione nuova di `Colors`, `flat`, disegna tutti gli strati nel colore principale: serve alla
  sagoma scura dietro l'impatto, che altrimenti mostrerebbe gli occhi chiari.
- **`client-web/src/readability.ts`:** POISON esce da `DAMAGE_SHAPES` e `DAMAGE_ACCENT_SHAPES`; i due record sono ora di tipo
  `Record<PolygonDamage, …>` (`PolygonDamage` = i danni che restano poligoni, HIT e CUT). Le costanti dei colori non cambiano.
- **`client-web/src/scene.ts`:** la sagoma dietro l'impatto del veleno usa `drawSymbol` con `flat`; il simbolo colorato e le bolle sono
  quelli di prima. `ui.tsx` non cambia: `DamageMark` ed `EffectText` leggono già `SYMBOL_LAYERS`.
- **`tools/print-cards/symbols_pdf.py`:** stesso disegno, stessi numeri, nel porto per reportlab (`LAYERS['POISON']`).
- **`client-web/README.md`:** tre menzioni della «goccia» del veleno diventano «teschio davanti a un matraccio (D172)».
- **`docs/design/set-base/sb-25/simboli.json` e `revisione-b.html`:** rigenerati dai generatori esistenti (non toccati); la pagina di
  revisione mostra il simbolo nuovo.
- **`docs/set-base-plan.md`:** Ripartenza («In attesa»), riga e sezione di SB-25.

**Attesi dei test cambiati, tutti per D172:** `symbols.test.ts` (il ciclo dei poligoni è su HIT e CUT; un test nuovo fissa ordine e toni
degli strati, il matraccio come un solo poligono, i riempimenti e il bordo in SVG, assenza di `edgeFor`, l'opzione `flat` e l'ordine dei
riempimenti con e senza accent); `impact.test.ts` («tre forme diverse» sono ora le chiavi HIT e CUT, dimensione 2); `contrast.test.ts` (il
testo dell'eccezione «damage POISON (accent) on the pill»: l'accent è il matraccio dietro il teschio, decorativo); `test_generator.py`
(POISON entra nel confronto degli strati letterali con `symbols.ts`; l'asserzione sul vecchio poligono di `readability.ts` è tolta).
Nessuna soglia, nessun limite e nessuna regola 1–18 sono cambiati.

### Scelte prese

1. **Strati espliciti, non un poligono.** Un teschio con occhi, naso e denti e un matraccio col bordo non stanno in un poligono pieno.
   Gli strati con toni e bordo esistono già e i tre disegnatori (Pixi, SVG, reportlab) li leggono; l'unico codice di disegno nuovo è `flat`.
2. **Il matraccio è un po' più piccolo e più basso della proposta** (scala .78 in (.30, −.12), non .8 in (.34, −.22)) **e ha il bordo più
   sottile** (.05, non .09). Scelto guardando 12, 15, 28 e 64 px sulla carta chiara e sul tavolo scuro: il teschio resta la figura e il
   matraccio si legge come forma anche a 12 px. Il disegno resta nel quadrato −1..1.
3. **Matraccio in un solo poligono** (labbro, collo e corpo in un solo contorno): niente cuciture di bordo alle piccole dimensioni.
4. **Nessun contorno scuro** (`edgeFor` non cambia): il teschio verde scuro sulla carta chiara e sul tavolo scuro ha già abbastanza
   contrasto; la sagoma scura c'è solo nell'impatto, come per HIT e CUT.
5. **Il PDF vivo in `output/pdf/` non è rigenerato** (lo fa SB-28, come dice D172 (2)); la bozza è stata generata in una cartella
   temporanea e guardata.

### Verifiche

| Verifica | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` | 369 verdi, 0 rossi (nel giro di `VerifyAll` e rifatto alla fine, dopo le ultime modifiche ai testi) |
| `-Task Build` | verde (7 s), `tsc` pulito |
| `-Task Size` | verde, `limitsPass` e `ceilingsPass` veri; limiti invariati (JS gzip 354 729 byte; texture all'82,6 %) |
| `VerifyDecks` 1366×768 e 844×390 | verdi |
| `VerifyResolution` 844×390 | verde |
| `VerifyResolution` 1366×768 | **rosso nel giro completo, 2 giri su 2; rosso anche sulla base**: vedi «Rossi» |
| `VerifyLayout` 1366×768, 844×390, 1920×1080 | rossi **solo di cadenza**, uguali sulla base: **noto, voce R2** (vedi «Rossi») |
| `python -X utf8 tools/print-cards/test_generator.py` | verde (16 test) |
| `python tools/print-cards/verify.py` | verde |
| `generate.py --bozza --output <temp>` | PDF di 39 pagine; guardate le pagine 2, 6 e 15 |
| `git diff --check` | pulito (solo gli avvisi sui fine riga dei file con CRLF) |
| `python -X utf8 scripts/check-links.py` | solo gli 8 collegamenti rotti già noti nelle cartelle Carriera; i 3 verso questa sezione, scritti nel piano, ora esistono |

**Rifatta qui, stesso esito di prima:** la prova d'ingombro nell'ispezione del client (`ingombro-client.mjs`, 117 carte), a 1366×768 e
844×390: **nessun testo fuori vista, nessun errore**. Il simbolo nuovo è un'icona in linea alta quanto il testo: l'ingombro non cambia.

### Rossi

**`VerifyLayout`, tre misure: solo cadenza, nessuna geometria — noto, voce R2.** Le uniche righe `PROBLEM` sono «frames within 20 ms» (a
844×390: «within 33 ms») e, a 1920×1080, un «input» di 109–148 ms; nessun problema di riquadri, testi o simboli. Rilanciata da sola, a
macchina ferma: rossa a 1366×768 e a 1920×1080 tutte le volte. **Sulla base** (un worktree del commit `4def5bf`, stesso jar, stessa
macchina, build mia) **rossa con la stessa firma** a 1366×768 (frame entro 20 ms 0,89–0,92 sulla base, 0,86–0,91 col blocco) e a
1920×1080 (0,75–0,88, input 128 ms). A 844×390 è intermittente su entrambe: base 1 rosso su 4 giri, blocco 3 su 5. Il blocco aggiunge
poche primitive a un simbolo e non cambia la scena: non vedo un nesso, e le differenze stanno nel rumore della macchina.

**`VerifyResolution` 1366×768, giro completo: `TimeoutError` dello strumento, rosso anche sulla base — nuovo, non attribuibile al blocco.**
Due giri completi col blocco, due rossi, entrambi nello scenario `humans` (FFA con due umani), dopo 40 e 30 minuti: `locator.click`
(giro 1) e `locator.isEnabled` (giro 2) su `getByTestId('confirm')` scadono a 30 s (`verify-resolution.mjs:126` e `:125`, in
`playOne`). Il pulsante ✓ non compare più o non c'è ancora quando lo strumento lo cerca (ipotesi: il turno si è chiuso per il tempo; non
l'ho misurato). Nello stesso giro del blocco 844×390 è verde. **Sulla base** (stesso worktree di `4def5bf`, stesso jar) il giro completo a
1366×768 è rosso con lo stesso tipo di errore in un altro punto: `TimeoutError` su `getByRole('button', {name: 'Torna all’hub'})` in
`toHub` (`verify-resolution.mjs:103`, chiamato alla riga 735, prima di `humans`). Lo scenario `humans` da solo è verde 6 volte su 6
(3 col blocco, 3 sulla base). Non è nel [registro dei rossi noti](../rossi-noti.md): non ho una firma uguale da citare, quindi non lo
dichiaro noto. Il giro 2 col blocco era in corso mentre lanciavo `test_generator.py` (137 s di CPU): non l’ho rifatto a macchina
ferma, perché il primo giro era già rosso senza altro in corso e la base lo è comunque. Nel percorso del clic non c'è nulla del simbolo.

### Non verificato

- L'impatto del veleno **non è fotografato nel gioco vero**: [d172-impatto-sul-tavolo](sb-25/d172-impatto-sul-tavolo.jpg) viene da una
  pagina di prova che chiama `drawSymbol` con le stesse righe di `Scene.impactMark` (Pixi), non dalla scena. Le prove vive della scena
  (`VerifyResolution`, `VerifyLayout`) non guardano il simbolo.
- Il PDF vivo non è rigenerato (SB-28). La prova d'ingombro stampata (`ingombro-stampa.py`) non è stata rifatta: il simbolo è
  un'icona in linea e il testo è lo stesso.
- Nessuna prova su un telefono vero.

### Cosa giudica il proprietario

La [pagina di revisione](../../design/set-base/sb-25/revisione-b.html) (ogni testo col simbolo nuovo) e le immagini in [sb-25/](sb-25/):
[ispezione a 1366×768](sb-25/d172-client-1366x768-ispezione-veleno.jpg), [ispezione a 844×390](sb-25/d172-client-844x390-ispezione-veleno.jpg),
[impatto](sb-25/d172-impatto-sul-tavolo.jpg), [carte stampate](sb-25/d172-stampa-p06-carte-veleno.jpg), [guida dei danni](sb-25/d172-stampa-p15-guida-danni.jpg).
In particolare: se il teschio si legge a 12–15 px accanto alla goccia della tossicità, e se il matraccio, così piccolo, è abbastanza chiaro.

### Domande per la regia

1. Il rosso di `VerifyResolution` a 1366×768 (giro completo) c'è anche sulla base, con `TimeoutError` in punti diversi. Apro una voce
   R7 «`VerifyResolution` 1366×768, giro completo: `TimeoutError` su ✓ o su «Torna all'hub»», o lo lasciamo scritto solo qui?
2. La cadenza di `VerifyLayout` è rossa anche sulla base, su questa macchina, a macchina ferma; R2 dice che a macchina ferma torna
   verde. Va aggiornata la voce?

### File

Modificati: `client-web/src/{readability,scene,symbols}.ts`, `client-web/tests/{contrast,impact,symbols}.test.ts`, `client-web/README.md`,
`tools/print-cards/{symbols_pdf.py,test_generator.py}`, `docs/design/set-base/sb-25/{simboli.json,revisione-b.html}`,
`docs/set-base-plan.md`, questo rapporto. Nuovi: `docs/reports/set-base/sb-25/d172-*.jpg` (5 immagini, circa 380 KB in tutto).

## Fase B2 — Simboli dei danni nel client e nel PDF, guida stampata, prova d'ingombro, pagina con tutti i testi

Esecutore, 22 novembre 2026, sul commit di base `a94c713`. Passo diretto ([D170](../../set-base-decisioni.md#decisioni-del-proprietario),
[D171](../../set-base-decisioni.md#decisioni-del-proprietario)), prompt della regia. Evidenze in [sb-25/](sb-25/) (file `b2-*` e `ingombro-*`).

### Esito

**Consegnata, tutto verde; STOP per il proprietario.** Il client disegna `[[HIT]]`, `[[CUT]]`, `[[POISON]]` nei testi delle carte con
il simbolo di `DamageMark`; il PDF della bozza accetta la rarità P, disegna i simboli dei danni e stampa il flavour, ha la guida con le
regole complete delle parole chiave e un libretto con il testo completo delle 125 voci. La prova d'ingombro (testo breve più flavour) è
fatta sulla carta stampata e sull'ispezione del client a 1366×768 e 844×390: **entra tutto, nessun taglio di testo applicato, nessun
taglio di flavour proposto**. `controlla-nomi.py` rivede 125 voci. La regola di Mescolone è scritta (RP-29, regole del playground 1.7) e
fissata da un test. La pagina con tutti i testi è pronta per il proprietario.

**Impronta finale** di `server/src/test/resources/set-base/bozza.json`: SHA-256
`ea5f77b6b36a88298ad2756b14e40ba8e40afcb14b9dd468ee572ba42a2047ac` (byte del repository, LF), **uguale a quella della B1**: la B2 non
ha toccato la bozza, perché nessun testo andava tagliato.

### Stato per tappe

1. Preliminari: base di print-cards rossa come detto nella B1 (6 fallimenti e 1 errore di `test_generator.py`, rarità `PROTAGONIST`
   rifiutata), `verify.py` verde sul PDF vivo. Fatto; i rossi sono chiusi (sotto).
2. Client, `EffectText`. Fatto.
3. print-cards: rarità P, simboli dei danni, flavour, guida, testi completi. Fatto.
4. Prova d'ingombro con flavour, stampa e client. Fatto: nessun taglio.
5. `controlla-nomi.py` a 125 voci. Fatto.
6. Mescolone: regola scritta e test. Fatto: il motore lo fa già, nessuno STOP.
7. Pagina di revisione. Fatto, provata in Edge.
8. Prove, mutazioni, verifiche, report, piano, commit. Fatto.

### Cosa cambia

1. **Client** ([symbols.ts](../../../client-web/src/symbols.ts), [ui.tsx](../../../client-web/src/ui.tsx)). La lettura dei segnaposto
   esce da `EffectText` e diventa una funzione pura, `textParts`, con la tabella `TEXT_SYMBOLS` (cinque risorse e tre danni) e
   `isDamage`: stessa espressione di prima, numero e punteggiatura vicina restano attaccati al simbolo. `EffectText` disegna i danni con
   `DamageMark` (il simbolo del danno nominale e dei report) e le risorse con `SymbolMark` come prima; nome per i lettori di schermo
   da `DAMAGE_NAMES` (colpo, taglio, veleno). Un segnaposto sconosciuto resta testo. Nessun CSS nuovo. Le carte vive non hanno segnaposto
   di danno e si disegnano come prima (test sui testi vivi). Test nuovo in [symbols.test.ts](../../../client-web/tests/symbols.test.ts).
2. **print-cards, fronti** ([bozza.py](../../../tools/print-cards/bozza.py)). Rarità `PROTAGONIST` = «PROTAGONISTA (P)», senza pallini;
   una rarità sconosciuta resta un errore. `[[HIT]]`, `[[CUT]]`, `[[POISON]]` disegnati con le forme di `symbols_pdf.py` (`DAMAGES`). Il
   flavour è stampato sotto il testo, in corsivo a 7,5 pt (D166 (2)); un fronte che non entra col flavour è rifiutato e il messaggio dice
   quanto resterebbe senza. Per far entrare i personaggi col flavour le righe del fronte sono accorciate: «Capacità oggetti: 1 · Immune a
   [[T]]» (o «Nessuna immunità») su una riga, «Legate (2 a scelta): …». Il danno nominale stampa simbolo e quantità, senza ripetere il
   tipo in lettere.
3. **print-cards, guida.** Nuova sezione «Parole chiave»: metà e quarti (arrotondamento per difetto, detto una volta, D169 (1)), mai sotto
   zero, chi si muove prima, Gioca d’anticipo, Rincara, Annuncia, Vulnerabile (con Mescolone, D171 (1)), stati e durate, equipaggiamento,
   Immune, fine turno, corazza dell’alcol; ogni voce cita la sua fonte (regolamento o regole del playground). La legenda dei danni dice il
   nome italiano; «Lettura della carta» spiega la P e il flavour.
4. **print-cards, testi completi.** Dopo la guida, nello stesso PDF, il libretto «Testi completi» (D170 (4)) generato da
   `testi/testi-completi.json`: catalogo 125 voci (7 personaggi, 117 carte, il token) in 21 pagine; un mazzo stampa le sue voci più il
   token. Intestazione «nome · slot · tipo», paragrafi del testo completo coi simboli. Il manifest riporta `guide_pages`,
   `full_text_pages`, `full_text_entries`. Catalogo: 14 fogli di carte, 4 pagine di guida, 21 di testi completi, 39 pagine.
5. **print-cards, test** ([test_generator.py](../../../tools/print-cards/test_generator.py)): conteggi a 124 fronti, rarità P accettata e
   rarità sconosciuta rifiutata, flavour stampato e flavour troppo lungo rifiutato, segnaposto dei danni, pagine della guida e del libretto,
   ogni voce «nome · slot» presente. README aggiornato (sezione della bozza e rasterizzazione senza Poppler).
6. **controlla-nomi.py** ([D171](../../set-base-decisioni.md#decisioni-del-proprietario) (4)): etichette dallo slot di `slot.json`, token
   cercato per binding (costanti di `testi_stampati.py`); in più due controlli nuovi: una voce senza slot (N0) e numero di voci diverso dal
   numero di slot (N0), così il token perso non passa più in silenzio. Esce con 125 voci, 0 violazioni.
7. **Regole del playground 1.7** ([regole-playground.md](../../design/set-base/regole-playground.md)): nuova **RP-29**, il timer di
   «Mescolone Micidiale» toglie anche i gettoni di vulnerabilità, prima dei suoi 20 POISON. Nessun comportamento cambia.
   [MescoloneD171Test](../../../server/src/test/java/com/gsc/bm/sim/MescoloneD171Test.java) gioca sette turni con l'oggetto vero della
   bozza: Vulnerabile al primo turno, consumo al secondo, al sesto (il quinto contando il consumo) il taglio è ancora ×1,5 e poi spariscono
   immunità, stati e i tre gettoni, e il POISON del timer non è moltiplicato (35 in tutto, non 45); al settimo il taglio torna 10. Nessun
   test fissava la versione delle regole del playground (i «1.6» dei test di fedeltà sono etichette di bozza).
8. **Prova d'ingombro** ([ingombro-stampa.py](sb-25/ingombro-stampa.py), [ingombro-client.mjs](sb-25/ingombro-client.mjs)), sotto.
9. **Pagina di revisione** ([revisione-b.html](../../design/set-base/sb-25/revisione-b.html), generatore
   [genera-revisione-b.py](../../design/set-base/sb-25/genera-revisione-b.py), file del proprietario
   [revisione-b-proprietario.json](../../design/set-base/sb-25/revisione-b-proprietario.json)), sotto.
10. Riga proposta in [aree-protette.md](../../aree-protette.md#playground-e-misure) per `tools/print-cards/`: `test_generator.py`,
    `verify.py`, il PDF della bozza generato in un file temporaneo e guardato; il PDF vivo committato non deve cambiare.

### Prova d'ingombro

**Carta stampata** ([ingombro-stampa.json](sb-25/ingombro-stampa.json)). Ogni fronte disposto come lo stampa `--bozza` (62 × 87 mm,
testo 9 pt, flavour corsivo 7,5 pt): **124 fronti su 124 entrano col flavour**. I più stretti: Mara Contromano 1,33 mm (13,09 senza
flavour), Celestina Bucatina 2,01 mm, «PAZIENZA: FINITA» 3,92 mm. Il token non è un fronte stampato.

**Client** ([ingombro-client.json](sb-25/ingombro-client.json)). Jar col profilo `local,bozza` su un database temporaneo, client costruito
con il nuovo `EffectText`, Edge con Playwright; una partita rapida, l'ispezione aperta su una carta in mano e poi ognuna delle 117 carte
del catalogo mostrata nella stessa finestra. Il flavour (che il client mostrerà in SB-31) è aggiunto solo per misurare, come paragrafo in
corsivo sotto il testo, e tolto subito dopo. Criterio: testo, e testo più flavour, si leggono in una sola vista della finestra
d'ispezione (altezza interna massima, cioè `max-height` meno bordi e padding), senza essere spezzati dallo scorrimento. «Non scorre» non è
il criterio: a 844×390 l'ispezione scorre già oggi per 107 carte su 117 (costi, priorità, danno, ruolo e bersaglio stanno sopra il testo).

| Misura | Vista interna | Scorre oggi | Testo fuori vista | Testo + flavour fuori vista | Margine minimo |
|---|---|---|---|---|---|
| 1366×768 | 641 px | 0 | 0 | 0 | 444 px («PAZIENZA: FINITA») |
| 844×390 | 332 px | 107 | 0 | 0 | 155 px («PAZIENZA: FINITA») |

Nessun `[[` rimasto nel testo, 78 simboli di danno disegnati per misura, 0 errori di pagina. Catture (col flavour di prova):
[1366×768, «PAZIENZA: FINITA»](sb-25/b2-client-1366x768-Glare.jpg), [844×390, «Trascinare nel Tunnel»](sb-25/b2-client-844x390-ToxicBloodDrain.jpg).
Stampa, pagine guardate (rasterizzate con PyMuPDF, Poppler assente): [personaggi](sb-25/b2-stampa-p01-personaggi.jpg),
[carte coi simboli dei danni](sb-25/b2-stampa-p02-carte.jpg), [guida, parole chiave](sb-25/b2-stampa-p16-guida-parole-chiave.jpg),
[testi completi](sb-25/b2-stampa-p19-testi-completi.jpg).

**Esito: nessun taglio.** `genera-testi.py --scrivi` non è stato lanciato, `gui.description` e le descrizioni degli stati non cambiano;
nessun taglio di flavour da proporre (la pagina di revisione ha il posto per mostrarlo, vuoto).

### Pagina di revisione

[revisione-b.html](../../design/set-base/sb-25/revisione-b.html): un solo file, niente rete, si apre da file://. 169 voci: 7 personaggi,
117 carte, il token e i 44 stati. Per ogni voce: nome, slot, testo breve coi simboli disegnati come nel client (SVG di
`sb-25/simboli.json`, numero e punteggiatura attaccati al simbolo come in `EffectText`), lunghezza, flavour, testo completo (a scomparsa),
prova d'ingombro della voce; per gli stati nome, carta e descrizione. Riquadro per correggere il testo breve, il flavour o la descrizione
(con anteprima dei simboli), nota, «Ok» / «Da rivedere», «↺ Proposta». Filtri per sezione, segno (anche «Corrette da me», «Con nota»),
ricerca e rate da 20; contatore «Segnate n/169». «Salva» scrive `revisione-b-proprietario.json` (Chrome ed Edge; la pagina ricorda il
file), altrove «Esporta»; dopo ogni salvataggio o esportazione il promemoria con `git add`, `git commit`, `git push` di quel file e i
tasti «Copia». Le modifiche non salvate restano nel browser e si ritrovano alla riapertura. Rigenerarla incorpora il file del proprietario.

**Provata così.** (a) Nel pannello browser dell'app: 169 voci, 943 simboli disegnati, nessun segnaposto rimasto, correzione con anteprima,
segno, nota, filtro «Corrette da me», contatore; anche a 375 px di larghezza, senza scorrimento orizzontale. (b) In Edge con Playwright da
`file://`: «Esporta» scarica `revisione-b-proprietario.json` col formato `sb-25-revisione-b-proprietario/1` e le voci toccate; il
promemoria compare coi tre comandi; «Salva» con un selettore di file simulato (quello vero chiede il file all'utente) scrive lo stesso
formato e la pagina mostra il file collegato; dopo una ricarica con una modifica non salvata la pagina la ritrova; «Apri» da un browser
senza selettore carica il file e tiene la modifica più recente. 0 errori di pagina. Il «Salva» vero col selettore di Windows non è
provabile da qui: lo prova il proprietario al primo uso.

### Scelte prese

- Flavour sul volto in corsivo a 7,5 pt, sotto il testo e separato da 1,6 mm: entra in tutti i fronti senza tagli.
- Righe del fronte dei personaggi accorciate (immunità sulla riga della capacità, «Legate (2 a scelta)») invece di accorciare il flavour:
  Celestina Bucatina e Mara Contromano non entravano col flavour.
- Danno nominale stampato come simbolo e quantità, senza il tipo in lettere (il simbolo lo dice già; la guida lo spiega).
- Testi completi come libretto a parte nello stesso PDF, dopo la guida: la guida resta corta da tenere sul tavolo.
- Prova del client sull'ispezione vera, con un paragrafo di flavour aggiunto e tolto: il client non mostra ancora il flavour (SB-31). Il
  criterio è «in una vista», non «senza scorrimento» (sopra).
- Rasterizzazione delle pagine con PyMuPDF, già installato nel Python dell'utente; nessun pacchetto nuovo.
- `controlla-nomi.py`: aggiunti i due controlli N0, perché la mutazione «token non contato» sopravviveva (usciva 0 con 124 voci).
- Segnalini degli stati e token nel client: lasciati fuori (domande 1 e 2).

### Mutazioni

Ognuna applicata, verifica lanciata, file ripristinato (impronte controllate dopo):

| Mutazione | Verifica | Esito |
|---|---|---|
| `[[HIT]]` tolto da `TEXT_SYMBOLS` | test del client | uccisa |
| `isDamage` sempre falso | test del client | uccisa |
| `EffectText` senza `DamageMark` | test del client | uccisa |
| rarità `PROTAGONIST` tolta | `test_generator.py` | uccisa (7 fallimenti, 2 errori) |
| segnaposto dei danni non riconosciuti in stampa | `test_generator.py` | uccisa |
| libretto dei testi completi senza token | `test_generator.py` | uccisa |
| token non contato in `controlla-nomi.py` | `controlla-nomi.py` | viva al primo giro, uccisa dopo il controllo N0 |

`MescoloneD171Test` fissa ciò che il motore fa già; una mutazione del motore (`server/src/main`) è fuori perimetro e non è stata fatta.

### Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check` | pulito |
| `python scripts/check-links.py` | 8 link rotti, tutti in `docs/design/carriere/` (altro filone, gli stessi della base); nessuno nuovo |
| `python scripts/check-rules.py` | verde |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: 979 test (978 della B1 più `MescoloneD171Test`), 0 falliti o in errore, 23 saltati |
| `./client-web/run.ps1 -Task Test` | verde: 368 test, 0 falliti |
| `./client-web/run.ps1 -Task Build` | verde (`tsc --noEmit` e `vite build`; il solito avviso di vite sul pezzo oltre 500 kB) |
| `./client-web/run.ps1 -Task Size` (con `BM_OUT`) | verde: JS 354.567 B gzip, totale 1.764.768 B gzip, texture 82,6% del tetto C4; limiti e tetti rispettati; `BASE_750` non toccato |
| `./scripts/build.ps1 -Task Server -Offline`, poi `-Task VerifyDecks` a 1366×768 e 844×390 | jar rifatto (BUILD SUCCESS); `VerifyDecks` verde a 1366×768 e 844×390, con `Serve` attivo (al primo giro senza `Serve` falliva la connessione a 4320) |
| `python tools/print-cards/test_generator.py` | OK, 16 test (prima: 6 fallimenti e 1 errore) |
| `python tools/print-cards/verify.py` | OK: 40 voci, 40 fronti sul PDF vivo committato (non rigenerato) |
| PDF della bozza (`generate.py --bozza`, in una cartella temporanea) | 124 fronti, 14 fogli, 4 pagine di guida, 21 di testi completi; pagine 1, 2, 16, 19 guardate (catture sopra) |
| `controlla-numeri.py` | 0: 117 carte, 7 personaggi, nessuna violazione |
| `testi/controlla-testi.py` | 0: 117 carte e 44 stati, 125 testi completi coincidono, nessun gergo |
| `controlla-nomi.py` | 0: 125 voci, 0 violazioni |
| [numeri-invariati.py](sb-25/numeri-invariati.py) contro `dce3733` | 0: numeri, mazzi, regole e versione 1.7 identici; cambiano solo le 117 descrizioni e i 44 stati della B1 |
| `genera-bozza-di-riferimento.py --verifica` | allineata (non rigenerata: la bozza non cambia) |
| `MescoloneD171Test` da solo | verde |

### Rossi

Nessun rosso nuovo. Chiusi i rossi preesistenti di print-cards (rarità P rifiutata, segnaposto dei danni) e `controlla-nomi.py` a 124
voci, aperti nella B1. Nei test d'integrazione vivi di `test_generator.py` compare un `UnicodeDecodeError` in un thread di lettura del
sottoprocesso (codifica della console Windows): rumore, l'esito resta OK; `generate.py` non è stato toccato.

### Osservazioni fuori perimetro

- Generare il PDF vivo con le opzioni predefinite riscrive `output/pdf/botte-micidiali-carte.{pdf,manifest.json}`, committati e vecchi
  (regolamento 1.13 contro 1.14). Successo una volta durante il lavoro: ripristinati con `git checkout --`, non nel commit.

### Domande per la regia

1. **Segnaposto negli stati del client.** I segnalini degli stati e la loro lista nell'ispezione del personaggio (`chipsOf` in
   `readability.ts`, `table.tsx`) mostrano la descrizione dello stato così com'è: con la B1 contiene `[[HIT]]` ecc., che si vedono
   letterali nel client della bozza (non nel vivo). Il perimetro della B2 è `EffectText`. Proposta: in SB-31 la lista dell'ispezione
   passa da `textParts` come `EffectText` e il segnalino sul tavolo usa i nomi (colpo, taglio, veleno); oppure subito, con un prompt piccolo.
2. **Token nel client.** Il testo del token «Bottiglia Spaccata» nel client è ancora quello inglese della classe Java (G35): resta per
   SB-31?
3. **Riga di `aree-protette.md`.** Proposta per `tools/print-cards/` (sopra): tenerla?
4. **PDF vivo committato e vecchio** (osservazione sopra): rigenerarlo in un blocco che ha `output/` nel perimetro?

### File

`client-web/src/{symbols.ts, ui.tsx}`, `client-web/tests/symbols.test.ts`, `tools/print-cards/{bozza.py, test_generator.py, README.md}`,
`docs/design/set-base/controlla-nomi.py`, `docs/design/set-base/regole-playground.md`,
`server/src/test/java/com/gsc/bm/sim/MescoloneD171Test.java`,
`docs/design/set-base/sb-25/{genera-revisione-b.py, revisione-b.html, revisione-b-proprietario.json}`,
`docs/reports/set-base/sb-25/{ingombro-stampa.py, ingombro-stampa.json, ingombro-client.mjs, ingombro-client.json, b2-*.jpg}`,
`docs/aree-protette.md`, questo report, `docs/set-base-plan.md`.

## Fase B1 — Testo breve, testo completo, stati, slot in un file a parte

Esecutore, 22 novembre 2026, sul commit di base `dce3733`. Passo diretto ([D170](../../set-base-decisioni.md#decisioni-del-proprietario)),
prompt della regia. Evidenze in [sb-25/](sb-25/).

### Esito

**Consegnata, verde nel perimetro; due rossi fuori perimetro da decidere (print-cards, sotto).** Il generatore scrive il testo breve
approvato (glossario e campione di D170) in `gui.description` delle 117 carte, senza codice di slot, e il testo completo di 117 carte,
7 personaggi e del token in un file generato; i 44 stati delle carte hanno nome italiano e descrizione con le frasi del glossario; il
controllo confronta tutto col generatore e respinge il gergo. Nessun numero della bozza cambia: lo provano `numeri-invariati.py`,
`controlla-numeri.py`, i test e la corsa d'identità sul banco.

**Impronta provvisoria** (non congelamento): `server/src/test/resources/set-base/bozza.json`, SHA-256
`ea5f77b6b36a88298ad2756b14e40ba8e40afcb14b9dd468ee572ba42a2047ac` (byte del repository, LF). La 1.7 di partenza era `65bc46cf…`.

### Stato per tappe

1. Preliminari: letti metodo, nota della Fase A nella cartella condivisa, generatore e lettori dello slot. Fatto.
2. Slot fuori dal testo: [slot.json](../../design/set-base/testi/slot.json), letto da generatore, controllo e `tools/print-cards/bozza.py`.
   Fatto.
3. Testo breve: le frasi di `frasi.py` portate in `testi_stampati.py`, `--scrivi` ha riscritto le 117 descrizioni. Fatto.
4. Testo completo: generato per carte, personaggi e token, riletto voce per voce contro il motore. Fatto.
5. Stati rinominati e descritti. Fatto.
6. Controllo con le regole del gergo e prova con un caso respinto per regola. Fatto.
7. Prove: numeri invariati, corsa d'identità, verifiche. Fatto (print-cards non eseguibile, sotto).
8. Report, piano, commit. Fatto.

### Cosa cambia

1. **Codice dello slot in un file a parte** ([D169](../../set-base-decisioni.md#decisioni-del-proprietario) (5)):
   [testi/slot.json](../../design/set-base/testi/slot.json), tenuto a mano, mappa binding → slot per le 125 voci (7 personaggi, 117 carte,
   il token). Estratto una volta dal prefisso delle descrizioni di `dce3733`; `numeri-invariati.py` prova che coincide con quel prefisso per
   ogni carta. Il server non cambia (`Draft.java` rifiuta campi `gui` sconosciuti, per questo lo slot non è un campo della bozza).
2. **Generatore** ([testi_stampati.py](../../design/set-base/testi/testi_stampati.py)): controllo di schema e campi nominali (`gains`,
   `damageAmount`) invariati; il testo breve è quello di `frasi.py` della Fase A con le correzioni di D169, portato senza cambiamenti; il
   testo completo è nuovo; nome e descrizione degli stati; le regole del gergo (`gergo`). I segnaposto ammessi diventano `[[H]]`, `[[A]]`,
   `[[V]]`, `[[T]]`, `[[L]]`, `[[HIT]]`, `[[CUT]]`, `[[POISON]]`.
3. **Testo breve** in `gui.description` delle 117 carte: identico, voce per voce, a quello di `frasi.py` su tutte le 125 voci e ai 13 testi
   del campione approvato nella [pagina di revisione](../../design/set-base/sb-25/revisione.html). **Nessuna differenza da elencare.**
4. **Testo completo** ([testi/testi-completi.json](../../design/set-base/testi/testi-completi.json), generato, circa 101.000 caratteri): per
   binding, slot, nome, tipo, testo breve e paragrafi del testo completo. Per ogni carta dice tipo e rimando al regolamento, costo (pagato
   prima di ogni effetto), priorità, bersaglio; per le legate lo scarto R02 all'inizio dell'effetto; gli effetti nell'ordine in cui si
   risolvono; quando si legge una risorsa (dopo i costi, dopo le mosse risolte prima e gli effetti precedenti della carta) e
   l'arrotondamento per difetto; il pavimento a 0 delle risorse; durate da quando a quando, veleno di fine turno compreso; cosa conta e cosa
   no (stati del lanciatore e del ricevente in ordine, corazza dell'alcol, oggetti e token contati, equipaggiamenti no); le condizioni
   (Gioca d'anticipo, Vulnerabile, Rincara, Annuncia) col loro rimando; i danni fissi che «Buon Vecchio Ricatto» rimanda. Niente formule:
   simboli come nel testo breve. Le note «sottili» di `campione.json` sono state la lista di controllo; ogni affermazione è stata riletta
   contro il codice del motore (`server/src/main`, solo lettura).
5. **Stati** (D169 (4)): i 44 oggetti stato delle carte hanno per nome il nome della carta (prima «MI TENGO AL BANCO - HIT», «MADE OF
   STONE», …) e per descrizione una frase del glossario in terza persona, letta sul segnalino da chiunque: «Chi lo ha subisce tre quarti
   dei [[HIT]] che subirebbe.», «I [[HIT]] di chi lo ha diventano [[CUT]] e ne infligge una volta e mezza. Dopo il primo uso dura solo
   fino a fine turno.». La durata la mostra il client dal dato. Gli stati di una stessa carta su più tipi di danno hanno lo stesso nome:
   il motore li confronta per identità, non per nome (nessun `equals` in `Status`), e i bot non leggono i nomi; la corsa d'identità lo
   conferma.
6. **Scrittura e controllo**: [genera-testi.py](../../design/set-base/testi/genera-testi.py) `--scrivi` riscrive nella bozza solo i tre
   campi stampati e nome e descrizione degli stati, conservando la formattazione (verifica che la bozza riletta sia uguale all'attesa), e
   scrive `testi-completi.json`. [controlla-testi.py](../../design/set-base/testi/controlla-testi.py) controlla l'uguaglianza esatta di
   campi stampati, stati e file dei testi completi (byte per byte), poi il gergo: nel testo breve (descrizioni delle carte e degli stati)
   niente «×», formule (`abs(`, `>=`, `<=`, `/`), abbreviazioni (HIT, CUT, POISON, HEALTH, GOOD, BAD, «equip»), lettere isolate fuori dai
   segnaposto (ammesse «a», «e», «i», «o» e la maiuscola a inizio frase), rimandi al regolamento, «bersaglio», «autore», «a sé», codici di
   slot; nel testo completo le stesse regole tranne i rimandi. I nomi di carta fra «» non si guardano.
   [prova-controlla-testi.py](sb-25/prova-controlla-testi.py) mostra un caso respinto per regola, nel breve e nel completo, cinque frasi
   pulite che passano e dieci alterazioni della bozza e del file dei testi completi, ognuna respinta con l'errore atteso.
7. **Test del server** (solo attesi che fissano descrizioni o nomi di stato): `Bozza16Test` toglie dal confronto anche nome e descrizione
   degli stati; `SetBaseDraftTest` legge lo slot da `slot.json` (helper `slots()`), riconosce «in questo turno e nel prossimo» come
   `turns` 1 e confronta i testi nuovi; `Sb19CardsTest` cerca gli stati col nome della carta (i due di «Riprendere Fiato» si distinguono per
   la descrizione) e lo slot in `slot.json`; `Sb23ListsTest` riconosce i tutor (`…-AR6`) da `slot.json`: senza la correzione il suo controllo
   sulle copie singole sarebbe passato in silenzio senza guardare i tutor.
8. **print-cards** ([bozza.py](../../../tools/print-cards/bozza.py)): lo slot del piè di carta si legge da `slot.json`; il piè non cambia.
9. **Bozza di riferimento** rigenerata col suo generatore: la colonna «Testo» porta il testo breve nuovo, senza slot. La sezione generata di
   `griglia.md` non legge descrizioni né nomi di stato e non cambia (prova sotto).
10. **frasi.py** ridotto a un rimando: le frasi sono nel generatore; la versione della Fase A si legge con `git show dce3733:…`.

### Scelte prese

- Nome degli stati: il nome della carta, anche quando la carta dà più stati (uno per tipo di danno). Alternativa scartata: suffissi
  italiani («– colpo»), che il glossario non prevede e che il segnalino del client già distingue col simbolo.
- Descrizione degli stati in terza persona («chi lo ha»): il segnalino lo legge anche l'avversario.
- La prova delle regole sta in `docs/reports/set-base/sb-25/`, come quella di SB-24, per restare nei due file nuovi concessi in `testi/`.
- Riga nuova in `aree-protette.md`: non serve, `controlla-testi.py` c'è già nella riga della bozza; la prova si lancia a mano.
- Per le legate il testo completo dice lo scarto R02 («lo scarto avviene all'inizio del suo effetto», regolamento R02). «Discutiamone in
  Privato» e «Rialziamoci e Partite!», classi Java legate per `setBoundToCharacter`, sono riconosciute come legate anche se nessun mazzo le
  elenca fra le bound.

### Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check` | pulito |
| `python scripts/check-links.py` | 8 link rotti, tutti in `docs/design/carriere/` (altro filone, preesistenti); nessuno nei file di SB-25 |
| `python scripts/check-rules.py` | verde |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: 978 test, 0 rossi, 23 saltati (al quarto giro, dopo gli attesi adeguati; sotto) |
| `python -X utf8 docs/design/set-base/controlla-numeri.py` | 0: 117 carte, 7 personaggi, nessuna violazione |
| `python -X utf8 docs/design/set-base/testi/controlla-testi.py` | 0: 117 carte e 44 stati coincidono, 125 testi completi coincidono, nessun gergo |
| `python -X utf8 docs/design/set-base/controlla-nomi.py` | 0 violazioni, ma **124 voci invece di 125**: il token non è più trovato (domanda 2) |
| [prova-controlla-testi.py](sb-25/prova-controlla-testi.py) | tutti i casi come attesi (36 di gergo, 5 frasi pulite, 10 alterazioni) |
| [numeri-invariati.py](sb-25/numeri-invariati.py) | 0: tolti solo `gui.description` e nome e descrizione degli stati, identica a `dce3733`; lo slot tolto coincide con `slot.json` per tutte le 117 carte |
| `genera-bozza-di-riferimento.py --verifica` | allineata (dopo `--scrivi`) |
| griglia: copia di `sb-24/genera-nomi-griglia.py` che legge lo slot da `slot.json` (scratchpad, `--verifica`) | «griglia.md allineata»: la sezione generata non cambia |
| Corsa d'identità sul banco ([identita.json](sb-25/identita.json)) | partite e numeri identici; una sola etichetta diagnostica cambia (sotto) |
| `tools/print-cards/test_generator.py`, `verify.py` | **non eseguiti**: `reportlab` non è installato e installarlo è fuori dal repository (domanda 1) |
| print-cards, prova a moduli finti (solo `load_bozza` e `parse_inline`) | slot letto da `slot.json` per 117 carte, codici uguali a prima; 63 testi non stampabili per i segnaposto dei danni (domanda 1) |

**Corsa d'identità.** Stesso banco del passo 0 di SB-24 (`docs/reports/set-base/sb-21z/run.ps1 -Phase feasibility`,
`Sb19MeasureTest#round`, d50, sette mazzi di riferimento, 4 semi per cella dal 7.000.000), stesso codice, due bozze: quella di `dce3733` e
quella della B1; circa 32 s ciascuna, uscite in `%TEMP%\bm-sb25\out`. `deck-observations.json` e `in-play.json` **identici byte per
byte**; `draft.json` identico dopo la spoliazione di `numeri-invariati.py`. `matrix.json` e `matrix.md` hanno le stesse righe e
differiscono nell'intestazione (percorso e SHA-256 della bozza) e in **una nota diagnostica** del tetto delle bound: per
`base.gigi.bound.Lima` il banco stampa il nome dello stato, che passa da «equip AFFILO L'ATTREZZO» a «equip Affilare gli Utensili».
Ogni altro campo, partite e numeri compresi, è identico. Non è quindi «identico byte per byte» come chiedeva il prompt, ed è l'unica
differenza: il nome dello stato è un'etichetta, non entra nel gioco. Il banco non scrive un `observations.json`: i file sono quelli
elencati. Impronte in [identita.json](sb-25/identita.json).

### Lettori del vecchio prefisso dello slot fuori perimetro

Non cambiati, come chiesto; da oggi non girano più o girano peggio sulla bozza nuova:

- `docs/design/set-base/controlla-nomi.py` (SB-24, riga della bozza in `aree-protette.md`): esce con 0, ma l'etichetta di ogni carta è ora
  la descrizione intera invece dello slot, e la regola del token (`crea il token «…»`) non trova più «Bottiglia Spaccata», che quindi esce
  da N1–N3 (domanda 2).
- `docs/design/set-base/sb-24/genera-nomi-griglia.py` (`--verifica` esce con «bozza e proposta non hanno gli stessi slot`), `sb-24/
  genera-revisione.py`, `docs/reports/set-base/sb-24/applica.py`, `docs/reports/set-base/sb-24/prova-controlla-nomi.py`: blocco SB-24
  chiuso.
- `docs/design/set-base/revisione/genera-pagina.py` (SB-20a), `docs/reports/set-base/sb-21h/fase-b/sb21h.py`, `sb-21h/probe.py`: blocchi
  chiusi.
- `docs/design/set-base/sb-25/genera-revisione.py`: importava `frasi.py`; la pagina approvata resta com'era.
- `docs/design/set-base/controlla-numeri.py` legge ancora lo slot dal prefisso ma, non trovandolo, usa il binding come etichetta: funziona.

### Domande per la regia

1. **print-cards.** (a) Il modo `--bozza` era già rotto a `dce3733`: `load_bozza` rifiuta la rarità `PROTAGONIST` dei personaggi, entrata
   con SB-24 (provato a moduli finti sulla bozza di `dce3733`). (b) Con la B1, 63 testi contengono `[[HIT]]`, `[[CUT]]` o `[[POISON]]` e
   `parse_inline` li rifiuta: è lavoro della B2 (simboli dei danni nel PDF), fuori dal mio perimetro di print-cards. (c) `reportlab` non è
   installato qui, quindi `test_generator.py` e `verify.py` non girano; installarlo vuol dire scaricare pacchetti fuori dal repository.
   Proposta: la B2 aggiunge a `parse_inline` i tre segnaposto dei danni (forme di `DAMAGES` in `symbols_pdf.py`) e la rarità P, e chi ha
   `reportlab` lancia le due prove.
2. **controlla-nomi.py.** Perde il token (124 voci) e le etichette per slot. Proposta: farlo leggere da `slot.json` e cercare il token per
   binding (`com.tokens.BrokenBeerBottle`, nome in `testi_stampati.TOKEN_NOME`), in un blocco che ha quel file nel perimetro.
3. **OGG-04 «Mescolone Micidiale».** Il testo completo dice che alla fine del quinto turno perdi anche Vulnerabile: dal codice, i gettoni
   di vulnerabilità sono stati nella lista degli stati e il timer svuota la lista. Lo dice la lettura del motore, non un test (il perimetro
   non ammette test nuovi di comportamento). Serve un test?
4. **Stati con lo stesso nome.** Il client oggi mostra nome e descrizione dello stato; con la B1 tre segnalini di «LIEVE FASTIDIO» hanno lo
   stesso nome e si distinguono per la descrizione, che contiene i segnaposto dei danni (la B2 li disegna). Da guardare nella B2 o in
   SB-31: raggrupparli in un solo segnalino?
5. **Testi «Gained status: …» dei say.** I testi di servizio che il server scrive nel registro del turno restano in inglese e prendono il
   nome nuovo dello stato. Fuori perimetro (Q8).

### Rossi

Solo i rossi attesi dei test che fissavano i testi vecchi: 13 al primo giro (`Bozza16Test` 1, `Sb19CardsTest` 4, `SetBaseDraftTest` 8),
tutti adeguati come al punto 7; `Sb23ListsTest` corretto prima che diventasse un falso verde. Un mio errore di battitura in `Sb19CardsTest` (un commento a metà riga) ha fermato la compilazione del secondo giro; due
attesi (durata «Per 4 turni» a inizio testo, testo di «Lavoro Fatto Bene») sono emersi al terzo, dietro asserzioni che
prima fallivano prima. Quarto giro verde. Nessun rosso del registro.

### File

`docs/design/set-base/testi/{testi_stampati.py, genera-testi.py, controlla-testi.py, slot.json, testi-completi.json}`,
`server/src/test/resources/set-base/bozza.json`, `server/src/test/java/com/gsc/bm/sim/{Bozza16Test, SetBaseDraftTest, Sb19CardsTest,
Sb23ListsTest}.java`, `tools/print-cards/bozza.py`, `docs/design/set-base/sb-25/frasi.py`, `docs/design/set-base/bozza-di-riferimento.md`,
`docs/reports/set-base/sb-25/{prova-controlla-testi.py, numeri-invariati.py, identita.json}`, questo report, `docs/set-base-plan.md`.
