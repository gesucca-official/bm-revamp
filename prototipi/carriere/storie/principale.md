# Il Serraglio chiude — mockup del grafo della campagna principale

> **Ritirata il 20 novembre 2026.** Il prototipo legge ora i dialoghi veri,
> [`principale-dialoghi.md`](../../../docs/design/carriere/principale-dialoghi.md)
> ([rapporto](../../../docs/design/carriere/mockup-principale.md#aggiornamento-alla-037-con-i-dialoghi-veri)). Questo file resta come storia
> del mockup segnaposto e non è più registrato fra le carriere del prototipo.

> Mockup del grafo della [carriera principale del Set Base](../../../docs/design/carriere/principale.md), **versione 0.3.7** (20 novembre
> 2026; la prima stesura del mockup era sulla 0.2, poi sulla 0.3 e sulla 0.3.2), scritto da un esecutore per vedere la carriera sulla
> bacheca e giocarla da cima a fondo con le partite simulate. **Le battute sono segnaposto**, una o due per scena, prese dalla colonna
> «Scena» della scaletta e dai [dialoghi](../../../docs/design/carriere/principale-dialoghi.md): **non sono i dialoghi della carriera** e non
> vanno nel serbatoio. Nodi, partite, scelte, segni, fili, sconfitte che aprono un ramo, finali, segreti e achievement seguono la scaletta;
> dove il formato non la regge, o la scaletta non dice abbastanza, la scelta del mockup è annotata qui sotto e nel
> [rapporto](../../../docs/design/carriere/mockup-principale.md#aggiornamento-alla-037).
>
> - **Ritratti:** Celestina, Beppe, Sergio, Duccio e Grappino hanno un cartoncino segnaposto con il primo piano dell'identikit approvato
>   (`segnaposto/`, fatto da `strumenti/segnaposto.mjs`); il padrone del Dimmi Di Sì è una figura in ombra, senza nome. Tutti con una sola
>   espressione, «neutra». In I3b Sergio non ha ancora un nome: il cast non ha l'alias «Un signore», quindi parla come Sergio.
> - **Sfondi riusati:** il Dimmi Di Sì è S3 (l'esterno del tutorial) anche dentro; il bar di notte e la cantina sono S2 con il disordine;
>   la strada di notte e il marciapiede dello sgombero sono S1 con l'insegna spenta.
> - **«A scelta»** (II1, III1 quando non manca nessuno, III3a, S2) è il selettore del personaggio prima della partita: «→ Partita X: a
>   scelta fra …» (estensione del formato della 0.3).
> - **Chi ti ha accompagnato nell'atto III** (III3b, III4) è il segno `alleato`: Beppe per il torneo, Mara per il pedinamento, Celestina
>   per lo sgombero e per Grappino. S1 lo gioca Celestina. III5 è una catena: giocano tutti.
> - **Starter garantiti:** in II3 e in III1 lo sblocco dello starter ha una condizione (`[Se …] [Sblocca: …]`) e viene prima della
>   partita (0.3.3): chi si siede al tavolo ti dà le sue carte, e restano anche se la partita si perde.
> - **Le sconfitte sono un segreto** (0.3.2): I1s, II2s, III1s e III3c sono nodi segreti, sulla bacheca solo dopo esserci arrivati; I1s e
>   II2s sono tasche (`[Nodo: segreto; tasca]`), che pendono dal nodo perso senza strade proprie. F3 non è un nodo: è il finale «Disco
>   pub», un piatto del giorno sempre visibile, che si raggiunge perdendo la catena di III5.
> - **III5 è una partita a catena** (0.3.7, estensione del formato): tutti i personaggi sbloccati in quel giro, uno alla volta nell'ordine
>   che sceglie il giocatore, contro Sergio, senza ritento. Vincono tutti → III5 finisce; la prima sconfitta → F3.
> - **Finali:** III5 vinto esce con uscite condizionate (`→ Vai a: F2 [Se …]`, estensione della 0.3): F2 (Monetine) dopo il torneo e poi F1,
>   che chiude con il finale giusto per la strada fatta. Prima delle uscite c'è la scelta «con chi sei d'accordo?»: S2 si offre solo a chi ha
>   già visto il finale «Il Serraglio resta» in un giro precedente.

[Carriera: principale; obbligatori: starter-celestina, starter-piera, starter-beppe, pvp]

## I1 — Il cartello

[Sfondo: S1 insegna-spenta]

*Sulla serranda: «CHIUSO PER CESSIONE ATTIVITÀ. NUOVA GESTIONE: DIMMI DI SÌ DISCO PUB».*

**Mara** (sospettosa): Qualcuno ha venduto. Qui c'è un complotto, come dappertutto.

**Spazienzio** (furioso): SOLLEVIAMO LA SERRANDA. A MANI NUDE.

**Celestina** (neutra): Chi siete? Io qui ci dormo. Se il bar chiude, perdo casa.

→ Partita I1: Spazienzio (giocatore) contro Celestina

[Sconfitta: → I1s]

→ Scelta muta: chi segui?

- con Mara, a scoprire chi ha venduto [Segno: via-atto-1 = mara] → I2a
- con Spazienzio, a SPIEGARLO al Dimmi Di Sì [Segno: via-atto-1 = spazienzio] → I2b

## I1s — Il pavimento

[Nodo: segreto; tasca]

[Sfondo: S2 disordine, il pavimento del bar.]

*Spazienzio è per terra, accanto a Celestina, sul suo pavimento. Non può che ascoltarla.*

**Celestina** (neutra): Il proprietario viene di notte, quando è chiuso. Dal pavimento ho visto solo le scarpe: a punta e lucide.

**Spazienzio** (quasi-calmo): NESSUNO TI CREDE. MI RIALZO.

[Segno: celestina]

→ Torna a: I1, scelta

## I2a — Il fabbro

[Sfondo: S1]

**Beppe** (neutra): Serratura nuova, pagata in contanti. «Apri e Chiudi GmbH», sede in Svizzera. Mai vista.

→ Partita I2a: Mara (giocatore) contro Beppe

**Beppe** (neutra): Va bene: di ogni chiave che faccio mi tengo una copia. Per motivi personali.

[Segno: chiave]

→ Vai a: I3a

## I3a — La bici

[Sfondo: S1] [Entra: bici-mara]

**Beppe** (neutra): Per farmi perdonare ti ho riparato la bici. Più o meno: il manubrio è al contrario, così vedi chi ti segue.

**Spazienzio** (soddisfatto): CI SEDIAMO SOPRA. VEDIAMO SE REGGE.

→ Partita I3a: Mara (giocatore) contro Beppe e Spazienzio

→ Vai a: I4

## I2b — La porta

[Sfondo: S3]

**Duccio** (neutra): Prima di menarvi vi devo spiegare che sono di destra.

→ Partita I2b: Spazienzio (giocatore) contro Duccio

**Duccio** (neutra): Davanti a tutta la fila. Questa non la dimentico: il rancore è una cosa di destra.

[Segno: duccio]

→ Vai a: I3b

## I3b — Virgin Cuba Libre

[Sfondo: S3, dentro il Dimmi Di Sì: si riusa l'esterno.]

**Mara** (agitata): Sedici euro a bicchiere. Qui il complotto è il listino.

**Sergio** (neutra): Un signore, senza nome, che sa della serranda. Lunedì mattina si firma il passaggio di proprietà.

→ Partita I3b: Spazienzio (giocatore) contro Duccio, Mara e Beppe

→ Vai a: I4

## I4 — Venite voi qui!

[Sfondo: S2] [Entra: combriccola davanti-alla-porta]

**Un amico**: Serata «Salviamo il Serraglio»? Venite voi qui!

**Celestina** (neutra): Mettetemi alla prova. Se vinco, vi do il mio mazzo.

→ Partita I4: Celestina (giocatore) contro Mara e Spazienzio

[Sblocca: starter-celestina]

[Sblocca: pvp]

[Regia: sblocco del PvP e del mazzo costruito, con la busta e il negozio delle buste.]

**Un altro amico**: Allora sfidateci voi.

→ Vai a: II1

## II1 — Le voci

[Sfondo: S2]

**Mara** (sospettosa): È stato Spazienzio. No: Piera. No: Grappino. Lavorano tutti per loro.

**Sergio** (neutra): Cliente fisso, dal fondo del bancone. I conti del Serraglio? Siete sotto da anni.

[Se visto I3b] **Mara** (sospettosa): Il signore del Mercedes. Lo riconosco: lavora per loro.

[Se non visto I3b] **Celestina** (neutra): Quello? Torna dopo la chiusura. Si siede e guarda.

→ Partita II1: a scelta fra Celestina, Mara e Spazienzio (giocatore) contro Sergio

**Mara** (illuminata): Sa troppe cose. Sergio lavora per loro. È evidente.

→ Scelta muta: quale pista?

- con Piera, che si ricorda di dieci anni fa [Segno: pista = piera] → II2a
- con Beppe, che sa chi pagava in contanti [Segno: pista = beppe] → II2b
- con Celestina, che fruga nel bidone [Segno: pista = celestina] → II2c

## II2a — La frase di Piera

[Sfondo: S2]

**Mara** (sospettosa): Piera copre qualcuno. Ve l'avevo detto.

**Piera** (brilla): Dieci anni fa... stava per chiudere... e un signore...

[Stacchi: Spazienzio fumante] [Interrotta]

**Spazienzio** (furioso): E ALLORA? CHI ERA? DILLO!

→ Partita II2a: Piera (giocatore) contro Spazienzio

[Sconfitta: → II2s]

**Piera** (contenta): ...alto... e secco...

[Interrotta]

**Mara** (illuminata): Alto e secco. Un alieno.

[Segno: frase]

[Sblocca: starter-piera]

→ Vai a: II3

## II2s — Piera non parla più

[Nodo: segreto; tasca]

[Sfondo: S2]

[Entra: grappino seduto]

**Piera** (offesa): Grappino... a te... lo dico... un signore...

*Piera non parla più con nessuno. Grappino, per la cronaca, ascolta.*

→ Vai a: II3

## II2b — Contanti

[Sfondo: S2 disordine]

**Beppe** (neutra): Chi mi pagò i lavori dieci anni fa? Ve lo dico. Per venti euro. In contanti.

[Se segno duccio] **Duccio** (neutra): E tu sei quello della porta. Beppe mi deve l'anticipo; tu mi devi una faccia.

[Se non segno duccio] **Duccio** (neutra): Beppe. Il Dimmi Di Sì rivuole l'anticipo della ristrutturazione.

→ Partita II2b: Beppe (giocatore) contro Duccio

**Beppe** (neutra): Una valigetta di contanti sul bancone, e mozziconi di sigarette sottili nel barattolo di vernice. E una copia della chiave, già che ci sono.

**Mara** (sospettosa): Beppe lavora per chi paga. Anche per loro.

[Segno: chiave]

[Sblocca: starter-beppe]

→ Vai a: II3

## II2c — Il bidone

[Sfondo: S1]

**Celestina** (neutra): Il bilancio della «Apri e Chiudi GmbH». Metà. Il Serraglio perde soldi da ogni parte: lo tiene aperto uno scemo, o uno che in fondo gli vuole bene.

**Mara** (illuminata): Quello va sul mio muro dei complotti.

→ Partita II2c: Celestina (giocatore) contro Mara e Spazienzio

*La firma non c'è: l'ha strappata un cane piccolo. Si vedono i denti.*

**Mara** (sospettosa): Celestina ha mangiato la prova. Apposta.

[Segno: bilancio]

→ Vai a: II3

## II3 — Il muro dei complotti

[Sfondo: S2]

**Mara** (illuminata): Tutti i fili portano a lui. Sergio lavora per il Dimmi Di Sì.

[Se non visto I3b] **Sergio** (neutra): Fate pure. Lunedì sarà tutto finito.

**Duccio** (neutra): Io sto dalla parte di chi ha i soldi.

[Se visto II2s] **Piera** (offesa): Gioco... per Grappino... non per voi...

[Se segno pista = piera e vinto II2a] [Segno: ii3 = beppe]

[Se non segno ii3 = beppe] [Segno: ii3 = piera]

[Se segno ii3 = beppe] [Sblocca: starter-beppe]

[Se segno ii3 = piera] [Sblocca: starter-piera]

→ Partita II3: {ii3} (giocatore) contro Duccio

**Sergio** (neutra): Non avete capito niente. Ma poi vi vedo tutti la sera, qui al bancone.

→ Vai a: III1

## III1 — Domenica sera

[Sfondo: S2]

[Se segno duccio] **Duccio** (neutra): Ti ricordi la porta? Stasera sgombero io. E tu esci per primo.

[Se non segno duccio] **Duccio** (neutra): Sgombero, per conto del Dimmi Di Sì. Fuori tutti: domani si firma.

[Se non segno pista = beppe e non segno ii3 = beppe] [Segno: iii1 = beppe] [Sblocca: starter-beppe]

→ Partita III1: {iii1} o a scelta fra Piera, Beppe e Celestina (giocatore) contro Duccio

[Sconfitta: → III1s]

**Mara** (pensierosa): Resta la notte. Che facciamo?

→ Scelta muta: e stanotte?

- con Beppe, a comprarlo noi con un torneo [Segno: via-atto-3 = torneo] [Segno: alleato = beppe] → III2a
- con Mara, a pedinare Sergio [Segno: via-atto-3 = pedinamento] [Segno: alleato = mara] → III2b
- con Grappino, dietro a lui in cantina [Se segno bilancio] [Segno: via-atto-3 = grappino] [Segno: alleato = celestina] → S1

## III1s — Sgomberati

[Nodo: segreto]

[Sfondo: S1 insegna-spenta, il marciapiede.]

**Duccio** (neutra): Fuori tutti. Chiuso.

[Se segno chiave] **Celestina** (neutra): Una notte in più al coperto: la chiave ce l'avete, si rientra dalla porta.

[Se non segno chiave] **Celestina** (neutra): La finestra del bagno si apre anche da fuori. Spazienzio non ci passa.

[Se segno chiave] [Segno: rientro = porta]

[Se non segno chiave] [Segno: rientro = finestra]

[Segno: via-atto-3 = sgombero] [Segno: alleato = celestina]

[Achievement: Rientro abusivo]

→ Vai a: III3b

## III2a — Il torneo

[Sfondo: S2 disordine]

**Beppe** (neutra): Torneo del Serraglio: iscrizione dieci euro, scommesse al bancone. L'incasso va nella colletta.

→ Partita III2a: Beppe (giocatore) contro Mara, Spazienzio, Celestina e Piera

[Sconfitta: → III3c]

**Beppe** (neutra): Vinto. Contiamo.

→ Vai a: III3a

## III3c — I debiti

[Nodo: segreto]

[Sfondo: S2 disordine]

**Beppe** (neutra): Perso tutto. Adesso devo coprire le scommesse, e Duccio rivuole l'anticipo.

→ Partita III3c: Beppe (giocatore) contro Duccio e Celestina

→ Vai a: III3a

## III3a — I conti

[Sfondo: S2]

**Mara** (pensierosa): Mancano sempre dieci euro. E comunque non bastano.

**Sergio** (neutra): Una colletta. Che tenerezza. Metto i miei dieci euro in palio.

→ Partita III3a: a scelta fra Beppe, Mara, Spazienzio, Celestina e Piera (giocatore) contro Sergio

→ Vai a: III4

## III2b — Il pedinamento

[Sfondo: S1 insegna-spenta]

**Mara** (sospettosa): Stanotte va a prendere ordini. Lo seguo.

**Sergio** (neutra): Ti sento da due isolati, ragazzina. Torna a casa.

→ Partita III2b: Mara (giocatore) contro Sergio

→ Vai a: III3b [Se segno chiave]

→ Vai a: III4

## III3b — Di notte al Serraglio

[Sfondo: S2 disordine, il bar chiuso e buio.]

[Se segno rientro = porta] *Si rientra dalla porta, con la chiave.*

[Se segno rientro = finestra] *Si rientra dalla finestra del bagno. Spazienzio non ci passa.*

[Se non segno rientro] **Celestina** (neutra): Che ci fate voi qui?

[Se segno celestina] **Celestina** (neutra): Ve l'avevo detto che da quaggiù si vede tutto. Lui passa ogni notte.

[Se non segno celestina] **Celestina** (neutra): Qui passa qualcuno, dopo la chiusura.

*Sergio è già al bancone. Duccio porta una busta chiusa: «un piccolo incentivo» del padrone.*

**Mara** (agitata): Una bustarella! Ci hanno scoperti, ma io ho scoperto loro.

→ Partita III3b: {alleato} (giocatore) contro Sergio e Duccio

[Modificatori: ce l'hanno tutti con te]

→ Vai a: III4

## S1 — Il cane sa

[Nodo: segreto]

[Sfondo: S2 disordine, la cantina: si riusa il bar in disordine.]

[Entra: grappino ringhia]

**Piera** (offesa): Il cane... non si tocca...

**Mara** (sospettosa): Il cane. È sempre stato il cane.

→ Partita S1: Celestina (giocatore) contro Piera

[Modificatori: il cane difende le sue cose, la cantina è buia]

*Fra le cose di Grappino, l'altra metà del bilancio. Firmato: «S. Sommerso».*

[Achievement: Il cane sa]

→ Vai a: III4

## III4 — La firma

[Sfondo: S2]

**Il padrone del Dimmi Di Sì**: L'assegno è pronto. Aspettiamo chi vende.

[Se segno via-atto-3 = grappino] *Prima che Sergio si sieda, il foglio con la firma è già sul tavolo.*

[Se segno via-atto-3 = grappino] **Sergio** (neutra): Pensavo che quel cane le mie carte se le mangiasse, non che le portasse in giro.

*Entra Sergio, con le sue chiavi, e si siede dalla parte di chi vende.*

[Se segno frase] **Piera** (contenta): ...alto... e secco... e antipatico. Era lui.

[Se non segno frase] **Piera** (offesa): Un signore...

[Se non segno frase] **Sergio** (neutra): Basta così. Andiamo avanti.

[Se non segno frase] **Spazienzio** (furioso): IL SERRAGLIO È TUO!

→ Partita III4: {alleato} (giocatore) contro Sergio, Duccio, Spazienzio e Piera

→ Vai a: III5

## III5 — Rientrare

[Sfondo: S2]

**Sergio** (neutra): Dieci anni fa ho comprato questa baracca con fondi neri, per abbattere l'imponibile. Adesso rientro. È solo business.

**Celestina** (neutra): Eppure vieni qui ogni notte, e mi lasci il pavimento. Un motivo c'è.

**Sergio** (neutra): Datemi un motivo per non vendere. Uno alla volta.

→ Partita III5, a catena: ogni personaggio sbloccato (giocatore), uno alla volta nell'ordine che sceglie il giocatore, contro Sergio, boss finale

[Catena: si vince se tutti battono Sergio; alla prima sconfitta la catena finisce]

[Sconfitta: → Fine: completata, Disco pub]

[Catena, prima di Mara] **Sergio** (neutra): La ciclista dei complotti. Chi ti manda stavolta, gli Illuminati o i satelliti?

[Catena, prima di Spazienzio] **Sergio** (neutra): Spazienzio. Cerca di non ribaltare il bancone: è ancora mio.

[Catena, prima di Celestina] **Sergio** (neutra): Pure tu? Dieci anni a dormire gratis sul mio pavimento, ed ecco come mi ripaghi.

[Catena, prima di Piera] **Sergio** (neutra): Piera. Se aspetto che finisci una frase, chiudo per vecchiaia. Gioca.

[Catena, prima di Beppe] **Sergio** (neutra): Beppe. Se vinco io, la ristrutturazione la fai gratis. In nero, come piace a te.

**Sergio** (neutra): Sapete come divertirvi, voialtri. Chissà... forse un giorno vi farò vedere quanto valgo davvero.

**Spazienzio** (soddisfatto): CE L'HAI GIÀ FATTO VEDERE, E HAI PERSO! GIUBILIAMOCI!

→ Scelta muta, se c'è: con chi sei d'accordo?

- con Sergio, che crede di saper fare di meglio [Se finale Il Serraglio resta] → S2
- con Spazienzio, che è contento di aver vinto [Se finale Il Serraglio resta]

→ Vai a: F2 [Se segno via-atto-3 = torneo]

→ Vai a: F1

## F2 — Il Serraglio è di tutti

[Sfondo: S2]

**Sergio** (neutra): Trecento e rotti, un bottone e una caramella. D'accordo, il resto lo anticipo io con la Apri e Chiudi. La caramella me la tengo, come garanzia.

[Achievement: Monetine]

→ Vai a: F1

## F1 — Il Serraglio resta

[Sfondo: S2]

**Il padrone del Dimmi Di Sì**: Lei ha fatto un grave errore. Duccio, mi sei costato un sacco di soldi: sparisci.

**Duccio** (neutra): Mi licenzia? Ma io sono di destra!

*La sera dopo il Serraglio è aperto, come sempre. Sergio, sul suo sgabello in fondo al bancone, fa finta di niente.*

[Se non visto S2] **Sergio** (neutra): Tutto è bene quel che finisce bene, che noia. Un po' mi pento di non aver fatto sul serio.

[Se visto S2] **Sergio** (neutra): Tutto è bene quel che finisce bene, che noia. Godetevi la vostra normalità.

→ Fine: completata, Il Serraglio è di tutti [Se segno via-atto-3 = torneo]

→ Fine: completata, Il Serraglio resta

## S2 — Sergio fa sul serio

[Nodo: segreto; se finale Il Serraglio resta]

[Sfondo: S2]

**Sergio** (neutra): Volete davvero vedere di cosa sono capace? Se puoi barare, non è barare.

→ Partita S2: a scelta fra Mara, Spazienzio, Celestina, Piera e Beppe (giocatore) contro Sergio

[Modificatori: ha letto i tuoi messaggi, ha comprato il mazzo, società apri e chiudi]

**Sergio** (neutra): Questo era davvero il meglio che potevo fare. Ve lo riconosco: siete in gamba. Forza, sciò: andate a bere.

[Achievement: Superboss]

→ Vai a: F2 [Se segno via-atto-3 = torneo]

→ Vai a: F1

## Achievement

### Ve l'avevo detto

Mara ha accusato tutti, nessuno escluso: Sergio, Piera, Beppe, Celestina e Grappino, in giri diversi.

[Quando: esplorato II1 e esplorato II2a e esplorato II2b e esplorato II2c e esplorato S1]

- Indizio: Mara ha sospetti su tutti. Proprio su tutti?
- Indizio, se esplorato II2a e esplorato II2b e esplorato II2c: Manca ancora qualcuno. Qualcuno con quattro zampe.

### Lasciatela finire

Hai difeso la frase di Piera, e lei l'ha finita alla firma.

[Quando: vinto II2a e visto III4]

- Indizio: Qualcuno interrompe sempre Piera.
- Indizio, se esplorato II2a: Se nessuno la interrompe, una frase di Piera arriva fino a lunedì.

### Lo diceva Celestina

Hai dato retta a Celestina sul pavimento e hai fatto ritorno al Serraglio di notte, nello stesso giro.

[Quando: visto I1s e visto III3b]

- Indizio: Celestina parla nel sonno. Qualcuno l'ha ascoltata?
- Indizio, se esplorato III3b: Certe sconfitte ti mettono all'altezza del pavimento.

### Rientro abusivo

Dopo lo sgombero, Celestina ti ha riportato dentro di notte: con la chiave o dalla finestra del bagno.

- Indizio: Dal Serraglio non ti cacciano così facilmente.
- Indizio, se esplorato III3b: Se Duccio ti butta fuori, segui Celestina.

### Monetine

Il Serraglio è di tutti, a rate.

- Indizio: Il Serraglio potrebbe essere di tutti.
- Indizio, se esplorato III2a: Vinci l'ultima partita dopo il torneo di Beppe.

### Sedici euro

Il Serraglio è diventato il Dimmi Di Sì Disco Pub.

[Nascosto] [Quando: finale Disco pub]

- Indizio: A volte perdere è il finale più caro.
- Indizio, se esplorato III5: Contro Sergio basta che uno solo perda.

### Il cane sa

Hai seguito Grappino in cantina.

- Indizio: Grappino guarda Sergio in un modo strano.
- Indizio, se esplorato II2c: Chi ha strappato la firma del bilancio? Uno con i denti piccoli.

### Tre vie

Hai seguito tutte e tre le piste dell'atto II, in giri diversi.

[Quando: esplorato II2a e esplorato II2b e esplorato II2c]

- Indizio: Ogni pista porta a Sergio, ma ognuna da un'altra parte.
- Indizio, se esplorato II1: Nell'atto II le piste sono tre: la memoria di Piera, i soldi di Beppe, il bidone di Celestina.

### Superboss

Hai battuto Sergio quando faceva sul serio.

[Nascosto]

- Indizio: Sergio non sopporta di perdere in casa sua.
- Indizio, se finale Il Serraglio resta: Vinta l'ultima partita, dai ragione a Sergio.
