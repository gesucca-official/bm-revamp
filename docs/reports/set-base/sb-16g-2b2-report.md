# SB-16g — 2b, passo 2: frequenza (D79)

14 novembre 2026. Base `caad64c`; attuazione della proposta 1.3 nel playground.
Contratto d50 1.1: aggiunta la sola parola «Annuncia», comportamento 1.0 invariato.
Dieci caricamenti, cinque nuovi titoli NC, liste approvate e 120 slot (45 C / 55 NC / 20 R).
Unico anticipo numerico: PAZIENZA +15→+25 V; danni, costi ed effetti dei colpi invariati.

## Piano di misura fissato prima del giro

Passo 0 fuori budget: **4 semi per cella, 8.640 partite**, bot nuovi in tutte le
tre politiche, quattro stili, 15 incontri compresi gli specchi, posti alternati.
Stesso banco e osservatore del giro. Stima conservativa: tempo misurato ×75×1,5
più 120 s di margine. Si procede soltanto se questa stima sta nei **7.078,0417661 s**
residui D68. Non si usano i risultati del campione per ritoccare le carte.

Giro prefissato: **300 semi per cella, 648.000 partite**, 2.160 celle,
semi 7.000.000–7.000.299 condivisi fra politiche come nel passo 1, otto thread.
Nessun braccio con composizione precedente. Consuma un giro e il tempo misurato;
nessun secondo giro o taratura dopo la misura. Confronto descrittivo col passo 1:
le differenze comprendono anche i bot D76–D77, e su Spazienzio il premio +25 V.

## Attuazione, attesi e perimetro

Bozza e griglia contengono i dieci annunci della 1.3, compresi binding e ID nuovi;
Preparo cerca Chiave, Una stretta cerca Lavoro. Le risorse piene e ridotte sono
alternative dopo la ricerca. Nessuna classe nuova: le cinque carte usano lo stesso
`DataCards` e gli stessi parametri `search` dei caricamenti del passo 1.

Il bot e la previsione sono già generici sugli effetti stampati: nessuna modifica
alle classi vive. I test delle dieci carte controllano lettura pubblica, entrambi
gli esiti contro il motore, finanziamento da zero e le tre politiche avvolte nel
bot letale. Nessuna mano coperta, ordine del mazzo o mossa pendente passa ai bot;
soltanto il banco diagnostico distingue bersaglio già in mano e consumato.

**Attesi cambiati con D79:** `SetBaseDraftTest` verifica le nuove liste degli
avanzati, rarità e numero di carte (76 carte + 5 personaggi; 37 C/33 NC/6 R fra le
carte caricate), sei slot d'archetipo per personaggio e dieci nomi gridati di
Spazienzio; `StarterRedesignTest` passa da Lavoro 6 HIT a Chiave 12 CUT come ricerca
di Preparo e da V=55 a V=65 dopo PAZIENZA nel suo scenario da V=40.
Il test del cambiamento storico del passo 1 confronta ora il suo snapshot salvato;
il nuovo test D79 verifica che i colpi abbiano cambiato soltanto rarità e che le
carte estranee alle dieci coppie siano identiche.

Le quattro sonde storiche del listino in `SetBaseDraftTest` e la sonda di priorità
in `StarterBalanceMeasureTest` usano lo snapshot del passo 1. I loro slot fissi
richiedono due copie di Spintone/Rincorsa/Fasciatura/Mattone, che D79 riduce o
rimuove: il primo lancio mirato ha segnalato quattro errori «starter-mara non ha
due copie di base.com.Spintone». Attesi e algoritmo del listino restano uguali;
queste sonde verificano i contesti storici, mentre formato, invarianti e bound
sono verificati sulla bozza nuova. Una nuova misura del listino con questi slot
fissi non è stata eseguita e richiederà contesti nuovi.

