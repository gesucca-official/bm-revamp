# SB-18 — Fase B: controllo e tre varianti di Duccio (rapporto)

**17 novembre 2026. Fase B della [proposta di SB-18](../../design/set-base/sb-18-proposta.md), approvata in [D124](../../set-base-decisioni.md#decisioni-del-proprietario).
Un giro per variante, nessuna riserva, bot e `bozza.json` invariati. Le quattro bozze sono copie in [sb-18/b/](sb-18/b/).**

## 1. Le varianti, come misurate

Quattro copie complete di `bozza.json` (94 carte più quelle di Duccio), ognuna con il personaggio `base.character.Rocco` (l'ID dello slot
resta `ROC`), le sue carte nel package `base.rocco` e il mazzo `prova-duccio` della § 5 della proposta. Il mazzo è lo stesso in tutte e
quattro, salvo AR6: nel controllo la rara è Secondo fiato, nelle altre Testa dura. Tutte le altre carte del mazzo (Spintone, Sputo da
posacenere, Tartaruga, Fasciatura, Panino, Ghiaccio) sono già in `bozza.json` e non cambiano.

| | **C** controllo (griglia) | **V1** salute che torna | **V2** banca di salute | **V3** costi piccoli |
|---|---|---|---|---|
| Salute, A | 130, 15 | 110, 15 | 130, 15 | 110, 15 |
| Prima io (basic) | consuma, +3 H | come C | come C | come C |
| Te lo spiego io (AR5) | 6 HIT, nessun annuncio | caricamento, 4 HIT, +10 H / +3 H | caricamento, 4 HIT, +10 A / +5 A | caricamento, 4 HIT, +6 H / +2 H |
| Incassare (AR2) | HIT ×0,5 | HIT ×0,5, +3 H | HIT ×0,5, +5 A | HIT ×0,5, +3 H |
| Nocche sbucciate (AR1) | 12 H: 22 HIT | 12 H: 24 HIT | come V1 | 8 H: 18 HIT |
| E allora? (AR3) | 8 H: ×0,5 e 8 HIT | 8 H: ×0,5 e 10 HIT | come V1 | 5 H: ×0,5 e 8 HIT |
| Capocciata (AR4) | 20 H: 30 HIT | 20 H: 34 HIT | come V1 | 14 H: 26 HIT |
| AR6 | Secondo fiato: +15 H, HIT ricevuto ×1,25 per 2 turni | Testa dura: 25 H, 40 HIT, «Ultimo colpo» | come V1 | Testa dura: 16 H, 30 HIT, senza «Ultimo colpo» |
| Ne ho prese di peggio (LR) | 6 a sé, 12 HIT | 6 a sé, 12 HIT, Rincara 5 (2 a sé) | come V1 | come V1 |

Scelte di forma, scritte prima di misurare e non previste dalla proposta: le tre bound sono Colpetto (pr. 0, 3 HIT), Gomitata (pr. 2, 2 HIT,
nella collezione, fuori dal mazzo) e Alzo la voce (pr. 0, +8 A); le priorità sono quelle della griglia (basic e last resort pr. 0,
AR1 e AR4 pr. 0, AR2 e AR3 pr. 2, AR5 pr. 1, AR6 pr. 0); la basic consuma e poi cura (`consume`, poi `gain`), come dice la griglia; il
caricamento è un'azione con bersaglio l'avversario, come Oh, guarda là, con la ricerca di Capocciata o Testa dura (gettone ×1,5); Duccio
è RARE come Sergio, le carte hanno la rarità della proposta (NC = UNCOMMON). Secondo fiato del controllo ha lo stato ×1,25 con `turns: 1`
(questo turno e il successivo). Le descrizioni sono quelle della proposta con il codice di slot (`ROC-AR1`, …).

## 2. Fattibilità

Le quattro bozze si caricano e si giocano: 4 semi per cella, 3.456 partite per variante, 0 violazioni, 0 turni senza mosse legali, 0 bound
oltre il tetto. **Nessun rifiuto del caricatore**: costo `HEALTH`, `lastBlow`, premio della ricerca in HEALTH e `perPlay` sono accettati così
come sono, quindi nessuna correzione in `com.gsc.bm.sim` e nessun codice in `server/src/main`.

## 3. Esito

**Con la regola di scelta scritta nella § 6 della proposta vince la V3** (costi piccoli, 110 di salute, senza «Ultimo colpo»): 5 incontri
fuori D95 contro 6 di C, V1 e V2. **Ma nessuna variante è vicina a D95**: in tutte e quattro Duccio vince fra l'85% e il 99% contro ogni
starter sui bot euristici, cioè da 20 a 34 punti oltre la soglia del 65%. La regola dice quale variante è meno lontana, non che
sia accettabile; la § 8 di questo rapporto chiede al proprietario cosa fare.

La regola (meno incontri fuori D95; a pari, mazzo esaurito più basso; poi patte dello specchio) si risolve al primo criterio: V3 5, gli altri 6.
Gli altri due criteri non servono (mazzo esaurito sotto l'1,1% in tutte le varianti, patte dello specchio fuori solo in C, V1 e V2).

## 4. Quota / patte / turni (soli euristici, 259.200 partite per giro, criteri D95 della § 6)

Quota di Duccio sulle decisive, patte, turni medi; 300 semi per cella, un solo giro per variante. In grassetto i valori degli incontri che
violano D95 (quota fra 35% e 65%, patte ≤ 10%, durata ≤ 12 turni fuori dallo specchio). Specchio: la quota non conta.

| Incontro | C | V1 | V2 | V3 |
|---|---|---|---|---|
| Duccio–Duccio | **48,12% / 13,48%** / 10,28 | **50,40% / 17,02%** / 5,06 | **50,42% / 14,98%** / 6,12 | 48,58% / 6,46% / 6,76 |
| Duccio–Spazienzio | **98,86%** / 0,00% / 6,15 | **95,20%** / 3,81% / 4,74 | **96,97%** / 2,05% / 4,69 | **93,49%** / 0,07% / 5,82 |
| Duccio–Mara | **96,03%** / 0,38% / 7,07 | **88,14%** / 4,99% / 5,07 | **96,31%** / 2,28% / 5,03 | **85,30%** / 0,26% / 6,38 |
| Duccio–Celestina | **97,37%** / 1,28% / 7,58 | **95,93%** / 2,84% / 5,18 | **98,61%** / 1,25% / 5,22 | **93,56%** / 2,84% / 6,72 |
| Duccio–Piera | **98,98%** / 0,42% / 6,64 | **95,27%** / 2,88% / 4,83 | **98,91%** / 0,39% / 4,74 | **93,58%** / 0,36% / 6,15 |
| Duccio–Beppe | **99,04%** / 0,00% / 5,82 | **96,78%** / 3,16% / 4,30 | **99,15%** / 0,86% / 4,31 | **94,68%** / 0,06% / 5,29 |
| **Incontri fuori D95** | 6 | 6 | 6 | **5** |
| Punti oltre la soglia (somma) | 168,76 | 153,34 | 169,93 | 135,61 |

Fuori D95, dettaglio (punti oltre la soglia): C specchio patte 3,48, quote 33,86 / 31,03 / 32,37 / 33,98 / 34,04 (Spazienzio, Mara,
Celestina, Piera, Beppe); V1 specchio patte 7,02, quote 30,20 / 23,14 / 30,93 / 30,27 / 31,78; V2 specchio patte 4,98, quote 31,97 / 31,31 /
33,61 / 33,91 / 34,15; V3 quote 28,49 / 20,30 / 28,56 / 28,58 / 29,68, specchio dentro. Violazioni 0, turni senza mosse legali 0 e bound
oltre il tetto 0 in tutti i giri. Esiti completi: [C](sb-18/b/round-c.md), [V1](sb-18/b/round-v1.md), [V2](sb-18/b/round-v2.md),
[V3](sb-18/b/round-v3.md); tabelle messe a confronto da `sb-18/analyze.py compare`.

Durata: 4,9–7,7 turni per partita in media; gli incontri con gli starter vanno da 4,3 a 7,6 turni (il tetto è 12), l'unico valore sopra 10 è lo specchio di C (10,28). Con tutti gli stili (`com` compresi)
le quote cambiano di pochi punti (per esempio V3 contro Mara 83,7%, contro Celestina 87,2%): il quadro non dipende dai soli euristici.

## 5. Letture (non criteri)

Per partita e per posto di Duccio, soli euristici, 170.100 posti-partita per variante (specchio: due posti). Spesa pagata esattamente:
i costi si applicano subito dopo `ROUND_READY`, prima di ogni effetto, quindi è il minimo fra costo e salute di allora. Il recuperato è
il residuo: salute dopo meno salute prima, più spesa, più danni subiti. «Salute persa per danni» è il danno ricevuto da ogni fonte.

| Lettura | C | V1 | V2 | V3 |
|---|---|---|---|---|
| Mazzo esaurito (rif. Sergio B6: 26,7%) | 1,10% | 0,02% | 0,01% | 0,03% |
| Turni per partita | 7,69 | 4,89 | 5,17 | 6,27 |
| Salute spesa a partita (scheda: 30–40) | 45,27 | 45,90 | 47,55 | 37,20 |
| Salute recuperata a partita (stima della proposta: 15–20) | 9,28 | 7,17 | 2,77 | 6,99 |
| Salute persa per danni a partita | 66,41 | 51,45 | 54,84 | 59,27 |
| Turni di Duccio con salute sotto 30 | 12,06% | 13,63% | 9,91% | 14,12% |
| Bound sul totale delle giocate | 5,72% | 2,67% | 2,29% | 3,07% |
| **Bound sulle giocate con salute sotto 30** | 11,66% | 6,50% | 6,76% | 6,53% |
| Last resort: partite in cui è giocata | 0,10% | 0,00% | 0,00% | 0,00% |
| Pagamenti a zero senza «Ultimo colpo» (morti pagando) | 0 | 0 | 0 | 0 |
| Ricerche di Te lo spiego io fallite | — | 1,25% | 1,36% | 2,05% |

**Giocate a partita delle carte a costo HEALTH** (soli euristici; la salute spesa a partita dalla carta fra parentesi):

| Carta | C | V1 | V2 | V3 |
|---|---|---|---|---|
| Nocche sbucciate (AR1) | 1,16 (13,9) | 0,75 (9,0) | 0,79 (9,5) | 0,91 (7,3) |
| E allora? (AR3) | 0,96 (7,7) | 0,55 (4,4) | 0,58 (4,6) | 0,74 (3,7) |
| Capocciata (AR4) | 1,18 (23,7) | 0,83 (16,6) | 0,88 (17,5) | 1,06 (14,8) |
| Testa dura (AR6) | — | 0,65 (15,9) | 0,65 (15,9) | 0,71 (11,4) |
| Te lo spiego io, per confronto (AR5, gratuita) | 0,85 | 0,48 | 0,45 | 0,59 |

**Per stile** (aggressivo, prudente, risorse, tutti i tempi sommati): le giocate a partita di ciascuna carta a costo HEALTH differiscono di
meno di 0,25 fra stili in ogni variante (per esempio V1: Nocche 0,74 / 0,79 / 0,74, Capocciata 0,83 / 0,87 / 0,84, Testa dura 0,67 / 0,60 / 0,70) e la
salute spesa sta fra 37,6 e 48,5 per tutti. Il prudente gioca un po' più Nocche e E allora?, e meno Testa dura; nessuno stile evita il costo.
Dettaglio nel JSON di ogni giro.

**Testa dura giocata da suicida** (costo almeno pari alla salute di allora: paga tutto e va a zero; solo con «Ultimo colpo», quindi V1 e V2):

| | Giocate da suicida | su posti-partita | Patta (l'avversario cade con lei) | Sconfitta (l'avversario resta in piedi) |
|---|---|---|---|---|
| V1 | 5.874 | 3,45% | 2.995 (51,0%) | 2.879 (49,0%) |
| V2 | 4.468 | 2,63% | 1.646 (36,8%) | 2.822 (63,2%) |

In C non c'è Testa dura e in V3 costa 16 senza «Ultimo colpo», quindi non porta mai a zero (RP-2). Quanto alle «morti nel turno in cui paga»:
per costo senza «Ultimo colpo» sono **0** in tutte le varianti (le mosse non offerte a salute pari al costo); le morti nel turno di una
carta a costo per qualsiasi causa, che includono i colpi dell'avversario nello stesso turno, sono nei JSON (`diedInPayingTurn`) e non
sono una violazione.

**Last resort:** giocata in 0,10% delle partite in C e praticamente mai nelle altre. Il mazzo non finisce mai (partite da 5 a 8 turni), quindi
Ne ho prese di peggio non chiude nessuna partita.

Le letture dicono, senza spiegarlo oltre: la HEALTH non blocca molto le carte (con salute sotto 30 le bound sono il 6,5–11,7% delle giocate,
contro il 2,3–5,7% in generale, e quei turni sono il 10–14%), il mazzo non si esaurisce, la salute spesa (37–48) è in linea con la stima della
proposta (circa 45), la recuperata (3–9) è meno della metà di quella stimata (15–20). La proposta stimava circa 10 HIT a turno più i
contrattacchi: le partite finiscono in 5–8 turni contro 75–85 di salute, quindi Duccio colpisce più di così. Non ho verificato quale carta
o quale costo pesi di più sulla quota: i quattro giri non isolano le leve.

## 6. Codice toccato

**Nessun file di `server/src/main`.** Solo sorgenti di test e dati:

- [`Sb18.java`](../../../server/src/test/java/com/gsc/bm/sim/Sb18.java): le costanti (personaggio, mazzo).
- [`Sb18MeasureTest.java`](../../../server/src/test/java/com/gsc/bm/sim/Sb18MeasureTest.java): il banco sul modello di `Sb17MeasureTest`,
  attivo solo con `-Dsim.sb18Out`; scrive matrice, osservazioni del mazzo, le letture della § 5 (`health-observations.json`, `health-styles.json`).
- [`sb-18/run.ps1`](sb-18/run.ps1) (fasi `feasibility` e `round`, una variante per chiamata, stessi semi e stili di SB-17: 12 stili letali,
  144 celle, 300 semi) e [`sb-18/analyze.py`](sb-18/analyze.py) (riepiloghi e confronto, non lancia partite).
- [sb-18/b/](sb-18/b/): le quattro bozze e i riepiloghi dei giri.

`bozza.json` è invariata; regolamento, `docs/sets/`, catalogo, client, api, griglia e regole-playground non sono toccati.

**Passo 0 d'identità**, prima e dopo il banco nuovo: 8.640 partite (`ChargeMeasureTest#measure`, d50, arm B, 4 semi per cella, `deckObserve`, contatori
SB-16i), il codice di HEAD esportato con `git archive` contro l'albero con i file nuovi: `arm.txt`, `deck-observations.json`, `draft.json`,
`matrix.json`, `matrix.md`, `observations.json` e `sb16i-observations.json` identici byte per byte, solo `seconds.txt` differisce. Nessuna correzione del
caricatore, quindi nessun secondo passo 0.

## 7. Verifiche

`git diff --check` (anche sui file nuovi, con `git add -N`), `check-links.py` (390 file, 0 rotti) e `check-rules.py`: verdi.
`./scripts/build.ps1 -Task Test -Offline`: 896 test, 0 falliti, 22 saltati (fra cui `Sb18MeasureTest#round`, che gira solo con
`-Dsim.sb18Out`), client 37/37, con `bozza.json` invariata. Il passo 0 è nella § 6. Nessuna identità viva né contesto Spring: `server/src/main`
non cambia, come dice la § 7 della proposta (e `git diff --stat` sul commit mostra solo documenti, dati e sorgenti di test).

## 8. Budget

Orologio di muro: giri 71,8 + 55,6 + 54,9 + 65,2 = 247,5 s; fattibilità 15,1 + 6,7 + 6,9 + 7,4 = 36,1 s; totale **283,6 s su 600** (il
primo giro include la compilazione dei test nuovi). Fuori budget: passo 0 (base 37,7 s con l'esportazione compilata a freddo, nuovo 21,3 s) e verifiche. Mai due
Maven o misure insieme.

## 9. Domande al proprietario

1. **Quale variante passa avanti, e basta una Fase B2?** Per la regola scritta è la **V3** (5 incontri fuori contro 6), ma Duccio vince
   dall'85% al 95% contro ogni starter anche in V3, e una riserva da ±10 di salute (R1 della § 6 della proposta, D34 (5)) non recupera da
   20 a 29 punti di quota. La raccomandazione della regia, se la regola va letta come «la meno lontana», è **V3 come base**, ma **non
   passare alla B2 così com'è**: un giro di taratura (una Fase A2 con la proposta di quali numeri abbassare, poi un giro con più
   riserve scritte prima) prima della verifica completa e della prova. Le leve che il giro non ha isolato, e che servirebbero a scegliere: la
   salute di partenza (110 contro i 75–85 degli starter), il rapporto HIT per HEALTH speso di Nocche e Capocciata, il costo di Testa
   dura, le cure. Non ne ho misurato nessuna da sola: la regia le sceglie con te.
2. **«Ultimo colpo» su Testa dura** (D124 (3)): giocata da suicida in 3,5% (V1) e 2,6% (V2) dei posti-partita, ma una volta su due (V1) o su
   tre (V2) l'avversario resta in piedi e Duccio perde, non pareggia. La V3, senza «Ultimo colpo», non ha suicidi. Si tiene la carta com'è, si
   tiene l'«Ultimo colpo» solo per chi ha l'avversario a tiro, o si rinuncia (con i bot che oggi non distinguono)?
3. **Specchio:** in C, V1 e V2 le patte dello specchio sono il 13–17% (soglia 10%), in V3 il 6,5%. Si conta come ulteriore argomento a favore dei
   costi piccoli, o la quota dei sei incontri pesa di più?
