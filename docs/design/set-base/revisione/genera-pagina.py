#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera la pagina locale di revisione delle carte del Set Base (SB-20a, D136).

Uso, dalla radice del repository:
    python docs/design/set-base/revisione/genera-pagina.py

Output: tmp/revisione-carte.html, un solo file autonomo (niente rete, niente server).
Lo script legge soltanto le fonti: non modifica bozza, griglia, schede, flavour,
identikit, catalogo, SQLite, codice, test o client. Esce con errore se le carte
non sono 123 o se i conti per rarità non danno 44 C / 59 NC / 20 R.

Le segnalazioni gialle sono aiuti per la revisione, non regole.
"""

import base64
import json
import re
import sqlite3
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
GRIGLIA = ROOT / "docs/design/set-base/griglia.md"
BASE_MD = ROOT / "docs/sets/base.md"
FLAVOUR = ROOT / "docs/design/set-base/flavour.md"
IDENTIKIT = ROOT / "docs/design/set-base/identikit.md"
RIFERIMENTI = ROOT / "docs/design/set-base/identikit/riferimenti"
CATALOGO = ROOT / "server/src/main/resources/cards.sqlite"
OUT = ROOT / "tmp/revisione-carte.html"

TOTALE_ATTESO = 123
RARITA_ATTESE = {"C": 44, "NC": 59, "R": 20}
RARITA_BOZZA = {"COMMON": "C", "UNCOMMON": "NC", "RARE": "R"}
CODICI_PERSONAGGIO = ["SPA", "MAR", "TOS", "PIN", "GIG", "CES", "ROC"]
PERSONAGGIO_SLOT = {
    "bruiser.character.BigBadBruiser": "PG-SPA",
    "base.character.Mara": "PG-MAR",
    "junkie.character.ToxicJunkie": "PG-TOS",
    "base.character.Pino": "PG-PIN",
    "base.character.Gigi": "PG-GIG",
    "base.character.Cesira": "PG-CES",
    "base.character.Rocco": "PG-ROC",
}
FILE_RIFERIMENTO = {
    "SPA": "spazienzio.png", "MAR": "mara.png", "TOS": "celestina.png", "PIN": "piera.png",
    "GIG": "beppe.png", "CES": "sergio.png", "ROC": "duccio.png",
}
# flavour.md usa ancora i nomi di prima delle rinomine (D-decisioni dell'8 novembre): mappa a mano.
NOMI_FLAVOUR = {
    "Spazienzio de la Ucciso": "PG-SPA",
    "Mara Contromano": "PG-MAR",
    "Tossico del Serraglio": "PG-TOS",
    "Pino l'Ultimo Giro": "PG-PIN",
    "Gigi del Carro Attrezzi": "PG-GIG",
    "Cesira la Malalingua": "PG-CES",
    "Rocco «Sant'Incasso»": "PG-ROC",
}
CLASSI_BINDING_BASE = {
    "BigBadBruiser": "bruiser.character.BigBadBruiser",
    "ToxicJunkie": "junkie.character.ToxicJunkie",
}

RES = {"HEALTH": "HEALTH", "ALERTNESS": "A", "VIOLENCE": "V", "TOXICITY": "T", "ALCOHOL": "L"}
RES_INIZIALE = {"HEALTH": "HEALTH iniziale", "ALERTNESS": "A iniziale", "VIOLENCE": "V iniziale",
                "TOXICITY": "T iniziale", "ALCOHOL": "L iniziale"}
OP = {"damage": "danno", "gain": "guadagno", "lose": "perdita", "status": "stato", "search": "ricerca",
      "anticipo": "anticipo", "gettone": "gettone", "empty": "svuota", "vendi": "vendita", "say": "frase"}
ETICHETTA = {"amount": "importo", "base": "base", "perPlay": "per rincaro", "perPlaySelf": "per rincaro a sé",
             "perItem": "per oggetto", "perAlcohol": "per alcol", "divide": "divisore", "of": "su",
             "factor": "fattore", "turns": "turni", "steps": "passi", "selfHit": "HIT a sé",
             "hitDamage": "HIT del colpo", "alertnessToTarget": "A al bersaglio",
             "alertnessFromTarget": "A dal bersaglio", "poison": "POISON", "toxicity": "T",
             "alcohol": "L", "percent": "percentuale", "priority": "priorità",
             "seHai": "se l'oggetto c'è"}
# Valori che devono essere multipli di 5 (quelli che le altre carte rispettano).
CHIAVI_IMPORTO = {"amount", "base", "selfHit", "hitDamage", "alertnessToTarget", "alertnessFromTarget",
                  "poison", "toxicity", "alcohol"}
SIDE = {"self": "A sé", "target": "Bersaglio", "inPlay": "In campo"}
ORDINE_TIPO = {"PG": 0, "BA": 1, "BO": 2, "AR": 3, "LR": 4, "GEN": 5, "OGG": 6}

MOTIVI = {
    "decimale": "numero decimale o moltiplicatore fuori da 0,25",
    "multiplo5": "valore non multiplo di 5 (le altre carte lo sono)",
    "testo_lungo": "testo stampato più lungo della media",
    "numero_testo": "il testo cita un numero che i dati non hanno",
    "nome": "nome mancante",
    "flavour": "flavour mancante (nessuna fonte per la carta)",
    "rarita_griglia": "rarità diversa dalla griglia",
    "ruolo_griglia": "ruolo diverso dalla griglia",
    "contrasto_base": "fonti in contrasto: docs/sets/base.md dice un valore diverso",
}
CONTEGGIO_SEGNALI = Counter()


def fail(msg):
    print("ERRORE: " + msg, file=sys.stderr)
    sys.exit(1)


def leggi(p):
    return p.read_text(encoding="utf-8")


def cella(riga):
    return [c.strip() for c in riga.strip().strip("|").split("|")]


def pulisci(s):
    """Toglie il testo barrato (~~...~~) e i backtick."""
    return re.sub(r"~~.*?~~", "", s).replace("`", "").strip()


def griglia_slot(testo):
    """Legge le tabelle della sezione «La griglia»: slot, rarità, tipo, ruolo, personaggio, riga."""
    righe = testo.splitlines()
    inizio = next(i for i, r in enumerate(righe) if r.startswith("## La griglia"))
    fine = next(i for i, r in enumerate(righe) if r.startswith("## Starter"))
    out = {}
    idx = None
    in_tabella = False
    for n in range(inizio, fine):
        riga = righe[n]
        if riga.startswith("| ID |"):
            idx = {h: i for i, h in enumerate(cella(riga))}
            in_tabella = True
            continue
        if not in_tabella:
            continue
        if not riga.startswith("|"):
            in_tabella = False
            continue
        if re.match(r"^\|\s*-", riga):
            continue
        cs = cella(riga)
        slot = pulisci(cs[0])
        if not re.fullmatch(r"(PG|LR|GEN|OGG|[A-Z]{2,3})-[A-Z0-9]+", slot):
            continue
        if slot in out:
            fail("slot duplicato in griglia.md: " + slot)

        def colonna(nome):
            if nome not in idx or idx[nome] >= len(cs):
                return ""
            return pulisci(cs[idx[nome]])

        rar = re.findall(r"\b(C|NC|R)\b", colonna("Rarità"))
        out[slot] = {
            "rarita": rar[-1] if rar else None,
            "tipo": colonna("Tipo"),
            "ruolo": colonna("Ruolo"),
            "personaggio": colonna("Personaggio"),
            "riga": n + 1,
        }
    return out


def op_label(op):
    parti = [OP.get(op.get("op"), str(op.get("op")))]
    if "resource" in op:
        parti.append(RES.get(op["resource"], op["resource"]))
    if "type" in op:
        parti.append(str(op["type"]))
    if op.get("op") == "status" and "name" in op:
        parti.append("«%s»" % op["name"])
    return " ".join(parti)


def estrai_numeri(carta):
    """Ogni valore numerico di costo, priorità, effetti e parametri diventa un campo."""
    out = []  # (path, etichetta, valore, ultima_chiave)

    def rec(obj, path, parti):
        for k, v in obj.items():
            if isinstance(v, bool):
                continue
            p = path + "." + k if path else k
            lab = parti + [ETICHETTA.get(k) or RES.get(k) or k]
            if isinstance(v, (int, float)):
                out.append((p, " · ".join(lab), v, k))
            elif isinstance(v, dict):
                rec(v, p, lab)
            elif isinstance(v, list):
                for i, it in enumerate(v):
                    if isinstance(it, dict):
                        rec(it, "%s[%d]" % (p, i), lab)

    for lato in ("self", "target", "inPlay"):
        for i, op in enumerate(carta.get(lato) or []):
            rec(op, "%s[%d]" % (lato, i), [SIDE[lato], op_label(op)])
    if isinstance(carta.get("params"), dict):
        rec(carta["params"], "params", ["Parametro Java"])
    return out


def fmt_num(v):
    if isinstance(v, float):
        return "%g" % v
    return str(v)


def numeri_testo(t):
    return [n.replace(",", ".") for n in re.findall(r"\d+(?:[.,]\d+)?", t)]


def leggi_flavour(testo):
    """Ritorna (testi per slot, citazioni per slot, righe della tabella «Carte»)."""
    righe = testo.splitlines()
    testi = {}
    cit = {}
    # sezioni dei personaggi: testo grezzo fra l'intestazione ### e la successiva
    for m in re.finditer(r"^### (.+?) — .*$", testo, re.M):
        nome = m.group(1).strip()
        slot = NOMI_FLAVOUR.get(nome)
        if slot is None:
            fail("sezione di flavour.md non mappata: " + nome)
        fine = re.search(r"^(### |## )", testo[m.end():], re.M)
        corpo_fine = m.end() + (fine.start() if fine else len(testo) - m.end())
        corpo = testo[m.end():corpo_fine]
        base_riga = testo.count("\n", 0, m.end()) + 1
        lista = testi.setdefault(slot, [])
        mm = re.search(r"\*Dalla scheda:\*\s*(.*?)\n\n", corpo, re.S)
        if mm:
            riga = base_riga + corpo[:mm.start()].count("\n") + 1
            lista.append({"etichetta": "Dalla scheda", "testo": " ".join(mm.group(1).split()),
                          "fonte": "flavour.md riga %d, sezione «%s»" % (riga, nome)})
        for b in re.finditer(r"^- \*\*(.+?):\*\* (.*?)(?=^- \*\*|\Z)", corpo, re.M | re.S):
            etic = b.group(1).strip()
            val = " ".join(b.group(2).split())
            if not val or val == "—":
                continue
            riga = base_riga + corpo[:b.start()].count("\n") + 1
            fonte = "flavour.md riga %d, sezione «%s»" % (riga, nome)
            if etic == "Aspetto":
                cit.setdefault(slot + "#illu", []).append({"etichetta": "Aspetto", "testo": val, "fonte": fonte})
            else:
                lista.append({"etichetta": etic, "testo": val, "fonte": fonte})
    # tabella «Carte: nomi e testi di flavour», oggi vuota: si legge se si riempie
    i0 = next((i for i, r in enumerate(righe) if r.startswith("## Carte: nomi e testi di flavour")), None)
    if i0 is not None:
        in_t = False
        for n in range(i0, len(righe)):
            r = righe[n]
            if r.startswith("| Slot |"):
                in_t = True
                continue
            if in_t and not r.startswith("|"):
                break
            if in_t and not re.match(r"^\|\s*-", r):
                cs = cella(r)
                slot = pulisci(cs[0])
                if len(cs) >= 4 and cs[3] and cs[3] != "—":
                    testi.setdefault(slot, []).append({
                        "etichetta": "Testo di flavour (tabella)", "testo": cs[3],
                        "fonte": "flavour.md riga %d, tabella «Carte»" % (n + 1)})
    return testi, cit


def leggi_citazioni(nome_file, testo, slot_validi, citazioni):
    """Righe di flavour.md e identikit.md che citano uno slot: non sono testi di flavour."""
    for n, r in enumerate(testo.splitlines(), start=1):
        for s in set(re.findall(r"\b(?:PG|LR|GEN|OGG|SPA|MAR|TOS|PIN|GIG|CES|ROC)-[A-Z0-9]+\b", r)):
            if s in slot_validi:
                citazioni.setdefault(s, []).append({
                    "etichetta": "Citazione", "testo": " ".join(r.split())[:240],
                    "fonte": "%s riga %d" % (nome_file, n)})


def leggi_identikit(testo, nomi_personaggio):
    """Primo paragrafo di ogni sezione di personaggio: descrizione dell'illustrazione."""
    righe = testo.splitlines()
    out = {}
    for n, r in enumerate(righe):
        if not r.startswith("## "):
            continue
        nome = r[3:].strip()
        if nome not in nomi_personaggio:
            continue
        par = []
        for m in range(n + 1, len(righe)):
            if righe[m].startswith("## "):
                break
            if not righe[m].strip():
                if par:
                    break
                continue
            if not par:
                inizio = m + 1
            par.append(righe[m].strip())
        if par:
            out[nomi_personaggio[nome]] = {"testo": " ".join(par),
                                           "fonte": "identikit.md riga %d, sezione «%s»" % (inizio, nome)}
    return out


