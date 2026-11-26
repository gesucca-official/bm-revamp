# SB-34 — Nomi delle classi delle carte: proposta (Fase A)

Scritta il 26 novembre 2026 su [D210](../../set-base-decisioni.md#decisioni-del-proprietario); base `9a6c4da`. Nessun codice né
dato cambia in questa fase. Evidenze: [inventario](sb-34/inventario.json) (conteggi per area, per file e per id) e
[tabella](../../../tools/set-catalog/nomi-classi.json) (vecchio → nuovo, in forma di dati).

**Esito.** 130 identificativi (117 carte, 7 personaggi, 1 token, 5 starter), presenti in 900 file tracciati (187 vivi, 713 storici),
nei nomi di 69 file delle illustrazioni, in 3 cataloghi SQLite e, sulla macchina, nelle due basi applicative e in 2.400 file di
recupero. **Raccomando l'opzione (a):** gli id attuali diventano identificativi congelati e si rinominano solo le classi Java, che
dichiarano il proprio id; nessun dato salvato, partita archiviata, atlante o file di illustrazione migra, e la partita viva resta
identica. Quattro domande in fondo.

## 1. Inventario

**Come funziona oggi.** L'id di una carta è il suo `binding` nel file del set. Per le carte a dati è solo una stringa; per le carte
con `java: true` il caricatore cerca la classe `com.gsc.bm.model.cards.` + id (`Draft.java:750`) e la classe ricava l'id dal proprio
nome (`AbstractCard.getBindingName`, `Character`, `AbstractCharacterBoundCard`, `DeckFactoryServiceImpl`). Quindi:

- delle 117 carte del set, **97 non hanno una classe**: `bruiser.character.LittleSmack` è un nome di lavoro scritto nel file, non una
  classe viva (la classe omonima esiste solo fra i sorgenti di test, carta del Set Base 0.1);
- **20 classi vive** (19 carte e il token) più due superclassi (`Contromossa`, `RottenBeer`) stanno in `server/src/main/java`, nei
  package `bruiser`, `junkie`, `com`, `com.items`, `com.tokens`, `base.cesira`, `base.pino`, `base.gigi`, `base.rocco`, `base.com`,
  `base.items`;
- **32 classi storiche** del Set Base 0.1 stanno in `server/src/test/java/.../model/cards` e servono alle bozze storiche;
- i 7 personaggi e i 5 starter sono solo dati.

**Dove compaiono gli id** (occorrenze; dettaglio per file in `inventario.json`):

| Luogo | File | Occorrenze | Note |
|---|---:|---:|---|
| File del set vivo `sets/base.json` | 1 | 267 | 129 id; scritto da `set_catalog.py --vivo` |
| Bozza, mazzi di prova, candidate e banchi (`server/src/test/resources/set-base/`) | 12 | 2.824 | bozza 1.7, `mazzi-prova.json`, sb-16h, sb-21h, sb-21z, sb-22, sb-23 |
| Bozze storiche (`set-base/storico/`) | 2 | 274 | 0.1 e 1.5, più il catalogo SQLite 0.1 |
| Altre risorse di test (sb-5, sb-6a, sb-6b, sb-10a, sb-11a, tsv del regolamento) | 11 | 342 | |
| Test Java (`server/src/test/java`, fuori dalle classi storiche) | 91 | 1.532 | più ~450 riferimenti ai nomi semplici delle 20 classi vive |
| Codice vivo (`server/src/main/java`) | 2 | 2 | id dei personaggi in `NeRiparliamoFuori`, `MiRialzo`; il resto passa dai nomi di classe |
| Catalogo `cards.sqlite` | 1 | 283 | `CRD001_GUI` 117 righe, `CRD003_CHARACTERS` 7, `DCK001`/`DCK002` starter |
| Documento del set e copie (`docs/sets/base.md`, `client-debug/src/assets/docs/sets/base.md`) | 2 | 652 | ogni scheda porta l'id; tabella S4 |
| Allegato `docs/rules-catalog.json` | 1 | 357 | |
| Client web (manifest degli atlanti 34 chiavi; test e strumenti di verifica) | 11 | 584 | `art.ts` cerca la cella per id; `atlas.mjs` ordina le celle per id |
| Client di debug (test dell'editor; la copia del documento è nella riga sopra) | 1 | 2 | |
| Client C0 (fixture) | 4 | 149 | area non classificata |
| Illustrazioni SB-32 (registro, lotti, prompt, schede di giudizio) | 24 | 692 | più **69 file** in `anteprime/` col nome dell'id (28 id), più gli originali fuori da git sulle due macchine |
| Script CLI (`scripts/cli-*.cjs`) | 9 | 128 | |
| Stampa (`tools/print-cards`) e carriere (`tools/carriere`, `prototipi/carriere`) | 8 | 16 | |
| Manifest dei PDF (`output/pdf/`) | 2 | 512 | generati |
| Altri documenti vivi (`data-model.md`, `setup.md`, `cli.md`, `carriere/formato.md`, registro e piano) | 6 | 51 | |
| Rapporti, design passato e storico | 713 | 159.571 | restano coi nomi del loro momento (D210 (3)) |
| Base applicativa locale `server/data/bm.sqlite` | — | — | `USR002_DECKS` 2 mazzi (50 id); `LOG003_MATCH_EVENTS` 7.891 eventi, 4.784 con id (370.655 occorrenze) |
| Base del profilo bozza `server/data/bm-bozza.sqlite` | — | — | `LOG003` 1.391 eventi (75.185 occorrenze) |
| Recupero delle partite (`*.match-recovery`) | 2.400 | 441.508 | batch con impronte d'integrità |

**Tre fatti che pesano sulla scelta.**

1. L'archivio `LOG003_MATCH_EVENTS` è **immutabile** (trigger `LOG003_NO_UPDATE` e `LOG003_NO_DELETE`, V002) e ogni evento entra
   nella catena delle impronte: gli id dentro gli eventi non si possono riscrivere. Anche i batch di recupero hanno impronte proprie.
2. **L'ordine per id entra nella partita:** `Draft.java:567` (le bound fra cui un mazzo sceglie, `TreeSet`), `Draft.java:852` (le
   carte regolari del mazzo, `TreeMap`, «ordine per binding») e `BotView.java:233` (le carte annunciate, ordinate per binding, nel bot). Cambiare gli id cambia
   l'ordine, quindi il mazzo costruito, il consumo del seme e le scelte dei bot: la partita viva non sarebbe più identica.
3. Gli atlanti assegnano le celle in ordine alfabetico di id (`atlas.mjs`) e le illustrazioni SB-32 sono nominate per id, compresi
   gli originali che stanno fuori da git.

## 2. Tabella vecchio → nuovo

Nomi inglesi fedeli al nome attuale (D210), in `UpperCamelCase`. Package proposti sotto `com.gsc.bm.model.cards.base` (il set):
uno per personaggio col **nome attuale** (`spazienzio`, `mara`, `celestina`, `piera`, `beppe`, `sergio`, `duccio`), con le legate in
`.bound` come oggi; `common` per le azioni generiche, `items`, `tokens`, `characters`. Per gli starter, l'id proposto vale solo con
l'opzione (b).

**Package e D210.** Il package fa parte del nome completo della classe: dargli il nome attuale del personaggio rientra in D210 per le
20 classi vive. Due cose però escono da D210 e sono nelle domande: spostare classi vive in `model/cards/base` tocca la deroga del
playground di [aree-protette](../../aree-protette.md#playground-e-misure) (domanda 2); per le 97 carte a dati il nome «di classe»
non ha un posto nel codice finché non si decide dove usarlo (domanda 3).

Nomi da guardare: ADOPERIAMOTI, VIOLENZAZIONE, FAI BASTA, ORMALE GUARIAMOTI, Posto Fisso, Rialziamoci e Partite!, Addosso!!! sono
giochi di parole senza un inglese fedele; ho tenuto il senso letterale.

| Nome attuale | Tipo | Slot | Id attuale | Classe proposta (package `com.gsc.bm.model.cards.` sottinteso) | Java oggi |
|---|---|---|---|---|---|
| SPAZIENZIO DE LA UCCISO | Personaggio | PG-SPA | `bruiser.character.BigBadBruiser` | `base.characters.Spazienzio` | — |
| Mara Contromano | Personaggio | PG-MAR | `base.character.Mara` | `base.characters.Mara` | — |
| Celestina Bucatina | Personaggio | PG-TOS | `junkie.character.ToxicJunkie` | `base.characters.Celestina` | — |
| Piera Pinot | Personaggio | PG-PIN | `base.character.Pino` | `base.characters.Piera` | — |
| Beppe Bulletta | Personaggio | PG-GIG | `base.character.Gigi` | `base.characters.Beppe` | — |
| Sergio Sommerso | Personaggio | PG-CES | `base.character.Cesira` | `base.characters.Sergio` | — |
| Duccio Braccio Teso | Personaggio | PG-ROC | `base.character.Rocco` | `base.characters.Duccio` | — |
| ADOPERIAMOTI | Azione, Base | SPA-BA | `com.basic.BruiserGrab` | `base.spazienzio.LetUsUseYou` | — |
| LIEVE FASTIDIO | Azione, Legata al personaggio | SPA-BO1 | `bruiser.character.LittleRage` | `base.spazienzio.bound.SlightAnnoyance` | — |
| SVEGLIAMOCI - MA TU NO | Azione, Legata al personaggio | SPA-BO2 | `bruiser.character.LittleSmack` | `base.spazienzio.bound.WakeUpButNotYou` | — |
| VIOLENZAZIONE | Azione, Legata al personaggio | SPA-BO3 | `base.spazienzio.bound.TestaAlMuro` | `base.spazienzio.bound.Violentization` | — |
| GARGANTUESCO IMPATTO SUL TU | Azione, Regolare | SPA-AR1 | `bruiser.SuperImpact` | `base.spazienzio.GargantuanImpactOnYou` | — |
| SPEDIAMOTI DUNQUE IN O-AHIO | Azione, Regolare | SPA-AR2 | `bruiser.ExtremelyViolentBlow` | `base.spazienzio.ShipYouToOuchio` | — |
| PAZIENZA: FINITA | Azione, Regolare | SPA-AR3 | `bruiser.Glare` | `base.spazienzio.PatienceOver` | — |
| NON GIOCARE COL COLTELLO NO | Azione, Regolare | SPA-AR4 | `bruiser.MadeOfStone` | `base.spazienzio.DontPlayWithTheKnife` | — |
| FAI BASTA | Azione, Regolare | SPA-AR5 | `bruiser.YouStop` | `base.spazienzio.ThatsEnough` | sì |
| SGOMBERIAMOVI | Azione, Regolare | SPA-AR6 | `base.bruiser.TiFaccioSpazio` | `base.spazienzio.LetUsClearYouOut` | — |
| Requisire al Volo | Azione, Base | MAR-BA | `base.mara.PresoAlVolo` | `base.mara.RequisitionOnTheFly` | — |
| Sventare l'Assassinio | Azione, Legata al personaggio | MAR-BO1 | `base.mara.bound.PassoStretto` | `base.mara.bound.FoilTheAssassination` | — |
| Semaforo Rosso | Azione, Legata al personaggio | MAR-BO2 | `base.mara.bound.CambioMarcia` | `base.mara.bound.RedLight` | — |
| Tagliare la Strada | Azione, Legata al personaggio | MAR-BO3 | `base.mara.bound.ColpoDiStriscio` | `base.mara.bound.CutOff` | — |
| Lazo del Rider | Azione, Regolare | MAR-AR1 | `base.mara.CinghiataDiTraverso` | `base.mara.RidersLasso` | — |
| Sgommata | Azione, Regolare | MAR-AR2 | `base.mara.Sgommata` | `base.mara.Burnout` | — |
| Agilità Innaturale | Azione, Regolare | MAR-AR3 | `base.mara.SorpassoInCurva` | `base.mara.UnnaturalAgility` | — |
| Unta e Bisunta | Azione, Regolare | MAR-AR4 | `base.mara.TraDueParaurti` | `base.mara.GreasyAndGrimy` | — |
| Slalom d'Avvicinamento | Azione, Regolare | MAR-AR5 | `base.mara.Slalom` | `base.mara.ApproachSlalom` | — |
| Traiettoria Imprevedibile | Azione, Regolare | MAR-AR6 | `base.mara.TiStringoLaCurva` | `base.mara.UnpredictableTrajectory` | — |
| Desiderio Incontrollabile | Azione, Base | TOS-BA | `com.basic.ToxicGrab` | `base.celestina.UncontrollableCraving` | — |
| Fondo del Posacenere | Azione, Legata al personaggio | TOS-BO1 | `junkie.character.PatheticBlade` | `base.celestina.bound.AshtrayBottom` | — |
| Rintanarsi nel Cappotto | Azione, Legata al personaggio | TOS-BO2 | `base.tossico.bound.RaschiareIlFondo` | `base.celestina.bound.BurrowIntoTheCoat` | — |
| Tagliare la Dose | Azione, Legata al personaggio | TOS-BO3 | `junkie.character.RottenSmile` | `base.celestina.bound.CutTheDose` | — |
| L'Ultimo Tiro | Azione, Ultima risorsa | LR-TOS | `junkie.LethalHeroinDose` | `base.celestina.TheLastDrag` | — |
| Fare l'Inventario | Azione, Regolare | TOS-AR1 | `junkie.MethDrivenRage` | `base.celestina.TakeInventory` | — |
| Tossicone Scatarrante | Azione, Regolare | TOS-AR2 | `junkie.Cough` | `base.celestina.PhlegmyCough` | — |
| Metabolismo Corrotto | Azione, Regolare | TOS-AR3 | `junkie.PervertedMetabolism` | `base.celestina.CorruptedMetabolism` | — |
| Riflessi Aumentati dalla Speed | Azione, Regolare | TOS-AR4 | `junkie.AmphetamineReflexes` | `base.celestina.SpeedBoostedReflexes` | sì |
| Trascinare nel Tunnel | Azione, Regolare | TOS-AR5 | `junkie.ToxicBloodDrain` | `base.celestina.DragIntoTheTunnel` | sì |
| Un Assaggino | Azione, Regolare | TOS-AR6 | `base.tossico.UnAssaggino` | `base.celestina.JustATaste` | — |
| Fino all'Ultima Goccia | Azione, Base | PIN-BA | `base.pino.QuestoLoFiniscoIo` | `base.piera.ToTheLastDrop` | — |
| Posto Fisso | Azione, Legata al personaggio | PIN-BO1 | `base.pino.bound.CinqueMinutiEVado` | `base.piera.bound.RegularSpot` | — |
| Violenta Spruzzata di Seltz | Azione, Legata al personaggio | PIN-BO2 | `base.pino.bound.SpallataAlBancone` | `base.piera.bound.ViolentSeltzerSpray` | — |
| Schiarirsi le Idee | Azione, Legata al personaggio | PIN-BO3 | `base.pino.bound.Coccio` | `base.piera.bound.ClearTheHead` | — |
| Ultimo Giro | Azione, Ultima risorsa | LR-PIN | `base.pino.UltimoGiro` | `base.piera.LastRound` | sì |
| Scompenso da Ultimo Giro | Azione, Regolare | PIN-AR1 | `base.pino.TestataDaUltimoGiro` | `base.piera.LastRoundCrash` | — |
| Alla Goccia | Azione, Regolare | PIN-AR2 | `base.pino.GoingBerserk` | `base.piera.DownInOne` | sì |
| Avamposto Fortificato al Bancone | Azione, Regolare | PIN-AR3 | `base.pino.IlBanconeRegge` | `base.piera.FortifiedBarOutpost` | — |
| Un Altro e Arrivo | Azione, Regolare | PIN-AR4 | `base.pino.OffroIo` | `base.piera.OneMoreAndImComing` | — |
| Rutto a Bruciapelo | Azione, Regolare | PIN-AR5 | `base.pino.RuttoADistanzaSociale` | `base.piera.PointBlankBurp` | sì |
| Un Altro... Grappino... | Azione, Regolare | PIN-AR6 | `base.pino.PrimaIlBrindisi` | `base.piera.AnotherLittleGrappa` | — |
| Questo Torna Utile | Azione, Base | GIG-BA | `base.gigi.QuestoTornaUtile` | `base.beppe.ThisComesInHandy` | — |
| Cuffie e Testa Bassa | Azione, Legata al personaggio | GIG-BO1 | `base.gigi.bound.UnaStrettaEPassa` | `base.beppe.bound.HeadphonesAndHeadDown` | — |
| Colpo col Cacciavite | Azione, Legata al personaggio | GIG-BO2 | `base.gigi.bound.ColpoDiCacciavite` | `base.beppe.bound.ScrewdriverHit` | — |
| Affilare gli Utensili | Azione, Legata al personaggio | GIG-BO3 | `base.gigi.bound.Lima` | `base.beppe.bound.SharpenTheTools` | — |
| Disassemblare | Azione, Regolare | GIG-AR1 | `bruiser.BreakYourToy` | `base.beppe.Disassemble` | sì |
| Chiave da Tredici | Azione, Regolare | GIG-AR2 | `base.gigi.ChiaveDaTredici` | `base.beppe.ThirteenWrench` | — |
| Preparare il Lavoro | Azione, Regolare | GIG-AR3 | `base.gigi.ColpoDiChiaveInglese` | `base.beppe.PrepareTheJob` | — |
| Secondo Bagagliaio | Azione, Regolare | GIG-AR4 | `base.gigi.SottoIlCofano` | `base.beppe.SecondTrunk` | — |
| Lavoro Fatto Bene | Azione, Regolare | GIG-AR5 | `base.gigi.LavoroFattoBene` | `base.beppe.JobWellDone` | sì |
| Metodo Empirico | Azione, Regolare | GIG-AR6 | `base.gigi.UnaStrettaDiProva` | `base.beppe.EmpiricalMethod` | — |
| Messo in Conto | Azione, Base | CES-BA | `base.cesira.LoMettoInConto` | `base.sergio.PutOnTheTab` | — |
| Discutiamone in Privato | Azione, Legata al personaggio | CES-BO1 | `base.cesira.bound.NeRiparliamoFuori` | `base.sergio.bound.LetUsDiscussInPrivate` | sì |
| Tecnica Manipolatoria | Azione, Legata al personaggio | CES-BO2 | `base.cesira.bound.Battutina` | `base.sergio.bound.ManipulativeTechnique` | — |
| Fare il Vago | Azione, Legata al personaggio | CES-BO3 | `base.cesira.bound.FareIlVago` | `base.sergio.bound.ActVague` | — |
| Opportuna Distrazione | Azione, Regolare | CES-AR1 | `base.cesira.OhGuardaLa` | `base.sergio.TimelyDistraction` | — |
| Buon Vecchio Ricatto | Azione, Regolare | CES-AR2 | `base.cesira.Ricatto` | `base.sergio.GoodOldBlackmail` | sì |
| Copione Già Visto | Azione, Regolare | CES-AR3 | `base.cesira.LoSapevo` | `base.sergio.SeenThatScript` | sì |
| Conto Salato | Azione, Regolare | CES-AR4 | `base.cesira.ContoSalato` | `base.sergio.SteepBill` | — |
| Segreto di Pulcinella | Azione, Regolare | CES-AR5 | `base.cesira.LoSannoTutti` | `base.sergio.OpenSecret` | — |
| Scherzo Oltre il Limite | Azione, Regolare | CES-AR6 | `base.cesira.Malelingue` | `base.sergio.PrankTooFar` | — |
| Fiuto per gli Affari | Azione, Regolare | CES-AR7 | `base.cesira.LoRivendo` | `base.sergio.NoseForBusiness` | — |
| Prima gli Italiani | Azione, Base | ROC-BA | `base.rocco.PrimaIo` | `base.duccio.ItaliansFirst` | — |
| Rinfrescata Arrogante | Azione, Legata al personaggio | ROC-BO1 | `base.rocco.bound.Colpetto` | `base.duccio.bound.ArrogantRefresh` | — |
| Rialziamoci e Partite! | Azione, Legata al personaggio | ROC-BO2 | `base.rocco.bound.MiRialzo` | `base.duccio.bound.LetUsGetUpAndYouGo` | sì |
| (Dis)onore alla Bandiera | Azione, Legata al personaggio | ROC-BO3 | `base.rocco.bound.AlzoLaVoce` | `base.duccio.bound.DishonourToTheFlag` | — |
| Non Mi Hai Fatto Niente | Azione, Ultima risorsa | LR-ROC | `base.rocco.NeHoPreseDiPeggio` | `base.duccio.YouDidNothingToMe` | — |
| Nocche Sbucciate | Azione, Regolare | ROC-AR1 | `base.rocco.NoccheSbucciate` | `base.duccio.SkinnedKnuckles` | — |
| Stoico come un Busto di Bronzo | Azione, Regolare | ROC-AR2 | `base.rocco.Incassare` | `base.duccio.StoicAsABronzeBust` | — |
| E Allora...? | Azione, Regolare | ROC-AR3 | `base.rocco.EAllora` | `base.duccio.SoWhat` | — |
| Craniata Patriottica | Azione, Regolare | ROC-AR4 | `base.rocco.Capocciata` | `base.duccio.PatrioticHeadbutt` | — |
| La Storia la Scrivono i Vincitori | Azione, Regolare | ROC-AR5 | `base.rocco.TeLoSpiegoIo` | `base.duccio.HistoryIsWrittenByTheVictors` | — |
| Testa Dura | Azione, Regolare | ROC-AR6 | `base.rocco.TestaDura` | `base.duccio.Hardhead` | — |
| Afferrare | Azione, Regolare | GEN-01 | `com.Grab` | `base.common.Grab` | — |
| Furto con Destrezza | Azione, Regolare | GEN-02 | `com.Steal` | `base.common.SleightOfHandTheft` | sì |
| Scatto Repentino | Azione, Regolare | GEN-03 | `base.com.ShuffleFeet` | `base.common.SuddenDash` | sì |
| Ce l'Hai Due Spicci? | Azione, Regolare | GEN-04 | `base.com.BeggingMoney` | `base.common.GotAnySpareChange` | sì |
| GABBIANO, DUNQUE VOLIAMOTI | Azione, Regolare | GEN-05 | `bruiser.SeagullFly` | `base.common.SeagullSoLetUsFlyYou` | — |
| Foratone da 28 | Azione, Regolare | GEN-06 | `base.com.MattoneDelCantiere` | `base.common.BigHollowBrick28` | — |
| ORMALE GUARIAMOTI | Azione, Regolare | GEN-07 | `bruiser.HealingBlow` | `base.common.NowLetUsHealYou` | — |
| AMMALIAMOTI DI BOTTE | Azione, Regolare | GEN-08 | `bruiser.SickeningBlow` | `base.common.CharmYouWithBlows` | — |
| STORDIAMOTI HO DETTO | Azione, Regolare | GEN-09 | `bruiser.StunningBlow` | `base.common.StunYouISaid` | — |
| PERMESSO SCUSA PUOI SMETTERLA | Azione, Regolare | GEN-10 | `bruiser.BadEducation` | `base.common.ExcuseMeSorryCanYouStop` | sì |
| GENTILE IL TUO CAREZZO | Azione, Regolare | GEN-11 | `bruiser.CantFeelAnything` | `base.common.KindYourCaress` | — |
| Estrema Fretta di Alcolizzarsi | Azione, Regolare | GEN-12 | `base.com.RincorsaDalMarciapiede` | `base.common.ExtremeHurryToGetDrunk` | — |
| Tecnica del Carapace Mentale | Azione, Regolare | GEN-13 | `base.com.TartarugaSulMarciapiede` | `base.common.MentalCarapaceTechnique` | — |
| Denti Stretti | Azione, Regolare | GEN-14 | `base.com.DentiStretti` | `base.common.GrittedTeeth` | — |
| Due Dita in Gola | Azione, Regolare | GEN-15 | `base.com.DueDitaInGola` | `base.common.TwoFingersDownTheThroat` | — |
| Fasciatura d'Emergenza | Azione, Regolare | GEN-16 | `base.com.FasciaturaColFazzolettaccio` | `base.common.EmergencyBandage` | — |
| Sputo nel Posacenere | Azione, Regolare | GEN-17 | `base.com.SputoDaPosacenere` | `base.common.SpitInTheAshtray` | — |
| Spintone | Azione, Regolare | GEN-18 | `base.com.Spintone` | `base.common.Shove` | — |
| Mano Lesta | Azione, Regolare | GEN-19 | `base.com.ManoLesta` | `base.common.LightFingers` | — |
| Riprendere Fiato | Azione, Regolare | GEN-20 | `base.com.SecondoFiato` | `base.common.CatchYourBreath` | — |
| Coccio di Bottiglia | Azione, Regolare | GEN-21 | `base.com.CoccioDiBottiglia` | `base.common.BottleShard` | — |
| Svegliaaah! | Azione, Regolare | GEN-22 | `base.com.AcquaInFaccia` | `base.common.WakeUuup` | — |
| Sgambetto | Azione, Regolare | GEN-23 | `base.com.Sgambetto` | `base.common.Trip` | — |
| Estasi da Coca Etilene | Azione, Regolare | GEN-24 | `base.com.EstasiDaCocaEtilene` | `base.common.CocaethyleneEcstasy` | — |
| Addosso!!! | Azione, Ultima risorsa | LR-STR | `com.last.Struggle` | `base.common.AtHim` | — |
| Negroni Trovato per Terra | Oggetto | OGG-01 | `com.items.CocktailOnTheGround` | `base.items.NegroniFoundOnTheFloor` | — |
| Bionda da 66, Calda | Oggetto | OGG-02 | `com.items.RottenBeer` | `base.items.WarmBlonde66` | — |
| Doppio Malto da Discount | Oggetto | OGG-03 | `com.items.AnotherRottenBeer` | `base.items.DiscountDoubleMalt` | sì |
| Mescolone Micidiale | Oggetto | OGG-04 | `com.items.MarvelousCocktail` | `base.items.LethalMix` | sì |
| Amaro nel Bicchiere di Plastica | Oggetto | OGG-05 | `base.items.AmaroNelBicchiereDiPlastica` | `base.items.AmaroInAPlasticCup` | — |
| Espresso della Macchinetta | Oggetto | OGG-06 | `base.items.EspressoDelDistributore` | `base.items.VendingMachineEspresso` | — |
| Kebab Abbandonato | Oggetto | OGG-07 | `base.items.PaninoDelKebab` | `base.items.AbandonedKebab` | — |
| Acqua Minerale Sgasata | Oggetto | OGG-08 | `base.items.MezzaMineraleSgasata` | `base.items.FlatMineralWater` | — |
| Guanti da Officina | Oggetto | OGG-09 | `base.items.GuantiDaOfficina` | `base.items.WorkshopGloves` | — |
| Giubbotto di Finta Pelle | Oggetto | OGG-10 | `base.items.GiubbottoDiFintaPelle` | `base.items.FakeLeatherJacket` | — |
| Casco da Cantiere | Oggetto | OGG-11 | `base.items.CascoDaLavoro` | `base.items.SiteHelmet` | — |
| Pasticca Abbandonata | Oggetto | OGG-12 | `base.items.PasticcaTrovataSulBancone` | `base.items.AbandonedPill` | — |
| Posacenere di Vetro | Oggetto | OGG-13 | `base.items.PosacenereDiVetro` | `base.items.GlassAshtray` | — |
| Ghiaccio nel Tovagliolo | Oggetto | OGG-14 | `base.items.GhiaccioNelTovagliolo` | `base.items.IceInANapkin` | — |
| Santino di San Briaco | Oggetto | OGG-15 | `base.items.SantinoDellaPortinaia` | `base.items.SaintBriacoHolyCard` | sì |
| Grappa della Casa | Oggetto | OGG-16 | `base.items.GrappaDellaCasa` | `base.items.HouseGrappa` | — |
| Conto del Tavolo Sei | Oggetto | OGG-17 | `base.items.ContoDelTavoloSei` | `base.items.TableSixBill` | — |
| Sigaretta Accesa | Oggetto | OGG-18 | `base.items.SigarettaAccesa` | `base.items.LitCigarette` | — |
| Bottiglia Spaccata | Oggetto, Token | TOKEN | `com.tokens.BrokenBeerBottle` | `base.tokens.BrokenBottle` | sì |
| starter Spazienzio | Starter | — | `starter-spazienzio` | `starter-spazienzio` | — |
| starter Mara | Starter | — | `starter-mara` | `starter-mara` | — |
| starter Celestina | Starter | — | `starter-tossico` | `starter-celestina` | — |
| starter Piera | Starter | — | `starter-pino` | `starter-piera` | — |
| starter Beppe | Starter | — | `starter-gigi` | `starter-beppe` | — |

## 3. Identificativo separato dal nome della classe

| | (a) Id attuali congelati | (b) Id nuovi leggibili, migrazione una tantum |
|---|---|---|
| Cosa migra | nulla nei dati; si rinominano 20 classi e 2 superclassi, che dichiarano il proprio id | `base.json`, bozza e mazzi di prova, `slot.json` e testi, catalogo, documento del set, allegato e copie, manifest degli atlanti, ~1.500 attesi dei test Java, fixture del client, script CLI; `USR002_DECKS` con una migrazione V005 come V004 |
| Cosa resta leggibile | il nome della classe e la tabella del documento del set; l'id resta il nome di lavoro (`LittleSmack`) nei registri, nel client di debug e nelle schede | tutto, finché un nome non cambia di nuovo: da lì l'id si congela e torna a divergere |
| Partite archiviate | intatte: stessi id, catene verificabili, leggibili col codice nuovo | le righe restano con gli id vecchi (immutabili): serve per sempre una tabella di alias vecchio → nuovo per leggerle o rigiocarle; catene verificabili |
| Recupero | intatto | i batch restano con gli id vecchi: alias anche al riavvio |
| Partita viva | identica (l'ordine segue l'id, che non cambia) | **cambia**: ordine di mazzi, seme e bot (fatto 2); nuova base d'identità e misure di SB-30b non confrontabili con le precedenti |
| Copie del client | invariate | rigenerate |
| Illustrazioni e atlanti | invariati | chiavi del manifest rinominate (le celle restano fino alla prossima ricostruzione, che le riordina); 69 anteprime, registro e originali sulle due macchine da rinominare, o una tabella d'alias in più |
| Bozze storiche | lette come oggi | restano con gli id vecchi: le carte Java storiche passano dall'alias |

Ho scartato anche una terza strada, l'id preso dallo slot (`SPA-BO2`): costa come (b) e gli slot portano già i nomi di lavoro
(`PG-TOS`, `PIN`, `GIG`, `CES`, `ROC`).

**Raccomando (a).** Separa davvero id e classe, che è lo scopo di D210 («perché una rinomina futura non costringa a migrare mazzi e
immagini»), senza toccare archivio, recupero, mazzi, atlanti e illustrazioni, e senza cambiare la partita. Il costo è che gli id
restano nomi di lavoro: un id diventa un'etichetta opaca, che nessun giocatore vede, e il suo significato sta nella tabella.

**Forma dell'identificativo (a).**

- L'id è la stringa `binding` di oggi, per carte, personaggi e token, e l'`id` degli starter. **Non cambia mai**, nemmeno se cambia
  il nome della carta o la sua classe. Una carta nuova riceve un id alla nascita (proposta: `base.<personaggio>.<NomeInglese>`), poi
  congelato.
- Una classe viva dichiara il suo id con un'annotazione, per esempio `@CardId("bruiser.YouStop")` su
  `base.spazienzio.ThatsEnough`, ed è elencata in un registro esplicito delle classi del set (nessuna scansione del classpath: il
  runner gira senza Spring). `getBindingName()` restituisce l'id dichiarato, non il nome della classe.
- Il caricatore cerca la classe di una carta `java: true` prima nel registro; solo se l'id non c'è usa la regola di oggi (package +
  id), che resta per le 32 classi storiche delle bozze 0.1 e 1.5. Un id presente in entrambe le strade è un errore di caricamento.
- Il file del set non cambia formato: niente campo nuovo, la classe sta nel codice. `formato-file-set.md` lo dice.
- Il documento del set scrive, per le carte con classe, «id · classe · slot»; la frase in testa parla di «identificatore stabile della
  carta» e non più «della classe».

## 4. Piano della Fase B (con l'opzione a)

**B1 — Classi, caricatore, documento del set.** Perimetro: `server/src/main/java/com/gsc/bm/model/cards/**` (20 classi e 2 superclassi
rinominate e spostate, annotazione, registro), `AbstractCard`, `AbstractCharacterBoundCard`, `Character`, `PrintedEffects` (import di
`AnotherRottenBeer`), `Draft.java` e `CardFactoryService`/`DeckFactoryServiceImpl` per la ricerca della classe; test Java che citano
le classi per nome (import e riferimenti, nessun atteso); `UserAccountServiceImplTest` e `SimulationCatalog`, che oggi fanno
`Class.forName` da soli; `tools/set-catalog/set_catalog.py` (frase di testa e classe nella scheda); `docs/sets/base.md` **1.0.3** con
la motivazione nelle Revisioni (nessuna carta cambia), rigenerato con allegato, catalogo, copie e manifest; `docs/formato-file-set.md`;
`docs/data-model.md` se ne parla. Protetto: dati del set, bozze, catalogo nei contenuti delle carte, client, illustrazioni, archivio.
Verifiche, dalla [tabella](../../aree-protette.md): «Sempre» (`git diff --check`, `check-links.py`, `check-rules.py`,
`build.ps1 -Task Test -Offline`); `set_catalog.py --vivo` con la sua riga; `TestServerContext` e `verify-match-manifests.py`;
**identità viva** (banco di 480.000 partite) uguale alla base, perché si tocca `model/**` senza voler cambiare la partita; **passo 0
d'identità** del playground, perché cambia codice che la misura esegue: stessi `matrix.json`, `observations.json`, `draft.json`,
`deck-observations.json`. Più due prove nuove: ogni carta `java: true` del set vivo e delle bozze storiche si carica con l'id
atteso, e una mutazione che toglie una classe dal registro fa fallire il caricamento.

**B2 — Nomi nel codice di prova** (solo se la domanda 3 lo chiede). Una classe di costanti dei 130 id coi nomi della tabella
(`SetBaseIds.WAKE_UP_BUT_NOT_YOU = "bruiser.character.LittleSmack"`), generata da `tools/set-catalog`, e i test che la usano al posto
delle stringhe. Perimetro: test Java e lo strumento. Verifiche: «Sempre», la riga di `tools/set-catalog/`, nessun atteso cambia.

**B3 — Chiusura.** Rapporto, riga e sezione nel piano, partita del proprietario se la vuole (non serve: nulla di visibile cambia).

**Mai insieme a B1:** C5-1 (jar e verifiche del client sulla stessa build); gli ingressi dei lotti di SB-32 nell'atlante (rigenerano
copie e manifest in parallelo e cambiano il jar che l'identità confronta); le misure di SB-30b (stesso codice, stessi numeri: una
misura a cavallo di B1 non si confronta). L'identità viva e il passo 0 sono verifiche esclusive. SB-32 può continuare a generare
immagini: con (a) i suoi file non cambiano.

**Con l'opzione (b)** le fasi sarebbero cinque: B1 alias e caricatore che accetta id vecchi e nuovi; B2 dati del set, bozza, catalogo,
documento 1.1 e copie con **nuova base d'identità** dichiarata; B3 V005 per `USR002_DECKS` con la sua prova (come
`SetBaseDecksMigrationTest`) e lettura dell'archivio e del recupero via alias, provata su una copia di `server/data`; B4 client
(manifest degli atlanti, fixture, script CLI) con le verifiche del client web; B5 illustrazioni SB-32 (file e registro) e originali
sulle due macchine, azione del proprietario. Con (b) SB-30b ripartirebbe dalla nuova base.

