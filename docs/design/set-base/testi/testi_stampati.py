"""I testi della bozza generati dai dati (SB-20c, D142; SB-25, D168–D170).

Per ogni carta: il testo breve per i giocatori (`gui.description`, senza codice di slot), i due campi nominali (`gui.gains`,
`gui.damageAmount`, formato invariato per D168 (4)), nome e descrizione degli stati che la carta dà (D169 (4)) e il testo completo
(l'«oracle text» di D170). Per personaggi e token: testo breve e testo completo. Ogni numero viene dai dati; qui ci sono solo le
parole, quelle del glossario approvato (docs/design/set-base/sb-25/glossario.json, D170 (1)).

Il codice dello slot non sta più nel testo: lo dà `slot.json`, tenuto a mano (D169 (5)).
"""
import json
import math
from pathlib import Path
import re


QUI = Path(__file__).resolve().parent
ROOT = QUI.parents[3]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
SLOT_JSON = QUI / "slot.json"
COMPLETI_JSON = QUI / "testi-completi.json"
JAVA_SRC = ROOT / "server/src/main/java/com/gsc/bm/model/cards"
LETTERE = dict(zip(("HEALTH", "ALERTNESS", "VIOLENCE", "TOXICITY", "ALCOHOL"), "HAVTL"))
ORDINE_RISORSE = tuple(LETTERE)
DANNI = ("HIT", "CUT", "POISON")
FORMA_SLOT = re.compile(r"^(?:[A-Z]{2,3}-[A-Z0-9]+|TOKEN)$")
# D168 (1): i tipi di danno sono segnaposto col nome del tipo nei dati, accanto alle risorse.
TOKEN_SCONOSCIUTO = re.compile(r"\[\[(?!(?:[HAVTL]|HIT|CUT|POISON)\]\])")
CAMPI_STAMPATI = ("description", "gains", "damageAmount")
TIPI_STATO = ("GOOD", "BAD")
ORDINALI = {2: "secondo", 3: "terzo", 4: "quarto", 5: "quinto", 6: "sesto", 7: "settimo", 8: "ottavo", 9: "nono", 10: "decimo"}

SCHEMI_OP = {
    "anticipo": ("steps", ""),
    "consume": ("", ""),
    "damage": ("type amount", "applying"),
    "empty": ("resource", ""),
    "gain": ("resource amount", ""),
    "gettone": ("steps", ""),
    "lose": ("resource amount", ""),
    "say": ("text", ""),
    "search": ("foundGains missedGains", "card cards vulnerability"),
    "status": ("name description statusType flow property factor", "turns equip singleUse convertTo"),
    "vendi": ("seHai", ""),
}

# I parametri vengono passati alle classi come interi. I binding senza parametri hanno una mappa vuota. Le frasi delle classi sono
# in breve_java e completo_java.
PARAMETRI_JAVA = {
    "bruiser.YouStop": "alertnessToTarget",
    "com.Steal": "",
    "junkie.AmphetamineReflexes": "",
    "junkie.ToxicBloodDrain": "turns poison",
    "com.items.MarvelousCocktail": "alcohol toxicity turns poison",
    "base.pino.UltimoGiro": "base selfHit perPlay perPlaySelf",
    "base.pino.GoingBerserk": "base selfHit",
    "base.pino.RuttoADistanzaSociale": "base perAlcohol",
    "com.items.AnotherRottenBeer": "alcohol",
    "bruiser.BreakYourToy": "",
    "base.gigi.LavoroFattoBene": "base perItem",
    "base.cesira.Ricatto": "percent",
    "base.cesira.LoSapevo": "",
    "base.com.ShuffleFeet": "",
    "base.items.SantinoDellaPortinaia": "turns",
    "base.com.BeggingMoney": "alertnessFromTarget",
    "bruiser.BadEducation": "hitDamage",
    "base.cesira.bound.NeRiparliamoFuori": "",
    "base.rocco.bound.MiRialzo": "heal healthAtLeast healthAtMost",  # SB-21z (D161 (3)): healthAtLeast 1 (vivo) non si stampa
}
JAVA = PARAMETRI_JAVA  # i binding Java ammessi

# Il token non è nella bozza: i suoi dati sono quelli della classe Java, controllati da verifica_token sul sorgente.
TOKEN_BINDING = "com.tokens.BrokenBeerBottle"
TOKEN_NOME = "Bottiglia Spaccata"
TOKEN_STATO = {"op": "status", "statusType": "GOOD", "flow": "OUTPUT", "property": "HIT", "factor": 1.5,
               "equip": True, "singleUse": True, "convertTo": "CUT"}
TOKEN_SORGENTE = JAVA_SRC / "com/tokens/BrokenBeerBottle.java"
TOKEN_CREATO_DA = "com.items.AnotherRottenBeer"

# Dove il giocatore trova la regola intera (D170 (2)). Le parole chiave del playground entrano nel regolamento a SB-28: allora
# cambiano solo queste righe.
RIMANDI = {
    "tipi": "regolamento, R01a",
    "costo": "regolamento, R04",
    "stati": "regolamento, R05",
    "equip": "regolamento, R01a e R05",
    "immune": "regolamento, R01 e R06",
    "risorse": "regolamento, R01",
    "oggetti": "regolamento, R02",
    "annulla": "regolamento, R04",
    "corazza": "regole del playground, RP-6",
    "pavimento": "regole del playground, RP-4",
    "a terra": "regole del playground, RP-1",
    "annuncia": "regole del playground, RP-13–RP-24",
    "vulnerabile": "regole del playground, RP-14–RP-21",
    "anticipo": "regole del playground, sezione 4",
    "rincara": "regole del playground, sezione 4",
    "vendi": "regole del playground, RP-25",
    "in campo": "regole del playground, RP-27",
    "scarto": "regole del playground, RP-11",
}


def rimando(chiave):
    return f"({RIMANDI[chiave]})"


# ------------------------------------------------------------------------------------------------------------ schema
def campi(dati, sede, obbligatori, facoltativi=""):
    if not isinstance(dati, dict):
        raise ValueError(f"{sede}: deve essere un oggetto")
    richiesti = set(obbligatori.split())
    ignoti = dati.keys() - richiesti - set(facoltativi.split())
    mancanti = richiesti - dati.keys()
    if ignoti:
        raise ValueError(f"{sede}: campi sconosciuti {', '.join(sorted(ignoti))}")
    if mancanti:
        raise ValueError(f"{sede}: campi mancanti {', '.join(sorted(mancanti))}")


def intero(valore, sede, minimo=0):
    if type(valore) is not int or valore < minimo:
        raise ValueError(f"{sede}: atteso un intero ≥ {minimo}, trovato {valore!r}")


def scelta(valore, ammessi, sede):
    if valore not in tuple(ammessi):
        raise ValueError(f"{sede}: valore sconosciuto {valore!r}")


def testo(valore, sede):
    if not isinstance(valore, str) or not valore.strip():
        raise ValueError(f"{sede}: atteso un testo non vuoto")


def risorse(mappa, sede):
    campi(mappa, sede, "", " ".join(LETTERE))
    for risorsa, valore in mappa.items():
        intero(valore, f"{sede}.{risorsa}")


def fattore(valore, sede):
    if type(valore) not in (float, int) or not math.isfinite(valore) or valore <= 0:
        raise ValueError(f"{sede}: atteso un fattore positivo")


def enum_lista(valori, ammessi, sede):
    if not isinstance(valori, list):
        raise ValueError(f"{sede}: attesa una lista")
    for valore in valori:
        scelta(valore, ammessi, sede)


def verifica_importo(valore, sede, rincara):
    if type(valore) is int:
        intero(valore, sede)
        return
    facoltativi = "of divide perPlay" if rincara else "of divide"
    campi(valore, sede, "base", facoltativi)
    intero(valore["base"], f"{sede}.base")
    if "of" in valore:
        scelta(valore["of"], LETTERE, f"{sede}.of")
    if "divide" in valore:
        if "of" not in valore:
            raise ValueError(f"{sede}.divide: richiede of")
        intero(valore["divide"], f"{sede}.divide", 1)
    if "perPlay" in valore:
        intero(valore["perPlay"], f"{sede}.perPlay")


def verifica_stato(passo, sede):
    for campo in ("name", "description"):
        testo(passo[campo], f"{sede}.{campo}")
    scelta(passo["statusType"], TIPI_STATO, f"{sede}.statusType")
    scelta(passo["flow"], ("INPUT", "OUTPUT"), f"{sede}.flow")
    scelta(passo["property"], DANNI, f"{sede}.property")
    fattore(passo["factor"], f"{sede}.factor")
    for campo in ("equip", "singleUse"):
        if campo in passo and type(passo[campo]) is not bool:
            raise ValueError(f"{sede}.{campo}: atteso un booleano")
    if "turns" in passo:
        intero(passo["turns"], f"{sede}.turns")
    elif not passo.get("singleUse"):
        raise ValueError(f"{sede}: serve turns oppure singleUse")
    if (passo.get("singleUse") or "convertTo" in passo) and not passo.get("equip"):
        raise ValueError(f"{sede}: singleUse e convertTo valgono per gli equip")
    if "convertTo" in passo:
        scelta(passo["convertTo"], set(DANNI) - {passo["property"]}, f"{sede}.convertTo")


def verifica_ricerca(passo, sede, nomi):
    if ("card" in passo) == ("cards" in passo):
        raise ValueError(f"{sede}: serve uno solo fra card e cards")
    cercate = passo["cards"] if "cards" in passo else [passo["card"]]
    enum_lista(cercate, nomi, f"{sede}.cards")
    if not 1 <= len(cercate) <= 2 or len(set(cercate)) != len(cercate):
        raise ValueError(f"{sede}.cards: attesi uno o due binding distinti")
    for campo in ("foundGains", "missedGains"):
        risorse(passo[campo], f"{sede}.{campo}")
    if "vulnerability" in passo:
        vulnerabilita = passo["vulnerability"]
        campi(vulnerabilita, f"{sede}.vulnerability", "factor", "damage")
        fattore(vulnerabilita["factor"], f"{sede}.vulnerability.factor")
        if "damage" in vulnerabilita:
            tipi = vulnerabilita["damage"]
            enum_lista(tipi, DANNI, f"{sede}.vulnerability.damage")
            if not tipi or len(set(tipi)) != len(tipi):
                raise ValueError(f"{sede}.vulnerability.damage: attesi tipi di danno distinti")


