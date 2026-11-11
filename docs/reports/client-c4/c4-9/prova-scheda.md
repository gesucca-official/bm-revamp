# C4-9 — Scheda di prova del proprietario

11 novembre 2026. Scheda per il giudizio del proprietario su **desktop (Edge)**, con una parte **facoltativa su iPhone
(Safari, orizzontale)**, al termine di C4 (sezione C4-9 del [piano C4](../../../client-c4-plan.md#c4-9--consolidamento-e-giudizio-del-proprietario)).
Sul modello della [scheda di C3-7](../../client-c3/c3-7/prova-scheda.md). La parte automatica è nel [rapporto C4-9](../c4-9.md).

Scopo: guardare **tutto C4 insieme**, in una o due partite vere, e dire se la finitura regge. Ogni blocco è già stato approvato
da solo; qui si cerca ciò che stona **messo insieme** o che si è rotto dopo. Le verifiche dicono che i dati sono giusti, non che
siano belli: questo lo giudichi solo tu.

**Fuori da questa prova** (restano a C5, come da piano): la prova umana C, O19 (versione velocizzata) e le osservazioni di ritmo
(durata delle sequenze, tempo per scegliere). Se ne noti una, scrivila con tappa **C5**: non blocca C4.
Il punto 2 di C4-8b (compressione e caricamento mirato) è **rimandato** a quando il client sarà servito fuori dal locale.

## Avvio (prima della sessione)

Dalla radice del repository, Windows / PowerShell. Jar già rifatto in C4-9; se nel frattempo hai fatto un pull con cambi al
server, rifallo: `./scripts/build.ps1 -Task Server -Offline`.

1. **Database dedicato**, per non toccare `server/data`:

   ```powershell
   New-Item -ItemType Directory -Force "$env:TEMP\bm-prova-c4"
   $env:BM_DATABASE_PATH = "$env:TEMP\bm-prova-c4\bm.sqlite"
   ```

2. **Server** nello stesso terminale (porta 8080, account `devAlice` / `local-alice`, `devBob` / `local-bob`):

   ```powershell
   ./scripts/dev.ps1 -Task Server -SeedAccounts
   ```

3. **Client**, in un secondo terminale. Solo desktop: `./client-web/run.ps1 -Task Serve` e `http://127.0.0.1:4320`.
   Con l'iPhone nella stessa Wi-Fi: `./client-web/run.ps1 -Task Physical`, che stampa `http://192.168.x.x:4320/?k=…`
   (stesso indirizzo per tutti i dispositivi; se Windows lo chiede, «Reti private»).
4. **Dopo:** Ctrl+C sui due terminali; `Remove-Item Env:BM_DATABASE_PATH`; la cartella `bm-prova-c4` si può cancellare.

Un account non sta su due dispositivi insieme: `devAlice` sul desktop, `devBob` sull'iPhone.

## Partite (circa 20 minuti su desktop)

| # | Partita | Dove | Voci |
|---|---|---|---|
| P1 | «Contro il computer», fino all'esito, audio acceso | Desktop, finestra grande (1366×768 o più, anche a tutto schermo) | 1–9 |
| P2 | «Tutti contro tutti» con computer fino a cinque posti, 4–5 turni | Desktop | 1, 2, 4, 6, 7 |
| P3 | Una finestra piccola (circa 844×390) per un paio di turni | Desktop | 1, 2 |
| P4 | Hub, «Collezione», editor di un mazzo, profilo, home e crediti | Desktop | 10 |
| P5 | Facoltativa: quick 1vCom e FFA | iPhone orizzontale | 11 |

## Voci da giudicare

**Esito:** ✔ ok · ~ ok con riserve · ✘ non va · — non provato. D = desktop, I = iPhone.

| # | Blocco | Cosa guardare | D | I | Nota |
|---|---|---|---|---|---|
| 1 | C4-2, C4-11 — dimensioni e spazio | Carte, posti, mano e pulsanti non si sovrappongono e non escono; il tuo personaggio più grande; a tutto schermo lo spazio è usato (profondità, ombre), in finestra piccola tutto resta leggibile. ✓ e × sulla carta scelta, divisa a metà. | ☐ | ☐ | |
| 2 | C4-3, C4-4 — simboli e cornici | Simboli di risorse, ruoli e danno chiari e coerenti fra tavolo, catalogo ed editor; cornice per tipologia (personaggio, azione, base, legata, ultima risorsa, oggetto, token) riconoscibile senza leggere. Anche in grigi: [FFA](catture/layout-ffa-T1-grigi-1366x768.jpg), [duello compatto](catture/layout-duel-T1-grigi-844x390.jpg) (regola 11). | ☐ | ☐ | |
| 3 | C4-5a, C4-5a-bis — il bar | Sfondo del tavolo, sottobicchiere, negroni, posacenere: stanno bene, non coprono i posti, gli oggetti propri accanto al personaggio. | ☐ | ☐ | |
| 4 | C4-7, C4-7-bis, C4-7-ter — suoni | Selezione, invio, rifiuto, tonfo del colpo, lama del taglio, jingle di vittoria e sconfitta; volumi fra loro equilibrati; volume e muto nel menu del tavolo, ricordati alla partita dopo. Il gioco si capisce anche a muto. | ☐ | ☐ | |
| 5 | C4-10 — guida visiva | Il richiamo sulla mano quando tocca a te (onda bassa e rapida); il riepilogo del round senza riquadro giallo; lo scarto con ✓ e × sulla carta sollevata. Aiuta senza disturbare? | ☐ | ☐ | |
| 6 | C4-8b — fluidità | Sequenze e tocchi senza scatti evidenti, anche in FFA all'arrivo del turno (dove erano i picchi). | ☐ | ☐ | |
| 7 | C4-8a — accessibilità | Un paio di turni da tastiera (Tab, frecce, Invio, Esc): la mano è la prima fermata, dopo il bersaglio ✓ ha il focus; l'anello a due toni si vede; «Ultimo turno» con la riga «Danno nominale». | ☐ | — | |
| 8 | Insieme — leggibilità del round | Guardando solo il tavolo si capisce chi ha giocato cosa, su chi, con che danno; nulla di C3 si è perso (primi piani, frecce, strisce, «Ultimo turno»). | ☐ | ☐ | |
| 9 | Movimento ridotto | Con «Riduci movimento» del sistema (facoltativo): nessuna sequenza, riepilogo statico e «Ultimo turno» bastano. | ☐ | ☐ | |
| 10 | C4-5b — schermate | Hub, collezione, editor, profilo, home e crediti dei suoni: stesso stile del tavolo, niente stona o è tagliato. | ☐ | ☐ | |
| 11 | iPhone (facoltativo) | Tocco preciso, nessuna mossa inviata per sbaglio, orizzontale che tiene; fluidità accettabile (alla prova dell'11 novembre: «Accettabile ora»). Impact su iOS non è verificato: se il carattere dei titoli cambia, va bene il ripiego (D4). | — | ☐ | |
| 12 | Voce libera | Qualunque cosa bella, brutta, confusa o mancante. | ☐ | ☐ | |

## Osservazioni

**Tappa:** **C4** un difetto di un blocco C4 (da correggere prima di chiudere); **C5** ritmo, playtest, finitura non
bloccante; **Regole** un dubbio sul gioco (solo annotato).

| # | Voce | Dispositivo | Cosa è successo / cosa pensi | Tappa | Note |
|---|---|---|---|---|---|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |

## Giudizio del proprietario

Data, dispositivi, partite giocate, difetti C4 aperti (se ce ne sono C4 resta aperta fino alla correzione e alla riverifica),
osservazioni passate a C5, risposte alle domande del [rapporto](../c4-9.md#domande-al-proprietario) e decisione su C4:

> In attesa.
