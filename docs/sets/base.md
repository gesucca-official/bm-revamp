# Botte Micidiali — Set Base

Versione **0.1 — 8 novembre 2026**. Documento del set `base`, con le schede normative delle sue carte (regolamento, R00 e R07).

Questa versione provvisoria raccoglie le carte della partita viva di oggi, trasferite dalle sezioni R07 e R07a del regolamento 1.12 senza cambiare alcun effetto (vedi Revisioni). Le carte del Set Base in progettazione entrano solo a bilanciamento concluso, quando questo documento passerà alla 1.0. Il regolamento governa il sistema, le schede governano le carte: una scheda deroga a una regola solo se lo dice esplicitamente. Ruoli, guadagni e danno nominale sono descrittivi (R07a). L'allegato `rules-catalog.json` contiene nomi visualizzati e composizioni degli starter.

## S1 — Contenuto e starter

Il set comprende **39 carte: 2 personaggio, 33 azione e 4 oggetto**, oltre a un token oggetto generato durante il gioco, BrokenBeerBottle. Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte alla preparazione secondo R01a. Nessuna carta di questo set ha una rarità (R07).

Ogni personaggio ha uno starter conforme a R02, con 20 carte regolari. Spazienzio (BigBadBruiser) ha la basic BruiserGrab e le bound LittleSmack e LittleRage; il Tossico (ToxicJunkie) ha la basic ToxicGrab e le bound RottenSmile e PatheticBlade. Struggle è l'unica last resort, generica, e compare in entrambi. Le composizioni esatte sono nell'allegato. Quick assegna casualmente uno dei due personaggi con il suo starter (R01).

Le quattro bound richiedono lo scarto R02. SoberUp è una classe incompleta fuori dal catalogo (bersaglio non definito), non una carta giocabile o un terzo personaggio.

## S2 — Carte personaggio

| Carta | Tipologia | Nome visualizzato | HEALTH | ALERTNESS | Risorsa speciale | Capacità oggetti | Immunità iniziale |
|---|---|---|---:|---:|---|---:|---|
| BigBadBruiser | Personaggio | Spazienzio de la Ucciso | 100 | 20 | VIOLENCE 25 | 1 | Nessuna |
| ToxicJunkie | Personaggio | Tossico del Serraglio | 100 | 35 | TOXICITY 10 | 3 | Effetto periodico di TOXICITY |

Le risorse che la scheda non indica partono da 0 (R01, 1.11): Spazienzio ha anche TOXICITY 0 e ALCOHOL 0, il Tossico VIOLENCE 0 e ALCOHOL 0. Per esempio, Spazienzio che gioca BadTrip senza aver mai ricevuto TOXICITY aggiunge abs(0) = 0 alla propria T; con LethalHeroinDose non perde HEALTH (t = 0) e aggiunge abs(0 − 30) = 30 a T; con PervertedMetabolism guadagna e perde 0.

## S3 — Carte azione

