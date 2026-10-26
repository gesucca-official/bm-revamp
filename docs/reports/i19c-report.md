# I19c — Verifica trasversale di manifest ed export

26 ottobre 2026. **Completato e verificato** dopo I19a/I19b/I24. Regolamento 1.6 invariato. Nessuna modifica al motore o ai risultati di gioco; incremento dedicato a un verificatore ripetibile e alle evidenze export↔SQLite.

## Ambito e risultati

Comando: `python scripts/verify-match-manifests.py`. Produce `.build-logs/i19c-manifest.json` e fallisce al primo mismatch.

| Percorso | Copertura verificata |
|---|---|
| Conclusioni ordinarie | 7 esiti combat nelle quattro modalità: quick1vCom (2), open1vCom (2), quick1v1 (2), quickFFA (1); 563 eventi |
| Ciclo di vita I19b | 12 match, tre casi (leave/forfait con reconnect, timeout, recupero scritture) per modalità; 169 eventi |
| Restart I24 | 12 attivi, quattro modalità per ciascuno di arresto pulito, crash e interruzione della finalizzazione; 12 OUTCOME tecnici draw in 36 eventi totali |

Per tutti gli export verificati il controllo ricalcola SHA-256 su stringhe JSON originali, sequenza e previousHash, accerta contiguità e unicità, un INITIAL e un OUTCOME terminale, schema/versioni e stato iniziale, ordine dei report/transizioni, stato terminale e assenza di chiavi segreto. Le fixture CLI forniscono l'ordine esatto atteso degli eventi I19b; i test Spring controllano anche dettagli di mossa/clock/forfait/esito e confrontano l'export fra partecipanti e dopo la rilettura con nuovi repository.

I19b salva ora una copia sintetica SQLite per ogni scenario CLI. Il verificatore confronta per ogni match ogni tuple persistita `(sequence, previousHash, hash, json)` con l'export e il marker V003 (mode, sequence/hash OUTCOME), oltre a `integrity_check` e `foreign_key_check`. Per I24 ripete il confronto sui database dei tre processi di restart, verifica registro chiuso e tre export identici, preservazione del match concluso e dei due log legacy. I file export originali e le righe del DB restano immutati.

## Anomalia trovata e trattamento

Il vecchio `.build-logs/i19b-manifest.json` riporta ID, hash ed eventi non corrispondenti ai transcript `i19b-<mode>-<scenario>.json` presenti. La riproduzione precisa è eseguire il nuovo comando prima di rigenerare il riepilogo: confrontando il primo case `open1vCom/leave`, l'ID del manifest differisce dall'ID dentro al relativo export. Il verificatore non ha accettato il manifest storico né ha cambiato i dati; controlla la matrice di scenari prevista, rilegge transcript/export/SQLite e scrive un nuovo manifest I19c derivato dai byte correnti.

Il controllo non ha trovato buchi, duplicati, divergenze export↔SQLite, esiti mancanti, chiavi segrete o alterazioni dei dati preesistenti. Le suite I19b/I24 avevano già esercitato guasti di append, retry, writer concorrenti e interruzione transazionale con riproduzioni precise; non è emerso un difetto strutturale ulteriore che giustifichi correzioni al recorder/finalizzatore. Nessun replay, restore o pannello di analisi introdotto.

## Limiti

Le prove I19b sono fixture sintetiche e il confronto SQLite usa snapshot dedicati prodotti dalla suite Spring. I casi di arresto/crash derivano dalle JVM separate I24, non da una simulazione di perdita hardware o corruzione simultanea dei due supporti; tali condizioni non sono coperte dal contratto. Nessuna capacità di lungo periodo viene dedotta dai conteggi. I22, regressione completa e approvazione della base, resta aperto.

