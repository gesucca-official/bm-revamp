# SB-20b — Fase A: proposta per i numeri «brutti» delle 123 carte

**Stato: proposta, 18 novembre 2026. Solo documenti, STOP per il proprietario.** Nessun dato del gioco, codice, test, catalogo o
client è cambiato. Nasce da [D138](../../set-base-decisioni.md#decisioni-del-proprietario) (1) (il proprietario: rivedere
«automaticamente i numeri brutti senza che lo faccia io a mano»), con D136, D137, D131 e D134 in ingresso. Dopo la decisione la
proposta non si aggiorna: prevale la riga del registro.

Fonti, in sola lettura: `server/src/test/resources/set-base/bozza.json` (116 carte e 7 personaggi, 417 valori numerici),
[griglia](griglia.md) (slot e storia di ogni valore), [listino](listino.md), le 17 carte Java (numeri in `params` della bozza; le
classi non nascondono altri numeri), la logica di segnalazione di
[genera-pagina.py](revisione/genera-pagina.py) e le sezioni 4–5 del [rapporto di SB-20a](../../reports/set-base/sb-20a-report.md).
Misure di riferimento: «Rif» di [SB-19](../../reports/set-base/sb-19/evidence/rif-summary.md), identico in B1b, B2 e B2a.

## 1. In breve

- **Il set è già quasi pulito.** Zero importi non interi; zero testi che contraddicono i dati (i cinque «turni» che SB-20a aveva
  segnalato seguono la convenzione di D38 (2) e R05: `turns: N−1`, il testo conta anche il turno corrente); i campi `gui` sono
  coerenti con i dati. Restano **cinque carte con moltiplicatori fuori dalla scala dei quarti** (due fissate dal proprietario), **un solo
  numero fuori scala fra i colpi** (34, più le cifre di Duccio, fissate in D127) e **un testo con un costo che i dati non hanno**.
- **Proposta: 5 carte su 123 (4%).** Tre moltiplicatori (MAR-AR4, GEN-13, OGG-11), 34 → 35 su SPA-AR1 (eccezione argomentata a D90) e
  un testo (CES-AR7). In più, in fase B, si riallinea la griglia, rimasta indietro su tre carte di Mara (D99).
- **Perché così poche.** La regola più ovvia, «non multiplo di 5», segnalerebbe **62 carte su 116 (53%; 66 con i moltiplicatori)**,
  molto oltre un terzo: non è una regola di bruttezza ma la firma della taratura (cap delle bound, listino, giri di SB-12a–SB-18). Non
  è adottata (sez. 3, R0).
- **Effetto atteso:** da ±0,5 a ±3 punti di quota su Spazienzio, Mara e Beppe; nessuna coppia di «Rif» dovrebbe uscire da 35–65. In fase B
  lo si misura con «Rif», e un cambio che spinge fuori una coppia si ritira da solo.
- **Cinque domande** (sez. 7), con la mia raccomandazione.

## 2. Come sono stati raccolti i valori

Ogni valore numerico di ogni carta (`self`, `target`, `inPlay`, `cost`, `params`, passi interni come `steps` e `seHai`) e le risorse
iniziali dei sette personaggi, per percorso; per ogni valore, la famiglia (ruolo e unità: bound di risorsa, bound di danno, basic,
last resort, colpo, caricamento, difesa, premio, oggetto) e la storia nella griglia (colonna «Candidata/Motivo», note e sezioni
«Correzioni»). I numeri nel testo stampato (`gui.description`, `gui.gains`, `gui.damageAmount`) sono stati confrontati coi dati,
e la griglia con la bozza carta per carta. Gli script erano di lavoro e non sono nel repository; le regole sotto sono scritte
come predicati, così da poterle riapplicare (domanda 5).

Convenzione dei turni: «per N turni» è `turns: N−1` (D38 (2); R05: `d=0` copre il turno corrente). OGG-09, OGG-11, OGG-10, GEN-20 e
SPA-AR4 sono coerenti; SB-20a aveva già avuto la stessa risposta dalla regia.

## 3. Le regole

