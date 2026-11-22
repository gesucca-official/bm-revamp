# SB-25 — Proposta: testi delle carte per i giocatori

Preparata dalla regia il 22 novembre 2026, dopo [D167](../../set-base-decisioni.md#decisioni-del-proprietario). In attesa della scelta del proprietario.

## Da dove si parte

- I testi stampati della bozza 1.7 (`gui.description`) li genera [testi_stampati.py](testi/testi_stampati.py) dai dati dal SB-20c
  ([D138](../../set-base-decisioni.md#decisioni-del-proprietario)); [controlla-testi.py](testi/controlla-testi.py) verifica che coincidano col generatore.
  Testo e numeri quindi non possono divergere.
- Le risorse sono già simboli disegnati dal client (`[[V]]`, `[[A]]`…), in 103 testi su 117. Il resto è ancora linguaggio da scheda:

  | Cosa | Testi | Esempio di oggi |
  |---|---:|---|
  | Tipi di danno in inglese | 75 | «2 HIT al bersaglio» |
  | Formule e fattori | 35 | «HIT, CUT e POISON ricevuti ×0,75 in questo turno» |
  | «bersaglio», «autore», «a sé» | 52 | «dell'autore valgono solo gli stati GOOD» |
  | Gettone di vulnerabilità | 14 | «gettone di vulnerabilità (HIT, CUT e POISON ricevuti ×1,5)» |
  | Codice dello slot in testa | 117 | «SPA-AR3 · Annuncia…» |

  I testi più lunghi arrivano a 224 caratteri, la media è 91. Fra i più pesanti ci sono le bound «perdi un quarto» (214).
- Ci sono anche testi fuori dalle carte: i personaggi («Valori iniziali: HEALTH 70, A 20, V 25; oggetti vicini: 1.»), il token, i nomi
  degli stati e le parole chiave («Bound», «Annuncia», «Consumato», «Gioca d'anticipo», «equip», «timer»).
- Il client mostra il testo intero nell'ispezione (i). Il flavour (D166) è nella bozza, ma oggi non arriva né al client né alle carte stampate.

## Cosa propongo

**Il generatore resta la fonte.** La passata di stile si fa nelle frasi di `testi_stampati.py` e in un glossario, non scrivendo a mano
117 testi. Così ogni numero sul testo resta quello dei dati. Un testo scritto a mano solo dove una frase generata suona male, e anche
quello controllato sui numeri della carta.

**Il glossario fissa una volta come si dice:**
- risorse: restano simboli;
- tipi di danno: parole italiane (vedi domanda 1);
- chi riceve l'effetto: «tu» e «l'avversario», niente «bersaglio», «autore», «a sé»;
- durate: «in questo turno», «per 3 turni», «fino a fine turno»;
- fattori: il set di [D161](../../set-base-decisioni.md#decisioni-del-proprietario) si dice tutto a parole:

  | Fattore | A parole |
  |---|---|
  | ×0,5 | metà |
  | ×0,75 | un quarto in meno |
  | ×1,25 | un quarto in più |
  | ×1,5 | metà in più |
  | ×2 | il doppio |

- parole chiave e stati: un nome italiano ciascuno, coi nomi delle carte da cui nascono dove si può.

Per dare un'idea, non è il campione:
- **LIEVE FASTIDIO:** «Bound: +5 [[V]]. In questo turno subisci un quarto di danni in meno.»
- **SVEGLIAMOCI - MA TU NO:** «Bound: perdi un quarto della tua [[T]] e un quarto della tua [[L]], per difetto. 2 colpi all'avversario.»

**In due fasi, come chiede il piano:**
- **Fase A, glossario e campione.** Glossario e una dozzina di carte fra le più difficili, su una pagina di revisione nel repository come
  quella di SB-24: testo di oggi, testo proposto, campo per correggere, nota, «Ok».

  Campione proposto:
  - PAZIENZA: FINITA (Annuncia con vulnerabilità);
  - SVEGLIAMOCI - MA TU NO (perdi un quarto);
  - LIEVE FASTIDIO (difesa di un turno);
  - SPEDIAMOTI DUNQUE IN O-AHIO (danno che cresce con la [[V]]);
  - Lazo del Rider (danno che cresce, più Gioca d'anticipo);
  - GABBIANO, DUNQUE VOLIAMOTI (stati GOOD);
  - Buon Vecchio Ricatto (annulla e rimanda metà del colpo);
  - Trascinare nel Tunnel (travaso e immunità);
  - Mescolone Micidiale (immunità e timer);
  - Affilare gli Utensili (equip che converte il danno);
  - Doppio Malto da Discount col token;
  - un personaggio.

  STOP per te.
- **Fase B, tutto il resto.** Le frasi approvate si applicano a tutte le carte, ai personaggi, al token, agli stati e alle parole chiave.
  Poi:
  - un controllo automatico rifiuta formule, sigle, lettere isolate e riferimenti alle regole;
  - una prova d'ingombro nell'ispezione del client a 1366×768 e 844×390 e sulla carta stampata (`tools/print-cards`), flavour compreso;
  - la pagina di revisione con tutti i testi, da rivedere a rate come in SB-24.

  STOP per la tua approvazione, poi SB-25 si chiude.

**Scelte prese**, se non dici altro:
- il codice dello slot esce dal testo che legge il giocatore e resta in un campo suo, perché gli strumenti lo usano;
- `gains` e `damageAmount`, che il client legge come dati, non cambiano formato;
- i numeri della bozza 1.7 non cambiano: lo dimostra di nuovo `numeri-invariati.py`, e a fine blocco si registra l'impronta nuova
  della 1.7;
- «Ultimo turno» resta fuori, come dice Q8;
- i nomi della partita viva cambiano solo in SB-28.

**Chi esegue:** un esecutore Opus con sforzo alto per tutte e due le fasi. Qui un testo gradevole ma impreciso passerebbe inosservato.
L'usage settimanale è al 15%.

## Domande

1. **Tipi di danno.** Parole italiane (per esempio «colpi», «tagli», «veleno»), oppure simboli disegnati dal client come per le risorse?
   Le parole non toccano il client. I simboli occupano meno spazio, ma chiedono una piccola modifica al client e al PDF delle carte stampate.
2. **Flavour nel client.** SB-25 ne prova l'ingombro. Lo mostra il client già in SB-25, nell'ispezione (i) e, dove c'è spazio, sul volto
   della carta? Oppure aspetta SB-31, con il resto dell'adeguamento del client? Nel primo caso SB-25 tocca anche il server
   (un campo nuovo verso il client) e il client.
3. **Via.** Parto con la Fase A su Opus, sforzo alto?
