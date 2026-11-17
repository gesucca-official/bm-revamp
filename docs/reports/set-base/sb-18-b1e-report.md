# SB-18 — Fase B1e: giro esplorativo sulle leve di Duccio (rapporto)

**17 novembre 2026. Fase B1e di [D125](../../set-base-decisioni.md#decisioni-del-proprietario) (2), come la [B5e di SB-17](sb-17-b5e-report.md):
cinque copie complete della V3 della [Fase B](sb-18-b-report.md), ognuna su una leva sola (L5: due), «Ultimo colpo» fuori da tutte
(D125 (3)), bot e `bozza.json` invariati, nessuna riserva, solo dati. Le copie sono in [sb-18/b1e/](sb-18/b1e/).**

*(Stato: la § 1 è scritta e committata prima di misurare; il resto segue.)*

## 1. Le varianti e i numeri, scritti prima di misurare

Partenza: la V3 (salute 110, A 15; Nocche sbucciate 8 H: 18 HIT, E allora? 5 H: ×0,5 e 8 HIT, Capocciata 14 H: 26 HIT, Testa dura 16 H: 30 HIT,
senza «Ultimo colpo»; Te lo spiego io 4 HIT, +6 H / +2 H; Incassare +3 H; Prima io +3 H). Il resto del mazzo e di `bozza.json` non cambia.

**Da dove vengono i numeri.** Il listino ([D33](../../set-base-decisioni.md#decisioni-del-proprietario) (2) e (3)): una carta gratuita vale circa 6–8 HIT;
le carte a costo della 1.6b stanno su circa **7 HIT di base più 1,5 HIT per unità di costo pesata** (Mattone 15 V: 7 + 1,5 × 11,25 = 24 HIT; GARGANTUESCO 25 V:
7 + 1,5 × 18,75 = 35 contro i 34 stampati). Con HEALTH a peso 1 la V3 sta sul listino (Nocche 8 H → 19 contro 18; Capocciata 14 H → 28 contro 26; Testa dura
16 H → 31 contro 30), e non basta: la HEALTH è anche la vita, e in 6 turni di partita Duccio ne ha ancora da spendere. Dalla Fase B (§ 5 del suo rapporto,
V3): spesa 37,2, recuperata 7,0, persa per danni 59,3, partite di 6,3 turni; a fine partita gli resta in media **circa 20 di salute** (110 − 37 + 7 − 59). Ogni
leva che toglie a Duccio più di quel margine lo porta in zona 50%; per questo le dimensioni sotto sono misurate in «salute equivalente» sulla V3.

| | Leva | Numeri | Perché questi | Peso stimato sulla V3 |
|---|---|---|---|---|
| **L1** | salute di partenza | **85** (da 110), A 15 | la cima degli starter (Sergio 85, Beppe 80, Spazienzio 75, Mara 70) | −25 di salute, quasi tutto il margine di 20 |
| **L2** | HIT per HEALTH | **1 HIT per HEALTH sopra una base gratuita di 7 HIT**: Nocche 8 H → **15** HIT, Capocciata 14 H → **21**, Testa dura 16 H → **23**; costi e E allora? (8 HIT) invariati | meno del 1,5 del listino, che per la HEALTH-vita è generoso; 7 è la base di D33 (3) | −13 HIT a partita (0,91 × 3 + 1,06 × 5 + 0,71 × 7), circa un quinto del danno da HIT |
| **L3** | costi | **il doppio, stesso danno**: Nocche **16** H, E allora? **10** H, Capocciata **28** H, Testa dura **32** H | RP-2 le tiene in mano a salute pari al costo, quindi a salute bassa i colpi grandi restano fermi, e il bot prudente ne gioca meno | +37 di spesa a parità di giocate (valore 37,2 della V3), meno per le giocate che i bot rinunciano a fare |
| **L4** | cure | **niente recupero di salute proprio**: Prima io senza +3 H (solo consuma), Incassare senza +3 H, Te lo spiego io senza premio (resta caricamento da 4 HIT con la ricerca); gli oggetti del mazzo (Panino, Ghiaccio, Fasciatura) non sono di Duccio e restano | è tutto ciò che il suo set ricarica da solo | −4/−5 di salute a partita (le cure proprie pesano circa 0,3 × 3 + 0,59 × 4 + 0,16 × 3 sui 7 recuperati) |
| **L5** | **L1 + L3** | salute **85** e costi **doppi** (16 / 10 / 28 / 32), HIT della V3 | scelta prima di misurare: sono le due leve più grosse in salute equivalente (−25 e circa −37); L2 vale −13 e L4 −5, quindi non cambierebbero da sole la zona | −25 e −37: probabile sovra-correzione |

**Scelte di forma.** Per costruzione tutte le varianti partono dalla V3 con sostituzioni di testo esatte (`sb-18/b1e/bozza-l1.json`…`l5.json`); cambiano solo i
numeri sopra, le descrizioni stampate (codice di slot compreso) e i campi `gains`/`damageAmount` coerenti. Il lanciatore `sb-18/run.ps1` ha il parametro
`-Variant` limitato a `c`, `v1`, `v2`, `v3` e il parametro `-Draft`: si usa `-Variant v3 -Draft <copia> -OutputRoot <cartella per variante>`, così
nome del giro e file del tentativo non si scontrano, senza toccare il lanciatore.

**Attese scritte prima di misurare** (quota media di Duccio contro i cinque starter, soli euristici; la V3 sta a 92,1%): L1 fra −10 e −25 punti, L2 fra −4 e −10,
L3 fra −10 e −25, L4 meno di −3, L5 sotto il 50% (sovra-correzione possibile, fino a vicino a zero). Se L5 supera di molto il bersaglio, la B2 sceglie un
punto fra una leva e L5, non L5; la regola per sceglierlo è nella § 6.
