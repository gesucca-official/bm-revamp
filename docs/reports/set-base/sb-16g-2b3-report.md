# SB-16g — 2b, passo 3: STOP prima dell'attuazione (D82)

14 novembre 2026. Base `5f8c703`. Attuazione della [proposta 1.4](../../design/set-base/sb-16g-proposta.md#passo-3--proposta-corrente-14)
approvata in [D82](../../set-base-plan.md#decisioni-del-proprietario), **fermata prima di toccare bozza, codice o test**: due dei
funzionamenti approvati non si esprimono con i dati e i parametri esistenti del playground senza cambiare classi in `server/src/main`,
fuori dal perimetro del blocco. È il caso previsto dall'ultima riga di «Destino di ciascuna proposta» della 1.4: STOP con proposta,
nessun ampliamento implicito. Nessuna misura: **residuo D68 intatto, 1 giro / 6.340,0406251 s (6.340,041 s)**.

## Cosa sta nei dati e cosa no

Controllo fatto sul caricatore (`Draft`, `DataCards`), sulle classi `java` della bozza, su `PrintedEffects` e su `TurnForecast`.
Nessun file modificato.

| Carta della 1.4 | Esprimibile oggi | Come |
|---|---|---|
| Impatto 30 HIT, Tossicone 18 POISON, Chiave 10 V/22 CUT | sì | numeri di passi dati |
| Ti stringo +20 A, Dose +10 T/+5 A, Un assaggino +20 T | sì | `foundGains` del passo `search` |
| Cinghiata 20 A, 18 + A residua/2 CUT | sì | `amount {base 18, of ALERTNESS, divide 2}`, letto alla risoluzione dopo il costo |
| Preparo, Una stretta: 4 CUT a un avversario, ricerca a sé | sì | `targets: OPPONENT`, `search` in `self`, `damage CUT 4` in `target`; il caricatore vieta `search` solo in `target` |
| Estasi 18 + L spesa | sì | parametro `base` di `base.pino.GoingBerserk` |
| Lavoro 14 + 7 per oggetto, 10 V | sì | parametri `base`/`perItem` di `base.gigi.LavoroFattoBene` |
| Sotto il cofano +5 A | sì | passo `gain` |
| Bancone B, POISON ×0,5 nel turno | sì | secondo passo `status` (`turns: 0`), variante della bozza |
| **Travaso + 12 POISON diretti** | **no** | vedi sotto |
| **Rutto 14 + 2×L spesa, −A uguale, L azzerata** | **no** | vedi sotto |

**Travaso.** `junkie.ToxicBloodDrain` è una classe del catalogo vivo con il solo parametro `turns`. Non può diventare una carta a
dati: i passi non hanno né la rimozione dell'immunità né il timer, e gli effetti su sé si applicano prima di quelli sul bersaglio,
quindi la T letta verrebbe azzerata prima del trasferimento. Il POISON diretto richiede un parametro nuovo nella classe viva, oppure
una classe nuova con un binding nuovo, che cambia il binding nella lista di Celestina e nella ricerca di Un assaggino.

**Rutto.** È una carta a dati. `Amount` vale `base + risorsa/divide`: non ha un moltiplicatore per il «doppio della L». La L
andrebbe letta dopo il costo e azzerata dopo gli effetti sul bersaglio, ma i passi `self` vengono prima e un `empty` in `target`
azzera la risorsa del bersaglio. Due danni separati (14 + L e L) non sono equivalenti: corazza L/4 e troncamento R05 si
applicherebbero due volte. Serve una classe come `base.pino.GoingBerserk`. Per la previsione dei bot serve anche un moltiplicatore
in `PrintedEffects.Step` (oggi `base`, `of`, `divide`, `perItem`), che sta in `model/cards`, fuori dal pacchetto del bot ammesso.

**Classi solo nei sorgenti di test: scartate.** Il profilo `bozza` (`scripts/dev.ps1 -Bozza`) avvia il jar, senza classi di test:
il caricatore rifiuterebbe la bozza («nessuna classe Java») e la prova umana prevista prima di SB-17 non partirebbe.

## Proposta

**Opzione 1, raccomandata: supporto mirato alle due carte, in tre file di `server/src/main`.**

1. Nuova classe del playground `com.gsc.bm.model.cards.base.pino.RuttoADistanzaSociale`, accanto a `GoingBerserk` e
   `LavoroFattoBene` (messe in `main` da SB-8 per il profilo `bozza`). Binding invariato; nella bozza diventa `java: true`, 5 L,
   priorità 1, parametri `base` 14 e `perAlcohol` 2. Memorizza la L dopo il costo; su sé azzera la L; sul bersaglio −A pari alla L
   memorizzata, poi HIT `base + perAlcohol × L`.
2. Parametro `@Tunable poison = 0` in `junkie.ToxicBloodDrain`: dopo il trasferimento il bersaglio subisce `poison` danni da veleno,
   solo se positivo. Col valore 0 la carta viva non cambia; altre classi vive hanno già parametri `@Tunable`. Nella bozza
   `turns` 1, `poison` 12.
3. Campo `times` (default 1) in `PrintedEffects.Step` per la parte variabile (`base + times × risorsa/divide`), letto da
   `TurnForecast`. Il travaso stampa anche il suo POISON quando è positivo.

Cancelli: `liveBenchOnTheSameHistoricalDraft` identico byte per byte alla base, `TurnForecastFidelityTest` senza discrepanze sui
nuovi effetti, mutazioni sulle due classi. Poi il resto della 1.4 nei dati, il passo 0 e il giro come prefissati, senza cambi.

**Opzione 2: supporto generale nei dati** (`times` e lettura a inizio risoluzione in `Amount`, azzeramento dell'autore dopo il
bersaglio, passi per immunità e timer in `DataCards`). Più ampia e utile in futuro, non necessaria ora: non la raccomando.

**Opzione 3: togliere le due modifiche dalla 1.4.** Ridefinisce i bracci, chiede una nuova approvazione e lascia deboli due dei rari
intermedi che D80 metteva fra le priorità: non la raccomando.

## Verifiche

`git fetch` riuscito, `main` avanti su `origin/main`, nessun remoto da integrare; working tree pulito alla partenza.
`python scripts/check-rules.py`, `python scripts/check-links.py` e `git diff --check` verdi su questo commit, che tocca solo
documenti. Non eseguiti, perché nessun codice o dato è cambiato: suite server, contesto Spring, identità viva, fedeltà della
previsione, passo 0 e giro.

## Domande numerate

1. Approvi l'opzione 1, cioè l'estensione del perimetro ai tre file sopra (classe nuova del Rutto, parametro `poison` nella classe
   viva del travaso, campo `times` della previsione), con identità viva 1.13 e fedeltà della previsione come cancelli?
2. Per il travaso, invece del parametro nella classe viva, preferisci una classe del playground con binding nuovo? Titoli e copie
   restano uguali, ma cambiano il binding nella lista di Celestina e la ricerca di Un assaggino.

## Risposta del proprietario

14 novembre 2026, «D'accordo con tutte le tue considerazioni», registrata in
[D84](../../set-base-plan.md#decisioni-del-proprietario): opzione 1 col parametro `poison` nella classe viva del travaso (domanda 2: no
alla classe nuova).
