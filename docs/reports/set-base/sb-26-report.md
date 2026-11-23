# SB-26 — Generazione del catalogo dal set

Esecutore, 23 novembre 2026, sul commit di base `a5490ea`. Passo diretto ([D175](../../set-base-decisioni.md#decisioni-del-proprietario),
che prevale sulla [proposta](../../design/set-base/sb-26-proposta.md)), prompt della regia. Evidenze: la prova dell'espansione in
[sb-26/espansione/](sb-26/espansione/).

## Esito

**Consegnato, STOP per la lettura del proprietario.** Un comando genera dalla bozza 1.7 congelata e dai testi di SB-25 il catalogo
candidato del Set Base **1.0** in `server/src/test/resources/set-base/catalogo/`: documento del set, allegato, catalogo SQLite con testo
completo e flavour, copia per il client di debug e un manifest con le impronte. Due generazioni danno gli stessi byte. `check-rules.py`
controlla la partita viva con le stesse regole e, con `--candidate`, il catalogo candidato; su una copia temporanea (`--root`) un numero,
un testo completo e un testo breve cambiati lo fanno fallire. Nulla di vivo cambia: regolamento, documento 0.1, allegato, `cards.sqlite`,
copie del client, `server/src/main` e la bozza (SHA-256 `a8930ede…` prima e dopo) sono quelli del commit di base.

**Da leggere per primo** (il [documento candidato](../../../server/src/test/resources/set-base/catalogo/sets/base.md), 1.620 righe):

| Cosa | Scheda | Riga |
|---|---|---:|
| un personaggio | Celestina Bucatina, in S2 | 142 |
| una carta a dati | SVEGLIAMOCI - MA TU NO, legata di Spazienzio | 196 |
| una carta speciale | Lavoro Fatto Bene (`base.gigi.LavoroFattoBene`) | 732 |
| una carta speciale con molte regole | Buon Vecchio Ricatto (`base.cesira.Ricatto`) | 820 |
| un oggetto | Negroni Trovato per Terra | 1.310 |

## Comandi

```powershell
python -X utf8 tools/set-catalog/set_catalog.py
python -X utf8 tools/set-catalog/set_catalog.py --check
python -X utf8 scripts/check-rules.py --candidate
python -X utf8 tools/set-catalog/prova-errori.py
python -X utf8 tools/set-catalog/set_catalog.py --extra server/src/test/resources/sb-6b/mini.json --out docs/reports/set-base/sb-26/espansione
python -X utf8 scripts/check-rules.py --candidate docs/reports/set-base/sb-26/espansione
```

Il primo scrive la cartella (e toglie i file che non genera più); `--check` rigenera in memoria e confronta, senza scrivere.
Gli argomenti che decidono l'uscita stanno nel `manifest.json` della cartella: `check-rules.py --candidate` li rilegge da lì.

## Cosa cambia

| File | Cosa |
|---|---|
| `tools/set-catalog/set_catalog.py` (nuovo) | il generatore: legge i file di set, usa `testi_stampati.py` di SB-25 per testo breve, guadagni, danno nominale (e testo completo dove manca il file dei testi), non scrive parole proprie |
| `tools/set-catalog/prova-errori.py` (nuovo) | la prova dei disallineamenti voluti su una copia temporanea |
| `server/src/test/resources/set-base/catalogo/` (nuovo, generato) | `sets/base.md`, `sets/base.json`, `cards.sqlite`, `client-debug/sets/base.md`, `manifest.json` |
| `scripts/check-rules.py` | scheda e testo breve come due campi; costi in HEALTH; opzione `--candidate [cartella]` con più set |
| `docs/reports/set-base/sb-26/espansione/` (nuovo, generato) | la prova dell'espansione: due documenti, due allegati, un catalogo |
| `docs/aree-protette.md`, `CONTRIBUTING.md` | una riga per il catalogo candidato e i suoi comandi |

**Il generatore.** Ingressi: il file del set principale (`--set`, la bozza), i suoi testi completi (`--testi`) e i suoi slot (`--slot`),
più altri file di set con `--extra`. Per il Set Base controlla che testo breve, guadagni e danno della bozza siano quelli del generatore
di SB-25 e che i testi completi del file siano quelli che lo stesso generatore scrive; se no si ferma e rimanda a `genera-testi.py`.
L'ordine è fisso (personaggi nell'ordine del file, carte per slot, allegato e SQLite per identificatore), nessuna data, nessun percorso
della macchina. Il SQLite si costruisce in un ordine fisso e si compatta (`vacuum`).

**`check-rules.py`, parte viva.** Stesso significato di prima, scritto in due controlli: la descrizione dell'allegato vivo termina con
il riferimento «Riferimento: Set Base 0.1.» (testo breve) e, tolto il riferimento, coincide con la scheda del documento (scheda). Le
lettere dei costi ammettono H = HEALTH (D27); il set 0.1 non ne ha. Continua a pretendere un solo documento in `docs/sets/`.

