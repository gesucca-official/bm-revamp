# O27 — Confronto delle alternative

**Documento della fase A, precedente alla scelta.** Il proprietario ha poi scelto A con passo pieno prima del ripiego 0,75; ha escluso C e ogni combinazione con C, segnalando la copertura della scritta nella cattura grande. [Decisione e fase B](../../c4-5a-bis.md#c4-5a-bis). Queste catture non rappresentano la build definitiva della fase B.

5 novembre 2026. Solo proposta: **nessuna modifica definitiva al layout**. Tre partite open 1vCom reali sul database temporaneo, mazzi salvati tramite editor con Junkie, due legate, Glare, Struggle e 1–3 Tennent’s Super. Due mosse reali (Glare e Struggle), poi confronto di tutte le alternative sulla stessa vista al turno 2, con il numero di oggetti controllato. 1920×1080 serve solo al confronto visivo.

**Raccomandazione: A**, lato destro solo quando entra tutta la riga, mantenendo pile e carte del round nelle posizioni di C3-L. B peggiora il compatto; C è una valida alternativa se preferisci spostare il posacenere decorativo e liberarlo anche con tre oggetti sul grande.

Le prime catture sono state scartate: una navigazione al solo hash lasciava in memoria la build precedente. Nel giro finale la navigazione ricarica il documento, l’anteprima propria viene riavviata a ogni variante e un identificatore osservabile della build è controllato prima di ogni cattura. Nessuna immagine del giro scartato è pubblicata qui.

## 1366x768

| Oggetti propri | A — lato destro se libero | B — riga oltre posacenere | C — solo sprite |
|---|---|---|---|
| 1 | [A](o27-a-1-1366x768.jpg) | [B](o27-b-1-1366x768.jpg) | [C](o27-c-1-1366x768.jpg) |
| 2 | [A](o27-a-2-1366x768.jpg) | [B](o27-b-2-1366x768.jpg) | [C](o27-c-2-1366x768.jpg) |
| 3 | [A](o27-a-3-1366x768.jpg) | [B](o27-b-3-1366x768.jpg) | [C](o27-c-3-1366x768.jpg) |

## 844x390

| Oggetti propri | A — lato destro se libero | B — riga oltre posacenere | C — solo sprite |
|---|---|---|---|
| 1 | [A](o27-a-1-844x390.jpg) | [B](o27-b-1-844x390.jpg) | [C](o27-c-1-844x390.jpg) |
| 2 | [A](o27-a-2-844x390.jpg) | [B](o27-b-2-844x390.jpg) | [C](o27-c-2-844x390.jpg) |
| 3 | [A](o27-a-3-844x390.jpg) | [B](o27-b-3-844x390.jpg) | [C](o27-c-3-844x390.jpg) |

## 1920x1080

| Oggetti propri | A — lato destro se libero | B — riga oltre posacenere | C — solo sprite |
|---|---|---|---|
| 1 | [A](o27-a-1-1920x1080.jpg) | [B](o27-b-1-1920x1080.jpg) | [C](o27-c-1-1920x1080.jpg) |
| 2 | [A](o27-a-2-1920x1080.jpg) | [B](o27-b-2-1920x1080.jpg) | [C](o27-c-2-1920x1080.jpg) |
| 3 | [A](o27-a-3-1920x1080.jpg) | [B](o27-b-3-1920x1080.jpg) | [C](o27-c-3-1920x1080.jpg) |

## Geometria e limiti

| Alternativa | layoutProblems reali alle tre misure | fitScale | Round e pile |
|---|---|---|---|
| A | 0 con 1–3 oggetti | invariato | box identici alla base |
| B | 0 sul desktop e grande; a 844: 0/1/2 con 1/2/3 oggetti | a 844 cala da (1,5;1;1;1,1) a (1;1;1;1) | collisioni con pile/zone riservate; con 3 oggetti mancano le carte del round |
| C | 0 con 1–3 oggetti | invariato | tutta la geometria di gioco identica |

Ordine fattori: proprio, altri, oggetti, risorse. Le carte del round sono realmente presenti nelle catture dove il layout trova spazio. Il rientro ricostruisce la pila locale dai dati dell’ultima vista; il confronto delle pile riguarda i box e il conteggio del mazzo, non la conservazione dello storico locale del fronte scartato attraverso il ricaricamento.

**A:** riga a destra con passo 0,75 della larghezza dell’oggetto, come FFA; si sposta soltanto se tutti i box sono interamente nello schermo e, espansi di 8 px su ogni lato, non intersecano il box conservativo della mano di sette carte, compresa l’alzata. Quel box ha larghezza `hand.w*hand.zoom+6*hand.step`, alto da `hand.y-hand.lift-hand.h*hand.zoom/2` a `hand.y+hand.h/2`. Nessuna soglia arbitraria di larghezza. Le pile mantengono la quota della riga superiore originaria. Nelle catture, a 1920×1080 entrano uno o due oggetti; tre restano sopra. A 1366×768 e 844×390 resta tutto sopra. Due oggetti si coprono parzialmente come in FFA: l’interazione al primo tocco andrà verificata nella fase B.

**B:** inizio riga dopo `130*W/2006 + (298*973/844)*sqrt((W/2006)*(H/784))/2 + 8`, cioè bordo destro dell’intero sprite più 8 px, dai dati di background.ts e dalla texture 973×844. Libera il posacenere sul desktop, ma la versione incondizionata provata viola la regola 17 sul compatto e non è raccomandata.

**C:** conserva tutto il gioco e sposta soltanto posacenere e ombra, a scala invariata, nel più vicino spazio libero che contenga il suo intero box con margine di 8 px, evitando posti, mano, pile, round, marchio e altri sprite; se manca, conserva la posizione originale. Nel campione trova posto solo sul grande, circa (205;275) anziché (124;413), per tutti e tre i conteggi. Alle due misure ufficiali non cambia.

**Sonda pura supplementare**, distinta dalle partite: 1366×768, 844×390, 750×292 e 1920×1080, 2/5 posti, 1–3 oggetti per posto. A e C: nessun fattore cala, nessun aumento dei layoutProblems, mano/pile/round identici alla base; tutti i box FFA identici per A, B e C. Per B tre cali dei fattori e tre aumenti dei problemi nella matrice; non sono attesi accettati. [Dati delle scene reali](proposal.json), [sonda](probe.json), diffs dei soli prototipi [A](prototype-a.diff), [B](prototype-b.diff), [C](prototype-c.diff).

**Osservazioni visive:** A sfrutta il vuoto del grande senza cambiare il centro; con due oggetti il primo è parzialmente coperto. B rende più visibile il posacenere anche sul desktop, ma rimpicciolisce troppo i personaggi nel compatto e fa sparire il round con tre oggetti. C rende visibile tutto il posacenere sul grande, cambiando però l’appoggio decorativo già approvato in O2. Non è una misura di contrasto o una prova su telefono.

**Arresto alla fase A.** Attendo la scelta del proprietario; solo dopo seguiranno funzione pura definitiva, test dell’intera matrice e regressione sulla build finale. Le sonde dei prototipi non equivalgono alla verifica finale di fase B. Nessun push.