| Carta | Tipologia | Sottotipo | Costo | Priorità | Bersaglio | Effetto in ordine |
|---|---|---|---|---:|---|---|
| LittleSmack | Azione | Legata al personaggio | — | 1 | Avversario | +5 A a sé; 5 HIT al bersaglio |
| LittleRage | Azione | Legata al personaggio | — | 2 | Sé | HIT ricevuto ×0,75, durata 0; +5 V |
| PatheticBlade | Azione | Legata al personaggio | — | 1 | Avversario | +5 T a sé; 5 CUT e +5 T al bersaglio |
| RottenSmile | Azione | Legata al personaggio | — | 2 | Avversario | +5 A a sé; −5 A al bersaglio |
| BruiserGrab | Azione | Base | — | −1 | Oggetto vicino | Basic: consuma come Grab |
| ToxicGrab | Azione | Base | — | 1 | Oggetto vicino | Basic: perde abs(A/2), poi consuma come Grab; perde A anche se l'oggetto è scomparso |
| Struggle | Azione | Ultima risorsa | — | 1 | Avversario | Last resort: 5 HIT a sé; 10 HIT al bersaglio |
| Grab | Azione | Regolare | — | 1 | Oggetto vicino | Rimuove l'oggetto, applica solo effetti self/target, non logica speciale |
| Steal | Azione | Regolare | 10 A | 0 | Oggetto lontano | Trasferisce l'oggetto vicino a sé senza consumarlo |
| ShuffleFeet | Azione | Regolare | — | −1 | Avversario | Scambia tutti gli oggetti rispettando le capacità dei destinatari |
| BadEducation | Azione | Regolare | 10 V | 1 | Avversario | Rimuove equip del bersaglio; 10 HIT |
| BreakYourToy | Azione | Regolare | 10 V | 1 | Oggetto lontano | Distrugge l'oggetto |
| CantFeelAnything | Azione | Regolare | 20 V | 2 | Sé | HIT ricevuto ×0,35, durata 0; +10 A |
| ExtremelyViolentBlow | Azione | Regolare | 20 V | 1 | Avversario | HIT pari a 20 + V residua/2 |
| Glare | Azione | Regolare | — | 0 | Sé | HIT ricevuto ×1,5, durata 1; +15 V e +15 A |
| HealingBlow | Azione | Regolare | 20 V | 1 | Avversario | 30 HIT; azzera T e L del bersaglio |
| MadeOfStone | Azione | Regolare | — | 0 | Sé | CUT ricevuto ×0,5, durata 3, stato indipendente R05; +10 V |
| SeagullFly | Azione | Regolare | 10 V | 1 | Avversario | 15 HIT: solo GOOD dell'autore, tutti gli stati del bersaglio |
| SickeningBlow | Azione | Regolare | 15 V | 1 | Avversario | 10 HIT; +10 T al bersaglio |
| StunningBlow | Azione | Regolare | 15 V | 1 | Avversario | −10 A; 10 HIT al bersaglio |
| SuperImpact | Azione | Regolare | 25 V | 0 | Avversario | 40 HIT |
| YouStop | Azione | Regolare | 5 V | 2 | Avversario | Annulla mossa del bersaglio solo se successiva; se trovata +10 A al bersaglio |
| WhatchaDoin | Azione | Regolare | 10 V + 10 A | 2 | Avversario | Annulla mossa successiva e ne esegue solo l'effetto target usando sé come autore; non replica self, costi, logica speciale |
| AmphetamineReflexes | Azione | Regolare | 10 T | 2 | Sé | Annulla mosse successive di avversari vivi con target pari al proprio ID; nessun +A |
| BadTrip | Azione | Regolare | 10 A | 2 | Sé | Toglie immunità T; timer 3 la aggiunge a sé; aggiunge abs(T) alla propria T |
| BeggingMoney | Azione | Regolare | 25 T | 0 | Avversario | Aggiunge un oggetto casuale del bersaglio vicino a sé senza rimuoverlo da lui; −10 A al bersaglio. Nessun recupero da alcol |
| Cough | Azione | Regolare | 10 T | 1 | Avversario | +5 T; −5 A al bersaglio |
| EverythingIsDrug | Azione | Regolare | — | 1 | Oggetto vicino | Consuma senza effetti dell'oggetto; +20 T a sé |
| GoingBerserk | Azione | Regolare | 10 L | 1 | Avversario | 30 HIT; nessun costo T |
| LethalHeroinDose | Azione | Regolare | — | 1 | Sé | Se t>=30 perde t HEALTH; aggiunge abs(t−30) a T. Esempio: 40→50, perdendo 40 HEALTH |
| MethDrivenRage | Azione | Regolare | 5 T | 1 | Avversario | 5 HIT a sé; 15 HIT al bersaglio |
| PervertedMetabolism | Azione | Regolare | — | 1 | Sé | Guadagna abs(T/2) HEALTH; perde abs(T) TOXICITY |
| ToxicBloodDrain | Azione | Regolare | 10 T | 1 | Avversario | Memorizza T residua, la perde e la aggiunge al bersaglio; rimuove immunità T al bersaglio; timer 1 aggiunge immunità T all'autore |

## S4 — Carte oggetto e token

Gli oggetti si attivano tramite Grab/derivate, non alla pesca. Nessun costo proprio; conta la priorità dell'azione che li consuma.

| Carta / token | Tipologia | Sottotipo | Effetto del consumo |
|---|---|---|---|
| CocktailOnTheGround | Oggetto | — | +20 V, +15 L, +5 T |
| RottenBeer | Oggetto | — | +5 L. Non equipaggia: Grab non chiama il suo hook speciale, anche se il vecchio report afferma il contrario |
| AnotherRottenBeer | Oggetto | — | Crea BrokenBeerBottle vicino a sé; +10 L |
| MarvelousCocktail | Oggetto | — | Immunità T e L; +20 L e +20 T; timer 5 cancella tutte le immunità e gli stati, poi 20 POISON |
| BrokenBeerBottle | Oggetto | Token | Equip GOOD OUTPUT: HIT ×1,5 convertito in CUT; singleUse e stato indipendente secondo R05 |

## S5 — Ruoli, guadagni e danno nominale

Campi descrittivi definiti in R07a; in caso di dubbio prevale la scheda.

### Ruoli e guadagni

