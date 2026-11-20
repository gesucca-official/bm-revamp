"""SB-21z: bozza z0 = candidato k1 di SB-21h (bound di D160 con i valori tenuti) + numeri belli di D161 (3).
Regola: il valore bello piu' vicino; sui pareggi (3, 12 fra 10 e 15 no: 10 e' piu' vicino) scelta per carta, scritta qui accanto.
Uso dalla radice: python -B -X utf8 docs/reports/set-base/sb-21z/z0.py <k1.json> <z0.json>"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sb21z as z  # noqa: E402

BELLI = [
    # Personaggi
    ("bruiser.character.BigBadBruiser", "resources.HEALTH", 80),   # 78
    ("junkie.character.ToxicJunkie", "resources.HEALTH", 65),      # 66
    ("base.character.Pino", "resources.HEALTH", 80),               # 78
    ("base.character.Pino", "resources.ALCOHOL", 15),              # 14
    # Bound: i colpi da 1 diventano 2 (si rimisura il +10)
    ("bruiser.character.LittleSmack", "target.0.amount", 2),
    ("base.pino.bound.SpallataAlBancone", "target.0.amount", 2),
    ("base.rocco.bound.Colpetto", "target.0.amount", 2),
    ("base.gigi.bound.ColpoDiCacciavite", "self.0.amount", 2),
    ("base.gigi.bound.ColpoDiCacciavite", "target.0.amount", 2),
    ("base.cesira.bound.Battutina", "self.0.amount", 2),           # +1 A, 1 HIT -> +2 A, 2 HIT; se supera +10 si cambia forma
    ("base.cesira.bound.Battutina", "target.0.amount", 2),
    ("base.tossico.bound.RaschiareIlFondo", "self.0.amount", 2),   # +1 T -> +2 T
    ("base.spazienzio.bound.TestaAlMuro", "self.0.amount", 4),     # 3 HIT a se' -> 4: la (c) resta col suo prezzo
    # Carte
    ("base.mara.CinghiataDiTraverso", "target.0.amount.base", 20),  # 18
    ("base.mara.SorpassoInCurva", "target.1.amount", 4),            # 3 CUT -> 4: Mara fa piccoli tagli
    ("bruiser.SeagullFly", "target.0.amount", 20),                  # 18
    ("base.com.MattoneDelCantiere", "target.0.amount", 25),         # 24
    ("base.com.TartarugaSulMarciapiede", "self.3.amount", 2),       # +3 H -> +2: una parata non allunga le partite
    ("base.com.SputoDaPosacenere", "target.0.amount", 10),          # 12
    ("com.items.CocktailOnTheGround", "self.0.amount", 10),         # +12 V
    ("com.items.CocktailOnTheGround", "self.2.amount", 2),          # +3 T (malus) -> 2, insieme ai -2 V
    ("base.items.PaninoDelKebab", "self.0.amount", 10),             # +12 H
    ("base.items.PaninoDelKebab", "self.1.amount", 2),              # +3 T (malus) -> 2
    ("junkie.ToxicBloodDrain", "params.poison", 10),                # 12
    ("base.com.RincorsaDalMarciapiede", "target.0.amount", 10),     # 12
    ("base.items.PasticcaTrovataSulBancone", "self.0.amount", 10),  # 12
    ("base.pino.UltimoGiro", "params.base", 10),                    # 12
    ("base.pino.RuttoADistanzaSociale", "params.base", 15),         # 14
    ("base.gigi.ChiaveDaTredici", "target.0.amount", 20),           # 18
    ("base.gigi.LavoroFattoBene", "params.base", 15),               # 14
    ("bruiser.StunningBlow", "target.1.amount", 10),                # 12
    ("base.com.AcquaInFaccia", "target.1.amount", 4),               # 3 HIT -> 4: non comune
    ("base.rocco.PrimaIo", "self.1.amount", 4),                     # +3 H -> 4: Duccio incassa
    ("base.rocco.NeHoPreseDiPeggio", "target.0.amount.base", 10),   # 12
    ("base.rocco.NoccheSbucciate", "cost.HEALTH", 15),              # 16
    ("base.rocco.NoccheSbucciate", "target.0.amount", 20),          # 18
    ("base.rocco.Incassare", "self.2.amount", 4),                   # +3 H -> 4: Duccio incassa
    ("base.rocco.Capocciata", "cost.HEALTH", 30),                   # 28
    ("base.rocco.Capocciata", "target.0.amount", 25),               # 26
    ("base.com.SecondoFiato", "self.3.amount", 10),                 # 12
    ("junkie.LethalHeroinDose", "self.0.amount.perPlay", 2),       # «Rincara 5 (1 a se')» -> 2, come le altre
    ("base.pino.UltimoGiro", "params.perPlaySelf", 2),             # «Rincara 4 (1 a se')» -> 2
    ("base.items.ContoDelTavoloSei", "inPlay.0.amount", 4),         # -3 A a fine turno -> -4: malus di un oggetto da +15 V
]

if __name__ == "__main__":
    z.applica(sys.argv[1], sys.argv[2], BELLI)
    print("ok", z.sha(sys.argv[2]))
