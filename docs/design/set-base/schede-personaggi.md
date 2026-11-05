# Schede dei personaggi del Set Base

> **Stato: approvato dal proprietario il 6 novembre 2026** (SB-9), con tutte le raccomandazioni: vedi
> [Decisioni del proprietario](#decisioni-del-proprietario). **Non normativo:** il regolamento vigente
> è [game-rules.md](../../game-rules.md) e la partita viva non cambia. Le carte non sono progettate qui: basic, bound e azioni
> sono compito di SB-10 e SB-11–SB-18; qui c'è solo la direzione.

**Perché esiste.** Il [piano del Set Base](../../set-base-plan.md#flavour) chiede di fissare subito i personaggi, perché un concept
genera meccaniche: chi è, come picchia, con quale risorsa, come perde, con quali valori parte. Queste schede sono la base di SB-10
(griglia degli slot e listino) e dei blocchi di ogni personaggio. **Tutti i valori iniziali sono ipotesi finché SB-10 non li misura.**

Fonti: [piano](../../set-base-plan.md) (letture del regolamento, regole dei mazzi, perimetro, D1–D27, Q6, Q10),
[regolamento 1.10](../../game-rules.md) (R01, R01a, R02, R04–R07), [bozza esterna](bozza-esterna-proposta-70-carte.md) (Mara, Pino, Gigi),
[rapporto SB-4](../../reports/set-base/sb-4-report.md#stile-contro-stile), [appunti](../../../IDEAS.md).

## Regole che valgono per tutte le schede

- **Nessuna risorsa o parola chiave nuova (D8).** Si usano HEALTH, ALERTNESS (A), VIOLENCE (V), TOXICITY (T), ALCOHOL (L), la salute
  come prezzo per Sant'Incasso (D27), HIT, CUT, POISON, stati INPUT e OUTPUT con durata, equip, timer, token, immunità agli effetti
  periodici, annullamento di mosse e le azioni sugli oggetti (prendere, rubare, scambiare, distruggere).
- **Ogni basic è una presa di oggetti con un tratto personale (D3)**; ogni personaggio ha almeno tre bound e ne porta due (D2).
- **Il triangolo.** Le mosse sono simultanee: ogni personaggio ha un modo suo di colpire, di difendersi e di smontare la mossa altrui,
  e ognuno dei tre perde contro qualcosa.

### Cosa insegna SB-4 sulle bound

Con i bot euristici il Junkie gioca la sua bound gratuita nel 78–90% delle mosse e Bruiser vince al massimo il 4,6%: i +5 T al
bersaglio si sommano e il veleno di fine turno cresce a ogni uso. Da qui quattro indicazioni, valide per ogni scheda:

1. **Niente che resti sull'avversario oltre il turno:** né T, né L, né perdite di A, né stati con durata. Anche un «−5 A al
   bersaglio» ripetuto otto volte sono −40 A.
2. **Una funzione per bound:** genera circa 5 della propria risorsa, *oppure* colpisce per circa 5, *oppure* para per il solo turno
   corrente. Le bound della bozza uniscono risorsa e danno e superano il tetto: SB-10 decide se cambiare tetto o carta.
3. **«5 risorse» non vale uguale per tutti.** 5 L a fine turno diventano 3 (R06), quindi una generatrice di L è debole per natura;
   5 T per il Tossico immune restano tutti; 5 A sono moneta e precedenza insieme; 5 HEALTH per Sant'Incasso sono sopravvivenza.
   Il listino di SB-10 deve tenerne conto.
4. **Niente oggetti, token, equip o cure dalle bound.** Ripetuti ogni turno diventano un equip permanente o una partita infinita.
   Restano esclusi anche i bersagli oggetto (vincolo del piano).

Il conto da tenere: una bound giocata in otto turni su dieci vale circa 40 danni o 40 risorse in una partita, cioè una SuperImpact.

---

## 1. Spazienzio de la Ucciso — base

**Chi è.** Il bullo del quartiere, che ha finito la pazienza prima di entrare nel bar. Non scappa e non schiva: sbuffa, carica e
quando arriva, arriva. Esiste già (`BigBadBruiser`) e il suo flavour resta.

**Come picchia.** Accumula **V** e la spende in colpi enormi, lenti e a priorità bassa. Incassare per lui è caricare: le sue difese
riducono l'HIT ricevuto e gli danno V. Mostra nello starter base V, HIT e la differenza fra colpo grosso e colpo rapido.

**Risorsa principale:** V. **Priorità tipica:** 0 per i colpi grossi, 2 per le difese.

**Rischio, cioè come perde.** È lento: chi taglia (CUT) o avvelena (POISON) aggira le sue difese contro l'HIT e lo logora mentre carica.
Un annullamento dopo che ha pagato 25 V gli brucia un turno e una carica. Ha un solo posto per gli oggetti, quindi ne perde molti.

**Valori iniziali proposti:** HEALTH 100, A 20, V 25, capacità oggetti 1, nessuna immunità. **Rispetto a R07: nessun cambio.**
Motivo: è il personaggio più semplice e quello su cui SB-12 costruisce la base stabile; conviene che sia il metro e che cambi
solo per una misura. Due valori da guardare in SB-10: con V 25 può giocare la carta più cara (oggi SuperImpact) già al primo
turno, il che smentisce un po' «accumula»; e la capacità 1 regge solo con pochi oggetti nello starter.

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Colpo grosso pagato con V, a priorità 0 | Parata che carica: HIT ricevuto ridotto per il turno, più V | «Fermati!»: poca V per annullare o rallentare la mossa successiva dell'avversario |
| Perde contro l'annullamento e contro chi agisce prima | Inutile contro CUT e POISON | Sprecata se l'avversario gioca su sé stesso o va prima |

**Meccaniche di base usate:** V come costo, HIT, stati INPUT con durata 0, annullamento della mossa successiva, quantità variabile
legata alla V residua (come ExtremelyViolentBlow). Niente di nuovo.

**Bound, direzione.** Una generatrice di circa +5 V senza danno; un colpetto di circa 5 HIT senza altro; una parata del turno
(HIT ×0,75, durata 0) senza V aggiunta. LittleRage oggi fa due cose (parata e +5 V): ripetuta ogni turno è una difesa permanente
che carica, da dividere o da misurare. LittleSmack (+5 A e 5 HIT) supera il tetto.

**Last resort propria (Q6):** no. Struggle (si fa male per fare male) è già la sua; uno starter base insegna la last resort generica.

---

## 2. Mara Contromano — base

**Chi è.** Rider che ha lasciato la bici contro il muro del bar con la consegna ancora calda. Arriva prima di tutti, taglia e se ne
va; se ti fermi a pensare ti ha già preso quello che avevi sul tavolo. Ma è leggera: due colpi seri e non si rialza. Viene dalla
bozza esterna (D26).

**Come picchia.** **Precedenza e tanti piccoli CUT.** Paga con A, gioca a priorità alta e consuma i propri oggetti prima che glieli
rubino o distruggano. Nello starter base è il contrasto di Spazienzio: A e CUT contro V e HIT.

**Risorsa principale:** A, che è insieme costo e precedenza (R04: l'ordine si calcola dopo i costi). **Priorità tipica:** 1–2.

**Rischio.** Poca salute: un colpo da 40 è metà della sua vita. Ogni A spesa le toglie precedenza a parità di priorità, quindi più
attacca e meno arriva prima. L'alcol che le arriva addosso le toglie A a ogni fine turno; i colpi che tolgono A la rallentano;
il POISON ignora le sue difese.

**Valori iniziali proposti:** HEALTH 85, A 40, **V 0**, capacità 2, nessuna immunità. **Rispetto alla bozza:** V da 10 a 0. Motivo:
il primo mazzo base deve mostrare due colori puri; con V 0 le carte generiche a costo V (YouStop compresa) le restano chiuse finché non
guadagna V, il che attenua il rischio, già segnalato dalla bozza, di contromosse troppo affidabili con A 40.

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Taglio rapido: CUT piccoli a priorità alta, pagati con A | Scarto fra due paraurti: HIT e CUT ridotti per il solo turno | Anticipo: consuma l'oggetto prima di un furto o di una distruzione; toglie A all'avversario perché perda la parità |
| Perde contro una parata o contro chi resiste di salute | Inutile contro POISON | Sprecata se l'avversario non punta gli oggetti o è già più lento |

**Meccaniche di base usate:** A come costo e come precedenza, CUT, priorità, stati INPUT con durata 0, azioni sugli oggetti,
perdita di A sul bersaglio (in azioni pagate). Niente di nuovo.

**Bound, direzione.** Una generatrice di circa +5 A; un taglio di circa 3–5 CUT; una schivata del turno. Attenzione alla generatrice:
+5 A ripetuti si sommano su di lei e le assicurano la precedenza per sempre, che vale più di 5 V. SB-10 la misura per prima.

**Last resort propria:** no, Struggle (stessa ragione di Spazienzio).

---

## 3. Tossico del Serraglio — avanzato

**Chi è.** Vive di quello che trova per terra e se lo mette in corpo. Il veleno non lo ammazza più: ci si è abituato. Agli altri,
invece, fa effetto. Esiste già (`ToxicJunkie`) e passa dagli starter base agli avanzati (D6).

**Come picchia.** **T come carburante e come veleno.** Immune all'effetto periodico di T, accumula tossicità senza danni, la spende per
le sue mosse e la scarica sull'avversario con azioni pagate. Picchia piano e a lungo: vince col tempo.

**Risorsa principale:** T. **Priorità tipica:** 1, con riflessi a 2.

**Rischio.** Gestione dell'immunità: se la perde (carte che la tolgono, timer che la rimettono in ritardo) la sua T alta diventa
veleno per lui. Chi azzera la T (HealingBlow) gli svuota il serbatoio. Le dosi che costano salute lo espongono ai colpi grossi.

**Valori iniziali proposti:** HEALTH 100, A 35, T 10, **capacità 2**, immunità all'effetto periodico di T. **Rispetto a R07:** solo la
capacità, da 3 a 2. Motivo: lo specialista degli oggetti diventa Gigi, che parte con 3; il Tossico usa gli oggetti come droga, non
come attrezzi. Il resto non cambia: la causa del dominio misurato in SB-4 è la bound, non i valori del personaggio, e va corretta lì.

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Intossicare: T sul bersaglio e POISON, con azioni pagate | Curarsi col veleno: salute ricavata dalla propria T | Riflessi da anfetamina: annulla le mosse successive dirette a lui |
| Lento a chiudere; perde contro chi azzera la T o lo uccide prima | Gli costa il carburante | Sprecata se l'avversario gioca su sé stesso |

**Meccaniche di base usate:** T come costo, immunità all'effetto periodico, POISON di fine turno (R06), aggiunta di T al bersaglio,
timer, annullamento, perdita di HEALTH. Niente di nuovo.

**Bound, direzione.** Una generatrice di circa +5 T a sé (per lui è carburante puro, quindi vale più di 5); un colpetto di circa 5 CUT
**senza** T al bersaglio; una terza su A o su una parata del turno. **PatheticBlade va riprogettata** (SB-4) e **RottenSmile** toglie A
che resta: entrambe escono dal tetto. Da tenere d'occhio in SB-13: la generatrice ripetuta più un'azione che travasa tutta la T sul
bersaglio (oggi ToxicBloodDrain) diventa una combo; è accettabile solo se costa una carta pagata e si misura.

**Last resort propria:** **sì, candidato forte.** L'ultima dose a mazzo vuoto è il suo flavour (oggi LethalHeroinDose). Deve restare
gratuita e sempre giocabile e chiudere la partita, non allungarla.

---

## 4. Pino l'Ultimo Giro — avanzato

**Chi è.** Frequentatore del bancone, entra nella rissa già alticcio e ordina «l'ultimo giro» da quattro ore. Grosso, lento, regge
tutto; ma il vino gli scende nelle gambe. Viene dalla bozza esterna (D26).

**Come picchia.** **L da spendere subito.** Beve, e nel turno dopo spende l'alcol in colpi pesanti prima che cali. Bottiglie e
cocktail sono la sua dispensa; una bottiglia rotta diventa un equip (il token BrokenBeerBottle esiste già). Dà il senso a L, che oggi
è poco sfruttata: è la risorsa che si perde se la tieni.

**Risorsa principale:** L. **Priorità tipica:** 0–1.

**Rischio.** Lentissimo: A bassa e, senza immunità, A che cala a ogni fine turno, quindi perde tutte le parità. L in eccesso è
sprecata, perché cala da sola. Chi azzera L (HealingBlow, un'acqua minerale) gli toglie il colpo del turno. CUT e POISON aggirano le
sue difese contro l'HIT.

**Valori iniziali proposti:** HEALTH 110, A 15, L 10, **V 0**, capacità 2, **nessuna immunità** (vedi [Q10](#q10-pino-e-limmunità-allalcol)).
**Rispetto alla bozza:** V da 10 a 0 (colore puro, come Mara) e niente immunità a L. Con L 10 senza spenderla, a fine turno perde 5 A
e scende a L 6: impara subito che l'alcol va speso.

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Testata dell'ultimo giro: HIT pesante pagato con L, prima che cali | Il bancone regge: tanta salute e HIT ridotto per il turno | «Offro io»: L all'avversario, che perde A a ogni fine turno (solo in azioni pagate) |
| Perde contro chi gli azzera L o lo anticipa | Inutile contro CUT e POISON | Lenta: rende solo nei turni dopo, e poco contro chi non usa A |

**Meccaniche di base usate:** L come costo ed effetto periodico (R06), aggiunta di L al bersaglio, HIT, stati INPUT, oggetti che danno
risorse, token ed equip da oggetti. Niente di nuovo.

**Bound, direzione.** Una generatrice di L (debole per natura, perché cala: si può valutare qualcosa più di 5); un colpetto di circa 5
HIT; una parata del turno. Nessuna bound dà L all'avversario: ripetuta, sarebbe il caso PatheticBlade con l'alcol.

**Last resort propria:** **sì, il candidato più forte.** «L'ultimo giro» è il suo nome: l'ultima carta del mazzo è l'ultimo bicchiere.
Gratuita, sempre giocabile, che chiude.

---

## 5. Gigi del Carro Attrezzi — avanzato

**Chi è.** Meccanico chiamato per la macchina sbagliata, col carro attrezzi in doppia fila davanti al bar. Ha sempre l'attrezzo
giusto in tasca, e quello degli altri lo smonta. Viene dalla bozza esterna (D26).

**Come picchia.** **Gli oggetti sono la sua risorsa.** Tiene più oggetti degli altri, li trasforma in equip (guanti, giubbotti,
bottiglie rotte) e con quelli i colpi piccoli diventano medi. Ruba e smonta gli oggetti altrui. La V che accumula con piccoli colpi
paga gli attrezzi, non un colpo finale.

**Risorsa principale:** gli oggetti sul campo, con V come moneta. **Priorità tipica:** −1–1.

**Rischio.** Debole a tavolo vuoto: se pesca male o glieli portano via, i suoi colpi restano piccoli. Mara consuma i suoi oggetti
prima che lui li prenda; chi rimuove gli equip (BadEducation) gli cancella il lavoro di più turni. La distruzione ripetibile, se fosse
troppo comoda, renderebbe la partita frustrante per chi gioca con gli oggetti.

**Valori iniziali proposti:** HEALTH 100, A 25, V 15, **capacità 3** (unico con 3), nessuna immunità. **Come la bozza.**

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Equipaggiato: equip che moltiplica l'HIT, poi colpi piccoli e frequenti | Equip difensivo: CUT o HIT ridotti per qualche turno | Smontare e rubare: toglie l'oggetto all'avversario prima che lo consumi |
| Perde contro chi gli toglie gli equip | Perde contro il POISON e contro chi gli porta via gli oggetti | Sprecata contro chi ha pochi oggetti (Spazienzio) o li consuma prima (Mara) |

**Meccaniche di base usate:** capacità degli oggetti, presa, furto, distruzione, scambio, equip da oggetti, stati OUTPUT e INPUT con
durata, token, V come costo, HIT. Niente di nuovo; l'equip da oggetti è il primo passo che manca al formato dati (rapporto SB-5).

**Bound, direzione.** Una generatrice di circa +5 V; un colpetto di circa 5 HIT; una parata del turno. **Nessuna bound tocca gli
oggetti** (vincolo del piano: «Smontiamo tutto» diventa un'azione regolare pagata) e nessuna crea token o equip.

**Last resort propria:** no, Struggle. Una last resort sugli oggetti violerebbe il vincolo «sempre giocabile».

---

## 6. Il Malalingua — booster (concept nuovo)

**Nome provvisorio: Cesira la Malalingua** (scelto il 6 novembre 2026; l'alternativa al maschile, Nando Malalingua, resta di riserva).

**Chi è.** La portinaia del palazzo di fronte al bar: sta alla finestra dalle sette di mattina, sa chi deve soldi a chi e chi ha
litigato con chi. Non tira il primo colpo: aspetta che lo tiri tu, e ti ha già detto dove andrà. Una parola sua e perdi la calma.
(Con Cesira il cast avrebbe due donne su sette.)

**Come picchia.** **Contromosse e letture.** Spende A per annullare la mossa successiva dell'avversario o per rubargliene l'effetto
(come WhatchaDoin, che oggi è generica e diventerebbe il suo cuore). Fra una lettura e l'altra punzecchia con colpi piccoli che
tolgono A, così l'avversario perde la parità proprio quando servirebbe.

**Risorsa principale:** A, con V come seconda (le letture più forti costano entrambe). Condivide A con Mara ma non la strategia: Mara
spende A per arrivare prima e colpire, la Malalingua per arrivare prima e annullare.

**Rischio.** Se legge male spreca il turno e la risorsa: una contromossa contro una mossa su sé stessi o più rapida non fa nulla, e
oggi YouStop regala pure +10 A all'avversario se lo trova. Danno proprio scarso: contro chi si limita a difendersi la partita si
allunga. Mara, con A più alta, la batte sulla parità a priorità 2.

**Valori iniziali proposti:** HEALTH 90, A 30, V 10, capacità 2, nessuna immunità.

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Frecciatina: piccolo danno e A tolta all'avversario | Fare la vaga: una parata breve, o scambiare gli oggetti per confondere | La lettura: annulla la mossa successiva o ne prende l'effetto |
| Debole da sola | Lascia l'iniziativa all'avversario | Sprecata se l'avversario gioca su sé stesso o la precede |

**Meccaniche di base usate:** annullamento della mossa successiva, esecuzione dell'effetto altrui come autore (WhatchaDoin), perdita
di A sul bersaglio, priorità, scambio di oggetti, A e V come costi. Niente di nuovo.

**Bound, direzione.** Una generatrice di circa +5 A; un colpetto di circa 5 HIT; una parata del turno. **Nessuna bound annulla mosse**
e nessuna toglie A all'avversario: un annullamento gratuito e ripetibile è proprio la frustrazione che SB-17 deve evitare.

**Last resort propria:** no. Una contromossa che torna a ogni pesca a mazzo vuoto sarebbe un annullamento gratuito ricorrente.

**Rischi da SB-17.** Contromosse che rendono frustrante la partita: si tengono pagate, limitate alla mossa successiva (come oggi) e con
un costo vero quando falliscono. I bot euristici leggono male per costruzione (SB-4: euristiche su costi e danno, non sull'avversario),
quindi il simulatore la sottostimerà: la prova umana conta più che per gli altri. Le contromosse sono le carte che restano in Java
(rapporto SB-5): più lavoro in SB-27. Contro Mara, A 40 contro 30: il matchup va misurato apposta.

---

## 7. Sant'Incasso — booster (concept nuovo)

**Nome provvisorio: Rocco «Sant'Incasso»** (scelto il 6 novembre 2026). Il soprannome resta: incassare vuol dire prendere colpi e prendere soldi.

**Chi è.** Ex pugile delle sagre di paese: un euro, tre schiaffi, e lui non va mai giù. Porge l'altra guancia, conta i colpi e te li
restituisce con gli interessi. Il guaio è che i colpi li paga lui.

**Come picchia.** **La salute come risorsa (D27).** Parte con più salute di tutti e la spende come gli altri spendono V o A: le sue
mosse migliori costano HEALTH. In cambio riduce il danno ricevuto e contrattacca: una stessa mossa può ridurre l'HIT del turno a sé e
colpire l'avversario. Vince quando l'avversario si è stancato prima di lui.

**Risorsa principale:** HEALTH, nessuna risorsa speciale. **Priorità tipica:** 2 per le parate che contrattaccano, 0 per i colpi pagati
col sangue.

**Rischio.** Muore se esagera: ogni mossa pagata lo avvicina allo zero, e un colpo grosso arriva su una salute già spesa. Se si limita
a incassare è lento a chiudere. CUT e POISON aggirano le riduzioni dell'HIT. Le cure lo rimettono in gioco, quindi chi le nega lo
rallenta.

**Valori iniziali proposti:** HEALTH 130, A 15, nessuna risorsa speciale (V 0), capacità 2, nessuna immunità. 130 è il conto di
circa 30–40 salute spese in una partita per restare all'altezza degli altri: da misurare in SB-18.

**Il suo triangolo.**

| Attacco | Difesa | Contromossa |
|---|---|---|
| Colpo pagato col sangue: tanto danno per un costo in HEALTH | Incassare: HIT ricevuto ridotto, tanta salute di partenza | Il contrattacco: a priorità alta si para il turno e colpisce, pagando salute |
| Lo avvicina allo zero | Perde contro CUT e POISON e contro chi non attacca | Sprecata se l'avversario non attacca: ha pagato per niente |

**Meccaniche di base usate:** HEALTH come costo (`Resource.HEALTH` esiste e `Move` paga i costi per qualsiasi risorsa, D27), stati
INPUT con durata 0, HIT, danno a sé (come Struggle), cure esistenti. Niente di nuovo. **Esclusa** la scala «più è ferito, più picchia»:
sfiorerebbe una parola chiave nuova e va fra le idee per le espansioni.

**Bound, direzione.** **Nessuna bound costa salute** (le bound sono gratuite per regola) e **nessuna cura**, che ripetuta renderebbe
la partita infinita. Una parata del turno; un colpetto di circa 5 HIT; una terza da definire su A.

**Last resort propria:** **sì, candidato.** «Porgi l'altra guancia»: a mazzo vuoto colpisce facendosi male, come Struggle ma col suo
tono. Deve restare gratuita, cioè con un danno a sé come effetto e non un costo in HEALTH, e chiudere la partita.

**Rischi da SB-18.** Il test sul costo in HEALTH chiesto dal piano: la mossa si presenta solo con salute sufficiente; pagare tutta la
salute uccide e la mossa prosegue (R04); il bot non si suicida per caso. In più:

- **Pari per suicidio:** se sta perdendo e l'avversario ha poca salute, può pagare tutta la sua per un colpo che uccide anche l'altro.
  Due morti nello stesso turno fanno patta (R06). Va deciso se è una giocata lecita o se i costi in HEALTH vanno tenuti piccoli.
- **Partite infinite:** riduzioni del danno più cure possono allungare la partita oltre i 12 turni. La last resort deve chiuderla.
- **Cure generiche:** per lui valgono doppio (salute e risorsa insieme); le cure di SB-19 vanno misurate anche con lui.
- **Leggibilità e convenzioni:** il costo in HEALTH non è danno, quindi non passa dagli stati di R05. Va scritto nelle convenzioni
  delle schede e riconosciuto da `check-rules.py` (SB-26), e il giocatore deve vederlo sulla carta (SB-25, SB-31).

---

## Confronto

### Valori iniziali

| Personaggio | Slot | HEALTH | A | Risorsa speciale | Capacità | Immunità | Fonte e differenze |
|---|---|---:|---:|---|---:|---|---|
| Spazienzio de la Ucciso | Base | 100 | 20 | V 25 | 1 | — | R07, invariato |
| Mara Contromano | Base | 85 | 40 | — | 2 | — | Bozza; V 10 → 0 |
| Tossico del Serraglio | Avanzato | 100 | 35 | T 10 | 2 | Periodico di T | R07; capacità 3 → 2 |
| Pino l'Ultimo Giro | Avanzato | 110 | 15 | L 10 | 2 | — | Bozza; V 10 → 0, niente immunità a L |
| Gigi del Carro Attrezzi | Avanzato | 100 | 25 | V 15 | 3 | — | Bozza, invariato |
| Cesira la Malalingua | Booster | 90 | 30 | V 10 | 2 | — | Nuovo |
| Rocco «Sant'Incasso» | Booster | 130 | 15 | — (paga in HEALTH) | 2 | — | Nuovo |

Salute da 85 a 130, A da 15 a 40, capacità da 1 a 3: sono leve di differenziazione senza meccaniche nuove. Ordine a parità di
priorità: Mara, Tossico, Malalingua, Gigi, Spazienzio, Pino e Sant'Incasso, prima dei costi.

### Risorsa × strategia

Il rischio indicato da SB-9 è che V, T, L e A coprano solo quattro identità su sette. Con la salute di Sant'Incasso e gli oggetti di
Gigi le risorse diventano sei; dove due personaggi condividono una risorsa, la strategia è diversa.

| Risorsa \ strategia | Esplosione | Precedenza | Logoramento | Spendi subito | Campo | Controllo | Incasso |
|---|---|---|---|---|---|---|---|
| **V** | Spazienzio | | | | (Gigi: V come moneta) | | |
| **A** | | Mara | | | | Malalingua | |
| **T** | | | Tossico | | | | |
| **L** | | | | Pino | | | |
| **Oggetti** | | | | | Gigi | | |
| **HEALTH** | | | | | | | Sant'Incasso |

| Personaggio | Vince… | Partita che preferisce | Chi lo mette in difficoltà |
|---|---|---|---|
| Spazienzio | con due o tre colpi grossi | media, con tempo per caricare | Mara (taglia prima), Tossico (veleno sotto le difese) |
| Mara | con tanti tagli prima degli altri | corta | Spazienzio se un colpo arriva, Pino (alcol che le toglie A) |
| Tossico | col veleno nel tempo | lunga | chi azzera la T, Spazienzio se chiude prima |
| Pino | con pochi colpi pesanti a ritmo di bicchieri | media | Mara (CUT), chi gli azzera L |
| Gigi | con colpi medi grazie agli equip | media | Mara (consuma prima), chi toglie gli equip |
| Malalingua | annullando i turni chiave | media | chi gioca su sé stesso, Mara (più rapida) |
| Sant'Incasso | resistendo e contrattaccando | lunga | Tossico (POISON), chi non attacca |

Le coppie a rischio di somiglianza sono **Mara e Malalingua** (A) e **Spazienzio e Gigi** (V): restano distinte se Mara non ha
contromosse d'archetipo e Gigi non ha colpi grossi. È un paletto per SB-10.

## Q10: Pino e l'immunità all'alcol

**Decisione del 6 novembre 2026 (D28 del piano): no, Pino parte senza immunità all'effetto periodico di L**, come proponeva il piano;
la variante con immunità si prova nel playground in SB-14, come confronto. I motivi della raccomandazione:

1. **Identità di L.** Senza immunità L è la risorsa che si perde se la tieni: diversa da V, che si accumula. Con l'immunità Pino
   accumulerebbe L come Spazienzio accumula V, e due identità su sette coinciderebbero.
2. **GoingBerserk.** Con L stabile i 30 HIT per 10 L diventano affidabili ogni volta che li vuole: è il rischio scritto in SB-14.
3. **Il costo vero è leggero proprio per lui.** L'effetto periodico toglie A: conta per le parità e per i costi in A, e Pino non
   vince sulla velocità né paga in A. Senza immunità perde soprattutto l'alcol non speso, che è la lezione giusta.
4. **Rende visibile L,** oggi poco sfruttata (lettura del piano): Pino è il personaggio che la spiega.
5. **Flavour:** chi beve rallenta.

Da verificare in SB-14: A che va sotto zero (R01 lo ammette) non rompe nessuna carta, per esempio le perdite «abs(A/2)».

## Idee fuori perimetro, per le espansioni

Riportate nell'elenco [«Idee per le espansioni»](../../set-base-plan.md#idee-per-le-espansioni) del piano:

- **Più ferito, più forte:** danni che crescono con la salute persa (Sant'Incasso).
- **Restituire il danno:** rimandare all'autore una parte del danno ricevuto (Sant'Incasso).
- **Vedere la mano o il mazzo dell'avversario,** anche una sola carta: cambia R08 (Malalingua, «sa tutto»).
- **Scarto forzato** di una carta dell'avversario, o pettegolezzo che gli blocca una carta (Malalingua).
- **Scommesse:** dichiarare in anticipo la mossa dell'avversario e guadagnare se si indovina (Malalingua).
- **Schivata vera:** annullare il danno ricevuto invece di ridurlo (Mara e la bici).
- **Astinenza:** penalità se il Tossico resta senza T per un turno.
- **Riparare o costruire oggetti** dagli scarti, slot di equip (Gigi).
- **Il giro offerto in FFA:** alcol a tutti gli avversari insieme (Pino).

Restano **dentro** il perimetro, perché usano meccaniche esistenti: dare L all'avversario con un'azione pagata (Pino), annullare ed
eseguire l'effetto altrui (Malalingua), costi in HEALTH (Sant'Incasso, D27), equip da oggetti (Gigi).

## Decisioni del proprietario

6 novembre 2026. Alle otto domande sotto il proprietario ha risposto: **«Sì, tutte»**. Valgono quindi tutte le raccomandazioni:

| Domanda | Decisione | Dove finisce |
|---|---|---|
| 1 | Pino **senza immunità** all'effetto periodico di L; la variante immune si prova in SB-14 | D28 del piano (era Q10) |
| 2 | Spazienzio **invariato** rispetto a R07; il Tossico cambia **solo la capacità, da 3 a 2** | Schede, SB-10 |
| 3 | Mara e Pino partono con **V 0** | Schede, SB-11, SB-14 |
| 4 | **Cesira la Malalingua**, la portinaia; risorsa A, V seconda | Schede, tabella «Personaggi» del piano |
| 5 | **Rocco «Sant'Incasso»**, HEALTH 130, nessuna risorsa speciale; «più ferito, più forte» alle espansioni | Schede, tabella «Personaggi», «Idee per le espansioni» |
| 6 | Last resort proprie per **Pino, Tossico e Sant'Incasso**, Struggle per gli altri; SB-10 le conferma nella griglia | D29 del piano (era Q6) |
| 7 | **Una funzione per bound** e niente che resti sull'avversario, né oggetti, token, equip o cure: indicazione per SB-10, che misura | Schede, SB-10 |
| 8 | **Contromosse solo nelle azioni pagate:** nessuna bound e nessuna last resort annulla mosse | Schede, SB-10, SB-17 |

Le domande restano sotto nella forma in cui sono state poste.

### Domande poste

1. **Q10 — Pino senza immunità all'alcol**, con la variante immune provata in SB-14? *Raccomandazione: sì, senza immunità.*
2. **Spazienzio invariato rispetto a R07** (il metro) **e il Tossico cambia solo la capacità, da 3 a 2?** *Raccomandazione: sì.*
3. **Colori puri: Mara e Pino partono con V 0** invece di 10? *Raccomandazione: sì; gli starter si costruiscono di conseguenza.*
4. **Malalingua: «Cesira la Malalingua», la portinaia**, oppure «Nando Malalingua»? Risorsa A con V seconda. *Raccomandazione: Cesira.*
5. **Sant'Incasso: «Rocco Sant'Incasso», ex pugile delle sagre**, HEALTH 130, nessuna risorsa speciale, senza la scala «più ferito più
   forte» (che va alle espansioni)? *Raccomandazione: sì.*
6. **Q6 — last resort proprie** per Pino («L'ultimo giro»), Tossico (l'ultima dose) e Sant'Incasso («Porgi l'altra guancia»), Struggle
   per gli altri quattro? Solo segnalazione: la decisione resta a SB-10. *Raccomandazione: sì, come indicazione per SB-10.*
7. **Forma delle bound:** una funzione per bound (genera circa 5, colpisce circa 5 o para per il turno); niente che resti sull'avversario,
   comprese le perdite di A; niente oggetti, token, equip o cure. È l'indicazione per SB-10, che misura. *Raccomandazione: sì.*
8. **Contromosse solo nelle azioni pagate:** nessuna bound e nessuna last resort annulla mosse, per nessun personaggio. *Raccomandazione: sì.*
