# Il Serraglio chiude — mockup del grafo della campagna principale

> Mockup del grafo della [carriera principale del Set Base](../../../docs/design/carriere/principale.md), **versione 0.3** (14 novembre
> 2026; la prima stesura del mockup era sulla 0.2), scritto da un esecutore per vedere la carriera sulla bacheca e giocarla da cima a fondo
> con le partite simulate. **Le battute sono segnaposto**, una o due per scena, prese dalla colonna «Scena» della scaletta: **non sono i
> dialoghi della carriera** e non vanno nel serbatoio. Nodi, partite, scelte, segni, fili, sconfitte che aprono un ramo, finali, segreti e
> achievement seguono la scaletta; dove il formato non la regge, o la scaletta non dice abbastanza, la scelta del mockup è annotata qui
> sotto e nel [rapporto](../../../docs/design/carriere/mockup-principale.md#aggiornamento-alla-03).
>
> - **Ritratti:** Celestina, Beppe, Sergio, Duccio e Grappino hanno un cartoncino segnaposto con il primo piano dell'identikit approvato
>   (`segnaposto/`, fatto da `strumenti/segnaposto.mjs`); il padrone del Dimmi Di Sì è una figura in ombra, senza nome. Tutti con una sola
>   espressione, «neutra».
> - **Sfondi riusati:** il Dimmi Di Sì è S3 (l'esterno del tutorial) anche dentro; il bar di notte e la cantina sono S2 con il disordine;
>   la strada di notte e il marciapiede dello sgombero sono S1 con l'insegna spenta.
> - **«A scelta»** (II1, III1 quando non manca nessuno, III3a) è il selettore del personaggio prima della partita: «→ Partita X: a scelta
>   fra …» (estensione del formato della 0.3).
> - **Chi ti ha accompagnato nell'atto III** (III3b, III4, III5, S2) è il segno `alleato`: Beppe per il torneo, Mara per il pedinamento,
>   Celestina per lo sgombero e per Grappino. S1 lo gioca Celestina.
> - **Starter garantiti:** in II3 e in III1 lo sblocco dello starter ha una condizione (`[Se …] [Sblocca: …]`). In III1, quando Beppe non
>   ti ha ancora dato le sue carte, lo sblocco viene prima della partita, perché III1 si può perdere.
> - **Le sconfitte sono un segreto** (0.3.2): I1s, II2s, III1s e III3c sono nodi segreti, sulla bacheca solo dopo esserci arrivati; I1s e
>   II2s sono tasche (`[Nodo: segreto; tasca]`), che pendono dal nodo perso senza strade proprie.
> - **Finali:** III5 vinto esce con uscite condizionate (`→ Fine: … [Se …]`, estensione della 0.3): il finale giusto per la strada fatta,
>   senza pulsanti. Dopo F1, in un giro nuovo, prima delle uscite c'è l'offerta della rivincita S2 (una scelta «se c'è»).

[Carriera: principale; obbligatori: starter-celestina, starter-piera, starter-beppe, pvp]

## I1 — Il cartello

[Sfondo: S1 insegna-spenta]

*Sulla porta: «CHIUSO PER CESSIONE ATTIVITÀ. PROSSIMAMENTE: DIMMI DI SÌ 2».*

**Mara** (sospettosa): Qualcuno sta mentendo. E sono tutti.

**Spazienzio** (furioso): SFONDIAMO LA PORTA. SFONDIAMOLA ADESSO.

**Celestina** (neutra): Il pavimento è mio. Lo dico al padrone, quando passa stanotte.

→ Partita I1: Spazienzio (giocatore) contro Celestina

[Sconfitta: → I1s]

→ Scelta muta: chi segui?

- con Mara, a scoprire chi ha venduto [Segno: via-atto-1 = mara] → I2a
- con Spazienzio, a SPIEGARLO al Dimmi Di Sì [Segno: via-atto-1 = spazienzio] → I2b

## I1s — Il pavimento

[Nodo: segreto; tasca]

[Sfondo: S2 disordine, il pavimento del bar.]

*Spazienzio è per terra, accanto a Celestina, sul suo pavimento. Non può che ascoltarla.*

**Celestina** (neutra): Il padrone passa ogni notte. Si siede. Guarda. Io faccio finta di dormire.

**Spazienzio** (quasi-calmo): NESSUNO TI CREDE. MI RIALZO.

[Segno: celestina]

→ Torna a: I1, scelta

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

**Beppe** (neutra): Chi mi pagò i lavori dieci anni fa? Ve lo dico. In contanti.

[Se segno duccio] **Duccio** (neutra): E tu sei quello della porta. Beppe mi deve dei soldi; tu mi devi una faccia.

[Se non segno duccio] **Duccio** (neutra): Beppe. Il Dimmi Di Sì rivuole i suoi soldi.

→ Partita II2b: Beppe (giocatore) contro Duccio

**Beppe** (neutra): A chi mi aiuta faccio lo sconto. E una copia della chiave del bar, già che ci sono.

**Mara** (sospettosa): Beppe lavora per chi paga. Anche per loro.

[Segno: chiave]

[Sblocca: starter-beppe]

→ Vai a: II3

## II2c — Il bidone

[Sfondo: S1]

**Celestina** (neutra): Il bilancio della «Apri e Chiudi s.r.l.». Metà. Sa di carta buona.

**Mara** (illuminata): Quello va sul mio muro dei complotti.

→ Partita II2c: Celestina (giocatore) contro Mara e Spazienzio

*La firma non c'è: l'ha strappata un cane piccolo. Si vedono i denti.*

**Mara** (sospettosa): Celestina ha mangiato la prova. Apposta.

[Segno: bilancio]

→ Vai a: II3

## II3 — Il muro dei complotti

[Sfondo: S2]

**Mara** (illuminata): Tutti i fili portano a lui. Sergio lavora per il Dimmi Di Sì.

[Se non visto I3b] **Sergio** (neutra): Fate pure. Tanto domenica sarete fuori.

**Duccio** (neutra): Io sto con lui.

[Se visto II2s] **Piera** (offesa): Gioco... per Grappino... non per voi...

[Se segno pista = piera e vinto II2a] [Segno: ii3 = beppe]

[Se non segno ii3 = beppe] [Segno: ii3 = piera]

→ Partita II3: {ii3} (giocatore) contro Sergio e Duccio

**Sergio** (neutra): Non avete capito niente.

[Se segno ii3 = beppe] [Sblocca: starter-beppe]

[Se segno ii3 = piera] [Sblocca: starter-piera]

→ Vai a: III1

## III1 — Sabato sera

[Sfondo: S2]

[Se segno duccio] **Duccio** (neutra): Ti ricordi la porta? Stasera sgombero io. E tu esci per primo.

[Se non segno duccio] **Duccio** (neutra): Sgombero, per conto del Dimmi Di Sì. Fuori tutti.

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

**Celestina** (neutra): Di qua. La porta sul retro non la chiude nessuno da dieci anni.

[Segno: via-atto-3 = sgombero] [Segno: alleato = celestina]

[Achievement: Porta sul retro]

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

**Beppe** (neutra): Perso tutto. Adesso devo fare lavori in nero per tutti.

→ Partita III3c: Beppe (giocatore) contro Duccio e Celestina

→ Vai a: III3a

## III3a — I conti

[Sfondo: S2]

**Mara** (pensierosa): Mancano sempre dieci euro. E comunque non bastano.

**Sergio** (neutra): Una colletta. Che tenerezza. Ecco i miei dieci euro.

→ Partita III3a: a scelta fra Beppe, Mara, Spazienzio, Celestina e Piera (giocatore) contro Duccio e Sergio

→ Vai a: III4

## III2b — Il pedinamento

[Sfondo: S1 insegna-spenta]

**Mara** (sospettosa): Stanotte va a prendere ordini. Lo seguo.

**Sergio** (neutra): Mi segui? So del kebab mai consegnato. E di tutti gli altri.

→ Partita III2b: Mara (giocatore) contro Sergio

→ Vai a: III3b [Se segno chiave]

→ Vai a: III4

## III3b — Di notte al Serraglio

[Sfondo: S2 disordine, il bar chiuso e buio.]

[Se segno celestina] **Celestina** (neutra): Ve l'avevo detto che passa ogni notte. Da dieci anni, alle due. Beve un amaro e guarda.

[Se non segno celestina] **Celestina** (neutra): Ve l'avevo detto che passa ogni notte.

*Entra Sergio, con le sue chiavi. Si siede al bancone vuoto e guarda il locale.*

[Se segno duccio] **Duccio** (neutra): Ancora tu. Ho il contratto. E la mia rivincita.

[Se non segno duccio] **Duccio** (neutra): Il contratto, capo. Da firmare.

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

*Entra Sergio, e si siede dalla parte di chi vende.*

[Se segno frase] **Piera** (contenta): ...alto... e secco... e antipatico. Era lui.

[Se non segno frase] **Piera** (offesa): Un signore...

[Se non segno frase] **Sergio** (neutra): Sono io. Finiamola.

**Spazienzio** (furioso): VE L'AVEVO DETTO.

→ Partita III4: {alleato} (giocatore) contro Sergio, Duccio, Spazienzio e Piera

→ Vai a: III5

## III5 — Rientrare

[Sfondo: S2]

**Sergio** (neutra): Fondi neri, anni fa, per non farlo chiudere. Adesso rientro. È solo business. E poi qui fate schifo.

→ Partita III5: {alleato} (giocatore) contro Sergio

[Sconfitta: → Fine: completata, Dimmi Di Sì 2]

[Se non segno via-atto-3 = torneo] **Sergio** (neutra): La prossima volta faccio sul serio.

→ Scelta muta, se c'è: la rivincita?

- con Sergio, che vuole la rivincita [Se finale Il Serraglio resta] → S2
- con Beppe, a chiudere il bar per stasera [Se finale Il Serraglio resta]

→ Fine: completata, Il Serraglio è di tutti [Se segno via-atto-3 = torneo]

→ Fine: completata, Il Serraglio resta

## S2 — Sergio fa sul serio

[Nodo: segreto; se finale Il Serraglio resta]

[Sfondo: S2]

**Sergio** (neutra): Ho perso in casa mia. Adesso faccio sul serio.

→ Partita S2: {alleato} (giocatore) contro Sergio

[Modificatori: ha letto i tuoi messaggi, ha comprato il mazzo, società apri e chiudi]

[Achievement: Rivincita]

→ Fine: completata, Il Serraglio è di tutti [Se segno via-atto-3 = torneo]

→ Fine: completata, Il Serraglio resta

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

### Lo diceva Celestina

Le hai dato retta sul pavimento, e sei entrato di notte al Serraglio nello stesso giro.

[Quando: visto I1s e visto III3b]

- Indizio: Celestina parla nel sonno. Qualcuno l'ha ascoltata?
- Indizio, se esplorato III3b: Certe sconfitte ti mettono all'altezza del pavimento.

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

### Porta sul retro

Sei entrato di notte al Serraglio senza la chiave.

- Indizio: Al Serraglio c'è sempre un'altra porta.

### Rivincita

Hai battuto Sergio quando faceva sul serio.

[Nascosto]

- Indizio: Sergio non sopporta di perdere in casa sua.
