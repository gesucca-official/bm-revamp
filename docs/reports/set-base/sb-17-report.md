# SB-17 — Fase B: Sergio Sommerso, bozza, giro e mazzo di prova

**16 novembre 2026.** Fase B di [SB-17](../../set-base-plan.md#sb-17-sb-18--personaggi-da-booster), sulla [proposta](../../design/set-base/sb-17-proposta.md) approvata con le modifiche di [D106 e D107](../../set-base-decisioni.md#decisioni-del-proprietario), che prevalgono, e col perimetro allargato a `Game` e `Move` da D108. Solo playground (`d50`): regolamento 1.13, `docs/sets`, `cards.sqlite`, client e starter della 1.6b **non toccati**.

> **Stato 1 (16/11, 12:35).** Passo 0 e identità viva identici; carte, motore e bot di Sergio in codice; fedeltà al 100%, mutazioni 7/7. Prossimo: bozza e giro.
>
> **Stato 2 (16/11, 13:20).** Tre giri e ricerca fatti, 550,7 s su 2.000; suite, contesto Spring, manifesti e controlli verdi. **Sergio resta sotto la soglia D95 contro 4 starter su 5 anche con le due riserve «troppo debole».** STOP per il proprietario.

## In breve

- **Bozza:** Sergio (PG-CES) con basic, 3 bound, 6 carte d'archetipo e il mazzo `prova-sergio` (20 carte, D107) in `bozza.json`; 15 carte nuove nella bozza, 5 classi Java nuove.
- **Giro:** 3 giri da 259.200 partite (prova-sergio contro i 5 starter e nello specchio, 12 stili letali, 144 celle per incontro, 300 semi). Usate **entrambe** le riserve «troppo debole»: salute 75 → 85 (giro 2), Conto salato 16 → 20 sul gettone (giro 3).
- **Esito finale (giro 3, euristici):** dentro la soglia solo Sergio–Spazienzio (38,7%). Mara 26,0%, Beppe 23,0%, Piera 7,2%, Celestina 3,6%; specchio con patte 14,4%. Invarianti e bound a zero.
- **Ricerca per mutazione (SB-7):** il mazzo migliore per Sergio vince il 95–99% contro ogni starter, **ma senza nessuna carta d'archetipo di Sergio**: la forza viene dalle carte d'altri personaggi e dalle generiche, non da lui.
- **Budget:** 550,7 s di orologio su 2.000 (riserva non toccata); identità viva fuori budget (circa 181 s).

## Cosa cambia nel codice

Tutto dietro `Ruleset.playground()` o in carte presenti solo in `bozza.json`; con le regole 1.13 nulla cambia (identità viva identica).

| Punto | Motore | Bot |
|---|---|---|
| Ricatto (CES-AR2) | `base.cesira.Ricatto` (base comune `Contromossa`): annulla come YouStop; se la carta annullata è un colpo, ne riflette all'autore il **danno base** × 50%, troncato, per tipo. Danno base: `PrintedEffects.baseDamage` (passi DAMAGE sul bersaglio, senza anticipo, senza «se gettone», senza le parti lette da risorse, oggetti e giocate); per le carte Java il primo numero del testo pubblico (`nominalDamage`) | `TurnForecast` e `ViewTable` simulano il riflesso; gli stili valutano annullamento e riflesso con `COUNTER_WEIGHT` |
| Lo sapevo (CES-AR3) | `base.cesira.LoSapevo`: annulla e imposta `Move.keepsToken` (`@JsonIgnore`) sulla mossa annullata; `Game.resolveMoves` non toglie il gettone per una mossa così segnata (deroga stampata a RP-15) | i due modelli tengono il gettone; gli stili preferiscono Lo sapevo contro una carta mostrata |
| Conto salato (CES-AR4) | passo `gettone` nei dati (`DataCards`): i passi annidati si applicano solo se il soggetto ha un gettone (`Step.ifToken`) | gli stili contano il danno condizionato se il bersaglio mostra un gettone |
| Scatto Repentino (GEN-03) | `base.com.ShuffleFeet`, sottoclasse della carta viva (modificarla era fuori perimetro): scambio degli oggetti vicini nel rispetto delle capacità (`Kind.SWAP_ITEMS`) | valore `SWAP_ITEM` per oggetto in più |
| Santino (OGG-15) | `base.items.SantinoDellaPortinaia`: consumato, immunità all'effetto periodico di L per 3 turni | — (escluso dalla fedeltà come ogni timer) |

Le contromosse non annullano di nuovo una mossa già annullata. A pari priorità gli annullamenti seguono **l'ordine della lista delle mosse, non i gruppi di RP-1**: lo dichiaro senza correggerlo, come chiede il prompt. I pesi `COUNTER_WEIGHT` 2 e `SWAP_ITEM` 3 sono arbitrari e non misurati.

## Cancelli prima di cambiare la bozza

| Cancello | Esito |
|---|---|
| Passo 0 sulla 1.6b (`0b8806e` contro il codice nuovo, 4 semi, 8.640 partite) | **identico byte per byte** in tutti i file tranne `seconds.txt`; `matrix.json` identica anche a `sb-16i-b2/step0-matrix.json.gz` ([impronte](sb-17/identity.json)) |
| Identità viva 1.13 (480.000 partite) | **identica** alla base nella stessa cartella (JSON 266.869 B, Markdown 26.112 B); un byte in più delle impronte storiche per il percorso nell'intestazione |
| Fedeltà con un braccio «sergio» (prova-sergio su un posto alternato) | `TurnForecast` 6.102/6.102 (106 turni saltati per i timer); `ViewTable` primo turno 6.102/6.102, due turni 3.778/3.778. Nel campione: 93 riflessi, 120 gettoni tenuti, 23 Conto salato sul gettone, 33 scambi; i test esigono che ognuno sia > 0. Riverificato sulla bozza finale (salute 85, Conto salato 20) |
| Mutazioni | **7/7 uccise** ([dati](sb-17/mutations.json)); non mutata la valutazione dei bot (`StyleSupport`), che nessun test di fedeltà fissa |
| `Sb17CardsTest` | 17 test: riflesso (metà, per tipo, troncato, mai su una carica, troppo lento, sul colpo col gettone, a terra), Lo sapevo (gettone tenuto con e senza altre copie, mossa non annunciata, fuori dal playground), Conto salato, rifiuti del passo `gettone`, Santino, Scatto Repentino |

## Bozza

Sergio Sommerso (`base.character.Cesira`, R): H **85** (75 in D106, riserva del giro 2), A 30, V 10, 2 oggetti; basic Lo metto in conto; bound Mi informo, Battutina, Frecciatina al volo. Carte d'archetipo CES-AR1–AR6 come D106, con Conto salato a **8 + 12 sul gettone** (riserva del giro 3). Generiche e oggetti del mazzo (D107): STORDIAMOTI HO DETTO, Sgambetto, Scatto Repentino, Acqua in faccia, Tartaruga, Santino, Espresso. Ogni descrizione GUI comincia con l'ID della griglia; rarità come la griglia (`rarita-bozza.py --check`). La griglia ha le righe PG-CES e CES-* aggiornate, con le riserve barrate.

## Giro

Regole `d50`, 12 stili letali (4 tempi × aggressivo, prudente, risorse), 144 celle per incontro, posti alternati. Quote dal lato di Sergio sulle decisive; patte e turni su tutte le partite del gruppo; «euristici» = due bot euristici (D93).

| Incontro | Giro 1 (H 75) | Giro 2 (H 85) | **Giro 3 (H 85, Conto 20)**: quota / patte / turni | Fuori D95 al giro 3 |
|---|---|---|---|---|
| Sergio–Sergio | 48,1% | 49,0% | 48,4% / **14,4%** / 16,2 | patte (+4,4) |
| Sergio–Spazienzio | 24,0% | 37,0% | **38,7%** / 5,6% / 11,6 | — |
| Sergio–Mara | 12,5% | 23,2% | 26,0% / 6,5% / 12,7 | quota (−9,0), durata (+0,7) |
| Sergio–Celestina | 1,6% | 2,5% | 3,6% / 2,3% / 12,2 | quota (−31,4), durata (+0,2) |
| Sergio–Piera | 2,6% | 4,8% | 7,2% / 1,8% / 11,9 | quota (−27,8) |
| Sergio–Beppe | 9,5% | 15,3% | 23,0% / 2,9% / 10,1 | quota (−12,0) |

Tutti gli stili e `com` contro `com`, invarianti, uso delle carte e contatori: [giro 1](sb-17/round-1.md), [giro 2](sb-17/round-2.md), [giro 3](sb-17/round-3.md); dati grezzi del giro 3 compressi in `sb-17/round-3-*.json.gz`. Invarianti 0 e bound oltre il tetto 0 in tutti i giri.

**Carte (giro 3, euristici).** Conto salato è giocato nel 98,7% delle partite, Battutina nel 91,2%: **quasi sempre**. Mi informo (6,2%) e Scatto Repentino (3,4%) **quasi mai**. Le altre fra il 30% e l'88%. Ricerche di Oh, guarda là fallite 21,7%; **mazzo esaurito nel 32,0%** delle partite (23,5% al giro 1: le partite più lunghe lo consumano).

**Perché Sergio perde (lettura dei contatori, giro 3).** Ricatto e Lo sapevo annullano quasi sempre quando sono giocati (Ricatto 85–100%), ma Lo sapevo tiene un gettone solo nel 4–28% degli annullamenti e **Conto salato trova il gettone solo nel 4–22% delle giocate**: la combinazione che dovrebbe incassare la lettura succede di rado coi bot. Contro Celestina e Piera, che caricano poco, il triangolo voluto da D106 (punto «anti-starter per costruzione») gioca contro Sergio. Limite noto: i bot sottostimano le contromosse (D33).

## Ricerca per mutazione (SB-7)

`BenchMeasureTest#search` sul personaggio di Sergio, parametri standard tranne **25 generazioni al massimo** (per il tetto di 450 s), tre stili euristici **senza** il letale, avversari tutti i mazzi della bozza (specchio compreso), convalida su semi disgiunti ([rapporto](sb-17/search.md)). 128,8 s di calcolo.

| Partenza | Quota di convalida | Contro gli starter | Lo starter (prova-sergio) |
|---|---|---|---|
| prova-sergio | **97,2%** | 95,4–99,4% | 21,8% |
| casuale | 92,9% | 89,7–94,0% | — |

Il criterio «mazzo costruito non oltre il 65–70%» è **superato di molto**, ma i mazzi trovati scartano tutte le carte d'archetipo di Sergio (resta una Lo sapevo nella partenza casuale) e usano carte d'archetipo altrui (Going Berserk, Sgommata, Cinghiata, Break your toy) e oggetti: è una misura della forza del pool, non di Sergio, e **non si corregge sulle sue carte**. Per D95 contro gli starter vale per ora la soglia minima; i criteri completi tornano in SB-20 e SB-21.

## Budget

| Voce | Tetto | Speso (orologio) |
|---|---:|---:|
| Passo 0 (base 28,3 + nuovo 24,4) e fattibilità (18,0) | 150 | 70,7 |
| Giri 1–3 | 3 × 400 | 109,1 + 117,2 + 121,2 = 347,5 |
| Ricerca per mutazione | 450 | 132,5 |
| Riserva | 200 | 0 |
| **Totale** | **2.000** | **550,7** |

Fuori budget: identità viva (circa 181 s), suite, contesto Spring, mutazioni ([budget](sb-17/budget.json), [lanciatore](sb-17/run.ps1), [analisi](sb-17/analyze.py)). Mai due misure o due Maven insieme.

## Verifiche

`./scripts/build.ps1 -Task Test -Offline` verde (902 test, 0 falliti); `-Task TestServerContext` verde (contesto Spring completo, verifica distinta); `verify-match-manifests.py` PASS; `check-rules.py`, `check-links.py` (0 link rotti), `git diff --check` e `rarita-bozza.py --check` verdi.

## Dichiarazioni

1. **Test adeguati di proposito** all'ingresso di Sergio (nuovo helper `Sb17`): `Bozza16Test` confronta la 1.6b senza Sergio; `SetBaseDraftTest` conta un personaggio, un mazzo, 3 bound, 6 coppie e 2 stati con durata in più, nuove rarità (93 carte: 38 C, 45 NC, 10 R), Sergio escluso dal test della salute dei base; `BozzaDraftTest`: prova-sergio entra nel pool del profilo `bozza`. `Sb17CardsTest` segue le due riserve (Conto salato 30 col gettone). I javadoc di `StyleSupport` dicono `SWAP_ITEMS` e non il nome della carta (`BotStylesTest`).
2. **Bozza di riferimento non rigenerata:** `genera-bozza-di-riferimento.py --verifica` è rosso perché `bozza-di-riferimento.md` è fuori perimetro; il generatore chiamerebbe «starter» il mazzo di prova.
3. Col profilo `bozza` del server, prova-sergio compare in «Con un tuo mazzo» (passo 1 del client verificato).
4. prova-sergio ha 3 rare distinte (Malelingue, Sgambetto, Santino).
5. «A terra»: il riflesso di Ricatto può portare a 0 l'autore del colpo e chiudere la partita a favore di Sergio.
6. L'ordine degli annullamenti a pari priorità (lista, non gruppi di RP-1), dichiarato e non corretto.

## Cosa giudica il proprietario

Se Sergio va rifatto o accettato debole fino alle prove umane: le riserve scritte sono esaurite e i giri massimi usati. Gli scostamenti dalla soglia sono grandi (fino a −31 punti) e concentrati sugli starter che caricano poco.

## Domande

1. Sergio resta sotto D95 contro Mara, Celestina, Piera e Beppe: **riprogettare** (Fase A2 con carte nuove, per esempio un colpo proprio non condizionato) o **accettare** la bozza attuale fino alla prova umana?
2. Conto salato è quasi sempre giocato e trova il gettone di rado: il gettone va reso più frequente (Oh, guarda là con gettone proprio) o il danno spostato fuori dalla condizione?
3. Mi informo e Scatto Repentino sono quasi mai giocati: sostituirli nel mazzo di prova?
4. Le patte dello specchio (14,4%) contano già per Sergio, che non ha starter?
5. La ricerca per mutazione dà mazzi da 95–99% senza carte di Sergio: aprire un filone sul pool (carte d'archetipo altrui nei mazzi costruiti), o rimandare a SB-20/21?
6. Rigenerare `bozza-di-riferimento.md` con prova-sergio (e chiamarlo mazzo di prova nel generatore) in un blocco a parte?
