# I22 — Candidato della versione base e monorepo

26 ottobre 2026. **Candidato verificato; approvazione del proprietario pendente.**
L'incremento comprende la regressione finale e la preparazione di un unico Git
in `E:/bm`. Nessuna nuova regola, funzionalità futura o operazione di deploy.

## Prerequisiti e conservazione

Verificati AGENTS.md, regolamento 1.6, decisioni aggiornate e stato reale di I26,
I12–I17, I19a/b/c, I14/I23 e I24. Il contesto Spring separato comprende i runner
CLI di questi incrementi, oltre agli unit e alle integrazioni mirate.

Su scelta esplicita del proprietario le due directory `.git` originarie sono
state spostate in `.repository-history/bm-server.git` e `bm-web-client.git`.
Conservati refs, oggetti, reflog, configurazioni, indici e stato delle modifiche;
nessun reset o checkout dei sorgenti. L'archivio contiene anche `before.json`,
gli stati Git e le patch binarie. Un confronto SHA-256 ha verificato identità di
tutti i 205 file server e 139 file client presenti prima della conversione e di
tutti i 52 file dei metadati Git. Successivamente è stata corretta la sola fixture
`ArchiveLifecycleCliTest`, salvandone prima la copia integrale: 343 file restano
identici e l'unica modifica intenzionale è tracciata con hash prima/dopo in
`.build-logs/i22-preservation.json`. Le cancellazioni preesistenti restano tali.
Anche `git fsck --full` sulle due cronologie archiviate è passato.

La radice comprende server, client, CLI, scripts, documenti, idee, generatore di
stampa e PDF/manifest già prodotti. Cache, dipendenze, prodotti compilati,
evidenze, dati applicativi, anteprime temporanee e cronologie archiviate sono
esclusi dal nuovo Git; restano sul disco. Nessun gitlink o submodule.
Nessun remote configurato; nessuna pubblicazione. [Guida principale](../../README.md).

## Verifiche e candidato

L'identificativo definitivo viene registrato nel manifest
[`i22-candidate.json`](i22-candidate.json): revisione sorgente del monorepo,
due revisioni storiche, SHA-256 di tutti i file versionati (tranne il manifest
stesso), artefatti, regole, catalogo, configurazioni, toolchain ed evidenze.
La revisione sorgente precede il commit che aggiunge il solo manifest, evitando
un riferimento circolare. `python scripts/i22-candidate.py --verify` controlla
file mancanti, modificati e nuovi file non esclusi da Git.

La copia pulita in `.build-logs/i22-clean-source` è stata estratta dall'indice
monorepo con `git checkout-index --all --prefix=<cartella>/`; nessun prodotto
`target` o `dist` è stato copiato. Sono condivisi solo strumenti/cache `.tools`
e le dipendenze installate `node_modules` mediante junction. Build Server e
Client offline riuscite. Archivi della toolchain verificati contro i checksum
fissati; ambiente/cache in `.build-logs/i22-toolchain.json`.
`python scripts/i22-candidate.py --compare-clean` confronta tutti gli input
server/client/configurazione e le classi/risorse/dipendenze dei due JAR, controlla
le copie normative incluse e l'assenza dell'hook di test nel pacchetto.

Il client nella cartella isolata produce hash Angular `c5a839e1d4c7d226be94`,
diverso dal build principale a parità di input: non si dichiara riproducibilità
byte-per-byte del bundle fra percorsi differenti. Il manifest distingue i due
build e conserva gli hash esatti degli artefatti principali da esaminare.
Le evidenze locali escluse da Git devono essere conservate separatamente se si
trasferisce il candidato; il clone contiene sorgenti, report e manifest, mentre
JAR/dist/cache/database ed evidenze non vengono pubblicati.

### Risultati finali

| Comando / verifica | Risultato |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | 249 server + 28 client PASS |
| `python scripts/check-rules.py` | PASS, 39 carte più token, catalogo/copia client coerenti |
| `./scripts/build.ps1 -Task TestServerContext -Offline` | 356 PASS, zero failure/error/skipped; comprende anche gli unit |
| `build.ps1 -Task Server/Client -Offline` | Build principali e da copia pulita PASS |
| `python scripts/smoke-server.py` | JAR avviato due volte, HTTP 200, account sintetico persistito |
| `python scripts/verify-match-manifests.py` | 7 conclusioni combat/563 eventi, 12 cicli I19b/169 eventi e 12 attivi I24/36 eventi: PASS |
| `python scripts/i22-candidate.py --compare-clean` | 348 input identici e 187 entry applicative JAR identiche; nessuna entry interna differente |

