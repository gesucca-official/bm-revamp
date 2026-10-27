# Illustrazioni provvisorie (O9)

27 ottobre 2026. Una illustrazione per ognuna delle 40 classi dell'allegato
`rules-catalog.json` (37 carte, 2 personaggi, 1 token), generate ex novo con
imagegen integrato: nessuna immagine da Internet, nessun asset di C0 o del debug,
nessun pixel riusato. Restano i diritti riservati del progetto, senza nuova
licenza né dichiarazione di esclusività dell'output.

| Cosa | Dove |
|---|---|
| Atlante distribuito | [client-web/public/art/atlas.webp](../../../../client-web/public/art/atlas.webp): 2048×1536, 8×6 riquadri da 256 px, WebP qualità 76, 566518 byte |
| Manifest di runtime | [client-web/public/art/manifest.json](../../../../client-web/public/art/manifest.json): griglia, riquadro di ogni `bindingName`, segnaposto |
| Inventario con provenienza | [assets.json](assets.json): per ogni riquadro sorgente, SHA-256, dimensioni, strumento, modello, data e SHA-256 del prompt |
| Rigenerazione | `./client-web/run.ps1 -Task Atlas` (sharp 0.35.5 della toolchain C0) |

**Sorgenti fuori da git.** Su decisione del proprietario i 40 PNG (1254×1254,
circa 117 MB) e `prompts.json` con i prompt letterali sono provvisori e restano
solo in questa cartella sul PC, esclusi da `.gitignore`. In un clone pulito
l'atlante c'è e funziona, ma `Atlas` non può essere rieseguito. La provenienza
resta verificabile con le impronte: SHA-256 di ogni PNG e di ogni prompt in
`assets.json`. Il testo dei prompt non è tracciato. Generazioni: 40 riuscite,
1 scartata, nessuna iterazione di qualità; il modello è registrato dal C2PA come
«ChatGPT gpt-image», versione esatta non esposta dallo strumento.

**Costruzione.** Ogni PNG è ridotto a 252 px (Lanczos3) e circondato da 2 px di
bordo copiato, così il campionamento lineare non raggiunge il vicino. La scena
usa i 252 px interni; l'ispezione (i) mostra il riquadro intero. Ordine:
alfabetico per classe. Il riquadro 40 è il segnaposto neutro, tinta unita
`#30231e` senza disegno, usato per un `bindingName` non presente. Le sette celle
restanti sono libere. Il ridimensionamento è l'unico intervento sull'immagine:
niente ritocchi.

**Tracciabilità.** Lo script verifica che le classi dell'allegato coincidano con
i PNG e che ogni SHA-256 corrisponda a `prompts.json`; altrimenti si ferma.
Il test `tests/art.test.ts` controlla che ogni classe abbia il suo riquadro,
senza duplicati, dentro l'immagine.

Sono illustrazioni provvisorie: C4 le sostituisce dove serve.
