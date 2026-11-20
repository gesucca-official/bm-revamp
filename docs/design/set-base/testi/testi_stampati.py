"""Generazione dei tre campi stampati della bozza (SB-20c, D142)."""
import json
import math
from pathlib import Path
import re


ROOT = Path(__file__).resolve().parents[4]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
LETTERE = dict(zip(("HEALTH", "ALERTNESS", "VIOLENCE", "TOXICITY", "ALCOHOL"), "HAVTL"))
DANNI = ("HIT", "CUT", "POISON")
SLOT = re.compile(r"^([A-Z]{2,3}-[A-Z0-9]+) · ")
TOKEN_SCONOSCIUTO = re.compile(r"\[\[(?![HAVTL]\]\])")
CAMPI_STAMPATI = ("description", "gains", "damageAmount")
TIPI_STATO = ("GOOD", "BAD")

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

# Le frasi descrivono la logica delle classi. I valori variabili vengono dalla bozza.
JAVA = {
    "bruiser.YouStop": "Annulla la mossa del bersaglio se arriva dopo. {premio}",
    "com.Steal": "Ruba un oggetto lontano e lo mette vicino a sé",
    "junkie.AmphetamineReflexes": "Annulla le mosse dirette a sé che arrivano dopo",
    "junkie.ToxicBloodDrain": (
        "Trasferisci tutta la tua [[T]] residua al bersaglio e togligli l'immunità a [[T]]. "
        "{poison} POISON al bersaglio. {immunita}"
    ),
    "com.items.MarvelousCocktail": (
        "Consumato: immunità a [[T]] e [[L]]; +{alcohol} [[L]], +{toxicity} [[T]]; "
        "timer {turns} che toglie tutte le immunità e gli stati, poi {poison} POISON"
    ),
    "base.pino.UltimoGiro": (
        "Last resort: {autodanno}Spendi tutta la tua [[L]] residua. "
        "{base} HIT al bersaglio, più la [[L]] spesa. Rincara {perPlay} ({perPlaySelf} a sé)"
    ),
    "base.pino.GoingBerserk": (
        "{autodanno}Spendi tutta la tua [[L]]{residua}. Infliggi danni da colpo pari a {base} più {dannoAlcohol}{tetto}"
    ),
    "base.pino.RuttoADistanzaSociale": (
        "Spendi tutta la tua [[L]] residua. Il bersaglio perde [[A]] pari alla [[L]] spesa. "
        "Infliggi danni da colpo pari a {base} più {moltiplicatore} della [[L]] spesa"
    ),
    "com.items.AnotherRottenBeer": "Consumato: +{alcohol} [[L]]; crea il token BrokenBeerBottle vicino a sé",
    "bruiser.BreakYourToy": "Distrugge un oggetto lontano",
    "base.gigi.LavoroFattoBene": "Infliggi danni da colpo pari a {base} più {perItem} per ogni tuo oggetto sul campo",
    "base.cesira.Ricatto": (
        "Annulla la mossa del bersaglio se arriva dopo; se era un colpo, "
        "gli infligge {quota} del suo danno base, dello stesso tipo"
    ),
    "base.cesira.LoSapevo": (
        "Annulla la mossa del bersaglio se arriva dopo. Se annulli il colpo che ha annunciato, il suo gettone resta"
    ),
    "base.com.ShuffleFeet": "Scambia tutti gli oggetti col bersaglio, rispettando le capacità",
    "base.items.SantinoDellaPortinaia": "Consumato: immunità all'effetto periodico di [[L]] per {turns} turni",
    "base.com.BeggingMoney": "Copia vicino a te un oggetto casuale del bersaglio",
    "bruiser.BadEducation": "Toglie gli equip al bersaglio; {hitDamage} HIT al bersaglio",
    # SB-21h (D159, D160): le due bound variante che le op a dati non esprimono.
    "base.cesira.bound.NeRiparliamoFuori": (
        "Bound: annulla la mossa del bersaglio se deve ancora risolversi e contiene Annuncia"
    ),
    "base.rocco.bound.MiRialzo": (
        "Bound: se alla risoluzione hai al più {healthAtMost} [[H]], recuperi {heal} [[H]]"
    ),
}

