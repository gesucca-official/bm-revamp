# C4-5a-prep — Specifica proposta del ritaglio

4 novembre 2026. **Specifica per il blocco successivo, non implementazione né prova di rendering.** Si applica allo sfondo; le coordinate dei posti e delle carte non devono seguire il ritaglio dell'immagine. Fonti: [C4-5a, D6, D9, D11](../../../client-c4-plan.md), [direzione visiva](../../../client-roadmap.md#direzione-visiva-e-interazioni), [scene.ts](../../../../client-web/src/scene.ts), [readability.ts](../../../../client-web/src/readability.ts).

## Base letta e metodo

HEAD al momento della lettura: 2fb52e4337fb442f5cafcfe7648b175e0740559a. Poiché un'altra sessione lavora sul client, questi numeri descrivono questa fotografia dei sorgenti, non quelli che saranno necessariamente presenti all'integrazione:

| File | SHA-256 dei byte letti |
|---|---|
| client-web/src/scene.ts | 2faf1c1f1ae413ddfd97cf3950c2fb0678176071046aa4e2142fb1f7ba12cff9 |
| client-web/src/readability.ts | f025e4aa1e294c1ab1f8b93ec744e143d0caa5a49fa5be84356cc7b6198f7879 |

Lettura del codice e calcoli delle sue funzioni pure con Node locale 24.13.0, script nella cartella temporanea di sistema, **fuori dal repository**. Nessuna suite, server, Playwright o verifica applicativa eseguita. Il calcolo di tableLayout usa internamente fitScale e il suo criterio geometrico layoutProblems; non è un risultato di test o una partita reale. Tabelle arrotondate a 0,1 px, percentuali di ritaglio a quattro decimali.

Dimensioni riferite alla **scena** w×h ricevuta da resize, in pixel logici del client, non all'intero schermo fisico né necessariamente alla finestra con le barre del browser. In scene.ts, inizializzazione e listener usano host.clientWidth/host.clientHeight; il renderer imposta risoluzione min(devicePixelRatio, 2). Le tre misure richieste sono assunte come dimensioni del contenitore della scena.

Stato attuale: scene.ts carica /art/table.webp e resize assegna indipendentemente background.width=w e background.height=h (riga 284 nella fotografia letta). Il README C0-R2 documenta WebP 1672×941; anche l'header del PNG sorgente letto è 1672×941. Osservati direttamente table.png e duel.png R1: tavolo dominante, sedute bordeaux lungo il bordo superiore, posacenere verde e bicchieri periferici. Non sono state campionate tinte o misurate le sagome delle sedie.

## Sorgente e derivata consigliate

**Proposta compositiva:** originale opaco **2560×1000, rapporto 2,56:1**; derivata distribuita **2048×800**, stesso rapporto. Conservare il sorgente generato senza alterarlo e tracciare le trasformazioni separatamente. Se lo strumento restituisce altre dimensioni, annotarle e ricalcolare il ritaglio prima di integrare; non deformare per raggiungere i numeri richiesti.

La larghezza è scelta per conservare la fascia alta delle sedute a 750×292. Una sorgente 16:9 con cover centrato a quella misura perderebbe circa il 15,39% dell'altezza su ciascun lato; anche 2160×1000 perderebbe il 7,952% sopra e sotto. Con 2,56:1 si sacrifica soprattutto larghezza sulle scene meno larghe. Il tavolo resta dominante: non è un invito a reinventare il bar o disegnare un panorama.

La derivata 2048×800 copre 1366×768 senza ingrandimento a risoluzione logica 1× (fattore 0,96). **Non garantisce dettaglio nativo a DPR 2**. Peso compresso e qualità percepita sono ignoti fino alla generazione e conversione. Stima aritmetica RGBA, secondo la convenzione di size.mjs: 2048×800×4 = **6.553.600 B = 6,25 MiB**, contro 1672×941×4 = **6.293.408 B**, aumento **260.192 B**. Non è una misura di memoria GPU né del totale della build. L'originale 2560×1000 richiederebbe 10.240.000 B con la stessa convenzione se distribuito; è invece destinato all'archivio documentale. D9 rivista conserva il tetto complessivo texture di 32 MiB; il margine reale va misurato nel blocco d'integrazione.