def verifica_passi(passi, sede, nomi, ammessi, rincara=False):
    if not isinstance(passi, list):
        raise ValueError(f"{sede}: attesa una lista di operazioni")
    for indice, passo in enumerate(passi):
        qui = f"{sede}[{indice}]"
        if not isinstance(passo, dict):
            raise ValueError(f"{qui}: attesa un'operazione")
        op = passo.get("op")
        scelta(op, ammessi, f"{qui}.op")
        obbligatori, facoltativi = SCHEMI_OP[op]
        campi(passo, qui, f"op {obbligatori}", facoltativi)
        if "resource" in passo:
            scelta(passo["resource"], LETTERE, f"{qui}.resource")
        if "amount" in passo:
            verifica_importo(passo["amount"], f"{qui}.amount", rincara and op == "damage")
            if (sede == "inPlay" or sede.endswith(".seHai")) and type(passo["amount"]) is not int:
                raise ValueError(f"{qui}.amount: serve un importo fisso")
        if op == "damage":
            scelta(passo["type"], DANNI, f"{qui}.type")
            if "applying" in passo:
                enum_lista(passo["applying"], TIPI_STATO, f"{qui}.applying")
        elif op == "status":
            verifica_stato(passo, qui)
        elif op == "search":
            verifica_ricerca(passo, qui, nomi)
        elif op == "say":
            testo(passo["text"], f"{qui}.text")
        elif op in ("anticipo", "gettone"):
            verifica_passi(passo["steps"], f"{qui}.steps", nomi, ("damage", "gain", "lose", "empty", "status", "say"))
            if not any(p["op"] != "say" for p in passo["steps"]):
                raise ValueError(f"{qui}.steps: manca l'effetto condizionale")
        elif op == "vendi":
            verifica_passi(passo["seHai"], f"{qui}.seHai", nomi, ("gain",))
            if not passo["seHai"]:
                raise ValueError(f"{qui}.seHai: manca il ricavato")


def verifica_carta(carta, nomi):
    comuni = "binding gui"
    metadati = "rarity set exclusiveTo cost priority"
    risorse(carta.get("cost", {}), "cost")
    if "java" in carta:
        campi(carta, "carta Java", f"{comuni} java params", metadati)
        if carta["java"] is not True:
            raise ValueError("java: deve valere true")
        binding = carta["binding"]
        scelta(binding, JAVA, "binding Java")
        facoltativi = "perAlcohol maxDamage" if binding == "base.pino.GoingBerserk" else ""
        campi(carta["params"], "params", PARAMETRI_JAVA.get(binding, ""), facoltativi)
        for nome, valore in carta["params"].items():
            intero(valore, f"params.{nome}")
        return
    campi(carta, "carta a dati", f"{comuni} kind", f"{metadati} boundTo basic lastResort targets self target inPlay")
    tipo = carta["kind"]
    scelta(tipo, ("ACTION", "BOUND", "ITEM"), "kind")
    if (tipo == "BOUND") != ("boundTo" in carta):
        raise ValueError("boundTo: vale solo per le carte BOUND")
    for campo in ("basic", "lastResort"):
        if campo in carta and (type(carta[campo]) is not bool or tipo != "ACTION"):
            raise ValueError(f"{campo}: atteso un booleano su una carta ACTION")
    comuni = ("damage", "gain", "lose", "empty", "status", "say")
    propri, avversari = carta.get("self", []), carta.get("target", [])
    rincara = carta.get("lastResort", False)
    verifica_passi(propri, "self", nomi, (*comuni, "consume", "search", "anticipo", "vendi"), rincara)
    verifica_passi(avversari, "target", nomi, (*comuni, "anticipo", "gettone"), rincara)
    verifica_passi(carta.get("inPlay", []), "inPlay", nomi, ("gain", "lose"))
    oggetto_vicino = any(p["op"] in ("consume", "vendi") for p in propri)
    bersagli = ["NEAR_ITEM"] if oggetto_vicino else ["OPPONENT"] if avversari else ["SELF"]
    if tipo == "ITEM":
        if "targets" in carta or avversari or oggetto_vicino or carta.get("cost"):
            raise ValueError("targets: un oggetto ha solo effetti su chi lo consuma")
    elif carta.get("targets") != bersagli or (avversari and oggetto_vicino):
        raise ValueError(f"targets: {carta.get('targets')!r} incompatibile con gli effetti, atteso {bersagli!r}")
    if carta.get("inPlay") and tipo != "ITEM":
        raise ValueError("inPlay: vale solo per gli oggetti")


# ------------------------------------------------------------------------------------------- campi nominali (D168 (4))
def importo(valore):
    return {"base": valore} if isinstance(valore, int) else valore


def guadagni(valori, etichette):
    return ", ".join(f"+{v} {etichette(r)}" for r, v in valori.items() if v) or "—"


def riepilogo(valori):
    return guadagni(valori, LETTERE.__getitem__)


def danno_nominale(passi):
    tipi = {}
    for passo in passi:
        if passo["op"] != "damage":
            continue
        quantita = importo(passo["amount"])
        base, variabile = tipi.get(passo["type"], (0, False))
        tipi[passo["type"]] = (base + quantita.get("base", 0), variabile or "of" in quantita)
    return ", ".join(
        f'{tipo} {tipi[tipo][0]}{"+x" if tipi[tipo][1] else ""}' for tipo in DANNI if tipo in tipi
    ) or "—"


def guadagni_nominali(passi):
    valori = {}
    for passo in passi:
        if passo["op"] == "gain":
            quantita = importo(passo["amount"])
            somma = valori.get(passo["resource"], 0)
            valori[passo["resource"]] = ("x" if "of" in quantita or somma == "x"
                                         else somma + quantita.get("base", 0))
        elif passo["op"] == "search":
            valori.update(passo["foundGains"])
        elif passo["op"] == "vendi":
            return riepilogo({**valori, **{p["resource"]: p["amount"] for p in passo["seHai"] if p["op"] == "gain"}})
    return riepilogo(valori)


def nominali_java(carta):
    binding, params = carta["binding"], carta["params"]
    # La sottoclasse della bozza ha soppresso la sottrazione della classe viva.
    if params.get("alertnessFromTarget", 0):
        raise ValueError("params.alertnessFromTarget: deve essere 0 per base.com.BeggingMoney")
    gains = riepilogo({r: params[k] for k, r in (("alcohol", "ALCOHOL"), ("toxicity", "TOXICITY")) if k in params})
    if binding == "junkie.ToxicBloodDrain":
        danno = f'POISON {params["poison"]}' if params["poison"] else "—"
    elif binding == "bruiser.BadEducation":
        danno = f'HIT {params["hitDamage"]}'
    elif "base" in params:
        danno = f'HIT {params["base"]}+x'
    else:
        danno = "—"
    return gains, danno


# ------------------------------------------------------------------------------------------ parole comuni (glossario)
def simbolo(risorsa):
    return "[[" + LETTERE[risorsa] + "]]"


def danno(tipo):
    """D168 (1): il tipo di danno è un simbolo, col segnaposto uguale al nome del tipo nei dati."""
    if tipo not in DANNI:
        raise ValueError(f"tipo di danno sconosciuto: {tipo}")
    return "[[" + tipo + "]]"


def elenco(parti, congiunzione=" e "):
    parti = list(parti)
    return ", ".join(parti[:-1]) + congiunzione + parti[-1] if len(parti) > 1 else parti[0]


def tipi_di_danno(tipi):
    """«danni» se sono tutti e tre i tipi, altrimenti i simboli."""
    return "danni" if set(tipi) == set(DANNI) else elenco(danno(t) for t in tipi)


# D169: il fattore si dice come parte dei danni che si avrebbero senza la carta («tre quarti dei danni che subiresti»).
CONDIZIONALE = {"subisci": "subiresti", "infliggi": "infliggeresti", "subisce": "subirebbe", "infligge": "infliggerebbe"}
CODE = tuple(" che " + c for c in CONDIZIONALE.values())
PARTI = {0.25: "un quarto dei", 0.5: "metà dei", 0.75: "tre quarti dei", 1.25: "una volta e un quarto i",
         1.5: "una volta e mezza i", 2: "il doppio dei"}
PARTI_SOLE = {0.25: "un quarto", 0.5: "metà", 0.75: "tre quarti", 1.25: "una volta e un quarto", 1.5: "una volta e mezza",
              2: "il doppio"}


def quanti(fattore, tipi, verbo):
    """Quanti danni, coi fattori ammessi da D161 (3) a parole: «tre quarti dei danni che subiresti»."""
    if fattore not in PARTI:
        raise ValueError(f"fattore fuori dal set di D161: {fattore}")
    return f"{PARTI[fattore]} {tipi_di_danno(tipi)} che {CONDIZIONALE[verbo]}"


def valgono(fattore, verbo):
    """Coda di un danno convertito: «i tuoi [[HIT]] diventano [[CUT]] e ne infliggi tre quarti»."""
    if fattore == 1:
        return ""
    if fattore not in PARTI_SOLE:
        raise ValueError(f"fattore fuori dal set di D161: {fattore}")
    return f" e ne {verbo} {PARTI_SOLE[fattore]}"


def durata(turni):
    """R05: durata d = d+1 turni, contando quello in corso. Sta in testa alla frase."""
    if turni == 0:
        return "in questo turno"
    if turni == 1:
        return "in questo turno e nel prossimo"
    return f"per {turni + 1} turni, contando questo,"


def quota(valore, costo):
    """Una quantità letta dalle risorse di chi gioca, quando l'effetto si applica (dopo i costi)."""
    dati = importo(valore)
    base = dati.get("base", 0)
    if "of" not in dati:
        return str(base)
    risorsa = simbolo(dati["of"])
    nucleo = f"{risorsa} che ti resta" if costo.get(dati["of"]) else f"tua {risorsa}"
    divisore = dati.get("divide", 1)
    frazione = {1: f"la {nucleo}", 2: f"metà della {nucleo}", 4: f"un quarto della {nucleo}"}.get(divisore)
    if frazione is None:
        raise ValueError(f"divisore senza parole: {divisore}")
    return f"{base} più {frazione}" if base else frazione


def maiuscola(frase):
    return frase[:1].upper() + frase[1:]


def minuscola(frase):
    return frase[:1].lower() + frase[1:]


def unisci_stati(passi, i):
    """Gli stati adiacenti con lo stesso effetto su tipi diversi: una frase sola. Restituisce (stati, indice successivo)."""
    passo = passi[i]
    stati = [passo]
    chiave = passo.keys() - {"name", "description", "property"}
    i += 1
    while i < len(passi):
        altro = passi[i]
        if (altro.keys() - {"name", "description", "property"} != chiave
                or any(altro[k] != passo[k] for k in chiave)
                or altro["property"] in {s["property"] for s in stati}):
            break
        stati.append(altro)
        i += 1
    return stati, i


# ------------------------------------------------------------------------------------------------------- testo breve
VULNERABILE = {"factor": 1.5, "damage": list(DANNI)}  # la vulnerabilità che la parola chiave «Vulnerabile» dice da sola


def frase_stato(stati, sede):
    stato = stati[0]
    tipi = [s["property"] for s in stati]
    fattore = stato["factor"]
    subisce = stato["flow"] == "INPUT"
    avversario = sede == "target"
    verbo = ("subisce" if subisce else "infligge") if avversario else ("subisci" if subisce else "infliggi")
    if stato.get("convertTo"):
        chi = ("i " + elenco(danno(t) for t in tipi) + (" che subisce l'avversario" if avversario else " che subisci")
               if subisce else ("i " if avversario else "i tuoi ") + elenco(danno(t) for t in tipi)
               + (" dell'avversario" if avversario else ""))
        effetto = f"{chi} diventano {danno(stato['convertTo'])}{valgono(fattore, verbo)}"
    else:
        effetto = f"{'l' + chr(39) + 'avversario ' if avversario else ''}{verbo} {quanti(fattore, tipi, verbo)}"
    # L'equipaggiamento si dice in coda: è lo stesso effetto, ma un'altra carta lo può togliere (R01a, R05).
    etichetta = " (equipaggiamento)" if stato.get("equip") else ""
    if stato.get("singleUse"):
        if "turns" in stato or not stato.get("equip"):
            raise ValueError("uso singolo senza equipaggiamento o con durata: frase non prevista")
        return f"{effetto}{etichetta}. Dopo il primo uso dura solo fino a fine turno"
    return f"{durata(stato['turns'])} {effetto}{etichetta}"