def leggi_base_personaggi(testo):
    """Valori dei personaggi di base.md (tabella S2): solo per il confronto."""
    righe = testo.splitlines()
    i0 = next(i for i, r in enumerate(righe) if r.startswith("## S2"))
    i1 = next(i for i, r in enumerate(righe) if r.startswith("## S3"))
    out = {}
    for n in range(i0, i1):
        r = righe[n]
        if not r.startswith("| ") or re.match(r"^\|\s*-", r) or "Carta" in r.split("|")[1]:
            continue
        cs = cella(r)
        if len(cs) < 8 or cs[0] not in CLASSI_BINDING_BASE:
            continue
        uid = CLASSI_BINDING_BASE[cs[0]]
        speciale = cs[5].split()
        out[uid] = {
            "riga": n + 1,
            "HEALTH": int(cs[3]), "ALERTNESS": int(cs[4]),
            "speciale": (speciale[0], int(speciale[1])), "items": int(cs[6]),
        }
    return out


def leggi_catalogo():
    carte, personaggi = {}, {}
    try:
        con = sqlite3.connect("file:%s?mode=ro" % CATALOGO.as_posix(), uri=True)
        carte = {r[0]: r[1] for r in con.execute("SELECT C_REF_CLASS, T_GUI_NAME FROM CRD001_GUI")}
        personaggi = {r[0]: r[1] for r in con.execute("SELECT C_REF_CLASS, T_GUI_NAME FROM CRD003_CHARACTERS")}
        con.close()
    except sqlite3.Error as e:
        fail("lettura di cards.sqlite non riuscita: %s" % e)
    return carte, personaggi


