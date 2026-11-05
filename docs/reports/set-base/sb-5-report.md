# SB-5 — Prova del formato dati: rapporto

**Chiuso il 5 novembre 2026.** 20 carte su 37 si possono scrivere come dati e si comportano esattamente come le classi Java:
18 azioni su 33 e 2 oggetti su 4. Le altre 17 restano in Java. La prova sta nei sorgenti di test: partita, regole e catalogo non cambiano.

**Il rischio ancora aperto:** le 17 carte in Java hanno i numeri scritti nel codice. Rendere modificabili anche quelli è da fare in SB-6, e non è provato qui.

## Decisione sul formato

**Soluzione ibrida, come previsto dal piano: JSON per le carte semplici, Java per le altre.**

Una carta è un elenco di campi (`binding`, `kind`, `boundTo`, `lastResort`, `priority`, `targets`, `cost`) più due liste di passi, `self` e `target`,
eseguiti nell'ordine scritto. Il soggetto è l'autore nella prima lista, il bersaglio nella seconda. I passi sono sei:

| Passo | Cosa fa |
|---|---|
| `damage` | Danno di un tipo, eventualmente modificato solo da stati di un certo tipo |
| `gain`, `lose` | Guadagna o perde una risorsa |
| `empty` | Azzera una risorsa |
| `status` | Aggiunge uno stato che moltiplica un tipo di danno, per un certo numero di turni |
| `say` | Una riga fissa nel rapporto |

Una quantità è un numero oppure `base + risorsa dell'autore / divide`, letta quando il passo si applica. Esempio completo:

```json
{
  "binding": "bruiser.ExtremelyViolentBlow",
  "kind": "ACTION",
  "targets": ["OPPONENT"],
  "cost": {"VIOLENCE": 20},
  "target": [{"op": "damage", "type": "HIT", "amount": {"base": 20, "of": "VIOLENCE", "divide": 2}}]
}
```

**Perché così poco.** Il rischio indicato dal piano è un linguaggio troppo ricco, e sei passi bastano già per più della metà delle carte.

**Regola per crescere:** un passo nuovo si aggiunge solo quando una carta progettata in SB-10 lo richiede e altre carte lo riusano; altrimenti la carta resta in Java.
Il primo candidato è l'equip da oggetti, previsto fra le meccaniche del Set Base («Guanti da officina») e oggi non esprimibile: servono `equip`, uso singolo e conversione del danno.

## Il conteggio

| | A dati | In Java | Totale |
|---|---:|---:|---:|
| Azioni | 18 | 15 | 33 |
| Oggetti | 2 | 2 | 4 |
| **Totale** | **20** | **17** | **37** |

**A dati:** `SuperImpact`, `ExtremelyViolentBlow`, `SeagullFly`, `CantFeelAnything`, `Glare`, `MadeOfStone`, `HealingBlow`, `SickeningBlow`, `StunningBlow`, `LittleRage`, `LittleSmack`, `Struggle`,
`Cough`, `GoingBerserk`, `MethDrivenRage`, `PervertedMetabolism`, `PatheticBlade`, `RottenSmile`, `CocktailOnTheGround`, `RottenBeer`.

**In Java, per motivo** (motivo per carta e numeri in [java-cards.tsv](../../../server/src/test/resources/sb-5/java-cards.tsv)):

| Motivo | Carte | Quante |
|---|---|---:|
| Toccano gli oggetti sul campo | `Grab`, `BruiserGrab`, `ToxicGrab`, `EverythingIsDrug`, `Steal`, `BreakYourToy`, `BeggingMoney`, `ShuffleFeet`, `AnotherRottenBeer` | 9 |
| Annullano mosse altrui | `WhatchaDoin`, `YouStop`, `AmphetamineReflexes` | 3 |
| Timer e immunità | `MarvelousCocktail`, `BadTrip`, `ToxicBloodDrain` | 3 |
| Condizioni sullo stato | `LethalHeroinDose`, `BadEducation` | 2 |

## Come è stato provato

