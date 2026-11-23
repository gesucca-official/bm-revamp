# SB-28 — Proposta: trasferimento nella partita viva

Preparata dalla regia il 23 novembre 2026, dopo [D181](../../set-base-decisioni.md#decisioni-del-proprietario). Risposte del proprietario in [D182](../../set-base-decisioni.md#decisioni-del-proprietario): quick a caso fra i cinque starter, mazzi salvati con carte uscite cancellati.

## Da dove si parte

- **La partita viva** gioca il regolamento **1.14** con il Set Base **0.1**: 39 carte, due personaggi, mazzi base. Le regole del
  vivo sono quelle di `Ruleset.LIVE` («1.13» nel codice: la 1.14 aggiunge solo la rarità P, descrittiva).
- **Il set nuovo è pronto ma vive solo nel playground:**
  - il file del set (la bozza 1.7, `325926e3…`) con 117 carte, 7 personaggi, un token e i mazzi;
  - il documento del Set Base **1.0 candidato**, l'allegato e il catalogo, generati da `set_catalog.py` in una cartella di prova
    (SB-26);
  - le 19 carte speciali in forma definitiva e tutte le 125 voci testate contro la scheda (SB-27).
- **Le regole del set stanno ancora nel playground:** [regole-playground.md](regole-playground.md), versione 1.9, con RP-1…RP-29:
  chi è a terra non colpisce, costi pagati con quello che si ha, corazza dell'alcol, Annuncia e Vulnerabile, oggetti «In campo»…
  Nel codice sono le regole `d50`, accese dall'interruttore `Ruleset.playground()`. D50 e D78 dicono che entrano nel regolamento
  qui, con versione e motivazione.
- **Le liste di cose rimandate a SB-28**, già decise:
  - pulire le otto classi condivise col vivo; la lista esatta è nel [rapporto di SB-27](../../reports/set-base/sb-27-report.md);
  - il costo «A 0» di «Ce l'Hai Due Spicci?» e `perAlcohol` facoltativo nel generatore dei testi;
  - i nomi del vivo diventano quelli del set, compreso il token «Bottiglia Spaccata» (D168 (4));
  - i rimandi «regole del playground, RP-n» nei testi completi diventano rimandi al regolamento;
  - nomi e categoria degli starter entrano nel file del set; i mazzi di prova escono dal file vivo (SB-26).
- **Cosa c'è già in produzione:** il caricatore del file del set, oggi usato dal solo profilo `bozza` (`com/gsc/bm/bozza`). La quick
  match sceglie a caso fra i due personaggi vivi; i giocatori possono avere mazzi personalizzati salvati.

## Cosa propongo

**Prima la norma, poi il codice, poi la prova sul campo.** Il regolamento e il documento del set cambiano prima del codice (AGENTS.md).
Il passaggio vero, invece, avviene in un solo commit, così il vivo non resta mai a metà.

**Fase A, la norma (solo testi, nulla di vivo):**
- **regolamento 2.0** candidato: la 1.14 più le regole del playground che riguardano il gioco, scritte come regole di sistema
  (RP-1…RP-21, RP-23…RP-25, RP-27, RP-29). Le regole del formato del file (RP-22, RP-26, RP-28) vanno nella descrizione del formato,
  non nel regolamento. Con le parole chiave definite una volta sola (Annuncia, Vulnerabile, Rincara, Gioca d'anticipo, In campo,
  immune, gettone);
- il **documento del Set Base 1.0** con i rimandi al regolamento 2.0 al posto di «regole del playground»: si rigenerano testi completi
  e catalogo candidato. Il testo breve non cambia;
- una tabella di corrispondenza RP-n → regola nuova, e la lista delle regole 1.14 che cambiano o spariscono.

STOP: leggi tu il regolamento 2.0 e la tabella. Il codice parte solo dopo.

**Fase B, il passaggio (un solo commit):**
- il file del set va fra le risorse di produzione, senza i mazzi di prova (che restano nei test), con nomi e categoria degli starter;
- il vivo legge carte, personaggi e starter dal file del set; le regole del vivo diventano quelle del regolamento 2.0. Le regole
  `1.13` restano nel codice solo per leggere le partite archiviate e per le misure storiche;
- `set_catalog.py` scrive il catalogo vivo: documento del set, allegato, `cards.sqlite`, copie del client di debug. Lo 0.1 va
  nell'archivio dei documenti;
- le carte dello 0.1 che non sono nel set nuovo escono; le otto classi condivise si puliscono secondo la lista di SB-27;
- i test vivi che cambiano attese citano la decisione; nessun atteso cambia per accettare una regressione;
- la stampa delle carte usa il set vivo.

Verifiche: tutti i test, `TestServerContext`, i manifest delle partite, `check-rules.py` sul vivo (senza `--candidate`). Poi la
**corsa d'identità**: il giro 20/2 di SB-23 lanciato sul percorso vivo deve dare gli stessi risultati della misura del congelamento.

**Fase C, la prova sul campo:**
- partite vere via CLI con ciascuno dei cinque starter e dei due personaggi da booster;
- una partita tua nel client, avviato in locale;
- il rapporto con quello che non si è potuto provare.

Nulla va in produzione su Heroku finché non dici tu «pusha».

**Scelte prese**, se non dici altro:
- il set resta `base`, versione **1.0**; il regolamento passa alla **2.0**, perché cambia il sistema e non solo un dettaglio;
- Junkie («Celestina Bucatina») passa da starter base ad avanzato, come dice il piano; i base sono Spazienzio e Mara, gli avanzati Celestina, Piera e Beppe;
- le partite archiviate restano leggibili con la versione registrata;
- il bot delle partite contro il computer resta quello di oggi; il collegamento dei livelli è di SB-30;
- il flavour e il promemoria delle parole chiave nel client restano di SB-31, le immagini di SB-32.

## Domande

*Risposte in D182:* (1) la proposta sbagliava le categorie (Pino e Gigi sono avanzati): la quick assegna a caso uno dei **cinque** starter; (2) i mazzi salvati con carte uscite **si cancellano**.

1. **Quick match fino a SB-29.** Oggi assegna a caso uno dei due personaggi vivi. Propongo: a caso fra i **quattro starter base**
   (Spazienzio, Mara, Pino, Gigi). SB-29 aggiunge poi la scelta della categoria e porta dentro Celestina. In alternativa: tutti e
   cinque gli starter subito.
2. **Mazzi personalizzati salvati** con carte dello 0.1 che escono. Propongo: non si cancellano, diventano **non validi**. Il
   giocatore li vede segnati e non può usarli finché non li corregge; la partita non parte con un mazzo non valido. In alternativa:
   si cancellano al passaggio.
3. **Via.** Parto con la Fase A?