def foto(codice):
    p = RIFERIMENTI / FILE_RIFERIMENTO[codice]
    return "data:image/png;base64," + base64.b64encode(p.read_bytes()).decode("ascii")


def tipo_ordine(slot):
    p = slot.split("-")
    if p[0] == "PG":
        return "PG"
    if p[0] in CODICI_PERSONAGGIO:
        return p[1][:2]  # BA, BO1 → BO, AR1 → AR
    if p[0] == "LR":
        return "LR"
    return p[0] if p[0] in ORDINE_TIPO else "GEN"


def gruppo_di(slot):
    p = slot.split("-")
    if p[0] == "PG" or (p[0] == "LR" and p[1] in CODICI_PERSONAGGIO):
        return p[1]
    if p[0] in CODICI_PERSONAGGIO:
        return p[0]
    if p[0] == "OGG":
        return "OGG"
    return "GEN"


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    g = griglia_slot(leggi(GRIGLIA))
    bozza = json.loads(leggi(BOZZA))
    personaggi = bozza["characters"]
    carte = bozza["cards"]

    # identità delle voci: personaggi per id, carte per slot dal prefisso in gui.description
    voci = []
    for ch in personaggi:
        slot = PERSONAGGIO_SLOT.get(ch["id"])
        if slot is None:
            fail("personaggio non mappato: " + ch["id"])
        if slot not in g:
            fail("personaggio assente dalla griglia: " + slot)
        if g[slot]["personaggio"] != ch["name"]:
            fail("nome del personaggio diverso dalla griglia per %s: «%s» contro «%s»"
                 % (slot, ch["name"], g[slot]["personaggio"]))
        voci.append({"slot": slot, "uid": ch["id"], "binding": ch["id"], "personaggio": ch, "carta": None})
    for c in carte:
        m = re.match(r"^([A-Z]{2,3}-[A-Z0-9]+) · ", (c.get("gui") or {}).get("description", ""))
        if not m:
            fail("carta senza slot nel prefisso di gui.description: " + c["binding"])
        voci.append({"slot": m.group(1), "uid": c["binding"], "binding": c["binding"],
                     "personaggio": None, "carta": c})

    slot_bozza = [v["slot"] for v in voci]
    if len(set(slot_bozza)) != len(slot_bozza):
        fail("slot duplicati fra bozza e personaggi")
    if len(voci) != TOTALE_ATTESO:
        fail("le carte non sono %d: sono %d" % (TOTALE_ATTESO, len(voci)))
    mancanti = sorted(set(g) - set(slot_bozza))
    extra = sorted(set(slot_bozza) - set(g))
    if mancanti or extra:
        fail("slot diversi fra bozza e griglia; in griglia e non in bozza: %s; in bozza e non in griglia: %s"
             % (mancanti, extra))

    # rarità: dalla bozza (rarity) e dalla griglia, entrambe devono dare 44/59/20
    rar_bozza = Counter()
    for v in voci:
        rar_bozza[RARITA_BOZZA[(v["personaggio"] or v["carta"])["rarity"]]] += 1
    if dict(rar_bozza) != RARITA_ATTESE:
        fail("conti per rarità della bozza diversi da %s: %s" % (RARITA_ATTESE, dict(rar_bozza)))
    rar_griglia = Counter(g[v["slot"]]["rarita"] for v in voci)
    if dict(rar_griglia) != RARITA_ATTESE:
        fail("conti per rarità della griglia diversi da %s: %s" % (RARITA_ATTESE, dict(rar_griglia)))

    # fonti di testo (flavour, identikit, base.md, catalogo)
    flav_testi, flav_cit = leggi_flavour(leggi(FLAVOUR))
    cit = {}
    leggi_citazioni("flavour.md", leggi(FLAVOUR), set(g), cit)
    leggi_citazioni("identikit.md", leggi(IDENTIKIT), set(g), cit)
    aspetto = {k.replace("#illu", ""): lst for k, lst in flav_cit.items()}
    nomi_ch = {ch["name"]: PERSONAGGIO_SLOT[ch["id"]] for ch in personaggi}
    identikit = leggi_identikit(leggi(IDENTIKIT), nomi_ch)
    base_ch = leggi_base_personaggi(leggi(BASE_MD))
    catalogo_carte, catalogo_ch = leggi_catalogo()

    # numeri di tutte le carte, per il controllo dei testi
    lunghezze = []
    for v in voci:
        if v["carta"] is not None:
            desc = v["carta"]["gui"]["description"]
            testo = re.sub(r"^[A-Z]{2,3}-[A-Z0-9]+ · ", "", desc)
            lunghezze.append(len(testo))
    media = sum(lunghezze) / len(lunghezze) if lunghezze else 0

    tutte = [costruisci(v, g, flav_testi, cit, identikit, base_ch, catalogo_carte, catalogo_ch, media, aspetto)
             for v in voci]
    for c in tutte:
        for motivo in sorted(set(s["motivo"] for s in c["segnali"])):
            CONTEGGIO_SEGNALI[motivo] += 1

    # pagina
    gruppi = []
    for codice in CODICI_PERSONAGGIO + ["GEN", "OGG"]:
        carte_g = [c for c in tutte if c["gruppo"] == codice]
        carte_g.sort(key=lambda c: (ORDINE_TIPO[tipo_ordine(c["slot"])], c["slot"]))
        if codice in CODICI_PERSONAGGIO:
            titolo = next(ch["name"] for ch in personaggi if PERSONAGGIO_SLOT[ch["id"]].endswith(codice))
            foto_id = codice
        elif codice == "GEN":
            titolo, foto_id = "Generiche (GEN e LR-STR)", None
        else:
            titolo, foto_id = "Oggetti", None
        gruppi.append({"id": codice, "titolo": titolo, "foto": foto_id, "carte": carte_g})

    fotos = {c: foto(c) for c in CODICI_PERSONAGGIO}
    dati = {"gruppi": gruppi}
    html = modello_html(dati, fotos)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(html, encoding="utf-8")

    # riepilogo per il rapporto
    print("Carte: %d (personaggi 7, carte 116)" % len(tutte))
    print("Rarità bozza: %s · griglia: %s" % (dict(rar_bozza), dict(rar_griglia)))
    print("Pagina: %s (%d byte)" % (OUT.relative_to(ROOT).as_posix(), OUT.stat().st_size))
    print("Carte con almeno una segnalazione: %d" % sum(1 for c in tutte if c["segnali"]))
    print("Carte segnalate per motivo:")
    for k, n in sorted(CONTEGGIO_SEGNALI.items(), key=lambda t: -t[1]):
        print("  %3d  %s" % (n, MOTIVI[k]))
    print("Carte con flavour: %d; senza: %d" % (
        sum(1 for c in tutte if c["fonti_testo"]), sum(1 for c in tutte if not c["fonti_testo"])))
    print("Carte Java: %d" % sum(1 for c in tutte if c["java"]))


