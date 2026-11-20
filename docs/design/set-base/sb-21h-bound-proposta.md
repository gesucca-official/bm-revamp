# SB-21h — Proposta bound, Fase A

| Personaggio | Slot / tipo | Nome di lavoro | Testo proposto e valori | Pr. | Starter | Rarità |
|---|---|---|---|---:|:---:|:---:|
| Spazienzio | SPA-BO2 / a | Schiaffo e acqua fresca | Perdi un quarto della tua T e della tua L, ciascuno arrotondato per difetto; 2 HIT al bersaglio. | 1 | sì | C |
| Spazienzio | SPA-BO1 / b | Mi tengo al banco | +1 V a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | C |
| Spazienzio | SPA-BO3 / c | TESTA AL MURO | 3 HIT a sé; +8 V a sé. | 0 | no | NC |
| Mara | MAR-BO1 / a | Scarto e sputo | Perdi un quarto della tua T e della tua L, ciascuno arrotondato per difetto; 2 CUT al bersaglio. | 1 | sì | C |
| Mara | MAR-BO2 / b | Semaforo rosso | +2 A a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | C |
| Mara | MAR-BO3 / c | Ti chiudo la corsia | Gioca d'anticipo: il bersaglio perde 4 A. | 2 | no | NC |
| Celestina | TOS-BO1 / a | Fondo del posacenere | +2 T a sé; 2 CUT al bersaglio. | 1 | sì | C |
| Celestina | TOS-BO2 / b | Stretta al giubbotto | +4 T a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | C |
| Celestina | TOS-BO3 / c | Taglio la dose | Guadagni HEALTH pari a un quarto della tua T, arrotondato per difetto; poi perdi metà della tua T, arrotondata per difetto. | 0 | no | NC |
| Piera | PIN-BO2 / a | Spallata e seltz | Perdi un quarto della tua T, arrotondato per difetto; 2 HIT al bersaglio. | 1 | sì | C |
| Piera | PIN-BO1 / b | Tengo il posto | +1 L a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | C |
| Piera | PIN-BO3 / c | Mi schiarisco le idee | Guadagni A pari a metà della tua L, arrotondata per difetto; poi perdi metà della tua L, arrotondata per difetto. | 0 | no | NC |
| Beppe | GIG-BO2 / a | Colpo di cacciavite | +1 V a sé; 2 HIT al bersaglio. | 1 | sì | C |
| Beppe | GIG-BO1 / b | Dietro il cofano | +1 V a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | C |
| Beppe | GIG-BO3 / c | Affilo l'attrezzo | Equip: i tuoi HIT diventano CUT ×0,75, per questo turno e il prossimo. | 0 | no | NC |
| Sergio | CES-BO2 / a | Battutina | +2 A a sé; 2 HIT al bersaglio. | 1 | sì | NC |
| Sergio | CES-BO3 / b | Fare il vago | +2 A a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | NC |
| Sergio | CES-BO1 / c | Ne riparliamo fuori | Annulla la mossa del bersaglio se deve ancora risolversi e contiene Annuncia. | 2 | no | NC |
| Duccio | ROC-BO1 / a | Gomitata e fontanella | Perdi un quarto della tua T e della tua L, ciascuno arrotondato per difetto; 2 HIT al bersaglio. | 1 | sì | NC |
| Duccio | ROC-BO3 / b | Dietro lo striscione | +2 A a sé; HIT, CUT e POISON ricevuti ×0,75 in questo turno. | 2 | sì | NC |
| Duccio | ROC-BO2 / c | Mi rialzo dal marciapiede | Se alla risoluzione hai da 1 a 30 HEALTH, recuperi 4 HEALTH. | 0 | no | NC |

