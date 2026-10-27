# C0 — Revisione: una partita a carte in un bar marcio

26 ottobre 2026. Requisiti del proprietario successivi alla prima consegna C0.
Questo documento sostituisce la direzione visiva dei primi schizzi e i gesti
proposti come pannelli/selettori; conserva protocollo, parità e regolamento 1.6.
**Aggiornamento 27 ottobre 2026:** [i tre mockup R1 sono approvati](r1/approval.md).
La [nuova scena interattiva](../../../client-c0/revision/README.md) realizza
C0-R2–R4; misure desktop/emulazione e peso R5 passano. [Rapporto corrente](../../reports/client-c0-r2-report.md).
**C0 chiusa il 27 ottobre 2026** con deroga sulla risposta al tocco e
revisione umana superata con riserve, landscape forzato ([esiti](../../reports/client-c0-r5-procedure.md#esiti));
**C1 non iniziata**. I requisiti seguenti restano i criteri di accettazione.

## Problema e risultato atteso

Il primo prototipo sembra un debug rifinito: griglia di pannelli, oggetti
ridotti a scritte, mano come catalogo, troppo testo e palette carbone/ambra.
Le misure tecniche raccolte non risolvono questo fallimento di direzione.
Il risultato deve sembrare **un videogioco che rappresenta una partita a carte**:
un tavolo fisico riconoscibile, carte che si tengono in mano, si ordinano e si
calano, con gli avversari seduti attorno e i loro oggetti anch'essi in forma di carte.

Requisiti acquisiti, non proposte ancora da confermare:

- Bar marcio, tavolo sudicio, aloni di bicchieri, macchie, bruciature e mozziconi;
  stile fumetto anche semplice. Gli asset precedenti restano esclusi.
- Colori da bar: niente palette generale gialla/nera del primo prototipo.
- Mano propria di carte, riordinabile trascinando e tramite click/tap.
- Gioco diretto calando la carta sul bersaglio, con conferma discreta proposta.
- Oggetti rappresentati da **carte posate sul tavolo**, non etichette sotto un avatar.
- Mani avversarie visibili come **carte coperte**; quantità dal conteggio privato
  consentito dal DTO, senza rivelare fronti o pending non disponibili.
- Testi e riferimenti normativi fuori dal primo piano dell'azione. Dettagli
  delle carte consultabili; regolamento e diagnostica raggiungibili separatamente.

L'obiettivo di un tavolo da locale malandato era già nel piano precedente;
il primo elaborato non lo ha tradotto bene. Questi feedback precisano la
scena e i gesti da correggere, non rendono retroattivamente adeguato quel risultato.

## Composizione proposta

Inquadratura del tavolo dall'alto con lieve inclinazione scenica, senza motore
3D. Superficie in legno scuro consumato, tonalità noce/tabacco, macchie brune,
vetro verdastro, carta avorio sporco, accenti bordeaux e petrolio. Sono
scelte artistiche approvate nei mockup R1. Ombre e bordi
d'inchiostro danno spessore; pochi elementi ambientali leggibili fanno il bar,
senza coprire testo, valori o aree interattive. La sporcizia non è un filtro
che riduce il contrasto di tutta la schermata.

La scena contiene:

1. **Mano propria:** ventaglio in primo piano in basso, carte sovrapposte,
   leggibile e disteso al bisogno; carta puntata sollevata, carta trascinata
   davanti alle altre. Nome, simbolo, costo e priorità visibili secondo lo
   spazio; dettaglio su ispezione esplicita. Nessuna riga di sei pannelli.
2. **Postazioni:** carta personaggio visibile e indicatori compatti delle
   risorse, con salute esatta anche negativa/oltre l'iniziale. Avversari in
   sedi stabili attorno al tavolo, senza riposizionamenti durante la mira.
3. **Oggetti:** carte scoperte di dimensione ridotta accanto alla carta
   personaggio del proprietario, con la stessa grammatica visiva della mano:
   fronte, nome, simbolo/illustrazione semplice, bordo e ombra. Si possono
   ispezionare e, per una mossa compatibile, colpire direttamente con il drop.
   Copie omonime restano visivamente carte distinte o un mazzetto apribile
   che permetta di leggerle; non solo un numero o una scritta. Su schermo
   minimo aprire/espandere la zona oggetti senza cambiare proprietario.
4. **Mani degli avversari:** piccoli ventagli di dorsi rivolti verso ciascuna
   postazione. Una carta coperta per ogni carta dichiarata dal conteggio,
   anche zero; non assumere sempre sei. In FFA a cinque si devono riconoscere
   tutte e quattro le mani avversarie. Il dorso è nuovo e coerente con il set.
5. **Centro:** spazio per la carta calata e gli accenti della risoluzione,
   senza creare una nuova zona regolamentare o una pila di risposta.
6. **HUD minimo:** clock vicino al bordo, stato della propria scelta e
   pulsante/menu discreto per regole, riepilogo, abbandono e diagnostica.
   Niente JSON, destinazioni API, citazioni Rxx o descrizioni di laboratorio
   nella scena giocabile. I controlli sintetici C0 stanno in un pannello di
   laboratorio esterno alla scena, richiamabile separatamente.

Anche l'ispezione carta presenta il testo **meccanico utile**, non i suffissi
bibliografici «Riferimento: Regolamento…» del catalogo o le categorie wire
SELF/NEAR_ITEM. La presentazione nasconde tali elementi senza cambiare il
testo sorgente SQLite o la copia ufficiale del regolamento; nessuna riformulazione
che alteri costi, vincoli o significato dell'effetto.

I mozziconi, gli aloni e gli altri dettagli ambientali sono decorazione non
selezionabile. Gli oggetti utilizzabili si riconoscono come **carte**: il
contorno e il feedback di bersaglio evitano di confondere una macchia o un
bicchiere scenico con una carta del catalogo. Equipaggiamenti/stati restano
indicatori/attacchi alla carta personaggio: un equip non diventa per questo
una nuova carta oggetto o un nuovo bersaglio, se il DTO non lo rappresenta tale.

Sul desktop e nel landscape minimo proposto 844×390 la composizione ordinaria
deve rendere raggiungibili mano, bersagli e conferma **nella scena**, senza
scorrere una pagina di pannelli per giocare. Il testo completo può aprirsi
in un dettaglio sovrapposto richiudibile. Portrait 390×844 mostra ora la richiesta di rotazione, motivata dalla
densità delle cinque sedi e verificata in emulazione; confermarla sul fisico; non considerare già approvato il precedente layout lungo con scroll.

## Gesti proposti e confine con il server

### Riordinare la mano

- Trascinamento entro la fascia mano: anteprima della nuova posizione e
  inserimento al rilascio; le altre carte fanno spazio. Fuori da una posizione
  valida o con Escape/pointercancel, ritorno alla posizione precedente.
- Alternativa click/tap: comando contestuale «Riordina», poi click su due
  carte per scambiarle; uscita esplicita dalla modalità. In questo modo il
  secondo click su una carta non è ambiguo con una scelta di scarto bound.
- Tastiera: selezione carta, comando riordina, frecce e conferma/annullamento.
- L'ordine è **locale di presentazione**: niente API nuova, modifica al mazzo,
  ordine di pesca o garanzia di persistenza dopo un nuovo login. Chiavi locali
  distinguono le copie disegnate, non istanze selezionabili nel protocollo.
  Su una nuova vista conservare l'ordine delle carte riconciliabili e inserire
  le nuove in modo prevedibile, senza promettere l'identità delle copie omonime.

### Calare una carta

1. Prendere la carta; il ventaglio si apre quanto serve e il posto d'origine
   resta riconoscibile. Evidenziare sul tavolo i bersagli ammessi dalla
   categoria dichiarata, senza promettere legalità definitiva lato client.
2. Trascinare sulla carta personaggio/area della postazione per un bersaglio
   ordinario, oppure sulla **carta oggetto** per un bersaglio oggetto. Nome
   del destinatario e, se necessario, proprietario/oggetto appaiono brevemente
   accanto alla carta; in FFA il bersaglio selezionato deve essere inequivocabile.
3. Rilascio valido: carta appoggiata in **anteprima**, piccolo check e annulla
   vicini alla carta, raggiungibili anche da touch. Proposta iniziale: un check
   esplicito prima di ogni SEND, senza modale o grande pannello di riepilogo.
   Rilascio fuori bersaglio, Escape o annullamento: torna in mano, zero SEND.
4. Bound: prima del check finale scegliere la carta da scartare **dalla mano**,
   con le sole regolari ammesse evidenziate. Segno visivo distinto da riordino
   e mira; nessuna carta scartata davvero prima della vista autorevole.
5. Check: un solo comando con gli stessi cinque campi correnti. Carta
   trattenuta visivamente in attesa; non è ancora risolta. Il posto in mano
   può restare marcato come riservato: non rappresentare un consumo già avvenuto.
6. Accettazione: pending propria dalla vista, indicazione discreta «In attesa».
   Rifiuto: motivo breve, ritorno correggibile in mano, nessun effetto inventato.
   Drop di rete: esito incerto, resume/rilettura senza reinvio automatico.

Alternativa equivalente senza drag: click/tap carta → click/tap bersaglio
direttamente nella scena → eventuale scarto → check. Focus/tastiera devono
permettere gli stessi passi. Nessun menu testuale come percorso obbligatorio
per scegliere un oggetto che è già visibile sul tavolo.

Il drop determina carta e destinatario, **non attacca immediatamente**. La
partita mantiene la scelta simultanea e la risoluzione server. Prima di
resolvedMoves non si mostrano danni, consumo o pesca come già avvenuti.
I dorsi avversari non svelano carta scelta/pending: il conteggio non permette
di dedurre quelle informazioni. Carte giocate altrui si mostrano scoperte
solo quando i dati pubblicati della risoluzione le identificano. Non inferire
una pesca/scarto preciso dal solo conteggio finale invariato.

Nuova vista/turno, resize/orientamento, background o pointercancel interrompono
il gesto quando serve e applicano subito lo stato corrente. Un drag interrotto
non invia comandi. Pending nello stesso turno aggiornata senza perdere il
resto dello stato; vecchie callback di connessione ignorate. Il clock continua.

Il [contratto wire](interaction-contract.md) resta valido: stessi nomi GUI,
SELF esplicito, `DISCARD_ONE`, proprietario e `TARGET_ITEM`, nessun ID istanza,
nessuna nuova informazione privata.

## Tecnologia rivalutata in C0-R1

La richiesta corrente del proprietario riapre la scelta tecnologica e supera
la precedente indicazione di conservare Angular senza nuovo confronto.
**Proposta: PixiJS 8 + TypeScript per tutto il tavolo, React/HTML per shell e
ispezione, Vite per la build.** [Decisione, alternative e fonti](r1/technology.md).

Carte ruotate, ventagli, ombre e bersagli condividono un solo spazio grafico.
Non si tratta più di un overlay Pixi soltanto decorativo. Testo esteso,
form e dettagli rimangono HTML, con un percorso completo senza trascinamento.
La parità del debug e il protocollo restano invariati. Un solo controller
dei gesti; niente copie interattive concorrenti DOM/canvas.

Angular e DOM possono realizzare questa grafica: il rifiuto artistico non
dimostra un loro limite prestazionale. La nuova raccomandazione è una
valutazione progettuale ora implementata e misurata nella sola scena.
Versioni fissate: PixiJS 8.22.0, React/ReactDOM 19.3.1, TypeScript 5.9.3,
Vite 8.3.5, Node 24.13.0/npm 11.6.2 isolati. Le prove PC superano peso e
reattività; la conferma finale attende il gate fisico/umano. Le vecchie
misure Angular restano storiche. Il debug non è migrato.

## Passaggi e accettazione prima di C1

| Passo | Elaborato/lavoro circoscritto | Criterio osservabile |
|---|---|---|
| C0-R1 Direzione artistica — approvata | [Duello, FFA cinque e carta](r1/README.md) rifatti come un'unica proposta coerente; nuovo tavolo, dorso e cornice; riferimenti normativi fuori dalla scena | Il proprietario riconosce una partita a carte nel bar richiesto. Cinque postazioni, propria mano, quattro ventagli coperti e carte oggetto visibili; niente pannelli del debug travestiti. |
| C0-R2 Mano fisica — implementata e provata automaticamente | Nella sola scena sintetica: ventaglio, sovrapposizione, ispezione, riordino drag e scambio click/tap, tastiera | Sei carte proprie selezionabili/riordinabili, nessun comando di gioco al riordino, copie omonime non perse. Dorsi avversari coerenti coi conteggi 0/1/6, nessun fronte privato ricostruito. |
| C0-R3 Calata e oggetti — implementata e provata automaticamente | Drag sul personaggio o sulla carta oggetto; anteprima, check/annulla; scarto bound dalla mano; equivalente click/tap | Ordinaria, bound e oggetto esprimono i payload esistenti. Drop invalido/cancellato produce zero SEND; check produce una sola anteprima comando. Oggetti distinti dalle decorazioni e proprietario evidente, anche fra più carte vicine. |
| C0-R4 Vita della scena — implementata e provata automaticamente | Pending/rifiuto/resume sintetici, vista durante gesto, cancellazione effetti, resize/zoom/orientamento e movimento ridotto | Nessun costo/danno ottimistico, niente mossa nemica rivelata, nessun input catturato da FX, focus recuperato, clock non sospeso. Presentazione del turno corrente utilizzabile senza scroll di pannelli in landscape. |
| C0-R5 Nuove misure e giudizio — chiusa con deroga | Produzione: stessa FFA con sei proprie, quattro mani coperte e carte oggetto alle capacità previste; 60 s per desktop e touch fisico; misure gzip includendo nuovi asset | Stesse soglie di frame/input/peso della roadmap; esiti separati dall'emulazione. Breve verifica umana di atmosfera, lettura e precisione del drop sul minimo, poi decisione del gate. |

La prima revisione ha avuto esito negativo; la seconda proposta R1 è stata
approvata esplicitamente. R2–R4 superano le prove automatiche. R5 ha misure
desktop e touch emulato PASS; su iPhone 16 Pro la fluidità passa, la risposta
al tocco (116 ms contro 100) è accettata con deroga e la revisione umana è
superata con riserve ([esiti](../../reports/client-c0-r5-procedure.md#esiti)).
Le riserve entrano in C1 (carta che segue il dito) e C4 (rifinitura, ridisegno
incrementale).
Il limite originario di una giornata riguardava la prima prova: il tempo di
questo rifacimento va registrato separatamente, evitando una serie aperta di
prototipi o art completa del set. Una sola scena sintetica continua a bastare.
Non partire da C1 né anticipare account, rete, client completo o app native.

Dopo C0: C1 collega al server **questa** mano e questa calata; C2 porta lo
stesso linguaggio al resto della parità, incluse FFA e carte oggetto; C3 affina
la risoluzione osservabile, C4 rifinisce art/audio/layout già riconoscibili.
Non rinviare a C4 il primo aspetto da videogioco.

## Verifiche

La consegna corrente è descritta nel [rapporto R2–R5](../../reports/client-c0-r2-report.md),
con prove effettive ed emulazione separate; prova fisica e revisione umana
sono nella [procedura C0-R5](../../reports/client-c0-r5-procedure.md).
[R1](r1/README.md) conserva immagini approvate e verifiche storiche della fase statica.

### Storico: aggiornamento del piano precedente a R1

Eseguiti il 26 ottobre 2026: `./scripts/build.ps1 -Task Test -Offline`
(251 server e 36 debug client, PASS), `python scripts/check-rules.py` (PASS),
`./scripts/build.ps1 -Task TestServerContext -Offline` (358 test del profilo,
PASS, include avvio Spring) e `python scripts/verify-match-manifests.py`
(tutti PASS, manifest non modificati). Controllati 106 collegamenti locali
nei documenti interessati e la formattazione Markdown. I test del profilo
context includono casi sovrapposti alla suite ordinaria.

Sono cambiati solo piano e documentazione; codice e asset del prototipo
restano quelli della prima prova. Questi esiti non attestano una nuova UI,
una nuova misura grafica o una prova touch fisica.
