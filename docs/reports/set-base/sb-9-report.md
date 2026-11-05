# SB-9 — Schede dei personaggi: rapporto

**Chiuso il 6 novembre 2026.** Le schede dei sette personaggi sono approvate dal proprietario, che ha accettato tutte e otto le
raccomandazioni con «Sì, tutte»: [schede dei personaggi](../../design/set-base/schede-personaggi.md). È un documento di progetto,
non normativo: regolamento, carte, server, catalogo, client e protocollo non cambiano.

**Da leggere per primo:** i valori iniziali sono **ipotesi**. Nessuna partita è stata giocata o simulata per questo blocco; li misura
SB-10, e possono cambiare senza tornare dal proprietario solo se la misura lo motiva.

## Cosa è stato scritto

- `docs/design/set-base/schede-personaggi.md`: una scheda per personaggio (chi è, come picchia, risorsa, rischio, valori iniziali,
  triangolo attacco–difesa–contromossa, meccaniche di base usate, direzione delle bound, last resort), due tabelle di confronto, la
  raccomandazione su Q10, le idee fuori perimetro e le decisioni del proprietario.
- Nel [piano](../../set-base-plan.md): stato di SB-9, nomi della tabella «Personaggi», Q6 e Q10 spostate fra le decisioni (D28, D29),
  idee nuove per le espansioni, riferimenti a Q10 aggiornati.
- Nell'[indice](../../README.md): solo la riga «Set Base».

## Cosa si è deciso

| Personaggio | Slot | HEALTH | A | Risorsa | Capacità | Immunità | Rispetto alla fonte |
|---|---|---:|---:|---|---:|---|---|
| Spazienzio de la Ucciso | Base | 100 | 20 | V 25 | 1 | — | R07, invariato: è il metro |
| Mara Contromano | Base | 85 | 40 | — | 2 | — | Bozza; V da 10 a 0 |
| Tossico del Serraglio | Avanzato | 100 | 35 | T 10 | 2 | Periodico di T | R07; capacità da 3 a 2 |
| Pino l'Ultimo Giro | Avanzato | 110 | 15 | L 10 | 2 | — | Bozza; V da 10 a 0, niente immunità a L |
| Gigi del Carro Attrezzi | Avanzato | 100 | 25 | V 15 | 3 | — | Bozza, invariato |
| Cesira la Malalingua | Booster | 90 | 30 | V 10 | 2 | — | Nuovo |
| Rocco «Sant'Incasso» | Booster | 130 | 15 | — (paga in HEALTH) | 2 | — | Nuovo |

Decisioni del proprietario, 6 novembre 2026:

1. **D28 (era Q10):** Pino senza immunità all'effetto periodico di L; la variante immune solo nel playground, in SB-14.
2. Spazienzio invariato rispetto a R07; il Tossico cambia solo la capacità, da 3 a 2.
3. Mara e Pino partono con V 0: due colori puri.
4. **Cesira la Malalingua**, la portinaia che sa tutto; A come risorsa, V come seconda. Nando Malalingua resta di riserva.
5. **Rocco «Sant'Incasso»**, ex pugile delle sagre, HEALTH 130, nessuna risorsa speciale; «più ferito, più forte» va alle espansioni.
6. **D29 (era Q6):** last resort proprie per Pino, Tossico e Sant'Incasso; Struggle per Spazienzio, Mara, Gigi e Malalingua.
7. Bound: una funzione per carta (genera circa 5, colpisce circa 5 o para per il turno); niente che resti sull'avversario, comprese
   le perdite di A; niente oggetti, token, equip o cure. È un'indicazione per SB-10, che misura.
8. Contromosse solo nelle azioni pagate: nessuna bound e nessuna last resort annulla mosse.

Le sette identità non si sovrappongono sul piano risorsa × strategia: con la salute e gli oggetti le risorse diventano sei, e le due
coppie che condividono una risorsa (Mara e Malalingua su A, Spazienzio e Gigi su V) hanno strategie diverse. Nessuna risorsa o parola
chiave nuova (D8): ogni scheda elenca le meccaniche esistenti che usa.

## Cosa resta aperto per SB-10

- **Misurare i valori iniziali** dei sette, in particolare: V 25 di Spazienzio, che gli permette la carta più cara al primo turno;
  la sua capacità 1; A 40 di Mara contro le contromosse; HEALTH 130 di Sant'Incasso, calcolata su circa 30–40 salute spese a partita.
- **Tetto delle bound sulla ripetizione,** con la nota che 5 unità non valgono uguale per ogni risorsa: 5 L diventano 3 a fine turno,
  5 T restano tutti al Tossico immune, 5 A sono moneta e precedenza, 5 HEALTH sono sopravvivenza. Da misurare per prime la
  generatrice di A di Mara e quella di T del Tossico.
- **Carte attuali fuori dalle indicazioni:** PatheticBlade e RottenSmile (lasciano qualcosa sull'avversario), LittleSmack (due funzioni),
  LittleRage (parata che carica, ripetibile). Riprogettarle è compito di SB-10/SB-11/SB-13.
- **Q6 nella griglia:** tre slot di last resort a tema; devono chiudere la partita.
- **Coppie da tenere distinte:** Mara senza contromosse d'archetipo, Gigi senza colpi grossi.
- **Per i blocchi dei personaggi:** combo fra generatrice di T e travaso di T (SB-13); A sotto zero con le carte «abs(A/2)» (SB-14);
  pari per suicidio, partite lunghe, cure che valgono doppio e convenzione sul costo in HEALTH (SB-18); contromosse che i bot
  euristici sottostimano (SB-17).

## Cosa non è stato misurato

- Nessun valore, nessun matchup e nessuna durata: le tabelle nascono dalla lettura del regolamento, della bozza esterna e del dato di
  SB-4 (Bruiser al massimo al 4,6% contro il Junkie euristico), non da partite.
- Gli ordini di precedenza e i «chi lo mette in difficoltà» delle schede sono dedotti, non provati.
- Le schede descrivono direzioni: nessuna carta è progettata, quindi nessun invariante di SB-7 è verificabile.

## Verifiche

- `python scripts/check-rules.py`: regolamento e copia client allineati, 39 carte e 1 token, SQLite integro.
- `./scripts/build.ps1 -Task Test -Offline`: **BUILD SUCCESS**, server 339 test, 0 falliti, 3 saltati (le misure con proprietà `sim.*`);
  client 36 test, 36 passati.
- `TestServerContext` non lanciato: il blocco tocca solo documenti.
