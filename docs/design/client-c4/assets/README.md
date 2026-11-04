# Inventario degli asset del client web (C4-3, C4-5a)

4 novembre 2026. Registro unico di ciò che `client-web` distribuisce e di come ci è arrivato, secondo la
[regola 10](../../../client-c4-plan.md#regole-di-non-regressione) del piano C4 (nessun asset senza provenienza e licenza) e la
regola 14 (nessun asset dai quattro giochi di riferimento né da Internet con diritti incerti). Il dato è in
[inventory.json](inventory.json); questa pagina lo spiega. Il test `client-web/tests/assets.test.ts` lo confronta con i file.

## File distribuiti da `client-web/public/`

| File | Autore e origine | URL | Versione | Licenza | Modifiche | Destinazione | SHA-256 |
|---|---|---|---|---|---|---|---|
| `art/table.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); dettagli non verificati | piano 2, WebP q90, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, piano stirato | `87ee30faf1190af1759533f8c9640b98d3da9377f2d5ce98609129a4fac92d3e` |
| `art/sottobicchiere.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); dettagli non verificati | sottobicchiere, WebP q80, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, sprite uniforme non interattivo | `c2927c9515a7bb6301efe3f108f384ed3bdaee9bbf6cae955e71bae88fd2a700` |
| `art/negroni.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); dettagli non verificati | negroni, WebP q80, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, sprite uniforme non interattivo | `f718a05da027b7b059ff8e51ad2946ae50d07aca759da18b235bc48b91031fc0` |
| `art/posacenere.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); dettagli non verificati | posacenere, WebP q80, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, sprite uniforme non interattivo | `de821ed96f5a4842a1b54b0f1ddf7af4766a3f440bf6ce365c413040e9c771b7` |
| `art/atlas.webp` | Progetto: 40 illustrazioni generate ex novo con imagegen integrato (O9), una per classe dell'allegato | nessuno, non scaricata | 27 ottobre 2026 | diritti riservati del progetto, nessuna licenza concessa | ridotte a 252 px (Lanczos3) con 2 px di bordo copiato, composte 8×6 da 256 px, WebP qualità 76; segnaposto tinta unita | illustrazioni delle carte | `839cffc9…ef956` |
| `art/manifest.json` | Progetto: scritto da `tools/atlas.mjs` e a mano | nessuno | 4 novembre 2026 | diritti riservati del progetto | metadati piano/sprite aggiornati; riquadri invariati | riquadro di ogni `bindingName` | impronta completa in inventory.json |

Le impronte complete sono in [inventory.json](inventory.json). **Provenienze esistenti**, che l'inventario richiama senza ripetere:

- `table.webp`: [registro piano 2](../background/layers/registro-piano-2.md), [sorgente tracciata](../background/layers/piano-2.png).
- `sottobicchiere.webp`: [registro](../background/layers/registro-sprite-sottobicchiere.md), [sorgente RGBA](../background/layers/sottobicchiere.png).
- `negroni.webp`: [registro](../background/layers/registro-sprite-negroni.md), [sorgente RGBA](../background/layers/negroni.png).
- `posacenere.webp`: [registro](../background/layers/registro-sprite-posacenere.md), [sorgente RGBA](../background/layers/posacenere.png).
- Conversione: [parametri, hash/byte prima e dopo, due qualità e controllo alfa](../../../reports/client-c4/c4-5a/conversione.json). Solo riferimenti H1 del progetto e suoi ritagli; hash confrontati con schede e metadati. Altri candidati archiviati, nessuno distribuito. C2PA degli originali presente, firma/certificati non verificati, non conservato nelle WebP.
- Il vecchio `table.webp` C0-R2 resta nella storia: [registro](../../client-c0/r2-assets/README.md), [table.png](../../client-c0/r2-assets/table.png). Le lacune storiche non vengono sanate dalla nuova generazione.
- `atlas.webp`: [illustrazioni O9](../../client-c2/o9-art/README.md) e [assets.json](../../client-c2/o9-art/assets.json) (impronta di ogni
  PNG e di ogni prompt, strumento, modello, data).

