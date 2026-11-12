# SB-16b — Revisione critica delle regole, Fase A: rapporto del game designer

**Fase A fatta il 12 novembre 2026; Fase B fatta lo stesso giorno** con il proprietario
([D49](../../set-base-plan.md#decisioni-del-proprietario), [blocco](../../set-base-plan.md#sb-16b--revisione-critica-delle-regole)).
Le decisioni della Fase B sono D50–D53 e la sezione [Fase B](#fase-b--decisioni-e-misure-aggiuntive) le riassume con le misure fatte
durante il confronto. Il resto del rapporto è la Fase A com'era, con due correzioni segnate. Regolamento, documento del set, codice,
test, catalogo e bozza non cambiano. Esecutore: Claude Opus 5.5.

## Sintesi

1. Il cuore del gioco funziona e va protetto: scelta simultanea, risorse pubbliche, costi pagati prima degli effetti, mazzo che finisce senza rimescolare, risorse diverse per i cinque personaggi.
2. Il punto debole è il turno decisivo. Oggi chi muore colpisce lo stesso (R04): a fine partita la mossa giusta è sempre «colpisci più forte che puoi», e la velocità non conta.
3. Coi bot si vede nei numeri: 16,9% di patte (34,8% nello specchio di Piera); la priorità sposta il valore di una carta di 0,1 HIT al massimo.
4. **P1 — Chi è a terra non colpisce (R04).** Si annulla la mossa di un autore già morto quando tocca al suo gruppo di velocità, salvo quelle su di sé. Il salvataggio in extremis di D48 resta.
5. P1 misurata: patte da 16,9% a 9,4%, durata identica, matchup spostati di 7 punti al massimo; la velocità torna a valere.
6. **P2 — L'ultimo a cadere (R06).** Se nello stesso turno muoiono tutti, vince chi ha più HEALTH; a parità resta la patta. Da sola porta le patte all'1,4%, insieme a P1 allo 0,9%.
7. **P3 — Nessuna parata pura (set).** Le difese che valgono solo nel turno e non danno altro sono fra le carte peggiori del banco: ognuna dia anche un piccolo guadagno.
8. Niente da cambiare su mano, mazzo, bound, last resort, passo, oggetti, tipi di danno e decadimento di L.
9. Costo di P1 e P2: poche righe nel regolamento e nel server, test, un'etichetta nel client, un giro di misura sui cinque starter. Con P1 Spazienzio–Beppe esce dal 40–60% di mezzo punto.
10. D8 e D48 sono rispettate. Su D12 decide il proprietario: le regole nuove nel playground fino a SB-28 (raccomandato) o subito nel gioco vivo.

## Come ho lavorato

**Letture.** [Regolamento 1.13](../../game-rules.md), [Set Base 0.1](../../sets/base.md), il [piano](../../set-base-plan.md) nelle
sezioni indicate dal prompt, le [schede dei personaggi](../../design/set-base/schede-personaggi.md), la
[griglia](../../design/set-base/griglia.md), il [listino](../../design/set-base/listino.md) e i rapporti [SB-7](sb-7-report.md),
[SB-10a](sb-10a-report.md), [SB-12a](sb-12a-report.md), [SB-13](sb-13-report.md), [SB-14](sb-14-report.md) e [SB-15](sb-15-report.md).
Per capire che cosa fa davvero il server ho letto anche `Game`, `Move` e `Character`.

**Dichiarazione.** Per errore ho letto l'elenco «Idee del proprietario per la Fase B» nella sezione SB-16b e la frase sull'alcol nella
riga D49, che il prompt chiedeva di non leggere. L'idea dell'alcol compare anche nelle sezioni SB-12b e SB-16, che il prompt chiedeva di
leggere. Le proposte di questo rapporto nascono dalle misure qui sotto, e nessuna riguarda l'alcol come riduzione dei danni. Se una
proposta coincide con un'idea di quell'elenco, la coincidenza va pesata sapendo questo.

**Misure.** Ho provato le varianti di regola P1 e P2 su una copia del server fuori dal repository (`git archive` del commit `7829b8f`).
Ogni variante si accende con una proprietà di sistema; il diff è nelle [evidenze](sb-16b/variante-regole.diff). Sono state misurate
quattro varianti: base, P1 (chiamata «morto» nei file), P2 («spareggio») ed entrambe. Per tutte vale lo stesso banco
SB-7:
- 2000 partite per cella e 480.000 per variante;
- stessi semi, da 7.000.000;
- stessa bozza, SHA-256 `c43b37a5…de842cda`;
- quattro stili: aggressivo, prudente, risorse, com.

Ho rifatto anche il listino di priorità e A iniziale (SB-10a, àncora 7 HIT) per base e P1.

**Calcolo.** Circa 8 minuti in tutto, su un tetto di un'ora:
- 2,5 minuti per un lotto di prova da 1000 partite per cella, scartato (sotto);
- 4 minuti per il banco definitivo;
- 1,3 minuti per il listino.

**Limite principale.** I bot non prevedono la mossa dell'avversario né l'ordine di risoluzione. Con P1 non tengono A da parte per il turno
decisivo e non evitano un attacco che arriverà tardi. Gli effetti di P1 sulle decisioni sono quindi un minimo; i matchup con giocatori
umani possono spostarsi in modo diverso.

## Il gioco com'è

### Che cosa decide il giocatore in un turno

In mano ha circa sei carte: la basic, le due bound e tre carte regolari. Ne sceglie una e un bersaglio, senza vedere la scelta
dell'avversario. Vede però le sue risorse, i suoi oggetti e quante carte ha. Le scelte vere sono tre:
- **quanto spendere ora e quanto tenere:** V da caricare, A da spendere, L da consumare subito;
- **colpire, prepararsi o difendersi:** risorse, oggetti, parate, contromosse;
- **quale carta sacrificare** quando gioca una bound, che chiede di scartarne una regolare.

### Dove nascono tensione e scelte interessanti

- **La lettura dell'avversario.** Le risorse sono pubbliche, la mano no: «ha 40 V, sta per scaricare» è una lettura vera. Parate e
  contromosse la premiano.
- **Le identità delle risorse.** V si accumula e si scarica (Spazienzio). T è un veleno che non cala (Celestina). L si spende subito e
  costa A a fine turno (Piera). A è insieme moneta e velocità (Mara). Beppe vive di V e oggetti. Sono cinque modi diversi di gestire il
  tempo, senza nessuna risorsa nuova (D8).
- **Le contromosse.** Annullano una mossa che l'avversario ha già pagato: lo puniscono due volte.
- **Il mazzo come orologio.** Venti carte, nessun rimescolamento. Nessuna partita su 480.000 arriva al limite di turni.

### Dove il gioco è piatto, ripetitivo, opaco o lento

| Problema | Evidenza |
|---|---|
| **Piatto: il turno decisivo non ha scelta.** Chi muore nel turno colpisce comunque (R04). Se posso ucciderti, mi conviene colpire forte qualunque cosa tu faccia, e il colpo reciproco finisce in patta. | 16,9% di patte. Specchi: Piera 34,8%, Beppe 25,1%, Celestina 22,4%; Piera–Beppe 27,9%. Il criterio del piano dice «pochi». |
| **Complicato senza profondità: la velocità non conta.** Il regolamento e il client spiegano l'ordine per priorità, poi ALERTNESS dopo i costi, poi posto. Ma dove conta di più, alla morte, l'ordine non decide niente. | Listino: una carta a priorità 0 o 2 vale come una a priorità 1, a ±0,1 HIT. Spazienzio con A iniziale +10 non vince di più (0,463 contro 0,488 con −10). |
| **Piatto: la fine del mazzo si gioca da sola.** A mazzo vuoto restano la last resort (5 HIT a sé e il danno al bersaglio) e poco altro: chi ha più salute vince, e con poca differenza si muore insieme. | Correlazione 0,86 fra le patte di un incontro e la frequenza con cui arriva la last resort. La last resort arriva a Piera nel 70,8% delle partite, a Beppe nel 58,7%, a Celestina nel 41,5%. |
| **Turni sprecati: le parate pure.** Una difesa che vale solo nel turno non dà niente se l'avversario non attacca. Anche quando funziona, scambia il proprio colpo con uno sconto sul suo, e in una gara a chi arriva prima a zero si perde terreno. | Ablazioni SB-12a: senza YouStop e Tartaruga Spazienzio guadagna circa 14 punti, senza Paraurti Mara 2,5. Quota quando giocata: Tartaruga 0,324 (Spazienzio) e 0,229 (Mara), Paraurti 0,244, Sotto il cofano 0,315. Le difese che danno anche altro vanno bene: MadeOfStone (+10 V) 0,514, Il bancone regge (+5 L) 0,525. |
| **Ripetitivo: la bound di danno.** È la mossa più giocata da quattro personaggi su cinque. | Per partita: Spazienzio 4,1, Piera 4,0 (nel 98,9% delle partite), Celestina 4,0, Beppe 3,6, Mara 1,9. Circa una mossa su tre è una bound. |
| **Lento: le partite con gli avanzati.** | Obiettivo 6–12 turni. Media 13,5; Piera e Celestina in specchio 16–17. È questione di numeri (salute, danni) per SB-21, non di sistema. |
| **Opaco, poco: dettagli del regolamento.** | R06 dice «nessuna precedenza garantita fra timer simultanei», ma il server li esegue in ordine di creazione. Il decadimento di L (A/2, poi L/2+1) è difficile da spiegare (vedi «Niente da cambiare»). |

**Prove umane.** SB-12b: Mara sembra un poco più debole di Spazienzio. SB-16: Celestina sembra un poco più debole di Beppe, al contrario dei
bot. Nessun problema di leggibilità. Il salvataggio in extremis di Piera è piaciuto (D48). Con P1 i bot si avvicinano a queste impressioni,
senza che lo provi: Mara guadagna un punto contro Spazienzio e Celestina–Beppe passa da 0,531 a 0,502.

## Proposte

In ordine di valore. P1 e P2 toccano il regolamento, P3 la griglia e la bozza, P4 è una pulizia.

### P1 — Chi è a terra non colpisce (R04)

**Problema.** Il turno decisivo è il momento più teso della partita e oggi non ha scelta. Chi è stato ucciso prima di agire colpisce
lo stesso, quindi:
- colpire forte domina ogni altra mossa;
- la velocità (priorità, A dopo i costi) non decide niente;
- il colpo reciproco finisce in patta.

Tre conseguenze già misurate. Le patte sono il 16,9%. La priorità vale ±0,1 HIT. La perdita di A data dalla L di Piera non costa
nulla: Piera finisce le partite con A −20 se vince e −47 se perde, e il suo mazzo sta al 52% di quota.

**Cambio, scritto come andrebbe nel regolamento (R04).** La frase «Una mossa già presentata continua anche se l'autore muore prima di
agire o durante il proprio effetto» diventa:

> Le mosse si risolvono per **gruppi di velocità**: un gruppo raccoglie le mosse con la stessa priorità e la stessa ALERTNESS dopo i
> costi, nell'ordine del punto 3. All'inizio di ogni gruppo si guarda chi è morto (HEALTH <= 0). La mossa di un autore morto
> all'inizio del proprio gruppo è annullata, salvo che bersagli l'autore stesso o un oggetto vicino a lui: chi è a terra può ancora
> salvarsi, ma non colpisce più. Dentro un gruppo le mosse restano simultanee: una mossa continua anche se l'autore muore per una
> mossa dello stesso gruppo o durante il proprio effetto.

Le frasi seguenti di R04 restano:
- un bersaglio morto riceve gli effetti già programmati;
- il turno non si interrompe;
- una mossa annullata ha già pagato, scarta e pesca, e una bound annullata non scarta la carta aggiuntiva.

L'annullamento non introduce niente di nuovo: è la «mossa annullata» che il regolamento ha già. Esiste già anche una carta che fa la
stessa distinzione: AmphetamineReflexes annulla le mosse degli «avversari vivi».

**Effetto atteso al tavolo.**
- **Il turno decisivo diventa una lettura.** Se posso ucciderti e sono più veloce, vinco. Se tu sei più veloce, rischio che il mio
  colpo non parta. Allora conviene curarmi, difendermi o giocare una carta a priorità alta.
- **La velocità acquista valore per tutta la partita.** Tenere A per il finale diventa un piano.
- **Il dilemma di Mara diventa vero.** Pagare A significa colpi più forti, tenerla significa agire prima quando conta.
- **Le risorse si legano fra loro.** La L costa davvero (Piera), e le carte che tolgono A all'avversario valgono di più.
- **Il salvataggio in extremis resta.** Piera a terra che si cura con la mossa già presentata si salva come oggi (D48).

**Misura (banco, base → P1).**

| | base | P1 |
|---|---:|---:|
| Patte | 16,9% | 9,4% |
| Turni medi | 13,54 | 13,54 |
| Quota del primo posto | 0,503 | 0,503 |
| Mosse annullate | — | 139.222 in 480.000 partite, circa 29 ogni 100 |
| Quota del mazzo: Spazienzio, Mara, Celestina, Piera, Beppe | 0,468 · 0,484 · 0,519 · 0,520 · 0,514 | 0,468 · 0,489 · 0,517 · 0,491 · 0,538 |

- **La durata non cambia.** La regola agisce solo nel turno in cui qualcuno è già morto, che è comunque l'ultimo. Cambia chi vince,
  non quanto si gioca.
- **Le patte restanti** sono colpi reciproci a pari velocità, soprattutto negli specchi, dove i due personaggi partono dalla stessa A:
  Celestina 19,3%, Beppe 19,4%, Piera 15,9%. Poi ci sono le morti di fine turno per veleno.
- **Matchup.** Spostamenti fino a 7 punti: Piera–Beppe 0,525 → 0,452, Mara–Piera 0,443 → 0,493. Fuori dai criteri finisce un solo
  incontro: Spazienzio–Beppe 0,406 → **0,395**, cioè Beppe al 60,5%. Celestina–Piera va a 0,594, al bordo. La tabella completa è
  [sotto](#matchup-nelle-quattro-varianti).
- **Il posto non conta**, perché dentro un gruppo le mosse restano simultanee. Una prima versione che controllava la morte mossa per
  mossa dava un vantaggio a chi siede primo (0,508 nel lotto di prova) ed è stata scartata.

**Misura (listino, base → P1).** La tabella dice quanti HIT in più (+) o in meno (−) deve fare una carta gratuita per valere quanto
una a priorità 1 da 7 HIT.

| Contesto | Priorità 0 (più lenta) | Priorità 2 (più veloce) |
|---|---|---|
| Spazienzio | +0,0 [−0,1–0,1] → **+0,3** [0,2–0,5] | −0,0 [−0,1–0,0] → **−0,2** [−0,3–−0,1] |
| Mara | +0,1 [−0,0–0,1] → **+0,3** [0,2–0,3] | −0,1 [−0,1–−0,0] → **−0,2** [−0,3–−0,2] |

- **La velocità ha un prezzo**, anche con bot che non la sfruttano: circa mezzo HIT fra la più lenta e la più veloce.
- **L'A iniziale di Spazienzio** (quota con −10 e con +10): base 0,488 e 0,463, P1 **0,457 e 0,493**. Con P1 più A aiuta.
- **Per Mara l'A resta prima di tutto moneta:** 0,210 e 0,748, sia in base sia con P1.
- **Le patte nei contesti del listino** scendono: per Spazienzio dal 16% al 2–3%, per Mara dal 15–20% al 4–7%.

**Costo.**
- **Regolamento 1.14:** il paragrafo di R04 sopra, con versione e motivazione.
- **Server:** in `Game.resolveMoves`, un controllo all'inizio di ogni gruppo. Il prototipo sono circa 25 righe, per un esperimento e
  non per l'adozione. In più il motivo dell'annullamento nel registro del turno.
- **Test:**
  - attacco di un autore già morto, annullato;
  - cura su di sé di un autore a terra, che si risolve (il caso di D48);
  - colpo reciproco nello stesso gruppo, che resta simultaneo;
  - bound annullata, che non scarta;
  - costi pagati e pesca.
- **Client:** l'etichetta «(annullata)» esiste già nel registro della risoluzione. Va aggiunto il motivo, «a terra». Mostrare la velocità di
  ogni mossa (priorità e A dopo i costi) diventa più utile: da annotare per SB-31.
- **Bot:** nessun cambio obbligatorio. Un'euristica per tenere A quando la morte è vicina renderebbe le misure più fedeli (SB-30).
- **Bilanciamento:**
  - un giro sul banco dei cinque starter (circa 4 minuti di calcolo) con la correzione di Beppe;
  - il listino della priorità nelle schede;
  - Sergio e Duccio nascono con la regola; la last resort di Duccio (LR-ROC) ha priorità 0 e con P1 conta.

**Rischi e cosa si perde.**
- **«Ho giocato il colpo e non è successo niente».** La frustrazione è reale se il motivo non si vede. La mitigano l'A pubblica e
  l'etichetta nel client.
- **Chi tiene A guadagna.** Beppe, che finisce le partite con 25 A, sale di 2,4 punti. Piera, la cui L consuma A, scende di 2,9. È il
  comportamento voluto, ma va ribilanciato.
- **Un concetto in più nel regolamento**, il gruppo di velocità. Per il giocatore si dice in una riga: «chi è più veloce colpisce prima;
  a pari velocità si colpisce insieme».
- **Si perdono** il KO reciproco come colpo di scena e la certezza che un attacco presentato arrivi. Chi è a terra e ha scelto di
  attaccare non ha più «l'ultimo colpo»: il flavour di D48 resta solo per le mosse su di sé.
- **Carte che bersagliano sé ma toccano l'avversario.** Nel Set Base 0.1 nessuna. Da controllare nella bozza e nelle carte nuove;
  altrimenti la regola si scrive sugli effetti invece che sul bersaglio.
- **Costi in HEALTH (Duccio, il Sant'Incasso di D27).** *Corretto in Fase B: Sant'Incasso è il nome di prima di Duccio, non un
  altro personaggio.* Oggi chi si porta a zero pagando HEALTH colpisce comunque. Con P1 il suo colpo si annulla
  e la mossa diventa una trappola. Va deciso (domanda 4).

### P2 — L'ultimo a cadere (R06)

**Problema.** Anche con P1 restano le patte a pari velocità (9,4%), soprattutto negli specchi e nella gara delle last resort. Una
partita di 16 turni che finisce senza vincitore è l'esito meno soddisfacente possibile.

**Cambio, scritto come andrebbe nel regolamento (R06).** «Un solo superstite vince; zero superstiti significa patta» diventa:

> Un solo superstite vince. Se non resta nessun superstite, vince chi, fra i personaggi morti in quel turno, ha la HEALTH più alta;
> a parità resta la patta. Chi ha fatto forfait non conta. Il draw tecnico al riavvio e le scadenze simultanee restano patte.

**Effetto atteso al tavolo.**
- **Il colpo in eccesso conta.** Portare l'avversario più sotto zero di quanto si scende noi vince.
- **Contano anche i dettagli del turno decisivo:** curarsi, difendersi, i 5 HIT a sé della last resort e i costi in HEALTH.
- **Il finale a mazzo vuoto ha un vincitore**, chi ha condotto meglio la gara.

**Misura.**

| | base | P2 | P1 + P2 |
|---|---:|---:|---:|
| Patte | 16,9% | 1,4% | 0,9% |
| Quota del primo posto | 0,503 | 0,503 | 0,502 |

Da sola, P2 sposta i matchup di 3,2 punti al massimo (Celestina–Piera 0,570 → 0,538). Insieme a P1 Spazienzio–Beppe resta a 0,396.

**Costo.**
- **Regolamento:** una frase di R06.
- **Server:** circa 10 righe in `Game.getWinner`, il motivo dell'esito («ultimo a cadere») e test.
- **Client:** una riga nel riepilogo di fine partita. La HEALTH sotto zero va mostrata in modo leggibile.
- **Bot:** nessun cambio.
- **Bilanciamento:** stesso giro di P1.
- **FFA:** il prototipo vale solo per il 1v1. Per l'FFA confronterebbe anche chi è uscito nei turni prima, per questo il testo dice «fra i
  personaggi morti in quel turno».

**Rischi e cosa si perde.**
- **La vittoria ai punti** è meno pulita di un KO e va spiegata bene.
- **La patta diventa rara, non sparisce.** Resta quando chi muore finisce con la stessa HEALTH, per esempio Banzai!!! contro Banzai!!!
  dalla stessa salute e alla stessa velocità. *Corretto in Fase B: la prima stesura diceva «si perde la patta».* Se al proprietario
  piace la patta, P1 da sola ne lascia il 9,4%, quasi tutte negli specchi.

**P1 e P2 si completano.** P1 dà una scelta al turno decisivo, P2 gli dà sempre un esito. Raccomando entrambe. Se se ne vuole una sola,
P1 vale di più per il gioco e P2 costa meno.

### P3 — Nessuna parata pura (griglia e bozza)

**Problema.** Una parata pura è una difesa che vale solo nel turno e non dà altro. È una scommessa con un pagamento storto:
- se l'avversario non attacca, il turno è perso;
- se attacca, si scambia il proprio colpo con uno sconto sul suo, e in una gara a chi arriva prima a zero conviene solo contro un colpo
  molto più grosso del proprio.

In un mazzo di 20 carte con tre regolari in mano, una carta che vale solo in una situazione intasa la mano.

**Evidenza.**
- **Ablazioni SB-12a:** senza YouStop e Tartaruga Spazienzio guadagna circa 14 punti, senza Paraurti Mara 2,5.
- **Quota quando giocata, nel banco di oggi:**
  - Tartaruga sul marciapiede: 0,324 con Spazienzio, 0,229 con Mara;
  - Tra due paraurti: 0,244;
  - Sotto il cofano: 0,315.
- **Le difese che danno anche qualcosa stanno in linea:** MadeOfStone (+10 V) 0,514, Il bancone regge (+5 L) 0,525.
- **Cautela:** la quota quando giocata ha una distorsione, perché le difese si giocano quando si è sotto pressione. In più i bot non
  leggono l'avversario. Il numero più pulito è l'ablazione. L'aritmetica della gara va nella stessa direzione.
- **Contro l'idea della prova umana:** il proprietario non ha segnalato le parate. La sensazione «Mara un poco più debole» è compatibile
  con due parate pure nel suo starter (Tartaruga e Paraurti), ma non lo prova.

**Cambio, scritto come principio della griglia** (§ triangoli, difese):

> Ogni difesa che vale solo nel turno dà anche un effetto che resta se l'avversario non attacca: circa +5 della risorsa del
> personaggio, o una piccola cura per le generiche. Le difese che durano più turni o che si ricaricano, come MadeOfStone e Il bancone
> regge, sono già così.

**Slot toccati.**
- Negli starter: GEN-13 Tartaruga sul marciapiede (Spazienzio e Mara), MAR-AR4 Tra due paraurti, GIG-AR4 Sotto il cofano. Esempi da
  misurare: Tartaruga con una cura di 3, Paraurti con +5 A, Sotto il cofano con +5 V.
- Da progettare: CES-AR5 (Sergio) e ROC-AR2 (Duccio).
- Da ripensare: GEN-11, cioè CantFeelAnything, a cui la griglia ha tolto il +10 A.

**Effetto atteso al tavolo.** Difendersi diventa «prepararsi coprendosi»: una lettura sbagliata costa meno, e quella giusta paga come
oggi. Le contromosse restano la scelta secca, «tutto o niente».

**Costo.**
- **Regolamento:** nessun cambio.
- **Griglia e bozza:** tre carte in tre starter.
- **Bilanciamento:** lo stesso giro di P1.
- **Bot:** nessun cambio. Lo stile «risorse» vedrà il guadagno e le giocherà di più.

**Rischi e cosa si perde.**
- **Difese troppo buone** allungano partite che sono già sopra i 12 turni. Il guadagno va tenuto piccolo e la durata controllata nel
  giro.
- **Si confondono un poco** la difesa e la generatrice.
- **Si perde** la difesa «pura» come scommessa secca. Quel ruolo resta alle contromosse.

### P4 — Pulizia: ordine dei timer (R06)

**Problema.** R06, punto 3, dice «nessuna precedenza garantita fra timer simultanei». Il server invece li esegue in ordine di creazione,
perché li tiene in un insieme ordinato. Una regola che dichiara un caso indeterminato quando il codice è determinato non si può testare,
e lascia un dubbio a chi scrive le carte.

**Cambio.** «Più timer che scadono nello stesso turno si eseguono in ordine di creazione.»

**Effetto.** Oggi quasi nessuno: i timer sono pochi, MarvelousCocktail e BadTrip. Con il resto del pool l'ordine diventa prevedibile.

**Costo.** Una frase e un test. **Rischi:** nessuno.

### Niente da cambiare

- **Mano a sei, una pesca per mossa.** Tre carte regolari in mano tengono le decisioni piccole e veloci, e la bound dà senso allo scarto.
- **20 carte, 2 copie, niente rimescolamento (D1).** Il mazzo è l'orologio: nessuna partita al limite di turni. Il formato da 25 si
  valuta in SB-23.
- **Bound gratuite e deboli, con scarto (D2).** Una mossa su tre è una bound, ma è il loro ruolo: garantiscono sempre una mossa (D5) e
  trasformano una carta morta in qualcosa. Se sono troppo frequenti, la leva è il prezzo delle carte regolari in SB-21, non la bound.
  Suggerisco di aggiungere al banco di SB-20 la quota di mosse da bound per mazzo.
- **Last resort (D4, D29).** Chiudono la partita, e i 5 HIT a sé ne fanno una gara. Il loro problema era la patta, che risolvono P1 e P2.
- **Niente passo (D5).**
- **Decadimento di L (R06, punto 2).** «Perde L/2+1» sembra strano, ma ha una ragione: dimezzando per difetto, L resterebbe a 1 per
  sempre. Il +1 la riporta a zero. Resta com'è; ai giocatori lo spiegherà SB-25.
- **T permanente con immunità.** È l'identità di Celestina. Lo specchio lungo (16,6 turni) è una questione di numeri (D43), non di
  sistema.
- **Oggetti pubblici con capacità.** Steal va male in mano ai bot (quota quando giocata 0,08–0,28), ma è una carta, non una regola:
  SB-21 e SB-22.
- **Tre tipi di danno.** HIT, CUT e POISON con difese specifiche rendono le difese interessanti, per esempio MadeOfStone contro i CUT di
  Mara.
- **Durata.** Sopra l'obiettivo con gli avanzati, ma si corregge coi numeri (salute, danni) in SB-21. P1 e P2 non la cambiano.

## Da proteggere

1. **Scelta simultanea con risorse e oggetti pubblici e mano nascosta.** È la base di ogni lettura.
2. **Costi pagati prima degli effetti, ordine dopo i costi.** Lega spesa e velocità in modo elegante; con P1 si vede.
3. **Contromosse che annullano una mossa già pagata.** Sono la scommessa più interessante del gioco: da tenere anche se i bot le giocano
   male (D41).
4. **Una mossa sempre giocabile (D2, D5).** Nessun turno senza mosse legali in 480.000 partite.
5. **Il mazzo come orologio, senza rimescolamento (D1).**
6. **Le identità delle risorse.** V da caricare, T che non cala, L da spendere subito a costo di A, A moneta e velocità, HEALTH come costo.
   C'è profondità senza risorse nuove (D8).
7. **Neutralità del posto.** La quota del primo posto è 0,503. Ogni cambio dell'ordine deve conservarla: P1 lo fa grazie ai gruppi
   simultanei.
8. **Il salvataggio in extremis (D48).** È flavour che il tavolo ha apprezzato: P1 lo tiene.
9. **Starter nei criteri e bozza stabile.** I cambi devono essere pochi e misurati, e ciascuno va dichiarato.
10. **Leggibilità.** SB-16 non ha segnalato problemi: niente eccezioni nuove, al massimo un'etichetta nel client.

## Decisioni del proprietario discusse

| Decisione | Esito | Motivo |
|---|---|---|
| D1 | Rispettata | Il mazzo da 20 senza rimescolamento è l'orologio del gioco. |
| D2 | Rispettata | Bound frequenti, ma è il loro ruolo; la leva è il prezzo delle regolari. |
| D3 | Rispettata | La basic presa di oggetti non è in discussione. |
| D4 | Rispettata | P2 dà un vincitore alla gara delle last resort. |
| D5 | Rispettata | Niente passo. P1 non crea turni senza mossa: la mossa annullata paga e pesca come oggi. |
| D6, D7 | Rispettate | Struttura dei personaggi invariata. |
| D8 | Rispettata | Nessuna risorsa o parola chiave nuova. P1 usa priorità e ALERTNESS, P2 la HEALTH. «Gruppo di velocità» è una parola del regolamento, non delle carte. |
| D9 | Rispettata | Rarità non toccata. |
| D10 | Non toccata | Perimetro del piano. |
| D11 | Rispettata | P1, P2 e P4 nel regolamento, P3 nella griglia e nella bozza. |
| D12 | **Discussa** | Dove applicare P1 e P2. Raccomando il playground (profilo bozza e runner) fino a SB-28, come la variante di D28, perché il gioco vivo non è misurato con la regola nuova. In alternativa, regolamento 1.14 subito (domanda 3). |
| D13 | Rispettata | Misure in 1v1. P1 e P2 valgono anche in FFA, non misurato. |
| D14 | Rispettata | P3 ridisegna tre carte della bozza. |
| D15 | Rispettata | Flavour non toccato; P1 tiene quello di D48. |
| D16 | Rispettata | Con P1 Spazienzio–Beppe va a 0,395, mezzo punto fuori dal 40–60%: serve un giro. |
| D17, D18 | Rispettate | Stesso runner e stessi bot; il loro limite è dichiarato. |
| D19, D20, D22, D24, D25, D26 | Non toccate | Quick, mazzi salvati, inizio dei lavori, illustrazioni, interpretazioni del piano, bozza esterna. |
| D21 | Rispettata | Il giro dopo P1–P3 è un giro esplicito. |
| D23 | Rispettata | L'ordine dei timer (P4) e il decadimento di L ai giocatori vanno a SB-25. |
| D27, D47 | Rispettate, con una domanda | Il costo in HEALTH resta. Con P1, chi si porta a zero pagando HEALTH perde il colpo: va deciso se vietare quel pagamento (domanda 4). |
| D28 | Rispettata | L resta da spendere subito. P1 dà peso alla perdita di A (Piera 0,520 → 0,491). |
| D29 | Rispettata | Last resort invariate. |
| D30, D31, D32, D37, D40, D42 | Non toccate | Ordine e divisione dei blocchi. |
| D33 | Rispettata | Con P1 cambiano il prezzo della priorità e quello dell'A: da rimisurare (fatto qui per due contesti). |
| D34 | Rispettata | Il punto 3, bound senza parate, resta. P3 aggiunge un principio per le difese regolari. |
| D35 | **Discussa** | P3 tocca tre slot approvati (GEN-13, MAR-AR4, GIG-AR4) e due da progettare (CES-AR5, ROC-AR2). |
| D36 | Rispettata | Tetto delle bound invariato. |
| D38 | Rispettata | Durate nei testi a SB-25; limiti dei bot dichiarati prima di toccare carte (punto 7). |
| D39 | Non toccata | Nome e voce di Spazienzio. |
| D41 | Rispettata | Spazienzio–Mara resta nel 45–55% con tutte le varianti (0,515 con P1). |
| D43, D44, D45 | Rispettate | Le prime leve restano quelle previste; con P1 Beppe sale e Piera scende. |
| D46 | Rispettata | Il profilo bozza è il posto naturale per una variante del playground. |
| D48 | **Discussa, come consente la decisione stessa** | P1 tiene il salvataggio in extremis e toglie solo il colpo di chi è già a terra. Riscrive la frase di R04 che D48 cita. Se il proprietario la preferisce com'è, P2 da sola riduce le patte senza toccare D48. |
| D49 | Questo blocco | Lettura per errore dichiarata sopra. |

## Domande al proprietario

1. **P1, chi è a terra non colpisce.** La adottiamo nella forma che tiene il salvataggio su di sé? *Raccomando sì.*
2. **P2, l'ultimo a cadere.** La adottiamo, o preferisci tenere le patte? *Raccomando sì, insieme a P1.*
3. **Dove applicarle.** Nel playground fino a SB-28 (D12) o subito nel gioco vivo, con il regolamento 1.14? *Raccomando il playground.*
4. **Costi in HEALTH con P1.** Si può pagare HEALTH fino a zero o sotto? *Raccomando di no:* altrimenti la mossa si annulla ed è una
   trappola. I 5 HIT a sé delle last resort sono un effetto, non un costo, e restano.
5. **P3, nessuna parata pura.** Ora sui tre starter, nello stesso giro di P1, o in SB-21 con tutto il pool? *Raccomando ora:* Sergio e
   Duccio nascono così.
6. **Giro di misura.** Va bene un giro sui cinque starter dopo i cambi, prima di SB-17, con un tetto di un'ora?
7. **Dalle tue partite.** Nel turno decisivo sentivi di avere una scelta? La fine a mazzo vuoto ti è sembrata automatica? Hai mai giocato
   Tartaruga o Paraurti con soddisfazione?

## Fase B — decisioni e misure aggiuntive

Confronto con il proprietario il 12 novembre 2026, proposta per proposta. Le decisioni sono registrate nel
[piano](../../set-base-plan.md#decisioni-del-proprietario) come D50–D53.

| Proposta o idea | Esito | Decisione |
|---|---|---|
| P1, chi è a terra non colpisce | Adottata | D50, punto 1 |
| Costi in HEALTH con P1 (domanda 4) | Si paga solo con quello che si ha; eccezione «Ultimo colpo» scritta sulla carta | D50, punto 2 |
| Pavimento a zero per tutte le risorse (idea del proprietario) | Adottato dopo la misura | D50, punto 3 |
| P2, l'ultimo a cadere | Scartata: incompatibile col pavimento | D50, punto 4 |
| Spareggio sulla HEALTH di inizio turno (proposto in Fase B) | Scartato dal proprietario | D50, punto 4 |
| Corazza dell'alcol (idea del proprietario) | Adottata a L/4 dopo la misura | D50, punto 5 |
| Ricerca al posto della pesca (idea del proprietario) | Adottata, da verificare bene | D50, punto 6; D52, punto 3 |
| P4, ordine dei timer | Adottata, nel regolamento 1.14 a SB-28 | D50, punto 7 |
| Dove applicare le regole (domanda 3) | Playground fino a SB-28 | D50, punto 8 |
| Patte al massimo al 10% (idea del proprietario) | In ogni incontro, specchi compresi | D51 |
| P3, nessuna parata pura | Adottata | D52, punto 1 |
| P5, il ritmo caricare-colpire-parare (nata dalle risposte sulle prove umane) | Adottata | D52, punto 2 |
| Giro di misura e struttura della Fase C (domande 5 e 6) | SB-16c, SB-16d, SB-16e, SB-16f | D53 |

**Risposte del proprietario sulle prove umane (domanda 7).**
- **Turno decisivo:** una scelta c'è, ma a metà partita no. C'era solo da accumulare risorse per il colpo più forte.
- **Fine a mazzo vuoto:** va bene così.
- **Parate pure:** le carte meno amate, scartate per giocare le bound, perché non c'era modo di intuire quando sarebbe arrivato il colpo.

Il testo esatto è nel [piano](../../set-base-plan.md#sb-16b--revisione-critica-delle-regole). Da qui è nata P5: rendere leggibili i
colpi forti e rischioso l'accumulo.

**Misure aggiuntive.** Stesso banco della Fase A: 2000 partite per cella, 480.000 per variante, stessi semi, stessa bozza. In tutto
circa 6 minuti, 14 con la Fase A, sul tetto di un'ora.

| Variante | Patte | Turni medi | Primo posto | Spazienzio–Beppe | Quota del mazzo di Mara | Quota del mazzo di Piera | Patte nello specchio di Piera |
|---|---:|---:|---:|---:|---:|---:|---:|
| P1 | 9,4% | 13,54 | 0,503 | 0,395 | 0,489 | 0,491 | 15,9% |
| P1 + pavimento | 11,1% | 13,45 | 0,502 | 0,395 | 0,518 | 0,480 | 34,1% |
| P1 + pavimento + spareggio di inizio turno | 0,9% | 13,45 | 0,502 | 0,403 | 0,518 | 0,492 | 2,6% |
| P1 + pavimento + corazza L/4 | 11,2% | 13,65 | 0,501 | 0,399 | 0,510 | 0,525 | 36,4% |
| P1 + pavimento + corazza L/2 | 11,3% | 13,80 | 0,499 | 0,404 | 0,501 | 0,587 | 39,4% |

- **Il pavimento** ferma a zero l'A di chi beve. Nello specchio di Piera tutte e due finiscono alla stessa velocità, quindi tornano i colpi
  reciproci. Mara guadagna circa 3 punti, perché non va più in debito di A.
- **I salvataggi in extremis** (D48) passano da 9.561 a 12.046 su 480.000 partite: con il pavimento qualunque cura rialza.
- **La corazza a L/4** porta Piera a 0,525. Contro Spazienzio esce dai criteri: lui va a 0,334. Contro Beppe passa da 0,454 a 0,591.
  Celestina guadagna circa 2 punti col Negroni Trovato per Terra (+10 L); perdono Beppe e Spazienzio, che colpiscono. Assorbe in media
  3,8 HIT per partita, e con L/2 7,4.
- **La ricerca non è misurata:** richiede carte e bot nuovi, e si misura in SB-16e.

Contatori, dati e prototipo aggiornato sono in [`sb-16b/fase-b/`](sb-16b/fase-b/):
- [confronto del pavimento](sb-16b/fase-b/confronto-pavimento.md);
- [confronto della corazza](sb-16b/fase-b/confronto-alcol.md);
- [contatori](sb-16b/fase-b/contatori.txt);
- [diff del prototipo](sb-16b/fase-b/variante-regole-fase-b.diff), un esperimento sul commit `2e5a1ad`, non per l'adozione.

**Verifiche della Fase B.** `python scripts/check-rules.py`, `python scripts/check-links.py` e `git diff --check` verdi. La build non è
rilanciata: la Fase B cambia solo documenti ed evidenze.

## Matchup nelle quattro varianti

Quota di A, patte escluse, e patte fra parentesi. Banco SB-7: 2000 partite per cella, quattro stili, bozza `c43b37a5…de842cda`.

| Incontro (A – B) | Base | P1 | P2 | P1 + P2 |
|---|---|---|---|---|
| Spazienzio – Spazienzio | 0,497 (12,6%) | 0,497 (3,6%) | 0,498 (1,1%) | 0,497 (0,4%) |
| Spazienzio – Mara | 0,525 (10,4%) | 0,515 (3,2%) | 0,532 (1,1%) | 0,515 (0,4%) |
| Spazienzio – Celestina | 0,470 (10,8%) | 0,472 (7,0%) | 0,489 (0,8%) | 0,482 (0,6%) |
| Spazienzio – Piera | 0,401 (14,1%) | 0,428 (5,8%) | 0,417 (0,9%) | 0,424 (0,4%) |
| Spazienzio – Beppe | 0,406 (12,8%) | **0,395** (4,3%) | 0,425 (1,1%) | **0,396** (0,4%) |
| Mara – Mara | 0,499 (9,5%) | 0,499 (4,3%) | 0,500 (1,4%) | 0,499 (0,6%) |
| Mara – Celestina | 0,518 (10,6%) | 0,520 (6,8%) | 0,529 (0,9%) | 0,525 (0,6%) |
| Mara – Piera | 0,443 (16,1%) | 0,493 (7,8%) | 0,451 (1,3%) | 0,485 (0,7%) |
| Mara – Beppe | 0,465 (12,8%) | 0,437 (4,5%) | 0,472 (1,4%) | 0,437 (0,4%) |
| Celestina – Celestina | 0,507 (22,4%) | 0,506 (19,3%) | 0,505 (1,9%) | 0,505 (1,9%) |
| Celestina – Piera | 0,570 (17,8%) | 0,594 (11,7%) | 0,538 (1,2%) | 0,560 (1,0%) |
| Celestina – Beppe | 0,531 (16,0%) | 0,502 (10,8%) | 0,515 (1,2%) | 0,490 (1,1%) |
| Piera – Piera | 0,503 (34,8%) | 0,506 (15,9%) | 0,507 (2,8%) | 0,506 (1,4%) |
| Piera – Beppe | 0,525 (27,9%) | 0,452 (16,0%) | 0,546 (1,8%) | 0,478 (1,1%) |
| Beppe – Beppe | 0,503 (25,1%) | 0,504 (19,4%) | 0,503 (2,4%) | 0,505 (2,0%) |

Durata, mazzi esauriti e arrivo delle last resort sono identici nelle quattro varianti: 13,54 turni, 46,7% dei mazzi esauriti in media.

## Evidenze

In [`sb-16b/`](sb-16b/), circa 0,8 MB:
- [`confronto.md`](sb-16b/confronto.md): le quattro varianti, globale, per incontro e per mazzo.
- `banco/<variante>/`: rapporto `.md`, dati `.json` minificati e tempi del banco SB-7, per base, morto (P1), spareggio (P2) ed entrambe.
- `listino/<variante>/`: listino di priorità e A iniziale per base e morto (P1).
- [`variante-regole.diff`](sb-16b/variante-regole.diff): il prototipo delle due regole su `Game.java`, per un esperimento e non per
  l'adozione. Si applica al commit `7829b8f`.
- `run-variants.ps1`, `run-listino.ps1`, `summarize.py`: gli script usati. I percorsi sono quelli della macchina locale.

Il lotto di prova da 1000 partite per cella non è nelle evidenze. Usava la prima versione di P1, che controllava la morte mossa per
mossa, e il codice di quel lotto non è certo.

## Che cosa è cambiato nel repository

Solo questo rapporto, la cartella delle evidenze e, nel [piano](../../set-base-plan.md#sb-16b--revisione-critica-delle-regole), la
riga e lo stato di SB-16b. Non sono toccati regolamento, documento del set, codice, test, catalogo, bozza, client, `docs/design/carriere`
e `docs/product-roadmap.md`.

## Verifiche

- `./scripts/build.ps1 -Task Test -Offline`: verde: server 658 test, 0 falliti, 7 saltati (le misure che partono solo a richiesta), BUILD SUCCESS; client-debug 37 su 37. Il contesto Spring completo non è verificato, perché il codice non cambia.
- `python scripts/check-rules.py`: verde: regolamento 1.13 e Set Base 0.1 allineati, 39 carte e un token, starter conformi, SQLite integro.
- `python scripts/check-links.py`: verde: 0 link rotti.
- `git diff --check`: verde, dopo aver portato le evidenze a fine riga LF e tolto lo spazio delle righe vuote di contesto dal diff, che si applica ancora al commit `7829b8f`.

## Cosa non è verificato

- **Nessuna partita umana** con P1, P2 o P3.
- **L'FFA non è misurato.** Il prototipo di P2 vale solo per il 1v1.
- **Il gioco vivo**, con i due personaggi del Set Base 0.1, non è misurato con le regole nuove.
- **Il listino** è misurato solo nei contesti di Spazienzio e Mara.
- **P3 non è misurata:** nessuna carta è cambiata.
- **Il prototipo** è un esperimento fuori dal repository, senza test di conformità.

**Giudica il proprietario, in Fase B:** le domande sopra, e se le proposte rendono il gioco più divertente.
