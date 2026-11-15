# Osservazioni critiche e controproposta sul metodo di lavoro

> **Stato: superata.** Le osservazioni sono state valutate nella [proposta, versione 2](proposta-2026-11-15.md#13-cosa-viene-dalla-controproposta)
> e il metodo è stato applicato il 15 novembre 2026: vale [orchestrazione-lavoro.md](../../orchestrazione-lavoro.md). Documento
> storico della discussione: **non è una lettura operativa** e non si aggiorna.

**15 novembre 2026.** Revisione della [proposta di revisione del metodo](proposta-2026-11-15.md), richiesta dal proprietario. Questo documento raccoglie osservazioni e migliorie proposte: **non modifica il metodo in vigore e non costituisce approvazione della sua applicazione**.

Fonti esaminate: proposta, [pacchetto di prove](pacchetto-2026-11-15.md), [metodo attuale](../../orchestrazione-lavoro.md), [stato del progetto](../../README.md), [piano Set Base](../../set-base-plan.md), [registro delle decisioni](../../set-base-decisioni.md), [AGENTS.md](../../../AGENTS.md), [CONTRIBUTING.md](../../../CONTRIBUTING.md) e [script di revisione](../../../scripts/review-block.py). Revisione documentale e lettura dello script; nessuna verifica applicativa eseguita.

## Giudizio complessivo

La direzione è buona, ma la proposta non andrebbe applicata esattamente com'è. Riduce costi reali — ripetizioni, conferme poco utili, piani troppo anticipati — però alcuni controlli diventano più deboli di quanto il documento riconosca.

Da conservare soprattutto:

- lavoro diretto come modalità normale;
- decisioni registrate una volta;
- riquadro «Ripartenza»;
- separazione fra metodo generale e istruzioni del client;
- pianificazione dettagliata solo dei prossimi blocchi.

## 1. Il controllo del perimetro non dimostra che il perimetro sia corretto

**Riferimenti nella proposta: sezioni 3 e 11.**

Nei rischi dichiarati si dice che, se la regia scrive male il perimetro, `review-block.py --scope` lo segnala. Non è vero in generale: lo script segnala file fuori dal perimetro dichiarato. Se il perimetro autorizza troppo, oppure omette una protezione necessaria, il blocco può rispettarlo perfettamente e fare comunque danni.

Analogamente, una tabella invecchiata non si scopre necessariamente con lo STOP 2: una prova incompleta può continuare a passare.

**Miglioria proposta:** distinguere esplicitamente permesso di scrittura e impatto della modifica. All'avvio l'esecutore conferma che le protezioni assegnate coprono le dipendenze effettive; se scopre un impatto ulteriore, rivaluta le prove anche restando negli stessi file.

Il diff può dimostrare che certi file non sono cambiati. L'invarianza del comportamento richiede anche un isolamento già dimostrato: non discende dal solo fatto che il file modificato appartenga a una determinata cartella.

## 2. Le protezioni delle aree devono comporsi, non sostituirsi implicitamente

**Riferimento nella proposta: sezione 6.**

La regola «vale la riga più specifica» è rischiosa. `client-web/tools/` appartiene sia al client sia agli strumenti condivisi: scegliere una sola riga può eliminare obblighi dell'altra. Lo stesso problema riguarda catalogo, server e playground.

Anche «al conflitto si tengono entrambe le righe» funziona per stati indipendenti, ma non per due prescrizioni incompatibili sulla stessa area.

**Miglioria proposta:**

> Si applicano tutte le protezioni pertinenti; una riga specifica può derogare solo indicando esplicitamente a quale protezione. Un conflitto sulla stessa protezione va risolto, non semplicemente conservato.

Cambiare anche il ripiego «tutto il resto: niente di esistente cambia». Per modificare legittimamente un'area non classificata è inutilizzabile. Meglio:

> Area non classificata: definire impatto e verifica prima della modifica.

Basta una nota breve, senza imporre una nuova fase.

## 3. File separati non bastano per lavorare in parallelo

**Riferimenti nella proposta: sezioni 3 e 7.**

Due esecutori possono scrivere percorsi diversi ma interferire: uno modifica il codice che l'altro sta misurando, oppure cambia uno strumento durante una verifica. Il progetto ha già riconosciuto questo problema: D91 rinvia il lavoro sui bot perché tocca classi usate dalla misura.

C'è anche una contraddizione pratica: ciascun esecutore deve aggiornare piano, registro e talvolta indice, quindi i perimetri documentali finiscono per sovrapporsi.

**Miglioria proposta:** consentire il parallelo quando sono separati sia i file scritti sia gli input che devono restare stabili durante le verifiche. Serializzare le chiusure sui documenti comuni. Non serve censire ogni lettura: basta dichiarare le dipendenze rilevanti per misure e integrazione.

Infine, `git status` sporco non dimostra che qualcuno stia lavorando, e pulito non dimostra che Maven sia libero. Serve un'indicazione esplicita di chi occupa le risorse, non questa deduzione.

## 4. Vietare i messaggi della regia non risolve la mancata ricezione

**Riferimento nella proposta: sezione 5; precedenti D86–D87.**

Il difetto documentato era la mancata ricezione della correzione. Scrivere una decisione nel registro non assicura che un esecutore già avviato la legga. Anche «si ferma e si rilancia» presuppone che riceva il fermo.

**Miglioria proposta:** introdurre una conferma minima di ricezione:

> Recepita Dxx; riparto dal punto Y.

Fino a quella conferma la regia non considera applicata la correzione. Un messaggio può trasmettere una decisione del proprietario già registrata, senza diventare esso stesso un'approvazione.

Il riavvio completo serve quando il contesto è compromesso; renderlo obbligatorio per ogni correzione rischia di ricreare il costo che si vuole eliminare.

## 5. «A banco: niente STOP» contraddice i quattro STOP universali

**Riferimenti nella proposta: sezioni 3 e 4.**

Letto alla lettera, il lavoro creativo sembrerebbe esentato anche dai limiti di perimetro e budget. Inoltre «un commit a ogni sì» lega i commit al ritmo della conversazione: un sì può approvare un'idea ancora incompleta.

**Miglioria testuale proposta:**

> Nessuno STOP di fase; restano i quattro STOP generali. Commit a ogni risultato coerente approvato.

Precisare anche che un rosso nuovo permette la diagnosi necessaria ad attribuirlo; blocca il lavoro dipendente e le misure costose. Altrimenti il metodo può impedire proprio il confronto con la base che richiede.

## 6. Lo script aiuta la revisione, ma non la sostituisce

**Riferimenti nella proposta: sezioni 7 e 11.**

La lettura di `scripts/review-block.py` conferma che lo script:

- segnala gli sconfinamenti, ma termina normalmente con codice zero anche quando li trova;
- evidenzia alcune righe tramite espressioni regolari;
- confronta revisioni Git, senza includere automaticamente le modifiche non committate.

Non certifica correttezza, completezza delle prove o assenza di regressioni.

Il metodo attuale chiarisce che «l'uscita segnala dove guardare, non giudica». Questa frase va conservata: un blocco verde e nel perimetro può contenere una regressione non coperta.

**Miglioria proposta:** revisione proporzionata al rischio, con lettura delle modifiche sostanziali a logica e verificatori; sintesi di tre righe al proprietario dopo quella revisione.

Come miglioramento dello strumento, aggiungere un'opzione di controllo del perimetro che fallisca esplicitamente e includa le modifiche non ancora committate prima di una misura. Questa è una proposta di sviluppo successivo, non una capacità attuale dello script.

## 7. La migrazione deve risolvere le prescrizioni discordanti sulle verifiche

**Riferimenti nella proposta: sezioni 7 e 12.**

La proposta introduce verifiche per area, ma lascia `AGENTS.md` quasi invariato e non include `CONTRIBUTING.md` fra i documenti da adeguare. Quest'ultimo prescrive ancora test server, controllo regole, contesto Spring e manifest prima di proporre una modifica.

**Miglioria proposta:** stabilire un'unica fonte normativa per scegliere le verifiche e aggiornare nello stesso passaggio tutti i rimandi. Distinguere inoltre le verifiche che provano il risultato richiesto da quelle che proteggono il comportamento esistente: servono entrambe.

## Tre aggiunte per rendere il metodo più leggero e verificabile

### Un criterio di chiusura per ogni blocco

Le tre righe dicono dove lavorare, cosa proteggere e come procedere; manca «quando abbiamo finito». Basta una frase osservabile nel lavoro richiesto, senza introdurre un nuovo documento.

### Misurare il risparmio senza privilegiare il numero di righe

Usare caratteri o token stimati, passaggi e rilavorazioni, non soprattutto righe. Il pacchetto stesso mostra un registro di 109 righe che pesa 76 KB.

Spezzare una decisione solo perché supera 1.200 caratteri può peggiorarne la comprensione: il limite dovrebbe essere un invito a sintetizzare, non una ragione per frammentare una decisione unitaria.

### Una prova breve su tre blocchi diversi

Provare il metodo sui prossimi tre blocchi diversi, senza aspettare necessariamente Verticale: uno documentale o creativo, uno di codice, uno con misura.

Annotare soltanto passaggi di approvazione, letture richieste, rilavorazioni e problemi sfuggiti. Usare questi dati per correggere il metodo dopo la prova.

## Raccomandazione

Adottare l'impostazione, correggendo prima i punti operativi sopra. Il guadagno maggiore viene dall'eliminare duplicazioni e approvazioni superflue; per ottenerlo non occorre rendere meno affidabili le prove o la trasmissione delle decisioni.