| Regola | Predicato (verificabile) | Perché | Esito sul set |
|---|---|---|---|
| **R1** Non interi | Ogni importo, costo, risorsa iniziale e parametro Java è un intero. Fuori: fattori e percentuali (R2) | Il motore tronca verso zero (R05); un decimale su una carta nasconde un arrotondamento | **0** |
| **R2** Moltiplicatori | Ogni `factor` è multiplo di 0,25 fra 0,25 e 2 (×0,25 ×0,5 ×0,75 ×1,25 ×1,5 ×2); `percent` solo 50 | Cinque valori (−75, −50, −25, +25, +50%) si leggono e si ricordano; ×0,4 o ×0,65 si capiscono solo facendo il conto | **5 carte**: MAR-AR4 ×0,4, GEN-13 ×0,6, OGG-11 ×0,8, PIN-AR3 ×0,65, MAR-AR2 ×0,8 |
| **R3** Fuori scala | Un importo > 5 è «in scala» se è multiplo di 5, 6 o 7 (7 è l'unità del listino, D33; 6 è il passo 12–18–24–30 dei colpi), oppure se lo stesso valore compare su **almeno 5 carte** (vocabolario: l'8 sta su 9 carte, in cure, drenaggi e colpi piccoli). Sono esclusi priorità, turni, divisori, `perPlay`, `perItem`, `perAlcohol` | Un colpo da 34 accanto a 30, 25 e 24 non segue nessuna scala; l'8 invece è un taglio ricorrente. Chiede la scala, non il multiplo di 5, perché le tre scale sono quelle con cui il listino ha prezzato le carte | **4 carte**: SPA-AR1 34; ROC-AR1 16 H, ROC-AR4 26 HIT, ROC-AR6 33 H (Duccio) |
| **R4** Testo e dati | Ogni numero in `gui.description`, `gui.gains` e `gui.damageAmount` è nei dati (o ne deriva: turni +1) e ogni importo dei dati è nel testo, salvo i fattori di vulnerabilità e i divisori o le percentuali scritti a parole («metà»). Stesso controllo fra griglia e bozza | Il giocatore legge il testo, i bot e il motore i dati | **1 carta**: CES-AR7 stampa «0 A:», senza costo nei dati. **Griglia:** 3 righe indietro su D99 (sez. 4) |
| ~~R0~~ Non multiplo di 5 | Un intero > 0 non multiplo di 5 | Era il candidato del proprietario e di SB-20a | **62 carte (66 con R2): non adottata** |

**Perché R0 no.** Il cap delle bound (D33, D36) dà +6 A, +7 T e +8 A, 3 e 2 HIT; i colpi seguono il listino (7, 12, 18, 24);
le cure da 3 sono principio di D52; i valori di Duccio escono da tre giri di SB-18; quasi tutto il resto ha una riga D nella
griglia. Una regola che segnala il 53% del set non separa il brutto dal calibrato; l'obiettivo di D138 era il contrario. R0 resta
come *segnalazione* (la pagina di SB-20a) e come appendice di questa proposta (sez. 5), con i motivi.

**Perché R3 con la scala e non con la famiglia.** Provato anche «isolato nella famiglia di pari ruolo»: dà gli stessi 34 e le stesse
cifre di Duccio, ma richiede di decidere a mano i confini delle famiglie. La scala è un predicato su un numero solo.

## 4. Elenco dei cambi (fase B)

Stime dal listino: 1 HEALTH di salute iniziale = 2,5–4,8 punti di quota (uso 3); una parata vale ΔD, la differenza di danno
assorbito, per partita; le giocate efficaci sono stime mie (0,3–0,7 a partita per una difesa letta, circa 0,7 per un colpo da 25 V
a due copie). Sono ordini di grandezza, non misure: nessuna simulazione in questa fase.