Log finali in `.build-logs/i22-{test,context,rules,server-build,client-build,smoke,manifests}.log`;
confronto in `i22-clean-compare.json`. I due JAR differiscono nel contenitore ZIP,
mentre tutte le entry interne hanno gli stessi byte. Nessuna classe di test o
hook di interruzione nel pacchetto; regolamento, allegato e catalogo inclusi
coincidono con i sorgenti. L'esecuzione fallita iniziale resta separata dalle
prove accettate. Nessun difetto tecnico bloccante aperto nel perimetro della base.

Copertura correlata ai prerequisiti: test carte/motore/catalogo e isolamento;
repository/migrazioni e ownership mazzi; identità, sessione unica e autorizzazioni
REST/STOMP; CLI I26 e partite complete quick/open contro bot, 1v1 e FFA;
clock/forfait/reconnect e duplicati/concorrenza; guasti di scrittura, journal,
finalizzazione unica e JVM di restart pulito/crash/interruzione. Nessun caso
critico escluso dalla suite completa. Le prove UX restano separate, come sotto.

## Difetto di ripetibilità riprodotto e corretto

La prima suite completa ha eseguito 356 test con 12 errori, tutti nelle fixture
I19b: `VACUUM INTO application.sqlite` falliva perché il file di evidenza della
precedente esecuzione esisteva già. Nessuna asserzione di gioco fallita; log
originale in `.build-logs/i22-context-first-failed.log`.

Lo snapshot viene ora scritto come `<gameId>.sqlite` nella stessa cartella di
scenario; il verificatore collega il transcript al file dello stesso ID e ne
registra percorso/hash. Nessuno snapshot precedente cancellato o spostato.
Il controllo I19c non richiede più il vecchio `i19b-manifest.json`: verifica
direttamente tutti i dodici transcript correnti, unicità, sequenze, eventi attesi,
hash, registro ed esatta corrispondenza con SQLite. La matrice resta obbligatoria,
senza fallback a dati vecchi o casi saltati. Lo script di build crea esplicitamente
`.build-logs`, necessaria in una copia pulita.

Due esecuzioni consecutive dei dodici scenari sono passate senza rimuovere alcun
file (log `i22-repeat-1.log` e `i22-repeat-2.log`), seguite dal confronto manifest
riuscito. Le copie originali dei file corretti sono in `.build-logs/i22-before`.
Nessuna modifica al motore, ai contratti runtime o agli attesi delle regole.

## UX e limiti

Le verifiche UX sono separate dalle suite applicative e sono conservate nei
report I13 (partita naturale completa), I15 (editor mazzi), I16 (selezione e
recupero errore), I17a/b (due utenti reali, FFA), I14/I23 (clock, esiti e rientro)
e I24 (restart-draw e ritorno all'hub). I22 non modifica i sorgenti applicativi.
Il client ricompilato produce l'identificativo Angular `380cb14845b778e6084b`,
uguale a quello verificato nella UX finale I24. Nessuna nuova interazione UX
viene dichiarata: il tentativo di avviare il controllo browser in I22 è stato
bloccato dall'errore dell'ambiente `setup refresh had errors` dopo la creazione
del Git principale; i comandi sono proseguiti con l'esecuzione autorizzata.

Limiti da esaminare per l'approvazione: ambiente locale Windows x64 con cache
documentate, stack legacy, avviso bundle client 2,22 MB/2 MB; bot casuale senza
garanzia universale di terminazione e limite normativo dell'umano senza mosse.
Persistenza su un solo processo e filesystem locale, senza certificazione di
perdita/corruzione simultanea di SQLite e journal o di eventi mai durevoli.
Nessuna retention automatica: conservare database e journal insieme.
Email completa, amministrazione, Phaser/client finali, bilanciamento definitivo,
Elo e hosting restano fuori dalla base. I PDF preesistenti sono conservati come
artefatti storici, senza rigenerazione o nuova certificazione editoriale.

## Approvazione

**In attesa del proprietario.** I22 non può essere segnato interamente concluso
prima dell'approvazione esplicita del candidato concreto, con data e limiti
accettati, come richiesto dalla roadmap. L'ordine di eseguire I22 non sostituisce
la successiva approvazione del prodotto verificato.
