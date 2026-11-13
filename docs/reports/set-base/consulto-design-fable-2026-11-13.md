# Consulto di game design — 13 novembre 2026

Consulto esterno prima di SB-16g Fase 2b. Autore: Claude Fable 5.2, su richiesta del proprietario. Solo questo file: nessuna modifica
a codice, regole, catalogo o altri documenti. Non è una decisione e non ne registra: propone.

**Convenzione.** «**Oss.**» è un fatto con la sua fonte (regola, carta, rapporto, partita, schermata). «**Op.**» è un mio giudizio, con il
perché. Le proposte hanno sempre: problema, beneficio, costo, rischio, verifica.

**Su cosa si basa.** Lettura di `AGENTS.md`, `docs/README.md`, [regolamento 1.13](../../game-rules.md), [Set Base 0.1](../../sets/base.md),
[piano](../../set-base-plan.md) (D1–D70, prove umane SB-12b, SB-16, SB-16f, blocchi SB-16b–SB-16g),
[proposta SB-16g 1.1](../../design/set-base/sb-16g-proposta.md), matrice di [SB-16e2](sb-16e2/incontri.md). Una partita giocata da me sul
client web con la bozza e le regole `d50` (Beppe contro Piera del computer, vedi «Partita giocata»). Limiti in fondo.

## Partita giocata (evidenza usata sotto)

Server `./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts`, client `./client-web/run.ps1 -Task Serve`, devAlice, «Contro il computer»,
finestra 1024×768. Io Beppe (80 HEALTH, 25 V), computer Piera (85 HEALTH, 10 L).

| Turno | Io | Computer | Esito |
|---|---|---|---|
| 1 | Preparo il lavoro (+10 V, cerca Lavoro fatto bene, ×1,5 su di me) | Estasi da Coca Etilene (gratuita, 10 + L = 20 HIT) | Io 80 → 50: 30 danni da una carta gratuita, per aver caricato al primo turno |
| 2 | Lavoro fatto bene (5 V, 14 HIT con due oggetti) | Un altro e arrivo (+15 L, +35 A, ×1,5 su di lei) | Piera 85 → 71 |
| 3 | Mattone del cantiere (15 V, 24 HIT) sul bersaglio esposto | Estasi (10 + 7 = 17 HIT) | Piera 71 → 35 (36 danni), io 50 → 33 |

Dopo tre turni: 33 contro 35, da 80 e 85.

---

## A. Come gioco di carte

### A1. Decisioni significative per turno

**Oss.** Il proprietario dopo SB-12b e SB-16: «non sentivo una vera scelta […] c'era solo da accumulare risorse per tirare il colpo più
forte possibile» (piano, SB-16b, Fase B). Dopo SB-16f, con le coppie caricamento-colpo: «il resto mi sembra a posto», e quattro richieste
tutte sulle coppie (piano, SB-16f).

**Oss.** Nella mia partita i turni 1 e 3 erano decisioni vere. Al turno 3 il bersaglio era esposto e io avevo in mano un colpo da 24: la
scelta «punisco ora o mi riparo» esisteva e si leggeva dal tavolo. Al turno 1, invece, ho caricato senza poter sapere nulla
dell'avversario e ho perso il 37% della salute.

**Op.** La coppia caricamento-colpo è la prima cosa del progetto che produce una decisione *a due*: chi carica dichiara qualcosa, chi
guarda deve rispondere. È la direzione giusta, perché il gioco a mosse simultanee vive di informazione parziale, e prima di D52 di
informazione sull'intenzione avversaria non ce n'era: la mano è coperta, le risorse dicono solo «può permettersi tutto». Il problema è
che **l'informazione corre in una sola direzione**: chi carica si scopre, chi risponde no. Ne discende A2.

### A2. Interazione e lettura dell'avversario

**Oss.** Risposte possibili a un caricamento visibile: colpire (premiato da ×1,5), parare il colpo annunciato il turno dopo, annullare
(YouStop e simili, priorità 2). Chi carica nel turno N ha nel turno N+1 tre opzioni: giocare il colpo, ripararsi, fare altro tenendo il
gettone (D69).

**Op.** Questo è un triangolo sano (colpo batte attesa, parata batte colpo, attesa batte parata) e D69 lo completa bene: senza timer,
tenere il colpo è una scelta con un prezzo che dura, non un obbligo. È la decisione migliore del blocco. Due riserve:

1. **Il primo turno e i turni «al buio».** Il caricamento è punito solo se l'avversario ha *già* un colpo in mano e risorse. Chi carica
   non lo può sapere. Nella mia partita il costo è stato 30 danni su 80. Con la proposta 1.1 i caricamenti diventano tre per mazzo su
   venti: si caricherà spesso al buio. Rischio: la lettura si riduce a «carico sempre, tanto è il piano del mazzo» oppure «non carico
   mai contro Piera/Mara». Entrambe sono regole fisse, non letture.
2. **La parata resta cieca tranne che contro il colpo annunciato.** D52(1) ha tolto la parata pura, ma il proprietario diceva «non avevo
   modo di riuscire a intuire quando li avrebbe usati». Ora lo si intuisce solo per i tre colpi cercati; gli altri colpi forti del mazzo
   (Mattone 24, Testata 25) arrivano ancora senza preavviso.