Proposta del 20 novembre 2026, **non adottata**, secondo [D159, D158 e precedenti](../../set-base-decisioni.md#decisioni-del-proprietario). Tutte gratuite; scarto R02 invariato; bersaglio avversario per (a), MAR-BO3 e CES-BO1, sé per le altre. Nessuna bersaglia oggetti. Stessi **21 slot e 124 carte**, rarità invariate; i nomi finali spettano a SB-24. Per Sergio e Duccio «starter» indica i mazzi di riferimento `prova-sergio` e `prova-duccio`.

**Fare il vago diventa (b)**: conserva slot e priorità, aggiunge POISON e A; CES-BO1 diventa la variante. Le (c) hanno sette impieghi distinti: carica V pagando salute; sottrazione di velocità condizionata; metabolismo di T in salute; conversione di L in A; conversione del danno per aggirare la corazza e usare gli equip CUT; interruzione di Annuncia; recupero per mazzi che spendono salute. Nessuna è un colpetto alternativo. NC indica specializzazione, non maggiore forza universale: D131 va verificata nel costruito adatto. La perdita di T/L delle varianti di Celestina/Piera è uno **scambio volontario di carburante**, non la pulizia della loro (a).

## Motore e dati

| Effetti / slot | Supporto attuale | Fase B |
|---|---|---|
| Tutte le 14 (a)/(b) | Puri dati: `damage`, `gain`, `lose`, `status`. | Dati, testi, griglia, attesi deliberati e bot. |
| SPA-BO3 | `damage` su sé, poi `gain`; già presente. | Rimisura nel nuovo ecosistema. |
| MAR-BO3 | `target: [{op: anticipo, steps: [{op: lose, resource: ALERTNESS, amount: 4}]}]`. | Misurare ripetizione e blocco della velocità; proposta esplicita di deroga al vecchio divieto di lasciare risorse mutate sull'avversario. |
| TOS-BO3 | `gain HEALTH {base:0, of:TOXICITY, divide:4}`, poi `lose TOXICITY {base:0, of:TOXICITY, divide:2}` in `self`. | Cura prima dello scarico; verifica delle immunità e del carburante perso. |
| PIN-BO3 | `gain ALERTNESS {base:0, of:ALCOHOL, divide:2}`, poi `lose ALCOHOL` con la stessa quantità. | Conta anche corazza persa e R06. |
| GIG-BO3 | `status`, `equip:true`, `flow:OUTPUT`, `property:HIT`, `convertTo:CUT`, `factor:0.75`, `turns:1`, `statusType:GOOD`. | Conversioni nell'ordine R05; niente rinnovo implicito o consumo istantaneo. |
| CES-BO1 | **Nuova classe Java bound**: contro condizionato al passo Annuncia della mossa ancora pendente. Le op dati non esprimono questa condizione. | Descrivere il predicato in `PrintedEffects` e supportarlo nei due modelli; non leggere scelte nascoste nella policy. Nessuna nuova op JSON necessaria se si usa `java:true`. |
| ROC-BO2 | **Nuova classe Java bound**, guadagno condizionato alla HEALTH corrente. | Predicato stampato e due modelli coerenti; sempre giocabile, nessun guadagno a terra o sopra soglia. Nessuna nuova op JSON necessaria. |

Riferimenti: [DataCards.java](../../../server/src/main/java/com/gsc/bm/sim/DataCards.java), [R02/R05](../../game-rules.md#r05--danni-e-stati), [principi e righe bound](griglia.md#bound-21). D159 supera «senza parate» e tetto in unità, non lo scarto né la costruzione del mazzo.

La pulizia proposta, in `self`, è esattamente:

```json
[
  {"op":"lose","resource":"TOXICITY","amount":{"base":0,"of":"TOXICITY","divide":4}},
  {"op":"lose","resource":"ALCOHOL","amount":{"base":0,"of":"ALCOHOL","divide":4}}
]
```

Per n non negativo resta **n − floor(n/4) = ceil(0,75n)**: da 6 resta 5, da 8 resta 6. Non è `floor(0,75n)`. Per questo il testo dice «perdi un quarto, per difetto», non un ×0,75 ambiguo. Il divisore 4 non è un fattore vietato da D158. Valgono gli eventuali modificatori di perdita di risorsa R05; non è uno svuotamento che li ignora. Per ottenere letteralmente il residuo troncato servirebbe estendere il formato (arrotondamento per eccesso della perdita o op di scala), qui sconsigliato.

Ogni (b) aggiunge tre stati indipendenti, uno per tipo:

```json
{"op":"status","name":"Riparo HIT","description":"HIT ricevuto x0.75",
 "statusType":"GOOD","flow":"INPUT","property":"HIT","factor":0.75,"turns":0}
```

Ripetere per CUT e POISON. **`turns:0`**, non 1: copre dalla risoluzione a fine turno, veleno periodico compreso; non para un colpo già risolto. Priorità 2, parità risolta con A dopo i costi. Non riduce costi/perdite dirette di HEALTH. Tre ×0,75 non si moltiplicano tra tipi diversi; altri stati compatibili si compongono, troncando a ogni passaggio. `singleUse` attuale richiede equip e dura ancora nel turno dopo l'uso: **non** significa «solo prossimo colpo».

## Bot: supporto e lacune

| File / componente | Oggi | Prima delle misure B |
|---|---|---|
| [StyleSupport.Plan/toxicRelief](../../../server/src/main/java/com/gsc/bm/model/game/bot/StyleSupport.java) | Premia EMPTY T, non LOSE parziale; nessun sollievo da L. Legge anche `gui.gains` (rigenerato nelle copie). | Valutare quantità reali di T/L rimossa, periodico evitato, immunità, domanda della mano e corazza persa; non premiare sprechi di carburante. |
| [AggressivePolicy](../../../server/src/main/java/com/gsc/bm/model/game/bot/AggressivePolicy.java), [PrudentPolicy](../../../server/src/main/java/com/gsc/bm/model/game/bot/PrudentPolicy.java), [ResourceAwarePolicy](../../../server/src/main/java/com/gsc/bm/model/game/bot/ResourceAwarePolicy.java) | Bonus minimo o fisso di ruolo DEFENSE, anche senza colpo; risorse/sblocco e ripetizione valutati separatamente. | Stima generica dagli effetti stampati del danno evitato, con ordine, stati, veleno, costo dello scarto e guadagni; non vietare la (b) senza minaccia se la risorsa serve. |
| [TurnForecast](../../../server/src/main/java/com/gsc/bm/model/game/bot/TurnForecast.java) / [LethalAwarePolicy](../../../server/src/main/java/com/gsc/bm/model/game/bot/LethalAwarePolicy.java) | LOSE e stati INPUT già simulati, periodico incluso; il filtro sceglie la sicurezza contro letali mostrati, non tutto il valore futuro. | Fedeltà su pulizia, parata, scadenza e nuove condizioni delle (c); scelta anche non letale. |
| [ViewTable](../../../server/src/main/java/com/gsc/bm/model/game/bot/ViewTable.java) | Simula perdite, stati, conversioni e scadenze; usato da DifficilePolicy, non dalla ricerca mazzi SB-19. | Estendere i predicati Java nuovi e verificare la fedeltà; nessuna equivalenza implicita fra simulazione corretta e buona policy. |

**Precisazione su D119:** il trattamento mirato di Fare il vago **non fu attuato**: D120 fermò B5, D121(4) lo rimandò a SB-21. Il test esistente copre la parata del letale mostrato, non una policy dedicata al nome. SB-19 usa tre euristici e `com`, tre timing di [SoughtHitPolicy](../../../server/src/main/java/com/gsc/bm/model/game/bot/SoughtHitPolicy.java), filtro letale; la ricerca usa i tre euristici. Nessun bot è cambiato in A. Le sonde non possono certificare il bilanciamento umano della difesa.

## Sonde e decisione

Riferimento SB-21g `bb182da9…f91be`, codice e bozza invariati. Budget usato circa 710 s su 1.500. Sonde brevi, 100 partite per cella, soli bot euristici, **una bound contro due bound nulle** (copie strumentali, ruolo NONE, bersaglio sé, priorità 0, come `Listino.nullBound`); le (c) Java non sono implementate in A e non sono misurate. Il verdetto vecchio del tetto D33/D36 (exit 1, solo PIN-BO1 a 4,35 contro 4) è sostituito da D159 e conservato come diagnostica. Con 100 partite l'errore è circa ±5 pp: i casi vicini a +10 vanno confermati in B su semi indipendenti.

| Personaggio | nulla | (a) | Δ(a) | (b) | Δ(b) | (a)+(b) |
|---|---:|---:|---:|---:|---:|---:|
| Spazienzio | 50,6 | 45,3 | −5,3 | 41,0 | −9,6 | 38,7 |
| Mara | 48,6 | 49,9 | +1,4 | 39,2 | −9,3 | 38,7 |
| Celestina | 46,2 | 56,0 | **+9,9** | 47,9 | +1,7 | 47,9 |
| Piera | 50,4 | 48,7 | −1,8 | 40,3 | −10,1 | 38,6 |
| Beppe | 52,5 | 57,5 | +5,0 | 53,3 | +0,8 | 52,5 |
| Sergio | 46,8 | 60,5 | **+13,7** | 43,2 | −3,6 | 45,1 |
| Duccio | 51,5 | 53,2 | +1,8 | 49,5 | −2,0 | 50,1 |

- **+10 pp**: solo **Sergio (a)** lo supera (+13,7). Riserva con +1 A invece di +2 (Battutina): +12,8, ancora fuori; la leva non è la risorsa ma i 2 HIT gratuiti con priorità 1. Da ridurre in B (1 HIT, o risorsa e danno più deboli insieme). Celestina (a) è sul limite (+9,9, entro l'errore).
- **(b)** non è mai sopra +10 e per quattro personaggi è **sotto la bound nulla** (da −2 a −10 pp): i bot attuali non sanno usare una parata generica (usano la risorsa, non il momento), quindi la misura sottostima la (b) di un giocatore umano. Non si conclude che sia debole: si corregge prima il bot (Fase B, punto 1).
- Le **diagnosi** dei bot restano valide solo come stima per i bot euristici; nessun giudizio sul bilanciamento umano.

### Effetto su patte e durata (matrice 7×7 starter, 100 partite per cella e stile)

| Gruppo | durata SB-21g | con proposta | senza ×0,75 (ruolo risorse) | patte SB-21g | patte proposta | coppie fuori 35–65: SB-21g / proposta / senza |
|---|---:|---:|---:|---:|---:|---:|
| euristici | 8,70 | **9,52** | 8,44 | 4,2 | 4,2 | 0 / 5 / 4 |
| com | 10,99 | 11,99 | 11,29 | 3,3 | 3,8 | 7 / 7 / 5 |
| misto | 9,27 | 10,20 | 9,17 | 2,4 | 2,9 | 1 / 4 / 1 |

**Rischio di allungamento confermato, con numeri**: con le tre (b) la durata media sale di circa 0,8 turni (+9%) fra euristici, di 1 turno con `com` (limite D95: 12 fuori specchio, 11,99 è al margine), e le coppie fuori dalla fascia 35–65 passano da 0 a 5. Togliendo il solo ×0,75 (la carta resta generatrice, risorse e danni invariati) la durata scende a 8,44, **sotto** SB-21g: l'allungamento è dovuto alla parata, non alle risorse. Le patte restano nei limiti (≤10%) perché sono ridotte dalle (a). I valori sono una misura breve e rumorosa (±2 pp per coppia), da rifare in B.

**Alternative se la misura in B conferma l'allungamento** (da scegliere dal proprietario): (1) ×0,75 solo sul **prossimo colpo ricevuto** invece che su tutto il turno; (2) ×0,75 solo su HIT e CUT, senza POISON; (3) risorsa della (b) più piccola (−1) a parità di parata; (4) (b) con priorità 3 invece di 2, così la parata arriva dopo più effetti. Il formato dati già permette (2) e (3); (1) richiede un `turns` o un consumo al primo colpo non ancora esistente.

## Copertura dei punti del compito

(1) tre bound per personaggio e testi: tabella iniziale; (2) supporto di motore e dati: «Motore e dati»; (3) bot: «Bot: supporto e lacune»; (4) sonde contro bound nulle col criterio +10 e effetto su patte e durata: questa sezione; (5) piano e budget della Fase B: sotto; (6) domande al proprietario: in fondo. Criterio D158: nessun numero difficile da calcolare nei testi (quarto e ×0,75 sono i soli fattori), ma si segnala che il residuo di «un quarto» arrotonda per eccesso (vedi domanda 2).

## Fase B proposta

Prima norme del playground/griglia e versione/motivazione, poi dati, testi e attesi: nessuna norma del vivo cambia senza il percorso AGENTS. Sostituire il **verdetto** del vecchio BoundCap col confronto D159; conservarne le quantità come diagnostica. Mai aggiornare attesi per nascondere regressioni.

Budget proposto **9.000 s di banco**, esclusivi, oltre alle verifiche obbligatorie: 600 s riferimento/identità e fattibilità; 2.000 s per-bound e al massimo due passate numeriche; 1.200 s matrice starter e riserve; 4.200 s ricerca dei sette; 1.000 s finalisti e isolamenti. Tempi basati sui 5.239,78 s di SB-21g, con margine per 21 isolamenti. Arresto al tetto, niente ricerca parziale presentata come completa.

1. Modifiche ai bot solo playground, prima dei dati: identità viva, passo 0 sulle bozze precedenti e fedeltà `TurnForecastFidelityTest`/`ViewTableFidelityTest`, suite e contesto/manifest secondo [aree protette](../../aree-protette.md). Attivare lo scoring nuovo sulle forme nuove di bound (difesa più guadagno, pulizia parziale), riconosciute dagli effetti: nessuna whitelist di nomi. La bozza precedente e il vivo devono mantenere l'identità richiesta; se non riesce, STOP e decisione, non nuovi attesi.
2. Ogni bound con una nulla contro due nulle, posti alternati, semi comuni; poi entrambe le coppie con (c) e mazzi costruiti adatti. +10 pp massimo **per bound**, non compensabile con una media fra le 21. `com` separato secondo D93; errori statistici e casi vicini alla soglia richiedono conferma su semi indipendenti.
3. Matrice completa sette starter/riferimenti, stessi semi/stili di SB-21g, 403.200 partite; D149(4) contro la sua consegna: tutte le coppie 35–65%, ridurre le **2** fuori obiettivo (obiettivo 0–1, lettura letterale del «meno» di D149), patte/durate aggregate e per coppia non peggiori; D95 (patte ≤10%, durata ≤12 fuori specchio). Per le fasce obiettivo mantenere le definizioni esistenti. Non ritarare le soglie per accettare una difesa che allunga.
4. Ricerca costruiti da capo per tutti e sette, stessa impostazione SB-21g, non soli vecchi finalisti. Incroci costruiti–costruiti e contro starter; D131 (0/+10 medio, massimo +15 per incontro rispetto allo starter) distinto da D159. Rimisurare il dominio 6/6 di Piera, il divario di Spazienzio/Mara e Giro secco/Estasi; dichiarare gli scostamenti preesistenti D157, non chiamarli risolti senza prova.

## Domande al proprietario

1. Approvi i sette tris come direzione, compresa la variante di Mara che sottrae A ripetutamente e le due varianti condizionali Java, da bocciare/ridurre se superano +10?
2. Per la pulizia approvi «perdi un quarto per difetto» (residuo per eccesso), così resta tutta a dati, invece del residuo ×0,75 troncato?
3. Approvi la Fase B con correzione generica dei bot e budget di 9.000 s, prima della nuova prova umana?
