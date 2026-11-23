# SB-28 — Fasi B e C: dettagli

Dettagli del [rapporto](../sb-28-report.md#fase-b) (sezioni «Fase B» e «Fase C»), qui per tenere il rapporto corto.

## Il passaggio (Fase B)

### Norma

- `docs/game-rules.md` **2.0** (riquadro del candidato tolto), copia client identica.
- `docs/sets/base.md` **1.0**, «Richiede il regolamento 2.0» in testa e nella revisione; lo 0.1 archiviato in
  `docs/history/set-base-0.1.md`; formato del file in `docs/formato-file-set.md`; impronte in `docs/sets/manifest.json`.

### Partita viva

- File del set in produzione: `server/src/main/resources/sets/base.json`, senza i mazzi di prova (in
  `server/src/test/resources/set-base/mazzi-prova.json`); gli starter hanno nome e categoria: base Spazienzio e Mara, avanzati
  Celestina, Piera e Beppe (D182).
- `LiveSet` (componente Spring) legge il file del set; personaggi, carte e starter vivi vengono da lì. La fabbrica applica
  `Ruleset.LIVE` = `d50` = regolamento 2.0; «1.13» resta solo per le partite archiviate e le misure storiche (`-Dsim.rules=1.13`).
- Quick: uno dei cinque starter a caso per giocatore (D182 (1)); open: solo mazzi salvati.
- «Ultimo colpo» non raggiungibile: nessuna carta viva lo stampa (D183 (3)), controllato da `check-rules.py`.
- Catalogo vivo `server/src/main/resources/cards.sqlite` scritto da `set_catalog.py --vivo`: 117 carte, 7 personaggi, 1 token, nomi
  dal set, token «Bottiglia Spaccata»; immagini nulle (fino a SB-32 il client usa `no-img.png`).
- Carte dello 0.1 uscite dal set: `bruiser.WhatchaDoin`, `com.ShuffleFeet`, `junkie.BadTrip`, `junkie.BeggingMoney`,
  `junkie.EverythingIsDrug`, `junkie.GoingBerserk`, più `bitch.SoberUp`, che nessun set usava; le classi passano ai sorgenti di
  test, dove le leggono le bozze storiche.
- Migrazione `V004__set_base_1_0_decks.sql`: cancella solo i mazzi salvati che contengono una delle sei carte uscite (D182 (3));
  scrive nel log quanti ne cancella e quanti tiene. Test: `SetBaseDecksMigrationTest`. Prova a secco su una copia del database
  locale del proprietario (`server/data/bm.sqlite`): 0 mazzi salvati, 0 cancellati.

### Pulizia (lista di SB-27)

- Le otto classi condivise prendono i numeri dal file del set: tolti `alertnessToTarget` di `YouStop` e i rami `poison <= 0` di
  `ToxicBloodDrain` (resta un controllo `poison > 0`, inerte coi numeri del set); `BreakYourToy` e `BadEducation` coi valori
  iniziali del set (5 V, 8 HIT); `Tunable` senza i numeri facoltativi di D84; `Steal`, `AmphetamineReflexes`,
  `MarvelousCocktail`, `AnotherRottenBeer` senza cambi di logica. Il token `BrokenBeerBottle` prende nome e testo della scheda
  («Bottiglia Spaccata», D168 (4)).
- Costo «A 0» di «Ce l'Hai Due Spicci?» tolto; `perAlcohol` obbligatorio nel generatore dei testi (`testi_stampati.py`), come
  nella classe. L'impronta della bozza passa a `a969dff0…`, con numeri e testi invariati.
- `tools/print-cards` stampa il set vivo; la bozza solo con `--bozza`. I rimandi «regole del playground, RP-n» di `bozza.py`
  diventano rimandi al regolamento 2.0 (R01, R02a, R03, R04, R05, R07b, R08). PDF vivi rigenerati in `output/pdf/`
  (`botte-micidiali-carte.pdf` 124 facce, `botte-micidiali-starter.pdf` cinque starter); `verify.py` OK su entrambi.

### Attese dei test che cambiano

Ogni attesa viva cambiata cita la decisione nel commento (D182 per le carte del Set Base 1.0, D183 per il regolamento 2.0).

| Test o script | Prima | Dopo | Perché |
|---|---|---|---|
| `CatalogRuntimeTest`, `ApplicationPersistenceTest` | 37 carte, 2 personaggi, immagini | 117 carte, 7 personaggi, `no-img.png` | catalogo del Set Base 1.0 |
| `BozzaProfileOffContextTest` | collezione dello 0.1 | collezione del set vivo; le carte uscite sono irraggiungibili | D182, D183 |
| `cli-security-test.cjs` | 37 carte | 117 | catalogo vivo |
| `cli-match-export-test.cjs`, `cli-*-complete-test.cjs` | regolamento 1.13, set 0.1 | 2.0, 1.0 | versioni registrate |
| `cli-quick-duel-test.cjs`, `cli-quick-ffa-test.cjs`, `cli-open-complete-test.cjs` | «Banzai!!!» 5/10 HIT fisso, salute sotto zero | «Addosso!!!» con Rincara 5 (2 a te), pavimento a zero, salute dei personaggi vivi | 2.0 (R01, R07b) e set 1.0 |
| `WebSocketIdentityTest` (bot) | 55 HEALTH | 60 | «Gargantuesco Impatto» 35 HIT (0.1: 45) |
| `WebSocketIdentityTest` + `cli-card-choices-test.cjs` | B 78 HEALTH, A 15 e B 5 ALERTNESS | 81, 10, 28 | «Desiderio Incontrollabile» +5 T senza il costo di metà A; «Svegliamoci - Ma Tu No» 2 HIT senza +5 A; token «Bottiglia Spaccata» |
| fixture con `com.ShuffleFeet` | carta 0.1 | `base.com.ShuffleFeet` («Scatto Repentino») | carta uscita |

## Verifiche

Vedi il [rapporto](../sb-28-report.md#verifiche-della-fase-b).

### Strumento cambiato: `client-web/tools/verify-ffa.mjs`

Il controllo di riservatezza di `VerifyFfa` cerca, nelle viste di un umano, i nomi delle carte che stanno solo nella mano dell'altro
umano. Con lo 0.1 nessuna carta mostrava copie; col 2.0 una ricerca riuscita mostra a tutti la copia trovata (R02a, R08), nel campo
`revealed` del giocatore. Al primo giro «Chiave da Tredici», nella mano di A, era nella vista di B; al giro di diagnosi «Alla Goccia»
era in `/players/ComPlayer_…/revealed/0/card/name` al turno 5, cioè mostrata da un computer che ne aveva una copia. Il controllo ora
toglie `revealed`, come già toglie `character`, `resolvedMoves`, `pendingMove` e `timeBasedEffects`; il resto della vista è
controllato come prima. Sulla base (0.1) `revealed` è sempre vuoto, quindi lo strumento vede gli stessi casi.

### `client-web` `Test`: i 7 rossi

`art.test.ts` (O9, 125 classi dell'allegato contro 40 riquadri dell'atlante), `frames.test.ts` (C4-4, conteggi per tipo dello 0.1),
`impact.test.ts` (C3-5, 37 carte), `public.test.ts` (intestazioni del regolamento senza R02a e R07b, del set con S5, tabelle dei
personaggi dello 0.1), `readability.test.ts` (testi inglesi degli stati confrontati con le righe dello 0.1 del documento del set).
Non toccati: adeguamento del client (SB-31) e illustrazioni (SB-32).

## Prova sul campo (Fase C)

Runner: [`partite-cli.cjs`](partite-cli.cjs). Risultato: [`partite-cli.json`](partite-cli.json). Server col jar della Fase B, database temporaneo, account `devAlice`, bot del server; mosse provate in ordine fisso, il server rifiuta quelle illegali (0 rifiuti).

| Partita | Mazzo o starter | Avversario | Turni | Esito |
|---|---|---|---|---|
| open 1vCom | `starter-spazienzio` (Spazienzio) | Celestina | 12 | sconfitta |
| open 1vCom | `starter-mara` (Mara) | Mara | 6 | vittoria |
| open 1vCom | `starter-tossico` (Celestina) | Mara | 5 | vittoria |
| open 1vCom | `starter-pino` (Piera) | Mara | 3 | vittoria |
| open 1vCom | `starter-gigi` (Beppe) | Beppe | 6 | vittoria |
| open 1vCom | `prova-sergio` (Sergio) | Spazienzio | 19 | vittoria |
| open 1vCom | `prova-duccio` (Duccio) | Celestina | 5 | vittoria |
| quick 1vCom | Piera (a caso) | Mara | 9 | vittoria |
| quick 1vCom | Piera (a caso) | Mara | 18 | vittoria |
| quick 1vCom | Beppe (a caso) | Piera | 9 | vittoria |
| quick 1vCom | Celestina (a caso) | Mara | 6 | pareggio |
| quick 1vCom | Celestina (a caso) | Piera | 8 | vittoria |
