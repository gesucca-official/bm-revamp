"""Prepara in %TEMP% le copie per gli isolamenti di SB-21, giro 1."""
import argparse
from copy import deepcopy
import json
from pathlib import Path
import subprocess
import sys
import tempfile

RADICE = Path(__file__).resolve().parents[5]
BOZZA = RADICE / "server/src/test/resources/set-base/bozza.json"
TESTI = RADICE / "docs/design/set-base/testi/genera-testi.py"

ESTASI = "base.pino.GoingBerserk"
GRAPPA = "base.items.GrappaDellaCasa"
MEZZA = "base.items.MezzaMineraleSgasata"

RIFERIMENTI = (
    "starter-spazienzio", "starter-mara", "starter-tossico", "starter-pino",
    "starter-gigi", "prova-sergio", "prova-duccio",
)

# Id, controllo, carta introdotta e copie tolte. Grappa con Mezza ha un
# controllo appaiato con la stessa Mezza e le stesse carte rimanenti.
SCAMBI_ESTASI = (
    ("iso-estasi-beppe", "starter-gigi", ESTASI, {"base.gigi.ChiaveDaTredici": 2}),
    ("iso-estasi-spazienzio", "starter-spazienzio", ESTASI, {"bruiser.SeagullFly": 2}),
    ("iso-estasi-mara", "starter-mara", ESTASI, {"base.com.SputoDaPosacenere": 2}),
)
SCAMBI_GRAPPA = (
    ("controllo-piera-mezza", "starter-pino", MEZZA,
     {"base.com.FasciaturaColFazzolettaccio": 1, "com.Grab": 1}),
    ("iso-grappa-beppe", "starter-gigi", GRAPPA,
     {"base.items.EspressoDelDistributore": 1, "base.gigi.UnaStrettaDiProva": 1}),
    ("iso-grappa-mara", "starter-mara", GRAPPA, {"base.items.EspressoDelDistributore": 2}),
    ("iso-grappa-piera", "starter-pino", GRAPPA, {"com.items.RottenBeer": 2}),
    ("iso-grappa-piera-mezza", "controllo-piera-mezza", GRAPPA, {"com.items.RottenBeer": 2}),
)


def scambia(mazzi, nuovo, controllo, carta, rimosse):
    assert nuovo not in mazzi and sum(rimosse.values()) == 2
    mazzo = deepcopy(mazzi[controllo])
    mazzo["id"] = nuovo
    carte = mazzo["cards"]
    assert carta not in carte
    for binding, copie in rimosse.items():
        assert carte[binding] >= copie
        carte[binding] -= copie
        if carte[binding] == 0:
            del carte[binding]
    carte[carta] = 2
    assert sum(carte.values()) == 20
    mazzi[nuovo] = mazzo
    return mazzo


def prepara(dest, estasi, grappa=None):
    bozza = json.loads(BOZZA.read_bytes())
    carte = {c["binding"]: c for c in bozza["cards"]}
    carte[ESTASI]["params"]["base"] = estasi
    scambi = SCAMBI_ESTASI
    if grappa is not None:
        passo, = (p for p in carte[GRAPPA]["self"] if p["op"] == "gain" and p["resource"] == "ALCOHOL")
        passo["amount"] = grappa
        scambi = SCAMBI_GRAPPA
    mazzi = {m["id"]: m for m in bozza["decks"]}
    assert ESTASI not in mazzi["starter-gigi"]["cards"]
    for argomenti in scambi:
        bozza["decks"].append(scambia(mazzi, *argomenti))
    dest.write_text(json.dumps(bozza, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    subprocess.run([sys.executable, "-X", "utf8", str(TESTI), str(dest), "--scrivi"], check=True)


if __name__ == "__main__":
    cli = argparse.ArgumentParser(description=__doc__)
    cli.add_argument("dest", type=Path)
    cli.add_argument("--estasi", required=True, type=int, choices=(18, 15, 12, 10))
    cli.add_argument("--grappa", type=int, choices=(25, 20, 15))
    args = cli.parse_args()
    dest = args.dest.resolve()
    if not dest.is_relative_to(Path(tempfile.gettempdir()).resolve()):
        cli.error("la copia di misura deve stare in %TEMP%")
    prepara(dest, args.estasi, args.grappa)
