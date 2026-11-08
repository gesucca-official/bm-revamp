# Documentazione — indice e stato corrente

Questa pagina è la **fonte principale dello stato del progetto** e classifica
i documenti. Le altre pagine rimandano qui invece di ripetere lo stato.
Il [regolamento](game-rules.md), con i documenti di set ([Set Base](sets/base.md)), resta la fonte normativa del gioco e prevale
su codice, test, catalogo e documentazione storica ([istruzioni](../AGENTS.md)).

## Stato corrente

Aggiornato all'**8 novembre 2026**.

| Ambito | Stato | Fonte |
|---|---|---|
| Regolamento | Versione **1.13** (8 novembre 2026): rispetto alla base I22 (1.6) aggiunge R07a, ruolo descrittivo e guadagni a sé di ogni carta nel catalogo (O14, 1.7), vieta «/» nell'identificativo dei mazzi personalizzati (R02, 1.8), aggiunge a R07a il danno nominale di ogni carta (A1 del piano C3, 1.9) e il suo importo (A3, 1.10) e stabilisce che ogni personaggio ha tutte e cinque le risorse, a 0 quelle che la scheda non indica (R01, 1.11: corregge il crash di BadTrip, LethalHeroinDose e PervertedMetabolism giocate da Spazienzio; [rapporto](reports/rules-1.11-report.md)); con la **1.12** (7 novembre 2026, SB-1) R02 impone le regole dei mazzi (20 carte, 2 copie, basic e due bound proprie, last resort) e R03 non ha più giocatori vivi senza mosse ([rapporto](reports/set-base/sb-1-report.md)); con la **1.13** (8 novembre 2026, SB-2) le carte passano al documento del set [Set Base 0.1](sets/base.md), con versione propria, e R04 e R05 non citano più carte ([rapporto](reports/set-base/sb-2-report.md)); nessun effetto di carta cambiato | [game-rules.md](game-rules.md#r07a--ruoli-descrittivi-delle-carte-17), [sets/base.md](sets/base.md) |
| Versione base | Candidato `I22-3e71300e057687ba` **approvato** dal proprietario il 26 ottobre 2026; roadmap della base conclusa e archiviata | [report I22](reports/i22-report.md#approvazione), [roadmap archiviata](history/roadmap-base-i22.md) |
| Client giocabili | `client-debug/` Angular, completo; `client-web/` animato (PixiJS/TypeScript, React/HTML, Vite) collegato al server, con la parità del debug; CLI per gli scenari automatici | [client-web](../client-web/README.md), [client-debug](../client-debug/README.md), [CLI](cli.md) |
| C0 | **Chiusa** il 27 ottobre 2026, con deroga sulla risposta al tocco (116 ms contro 100) e landscape obbligatorio; scena sintetica congelata in `client-c0/revision/` | [esiti C0-R5](reports/client-c0-r5-procedure.md#esiti) |
| C1 | **Chiusa** il 27 ottobre 2026: login → quick 1vCom → partita → esito → nuova partita sul server reale; iPhone e prova umana A superati | [rapporto C1](reports/client-c1-report.md) |
| C2 | **Chiusa** dal proprietario il 29 ottobre 2026. C2a (leggibilità di base) e O9 (40 illustrazioni provvisorie: 39 carte e il token) chiuse il 27 ottobre dopo una prova del proprietario su iPhone e desktop; C2b-1…C2b-7 fatti, checklist P01–P44 con evidenze o limiti; prova umana B del 29 ottobre senza blocchi | [rapporto C2](reports/client-c2-report.md), [piano C2b (storico)](history/client-c2b-plan.md) |
| C3 | **Chiusa** dal proprietario il 3 novembre 2026, dopo la prova su desktop e iPhone (la prova umana del ritmo resta nella sessione finale C5). Blocchi C3-1…C3-7 più C3-L e C3-4s, con le attività A1 e A3 (tipo e importo del danno nel catalogo, regolamento 1.9 e 1.10) e le decisioni D1–D14. Il round si legge dal tavolo: frecce verso i bersagli ammessi, una carta per volta con tocco che passa alla successiva, costo, primi piani di chi gioca e del bersaglio, impatti per tipo di danno (stella con onda d'urto per il colpo, coltello per il taglio, goccia per il veleno), bersaglio che vibra e si scurisce, volto della carta con tipo e importo del danno, riepilogo per posto e «Ultimo turno». Sequenze fino a 19,7 s (tetto di 20 s), clock tra umani almeno 11 s a fine sequenza: nessun segnale per A2, il clock resta 30 s | [rapporto C3](reports/client-c3-report.md), [piano C3](client-c3-plan.md), [scheda di prova](reports/client-c3/c3-7/prova-scheda.md) |
| C4 (in corso) | **Rifinitura di grafica, audio, layout e prestazioni** ([piano](client-c4-plan.md), [rapporto](reports/client-c4-report.md)). Fatti C4-1 (strumenti) e C4-1b (misura di partenza). **Approvati dal proprietario:** C4-3 (simboli, font Impact e Arial, [inventario degli asset](design/client-c4/assets/README.md)), C4-2 (dimensioni, bersagli da 44 px, ✓ e × sulla carta, tutela di 750×292) e C4-4 (cornici per tipologia e segno del ruolo) il 4 novembre 2026; C4-5a (sfondo, O2 chiusa) e C4-5a-bis (O26 e O27 chiuse) il 5 novembre; C4-5b (coerenza di tutte le schermate, [catture dopo](reports/client-c4/c4-5b/dopo/README.md)) il 6 novembre. C4-6* **saltato** (D1). **C4-7: fatto dopo C4-7-ter, in attesa del giudizio del proprietario** ([Fase B](reports/client-c4-report.md#c4-7-ter--fase-b): colpi HIT/CUT, POISON muto, esito col pannello, attacco conferma 5 ms; scelte e regole approvate; [prova del proprietario](reports/client-c4-report.md#c4-7-ter--prova-del-proprietario-del-7-novembre-2026): unico rilievo il volume del taglio, C4-10: Fase 0 fatta, in attesa dell’ascolto del proprietario), ora **C4-10** (guida visiva: [Fase A pronta, in attesa della scelta del proprietario](design/client-c4/guida/proposta.md)) e **C4-11** (spazio e profondità) per D15, poi C4-8a, C4-8b, C4-9 e **C5** (playtest finali, con la prova umana del ritmo). [Decisioni D1–D15](client-c4-plan.md#decisioni-del-proprietario) tutte prese. Le verifiche grafiche fino a C4-5b sono anteriori al regolamento 1.11 (cinque risorse per posto). A C4 arrivano dalle prove di C3 le osservazioni O21 (residui di C3-5 e C3-6), O22 (750×292: solo non regressione, l'adattamento completo passa all'app futura) e O23 (strumenti di verifica); O19 (sequenza velocizzata, attivabile dall'utente) passa a C5; O20 (anomalia della FFA a timeout) resta da valutare a parte dal proprietario. O15 e O16 in un'attività successiva dedicata al deckbuilder; O17 e O18 cambiano regole e protocollo e partono dal regolamento | [piano C4](client-c4-plan.md), [roadmap client](client-roadmap.md#c4-rifinire-grafica-e-uso-su-schermi-diversi), [osservazioni](client-roadmap.md#osservazioni-registrate-durante-c3) |
| Set Base (in corso) | **Primo set di carte, progettato e bilanciato coi bot nei soli sorgenti di test** ([piano](set-base-plan.md)). **Chiusi e approvati** dal proprietario fino all'8 novembre 2026: gli strumenti (runner con seme, bot su vista limitata, formato dati, playground con più set, banco di misura e listino: SB-3–SB-7b, SB-6a, SB-6b); il progetto (schede dei sette personaggi, griglia dei 115 slot, tetti delle bound: SB-9, SB-10a, SB-10b); le fondamenta (regole dei mazzi nel regolamento 1.12, regolamento 1.13 separato dal documento del set [Set Base 0.1](sets/base.md): SB-1, SB-2); quattro starter nella bozza (SB-11–SB-14): Spazienzio «Pazienza finita», Mara «Consegna sul muso», Tossico «Tutto è droga» e Pino «Chiude quando dico io», fra il 40 e il 60% l'uno contro l'altro coi bot. Nulla della bozza raggiunge la partita viva fino a SB-28. **Prossimi:** SB-15 (Gigi, ultimo starter avanzato), le rarità della griglia nella bozza, SB-8 (bozza giocabile da umani, tocca server e client: da coordinare con C4) per le prove umane SB-12b e SB-16. Decisioni D1–D44 nel piano; consegne a C4 in [allineamento fra le macchine](orchestrazione-lavoro.md#allineamento-fra-le-macchine) | [piano](set-base-plan.md), [Set Base 0.1](sets/base.md), [schede dei personaggi](design/set-base/schede-personaggi.md), [griglia](design/set-base/griglia.md), [listino](design/set-base/listino.md), [rapporti](#rapporti-decisioni-ed-evidenze-storiche) |
| Pubblicazione | Sorgenti preparati per GitHub; nessun deploy o hosting | [pubblicazione](publishing.md) |

Gli effetti delle carte non sono cambiati dal lavoro C0–C3; il regolamento è alla
1.13: la 1.7 aggiunge ruolo e guadagni, la 1.9 il danno nominale (A1 del piano C3) e la 1.10 il suo importo (A3),
tutti campi descrittivi del catalogo esposti dal server e copiati nelle regole del
debug; la 1.8 vieta «/» nell'identificativo dei mazzi personalizzati (R02); la 1.11 fa partire da 0 le risorse
che la scheda di un personaggio non indica (R01), così le viste mostrano le cinque risorse dal primo turno; la 1.12 porta le regole dei mazzi
(R02: 20 carte regolari, al massimo 2 copie, basic e due bound del personaggio, last resort) e la 1.13 sposta le carte nel documento del
set (Set Base 0.1), lasciando nel regolamento le sole regole generali. I conteggi dei test sono nei rapporti
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
| [Regolamento 1.13](game-rules.md) e [Set Base 0.1](sets/base.md) | Fonte normativa: sistema e carte del set; le copie client, l'allegato e il catalogo sono controllati da `scripts/check-rules.py` |
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
| [Piano C4](client-c4-plan.md) | Grafica e uso su schermi diversi: stato misurato (fatti C4-1…C4-5b, approvati dal proprietario da C4-3 a C4-5b; C4-6* saltato; C4-7*: fatto dopo C4-7-ter, in attesa del giudizio del proprietario; C4-10 e C4-11 nuovi prima di C4-8a), blocchi C4-1…C4-11, regole di non regressione 1–18, decisioni D1–D15 tutte prese |
| [Piano Set Base](set-base-plan.md) | Dal set provvisorio a circa 115 carte bilanciate: regole dei mazzi, separazione fra regolamento e set, runner, bot e playground, testi per i giocatori, illustrazioni, blocchi SB-1…SB-33, criteri di bilanciamento, decisioni D1–D44; [bozza esterna di carte](design/set-base/bozza-esterna-proposta-70-carte.md) come serbatoio di idee. In corso in parallelo a C4 (D30, D40, D42) |
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
| Set Base | [SB-3](reports/set-base/sb-3-report.md), [SB-4](reports/set-base/sb-4-report.md), [SB-5](reports/set-base/sb-5-report.md), [SB-9](reports/set-base/sb-9-report.md), [SB-6A](reports/set-base/sb-6a-report.md), [SB-7](reports/set-base/sb-7-report.md), [SB-7B](reports/set-base/sb-7b-report.md), [SB-10A](reports/set-base/sb-10a-report.md), [SB-10B](reports/set-base/sb-10b-report.md), [SB-11A](reports/set-base/sb-11a-report.md), [SB-11B](reports/set-base/sb-11b-report.md), [SB-1](reports/set-base/sb-1-report.md), [SB-12A](reports/set-base/sb-12a-report.md), [SB-13](reports/set-base/sb-13-report.md), [SB-2](reports/set-base/sb-2-report.md), [SB-6B](reports/set-base/sb-6b-report.md), [SB-14](reports/set-base/sb-14-report.md); evidenze nelle cartelle omonime di [reports/set-base/](reports/set-base/) |
| Stampa carte | [verifica del generatore, 25 ottobre 2026](../tools/print-cards/VERIFICATION.md) |
| Archivio in history/ | [roadmap della base I22](history/roadmap-base-i22.md), [setup precedente a I22](history/setup-pre-i22.md), [ricognizione preparatoria della roadmap client](history/client-roadmap-preparation.md), [punto di ripresa C0-R2–R5](history/client-c0-resume.md), [piano C2b](history/client-c2b-plan.md), [revisioni 1–20 della roadmap client](history/client-roadmap-revisions.md) |

Nei rapporti i collegamenti ai sorgenti puntano ai percorsi correnti `server/`
e `client-debug/` (prima `bm-server/` e `bm-web-client/`); i file rimossi in
seguito, come il prototipo Phaser, sono citati senza collegamento. Le evidenze
JSON conservano i percorsi del momento in cui sono state prodotte.
