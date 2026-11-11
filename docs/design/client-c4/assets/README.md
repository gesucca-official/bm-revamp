# Inventario degli asset del client web (C4-3, C4-5a)

4 novembre 2026. Registro unico di ciò che `client-web` distribuisce e di come ci è arrivato, secondo la
[regola 10](../../../client-c4-plan.md#regole-di-non-regressione) del piano C4 (nessun asset senza provenienza e licenza) e la
regola 14 (nessun asset dai quattro giochi di riferimento né da Internet con diritti incerti). Il dato è in
[inventory.json](inventory.json); questa pagina lo spiega. Il test `client-web/tests/assets.test.ts` lo confronta con i file.

## File distribuiti da `client-web/public/`

| File | Autore e origine | URL | Versione | Licenza | Modifiche | Destinazione | SHA-256 |
|---|---|---|---|---|---|---|---|
| `art/table.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); condizioni di OpenAI lette il 10 novembre 2026 ([sotto](#condizioni-duso-delle-immagini-generate)) | piano 2, WebP q90, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, piano stirato | `87ee30faf1190af1759533f8c9640b98d3da9377f2d5ce98609129a4fac92d3e` |
| `art/sottobicchiere.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); condizioni di OpenAI lette il 10 novembre 2026 ([sotto](#condizioni-duso-delle-immagini-generate)) | sottobicchiere, WebP q80, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, sprite uniforme non interattivo | `c2927c9515a7bb6301efe3f108f384ed3bdaee9bbf6cae955e71bae88fd2a700` |
| `art/negroni.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); condizioni di OpenAI lette il 10 novembre 2026 ([sotto](#condizioni-duso-delle-immagini-generate)) | negroni, WebP q80, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, sprite uniforme non interattivo | `f718a05da027b7b059ff8e51ad2946ae50d07aca759da18b235bc48b91031fc0` |
| `art/posacenere.webp` | image_gen.imagegen integrato; stringa osservata ChatGPT / gpt-image, versione numerica non esposta (schede sotto) | nessun URL di download, funzione integrata | 4 novembre 2026 | diritti riservati del progetto; termini forniti: «quelli delle immagini generate da te» (fonte proprietario, [dichiarazione](../background/layers/decisione-proprietario.md)); condizioni di OpenAI lette il 10 novembre 2026 ([sotto](#condizioni-duso-delle-immagini-generate)) | posacenere, WebP q80, alfa 100, effort 6, smartSubsample; nessun resize/crop aggiuntivo; metadati rimossi | tavolo, sprite uniforme non interattivo | `de821ed96f5a4842a1b54b0f1ddf7af4766a3f440bf6ce365c413040e9c771b7` |
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
clone pulito. Il modello di O9 è registrato dal C2PA come «ChatGPT gpt-image», versione esatta non esposta; le condizioni d'uso sono [riassunte sotto](#condizioni-duso-delle-immagini-generate).

## Font

**Nessun font è distribuito** e nessuna richiesta di rete li carica (D4). Il tavolo usa **Impact** (ripiego *Arial*, poi il sans-serif del
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

**In C4-3 non erano entrati asset di terzi.** In C4-7 entrano cinque suoni Kenney CC0 1.0 (in C4-7-bis l'esito unico è sostituito da due jingle Kenney CC0, sei suoni in tutto): la home esistente ne indica autore e licenza, senza nuova schermata come richiesto dal proprietario. La licenza è descritta anche qui e nel registro; CC0 1.0 dedica l’opera al pubblico dominio nei limiti di legge. La [licenza completa](https://creativecommons.org/publicdomain/zero/1.0/) e la [fonte Kenney](https://kenney.nl/assets/interface-sounds) sono consultabili online.

**Fuori inventario, per chiarezza.** Le librerie npm incluse nel pacchetto JavaScript (pixi.js 8.22.0, react e react-dom 19.3.1, sockjs-client 1.6.1: MIT; @stomp/stompjs 7.1.1:
Apache-2.0) sono codice, non asset: la regola 10 non le copre. Le loro condizioni di licenza (avviso di copyright da riportare) non sono distribuite con la build:
è un tema di pubblicazione, non verificato qui e non risolto da questo blocco.

## Come entra un nuovo asset

1. Fonte ammessa (regola 14): generato ex novo con registro (D11: prompt committato prima, strumento, modello, data, termini d'uso) oppure licenza esplicita sulla pagina del file.
2. Una voce in `inventory.json` con tutti i campi (il test fallisce se ne manca uno) e l'impronta SHA-256 del file distribuito.
3. Se di terzi: `thirdParty` a `true`, provenienza e licenza accessibili e frase sui diritti corretta; rispettare le condizioni della licenza e il divieto di nuove schermate del blocco, se applicabile.
4. `Size` verde sia contro i limiti rigidi sia contro i tetti di D9.

## Audio C4-7

Cinque file OGG originali di [Kenney Interface Sounds 1.0](https://kenney.nl/assets/interface-sounds), CC0 1.0; nessuna modifica. Dimensioni e SHA-256 per file in [inventory.json](inventory.json); [scelta e consenso](../audio/scelte.md). Il pacchetto ufficiale pesava 834.536 byte e la licenza inclusa dichiara CC0 1.0.

**C4-7-bis.** `confirmation_002.ogg` (esito unico) è tolto. Entrano due file OGG originali di [Kenney Music Jingles 1.0](https://kenney.nl/assets/music-jingles), CC0 1.0, senza modifiche: `jingles_SAX10.ogg` (vittoria, 13.565 byte) e `jingles_SAX07.ogg` (sconfitta e pareggio, 30.900 byte), scelti dal proprietario all'ascolto ([scelta](../audio/scelte.md#scelta-dei-file-dopo-lascolto)). Il pacchetto ufficiale pesava 1.239.525 byte (SHA-256 `b729ba57…77197b8`) e la licenza inclusa (`License.txt`) dichiara CC0. In tutto sei suoni, 72.912 byte.


## Audio C4-7-ter

Scelta del proprietario del 7 novembre 2026: HIT `impactPunch_heavy_001.ogg` da [Kenney Impact Sounds 1.0 (2019)](https://kenney.nl/assets/impact-sounds), CUT `knifeSlice.ogg` da [Kenney RPG Audio 1.0 (2014)](https://kenney.nl/assets/rpg-audio), entrambi CC0 1.0 esplicita sulle pagine ufficiali e nei License.txt inclusi. Copie originali senza conversioni: 10861 B e 15532 B; SHA-256 e metadati individuali in inventory.json versione 4. Pacchetti ufficiali scaricati in Fase A dal normale flusso delle pagine; pesi e impronte in [proposta-colpi.md](../audio/proposta-colpi.md). POISON silenzioso; `drop_004.ogg` rimosso. Sette file audio, 92075 B totali. `confirmation_001.ogg` resta identico: l'attacco di 5 ms è applicato nel codice, non al file. Crediti aggiornati nella home esistente, nessuna nuova schermata.

## Condizioni d'uso delle immagini generate

10 novembre 2026, lettura della regia; **non è un parere legale**. Tutte le illustrazioni del progetto (tavolo, oggetti di scena, atlante delle
carte di O9) sono generate con lo strumento di immagini di ChatGPT (fonte: il proprietario, 10 novembre 2026). Valgono i
[termini d'uso europei di OpenAI](https://openai.com/policies/eu-terms-of-use/) (versione del 16 gennaio 2026, per chi risiede nell'UE):

- **Proprietà dell'output:** l'utente possiede l'output e OpenAI gli cede i propri diritti, nei limiti consentiti dalla legge e solo se
  esistono. Se un'immagine generata sia protetta dal diritto d'autore in Italia è incerto: «diritti riservati del progetto» va letto così.
- **Nessuna unicità:** altri utenti possono ricevere output simili.
- **Divieto:** non si può presentare l'output come fatto da una persona.
- **Uso commerciale:** consentito.
- **Dichiarazione dell'uso dell'IA:** la [policy di condivisione e pubblicazione](https://openai.com/policies/sharing-publication-policy/)
  chiede di dichiararlo in modo chiaro. La pagina pubblica oggi non lo dice (`client-web/src/public.tsx`): da aggiungere in **C4-9**,
  insieme a una frase sui diritti coerente con il punto sulla proprietà.

Le stringhe `license` di `inventory.json` per le immagini dicono ancora «non verificati»: si allineano con la frase della pagina pubblica.

**Riconciliazione di C4-9 (11 novembre 2026).** I 13 file di `client-web/public/` (6 immagini e dati in `art/`, 7 suoni in `audio/`) sono
tutti in `inventory.json` con SHA-256 uguale; il `dist` della build `433dccadf326d201` ha 28 file, gli stessi 13 più codice, stile e
pagina, nessun font. Nessun asset senza registro. Restano **aperte, in attesa del proprietario** ([domande di C4-9](../../../reports/client-c4/c4-9.md#domande-al-proprietario)):
la conferma dei termini d'uso dello strumento di immagini (non verificabili dal repository), la dichiarazione dell'IA nella pagina pubblica
e l'allineamento delle quattro stringhe `license`.
Dichiarazione e stringhe: rimandate dal proprietario l'11 novembre 2026 («Rimanda (b)») a quando il client sarà servito fuori dal locale.
