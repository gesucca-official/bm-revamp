# Client del Set Base — `restOn` robusto (consegna 2, rosso R6)

Blocco piccolo del 19 novembre 2026 ([D103](../../set-base-decisioni.md#decisioni-del-proprietario) (1)). Solo `restOn` dello
strumento `VerifyResolution`; niente server, regole, documenti del set, bozza o `readability.ts`. Nessun push.

## Esito

**Fatto e verificato per la parte dello strumento.** `restOn` non cade più quando il pulsante (i) è già sparito; il rosso R6 non si
ripresenta in 5 giri su 5. Il Fix 1 (lettura di «12+x» per «L'ultimo giro») è **rimandato**, sotto.

## Cosa cambia

- [verify-resolution.mjs](../../../client-web/tools/verify-resolution.mjs): `restOn` leggeva l'etichetta del pulsante (i) e ne
  chiedeva il riquadro (`boundingBox()`) senza controllare il risultato: nella corsa voluta col clic su ✓ («to the (i) right after ✓,
  mouse only») la vista con la mossa in attesa può aver già tolto il pulsante, il riquadro è `null` e `b.x` lancia `TypeError`.
  Ora il riquadro si chiede con un'attesa di 300 ms (`boxOf`); se manca (`null` o `TimeoutError`) il puntatore non si muove e
  `restOn` restituisce comunque l'etichetta vista: è un esito della corsa. Ogni altro errore di Playwright viene rilanciato e fa fallire.
- [orchestrazione-lavoro.md](../../orchestrazione-lavoro.md): tolta la consegna 2 («`restOn` robusto») da quelle aperte.
- [rossi-noti.md](../rossi-noti.md): R6 spostato fra le chiuse.

## Prove

Jar rifatto (`./scripts/build.ps1 -Task Server -Offline`, `BUILD SUCCESS`), `Serve` attivo.

| Verifica | Esito |
|---|---|
| `./client-web/run.ps1 -Task Test` | 367 test, 367 verdi |
| `-Task Build` | exit 0 (solo l'avviso già noto sui chunk oltre 500 kB) |
| `-Task Size` (con `BM_OUT`) | `limitsPass` e `ceilingsPass` veri; JS 354064 B gzip, texture 27729048 B (82,6% del tetto C4) |
| `VerifyResolution`, scenario `info`, 1366×768, 5 giri | 5 su 5 exit 0; 13 round dell'azione «to the (i) right after ✓, mouse only» (2, 3, 3, 2, 3), 0 `TypeError`, 0 partite perse |

Il rosso R6 era intermittente (2 giri su 5 sul codice di SB-16i): 5 verdi su 5 ora sono coerenti con la correzione, ma da soli non la
dimostrano. Non ho rilanciato la base (`restOn` vecchio) per confronto in questo blocco. Gli altri casi di `casesOnRealServer` risultano
«missing» perché lo scenario `info` da solo non li gioca (`BM_SCENARIOS=info`): non è un esito del blocco. Ho provato a 1366×768 e
non a 844×390; la modifica non tocca `src` né il tavolo.

## Fix 1 rimandato

La lettura di «12+x» di «L'ultimo giro» (Piera) non è in questo blocco. `damageText` e `damageReport` in
[readability.ts](../../../client-web/src/readability.ts) leggono ogni `+x` come metà della V residua di chi gioca; la carta somma la L
spesa. Il client però riceve solo `damageAmount`, una stringa come `"HIT 12+x"`
([contracts.ts](../../../client-web/src/contracts.ts)): **non dice a quale risorsa si riferisce la x né con che moltiplicatore**. La
risorsa compare solo nel testo libero della descrizione («12 HIT al bersaglio, più la [[L]] spesa»). Leggerla da lì o tenere una mappa
per nome di carta sarebbe fragile, e non è stato fatto.

Il difetto non è solo di Piera: le altre carte con `+x` hanno regole diverse (Estasi da Coca Etilene e Rutto a distanza sociale
sommano il doppio della L spesa; Cinghiata di traverso e Malelingue metà dell'A residua; Lavoro fatto bene 4 per ogni oggetto sul
campo) e oggi il client le legge tutte come metà della V.

**Cosa dovrebbe mandare il server**, a scelta della regia: la risorsa e il moltiplicatore dentro la quantità (per esempio
`"HIT 12+L"`, `"HIT 10+2L"`, `"CUT 18+A/2"`), oppure un campo dedicato accanto a `damageAmount` (risorsa, divisore o moltiplicatore;
una forma per «per ogni oggetto»), facoltativo come gli altri campi descrittivi. File coinvolti, senza averli cambiati:

- il catalogo con la bozza, `server/src/test/resources/set-base/bozza.json` (campo `gui.damageAmount`) e il catalogo vivo;
- [Draft.java](../../../server/src/main/java/com/gsc/bm/sim/Draft.java) (lettura di `gui`) e
  [CardsGuiRecord.java](../../../server/src/main/java/com/gsc/bm/repo/internal/CardsGuiRecord.java),
  [CardFactoryServiceImpl.java](../../../server/src/main/java/com/gsc/bm/service/factories/CardFactoryServiceImpl.java),
  [AbstractCard.java](../../../server/src/main/java/com/gsc/bm/model/cards/AbstractCard.java) (il campo fino alla vista);
- [PrintedEffects.java](../../../server/src/main/java/com/gsc/bm/model/cards/PrintedEffects.java) e
  [BotView.java](../../../server/src/main/java/com/gsc/bm/model/game/bot/BotView.java), che leggono `damageAmount` e non devono
  rompersi con una forma nuova;
- [api.md](../../api.md) per il contratto;
- poi, nel client, `contracts.ts` e `readability.ts` (`damageOf`, `damageText`, `damageReport`) e i test di
  `client-web/tests/impact.test.ts` e `resolution.test.ts`.

Un cambio dei dati di una carta passa dal documento del set e dalla regia (AGENTS.md): è una decisione loro, non di un esecutore.