| Slot · carta | Campo | Oggi → proposto | Regola | Da dove viene oggi | Effetto stimato |
|---|---|---|---|---|---|
| **MAR-AR4** · Tra due paraurti | `factor` HIT e CUT | ×0,4 → **×0,5** | R2 | Valore della bozza prima di SB-16d, conservato da D55 (che aggiunse solo +5 A); nessuna riga D sul numero | **Mara −**: assorbe 50% invece di 60%, circa +2 HEALTH subiti per lettura riuscita × 0,3 = −0,6 HEALTH ≈ **−1…−3 pt** (contro chi colpisce con HIT/CUT) |
| **GEN-13** · Tartaruga sul marciapiede | `factor` HIT e CUT | ×0,6 → **×0,5** | R2 | Idem (SB-16d aggiunse «recupero 3 salute» e conservò ×0,6) | **Spazienzio + (2 copie), Mara + (1), mazzi di prova di Sergio e Duccio + (1)**: ≈ +0,3…+0,6 HEALTH ≈ **+1…+2 pt** |
| **OGG-11** · Casco da lavoro | `factor` HIT | ×0,8 → **×0,75** | R2 | «Da inventare» nella griglia, senza note di taratura né riga D | **Beppe +** (2 copie, 3 turni): 5% di circa 20 HIT subiti in 3 turni = −1 HIT per presa × 0,4 giocate ≈ **+0,5…+2 pt** |
| **SPA-AR1** · GARGANTUESCO IMPATTO | `amount` (e `damageAmount` «HIT 34») | 34 → **35** | R3 | D90 (1): «30→34» come tappa intermedia da 40 a 30; **eccezione argomentata** sotto | **Spazienzio +**: +1 HIT × circa 0,7 giocate ≈ +0,7 HEALTH ≈ **+1…+2,5 pt**; cambia anche la soglia letale dei bot |
| **CES-AR7** · Lo rivendo | `gui.description` | «0 A: vendi…» → «Vendi…» | R4 | Testo di SB-17; i dati non hanno costo, come GEN-01 e GEN-18 che non stampano il costo | nessuno (solo testo) |
| Griglia: MAR-AR1, MAR-AR2, MAR-AR3 | colonna «Effetto» | anticipo +10 CUT / ×0,5 / +8 A → **+5 CUT / ×0,8 / +4 A** | R4 | D99 (1): la griglia resta ferma a D97, la bozza è giusta | nessuno (solo documento) |

**Eccezione a D90 (1) per SPA-AR1.** D90 sceglie 34 come «tappa intermedia», non come valore di prestazione: la regia lo aveva
proposto per stare fra 30 (passo 3) e 40, e 35 sta nella stessa tappa. È il numero più strano a vista (nessuna scala del set lo
contiene). Costa: cinque file di test da ricalcolare (soglie letali di Impatto: «34 meno L 20/4 = 29» diventa «35 − 5 = 30»), tutti
legati a questa decisione. Il vantaggio di bilanciamento è reale e non cercato: Spazienzio è il più debole di «Rif» (43,2% medio, sotto il
50% contro tutti; la coppia migliore è con Beppe, 49,4%). Se la domanda 3 è no, 34 resta e il resto non cambia.

**Aggregato atteso su «Rif»** (media non-specchio, 18 novembre): Spazienzio 43,2% → circa 45–48; Mara 52,6% → circa 50–53; Beppe 51,4%
→ circa 51–53; Sergio e Duccio +0,5; Celestina e Piera invariati (solo gli avversari si muovono). Coppie vicine al bordo: **Mara–Beppe 41,26%
(6,3 sopra 35): scende a circa 38–41, la sola che si avvicina al bordo**; Spazienzio–Celestina 40,79%, Mara–Duccio 62,28%, Beppe–Duccio 41,34%
e Celestina–Sergio 68,83% (già fuori) migliorano o restano.

## 5. Valori segnalati e tenuti

**Dalle regole adottate (5 carte).**

| Carta | Valore | Regola | Perché resta |
|---|---|---|---|
| PIN-AR3 Il bancone regge | HIT ×0,65 | R2 | D97 (4): «Bancone HIT ×0,65 e salute di Piera 80», decisione del proprietario |
| MAR-AR2 Sgommata | anticipo ×0,8 | R2 | D99 (1), «Approvo tutto»: la leva A su Mara; la 1.6b è la bozza di riferimento (D101) |
| ROC-AR1 · ROC-AR4 · ROC-AR6 | costi 16 / 28 / 33 HEALTH; ROC-AR4 26 HIT | R3 | D127 (2): bozza finale della B2, costi di R1 e R2; D125 (1) i colpi 18 / 8 / 26 / 30 |

