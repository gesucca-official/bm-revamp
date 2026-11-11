# Carriere — specifica degli asset delle scene di dialogo

> Specifica di progetto, senza valore normativo, scritta l'11 novembre 2026 per produrre il materiale vero del [tutorial](tutorial.md)
> prima che la scena di dialogo esista nel client (CA-0, dopo C5). **Va confermata dalla [fetta verticale](prompt-fetta.md):** se la
> composizione di prova mostra che una misura non regge, si corregge qui prima di generare il resto. Cosa serve, scena per scena, è in
> [illustrazioni](illustrazioni.md#tutorial); l'aspetto dei personaggi nell'[identikit](../set-base/identikit.md).

## Come appare la scena

Uno sfondo, **un personaggio alla volta** con la sua espressione, una finestra di dialogo in basso ([regole del formato](README.md#come-si-scrivono-le-scene)).
La scena deve reggere in orizzontale e in verticale (VE della [roadmap del prodotto](../../product-roadmap.md#ve--tavolo-in-verticale)).

| Misura di prova | Orizzontale | Verticale |
|---|---|---|
| Schermo | 1366×768 | 390×844 |
| Finestra di dialogo | fascia in basso, circa il 28% dell'altezza | fascia in basso, circa il 30% dell'altezza |
| Ritratto | a sinistra del centro, alto circa l'85% dello schermo, con la parte bassa dietro la finestra | centrato, alto circa il 60% dello schermo, con la parte bassa dietro la finestra |

## Ritratti

- **Uno per personaggio ed espressione,** generato **modificando l'originale approvato** in `docs/design/set-base/identikit/riferimenti/`,
  così il volto resta lo stesso. Le espressioni sono quelle elencate in [illustrazioni](illustrazioni.md#tutorial).
- **Tela 1024×1536, verticale 2:3.** Mezzo busto: dalla testa, con un margine sopra di circa il 6% dell'altezza, fino alla vita sul bordo
  inferiore. **Occhi a circa un quarto dell'altezza** (y ≈ 370 px), uguale per tutti: è ciò che tiene la stessa scala fra personaggi.
  Personaggi più bassi (Piera) restano con gli occhi alla stessa altezza; cambia la corporatura, non l'inquadratura.
- **Posa:** di tre quarti, rivolto verso chi guarda; braccia e oggetti iconici dentro la tela quando possibile. **Mai specchiare** un
  ritratto: tatuaggi e dettagli sono asimmetrici.
- **Sfondo trasparente** se lo strumento lo consente. Altrimenti fondo piatto uniforme magenta `#FF00FF`, senza ombre né sfumature, e
  scontorno nel registro; se lo scontorno non viene pulito, si tiene il fondo e lo si annota: lo deciderà la fetta verticale.
- **Niente dal naso di Spazienzio** (scelta del proprietario), nessuna scritta, nessun marchio, come negli identikit.

## Sfondi

- **Tela 1536×1024, orizzontale 3:2,** illustrata nello stesso stile dei ritratti (fumetto europeo inchiostrato, R1), senza persone.
- **Zona sicura centrale:** tutto ciò che conta sta nel terzo centrale della larghezza, perché in verticale si vede solo una striscia
  centrale di circa il 30%. I lati sono contorno sacrificabile.
- **Parte bassa tranquilla:** il quarto inferiore finisce sotto la finestra di dialogo, quindi niente dettagli importanti lì. Anche il
  centro dietro il ritratto resta poco affollato.
- **Strati separati** per ciò che cambia fra le scene (la bici di Mara, l'insegna accesa e spenta, il disordine dopo la rissa): stessa
  tela e stessa inquadratura dello sfondo, fondo trasparente o magenta come per i ritratti.
- **Nessuna scritta:** l'insegna di [BAR] e ogni testo li sovrappone il client.

## Figure in ombra

Chi non è un personaggio del gioco (la combriccola) è una sagoma scura uniforme, senza volto, con la stessa tela e le stesse regole dei
ritratti. Le sagome si possono anche disegnare a mano o ricavare da un ritratto: non servono alla fetta verticale.

## File e registro

- **Cartella:** `docs/design/carriere/asset/tutorial/`. Gli originali restituiti dallo strumento in `originali/`, **ignorati da git**;
  il materiale consegnato, tracciato, in `ritratti/` e `sfondi/` come WebP con trasparenza, qualità 90, alla risoluzione piena della tela.
- **Nomi:** `ritratti/<personaggio>-<espressione>.webp` (per esempio `mara-contenta.webp`), `sfondi/<id>-<nome>.webp` (per esempio
  `s2-interno.webp`), strati come `sfondi/<id>-<strato>.webp`; un tentativo successivo aggiunge `-<n>` all'originale.
- **Registro** in `docs/design/carriere/asset/tutorial/registro.md`, una scheda per tentativo, con gli stessi campi del
  [registro degli identikit](../set-base/identikit/registro.md); prompt letterali committati prima di generare (D11 del piano C4).
- **Approvazione:** un asset è materiale vero solo dopo il giudizio del proprietario, scritto nella tabella degli esiti del documento
  dei prompt. Fino ad allora è un candidato.
- **Peso:** WebP qualità 90 a piena risoluzione, indicativamente 150–400 KB a ritratto. I limiti di peso del client si guardano quando
  gli asset entrano nel client, non qui.

## Rischio noto

Il filtro dello strumento integrato ha bloccato due volte Spazienzio a torso nudo ([identikit](../set-base/identikit.md#spazienzio-de-la-ucciso)).
Per le sue espressioni la via di riserva è lo strumento del proprietario (opzione (a) di D11).
