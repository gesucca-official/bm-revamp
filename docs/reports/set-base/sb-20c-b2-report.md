# SB-20c — Fase B2, simboli nei testi della bozza

**Resa della bozza verificata.** Matrice del vivo 8/8 verde. Confronto a 750×292 con la base fatto: nessun problema nuovo dovuto a B2. Base `86b6827`, checkout iniziale pulito, `origin/main` contenuto in `main` dopo il fetch.

La fabbrica della bozza fa l'escape del testo prima di aggiungere il paragrafo con la prosa. I paragrafi delle parole chiave conservano il proprio HTML. Ispezione e collezione estraggono la prosa e la rendono come testo React, con i cinque simboli già in uso e i nomi accessibili in italiano. Ogni simbolo va a capo insieme alla propria quantità e alla punteggiatura adiacente. I segnaposto sconosciuti restano leggibili. Il volto Pixi disegna i simboli dei costi e dei riepiloghi.

## Verifiche

| Verifica | Esito |
|---|---|
| Diff, link e regole | `git diff --check` pulito. `check-links.py` zero link rotti e `check-rules.py` verde. |
| `Test -Offline` | Verde, 959 test server (23 saltati) e 37/37 debug. Tre prove nuove verdi per escape nelle due famiglie, riepiloghi e partita deterministica. |
| Riepiloghi | Stessi valori caricati e pubblicati, incluso `inPlay`. Il parser bot legge +6 salute da `+6 H` e `+6 HEALTH`, la lettura nominale del bot e quella di ripiego di Contromossa danno 8 HIT per Maleducazione. In `prova-duccio` contro `prova-sergio`, regole `d50` e seme 7.000.000, coincidono mosse e risorse di ogni turno ed esito. |
| `TestServerContext -Offline` e manifest | Verde, 1.077 test (23 saltati), compresi `BozzaCliTest` e 6/6 in `BozzaProfileOffContextTest`. `verify-match-manifests.py` tutto PASS. |
| Jar, web `Test`, `Build` e `Size` | Jar ricostruito offline. 367 test web verdi, build verde. `Size` con `BM_OUT` entro i limiti, 354.064 byte JS gzip, 1.764.265 byte gzip totali, 27.729.048 byte di texture decodificate. |
| Matrice web del vivo | `Verify` e `VerifyLayout` verdi a 1366×768, 844×390 e 1920×1080. `VerifyDecks` verde a 1366×768 e 844×390. |
| Identità del vivo | Coincidono le descrizioni e i riepiloghi pubblicati per tutte le 37 carte, confrontati per binding perché il server invia un insieme. Coincidono anche i paragrafi DOM della collezione e, per `bruiser.SuperImpact`, l'ispezione e i dati disegnati da Pixi. [Impronte](sb-20c/b2/identita-vivo.json). |
| Base e B2 a 750×292 | Base: `Verify` verde. `VerifyFfa` riproduce R4 e `VerifyLayout` R1 (48 messaggi, `6/6/6` in duello e `11/11/11` in FFA). In `VerifyAim`, il testo della mossa si sovrappone a un posto in due casi dello scenario `pending` già sulla base. B2 (stesso jar `c1c1d5db55130e4a` e stesso `dist`): `Verify` verde, `VerifyFfa` con gli stessi problemi della base, `VerifyAim` verde (i due casi `pending` della base non si ripresentano), `VerifyLayout` con gli stessi `6/6/6` e `11/11/11`. Nel primo lancio di B2 il layout aveva un problema in più (49 contro 48), «chips: status-devAlice-imm-TOXICITY non è nell'ispezione», con l'ispezione aperta sul posto del Computer. Rilanciato una volta il solo layout sullo stesso jar: 47 problemi, nessuno nuovo rispetto alla base, e il problema non si ripresenta. Lo stesso controllo, per lo stesso motivo, è rosso anche sulla base (`status-Computer-imm-TOXICITY`), su un altro posto: dipende da quale posto apre l'ispezione e dai personaggi estratti a caso. Instabilità non dovuta a B2; soglie e attesi invariati. [Confronto](sb-20c/b2/confronto-750.json). |

## Profilo bozza

Edge tramite Playwright, profili `local,bozza` e SQLite temporaneo. Nel primo turno, la sonda dispone nella mano le quattro azioni della collezione ricevuta dal server e sul tavolo l'oggetto, così ogni carta è raggiungibile da tastiera in entrambi i formati. La sonda controlla ordine, nomi accessibili e ingombro dei simboli. Una carta sintetica verifica il testo letterale con segni, token sconosciuti e minuscoli. [Risultati](sb-20c/b2/profilo-bozza.json).