Nessuna nuova logica di gioco o dei bot con rami: modifiche a dati, test e misure.
Per il contratto dell'esecutore («Non su costanti, misure o CSS») non si muta
l'osservatore e non si ripetono mutazioni delle regole già coperte nei passi
precedenti. Nessuna mutazione di classi vive o dati per simulare un'attuazione del
passo 3. Soglie, criteri e attesi non autorizzati invariati.

Working tree pulito alla partenza; fetch riuscito, main allineato a origin/main.
Durante il blocco sono comparsi cambiamenti dell'altra sessione in `prototipi/carriere`:
non letti, modificati o inclusi nel commit. Regolamento, docs/sets, catalogo, classi
vive, client e client-debug invariati. Nessun push.

## Definizioni delle misure

`ChargeMeasureTest` conserva le misure del passo 1 e aggiunge i contatori per titolo
di `ChargeFrequency`: copie viste nella mano (anche finale), turni in mano non scelti,
caricamenti scelti/risolti/non eseguiti e ricerche riuscite/fallite. Il banco distingue
una ricerca fallita col colpo già in mano da una senza copie in mano o mazzo;
nei cinque starter tutte le destinazioni esistono inizialmente, quindi il secondo
caso indica copie consumate. Il bot non riceve queste informazioni.

La precisa copia trovata è seguita fino a giocata, scarto o mano finale. «Primo
turno legale» è la prima decisione successiva in cui quella carta compare nelle
mosse legali; tenuta e impagabilità hanno denominatori propri. Una giocata annullata
conta come giocata della copia; una parata conta quando una riduzione INPUT non
equip riduce il tipo di danno ricevuto, anche se resta danno positivo. I gettoni
seguono invece il nome, quindi può soddisfarli un'altra copia. Il banco riconcilia
copie trovate e gettoni creati con tutti i rispettivi esiti, anche a fine partita.

Premi pieni/ripieghi sono sommati per risorsa ed esito. `foundNext-*` e `missNext-*`
sono le risorse effettive dopo il fine turno della ricerca, anche terminale;
`nextResource-*` osserva soltanto i successivi turni decisionali della copia trovata.
`spentElsewhere-*` somma i costi di altre mosse mentre la copia è trattenuta (per
finestra; una stessa spesa può appartenere a due finestre). Dopo un ripiego col
colpo già in mano si contano al successivo turno legale e scelta di quel nome:
descrive l'utilità possibile, senza attribuzione causale esclusiva al ripiego.

Annunci per partita: ricerche effettivamente eseguite, riuscite o fallite, per
presenza dello starter (entrambi i posti negli specchi). Distribuzione 0/1/2/3+;
le scelte annullate stanno fra i non eseguiti. Durata del gettone inclusiva del
turno di creazione, con soddisfazione, uscita D71 e chiusura finale separate.
Il danno avversario totale e aggiuntivo per ricerca riuscita conserva il calcolo
puro del passo 1, prima del limite della salute; nuove separazioni per tipo,
POISON diretto/periodico e autodanno. Nessuna partita viene rigiocata per stimare
l'amplificazione. Venti tracce con e senza osservatore sono identiche.

Un turno da metà salute conserva la definizione del passo 1: perdita netta fra
inizio e fine almeno metà HEALTH iniziale, includendo costi/autodanno/periodici e
sottraendo cure. L'altra misura richiede la fine partita nello stesso turno.
I semi sono condivisi: gli aggregati sono descrittivi, non osservazioni indipendenti.

## Verifiche

`./scripts/build.ps1 -Task Test -Offline`: **779 test server, 0 falliti/errori,
13 saltati**; client-debug **37/37**. Non confuso con il contesto Spring.
`TurnForecastFidelityTest`: **6.440/6.440 turni**, 76 esclusi per timer non stampati.
`check-rules.py`, `check-links.py` (305 file, 0 rotti con le evidenze),
manifesti e `git diff --check` verdi.