def costruisci(v, g, flav_testi, cit, identikit, base_ch, catalogo_carte, catalogo_ch, media, aspetto):
    slot = v["slot"]
    gr = g[slot]
    uid = v["uid"]
    ch = v["personaggio"]
    cr = v["carta"]
    campi = []

    def campo(key, etichetta, tipo, prima, fonte, opzioni=None, motivi=()):
        c = {"key": key, "etichetta": etichetta, "tipo": tipo, "prima": prima, "fonte": fonte,
             "segnali": list(motivi)}
        if opzioni:
            c["opzioni"] = opzioni
        campi.append(c)
        return c

    # campi di identità
    campo("slot", "Slot della griglia", "testo", slot,
          "griglia.md riga %d; slot dal prefisso di gui.description (bozza.json)" % gr["riga"]
          if cr else "griglia.md riga %d; personaggio: %s" % (gr["riga"], "characters[%s]" % uid))
    if cr:
        nome = cr["gui"]["name"]
        fonte_nome = "bozza.json · cards[%s] · gui.name" % uid
        kind = cr.get("kind")
        tipo = gr["tipo"] or ""
        ruolo = (cr.get("gui") or {}).get("role", "")
        rar_b = RARITA_BOZZA[cr["rarity"]]
        printed = re.sub(r"^[A-Z]{2,3}-[A-Z0-9]+ · ", "", cr["gui"]["description"])
    else:
        nome = ch["name"]
        fonte_nome = "bozza.json · characters[%s] · name" % uid
        kind = None
        tipo = gr["tipo"] or ""
        ruolo = ""
        rar_b = RARITA_BOZZA[ch["rarity"]]
        printed = ""
    campo("nome", "Nome visualizzato", "testo", nome, fonte_nome,
          motivi=(["nome"] if not nome.strip() else []))
    campo("tipo", "Tipo", "testo", tipo,
          "griglia.md riga %d · Tipo%s" % (gr["riga"], "; bozza.json kind: %s" % (kind or "assente") if cr else ""))
    motivi_ruolo = []
    if cr and ruolo and gr["ruolo"] and ruolo != gr["ruolo"]:
        motivi_ruolo.append("ruolo_griglia")
    campo("ruolo", "Ruolo", "testo", ruolo,
          ("bozza.json · gui.role; griglia.md riga %d · Ruolo: %s" % (gr["riga"], gr["ruolo"] or "—"))
          if cr else "nessun ruolo per i personaggi in bozza.json",
          motivi=motivi_ruolo)
    motivi_rar = [] if rar_b == gr["rarita"] else ["rarita_griglia"]
    campo("rarita", "Rarità", "scelta", rar_b,
          "bozza.json · %s; griglia.md riga %d · Rarità %s"
          % ("rarity" if cr else "characters[%s] · rarity" % uid, gr["riga"], gr["rarita"] or "—"),
          opzioni=["C", "NC", "R"], motivi=motivi_rar)

    # costi e numeri
    if cr:
        for k, val in (cr.get("cost") or {}).items():
            campo("costo:" + k, "Costo %s" % RES.get(k, k), "numero", val,
                  "bozza.json · carta %s · cost.%s" % (uid, k),
                  motivi=motivi_numero(val, True))
        if "priority" in cr:
            campo("priorita", "Priorità", "numero", cr["priority"],
                  "bozza.json · carta %s · priority" % uid, motivi=motivi_numero(cr["priority"], False))
        for path, etic, val, last in estrai_numeri(cr):
            campo("num:" + path, etic, "numero", val, "bozza.json · carta %s · %s" % (uid, path),
                  motivi=motivi_numero(val, last in CHIAVI_IMPORTO))
    else:
        for res in ["HEALTH", "ALERTNESS", "VIOLENCE", "TOXICITY", "ALCOHOL"]:
            val = ch["resources"][res]
            motivi = motivi_numero(val, True)
            if uid in base_ch:
                b = base_ch[uid]
                if res in ("HEALTH", "ALERTNESS"):
                    atteso = b[res]
                elif res == b["speciale"][0]:
                    atteso = b["speciale"][1]
                else:
                    atteso = None
                if atteso is not None and atteso != val:
                    motivi = motivi + ["contrasto_base"]
            campo("res:" + res, RES_INIZIALE[res], "numero", val,
                  "bozza.json · characters[%s] · resources.%s" % (uid, res), motivi=motivi)
        motivi_items = []
        if uid in base_ch and base_ch[uid]["items"] != ch["items"]:
            motivi_items.append("contrasto_base")
        campo("capacita", "Capacità oggetti", "numero", ch["items"],
              "bozza.json · characters[%s] · items" % uid, motivi=motivi_items)

    # testo stampato, flavour, illustrazione
    if cr:
        fonte_testo = "bozza.json · carta %s · gui.description, senza il prefisso di slot" % uid
    else:
        fonte_testo = "bozza.json non ha testo stampato per i personaggi"
    campo("testo", "Testo stampato", "area", printed, fonte_testo,
          motivi=motivi_testo(printed, cr, media))

    fonti_testo = list(flav_testi.get(slot, []))
    fonte_flavour = ("%d fonti di testo qui sotto" % len(fonti_testo)) if fonti_testo else \
        "nessuna fonte di flavour per questa carta (vedi flavour.md)"
    motivi_flav = [] if fonti_testo else ["flavour"]
    campo("flavour", "Flavour (testo scelto)", "area", "", fonte_flavour, motivi=motivi_flav)
    campo("illu_nome", "Nome dell'illustrazione", "testo", "",
          "nessuna fonte di nome dell'illustrazione per questa carta (vedi fonti)")
    illu_fonti = list(aspetto.get(slot, []))
    if ch is not None and slot in identikit:
        illu_fonti.append({"etichetta": "Identikit", "testo": identikit[slot]["testo"],
                           "fonte": identikit[slot]["fonte"]})
    campo("illu_desc", "Descrizione dell'illustrazione", "area", "",
          "fonti di descrizione qui sotto" if illu_fonti else "nessuna fonte per questa carta")

    # numeri citati nel testo che i dati della carta non hanno
    numeri_dati = set()
    for c in campi:
        if c["tipo"] == "numero" and isinstance(c["prima"], (int, float)) and not isinstance(c["prima"], bool):
            numeri_dati.add(fmt_num(abs(c["prima"])))
    if cr and any(n not in numeri_dati for n in numeri_testo(printed)):
        next(c for c in campi if c["key"] == "testo")["segnali"].append("numero_testo")

    # costruzione della carta
    java = bool(cr and cr.get("java"))
    info = []
    if cr:
        if kind:
            info.append("Tipo in bozza.json: %s" % kind)
        if cr.get("boundTo"):
            info.append("Legata a: %s" % cr["boundTo"])
        if cr.get("basic"):
            info.append("Basic: sì")
        if cr.get("lastResort"):
            info.append("Ultima risorsa: sì")
        if cr.get("exclusiveTo"):
            info.append("Esclusiva di: %s" % cr["exclusiveTo"])
        if cr.get("inPlay") is not None:
            info.append("In campo: sì (vedi il testo)")
        info.append("Binding: %s" % cr["binding"])
    else:
        info.append("Id: %s" % ch["id"])
        if ch.get("basic"):
            info.append("Basic del personaggio: %s" % ch["basic"])
        if ch.get("immunities"):
            info.append("Immunità iniziali: %s" % ", ".join(ch["immunities"]))
    if java:
        info.append("Carta Java: i numeri stanno nel codice della classe «%s». La bozza.json ne riporta costo e "
                    "parametri come copia di lavoro." % cr["binding"])
    if cr:
        cat = catalogo_carte.get(cr["binding"])
    else:
        cat = catalogo_ch.get(uid)
    info.append("Catalogo vivo (cards.sqlite): %s" % (("presente, nome «%s»" % cat) if cat else "assente"))

    return {
        "uid": uid,
        "slot": slot,
        "binding": v["binding"],
        "nome": nome,
        "gruppo": gruppo_di(slot),
        "campi": campi,
        "segnali": [{"motivo": m, "campo": c["key"]} for c in campi for m in c["segnali"]],
        "info": info,
        "java": java,
        "fonti_testo": fonti_testo,
        "citazioni": list(cit.get(slot, [])),
        "illustrazione": illu_fonti,
    }


