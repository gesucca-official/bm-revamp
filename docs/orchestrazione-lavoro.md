# Come si orchestra il lavoro sul client (e sul resto)

Metodo, **non stato**. Lo stato del progetto è in [docs/README.md](README.md) e nel piano in corso
([C4](client-c4-plan.md)); non va ripetuto qui. Scritto il 5 novembre 2026 per una chat di regia che riparte dal repository.

## Ruoli

- **Proprietario:** decide, giudica gli aspetti visivi guardando le catture o giocando, dà il comando di push («pusha»; mai prima).
  Parla italiano, vuole risposte brevi e prompt pronti da incollare in un blocco di codice. Genera gli asset con il suo strumento
  (o con una sessione GPT che ha la generazione di immagini), secondo D11 del piano C4.
- **Chat di regia:** non scrive codice di prodotto. Legge il repository, rivede le relazioni degli esecutori, dice cosa fare e a chi,
  scrive i prompt. Non tiene lo stato in chat: lo cerca nel repository.
- **Esecutori:** sessioni nuove e usa e getta, una per blocco. Leggono AGENTS.md e il prompt, lavorano, riportano. Non parlano tra loro.

## A chi dare cosa

Il proprietario ha molto più usage con GPT che con Claude: il lavoro lungo va a GPT, a Claude restano revisione e giudizio.

- **GPT, sforzo alto:** blocchi con paletti chiari e fermate: CSS e coerenza di molte schermate, integrazione di asset già scelti,
  piccole funzioni isolate, lavoro meccanico con un test che sa fallire (esempio: SB-5). Sforzo medio solo per documentazione e
  conversioni meccaniche.
- **Claude (Opus o Sonnet):** geometria e layout con regole di non regressione, giudizio visivo dove una scelta cambia l'identità,
  diagnosi di rossi non banali, consolidamento (C4-8a, C4-8b, C4-9), qualsiasi cosa in cui un'attesa allentata passerebbe inosservata.
- Un'immagine o un suono si generano fuori dal codice: prompt letterale committato **prima**, registro compilato dopo (D11).

## Scheletro di un prompt per un esecutore

1. Percorso, «leggi AGENTS.md», blocco e riferimenti da leggere (sezione del piano, regole di non regressione, decisioni già prese).
2. Cosa NON toccare (regole di gioco, server, protocollo, catalogo; file di altre sessioni). Non fare push.
3. PRELIMINARE: working tree pulito; registrare l'approvazione del blocco precedente con le parole del proprietario, in un commit a sé.
4. Fasi. Per i blocchi visivi: **proposta con catture e raccomandazione, poi FERMATI**; il codice definitivo solo dopo la scelta del proprietario.
5. Verifiche e insidie (sotto), con la matrice del blocco dal piano.
6. Documenti e commit: sezione nel report, stato nel piano/indice/roadmap solo nelle righe pertinenti, link funzionanti; «fatto, in attesa del
   giudizio del proprietario»; `git add` su percorsi precisi; commit in inglese «C4-x: ...»; nessun push.
7. Chiusura: cosa è verde e cosa no, cosa non verificato (iPhone, Safari, contrasto formale), cosa giudica il proprietario.

## Come si rivede una relazione

Controllare nel repository, non fidarsi del riassunto:
- Quali test sono cambiati e perché (`git show <commit> -- client-web/tests client-web/tools`). Un atteso o una soglia cambiati per tornare al
  verde sono un rosso della revisione, anche se tutto è verde. Una correzione a un verificatore va bene solo se spiegata e se controlla la
  stessa cosa di prima.
- Non regressione a 750×292 (regola 18): `layoutProblems` 6 in duello e 11 in FFA, `BASE_750` invariato. I rossi già noti a 750×292
  (gettone coperto dalla mano in `Verify`, 48 messaggi in `VerifyLayout`) non sono un peggioramento se i conteggi restano uguali.
