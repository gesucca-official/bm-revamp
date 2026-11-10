# C4-1c — Verifiche più veloci: proposta (Fase A)

10 novembre 2026. **Fase A pronta, in attesa della scelta del proprietario.** Nessuna soglia, nessun atteso, nessuno scenario,
nessun `BASE_750` toccato; nessun orologio finto; server, protocollo, regolamento e `client-web/src` invariati. Evidenze in
[docs/reports/client-c4/c4-1c](../../../reports/client-c4/c4-1c/), [rapporto](../../../reports/client-c4-report.md#c4-1c--fase-a).

**In breve.** Il giro completo in serie dura **102 min**. Con 4 esecuzioni contemporanee, `VerifyResolution` e `VerifyFfa` divise
per scenario e `VerifyAim` e `VerifyLayout` da sole alla fine, lo stesso giro dura **38 min** (−63%), con gli stessi controlli e
gli stessi esiti tranne un rosso noto di `VerifyFfa` sotto carico (sotto). Con 8 esecuzioni il pool regge per `VerifyResolution`,
ma `VerifyFfa` diventa fragile. Raccomando **N=4** subito e una piccola correzione di `VerifyFfa` in Fase B per arrivare a 6.

## 1. Dove va il tempo

Giro di base in serie, 10 novembre 2026: copia esportata di HEAD `ed909f3` (stessi strumenti di oggi), jar `dbfc5ded848bcfb2`,
`dist` `aa25c0d2c45904da`, nessun altro processo ([run-summary](../../../reports/client-c4/c4-1c/serie-base/run-summary.json)).
**101 min 59 s**, 21 su 23 verdi. I due rossi non dipendono da questo blocco: `VerifyAim` a 844×390 è il rosso noto passato a C4-11
(stessi messaggi «arrow … crossing the buttons»); `VerifyProfile` a 1366×768 cercava `jar.exe` in `.tools` della copia esportata,
che non c'era; rilanciato sulla stessa copia con il JDK copiato è verde in 55 s (il suo JSON nelle evidenze è quello del rilancio).

| Voce (due misure) | Minuti | Quota |
|---|---:|---:|
| `VerifyResolution` | 67,3 | 66% |
| `VerifyFfa` | 13,0 | 13% |
| `VerifyLifecycle` | 5,5 | 5% |
| `VerifyAim` | 5,3 | 5% |
| `VerifyLayout` | 5,2 | 5% |
| `Verify` + `VerifyModes` (un server) | 3,1 | 3% |
| `VerifyProfile`, `VerifyDecks`, `VerifyPublic` | 3,3 | 3% |
| `Test`, `Build`, `Size` | 0,1 | 0% |

**Dentro `VerifyResolution`** (secondi, 1366×768 / 844×390, dai tempi di `step` nei log): `info` 324/275, `infoFfa` 337/196,
`infoTouch` 272/262, `ffa` 269/366, `open` 225/325, `humans` 189/201, `quick` 144/234, `report` 140/143, `jump` 38/40,
`interrupt` 13/16, `reduced` 4/5; avvio del server e accesso 23 s. Lo scenario più lungo dura circa 6 min.

**Di che cosa è fatto il tempo:**

- **Animazioni reali, misurate:** le sequenze registrate (`k1.sequenceMs`) sono 55 per 653 s a 1366×768 e 75 per 863 s a 844×390,
  cioè 11–14 min per misura, senza contare quelle delle partite `info*`. Sono ciò che la verifica controlla (durate, tetto di 20 s,
  leggibilità): non si accorciano.
- **Clock reali da 30 s:** `jump` (fatto lasciar scadere di proposito), `humans` (il tempo che resta a fine sequenza), `timeout` e
  `drop` di `VerifyFfa`, le uscite di `VerifyLifecycle`. Sono controlli: non si accorciano.
- **Turni dei computer e passi dell'interfaccia:** il resto, a tempo reale del server.
- **Attese fisse (`waitForTimeout`):** 38 chiamate in `verify-resolution.mjs`, quasi tutte 60–300 ms dopo un tocco o una chiusura;
  le grandi (7000 ms per il messaggio a scheda nascosta, 2300 e 3000 ms per il clock che continua, 1800 ms per la cattura a metà
  sequenza) misurano qualcosa. Stima: pochi minuti per misura, non misurati con precisione.
- **Avvii:** circa 8 s per server, una ventina di avvii in un giro (riavvii compresi): circa 3 min. Il jar si fa una volta (20 s,
  `-ReuseJar` lo salta); `Build` 3–20 s.

Conclusione: il giro è lungo perché è **in serie**, non per sprechi dentro le verifiche.

## 2. Leve

| Leva | Guadagno | Rischio | Come si dimostra che il controllo è identico |
|---|---|---|---|
| **a) Parallelo**, N posti con server, database, anteprima e cartella propri | da 102 a ~38 min con N=4 (insieme a b) | carico sui tempi misurati; flakiness degli strumenti sotto carico (`VerifyFfa`) | stessi script lanciati senza modifiche, cambiano solo porte e cartelle; confronto degli esiti, dei nomi dei controlli e degli scenari, dei casi e dei tempi misurati |
| **b) Divisione per scenari** di `VerifyResolution` e `VerifyFfa` | senza b il pool non scende sotto i 34 min di una sola `VerifyResolution` | stato fra scenari (non trovato: ogni scenario parte dall'hub); casi opportunistici visti in scenari diversi | nomi degli scenari letti dallo script (uno nuovo non può restare fuori); parti riunite nello stesso JSON; stesso elenco di controlli e scene |
| **c) Attese fisse su condizione** | pochi minuti per misura in serie, poco o nulla in parallelo | un'attesa che sembra di cortesia può essere ciò che si misura | non fatta nel prototipo; **una** proposta mirata sotto (ricerca della carta in `VerifyFfa`) |
| **d) Avvii e build evitabili** | ~3 min in serie, nascosti dal parallelo | un server condiviso cambierebbe ciò che provano le verifiche che lo fermano | non fatta: in parallelo il costo si nasconde da sé |
| **e) Controlli indipendenti dalla misura a una sola misura** | fino a ~25 min in serie, ~10 in parallelo | decidere quali controlli non dipendono dalla misura: errore silenzioso | solo proposta (domanda 4) |

