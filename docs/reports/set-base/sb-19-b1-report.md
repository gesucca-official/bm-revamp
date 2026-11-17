# SB-19 — Fase B1: le nove carte in griglia e in bozza, giro e ricerca «prima» (rapporto)

**17 novembre 2026. Fase B1 di [D129](../../set-base-decisioni.md#decisioni-del-proprietario) e [D130](../../set-base-decisioni.md#decisioni-del-proprietario): le nove carte
degli slot mancanti entrano nella griglia e nella bozza, mazzi scritti prima di misurare, giro «Rif» / A1 / isolamenti / riserva, ricerca di diagnosi
«prima». Un solo STOP, alla fine, con le domande al proprietario. Nessun codice dei bot, nessuna modifica a RP-27, RP-28 o ai due oggetti col malus
in campo (è la Fase B2).**

## Stato (ripartenza)

- Passo 0 e identità: identici (§ 1). **Criterio 1: «Rif» identico numero per numero** sulle 403.200 partite dei 4.032 incontri (nessuno STOP).
- Griglia, bozza (121 carte, 16 mazzi con i nove nuovi), banco `Sb19MeasureTest`, test `Sb19CardsTest` (§ 2–3). Verifiche in § 8.
- Giro A1: **nessun mazzo con le aggiunte passa i criteri 2–3 alla lettera** (§ 4). Si dividono in uscite *in su* (la carta rompe l'equilibrio) e *in giù*
  (il mazzo con la carta nuova è più debole del riferimento), che la riserva scritta, un valore più prudente, non può riparare (§ 5).
- Isolamenti: in su sono **Secondo fiato** (Mara +15,36 di media), **Estasi** (+10,54) e **Grappa** (+11,53); Maleducazione ed Elemosina sono quasi neutre (§ 5).
- Riserva applicata: **Secondo fiato +12 HEALTH** (valore A2, scritto). Nei mazzi veri non c'è più nessuna uscita in su; isolata, resta +9,83 (§ 6). Estasi e Grappa non hanno un valore prudente scritto: **non toccate** (§ 6).
- Ricerca «prima» sui sette personaggi: fatta; Estasi nel mazzo vincente in **14 ricerche su 14** (§ 7). Budget: 1.050 s su 1.200 (giro e isolamenti), 847 s su 1.200 (ricerca).
- **STOP per il proprietario**: domande in § 9.

## 1. Passo 0

- **Identità.** Bozza di 2896896 contro bozza nuova, `ChargeMeasureTest#measure`, braccio B, 4 semi, 8.640 partite ([step0.ps1](sb-19/step0.ps1)): le due uscite coincidono byte per byte. Le nove carte sono nuove: nessun mazzo di riferimento le contiene, quindi nessuna partita cambia.
- **Codice.** GEN-04 è la sola classe nuova, `base.com.BeggingMoney`, sottoclasse della carta viva che toglie il −10 A al bersaglio ([BeggingMoney.java](../../../server/src/main/java/com/gsc/bm/model/cards/base/com/BeggingMoney.java)). GEN-10 usa la classe viva
  `bruiser.BadEducation` con costo, priorità e `hitDamage` dalla bozza: nessun codice nuovo. Il diff sta nel pacchetto `model/cards/base` (e nei test): vale la deroga del playground di `docs/aree-protette.md`.
- **Criterio 1.** «Rif» (i sette mazzi di riferimento fra loro, 28 coppie, 144 incontri per coppia, 100 semi) sulla bozza di oggi e sulla nuova: stessi incontri (4.032), stesse partite (403.200), stessi invarianti (0 violazioni), nessuna differenza ([identity-rif.json](sb-19/evidence/identity-rif.json)).
  Il giro di «Rif» è anche la base dei numeri di riferimento per la B2 ([rif-summary.md](sb-19/evidence/rif-summary.md)): 2 incontri su 28 fuori dalla soglia D95, entrambi già presenti oggi (Celestina–Celestina, patte 12,58%; Celestina–Sergio, 68,83%).

## 2. I mazzi con le aggiunte

Scritti prima di misurare ([make-bozza.py](sb-19/make-bozza.py)): uno per mazzo di riferimento, due copie di ogni carta nuova, al più 6 copie cambiate, 20 carte (D94), bound e last resort del riferimento. Ogni carta in almeno due mazzi.

| Mazzo (id `prova-b1-…`) | Parte da | Tolte | Messe |
|---|---|---|---|
| spazienzio | Spazienzio | Tartaruga ×2; Gabbiano ×2; Mattone, Colpo che cura | Non sento niente ×2; Colpo allo stomaco ×2; Coccio ×2 |
| mara | Mara | Spintone, Sputo; Tartaruga, Giubbotto; Panino ×2 | Mano lesta ×2; Elemosina ×2; Secondo fiato ×2 |
| celestina | Celestina | Steal, Grab; Fasciatura, Panino | Elemosina ×2; Secondo fiato ×2 |
| piera | Piera | Rotten ×2; Spintone ×2; Fasciatura, Grab | **Grappa ×2**; Mano lesta ×2; Mezza minerale ×2 |
| beppe | Beppe | Gabbiano, Spintone; Due dita, Casco; Giubbotto ×2 | Colpo allo stomaco ×2; Maleducazione ×2; Coccio ×2 |
| sergio | Sergio | Tartaruga ×2; Stunning, Acqua; Spintone, Santino | Non sento niente ×2; Mano lesta ×2; Elemosina ×2 |
| duccio | Duccio | Panino ×2; Spintone ×2; Ghiaccio, Fasciatura | Secondo fiato ×2; Mano lesta ×2; Mezza minerale ×2 |
| equip (rischio 3) | Beppe | Giubbotto ×2; Casco ×2; Steal, Due dita | Coccio ×2; Posacenere ×2; Maleducazione ×2 (con i Guanti ×2 già suoi) |
| estasi (rischio 1) | Beppe | Chiave ×2; Espresso, Stretta | **Estasi ×2; Grappa ×2** (uno starter senza L) |

Mazzi d'isolamento (un solo cambio sull'altro mazzo, [make-iso.py](sb-19/make-iso.py)): Beppe + Estasi ×2, Beppe + Grappa ×2, Celestina + Elemosina ×2, Celestina + Secondo fiato ×2, Mara + Mano lesta ×2,
Mara + Elemosina ×2, Mara + Secondo fiato ×2, Beppe + Colpo ×2, Beppe + Maleducazione ×2, Beppe + Coccio ×2.

## 3. Griglia, bozza, test

- **Griglia** ([griglia.md](../../design/set-base/griglia.md)): righe GEN-04, 08, 10, 11, 19, 20, 21, OGG-08 e OGG-16 coi nomi di lavoro (nota ¹⁰), conteggi del set (121 carte: 44 C / 58 NC / 19 R, archetipo 43, per ruolo 114 carte giocabili),
  tabelle di controllo riscritte dalla bozza, paragrafo dei mazzi. Con OGG-17 e OGG-18 della B2 (D130) il set arriva a 123.
- **Bozza** (`bozza.json`): 9 carte e 9 mazzi in più; `rarita-bozza.py --check` e `SetBaseDraftTest` verdi con gli attesi cambiati **solo per le carte nuove**, uno per uno: rarità 42 C / 55 NC / 17 R fra le carte, i nuovi slot della griglia,
  gli id dei mazzi, gli stati controllati (16 → 19: Non sento niente e i due di Secondo fiato), le coppie dei due test di banco (136). `Bozza16Test` toglie anche le carte di SB-19, come toglie quelle delle fasi precedenti.
- **Test** ([Sb19CardsTest](../../../server/src/test/java/com/gsc/bm/sim/Sb19CardsTest.java), 10 prove): prezzi della proposta, effetto di ogni carta (Mano lesta ±5 A, Colpo +10 T, Maleducazione toglie gli equip e fa 8 HIT, Non sento niente ×0,35 e +5 A,
  Secondo fiato con HIT e CUT ×1,25 e `turns` 1 per «2 turni» (R05), Coccio, Elemosina senza −A, i due oggetti), regole dei nove mazzi.

## 4. Giro A1 (valori della proposta)

Sette mazzi di riferimento contro i sette (Rif) e nove mazzi con le aggiunte contro i sette (63 coppie), 12 stili letali × 12, 100 semi per cella: 907.200 partite, 0 violazioni, 0 bound oltre il tetto
([a1-summary.md](sb-19/evidence/a1-summary.md), giocate delle carte in [cards-a1.md](sb-19/evidence/cards-a1.md)).

| Mazzo | Guadagno medio | Massimo | Uscite |
|---|---:|---:|---|
| Spazienzio + | −7,05 | +3,00 | Celestina 11,67%; Duccio 30,14% (giù) |
| Mara + | −0,87 | +7,41 (Piera) | Piera 65,74% (su); durata Celestina +0,29 e Sergio +1,17 |
| Celestina + | +2,30 | **+10,52 (Mara)** | Mara +10,52 e Piera 67,42% (su); patte specchio +2,77 |
| Piera + | −8,93 | −3,60 | Mara 27,90%, Celestina 31,78%, Beppe 33,38% (giù) |
| Beppe + | −0,02 | +9,60 | Celestina 13,98% (giù); patte specchio +2,16 |
| Sergio + | **−20,06** | −15,20 | Mara 32,72%, Piera 18,18%, Beppe 26,80% (giù) |
| Duccio + | −7,57 | −0,81 | Mara 31,43%, Sergio 34,09% (giù) |
| Equip (Beppe) | −3,94 | +1,12 | patte specchio +1,68 |
| Estasi + Grappa (Beppe) | **+21,20** | **+29,06 (Celestina)** | media > 5, confronti oltre +10 e fuori dalla fascia contro Spazienzio, Mara, Celestina (su) |

Rischi della proposta (§ 4): **2, Sgommata + Mano lesta** (Mara +): l'isolamento di Mara + Mano lesta è in giù di 13,5 punti (§ 5) e la carta si gioca nel 10% delle partite del mazzo di Mara; l'uscita in su di Mara + (Piera 65,74%) viene da Secondo fiato; **3, equip impilati**: nessuna uscita (massimo +1,12 su Celestina),
solo le patte dello specchio di Beppe; **4, GEN-04 contro Beppe e Celestina**: gli isolamenti con Elemosina sono vicini a zero (+0,22 e −4,38); **5, cure** (durata ≤ 12): vedi § 5; **1, Estasi fuori da Piera**: il mazzo con Estasi ×2 e Grappa ×2 è il peggiore del giro (§ 5).

## 5. Isolamenti: chi è responsabile

Dieci mazzi d'isolamento contro i sette, stesse condizioni: 1.008.000 partite in 303,7 s ([iso-summary.md](sb-19/evidence/iso-summary.md)).

| Isolamento | Guadagno medio | Massimo | Lettura |
|---|---:|---:|---|
| Beppe + Estasi ×2 | **+10,54** | +16,39 (Celestina) | su: media > 5, 3 confronti > 10 |
| Beppe + Grappa ×2 | **+11,53** | +18,24 (Celestina) | su: media > 5, 4 confronti > 10 |
| Celestina + Elemosina ×2 | +0,22 | +4,78 | neutra (solo patte dello specchio) |
| Celestina + Secondo fiato ×2 | +3,41 | +13,43 (Mara) | su sul solo confronto con Mara |
| Mara + Mano lesta ×2 | **−13,46** | −9,75 | giù: più debole in ogni incontro |
| Mara + Elemosina ×2 | −4,38 | −2,07 | giù, lieve |
| Mara + Secondo fiato ×2 | **+15,36** | +22,33 (Mara) | su: media > 5, 5 confronti > 10 |
| Beppe + Colpo ×2 | +6,43 | +17,25 (Spazienzio) | misto: +17 su Spazienzio, **−26,7 su Celestina** (la T che dà alimenta lei) |
| Beppe + Maleducazione ×2 | +3,76 | +9,92 | neutra |
| Beppe + Coccio ×2 | −12,15 | −8,25 | giù: più debole in ogni incontro |

- **In su, responsabili:** Secondo fiato, Estasi (già dentro gli starter: rischio 1, nessuna aggiunta dà L ma Grappa sì), Grappa. Colpo allo stomaco è in su contro sei starter su sette e in giù contro Celestina.
- **In giù (Sergio +, Piera +, Spazienzio +, Duccio +, Mara + Mano lesta, Beppe + Coccio):** il mazzo con le aggiunte è più debole del riferimento, perché le carte nuove sostituiscono carte più forti. La regola scritta («la carta responsabile prende il valore di A2, poi R1 il valore prudente, poi R2 la carta esce») porta
  tutte le carte verso il più debole e non può riparare un'uscita di questo verso: letta alla lettera, farebbe uscire quasi tutte le carte. Non l'ho applicata e **non ho spostato nessuna soglia**; è la domanda 3.

## 6. Riserva applicata

**Secondo fiato +12 HEALTH** (valore A2, scritto nella proposta § 5): bozza, griglia (GEN-20), generatore e test aggiornati insieme; nessuna altra carta cambia. Giro A2 sui cinque mazzi che la contengono
(mazzi di Mara, Celestina, Duccio e i due isolamenti): 100 semi per cella, 152,7 s ([a2-summary.md](sb-19/evidence/a2-summary.md)).

| Mazzo | A1 (+15) medio / massimo | A2 (+12) medio / massimo |
|---|---|---|
| Mara + | −0,87 / +7,41 | −6,35 / −0,05 |
| Celestina + | +2,30 / **+10,52** | −3,90 / +3,45 |
| Duccio + | −7,57 / −0,81 | −10,10 / −3,69 |
| Celestina + Secondo fiato ×2 | +3,41 / +13,43 | −1,99 / +6,12 |
| Mara + Secondo fiato ×2 | **+15,36 / +22,33** | **+9,83 / +16,08** |

Nei mazzi veri non c'è più nessuna uscita in su (Mara +: Beppe 34,82%, Sergio durata +0,73; Celestina +: solo le patte dello specchio, che nel riferimento sono già a 12,58%; Duccio +: Mara 27,89% e Sergio 30,30%, in giù).
Isolata, la carta a +12 **resta in su** (media +9,83 > 5, Mara +15,63, Piera +16,08, Beppe +10,42, Sergio +10,79): è la prima domanda (§ 9). **Mano lesta ±4 A** (braccio A2 del rischio 2) non è stata applicata: Mano lesta è già
in giù di 13,5 punti nel mazzo di Mara, quindi il braccio prudente la peggiora. **Estasi e Grappa**: nessun valore prudente scritto; D129 (1) tiene Grappa; la correzione di Estasi è di SB-20 (D110, D130): non toccate. Le copie A2 dei mazzi non sono in bozza.

## 7. Ricerca di diagnosi «prima» (D130 (4))

Strumento della A2 di SB-17 (`BenchMeasureTest#search`), esteso da cinque a sette personaggi ([search.ps1](sb-19/search.ps1), due lanci), sulla bozza di oggi (2896896): d50, 8 thread, tre stili euristici, al più 25 generazioni, partenza
dallo starter e casuale. 847 s ([search-prima.md](sb-19/evidence/search-prima.md), riassunto con [search-summary.py](sb-19/search-summary.py)).

- **Estasi (PIN-AR2) è nel mazzo vincente di 14 ricerche su 14**, 1 o 2 copie, con tutti e sette i personaggi e senza nessuna carta che dia L: è la lettura del rischio 1 **di oggi**, prima delle aggiunte.
- Massimo contro uno starter: 93,2% (Spazienzio), 96,2% (Mara), 99,1% (Celestina), 92,2% (Piera), 99,0% (Beppe), 98,8% (Sergio), **100,0% (Duccio, partenza dallo starter)**; sul riferimento intero le quote di convalida vanno dall'81,8% (Mara, dallo starter) al 99,8% (Duccio).
- La ricerca «dopo» non è stata fatta: B1 chiedeva solo il «prima» (D130 (4)); la confronteranno la B2 o la fase che decide, con la stessa bozza e gli stessi semi.

## 8. Verifiche

Eseguite alla fine (nessun valore atteso cambiato per tornare in verde):

- `git diff --check`, `check-links.py`, `check-rules.py`: vedi la riga del commit; `rarita-bozza.py --check`; `genera-bozza-di-riferimento.py --scrivi` e `--verifica`.
- `./scripts/build.ps1 -Task Test -Offline`: verde (test completo del server).
- Deroga del playground: il diff del codice sta in `server/src/main/java/com/gsc/bm/model/cards/base/com/BeggingMoney.java` e nei test; nessun codice vivo dipende dalla nuova classe (nessuna carta viva la nomina) e il catalogo non la nomina:
  identità viva e `TestServerContext` non servono (aree-protette.md).
- `./scripts/build.ps1 -Task Server -Offline` alla chiusura.

## 9. Domande per il proprietario

1. **Secondo fiato (GEN-20)**: a +12 HEALTH nessun mazzo vero esce in su, ma isolata la carta è ancora +9,83 di media. **Tengo +12** (la riserva scritta, nei mazzi veri passa), o **la faccio uscire (R2)** e il set scende a 120 (slot GEN-20 vuoto)? Raccomandazione: tenere +12 e rivedere alla B2.
2. **Grappa (OGG-16) ed Estasi**: nel mazzo di Beppe fanno +21,20 di media, ciascuna da sola ~+11; la ricerca «prima» mostra Estasi già in 14 ricerche su 14, quindi **non è il carico di Grappa a crearla**. D129 (1) tiene Grappa e D130 manda a SB-20 la correzione di Estasi: **confermi** che per B1 restano così, o do a Grappa un valore prudente (non c'è uno scritto: lo scegli tu) o la faccio uscire (set a 120)?
3. **Uscite in giù**: i nuovi mazzi sono più deboli dei riferimenti (Sergio + −20 di media). La regola scritta non le ripara: **le leggo come non-uscite** (criteri 2–3 solo verso l'alto per la carta aggiunta, cioè «i mazzi non peggiorano» vale per gli starter, non per i mazzi di prova) **o le conto come uscite** (e allora serve una regola per rinforzare le carte: A3)? Raccomandazione: la prima, con le carte deboli (Mano lesta −13,5, Coccio −12,2) segnalate per la B2.
4. **Colpo allo stomaco**: dà T, e contro Celestina fa −26,7 a Beppe. Lo lascio com'è (è la T come risorsa dell'avversario, rischio già noto)?
5. **Numeri per la B2**: la base è «Rif» identico (§ 1) e il mazzo di riferimento per la riga di Celestina ha già un'uscita (patte 12,58%): la B2 la deve citare come tale, non come regressione. Va bene?

Tempi: `Sb19MeasureTest` 144 incontri per coppia; budget in [budget.json](sb-19/evidence/budget.json): giro e isolamenti 1.050 s su 1.200, ricerca 847 s su 1.200.
