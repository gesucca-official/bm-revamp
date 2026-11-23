# SB-28 — Trasferimento nella partita viva: rapporto

Blocco secondo la [proposta](../../design/set-base/sb-28-proposta.md) e [D182](../../set-base-decisioni.md#decisioni-del-proprietario).

## Fase A

**Approvata il 23 novembre 2026 ([D183](../../set-base-decisioni.md#decisioni-del-proprietario)).** Scelte dell'esecutore accettate per D1, D2, D4, D5, D6, D8; D3: «Ultimo colpo» non entra nel 2.0; D7: avviso e «∞» escono dal regolamento verso le verifiche del client di SB-31; il formato del file del set va in `docs/formato-file-set.md` (Fase B). Le correzioni di D3 e D7 sono state fatte dalla regia nel regolamento candidato e nella corrispondenza.

**Esito: consegnata il 23 novembre 2026, STOP per la lettura del proprietario.** La norma è scritta solo come testo: il
[regolamento 2.0 candidato](../../design/set-base/sb-28/game-rules-2.0.md), la [corrispondenza](../../design/set-base/sb-28/corrispondenza.md)
e il documento del Set Base 1.0 candidato rigenerato coi rimandi al regolamento. Nulla di vivo cambia: `docs/game-rules.md`,
`docs/sets/`, copie del client, `cards.sqlite` vivo e codice del server sono invariati; `check-rules.py` sul vivo è verde senza
modifiche. Base del blocco `5870108`.

### Cosa è stato scritto

1. **Regolamento 2.0 candidato** ([game-rules-2.0.md](../../design/set-base/sb-28/game-rules-2.0.md)): la 1.14 con le regole del
   playground che governano il gioco, scritte come regole di sistema nella numerazione del regolamento. I numeri R00–R09 non
   cambiano (sono citati in tutto il repository); entrano due regole con lettera, nello stile di R01a e R07a:
   - **R02a — Ricerca al posto della pesca** (RP-8…RP-12, RP-24);
   - **R07b — Parole chiave**, ciascuna definita una volta: Annuncia, Vulnerabile e gettone, Gioca d'anticipo, Rincara, In campo,
     Vendi, «Ultimo colpo», immune.

   Le regole di sistema stanno dove la 1.14 tratta già l'argomento: pavimento a zero e «a terra» in R01, costi in R03, gruppi di
   velocità e «chi è a terra non colpisce» in R04, corazza dell'alcol in R05, ordine dei timer, effetti In campo e nessuno spareggio
   in R06, informazioni pubbliche in R08. Revisione 2.0 con la motivazione (D50, D73, D78, SB-28, D182). Un riquadro in testa dice
   che il testo è candidato e non in vigore; si toglie al passaggio.
2. **Corrispondenza** ([corrispondenza.md](../../design/set-base/sb-28/corrispondenza.md)): RP-n → regola 2.0, le altre sezioni del
   playground, le regole 1.14 che cambiano o perdono una frase (nessuna sparisce per intero: tre frasi), e le regole del formato
   (RP-22, RP-26, RP-28, più `searchShuffle`, `anticipo`, `perPlay`) col testo da portare in una pagina del formato in Fase B.
3. **Set Base 1.0 candidato coi rimandi.** I rimandi «regole del playground, RP-n» nascono in un solo posto, la tabella `RIMANDI`
   di [testi_stampati.py](../../design/set-base/testi/testi_stampati.py) (generatore dei testi di SB-25). Il file del set non li
   contiene; `tools/print-cards/bozza.py` li ha scritti a mano nella guida della stampa della bozza (sotto, «Non toccato»).
   Cambiate le dieci righe del playground e quella di «immune» (definizione spostata in R07b); poi `genera-testi.py --scrivi` e
   `set_catalog.py`. Risultato:
   - **file del set invariato:** SHA-256 `325926e3…` prima e dopo (`genera-testi.py` riscrive solo campi uguali);
   - **testo breve invariato** (sta nel file del set);
   - `testi-completi.json`: 101 campi cambiati, **tutti solo dentro le parentesi del rimando** (confronto campo per campo con
     i rimandi tolti: 101 su 101); nessun «regole del playground» rimasto; impronta `2b3e1a93…` → `ef7cd3ea…`;
   - catalogo candidato rigenerato: `sets/base.md`, copia client, `sets/base.json`, `cards.sqlite`, `manifest.json`; nel documento
     del set cambiano solo i rimandi e l'impronta dei testi completi nella riga di revisione.

   Rimandi nuovi: corazza → R05; pavimento → R01; a terra → R04; annuncia → R02a e R07b; vulnerabile, anticipo, rincara, vendi,
   in campo, immune → R07b; scarto (carta di ricerca scartata) → R02a.

### Dubbi aperti (non risolti in silenzio)

- **D1. RP-20, «fattori moltiplicati … prima dei troncamenti del percorso R05».** Il motore crea ogni Vulnerabile come uno stato
  INPUT a sé (`Vulnerability.statuses`) e `applyStatusToDamage` tronca dopo ogni stato: due gettoni su 13 HIT danno 19 poi 28, non
  13 × 2,25 = 29. **Scelto:** la 2.0 scrive quello che fa il motore (R07b Vulnerabile punto 2: troncamento per passo, «circa ×2,25»),
  coerente con R05. **Alternativa:** prodotto dei fattori e un solo troncamento, che richiede una modifica del motore e una misura.
- **D2. RP-16, «dopo tutti gli effetti di fine turno».** Nel motore il gettone soddisfatto cade con la scadenza degli stati (R06 punto 4),
  dopo veleno, alcol e timer ma prima dell'effetto In campo (punto 5). Nessun esito diverso: In campo non è un danno.
  **Scelto:** «cade con la scadenza degli stati di quel fine turno». **Alternativa:** la frase del playground, imprecisa sull'ordine.
- **D3. «Ultimo colpo».** D50 (2) dice «nessuna parola chiave», la sezione 4 del playground la conta fra le parole chiave; nessuna
  carta del Set Base 1.0 la usa (0 `lastBlow` nel file del set). **Scelto:** è in R07b, come eccezione scritta sulla carta, perché
  RP-3 è nell'elenco da tradurre e il motore la supporta. **Alternativa:** toglierla dal regolamento finché una carta non la usa.
- **D4. Vendi come parola chiave.** La proposta non la elenca, ma il testo completo di «Fiuto per gli Affari» ha un rimando proprio
  («vendi») e RP-25 è una regola generale. **Scelto:** voce «Vendi» in R07b e l'eccezione del ricavato in R04. **Alternativa:** solo
  la frase in R04, senza parola chiave.
- **D5. «Gettone».** Nei testi compare una volta («gettone di vulnerabilità»); in R01a «token oggetto» è un oggetto sul campo.
  **Scelto:** gettone = segno sul giocatore legato a un nome, uno stato (R05), distinto dal token oggetto; nel Set Base l'unico è
  Vulnerabile. **Alternativa:** non definirlo e usare solo «Vulnerabile».
- **D6. Annuncia comprende sempre Vulnerabile.** D78 (1) lo definisce così e tutte le 12 ricerche del file del set hanno il gettone,
  ma il formato e il generatore ammettono una ricerca senza. **Scelto:** la 2.0 segue D78; una carta senza Vulnerabile dovrebbe dirlo
  nella scheda (R00). **Alternativa:** Vulnerabile come parte facoltativa di Annuncia.
- **D7. Comportamenti del client nelle regole.** RP-17 (avviso prima di scartare l'ultima copia) e RP-21 («∞» sul gettone) sono
  comportamenti del client. **Scelto:** restano nel testo di R07b com'erano nelle RP. **Alternativa:** toglierli e portarli nelle
  verifiche del client (SB-31). Il contatore di Rincara è pubblico per R08, ma il client lo mostrerà solo con SB-31.
- **D8. «Immune» spostato.** La definizione passa da R01 a R07b e il rimando dei testi da «R01 e R06» a «R07b»: è un rimando non del
  playground, cambiato perché la parola chiave sia definita una volta. **Alternativa:** lasciarla in R01 e far rimandare R07b a R01.

### Verifiche

Comandi dalla tabella delle aree (catalogo candidato e suoi ingressi, file del set, dipendenza di `tools/print-cards`, «Sempre»):

| Verifica | Esito |
|---|---|
| `python -X utf8 scripts/check-rules.py` (vivo) | verde, invariato: «Regolamento 1.14 e Set Base 0.1 allineati alle copie client; … SQLite integro.» |
| `python -X utf8 scripts/check-rules.py --candidate` | verde: «Catalogo candidato …: 1 set (base 125 voci); schede uguali al testo completo, testo breve, guadagni e danno uguali al generatore di SB-25, … copie client e file identici alla generazione.» |
| `python -X utf8 tools/set-catalog/set_catalog.py --check` | «5 file … identici alla generazione.» |
| `python -X utf8 tools/set-catalog/prova-errori.py` | copia intatta uscita 0; i quattro guasti provocati escono con 1, come atteso |
| `controlla-testi.py` | «117 carte e 44 stati: … 125 testi completi coincidono; nessun gergo» |
| `controlla-numeri.py`, `controlla-nomi.py` | 0 violazioni |
| impronta del file del set | `325926e35d37…` prima e dopo |
| confronto dei testi completi | 101 campi cambiati, 101 solo nei rimandi |
| `tools/print-cards/test_generator.py`, `verify.py` | 16 test OK; «OK: 40 voci, 40 fronti …» |
| `./scripts/build.ps1 -Task Test -Offline` | BUILD SUCCESS: 1486 test, 0 falliti, 0 errori, 23 saltati; client di debug 37 su 37 (log in `%TEMP%\sb28-fase-a-test.log`) |
| `git diff --check` | nessuna segnalazione |
| `scripts/check-links.py` | 8 link rotti, tutti preesistenti e fuori dal blocco (`docs/design/carriere/`, verso `prototipi/carriere/` non nel repository); nessuno nuovo |

Non eseguiti: il PDF della bozza (`generate.py --bozza`) non è stato rigenerato né guardato: i rimandi nuovi sono tutti più corti dei
vecchi, quindi il libretto dei testi completi non può allungarsi. `TestServerContext` e le verifiche del client: nessun codice né file
vivo toccato.

### Non toccato, per la Fase B

- `tools/print-cards/bozza.py`: la guida della stampa della bozza cita a mano «regole del playground, RP-n» in sette frasi e le
  regole del playground come fonte. Stampa la bozza com'è oggi nel playground, quindi è ancora vera; si riscrive quando la stampa
  usa il set vivo (Fase B).
- La riga di revisione del documento del set candidato («1.0 candidata — SB-26») è scritta da `set_catalog.py` e non cita la versione
  del regolamento: al passaggio dovrebbe dire che il set richiede il regolamento 2.0.
- Commenti Javadoc di `Sb27SpecialCardsTest` (RP-13–RP-24, RP-27): solo commenti.
- Le evidenze storiche di SB-25 e SB-26 (`revisione-b.html`, `sb-26/espansione/`) restano coi rimandi del loro momento.
- I file non tracciati in `output/pdf/` (PDF della bozza) erano nel working tree all'inizio e non sono di questo blocco: non toccati
  né aggiunti.

### Scelte prese

- Numerazione: R00–R09 invariati, regole nuove con lettera (R02a, R07b), per non rompere i riferimenti esistenti.
- Regole di sistema dentro le regole 1.14 che trattano l'argomento; parole chiave tutte in R07b.
- La revisione 2.0 cita la cancellazione dei mazzi salvati (D182 (3)) come operazione del passaggio, non come regola; la quick a caso
  fra i cinque starter (D182 (1)) non cambia il testo di R01.
- Il formato del file del set non entra nel regolamento: testo pronto nella sezione 3 della corrispondenza.

### Per il proprietario

Leggere il regolamento 2.0 (soprattutto R04, R06 e R07b) e la corrispondenza. Domande:

1. I dubbi D1–D8: vanno bene le scelte?
2. Dove va la descrizione del formato del file del set: una pagina `docs/formato-file-set.md` in Fase B (proposta), o i commenti delle
   classi del caricatore?
