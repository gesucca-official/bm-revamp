# Regole del playground in vigore (d50)

**Versione 1.0 — 14 novembre 2026 — consolidata, nessun cambio di comportamento.** Motivazione: dopo D50–D95 le regole del playground erano sparse fra le decisioni, il [contratto d50](sb-16g-2b1-rules.md), le proposte di SB-16g (versioni 1.3, 1.4 e 1.5 sovrapposte) e la bozza; questo documento le raccoglie in un posto solo ([D96](../../set-base-decisioni.md#decisioni-del-proprietario)). Non decide niente: ogni regola cita la decisione o il documento da cui viene, e se una fonte è stata rivista da una successiva vale la successiva.

**Ambito.** Governa **solo il playground**, cioè il profilo `bozza` del server e il runner del banco, **fino a SB-28** ([D50](../../set-base-decisioni.md#decisioni-del-proprietario), punto 8; [D12](../../set-base-decisioni.md#decisioni-del-proprietario)). La partita viva resta al regolamento 1.13. **Le fonti normative restano [docs/game-rules.md](../../game-rules.md) e [docs/sets/base.md](../../sets/base.md)** (AGENTS.md, R00): il regolamento governa il sistema, la scheda del set governa la carta e deroga a una regola solo se lo dice esplicitamente. Questo documento non è normativo; al trasferimento (SB-28) le regole entrano nel regolamento con versione e motivazione.

**Interruttore.** `Ruleset`: `1.13` (partita viva) o `d50`. Il profilo `bozza` parte con `d50` (`app.bozza.regole`), il runner con `-Dsim.rules=d50` ([D54](../../set-base-decisioni.md#decisioni-del-proprietario), punto 4; [SB-16c](../../set-base-plan.md#sb-16c--regole-decise-in-sb-16b-nel-playground)). Con `1.13` nessuna regola qui sotto vale.

Come si cambia questo documento: una regola nuova del playground entra qui con versione e fonte ([igiene dei documenti](../../orchestrazione-lavoro.md#igiene-dei-documenti-del-set-base)); una regola rivista cambia versione e dice quale fonte sostituisce.

## 1. Regole di sistema (SB-16b, D50)

| N. | Regola | Fonte |
|---|---|---|
| RP-1 | **Chi è a terra non colpisce (P1, R04).** Le mosse si risolvono per **gruppi di velocità** (stessa priorità e stessa ALERTNESS dopo i costi). La mossa di un autore morto all'inizio del proprio gruppo si annulla, salvo che bersagli l'autore o un suo oggetto vicino. Dentro un gruppo le mosse restano simultanee. Il salvataggio in extremis resta (una cura già presentata funziona anche se l'autore è sotto zero). Il registro del turno dice il motivo dell'annullamento («a terra»). | D50 (1); D48; SB-16c; SB-16f0 |
| RP-2 | **Costi pagati solo con quello che si ha.** Non si paga con risorse che non si hanno; un costo in HEALTH che porta a 0 o sotto non si paga. | D50 (2) |
| RP-3 | **«Ultimo colpo»**, eccezione scritta sulla carta (R00): permette un costo in HEALTH superiore alla salute disponibile; paga quello che c'è, si ferma a 0 e la mossa si risolve anche da terra. Le altre risorse devono essere sufficienti. La vista dei bot applica lo stesso controllo. | D50 (2); D73; contratto d50 1.1 |
| RP-4 | **Pavimento a zero.** Nessuna risorsa scende sotto zero, HEALTH compresa. | D50 (3) |
| RP-5 | **Nessuno spareggio.** Se non resta nessun superstite la partita è patta; non esistono né lo spareggio sulla HEALTH né «vince chi è meno sotto zero» (P2, scartati). | D50 (4) |
| RP-6 | **Corazza dell'alcol.** Chi ha ALCOHOL (L) maggiore di 0 riduce i danni **HIT** ricevuti di L/4 (divisione intera), dopo gli stati e non sotto zero. Non riduce CUT né POISON. Vale per tutti, anche sui danni a sé. | D50 (5) |
| RP-7 | **Ordine dei timer (P4, R06).** I timer che scadono nello stesso turno si eseguono in ordine di creazione, come già fa il server. | D50 (7) |

## 2. Ricerca al posto della pesca (SB-16b, D50 punto 6)

| N. | Regola | Fonte |
|---|---|---|
| RP-8 | Una carta può **sostituire la pesca che segue la sua mossa** con la ricerca nel mazzo di una carta indicata (passo `search` del formato della bozza). La carta trovata va in mano e si mostra; se non c'è, si pesca normalmente. | D50 (6) |
| RP-9 | Il passo `search` vale in ogni carta che si gioca e poi pesca (azioni regolari, bound, last resort); **non** in basic e oggetti. | D54; SB-16d |
| RP-10 | **Una ricerca cerca solo carte che vanno in mano, mai oggetti**: il caricatore della bozza rifiuta un passo `search` che indica un oggetto. Ogni ricerca indica **un solo binding esatto**. | D70 (2); D61; contratto d50 1.1 |
| RP-11 | Una carta di ricerca usata come scarto di una bound non cerca; la carta trovata, scartata più tardi, esce dalla mano. | D54 (2) |
| RP-12 | Casi limite coperti dai test di conformità di [SB-16c](../../set-base-plan.md#sb-16c--regole-decise-in-sb-16b-nel-playground): carta già in mano, già scartata o assente; mazzo vuoto; carta cercata scartata con una bound; due ricerche nello stesso turno; ricerca di chi è a terra. L'esito di ciascuno è nei test e nel [rapporto](../../reports/set-base/sb-16c-report.md). | D53; SB-16c |

## 3. «Annuncia X»: caricamento, gettone e carta mostrata (SB-16g)

Definizione comune, scritta una sola volta ([D78](../../set-base-decisioni.md#decisioni-del-proprietario), [D79](../../set-base-decisioni.md#decisioni-del-proprietario)); forma breve sulle carte: «Annuncia X. Se lo trovi: … . Se non lo trovi: …». Testo di riferimento: [contratto d50 1.1](sb-16g-2b1-rules.md).

| N. | Regola | Fonte |
|---|---|---|
| RP-13 | **Annuncia X** sostituisce la pesca che segue la mossa con la ricerca di una carta di nome X (un solo binding esatto, non un oggetto). | D78; D79; contratto d50 1.1 |
| RP-14 | **Se la trovi:** la carta va in mano e quella copia si mostra a tutti; si applicano solo i guadagni «Se lo trovi», dopo la ricerca; chi ha cercato riceve un **gettone di vulnerabilità legato al nome X**: HIT, CUT e POISON ricevuti sono moltiplicati per **1,5**, compreso il POISON periodico. Il gettone è sul giocatore, non sulla carta. | D64; D69 (a); D71; contratto d50 1.1 |
| RP-15 | **Quando giochi X:** una qualsiasi carta con quel nome, anche parata o annullata, soddisfa il gettone; si soddisfa **uno solo**, il più vecchio già esistente prima della mossa. Lo scarto non lo soddisfa. Una ricerca del proprio nome non soddisfa il gettone che crea. | D69 (a), (c); D71; contratto d50 1.1 |
| RP-16 | **Fine del gettone:** gettone e promemoria della carta cadono **dopo tutti gli effetti di fine turno** (periodici inclusi) del turno in cui si gioca X. Nel turno della giocata la vulnerabilità vale contro ogni gruppo di velocità. | D71 (M1); contratto d50 1.1 |
| RP-17 | **Uscita senza giocare:** se a fine turno N il nome manca sia dalla mano sia dal mazzo, il gettone resta per tutto N+1 (periodici inclusi), poi cade. Finché una copia è in mano o nel mazzo non ha timer. Il client avvisa prima di scartare l'ultima copia di una carta che tiene un gettone. | D71 (G5); contratto d50 1.1 |
| RP-18 | **Carta mostrata:** la copia trovata si mostra a faccia in su solo finché quella copia è in mano; dopo uno scarto resta soltanto il segnalino col nome. È una vista (un promemoria), non uno stato fisico della carta. | D58; D69 (d); D71 (K1) |
| RP-19 | **Se non la trovi:** si pesca normalmente, si applicano solo i guadagni «Se non lo trovi» (ridotti, scritti sulla carta), non si crea alcun gettone né carta mostrata; il ripiego sostituisce il premio pieno, non si somma e non toglie gettoni già presenti. | D72; contratto d50 1.1 |
| RP-20 | **Più annunci:** gettoni indipendenti, fattori moltiplicati (due ×1,5 danno ×2,25, prima dei troncamenti del percorso R05), nessuna fusione e nessun tetto speciale. | D66; D69 (c); contratto d50 1.1 |
| RP-21 | A fine partita, a eliminazione e a forfait gettoni e carte mostrate si tolgono. Sul gettone legato il client mostra «∞». | D69; contratto d50 1.1 |
| RP-22 | Nel formato della bozza il passo `search` può scrivere `foundGains` e `missedGains` (mappe di risorse non negative): si applica solo la mappa dell'esito, dopo la ricerca; senza queste mappe la ricerca conserva i guadagni esterni. `turnsIfNotFound` resta leggibile per le vecchie bozze e non crea gettoni. | contratto d50 1.1; D72 |

## 4. Parole chiave

- **Annuncia X** (RP-13…RP-22) e **«Ultimo colpo»** (RP-3) sono le due definite finora. Altre parole chiave: ammesse se accorciano davvero i testi e restano intuitive, ciascuna proposta con la sua definizione e approvata come le carte; nessuna risorsa nuova ([D78](../../set-base-decisioni.md#decisioni-del-proprietario), che rivede D8). Le definizioni stanno qui finché le regole restano nel playground ed entrano nel regolamento a SB-28; i testi per i giocatori le usano in SB-25.

## 5. Principi di composizione che le regole presuppongono (D52, D60–D62)

Non sono regole di partita ma vincoli sulle carte delle liste ([D52](../../set-base-decisioni.md#decisioni-del-proprietario), [D60–D62](../../set-base-decisioni.md#decisioni-del-proprietario)):

- nessuna parata pura: una difesa che vale solo nel turno dà anche circa +5 della risorsa del personaggio o una piccola cura per le generiche (D52 (1));
- ritmo caricare-colpire-parare: colpo annunciato da uno stato visibile, accumulo rischioso con esposizione anche il turno dopo (D52 (2)); il caricamento è un effetto, non un tipo di carta, e può averlo anche un colpo (D54);
- in ogni starter (D61, D62): **2 copie di un caricamento NC** cercano **2 copie di un colpo NC**, più **1 copia di un diverso caricamento NC** che cerca **1 colpo raro**; ogni caricamento cerca un solo binding esatto. D61 precisa D52 (3), che prevedeva una coppia per personaggio: per Sergio e Duccio resta aperta la [Q11](../../set-base-plan.md#decisioni-ancora-aperte);
- il caricamento dà, da zero e dopo il fine turno, risorse sufficienti per giocare il colpo cercato; il colpo NC è potente e affidabile, il raro ha un picco maggiore legato alla preparazione o al tavolo (D63);
- formato **20 carte regolari, massimo 2 copie** per mazzo (D1, D94 (1)); 120 titoli nel set, 20 regolari per starter (D60, D79).

## 6. Bot e misura (come le regole sono lette dai bot)

- I bot ricevono solo ciò che un giocatore può vedere (R08). Leggono i gettoni e le carte scoperte; non leggono mosse pendenti, mano coperta né ordine del mazzo ([contratto d50 1.1](sb-16g-2b1-rules.md), passo 1; D77 (4)).
- Il bot dei passi 2 e 3 è **consapevole del colpo letale**: si para o si cura se il colpo mostrato lo porterebbe a terra, colpisce se un suo colpo, amplificato dal gettone, porta a terra l'avversario, sceglie la patta se la sconfitta è inevitabile, evita le mosse che lo espongono da sé; senza pianificare più turni e senza mano coperta ([D76](../../set-base-decisioni.md#decisioni-del-proprietario), [D77](../../set-base-decisioni.md#decisioni-del-proprietario)).
- Le tre politiche sul colpo cercato (`ChargeMeasureTest`): «sempre», «attendi», «caso» ([D77](../../set-base-decisioni.md#decisioni-del-proprietario) (5); [contratto d50 1.1](sb-16g-2b1-rules.md)).
- I criteri di bilanciamento si leggono sulle sole partite fra bot euristici ([D93](../../set-base-decisioni.md#decisioni-del-proprietario)); fino a SB-18 vale la soglia minima di [D95](../../set-base-decisioni.md#decisioni-del-proprietario) (35–65%, patte al massimo 10%, durata entro 12 turni fuori dagli specchi). Livelli dei bot: [D85](../../set-base-decisioni.md#decisioni-del-proprietario).

## 7. Decise, da attuare in SB-16i (NON sono ancora regole)

**Aggiornata il 14 novembre 2026 con [D97](../../set-base-decisioni.md#decisioni-del-proprietario)**, che approva la [proposta 1.6](sb-16i-proposta.md) con modifiche e prevale sui punti qui sotto dove dice diversamente: la parola chiave di velocità si chiama **«Gioca d'anticipo: E»**; con «Annuncia X o Y» **sceglie il giocatore quando gioca il caricamento**, fra i nomi con almeno una copia nel mazzo, e il gettone si lega al nome scelto e trovato; **dopo ogni ricerca, anche a un nome, il mazzo si mischia**; il premio «Se lo trovi» resta quello della 1.5 e paga di sicuro solo il colpo per cui la carta è fatta; la last resort cresce con la parola chiave **«Rincara X (Y a sé)»**. Le definizioni entrano nelle sezioni 3–6 con la versione 1.1, nella Fase B.

Contenuti di [D94](../../set-base-decisioni.md#decisioni-del-proprietario) e [D95](../../set-base-decisioni.md#decisioni-del-proprietario), decisi dal proprietario il 14 novembre 2026 e da attuare in [SB-16i](../../set-base-plan.md#sb-16i--correzione-16-meccaniche-di-sistema-e-soglia-minima) dopo la Fase A (proposta e STOP). **Fino ad allora il playground si comporta come nelle sezioni 1–6.**

- **«Annuncia» con al massimo due nomi** (D94 (2)), di norma il colpo raro e quello comune dello stesso personaggio; una parola chiave di gruppo solo se resta leggibile; gettone e vulnerabilità legati al nome trovato come oggi. La proposta dice come si sceglie il colpo cercato, come lo sceglie il bot e quali premi cambiano; si misura in un solo giro sul 20/2 ([nota sulle ricerche fallite](../../reports/set-base/ricerche-fallite-20-2.md)).
- **Parola chiave modificatore** «se risolvi prima del bersaglio: effetto aggiuntivo» (D95 (1)), per dare peso alla velocità di Mara; riusabile in altre carte.
- **Carte che abbassano o tolgono la TOXICITY** per gli starter che oggi non hanno risposta; **nessuna regola nuova**, R06 resta com'è (D95 (1)).
- **Last resort che cresce:** a ogni giocata della propria last resort danni e contraccolpo aumentano di un valore scritto sulla carta (diverso da carta a carta), come il «commander» di Magic: l'obiettivo è che al last resort la partita si chiuda in pochi turni (D95 (1)).
- **Piera: un po' meno muro** contro i colpi, il ruolo di muro resta (D95 (1)).
- **Soglia minima** per gli starter fino a SB-18, anche per Sergio e Duccio in SB-17 e SB-18 (D95 (2), (4)); criteri completi di nuovo in SB-20 e SB-21 (D95 (5)).
- **Tetto di SB-16i** (D95 (3)): Fase A di proposta e STOP, poi un giro e al massimo una correzione numerica, poi SB-17 comunque, con gli scostamenti dichiarati.
- **Formato:** resta 20 carte e 2 copie (D94 (1)); il range 20–30 non si adotta.

## 8. Fonti superate: non seguirle

Quando una di queste fonti dice diversamente da questo documento, vale questo documento.

| Fonte | Cosa non vale più | Superata da |
|---|---|---|
| D54 (1) | L'oggetto trovato dalla ricerca va sul campo | D70 (2) |
| D58 | La carta trovata resta scoperta «finché non viene giocata o scartata» (come testo) | D71 (K1) |
| D59, D65 | Minimo di due turni di vulnerabilità; legame alla precisa copia; ricerca fallita con i due turni minimi | D69, D71, D72 |
| D69 (a)–(d) | Gettone che cade a fine del gruppo di velocità; promemoria finché c'è il gettone; gettone anonimo di due turni a ricerca fallita | D71, D72 |
| D70 (1) | Gettone della ricerca fallita per due turni | D72 |
| D55, D52 (3) | Una coppia caricamento-colpo per personaggio; composizioni di [sb-16d-proposta.md](sb-16d-proposta.md) | D61–D63, D79 |
| [sb-16g-proposta.md](sb-16g-proposta.md) | Tabella di potenza della 1.2; Impatto 30, Chiave da tredici 22 e Lavoro fatto bene 14 + 7 della 1.4 | D82 (la 1.4 sostituisce la tabella della 1.2); D90 (valori in vigore: [bozza di riferimento](bozza-di-riferimento.md)) |
| Proposta 1.6 di D92 | Proposta separata su Mara, Piera e Celestina | D95 (sostituita da SB-16i) |
| «Contratto d50 1.0» (D75) | Versione precedente del contratto | contratto d50 1.1 |

Le carte e i numeri in vigore sono quelli della [bozza di riferimento](bozza-di-riferimento.md), non quelli delle proposte.
