# SB-16e — Giro sui cinque starter con D50

12 novembre 2026. Fase unica, base `f34bb7c`, dopo D55 già registrata nel repository. Perimetro: bozza e sorgenti di test,
griglia, rapporto/evidenze, riga e sezione SB-16e del piano. Nessun cambiamento al regolamento, ai documenti del set, al server
principale o ai client.

**Esito: STOP al terzo giro, come D53. Il bilanciamento non è raggiunto.** Nel giro finale sono fuori dal 40–60% Mara–Piera
e Celestina–Piera; gli specchi di Celestina e Piera superano il 10% di patte. Sei incontri restano oltre i 12 turni medi.
Il profilo finale resta una candidata numerica nel playground, da rivedere prima di SB-16f. Le domande in chiusura riguardano
il seguito dello STOP e la leggibilità del client, non un’approvazione già ricevuta.

## Metodo e budget fissati prima di partire

**Preliminare e passo 0:** checkout inizialmente pulito su `main`, fetch riuscito, HEAD e origin/main a `f34bb7c`, porte di prova
libere. Banco D50 e formato delle carte già disponibili; osservazione verificata contro le tracce del runner prima dei lotti.
Il costo del primo lotto (17 minuti e 42 secondi) conferma la fattibilità entro il tetto; nessun giro preliminare di taratura.

Massimo **3 giri e 7.200 secondi cumulativi di calcolo**, fissati prima del giro 1 in [budget.json](sb-16e/budget.json).
Il [lanciatore](sb-16e/run.ps1) registra il tempo reale di ogni lotto in [compute.json](sb-16e/compute.json) e interrompe il proprio
albero di processi se consuma il residuo. Nel budget entrano matrice, osservazione, ablazioni e listino. Nessun quarto giro.

**Consuntivo: 3.671,614 secondi, cioè 61 minuti e 12 secondi**, entro le due ore. Include le osservazioni corrette e la misura
preliminare del listino, non scartata dal costo. Tre soli profili numerici degli starter.

| Lotto | Secondi reali |
|---|---:|
| Giro 1, matrice + osservazione + ablazioni | 1.062,159 |
| Giro 2, matrice + osservazione + ablazioni | 657,847 |
| Osservazioni corrette dei giri 1 e 2 | 88,299 + 64,035 |
| Giro 3, matrice + osservazione + ablazioni | 815,441 |
| Listino preliminare a 10 HIT | 461,574 |
| Listino ufficiale a 7 HIT, quattro stili | 522,259 |

Le tre matrici principali totalizzano 1.440.000 partite. Patte globali 10,057% → 8,611% → 7,570%; durata media
13,469 → 11,792 → 11,765 turni. La media finale delle patte sotto il 10% **non soddisfa D51**, che vale per ogni incontro.

Regole `d50`, 8 thread, quattro stili invariati (aggressivo, prudente, risorse, com), semi da 7.000.000 e posti alternati.
Ogni matrice principale usa 2.000 partite per cella: 240 celle, 480.000 partite, 15 incontri/specchi. L’osservatore usa i primi
400 semi per cella (96.000 partite); le ablazioni e il loro controllo gli stessi primi 500 semi. Quote sulle decisive, patte
su tutte le partite. Soglie, limiti, pesi e attesi di regressione non sono allentati.

Il primo giro riproduce la bozza di SB-16d; i successivi applicano solo correzioni numeriche delegate da D38/D53. Per Piera si
prova prima L iniziale, poi la salute. Corazza **L/4** in tutti i lotti, valore conservato per confrontare le tarature.

## Giri e numeri

Giro 1: nessuna correzione, fotografia di SB-16d riprodotta. Otto invarianti a zero, 15 bound sotto il tetto. Le tabelle complete
di vittorie, patte e durata per ogni incontro e stile sono nei JSON e in [incontri.md](sb-16e/incontri.md).

Correzioni predisposte per il giro 2, dopo la fotografia e le ablazioni del giro 1:

