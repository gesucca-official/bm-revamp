"""SB-24 Fase B: i nomi, i flavour e le rarità finali per slot, dalla proposta e dalla revisione del proprietario (D166).

Uso come modulo: `finali()` restituisce {slot: {"nome", "nome_attuale", "flavour", "illustrazione", "rarita"}}; `PG` è lo slot dei
personaggi per id. Da riga di comando stampa i nomi che cambiano rispetto alla bozza di partenza.
La revisione (sb-24/revisione-proprietario.json) contiene solo i campi che il proprietario ha cambiato; gli altri vengono da
sb-24/proposta.json. Le rarità sono quelle della proposta (D166 (1)).
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
SB24 = ROOT / "docs/design/set-base/sb-24"
PG = {
    "bruiser.character.BigBadBruiser": "PG-SPA", "base.character.Mara": "PG-MAR",
    "junkie.character.ToxicJunkie": "PG-TOS", "base.character.Pino": "PG-PIN",
    "base.character.Gigi": "PG-GIG", "base.character.Cesira": "PG-CES", "base.character.Rocco": "PG-ROC",
}
RARITA = {"C": "COMMON", "NC": "UNCOMMON", "R": "RARE", "P": "PROTAGONIST"}


def finali():
    proposta = json.loads((SB24 / "proposta.json").read_text(encoding="utf-8"))["voci"]
    revisione = json.loads((SB24 / "revisione-proprietario.json").read_text(encoding="utf-8"))["voci"]
    out = {}
    for v in proposta:
        r = revisione.get(v["slot"], {})
        if "rarita" in r:
            raise SystemExit("la revisione cambia una rarità, fuori da D166: " + v["slot"])
        out[v["slot"]] = {
            "nome_attuale": v["nome_attuale"],
            "nome": r.get("nome", v["nome"]),
            "flavour": r.get("flavour", v["flavour"]),
            "illustrazione": r.get("illustrazione", v["illustrazione"]),
            "rarita": v["rarita"],
        }
    if set(revisione) - set(out):
        raise SystemExit("slot della revisione assenti dalla proposta: " + ", ".join(sorted(set(revisione) - set(out))))
    return out


if __name__ == "__main__":
    for slot, v in finali().items():
        if v["nome"] != v["nome_attuale"]:
            print(slot, "|", v["nome_attuale"], "->", v["nome"])
