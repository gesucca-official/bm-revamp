# Il Serraglio chiude — mockup del grafo della campagna principale

> Mockup del grafo della [carriera principale del Set Base](../../../docs/design/carriere/principale.md), versione 0.2 (14 novembre 2026),
> scritto da un esecutore il 14 novembre 2026 per vedere la carriera sulla bacheca e giocarla da cima a fondo con le partite simulate.
> **Le battute sono segnaposto**, una o due per scena, prese dalla colonna «Scena» della scaletta: **non sono i dialoghi della carriera** e
> non vanno nel serbatoio. Nodi, partite, scelte, segni, fili, finali, segreti e achievement seguono la scaletta; dove il formato non la
> regge, o dove la scaletta non dice abbastanza, la scelta del mockup è annotata qui sotto e nel
> [rapporto](../../../docs/design/carriere/mockup-principale.md).
>
> - **Ritratti:** Celestina, Beppe, Sergio, Duccio e Grappino hanno un cartoncino segnaposto con il primo piano dell'identikit approvato
>   (`segnaposto/`, fatto da `strumenti/segnaposto.mjs`); il padrone del Dimmi Di Sì è una figura in ombra, senza nome. Tutti con una sola
>   espressione, «neutra».
> - **Sfondi riusati:** il Dimmi Di Sì è S3 (l'esterno del tutorial) anche dentro; il bar di notte e la cantina sono S2 con il disordine;
>   la strada di notte è S1 con l'insegna spenta.
> - **«A scelta» e «l'alleato con cui hai più segni»:** chi gioca a scelta lo decide una scelta muta senza destinazione prima della partita
>   (II1, III1, III3a). «L'alleato con cui hai più segni» (III4, III5, S2) è il segno `alleato`, dato dalla via dell'atto III: Beppe per il
>   torneo, Mara per il pedinamento, Celestina per Grappino.
> - **Starter garantiti:** in II3 e in III1 lo sblocco dello starter ha una condizione sulla pista dell'atto II (`[Se …] [Sblocca: …]`,
>   estensione del formato per questo mockup).
> - **Finali:** III5 vinto finisce con una scelta muta che ha una sola opzione visibile per strada (il formato non ha uscite condizionate);
>   dopo F1, in un giro nuovo, c'è anche la rivincita S2.

[Carriera: principale; obbligatori: starter-celestina, starter-piera, starter-beppe, pvp]

## I1 — Il cartello

[Sfondo: S1 insegna-spenta]

*Sulla porta: «CHIUSO PER CESSIONE ATTIVITÀ. PROSSIMAMENTE: DIMMI DI SÌ 2».*

**Mara** (sospettosa): Qualcuno sta mentendo. E sono tutti.

**Spazienzio** (furioso): SFONDIAMO LA PORTA. SFONDIAMOLA ADESSO.

**Celestina** (neutra): Il pavimento è mio. Lo dico al padrone, quando passa stanotte.

→ Partita I1: Spazienzio (giocatore) contro Celestina

**Ritento.** **Spazienzio** (fumante): DI NUOVO. SVEGLIAMOLA MEGLIO.

→ Scelta muta: chi segui?

- con Mara, a scoprire chi ha venduto [Segno: via-atto-1 = mara] → I2a
- con Spazienzio, a SPIEGARLO al Dimmi Di Sì [Segno: via-atto-1 = spazienzio] → I2b

## I2a — Il fabbro

[Sfondo: S1]

**Beppe** (neutra): Serratura nuova, pagata in contanti. «Apri e Chiudi s.r.l.», sede in Svizzera. Mai vista.

→ Partita I2a: Mara (giocatore) contro Beppe

**Beppe** (neutra): Va bene: di ogni chiave che faccio mi tengo una copia. Non si sa mai chi paga due volte.

[Segno: chiave]

→ Vai a: I3a

## I3a — La bici

[Sfondo: S1] [Entra: bici-mara]

**Beppe** (neutra): Per farmi perdonare ti ho riparato la bici. Più o meno.

**Spazienzio** (soddisfatto): CI SEDIAMO SOPRA. VEDIAMO SE REGGE.

→ Partita I3a: Mara (giocatore) contro Beppe e Spazienzio

→ Vai a: I4

## I2b — La porta

[Sfondo: S3]

**Duccio** (neutra): Prima di menarvi vi devo spiegare che sono di destra.

→ Partita I2b: Spazienzio (giocatore) contro Duccio

**Duccio** (neutra): Davanti a tutta la fila. Questa non la dimentico.