def guadagni_breve(valori):
    parti = [f"+{v} {simbolo(r)}" for r, v in valori.items() if v]
    return ", ".join(parti) if parti else "niente"


def frasi_passi(passi, sede, nomi, costo):
    """Le frasi brevi di una lista di passi, una per effetto. `sede`: self (tu), target (l'avversario), oggetto (chi lo consuma)."""
    contro = sede == "target"
    parti = []
    i = 0
    while i < len(passi):
        passo = passi[i]
        op = passo["op"]
        if op == "status":
            stati, i = unisci_stati(passi, i)
            parti.append(frase_stato(stati, sede))
            continue
        i += 1
        if op == "say":
            continue
        if op in ("gain", "lose"):
            risorsa = simbolo(passo["resource"])
            valore = passo["amount"]
            dati = importo(valore)
            if isinstance(valore, int):
                if op == "gain":
                    testo = f"l'avversario guadagna {valore} {risorsa}" if contro else f"+{valore} {risorsa}"
                else:
                    testo = f"l'avversario perde {valore} {risorsa}" if contro else f"perdi {valore} {risorsa}"
            else:
                verbo = ("l'avversario guadagna" if op == "gain" else "l'avversario perde") if contro else (
                    "guadagni" if op == "gain" else "perdi")
                if op == "lose" and not contro and dati.get("of") == passo["resource"] and not dati.get("base"):
                    # «perdi un quarto della tua [[T]]» invece di «perdi [[T]] pari a un quarto della tua [[T]]».
                    frazione = quota(valore, costo)
                    testo = f"{verbo} {'tutta ' + frazione if frazione.startswith('la ') else frazione}"
                else:
                    testo = f"{verbo} {risorsa} pari a {quota(valore, costo)}"
        elif op == "damage":
            valore = passo["amount"]
            tipo = danno(passo["type"])
            if "of" in importo(valore):
                testo = f"infliggi {tipo} all'avversario pari a {quota(valore, costo)}" if contro else (
                    f"subisci {tipo} pari a {quota(valore, costo)}")
            else:
                n = importo(valore)["base"]
                testo = f"infliggi {n} {tipo} all'avversario" if contro else f"subisci {n} {tipo}"
            if "applying" in passo:
                tipi = passo["applying"]
                if tipi == ["GOOD"]:
                    testo += ". Su questo danno contano solo i tuoi stati positivi"
                elif tipi == ["BAD"]:
                    testo += ". Su questo danno contano solo i tuoi stati negativi"
                elif not tipi:
                    testo += ". Su questo danno i tuoi stati non contano"
                else:
                    raise ValueError(f"applying senza frase: {tipi}")
        elif op == "empty":
            testo = f"azzeri la {simbolo(passo['resource'])} dell'avversario" if contro else (
                f"azzeri la tua {simbolo(passo['resource'])}")
        elif op == "consume":
            testo = "consumi un tuo oggetto"
        elif op == "search":
            scelte = passo["cards"] if "cards" in passo else [passo["card"]]
            trovata = guadagni_breve(passo["foundGains"])
            mancata = guadagni_breve(passo["missedGains"])
            vulnerabilita = passo.get("vulnerability")
            if vulnerabilita:
                if {"factor": vulnerabilita["factor"], "damage": list(vulnerabilita.get("damage", DANNI))} == VULNERABILE:
                    trovata = (trovata + " e diventi" if trovata != "niente" else "diventi") + " Vulnerabile"
                else:
                    trovata += ("; diventi Vulnerabile, ma subisci "
                                + quanti(vulnerabilita["factor"], vulnerabilita.get("damage", DANNI), "subisci"))
            testo = (f"Annuncia {' o '.join('«' + nomi[b] + '»' for b in scelte)}. "
                     f"Se lo trovi: {trovata}. Se non lo trovi: {mancata}")
        elif op in ("anticipo", "gettone"):
            risultato = cuci(frasi_passi(passo["steps"], sede, nomi, costo), "; ")
            condizione = "Gioca d'anticipo" if op == "anticipo" else "Se l'avversario è Vulnerabile"
            testo = f"{condizione}: {risultato}"
        elif op == "vendi":
            risultato = cuci(frasi_passi(passo["seHai"], sede, nomi, costo), "; ")
            testo = f"Vendi il tuo oggetto scelto, che esce senza il suo effetto: {risultato}. Se non c'è più, niente"
        else:
            raise ValueError(f"operazione senza frase: {op}")
        parti.append(testo)
    return parti


# Due frasi di fila con lo stesso inizio diventano una: «perdi un quarto della tua [[T]] e un quarto della tua [[L]]».
INIZI_COMUNI = ("perdi ", "l'avversario perde ", "azzeri ", "in questo turno subisci ", "in questo turno infliggi ",
                "in questo turno e nel prossimo subisci ", "in questo turno l'avversario subisce ",
                "in questo turno l'avversario infligge ")
CONDIZIONI = ("Gioca d'anticipo: ", "Se l'avversario è Vulnerabile: ")


def cuci(parti, separatore=". "):
    """Unisce le frasi: i guadagni propri di fila con la virgola, le frasi con lo stesso inizio con «e», il resto in frasi
    separate con l'iniziale maiuscola."""
    frasi = []
    for parte in parti:
        ultima = frasi[-1] if frasi else ""
        comune = next((i for i in INIZI_COMUNI if ultima.startswith(i) and parte.startswith(i)), None)
        if ultima.startswith("+") and parte.startswith("+") and ". " not in ultima:
            frasi[-1] += ", " + parte
        elif (ultima.startswith("azzeri la ") and ultima.endswith(" dell'avversario") and parte.startswith("azzeri la ")
              and parte.endswith(" dell'avversario")):
            frasi[-1] = ultima[:-len(" dell'avversario")] + " e " + parte[len("azzeri "):]
        elif comune and " e " not in ultima[len(comune):] and "(" not in ultima + parte:
            # «subisci metà dei [[HIT]] e tre quarti dei [[CUT]] che subiresti»: la coda comune si dice una volta sola.
            coda = next((c for c in CODE if ultima.endswith(c) and parte.endswith(c)), "")
            frasi[-1] = ultima[:len(ultima) - len(coda)] + " e " + parte[len(comune):]
        else:
            frasi.append(parte)
    if separatore == ". ":
        frasi = [maiuscola(f) for f in frasi]
    return separatore.join(frasi)


def condizioni_in_fondo(corpo, passi_dopo):
    """Una frase condizionale («Gioca d'anticipo: …») va in fondo, così non sembra reggere anche le frasi che la seguono.
    Si sposta solo se nessun effetto che la seguiva legge le risorse di chi gioca: allora l'ordine non cambia l'esito."""
    condizionali = [f for f in corpo if f.startswith(CONDIZIONI)]
    if not condizionali or corpo[-len(condizionali):] == condizionali:
        return corpo
    if any("of" in importo(p.get("amount", 0)) for p in passi_dopo):
        raise ValueError("una condizione precede effetti che leggono le risorse: l'ordine va deciso a mano")
    return [f for f in corpo if not f.startswith(CONDIZIONI)] + condizionali


def costo_stampato(carta):
    parti = [f"{v} {simbolo(r)}" for r, v in carta.get("cost", {}).items() if v]
    return " + ".join(parti) + ": " if parti else ""


def breve_dati(carta, nomi):
    propri, avversari, in_campo = carta.get("self", []), carta.get("target", []), carta.get("inPlay", [])
    costo = carta.get("cost", {})
    oggetto = carta["kind"] == "ITEM"
    sede = "oggetto" if oggetto else "self"
    corpo = frasi_passi([p for p in propri if p["op"] != "search"], sede, nomi, costo)
    corpo += frasi_passi(avversari, "target", nomi, costo)
    corpo = condizioni_in_fondo(corpo, avversari)
    corpo += frasi_passi([p for p in propri if p["op"] == "search"], sede, nomi, costo)
    if carta.get("lastResort"):
        aumenti = rincari(carta)
        if any(aumenti):
            corpo.append(f"Rincara {aumenti[0]}" + (f" ({aumenti[1]} a te)" if aumenti[1] else ""))
    if not corpo:
        raise ValueError("self/target: manca un effetto stampabile")
    testo = cuci(corpo)
    if oggetto:
        testo = "Quando lo consumi: " + minuscola(testo)
    if in_campo:
        testo = f"In campo, a fine turno: {cuci(frasi_passi(in_campo, 'oggetto', nomi, {}), ', ')}. {testo}"
    return testo


def rincari(carta):
    """Rincara: l'aumento per giocata dei danni all'avversario e di quelli a te (dati: perPlay negli importi)."""
    return [sum(importo(p["amount"]).get("perPlay", 0) for p in passi if p["op"] == "damage")
            for passi in (carta.get("target", []), carta.get("self", []))]


def fine_timer(turni):
    return "A fine turno" if turni == 1 else f"Alla fine del {ORDINALI[turni]} turno, contando questo,"


def quanto_spesa(per):
    return "la [[L]] spesa" if per == 1 else ("il doppio della [[L]] spesa" if per == 2 else f"{per} volte la [[L]] spesa")


CONTROMOSSA = "Se la mossa dell'avversario si risolve dopo la tua, la annulli."
FRAZIONI_PERCENTO = {50: "metà", 25: "un quarto", 75: "tre quarti"}


