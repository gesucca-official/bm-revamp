# Dov'è Grappino? — mini-carriera di prova

> Mini-carriera di prova del prototipo CA-0a, scritta dalla regia l'11 novembre 2026 con battute segnaposto: **non è una storia del
> gioco** e non va nel serbatoio. Serve a mostrare rami, segni, condizioni, sconfitte che aprono un ramo, un nodo segreto, uno sblocco su
> ogni percorso e due achievement, con i soli asset del tutorial. Grafo e cosa dimostra ogni nodo:
> [proposta della Fase A](../../../docs/design/carriere/prototipo-fase-a.md#la-mini-carriera-di-prova). In Fase B, dopo la risposta P7
> del proprietario («sì, una seconda fine»), un secondo finale: il nodo H, «Grappino scappa di nuovo», con un terzo achievement per chi
> vede tutti e due i finali ([rapporto della Fase B](../../../docs/design/carriere/prototipo-fase-b.md)).
> Dal 14 novembre 2026 il retrobottega (nodo E), a cui si arriva solo perdendo in C, è segreto, come chiede la regola «le sconfitte
> sono un segreto» della [campagna principale](../../../docs/design/carriere/principale.md#le-sconfitte-che-aprono-un-ramo).

[Carriera: prova; obbligatori: starter-piera]

## Nodo A — Il bancone vuoto

[Sfondo: S2]

**Piera** (offesa): Grappino... non c'è più... era qui... col suo bicchierino... e adesso... c'è solo... il bicchierino...

[Stacchi: Mara neutra, Spazienzio quasi calmo] [Interrotta]

**Mara** (illuminata): Rapito. È chiaro. Vieni con me, {giocatore}: conosco ogni vicolo, li ho consegnati tutti.

**Spazienzio** (serio): FACCIA NUOVA, IL CANE LO TROVIAMO NOI. A MODO MIO. CERCHIAMOLO A SBERLE.

→ Scelta muta: con chi cerchi Grappino?

- con Mara [Segno: alleato = mara] → Nodo B
- con Spazienzio [Segno: alleato = spazienzio] → Nodo C

## Nodo B — Sulle tracce in bici

[Sfondo: S1, la strada davanti al bar.]

[Entra: bici-mara]

**Mara** (sospettosa): Impronte di cane. E di ciabatte. Ciabatte enormi.

**Spazienzio** (fumante): CHE AVETE DA GUARDARE LE MIE CIABATTE? CALPESTIAMOVI!

→ Partita 1: Mara (giocatore) contro Spazienzio

**Ritento.** **Mara** (agitata): Le ciabatte non mentono. Di nuovo.

→ Vai a: Nodo D

## Nodo C — In cucina

[Sfondo: S2]

**Spazienzio** (furioso): IL CANE È FINITO NEL KEBAB! LO SAPEVO! RESTITUIAMOLO!

**Mara** (agitata): Ma che dici? Il kebab è di pollo. Credo.

→ Partita 2: Spazienzio (giocatore) contro Mara

[Sconfitta: → Nodo E]

**Ritento.** **Spazienzio** (furioso): STAVOLTA LA CONSEGNIAMO NOI.

→ Vai a: Nodo D

## Nodo D — Di nuovo al bancone

[Sfondo: S2 disordine]

[Se segno alleato = mara] **Piera** (contenta): Mara... che porta sempre... il cibo... e adesso... anche le notizie...

[Se segno alleato = spazienzio] **Piera** (offesa): Te... che urli... al mio Grappino... da quando era... piccolo così...

**Piera** (brilla): Basta... adesso... ci penso io...

→ Partita 3: Piera (giocatore) contro {alleato}

**Ritento.** **Piera** (assonnata): Aspetta... che mi siedo... e riproviamo...

[Sblocca: starter-piera]

→ Scelta muta: con chi continui a cercare?

- con Piera → Nodo G
- con Spazienzio, che fiuta qualcosa [Se visto Nodo E] → Nodo F
- con Mara, che ha una consegna proprio lì fuori → Nodo H

## Nodo E — Il retrobottega

[Nodo: segreto]

[Sfondo: S2 disordine, il retro del bar.]

**Spazienzio** (quasi calmo): HO PERSO. VADO DI LÀ A ESSERE CALMO.

*Nel retrobottega c'è puzza di cane bagnato. E di grappa.*

**Spazienzio** (serio): QUESTA PUZZA LA CONOSCO. TENIAMOLA A MENTE.

→ Vai a: Nodo D

## Nodo F — Il vicolo

[Nodo: segreto]

[Sfondo: S1 insegna-spenta, il vicolo dietro il bar.]

[Entra: grappino russa]

**Spazienzio** (soddisfatto): ECCOLO. DORME SUI CARTONI. SVEGLIAMOLO A CALCI.

**Spazienzio** (quasi calmo): ...NO. LASCIAMOLO DORMIRE. PER STAVOLTA.

[Achievement: Fiuto da segugio]

→ Vai a: Nodo G

## Nodo G — Grappino è tornato

[Sfondo: S2]

[Entra: grappino seduto]

[Se visto Nodo F] **Piera** (contenta): Grappino... nel vicolo... a dormire... come me...

[Se non visto Nodo F] **Piera** (contenta): Grappino! ...È tornato... da solo... come me...

[Se segno alleato = mara] **Mara** (sospettosa): Tornato da solo. Certo. Come no.

[Se segno alleato = spazienzio] **Spazienzio** (soddisfatto): IL CANE È TORNATO. FESTEGGIAMOLO A BOTTE.

→ Fine: completata, Grappino è tornato

## Nodo H — La porta aperta

[Sfondo: S1]

[Entra: bici-mara] [Entra: grappino seduto]

**Mara** (contenta): Consegna lampo: kebab tripla cipolla per il civico accanto. Torno subito, {giocatore}, tienimi la porta.

*La porta resta aperta. Grappino annusa l'aria, annusa il kebab, annusa la libertà.*

[Esce: grappino]

**Mara** (agitata): No. No no no. Il cane. Era qui un secondo fa. Lo sapevo, è addestrato a scappare dalle porte aperte.

[Se segno alleato = spazienzio] **Spazienzio** (fumante): ORA LO CERCHIAMO DI NUOVO. CERCHIAMOLO PIÙ FORTE.

→ Fine: completata, Grappino scappa di nuovo

## Achievement

### Fiuto da segugio

[Nascosto]

Hai trovato Grappino nel vicolo.

- Indizio: Certe sconfitte portano lontano.
- Indizio, se giri 1: Quando Spazienzio perde, va a calmarsi nel retrobottega. E il retrobottega puzza di cane.

### Due padroni

Hai cercato Grappino sia con Mara sia con Spazienzio.

[Quando: esplorato Nodo B e esplorato Nodo C]

- Indizio: Chi ti accompagna la prima volta non è l'unico che poteva farlo.

### Cane che va, cane che torna

Hai visto Grappino tornare e Grappino scappare di nuovo.

[Quando: finale Grappino è tornato e finale Grappino scappa di nuovo]

- Indizio: Non tutte le storie di cani finiscono sul divano.
- Indizio, se finale Grappino è tornato: Chi porta i kebab lascia sempre qualche porta aperta.