# I parametri vengono passati alle classi come interi. I binding senza parametri hanno una mappa vuota.
PARAMETRI_JAVA = {
    "bruiser.YouStop": "alertnessToTarget",
    "junkie.ToxicBloodDrain": "turns poison",
    "com.items.MarvelousCocktail": "alcohol toxicity turns poison",
    "base.pino.UltimoGiro": "base selfHit perPlay perPlaySelf",
    "base.pino.GoingBerserk": "base selfHit",
    "base.pino.RuttoADistanzaSociale": "base perAlcohol",
    "com.items.AnotherRottenBeer": "alcohol",
    "base.gigi.LavoroFattoBene": "base perItem",
    "base.cesira.Ricatto": "percent",
    "base.items.SantinoDellaPortinaia": "turns",
    "base.com.BeggingMoney": "alertnessFromTarget",
    "bruiser.BadEducation": "hitDamage",
    "base.cesira.bound.NeRiparliamoFuori": "",
    "base.rocco.bound.MiRialzo": "heal healthAtLeast healthAtMost",  # SB-21z (D161 (3)): healthAtLeast 1 (vivo) non si stampa
}


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


def simbolo(risorsa):
    return "[[" + LETTERE[risorsa] + "]]"


def importo(valore):
    return {"base": valore} if isinstance(valore, int) else valore


def formula(valore):
    dati = importo(valore)
    base = dati.get("base", 0)
    if "of" not in dati:
        return str(base)
    risorsa = simbolo(dati["of"]) + " residua"
    divisore = dati.get("divide", 1)
    if divisore == 2:
        risorsa = "metà della tua " + risorsa + ", arrotondata per difetto"
    elif divisore == 4:
        # SB-21h (D160 (3)): «perdi un quarto della tua T e/o L, per difetto».
        risorsa = "un quarto della tua " + risorsa + ", arrotondato per difetto"
    elif divisore != 1:
        risorsa = f"{risorsa} / {divisore}, arrotondata per difetto"
    return f"{base} più {risorsa}" if base else risorsa


def decimale(numero):
    return str(numero).replace(".", ",")


def guadagni(valori, etichette):
    return ", ".join(f"+{v} {etichette(r)}" for r, v in valori.items() if v) or "—"


def riepilogo(valori):
    return guadagni(valori, LETTERE.__getitem__)


def costo(carta):
    parti = [f"{v} {simbolo(r)}" for r, v in carta.get("cost", {}).items() if v]
    return " + ".join(parti) + ": " if parti else ""


def elenco(parti):
    return ", ".join(parti[:-1]) + " e " + parti[-1] if len(parti) > 1 else parti[0]


def testo_stato(stati, sul_bersaglio):
    stato = stati[0]
    tipi = elenco([s["property"] for s in stati])
    direzione = {"INPUT": "ricevuto", "OUTPUT": "inflitto"}[stato["flow"]]
    if len(stati) > 1:
        direzione = direzione[:-1] + "i"
    tipo = "equip, " if stato.get("equip") else ""
    effetto = f'{tipo}{tipi} {direzione} ×{decimale(stato["factor"])}'
    if stato.get("convertTo"):
        effetto += f' e convertito in {stato["convertTo"]}'
    if "turns" in stato:
        turni = stato["turns"] + 1
        effetto += " in questo turno" if turni == 1 else f" per {turni} turni"
    if stato.get("singleUse"):
        effetto += ", uso singolo (resta fino a fine turno dopo l'uso)"
    return ("Il bersaglio: " if sul_bersaglio else "") + effetto


