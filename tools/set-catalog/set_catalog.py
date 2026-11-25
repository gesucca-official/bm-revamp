"""SB-26 (D175): the set catalog generated from the set file.

One command turns the frozen draft (the set file) and the SB-25 texts into the candidate files of the set: the set document,
its annex, the SQLite catalog and the debug-client copy of the document. Further set files (expansions) can be given on the
command line: every set gets its own document and annex, and one SQLite catalog holds all of them.

The words are not written here. Short text, gains and nominal damage come from the SB-25 text generator
(docs/design/set-base/testi/testi_stampati.py); the full text of a set with a texts file (testi-completi.json) is read from it
and must be the one that generator writes. A card the SB-25 generator does not know (a test class of an expansion) keeps the
texts of its own file. Output is deterministic: fixed ordering, no timestamps, no paths of the machine.

    python tools/set-catalog/set_catalog.py --out DIR            # a catalog of trial, into DIR (relative to the root)
    python tools/set-catalog/set_catalog.py --out DIR --check    # regenerate in memory and compare, nothing written
    python tools/set-catalog/set_catalog.py --extra server/src/test/resources/sb-6b/mini.json --out docs/reports/set-base/sb-26/espansione

SB-28: `--vivo` writes the live catalog of the Set Base 1.0 from the same inputs, each file in its live place (LIVE_PATHS): the
set document and its debug-client copy, the annex, cards.sqlite, the live set file (the draft without its test decks) and the
test decks apart, in a decks-only file of the test resources. The manifest of the live catalog is docs/sets/manifest.json.

    python tools/set-catalog/set_catalog.py --vivo              # the live catalog
    python tools/set-catalog/set_catalog.py --vivo --check      # regenerate in memory and compare

The candidate of SB-26 (server/src/test/resources/set-base/catalogo) became the live catalog and left the repository: without
--vivo an output folder is required.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import sqlite3
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[2]
TESTI_DIR = ROOT / "docs/design/set-base/testi"
DEFAULT_SET = "server/src/test/resources/set-base/bozza.json"
DEFAULT_TEXTS = "docs/design/set-base/testi/testi-completi.json"
DEFAULT_SLOT = "docs/design/set-base/testi/slot.json"
DEFAULT_OUT = None  # SB-28: the SB-26 candidate folder became the live catalog (--vivo)
DEFAULT_VERSIONS = {"base": "1.0.1"}
# SB-28: the live catalog. The set document says the date and the regulation it requires; every output has its live place.
LIVE_DATE = "24 novembre 2026"  # SB-29: date of the live version 1.0.1; the 1.0 revision keeps its own date
LIVE_RULES = "2.1"  # SB-29 (D190): the live set requires regulation 2.1
LIVE_SET_FILE = "server/src/main/resources/sets/base.json"
LIVE_TEST_DECKS = "server/src/test/resources/set-base/mazzi-prova.json"
LIVE_MANIFEST = "docs/sets/manifest.json"
LIVE_PATHS = {"sets/base.md": "docs/sets/base.md", "client-debug/sets/base.md": "client-debug/src/assets/docs/sets/base.md",
              "sets/base.json": "docs/rules-catalog.json", "cards.sqlite": "server/src/main/resources/cards.sqlite",
              "set-file": LIVE_SET_FILE, "test-decks": LIVE_TEST_DECKS, "manifest.json": LIVE_MANIFEST}
STARTER_CATEGORY = {"base": "base", "avanzato": "avanzato"}
GENERATOR = "tools/set-catalog/set_catalog.py"
MANIFEST = "manifest.json"
SQLITE = "cards.sqlite"
NONE = "—"
MINUS = "−"
LETTER = {"HEALTH": "H", "ALERTNESS": "A", "VIOLENCE": "V", "TOXICITY": "T", "ALCOHOL": "L"}
RESOURCES = tuple(LETTER)
PLACEHOLDER = re.compile(r"\[\[(H|A|V|T|L|HIT|CUT|POISON)\]\]")
TOKEN_ROLE = {"role": "OTHER", "gains": NONE, "damage": NONE, "damageAmount": NONE}  # R07a of the token, as in Set Base 0.1

# The live schema of cards.sqlite (server/src/main/resources), plus full text and flavour (D175 (1)) on cards and characters.
SCHEMA = [
    'CREATE TABLE "CRD001_GUI"\n(\n\tC_REF_CLASS varchar2\n\t\tconstraint CRD001_INFO_pk\n\t\t\tprimary key,\n\tT_GUI_NAME varchar2,\n'
    '\tT_GUI_DESCRIPTION int\n, T_GUI_IMAGE varchar2, T_GUI_SPRITE varchar2, T_GUI_ROLE varchar2, T_GUI_GAINS varchar2, '
    'T_GUI_DAMAGE varchar2, T_GUI_DAMAGE_AMOUNT varchar2, C_EXCLUSIVE_TO varchar2, C_SET varchar2, C_RARITY varchar2, '
    'T_GUI_FULL_TEXT varchar2, T_GUI_FLAVOUR varchar2)',
    'CREATE TABLE DCK001_STARTERS\n(\n\tC_PG_REF_CLASS varchar2,\n\tC_CRD_REF_CLASS varchar2\n\t\tconstraint DCK001_FK001\n'
    '\t\t\treferences "CRD001_GUI",\n\tN_QTY int,\n\tconstraint DCK001_STARTERS_pk\n\t\tprimary key (C_PG_REF_CLASS, C_CRD_REF_CLASS)\n)',
    'CREATE TABLE CRD002_KEYWORDS\n(\n\tC_KEYWORD varchar2\n\t\tconstraint CRD002_KEYWORDS_pk\n\t\t\tprimary key,\n\tT_HTML int\n)',
    'CREATE TABLE "CRD003_CHARACTERS"\n(\n\tC_REF_CLASS varchar2\n\t\tconstraint CRD003_CHARACTERS_pk\n\t\t\tprimary key,\n'
    '\tT_GUI_NAME varchar2,\n\tT_GUI_SPRITE varchar2\n, C_SET varchar2, T_GUI_FULL_TEXT varchar2, T_GUI_FLAVOUR varchar2)',
    'CREATE TABLE "DCK002_STARTERS_CH"\n(\n\tC_PG_REF_CLASS varchar2\n\t\tconstraint DCK002_STARTERS_pk\n\t\t\tprimary key,\n'
    '\tT_BASIC_REF_CLASS varchar2,\n\tT_CH_BOUND_1_REF_CLASS varchar2\n, T_CH_BOUND_2_REF_CLASS varchar2, T_LAST_RESORT_REF_CLASS varchar2)',
]
# CRD002_KEYWORDS of the live catalog, unchanged: the keywords of the new set reach the client with SB-28 and SB-31.
KEYWORDS = [
    ("fallbackMove", "Fallback Move <i>(discard another card instead of this)</i>"),
    ("firstStrike", "Quick Move <i>(you act first than others when doing this)</i>"),
    ("lastStrike", "Slow Move <i>(others act first when you are doing this)</i>"),
    ("basicAction", "Basic Action <i>(you can always do this if its conditions are met)</i>"),
]
GROUP_ORDER = {"BA": 0, "BO": 1, "LR": 2, "AR": 3}
# SB-31 F4 (D198 (10)): the text of the status that the token creates, for the client. Only what the sheet of the token already says
# (docs/sets/base.md, «Bottiglia Spaccata»): no rule is added. Each fragment must still be in the full text of the token, so a change
# of the rule stops the generator instead of leaving a stale sentence.
TOKEN_STATUS_TEXT = ("I tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza, arrotondando per difetto. Dura finché non cambia un "
                     "danno e, dal primo danno che cambia, fino alla fine di quel turno; «PERMESSO SCUSA PUOI SMETTERLA» lo toglie.")
TOKEN_STATUS_SOURCE = ("i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza, arrotondando per difetto",
                       "Dura finché non cambia un danno; dal primo danno che cambia vale ancora, su ogni danno, fino alla fine di quel turno",
                       "«PERMESSO SCUSA PUOI SMETTERLA» lo toglie")


def load_texts_module(root=ROOT):
    """The SB-25 generator of the given repository copy (testi_stampati.py), imported by path."""
    path = root / "docs/design/set-base/testi/testi_stampati.py"
    spec = importlib.util.spec_from_file_location("testi_stampati_sb26", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def render(text):
    """Placeholders of the printed texts as the letters of R07 (H=HEALTH) and the names of the damage types."""
    return PLACEHOLDER.sub(r"\1", text)


def cost_text(cost):
    parts = [f"{v} {LETTER[r]}" for r, v in cost.items() if v]
    return " + ".join(parts) if parts else NONE


def priority_text(priority):
    return NONE if priority is None else str(priority).replace("-", MINUS)


# ---------------------------------------------------------------------------------------------------------------- model
class SetInput:
    def __init__(self, root, path, texts=None, slot=None, raw=None):
        self.path = path
        self.raw = (root / path).read_bytes() if raw is None else raw
        self.source_raw = self.raw  # SB-28: the draft the live set file comes from (the file itself otherwise)
        self.data = json.loads(self.raw.decode("utf-8"))
        if self.data.get("format") != "sb-6b/1":
            raise ValueError(f"{path}: formato sconosciuto, atteso sb-6b/1")
        self.id = self.data["set"]["id"]
        self.texts_path, self.slot_path = texts, slot
        self.texts_raw = (root / texts).read_bytes() if texts else None
        self.slot_raw = (root / slot).read_bytes() if slot else None


class Catalog:
    """Every entry of every set, with the texts of the SB-25 generator."""

    def __init__(self, root, sets, versions, live=False):
        self.root, self.sets, self.versions, self.live = root, sets, versions, live
        ts = self.ts = load_texts_module(root)
        merged = {"cards": [c for s in sets for c in s.data["cards"]],
                  "characters": [p for s in sets for p in s.data.get("characters", [])],
                  "decks": [d for s in sets for d in s.data.get("decks", [])]}
        ids = [s.id for s in sets]
        if len(set(ids)) != len(ids):
            raise ValueError("due file con lo stesso set: " + ", ".join(ids))
        self.ctx = ts.Contesto(merged)
        self.names = {c["binding"]: c["gui"]["name"] for c in merged["cards"]}
        self.characters = {p["id"]: p for p in merged["characters"]}
        self.char_code = {}
        self.slot = {}
        self.entries = {}  # binding -> entry
        self.order = {s.id: [] for s in sets}
        for s in sets:
            if s.slot_raw:
                slot = json.loads(s.slot_raw.decode("utf-8"))["slot"]
                self.slot.update(slot)
                for binding, code in slot.items():
                    if code.startswith("PG-"):
                        self.char_code[code[3:]] = binding
        seen = set()
        for s in sets:
            full = json.loads(s.texts_raw.decode("utf-8"))["voci"] if s.texts_raw else None
            for p in s.data.get("characters", []):
                self.add(s, self.character_entry(p, full), seen)
            for card in s.data["cards"]:
                self.add(s, self.card_entry(s, card, full), seen)
            if full is not None and ts.TOKEN_BINDING in full:
                self.add(s, self.token_entry(full[ts.TOKEN_BINDING]), seen)
            if full is not None:
                extra = sorted(set(full) - {e["class"] for e in self.entries.values() if e["set"] == s.id})
                if extra:
                    raise ValueError(f"{s.texts_path}: voci senza carta nel set: {', '.join(extra)}")

    def add(self, s, entry, seen):
        if entry["class"] in seen:
            raise ValueError(f"binding ripetuto fra i set: {entry['class']}")
        seen.add(entry["class"])
        entry["set"] = s.id
        self.entries[entry["class"]] = entry
        self.order[s.id].append(entry["class"])

    def full_text(self, full, binding, generated):
        """The full text: from the texts file when the set has one (and it must be the generator's), else the generator's."""
        if full is None:
            return generated
        if binding not in full:
            raise ValueError(f"{binding}: manca nel file dei testi completi")
        if full[binding]["completo"] != generated:
            raise ValueError(f"{binding}: il testo completo del file non è quello del generatore di SB-25 (genera-testi.py --scrivi)")
        return full[binding]["completo"]

    def character_entry(self, p, full):
        ts = self.ts
        generated = ts.completo_personaggio(p, self.ctx)
        if full is not None and full.get(p["id"], {}).get("breve") != ts.breve_personaggio(p):
            raise ValueError(f"{p['id']}: il testo breve del file non è quello del generatore di SB-25")
        return {"class": p["id"], "name": p["name"], "type": "Personaggio", "subtype": None, "rarity": p.get("rarity"),
                "fullText": self.full_text(full, p["id"], generated), "flavour": p.get("flavour"),
                "resources": p["resources"], "items": p["items"], "immunities": p.get("immunities", []), "basic": p["basic"],
                "description": ts.breve_personaggio(p)}

    def classify(self, card):
        b, ctx = card["binding"], self.ctx
        if card.get("kind") == "ITEM" or (card.get("java") and "priority" not in card):
            return "Oggetto", NONE
        if card.get("basic") or b in ctx.basic:
            return "Azione", "Base"
        if card.get("kind") == "BOUND" or card.get("boundTo") or b in ctx.bound or (card.get("java") and self.ts.legato_java(b)):
            return "Azione", "Legata al personaggio"
        if card.get("lastResort") or b in ctx.ultime:
            return "Azione", "Ultima risorsa"
        return "Azione", "Regolare"

    def bound_owner(self, card):
        b = card["binding"]
        return card.get("boundTo") or (self.ts.legato_java(b) if card.get("java") else None) or self.ctx.bound.get(b)

    def character_of(self, entry):
        """SB-31 F4 (D196 (2), D198 (13)): the binding of the character a card is of, read from its slot (SPA-, MAR-, LR-TOS ...);
        None for a generic action, an item, the token, a generic last resort and any card of a set without slots. Descriptive: no rule reads it."""
        code = self.slot.get(entry["class"])
        if not code or entry["type"] == "Personaggio" or entry["subtype"] == "Token":
            return None
        prefix, _, rest = code.partition("-")
        owner = self.char_code.get(rest if prefix == "LR" else prefix)
        if entry["subtype"] == "Ultima risorsa" and not entry.get("exclusiveTo"):
            return None  # R01a: a last resort without a reservation is generic, whatever its slot (LR-ROC, «Non Mi Hai Fatto Niente»)
        expected = entry.get("owner") or entry.get("exclusiveTo")
        if expected is not None and owner != expected:
            raise ValueError(f"{entry['class']}: lo slot {code} dice il personaggio {owner}, la scheda {expected}")
        return owner

    def card_entry(self, s, card, full):
        ts, b, gui = self.ts, card["binding"], card["gui"]
        kind, subtype = self.classify(card)
        try:
            generated = ts.genera(card, self.names, self.ctx)
        except ValueError:
            if full is not None:
                raise
            generated = None  # a class the SB-25 generator does not know: the texts of its own file (expansion proof)
        if generated is None:
            short, gains, amount, complete = gui["description"], gui.get("gains", NONE), gui.get("damageAmount", NONE), [gui["description"]]
            source = "file"
        else:
            short, gains, amount = generated["description"], generated["gains"], generated["damageAmount"]
            complete = self.full_text(full, b, generated["completo"])
            source = "generatore"
            if full is not None:
                for field, value in (("description", short), ("gains", gains), ("damageAmount", amount)):
                    if gui.get(field) != value:
                        raise ValueError(f"{b}: gui.{field} della bozza non è quello del generatore di SB-25")
        entry = {"class": b, "name": gui["name"], "description": short, "type": kind, "subtype": subtype,
                 "role": gui["role"], "gains": gains, "damage": gui["damage"], "damageAmount": amount,
                 "rarity": card.get("rarity"), "fullText": complete, "flavour": gui.get("flavour"),
                 "cost": card.get("cost", {}), "priority": card.get("priority"), "textSource": source}
        if card.get("exclusiveTo"):
            entry["exclusiveTo"] = card["exclusiveTo"]
        if subtype == "Base":
            entry["owner"] = card.get("exclusiveTo") or self.ctx.basic.get(b)
        elif subtype == "Legata al personaggio":
            entry["owner"] = self.bound_owner(card)
        return entry

    def token_entry(self, voce):
        ts = self.ts
        if voce["breve"] != ts.breve_token() or voce["completo"] != ts.completo_token(self.ctx):
            raise ValueError("token: i testi del file non sono quelli del generatore di SB-25")
        whole = " ".join(voce["completo"])
        stale = [f for f in TOKEN_STATUS_SOURCE if f not in whole]
        if stale:
            raise ValueError("token: il testo dello stato (TOKEN_STATUS_TEXT) non deriva più dal testo completo: manca «" + stale[0] + "»")
        return {"class": ts.TOKEN_BINDING, "name": ts.TOKEN_NOME, "description": voce["breve"], "type": "Oggetto",
                "subtype": "Token", **TOKEN_ROLE, "rarity": None, "fullText": voce["completo"], "flavour": None,
                "statusText": TOKEN_STATUS_TEXT, "cost": {}, "priority": None, "textSource": "generatore"}

    # ------------------------------------------------------------------------------------------------------- grouping
    def group_of(self, entry):
        """(group key, position): a character, the generic actions, the items or the token (S3)."""
        code = self.slot.get(entry["class"])
        if entry["subtype"] == "Token":
            return "token", (0, 0)
        if code:
            prefix, _, rest = code.partition("-")
            kind = re.match(r"[A-Z]+", rest).group(0) if re.match(r"[A-Z]+", rest) else ""
            number = int(re.sub(r"\D", "", rest) or 0)
            if prefix == "LR":
                if rest in self.char_code:
                    return self.char_code[rest], (GROUP_ORDER["LR"], 0)
                return "generiche", (1, 0)
            if prefix in self.char_code:
                return self.char_code[prefix], (GROUP_ORDER.get(kind, 3), number)
            if prefix == "OGG":
                return "oggetti", (0, number)
            return "generiche", (0, number)
        owner = entry.get("owner") or entry.get("exclusiveTo")
        if owner:
            return owner, ({"Base": 0, "Legata al personaggio": 1, "Ultima risorsa": 2}.get(entry["subtype"], 3), 0)
        return ("oggetti" if entry["type"] == "Oggetto" else "generiche"), (0, 0)

    def groups(self, set_id):
        """Ordered [(group key, [entry])] of the cards of a set: characters in file order, then generic, items, token."""
        found = {}
        for position, binding in enumerate(self.order[set_id]):
            entry = self.entries[binding]
            if entry["type"] == "Personaggio":
                continue
            key, rank = self.group_of(entry)
            found.setdefault(key, []).append((rank, position, entry))
        keys = [p for p in self.characters if p in found] + [k for k in found if k not in self.characters and k not in
                                                              ("generiche", "oggetti", "token")]
        keys += [k for k in ("generiche", "oggetti", "token") if k in found]
        return [(k, [e for _, _, e in sorted(found[k], key=lambda t: (t[0], t[1]))]) for k in keys]


# ---------------------------------------------------------------------------------------------------------- documents
def type_label(entry):
    if entry["type"] == "Personaggio":
        return "Personaggio"
    if entry["subtype"] in (None, NONE):
        return entry["type"]
    return f"{entry['type']}, {entry['subtype']}"


def heading(entry):
    fields = [type_label(entry), entry.get("rarity") or NONE]
    if entry["type"] != "Personaggio":
        fields += ["Costo " + cost_text(entry["cost"]), "Priorità " + priority_text(entry["priority"])]
    return f"#### {entry['name']} — " + " · ".join(fields)


def sheet(cat, entry):
    code = cat.slot.get(entry["class"])
    if " — " in entry["name"] or " · " in entry["name"]:
        raise ValueError(f"{entry['class']}: il nome contiene un separatore dell'intestazione della scheda")
    lines = [heading(entry), "", f"`{entry['class']}`" + (f" · slot {code}" if code else ""), ""]
    for paragraph in entry["fullText"]:
        if re.match(r"\s*(\d+[.)]\s|[-*+>#|]|`)", paragraph):
            raise ValueError(f"{entry['class']}: un paragrafo del testo completo sarebbe letto come markdown")
        lines += [render(paragraph), ""]
    return lines


def group_title(cat, key):
    if key in cat.characters:
        return cat.characters[key]["name"]
    return {"generiche": "Azioni generiche", "oggetti": "Oggetti", "token": "Token"}[key]


def count_phrase(n, one, many):
    return f"{n} {one if n == 1 else many}"


def set_document(cat, s):
    data, sid = s.data, s.id
    version = cat.versions.get(sid, data["set"]["version"])
    candidate = sid in cat.versions
    entries = [cat.entries[b] for b in cat.order[sid]]
    chars = [e for e in entries if e["type"] == "Personaggio"]
    cards = [e for e in entries if e["type"] != "Personaggio" and e["subtype"] != "Token"]
    tokens = [e for e in entries if e["subtype"] == "Token"]
    actions = [e for e in cards if e["type"] == "Azione"]
    items = [e for e in cards if e["type"] == "Oggetto"]
    rarities = {}
    for e in chars + cards:
        rarities[e.get("rarity") or NONE] = rarities.get(e.get("rarity") or NONE, 0) + 1
    out = [f"# Botte Micidiali — {data['set']['name']}", ""]
    state = LIVE_DATE if cat.live else "candidata" if candidate else "di prova"
    out.append(f"Versione **{version} — {state}**. Documento del set `{sid}`, con le schede normative delle sue carte "
               "(regolamento, R00 e R07)." + (f" Richiede il regolamento {LIVE_RULES}." if cat.live else ""))
    out.append("")
    if cat.live:
        intro = (f"Questo documento è generato da `{GENERATOR} --vivo` dal file del set `{s.path}`, che lo stesso comando "
                 f"ricava dalla bozza `{DEFAULT_SET}` (versione {data['set']['version']} del file) togliendo i mazzi di prova: "
                 "non si modifica a mano, si cambia la bozza e si rigenera (decisioni D175 e D183 del piano Set Base; il "
                 "formato del file è descritto in `docs/formato-file-set.md`). ")
    else:
        intro = (f"Questo documento è generato da `{GENERATOR}` dal file del set `{s.path}` (versione {data['set']['version']} "
                 "del file): non si modifica a mano, si cambia il file del set e si rigenera (decisione D175 del piano Set Base). "
                 + ("Resta candidato fino al trasferimento nella partita viva (SB-28); fino ad allora vale il documento del set "
                    "in `docs/sets/`. " if candidate else ""))
    out.append(intro
               + "Il regolamento governa il sistema, le schede governano le carte: una scheda deroga a una regola solo se lo dice "
               "esplicitamente. La scheda normativa di ogni carta è il suo **testo completo**; il testo breve stampato sulla "
               "carta è nell'allegato ed è descrittivo: in caso di dubbio prevale la scheda. Ruoli, guadagni e danno nominale "
               "sono descrittivi (R07a).")
    out.append("")
    out.append("Nelle schede H, A, V, T e L sono le risorse (HEALTH, ALERTNESS, VIOLENCE, TOXICITY, ALCOHOL) e HIT, CUT e "
               "POISON i tipi di danno; sulle carte stampate e nel client sono simboli. Ogni scheda indica in testa nome, "
               "tipologia e sottotipo, rarità, costo e priorità, poi l'identificatore stabile della classe e, se c'è, lo slot "
               "della carta stampata.")
    out.append("")
    # S1
    out += ["## S1 — Contenuto e starter", ""]
    parts = [count_phrase(len(chars), "personaggio", "personaggio"), count_phrase(len(actions), "azione", "azione"),
             count_phrase(len(items), "oggetto", "oggetto")]
    token_phrase = ""
    if tokens:
        token_phrase = ", oltre a " + ("un token oggetto generato durante il gioco, " if len(tokens) == 1 else
                                       f"{len(tokens)} token oggetto generati durante il gioco, ") + \
            ", ".join(f"«{t['name']}»" for t in tokens)
    out.append(f"Il set comprende **{len(chars) + len(cards)} carte: {parts[0]}, {parts[1]} e {parts[2]}**{token_phrase}. "
               "Le carte personaggio appartengono al set a tutti gli effetti; hanno una scheda propria e vengono predisposte "
               "alla preparazione secondo R01a.")
    out.append("")
    labels = {"COMMON": "COMMON", "UNCOMMON": "UNCOMMON", "RARE": "RARE", "PROTAGONIST": "PROTAGONIST", NONE: "senza rarità"}
    rarity_order = ["COMMON", "UNCOMMON", "RARE", "PROTAGONIST", NONE]
    out.append("Rarità (R07): " + ", ".join(f"{rarities[r]} {labels[r]}" for r in rarity_order if r in rarities) + ".")
    out.append("")
    if data.get("requires"):
        out.append("Il set richiede " + ", ".join(f"il set `{r['set']}`" for r in data["requires"]) + ": le sue carte possono "
                   "comparire in mazzi con quelle dei set richiesti, e le carte legate di questo set si aggiungono a quelle "
                   "che il personaggio ha già.")
        out.append("")
    starters = [d for d in data.get("decks", []) if d["id"].startswith("starter-")]
    others = [d for d in data.get("decks", []) if not d["id"].startswith("starter-")]
    if starters:
        out.append(f"Ogni starter è conforme a R02: {data.get('rules', {}).get('deckSize', 20)} carte regolari, oltre alla base, "
                   "alle due legate scelte e all'ultima risorsa. Le composizioni sono qui e nell'allegato.")
        out.append("")
        named = all(d.get("name") for d in starters)
        if named:
            # SB-28 (D182): name and category of every starter; the quick deals one of them at random.
            by_category = {c: [d["name"] for d in starters if d["category"] == c] for c in ("base", "avanzato")}
            out.append("Ogni starter ha un nome e una categoria (D182): **base** " + " e ".join(by_category["base"])
                       + "; **avanzati** " + ", ".join(by_category["avanzato"][:-1]) + " e " + by_category["avanzato"][-1]
                       + f". Nella quick si sceglie la categoria e lo starter esce a caso al suo interno (R01).")
            out.append("")
            out += ["| Starter | Nome | Categoria | Personaggio | Base | Legate | Ultima risorsa |", "|---|---|---|---|---|---|---|"]
        else:
            out += ["| Starter | Personaggio | Base | Legate | Ultima risorsa |", "|---|---|---|---|---|"]
        for d in starters:
            pg = cat.characters[d["character"]]
            cells = f"{d['name']} | {d['category']} | " if named else ""
            out.append(f"| `{d['id']}` | {cells}{pg['name']} | {cat.names[pg['basic']]} | "
                       + " e ".join(cat.names[b] for b in d["bound"]) + f" | {cat.names[d['lastResort']]} |")
        out.append("")
        for d in starters:
            out += deck_table(cat, d)
        if others:
            out.append(f"Il file del set contiene anche {count_phrase(len(others), 'mazzo', 'mazzi')} di prova del bilanciamento "
                       "(" + ", ".join(f"`{d['id']}`" for d in others) + "), che non fanno parte del set.")
            out.append("")
    elif others:
        out.append("Il set non ha starter. I mazzi del file, che possono mescolare carte di più set, sono:")
        out.append("")
        for d in others:
            pg = cat.characters[d["character"]]
            out.append(f"- `{d['id']}`, di {pg['name']}: base {cat.names[pg['basic']]}, legate "
                       + " e ".join(cat.names[b] for b in d["bound"]) + f", ultima risorsa {cat.names[d['lastResort']]}.")
        out.append("")
        for d in others:
            out += deck_table(cat, d)
    # S2
    out += ["## S2 — Carte personaggio", ""]
    if chars:
        out += ["| Personaggio | H | A | V | T | L | Capacità oggetti | Immunità iniziale | Base |",
                "|---|---:|---:|---:|---:|---:|---:|---|---|"]
        for e in chars:
            r = e["resources"]
            imm = ", ".join(e["immunities"]) or "Nessuna"
            out.append(f"| {e['name']} | " + " | ".join(str(r.get(k, 0)) for k in RESOURCES)
                       + f" | {e['items']} | {imm} | {cat.names[e['basic']]} |")
        out.append("")
        for e in chars:
            out += sheet(cat, e)
    else:
        out += ["Il set non ha carte personaggio.", ""]
    # S3
    out += ["## S3 — Schede delle carte", ""]
    out.append("Una scheda per carta, raggruppate per personaggio (base, legate, ultima risorsa, poi le altre carte del "
               "personaggio); dopo, le azioni generiche, gli oggetti e i token.")
    out.append("")
    for key, group in cat.groups(sid):
        title = group_title(cat, key)
        if key in cat.characters and cat.entries[key]["set"] != sid:
            title += f" (personaggio del set `{cat.entries[key]['set']}`)"
        out += [f"### {title}", ""]
        for e in group:
            out += sheet(cat, e)
    # S4
    out += ["## S4 — Ruoli, guadagni e danno nominale", ""]
    out.append("Campi descrittivi definiti in R07a, generati dagli stessi dati delle schede; in caso di dubbio prevale la scheda. "
               "x indica una quantità variabile.")
    out.append("")
    out += ["| Carta | Identificatore | Ruolo | Guadagni a sé | Danno nominale | Importo nominale |",
            "|---|---|---|---|---|---|"]
    for e in r07a_entries(cat, sid):
        if e["type"] == "Personaggio":
            out.append(f"| {e['name']} | `{e['class']}` | {NONE} | {NONE} | {NONE} | {NONE} |")
        else:
            out.append(f"| {e['name']} | `{e['class']}` | {e['role']} | {e['gains']} | {e['damage']} | {e['damageAmount']} |")
    out.append("")
    # Revisions
    out += ["## Revisioni", ""]
    inputs = [f"`{s.path}` (SHA-256 `{sha256(s.raw)}`)"]
    if s.texts_raw:
        inputs.append(f"i testi completi di SB-25 `{s.texts_path}` (SHA-256 `{sha256(s.texts_raw)}`)")
    if s.slot_raw:
        inputs.append(f"gli slot `{s.slot_path}` (SHA-256 `{sha256(s.slot_raw)}`)")
    from_file = [e["class"] for e in entries if e.get("textSource") == "file"]
    note = ""
    if from_file:
        note = (" Il generatore dei testi di SB-25 non conosce " + ", ".join(f"`{b}`" for b in from_file)
                + ": per queste carte testo breve, guadagni, danno nominale e scheda sono il testo del file.")
    if cat.live:
        out.append(f"- **1.0.1 — {LIVE_DATE}, SB-29 (D190):** cambia solo la frase di S1 sulla quick: si sceglie la categoria, base o avanzato, e lo "
                   f"starter esce a caso al suo interno (R01, regolamento {LIVE_RULES}). Nessuna carta cambia. **Richiede il regolamento {LIVE_RULES}.**")
        out.append("")
        out.append(f"- **1.0 — 23 novembre 2026, SB-28:** il Set Base entra nella partita viva e sostituisce la 0.1, archiviata in "
                   f"`docs/history/set-base-0.1.md`. **Richiedeva il regolamento 2.0**, che porta nel sistema le regole "
                   "del playground con cui il set è stato bilanciato (D50, D78, D183). Generata dal file del set " + inputs[0]
                   + f", ricavato dalla bozza `{DEFAULT_SET}` (SHA-256 `{sha256(s.source_raw)}`), con " + " e ".join(inputs[1:])
                   + ". Schede = testi completi approvati in D174, coi rimandi al regolamento (D183); testo breve, guadagni e "
                   "danno nominale dal generatore di SB-25; starter con nome e categoria (D182). Al passaggio i mazzi "
                   "personalizzati salvati che contengono carte dello 0.1 uscite dal set si cancellano (D182 (3))." + note)
    elif candidate:
        out.append(f"- **{version} candidata — SB-26:** generata dal file del set {inputs[0]}, con "
                   + " e ".join(inputs[1:]) + ". Schede = testi completi approvati in D174; testo breve, guadagni e danno "
                   "nominale dal generatore di SB-25. Sostituirà la 0.1 nella partita viva con SB-28 (D175)." + note)
    else:
        out.append(f"- **{version} — SB-26, prova del formato:** generata dal file del set {inputs[0]}"
                   + (", con " + " e ".join(inputs[1:]) if inputs[1:] else "")
                   + ". Testo breve, guadagni, danno nominale e testo completo dal generatore di SB-25." + note)
    return "\n".join(out).rstrip("\n") + "\n"


def deck_table(cat, d):
    pg = cat.characters[d["character"]]
    rows = [f"**`{d['id']}`**, {pg['name']}: {sum(d['cards'].values())} carte regolari.", "",
            "| Carta | Set | Identificatore | Copie |", "|---|---|---|---:|"]
    for b, n in sorted(d["cards"].items(), key=lambda kv: (cat.entries[kv[0]]["set"], kv[0])):
        rows.append(f"| {cat.names[b]} | {cat.entries[b]['set']} | `{b}` | {n} |")
    return rows + [""]


def r07a_entries(cat, sid):
    chars = [cat.entries[b] for b in cat.order[sid] if cat.entries[b]["type"] == "Personaggio"]
    return chars + [e for _, group in cat.groups(sid) for e in group]


# -------------------------------------------------------------------------------------------------------- annex, SQLite
ANNEX_CARD_KEYS = ("class", "name", "description", "type", "subtype", "role", "gains", "damage", "damageAmount")


def annex(cat, s):
    sid = s.id
    entries = [cat.entries[b] for b in cat.order[sid]]
    cards, chars, tokens = [], [], []
    for e in sorted(entries, key=lambda e: e["class"]):
        if e["type"] == "Personaggio":
            item = {"class": e["class"], "name": e["name"], "type": "Personaggio"}
            if e.get("rarity"):
                item["rarity"] = e["rarity"]
            chars.append({**item, "fullText": e["fullText"], "flavour": e["flavour"]})
            continue
        item = {k: e[k] for k in ANNEX_CARD_KEYS}
        if e.get("exclusiveTo"):
            item["exclusiveTo"] = e["exclusiveTo"]
        if e.get("rarity"):
            item["rarity"] = e["rarity"]
        if cat.character_of(e):
            item["character"] = cat.character_of(e)
        item["fullText"], item["flavour"] = e["fullText"], e["flavour"]
        if e.get("statusText"):
            item["statusText"] = e["statusText"]
        (tokens if e["subtype"] == "Token" else cards).append(item)
    starters = [d for d in s.data.get("decks", []) if d["id"].startswith("starter-")]
    rows = sorted([d["character"], b, n] for d in starters for b, n in d["cards"].items())
    initial = sorted([d["character"], cat.characters[d["character"]]["basic"], *d["bound"], d["lastResort"]] for d in starters)
    data = {"set": sid, "version": cat.versions.get(sid, s.data["set"]["version"]), "cards": cards, "starters": rows,
            "initialCards": initial, "characters": chars, "tokens": tokens}
    return json.dumps(data, ensure_ascii=False, indent=2) + "\n"


def joined(full):
    return "\n".join(full)


def sqlite_bytes(cat, annexes):
    """The SQLite catalog of every set, built in a fixed order and vacuumed: the same input gives the same bytes with the
    same SQLite library."""
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / SQLITE
        db = sqlite3.connect(path)
        try:
            db.execute("pragma page_size=4096")
            db.execute("pragma journal_mode=delete")
            for ddl in SCHEMA:
                db.execute(ddl)
            db.executemany("insert into CRD002_KEYWORDS values (?,?)", KEYWORDS)
            for sid, a in annexes:
                for c in a["cards"]:
                    db.execute("insert into CRD001_GUI values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                               (c["class"], c["name"], c["description"], None, None, c["role"], c["gains"], c["damage"],
                                c["damageAmount"], c.get("exclusiveTo"), sid, c.get("rarity"), joined(c["fullText"]),
                                c["flavour"]))
                for p in a["characters"]:
                    db.execute("insert into CRD003_CHARACTERS values (?,?,?,?,?,?)",
                               (p["class"], p["name"], None, sid, joined(p["fullText"]), p["flavour"]))
                db.executemany("insert into DCK001_STARTERS values (?,?,?)", a["starters"])
                db.executemany("insert into DCK002_STARTERS_CH values (?,?,?,?,?)", a["initialCards"])
            db.commit()
            db.execute("vacuum")
        finally:
            db.close()
        return path.read_bytes()


def sqlite_dump(data):
    """The content of a SQLite file as text (schema and rows), independent of the library that wrote it."""
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / SQLITE
        path.write_bytes(data)
        db = sqlite3.connect(path)
        try:
            return "\n".join(db.iterdump()) + "\n"
        finally:
            db.close()


# ------------------------------------------------------------------------------------------------------------ outputs
DECKS_OPEN = '  "decks": [\n'
DECKS_CLOSE = "\n  ]\n}\n"
DECK_BETWEEN = "\n    },\n    {\n"


def split_set_file(raw):
    """SB-28: (live set file, test decks file) from the bytes of the draft. The live file is the draft with only its starters
    (the decks with a category, D182); the test decks go to a file of decks only, which the loader composes with the live
    file. Both keep the draft's text, deck by deck, so a reader finds the same lines."""
    text = raw.decode("utf-8")
    data = json.loads(text)
    head, sep, tail = text.partition(DECKS_OPEN)
    if not sep or not tail.endswith(DECKS_CLOSE) or not tail.startswith("    {\n"):
        raise ValueError(f"{DEFAULT_SET}: la sezione decks non ha la forma attesa (un mazzo per blocco, in fondo al file)")
    parts = tail[:-len(DECKS_CLOSE)].split(DECK_BETWEEN)
    blocks = [("" if i == 0 else "    {\n") + b + ("" if i == len(parts) - 1 else "\n    }") for i, b in enumerate(parts)]
    if [json.loads(b)["id"] for b in blocks] != [d["id"] for d in data["decks"]]:
        raise ValueError(f"{DEFAULT_SET}: i blocchi dei mazzi non corrispondono ai mazzi del file")
    starters = [b for b, d in zip(blocks, data["decks"]) if d.get("category")]
    tests = [b for b, d in zip(blocks, data["decks"]) if not d.get("category")]
    if not starters:
        raise ValueError(f"{DEFAULT_SET}: nessuno starter con nome e categoria")
    live = head + DECKS_OPEN + ",\n".join(starters) + DECKS_CLOSE
    decks = '{\n  "format": "' + data["format"] + '",\n' + DECKS_OPEN + ",\n".join(tests) + DECKS_CLOSE
    expected = dict(data, decks=[d for d in data["decks"] if d.get("category")])
    if json.loads(live) != expected or json.loads(decks)["decks"] != [d for d in data["decks"] if not d.get("category")]:
        raise ValueError(f"{DEFAULT_SET}: la divisione fra file vivo e mazzi di prova non conserva i dati")
    return live.encode("utf-8"), decks.encode("utf-8")


def generate(root, specs, versions, args_list, live=False):
    """{relative output path: bytes} for the given sets ([(set file, texts file, slot file)]). SB-28, live: the main set is
    read from the live set file derived from the draft, and the live set file and the test decks are outputs too."""
    if live:
        source = SetInput(root, *specs[0])
        live_file, test_decks = split_set_file(source.raw)
        main = SetInput(root, LIVE_SET_FILE, specs[0][1], specs[0][2], raw=live_file)
        main.source_raw = source.raw
        sets = [main] + [SetInput(root, *spec) for spec in specs[1:]]
    else:
        sets = [SetInput(root, *spec) for spec in specs]
    cat = Catalog(root, sets, versions, live)
    files, annexes = {}, []
    for s in sets:
        doc = set_document(cat, s).encode("utf-8")
        files[f"sets/{s.id}.md"] = doc
        files[f"client-debug/sets/{s.id}.md"] = doc
        text = annex(cat, s)
        files[f"sets/{s.id}.json"] = text.encode("utf-8")
        annexes.append((s.id, json.loads(text)))
    db = sqlite_bytes(cat, annexes)
    files[SQLITE] = db
    inputs = []
    if live:
        files["set-file"], files["test-decks"] = live_file, test_decks
    for s in sets:
        inputs.append({"file": specs[0][0] if live and s is sets[0] else s.path, "sha256": sha256(s.source_raw)})
        if s.texts_raw:
            inputs.append({"file": s.texts_path, "sha256": sha256(s.texts_raw)})
        if s.slot_raw:
            inputs.append({"file": s.slot_path, "sha256": sha256(s.slot_raw)})
    manifest = {
        "nota": ("SB-28: catalogo vivo del Set Base, generato da " + GENERATOR + " --vivo; " if live else "SB-26 (D175): file generati da "
                 + GENERATOR + "; ") + "non si modificano a mano. L'impronta di cards.sqlite è "
                "quella del contenuto (schema e righe, iterdump), che non dipende dalla libreria SQLite.",
        "argomenti": args_list,
        "set": [s.id for s in sets],
        "ingressi": inputs,
        "uscite": [{"file": LIVE_PATHS[name] if live else name, "sha256": sha256(data)} for name, data in sorted(files.items())
                   if name != SQLITE]
                  + [{"file": LIVE_PATHS[SQLITE] if live else SQLITE, "contenuto_sha256": sha256(sqlite_dump(db).encode("utf-8"))}],
    }
    files[MANIFEST] = (json.dumps(manifest, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
    return files, cat, sets


def parse_args(argv):
    cli = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    cli.add_argument("--set", default=DEFAULT_SET, help="il file del set principale (bozza)")
    cli.add_argument("--testi", default=DEFAULT_TEXTS, help="i testi completi di SB-25 del set principale")
    cli.add_argument("--slot", default=DEFAULT_SLOT, help="gli slot del set principale")
    cli.add_argument("--extra", action="append", default=[], help="un altro file di set (espansione), anche più volte")
    cli.add_argument("--versione", action="append", default=[], metavar="SET=VER",
                     help="versione del documento candidato di un set (predefinita: base=1.0); gli altri set usano quella del file")
    cli.add_argument("--out", default=DEFAULT_OUT, help="cartella di uscita, relativa alla radice (obbligatoria senza --vivo)")
    cli.add_argument("--root", default=None, help="radice del repository (predefinita: questa copia)")
    cli.add_argument("--check", action="store_true", help="rigenera in memoria e confronta con la cartella, senza scrivere")
    cli.add_argument("--vivo", action="store_true", help="SB-28: il catalogo vivo, ogni file al suo posto (LIVE_PATHS)")
    return cli.parse_args(argv)


def generation_args(args):
    """The arguments that decide the output, as the manifest records them (paths relative to the root, '/' separators)."""
    out = (["--vivo"] if args.vivo else []) + ["--set", args.set, "--testi", args.testi, "--slot", args.slot]
    for extra in args.extra:
        out += ["--extra", extra]
    for v in args.versione:
        out += ["--versione", v]
    return [a.replace("\\", "/") for a in out]


def run(argv, root=None):
    """((files, catalog, sets), args, root) for a command line; check-rules.py calls it with the arguments of the manifest."""
    args = parse_args(argv)
    root = Path(args.root).resolve() if args.root else (root or ROOT)
    versions = dict(DEFAULT_VERSIONS)
    for v in args.versione:
        key, _, value = v.partition("=")
        versions[key] = value
    args.set, args.testi, args.slot = (p.replace("\\", "/") for p in (args.set, args.testi, args.slot))
    args.extra = [p.replace("\\", "/") for p in args.extra]
    specs = [(args.set, args.testi or None, args.slot or None)] + [(e, None, None) for e in args.extra]
    if args.vivo and (args.extra or args.out != DEFAULT_OUT):
        raise ValueError("--vivo scrive il solo Set Base nei posti vivi: niente --extra né --out")
    if not args.vivo and not args.out:
        raise ValueError("serve --vivo (il catalogo vivo) oppure --out CARTELLA (un catalogo di prova, per esempio con un'espansione)")
    return generate(root, specs, versions, generation_args(args), live=args.vivo), args, root


def main(argv=None):
    try:
        (files, _, _), args, root = run(sys.argv[1:] if argv is None else argv)
    except (OSError, ValueError, KeyError) as error:
        print(f"set_catalog: {error}", file=sys.stderr)
        return 1
    if args.vivo:
        return write_live(root, files, args.check)
    out = root / args.out
    if args.check:
        differ = [name for name, data in sorted(files.items()) if not (out / name).exists() or
                  ((out / name).read_bytes() != data if name != SQLITE else sqlite_dump((out / name).read_bytes()) != sqlite_dump(data))]
        extra = sorted(p.relative_to(out).as_posix() for p in out.rglob("*") if p.is_file()
                       and p.relative_to(out).as_posix() not in files) if out.exists() else []
        if differ or extra:
            print("Diversi dalla generazione: " + ", ".join(differ + [x + " (in più)" for x in extra]), file=sys.stderr)
            return 1
        print(f"{len(files)} file in {args.out} identici alla generazione.")
        return 0
    for name, data in sorted(files.items()):
        path = out / name
        path.parent.mkdir(parents=True, exist_ok=True)
        if not path.exists() or path.read_bytes() != data:
            path.write_bytes(data)
    stale = sorted(p for p in out.rglob("*") if p.is_file() and p.relative_to(out).as_posix() not in files)
    for p in stale:
        p.unlink()
    print(f"{len(files)} file generati in {args.out}" + (f"; tolti {len(stale)} file non più generati" if stale else "") + ".")
    return 0


def write_live(root, files, check):
    """SB-28: the live catalog, every file in its live place; --check compares without writing (SQLite by content)."""
    differ = []
    for name, data in sorted(files.items()):
        path = root / LIVE_PATHS[name]
        same = path.exists() and (sqlite_dump(path.read_bytes()) == sqlite_dump(data) if name == SQLITE else path.read_bytes() == data)
        if check:
            if not same:
                differ.append(LIVE_PATHS[name])
        elif not same:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
    if differ:
        print("Diversi dalla generazione: " + ", ".join(differ), file=sys.stderr)
        return 1
    print(f"{len(files)} file del catalogo vivo " + ("identici alla generazione." if check else "generati."))
    return 0


if __name__ == "__main__":
    sys.exit(main())