Il riscontro dei cinque nomi accessibili passa sul bundle finale e respinge tre mutazioni nel browser. Le mutazioni omettono Alcol, interpretano Salute come Violenza o sostituiscono i token sconosciuti col simbolo della Violenza. [Esiti](sb-20c/b2/mutazioni-web.json).

| Carta | 1366×768 | 844×390 |
|---|---|---|
| SPA-AR1 | [volto](sb-20c/b2/screens/1366x768-volto-SPA-AR1.jpg) · [ispezione](sb-20c/b2/screens/1366x768-ispezione-SPA-AR1.jpg) · [collezione](sb-20c/b2/screens/1366x768-collezione-SPA-AR1.jpg) | [volto](sb-20c/b2/screens/844x390-volto-SPA-AR1.jpg) · [ispezione](sb-20c/b2/screens/844x390-ispezione-SPA-AR1.jpg) · [collezione](sb-20c/b2/screens/844x390-collezione-SPA-AR1.jpg) |
| CES-AR1 | [volto](sb-20c/b2/screens/1366x768-volto-CES-AR1.jpg) · [ispezione](sb-20c/b2/screens/1366x768-ispezione-CES-AR1.jpg) · [collezione](sb-20c/b2/screens/1366x768-collezione-CES-AR1.jpg) | [volto](sb-20c/b2/screens/844x390-volto-CES-AR1.jpg) · [ispezione](sb-20c/b2/screens/844x390-ispezione-CES-AR1.jpg) · [collezione](sb-20c/b2/screens/844x390-collezione-CES-AR1.jpg) |
| LR-PIN | [volto](sb-20c/b2/screens/1366x768-volto-LR-PIN.jpg) · [ispezione](sb-20c/b2/screens/1366x768-ispezione-LR-PIN.jpg) · [collezione](sb-20c/b2/screens/1366x768-collezione-LR-PIN.jpg) | [volto](sb-20c/b2/screens/844x390-volto-LR-PIN.jpg) · [ispezione](sb-20c/b2/screens/844x390-ispezione-LR-PIN.jpg) · [collezione](sb-20c/b2/screens/844x390-collezione-LR-PIN.jpg) |
| PIN-AR2 | [volto](sb-20c/b2/screens/1366x768-volto-PIN-AR2.jpg) · [ispezione](sb-20c/b2/screens/1366x768-ispezione-PIN-AR2.jpg) · [collezione](sb-20c/b2/screens/1366x768-collezione-PIN-AR2.jpg) | [volto](sb-20c/b2/screens/844x390-volto-PIN-AR2.jpg) · [ispezione](sb-20c/b2/screens/844x390-ispezione-PIN-AR2.jpg) · [collezione](sb-20c/b2/screens/844x390-collezione-PIN-AR2.jpg) |
| OGG-04 | [volto](sb-20c/b2/screens/1366x768-volto-OGG-04.jpg) · [ispezione](sb-20c/b2/screens/1366x768-ispezione-OGG-04.jpg) · [collezione](sb-20c/b2/screens/1366x768-collezione-OGG-04.jpg) | [volto](sb-20c/b2/screens/844x390-volto-OGG-04.jpg) · [ispezione](sb-20c/b2/screens/844x390-ispezione-OGG-04.jpg) · [collezione](sb-20c/b2/screens/844x390-collezione-OGG-04.jpg) |

Controllo a vista dei cinque campioni in entrambi i formati. La prosa è leggibile per intero, con i simboli allineati e nessun segnaposto delle risorse in chiaro. A 844×390 la parte finale delle ispezioni lunghe si raggiunge scorrendo, come mostrano le catture all'apertura di [CES-AR1](sb-20c/b2/screens/844x390-ispezione-inizio-CES-AR1.jpg) e [LR-PIN](sb-20c/b2/screens/844x390-ispezione-inizio-LR-PIN.jpg). Sul volto Pixi compatto di OGG-04 entra una pillola, mentre in ispezione e collezione si vedono entrambe.

Prima di SB-22, valgono l'ordine di D152 ([registro](../../set-base-decisioni.md#decisioni-del-proprietario)) e il blocco separato per la lettura di `12+x` di «L'ultimo giro». Le catture di PIN-AR2 ritraggono la bozza precedente a SB-21e.
