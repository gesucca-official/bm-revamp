# Pacchetto di prove per la revisione del metodo

**15 novembre 2026, preparato dalla regia del Set Base su richiesta del proprietario.** Materiale per una revisione esterna di
[docs/orchestrazione-lavoro.md](../../orchestrazione-lavoro.md). Solo fatti misurati sulla repo e un campione dei manufatti;
**nessuna opinione della regia**, di proposito, per non orientare la revisione. Dove un dato manca lo dice.

## 1. Come si lavora oggi (riassunto del metodo)

- **Tre ruoli.** Il proprietario decide e pusha; una chat di **regia** legge la repo, rivede le consegne, scrive i prompt, propone
  modello e sforzo, registra le decisioni e non scrive codice di prodotto; gli **esecutori** sono sessioni usa e getta, una per blocco,
  lanciate dal proprietario (o dalla regia, se lui lo chiede).
- **Due filoni su due macchine:** Set Base (carte e bilanciamento coi bot, questa macchina) e C4 (client, l'altra).
- **Ciclo tipico di un blocco di bilanciamento:** prompt della regia → Fase A (proposta, STOP) → revisione della regia →
  domande numerate al proprietario con una raccomandazione ciascuna → riga D nel registro → prompt della Fase B → attuazione e
  misura con budget fisso → rapporto → revisione → nuove domande → nuova riga D.
- **Cancelli fissi:** partita viva identica byte per byte; passo 0 d'identità prima di ogni giro; nessun atteso di test cambiato per
  tornare al verde; un solo Maven o una sola misura per macchina; budget di calcolo fissato prima.
- **Contratto dell'esecutore** (revisione del 10 novembre): il prompt rimanda al contratto e scrive solo ciò che è proprio del blocco.

## 2. Numeri della documentazione

| Documento | Righe | KB | Chi lo legge |
|---|---:|---:|---|
| AGENTS.md | 19 | 1 | tutti |
| docs/orchestrazione-lavoro.md (metodo) | 215 | 19 | regia sempre, esecutori il contratto e le insidie |
| docs/README.md (indice e stato) | 97 | 15 | regia |
| docs/set-base-plan.md (stato del filone) | 700 | 67 | regia; esecutori la sezione del blocco |
| docs/set-base-decisioni.md (registro D1–D97) | 109 | 76 | regia; esecutori le righe citate |
| docs/history/set-base-plan-storico.md | 799 | 99 | quasi nessuno |
| docs/client-c4-plan.md | 742 | 97 | regia dell'altra macchina |
| documenti di progetto del Set Base (16 file) | 5.148 | — | a seconda del blocco |
| rapporti del Set Base (41 file `.md`) | 10.355 | — | regia in revisione |

- `docs/` contiene 309 file `.md` tracciati e pesa 660 MB (evidenze comprese; Set Base 28 MB, C4 131 MB).
- **Registro delle decisioni:** 97 righe; lunghezza mediana 798 caratteri, massima 3.322; 16 righe oltre i ~1.200 caratteri
  indicati dall'igiene dei documenti (D96), 3 oltre 2.500. La lunghezza cresce nel tempo: D1 125 caratteri, D30 581, D50 2.844,
  D70 1.067, D90 1.031, D95 3.322, D97 2.287 (scritta dalla regia attuale, dopo la regola dei ~1.200).
- **Proposte di Fase A del Set Base:** SB-16d 437 righe, SB-16g 619, SB-16h 372, SB-16i 317, SB-30b 198, livelli del bot 175.
- **Rapporti:** di solito 250–600 righe (SB-15 584, SB-16b 503, SB-14 496, SB-16h 253).
- **Domande al proprietario per proposta:** SB-16i 12, livelli del bot 9, SB-30b 5, correzione 1.5 5, rapporto 1.5 4, passo 3 4.

## 3. Ritmo e produzione

- Dal 1° novembre: 327 commit; 107 «SB-…», 13 «Set Base: …» (soli documenti della regia), 80 «C4-…».
- Commit del Set Base per giorno: 2/11 1 · 5/11 3 · 6/11 18 · 7/11 4 · 8/11 15 · 10/11 5 · 12/11 15 · 13/11 33 · 14/11 38.
- Blocchi del Set Base chiusi: SB-1…SB-15 (fondamenta, strumenti, progetto, cinque starter) in circa una settimana.
- **Revisione del bilanciamento SB-16b…SB-16i** (12–14 novembre): 10 sottoblocchi, decisioni **D49–D97 (49 decisioni in tre giorni)**,
  nello stesso periodo 86 commit del Set Base (compresi SB-30b e i documenti della regia). Criteri completi non raggiunti; il proprietario in D95 ha ridimensionato l'obiettivo («non scordiamoci la
  bigger picture»).

## 4. Episodi con costo (dal registro e dal piano)

| Episodio | Riferimento | Cosa è successo |
|---|---|---|
| STOP dopo tre giri senza criteri | SB-16e, D56; SB-16e2, D57 | giri di bilanciamento conclusi senza risultato, poi prova umana |
| Regola del gettone riscritta più volte | D58 → D59 → D65 → D69 → D71 → D72 | sei decisioni sulla stessa meccanica in due giorni |
| Messaggi della regia non arrivati all'esecutore | D86, D87 | l'esecutore ha attuato la versione superata; giro proseguito sul codice sbagliato |
| Giro interrotto dalla chiusura della sessione | D87 | braccio B da completare a parte |
| Andata e ritorno sul travaso | D84 → D86 → D88 | classe nuova, poi abbandonata perché rompeva l'identità; ritorno al parametro |
| Budget di calcolo esauriti | D68, D83, D90 | cancello completo non raggiunto in nessuno dei tre |
| Consolidamento della documentazione | D96 | richiesto dal proprietario: «ho l'impressione che la repo stia diventando difficilmente gestibile» |
| Righe del registro troppo lunghe | §2 | la regola dei ~1.200 caratteri non è rispettata nemmeno dalla regia |

