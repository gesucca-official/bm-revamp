# Piano C5 — Consegnare il client web per i playtest (ridotta)

26 novembre 2026. Regolamento **2.3** col [Set Base 1.0.4](sets/base.md) (aggiornato la sera dello stesso giorno, dopo SB-30a, SB-34 e CA-0e), [roadmap del client](client-roadmap.md#c5-consegnare-il-client-web-per-i-playtest)
versione 64. C0–C4 sono chiuse ([piano C4](client-c4-plan.md)). Stato corrente nell'[indice](README.md#filoni-attivi).

> **Ripartenza** (aggiornata il 27 novembre 2026, dopo la consegna di C5-1). La aggiorna chi chiude un blocco e la regia a ogni decisione ([metodo](orchestrazione-lavoro.md#avvio-di-un-filone)).
>
> - **In vigore:** C5 ridotta ([D1](#decisioni-del-proprietario)): regressione completa, un passaggio di correzione, guida di avvio, rapporto. Senza la prova umana C. C5-1 accettato ([D2](#decisioni-del-proprietario)): R23 e R25 sono limiti di 750×292.
> - **In corso:** nessun blocco.
> - **Prossimo:** C5-2, correzione degli strumenti per R21, R22 e R24 (con proposta). Poi la chiusura di C5 da parte del proprietario.
> - **In attesa:** il via del proprietario a C5-2. C5-2 e l'ingresso dei lotti di SB-32 nell'atlante non girano insieme: chi parte prima finisce le sue verifiche.
> - **Decisioni da leggere:** D2, D1; [D16 del piano C4](client-c4-plan.md#decisioni-del-proprietario) (metodo delle verifiche); [D1 della roadmap del prodotto](product-roadmap.md#decisioni-del-proprietario).

## Obiettivo

**Risultato:** una versione locale ripetibile del client web, verificata per intero sul codice corrente, con una guida di
avvio da checkout e un rapporto dei limiti residui. Basta questo per passare al deploy per gli amici (DE-1), dove le partite
vere fanno da prova umana.

**Chiusura.** Tutte le righe della [matrice di fine C4](client-c4-plan.md#matrice-completa-di-fine-c4) rieseguite sulla stessa
build del codice corrente: ogni rosso è chiuso, oppure attribuito a una voce del [registro dei rossi noti](reports/rossi-noti.md),
oppure dichiarato come limite. Nessun nuovo blocco nei percorsi che funzionavano a fine C4. Nessuna discrepanza con il regolamento,
nessun dato privato in più, nessuna funzione tolta. Avvio documentato e provato da checkout. C5 la chiude il proprietario sul
rapporto.

**Fuori da C5** (D1): la prova umana C con quattro persone; la decisione su O19 (sequenza velocizzata); i rimandi già fissati
«dopo C5» (O31 con VE-1, O32 con gli eventi strutturati, C4-8b punto 2 e dichiarazione dell'IA in DE-1); le osservazioni O33 e O34,
che restano da assegnare; deploy e pacchetti nativi. `client-debug` resta come riferimento diagnostico fino alla chiusura di C5.

**Dipendenze e coordinamento.** Il codice client è cambiato molto dopo la fine di C4 (Set Base 1.0, SB-22, SB-31: testi del set,
atlanti per set, filtri dell'editor; SB-30a: livello Facile o Normale contro il computer). La matrice gira quindi sul codice di
oggi, non su quello di C4, e la guida di avvio cita la scelta del livello. C5-1 non gira insieme all'ingresso dei lotti di SB-32
nell'atlante: le verifiche sono esclusive e i due lavori toccano entrambi `client-web`. L'ingresso dei lotti viene dopo C5-1 e
rifà le proprie verifiche (`Size` e quelle grafiche); non riapre C5.

## Blocchi

| Blocco | Contenuto | Passo | Stato |
|---|---|---|---|
| C5-1 | Consolidamento: matrice completa, attribuzione dei rossi, guida di avvio provata da checkout, rapporto | diretto, con STOP sui blocchi | **accettato** il 27 novembre 2026 ([D2](#decisioni-del-proprietario), [rapporto](reports/client-c5/c5-1.md)) |
| C5-2 | Correzione degli strumenti per R21, R22 e R24, un solo passaggio, con controllo mirato | con proposta (strumenti condivisi) | da avviare |

### C5-1 — Consolidamento

1. Preliminare del contratto; build del server e del client sul commit di partenza, annotato nel rapporto.
2. Matrice completa, una verifica esclusiva per volta: `./client-web/run.ps1 -Task VerifyAll -Parallel 4 -Split 'resolution,ffa'`,
   poi il giro dichiarato della regola 18 a 750×292 (`-Measures 750x292 -Only 'test,build,size,verify,ffa,aim,layout'`).
   Prima e dopo, `./scripts/build.ps1 -Task Test -Offline` e `python scripts/check-rules.py`.
3. Confronto con la matrice di fine C4 (24/25 su `7687802`). Un rosso che corrisponde al registro è «noto, voce Rn»; uno nuovo si
   prova sul commit di base prima di attribuirlo. Un rosso che blocca un percorso che a fine C4 funzionava è uno **STOP**: diagnosi
   nel rapporto, la correzione va a C5-2.
4. Guida di avvio: seguire da un clone pulito la sezione «Avvio locale» di [client-web/README.md](../client-web/README.md) e la
   [guida locale](setup.md), con le cache predisposte, fino a una partita contro il computer e al rientro. Correggere solo i
   passaggi sbagliati o mancanti e aggiungere istruzioni brevi per chi prova il gioco.
5. Rapporto in `docs/reports/client-c5/c5-1.md`: esito, matrice con link alle evidenze, rossi e attribuzione, limiti residui, cosa
   resta rimandato e dove, domande.

**Perimetro:** `docs/reports/client-c5/`, `docs/client-c5-plan.md` (riga e sezione del blocco, Ripartenza),
`client-web/README.md`, `docs/setup.md` (solo la parte di avvio), `docs/reports/rossi-noti.md` (solo voci nuove o chiuse).
Nessun codice di prodotto: un difetto da correggere è uno STOP.

**Stato (27 novembre 2026): accettato ([D2](#decisioni-del-proprietario)).** Build di `1c3985f`: matrice completa 21/25, 750×292 2/7. Ogni rosso è attribuito: R1 noto, nuovi R21–R25 nel [registro](reports/rossi-noti.md); nessuno STOP. Guida di avvio provata da clone pulito fino a una partita contro il Facile e una contro il Normale, con rientro all'hub; corretti i passi mancanti in `client-web/README.md` e `docs/setup.md`. Proposto C5-2 per gli strumenti (R21, R22, R24). [Rapporto](reports/client-c5/c5-1.md), domande 1–3.

### C5-2 — Correzione degli strumenti

Tre correzioni in `client-web/tools` e `client-web/tests`, decise in [D2](#decisioni-del-proprietario). Nessun codice del client
che si gioca, del server o delle regole.

- **R21:** `R08a` (regolamento 2.3, CA-0e) entra nelle due liste dell'indice delle regole, `tests/public.test.ts` e
  `tools/verify-public.mjs`. È l'atteso che segue una modifica deliberata del regolamento, non un allentamento.
- **R22:** in `verify-layout.mjs`, lo scenario `resize-ffa` gestisce il posto proprio eliminato dopo una mossa. Il ridimensionamento
  in FFA deve restare provato, non saltato in silenzio.
- **R24:** in `verify.mjs`, `status-tip` passa il mouse su un gettone raggiungibile (non coperto). Se a 750×292 nessun gettone è
  raggiungibile, la verifica lo dichiara come limite di R1 e prosegue; alle altre misure resta un errore.

**Proposta** (breve): per ognuna il cambiamento esatto, come si prova che lo strumento vede gli stessi casi, cosa resta errore.
STOP per la decisione, poi attuazione. **Verifiche:** quelle della tabella delle aree per gli strumenti condivisi (lo strumento sul
commit di base e su quello nuovo, stessi casi e stessi esiti, differenze spiegate): `Test`, `VerifyPublic` a 1366×768 e 844×390,
`VerifyLayout` a 1366×768 (più giri di `resize-ffa`, numero dichiarato), `Verify` a 750×292 e a 844×390; più le righe «Sempre».
Il registro dei rossi chiude R21, R22 e R24; R23 e R25 restano come limiti di 750×292 (D2). Il rapporto ha la sezione per le altre
macchine; gli strumenti si pushano prima del prossimo blocco che li usa.

## Decisioni del proprietario

| ID | Decisione | Fonte |
|---|---|---|
| D1 | C5 ridotta | 26 novembre 2026, alla proposta della regia («una C5 ridotta, invece di toglierla del tutto: tieni regressione, guida e rapporto; la prova con 4 persone la sostituiscono le partite con gli amici dopo DE-1»). Il proprietario: «C5 ridotta». 1. C5 tiene la regressione completa sul codice corrente, un passaggio di correzione dei blocchi emersi, la guida di avvio e il rapporto dei limiti residui. 2. Esce la prova umana C con quattro persone: le prime partite con gli amici dopo DE-1 fanno da prova umana del client, e i ritorni si correggono dopo (D1 della roadmap del prodotto). 3. O19 si decide dopo quelle partite, non in C5. 4. Gli altri rimandi «dopo C5» restano come sono; la chiusura di C5 continua a sbloccare ST-1, DE-1, EC-0 e CA-0g. 5. `client-debug` resta fino alla chiusura di C5. |
| D2 | C5-1 accettato, risposte alle domande 1–3 | 27 novembre 2026, alle raccomandazioni della regia sul [rapporto C5-1](reports/client-c5/c5-1.md) (`7c2975c`). Il proprietario: «Sì, come proponi». 1. Si apre C5-2, con proposta, per correggere gli strumenti per R21 (`R08a` nelle due liste dell'indice), R22 (`resize-ffa` con il posto proprio eliminato) e R24 (`Verify` passa il mouse su un gettone raggiungibile; a 750×292, se non ce n'è uno, lo dichiara). 2. R24, per la parte del client, e R25 sono limiti della misura minima, come R1 e R4: vengono dal contenuto (gli starter del Set Base hanno più oggetti per posto), non da codice del client, e D6 del piano C4 non fa di 750×292 un obiettivo. 3. R23 resta una voce nuova accanto a R4. |
