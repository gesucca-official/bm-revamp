# Ricerche «Annuncia» fallite nel 20/2

14 novembre 2026, nota della regia a sostegno di [D94](../../set-base-plan.md#decisioni-del-proprietario). Nessuna partita nuova:
rilettura dei contatori del giro 20/2 di [SB-16h](sb-16h-report.md), identico al giro della bozza di riferimento 1.5 (D92).
Soli bot euristici, come i criteri D93. [Script](ricerche-fallite/fails.py), di sola lettura:

```powershell
python -X utf8 docs/reports/set-base/ricerche-fallite/fails.py docs/reports/set-base/sb-16h/round-20-2-observations.json.gz
```

| Caricamento | Colpo cercato | Copie | Ricerche | Fallite | Di cui col colpo già in mano |
|---|---|---:|---:|---:|---:|
| PAZIENZA: FINITA | Impatto | 2 | 121.094 | 23,5% | 84,6% |
| Ti faccio spazio | O-Ahio | 1 | 47.339 | 40,3% | 36,7% |
| Slalom d'avvicinamento | Sgommata | 2 | 54.591 | 30,7% | 46,4% |
| Ti stringo la curva | Cinghiata di traverso | 1 | 61.455 | 42,3% | 22,8% |
| Dose in preparazione | Tossicone Scatarrante | 2 | 70.151 | 32,2% | 54,8% |
| Un assaggino | C'è del sangue nella mia droga | 1 | 22.828 | 58,9% | 44,2% |
| Un altro e arrivo | Estasi da Coca Etilene | 2 | 107.173 | 27,3% | 0,9% |
| Prima il brindisi | Rutto a distanza sociale | 1 | 52.433 | 47,1% | 75,3% |
| Preparo il lavoro | Chiave da tredici | 2 | 254.556 | 30,1% | 19,4% |
| Una stretta di prova | Lavoro fatto bene | 1 | 121.760 | 44,0% | 8,7% |
| **Colpi a copia singola** | | | 305.815 | **44,7%** | 30,8% |
| **Colpi a due copie** | | | 607.565 | **28,6%** | 34,2% |
| **Totale** | | | 913.380 | **34,0%** | 32,7% |

Il totale coincide con il 34,00% del rapporto SB-16h.

## Lettura

- **Una ricerca non fallisce per la mescolata.** «Annuncia» guarda tutto il mazzo: fallisce solo se nel mazzo non resta alcuna copia,
  perché è già in mano (un terzo dei casi) oppure già giocata o scartata (due terzi). Chi gioca può saperlo prima di annunciare.
- **I bot annunciano senza controllarlo**: il 34% sovrastima ciò che vive un umano attento. Resta il difetto vero: un caricamento
  pescato tardi, col suo colpo già passato, è quasi una carta morta.
- **I colpi a copia singola falliscono più spesso** (44,7% contro 28,6%). Il caso più evidente di colpo già in mano è PAZIENZA: FINITA,
  con Impatto in mano nell'84,6% dei fallimenti.
- **Last resort e ricerche si muovono insieme con la dimensione del mazzo** (SB-16h): 20/2 dà 9,5% di finali in last resort e 34%
  di ricerche fallite; 25/3 e 30/3 portano le ricerche al 13–14% ma il last resort all'1%. Per tenere il primo e abbassare le
  seconde, la leva sono le carte, non il formato.