## 5. Costo di ripartenza della regia

Il 14–15 novembre una regia nuova è ripartita da un prompt di consegna di circa 60 righe e ha letto, prima di poter lavorare,
circa 1.200 righe (metodo intero, stato e sezioni del piano, righe D85–D97, regole del playground, testa della bozza, chiusure di
quattro rapporti). La revisione di una consegna di Fase A ha richiesto la lettura completa della proposta (317 righe).

## 6. Usage (da compilare dal proprietario)

La repo non registra i token. Se il proprietario la compila prima della revisione, è il dato più utile.

| Tipo di sessione | Modello e sforzo | Usage stimato | Note |
|---|---|---|---|
| Regia, una giornata | | | |
| Fase A (proposta, senza codice) | | | |
| Fase B con codice e giro | | | |
| Blocco di client (C4) | | | |
| Consolidamento documentale (D96) | | | |

## 7. Manufatti da campionare

Leggere a campione, non per intero:

- metodo: [orchestrazione-lavoro.md](../../orchestrazione-lavoro.md), sezioni «Contratto dell'esecutore», «Il prompt», «Come si rivede una relazione», «Igiene dei documenti del Set Base»;
- una riga di decisione lunga e una corta: D95 e D90 nel [registro](../../set-base-decisioni.md#decisioni-del-proprietario);
- una proposta: [sb-16i-proposta.md](../../design/set-base/sb-16i-proposta.md);
- un rapporto: [sb-16h-report.md](../set-base/sb-16h-report.md);
- un prompt di Fase B: [appendice](#appendice-prompt-della-fase-b-di-sb-16i);
- la testa del piano: [set-base-plan.md](../../set-base-plan.md), righe 1–20 e la tabella dei blocchi;
- lo script di revisione: `python scripts/review-block.py <base>..<testa>`.

## Appendice: prompt della Fase B di SB-16i

Scritto dalla regia il 15 novembre 2026 e lanciato dal proprietario con Opus, sforzo alto (circa 70 righe, 6,5 KB). Proposta fuori
dal blocco: «Claude: Opus, sforzo alto · GPT: Sol, sforzo alto. Motivo: modifiche al motore del playground con prove d'identità
byte per byte; un cancello allentato passerebbe inosservato.»

```text
Repo: C:\_simone\claude\bm-revamp-on-laptop, branch main.
Leggi AGENTS.md e segui il contratto dell'esecutore in docs/orchestrazione-lavoro.md.
Blocco: SB-16i, Fase B (attuazione e misura della correzione 1.6). Una sola fase; STOP alla fine con rapporto e domande.

DA LEGGERE
- docs/set-base-plan.md: sezione «SB-16i — Correzione 1.6», «Soglia minima fino a SB-18», «Prova che un giro non tocca il motore».
- docs/set-base-decisioni.md: D97 (prevale sulla proposta dove dice diversamente), poi D95, D94, D88, D85 (8), D63.
- docs/design/set-base/sb-16i-proposta.md: tutta (è il progetto approvato, salvo le modifiche di D97).
- docs/design/set-base/regole-playground.md (1.0) e bozza-di-riferimento.md.
- docs/reports/set-base/sb-16h-report.md: «Passo 0 e identità», «Budget, verifiche e limiti», «Evidenze e riproduzione».

COSA CAMBIA RISPETTO ALLA PROPOSTA (D97)
1. Parola chiave «Gioca d'anticipo: E» (definizione e sette casi della sezione 2 della proposta). Su Sorpasso in curva, Sgommata, Cinghiata di traverso.
2. «Annuncia X o Y»: sceglie il giocatore QUANDO GIOCA il caricamento, fra i nomi con almeno una copia nel mazzo [...]; bot: regola unica e condivisa [...].
3. Dopo ogni ricerca il mazzo si mischia, sotto un'impostazione della bozza (assente = falso) per non rompere l'identità storica.
4. Premi dei caricamenti della 1.5 invariati.
5. Client e docs/api.md non si toccano: passo a parte.

LAVORO, IN QUEST'ORDINE
A. Codice del playground e bot, con perimetro esteso da D97 (Game, Move, Character/Player, PrintedEffects, bot).
B. Cancello d'identità prima di cambiare la bozza (passo 0 della 1.5 = step0-20-2 di SB-16h; identità viva 1.13; Spring; check-rules; fedeltà; mutazioni). Se fallisce: STOP.
C. Bozza 1.6 in bozza.json, 1.5 congelata per i test storici.
D. Misura con budget di 3.300 s (passo 0 ≤ 150 s ×2, giro ≤ 1.500 s, al più una correzione ≤ 1.500 s), contatori nuovi, correzione solo fra le riserve scritte.
E. Documenti: regole del playground 1.1, bozza di riferimento 1.6, griglia, rapporto, piano.

CHIUSURA, OLTRE AL CONTRATTO
Tabella dei 15 incontri, contatori nuovi, budget voce per voce, campi per il passo del client, domande numerate.
```

(Testo abbreviato nei punti segnati con [...]; il testo completo è nella chat di regia del 15 novembre 2026.)