**Valori non multipli di 5, non toccati (appendice di R0, per gruppo).** Ogni gruppo ha una causa, non una svista.

| Gruppo | Carte e valori | Causa |
|---|---|---|
| Bound (17) | 3 e 2 HIT/CUT/POISON (SPA-BO2, MAR-BO1/3, TOS-BO1/3, PIN-BO2/3, GIG-BO2/3, CES-BO2, ROC-BO1/2); +6 A (MAR-BO2), +7 T (TOS-BO2), +8 A (CES-BO1, ROC-BO3), 3 HIT e +8 V (SPA-BO3) | Cap D33/D36 (≤4 unità, ≤3 di danno); +6 A è D41, +7 T è SB-13 giro 3 (cap), +8 A = 4 unità con A a 0,5 |
| Basic (3) | GIG-BA +4 V; CES-BA +7 A; ROC-BA +3 H | +4 V = 3 unità, come +3 H di Duccio ([tabella della proposta A4](sb-17-proposta-a4.md)); +7 A è la riserva R1 di D122; +3 H è principio D52 |
| Last resort (4) | 2, 1 e 4 a sé/per giocata; 7 POISON e +4 T (LR-TOS); 12 + L; 6 e 12 (LR-ROC) | D29 (netto vicino a Struggle), D56 (2 a sé), D97 («Rincara» diverso da carta a carta; «il +4 T resta»), D124 |
| Colpi e caricamenti (22) | SPA-AR2 6+V/2; MAR-AR1 18+A/2; MAR-AR3 −8 A e 3 CUT; GEN-05 18, GEN-06 24, GEN-12/17/09 12, GEN-18 7, GEN-10 8, GEN-22 3; TOS-AR2 18, TOS-AR5 12; PIN-AR2 18+L, PIN-AR5 14+2L; GIG-AR2 18, GIG-AR5 14+4, GIG-AR3/6 4; CES-AR1 4, CES-AR4 8 (+6), CES-AR5 24 | Scala 6 (12–18–24) e unità 7 del listino; 18/14/12 per D82, D84 e D90; 4 per D82 (2); CES per D106/D110 |
| Duccio (6) | ROC-AR1…AR6: 18 / 8 / 26 / 4 / 30 HIT, +3 H, +6/+2 H | D124–D127 |
| Premi, cure, oggetti (8) | GEN-16 +8 H; GEN-20 +12 H; OGG-01 12 V/10 L/3 T; OGG-07 12 H/3 T; OGG-12 +12 T; OGG-17 −3 A; OGG-18 +2 T; CES-AR7 +8 H | Listino degli oggetti (SB-11b); GEN-20 D132 (2); OGG-17/18 D130 e D134; CES-AR7 D121 |

