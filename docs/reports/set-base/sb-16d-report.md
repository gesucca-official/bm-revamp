# SB-16d — Attuazione dei cinque starter approvati

12 novembre 2026. Seconda parte di SB-16d: attuazione della [proposta 0.2](../../design/set-base/sb-16d-proposta.md),
con approvazione registrata in D55 del [piano](../../set-base-plan.md#decisioni-del-proprietario). Prima parte già consegnata;
questa relazione riguarda carte, griglia e verifiche. Base iniziale `1f2dccf`, riapplicata come `9a2e16c` dopo l’allineamento finale a origin/main; base di revisione `9a2e16c..HEAD`. D55 registrata per prima nel commit documentale `61be008`.

> approvo, poi cmq le ritestiamo estensivamente

## Cosa cambia

I nove slot approvati sono nella bozza: caricamenti con ricerca esatta, esposizione visibile per due turni, tre difese con premio,
Tossicone a 12 POISON. Copie, rarità, composizioni, personaggi, basic, last resort, costi e danni dei cinque colpi cercati sono
conservati, salvo il danno di Tossicone già approvato. Non sono stati avviati giri di bilanciamento o misure delle ablazioni di SB-16e.

| Slot | Carta attuata | Effetti principali |
|---|---|---|
| SPA-AR3 | PAZIENZA: FINITA | +15 V e +15 A; HIT ricevuti ×1,5 per due turni; cerca SPA-AR1 |
| MAR-AR5 | Slalom d’avvicinamento | gratuito, priorità 2; +15 A; esposizione ai tre tipi; cerca MAR-AR2 |
| TOS-AR1 | Dose in preparazione | gratuito, priorità 1; +15 T; esposizione ai tre tipi; cerca TOS-AR2 |
| PIN-AR4 | Un altro e arrivo | gratuito, priorità 1; +15 L e +10 A; esposizione ai tre tipi; cerca PIN-AR2 |
| GIG-AR3 | Preparo il lavoro | gratuito, priorità 1; +10 V; esposizione ai tre tipi; cerca GIG-AR5 |
| GEN-13 | Tartaruga sul marciapiede | parata invariata, più cura 3 |
| MAR-AR4 | Tra due paraurti | parata invariata, più rimborso di 5 A |
| GIG-AR4 | Sotto il cofano | parata invariata, più rimborso di 5 V |
| TOS-AR2 | Tossicone Scatarrante | 12 POISON invece di 8, +5 T al bersaglio invariata |

La ricerca sostituisce la pesca dopo la mossa, mostra la carta e ripiega sulla pesca ordinaria se manca; a mazzo vuoto arriva la last
resort. Stati con nome e descrizione del colpo annunciato, BAD INPUT, `turns: 1`: corrente più successivo. Il colpo non è obbligatorio,
non ha bonus nascosti e può essere giocato anche senza preparazione. Nessuna nuova eccezione «Ultimo colpo».

La griglia recepisce D52, i nove slot, le coppie, i triangoli, i nomi negli starter e la copertura. Le vecchie stime su L sono marcate
come precedenti a SB-16d; le sezioni delle misure SB-12a–SB-15 restano storiche. Il passo `search`, gli stati e le due classi dei
colpi di Piera/Beppe erano già disponibili da SB-16c/SB-14/SB-15: nessun nuovo passo, classe o cambiamento del motore/bot è necessario.
L'euristica D50 di SB-16c riceve i nomi, i guadagni e la carta rivelata dalle nuove definizioni. Resta una stima semplice:
legge la ricerca dell'ultimo turno e il danno nominale, senza simulare integralmente esposizione, decadimento e scelte avversarie.
In particolare GIG-AR5 ha base nominale 6+x: la sua lettura condizionata agli oggetti va guardata nelle misure dedicate di SB-16e.

## Correzione numerica di CinqueMinutiEVado (D38/D54)

**PIN-BO1 passa da +10 a +5 L.** Unico cambiamento: numero del guadagno e testi descrittivi corrispondenti. Gratuità, priorità 0,
SELF, scarto della bound e funzione di generatrice restano. Non si aggiungono stati, condizioni, effetti o eccezioni alla corazza.
È una correzione numerica nella delega esplicitamente richiamata dal proprietario; non serve un nuovo giudizio sul funzionamento.

Sonda deterministica del tetto con `d50`, parametri di D33/D36 invariati (tetto 4, tolleranza 0, L pesata 0,35):

| L per uso | Massimo per uso misurato | Esito |
|---|---:|---|
| +10, prima | 8,50 | oltre il tetto |
| +6, valore adiacente superiore | 5,10 | oltre il tetto |
| **+5, attuata** | **3,75** | sotto il tetto |

Con +5, 1,75 viene dal guadagno pesato e il resto dal danno assorbito in più. La prima sonda a +4 dava 3,40; +5 conserva più carburante
ed è già sufficiente. Il primo test di sviluppo supponeva erroneamente che +5 superasse il tetto: la sonda ha smentito quell'ipotesi;
la correzione applicata segue i valori misurati. Nessuna soglia o atteso di regressione è stato allentato. La sonda della singola bound
è quella richiesta dal punto 2 del brief, non un giro di bilanciamento degli starter. Le altre carte restano ai numeri della proposta.

## Test delle carte

`StarterRedesignTest` usa le carte caricate da `set-base/bozza.json` e il motore con `Ruleset.D50`; solo le mosse dell'avversario
usate come sonde sono sintetiche. Quattordici test, con gli scenari delle coppie ripetuti su tutti e cinque i personaggi:

- visibilità all'avversario di stato, nome del colpo e carta rivelata, senza accedere alla mano avversaria;
- ricerca trovata (estrae il colpo dietro la cima e non pesca in più), assente, mazzo vuoto e doppione già in mano;
- i cinque colpi cercati sono poi giocabili, con il danno approvato; il veleno diretto passa anche sull'immune al periodico di T;
- esposizione sui tipi previsti per esattamente due turni, con scadenza anche dopo il colpo;
- attacco prima/dopo il caricamento: nessuna applicazione retroattiva; corazza sottratta dopo il moltiplicatore;
- annullamento: nessun guadagno, stato o ricerca; pesca ordinaria;
- chi è a terra può terminare il caricamento SELF e cercare, ma non si salva; i cinque attacchi di chi è già a terra si annullano;
- difese senza attacco: cura o rimborso effettivo; il costo iniziale resta necessario; parate ancora efficaci e scadute dopo il turno;
- Tartaruga cura da zero e conserva il salvataggio di D48;
- bound sotto il tetto e confronto con +10 e +6, senza cambiare pesi o controllo.

I test preesistenti restano in funzione. Attesi aggiornati in `SetBaseDraftTest`, tutti deliberati e riconducibili a D55:

| Atteso precedente | Nuovo atteso / ragione |
|---|---|
| 12 stati con durata nella bozza | 24: quattro nuovi caricamenti da tre stati ciascuno, tutti ancora verificati contro il testo e R05 |
| Slalom costa 10 A | slot trasformato in caricamento gratuito; le altre correzioni di SB-12a restano verificate |
| MethDrivenRage costa 10 T | slot trasformato in caricamento gratuito; le altre tre carte pagate in T restano a 10 |
| Tossicone 8 POISON | 12 POISON anche nei metadati; salute nelle prove conseguenti 67 → 63 e 60 → 56 |
| Offro io costa 5 L e dà 20 L al bersaglio | Un altro e arrivo gratuito, +15 L/+10 A propri, nessun guadagno al bersaglio |
| Colpo di chiave inglese 6 HIT | Preparo il lavoro: +10 V e ricerca, ruolo RESOURCES, nessun danno nominale |

Non ci sono nuovi rami nella logica di prodotto: cambiano solo dati delle carte, descrizioni e test. Nessuna mutazione del motore
richiesta da questo blocco; i rami di `search`, dei gruppi di velocità e della corazza erano verificati e mutati in SB-16c.

## Banco SB-7 con D50

Un solo banco di conformità sulla bozza finale, senza ritocchi successivi dei numeri: 2.000 partite per cella, cinque starter,
quattro stili (aggressivo, prudente, risorse, com), primo seme 7.000.000, otto thread. Sono 240 celle, 480.000 partite.
Opzioni `-Dsim.rules=d50 -Dsim.strict=true`; tetto, tolleranza, pesi e limiti di durata del verificatore invariati.

**Verde:** 480.000 partite e **12.930.290 turni di giocatore**, otto invarianti tutti a zero, zero partite al limite,
zero bound in violazione su 15. CinqueMinutiEVado al massimo 3,75. Tempo del banco 59,486 secondi.
SHA-256 bozza `90c3672a2eb3f5441197c750d0d6e11f5e3c159827d5bce1ff75629677f30862`.

**Fotografia per la consegna a SB-16e, non esito di bilanciamento:** patte globali 10,06%, durata media 13,47 turni.
I criteri non sono ancora raggiunti: cinque incontri oltre il 10% di patte, compresi tre specchi; Celestina è forte in diversi incontri.
Nessun numero corretto dopo aver letto questi risultati.

| Incontro | Quota di A, patte escluse | Patte | Turni medi |
|---|---:|---:|---:|
| Spazienzio–Spazienzio | 0,498 | 4,01% | 11,51 |
| Spazienzio–Mara | 0,520 | 3,99% | 11,20 |
| Spazienzio–Celestina | 0,355 | 5,71% | 13,14 |
| Spazienzio–Piera | 0,393 | 6,85% | 14,31 |
| Spazienzio–Beppe | 0,447 | 4,62% | 12,33 |
| Mara–Mara | 0,500 | 4,37% | 10,51 |
| Mara–Celestina | 0,396 | 7,28% | 12,43 |
| Mara–Piera | 0,563 | 11,35% | 13,49 |
| Mara–Beppe | 0,498 | 4,49% | 11,64 |
| Celestina–Celestina | 0,503 | 21,85% | 18,36 |
| Celestina–Piera | 0,758 | 9,56% | 15,08 |
| Celestina–Beppe | 0,679 | 9,29% | 13,80 |
| Piera–Piera | 0,503 | 29,15% | 16,48 |
| Piera–Beppe | 0,511 | 14,35% | 14,76 |
| Beppe–Beppe | 0,505 | 14,00% | 13,01 |

Evidenze in [sb-16d/](sb-16d/): JSON finale minificato, rapporto completo del banco, tempi e riepilogo delle verifiche.
Tutti i log estesi restano in TEMP. I numeri di vittorie, durata e patte descrivono questa singola esecuzione: i criteri di
bilanciamento e le misure con/senza coppie saranno giudicati in SB-16e. Nessun cambio per farli rientrare viene effettuato qui.

## Verifiche, rossi e limiti

- `./scripts/build.ps1 -Task Test -Offline`: **verde**, server 702 test, zero fallimenti/errori, 7 saltati (misure a richiesta);
  client-debug 37/37. I 14 nuovi test sono inclusi. Prova mirata iniziale di carte e bozza: 34/34.
- `python scripts/check-rules.py`: **verde**, regolamento 1.13 e Set Base 0.1 allineati, 39 carte e un token, SQLite integro.
- `python scripts/check-links.py`: **verde**, 276 documenti, zero link rotti (ricontrollato dopo la chiusura dei documenti).
- `git diff --check`: **verde**.
- `./client-web/run.ps1 -Task Test`, `Build`, `Size`: **verdi**, 333 test, Size con `BM_OUT` in TEMP: JS gzip 350.290 byte,
  totale gzip 1.760.434 byte, texture decodificate 27.729.048 byte, tetti ordinari e C4 rispettati.
  Il bundler emette il consueto avviso su un chunk oltre 500 kB; Size è verde e nessun limite è stato cambiato.
- Banco rigoroso D50: **verde**, come sopra. Nessun altro giro sugli starter.

**Allineamento finale:** rebase sui quattro commit CA-0a arrivati durante il lavoro, senza conflitti. Le righe dei due filoni
nell’indice sono conservate. Nessuna differenza in server, client web/debug, regolamento o set fra prima e dopo il rebase:
restano valide le verifiche sul codice; regole, link e diff ricontrollati dopo l’allineamento. Nessun push.

**Rossi finali:** nessuno nei controlli di conformità. I criteri di bilanciamento non rispettati nella fotografia sopra sono la
consegna a SB-16e, non vengono mascherati cambiando soglie o attesi. Nessuna modifica al registro dei rossi noti.

Log completi: `C:\Users\gesucca\AppData\Local\Temp\bm-sb16d-final-59e05fb956bd4a4398a4b4929f178794`,
`%TEMP%\bm-sb16d-cards.log`, `%TEMP%\bm-sb16d-draft-tests.log`, `%TEMP%\bm-sb16d-bench-d50.log`.
Evidenze committate inferiori a 0,2 MB, sotto il limite di 3 MB.

Regolamento, documento del set, catalogo, SQLite, allegato e client non cambiano. Nessun diff in `server/src/main`: il gioco vivo
continua a usare lo stesso motore/catalogo e le regole 1.13; la bozza è letta solo dal percorso di sviluppo già predisposto.
Le verifiche unitarie non equivalgono all'avvio del contesto Spring completo. Nessun playtest umano, nessuna verifica Playwright,
nessuna misura FFA con queste nuove carte, nessuna taratura o ablation delle coppie in questa fase.

## Consegna al proprietario

Funzionamento e composizione erano approvati con D55. La correzione della bound è solo numerica, dichiarata sopra sotto D38/D54.
Il giudizio successivo riguarda il bilanciamento misurato in SB-16e e il ritmo della prova umana SB-16f, con la richiesta del
proprietario di ritestare estesamente. STOP prima di SB-16e; nessuna nuova decisione sul funzionamento richiesta da questa attuazione.
