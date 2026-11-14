# SB-16h — Varianti della dimensione del mazzo, Fase B

14 novembre 2026. Attuazione della [proposta 0.1](../../design/set-base/sb-16h-proposta.md), approvata in D83;
carte della 1.5, bozza di riferimento D92, braccio B del passo 3: Impatto 34, Chiave 18, Lavoro 14 + 4 per oggetto,
Bancone con POISON ×0,5. Criteri D16/D51 sui soli euristici, secondo D93.

**Esito: nessuna alternativa soddisfa tutti i vincoli D83.** Tutte riducono nettamente i mazzi esauriti. Il 30/3 ha meno incontri fuori D93 (5 su 15, contro 8 del 20/2), ma peggiora Mara–Piera e allunga lo specchio di Celestina. Il 25/3 è il più breve in media, ma peggiora alcune quote. **Fase B consegnata, STOP: formato e prova umana al proprietario; R02 resta 20/2.**

## Perimetro e strumenti

Solo sorgenti e risorse di test del playground, rapporto ed evidenze, riga e sezione SB-16h del piano e riga Set Base dell'indice.
Nessuna modifica a `server/src/main`, regolamento, documento del set, catalogo, bozza di riferimento, client o carriere.
Nessun numero di carta, bot, politica o lista ritoccato dopo il passo 0; nessun rilancio del giro.

- [Cinque risorse](../../../server/src/test/resources/set-base/sb-16h/20-2.json): dimensione, copie massime e liste approvate.
  [Audit leggibile](sb-16h-lists.py): **88 righe × cinque varianti**, tutte le 25 liste corrispondono alle tabelle della proposta.
- [DeckSizeVariants](../../../server/src/test/java/com/gsc/bm/sim/DeckSizeVariants.java) sostituisce solo dimensione, copie e liste nel
  JSON della bozza, poi rilegge con `Draft.parse`. Parti fisse e carte restano identiche al riferimento.
- `ChargeMeasureTest` accetta `sim.deckVariant=20-2|25-2|25-3|30-2|30-3|mixed`. Il banco consente incontri espliciti e alias verso
  bozze convalidate separatamente: nel misto il giocatore a 20 riceve davvero 20 carte, quello a 30 ne riceve 30, senza aggirare la
  convalida della bozza. Le intestazioni del misto dichiarano la fonte di ogni alias, con ordine esplicito delle chiavi uguale alle
  uscite raccolte, verificato anche dal test per evitare ordini diversi fra JVM.
- [DeckSizeObserve](../../../server/src/test/java/com/gsc/bm/sim/DeckSizeObserve.java) aggiunge contatori di sola lettura.
  [DeckSizePhaseTest](../../../server/src/test/java/com/gsc/bm/sim/DeckSizePhaseTest.java) esegue i sei bracci **in sequenza nella stessa
  JVM**, congela le impronte di bozza e liste e le ricontrolla prima del giro; rifiuta uscite già misurate.
- [Test](../../../server/src/test/java/com/gsc/bm/sim/DeckSizeVariantsTest.java): liste valide e annidate 25 ⊂ 30, parti fisse e 20/2
  identiche, raro e tutore singoli, coppie NC 2+2 o 3+3, tracce invariate per ogni variante, contatori e alias. La prova viva passa
  prima un mazzo da 20 a `DeckRules`, poi verifica il rifiuto del 25: `Exactly 20 regular cards required, found 25`.

**Unità delle misure.** La durata è in turni simultanei del gioco. Esaurimento = primo confine di turno con mazzo vuoto, controllato
sia prima delle mosse sia dopo la risoluzione; comprende la pesca che svuota il mazzo nel turno terminale. Il vecchio contatore del
banco osservava solo l'inizio del turno: è conservato intatto per l'identità storica; le tabelle nuove usano il nuovo contatore.
Il turno di esaurimento è condizionato ai mazzi esauriti. Annunci e distribuzione 0/1/2/3+ sono **per starter-partita**; le ricerche
fallite sono rapportate alle ricerche eseguite. Una prima giocata è la prima scelta del titolo, anche se poi annullata, come nelle
misure storiche del banco; media e P10–P90 sono sulle partite in cui è scelto, con quota «mai» separata.

