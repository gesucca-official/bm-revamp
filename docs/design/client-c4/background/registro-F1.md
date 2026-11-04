# C4-5a-gen — Registro F1

4 novembre 2026. Nuova generazione su correzioni esplicite del proprietario. Operatore Codex (gpt-6.1-sol); generatore dichiarato nei metadati ChatGPT / gpt-image. Candidato non approvato né integrato. Termini d’uso: **da verificare dal proprietario**.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | F1; correzione dei soli sgabelli di E1. |
| Operatore della generazione | Codex, modello agente gpt-6.1-sol; generatore ChatGPT / gpt-image. |
| Strumento / servizio e URL della funzione usata | image_gen.imagegen integrato; URL non esposto dallo strumento. |
| Modello dichiarato dallo strumento | C2PA: softwareAgent.name ChatGPT, softwareAgent.version gpt-image; versione numerica non esposta dallo strumento. |
| Versione del modello / build dello strumento, se esposta | non esposto dallo strumento |
| Data e ora della generazione, con fuso orario | 2026-11-04 17:32:37 UTC — 2026-11-04 17:33:05 UTC; UTC, Europe/Rome = UTC+01:00. |
| Identificativo del job / sessione, se esposto | exec-43637e30-174f-4d97-872c-f3ec10b243f9 (dal nome del file restituito). |
| Commit contenente il prompt prima della generazione | 109eb5c007e1870e41009148afe0e11c3d6d355b |
| Percorso e versione del documento di prompt | docs/design/client-c4/background/prompt-F.md, commit 109eb5c. |
| Prompt scelto: A oppure B (o revisione già committata) | F, testo committato prima della chiamata. |
| Modalità: nuova generazione / modifica guidata dai riferimenti | Modifica di E1 secondo la richiesta del proprietario; E1 è l’unico riferimento. |
| Dimensioni e formato richiesti | 2560×1000 PNG opaco richiesto; restituito 2006×784 PNG. |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | Un risultato; qualità/stile nel testo; forza numerica non esposta dallo strumento. |
| Seed, se esposto | non esposto dallo strumento |
| Eventuali altri parametri | transparent_background=false; un solo referenced_image_paths, E1; num_last_images_to_include omesso. |

Il commit preventivo di prompt-F.md è riportato sopra. La data della generazione deve essere successiva al salvataggio e commit del testo usato. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Copiare integralmente, senza riassumere né limitarsi a “prompt A/B”. Conservare spaziature, lingua e istruzioni aggiuntive. Se il negativo era nello stesso campo, lasciarlo nel testo principale e annotarlo nel campo relativo.

Testo principale:

~~~text
Edit the attached E1.png image. Use it as the sole exact base. Correct ONLY the TWO STOOLS behind the far side of the table. Preserve the table silhouette and rim, every tabletop object and its position, the precariously overhanging empty coaster, the lateral fixed burgundy booths, the wood grain, vivid warm colors, saturation, reflections, camera and framing as closely as possible. Do not darken, desaturate, recolor or redesign the scene. Output one opaque PNG, requested 2560 x 1000 pixels, landscape 2.56:1, with no stretching.

LEFT STOOL: its cushion currently appears to overlap or merge with the far tabletop. Move the whole stool slightly farther back into the narrow space BEHIND the table. Keep the round cushion fully behind and clearly ABOVE the far rim in image space, with a small visible strip of dark background separating the cushion's bottom silhouette from the tabletop edge. No cushion or metal seat ring may cross onto the wooden playing surface. The table may naturally occlude the lower legs, but it must not intersect the cushion. Keep its worn burgundy cushion and small torn patch, natural round-seat ellipse and credible dark metal base. Keep it compact and avoid raising the room horizon.

RIGHT STOOL: move it a little LEFT toward the middle, away from the right fixed booth. Leave an unmistakable dark gap between the entire stool silhouette and the booth. Give it the same real-world cushion diameter, thickness, supporting base and leg proportions as the left stool, adjusted only for its slightly different depth. Do not squash the cushion into a narrow tilted wedge, make it oversized, or connect it to the fixed upholstery. Draw a credible round padded stool in perspective with consistent metal supports. Retain a subtle difference in depth and orientation between the two stools so they look casually placed, not cloned, while keeping their scale coherent.