**Valore in scala ma isolato, scartato.** MAR-AR3 −8 A: i drenaggi vicini sono −10 A (GEN-09, CES-AR1) e −5 A (Mano lesta), ma il numero è
in scala (vocabolario dell'8) e la A conta come precedenza ordinale (listino): cambiarlo sposta l'ordine delle mosse di una carta di Mara,
tarata in D98/D99. GIG-BA +4 V: in scala (≤5) e tarato in unità. Se il proprietario li vuole tondi (domanda 4), costa una misura.

## 6. Intoccabili

Restano come sono, salvo l'eccezione argomentata a D90 (1) in sez. 4:

- **D134:** OGG-17 Conto del tavolo sei (in campo −3 A, consumato +15 V) e OGG-18 Sigaretta accesa (in campo +2 T, consumato +10 A).
- **D127 e D125–D126:** Duccio salute 115, costi 16 / 10 / 28 / 33 HEALTH, colpi 18 / 8 / 26 / 30, cure e premi.
- **D132:** Secondo fiato +12 H e ×1,25 per 2 turni; Elemosina molesta gratis, Non sento niente 5 V ×0,25, Mezza minerale +20 A (D132 (1)).
- **D97 e D99:** Bancone ×0,65, Piera 80 H; Sgommata ×0,8, Sorpasso +4 A, Cinghiata +5 CUT; «Rincara» 5 (2), 5 (1), 4 (1), 5 (2).
- **D90 (2), D82 e D84:** Chiave 18, Lavoro 14 + 4; Estasi 18 + L, Rutto 14 + 2L, Tossicone 18 e travaso 12 POISON, Ti stringo +20, Un assaggino +20.
- **D121–D123, D41, D36, SB-13:** CES-BA +7 A, CES-AR7 +8 H, bound di danno ≤3, MAR-BO2 +6 A, TOS-BO2 +7 T.
- **Estasi (PIN-AR2) e Grappa (OGG-16):** problemi di bilanciamento di SB-21 (D136), non numeri brutti.
- **Le 17 carte Java:** tutti interi, tutti in scala o ≤5, coerenti col testo (YouStop 5 V, Steal 10 A, Riflessi 10 T, travaso 10 T e 12 POISON, Mescolone 20/20/5/20, L'ultimo giro 12+L, Estasi 18+L, Rutto 14+2L, Tennents +10 L, Smontiamo tutto 5 V, Lavoro 14+4, Ricatto 15 A e 50%, Lo sapevo 10 A, Santino 3 turni, Maleducazione 5 V e 8). Nessun cambio.

## 7. Piano della fase B

**Prima.** Il proprietario risponde; la regia registra la decisione e il blocco parte da lì. Working tree pulito, `git fetch`, nessun
processo Java attivo. Il commit di misura di riferimento è l'ultimo che ha cambiato `bozza.json` (identità di B2a).

1. **Misura di base (0).** La bozza di oggi copiata in `%TEMP%` (il caricatore rifiuta il prefisso `file:`). Fattibilità e «Rif» con
   [run.ps1](../../reports/set-base/sb-19/run.ps1) (`-Phase feasibility` poi `-Phase round`, etichette nuove `sb20b-*`; una fase già
   tentata è rifiutata). **Cancello:** la matrice deve coincidere con quella di [B2a](../../reports/set-base/sb-19/b2a/evidence/identity-rif-b2a.json);
   se no, STOP 2.
2. **Applicazione.** `bozza.json`: i quattro valori e i loro testi (`gui.description`, `damageAmount` di SPA-AR1, CES-AR7). Non si toccano
   `storico/1.5` né altri campi.
3. **Documenti.** Griglia (righe dei quattro slot; MAR-AR1, MAR-AR2, MAR-AR3 riallineate a D99); `python
   docs/design/set-base/genera-bozza-di-riferimento.py --scrivi` e `--verifica`; `python docs/reports/set-base/sb-6b/rarita-bozza.py
   --check`; regole del playground e documenti di set non cambiano. La bozza non è nel catalogo, nel client o in SQLite: nessuna copia
   da riallineare (`git grep` dei testi delle quattro carte: solo bozza, storico 1.5 e test).
4. **Attesi dei test, solo per i cambi deliberati**, citando la decisione: soglie letali di Impatto (34 → 35) in
   `StarterRedesignTest`, `PotenzaD82Test`, `Correzione15Test`, `LethalAwarePolicyTest` (e il commento di `Sb17CardsTest`); gli
   scenari di Paraurti ×0,4 e Tartaruga ×0,6 di `LethalAwarePolicyTest`, da ricalcolare con ×0,5; `Sb16iBotsTest` e `SetBaseDraftTest` solo
   se i loro numeri toccano le quattro carte. Se un test cambia per un motivo diverso da questi, STOP 3.
5. **Misura finale.** Fattibilità e «Rif» sulla bozza nuova; `analyze.py identity` e `analyze.py rif` del [SB-19](../../reports/set-base/sb-19/analyze.py),
   riepiloghi in `docs/reports/set-base/sb-20b/`, il resto in `%TEMP%`. Stessi semi, 12 stili, 144 incontri per coppia, 100 semi.

**Criteri, scritti ora.**

1. **Identità sui mazzi senza carte toccate:** Celestina–Celestina, Celestina–Piera e Piera–Piera (i soli mazzi senza le quattro
   carte) identici byte per byte alla misura di base. Una differenza è STOP.
2. **Fascia D95 sulle 28 coppie:** nessuna coppia che era dentro 35–65 esce; le due già fuori (Celestina–Celestina patte 12,58%,
   Celestina–Sergio 68,83%) non peggiorano di più di 1 punto.
3. **Spostamento per coppia ≤ 3 punti** sulle coppie con una carta toccata (le stime sono ≤ 2,5); oltre, la coppia si isola. Errore
   statistico per coppia circa 0,4 punti (14.400 partite).
4. Patte ≤ 10% (salvo lo specchio noto di Celestina), durata ≤ 12 turni fuori dagli specchi, invarianti zero, bound oltre il tetto zero.
5. Si riporta senza soglia: media non-specchio per mazzo, prima e dopo.

**Riserva.** Se i criteri 2 o 3 falliscono, si isolano i cambi: una bozza con *un solo* cambio e «Rif» ristretto ai mazzi che lo contengono
(`-Rows`/`-Foes`, circa 5 s per coppia). Il cambio responsabile si ritira da solo (valore, testo, griglia e attesi di test), poi «Rif» una
volta. Se anche dopo il ritiro una coppia resta fuori: ritiro di tutti i cambi e STOP. **Non si compensa con altri numeri**: questo non è
un blocco di taratura. Una coppia che resta fuori solo perché era già al limite è uno scostamento dichiarato.

**Budget.** 1.200 s di misure, fissati ora (per confronto, la B1b ne usò 1.049 su 1.800): fattibilità 40 + «Rif» di base 170 + «Rif» finale 170 + isolamenti fino a
480 + «Rif» dopo il ritiro 170 = 1.030. «Rif» è costato 118–171 s nei blocchi di SB-19. Una misura alla volta; la suite `Test` è un'altra
verifica esclusiva e non gira insieme.

**Verifiche** ([tabella](../../aree-protette.md#playground-e-misure)): `git diff --check`, `python scripts/check-links.py`,
`python scripts/check-rules.py`, `./scripts/build.ps1 -Task Test -Offline`. Solo dati e test della bozza: nessuna corsa d'identità viva
né `TestServerContext` se `git diff --stat` dal commit di misura mostra solo dati, test e documenti; se compare altro (banco,
`Sb19MeasureTest`, `server/src/main`), STOP 1.

**Dopo.** SB-20c (testi stampati) parte dopo, perché tocca lo stesso `bozza.json` (D138 (4)). La pagina di SB-20a va rigenerata e
il proprietario esporta prima le sue modifiche: la pagina confronta con i valori della bozza.

## 8. Domande al proprietario

1. **Adotti R1–R4 e scarti R0 («non multiplo di 5»)?** *Raccomando sì: R0 segnalerebbe 62 carte su 116 e confonde il brutto col tarato. Se
   la vuoi lo stesso, è il caso «più di un terzo» e ti torno con la lista intera.*
2. **I moltiplicatori ×0,4, ×0,6 e ×0,8 diventano ×0,5, ×0,5 e ×0,75, o restano e li stampa SB-20c come percentuali (−60%, −40%, −20%)?**
   *Raccomando di cambiarli: il vocabolario scende a cinque valori e l'effetto stimato è ±1–2 punti, misurabile e ritirabile da solo. La
   percentuale a stampa resta valida per ×0,65 e ×0,8 di Sgommata.*
3. **GARGANTUESCO IMPATTO 34 → 35 (eccezione a D90 (1))?** *Raccomando sì: è il numero più strano del set, Spazienzio è il più debole di
   «Rif» (43,2%), il prezzo sono i cinque file di test. Se no, resta 34.*
4. **Vuoi tondi anche MAR-AR3 −8 A → −10 A e GIG-BA +4 V → +5 V?** *Raccomando no: sono in scala e tarati (Mara in D98/D99, la basic in unità);
   ognuno chiede una misura propria.*
5. **In fase B aggiungo un controllo di sola lettura con R1–R4 (`docs/design/set-base/controlla-numeri.py`)?** *Raccomando sì: piccolo,
   serve a SB-21 per non reintrodurre numeri fuori scala. Altrimenti le regole restano solo in questo documento.*