Carte morte = **turni in mano senza scegliere il titolo**, comprese carte pagabili lasciate in mano; un titolo conta una sola volta
per turno anche con più copie. È diverso dalla sola carta non pagabile del vecchio banco. Le tabelle comprendono tutti i titoli;
gli oggetti entrano automaticamente in campo, quindi non hanno turni in mano né scelte manuali. Il contatore non valuta l'utilità
di un titolo come scarto per una bound. Il confronto aggregato delle carte
regolari esclude basic, bound e last resort; i conteggi comprensivi delle parti fisse sono disponibili come controllo nel JSON.
Finale in last resort = turno terminale con **almeno una last resort effettivamente eseguita**, Struggle compreso, da uno dei due
giocatori; il dato «usata in un qualsiasi turno precedente» è distinto.

## Passo 0 e identità

Checkout iniziale pulito, base `1500f04`; fetch eseguito, main due commit avanti e zero indietro rispetto a origin/main. Porte di
gioco libere. `Get-Process java` senza risultati prima del passo 0 e prima del giro; nessun'altra misura o Maven in contemporanea.

Quattro semi per cella, 7.000.000–7.000.003, 12 combinazioni politica/stile, otto thread. Tutte le otto invarianti a zero, bound
entro 4, nessuna partita al limite di 200 turni.

| Braccio | Partite | Secondi del banco | Massimo turni |
|---|---:|---:|---:|
| 20/2 | 8.640 | 23,351 | 24 |
| 25/2 | 8.640 | 9,226 | 26 |
| 25/3 | 8.640 | 7,278 | 23 |
| 30/2 | 8.640 | 7,629 | 28 |
| 30/3 | 8.640 | 9,044 | 30 |
| Misto, 10 incontri | 5.760 | 4,597 | 24 |
| **Totale, fuori budget** | **48.960** | **61,124** | **30** |

Tempo dell'intera fase nella JVM, compresi allestimento e scritture: 63,802 s; orologio Maven: 96,343 s.
**Stima come nel banco precedente:** 61,1244376 × 75 × 1,5 + 120 = **6.996,499 s ≤ 7.200 s**. I 120 s coprono avvio,
orchestrazione e uscite; si mantengono **300 semi per cella**, senza riduzione a 150.
[Fattibilità](sb-16h/feasibility.json), [impronte congelate](sb-16h/freeze.json).

Il cancello è stato eseguito **subito dopo il 20/2**, prima delle altre varianti. Riferimento originale:
`tmp/sb16g15/step0-B`, conservato anche compresso nelle evidenze per poter riprodurre il confronto.

| File | Byte al passo 0 | Identico byte per byte |
|---|---:|---|
| matrix.json | 873.631 | sì |
| matrix.md | 82.336 | sì |
| observations.json | 403.017 | sì |
| draft.json | 35.704 | sì |

[Impronte del cancello](sb-16h/identity.json). Anche i quattro file del **giro intero 20/2** coincidono con il giro della 1.5:
[confronto aggiuntivo](sb-16h/identity-round-20-2.json). Granularità storica: celle e aggregati del banco, non singole tracce di tutte
le partite; le prove unitarie confrontano invece le tracce complete delle partite campione.

## Giro unico e criteri D93

Semi **7.000.000–7.000.299**, condivisi, posti alternati; quattro stili (`aggressivo`, `prudente`, `risorse`, `com`), bot consapevoli
del colpo letale e tre politiche del passo 3, otto thread, sei bracci sequenziali. Le mescolate cambiano con le dimensioni:
confronti descrittivi, senza trattarli come appaiati. Criteri calcolati a precisione intera, prima dell'arrotondamento delle tabelle.

Per variante: 15 incontri × 144 celle × 300 = **648.000 partite**; di queste **364.500** fra due euristici, **40.500** fra due `com`,
**243.000** nelle celle miste. Misto: 10 incontri × 144 × 300 = **432.000 partite**. Totale: **3.672.000 partite**.

