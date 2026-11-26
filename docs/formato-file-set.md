# Formato del file del set

Scritto il 23 novembre 2026 in SB-28, Fase B ([D183](set-base-decisioni.md#decisioni-del-proprietario) (5)). Non è una regola del
gioco: dice come il file del set scrive una carta e che cosa il caricatore accetta. Le regole del gioco sono nel
[regolamento](game-rules.md) (R07 rimanda qui) e nei documenti di set in `docs/sets/`. Il testo delle sezioni «Ricerca», «Vendita»,
«In campo» e «Gioca d'anticipo e Rincara» viene dalla sezione 3 della [corrispondenza di SB-28](design/set-base/sb-28/corrispondenza.md),
che raccoglieva le regole RP-22, RP-26 e RP-28 delle [regole del playground](design/set-base/regole-playground.md), oggi storiche.

## I file

- **La bozza del set**, `server/src/test/resources/set-base/bozza.json`: il file che si modifica. Contiene carte, personaggi, regole
  del formato, gli starter e i mazzi di prova del bilanciamento. La leggono il profilo `bozza`, il runner e i banchi di misura.
- **Il file del set vivo**, `server/src/main/resources/sets/base.json`: la bozza senza i mazzi di prova, cioè con i soli starter. Lo
  legge la partita viva (`LiveSet`). Non si modifica a mano: lo scrive `python -X utf8 tools/set-catalog/set_catalog.py --vivo`,
  insieme al documento del set, all'allegato, a `cards.sqlite` e alle copie del client di debug (manifest in `docs/sets/manifest.json`).
- **I mazzi di prova**, `server/src/test/resources/set-base/mazzi-prova.json`: un file di soli mazzi (sotto), scritto dallo stesso
  comando. Composto col file vivo (`classpath:/sets/base.json;classpath:/set-base/mazzi-prova.json`) dà la bozza intera sul percorso
  vivo, per le corse d'identità.

Il formato è `sb-6b/1`. Le bozze storiche `sb-6a/1` e le espansioni di prova restano leggibili come prima.

## Testata, regole, personaggi, carte

- `set`: `id`, `name`, `version` (la versione del file, non quella del documento del set). Un set che ne richiede altri ha `requires`
  e non dichiara le regole; i suoi id hanno il prefisso del set.
- `rules`: `deckSize`, `maxCopies`, `basicFixedPerCharacter`, `boundChoices`, `lastResortRequired` e `searchShuffle` (sotto).
- `characters`: `id`, `rarity`, `name`, `flavour`, `resources`, `items`, `immunities`, `basic` e, per i personaggi con uno starter,
  `botStyle` (`aggressivo`, `prudente` o `risorse`; SB-30a, [D203](set-base-decisioni.md#decisioni-del-proprietario)): lo stile del
  computer a livello Normale (regolamento, R03), che il generatore scrive nella scheda del personaggio. Il caricatore del server lo
  accetta e non lo legge ancora.
- `cards`: una carta **a dati** (`kind` ACTION, BOUND o ITEM, `priority`, `targets`, `cost`, passi `self` e `target`, `boundTo`,
  `basic`, `lastResort`, `exclusiveTo`, `inPlay`) oppure una **classe Java** (`java: true`, `cost`, `priority`, `params`): i numeri sono
  sempre nel file, la classe tiene solo la logica (D177). Ogni carta ha `rarity` e `gui` (nome, flavour, testo breve, ruolo, guadagni,
  danno nominale). Un costo a zero non si scrive. Un costo in HEALTH è ammesso (D27). Il campo `lastBlow` («Ultimo colpo») resta
  leggibile per le bozze storiche, ma il regolamento 2.0 non lo ha (D183 (3)): il file vivo non lo usa e la partita viva rifiuta
  una carta che lo porti.

## Mazzi

Ogni mazzo ha `id`, `character`, `bound` (due legate diverse del personaggio), `lastResort` e `cards` (le carte regolari con le copie:
`deckSize` in tutto, al più `maxCopies` per carta). La basic è quella fissa del personaggio.

- **Starter** (SB-28, [D182](set-base-decisioni.md#decisioni-del-proprietario)): un mazzo con `name` e `category`, che vanno insieme;
  `category` vale `base` o `avanzato`. Sono gli starter del set: il documento del set li elenca e la quick ne assegna uno a caso.
- **Mazzi di prova**: senza `name` né `category`. Restano nella bozza e nel file dei mazzi di prova, mai nel file vivo.
- **File di soli mazzi** (SB-28): un file `sb-6b/1` con i soli campi `format` e `decks`, senza testata. Si legge solo insieme ad
  almeno un file di set; i suoi mazzi non appartengono a nessun set e vedono tutti i set caricati, come i mazzi costruiti dai banchi.

## Ricerca (RP-22, RP-10, RP-24)

Passo `search` con `card` (un binding) o `cards` (due binding distinti, nell'ordine stampato), mai entrambi; il caricatore rifiuta un
binding che è un oggetto. Facoltativi `foundGains` e `missedGains`, mappe di risorse non negative: si applica solo la mappa dell'esito,
dopo la ricerca; senza queste mappe la ricerca conserva i guadagni esterni. `vulnerability` (`factor`, `damage`) descrive il gettone di
Annuncia. `turnsIfNotFound` resta leggibile per le bozze storiche e non crea gettoni. L'impostazione `rules.searchShuffle` (falsa se
manca) mischia il mazzo dopo ogni ricerca: il Set Base 1.0 la mette a vero; le bozze storiche non la hanno.

## Vendita (RP-26)

Passo `vendi` con la sola lista `seHai` di soli `gain`, `lose`, `say` (il ricavato); solo in `self`, una volta, in una carta ACTION
regolare o basic, con bersaglio solo `NEAR_ITEM`; non dentro `anticipo` né `gettone`, mai insieme a `consume`; rifiutato nelle bound,
nelle last resort, negli oggetti e col campo `seNo`. L'oggetto arriva dal campo `TARGET_ITEM` della mossa.

## In campo (RP-28)

Campo facoltativo `inPlay` di una carta `ITEM`: uno o due passi `lose` (A o V) o `gain` (T o L), quantità fissa; rifiutati fuori dagli
oggetti, ogni altro passo, HEALTH e quantità variabili; richiede il testo breve `gui.inPlay`, rifiutato quando il campo manca. Registro:
`(Nome) RISORSA: prima->dopo (differenza)`. La vista della carta porta `inPlay` solo se c'è.

## Gioca d'anticipo e Rincara

Passo `anticipo` con passi annidati (`steps`), senza ricerche, consumi né altri anticipi; la mossa pubblica porta `ahead`. `perPlay`
dentro un importo (`{"base": 10, "perPlay": 5}`), 0 se manca; la mossa pubblica porta `plays`.
