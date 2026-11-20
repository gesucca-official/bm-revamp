# SB-21z — ultimo bilanciamento: numeri belli, criteri assoluti, starter e costruiti

Regia in esecuzione (D161 (4): il proprietario non poteva aprire sessioni da mobile), 20 novembre 2026. Fonte: [D161](../../set-base-decisioni.md#decisioni-del-proprietario), dopo lo STOP di [SB-21h](sb-21h-report.md). Strumenti ed evidenze in [sb-21z](sb-21z/).

## Esito

- **Starter: criteri di D161 (2) rispettati** dal candidato `z2` (SHA-256 `98f9a490…2abea9`; consegnato come `server/src/test/resources/set-base/sb-21z/candidata-z2.json`, `1e6d97d0…a2d307`, con i soli nomi delle due bound di Spazienzio in maiuscolo come le sue carte), misurata su 200 semi per cella (due serie indipendenti, da 7.000.000 e da 7.500.000), 12 stili euristici per lato:
  - tutte le 21 coppie fra 39,7 e 63,0%, 17 su 21 nel 40–60;
  - durata media 8,52 turni, patte 4,10%;
  - specchi al più 13,81 turni (Sergio) e 11,28% di patte (Beppe).
- **Numeri belli (D161 (3)): 0 violazioni** su personaggi e 117 carte (controllo nuovo [belli.py](sb-21z/belli.py)).
- **Bound entro +10 (D159 (2))** sulle due serie. Beppe (b) è a filo: +9,6 e +10,6, media +10,1, dentro l'errore di circa ±3,5 punti.
- **Costruiti: criterio non raggiunto.** Nessun costruito vince tutti e sei gli scontri, ma 12 scontri fra costruiti superano il 70%. La forza dei costruiti segue la salute del personaggio (sotto): **domanda al proprietario**.
- **`bozza.json` resta quella di SB-21g.** Adottare z2 fa fallire 31 test che fissano i valori di SB-21g e il tetto delle bound di D33/D36, superato da D159 (sotto, Verifiche). Si adeguano quando il proprietario sceglie se congelare o fare un altro blocco, per non farlo due volte.
- Tempo di banco: 12.609 s (57 misure, comprese due fermate a metà), di cui circa 6.300 s nella ricerca dei costruiti.

| Criterio D161 (2) | Valore | Esito |
|---|---|---|
| Coppie di starter nel 35–65% | 21/21 (min 39,7, max 63,0) | sì |
| Durata media ≤ 10 turni | 8,52 | sì |
| Turni medi di ogni specchio ≤ 15 | max 13,81 (Sergio), Celestina 13,14 | sì |
| Patte ≤ 6% in totale | 4,10% | sì |
| Patte ≤ 12% in ogni specchio | max 11,28% (Beppe), Celestina 11,00% | sì |
| Nessun costruito 6/6 | massimo 5/6 (Beppe, Duccio) | sì |
| Nessuno scontro fra costruiti oltre il 70% | 12 scontri oltre | **no** |

## Candidato consegnato

Partenza: il candidato `k1` di SB-21h (bound di D160 coi valori tenuti; Sergio (b) senza risorsa). Tre passi.

**1. Numeri belli** ([z0.py](sb-21z/z0.py)): 47 numeri fuori regola, portati al valore bello più vicino. Sui pareggi la scelta è carta per carta, motivata nel file.
- Personaggi: Spazienzio e Piera 78 → 80, Celestina 66 → 65, L di Piera 14 → 15.
- Carte: 12 → 10 (8 carte), 14 → 15, 16 → 15, 18 → 20, 24 → 25, 26 → 25, 28 → 30. I 3 vanno a 2 o 4 secondo il ruolo.
- Bound e last resort:
  - i colpi da 1 HIT delle bound diventano 2;
  - Beppe (a) +2 V e 2 HIT; Sergio (a) +2 A e 2 HIT; Celestina (b) +2 T;
  - TESTA AL MURO 4 HIT a sé;
  - «Rincara 5 (1 a sé)» e «Rincara 4 (1 a sé)» diventano 2 a sé.
- Testi: «Mi rialzo dal marciapiede» stampa «al più 30 [[H]]» invece di «da 1 a 30». La soglia 1 (vivo) resta nei dati e non si stampa.

**2. Ricerca sulle leve** ([cerca.py](sb-21z/cerca.py), storia in [ricerca-leve.json](sb-21z/ricerca-leve.json)).
- Un passo sceglie il personaggio più lontano dal 50% in media, muove salute o risorsa iniziale di 5 e rimisura solo la sua riga a 100 semi. Tiene la mossa solo se l'obiettivo scende.
- Dopo 15 prove gli scarti medi erano tutti entro ±3. Restavano quattro problemi di coppia, chiusi con prove mirate ([prova.py](sb-21z/prova.py)):
  - Beppe 75 di salute e 25 di V: Beppe–Duccio da 33,7 a 43; patte del suo specchio da 14,9% a 11,3%;
  - Celestina 65 di salute e 20 di T: Celestina–Beppe da 32 a 40. Dipende meno dagli oggetti, che Beppe ruba e distrugge;
  - Sergio A iniziale 35: Celestina–Sergio da 65,3 a 56;
  - «L'ultima dose» senza rincaro a sé: patte dello specchio di Celestina da 13,3% a 10,2%. Il testo ora stampa solo «Rincara 5» (generatore aggiornato).

**3. Sergio (a)** «Battutina»: con +2 A e 2 HIT sta a +13,6 punti, oltre +10. Diventa **pulizia più 2 HIT**, come le (a) di Spazienzio, Mara, Piera e Duccio: +9,3 e +10,5, in media +9,9. La riga di Sergio è rimisurata sulle due serie.

| Personaggio | Salute | Risorse iniziali | Altro |
|---|---|---|---|
| Spazienzio | 78 → **70** | | |
| Mara | 70 → **65** | A 40 → **45** | |
| Celestina | 66 → **65** | T 15 → **20** | L'ultima dose: nessun rincaro a sé |
| Piera | 78 → **80** | L 14 → **15** | |
| Beppe | 80 → **75** | V 25 | |
| Sergio | 85 | A 30 → **35** | Battutina: pulizia + 2 HIT |
| Duccio | 115 | A 15 | |

Matrici: [z0](sb-21z/matrice-z0.json) (dopo i numeri belli), [z1](sb-21z/matrice-z1.json) (dopo la ricerca, due serie) e [z2](sb-21z/matrice-z2.json), il candidato.

## Spazienzio: il salto viene dai bot

Riga di Spazienzio contro i sei, scarto medio dal 50%, 100 semi ([diagnosi](sb-21z/spazienzio-diagnosi.txt)):

| Bound di Spazienzio | Scarto |
|---|---:|
| z0: (a) pulizia + 2 HIT, (b) +5 V e difesa | +13,4 |
| (a) e (b) di SB-21g (3 HIT; +5 V) | +4,1 |
| Solo (b) di SB-21g | +9,9 |
| Solo (a) di SB-21g (3 HIT) | +5,4 |
| (a) = +2 V e 2 HIT | +14,4 |
| (a) = 2 HIT e basta | +13,1 |

**Una bound d'attacco più debole rende Spazienzio più forte.** Con 3 HIT gratuiti il bot la gioca spesso e perde turni di carica; con 2 HIT la ignora, accumula V e tira il colpo grosso. Il salto non viene dalla difesa né dalla pulizia: viene da come i bot giocano Spazienzio.

Lo correggo con la salute (70) e la sua (a) resta quella approvata. **Il suo equilibrio misurato è il meno affidabile del set: è il primo da giudicare al tavolo.**

## Costruiti

Ricerca dei sette come in SB-21g (strumento SB-7, due partenze, 15 generazioni invece di 25: la convalida si ferma intorno alla 15ª), poi scontri diretti a 100 semi ([liste](sb-21z/liste-z2.json), [scontri](sb-21z/scontri-z2.json)).

| Costruito | Vinti su 6 | Contro i costruiti | Contro gli starter |
|---|---:|---|---|
| Duccio | 5 | 48–98% | 98,6–100% |
| Beppe | 5 | 11–89% | 88,7–99,7% |
| Piera | 4 | 16–74% | 83,3–97,9% |
| Celestina | 3 | 37–85% | 83,6–95,7% |
| Sergio | 3 | 7–91% | 90,6–99,9% |
| Mara | 1 | 2–53% | 58,9–79,7% |
| Spazienzio | 0 | 8–47% | 68,4–88,7% |

**Diagnosi.** L'ordine dei costruiti è quasi l'ordine della salute: Duccio 115, Sergio 85, Piera 80, Beppe 75, Spazienzio 70, Mara e Celestina 65.
- Le liste si somigliano. Prendono le stesse carte generiche da colpo grosso:
  - «Lo sanno tutti» (CES-AR5, 25 HIT per 15 A), in 3 liste;
  - Sgommata (MAR-AR2, 25 CUT), in 3 liste;
  - Peroni da 66 (+20 L) con Giro secco (10 + L spesa), in 5 liste.
- Negli starter la salute compensa carte del personaggio deboli o care: per Duccio quelle pagate in salute.
- Il costruito tiene la salute e scarta le carte deboli. Il bilanciamento con la salute, giusto per gli starter, allarga il divario dei costruiti.

Il divario fra costruiti e starter era già noto (SB-21g: 35/35 oltre il 70%, D157).

## Domanda per il proprietario

D161 (5) dice di consegnare la bozza più vicina e congelare. Prima di farlo, la scelta sui costruiti:

1. **Congelare così** (consigliato se la priorità è giocare): z2 diventa la bozza, si adeguano i 31 test, i costruiti si giudicano al tavolo.
2. **Un ultimo blocco mirato sui costruiti:**
   - salute dei personaggi più vicina (Duccio da 115 verso 90, le sue carte pagate in salute meno care), compensata con le carte degli starter;
   - ritocco delle tre carte generiche che stanno in quasi tutte le liste costruite;
   - poi starter e costruiti da capo. Su questa macchina sono circa 4–5 ore.

## Scelte prese

- **Numeri belli:** regola scritta in `belli.py`, così il controllo si può ripetere.
  - Esclusi priorità, turni, divisori, percentuali e copie, e la soglia «vivo» di Mi rialzo (`healthAtLeast` 1), che non si stampa: per questo `controlla-numeri.py` la conta fra i non importi.
  - Ammesso `perAlcohol` 1 di Giro secco («10 più la L spesa», fissato da D156): non si stampa.
  - I valori tenuti di `controlla-numeri.py` (Bancone ×0,65, Sgommata ×0,8, i tre di Duccio) non sono più nella bozza: lo script li segnala come note.
- **Generatore dei testi:** «Rincara N» senza «(0 a sé)»; Mi rialzo senza la soglia. I 117 testi della bozza coincidono col generatore.
- **Misure:**
  - Le decisioni sono prese a 100 semi. A 25 semi le quote si spostano fino a 8 punti rispetto ai 100 (scarto tipico 3,5).
  - Il simulatore è deterministico: stessa bozza e stessi semi danno le stesse partite, quindi le righe rimisurate si confrontano esattamente.
  - Il giudizio finale è su due serie indipendenti, per non adattarsi ai semi: con la sola prima serie Mara–Sergio era 34,1, con la seconda 42,7.
- **Ricerca:** la prima versione sceglieva il personaggio con la riga più costosa e tornava sempre su Beppe (la coppia storta pesa su due righe). L'ho fermata e ripresa dallo stato salvato, scegliendo per scarto medio.
- **SB-21h:** il candidato `candidata-k1.json` dei test resta com'era (stampa ancora «da 1 a 30»); nessun test confronta i suoi testi col generatore.

## Riproduzione

Dalla radice; area `server/target/sb-21z`. Le misure passano da [run.ps1](sb-21z/run.ps1) e [search.ps1](sb-21z/search.ps1), copie di SB-21h con `-Games` e `-Generations`.

1. `python -B -X utf8 docs/reports/set-base/sb-21z/z0.py server/target/sb-21h-b/k1.json server/target/sb-21z/z0b.json`. `k1.json` si rifà con `sb21h.py starter k1 …` di [SB-21h](sb-21h-report.md#riproduzione), oppure è `server/src/test/resources/set-base/sb-21h/candidata-k1.json`.
2. Matrice z0: `sb21z.misura('z0', …/z0.json, 100)`; righe di Celestina e Piera su z0b; diagnosi: `spazienzio.py`, `spa-a.py`.
3. Ricerca: `cerca.py server/target/sb-21z/z0b.json server/target/sb-21z/round-z0 …/round-z0b-starter-tossico …/round-z0b-starter-pino`. Poi le prove mirate con `prova.py` nell'ordine di `ricerca-leve.json` (`manuali`).
4. z1 dalle modifiche finali di `ricerca-leve.json`; z2 = z1 con `base.cesira.bound.Battutina` `self` = pulizia di T e L (un quarto).
5. Bound: `bound10.py <bozza> <etichetta> [personaggi] [--seme 7500000]`.
6. Costruiti: `costruiti.py ricerca server/target/sb-21z/z2.json z2`, poi `costruiti.py diretti server/target/sb-21z/z2.json z2`.

## Verifiche

- Sui candidati: `controlla-numeri` (0 violazioni), `controlla-testi` (117 carte), `belli.py` (0), a ogni bozza costruita dal banco.
- Con z2 al posto di `bozza.json` (prova, poi ripristinata): `genera-bozza-di-riferimento.py --scrivi` e `--verifica`, `rarita-bozza.py --check consistent`, `check-rules.py`, `check-links.py` verdi.
- Sempre con z2 in bozza, `./scripts/build.ps1 -Task Test -Offline`: server 970 test, **31 falliti**, tutti su valori o regole della bozza cambiati di proposito, in 8 classi:
  - `SetBaseDraftTest`, `StarterRedesignTest`: salute e risorse degli starter, danni e cure arrotondati;
  - `Sb17CardsTest`, `Sb18CardsTest`, `Sb19CardsTest`, `Sb19InPlayTest`: danni, costi e malus arrotondati;
  - `Bozza16Test`, `GoingBerserkTest`: rincari a sé, dati di Spazienzio;
  - tetto delle bound D33/D36 (`tetto-bound` di `SetBaseDraftTest`, `duccioBoundsStayUnderTheD36Cap`, `theAlcoholBoundReturnsUnderTheUnchangedCap…`), superato da D159;
  - binding di CES-BO1 (`MiInformo` → `NeRiparliamoFuori`, variante Java di SB-21h).
  Un fallimento era un errore vero: le bound di Spazienzio devono avere il nome in maiuscolo (`spazienziosCardsShoutTheirNames`), corretto nel candidato.
- Sulla bozza in vigore (SB-21g, ripristinata), con le modifiche di questo blocco a generatore e controlli: server 970 test, 0 falliti, 23 saltati; client 37/37; `controlla-numeri`, `controlla-testi`, `genera-bozza-di-riferimento.py --verifica` verdi. Il contesto Spring completo non è rilanciato: nessun file Java toccato da questo blocco.

## Stato

- Starter, numeri belli e bound: fatti nel candidato z2; `bozza.json` è ancora quella di SB-21g.
- Costruiti: oltre il 70% in 12 scontri; la scelta è del proprietario (sopra).