| Variante | Fuori D93 | Fuori quota / patte / durata | Esauriti euristici / tutti | Turni medi euristici | com fuori 35–65 | Banco (s) |
|---|---:|---:|---:|---:|---:|---:|
| 20/2 | 8/15 | 7 / 0 / 1 | 15,64% / 16,90% | 9,45 | 4/10 | 631,861 |
| 25/2 | 6/15 | 5 / 1 / 1 | 2,47% / 3,54% | 9,52 | 4/10 | 570,124 |
| 25/3 | 6/15 | 5 / 0 / 1 | 2,11% / 2,23% | 8,55 | 4/10 | 491,135 |
| 30/2 | 6/15 | 5 / 0 / 1 | 0,99% / 1,79% | 10,33 | 6/10 | 552,833 |
| 30/3 | 5/15 | 4 / 0 / 1 | 1,55% / 1,59% | 9,87 | 5/10 | 573,687 |

Quota: 10 incontri non speculari; patte e durata: tutti i 15. Le colonne dei singoli criteri possono sovrapporsi nello stesso incontro. Su tutti i **72.223.546 turni di giocatore** del giro le otto invarianti restano a zero, nessun limite di durata; tutte le 15 bound entro 4 in ciascun braccio.

Controllo diagnostico su **tutti gli stili**, distinto dai criteri D93:

| Variante | Turni | Annunci/starter-partita | Ricerche fallite | Turni regolari non scelti/partita | Finali in last resort |
|---|---:|---:|---:|---:|---:|
| 20/2 | 9,61 | 0,966 | 33,61% | 20,782 | 9,50% |
| 25/2 | 9,77 | 0,791 | 23,83% | 21,611 | 1,62% |
| 25/3 | 8,77 | 0,889 | 14,17% | 18,166 | 1,18% |
| 30/2 | 10,66 | 0,742 | 22,56% | 23,798 | 0,84% |
| 30/3 | 10,05 | 0,873 | 13,03% | 20,883 | 0,96% |

Tutti i 15 incontri per variante, quote sulle decisive, patte e durata dei gruppi euristici, `com` e misti, starter per starter,
turno di esaurimento, annunci con distribuzione, ricerche fallite, prime giocate e stili sono nei [risultati dettagliati](sb-16h/details.md).
Le celle con tutte le combinazioni di stili e politiche restano nei JSON delle matrici; `com` è un controllo, non decide il criterio.

Carte morte e quota di partite in cui ogni titolo viene scelto: [20/2](sb-16h/cards-20-2.md), [25/2](sb-16h/cards-25-2.md),
[25/3](sb-16h/cards-25-3.md), [30/2](sb-16h/cards-30-2.md), [30/3](sb-16h/cards-30-3.md),
[misto, separato per avversario](sb-16h/cards-mixed.md).
Istogrammi completi, gruppi e misure del misto sono nel [riepilogo JSON compresso](sb-16h/summary.json.gz).

## Ipotesi della proposta, una per una

Le attese della sezione 4 furono formulate prima della 1.5, usando il passo 2. I riferimenti numerici 44–50% di mazzi esauriti
non descrivono più la 1.5: qui il confronto usa sempre il 20/2 rimisurato, identico alla bozza di riferimento D92.
Le probabilità ipergeometriche della proposta riguardano solo pesca uniforme senza oggetti o ricerca: non sono le probabilità
osservate di giocare il colpo.

Ordine dei valori, dove non specificato: **20/2, 25/2, 25/3, 30/2, 30/3**. Esiti descrittivi sui due euristici, coerenti con il gruppo principale D93; il controllo su tutti gli stili conferma le direzioni aggregate di annunci, ricerche fallite e carte non scelte. Nessuna nuova partita. [Conti delle ipotesi](sb-16h/hypotheses.json).