## Trasformazione richiesta

Per sorgente di dimensioni Ws×Hs e scena W×H:

~~~text
s = max(W / Ws, H / Hs)
larghezza disegnata = Ws * s
altezza disegnata   = Hs * s
offsetX = (W - Ws * s) / 2
offsetY = (H - Hs * s) / 2
xScena = xSorgente * s + offsetX
yScena = ySorgente * s + offsetY
~~~

Scala uniforme sui due assi, centratura, taglio ai limiti della scena; nessuna banda vuota, nessuno stiramento. Gli offset sotto presuppongono origine dello sprite in alto a sinistra (anchor 0,0); con anchor diverso applicare l'equivalente. Lo sfondo resta dietro world, aimLayer e fx, come nell'ordine letto in scene.ts. Nessuna traslazione del layout di gioco.

| Scena | Rapporto esatto (circa) | Scala da 2560×1000 | Dimensione disegnata | Offset X; Y | Intervallo sorgente visibile X | Intervallo sorgente visibile Y |
|---|---:|---:|---|---|---|---|
| 1366×768 | 1,77865 (1,78:1) | 0,768 | 1966,08×768 | −300,04; 0 | 15,2608–84,7392% | 0–100% |
| 844×390 | 2,16410 (2,16:1) | 0,39 | 998,40×390 | −77,20; 0 | 7,7324–92,2676% | 0–100% |
| 750×292 | 2,56849 (2,57:1) | 0,29296875 | 750×292,96875 | 0; −0,484375 | 0–100% | 0,1653–99,8347% |

Sono **risultati calcolati condizionati** a sorgente 2,56:1 e cover centrato, non misure di un'immagine generata. La derivata 2048×800 dà gli stessi intervalli percentuali e le stesse dimensioni disegnate, con scale 0,96; 0,4875; 0,3662109375.

## Zona sicura e sedute

Intersezione matematica dei tre ritagli: **X 15,2608–84,7392%; Y 0,1653–99,8347%**. Zona sicura prudenziale proposta, centrale in entrambi gli assi: **X 17–83%; Y 2–98%**, cioè 66% della larghezza e 96% dell'altezza. “Sicura” significa conservata dal ritaglio, **non libera da carte o interfaccia**.

Bordi sacrificabili: fino al 15,2608% per lato orizzontale sulla scena desktop; il 7,7324% per lato a 844×390; lo 0,1653% sopra e sotto a 750×292. Usare comunque i primi/ultimi 2% verticali solo per dettagli sacrificabili, per lasciare margine compositivo. Posacenere, bicchieri, aloni periferici e frammenti di sedute possono essere troncati. Nessuna sedia importante deve dipendere dagli angoli estremi del riferimento attuale.

**Ipotesi da giudicare, non posizione già esistente nell'immagine:** collocare frammenti leggibili di schienale e sgabello presso il bordo lontano, **X 38–48%, Y 1–14%**; la parte fuori zona sicura è sacrificabile. Concentrare gli indizi essenziali (giunto scheggiato, rattoppo del vinile) in **X 40–45%, Y 3–9%**. Altre sedute alle spalle laterali, X 18–30% e 70–82%, Y 3–22%, restano nel ritaglio ma saranno parzialmente coperte dai posti. Sagome e prospettiva devono rimanere credibili: non appoggiare sedie sul tavolo per rispettare una coordinata.

La piccola zona degli indizi essenziali si proietta così:

| Scena | X sulla scena | Y sulla scena | Dimensione disponibile circa |
|---|---|---|---|
| 1366×768 | 486,4–584,7 | 23,0–69,1 | 98,3×46,1 |
| 844×390 | 322,2–372,1 | 11,7–35,1 | 49,9×23,4 |
| 750×292 | 300,0–337,5 | 8,3–25,9 | 37,5×17,6 |

Nei casi statici calcolati sotto questa zona evita gli ingombri dei posti, della mano, delle pile e della scritta. **Non garantisce** che un'intera sedia sia visibile o riconoscibile, né che lo sia durante tutte le animazioni o con un riepilogo sovrapposto. A 750×292 restano pochi pixel: preferire sagome e riparazioni grandi, non cuciture minute. Se l'immagine non comunica “sedute da bar marcio” senza spostare il bar o invadere il piano, serve una nuova prova con prompt tracciato. La visibilità effettiva alle tre misure è da giudicare nel blocco successivo; la misura piccola conserva il ruolo di non regressione di D6.

