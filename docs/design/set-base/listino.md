# Listino di potenza del Set Base

> **Stato: misurato in SB-10a il 6 novembre 2026 e approvato dal proprietario lo stesso giorno (D33).** **Non normativo:** il regolamento vigente
> è [game-rules.md](../../game-rules.md) e la partita viva non cambia. Il listino è uno strumento di progetto per SB-10b (griglia degli
> slot) e per i blocchi delle carte, come le [schede dei personaggi](schede-personaggi.md). Metodo, semi e verifiche sono nel
> [rapporto SB-10a](../../reports/set-base/sb-10a-report.md); i numeri completi in [`sb-10a/`](../../reports/set-base/sb-10a/).

**Perché esiste.** Il piano partiva da un listino «a occhio» di circa 1,5 danni per V ([letture del regolamento](../../set-base-plan.md#letture-del-regolamento-che-guidano-il-progetto))
e da un tetto delle bound di circa 5 unità per uso ([bound](../../set-base-plan.md#bound-fallback-gratuito-e-debole)). Qui i due numeri
sono misurati: quanto danno compra una risorsa, quanto valgono priorità e precedenza, quanto vale L che decade, quanto vale una bound
per uso, e dove stanno le carte di oggi.

## Come si legge

- **L'unità è l'àncora:** una carta regolare gratuita, priorità 1, 10 HIT al bersaglio. Ogni voce dice quanto deve avere una carta
  per valere quanto l'àncora nello stesso mazzo. Esempio: «10 V → 20,7 HIT» vuol dire che una carta da 10 V vale l'àncora se fa 20,7
  HIT, cioè 1,07 danni per ogni V.
- **Moneta comune: la salute iniziale.** Un punto di HEALTH in più all'inizio sposta la quota di 2,5–4,8 punti, secondo il contesto.
  Bound e slot si traducono così in «punti di salute».
- **Gli intervalli che contano sono quelli fra contesti e stili.** L'errore statistico è piccolo (di solito ±0,1–0,5 HIT), ma lo
  stesso numero cambia molto con il mazzo e con lo stile del bot. Le tabelle danno quindi il campo di variazione con le condizioni, non
  un numero solo.
- **Contesti.** Specchi con quattro slot sonda: Spazienzio (starter di oggi, quattro carte tolte), Tossico (starter di oggi), Mara e
  Rocco (bozza di prova di SB-9), un mazzo neutro di sole carte a dati. Un non specchio, Spazienzio contro Mara, con Spazienzio a 25
  HEALTH in meno per stare vicino al 50%. Il contesto neutro **amplifica**: 1 HEALTH vi vale 4,8 punti di quota e molte curve si saturano.
- **Bot.** Tre stili euristici (aggressivo, prudente, attento alle risorse). Il listino misura **come giocano questi bot**, non come
  gioca una persona.

## Il listino

| Voce | Misura | Condizioni e cautele |
|---|---|---|
| **V pagata** | 1,07 danni per V a 10 V · 1,15 a 20 V · 1,44 a 30 V (Spazienzio); 0,93–1,05 nel non specchio contro Mara | **Convesso:** le carte care chiedono un premio, perché si pagano tardi e intasano la mano. A 30 V gli stili vanno da 1,27 a 1,78. Nel neutro, con due sole generatrici, una carta da 20–30 V non si paga quasi mai: la sua quota resta piatta per qualsiasi danno |
| **A pagata** | 0,55 danni per A a 10 A · 0,80 a 20 A (Mara); 0,22–0,41 (neutro); 0,03 (Spazienzio, 10 A) | A costa poco perché quasi tutti ne hanno tanta. Comprende anche la precedenza persa (R04), che vale poco (sotto) |
| **T pagata dal Tossico immune** | 0,05 danni per T a 10 T · 0,13 a 20 T | Con lo starter di oggi il Tossico nuota nella T: come costo è quasi gratis. In uno starter con meno T il prezzo salirà |
| **L pagata** | Una carta da 5 L vale l'àncora solo con circa 40 HIT (Spazienzio, 0,47 giocate per partita). Nel neutro, a 5 o 10 L, non si paga mai | **L come costo è quasi inutilizzabile:** a fine turno +10 L ne perdono 6 e ne restano 4 (R06; testo corretto in SB-10b), quindi una carta da 10 L chiede due generatrici in fila. GoingBerserk (10 L) con il solo Cocktail (+15 L → 7) non si paga |
| **HEALTH pagata** | 1,06–1,24 danni per HEALTH (Rocco 1,23–1,24; neutro 1,06–1,12) | Stabile fra contesti e stili: pagare salute costa come subire danno, più il 6–24% |
| **CUT e POISON** | 1 CUT = 0,98–1,01 HIT; 1 POISON = 1,01–1,06 HIT; nel non specchio 0,98–0,99 | Uguali all'HIT anche contro le difese di Spazienzio: con questi bot le difese per tipo pesano poco. POISON leggermente sopra perché nessuno lo para |
| **Priorità** | Da 0 a 2: entro ±0,5 HIT in tutti i contesti | Vale quasi niente: il morto agisce comunque (R04), quindi arrivare prima conta solo per contromosse, oggetti e stati del turno |
| **A come precedenza** | Neutro: nessun effetto fra −10 e +10. Mara: gradino di circa 8 punti fra −1 e +1, cioè circa 2,3 HEALTH; poi quasi piatto. Spazienzio: gradino di 1,4 punti (0,5 HEALTH) | **Ordinale:** conta chi ha più A, non di quanto. 3 o 10 punti di margine valgono come 1 |
| **T al bersaglio non immune** | 1 T = 0,69–1,46 HIT (Mara 0,69; neutro 1,24; Spazienzio 1,46) | Molto **non lineare:** i primi punti valgono di più, perché il veleno dura per sempre (R06). Gli stili divergono, e il prudente non la gioca. **Contro un immune vale 0** |
| **L guadagnata** | 1 L = 0,49 V (0,49–0,50), con le spese da 10 V e 10 L del neutro | **Con una spesa dedicata da 10 L, nessuna quantità di L eguaglia +10 V:** da circa 18 L la spesa diventa pagabile, ma la quota resta ferma sotto il 50%. Ogni L presa toglie anche A a fine turno |
| **Una carta regolare buona** | Quattro àncore contro quattro carte di passo: 9,4 HEALTH (Spazienzio), 11,3 (Mara). Circa 2,4–2,8 per copia, circa 3,9 per giocata | È il valore marginale: chi non ha l'àncora gioca un'altra carta, non passa |
| **Slot occupato da una carta morta** | Quattro carte morte (costo 999 V, 10 HIT nominali) contro quattro carte di passo: +0,6 (Spazienzio), +1,4 (neutro), **−6,0** (Mara) HEALTH | Una carta mai giocabile costa poco se la mano ha alternative. Costa cara a chi scarta per le bound: il bot tiene la carta morta, che promette danno, e scarta quelle utili |

## Bound: valore per uso e tetto

Ogni bound sonda gioca accanto a una bound nulla, contro due bound nulle. Valore per uso = salute equivalente per partita / usi per partita.

| Bound | Spazienzio | Mara | Note |
|---|---|---|---|
| Danno 2 / 4 / 6 / 8 / 10 HIT | −0,4 / −0,3 / 0,9 / 2,3 / 3,3 per uso; quota 0,48 / 0,47 / 0,60 / 0,74 / 0,85 | 1,2 / 2,9 per uso, poi saturata; quota 0,62 / 0,81 / 0,93 / 0,98 / 0,99 | Giocata nel 24–45% delle mosse |
| +V (Spazienzio) o +A (Mara), 2–10 | Da −0,2 a 4,0 per uso; quota 0,49–0,63 | **Mai utile:** quota 0,47–0,50 | +A ripetuta non aiuta Mara, che ha già A 40 |
| Parata ×0,75 / ×0,5 / ×0,25 su HIT e CUT | −1,1 / −0,5 / 0,7 | −0,8 / −0,1 / 1,4 | **Le parate deboli sono una trappola:** i bot le giocano nel 30–36% delle mosse e perdono una carta ogni volta |
| Come Struggle (5 HIT a sé, 10 al bersaglio) | 0,0 per uso (quota 0,50) | 2,3 per uso (quota 0,74) | Riferimento del criterio «più debole di Struggle» |
| +2 / +5 T al bersaglio | 0,9 / 4,0 per uso | — | Si accumula: il tetto la esclude per struttura, non per valore |

**Il prezzo dello scarto.** In Spazienzio una bound da 6, 8 o 10 HIT rende al netto 0,9, 2,3 o 3,3 di salute per uso: lo scarto costa
circa 5–7 punti di salute per uso. In Mara di prova costa circa 1. Nel neutro il contesto è saturo e il prezzo non si legge.

**Le bound di oggi e di prova, nella stessa prova:**

| Bound | Contesto | Quota contro bound nulle | Per uso (HEALTH) | Quota delle mosse |
|---|---|---:|---:|---:|
| LittleSmack (+5 A, 5 HIT) | Spazienzio | 0,51 | 0,1 | 38,5% |
| LittleRage (HIT ×0,75, +5 V) | Spazienzio | 0,61 | 1,5 | 27,7% |
| PatheticBlade (+5 T a sé, 5 CUT e +5 T al bersaglio) | Tossico | 0,60 | 0,5 | 43,4% |
| RottenSmile (+5 A, −5 A al bersaglio) | Tossico | **0,30** | **−1,1** | 32,6% |
| ColpoDiStriscio (5 CUT) | Mara | 0,82 | 2,7 | 33,6% |
| Scarto (parata) | Mara | **0,36** | **−1,1** | 31,7% |
| Colpetto (5 HIT) | Rocco | 0,75 | 4,0 | 26,8% |
| Fiato (+5 HEALTH) | Rocco | 0,68 | 4,5 | 15,8% |

Negli specchi del Tossico il bersaglio è immune, quindi la T di PatheticBlade non pesa: il suo danno contro Spazienzio (SB-4, SB-7)
non si vede qui. È il motivo per cui le bound che lasciano qualcosa sull'avversario restano escluse per struttura.

### Tetto proposto

I tre criteri approvati in fase A danno, per una bound di solo danno:

| Criterio | Spazienzio | Mara di prova |
|---|---|---|
| Per uso vale meno di Struggle | fino a circa 4–5 HIT | fino a circa 3 HIT |
| Giocata al massimo in 1/3 delle mosse | fino a circa 3 HIT (24% a 2, 36% a 4) | fino a circa 6 HIT |
| Al massimo +10 punti contro le bound nulle | fino a 6 HIT (0,60) | **nessuno:** 2 HIT dà già 0,62 |

**Proposta: tetto 4 unità per uso, tolleranza 0** (oggi 5 ± 20%, cioè 6). Con i dati, 4 è il valore più alto che rispetta due criteri su
tre in Spazienzio, il metro scelto in SB-9. In Mara di prova ogni bound di danno supera i +10 punti: Mara ha 85 di salute e le sue
carte regolari di prova sono deboli, quindi un danno gratuito ripetuto pesa molto. Da rivedere con le carte vere di Mara (SB-11). Se il
proprietario preferisce il criterio più severo, il tetto è 3.

**Pesi proposti** per `-Dsim.boundWeights` (danno = 1):

| Risorsa | Oggi | Proposto | Da dove |
|---|---:|---:|---|
| V | 1 | **0,75** | Bound +V contro bound di danno in Spazienzio: +10 V vale come 6–7 HIT, +6 V come circa 5 (0,6–0,9) |
| A | 1 | **0,5** | A pagata 0,03–0,80; +A in bound non aiuta Mara. Dipende da quanto A c'è al tavolo |
| T, se immune | 1 | **0,15** | T pagata dal Tossico 0,05–0,13. Va rimisurata con lo starter vero del Tossico (SB-13) |
| L | 0,5 | **0,35** | 1 L = 0,49 V × 0,75 |
| HEALTH | 1 | 1 | HEALTH pagata 1,06–1,24: confermato |

Comando: `-Dsim.boundCap=4 -Dsim.boundTolerance=0 -Dsim.boundWeights=V:0.75,A:0.5,T:0.15,L:0.35`. Da SB-10b sono i predefiniti del banco; la misura in partita è nel [rapporto SB-10b](../../reports/set-base/sb-10b-report.md#tetto-in-partita). Esito con questi parametri nel
[rapporto](../../reports/set-base/sb-10a-report.md#tetto-delle-bound).

## Le 37 carte attuali

**Come si legge.**

- **HIT equivalenti:** il danno di una gemella con lo stesso costo e la stessa priorità che vale quanto la carta, nel suo starter
  (Spazienzio o Tossico).
- **Linea:** il danno che una carta di solo danno a quel costo deve avere per valere l'àncora gratuita da 10 HIT, interpolato dalle
  misure di costo dello stesso contesto.
- **Sopra o sotto:** con intervalli che non si toccano. Gli intervalli statistici sono di ±0,2–0,6 HIT.
- **Curva a U.** «Peggio di una carta morta» vuol dire che una gemella a 0 HIT, mai giocata, batte la carta: giocarla costa più di
  quanto rende.

**Misure di SB-7** (bozza «attuale», 27.000 partite per mazzo, tutti gli avversari): giocate per partita, scarto della quota nelle
partite in cui la carta è giocata, turni ferma (legale, non scelta) per partita in cui è in mano. Lo scarto di quota ha un difetto: una
carta si gioca più spesso quando si è già avanti o indietro, quindi non è causale.

### Azioni di Spazienzio (contesto: starter di Bruiser)

| Carta | Costo, priorità | HIT equivalenti | Linea | Posizione | SB-7: giocate · scarto · ferma | Motivo |
|---|---|---:|---:|---|---|---|
| Glare | gratuita, 0 | 6,6 | 10 | sotto | 0,67 · −0,01 · 1,5 | La V che dà serve a carte che costano già troppo; lo stato ×1,5 la penalizza |
| MadeOfStone | gratuita, 0 | 6,5 | 10 | sotto | 0,42 · +0,07 · 1,5 | Parata contro CUT, che in questo starter quasi nessuno usa |
| CantFeelAnything | 20 V, 2 | 23,6 | 33,0 | sotto; peggio di una carta morta | 0,02 · −0,04 · 0,7 | 20 V per una parata del turno: quasi mai giocata |
| HealingBlow | 20 V, 1 | 29,6 | 33,0 | poco sotto | 0,49 · +0,08 · 0,1 | Vale il suo danno; azzerare T e L non conta nello specchio |
| SickeningBlow | 15 V, 1 | 24,6 | 26,8 | poco sotto | 0,16 · +0,23 · 0,8 | I 10 T al bersaglio valgono circa 14–15 HIT, come misura il listino |
| StunningBlow | 15 V, 1 | 15,6 | 26,8 | sotto; peggio di una carta morta | 0,32 · −0,08 · 1,1 | −10 A al bersaglio vale circa 5 HIT: la precedenza è ordinale |
| ExtremelyViolentBlow | 20 V, 1 | ≤ 10 | 33,0 | molto sotto; peggio di una carta morta | 0,78 · +0,02 · 0,4 | Dopo aver pagato 20 V ne resta poca: fa circa 20 HIT. Il bot legge «20+x» e la gioca troppo |
| SeagullFly | 10 V, 1 | 14,3 | 20,7 | sotto | 0,51 · +0,06 · 0,5 | Vale il suo danno; 10 V costano più di 5 HIT |
| SuperImpact | 25 V, 0 | 39,3 | 43,0 | poco sotto | 0,41 · +0,14 · 0,0 | Controllo: la gemella identica vale 40 come dovuto |
| YouStop | 5 V, 2 | ≤ 10 | 15,3 | sotto; peggio di una carta morta | 0,14 · +0,28 · 3,5 | Contromossa: i bot la sottostimano (SB-17) |
| WhatchaDoin | 10 V + 10 A, 2 | 13,6 | 21,0 | sotto; peggio di una carta morta | 0,00 · — · 1,4 | Contromossa; con i costi doppi non si gioca quasi mai |
| BadEducation | 10 V, 1 | 10,4 | 20,7 | sotto; peggio di una carta morta | 0,34 · +0,01 · 1,0 | Vale i suoi 10 HIT: togliere equip non serve con queste carte |
| BreakYourToy | 10 V, 1 | 14,2 | 20,7 | sotto; peggio di una carta morta | 0,00 · — · 0,5 | Distruggere un oggetto vale circa 14 HIT, ma il bot non la sceglie |

### Azioni del Tossico (contesto: starter del Junkie)

| Carta | Costo, priorità | HIT equivalenti | Linea | Posizione | SB-7: giocate · scarto · ferma | Motivo |
|---|---|---:|---:|---|---|---|
| MethDrivenRage | 5 T, 1 | 11,4 | 10,2 | **sopra** | 0,83 · −0,04 · 0,0 | 15 HIT quasi gratis per il Tossico, meno 5 a sé: l'unica sopra la linea |
| GoingBerserk | 10 L, 1 | 31,9 | — | vale il suo danno; linea non misurata | 0,28 · −0,15 · 0,0 (morta 7,0) | Costo in L: spesso impagabile (SB-7: 7 turni morta per partita) |
| PervertedMetabolism | gratuita, 1 | 8,3 | 10 | sotto | 0,02 · +0,08 · 5,5 | Cura pari a T/2, ma il Tossico perde la sua riserva di T |
| Cough | 10 T, 1 | 3,9 | 10,5 | sotto | 0,01 · −0,66 · 1,5 | +5 T a sé e −5 A al bersaglio: quasi niente |
| AmphetamineReflexes | 10 T, 2 | 4,3 | 10,5 | sotto | 0,60 · −0,05 · 4,0 | Contromossa sottostimata dai bot |
| ToxicBloodDrain | 10 T, 1 | 4,5 | 10,5 | sotto | 0,01 · +0,19 · 1,6 | Travaso di T: contro un Tossico immune non avvelena |
| BadTrip | 10 A, 2 | 3,6 | 10,3–18 (stima) | sotto | 0,00 · — · 2,5 | Nessun costo in A misurato nel Tossico: la linea va da 10,3 a 18 con i prezzi di A misurati altrove |
| BeggingMoney | 25 T, 0 | 4,1 | 13,7 | sotto | non nello starter | Copia un oggetto: poco, a un costo alto |
| LethalHeroinDose | gratuita, 1 | 4,6 | 10 | sotto | 0,00 · — · 3,4 | Costa salute quando T è alta: il bot non la sceglie |
| EverythingIsDrug | gratuita, 1 | ≤ 10 | 10 | sotto; peggio di una carta morta | 0,23 · −0,17 · 2,4 | Consuma un oggetto senza effetti per +20 T, che al Tossico serve poco |

### Bound, last resort, oggetti e prese

| Carta | Posizione | Motivo |
|---|---|---|
| LittleSmack (Bruiser) | **oltre il tetto** (7,5 con i pesi proposti); in partita vale quasi niente (0,1 HEALTH per uso, quota 0,51) | Due funzioni; i +5 A non servono a Spazienzio |
| LittleRage (Bruiser) | **oltre il tetto** (6,75); +1,5 HEALTH per uso | Parata e +5 V: due funzioni |
| PatheticBlade (Junkie) | **oltre il tetto** per struttura: si accumula e lascia T +40 | Contro un immune vale poco (+0,5 per uso); contro Spazienzio è la bound che chiude la partita (SB-4, SB-7) |
| RottenSmile (Junkie) | **oltre il tetto** per struttura: lascia A −40 | In partita è dannosa: −1,1 HEALTH per uso, quota 0,30 |
| Struggle (last resort) | In linea col suo ruolo | 10 HIT e 5 a sé: netto circa 5. Come bound vale 0 in Spazienzio e 2,3 per uso in Mara. SB-7: giocata 0,15 (Bruiser) e 0,64 (Junkie) volte a partita |
| CocktailOnTheGround (oggetto) | Non misurata; stima con i pesi proposti: circa 20–21 unità (+20 V, +15 L, +5 T) | Un oggetto si consuma con una presa: è il valore di una presa, non di uno slot. Il più ricco del set |
| MarvelousCocktail (oggetto) | Non misurata | Immunità, +20 L e +20 T, poi un timer che toglie tutto e fa 20 POISON: non quotabile col listino |
| AnotherRottenBeer (oggetto) | Non misurata; stima circa 3,5 unità più il token | +10 L e un BrokenBeerBottle |
| RottenBeer (oggetto) | Non misurata; stima circa 1,75 unità | +5 L, che a fine turno diventano 3 |
| Grab, Steal, ShuffleFeet | Non quotabili | Prese di oggetti: valgono quanto l'oggetto. SB-7: Steal e ShuffleFeet mai giocate, Grab 0,06 per partita |
| BruiserGrab, ToxicGrab (basic) | Non quotabili | Gratuite e permanenti; SB-7: giocate 0,57 e 0,73 per partita, ferme molti turni senza oggetti |

**Sintesi.** Rispetto all'àncora gratuita da 10 HIT, **22 delle 23 azioni misurate stanno sotto la linea**. Solo MethDrivenRage sta
sopra. Le più vicine alla linea sono le carte di solo danno: SuperImpact, HealingBlow e SickeningBlow, tutte fra il 90 e il 92%.

Le più lontane:

- **contromosse:** YouStop, WhatchaDoin, AmphetamineReflexes;
- **carte d'effetto del Tossico:** Cough, ToxicBloodDrain, BadTrip, BeggingMoney;
- **ExtremelyViolentBlow**, che i bot sopravvalutano.

Otto carte valgono meno di una carta morta: giocate spendono V o T che servirebbero altrove, oppure consumano un oggetto per poco. Il livello del set di oggi è quindi più
basso dell'àncora: le gratuite valgono 4,6–8,3 HIT.

**Confronto con SB-7.** Le carte con poche giocate e molti turni ferme (CantFeelAnything, WhatchaDoin, BreakYourToy, Cough, BadTrip,
LethalHeroinDose) sono anche le più sotto la linea. Fa eccezione ExtremelyViolentBlow: è giocata spesso perché il bot legge «20+x»,
ma vale meno di una carta morta. Le contromosse hanno uno scarto di quota positivo in SB-7 (YouStop +0,28) e sono sotto la linea qui:
lo scarto di SB-7 non è causale, e i bot le giocano solo in casi rari.

## L e gli effetti poco evidenti

- **L non si accumula per pagare.** Con R06 a fine turno si perde L/2 + 1 (divisione intera): +10 diventa 4, +15 diventa 7, +20
  diventa 9, e 1 o 2 vanno a zero. Una carta che costa 10 L chiede una presa da almeno 21 o due prese in fila; per 5 L basta una presa
  da 11. Il Cocktail (+15 L) non basta per GoingBerserk. *Corretto in SB-10b: la prima versione scriveva la quantità persa (6, 8, 11) al
  posto di quella che resta; le conclusioni non cambiano.*
- **L guadagnata vale circa metà di V,** e meno ancora se c'è una spesa in L da servire: la stessa coppia generatrice + spesa in V batte
  sempre quella in L, a qualsiasi quantità di L.
- **L toglie A a chi la prende** (R06), ma la precedenza vale poco: il danno vero è che L non diventa mai una riserva.
- **L sull'avversario** non è stata misurata da sola: toglie A a fine turno e la precedenza è ordinale, quindi vale solo quando inverte chi
  arriva prima.
- **La priorità vale quasi niente** con queste carte: chi muore nel turno agisce comunque (R04), quindi arrivare prima conta solo per
  contromosse, prese di oggetti e stati che valgono nel turno.
- **T sull'avversario è forte e non lineare:** pochi punti valgono di più, perché il veleno resta per sempre. Contro il Tossico vale zero.
  I bot non la vedono (leggono solo i guadagni propri e il danno nominale): la giocano solo se la carta ha anche un danno.
- **Le parate deboli e le carte morte con danno nominale ingannano i bot:** una parata ×0,75 ripetibile toglie salute a chi la usa, e una
  carta impagabile che promette danno viene tenuta al posto di quelle da scartare.

## Cosa SB-10b deve usare, e con quale cautela

1. **Curva dei costi in V:** circa 10 + 1,1 × V fino a 20 V, poi un premio crescente (30 V → circa 53 HIT). Le carte sopra i 20–25 V vanno
   contate come slot che intasano: nel neutro non si pagano mai.
2. **A, T del Tossico e HEALTH come costo:** A e T valgono poco, quanto c'è al tavolo; HEALTH vale circa 1,1–1,2 danni. Per Sant'Incasso
   il prezzo in salute è quindi leggibile e stabile.
3. **L come costo va ripensata,** non solo prezzata: con la formula di R06 una carta a costo L è quasi sempre morta. Le carte di Pino
   (SB-14) dovranno spendere L nel turno dopo la presa, con costi bassi (5 o meno) o prese grandi.
4. **CUT, HIT e POISON allo stesso prezzo,** salvo carte che puntano sulle difese di un archetipo. La priorità non va pagata.
5. **Una carta gratuita da 10 HIT è sopra il livello del set di oggi:** 22 azioni su 23 valgono meno. Le carte gratuite di oggi
   valgono 4,6–8,3 HIT. Per la griglia conviene un'unità gratuita più bassa (circa 6–8 HIT).
6. **Bound:** tetto proposto 4 unità con i pesi sopra, una funzione per bound, niente che resti sull'avversario. Niente parate deboli
   ripetibili (sono trappole per i bot e non servono come ripiego).
7. **Cautela:**
   - questi sono numeri dei bot euristici di oggi, in contesti di carte di oggi o di prova;
   - con le carte nuove i valori di A, T e L cambieranno più di quelli di V e HEALTH;
   - un intervallo statistico stretto non dice che il numero vale per le persone;
   - prima di SB-11 conviene rilanciare le voci di V, A e HEALTH sugli starter nuovi: il comando è pronto e costa pochi minuti.
