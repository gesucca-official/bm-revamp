"""SB-21h Fase B: le 21 bound della proposta con le correzioni di D160, scritte nella bozza o in una copia di misura.

Uso dalla radice: python -B -X utf8 bound.py <bozza ingresso> <bozza uscita> [binding:campo:valore ...]
Ogni bound sostituisce per intero la scheda dello stesso slot (stesso binding, salvo le due varianti Java); i mazzi non cambiano:
gli starter e i mazzi di prova portano già le bound degli slot (a) e (b). I tre campi stampati li rigenera genera-testi.py --scrivi.
"""
import copy
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[5]
sys.path.insert(0, str(ROOT / "docs/design/set-base/testi"))

FACTOR = 0.75


def gain(r, n):
    return {"op": "gain", "resource": r, "amount": n}


def cleanup(*resources):
    # D160 (3): «perdi un quarto della tua T e/o L, per difetto».
    return [{"op": "lose", "resource": r, "amount": {"base": 0, "of": r, "divide": 4}} for r in resources]


def shield(name, types=("HIT", "CUT", "POISON"), factor=FACTOR):
    # D159 (1b), D160 (2): HIT, CUT e POISON ricevuti x0,75 in questo turno (turns 0: fino a fine turno, veleno periodico compreso).
    label = {"HIT": "Hit", "CUT": "Cut", "POISON": "Poison"}
    return [{"op": "status", "name": f"{name.upper()} - {t}", "description": f"{label[t]} Damage taken: x{factor}",
             "statusType": "GOOD", "flow": "INPUT", "property": t, "factor": factor, "turns": 0} for t in types]


def bound(binding, character, rarity, slot, name, role, priority, targets, self_steps=(), target_steps=(), damage="—"):
    card = {"binding": binding, "rarity": rarity, "kind": "BOUND", "boundTo": character, "priority": priority, "targets": targets}
    if self_steps:
        card["self"] = list(self_steps)
    if target_steps:
        card["target"] = list(target_steps)
    card["gui"] = {"name": name, "description": f"{slot} · x", "role": role, "gains": "—", "damage": damage, "damageAmount": "—"}
    return card


def java(binding, rarity, slot, name, role, priority, params):
    return {"binding": binding, "rarity": rarity, "java": True, "cost": {}, "priority": priority, "params": params,
            "gui": {"name": name, "description": f"{slot} · x", "role": role, "gains": "—", "damage": "—", "damageAmount": "—"}}


SPA, MAR, TOS = "bruiser.character.BigBadBruiser", "base.character.Mara", "junkie.character.ToxicJunkie"
PIN, GIG, CES, ROC = "base.character.Pino", "base.character.Gigi", "base.character.Cesira", "base.character.Rocco"
C, NC = "COMMON", "UNCOMMON"
HIT2 = [{"op": "damage", "type": "HIT", "amount": 2}]
CUT2 = [{"op": "damage", "type": "CUT", "amount": 2}]