## 5. Rischi

- **Deroga del playground già superata.** La condizione 3 della deroga («il catalogo vivo non nomina classi di `model/cards/base`»)
  è falsa da SB-28: il set vivo usa già `base.pino.UltimoGiro` e altre. Spostare lì tutte le classi vive, e far importare
  `base.items.DiscountDoubleMalt` da `PrintedEffects`, rende falsa anche la condizione 2. B1 segue comunque le righe della partita
  viva; la deroga va riscritta (domanda 2).
- **Due strade per la classe.** Registro e regola di oggi convivono per le bozze storiche: un id risolto dalla strada sbagliata
  caricherebbe una classe storica. La prova di B1 lo esclude e il caricatore rifiuta i doppioni.
- **Nomi semplici duplicati fra main e test** (`ShuffleFeet`, `GoingBerserk`, `BeggingMoney` esistono in entrambi): la rinomina
  delle vive li separa, ma gli import dei test vanno controllati uno per uno.
- **Codice cambiato, impronta del codice cambiata:** i manifest delle partite nuove avranno un `codeSha256` diverso, com'è normale;
  le partite archiviate restano valide.
- **Id che non dicono più nulla.** Con (a) `starter-pino` o `base.character.Gigi` restano per sempre: chi legge un registro deve
  passare dalla tabella. È il prezzo della stabilità.
