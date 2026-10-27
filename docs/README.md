# Documentazione — indice e stato corrente

Questa pagina è la **fonte principale dello stato del progetto** e classifica
i documenti. Le altre pagine rimandano qui invece di ripetere lo stato.
Il [regolamento](game-rules.md) resta la fonte normativa del gioco e prevale
su codice, test, catalogo e documentazione storica ([istruzioni](../AGENTS.md)).

## Stato corrente

Aggiornato al **27 ottobre 2026**.

| Ambito | Stato | Fonte |
|---|---|---|
| Regolamento | Versione **1.7** (27 ottobre 2026): rispetto alla base I22 (1.6) aggiunge solo R07a, ruolo descrittivo e guadagni a sé di ogni carta nel catalogo (O14); nessun effetto cambiato | [game-rules.md](game-rules.md#r07a--ruoli-descrittivi-delle-carte-17) |
| Versione base | Candidato `I22-3e71300e057687ba` **approvato** dal proprietario il 26 ottobre 2026; roadmap della base conclusa e archiviata | [report I22](reports/i22-report.md#approvazione), [roadmap archiviata](history/roadmap-base-i22.md) |
| Client giocabile | `client-debug/` Angular, completo; `client-web/` per la sola quick 1vCom (C1); CLI per gli scenari automatici | [client-debug](../client-debug/README.md), [CLI](cli.md) |
| Client web animato | **C0 chiusa** il 27 ottobre 2026 su decisione del proprietario, con deroga sulla risposta al tocco (116 ms contro 100) e landscape obbligatorio. Stack confermato: PixiJS/TypeScript, React/HTML, Vite. Solo scena sintetica, nessun collegamento al server | [roadmap client](client-roadmap.md), [esiti C0-R5](reports/client-c0-r5-procedure.md#esiti) |
| C2 | **C2a implementata** (leggibilità di base O11–O14 con O3/O4, solo quick 1vCom), verificata con partite reali in locale a 1366×768 e 844×390; iPhone e prova umana non ancora. C2b non iniziata | [rapporto C2](reports/client-c2-report.md), [roadmap](client-roadmap.md#c2-raggiungere-la-parità-del-client-debug) |
| C1 | **Chiusa** dal proprietario in `client-web/`: login → quick 1vCom → partita → esito → nuova partita sul server reale; criteri automatici verificati con partite reali in locale; iPhone e prova umana A superati. Osservazioni O1–O14 assegnate alle tappe; C2 non iniziata | [rapporto C1](reports/client-c1-report.md), [client-web](../client-web/README.md), [osservazioni](client-roadmap.md#osservazioni-del-proprietario-dopo-c1) |
| Pubblicazione | Sorgenti preparati per GitHub; nessun deploy o hosting | [pubblicazione](publishing.md) |

Regole ed effetti non sono cambiati dal lavoro C0–C2a. Per la decisione O14 il regolamento 1.7
aggiunge un campo descrittivo (ruolo e guadagni) al catalogo, esposto dal server
e copiato nelle regole del debug.
Le numerazioni I01–I26 e F01–F39 appartengono alla base e non vengono riaperte
dalle tappe C0–C5.

## Istruzioni operative

Documenti da seguire per lavorare sul progetto nello stato attuale.

| Documento | Contenuto |
|---|---|
| [README del monorepo](../README.md) | Struttura, avvio rapido, conservazione delle cronologie |
| [AGENTS.md](../AGENTS.md), [CONTRIBUTING.md](../CONTRIBUTING.md) | Regole di modifica e **verifiche obbligatorie** (fonte unica dei comandi di verifica) |
| [Guida locale](setup.md) | Installazione, avvio, dati locali, verifiche e candidato I22 |
| [CLI](cli.md) | Client testuale per scenari applicativi |
| [Regolamento 1.7](game-rules.md) | Fonte normativa; la copia client è controllata da `scripts/check-rules.py` |
| [Decisioni del proprietario](open-questions.md) | Decisioni Q/R recepite; le note datate sono storiche |
| [Archivio partite](match-archive.md) | Contratto corrente di journal, export e chiusura al riavvio |
| [Pubblicazione](publishing.md) | Identità Git, contenuti esclusi, verifiche GitHub |
| [Scena C0](../client-c0/revision/README.md) | Avvio e verifiche della scena Pixi/React del tavolo del bar |
| [Server](../server/README.md), [client-debug](../client-debug/README.md), [stampa carte](../tools/print-cards/README.md) | Note dei singoli componenti |

## Roadmap e attività future

| Documento | Contenuto |
|---|---|
| [Indice delle roadmap](roadmap.md) | Roadmap attiva e archiviata |
| [Roadmap del client web animato](client-roadmap.md) | Tappe C0–C5, gate C0 chiuso, criteri di C1–C5, decisioni aperte |
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
| Archivio in history/ | [roadmap della base I22](history/roadmap-base-i22.md), [setup precedente a I22](history/setup-pre-i22.md), [ricognizione preparatoria della roadmap client](history/client-roadmap-preparation.md), [punto di ripresa C0-R2–R5](history/client-c0-resume.md) |

Nei rapporti i collegamenti ai sorgenti puntano ai percorsi correnti `server/`
e `client-debug/` (prima `bm-server/` e `bm-web-client/`); i file rimossi in
seguito, come il prototipo Phaser, sono citati senza collegamento. Le evidenze
JSON conservano i percorsi del momento in cui sono state prodotte.