- `Size`: limiti rigidi (JS 500 KiB, totale 4 MiB, atlanti 2048, texture 64 MiB) e tetto C4 di **32 MiB** di texture decodificate
  (a C4-5a-bis: 27,7 MB). Nessun ripristino dei vecchi tetti JS/totale (D9 rivista).
- Percorsi del commit precisi e solo quelli del blocco; evidenze circa 5–10 MB (D13); stato del blocco scritto come tale.
- I controlli verdi non vedono tutto (la cornice dell'ispezione mancava con tutti i giri verdi): guardare le catture.
- Distinguere il rosso nuovo dal rosso già presente: provarlo sul commit di base prima di attribuirlo al blocco.

## Insidie degli strumenti di verifica (Windows)

- `./client-web/run.ps1 -Task VerifyAll -Only 'test,build,size,...'`: con `-Only` includere sempre `test,build,size` (senza `build` il `dist` non si
  ricostruisce); tra apici in PowerShell, altrimenti 0/0 verde. Da bash: `powershell -NoProfile -File client-web/run.ps1 ...`.
  Opzioni: `-Quick`, `-Measures 750x292`, `-ReuseJar`, `-Publish <dir>`. `BM_SCENARIOS` filtra anche layout e aim: usarlo solo per `resolution`.
- Node di client-web: `.tools/client-c0/node-v24.13.0-win-x64/node.exe`; il vecchio node 12 fallisce con errori di sintassi.
- **Mai due verifiche insieme** (porte 8080 e 4320, account già collegato altrove). Prima di ogni lancio: nessun processo Maven/Java esterno e porte
  libere. Le sessioni del Set Base lanciano Maven sulla stessa macchina: una finestra di verifica alla volta, le altre in pausa. Non fermare processi altrui.
- Rifare il jar prima (`./scripts/build.ps1 -Task Server -Offline`). `Size` scrive nel file tracciato `docs/reports/client-c2/size.json`:
  usare `BM_OUT`. Le verifiche scrivono in `%TEMP%\bm-verify-all-*`: copiare le evidenze prima del giro successivo. Se `run.ps1` esce con 1, leggere `run-summary.json`.
- 750×292 è variabile: confrontare sempre con il commit di base prima di dire che qualcosa è peggiorato.
- Nel tool Bash gli heredoc con apostrofi si rompono senza che nulla parta: scrivere file e script con lo strumento di scrittura. Uno script
  Playwright che fallisce resta appeso se il browser non si chiude: `process.exit` nel `finally` e un limite di tempo. Su Windows `nohup`/`setsid` non servono.
- Il contesto Spring completo (`TestServerContext`) è una verifica separata dai test unitari: non confonderli.

## Regole di coordinamento

- Un checkout condiviso: due sessioni non modificano gli stessi file. Chi lavora ai documenti comuni (piano, report, indice) lo fa
  quando nessun esecutore li sta modificando; altrimenti rischia di essere sovrascritto.
- Una sola «fonte» per lo stato: docs/README.md e il piano. Gli esecutori aggiornano le righe pertinenti; la chat di regia non crea altre tabelle di stato.
- Il Set Base (docs/set-base-plan.md) ha il suo filone. Accoppiamento da tenere d'occhio: SB-1 e SB-2 toccano l'editor del client, quindi aspettano la fine dei
  blocchi C4 che lo toccano.
- Il consolidamento C4-9 deve rifare il giro grafico sul jar corrente (dopo i commit SB-3/SB-4 non è stato fatto) e verificare i termini d'uso reali
  dello strumento di generazione delle immagini (nell'inventario sono «non verificati»).

## Da decidere, quando serve il blocco

D1 (illustrazioni, prima di C4-6), D2 (audio, prima di C4-7), D5 e D12 (prima di C4-8a). Per ognuna il piano ha la raccomandazione. Fuori dal client:
O20 (anomalia FFA a forfait, da valutare dal proprietario). Idee registrate senza blocco: O19 (sequenza velocizzata), O24 (easter egg sugli oggetti del
tavolo), O25 (varianti dello sfondo) in [client-roadmap.md](client-roadmap.md).