def breve_java(carta):
    b, p = carta["binding"], carta["params"]
    costo = carta.get("cost", {})
    autodanno = f"Subisci {p['selfHit']} [[HIT]]. " if p.get("selfHit") else ""
    if b == "bruiser.YouStop":
        n = p["alertnessToTarget"]
        return CONTROMOSSA + (f" Se la annulli, l'avversario guadagna {n} [[A]]." if n else "")
    if b == "com.Steal":
        return "Prendi un oggetto dell'avversario e mettilo accanto a te."
    if b == "junkie.AmphetamineReflexes":
        return "Annulli le mosse contro di te che si risolvono dopo la tua."
    if b == "junkie.ToxicBloodDrain":
        veleno = f" Infliggi {p['poison']} [[POISON]] all'avversario." if p["poison"] else ""
        return (f"Dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]].{veleno} "
                f"{fine_timer(p['turns'])} diventi immune a [[T]].")
    if b == "com.items.MarvelousCocktail":
        return (f"Quando lo consumi: diventi immune a [[T]] e [[L]]; +{p['alcohol']} [[L]], +{p['toxicity']} [[T]]. "
                f"{fine_timer(p['turns'])} perdi tutte le immunità e tutti gli stati, poi subisci {p['poison']} [[POISON]].")
    if b == "base.pino.UltimoGiro":
        rincara = f"Rincara {p['perPlay']}" + (f" ({p['perPlaySelf']} a te)" if p.get("perPlaySelf") else "")
        return (f"{autodanno}Spendi tutta la tua [[L]]. Infliggi [[HIT]] all'avversario pari a {p['base']} più la [[L]] spesa. "
                f"{rincara}.")
    if b == "base.pino.GoingBerserk":
        spesa = "tutta la [[L]] che ti resta" if costo.get("ALCOHOL") else "tutta la tua [[L]]"
        tetto = f", al massimo {p['maxDamage']}" if p.get("maxDamage") else ""
        return (f"{autodanno}Spendi {spesa}. Infliggi [[HIT]] all'avversario pari a {p['base']} più "
                f"{quanto_spesa(p.get('perAlcohol', 1))}{tetto}.")
    if b == "base.pino.RuttoADistanzaSociale":
        spesa = "tutta la [[L]] che ti resta" if costo.get("ALCOHOL") else "tutta la tua [[L]]"
        return (f"Spendi {spesa}. L'avversario perde [[A]] pari alla [[L]] spesa. "
                f"Infliggi [[HIT]] all'avversario pari a {p['base']} più {quanto_spesa(p['perAlcohol'])}.")
    if b == "com.items.AnotherRottenBeer":
        return f"Quando lo consumi: +{p['alcohol']} [[L]]. Accanto a te compare una {TOKEN_NOME}."
    if b == "bruiser.BreakYourToy":
        return "Distruggi un oggetto dell'avversario."
    if b == "base.gigi.LavoroFattoBene":
        return f"Infliggi [[HIT]] all'avversario pari a {p['base']} più {p['perItem']} per ogni tuo oggetto in campo."
    if b == "base.cesira.Ricatto":
        frazione = FRAZIONI_PERCENTO.get(p["percent"])
        if frazione is None:
            raise ValueError(f"percentuale senza parole: {p['percent']}")
        return (CONTROMOSSA + f" Se era un attacco, gli rimandi {frazione} dei danni fissi scritti sulla sua carta, "
                "dello stesso tipo.")
    if b == "base.cesira.LoSapevo":
        return CONTROMOSSA + " Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile."
    if b == "base.com.ShuffleFeet":
        return "Scambia tutti i tuoi oggetti con quelli dell'avversario; ognuno ne tiene quanti ne può tenere."
    if b == "base.items.SantinoDellaPortinaia":
        return f"Quando lo consumi: diventi immune a [[L]] per {p['turns']} turni."
    if b == "base.com.BeggingMoney":
        return "Copia accanto a te un oggetto a caso dell'avversario."
    if b == "bruiser.BadEducation":
        return f"Togli all'avversario i suoi equipaggiamenti. Infliggi {p['hitDamage']} [[HIT]] all'avversario."
    if b == "base.cesira.bound.NeRiparliamoFuori":
        return "Annulli la mossa dell'avversario se deve ancora risolversi e contiene Annuncia."
    if b == "base.rocco.bound.MiRialzo":
        return f"Se quando si risolve hai al più {p['healthAtMost']} [[H]], +{p['heal']} [[H]]."
    raise ValueError(f"classe Java senza frase: {b}")


PAROLE_CHIAVE = ("Annuncia", "Gioca d'anticipo", "Rincara", "Vulnerabile")


def breve_carta(carta, nomi):
    """Il testo breve, senza codice di slot e senza sottotipo; il costo resta in testa (G16)."""
    corpo = breve_java(carta) if carta.get("java") else breve_dati(carta, nomi)
    corpo = corpo.rstrip(".") + "."
    costo = costo_stampato(carta)
    if costo and not corpo.startswith(PAROLE_CHIAVE):
        corpo = minuscola(corpo)  # dopo i due punti del costo, minuscola
    return costo + corpo


def breve_personaggio(pg):
    r = pg["resources"]
    valori = [f"{r[k]} {simbolo(k)}" for k in ORDINE_RISORSE if r.get(k)]
    n = pg["items"]
    testo = f"Parti con {elenco(valori)}. Puoi tenere {n} oggett{'o' if n == 1 else 'i'}."
    if pg.get("immunities"):
        testo += " Immune a " + elenco(simbolo(k) for k in pg["immunities"]) + "."
    return testo


def breve_token():
    return "Quando lo consumi: " + minuscola(frase_stato([TOKEN_STATO], "oggetto")) + "."


# ------------------------------------------------------------------------------------------------------------ stati
def descrizione_stato(passo):
    """D169 (4): la descrizione di uno stato, con le frasi del glossario; la dice il segnalino, chiunque lo guardi, quindi in terza
    persona («chi lo ha»). La durata la aggiunge il client dal dato."""
    tipo = danno(passo["property"])
    fattore = passo["factor"]
    if passo.get("convertTo"):
        verbo = "subisce" if passo["flow"] == "INPUT" else "infligge"
        chi = f"I {tipo} che subisce chi lo ha" if passo["flow"] == "INPUT" else f"I {tipo} di chi lo ha"
        frase = f"{chi} diventano {danno(passo['convertTo'])}{valgono(fattore, verbo)}."
    else:
        verbo = "subisce" if passo["flow"] == "INPUT" else "infligge"
        frase = f"Chi lo ha {verbo} {quanti(fattore, [passo['property']], verbo)}."
    if passo.get("singleUse"):
        frase += " Dopo il primo uso dura solo fino a fine turno."
    return frase


def tutti_i_passi(passi):
    """Tutti i passi, anche dentro anticipo, gettone e vendi, nell'ordine scritto."""
    out = []
    for passo in passi:
        out.append(passo)
        for chiave in ("steps", "seHai"):
            if chiave in passo:
                out.extend(tutti_i_passi(passo[chiave]))
    return out


def passi_di_stato(passi):
    """Gli stati di una lista di passi, nell'ordine scritto, anche dentro anticipo, gettone e vendi."""
    out = []
    for passo in passi:
        if passo["op"] == "status":
            out.append(passo)
        for chiave in ("steps", "seHai"):
            if chiave in passo:
                out.extend(passi_di_stato(passo[chiave]))
    return out


def stati_carta(carta):
    """Gli stati della carta nell'ordine del file (la chiave self precede target nei dati della bozza, ma qui si segue il
    dizionario così com'è letto), con nome e descrizione generati: il nome è quello della carta."""
    stati = []
    for chiave, valore in carta.items():
        if chiave in ("self", "target", "inPlay"):
            stati.extend(passi_di_stato(valore))
    return [(s, carta["gui"]["name"], descrizione_stato(s)) for s in stati]


# --------------------------------------------------------------------------------------------------- testo completo
TARGET_FRASE = {
    "OPPONENT": "Si gioca contro un avversario, che scegli.",
    "SELF": "Si gioca su di te.",
    "NEAR_ITEM": "Si gioca su un tuo oggetto, che scegli.",
    "FAR_ITEM": "Si gioca su un oggetto di un avversario, che scegli.",
}
FRAZIONE_ARROTONDA = "metà e quarti si arrotondano per difetto"


def bersaglio_java(binding):
    """Il bersaglio di una carta Java, letto dal sorgente della classe (setCanTarget), risalendo alle superclassi."""
    percorso = JAVA_SRC / (binding.replace(".", "/") + ".java")
    visti = 0
    while percorso.exists() and visti < 5:
        sorgente = percorso.read_text(encoding="utf-8")
        m = re.search(r"setCanTarget\(Set\.of\(CardTarget\.([A-Z_]+)\)\)", sorgente)
        if m:
            return m.group(1)
        padre = re.search(r"\bextends\s+([\w.]+)", sorgente)
        if not padre:
            break
        nome = padre.group(1)
        if nome.startswith("com.gsc.bm.model.cards."):
            percorso = JAVA_SRC / (nome[len("com.gsc.bm.model.cards."):].replace(".", "/") + ".java")
        else:  # stesso package, oppure un package che lo contiene (import)
            candidati = [d / (nome + ".java") for d in (percorso.parent, *percorso.parent.parents)]
            percorso = next((c for c in candidati if c.exists()), candidati[0])
        visti += 1
    raise ValueError(f"bersaglio della classe Java non trovato: {binding}")


def legato_java(binding):
    """Il personaggio a cui è legata una carta Java (setBoundToCharacter), o None."""
    percorso = JAVA_SRC / (binding.replace(".", "/") + ".java")
    m = re.search(r'setBoundToCharacter\("([^"]+)"\)', percorso.read_text(encoding="utf-8")) if percorso.exists() else None
    return m.group(1) if m else None


class Contesto:
    """Quello che il testo completo di una carta legge dal resto della bozza: nomi, personaggi, sottotipi e carte citate."""

    def __init__(self, bozza):
        self.nomi = {c["binding"]: c["gui"]["name"] for c in bozza["cards"]}
        self.personaggi = {p["id"]: p["name"] for p in bozza["characters"]}
        self.basic = {p["basic"]: p["id"] for p in bozza["characters"]}
        self.bound, self.ultime = {}, set()
        for mazzo in bozza["decks"]:
            for b in mazzo["bound"]:
                self.bound[b] = mazzo["character"]
            self.ultime.add(mazzo["lastResort"])
        self.ricatto = self.nomi.get("base.cesira.Ricatto")
        self.togli_equip = self.nomi.get("bruiser.BadEducation")
        self.crea_token = self.nomi.get(TOKEN_CREATO_DA)


def sottotipo(carta, ctx):
    """Il sottotipo per esteso, come lo dice il telaio (G21), col rimando al regolamento."""
    b = carta["binding"]
    oggetto = carta.get("kind") == "ITEM" or (carta.get("java") and "priority" not in carta)
    if oggetto:
        return "Oggetto"
    if carta.get("basic") or b in ctx.basic:
        return f"Azione base di {ctx.personaggi[ctx.basic[b]]}"
    legato = carta.get("boundTo") or ctx.bound.get(b) or (carta.get("java") and legato_java(b))
    if carta.get("kind") == "BOUND" or legato:
        return f"Azione legata a {ctx.personaggi[legato]}"
    if carta.get("lastResort") or b in ctx.ultime:
        riservata = carta.get("exclusiveTo")
        return "Ultima risorsa, " + (f"riservata a {ctx.personaggi[riservata]}" if riservata else "generica")
    return "Azione regolare"


def intestazione(carta, ctx):
    tipo = sottotipo(carta, ctx)
    if tipo == "Oggetto":
        return ("Oggetto: quando lo peschi va in campo vicino a te; fa effetto quando lo consumi con una carta che si gioca su un "
                f"tuo oggetto {rimando('tipi')}.")
    parti = [f"{tipo} {rimando('tipi')}."]
    costo = [f"{v} {simbolo(r)}" for r, v in carta.get("cost", {}).items() if v]
    if costo:
        parti.append(f"Costo: {elenco(costo)}, che paghi prima di ogni effetto del turno {rimando('costo')}.")
    else:
        parti.append("Nessun costo in risorse.")
    if tipo.startswith("Azione legata"):
        parti.append("Per giocarla scarti un'altra carta della mano, che non sia base, legata o ultima risorsa; lo scarto avviene "
                     f"all'inizio del suo effetto, e questa carta resta in mano {rimando('oggetti')}.")
    parti.append(f"Priorità {carta['priority']}.")
    bersagli = carta.get("targets") or [bersaglio_java(carta["binding"])]
    parti.append(" ".join(TARGET_FRASE[t] for t in bersagli))
    return " ".join(parti)


