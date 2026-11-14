# SB-16g — Bot consapevole del colpo letale (D76)

13 novembre 2026. Base `14d67d6`. Attua il punto 1 di **D76**, prima del passo 2 della 2b. Vale solo con le regole `d50`
(profilo `bozza` e runner): il gioco vivo 1.13 non cambia, banco SB-7 identico byte per byte (sotto).
Nessuna carta cambiata, nessun livello di difficoltà (Q2 fuori perimetro). **STOP dopo il rapporto.** Nessun push.

## Cosa fa il bot

Un involucro nuovo, `LethalAwarePolicy`, sta intorno a qualsiasi stile: i tre euristici, il casuale e il computer della bozza.
Prima che lo stile scelga, restringe le mosse legali. Poi lo stile sceglie fra quelle rimaste come ha sempre fatto.
Il computer della bozza diventa `LethalAwarePolicy(SoughtHitPolicy(ALWAYS, stile))`: l'archivio lo registra con questo nome
e l'identità della bozza aggiunge `lethalAware: true`. L'involucro non estrae numeri dal generatore e, con le regole vive,
passa la mano allo stile senza toccare nulla.

1. **Difesa.** È un «colpo mostrato» una carta scoperta dalla ricerca nella mano di un avversario vivo, che bersaglia un avversario,
   fa danno e che il suo padrone può pagare ora con le risorse visibili (regole di D50 punto 2 e D73 sulla HEALTH).
   Il bot lo suppone diretto a sé. Per ogni sua mossa legale prevede il turno con quella mossa e quel colpo, e classifica la mossa:
   **salvo** se resta in piedi in ogni variante, **incerto** se solo in alcune, **a terra** se in nessuna.
   Se le classi non sono tutte uguali, tiene solo le mosse della classe migliore: parata, contromossa, cura, oppure un colpo
   che arriva in un gruppo di velocità precedente e porta a terra l'autore (D50 punto 1).
   Se nessuna mossa salva e ce n'è una incerta, tiene le incerte.
2. **Attacco.** Fra le mosse rimaste, tiene quelle che portano **sicuramente** a terra un avversario che non ci finirebbe comunque,
   purché il bot resti salvo quanto la mossa migliore. «Sicuramente» vuol dire in ogni variante del turno: col colpo mostrato
   e anche senza mossa nota dell'avversario. Così conta l'ordine dei gruppi quando è noto: un colpo letale che arriverebbe
   dopo quello mostrato, già letale per il bot, viene annullato e non vale. Se il bot cade comunque, sceglie la patta
   (colpo letale nello stesso gruppo) invece della sconfitta.
3. **Altrove** il comportamento resta quello di oggi: senza colpo mostrato e senza colpo sicuramente letale le mosse offerte allo
   stile sono le stesse e nello stesso ordine. Lo verificano un test sulle regole vive e la regressione SB-7.

Nessuna pianificazione oltre il turno in corso. Nessuna lettura di mano coperta, mazzo, ordine del mazzo o mosse pendenti.
Il bot non indovina una difesa scelta in segreto: un colpo «sicuramente letale» lo è rispetto a ciò che il bot può vedere.

### La previsione del turno

`TurnForecast` gioca su copie della vista la mossa del bot e, al più, il colpo mostrato. Segue le regole `d50` come le applica il
motore: costi prima di tutto; gruppi per priorità e ALERTNESS dopo i costi; autore a terra a inizio gruppo annullato, salvo su sé o
con «Ultimo colpo». Gli stati si applicano in ordine con lo stesso troncamento del motore, compresi gettoni, parate,
equipaggiamenti che moltiplicano o convertono il tipo di danno e il quirk di `invertViewPoint`. Seguono la corazza L/4 sul solo HIT,
il pavimento a zero, la ricerca dopo la mossa (gettone e risorse piene solo se trova, D71–D72), le contromosse e le immunità.
A fine turno conta il POISON periodico della TOXICITY, gettoni compresi.