def testo_passi(passi, sede, nomi):
    destinatario = {"self": " a sé", "target": " al bersaglio", "oggetto": ""}[sede]
    parti = []
    i = 0
    while i < len(passi):
        passo = passi[i]
        op = passo["op"]
        i += 1
        if op == "say":
            continue
        if op in ("gain", "lose"):
            risorsa = simbolo(passo["resource"])
            valore = passo["amount"]
            if isinstance(valore, int):
                segno = "+" if op == "gain" else "−"
                testo = f"{segno}{valore} {risorsa}{destinatario}"
            else:
                verbo = "Guadagno" if op == "gain" else "Perdita"
                testo = f"{verbo} di {risorsa}{destinatario} pari a {formula(valore)}"
        elif op == "damage":
            valore = passo["amount"]
            tipo = passo["type"]
            testo = (f"{tipo}{destinatario} pari a {formula(valore)}" if "of" in importo(valore)
                     else f"{formula(valore)} {tipo}{destinatario}")
            if "applying" in passo:
                tipi = passo["applying"]
                if tipi:
                    testo += f"; dell'autore valgono solo gli stati {elenco(tipi)}"
                else:
                    testo += "; nessuno stato dell'autore si applica"
        elif op == "empty":
            testo = f'Azzera {simbolo(passo["resource"])}' + (
                " del bersaglio" if sede == "target" else " a sé" if sede == "self" else "")
        elif op == "consume":
            testo = "consuma un proprio oggetto"
        elif op == "status":
            # Unisce solo gli stati adiacenti con lo stesso effetto su tipi diversi.
            stati = [passo]
            chiave = passo.keys() - {"name", "description", "property"}
            while i < len(passi):
                altro = passi[i]
                if (altro.keys() - {"name", "description", "property"} != chiave
                        or any(altro[k] != passo[k] for k in chiave)
                        or altro["property"] in {s["property"] for s in stati}):
                    break
                stati.append(altro)
                i += 1
            testo = testo_stato(stati, sede == "target")
        elif op == "search":
            scelte = passo["cards"] if "cards" in passo else [passo["card"]]
            trovata = guadagni(passo["foundGains"], simbolo)
            mancata = guadagni(passo["missedGains"], simbolo)
            vulnerabilita = passo.get("vulnerability")
            if vulnerabilita:
                tipi = elenco(list(vulnerabilita.get("damage", DANNI)))
                fattore = decimale(vulnerabilita["factor"])
                trovata += f"; gettone di vulnerabilità ({tipi} ricevuti ×{fattore})"
            nomi_carte = " o ".join(f"«{nomi[b]}»" for b in scelte)
            testo = f"Annuncia {nomi_carte}. Se lo trovi: {trovata}. Se non lo trovi: {mancata}"
        elif op in ("anticipo", "gettone", "vendi"):
            if op == "vendi":
                risultato = "; ".join(testo_passi(passo["seHai"], sede, nomi))
                testo = ("Vendi il tuo oggetto bersagliato, che esce senza il suo effetto: "
                         f"{risultato}. Se l'oggetto non c'è più, niente")
            else:
                risultato = "; ".join(testo_passi(passo["steps"], sede, nomi))
                condizione = "Gioca d'anticipo" if op == "anticipo" else "Se il bersaglio ha un gettone di vulnerabilità"
                testo = f"{condizione}: {risultato}"
        else:
            raise ValueError(f"Operazione non coperta: {op}")
        parti.append(testo)
    return parti


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


def testo_dati(carta, nomi):
    propri = carta.get("self", [])
    avversari = carta.get("target", [])
    in_campo = carta.get("inPlay", [])
    oggetto = carta["kind"] == "ITEM"
    prefisso = ""
    if oggetto:
        prefisso = "Consumato: "
    elif carta.get("basic"):
        prefisso = "Basic: "
    elif carta["kind"] == "BOUND":
        prefisso = "Bound: "
    elif carta.get("lastResort"):
        prefisso = "Last resort: "
    sede = "oggetto" if oggetto else "self"
    corpo = testo_passi([p for p in propri if p["op"] != "search"], sede, nomi)
    corpo.extend(testo_passi(avversari, "target", nomi))
    # La ricerca sostituisce la pesca, dopo gli effetti immediati della mossa.
    corpo.extend(testo_passi([p for p in propri if p["op"] == "search"], sede, nomi))
    if carta.get("lastResort"):
        aumenti = [
            sum(importo(p["amount"]).get("perPlay", 0) for p in passi if p["op"] == "damage")
            for passi in (avversari, propri)
        ]
        if any(aumenti):
            # SB-21z (D161 (3)): senza rincaro a sé non si stampa «(0 a sé)».
            corpo.append(f"Rincara {aumenti[0]}" + (f" ({aumenti[1]} a sé)" if aumenti[1] else ""))
    if not corpo:
        raise ValueError("self/target: manca un effetto stampabile")
    frasi = ("Annuncia ", "Gioca d'anticipo: ", "Se il bersaglio ha ", "Rincara ")
    testo = prefisso + corpo[0]
    for precedente, parte in zip(corpo, corpo[1:]):
        # Una frase condizionale termina prima del prossimo effetto.
        separatore = ". " if parte.startswith(frasi) or precedente.startswith(frasi) else "; "
        testo += separatore + parte
    if in_campo:
        periodico = "; ".join(testo_passi(in_campo, "oggetto", nomi))
        testo = f"In campo: a fine turno {periodico}. {testo}"
    return testo, guadagni_nominali(propri), danno_nominale(avversari)


