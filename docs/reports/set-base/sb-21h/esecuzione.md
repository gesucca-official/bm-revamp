# SB-21h — Appunti di esecuzione

Diagnosi: D159; codice e bozza sorgente invariati. Baseline verde; vecchio tetto D33/D36 segnala solo PIN-BO1 a 4,35, contro 4. D159 lo sostituisce: exit 1 conservato, nessuna soglia/test alterati.

Sonde: prime copie nulle con ruolo conservato, solo controllo di bias; il confronto D33 usa `nulle-d33.json`, ruolo NONE, SELF, priorità 0 come Listino.nullBound. Budget cumulativo 1.500 s, inclusi i controlli iniziali.

Preesistenze: principale-dialoghi.md e quattro output/pdf lasciati intatti, autorizzazione esplicita del proprietario in questa sessione. Fetch riuscito; main avanti di 9 commit, nessun remoto da integrare. Nessun Java o server di gioco attivo all'avvio; solo runtime Node di Codex. Esecuzione fuori sandbox necessaria per errore del launcher, autorizzata dal revisore automatico.

Ripresa: riserva Sergio r1 (Battutina +1 A) eseguita, Δ(a) +12,8 contro +13,7: resta oltre +10. `probe.py summary` ha prodotto risultati.json, stili.json, sonde-d33.json e confronto-starter.json. Budget totale circa 710 s su 1.500. Senza ×0,75 la durata fra euristici scende da 9,52 a 8,44 turni (SB-21g: 8,70). Bozza, griglia, test e codice invariati.