**Verifiche che misurano tempi o fotogrammi, e cosa fa il carico:**

- `VerifyLayout` (frame entro 20/33 ms ≥ 95%, input ≤ 100 ms) e `VerifyAim` (trascinamento, stessi criteri): **da sole**, dopo il
  pool. In N=4 `VerifyAim` a 1366×768 è uscita rossa sul solo controllo dei frame (85% entro 20 ms, p95 55,9 ms) partendo subito dopo
  la fine del pool; rilanciata da sola è verde; con 15 s di quiete prima della fase da sola (aggiunti dopo N=4) in N=8 è verde
  (p95 9,8 ms contro 8,6 in serie). La quiete resta.
- `VerifyResolution` (sequenza completata entro 250 ms dal piano, etichette leggibili per 1200 ms, clock a fine sequenza): scarto
  dal piano p95 **8 ms** in serie, 14–18 ms con N=4, 24–30 ms con N=8; massimo 40, 27, 68 ms; nessuno sopra 250; etichette 1200 ms
  e clock minimo 11 s identici. Il carico si vede ma resta lontano dalla tolleranza: può stare nel pool fino a N=8.
- `VerifyFfa` (clock reale di 30 s, partite fino all'esito): lo strumento cerca una carta giocabile **a tentativi** (tocco, 60 ms,
  lettura dello stato, per ogni carta e bersaglio). Sotto carico la ricerca supera il clock di 30 s del server: «no playable card»
  con il pannello «Non hai mosso entro 30 secondi» ([cattura](../../../reports/client-c4/c4-1c/parallelo-8/ffa-844x390-two-timeout.jpg)).
  In serie succede di rado (già visto in `VerifyLifecycle` in SB-2 e in `VerifyAim` e `VerifyLayout` a 750×292 in C4-1b); con N=4 una parte su 14, con N=8 tre su 14, più due parti appese senza CPU
  per oltre 18 min (fermate a mano). Rilanciata da sola, la parte rossa di N=4 è verde.