def tris():
    """Binding da sostituire -> scheda nuova, nell'ordine (a), (b), (c) per personaggio."""
    return {
        # Spazienzio
        "bruiser.character.LittleSmack": bound("bruiser.character.LittleSmack", SPA, C, "SPA-BO2", "Schiaffo e acqua fresca", "DAMAGE",
                                               1, ["OPPONENT"], cleanup("TOXICITY", "ALCOHOL"), HIT2, "HIT"),
        "bruiser.character.LittleRage": bound("bruiser.character.LittleRage", SPA, C, "SPA-BO1", "Mi tengo al banco", "DEFENSE", 2,
                                              ["SELF"], [gain("VIOLENCE", 5), *shield("Mi tengo al banco")]),
        # SPA-BO3 «TESTA AL MURO» resta com'è (proposta: già presente, rimisura).
        # Mara
        "base.mara.bound.PassoStretto": bound("base.mara.bound.PassoStretto", MAR, C, "MAR-BO1", "Scarto e sputo", "DAMAGE", 1,
                                              ["OPPONENT"], cleanup("TOXICITY", "ALCOHOL"), CUT2, "CUT"),
        "base.mara.bound.CambioMarcia": bound("base.mara.bound.CambioMarcia", MAR, C, "MAR-BO2", "Semaforo rosso", "DEFENSE", 2,
                                              ["SELF"], [gain("ALERTNESS", 6), *shield("Semaforo rosso")]),
        "base.mara.bound.ColpoDiStriscio": bound("base.mara.bound.ColpoDiStriscio", MAR, NC, "MAR-BO3", "Ti chiudo la corsia", "DISRUPT",
                                                 2, ["OPPONENT"], (), [{"op": "anticipo", "steps": [
                                                     {"op": "lose", "resource": "ALERTNESS", "amount": 4}]}]),
        # Celestina
        "junkie.character.PatheticBlade": bound("junkie.character.PatheticBlade", TOS, C, "TOS-BO1", "Fondo del posacenere", "DAMAGE", 1,
                                                ["OPPONENT"], [gain("TOXICITY", 2)], CUT2, "CUT"),
        "base.tossico.bound.RaschiareIlFondo": bound("base.tossico.bound.RaschiareIlFondo", TOS, C, "TOS-BO2", "Stretta al giubbotto",
                                                     "DEFENSE", 2, ["SELF"], [gain("TOXICITY", 6), *shield("Stretta al giubbotto")]),
        "junkie.character.RottenSmile": bound("junkie.character.RottenSmile", TOS, NC, "TOS-BO3", "Taglio la dose", "RESOURCES", 0, ["SELF"],
                                              [{"op": "gain", "resource": "HEALTH", "amount": {"base": 0, "of": "TOXICITY", "divide": 4}},
                                               {"op": "lose", "resource": "TOXICITY", "amount": {"base": 0, "of": "TOXICITY", "divide": 2}}]),
        # Piera: la sua L è carburante, quindi la (a) pulisce solo la T (D159 (1a)).
        "base.pino.bound.SpallataAlBancone": bound("base.pino.bound.SpallataAlBancone", PIN, C, "PIN-BO2", "Spallata e seltz", "DAMAGE", 1,
                                                   ["OPPONENT"], cleanup("TOXICITY"), HIT2, "HIT"),
        "base.pino.bound.CinqueMinutiEVado": bound("base.pino.bound.CinqueMinutiEVado", PIN, C, "PIN-BO1", "Tengo il posto", "DEFENSE", 2,
                                                   ["SELF"], [gain("ALCOHOL", 5), *shield("Tengo il posto")]),
        "base.pino.bound.Coccio": bound("base.pino.bound.Coccio", PIN, NC, "PIN-BO3", "Mi schiarisco le idee", "RESOURCES", 0, ["SELF"],
                                        [{"op": "gain", "resource": "ALERTNESS", "amount": {"base": 0, "of": "ALCOHOL", "divide": 2}},
                                         {"op": "lose", "resource": "ALCOHOL", "amount": {"base": 0, "of": "ALCOHOL", "divide": 2}}]),
        # Beppe
        "base.gigi.bound.ColpoDiCacciavite": bound("base.gigi.bound.ColpoDiCacciavite", GIG, C, "GIG-BO2", "Colpo di cacciavite", "DAMAGE",
                                                   1, ["OPPONENT"], [gain("VIOLENCE", 1)], HIT2, "HIT"),
        "base.gigi.bound.UnaStrettaEPassa": bound("base.gigi.bound.UnaStrettaEPassa", GIG, C, "GIG-BO1", "Dietro il cofano", "DEFENSE", 2,
                                                  ["SELF"], [gain("VIOLENCE", 5), *shield("Dietro il cofano")]),
        "base.gigi.bound.Lima": bound("base.gigi.bound.Lima", GIG, NC, "GIG-BO3", "Affilo l'attrezzo", "OTHER", 0, ["SELF"],
                                      [{"op": "status", "name": "AFFILO L'ATTREZZO", "description": "Hit Damage dealt: x0.75 as Cut",
                                        "statusType": "GOOD", "flow": "OUTPUT", "property": "HIT", "factor": FACTOR, "turns": 1,
                                        "equip": True, "convertTo": "CUT"}]),
        # Sergio
        "base.cesira.bound.Battutina": bound("base.cesira.bound.Battutina", CES, NC, "CES-BO2", "Battutina", "DAMAGE", 1, ["OPPONENT"],
                                             [gain("ALERTNESS", 2)], HIT2, "HIT"),
        "base.cesira.bound.FareIlVago": bound("base.cesira.bound.FareIlVago", CES, NC, "CES-BO3", "Fare il vago", "DEFENSE", 2, ["SELF"],
                                              [gain("ALERTNESS", 8), *shield("Fare il vago")]),
        "base.cesira.bound.MiInformo": java("base.cesira.bound.NeRiparliamoFuori", NC, "CES-BO1", "Ne riparliamo fuori", "COUNTER", 2, {}),
        # Duccio
        "base.rocco.bound.Colpetto": bound("base.rocco.bound.Colpetto", ROC, NC, "ROC-BO1", "Gomitata e fontanella", "DAMAGE", 1,
                                           ["OPPONENT"], cleanup("TOXICITY", "ALCOHOL"), HIT2, "HIT"),
        "base.rocco.bound.AlzoLaVoce": bound("base.rocco.bound.AlzoLaVoce", ROC, NC, "ROC-BO3", "Dietro lo striscione", "DEFENSE", 2,
                                             ["SELF"], [gain("ALERTNESS", 8), *shield("Dietro lo striscione")]),
        "base.rocco.bound.Gomitata": java("base.rocco.bound.MiRialzo", NC, "ROC-BO2", "Mi rialzo dal marciapiede", "RESOURCES", 0,
                                          {"heal": 4, "healthAtLeast": 1, "healthAtMost": 30}),
    }


