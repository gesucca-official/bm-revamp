# C4-5a-gen — Registro A1

4 novembre 2026. Candidato generato, **non approvato e non integrato**. Scheda derivata da registro-generazione.md, che resta invariato. L'operatore è Codex per istruzione esplicita del proprietario nel compito C4-5a-gen; la generazione non è stata eseguita dal proprietario come originariamente previsto in D11. Nessuna modifica al piano condiviso.

Richiesta effettiva e orari della chiamata in [richieste-generazione.json](richieste-generazione.json); dimensioni, byte, hash degli originali e delle sole anteprime in [dati-file-generati.json](dati-file-generati.json). I campi di termini/condizioni, modifiche d'integrazione e giudizio del proprietario restano intenzionalmente vuoti.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | A1; alternativa [B1](registro-B1.md). Un risultato per prompt; A2/B2 non generati. |
| Operatore della generazione | Codex, assistente di questa sessione; generatore dichiarato nei metadati: ChatGPT / gpt-image. Non è il nome del modello dell’agente operatore. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL della funzione non esposto dallo strumento. |
| Modello dichiarato dallo strumento | Nessun nome nel risultato della chiamata; nel C2PA del PNG: softwareAgent.name = ChatGPT, softwareAgent.version = gpt-image. |
| Versione del modello / build dello strumento, se esposta | Versione più precisa del modello: non esposto dallo strumento. La stringa gpt-image non identifica una versione numerica. |
| Data e ora della generazione, con fuso orario | 4 novembre 2026, 17:19:20 Europe/Rome (UTC+01:00); dichiarazione C2PA c2pa.created: 2026-11-04T16:19:20.549463048Z. |
| Identificativo del job / sessione, se esposto | exec-e16832cd-984a-4f3a-a843-3ad259ce3c68 (identificatore nel nome del file restituito, non un job ID interno certificato); altro job ID non esposto dallo strumento. |
| Commit contenente il prompt prima della generazione | db233d80309e6216c465ec250187819c64962e30 |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-sfondo.md, versione del commit db233d8; git diff db233d8 sul file vuoto prima delle chiamate. |
| Prompt scelto: A oppure B (o revisione già committata) | A, invariato, blocco inglese completo incluso Avoid. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Nuovo candidato con due riferimenti espliciti del progetto; prompt e referenced_image_paths. Classificazione interna generate/edit non esposto dallo strumento. |
| Dimensioni e formato richiesti | 2560×1000, rapporto 2,56:1, PNG opaco preferito, richiesti nel testo. Nessun parametro size/format disponibile nell’interfaccia. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Una chiamata e un risultato; qualità e stile descritti solo nel prompt. Qualità numerica/forza dei riferimenti non esposto dallo strumento. transparent_background=false. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | Solo prompt, referenced_image_paths (i due file sotto, nell’ordine indicato), transparent_background=false; num_last_images_to_include omesso. Nessun altro parametro inviato. |

Il commit preventivo è indicato sopra; la generazione è successiva. Il confronto Git richiesto era vuoto. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Testo integrale inviato, senza aggiunte, con terminatori LF come nella stringa estratta dal file. richieste-generazione.json conserva la stringa effettivamente passata allo strumento.

Testo principale:

~~~text
Create a new empty illustrated table background for the original project Botte Micidiali. Output one opaque landscape image, 2560 x 1000 pixels, aspect ratio 2.56:1, preferably an original PNG. This is background artwork only, with absolutely no lettering or game interface.

Use only the two attached project images. Reference 1, table.png, is the primary reference for the empty table, materials, lighting and composition. Reference 2, duel.png, is the approved art-direction reference only: borrow its hand-inked European comic look, irregular dark contours, restrained painted shading and material texture. Do not reproduce its cards, people, lettering or interface. Preserve the approved bar's identity; do not redesign the venue.

Keep the broad scratched dark walnut and tobacco-brown tabletop filling almost the entire scene, the slightly overhead perspective, rounded table edge, warm worn reflections, sticky glass rings, localized stains and cigarette burns. Keep dusty bottle green, oxblood burgundy and muted petrol accents, with only small worn-ivory details. Match the reference's light direction and subdued atmosphere. Keep the central wood quiet enough for separately rendered cards and player boards to remain readable. Preserve small peripheral bar dressing, such as a chipped green ashtray and stained glass or coaster, as disposable edge details, never as interactive objects.

Correct the seating: replace the elegant, coordinated chairs with cheap mismatched dive-bar furniture. Use chipped plain wooden chair backs, scratched dull metal, cracked burgundy vinyl with a small rough patch, uneven faded paint and a battered stool with a visibly repaired seat. The furniture must look used for decades and repaired cheaply, not curated antique furniture. No polished matching set, decorative carving, luxurious upholstery or refined restaurant seating. Keep the furniture around the table, never on its surface.