`./scripts/build.ps1 -Task TestServerContext -Offline`: **896 test, 0 falliti/errori, 13 saltati**. Contesto Spring e test CLI completi verdi; R3 non comparso. [Esiti raccolti](sb-16g-2b2/verification.json).

Regressione viva 1.13: **480.000 partite per build**, 240 celle; JSON **266.868 B**
e Markdown **26.111 B** identici byte per byte su base `caad64c` e finale,
con il medesimo fixture storico del passo 1 ([impronte](sb-16g-2b2/live-identity.json)).
Nessun campo normalizzato/escluso. Le 20 prove di `SetBaseDraftTest` sulla base
sono verdi (0 falliti/errori); i quattro errori iniziali del listino non erano
preesistenti, derivavano dalle sostituzioni D79 e sono stati trattati esplicitamente
con i contesti storici, senza allentare gli attesi.

Passo 0: **8.640 partite in 22,7261808 s**, fuori budget, conteggi/invarianti/bound
verdi. Stima prefissata **2.676,69534 s**, inferiore a 7.078,0417661 s:
giro concluso, senza altre partite d50 ([fattibilità](sb-16g-2b2/feasibility.json)).

## Rossi

Nessun rosso tecnico aperto; R1/R2/R4 non eseguiti perché verifiche client-web fuori perimetro, R3 non comparso. I quattro errori iniziali delle sonde storiche sono trattati sopra; l’export in TEMP è stato sostituito dopo la sonda di diagnosi descritta nei comandi. Restano **rossi di bilanciamento D16/D51**, dettagliati sotto; nessuna soglia cambiata.

## Unico giro, risultati e residuo D68

**648.000 partite in 738,001141 s**, 2.160 celle, 43.200 partite per incontro;
otto invarianti a **zero su 15.155.192 turni di giocatore**, nessun limite di durata,
quindici bound entro 4. Conteggi di copie trovate e gettoni riconciliati senza resti.
Budget consumato dal passo 2: **1 giro / 738,001141 s**. Residuo:
**1 giro / 6.340,0406251 s** (6.340,041 s arrotondati), come nel [registro](sb-16g-2b2/budget.json).
Il campione di fattibilità non consuma D68. Nessun giro aggiuntivo, nessuna taratura.

Bozza letta SHA-256 dei byte `b4322f7bb014af097b6b954ed73cdb686240e78d589debcb0049e899ee70412b`;
le cinque liste coincidono titolo per titolo con la proposta 1.3
([convalida riproducibile](sb-16g-2b2/validation.json)).
L'impronta è dei byte CRLF letti sul laptop; lo stesso sorgente normalizzato LF
da Git ha SHA-256 `abd7aa4c712c18a64f3e5995f9002fad11292220eda64412e7557f1ae75963d8`.
Lo snapshot JSON minificato ha SHA-256
`c105e1e7185985c841be6b48d785b4b6ab5f9f2ee093a54cca8c9d63610b0009`:
la serializzazione cambia l'impronta, non i dati della bozza.
Evidenze: [matrice completa](sb-16g-2b2/matrix.json), [banco](sb-16g-2b2/matrix.md),
[contatori per starter/stile/politica](sb-16g-2b2/observations.json),
[snapshot](sb-16g-2b2/draft.json), [aggregazione estesa](sb-16g-2b2/summary.md),
[aggregazione JSON](sb-16g-2b2/summary.json).

## Incontri (tre politiche e quattro stili aggregati)

Quote sulle decisive; patte su tutte le partite. Δ rispetto al passo 1 in punti percentuali. Gli specchi non hanno una quota obiettivo fra etichette A/B.