- **SB-32 in corso nello stesso checkout** (lotto 4, Piera): con (a) nessun file in comune; con (b) i lotti andrebbero fermati.

## 6. Domande

1. **Identificativo:** confermi l'opzione (a), id attuali congelati per sempre (anche `bruiser.character.LittleSmack` e
   `starter-pino`), con i nomi inglesi sulle sole classi Java e nella tabella? Oppure vuoi id leggibili con l'opzione (b), che migra
   mazzi, dati e client, tiene un alias per sempre per archivio e recupero e cambia la partita col seme?
2. **Package e deroga:** approvi le classi vive sotto `com.gsc.bm.model.cards.base.<personaggio>` (più `common`, `items`, `tokens`)
   e la riscrittura della deroga del playground in `aree-protette.md`, che oggi esenta proprio `model/cards/base` dall'identità
   viva? In alternativa le classi vive vanno in un package separato da quello del playground (`model/cards/set/base/...`).
3. **Carte a dati:** i 97 nomi inglesi delle carte senza classe servono anche nel codice, come costanti per i test (B2), oppure
   restano solo nella tabella finché una carta non riceve una classe?
4. **Nomi:** approvi la tabella così, o vuoi cambiare qualche nome (in particolare i giochi di parole elencati sopra la tabella)?
