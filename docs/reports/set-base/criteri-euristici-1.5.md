# Criteri sui soli bot euristici: ricalcolo della 1.5 (D93)

14 novembre 2026, a cura della regia. Ricalcolo dei criteri D16/D51 secondo [D93](../../set-base-plan.md#decisioni-del-proprietario) sui dati già
misurati della [correzione 1.5](sb-16g-15-report.md) (`sb-16g-15/matrix.json`, 648.000 partite). Nessuna partita giocata.

**Regola D93.** Quote, patte e durata si giudicano sulle sole celle in cui **entrambi** i giocatori usano uno stile euristico (aggressivo,
prudente, risorse; tre politiche del gettone), cioè 81 celle su 144 per incontro, 24.300 partite. Lo stile `com` (casuale sotto filtro
letale, il livello Facile di D85) non entra nei criteri. **Controllo a parte:** `com` contro `com` misura la forza grezza delle carte
senza abilità, con soglia larga 35–65% fuori dagli specchi. Le celle miste (euristico contro `com`) restano nei rapporti, non nel
giudizio.

Riproducibile con [heur.py](criteri-euristici/heur.py): `python -X utf8 docs/reports/set-base/criteri-euristici/heur.py docs/reports/set-base/sb-16g-15/matrix.json`.

| Incontro | Tutti gli stili: quota / patte / turni | Solo euristici: quota / patte / turni | com contro com: quota | Fuori (euristici) |
|---|---|---|---|---|
| Spazienzio–Spazienzio | 50.82% / 2.78% / 9.24 | 50.34% / 3.56% / 9.07 | 51.39% | — |
| Spazienzio–Mara | 61.82% / 2.69% / 9.11 | 58.19% / 3.54% / 9.06 | 69.72% | quota, com fuori 35-65 |
| Spazienzio–Celestina | 41.97% / 4.92% / 9.98 | 36.44% / 5.04% / 10.09 | 59.90% | quota |
| Spazienzio–Piera | 37.67% / 1.69% / 10.09 | 30.07% / 1.30% / 9.62 | 61.40% | quota |
| Spazienzio–Beppe | 55.19% / 1.47% / 8.49 | 48.29% / 1.60% / 7.96 | 76.07% | com fuori 35-65 |
| Mara–Mara | 50.25% / 3.33% / 8.80 | 50.30% / 4.51% / 8.77 | 47.14% | — |
| Mara–Celestina | 34.84% / 4.59% / 9.46 | 31.49% / 5.24% / 9.63 | 37.48% | quota |
| Mara–Piera | 37.70% / 3.74% / 9.59 | 34.79% / 5.44% / 9.34 | 38.42% | quota |
| Mara–Beppe | 42.09% / 1.08% / 7.97 | 36.37% / 1.01% / 7.46 | 51.36% | quota |
| Celestina–Celestina | 50.20% / 5.35% / 12.98 | 49.63% / 7.74% / 14.48 | 51.63% | durata |
| Celestina–Piera | 61.53% / 6.73% / 10.91 | 61.78% / 8.09% / 10.96 | 62.68% | quota |
| Celestina–Beppe | 52.06% / 7.06% / 9.32 | 45.99% / 9.55% / 9.16 | 68.10% | com fuori 35-65 |
| Piera–Piera | 50.00% / 6.43% / 11.64 | 50.02% / 9.88% / 11.09 | 50.35% | — |
| Piera–Beppe | 53.84% / 1.33% / 9.01 | 50.33% / 1.68% / 8.26 | 66.90% | com fuori 35-65 |
| Beppe–Beppe | 53.42% / 5.99% / 7.63 | 55.82% / 8.95% / 6.81 | 49.62% | — |

Incontri fuori sui soli euristici: 8 su 15

## Lettura

- **La regola nuova non semplifica: gli incontri fuori passano da 6 a 8 su 15.** Tolto il casuale, emergono debolezze che la media
  nascondeva: il casuale gioca male soprattutto le carte di Celestina, Piera e Beppe, e quindi alzava le quote di chi li affrontava.
- **Mara è debole contro tutti gli avanzati con gli euristici:** 31,5% contro Celestina, 34,8% contro Piera, 36,4% contro Beppe. Contro
  Spazienzio perde 41,8% (lui vince il 58,2%, fuori dal 45–55%). Conferma la direzione della 1.6 (D92) e l'impressione del proprietario
  in SB-12b.
- **Spazienzio è debole contro Celestina (36,4%) e soprattutto Piera (30,1%)**, ma è nettamente avanti col solo casuale
  (`com` contro `com` 60–76%): le sue carte sono forti di per sé, sono gli avversari euristici a difendersi meglio. Spazienzio–Piera
  diventa lo scarto più grande del set.
- **Beppe con gli euristici sta in quota contro tutti** (46–50%); è col casuale che crolla (`com` contro `com`: gli altri vincono il
  67–76% contro di lui), segno di un mazzo che il gioco casuale non sa usare (oggetti da accumulare). Il controllo 35–65% segnala
  quattro incontri di Beppe e Spazienzio–Mara: da guardare, non da correggere da solo.
- **Celestina–Piera 61,8% e la durata dello specchio di Celestina (14,5 turni)** restano come prima.
- **Patte:** con gli euristici salgono un poco ovunque (Piera–Piera 9,9%, Celestina–Beppe 9,6%, Beppe–Beppe 9,0%), ancora sotto il 10%.

**Per la proposta 1.6 (D92):** Mara contro tutti, Spazienzio contro Piera e Celestina, Celestina–Piera e lo specchio di Celestina. Mara
rimane la leva che sposta più incontri.
