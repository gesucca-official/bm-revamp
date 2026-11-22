# SB-25 Fase A — Glossario, campione e piano della Fase B

Preparata dall'esecutore il 22 novembre 2026, dopo [D168](../../set-base-decisioni.md#decisioni-del-proprietario). In attesa della
revisione del proprietario sulla pagina. Direzione approvata: [proposta di SB-25](sb-25-proposta.md).

## In breve

- **Pagina di revisione:** [sb-25/revisione.html](sb-25/revisione.html), un file solo che si apre da file:// su ogni PC col
  repository. Per ogni voce: testo di oggi, testo proposto coi simboli disegnati come nel client, riquadro per correggere,
  nota, «Ok» / «Da rivedere». Salva in [sb-25/revisione-proprietario.json](sb-25/revisione-proprietario.json) (Chrome/Edge
  direttamente, altrove con «Esporta») e dopo ogni salvataggio ricorda i comandi git, come in SB-24.
- **Glossario:** 35 voci ([glossario.json](sb-25/glossario.json)): simboli, chi riceve, quantità e fattori, durate, parole chiave,
  stati, ciò che esce dal testo, personaggi e token.
- **Campione:** le 12 voci della proposta più il token che crea il Doppio Malto, 13 in tutto ([campione.json](sb-25/campione.json)),
  ognuna con ciò che il testo breve non dice e dove il giocatore trova la regola intera.
- **Prototipo:** [sb-25/frasi.py](sb-25/frasi.py) legge la bozza 1.7 e scrive i testi nuovi; ogni numero viene dai dati. Gira su
  tutte le 125 voci (117 carte, 7 personaggi, il token) senza errori, ma solo il campione è riletto qui. Nessun file di gioco è
  cambiato: bozza, generatore, client e PDF sono come prima.
- **Segnaposto dei danni:** `[[HIT]]`, `[[CUT]]`, `[[POISON]]`, accanto a `[[H]]`…`[[L]]`. Un danno si legge «20 [[HIT]]
  all'avversario»; un danno che cresce «[[HIT]] all'avversario pari a 6 più metà della [[V]] che ti resta».
- **Lunghezza:** sulle 117 carte, senza codice di slot e con ogni simbolo contato come un carattere, la media passa da 75 a 66
  caratteri e il massimo da 198 a 165 (Opportuna Distrazione e Buon Vecchio Ricatto).

## Cosa cambia, nella Fase B

Il testo che il giocatore legge, non i dati: le frasi del generatore, il controllo dei testi, il disegno dei simboli dei danni nel
client e nel PDF. Nessun numero della bozza 1.7.

## Scelte prese

- **Segnaposto = nome del tipo nei dati.** `[[HIT]]` non si confonde con `[[H]]` (salute) e il generatore lo scrive senza tabelle.
- **Le parole del client.** «Vulnerabile», «stato positivo/negativo», «equipaggiamento», «immune a», «timer» sono già i titoli dei
  segnalini sul tavolo: il glossario li riprende invece di inventarne altri. Il segnalino «Vulnerabile» spiega già la regola intera.
- **Il sottotipo esce dal testo** («Bound:», «Basic:», «Last resort:»): lo dice il telaio, sia nel client sia sulla carta stampata.
  Restano «Quando lo consumi:» e «In campo, a fine turno:» per gli oggetti, perché dicono quando succede.
