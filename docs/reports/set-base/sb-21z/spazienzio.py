"""SB-21z: da dove viene il salto di Spazienzio? z0 con le bound di Spazienzio di SB-21g (SPA-BO1 +5 V; SPA-BO2 3 HIT),
entrambe o una per volta; riga di Spazienzio contro i sette, 100 semi. Solo diagnosi: numeri belli non richiesti."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sb21z as z  # noqa: E402

vecchie = {c["binding"]: c for c in z.leggi(z.ROOT / "server/target/sb-21h-b/rif.json")["cards"]
           if c["binding"] in ("bruiser.character.LittleSmack", "bruiser.character.LittleRage")}
riga0 = z.riga("starter-spazienzio", z.esito(z.coppie([z.AREA / "round-z0"])))
print("z0", {k: round(v, 1) for k, v in riga0.items()}, round(sum(riga0.values()) / 6 - 50, 1))
for nome, quali in (("spa-vecchie", list(vecchie)), ("spa-vecchia-b", ["bruiser.character.LittleRage"]),
                    ("spa-vecchia-a", ["bruiser.character.LittleSmack"])):
    bozza = z.AREA / f"{nome}.json"
    z.applica(z.AREA / "z0.json", bozza, [], {b: vecchie[b] for b in quali}, belli_obbligatori=False)
    c = z.misura(nome, bozza, 100, righe=("starter-spazienzio",), avversari=z.RIF)
    r = z.riga("starter-spazienzio", z.esito(z.coppie([c])))
    print(nome, {k: round(v, 1) for k, v in r.items()}, round(sum(r.values()) / 6 - 50, 1), flush=True)