| Incontro | Quota A | Δ quota | Patte | Δ patte | Turni | Δ turni | P10–P90 | Fuori soglia |
|---|---:|---:|---:|---:|---:|---:|---|---|
| Spazienzio–Spazienzio | 50.74% | -1.38 | 2.63% | -0.55 | 8.48 | -1.40 | 4–13 | — |
| Spazienzio–Mara | 73.67% | +25.63 | 2.70% | -0.39 | 8.95 | -0.36 | 5–14 | quota |
| Spazienzio–Celestina | 61.41% | +22.99 | 5.19% | +0.45 | 10.97 | -0.72 | 5–17 | quota |
| Spazienzio–Piera | 67.77% | +25.26 | 2.45% | -1.62 | 10.92 | -1.87 | 6–16 | quota |
| Spazienzio–Beppe | 73.86% | +26.52 | 3.11% | -0.67 | 9.40 | -1.01 | 5–14 | quota |
| Mara–Mara | 50.98% | +1.73 | 3.35% | -0.04 | 9.54 | +0.72 | 6–14 | — |
| Mara–Celestina | 42.14% | -9.98 | 4.73% | -1.26 | 11.59 | +0.70 | 7–16 | — |
| Mara–Piera | 61.36% | -6.34 | 5.73% | -0.12 | 11.50 | -0.11 | 8–15 | quota |
| Mara–Beppe | 53.67% | -4.44 | 3.05% | +0.78 | 10.13 | +0.60 | 7–13 | — |
| Celestina–Celestina | 50.40% | +2.96 | 18.32% | -1.00 | 18.68 | +0.41 | 11–23 | patte, durata |
| Celestina–Piera | 73.23% | -1.17 | 7.65% | +0.94 | 13.63 | -0.31 | 9–17 | quota, durata |
| Celestina–Beppe | 62.98% | -2.69 | 9.47% | +1.41 | 12.56 | +0.23 | 9–16 | quota, durata |
| Piera–Piera | 51.09% | -1.15 | 8.55% | -5.83 | 14.61 | -0.91 | 11–17 | durata |
| Piera–Beppe | 43.86% | -7.46 | 7.60% | -1.24 | 12.87 | -0.53 | 10–15 | durata |
| Beppe–Beppe | 51.23% | -0.61 | 15.67% | +6.11 | 11.57 | +0.32 | 10–13 | patte |

## Frequenza per starter

Un annuncio è una ricerca effettivamente eseguita, riuscita o fallita. Denominatore: presenze dello starter in partita, inclusi entrambi i posti negli specchi.

| Starter | Presenze | Annunci/partita | 0 | 1 | 2 | 3+ | Riuscite | Fallite | Trovati giocati / tenuti a fine / scartati |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Spazienzio | 259200 | 0.862 | 38.43% | 40.08% | 18.37% | 3.12% | 160619 | 62724 (28.08%) | 129263 / 30419 / 937 |
| Mara | 259200 | 0.596 | 57.90% | 26.84% | 13.00% | 2.26% | 100953 | 53553 (34.66%) | 86658 / 12852 / 1443 |
| Celestina | 259200 | 0.497 | 66.01% | 20.87% | 10.59% | 2.54% | 73154 | 55557 (43.16%) | 61035 / 8759 / 3360 |
| Piera | 259200 | 1.089 | 45.45% | 19.24% | 16.27% | 19.04% | 158743 | 123502 (43.76%) | 139186 / 17310 / 2247 |
| Beppe | 259200 | 0.345 | 78.73% | 10.33% | 8.68% | 2.26% | 51045 | 38291 (42.86%) | 43907 / 4653 / 2485 |


**Criteri D16/D51 non raggiunti:** 11 incontri su 15 fuori da almeno una soglia;
97 celle incontro × coppia di politiche su 135 fuori, elencate nell'aggregazione estesa.
Spazienzio è fuori quota contro tutti gli altri: 73,67% contro Mara (soglia 45–55%),
61,41% contro Celestina, 67,77% contro Piera, 73,86% contro Beppe (40–60%).
Altri fuori quota: Mara–Piera, Celestina–Piera e Celestina–Beppe.
Specchi Celestina **18,32%** e Beppe **15,67%** sopra il 10% di patte;
Piera rientra aggregata all'**8,55%** (14,38% nel passo 1), ma alcune coppie di
politiche restano fuori. Cinque incontri oltre 12 turni, Celestina–Celestina 18,68.
La media globale **6,680% patte / 11,694 turni** non sana queste celle.

