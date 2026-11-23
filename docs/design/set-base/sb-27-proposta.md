# SB-27 — Proposta: carte d'effetto speciale in forma definitiva

Preparata dalla regia il 23 novembre 2026, dopo [D176](../../set-base-decisioni.md#decisioni-del-proprietario). In attesa della scelta del proprietario.

## Da dove si parte

- **Le carte della bozza 1.7.** Delle 117 carte, 98 sono solo dati e restano dati anche nel vivo (D175 (2)). Le altre 19 hanno una classe
  Java, che il file del set regola con dei parametri (`params`), per esempio «Lavoro Fatto Bene» con `base 15, perItem 4`.
- **Come sono fatte oggi le 19 classi.**
  - Ogni numero è un campo `@Tunable`. Il suo valore iniziale è quello della partita viva o un valore di comodo, e la bozza lo
    sovrascrive: «Lavoro Fatto Bene» ha 6 nella classe e 15 nella bozza.
  - Alcuni parametri esistono solo per spegnere una parte della carta. «FAI BASTA» dà ancora 10 A all'avversario nel vivo e 0 nella
    bozza; «Ce l'Hai Due Spicci?» e «Alla Goccia» fanno lo stesso.
  - Otto classi sono **condivise con lo 0.1 vivo**: FAI BASTA, Furto con Destrezza, Riflessi Aumentati dalla Speed, Trascinare nel
    Tunnel, Mescolone Micidiale, Doppio Malto da Discount, Disassemblare e PERMESSO SCUSA PUOI SMETTERLA. Nel vivo hanno altri numeri:
    PERMESSO SCUSA, per esempio, fa 10 HIT nel vivo e 8 nella bozza.
- **I test di oggi.** Quasi tutte le carte compaiono in qualche test, ma sparse in test di blocco (`Sb17CardsTest`, `Sb18CardsTest`…),
  scritti su bozze precedenti. Nessuna suite prova ogni carta contro la sua scheda 1.0 (il testo completo).

## Cosa propongo

**I numeri restano nel file del set, la classe tiene solo la logica.** I parametri sono numeri veri della carta. Il generatore dei testi
li legge per scrivere testo breve e scheda, quindi lasciarli nel file mantiene la fonte unica (D175). Nella forma definitiva:
- un parametro che spegne una parte della carta sparisce, insieme alla logica che spegneva;
- per le carte del set nuovo, un numero che manca nel file del set è un errore: niente più valore di riserva nella classe;
- ogni classe ha un javadoc che rimanda alla scheda, non a blocchi o decisioni di bilanciamento.

**La partita viva non cambia.** Nelle otto classi condivise lo 0.1 resta com'è: valori iniziali del vivo e parti spente solo dalla
bozza. Quella pulizia si fa in SB-28, quando lo 0.1 esce. Qui si scrive la lista esatta di cosa togliere.

**Una suite che prova ogni carta contro la sua scheda.** Per ogni carta, personaggio e token del set:
- almeno un caso base;
- un caso per ogni clausola della scheda: arrotondamenti, condizioni, timer, «se non c'è più l'oggetto», mossa già risolta, Vulnerabile…

Gli attesi si scrivono **leggendo la scheda**, non ricavandoli dai dati: un test che ripete i dati non prova niente. La copertura si
dichiara per carta in una tabella del rapporto. I test di blocco di oggi restano dove sono.

**Le misure del congelamento si riproducono.** Una corsa d'identità con la forma definitiva deve dare gli stessi file byte per byte
della misura di riferimento sui numeri 1.7. Se un test trova una carta che non fa ciò che dice la scheda, l'esecutore si ferma e
lo porta qui: si decide se correggere il codice o la scheda.

**In due fasi, due esecutori in fila:**
- **Fase A:**
  - le 19 classi in forma definitiva;
  - i loro test contro la scheda;
  - la corsa d'identità;
  - la lista per SB-28.
- **Fase B:** i test delle 98 carte a dati, dei personaggi e del token, con la tabella di copertura completa.

Ogni fase finisce con uno STOP per la revisione della regia. Tu intervieni solo se esce una differenza fra carta e scheda.

**Scelte prese**, se non dici altro:
- le classi del set nuovo restano nel package `model/cards/base`, fuori dalla partita viva fino a SB-28;
- gli identificatori (`binding`) non cambiano;
- nessun numero e nessun testo cambia: bozza e catalogo candidato restano identici (`a8930ede…`).

## Domande

1. **Numeri delle carte Java.** Restano nel file del set, letti dalla classe (la mia proposta)? Oppure vanno scritti dentro la classe,
   come nelle carte vive di oggi? Nel secondo caso il generatore dei testi dovrebbe leggerli dal codice Java, e si torna ad avere due
   posti per lo stesso numero.
2. **Via.** Parto con la Fase A?