def testo_java(carta):
    binding = carta["binding"]
    params = carta["params"]
    testo = JAVA[binding]
    valori = dict(params)
    if "selfHit" in params:
        valori["autodanno"] = f'{params["selfHit"]} HIT a sé. ' if params["selfHit"] else ""
    if "perAlcohol" in params:
        n = params["perAlcohol"]
        valori["moltiplicatore"] = "il doppio" if n == 2 else f"{n} volte il valore"
    if binding == "base.pino.GoingBerserk":
        valori["residua"] = " residua" if carta.get("cost", {}).get("ALCOHOL", 0) else ""
        valori["dannoAlcohol"] = ("la [[L]] spesa" if params.get("perAlcohol", 1) == 1
                                 else f'{valori["moltiplicatore"]} della [[L]] spesa')
        tetto = params.get("maxDamage", 0)
        valori["tetto"] = f", fino a un massimo di {tetto}" if tetto else ""
    if "percent" in params:
        n = params["percent"]
        valori["quota"] = "metà" if n == 50 else f"il {n}%"
    if binding == "junkie.ToxicBloodDrain":
        n = params["turns"]
        valori["immunita"] = ("A fine turno ottieni l'immunità a [[T]]" if n == 1
                              else f"Dopo {n} turni ottieni l'immunità a [[T]]")
    if binding == "bruiser.YouStop":
        n = params["alertnessToTarget"]
        valori["premio"] = f"Se l'annulli: +{n} [[A]] al bersaglio" if n else "Niente [[A]] al bersaglio"
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
    return testo.format_map(valori), gains, danno


def errore_token(campo, valore):
    if not isinstance(valore, str):
        return None  # L'uguaglianza esatta segnala anche i campi mancanti o non testuali.
    if campo != "description" and "[[" in valore:
        return "i segnaposto valgono solo in description"
    m = TOKEN_SCONOSCIUTO.search(valore)
    if m:
        return f"token sconosciuto o incompleto alla posizione {m.start() + 1}"
    return None


def slot_di(gui):
    descrizione = gui.get("description")
    return SLOT.match(descrizione) if isinstance(descrizione, str) else None


def genera(carta, slot, nomi):
    gui = carta["gui"]
    if not slot:
        raise ValueError("gui.description: prefisso di slot mancante")
    campi(gui, "gui", "name role damage description", "gains damageAmount image sprite inPlay")
    verifica_carta(carta, nomi)
    corpo, gains, danno = testo_java(carta) if carta.get("java") else testo_dati(carta, nomi)
    return {"description": slot.group() + costo(carta) + corpo + ".", "gains": gains, "damageAmount": danno}


def leggi(contenuto):
    bozza = json.loads(contenuto)
    if not isinstance(bozza, dict) or bozza.get("format") != "sb-6b/1":
        raise ValueError("formato di bozza sconosciuto, atteso sb-6b/1")
    if not isinstance(bozza.get("cards"), list) or not bozza["cards"]:
        raise ValueError("cards: attesa una lista non vuota")
    return bozza


def analizza(bozza):
    """Restituisce (slot, gui, campi generati) per carta e gli errori di schema."""
    nomi = {}
    schede = []
    errori = []
    slot_visti = set()
    for indice, carta in enumerate(bozza["cards"]):
        sede = f"cards[{indice}]"
        try:
            if not isinstance(carta, dict) or not isinstance(carta.get("gui"), dict):
                raise ValueError("gui: atteso un oggetto carta con gui")
            gui = carta["gui"]
            slot = slot_di(gui)
            sede = slot.group(1) if slot else carta.get("binding", sede)
            nome, binding = gui.get("name"), carta.get("binding")
            testo(nome, "gui.name")
            testo(binding, "binding")
            if "[[" in nome:
                raise ValueError("gui.name: sequenza riservata [[")
            if binding in nomi:
                raise ValueError(f"binding duplicato: {binding}")
            if slot and sede in slot_visti:
                raise ValueError("gui.description: slot duplicato")
            nomi[binding] = nome
            slot_visti.add(sede)
            schede.append((sede, carta, slot))
        except ValueError as errore:
            errori.append(f"{sede}: {errore}")

    righe = []
    for sede, carta, slot in schede:
        try:
            generati = genera(carta, slot, nomi)
            righe.append((sede, carta["gui"], generati))
        except ValueError as errore:
            errori.append(f"{sede} gui.description: {errore}")
    return righe, errori