def lettura(risorse_lette):
    """Quando si legge una risorsa e come si arrotonda (D170 (2))."""
    quali = elenco(f"la tua {simbolo(r)}" for r in risorse_lette)
    verbo = "si leggono" if len(risorse_lette) > 1 else "si legge"
    return (f"{maiuscola(quali)} {verbo} quando l'effetto si applica: dopo i costi, dopo le mosse che si sono risolte prima "
            f"della tua e dopo gli effetti che lo precedono su questa carta. {maiuscola(FRAZIONE_ARROTONDA)}.")


def durata_completa(stato):
    if stato.get("singleUse"):
        return ("da quando la carta si risolve finché non cambia un danno; dal primo danno che cambia vale ancora, su ogni danno, "
                "fino alla fine di quel turno")
    turni = stato["turns"]
    if turni == 0:
        return "da quando la carta si risolve fino alla fine di questo turno, effetti di fine turno compresi"
    if turni == 1:
        return "da quando la carta si risolve fino alla fine del prossimo turno, effetti di fine turno compresi"
    return (f"da quando la carta si risolve per {turni + 1} turni, contando questo, fino agli effetti di fine turno "
            "dell'ultimo compresi")


def frase_stato_completa(stati, sede, ctx, nome):
    stato = stati[0]
    tipi = [s["property"] for s in stati]
    fattore = stato["factor"]
    subisce = stato["flow"] == "INPUT"
    avversario = sede == "target"
    positivo = stato["statusType"] == "GOOD"
    chi = "L'avversario riceve" if avversario else "Ottieni"
    genere = "equipaggiamento" if stato.get("equip") else "stato"
    qualita = "positivo" if positivo else "negativo"
    quanti_stati = (f", uno per ciascuno di {elenco(danno(t) for t in tipi)}" if len(stati) > 1 else "")
    verbo = ("subisce" if subisce else "infligge") if avversario else ("subisci" if subisce else "infliggi")
    if stato.get("convertTo"):
        soggetto = ("i " + elenco(danno(t) for t in tipi) + (" che subisce" if subisce else " che infligge")
                    if avversario else "i " + elenco(danno(t) for t in tipi) + (" che subisci" if subisce else " che infliggi"))
        effetto = (f"{soggetto} diventano {danno(stato['convertTo'])}{valgono(fattore, verbo)}, arrotondando per difetto; "
                   f"da {danno(stato['convertTo'])} non li cambiano più gli stati su {elenco(danno(t) for t in tipi)} "
                   f"presi dopo questo, ma quelli su {danno(stato['convertTo'])}")
        if "HIT" in tipi and stato["convertTo"] != "HIT":
            effetto += f", e la corazza dell'alcol non li riduce {rimando('corazza')}"
    else:
        effetto = (f"{'l' + chr(39) + 'avversario ' if avversario else ''}{verbo} "
                   f"{quanti(fattore, tipi, verbo)}, arrotondando per difetto")
    articolo = "l'" if genere == "equipaggiamento" else "lo "
    frase = f"{chi} {articolo}{genere} {qualita} «{nome}»{quanti_stati}: {durata_completa(stato)}, {effetto}."
    note = []
    if not subisce and not avversario:
        note.append(f"Vale anche sui {elenco(danno(t) for t in tipi)} che infliggi a te stesso.")
    if not subisce and avversario:
        note.append(f"Vale anche sui {elenco(danno(t) for t in tipi)} che l'avversario si infligge da solo.")
    note.append("Non cambia i danni delle mosse che si sono risolte prima.")
    if stato.get("equip"):
        togli = f": «{ctx.togli_equip}» lo toglie" if ctx.togli_equip else ""
        note.append(f"È un equipaggiamento{togli} {rimando('equip')}.")
    return frase + " " + " ".join(note)


def frase_ricerca_completa(passo, ctx):
    scelte = passo["cards"] if "cards" in passo else [passo["card"]]
    nomi = " o ".join(f"«{ctx.nomi[b]}»" for b in scelte)
    if len(scelte) > 1:
        cerca = (f"cerchi nel mazzo una carta col nome {nomi}: il nome lo scegli quando giochi questa carta, fra quelli di cui hai "
                 "ancora almeno una copia nel mazzo (se non scegli, vale il primo dei due)")
    else:
        cerca = f"cerchi nel mazzo una carta col nome {nomi}"
    trovata = [f"{v} {simbolo(r)}" for r, v in passo["foundGains"].items() if v]
    mancata = [f"{v} {simbolo(r)}" for r, v in passo["missedGains"].items() if v]
    vuln = passo.get("vulnerability")
    se_trovi = "va in mano e la mostri a tutti finché resta in mano"
    if trovata:
        se_trovi += f"; guadagni {elenco(trovata)}"
    if vuln:
        if {"factor": vuln["factor"], "damage": list(vuln.get("damage", DANNI))} != VULNERABILE:
            raise ValueError("vulnerabilità diversa da quella della parola chiave: frase completa non prevista")
        se_trovi += " e diventi Vulnerabile, legato al nome che hai trovato"
    non_trovi = "peschi normalmente" + (f" e guadagni {elenco(mancata)}" if mancata else "")
    frasi = [f"Annuncia {nomi} {rimando('annuncia')}: al posto della pesca che segue la tua mossa {cerca}. "
             f"Se la trovi, {se_trovi}. Se nel mazzo non ce n'è nessuna, {non_trovi}. "
             "I guadagni arrivano dopo la ricerca; dopo ogni ricerca, trovata o no, il mazzo si mischia. "
             "Se la tua mossa è annullata non cerchi e peschi normalmente; se scarti questa carta per giocare una carta legata, "
             f"non cerchi niente {rimando('scarto')}."]
    if vuln:
        frasi.append(nota_vulnerabile())
    return " ".join(frasi)


def nota_vulnerabile():
    return (f"Vulnerabile {rimando('vulnerabile')}: subisci una volta e mezza i danni che subiresti, {elenco(danno(t) for t in DANNI)}, "
            "veleno di fine turno compreso, arrotondando per difetto. Finisce dopo gli effetti di fine turno del turno in cui giochi "
            "una carta con il nome trovato, anche se parata o annullata; scartarla non basta. Se a fine turno non ne hai più copie "
            "né in mano né nel mazzo, finisce alla fine del turno dopo. Due Vulnerabile si moltiplicano, e ogni carta giocata "
            "col nome ne fa finire uno solo, il più vecchio.")


def frase_completa(passo, sede, ctx, costo, stati, i, passi, rincaro=0):
    """Una frase del testo completo. Restituisce (frase, indice successivo, risorse lette)."""
    contro = sede == "target"
    op = passo["op"]
    lette = []
    if op == "status":
        gruppo, j = unisci_stati(passi, i)
        return frase_stato_completa(gruppo, sede, ctx, ctx.nome_carta), j, lette
    i += 1
    if op in ("gain", "lose"):
        risorsa = simbolo(passo["resource"])
        valore = passo["amount"]
        dati = importo(valore)
        if "of" in dati:
            lette.append(dati["of"])
        if contro:
            verbo = "L'avversario guadagna" if op == "gain" else "L'avversario perde"
        else:
            verbo = "Guadagni" if op == "gain" else "Perdi"
        if isinstance(valore, int):
            testo = f"{verbo} {valore} {risorsa}."
        elif op == "lose" and not contro and dati.get("of") == passo["resource"] and not dati.get("base"):
            frazione = quota(valore, costo)
            testo = f"{verbo} {'tutta ' + frazione if frazione.startswith('la ') else frazione}."
        else:
            testo = f"{verbo} {risorsa} pari a {quota(valore, costo)}."
    elif op == "damage":
        valore = passo["amount"]
        dati = importo(valore)
        tipo = danno(passo["type"])
        if "of" in dati:
            lette.append(dati["of"])
            testo = (f"Infliggi all'avversario {tipo} pari a {quota(valore, costo)}." if contro
                     else f"Infliggi a te stesso {tipo} pari a {quota(valore, costo)}.")
        else:
            testo = (f"Infliggi {dati['base']} {tipo} all'avversario." if contro
                     else f"Subisci {dati['base']} {tipo}: è un danno che infliggi a te stesso, quindi contano sia i tuoi stati sui "
                          "danni che infliggi sia quelli sui danni che subisci.")
        if dati.get("perPlay"):
            testo += f" Più {dati['perPlay']} per ogni volta che l'hai già giocata (Rincara, sotto)."
        if "applying" in passo:
            tipi = passo["applying"]
            if tipi == ["GOOD"]:
                quali = "contano solo i tuoi stati positivi (gli equipaggiamenti sono stati positivi)"
            elif tipi == ["BAD"]:
                quali = "contano solo i tuoi stati negativi"
            elif not tipi:
                quali = "non conta nessuno dei tuoi stati"
            else:
                raise ValueError(f"applying senza frase: {tipi}")
            testo += f" Su questo danno {quali}; gli stati dell'avversario contano tutti {rimando('stati')}."
    elif op == "empty":
        testo = (f"Azzeri la {simbolo(passo['resource'])} dell'avversario: scende a 0 qualunque valore abbia." if contro
                 else f"Azzeri la tua {simbolo(passo['resource'])}: scende a 0 qualunque valore abbia.")
    elif op == "consume":
        testo = ("Consumi il tuo oggetto che hai scelto: esce dal campo e ne ottieni l'effetto «Quando lo consumi». Se quando la "
                 "carta si risolve non è più fra i tuoi oggetti (rubato, distrutto, scalzato da un altro), non consumi niente, ma "
                 f"gli altri effetti della carta valgono {rimando('annulla')}.")
    elif op == "search":
        testo = frase_ricerca_completa(passo, ctx)
    elif op in ("anticipo", "gettone"):
        interne = frasi_completate(passo["steps"], sede, ctx, costo, stati)
        lette += interne[1]
        corpo = " ".join(minuscola(f) if n == 0 else f for n, f in enumerate(interne[0]))
        if op == "anticipo":
            testo = (f"Gioca d'anticipo {rimando('anticipo')}: se la tua mossa si risolve in un gruppo di velocità precedente a "
                     "quello della mossa dell'avversario che hai scelto, cioè con priorità più alta, oppure con pari priorità e più "
                     f"[[A]] dopo i costi, succede anche questo: {corpo} Nello stesso gruppo di velocità, o se l'avversario non ha "
                     "una mossa, no; vale anche se la sua mossa sarà annullata più tardi o se lui è già a terra con la mossa "
                     "ancora da risolvere.")
        else:
            testo = ("Se, quando questo effetto si applica, l'avversario è Vulnerabile, cioè ha almeno un gettone di "
                     f"vulnerabilità di qualunque carta {rimando('vulnerabile')}: {corpo}")
    elif op == "vendi":
        interne = frasi_completate(passo["seHai"], sede, ctx, costo, stati)
        corpo = " ".join(minuscola(f) if n == 0 else f for n, f in enumerate(interne[0]))
        testo = ("Vendi il tuo oggetto che hai scelto: esce dal campo senza il suo effetto (nessun guadagno, immunità, "
                 "equipaggiamento o effetto In campo) e va negli scarti, poi " + corpo + " Se quando la carta si risolve "
                 "l'oggetto non è più fra i tuoi (rubato, distrutto, scalzato da un altro), non vendi niente e non guadagni "
                 f"niente {rimando('vendi')}.")
    else:
        raise ValueError(f"operazione senza frase completa: {op}")
    return testo, i, lette


