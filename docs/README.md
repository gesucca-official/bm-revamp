# Documentazione — indice e stato corrente

Questa pagina è la **fonte principale dello stato del progetto** e classifica
i documenti. Le altre pagine rimandano qui invece di ripetere lo stato.
Il [regolamento](game-rules.md) resta la fonte normativa del gioco e prevale
su codice, test, catalogo e documentazione storica ([istruzioni](../AGENTS.md)).

## Stato corrente

Aggiornato al **6 novembre 2026**.

| Ambito | Stato | Fonte |
|---|---|---|
| Regolamento | Versione **1.11** (6 novembre 2026): rispetto alla base I22 (1.6) aggiunge R07a, ruolo descrittivo e guadagni a sé di ogni carta nel catalogo (O14, 1.7), vieta «/» nell'identificativo dei mazzi personalizzati (R02, 1.8), aggiunge a R07a il danno nominale di ogni carta (A1 del piano C3, 1.9) e il suo importo (A3, 1.10) e stabilisce che ogni personaggio ha tutte e cinque le risorse, a 0 quelle che la scheda non indica (R01, 1.11: corregge il crash di BadTrip, LethalHeroinDose e PervertedMetabolism giocate da Spazienzio; [rapporto](reports/rules-1.11-report.md)); nessun effetto di carta cambiato | [game-rules.md](game-rules.md#r07a--ruoli-descrittivi-delle-carte-17) |
| Versione base | Candidato `I22-3e71300e057687ba` **approvato** dal proprietario il 26 ottobre 2026; roadmap della base conclusa e archiviata | [report I22](reports/i22-report.md#approvazione), [roadmap archiviata](history/roadmap-base-i22.md) |
| Client giocabili | `client-debug/` Angular, completo; `client-web/` animato (PixiJS/TypeScript, React/HTML, Vite) collegato al server, con la parità del debug; CLI per gli scenari automatici | [client-web](../client-web/README.md), [client-debug](../client-debug/README.md), [CLI](cli.md) |
| C0 | **Chiusa** il 27 ottobre 2026, con deroga sulla risposta al tocco (116 ms contro 100) e landscape obbligatorio; scena sintetica congelata in `client-c0/revision/` | [esiti C0-R5](reports/client-c0-r5-procedure.md#esiti) |
| C1 | **Chiusa** il 27 ottobre 2026: login → quick 1vCom → partita → esito → nuova partita sul server reale; iPhone e prova umana A superati | [rapporto C1](reports/client-c1-report.md) |
| C2 | **Chiusa** dal proprietario il 29 ottobre 2026. C2a (leggibilità di base) e O9 (40 illustrazioni provvisorie: 39 carte e il token) chiuse il 27 ottobre dopo una prova del proprietario su iPhone e desktop; C2b-1…C2b-7 fatti, checklist P01–P44 con evidenze o limiti; prova umana B del 29 ottobre senza blocchi | [rapporto C2](reports/client-c2-report.md), [piano C2b (storico)](history/client-c2b-plan.md) |
| C3 | **Chiusa** dal proprietario il 3 novembre 2026, dopo la prova su desktop e iPhone (la prova umana del ritmo resta nella sessione finale C5). Blocchi C3-1…C3-7 più C3-L e C3-4s, con le attività A1 e A3 (tipo e importo del danno nel catalogo, regolamento 1.9 e 1.10) e le decisioni D1–D14. Il round si legge dal tavolo: frecce verso i bersagli ammessi, una carta per volta con tocco che passa alla successiva, costo, primi piani di chi gioca e del bersaglio, impatti per tipo di danno (stella con onda d'urto per il colpo, coltello per il taglio, goccia per il veleno), bersaglio che vibra e si scurisce, volto della carta con tipo e importo del danno, riepilogo per posto e «Ultimo turno». Sequenze fino a 19,7 s (tetto di 20 s), clock tra umani almeno 11 s a fine sequenza: nessun segnale per A2, il clock resta 30 s | [rapporto C3](reports/client-c3-report.md), [piano C3](client-c3-plan.md), [scheda di prova](reports/client-c3/c3-7/prova-scheda.md) |
| C4 (in corso) | **Rifinitura di grafica, audio, layout e prestazioni** ([piano](client-c4-plan.md), [rapporto](reports/client-c4-report.md)). Fatti C4-1 (strumenti) e C4-1b (misura di partenza). **Approvati dal proprietario:** C4-3 (simboli, font Impact e Arial, [inventario degli asset](design/client-c4/assets/README.md)), C4-2 (dimensioni, bersagli da 44 px, ✓ e × sulla carta, tutela di 750×292) e C4-4 (cornici per tipologia e segno del ruolo) il 4 novembre 2026; C4-5a (sfondo, O2 chiusa) e C4-5a-bis (O26 e O27 chiuse) il 5 novembre; C4-5b (coerenza di tutte le schermate, [catture dopo](reports/client-c4/c4-5b/dopo/README.md)) il 6 novembre. C4-6* **saltato** (D1). **Prossimo: C4-7\*** (suoni), poi C4-8a, C4-8b, C4-9 e **C5** (playtest finali, con la prova umana del ritmo). [Decisioni D1–D14](client-c4-plan.md#decisioni-del-proprietario) tutte prese. Le verifiche grafiche fino a C4-5b sono anteriori al regolamento 1.11 (cinque risorse per posto). A C4 arrivano dalle prove di C3 le osservazioni O21 (residui di C3-5 e C3-6), O22 (750×292: solo non regressione, l'adattamento completo passa all'app futura) e O23 (strumenti di verifica); O19 (sequenza velocizzata, attivabile dall'utente) passa a C5; O20 (anomalia della FFA a timeout) resta da valutare a parte dal proprietario. O15 e O16 in un'attività successiva dedicata al deckbuilder; O17 e O18 cambiano regole e protocollo e partono dal regolamento | [piano C4](client-c4-plan.md), [roadmap client](client-roadmap.md#c4-rifinire-grafica-e-uso-su-schermi-diversi), [osservazioni](client-roadmap.md#osservazioni-registrate-durante-c3) |
| Set Base | Avviato in anticipo: **SB-3, SB-4 e SB-5 chiusi** il 5 novembre 2026 (runner senza server e seme; vista limitata e tre stili di bot che battono il casuale, non ancora usati dal server; formato dati provato su 20 carte su 37, nei soli test). **SB-9 chiuso** il 6 novembre 2026: schede dei sette personaggi approvate, valori iniziali da misurare in SB-10. Con D30 SB-6 si divide e l'ordine è SB-9 → SB-6a → SB-7 → SB-7b → SB-10a → SB-10b senza aspettare il client (SB-7b, bot e costo in HEALTH, aggiunto da D31; **fatto e approvato** il 6 novembre 2026: zero morti pagando, partite di oggi invariate); SB-1, SB-2 e SB-6b restano legati al client e vanno chiusi prima di SB-8. **SB-6a fatto** il 6 novembre 2026 e **approvato dal proprietario** lo stesso giorno («sb6a dovrebbe aver fatto, procediamo?»): playground con bozza in file, numeri delle carte Java come parametri, identità col set di oggi provata. **SB-7 fatto e approvato** il 6 novembre 2026 («Approvo entrambi», insieme a SB-7b): banco di misura con matrice dei matchup e intervalli di Wilson, otto invarianti e tetto delle bound provati su bozze costruite per violarli, ricerca dei mazzi per mutazione, rapporto riproducibile byte per byte; prima fotografia con dati di prova. Con D32 SB-10 si divide in SB-10a (listino di potenza e tetto delle bound, misure; prossimo) e SB-10b (griglia degli slot) | [piano](set-base-plan.md), [rapporto SB-3](reports/set-base/sb-3-report.md), [rapporto SB-4](reports/set-base/sb-4-report.md), [rapporto SB-5](reports/set-base/sb-5-report.md), [schede dei personaggi](design/set-base/schede-personaggi.md), [rapporto SB-9](reports/set-base/sb-9-report.md), [rapporto SB-6a](reports/set-base/sb-6a-report.md), [rapporto SB-7](reports/set-base/sb-7-report.md), [rapporto SB-7b](reports/set-base/sb-7b-report.md) |
| Pubblicazione | Sorgenti preparati per GitHub; nessun deploy o hosting | [pubblicazione](publishing.md) |

Gli effetti delle carte non sono cambiati dal lavoro C0–C3; il regolamento è alla
1.11: la 1.7 aggiunge ruolo e guadagni, la 1.9 il danno nominale (A1 del piano C3) e la 1.10 il suo importo (A3),
tutti campi descrittivi del catalogo esposti dal server e copiati nelle regole del
debug; la 1.8 vieta «/» nell'identificativo dei mazzi personalizzati (R02); la 1.11 fa partire da 0 le risorse
che la scheda di un personaggio non indica (R01), così le viste mostrano le cinque risorse dal primo turno. I conteggi dei test sono nei rapporti
della relativa consegna. Le numerazioni I01–I26 e F01–F39 appartengono alla
base e non vengono riaperte dalle tappe C0–C5.

## Istruzioni operative

Documenti da seguire per lavorare sul progetto nello stato attuale.

| Documento | Contenuto |
|---|---|
| [README del monorepo](../README.md) | Struttura, avvio rapido, conservazione delle cronologie |
| [AGENTS.md](../AGENTS.md), [CONTRIBUTING.md](../CONTRIBUTING.md) | Regole di modifica e **verifiche obbligatorie** (fonte unica dei comandi di verifica) |
| [Orchestrazione del lavoro](orchestrazione-lavoro.md) | Metodo, non stato: ruoli, prompt per gli esecutori, proposta di modello e sforzo, revisione delle relazioni, insidie delle verifiche, coordinamento |
| [Guida locale](setup.md) | Installazione, avvio, dati locali, verifiche e candidato I22 |
| [CLI](cli.md) | Client testuale per scenari applicativi |
| [Regolamento 1.10](game-rules.md) | Fonte normativa; la copia client è controllata da `scripts/check-rules.py` |
| [Decisioni del proprietario](open-questions.md) | Decisioni Q/R recepite; le note datate sono storiche |
| [Archivio partite](match-archive.md) | Contratto corrente di journal, export e chiusura al riavvio |
| [Pubblicazione](publishing.md) | Identità Git, contenuti esclusi, verifiche GitHub |
| [Scena C0](../client-c0/revision/README.md) | Avvio e verifiche della scena Pixi/React del tavolo del bar |
| [Server](../server/README.md), [client-debug](../client-debug/README.md), [stampa carte](../tools/print-cards/README.md) | Note dei singoli componenti |

## Roadmap e attività future

| Documento | Contenuto |
|---|---|
| [Indice delle roadmap](roadmap.md) | Roadmap attiva e archiviata |
| [Roadmap del client web animato](client-roadmap.md) | Tappe C0–C5 (C0–C3 chiuse), criteri di C4–C5, osservazioni O1–O27, decisioni aperte; [revisioni](history/client-roadmap-revisions.md) |
| [Rapporto C3](reports/client-c3-report.md) | C3-1: modello della risoluzione, viste reali registrate, K1–K6 misurati; C3-2: sequenza affidabile e riepilogo statico; revisione di C3-2 (una carta per volta, D12); C3-3: frecce verso i bersagli ammessi; C3-4 e revisione D13; C3-L: scala e spazio del tavolo; C3-4s: rifinitura delle animazioni e difetto delle (i); C3-6: riepilogo e «Ultimo turno» leggibili; C3-5: volto della carta ed effetti per tipo di danno; C3-7: consolidamento; evidenze [C3-1](reports/client-c3/c3-1/), [C3-2](reports/client-c3/c3-2/), [revisione](reports/client-c3/c3-2r/), [C3-3](reports/client-c3/c3-3/), [C3-4](reports/client-c3/c3-4/), [C3-4r](reports/client-c3/c3-4r/), [C3-L](reports/client-c3/c3-l/), [C3-4s](reports/client-c3/c3-4s/), [C3-6](reports/client-c3/c3-6/), [C3-5](reports/client-c3/c3-5/), [C3-7](reports/client-c3/c3-7/) |
| [Piano C3](client-c3-plan.md) | Risoluzione osservabile (C3 chiusa): dati del server verificati, difetti K1–K6, blocchi C3-1…C3-7, regole di non-regressione, decisioni D1–D14 (D1 riaperta dopo la prova di C3-2), blocchi C3-L e C3-4s, attività A1 e A3; [evidenze dell'osservazione](reports/client-c3/c3-plan/) |
| [Piano C4](client-c4-plan.md) | Grafica e uso su schermi diversi: stato misurato (fatti C4-1…C4-5b, approvati dal proprietario da C4-3 a C4-5b; C4-6* saltato; prossimo C4-7*), blocchi C4-1…C4-9, regole di non regressione 1–18, decisioni D1–D14 tutte prese |
| [Piano Set Base](set-base-plan.md) | Dal set provvisorio a circa 115 carte bilanciate: regole dei mazzi, separazione fra regolamento e set, runner, bot e playground, testi per i giocatori, illustrazioni, blocchi SB-1…SB-33, criteri di bilanciamento, decisioni; [bozza esterna di carte](design/set-base/bozza-esterna-proposta-70-carte.md) come serbatoio di idee. Parte a client web completato |
| [Checklist di parità P01–P44](client-c0-parity.md) | Funzioni del debug da portare nel nuovo client (C1–C2) |
| [Contratto delle interazioni](design/client-c0/interaction-contract.md), [revisione del tavolo del bar](design/client-c0/bar-table-revision.md) | Composizione dei comandi e criteri UX accettati per C1 |
| [Riferimento visivo R1](design/client-c0/r1/approval.md), [tecnologia](design/client-c0/r1/technology.md) | Mockup approvati e motivazione dello stack |
| [IDEAS.md](../IDEAS.md) | Idee non pianificate, non requisiti |

## Riferimenti tecnici con parti storiche

Questi documenti hanno in testa una sintesi corrente; le sezioni datate sotto
sono ricognizioni o diagnosi del loro momento e **non** descrivono lacune aperte.

[API](api.md) · [architettura](architecture.md) · [modello dati](data-model.md) ·
[modello di dominio](domain-model.md) · [conformità alle regole](rules-conformance.md) ·
[inventario feature](feature-inventory.md) · [debito tecnico](technical-debt.md) ·
[stato implementazione](implementation-status.md) · [ricognizione iniziale](overview.md)

## Rapporti, decisioni ed evidenze storiche

I rapporti documentano ciò che era vero alla loro data; i numeri dei test e gli
stati «aperto/prossimo» in essi non sono attività correnti. Non vanno riscritti
per adeguarli a modifiche successive. Manifest e PDF I22 sono una base storica.

| Gruppo | Documenti |
|---|---|
| Base I01–I26 | [rapporti in reports/](reports/), dal [rapporto I01](reports/i01-report.md) al [rapporto I22](reports/i22-report.md); [verifiche iniziali](reports/verification-report.md); [audit del regolamento](reports/game-rules-audit-2026-10-23.md) |
| Client C0 | [primo rapporto, grafica Angular respinta](reports/client-c0-report.md) e [laboratorio Angular](../client-c0/README.md); [rapporto R2–R5](reports/client-c0-r2-report.md); [procedura ed esiti R5](reports/client-c0-r5-procedure.md); [prima proposta visiva](design/client-c0/README.md) |
| Stampa carte | [verifica del generatore, 25 ottobre 2026](../tools/print-cards/VERIFICATION.md) |
| Archivio in history/ | [roadmap della base I22](history/roadmap-base-i22.md), [setup precedente a I22](history/setup-pre-i22.md), [ricognizione preparatoria della roadmap client](history/client-roadmap-preparation.md), [punto di ripresa C0-R2–R5](history/client-c0-resume.md), [piano C2b](history/client-c2b-plan.md), [revisioni 1–20 della roadmap client](history/client-roadmap-revisions.md) |

Nei rapporti i collegamenti ai sorgenti puntano ai percorsi correnti `server/`
e `client-debug/` (prima `bm-server/` e `bm-web-client/`); i file rimossi in
seguito, come il prototipo Phaser, sono citati senza collegamento. Le evidenze
JSON conservano i percorsi del momento in cui sono state prodotte.