| Numero | Giro 1 | Giro 2 | Motivo |
|---|---:|---:|---|
| Salute Spazienzio | 85 | 75 | Durata, conservando lo scarto di salute dai base |
| Salute Mara | 80 | 70 | Durata |
| Salute Celestina | 80 | 55 | Forza fuori quota e specchio lungo |
| T iniziale Celestina | 20 | 10 | Prima leva D43, meno carburante anche per le cure |
| T di Dose in preparazione | 15 | 10 | L’ablazione dello slot indica un aumento di forza e durata; resta sufficiente per Tossicone |
| L iniziale Piera | 20 | 10 | Prima leva richiesta, meno corazza e meno consumo iniziale di A; salute ancora 100 |
| Salute Beppe | 95 | 80 | Specchio lungo e 14% di patte; incontro con Spazienzio già entro quota |

Nel giro 3, ultimo tentativo prima dello stop:

| Numero | Giro 2 | Giro 3 | Motivo |
|---|---:|---:|---|
| Salute Celestina | 55 | 70 | Correggere il taglio eccessivo del giro 2 |
| T iniziale Celestina | 10 | 15 | Recuperare accesso alle carte pagate senza tornare a 20 |
| Salute Piera | 100 | 85 | Seconda leva dopo la L, che non ha ridotto durata e patte |
| A di Un altro e arrivo | 10 | 20 | L’ablazione senza A peggiora lo specchio di 8,16 punti di patte nel giro 2 |
| Danno di Testata | 20 | 25 | Recuperare pressione con meno salute; costo e autodanno restano 5 |

Funzioni, composizioni, copie, rarità, priorità e costi restano quelli di D55; il danno di Testata è l’unico danno cambiato.
I testi e i metadati dei guadagni/danni seguono gli effetti numerici: anche i bot leggono quei metadati.

### Attesi dei test cambiati, con la decisione

Tutti sotto la delega **D38/D53** e per i numeri dichiarati sopra. Nessuna soglia viene allentata per accettare un esito del banco.

| Test / atteso | Prima | Dopo / ragione |
|---|---|---|
| `SetBaseDraftTest`, risorse iniziali | Base 85/80; Celestina 80/20 T; Piera 100/20 L; Beppe 95 | Base 75/70; Celestina 70/15 T; Piera 85/10 L; Beppe 80 |
| Stati costruiti, veleno su Spazienzio | 75 dopo il periodico, poi 63, poi 56 | 65, 53, 46: stessa perdita, salute iniziale −10 |
| Stati costruiti, immunità di Celestina | 80 HEALTH, 20 T | 70 HEALTH, 15 T: l’immunità conserva ancora entrambe |
| Testata, effetto e metadati | 20 HIT | 25 HIT, costi e 5 HIT propri invariati |
| Caricamento di Piera applicato direttamente | A 25 | A 35: +20 al posto di +10 |
| Formule Estasi e Guanti | salute iniziale di Spazienzio 85 | 75; i danni e i moltiplicatori restano provati uguali |
| `StarterRedesignTest`, caricamento Piera dopo fine turno | A 3 | A 13: stesso decadimento L/2, guadagno A +10 maggiore |
| `StarterRedesignTest`, Dose risolta | T 15 | T 10: riduzione del solo guadagno |

**Rosso trovato e corretto senza cambiare l’atteso storico.** Alla prima verifica completa, la sonda della vecchia bound +10 L
misura 7,5 contro l’atteso 8,5 perché eredita la nuova L iniziale 10. Sul commit di base `f34bb7c` il test passa con +10=8,5,
+6=5,1, +5=3,75. La copia esportata della base ha richiesto di aggiungere al classpath un jar delle sue stesse classi principali:
`javac` non vedeva la cartella delle classi in TEMP, difetto riprodotto con un sorgente minimo; nessun sorgente di gioco della
base è cambiato. Log in `%TEMP%\bm-sb16e\base-bound-jar.log` (1 test, zero fallimenti).
La correzione rende **esplicita L=20 solo nelle sonde storiche +10/+6**. L’atteso 8,5 e il tetto 4 restano; la bound corrente
+5 continua a essere verificata sulla bozza attuale con L iniziale 10, massimo 3,75. Non è un rosso preesistente da registrare:
è una dipendenza del test storico dai nuovi numeri, risolta nel blocco.

Nuovi test dell’osservatore: tracce identiche su 20 partite, conservazione delle copie trovate, due omonime e bound annullata,
separazione esposizione/parata/corazza/overkill, confine JSON del client, contesti e stili del listino con modalità storica conservata.

## Incontri per giro

Ogni riga: 32.000 partite, 16 coppie di stili, 2.000 semi per cella. Quota A sulle decisive; durata media in turni di partita.

