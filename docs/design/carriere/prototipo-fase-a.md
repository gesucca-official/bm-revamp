# Carriere — prototipo CA-0a, proposta della Fase A

> Proposta dell'esecutore della Fase A, scritta l'11 novembre 2026 sul [documento del prototipo](prototipo.md). **In attesa della
> revisione della regia,** che decide le domande tecniche e porta al proprietario quelle di gusto e di scrittura
> ([fasi](prototipo.md#fasi)). Lo stato sta nella riga di CA-0a dei [lavori anticipati](../../product-roadmap.md#lavori-anticipati).
> Senza valore normativo. Nessun codice dell'interfaccia: in `prototipi/carriere/` c'è solo l'abbozzo del convertitore, con le sue prove.

## In breve

- **Una carriera è un file JSON generato dal markdown,** con nodi, achievement e sblocchi obbligatori. I personaggi, le espressioni e gli
  asset stanno in un **cast** condiviso, scritto dalla regia ([`dati/cast.json`](../../../prototipi/carriere/dati/cast.json)).
- **Un nodo è una tappa della mappa:** una sequenza di passi senza rami (battute, regia, partite, segni, sblocchi) che finisce con
  un'uscita. Gli archi sono l'uscita, le opzioni di una scelta e la sconfitta che apre un ramo.
- **Il markdown resta quello di oggi** ([formato delle scene](README.md#come-si-scrivono-le-scene)), più comandi brevi fra parentesi
  quadre (`[Segno: …]`, `[Sblocca: …]`, `[Entra: …]`) e poche frecce (`→ Vai a`, `→ Torna a`, `→ Fine`). `[Regia: …]` resta testo libero.
- **L'abbozzo regge sull'intero [tutorial-dialoghi.md](tutorial-dialoghi.md):** così com'è dà 6 nodi e 44 battute, con 14 errori che
  sono esattamente le informazioni che il testo non contiene ancora; con **19 righe aggiunte o ritoccate**, elencate sotto, dà un grafo
  valido senza errori.
- **La mini-carriera di prova** ha 7 nodi, a due rombi, e copre tutti i punti del perimetro; è già scritta nel formato
  ([`storie/prova.md`](../../../prototipi/carriere/storie/prova.md)) e si converte senza errori né avvisi.

## Il formato dei dati

### Principi

1. **Generato, non scritto a mano.** Il proprietario scrive markdown, il convertitore produce il JSON. Il JSON è il formato che resta
   (per CA-0, il client e un domani il server, che calcola gli achievement); il markdown è il modo di scriverlo.
2. **Il nodo è ciò che la mappa mostra.** Nel tutorial una scena con la sua partita è un nodo («Il trambusto»). Dentro il nodo non ci sono
   rami: le battute che dipendono da un segno sono passi con una condizione, non nodi a parte (contenuti lineari, non esponenziali,
   come vuole la [roadmap](../../product-roadmap.md#ca--carriera-single-player)).
3. **Niente linguaggio di scripting.** Condizioni fatte di segni, nodi visti, esiti delle partite e dati dell'account, unite da «e», «o» e
   «non».
4. **Il giro e l'account sono separati.** Segni, nodi visti e partite del giro si azzerano a un nuovo giro; nodi esplorati, sblocchi,
   achievement e giri completati restano (D16).
5. **I testi stanno nei dati,** con `{giocatore}` sostituito dal lettore. Ogni passo porta la `riga` del markdown da cui viene, così un
   errore o una battuta sul prototipo si ritrovano subito nel testo del proprietario.

### Schema

Lo schema leggibile sono i tipi di [`src/formato.ts`](../../../prototipi/carriere/src/formato.ts); in Fase B diventano anche un controllo di
validità con messaggi per percorso (domanda T1).

| Oggetto | Campi | Note |
|---|---|---|
| **Carriera** | `formato` (1), `id`, `titolo`, `fonte`, `inizio`, `obbligatori`, `nodi`, `achievement` | `obbligatori`: sblocchi che ogni percorso fino a una fine «completata» deve dare |
| **Nodo** | `id`, `etichetta`, `titolo`, `segreto?`, `condizione?`, `passi`, `uscita`, `riga` | `uscita`: `{verso: destinazione}` oppure `{scelta: true}` se il nodo finisce con una scelta |
| **Destinazione** | `{nodo, da?: 'scelta'}` oppure `{fine: 'completata' \| 'fallita'}` | `da: 'scelta'` rientra nel nodo saltando fino alla sua scelta: il ritorno alla scelta dell'epilogo |
| **Battuta** | `chi`, `nome?`, `espressione?`, `fuoriCampo?`, `testo`, `se?`, `stacchi?`, `interrotta?` | `nome` quando l'autore usa un alias («Un amico»); `stacchi`: chi ascolta, fra un pezzo e l'altro |
| **Narrazione, messaggio** | `testo`, `se?`; il messaggio ha `da?` | il messaggio è la notifica sul telefono |
| **Regia** | `nota` | testo libero dell'autore: non si legge, non fa nulla |
| **Sfondo, sprite, effetto, suono** | `sfondo` e `variante?`; `sprite`, `posa?`, `azione` (`entra`, `esce`, `posa`); `effetto` (`scossa`, `sfarfallio`); `suono` | il suono resta nei dati per CA-0, il prototipo non lo suona |
| **Segno, sblocco, achievement** | `segno` e `valore`; `sblocco`; `achievement` | dopo una partita valgono solo se la si vince |
| **Partita** | `id`, `modo` (`duello`, `ffa`), `giocatore`, `avversari`, `modificatori?`, `ritento?`, `sconfitta?` | `giocatore` e avversari sono un personaggio o un segno (`{segno: 'tutorial_con'}`); `{altriFra: […]}` è «tutti al tavolo tranne il giocatore»; senza `sconfitta` si ritenta |
| **Scelta** | `modo` (`muta`, `messaggio`), `domanda?`, `opzioni` | muta: con chi andare (D14, D16); messaggio: risposta scritta sul telefono |
| **Opzione** | `etichetta`, `chi?`, `se?`, `segni?`, `sblocchi?`, `verso?` | o tutte le opzioni hanno `verso` (la scelta chiude il nodo) o nessuna (lascia solo segni e la scena continua) |
| **Condizione** | `{segno, uguale?}`, `{visto}`, `{vinto}`, `{perso}`, `{esplorato}`, `{achievement}`, `{giri}`, `{non}`, `{tutti}`, `{uno}` | `visto`, `vinto`, `perso` valgono nel giro; `esplorato`, `achievement`, `giri` sull'account |
| **Achievement** | `id`, `titolo`, `descrizione`, `nascosto?`, `quando?`, `indizi` | lo dà un passo `[Achievement: …]` oppure la condizione `quando`; gli indizi sono progressivi: si mostra l'ultimo la cui condizione vale |

**Il cast** ([`dati/cast.json`](../../../prototipi/carriere/dati/cast.json)) non fa parte della carriera: per ogni personaggio nome, alias,
espressioni ammesse, velocità del testo e ritratto (`ritratti/mara-{espressione}.webp`); la combriccola è una figura in ombra con lo
sprite delle sagome; gli sfondi con le varianti e gli sprite con le pose e la scala (la combriccola a due terzi, come dice la
[specifica](specifica-asset.md#figure-in-ombra)). I percorsi sono relativi a `docs/design/carriere/asset/tutorial/`: gli asset non si copiano.
Il convertitore rifiuta personaggi, espressioni, sfondi, varianti, sprite e pose che il cast non conosce.

**Lo stato del giocatore** non sta nella carriera. Nel prototipo vive nel browser, per carriera:

- **giro:** nodo e passo correnti, segni, nodi visti, partite vinte e perse;
- **account:** nodi esplorati, sblocchi, achievement ottenuti, giri completati, e i segni dell'ultimo giro completato (servono alla
  principale per riusare `tutorial_con`, domanda T9).

### Esempio: le scene 0 e 1 del tutorial

Uscita dell'abbozzo sul tutorial con le integrazioni proposte (sotto), un passo per riga:

```json
{
  "formato": 1,
  "id": "tutorial",
  "titolo": "Tutorial",
  "fonte": "docs/design/carriere/tutorial-dialoghi.md",
  "inizio": "scena-0",
  "obbligatori": ["starter-mara", "starter-spazienzio", "carriera-principale"],
  "nodi": [
    {"id": "scena-0", "etichetta": "Scena 0", "titolo": "Davanti al bar", "riga": 21,
     "passi": [
       {"tipo": "sfondo", "sfondo": "S1", "riga": 23},
       {"tipo": "regia", "nota": "esterno di sera. l'insegna «BAR IL SERRAGLIO» sfarfalla; la combriccola, in ombra, esita sulla porta.", "riga": 23},
       {"tipo": "effetto", "effetto": "sfarfallio", "variante": "insegna-spenta", "riga": 25},
       {"tipo": "sprite", "sprite": "combriccola", "posa": "davanti-alla-porta", "azione": "entra", "riga": 25},
       {"tipo": "battuta", "chi": "combriccola", "nome": "Un amico", "testo": "...ma siamo sicuri che il posto sia questo?", "riga": 27},
       {"tipo": "battuta", "chi": "combriccola", "nome": "Un altro amico", "testo": "Sì, sull'insegna c'è scritto BAR. Dai, che fanno gli shottini a due euro.", "riga": 29},
       {"tipo": "battuta", "chi": "combriccola", "nome": "Un amico", "testo": "E ci sarà un motivo, no? Io non ci entro, ho paura di prendere il tetano.", "riga": 31},
       {"tipo": "battuta", "chi": "combriccola", "nome": "Un amico", "testo": "Dai, {giocatore}, digli qualcosa! Andiamo via e torniamo al Dimmi Di Sì a berci il nostro Virgin Cuba Libre a sedici euro.", "riga": 33},
       {"tipo": "regia", "nota": "frenata; Mara entra in bici e inchioda a un palmo dai piedi del giocatore.", "riga": 35},
       {"tipo": "suono", "suono": "frenata", "riga": 37},
       {"tipo": "sprite", "sprite": "bici-mara", "azione": "entra", "riga": 37},
       {"tipo": "effetto", "effetto": "scossa", "riga": 37},
       {"tipo": "battuta", "chi": "mara", "espressione": "agitata", "testo": "Tutti Navaho qua. Eccone altri, sempre pronti a tutto pur di non stare nella loro terra promessa.", "riga": 39},
       {"tipo": "regia", "nota": "la combriccola se la dà a gambe e lascia indietro il giocatore.", "riga": 41},
       {"tipo": "sprite", "sprite": "combriccola", "posa": "in-fuga", "azione": "esce", "riga": 43},
       {"tipo": "battuta", "chi": "mara", "espressione": "sospettosa", "testo": "Tu. Kebab tripla cipolla, triplo piccante. È tuo. Dimmi il codice... anzi, non importa: lo so io e lo sa il kebab.", "riga": 45},
       {"tipo": "battuta", "chi": "mara", "espressione": "sospettosa", "testo": "E scommetto che la mancia non me la vuoi dare. Ce l'hai scritto in faccia.", "riga": 47},
       {"tipo": "battuta", "chi": "mara", "espressione": "illuminata", "testo": "Aspetta. Quegli zigomi. Tu non sei Navaho, sei Sioux.", "riga": 49},
       {"tipo": "battuta", "chi": "mara", "espressione": "illuminata", "testo": "I Sioux non scappano dal Kazakistan con i contanti nascosti nelle suole delle scarpe, come i Navaho. I Sioux la mancia la lasciano sempre.", "riga": 51}
     ],
     "uscita": {"verso": {"nodo": "scena-1"}}},
    {"id": "scena-1", "etichetta": "Scena 1", "titolo": "Il trambusto", "riga": 54,
     "passi": [
       {"tipo": "regia", "nota": "dal bar un fracasso: vetri, una sedia, un urlo.", "riga": 56},
       {"tipo": "battuta", "chi": "mara", "espressione": "contenta", "testo": "Ah, allora non sei tu, Sioux della malora che non sei altro. Ho capito chi ha ordinato questo kebab. Vieni, andiamo a portarglielo.", "riga": 58},
       {"tipo": "regia", "nota": "Mara trascina dentro il giocatore per la manica. Sfondo: S2, interno del bar. Spazienzio rovescia un tavolino; lo schermo trema.", "riga": 61},
       {"tipo": "sfondo", "sfondo": "S2", "riga": 61},
       {"tipo": "effetto", "effetto": "scossa", "riga": 63},
       {"tipo": "battuta", "chi": "spazienzio", "espressione": "furioso", "testo": "UCCIDIAMOTI...! UCCIDIAMOTI, HO DETTO! FERMI, LASCIATEVI CAROTARE... AAARGH!", "riga": 65},
       {"tipo": "battuta", "chi": "spazienzio", "espressione": "fumante", "testo": "E VOI CHI SIETE? FACCE NUOVE. ODIO LE FACCE NUOVE.", "riga": 67},
       {"tipo": "battuta", "chi": "spazienzio", "espressione": "fumante", "testo": "ODIO ANCHE QUELLE VECCHIE. UCCIDIAMOVI ORDUNQUE.", "riga": 69},
       {"tipo": "battuta", "chi": "mara", "espressione": "neutra", "testo": "Lui è Spazienzio. Ha finito la pazienza nel 2019, e da allora non gli è più tornata.", "riga": 71},
       {"tipo": "battuta", "chi": "mara", "espressione": "contenta", "testo": "Tieni il kebab. No, tienilo e basta. A lui ci penso io.", "riga": 73},
       {"tipo": "partita", "id": "partita-1", "modo": "duello", "giocatore": {"personaggio": "mara"}, "avversari": [{"personaggio": "spazienzio"}],
        "ritento": [
          {"tipo": "battuta", "chi": "mara", "espressione": "agitata", "testo": "Di nuovo. Più veloce, o il suo kebab si fredda.", "riga": 77},
          {"tipo": "battuta", "chi": "spazienzio", "espressione": "fumante", "testo": "ANCORA VOI? ANNICHILIAMOVI.", "riga": 77}],
        "riga": 75},
       {"tipo": "sblocco", "sblocco": "starter-mara", "riga": 79}
     ],
     "uscita": {"verso": {"nodo": "scena-2"}}}
  ],
  "achievement": [
    {"id": "amici-del-dimmi-di-si", "titolo": "Amici del Dimmi Di Sì", "nascosto": true,
     "descrizione": "Hai preferito un Virgin Cuba Libre a sedici euro.",
     "indizi": [
       {"testo": "Certi amici scrivono sempre al momento sbagliato."},
       {"testo": "E se alla combriccola rispondessi come vorrebbe lei?", "se": {"esplorato": "scena-4"}}]}
  ]
}
```

Il resto del tutorial, in breve: la scena 3 ha la scelta muta con `segni: {tutorial_con: mara | spazienzio}`, le due battute di reazione
con `se: {segno: 'tutorial_con', uguale: …}` e la partita `{modo: 'ffa', giocatore: {segno: 'tutorial_con'}, avversari: {altriFra: ['mara',
'spazienzio', 'piera']}}`; la scena 4 finisce con la scelta `messaggio`, una risposta verso l'epilogo e l'altra verso `{fine:
'completata'}` con `sblocchi: ['carriera-principale']`; l'epilogo dà l'achievement e torna a `{nodo: 'scena-4', da: 'scelta'}`.

### Esempio: i nodi della mini-carriera

Tre dei sette nodi, quelli con la sconfitta che apre un ramo, il segno che cambia le battute e il nodo segreto
(gli altri sono nella [mini-carriera](#la-mini-carriera-di-prova)):

```json
{"id": "nodo-c", "etichetta": "Nodo C", "titolo": "In cucina", "riga": 43,
 "passi": [
   {"tipo": "sfondo", "sfondo": "S2", "riga": 45},
   {"tipo": "battuta", "chi": "spazienzio", "espressione": "furioso", "testo": "IL CANE È FINITO NEL KEBAB! LO SAPEVO! RESTITUIAMOLO!", "riga": 47},
   {"tipo": "battuta", "chi": "mara", "espressione": "agitata", "testo": "Ma che dici? Il kebab è di pollo. Credo.", "riga": 49},
   {"tipo": "partita", "id": "partita-2", "modo": "duello", "giocatore": {"personaggio": "spazienzio"}, "avversari": [{"personaggio": "mara"}],
    "ritento": [{"tipo": "battuta", "chi": "spazienzio", "espressione": "furioso", "testo": "STAVOLTA LA CONSEGNIAMO NOI.", "riga": 55}],
    "sconfitta": {"nodo": "nodo-e"}, "riga": 51}
 ],
 "uscita": {"verso": {"nodo": "nodo-d"}}}

{"id": "nodo-d", "etichetta": "Nodo D", "titolo": "Di nuovo al bancone", "riga": 59,
 "passi": [
   {"tipo": "sfondo", "sfondo": "S2", "variante": "disordine", "riga": 61},
   {"tipo": "battuta", "chi": "piera", "espressione": "contenta", "testo": "Mara... che porta sempre... il cibo... e adesso... anche le notizie...", "se": {"segno": "alleato", "uguale": "mara"}, "riga": 63},
   {"tipo": "battuta", "chi": "piera", "espressione": "offesa", "testo": "Te... che urli... al mio Grappino... da quando era... piccolo così...", "se": {"segno": "alleato", "uguale": "spazienzio"}, "riga": 65},
   {"tipo": "battuta", "chi": "piera", "espressione": "brilla", "testo": "Basta... adesso... ci penso io...", "riga": 67},
   {"tipo": "partita", "id": "partita-3", "modo": "duello", "giocatore": {"personaggio": "piera"}, "avversari": [{"segno": "alleato"}],
    "ritento": [{"tipo": "battuta", "chi": "piera", "espressione": "assonnata", "testo": "Aspetta... che mi siedo... e riproviamo...", "riga": 71}], "riga": 69},
   {"tipo": "sblocco", "sblocco": "starter-piera", "riga": 73},
   {"tipo": "scelta", "modo": "muta", "domanda": "con chi continui a cercare?", "riga": 75,
    "opzioni": [
      {"etichetta": "con Piera", "chi": "piera", "verso": {"nodo": "nodo-g"}},
      {"etichetta": "con Spazienzio, che fiuta qualcosa", "chi": "spazienzio", "se": {"visto": "nodo-e"}, "verso": {"nodo": "nodo-f"}}]}
 ],
 "uscita": {"scelta": true}}

{"id": "nodo-f", "etichetta": "Nodo F", "titolo": "Il vicolo", "segreto": true, "riga": 92,
 "passi": [
   {"tipo": "sfondo", "sfondo": "S1", "variante": "insegna-spenta", "riga": 96},
   {"tipo": "regia", "nota": "il vicolo dietro il bar.", "riga": 96},
   {"tipo": "sprite", "sprite": "grappino", "posa": "russa", "azione": "entra", "riga": 98},
   {"tipo": "battuta", "chi": "spazienzio", "espressione": "soddisfatto", "testo": "ECCOLO. DORME SUI CARTONI. SVEGLIAMOLO A CALCI.", "riga": 100},
   {"tipo": "battuta", "chi": "spazienzio", "espressione": "quasi-calmo", "testo": "...NO. LASCIAMOLO DORMIRE. PER STAVOLTA.", "riga": 102},
   {"tipo": "achievement", "achievement": "fiuto-da-segugio", "riga": 104}
 ],
 "uscita": {"verso": {"nodo": "nodo-g"}}}
```

## Come si scrive nel markdown

### Cosa resta com'è

Tutto il [formato delle scene](README.md#come-si-scrivono-le-scene): `**Nome** (espressione): testo`, `*corsivo*` per la narrazione,
`*«…»*` per il messaggio sul telefono, `[Regia: …]` libero, `[Sfondo: S1, …]`, `[Se segno x = v] battuta`, `→ Partita N: X (giocatore)
contro Y`, `**Ritento.** battuta · battuta`, `→ Scelta muta: …`, `→ Scelta: …` con le risposte in elenco. Il convertitore li legge come
sono, anche quando `Sfondo: S2` sta dentro un `[Regia: …]` o la variante è detta a parole («S2 con lo strato del disordine»).

### Pezzi nuovi

Regola generale: **un comando è una parola fra parentesi quadre,** `[Parola]` o `[Parola: argomenti]`, da solo nel suo paragrafo
(anche più d'uno di fila). Le parole sono un elenco chiuso: una parola sconosciuta è un errore con il numero di riga, così un errore di
battitura non sparisce. Un testo che non è né battuta né comando resta come nota dell'autore, con un avviso.

| Pezzo | Come si scrive | Esempio |
|---|---|---|
| **Carriera** | nel preambolo, prima della prima scena | `[Carriera: tutorial; obbligatori: starter-mara, starter-spazienzio, carriera-principale]` |
| **Nodo** | un titolo `## Etichetta — Titolo`; l'etichetta dà l'id, il titolo va sulla mappa. I `##` senza « — » (per esempio «Note per la revisione») sono ignorati | `## Scena 1 — Il trambusto`, `## Nodo F — Il vicolo` |
| **Opzioni del nodo** | subito sotto il titolo | `[Nodo: segreto]`, `[Nodo: se visto Nodo E]` |
| **Arco al nodo seguente** | implicito: un nodo senza uscita prosegue nel nodo che lo segue nel file | il tutorial lineare non ha bisogno di frecce |
| **Altri archi** | una freccia alla fine del nodo; i nodi si citano per etichetta o per titolo | `→ Vai a: Nodo D`, `→ Torna a: Scena 4, scelta`, `→ Fine: completata` |
| **Scelta muta** | opzioni sulla stessa riga separate da « · », o in elenco sotto; ogni opzione può lasciare segni, dare sblocchi, avere una condizione e una destinazione; dopo la destinazione, « — commento» libero | `→ Scelta muta: con Mara [Segno: tutorial_con = mara] · con Spazienzio [Segno: tutorial_con = spazienzio]` |
| **Risposta sul telefono** | `→ Scelta: domanda`, poi le risposte in elenco fra `*«…»*` | `- *«Me la sono cavata per un pelo, arrivo.»* → Epilogo del fallimento — il tutorial fallisce` |
| **Segno** | come passo, o su un'opzione; senza valore vale «sì» | `[Segno: alleato = mara]` |
| **Condizione** | `[Se …]` davanti a una battuta, una narrazione o un messaggio; su un'opzione; su un nodo. Atomi: `segno x = v`, `segno x`, `visto N`, `vinto N`, `perso N`, `esplorato N`, `achievement A`, `giri n`; `non` davanti a un atomo; `e` lega più di `o`; niente parentesi | `[Se segno alleato = mara e non visto Nodo F]` |
| **Partita** | la forma di oggi; `{segno}` per il personaggio scritto in un segno; «gli altri fra …» per la FFA in cui il giocatore è uno dei tre; due avversari o più fanno una FFA | `→ Partita 3: {tutorial_con} (giocatore) contro gli altri fra Mara, Spazienzio e Piera` |
| **Sconfitta che apre un ramo** | subito dopo la partita; senza, si ritenta | `[Sconfitta: → Nodo E]` |
| **Modificatori di incontro** | subito dopo la partita; il prototipo li mostra soltanto | `[Modificatori: mazzi-accorciati]` |
| **Sblocco** | come passo; dopo una partita vale solo se la si vince. Id: `starter-<personaggio>`, `pvp`, `carriera-<id>` | `[Sblocca: starter-mara]` |
| **Achievement** | dato da un passo, o da una condizione nella sua definizione | `[Achievement: Fiuto da segugio]` |
| **Definizione degli achievement** | sezione `## Achievement`, un `###` per ciascuno: descrizione in una riga, `[Nascosto]`, `[Quando: …]`, indizi in elenco, dal più vago al più chiaro | vedi sotto |

```markdown
## Achievement

### Fiuto da segugio

[Nascosto]

Hai trovato Grappino nel vicolo.

- Indizio: Certe sconfitte portano lontano.
- Indizio, se giri 1: Quando Spazienzio perde, va a calmarsi nel retrobottega. E il retrobottega puzza di cane.
```

**Comandi per il lettore di scene,** accanto al `[Regia: …]` libero che li descrive: `[Sfondo: S2 disordine]` (variante dopo l'id),
`[Entra: bici-mara]`, `[Esce: combriccola in fuga]`, `[Sprite: grappino ringhia]` (cambia posa), `[Scossa]`,
`[Sfarfallio: insegna-spenta]` (alterna lo sfondo con la variante), `[Stacchi: Mara neutra, Spazienzio quasi calmo]` e `[Interrotta]`
(sulla battuta appena prima: arriva a pezzi, con gli stacchi su chi ascolta, e la battuta dopo entra prima che finisca),
`[Telefono: combriccola]` (chi scrive il messaggio che segue), `[Suono: frenata]` (tenuto per CA-0), `(fuori campo)` al posto
dell'espressione per una voce senza ritratto.

### La prova sul tutorial

L'abbozzo ([`src/converti.ts`](../../../prototipi/carriere/src/converti.ts)) legge
[tutorial-dialoghi.md](tutorial-dialoghi.md) così com'è: 6 nodi, 44 battute, 2 partite riconosciute su 3, 17 note di regia. I 14
errori sono le informazioni che il testo oggi non dice:

| Mancanza | Righe |
|---|---|
| La partita 3 a parole («tutti contro tutti a tre, col personaggio scelto»), quindi anche il suo ritento senza partita | 138, 140 |
| La scelta muta non dice quale segno lascia: `tutorial_con` è letto ma mai assegnato | 134, 136 |
| Le due risposte alla combriccola hanno per destinazione una frase | 168, 169 |
| L'epilogo non ha uscita, quindi non si raggiunge nessuna fine: vicoli ciechi a catena e epilogo irraggiungibile | 19–172 |

Più gli avvisi: nessun `[Carriera: …]` e due paragrafi liberi nell'epilogo («da scrivere»). Con le **19 integrazioni** di
[`tests/integrazioni-tutorial.ts`](../../../prototipi/carriere/tests/integrazioni-tutorial.ts), applicate in memoria, il risultato è 6
nodi, 44 battute, 6 di ritento, 3 partite, 2 scelte, 1 achievement, **0 errori** e i 2 avvisi dei paragrafi «da scrivere». Le integrazioni:

| Cosa | Quante | Esempio |
|---|---|---|
| Carriera e sblocchi obbligatori | 1 | `[Carriera: tutorial; obbligatori: …]` prima della scena 0 |
| Starter alle vittorie delle partite 1 e 2 (D18) | 2 | `[Sblocca: starter-mara]` dopo il ritento della partita 1 |
| Segno della scelta muta e partita 3 | 2 | le due righe della tabella sopra |
| Destinazioni delle risposte e sblocco della principale | 2 | `→ Fine: completata [Sblocca: carriera-principale] — il giocatore resta nel bar: …` (il commento di oggi resta) |
| Epilogo: achievement nascosto (D19), ritorno alla scelta, definizione con due indizi | 1 blocco | testi segnaposto della regia (domanda P6) |
| Comandi per il lettore di scene | 11 | sfarfallio e combriccola, bici e scossa, combriccola in fuga, scossa del tavolino, Grappino che entra, ringhia e russa, stacchi e interruzioni di Piera (due volte), Mara che interrompe Piera, chi scrive sul telefono |

In Fase B, con il via del proprietario (domanda P1), le integrazioni entrano in [tutorial-dialoghi.md](tutorial-dialoghi.md) e il file
delle integrazioni si cancella.

**Limiti noti dell'abbozzo,** da chiudere o accettare in Fase B: la condizione `[Se …]` vale per battute, narrazioni e messaggi, non per i
comandi di regia (non è servita); gli stacchi usano «neutra» e «quasi calmo» perché le espressioni d'ascolto non esistono
([illustrazioni](illustrazioni.md#ritratti-e-sprite)); il controllo del grafo dell'abbozzo ignora le condizioni (sotto, «Verifiche»).

## La mini-carriera di prova

**«Dov'è Grappino?»**, in [`storie/prova.md`](../../../prototipi/carriere/storie/prova.md): Grappino è sparito, Mara e Spazienzio si offrono
di cercarlo. Battute segnaposto della regia, solo asset del tutorial, sette nodi a due rombi.

```text
                       ┌──► B  Sulle tracce in bici ─────────┐
                       │    Mara contro Spazienzio           │
 A  Il bancone vuoto ──┤                                     ├──► D  Di nuovo al bancone ──┬──────────────────────► G  Grappino è tornato ──► fine
    scelta muta:       │                                     │    Piera contro {alleato}   │                             ▲
    [Segno: alleato]   └──► C  In cucina ──── vittoria ──────┤    [Sblocca: starter-piera] └── se visto E ──► F  ???  ──┘
                            Spazienzio contro Mara           │                                                Il vicolo
                                 │ sconfitta                 │                                                (segreto)
                                 └──► E  Il retrobottega ────┘
```

| Nodo | Cosa succede | Cosa dimostra |
|---|---|---|
| **A** Il bancone vuoto | Piera piange il cane, a pezzi, con gli stacchi su Mara e Spazienzio; scelta muta: con Mara o con Spazienzio | Scena con ritratti e regia di Piera; **rami che si dividono**; **una scelta che ne esclude un'altra** (in questo giro B o C); un **segno** (`alleato`) |
| **B** Sulle tracce in bici | All'esterno, con la bici; duello Mara contro Spazienzio | Sfondo S1 e sprite; partita simulata con ritento normale |
| **C** In cucina | Spazienzio è convinto che il cane sia nel kebab; duello Spazienzio contro Mara | **Una sconfitta che apre un ramo** (verso E) invece di fermare |
| **E** Il retrobottega | Spazienzio va a «essere calmo» e sente puzza di cane bagnato | Nodo che esiste solo dopo una sconfitta; narrazione in corsivo; si ricongiunge in D |
| **D** Di nuovo al bancone | Piera reagisce in modo diverso secondo `alleato`, poi gioca lei contro chi ti ha accompagnato | **Rami che si riuniscono**; **un segno che cambia una battuta più avanti**; un segno come avversario (alleati e avversari si scambiano i ruoli); **uno sblocco presente su ogni percorso** (`starter-piera`, D18); una scelta con un'opzione che compare solo se si è visto E |
| **F** Il vicolo | Grappino dorme sui cartoni | **Un nodo segreto raggiungibile solo da un certo percorso** (A→C, sconfitta, E, D); variante di sfondo; achievement dato da un passo |
| **G** Grappino è tornato | Battute diverse se si è passati dal vicolo e secondo `alleato` | Secondo rombo che si chiude; condizioni `visto` e `non visto`; fine completata |

**Achievement:** *Fiuto da segugio*, nascosto, con un indizio vago subito e uno chiaro dopo il primo giro completato; *Due padroni*,
visibile, che si ottiene esplorando B e C in due giri diversi (**rigiocabilità**: un giro solo non basta).

**Percorsi:** A-B-D-G; A-C-D-G; A-C (sconfitta) -E-D-G; A-C (sconfitta) -E-D-F-G. Lo sblocco obbligatorio è su tutti; il nodo segreto
solo sull'ultimo. Le prove dell'abbozzo controllano già che spostando `[Sblocca: starter-piera]` in B, o in C dopo la partita (dove la
sconfitta lo salta), il convertitore dica «sblocco obbligatorio non presente su ogni percorso».

**Copertura del perimetro** ([prototipo](prototipo.md#perimetro)): formato e controllo dello schema (1) in tutti i nodi; convertitore
(2) sul tutorial e qui; lettore di scene (3) con i nodi A, B, F e il tutorial intero; mappa (4) con i due rombi, F segreto e il nuovo
giro; partite simulate (5) in B, C, D; i sette punti della mini-carriera (6) nella tabella; controllo del grafo (7) su tutte e due.

## Le schermate

Misure di prova come nella [specifica](specifica-asset.md#come-appare-la-scena): **orizzontale 1366×768, verticale 390×844**. Nessuna
rifinitura grafica: componenti React semplici, colori del tavolo di C4 dove viene comodo.

**Flusso:** elenco → mappa → nodo (scena, scelte, partite) → mappa → … → fine del giro → mappa o nuovo giro. Dentro un nodo la scena
scorre da sola fra un passo interattivo e l'altro; alla fine del nodo si torna alla mappa, con il nodo seguente già acceso.

| Schermata | Cosa si vede | Orizzontale | Verticale |
|---|---|---|---|
| **Elenco** | Le due carriere (tutorial, prova), con stato del giro, giri completati, nodi esplorati (i segreti non contano finché non si trovano) e achievement; «Continua», «Nuovo giro», «Achievement»; «Azzera tutto» per le prove | Due schede affiancate | Schede in colonna |
| **Mappa dei rami** | I nodi come schede, con gli archi: **corrente**; **fatto in questo giro**; **disponibile** (acceso, si tocca per entrare); **esplorato in un giro passato** (titolo visibile, spento); **escluso in questo giro** (una scelta l'ha chiuso, barrato); **«???»** mai visto, al suo posto; **segreto mai visto**, assente. In alto carriera, giro, sblocchi presi; «Nuovo giro» | Da sinistra a destra, colonne per profondità, pannello del nodo scelto a destra | Dall'alto in basso, scorre in verticale; pannello del nodo in un foglio in basso |
| **Scena** | Sfondo con variante, sprite, un ritratto alla volta, finestra di dialogo con nome e testo che scorre alla velocità del personaggio; `{giocatore}` sostituito; stacchi su chi ascolta, interruzioni, scossa, sfarfallio; fuori campo senza ritratto; figura in ombra per la combriccola. Tocco: completa il testo, poi avanza; «Salta» porta al prossimo passo interattivo; «Salta scena» sempre visibile, in evidenza nei nodi già visti | Finestra in basso al 28% dell'altezza, ritratto a sinistra del centro all'85% | Finestra al 30%, ritratto centrato al 60%, sfondo ritagliato sulla striscia centrale |
| **Notifica sul telefono** | Il messaggio della combriccola sopra la scena, con il mittente | Riquadro in alto a destra | Banner in alto |
| **Scelta muta** | Chi si offre, con ritratto e nome («con Mara», «con Spazienzio»), la domanda se c'è; le opzioni nascoste dalla condizione non si vedono | Due o tre schede affiancate sopra la scena | Schede impilate |
| **Risposta sul telefono** | Il telefono con il messaggio ricevuto e le risposte come fumetti da toccare | Telefono al centro | Telefono a tutto schermo |
| **Partita simulata** | Al posto del tavolo: chi gioca per il giocatore (ritratto), contro chi, duello o FFA, modificatori, cosa sblocca alla prima vittoria; «Vinci» e «Perdi» | Giocatore a sinistra, avversari a destra | In colonna |
| **Dopo la partita** | Vittoria: gli sblocchi nuovi, poi la scena riprende. Sconfitta: «Ritenta» con le battute di ritento saltabili; se la sconfitta apre un ramo, anche «Prendi l'altra strada» (domanda P3) | Riquadro al centro | Foglio in basso |
| **Fine del giro** | Esito, sblocchi e achievement nuovi, nodi esplorati sul totale visibile; «Nuovo giro», «Mappa», «Elenco». Nel tutorial la risposta sbagliata non è una fine: epilogo, achievement e ritorno alla scelta | Riquadro al centro | A tutto schermo |
| **Achievement** | Ottenuti (titolo, descrizione); visibili non ottenuti (titolo e indizio attuale); nascosti («???» e l'indizio, se ne è arrivato uno) | Elenco su due colonne | Elenco |
| **Stato (per le prove)** | Pannello a scomparsa: segni del giro, nodi visti, partite vinte e perse, dati dell'account | Laterale | Foglio in basso |

## Installazione, avvio e verifiche

### Cartella

```text
prototipi/carriere/
  run.ps1                Install, Test, Convert, Check, Build, Dev, Phone, Shots
  package.json           stesse versioni di client-web; package-lock.json derivato (sotto)
  .gitignore             node_modules/, dist/, dati/generati/
  dati/cast.json         cast condiviso (c'è già)
  storie/prova.md        la mini-carriera (c'è già); il tutorial si legge da docs/design/carriere/
  src/formato.ts         tipi (c'è già) e controllo di validità
  src/converti.ts        convertitore (abbozzo già presente)
  src/grafo.ts           controllo del grafo
  src/stato.ts           giro, account, condizioni, salvataggio nel browser
  src/ui/                React: elenco, mappa, scena, scelte, partita, fine, achievement
  strumenti/             converti.ts e controlla.ts da riga di comando
  tests/                 node --test
```

### Dipendenze e avvio

- **Stesso Node e stesse versioni di client-web:** Node 24.13.0 e npm 11.6.2 da `.tools/client-c0` (`./client-c0/run.ps1 -Task Bootstrap`
  se manca), React e React DOM 19.3.1, TypeScript 5.9.3, Vite 8.3.5, `@types/react` e `@types/react-dom` 19.3.0; per le catture
  `@playwright/test` 1.56.1. Nessuna libreria in più: niente router, niente librerie di grafi o di schemi.
- **Senza rete, dalla cache di npm:** provato in una cartella temporanea. La cache di `.tools/client-c0/npm-cache` ha i pacchetti ma non i
  loro metadati, quindi `npm install --offline` per creare il lock fallisce (`ENOTCACHED`). Funziona invece un lock **derivato da quello
  di client-web** (la chiusura delle dipendenze scelte, 47 voci), con `npm ci --offline`: 22 pacchetti in 5 s, 25 con Playwright. In Fase B
  il lock derivato si committa, insieme al piccolo script che lo rigenera (domanda T3).
- **`run.ps1`** sul modello di quello di client-web (stesso Node in testa al `PATH`, stessa cache): `Install [-Offline]` (`npm ci`),
  `Test` (`node --experimental-strip-types --test tests/*.test.ts`), `Convert` (tutorial e prova in `dati/generati/`), `Check` (controllo
  del grafo su tutti e due, esce con 1 se ci sono errori), `Build` (`Convert`, `tsc --noEmit`, `vite build`), `Dev` (`Convert` e Vite su
  `127.0.0.1:4330`, lontano da 4320 e 4200), `Phone` (come `Physical` di client-web: un indirizzo privato della rete locale, domanda T5),
  `Shots` (catture Playwright, sotto).
- **Asset letti dal posto:** `import.meta.glob` su `docs/design/carriere/asset/tutorial/{ritratti,sfondi,sprite}/*.webp` e `server.fs.allow`
  su quella cartella; la build include solo i file usati, mai `originali/` o `composizioni/`.
- **Progresso** in `localStorage`, una chiave per carriera con giro e account separati, e la versione del formato nella chiave.

### Verifiche della Fase B

1. `./prototipi/carriere/run.ps1 -Task Install -Offline`, poi `Test`, `Check`, `Build`.
2. **Prove unitarie** (`node --test`): convertitore (ogni comando, ogni errore con la sua riga, il tutorial senza e con le
   integrazioni, la prova); controllo di validità (un esempio valido e uno rotto per ogni oggetto); valutazione delle condizioni; stato
   del giro e dell'account (nuovo giro che azzera la storia e conserva il resto); controllo del grafo su difetti costruiti apposta.
3. **Controllo del grafo,** come `check-rules.py`, per esplorazione degli stati raggiungibili (nodo, segni, visti, esiti), con le
   condizioni valutate davvero e gli atomi dell'account liberi (veri e falsi), con un tetto agli stati (domanda T6): ogni nodo
   raggiungibile; nessun vicolo cieco; ogni scelta con almeno un'opzione visibile; gli sblocchi obbligatori su ogni percorso fino a una
   fine completata; ogni nodo segreto e ogni achievement con almeno un percorso; ogni segno letto anche scritto. L'abbozzo di oggi fa già
   i controlli strutturali ignorando le condizioni.
4. **Mutazioni,** 3–8 sulla logica con rami (condizioni, esplorazione, stati della mappa), ognuna deve far fallire almeno una prova. Sull'abbozzo
   ne ho provate quattro (sconfitta che porta tutti gli sblocchi del nodo, precedenza di «e» e «o», scelta che non chiude il nodo, valore di
   un segno non controllato): ognuna fa fallire una prova.
5. **Catture** con `Shots`: elenco, mappa (a metà di un giro e con F trovato), scena 0 del tutorial con la combriccola, scena 2 con gli
   stacchi di Piera, scelta muta, risposta sul telefono, partita simulata, sconfitta che apre un ramo, fine del giro, achievement; a 1366×768
   e 390×844. Ricompresse, entro i 3 MB del contratto.
6. `python scripts/check-links.py`, `python scripts/check-rules.py`, `git diff --check`. Le verifiche di client-web e del server non servono,
   perché il blocco non tocca quei file (domanda T8).
7. **Giudizio del proprietario** sul prototipo usato, su PC e sul telefono ([cosa giudica](prototipo.md#cosa-giudica-il-proprietario)).

### Cosa c'è già e come si prova

```powershell
$env:Path = "$PWD\.tools\client-c0\node-v24.13.0-win-x64;$env:Path"
node --experimental-strip-types --test prototipi/carriere/tests/converti.test.ts
node --experimental-strip-types prototipi/carriere/strumenti/converti.ts docs/design/carriere/tutorial-dialoghi.md --integrazioni --json $env:TEMP\tutorial.json
node --experimental-strip-types prototipi/carriere/strumenti/converti.ts prototipi/carriere/storie/prova.md
```

Sette prove verdi; `tsc --strict` pulito su `src/` (con il TypeScript 5.9.3 installato nella prova temporanea, non nel repository).

## Scelte principali e alternative scartate

1. **Nodo = tappa della mappa con passi lineari.** Scartati un nodo per scena e uno per partita (la mappa del tutorial avrebbe nove
   caselle e il grafo raddoppierebbe) e i rami dentro le scene (D14: niente dialoghi a rami).
2. **Comandi fra parentesi quadre con un vocabolario chiuso,** accanto al `[Regia: …]` libero. Scartati il front matter YAML e i blocchi di
   codice nel markdown (scomodi da scrivere e da leggere) e l'interpretazione della regia libera (fragile).
3. **Archi impliciti al nodo seguente.** Il tutorial lineare non cambia; le frecce servono solo dove la storia salta.
4. **Condizioni come brevi frasi** senza parentesi. Scartate le espressioni libere e lo scripting, contro CA-0.
5. **Sblocchi e achievement come passi:** la loro posizione dice quando arrivano (dopo una partita, solo alla vittoria). Scartato un campo
   «ricompense» separato, che duplica la posizione.
6. **Sconfitta come attributo della partita** (`[Sconfitta: → Nodo E]`), con il ritento come regola. Scartato un nodo «sconfitta» a parte.
7. **Cast condiviso in JSON, della regia.** Scartati il cast dentro ogni carriera (ripetuto) e nel markdown del proprietario (non gli serve).
8. **JSON come formato dei dati.** Scartati TypeScript (lo leggerebbe solo il client) e YAML (una dipendenza in più).
9. **Personaggio da un segno** (`{tutorial_con}`): la partita a tre e il duello di D funzionano senza duplicare il nodo.
10. **Riferimenti ai nodi per etichetta o per titolo** («Scena 4», «Epilogo del fallimento»), niente id da imparare.

## Domande

**Tecniche, per la regia:**

1. **T1. Schema:** tipi TypeScript con un controllo di validità scritto a mano nel prototipo (proposta), e un JSON Schema solo in CA-0,
   quando servirà anche al server? Oppure il JSON Schema subito, con un validatore minimo.
2. **T2. Dati generati** in `dati/generati/`, ignorati da git e rigenerati da `Convert` prima di `Dev`, `Build` e `Test` (proposta)? Oppure
   committati, per vedere il diff dei dati a ogni cambio del markdown.
3. **T3. Lock derivato** da quello di client-web, con lo script che lo rigenera committato in `prototipi/carriere/strumenti/`: va bene?
4. **T4. Playwright** per le catture (una dipendenza in più, dalla cache) o catture fatte a mano?
5. **T5. Telefono:** `Phone` serve file statici e asset del repository su un indirizzo privato; basta questo o si riusa il codice d'accesso di
   `Physical`?
6. **T6. Controllo del grafo** per esplorazione degli stati, con atomi dell'account liberi e un tetto (proposta: 200 000 stati, poi errore)?
7. **T7. Rapporto della Fase B:** in `docs/design/carriere/prototipo-fase-b.md`, accanto a questa proposta?
8. **T8. Verifiche di client-web e del server** dichiarate non pertinenti, perché il blocco non tocca quei file?
9. **T9. Segni fra carriere** (`tutorial_con` riusato dalla principale): salvati per carriera all'ultimo giro completato e letti come
   `segno tutorial.tutorial_con`. Fuori dal prototipo; da fissare in CA-0 o già nel formato?

**Di gusto e di scrittura, per il proprietario:**

1. **P1.** I comandi per il lettore (`[Entra: bici-mara]`, `[Scossa]`, `[Sblocca: starter-mara]`…) sono righe brevi accanto alla tua
   `[Regia: …]`, che resta com'è. Va bene che in Fase B la regia aggiunga nel tuo tutorial-dialoghi.md le 19 righe proposte?
2. **P2. Ritento:** le due battute separate da «·» si dicono tutte e due a ogni ritento, in ordine (proposta), o una per volta, alternandole?
3. **P3. Sconfitta che apre un ramo:** dopo la sconfitta scegli tu fra «Ritenta» e l'altra strada (proposta), o l'altra strada parte da sola?
4. **P4. La scelta «con chi andare»** si fa nella scena, con i ritratti di chi si offre (proposta), o sulla mappa?
5. **P5. Mappa:** nodi mai visti come «???» al loro posto e nodi segreti invisibili finché non li trovi; ti torna?
6. **P6. Testi segnaposto:** l'achievement del tutorial («Amici del Dimmi Di Sì», con due indizi) e le battute della mini-carriera sono
   della regia. Li scrivi tu, o per il prototipo vanno bene questi?
7. **P7. La mini-carriera** «Dov'è Grappino?» dimostra quello che ti serve vedere, o manca qualcosa (per esempio una seconda fine)?
8. **P8. Stacchi di Piera:** per chi ascolta bastano «neutra» e «quasi calmo», o vuoi vedere sul prototipo che servono espressioni
   d'ascolto apposta?