## Dove il client copre lo sfondo

readability.ts: arrange, fitScale, tableLayout, fan, brandBox, shellBoxes e previewAvoid; scene.ts: draw. Il compatto scatta con h<550: entrambe le scene piccole lo usano. Calcoli con due oppure cinque posti, proprio posto “me” e avversari nell'ordine b/c/d/e, **tre oggetti per posto**, **otto dorsi per ciascun avversario**, **sette carte proprie** come caso geometrico di riferimento. Sono assunzioni di composizione, non affermazioni sullo stato di una partita. fitScale determina i fattori sul caso di tre oggetti; il layout effettivo dipende anche dai conteggi ricevuti.

Coordinate delle tabelle in pixel logici, origine in alto a sinistra, formato **[sinistra, alto → destra, basso]**. I riquadri aggregati dei posti uniscono personaggio, plancia, oggetti e ventaglio coperto (solo avversari); possono contenere spazi di legno non coperti. Sono ingombri nominali, non maschere raster: fan include le rotazioni dei dorsi; rotazioni delle carte personaggio/oggetto, ombre e sporgenze di testi non sono incluse.

| Scena | Fattori duello (me, altri, oggetti, risorse) | Fattori FFA nello stesso ordine |
|---|---|---|
| 1366×768 | 1,50; 1,20; 1; 1,25 | 1,50; 1; 1; 1,25 |
| 844×390 | 1,50; 1; 1; 1,10 | 1,50; 1; 1; 1,05 |
| 750×292 | 1; 1; 1; 1 | 1; 1; 1; 1 |

### Posti nel duello

| Scena | Proprio posto | Avversario |
|---|---|---|
| 1366×768 | [6; 232,9 → 455,5; 708] | [588,9; 0,5 → 1325,5; 325,2] |
| 844×390 | [6; 88,5 → 255; 346] | [314,6; 5,2 → 715; 154] |
| 750×292 | [6; 37,9 → 204; 248] | [272; 5,2 → 662,4; 154] |

### Posti nella FFA a cinque

| Scena | Posto | Ingombro aggregato |
|---|---|---|
| 1366×768 | proprio | [6; 432,1 → 679,7; 673,9] |
| 1366×768 | b, alto sinistra | [111,4; 16,5 → 616,2; 226,5] |
| 1366×768 | c, alto destra | [630,5; 16,5 → 1135,3; 226,5] |
| 1366×768 | d, medio sinistra | [2,6; 249,6 → 510,8; 410,8] |
| 1366×768 | e, medio destra | [767,1; 231,4 → 1271,9; 410,8] |
| 844×390 | proprio | [6; 218,7 → 375,5; 342,9] |
| 844×390 | b, alto sinistra | [76,4; 2,7 → 354,6; 116] |
| 844×390 | c, alto destra | [397,1; 2,7 → 675,3; 116] |
| 844×390 | d, medio sinistra | [3,9; 126,3 → 284,2; 210,7] |
| 844×390 | e, medio destra | [481,5; 111,6 → 759,7; 209,1] |
| 750×292 | proprio | [6; 160,6 → 340; 252,6] |
| 750×292 | b, alto sinistra | [58; 2,7 → 332; 116] |
| 750×292 | c, alto destra | [343; 2,7 → 617; 116] |
| 750×292 | d, medio sinistra | [3,9; 122 → 280; 205,4] |
| 750×292 | e, medio destra | [418; 107,3 → 692; 204,8] |

La zona degli indizi può cadere dentro un rettangolo aggregato senza essere sotto una carta. Esempio FFA desktop b: dorsi terminano a X 413,5; personaggio a X 386,2; oggetti cominciano a Y circa 94,3; la zona X 486,4–584,7, Y 23,0–69,1 resta nel vuoto tra le componenti. Non interpretare il rettangolo aggregato come un pannello pieno.

### Mano, pile e centro

