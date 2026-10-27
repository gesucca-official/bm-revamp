# Client web animato (C1)

Il tavolo del bar approvato in C0, collegato al server reale. Percorso disponibile:
login → partita rapida contro il computer → partita → esito → nuova partita
oppure ritorno all'hub. Le altre modalità e la parità completa del debug
arrivano in C2. La scena C0 resta congelata in
[client-c0/revision](../client-c0/revision/README.md) come evidenza del gate.

Regolamento, server, catalogo SQLite e client debug non sono modificati.

## Avvio locale

Dalla radice del repository, Windows / PowerShell, in due terminali:

```powershell
./scripts/dev.ps1 -Task Server -SeedAccounts
```

```powershell
# Solo la prima volta (Node isolato condiviso con C0, dipendenze separate):
./client-c0/run.ps1 -Task Bootstrap
./client-web/run.ps1 -Task Install
./client-web/run.ps1 -Task Build
./client-web/run.ps1 -Task Serve
```

Aprire `http://127.0.0.1:4320` e accedere con un account sintetico della
[guida locale](../docs/setup.md). `Serve` usa la build di produzione (`vite preview`);
`Dev` avvia il server di sviluppo sulla stessa porta. Entrambi ascoltano solo su
loopback e fanno da proxy come il debug: `/rest` → `/api/rest/v1`, `/ws` →
`/api/ws/v1` su `127.0.0.1:8080` (variabile `BM_SERVER` per cambiarlo).

**Origine STOMP.** Il profilo `local` del server accetta una sola origine
(`stomp.allowedOrigin`, `http://localhost:4200`, quella del debug). Il proxy di
[vite.config.ts](vite.config.ts) presenta quell'origine **solo** per le richieste
che provengono dalla pagina del client stesso (`127.0.0.1:4320` o `localhost:4320`);
ogni altra origine passa invariata e il server continua a rifiutarla. Il server non
è modificato. `BM_STOMP_ORIGIN` cambia il valore se il profilo cambia.

## Gesti

- Scegli una carta e poi il bersaglio sul tavolo (personaggio o carta oggetto),
  oppure trascina la carta direttamente sul bersaglio. La carta presa segue
  il puntatore; su touch resta sopra il dito. ✓ conferma, × o Escape annullano.
- Bound: dopo il bersaglio scegli dalla mano una regolare da scartare.
- Trascina entro la mano per riordinare, oppure «Riordina» e due tocchi; tastiera:
  frecce e Invio. Il riordino è solo locale e non invia nulla.
- ✓ invia **un solo** comando; costi e carte cambiano solo con la vista del server.
  Un rifiuto lascia la scelta sul tavolo per correggerla.
- Dopo ogni turno compare una riga di riepilogo non bloccante; toccandola si apre
  l'ultimo turno con mosse, report ed effetti di fine turno.
- Menu •••: aiuto, ultimo turno, salta effetti, strumenti (Log Card, Log State,
  Log Item, Log JSON, messaggi ricevuti, simula disconnessione), abbandono.

Dopo una disconnessione nessun comando parte da solo: «Rientra» riapre la
connessione con lo stesso account e chiede `resume`; la mossa già accettata resta
in attesa sul server. Landscape obbligatorio: in portrait compare la richiesta
di rotazione.

## Verifiche

```powershell
./client-web/run.ps1 -Task Test     # modello e sessione con trasporto finto
./client-web/run.ps1 -Task Build    # tsc + build di produzione
./client-web/run.ps1 -Task Size     # budget C0 invariato: JS 500 KB, totale 1 MB gzip
./client-web/run.ps1 -Task Verify   # partite reali: richiede server e Serve attivi
```

`Verify` guida il client con Edge (Playwright) contro il server locale: login,
quick 1vCom, partite fino all'esito per entrambi i personaggi, bound con scarto,
bersaglio oggetto, rifiuto, effetto periodico letto dal riepilogo, calata con
drag e con click, riordino senza SEND, disconnessione e rientro senza reinvii,
ritorno all'hub e uscita. `BM_VIEWPORT=844x390` ripete al formato landscape
compatto; `BM_HEADED=1` mostra Edge. Evidenze in
[docs/reports/client-c1](../docs/reports/client-c1/). È un'esecuzione su PC:
non sostituisce il dispositivo fisico né la prova umana.

## Risorse grafiche

`public/art/` contiene copie identiche delle WebP approvate in C0, con il loro
manifest; provenienza e prompt in
[r2-assets](../docs/design/client-c0/r2-assets/README.md). Nessun nuovo asset,
font remoto o audio in C1.

## Confini del codice

- `src/net/`: trasporto. `stomp.ts` (STOMP su SockJS, REST di validazione,
  sottoscrizioni confermate da RECEIPT prima di ogni SEND, nessuna riconnessione
  automatica); `link.ts` è il confine sostituibile nei test.
- `src/session.ts`: flusso applicativo e protocollo. Vista privata come unica
  fonte autorevole; i topic `update` e `move` della partita servono solo a
  richiedere di nuovo la vista; al massimo una richiesta in volo; generazioni
  di connessione per ignorare i callback vecchi; uscita che smette di ascoltare
  la partita prima del leave.
- `src/model.ts`: selezione locale, ordine della mano e comando a cinque campi.
  Nessun effetto delle carte calcolato qui.
- `src/scene.ts`: tavolo Pixi, gesti e animazioni aggregate; non modifica il modello.
- `src/table.tsx`, `src/main.tsx`, `src/ui.tsx`: shell React (accesso, hub,
  tavolo, esito, dialoghi).
- `window.__bm`: stato in sola lettura della pagina per la verifica automatica;
  nessun comando. Da rivalutare prima della consegna C5.