- **Le condizioni vanno in fondo** («Gioca d'anticipo: …»), così non sembrano reggere le frasi che seguono; il prototipo le sposta
  solo se nessun effetto successivo legge le risorse di chi gioca, altrimenti si ferma con errore. Oggi tocca solo Agilità Innaturale.
- **Due frasi con lo stesso inizio diventano una** («Perdi un quarto della tua [[T]] e un quarto della tua [[L]]»).
- **«Che ti resta» / «la tua».** Una quantità letta dalle risorse dice «che ti resta» se la carta costa quella risorsa (si legge
  dopo il costo), altrimenti «la tua».
- **Simboli nella pagina:** SVG presi dai livelli del client (`client-web/src/symbols.ts`) da [sb-25/simboli.mjs](sb-25/simboli.mjs),
  con Node 22.6 o più recente; il risultato è in `simboli.json`, la pagina non ha bisogno di rete.
- **Il token** non è nella bozza: i suoi numeri sono copiati nel prototipo dalla classe Java `BrokenBeerBottle`.

## Piano della Fase B

Un esecutore Opus, sforzo alto, passo diretto sul glossario e sul campione approvati.

1. **Frasi nel generatore.** Le frasi di `frasi.py`, con le correzioni del proprietario, entrano in `testi/testi_stampati.py`
   (al posto di `testo_passi`, `testo_dati`, `testo_java` e del dizionario `JAVA`); `TOKEN_SCONOSCIUTO` accetta `[[HIT]]`,
   `[[CUT]]`, `[[POISON]]`; `genera-testi.py --scrivi` riscrive `gui.description` delle 117 carte; `controlla-testi.py` resta il
   confronto esatto col generatore. `gains` e `damageAmount` non cambiano formato (D168 (4)).
2. **Slot fuori dal testo** nel campo deciso alla domanda 4. Chi legge oggi il prefisso: `SLOT` in `testi_stampati.py`,
   `tools/print-cards/bozza.py`, le pagine di revisione di SB-20a e SB-24; la Fase B li cerca tutti con
   `git grep` e li sposta sul campo.
3. **Controllo automatico** in `controlla-testi.py`: rifiuta «×», formule (`abs(`, `>=`, `/`), sigle (HIT, CUT, POISON, HEALTH,
   GOOD, BAD, equip), lettere isolate fuori dai segnaposto, rimandi al regolamento («R05», «Regolamento»), «bersaglio», «autore»,
   «a sé», il codice dello slot. Con una prova che gli faccia vedere un caso per regola.
4. **Personaggi, token e stati.** Il testo dei personaggi e del token generato dalla stessa libreria (la carta stampata lo usa;
   il client lo mostra in SB-31); nomi e descrizioni degli stati secondo la domanda 3; la regola intera delle parole chiave nelle
   pagine di guida di `tools/print-cards`, secondo la domanda 2.
5. **Client:** `EffectText` (`client-web/src/ui.tsx`) disegna `[[HIT]]`, `[[CUT]]`, `[[POISON]]` col simbolo che `DamageMark`
   usa già; un test unitario. Verifiche dell'area client web: `./client-web/run.ps1 -Task Test`, `-Task Build`, `-Task Size`;
   le Playwright dell'ispezione scelte dalla regia, a 1366×768 e 844×390; prima il jar rifatto
   (`./scripts/build.ps1 -Task Server -Offline`), perché la bozza cambia.
6. **Carta stampata:** `tools/print-cards` disegna i segnaposto dei danni nel testo (le forme sono già in `symbols_pdf.py`);
   `test_generator.py` e `verify.py` verdi, PDF della bozza renderizzato e guardato. Area non classificata: la regia ne scrive
   impatto e verifica nel prompt.
7. **Prova d'ingombro**, flavour compreso: tutte le carte sulla carta stampata, e nell'ispezione del client a 1366×768 e 844×390
   con uno script di misura che aggiunge il flavour solo durante la prova (il client lo mostra davvero in SB-31, D168 (2)). Si
   accorcia solo ciò che non entra: prima la frase, poi il flavour (D166 (2)).
8. **Numeri invariati.** Una variante di `docs/reports/set-base/sb-24/numeri-invariati.py` che toglie dal confronto solo
   `gui.description` e il campo dello slot: tutto il resto della bozza identico alla 1.7 di SB-24. Poi `controlla-numeri.py`,
   `controlla-testi.py`, `controlla-nomi.py` (righe della bozza nella [tabella delle aree](../../aree-protette.md)), le righe
   «Sempre» (`git diff --check`, `check-links.py`, `check-rules.py`, `./scripts/build.ps1 -Task Test -Offline`), e l'impronta
   nuova della 1.7 registrata.
9. **Pagina di revisione con tutti i testi**, da rivedere a rate come in SB-24; STOP per l'approvazione, poi SB-25 si chiude.

## Domande

1. **Arrotondamento.** Le carte non dicono più «arrotondato per difetto»: la guida lo dice una volta per tutte («metà e quarti si
   arrotondano sempre per difetto»), ed è vero per ogni carta. Va bene, o lo vuoi ancora su ogni carta (circa 20 caratteri in più
   per ogni quantità, su 11 carte)?
2. **Dove si legge la regola intera delle parole chiave.** Vulnerabile, Gioca d'anticipo, Rincara, Annuncia, equipaggiamento,
   immune. Proposta: nella Fase B nelle pagine di guida della carta stampata; nel client restano i segnalini, che già spiegano
   Vulnerabile, immunità, equipaggiamenti e timer; un promemoria per carta nell'ispezione va in SB-31. In alternativa il promemoria
   fra parentesi sulla carta stessa, più lungo.
3. **Nomi e descrizioni degli stati.** Oggi sono nella bozza come «MI TENGO AL BANCO - HIT» e «Hit Damage taken: x0.75», e il
   client li mostra sui segnalini. Li rifà la Fase B (un nome solo senza il tipo inglese, descrizione italiana generata)? Cambia
   dati della bozza che il motore porta al client, nessun numero.
4. **Dove va il codice dello slot.** (a) Un campo `gui.slot` nella bozza: il caricatore del server (`Draft.java`, area playground)
   oggi rifiuta i campi che non conosce, quindi va cambiato, con le verifiche di quell'area. (b) Un file a parte, binding → slot,
   che leggono gli strumenti: il server non si tocca. Propongo (b).
