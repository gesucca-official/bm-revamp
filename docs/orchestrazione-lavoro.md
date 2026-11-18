# Come si orchestra il lavoro

Metodo, **non stato**, valido per ogni filone e su ogni macchina. Lo stato è in [docs/README.md](README.md) («Filoni attivi») e nel
piano di ciascun filone. Le verifiche si scelgono dalla [tabella delle aree](aree-protette.md). Riscritto il 15 novembre 2026 con il
proprietario ([discussione](reports/revisione-metodo/proposta-2026-11-15.md), storica): il peso di un blocco dipende da ciò che può
rompere, non dal filone a cui appartiene.

## Ruoli

- **Proprietario:** decide, sceglie chi esegue ogni blocco, giudica guardando o giocando, dà il comando di push («pusha»; mai
  prima) e compie le azioni fuori dal repository (account, servizi esposti, credenziali, spese, pubblicazioni: l'agente prepara
  script e istruzioni). Parla italiano, vuole risposte brevi e prompt pronti da incollare in un blocco di codice (in inglese, [sotto](#il-prompt)).
- **Regia** di un filone: non scrive codice di prodotto. Legge il repository, scrive i prompt, rivede le consegne, registra le
  decisioni, propone modello e sforzo. Non tiene lo stato in chat: lo cerca e lo lascia nel repository.
- **Esecutori:** sessioni nuove e usa e getta, una per blocco. Leggono AGENTS.md e il prompt, lavorano, riportano.

**Apertura di una regia.** `git status`, `git log` sui percorsi del filone, poi il riquadro «Ripartenza» in testa al piano e le
righe di decisione che cita. Sono indizi, non prove: se ci sono modifiche altrui non committate o commit più recenti della
Ripartenza, la regia chiede al proprietario chi sta lavorando prima di toccare file o lanciare verifiche.

## Le quattro righe di ogni prompt

```text
Perimetro: <percorsi che il blocco può scrivere>
Protetto: <cosa non deve cambiare> · verifiche: <quelle risultanti dalla tabella delle aree>
Fatto quando: <una frase osservabile>
Passo: diretto | con proposta | a banco
```

- **Perimetro.** È un permesso di scrittura: ciò che non è elencato è vietato. Non dice quanto pesa la modifica: un file dentro
  il perimetro può cambiare il comportamento di ciò che sta fuori.
- **Protetto e verifiche.** La regia legge nella [tabella delle aree](aree-protette.md) le righe del perimetro e delle aree
  interessate dalle dipendenze della modifica; il prompt porta all'esecutore le protezioni e le verifiche risultanti. Il diff dei
  percorsi prova solo che certi file non sono cambiati: vale come prova dove la tabella dichiara dimostrato l'isolamento.
- **Fatto quando.** Il risultato chiesto, osservabile. Le verifiche sono di due specie e servono entrambe: quelle che provano
  questo risultato e quelle che proteggono ciò che c'era.
- **Passo.**
  - **Diretto** (normale): una fase. Le scelte minori le prende l'esecutore e le elenca in chiusura come «scelte prese»; il
    proprietario ne ribalta una con una parola.
  - **Con proposta:** proposta, STOP, decisione, poi attuazione. Solo per ciò che è condiviso o caro da disfare (regolamento,
    protocollo, formato, strumenti comuni, partita viva, dati di un'istanza online) e per le scelte visive da vedere prima di
    costruire. Proposta breve, indicativamente entro 10.000 caratteri: in breve, cosa cambia, scelte prese, al più 5 domande, solo
    quelle la cui risposta cambia il lavoro. Dopo la decisione la proposta non si aggiorna: prevale la riga del registro.
  - **A banco:** lavoro creativo con il proprietario in sessione (storie, mockup, ideazione, avvio di un filone). Nessuno STOP di
    fase e nessun rapporto per fase; restano i quattro STOP. Commit a ogni risultato coerente approvato, righe di decisione quando
    servono, una nota di chiusura.

## Quattro STOP

Valgono per tutti e in ogni passo. Fermarsi, dire cosa manca, aspettare il proprietario.

1. Serve scrivere fuori dal perimetro, o la modifica tocca qualcosa che il protetto dichiarato non copre.
2. Una verifica del protetto fallisce o non gira.
3. Un rosso nuovo resta non spiegato dopo la diagnosi che serve ad attribuirlo (confronto con il commit di base compreso). Nel
   frattempo non parte il lavoro che ne dipende né una misura costosa.
4. Il budget è finito. Il budget di calcolo di una misura si fissa prima.

## Contratto dell'esecutore

Il prompt rimanda a questo contratto (in inglese, come tutto il prompt: [sotto](#il-prompt)) e poi dice solo ciò che è proprio
del blocco.
Quello che segue vale sempre, salvo che il prompt dica altro in modo esplicito.

**Letture.** AGENTS.md, questo contratto con i quattro STOP, le [insidie](#insidie-degli-strumenti-di-verifica-windows) e solo le
sezioni che il prompt nomina. Non leggere per intero piani, registri, rapporti o roadmap: cercare la sezione che serve.

**Contesto.** Letture indipendenti nella stessa chiamata e per sezione (prima la ricerca, poi solo le righe che servono), non file
interi uno alla volta. A ogni tappa (diagnosi, modifica, verifica) due righe di stato nel rapporto del blocco: dopo una
compattazione si riparte da prompt e rapporto, non dalla memoria. In ambiente Claude la compattazione automatica è fissata a 200K
su ogni macchina (`CLAUDE_CODE_AUTO_COMPACT_WINDOW` in `~/.claude/settings.json`; si controlla con `/context`).

**Preliminare.** Working tree pulito; `git fetch`; main allineato a origin/main (se origin è avanti, rebase seguendo
[l'allineamento fra le macchine](#allineamento-fra-le-macchine), compreso il jar); porte libere. Se il prompt riporta una scelta o
un'approvazione del proprietario non ancora nel repository, registrarla per prima, con le sue parole, in un commit di soli documenti.

**Mai.** Scrivere fuori dal perimetro. Cambiare un atteso, una soglia o un limite per tornare al verde: cambiano solo con la
decisione che lo autorizza, citata nel rapporto. Asset da Internet con diritti incerti. Push. Azioni fuori dal repository.

**Verifiche.** Quelle che il prompt elenca, più le righe «Sempre» della [tabella delle aree](aree-protette.md#sempre). Se durante
il lavoro la modifica entra in un'altra area, le sue verifiche si aggiungono (o è lo STOP 1).

**Verifiche esclusive** (Maven, una misura, `VerifyAll`, tutto ciò che usa le porte di gioco): una alla volta per macchina, e mai
una misura insieme ad altro carico che ne falsi i tempi. Prima di partire si guardano i processi (`java`, `node`); è un controllo
in più, da solo non impedisce due partenze insieme. Con più esecutori sulla stessa macchina la regia assegna il turno;
l'esecutore comunica inizio e fine; se l'assegnazione non è certa, la verifica attende. Non serve il permesso del proprietario
per ogni avvio.

**Rossi.** Un rosso che corrisponde a una voce del [registro dei rossi noti](reports/rossi-noti.md) (verifica, misura, firma del
messaggio) si dichiara «noto, voce Rn» senza riprovarlo sulla base. Un rosso nuovo si prova sul commit di base prima di attribuirlo;
se è preesistente si aggiunge al registro, se il blocco ne chiude uno lo si toglie. Nessun rilancio automatico per far tornare il verde.

**Mutazioni.** Solo sulla logica nuova con rami (condizioni, ordini, stati, tempi): di norma 3–8 per blocco, ognuna deve far fallire
almeno un test. Non su costanti, misure o stile, che coprono le verifiche e le catture.

**Evidenze in git.** Riepiloghi dei giri e JSON finali minificati, poche catture scelte e ricompresse: indicativamente al più 3 MB
per fase. Tutto il resto resta in `%TEMP%`, citato per percorso.

**Rapporto.** Nel file del blocco, breve (indicativamente entro 15.000 caratteri; il dettaglio nei JSON di evidenza): esito in
testa, cosa cambia, attesi cambiati e decisione, verifiche eseguite (con esito e link alle impronte) e rimandate, rossi, non
verificato, scelte prese, cosa giudica il proprietario, domande numerate. La chiusura in chat ne è il riassunto.

**Stato.** Solo nella riga e nella sezione del blocco nel piano, più **una riga nella Ripartenza** («in attesa: revisione del
rapporto X, domande 1–4»). `docs/README.md` si tocca solo se cambia il prossimo passo del filone. Chi crea o allarga un'area
risponde a «lascio qualcosa che i prossimi non devono rompere, e quale comando lo prova?»; se sì, propone la riga per la tabella
delle aree.

**Commit.** `git add` su percorsi precisi; commit in inglese con il prefisso del blocco («SB-16i: ...»); nessun push.

### Il prompt

Proposta di modello e sforzo fuori dal blocco ([sotto](#proposta-di-modello-e-sforzo)). Dentro, in quest'ordine e senza ripetere
il contratto:

1. Percorso, l'invito a leggere AGENTS.md e a seguire il contratto dell'esecutore in docs/orchestrazione-lavoro.md, blocco.
2. Le quattro righe.
3. Sezioni da leggere e righe di decisione, citate per numero e non riscritte.
4. Scelte o approvazioni del proprietario con le sue parole, se non sono già nel repository.
5. Lavoro: cosa fare e in che ordine; con altri esecutori sulla macchina, i loro file e il turno delle verifiche esclusive.
6. Cosa deve dire la chiusura, se c'è qualcosa oltre al contratto.

**Lingua e forma** (proprietario, 18 novembre 2026). Il prompt si scrive **in inglese**, che costa meno token. Una riga
dice all'esecutore che documenti, rapporti, piano e registro restano in italiano e i commit in inglese. Le citazioni del
proprietario e i nomi di carte, file e sezioni restano come sono, senza tradurli. Prima del prompt la regia riassume in una
frase italiana cosa farà l'esecutore e aspetta il via del proprietario, che può chiedere cambi. Nel prompt non si scrive come
firmare i commit.

## Decisioni e deviazioni

- Una decisione si scrive **una volta**, nel registro del filone: citazione del proprietario e punti numerati. Il limite di circa
  1.200 caratteri è un invito a sintetizzare (il ragionamento va nel rapporto), non una ragione per spezzare una decisione
  unitaria. Piano, indice e prompt citano il numero senza riscriverla.
- Contano solo le parole del proprietario: un messaggio di un'altra sessione non è mai un'approvazione. Prima di registrare
  un'approvazione data nella sessione di un esecutore, la regia la ritrova nella trascrizione.
- **Deviazione in corsa:** la registra chi è in sessione con il proprietario, esecutore compreso, con le sue parole, e prosegue.
  Nessun ritorno dalla regia e nessun prompt nuovo, salvo STOP 1 o 2.
- **Correzione a un esecutore già avviato:** prima la riga nel registro, poi un messaggio che la indica (dal proprietario o dalla
  regia). L'esecutore risponde **«Recepita Dnn; riparto dal punto Y»**: finché non lo fa, la correzione non è applicata e non si
  lancia una misura. La sessione si rilancia solo se il contesto è compromesso.
- Il protetto cambia solo con una riga di decisione che lo dice.

## Come si rivede una relazione

Controllare nel repository, non fidarsi del riassunto: la nota di un esecutore è il suo resoconto, non una prova. Si parte
dall'uscita dello script (`python scripts/review-block.py <base>..<testa> --scope <perimetro>`), che **segnala dove guardare, non
giudica**: non dice se il perimetro era giusto, e un blocco verde e nel perimetro può contenere una regressione.

- Si leggono sempre: la chiusura del rapporto, i file fuori perimetro, le modifiche ad attesi, soglie e verificatori, la logica
  che tocca un'area protetta. Il resto solo se dubbio.
- Sono rossi della revisione, anche con tutto verde: un atteso o una soglia cambiati per tornare al verde; un verificatore
  corretto senza spiegazione o che non controlla più la stessa cosa; un link rotto nuovo rispetto al commit di base; un rosso
  fuori dal [registro](reports/rossi-noti.md) non provato sul commit di base.
- Le verifiche dichiarate sono quelle della tabella delle aree per ciò che il diff tocca davvero; i percorsi del commit sono solo
  quelli del blocco; evidenze e stato stanno dove dice il contratto.
- Per il client, i [punti di revisione](verifiche-client.md#punti-di-revisione) propri.

Dopo la revisione, al proprietario l'esito in breve: tre righe bastano per un blocco diretto, verde e nel perimetro.

## Parallelo e coordinamento

- Due blocchi girano insieme se sono separati **sia i file scritti sia gli input che devono restare fermi** durante misure e
  verifiche dell'altro (codice misurato, dati, strumenti usati). La regia dichiara nei due prompt i file dell'altro e le dipendenze
  che contano; non si censisce ogni lettura.
- Sullo stesso checkout: `git add` sui propri percorsi; le chiusure sui documenti comuni (piano, registro, indice, tabella delle
  aree) una alla volta, dopo `git diff`, ognuno sulla propria riga; verifiche esclusive a turno (contratto).
- Una sola fonte per lo stato di un blocco: la sua riga e la sua sezione nel piano. La regia non crea altre tabelle di stato.
- Un blocco che entra nell'area di un altro filone ha i paletti nel prompt: file dell'altro filone esclusi, strumenti di verifica
  pushati prima del blocco che li usa altrove, jar rifatto dopo il pull.
- Strumenti condivisi danneggiati: li ripristina una sola sessione, di norma la regia, e avvisa le altre prima e dopo.

### Sessioni avviate dalla regia

Alternativa al prompt da incollare, se l'ambiente lo permette e il proprietario è d'accordo. Il brief è il prompt; il
proprietario risponde nella sessione dell'esecutore o tramite la regia; gli esecutori possono scriversi per coordinarsi su file e
processi, non per decidere. Le sessioni vivono sulla macchina della regia che le avvia.

**Prima del push di uno stato che un'altra macchina riceverà:** la regia rivede tutti i blocchi, controlla che working tree e
`.tools` siano puliti, rilancia sullo stato committato le verifiche «Sempre» (e la matrice completa del client solo se il piano
lo prevede) e aggiorna [l'allineamento fra le macchine](#allineamento-fra-le-macchine).

## Proposta di modello e sforzo

Chi esegue lo decide il proprietario, secondo l'usage che gli resta. Il prompt è unico; la regia lo accompagna con una proposta
per entrambi gli ambienti, scritta **fuori** dal blocco del prompt:

```text
Claude: Opus, sforzo alto · GPT: Sol, sforzo alto
Motivo: geometria con regole di non regressione, un'attesa allentata passerebbe inosservata.
```

GPT6.1-Terra vale più o meno Sonnet e GPT6.1-Sol più o meno Opus, entrambi un po' peggio (giudizio del proprietario).

- **Opus o Sol:** aree protette con isolamento non dimostrato, regole di non regressione, giudizio visivo che cambia l'identità,
  diagnosi di rossi non banali, consolidamento: tutto ciò in cui un'attesa allentata passerebbe inosservata.
- **Sonnet o Terra:** perimetro stretto e un test che sa fallire, integrazione di materiale già scelto, lavoro meccanico. Dove la
  riuscita è delicata, in ambiente GPT proporre Sol o uno sforzo più alto.
- **Sforzo:** medio solo per documentazione e conversioni meccaniche, altrimenti alto.
- Se un blocco si può fare in un solo ambiente (per esempio serve generare immagini), dirlo al posto dell'altra proposta.

## Avvio di un filone

Una sessione a banco con il proprietario, che produce:

- un **piano corto**, indicativamente entro 10.000 caratteri: obiettivo, criterio di chiusura, dipendenze, aree toccate, i primi
  due o tre blocchi in dettaglio, gli altri come titoli di una riga. Il dettaglio di un blocco si scrive quando è il prossimo;
- in testa al piano il riquadro **«Ripartenza»**, indicativamente entro 1.500 caratteri: in vigore, in attesa, prossimo, righe di
  decisione da leggere (solo quelle che servono al prossimo passo, non l'elenco di tutte quelle in vigore). Lo aggiorna chi
  chiude un blocco e la regia a ogni decisione; sostituisce il prompt di consegna fra regie;
- la riga in «Filoni attivi» dell'[indice](README.md#filoni-attivi);
- una riga nella tabella delle aree solo se il filone apre un'area nuova.

Convenzioni per i filoni nuovi (quelli in corso restano come sono): piano `docs/<sigla>-plan.md`; decisioni in una tabella in
fondo al piano, spostata in `docs/<sigla>-decisioni.md` quando appesantisce; rapporti `docs/reports/<sigla>/<blocco>.md`; commit
«<SIGLA>-n: ...».

## Igiene dei documenti

- Una **decisione che ne supera un'altra** aggiorna la colonna «Stato» del registro nello stesso commit; le decisioni nuove si
  aggiungono in fondo al registro, non al piano.
- Le **righe della tabella dei blocchi** di un piano riportano solo stato breve e link; le cronologie vanno nei rapporti o nello
  storico del filone.
- Le **regole di lavoro proprie di un filone** stanno in un solo documento, con versione e fonte (per il playground:
  [regole-playground.md](design/set-base/regole-playground.md)).
- I rapporti documentano ciò che era vero alla loro data e non si riscrivono. Tutti i limiti di lunghezza sono inviti a
  sintetizzare.

## Insidie degli strumenti di verifica (Windows)

Valgono per tutti. Quelle delle verifiche del client sono in [verifiche-client.md](verifiche-client.md#insidie-windows) e si
leggono solo quando servono.

- Nel tool Bash gli heredoc con apostrofi si rompono senza che nulla parta: scrivere file e script con lo strumento di scrittura.
- Il contesto Spring completo (`TestServerContext`) è una verifica separata dai test unitari: non confonderli.
- **Niente worktree con collegamenti a `.tools` o `node_modules`:** l'8 novembre 2026 un `git worktree remove --force` ha seguito
  il collegamento e cancellato Maven e parte di Node 24. Per una build pulita usare una copia esportata (`git archive`) con i
  propri strumenti, oppure il checkout. Se `.tools` è danneggiato: `python scripts/bootstrap.py` (reinstalla solo ciò che manca,
  con le impronte di `scripts/toolchain.json`); Node 24 del client si riestrae dallo zip in `.tools/client-c0`, verificato con
  `SHASUMS256.txt`. Lo ripristina una sola sessione.
- Non fermare processi altrui.

## Allineamento fra le macchine

Il lavoro procede su più macchine, ognuna con uno o più filoni ([dove gira ciascuno](README.md#filoni-attivi)). Ogni macchina
committa solo i propri blocchi; il proprietario fa il push. Questa sezione è il punto unico per ciò che una macchina deve fare
dopo aver ricevuto il lavoro di un'altra.

**Dopo ogni pull, prima di lavorare:**

1. `git log --oneline ORIG_HEAD..HEAD` e la tabella «Filoni attivi»: cosa è arrivato.
2. Se sono cambiati server, catalogo, regolamento o documento del set, **rifare il jar** prima di qualsiasi verifica del client:
   `git diff --stat ORIG_HEAD HEAD -- server docs/game-rules.md docs/sets` non vuoto → `./scripts/build.ps1 -Task Server -Offline`.
3. `python scripts/check-rules.py` verde.
4. Se sono cambiati strumenti di verifica, leggere la sezione per le altre macchine del rapporto che li ha cambiati prima di usarli.
5. Conflitti tipici al pull: le righe di stato dell'indice e le righe aggiunte alla tabella delle aree. Si tengono entrambe: ogni
   filone aggiorna solo la propria. Due prescrizioni diverse sulla stessa protezione si risolvono con il proprietario.

**Consegne aperte fra filoni.** Chi chiude una consegna la toglie da qui nel commit che la chiude.

1. **Dal Set Base al client: `Verify` sulla bozza** (proposta di SB-8, non decisa). Oggi lo strumento confronta le carte con
   l'allegato del catalogo vivo e si ferma alla prima carta della bozza; SB-8 l'ha provato da una copia fuori dal repository
   ([diff](reports/set-base/sb-8/verify-bozza.diff)). Un'opzione che scelga il riferimento è un cambiamento a
   `client-web/tools/verify.mjs`, da valutare dentro un blocco che tocca lo strumento.
2. **Dal Set Base al client: `restOn` robusto** ([D103](set-base-decisioni.md#decisioni-del-proprietario) (1), rosso noto
   [R6](reports/rossi-noti.md#aperte)). In `client-web/tools/verify-resolution.mjs` `restOn` chiede il riquadro del pulsante (i)
   senza controllare che ci sia ancora: nella corsa voluta col clic su ✓ può essere già sparito, ed è un esito della corsa, non un
   errore. Blocco piccolo che tocca lo strumento, con le verifiche dell'area «Client web»; si lancia quando il proprietario lo
   decide (la prova umana breve della 1.6b che lo precedeva è fatta, D104); chiude R6.
