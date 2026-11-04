# C4-5a — Modello del registro di generazione

Modello predisposto il 4 novembre 2026 per [D11](../../../client-c4-plan.md#decisioni-del-proprietario). **Nessuna generazione registrata e nessun esito approvato.** I campi delle tabelle sono intenzionalmente vuoti. Compilare dopo la generazione; una scheda distinta per ogni tentativo, compresi quelli respinti, senza sovrascrivere la storia.

Il proprietario deve fornire il file originale scaricato dallo strumento, strumento/modello/versione/data, prompt esatto e impostazioni realmente usati, elenco degli allegati effettivi, termini d'uso mostrati o loro riferimento preciso, eventuali seed e C2PA, e il proprio giudizio. L'agente potrà calcolare hash e dimensioni dai file consegnati e registrare le conversioni. Se un dato non è esposto, scrivere **“non esposto dallo strumento”**; se non è stato controllato, **“non verificato”**, senza dedurlo dal nome del prodotto. Non lasciare un campo vuoto ambiguo nel registro definitivo.

## Identificazione e cronologia

| Campo | Valore da compilare |
|---|---|
| ID del tentativo / collegamento alle altre schede | |
| Operatore della generazione | |
| Strumento / servizio e URL della funzione usata | |
| Modello dichiarato dallo strumento | |
| Versione del modello / build dello strumento, se esposta | |
| Data e ora della generazione, con fuso orario | |
| Identificativo del job / sessione, se esposto | |
| Commit contenente il prompt prima della generazione | |
| Percorso e versione del documento di prompt | |
| Prompt scelto: A oppure B (o revisione già committata) | |
| Modalità: nuova generazione / modifica guidata dai riferimenti | |
| Dimensioni e formato richiesti | |
| Impostazioni di qualità, stile, forza dei riferimenti, numero di risultati | |
| Seed, se esposto | |
| Eventuali altri parametri | |

Il commit va recuperato dalla storia Git di [prompt-sfondo.md](prompt-sfondo.md): questa scheda non può conoscere in anticipo l'hash del proprio commit di preparazione. La data della generazione deve essere successiva al salvataggio e commit del testo usato. Qualsiasi correzione manuale del prompt richiede un nuovo salvataggio e commit **prima** del tentativo successivo.

## Testo esatto inviato

Copiare integralmente, senza riassumere né limitarsi a “prompt A/B”. Conservare spaziature, lingua e istruzioni aggiuntive. Se il negativo era nello stesso campo, lasciarlo nel testo principale e annotarlo nel campo relativo.

Testo principale:

~~~text

~~~

Campo negativo separato, se usato:

~~~text

~~~

| Campo | Valore da compilare |
|---|---|
| Disposizione effettiva dei campi principale/negativo | |
| Altre istruzioni inviate, messaggi precedenti o contesto della sessione | |
| Riscrittura automatica del prompt, se esposta (testo integrale o file) | |
| Differenze rispetto al prompt committato e riferimento al commit preventivo | |

## Riferimenti effettivamente allegati

I soli riferimenti previsti per A e B sono table.png C0-R2 e duel.png R1. Percorsi e SHA-256 letti prima della generazione sono nella [tabella di prompt-sfondo.md](prompt-sfondo.md#istruzioni-al-proprietario). Questi sono valori di confronto; la tabella sotto deve descrivere **i byte realmente allegati**, non soltanto quelli che si intendeva usare.

| Ordine allegato | Percorso del file del progetto | SHA-256 del file allegato | Ruolo (composizione/stile) | Eventuali trasformazioni prima dell'invio |
|---|---|---|---|---|
| | | | | |
| | | | | |

| Campo | Valore da compilare |
|---|---|
| Confronto con le impronte dei riferimenti previste in prompt-sfondo.md | |
| Conferma dell'operatore: nessuna immagine da Internet, dai quattro giochi o da asset respinti | |
| Altri input effettivi / dichiarazione esplicita di assenza | |

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
| C2PA presente/esposto, assente o non verificato | |
| Strumento e versione usati per leggere C2PA | |
| Dati C2PA esposti e riferimento al manifest/evidenza conservata | |
| Eventuali differenze tra dati dichiarati, C2PA e metadati | |
| Dichiarazione di provenienza/licenza da usare nell'inventario, con fonte | |

Non dedurre versione del modello, diritti esclusivi o licenza dal semplice fatto che il file sia generato. Conservare l'originale prima delle conversioni: non presumere che la WebP mantenga metadati o C2PA. La lettura dei termini e l'eventuale valutazione delle condizioni appartengono al blocco successivo; nessun termine è stato verificato in questa preparazione.

## File generato originale

| Campo | Valore da compilare |
|---|---|
| Nome originale restituito dallo strumento | |
| Nome e percorso di archiviazione nel progetto | |
| SHA-256 dell'originale scaricato | |
| Formato, larghezza×altezza effettive, byte | |
| Trasparenza / profilo colore, se verificati | |
| Data di ricezione del file | |
| Eventuali altri output dello stesso tentativo e loro identificazione | |

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
