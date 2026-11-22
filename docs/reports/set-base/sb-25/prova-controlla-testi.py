"""SB-25 Fase B1: prova del controllo dei testi (docs/design/set-base/testi/controlla-testi.py), un caso respinto per regola.

Uso, dalla radice: python -X utf8 docs/reports/set-base/sb-25/prova-controlla-testi.py
Esce con 1 se un caso non va come atteso. Due parti:
1. le regole del gergo (testi_stampati.gergo) su frasi di prova: ogni frase vietata è respinta, con la sua regola, nel testo breve;
   nel testo completo è respinta allo stesso modo, tranne il rimando al regolamento, che lì è ammesso; le frasi pulite passano;
2. il controllo intero (controlla) su copie alterate in memoria della bozza e dei testi completi: la bozza vera passa, ogni
   alterazione fallisce con l'errore atteso.
"""
import copy
import importlib.util
import json
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[4]
TESTI = ROOT / "docs/design/set-base/testi"
sys.path.insert(0, str(TESTI))
import testi_stampati as ts  # noqa: E402

spec = importlib.util.spec_from_file_location("controlla_testi", TESTI / "controlla-testi.py")
controlla_testi = importlib.util.module_from_spec(spec)
spec.loader.exec_module(controlla_testi)

SLOT = ts.carica_slot()
NOTI = list(SLOT.values())

# (caso, frase, regola attesa nel testo breve, regola attesa nel testo completo o None se lì è ammessa)
FRASI = [
    ("segno ×", "HIT e CUT ricevuti ×0,75.", "segno ×", "segno ×"),
    ("formula abs(", "Danno pari a abs(t).", "formula", "formula"),
    ("formula >=", "Se [[H]] >= 30, +4 [[H]].", "formula", "formula"),
    ("formula /", "Perdi [[T]]/4.", "formula", "formula"),
    ("abbreviazione HIT", "8 HIT all'avversario.", "abbreviazione", "abbreviazione"),
    ("abbreviazione POISON", "10 POISON all'avversario.", "abbreviazione", "abbreviazione"),
    ("abbreviazione HEALTH", "Guadagni 4 HEALTH.", "abbreviazione", "abbreviazione"),
    ("abbreviazione GOOD", "Ottieni uno stato GOOD.", "abbreviazione", "abbreviazione"),
    ("abbreviazione equip", "Per 3 turni (equip).", "abbreviazione", "abbreviazione"),
    ("lettera isolata t", "Guadagni [[H]] pari a t.", "lettera isolata", "lettera isolata"),
    ("lettera isolata x", "Danno 20+x all'avversario.", "lettera isolata", "lettera isolata"),
    ("rimando R05", "Vedi R05.", "rimando al regolamento", None),
    ("rimando RP-6", "La corazza (RP-6) lo riduce.", "rimando al regolamento", None),
    ("rimando Regolamento", "Come dice il Regolamento.", "rimando al regolamento", None),
    ("bersaglio", "8 [[HIT]] al bersaglio.", "parola vietata", "parola vietata"),
    ("autore", "L'autore guadagna 5 [[V]].", "parola vietata", "parola vietata"),
    ("a sé", "+5 [[V]] a sé.", "parola vietata", "parola vietata"),
    ("codice di slot", "SPA-BO1 · +5 [[V]].", "codice di slot", "codice di slot"),
]
PULITE = [
    "+5 [[V]]. In questo turno subisci tre quarti dei danni che subiresti.",
    "A fine turno diventi immune a [[T]].",
    "E poi infliggi 8 [[HIT]] all'avversario.",
    "Annuncia «E Allora...?» o «SPEDIAMOTI DUNQUE IN O-AHIO».",
    "Ottieni l'equipaggiamento positivo «Coccio di Bottiglia».",
]


def prova_gergo():
    falliti = 0
    for caso, frase, breve, completo in FRASI:
        for sede, atteso, problemi in (("breve", breve, ts.gergo(frase, NOTI)),
                                       ("completo", completo, ts.gergo(frase, NOTI, completo=True))):
            ok = (not problemi) if atteso is None else any(p.startswith(atteso) for p in problemi)
            print(f"{'ok ' if ok else 'NO '} gergo, {caso}, testo {sede}: {problemi or 'ammessa'}")
            falliti += not ok
    for frase in PULITE:
        problemi = ts.gergo(frase, NOTI) + ts.gergo(frase, NOTI, completo=True)
        print(f"{'ok ' if not problemi else 'NO '} gergo, frase pulita {frase!r}: {problemi or 'passa'}")
        falliti += bool(problemi)
    return falliti


def carta(b, slot):
    binding = next(k for k, v in SLOT.items() if v == slot)
    return next(c for c in b["cards"] if c["binding"] == binding)


def stato(b, slot, i=0):
    return ts.stati_carta(carta(b, slot))[i][0]


def casi(completi):
    yield "bozza e testi completi veri", None, lambda b: None, completi
    yield "description cambiata", "SPA-BO1 gui.description: atteso", lambda b: carta(b, "SPA-BO1")["gui"].update(
        description="+5 [[V]]."), completi
    yield "description con il codice di slot davanti", "MAR-BA gui.description: codice di slot", lambda b: carta(b, "MAR-BA")[
        "gui"].update(description="MAR-BA · " + carta(b, "MAR-BA")["gui"]["description"]), completi
    yield "description col vecchio gergo", "SPA-BO3 gui.description: abbreviazione", lambda b: carta(b, "SPA-BO3")["gui"].update(
        description="4 HIT a sé; +8 [[V]] a sé."), completi
    yield "segnaposto sconosciuto", "GEN-18 gui.description: token sconosciuto", lambda b: carta(b, "GEN-18")["gui"].update(
        description="8 [[COLPO]] all'avversario."), completi
    yield "gains cambiato", "SPA-BO1 gui.gains: atteso", lambda b: carta(b, "SPA-BO1")["gui"].update(gains="+6 V"), completi
    yield "nome di stato inglese", "SPA-BO1 stato 1: atteso", lambda b: stato(b, "SPA-BO1").update(
        name="MI TENGO AL BANCO - HIT"), completi
    yield "descrizione di stato inglese", "SPA-BO1 stato 2: atteso", lambda b: stato(b, "SPA-BO1", 1).update(
        description="Cut Damage taken: x0.75"), completi
    yield "testi completi alterati", "testi-completi.json: diverso", lambda b: None, completi.replace(
        "arrotondando".encode("utf-8"), "arrotondato".encode("utf-8"), 1)
    yield "testi completi mancanti", "testi-completi.json: manca", lambda b: None, None


def prova_controllo():
    base = json.loads(ts.BOZZA.read_text(encoding="utf-8"))
    completi = ts.COMPLETI_JSON.read_bytes()
    falliti = 0
    for caso, atteso, altera, file_completi in casi(completi):
        bozza = copy.deepcopy(base)
        altera(bozza)
        _, _, errori = controlla_testi.controlla(bozza, file_completi, SLOT)
        ok = (not errori) if atteso is None else any(e.startswith(atteso) for e in errori)
        print(f"{'ok ' if ok else 'NO '} controllo, {caso}: {errori[:2] if errori else 'passa'}")
        falliti += not ok
    return falliti


def main():
    falliti = prova_gergo() + prova_controllo()
    print(f"{'tutti i casi come attesi' if not falliti else f'{falliti} casi non come attesi'}")
    return 1 if falliti else 0


if __name__ == "__main__":
    sys.exit(main())
