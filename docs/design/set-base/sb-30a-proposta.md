# SB-30a — Facile e Normale nella partita contro computer: proposta di Fase A

**Versione 0.1 — 26 novembre 2026. Motivazione: dopo SB-28 il proprietario ha trovato che i computer della quick «sembrano stupidi» ([D187](../../set-base-decisioni.md#decisioni-del-proprietario)). Il computer della partita viva gioca ancora la politica casuale scritta per il catalogo 0.1. I livelli sono decisi in [D85](../../set-base-decisioni.md#decisioni-del-proprietario): qui si propone come collegare Facile e Normale alla partita viva, come si sceglie il livello e come si prova che il computer non vede ciò che è nascosto. Fase A con STOP: solo questo documento. Nessun cambio a codice, test, regole o catalogo.**

Fonti: [piano, SB-30](../../set-base-plan.md#sb-30--bot-nelle-partite-contro-computer); D76, D77, D85, D91, D94, D187, D190; [proposta dei livelli](bot-livelli-proposta.md); [progetto SB-30b](sb-30b-progetto.md) e rapporti [B5a](../../reports/set-base/sb-30b-b5a-report.md) e [B5b](../../reports/set-base/sb-30b-b5b-report.md); [regolamento](../../game-rules.md) 2.1 (R01, R03, R07b, R08); [Set Base](../../sets/base.md) 1.0.1; [aree protette](../../aree-protette.md); il codice citato sotto, al commit `2111050`.

## Esito in breve

- Il computer della partita viva è ancora il `ComPlayer` casuale. Il bot Normale (`LethalAwarePolicy` attorno a uno stile) **è già pronto per le regole vive**: dopo SB-28 `Ruleset.LIVE` è `d50`, quindi il cancello `playground()` che lo spegneva oggi è aperto. Manca solo il collegamento: fabbrica, livello nel protocollo, client e archivio.
- Sul Set Base 1.0.1 la previsione del turno coincide col motore in **tutti** i turni confrontati (37.240 su 37.240, sei bracci), e regge le meccaniche nuove (Annuncia con due nomi, Vulnerabile, Rincara, Gioca d'anticipo, In campo, Vendi, ultima copia). Non vede invece i **timer** (3 carte), **4 carte Java senza testo stampato** e i **colpi mostrati da più avversari insieme** in FFA (§2).
- Misura fuori dal repository sul set vivo (7.000 partite): **Normale batte Facile nel 89–92%** delle partite decise, secondo lo stile. Facile e computer di oggi si equivalgono (51,6%). Una decisione del Normale costa 0,05 ms di mediana e 0,16 ms al P99.
- Raccomandazioni: livello scelto in quick e open contro computer, Normale di default nel client; Facile se la richiesta non dice il livello (come D190 (2)); computer della FFA a Normale; stile legato al personaggio; regolamento **2.2**. Otto domande in §8.

## 1. Stato di oggi

**Quale politica.** `ComPlayer.chooseMove(Game)` (`model/game/ComPlayer.java`): mescola la mano, prova le carte dall'ultima e gioca la prima mossa valida. Sceglie a caso il bersaglio fra gli avversari, l'oggetto e lo scarto della bound. Il commento nel codice dice ancora «for now this fabulous AI is just random choices». Non guarda salute, colpi mostrati, gettoni o ricerche, e non sceglie mai il nome di un «Annuncia X o Y»: vale allora il primo nome stampato che ha una copia nel mazzo (R03).

**Dove si sceglie.** In un solo posto: `PlayerFactoryServiceImpl.craftRandomComPlayer(category)` restituisce sempre `new ComPlayer(...)`. La chiamano i tre ingressi di `GameFactoryServiceImpl`:

| Ingresso STOMP | Metodo | Computer |
|---|---|---|
| `/app/game/quick/1vCom/join` (header `category`) | `craftQuick1vComGame` | uno, starter della categoria dell'umano (D190) |
| `/app/game/open/1vCom/join/{user}/{deck}` | `craftOpen1vComGame` | uno, starter qualunque |
| `/app/game/quick/ffa/join/com`, poi avvio | `craftQuickMultiPlayerGame` | uno per ogni «aggiungi computer», starter qualunque |

`BotPlayer` (sottoclasse di `ComPlayer`) esiste in produzione, ma lo crea solo il profilo di sviluppo `bozza` (`BozzaPlayerFactory`, uno stile per tutto il server).

**Cosa vede.** Oggi `ComPlayer` riceve l'intero oggetto `Game`. Per come è scritto usa solo la propria mano, gli oggetti degli avversari e `Move.isValidFor(game)`: non bara, ma lo si sa leggendo il codice, non da una prova. `BotPlayer` invece decide da `BotView.of(game, playerId)`, una copia dei soli dati pubblici: la propria mano (con le copie trovate e mostrate), risorse, oggetti, stati, gettoni e timer di tutti, le carte mostrate degli avversari, le mosse del turno precedente e le regole. Ne sono fuori la mano coperta degli altri, l'ordine dei mazzi e le mosse in attesa. Unico dato del motore letto oltre il tavolo: per «Annuncia X o Y», `BotView.searchable` guarda **quali nomi del proprio mazzo** hanno ancora una copia. È lecito, perché la lista del proprio mazzo è nota e le carte uscite sono pubbliche (R03 fa la stessa domanda all'umano), ma va detto nel regolamento.

**Quando e quanto veloce.** `Game.isReadyToResolveMoves()` chiama `autoSubmitComPlayersMove()`, in modo sincrono, sul percorso dell'invio della mossa umana: il computer decide quando la partita controlla se ha tutte le mosse. Il `ComPlayer` casuale non è misurato: prova al più cinque carte, quindi microsecondi. Contro computer non c'è timeout (R06).

**Archivio.** `MatchArchiveService.botPolicy` scrive nell'evento `INITIAL` un solo campo `botPolicy`: `"random"`, oppure il nome della politica del **primo** `BotPlayer`. In FFA con più computer non basta. `MatchSnapshot` segna `controller: computer`.

**Riconoscimento del computer nel client.** Al rientro, `client-web/src/session.ts` ricava la modalità dal prefisso `ComPlayer_` degli id: il computer nuovo deve tenere quel prefisso.

## 2. Distanza da D85

### Cosa serve a Facile e Normale nella partita viva

1. Un **livello** (`FACILE`, `NORMALE`; `DIFFICILE` e `MAESTRO` riservati e non esposti) e una **fabbrica per giocatore**: `policyFor(level, character)` restituisce un'istanza nuova per ogni computer. Questo serve già ora, perché il Difficile di SB-30b ha un catalogo non serializzabile e il Maestro ha memoria (progetto SB-30b §2.5): con una fabbrica entrano dopo senza cambiare firma.
2. `craftComPlayer(category, level)` al posto di `craftRandomComPlayer(category)`, che crea un `BotPlayer` con id `ComPlayer_nnnn`.
3. Il livello nel protocollo (header STOMP `level`), in `client-web`, in `client-debug`, nella CLI, in `docs/api.md` e nell'archivio.
4. **Facile** = `RandomPolicy` sulla `BotView`. **Normale** = `LethalAwarePolicy(SoughtHitPolicy(stile, ALWAYS))`, la stessa catena di `BozzaDraft.newPolicy()` e di tutte le misure del Set Base (D74, D76, D77).
5. La prova «nessuna informazione nascosta» sul percorso vivo (§5).

### `LethalAwarePolicy` regge il regolamento 2.1 e il Set Base 1.0.1?

**Prove eseguite** (dichiarate, sola lettura, a `2111050`):

- `mvn -o test -Dtest=TurnForecastFidelityTest,LethalAwarePolicyTest,Sb16iBotsTest,InPlayBotsTest`: verde in 29 s, 30 test. Fedeltà della previsione al motore, turno per turno, sulla bozza 1.7 (quella da cui il generatore ricava `sets/base.json`, togliendo solo i mazzi di prova) e sui bracci storici: 1.6 **5.078/5.078**, sergio **6.188/6.188**, duccio **7.024/7.024**, malus (In campo) **7.888/7.888**, A 5.526/5.526, B 5.536/5.536. I turni con un timer sono esclusi per costruzione: 56, 125, 26, 101, 72 e 73.
- Misura fuori dal repository (classi nello scratchpad, compilate sul classpath di test, nessun file del repository toccato): `Sb30aBench`, set vivo `/sets/base.json`, `Ruleset.LIVE`, i cinque starter in tutte le 25 coppie, posti alternati, 20 semi per coppia e posto da 30.000.001, 1.000 partite per accoppiamento, un thread, Ryzen 9 5950X, JDK Zulu 11.0.29, 8,5 s in tutto. Uscita in `%TEMP%\claude\…\scratchpad\bench\bench-20.txt`.

| Accoppiamento (1.000 partite) | Vinte | Perse | Patte | % sulle decise |
|---|---|---|---|---|
| Normale/aggressivo – ComPlayer di oggi | 905 | 85 | 10 | 91,4 |
| Normale/aggressivo – Facile | 902 | 78 | 20 | 92,0 |
| Normale/prudente – ComPlayer | 887 | 92 | 21 | 90,6 |
| Normale/prudente – Facile | 862 | 105 | 33 | 89,1 |
| Normale/risorse – ComPlayer | 920 | 66 | 14 | 93,3 |
| Normale/risorse – Facile | 906 | 81 | 13 | 91,8 |
| Facile – ComPlayer | 495 | 464 | 41 | 51,6 |

La previsione restringe le mosse nell'**11,6%** delle 53.042 decisioni del Normale. Il 13 novembre, sulla bozza di allora, era il 4,6%: il Set Base 1.0 ha più colpi mostrati. Tempo di `choose()` del Normale, previsione compresa: mediana **0,048 ms**, P90 0,080, P99 0,159, massimo 20,96 ms (un caso isolato, probabilmente a JVM fredda: non indagato). Lo starter pesa poco: con Spazienzio il prudente vince l'80–82%, gli altri casi stanno fra l'89 e il 95%.

**Meccaniche capite** (con la prova che le copre):

| Meccanica | Dove | Prova |
|---|---|---|
| Annuncia a un nome, ricerca trovata o fallita come variante, gettone solo se trova | `TurnForecast`, `SoughtHitPolicy` | fedeltà, tutti i bracci |
| «Annuncia X o Y» (D94, R07b): il nome scelto fra quelli con una copia, il primo a parità | `BotView.searchChoice`, `LegalMove.search` | `Sb16iBotsTest`, braccio 1.6 |
| Vulnerabile: più gettoni, ×1,5 su HIT/CUT/POISON, bersaglio esposto preferito, gettone tenuto (Sergio) | `TurnForecast`, `SoughtHitPolicy.factor`, `StyleSupport` | braccio sergio (84 gettoni tenuti) |
| Ultima copia assente (D71), gettone che esce senza giocata | `TurnForecast` fine turno | fedeltà |
| Rincara: contatore pubblico | `StyleSupport.extraDamage`, `TurnForecast` | `Sb16iBotsTest`, fedeltà |
| Gioca d'anticipo: gruppi di velocità | `TurnForecast`, `StyleSupport.aheadChance` | fedeltà, `Sb16iBotsTest` |
| In campo, Vendi, immunità | `TurnForecast`, `StyleSupport.itemWorth` | braccio malus, `InPlayBotsTest` |
| Costi in HEALTH (Duccio), pavimento a zero, corazza L/4 | `TurnForecast` | braccio duccio |
| Token (Coccio di Bottiglia) | `PrintedEffects.consumedText` | `PrintedEffectsCompletionTest` |

**Lacune** (non rendono illegale nessuna mossa; tolgono solo previsione):

1. **Timer** (non stampati): *Mescolone Micidiale* (`com.items.MarvelousCocktail`), *Trascinare nel Tunnel* (`junkie.ToxicBloodDrain`), *Santino di San Briaco* (`base.items.SantinoDellaPortinaia`). La previsione non vede gli effetti a scadenza: un veleno da timer che porterebbe a terra il bot alla fine del turno non conta. Prova: i 26–125 turni esclusi per braccio nella fedeltà.
2. **Quattro carte Java senza testo stampato** (`PrintedEffects.Source` assente): *Furto con Destrezza* (`com.Steal`), *Disassemblare* (`bruiser.BreakYourToy`), *Ce l'Hai Due Spicci?* (`base.com.BeggingMoney`), *PERMESSO SCUSA PUOI SMETTERLA* (`bruiser.BadEducation`). Gli stili le leggono dal ruolo e dal danno nominale del catalogo, la previsione dal solo danno nominale. Per esempio non sa che *PERMESSO SCUSA* toglie gli equip prima del colpo. *Doppio Malto da Discount* ha il testo solo per la previsione (D111).
3. **FFA:** la previsione prova **un colpo mostrato alla volta** (`TurnForecast.of`, un `Threat` per caso). Due avversari che mostrano colpi pagabili non vengono sommati: in FFA il Normale può sentirsi al sicuro quando non lo è.
4. **La mano coperta non conta** (D77 (4)): voluto. È il «buco» che distingue il Normale dal Difficile.

Le lacune 1–3 si chiudono con testo stampato e test di fedeltà, cioè lavoro sui bot. Si propone di non farlo in SB-30a (domanda 7).

## 3. Effetto sulle regole

Serve il **regolamento 2.2** (minore: cambia chi gioca il computer, non come si risolve un turno). Il Set Base cambia solo se lo stile va nella scheda del personaggio (domanda 4). Bozza delle frasi, **non applicata**:

**R01**, al posto di «Open usa un mazzo salvato dell'umano, conforme a R02, e un bot casuale» e di «Le code possono includere bot»:
> Open usa un mazzo salvato dell'umano, conforme a R02, e un computer. Nella quick contro computer e nell'open l'umano sceglie il livello del computer (R03); i computer aggiunti alla FFA giocano a livello Normale. Le code possono includere computer.

**R03**, al posto della frase «Il bot prova carte e bersagli casuali e, se non trovasse mosse valide, passerebbe con mossa vuota: con mazzi conformi il caso non si presenta»:
> **Il computer (2.2).** Un giocatore del computer sceglie fra le mosse valide per questa regola, con le sole informazioni di un giocatore al suo posto (R08): la propria mano e le carte che restano nel proprio mazzo, non il loro ordine, e il tavolo pubblico. Non vede la mano coperta degli altri, l'ordine di nessun mazzo né le mosse presentate e non ancora risolte. Non riceve carte, risorse o salute in più: il livello cambia solo il modo di scegliere. **Facile** sceglie a caso una carta giocabile, poi a caso un modo valido di giocarla. **Normale** sceglie secondo uno stile legato al personaggio. Prevedendo il turno in corso con le sole informazioni pubbliche, si para o si cura se un colpo mostrato e pagabile da un avversario lo porterebbe a terra, colpisce se un suo colpo porta sicuramente a terra un avversario, e fra la sconfitta e la patta sceglie la patta. Il livello si fissa all'avvio della partita e non cambia; se l'avvio non lo indica vale Facile. Il computer sceglie quando la partita controlla se tutte le mosse sono presentate, senza attesa. Se non trovasse mosse valide passerebbe con mossa vuota: con mazzi conformi il caso non si presenta.

**R08**, in coda al primo paragrafo:
> Il computer decide dalla stessa vista (R03).

**Revisioni**, voce nuova:
> **2.2 — <data>, SB-30a (livelli del computer):** R01 e R03, il computer gioca a uno di due livelli, Facile (casuale) e Normale (stile del personaggio e previsione del turno in corso), scelto dall'umano in quick e open contro computer; Normale in FFA; Facile se l'avvio non lo indica. R03 e R08, il computer usa solo le informazioni di un giocatore. Decisioni D85, D187 e la Fase A di SB-30a. Motivazione: il computer casuale «sembra stupido» col Set Base 1.0; nessun effetto, costo, risoluzione o carta cambia.

**Set Base 1.0.2** (solo se la domanda 4 va come si raccomanda): una riga «Stile del computer: aggressivo / prudente / risorse» nella scheda di ogni personaggio con starter, scritta dal generatore a partire da un campo `botStyle` del file del set.

Copie e allegato (`docs/rules-catalog.json` e quelle che controlla `check-rules.py`) si adeguano nella stessa modifica, come vuole AGENTS.

## 4. Scelta del livello

| Tema | Opzioni | Raccomandazione |
|---|---|---|
| Dove si sceglie | (a) solo quick 1vCom; (b) quick 1vCom e open 1vCom; (c) anche per ogni computer della FFA | **(b)**. Due radio «Facile / Normale» sotto «Base / Avanzato», visibili solo nelle due modalità contro computer, ricordate per la sessione come la categoria. Nella FFA il computer lo aggiunge chiunque sia in coda e non c'è un «proprietario» della scelta: Normale fisso. (c) solo se il proprietario lo vuole (header `level` su `ffa/join/com`) |
| Default nel client | Facile o Normale | **Normale**: D85 (5) dice che il livello incontrato dalla maggior parte dei giocatori non deve sembrare stupido |
| Richiesta senza livello (`client-debug`, CLI, controlli automatici) | Normale o Facile | **Facile**, come D190 (2): `client-web` manda sempre il livello; i controlli Playwright e `client-debug` restano contro il computer casuale di oggi, che ha la stessa forza |
| Valore non valido | rifiuto o default | **Rifiuto** con `/queue/game/error`, come la categoria di SB-29 |
| Cosa si salva | | Nell'evento `INITIAL` dell'archivio, una lista `computers: [{playerId, level, policy}]`, una voce per computer; `botPolicy` resta per compatibilità, col nome della politica del primo. Il livello sta anche nel `BotPlayer` (serializzato con la partita, quindi sopravvive alle copie del motore e al ripristino della transazione R08) |
| Si mostra in partita? | sì o no | **No** in SB-30a: lo si vede nella scelta prima dell'avvio. Un'etichetta nel tavolo è lavoro di C5 |

**Stile del Normale** (D85 (6): «lo stile è un'impronta del personaggio»). Proposta provvisoria, per carattere (la misura non distingue gli stili: tutti fra 89 e 93%): Spazienzio **aggressivo** (picchiatore), Mara **prudente** (schiva e scappa), Celestina **risorse** (tossicità e veleno), Piera **aggressivo** (berserk e alcol), Beppe **risorse** (oggetti). Sergio e Duccio non hanno starter, quindi il computer oggi non li gioca. Alternativa: stile a caso a ogni partita, più vario ma senza firma.

## 5. «Nessuna informazione nascosta» sul percorso vivo

`NoHiddenInformationTest` (SB-30b B5b) è sempre attivo e prova il Normale e il Difficile su 60 posizioni della **bozza**, chiamando `policy.choose(view…)`. Per il percorso vivo mancano tre cose: il **set vivo**, la **catena viva** (fabbrica → `BotPlayer.chooseMove(Game)` → `Move`) e il **Facile**. Si propone un test nuovo, sempre attivo, che riusa i metodi di `Sb30bProbeTest` (`points`, `game`) e la stessa trasformazione:

1. **Posizioni:** 60 da partite reali con `LiveSet` e `Ruleset.LIVE`, i cinque starter, più 20 posizioni FFA a tre posti (oggi la prova cambia un solo avversario).
2. **Copia con il nascosto cambiato:** mano coperta di ogni avversario scambiata con carte del mazzo di nome diverso (escluse mostrate, legate, basic e last resort), ordine di tutti i mazzi, una mossa già inviata dall'avversario fra quelle in attesa, generatore dell'avversario avanzato.
3. **Attese:** `BotView` uguali; per ogni livello e stile, **costruito dalla fabbrica viva**, la `Move` di `BotPlayer.chooseMove(game)` uguale sulle due copie (carta, bersaglio, scarto, oggetto, nome cercato) a parità di seme del giocatore.
4. **Confine dei tipi:** come `newClassesImportNoEngineTypeNorReflection`, esteso alla fabbrica dei livelli e alle politiche del Facile e del Normale: niente `Game`, `Player`, `Move` né riflessione fuori da `BotPlayer` e `BotView`.
5. **Mutazioni** previste: la fabbrica che passa la `Game` invece della vista, una vista che porta la mano coperta, un `ComPlayer` casuale al posto del Facile (legge `Game`). Ognuna deve far cadere il test.

Costo atteso: pochi secondi, come quello di B5b.

## 6. Fasi B

Per ogni fase valgono le righe «Sempre» delle [aree](../../aree-protette.md#sempre): `git diff --check`, `check-links.py`, `check-rules.py`.

| Fase | Perimetro | Verifiche (aree) | Cosa vede il proprietario |
|---|---|---|---|
| **B1** regole | `docs/game-rules.md` 2.2 (R01, R03, R08, revisione); copie e allegato; se domanda 4: generatore, `sets/base.json` (`botStyle`), `docs/sets/base.md` 1.0.2 | area [regolamento e set](../../aree-protette.md#regolamento-e-set): `check-rules.py`, `build.ps1 -Task Test -Offline`, contesto e manifest (riga servizi); se tocca il generatore, la riga di `tools/set-catalog/` | il testo di R03 |
| **B2** server | livello, fabbrica per giocatore, `craftComPlayer(category, level)`, header `level` (quick 1vCom, open 1vCom), FFA a Normale, archivio `computers`, `docs/api.md`, CLI; test nuovo di §5, test della fabbrica e degli ingressi, 3–8 mutazioni. `ComPlayer`, stili, `TurnForecast` e `BotView` **identici byte per byte** | `build.ps1 -Task Test -Offline`, `-Task TestServerContext -Offline` con `verify-match-manifests.py` (partita viva, riga servizi); **identità viva** (banco di 480.000 partite, deve restare identico: il banco non passa dalla fabbrica); `TurnForecastFidelityTest` invariato | rapporto: tempi per decisione in partite con 1 e 4 computer |
| **B3** client | `client-web`: radio Facile/Normale nelle due modalità contro computer, default Normale, header `level`; `client-debug`: selettore minimo | `client-web/run.ps1 -Task Test`, `Build`, `Size`; jar rifatto; Playwright `Verify` e `VerifyFfa` a 1366×768 e 844×390 (la regia sceglie le altre) | la schermata della hub |
| **B4** prova | partita del proprietario (sotto) | nessuna | la partita |

B2 e B3 possono andare a un solo esecutore in sequenza, perché B3 dipende dall'header di B2.

**Tempo per decisione (D85 (4)).** Facile e Normale «istantanei». Limite proposto, misurato nel rapporto di B2 (non come test a soglia, che sarebbe instabile da una macchina all'altra): **P99 sotto 5 ms e massimo sotto 50 ms** per decisione a JVM calda, e un turno FFA con quattro computer sotto 50 ms in tutto. Oggi: P99 0,16 ms. Nessun indicatore «sta pensando» per questi due livelli.

## 7. Rischi e giudizio del proprietario

- **Un bot forte non è per forza divertente.** Il salto Facile → Normale è grande (89–92%). La proposta dei livelli chiama «gradino mancante» qualunque salto oltre l'85%, e un principiante col default Normale può perdere quasi sempre. Il gradino in mezzo non si inventa qui: D85 (9) esclude l'errore voluto. Si giudica in partita (B4). Se Normale risulta troppo duro come default, si cambia il default, non il bot.
- **Prevedibile per costruzione:** si para sempre davanti a un colpo mostrato e letale. Chi lo capisce può sfruttarlo, per esempio cercando un colpo per far parare il bot e poi colpire col colpo coperto. È la personalità del Normale. Chi gioca potrebbe anche pensare che il bot «legga la mano»: la carta mostrata è pubblica e il client la fa vedere, ma va notato in B4.
- **Lacune di §2:** timer, quattro carte Java, più colpi mostrati in FFA. Il bot lì può sembrare cieco.
- **Controlli automatici:** con la richiesta senza livello a Facile restano come oggi. Le Playwright di `client-web` giocherebbero col default Normale: partite più lunghe o più perse, da guardare in B3.
- **Rientro:** l'id deve restare `ComPlayer_…` (`session.ts`).
- **Domani:** il Difficile non è serializzabile. La fabbrica per giocatore lo prevede, ma il suo collegamento resta di SB-30b o di un blocco dopo.

**Come giudica il proprietario (B4).** Nel client, su database temporaneo: tre partite contro Facile e tre contro Normale con starter Base, poi una con Avanzato, e una FFA con due computer. Per ogni partita una parola fra «stupido / giusto / duro / ingiusto / noioso», e se ha vinto. Il Normale passa se non è mai «stupido» e non è «ingiusto». Il Facile passa se resta battibile da chi impara.

## 8. Domande al proprietario

1. **Dove si sceglie il livello?** Raccomandazione: quick contro computer e open contro computer; computer della FFA fissi a Normale.
2. **Default.** Raccomandazione: Normale selezionato nel client; Facile se la richiesta non dice il livello (`client-debug`, CLI, controlli), come D190 (2).
3. **Cosa fa il Facile?** Raccomandazione: casuale puro (`RandomPolicy`), forte come oggi (51,6%). Alternativa: casuale ma gioca il colpo cercato il turno dopo (D74), perché chi impara veda la meccanica.
4. **Stile del Normale.** Raccomandazione: legato al personaggio (Spazienzio e Piera aggressivi, Mara prudente, Celestina e Beppe risorse), scritto nella scheda del personaggio del Set Base (1.0.2, dal generatore). Alternativa: tabella nel server senza valore normativo, o stile a caso a ogni partita.
5. **Salto Facile–Normale al 90% circa.** Raccomandazione: accettarlo in SB-30a e decidere dopo B4. Nessun rumore (D85 (9)); il gradino in più lo dà il Difficile.
6. **Livello visibile in partita?** Raccomandazione: no in SB-30a; il livello sta nella hub e nell'archivio; un'etichetta al tavolo con C5.
7. **Lacune (timer, quattro carte Java, più colpi mostrati in FFA).** Raccomandazione: fuori da SB-30a; in un blocco sui bot dopo B4, con testo stampato e fedeltà, se la partita le fa notare.
8. **Prova del proprietario.** Raccomandazione: quella di §7, a livello dichiarato (non alla cieca), in una sessione.

## Stato del documento

Fase A consegnata il 26 novembre 2026, in attesa delle risposte alle domande 1–8. Nessuna attuazione.
