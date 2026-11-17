# SB-18 — Proposta per Duccio Braccio Teso (Fase A)

**Versione 0.1 — 17 novembre 2026.** Proposta di [SB-18](../../set-base-plan.md#sb-17-sb-18--personaggi-da-booster), passo con proposta come SB-17 ([D123](../../set-base-decisioni.md#decisioni-del-proprietario) (3)). Riferimenti: bozza 1.6b più Sergio della B6 ([bozza di riferimento](bozza-di-riferimento.md)), [regole d50](regole-playground.md) 1.4, [scheda](schede-personaggi.md#7-santincasso--booster-concept-nuovo) e [domanda per SB-18](schede-personaggi.md#domanda-per-sb-18-il-costo-in-salute-con-duccio), righe `ROC-*` della [griglia](griglia.md), rapporti [B4](../../reports/set-base/sb-17-b4-report.md), [B5e](../../reports/set-base/sb-17-b5e-report.md) e [B6](../../reports/set-base/sb-17-b6-report.md) di SB-17. Nessuna misura e nessun codice: i numeri sono stime dal listino e dalla 1.6b.

## 1. In breve

- **Il costo in HEALTH resta l'identità** (D27, D47): i colpi buoni costano salute; la difesa riduce l'HIT e contrattacca. Il formato e il motore del playground lo sanno già fare: **nessuna classe Java nuova**, tutto in dati.
- **Salute 130 → 110** (stima): la scheda è sulla scala di SB-9; gli starter della 1.6b stanno fra 70 e 85 e Duccio ne spende circa 30 netti a partita. Il primo giro misura anche 130.
- **Un «Annuncia»** (D52 (3), D106): il colpo gratuito ROC-AR5 diventa il caricamento, col premio in HEALTH, cioè nella risorsa che paga il colpo cercato.
- **«Ultimo colpo» su una carta sola**, la rara: è l'uscita a salute bassa e l'unico modo di pareggiare suicidandosi (D50 (2)); la cura rara della griglia esce.
- **Lezione di SB-17:** si misura subito quale risorsa paga davvero le carte, con **tre varianti e il controllo nello stesso giro** (come la B5e). Fase B **600 s**, bozza e bot invariati, poi STOP.

## 2. Le carte alla luce di d50 e della 1.6b

Prezzi dal listino (HEALTH 1, V 0,75, A 0,5 per unità, D33 (2)) e dalla 1.6b: Mattone 15 V e Lo sanno tutti 15 A fanno 24 HIT, GARGANTUESCO 25 V ne fa 34. Nomi: quelli in corsivo sono nomi di lavoro nuovi, da approvare (domanda 5).

| Slot | Griglia (prima di d50) | Proposta | Perché | Forma |
|---|---|---|---|---|
| PG-ROC (R) | H 130, A 15, V 0, cap. 2 | **H 110**, A 15, V 0, cap. 2 | scala della 1.6b (§ 4); la salute è la prima leva dei giri (D34 (5)) | dati |
| ROC-BA (R) | consuma, poi +3 HEALTH, pr. 0 | invariata, *«Prima io»* | presa con tratto (D3): la sua risorsa torna con gli oggetti, non a ogni turno | consume |
| ROC-BO1 (NC) | 3 HIT, pr. 0 | invariata, «Colpetto» | colpetto al tetto D36 | dati |
| ROC-BO2 (NC) | 2 HIT, pr. 2 | invariata, *«Gomitata»*, nella collezione | variante veloce | dati |
| ROC-BO3 (NC) | +8 A a sé | invariata, *«Alzo la voce»* | A 15, la più bassa: paga le generiche a A (§ 4) | dati |
| LR-ROC (R) | 6 HIT a sé, 12 HIT, pr. 0 | 6 HIT a sé, 12 HIT; **Rincara 5 (2 a sé)**, *«Ne ho prese di peggio»* | come le last resort della 1.6 (D95 (1)): chiude la partita; danno a sé come effetto, non costo, quindi gratuita | dati (`perPlay`) |
| ROC-AR1 (C) ×2 | 12 H, pr. 0: 22 HIT | 12 H, pr. 0: **24 HIT**, *«Nocche sbucciate»* | in linea con Mattone e Lo sanno tutti | dati |
| ROC-AR2 (C) ×2 | pr. 2: HIT ricevuto ×0,5 nel turno | pr. 2: HIT ricevuto ×0,5 nel turno; **+3 HEALTH** a sé, «Incassare» | nessuna parata pura (D52 (1)): piccola cura come Tartaruga | dati |
| ROC-AR3 (NC) ×2 | 8 H, pr. 2: HIT ×0,5, 8 HIT | 8 H, pr. 2: HIT ricevuto ×0,5 nel turno; **10 HIT**, *«E allora?»* | il contrattacco: a pr. 2 arriva prima dei colpi a pr. 0–1 (RP-1) | dati |
| ROC-AR4 (NC) ×2 | 20 H, pr. 0: 30 HIT | 20 H, pr. 0: **34 HIT**, *«Capocciata»* | il colpo NC cercato, come GARGANTUESCO | dati |
| ROC-AR5 (C → **NC**) ×2 | pr. 1: 6 HIT | **Caricamento**, pr. 1: 4 HIT al bersaglio. Annuncia Capocciata o Testa dura. Se lo trovi: **+10 HEALTH**. Se non lo trovi: +3 HEALTH. *«Te lo spiego io»* | resta la carta gratuita, ma prepara; il premio paga metà della Capocciata (D63); il gettone ×1,5 è il suo «finisce per prenderle» | dati + search |
| ROC-AR6 (R) ×1 | +15 HEALTH; HIT ricevuto ×1,25 per 2 turni | **25 H, pr. 0: 40 HIT. Ultimo colpo.** *«Testa dura»* | picco raro e uscita a salute bassa (§ 3); la cura rara allungava le partite (rischio della scheda) | dati (`lastBlow`) |

Duccio resta a **6 titoli, 2 C / 3 NC / 1 R** come Sergio (la griglia diceva 3 C / 2 NC / 1 R). Triangolo: attacco Nocche, Capocciata e Testa dura; difesa Incassare; contromossa E allora?. Letture di flavour 1 e 2 di D47 («si fa male dandole», «non arretra per principio»); nessun nome sul martire.

**Effetti attesi.** Le riduzioni sono sull'HIT: contro Mara (CUT) e Celestina (POISON) Incassare ed E allora? valgono poco, quindi questi due incontri sono il rischio maggiore, come per Sergio; contro Spazienzio e Piera, che colpiscono di HIT, il contrattacco rende. Duccio è l'ultimo a parità di priorità (A 15, scheda): i suoi colpi a pr. 0 arrivano dopo quasi tutto.

## 3. Il costo in HEALTH

**Formato, oggi.** Il costo è la mappa `cost` della carta (`{"HEALTH": 12}`), come per le altre risorse; «Ultimo colpo» è il campo `lastBlow: true` (`DataCards`, rifiutato sugli oggetti); un premio in HEALTH nel passo `search` è ammesso (`foundGains`, risorse non negative). Il motore applica RP-2 e RP-3 (`Move.healthCostAllowed`), `BotView`, `TurnForecast` e `ViewTable` lo stesso controllo; `RegoleD50Test` lo prova su carte di prova. Manca solo un test sulle carte vere di Duccio (completamento verificabile del piano).

**La mossa si presenta solo con salute sufficiente.** Con d50 una carta da costo C si offre solo se la salute è **maggiore** di C (RP-2): Capocciata da 20 non si gioca a 20. Non serve codice.

**«Ultimo colpo» (D50 (2), D73, RP-3).** Solo su Testa dura. Sopra 25 di salute è un colpo normale. A 25 o sotto si gioca lo stesso: si paga quello che c'è, si va a 0 e il colpo si risolve **anche da terra**, anche se un colpo più veloce lo ha già abbattuto (`Game`: chi è a terra non colpisce, salvo «Ultimo colpo»). Lettura «non arretra per principio».

**Pari per suicidio (R06, RP-5).** Con RP-2 nessun costo porta a 0, quindi il suicidio per costo esiste **solo con Testa dura**: se abbatte l'avversario la partita è patta (nessuno spareggio), altrimenti Duccio perde. È la giocata che il proprietario ha voluto tenere in D50 (2); la propongo lecita. Resta il danno a sé della last resort (6, più Rincara), come il Banzai per tutti.

**Come il bot non si suicida per caso.** Tre filtri, già nel codice:

1. `BotView` offre le mosse a costo HEALTH solo con la regola di RP-2;
2. `StyleSupport.choose` scarta una mossa che costa almeno la salute rimasta finché c'è un'altra mossa legale (SB-7b), e le bound ci sono sempre;
3. il bot letale (`TurnForecast.prefer`, D76) conta la propria morte nella previsione: Testa dura suicida è «a terra» e si tiene solo se **tutte** le mosse lo lasciano a terra e lei abbatte di sicuro l'avversario, cioè patta al posto di una sconfitta certa.

Un difetto piccolo, da correggere nella fase con le verifiche complete (§ 7): `StyleSupport.unlockedDamage` usa `have < cost`, mentre con d50 la HEALTH vuole `have > cost` e Testa dura è sempre pagabile; così sbaglia di poco il valore del caricamento quando la salute è vicina al costo. Il primo giro lo lascia com'è, come la B5e ha lasciato i bot.

## 4. La lezione di SB-17: chi paga le carte di Duccio

In SB-17 la leva era la risorsa che paga le carte, non il ricavato né le bound: senza la A della basic Sergio ripiegava sulle bound, che scartano, e il mazzo finiva nel 43% delle partite (B4); con la A di Lo metto in conto nel 27% (B5e V4, B6).

Per Duccio la risorsa è la **HEALTH**, che si comporta diversamente:

- **non finisce, si blocca:** sotto il costo la carta resta in mano (RP-2); a 20 di salute Capocciata e Testa dura (fuori dal suicidio) sono ferme;
- **costa la vita:** i bot la spendono meno quando sono indietro (prudente: costo × 2 × bisogno; risorse: ×1,5 sotto l'avversario). Il pericolo è un Duccio ferito con una mano di carte che non paga, che gioca bound per turni e consuma il mazzo.

Contromisure nella proposta, e cosa ne misura il giro:

| Contromisura | Dove |
|---|---|
| tre fasce di costo (8, 12, 20) più la rara: ferito, Duccio perde prima i colpi grandi, non tutti | AR1, AR3, AR4 |
| fuori dalle bound, 7 regolari gratuite (caricamento, Incassare, Spintone, Fasciatura) e 3 a 5 A (Sputo, Tartaruga), alimentate da Alzo la voce; più gli oggetti con la basic | § 5 |
| la HEALTH torna giocando il suo gioco: caricamento trovato +10, basic +3 per oggetto, Incassare +3 | AR5, BA, AR2 |
| un'uscita a salute bassa che non è una bound: Testa dura con «Ultimo colpo» | AR6 |

**Conto della salute (stima).** In 10–11 turni: circa 45 spesi in costi (Nocche 1,2 volte, Capocciata 1, E allora? 0,8, Testa dura 0,3), circa 15–20 recuperati (caricamento, basic, Incassare, oggetti a parte). Netto circa 30: con 110 Duccio gioca come un personaggio da 80, in cima alla scala della 1.6b. Con 130 senza cure proprie (V2) il netto sale a circa 40, quindi 90.

**Letture del giro** (non criteri): mazzo esaurito (riferimento: Sergio B6 26,7%); giocate di bound sul totale quando la salute è sotto 30; salute spesa e recuperata a partita (scheda: 30–40 spesi); giocate a partita di ogni carta a costo HEALTH per stile; morti nel turno in cui paga (attese 0, come dopo SB-7b); Testa dura giocata da suicida e con quale esito; giocate di last resort.

## 5. Mazzo di prova `prova-duccio` (20 carte, al più 2 copie, D94)

Basic Prima io; bound **Colpetto** e **Alzo la voce** (Gomitata nella collezione); last resort Ne ho prese di peggio.

| Copie | Carta | Ruolo |
|---:|---|---|
| 2 | Te lo spiego io (AR5) | caricamento gratuito, cerca il colpo |
| 2 | Capocciata (AR4) | colpo NC cercato, 20 H |
| 1 | Testa dura (AR6) | picco raro, «Ultimo colpo» |
| 2 | Nocche sbucciate (AR1) | colpo medio, 12 H |
| 2 | Incassare (AR2) | difesa gratuita |
| 2 | E allora? (AR3) | contrattacco, 8 H |
| 2 | Spintone (GEN-18) | danno gratuito |
| 2 | Sputo da posacenere (GEN-17) | 5 A: 12 POISON, aggira le parate |
| 1 | Tartaruga sul marciapiede (GEN-13) | 5 A: difesa anche contro CUT |
| 1 | Fasciatura col fazzolettaccio (GEN-16) | −5 A, +8 HEALTH |
| 2 | Panino del kebab dimenticato (OGG-07) | +12 HEALTH, +3 T |
| 1 | Ghiaccio nel tovagliolo (OGG-14) | +10 HEALTH, azzera la T |

11 d'archetipo, 6 generiche, 3 oggetti; **tutte già in `bozza.json`**. Scelte prese rispetto alla forma della griglia (Spintone, Fasciatura, Sputo, Grab; Ghiaccio 2, Kebab 2): fuori Grab (la basic consuma già) e un Ghiaccio (le cure insieme allungano la partita), dentro Tartaruga (l'unica difesa contro CUT). Danno stimato circa 10 HIT a turno più i contrattacchi, entro i 12 turni contro 70–85 di salute.

## 6. Fase B: un giro, tre varianti e il controllo

Come la B5e: bozza invariata, ogni variante una copia completa della bozza con Duccio e `prova-duccio`, stessi semi, stesso mazzo per slot, bot invariati, **nessuna riserva**; poi STOP con una raccomandazione.

| | **C** controllo (griglia) | **V1** salute che torna (raccomandata) | **V2** banca di salute | **V3** costi piccoli |
|---|---|---|---|---|
| Salute | 130 | 110 | 130 | 110 |
| AR5 | 6 HIT, nessun annuncio | caricamento, +10 H / +3 H | caricamento, **+10 A / +5 A** | caricamento, +6 H / +2 H |
| AR2 | HIT ×0,5 | HIT ×0,5, +3 H | HIT ×0,5, **+5 A** | HIT ×0,5, +3 H |
| AR1, AR3, AR4 | 12/8/20 H: 22, 8, 30 HIT | 12/8/20 H: 24, 10, 34 HIT | come V1 | **8/5/14 H: 18, 8, 26 HIT** |
| AR6 | Secondo fiato (+15 H, HIT ricevuto ×1,25 per 2 turni) | Testa dura, 25 H: 40 HIT, «Ultimo colpo» | come V1 | **Testa dura, 16 H: 30 HIT, senza «Ultimo colpo»** |
| LR-ROC | 6 a sé, 12 HIT | 6 a sé, 12 HIT, Rincara 5 (2) | come V1 | come V1 |
| Risponde a | la griglia regge con d50? | — | la salute come moneta che torna o come banca fissa (§ 4) | costi grandi con il pari per suicidio o costi piccoli senza (domanda della scheda) |

**Giro.** Duccio contro i cinque starter e nello specchio, lanciatore e semi di SB-17 (12 stili letali, 144 celle, 300 semi): **259.200 partite per variante**, quattro varianti.

**Criteri** (soglia D95): ogni incontro con gli starter fra 35% e 65% sui bot euristici, patte al massimo 10% (specchio compreso, D51), durata entro 12 turni fuori dallo specchio; violazioni, turni senza mosse legali e bound oltre il tetto a zero. Le letture della § 4 accanto.

**Regola di scelta, scritta ora:** la variante con meno incontri fuori D95; a pari, mazzo esaurito più basso; poi patte dello specchio. La scelta del proprietario passa alla Fase B2.

**Fase B2 (dopo la scelta, da approvare allora).** Variante scelta in `bozza.json` con griglia allineata prima dei dati; correzione di `unlockedDamage` (§ 3); i test del costo in HEALTH sulle carte vere; un giro con una riserva scritta ora, **R1: salute ±10** nel verso che serve (D34 (5)); la conferma del tetto D36 su Duccio, che SB-10b chiedeva qui, col banco del tetto; jar rifatto e prova del proprietario.

## 7. Forma, codice e verifiche

**Fase B (questo giro).**

- **Dati:** quattro copie della bozza in `docs/reports/set-base/sb-18/b/`; personaggio `base.character.Rocco` (l'ID dello slot resta `ROC`), carte nel package di dati di Duccio, mazzo `prova-duccio`. Costo HEALTH, `lastBlow`, `foundGains` in HEALTH e `perPlay` esistono; se la fattibilità trova un rifiuto del caricatore, la correzione sta in `com.gsc.bm.sim` (deroga del playground) con un test.
- **Banco:** un `Sb18MeasureTest` sul modello di `Sb17MeasureTest`, con le letture della § 4, e il lanciatore `sb-18/run.ps1`.
- **Bot:** nessun cambio.
- **Verifiche** ([tabella delle aree](../../aree-protette.md)): «Sempre» (`git diff --check`, `check-links.py`, `check-rules.py`, `./scripts/build.ps1 -Task Test -Offline`); **passo 0 d'identità** prima e dopo il banco nuovo (codice che la misura esegue); nessuna identità viva né contesto se `server/src/main` non cambia, condizione da mostrare nel rapporto.

**Fase B2.** In più: la correzione dei bot tocca `model/game/bot`, quindi **identità viva** (480.000 partite, identica byte per byte), **`TestServerContext`** con i manifest, **fedeltà** di `TurnForecast` e `ViewTable` col braccio di Duccio (costi HEALTH, Testa dura da terra), 3–8 **mutazioni** sulla correzione; `Sb18.without` per i test sui cinque starter; `genera-bozza-di-riferimento.py --verifica`, `rarita-bozza.py --check`; `./scripts/build.ps1 -Task Server -Offline` prima della prova.

**Test del costo in HEALTH (B2, sulle carte vere).** Capocciata non offerta a salute 20 e offerta a 21, dal motore e da `BotView`; Testa dura a salute 10: paga 10, si risolve da terra, patta se abbatte l'avversario; il bot non la gioca da suicida se un'altra mossa lo lascia in piedi, la gioca se tutte lo lasciano a terra e lei abbatte; nessuna morte pagando nel giro.

**Budget della Fase B, fissato ora:** fattibilità 4 × circa 8 s; quattro giri × circa 130 s (Duccio allunga le partite più di Sergio, che stava a 105 s); riserva 45 s: **600 s di orologio**, mai insieme ad altre misure. Passo 0 e verifiche fuori budget.

## 8. Domande al proprietario

1. **Valori iniziali:** salute 110 (stima) al posto dei 130 della scheda, A 15, con 130 misurato nel controllo e in V2? *Raccomandazione: sì.*
2. **«Annuncia» di Duccio:** Te lo spiego io (AR5, C → NC) caricamento gratuito che cerca Capocciata o Testa dura, col premio in HEALTH (+10 / +3)? *Raccomandazione: sì; V2 misura il premio in A.*
3. **«Ultimo colpo» e pari per suicidio:** solo su Testa dura (R), giocata lecita, coi bot che la usano da suicidi solo a sconfitta certa? *Raccomandazione: sì; V3 misura l'alternativa dei costi piccoli senza.*
4. **Fase B:** controllo e V1–V3 in un giro, bozza e bot invariati, nessuna riserva, 600 s, poi STOP con raccomandazione; Fase B2 come nella § 6? *Raccomandazione: sì.*
5. **Nomi:** i sei che la scheda chiede di rifare in SB-18 (*Prima io* per «La mancia», *Gomitata* per «Diretto», *Alzo la voce* per «Saltellare», *Capocciata* per «Uppercut della sagra», *Te lo spiego io* per «Tre schiaffi, un euro», *Ne ho prese di peggio* per «Porgi l'altra guancia»), più *Nocche sbucciate*, *E allora?* e *Testa dura* per i titoli che cambiano? *Raccomandazione: sì, come nomi di lavoro; i definitivi a SB-24.*
6. **Conto del set:** Duccio a 2 C / 3 NC / 1 R e la cura rara Secondo fiato fuori dalla bozza; conto dei 120 e rarità, con CES-AR7 di Sergio, li rifà SB-19? *Raccomandazione: sì; Secondo fiato in ingresso a SB-19 come idea per una generica.*
