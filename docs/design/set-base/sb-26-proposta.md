# SB-26 — Proposta: generazione del catalogo dal set

Preparata dalla regia il 23 novembre 2026, dopo [D174](../../set-base-decisioni.md#decisioni-del-proprietario). In attesa della scelta del proprietario.

## Da dove si parte

- **La partita viva** ha una carta scritta in quattro posti, tenuti allineati a mano e controllati da `check-rules.py`:
  - il documento del set [Set Base 0.1](../../sets/base.md), con tabelle di schede tecniche («+5 A a sé; 5 HIT al bersaglio»);
  - l'allegato `docs/rules-catalog.json`;
  - il catalogo `cards.sqlite`, con nome, testo, ruolo, guadagni e danno;
  - le classi Java.

  Le carte sono 39. Il documento stesso dice che passerà alla **1.0** quando entrerà il set nuovo.
- **La bozza 1.7 congelata** (`server/src/test/resources/set-base/bozza.json`) ha 117 carte, 7 personaggi e un token:
  - 98 carte sono solo dati;
  - 19 usano una classe Java con parametri, le carte d'effetto speciale di SB-27.

  Testo breve, guadagni e danno nominale li scrive già il generatore di SB-25 dai dati. Il testo completo sta in
  `testi/testi-completi.json` e lo slot in `testi/slot.json`. Il caricatore delle bozze è già nei sorgenti di produzione (profilo `bozza`).
- **`check-rules.py`** oggi pretende che il testo del catalogo coincida con la scheda del documento. Non conosce i costi in HEALTH (D27)
  e ammette un solo documento di set.

## Cosa propongo

**La fonte è il file del set, cioè la bozza.** Da lì un solo comando genera, sempre uguali a parità di file:
- **il documento del set 1.0, candidato.** Per ogni carta: nome, tipologia, rarità, costo e priorità in una riga, poi il **testo completo**
  come scheda normativa (D170). I ruoli, i guadagni e il danno di R07a restano in una tabella a parte, come la S5 di oggi. Starter e
  personaggi come nella S1 e nella S2;
- **l'allegato e le righe SQLite** dello stesso set. Il catalogo candidato ha due campi in più: testo completo e flavour, che servono
  al client in SB-31;
- **le copie per il client di debug.**

**Nulla diventa vivo.** Tutto si genera in una cartella di prova (`server/src/test/resources/set-base/catalogo/`). Lo 0.1, l'allegato,
`cards.sqlite` e le copie vive non cambiano: li sostituisce SB-28 con un solo comando. Così SB-26 si verifica senza toccare la partita.

**`check-rules.py` cambia così:**
- controlla scheda e testo breve come due campi distinti, ognuno contro il proprio generatore;
- riconosce i costi in HEALTH;
- accetta più documenti di set;
- con un'opzione, controlla anche il catalogo candidato.

La partita viva di oggi resta verde con le stesse regole.

**Il formato regge le espansioni.** Si prova sulla mini-espansione di SB-6b: due set, due documenti, un catalogo che li carica tutti e
due, un mazzo che li mescola, nessuna regola che presume tre bound.

**Scelte prese**, se non dici altro:
- il set nuovo si chiama ancora `base`; la versione 1.0 resta «candidata» fino a SB-28;
- i nomi delle classi vive (`binding`) restano gli identificatori stabili, come oggi;
- il regolamento non cambia;
- le 19 carte speciali entrano nel documento col loro testo completo; la loro classe definitiva è di SB-27;
- R07a (ruolo, guadagni, danno) si genera per ogni carta e si controlla contro i dati, che è il rischio indicato dal piano.

**In una fase sola**, con STOP alla fine: il documento 1.0 candidato da leggere, con i controlli verdi e la prova di ripetibilità
(due generazioni, stessi byte).

## Domande

1. **I dati restano la forma definitiva in produzione?** Il piano chiede di stabilirlo qui. Propongo **sì**: le 98 carte a dati restano
   dati anche nel vivo, lette dal file del set, e solo le 19 speciali hanno una classe Java (SB-27). In alternativa ogni carta diventa una
   classe Java generata o scritta a mano. È più lavoro, e i dati e il codice tornano a poter divergere.
2. **Forma del documento del set.** Una scheda per carta, raggruppata per personaggio, col testo completo (proposta)? Oppure tabelle come
   oggi, con 124 righe e testi lunghi nelle celle?
3. **Via.** Parto con un esecutore?
