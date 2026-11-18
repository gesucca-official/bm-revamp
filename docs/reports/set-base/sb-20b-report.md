# SB-20b — Fase B: numeri «brutti» puliti, misurati con «Rif»

**Esito: tutti e cinque i cambi di [D139](../../set-base-decisioni.md#decisioni-del-proprietario) restano in bozza, suite `Test` verde.**
Un primo giro della suite si era fermato su `Bozza16Test`, fuori perimetro (STOP 1); con [D140](../../set-base-decisioni.md#decisioni-del-proprietario)
il test ammette le quattro carte di D139 e la suite è verde. I criteri della
[sez. 7 della proposta](../../design/set-base/sb-20b-proposta.md#7-piano-della-fase-b) sono rispettati al primo giro: nessuna coppia esce
dalla fascia D95, spostamento massimo 2,66 punti (Spazienzio–Mara), identità byte per byte sui tre incontri senza carte toccate. La
riserva non è servita. `controlla-numeri.py` passa sulla bozza nuova. Misure usate 229 s su 1.200. 18 novembre 2026, passo diretto.

## Stato per tappe

- **Misura di base.** Bozza di `0ba002e` copiata in `%TEMP%\bm-sb20b\bozza-base.json`; fattibilità 10,8 s, «Rif» 92,1 s. Cancello contro il
  «Rif» di B2a (`%TEMP%\bm-sb19-b2a\round-rif-b2a`): 4.032 celle identiche, 0 violazioni ([identity-base-b2a.json](sb-20b/identity-base-b2a.json)).
- **Modifica.** Cinque carte in `bozza.json`, griglia, bozza di riferimento rigenerata, controllo nuovo, attesi di quattro test.
- **Misura finale.** Fattibilità 17,6 s, «Rif» 108,9 s; criteri in [criteri.md](sb-20b/criteri.md) ([JSON](sb-20b/criteri.json)), calcolati da
  [criteri.py](sb-20b/criteri.py) sulle uscite di `analyze.py rif` di SB-19.
- **Verifiche.** Suite `Test` dopo le misure, mai insieme.

## Cosa cambia

| Carta | Prima | Dopo | Campi |
|---|---|---|---|
| MAR-AR4 Tra due paraurti | HIT e CUT ×0,4 | **×0,5** | due `factor`, `description` degli stati, `gui.description` |
| GEN-13 Tartaruga sul marciapiede | HIT e CUT ×0,6 | **×0,5** | idem |
| OGG-11 Casco da lavoro | HIT ×0,8 | **×0,75** | `factor`, `description` dello stato, `gui.description` |
| SPA-AR1 GARGANTUESCO IMPATTO | 34 HIT | **35 HIT** | `amount`, `gui.description`, `gui.damageAmount` |
| CES-AR7 Lo rivendo | «0 A: vendi…» | «Vendi…» | `gui.description` |

- **Griglia:** righe di SPA-AR1, MAR-AR4, GEN-13, OGG-11 coi valori nuovi (D139, il vecchio barrato); MAR-AR1 +5 CUT, MAR-AR2 ×0,8,
  MAR-AR3 +4 A riallineate a D99 (erano ferme a D97). CES-AR7 nella griglia non stampava il costo: nessun cambio.
- **Bozza di riferimento** rigenerata (`--scrivi`, poi `--verifica` allineato); `rarita-bozza.py --check`: «rarità come la griglia».
- **Copie:** `git grep` dei testi vecchi trova solo la bozza, lo storico 1.5 e le bozze di evidenza dei blocchi passati (storiche, non
  toccate); niente catalogo, client o SQLite.
- **[controlla-numeri.py](../../design/set-base/controlla-numeri.py)** (nuovo, sola lettura): R1–R4 come predicati della sez. 3, esce con 1
  se trova una violazione. I valori tenuti della sez. 5 sono una lista esplicita con la decisione: PIN-AR3 ×0,65 (D97 (4)), MAR-AR2
  ×0,8 (D99 (1)), ROC-AR1 16 H e ROC-AR6 33 H (D127 (2)), ROC-AR4 26 HIT (D125 (1), D127). Sulla bozza di prima trova esattamente le
  cinque carte della proposta; sulla nuova nessuna violazione.

## Attesi dei test cambiati (D139)

Solo sulla bozza viva; i test che leggono la 1.5 congelata (`LethalAwarePolicyTest`, `PotenzaD82Test`, `Correzione15Test`) restano
verdi e non cambiano: i loro 34 sono storia della 1.5.

| Test | Prima → dopo | Perché |
|---|---|---|
| `StarterRedesignTest.theFiveFoundHitsArePlayableWithTheirApprovedDamage` | Impatto 34 → 35 | D139 (3) |
| `StarterRedesignTest.theThreeDefensesStillParryTheirTypesBeforeExpiring` | danni {3, 4, 5} → {2, 5, 5} | D139 (2): Tartaruga 10 × 0,5 − cura 3; Paraurti 10 × 0,5 |
| `SetBaseDraftTest.theGigiStarterFollowsTheGrid` | Casco `factor` 0,8 → 0,75 | D139 (2) |
| `SetBaseDraftTest.theGigiMechanicsWorkOnHandBuiltStates` | Casco su 20 HIT: −16 → −15 | D139 (2) |
| `Sb17CardsTest`, `Sb16iBotsTest` (solo commenti e messaggio) | 34 × 0,75 = 25 → 35 × 0,75 = 26; 27 di 34 → 28 di 35 | D139 (3); asserzioni invariate e verdi |
| `Bozza16Test.the16ChangesExactlyWhatD97Approved` | lista `D139` (Impatto, Paraurti, Tartaruga, Casco) unita a `CHANGED`: possono differire dalla 1.5, restano controllati rarità, tipo, priorità, bersagli, costo, `java`, `exclusiveTo` e nome | D139, D140 |

Nessun altro test è cambiato.

## Criteri (sez. 7)

Quote dal lato del primo nominato, soli euristici; tabella completa in [criteri.md](sb-20b/criteri.md).

1. **Identità:** Celestina–Celestina, Celestina–Piera, Piera–Piera (432 celle e righe di coppia) identiche alla base. I mazzi di Celestina e
   Piera non hanno nessuna delle cinque carte; Sergio ha CES-AR7 e Tartaruga, quindi non entra nel criterio.
2. **Fascia D95:** nessuna coppia esce. Le due già fuori: Celestina–Sergio 68,83% → 68,82%, patte di Celestina–Celestina 12,58% → 12,58%.
   La coppia più vicina al bordo, Mara–Beppe, scende da 41,26% a 39,58% (4,6 sopra 35), come stimato (38–41).
3. **Spostamento ≤ 3 punti:** massimo +2,66 (Spazienzio–Mara 41,32% → 43,98%); poi Spazienzio–Duccio +1,98, Spazienzio–Piera +1,89,
   Mara–Beppe −1,68.
4. **Patte, durata, invarianti:** patte ≤ 10% fuori dallo specchio di Celestina (massimo Beppe–Beppe 9,26%, invariato); fuori dagli
   specchi turni ≤ 11,27; invarianti violati 0 su 403.200 partite; bound oltre il tetto 0.
5. **Media non-specchio per mazzo, prima → dopo:**

| Mazzo | Prima | Dopo | Δ |
|---|---:|---:|---:|
| Spazienzio | 43,21% | 44,91% | +1,70 |
| Mara | 52,58% | 51,53% | −1,05 |
| Celestina | 56,30% | 56,08% | −0,22 |
| Piera | 47,15% | 46,84% | −0,30 |
| Beppe | 51,41% | 51,35% | −0,06 |
| Sergio | 48,57% | 48,83% | +0,25 |
| Duccio | 50,78% | 50,46% | −0,32 |

Rispetto alle stime della sez. 4: Spazienzio sale meno del previsto (44,9 contro 45–48), Mara scende come previsto, Beppe resta quasi fermo
(il Casco a ×0,75 si vede poco: le celle di Piera–Beppe e Celestina–Beppe cambiano, ma la quota fra euristici è uguale al centesimo;
contro Mara e Spazienzio si muovono soprattutto le loro carte).

## Verifiche

| Verifica | Esito |
|---|---|
| Cancello d'identità della base contro B2a | identico, 4.032 celle |
| `git diff --check` | pulito |
| `python scripts/check-links.py` | 429 file, 0 link rotti |
| `python scripts/check-rules.py` | verde (regolamento 1.13, Set Base 0.1, SQLite integro) |
| `genera-bozza-di-riferimento.py --verifica`, `rarita-bozza.py --check` | allineati |
| `controlla-numeri.py` | nessuna violazione; sette mutazioni dei dati (non intero, fattore 0,7, valore tenuto cambiato, 34 fuori scala, numero nel testo senza dati, importo senza testo, risorsa iniziale non intera) escono tutte con 1 |
| `./scripts/build.ps1 -Task Test -Offline` | primo giro rosso: 947 test, 1 fallimento (`Bozza16Test`, vedi «Rossi»); dopo D140 **verde**: 947 test, 0 fallimenti, 23 saltati |
| Righe «Playground e misure»: `git diff --stat` dal commit di misura | solo dati della bozza, test, documenti e rapporti: nessuna corsa d'identità viva né `TestServerContext` |

Uscite grezze in `%TEMP%\bm-sb20b`: `bozza-base.json`, `bozza-new.json`, `round-sb20b-base`, `round-sb20b-new`, `rif-base.*`, `rif-new.*`,
log di fattibilità e giri, `tests-7.log` (i sette test prima della correzione degli attesi: 4 fallimenti, tutti su D139), `full-test.log` (primo giro),
`full-test-2.log` (dopo D140).

**Rossi:** nessuno aperto. Nel primo giro `Bozza16Test.the16ChangesExactlyWhatD97Approved` falliva su `bruiser.SuperImpact` (34 nella
1.5, 35 ora): il test vuole uguali alla 1.5 congelata tutte le carte fuori da `CHANGED`. Effetto diretto di D139, non una regressione (il
messaggio mostra la sola differenza 34 → 35; non riprovato sulla base). Il file era fuori perimetro: STOP 1, risolto da D140 con la
lista `D139` unita a `CHANGED`. Non entra nel registro dei rossi noti. **Non verificato:** nulla del gioco vivo, che non cambia.

## Scelte prese

1. Aggiornate anche le `description` interne degli stati («Hit Damage taken: x0.5»), oltre al testo stampato: sono parte del dato della
   carta e restavano altrimenti in contraddizione.
2. R3 in `controlla-numeri.py` conta i costi fra gli importi (serve per i 16 e 33 HEALTH di Duccio) ed esclude anche `perPlaySelf`, con lo
   stesso ruolo di `perPlay`. R4 ignora gli importi 0 (le basi «metà della A» non si stampano).
3. I criteri si calcolano con uno script nuovo nella cartella del blocco ([criteri.py](sb-20b/criteri.py)), che legge le uscite di
   `analyze.py rif` senza toccare gli strumenti di SB-19.
4. Lasciati com'erano i commenti di test che descrivono la 1.5 congelata (34 HIT, ×0,4, ×0,6): lì sono ancora veri.

## Cosa giudica il proprietario

- Se il guadagno di Spazienzio (+1,7 di media, ancora il più debole) e il calo di Mara–Beppe a 39,58% vanno bene così.
- **Dopo:** la pagina di SB-20a confronta con i valori della bozza: va rigenerata dopo che il proprietario ha esportato le sue
  modifiche. Poi SB-20c (testi stampati), che tocca lo stesso `bozza.json`.

## Domande

1. ~~Autorizzi la modifica di `Bozza16Test`?~~ Risolta in D140 («Sì, autorizzo»). Nessuna domanda aperta.
