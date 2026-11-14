# SB-30b — Fase A: sonda di costo e fedeltà (B4)

14 novembre 2026. Base `97843b3`. Blocco SB-30b ([D85](../../set-base-plan.md#decisioni-del-proprietario), [D89](../../set-base-plan.md#decisioni-del-proprietario)): Difficile a due turni e Maestro, prototipo nel playground. Questa fase consegna il [progetto tecnico](../../design/set-base/sb-30b-progetto.md) e la sonda B4 della [proposta](../../design/set-base/bot-livelli-proposta.md#stima-a-blocchi). **STOP dopo il commit.** Nessun push.

## Cosa è stato provato

Due classi **nuove**, solo nei sorgenti di test, attive solo con `-Dsim.sb30b=…` (mai nel giro normale dei test):

- `server/src/test/java/com/gsc/bm/sim/Sb30bWorld.java`: la tavola su copie per più turni. Porta il turno di `TurnForecast` a uno stato che continua (risorse, stati con durata e uso singolo, gettoni e segni, oggetti, mano, mazzo, fine turno con TOXICITY, ALCOHOL e durate). Modo **previsione** (mano avversaria ignota, ricerca come variante) e modo **mondo** (mani e mazzi campionati dalla vista e dalle liste degli starter, D85 punto 3). Durata degli stati e carta cercata, che `PrintedEffects` non espone, sono lette dalla definizione della carta a dati: è una scorciatoia di test, il progetto propone di esporle come testo (domanda 3 del progetto).
- `server/src/test/java/com/gsc/bm/sim/Sb30bProbeTest.java`, quattro parti:
  - `fidelity`: previsione a due turni contro il motore in 300 partite reali `d50` della bozza, semi e bot di `TurnForecastFidelityTest`, con le mosse davvero giocate nei due turni;
  - `cost`: ricerca per determinizzazione (N mondi × tutte le mosse legali × 2 o 3 turni, numeri casuali comuni, avversario come miscela dei tre stili del Normale, seguiti col Normale, valore a fine orizzonte) su 150 decisioni da partite reali, **un thread**, e rumore della scelta contro un riferimento a N = 400;
  - `difficile`: costo del Difficile del progetto in versione esaustiva (due turni, nessuna mano campionata);
  - `hidden`: prototipo della prova «nessuna informazione nascosta».

Nessuna classe esistente toccata: bot, banco, motore, bozza, regolamento, `docs/sets`, catalogo, client, partita viva, piano e README invariati.

## Numeri della sonda

### Fedeltà a due turni (`fidelity.json`)

| Controllo | Esito |
|---|---|
| Primo turno, salute (port di `TurnForecast`) | **5.412/5.412** turni (gli stessi di `TurnForecastFidelityTest`, braccio A) |
| Due turni, salute, nessun oggetto arrivato in campo fra i turni | **2.930/2.934** (99,86%) |
| Due turni, **tutte le risorse**, stesso insieme | **2.902/2.934** (98,9%) |
| Due turni, salute, con un oggetto pescato in campo fra i turni | 1.666/1.858 (89,7%) |
| Round esclusi (timer sul tavolo o mossa vuota) | 72 |

Il caso con l'oggetto pescato non è un errore del modello: l'oggetto arriva dalla pesca a fine del primo turno e nessuna previsione fatta prima lo può sapere; in modo mondo la pesca è campionata. Al primo giro i due insiemi erano misti (608/622 su 40 partite): separarli ha mostrato che gli scarti erano tutti lì. Restano **4 scarti** (2 situazioni viste dai due posti, semi 7.100.093 e 7.100.115, con «Spallata al bancone» nella coppia), non spiegati: primo compito di B5a.

### Costo per decisione, un thread (`cost.json`)

150 decisioni, mediana 9 mosse legali (massimo 14). Il Normale costa 0,107 ms (mediana), 0,20 ms (P90).

| N | Turni | Mediana | P90 | Massimo |
|---:|---:|---:|---:|---:|
| 10 | 2 | 14,9 ms | 23,3 ms | 33,4 ms |
| 40 | 2 | 60,9 ms | 88,9 ms | 133,1 ms |
| 100 | 2 | 152,9 ms | 222,4 ms | 350,4 ms |
| 10 | 3 | 22,7 ms | 35,7 ms | 56,5 ms |
| 40 | 3 | 91,5 ms | 145,2 ms | 209,6 ms |
| 100 | 3 | 229,4 ms | 352,0 ms | 564,7 ms |
| 400 | 2 | 611,0 ms | 874,9 ms | 1.743 ms (6 decisioni oltre 1 s) |

### Rumore al variare di N, 2 turni, contro N = 400 su mondi indipendenti

| N | Stessa mossa | Perdita media | Errore standard della mossa scelta |
|---:|---:|---:|---:|
| 10 | 80,0% | 0,0100 | 0,073 |
| 40 | 88,0% | 0,0036 | 0,038 |
| 100 | 90,7% | 0,0014 | 0,024 |

Unità della valutazione: 0,01 = un punto di salute di differenza. Con N = 100 la mossa scelta a 2 e a 3 turni coincide nel **63,3%** delle decisioni: l'orizzonte e la valutazione finale cambiano la scelta più del numero di mondi.

### Difficile esaustivo (`difficile.json`)

Stesse 150 decisioni: **mediana 5,8 ms, P90 11,6 ms, massimo 22,8 ms**; turni simulati da 3.912 (mediana) a 11.952 (massimo). Sotto i 50 ms senza potature.

### Nessuna informazione nascosta (`hidden.json`)

20 posizioni reali; nella copia la mano coperta dell'avversario è cambiata in **20 su 20** (scambi con carte del mazzo di nome diverso) e i due mazzi sono rimescolati. Viste uguali e, con lo stesso seme, **stessa mossa e stessi valori per mossa in 20 su 20**.

## Tempo speso

Tetto della sonda: 900 s cumulativi. Contato come orologio delle corse Maven (compilazione e avvio compresi):

| Corsa | Secondi |
|---|---:|
| Fedeltà, 40 partite (prima versione) | 17,3 |
| Fedeltà, 40 partite (oggetti pescati separati) | 17,1 |
| Costo, prova a 6 decisioni | 23,8 |
| Fedeltà 300 partite + anti-barare 20 posizioni | 11,8 |
| Costo e rumore, 150 decisioni | 187,3 |
| Difficile esaustivo, 150 decisioni | 21,8 |
| **Totale sonda** | **279,0 s su 900** |

Fuori dalla sonda, come verifiche: identità viva 199,2 s, `TurnForecastFidelityTest` 9,1 s, `build.ps1 -Task Test -Offline` (sotto). Nessuna corsa in contemporanea con altri Java (controllato prima di ognuna); la sessione della proposta 1.5 non usa Maven.

## Verifiche

| Verifica | Esito |
|---|---|
| `ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft` (regole 1.13, cartella di riferimento del passo 3 `%TEMP%/bm-sb16g2b3-live`) | **identico byte per byte** all'uscita del passo 3 sul codice `996925b` (`server/` non è cambiato da allora): JSON 266.868 B, Markdown 26.111 B, SHA-256 `015ffcf6…0672` e `315674e3…4dccd` |
| `TurnForecastFidelityTest` invariato | A **5.412/5.412**, B **5.422/5.422** (72 e 73 esclusi per timer), come nel passo 3 |
| `./scripts/build.ps1 -Task Test -Offline` | verde in 102 s: server **797 test, 0 falliti/errori, 17 saltati** (i 4 in più rispetto ai 793/13 del passo 3 sono i test opt-in della sonda); client-debug 37/37 |
| `python scripts/check-rules.py` | verde |
| `python scripts/check-links.py` | verde: 312 file, 0 link rotti |
| `git diff --check` | verde |

Niente Playwright e niente `TestServerContext`: nessuna classe di `main` toccata.

## Comandi riproducibili

Maven da `server/`, JDK e repository di `.tools` come nei rapporti di SB-16g:

```powershell
$env:JAVA_HOME = "$PWD/../.tools/zulu11.84.17-ca-jdk11.0.29-win_x64"
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$mvn = "$PWD/../.tools/apache-maven-3.6.3/bin/mvn.cmd"
$common = @('-s','../scripts/maven-settings.xml','-Dmaven.repo.local=../.tools/m2','-B','-o','-q')
& $mvn @common test '-Dtest=Sb30bProbeTest' '-Dsim.sb30b=fidelity,hidden' "-Dsim.sb30bOut=$env:TEMP/sb30b-probe"
& $mvn @common test '-Dtest=Sb30bProbeTest' '-Dsim.sb30b=cost' '-Dsim.sb30bPoints=150' '-Dsim.sb30bReference=400' `
  '-Dsim.sb30bCostBudget=480' "-Dsim.sb30bOut=$env:TEMP/sb30b-probe"
& $mvn @common test '-Dtest=Sb30bProbeTest' '-Dsim.sb30b=difficile' '-Dsim.sb30bPoints=150' "-Dsim.sb30bOut=$env:TEMP/sb30b-probe"
& $mvn @common test '-Dtest=ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft' '-Dsim.rules=1.13' `
  "-Dsim.liveReference=$env:TEMP/bm-sb16g2b3-live"
& $mvn @common test '-Dtest=TurnForecastFidelityTest'
```

Evidenze minificate in [sb-30b/](sb-30b/): `fidelity.json`, `cost.json`, `difficile.json`, `hidden.json`. Le uscite intere restano in `%TEMP%/sb30b-probe`.

## Non verificato e limiti

- **Qualità di gioco:** nessuna partita del Maestro o del Difficile contro altri bot, nessuna scala, per mandato. I numeri dicono costo e stabilità della scelta, non forza.
- **Ricerca della sonda più semplice di quella di B5:** niente memoria pubblica (toglie solo le carte dell'ultimo round), la mano coperta campionata può contenere oggetti (nel gioco un oggetto pescato va in campo), nessun vincolo dalle ricerche fallite, modello avversario a pesi uguali, valutazione grezza. Il costo di B5 può crescere; il margine sul tetto (massimo 565 ms contro 2 s con N = 100 e 3 turni) lo assorbe.
- **Una macchina, un thread, nessuna partita contemporanea:** il costo sul server e con più partite è B7.
- **Resa a 8 thread** delle stime di budget non misurata: le ore del progetto §6 suppongono resa lineare e 12 decisioni per partita.
- **Timer, stati sulle risorse, «x» non descritte:** fuori dalla previsione come in `TurnForecast`; i round con timer sono esclusi.
- **4 scarti di fedeltà a due turni** non spiegati (sopra).
- Bozza: `bozza.json` del classpath (braccio A). Il braccio B di D89 cambia un moltiplicatore POISON del Bancone, già letto come stato pubblico; non provato a due turni.

## Domande

Le cinque domande numerate sono nel [progetto, §7](../../design/set-base/sb-30b-progetto.md#7-domande-al-proprietario): Difficile senza mani campionate; budget (opzione A, B o C); testo stampato completato in `PrintedEffects`; memoria del Maestro per giocatore; misure con N fisso senza tempo massimo.
