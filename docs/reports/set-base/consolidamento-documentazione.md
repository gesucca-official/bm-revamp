# Consolidamento della documentazione del Set Base (D96)

Rapporto dell'esecutore, 14 novembre 2026. Lavoro solo documentale, prima della Fase A di SB-16i e di B5c ([D96](../../set-base-decisioni.md#decisioni-del-proprietario)). Piano di partenza: commit `8f2608a`. Due commit, non pushati. Nessun Maven: non cambia codice, né risorse, né test.

## Cosa si è spostato e dove

| Dove era | Dove è ora | Come |
|---|---|---|
| Sezioni dei blocchi chiusi SB-1 … SB-16h del [piano](../../set-base-plan.md) | [storico del piano](../../history/set-base-plan-storico.md), stessi titoli | parola per parola; nel piano restano titolo e 2–6 righe con stato, decisioni chiave e link al rapporto |
| Righe della tabella dei blocchi SB-16g, SB-16h, SB-16i e paragrafo «Ordine seguito» | storico, sezione «Tabella dei blocchi e ordine seguito» | parola per parola; nel piano righe brevi e un paragrafo breve |
| Premessa e «Stato in breve» (righe 6–11), «Fonti lette» (13–19), tabella «Cosa c'è oggi» (50–66), copertura e «Ciò che non vale più» della bozza esterna (200–210, 224–228) | storico, sezioni «Testa del piano», «Cosa c'è oggi», «Bozza esterna di carte» | parola per parola; nel piano un riassunto o un rimando |
| Tabella D1–D96 («Decisioni del proprietario») | [registro](../../set-base-decisioni.md), stesso ordine | parola per parola, con la colonna «Stato»; nel piano un paragrafo di rimando e l'indice «Decisioni in vigore per tema» |
| Regole d50 sparse (D50, D52, D54, D58–D79, contratto d50 1.1…) | nuovo [regole-playground.md](../../design/set-base/regole-playground.md) 1.0 | testo nuovo, ogni regola con la sua fonte |
| Bozza 1.5 (bozza.json + bancone-b.json) | nuovo [bozza-di-riferimento.md](../../design/set-base/bozza-di-riferimento.md) + [script](../../design/set-base/genera-bozza-di-riferimento.py) | liste e testi generati, il documento si verifica con `--verifica` |

Unici adattamenti nei testi spostati: i **target dei link** (percorsi relativi alla nuova cartella; le ancore che puntavano a sezioni rimaste nel piano puntano al piano, quelle su «Decisioni del proprietario» al registro) e, nel registro, la colonna «Stato» aggiunta in fondo. Nel registro le righe D59–D74 erano separate da righe vuote che spezzavano la tabella: ora è continua (nessuna parola cambia). Le parole sono identiche; lo prova lo script.

Altri file toccati: intestazione «Storico: … in vigore è …» di 1–2 righe, senza altre modifiche, su `sb-16g-proposta.md`, `sb-16d-proposta.md`, `sb-16h-proposta.md`, `sb-16g-2b1-rules.md` e `bot-livelli-proposta.md` (proposta dei livelli, scala rivista da D85). **Non toccati** perché non nella stessa condizione: `bozza-esterna-proposta-70-carte.md` (ha già un'intestazione equivalente) e `sb-30b-progetto.md` (ancora attivo: B5c non fatto). Rapporti, `game-rules.md`, `docs/sets/`, codice, risorse, bozza, IDEAS.md, C4, carriere, `docs/history` esistente: nessuna modifica. `docs/README.md`: solo la riga «Set Base (in corso)». `docs/orchestrazione-lavoro.md`: solo il paragrafo «Igiene dei documenti del Set Base» (un'introduzione e quattro punti, inserito prima di «Allineamento fra le macchine»).

## Righe e caratteri prima e dopo

| Documento | Prima | Dopo |
|---|---|---|
| `set-base-plan.md` | 1.463 righe, 217.464 caratteri | **698 righe, 67.823 caratteri** (non vuote: 1.119 → 501) |
| `history/set-base-plan-storico.md` | — | 799 righe, 101.391 caratteri |
| `set-base-decisioni.md` | — | 108 righe, 75.447 caratteri |
| riga Set Base di `README.md` | 5.747 caratteri | 1.253 caratteri (descrizione 795) |
| `design/set-base/regole-playground.md` | — | 101 righe, 14.646 caratteri |
| `design/set-base/bozza-di-riferimento.md` | — | 159 righe, 16.713 caratteri |

**Obiettivo «meno di 400 righe» non raggiunto: 698.** Non ho tagliato: quello che resta è ancora in vigore. Composizione del piano: blocchi chiusi riassunti 97 righe; blocchi aperti e futuri (SB-16i … SB-33, con SB-30 e SB-30b completi) 186; tabella dei blocchi e «Ordine seguito» circa 55; «Personaggi» 54; «Bilanciamento: metodo e criteri» 49; «Registro degli accordi» 44; «Regole dei mazzi concordate» 37; il resto sotto le 30 righe a sezione. Dove si potrebbe ridurre ancora, a scelta della regia: il «Registro degli accordi» (mappa di controllo, tutta ancora vera), le sezioni dei blocchi futuri SB-19 … SB-33 (Perimetro, Completamento verificabile, Rischi, ciascuna di poche righe) e il paragrafo di avanzamento di SB-30b (circa 20 righe di cronologia, lasciato completo come da consegna).

## Esito dello script di verifica

[verifica-spostamenti.py](consolidamento/verifica-spostamenti.py), di sola lettura; l'uscita completa è in [esito-verifica.txt](consolidamento/esito-verifica.txt). Per riprodurla: `python docs/reports/set-base/consolidamento/verifica-spostamenti.py` (aggiungere `--lista` per l'elenco riga per riga).

