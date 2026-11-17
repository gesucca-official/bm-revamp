# SB-19 — Proposta per il resto del pool (Fase A)

**Versione 0.1 — 17 novembre 2026.** Proposta di [SB-19](../../set-base-plan.md#sb-19--resto-del-pool-e-giro-di-blocco), passo con proposta come SB-17 e SB-18. Riferimenti: `bozza.json` dopo SB-18 (1.6b più Sergio e Duccio), [griglia](griglia.md), [listino](listino.md), [regole d50](regole-playground.md) 1.4, [schede](schede-personaggi.md), [serbatoio esterno](bozza-esterna-proposta-70-carte.md) (idee, non normativo), [ricerca di diagnosi](../../reports/set-base/sb-17/a2-search/search.md), decisioni D110, D117, D124 nel [registro](../../set-base-decisioni.md#decisioni-del-proprietario). **Niente misure in questa fase:** i numeri sotto sono prezzi del listino e stime.

## 1. In breve

- **Mancano 9 slot,** 7 generiche e 2 oggetti; tutto il resto della griglia è già in bozza (112 carte coi personaggi).
- **Il set chiude a 120** entrando in 8: esce OGG-16 «Grappa della casa», CES-AR7 si conta dentro.
- **Tre dei quattro slot «da inventare» erano riempitivi** o alimentavano Estasi. Due diventano gli ingressi: **Secondo fiato** (D124) al posto di «Sedia in testa», **Mano lesta** (D117, rubare risorse) al posto di «Bottigliata».
- **L'oggetto col malus in campo (D117) non diventa una carta qui:** chiede una regola nuova, motore, bot e client. Resta scritto come idea pilota (domanda 4).
- **Estasi e Sgommata (D110) si guardano, non si toccano:** cambiarle riapre gli starter.
- **Fase B:** un giro con riferimento e due bracci, più la ricerca di diagnosi prima e dopo. Tetto 3.600 s.

## 2. Gli slot che mancano e il conto

Confronto fra la griglia e `bozza.json` (slot letti dalle descrizioni delle 105 carte).

| Slot | Ruolo | Rarità | Stato in griglia | Proposta |
|---|---|---|---|---|
| GEN-04 | ITEMS | R | riprogettata (`BeggingMoney`) | entra |
| GEN-08 | DAMAGE | C | conservata (`SickeningBlow`) | entra |
| GEN-10 | OTHER | NC | conservata, 10 → 5 V (`BadEducation`) | entra |
| GEN-11 | DEFENSE | NC | riprogettata (`CantFeelAnything`) | entra, con D52 (1) |
| GEN-19 | DAMAGE | R | da inventare («Bottigliata») | **sostituita:** Mano lesta, DISRUPT, C |
| GEN-20 | DAMAGE | R | da inventare («Sedia in testa») | **sostituita:** Secondo fiato, RESOURCES, R |
| GEN-21 | OTHER | R | da inventare («Coccio di bottiglia») | entra |
| OGG-08 | OTHER | NC | bozza («Mezza minerale sgasata») | entra, con +5 A |
| OGG-16 | RESOURCES | R | da inventare («Grappa della casa») | **esce** |

**Conto.** Oggi 112: 7 personaggi, 7 basic, 21 bound, 4 last resort, 43 d'archetipo (con CES-AR7), 16 generiche, 14 oggetti. Con tutti e 9 gli slot sarebbero 121, perché CES-AR7 è nata fuori dal conto (D121). Proposta: **112 + 8 = 120**, cioè 7 + 7 + 21 + 4 + 43 + 23 + 15.

**Rarità.** La bozza oggi ha 42 C / 55 NC / 15 R. Le 8 aggiunte portano a **44 C / 58 NC / 18 R**. La tabella «per rarità» della griglia (45 / 55 / 20) è ferma in tre punti: Duccio a 2 C / 3 NC / 1 R, CES-AR7, e Sergio che in bozza ha 1 C / 4 NC / 1 R e non 2 / 3 / 1 (archetipo 9 / 27 / 7). La Fase B la riscrive dalla bozza. Le due rare in meno sono Grappa e lo slot di Bottigliata, che passa a comune.

**Perché esce Grappa.** «+25 L; −5 A» è Amaro (OGG-05, +20 L; −5 A) con cinque punti in più, e la sola ragione scritta era pagare Bottigliata. Fuori da Piera la L serve soprattutto a Estasi: 18 + 25 = 43 HIT senza costo.

## 3. Le carte

Prezzi: una carta gratis vale circa 7 HIT; F1 12–13; F2 18–20; F3 24–29 ([listino](listino.md), D33). Il tetto D33/D36 riguarda le bound: nessuna bound cambia, quindi qui non si applica. Nessuna generica annulla mosse né costa HEALTH (decisione 5 della griglia).

| Slot | Nome di lavoro | Costo, pr. | Effetto | Prezzo | Forma | Perché serve |
|---|---|---|---|---|---|---|
| GEN-04 | Elemosina molesta | 10 A, 0 | Copia vicino a sé un oggetto casuale del bersaglio | F1; dipende dall'oggetto | Java (classe esistente, riprogettata) | Unica copia del set; risposta a chi vive di oggetti (Beppe) |
| GEN-08 | Colpo allo stomaco | 15 V, 1 | 10 HIT; +10 T al bersaglio | 10 + 7–15 su chi non è immune; F3 | dati | Dà T a chi non è Celestina; premia chi non sa pulirsi |
| GEN-10 | Maleducazione | 5 V, 1 | Toglie gli equip al bersaglio; 8 HIT | 8 + condizionato; F1 | Java (classe esistente) | Unica risposta agli equip, che ora hanno una generica in più |
| GEN-11 | Non sento niente | 10 V, 2 | HIT ricevuto ×0,35 in questo turno; **+5 A a sé** | F2 | dati | Seconda parata generica (D117: «forse poche parate»); il +5 A è il guadagno di D52 (1) |
| GEN-19 | **Mano lesta** | gratis, 1 | −5 A al bersaglio; +5 A a sé | ≈ 6 (≈ 10 per Mara); F0 | dati | D117: anticipa una risorsa togliendola all'altro. A è l'unica che hanno tutti e sposta le parità |
| GEN-20 | **Secondo fiato** | gratis, 0 | +15 HEALTH a sé; HIT e CUT ricevuti ×1,25 per 2 turni | 17 meno ≈ 10 di malus; F0 | dati | D124. Cura col rischio: picco contro chi non picchia, in linea contro gli altri |
| GEN-21 | Coccio di bottiglia | 5 V, 1 | Equip: il prossimo HIT inflitto ×1,5 e convertito in CUT, uso singolo | F1 | dati (`equip`, `singleUse`, `convertTo`) | Porta fuori da Piera l'effetto del token; aggira le parate contro HIT |
| OGG-08 | Mezza minerale sgasata | oggetto | Azzera la propria L; **+5 A** | ≈ 3 più il contesto | dati | Pulizia della L; il +5 A la rende utile anche senza L addosso |

**D124, Secondo fiato.** Diventa una carta. Rispetto al testo di Duccio il malus copre anche il CUT: col solo HIT la cura era piena e gratuita contro Mara. Contro il veleno il malus resta nullo, e si guarda (rischio 5). Prende lo slot di «Sedia in testa», che era GEN-07 (20 V: 30 HIT e pulizia) con un difetto e una rarità in più.

**D117, rubare risorse.** Diventa una carta sola, Mano lesta. Togliere V all'avversario esiste già (Sgambetto, GEN-23). T e L non si rubano: all'avversario le azzerano già GEN-07 e Acqua in faccia, e prenderle su di sé è un danno per chi non le spende. Prende lo slot di «Bottigliata», che chiedeva V e L insieme: nessun personaggio parte con entrambe.

**D117, oggetti col malus in campo.** Non diventa una carta in questo blocco. Motivi:

1. Oggi un oggetto non fa nulla finché non è consumato (R02). Un effetto «finché è vicino a te» è una regola nuova (RP-27), codice del motore a fine turno, lettura dei bot con le prove di fedeltà e, più avanti, il client.
2. I bot euristici non sanno quando conviene tenere, vendere o passare un oggetto così: la misura direbbe poco (D93).
3. SB-20 è la prima misura del set intero: una meccanica nuova appena prima la rende più difficile da leggere.
4. Sergio ha già un motivo per vendere (CES-AR7 vale per ogni oggetto).

Idea pilota, scritta per non perderla: **«Conto del tavolo sei»**, oggetto. In campo: a fine turno −3 A a chi lo ha. Consumato: +15 V. Sergio lo rivende, Scatto Repentino (GEN-03) lo passa all'avversario. Se il proprietario lo vuole ora, vedi domanda 4.

**D117, parate.** Con GEN-11 le parate generiche sono due (Tartaruga e Non sento niente), più la difesa di ogni archetipo. Non ne propongo una terza: il listino dice che le parate deboli sono trappole per i bot, quindi il giudizio vero è della prova del proprietario.

## 4. Rischi di combo (D110) e come li guarda il giro

| # | Rischio | Come si guarda |
|---|---|---|
| 1 | **Estasi (PIN-AR2)** fuori da Piera: 18 gratis, 38 con un Amaro | Nessuna aggiunta dà L (per questo escono Grappa e Bottigliata). Ricerca prima e dopo: quante volte ricorre |
| 2 | **Sgommata** (15 A: 25 CUT) con Mano lesta: A gratis a chi paga in A | Mazzo di Mara con Mano lesta ×2; braccio prudente a ±4 A |
| 3 | **Equip impilati:** Coccio ×1,5, Posacenere ×1,5, Guanti ×1,25 sullo stesso colpo (30 HIT → 84 se si moltiplicano) | Passo 0: si legge nel codice come si combinano; mazzo di Beppe e di Spazienzio con tutti e tre; GEN-10 è la risposta |
| 4 | **Oggetti:** GEN-04 copia Mescolone, Santino o un equip | Mazzo con GEN-04 ×2 contro Beppe e Celestina |
| 5 | **Cure:** Secondo fiato con Kebab, Ghiaccio e Fasciatura allunga le partite; a Duccio rimborsa i costi in HEALTH; contro Celestina non ha malus | Durata ≤ 12 turni; mazzo di Duccio con Secondo fiato ×2; riga di Celestina |
| 6 | **T fuori da Celestina** (GEN-08 con Sputo): valore non lineare, i bot non lo vedono | Si riporta il dato e si segnala per la prova del proprietario |
| 7 | **Pulizia gratis** (OGG-08 con Ghiaccio e Due dita in gola) contro Piera e Celestina | Righe di Piera e Celestina contro i mazzi con le pulizie |
| 8 | **Carte d'archetipo fuori dal personaggio** | La ricerca costruisce mazzi liberi: elenco delle ricorrenti, prima e dopo |

## 5. Fase B

**Passo 0, senza misure.** Carte in una copia della bozza; lettura del codice per il rischio 3 e per capire se GEN-04 e GEN-10 chiedono lettura nuova ai bot. Si scrivono, prima di misurare, i sette **mazzi con le aggiunte**: ogni mazzo di riferimento (cinque starter, `prova-sergio`, `prova-duccio`) con al più 6 carte cambiate, ogni carta nuova in almeno due mazzi, 2 copie, al posto di carte dello stesso ruolo.

**Giro.** Stessi semi, 12 stili, 144 celle, 100 semi per cella; fattibilità a 4 semi prima.

| Braccio | Cosa misura |
|---|---|
| Rif | I 7 mazzi di riferimento fra loro, col pool allargato |
| A1 | I 7 mazzi con le aggiunte contro i 7 di riferimento, valori della proposta |
| A2 | Come A1, prudente: Secondo fiato +12 HEALTH, Mano lesta ±4 A |

**Ricerca di diagnosi.** La stessa della A2 di SB-17, sui sette personaggi, due lanci cogli stessi semi: bozza di oggi e bozza con le aggiunte.

**Criteri, scritti ora.**

1. **Gli starter non peggiorano:** Rif è identico, numero per numero, alla stessa misura sulla bozza di oggi (le carte fuori dai mazzi non cambiano le partite). Una differenza è uno STOP.
2. **Le aggiunte non scavalcano gli starter:** ogni mazzo con le aggiunte guadagna in media al più 5 punti sul suo riferimento e al più 10 in un singolo confronto; nessun confronto esce dalla fascia 35–65% di D95 se il riferimento ci stava.
3. Patte ≤ 10%, durata ≤ 12 turni fuori dagli specchi, invarianti a zero.
4. La ricerca **non è un cancello** (D110). Si segnala al proprietario una carta nuova nei mazzi vincenti di almeno 5 personaggi su 7, o un massimo contro gli starter più alto di 3 punti rispetto al «prima».

**Regola di scelta, scritta ora.** Entra A1 se passa 1–3. Se no, la carta responsabile (isolata con un mazzo che cambia solo quella) prende il valore di A2. **Riserve:** R1, il valore prudente carta per carta; R2, la carta esce e il set scende sotto 120, mai sotto 110. Nessuna soglia si sposta.

**Budget.** 3.600 s in tutto, fissati ora: 1.200 s per il giro e i mazzi d'isolamento, 2.400 s per i due lanci della ricerca (la A2 di SB-17 ne usò 629 con cinque personaggi). A budget finito, STOP.

**Verifiche** ([tabella](../../aree-protette.md)). Sempre: `git diff --check`, `python scripts/check-links.py`, `python scripts/check-rules.py`, `./scripts/build.ps1 -Task Test -Offline`. Carte in dati: `git diff --stat` dal commit di misura. GEN-04 e GEN-10 sono codice che la misura esegue: passo 0 d'identità e condizioni della deroga sui pacchetti `sim` e `cards/base`. Se i bot ricevono logica nuova: prove di fedeltà, 3–8 mutazioni, identità viva, `TestServerContext` e manifest. In chiusura: `genera-bozza-di-riferimento.py --verifica`, controllo delle rarità, griglia aggiornata (conto, rarità, tabelle di controllo), `./scripts/build.ps1 -Task Server -Offline` prima della prova del proprietario.

## 6. Domande al proprietario

1. **Il set chiude a 120 con CES-AR7 dentro e senza Grappa (OGG-16)?** *Raccomandazione: sì. Grappa è un doppione di Amaro e alimenta Estasi.*
2. **Secondo fiato generica rara al posto di «Sedia in testa», col malus su HIT e CUT?** *Raccomandazione: sì. L'alternativa è lasciarla fuori e tenere Sedia in testa, che però è una GEN-07 peggiore.*
3. **Mano lesta (gratis, ±5 A) al posto di «Bottigliata», come unica carta che ruba risorse?** *Raccomandazione: sì. Il rischio è Mara; lo misura il braccio prudente.*
4. **L'oggetto col malus in campo resta fuori da SB-19?** *Raccomandazione: sì, si riprende dopo SB-20 con l'idea pilota. Se lo vuoi ora: prende lo slot OGG-16, esce Coccio di bottiglia per restare a 120, e serve una Fase B2 con regola RP-27, motore, bot e identità viva, con un budget suo.*
5. **Estasi e Sgommata in SB-19 si misurano soltanto, e l'eventuale correzione si propone in SB-20?** *Raccomandazione: sì. Sono carte d'archetipo già dentro gli starter: toccarle qui rimette in discussione il criterio «gli starter non peggiorano».*

STOP: la Fase B parte dopo le risposte.
