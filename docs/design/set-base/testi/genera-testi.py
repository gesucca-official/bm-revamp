"""Prova SB-20c sulla bozza corrente. Legge il JSON e scrive il confronto in %TEMP%."""
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile


ROOT = Path(__file__).resolve().parents[4]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
LETTERE = dict(zip(("HEALTH", "ALERTNESS", "VIOLENCE", "TOXICITY", "ALCOHOL"), "HAVTL"))
DANNI = ("HIT", "CUT", "POISON")
SLOT = re.compile(r"^([A-Z]{2,3}-[A-Z0-9]+) · ")
SIMBOLO = re.compile(r"\[\[([HAVTL])\]\]")

# Le frasi descrivono la logica delle classi. I valori variabili vengono dalla bozza.
JAVA = {
    "bruiser.YouStop": "Annulla la mossa del bersaglio se arriva dopo. Niente [[A]] al bersaglio",
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
        "HIT pari a {base} più la [[L]] spesa al bersaglio. Rincara {perPlay} ({perPlaySelf} a sé)"
    ),
    "base.pino.GoingBerserk": (
        "{autodanno}Spendi tutta la tua [[L]]. Infliggi danni da colpo pari a {base} più la [[L]] spesa"
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
}


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
                filtro = ", ".join(passo["applying"]) or "nessuno stato"
                testo += f"; dell'autore valgono solo: {filtro}"
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
            corpo.append(f"Rincara {aumenti[0]} ({aumenti[1]} a sé)")
    frasi = ("Annuncia ", "Gioca d'anticipo: ", "Se il bersaglio ha ", "Rincara ")
    testo = prefisso + corpo[0]
    for parte in corpo[1:]:
        separatore = ". " if parte.startswith(frasi) else "; "
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
    if "percent" in params:
        n = params["percent"]
        valori["quota"] = "metà" if n == 50 else f"il {n}%"
    if binding == "junkie.ToxicBloodDrain":
        n = params["turns"]
        valori["immunita"] = ("A fine turno ottieni l'immunità a [[T]]" if n == 1
                              else f"Dopo {n} turni ottieni l'immunità a [[T]]")
    # Questi due testi di classe valgono soltanto per la configurazione corrente.
    for chiave in ("alertnessToTarget", "alertnessFromTarget"):
        if params.get(chiave, 0):
            raise ValueError(f"{binding}: rivedere il template per il parametro {chiave}")
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


def normalizza_descrizione(testo):
    lettere = SIMBOLO.sub(r"\1", testo)
    return re.sub(r"\bHEALTH\b", "H", lettere)


def confronta(carta, nomi):
    gui = carta["gui"]
    slot = SLOT.match(gui["description"])
    if not slot:
        raise ValueError(f'{carta["binding"]}: prefisso di slot mancante')
    prefisso = slot.group()
    manuale = carta.get("java", False)
    testo, gains, danno = testo_java(carta) if manuale else testo_dati(carta, nomi)
    generati = {"description": prefisso + costo(carta) + testo + ".", "gains": gains, "damageAmount": danno}
    originali = {campo: gui[campo] for campo in generati}
    differenze = []
    for campo, valore in generati.items():
        attuale = originali[campo]
        if campo == "description":
            valore = normalizza_descrizione(valore)
            attuale = normalizza_descrizione(attuale)
        if valore != attuale:
            differenze.append(campo)
    return {
        "slot": slot.group(1), "binding": carta["binding"], "nome": gui["name"],
        "origine": "dichiarata" if manuale else "generata", "attuale": originali,
        "proposto": generati, "campi_diversi": differenze,
    }


def main():
    dati = BOZZA.read_bytes()
    carte = json.loads(dati)["cards"]
    nomi = {c["binding"]: c["gui"]["name"] for c in carte}
    if any("[[" in nome for nome in nomi.values()):
        raise ValueError("Nome di carta con sequenza riservata [[")
    righe = [confronta(c, nomi) for c in carte]
    esiti = {"totale": len(righe)}
    for origine in ("generata", "dichiarata"):
        gruppo = [r for r in righe if r["origine"] == origine]
        esiti[origine] = {
            "carte": len(gruppo),
            "uguali": sum(not r["campi_diversi"] for r in gruppo),
            "diverse": sum(bool(r["campi_diversi"]) for r in gruppo),
        }
    esiti["campi_diversi"] = {
        campo: sum(campo in r["campi_diversi"] for r in righe)
        for campo in ("description", "gains", "damageAmount")
    }
    impronta = hashlib.sha256(dati).hexdigest()
    rapporto = {"sha256_bozza": impronta, "esiti": esiti, "carte": righe}
    with tempfile.NamedTemporaryFile(
        dir=os.environ["TEMP"], prefix="sb-20c-", suffix=".json", mode="w", encoding="utf-8", delete=False
    ) as uscita:
        json.dump(rapporto, uscita, ensure_ascii=False, indent=2)
        uscita.write("\n")
    print(json.dumps(esiti, ensure_ascii=False))
    print(uscita.name)


if __name__ == "__main__":
    main()
