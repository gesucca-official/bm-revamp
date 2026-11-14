# SB-16g 2b, passo 1 — contratto d50

Versione **1.1**, 14 novembre 2026. Motivazione: aggiungere la parola «Annuncia X»
approvata nella proposta 1.3 (D78–D79), senza cambiare il comportamento d50 1.0.
La versione 1.0 del 13 novembre 2026 attua D71–D74 del piano per correggere M1–M3,
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

## Annuncia X (D78–D79)

**Annuncia X:** al posto della pesca che segue questa mossa, cerca nel tuo mazzo
una carta di nome X, identificata da un solo binding esatto; non può essere un oggetto.

- **Se la trovi:** mettila in mano e mostra quella copia a tutti; applica soltanto
  i guadagni «Se lo trovi», dopo la ricerca. Metti su di te un gettone legato al nome X:
  HIT, CUT e POISON ricevuti sono moltiplicati per **1,5**, compreso il POISON periodico.
  La copia si mostra soltanto mentre è in mano e il suo gettone esiste; dopo lo scarto
  resta soltanto il segnalino col nome.
- **Quando giochi X:** qualsiasi copia omonima, anche parata o annullata, soddisfa
  soltanto il gettone più vecchio per X già esistente prima della mossa. Gettone e
  promemoria spariscono dopo tutti gli effetti di fine turno, periodici inclusi.
  La vulnerabilità resta contro ogni gruppo di velocità nel turno della giocata.
  Una ricerca del proprio nome non soddisfa il gettone che crea; giocare un'altra
  omonima può togliere il promemoria della copia trovata ancora in mano.
- **Se X esce senza essere giocata:** lo scarto da solo non soddisfa il gettone.
  Se a fine turno N il nome manca da mano e mazzo, il gettone resta per tutto N+1,
  periodici inclusi, poi cade. Finché una copia resta in una delle due zone non ha timer.
- **Se non la trovi:** pesca normalmente e applica soltanto i guadagni «Se non lo trovi»;
  nessun nuovo gettone o carta mostrata. Il ripiego sostituisce il premio pieno,
  non si somma e non rimuove gettoni già presenti.
- **Più annunci:** gettoni indipendenti, fattori moltiplicati (due ×1,5 danno ×2,25
  prima dei troncamenti R05), senza fusione o tetto speciale; una giocata ne soddisfa
  uno solo. A fine partita, eliminazione e forfait si tolgono gettoni e promemoria.

Forma breve: «Annuncia X. Se lo trovi: … . Se non lo trovi: …».
Carte e composizioni del passo 2 sono quelle della [proposta 1.3](sb-16g-proposta.md)
approvata in D79; potenza e difesa POISON restano al passo 3.

## Riferimento storico: passo 1 (versione 1.0)

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