Mano nominale: larghezza carta 214 e altezza 295,32 a 1366×768; 120×165,6 nel compatto. Centro Y = H − altezzaCarta/2 − 6. In draw le carte hanno k=i−(n−1)/2, X=centroX+k×passo, Y=centroY+|k|×3 e rotazione k×0,05 rad; carta alzata: lift 30/18 px, zoom 1,12/1,20. L'inviluppo sotto riprende previewAvoid per sette carte: X=centroX ± (larghezza×zoom+6×passo)/2; alto=centroY−lift−altezza×zoom/2, basso=centroY+altezza/2. Non include curvature, rotazioni e ombre, quindi non è il limite esatto dei pixel disegnati; i valori oltre il bordo non sono refusi.

| Scena / modalità | Centro X; passo | Inviluppo nominale mano alzata | Mazzo proprio | Scarti propri |
|---|---|---|---|---|
| 1366×768 duello | 909,57; 113,81 | [448,3; 419 → 1370,8; 762] | [6; 334,8 → 46; 390] | [54; 334,8 → 94; 390] |
| 1366×768 FFA | 1023,83; 75,72 | [676,8; 419 → 1370,8; 762] | [409,7; 555,5 → 449,7; 610,7] | [409,7; 618,7 → 449,7; 673,9] |
| 844×390 duello | 531,72; 72 | [243,7; 183,8 → 819,7; 384] | [206,4; 136,5 → 232,4; 172,4] | [238,4; 136,5 → 264,4; 172,4] |
| 844×390 FFA | 610,75; 55,08 | [373,5; 183,8 → 848; 384] | [227,5; 265,1 → 253,5; 301] | [227,5; 307 → 253,5; 342,9] |
| 750×292 duello | 472,50; 72 | [184,5; 85,8 → 760,5; 286] | [206,4; 85,9 → 232,4; 121,8] | [238,4; 85,9 → 264,4; 121,8] |
| 750×292 FFA | 546; 45,33 | [338; 85,8 → 754; 286] | [192; 170,2 → 218; 206,1] | [192; 212,1 → 218; 248] |

Le carte dell'ultimo round e i loro autori occupano nel calcolo: duello desktop [556; 220 → 765; 418,4], FFA desktop [580; 236 → 748,9; 410,1], duello 844 [336; 120 → 424,4; 186,2], FFA 844 [376; 96 → 466,6; 185,4]. A 750×292 tableLayout restituisce played=null nei due casi calcolati: limite del layout, non uno spazio da riempire con decorazioni. I primi piani, le frecce, la carta scelta e le strisce di risoluzione occupano aree variabili. Mantenere quindi il centro e la fascia inferiore poco contrastati e senza dettagli essenziali.

### Scritta decorativa e shell

brandBox riserva **[20; 15 → 170; 87]** sul desktop e **[10; 8 → 106; 56]** su entrambe le scene compatte. Sono box logici di readability.ts per evitare sovrapposizioni, **non una misura DOM** del lettering ruotato. La scritta resta separata dal bitmap.

shellBoxes riserva per clock/turno/menu: desktop [1160; 12 → 1350; 58], 844 [686; 6 → 836; 52], 750 [592; 6 → 742; 52]. Indicazione in basso a sinistra: desktop [14; 718 → 244; 756], 844 [10; 352 → 150; 382], 750 [10; 254 → 150; 284]. La conferma usa una fascia dipendente dallo spazio lasciato dalla mano (confirmTextBox); riepiloghi e dialoghi non hanno un'area sempre libera da garantire allo sfondo.

## Cosa è calcolato e cosa resta ipotesi

**Calcolato/letto:** dimensione PNG attuale, assegnazione indipendente width/height, formule cover e relativi tagli per 2,56:1, intersezione dei ritagli, proiezione delle coordinate proposte, ingombri nominali del layout nei casi dichiarati, stime RGBA e hash dei file.

**Proposto, non approvato né verificato visivamente:** dimensioni della nuova sorgente/derivata, margine sicuro 17–83% e 2–98%, collocazione e leggibilità delle nuove sedute, qualità della WebP, riconoscibilità dell'usura, fedeltà artistica, contrasto reale e assenza di coperture in ogni stato. Non sono stati misurati colori, peso del nuovo file, resa a DPR 2 o su iPhone. L'integrazione deve ricalcolare se cambiano sorgente, ritaglio o layout e far giudicare il risultato al proprietario.