Compose for centered aspect-preserving cover crops at 1366 x 768, 844 x 390 and 750 x 292. Extend the horizontal framing, not the proportions of the existing scene. Keep all essential seating identity inside source x=17–83% and y=2–98%. Place a clearly recognizable battered chair-back section and a small repaired stool-seat section near the far rim at the upper middle, roughly x=38–48% and y=1–14% of the source. Concentrate the clearest chipped joint and crude vinyl patch in x=40–45%, y=3–9%. These are composition guides, not visible markings. Show enough of each silhouette to read as cheap seating; do not enlarge them into the playing surface. Keep other seating fragments near the upper left and right shoulders, within x=18–30% and x=70–82%, y=3–22%, accepting partial coverage by the live interface. Left and right outer strips may be cropped away; no essential detail may depend on them. Do not move the table into a new room or make the background a panoramic interior illustration.

Avoid: any text, letters, numbers, pseudo-lettering, signatures, watermarks, logos, commercial brands, people, faces, hands, playing cards, card backs, tokens, counters, boards, HUD, buttons, frames, borders, slots, grids, interface panels, target outlines, fantasy ornaments, gold trim, neon, dominant yellow-and-black colors, photorealistic or 3D-rendered styling, recognizable imagery or visual identity from an existing game. Do not copy any game screenshot or use any external image. No elegant, pristine, matching or designer chairs. No crop guides or technical annotations in the output.
~~~

Campo negativo separato, se usato:

Non usato: il negativo è incluso nel testo principale.


| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Un unico campo prompt; negativi inclusi nel paragrafo Avoid. Nessun campo negativo separato. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna istruzione aggiunta al testo committato; input espliciti limitati alla richiesta conservata in richieste-generazione.json. Contesto interno o istruzioni nascoste del servizio: non esposto dallo strumento. |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | non esposto dallo strumento |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | Nessuna. Testo estratto letteralmente dal file e passato al campo prompt; nessun commit preventivo aggiuntivo necessario. |

## Riferimenti effettivamente allegati