**Lacune dichiarate, non nuove.** I prompt letterali di C0-R2 non sono stati conservati (resta una ricostruzione descrittiva). I 40 PNG sorgente
di O9 e i loro prompt sono solo su questo PC, fuori da git per decisione del proprietario: `atlas.webp` è verificabile con le impronte, ma `Atlas` non si riesegue da un
clone pulito. Il modello di O9 è registrato dal C2PA come «ChatGPT gpt-image», versione esatta non esposta; i termini d'uso dello strumento non sono registrati.

## Font

**Nessun font è distribuito** e nessuna richiesta di rete li carica (D4). Il tavolo usa **Impact** (ripiego *Arial Narrow*, poi il sans-serif del
dispositivo); la shell usa **Arial**. Sono caratteri di sistema: non sono un file del repository né della build. Il test controlla che non esistano file di
font, `@font-face` o `@import`, né origini remote negli stili, e che le famiglie nominate siano solo queste. **Impact su iOS: non verificato**; se manca si
accetta il ripiego (D4, D6).

Copertura misurata il 3 novembre 2026 su Windows (tabella `cmap` dei file `impact.ttf`, `arial.ttf`, `arialbd.ttf`, `ariali.ttf`, `ARIALN.TTF`):

| Glifo | Impact | Arial | Che cosa fa il client |
|---|---|---|---|
| → × − ▲ ▼ … — · ∞ • | sì | sì | restano testo |
| ✓ ✕ | **no** | **no** | forme proprie (`symbols.ts`): conferma ✓, annulla e chiudi ×, segno di mossa annullata ✕ |
| ◷ (orologio nel clock di partita) | no | no | resta testo, in HTML: fuori elenco di C4-3, dichiarato |

Su iOS e macOS la copertura non è misurata: i glifi in testo restano quelli che Arial ha nell'insieme WGL4, ma Impact potrebbe non esserci.

## Simboli

Disegnati dal progetto come dati geometrici in `client-web/src/symbols.ts` (e, per i tipi di danno, `DAMAGE_SHAPES` in `readability.ts`): cinque risorse,
sette ruoli, tre tipi di danno e i segni ✓ e ✕. Nessun file e nessuna icona di terzi: D3 (c), con Game-icons riservata alle lacune reali, e non ne è emersa
nessuna (costi, guadagni e immunità si coprono con i simboli delle risorse). Lo stesso dato disegna il tavolo (Pixi) e la shell (SVG).

## Materiali di terzi e crediti

**Nessun asset di terzi è entrato in C4-3**, quindi non c'è una pagina «Crediti e licenze» e la frase sui diritti della home
(«Tutti i diritti riservati…») resta corretta. Se un blocco successivo ne fa entrare uno, la pagina, i testi di licenza distribuiti e la frase si fanno nello stesso
commit, e l'asset entra nell'inventario con autore, URL, versione, licenza e modifiche.

**Fuori inventario, per chiarezza.** Le librerie npm incluse nel pacchetto JavaScript (pixi.js 8.22.0, react e react-dom 19.3.1, sockjs-client 1.6.1: MIT; @stomp/stompjs 7.1.1:
Apache-2.0) sono codice, non asset: la regola 10 non le copre. Le loro condizioni di licenza (avviso di copyright da riportare) non sono distribuite con la build:
è un tema di pubblicazione, non verificato qui e non risolto da questo blocco.

## Come entra un nuovo asset

1. Fonte ammessa (regola 14): generato ex novo con registro (D11: prompt committato prima, strumento, modello, data, termini d'uso) oppure licenza esplicita sulla pagina del file.
2. Una voce in `inventory.json` con tutti i campi (il test fallisce se ne manca uno) e l'impronta SHA-256 del file distribuito.
3. Se di terzi: `thirdParty` a `true`, pagina «Crediti e licenze» raggiungibile dalla home, testo di licenza distribuito, frase sui diritti corretta.
4. `Size` verde sia contro i limiti rigidi sia contro i tetti di D9.
