# Come si orchestra il lavoro

Metodo, **non stato**. Lo stato del progetto è in [docs/README.md](README.md) e nei piani in corso, uno per filone:
[C4](client-c4-plan.md) per il client e [Set Base](set-base-plan.md) per il primo set di carte. Non va ripetuto qui. Scritto il 5 novembre
2026 per una chat di regia che riparte dal repository, esteso l'8 novembre al Set Base e alle due macchine.

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

- **Il brief è il prompt:** stesso formato ([il prompt](#il-prompt)), con il contratto, con i file dell'altra sessione da non toccare. La regia sceglie
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
  siano puliti, rilancia sullo stato committato le verifiche economiche (e `VerifyAll` solo se il piano lo prevede, D16), e aggiorna
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

## Contratto dell'esecutore

Revisione del metodo del 10 novembre 2026, approvata dal proprietario («sì, sarebbe ottimo»): meno letture, meno ripetizioni, stessi
controlli. Il prompt di un blocco dice **«Segui il contratto dell'esecutore in docs/orchestrazione-lavoro.md»** e poi solo ciò che è
proprio del blocco (sotto, «Il prompt»). Quello che segue vale sempre, salvo che il prompt dica altro in modo esplicito.

**Letture.** AGENTS.md, questo contratto, le [insidie](#insidie-degli-strumenti-di-verifica-windows) e solo le sezioni che il prompt
nomina (di norma la sezione del blocco nel piano, le regole di non regressione, le decisioni citate, il rapporto del blocco da cui si
parte). Non leggere per intero piani, rapporti o roadmap: cercare la sezione che serve.

**Preliminare.** Working tree pulito; `git fetch`; main allineato a origin/main (se origin è avanti, rebase seguendo
[l'allineamento fra le macchine](#allineamento-fra-le-macchine), compreso il jar); porte libere. Se il prompt riporta una scelta o
un'approvazione del proprietario non ancora nel repository, registrarla per prima, con le sue parole, in un commit di soli documenti.

**Mai, salvo che il prompt lo chieda:** regolamento, `docs/sets`, server, protocollo, catalogo, client-debug, file del filone dell'altra
macchina; soglie, attesi delle verifiche, `BASE_750`, durate e calendario della sequenza, limiti di Size (un atteso di un test unitario
cambia solo con la decisione che lo autorizza, citata nel rapporto); asset da Internet; push.

**Fasi.** Una sola fase, con le domande nella chiusura e il giudizio del proprietario dal vivo come cancello. **Fase A con proposta e
STOP** solo se il prompt lo chiede: scelte visive vere, regolamento o formato, strumenti condivisi.

**Verifiche.** Sempre le economiche: `./client-web/run.ps1 -Task Test`, `Build`, `Size` (con `BM_OUT`), `./scripts/build.ps1 -Task
Test -Offline`, `python scripts/check-rules.py`, `git diff --check`. Poi solo le Playwright che il prompt elenca (D16 del piano C4);
la matrice completa solo se chiesta, con `./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa'`. Comandi in
[CONTRIBUTING.md](../CONTRIBUTING.md).

**Rossi.** Un rosso che corrisponde a una voce del [registro dei rossi noti](reports/rossi-noti.md) (verifica, misura, firma del
messaggio) si dichiara «noto, voce Rn» senza riprovarlo sulla base. Un rosso nuovo si prova sul commit di base prima di attribuirlo;
se è preesistente si aggiunge al registro, se il blocco ne chiude uno lo si toglie. Nessun rilancio automatico per far tornare il verde.

**Mutazioni.** Solo sulla logica nuova con rami (condizioni, ordini, stati, tempi): di norma 3–8 per blocco, ognuna deve far fallire
almeno un test. Non su costanti, misure o CSS, che coprono le verifiche e le catture.

**Evidenze in git.** Riepiloghi dei giri e JSON finali minificati, poche catture scelte e ricompresse: **indicativamente al più 3 MB per
fase** (rivede l'indicazione di D13, circa 10 MB). Tutto il resto resta in `%TEMP%`, citato per percorso. Niente parti intere di giri.

**Documenti.** Il rapporto del blocco nel suo file (`docs/reports/client-c4/<blocco>.md`, o quello del filone), con: cosa cambia,
attesi cambiati e decisione, verifiche eseguite e rimandate, rossi (noti o nuovi), non verificato, cosa giudica il proprietario. Lo
stato si scrive **solo** nella riga e nella sezione del blocco nel piano. `docs/README.md` si tocca solo se cambia il prossimo passo
del filone; la roadmap solo se cambia un'osservazione O. Link funzionanti.

**Commit e chiusura.** `git add` su percorsi precisi; commit in inglese «C4-x: ...» o «SB-x: ...»; nessun push. Chiusura breve: cosa
è verde e cosa no, rossi con la loro voce, cosa non è verificato, cosa giudica il proprietario, eventuali domande numerate.

### Il prompt

Proposta di modello e sforzo fuori dal blocco (sopra). Dentro, in quest'ordine e senza ripetere il contratto:

1. Percorso, «leggi AGENTS.md e segui il contratto dell'esecutore in docs/orchestrazione-lavoro.md», blocco e fase.
2. Sezioni da leggere.
3. Scelte o approvazioni del proprietario con le sue parole, se non sono già nel repository.
4. Lavoro: cosa fare, file e perimetro, eccezioni al contratto (cosa in più si può toccare).
5. Verifiche Playwright mirate del blocco e scenari da provare.
6. Cosa deve dire la chiusura, se c'è qualcosa oltre al contratto.

Per i giri di bilanciamento del Set Base restano il passo 0 di fattibilità, il tetto di giri fissato prima, i numeri decisi con la
delega di D38 e i ridisegni al proprietario.

## Come si rivede una relazione

Controllare nel repository, non fidarsi del riassunto. Si parte dall'uscita dello script di revisione
(`python scripts/review-block.py <base>..<testa>`, quando c'è: file toccati per categoria e fuori perimetro, test e attesi cambiati,
soglie, peso delle evidenze, esiti dei riepiloghi) e si leggono per intero solo i punti dubbi e la chiusura del rapporto.
- Quali test sono cambiati e perché (`git show <commit> -- client-web/tests client-web/tools`). Un atteso o una soglia cambiati per tornare al
  verde sono un rosso della revisione, anche se tutto è verde. Una correzione a un verificatore va bene solo se spiegata e se controlla la
  stessa cosa di prima.
- Non regressione a 750×292 (regola 18): `BASE_750` invariato in `client-web/tests/readability.test.ts`, che fissa i `layoutProblems` per numero di oggetti.
  I rossi già noti a 750×292 (gettone coperto dalla mano in `Verify`, messaggi di `VerifyLayout`) non sono un peggioramento se i conteggi restano
  uguali a quelli del commit di base; gli ultimi valori sono nel [rapporto C4](reports/client-c4-report.md).
- `Size`: limiti rigidi (JS 500 KiB, totale 4 MiB, atlanti 2048, texture 64 MiB) e tetto C4 di **32 MiB** di texture decodificate.
  Nessun ripristino dei vecchi tetti JS/totale (D9 rivista).
- Percorsi del commit precisi e solo quelli del blocco; evidenze entro l'indicazione del contratto; stato del blocco scritto come tale.
- I controlli verdi non vedono tutto (la cornice dell'ispezione mancava con tutti i giri verdi): guardare le catture.
- Distinguere il rosso nuovo dal rosso già presente: un rosso fuori dal [registro](reports/rossi-noti.md) va provato sul commit di base.

## Insidie degli strumenti di verifica (Windows)

- `./client-web/run.ps1 -Task VerifyAll -Only 'test,build,size,...'`: con `-Only` includere sempre `test,build,size` (senza `build` il `dist` non si
  ricostruisce); tra apici in PowerShell, altrimenti 0/0 verde. Da bash: `powershell -NoProfile -File client-web/run.ps1 ...`.
  Opzioni: `-Quick` (scenari ridotti, non equivale al consolidamento), `-Measures 750x292`, `-ReuseJar`, `-Publish <dir>`. `BM_SCENARIOS` filtra anche layout e aim: usarlo solo per `resolution`.
- Node di client-web: `.tools/client-c0/node-v24.13.0-win-x64/node.exe`; il vecchio node 12 fallisce con errori di sintassi.
- **Una sola `VerifyAll` per macchina** (blocco in `%TEMP%`), con al più `-Parallel 4` per il consolidamento: ogni esecuzione ha
  server, database, anteprima e cartella propri (porte 18080+i e 14320+i). `VerifyAim` e `VerifyLayout` misurano frame e input:
  girano da sole, alla fine, dopo 15 s di quiete. Fuori da `VerifyAll`, mai due verifiche insieme (porte 8080 e 4320, account).
  Un rosso del parallelo si rilancia da solo prima di attribuirlo; nessun rilancio automatico. Maven e `VerifyAll` non insieme
  sulla stessa macchina (anche fra sessioni Set Base e C4: il carico falsa i tempi). N>4 è dichiarato non equivalente e non pubblica.
  Sull'altra macchina le opzioni restano facoltative; prima del parallelo un giro di prova a N=2. Non fermare processi altrui.
- Rifare il jar prima (`./scripts/build.ps1 -Task Server -Offline`). `Size` scrive nel file tracciato `docs/reports/client-c2/size.json`:
  usare `BM_OUT`. Le verifiche scrivono in `%TEMP%\bm-verify-all-*`: copiare le evidenze prima del giro successivo. Se `run.ps1` esce con 1, leggere `run-summary.json`.
- 750×292 è variabile: confrontare sempre con il commit di base prima di dire che qualcosa è peggiorato.
- Nel tool Bash gli heredoc con apostrofi si rompono senza che nulla parta: scrivere file e script con lo strumento di scrittura. Uno script
  Playwright che fallisce resta appeso se il browser non si chiude: `process.exit` nel `finally` e un limite di tempo. Su Windows `nohup`/`setsid` non servono.
- Il contesto Spring completo (`TestServerContext`) è una verifica separata dai test unitari: non confonderli.
- Una copia esportata (`git archive`) per misurare sulla base ha bisogno del JDK completo (con `jar.exe`) nei suoi `.tools`:
  senza, `VerifyProfile` esce rosso per lo strumento, non per il prodotto (C4-1c).
- **Niente worktree con collegamenti a `.tools` o `node_modules`.** L'8 novembre 2026 un `git worktree remove --force` su un worktree temporaneo
  in cui `.tools` era un collegamento al checkout ha seguito il collegamento e cancellato Maven e parte di Node 24: build ferme per tutte le sessioni.
  Per una build pulita usare una copia esportata (`git archive` o copia dei file in una cartella temporanea) con i propri strumenti, oppure il
  checkout. Se `.tools` è danneggiato: `python scripts/bootstrap.py` (versioni e checksum fissati in `scripts/toolchain.json`; reinstalla solo ciò
  che manca); Node 24 del client si riestrae dallo zip in `.tools/client-c0`, verificato con `SHASUMS256.txt`. Lo ripristina una sola sessione.

## Regole di coordinamento

- Un checkout condiviso: due sessioni non modificano gli stessi file. Chi lavora ai documenti comuni (piano, report, indice) lo fa
  quando nessun esecutore li sta modificando; altrimenti rischia di essere sovrascritto.
- Una sola fonte per lo stato di un blocco: la sua riga e la sua sezione nel piano del filone. docs/README.md ha una riga corta per
  filone, che cambia solo con il prossimo passo; la chat di regia non crea altre tabelle di stato.
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

1. **Strumenti di verifica cambiati dal Set Base**, base di C4-8a: `verify-decks.mjs` e `verify-resolution.mjs` (mazzi sintetici entro
   le regole dei mazzi, SB-1); `verify-public.mjs` (pagina pubblica con regolamento 1.13 e Set Base 0.1), `check-rules.py`,
   `verify-match-manifests.py` e le CLI `cli-match-export-test`, `cli-open-complete-test`, `cli-quick-complete-test` (SB-2,
   [rapporto](reports/set-base/sb-2-report.md)). Un mazzo sintetico nuovo di C4-8a (per esempio per ExtremelyViolentBlow) deve
   rispettare R02 1.12: 20 carte regolari, al massimo 2 copie, basic e due bound del personaggio, last resort; il server rifiuta gli altri.
2. **`client-web/tests/readability.test.ts`:** una riga cambiata da SB-2 (Q8), perché i moltiplicatori degli stati ora stanno in
   `docs/sets/base.md`. Se C4 tocca lo stesso test, al pull può esserci un conflitto di una riga.
3. **SB-8, bozza giocabile da umani** (10 novembre 2026, [rapporto](reports/set-base/sb-8-report.md#per-laltra-macchina)): cambia il
   server, quindi **rifare il jar dopo il pull** prima di qualsiasi verifica del client. Nessun file del client e nessuno strumento di
   verifica del client toccati; il profilo normale (`local`, usato da tutte le verifiche) si comporta come prima. C'è un profilo nuovo,
   `bozza`, solo per lo sviluppo e le prove umane del Set Base: non serve a C4 e nessuna verifica di C4 lo attiva. `check-rules.py`
   cambia una riga (percorso di `Draft.java`, ora in `server/src/main`).
