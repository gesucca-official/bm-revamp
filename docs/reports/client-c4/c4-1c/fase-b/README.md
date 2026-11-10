# C4-1c — Evidenze della Fase B

Prodotto esportato di ac1e885, jar e dist fissi: [provenienza](build.json). Nessun codice di prodotto cambiato.

- [Ffa prima](ffa-prima/run-summary.json), due misure.
- [Serie dopo](serie-dopo/run-summary.json), Verify/Ffa/Layout e misure ufficiali.
- [Confronto Ffa](confronto-ffa.json), eseguito con compare-runs.mjs.
- [Guasti](guasti.json): prove sintetiche degli strumenti, non esiti di prodotto; [PID e comandi della parte appesa](guasto-hang-processi.txt).

- [Giro completo N=4](parallelo-4/run-summary.json), **25/25 verde, 41:43**.
- [Confronto completo](confronto-completo.json), rispetto alla serie di Fase A e alla serie attuale mirata.
- [Pubblicazione dei dati reali](pubblicazione.txt): 16 catture finali, circa 2 MB; le altre restano in TEMP.

Il secondo giro N=4 è stato saltato per scelta esplicita del proprietario: variabilità non verificata. Il [rapporto](../../../client-c4-report.md#c4-1c--fase-b) distingue i dati reali dalle prove sintetiche.

- [Controlli finali](controlli.json): client, repository, regole, contesto Spring separato, manifest e pulizia.