Il piano chiede che una carta convertita si comporti come l'originale nei test d'effetto esistenti. Il confronto diretto con la classe Java è più forte: quelle classi sono già
coperte da `CatalogEffectsTest`, e qui la carta a dati deve coincidere con loro su tutto. `DataCardsTest` controlla:

1. **Carta per carta:** stessi campi, stesse righe di rapporto e stesso stato finale della carta Java su 200 stati casuali, con stati attivi, immunità e risorse mancanti.
2. **Il confronto sa fallire:** ogni numero, testo ed enumerato di ogni carta viene alterato, ogni passo tolto e scambiato col successivo; ogni alterazione deve essere notata. Sono esclusi solo gli scambi fra un passo `status` e un passo che non fa danno, perché non cambiano nulla.
3. **Partite intere:** 400 partite a ogni esecuzione, con traccia identica evento per evento e ogni carta a dati giocata almeno una volta.
4. **Copia a metà partita:** il seguito non cambia, quindi carte e stati si serializzano.
5. **Definizioni errate:** campi o passi sconosciuti, oggetti con priorità o costo, carte ripetute vengono rifiutati.
6. **Classificazione:** ogni carta del catalogo è a dati oppure in Java con un motivo, mai entrambe.

Prova una tantum su semi nuovi: **16.000 partite** (1.000 per ciascuno dei 16 abbinamenti di stili e personaggi, semi da 5000000), tutte identiche.
Si ripete con `-Dtest=DataCardsTest#gamesAreIdenticalWithDataCards -Dsim.dataGames=1000 -Dsim.firstSeed=5000000`.

## Verifiche

- `./scripts/build.ps1 -Task TestServer -Offline`: **BUILD SUCCESS, 339 test, 0 falliti, 3 saltati** (le misure a richiesta).
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **BUILD SUCCESS, 446 test, 0 falliti, 3 saltati**.
- `python scripts/check-rules.py`: regolamento e copia client allineati.

## Chi ha fatto cosa

La base (formato, esecuzione, test, prime sette carte) è di Claude. GPT ha convertito altre 13 carte e classificato le 17 in Java, senza toccare né formato né test, e al primo tentativo tutti i confronti sono passati.
La revisione ha ricontrollato sul codice ogni numero di `java-cards.tsv` e ogni motivo; la classificazione coincide con una fatta separatamente prima di vedere la sua. GPT ha anche gestito bene `GoingBerserk`, che chiama `setCost` due volte: conta solo l'ultimo, cioè 10 L.

## Osservazioni sulle carte attuali

- **`RottenBeer` ha codice mai eseguito.** Gli oggetti pescati finiscono sul campo, mai in mano (`Player.drawCard`), e `Grab` chiama solo gli effetti: la parte che equipaggia la bottiglia rotta non parte mai. È coerente col regolamento («Non equipaggia»). Vale anche per `AnotherRottenBeer`, che eredita quel codice. Per questo il formato non ha un concetto apposito.
- **Il testo di `LittleRage` è incoerente:** lo stato si chiama «ONLY A LITTLE DISCOMFORT», la riga di rapporto dice «ONLY DISCOMFORT». Copiato com'è; è materia per SB-25.

## Cosa non è provato

- **Numeri delle 17 carte in Java.** Costo e priorità sono campi, e impostarli da fuori è semplice; i numeri degli effetti stanno nel codice, e renderli parametri significa toccare quelle classi. SB-6 deve risolverlo per mantenere la promessa «cambiare un numero non richiede ricompilazione».
- **Partita viva.** `CardFactoryServiceImpl` cerca il catalogo col nome della classe: le carte a dati richiederanno un cambiamento lì, e anche in `DeckFactoryServiceImpl` e in tutto ciò che crea carte da un nome di classe. Riguarda SB-26–SB-28.
- **Messaggi d'errore.** Una definizione errata viene rifiutata, ma un campo obbligatorio di un passo che manca si scopre solo eseguendo la carta. I messaggi chiari sono un requisito di SB-6.
- **Carte non ancora progettate.** Il formato copre le carte attuali; quanto copra del Set Base si vedrà in SB-10.
