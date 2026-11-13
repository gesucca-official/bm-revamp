# SB-16g 2b, passo 1 — contratto d50

Versione **1.0**, 13 novembre 2026. Attua D71–D74 del piano per correggere M1–M3,
M5, K1–K2 e B1 della revisione esterna. Governa soltanto il playground d50:
regolamento vivo 1.13 e Set Base 0.1 restano invariati fino a SB-28.

- Il gettone ×1,5 amplifica HIT, CUT e POISON, compreso il veleno periodico.
  Una giocata omonima, anche annullata o parata, soddisfa soltanto il più vecchio
  gettone già esistente prima della mossa; gettone e promemoria cadono dopo tutti
  gli effetti di fine turno. Una ricerca del proprio nome non soddisfa se stessa.
- Se a fine turno il nome non è più né in mano né nel mazzo, il gettone resta
  per tutto il turno successivo, periodici inclusi, poi cade. Lo scarto da solo
  non lo soddisfa. La copia trovata si mostra solo mentre è effettivamente in mano.
- Una ricerca fallita pesca normalmente, dà le risorse ridotte scritte sulla
  carta e non crea gettoni. `search` può scrivere `foundGains` e `missedGains`,
  mappe di risorse non negative: viene applicata solo la mappa del suo esito,
  dopo la ricerca. Senza queste mappe la ricerca conserva i guadagni esterni.
  `turnsIfNotFound` resta leggibile per le vecchie bozze, senza creare gettoni.
- «Ultimo colpo» permette un costo HEALTH superiore alla salute disponibile:
  paga quello che c'è, si ferma a zero e si risolve da terra. Le altre risorse
  devono essere sufficienti. La vista dei bot applica lo stesso controllo.

I cinque caricamenti esistenti conservano guadagni a ricerca riuscita, danni,
priorità, rarità e copie. Ripiego iniziale: circa un terzo arrotondato a 5
(metà verso l'alto): Spazienzio +5 V/+5 A; Mara +5 A; Celestina +5 T;
Piera +5 L/+10 A; Beppe +5 V. Nessuna carta nuova o difesa POISON.

I bot d50 leggono i gettoni e le carte effettivamente scoperte. Le tre politiche
sono «sempre» (gioca il nome alla prima occasione legale dal turno dopo),
«attendi» (lo tiene se il bersaglio ha mostrato DEFENSE/COUNTER nel turno
precedente) e «caso» (moneta con il generatore a seme, una volta per decisione).
Se non possono eseguire la scelta, usano lo stile di base. Preferiscono bersagli
con gettone attivo e proteggono dallo scarto il nome che soddisfa un gettone.
Non leggono mosse pendenti, mano coperta o ordine del mazzo.

Un solo giro di misura in questo passo, contato nel budget D68 (3 giri,
7.200 secondi cumulativi). STOP prima del passo 2, per la prova umana breve.