I soli riferimenti previsti per A e B sono table.png C0-R2 e duel.png R1. Percorsi e SHA-256 letti prima della generazione sono nella [tabella di prompt-sfondo.md](prompt-sfondo.md#istruzioni-al-proprietario). Questi sono valori di confronto; la tabella sotto deve descrivere **i byte realmente allegati**, non soltanto quelli che si intendeva usare.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| 1 | docs/design/client-c0/r2-assets/table.png | 42236445205a765c1f09e3e23af96f8078f65951f7c3efd7949d0b0ffb6cee01 | Riferimento principale: tavolo vuoto, materiali, luce, composizione | Nessuna da parte dell'operatore; file originale passato tramite referenced_image_paths |
| 2 | docs/design/client-c0/r1/duel.png | 2aa3497f450117a696b796c7bea8153fe918cf5859867f542e3296396a0bf53e | Riferimento R1 approvato: stile e palette, esclusi i contenuti di gioco | Nessuna da parte dell'operatore; file originale passato tramite referenced_image_paths |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | Entrambe coincidenti prima della generazione; SHA-256 calcolati sui file effettivamente passati come riferimento. |
| Conferma dell'operatore: nessuna immagine da Internet, dai quattro giochi o da asset respinti | Confermato: soltanto i due file elencati. Nessuna immagine esterna cercata o scaricata. |
| Altri input effettivi / dichiarazione esplicita di assenza | Nessun altro file allegato; nessun candidato precedente riutilizzato come riferimento. |

Se il servizio ha modificato gli allegati internamente e lo espone, annotarlo. Non inventare l'hash di una trasformazione interna non accessibile. Nessun riferimento esterno diventa ammesso perché il suo uso è stato annotato.

## Termini d'uso e provenienza esposta

**Termini d’uso e condizioni: da verificare dal proprietario.** I relativi campi, compresa la dichiarazione di licenza, restano vuoti; non è stato accertato quale URL/versione dei termini sia applicabile all’account. I soli dati C2PA osservati sono compilati separatamente nella stessa tabella.

| Campo | Valore da compilare |
|---|---|
| Titolo e URL dei termini applicabili allo strumento usato | |
| Versione / data dei termini | |
| Data di consultazione | |
| Piano/account o condizioni specifiche rilevanti, senza dati riservati | |
| Riferimento alla copia/evidenza dei termini consultati | |
| Condizioni dichiarate per uso dell'output e distribuzione nel progetto | |
| Restrizioni o attribuzioni richieste dallo strumento | |
| C2PA presente/esposto, assente o non verificato | Presente: chunk PNG caBX con manifest JUMBF/C2PA conservato nell’originale; firma, certificati e validità crittografica non verificati. |
| Strumento e versione usati per leggere C2PA | Python 3.12.5, sola lettura locale di chunk PNG, box JUMBF e valori CBOR. Nessun validatore C2PA eseguito. |
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Manifest urn:c2pa:c964d923-90a5-40f9-93ca-46b6a376e39a, conservato in [candidati/A1.png](candidati/A1.png). softwareAgent ChatGPT / gpt-image; digitalSourceType trainedAlgorithmicMedia. Azioni dichiarate: c2pa.created, c2pa.converted, c2pa.watermarked.unbound; allActionsIncluded=false. claim_generator_info.name=OpenAI Media Service API; org.contentauth.c2pa_rs=0.79.2; specVersion=2.2.0 (versione C2PA, non del modello). |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Il risultato API espone solo image_url e output_hint; modello generico e azioni sono nel PNG. Azioni converted/watermarked dichiarate dal servizio prima della consegna: nessuna conversione o ritocco dell’originale effettuato da Codex. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-e16832cd-984a-4f3a-a843-3ad259ce3c68.png; dc:title nel C2PA: image.png. |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/candidati/A1.png — copia byte per byte, sola rinomina; originale automatico ancora in C:/Users/gesucca/.codex/generated_images/01a1a749-3a3c-7213-8806-63cc15ffea87/exec-e16832cd-984a-4f3a-a843-3ad259ce3c68.png. |
| SHA-256 dell'originale scaricato | 53ba5a5b363263b9d93cfe5ed2c6ac279c35f0cfcce6eadf1184e4dcabab18f3 |
| Formato, larghezza×altezza effettive, byte | PNG  2006×784  2 577 890 byte. Dimensioni richieste non restituite; originale non riscalato né ritagliato. |
| Trasparenza / profilo colore, se verificati | IHDR: RGB, 8 bit per canale, senza alfa. Nessun chunk iCCP/sRGB presente; sharp interpreta lo spazio come sRGB. Profilo colore effettivo del processo di generazione non verificato. |
| Data di ricezione del file | 2026-11-04 16:19:21 UTC, cioè 17:19:21 Europe/Rome (fine della chiamata, da clock della sessione). |
| Eventuali altri output dello stesso tentativo e loro identificazione | Un solo originale restituito. Anteprime e ritagli solo per visione elencati in dati-file-generati.json; non sono altri candidati né derivati da distribuire. |

Originale già conservato in Git per questo candidato: sotto 6.000.000 byte; i due originali totalizzano 5.265.406 byte, sotto 20.000.000. Nessun originale escluso per peso. La rinomina non è una nuova generazione. Le sole anteprime sono documentate in nota-confronto.md, mantenendo vuota la sezione d’integrazione seguente.

## Modifiche e derivati (da compilare nell'integrazione)

| Passo | File di ingresso e SHA-256 | Operazione e parametri esatti | Strumento e versione | File di uscita e SHA-256 | Dimensioni / byte |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

Registrare separatamente: eventuale ritaglio permanente con rettangolo x/y/larghezza/altezza in pixel del sorgente; eventuali ritocchi; ridimensionamento con filtro; compressione WebP con qualità, modalità e gestione dei metadati; ogni file intermedio conservato. Se non si effettua ritaglio permanente, dichiararlo.

| Campo | Valore da compilare |
|---|---|
| File finale distribuito e SHA-256 | |
| Parametri del ritaglio dinamico del renderer / collegamento alla specifica adottata | |
| Risultati del calcolo alle tre misure con le dimensioni finali | |
| Voce dell'inventario aggiornata / commit d'integrazione | |
| Collegamento alle evidenze e ai risultati delle verifiche successive | |

Il cover dinamico non modifica i byte della WebP e non va confuso con un ritaglio eseguito sul file.

## Giudizio del proprietario

| Campo | Valore da compilare |
|---|---|
| Data e autore del giudizio | |
| File / hash della variante giudicata | |
| Contesto: originale isolato, proposta sul tavolo, integrazione finale | |
| Sedute consumate e spaiate, senza eleganza (O2) | |
| Continuità con palette, legno, luce, composizione e identità R1 | |
| Assenza di testo, marchi, persone, carte e interfaccia nel bitmap | |
| Esito sui ritagli 1366×768 / 844×390 / 750×292 | |
| Leggibilità con posti, mano, pile e scritta sovrapposti | |
| Giudizio su desktop; eventuale iPhone e limiti dichiarati | |
| Esito: approvata / da correggere / respinta | |
| Motivazione e correzioni richieste | |
| Riferimento al messaggio o evidenza del giudizio | |

L'approvazione della sola immagine non chiude l'integrazione né sostituisce il giudizio sul tavolo vero. Il registro completo accompagna inventario ed evidenze, secondo la [checklist](checklist-integrazione.md).
