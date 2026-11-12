# Carriere — specifica degli asset delle scene di dialogo

> Specifica di progetto, senza valore normativo, scritta l'11 novembre 2026 e corretta lo stesso giorno dopo la fetta verticale (composizione
> generale approvata dal proprietario) per produrre il materiale vero del [tutorial](tutorial.md)
> prima che la scena di dialogo esista nel client (CA-0, dopo C5). **Confermata dalla [fetta verticale](prompt-fetta.md)**, chiusa dal
> proprietario l'11 novembre 2026: vale per il resto delle scene; se una misura non regge, si corregge qui prima di generare. Cosa serve, scena per scena, è in
> [illustrazioni](illustrazioni.md#tutorial); l'aspetto dei personaggi nell'[identikit](../set-base/identikit.md).

## Come appare la scena

Uno sfondo, **al più due personaggi in scena** ognuno con la sua espressione (di solito uno solo: chi parla; due durante gli stacchi di regia
su chi ascolta, sezione «Due in scena» qui sotto), una finestra di dialogo in basso ([regole del formato](README.md#come-si-scrivono-le-scene)).
La scena deve reggere in orizzontale e in verticale (VE della [roadmap del prodotto](../../product-roadmap.md#ve--tavolo-in-verticale)).

| Misura di prova | Orizzontale | Verticale |
|---|---|---|
| Schermo | 1366×768 | 390×844 |
| Finestra di dialogo | in basso, sempre alta due righe più un margine (circa il 15% dell'altezza); corpo del testo circa 31 px | come in orizzontale, circa il 16% dell'altezza pulsanti compresi; corpo circa 21 px; i pulsanti della scena sono l'ultima fila della finestra, alti circa 46 px (almeno 44) |
| Ritratto | a sinistra del centro, alto circa l'85% dello schermo, con la parte bassa dietro la finestra | centrato, alto circa il 75% dello schermo, con la parte bassa dietro la finestra; il cast può alzarlo per personaggio (Spazienzio dell'8% dello schermo) |

Misure corrette l'11 novembre 2026 nella Fase C del [prototipo](prototipo.md#fase-c-ritocchi-dopo-la-prova), dopo la
[prova del proprietario](prototipo-fase-b.md#prova-del-proprietario): prima la finestra era al 28% e al 30% e il ritratto verticale al 60%. Il
corpo del testo si adatta perché una battuta stia in tre righe; le frasi di Piera, più lunghe apposta, mostrano le ultime righe.

Finestra compatta dal 12 novembre 2026, nella [Fase E](prototipo-fase-e.md#finestra-di-dialogo-compatta) del prototipo, su richiesta del
proprietario: non più una fascia fissa ma una finestra alta quanto la battuta, che non cresce mentre il testo scorre (l'altezza la fissa il testo
intero) e non lascia spazio vuoto sotto l'ultima riga. Il corpo del testo arriva al più a 34 px in orizzontale e 24 px in verticale; le battute
tutte maiuscole prendono un corpo più piccolo, perché le maiuscole sono più larghe. In verticale la fila dei pulsanti è dentro la finestra.
Conseguenza per gli asset: con battute brevi si vede più ritratto in basso (fino al bordo della finestra, non più al 20–22%), quindi la parte
bassa dei ritratti, fino alla vita sul bordo inferiore (sezione «Ritratti»), resta spesso in vista e va curata come il volto.

Finestra a due righe dal 12 novembre 2026, nella [Fase F](prototipo-fase-f.md#finestra-a-due-righe-e-pagine) del prototipo, su richiesta del
proprietario («possiamo forzare sempre due righe, così resta della stessa altezza?»): la finestra ha sempre la stessa altezza, due righe, e
non cambia più con la battuta. Il corpo del testo è fisso per orientamento; le battute più lunghe si dividono in **pagine da due righe**,
come nelle visual novel: a fine pagina il testo si ferma con ▼ e un tocco apre la pagina dopo. La divisione segue gli a capo veri del testo
nella finestra, quindi una pagina comincia sempre a inizio parola. Gli stacchi di Piera restano: se uno stacco cade a fine pagina, finito lo
stacco si volta pagina senza un tocco in più. Per gli asset vale quanto sopra: la parte bassa dei ritratti resta spesso in vista.

**Ritratto più in alto in verticale (Fase F):** Spazienzio, inquadrato più da lontano degli altri (sezione «Ritratti»), in verticale sembrava
troppo basso rispetto allo sfondo; il cast lo alza dell'8% dell'altezza dello schermo. Il bordo inferiore del ritratto resta dietro la finestra.

**Due in scena (dal 12 novembre 2026, [Fase J](prototipo-fase-j.md#due-in-scena) del prototipo):** su richiesta del proprietario («perché
dobbiamo far sparire Piera?») il modello «un ritratto per volta» diventa **al più due posti in scena**. Quando arriva uno stacco di regia su
chi ascolta, chi parla non esce: scivola a sinistra, e chi reagisce entra da destra e le resta a fianco finché dura la battuta, poi esce dal
suo lato. Vale per ogni stacco su chi ascolta, non solo per Piera. Chi è a fuoco (chi reagisce durante lo stacco, chi parla quando il testo
riprende) è in piena luce e davanti; l'altro è più scuro e un poco più piccolo, dietro. Si muove solo la bocca di chi parla. In orizzontale i
due stanno a fianco; in verticale si sovrappongono un poco. Si entra e si esce **solo di lato** (niente più entrata «da lontano» né comando
`[Entrate: …]`). Conseguenze per gli asset: **niente specchiature** nemmeno qui (chi ascolta sta a destra con il ritratto così com'è); un
ritratto deve leggersi anche più scuro e in parte coperto dall'altro, quindi il volto non va messo sul bordo della tela; le espressioni di chi
ascolta (`stacco` nel cast) sono quelle che si vedono a fianco di chi parla.

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
- **Nessuna scritta:** l'insegna («BAR IL SERRAGLIO») e ogni testo li sovrappone il client.

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
