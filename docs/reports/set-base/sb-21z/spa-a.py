"""SB-21z: Spazienzio (a) da pulizia + 2 HIT a +2 V + 2 HIT (D159 (1a), forma «danno piu' risorsa»); riga di Spazienzio a 100 semi."""
import copy
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sb21z as z  # noqa: E402

carta = next(c for c in z.leggi(z.AREA / "z0b.json")["cards"] if c["binding"] == "bruiser.character.LittleSmack")
nuova = copy.deepcopy(carta)
nuova["self"] = [{"op": "gain", "resource": "VIOLENCE", "amount": 2}]
for v in (2,):
    nuova["self"][0]["amount"] = v
    nome = f"z0c-spa-a-v{v}"
    bozza = z.AREA / f"{nome}.json"
    z.applica(z.AREA / "z0b.json", bozza, [], {nuova["binding"]: nuova})
    c = z.misura(nome, bozza, 100, righe=("starter-spazienzio",))
    r = z.riga("starter-spazienzio", z.esito(z.coppie([c])))
    print(nome, {k: round(q, 1) for k, q in r.items()}, round(sum(r.values()) / 6 - 50, 1), flush=True)