**`check-rules.py --candidate`.** Per ogni set del manifest: copia client identica; titolo e versione; una scheda per voce dell'allegato;
**scheda** = testo completo dell'allegato come lo mostra il documento, e testo completo = quello di SB-25; nome, tipologia, rarità
(vocabolario di R07 1.14), **costo** (anche in HEALTH) e **priorità** dell'intestazione uguali al file del set; **testo breve**, guadagni e
danno uguali al generatore di SB-25, ruolo e tipo di danno uguali al file; tabella R07a uguale all'allegato; tabella S2 e mazzi del
documento uguali al file; ogni carta di ogni mazzo dei file si trova nel catalogo di tutti i set; starter conformi a R02. Poi il SQLite:
tabelle e colonne del vivo più `T_GUI_FULL_TEXT` e `T_GUI_FLAVOUR` su carte e personaggi, `CRD002_KEYWORDS` uguale al vivo, righe uguali
agli allegati, integrità. Per ultimo la cartella intera deve essere quello che il generatore scrive adesso dagli stessi ingressi, il
SQLite confrontato per contenuto. Un ingresso cambiato dopo la generazione (impronta del manifest) fa fallire subito.

## Verifiche

| Verifica | Esito |
|---|---|
| `python scripts/check-rules.py` | verde, stesso messaggio di prima (Regolamento 1.14 e Set Base 0.1) |
| `python scripts/check-rules.py --candidate` | verde: 1 set, 125 voci |
| `python scripts/check-rules.py --candidate docs/reports/set-base/sb-26/espansione` | verde: 2 set, base 125 e mini 5 voci |
| due generazioni in due cartelle temporanee e nella cartella di prova | `diff -r --binary` vuoto: stessi byte, SQLite compreso |
| `set_catalog.py --check` (base ed espansione) | identici alla generazione |
| `prova-errori.py` (`--root` su copia temporanea) | copia intatta verde; costo cambiato nella scheda, testo completo cambiato nella scheda, testo breve cambiato nell'allegato e numero cambiato nella bozza dopo la generazione: tutti falliscono col messaggio atteso |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: server 979 test, 0 falliti, 0 in errore, 23 saltati; client di debug 37 su 37 |
| `controlla-nomi.py`, `testi/controlla-testi.py` | verdi (125 voci, 0 violazioni; testi coincidenti, nessun gergo) |
| SHA-256 di `bozza.json` | `a8930edeb822028918d8fcd4c78fce2e4ffda007b2edca883ff48528290b527d`, invariata |
| `git diff --check`, `scripts/check-links.py` | `git diff --check` pulito; `check-links.py` 8 link rotti, tutti in `docs/design/carriere/` e già presenti al commit di base (D167 (3)), nessuno nuovo |

I quattro messaggi della prova con `--root`:

```text
bruiser.ExtremelyViolentBlow: cost of the sheet differs from the set file
bruiser.SuperImpact: sheet differs from the full text of the annex
base.bruiser.TiFaccioSpazio: short text differs from the SB-25 generator
server/src/test/resources/set-base/catalogo: server/src/test/resources/set-base/bozza.json changed after the generation: regenerate the catalog
```

Non eseguite: `TestServerContext` e le verifiche della partita viva, perché nulla di `server/src/main` né della norma viva cambia; il
catalogo candidato non è caricato da nessun codice.

## Impronte (SHA-256)

| File di `catalogo/` | Impronta |
|---|---|
| `sets/base.md` e `client-debug/sets/base.md` | `247da9a74f0d6c22852aa75d94bbb134bb6de1599b64720443d552efa60cfd9d` |
| `sets/base.json` | `aba0b1c3f805c572872bd3f3fb734054ce0c5e08032e8eebce064ab69400fc82` |
| `cards.sqlite`, file (SQLite 3.45.3) | `d0f50a3bf51766e4fef585ad370c24c60945b3ad1c69f64f7eed990a56260a4c` |
| `cards.sqlite`, contenuto (`iterdump`) | `5f637ba8ec7ea1dc57dd919de94581852b5bce700847908b01ebcfbbd08e2c76` |
| ingressi: `testi-completi.json`, `slot.json` | `48555d08…eac8e`, `48bc14dd…176f7` (intere nel manifest) |

Espansione: `sets/mini.md` `af8d90b5…5c11da`, `sets/mini.json` `0a0c6d95…6cc8b76`, contenuto del SQLite `e2becc90…93b189`; `sets/base.md`
e `sets/base.json` della prova sono identici a quelli del candidato.

## Il documento candidato

