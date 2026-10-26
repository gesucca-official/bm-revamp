# Verifica del 25 ottobre 2026

- Catalogo esportato: 39 carte SQLite (2 personaggi, 33 azioni, 4 oggetti) e 1 token dall'allegato normativo. Nessuna voce mancante o duplicata; descrizioni e classificazioni allineate a R07. Nessuna incongruenza corrente rilevata fra queste fonti.
- PDF: 8 pagine A4, prime 5 con 40 fronti, ultime 3 con legenda, starter e regole. Taglio effettivo 62 × 87 mm, griglia 3 × 3, spazio 3 mm, margini della griglia 9 e 15 mm. Testo degli effetti a 9 pt, senza riduzione automatica.
- `verify.py`: passato; controllo dei rettangoli nel contenuto PDF, formato fisico, inventario, copie, effetti estratti integralmente, margini e assenza di sovrapposizioni tra carte.
- PDF renderizzato con Poppler a 120 dpi; controllate visivamente tutte le 8 pagine, inclusi WhatchaDoin, ToxicBloodDrain, token, personaggi e guida. Nessun testo troncato o sovrapposto rilevato.
- Due test di integrazione dello strumento: passati. Una nuova carta aggiunta a copie temporanee di database, allegato e R07 viene inclusa senza cambiare il generatore; senza R07 la generazione fallisce esplicitamente. Verificati anche selezione di copie, formato alternativo 60 × 85 mm e rifiuto di formato troppo piccolo, senza pubblicare un PDF incompleto.
- `./scripts/build.ps1 -Task Test -Offline`: passato, 237 test server e 25 test client, zero fallimenti/errori/skipped server. Solo avviso npm relativo al controllo aggiornamenti, senza fallimento dei test.
- `python scripts/check-rules.py`: passato.

In questa sessione è stato usato il Python del runtime locale di Codex, con ReportLab e pypdf già disponibili; il comando `python` ordinario non li aveva installati. Le istruzioni nel README includono l'installazione necessaria per una postazione Windows indipendente.

Limiti: nessuna prova su stampante/sleeve fisica; verificare il segmento di calibrazione da 50 mm al primo foglio. Non eseguiti avvio completo Spring o test end-to-end. La stampa mantiene i comportamenti meno intuitivi del regolamento (RottenBeer senza equip, SingleUse riutilizzabile nello stesso turno, durata 3 di MadeOfStone); non corregge né cambia meccaniche. Le parti sui clock della guida riproducono le regole del server, senza introdurre una procedura diversa per il tavolo.

## Estensione starter, 25 ottobre 2026

- Aggiunte `--list-starters`, `--starter` ripetibile e `--all-starters`. Scoperta dai proprietari nelle tabelle SQLite, senza elenchi di mazzi fissi; copie di carte condivise sommate, personaggio e tutti gli slot iniziali inclusi. `--copies` moltiplica i mazzi; JSON applicato dopo come quantità assolute. Token esclusi dalla composizione dei mazzi e aggiungibili esplicitamente.
- Tre test di integrazione passati: selezione singola e multipla, ripetizione dello stesso mazzo e moltiplicatore, quantità condivise, override e token, nome/ID/ambiguità, errore per starter inesistente senza sovrascrivere il risultato ed elenco senza modificare il PDF. Aggiunto un terzo personaggio/starter a copie temporanee delle fonti: rilevato automaticamente da elenco, selezione e stampa di tutti gli starter. Mantenute le prove precedenti su nuove carte e overflow.
- Generato `output/pdf/botte-micidiali-starter.pdf`: 50 fronti, 25 per starter, comprendenti due Struggle; 6 fogli carte più 3 pagine guida. Formato 62 × 87 mm invariato. Controllate visivamente tutte le 9 pagine renderizzate con Poppler a 100 dpi.
- Verificatore PDF passato, esteso per ricalcolare anche le quantità richieste dagli starter correnti e dagli override oltre ai controlli fisici e testuali.
- Rieseguiti `./scripts/build.ps1 -Task Test -Offline` (237 test server e 25 client passati) e `python scripts/check-rules.py` (passato). Nessuna modifica alle meccaniche o alle fonti normative. Restano i limiti di verifica fisica e di avvio completo descritti sopra.
