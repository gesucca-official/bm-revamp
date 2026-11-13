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
