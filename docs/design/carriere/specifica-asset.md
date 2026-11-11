# Carriere — specifica degli asset delle scene di dialogo

> Specifica di progetto, senza valore normativo, scritta l'11 novembre 2026 e corretta lo stesso giorno dopo la fetta verticale (composizione
> generale approvata dal proprietario) per produrre il materiale vero del [tutorial](tutorial.md)
> prima che la scena di dialogo esista nel client (CA-0, dopo C5). **Confermata dalla [fetta verticale](prompt-fetta.md)**, chiusa dal
> proprietario l'11 novembre 2026: vale per il resto delle scene; se una misura non regge, si corregge qui prima di generare. Cosa serve, scena per scena, è in
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
- **Personaggi larghi** (Spazienzio): spalle e braccia per intero dentro la tela, con un piccolo margine ai lati, quindi inquadrati un po' più
  da lontano; gli occhi restano a un quarto dell'altezza e il bordo inferiore può scendere sotto la vita. Corretto dopo la fetta
  verticale, dove le braccia erano tagliate e gli occhi al 14%.
- **Le espressioni sono in senso figurato** salvo indicazione contraria: «fumante» è rabbia che bolle, non vapore (proprietario, 11
  novembre 2026). Ogni prompt descrive l'espressione con parole sue, senza affidarsi al nome.
- **Sfondo trasparente** se lo strumento lo consente. Altrimenti fondo piatto uniforme magenta `#FF00FF`, senza ombre né sfumature, e
  scontorno nel registro; se lo scontorno non viene pulito, si tiene il fondo e lo si annota: lo deciderà la fetta verticale.
- **Niente dal naso di Spazienzio** (scelta del proprietario), nessuna scritta, nessun marchio, come negli identikit.

## Sfondi

- **Tela 1536×1024, orizzontale 3:2,** illustrata nello stesso stile dei ritratti (fumetto europeo inchiostrato, R1), senza persone.
- **Zona sicura centrale:** tutto ciò che conta sta nel terzo centrale della larghezza, perché in verticale si vede solo una striscia
  centrale di circa il 30%. I lati sono contorno sacrificabile.
- **Parte bassa tranquilla:** il quarto inferiore finisce sotto la finestra di dialogo, quindi niente dettagli importanti lì. Anche il
  centro dietro il ritratto resta poco affollato.
- **Varianti, non strati,** per ciò che cambia fra le scene (l'insegna spenta, il disordine dopo la rissa): uno sfondo intero ottenuto
  **modificando lo sfondo approvato**, stessa tela e stessa inquadratura, che il client sostituisce o dissolve sopra l'altro. Uno strato
  trasparente generato a parte non si allinea in modo affidabile allo sfondo (corretto l'11 novembre 2026, preparando gli ultimi giri).
- **Oggetti e animali** che entrano ed escono dalla scena (la bici di Mara, Grappino) sono **sprite**: figura intera su fondo trasparente o
  magenta, tela quadrata (1024×1024 di norma; lo strumento può restituire 1254×1254, che va bene lo stesso perché il client scala),
  posati dal client davanti allo sfondo.
- **Nessuna scritta:** l'insegna di [BAR] e ogni testo li sovrappone il client.

## Figure in ombra

Chi non è un personaggio del gioco (la combriccola) è una sagoma scura uniforme, senza volto né dettagli interni, su fondo trasparente o
magenta. Per un gruppo la tela è quella degli sfondi, 1536×1024. **Scala:** le sagome della combriccola generate nel giro C sono più
grandi del previsto (più alte della porta di S1, larghe metà della tela); il client le posa a circa due terzi della dimensione della
tela, con i piedi sul marciapiede, invece di rigenerarle (decisione del proprietario, 11 novembre 2026). Lo stesso vale per ogni sprite: la
scala finale la decide il client.

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
