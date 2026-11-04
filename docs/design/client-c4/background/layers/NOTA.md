# C4-5a-layers — H1 in due livelli, proposta da giudicare

**Aggiornamento C4-5a, 4 novembre 2026:** il proprietario ha scelto **S-piano2**, giudicata la migliore tra le simulazioni: piano stirato, oggetti uniformi e centri proporzionali. [Dichiarazione e termini forniti](decisione-proprietario.md); [decisione nel piano](../../../../client-c4-plan.md#c4-5a--sfondo-e-identità-del-bar-o2), [integrazione e verifiche](../../../../reports/client-c4-report.md#c4-5a--integrazione-dello-sfondo-del-tavolo-o2). Le sezioni sotto descrivono la preparazione precedente: il giudizio sul tavolo vero rimane da dare. I quattro registri scelti ora contengono conversione e termini; dati non esposti o non conosciuti restano non verificati.


4 novembre 2026. H1 è il candidato scelto dal proprietario; questa consegna prepara un piano senza oggetti e tre sprite rigenerati, senza integrarli nel client. Nessun piano o sprite è approvato automaticamente.

## Capacità e provenienza

Skill imagegen, strumento integrato **image_gen.imagegen**: accetta immagini di riferimento e una richiesta di PNG trasparente, ma non espone un parametro per più immagini per chiamata. Qui sono state effettuate **cinque chiamate**, un risultato ciascuna: due piani opachi e tre oggetti su colore chiave opaco, come richiesto. Nessun fallback API/CLI, modello di terzi, immagine esterna o strumento di segmentazione appreso. Nei cinque PNG originali è osservata la stringa **ChatGPT / gpt-image**; versione numerica del generatore, seed e riscrittura interna non esposti. C2PA presente negli originali, firma e certificati non verificati. Termini e condizioni d'uso da verificare dal proprietario.

H1 tracciato in Git, SHA-256 **c8729f36a25cadfff882d090cf9d2c2058bd57c8c7d085af83d26fdeb7d778f8**, 2006×784. Prima delle chiamate sono stati salvati e committati:

- [Prompt piano](../prompt-piano.md), commit **715c1825b2622e0f4edb93947373792a7d06b2a4**, precedente a piano-1 e piano-2.
- [Prompt sottobicchiere](../prompt-sprite-sottobicchiere.md), [Negroni](../prompt-sprite-negroni.md), [posacenere](../prompt-sprite-posacenere.md) e relativi ritagli, commit **61b5bf2ef675cf79c4d6793f69c3b3be4a857b85**, precedente alle tre chiamate.

Il confronto letterale tra i blocchi salvati e le stringhe inviate coincide. [richieste-generazione.json](richieste-generazione.json) conserva testo e parametri effettivi, orari UTC, riferimenti e nomi automatici restituiti. Le schede, derivate dal modello invariato, sono [piano-1](registro-piano-1.md), [piano-2](registro-piano-2.md), [sottobicchiere](registro-sprite-sottobicchiere.md), [Negroni](registro-sprite-negroni.md), [posacenere](registro-sprite-posacenere.md). Il giudizio del proprietario resta vuoto.

## File

| Risultato | Originale invariato | Dimensioni | Byte |
|---|---|---|---:|
| Piano 1 | [piano-1.png](piano-1.png) | 2006×784, opaco | 2.422.044 |
| Piano 2 | [piano-2.png](piano-2.png) | 2006×784, opaco | 2.414.884 |
| Oggetto sottobicchiere | [fondo originale](sprite-sottobicchiere-fondo.png) | 1254×1254, opaco | 1.567.430 |
| Oggetto Negroni | [fondo originale](sprite-negroni-fondo.png) | 1254×1254, opaco | 1.834.871 |
| Oggetto posacenere | [fondo originale](sprite-posacenere-fondo.png) | 1254×1254, opaco | 1.805.147 |

I piani hanno le dimensioni richieste. Per gli oggetti erano richiesti 1024×1024; il servizio ha restituito 1254×1254. Nessun originale è stato ritoccato o ricompresso. Gli sprite con alfa sono file distinti:

| Sprite | PNG RGBA | Byte | Dimensione nominale nello spazio H1 |
|---|---|---:|---|
| [sottobicchiere.png](sottobicchiere.png) | 937×630 | 1.238.800 | 243,917×164 |
| [negroni.png](negroni.png) | 834×962 | 1.679.440 | 247,946×286 |
| [posacenere.png](posacenere.png) | 973×844 | 1.660.712 | 343,547×298 |

[metadati-file.json](metadati-file.json) riporta formato, dimensioni, byte e SHA-256 completo di **ogni immagine** prodotta, compresi originali, sprite, riferimenti e anteprime. Non è l'inventario degli asset distribuiti, che non è stato modificato.

## Riferimenti, centri e riquadri esclusi

Tre ritagli PNG di H1 in [riferimenti/](riferimenti/), prodotti con sharp 0.35.5 senza modello. Coordinate in pixel di H1; riquadri e centri sono **stime manuali sull'immagine**, non una segmentazione precisa né misure del layout del client.

| Oggetto | Ritaglio x, y, larghezza, altezza | Centro assunto x, y | Riquadro escluso dalla deriva x, y, larghezza, altezza |
|---|---|---|---|
| Sottobicchiere vuoto | 145, 590, 330, 194 | 306, 694 | 130, 570, 380, 214 |
| Negroni con sottobicchiere | 1715, 85, 291, 340 | 1880,5, 251 | 1680, 65, 326, 410 |
| Posacenere | 0, 125, 300, 365 | 130, 300 | 0, 110, 340, 410 |

Rettangoli esclusi volutamente più ampi, per includere ombre locali e sporcizia immediata: rendono la misura conservativa rispetto alla deriva vicino agli oggetti. Il posacenere e il bordo del sottobicchiere del bicchiere sono parzialmente tagliati da H1: le continuazioni rigenerate non hanno un riferimento completo verificabile. In particolare il centro del posacenere è incerto perché la sua sagoma originale completa non è visibile. Hash dei ritagli e coordinate complete in [geometria-riferimenti.json](geometria-riferimenti.json).

Le altezze nominali H1 usate per la prova sono 164, 286 e 298 px. Ciascuno sprite viene normalizzato con **un solo fattore**, altezza nominale divisa per l'altezza del suo PNG ritagliato; la larghezza segue le proporzioni rigenerate. Il posacenere completo risulta largo circa 343,55 px e viene in parte tagliato dal margine sinistro, anziché comprimere la sua sagoma entro il solo frammento visibile in H1. Non sono dimensioni definitive per il client.

## Deriva misurata del piano

Entrambi i piani e H1 sono confrontati su una griglia comune RGB **1000×391** (larghezza 1000, altezza proporzionale arrotondata, Lanczos3). Esclusa l'unione dei tre riquadri, riportati su questa griglia con estremi arrotondati verso l'esterno: **88.872 pixel esclusi**, **302.128 confrontati**. Nessun riallineamento elastico o correzione di colore.

Per ogni pixel confrontato, deviazione = massimo del valore assoluto della differenza tra i tre canali RGB a 8 bit; si conta quando è **strettamente maggiore di 16/255**. Questa è una soglia numerica dichiarata, non una misura percettiva Delta E né un test applicativo.

| Piano | Pixel oltre 16 | Percentuale | Pixel oltre 32 | Percentuale oltre 32 | Errore medio assoluto per canale | RMSE |
|---|---:|---:|---:|---:|---:|---:|
| piano-1 | 127.950 | 42,3496% | 60.895 | 20,1554% | 12,2642 | 21,3094 |
| piano-2 | 35.228 | 11,6600% | 8.170 | 2,7042% | 5,1968 | 9,1432 |

**Piano-2 è più fedele secondo entrambe le soglie e l'errore medio**, quindi è usato soltanto per costruire le anteprime richieste. Non è una scelta al posto del proprietario. [misure.json](misure.json) contiene i numeri; mappe [piano-1](anteprime/deriva-piano-1.webp) e [piano-2](anteprime/deriva-piano-2.webp): rosso = differenza amplificata, blu = regioni escluse.

Osservazione visiva: entrambi rimuovono i tre gruppi e ricostruiscono il piano; piano-1 cambia più estesamente riflessi e venature. Piano-2 conserva meglio la trama, ma non è identico a H1 fuori dalle zone rimosse, come conferma l'11,66%. Il bordo sotto il sottobicchiere è una ricostruzione: in H1 quel tratto era nascosto, quindi la sua curva autentica non è verificabile. Persistono aloni di bicchieri e sporco propri del legno, non vanno confusi automaticamente con residui degli oggetti rimossi.

## Chiave colore, alfa e controllo dei bordi

Fondi richiesti: **blu puro RGB 0,0,255** per sottobicchiere e posacenere; **verde puro RGB 0,255,0** per Negroni. Il fondo reale restituito varia leggermente: ad esempio ai campioni d'angolo sono stati letti blu 1,5,247 e verde 20,242,17. Anche il margine chiesto del 15% non è rispettato esattamente in tutti i lati, ma gli oggetti rigenerati non risultano tagliati.

Algoritmo deterministico scritto per questa consegna, senza librerie di segmentazione o modelli:

1. Per canale chiave k, dominanza d = canale k meno il massimo degli altri due. Se d>10, alfa stimata = clamp(1−d/255); altrimenti alfa=1. Valori di alfa sotto **0,12** vengono azzerati per eliminare le variazioni residue del fondo.
2. RGB ricostruito sottraendo il contributo del colore chiave con l'alfa stimata; sui pixel a alfa parziale l'eccesso del canale chiave viene limitato al massimo degli altri due (spill).
3. Conservazione della componente connessa maggiore (4 vicini): rimossi 0 pixel isolati per sottobicchiere, 4 per Negroni, 0 per posacenere.
4. Estensione del colore del bordo di 2 px nelle regioni trasparenti vicine; feather alfa con filtro binomiale separabile **3×3, raggio 1 px**, transizione di circa 2 px; ritaglio alla sagoma alfa con margine 3 px.

Questa non è un'estrazione fisica perfetta dei colori originali: la soglia può perdere dettagli molto fini, e il clamp può alterare i colori della frangia. Il processo ha corretto una prima estrazione con residui ai margini; le immagini originali sono rimaste invariate.

Controlli numerici finali sui tre fondi — chiaro **#f2eee5**, scuro **#141414**, legno campionato da H1:

- **0 pixel a alfa zero modificano il fondo**, per tutti e nove i compositi.
- **0 pixel a alfa parziale hanno dominanza residua della chiave >20** dopo la pulizia, per ciascuno sprite.
- **0 pixel visibili sui bordi esterni degli originali quadrati** dopo la pulizia.
- Differenza massima tra compositing sharp e formula alfa diretta: **1 livello RGB**, su tutti i fondi.

Dati in [controllo-bordi.json](controllo-bordi.json); tavole [sottobicchiere](anteprime/bordi-sottobicchiere.webp), [Negroni](anteprime/bordi-negroni.webp), [posacenere](anteprime/bordi-posacenere.webp), senza ombre aggiunte. Questi numeri non certificano l'assenza percettiva di aloni.

**Osservazione visiva:** sulle tavole non noto frange blu/verdi evidenti; resta il contorno scuro illustrato, che sul fondo chiaro può apparire come un bordo nero. Le macchie, le scheggiature, la disposizione dei mozziconi, alcuni riflessi e le sagome non sono identici a H1. Il posacenere è più completo e ha dettagli ricostruiti. Il bicchiere è ben leggibile su fondi diversi ma risulta molto coprente, con una tinta calda incorporata nel vetro invece di trasmettere realmente il fondo. Il sottobicchiere è più stretto nella normalizzazione per altezza e il bordo disegnato può ricordare un piattino più di un cartoncino sottile. Sono punti da giudicare, non fedeltà esatta dichiarata.

## Ombre proposte, separate dagli sprite

Nessuna ombra proiettata è incorporata intenzionalmente nei tre sprite. Nelle sole simulazioni il codice disegna ellissi scure **#100905**, sfocate e separate, prima di disegnare gli oggetti. Non sono metadati di ombre reali misurate da H1.

| Sprite | Larghezza ellisse in px H1 | Altezza | Offset dal centro sprite | Alfa | Sigma gaussiana in px H1 |
|---|---:|---:|---|---:|---:|
| Sottobicchiere | 175,62 | 9,02 | dx=0; dy=29,52 | 0,18 | 3 |
| Negroni | 198,36 | 22,88 | dx=0; dy=122,98 | 0,23 | 3 |
| Posacenere | 274,84 | 23,84 | dx=0; dy=128,14 | 0,23 | 3 |

Dimensioni e offset scalano con lo stesso fattore uniforme dello sprite; nella rasterizzazione sigma è almeno 0,3 px. Per il sottobicchiere l'ellisse è spostata verso la porzione appoggiata al piano, senza tentare un'ombra reale sulla parte sospesa. L'ellisse semplice non si adatta alla curvatura del bordo e può non dare contatto fisicamente convincente: da giudicare. Ordine di composizione: piano, tutte le ombre, tutti gli sprite; nessun mascheramento degli sprite dietro il tavolo.

## Formule proposte e simulazioni

Spazio di riferimento H1: W0=2006, H0=784. Per uno sprite i: centro stimato (xi,yi), dimensioni PNG (wi,hi), altezza nominale H1 Hi. Normalizzazione uniforme ni=Hi/hi. Le dimensioni di riferimento sono (wi×ni, hi×ni).

Per scena W×H:

- **S, piano stirato:** sx=W/W0, sy=H/H0. Piano disegnato W×H. Centro sprite (xi×sx, yi×sy); scala uniforme aggiuntiva **s=√(sx×sy)**; dimensioni sprite (wi×ni×s, hi×ni×s).
- **C, cover uniforme:** s=max(W/W0,H/H0), ox=(W−W0×s)/2, oy=(H−H0×s)/2. Piano scalato uniformemente di s e centrato. Centro sprite (xi×s+ox, yi×s+oy); dimensioni (wi×ni×s, hi×ni×s).
- **Confronto:** H1 intero stirato W×H, senza separazione: gli oggetti si deformano insieme al legno.

Centri riferiti al centro del riquadro dello sprite ritagliato. In una futura implementazione, ancoraggio centrale e scala uniforme devono restare separati dallo stiramento del piano. Le anteprime arrotondano le dimensioni a pixel interi; le differenze di un pixel non sono una scala anisotropa intenzionale. Gli sprite sono tagliati solo dai limiti della scena. Il sottobicchiere rimane sopra il piano, mai occultato dal bordo.

| Scena | sx | sy | Scala sprite S | Scala C | Offset C |
|---|---:|---:|---:|---:|---|
| 1366×768 | 0,680957 | 0,979592 | circa 0,8167 | 0,979592 | −299,531; 0 |
| 844×390 | 0,420738 | 0,497449 | circa 0,4575 | 0,497449 | −76,941; 0 |
| 750×292 | 0,373878 | 0,372449 | circa 0,3732 | 0,373878 | 0; −0,560 |

I valori completi, le posizioni e le dimensioni effettivamente disegnate sono in misure.json. Le scale S riportate qui sono approssimative.

[Scheda di composizione](scheda-composizione.webp), tre righe per le tre scene e tre colonne: H1 stirato, S, C. File singoli in anteprime/, nominati con misura e modalità, WebP qualità 80; scheda 1848×1038 qualità 77. Solo revisione, nessun asset da distribuire scelto. Tutti gli script temporanei sono fuori dal repository; runtime Node 24.13.0, sharp 0.35.5/libvips 8.18.7.

### Cosa si vede alle tre misure

- **1366×768:** H1 stirato allunga verticalmente gli oggetti; S mantiene le forme rigenerate ma queste non hanno esattamente la stessa prospettiva suggerita dal piano deformato. Il sottobicchiere S appare meno sporgente rispetto al suo ingombro in H1 stirato: il suo raggio verticale uniforme è minore di circa 13 px rispetto a quello stirato, pur mantenendo il centro. Il bordo ricostruito non segue il suo nuovo contorno in modo identico. In C posacenere e Negroni escono quasi interamente dalla scena; il sottobicchiere è molto tagliato a sinistra.
- **844×390:** S produce differenze meno forti e gli oggetti restano riconoscibili, con taglio ai lati; il raccordo sottobicchiere/bordo è ancora approssimativo, con circa 3 px in meno di raggio verticale rispetto allo stirato. In C gran parte del posacenere e del bicchiere è tagliata. Il sottobicchiere resta più visibile rispetto al desktop cover.
- **750×292:** S e C sono quasi coincidenti per scala e posizione; gli oggetti si deformavano già poco in H1 stirato perché il rapporto è vicino al nativo. La differenza più evidente viene dalla rigenerazione: posacenere completo/parzialmente tagliato in modo diverso, dettagli del bicchiere e sagoma del sottobicchiere. La maggiore dimensione del posacenere non è una deformazione anisotropa: deriva dalla ricostruzione della sagoma prima tagliata.

La posizione proporzionale del centro **non garantisce da sola** l'appoggio sul bordo quando cambia il rapporto della scena: forma del piano, profilo ricostruito e dimensioni uniformi dello sprite non si muovono tutti nello stesso modo. Queste prove mostrano il problema, non introducono un algoritmo di aggancio definitivo. Le ombre sono indicative e non risolvono da sole prospettiva e contatto.

## Giudizio richiesto e limiti

Il proprietario deve giudicare: quale piano conserva l'identità di H1; fedeltà e spessore dei tre oggetti; eventuali aloni del contorno; opacità del vetro; ombre; raccordo del sottobicchiere col bordo; compromesso tra S e C alle tre misure. Piano-2 è soltanto il riferimento delle simulazioni perché numericamente più fedele. Nessuna approvazione del proprietario è stata inventata.

Non verificati: leggibilità sotto posti, plance, pile, mano, carte e scritta decorativa nel layout reale; interazioni, prestazioni, memoria GPU, build, resa su dispositivo fisico, contrasto applicativo. Nessun server, Playwright o verifica applicativa eseguiti; nessun file del client o delle altre sessioni modificato, nessun inventario condiviso aggiornato, nessun push.
