#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""SB-25 Fase A: prototipo delle frasi nuove dei testi per i giocatori.

Uso, dalla radice del repository:
    python -X utf8 docs/design/set-base/sb-25/frasi.py           # il campione: testo di oggi e testo proposto
    python -X utf8 docs/design/set-base/sb-25/frasi.py --tutte   # tutte le carte (prova che il prototipo non si rompe)

Legge, senza modificarli, la bozza (server/src/test/resources/set-base/bozza.json) e il generatore di oggi
(docs/design/set-base/testi/testi_stampati.py), da cui riusa il controllo di schema e il testo di oggi. Ogni numero del testo
proposto viene dai dati: qui ci sono solo le parole. Nella Fase B queste frasi entrano in testi_stampati.py.

Le scelte sono quelle del glossario (glossario.json): simboli per risorse e tipi di danno, «tu» e «l'avversario», durate e
fattori a parole, nessun codice di slot e nessun sottotipo nel testo (li dicono il campo dello slot e il telaio della carta).
"""
import importlib.util
import json
import sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
ROOT = QUI.parents[3]
_spec = importlib.util.spec_from_file_location("testi_stampati", ROOT / "docs/design/set-base/testi/testi_stampati.py")
ts = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ts)

DANNI = ts.DANNI
ORDINE_RISORSE = ("HEALTH", "ALERTNESS", "VIOLENCE", "TOXICITY", "ALCOHOL")
ORDINALI = {2: "secondo", 3: "terzo", 4: "quarto", 5: "quinto", 6: "sesto", 7: "settimo", 8: "ottavo", 9: "nono", 10: "decimo"}

# Il token non è nella bozza: i suoi dati sono quelli della classe Java (com/gsc/bm/model/cards/com/tokens/BrokenBeerBottle.java).
TOKEN_NOME = "Bottiglia Spaccata"
TOKEN_STATO = {"op": "status", "statusType": "GOOD", "flow": "OUTPUT", "property": "HIT", "factor": 1.5,
               "equip": True, "singleUse": True, "convertTo": "CUT"}
TOKEN_OGGI = ("Equip: Hit Damage x1.5, converted to Cut. Removed at turn end after use; may apply again that turn. "
              "Independent status per application: regulation 1.1 R05.")
# La vulnerabilità che la parola chiave «Vulnerabile» dice da sola (RP-14): ×1,5 su tutti e tre i tipi.
VULNERABILE = {"factor": 1.5, "damage": list(DANNI)}


def simbolo(risorsa):
    return "[[" + ts.LETTERE[risorsa] + "]]"


def danno(tipo):
    """D168 (1): il tipo di danno è un simbolo, col segnaposto uguale al nome del tipo nei dati."""
    if tipo not in DANNI:
        raise ValueError(f"tipo di danno sconosciuto: {tipo}")
    return "[[" + tipo + "]]"


def elenco(parti):
    return ts.elenco(list(parti))


def tipi_di_danno(tipi):
    """«danni» se sono tutti e tre i tipi, altrimenti i simboli."""
    return "danni" if set(tipi) == set(DANNI) else elenco(danno(t) for t in tipi)


# D169: il fattore si dice come parte dei danni che si avrebbero senza la carta («tre quarti dei danni che subiresti»),
# non come differenza («un quarto di danni in meno»).
CONDIZIONALE = {"subisci": "subiresti", "infliggi": "infliggeresti", "subisce": "subirebbe", "infligge": "infliggerebbe"}
CODE = tuple(" che " + c for c in CONDIZIONALE.values())
PARTI = {0.25: "un quarto dei", 0.5: "metà dei", 0.75: "tre quarti dei", 1.25: "una volta e un quarto i",
         1.5: "una volta e mezza i", 2: "il doppio dei"}


def quanti(fattore, tipi, verbo):
    """Quanti danni, coi fattori ammessi da D161 (3) a parole: «tre quarti dei danni che subiresti»."""
    if fattore not in PARTI:
        raise ValueError(f"fattore fuori dal set di D161: {fattore}")
    return f"{PARTI[fattore]} {tipi_di_danno(tipi)} che {CONDIZIONALE[verbo]}"


def valgono(fattore, verbo):
    """Coda di un danno convertito: «i tuoi [[HIT]] diventano [[CUT]] e ne infliggi tre quarti»."""
    frasi = {0.25: "un quarto", 0.5: "metà", 0.75: "tre quarti", 1.25: "una volta e un quarto", 1.5: "una volta e mezza",
             2: "il doppio"}
    if fattore == 1:
        return ""
    if fattore not in frasi:
        raise ValueError(f"fattore fuori dal set di D161: {fattore}")
    return f" e ne {verbo} {frasi[fattore]}"


def durata(turni):
    """R05: durata d = d+1 turni, contando quello in corso. Sta in testa alla frase."""
    if turni == 0:
        return "in questo turno"
    if turni == 1:
        return "in questo turno e nel prossimo"
    return f"per {turni + 1} turni, contando questo,"


def quota(valore, costo):
    """Una quantità letta dalle risorse di chi gioca, quando la carta si risolve (dopo i costi)."""
    dati = ts.importo(valore)
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


def frase_stato(stati, sede):
    stato = stati[0]
    tipi = [s["property"] for s in stati]
    fattore = stato["factor"]
    subisce = stato["flow"] == "INPUT"
    avversario = sede == "target"
    if stato.get("convertTo"):
        chi = ("i " + elenco(danno(t) for t in tipi) + (" che subisce l'avversario" if avversario else " che subisci")
               if subisce else ("i " if avversario else "i tuoi ") + elenco(danno(t) for t in tipi)
               + (" dell'avversario" if avversario else ""))
        verbo = ("subisce" if subisce else "infligge") if avversario else ("subisci" if subisce else "infliggi")
        effetto = f"{chi} diventano {danno(stato['convertTo'])}{valgono(fattore, verbo)}"
    else:
        verbo = ("subisce" if subisce else "infligge") if avversario else ("subisci" if subisce else "infliggi")
        effetto = f"{'l' + chr(39) + 'avversario ' if avversario else ''}{verbo} {quanti(fattore, tipi, verbo)}"
    # L'equipaggiamento si dice in coda: è lo stesso effetto, ma un'altra carta lo può togliere (R01a, R05).
    etichetta = " (equipaggiamento)" if stato.get("equip") else ""
    if stato.get("singleUse"):
        if "turns" in stato or not stato.get("equip"):
            raise ValueError("uso singolo senza equipaggiamento o con durata: frase non prevista")
        return f"{effetto}{etichetta}. Dopo il primo uso dura solo fino a fine turno"
    return f"{durata(stato['turns'])} {effetto}{etichetta}"


def frasi_passi(passi, sede, nomi, costo):
    """Le frasi di una lista di passi, una per effetto. `sede`: self (tu), target (l'avversario), oggetto (chi lo consuma)."""
    contro = sede == "target"
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
            dati = ts.importo(valore)
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
            if "of" in ts.importo(valore):
                testo = f"{tipo} all'avversario pari a {quota(valore, costo)}" if contro else (
                    f"subisci {tipo} pari a {quota(valore, costo)}")
            else:
                n = ts.importo(valore)["base"]
                testo = f"{n} {tipo} all'avversario" if contro else f"subisci {n} {tipo}"
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
        elif op == "status":
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
            testo = frase_stato(stati, sede)
        elif op == "search":
            scelte = passo["cards"] if "cards" in passo else [passo["card"]]
            trovata = guadagni(passo["foundGains"])
            mancata = guadagni(passo["missedGains"])
            vulnerabilita = passo.get("vulnerability")
            if vulnerabilita:
                if {"factor": vulnerabilita["factor"], "damage": list(vulnerabilita.get("damage", DANNI))} == VULNERABILE:
                    trovata = (trovata + " e diventi" if trovata != "niente" else "diventi") + " Vulnerabile"
                else:
                    trovata += f"; diventi Vulnerabile, ma subisci {quanti(vulnerabilita['factor'], vulnerabilita.get('damage', DANNI), 'subisci')}"
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


def guadagni(valori):
    parti = [f"+{v} {simbolo(r)}" for r, v in valori.items() if v]
    return ", ".join(parti) if parti else "niente"


def maiuscola(frase):
    return frase[:1].upper() + frase[1:]


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
    if any("of" in ts.importo(p.get("amount", 0)) for p in passi_dopo):
        raise ValueError("una condizione precede effetti che leggono le risorse: l'ordine va deciso a mano")
    return [f for f in corpo if not f.startswith(CONDIZIONI)] + condizionali


def costo_stampato(carta):
    parti = [f"{v} {simbolo(r)}" for r, v in carta.get("cost", {}).items() if v]
    return " + ".join(parti) + ": " if parti else ""


def testo_dati(carta, nomi):
    propri, avversari, in_campo = carta.get("self", []), carta.get("target", []), carta.get("inPlay", [])
    costo = carta.get("cost", {})
    oggetto = carta["kind"] == "ITEM"
    sede = "oggetto" if oggetto else "self"
    corpo = frasi_passi([p for p in propri if p["op"] != "search"], sede, nomi, costo)
    corpo += frasi_passi(avversari, "target", nomi, costo)
    corpo = condizioni_in_fondo(corpo, avversari)
    corpo += frasi_passi([p for p in propri if p["op"] == "search"], sede, nomi, costo)
    if carta.get("lastResort"):
        aumenti = [sum(ts.importo(p["amount"]).get("perPlay", 0) for p in passi if p["op"] == "damage")
                   for passi in (avversari, propri)]
        if any(aumenti):
            corpo.append(f"Rincara {aumenti[0]}" + (f" ({aumenti[1]} a te)" if aumenti[1] else ""))
    testo = cuci(corpo)
    if oggetto:
        testo = "Quando lo consumi: " + testo[:1].lower() + testo[1:]
    if in_campo:
        testo = f"In campo, a fine turno: {cuci(frasi_passi(in_campo, 'oggetto', nomi, {}), ', ')}. {testo}"
    return testo


def testo_java(carta):
    b, p = carta["binding"], carta["params"]
    costo = carta.get("cost", {})
    contromossa = "Se la mossa dell'avversario si risolve dopo la tua, la annulli."
    autodanno = f"Subisci {p['selfHit']} [[HIT]]. " if p.get("selfHit") else ""
    if b == "bruiser.YouStop":
        n = p["alertnessToTarget"]
        return contromossa + (f" Se la annulli, l'avversario guadagna {n} [[A]]." if n else "")
    if b == "com.Steal":
        return "Prendi un oggetto dell'avversario e mettilo accanto a te."
    if b == "junkie.AmphetamineReflexes":
        return "Annulli le mosse contro di te che si risolvono dopo la tua."
    if b == "junkie.ToxicBloodDrain":
        fine = "A fine turno" if p["turns"] == 1 else f"Alla fine del {ORDINALI[p['turns']]} turno, contando questo,"
        veleno = f" {p['poison']} [[POISON]] all'avversario." if p["poison"] else ""
        return (f"Dai all'avversario tutta la [[T]] che ti resta e togligli l'immunità a [[T]].{veleno} "
                f"{fine} diventi immune a [[T]].")
    if b == "com.items.MarvelousCocktail":
        fine = "A fine turno" if p["turns"] == 1 else f"Alla fine del {ORDINALI[p['turns']]} turno, contando questo,"
        return (f"Quando lo consumi: diventi immune a [[T]] e [[L]]; +{p['alcohol']} [[L]], +{p['toxicity']} [[T]]. "
                f"{fine} perdi tutte le immunità e tutti gli stati, poi subisci {p['poison']} [[POISON]].")
    if b == "base.pino.UltimoGiro":
        rincara = f"Rincara {p['perPlay']}" + (f" ({p['perPlaySelf']} a te)" if p.get("perPlaySelf") else "")
        return (f"{autodanno}Spendi tutta la tua [[L]]. [[HIT]] all'avversario pari a {p['base']} più la [[L]] spesa. "
                f"{rincara}.")
    if b == "base.pino.GoingBerserk":
        spesa = "tutta la [[L]] che ti resta" if costo.get("ALCOHOL") else "tutta la tua [[L]]"
        per = p.get("perAlcohol", 1)
        quanto = "la [[L]] spesa" if per == 1 else ("il doppio della [[L]] spesa" if per == 2 else f"{per} volte la [[L]] spesa")
        tetto = f", al massimo {p['maxDamage']}" if p.get("maxDamage") else ""
        return f"{autodanno}Spendi {spesa}. [[HIT]] all'avversario pari a {p['base']} più {quanto}{tetto}."
    if b == "base.pino.RuttoADistanzaSociale":
        per = p["perAlcohol"]
        quanto = "la [[L]] spesa" if per == 1 else ("il doppio della [[L]] spesa" if per == 2 else f"{per} volte la [[L]] spesa")
        spesa = "tutta la [[L]] che ti resta" if costo.get("ALCOHOL") else "tutta la tua [[L]]"
        return (f"Spendi {spesa}. L'avversario perde [[A]] pari alla [[L]] spesa. "
                f"[[HIT]] all'avversario pari a {p['base']} più {quanto}.")
    if b == "com.items.AnotherRottenBeer":
        return f"Quando lo consumi: +{p['alcohol']} [[L]]. Accanto a te compare una {TOKEN_NOME}."
    if b == "bruiser.BreakYourToy":
        return "Distruggi un oggetto dell'avversario."
    if b == "base.gigi.LavoroFattoBene":
        return f"[[HIT]] all'avversario pari a {p['base']} più {p['perItem']} per ogni tuo oggetto in campo."
    if b == "base.cesira.Ricatto":
        frazione = {50: "metà", 25: "un quarto", 75: "tre quarti"}.get(p["percent"])
        if frazione is None:
            raise ValueError(f"percentuale senza parole: {p['percent']}")
        return (contromossa + f" Se era un attacco, gli rimandi {frazione} dei danni fissi scritti sulla sua carta, "
                "dello stesso tipo.")
    if b == "base.cesira.LoSapevo":
        return contromossa + " Se annulli la carta che aveva annunciato, l'avversario resta Vulnerabile."
    if b == "base.com.ShuffleFeet":
        return "Scambia tutti i tuoi oggetti con quelli dell'avversario; ognuno ne tiene quanti ne può tenere."
    if b == "base.items.SantinoDellaPortinaia":
        return f"Quando lo consumi: diventi immune a [[L]] per {p['turns']} turni."
    if b == "base.com.BeggingMoney":
        return "Copia accanto a te un oggetto a caso dell'avversario."
    if b == "bruiser.BadEducation":
        return f"Togli all'avversario i suoi equipaggiamenti. {p['hitDamage']} [[HIT]] all'avversario."
    if b == "base.cesira.bound.NeRiparliamoFuori":
        return "Annulli la mossa dell'avversario se deve ancora risolversi e contiene Annuncia."
    if b == "base.rocco.bound.MiRialzo":
        return f"Se quando si risolve hai al più {p['healthAtMost']} [[H]], +{p['heal']} [[H]]."
    raise ValueError(f"classe Java senza frase: {b}")


PAROLE_CHIAVE = ("Annuncia", "Gioca d'anticipo", "Rincara", "Vulnerabile")


def testo_carta(carta, nomi):
    """Il testo proposto, senza codice di slot e senza sottotipo; il costo resta in testa."""
    ts.verifica_carta(carta, nomi)
    corpo = testo_java(carta) if carta.get("java") else testo_dati(carta, nomi)
    corpo = corpo.rstrip(".") + "."
    costo = costo_stampato(carta)
    if costo and not corpo.startswith(PAROLE_CHIAVE):
        corpo = corpo[:1].lower() + corpo[1:]  # dopo i due punti del costo, minuscola
    return costo + corpo


def testo_personaggio(pg):
    r = pg["resources"]
    valori = [f"{r[k]} {simbolo(k)}" for k in ORDINE_RISORSE if r.get(k)]
    n = pg["items"]
    testo = f"Parti con {elenco(valori)}. Puoi tenere {n} oggett{'o' if n == 1 else 'i'}."
    if pg.get("immunities"):
        testo += " Immune a " + elenco(simbolo(k) for k in pg["immunities"]) + "."
    return testo


def testo_personaggio_oggi(pg):
    """Come lo scrive oggi la pagina di SB-24 (genera-revisione.py): i personaggi non hanno un testo nella bozza."""
    r = pg["resources"]
    valori = ["HEALTH %d" % r["HEALTH"]] + ["%s %d" % (k[0] if k != "ALCOHOL" else "L", v)
                                            for k, v in r.items() if k != "HEALTH" and v]
    return "Valori iniziali: " + ", ".join(valori) + "; oggetti vicini: %d." % pg["items"]


def testo_token():
    frase = frase_stato([TOKEN_STATO], "oggetto")
    return "Quando lo consumi: " + frase[:1].lower() + frase[1:] + "."


PG_SLOT = {"bruiser.character.BigBadBruiser": "PG-SPA", "base.character.Mara": "PG-MAR",
           "junkie.character.ToxicJunkie": "PG-TOS", "base.character.Pino": "PG-PIN", "base.character.Gigi": "PG-GIG",
           "base.character.Cesira": "PG-CES", "base.character.Rocco": "PG-ROC"}


def tutte():
    """Ogni voce della bozza: slot -> {nome, flavour, oggi, proposto}."""
    bozza = ts.leggi(ts.BOZZA.read_text(encoding="utf-8"))
    righe, errori = ts.analizza(bozza)
    if errori:
        raise ValueError("la bozza non passa il controllo di oggi: " + "; ".join(errori))
    nomi = {c["binding"]: c["gui"]["name"] for c in bozza["cards"]}
    out = {}
    for pg in bozza["characters"]:
        out[PG_SLOT[pg["id"]]] = {"nome": pg["name"], "flavour": pg.get("flavour", ""), "oggi": testo_personaggio_oggi(pg),
                                  "proposto": testo_personaggio(pg)}
    for carta in bozza["cards"]:
        gui = carta["gui"]
        slot, _, oggi = gui["description"].partition(" · ")
        out[slot] = {"nome": gui["name"], "flavour": gui.get("flavour", ""), "oggi": oggi, "proposto": testo_carta(carta, nomi)}
    out["TOKEN"] = {"nome": TOKEN_NOME, "flavour": "", "oggi": TOKEN_OGGI, "proposto": testo_token()}
    return out


def main(argv):
    voci = tutte()
    if "--tutte" in argv:
        scelte = list(voci)
    else:
        campione = json.loads((QUI / "campione.json").read_text(encoding="utf-8"))
        scelte = [v["slot"] for v in campione["voci"]]
    for slot in scelte:
        v = voci[slot]
        print(f"{slot} · {v['nome']}\n  oggi:     {v['oggi']}\n  proposto: {v['proposto']}  ({len(v['proposto'])} caratteri)\n")
    print(f"{len(scelte)} voci.")


if __name__ == "__main__":
    main(sys.argv[1:])
