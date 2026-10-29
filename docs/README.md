# Documentazione — indice e stato corrente

Questa pagina è la **fonte principale dello stato del progetto** e classifica
i documenti. Le altre pagine rimandano qui invece di ripetere lo stato.
Il [regolamento](game-rules.md) resta la fonte normativa del gioco e prevale
su codice, test, catalogo e documentazione storica ([istruzioni](../AGENTS.md)).

## Stato corrente

Aggiornato al **29 ottobre 2026**.

| Ambito | Stato | Fonte |
|---|---|---|
| Regolamento | Versione **1.9** (29 ottobre 2026): rispetto alla base I22 (1.6) aggiunge R07a, ruolo descrittivo e guadagni a sé di ogni carta nel catalogo (O14, 1.7), vieta «/» nell'identificativo dei mazzi personalizzati (R02, 1.8) e aggiunge a R07a il danno nominale di ogni carta (A1 del piano C3, 1.9); nessun effetto cambiato | [game-rules.md](game-rules.md#r07a--ruoli-descrittivi-delle-carte-17) |
| Versione base | Candidato `I22-3e71300e057687ba` **approvato** dal proprietario il 26 ottobre 2026; roadmap della base conclusa e archiviata | [report I22](reports/i22-report.md#approvazione), [roadmap archiviata](history/roadmap-base-i22.md) |
| Client giocabili | `client-debug/` Angular, completo; `client-web/` animato (PixiJS/TypeScript, React/HTML, Vite) collegato al server, con la parità del debug; CLI per gli scenari automatici | [client-web](../client-web/README.md), [client-debug](../client-debug/README.md), [CLI](cli.md) |
| C0 | **Chiusa** il 27 ottobre 2026, con deroga sulla risposta al tocco (116 ms contro 100) e landscape obbligatorio; scena sintetica congelata in `client-c0/revision/` | [esiti C0-R5](reports/client-c0-r5-procedure.md#esiti) |
| C1 | **Chiusa** il 27 ottobre 2026: login → quick 1vCom → partita → esito → nuova partita sul server reale; iPhone e prova umana A superati | [rapporto C1](reports/client-c1-report.md) |
| C2 | **Chiusa** dal proprietario il 29 ottobre 2026. C2a (leggibilità di base) e O9 (40 illustrazioni provvisorie: 39 carte e il token) chiuse il 27 ottobre dopo una prova del proprietario su iPhone e desktop; C2b-1…C2b-7 fatti, checklist P01–P44 con evidenze o limiti; prova umana B del 29 ottobre senza blocchi | [rapporto C2](reports/client-c2-report.md), [piano C2b (storico)](history/client-c2b-plan.md) |
| Prossima tappa | **C3**, risoluzione osservabile (O6, O7): sette blocchi C3-1…C3-7; **C3-1 fatto** (modello puro dei fatti del round e `VerifyResolution` su partite reali, [rapporto C3](reports/client-c3-report.md)), prossimo C3-2; decisioni D1–D11 confermate dal proprietario (sequenza del round fino a 5 s); l'attività A1 (tipo di danno nel catalogo) parte dal regolamento prima di C3-5. Poi C4 e C5. O15 e O16 in un'attività successiva dedicata al deckbuilder; O17 e O18 cambiano regole e protocollo e partono dal regolamento | [piano C3](client-c3-plan.md), [roadmap client](client-roadmap.md#c3-rendere-leggibile-e-soddisfacente-la-risoluzione), [osservazioni](client-roadmap.md#osservazioni-della-prova-umana-b-c2b-7) |
| Pubblicazione | Sorgenti preparati per GitHub; nessun deploy o hosting | [pubblicazione](publishing.md) |

Regole ed effetti non sono cambiati dal lavoro C0–C2; il regolamento 1.7
aggiunge solo un campo descrittivo (ruolo e guadagni) al catalogo, esposto dal
server e copiato nelle regole del debug. I conteggi dei test sono nei rapporti
della relativa consegna. Le numerazioni I01–I26 e F01–F39 appartengono alla
base e non vengono riaperte dalle tappe C0–C5.

## Istruzioni operative

Documenti da seguire per lavorare sul progetto nello stato attuale.

| Documento | Contenuto |
|---|---|
| [README del monorepo](../README.md) | Struttura, avvio rapido, conservazione delle cronologie |
| [AGENTS.md](../AGENTS.md), [CONTRIBUTING.md](../CONTRIBUTING.md) | Regole di modifica e **verifiche obbligatorie** (fonte unica dei comandi di verifica) |
| [Guida locale](setup.md) | Installazione, avvio, dati locali, verifiche e candidato I22 |
| [CLI](cli.md) | Client testuale per scenari applicativi |
| [Regolamento 1.9](game-rules.md) | Fonte normativa; la copia client è controllata da `scripts/check-rules.py` |
| [Decisioni del proprietario](open-questions.md) | Decisioni Q/R recepite; le note datate sono storiche |
| [Archivio partite](match-archive.md) | Contratto corrente di journal, export e chiusura al riavvio |
| [Pubblicazione](publishing.md) | Identità Git, contenuti esclusi, verifiche GitHub |
| [Scena C0](../client-c0/revision/README.md) | Avvio e verifiche della scena Pixi/React del tavolo del bar |
| [Server](../server/README.md), [client-debug](../client-debug/README.md), [stampa carte](../tools/print-cards/README.md) | Note dei singoli componenti |

## Roadmap e attività future

| Documento | Contenuto |
|---|---|
| [Indice delle roadmap](roadmap.md) | Roadmap attiva e archiviata |
| [Roadmap del client web animato](client-roadmap.md) | Tappe C0–C5 (C0–C2 chiuse), criteri di C3–C5, osservazioni O1–O18, decisioni aperte; [revisioni](history/client-roadmap-revisions.md) |
| [Rapporto C3](reports/client-c3-report.md) | C3-1: modello della risoluzione, viste reali registrate, K1–K6 misurati; [evidenze](reports/client-c3/c3-1/) |
| [Piano C3](client-c3-plan.md) | Risoluzione osservabile: dati del server verificati, difetti K1–K6, blocchi C3-1…C3-7, regole di non-regressione, decisioni D1–D11, attività A1; [evidenze dell'osservazione](reports/client-c3/c3-plan/) |
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
| Archivio in history/ | [roadmap della base I22](history/roadmap-base-i22.md), [setup precedente a I22](history/setup-pre-i22.md), [ricognizione preparatoria della roadmap client](history/client-roadmap-preparation.md), [punto di ripresa C0-R2–R5](history/client-c0-resume.md), [piano C2b](history/client-c2b-plan.md), [revisioni 1–21 della roadmap client](history/client-roadmap-revisions.md) |

Nei rapporti i collegamenti ai sorgenti puntano ai percorsi correnti `server/`
e `client-debug/` (prima `bm-server/` e `bm-web-client/`); i file rimossi in
seguito, come il prototipo Phaser, sono citati senza collegamento. Le evidenze
JSON conservano i percorsi del momento in cui sono state prodotte.