| Ipotesi | Esito | Evidenza |
|---|---|---|
| Mazzi esauriti | **Confermata** sul criterio del dimezzamento | Fra euristici: 15,64% → 2,47% → 2,11% → 0,99% → 1,55% (ordine delle cinque varianti). Tutte le alternative superano il dimezzamento. I turni di esaurimento dipendono dallo starter: nel 20/2 la media va da 10,61 a 15,27; il +5/+10 non è un orologio uniforme, anche per le pescate degli oggetti. |
| Durata | **Smentita** come andamento generale | Specchio Celestina: 14,48 / 11,94 / 14,39 / 12,92 / 16,69 turni; Beppe: 6,81 / 6,99 / 6,66 / 9,25 / 7,37. Celestina si accorcia nelle X/2 e nel 25/3; si allunga solo nel 30/3. Piera 25/2 arriva a 13,01 turni. Gli incontri veloci non restano tutti invariati. |
| Patte | **Confermata** la previsione favorevole alle X/3 | Celestina/Beppe: 25/3 4,08% / 8,30%; 30/3 3,74% / 6,53%, sotto il 10%. Il riferimento 1.5 era già sotto soglia. Le X/2 restano incerte per singolo specchio: Piera 25/2 sale a 11,90%. |
| Annunci per partita | **Smentita** la graduatoria prevista | Ordine osservato: 20/2 0,940 > 25/3 0,845 > 30/3 0,838 > 25/2 0,757 > 30/2 0,710 per starter-partita. La maggiore densità del caricamento non basta a far salire il 25/3 sopra il riferimento; non si deduce per questo indipendenza dalla densità. |
| Ricerche fallite | **Confermata** | Quote sulle ricerche eseguite: 34,00% / 23,39% / 13,96% / 21,95% / 13,06%. Calano in tutte le alternative, più nelle X/3 a parità di dimensione; anche i conteggi assoluti calano a parità di partite. |
| Costanza | **Confermata** nei confronti prefissati | Media delle ampiezze P10–P90 del primo colpo NC: 20/2 6,6 turni, 25/3 5,6, 30/2 8,4. Il 30/3 è a 7,0, quindi non migliora il riferimento su questa misura. Le quote «mai» e il raro restano separate per starter nei dettagli: una banda più stretta non implica più giocate in ogni starter. |
| Carte morte | **Smentita** nella motivazione sui titoli nuovi | I turni regolari non scelti per starter-partita aumentano nelle X/2 (20,057 → 20,632 / 22,584), ma i titoli nuovi attendono meno dei vecchi: quota non scelta sul tempo in mano 73,19% contro 77,84% nel 25/2 e 76,05% contro 78,21% nel 30/2. Nelle X/3 il totale è 17,346 / 20,058. Tutti i titoli, compresi quelli poco o mai scelti, restano nelle tabelle. |
| Quote | **Smentita** | Massimo scarto da 50%: 19,93 punti / 26,26 punti / 22,08 punti / 26,97 punti / 18,80 punti. Le X/2 allargano la forbice, soprattutto a danno di Mara; il 30/3 la restringe, ma peggiora comunque Mara–Piera. Nessuna variante migliora ogni criterio D93. |

## Braccio misto: lo stesso personaggio a 20 contro 30

In ogni incontro A = 20/2; B = 30/2 o 30/3. La quota è quella del 20 sulle decisive, con stili e politiche a pari peso.
Non si applica il cancello di quota di uno specchio: qui i due mazzi sono volutamente diversi. Le misure per ciascuna parte sono
conservate separatamente nel JSON, compreso il 20 che affronta i due differenti mazzi da 30.

| Personaggio | Avversario | Quota del 20, euristici | Patte | Turni | Esauriti 20 / 30 | Quota del 20, com |
|---|---|---:|---:|---:|---:|---:|
| Spazienzio | 30/2 | 33,75% | 1,99% | 8,60 | 4,91% / 0,22% | 50,04% |
| Spazienzio | 30/3 | 47,24% | 2,57% | 9,12 | 7,18% / 0,00% | 48,45% |
| Mara | 30/2 | 64,41% | 5,56% | 9,84 | 14,58% / 0,00% | 58,25% |
| Mara | 30/3 | 51,51% | 4,50% | 8,65 | 7,31% / 0,00% | 44,86% |
| Celestina | 30/2 | 50,89% | 3,67% | 13,59 | 52,02% / 5,27% | 50,71% |
| Celestina | 30/3 | 56,99% | 3,91% | 15,14 | 64,43% / 3,52% | 56,07% |
| Piera | 30/2 | 57,47% | 5,42% | 11,37 | 37,73% / 0,00% | 73,32% |
| Piera | 30/3 | 47,24% | 6,35% | 10,95 | 31,54% / 0,00% | 49,15% |
| Beppe | 30/2 | 56,09% | 4,79% | 7,87 | 13,09% / 0,00% | 43,05% |
| Beppe | 30/3 | 59,95% | 7,72% | 7,02 | 2,78% / 0,00% | 53,44% |

