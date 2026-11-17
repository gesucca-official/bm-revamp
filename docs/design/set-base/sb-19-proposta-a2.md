# SB-19 — Oggetti col malus in campo e Fase B riscritta (Fase A2)

**Versione 0.1 — 17 novembre 2026.** Seconda proposta di [SB-19](../../set-base-plan.md#sb-19--resto-del-pool-e-giro-di-blocco), chiesta da D129 nel [registro](../../set-base-decisioni.md#decisioni-del-proprietario) (con D117, D124, D110, D95). Parte dalla [proposta della Fase A](sb-19-proposta.md), che resta valida per le 9 carte, i rischi 1–8 e i criteri. Riferimenti: [regole d50](regole-playground.md) 1.4, [listino](listino.md), [griglia](griglia.md), `bozza.json`, [aree protette](../../aree-protette.md), codice letto (`Game`, `Character`, `DataCards`, `Draft`, `BotView`, `StyleSupport`, `ViewTable`, `TurnForecast`, client web). **Niente misure:** i numeri sono prezzi del listino e stime.

## 1. In breve

- **Regola nuova RP-27:** un oggetto può avere un effetto «In campo», che agisce a fine turno su chi lo ha vicino in quel momento. Non è un danno e non tocca mai HEALTH.
- **Due oggetti:** «Conto del tavolo sei» (idea pilota: tassa su A, ricavo in V) e «Sigaretta accesa» (dà T: carburante per Celestina, peso per gli altri).
- **Il set va a 123:** 44 C / 59 NC / 20 R.
- **Forma:** un campo facoltativo `inPlay` nelle bozze; poche righe di motore dietro `d50`. Con le regole vive nulla cambia.
- **Bot:** le letture nuove valgono zero se nessun oggetto in campo ha il malus, così il riferimento resta identico.
- **Client:** una pillola sulla faccia dell'oggetto. Testo e registro del turno ci sono già.
- **Fase B in due:** B1 (le 9 carte, dati) e poi B2 (meccanica, codice, client, prova del proprietario).

## 2. La regola (testo per `regole-playground.md` 1.5, sezione 10)

| # | Regola | Fonti |
|---|---|---|
| RP-27 | **Un oggetto può avere un effetto «In campo».** È scritto sulla carta e deroga a R02 (un oggetto non fa nulla finché non è consumato) solo per quell'effetto (R00). **Agisce a fine turno su chi ha l'oggetto vicino a sé in quel momento,** dopo gli altri suoi effetti periodici (veleno di T, effetto di L, timer, scadenza degli stati), un oggetto alla volta dal più vecchio. **Conta dove l'oggetto è, non da dove viene:** rubato, scambiato o copiato, colpisce chi lo ha ora; agisce anche nel turno in cui arriva. **Fuori dal campo non agisce:** consumato, venduto (RP-25: la vendita non dà nemmeno questo effetto), distrutto o scalzato dalla capacità (R02) prima della fine del turno, niente. Chi è eliminato non ha effetti periodici (R06). **Non è un danno:** è una perdita o un guadagno di risorsa, che stati, equip e parate non cambiano. Vale il pavimento a zero (RP-4): su una risorsa a zero non costa nulla. **Non tocca mai HEALTH,** quindi da solo non elimina nessuno. La T che dà avvelena dal turno dopo; a chi è immune resta la risorsa senza il veleno. | D117, D129 |
| RP-28 | **Il formato.** Campo facoltativo `inPlay` di una carta `ITEM`: uno o due passi `lose` (A o V) o `gain` (T o L), quantità fissa. Il caricatore rifiuta il campo fuori dagli oggetti, ogni altro passo, HEALTH e le quantità variabili; chiede il testo breve `gui.inPlay` quando il campo c'è. Le bozze senza il campo si caricano come prima. Il registro del turno scrive una riga per oggetto, `(Nome) RISORSA: prima->dopo (differenza)`. | D129 |

Conseguenze da sapere:

- **Almeno un turno si paga.** L'oggetto arriva quando si pesca, dopo la propria mossa: il primo malus scatta subito. Fa eccezione l'oggetto in campo dalla distribuzione iniziale, se si consuma al primo turno. Un turno di grazia chiederebbe di ricordare quando è arrivato: non lo propongo (domanda 1).
- **Per toglierselo:** consumarlo con la basic (ogni personaggio ne ha una, e costa l'azione del turno), venderlo (Sergio), passarlo con Scatto Repentino (GEN-03), o farlo scalzare dal prossimo oggetto pescato.
- **La capacità lavora in due versi.** Un oggetto col malus può scalzare un oggetto buono. Spazienzio ha capacità 1: perde l'oggetto che aveva, ma il prossimo che pesca gli toglie il malus.
- **Rubarlo (GEN-02) o copiarlo (GEN-04) fa male a chi lo prende:** è anche una difesa dai furti.

## 3. I due oggetti

Pesi del listino (D33): V 0,75; A 0,5; T 0,15 per chi è immune, 0,69–1,46 HIT per punto per gli altri. Una carta gratis vale circa 7.

| Slot | Nome di lavoro | Rarità | In campo, a fine turno | Consumato | Prezzo |
|---|---|---|---|---|---|
| OGG-17 | **Conto del tavolo sei** | NC | −3 A | +15 V | 11,25 meno 1,5 per turno: circa 8 con due turni |
| OGG-18 | **Sigaretta accesa** | R | +2 T | +10 A | Immune: 5 più 0,3 per turno. Altri: 5 meno 1,4–2,9 per turno |

**Conto del tavolo sei** è l'idea pilota, tenuta coi suoi numeri. È un investimento: la tassa la pagano tutti (A ce l'hanno tutti e decide le precedenze), il ricavo serve solo a chi spende V.

- **Lo tiene** chi usa V (Spazienzio, Beppe, Sergio): lo consuma appena può.
- **Lo vende** Sergio se gli serve salute: +8 HEALTH.
- **Lo passa** chi non usa V. A Mara costa caro: la sua basic per consumarlo chiede altri 5 A.

**Sigaretta accesa** è l'opposto: il consumo vale poco, conta dove sta.

- **La tiene** Celestina: in sei turni dà la T di una Pasticca senza spendere l'azione.
- **La vende** Sergio; **la consuma in fretta** chiunque altro (la T presa resta).
- **La passa** chi ha Scatto Repentino: per l'avversario è un veleno lento che chiede un'azione per fermarsi.

Scartati: un malus che dà L (alimenta Estasi, rischio 1, ora che Grappa resta); un malus su V (gratis per chi non ha V). Un malus su HEALTH è l'alternativa alla Sigaretta (domanda 2): più leggibile, ma chiede una regola «non uccide», cambia i conti del colpo finale e la previsione dei bot.

Rischi nuovi, in coda a quelli della [Fase A](sb-19-proposta.md#4-rischi-di-combo-d110-e-come-li-guarda-il-giro):

| # | Rischio | Come si guarda |
|---|---|---|
| 9 | **T a chi non si pulisce** (Sigaretta con Scatto Repentino, specie in mano a Celestina). D95: «i danni da tossicità sono un problema per chi non può rimuoversela» | Mazzo di Celestina con Sigaretta ×2 e Scatto ×2; braccio prudente a +1 T; T accumulata dagli altri nel rapporto |
| 10 | **A a zero** (Conto con Mano lesta): precedenze perse, Mara ferma | Mazzo con Conto ×2, Mano lesta ×2 e Scatto ×2 contro Mara |
| 11 | **I bot non sanno tenere o passare** un oggetto così: la misura dice poco (D93) | Il giudizio è della prova del proprietario; il rapporto conta quante volte l'oggetto è consumato, venduto, passato, scalzato |

## 4. La forma

**Dati.** Esempio, nel formato di oggi più i due campi nuovi:

```json
{"binding": "base.items.ContoDelTavoloSei", "rarity": "UNCOMMON", "kind": "ITEM",
 "inPlay": [{"op": "lose", "resource": "ALERTNESS", "amount": 3}],
 "self": [{"op": "gain", "resource": "VIOLENCE", "amount": 15}],
 "gui": {"name": "Conto del tavolo sei",
         "description": "OGG-17 · In campo: a fine turno −3 A. Consumato: +15 V.",
         "inPlay": "−3 A", "role": "RESOURCES", "gains": "+15 V", "damage": "—", "damageAmount": "—"}}
```

**Codice.**

- `Draft` e `DataCards` (pacchetto `sim`, deroga del playground): leggono e controllano `inPlay` (RP-28).
- `Card` e `PrintedEffects` (`model`): l'effetto in campo è una lista **separata** dal testo del consumo, vuota per ogni carta di oggi. Chi legge il consumo non cambia.
- `Character.resolveTimeBasedEffects` (`model`): dopo la scadenza degli stati, solo con `ruleset.playground()`, applica gli effetti degli oggetti in campo e scrive le righe.
- Vista: il campo nuovo della carta si serializza solo se c'è, così le viste vive restano uguali byte per byte.

**Identità viva.** Nessuna carta viva ha l'effetto e il ramo è dietro `d50`: con `1.13` nulla cambia. Lo provano l'identità viva, `TestServerContext` e i manifest delle partite.

## 5. I bot

**Vincolo:** ogni lettura nuova è una correzione che vale zero quando nessun oggetto in campo ha il malus. Il riferimento della B1 deve uscire identico col codice nuovo.

| Dove | Oggi | Cambia |
|---|---|---|
| `BotView` | `CardSeen` porta il testo del consumo | Porta anche l'effetto in campo (pubblico, come l'oggetto) |
| `StyleSupport.itemWorth` | Valore del consumo | Meno il malus di due turni, visto da chi tiene l'oggetto: la T pesa 1 per chi non è immune, +0,15 per chi lo è |
| Vendita (`sellChoice`) | Vende il meno prezioso | Nessun codice: l'oggetto col malus diventa il meno prezioso |
| Consumo | Somma i guadagni dell'oggetto | Più il malus evitato nel prossimo turno |
| Furto (GEN-02) | Premio fisso per ogni oggetto lontano | Meno il malus dell'oggetto preso: un bot non ruba il Conto, Celestina ruba la Sigaretta |
| Scatto Repentino | 3 × differenza nel numero di oggetti | Più il malus che si cede, meno quello che si riceve. Senza la correzione un bot scambierebbe per prendersi i malus |
| `ViewTable.endOfTurn` | Veleno, L, scadenze | Applica gli effetti in campo, in coda |
| `TurnForecast` | Prevede HEALTH a fine turno | **Nessun cambio:** il malus non tocca HEALTH e la T arriva dopo il veleno |

**Prove di fedeltà.** `ViewTableFidelityTest` e `TurnForecastFidelityTest` prendono un braccio in più, con mazzi che hanno i due oggetti, Scatto Repentino, furto e «Lo rivendo». Contatori nuovi, con una soglia minima: turni verificati con un oggetto col malus in campo, malus applicati, oggetti col malus che cambiano campo. Mutazioni (3–8), per esempio: malus tolto dal motore; applicato prima del veleno; lasciato a chi aveva l'oggetto prima dello scambio; applicato anche all'oggetto venduto.

## 6. Il client, minimo per la prova

- **C'è già:** il pannello (i) mostra la descrizione, quindi «In campo: a fine turno −3 A. Consumato: +15 V.». La riga di fine turno, scritta nel formato di RP-28, si anima come ogni variazione di risorsa e compare in «Ultimo turno». Da controllare nel passo 0 che il nome dell'oggetto si legga.
- **Da fare:** una pillola del malus sulla faccia dell'oggetto in campo, disegnata come i guadagni (numero e simbolo della risorsa, mai la lettera) ma col colore dei costi, dal campo nuovo della carta. Un tipo in `contracts.ts`, poche righe in `scene.ts`; `VerifyLayout` deve conoscere il segno nuovo.
- **Non si fa ora:** icone, animazione dedicata, avvisi su chi sta per pagare.

## 7. La Fase B riscritta

**Il conto.** 112 oggi, più le 9 di D129 (GEN-04, 08, 10, 11, 19, 20, 21; OGG-08, OGG-16 Grappa), più OGG-17 e OGG-18: **123**, cioè 7 + 7 + 21 + 4 + 43 + 23 + 18. Rarità: **44 C / 59 NC / 20 R** (oggi 42 / 55 / 15). Le rare passano dal 13% al 16%.

**Conviene dividerla, B1 prima.** La B1 è dati e due classi Java che esistono: fissa i numeri di riferimento. La B2 cambia motore e bot: il suo primo cancello è ritrovare quei numeri identici. Insieme, un rosso non direbbe se viene dalle carte o dal codice.

**B1, le 9 carte.** Come il [§ 5 della Fase A](sb-19-proposta.md#5-fase-b), con tre cambi:

- entra Grappa: nel mazzo di Piera con le aggiunte e in un mazzo d'isolamento del rischio 1 (uno starter senza L con Estasi ×2 e Grappa ×2);
- la ricerca di diagnosi si lancia solo «prima»; il «dopo» si fa una volta, alla fine della B2, sul set intero;
- criteri 1–4, regola di scelta e riserve restano quelli scritti. Budget **2.400 s** (1.200 giro e isolamenti, 1.200 ricerca).

**B2, meccanica e due oggetti.** In ordine:

1. `regole-playground.md` 1.5 con RP-27 e RP-28, prima del codice.
2. Motore, caricatore, bot, prove di fedeltà e mutazioni. Cancello: il riferimento della B1 identico numero per numero, e identità viva.
3. I due oggetti in bozza. Mazzi scritti prima di misurare, ognuno un mazzo della B1 con al più 4 carte cambiate: Conto ×2 in Spazienzio, Beppe e Sergio; Sigaretta ×2 in Celestina e Sergio; i due mazzi dei rischi 9 e 10.
4. Giro, stessi semi e stesse celle della B1:

| Braccio | Cosa misura |
|---|---|
| Rif | I 7 mazzi scelti in B1 fra loro, col codice nuovo |
| M1 | I mazzi con gli oggetti contro i 7, valori della proposta |
| M2 | Come M1, prudente: Conto +12 V, Sigaretta +1 T |

5. Ricerca di diagnosi «dopo», sul set a 123.
6. Client, jar ricostruito, prova del proprietario.

**Criteri della B2, scritti ora.**

1. **Gli starter non peggiorano (D95):** Rif identico alla B1. Una differenza è uno STOP.
2. Ogni mazzo con gli oggetti guadagna in media al più 5 punti e al più 10 in un confronto; nessun confronto esce dal 35–65% se il riferimento ci stava. Vale anche per i mazzi dei rischi 9 e 10 contro gli starter.
3. Patte ≤ 10%, durata ≤ 12 turni fuori dagli specchi, invarianti a zero.
4. Ricerca: non è un cancello (D110); stesse segnalazioni della Fase A.
5. Si riporta, senza soglia: turni in campo per oggetto, come esce (consumato, venduto, passato, scalzato), T accumulata da chi non è immune.

**Scelta e riserve.** Entra M1 se passa 1–3; se no l'oggetto responsabile prende il valore di M2 (R1); se non basta esce (R2) e il set scende a 122 o 121. Se escono tutti e due, STOP: la regola resta scritta senza carte e decide il proprietario. Nessuna soglia si sposta.

**Budget della B2.** **2.400 s:** 1.200 per giro e isolamenti, 1.200 per la ricerca. In tutto 4.800 s contro i 3.600 della Fase A. A budget finito, STOP.

**Verifiche** ([tabella](../../aree-protette.md)).

- Sempre: `git diff --check`, `python scripts/check-links.py`, `python scripts/check-rules.py`, `./scripts/build.ps1 -Task Test -Offline`.
- B1: come nella Fase A (carte in dati, GEN-04 e GEN-10 con passo 0 d'identità e condizioni della deroga).
- B2, partita viva (`model` non è nella deroga): identità viva, `TestServerContext`, manifest delle partite.
- B2, playground: passo 0 d'identità, le due prove di fedeltà coi contatori nuovi, 3–8 mutazioni.
- B2, client: `Test`, `Build`, `Size`, `Verify`, `VerifyResolution`, `VerifyLayout`, dopo `./scripts/build.ps1 -Task Server -Offline`.
- In chiusura: `genera-bozza-di-riferimento.py --verifica`, rarità, griglia aggiornata (OGG-17, OGG-18, conto a 123).

## 8. Domande al proprietario

1. **RP-27 va bene così: a fine turno, su chi ha l'oggetto in quel momento, anche nel turno in cui arriva, mai su HEALTH?** *Raccomandazione: sì. Senza turno di grazia la regola non ha memoria e si spiega in una riga; senza HEALTH un oggetto non uccide e i bot non cambiano previsione.*
2. **Il secondo oggetto è «Sigaretta accesa» (+2 T a fine turno), o preferisci un malus su HEALTH?** *Raccomandazione: Sigaretta, col braccio prudente a +1 T. È l'unico malus che qualcuno vuole (Celestina), quindi i due oggetti sono davvero diversi. Va contro la tua nota di D95 sulla tossicità: per questo c'è il rischio 9 e la prova è tua.*
3. **Numeri e rarità: Conto NC (−3 A, +15 V), Sigaretta R (+2 T, +10 A), set a 123 con 20 rare?** *Raccomandazione: sì. Se 20 rare sono troppe, la Sigaretta scende a NC.*
4. **Fase B in due, B1 poi B2, con 2.400 s ciascuna e la ricerca «dopo» una volta sola alla fine?** *Raccomandazione: sì. Costa 1.200 s in più della Fase A e un passaggio in più, ma separa le carte dal codice.*
5. **Per la tua prova basta la pillola sulla faccia dell'oggetto, più testo e registro che ci sono già?** *Raccomandazione: sì. Proverei Sergio (vende) e Celestina (tiene) contro un bot con Scatto Repentino.*

**STOP: la Fase B parte dopo le risposte.**