def frasi_completate(passi, sede, ctx, costo, stati):
    frasi, lette = [], []
    i = 0
    while i < len(passi):
        if passi[i]["op"] == "say":
            i += 1
            continue
        frase, i, r = frase_completa(passi[i], sede, ctx, costo, stati, i, passi)
        frasi.append(frase)
        lette += r
    return frasi, lette


def numerate(frasi):
    return frasi if len(frasi) == 1 else [f"{n}. {f}" for n, f in enumerate(frasi, 1)]


def danni_fissi(carta):
    """I danni fissi che «Buon Vecchio Ricatto» rimanda (PrintedEffects.baseDamage): i danni all'avversario fuori da Gioca
    d'anticipo e da «Se l'avversario è Vulnerabile», solo la parte fissa, per tipo; nelle classi Java i loro."""
    fissi = {}
    if carta.get("java"):
        p = carta["params"]
        b = carta["binding"]
        if b in ("base.pino.UltimoGiro", "base.pino.GoingBerserk", "base.pino.RuttoADistanzaSociale", "base.gigi.LavoroFattoBene"):
            fissi["HIT"] = p["base"]
        elif b == "junkie.ToxicBloodDrain" and p["poison"] > 0:
            fissi["POISON"] = p["poison"]
        elif b == "bruiser.BadEducation":
            fissi["HIT"] = p["hitDamage"]
    else:
        for passo in carta.get("target", []):
            if passo["op"] == "damage" and importo(passo["amount"])["base"] > 0:
                fissi[passo["type"]] = fissi.get(passo["type"], 0) + importo(passo["amount"])["base"]
    return {t: v for t, v in fissi.items() if v > 0}


def note_danni(carta, ctx, tipi):
    note = []
    if tipi:
        corazza = (f"; i {danno('HIT')} che subisce chi ha [[L]] si riducono poi di un quarto della sua [[L]], senza scendere "
                   f"sotto 0 {rimando('corazza')}") if "HIT" in tipi else ""
        note.append("Ogni danno passa prima per gli stati sui danni inflitti di chi lo infligge, poi per quelli sui danni subiti di "
                    "chi lo riceve, Vulnerabile compreso, uno dopo l'altro nell'ordine in cui sono stati presi e arrotondando "
                    f"ogni volta per difetto {rimando('stati')}{corazza}.")
    fissi = danni_fissi(carta)
    if ctx.ricatto and fissi and carta["binding"] != "base.cesira.Ricatto":
        note.append(f"Danni fissi, quelli che «{ctx.ricatto}» rimanda: "
                    + "infliggi " + elenco(f"{v} {danno(t)}" for t, v in fissi.items()) + ".")
    return note


def tipi_danno_dati(carta):
    tipi = set()

    def scorri(passi):
        for p in passi:
            if p["op"] == "damage":
                tipi.add(p["type"])
            for k in ("steps", "seHai"):
                if k in p:
                    scorri(p[k])
    scorri(carta.get("self", []))
    scorri(carta.get("target", []))
    return tipi


def completo_dati(carta, ctx):
    propri, avversari, in_campo = carta.get("self", []), carta.get("target", []), carta.get("inPlay", [])
    costo = carta.get("cost", {})
    oggetto = carta["kind"] == "ITEM"
    sede = "oggetto" if oggetto else "self"
    ricerca = [p for p in propri if p["op"] == "search"]
    frasi, lette = frasi_completate([p for p in propri if p["op"] != "search"], sede, ctx, costo, None)
    f2, l2 = frasi_completate(avversari, "target", ctx, costo, None)
    frasi += f2
    lette += l2
    paragrafi = [intestazione(carta, ctx)]
    if in_campo:
        effetti = []
        for p in in_campo:
            risorsa = simbolo(p["resource"])
            if p["op"] == "lose":
                effetti.append(f"perde {p['amount']} {risorsa}")
            else:
                effetti.append(f"guadagna {p['amount']} {risorsa}")
        tossica = any(p["op"] == "gain" and p["resource"] == "TOXICITY" for p in in_campo)
        paragrafi.append(
            f"In campo {rimando('in campo')}: finché l'oggetto è in campo, alla fine di ogni turno chi lo ha vicino "
            f"{elenco(effetti)}, dopo i suoi altri effetti di fine turno. Agisce anche nel turno in cui arriva e colpisce chi lo ha "
            "in quel momento, anche se l'ha rubato, scambiato o copiato. Non è un danno: stati e parate non lo cambiano, nessuna "
            "risorsa scende sotto 0 e la [[H]] non cambia mai. Consumato, venduto, distrutto o scalzato prima della fine del "
            "turno, non agisce." + (" La [[T]] che dà avvelena dal turno dopo; a chi è immune resta la [[T]] senza il veleno."
                                    if tossica else ""))
    if oggetto:
        intro = "Quando lo consumi, nell'ordine:" if len(frasi) > 1 else "Quando lo consumi:"
    else:
        intro = "Quando la carta si risolve, nell'ordine:" if len(frasi) > 1 else "Quando la carta si risolve:"
    if frasi:
        prima = frasi[0] if frasi[0].startswith(PAROLE_CHIAVE) else minuscola(frasi[0])
        paragrafi.append(intro + " " + (prima if len(frasi) == 1 else " ".join(numerate(frasi))))
    if ricerca:
        paragrafi.append(frase_ricerca_completa(ricerca[0], ctx))
    if carta.get("lastResort"):
        a, s = rincari(carta)
        if a or s:
            paragrafi.append(
                f"Rincara {a}" + (f" ({s} a te)" if s else "") + f" {rimando('rincara')}: per ogni volta che hai già giocato questa "
                f"carta in questa partita, anche annullata, i danni all'avversario crescono di {a}"
                + (f" e quelli che infliggi a te stesso di {s}" if s else "") + "; le giocate dell'avversario non contano.")
    lette = list(dict.fromkeys(lette))
    note = []
    if lette:
        note.append(lettura(lette))
    if any(p["op"] in ("lose", "empty") for p in tutti_i_passi(propri + avversari)):
        note.append(f"Nessuna risorsa scende sotto 0 {rimando('pavimento')}.")
    if any(p["op"] == "status" for p in passi_di_stato(propri + avversari)):
        note.append("Ogni stato si aggiunge a quelli che ci sono già: sullo stesso danno si applicano uno dopo l'altro, "
                    f"nell'ordine in cui sono stati presi {rimando('stati')}.")
    note += note_danni(carta, ctx, tipi_danno_dati(carta))
    paragrafi += note
    return paragrafi


