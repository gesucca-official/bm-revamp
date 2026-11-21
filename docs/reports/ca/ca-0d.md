# CA-0d — Pacchetto delle carriere

21 novembre 2026, esecutore avviato dalla regia delle carriere. Blocco [CA-0d](../../ca-plan.md#ca-0d--pacchetto-delle-carriere), passo
diretto.

**Esito:** **chiuso** il 21 novembre 2026. Le tre carriere sono pacchetti JSON committati, versionati e con impronte, prodotti dallo
strumento e controllati in sola lettura da `-Task Check` come `check-rules.py` controlla i file generati delle carte. Nessun file protetto
toccato (formato, storie del serbatoio, `server/`, `client-web/`, regolamento, set).

## Forma del pacchetto

`tools/carriere/pacchetti/<id>.json`, JSON indentato di uno spazio, LF, a capo finale; i campi hanno ordine fisso, la carriera quello del
convertitore (deterministico). La forma è dello strumento ([DC4](../../ca-plan.md#decisioni)): non entra nel formato.

| Campo | Contenuto |
|---|---|
| `pacchetto` | versione della forma del pacchetto (oggi `1`) |
| `formato` | `"0.1"`, la versione del formato ([formato.md](../../carriere/formato.md)); prima `formato: 1` |
| `id`, `versione` | l'id della carriera e la sua versione intera da 1, dal manifest `tools/carriere/carriere.json` (F13: il markdown non la dichiara) |
| `impronte.storia` | sha256 del markdown senza BOM e con fine riga a LF |
| `impronte.cast` | sha256 del JSON canonico (chiavi ordinate) della parte di cast che la carriera usa e il formato governa (F11): dei personaggi nome, alias, ombra, espressioni, espressioni future e ripieghi; degli sfondi file, varianti e ripieghi; degli sprite le pose. Fuori: velocità, animazione, bocca, tempo delle animazioni, misure e posizioni (della scena di dialogo, CA-0g) |
| `carriera` | la carriera convertita (con il suo `formato: "0.1"`, che la validità controlla) |

«Usa» = l'id compare, fuori dai testi liberi, nei nodi o negli achievement della carriera convertita (personaggi, sfondi, sprite).

Intestazione di `pacchetti/tutorial.json`:

```json
{
 "pacchetto": 1,
 "formato": "0.1",
 "id": "tutorial",
 "versione": 1,
 "impronte": {
  "storia": "d55154c7e390f9b7d35da6bbdbe86fdd253c93b9be072578903264bd9fb7e7cd",
  "cast": "d910ce2c033e02102fef694fa8b25391f23045720e464401beef0ed6108cb594"
 },
 "carriera": {"formato": "0.1", "id": "tutorial", ...
```

## Comandi e regole

- `./tools/carriere/run.ps1 -Task Package` scrive i tre pacchetti; **rifiuta** (senza scrivere niente) se la storia o il cast usato sono
  cambiati a parità di versione: «alzarla in carriere.json (F13)». Se la versione è alzata, scrive.
- `-Task Check` (in più rispetto a CA-0c): per ogni voce del manifest fallisce se il pacchetto manca, non è quello che si genererebbe
  oggi, ha impronte cambiate senza versione alzata, o ha versione sopra quella del manifest; e se un pacchetto non ha voce nel manifest o
  la storia dà un id diverso da quello del manifest. Il confronto ignora i CRLF di un checkout con `autocrlf`.
- `carriere.json` è anche l'elenco delle storie (`CARRIERE` in `serbatoio.ts` lo legge): una fonte sola per strumento e prototipo.
- Modifiche collaterali: `formato: 1` → `"0.1"` in `formato.ts` (costante `FORMATO`), `converti.ts`, `valida.ts` (il prototipo non leggeva
  il campo); il convertitore normalizza BOM e CRLF all'ingresso, così la stessa storia dà lo stesso pacchetto su ogni sistema.

## Verifiche

- `tools/carriere/run.ps1 -Task Test`: 27 prove verdi (22 + 5 nuove in `tests/pacchetto.test.ts`: testo deterministico, CRLF/BOM ↔ LF,
  modifica della storia senza versione → errore e con versione alzata ok, bocca/animazione/velocità/misure → stessa impronta del cast,
  espressione usata → impronta diversa e errore senza versione, pacchetti mancanti/in più/id diverso/versione non valida).
- `-Task Check`: 0 errori; `-Task Package` ripetuto: «invariato». Numeri **identici** a [CA-0c](ca-0c.md): tutorial 6 nodi / 12 stati;
  prova 8 / 15; principale 27 / 665, 49 avvisi.
- `prototipi/carriere/run.ps1 -Task Test` (117 verdi), `-Task Check`, `-Task Build`: verdi. Non lanciati `Misura`, `Banco`, `Registra`.

## Domande aperte

1. **Il prototipo legge ancora i dati generati da sé** (`dati/generati/`), non i pacchetti: leggerli è un lavoro del client (CA-0g) o del
   motore (CA-0f), non di CA-0d.
2. **Impronta del cast per «usato».** Un personaggio nominato come valore di un segno (es. `mara`) conta come usato, come atteso; un id
   che per caso coincide con un valore di campo non di testo conterebbe pure: sovrastima innocua (chiede una versione in più, mai una in meno).
3. **Un cambio di versione senza cambio di impronte** (alzata «per sicurezza») è ammesso.
