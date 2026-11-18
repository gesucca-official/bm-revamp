# SB-20a — Pagina di revisione delle carte del Set Base

**Esito:** consegnato. Lo script genera la pagina `tmp/revisione-carte.html` con le 123 carte, i campi modificabili, le
segnalazioni gialle, i filtri, l'esportazione e il salvataggio locale. Nessun dato del gioco è cambiato: nel commit entrano
solo lo script, questo rapporto e il piano. **Revisione del proprietario da fare**; le domande sono in fondo, numerate. Il
decisione D136 è in [set-base-decisioni.md](../../set-base-decisioni.md#decisioni-del-proprietario).

Stato di questo rapporto: scritto il 18 novembre 2026, prima del commit SB-20a.

## 1. Fonti lette

Sola lettura. Nessuna fonte è stata modificata.

| Fonte | Usata per |
|---|---|
| `server/src/test/resources/set-base/bozza.json` | 116 carte e 7 personaggi: nome, rarità, costi, numeri degli effetti, priorità, parametri Java, testo stampato, risorse e capacità dei personaggi |
| `docs/design/set-base/griglia.md`, sezione «La griglia» (righe 141–407) | slot, tipo, ruolo, rarità di controllo; numeri di riga citati nelle fonti |
| `docs/sets/base.md`, tabella S2 | confronto dei due personaggi del vivo (Spazienzio, Celestina) |
| `server/src/main/resources/cards.sqlite`, tabelle `CRD001_GUI` e `CRD003_CHARACTERS` | presenza nel catalogo vivo, in sola lettura |
| `docs/design/set-base/flavour.md`, sezioni dei personaggi e tabella «Carte» | testi di flavour dei sette personaggi; citazioni di slot |
| `docs/design/set-base/identikit.md` | primo paragrafo di ogni personaggio: descrizione dell'illustrazione |
| `docs/design/set-base/identikit/riferimenti/*.png` | sette foto di riferimento, in testa a ogni gruppo di personaggio |

Non usati come fonte di valori: `docs/rules-catalog.json` (allegato del set vivo, di cui non ho letto le voci per carta: il
controllo del catalogo vivo è fatto su `cards.sqlite`); le note «Motivo» della griglia, che citano nomi di lavoro come
«Tutto è droga» (sono nomi candidati, non flavour).

## 2. Come ogni campo è mappato a una fonte

| Campo | Fonte del valore | Controllo |
|---|---|---|
| Slot della griglia | prefisso di `gui.description` (es. `SPA-BO1 · …`); per i personaggi, il mapping `id` → `PG-*` dello script | griglia: 123 ID uguali a quelli di bozza e personaggi |
| Nome visualizzato | `gui.name` (carte), `characters[].name` (personaggi) | nome del personaggio uguale al nome in griglia |
| Tipo | colonna «Tipo» della griglia (il `kind` della bozza compare come info) | — |
| Ruolo | `gui.role` della bozza | confrontato con la colonna «Ruolo» della griglia: 0 differenze |
| Rarità | `rarity` della bozza (COMMON/UNCOMMON/RARE → C/NC/R) | confrontata con la colonna «Rarità» della griglia: 0 differenze |
| Costi | `cost` della bozza, una voce per risorsa | — |
| Numeri dell'effetto | ogni valore numerico di `self`, `target`, `inPlay`, `params` della bozza, con etichetta costruita dal percorso (es. «Bersaglio · danno HIT · importo · base») | — |
| Priorità | `priority` della bozza | — |
| Risorse e capacità dei personaggi | `resources`, `items` della bozza | confronto con base.md (sez. 4) |
| Testo stampato | `gui.description` senza il prefisso di slot | controllo dei numeri (sez. 5) |
| Flavour | `flavour.md`: per i sette personaggi, «Dalla scheda», Carattere, Voce, Storia, Battute, Rapporti con gli altri; tabella «Carte» (oggi vuota) | per le 116 carte non c'è nessuna fonte |
| Nome dell'illustrazione | nessuna fonte per nessuna carta | campo vuoto |
| Descrizione dell'illustrazione | per i personaggi: primo paragrafo dell'identikit e «Aspetto» di `flavour.md` | per le carte: nessuna fonte |
| Citazioni | righe di `flavour.md` e `identikit.md` che nominano uno slot (es. «idee che toccano una meccanica») | mostrate a parte, non come flavour |

Ogni campo modificabile mostra sotto di sé la fonte (file e carta, o file e riga). I campi di sola lettura sono le fonti,
le citazioni e le informazioni (tipo in bozza, legami, catalogo vivo). Per le 17 carte Java la pagina avverte che i numeri
stanno nel codice.

## 3. Come lo script conta le 123 carte

- 116 carte della bozza, ciascuna con uno slot unico ricavato dal prefisso di `gui.description`.
- 7 personaggi, con slot `PG-*` assegnati per id e verificati sul nome della griglia.
- Lo script esce con errore se le voci non sono 123, se gli slot non coincidono con quelli della griglia o se i conti per
  rarità non danno **44 C / 59 NC / 20 R**. Il conto è stato fatto sia dalla bozza sia dalla griglia: entrambi danno 44/59/20.
- Gruppi: SPA 11, MAR 11, TOS 12, PIN 12, GIG 11, CES 12, ROC 12 (personaggi, ciascuno con il suo personaggio in testa),
  generiche 24 (GEN e LR-STR), oggetti 18 (OGG). Totale 123.

Nel file ci sono 1 524 campi e 417 valori numerici.

## 4. Fonti ambigue o in contrasto

Non ho corretto nessun dato. Ogni caso è mostrato in pagina come segnalazione, con la fonte.

1. **base.md S2 contro bozza (personaggi, 2 carte).** Spazienzio: HEALTH 100 in base.md, 75 in bozza e griglia (con «salute
   precedente 85»). Celestina: HEALTH 100 in base.md, 70 in bozza; risorsa speciale TOXICITY 10 in base.md, 15 in bozza e
   griglia; capacità oggetti 3 in base.md, 2 in bozza e griglia («capacità 3 → 2»). La griglia non è coerente con base.md
   neppure sulla storia («precedenti 80/20»). Ho mostrato i valori della bozza, come dice la griglia («numeri correnti
   della bozza»), e segnalato il contrasto. Serve una decisione: vedi domanda 1.
2. **base.md sulle 39 carte del vivo.** Non ho confrontato le carte una per una: la bozza ridisegna quasi tutte (la
   «Mappa delle carte attuali» della griglia documenta l'esito di ciascuna) e un confronto automatico darebbe rumore.
3. **Turni nel testo contro i dati (6 carte).** `OGG-09`, `OGG-11`: il testo dice «per 3 turni», la bozza `turns: 2`.
   `GEN-20`: «per 2 turni», bozza `turns: 1`. `OGG-10` e `SPA-AR4` dicono «questo e i due/tre successivi» (3 e 4 turni
   in tutto) con `turns: 2` e `turns: 3`: il testo conta anche il turno corrente, i dati no. Non so quale sia la regola.
   `CES-AR7` dice «0 A» ma la bozza non ha costo. Vedi domanda 2.
4. **Nomi nei flavour.** Le intestazioni di `flavour.md` usano ancora i nomi precedenti (Tossico del Serraglio, Pino
   l'Ultimo Giro, Gigi del Carro Attrezzi, Cesira la Malalingua, Rocco «Sant'Incasso»). Li ho mappati agli slot a mano, con
   una tabella nello script. Il rinominare è già applicato altrove (tabella «Incoerenze» di flavour.md, 8 novembre): questo documento non è stato aggiornato.
5. **Flavour delle carte.** Per le 116 carte di bozza non c'è nessun testo di flavour nelle fonti; i sette personaggi ne hanno.
   Le citazioni di slot in `flavour.md` (per esempio le idee su `PIN-AR1`) non sono testi di flavour e sono mostrate a parte.

## 5. Segnalazioni gialle, per motivo (carte)

Le segnalazioni sono aiuti, non regole. Una carta può avere più motivi.

| Motivo | Carte |
|---|---:|
| flavour mancante (nessuna fonte per la carta) | 116 |
| valore non multiplo di 5, dove le altre carte lo sono | 61 |
| testo stampato più lungo della media (oltre 1,5 volte la media di 57,6 caratteri, soglia 86,4) | 23 |
| il testo cita un numero che i dati non hanno | 6 |
| numero decimale o moltiplicatore fuori da 0,25 | 5 |
| fonti in contrasto: base.md dice un valore diverso | 2 |
| nome mancante | 0 |
| rarità diversa dalla griglia | 0 |
| ruolo diverso dalla griglia | 0 |

Le regole di calcolo: «multiplo di 5» vale per importi, costi, risorse dei personaggi e i valori che le altre carte pongono
a multipli di 5 (esclusi priorità, turni, passi, fattori e rincari); «decimale» segnala i valori che non sono multipli di 0,25.
Le carte segnalate per il motivo «multiplo di 5» sono in pagina, con il filtro «solo segnalate».

## 6. Prova nel browser

Il browser del pannello non apre `file://` («couldn't open file»): ho servito la cartella `tmp/` su `127.0.0.1` con
`python -m http.server` per la sola prova. Il file generato è autonomo e non richiede il server; non ho provato l'apertura
diretta da disco nel browser del proprietario.

- Caricamento: 123 schede, sette gruppi di personaggio più generiche e oggetti; nessun errore in console.
- **Modifica sopravvive al ricaricamento.** HEALTH di Spazienzio portato da 75 a 80, con una nota: dopo la ricarica la
  pagina mostra 80 e la nota, il contatore segna «Carte modificate: 1 (campi: 1)».
- **Esportazione.** Il file `revisione-modifiche.json` contiene una carta (PG-SPA), il campo «HEALTH iniziale» con
  `prima: 75` e `dopo: 80`, e la nota. Ho catturato il contenuto del blob nel browser; il download su disco non è stato provato.
- **«Annulla tutto» svuota.** Con la conferma accettata: `localStorage` vuoto, HEALTH torna a 75, la nota si svuota, il
  contatore torna a 0.
- Filtri: «solo segnalate» mostra 118 carte; il gruppo Oggetti mostra 18.

La modifica è stata fatta con eventi `input` inviati dalla pagina (non con la tastiera). Il resto è stato osservato
nel browser.

## 7. Verifiche

- `python -X utf8 docs/design/set-base/revisione/genera-pagina.py`: esce con 0; 123 carte; 44 C / 59 NC / 20 R.
- `git diff --check` (sui file in stage): nessun errore.
- `python scripts/check-links.py`: 427 file controllati, 0 link rotti.
- `python scripts/check-rules.py`: esito 0.
- Non ho eseguito `./scripts/build.ps1`: lo script non tocca il server, il codice o il client.

## 8. Come rigenerare la pagina

```bash
python docs/design/set-base/revisione/genera-pagina.py
```

Esce con errore se le carte non sono 123, se gli slot non coincidono con la griglia o se i conti per rarità non sono
44 C / 59 NC / 20 R. Output: `tmp/revisione-carte.html` (circa 27 MB, perché incorpora le sette foto di riferimento da
2,5–3,1 MB l'una). Per aprirla servono un browser e nient'altro; per il controllo il browser deve poter leggere
`localStorage` su `file://` (in Chrome ed Edge funziona).

## 9. Scelte prese

- I campi modificabili partono dal valore della bozza. Flavour, nome e descrizione dell'illustrazione partono vuoti, perché
  la bozza non ha quei valori: le fonti sono mostrate sopra il campo.
- Il tipo viene dalla griglia (la bozza ha solo `kind`, più grezzo, riportato come info).
- `LR-STR` sta fra le generiche; `LR-TOS`, `LR-PIN`, `LR-ROC` stanno nel gruppo del loro personaggio.
- Le sette foto sono incorporate in base64: la pagina è un file solo, ma pesa circa 27 MB. Se serve più leggera, si ridimensionano
  (per esempio con Pillow), con un passo da aggiungere allo script.
- Le citazioni di `flavour.md` e `identikit.md` sono una lista a parte, non flavour: la scelta è mia, si può cambiare.

## 10. Domande per il proprietario

1. Per Spazienzio e Celestina, base.md S2 (la versione viva) dà valori diversi da bozza e griglia (HEALTH 100 contro 75 e
   70; TOXICITY 10 contro 15; capacità 3 contro 2). Vale la bozza, e base.md si aggiorna quando si cambia il vivo? Oppure
   serve decidere prima?
2. Nei testi di `OGG-09`, `OGG-10`, `OGG-11`, `GEN-20` e `SPA-AR4` i turni non tornano con i dati (vedi sez. 4, punto 3).
   Il testo conta il turno corrente? Quale numero è giusto per ciascuna carta?
3. Le 116 carte di bozza non hanno flavour né nome d'illustrazione in nessuna fonte. Li scrivi tu nella pagina, o c'è un
   documento da indicare?
4. Le intestazioni di `flavour.md` usano i nomi precedenti: lo aggiorno in un blocco a parte?
