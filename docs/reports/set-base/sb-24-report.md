# SB-24 Fase B — Nomi, flavour, rarità P e bozza congelata 1.7

Esecutore, 22 novembre 2026, sul commit di base `627eb92`. Passo diretto ([D166](../../set-base-decisioni.md#decisioni-del-proprietario) (5)),
prompt della regia con il perimetro allargato dopo lo STOP 1 (sotto).

## Esito

**Consegnata, verde.** Regolamento **1.14** (R07 ammette la rarità PROTAGONIST, in breve P, senza effetti su gioco e mazzi); la bozza
porta i nomi e il flavour del proprietario e la P dei sette personaggi (**42 C / 56 NC / 19 R / 7 P**); versione **1.7** congelata.
Nessun numero della bozza cambia: lo provano `numeri-invariati.py`, `controlla-numeri.py`, i test e il passo 0 d'identità.

**Impronta di congelamento:** `server/src/test/resources/set-base/bozza.json`, versione 1.7, SHA-256
`0fa0431e77b53d65bf50e8ffd71069d3611b21b73f613fd3411a2d027e564657` (byte del repository, LF).

## Stato per tappe

- STOP 1 prima di scrivere: il passaggio a 1.14 e a «1.7» rompeva tre attesi fissi fuori perimetro. La regia ha allargato il perimetro
  a quelle tre righe e ha chiesto il passo 0 d'identità; codice P scelto: PROTAGONIST.
- Passo 0 sulla base, regolamento 1.14, caricatore, bozza, testi rigenerati, test adeguati, propagazione dei nomi, controllo nuovo con
  mutazioni, passo 0 sul codice nuovo, verifiche: tutto fatto in quest'ordine.
- STOP 2 alla verifica del contesto Spring: un quarto atteso fisso della versione «bozza», in uno script CLI; la regia ha allargato il
  perimetro anche a quella riga e la verifica è stata ripetuta.

## Cosa cambia

1. **Regolamento 1.14** ([game-rules.md](../../game-rules.md), R07 «Rarità (1.14)» e revisione 1.14): quarta rarità PROTAGONIST (P),
   come le altre un dato descrittivo del catalogo. Copia client identica; `check-rules.py` legge il paragrafo 1.14 e confronta il
   vocabolario con `Draft.RARITIES`, ora `COMMON, UNCOMMON, RARE, PROTAGONIST`. Allegato, SQLite e documento del set non cambiano: il
   Set Base 0.1 vivo resta senza rarità e nessun dato del catalogo cita la versione del regolamento.
2. **Caricatore** (`Draft.java`): `rarity` PROTAGONIST ammessa su carte e personaggi (i personaggi accettavano già una rarità); campo
   facoltativo `flavour`, testo non vuoto, in `gui` per le carte e accanto a `name` per i personaggi, che non hanno `gui`; lettori
   `flavourOf` e `characterFlavour`. Il flavour non arriva alla carta del motore: è solo descrittivo. `DraftSource` non cambia.
3. **Bozza** (`bozza.json`): `set.version` da «bozza» a «1.7»; per i 7 personaggi nome, rarità PROTAGONIST e `flavour`; per le 117
   carte `gui.name` e `gui.flavour`. Fonte: [revisione-proprietario.json](../../design/set-base/sb-24/revisione-proprietario.json),
   e [proposta.json](../../design/set-base/sb-24/proposta.json) per i campi che il proprietario non ha cambiato, testo verbatim. Scritta da
   [applica.py](sb-24/applica.py) conservando la formattazione; poi `genera-testi.py --scrivi` ha portato i nomi nuovi negli «Annuncia»
   e il nome del token in OGG-03 («crea il token «Bottiglia Spaccata» vicino a sé»).
4. **Controllo nuovo** [controlla-nomi.py](../../design/set-base/controlla-nomi.py), riga aggiunta in
   [aree-protette.md](../../aree-protette.md#playground-e-misure): N1 inglese di catalogo (nomi di classe dell'allegato, CamelCase, e nomi
   di classe citati in una descrizione), N2 segnaposto («da inventare», «nome di lavoro», «provvisorio», «TODO», «???», nome che comincia
   con «Last Resort»), N3 nome ripetuto fra due voci (maiuscole e spazi non contano; personaggi, carte e token), N4 flavour mancante. Sulla
   bozza di base trova Grab, Steal, «Last Resort: Banzai!!!», BrokenBeerBottle in OGG-03 e 124 flavour mancanti; sulla 1.7 nessuna
   violazione.

### Testi in cui un nome cambiato è stato portato

- **Bozza:** «Annuncia» di SPA-AR3/AR6 (nomi invariati), MAR-AR5/AR6, TOS-AR1/AR6, PIN-AR4/AR6, GIG-AR3/AR6, CES-AR1, ROC-AR5;
  OGG-03 (token). Le carte si cercano per binding: cambia solo la scritta.
- **Generatori:** `testi/testi_stampati.py` (nome del token in OGG-03; `flavour` ammesso fra i campi di `gui`);
  `genera-bozza-di-riferimento.py` (P nelle rarità).
- **[bozza-di-riferimento.md](../../design/set-base/bozza-di-riferimento.md):** sezione generata (starter e mazzi di prova con i nomi
  nuovi, P), riga di versione 1.4 del documento.
- **[griglia.md](../../design/set-base/griglia.md):** riga di stato SB-24; tabella dei personaggi (nomi, P); tabella degli starter (nomi,
  compresi Struggle → «Addosso!!!», Grab → «Afferrare», Steal → «Furto con Destrezza»); «Per rarità» con la colonna P; sezione nuova
  [Nomi, flavour e illustrazioni](../../design/set-base/griglia.md#nomi-flavour-e-illustrazioni-sb-24), generata da
  [genera-nomi-griglia.py](../../design/set-base/sb-24/genera-nomi-griglia.py) con nome, rarità, flavour e illustrazione di tutte le 125
  voci. Candidate, motivi, note e correzioni restano con i nomi del loro momento, come già diceva la griglia.
- **[regole-playground.md](../../design/set-base/regole-playground.md) 1.6:** le regole in vigore che citano una carta (anticipo,
  rincaro, vendita RP-25, «In campo») la chiamano col nome nuovo; nessuna regola cambia.
- **Schede, identikit e serbatoio di flavour:** una nota in testa che rimanda alla griglia e dà i due nomi di personaggio cambiati
  (Piera Pinot, SPAZIENZIO DE LA UCCISO). Titoli e testi restano: sono storia e cambiarli romperebbe ancore.
- **Non toccati:** rapporti storici, proposte dei blocchi passati, registro e piano (salvo le righe di SB-24), `docs/sets/base.md` e
  catalogo vivo (i nomi vivi cambiano con SB-28), `sb-24/genera-revisione.py` (strumento della Fase A: confronta la proposta con la bozza
  di allora e non conosce la P; non va rilanciato).

## Attesi cambiati e decisione

| Dove | Cosa | Decisione |
|---|---|---|
| `SetBaseDraftTest` | versione «1.7»; personaggi PROTAGONIST nella mappa delle rarità; «Piera Pinot»; tre nomi di oggetti e GIG-AR5; test nuovo sul flavour | D137, D166 (1), (5) |
| `Sb17CardsTest`, `Sb19InPlayTest`, `TurnForecastFidelityTest`, `ViewTableFidelityTest`, `Sb16iBotsTest` (riga della bozza attuale) | nomi delle carte giocate per nome (le mosse si danno per nome) | D166: cambio di nome deliberato; nessun numero cambia |
| `Bozza16Test` | il confronto 1.5 → bozza toglie da entrambe i campi della Fase B (versione, nomi, flavour, rarità dei personaggi); via l'atteso del nome «Giro secco» | D166; il resto di ogni carta resta confrontato |
| `Sb17MeasureTest`, `InPlayObserve` (osservatori del banco) | accettano il nome nuovo accanto al vecchio, così valgono anche sulle bozze storiche | D166 |
| `MultiSetTest` | test nuovo: P e flavour letti su carta dati, carta Java e personaggio; quattro casi di rifiuto (P abbreviata, flavour vuoto, non testuale, fuori da `gui`) | R07 1.14 |

Nessun atteso numerico cambia. `Sb21h.COUNTER/RISE` e il caso 1.5 di `Sb16iBotsTest` restano col nome vecchio: leggono bozze storiche.

**Perimetro allargato dalla regia** (risposta allo STOP 1, conseguenze di versione di D137 e D166 (5)):

- `server/src/test/java/com/gsc/bm/MatchArchiveTest.java:143`: `rulesVersion` «1.13» → «1.14», letto dal regolamento da `MatchVersions`;
- `scripts/cli-match-export-test.cjs:44`: lo stesso atteso «1.13» → «1.14» (script non agganciato a nessun compito di build);
- `server/src/test/java/com/gsc/bm/bozza/BozzaDraftTest.java:45`: versione del set della bozza «bozza» → «1.7»;
- `scripts/cli-draft-complete-test.cjs:120`: lo stesso atteso «bozza» → «1.7» nella versione registrata della partita (STOP 2: lo ha
  trovato `TestServerContext`, unico rosso su 1096 test; permesso dalla regia per la stessa ragione, D166 (5)).

`Ruleset.LIVE("1.13")` (`com/gsc/bm/model/game`, protetto) resta: è l'etichetta con cui si scelgono le regole della partita viva, che la
1.14 non cambia; il javadoc «regulation 1.13» è ora indietro di una versione senza effetti.

## Verifiche

| Verifica | Esito |
|---|---|
| `git diff --check` | nessuna segnalazione |
| `python scripts/check-links.py` | 8 link rotti, tutti in `docs/design/carriere/` verso file di `prototipi/carriere/src` tolti da CA-0c: presenti uguali sul commit di base, **nessuno nuovo** |
| `python scripts/check-rules.py` | verde, «Regolamento 1.14 … rarità ammesse (COMMON, UNCOMMON, RARE, PROTAGONIST, anche nel caricatore delle bozze)» |
| `check-rules.py`, strumento condiviso, base contro nuovo (copie da `git archive` in `%TEMP%`) | base su base verde, nuovo su nuovo verde; ognuno rifiuta il regolamento dell'altro («missing the rarity paragraph»); il nuovo rifiuta un caricatore senza PROTAGONIST («RARITIES differ from R07») |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: server 978 test, 0 falliti, 0 errori, 23 saltati (misure e sonde disattivate come prima); test client 37 su 37 |
| `./scripts/build.ps1 -Task TestServerContext -Offline`, poi `python scripts/verify-match-manifests.py` | BUILD SUCCESS dopo lo STOP 2: 1096 test, 0 falliti, 0 errori, 23 saltati; manifest `allChecks: PASS`, regolamento 1.14 (31 partite, 923 eventi) |
| `controlla-numeri.py`, `testi/controlla-testi.py` | 0 e 0: nessuna violazione R1–R4; i 117 testi coincidono col generatore |
| `controlla-nomi.py` (nuovo) | 0: 125 voci, nessuna violazione; [prova](sb-24/prova-controlla-nomi.py) su 8 copie alterate tutte rifiutate con la loro regola |
| Mutazioni del controllo ([mutazioni.py](sb-24/mutazioni.py)) | 8 su 8 uccise (una per regola e per ramo: nomi di classe, CamelCase, descrizioni, «da inventare», parola chiave, ripetuti, maiuscole, flavour) |
| [numeri-invariati.py](sb-24/numeri-invariati.py) | 0: tolti solo versione, nomi, flavour, rarità dei personaggi e i nomi fra «» delle descrizioni, la bozza 1.7 è identica a `627eb92` (rarità delle carte, salute, risorse, costi, danni, guadagni, perdite, parametri, priorità, mazzi e regole compresi) |
| `applica.py`, `genera-bozza-di-riferimento.py --verifica`, `genera-nomi-griglia.py --verifica` | allineati |
| Passo 0 d'identità ([identita.json](sb-24/identita.json)) | identico (sotto) |

**Passo 0 d'identità.** Il banco di SB-16i (`ChargeMeasureTest#measure`) non gira più sulla bozza di D162: si ferma sul vecchio tetto
delle bound di D33/D36, superato da D159. Ho usato il banco delle misure correnti (SB-21z, SB-23): `Sb19MeasureTest#round`, d50, i sette
mazzi di riferimento, 4 semi per cella dal 7.000.000, 16.128 partite per corsa, circa 30 s ciascuna. Tre corse in `%TEMP%\bm-sb24`:

- codice nuovo sulla bozza di `627eb92` contro codice di base sulla stessa bozza: `matrix.json`, `matrix.md`, `deck-observations.json`,
  `draft.json`, `in-play.json` **identici byte per byte**;
- codice nuovo sulla 1.7 contro codice nuovo sulla bozza di base: `deck-observations.json` e `in-play.json` identici byte per byte;
  `matrix.json` e `matrix.md` diversi **solo nell'intestazione** (percorso e SHA-256 del file della bozza); `draft.json` identico dopo
  aver tolto i campi della Fase B. Le matrici non portano nomi di carte, quindi i risultati sono gli stessi partita per partita.

**Rimandate:** nessuna. Non ho rifatto misure (D166 (3)).

## Rossi

Durante il lavoro, solo i rossi attesi dei test che cercavano le carte col nome vecchio (30 al primo giro sui test della bozza), tutti
risolti come in tabella. Nessun rosso del registro. I link rotti di `docs/design/carriere/` sono preesistenti e di un altro filone; non
sono nel registro dei rossi noti, che è fuori dal mio perimetro: li segnalo alla regia.

## Non verificato

- La pagina del client col profilo `bozza`: i nomi arrivano dalla bozza come prima, ma non li ho guardati a schermo.
- La resa dei flavour lunghi sul volto della carta: è SB-25 (D166 (2), domanda 4).

## Scelte prese

1. **Codice di catalogo della P: `PROTAGONIST`**, inglese come gli altri tre e con l'iniziale P (approvato dalla regia).
2. Il flavour dei personaggi sta accanto a `name`, perché i personaggi della bozza non hanno `gui`.
3. Il nome del token compare fra «» in OGG-03, come i nomi citati negli «Annuncia».
4. Nella tabella degli starter della griglia anche i nomi di classe usati come nome (Struggle, Grab, Steal) passano al nome della carta.
5. Schede, identikit e serbatoio di flavour: nota in testa invece di riscrivere titoli e storia.
6. Passo 0 d'identità sul banco di SB-21z/SB-23 invece che su quello di SB-16i, che non regge più la bozza di D162.

## Cosa guarda il proprietario sulle carte

- **OGG-02 «Bionda da 66, calda»:** «calda» resta minuscola (nome della proposta, che non hai cambiato), mentre la regola di D166 (2)
  vuole l'iniziale maiuscola su ogni parola piena. L'ho lasciata com'è.
- **Flavour lunghi:** 35 su 124 superano i 90 caratteri della proposta; il più lungo è MAR-AR3 (161), poi GEN-24 (152) e Celestina (146).
  Li prova SB-25 sul volto della carta.
- **Nomi in maiuscolo fuori da Spazienzio:** le sei generiche col nome del vivo nella sua voce (GABBIANO, DUNQUE VOLIAMOTI; ORMALE
  GUARIAMOTI; STORDIAMOTI HO DETTO; AMMALIAMOTI DI BOTTE; PERMESSO SCUSA PUOI SMETTERLA; GENTILE IL TUO CAREZZO), come da D166 (2).
- La sezione [Nomi, flavour e illustrazioni](../../design/set-base/griglia.md#nomi-flavour-e-illustrazioni-sb-24) della griglia è il
  posto per rileggere tutto in una tabella.

## Domande

1. **«Bionda da 66, calda»:** «Calda» con la maiuscola, come vuole la regola delle maiuscole, o resta così?
2. **Link rotti della Carriera** (8, preesistenti): li mette la regia nel registro dei rossi noti o li segnala al filone Carriere?
3. **Javadoc di `Ruleset.LIVE`** («regulation 1.13»): lo si allinea alla prossima modifica che tocca il modello, o resta come etichetta?

## Evidenze

In [sb-24/](sb-24/): [nomi.py](sb-24/nomi.py) (nomi finali per slot), [applica.py](sb-24/applica.py),
[numeri-invariati.py](sb-24/numeri-invariati.py), [prova-controlla-nomi.py](sb-24/prova-controlla-nomi.py),
[mutazioni.py](sb-24/mutazioni.py), [identita.json](sb-24/identita.json). Uscite e log in `%TEMP%\bm-sb24`.