- Righe non vuote tolte dal piano: **661**; **563** compaiono identiche nello storico, **98** nel registro (le righe della tabella D con la colonna «Stato» tolta), **0 non ritrovate**.
- Righe sostituite da un riassunto o da un rimando: 655, in 34 tratti con la loro destinazione (tabella nell'esito: 24 blocchi chiusi, tabella e «Ordine seguito», testa, «Cosa c'è oggi», bozza esterna, registro). Le altre 6 sono la premessa (righe 6–11), che il piano riscrive nel paragrafo di stato: nell'allineamento automatico appare come «spostata senza sostituto».
- Righe non vuote nuove nel piano (riassunti, indice per tema, rimandi): 43.
- Prova che lo script sa fallire: cambiando una parola nello storico segnala la riga e esce con 1.

Altre verifiche: `python scripts/check-links.py` 335 file, **0 link rotti** (ancore comprese); `python scripts/check-rules.py` verde; `git diff --check` pulito. Le ancore degli oltre 100 link esterni al piano (`set-base-plan.md#…`, compreso `#decisioni-del-proprietario`, circa 185) sono conservate, perché tutti i titoli `##` e `###` del piano sono rimasti.

## Registro: stati assegnati

96 decisioni: 75 «in vigore», 2 «in vigore» con nota (D33, D84), 17 «in parte superata», 1 «superata» (D86, da D88), 1 «da verificare» (D34). Ho segnato come superate solo le decisioni per cui una successiva dice «rivede», «sostituisce» o «al posto di», o è incompatibile in modo evidente, citando il punto.

## Da verificare per la regia

**Decisioni dallo stato incerto**

1. **D34 (da verificare).** Punto 1 «115 carte» (anche il piano, «Il set in numeri», dice 115), punto 2 «starter da 12 carte distinte» e punto 6 «tre rarità, circa 54, 41 e 20» contro D60 («Approvato il totale di 120 carte»), D61–D62 (schema delle coppie) e D79 («120 slot e rarità 45 C / 55 NC / 20 R»). Nessuna decisione dice «rivede» D34. Se 120 sostituisce 115, anche la sezione «Il set in numeri» e il «Registro degli accordi» del piano (110–120, obiettivo 115) vanno riscritti: l'ho lasciata com'è.
2. **Stati assegnati per incompatibilità evidente, senza «rivede» esplicito** (da confermare): **D52** punto 3 (una coppia per personaggio, contro D61: D60 parla di «revisione esplicita di D52», D61 dice «precisa»); **D55** (composizioni: D63 dice «schede superate da D61»); **D82** punti 1 e 2 (Impatto 30, Chiave 22, Lavoro 14 + 7, valori cambiati da D90); **D87** punto 2 (applicare D86, tornato indietro in D88); **D94** nel punto sull'ordine (la 1.6 diventa SB-16i, D95 «comprende D94»).
3. **D33** lasciata «in vigore» con nota: D36 conferma i 4 per le bound di risorsa e dà 3 HIT per quelle di danno, senza dire «rivede»; ho letto D36 come precisazione.
4. **D84 / D86 / D88:** D84 (punto 2) → D86 → D88 ripristina il parametro facoltativo di D84; D84 è «in vigore» con la catena nella nota.
5. **Q11 / D52 punto 3:** per Sergio e Duccio (SB-17, SB-18) non è deciso se avranno la stessa coppia caricamento-colpo; la Q11 resta aperta nel piano.
6. **Numeri nelle decisioni D41–D45** (salute iniziale Spazienzio 85, Mara 80, Celestina 80, Piera 100, Beppe 95) non coincidono con `bozza.json` oggi (75, 70, 70, 85, 80): presumo i giri successivi con la delega di D38, registrati nei rapporti, ma nessuna riga del registro lo dice. Le decisioni restano «in vigore» come storia; per i numeri vale la [bozza di riferimento](../../design/set-base/bozza-di-riferimento.md).

**Regole in conflitto fra le fonti (d50)** — nessun conflitto irrisolto: ogni coppia di versioni incompatibili è sciolta da una decisione successiva che le revisiona esplicitamente (D54 punto 1 da D70; D58, D59, D65 e D69 da D69, D71 e D72; D70 punto 1 da D72), e le ho elencate in «Fonti superate» di [regole-playground.md](../../design/set-base/regole-playground.md). Tre punti di lettura da confermare: (a) D50 punto 2 dice «Ultimo colpo» senza «parola chiave», D73 e D78 lo trattano come dicitura definita; (b) D65 e D69 usano «due turni» e «fine gruppo», D71 «fine turno»: ho seguito D71 e il contratto 1.1; (c) il contratto d50 1.1 e la proposta 1.5 descrivono «Annuncia» con le stesse parole, la 1.5 aggiunge l'avviso del client prima dello scarto dell'ultima copia (D71, G5), che ho riportato.

**Altro**

- La riga «Piano Set Base» nella tabella dei documenti di `docs/README.md` (riga 64) dice ancora «decisioni D1–D49» e «in corso in parallelo a C4»: fuori dal perimetro della consegna (solo la riga «Set Base (in corso)»), da aggiornare.
- Il server della prova umana legge solo `bozza.json` (braccio A): per il braccio B serve un file di bozza a parte con `-Draft`. Scritto in [bozza-di-riferimento.md](../../design/set-base/bozza-di-riferimento.md) come punto della Fase A di SB-16i, non risolto qui.
- La sezione 7 di `regole-playground.md` («Decise, da attuare in SB-16i») riportano D94 e D95 senza interpretarle: non sono ancora regole.

STOP dopo il secondo commit, come da consegna; niente push.