def completo_java(carta, ctx):
    b, p = carta["binding"], carta["params"]
    costo = carta.get("cost", {})
    paragrafi = [intestazione(carta, ctx)]
    dopo = ("Deve ancora risolversi vuol dire che viene dopo la tua nell'ordine di risoluzione del turno: priorità più bassa, oppure "
            "pari priorità e meno [[A]] "
            "dopo i costi, oppure pari priorità e pari [[A]] se il suo giocatore viene dopo di te nell'ordine d'inserimento nella "
            f"partita {rimando('annulla')}.")
    annullata = ("Una mossa annullata non ha effetti, ma il suo costo è già pagato e il suo giocatore pesca come sempre "
                 f"{rimando('annulla')}.")
    tipi = set()
    if b in ("bruiser.YouStop", "base.cesira.Ricatto", "base.cesira.LoSapevo", "base.cesira.bound.NeRiparliamoFuori"):
        se = "Quando la carta si risolve, se la mossa dell'avversario che hai scelto deve ancora risolversi"
        if b == "base.cesira.bound.NeRiparliamoFuori":
            corpo = f"{se} e la sua carta contiene Annuncia {rimando('annuncia')}, la annulli; altrimenti non succede niente."
        else:
            corpo = f"{se}, la annulli; se si è già risolta, o l'avversario non ha una mossa, non succede niente."
        paragrafi.append(corpo + " " + dopo + " " + annullata)
        if b == "bruiser.YouStop":
            n = p["alertnessToTarget"]
            if n:
                paragrafi.append(f"Se la annulli, l'avversario guadagna {n} [[A]], anche se un'altra carta l'aveva già annullata.")
        else:
            paragrafi.append("Se un'altra carta l'ha già annullata, non succede niente.")
        if b == "base.cesira.Ricatto":
            frazione = FRAZIONI_PERCENTO[p["percent"]]
            paragrafi.append(
                f"Se l'hai annullata ed era un attacco, infliggi all'avversario {frazione} dei suoi danni fissi, dello stesso tipo, "
                "arrotondando per difetto. I danni fissi sono quelli scritti sulla sua carta contro l'avversario: non la parte letta "
                "dalle risorse o dagli oggetti, non Rincara, non i danni di Gioca d'anticipo e di «Se l'avversario è Vulnerabile»; "
                "i danni che la sua carta infliggeva a lui stesso non contano. Il testo completo di ogni carta li dice.")
            tipi = set(DANNI)
        if b == "base.cesira.LoSapevo":
            paragrafi.append(
                "Se la carta che annulli ha il nome a cui è legato il Vulnerabile dell'avversario, quella giocata non lo fa finire: "
                f"l'avversario resta Vulnerabile finché non gioca un'altra carta con quel nome {rimando('vulnerabile')}.")
    elif b == "com.Steal":
        paragrafi.append(
            "Quando la carta si risolve prendi l'oggetto dell'avversario che hai scelto e lo metti vicino a te: da quel momento è "
            "tuo. Se così superi gli oggetti che puoi tenere, sparisce il tuo oggetto più vecchio "
            f"{rimando('oggetti')}. Se l'oggetto non c'è più, non prendi niente. Un effetto In campo dell'oggetto, da quel momento, "
            f"agisce su di te {rimando('in campo')}.")
    elif b == "junkie.AmphetamineReflexes":
        paragrafi.append(
            "Quando la carta si risolve annulli la mossa di ogni avversario che si gioca contro di te o contro un tuo oggetto e "
            "deve ancora risolversi. " + dopo + " Le mosse che si sono già risolte, e quelle che gli avversari giocano su sé stessi "
            "o sui propri oggetti, restano. " + annullata)
    elif b == "junkie.ToxicBloodDrain":
        fine = ("alla fine di questo turno" if p["turns"] == 1
                else f"alla fine del {ORDINALI[p['turns']]} turno, contando questo")
        frasi = [
            "All'inizio della risoluzione si legge la [[T]] che ti resta dopo aver pagato il costo.",
            "Perdi tutta quella [[T]].",
            "Togli all'avversario l'immunità a [[T]], anche quella del suo personaggio; resta tolta finché un'altra carta non "
            f"gliela ridà {rimando('immune')}.",
            "L'avversario guadagna la [[T]] che hai perso.",
        ]
        if p["poison"]:
            frasi.append(f"Infliggi {p['poison']} {danno('POISON')} all'avversario.")
            tipi = {"POISON"}
        frasi.append(f"{maiuscola(fine)}, dopo il veleno di fine turno, diventi immune a [[T]]: la tua [[T]] non ti avvelena più a "
                     "fine turno finché un'altra carta non ti toglie l'immunità; costi, guadagni, perdite e danni "
                     f"{danno('POISON')} restano {rimando('immune')}.")
        paragrafi.append("Quando la carta si risolve, nell'ordine: " + " ".join(numerate(frasi)))
    elif b == "com.items.MarvelousCocktail":
        fine = ("alla fine di questo turno" if p["turns"] == 1
                else f"alla fine del {ORDINALI[p['turns']]} turno, contando questo")
        paragrafi.append(
            "Quando lo consumi, nell'ordine: " + " ".join(numerate([
                f"Diventi immune a [[T]] e a [[L]]: da questo fine turno la tua [[T]] non ti avvelena e la tua [[L]] non ti fa "
                f"perdere [[A]] né [[L]]; costi, guadagni, perdite e danni {danno('POISON')} restano {rimando('immune')}.",
                f"Guadagni {p['alcohol']} [[L]] e {p['toxicity']} [[T]].",
                f"{maiuscola(fine)}, dopo gli effetti di [[T]] e [[L]] di quel turno (ancora bloccati), perdi tutte le immunità, "
                "anche quelle del tuo personaggio, e tutti gli stati: positivi, negativi, equipaggiamenti e Vulnerabile. Poi subisci "
                f"{p['poison']} {danno('POISON')}, che nessuno stato cambia perché non ne hai più. Dal turno dopo la tua [[T]] e la "
                "tua [[L]] tornano a fare effetto a fine turno.",
            ])))
    elif b in ("base.pino.UltimoGiro", "base.pino.GoingBerserk"):
        spesa = "la [[L]] che ti resta dopo aver pagato il costo" if costo.get("ALCOHOL") else "la tua [[L]]"
        per = p.get("perAlcohol", 1)
        frasi = [f"All'inizio della risoluzione si legge {spesa}: è la [[L]] spesa."]
        if p.get("selfHit") or (b == "base.pino.UltimoGiro" and p.get("perPlaySelf")):
            frasi.append(f"Subisci {p.get('selfHit', 0)} {danno('HIT')}: è un danno che infliggi a te stesso, quindi contano sia i "
                         "tuoi stati sui danni che infliggi sia quelli sui danni che subisci; arriva prima di spendere la [[L]], "
                         f"quindi la corazza dell'alcol lo riduce {rimando('corazza')}.")
        frasi.append("Spendi tutta la tua [[L]]: scende a 0.")
        tetto = f", al massimo {p['maxDamage']}" if p.get("maxDamage") else ""
        frasi.append(f"Infliggi all'avversario {danno('HIT')} pari a {p['base']} più {quanto_spesa(per)}{tetto}.")
        paragrafi.append("Quando la carta si risolve, nell'ordine: " + " ".join(numerate(frasi)))
        if b == "base.pino.UltimoGiro" and (p.get("perPlay") or p.get("perPlaySelf")):
            s = p.get("perPlaySelf", 0)
            paragrafi.append(
                f"Rincara {p['perPlay']}" + (f" ({s} a te)" if s else "") + f" {rimando('rincara')}: per ogni volta che hai già "
                f"giocato questa carta in questa partita, anche annullata, i {danno('HIT')} all'avversario crescono di "
                f"{p['perPlay']}" + (f" e quelli che infliggi a te stesso di {s}" if s else "")
                + "; le giocate dell'avversario non contano.")
        tipi = {"HIT"}
    elif b == "base.pino.RuttoADistanzaSociale":
        spesa = "la [[L]] che ti resta dopo aver pagato il costo" if costo.get("ALCOHOL") else "la tua [[L]]"
        paragrafi.append("Quando la carta si risolve, nell'ordine: " + " ".join(numerate([
            f"All'inizio della risoluzione si legge {spesa}: è la [[L]] spesa.",
            "Spendi tutta la tua [[L]]: scende a 0.",
            f"L'avversario perde [[A]] pari alla [[L]] spesa; non scende sotto 0 {rimando('pavimento')}.",
            f"Infliggi all'avversario {danno('HIT')} pari a {p['base']} più {quanto_spesa(p['perAlcohol'])}.",
        ])))
        tipi = {"HIT"}
    elif b == "com.items.AnotherRottenBeer":
        token = TOKEN_NOME
        paragrafi.append(
            "Quando lo consumi, nell'ordine: " + " ".join(numerate([
                f"Accanto a te compare una {token}, un token oggetto {rimando('tipi')}: occupa un posto fra gli oggetti che puoi "
                f"tenere, e se ne hai già il massimo sparisce il più vecchio {rimando('oggetti')}. Per usarla la consumi con una "
                "carta che si gioca su un tuo oggetto; il suo testo completo dice cosa fa.",
                f"Guadagni {p['alcohol']} [[L]].",
            ])))
    elif b == "bruiser.BreakYourToy":
        paragrafi.append(
            "Quando la carta si risolve distruggi l'oggetto dell'avversario che hai scelto: esce dal campo senza effetto. Se "
            "l'oggetto non c'è più, non succede niente.")
    elif b == "base.gigi.LavoroFattoBene":
        paragrafi.append(
            f"Quando la carta si risolve infliggi all'avversario {danno('HIT')} pari a {p['base']} più {p['perItem']} per ogni "
            "oggetto che hai in campo. Gli oggetti si contano all'inizio della risoluzione, dopo i costi: contano anche i token; "
            "gli equipaggiamenti no, perché sono stati e non oggetti.")
        tipi = {"HIT"}
    elif b == "base.com.ShuffleFeet":
        paragrafi.append(
            "Quando la carta si risolve scambi tutti i tuoi oggetti con tutti quelli dell'avversario che hai scelto. Se uno dei due "
            "riceve più oggetti di quanti ne può tenere, spariscono i più vecchi fra quelli che riceve "
            f"{rimando('oggetti')}. Gli effetti In campo seguono gli oggetti {rimando('in campo')}.")
    elif b == "base.items.SantinoDellaPortinaia":
        n = p["turns"]
        fine = f"alla fine del {ORDINALI[n]} turno, contando questo" if n > 1 else "alla fine di questo turno"
        bloccato = f"in tutti e {n} i turni" if n > 1 else "in questo turno"
        paragrafi.append(
            "Quando lo consumi diventi immune a [[L]]: la tua [[L]] non ti fa perdere [[A]] né [[L]] a fine turno; costi, "
            f"guadagni e perdite restano {rimando('immune')}. L'immunità finisce {fine}, dopo l'effetto di fine turno della [[L]], "
            f"che quindi resta bloccato {bloccato}. La fine toglie l'immunità a [[L]] anche se nel frattempo ne avevi un'altra, "
            f"per esempio da un secondo «{carta['gui']['name']}».")
    elif b == "base.com.BeggingMoney":
        paragrafi.append(
            "Quando la carta si risolve copi accanto a te un oggetto a caso fra quelli dell'avversario che hai scelto: lui tiene il "
            "suo, tu ne hai uno uguale. Se l'avversario non ha oggetti, non succede niente. Se così superi gli oggetti che puoi "
            f"tenere, sparisce il tuo più vecchio {rimando('oggetti')}.")
    elif b == "bruiser.BadEducation":
        paragrafi.append("Quando la carta si risolve, nell'ordine: " + " ".join(numerate([
            f"Togli all'avversario tutti i suoi equipaggiamenti: sono stati, non oggetti in campo {rimando('equip')}.",
            f"Infliggi {p['hitDamage']} {danno('HIT')} all'avversario.",
        ])))
        tipi = {"HIT"}
    elif b == "base.rocco.bound.MiRialzo":
        paragrafi.append(
            f"Quando la carta si risolve, se hai da {p['healthAtLeast']} a {p['healthAtMost']} [[H]], guadagni {p['heal']} [[H]]; "
            "altrimenti niente. La [[H]] si legge in quel momento, dopo le mosse che si sono risolte prima della tua. La carta si "
            f"gioca su di te, quindi si risolve anche se sei a terra {rimando('a terra')}, ma a 0 [[H]] non recuperi niente.")
    else:
        raise ValueError(f"classe Java senza testo completo: {b}")
    if b in ("base.pino.UltimoGiro", "base.pino.GoingBerserk", "base.pino.RuttoADistanzaSociale"):
        paragrafi.append("La [[L]] spesa è quella letta all'inizio della risoluzione, prima di ogni altro effetto della carta.")
    paragrafi += note_danni(carta, ctx, tipi if b != "base.cesira.Ricatto" else set(DANNI))
    return [x for x in paragrafi if x]


def completo_carta(carta, ctx):
    ctx.nome_carta = carta["gui"]["name"]
    return completo_java(carta, ctx) if carta.get("java") else completo_dati(carta, ctx)


def completo_personaggio(pg, ctx):
    r = pg["resources"]
    valori = [f"{r[k]} {simbolo(k)}" for k in ORDINE_RISORSE if r.get(k)]
    zero = [simbolo(k) for k in ORDINE_RISORSE if not r.get(k)]
    n = pg["items"]
    frasi = [f"Personaggio {rimando('tipi')}.",
             f"Parti con {elenco(valori)}" + (f"; {elenco(zero)} partono da 0" if zero else "") + f" {rimando('risorse')}.",
             f"Puoi tenere {n} oggett{'o' if n == 1 else 'i'} vicino a te: quando ne arriva uno in più, anche rubato, scambiato, "
             f"copiato o creato, sparisce il più vecchio {rimando('oggetti')}."]
    if pg.get("immunities"):
        imm = elenco(simbolo(k) for k in pg["immunities"])
        frasi.append(f"Sei immune a {imm}: la tua {imm} non fa effetto a fine turno; costi, guadagni, perdite e danni "
                     f"{danno('POISON')} restano, e un'altra carta può toglierti l'immunità {rimando('immune')}.")
    base = ctx.nomi.get(pg["basic"])
    if base:
        frasi.append(f"La tua azione base è «{base}».")
    return [" ".join(frasi)]


def completo_token(ctx):
    creato = f", creato da «{ctx.crea_token}»" if ctx.crea_token else ""
    togli = f"; «{ctx.togli_equip}» lo toglie" if ctx.togli_equip else ""
    return [
        f"Token oggetto{creato} {rimando('tipi')}: in campo segue le regole degli oggetti, compreso il numero di oggetti che puoi "
        f"tenere {rimando('oggetti')}. Fa effetto quando lo consumi con una carta che si gioca su un tuo oggetto.",
        "Quando lo consumi ottieni un equipaggiamento positivo: i tuoi [[HIT]] diventano [[CUT]] e ne infliggi una volta e mezza, "
        "arrotondando per difetto; da [[CUT]] non li cambiano più gli stati su [[HIT]] presi dopo questo, ma quelli su [[CUT]], e la "
        f"corazza dell'alcol non li riduce {rimando('corazza')}. Vale anche sui [[HIT]] che infliggi a te stesso. Dura finché non "
        "cambia un danno; dal primo danno che cambia vale ancora, su ogni danno, fino alla fine di quel turno"
        f"{togli} {rimando('equip')}.",
        f"Ogni {TOKEN_NOME} consumata dà un equipaggiamento suo, indipendente dagli altri {rimando('stati')}.",
    ]