**Proposta A2-a — «il gettone si vede prima di decidere, il colpo no».** *Problema:* caricare al buio è una scommessa, non una lettura.
*Idea:* nessun cambio di regola; in 2b misurare **quanto danno medio subisce chi carica nel turno N**, per incontro e per turno di
partita. Se al turno 1–2 supera circa un quarto della salute, la leva è il fattore al turno N (×1,25 nel turno del caricamento, ×1,5 da
N+1 finché il gettone resta) e non il danno dei colpi. *Beneficio:* il prezzo cade su chi *tiene* il colpo (la scelta), non su chi
*annuncia* (l'informazione che vogliamo regalare al tavolo). *Costo:* un parametro in più sul gettone; nessuna meccanica nuova.
*Rischio:* caricare diventa troppo sicuro e torna «tutore che dà risorse», l'obiezione di SB-16f. *Verifica:* simulazione con le tre
politiche di 2b più la misura sopra; poi prova umana con la domanda «hai mai rinunciato a caricare?».

### A3. Identità dei personaggi

**Oss.** Cinque starter con risorse diverse: V che non decade (Spazienzio, Beppe), A che è anche velocità (Mara), T con veleno periodico
e immunità (Celestina), L che decade, toglie A e fa da corazza (Piera, D50.5). Beppe ha sette oggetti e un colpo che li conta.

**Op.** Le identità *meccaniche* sono distinte e ben motivate dal flavour; è il punto più forte del set. Piera è la più riuscita: la L
che evapora impone «bevi e spendi subito», cioè un ritmo proprio. Due debolezze:

- **Spazienzio e Beppe sono vicini** (V che si accumula, colpo grosso). Li distingue solo il tavolo di oggetti di Beppe. La proposta 1.1
  toglie a Beppe i due Mattoni e gli dà un taglio da 22 non legato agli oggetti: lo rende più affidabile ma *meno Beppe*.
- **Lo schema D61 è identico per tutti**: 2+2+1+1, stesso gettone ×1,5, stesso testo. Dieci carte su cento con lo stesso paragrafo
  rischiano di appiattire proprio quello che le risorse differenziano. D64 apre già a penalità diverse «in futuro o nelle buste».

**Proposta A3-a (dopo la 2b).** *Problema:* dieci caricamenti uguali. *Idea:* a criteri raggiunti, differenziare **una** delle due coppie
per personaggio usando la penalità coerente con la sua risorsa (per Mara il gettone toglie A, cioè velocità; per Piera sospende la
corazza; per Beppe l'avversario può colpire un oggetto). *Beneficio:* la vulnerabilità racconta il personaggio. *Costo:* supporto del
motore per gettoni diversi dal moltiplicatore, cinque testi nuovi, un giro. *Rischio:* complessità di lettura; per questo una sola coppia
e dopo, non ora. *Verifica:* prova umana comparata fra coppia standard e coppia personale.

### A4. Ritmo carica–colpo–parata (D52)

**Oss.** Durata obiettivo 6–12 turni (D16). In SB-16e2 sei incontri superano i 12 turni e lo specchio di Celestina è a 17,5. Nella mia
partita, con ×1,5 in gioco in due turni su tre, dopo tre turni restava il 40% della salute a entrambi.

**Op.** Il ritmo è leggibile: carico (N), colpo (N+1), e intorno bound e prese d'oggetto come «respiro». Funziona perché le bound sono
deboli (D2, tetto D33/D36): giocare una bound *si sente* come un turno perso, e questo dà peso al tempo. Il rischio opposto è che con
tre caricamenti, colpi da 40–54 e ×1,5 la partita diventi **due scambi**: chi azzecca il primo vince. La proposta 1.1 lo ammette
(«picchi letali», Spazienzio; 54 HIT del Rutto di Piera su salute 80–100).

**Proposta A4-a (prima della 2b, solo misura).** *Problema:* non c'è un criterio che protegga dal «colpo unico». *Idea:* aggiungere alle
misure di 2b, senza cambiare le soglie D16/D51, due contatori: **quota di partite decise da un singolo colpo ≥ 50% della salute
iniziale** e **turno mediano del primo colpo ≥ 30**. *Beneficio:* distingue «partite più corte» (voluto) da «partite a moneta» (non
voluto), cosa che la durata media non fa. *Costo:* due campi nell'osservatore del banco. *Rischio:* nessuno sul gioco; un po' di calcolo.
*Verifica:* simulazione.

### A5. Ricerca, colpi annunciati e vulnerabilità (D58–D70)

**Oss.** In una giornata (13 novembre) il legame della vulnerabilità è passato da «due turni» (SB-16d) a «copia precisa con minimo due
turni» (D59, D65) a «nome, senza timer, lo scarto non libera, omonima sì, uno per giocata, il più vecchio, a fine gruppo di velocità»
(D69), con il caso a parte della ricerca fallita (D70). Il testo di ogni caricamento nella proposta 1.1 è di circa 110 parole, identico
in dieci carte.

**Op.** La regola finale è *giusta nel comportamento* e *pesante nel testo*. Quasi tutte le clausole servono a casi rari (due gettoni
omonimi, omonima già in mano, colpo annullato, ricerca fallita). Un giocatore deve sapere tre cose: «cerco il colpo e lo mostro; finché
non lo gioco prendo più danni; scartarlo non mi salva». Il resto è da regolamento, non da carta.

**Proposta A5-a — «Annuncio» come regola di sistema, prima della 2b nei documenti di progetto, a SB-28 nel regolamento.**
*Problema:* 110 parole ripetute su dieci carte (e su ogni caricamento futuro delle buste); D8 vieta le parole chiave, ma qui la parola
chiave esiste già di fatto, solo scritta per esteso. *Idea:* chiedere al proprietario una deroga mirata a D8: una sola voce di
regolamento («Annunciare X: cerca X al posto della pesca, mostralo; finché non giochi una carta di nome X ricevi danni ×1,5») e sulla
carta «Guadagni 25 V e 15 A. **Annuncia** GARGANTUESCO IMPATTO SUL TU.» I casi limite stanno nella voce. *Beneficio:* carte leggibili sul
telefono; un solo punto da correggere se D69 cambia ancora; il verbo «annunciare» è già nel lessico del proprietario. *Costo:* una
decisione; riscrittura dei testi di proposta (meccanica invariata, nessun giro). *Rischio:* è la prima parola chiave: apre la porta ad
altre. La terrei unica finché il set non è chiuso. *Verifica:* prova umana di lettura: far leggere la carta lunga e la corta a qualcuno
che non conosce il gioco e chiedere cosa fa.

**Proposta A5-b — la ricerca fallita.** *Oss.* Con D61 ci sono 2 caricamenti per 2 colpi NC e 1 per 1 raro; se il raro è già stato
pescato e giocato o scartato, il suo tutore cerca a vuoto e lascia comunque ×1,5 per due turni (D70). *Op.* Punire chi non trova è
coerente («ho perso tempo») ma il giocatore **sa** già che fallirà: non è un rischio, è una carta morta che fa male. *Idea:* misurare in
2b quante volte il tutore del raro viene giocato a vuoto e quante resta in mano fino alla fine; se è frequente, far cercare al tutore
del raro «il raro, altrimenti il colpo NC». *Costo:* deroga a «un solo binding esatto» (D61). *Rischio:* più testo. *Verifica:*
simulazione (la misura è già prevista nella proposta, sezione bot e misure).

**Op. su D69 «lo scarto non libera».** È la clausola più severa: con il raro in copia unica il gettone può durare tutta la partita.
Mi piace come carattere («doveva pensarci prima»), ma va *vista* prima di scartare: il client deve avvisare quando lo scarto di una
bound è l'unica copia del nome annunciato. È leggibilità, non regola (vedi B).

### A6. Risorse e costi

**Oss.** Cinque risorse, tutte visibili; costi pagati prima degli effetti (R04.2); con D50 pavimento a zero e si paga solo ciò che si
ha. D63: ogni caricamento finanzia da zero il proprio colpo.

**Op.** D63 è corretta per l'esperienza (niente colpo annunciato e poi impagabile) ma ha un effetto collaterale: **caricamento + colpo
diventa una carta sola spalmata su due turni**, con costo netto zero. La risorsa smette di essere una scelta («spendo V per il colpo o
per la contromossa?») e diventa un lasciapassare. Il raro di Spazienzio e quello di Mara, che pagano con la risorsa *residua*, sono i
due disegni migliori della proposta proprio perché rimettono la risorsa al centro: più ne conservi, più fa male, e conservarla vuol dire
non parare. Preferisco quel modello al danno fisso.

**Oss.** ALERTNESS decide l'ordine a pari priorità (R04.3) e con P1 (D50.1) chi è a terra non colpisce: la velocità ora vale una vita
nel turno decisivo.

**Op.** È una buona tensione ma è quasi invisibile: nella mia partita non ho mai *deciso* in base alla A, perché nulla sul tavolo dice
«in questo turno arrivi prima tu». Finché non si vede, la A è una risorsa per i bot (vedi B).

### A7. Durata e pareggi (D16, D51)

**Oss.** Patte oltre il 10% negli specchi di Celestina (18,6% con la variante c) e Piera (13,1%); il proprietario ha rifiutato ogni
spareggio (D50.4). L'osservatore di SB-16e attribuisce la maggior parte delle patte a «opponent+self» e «stesso gruppo».

**Op.** Tre letture. (1) La patta in sé non è un difetto in una rissa: «ci siamo stesi a vicenda» è flavour quanto D48, e il 10% per
*ogni* cella, specchi compresi, è un criterio severo che sta costando giri. (2) Gli specchi in quick sono un quinto delle partite e gli
umani non giocano come due bot uguali: la simmetria perfetta è un artefatto. (3) Le patte nascono dai danni a sé delle last resort e
dalla simultaneità nel gruppo; alzare i danni dei colpi (2b) può *aumentarle*, come la proposta stessa avverte.

**Proposta A7-a (decisione, prima della 2b).** *Problema:* il criterio D51 sugli specchi può bloccare la 2b come ha bloccato SB-16e ed
e2. *Idea:* tenere il 10% per gli incontri fra personaggi diversi e portare gli specchi a una soglia più larga (15%) *oppure* a «da
riguardare in prova umana». *Beneficio:* il budget di tre giri va sulle coppie, che sono lo scopo del blocco. *Costo:* una decisione.
*Rischio:* uno specchio noioso resta; ma si corregge meglio con le last resort a priorità diverse (leva già in D51) dopo, a pool chiuso.
*Verifica:* nessuna nuova; è una scelta di criterio.

### A8. Strategie dominanti o noiose

**Oss.** Mara–Piera 0,65–0,67 e Celestina–Piera 0,66–0,69 (SB-16e2): il CUT e il POISON ignorano la corazza (D50.5). D67 propone il
Bancone anche contro il POISON.

**Op.** La corazza dell'alcol ha creato un sasso-carta-forbice per *tipo di danno*: bello sulla carta, pericoloso in quick dove il
personaggio è assegnato a caso. Perdere due volte su tre per l'accoppiamento, in una partita da cinque minuti, è tollerabile; saperlo
dal turno zero no. D67 è una toppa locale ragionevole. Non vedo oggi una strategia dominante *giocabile da umani* che i bot non mostrino,
ma i bot non pianificano e la ricerca li rende meno rappresentativi di prima (Spazienzio lasciava inutilizzata metà delle copie trovate,
piano SB-16g).

**Op., strategia noiosa candidata.** «Carico solo quando l'avversario ha appena speso»: la V e la T non decadono, quindi il momento
sicuro arriva sempre. Se la 2b mostra che la politica «gioca sempre il turno dopo» è la migliore in ogni incontro, la scelta di tenere il
colpo è finta. La proposta lo prevede già come criterio di robustezza: è il dato più importante della 2b, più delle quote.

### A9. Profondità a lungo termine, set e rarità

**Oss.** 120 carte: 7 personaggi, 42 azioni d'archetipo, 23 generiche, 16 oggetti; rarità 45 C / 55 NC / 20 R dopo la proposta. La
rarità è «complessità e anche potenza» (D9). Mazzi da 20 con due copie (D1), due bound scelte su almeno tre (D2).

**Op.** Con 6 carte d'archetipo regolari per personaggio più 23 generiche, lo spazio di costruzione è stretto: un mazzo è «le mie 6×2
meno qualcosa, più 8 generiche». Va bene per un set base, ma significa che **la profondità sta nella partita, non nel mazzo**, e quindi
il nucleo tattico (A1–A5) deve reggere da solo. Sulla rarità: più NC che comuni è insolito e la proposta lo dichiara; per un gioco senza
economia attiva oggi è solo un'etichetta, ma quando arriveranno le buste (roadmap EC) i caricamenti NC saranno il motore del mazzo e
averli «non comuni» vuol dire che un giocatore nuovo ne trova pochi. Lo riguarderei allora, non ora.

**Op.** Il rischio vero per la profondità è che il set base consumi l'unica idea forte (annuncio + gettone) su *tutti* i personaggi allo
stesso modo, lasciando alle espansioni solo variazioni numeriche. D8 diceva «senza spararsi subito tutte le cartucce». Sergio e Duccio
(SB-17, SB-18) sono l'occasione per **non** avere la coppia standard: per esempio un personaggio che non annuncia mai e ha invece gli
strumenti per punire chi annuncia.

---

## B. Come videogioco

Evidenza: la partita sopra, proseguita fino al turno 5 (io 30 di salute e V 0, Piera 11), la finestra a 1024×768 e una vista a 740×360
(telefono in orizzontale, emulata nel browser: non un telefono vero).

### B1. Primo impatto e apprendimento

**Oss.** Dalla home alla prima carta giocabile: Accedi, credenziali, «Gioca». Tre passi, nessun attrito. Il tavolo del bar, il
posacenere e il sottobicchiere danno subito un luogo e un tono.

**Oss.** L'aiuto «Al tavolo» (menu) è un blocco unico di testo fitto che spiega insieme conferma, ispezione, tastiera, bollini, monete,
priorità e riordino della mano. La priorità «è nella (i)».

**Op.** Il tono c'è, l'insegnamento no. Un giocatore nuovo deve capire in fretta quattro cose che il tavolo non dice da solo: le mosse
sono simultanee; l'ordine dipende da priorità e poi da ALERTNESS; le carte tratteggiate (base e legate) restano in mano; gli oggetti si
prendono con un'azione. Il tutorial delle carriere (roadmap CA) lo coprirà, ma è lontano. Per la 2b non serve nulla; lo segnalo come
debito: **le prove umane sono fatte da chi il gioco lo ha inventato**, e nessuno ha ancora misurato la curva d'ingresso.

### B2. Leggibilità di carte e risoluzione

**Oss.** Il volto di «Preparo il lavoro» mostra: titolo, «AZIONE REGOLARE», timbro RISORSE, «+10 V». Che la carta cerchi un colpo, lo
mostri e renda vulnerabili ×1,5 si legge solo aprendo la (i). Il timbro è lo stesso di una carta che dà risorse senza alcun rischio.

**Op.** È il difetto di leggibilità più importante per la 2b: la meccanica centrale del blocco **non è sul volto della carta**. Chi la
gioca la prima volta scopre la vulnerabilità prendendo 30 danni (a me è successo, sapendolo). Con tre caricamenti per mazzo succederà a
ogni giocatore nuovo.

**Proposta B2-a (insieme alla 2b o subito dopo, client).** *Problema:* il caricamento non si distingue da una carta di risorse. *Idea:*
un timbro proprio («ANNUNCIO») e, sul volto, il nome o la miniatura del colpo cercato e il segno ×1,5. I dati ci sono già (campo
`search` della vista, SB-16f0). *Beneficio:* la decisione di caricare si prende guardando la mano, non la (i). *Costo:* un ruolo o un
campo descrittivo in più (R07a è del regolamento: nel playground basta la vista), disegno del volto. *Rischio:* volto affollato su
telefono. *Verifica:* prova umana con una persona che non conosce le carte.

**Oss.** Il gettone sul bersaglio appare come **tre** stati negativi distinti (HIT, CUT, POISON), ciascuno con la stessa frase; sul mio
personaggio erano tre bollini «▼0». Testo dello stato: «Danni HIT ricevuti ×1,5 per questo turno e il prossimo.. finisce a fine turno.»
(doppio punto; «questo turno e il prossimo» accanto a «finisce a fine turno»).

**Op.** Un concetto, tre icone, un numero (0) che non dice ×1,5: è il contrario di «il gettone» di cui parla D69. Va reso come **un solo
segnalino** col nome del colpo e ∞, come D69 già prevede; lo annoto perché nella partita che ho giocato non era così (vedi difetti
tecnici: può dipendere dalle carte della bozza, non ancora quelle della proposta).

**Oss.** La carta trovata compare nella mia mano con la fascia «SCOPERTA». La risoluzione mostra le carte giocate in alto a sinistra con
«TU» / «COMPUTER», la variazione sul riquadro delle risorse («80 → 50») e un riepilogo testuale («Turno 2: tu → … · Computer → …»).

**Op.** La sequenza è chiara su *cosa* è successo, meno sul *perché del numero*. Al turno 1 ho visto 80 → 50 da una carta che dichiara
20: nulla in quel momento dice «×1,5 perché avevi caricato». Il moltiplicatore è il cuore della meccanica e dovrebbe comparire sul
colpo («20 ×1,5 = 30»), altrimenti il giocatore non collega causa ed effetto e la lezione di A2 non si impara.

**Oss.** La mano è un ventaglio di sei carte sovrapposte: a 1024 px i titoli visibili sono «Questo», «Una str», «Colpo d», «Mattone»; a
740×360 anche. Le carte non pagabili sono sbiadite, con il costo segnato.

**Op.** Le carte sbiadite funzionano bene. I titoli troncati contano poco per chi conosce il mazzo, molto per chi impara; il timbro del
ruolo e il numero in basso salvano la situazione. Con le illustrazioni vere (SB-32) migliorerà: oggi le carte della bozza sono rettangoli
neri, quindi **ogni giudizio estetico sulla bozza è sospeso**.

### B3. Feedback e soddisfazione dei colpi

**Oss.** Impatti per tipo di danno, bersaglio che vibra, numero che cala (C3). Al turno 3 il mio Mattone sul bersaglio esposto ha fatto
36: sul tavolo è apparso come gli altri colpi, più il numero.

**Op.** Il momento più bello della partita (punire un caricamento) non ha avuto una messa in scena diversa da un colpo qualunque. O32
(quantità di danno sull'impatto) è già registrata «dopo C5»: la anticiperei per i soli colpi su bersaglio esposto, perché è lì che la
meccanica nuova deve farsi *sentire*. Costo basso (scala dell'effetto in funzione del danno o del moltiplicatore), rischio nullo sulle
regole, verifica a occhio in prova umana.

### B4. Telefono

**Oss.** A 740×360 (emulato) il tavolo entra tutto; gli oggetti hanno titoli troncati («Giubbotto di fin…»), il riquadro avversario è
piccolo ma leggibile, il landscape è obbligatorio (C0).

**Op.** Giocabile. Il vero limite del telefono non è lo spazio ma il testo: le carte si capiscono dalla (i), e una (i) con 110 parole
(A5-a) su 360 px di altezza è una pagina da scorrere. È un argomento in più per la parola «Annuncia». Non ho provato un telefono vero né
il tocco: vale quanto dice il proprietario in SB-16f («sul PC e sul telefono», senza segnalazioni).

### B5. Durata di una sessione

**Oss.** Cinque turni in pochi minuti contro il computer, senza clock. Obiettivo 6–12 turni; sequenze di risoluzione fino a 19,7 s (C3).

**Op.** Una partita da 5–8 minuti è la misura giusta per «ancora una». Gli specchi da 15–17 turni di Celestina e Piera sono il doppio:
un motivo pratico, più forte delle patte, per accorciarli.

### B6. I bot come avversari

**Oss.** Il computer (stile predefinito `risorse`, D46) mi ha punito al turno 1 con Estasi, ha caricato al turno 2 e colpito al 3. Ha
caricato pur avendomi appena visto con 35 V: si è preso 36 danni.

**Op.** Come avversario per imparare va bene: gioca il ritmo e sbaglia in modo comprensibile. Come *misura* è il punto debole di tutto
il metodo. Le quote al millesimo su 32.000 partite danno un'impressione di precisione che i bot non meritano sulle carte nuove: non
leggono la mano scoperta (previsto in 2b), non pianificano, e le tre politiche sono fisse. Suggerisco di leggere la 2b così: **i bot
dicono se qualcosa è rotto (invarianti, picchi, patte), non se è equilibrato entro cinque punti.** Una quota 0,58 o 0,62 coi bot è lo
stesso dato.

### B7. Motivi per tornare

**Oss.** Oggi: quick con personaggio a caso, mazzo proprio contro computer, collezione aperta a tutti, nessun Elo, nessun premio (R06),
nessuna economia (D10).

**Op.** Per ora si torna solo se la partita in sé diverte, ed è giusto verificarlo *prima* di costruirci sopra carriere ed economia. Il
segnale che cercherei nelle prossime prove umane non è «bilanciato?» ma «hai rigiocato senza che te lo chiedessi? con quale
personaggio?». Finora le impressioni registrate sono tutte di bilanciamento o di meccanica, nessuna di voglia.

---

## C. Direzione

### C1. Dove il lavoro recente rafforza il gioco

- **D52 e D69** (annuncio, gettone senza timer): danno al gioco simultaneo l'informazione che gli mancava. È la risposta giusta alla
  critica più seria delle prove umane, e l'ha trovata il proprietario giocando.
- **P1, chi è a terra non colpisce** (D50.1): rende la velocità una posta reale e riduce le patte senza spareggi artificiali.
- **D52(1), nessuna parata pura:** una difesa che lascia qualcosa non è più la carta da scartare per le bound.
- **Il metodo:** regole nel playground dietro un interruttore, stop a budget finito, proposta prima della bozza. SB-16e ed e2 fermati
  senza forzare i numeri sono un buon segno.

### C2. Dove rischia di complicare senza ritorno

- **Velocità delle decisioni sul gettone.** D58, D59, D65 riviste da D69 nello stesso giorno, dopo che la 2a era già scritta. Il
  comportamento finale è buono; il modo no: più versioni in poche ore, tutte decise *a tavolino* e nessuna giocata. La 2b costruirebbe
  dieci carte e un giro di bilanciamento su una regola che nessun umano ha ancora provato.
- **Tre leve mosse insieme nella 2b:** frequenza dei caricamenti (1 → 3), potenza dei colpi, difesa dal POISON. La proposta chiede
  ablazioni separate, ma il budget è tre giri: se i criteri non tornano non si saprà quale leva ha rotto cosa. È il rischio già scritto
  in SB-16d («troppi cambi insieme»).
- **Uniformità.** Lo stesso schema e lo stesso testo per cinque personaggi (A3).
- **Criteri che guidano il disegno.** Il 10% di patte per cella e il 40–60% coi bot stanno decidendo carte (variante c, danni a sé 5 →
  2) più di quanto lo faccia il divertimento osservato.
- **Distanza dalla partita viva.** Regolamento 1.13 e Set Base 0.1 descrivono un gioco che nessuno sta più provando; D50–D70 vivono solo
  nel piano. Più si accumula, più SB-28 diventa un salto. Non è da correggere ora, ma ogni decisione nuova allunga il conto.

### C3. Cosa cambierei prima della 2b

| # | Proposta | Problema | Beneficio | Costo | Rischio | Verifica |
|---|---|---|---|---|---|---|
| C3-1 | **Una prova umana breve della sola 2a rivista**, con le carte di oggi (un caricamento per mazzo), prima di inserire le dieci carte | D69 non è mai stata giocata | Si scopre se «tenere il colpo» è una scelta che viene in mente, prima di bilanciarci sopra | 20–30 minuti del proprietario; se le carte di oggi non usano ancora il gettone D69, un piccolo adattamento della bozza | Rinvia la 2b di una sessione | Prova umana: tre partite, una domanda: «hai mai tenuto il colpo? perché?» |
| C3-2 | **2b in due passi:** prima solo frequenza e finanziamento (2+2+1+1 con i danni di oggi), poi potenza | Tre leve insieme | Si sa quale leva sposta durata e patte | Giri più piccoli dentro lo stesso budget | I colpi «poco potenti» restano una sessione in più | Simulazione, stessi semi |
| C3-3 | **Parola «Annuncia»** (A5-a) decisa ora, anche solo per i testi di proposta | 110 parole per carta | Testi corti, un solo punto da cambiare | Una deroga a D8 | Prima parola chiave | Lettura a freddo |
| C3-4 | **Misure in più** (A2-a, A4-a): danno subito nel turno del caricamento; partite decise da un colpo ≥ 50% della salute | La durata media non vede le partite «a moneta» | Criterio contro il colpo unico | Due contatori | Nessuno | Simulazione |
| C3-5 | **Criterio degli specchi** (A7-a) allentato o rimandato alla prova umana | D51 ha già fermato due blocchi | Il budget va sulle coppie | Una decisione | Uno specchio lungo resta | Nessuna: è una scelta di criterio |

### C4. Cosa cambierei dopo

| # | Proposta | Problema | Beneficio | Costo | Rischio | Verifica |
|---|---|---|---|---|---|---|
| C4-1 | **Volto del caricamento e gettone unico** nel client (B2-a) | La meccanica centrale non si vede | Si impara dal tavolo | Client: timbro, segnalino, «×1,5» sull'impatto | Volto affollato | Prova umana con un estraneo |
| C4-2 | **Una prova con un giocatore che non è il proprietario** | Nessun dato sulla curva d'ingresso né sulla voglia di rigiocare | Il primo giudizio non viziato dal sapere già le regole | Trovare una persona, un'ora | Giudizio scomodo a set avanzato: meglio ora che a SB-28 | Osservazione senza aiutare, poi tre domande |
| C4-3 | **Sergio e Duccio senza coppia standard** (A9) | Un'idea sola per sette personaggi | Varietà di piano di gioco; qualcuno che *punisce* gli annunci | Revisione di D52(3) | Più lavoro di progetto in SB-17 e SB-18 | Simulazione e prova umana |
| C4-4 | **Penalità personale** su una coppia per personaggio (A3-a) | Dieci caricamenti uguali | Identità | Motore, testi, un giro | Complessità | Prova umana comparata |
| C4-5 | **Ordine di risoluzione visibile prima di confermare** («a parità di priorità arrivi prima tu / lui», con le risorse note) | La A è una risorsa che il giocatore non vede lavorare (A6) | La velocità diventa una decisione | Client; non deve rivelare nulla della carta avversaria | Indicazione fuorviante se l'avversario cambia A nel turno | Prova umana |
| C4-6 | **Regolamento 1.14 in bozza** tenuto accanto al piano, aggiornato a ogni decisione D | Le regole d50 esistono solo come storia di decisioni | SB-28 smette di essere un salto; chi legge ha un testo solo | Un documento da mantenere, non normativo fino a SB-28 | Due testi che divergono | Revisione a mano a ogni decisione |

---

## Difetti tecnici incontrati (non indagati)

1. **Stato di vulnerabilità con testo incoerente e tre voci.** Sul bersaglio dopo «Un altro e arrivo»: tre stati separati (HIT, CUT,
   POISON) con «…per questo turno e il prossimo.. finisce a fine turno.» (doppio punto). La (i) di «Preparo il lavoro» dice «per 2 turni
   (questo e il successivo)» e cerca «Lavoro fatto bene»: coerente con la bozza corrente (variante c), non con D69. Probabilmente atteso
   finché la 2b non aggiorna le carte; da controllare che dopo la 2b resti **un** segnalino. Prova: testo della pagina al turno 3.
2. **Centro della carta coperto nel ventaglio.** Cliccando il centro geometrico del pulsante «Mattone del cantiere» (quinta carta) si
   seleziona la carta vicina, «Sotto il cofano», che lo copre. Riguarda l'automazione e forse le tecnologie assistive; con il mouse si
   clicca la striscia visibile. Prova: turno 4, due tentativi; il secondo, sulla striscia, ha funzionato.
3. **Indirizzo che resta `#/accedi`** dopo l'accesso e durante la partita. Solo osservato, può essere voluto.

Nessun arresto del server durante la sessione (quello segnalato in SB-16f non si è ripetuto in circa venti minuti).

---

## Le cinque cose più importanti

1. **L'annuncio con gettone (D52, D69) è l'idea che fa il gioco: va protetta, non moltiplicata.** Prima di triplicarne la frequenza e
   alzarne i danni, farla giocare una volta com'è (C3-1).
2. **Il prezzo oggi cade su chi annuncia al buio, non su chi tiene il colpo.** 30 danni su 80 al turno 1 nella mia partita. Misurare il
   danno nel turno del caricamento e, se serve, spostare il peso su N+1 (A2-a).
3. **La meccanica centrale non si vede sul volto della carta né sull'impatto.** Timbro proprio, gettone unico, «×1,5» sul colpo (B2-a).
   Senza questo le prove umane giudicano una regola che il tavolo non mostra.
4. **Una parola per dieci paragrafi.** «Annuncia X» come voce di regolamento (A5-a): una deroga piccola a D8 che toglie circa mille
   parole dal set e rende le carte leggibili sul telefono.
5. **I bot trovano le rotture, non l'equilibrio; i criteri non sono il gioco.** Due passi in 2b, specchi fuori dal cancello, e almeno
   una prova con qualcuno che non sia l'autore (C3-2, C3-5, C4-2).

## Domande al proprietario

1. Vuoi provare il gettone D69 con le carte di oggi prima di approvare le dieci carte della proposta 1.1?
2. Accetti una deroga a D8 per **una sola** parola di regolamento («Annuncia») al posto del testo lungo sui caricamenti?
3. Nella 2b preferisci un giro solo con tutte le leve (come proposto) o due passi, prima frequenza e poi potenza?
4. Il 10% di patte deve valere anche per gli specchi come cancello della 2b, o lì basta la prova umana?
5. Quando giochi, cosa ti fa venir voglia di rifare una partita, e con chi? (Non c'è una risposta registrata su questo.)
6. C'è una persona, non coinvolta nel progetto, a cui far provare la bozza prima di SB-17?
7. Sergio e Duccio devono avere la coppia standard di D52(3), o possono essere i personaggi che la rompono?

## Cosa non ho potuto valutare

- **Una sola partita, non finita** (cinque turni, un solo incontro, contro il computer). Nessuna partita fra due umani, nessuna FFA,
  nessun mazzo costruito, nessuno degli altri quattro starter in mano mia. Le osservazioni di gioco sono aneddoti.
- **Nessuna simulazione nuova.** I numeri citati sono quelli del rapporto SB-16e2; non ho lanciato il runner con `-Dsim.rules=d50` per
  mancanza di tempo. Le proposte di misura (A2-a, A4-a) sono ipotesi, non risultati.
- **La regola D69 e le carte della proposta 1.1 non erano nelle carte giocate**: i testi in partita erano quelli della variante (c), con
  l'esposizione a due turni. Il giudizio su D69 e sulle dieci carte è sulla carta. Non ho verificato come il motore della 2a rivista
  tratti le carte di oggi.
- **Telefono vero, tocco, audio, prestazioni:** solo una finestra ridotta a 740×360.
- **Estetica delle carte:** la bozza usa segnaposto neri.
- **Documenti letti in parte:** del piano ho letto criteri, blocchi SB-12 e SB-16–SB-16g e le decisioni; non la griglia, il listino, le
  schede dei personaggi, il flavour, le carriere né i rapporti in `docs/reports/set-base/` per esteso (solo la matrice di SB-16e2).
  Sergio e Duccio li conosco solo dal nome. Dove una proposta urta una decisione che non ho letto, prevale la decisione.
- **Tempo:** poco più di mezz'ora in tutto.

---

# Approfondimento — 13 novembre 2026

Secondo passaggio, dopo la [revisione indipendente](revisione-fable-2026-11-13.md). Scopo: prove per le domande che bloccano la 2b
(M1, G2, G5, K1, C3-1, C3-2), non un secondo giro generico. Stessa convenzione: **Oss.** fatto con fonte, **Op.** giudizio.

## AP0. Allestimento e diff usato

- **Worktree separato:** `git worktree add --detach E:\bm-d69 HEAD` su `d14f436`. Tutte le modifiche stanno lì e non sono committate;
  gli strumenti usa e getta stanno in `E:\bm-d69-tools` (fuori da entrambi).
- **Bozza D69:** in `E:\bm-d69\server\src\test\resources\set-base\bozza.json`, alle cinque carte di caricamento (bruiser.Glare,
  base.mara.Slalom, junkie.MethDrivenRage, base.pino.OffroIo, base.gigi.ColpoDiChiaveInglese): tolti i 13 passi `status` di
  esposizione a due turni (quelli col nome «… → …»), aggiunto `vulnerability` al passo `search`, testo allineato. **Nient'altro
  cambia**: numeri, copie, costi e colpi cercati sono quelli della variante (c). Non sono le dieci carte della proposta 1.1.
- **Diff** (`git diff --stat`: 1 file, 10 righe aggiunte, 140 tolte; le 140 tolte sono i 13 blocchi `status`). Righe aggiunte:

```text
"card": "bruiser.SuperImpact", "vulnerability": {"factor": 1.5, "turnsIfNotFound": 2}
"card": "base.mara.Sgommata", "vulnerability": {"factor": 1.5, "turnsIfNotFound": 2}
"card": "junkie.Cough", "vulnerability": {"factor": 1.5, "turnsIfNotFound": 2}
"card": "base.pino.GoingBerserk", "vulnerability": {"factor": 1.5, "turnsIfNotFound": 2}
"card": "base.gigi.LavoroFattoBene", "vulnerability": {"factor": 1.5, "turnsIfNotFound": 2}
SPA-AR3 · D69: HIT, CUT e POISON ricevuti ×1,5 finché non giochi il colpo cercato (2 turni se la ricerca fallisce); +15 V e +15 A. …
MAR-AR5 / TOS-AR1 / PIN-AR4 / GIG-AR3 · … HIT, CUT e POISON ricevuti ×1,5 finché non giochi il colpo cercato (D69; 2 turni se la ricerca fallisce). …
```

  Fatto con uno script di tre sostituzioni (espressioni regolari, poi `json.loads` di controllo):

```python
s = re.sub(r'\{[^{}]*"name":\s*"[^"]*→[^"]*"[^{}]*\},\s*', '', s)                      # 13 blocchi status
s = re.sub(r'("op":\s*"search",\s*"card":\s*"[^"]+")',
           r'\1, "vulnerability": {"factor": 1.5, "turnsIfNotFound": 2}', s)            # 5 ricerche
s = s.replace('per 2 turni (questo e il successivo)', 'finché non giochi il colpo cercato (D69; 2 turni se la ricerca fallisce)')
```

  Nota: Spazienzio passa così da «soli HIT» a HIT, CUT e POISON, come vuole D64.
- **Server e client:** una sola istanza ciascuno, quelli di `E:\bm` (jar esistente), col server avviato con
  `./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts -Draft E:\bm-d69\server\src\test\resources\set-base\bozza.json`.

## AP2. Simulazione

**Comando** (da `E:\bm-d69\server`, JDK e Maven di `E:\bm\.tools`), una volta per bozza:

```text
mvn -s E:/bm/scripts/maven-settings.xml -Dmaven.repo.local=E:/bm/.tools/m2 -B -o -q test
    -Dsim.rules=d50 -Dsim.styles=aggressivo,prudente,risorse,com -Dsim.threads=8
    -Dtest=D69ProbeTest#probe -Dsim.d69Games=300 -Dsim.d69Out=<uscita.json> -Dsim.draft=<bozza>
```

- **Bozze:** «oggi» = `git show HEAD:…/bozza.json` (variante c, esposizione a due turni); «D69» = quella di AP0.
- **Semi:** 7.000.000–7.000.299 per cella, gli stessi nelle due bozze; 15 incontri × 16 coppie di stili × 300 = **72.000 partite per
  bozza**; il posto si alterna col seme, come nel banco.
- **Sonda:** `D69ProbeTest` (usa e getta, nel worktree, mai committata), un osservatore su `ROUND_READY` / `ROUND_COMMITTED` come
  quello di SB-16e. Misura la **salute persa nel turno** (differenza fra inizio e fine turno, non sotto zero): comprende danni a sé e
  veleno, e le cure la riducono. Non isola il solo danno avversario.
- **Limite che pesa su tutto (B1 della revisione):** i bot **non leggono il gettone**. Non colpiscono chi è esposto più di prima e non
  decidono di tenere o giocare il colpo in base al gettone. Le misure dicono quanto costa il gettone **contro avversari che non lo
  sfruttano**: è un pavimento del prezzo, non il prezzo.

### AP2.1 Salute persa per turno, per stato di chi la perde (bozza D69)

| Personaggio | Turno normale | Turno del caricamento | Caricamento nei primi turni | Col gettone, gioca il colpo | Col gettone, non lo gioca | Turni col gettone per caricamento |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio | 6,11 | 6,81 | 8,13 | **7,28** | 6,75 | 2,42 |
| Mara | 6,16 | 9,00 | 13,60 | **5,56** | 7,01 | 1,58 |
| Celestina | 5,03 | 8,06 | 12,04 | **5,97** | 6,53 | 2,04 |
| Piera | 5,85 | 6,70 | 8,70 | **5,64** | 8,86 | 1,56 |
| Beppe | 6,35 | 7,42 | 11,17 | **5,94** | 6,93 | 1,54 |

«Turno normale» = né caricamento né gettone. «Primi turni» = caricamento giocato entro il terzo turno contato dal motore.

**Lo stesso turno «col gettone, gioca il colpo» nella bozza di oggi** (esposizione fissa di due turni, stessi semi): Spazienzio 6,97,
Mara 6,76, Celestina 6,81, Piera 8,09, Beppe 7,10.

**Oss. (M1).** Passando da «due turni fissi» a «fine gruppo» (D69), nel turno in cui si gioca il colpo cercato la salute persa scende
per quattro personaggi su cinque (Mara −18%, Celestina −12%, Piera −30%, Beppe −16%) e **sale per Spazienzio** (+4%). Spazienzio è
l'unico col colpo cercato a priorità 0 (gli altri a priorità 1) e ha A 20: il suo colpo si risolve dopo quelli avversari, quindi il
gettone è ancora lì quando arrivano. Per Mara, Piera e Beppe quel turno costa **meno di un turno normale**; per Celestina resta sopra
(5,97 contro 5,03).

**Oss. (turno del caricamento).** Caricare costa in media da +0,7 (Spazienzio, Piera) a +3 punti di salute (Mara, Celestina) rispetto a
un turno normale; nei primi turni 8–14 punti. I 30 punti che ho preso io al turno 1 nella prima partita sono la coda, non la media.

**Oss. (tenere il colpo).** Un turno passato col gettone senza giocare il colpo costa +0,6…+0,9 a Spazienzio, Mara e Beppe, +1,5 a
Celestina, **+3 a Piera**. Sommando caricamento e turni di gettone, un caricamento costa ai bot circa 2–5 punti di salute in tutto.

### AP2.2 Ricerche fallite (G2)

| Personaggio | Caricamenti per partita | Ricerche | Fallite | Copie del colpo cercato nello starter di oggi |
|---|---:|---:|---:|---:|
| Spazienzio | 0,59 | 16.926 | **21,9%** | 2 |
| Mara | 0,22 | 6.212 | **25,4%** | 2 |
| Celestina | 0,36 | 10.299 | **41,2%** | 2 |
| Piera | 0,74 | 21.110 | **39,5%** | 2 |
| Beppe | 0,39 | 11.050 | **61,3%** | 1 (rara) |

**Oss.** Fra un quinto e tre quinti dei caricamenti cercano a vuoto, e il caso peggiore è l'unico col colpo in copia singola. È lo
schema che la proposta 1.1 dà a **tutti e cinque** i colpi rari (un tutore, una copia). I numeri sono identici nella bozza di oggi
(±0,7 punti): non dipendono da D69.

### AP2.3 Partite con un turno da metà salute (C3-4) e patte negli specchi (G3)

| Incontro | Patte oggi | Patte D69 | Turni D69 | Partite con un turno ≥ 50% della salute iniziale | …e finite in quel turno |
|---|---:|---:|---:|---:|---:|
| Spazienzio–Spazienzio | 2,88% | 2,85% | 9,60 | **72,6%** | 7,8% |
| Spazienzio–Mara | 2,67% | 2,58% | 9,17 | 46,0% | 3,3% |
| Spazienzio–Celestina | 5,19% | 4,10% | 11,52 | 45,4% | 4,4% |
| Spazienzio–Piera | 3,98% | 3,79% | 12,25 | 14,9% | 1,9% |
| Spazienzio–Beppe | 3,00% | 3,02% | 10,19 | 49,3% | 3,4% |
| Mara–Mara | 3,48% | 3,58% | 8,80 | 4,8% | 0,4% |
| Mara–Celestina | 5,25% | 5,17% | 10,85 | 5,3% | 0,5% |
| Mara–Piera | 6,19% | 6,17% | 11,31 | 2,5% | 0,3% |
| Mara–Beppe | 2,08% | 1,77% | 9,42 | 1,8% | 0,2% |
| **Celestina–Celestina** | **19,06%** | **19,12%** | **17,90** | 3,7% | 0,9% |
| Celestina–Piera | 6,98% | 6,90% | 13,48 | 5,5% | 0,7% |
| Celestina–Beppe | 8,35% | 8,17% | 12,11 | 3,2% | 0,3% |
| **Piera–Piera** | **13,48%** | **13,40%** | **14,66** | 2,4% | 0,3% |
| Piera–Beppe | 7,50% | 7,50% | 12,67 | 0,9% | 0,2% |
| Beppe–Beppe | 8,23% | 8,46% | 10,78 | 0,3% | 0,04% |
| **Tutte** | 6,55% | 6,44% | 11,65 | 17,2% | 1,6% |

4.800 partite per riga. Con 300 semi per cella invece di 2.000 gli specchi di Celestina e Piera risultano 19,1% e 13,4%, in linea con
18,57% e 13,07% di SB-16e2.

**Oss. (G3).** D69 da sola non sposta le patte: ±0,3 punti ovunque, tranne Spazienzio–Celestina (−1,1). Gli specchi di Celestina e
Piera restano fuori soglia e lunghi.

**Oss. (C3-4).** Il «turno da metà salute» oggi è quasi solo di Spazienzio: Impatto fa 40 su salute 70–85, cioè metà salute anche
**senza** gettone. Negli altri incontri è sotto il 6%. Le partite *finite* in un turno così sono l'1,6%.

**Op.** Tre conclusioni, nei limiti dei bot ciechi:

1. **Il misuratore C3-4 serve, ma la soglia giusta è «finita in quel turno»**, non «è capitato»: la prima colonna è dominata da una
   carta sola. Oggi 1,6%. La proposta 1.1 porta colpi da 40–54 a tutti e triplica i caricamenti: è il numero da guardare prima e dopo.
2. **D69 è neutra sul bilanciamento finché nessuno la sfrutta.** Quote, patte e durate di SB-16e2 valgono ancora come base della 2b.
   È una buona notizia per C3-2 (vedi AP4): cambiare la regola del gettone non ha rimescolato la matrice.
3. **Il prezzo medio di un caricamento, 2–5 punti di salute, è basso** rispetto a quel che dà (+15 V e +15 A, o +15 L e +35 A).
   Contro bot che non puniscono, caricare è quasi gratis: il timore di SB-16f («tutori che danno risorse») resta fondato finché i
   bot non leggono il gettone (B1) o finché non lo misura un umano.

## AP1. Partite giocate con D69 attivo

**Non ho fatto quanto chiesto.** Richiesta: cinque starter contro il computer e due partite devAlice–devBob. Fatto: **una partita
contro il computer interrotta al turno 4** e **una partita a due finestre interrotta al turno 5**, più la partita del consulto (Beppe,
senza D69). Mancano Celestina, Beppe e Piera contro il computer con D69, la seconda partita fra umani e ogni finale. Motivo: il tempo;
ogni turno dal browser mi costa 20–30 secondi e ho dato la precedenza alla simulazione e alle risposte. Quel che segue è poco, ma il
secondo caso è una prova diretta di M1.

| # | Partita | Turni | Caricamento | Colpo tenuto? | Cosa ha fatto il gettone | Fine |
|---|---|---|---|---|---|---|
| 1 | Io Spazienzio («Con un tuo mazzo», `starter-spazienzio`) contro computer Mara | 4 | Mai: PAZIENZA: FINITA non è arrivata in mano; GARGANTUESCO IMPATTO era in mano dal turno 1 e l'ho giocato subito (25 V iniziali) | — | Niente | Abbandonata a 38 contro 23 |
| 2 | devAlice Piera contro devBob Mara, due schede, clock di 30 s | 5 | Alice al turno 3 («Un altro e arrivo», trovata Estasi) | No: giocato al turno 4, perché con +35 A Piera era diventata più veloce di Mara (36 contro 35) e volevo vedere M1 | **Non ha amplificato nulla**, vedi sotto | Interrotta a 36 contro 27 |

**Oss., partita 2, turno per turno** (testo delle due pagine):

- **Turno 3.** Alice (A 10) gioca il caricamento, Bob (A 40) gioca Sputo da posacenere, 12 POISON. Stessa priorità, Mara più veloce:
  lo Sputo si risolve **prima** che il gettone esista. Piera 73 → 61: 12 danni, non 18.
- **Fine turno 3.** Su Piera compare **un solo** stato: «Vulnerabile ×1,5. Danni da colpo, taglio e veleno ricevuti ×1,5. Nessun timer:
  finisce quando viene giocata una carta «Estasi da Coca Etilene», quella trovata o un'altra; scartarla non basta.» In mano ad Alice la
  carta è «scoperta, tiene una vulnerabilità ×1,5»; nella scheda di Bob il segnalino sul personaggio mostra ∞. Il testo è chiaro.
- **Turno 4.** Alice (ora A 36) gioca Estasi, Bob (A 35, 20 dopo il costo) gioca Sgommata, 25 CUT. Il gruppo di Alice si risolve
  prima, il gettone cade a fine gruppo, la Sgommata arriva dopo. Piera 61 → 36: **25 danni, non 37**. Mara 45 → 27 (10 + 8 L).
- **Bilancio:** un caricamento che dà +15 L e +35 A, due colpi avversari ricevuti nei due turni «a rischio», **zero danni in più**.
  Nel turno N perché l'avversario era più veloce (il gettone non c'era ancora), nel turno N+1 perché il caricamento stesso aveva reso
  più veloce chi caricava (il gettone non c'era più).

**Oss., leggibilità.** Con `vulnerability` il segnalino è uno solo e la frase è buona: il rilievo B2 del consulto («tre stati») era
della bozza, come dice la revisione. Restano veri: il volto del caricamento mostra solo «RISORSE, +15 L +35 A», e nel turno 4 nulla
sul tavolo dice che la Sgommata **non** è stata amplificata né perché.

**Oss., clock.** Fra umani i 30 secondi per mossa (R06) bastano per scegliere, non per leggere la (i) di una carta nuova.

## AP3. Quello che avevo saltato: schede, griglia, listino, Sergio e Duccio

Letti ora: [schede dei personaggi](../../design/set-base/schede-personaggi.md) (Sergio, Duccio, confronto), della
[griglia](../../design/set-base/griglia.md) i principi, gli slot `CES-*` e `ROC-*` e i principi di SB-16d, del
[listino](../../design/set-base/listino.md) la tabella e le conclusioni. Non letti: le altre righe della griglia una per una, flavour,
carriere.

**Oss.**

- **Sergio Sommerso** è già il personaggio delle **contromosse e delle letture**: CES-AR2 annulla la mossa successiva e ne esegue
  l'effetto (15 A), CES-AR3 annulla le mosse dirette a lui, CES-AR1/4/6 tolgono A. «Danno proprio scarso». Rischio dichiarato nella
  scheda: i bot lo sottostimeranno, «la prova umana conta più che per gli altri».
- **Duccio Braccio Teso** paga in HEALTH (130 di salute, ROC-AR1 12 HEALTH per 22 HIT, ROC-AR4 20 per 30), para e contrattacca
  (ROC-AR3), e ha ROC-AR6 «+15 HEALTH; HIT ricevuto ×1,25 per 2 turni».
- La griglia (principi di SB-16d) dice: «Per Sergio e Duccio la coppia si progetta nei rispettivi blocchi».
- Il confronto delle schede mette un **paletto**: Spazienzio e Beppe (entrambi V) «restano distinti se […] Beppe non ha colpi grossi».
- Il listino: priorità «vale quasi niente» e A come precedenza è **ordinale** («conta chi ha più A, non di quanto»), ma è misurato
  con le regole 1.13, dove il morto agisce comunque. V sopra i 20–25 «intasa la mano»; un'unità gratuita vale circa 6–8 HIT.
- Numeri delle dieci coppie (proposta 1.1), danno del colpo su salute iniziale di chi lo riceve (70–85): Impatto 40 (47–57%),
  Sgommata 25, Tossicone 18, Estasi 30–35, Chiave 22; rari: O-AHIO 32–45, Cinghiata 25–45, Rutto 44–54, Lavoro 14–35, travaso 12 più
  veleno. Guadagno di A dei caricamenti: Piera +35 (entrambi), Mara +20 e +30, Spazienzio +15 e +5, Celestina +5 e 0, Beppe 0 e 0.

**Revisione di A3 (identità).**

- **Op., ritiro una frase.** Avevo scritto che la proposta rende Beppe «più affidabile ma meno Beppe». Detto meglio, con la fonte:
  Chiave da tredici a 22 CUT e Lavoro fino a 35 HIT **toccano il paletto delle schede** («Beppe non ha colpi grossi»), mentre escono i
  due Mattoni generici. Non è un errore, ma è una deroga a un paletto scritto e va decisa come tale, non per taratura.
- **Op., confermo e preciso l'uniformità.** Lo schema è uguale per tutti, ma **il prezzo no**, e non per disegno: dipende dalla A che
  il caricamento regala. Piera e Mara ricevono dal proprio caricamento la velocità che fa cadere il gettone prima dei colpi
  avversari (AP1, AP2.1); Spazienzio, Celestina e Beppe no. Oggi la differenza fra i personaggi nel pagare l'annuncio è un effetto
  collaterale di M1, non un'identità scelta. La proposta A3-a (penalità personale) resta «dopo», ma **prima** va tolto questo
  effetto involontario (AP4, M1).

**Revisione di A9 e C4-3 (Sergio e Duccio).**

- **Op., ritiro C4-3 com'era scritta.** Proponevo «un personaggio che non annuncia mai e punisce chi annuncia» come idea nuova. Non lo
  è: **Sergio è già quello**, per scheda e per griglia. La proposta giusta è più stretta: **in SB-17 non dare a Sergio la coppia
  caricamento-colpo standard.** Un personaggio che vince leggendo non deve annunciare; e le sue carte guadagnano valore proprio
  perché gli altri cinque ora annunciano (CES-AR2 che ruba un colpo cercato e mostrato è la giocata più bella che il set permette).
  Serve una riga di deroga a D52(3) per Sergio. *Costo:* una decisione. *Rischio:* è il personaggio che i bot giocano peggio, quindi
  si decide quasi solo in prova umana. *Verifica:* prova umana, Sergio contro chi annuncia.
- **Op., Duccio.** Ha già in ROC-AR6 una carta «risorsa adesso, vulnerabile per due turni»: è un caricamento senza ricerca. La sua
  coppia può nascere lì (cura e ricerca dell'Uppercut, con gettone D69 al posto del ×1,25 a tempo) senza carte nuove. Attenzione a
  due cose: per lui la «risorsa» è la salute, quindi ×1,5 lo colpisce due volte; e con 130 di salute il colpo unico pesa meno.
- **Op., A9 resta:** il set base spende la stessa idea su tutti. Con Sergio senza coppia e Duccio con una coppia «sua», i sette
  personaggi avrebbero tre modi diversi di stare nel ritmo (annuncia, legge, incassa), che è quanto le schede promettono.
- **Op., una cosa nuova dal listino.** «La priorità non va pagata» e «A è ordinale» erano veri con le regole 1.13. Con P1 (chi è a
  terra non colpisce) e con il gettone a fine gruppo, arrivare prima vale molto di più: decide chi muore e se il gettone conta. Il
  listino di priorità e A va rimisurato con d50 e D69 prima di prezzare i +20…+35 A dei caricamenti; SB-16e lo prevedeva
  («Listino di priorità e A da rimisurare») e la 2b non lo cita.

## AP4. Risposte da designer

### M1 — Il gettone cade a fine gruppo o a fine turno?

**Oss.** (a) Partita 2 di AP1: due turni di rischio, zero danni amplificati. (b) AP2.1: con D69 il turno in cui si gioca il colpo
costa a quattro personaggi su cinque meno che con l'esposizione a due turni (a tre anche meno di un turno normale), e più solo a
Spazienzio, l'unico lento col colpo a priorità 0.
(c) I caricamenti di Piera danno +35 A e quelli di Mara +20/+30 (proposta 1.1): la carta che crea il gettone dà anche la velocità per
farlo cadere in tempo.

**Op.: fine turno.** Il gettone legato al nome deve cadere **alla fine del turno** in cui si gioca la carta con quel nome, non a fine
gruppo. Ragioni:

1. D52 chiede «un'esposizione che dura anche il turno dopo». A fine gruppo, per chi è veloce, il turno dopo non c'è.
2. Il prezzo dell'annuncio non deve dipendere dalla A, che è proprio la risorsa che i caricamenti regalano: altrimenti la leva di
   bilanciamento e l'effetto da bilanciare sono la stessa cosa.
3. Si spiega in sei parole («fino alla fine di quel turno»); «fine del gruppo di velocità» chiede di sapere cos'è un gruppo.
4. Ridà senso alla risposta dell'avversario: chi vede il colpo annunciato sa che nel turno in cui arriva potrà restituirlo ×1,5.
   Oggi, contro Mara o Piera, sa che non potrà.

*Cosa si perde:* la possibilità di «uscire» dal gettone giocando d'anticipo, che è una bella mossa per Mara. Si può ridare come
carattere a una sola carta («questo colpo toglie subito il gettone»), scritto sulla carta (R00). *Costo:* una riga in `settleGroup`,
qualche test di D69 da riscrivere, una frase di D69. *Rischio:* più doppi KO nel turno del colpo, quindi patte: da misurare.
*Verifica:* la stessa sonda di AP2 sulle due varianti, guardando la colonna «col gettone, gioca il colpo» e le patte; poi il turno 4
di AP1 rigiocato (deve dare 37, non 25).

**Op. sul turno del caricamento.** Resta «cieco», ma AP2.1 dice che costa in media 1–3 punti: è un prezzo d'ingresso accettabile, e
ritiro la proposta A2-a del consulto (×1,25 nel turno N): partiva da un mio aneddoto, i numeri non la sostengono.

### G2 — Come far costare la ricerca fallita

**Oss.** AP2.2: 22–61% di ricerche fallite; 61% dove il colpo è in copia unica, che è lo schema di tutti i rari della proposta. Una
ricerca fallita oggi dà le stesse risorse, un gettone di due turni invece che senza scadenza, e (AP1) spesso nessun danno in più.

**Op.** Fallire non deve essere l'esito migliore. In ordine di preferenza:

1. **Le risorse arrivano solo se la ricerca trova.** «Cerca X. Se lo trovi, guadagni 25 V e 15 A e sei vulnerabile…; se non lo
   trovi, pesca.» Il caricamento a vuoto diventa un turno perso: costa, e si spiega da solo. Rispetta D63 (le risorse servono a
   pagare *quel* colpo). *Costo:* un passo condizionale nel formato della bozza. *Rischio:* carta morta in mano a fine mazzo; ma una
   carta morta è uno scarto per le bound, che è il loro mestiere.
2. **Ripiego sul colpo NC per il tutore del raro** (A5-b del consulto): dimezza i fallimenti del caso peggiore senza cambiare il
   prezzo. Compatibile con la 1.
3. **Gettone anonimo più lungo** (tre turni invece di due): la leva più piccola, ed eredita il difetto di M1.

Sconsiglio «gettone senza scadenza anche se fallisce»: senza una carta da giocare non c'è uscita, ed è G5 moltiplicato.
*Verifica:* simulazione con la quota di caricamenti giocati a ricerca già impossibile (colpi tutti usciti dal mazzo), per politica;
è il numero che dice se i bot, e quindi un giocatore pigro, usano il tutore come generatore.

### G5 — Gettone permanente: serve un'uscita?

**Oss.** La sonda non ha potuto contare i gettoni rimasti a fine partita (il motore li pulisce prima). Nella bozza di prova i turni
col gettone per caricamento sono 1,5–2,4 in media (AP2.1), con Spazienzio più alto perché il suo caricamento non paga il colpo. La
revisione (M5) ha provato che dopo lo scarto dell'unica copia il gettone resta per sempre.

**Op.: sì, un'uscita sola, cara e visibile.** Tengo «lo scarto non libera» (è il carattere di D69) ma aggiungo: **il gettone cade
quando chi lo porta non ha più quella carta né in mano né nel mazzo, alla fine del turno successivo.** In pratica: scartare l'ultima
copia costa ancora un turno intero a ×1,5, poi basta. Così la punizione ha una misura, non dura dieci turni per un tocco sbagliato
sul telefono, e resta peggiore che giocare il colpo. È la proposta G5 della revisione con un prezzo esplicito. *Costo:* un controllo
a fine turno. *Rischio:* «scarto e pago un turno» diventa una via d'uscita abituale: il turno a ×1,5 deve restare più caro che
giocare un colpo parato. *Verifica:* contare nella sonda, prima della pulizia, i gettoni vivi all'ultimo turno e i turni vissuti
col gettone dopo lo scarto. In ogni caso serve l'avviso del client prima dello scarto (M5).

### K1 — La carta mostrata dopo lo scarto

**Oss.** Proposta 1.1: il promemoria resta finché c'è il gettone, anche dopo lo scarto. Motore: la carta si mostra solo se quella
copia è in mano. In partita (AP1) il segnalino dice già il nome del colpo, in chiaro.

**Op.: ha ragione il motore, va corretta la proposta.** Una carta disegnata a faccia in su nella mano dell'avversario dice «ce l'ha».
Se l'ha scartata, è un'informazione falsa su cui l'altro deciderà di pararsi. D69 la chiama «promemoria di ciò che tutti hanno
visto»: quel compito lo fa il segnalino, che resta. Regola semplice: **la carta scoperta dice dov'è la carta; il segnalino dice che
il conto è aperto.** Dopo lo scarto: niente carta, segnalino con il nome e, se si adotta l'uscita di G5, il conto alla rovescia.
*Costo:* una frase della proposta. *Verifica:* nessuna nuova.

### C3-1 — Prova umana prima della 2b?

**Oss.** In due turni di una sola partita fra «umani» è emerso ciò che 72.000 partite di bot mostrano solo come una colonna
(AP1 contro AP2.1). La prova umana di D69 con le carte di oggi richiede il diff di AP0, pronto e di dieci righe.

**Op.: sì, e la restringo.** Non «tre partite libere», ma **mezz'ora con uno scopo**: il proprietario gioca Spazienzio (lento) e Piera
o Mara (veloci dopo il caricamento) e guarda una cosa sola: *quante volte il gettone ti ha fatto prendere più danni?* Se la risposta
per Piera e Mara è «mai», M1 è deciso senza altre misure. Prima di questa prova non approverei le dieci carte: i loro numeri
(+35 A, colpi da 40–54) sono tarati su un gettone che per metà dei personaggi non morde.

### C3-2 — 2b in uno o due passi?

**Oss.** D69 da sola non sposta quote, patte e durate (AP2.3): la matrice di SB-16e2 è ancora una base valida. I bot non leggono il
gettone (B1).

**Op.: tre passi corti, nello stesso budget, in quest'ordine.**

1. **Regole e bot, nessuna carta nuova:** decisione su M1, G2, G5, K1; bot che leggono gettone e carte scoperte (B1). Un giro sulle
   carte di oggi col diff di AP0. Dice quanto costa davvero il gettone quando qualcuno lo sfrutta. È il passo che oggi manca.
2. **Frequenza:** lo schema 2+2+1+1 con i danni attuali.
3. **Potenza:** i numeri della proposta, con il contatore «partite finite in un turno da metà salute» (oggi 1,6%).

Un giro unico con tutto insieme misurerebbe carte nuove con bot ciechi su una regola ancora aperta: tre incognite, tre giri di
budget, nessuna possibilità di attribuire le cause. Ritiro invece C3-5 come condizione: gli specchi non peggiorano con D69, quindi
il criterio delle patte si può lasciare com'è e rileggere dopo il passo 3.

## AP5. Cosa cambia nelle cinque cose più importanti

| # | Nel consulto | Dopo l'approfondimento |
|---|---|---|
| 1 | L'annuncio è l'idea che fa il gioco: provarla prima di moltiplicarla | **Confermata e più urgente.** Con «fine gruppo» per Piera e Mara il gettone non morde (AP1: zero danni in più in due turni; AP2.1). Prima la regola (M1 a fine turno), poi le carte |
| 2 | Il prezzo cade su chi annuncia al buio (30 su 80 al turno 1) | **Ritirata nella forma.** In media il turno del caricamento costa 1–3 punti, 8–14 nei primi turni: il mio era un caso estremo. Il problema vero è l'opposto: **il prezzo totale è basso (2–5 punti) e dipende dalla velocità.** A2-a ritirata |
| 3 | La meccanica non si vede su carta e impatto | **Ridotta.** Il segnalino con D69 è uno e si legge bene. Restano il volto del caricamento e il «×1,5» sull'impatto, a cui aggiungo: mostrare quando il gettone **non** ha agito e perché |
| 4 | Una parola, «Annuncia», al posto di dieci paragrafi | **Confermata, e più facile** se M1, G5 e K1 semplificano la regola: «fino alla fine del turno in cui giochi X» è già una frase da carta |
| 5 | I bot trovano le rotture, non l'equilibrio | **Confermata con un numero:** D69 non sposta la matrice perché i bot non la vedono. **Nuova al posto di «specchi fuori dal cancello»:** la ricerca fallita è frequente (22–61%) e oggi conviene (G2): le risorse solo se la ricerca trova |

**Nuove, da portare al proprietario insieme:** M1 a fine turno; G2 con risorse condizionate; G5 con uscita a un turno; K1 secondo il
motore; Sergio senza coppia standard; il paletto «Beppe non ha colpi grossi» da derogare esplicitamente o rispettare; listino di
priorità e A da rimisurare con d50.

**Cosa non ho fatto in questo approfondimento.** Cinque starter e due partite fra umani (fatte due partite parziali); nessuna
partita finita; nessuna misura delle varianti proposte (M1 a fine turno, G2, G5: sono proposte, non risultati); nessuna misura con
le dieci carte della proposta 1.1; la sonda misura la salute persa nel turno, non il solo danno avversario, e non conta i gettoni a
fine partita; griglia letta per principi e per gli slot di Sergio e Duccio, non riga per riga. Il worktree `E:\bm-d69` e gli
strumenti in `E:\bm-d69-tools` restano sul disco per chi vuole rifare le misure; si tolgono con `git worktree remove --force E:\bm-d69`.