Exactly TWO stools and the existing two lateral booth sections; no additional seats. Both cushions must remain identifiable in the shallow top strip, with enough separation from the table and from each other. Do not move or reshape the table or booths to create the gaps: correct the stools themselves. Keep the rest of E1 unchanged, especially its warm lively walnut palette and the coaster balanced on the near edge.

No added text, lettering, logos, signatures, watermarks, people, hands, cards, tokens, HUD, interface, frames, extra props or game imagery. No external references.
~~~

Campo negativo separato, se usato:

~~~text

~~~

| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | Unico campo prompt, incluso Avoid. |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | Nessuna aggiunta al testo; solo E1 come input esplicito, richiesta-F1.json. |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | non esposto dallo strumento |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | Nessuna. |

## Riferimenti effettivamente allegati

I soli riferimenti previsti per A e B sono table.png C0-R2 e duel.png R1. Percorsi e SHA-256 letti prima della generazione sono nella [tabella di prompt-sfondo.md](prompt-sfondo.md#istruzioni-al-proprietario). Questi sono valori di confronto; la tabella sotto deve descrivere **i byte realmente allegati**, non soltanto quelli che si intendeva usare.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| 1 | docs/design/client-c4/background/candidati/E1.png | a63ad2c367ec75b2a0845448a83a27b80a3ecfcc29eadd2196086d1184679760 | Unica base da modificare | Nessuna |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | Input aggiornato dalla richiesta del proprietario: E1, hash confrontato con dati-E1.json e coincidente prima della chiamata. |
| Conferma dell'operatore: nessuna immagine da Internet, dai quattro giochi o da asset respinti | Confermato; soltanto i due file originali elencati. |
| Altri input effettivi / dichiarazione esplicita di assenza | Nessun altro allegato. |

Se il servizio ha modificato gli allegati internamente e lo espone, annotarlo. Non inventare l'hash di una trasformazione interna non accessibile. Nessun riferimento esterno diventa ammesso perché il suo uso è stato annotato.

## Termini d'uso e provenienza esposta

| Campo | Valore da compilare |
|---|---|
| Titolo e URL dei termini applicabili allo strumento usato | |
| Versione / data dei termini | |
| Data di consultazione | |
| Piano/account o condizioni specifiche rilevanti, senza dati riservati | |
| Riferimento alla copia/evidenza dei termini consultati | |
| Condizioni dichiarate per uso dell'output e distribuzione nel progetto | |
| Restrizioni o attribuzioni richieste dallo strumento | |
| C2PA presente/esposto, assente o non verificato | Presente nel PNG; validità crittografica non verificata. |
| Strumento e versione usati per leggere C2PA | Node 24.13.0, lettura delle stringhe del PNG; non un validatore C2PA. |
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | Stringa softwareAgent ChatGPT / gpt-image osservata nel PNG; C2PA presente. Altri dati e firma non verificati. dati-F1.json. |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | Risposta tool: image_url e output_hint; nome del generatore ricavato dal PNG. |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | exec-43637e30-174f-4d97-872c-f3ec10b243f9.png |
| Nome e percorso di archiviazione nel progetto | docs/design/client-c4/background/candidati/F1.png; copia invariata e rinominata. Percorso automatico originale in richiesta-F1.json. |
| SHA-256 dell'originale scaricato | 32f5cfbeffe2bdcaea125a74dc4edcf48595ac500c772774d37f6af9565efa7e |
| Formato, larghezza×altezza effettive, byte | PNG, 2006×784, 2397243 byte. |
| Trasparenza / profilo colore, se verificati | non verificato |
| Data di ricezione del file | 2026-11-04 17:33:05 UTC (fine chiamata); Europe/Rome = UTC+01:00. |
| Eventuali altri output dello stesso tentativo e loro identificazione | Un solo originale per chiamata. Anteprime e scheda-F1.webp solo per visione, con hash in dati-F1.json. |

D11 richiede la sorgente tracciata per lo sfondo. Conservare nel blocco successivo l'originale generato, non solo una cattura o la derivata compressa; registrare una rinomina senza presentarla come nuova generazione.

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