### Giro 1

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15300 | 15418 | 1282 | 0.498 | 4.01 | 11.51 |
| Spazienzio–Mara | 15970 | 14754 | 1276 | 0.520 | 3.99 | 11.20 |
| Spazienzio–Celestina | 10702 | 19470 | 1828 | 0.355 | 5.71 | 13.14 |
| Spazienzio–Piera | 11722 | 18086 | 2192 | 0.393 | 6.85 | 14.31 |
| Spazienzio–Beppe | 13634 | 16889 | 1477 | 0.447 | 4.62 | 12.33 |
| Mara–Mara | 15291 | 15311 | 1398 | 0.500 | 4.37 | 10.51 |
| Mara–Celestina | 11756 | 17913 | 2331 | 0.396 | 7.28 | 12.43 |
| Mara–Piera | 15960 | 12407 | 3633 | 0.563 | 11.35 | 13.49 |
| Mara–Beppe | 15218 | 15344 | 1438 | 0.498 | 4.49 | 11.64 |
| Celestina–Celestina | 12575 | 12434 | 6991 | 0.503 | 21.85 | 18.36 |
| Celestina–Piera | 21934 | 7006 | 3060 | 0.758 | 9.56 | 15.08 |
| Celestina–Beppe | 19719 | 9309 | 2972 | 0.679 | 9.29 | 13.80 |
| Piera–Piera | 11397 | 11275 | 9328 | 0.503 | 29.15 | 16.48 |
| Piera–Beppe | 14009 | 13400 | 4591 | 0.511 | 14.35 | 14.76 |
| Beppe–Beppe | 13912 | 13609 | 4479 | 0.505 | 14.00 | 13.01 |

### Giro 2

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15502 | 15600 | 898 | 0.498 | 2.81 | 9.92 |
| Spazienzio–Mara | 16349 | 14833 | 818 | 0.524 | 2.56 | 9.52 |
| Spazienzio–Celestina | 21482 | 8922 | 1596 | 0.707 | 4.99 | 10.30 |
| Spazienzio–Piera | 10813 | 19251 | 1936 | 0.360 | 6.05 | 13.81 |
| Spazienzio–Beppe | 15793 | 15213 | 994 | 0.509 | 3.11 | 10.38 |
| Mara–Mara | 15335 | 15589 | 1076 | 0.496 | 3.36 | 8.78 |
| Mara–Celestina | 23960 | 6979 | 1061 | 0.774 | 3.32 | 9.13 |
| Mara–Piera | 14323 | 13949 | 3728 | 0.507 | 11.65 | 13.21 |
| Mara–Beppe | 17942 | 13458 | 600 | 0.571 | 1.88 | 9.39 |
| Celestina–Celestina | 12329 | 12467 | 7204 | 0.497 | 22.51 | 15.83 |
| Celestina–Piera | 10314 | 18389 | 3297 | 0.359 | 10.30 | 14.22 |
| Celestina–Beppe | 8125 | 22024 | 1851 | 0.270 | 5.78 | 10.81 |
| Piera–Piera | 11107 | 11312 | 9581 | 0.495 | 29.94 | 16.69 |
| Piera–Beppe | 17864 | 10070 | 4066 | 0.639 | 12.71 | 14.04 |
| Beppe–Beppe | 14800 | 14571 | 2629 | 0.504 | 8.22 | 10.84 |

### Giro 3

| Incontro A–B | Vittorie A | Vittorie B | Patte | Quota A | Patte % | Turni medi |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 15502 | 15600 | 898 | 0.498 | 2.81 | 9.92 |
| Spazienzio–Mara | 16349 | 14833 | 818 | 0.524 | 2.56 | 9.52 |
| Spazienzio–Celestina | 13798 | 16377 | 1825 | 0.457 | 5.70 | 11.89 |
| Spazienzio–Piera | 14651 | 15409 | 1940 | 0.487 | 6.06 | 12.43 |
| Spazienzio–Beppe | 15793 | 15213 | 994 | 0.509 | 3.11 | 10.38 |
| Mara–Mara | 15335 | 15589 | 1076 | 0.496 | 3.36 | 8.78 |
| Mara–Celestina | 15933 | 14171 | 1896 | 0.529 | 5.92 | 10.93 |
| Mara–Piera | 20029 | 9676 | 2295 | 0.674 | 7.17 | 11.28 |
| Mara–Beppe | 17942 | 13458 | 600 | 0.571 | 1.88 | 9.39 |
| Celestina–Celestina | 12445 | 12411 | 7144 | 0.501 | 22.32 | 17.51 |
| Celestina–Piera | 20111 | 9086 | 2803 | 0.689 | 8.76 | 13.70 |
| Celestina–Beppe | 17430 | 11962 | 2608 | 0.593 | 8.15 | 12.38 |
| Piera–Piera | 13105 | 13204 | 5691 | 0.498 | 17.78 | 14.68 |
| Piera–Beppe | 12977 | 15902 | 3121 | 0.449 | 9.75 | 12.84 |
| Beppe–Beppe | 14800 | 14571 | 2629 | 0.504 | 8.22 | 10.84 |