**Il vantaggio dipende dal personaggio e dalla lista.** Contro 30/2 Spazienzio preferisce 30, Mara/Piera/Beppe preferiscono 20, Celestina è vicina alla parità. Contro 30/3 Celestina e Beppe guadagnano a 20, gli scarti di Spazienzio, Mara e Piera sono più piccoli. Queste dieci liste non mostrano un collasso universale del range sul minimo o sul massimo. La costruzione libera e un eventuale incentivo del range restano da giudicare dal proprietario; la raccomandazione della proposta di non adottarlo ora resta una proposta, non una decisione nuova.

Esaurimento, annunci, ricerche, costanza, finali in last resort e carte morte di **entrambe le parti**, separati per incontro, sono nei dettagli e nel JSON.

## Criterio di scelta D83, punto 9

Confronto numerico con 20/2: dimezzare i mazzi esauriti; ridurre la media delle patte dei cinque specchi (i singoli specchi restano
visibili); nessun altro incontro passa da ≤12 a >12 turni; non aumenta il massimo scarto assoluto da 50% negli incontri non speculari;
non crescono i turni di carte regolari in mano senza essere scelte per starter-partita. Per l'aggiunta D93 si richiedono **nessuna
nuova violazione e nessun aumento della distanza da una soglia già violata**, incontro per incontro, su quota, patte e durata.
Sono esplicitate queste aggregazioni perché un conteggio unico degli incontri fuori criterio può nascondere peggioramenti.

| Variante | Dimezza esauriti | Riduce patte specchi | Nessun nuovo >12 | Forbice non cresce | Carte morte non crescono | D93 non peggiora | Tutto D83 |
|---|---|---|---|---|---|---|---|
| 25/2 | sì | sì | no | no | no | no | **no** |
| 25/3 | sì | sì | sì | no | sì | no | **no** |
| 30/2 | sì | sì | sì | no | no | no | **no** |
| 30/3 | sì | sì | sì | sì | ≈ invariato* | no | **no** |

*Il 30/3 passa da 20,057347 a 20,057711 turni regolari non scelti per starter-partita: +0,000364, praticamente invariato come dato descrittivo; l’uguaglianza stretta non passa. **Il suo esito non dipende da questo scarto minimo:** peggiora già due criteri D93.

**Nessuna variante soddisfa il criterio congiunto.** Esempi decisivi:

- **25/2:** Piera–Piera introduce patte 11,90% e durata 13,01; Mara arretra ulteriormente.
- **25/3:** Piera–Beppe sale al 64,19% per Piera (nuova uscita dalla quota); peggiorano anche quote già fuori.
- **30/2:** Spazienzio–Beppe sale al 63,53% (nuova uscita); Spazienzio–Mara arriva al 76,63%.
- **30/3:** Mara contro Piera scende da 34,79% a 33,37%; Celestina–Celestina da 14,48 a 16,69 turni. Nessuna nuova categoria fuori soglia, ma due peggioramenti di scarti già fuori.

[Valutazione con tutti gli scarti per incontro](sb-16h/selection.json). Il mancato rispetto dell’aggiunta D93 rende il verdetto indipendente dalle piccole differenze o dalle diverse possibili aggregazioni di carte morte e patte degli specchi. Il 20/2 resta il riferimento vigente; la scelta resta al proprietario.

L'altra aggiunta di D83 resta un cancello umano: **prova del proprietario sulla variante scelta prima di cambiare R02**. Questi dati
non scelgono un formato e non cambiano D1, R02 o le liste definitive; Q7 resta al proprietario. Dopo la scelta e la prova umana, la
proposta 1.6 di D92 e poi SB-17, nell'ordine già deciso.

## Budget, verifiche e limiti

| Voce | Banco (s) | Orologio Maven (s) | Nel budget D83 |
|---|---:|---:|---|
| Passo 0 | 61,124 | 96,343 | no |
| Giro unico, sei bracci | 3194,862 | 3214,403 | sì |
| Campioni falliti o rilanci | 0 | 0 | — |

**Spesi 3214,403 s su 7.200; residuo 0 giri e 3985,597 s.** Il tempo della fase nella JVM, incluse le scritture, è 3197,027 s. Budget distinto da D68 e D90; verifiche unitarie, mutazioni e identità viva fuori dal budget di misura. [Registro](sb-16h/budget.json).