[Segno: duccio]

→ Vai a: I3b

## I3b — Virgin Cuba Libre

[Sfondo: S3, dentro il Dimmi Di Sì: si riusa l'esterno.]

**Mara** (agitata): Un kebab. Nessuno l'ha ordinato? Lo lascio qui.

**Il padrone del Dimmi Di Sì**: Il vostro padrone ha già detto quasi sì. Si firma domenica.

→ Partita I3b: Spazienzio (giocatore) contro Duccio, Mara e Beppe

→ Vai a: I4

## I4 — Venite voi qui!

[Sfondo: S2] [Entra: combriccola davanti-alla-porta]

**Un amico**: Serata «Salviamo il Serraglio»? Venite voi qui!

**Celestina** (neutra): Stasera sto con voi. Tenete, il mio mazzo.

→ Partita I4: Celestina (giocatore) contro Mara, Spazienzio e Beppe

[Sblocca: starter-celestina]

[Sblocca: pvp]

[Regia: sblocco del PvP e del mazzo costruito, con la busta e il negozio delle buste.]

**Un altro amico**: Allora sfidateci voi.

→ Vai a: II1

## II1 — Le voci

[Sfondo: S2]

**Mara** (sospettosa): È stato Spazienzio. No: Piera. No: Grappino. Lavorano tutti per loro.

**Sergio** (neutra): Una raccolta firme per questo letamaio. E i conti del bar, poi: lo sapete che siete sotto da marzo?

→ Scelta muta: chi risponde a Sergio?

- con Celestina [Segno: ii1 = celestina]
- con Mara [Segno: ii1 = mara]
- con Spazienzio [Segno: ii1 = spazienzio]

→ Partita II1: {ii1} (giocatore) contro Sergio

**Mara** (illuminata): Sa troppe cose. Lavora per loro. È evidente.

→ Scelta muta: quale pista?

- con Piera, che si ricorda di dieci anni fa [Segno: pista = piera] → II2a
- con Beppe, che sa chi pagava in contanti [Segno: pista = beppe] → II2b
- con Celestina, che fruga nel bidone [Segno: pista = celestina] → II2c

## II2a — La frase di Piera

[Sfondo: S2]

**Piera** (brilla): Dieci anni fa... stava per chiudere... e un signore...

[Stacchi: Spazienzio fumante] [Interrotta]

**Spazienzio** (furioso): E ALLORA? CHI ERA? DILLO!

→ Partita II2a: Piera (giocatore) contro Spazienzio

**Piera** (contenta): ...alto... e secco...

[Interrotta]

**Mara** (illuminata): Alto e secco. Un alieno. Ve l'avevo detto.

[Segno: frase]

[Sblocca: starter-piera]

→ Vai a: II3

## II2b — Contanti

[Sfondo: S2 disordine]

**Beppe** (neutra): Chi mi pagò i lavori dieci anni fa? Ve lo dico. In contanti.

[Se segno duccio] **Duccio** (neutra): E tu sei quello della porta. Beppe mi deve dei soldi; tu mi devi una faccia.

[Se non segno duccio] **Duccio** (neutra): Beppe. Il Dimmi Di Sì rivuole i suoi soldi.

→ Partita II2b: Beppe (giocatore) contro Duccio

**Beppe** (neutra): A chi mi aiuta faccio lo sconto. E una copia della chiave del bar, già che ci sono.

[Segno: chiave]

[Sblocca: starter-beppe]

→ Vai a: II3

## II2c — Il bidone

[Sfondo: S1]

**Celestina** (neutra): Il bilancio della «Apri e Chiudi s.r.l.». Metà. Sa di carta buona.

**Mara** (illuminata): Quello va sul mio muro dei complotti.

→ Partita II2c: Celestina (giocatore) contro Mara e Spazienzio

*La firma non c'è: l'ha strappata un cane piccolo. Si vedono i denti.*

[Segno: bilancio]

→ Vai a: II3

## II3 — Il muro dei complotti

[Sfondo: S2]

**Mara** (illuminata): Tutti i fili portano a lui. Sergio lavora per il Dimmi Di Sì.

[Se non visto I3b] **Sergio** (neutra): Fate pure. Tanto domenica sarete fuori.

**Duccio** (neutra): Io sto con lui.

[Se segno pista = piera] [Segno: ii3 = beppe]

[Se non segno pista = piera] [Segno: ii3 = piera]

→ Partita II3: {ii3} (giocatore) contro Sergio e Duccio

**Sergio** (neutra): Non avete capito niente.

[Se segno pista = piera] [Sblocca: starter-beppe]

[Se non segno pista = piera] [Sblocca: starter-piera]

→ Vai a: III1

## III1 — Sabato sera

[Sfondo: S2]

[Se segno duccio] **Duccio** (neutra): Ti ricordi la porta? Stasera sgombero io. E tu esci per primo.

[Se non segno duccio] **Duccio** (neutra): Sgombero, per conto del Dimmi Di Sì. Fuori tutti.

→ Scelta muta: chi affronta Duccio?

- con Beppe, che non ti ha ancora dato le sue carte [Se segno pista = celestina] [Segno: iii1 = beppe]
- con Piera [Se non segno pista = celestina] [Segno: iii1 = piera]
- con Beppe [Se non segno pista = celestina] [Segno: iii1 = beppe]
- con Celestina [Se non segno pista = celestina] [Segno: iii1 = celestina]

→ Partita III1: {iii1} (giocatore) contro Duccio

[Se segno pista = celestina] [Sblocca: starter-beppe]

**Mara** (pensierosa): Resta la notte. Che facciamo?

→ Scelta muta: e stanotte?

- con Beppe, a comprarlo noi con un torneo [Segno: via-atto-3 = torneo] [Segno: alleato = beppe] → III2a
- con Mara, a pedinare Sergio [Segno: via-atto-3 = pedinamento] [Segno: alleato = mara] → III2b
- con Grappino, dietro a lui in cantina [Se segno bilancio] [Segno: via-atto-3 = grappino] [Segno: alleato = celestina] → S1

## III2a — Il torneo

[Sfondo: S2 disordine]

**Beppe** (neutra): Torneo del Serraglio: iscrizione dieci euro, scommesse al bancone. L'incasso va nella colletta.

→ Partita III2a: Beppe (giocatore) contro Mara, Spazienzio, Celestina e Piera

[Sconfitta: → III3c]

**Beppe** (neutra): Vinto. Contiamo.

→ Vai a: III3a

## III3c — I debiti

[Sfondo: S2 disordine]

**Beppe** (neutra): Perso tutto. Adesso devo fare lavori in nero per tutti.

→ Partita III3c: Beppe (giocatore) contro Duccio e Celestina

→ Vai a: III3a

## III3a — I conti

[Sfondo: S2]

**Mara** (pensierosa): Mancano sempre dieci euro. E comunque non bastano.

**Sergio** (neutra): Una colletta. Che tenerezza. Ecco i miei dieci euro.

→ Scelta muta: chi conta i soldi?

- con Beppe [Segno: iii3a = beppe]
- con Mara [Segno: iii3a = mara]
- con Spazienzio [Segno: iii3a = spazienzio]
- con Celestina [Segno: iii3a = celestina]
- con Piera [Segno: iii3a = piera]

→ Partita III3a: {iii3a} (giocatore) contro Duccio e Sergio

→ Vai a: III4

## III2b — Il pedinamento

[Sfondo: S1 insegna-spenta]

**Mara** (sospettosa): Stanotte va a prendere ordini. Lo seguo.

**Sergio** (neutra): Mi segui? So del kebab mai consegnato. E di tutti gli altri.

→ Partita III2b: Mara (giocatore) contro Sergio

→ Scelta muta: e adesso?

- con Mara, ad aprire il bar con la chiave di Beppe [Se segno chiave] → III3b
- con Mara, ad aspettare domenica [Se non segno chiave] → III4

## III3b — Di notte al Serraglio

[Sfondo: S2 disordine, il bar chiuso e buio.]

[Se segno pista = celestina] **Celestina** (neutra): Ve l'avevo detto che passa ogni notte. E a voi lo dico: è lui.

[Se non segno pista = celestina] **Celestina** (neutra): Ve l'avevo detto che passa ogni notte.

*Entra Sergio, con le sue chiavi. Si siede al bancone vuoto e guarda il locale.*

[Se segno duccio] **Duccio** (neutra): Ancora tu. Ho il contratto. E la mia rivincita.

[Se non segno duccio] **Duccio** (neutra): Il contratto, capo. Da firmare.

→ Partita III3b: Mara (giocatore) contro Sergio e Duccio

[Modificatori: ce l'hanno tutti con te]

[Achievement: Lo diceva Celestina]

→ Vai a: III4

## S1 — Il cane sa

[Nodo: segreto]

[Sfondo: S2 disordine, la cantina: si riusa il bar in disordine.]

[Entra: grappino ringhia]

**Piera** (offesa): Il cane... non si tocca...

→ Partita S1: {alleato} (giocatore) contro Piera

[Modificatori: il cane difende le sue cose, la cantina è buia]

*Fra le cose di Grappino, l'altra metà del bilancio. Firmato: «S. Sommerso».*

[Achievement: Il cane sa]

→ Vai a: III4

## III4 — La firma

[Sfondo: S2]

**Il padrone del Dimmi Di Sì**: L'assegno è pronto. Aspettiamo chi vende.

[Se segno via-atto-3 = grappino] *Prima che Sergio si sieda, il foglio con la firma è già sul tavolo.*

*Entra Sergio, e si siede dalla parte di chi vende.*

[Se segno frase] **Piera** (contenta): ...alto... e secco... e antipatico. Era lui.

[Se non segno frase] **Piera** (offesa): Era lui... quello...

**Spazienzio** (furioso): VE L'AVEVO DETTO.

→ Partita III4: {alleato} (giocatore) contro Sergio, Duccio, Spazienzio e Piera

→ Vai a: III5

## III5 — Rientrare

[Sfondo: S2]

**Sergio** (neutra): Fondi neri, anni fa, per non farlo chiudere. Adesso rientro. È solo business. E poi qui fate schifo.

→ Partita III5: {alleato} (giocatore) contro Sergio

[Sconfitta: → Fine: completata, Dimmi Di Sì 2]

[Se non segno via-atto-3 = torneo] **Sergio** (neutra): La prossima volta faccio sul serio.

→ Scelta muta: e il Serraglio?

- con Sergio, che straccia l'assegno [Se non segno via-atto-3 = torneo] → Fine: completata, Il Serraglio resta
- con Beppe, e la colletta [Se segno via-atto-3 = torneo] → Fine: completata, Il Serraglio è di tutti
- con Sergio, che vuole la rivincita [Se finale Il Serraglio resta] → S2

## S2 — Sergio fa sul serio

[Nodo: segreto; se finale Il Serraglio resta]

[Sfondo: S2]

**Sergio** (neutra): Ho perso in casa mia. Adesso faccio sul serio.

→ Partita S2: {alleato} (giocatore) contro Sergio

[Modificatori: ha letto i tuoi messaggi, ha comprato il mazzo, società apri e chiudi]

[Achievement: Rivincita]

→ Scelta muta: e il Serraglio?

- con Sergio, che straccia l'assegno [Se non segno via-atto-3 = torneo] → Fine: completata, Il Serraglio resta
- con Beppe, e la colletta [Se segno via-atto-3 = torneo] → Fine: completata, Il Serraglio è di tutti

## Achievement

### Ve l'avevo detto

Mara ha accusato tutti, nessuno escluso: la memoria di Piera, i soldi di Beppe, la spazzatura di Celestina e il cane.

[Quando: esplorato II2a e esplorato II2b e esplorato II2c e esplorato S1]

- Indizio: Mara ha sospetti su tutti. Proprio su tutti?
- Indizio, se esplorato II2a e esplorato II2b e esplorato II2c: Manca ancora qualcuno. Qualcuno con quattro zampe.

### Lasciatela finire

Hai difeso la frase di Piera, e lei l'ha finita alla firma.

[Quando: segno frase e visto III4]

- Indizio: Qualcuno interrompe sempre Piera.

### Lo diceva Celestina

Sei entrato di notte al Serraglio.

- Indizio: Celestina parla nel sonno. Qualcuno l'ha ascoltata?

### Monetine

Il Serraglio è di tutti.

[Quando: finale Il Serraglio è di tutti]

- Indizio: Il Serraglio potrebbe essere di tutti.

### Sedici euro

Il Serraglio è diventato il Dimmi Di Sì 2.

[Nascosto] [Quando: finale Dimmi Di Sì 2]

- Indizio: A volte perdere è il finale più caro.

### Il cane sa

Hai seguito Grappino in cantina.

- Indizio: Grappino guarda Sergio in un modo strano.
- Indizio, se esplorato II2c: Chi ha strappato la firma del bilancio? Uno con i denti piccoli.

### Tre vie

Hai seguito tutte e tre le piste dell'atto II, in giri diversi.

[Quando: esplorato II2a e esplorato II2b e esplorato II2c]

- Indizio: Ogni pista porta a Sergio, ma ognuna da un'altra parte.

### Rivincita

Hai battuto Sergio quando faceva sul serio.

[Nascosto]

- Indizio: Sergio non sopporta di perdere in casa sua.