**Frequenza:** aumenta rispetto al passo 1 per Spazienzio (0,615→0,862), Mara
(0,227→0,596), Celestina (0,376→0,497), Piera (0,773→1,089); Beppe scende
0,396→0,345. La distribuzione mostra che «una o due» non è un risultato uniforme:
Beppe ha zero annunci nel 78,73% delle partite, Celestina nel 66,01%, Mara nel 57,90%.
Le rare e i titoli NC sono distinti nei contatori per titolo dell'aggregazione.
Ricerche riuscite (quindi nuovi gettoni) per presenza dello starter:
**0,620 / 0,389 / 0,282 / 0,612 / 0,197**, nello stesso ordine.
L'effetto non è attribuibile alle sole copie: sono cambiati bot, destinazione di
Preparo e finanziamento di PAZIENZA. Nessun braccio storico con bot nuovi aggiunto.

Annunci per partita per stile, aggregando soltanto le tre politiche:

| Starter | aggressivo | prudente | risorse | com |
|---|---:|---:|---:|---:|
| Spazienzio | 1.065 | 0.029 | 1.433 | 0.920 |
| Mara | 0.123 | 0.061 | 1.108 | 1.092 |
| Celestina | 0.190 | 0.000 | 0.508 | 1.288 |
| Piera | 0.353 | 0.067 | 2.554 | 1.382 |
| Beppe | 0.000 | 0.000 | 0.001 | 1.378 |

`com` conserva il sottostante `RandomPolicy` avvolto come nel banco del passo 1;
le altre tre colonne sono gli euristici. Tutte sono avvolte nel filtro letale D76.
Questa matrice non sostituisce una prova umana o un nuovo confronto del computer
del client. Beppe quasi non annuncia con gli euristici: segnale da valutare insieme
al valore delle sue carte nel passo 3, non motivo per forzare mosse o leggere il mazzo.

**Uso, rischio e ripiego:** danno avversario / ricerca riuscita (extra fra parentesi)
Spazienzio **10,017 (3,259)**, Mara **17,946 (5,797)**, Celestina **15,902 (5,127)**,
Piera **13,510 (4,660)**, Beppe **16,718 (5,387)**. Confronto extra passo 1:
6,69 / 5,77 / 5,19 / 4,44 / 5,27; non è un confronto causale delle sole carte.
Durate inclusive medie dei gettoni 2,244 / 2,192 / 2,391 / 2,413 / 2,282 turni.
Uscite D71: 49 Celestina e 12 Piera; le altre finestre si chiudono col nome giocato
o fine partita. Tutti i totali e i tipi di danno, compresi periodici/autodanno,
sono nell'aggregazione estesa.

I contatori storici `soughtHitChosenWithToken`/`tokenHeldTurns` distinguono soltanto
una scelta fra i dieci colpi con almeno un gettone presente; non provano che quel
nome soddisfi il gettone. Soddisfazioni e durate per nome del passo 2 usano i nuovi
contatori per titolo, riconciliati con i gettoni, non questi indicatori storici.

Ripiego con colpo già in mano: al turno successivo Slalom ha il colpo legale in
4.976/7.892 casi osservati e lo sceglie in 2.290; Ti stringo 4.237/4.273 e 1.047;
Preparo 6.118/6.118 e 1.409; Una stretta 5.186/5.186 e 725. Sono osservazioni,
non una prova che sia il solo ripiego a pagare il colpo. Le 26.779 occasioni
impagabili della copia trovata da Prima il brindisi mostrano il limite della L che
decade o viene spesa, pur col finanziamento da zero del primo turno utile verificato.

