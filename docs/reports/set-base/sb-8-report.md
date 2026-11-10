# SB-8 — Bozza giocabile da umani: rapporto

**Fatto il 10 novembre 2026 e approvato dal proprietario lo stesso giorno**, con le sue parole: «Approvo SB-8» ([D46](../../set-base-plan.md#decisioni-del-proprietario)). Il server di sviluppo gioca la bozza del Set Base con un
profilo Spring nuovo, `bozza`, e client-web la mostra **senza nessuna modifica**: il server gli manda carte, personaggi e collezione
della bozza nella stessa forma del catalogo. Col profilo normale nessuna carta, personaggio o mazzo della bozza è raggiungibile.
Partita viva, regolamento, documento del set, allegato, `cards.sqlite`, client-web, client-debug e strumenti di verifica del client
non cambiano.

Il blocco apre le prove umane SB-12b (starter base) e SB-16 (avanzati). Piano: [SB-8](../../set-base-plan.md#sb-8--bozza-giocabile-da-umani).

## Decisioni del proprietario sulla fase A

La fase A (proposta letta, senza modifiche) è stata approvata dal proprietario con le parole **«Approvo tutto»**, riportate dalla
regia: le undici domande con tutte le raccomandazioni, un blocco solo, solo server. Le scelte:

1. Caricatore in `server/src/main`, stesso package, classi Java di bozza nel jar, bozza letta da file.
2. Profilo `bozza` solo con `local` (o `test`), database separato, `dev.ps1 -Bozza`.
3. Starter scelto nell'hub come mazzo pronto (open 1vCom); quick, 1v1 e FFA a caso da una riserva.
4. Computer con uno stile euristico di SB-4 scelto all'avvio, casuale ancora disponibile; R03 non cambia (solo sviluppo).
5. Collezione ed editor della bozza, salvataggio nel database separato.
6. Prefisso dello slot («SPA-BA ·») tenuto nei testi per le prove.
7. Rarità non mostrata fino a SB-31.
8. client-debug senza modifiche.
9. Verifiche: `Verify` col profilo bozza e `VerifyDecks` col profilo normale a 1366×768 e 844×390, più TestServerContext.
10. Un blocco solo, solo server.
11. Archivio con `versions.draft` e `botPolicy` vero; `verify-match-manifests.py` invariato.

Ordine con C4, compreso in «Approvo tutto»: SB-8 fase B subito, le fasi B di C4-1c e C4-8a dopo il commit di SB-8.

## Come si avvia

```powershell
./scripts/build.ps1 -Task Server -Offline
./scripts/dev.ps1 -Task Server -Bozza -SeedAccounts
./client-web/run.ps1 -Task Serve     # in un secondo terminale; http://127.0.0.1:4320
```

Opzioni di `dev.ps1` col profilo: `-Pool 'starter-spazienzio,starter-mara'` (starter di quick, 1v1 e FFA), `-Com starter-pino` o
`pool` (mazzo del computer), `-Bot risorse|aggressivo|prudente|casuale` (stile del computer), `-Draft <percorsi>` (altra bozza, più
set separati da `;`). Dettagli in [setup](../../setup.md#avvio-con-la-bozza-del-set-base-sb-8).

- **Stile predefinito `risorse`:** è quello che batte di più il casuale nella media dei quattro abbinamenti di SB-4 (+0,292, contro
  +0,286 del prudente e +0,253 dell'aggressivo; [SB-4](sb-4-report.md)). `casuale` è il `ComPlayer` della partita viva.
- **Il proprio starter:** in «Con un tuo mazzo» compaiono `starter-gigi`, `starter-mara`, `starter-pino`, `starter-spazienzio` e
  `starter-tossico`, per ogni account. Sono in sola lettura: salvarli o cancellarli col loro id è rifiutato dal server («Deck
  identifier reserved for a ready deck»); una copia con un altro id si salva.

## Cosa cambia nel server

**Spostati con `git mv`, senza cambiare una riga** (rinomina al 100%): `Draft`, `DataCards`, `PlayerSource` da
`server/src/test/java/com/gsc/bm/sim/` a `server/src/main/java/com/gsc/bm/sim/`; `base.pino.GoingBerserk`, `base.pino.UltimoGiro`,
`base.gigi.LavoroFattoBene` da `server/src/test/java/.../model/cards/base/` a `server/src/main/java/.../model/cards/base/`. Stesso
package: i test di `sim` (PlaygroundTest, SetBaseDraftTest, MultiSetTest, banco, listino) non cambiano. `mini.RintoccoDiCampana` resta
nei test. `DataCards.load()` legge ancora `/sb-5/cards.json` dalle risorse di test: lo usano solo i test.

**Nuovi, solo col profilo `bozza`** (`com.gsc.bm.bozza`, tutti `@Profile("bozza")`, le fabbriche anche `@Primary`):

| Classe | Cosa fa |
|---|---|
| `BozzaDraft` | Legge la bozza (`app.bozza.sources`), controlla profili, riserva, computer e stile; rifiuta l'avvio con il messaggio del caricatore. È anche l'identità della bozza per l'archivio. |
| `BozzaCardFactory` | Carte della bozza coi numeri e i testi della bozza. Ripieghi: testo avvolto con le parole chiave come `CardFactoryServiceImpl`, immagine assente → `no-img.png` come il catalogo, basic riservata al personaggio di cui è la basic fissa (R02). |
| `BozzaCharacterFactory` | Personaggi a dati della bozza; la vista come per i personaggi vivi. |
| `BozzaCatalog` | Collezione, esistenza di carte e personaggi, nome dei personaggi, mazzi pronti: tutto dalla bozza. Sprite assente. |
| `BozzaPlayerFactory` | Quick, 1v1 e FFA dalla riserva; computer col mazzo e lo stile scelti (`BotPlayer` di SB-4, o `ComPlayer`); open con un mazzo pronto (passa da `DeckRules` come un mazzo salvato) o con un mazzo salvato (la fabbrica viva, che riceve le fabbriche della bozza). |

`com.gsc.bm.sim.DraftSource` è la facciata pubblica di `Draft` (che resta di package) per quelle classi. `application-bozza.yml`
mette i valori predefiniti e il database `./data/bm-bozza.sqlite`.

**La cucitura nella partita viva, a comportamento identico.** `ViewExtractorServiceImpl` cercava il personaggio in SQLite **per nome di
classe**: con un personaggio a dati della bozza (tutti e cinque, anche Spazienzio) le viste sarebbero fallite. Un'interfaccia nuova,
`service.catalog.CatalogSource`, dà collezione, esistenza di carte e personaggi, nome e sprite dei personaggi e mazzi pronti;
`SqliteCatalogSource` fa le stesse query di prima. La usano:

- `ViewExtractorServiceImpl`: la chiave è `getBindingName()`, che per ogni classe viva è il nome della classe senza il package delle
  carte, cioè la chiave di prima (provato su tutte le righe di CRD003 in `BozzaProfileOffContextTest`).
- `UserAccountServiceImpl`: collezione, convalida del salvataggio, mazzi pronti (nessuno nel catalogo vivo; senza mazzi pronti il
  codice segue il percorso di prima, anche nell'ordine). Il costruttore coi repository resta, per `UserAccountServiceImplTest`.

Altri tre ritocchi: `MatchVersions` aggiunge `draft` solo se esiste l'identità della bozza (senza profilo la mappa è identica);
`MatchArchiveService` scrive in `configuration.botPolicy` il nome dello stile di un `BotPlayer`, «random» altrimenti come prima;
`BotPlayer.policyName()` lo fornisce (non è una proprietà: le viste non lo portano). Fabbriche vive, motore e `cards.sqlite` non
cambiano.

**Fuori dal server:** `scripts/dev.ps1` (`-Bozza`, `-Pool`, `-Com`, `-Bot`, `-Draft`); `scripts/check-rules.py`, **una riga**: il
controllo del vocabolario delle rarità legge `RARITIES` da `Draft.java`, che ora sta in `server/src/main/java/com/gsc/bm/sim/` invece
di `server/src/test/java/com/gsc/bm/sim/`; stesso file, stessa costante, stesso controllo.

## Regola del diff per i giri di bilanciamento

Finora un giro provava di non toccare il motore con un diff senza `server/src/main`. Ora la bozza vive in parte lì, quindi la regola
diventa, nel piano ([metodo e criteri](../../set-base-plan.md#bilanciamento-metodo-e-criteri)): **nessun file di `server/src/main`
cambiato fuori da `com/gsc/bm/sim` e `com/gsc/bm/model/cards/base`**, oltre a nessun cambiamento a `cards.sqlite`, regolamento,
documento del set, allegato e client. Motivo: quei due package sono la bozza (caricatore e carte Java di bozza), che il profilo
normale non raggiunge; il resto è la partita viva.

## Il client

Nessun file toccato. Cosa fa client-web con la bozza, coi ripieghi che ha già:

- **Illustrazioni:** dall'atlante per `bindingName`; un id che non conosce prende il segnaposto neutro (`art.ts`). Spazienzio e
  Celestina hanno gli id del catalogo e la loro illustrazione di oggi (Celestina quella del Tossico); Mara, Pino, Gigi e le 44 carte
  nuove hanno il segnaposto.
- **Ruolo, danno, guadagni:** la bozza usa i sette ruoli noti, HIT, CUT e POISON, guadagni come «+12 H, +3 T»: tutto già letto.
- **Nomi e numeri:** il client cerca costi, guadagni, colpi e oggetti per nome nella collezione, e le risorse iniziali per binding.
  Con la collezione della bozza trova i numeri della bozza (per esempio BreakYourToy a 5 V e Spazienzio a 85 di salute, non 10 V e il
  valore del catalogo).
- **Testo:** il prefisso dello slot resta visibile nell'ispezione (scelta 6). **Rarità:** non è nel protocollo (scelta 7).
- **Collezione:** i mazzi pronti compaiono anche fra i mazzi della collezione; modificarli o cancellarli col loro id dà l'errore del
  server, una copia con un altro id si salva.
- **client-debug:** nella sua collezione l'immagine dei personaggi è `assets/img/characters/{{sprite}}`: per i cinque della bozza lo
  sprite è nullo e l'immagine non si carica (resta il testo alternativo). Solo col profilo bozza; in partita client-debug non usa
  immagini. Dichiarato, nessuna modifica (scelta 8).

## Protocollo e archivio

Viste con la stessa forma e gli stessi campi; `bindingName` nuovi (`base.*`) per carte e personaggi; nomi della bozza. Col profilo
`INITIAL.versions.draft` contiene `sources` (percorso e SHA-256), `sets` (`base`: «Set Base», versione «bozza»), `pool`, `com`, `bot`;
`catalogSha256` resta quello del `cards.sqlite` impacchettato, che in quelle partite non fornisce le carte. Le partite stanno nel
database separato. [match-archive.md](../../match-archive.md#versioni-reali) aggiornato.

## Verifiche

Una alla volta, dopo aver controllato che non girassero Java, Maven o Playwright di questo repository e che le porte 8080 e 4320
fossero libere; working tree con i soli file del blocco.

- `./scripts/build.ps1 -Task Test -Offline`: **verde.** Maven 658 test, 0 falliti, 7 saltati (le misure a richiesta; i test di
  contesto sono esclusi da questo comando); client 37 su 37. PlaygroundTest (138), SetBaseDraftTest, MultiSetTest,
  CatalogEffectsTest, RulesConformanceTest e i contratti verdi senza toccarne un atteso; nessun test esistente cambiato. Test nuovo:
  `BozzaDraftTest` (profili ammessi e rifiutati, la bozza del Set Base coi suoi cinque starter; riserva, computer, stile e bozza errati
  fermano l'avvio).
- `python scripts/check-rules.py`: **verde**, con la riga nuova che legge `Draft.java` in `server/src/main`.
- `./scripts/build.ps1 -Task TestServerContext -Offline`: **verde**, 775 test, 0 falliti, 7 saltati, 7:29 min. Comprende i due test
  di contesto nuovi:
  - `BozzaProfileOffContextTest` (profilo normale, 6 prove): nessun bean della bozza; collezione uguale a CRD001 e CRD003, senza `base.`
    né `mini.`, nessun mazzo pronto; carte (anche `base.pino.UltimoGiro`, la cui classe è nel jar), personaggi e mazzi della bozza
    non raggiungibili; salvataggio con una carta della bozza rifiutato («Unknown or missing card»); open con `starter-*` non
    disponibile; 50 giri di quick e computer solo con Bruiser e Junkie e carte SQLite, computer `ComPlayer`; `versions` senza `draft`
    e uguale a `new MatchVersions()`; nome e sprite di ogni personaggio vivo per binding uguali alle righe di CRD003.
  - `BozzaCliTest` (profili `test` e `bozza`, CLI `cli-draft-complete-test.cjs`): collezione coi cinque personaggi e le 71 carte della
    bozza, mazzi pronti, mazzo pronto non salvabile, copia salvata e cancellata; quattro partite intere fino all'esito, ognuna con
    carte della bozza giocate ([riepilogo](sb-8/cli-summary.json)):

    | Modalità | Starter dell'umano | Turni | Esito | Carte della bozza giocate dall'umano |
    |---|---|---:|---|---|
    | open 1vCom | Piera (`starter-pino`) | 19 | patta | 9, fra cui `UltimoGiro` e `GoingBerserk` (Java) |
    | open 1vCom | Beppe (`starter-gigi`) | 14 | vince il computer | 8, fra cui `LavoroFattoBene` (Java) |
    | quick 1vCom | dalla riserva | 8 | vince l'umano | 2 |
    | quick 1v1 | dalla riserva (Mara) | 18 | vince l'altro account | 7 |

    Ogni export ha `versions.draft` con lo SHA-256 della bozza (`c43b37a5…de842cda`) e il Set Base «bozza»; `botPolicy` è
    `ResourceAwarePolicy` contro il computer e «random» nella 1v1; ogni export riletto dall'archivio coincide.
- Jar rifatto (`./scripts/build.ps1 -Task Server -Offline`): contiene `com/gsc/bm/bozza`, `com/gsc/bm/sim`, `model/cards/base` e
  `application-bozza.yml`, **nessun file di bozza** (`bozza.json` resta fuori).
- **Partita reale nel browser col profilo bozza** (jar, `local,bozza`, database temporaneo, `client-web/run.ps1 -Task Serve`).
  `Verify` così com'è **non può girare sulla bozza**: confronta ruolo e guadagni di ogni carta in mano con l'allegato del regolamento
  (`docs/rules-catalog.json`), cioè col catalogo vivo, e si ferma alla prima carta della bozza («catalog has Preso al volo»). Non è un
  difetto del client: lo strumento verifica il catalogo vivo. Siccome SB-8 non modifica gli strumenti del client, l'ho lanciato da
  una **copia fuori dal repository** che cambia soltanto il riferimento (la bozza invece dell'allegato) e l'import di Playwright per
  percorso assoluto: [diff](sb-8/verify-bozza.diff).

  | Misura | Partite | Personaggi | Turni controllati | Carte controllate | Errori | Esito |
  |---|---:|---|---:|---:|---:|---|
  | 1366×768 | 2 | Piera, Beppe | 29 | 174 | 0 | verde |
  | 844×390 | 2 | Piera, Mara | 18 | 108 | 0 | verde |

  Tutti i controlli dello strumento passano: trascinamento, tocco, riordino, bound con scarto, oggetto, rifiuto, effetto periodico,
  ruoli e guadagni dal server, carte non pagabili attenuate, risorse sul tavolo. Evidenze: [1366×768](sb-8/verify-1366x768.json),
  [844×390](sb-8/verify-844x390.json), catture del [tavolo](sb-8/verify-08-c2a-table-1366x768.jpg), della
  [bound con scarto](sb-8/verify-03-bound-discard-844x390.jpg), del [resoconto periodico](sb-8/verify-05-periodic-report-1366x768.jpg)
  e dell'[ispezione](sb-8/verify-02-inspect-art-844x390.jpg). In più la scelta dello starter nell'hub
  ([1366×768](sb-8/hub-starters-1366x768.jpg), [844×390](sb-8/hub-starters-844x390.jpg)) e la collezione coi mazzi pronti
  ([1366×768](sb-8/collection-1366x768.jpg), [844×390](sb-8/collection-844x390.jpg)).
- **`VerifyDecks` col profilo normale** (`client-web/run.ps1 -Task VerifyDecks`, server temporaneo suo, jar rifatto): **verde** a
  1366×768 e a 844×390: collezione, editor, salvataggio, rifiuti e open 1vCom passano dalla cucitura come prima.
- Rimandate alla matrice di fine C4, secondo D16: le altre verifiche Playwright e 1920×1080 (nessuna geometria toccata).

## Cosa non è provato

- **Il giudizio del proprietario:** il blocco serve proprio alle sue partite (SB-12b, SB-16).
- **`Verify` dello strumento sulla bozza:** provato solo con la copia descritta sopra. Se il proprietario vuole che lo strumento lo
  faccia da sé (per esempio un'opzione che scelga il riferimento), è un cambiamento a `client-web/tools/verify.mjs`, da fare dopo C4 o
  dentro un blocco C4 che lo tocca.
- **FFA e quick 1v1 nel browser con la bozza:** la 1v1 è provata solo dalla CLI; la FFA solo per costruzione (usa la stessa fabbrica
  della quick), nessuna partita FFA con la bozza giocata.
- **iPhone e Safari, 750×292, 1920×1080:** non provati con la bozza.
- **client-debug con la bozza:** non provato; dedotto dal codice (immagine dei personaggi assente nella sua collezione).
- **Segnaposto:** le carte nuove mostrano il riquadro scuro dell'atlante al posto dell'illustrazione; leggibile nelle catture, il
  giudizio è del proprietario.
- **Riavvio del server con partite della bozza in corso:** come oggi le partite interrotte si chiudono in patta; non provato col profilo.

## Per l'altra macchina

- **Rifare il jar dopo il pull** (`./scripts/build.ps1 -Task Server -Offline`) prima di qualsiasi verifica del client: il server è
  cambiato.
- Nessun file del client, nessuno strumento di verifica del client e nessun file di C4 toccati. Il profilo normale (`local`, quello
  delle verifiche) si comporta come prima.
- Profilo nuovo `bozza`, solo per lo sviluppo e le prove umane del Set Base; nessuna verifica di C4 lo attiva.
- `check-rules.py` cambia una riga (percorso di `Draft.java`).
- Consegna registrata in [orchestrazione, «Allineamento fra le macchine»](../../orchestrazione-lavoro.md#allineamento-fra-le-macchine).

## File

Server, produzione: spostati con `git mv` `sim/Draft.java`, `sim/DataCards.java`, `sim/PlayerSource.java`,
`model/cards/base/pino/GoingBerserk.java`, `model/cards/base/pino/UltimoGiro.java`, `model/cards/base/gigi/LavoroFattoBene.java`;
nuovi `bozza/BozzaDraft.java`, `BozzaCardFactory.java`, `BozzaCharacterFactory.java`, `BozzaCatalog.java`, `BozzaPlayerFactory.java`,
`sim/DraftSource.java`, `service/catalog/CatalogSource.java`, `SqliteCatalogSource.java`, `resources/application-bozza.yml`;
modificati `UserAccountServiceImpl.java`, `ViewExtractorServiceImpl.java`, `MatchVersions.java`, `MatchArchiveService.java`,
`model/game/bot/BotPlayer.java`.

Test: nuovi `BozzaProfileOffContextTest.java`, `BozzaCliTest.java`, `bozza/BozzaDraftTest.java`; nessun test esistente modificato.

Script: `scripts/cli-draft-complete-test.cjs` (nuovo), `scripts/dev.ps1`, `scripts/check-rules.py` (una riga).

Documenti: questo rapporto ed evidenze in `sb-8/`; [piano](../../set-base-plan.md) (SB-8, stato, regola del diff),
[indice](../../README.md), [setup](../../setup.md), [CLI](../../cli.md), [archivio](../../match-archive.md),
[orchestrazione](../../orchestrazione-lavoro.md) (consegna per l'altra macchina).

Non toccati: client-web, client-debug, strumenti di verifica del client, file di C4, `cards.sqlite`, regolamento, documento del set,
allegato, `bozza.json`.
