# Come si orchestra il lavoro sul client (e sul resto)

Metodo, **non stato**. Lo stato del progetto è in [docs/README.md](README.md) e nel piano in corso
([C4](client-c4-plan.md)); non va ripetuto qui. Scritto il 5 novembre 2026 per una chat di regia che riparte dal repository.

## Ruoli

- **Proprietario:** decide, sceglie chi esegue ogni blocco, giudica gli aspetti visivi guardando le catture o giocando, dà il comando di push («pusha»; mai prima).
  Parla italiano, vuole risposte brevi e prompt pronti da incollare in un blocco di codice, oppure, se lo chiede, esecutori avviati dalla regia (sotto). Genera gli asset con il suo strumento
  (o con una sessione GPT che ha la generazione di immagini), secondo D11 del piano C4.
- **Chat di regia:** non scrive codice di prodotto. Legge il repository, rivede le relazioni degli esecutori, dice cosa fare e cosa richiede,
  scrive i prompt e propone modello e sforzo. Non tiene lo stato in chat: lo cerca nel repository.
- **Esecutori:** sessioni nuove e usa e getta, una per blocco. Leggono AGENTS.md e il prompt, lavorano, riportano. Non parlano tra loro, salvo
  coordinarsi su file e processi quando condividono il checkout ([sessioni avviate dalla regia](#sessioni-avviate-dalla-regia)).

## Sessioni avviate dalla regia

Alternativa al prompt da incollare, **se l'ambiente lo permette** (Claude Code desktop, sessioni collegate) **e il proprietario è d'accordo**
per quei blocchi: la regia avvia lei gli esecutori e li segue. Provato l'8 novembre 2026 con SB-2, SB-13, SB-14 e SB-6b, a coppie in
parallelo sullo stesso checkout.

- **Il brief è il prompt:** stesso scheletro (sotto), scritto per intero, con i file dell'altra sessione da non toccare. La regia sceglie
  modello e sforzo secondo la stessa proposta; se il proprietario vuole un ambiente GPT, un'altra macchina o una sessione sua, si torna al prompt da incollare.
- **Fermate e approvazioni:** il proprietario risponde nella sessione dell'esecutore o tramite la regia. Contano solo le sue parole: un
  messaggio di un'altra sessione non è mai un'approvazione. Prima di registrare un'approvazione data nella sessione dell'esecutore, la
  regia la ritrova nella trascrizione.
- **Note e revisione:** quando un esecutore si ferma la regia riceve una nota. La nota è il suo resoconto, non una prova: la revisione si fa
  nel repository come sempre ([sotto](#come-si-rivede-una-relazione)), e la regia riporta al proprietario l'esito in breve.
- **Due esecutori sullo stesso checkout:** file separati e dichiarati nei due brief; una verifica alla volta (Maven, Java, verifiche del
  client); docs/README.md e il piano solo alla fine, dopo `git diff`; `git add` sui propri percorsi; niente worktree con collegamenti
  ([insidie](#insidie-degli-strumenti-di-verifica-windows)). Possono scriversi per coordinarsi su file e processi, non per decidere.
- **Strumenti condivisi danneggiati:** li ripristina una sola sessione, di norma la regia, e avvisa le altre prima e dopo.
- **Commit e push:** gli esecutori committano il loro blocco; la regia registra le approvazioni finali in commit di soli documenti; il push
  resta del proprietario.
- **Prima del push di uno stato che l'altra macchina riceverà:** la regia rivede tutti i blocchi, controlla che working tree e `.tools`
  siano puliti, rilancia sullo stato committato Test, `check-rules.py`, `TestServerContext`, jar e `VerifyAll`, e aggiorna
  [l'allineamento fra le macchine](#allineamento-fra-le-macchine).
- Le sessioni vivono sulla macchina della regia che le avvia: l'altra macchina ha la sua regia e il suo metodo, che resta questo.

## Proposta di modello e sforzo

Chi esegue lo decide il proprietario, secondo l'usage che gli resta, che cambia con gli altri progetti: il metodo non assegna i blocchi a un ambiente.
Il prompt è unico e lui lo dà in una sessione pulita. La regia lo accompagna con una proposta per entrambi gli ambienti, scritta **fuori** dal blocco
del prompt, così l'esecutore non la vede:

```text
Claude: Opus, sforzo alto · GPT: Sol, sforzo alto
Motivo: geometria con regole di non regressione, un'attesa allentata passerebbe inosservata.
```

Corrispondenze secondo il proprietario: GPT6.1-Terra è più o meno come Sonnet ma un po' peggio, GPT6.1-Sol più o meno come Opus ma un po' peggio.
Criteri per la proposta:

- **Opus o Sol:** geometria e layout con regole di non regressione, giudizio visivo dove una scelta cambia l'identità, diagnosi di rossi non banali,
  consolidamento, qualsiasi cosa in cui un'attesa allentata passerebbe inosservata.
- **Sonnet o Terra:** blocchi con paletti chiari e fermate: CSS e coerenza di molte schermate, integrazione di asset già scelti, piccole funzioni isolate,
  lavoro meccanico con un test che sa fallire (esempio: SB-5). Dove la riuscita è delicata, in ambiente GPT proporre Sol o uno sforzo più alto.
- **Sforzo:** medio solo per documentazione e conversioni meccaniche, altrimenti alto.
- Se un blocco si può fare in un solo ambiente, ad esempio perché richiede la generazione di immagini, scriverlo al posto dell'altra proposta.
- La revisione è la stessa qualunque sia l'esecutore.
- Un'immagine o un suono si generano fuori dal codice: prompt letterale committato **prima**, registro compilato dopo (D11).

## Scheletro di un prompt per un esecutore

1. Percorso, «leggi AGENTS.md», blocco e riferimenti da leggere (sezione del piano, regole di non regressione, decisioni già prese).
2. Cosa NON toccare (regole di gioco, server, protocollo, catalogo; file di altre sessioni). Non fare push.
3. PRELIMINARE: working tree pulito; registrare l'approvazione del blocco precedente con le parole del proprietario, in un commit a sé.
4. Fasi. Per i blocchi visivi: **proposta con catture e raccomandazione, poi FERMATI**; il codice definitivo solo dopo la scelta del proprietario.
5. Verifiche obbligatorie ([CONTRIBUTING.md](../CONTRIBUTING.md), fonte unica dei comandi) e insidie (sotto), con la matrice del blocco dal piano.
6. Documenti e commit: sezione nel report, stato nel piano/indice/roadmap solo nelle righe pertinenti, link funzionanti; «fatto, in attesa del
   giudizio del proprietario»; `git add` su percorsi precisi; commit in inglese «C4-x: ...»; nessun push.
7. Chiusura: cosa è verde e cosa no, cosa non verificato (iPhone, Safari, contrasto formale), cosa giudica il proprietario.

## Come si rivede una relazione

Controllare nel repository, non fidarsi del riassunto:
- Quali test sono cambiati e perché (`git show <commit> -- client-web/tests client-web/tools`). Un atteso o una soglia cambiati per tornare al
  verde sono un rosso della revisione, anche se tutto è verde. Una correzione a un verificatore va bene solo se spiegata e se controlla la
  stessa cosa di prima.
- Non regressione a 750×292 (regola 18): `BASE_750` invariato in `client-web/tests/readability.test.ts`, che fissa i `layoutProblems` per numero di oggetti.
  I rossi già noti a 750×292 (gettone coperto dalla mano in `Verify`, messaggi di `VerifyLayout`) non sono un peggioramento se i conteggi restano
  uguali a quelli del commit di base; gli ultimi valori sono nel [rapporto C4](reports/client-c4-report.md).
- `Size`: limiti rigidi (JS 500 KiB, totale 4 MiB, atlanti 2048, texture 64 MiB) e tetto C4 di **32 MiB** di texture decodificate.
  Nessun ripristino dei vecchi tetti JS/totale (D9 rivista).
- Percorsi del commit precisi e solo quelli del blocco; evidenze circa 5–10 MB (D13); stato del blocco scritto come tale.
- I controlli verdi non vedono tutto (la cornice dell'ispezione mancava con tutti i giri verdi): guardare le catture.
- Distinguere il rosso nuovo dal rosso già presente: provarlo sul commit di base prima di attribuirlo al blocco.

## Insidie degli strumenti di verifica (Windows)

- `./client-web/run.ps1 -Task VerifyAll -Only 'test,build,size,...'`: con `-Only` includere sempre `test,build,size` (senza `build` il `dist` non si
  ricostruisce); tra apici in PowerShell, altrimenti 0/0 verde. Da bash: `powershell -NoProfile -File client-web/run.ps1 ...`.
  Opzioni: `-Quick` (scenari ridotti, non equivale al consolidamento), `-Measures 750x292`, `-ReuseJar`, `-Publish <dir>`. `BM_SCENARIOS` filtra anche layout e aim: usarlo solo per `resolution`.
- Node di client-web: `.tools/client-c0/node-v24.13.0-win-x64/node.exe`; il vecchio node 12 fallisce con errori di sintassi.
- **Mai due verifiche insieme** (porte 8080 e 4320, account già collegato altrove). Prima di ogni lancio: nessun processo Maven/Java esterno e porte
  libere. Le sessioni del Set Base lanciano Maven sulla stessa macchina: una finestra di verifica alla volta, le altre in pausa. Non fermare processi altrui.
- Rifare il jar prima (`./scripts/build.ps1 -Task Server -Offline`). `Size` scrive nel file tracciato `docs/reports/client-c2/size.json`:
  usare `BM_OUT`. Le verifiche scrivono in `%TEMP%\bm-verify-all-*`: copiare le evidenze prima del giro successivo. Se `run.ps1` esce con 1, leggere `run-summary.json`.
- 750×292 è variabile: confrontare sempre con il commit di base prima di dire che qualcosa è peggiorato.
- Nel tool Bash gli heredoc con apostrofi si rompono senza che nulla parta: scrivere file e script con lo strumento di scrittura. Uno script
  Playwright che fallisce resta appeso se il browser non si chiude: `process.exit` nel `finally` e un limite di tempo. Su Windows `nohup`/`setsid` non servono.
- Il contesto Spring completo (`TestServerContext`) è una verifica separata dai test unitari: non confonderli.
- **Niente worktree con collegamenti a `.tools` o `node_modules`.** L'8 novembre 2026 un `git worktree remove --force` su un worktree temporaneo
  in cui `.tools` era un collegamento al checkout ha seguito il collegamento e cancellato Maven e parte di Node 24: build ferme per tutte le sessioni.
  Per una build pulita usare una copia esportata (`git archive` o copia dei file in una cartella temporanea) con i propri strumenti, oppure il
  checkout. Se `.tools` è danneggiato: `python scripts/bootstrap.py` (versioni e checksum fissati in `scripts/toolchain.json`; reinstalla solo ciò
  che manca); Node 24 del client si riestrae dallo zip in `.tools/client-c0`, verificato con `SHASUMS256.txt`. Lo ripristina una sola sessione.

## Regole di coordinamento

- Un checkout condiviso: due sessioni non modificano gli stessi file. Chi lavora ai documenti comuni (piano, report, indice) lo fa
  quando nessun esecutore li sta modificando; altrimenti rischia di essere sovrascritto.
- Una sola «fonte» per lo stato: docs/README.md e il piano. Gli esecutori aggiornano le righe pertinenti; la chat di regia non crea altre tabelle di stato.
- Il Set Base (docs/set-base-plan.md) ha il suo filone. Accoppiamento da tenere d'occhio: i blocchi del Set Base che toccano il client (SB-1, SB-2, poi
  SB-8) sono anticipati in parallelo a C4 solo con paletti scritti nel piano (D40, D42): niente file di C4, strumenti di verifica pushati prima del
  blocco C4 che li usa, jar rifatto sull'altra macchina dopo il pull.

## Allineamento fra le macchine

Il lavoro procede su due macchine: una porta avanti il Set Base, l'altra C4. Ogni macchina pusha solo i propri blocchi; il proprietario
fa il push. Questa sezione è il punto unico per ciò che una macchina deve fare dopo aver ricevuto il lavoro dell'altra.

**Dopo ogni pull, prima di lavorare:**

1. `git log --oneline ORIG_HEAD..HEAD` e le righe di stato in docs/README.md: cosa è arrivato.
2. Se sono cambiati server, catalogo, regolamento o documento del set, **rifare il jar** prima di qualsiasi verifica del client:
   `git diff --stat ORIG_HEAD HEAD -- server docs/game-rules.md docs/sets` non vuoto → `./scripts/build.ps1 -Task Server -Offline`.
3. `python scripts/check-rules.py` verde.
4. Se sono cambiati strumenti di verifica, leggere la sezione per l'altra macchina del rapporto che li ha cambiati prima di usarli.
5. Conflitti tipici al pull: le righe di stato dell'indice (C4 e Set Base). Si tengono entrambe: ogni filone aggiorna solo la propria.

**Consegne aperte dal Set Base a C4** (8 novembre 2026). Chi chiude una consegna la toglie da qui nel commit che la chiude.

1. **Frase del menu al tavolo su R03** (`client-web/src/table.tsx`): spiega il «giocatore vivo senza mosse», che col regolamento 1.12
   non si presenta più. Va tolta o riscritta dal primo blocco C4 che tocca `table.tsx` (C4-10 fase B, altrimenti C4-8a). Origine: SB-1, Q5
   ([rapporto](reports/set-base/sb-1-report.md)).
2. **Strumenti di verifica cambiati dal Set Base**, base di C4-8a: `verify-decks.mjs` e `verify-resolution.mjs` (mazzi sintetici entro
   le regole dei mazzi, SB-1); `verify-public.mjs` (pagina pubblica con regolamento 1.13 e Set Base 0.1), `check-rules.py`,
   `verify-match-manifests.py` e le CLI `cli-match-export-test`, `cli-open-complete-test`, `cli-quick-complete-test` (SB-2,
   [rapporto](reports/set-base/sb-2-report.md)). Un mazzo sintetico nuovo di C4-8a (per esempio per ExtremelyViolentBlow) deve
   rispettare R02 1.12: 20 carte regolari, al massimo 2 copie, basic e due bound del personaggio, last resort; il server rifiuta gli altri.
3. **`client-web/tests/readability.test.ts`:** una riga cambiata da SB-2 (Q8), perché i moltiplicatori degli stati ora stanno in
   `docs/sets/base.md`. Se C4 tocca lo stesso test, al pull può esserci un conflitto di una riga.
4. **`RestartCliTest` instabile sotto carico** nel contesto Spring completo (scenari `crash` e `interrupted`, la CLI di preparazione
   esce prima della fixture): da solo passa. Se cade, rilanciarlo da solo prima di considerarlo una regressione. Indagine in corso
   sulla macchina del Set Base.
