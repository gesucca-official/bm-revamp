# SB-11b — Bozza degli starter base: rapporto

**Fatto il 6 novembre 2026, in attesa del giudizio del proprietario.** La bozza del Set Base esiste, in un file unico che i blocchi
successivi estenderanno, con i due starter base della [griglia](../../design/set-base/griglia.md): Spazienzio «Pazienza finita» e Mara
«Consegna sul muso». Passa gli invarianti di SB-7 in modo stretto e copre tutte le meccaniche di base, ma **il matchup fra i due starter è
0,937 per Spazienzio**, lontano dal 45–55% di SB-12. Come chiede il blocco, la bozza non è bilanciata qui: le correzioni sono proposte e
misurate su varianti, non applicate.

Il blocco è la seconda metà di SB-11 ([D37](../../set-base-plan.md#decisioni-del-proprietario)); i passi del formato sono di
[SB-11a](sb-11a-report.md). Il codice cambia solo in `server/src/test`. Non sono toccati:
- regolamento, catalogo SQLite, allegato e client;
- protocollo, classi di produzione e bot;
- i file del filone C4.

Nulla della bozza raggiunge la partita viva (SB-28).

## Bozza e convenzioni

**Dove sta:** [`server/src/test/resources/set-base/bozza.json`](../../../server/src/test/resources/set-base/bozza.json), formato `sb-6a/1`,
SHA-256 `745401672b1c3dcd20d871d7b17e45687017cd9e827674ec56c298a4fe02ee94`. Un solo file che cresce blocco dopo blocco: SB-13–SB-19
aggiungeranno personaggi, carte e starter.

**Identificatori.** Il binding è stabile e separato dal nome visualizzato (`gui.name`).

| Carta | Binding | Esempi |
|---|---|---|
| Attuale, conservata o riprogettata | quello della classe di oggi, anche se ora è a dati | `bruiser.SuperImpact`, `bruiser.character.LittleSmack`, `com.last.Struggle` |
| Java parametrica | per forza quello della classe: il caricatore di SB-6a lega binding e classe | `bruiser.YouStop`, `com.Steal` |
| Nuova | prefisso del set `base.` | `base.character.Mara`, `base.mara.Sgommata`, `base.mara.bound.PassoStretto`, `base.spazienzio.bound.TestaAlMuro`, `base.com.Spintone`, `base.items.GiubbottoDiFintaPelle` |

Un'espansione userà un suo prefisso. Lo slot della griglia apre `gui.description` (per esempio «SPA-AR1 · 25 V: 40 HIT al
bersaglio.»), perché il formato non ha un campo per lo slot. Il nome dello starter non ha un campo nel formato: gli id dei mazzi restano
`starter-spazienzio` e `starter-mara`, i nomi propri stanno nei documenti.

**Contenuto**, esattamente come nella griglia:

| Blocco | Carte |
|---|---|
| Personaggi | Spazienzio (H 100, A 20, V 25, capacità 1) e Mara (H 85, A 40, capacità 2), con tutte e cinque le risorse scritte come chiede R01 1.11: le altre a 0 |
| Basic | SPA-BA `BruiserGrab` (consuma, priorità −1) e MAR-BA «Preso al volo» (−5 A a sé, poi consuma, priorità 2) |
| Bound | SPA-BO1 +5 V, SPA-BO2 3 HIT, SPA-BO3 «TESTA AL MURO» (3 HIT a sé, +8 V); MAR-BO1 3 CUT, MAR-BO2 +8 A, MAR-BO3 2 CUT a priorità 2. Le terze sono nella collezione, in nessuno starter |
| Last resort | Struggle |
| Archetipo | SPA-AR1–AR5 (SuperImpact, ExtremelyViolentBlow 10 V e 6 + V/2, Glare, MadeOfStone, YouStop senza A all'avversario: `alertnessToTarget: 0`, il parametro di SB-6a); MAR-AR1–AR5 (Cinghiata, Sgommata, Sorpasso, Paraurti, Slalom) |
| Generiche | GEN-02 Steal, GEN-05 SeagullFly 18 HIT, GEN-06 Mattone, GEN-07 HealingBlow, GEN-13 Tartaruga, GEN-14 Denti stretti, GEN-17 Sputo, GEN-18 Spintone |
| Oggetti | OGG-01 Cocktail (+12 V, +10 L, +3 T), OGG-06 Espresso, OGG-07 Kebab, OGG-10 Giubbotto (equip), OGG-13 Posacenere (equip, uso singolo) |
| Starter | Spazienzio: archetipo 10, generiche 7, oggetti 3, 12 distinte. Mara: archetipo 9, generiche 6, oggetti 5, 12 distinte |

**Scostamenti dalla griglia: nessuno nella composizione né nei numeri.** Note di scrittura:
- YouStop scrive ancora la riga «+0 A» al bersaglio, perché la classe la produce sempre: solo estetica.
- Tartaruga e Paraurti sono due stati, uno per HIT e uno per CUT.
- Il ruolo di Glare segue la griglia (RESOURCES); il catalogo di oggi dice OTHER.
- `BruiserGrab` e Struggle sono a dati: SB-11a ha provato che coincidono con le classi.

**Nomi, decisione del proprietario.** Lo starter di Spazienzio si chiama «Pazienza finita», e i nomi delle sue carte restano tutti in
maiuscolo, «perché lui ha perso la pazienza e urla». Il maiuscolo vale per il nome visualizzato (`gui.name`), non per binding e codice.
Riguarda le nove carte legate a lui (slot `SPA-*`: basic, tre bound, cinque d'archetipo); le generiche del suo starter restano come sono,
perché le usano anche gli altri. L'unica da cambiare era «Testa al muro», ora «TESTA AL MURO». Un test lo controlla.

## Durate

**Lettura:** «per N turni» conta anche il turno in corso, quindi `turns: N − 1` (R05: d = 0 copre il turno corrente, d = 1 anche il
successivo). «In questo turno» è `turns: 0`. Applicata a tutta la bozza, e un test controlla ogni stato contro la sua descrizione:

| Carta | Testo | `turns` |
|---|---|---:|
| Glare | HIT ricevuto ×1,5 per 2 turni | 1 |
| MadeOfStone | CUT ricevuto ×0,5 per 4 turni | 3 |
| Giubbotto | CUT ricevuto ×0,75 per 3 turni | 2 |
| Tra due paraurti, Tartaruga | in questo turno | 0 |
| Posacenere | uso singolo, senza durata | — |

Così Giubbotto e MadeOfStone sono coerenti. **Per SB-25:** l'incoerenza di oggi sta nei testi, non nei numeri.
- La descrizione SQLite usa la «durata d» del motore per Glare («durata 1»), CantFeelAnything e LittleRage («durata 0»).
- Per MadeOfStone la descrizione omette la durata («stato indipendente R05»), e il 3 compare solo in R05.
- Il rapporto di SB-11a ha scritto «3 turni» per MadeOfStone, che ne dura 4.

I testi per i giocatori devono dire i turni contati così, compreso quello corrente.

## Misure

Tetto di calcolo fissato prima di partire: **75 minuti**. Usati circa 22, comprese le riprove sulla bozza definitiva. Tutto con Java 11 su
8 thread. Una prima corsa del listino (387 secondi) è caduta alla fine per un nome di sorgente che cominciava con «classpath:»:
l'ho corretta e rilanciata. Evidenze in [`sb-11b/`](sb-11b/).

### Invarianti

`BenchMeasureTest#matrix`, `-Dsim.strict=true`. **Zero violazioni** su 96.000 partite, cioè 2.804.374 turni di giocatore controllati.
- Mai senza mosse legali e mai una mossa vuota.
- Bound gratuite e sempre giocabili; last resort in mano e giocabile; mai il limite dei 200 turni.
- Tetto delle bound coi predefiniti D33/D36: tutte e sei le bound lo rispettano.

| Bound | Unità per uso |
|---|---:|
| SPA-BO1 +5 V | 3,75 |
| SPA-BO2 3 HIT | 4 |
| SPA-BO3 3 HIT a sé, +8 V | 3 |
| MAR-BO1 3 CUT | 4 |
| MAR-BO2 +8 A | 4 |
| MAR-BO3 2 CUT | 2,67 |

### Matrice

Bozza SHA-256 `74540167…fe02ee94`; 2000 partite per cella; stili aggressivo, prudente, risorse e il bot attuale (`com`), 16 coppie;
semi 7.000.000–7.001.999, posti alternati. [Testo](sb-11b/sb7-bozza-2000.md), [dati](sb-11b/sb7-bozza-2000.json),
[tempi](sb-11b/sb7-bozza-2000.tempi.txt): 44 secondi.

| A contro B | Quota di A [IC 95%] | Turni medi (10°–90°) | Patte |
|---|---|---|---:|
| Spazienzio contro Spazienzio | 0,498 [0,492–0,503] | 13,5 (9–18) | 13,8% |
| **Spazienzio contro Mara** | **0,937 [0,935–0,940]** | 13,8 (9–18) | 6,2% |
| Mara contro Mara | 0,502 [0,496–0,508] | 16,5 (14–19) | 18,9% |

- **Per coppia di stili** Spazienzio vince contro Mara fra 0,735 (`com` contro l'aggressivo) e 1,000.
- **Mazzo esaurito:** Spazienzio 27,9%, Mara 58,3%.
- **Last resort in mano:** Spazienzio nel 20,1% delle partite, Mara nel 44,9%; arriva in media al turno 17,4 e 16,7.
- **Risorse a fine partita:** Mara finisce senza A (−2,9 chi vince, 4,9 chi perde). A Spazienzio resta V (6 e 17) e quasi tutta la A, che spende solo per la Tartaruga.
- **Durata:** 13,5–16,5 turni, sopra l'obiettivo di 6–12.

**Carte**, su tutti gli stili (giocate per partita, partite in cui è giocata, quota del mazzo se giocata):

| | Carte |
|---|---|
| Quasi sempre giocate | SPA-BO2 3 HIT (4,64 a partita, 96,8%), MAR-BO1 3 CUT (3,35, 94,4%), Spintone (1,65, 93,0%), Sorpasso (1,63, 92,9%), le due basic (97–98%) |
| Quasi mai | Steal (0,07 a partita, 7,4%; quota se giocata 0,075) |
| Giocate in partite perse | Tra due paraurti (31%, quota 0,134) e la Tartaruga di Mara (25%, 0,163): i bot le giocano quando sono già sotto |
| Ferme in mano oltre 1,5 turni (criterio della griglia) | Glare 2,56, MadeOfStone 2,42, YouStop 2,62, Tartaruga 2,66 e Denti stretti 2,10 per Spazienzio; Sorpasso 2,78, Paraurti 2,70 e Spintone 1,87 per Mara |
| Morte più a lungo | SuperImpact 5,7 turni, Sgommata 5,8, `BruiserGrab` 6,3 (capacità 1, tre oggetti nel mazzo), Preso al volo 4,9 |

### D36 sugli starter veri, e la decisione B2

Gruppo nuovo `tettostarter` del listino: negli specchi, ogni bound del personaggio (o una sonda) più una nulla contro due nulle.
2000 partite per stile e cella, tre stili euristici, semi da 8.200.000. Criterio di D33: quota della sonda al massimo 0,60.
[Testo](sb-11b/sb11b-listino-costo+tipo+salute+tettostarter.md).

| Bound | Starter | Quota [IC 95%] | Giocate a partita | Esito |
|---|---|---|---:|---|
| SPA-BO1 +5 V | Spazienzio | 0,597 [0,583–0,610] | 1,37 | ✓ |
| SPA-BO2 3 HIT | Spazienzio | 0,281 [0,269–0,294] | 5,03 | ✓ |
| SPA-BO3 «TESTA AL MURO» | Spazienzio | 0,566 [0,552–0,580] | 1,39 | ✓ |
| sonda 2 HIT | Spazienzio | 0,348 [0,336–0,362] | 3,83 | ✓ |
| MAR-BO1 3 CUT | Mara | 0,873 [0,863–0,882] | 5,74 | ✗ |
| **MAR-BO2 +8 A (B2)** | Mara | **0,862 [0,852–0,872]** | 3,63 | ✗ |
| MAR-BO3 2 CUT | Mara | 0,772 [0,760–0,784] | 5,80 | ✗ |
| sonda 3 HIT | Mara | 0,885 [0,875–0,893] | 5,72 | ✗ |
| sonda 2 HIT | Mara | 0,788 [0,775–0,799] | 5,79 | ✗ |

**Lettura:**
- **Spazienzio:** la bound di danno da 3 sta sotto 0,5. I bot la giocano 5 volte a partita e scartano ogni volta una carta regolare buona.
  È un limite dei bot più che della carta.
- **Mara:** D36 non regge, e **scendere a 2 non basta** (0,772–0,788). Nello specchio di Mara una HEALTH iniziale vale 4,06 punti di quota
  (1,83 per Spazienzio): i +10 punti valgono circa 2,5 HEALTH a partita, meno di quanto dia qualunque bound utile.
- **Salute equivalente per uso,** stimata con la pendenza della salute nei contesti del listino: MAR-BO1 circa 1,6 HEALTH per uso,
  MAR-BO2 2,5, MAR-BO3 1,2; SPA-BO1 3,9, SPA-BO3 2,6. Tutte dentro le 4 unità del tetto.
- **B2:** la bound +8 A supera il criterio nello specchio, ma senza di lei Mara perde di più contro Spazienzio (0,951 invece di 0,937,
  vedi le varianti).

### Listino con l'àncora a 7 HIT

`-Dsim.listinoBase=set-base -Dsim.listinoAnchor=7`, gruppi `costo`, `tipo` e `salute`, sui contesti degli starter nuovi. Ogni contesto è
lo starter con due coppie di generiche sostituite dalle due àncore: Spazienzio senza SeagullFly e Tartaruga, Mara senza Spintone e Sputo.
Bisezione 400, griglia 2000 e curve 2000 partite per stile e punto; base derivata SHA-256 `b9b21a32…e1a06673`. 679.200 partite in
358 secondi.

| Voce | Contesto | Valore misurato [IC 95%] | Prezzo della griglia |
|---|---|---|---|
| 10 V | Spazienzio | 18,4 HIT, 1,14 per V | F2 ≈ 18–20 |
| 20 V | Spazienzio | 38,9 HIT, 1,60 per V | F3 ≈ 24–29 |
| 30 V | Spazienzio | 75,7 HIT, 2,29 per V | — |
| **10 A** | **Mara** | **16,7 HIT, 0,97 per A** | F1 ≈ 12–13 (0,6 per A) |
| **20 A** | **Mara** | **30,0 HIT, 1,15 per A** | F2 ≈ 18–20 |
| 10 A | Spazienzio | 8,8 HIT, 0,18 per A | — |
| 5 L | Spazienzio | impagabile: piatta fino a 57 HIT | — |
| CUT, POISON | Spazienzio | 0,85 e 0,95 HIT per unità | 1 |
| CUT, POISON | Mara | 0,99 e 1,02 HIT per unità | 1 |
| Salute iniziale | Spazienzio, Mara | 1,83 ± 0,09 e 4,06 ± 0,09 punti di quota per HEALTH | — |

**Lettura:**
- **La A di Mara costa il doppio di quanto dice la griglia:** circa 1 HIT per A invece di 0,6. Le sue carte a costo A sono sotto la linea
  di 4–8 HIT ciascuna (Cinghiata 12 CUT contro 16,7, Sgommata 22 contro 30, Sputo 12 POISON contro 16,7).
- Per Spazienzio la A non costa quasi nulla, perché non la spende.
- **La V oltre 20 è molto più cara:** HealingBlow (30 HIT per 20 V) e SuperImpact (40 per 25 V) restano sotto la linea secondo questi bot.
- **Il CUT vale meno contro Spazienzio** (0,85), per MadeOfStone e Tartaruga.

### Copertura

Ogni meccanica di base compare in almeno uno dei due mazzi, e un test lo controlla:

| Meccanica | Dove |
|---|---|
| Danno HIT | Spazienzio |
| Danno CUT | Mara |
| Danno POISON | Mara (Sputo) |
| Difesa | MadeOfStone e Tartaruga; Paraurti e Tartaruga |
| Priorità | da −1 (`BruiserGrab`) a 2 |
| Oggetti e presa | tutti e due i mazzi, basic comprese |
| Equip | Posacenere (uso singolo), Giubbotto (durata) |
| Annullamento | YouStop |
| Contromossa senza annullare | Sorpasso (−8 A) |

Restano agli avanzati e ai booster, come vuole la griglia: T sul bersaglio, alcol, timer, token e costo in HEALTH.

### Varianti diagnostiche, non applicate

Per orientare le proposte ([dettagli e SHA-256](sb-11b/varianti-diagnostiche.md)): 1000 partite per cella, stessi stili e semi, nessun
invariante violato. Quota di Spazienzio contro Mara:

| Variante | Quota [IC 95%] |
|---|---|
| bozza | 0,937 [0,935–0,940] |
| MadeOfStone solo nel turno | 0,920 [0,915–0,924] |
| MadeOfStone ×0,75 | 0,930 [0,926–0,934] |
| Spazienzio V iniziale 15 | 0,839 [0,833–0,845] |
| Mara HEALTH 95 | 0,867 [0,861–0,873] |
| Mara con MAR-BO3 al posto di MAR-BO2 | 0,951 [0,948–0,955] |
| costi di Mara −5 A (Cinghiata, Sgommata, Slalom, Paraurti, Sputo) | 0,743 [0,736–0,750] |
| **costi −5 A e HEALTH 95** | **0,593 [0,585–0,601]** |

MadeOfStone, che sembrava la causa ovvia, sposta poco. Contano il prezzo della A e la salute di Mara. Nessuna leva da sola basta.

## Codice

Tutto in `server/src/test`.

| File | Cosa cambia |
|---|---|
| `resources/set-base/bozza.json` | Nuovo: la bozza |
| `java/.../sim/SetBaseDraftTest.java` | Nuovo: otto prove brevi (sotto) |
| `java/.../sim/Listino.java` | Base del listino ricavata dalla bozza (`-Dsim.listinoBase=set-base` o un percorso) con i contesti di Spazienzio e Mara; gruppo `tettostarter` fuori da `all`; le gemelle del gruppo `carte` saltano le carte assenti dalla base |
| `java/.../sim/ListinoMeasureTest.java` | Lancia solo le misure i cui contesti esistono nella base; con la base del Set Base i file si chiamano `sb11b-listino-*` |
| `java/.../sim/ListinoReport.java` | Titolo del gruppo nuovo e salute equivalente per uso anche per quel gruppo |

Senza `sim.listinoBase` il listino è quello di prima: stessa base (SHA-256 controllato da `ListinoAnchorTest`), stesse domande, stesse
curve, stessi nomi dei file.

**Prove nella suite** (`SetBaseDraftTest`, circa 1 secondo):
1. La bozza si carica in modo stretto, con i due personaggi (tutte e cinque le risorse), i due starter e le terze bound fuori dagli starter.
2. Formato degli starter: 20 carte regolari, al massimo 2 copie, basic fissa, due bound proprie diverse e gratuite, last resort gratuita,
   nessuna basic, bound o last resort fra le regolari.
3. Invarianti di SB-7 in modo stretto e tetto D33/D36 sulle sei bound: 324 partite con i tre stili euristici.
4. Due partite per ogni coppia ordinata dei cinque stili (compresi il bot attuale e il casuale) e per ogni coppia di mazzi: 150 partite
   senza errori né limite.
5. Copertura delle meccaniche di base.
6. Ogni durata segue la lettura di R05, contro la descrizione della carta.
7. Le nove carte di Spazienzio hanno il nome in maiuscolo.
8. La base del listino ricavata dalla bozza: contesti con le àncore a 7 HIT, starter intatti, dieci curve `tettostarter`, nessuna con la
   base di SB-10a.

**Le prove sanno fallire.** Ho sabotato a mano la bozza in tre modi:
- Giubbotto a `turns: 3`;
- «Testa al muro» in minuscolo;
- una copia di Spintone sostituita da Denti stretti.

I test hanno dato rispettivamente:
- `expected: <2> but was: <3>`;
- `expected: <TESTA AL MURO> but was: <Testa al muro>`;
- il rifiuto della base del listino, perché lo starter non ha più due copie di Spintone.

Poi ho ripristinato la bozza.

**Riprove sulla bozza definitiva.** Dopo il cambio del nome (SHA-256 da `7d3fe0cd…2b42b8c` a `74540167…fe02ee94`):
- la matrice rilanciata coincide con la prima nei dati, salvo impronta e nota;
- il gruppo `tettostarter`, l'unico che gioca la carta rinominata, coincide cella per cella (60.000 partite, 41 secondi);
- i gruppi `costo`, `tipo` e `salute` non sono rilanciati: non usano la carta, e la loro evidenza riporta l'impronta della bozza di prima.

## Come si lancia

Da `server/`, con `JAVA_HOME` sul JDK di `.tools/`:

```powershell
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=BenchMeasureTest#matrix" "-Dsim.bench=2000" "-Dsim.draft=<percorso assoluto di set-base/bozza.json>" "-Dsim.strict=true" `
  "-Dsim.styles=aggressivo,prudente,risorse,com" "-Dsim.threads=8"
..\.tools\apache-maven-3.6.3\bin\mvn.cmd -s ..\scripts\maven-settings.xml "-Dmaven.repo.local=..\.tools\m2" -o test `
  "-Dtest=ListinoMeasureTest" "-Dsim.listino=costo,tipo,salute,tettostarter" "-Dsim.listinoBase=set-base" "-Dsim.listinoAnchor=7" "-Dsim.threads=8"
```

## Decisioni del proprietario

Alle otto domande della fase A il proprietario ha risposto: «approvo le raccomandazioni su queste e anche delle prossime (a questo livello
di dettaglio mi fido di te), però su spazienzio il mazzo lo chiamiamo "pazienza finita" e i nomi delle sue carte li teniamo tutti in
maiuscolo (sull'interfaccia, non nei dati o nel codice), perché lui ha perso la pazienza e urla». Quindi:

1. **Bozza e identificatori:** file unico `set-base/bozza.json`, con le convenzioni descritte sopra.
2. **Nome dello starter di Spazienzio:** «Pazienza finita», non la raccomandazione («Quando arriva, arriva»). Nomi delle sue carte in
   maiuscolo nell'interfaccia.
3. **Durate:** «per N turni» = `turns: N − 1`; l'incoerenza dei testi va a SB-25.
4. **D36:** il tetto per il danno resta 3; non si scende a 2, che non risolve. In SB-12, a matchup sistemato, le bound si valutano anche
   come salute equivalente per uso, al massimo 4.
5. **B2:** MAR-BO2 (+8 A) resta nello starter di Mara.
6. **Matchup:** SB-12 parte da costi di Mara −5 A su Cinghiata, Sgommata, Slalom, Paraurti e Sputo e da HEALTH 95 (misurato 0,593), poi
   un secondo passo.
7. **Prezzi del listino:** la A di Mara vale circa 1 HIT e la V oltre 20 è molto più cara. Si registra nel piano e si usa in SB-12, senza
   riscrivere ora la griglia.
8. **Limiti dei bot:** bound di danno giocate troppo, Steal quasi mai, difese di Mara giocate in svantaggio. Si guardano in SB-12 prima
   di tagliare carte.

**Interpretazione del punto 2.** «Sull'interfaccia, non nei dati o nel codice» l'ho letto così: il maiuscolo vale per il nome che il
giocatore vede (`gui.name`), non per binding, id e codice. Se invece il proprietario intende che il dato resti in minuscolo e che sia
l'interfaccia a mostrarlo in maiuscolo, basta cambiare un nome e il test 7, e annotare la regola per SB-31.

## Cosa non è provato

- **I bot.** Tutti i numeri dicono come giocano questi bot:
  - giocano troppo le bound di danno (Spazienzio con la bound da 3 HIT vince meno che con una nulla);
  - Steal quasi mai, e le difese di Mara quando la partita è già persa;
  - non sanno che un equip prepara un colpo.
- **Il criterio dei +10 punti** dipende dal contesto: nello specchio di Mara è molto più severo che in quello di Spazienzio. La salute
  equivalente per uso è una stima, fatta con la pendenza della salute dei contesti con le àncore, non degli starter.
- **I contesti del listino** sono gli starter con due coppie di generiche al posto delle àncore: una scelta, non l'unica possibile.
- **Le varianti diagnostiche** cambiano una o due cose alla volta, con 1000 partite per cella: indicano una direzione, non sono un giro
  di bilanciamento.
- **Nessuna partita umana.** Il divertimento non è misurato.
- **`TestServerContext` non lanciato:** il blocco tocca solo `server/src/test` e i documenti; contesto Spring, CLI e classi di produzione
  non cambiano.

## Verifiche

Eseguite una alla volta, dopo aver controllato che non girassero altri processi Java.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.**
  - Maven: 579 test, 0 falliti, 7 saltati (le misure a richiesta, come in SB-11a). Gli 8 nuovi sono quelli di `SetBaseDraftTest`.
  - `ListinoAnchorTest`, `ListinoTest`, `BenchTest`, `PlaygroundTest` e le prove di SB-11a passano senza modifiche: nessun test esistente
    toccato, nessun atteso cambiato.
  - Client: 36 test su 36.
- `python scripts/check-rules.py`: regolamento e copia client allineati; 39 carte e 1 token; SQLite integro.
- `TestServerContext`: non lanciato, per il motivo sopra.

## Cosa serve a SB-12

1. **Matchup Spazienzio contro Mara da 0,937 al 45–55%.** Primo passo: costi di Mara −5 A sulle cinque carte e HEALTH 95 (0,593).
   Poi un secondo passo sul danno di Mara o sui colpi oltre 20 V di Spazienzio. Si rilancia la matrice dopo ogni correzione.
2. **Prezzi:** A di Mara a circa 1 HIT, V oltre 20 molto più cara. Si rimisura il listino dopo le correzioni (`-Dsim.listinoBase=set-base`).
3. **Durata:** 13,5–16,5 turni, sopra l'obiettivo di 6–12. Mara esaurisce il mazzo nel 58% delle partite.
4. **D36 e B2:** si rimisurano sugli starter corretti, anche come salute equivalente per uso.
5. **Bot:** prima di tagliare Steal, Paraurti o la Tartaruga di Mara, controllare se è il bot a giocarle male.
6. **Carte ferme in mano** oltre 1,5 turni: Glare, MadeOfStone, YouStop, Tartaruga, Denti stretti, Sorpasso, Paraurti.
7. **SB-8** (bozza giocabile da umani) resta il prerequisito per la prova umana di SB-12.