## 3. Prototipo e prova

**Cosa c'è** (tutto dietro opzioni; senza `-Parallel` il codice segue il percorso di oggi):

- `verify-lifecycle.mjs`, `verify-ffa.mjs`, `verify-decks.mjs`, `verify-public.mjs`, `verify-profile.mjs`: `BM_SERVER_PORT` come
  già in aim, layout e resolution. Senza la variabile, comando del server e indirizzi identici a oggi (l'opzione `--server.port`
  non viene nemmeno aggiunta).
- `verify-all.mjs` + `verify-all-parallel.mjs` (nuovo): `--parallel=N` (`-Parallel N` in `run.ps1`) assegna a ogni posto un server
  (18080+i) e un'anteprima della stessa `dist` (14320+i), una cartella di evidenze per esecuzione, una coda dal più lungo al più breve
  (stime dal giro di base, solo per l'ordine); `--solo=aim,layout` (predefinito) le esegue alla fine, una per volta, dopo aver chiuso
  le altre anteprime e 15 s di quiete; `--split=resolution,ffa` lancia uno scenario per esecuzione con `BM_SCENARIOS` e riunisce le
  parti nello stesso file (le parti restano in `evidence/parts`). Un giro parallelo **non si pubblica** e il riepilogo lo dichiara non
  equivalente al consolidamento finché il proprietario non decide. Rifiuta porte occupate, come oggi.
- `compare-runs.mjs` (nuovo): confronta esiti, nomi di controlli e scene, casi, contatori e tempi misurati di più giri.

**Default identico.** Con gli strumenti nuovi e il comando di oggi (`-ReuseJar -Only 'test,build,size,lifecycle,ffa,decks,public,profile'`,
le cinque verifiche toccate alle due misure): **13 su 13 verdi, 24 min 01 s**, server sulla 8080 e anteprima sulla 4320 come oggi
([run-summary](../../../reports/client-c4/c4-1c/serie-default/run-summary.json)). Le verifiche non toccate (verify, modes,
resolution, aim, layout) girano con il codice di oggi: in modalità predefinita `verify-all.mjs` cambia solo per i due controlli di
porta (identici senza `-Parallel`) e per `serverUp`, che con la porta predefinita costruisce lo stesso comando.

**Stessa build, stesso jar.** Tutti i giri: jar `dbfc5ded848bcfb2`, `dist` `aa25c0d2c45904da`.

| Giro | Durata | Esiti | Note |
|---|---:|---|---|
| Serie, base | **101 min 59 s** | 21/23 | rossi: aim 844 (noto), profile 1366 (copia esportata; verde al rilancio) |
| N=4, split resolution e ffa | **38 min 03 s** (pool 27:57, da sole 9:58) | 20/23 | aim 844 (noto, stessi messaggi); aim 1366 (frame, subito dopo il pool; verde da sola); ffa 844 `two` (clock 30 s; verde da sola) |
| N=8, split resolution e ffa | **42 min 00 s** (pool 31:41, da sole 9:55) | 20/23 | aim 844 (noto); ffa alle due misure: tre «no playable card», due parti appese (circa 15 min persi; senza, circa 27 min) |

N=2 e N=3 non sono stati provati, su richiesta del proprietario di accorciare la prova; con il lavoro misurato (circa 100 min di pool
più 10 da sole) si stimano circa 60 e 45 min.

**Confronto dei controlli** ([confronto.json](../../../reports/client-c4/c4-1c/confronto.json), `compare-runs.mjs`):

- `Verify`, `VerifyModes`, `VerifyLifecycle`, `VerifyDecks`, `VerifyPublic`, `VerifyProfile`, `VerifyLayout`, `VerifyAim`: stessi
  controlli e stesse scene in tutti i giri.
- `VerifyResolution`: **21 controlli e 11 scene, gli stessi** in serie, N=4 e N=8; casi richiesti tutti visti nei giri paralleli
  (in serie a 844×390 mancava `lethalEndOfTurn`, che il giro non esige). Cambiano solo i casi **opportunistici** (`itemGoneBefore`,
  `itemNamedNotGone`, `barsTotal`): nei giri in serie storici escono ogni volta da scenari diversi (C4-1b: ffa e jump; C4-10: humans e
  quick; oggi: ffa e open), cioè dipendono dalle partite, non dalla divisione. `turnsSeen` 63/83 in serie, 59/58 e 66/65 in parallelo.
- `VerifyFfa`: le parti verdi hanno gli stessi controlli della serie più `k7Mouse`, `k7RaiseOnly`, `k7Touch`, che lo script esegue
  una volta, nella prima partita che li permette: divise, ogni parte ci prova, quindi **più** controlli, non meno. I controlli che
  mancano sono quelli delle parti rosse.

## 4. Raccomandazione

1. **N=4** con `-Split resolution,ffa` e `-Solo aim,layout`: circa 38 min invece di 102, `VerifyResolution` con margine ampio.
2. In Fase B, prima di salire a 6: la ricerca della carta in `VerifyFfa` (la stessa ricerca a tentativi, scritta script per script, c'è in quasi tutte le verifiche: prima `VerifyFfa`, poi le altre se servono) con attese
   **sulla condizione** (lo stato dopo il tocco) al posto dei 60 ms fissi e un tempo massimo per ogni esecuzione divisa (oggi una parte
   appesa aspetta il limite generale di 120 min). Non cambia cosa si controlla: la ricerca non è una misura.
3. Un rosso del giro parallelo si rilancia da solo prima di attribuirlo: è la regola già scritta «distinguere il rosso nuovo dal
   rosso già presente», applicata al carico. Nessun rilancio automatico: nasconderebbe le fragilità.

**Nuova formulazione proposta** per il metodo (Insidie, al posto di «Mai due verifiche insieme»):

> **Una sola `VerifyAll` per macchina** (il blocco in `%TEMP%` la impone), con al più `-Parallel 4` finché il proprietario non decide
> altrimenti: ogni esecuzione ha server, database, anteprima e cartella propri (porte 18080+i e 14320+i). `VerifyAim` e `VerifyLayout`
> misurano frame e input: girano da sole, alla fine. Fuori da `VerifyAll`, mai due verifiche insieme (porte 8080 e 4320, account). Un
> rosso di un giro parallelo si rilancia da solo prima di attribuirlo. Le sessioni del Set Base sulla stessa macchina: Maven e
> `VerifyAll` non insieme (il carico falsa i tempi misurati).

E in C4-1 («al più un server per volta»): «al più un server per esecuzione, e al più N esecuzioni per volta».

## 5. Domande al proprietario

1. **Quale N?** (a) **4**, raccomandato; (b) 2–3, più prudente, 45–60 min stimati, non provati; (c) 6–8 dopo la correzione di
   `VerifyFfa` in Fase B, con una nuova prova.
2. **Quali verifiche da sole?** (a) **`VerifyAim` e `VerifyLayout`**, raccomandato; (b) anche `VerifyFfa`, che oggi è la più
   fragile sotto carico: +13 min.
3. **Correzione di `VerifyFfa` (attesa sulla condizione nella ricerca della carta, tempo massimo per parte) in Fase B?** (a) **sì**,
   raccomandato; (b) no, si resta a N=4 e si rilancia il rosso.
4. **Leva e)**: eseguire a una sola misura i controlli che non dipendono dallo schermo (per esempio i casi del modello di
   `VerifyResolution`, la privacy delle viste di `VerifyFfa`, il profilo)? (a) **no per ora**, raccomandato: in parallelo vale circa
   10 min e la scelta di cosa «non dipende dalla misura» è dove un controllo si perderebbe senza accorgersene; (b) sì, con un elenco
   scritto controllo per controllo in Fase B.
5. **Il giro parallelo vale come consolidamento** (pubblicabile con `-Publish`)? (a) **sì dopo la Fase B**, con un giro verde a N
   scelto; (b) no, il consolidamento resta in serie e il parallelo serve allo sviluppo.
6. **Altra macchina (Set Base):** (a) **stesse opzioni, nessun obbligo**: chi lancia senza `-Parallel` non vede differenze; prima di
   usare `-Parallel` là, un giro di prova a N=2 per misurarla (core e memoria diversi, non provata); (b) solo su questa macchina.