def verifica_token():
    """Il token non è nella bozza: i numeri del testo vengono da TOKEN_STATO, che deve coincidere con la classe Java."""
    sorgente = TOKEN_SORGENTE.read_text(encoding="utf-8")
    attesi = {
        "factor": rf"amountFunction\(\w+ -> \w+ \* {TOKEN_STATO['factor']}f\)",
        "property": rf"impactedProperty\(Damage\.DamageType\.{TOKEN_STATO['property']}\)",
        "convertTo": (rf"== Damage\.DamageType\.{TOKEN_STATO['property']} \? Damage\.DamageType\.{TOKEN_STATO['convertTo']} :"),
        "statusType": rf"\.type\(StatusType\.{TOKEN_STATO['statusType']}\)",
        "flow": rf"\.flow\(StatusFlow\.{TOKEN_STATO['flow']}\)",
        "equip": r"\.equip\(true\)",
        "singleUse": r"\.singleUse\(true\)",
    }
    diversi = [campo for campo, forma in attesi.items() if not re.search(forma, sorgente)]
    if diversi:
        raise ValueError(f"token: {', '.join(diversi)} non coincidono con {TOKEN_SORGENTE.name}")


# --------------------------------------------------------------------------------------------------------- slot e voci
def carica_slot(percorso=SLOT_JSON):
    dati = json.loads(Path(percorso).read_text(encoding="utf-8"))
    slot = dati.get("slot") if isinstance(dati, dict) else None
    if not isinstance(slot, dict) or not slot:
        raise ValueError(f"{Path(percorso).name}: atteso un oggetto con la mappa «slot»")
    visti = set()
    for binding, codice in slot.items():
        if not isinstance(codice, str) or not FORMA_SLOT.match(codice):
            raise ValueError(f"{Path(percorso).name}: codice di slot non valido per {binding}: {codice!r}")
        if codice in visti:
            raise ValueError(f"{Path(percorso).name}: slot duplicato {codice}")
        visti.add(codice)
    return slot


def errore_token(campo, valore):
    if not isinstance(valore, str):
        return None  # L'uguaglianza esatta segnala anche i campi mancanti o non testuali.
    if campo != "description" and "[[" in valore:
        return "i segnaposto valgono solo in description"
    m = TOKEN_SCONOSCIUTO.search(valore)
    if m:
        return f"token sconosciuto o incompleto alla posizione {m.start() + 1}"
    return None


# ------------------------------------------------------------------------------------------------- gergo (SB-25 B1)
SEGNAPOSTO = re.compile(r"\[\[(?:[HAVTL]|HIT|CUT|POISON)\]\]")
CITAZIONE = re.compile(r"«[^»]*»")
INIZIO_FRASE = re.compile(r"(?:^|[.!?:]\s)$")
GERGO = (
    ("segno ×", re.compile(r"×")),
    ("formula", re.compile(r"abs\(|>=|<=|/")),
    ("abbreviazione", re.compile(r"\b(?:HIT|CUT|POISON|HEALTH|GOOD|BAD)\b|\b[Ee]quip\b")),
    ("parola vietata", re.compile(r"\b[Bb]ersagli(?:o|a|ano|are)\b|\b[Aa]utore\b|\ba sé\b")),
)
RIMANDO_REGOLE = ("rimando al regolamento", re.compile(r"\bR\d{2}[a-z]?\b|\bRP-\d|[Rr]egolamento|regole del playground"))
# D173: una quantità di danno ha davanti il suo verbo, «infliggi» o «subisci», nella stessa frase: un numero o una frazione davanti al
# simbolo di un tipo di danno, oppure il simbolo seguito da «pari a». Un elenco («subisci metà dei [[HIT]] e tre quarti dei [[CUT]]»)
# ha il verbo una volta sola, in testa.
SIMBOLO_DANNO = r"\[\[(?:HIT|CUT|POISON)\]\]"
FRAZIONE_DANNO = r"(?:metà dei|un quarto dei|tre quarti dei|il doppio dei|una volta e mezza i|una volta e un quarto i)"
QUANTITA_DANNO = re.compile(r"(?:\b\d+ |\b" + FRAZIONE_DANNO + " )" + SIMBOLO_DANNO + "|" + SIMBOLO_DANNO + r"(?: all'avversario)? pari a")
ELENCO_DANNI = re.compile(r"(?:(?:\b\d+ |\b" + FRAZIONE_DANNO + " )" + SIMBOLO_DANNO + r"(?:, | e ))+$")
VERBO_DANNO = re.compile(r"\b(?:[Ii]nfligg\w*|[Ss]ubisc\w*|[Ss]ubir\w*)\b")
LETTERA_ISOLATA = re.compile(r"(?<![\w'’\[])([A-Za-z])(?![\w'’\]])")  # «a», «e», «i», «o» sono parole italiane


def gergo(testo, slot_noti, completo=False):
    """I problemi di gergo di un testo stampato (SB-25 B1): nel testo breve niente ×, formule, abbreviazioni, lettere isolate fuori
    dai segnaposto, rimandi al regolamento, «bersaglio», «autore», «a sé», codici di slot, quantità di danno senza «infliggi» o
    «subisci» davanti (D173); nel testo completo le stesse regole tranne i rimandi al regolamento. I nomi di carta citati fra «» e i segnaposto [[…]] non si guardano."""
    if not isinstance(testo, str):
        return []
    pulito = CITAZIONE.sub("«»", SEGNAPOSTO.sub("[[]]", testo))
    regole = GERGO if completo else GERGO + (RIMANDO_REGOLE,)
    problemi = [f"{nome}: «{m[0]}»" for nome, regola in regole for m in [regola.search(pulito)] if m]
    for m in LETTERA_ISOLATA.finditer(pulito):
        if m[1] in "aeio" or (m[1] in "AEIO" and INIZIO_FRASE.search(pulito[:m.start()])):
            continue
        problemi.append(f"lettera isolata: «{m[1]}» alla posizione {m.start() + 1}")
        break
    citato = CITAZIONE.sub("«»", testo)  # qui i segnaposto dei danni servono
    for m in QUANTITA_DANNO.finditer(citato):
        frase = re.split(r"[.:;] ", ELENCO_DANNI.sub("", citato[:m.start()]))[-1]
        if not VERBO_DANNO.search(frase):
            problemi.append(f"danno senza verbo: «{m[0]}» alla posizione {m.start() + 1}")
            break
    codici = [c for c in slot_noti if re.search(r"(?<![\w-])" + re.escape(c) + r"(?![\w-])", pulito)]
    if codici:
        problemi.append(f"codice di slot: «{codici[0]}»")
    return problemi


def genera(carta, nomi, ctx):
    gui = carta["gui"]
    campi(gui, "gui", "name role damage description", "gains damageAmount image sprite inPlay flavour")
    verifica_carta(carta, nomi)
    if carta.get("java"):
        gains, danno_nom = nominali_java(carta)
    else:
        gains, danno_nom = guadagni_nominali(carta.get("self", [])), danno_nominale(carta.get("target", []))
    return {
        "description": breve_carta(carta, nomi),
        "gains": gains,
        "damageAmount": danno_nom,
        "stati": [(nome, descrizione) for _, nome, descrizione in stati_carta(carta)],
        "completo": completo_carta(carta, ctx),
    }


def leggi(contenuto):
    bozza = json.loads(contenuto)
    if not isinstance(bozza, dict) or bozza.get("format") != "sb-6b/1":
        raise ValueError("formato di bozza sconosciuto, atteso sb-6b/1")
    if not isinstance(bozza.get("cards"), list) or not bozza["cards"]:
        raise ValueError("cards: attesa una lista non vuota")
    return bozza


def analizza(bozza, slot=None):
    """Restituisce (righe, voci, errori): per carta (slot, carta, campi generati); le voci del testo completo per binding."""
    slot = carica_slot() if slot is None else slot
    nomi = {}
    schede = []
    errori = []
    for indice, carta in enumerate(bozza["cards"]):
        sede = f"cards[{indice}]"
        try:
            if not isinstance(carta, dict) or not isinstance(carta.get("gui"), dict):
                raise ValueError("gui: atteso un oggetto carta con gui")
            gui = carta["gui"]
            nome, binding = gui.get("name"), carta.get("binding")
            testo(nome, "gui.name")
            testo(binding, "binding")
            sede = slot.get(binding, binding)
            if binding not in slot:
                raise ValueError("binding senza slot in slot.json")
            if "[[" in nome:
                raise ValueError("gui.name: sequenza riservata [[")
            if binding in nomi:
                raise ValueError(f"binding duplicato: {binding}")
            nomi[binding] = nome
            schede.append((sede, carta))
        except ValueError as errore:
            errori.append(f"{sede}: {errore}")
    noti = set(nomi) | {p.get("id") for p in bozza.get("characters", [])} | {TOKEN_BINDING}
    for binding in slot:
        if binding not in noti:
            errori.append(f"slot.json: {binding} non è nella bozza")
    for p in bozza.get("characters", []):
        if p.get("id") not in slot:
            errori.append(f"{p.get('id')}: personaggio senza slot in slot.json")

    ctx = Contesto(bozza)
    righe = []
    voci = {}
    for p in bozza.get("characters", []):
        try:
            voci[p["id"]] = {"slot": slot.get(p["id"], ""), "nome": p["name"], "tipo": "personaggio",
                             "breve": breve_personaggio(p), "completo": completo_personaggio(p, ctx)}
        except (KeyError, ValueError) as errore:
            errori.append(f"{p.get('id')}: {errore}")
    for sede, carta in schede:
        try:
            generati = genera(carta, nomi, ctx)
            righe.append((sede, carta, generati))
            voci[carta["binding"]] = {"slot": sede, "nome": carta["gui"]["name"], "tipo": "carta",
                                      "breve": generati["description"], "completo": generati["completo"]}
        except (KeyError, ValueError) as errore:
            errori.append(f"{sede}: {errore}")
    try:
        verifica_token()
        voci[TOKEN_BINDING] = {"slot": slot.get(TOKEN_BINDING, ""), "nome": TOKEN_NOME, "tipo": "token",
                               "breve": breve_token(), "completo": completo_token(ctx)}
    except (OSError, ValueError) as errore:
        errori.append(f"token: {errore}")
    return righe, voci, errori


def documento_completi(voci):
    """Il file generato dei testi completi, sempre nello stesso formato (controllato byte per byte)."""
    dati = {
        "nota": ("SB-25 Fase B1 (D170): il testo breve e il testo completo di ogni carta, personaggio e token della bozza, per "
                 "binding. Generato da genera-testi.py --scrivi (testi_stampati.py); non si scrive a mano. In caso di dubbio il testo "
                 "completo prevale sul testo breve."),
        "voci": voci,
    }
    return json.dumps(dati, ensure_ascii=False, indent=1) + "\n"
