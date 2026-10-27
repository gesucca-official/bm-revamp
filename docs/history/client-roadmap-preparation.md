> **Aggiornamento client — 26 ottobre 2026:** il client corrente è `client-debug/`,
> con il solo percorso di gioco debug. Prototipo Phaser, route `/phaser`, selettore
> grafico/debug e dipendenze dedicate sono stati rimossi. Le descrizioni Phaser
> nelle ricognizioni precedenti restano storiche. Regole e protocollo invariati.

# Preparazione della roadmap client

> **Seguito — 26 ottobre 2026:** è stata redatta la
> [roadmap del client web animato](../client-roadmap.md), con parità funzionale
> rispetto al debug e asset attuali esclusi. Le domande e i vincoli sotto
> conservano il contesto preparatorio; per perimetro e tappe vale il nuovo piano.
> Regolamento invariato.

> **Documento storico archiviato** (prima `docs/client-roadmap-preparation.md`),
> superato dalla roadmap del client. Stato corrente nell'[indice della
> documentazione](../README.md#stato-corrente).

**26 ottobre 2026 — ricognizione documentale, non roadmap approvata.**
La [roadmap precedente](roadmap-base-i22.md) è chiusa con I22.
Questo documento raccoglie informazioni disponibili e decisioni da concordare;
non assegna attività, priorità, incrementi, date o tecnologie e non avvia
l'implementazione. L'ordine delle righe non esprime una priorità.

## Fonti e lettura dello stato

| Fonte | Informazioni utili e limiti |
|---|---|
| [Regolamento 1.6](../game-rules.md), [AGENTS.md](../../AGENTS.md) | Fonte normativa e procedura per eventuali cambiamenti di comportamento. Nessuna modifica alle regole in questa ricognizione. |
| [Report I22](../reports/i22-report.md), [stato implementazione](../implementation-status.md), [conformità](../rules-conformance.md) | Base approvata e limiti accettati. I numeri delle prove sono evidenze storiche, non nuove verifiche del client finale. |
| [Decisioni del proprietario](../open-questions.md) Q01/Q04/Q16, residuo R07 | Libertà tecnica; debug per lo sviluppo; Phaser rinviato; direzione desktop, web e mobile senza specifiche o ordine definiti. |
| [README client](../../client-debug/README.md), [architettura](../architecture.md), [setup](../setup.md) | Angular debug operativo locale in `client-debug/`; prototipo Phaser rimosso; toolchain e proxy esistenti. Le sezioni legacy non descrivono automaticamente lo stato corrente. |
| [API](../api.md), [dominio](../domain-model.md), [archivio partite](../match-archive.md), [CLI](../cli.md) | Contratti e server autorevole, viste private, comandi, ciclo di vita ed export. Non definiscono una nuova UX o un protocollo multipiattaforma già approvato. |
| [Inventario feature](../feature-inventory.md), [debito tecnico](../technical-debt.md) | Identificativi Fxx e diagnosi datate da confrontare con I22; le vecchie lacune non diventano automaticamente lavoro residuo. |
| [IDEAS.md](../../IDEAS.md) | Idee di rework e wrapper desktop/mobile: ipotesi da discutere, non scelte architetturali. |
| [Contributi](../../CONTRIBUTING.md), [pubblicazione](../publishing.md) | Verifiche, conservazione delle evidenze e diritti dei materiali; pubblicazione sorgenti distinta da deploy. |

## Base acquisita da cui partire

Il debug web della base approvata comprende hub, identità persistenti e sessione
unica, catalogo/editor mazzi, quick 1vCom, open 1vCom, quick 1v1 e FFA, invio
mosse e report, esiti, clock/forfait e reconnect. I report UX I13, I15, I16,
I17a/b, I14/I23 e I24 sono richiamati da I22: certificano quei percorsi nel
client debug, non Phaser né futuri client desktop/mobile.

Restano acquisiti i vincoli normativi: server autorevole, mano privata,
mazzi strutturalmente validi senza nuovi limiti di legalità, bot casuale,
30 secondi per mossa con altri umani, nessun timeout mossa vsCom, reconnect
entro 30 secondi nello stesso processo, restart-draw senza restore giocabile.
Per dettagli e confini temporali fa fede il regolamento, non questa sintesi.

I22 accetta un ambiente locale Windows x64, stack legacy e avviso bundle
client 2,22 MB/2 MB. Questo non decide i requisiti del prodotto finale.
La raccolta completa dei dati partita è acquisita; non equivale a cronologia,
replay utente o telemetria UI. Non si presume un modello guest o un account
pubblico completo dal provisioning locale di sviluppo.

## Informazioni e decisioni necessarie

| Tema | Da chiarire con il proprietario | Dati utili per decidere |
|---|---|---|
| Obiettivo e pubblico | Strumento di playtest evoluto o client destinato a giocatori esterni? Quale esperienza e quale risultato rendono accettabile la prima consegna? | Utenti e contesti d'uso, problemi osservati nel debug, esempi di percorsi desiderati. |
| Piattaforme (Q16/R07) | Quali piattaforme rientrano nel primo perimetro e con quale ordine concordato? Quali OS, browser, dimensioni schermo, touch/mouse/tastiera? | Matrice dei dispositivi e condizioni di rete effettivamente da supportare. Web responsive e app mobile non sono equivalenti già decisi. |
| Ruolo dei client (Q04, I18/F26) | Evolvere il web attuale, completare Phaser o scegliere un'altra soluzione? Il debug resta uno strumento separato? | Confronto motivato di riuso, stato del prototipo, costi di manutenzione e integrazione; nessuna riscrittura o wrapper già scelti. |
| Perimetro funzionale | Quali percorsi della base devono comparire nella nuova UX: accesso, hub/code, catalogo/mazzi, partita, esito, rientro e ricevuta di restart? Eventuali estensioni richiedono decisione distinta. | Mappa dei flussi esistenti e prove UX I22, distinguendo parità con la base e nuove funzioni. |
| Interazione della partita | Come presentare scelte simultanee, bersagli, scarti/oggetti, conferma e pending, risorse/stati, report, attesa, timeout ed errori recuperabili? | Esempi di round e casi limite già coperti; requisiti di leggibilità e accessibilità da concordare. La UX non cambia le regole. |
| Aspetto e contenuti (Q13/F37) | Quale direzione visiva, lingue, animazioni/audio e livello di finitura? Quali placeholder sono accettabili? | Inventario degli asset riutilizzabili, formati e diritti; carte/personaggi attuali sono materiale di sviluppo, non set definitivo. |
| Account e servizi (Q05/Q07) | Il perimetro resta locale o richiede onboarding e recupero account? Eventuali funzioni amministrative sono incluse? | Provisioning attuale distinto da registrazione pubblica; dipendenze server e policy da definire se richieste. |
| Contratti e stato client | Quali adattamenti sono necessari per i dispositivi scelti e per connessione, aggiornamenti, errori e ripresa? | Contratti REST/SockJS/STOMP e viste private correnti; diagnosi architetturali da riverificare prima di scegliere soluzioni. Motore e regole non vanno duplicati nel client. |
| Distribuzione (Q17/I21/F29) | Solo avvio locale, distribuzione installabile o servizio ospitato? Quali vincoli di installazione, aggiornamento, capacità e costi? | Nessun host operativo già scelto; configurazioni Heroku storiche. La preparazione non autorizza deploy. |
| Accettazione e risorse | Chi valuta la UX e con quali scenari, requisiti di accessibilità/prestazioni e dispositivi? Quali disponibilità, budget e vincoli di consegna? | Prove client esistenti da conservare; browser per UX, CLI per scenari applicativi non UX, unit e integrazioni mirate dirette. Soglie e scadenze restano da concordare. |

## Confini da confermare quando si definirà il piano

Elo I25/F38/R08, amministrazione I20/F28, hosting I21/F29, email e recupero
account F05/F36, economia F33, open PvP F34, cronologia/replay/premi F35,
nuovi contenuti e bilanciamento F37 restano differiti. Nessuno di questi temi
entra automaticamente nella roadmap client. I vecchi ID sono mantenuti per
tracciabilità; non vengono assegnati nuovi incrementi.

Le risposte da raccogliere riguardano obiettivo/pubblico, piattaforme e ordine,
ruolo di debug e Phaser, flussi inclusi, direzione UX/asset, distribuzione,
criteri di accettazione e risorse. Solo dopo quelle scelte sarà possibile
concordare perimetro, attività, dipendenze e priorità della nuova roadmap.
Eventuali cambiamenti di gioco seguiranno prima la revisione esplicita del
regolamento e poi l'allineamento previsto da AGENTS.md.
