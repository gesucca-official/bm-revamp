# Risorse della scena C0-R2–R5

27 ottobre 2026. Risorse nuove, prodotte con imagegen integrato prendendo
come riferimento il [duello R1 approvato](../r1/approval.md). Nessun asset
del debug, della prima proposta respinta o dei giochi di riferimento è
stato usato. [Inventario con dimensioni, byte e SHA-256](assets.json).

| Sorgente | Contenuto | Risorsa distribuita |
|---|---|---|
| [table.png](table.png) | Tavolo vuoto illustrato, legno sudicio, bar e decorazioni periferiche | table.webp, 1672×941, qualità 74, 212340 byte |
| [atlas.png](atlas.png) *(in `client-web` sostituito dall'atlante O9, [qui](../../client-c2/o9-art/README.md); resta la prova C0)* | Dodici illustrazioni senza lettering in griglia 4×3 | atlas.webp, 1448×1086, qualità 80, 470490 byte |

L'atlante contiene Bruiser, Junkie, palmo di stop, presa, schiaffo, rabbia,
sguardo, furto e quattro bevande. Alcune illustrazioni sono segnaposto
condivisi per la sola prova: non costituiscono art completa del catalogo.
Cornici, dorsi, titoli, tipi, risorse, costi e priorità sono disegnati dalla
scena usando testo reale. Le PNG R1 intere non diventano zone cliccabili.

[tools/assets.mjs](../../../../client-c0/revision/tools/assets.mjs) usa sharp
0.35.5 soltanto per compressione WebP: niente ritocchi o ridimensionamento.
Il taglio dei riquadri dell'atlante è una selezione di texture nel renderer.
Le sorgenti PNG sono conservate per revisione, escluse dalla build; le due
WebP e il manifest sono inclusi nella misura completa del download.

Le generazioni sono identificate nell'inventario. I prompt letterali R2
non sono stati conservati su disco prima dell'interruzione e non sono più
disponibili nello store della sessione. [prompt-summary.json](prompt-summary.json)
contiene una **ricostruzione descrittiva**, non i prompt originali né una
garanzia di rigenerazione identica. I [prompt R1](../r1/prompts.json) restano
integralmente disponibili. Questa è una lacuna di tracciabilità dichiarata.

Illustrazioni generate ex novo; restano i diritti riservati del progetto,
senza nuova licenza open source o dichiarazione di esclusività dell'output.
Nessun font, audio, pack grafico o immagine esterna aggiunto. Il font della
scena è di sistema. Nomi e testi provengono dal catalogo letto in sola lettura.