## Misure delle coppie

Le cinque coppie e le ablazioni sono riportate in [coppie.md](sb-16e/coppie.md), con i contatori grezzi per incontro e stile nei
file `pairs.json`. `pair-off-N` ripristina **solo il vecchio slot del caricamento** da
[reference-before-d.json](sb-16e/reference-before-d.json), estratto dal commit `31c2045` (prima dell’attuazione di SB-16d);
colpo, liste e altri numeri restano quelli del giro. È la misura del ridisegno dell’intero slot, non una stima isolata della ricerca.
`p3-off` toglie i tre premi, `poison-8` isola il danno di Tossicone, `piera-no-a` toglie il +A dal caricamento,
`piera-no-search` toglie solo la ricerca. Sono controlli sperimentali, mai adottati nella bozza.

L’osservatore sostituisce nei test il personaggio a dati con una sottoclasse che copia i dati iniziali e chiama il danno reale una
sola volta. Non cambia bot, RNG, ordine o mosse. Controfattuali locali con le stesse funzioni di stato, senza consumarle, distinguono
parata da stati/equip e corazza; non stimano una partita alternativa. Il danno misurato è dopo la mitigazione, prima del pavimento
della salute: l’overkill non diventa una falsa parata. Le esposizioni punite contano le finestre che subiscono un danno avversario
effettivamente aumentato dall’esposizione; eventi e danno aggiuntivo sono contati a parte, così come danni propri o di fine turno.
Se due esposizioni si sovrappongono la finestra è attribuita al caricamento più recente.
«Punita» è quindi una misura dell’aumento del danno dopo mitigazione, prima del taglio alla salute residua: può includere
overkill e colpi su salute già azzerata nello stesso turno. Non misura quante morti siano causate dall’aver caricato;
gli esiti reali sono nei confronti controllati con/senza coppia.

**Revisione dell’osservatore.** Prima della consegna sono stati corretti due errori della misura per identità: con copie omonime
si deve seguire la prima della mano, come `Game.getCardFromHand`; lo scarto indicato da una bound annullata non esce dalla mano.
Test costruiti e mutazioni M4/M5 verificano entrambi i casi. L’osservazione dei giri 1 e 2 è ripetuta sui loro snapshot, stessi
semi, nel budget (`observe-1`, `observe-2` nel registro); i contatori iniziali sono scartati e conservati solo in TEMP.
Matrici, ablazioni, scelte dei bot e numeri del giro non vengono ripetuti o cambiati da questa correzione.

Le copie trovate sono seguite per identità: giocate, risolte, annullate, scartate per bound o inutilizzate a fine partita.
Caricamenti, ricerche riuscite/mancate, colpo già in mano, danni parati, cariche sopravvissute al turno e attesa fra ricerca e colpo
hanno denominatori espliciti nelle tabelle. «Parato» significa riduzione positiva da stati GOOD INPUT, compresi gli equip;
l’assorbimento della corazza ha un contatore separato. Non si assume che un colpo annullato sia stato parato.

### Lettura dei risultati finali

Nel campione finale, su 38.400 partite di posto per personaggio:

| Personaggio | Ricerca riuscita/tentata | Copia trovata scelta/ritrovata | Parate da stati su colpi risolti | Finestre esposte punite/cariche risolte |
|---|---:|---:|---:|---:|
| Spazienzio | 18.421/23.558 | 7.922/18.421 | 1.658/24.019 | 8.217/23.558 |
| Mara | 6.101/8.279 | 4.067/6.101 | 3.627/45.034 | 6.811/8.279 |
| Celestina | 8.148/13.860 | 4.687/8.148 | 0/52.480 | 10.153/13.860 |
| Piera | 15.841/27.727 | 12.768/15.841 | 4.791/62.706 | 16.651/27.727 |
| Beppe | 5.554/14.847 | 3.397/5.554 | 1.657/26.123 | 11.481/14.847 |

