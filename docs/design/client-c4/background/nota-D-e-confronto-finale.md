# Sintesi D e confronto di tutte le proposte

4 novembre 2026. A1, B1, C1, D1 e D2 restano candidati non approvati. [Scheda complessiva](scheda-tutti.webp): cinque colonne nello stesso ordine, quattro righe (intero, cover 1366×768, 844×390, 750×292). Annotazioni fuori dalle immagini, nessuna interfaccia sovrapposta.

Il [prompt D](prompt-D.md), committato prima delle chiamate in f5fd5ec, integra le osservazioni precedenti e le richieste del proprietario: forma continua e prospettiva coerente del tavolo; oggetti riconoscibili anche dopo il crop; sottobicchiere vuoto verso l'interno; solo booth laterali e due sgabelli; fascia centrale superiore contenuta; piccoli scarti di posizione; bordeaux conservato; usura leggibile e meno riflessi sul centro. Le vecchie sedie spaiate di A/B restano nel confronto storico: non sono state reintrodotte, perché superate dalla richiesta dei due soli tipi di seduta.

Generazioni indipendenti con identico testo e soltanto table.png C0-R2 e duel.png R1 originali. Hash ricontrollati e coincidenti prima delle chiamate. Nessun candidato precedente allegato, nessuna immagine esterna. Richieste e orari in [richieste-D.json](richieste-D.json).

| Candidato | Carattere e progressi | Limiti osservati |
|---|---|---|
| [A1](candidati/A1.png) | Legno vicino al riferimento; sedute molto spaiate e rattoppi evidenti. | Tipi di sedie ormai superati; riflessi forti; oggetti estremi persi nel crop desktop; meno continuità bordeaux. |
| [B1](candidati/B1.png) | Più memoria delle imbottiture laterali; riparazioni ben distinguibili, oggetti leggibili nell'intero. | Tipi di sedie superati; tassello chiaro vistoso; fascia superiore più esposta; oggetti persi nel crop desktop. |
| [C1](candidati/C1.png) | Booth laterali e due sgabelli compatti; sottobicchiere vuoto spostato verso l'interno. | Sgabelli ancora allineati; posacenere e Negroni quasi scomparsi a 1366×768; piano ancora molto largo e riflettente. |
| [D1](candidati/D1.png) | Oggetti portati all'interno e riconoscibili in tutti i crop; centro meno lucido; sgabello sinistro inclinato e più consumato; bordeaux laterale conservato. | Un piccolo tratto del posacenere resta tagliato nel crop desktop, ma la vasca è leggibile; oggetti più presenti sul piano e possibili coperture dalle carte. Usura sinistra piuttosto evidente. |
| [D2](candidati/D2.png) | Stessi oggetti interni, centro più sobrio e omogeneo; bordo continuo e due soli tipi di seduta. | Sgabelli più regolari e ancora abbastanza allineati; lieve taglio del posacenere nel crop desktop; oggetti più presenti sul piano rispetto a B1. |

Osservazioni visive dell'operatore, non misure di contrasto o giudizio del proprietario. In D1/D2 la silhouette del tavolo appare continua e gli oggetti non sembrano stirati; il tavolo resta un ovale largo. Le differenze di profondità/disordine degli sgabelli sono più leggibili in D1 ma ancora modeste. Gli sgabelli occupano una fascia centrale superiore contenuta; i booth risalgono ed estendono l'ingombro ai lati, quindi il limite indicativo del 12–14% non è rispettato da tutta l'imbottitura laterale. La piccola zona X 40–45%, Y 3–9% non contiene necessariamente tutti gli indizi di usura: la riconoscibilità sotto il layout reale resta non verificata.

In entrambi i nuovi candidati non noto testo, marchi, persone, mani, carte o UI. Non riconosco richiami specifici a giochi esistenti; non è una ricerca esaustiva di somiglianze. Le riparazioni non sono etichette o controlli. La visibilità degli oggetti nelle sole immagini di crop non prova che il client non li copra con le postazioni o con la mano. Il nuovo posizionamento sacrifica parte della precedente perifericità per conservare gli oggetti nel crop centrale.

## File e tracciabilità

- D1: PNG originale invariato 2007×783, 2.634.292 byte; [registro](registro-D1.md).
- D2: PNG originale invariato 2007×783, 2.494.610 byte; [registro](registro-D2.md).
- Gli originali dei cinque candidati totalizzano 13.108.337 byte, sotto 20.000.000; ciascuno sotto 6.000.000. Nessun originale escluso dal repository.
- Dimensioni richieste nel prompt: 2560×1000; non restituite dal servizio. Nessun originale riscalato, ritoccato o convertito.
- [dati-D.json](dati-D.json): formato, dimensioni, byte, SHA-256, scala e offset per i nuovi file e la scheda complessiva.
- Anteprime D1/D2 in anteprime/: intero ridotto a 1000 px e tre cover centrati alle misure esatte, filtro Lanczos3, arrotondamento raster ai pixel interi, sharp 0.35.5/libvips 8.18.7, WebP qualità 76 effort 5. Scheda complessiva 2560×1135, 302.660 byte, colonne da 500 px, qualità 74 effort 5. Script temporaneo fuori dal repository. Tutte le WebP sono solo revisione, non file da distribuire.

Strumento image_gen.imagegen; nei PNG osservato generatore ChatGPT / gpt-image. Versione numerica, seed e riscrittura interna non esposti. C2PA presente, firma e altri dettagli non verificati. Termini d'uso e condizioni lasciati al proprietario; modifiche d'integrazione e giudizio restano vuoti nei registri. I documenti e i candidati precedenti sono conservati.

Il proprietario può ora giudicare tutti e cinque, scegliere un candidato o chiedere ulteriori correzioni. Nessuna scelta automatica, integrazione nel client, modifica a inventario/piano/report, server, verifica applicativa o push.