| Verifica | Esito |
|---|---|
| `./scripts/build.ps1 -Task Test -Offline` | **818 test server, 0 falliti/errori, 18 saltati** (misure opt-in); **37/37** test client-debug |
| `TurnForecastFidelityTest` | A **5.526/5.526** turni; B **5.536/5.536**; 72/73 esclusi per timer, come previsto dalla verifica |
| Test nuovi | **6/6**, comprese tracce complete per tutte le varianti e rifiuto vivo del 25 |
| Mutazioni sui contatori | **3/3 rilevate**: primo turno sovrascritto, esaurimento mai avviato, last resort annullata contata come eseguita ([dati](sb-16h/mutations.json)) |
| Identità viva 1.13 | **480.000 partite**, JSON 266.868 B e Markdown 26.111 B **identici byte per byte** alla base ([impronte](sb-16h/live-identity.json)) |
| `python scripts/check-rules.py` | **verde**, 39 carte vive e 1 token, nessuno scarto |
| `git diff --check`, link dei documenti del blocco | **verdi**, 10 documenti controllati e 0 link rotti |

[Riepilogo verificabile dei controlli e impronte dei log](sb-16h/verification.json).

Nessun atteso storico o soglia modificato. Durante la preparazione corretti errori nelle sole nuove fixture (accesso alla rarità,
metadati della basic viva, conteggio del mazzo prima della distribuzione). Nessun rosso residuo attribuito al gioco.
**Non eseguiti:** contesto Spring completo, client-web, Playwright, FFA, mazzi costruiti e prova umana. I test unitari verdi non sono
una prova di avvio del contesto Spring. Nessun trasferimento alla partita viva.

## Evidenze e riproduzione

[Manifesto con SHA-256 dei file originali decompressi](sb-16h/manifest.json). JSON finali minificati e compressi gzip, più riepiloghi leggibili;
i file di matrice conservano tutti gli stili e tutte le celle. Le evidenze non contengono tracce complete dei milioni di partite.
Uscite e log integrali locali: `%TEMP%\bm-sb16h` (`C:\Users\PEDM17\AppData\Local\Temp\bm-sb16h`).

Il [runner PowerShell](sb-16h-run.ps1) usa Java e Maven fissati dal checkout, verifica i processi Java prima di ogni corsa e registra
l'orologio. Su un nuovo percorso di uscita, dalla radice:

```powershell
./docs/reports/set-base/sb-16h-run.ps1 -Phase step0 -OutputRoot "$env:TEMP/bm-sb16h-reproduction"
python docs/reports/set-base/sb-16h-analyze.py feasibility "$env:TEMP/bm-sb16h-reproduction"
# Solo se fattibile: usa automaticamente 300 o 150 per tutti, secondo la stima.
./docs/reports/set-base/sb-16h-run.ps1 -Phase round -OutputRoot "$env:TEMP/bm-sb16h-reproduction"
python docs/reports/set-base/sb-16h-analyze.py summarize "$env:TEMP/bm-sb16h-reproduction"
python docs/reports/set-base/sb-16h-lists.py
```

Questi sono comandi di riproduzione, **non un'autorizzazione a un secondo giro D83**. Una cartella già tentata viene rifiutata.
Per una singola variante lo stesso banco storico accetta, da `server/` con Maven del checkout:

```powershell
& $mvn @common -q test '-Dtest=ChargeMeasureTest#measure' '-Dsim.rules=d50' `
  '-Dsim.draft=classpath:/set-base/bozza.json' '-Dsim.arm=B' '-Dsim.threads=8' `
  '-Dsim.deckVariant=25-3' '-Dsim.chargeGames=300' '-Dsim.chargeOut=OUT'
```

`python` è stato trovato nell'interprete già presente in `%TEMP%\bm-sb16g-proposta-python-3.13.0`, aggiunto al PATH dei comandi;
nessun download. L'analizzatore è solo lettura e aggregazione, non lancia partite e non modifica le liste.

## Domande numerate al proprietario

1. **Confermi il 20/2 per la prova umana della 1.5**, applicando il criterio D83 che nessuna alternativa soddisfa?
2. **Vuoi affiancare nella prova un confronto con 25/3 o 30/3**, per giudicare di persona il ritmo e la costanza prima della scelta definitiva? Le regole vive restano 20/2 fino a una tua decisione e alla prova prevista da D83.
