# C4-11 — Spazio e profondità: Fase A (proposta)

9 novembre 2026. Base `f706a4e` su main («C4: record the owner's approval of C4-10 and C4-7»), checkout pulito alla partenza, dopo il
pull dal remoto. **Fase A pronta, in attesa della scelta del proprietario. Fase B non avviata.** Nessun codice di prodotto cambiato: i
prototipi sono una patch fuori dal prodotto ([`prototipo.patch`](prototipo.patch), vedi [come provarli](#come-provare-i-prototipi-dal-vivo)).

Fonti: [piano, C4-11](../../../client-c4-plan.md#c4-11--spazio-e-profondità), regole di non regressione 1–9, 16, 17, 18, riga C4-11 della
matrice, D6, D9, D11, D13, D15 del [piano](../../../client-c4-plan.md#decisioni-del-proprietario); [O28](../../../client-roadmap.md#osservazioni-registrate-durante-c4);
[C4-10 Fase A, Fase B, prova e destinazioni](../../../reports/client-c4-report.md#c4-10--fase-a); [proposta di C4-10](../guida/proposta.md) come
modello; regole audio approvate in [proposta-colpi.md](../audio/proposta-colpi.md) e [proposta-esito.md](../audio/proposta-esito.md).

**Obiettivo (D15).** Prova del proprietario del 7 novembre 2026: «il gioco sugli schermi piccoli è affollato, mentre sugli schermi grandi è
un po' spoglio»; «il gioco manca di tridimensionalità». Più due destinazioni dalla prova di C4-10: il rosso di `VerifyAim` a 844×390 e il
jingle d'esito troncato da un ridimensionamento.

## In breve

| Tema | Raccomandazione | Perché |
|---|---|---|
| a) Schermi piccoli | **a1 + a2**: cornice leggera (titolo tolto dal tavolo compatto, oggetti di scena attenuati, posto vuoto degli scarti non disegnato) e carte del round in un'unica pila | Nessuna funzione tolta, nessun fattore che scende; le carte del round a 844 FFA crescono da 36 a 60 px e diventano leggibili; a 750×292 un problema in meno |
| b) Schermi grandi | **b1** (le misure crescono con l'altezza oltre gli 800 px), senza b2 | A 1920×1080 il vuoto scende dal 64–70% al 44–52%; identico a 1366×768 e sotto |
| c) Profondità | **c1** (ombre morbide, carta sollevata che «stacca»); c2 da giudicare dal vivo | 16 KiB di texture, nessuna geometria; c2 aggiunge luce e rilievo con un costo per frame da misurare su Safari |
| d) O28 | **d solo se la prova su iPhone convince**, altrimenti all'app futura | Recupera il bordo del tavolo (874 px invece di 750), non spazio di gioco: l'altezza resta 292 |
| `VerifyAim` 844 | **(a) correggere le frecce (v1)**, verificatore invariato | Causa geometrica trovata e riprodotta; 0 frecce che attraversano a ogni misura, fattori e `layoutProblems` identici |
| Jingle | **J2**: l'interruzione ferma solo i colpi del round; esito e suoni dell'interfaccia proseguono | J1 non basterebbe: l'esito parte col pannello, cioè proprio mentre gira la sequenza finale |

Le [domande numerate](#domande-al-proprietario) sono in fondo.

## Diagnosi sul tavolo vero

Partite reali sul server locale (database temporaneo, jar `5684bffda536ac67` ricostruito qui), Edge/Playwright su PC, duello (quick 1vCom) e
FFA con quattro computer, due turni ciascuna, alle misure ufficiali **1366×768** e **844×390** e, solo come diagnosi degli «schermi grandi»,
**1920×1080**. Strumento: [`guide-captures.mjs`](../../../../client-web/tools/guide-captures.mjs) esteso con `BM_SPACE`, `BM_SAFE` e
`BM_LAYOUT=1` (registra a ogni momento il layout della scena, gli `hits` e i riquadri del guscio HTML). Le misure dell'occupazione si calcolano
con [`space-probe.mjs`](../../../../client-web/tools/space-probe.mjs), committato, che legge quei layout (`BM_CAPTURES`) o li calcola dalle
funzioni pure del client con 1 e 3 oggetti per posto. Nessuno dei due è una verifica e nessuno fallisce. Numeri completi: [misure.json](misure.json).

### Quanto spazio occupa cosa (partite reali, momento della scelta)

Quota dello schermo coperta da ciascun tipo di elemento, a griglia di 2 px (un pixel conta una volta sola, nell'ordine mano, posti, oggetti,
mani coperte, carte del round, pile, guscio). «Posti» = personaggi, plance, oggetti e mani coperte. Le strisce del riepilogo, i primi piani
e le frecce sono passeggeri e non sono contati.

| Misura | Modo | Vuoto | Mano | Posti | Round | Guscio | Vuoto più grande | Distanza minima posto↔posto / posto↔mano / posto↔round |
|---|---|---:|---:|---:|---:|---:|---|---|
| 1366×768 | duello | 43,7% | 25,5% | 22,0% | 5,8% | 2,7% | 280×410 a destra (10,9%) | 190 / 10 / 16 px |
| 1366×768 | FFA | 39,9% | 22,8% | 29,7% | 4,5% | 2,7% | 362×172 in alto a destra (5,9%) | 21 / 10 / 13 px |
| 844×390 | duello | 42,0% | 28,1% | 22,6% | 1,9% | 4,8% | 262×166 in alto a destra (13,2%) | 73 / **0,7** / 8 px |
| 844×390 | FFA | 38,5% | 26,4% | 27,3% | 2,5% | 4,6% | 88×226 (6,0%) | **9,6** / 9,3 / 10 px |
| 1920×1080 | duello | **69,8%** | 14,5% | 11,2% | 2,9% | 1,4% | 620×622 in alto a sinistra (18,6%) | 492 / 253 / 56 px |
| 1920×1080 | FFA | **64,2%** | 14,5% | 16,5% | 3,2% | 1,4% | 1372×178 al centro (11,8%) | 65 / 183 / 49 px |

Con tre oggetti per posto (sonda): a 844×390 FFA i posti arrivano a **0,6 px** l'uno dall'altro e il vuoto scende al 35,9%.

**Schermi piccoli (844×390): cosa affolla.** Il vuoto c'è (38–45%), ma è sbriciolato: in FFA il rettangolo libero più grande è 88×226 px.
Tutto è alla misura minima: personaggi altrui 60×83, oggetti 46×63, plance altrui 88×42 con le cifre a circa 10 px, mani coperte di dorsi
18×25, carte del round **36×50 px** con la colonna degli autori a 42 px (titoli illeggibili), plancia propria che tocca la mano (0,7 px in
duello). Sempre visibili pur essendo secondari: il titolo «BOTTE MICIDIALI» (96×48 in alto a sinistra), il posto vuoto degli scarti, la
colonna degli autori del round, gli oggetti di scena dello sfondo (il posacenere sotto il posto di Computer 3, il Negroni accanto alle mani
coperte di Computer 4), che a quella misura competono con le carte; dopo un round si aggiungono fino a sei strisce del riepilogo
([oggi, FFA 844 dopo il round](../../../reports/client-c4/c4-11/catture/oggi-ffa-844-dopo.jpg),
[scelta](../../../reports/client-c4/c4-11/catture/oggi-ffa-844-scelta.jpg),
[duello 844 dopo](../../../reports/client-c4/c4-11/catture/oggi-duel-844-dopo.jpg)).
La mano propria resta il 26–28% dello schermo: è il pezzo che non si può toccare (regola 17, 44 px di passo).

**Schermi grandi (1920×1080): perché è spoglio.** Le misure di C3-L hanno un tetto fisso: la mano è `min(214, h·0,28)` e la base delle
carte `min(150, h·0,195)`, quindi da 768 px di altezza in su **non cresce più nulla**: a 1920×1080 mano, personaggi e oggetti hanno la
stessa misura in pixel di 1366×768 e il resto (64–70% dello schermo) è tavolo vuoto
([duello](../../../reports/client-c4/c4-11/catture/oggi-duel-1920-scelta.jpg), [FFA](../../../reports/client-c4/c4-11/catture/oggi-ffa-1920-scelta.jpg)).
A 1366×768 il vuoto (38–44%) è nella media e la composizione regge.

**Profondità.** Oggi l'unico rilievo è un'ombra netta sotto ogni carta (rettangolo scuro spostato di 4×6 px, opaco al 60%) e le ombre
sfocate dei tre oggetti di scena. Tavolo, plance e carte stanno sullo stesso piano, con la stessa luce dappertutto.

### Fattori e misure di oggi (base della regola 17)

Dalle funzioni del client (`tableLayout`, `fitScale`), uguali alle partite reali; tre oggetti per posto dove cambia qualcosa.

| Misura | Modo | Fattori (tuo / altri / oggetti / plance) | Mano (passo) | Tuo personaggio | Altri | Oggetto | Plancia tua / altrui | Dorso | Carta del round | Pile | Carta posata |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1366×768 | duello | 1,5 / 1,2 / 1 / 1,25 | 214×295 (114) | 225×310 | 180×248 | 114×157 | 213×188 / 188×73 | 48×67 | 150×207 (120 con 3 oggetti) | 40×55 | 120×166 |
| 1366×768 | FFA | 1,5 / 1 / 1 / 1,25 | 214×295 (98; 76 con 3 oggetti) | 175×242 | 117×161 | 89×123 | 213×188 / 150×73 | 30×42 | 94×129 (70 con 3) | 40×55 | 120×166 |
| 844×390 | duello | 1,5 / 1 / 1 / 1,1 | 120×166 (72) | 120×166 | 80×110 | 61×84 | 121×101 / 110×44 | 24×34 | 40×55 | 26×36 | 70×97 |
| 844×390 | FFA | 1,5 / 1 / 1 / 1,05 | 120×166 (67; 55 con 3) | 90×124 | 60×83 | 46×63 | 116×97 / 88×42 | 18×25 | 36×50 | 26×36 | 70×97 |
| 1920×1080 | duello | 1,5 / 1,2 / 1 / 1,25 | 214×295 (133) | 225×311 | 180×248 | 114×157 | 213×188 / 188×73 | 48×67 | 150×207 | 40×55 | 120×166 |
| 1920×1080 | FFA | 1,5 / 1,2 / 1 / 1,25 | 214×295 (133) | 176×242 | 140×194 | 89×123 | 213×188 / 150×73 | 36×50 | 117×162 | 40×55 | 120×166 |

C4-2: ✓ e × sulla carta, ogni metà ≥ 44 px; sulla carta scartata (C4-10, O30) 240×331 a 1366×768 e 144×199 a 844×390.

### 750×292 oggi (base della regola 18, solo riferimento)

`layoutProblems` con 1 / 3 oggetti per posto: duello **6 / 5**, FFA **11 / 14**, uguali a `BASE_750` (`{2:[6,6,6,5],5:[11,11,12,14]}`).
Fattori tutti a 1, carte del round assenti (nessun posto), mano al 42% dello schermo in duello. Con l'area sicura usata per intero
(874×292, vedi d) la sonda dà duello 5 / 4 e FFA 10 / 12: la larghezza aiuta poco, manca l'altezza (servono 384 px in duello e 417 in FFA).

## Opzioni

Tutte nella stessa [patch](prototipo.patch), attivate da `localStorage['bm.space']` con un elenco di sigle (per esempio `a1,a2,b1,c1`) o
dall'indirizzo `?space=a1,a2,b1,c1`. Senza la chiave il client è il prodotto di oggi (verificato: 289/289 test unitari verdi con la patch
applicata e nessuna chiave). Catture prima e dopo nella cartella delle [evidenze](../../../reports/client-c4/c4-11/README.md).

Per ogni opzione: **hits** (i tocchi devono restare dove il disegno mostra le carte), **guida di C4-10** (tocca solo altezza e scala dei nodi),
**movimento ridotto**, **750×292** (`layoutProblems`, sonda), **costo** (texture rispetto al margine di 5,56 MiB sotto il tetto di 32 MiB, JS,
disegno per frame e rischio Safari, C4-8b).

### a) Schermi piccoli: comprimere il secondario senza togliere funzioni

Vincoli: righe P invariate, «Ultimo turno» resta il percorso completo (regola 16), nessuna dimensione di C3-L che scende a 844×390
(regola 17). Per questo le opzioni **non rimpiccioliscono** nulla: tolgono o raccolgono ciò che è secondario.

**a1 «Cornice leggera»** (solo tavolo compatto, sotto i 550 px di altezza): il titolo decorativo «BOTTE MICIDIALI» non compare sul tavolo
compatto (resta sul tavolo sopra i 550 px; le altre schermate hanno il loro titolo); gli oggetti di scena dello sfondo (posacenere, Negroni, sottobicchiere) scendono al 55% di opacità,
così le carte piccole non competono con loro; il posto vuoto della pila degli scarti non si disegna (la pila compare con la prima carta
scartata). Nessuna geometria cambia.
Catture: [duello 844, scelta](../../../reports/client-c4/c4-11/catture/a-duel-844-scelta.jpg),
[FFA 844, scelta](../../../reports/client-c4/c4-11/catture/a-ffa-844-scelta.jpg) (insieme ad a2).
- Hits invariati; guida invariata; movimento ridotto invariato; 750×292 invariato (stessa geometria).
- Costo: tre righe di CSS, una di scena; nessuna texture.

**a2 «Round in pila»** (solo tavolo compatto): le carte dell'ultimo round, oggi una cascata con una colonna di autori, diventano una sola
pila: ogni carta si posa sulla precedente durante la sequenza, si legge la carta in cima con il suo autore e il numero di carte
(«TU · 4»). Toccare la pila apre «Ultimo turno» come oggi, con ordine, autori, annullate e testo del server: nessuna informazione sparisce,
cambia dove si legge (era la voce 2 di D7, mai decisa perché D6 l'aveva resa non necessaria). Poiché la pila occupa meno di metà della
cascata, `arrange` trova posto a una carta più grande: **36→60 px in FFA**, 40 px in duello (stessa misura, posto diverso).
Catture: [FFA 844 dopo il round](../../../reports/client-c4/c4-11/catture/a-ffa-844-dopo.jpg) contro
[oggi](../../../reports/client-c4/c4-11/catture/oggi-ffa-844-dopo.jpg); [duello 844 dopo](../../../reports/client-c4/c4-11/catture/a-duel-844-dopo.jpg);
[FFA 844 in sequenza](../../../reports/client-c4/c4-11/catture/a-ffa-844-sequenza.jpg).
- Hits: invariati per mano, personaggi e oggetti; il pulsante HTML «Carte del round: apri Ultimo turno» segue il riquadro più piccolo.
- Guida di C4-10: non usa le carte del round (il fuoco in sequenza è su autore e bersaglio), invariata.
- Movimento ridotto: la pila mostra la vista finale come oggi la cascata.
- 750×292: FFA con 1 oggetto **11 → 10** problemi (la pila trova posto dove la cascata non lo trovava); gli altri conteggi uguali. Può solo scendere.
- Rischio: in un round con carte annullate, solo l'annullata in cima porta il segno vinaccia; le altre si leggono in «Ultimo turno».
  Da giudicare: se basta, o se serve un segno sul conteggio quando nella pila c'è un'annullata.
- Costo: dieci righe fra `arrange` e scena; meno nodi disegnati (un'etichetta invece di cinque).

**Non prototipata, per completezza: a3 «Mano che si abbassa».** Fuori dalla scelta (sequenza, attesa) la mano compatta potrebbe scendere
di metà, lasciando 60–80 px alla sequenza; ma la scelta durante la sequenza (regola 4) e i tocchi sulla mano abbassata chiedono un
primo tocco che solleva (come K7), cioè un gesto in più, e la guida B «Richiamo» lavora proprio sulla mano. Non la raccomando.

**Raccomandazione a): a1 + a2.**

### b) Schermi grandi: usare lo spazio

Vincolo: alle misure ufficiali le dimensioni restano o crescono (regola 17). Entrambe le opzioni agiscono **solo sopra gli 800 px di altezza**
(b2 sopra i 900): a 1366×768, 844×390 e 750×292 la sonda dà fattori, misure e `layoutProblems` identici a oggi.

**b1 «Misure che crescono»**: i tetti di C3-L (mano 214 px, base 150 px, carta posata 120×166, pile 40 px, sollevamento 30 px) si
moltiplicano per `altezza / 800` sopra gli 800 px. A 1920×1080 (×1,35): mano **214→289 px**, tuo personaggio 225→304 (duello) e 176→237
(FFA), avversari 180→203 (duello) e 140→182 (FFA), oggetti 114→154, carte del round 150→203; vuoto **69,8→51,7%** (duello) e
**64,2→45,0%** (FFA). Il resto lo fa `fitScale` come oggi: per far entrare tutto cede un passo dei fattori degli «altri» (duello
1,2→1, FFA 1,2→1,15) e delle plance in duello (1,25→1,2), quindi plance altrui e dorsi a 1920×1080 risultano un po' più piccoli di oggi
(188×73→180×70, dorsi 48→40). 1920×1080 non è una misura ufficiale: lo dichiaro, non viola la regola 17.
Catture: [duello](../../../reports/client-c4/c4-11/catture/b1-duel-1920-scelta.jpg), [FFA](../../../reports/client-c4/c4-11/catture/b1-ffa-1920-scelta.jpg).
- Hits: crescono con le carte (sono gli stessi riquadri del disegno).
- Guida: valori in px dell'onda (8 px) invariati, pulsazioni in percentuale; nulla si rompe.
- Movimento ridotto e 750×292: invariati.
- Con b1 la sonda trova 4 frecce che attraversano il vecchio posto di ✓/× in FFA a 1920×1080 (lo stesso difetto di `VerifyAim` 844, vedi
  sotto): v1 le porta a 0. b1 va quindi con v1.
- Costo: cinque righe; nessuna texture nuova (gli sprite più grandi pesano solo nel riempimento, sugli schermi grandi).

**b2 «Respiro e scena»**: misure di oggi, ma sopra i 900 px le carte del round possono crescere fino a 1,4 volte un personaggio
(150→210 px in duello, 117→164 in FFA) e si posano su un sottobicchiere (la texture del sottobicchiere dello sfondo, nessuna immagine
nuova). Vuoto 69,8→67,6%: cambia poco lo spazio, aggiunge un oggetto di scena al centro.
Catture: [duello](../../../reports/client-c4/c4-11/catture/b2-duel-1920-dopo.jpg), [FFA](../../../reports/client-c4/c4-11/catture/b2-ffa-1920-dopo.jpg);
con b1: [duello](../../../reports/client-c4/c4-11/catture/b12-duel-1920-dopo.jpg), [FFA](../../../reports/client-c4/c4-11/catture/b12-ffa-1920-dopo.jpg).
- Hits, guida, movimento ridotto, 750×292: invariati.
- Costo: otto righe, nessuna texture nuova.
- Con b1 le carte del round diventano molto grandi (in duello con un oggetto 284×391): b1 + b2 è troppo.

Per la **decorazione del bar** servirebbero immagini nuove (bottiglie, bancone, sgabelli ai bordi): secondo D11 le genera il proprietario,
con il prompt committato prima. Non le propongo ora: con b1 il vuoto scende sotto la metà e la scena regge con gli oggetti che ci sono
(domanda 2).

**Raccomandazione b): b1** (con v1); b2 no, o solo il sottobicchiere sotto le carte del round se piace.

### c) Profondità in Pixi 2D

Nessun renderer 3D; ombre e luci disegnate in codice, texture minuscole create a runtime su un canvas (`size.mjs` conta i file
d'immagine, non queste: il costo è dichiarato qui).

**c1 «Ombre morbide»**: l'ombra netta di ogni carta (mano, personaggi, oggetti, dorsi, pile, carte del round) e delle plance diventa un'ombra
sfocata da una sola texture 64×64 a nove fette (`NineSliceSprite`); una carta sollevata (scelta, passaggio del mouse, scarto scelto) getta
l'ombra più lontana e più chiara, come se si staccasse dal tavolo.
Catture: [duello 1366](../../../reports/client-c4/c4-11/catture/c1-duel-1366-scelta.jpg), [FFA 1366](../../../reports/client-c4/c4-11/catture/c1-ffa-1366-scelta.jpg),
[duello 844](../../../reports/client-c4/c4-11/catture/c1-duel-844-scelta.jpg), [FFA 844](../../../reports/client-c4/c4-11/catture/c1-ffa-844-scelta.jpg),
[duello 1920](../../../reports/client-c4/c4-11/catture/c1-duel-1920-scelta.jpg), [mira 1366](../../../reports/client-c4/c4-11/catture/c1-duel-1366-mira.jpg).
- Nelle catture la differenza è sottile (bordo dell'ombra sfumato invece che netto; la carta scelta getta l'ombra più in basso): è un
  cambiamento da guardare dal vivo, soprattutto quando le carte si sollevano e volano.
- Hits: invariati (l'ombra è fuori dagli `hits`, solo disegno). Guida: l'ombra è figlia della carta e segue onda e scala.
- Movimento ridotto: nulla si muove. 750×292: invariato.
- Costo: **16 KiB** di texture (0,3% del margine); uno sprite in più per carta e plancia (40–70 per ridisegno, nello stesso lotto della
  GPU); circa 15 righe. Rischio Safari basso.

**c2 «Luce del bar»**: c1, più una luce calda al centro del tavolo (sprite radiale 128×128 in somma) e una vignettatura scura ai bordi
(sprite 128×128), sotto le carte; un filo di luce in alto a sinistra e uno d'ombra in basso a destra sulla carta, come rilievo.
Catture: [duello 1366](../../../reports/client-c4/c4-11/catture/c2-duel-1366-scelta.jpg), [FFA 1366](../../../reports/client-c4/c4-11/catture/c2-ffa-1366-scelta.jpg),
[duello 844](../../../reports/client-c4/c4-11/catture/c2-duel-844-scelta.jpg), [FFA 844](../../../reports/client-c4/c4-11/catture/c2-ffa-844-scelta.jpg),
[duello 1920](../../../reports/client-c4/c4-11/catture/c2-duel-1920-scelta.jpg), [mira 1366](../../../reports/client-c4/c4-11/catture/c2-duel-1366-mira.jpg).
- Hits, guida, movimento ridotto, 750×292: invariati (la luce non si muove, il tremito di C4-10 sposta `world` e `fx`, non la luce).
- Costo: **144 KiB** di texture (2,5% del margine); due quadrati a tutto schermo per frame (uno in somma), cioè riempimento in più a ogni
  frame: è il costo che su Safari pesa (C4-8b), da misurare dal vivo; due tratti in più per carta a ogni ridisegno.
- Rischio estetico: la prova di C4-10 ha scartato A e C perché «troppo buie»; la vignettatura di c2 scurisce i bordi (dove stanno posti e
  mano propria). Da giudicare a occhio.

**Raccomandazione c): c1.** c2 se dal vivo non risulta buia e Safari regge.

### d) O28: `viewport-fit=cover` e aree sicure

**Oggi.** `index.html` non ha `viewport-fit=cover`: Safari in orizzontale mette la pagina dentro l'area sicura. Su iPhone 16 Pro lo schermo
è 874×402 punti, Safari lascia **750×292** (misura del proprietario): 62 px per lato sono strisce del colore della pagina, il resto in
altezza sono le barre di Safari.

**d «Bordo pieno»** (prototipo): a pagina caricata, con la sigla `d`, il client aggiunge `viewport-fit=cover` al meta del viewport e legge
`env(safe-area-inset-*)`; il tavolo si dispone nella larghezza sicura (750) spostato del margine sinistro, lo sfondo copre tutta la
larghezza (874), menu, orologio, suggerimento e titolo restano dentro l'area sicura. Su PC si emula con `localStorage['bm.safe']` (o
`?safe=62,0,62,0`). Catture emulate: [duello 874×292](../../../reports/client-c4/c4-11/catture/d-duel-874-scelta.jpg),
[FFA 874×292](../../../reports/client-c4/c4-11/catture/d-ffa-874-scelta.jpg) contro oggi a
[750×292 duello](../../../reports/client-c4/c4-11/catture/d0-duel-750-scelta.jpg) e [FFA](../../../reports/client-c4/c4-11/catture/d0-ffa-750-scelta.jpg).

**Stima di cosa si recupera.** Larghezza: **+124 px (+16,5%) di sfondo**, nessun pixel di spazio di gioco (il tavolo resta largo 750 per non
finire sotto l'isola). Altezza: **nulla**: le barre in alto sono di Safari e `viewport-fit` non le restituisce; l'eventuale margine in basso
(indicatore della home, circa 21 px) il prototipo lo ignora, come oggi. Se si usasse tutta la larghezza anche per il gioco (d2, non
prototipato: bisogna sapere da che parte sta l'isola), la sonda a 874×292 dà 1–2 problemi in meno (duello 6→5, FFA 11→10 e 14→12):
l'altezza resta il limite, come dice D6. Lo schermo intero non esiste per le pagine su iPhone (solo video), la PWA è fuori da C4.
- Hits: seguono il layout spostato (lo strato semantico è posizionato dagli `hits`).
- Guida, movimento ridotto: invariati. 750×292: il layout nella larghezza sicura è quello di oggi, quindi invariato.
- Non verificabile da Edge: i valori di `env()` li dà solo iOS; e non è provato che Safari applichi `viewport-fit` cambiato dopo il
  caricamento (di solito sì): se nella prova non cambia nulla, va messo a mano in `index.html` (istruzioni sotto).
- Il ridimensionamento della barra di Safari continua a esserci: non risolve il jingle (vedi sotto).
- Costo: una quindicina di righe fra `main.tsx`, `space.ts`, scena e CSS.

**Raccomandazione d):** provarlo su iPhone; tenerlo solo se il tavolo a tutto schermo convince e nulla finisce sotto l'isola o gli
angoli; altrimenti all'app futura con O22.

## `VerifyAim` a 844×390: causa e correzione

**Riprodotto sul codice di oggi**, con la sonda e sul tavolo vero ([oggi, FFA 844 mira con una legata](../../../reports/client-c4/c4-11/catture/oggi-ffa-844-mira2.jpg)).
In FFA a 844×390, con una carta **legata al personaggio** scelta, la freccia verso il posto in mezzo a destra (nelle evidenze di C4-10
`person-ComPlayer_727` e `person-ComPlayer_1415`, nella sonda `person-e`) è segnalata dalla scena stessa come `crosses` e passa sul vecchio
posto di ✓ e ×. La sonda la trova per la carta scelta negli slot 1–2 di una mano da 6–8 carte (un oggetto per posto) e negli slot 0–1 di
5–8 carte (tre oggetti): 2 e 4 frecce. Nessuna alle altre misure ufficiali.

**Causa geometrica.**
1. La carta legata scelta **non si solleva**: aspetta lo scarto (O26, C4-5a-bis, `handCardState`, `resting`), quindi la freccia parte dal
   bordo alto della carta a riposo, circa 30 px più in basso e a sinistra di una carta scelta qualsiasi.
2. Il vecchio posto di ✓ e × (`confirmButtons`, tenuto libero dal C4-2 perché i fattori di C3-L non cambino, regola 17) a 844×390 FFA è
   x 492–604, y 199,5–295,5 (+8 px di margine nel controllo). Il personaggio del posto in mezzo a destra è x 577,7–637,7, y 126,3–209,1:
   **il suo angolo in basso a sinistra sta dentro quel margine**.
3. `aimArrows` prova 15 punti di partenza e 7 curvature, ma **sempre la stessa punta** (il punto del bordo rivolto al centro della carta):
   da una carta in basso a sinistra quella punta cade proprio nell'angolo, dentro il margine. Ogni percorso attraversa; la scena lo segnala
   (`crosses`) e `VerifyAim` lo vede due volte («flagged as crossing the buttons», «over ✓ or ×»).
4. `layoutProblems` (e quindi `fitScale`) controlla le frecce solo dalla carta **centrale sollevata**, non dalle carte a riposo degli altri
   slot: per questo nessun test se n'è accorto. Le legate a riposo ci sono in ogni partita da R02 1.12 (due legate in ogni mazzo): spiega
   perché il rosso è comparso dopo (era l'ipotesi della regia, ora dimostrata). «In attesa» è la stessa FFA a cinque posti.

**Non è un falso rosso del verificatore**: misura quello che la scena stessa calcola. È però innocuo a vedersi: dal C4-2 in quel riquadro
non c'è più nulla (✓ e × stanno sulla carta e le frecce spariscono appena il bersaglio è scelto).

**(a) Raccomandata: v1, correggere le frecce.** In `aimArrows`, se ogni percorso verso la punta rivolta alla carta attraversa la zona da
evitare, la punta può cadere sul centro di un altro lato del bersaglio (il più vicino alla carta per primo). Quattro righe pure in
`readability.ts`. Sonda: frecce che attraversano **0** a ogni misura (844 FFA 2→0 e 4→0; 750 FFA 17→0 e 6→0; 1920 con b1 4→0); fattori,
misure e `layoutProblems` **identici** a 1366×768, 844×390, 750×292 e 1920×1080. Sul tavolo vero la freccia verso il Computer 4 arriva sul
lato sinistro della carta ([v1, FFA 844 mira](../../../reports/client-c4/c4-11/catture/v1-ffa-844-mira2.jpg)).
`VerifyAim` resta com'è e controlla esattamente la stessa cosa (nessuna freccia sul vecchio posto di ✓/× fuori dalla carta, punta entro 8 px
dal bordo del bersaglio). Per la Fase B propongo anche un test unitario che percorre tutti gli slot con la carta sollevata **e** a riposo,
quello che sarebbe mancato oggi.
- Hits, guida, movimento ridotto: invariati (le frecce sono solo disegno).
- Effetto collaterale da guardare: arrivando sul lato sinistro la freccia passa sopra la plancia del bersaglio (che sta alla sua sinistra)
  un po' più di oggi; lo strato delle frecce è già traslucido (82%).

**(b) Alternativa: dichiararlo falso rosso** e cambiare il controllo in «nessuna freccia insieme a ✓ e ×». Non la raccomando: smetterebbe di
controllare il riquadro riservato, che è ciò che tiene fermi i fattori (regola 17).

## Jingle d'esito troncato e interruzioni

**Come funziona oggi** (riferimenti sul codice di `f706a4e`):
- `scene.interrupt(reason, redraw, sequence=true)` (`client-web/src/scene.ts:469`) chiama `sounds.stopAll()` **ogni volta che `sequence` è
  vero, anche senza sequenza in corso**, poi `finish(reason,false)`, che senza sequenza non fa nulla (`scene.ts:653`). Con sequenza,
  `finish` → `stopEffects(false)` → `sounds.endRound(true)` → di nuovo `stopAll` (`scene.ts:658`, `sound.ts:51`).
- La chiamano con `sequence` vero: `pointercancel` (`scene.ts:128`), `resize` della finestra (`:139`), `resize` di `visualViewport`
  (`:140`), il passaggio in background (`:142`), il cambio di movimento ridotto (`:143`), Esc (`escape`, `:472`), una vista nuova, un
  reset o una disconnessione (`:147`). Non la chiamano con `sequence` vero: `blur` (`:141`) e i dialoghi (`table.tsx:63`).
- `stopAll` (`sound.ts:59`) ferma ogni sorgente attiva e incrementa la generazione, quindi annulla anche i suoni d'interfaccia rimandati
  (`defer`, `sound.ts:49`: selezione, invio, rifiuto).
- Il jingle d'esito parte quando il pannello compare (`audioOutcome.commit`, `table.tsx:69`), cioè con la vista finale, **all'inizio
  della sequenza finale**, che dura ancora 8–9 s. Dura **0,64 s** (vittoria, `jingles_SAX10.ogg`) e **1,74 s** (sconfitta, `jingles_SAX07.ogg`),
  letti dalle intestazioni Ogg.
- Quindi un ridimensionamento (la barra di Safari che compare o sparisce, una rotazione), un `pointercancel` (un tocco che Safari trasforma
  in gesto) o un Esc in quella finestra **troncano il jingle**, e in qualunque momento troncano i suoni d'interfaccia.

**Regole approvate.** [Proposta dei colpi](../audio/proposta-colpi.md), tabella: «Interruzione, resize, background, disconnessione: Ferma
e consuma l'audio attivo/pendente, nessuna ripresa». [Proposta dell'esito](../audio/proposta-esito.md): il caso di `visualViewport` era
dichiarato e rimandato a O28 («Da riprovare dopo, con O28»). Il comportamento di oggi è **conforme**: cambiarlo è una decisione del proprietario.

**Opzioni.**
- **J0 — invariato.** Conforme; il jingle si perde solo se lo schermo cambia nel secondo in cui suona.
- **J1 — fermare l'audio solo con una sequenza in corso.** Salva i suoni d'interfaccia fuori dalla sequenza, **ma non il jingle**: il jingle
  suona proprio mentre gira la sequenza finale, quindi un ridimensionamento lo tronca come oggi. Non risolve il caso che ha aperto la questione.
- **J2 — l'interruzione ferma solo i colpi del round** (raccomandata): `interrupt` e la fine per interruzione fermano e consumano i colpi
  del round (sorgenti del round e colpi pendenti, `stopRound`), non il jingle d'esito né i suoni d'interfaccia, e non annullano quelli
  rimandati. Restano come oggi: «Salta effetti» (ferma tutto, regola approvata), uscita dal tavolo (smontaggio), background
  (`visibilitychange`), disconnessione e reset (`table.tsx:42`, `:47`), muto. Due righe in `scene.ts` e una in `sound.ts`, più i test.
  È la riga «Interruzione, resize…» della proposta dei colpi che cambia, per esito e interfaccia soltanto; i colpi restano fermati e consumati.

**Raccomandazione: J2.** È l'unica che rende l'esito indipendente dalla sequenza come vuole C4-7-ter («esito indipendente al pannello»),
senza toccare ciò che il proprietario ha approvato per i colpi. Decide il proprietario.

## Come provare i prototipi dal vivo

1. Su un checkout pulito di `f706a4e` o successivo compatibile: `git apply docs/design/client-c4/spazio/prototipo.patch`.
2. Server locale (`./scripts/dev.ps1 -Task Server -SeedAccounts`), poi `./client-web/run.ps1 -Task Build` e `Serve` (PC) o `Physical`
   (iPhone sulla stessa Wi-Fi).
3. Scegliere le opzioni **dall'indirizzo**, anche sul telefono: aggiungere `space=` all'indirizzo, per esempio
   `http://127.0.0.1:4320/?space=a1,a2,b1,c1` oppure, con `Physical`, `http://<ip>:4320/?k=<codice>&space=c2,d`. La scelta resta salvata;
   `?space=` vuoto torna al prodotto di oggi. In alternativa, console del browser: `localStorage.setItem('bm.space','a1,a2')` e ricaricare.
4. Sigle: `a1` cornice leggera, `a2` round in pila (entrambe solo sotto 550 px di altezza), `b1` misure che crescono, `b2` respiro e
   sottobicchiere (solo sopra 800/900 px), `c1` ombre morbide, `c2` luce del bar (comprende c1), `d` bordo pieno (O28), `v1` frecce corrette.
5. **Su PC**: per gli schermi piccoli la finestra di Edge a 844×390 (strumenti di sviluppo, dispositivo) o un telefono; per gli schermi
   grandi la finestra a tutto schermo su un monitor da 1080 px o più. Per emulare l'area sicura: `?space=d&safe=62,0,62,0` con la finestra a 874×292.
6. **Su iPhone (O28 e jingle)**: `?space=d` (più le altre sigle a piacere), Safari in orizzontale. Da guardare: il tavolo arriva ai bordi?
   menu e orologio restano raggiungibili? qualcosa finisce sotto l'isola o negli angoli? Se nulla cambia rispetto a oggi, Safari non ha
   preso `viewport-fit` cambiato dopo il caricamento: per la prova, in `client-web/index.html`, aggiungere `,viewport-fit=cover` al
   `content` del meta `viewport`, ricostruire con `Physical` e rimettere com'era dopo.
7. Per tornare al prodotto: `git checkout -- client-web/src` e cancellare `client-web/src/space.ts` (file nuovo della patch); poi `Build`.

Il jingle (J0/J1/J2) **non è nella patch**: è una regola da scegliere, non un aspetto da vedere.

## Domande al proprietario

1. **Schermi piccoli (a):** (a) a1 + a2, **raccomandata**; (b) solo a1; (c) solo a2; (d) nessuna. Se a2: basta il segno vinaccia sulla
   carta in cima, o serve un segno sul conteggio quando nella pila c'è un'annullata?
2. **Schermi grandi (b):** (a) b1, **raccomandata**; (b) b2; (c) b1 + b2; (d) nessuna. E servono immagini nuove per decorare il bar
   (bottiglie, bancone, sgabelli)? Raccomando di **no** per ora; se sì, scrivo e committo i prompt prima, e le generi tu (D11).
3. **Profondità (c):** (a) c1, **raccomandata**; (b) c2; (c) nessuna.
4. **O28 (d):** (a) provarlo su iPhone e tenerlo solo se convince, **raccomandata**; (b) tenerlo comunque; (c) lasciarlo all'app futura.
5. **`VerifyAim` 844:** (a) correggere le frecce (v1), verificatore invariato, **raccomandata**; (b) dichiararlo falso rosso e cambiare il
   controllo.
6. **Jingle e interruzioni:** (a) J2, l'interruzione ferma solo i colpi, **raccomandata**; (b) J1, solo con sequenza in corso; (c) J0, invariato.
7. **1920×1080 come misura ufficiale:** (a) sì, come terza misura di `VerifyAll` per `Verify` e `VerifyLayout` (con b1 diventa una
   geometria propria da proteggere; costa circa 15–20 minuti a giro), **raccomandata solo se scegli b1**; (b) no, resta diagnostica.

## Verificato e non verificato

**Verificato:** partite reali in Edge/PC (duello e FFA) a 1366×768, 844×390 e 1920×1080 oggi, e con le opzioni alle misure in cui agiscono
(a 844×390, b a 1920×1080, c alle tre, v1 a 844×390 FFA, d emulata a 874×292, oggi anche a 750×292); 0 errori di pagina in tutte le
catture; misure dell'occupazione sui layout registrati; sonda delle funzioni pure a 1366×768, 844×390, 1920×1080, 750×292 e 874×292 con
1 e 3 oggetti; `VerifyAim` 844 riprodotto sulla sonda e sul tavolo vero; prodotto ripristinato dopo le catture (verifiche nel
[rapporto](../../../reports/client-c4-report.md#c4-11--fase-a)).

**Non verificato:** iPhone e Safari (O28, `env()`, `viewport-fit` cambiato dopo il caricamento, costo per frame di c1 e c2, jingle sul
ridimensionamento della barra); fluidità percepita (catture ferme); lettore di schermo (a2 cambia l'etichetta visibile delle carte del
round, non quella del pulsante); partite fra due umani; la matrice di Fase B (`Verify`, `VerifyFfa`, `VerifyAim`, `VerifyLayout`,
`VerifyResolution` ridotta, 750×292) **non è stata eseguita** sui prototipi: non sono prodotto.