Per leggere le carte come le legge un giocatore, le carte espongono il proprio testo come numeri (`PrintedEffects`): le carte a dati
della bozza, cinque carte Java della bozza (rare di Piera e Beppe, «Fai basta», «Riflessi», «C'è del sangue nella mia droga») e il
«Mescolone Micidiale». La vista del bot riceve anche, per ogni stato, il tipo di danno, il moltiplicatore e la conversione,
cioè quanto scritto sulla carta («Hit Damage taken: x0.6»). Sono testo pubblico: nessuna informazione nascosta in più.
La parte variabile «x» si calcola dalle risorse visibili, per esempio la L di Piera o gli oggetti di Beppe sul campo.

**Stima incerta.** Dove l'informazione pubblica non decide, la previsione gioca tutte le varianti:
- ordine dentro lo stesso gruppo di velocità, deciso dal posto al tavolo;
- ricerca propria trovata o fallita, e ricerca dell'avversario trovata o fallita;
- per una carta che non sa descriversi, come una carta Java del gioco vivo, il danno nominale e il nominale con +10 se scrive «x».

Una carta che non sa descriversi non è mai «sicuramente» letale. Nella bozza tutte le carte che fanno danno, parano o contrastano
sanno descriversi (test `everyDraftCardIsReadable`).

## Test

**Scenari espliciti** (`LethalAwarePolicyTest`, 16 casi su carte vere della bozza). Ogni caso dichiara i numeri che lo decidono.
Dove la scelta si riduce a una carta, la provano tutti e quattro gli stili, con cinque semi ciascuno.

| Caso | Numeri | Esito |
|---|---|---|
| Parata | HIT 40 mostrato, pagabile (V 30), salute 35 | solo «Tra due paraurti» (40×0,4) |
| Colpo non pagabile | stesso colpo con V 20 | nessuna restrizione |
| Gettone proprio | salute 50: 40 non letale; col gettone ×1,5 è 60 | invariato / parata |
| Corazza propria | L 40 assorbe 10: 30 contro 35 e contro 30 | invariato / parata |
| Colpire per primo | «Sgommata» (priorità 1) porta a terra l'autore (25) prima del colpo da 40 (priorità 0) | solo «Sgommata» |
| Contromossa | «Fai basta» (priorità 2) annulla il colpo da 40 | solo «Fai basta» |
| Cura, ordine incerto | «Fasciatura» nello stesso gruppo del colpo: dopo salva (0→8, D48), prima no | tenuta come incerta contro cadute sicure; salva se l'autore è più veloce |
| «x» ignota | carta non descritta «HIT 20+x» (20–30) contro salute 25 / 35 | parata / invariato |
| Ricerca incerta | «Slalom» prima del colpo: se trova, gettone e 60 contro 50 | il caricamento esce dalle scelte |
| Attacco col gettone avversario | «Sgommata» 25 contro 30; col gettone 37 | invariato / solo «Sgommata», tutti gli stili |
| Corazza avversaria | 40 − L 20/4 = 35 contro 35 / 36 | solo il colpo / invariato |
| Ordine noto | colpo letale proprio a priorità 0, colpo letale mostrato a priorità 1 | parata, non il colpo che verrebbe annullato |
| Patta | stesso gruppo, entrambi letali, nessuna difesa | il colpo: patta invece di sconfitta |
| Uccisione incerta | «HIT 20+x» non descritta contro salute 25 | nessuna restrizione |
| Regole vive | il caso della parata con 1.13 | stesse mosse, nessuna restrizione |
| Carte leggibili | tutte le carte della bozza con danno, parata o contromossa | descritte dai numeri stampati |

**Fedeltà al motore** (`TurnForecastFidelityTest`). In 300 partite reali `d50` della bozza, con incontri e stili misti, ogni turno
viene riprevisto con le due mosse davvero giocate, quella dell'avversario trattata come mostrata. La salute di entrambi a fine turno
deve essere una delle varianti previste: **6.542 turni su 6.542**. Restano fuori 80 turni con timer sul tavolo, perché i timer
non sono stampati come numeri. Al primo giro i turni concordi erano 1.230 su 1.246. Gli scarti hanno portato a correggere quattro
letture: ricerca avversaria, immunità del «Mescolone», conversione HIT→CUT della «Bottiglia rotta» e immunità tolta dal «Sangue».

**Mutazioni** ([esecutore](sb-16g-bot-letale/mutations.py), [esiti](sb-16g-bot-letale/mutations.json)). Sei alterazioni della
previsione: corazza, annullamento a terra, ricerca, restrizione, stati, veleno periodico. Ognuna fa fallire almeno un test;
il sorgente è stato ripristinato.

Attesi cambiati deliberatamente, per D76: `BozzaDraftTest` (computer `LethalAwarePolicy` intorno a `SoughtHitPolicy`, identità
`lethalAware`) e `scripts/cli-draft-complete-test.cjs` (nome in archivio
`LethalAwarePolicy(SoughtHitPolicy(ALWAYS,ResourceAwarePolicy))`). Due costruttori di prova di `SoughtHitPolicyTest` hanno i campi
nuovi della vista. Nessuna soglia o criterio allentato.

## Misura di confronto (fuori budget D68)

Non è un giro di bilanciamento: non conta nel budget D68, che resta **2 giri e 7.078,042 s**. Tempo dichiarato, tetto 15 minuti:
sonda da 9.600 partite in 4,88 s, misura in **72,55 s**, sua ripetizione col contatore delle decisioni in 74,37 s.
In tutto **151,80 s**. La ripetizione ha dato una matrice identica byte per byte alla prima: il contatore non altera le partite.

Bot nuovo contro bot del passo 1, sulla bozza attuale (SHA-256 `c4c767c1…acab5a9`, invariata dal passo 1). Stili aggressivo,
prudente, risorse e com (`RandomPolicy`), tutti con la politica ALWAYS del computer della bozza. Otto stili, 15 incontri compresi
gli specchi, 64 coppie, **300 semi per cella, gli stessi del passo 1 (7.000.000–7.000.299)**, posti alternati, 8 thread:
**288.000 partite**. Invarianti 0, bound entro il tetto. I semi sono riusati tra celle: gli intervalli sono descrittivi.

[Sintesi](sb-16g-bot-letale/summary.json), [matrice](sb-16g-bot-letale/matrix.json), [lettura](sb-16g-bot-letale/matrix.md),
[osservazioni per personaggio e accoppiamento](sb-16g-bot-letale/observations.json).

**Quanto vince il nuovo**, quota delle partite decisive contro il bot del passo 1:

| Confronto | Vittorie nuovo | Vittorie vecchio | Quota del nuovo |
|---|---:|---:|---:|
| Tutti gli incroci (144.000 partite) | 70.792 | 63.689 | **52,64%** |
| Aggressivo contro aggressivo | 4.124 | 4.020 | 50,64% |
| Prudente contro prudente | 3.824 | 3.787 | 50,24% |
| Risorse contro risorse | 4.260 | 4.030 | 51,39% |
| Com contro com | 5.109 | 3.449 | **59,70%** |
| Tre euristici, stesso stile | 12.208 | 11.837 | 50,77% |

A parità di stile il guadagno degli euristici è piccolo: intorno a mezzo punto, entro l'incertezza per prudente e aggressivo.
Il guadagno del casuale è grande. Gli incroci fra stili diversi misurano soprattutto lo stile e restano nella sintesi.
Per mazzo del bot nuovo: Celestina 59,88%, Mara 57,24%, Spazienzio 51,62%, Beppe 48,79%, Piera 45,71%.

**Perché il guadagno è piccolo.** Su 3.416.715 decisioni dei bot nuovi, la restrizione scatta in 156.557 (4,6%). La scelta cambia
rispetto al bot del passo 1, sullo stesso generatore copiato, in 23.589 (0,69%). Un colpo avversario scoperto c'è in 121.615
decisioni (3,6%): lì la restrizione scatta nel 12,9% e la scelta cambia nel 3,4%. Le altre restrizioni sono uccisioni sicure,
che gli stili euristici in gran parte sceglievano già. Il casuale invece no. I casi del proprietario sono rari, ma ora sono gestiti.

**Patte**, coi soli bot nuovi e coi soli bot del passo 1:

| Accoppiamento | Patte |
|---|---:|
| Nuovo contro nuovo (72.000) | **6,37%** |
| Passo 1 contro passo 1 (72.000) | 7,00% |
| Misto (144.000) | 6,61% |

Specchi ancora sopra il 10% di D51 coi bot nuovi: Celestina 18,19% (passo 1: 19,48%) e Piera 14,10% (14,56%).
Calano anche Piera–Beppe, da 9,23% a 7,27%, e Beppe–Beppe, da 9,52% a 8,48%. Turni medi: 11,82 contro 12,00.

**Costo del gettone per ricerca riuscita**, danno avversario subito col gettone attivo e la sola parte dovuta all'amplificazione,
con le definizioni del rapporto del passo 1:

| Personaggio | Danno per trovata, nuovo vs nuovo | Amplificazione | Passo 1 vs passo 1 | Amplificazione |
|---|---:|---:|---:|---:|
| Spazienzio | 19,04 | 6,21 | 18,84 | 6,14 |
| Mara | 16,67 | 5,30 | 16,35 | 5,20 |
| Celestina | 13,98 | 4,49 | 13,82 | 4,44 |
| Piera | 10,98 | 3,72 | 10,98 | 3,72 |
| Beppe | 14,63 | 4,64 | 14,42 | 4,57 |
| Tutti | 15,03 | 4,91 | 14,90 | 4,86 |

Il costo cresce di poco, 0,0–0,3 danni per trovata, perché l'attacco sul gettone scatta solo quando è letale. Fuori da lì gli
stili colpivano già il bersaglio esposto (passo 1). La lettura del passo 1, cioè che 4,4–6,7 danni in più per ricerca siano un
minimo contro chi non punisce, resta: punire il gettone in modo letale non lo alza in media. Il gettone resta un rischio di fine
partita, non un costo medio grande.

## Verifiche

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | server 774 test, 0 falliti/errori, 13 saltati (gli opt-in di misura); client-debug 37/37 |
| Contesto Spring (`-Task TestServerContext`) | 891 test, 0 falliti/errori, 13 saltati, in 459 s; `BozzaCliTest` verde; R3 non comparso. Le righe `MATCH_ARCHIVE_WRITE_FAILED` vengono dai test che rompono l'archivio apposta |
| Regressione viva SB-7 1.13 | 480.000 partite, 240 celle; JSON e Markdown identici byte per byte fra `14d67d6` e questa consegna ([evidenza](sb-16g-bot-letale/live-identity.json)) |
| Partita reale `-Bozza` contro il computer | 3 partite, archivio con `LethalAwarePolicy(SoughtHitPolicy(ALWAYS,PrudentPolicy))` e `lethalAware: true`; vedi [Partita reale](#partita-reale) |
| check-rules / check-links / manifest / diff | verde; 301 file, 0 collegamenti rotti; `allChecks` PASS; `git diff --check` pulito |

`client-web/` non è toccato: ci lavora in parallelo un altro esecutore e il suo stato non è verificato da questa consegna.

## Comandi riproducibili

Maven da `server/`, con il JDK di `.tools`, come nel passo 1:

```powershell
$env:JAVA_HOME = 'E:/bm/.tools/zulu11.84.17-ca-jdk11.0.29-win_x64'
$env:Path = "$env:JAVA_HOME/bin;$env:Path"
$mvn = 'E:/bm/.tools/apache-maven-3.6.3/bin/mvn.cmd'
$common = @('-s','E:/bm/scripts/maven-settings.xml','-Dmaven.repo.local=E:/bm/.tools/m2','-B','-o')
& $mvn @common -q test '-Dtest=LethalBotMeasureTest#newAgainstStepOne' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.threads=8' '-Dsim.lethalGames=300' `
  '-Dsim.lethalOut=E:/bm/tmp/sb16g-d76/round'
& $mvn @common -q test '-Dtest=LethalAwarePolicyTest,TurnForecastFidelityTest'
```

**Banco del passo 1 per i passi 2 e 3.** D76 vuole le misure dei passi 2 e 3 coi bot nuovi. `ChargeMeasureTest#measure` ora avvolge
ogni politica in `LethalAwarePolicy`; `-Dsim.bots=passo1` riproduce il giro del passo 1 col comando del suo rapporto.

Regressione viva, fuori budget. La base `14d67d6` è esportata con `git archive` in `$env:TEMP/bm-d76-base`. Il fixture è il JSON
della bozza di `14d67d6`, in `$env:TEMP/bm-d76-live/base-draft.json`, fuori da entrambe le radici. Sulla base:

```powershell
& $mvn @common -q test '-Dtest=BenchMeasureTest#matrix' '-Dsim.rules=1.13' "-Dsim.draft=$env:TEMP/bm-d76-live/base-draft.json" `
  '-Dsim.threads=8' '-Dsim.bench=2000' '-Dsim.styles=aggressivo,prudente,risorse,com'
```

Sul codice nuovo:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#liveBenchOnTheSameHistoricalDraft' '-Dsim.rules=1.13' "-Dsim.liveReference=$env:TEMP/bm-d76-live"
```

Dalla radice:

```powershell
./scripts/build.ps1 -Task Test -Offline
./scripts/build.ps1 -Task TestServerContext -Offline
./scripts/build.ps1 -Task Server -Offline
node docs/reports/set-base/sb-16g-bot-letale/partita.cjs E:/bm E:/bm/tmp/sb16g-d76/partita 3
python scripts/check-rules.py
python scripts/check-links.py
python scripts/verify-match-manifests.py
git diff --check
```

## Partita reale

La porta 8080 e il jar di `server/target` erano occupati da un server `-Bozza` che questa sessione non ha avviato e non ha
fermato. Ho quindi impacchettato una copia dei sorgenti, identica a quella della consegna, insieme a `docs/`, fuori dal repository
in `$env:TEMP/bm-d76-pkg`. Ho avviato quel jar con gli stessi argomenti di `dev.ps1 -Bozza`, sulla porta 8081 e con un SQLite
temporaneo. Lo script supporta le due modalità:

```powershell
$env:BM_SERVER_DIR = "$env:TEMP/bm-d76-pkg/server"; $env:BM_PORT = '8081'
node docs/reports/set-base/sb-16g-bot-letale/partita.cjs E:/bm $env:TEMP/bm-d76-partita 3
```

Le partite usano `-Pool starter-spazienzio -Com starter-mara -Bot prudente`, con l'umano `devAlice` attraverso `scripts/bm-cli.cjs`,
in modalità `quick/1vCom`. L'umano mostra apposta GARGANTUESCO IMPATTO SUL TU (25 V: 40 HIT, priorità 0) e lo tiene finché il
computer non ha 40 di salute o meno. Il registro turno per turno è [partite.json](sb-16g-bot-letale/partita/partite.json); gli export
dell'archivio sono [1](sb-16g-bot-letale/partita/export-1.json), [2](sb-16g-bot-letale/partita/export-2.json) e
[3](sb-16g-bot-letale/partita/export-3.json), con integrità verificata e registrazione completa. Tutti e tre registrano
`botPolicy` `LethalAwarePolicy(SoughtHitPolicy(ALWAYS,PrudentPolicy))` e `lethalAware: true`.

| Partita | Turni | Esito | Colpo mostrato e letale per il computer |
|---|---|---|---|
| 1 | 10 | vince il computer (20 contro 0) | mostrato dal turno 2, mai pagabile quando il computer era a 40 o meno (V da 0 a 10): non è una minaccia, e il computer gioca come prima |
| 2 | 16 | vince l'umano (21 contro 0) | mai mostrato; l'umano chiude al turno 15 col 40 HIT giocato dalla mano coperta, che il bot non può vedere |
| 3 | 5 | vince il computer (20 contro 0) | turno 4, vedi sotto |

**Partita 3, turno 4.** Computer a 20 di salute e 15 A; umano a 13 di salute e 25 V, con il colpo da 40 HIT mostrato e pagabile,
quindi letale. Il computer ha in mano Preso al volo, Passo stretto, Cambio marcia, Steal, Sorpasso in curva e Sputo da posacenere.
Nessuna di queste para o cura, e solo Sputo (5 A: 12 POISON, priorità 1) arriva prima del colpo. Se l'umano gioca il colpo, il suo
gettone aggiunge POISON ricevuto ×1,5: 18 ≥ 13. Il computer gioca Sputo, l'umano va a terra e il motore annulla il colpo con «a
terra». È il punto 1 di D76, colpo d'anticipo, insieme al punto 2, gettone dell'avversario sfruttato. Dal solo export non si
ricostruisce cosa avrebbe scelto il bot del passo 1: il confronto sulla stessa situazione resta negli scenari di
`LethalAwarePolicyTest`.

Tre partite sono una prova di funzionamento, non una misura.

## Non verificato e domande numerate

Nessuna prova umana in questa consegna. Nessuna misura FFA: la previsione e gli scenari valgono anche a più giocatori, perché il
colpo mostrato si suppone diretto al bot, ma il banco è a due. Il bot non tiene conto di colpi che l'avversario può avere in mano
coperta: non può vederli. Q2, i livelli di forza, resta fuori perimetro.

1. Il guadagno contro il bot del passo 1 è piccolo per gli stili euristici e grande per il casuale. Basta per procedere al passo 2,
   o preferisci prima una breve prova umana contro il computer della bozza, per giudicare se ora «si para» e «sfrutta lo status»
   come chiedevi?
2. Quando cade comunque, il bot sceglie la patta, cioè il colpo letale nello stesso gruppo, invece della sconfitta. Va bene?
3. Il bot evita anche le mosse che lo esporrebbero da sé, per esempio un caricamento che, se trova, renderebbe letale il colpo
   mostrato. Va bene, o deve riguardare solo parata, contromossa, cura e colpo d'anticipo?
4. Un colpo che l'avversario potrebbe avere in mano coperta non conta, anche se l'ha appena cercato e poi scartato la copia
   scoperta. Va bene così finché non arrivano i livelli di forza (Q2)?
5. Per i passi 2 e 3, `ChargeMeasureTest` usa ora i bot nuovi in tutte e tre le politiche del gettone. Confermi?

## Risposte del proprietario

14 novembre 2026, registrate in [D77](../../set-base-plan.md#decisioni-del-proprietario): «1 niente prova, andiamo avanti / 2 si /
3 si, è giocare bene / 4 si / 5 si». Nessuna prova umana prima del passo 2; patta preferita alla sconfitta; mosse che espongono il
bot evitate da sé; colpi in mano coperta esclusi fino a Q2; bot nuovi in tutte e tre le politiche per i passi 2 e 3.