Per i cinque colpi ciascuna risoluzione produce un solo evento di danno: qui «parato» ha lo stesso denominatore dei colpi risolti.
La distinzione fra **tutti** i colpi e le **copie trovate** è necessaria: il colpo può essere pescato o già in mano, e una ricerca
può trovare un secondo esemplare omonimo. Spazienzio lascia inutilizzate a fine partita 8.955 copie trovate e attende in media
2,43 turni prima di giocarle; Celestina 2,55 turni. Il ritmo cercare–colpire non è quindi automatico nei bot.

Confronto degli specchi sul controllo da 500 semi per cella, quindi **8.000 partite per riga** (diverso dalla matrice principale):

| Coppia | Effetto dello spegnimento dello slot rispetto al controllo attivo: patte | Durata |
|---|---:|---:|
| Spazienzio | −0,06 punti | +0,15 turni |
| Mara | +0,35 punti | −0,01 turni |
| Celestina | **−6,55 punti** | **−2,76 turni** |
| Piera | **+10,40 punti** | **+0,89 turni** |
| Beppe | −0,18 punti | +0,48 turni |

Il caricamento di Celestina prolunga lo specchio e ne aumenta le patte con questi bot; quello di Piera le riduce, senza portarle
sotto soglia. Per Piera, togliere solo il recupero di A aggiunge **9,30 punti** di patte e 0,66 turni; togliere solo la ricerca
sposta lo specchio di +0,09 punti e −0,03 turni. Il principale segnale misurato è il recupero di A. I delta piccoli restano
descrittivi, non prove di un vantaggio universale. Tutti gli incontri con/senza coppia sono nella tabella delle ablazioni.

Le patte non vengono attribuite al solo ordine. L’osservatore registra l’ultimo danno che porta ogni personaggio da salute
positiva a zero, distinguendo avversario, sé e fine turno; per i danni avversari conserva il gruppo fissato dopo i costi.
Nel campione finale di 6.400 partite per specchio:

- **Celestina:** 1.419 patte, 936 con almeno un danno a sé letale; 383 con due danni avversari nello stesso gruppo.
- **Piera:** 1.180 patte, 828 con almeno un danno a sé letale; 352 con due danni avversari nello stesso gruppo.
  714 patte hanno entrambe ad A=0. La differenza di A finale è zero in 2.350/6.400 partite, contro 4.065/6.400 nel giro 1.
- **Beppe:** 532 patte, 378 con due danni avversari nello stesso gruppo. La matrice principale resta sotto il 10%.

Non compaiono patte con due danni avversari letali da gruppi diversi. I contatori di presenza di danno nell’ultimo turno
(`drawWith…`) sono conservati come dati diagnostici, ma non sono usati per queste attribuzioni causali. Le proporzioni del
campione da 400 semi non vanno confuse con quelle definitive delle matrici da 2.000.

## Listino di priorità e A rimisurato

[Rapporto completo](sb-16e/sb11b-listino-priorita+allerta.md) e [JSON](sb-16e/sb11b-listino-priorita+allerta.json).
Bozza finale, D50, **àncora 7 HIT** di D38; cinque contesti derivati dagli starter con quattro slot sostituiti dalle àncore,
come nel listino precedente. Quattro stili, stesso stile sui due lati: aggressivo, prudente, risorse e com. Dieci bisezioni di
priorità 0/2 contro 1, trenta curve A (−10, −3, −1, +1, +3, +10), **752.000 partite**. Bisezione 400 e griglia/curve 2.000
partite per stile; semi disgiunti dichiarati nel rapporto. L’opzione `sim.sb16eTiming` estende solo le misure richieste;
senza opzione restano ordine, contesti e tre stili storici. Il nuovo test controlla anche gli stili effettivamente giocati.

`x` è il danno della sonda che pareggia una gratuita da 7 HIT a priorità 1. Un `x` più basso indica che la precedenza compensa
del danno in meno. Quote A sulle decisive, 8.000 partite per punto della curva:

