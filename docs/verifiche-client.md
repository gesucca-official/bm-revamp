# Verifiche del client: insidie e punti di revisione

Si legge **solo** quando un blocco usa gli strumenti di verifica di `client-web` o ne rivede l'esito. Quali verifiche servono lo dice
la [tabella delle aree](aree-protette.md#client-web); i comandi sono in [CONTRIBUTING.md](../CONTRIBUTING.md). Testo spostato il 15
novembre 2026 da [orchestrazione-lavoro.md](orchestrazione-lavoro.md), senza cambiarne le regole.

## Insidie (Windows)

- `./client-web/run.ps1 -Task VerifyAll -Only 'test,build,size,...'`: con `-Only` includere sempre `test,build,size` (senza `build` il `dist` non si
  ricostruisce); tra apici in PowerShell, altrimenti 0/0 verde. Da bash: `powershell -NoProfile -File client-web/run.ps1 ...`.
  Opzioni: `-Quick` (scenari ridotti, non equivale al consolidamento), `-Measures 750x292`, `-ReuseJar`, `-Publish <dir>`. `BM_SCENARIOS` filtra anche layout e aim: usarlo solo per `resolution`.
  Con `-Split` è ignorato: `resolution` gira tutti i suoi scenari ([C4-8a](reports/client-c4/c4-8a.md#non-verificato-e-limiti-dichiarati)); per un giro ridotto
  di `resolution`, niente `-Split`.
- Node di client-web: `.tools/client-c0/node-v24.13.0-win-x64/node.exe`; il vecchio node 12 fallisce con errori di sintassi.
- **Una sola `VerifyAll` per macchina** (blocco in `%TEMP%`), con al più `-Parallel 4` per il consolidamento: ogni esecuzione ha
  server, database, anteprima e cartella propri (porte 18080+i e 14320+i). `VerifyAim` e `VerifyLayout` misurano frame e input:
  girano da sole, alla fine, dopo 15 s di quiete. Fuori da `VerifyAll`, mai due verifiche insieme (porte 8080 e 4320, account).
  Un rosso del parallelo si rilancia da solo prima di attribuirlo; nessun rilancio automatico. Maven e `VerifyAll` non insieme
  sulla stessa macchina (anche fra sessioni di filoni diversi: il carico falsa i tempi). N>4 è dichiarato non equivalente e non pubblica.
  Su un'altra macchina le opzioni restano facoltative; prima del parallelo un giro di prova a N=2. Non fermare processi altrui.
- Rifare il jar prima (`./scripts/build.ps1 -Task Server -Offline`). `Size` scrive nel file tracciato `docs/reports/client-c2/size.json`:
  usare `BM_OUT`. Le verifiche scrivono in `%TEMP%\bm-verify-all-*`: copiare le evidenze prima del giro successivo. Se `run.ps1` esce con 1, leggere `run-summary.json`.
- 750×292 è variabile: confrontare sempre con il commit di base prima di dire che qualcosa è peggiorato.
- Uno script Playwright che fallisce resta appeso se il browser non si chiude: `process.exit` nel `finally` e un limite di tempo.
  Su Windows `nohup`/`setsid` non servono.
- Una copia esportata (`git archive`) per misurare sulla base ha bisogno del JDK completo (con `jar.exe`) nei suoi `.tools`:
  senza, `VerifyProfile` esce rosso per lo strumento, non per il prodotto (C4-1c).
- Le prove umane con la bozza (server col profilo `bozza` e `client-web/run.ps1 -Task Serve`) usano le porte 8080 e 4320, come le
  verifiche: sulla stessa macchina non vanno insieme.

## Punti di revisione

- Quali test sono cambiati e perché (`git show <commit> -- client-web/tests client-web/tools`). Una correzione a un verificatore va
  bene solo se spiegata e se controlla la stessa cosa di prima.
- Non regressione a 750×292 (regola 18): `BASE_750` invariato in `client-web/tests/readability.test.ts`, che fissa i `layoutProblems` per numero di oggetti.
  I rossi già noti a 750×292 (gettone coperto dalla mano in `Verify`, messaggi di `VerifyLayout`) non sono un peggioramento se i conteggi restano
  uguali a quelli del commit di base; gli ultimi valori sono nel [rapporto C4-11, Fase B](reports/client-c4/c4-11.md#c4-11--fase-b).
- `Size`: limiti rigidi (JS 500 KiB, totale 4 MiB, atlanti 2048, texture 64 MiB) e tetto C4 di **32 MiB** di texture decodificate.
  Nessun ripristino dei vecchi tetti JS/totale (D9 rivista).
- Soglie, attesi delle verifiche, `BASE_750`, durate e calendario della sequenza, limiti di `Size` non si toccano senza la decisione
  che lo autorizza.
- I controlli verdi non vedono tutto (la cornice dell'ispezione mancava con tutti i giri verdi): guardare le catture.
- Il rapporto di un blocco del client sta nel suo file (`docs/reports/client-c4/<blocco>.md` per C4), non nell'indice
  [client-c4-report.md](reports/client-c4-report.md). La [roadmap del client](client-roadmap.md) si tocca solo se cambia
  un'osservazione O.
- Un'immagine o un suono si generano fuori dal codice: prompt letterale committato **prima**, registro compilato dopo (D11 del
  [piano C4](client-c4-plan.md#decisioni-del-proprietario)). Nessun asset da Internet con diritti incerti (regola 14).