def motivi_numero(valore, importo):
    """Segnalazioni su un numero. Ritorna lista di motivi (chiavi di MOTIVI)."""
    out = []
    if isinstance(valore, float):
        if (valore * 4) % 1 != 0:
            out.append("decimale")
    elif isinstance(valore, int) and importo and valore != 0 and valore % 5 != 0:
        out.append("multiplo5")
    return out


def motivi_testo(testo, cr, media):
    out = []
    if cr and testo and len(testo) > 1.5 * media:
        out.append("testo_lungo")
    return out


def modello_html(dati, fotos):
    dati_js = json.dumps(dati, ensure_ascii=False).replace("</", "<\\/")
    foto_js = json.dumps(fotos, ensure_ascii=False).replace("</", "<\\/")
    return MODELLO.replace("__DATI__", dati_js).replace("__FOTO__", foto_js)


MODELLO = r"""<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<title>Revisione carte Set Base · SB-20a</title>
<style>
body { font-family: system-ui, sans-serif; margin: 0; background: #f4f4f1; color: #222; }
header { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #ccc; padding: 10px 16px; z-index: 5; }
h1 { font-size: 18px; margin: 0 0 6px; }
.barra { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; font-size: 14px; }
.barra button { padding: 4px 10px; }
#contatori { font-weight: 600; }
main { padding: 12px 16px 40px; }
.gruppo > header.testa-gruppo { position: static; border: 0; background: none; padding: 0; display: flex; align-items: center; gap: 12px; }
.testa-gruppo img { height: 90px; border: 1px solid #bbb; background: #000; }
.testa-gruppo h2 { font-size: 18px; margin: 16px 0 8px; }
.carta { background: #fff; border: 1px solid #ccc; border-radius: 6px; padding: 10px 12px; margin: 10px 0; max-width: 980px; }
.carta.modificata { border-color: #2a7ae2; box-shadow: inset 4px 0 0 #2a7ae2; }
.carta h3 { font-size: 15px; margin: 0 0 6px; }
.segnali { background: #fff3b0; border: 1px solid #d9b800; border-radius: 4px; padding: 6px 8px; margin: 6px 0; font-size: 13px; }
.segnali ul { margin: 2px 0 0 18px; padding: 0; }
.campo { display: grid; grid-template-columns: 220px 1fr; gap: 2px 10px; margin: 6px 0; align-items: start; }
.campo > label { font-size: 13px; font-weight: 600; padding-top: 4px; }
.campo input, .campo select, .campo textarea { font: inherit; font-size: 14px; padding: 4px 6px; border: 1px solid #aaa; border-radius: 3px; width: 100%; box-sizing: border-box; }
.campo textarea { min-height: 48px; }
.campo.segnalato input, .campo.segnalato select, .campo.segnalato textarea { background: #fff3b0; border-color: #d9b800; }
.campo.modificato input, .campo.modificato select, .campo.modificato textarea { border-color: #2a7ae2; font-weight: 600; }
.campo .fonte, .campo .motivo { grid-column: 2; font-size: 12px; color: #666; }
.campo .motivo { color: #7a5c00; }
.blocco { font-size: 12px; color: #444; margin: 6px 0 0; }
.blocco ul { margin: 2px 0 0 18px; padding: 0; }
.blocco li { margin: 2px 0; }
.java { background: #eef4ff; border: 1px solid #a7c3f2; border-radius: 4px; padding: 6px 8px; font-size: 13px; margin: 6px 0; }
.nascosta { display: none !important; }
</style>
</head>
<body>
<header>
  <h1>Revisione carte Set Base · SB-20a (D136)</h1>
  <div class="barra">
    <label>Personaggio <select id="filtro-gruppo"><option value="">tutti</option></select></label>
    <label>Rarità <select id="filtro-rarita"><option value="">tutte</option><option value="C">C</option><option value="NC">NC</option><option value="R">R</option></select></label>
    <label><input type="checkbox" id="filtro-segnalate"> solo segnalate</label>
    <span id="contatori"></span>
    <button id="esporta">Esporta modifiche</button>
    <button id="annulla">Annulla tutto</button>
  </div>
  <div class="barra" style="margin-top:6px;font-size:12px;color:#555;">
    Le modifiche restano salvate in questo browser (localStorage). In giallo: segnalazioni di aiuto, non regole. Blu: campo modificato.
  </div>
</header>
<main id="gruppi"></main>
<script>
window.DATI = __DATI__;
window.FOTO = __FOTO__;
</script>
<script>
(function () {
  "use strict";
  var D = window.DATI;
  var FOTO = window.FOTO;
  var CHIAVE = "sb-20a-revisione/v1";
  var stato = {};
  try { stato = JSON.parse(localStorage.getItem(CHIAVE) || "{}") || {}; } catch (e) { stato = {}; }
  var originali = {};
  var controlli = [];

  function salva() {
    try {
      if (Object.keys(stato).length) localStorage.setItem(CHIAVE, JSON.stringify(stato));
      else localStorage.removeItem(CHIAVE);
    } catch (e) { /* senza localStorage la pagina resta utilizzabile */ }
  }
  function el(tag, cls, testo) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (testo !== undefined && testo !== null) n.textContent = String(testo);
    return n;
  }
  function uguali(a, b) { return String(a) === String(b); }
  function valoreAttuale(carta, campo) {
    var s = stato[carta.uid];
    if (s && s.campi && Object.prototype.hasOwnProperty.call(s.campi, campo.key)) return s.campi[campo.key];
    return campo.prima;
  }
  function imposta(carta, campo, valore) {
    var s = stato[carta.uid] || (stato[carta.uid] = { campi: {}, nota: "" });
    if (uguali(valore, campo.prima)) delete s.campi[campo.key];
    else s.campi[campo.key] = valore;
    if (!Object.keys(s.campi).length && !s.nota) delete stato[carta.uid];
    salva();
  }
  function leggi(campo, raw) {
    if (campo.tipo === "numero") {
      if (raw === "") return "";
      var n = Number(raw);
      return isNaN(n) ? raw : n;
    }
    return raw;
  }
  function campiModificati(carta) {
    var s = stato[carta.uid];
    var n = 0;
    if (!s || !s.campi) return 0;
    carta.campi.forEach(function (c) {
      if (Object.prototype.hasOwnProperty.call(s.campi, c.key) && !uguali(s.campi[c.key], c.prima)) n++;
    });
    return n;
  }
  function contatori() {
    var carte = 0, campi = 0;
    D.gruppi.forEach(function (g) { g.carte.forEach(function (c) {
      var n = campiModificati(c);
      if (n) { carte++; campi += n; }
    }); });
    document.getElementById("contatori").textContent =
      "Carte modificate: " + carte + " (campi: " + campi + ")";
  }
  function aggiornaCarta(carta, art) {
    art.classList.toggle("modificata", campiModificati(carta) > 0);
    art.querySelectorAll(".campo[data-key]").forEach(function (row) {
      var key = row.getAttribute("data-key");
      var campo = carta.campi.filter(function (c) { return c.key === key; })[0];
      if (!campo) return;
      var s = stato[carta.uid];
      var mod = s && s.campi && Object.prototype.hasOwnProperty.call(s.campi, key) && !uguali(s.campi[key], campo.prima);
      row.classList.toggle("modificato", !!mod);
    });
    var titolo = art.querySelector("h3");
    var nome = valoreAttuale(carta, carta.campi[1]);
    var slot = valoreAttuale(carta, carta.campi[0]);
    titolo.textContent = slot + " · " + nome;
  }
  function controllo(carta, campo) {
    var c;
    if (campo.tipo === "area") c = el("textarea");
    else if (campo.tipo === "scelta") {
      c = el("select");
      campo.opzioni.forEach(function (o) { var op = el("option", null, o); op.value = o; c.appendChild(op); });
    } else {
      c = el("input");
      c.type = campo.tipo === "numero" ? "number" : "text";
      if (campo.tipo === "numero") c.step = "any";
    }
    c.value = String(valoreAttuale(carta, campo) === null ? "" : valoreAttuale(carta, campo));
    c.setAttribute("data-campo", campo.key);
    controlli.push({ carta: carta, campo: campo, controllo: c });
    return c;
  }
  function riga(carta, campo, art) {
    var row = el("div", "campo" + (campo.segnali.length ? " segnalato" : ""));
    row.setAttribute("data-key", campo.key);
    var lab = el("label", null, campo.etichetta);
    var c = controllo(carta, campo);
    row.appendChild(lab);
    row.appendChild(c);
    row.appendChild(el("div", "fonte", "Fonte: " + campo.fonte));
    if (campo.segnali.length) {
      var motivi = campo.segnali.map(function (m) { return motivoTesto(m); }).join(" · ");
      row.appendChild(el("div", "motivo", "Segnalato: " + motivi));
    }
    c.addEventListener("input", function () {
      imposta(carta, campo, leggi(campo, c.value));
      aggiornaCarta(carta, art);
      contatori();
    });
    return row;
  }
  var MOTIVI = {
    decimale: "numero decimale o moltiplicatore fuori da 0,25",
    multiplo5: "valore non multiplo di 5 (le altre carte lo sono)",
    testo_lungo: "testo stampato più lungo della media",
    numero_testo: "il testo cita un numero che i dati non hanno",
    nome: "nome mancante",
    flavour: "flavour mancante (nessuna fonte per la carta)",
    rarita_griglia: "rarità diversa dalla griglia",
    ruolo_griglia: "ruolo diverso dalla griglia",
    contrasto_base: "fonti in contrasto: docs/sets/base.md dice un valore diverso"
  };
  function motivoTesto(m) { return MOTIVI[m] || m; }
  function blocco(titolo, voci) {
    var d = el("div", "blocco");
    d.appendChild(el("strong", null, titolo));
    if (!voci.length) { d.appendChild(el("div", null, "nessuna")); return d; }
    var ul = el("ul");
    voci.forEach(function (v) { ul.appendChild(el("li", null, v)); });
    d.appendChild(ul);
    return d;
  }
  function fontiTesto(lista) {
    return lista.map(function (x) { return x.etichetta + ": " + x.testo + " [" + x.fonte + "]"; });
  }
  function carta(c) {
    var art = el("article", "carta");
    art.setAttribute("data-uid", c.uid);
    art.setAttribute("data-gruppo", c.gruppo);
    art.setAttribute("data-segnalata", c.segnali.length ? "1" : "0");
    art.setAttribute("data-rarita", c.campi.filter(function (x) { return x.key === "rarita"; })[0].prima);
    var titolo = el("h3", null, c.slot + " · " + c.nome);
    art.appendChild(titolo);
    if (c.segnali.length) {
      var box = el("div", "segnali", "Segnalazioni (aiuto, nessuna regola):");
      var ul = el("ul");
      c.segnali.forEach(function (s) {
        var t = motivoTesto(s.motivo);
        ul.appendChild(el("li", null, t + (s.campo ? " (campo: " + s.campo + ")" : "")));
      });
      box.appendChild(ul);
      art.appendChild(box);
    }
    if (c.java) {
      art.appendChild(el("div", "java", "Carta Java: i numeri stanno nel codice (classe " + c.binding + "). " +
        "I valori qui sono quelli di bozza.json, copia di lavoro."));
    }
    c.campi.forEach(function (campo) { art.appendChild(riga(c, campo, art)); });
    var info = el("div", "blocco");
    info.appendChild(el("strong", null, "Info (sola lettura)"));
    var uli = el("ul");
    c.info.forEach(function (t) { uli.appendChild(el("li", null, t)); });
    info.appendChild(uli);
    art.appendChild(info);
    art.appendChild(blocco("Testi di flavour (tutti, con fonte)", fontiTesto(c.fonti_testo)));
    art.appendChild(blocco("Citazioni in flavour.md / identikit.md (non sono testi di flavour)",
      c.citazioni.map(function (x) { return x.testo + " [" + x.fonte + "]"; })));
    art.appendChild(blocco("Fonti per la descrizione dell'illustrazione", fontiTesto(c.illustrazione)));
    var nota = el("div", "campo");
    nota.setAttribute("data-key", "_nota");
    nota.appendChild(el("label", null, "Nota per la carta (esportata)"));
    var ta = el("textarea");
    ta.value = (stato[c.uid] && stato[c.uid].nota) || "";
    ta.addEventListener("input", function () {
      var s = stato[c.uid] || (stato[c.uid] = { campi: {}, nota: "" });
      s.nota = ta.value;
      if (!Object.keys(s.campi).length && !s.nota) delete stato[c.uid];
      salva();
      contatori();
    });
    nota.appendChild(ta);
    art.appendChild(nota);
    aggiornaCarta(c, art);
    art.setAttribute("data-uid", c.uid);
    return art;
  }

  // costruzione della pagina
  var main = document.getElementById("gruppi");
  var filtroG = document.getElementById("filtro-gruppo");
  D.gruppi.forEach(function (g) {
    var o = el("option", null, g.titolo);
    o.value = g.id;
    filtroG.appendChild(o);
    var sez = el("section", "gruppo");
    sez.setAttribute("data-gruppo", g.id);
    var testa = el("header", "testa-gruppo");
    if (g.foto && FOTO[g.foto]) {
      var img = el("img");
      img.src = FOTO[g.foto];
      img.alt = "Foto di riferimento: " + g.titolo;
      testa.appendChild(img);
    }
    testa.appendChild(el("h2", null, g.titolo + " (" + g.carte.length + " carte)"));
    sez.appendChild(testa);
    g.carte.forEach(function (c) {
      originali[c.uid] = c;
      sez.appendChild(carta(c));
    });
    main.appendChild(sez);
  });

  function applicaFiltri() {
    var gruppo = filtroG.value;
    var rar = document.getElementById("filtro-rarita").value;
    var solo = document.getElementById("filtro-segnalate").checked;
    document.querySelectorAll("article.carta").forEach(function (art) {
      var ok = (!gruppo || art.getAttribute("data-gruppo") === gruppo) &&
               (!rar || art.getAttribute("data-rarita") === rar) &&
               (!solo || art.getAttribute("data-segnalata") === "1");
      art.classList.toggle("nascosta", !ok);
    });
    document.querySelectorAll("section.gruppo").forEach(function (sez) {
      var visibili = sez.querySelectorAll("article.carta:not(.nascosta)").length;
      sez.classList.toggle("nascosta", visibili === 0);
    });
  }
  filtroG.addEventListener("change", applicaFiltri);
  document.getElementById("filtro-rarita").addEventListener("change", applicaFiltri);
  document.getElementById("filtro-segnalate").addEventListener("change", applicaFiltri);

  function esporta() {
    var carte = [];
    D.gruppi.forEach(function (g) { g.carte.forEach(function (c) {
      var s = stato[c.uid] || { campi: {}, nota: "" };
      var campi = [];
      c.campi.forEach(function (campo) {
        if (Object.prototype.hasOwnProperty.call(s.campi, campo.key) && !uguali(s.campi[campo.key], campo.prima)) {
          campi.push({ campo: campo.etichetta, chiave: campo.key, prima: campo.prima, dopo: s.campi[campo.key] });
        }
      });
      var nota = (s.nota || "").trim();
      if (campi.length || nota) {
        carte.push({ slot: c.slot, binding: c.binding, nome: c.nome, campi: campi, nota: nota });
      }
    }); });
    var doc = { versione: "sb-20a/1", carte_toccate: carte.length, carte: carte };
    var blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    var a = el("a");
    a.href = URL.createObjectURL(blob);
    a.download = "revisione-modifiche.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }
  document.getElementById("esporta").addEventListener("click", esporta);

  document.getElementById("annulla").addEventListener("click", function () {
    if (!window.confirm("Annullare tutte le modifiche salvate in questo browser?")) return;
    stato = {};
    salva();
    controlli.forEach(function (x) { x.controllo.value = String(x.campo.prima === null ? "" : x.campo.prima); });
    document.querySelectorAll("article.carta").forEach(function (art) {
      var uid = art.getAttribute("data-uid");
      var c = originali[uid];
      var ta = art.querySelector(".campo[data-key='_nota'] textarea");
      if (ta) ta.value = "";
      aggiornaCarta(c, art);
    });
    contatori();
  });

  // ripristino: applica i valori salvati ai controlli già costruiti
  controlli.forEach(function (x) {
    x.controllo.value = String(valoreAttuale(x.carta, x.campo) === null ? "" : valoreAttuale(x.carta, x.campo));
  });
  document.querySelectorAll("article.carta").forEach(function (art) {
    aggiornaCarta(originali[art.getAttribute("data-uid")], art);
  });
  contatori();
})();
</script>
</body>
</html>
"""


if __name__ == "__main__":
    main()