Politiche: ALWAYS batte HOLD_IF_DEFENDED al **50,22%**, RANDOM al **51,51%**;
HOLD_IF_DEFENDED batte RANDOM al **51,29%**, su 144.000 partite per confronto.
Nel passo 1 erano 50,227%, 51,408%, 51,189%: nessuna dominanza ampia fra le tre;
non dimostra l'interesse umano della scelta. Gli IC95 per cella restano nei dati.

Carte poco usate: in particolare Steal con Mara/Celestina sotto il 10% delle
partite in cui appare; Una stretta di prova di Beppe 13,26%, Preparo 17,92%,
travaso di Celestina 17,87%. Non si dichiara verde il criterio qualitativo delle
carte quasi mai giocate. Mazzi esauriti per starter: 7,02 / 12,04 / 44,18 / 49,59 /
48,04%. Partite con un turno da metà salute **19,60%** (16,857% nel passo 1),
finite in quel turno **2,34%** (1,400%); con Spazienzio presente 56,79% / 6,39%.

## STOP e proposta per il passo 3

**STOP sui numeri e sul budget dopo questo commit.** Il giro residuo non è usato.
Preparare una proposta separata di potenza e funzionamenti, prima dell'attuazione:
le formule della 1.2 non vanno applicate in blocco senza riguardare il vantaggio
di Spazienzio e i finali da metà salute. Priorità ai rari intermedi deboli e al
valore dei caricamenti di Beppe, poi gli specchi Celestina/Beppe; liste D79 ferme.
La rarità non giustifica da sola un aumento identico per tutti.

Per D67 resta candidata «Il bancone regge, io pure»: aggiungere POISON ×0,5 solo
nel turno, incluso il periodico, conservando HIT ×0,5 e +5 L; CUT pieno. Funzionamento
da approvare. Celestina–Piera resta al 73,23%, quindi la valutazione ha ancora una
motivazione; non corregge gli specchi Celestina/Beppe e può allungare le partite.

Proposta di disegno del prossimo giro, da prefissare dopo l'approvazione delle
carte: due bracci nello **stesso ultimo giro**, potenza senza / con estensione
POISON, confronto con questa matrice come riferimento e stessi semi/bot. Nuovo
passo 0 sui bracci effettivi entro il residuo **6.340,041 s**; nessun giro gratuito
per singola carta, nessun rilancio se non tornano i criteri. Non avviato qui.

## Non verificato e domande numerate

Non eseguiti: passo 3, misura di bilanciamento FFA, taratura dopo il giro, Playwright, suite client-web,
avvio manuale del client/server con la bozza o nuova prova umana (D77 esclude il
cancello preliminare contro il bot). Nessun trasferimento vivo; non si dichiara
il bilanciamento chiuso. Listino a slot fissi sulla bozza nuova non compatibile,
come spiegato sopra; le sue sonde sono storiche. La prova umana finale prima di
SB-17 resta dopo la sequenza, non viene sostituita dai numeri.

1. Confermi di passare alla proposta separata del passo 3 con queste priorità
   (vantaggio di Spazienzio, scarso uso di Beppe, rari intermedi e specchi), lasciando
   fisse le liste e il giro residuo fino all'approvazione dei funzionamenti?
2. Per il giro finale va bene il confronto prefissato potenza senza/con Bancone
   POISON, nello stesso giro, con questa misura come riferimento e nuovo passo 0?

## Comandi riproducibili

Python già presente, senza download: Python 3.13.0 in
`$env:TEMP/bm-sb16g-proposta-python-3.13.0/python.exe`; aggiunto solo al PATH del
processo. Trovati anche i Python di LibreOffice (3.8.10) e GIMP (2.7.18), non usati.
Output intermedi e log estesi in `C:/_simone/claude/bm-revamp-on-laptop/tmp/sb16g2b2`.

Dalla radice, prefisso comune e controlli economici:

```powershell
$root = (Get-Location).Path
$env:Path = "$env:TEMP/bm-sb16g-proposta-python-3.13.0;$env:Path"
$env:PYTHONIOENCODING = 'utf-8'
$env:JAVA_HOME = "$root/.tools/zulu11.84.17-ca-jdk11.0.29-win_x64"
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$mvn = "$root/.tools/apache-maven-3.6.3/bin/mvn.cmd"
$common = @('-s',"$root/scripts/maven-settings.xml","-Dmaven.repo.local=$root/.tools/m2",'-B','-o')
./scripts/build.ps1 -Task Test -Offline
./scripts/build.ps1 -Task TestServerContext -Offline
python scripts/check-rules.py
python scripts/check-links.py
python scripts/verify-match-manifests.py
python docs/reports/set-base/sb-16g-2b2/validate.py
git diff --check
```

Da `server/`, **passo 0 fuori budget**, poi verifica della stima prima del giro:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.chargeGames=4' `
  '-Dsim.chargeOut=../tmp/sb16g2b2/feasibility'
$sample = [double](Get-Content ../tmp/sb16g2b2/feasibility/seconds.txt)
if ($sample * 75 * 1.5 + 120 -ge 7078.0417661) { throw 'STOP: non fattibile' }
```

**Unico giro autorizzato**; comando riportato per riproduzione, non da rilanciare
nel budget di questa consegna:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.chargeGames=300' `
  '-Dsim.chargeOut=../tmp/sb16g2b2/round-1'
```

Senza `-Dsim.bots=passo1`: i bot nuovi avvolgono tutte e tre le politiche.
Da radice, aggregazione di soli file già prodotti, senza partite:

```powershell
python docs/reports/set-base/sb-16g-2b2/summarize.py `
  tmp/sb16g2b2/round-1 docs/reports/set-base/sb-16g-2b2
```

Confronto vivo fuori budget: `git archive caad64c` esportato in
`$root/tmp/sb16g2b2/base-local`, con server, docs e scripts, senza worktree o link.
Stesso fixture del passo 1, estratto da `d701089`, fuori da entrambe le radici:
`$env:TEMP/bm-sb16g2b2-live/base-draft.json`, SHA-256
`faf265fad50ee0bedca125209f7008434a73660131f786ad272800235567d7c5`.
Maven e JDK completi del checkout, senza copiare o modificare `.tools`.
Nella copia esportata: prima `-Dtest=SetBaseDraftTest` per verificare sulla base
il rosso delle vecchie sonde, poi il comando sotto; rinominare gli output
`final-live.json/.md` in `base-live.json/.md`. Ripeterlo dal checkout corrente:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft' `
  '-Dsim.rules=1.13' "-Dsim.liveReference=$env:TEMP/bm-sb16g2b2-live"
Get-FileHash "$env:TEMP/bm-sb16g2b2-live/*-live.json"
Get-FileHash "$env:TEMP/bm-sb16g2b2-live/*-live.md"
```

Il banco vivo è identico al passo 1: 2.000 semi per cella, quattro stili,
240 celle/480.000 partite per build. Nessuna normalizzazione o esclusione di
campi nel confronto dei byte.

Il primo export in `$env:TEMP/bm-sb16g2b2-base` ha dato errori di compilazione
dei test («package com.gsc.bm.model does not exist»), prima di qualsiasi partita.
Diagnostica, non rilancio per tornare al verde: le classi esistono e `javap` le
legge; una sonda `class Probe { com.gsc.bm.model.Resource resource; }` fallisce
con quel classpath e compila copiando gli stessi `Resource.class`/`Statistic.class`
nel workspace. Anche il compilatore separato (`-Dmaven.compiler.fork=true`)
mostra la stessa firma nel TEMP. La causa di ambiente non è indagata oltre;
il confronto usa quindi un nuovo export dello stesso archivio Git nel workspace,
senza modificare sorgenti, strumenti, fixture o attesi. Log `base-unit.log`,
`base-debug.log`, `base-unit-fork.log`, `base-unit-local.log` nella cartella di lavoro.
