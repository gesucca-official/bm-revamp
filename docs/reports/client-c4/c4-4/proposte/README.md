# C4-4, proposte di cornice e segno del ruolo

Materiale della fase 1, per la scelta del proprietario. Nessun codice di
produzione è cambiato: le varianti girano in una copia del client fuori dal
repository e sono disegnate dalla scena reale, su partite reali contro il server
locale, a 1366×768 e 844×390.

| Variante | Cornice | Segno del ruolo |
|---|---|---|
| `v0` | oggi, per confronto | pastiglia di oggi |
| `v1` Filetto | cambia il filetto nel margine di 4 px | linguetta che esce dalla cornice |
| `v2` Angoli e fregio | angoli e piccolo fregio, filetto di oggi | gagliardetto a coda di rondine |
| `v3` Sagoma | cambia il contorno esterno, nel margine libero | sigillo tondo con fascia |

In tutte la carta regolare (26 su 37) resta identica a oggi. Il token mostra
«OGGETTO TOKEN» e «TOKEN» al posto di «OGGETTO».

**Scelta del proprietario: V1, spessore medio.** Di V2 e V3 restano qui i fogli e il catalogo: partite e altre catture sono state tolte dopo la scelta, per restare nei circa 10 MB del blocco (D13). I nomi di file citati sotto che non si trovano sono fra quelli.

## Da guardare per prime

- `confronto-36px-844x390.jpg`: le carte da 36 px, pixel reali ingranditi ×2, a
  colori e in grigi, per tutte le versioni.
- `fogli-mano-v<N>-<misura>.jpg`: una carta per tipologia in misura mano, sul
  tavolo vero. Ci sono anche il caso senza ruolo, il tipo ignoto e il dorso.
- `fogli-mano-grigi-v<N>-<misura>.jpg`: gli stessi fogli in grigi.
- `duello-v<N>-<misura>.jpg` e `ffa-v<N>-<misura>.jpg`: partite reali dopo un round.

## Altre catture

- `fogli-piccole-*`: carte del round e oggetti alla misura reale. Fissano le carte
  del round alla misura minima (36×50 a 844×390, 70×97 a 1366×768), uguale per
  tutte le versioni.
- `catalogo-*`, `editor-*`: guscio HTML con la stessa cornice attorno alla miniatura.
- `duello-grigi-*`, `ffa-grigi-*`: partite reali in grigi, solo a 844×390.

## Misure del prototipo

Le misure vengono da un solo giro: il costo di disegno è indicativo.

| Controllo | Oggi | V1 | V2 | V3 |
|---|---|---|---|---|
| Disegno in FFA a 5, 844×390 (ms) | 3,5–4,0 | 4,0–4,5 | 4,4–5,3 | 4,3–4,7 |
| Disegno in FFA a 5, 1366×768 (ms) | 5,4–6,3 | 4,3–5,0 | 5,4–6,3 | 5,6–7,0 |
| Facce diverse da oggi (costo, danno, testo; 37 carte, 2 modi, 2 misure) | n/d | 0 | 0 | 0 |
| Errori di pagina | 0 | 0 | 0 | 0 |

## Non verificato

Il prototipo non ha test né misure di `layoutProblems`, non è stato provato a
750×292, su iPhone o su Safari. Quelle verifiche appartengono alla fase 2.

## Spessori della V1

Il proprietario ha scelto la V1 chiedendo un filetto più evidente. I file
`*-v1-medio-*` e `*-v1-pieno-*` mostrano due spessori, a confronto con oggi e con
la prima proposta in `confronto-spessori-36px-844x390.jpg`.

- Medio: fascia di circa 3 px. Pieno: circa 4 px. Il margine libero è di 5 px.
- La carta regolare resta identica a oggi.
- Il personaggio passa a una fascia oro con filo scuro, perché la fascia scura si
  confondeva col tavolo.
- Legata, token e neutra hanno tratti diversi, con spazi che restano aperti a 36 px.
- Costo, danno e testo delle facce restano uguali a oggi in entrambi gli spessori.