def blocchi(testo):
    """Posizione di ogni scheda di carta per binding: (inizio, fine) nel testo."""
    dec = json.JSONDecoder()
    out = {}
    i = testo.index('"cards"')
    i = testo.index("[", i) + 1
    while True:
        while testo[i] in " \r\n\t,":
            i += 1
        if testo[i] == "]":
            return out
        obj, fine = dec.raw_decode(testo, i)
        out[obj["binding"]] = (i, fine)
        i = fine


def scrivi(testo, schede):
    pos = blocchi(testo)
    for vecchio, nuova in sorted(schede.items(), key=lambda kv: -pos[kv[0]][0]):
        a, z = pos[vecchio]
        testo = testo[:a] + json.dumps(nuova, ensure_ascii=False) + testo[z:]
    json.loads(testo)
    return testo, {v: s["binding"] for v, s in schede.items() if v != s["binding"]}


def modifica(schede, binding, campo, valore):
    """binding:campo:valore su una scheda nuova, campo con percorso puntato (self.0.amount, target.0.amount, priority...)."""
    scheda = next(s for s in schede.values() if s["binding"] == binding)
    *percorso, chiave = campo.split(".")
    sede = scheda
    for p in percorso:
        sede = sede[int(p)] if isinstance(sede, list) else sede[p]
    if isinstance(sede, list):
        chiave = int(chiave)
    if valore == "del":  # toglie il passo o il campo (Sergio (b) senza risorsa, D160: si abbassa solo oltre +10)
        del sede[chiave]
    else:
        sede[chiave] = valore


def costruisci(ingresso, uscita, modifiche=()):
    schede = copy.deepcopy(tris())
    for b, c, v in modifiche:
        modifica(schede, b, c, v)
    testo = Path(ingresso).read_bytes().decode("utf-8")
    nuovo, rinomina = scrivi(testo, schede)
    # Le due varianti Java cambiano binding: nessun mazzo di riferimento le porta (sono (c), fuori dagli starter).
    for vecchio, nuovo_b in rinomina.items():
        assert f'"{vecchio}"' not in nuovo.split('"decks"')[1], vecchio
    Path(uscita).write_bytes(nuovo.encode("utf-8"))
    return rinomina


if __name__ == "__main__":
    args = sys.argv[1:]
    mods = []
    for x in args[2:]:
        b, c, v = x.split(":")
        mods.append((b, c, v if v == "del" else float(v) if "." in v else int(v)))
    print(costruisci(args[0], args[1], mods))
