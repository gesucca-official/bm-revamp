# Piano C5 — Consegnare il client web per i playtest (ridotta)

26 novembre 2026. Regolamento **2.3** col [Set Base 1.0.4](sets/base.md) (aggiornato la sera dello stesso giorno, dopo SB-30a, SB-34 e CA-0e), [roadmap del client](client-roadmap.md#c5-consegnare-il-client-web-per-i-playtest)
versione 64. C0–C4 sono chiuse ([piano C4](client-c4-plan.md)). Stato corrente nell'[indice](README.md#filoni-attivi).

> **Ripartenza** (aggiornata il 27 novembre 2026, dopo la consegna di C5-1). La aggiorna chi chiude un blocco e la regia a ogni decisione ([metodo](orchestrazione-lavoro.md#avvio-di-un-filone)).
>
> - **In vigore:** C5 ridotta ([D1](#decisioni-del-proprietario)): regressione completa, un passaggio di correzione, guida di avvio, rapporto. Senza la prova umana C.
> - **In corso:** nessun blocco (C5-1 consegnato il 27 novembre 2026).
> - **Prossimo:** C5-2 per gli strumenti (R21, R22, R24), se il proprietario lo apre.
> - **In attesa:** revisione del [rapporto C5-1](reports/client-c5/c5-1.md), domande 1–3. L'ingresso dei lotti 1–5 di SB-32 nell'atlante può partire: C5-1 non lancia più verifiche.
> - **Decisioni da leggere:** D1; [D16 del piano C4](client-c4-plan.md#decisioni-del-proprietario) (metodo delle verifiche); [D1 della roadmap del prodotto](product-roadmap.md#decisioni-del-proprietario).

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
| C5-1 | Consolidamento: matrice completa, attribuzione dei rossi, guida di avvio provata da checkout, rapporto | diretto, con STOP sui blocchi | consegnato il 27 novembre 2026, in revisione ([rapporto](reports/client-c5/c5-1.md)) |
| C5-2 | Correzione dei blocchi emersi in C5-1, un solo passaggio, con controllo mirato | diretto | solo se serve |

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

**Stato (27 novembre 2026): consegnato, in revisione.** Build di `1c3985f`: matrice completa 21/25, 750×292 2/7. Ogni rosso è attribuito: R1 noto, nuovi R21–R25 nel [registro](reports/rossi-noti.md); nessuno STOP. Guida di avvio provata da clone pulito fino a una partita contro il Facile e una contro il Normale, con rientro all'hub; corretti i passi mancanti in `client-web/README.md` e `docs/setup.md`. Proposto C5-2 per gli strumenti (R21, R22, R24). [Rapporto](reports/client-c5/c5-1.md), domande 1–3.

## Decisioni del proprietario

| ID | Decisione | Fonte |
|---|---|---|
| D1 | C5 ridotta | 26 novembre 2026, alla proposta della regia («una C5 ridotta, invece di toglierla del tutto: tieni regressione, guida e rapporto; la prova con 4 persone la sostituiscono le partite con gli amici dopo DE-1»). Il proprietario: «C5 ridotta». 1. C5 tiene la regressione completa sul codice corrente, un passaggio di correzione dei blocchi emersi, la guida di avvio e il rapporto dei limiti residui. 2. Esce la prova umana C con quattro persone: le prime partite con gli amici dopo DE-1 fanno da prova umana del client, e i ritorni si correggono dopo (D1 della roadmap del prodotto). 3. O19 si decide dopo quelle partite, non in C5. 4. Gli altri rimandi «dopo C5» restano come sono; la chiusura di C5 continua a sbloccare ST-1, DE-1, EC-0 e CA-0g. 5. `client-debug` resta fino alla chiusura di C5. |
