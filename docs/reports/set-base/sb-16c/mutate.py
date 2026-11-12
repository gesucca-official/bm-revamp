"""SB-16c: mutazioni sulla logica nuova. Ognuna deve far fallire almeno un test di RegoleD50Test."""
import subprocess
import sys
from pathlib import Path

ROOT = Path(r"E:\bm\server\src\main\java\com\gsc\bm")
MVN = r"C:\Users\gesucca\AppData\Local\Temp\claude\70455c4622fd24de\077f50d0-e49c-43ff-b389-1dc26932335c\scratchpad\mvn.ps1"

MUTATIONS = [
    ("M1 niente eccezione per le mosse su di sé", "model/game/Game.java",
     'if (onSelf || card.isLastBlow()) return;', 'if (card.isLastBlow()) return;'),
    ("M2 gruppo solo per priorità", "model/game/Game.java",
     '+ (getSelf(m).getCharacter().getResources().get(Resource.ALERTNESS) & 0xffffffffL));', ');'),
    ("M3 morti controllati a ogni mossa", "model/game/Game.java",
     'if (!speed.get(m).equals(group)) {', 'if (true) {'),
    ("M4 costo in HEALTH fino a zero", "model/game/Move.java",
     '|| health > cost;', '|| health >= cost;'),
    ("M5 Ultimo colpo annullato a terra", "model/game/Game.java",
     'if (onSelf || card.isLastBlow()) return;', 'if (onSelf) return;'),
    ("M6 corazza anche sui CUT", "model/Character.java",
     'received.getType() == Damage.DamageType.HIT && resources', 'received.getType() != Damage.DamageType.POISON && resources'),
    ("M7 corazza prima degli stati", "model/Character.java",
     'Damage received = applyStatusToDamage(damage, statusToBeApplied, StatusFlow.INPUT);',
     'Damage received = damage;'),
    ("M8 oggetto trovato senza pesca", "model/game/Player.java",
     'character.getItems().add(card);\n                drawCard();', 'character.getItems().add(card);'),
    ("M9 niente pavimento", "model/Character.java",
     'ruleset.playground() ? Math.max(0, changed) : changed', 'changed'),
    ("M10 bot senza colpo dopo la carica", "model/game/bot/StyleSupport.java",
     'FOLLOW_UP = 20,', 'FOLLOW_UP = 0,'),
]


def run(only=None):
    results = []
    for name, rel, before, after in MUTATIONS:
        if only and int(name.split()[0][1:]) < int(only):
            continue
        path = ROOT / rel
        original = path.read_bytes()
        text = original.decode("utf-8")
        if text.count(before) != 1:
            results.append((name, "MUTAZIONE NON APPLICABILE"))
            continue
        path.write_bytes(text.replace(before, after).encode("utf-8"))
        try:
            proc = subprocess.run(["powershell", "-NoProfile", "-File", MVN, "-q", "test", "-Dtest=RegoleD50Test"],
                                  capture_output=True, text=True, encoding="utf-8", errors="replace")
            out = proc.stdout + proc.stderr
            failed = [l.strip() for l in out.splitlines() if "RegoleD50Test." in l and ("<<<" in l or ":" in l) and "ERROR]   " in l]
            verdict = "uccisa" if proc.returncode != 0 else "SOPRAVVISSUTA"
            results.append((name, verdict + ("; " + "; ".join(sorted(set(failed))[:4]) if failed else "")))
        finally:
            path.write_bytes(original)
        print(results[-1], flush=True)
    return results


if __name__ == "__main__":
    run(sys.argv[1] if len(sys.argv) > 1 else None)