| Contesto | x a priorità 0 | x a priorità 2 | Quota con −1 A | Quota con +1 A | Gradino −1→+1 A |
|---|---:|---:|---:|---:|---:|
| Spazienzio | 7,364 | 6,755 | 0,4703 | 0,4892 | +1,89 punti |
| Mara | 7,223 | 6,545 | 0,4772 | 0,5231 | +4,59 punti |
| Celestina | 6,957 | 6,859 | 0,4524 | 0,5522 | +9,98 punti |
| Piera | 7,228 | 6,602 | 0,4897 | 0,4886 | −0,11 punti |
| Beppe | 7,428 | 6,760 | 0,3902 | 0,5912 | +20,10 punti |

Le compensazioni di priorità di queste sonde restano entro circa mezzo HIT; non sono un prezzo definitivo per un colpo da 40
che diventa letale prima del gruppo successivo. **A non ha un prezzo unico:** Beppe e Celestina hanno un gradino evidente,
Piera non mostra un segnale a ±1 ma passa da quota 0,4308 a 0,5490 fra −10 e +10. Per Mara si va da 0,3788 a 0,6045.
Gli intervalli e gli altri punti sono nel JSON. La colonna dei fit per stile del rapporto mantiene i tre euristici storici;
il fit complessivo e i conteggi grezzi per punto includono anche com.

**Correzione della configurazione:** una prima misura (`listino` nel registro) ha usato il default storico 10 HIT e i tre
euristici interni. Non viene adottata come listino D38. È rifatta esplicitamente a 7 HIT, con quattro stili effettivi
(`listino-7`); il primo costo resta nel budget e i dati preliminari sono in `%TEMP%\bm-sb16e\listino-10`.

## Preparazione di SB-16f: lettura del client, senza modificarlo

Il profilo `bozza` usa D50 come documentato in SB-16c. `Move.recordSearch` pubblica la ricerca nel `moveReport`; una mossa a terra
pubblica nello stesso rapporto `voided: a terra`. I campi dedicati `searchedFor`, `searchFound`, `voidReason` sono invece `JsonIgnore`.
Il test `clientReceivesSearchAndVoidOnlyInServerText` controlla il confine JSON pubblico.

Il client web rende quei messaggi in `table.tsx`, nella sezione richiudibile **Ultimo turno → Testo del server (in inglese)**.
La prima parte italiana (`roundReport`) dice solo «Annullata durante il round (la vista non dice da quale mossa)»; `timeline`
mostra le pescate avversarie come dorsi e non tratta la ricerca pubblica come eccezione. Dunque l’informazione esiste nel testo
tecnico, ma non è presentata direttamente nel flusso della prova umana. Controllo statico e test di serializzazione; nessuna
prova visiva, avvio applicativo, Playwright o modifica al client.

## Verifiche e chiusura

**Verifiche economiche finali verdi**, [riepilogo](sb-16e/checks.json). La
[prima esecuzione](sb-16e/checks-initial.json) conserva il rosso storico poi corretto, descritto sopra; il rilancio della suite
è motivato dalla correzione della fixture, senza cambiare l’atteso 8,5.

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | Server **711 test, 0 falliti/errori, 9 saltati** (misure a richiesta); client-debug **37/37** |
| `python scripts/check-rules.py` | Verde, regolamento 1.13 e Set Base 0.1, 39 carte e un token, SQLite integro |
| `./client-web/run.ps1 -Task Test` | **333/333** |
| `./client-web/run.ps1 -Task Build` | Verde, avvisi del bundler senza errore di build |
| `./client-web/run.ps1 -Task Size`, `BM_OUT` in TEMP | JS gzip **350.290 byte**, totale **1.760.434**, texture **27.729.048**; tetti ordinari e C4 rispettati |
| `python scripts/check-links.py` | **284 documenti, 0 link rotti**; controllo ripetuto sui documenti finali |
| `git diff --check` | Verde, ricontrollato prima del commit |
| Tre banchi principali e tutte le ablazioni | Otto invarianti e tetto delle bound senza violazioni; zero partite al limite |
| Mutazioni sulla logica nuova di misura | **6/6 rilevate** dai test previsti, sorgenti ripristinati; [elenco](sb-16e/mutations.json) |
| Caso storico della bound sul commit di base | **1/1**, [prova e isolamento del classpath](sb-16e/base-proof.json) |

