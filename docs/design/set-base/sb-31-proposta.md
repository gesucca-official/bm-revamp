# SB-31 — Adeguamento del client: proposta (Fase A)

Scritta il 24 novembre 2026 su `839dfae` (regolamento 2.1, Set Base 1.0.1). Solo proposta: nessun codice cambia in questa fase.
Fonti: [SB-31 nel piano](../../set-base-plan.md#sb-31--adeguamento-del-client), [registro](../../set-base-decisioni.md#decisioni-del-proprietario),
[rossi noti](../../reports/rossi-noti.md), [roadmap del client](../../client-roadmap.md), rapporti di SB-8…SB-29.

**Esito in breve.** Il client gioca già il Set Base 1.0.1 (SB-28), ma ne mostra una parte: niente flavour, testo completo, rarità,
filtri; gli stati del set nuovo hanno segnaposto `[[…]]` scritti come testo; due verifiche sono rosse (R9, R10). Propongo cinque fasi:
**F1** rossi e verifiche, **F2** atlanti (parallela a F3), **F3** testi nell'ispezione e negli stati, **F4** catalogo ed editor,
**F5** consolidamento. Per Q4 raccomando di prendere O15 intero e di O16 solo ciò che il perimetro già chiede.

**Stato delle verifiche alla base.** `VerifyDecks` verde a 1366×768 e 844×390 col catalogo intero (jar del 24 novembre, client
ricostruito, database temporaneo); evidenze in `%TEMP%` della sessione, quattro catture in [sb-31/](sb-31/catalog-1366x768.jpg).

## 1. Inventario

Stato «nel codice» letto su `839dfae`. Fase: F1–F5 (sezione 9) oppure **fuori**, col motivo.

| # | Voce | Origine | Stato nel codice | Fase |
|---|---|---|---|---|
| 1 | Flavour nell'ispezione (i) | [D168](../../set-base-decisioni.md#decisioni-del-proprietario) (2), D187 (2) | Non arriva al client: `Card` in `contracts.ts` non ha il campo; c'è in `docs/rules-catalog.json` e in `cards.sqlite` (`T_GUI_FLAVOUR`, che il server non legge) | F3 |
| 2 | Tasto «Testo completo» nell'ispezione | D170 (4), [SB-26 rapporto](../../reports/set-base/sb-26-report.md) scelta 4 | Come il flavour: `fullText` nell'allegato e `T_GUI_FULL_TEXT` in SQLite, non nel client | F3 |
| 3 | Promemoria delle parole chiave per carta nell'ispezione | D169 (3), [SB-25 Fase A](sb-25-fase-a.md) dom. 2, [SB-28 proposta](sb-28-proposta.md) | Assente; i segnalini spiegano solo Vulnerabile, immunità, equip e timer | F3 |
| 4 | Segnalini e lista degli stati con i simboli dei danni (`EffectText`) | Piano; [SB-25 rapporto](../../reports/set-base/sb-25-report.md#domande-per-la-regia) dom. 1 | `chipsOf` (`readability.ts`) scrive `statusText(...)` come stringa: i `[[HIT]]` del vivo si vedono letterali | F3 |
| 5 | `STATUS_TEXT` e `TIMER_TEXT` indicizzati sui nomi dello 0.1 | [SB-28 rapporto](../../reports/set-base/sb-28-report.md) «Cosa resta» 4 | Cinque stati e tre timer inglesi dello 0.1; gli stati 1.0 cadono sulla descrizione del server | F3 |
| 6 | Stati con lo stesso nome (tre «LIEVE FASTIDIO»): raggrupparli? | D171 (3), SB-25 rapporto dom. 4 | Un segnalino per stato | F3 |
| 7 | Token: testo italiano generato, non quello della classe | Piano; SB-25 rapporto dom. 2 | La carta ha già il testo generato, copiato a mano in `BrokenBeerBottle.java`; lo **stato** che crea resta «BROKEN BEER» / «Hit Damage dealt x1.5…», coperto solo da `STATUS_TEXT` | F3 (nel client, dall'allegato) |
| 8 | Simboli di rarità | Piano; [SB-8 rapporto](../../reports/set-base/sb-8-report.md) scelta 7; D137 (P) | Assenti; la stampa usa 1–3 tacche e «P» (`tools/print-cards/bozza.py`, `RARITY`) | F3 (ispezione), F4 (catalogo) |
| 9 | Catalogo ed editor con 117 carte: filtri per set, rarità, personaggio | Piano | Lista unica di 124 facce, solo ricerca per testo nell'editor | F4 |
| 10 | Scelta di due legate fra quelle disponibili | Piano | Già c'è (`toggleBound`, `ownBounds`): 3 per personaggio, se ne scelgono 2 | F4 (solo verifica e riepilogo) |
| 11 | Conteggio verso 20 | Piano | Riga `deck-counts` in testa e «n / 20» nel riquadro: a 844×390 sparisce scorrendo | F4 |
| 12 | O15 riepilogo del mazzo; O16 deckbuilder | [roadmap](../../client-roadmap.md) O15, O16; Q4 | Assenti | F4 (sezione 2) |
| 13 | Ordine dei personaggi nel catalogo non stabile | Osservato nelle catture di questa fase | Fra due avvii del server lo stesso catalogo mostra i sette in ordine diverso (`session.characters`, non ordinato) | F4 |
| 14 | R9: `VerifyLayout` aspetta 37 carte e 12 con danno; a 844×390 problemi O26 sullo scarto | [D194](../../set-base-decisioni.md#decisioni-del-proprietario) (1), [R9](../../reports/rossi-noti.md) | Costanti in `tools/verify-layout.mjs:298` | F1 |
| 15 | R10: bersaglio al tocco `revealed-…` 18×25 px | D194 (1), [R10](../../reports/rossi-noti.md) | `scene.ts:368`: il bersaglio è grande quanto il dorso del ventaglio avversario | F1 |
| 16 | Avviso prima di scartare l'ultima copia (RP-17) e «∞» sul gettone (RP-21) come verifiche del client | [D183](../../set-base-decisioni.md#decisioni-del-proprietario) (4), [corrispondenza](sb-28/corrispondenza.md) | Il comportamento c'è (`model.ts:28`, `chipsOf`); manca una verifica che lo fissi col vivo | F1 |
| 17 | Contatore di Rincara visibile | [SB-28 rapporto](../../reports/set-base/sb-28-report.md) D7 | Probabilmente già visibile: il vivo è `Ruleset.D50` e `playground()` è vero, quindi la vista manda `plays`; i commenti del client dicono il contrario. Da provare in una partita | F1 (prova e commenti) |
| 18 | Leggibilità di immunità, timer, equip, L e A sotto zero | [SB-13](../../reports/set-base/sb-13-report.md), [SB-14](../../reports/set-base/sb-14-report.md), [SB-15](../../reports/set-base/sb-15-report.md) | In gran parte coperta da segnalini e timer (C4); i testi dei timer sono quelli della voce 5 | F3 (con la voce 5) |
| 19 | Velocità di ogni mossa (priorità e A dopo i costi) nella risoluzione | [SB-16b](../../reports/set-base/sb-16b-report.md) | Non mostrata come numero | **fuori**: osservazione da prova umana, non richiesta dal set; la riprende C5 o SB-33 se serve |
| 20 | Motivo dell'annullamento, carta cercata | [SB-16c](../../reports/set-base/sb-16c-report.md) | Fatto in SB-16f0 («Annullata: a terra.») | **fuori**: chiusa |
| 21 | Maiuscolo dei nomi come regola d'interfaccia | [SB-11b](../../reports/set-base/sb-11b-report.md) | I nomi sono dati (D166, SB-24) | **fuori**: deciso nei dati |
| 22 | Costo in HEALTH visibile e pagabile solo sopra il costo | [schede](schede-personaggi.md), D186 (1) | `Cost` lo disegna; `shortfall` corretto in SB-28 | **fuori**: chiusa; solo controllata nelle catture di F3 |
| 23 | Parole chiave inglesi di `CRD002_KEYWORDS` | [SB-26 rapporto](../../reports/set-base/sb-26-report.md) dom. 4 | Il server le antepone al testo; il client web tiene solo l'ultimo paragrafo (`effect` in `ui.tsx`) | **fuori**: invisibili nel client web; `client-debug` riceve solo R00 |
| 24 | Più atlanti raggruppati per set | [D189](../../set-base-decisioni.md#decisioni-del-proprietario) (2), [D193](../../set-base-decisioni.md#decisioni-del-proprietario) (3), [guida](sb-32/guida-stile.md#conteggio-e-atlanti-stima-per-dopo) | Un atlante 8×6 da 40 O9; `atlas.mjs` fallisce se le sorgenti non sono tutte le classi (oggi 117+7+1 contro 40) | F2 |
| 25 | `VerifyResolution` `c34`, `shortfall`, R8 | D185 (3), D186 | Corretti in SB-28 | **fuori**: chiuse |
| 26 | Densità del hub a 844×390 | [SB-29 proposta](sb-29-proposta.md) | Giudicata nella partita di D195 | **fuori**: non del catalogo |

## 2. Q4: O15 e O16

Le modalità attuali sono strumenti di prova (D188); O17 (collezione posseduta) e O18 (mazzo scelto in ogni coda) sono fuori dal piano
e cambieranno l'editor: con O17 il catalogo diventa «le mie carte», con O18 il mazzo si sceglie all'ingresso in coda.

- **A. Tutto O15 e O16 ora.** Un deckbuilder nuovo (pannello del mazzo affiancato, curve, ordinamenti, mazzi da starter). Molto lavoro
  che O17 e O18 rimetteranno in discussione.
- **B. O15 intero, di O16 solo il perimetro (raccomandata).** Riepilogo sempre visibile (personaggio, base, ultima risorsa, legate,
  regolari con le copie, «n / 20») più filtri, rarità e conteggio, che il piano chiede comunque. Il resto di O16 resta con O17.
- **C. Né l'una né l'altra.** Solo filtri e conteggio: con 117 carte resta difficile capire cosa c'è nel mazzo (è proprio O15).

B costa poco più di C e risolve il dubbio della prova B; le righe O15 e O16 della roadmap le aggiorna il filone del client.

## 3. Catalogo ed editor con 117 carte

**Oggi** ([catture](sb-31/catalog-844x390.jpg)): faccia da circa 127 px d'altezza, 4 colonne a 1366×768 e 3 a 844×390. Il catalogo è
lungo circa 30 righe a 1366×768 (sei schermate) e 42 righe a 844×390 (circa 18 schermate utili); il riquadro «Mazzo regolare»
dell'editor ne mostra 85 (regolari e oggetti).

**Opzione minima (raccomandata per F4).**
- Una barra di filtri sopra catalogo e «Mazzo regolare»: **personaggio** (tutti, generiche, uno dei sette), **rarità** (comune,
  non comune, rara; «P» solo sui personaggi), **tipo** (azione, oggetto), più la ricerca che c'è. **Set**: un solo valore oggi; il
  controllo compare quando i set sono due, ma il dato è già letto.
- Una **barra del mazzo fissa** (in alto a 1366×768, in basso a 844×390): «Regolari n / 20 · legate n / 2 · ultima risorsa ✓», che
  apre il riepilogo O15.
- Ordine stabile dei personaggi (voce 13); simbolo di rarità sulla faccia.

**Opzione piena.** In più: vista compatta a righe (miniatura, nome, costo, rarità) alternabile alla griglia; pannello del mazzo
affiancato a 1366×768; «parti da uno starter» per copiare uno dei cinque mazzi. Da valutare dopo le catture della minima.

**Dato del personaggio.** L'allegato non dice di quale personaggio è una carta regolare d'archetipo; i package Java non bastano
(`bruiser.*`, `junkie.*`, `com.*` misti). La fonte esplicita è `slot.json` (prefisso `SPA-`, `MAR-`…). Proposta: il generatore
(`tools/set-catalog`) scrive un campo descrittivo `character` nell'allegato, ricavato dallo slot; nessuna regola cambia. Domanda 2.

## 4. Ispezione (i): flavour, testo completo, parole chiave

**Come arriva il testo.** Due strade:
- **Client (raccomandata):** un modulo `annex.ts` importa `docs/rules-catalog.json` al build, come `public.tsx` importa già
  `docs/sets/base.md`, in un pezzo caricato a richiesta; legge per `class` = `bindingName` testo completo, flavour, rarità e (se
  passa la domanda 2) personaggio. Nessun cambio di server o protocollo. Circa 175 KB grezzi, 30 KB gzip (da misurare con `Size`).
  Una carta senza voce (partite archiviate 0.1) non mostra il tasto.
- **Server:** `CardsGuiRecord` legge `C_RARITY`, `T_GUI_FULL_TEXT`, `T_GUI_FLAVOUR`, già in `cards.sqlite`, e il `Card` del protocollo
  li porta. Fonte unica a runtime, ma tocca partita viva, `docs/api.md` e verifiche del server.

**Forma.** Nell'ispezione, sotto il testo breve, il flavour in corsivo (SB-25 ne ha misurato l'ingombro: entra a 1366×768; a
844×390 l'ispezione scorre già per 107 carte su 117). Un tasto «Testo completo» sostituisce testo breve e flavour con i paragrafi del
testo completo, disegnati con `textParts` come `EffectText` (risorse e danni come simboli); un secondo tocco torna indietro.
Il tasto è ≥ 44 px.

**Parole chiave.** Una riga di promemoria per ogni parola chiave che la carta usa (Annuncia, Vulnerabile, Gioca d'anticipo, Rincara,
In campo, Vendi, immune), presa da R07b: una frase breve per parola chiave, scritta una volta in `annex.ts` con il rimando
«regolamento, R07b». Si riconosce la parola nel testo breve. Le frasi le approva il proprietario nelle catture di F3.

## 5. Stati, token, rarità

- **Lista degli stati** nell'ispezione del personaggio: descrizione passata da `textParts`, quindi `[[HIT]]` come simbolo. **Segnalino**
  sul tavolo (canvas): il titolo usa i nomi italiani (colpo, taglio, veleno), perché la scena non disegna `EffectText`.
- **`STATUS_TEXT` e `TIMER_TEXT`:** restano solo per le partite archiviate 0.1; per il vivo vale la descrizione italiana generata del
  server, che ora è già buona (D169 (4)).
- **Stessi nomi:** un segnalino per stato come oggi, ma la lista li raggruppa sotto il nome con le descrizioni in fila (proposta;
  domanda 5 se il proprietario li vuole fusi anche sul tavolo).
- **Token:** nome e testo dello stato «BROKEN BEER» presi dall'allegato (`tokens[]`), non dalla classe; la classe Java non si tocca.
- **Rarità:** tacche 1–3 come la stampa, «P» sui personaggi; in catalogo, editor e ispezione, **non** sulle facce del tavolo, dove
  lo spazio è contato.

## 6. Atlanti per set (F2)

- **`atlas.mjs`:** legge le sorgenti per set (una cartella per set con `assets.json` come le O9) e riempie **atlanti 8×8 da 256 px,
  quanti ne servono** (`base-0.webp`, `base-1.webp`…): oggi uno, con le 125 illustrazioni due (126 celle con il segnaposto, circa 34 MB
  decodificati, sotto i 64 MB di `Size`); un'espansione aggiunge i propri senza toccare quelli del Set Base. Una classe senza sorgente
  prende il segnaposto ed è elencata, invece di fermare il build come oggi.
- **Manifest:** `files[]` con `set`, `cols`, `rows`, `tiles`; ogni riquadro dice atlante e cella.
- **`art.ts`:** `artIndex` restituisce atlante e cella; `artCss` restituisce anche `backgroundImage`, così `collection.tsx`, `table.tsx`
  e `style.css` (che oggi hanno `url('/art/atlas.webp')`) cambiano solo nella riga dell'immagine; `scene.ts` crea le texture per ogni
  atlante.
- **Nessuna immagine nuova.** Per D192 (3) nessuna O9 resta nel set finale, ma fino ai lotti di SB-32 F2 ricostruisce l'atlante con le
  O9 di oggi: le catture devono restare identiche. Verifica d'identità: con le stesse sorgenti, stesse illustrazioni a schermo.

## 7. R9 e R10 (F1)

- **R9:** `VerifyLayout` ricava gli attesi dall'allegato (numero di carte, carte con `damageAmount` diverso da «—») invece delle costanti
  37 e 12; i problemi O26 sullo scarto a 844×390 si diagnosticano e si correggono se sono del client, altrimenti si registrano.
- **R10:** il bersaglio di una carta scoperta ha un'area di tocco di almeno 44 px centrata sulla carta, come le altre del tavolo
  (la carta disegnata non cambia). Alternativa: esentarla come i segnalini e raggiungerla dall'ispezione del personaggio, che però oggi
  non elenca le carte scoperte: più lavoro.
- **D183 (4) e Rincara:** un controllo in `Verify…` per l'avviso dell'ultima copia e il «∞», e una partita con una carta «Rincara»
  che mostra il contatore; si correggono i commenti «playground only» del client se il contatore c'è.
- Alla chiusura R9 e R10 escono da [rossi-noti.md](../../reports/rossi-noti.md).

## 8. Verifiche, giudizi, mutazioni

Sempre ([tabella](../../aree-protette.md#sempre)): `git diff --check`, `check-links.py`, `check-rules.py`; client web: `-Task Test`,
`Build`, `Size` con `BM_OUT`. Le Playwright girano su partite vere e database temporaneo, a 1366×768 e 844×390 (più 1920×1080 per
`Verify` e `VerifyLayout`).

| Fase | Playwright e altre | Giudizio del proprietario | Mutazioni (3–8) |
|---|---|---|---|
| F1 | `VerifyLayout`, `VerifyFfa`, `Verify`; geometria a 750×292 contro la base (regola 18); strumenti condivisi: `VerifyLayout` sul commit di base e nuovo | nessuno visivo | area minima del bersaglio; attesi letti dall'allegato; avviso dell'ultima copia |
| F2 | `Verify`, `VerifyLayout`, `VerifyDecks`; `Size` (texture e gzip); `Atlas` ricostruito | catture identiche alla base | atlante e cella dal manifest; segnaposto per classe mancante; scelta dell'atlante per set |
| F3 | `Verify`, `VerifyResolution` (ispezione e scenario `info`), `VerifyLayout`, `VerifyFfa`; se passa la strada server anche la partita viva e il jar | catture dell'ispezione (flavour, testo completo, promemoria) e della lista degli stati a 1366×768 e 844×390 | parole chiave riconosciute; carta senza voce senza tasto; raggruppamento per nome; scelta del testo del token |
| F4 | `VerifyDecks` (con un controllo nuovo: mazzo valido costruito col catalogo intero e coi filtri), `Verify`; se cambia il generatore anche `set_catalog.py --vivo` e `check-rules.py` | catture di catalogo ed editor a 844×390, minima prima della piena | intersezione dei filtri; conteggio e barra del mazzo; ordine stabile |
| F5 | matrice `VerifyAll -Parallel 4 -Split 'resolution,ffa'`; partita del proprietario (quick, open con un mazzo costruito) | partita nel client, su PC e iPhone | — |

## 9. Fasi

| Fase | Contenuto | File | Dipende da | Parallela con | Modello |
|---|---|---|---|---|---|
| F1 | R9, R10, D183 (4), Rincara | `tools/verify-layout.mjs`, `verify-ffa.mjs`, `scene.ts` (solo bersagli scoperti), test | — | nessuna (breve) | Opus, sforzo medio |
| F2 | Atlanti per set | `tools/atlas.mjs`, `art.ts`, `public/art/manifest.json`, `scene.ts` (caricamento), riga dell'immagine in `collection.tsx`, `table.tsx`, `style.css` | F1 (stesso `scene.ts`) | F3, se F3 non tocca le righe dell'immagine | Sonnet o GPT, lavoro meccanico ben descritto |
| F3 | Ispezione, stati, token, rarità nell'ispezione | `annex.ts` nuovo, `ui.tsx`, `readability.ts`, `table.tsx`, `style.css` | F1 | F2 | Opus, sforzo alto |
| F4 | Catalogo, editor, O15 | `collection.tsx`, `deck.ts`, `style.css`, `verify-decks.mjs`; forse `tools/set-catalog` | F3 (`annex.ts`), domanda 2 | nessuna (stesso `style.css`) | Opus, sforzo alto |
| F5 | Consolidamento | rapporto, rossi, piano | tutte | — | Sonnet |

F2 e F3 toccano entrambe `table.tsx` e `style.css`: si coordinano lasciando a F2 solo la riga dell'immagine, oppure F2 va per prima.
SB-32 può partire coi lotti dopo F2, senza aspettare F3–F5.

## 10. Rischi e sovrapposizioni

- **Densità a 844×390:** il rischio del piano; la barra fissa e i filtri lo riducono, la vista compatta è la riserva.
- **Due fonti per lo stesso testo** (strada client): server e client devono venire dallo stesso commit; un client vecchio con un server
  nuovo mostra un testo completo vecchio. Oggi si costruiscono insieme.
- **Peso:** allegato nel bundle (circa 30 KB gzip) e un secondo atlante (circa 1 MB) dentro i 4 MB di `Size`, da misurare.
- **Memoria delle texture su iPhone:** due atlanti 2048² più il tavolo; da guardare nella partita di F5.
- **Filone del client (C5):** C5 farà la prova umana C con «passaggi mirati su editor/touch» e la matrice di regressione; SB-31 cambia
  proprio editor, ispezione e bersagli al tocco. Conviene che C5 parta dopo SB-31, o che la regia del client sappia quali fasi sono
  chiuse. Le righe O15 e O16 della roadmap le aggiorna il filone del client; SB-31 non le tocca. `VerifyAll` è condiviso: le fasi lo
  usano a turno.

## Domande

1. **Q4:** opzione B (O15 intero, O16 solo nel perimetro), come raccomando?
2. **Personaggio delle carte:** il generatore aggiunge il campo `character` all'allegato (raccomandato), oppure il filtro per
   personaggio resta fuori da SB-31?
3. **Testo completo e flavour:** dal client che importa l'allegato (raccomandato), o dal server con i campi già in SQLite?
4. **Catalogo ed editor:** opzione minima in F4 e la piena solo dopo le catture?
5. **Stati con lo stesso nome:** raggruppati solo nella lista dell'ispezione (raccomandato) o anche sul tavolo?
6. **Atlanti:** 8×8 quanti ne servono (raccomandato) o tre 8×6 come la stima del piano?
7. **Ordine e via:** F1 per prima, poi F2 e F3 in parallelo, poi F4 e F5; quale esecutore per ciascuna?