- **S1**: 124 carte (7 personaggio, 99 azione, 18 oggetto) e il token «Bottiglia Spaccata»; rarità 42 COMMON, 56 UNCOMMON, 19 RARE,
  7 PROTAGONIST; i cinque starter (`starter-*` della bozza) con base, legate, ultima risorsa e le 20 carte regolari. I 21 mazzi di prova
  della bozza sono citati per nome e dichiarati fuori dal set.
- **S2**: tabella delle risorse dei sette personaggi, poi la loro scheda.
- **S3**: una scheda per carta, per personaggio (base, legate, ultima risorsa, poi le altre per slot), poi le 23 azioni generiche e
  l'ultima risorsa generica, i 18 oggetti, il token. Intestazione: nome, tipologia e sottotipo, rarità, costo, priorità; sotto,
  identificatore e slot; poi il testo completo, paragrafo per paragrafo. Nelle schede i segnaposto sono le lettere di R07 (H, A, V, T,
  L) e i nomi dei danni; allegato e SQLite tengono i segnaposto, che client e stampa rendono come simboli.
- **S4**: R07a per tutte le 125 voci, generata dagli stessi dati e controllata contro il generatore.
- **Revisioni**: «1.0 candidata — SB-26», con le impronte degli ingressi.

### Le 19 carte speciali

Hanno una classe Java con parametri (la forma definitiva è di SB-27); la scheda è il loro testo completo di SB-25, come per le altre.
Qui come si legge il cuore della scheda (secondo paragrafo; il primo dice tipologia, costo, priorità e bersaglio):

| Slot | Carta | Classe | La scheda dice |
|---|---|---|---|
| SPA-AR5 | FAI BASTA | `bruiser.YouStop` | annulli la mossa scelta se deve ancora risolversi, «dopo» spiegato con l'ordine di risoluzione |
| GEN-02 | Furto con Destrezza | `com.Steal` | prendi l'oggetto scelto; se superi la capacità sparisce il tuo più vecchio |
| TOS-AR4 | Riflessi Aumentati dalla Speed | `junkie.AmphetamineReflexes` | annulli le mosse contro di te o un tuo oggetto che devono ancora risolversi |
| TOS-AR5 | Trascinare nel Tunnel | `junkie.ToxicBloodDrain` | quattro passi numerati: si legge la T dopo il costo, la perdi, togli l'immunità, poi il timer |
| OGG-04 | Mescolone Micidiale | `com.items.MarvelousCocktail` | passi numerati: immunità a T e L, guadagni, a fine timer perdi immunità e stati e subisci POISON |
| LR-PIN | Ultimo Giro | `base.pino.UltimoGiro` | sei paragrafi: L spesa letta all'inizio, autodanno, danno, Rincara |
| PIN-AR2 | Alla Goccia | `base.pino.GoingBerserk` | si legge la L, la spendi tutta, HIT pari a 10 più la L spesa |
| PIN-AR5 | Rutto a Bruciapelo | `base.pino.RuttoADistanzaSociale` | come sopra, con la L dopo il costo e la perdita di A all'avversario |
| OGG-03 | Doppio Malto da Discount | `com.items.AnotherRottenBeer` | compare la Bottiglia Spaccata, che occupa un posto fra gli oggetti; poi i guadagni |
| GIG-AR1 | Disassemblare | `bruiser.BreakYourToy` | distruggi l'oggetto scelto senza effetto; se non c'è più, niente |
| GIG-AR5 | Lavoro Fatto Bene | `base.gigi.LavoroFattoBene` | HIT pari a 15 più 4 per oggetto; cosa si conta (token sì, equipaggiamenti no) e quando |
| CES-BO1 | Discutiamone in Privato | `base.cesira.bound.NeRiparliamoFuori` | annulli solo una mossa che deve ancora risolversi e contiene Annuncia |
| CES-AR2 | Buon Vecchio Ricatto | `base.cesira.Ricatto` | annulli; se era un attacco rimandi una parte dei danni fissi, che le altre schede elencano |
| CES-AR3 | Copione Già Visto | `base.cesira.LoSapevo` | annulli; se era la carta annunciata, l'avversario resta Vulnerabile |
| GEN-03 | Scatto Repentino | `base.com.ShuffleFeet` | scambi tutti gli oggetti; chi supera la capacità perde i più vecchi fra quelli ricevuti |
| OGG-15 | Santino di San Briaco | `base.items.SantinoDellaPortinaia` | immune a L fino alla fine del terzo turno, contando questo |
| ROC-BO2 | Rialziamoci e Partite! | `base.rocco.bound.MiRialzo` | se hai da 1 a 30 H guadagni 4 H; si risolve anche se sei a terra |
| GEN-04 | Ce l'Hai Due Spicci? | `base.com.BeggingMoney` | copi un oggetto a caso dell'avversario; lui tiene il suo |
| GEN-10 | PERMESSO SCUSA PUOI SMETTERLA | `bruiser.BadEducation` | togli gli equipaggiamenti (stati, non oggetti), poi 8 HIT |