I nove test aggiunti comprendono sette test ordinari e due misure a richiesta. I valori storici e la modalità normale del
listino rimangono coperti. I parametri dei controlli, le soglie di quota/patte, le durate degli stati, i pesi del tetto, il limite
di turni e le liste degli starter sono invariati. Numeri aggiornati solo nei punti dichiarati, sotto D38/D53.

**Rossi finali tecnici: nessuno.** I criteri di bilanciamento falliti sono dichiarati come STOP, non trasformati in verdi.
Nessuna voce nuova o chiusa nel registro dei rossi noti. Il rosso temporaneo della fixture e il problema della copia esportata
sono descritti con correzione e prova, non nascosti da un atteso cambiato.

**Non verificato:** contesto Spring completo (`TestServerContext`), avvio reale del profilo e prova visiva del client,
Playwright (esclusa dal brief), partite umane e FFA. Test unitari verdi non attestano l’avvio applicativo.
Il giudizio sul ritmo, le letture e il divertimento resta al proprietario in SB-16f, dopo le decisioni qui proposte.

Le evidenze minificate e i riepiloghi sono circa **2,3 MB**, entro l’indicazione di 3 MB. Gli snapshot `round-N/draft.json`
conservano i tre profili effettivamente misurati; il digest della fonte originaria è nella matrice. Ablazioni complete estese,
log, dati preliminari e copia di base restano in `C:\Users\PEDM17\AppData\Local\Temp\bm-sb16e`.
[`run.ps1`](sb-16e/run.ps1), [`summarize.py`](sb-16e/summarize.py), [`mutations.ps1`](sb-16e/mutations.ps1) e
[`verify.ps1`](sb-16e/verify.ps1) rendono ripetibili i lotti e i riepiloghi. Nessun push.

**Allineamento finale:** fetch riuscito, origin/main resta a `f34bb7c`. Durante la fase è arrivato sul checkout il commit locale
`a825280`, di soli documenti su identikit, flavour e carriera; è conservato senza interventi e non cambia codice o bozza misurati.
La base per rivedere il solo commit SB-16e è quindi `a825280`, mentre la base delle misure e della prova storica resta `f34bb7c`.

## Proposta dopo lo STOP, non attuata

Il tetto di **tre giri** è raggiunto, anche se resta tempo nel budget di calcolo: il residuo non autorizza un quarto giro.
La proposta è un **nuovo lotto esplicitamente autorizzato**, un solo giro e al massimo 30 minuti, con controllo attuale e tre
varianti prefissate: solo A del caricamento di Piera, solo danni a sé delle due last resort, entrambi. Stessi semi e matrice completa.

- **Un altro e arrivo: +20→+35 A**, conservando +15 L, ricerca ed esposizione. Esempio deterministico: Piera a inizio partita
  ha A=15 e L=10; senza altri effetti, se carica e sopravvive al primo turno arriva al successivo con A=38 e L=12, contro A=23 oggi. Può precedere una Celestina
  rimasta ad A=35 nel turno del colpo; il gruppo del caricamento resta quello fissato prima dei guadagni.
- **L’ultima dose e L’ultimo giro: danno a sé 5→2**, senza modificare danno avversario, gratuità, priorità o composizione.
  I dati motivano una prova del danno a sé; non dimostrano che tutte le morti proprie siano di queste due carte. Anche Testata e
  altri danni propri possono contribuire, e non si promette che il 10% sarà raggiunto.

Nessuna variante è adottata o simulata in SB-16e. Se anche il lotto proposto non basta, i dati tornano al proprietario per un
ridisegno esplicito. Il giudizio umano sul ritmo e sulle letture resta di SB-16f.

## Domande numerate al proprietario

1. **Autorizzi il nuovo lotto numerico proposto (un giro, 30 minuti)** su +35 A di Un altro e arrivo e 2 danni a sé delle last
   resort di Celestina/Piera, con le tre varianti prefissate e tutte le soglie invariate? Il limite di SB-16e è esaurito.
2. **Prima di SB-16f approvi il minimo intervento di leggibilità:** esporre nella vista del playground binding/esito della
   ricerca e motivo dell’annullamento come campi strutturati opzionali; nel client rendere ispezionabile la carta pubblicamente
   trovata riusando la pesca esistente e scrivere «annullata: a terra» nel riepilogo italiano? Oggi entrambe le informazioni si
   trovano solo nel testo inglese richiudibile; non basta per la lettura ordinaria della prova. Nessun intervento è fatto qui.