| Carta | Ruolo | Guadagni a sé |
|---|---|---|
| BigBadBruiser | — | — |
| ToxicJunkie | — | — |
| LittleSmack | DAMAGE | +5 A |
| LittleRage | DEFENSE | +5 V |
| PatheticBlade | DAMAGE | +5 T |
| RottenSmile | DISRUPT | +5 A |
| BruiserGrab | ITEMS | — |
| ToxicGrab | ITEMS | — |
| Struggle | DAMAGE | — |
| Grab | ITEMS | — |
| Steal | ITEMS | — |
| ShuffleFeet | ITEMS | — |
| BadEducation | OTHER | — |
| BreakYourToy | ITEMS | — |
| CantFeelAnything | DEFENSE | +10 A |
| ExtremelyViolentBlow | DAMAGE | — |
| Glare | OTHER | +15 V, +15 A |
| HealingBlow | DAMAGE | — |
| MadeOfStone | DEFENSE | +10 V |
| SeagullFly | DAMAGE | — |
| SickeningBlow | DAMAGE | — |
| StunningBlow | DAMAGE | — |
| SuperImpact | DAMAGE | — |
| YouStop | COUNTER | — |
| WhatchaDoin | COUNTER | — |
| AmphetamineReflexes | COUNTER | — |
| BadTrip | RESOURCES | +x T |
| BeggingMoney | ITEMS | — |
| Cough | DISRUPT | — |
| EverythingIsDrug | OTHER | +20 T |
| GoingBerserk | DAMAGE | — |
| LethalHeroinDose | RESOURCES | +x T |
| MethDrivenRage | DAMAGE | — |
| PervertedMetabolism | RESOURCES | +x H |
| ToxicBloodDrain | DISRUPT | — |
| CocktailOnTheGround | RESOURCES | +20 V, +15 L, +5 T |
| RottenBeer | RESOURCES | +5 L |
| AnotherRottenBeer | RESOURCES | +10 L |
| MarvelousCocktail | RESOURCES | +20 L, +20 T |
| BrokenBeerBottle | OTHER | — |

### Danno nominale

Esclusi secondo R07a: MarvelousCocktail ha — anche se il suo timer infligge 20 POISON; LethalHeroinDose ha —, perché perde HEALTH senza un danno R05; LittleRage, CantFeelAnything, Glare e MadeOfStone hanno —; BrokenBeerBottle ha —, perché converte i colpi di chi lo porta ma di suo non infligge danno; WhatchaDoin ha —, perché esegue l'effetto di un'altra carta. ExtremelyViolentBlow è `HIT 20+x`, dove x è metà della V residua di chi gioca. Struggle e MethDrivenRage infliggono 5 HIT a sé e mostrano solo l'importo al bersaglio (10 e 15).

| Carta | Danno nominale | Importo nominale |
|---|---|---|
| BigBadBruiser | — | — |
| ToxicJunkie | — | — |
| LittleSmack | HIT | HIT 5 |
| LittleRage | — | — |
| PatheticBlade | CUT | CUT 5 |
| RottenSmile | — | — |
| BruiserGrab | — | — |
| ToxicGrab | — | — |
| Struggle | HIT | HIT 10 |
| Grab | — | — |
| Steal | — | — |
| ShuffleFeet | — | — |
| BadEducation | HIT | HIT 10 |
| BreakYourToy | — | — |
| CantFeelAnything | — | — |
| ExtremelyViolentBlow | HIT | HIT 20+x |
| Glare | — | — |
| HealingBlow | HIT | HIT 30 |
| MadeOfStone | — | — |
| SeagullFly | HIT | HIT 15 |
| SickeningBlow | HIT | HIT 10 |
| StunningBlow | HIT | HIT 10 |
| SuperImpact | HIT | HIT 40 |
| YouStop | — | — |
| WhatchaDoin | — | — |
| AmphetamineReflexes | — | — |
| BadTrip | — | — |
| BeggingMoney | — | — |
| Cough | — | — |
| EverythingIsDrug | — | — |
| GoingBerserk | HIT | HIT 30 |
| LethalHeroinDose | — | — |
| MethDrivenRage | HIT | HIT 15 |
| PervertedMetabolism | — | — |
| ToxicBloodDrain | — | — |
| CocktailOnTheGround | — | — |
| RottenBeer | — | — |
| AnotherRottenBeer | — | — |
| MarvelousCocktail | — | — |
| BrokenBeerBottle | — | — |

## Revisioni

- **0.1 — 8 novembre 2026, SB-2:** prima versione del documento del set. Schede, ruoli, guadagni, danno nominale e importo delle 39 carte e del token sono trasferiti senza modifiche da R07 e R07a del regolamento 1.12, che con la 1.13 contiene solo le regole generali (decisioni del proprietario D11 e D42 del piano Set Base). Gli esempi di R01 e R07a che citavano carte sono qui, in S2 e S5; personaggi, starter e token, prima in R01a e R02, in S1. L'unica scheda che cambia testo è MadeOfStone, che riporta la durata 3 prima scritta in R05. Motivazione: un ritocco a una carta cambia la versione del set, non quella del regolamento. Nessun effetto, costo, priorità, bersaglio, starter o bilanciamento cambia.
