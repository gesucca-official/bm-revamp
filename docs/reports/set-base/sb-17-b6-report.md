# SB-17 — Fase B6: la V4 in bozza, un giro con riserva (rapporto)

**16 novembre 2026. [D121](../../set-base-decisioni.md#decisioni-del-proprietario): la V4 della [B5e](sb-17-b5e-report.md) entra in
`bozza.json`. Un giro, poi la riserva R1 (Lo metto in conto +5 → +7 A, un solo giro in più). STOP per il proprietario.**

## 1. Che cosa è cambiato

| Dove | Cambio |
|---|---|
| [regole-playground.md](../../design/set-base/regole-playground.md) **1.4** | RP-25: la vendita è l'effetto di una **carta regolare** che bersaglia un proprio oggetto; con l'oggetto sparito nessun guadagno; la basic torna una presa. RP-26: `vendi` ammesso in una regolare (deroga del playground, sim) |
| [griglia.md](../../design/set-base/griglia.md) | CES-BA di nuovo «Lo metto in conto» (+7 A dopo R1), **deroga a D3 ritirata**; nuova riga **CES-AR7** «Lo rivendo» (regolare, F0, pr. 1, NC, +8 HEALTH) con la sua deroga a D3 e R04 e le note ⁷ e ⁸. Fare il vago e Battutina invariate |
| `bozza.json` | **94 carte** (era 93): + Lo metto in conto (basic, RARE), Lo rivendo da basic RARE a regolare UNCOMMON; carattere di Sergio con la basic nuova; mazzo `prova-sergio`: Lo sapevo ×1, Sgambetto fuori, Santino ×1, Espresso ×2, Lo rivendo ×2. Rarità: C 38, NC 46, R 10 |
| test | `Sb17` (carte di Sergio), `Sb17CardsTest`, `SetBaseDraftTest` (carte e rarità, CES-AR7 NC) |
| bozza di riferimento | rigenerata (`--scrivi`, poi `--verifica`) |

Confronto col diff semantico: `bozza.json` = [bozza-v4.json](sb-17/b5e/bozza-v4.json) su personaggi, mazzi, regole e tutte le
carte, **salvo** la descrizione di Lo rivendo (ora inizia con «CES-AR7 · 0 A», l'ID di griglia che `rarita-bozza.py` richiede) e,
dopo R1, Lo metto in conto a +7 A. Il file è modificato come testo, il formato resta quello della B4 (il file della B5e è
riformattato, un diff di righe sarebbe inutile).

**Test: attesi cambiati solo per D121**, elencati: `Sb17CardsTest` (il test su Lo rivendo come basic diventa quello sulla basic
Lo metto in conto e sulla regolare Lo rivendo; nuovo `loMettoInContoGivesAlertnessThenConsumesTheItem`: +7 A, poi consuma),
`SetBaseDraftTest` (93 → 94 carte, NC 45 → 46; CES-AR7 fra le NC). Tolta l'asserzione «una basic resta in mano» (una regolare
giocata lascia la mano). Il resto, compresi i rifiuti del caricatore (bound, SELF, last resort, doppio, consume, `seNo`), è
com'era. Nessun codice in `server/src/main`: il caricatore ammetteva già `vendi` in una regolare dalla B5e.

## 2. Il giro

Lanciatore e semi della B2 ([run.ps1](sb-17/run.ps1), `-OutputRoot %TEMP%\bm-sb17-b6\run`), regole `d50`, 12 stili letali, 144
celle, 300 semi, 259.200 partite per giro. Il giro 1 (V4 a +5 A) è **identico byte per byte** alla V4 della B5e (stesso
`round-v4.json`, come ci si aspetta: stesse carte, stessi semi). Esiti: [giro 1](sb-17/b6/round-1.md), [giro 2, R1](sb-17/b6/round-2.md).

**Riserva R1** (scritta prima, D121 (3)): Celestina 31,56% < 35% al giro 1 → Lo metto in conto +5 → +7 A, un solo giro in più.

### Quota / patte / turni (soli euristici)

In grassetto i valori fuori D95. Violazioni 0, bound oltre il tetto 0 in entrambi i giri.

| Incontro | V4 della B5e (+5 A) = giro 1 | Giro 2, R1 (+7 A) |
|---|---|---|
| Sergio–Sergio | 47,54% / 1,99% / 13,66 | 47,96% / 0,94% / 13,60 |
| Sergio–Spazienzio | 59,24% / 2,83% / 10,57 | 59,68% / 2,31% / 10,54 |
| Sergio–Mara | 48,47% / 3,00% / 11,40 | 49,44% / 2,68% / 11,35 |
| Sergio–Celestina | **31,56%** / 5,36% / 11,32 | **32,22%** / 5,32% / 11,31 |
| Sergio–Piera | 38,44% / 3,51% / 11,45 | 39,79% / 3,03% / 11,43 |
| Sergio–Beppe | 45,92% / 2,10% / 9,23 | 46,63% / 1,44% / 9,20 |
| **Incontri fuori D95** | 1 (Celestina, 3,44 punti) | 1 (Celestina, 2,78 punti) |

**Spazienzio passa**: 59,68% contro il 69,7% di soglia (D95, come nella B4 e nella B5e).

### Letture (non criteri)

| Lettura | V4 della B5e | Giro 2 (R1) |
|---|---|---|
| Mazzo esaurito | 27,48% | 26,68% |
| Fare il vago: partite / giocate per partita | 40,35% / 3,34 | 40,20% / 3,32 |
| Fare il vago giocata contro un colpo mostrato | 15,8% | 15,7% |
| Battutina: partite / giocate | 57,03% / 1,68 | 56,87% / 1,65 |
| A spesa a partita (lato di Sergio) | 40,14 | circa 40,2 (dai contatori) |
| Last Resort: Banzai!!! (partite) | 8,30% | 7,20% |
| Lo rivendo (partite / giocate) | 19,53% / 0,22 | 17,80% / 0,20 |
| Lo metto in conto (partite / giocate) | 52,47% / 0,64 | 54,40% / 0,68 |
| Oggetti venduti: Santino / Espresso | 22.649 / 13.952 | 20.266 / 12.932 |
| Ricerche di Oh, guarda là fallite | 7,26% | 7,11% |

Letture: come nella B5e, la A subito della basic è la leva; +2 A su Lo metto in conto spostano poco (Celestina +0,7 punti, Piera
+1,4, Beppe +0,7). Lo rivendo regolare si gioca in meno di una partita su cinque, quindi il ricavato conta poco. Il Banzai!!!
scende al 7% e le patte quasi spariscono (specchio 0,9%).

## 3. Scostamento dichiarato

**Sergio–Celestina resta fuori D95 anche dopo R1**: 32,22% contro il 35% (2,78 punti). La riserva è esaurita (un solo giro in
più); D121 non ne prevede altre. Spetta al proprietario: accettarlo come scostamento, scrivere una seconda riserva (per esempio
Lo metto in conto +9 A o +2 HEALTH su Lo rivendo) o rimandare ai bot (SB-21). I bot di Fare il vago (3,3 giocate a partita) non
sono stati toccati: scostamento dichiarato come da D121 (4).

## 4. Verifiche

`git diff --check`, `check-links.py` (383 file, 0 rotti), `check-rules.py`, `rarita-bozza.py --check`,
`genera-bozza-di-riferimento.py --verifica`: verdi. `./scripts/build.ps1 -Task Test -Offline` (dopo R1): 895 test, 0 falliti,
21 saltati, client 37/37. Fedeltà `TurnForecastFidelityTest` e `ViewTableFidelityTest` al **100%** con Lo rivendo regolare nel
campione (ViewTable sergio: 6392/6392 primo, 3952/3952 salute e risorse, Lo rivendo 83 turni, Fare il vago 352). Mai due Maven né
misure insieme.

## 5. Budget

Orologio di muro: giro 1 105,0 s + giro 2 (R1) 107,0 s = **212,0 s su 300**; orologio dei giri 101,5 + 96,3 s. Fuori budget: le
verifiche. [budget.json](sb-17/b6/budget.json). Il jar è ricostruito con `./scripts/build.ps1 -Task Server -Offline` per la prova
del proprietario (Sergio a +7 A).

## 6. Domande al proprietario

1. **Celestina al 32,2%** (2,78 punti sotto D95): si accetta come scostamento e si passa alla prova, o si scrive una seconda riserva?
2. **La prova**: con il jar ricostruito, Sergio con Lo metto in conto +7 A e Lo rivendo regolare ×2 nel mazzo di prova.
