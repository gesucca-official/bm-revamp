# Preparazione alla pubblicazione su GitHub

Il monorepo conserva la base approvata I22 e la cronologia successiva.
La pubblicazione del codice è distinta dall'hosting del gioco. Le configurazioni
Heroku e il client Phaser rimangono riferimenti storici, non una procedura di deploy.

## Identità e destinazione

Prima di creare commit controllare l'identità effettiva:

```powershell
git config --show-origin --get-regexp 'user\.'
git var GIT_AUTHOR_IDENT
git var GIT_COMMITTER_IDENT
git remote -v
```

Per questa preparazione il proprietario ha confermato
`simone <simone.cipriani.it@gmail.com>`; nome ed email sono fissati nella
configurazione locale del repository, non in quella globale. Un clone non eredita
questa impostazione. L'identità dei commit e l'account che autentica il push sono
distinti: controllare entrambi prima della prima pubblicazione.

Il repository GitHub e la visibilità vanno scelti dal proprietario. Collegare
il remote e inviare il ramo `main` soltanto alla destinazione autorizzata.
Conservare i commit esistenti: la revisione indicata nel manifest I22 deve
rimanere disponibile. Non appiattire o riscrivere la cronologia per pubblicare.

## Contenuti e prove

Controllare `git status --short`, `git diff --check` e l'elenco `git ls-files`.
Le esclusioni coprono dati applicativi, `.match-recovery`, cache, evidenze,
archivi Git precedenti e configurazioni private. Un file già tracciato non
viene escluso retroattivamente: verificare anche il contenuto e la cronologia.
Il catalogo SQLite di gioco, il wrapper Maven e i PDF di stampa sono intenzionali.

Eseguire le [verifiche locali](setup.md). Il workflow GitHub ripete bootstrap,
installazione, build, test ordinari, controllo regole, contesto completo e audit
dei manifest su Windows. La prima esecuzione su GitHub resta da verificare.

Il controllo `i22-candidate.py --verify --snapshot` richiede artefatti ed evidenze
originali esclusi da Git. Un clone pubblico non li contiene. Report e manifest
versionati conservano l'approvazione storica; la pulizia successiva non ridefinisce
il candidato approvato. Archiviare separatamente `.repository-history` e le
prove locali, senza inviarle al repository pubblico.

I diritti restano riservati: [condizioni attuali](../CONTRIBUTING.md).
L'eventuale scelta di una licenza diversa richiede una decisione del proprietario.

## Verifiche della preparazione — 26 ottobre 2026

Documentazione corrente ripulita, procedure precedenti conservate nello storico,
collegamenti locali convertiti in relativi e controllati anche per maiuscole.
Esclusioni Git verificate; catalogo e PDF rimangono versionati. Il workflow è
stato controllato con il parser YAML già presente nel progetto. I diritti
preesistenti, il regolamento e i record di approvazione I22 restano invariati.

La prima esecuzione completa ha rilevato un timeout CLI in
`LifecycleCliTest`, scenario `com-exact`: la risposta alla prima richiesta di
vista poteva precedere la registrazione della sottoscrizione. La CLI ora
ritenta la lettura una sola volta entro il timeout originale, come già faceva
per `resume`. Nessuna azione di gioco viene ripetuta e nessun atteso applicativo
è stato modificato. Quattro nuovi test verificano risposta immediata, risposta
persa, timeout persistente e disconnessione; il caso della risposta persa
fallisce contro la CLI precedente.

Verifiche finali locali:

- `build.ps1 -Task Test -Offline`: 249 server e 32 client, tutti PASS.
- `check-rules.py`: PASS, 39 carte più token e catalogo integro.
- `build.ps1 -Task TestServerContext -Offline`: 356 PASS, nessun errore o skip.
- `verify-match-manifests.py`: tutti i controlli PASS.
- `git diff --check`, collegamenti e struttura YAML: PASS.
- Scansione delle revisioni raggiungibili: nessuna corrispondenza alle firme
  cercate di chiavi private, token GitHub, access key AWS o credenziali negli URL.

Log locali in `.build-logs/publish-{test-final,context-final,manifests-final}.log`;
il primo esito fallito rimane in `publish-context.log`. Prima di rigenerare le
prove sono stati copiati artefatti ed evidenze I22 in
`.build-logs/publish-i22-preserved/`, con percorsi relativi originali, manifest e
approvazione. Tutti gli hash della copia sono stati verificati contro il manifest
originale. Questa cartella rimane esclusa da Git e va conservata separatamente.

Nessun remote configurato né push eseguito durante la preparazione.