## La prova dell'espansione

Generatore sulla bozza più `server/src/test/resources/sb-6b/mini.json`, uscita in [sb-26/espansione/](sb-26/espansione/), fuori dalla
cartella del candidato. Due documenti ([base](sb-26/espansione/sets/base.md), [mini](sb-26/espansione/sets/mini.md)), due allegati e
**un** `cards.sqlite` con 117 carte `base` e 5 `mini`. Il documento della mini:

- dice che richiede il set `base`;
- elenca i suoi due mazzi, che mescolano carte dei due set (colonna «Set» nelle tabelle dei mazzi);
- mette «Sbuffata», legata di Spazienzio, sotto «SPAZIENZIO DE LA UCCISO (personaggio del set `base`)»: Spazienzio ha così quattro
  legate. Nessun formato presume tre bound: il raggruppamento usa lo slot o il personaggio dichiarato dalla carta, il SQLite tiene solo
  le due legate scelte dallo starter, come oggi.

Quattro carte della mini hanno testo breve, guadagni, danno e testo completo dal generatore di SB-25. `mini.RintoccoDiCampana` usa una
classe Java di prova che il generatore non conosce: tiene il testo del suo file e il documento lo dichiara nelle Revisioni.
Il documento `base` della prova è identico byte per byte al candidato: aggiungere un set non cambia quello di partenza.

## Scelte prese

1. **Cartella e nomi:** `sets/<set>.md` (documento), `sets/<set>.json` (allegato, uno per set), `cards.sqlite` (uno per tutti i set),
   `client-debug/sets/<set>.md`, `manifest.json` (argomenti, impronte di ingressi e uscite).
2. **Versione:** «Versione **1.0 — candidata**», senza data, per la ripetibilità; la data e la parola «candidata» le cambia SB-28.
3. **Segnaposto:** lettere e nomi dei danni nel documento, segnaposto `[[…]]` in allegato e SQLite.
4. **Allegato:** stessa forma di `rules-catalog.json` più `fullText` (lista di paragrafi) e `flavour`; i personaggi anche con
   `rarity`. La descrizione è il testo breve, **senza** il «Riferimento: Set Base …» dello 0.1: il rimando alla scheda lo darà il tasto
   «Testo completo» di SB-31.
5. **SQLite:** testo completo coi paragrafi separati da un a capo; immagini e sprite vuoti (illustrazioni in SB-32); `CRD002_KEYWORDS`
   copiata dal vivo senza cambi; il token, come oggi, non è in `CRD001_GUI`. Lo stesso SQLite dà gli stessi byte con la stessa libreria;
   per questo controllo e manifest usano l'impronta del contenuto.
6. **Starter:** i mazzi `starter-*` della bozza (Spazienzio, Mara, Celestina, Piera, Beppe); Sergio e Duccio non ne hanno. Gli altri mazzi
   della bozza sono di prova e restano fuori dal set.
7. **Raggruppamento:** per slot (`SPA-…` a Spazienzio, `LR-PIN` a Piera, `GEN` e `LR-STR` alle generiche, `OGG` agli oggetti); un set
   senza slot raggruppa per base, legata o riservata.
8. **Flavour** solo in allegato e SQLite, non nel documento, che è normativo.
9. **R07a del token:** OTHER, nessun guadagno, nessun danno, come nello 0.1: la bozza non ha i dati del token.
10. **Priorità** nell'intestazione col segno meno tipografico («−1»), come lo 0.1; nel testo completo di SB-25 resta «-1».

## Cosa giudica il proprietario

La forma del documento candidato: intestazione della scheda, ordine dei gruppi, S1 e S2, tabella R07a. I testi delle schede sono quelli
approvati in D174 e non sono stati toccati.

## Domande per la regia

1. I testi completi rimandano alle «regole del playground, RP-n» per le parole chiave nuove. Con il regolamento nuovo di SB-28 cambia
   solo la tabella `RIMANDI` di `testi_stampati.py` e si rigenerano testi e catalogo: confermi che è la strada, senza ritoccare i testi
   adesso?
2. Nomi degli starter (D44, D45 e seguenti) e categoria base o avanzata non sono nel file del set, quindi il documento non li mostra.
   Li aggiungiamo al file del set in SB-28 o SB-29?
3. I 21 mazzi di prova stanno nel file del set: in SB-28 escono dal file vivo o restano con un nome riconoscibile?
4. Parole chiave del client (`CRD002_KEYWORDS`, oggi le quattro inglesi del vivo) e immagini: le rinnova SB-28 o SB-31/SB-32?
