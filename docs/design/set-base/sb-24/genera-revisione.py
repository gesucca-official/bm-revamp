#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera la pagina di revisione di SB-24 (nomi, flavour, illustrazioni, rarità).

Uso, dalla radice del repository:
    python docs/design/set-base/sb-24/genera-revisione.py

Legge, senza modificarli:
    docs/design/set-base/sb-24/proposta.json              proposta della Fase A
    server/src/test/resources/set-base/bozza.json         bozza in vigore (nomi, rarità, testi stampati)
    docs/design/set-base/griglia.md                       tipo e personaggio di ogni slot
    docs/design/set-base/sb-24/revisione-proprietario.json   lavoro del proprietario, incorporato

Scrive docs/design/set-base/sb-24/revisione.html: un solo file, niente rete, si apre da file://.
Esce con errore se proposta e bozza non hanno le stesse voci, se nome o rarità «attuali» della
proposta non sono più quelli della bozza, o se il file del proprietario non è leggibile.
"""

import hashlib
import importlib.util
import json
import sys
from collections import Counter
from pathlib import Path

QUI = Path(__file__).resolve().parent
ROOT = QUI.parents[3]
PROPOSTA = QUI / "proposta.json"
PROPRIETARIO = QUI / "revisione-proprietario.json"
OUT = QUI / "revisione.html"
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
GRIGLIA = ROOT / "docs/design/set-base/griglia.md"
FORMATO = "sb-24-revisione-proprietario/1"
PERCORSO_REPO = "docs/design/set-base/sb-24/revisione-proprietario.json"

RAR = {"COMMON": "C", "UNCOMMON": "NC", "RARE": "R"}
PG = {
    "bruiser.character.BigBadBruiser": "PG-SPA", "base.character.Mara": "PG-MAR",
    "junkie.character.ToxicJunkie": "PG-TOS", "base.character.Pino": "PG-PIN",
    "base.character.Gigi": "PG-GIG", "base.character.Cesira": "PG-CES", "base.character.Rocco": "PG-ROC",
}
GRUPPI = [("SPA", "Spazienzio"), ("MAR", "Mara"), ("TOS", "Celestina"), ("PIN", "Piera"), ("GIG", "Beppe"),
          ("CES", "Sergio"), ("ROC", "Duccio"), ("GEN", "Generiche"), ("OGG", "Oggetti e token")]
FOTO = {"SPA": "spazienzio", "MAR": "mara", "TOS": "celestina", "PIN": "piera", "GIG": "beppe",
        "CES": "sergio", "ROC": "duccio"}
TIPI = {"PG": "Personaggio", "BA": "Basic", "BO": "Bound", "AR": "Azione", "LR": "Last resort",
        "GEN": "Generica", "OGG": "Oggetto", "TOKEN": "Token"}
ORDINE_TIPO = ["PG", "BA", "BO", "LR", "AR", "GEN", "OGG", "TOKEN"]
SIGLE = {"[[H]]": "H", "[[A]]": "A", "[[V]]": "V", "[[T]]": "T", "[[L]]": "L"}
TESTO_TOKEN = "Token creato da «Tennents Super» (OGG-03). Equip: HIT inflitto ×1,5 e convertito in CUT, uso singolo."


def fail(msg):
    print("ERRORE: " + msg, file=sys.stderr)
    sys.exit(1)


def griglia():
    """Riusa il lettore della griglia della pagina di SB-20a."""
    p = ROOT / "docs/design/set-base/revisione/genera-pagina.py"
    spec = importlib.util.spec_from_file_location("sb20a_pagina", p)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.griglia_slot(GRIGLIA.read_text(encoding="utf-8"))


def stampato(testo):
    for k, v in SIGLE.items():
        testo = testo.replace(k, v)
    return testo


def leggi_bozza():
    b = json.loads(BOZZA.read_text(encoding="utf-8"))
    out = {}
    for c in b["characters"]:
        slot = PG.get(c["id"])
        if not slot:
            fail("personaggio senza slot: " + c["id"])
        r = c["resources"]
        valori = ["HEALTH %d" % r["HEALTH"]] + ["%s %d" % (k[0] if k != "ALCOHOL" else "L", v)
                                                for k, v in r.items() if k != "HEALTH" and v]
        out[slot] = {"nome": c["name"], "rarita": RAR[c["rarity"]],
                     "testo": "Valori iniziali: " + ", ".join(valori) + "; oggetti vicini: %d." % c["items"]}
    for c in b["cards"]:
        desc = c["gui"]["description"]
        slot, _, resto = desc.partition(" · ")
        slot = slot.strip()
        if slot in out:
            fail("slot doppio in bozza: " + slot)
        out[slot] = {"nome": c["gui"]["name"].strip(), "rarita": RAR[c["rarity"]], "testo": stampato(resto.strip())}
    out["TOKEN"] = {"nome": "BrokenBeerBottle", "rarita": "—", "testo": TESTO_TOKEN}
    return out


def tipo_di(slot):
    if slot == "TOKEN":
        return "TOKEN"
    pre, _, suf = slot.partition("-")
    if pre in ("PG", "LR", "GEN", "OGG"):
        return pre
    return suf.rstrip("0123456789")


def gruppo_di(slot, g):
    if slot == "TOKEN" or slot.startswith("OGG"):
        return "OGG"
    if slot.startswith("GEN") or slot == "LR-STR":
        return "GEN"
    pre, _, suf = slot.partition("-")
    return suf if pre in ("PG", "LR") else pre


def main():
    proposta_raw = PROPOSTA.read_bytes()
    proposta = json.loads(proposta_raw.decode("utf-8"))
    impronta = hashlib.sha256(proposta_raw.replace(b"\r\n", b"\n")).hexdigest()[:12]  # uguale su ogni PC
    bozza = leggi_bozza()
    gr = griglia()

    voci = proposta["voci"]
    slot_prop = [v["slot"] for v in voci]
    if len(set(slot_prop)) != len(slot_prop):
        fail("slot doppi nella proposta")
    if set(slot_prop) != set(bozza):
        fail("proposta e bozza non coincidono: solo proposta %s, solo bozza %s"
             % (sorted(set(slot_prop) - set(bozza)), sorted(set(bozza) - set(slot_prop))))
    divergenze = []
    for v in voci:
        b = bozza[v["slot"]]
        if v["nome_attuale"] != b["nome"]:
            divergenze.append("%s nome: proposta «%s», bozza «%s»" % (v["slot"], v["nome_attuale"], b["nome"]))
        if v["rarita_attuale"] != b["rarita"]:
            divergenze.append("%s rarità: proposta %s, bozza %s" % (v["slot"], v["rarita_attuale"], b["rarita"]))
        for campo in ("nome", "flavour", "illustrazione", "rarita", "motivo"):
            if not str(v.get(campo, "")).strip():
                divergenze.append("%s: campo proposto vuoto: %s" % (v["slot"], campo))
    if divergenze:
        fail("la bozza è cambiata rispetto alla proposta:\n  " + "\n  ".join(divergenze))
    for s in bozza:
        if s not in ("TOKEN",) and not s.startswith("PG-") and s not in gr:
            fail("slot assente dalla griglia: " + s)

    try:
        prop = json.loads(PROPRIETARIO.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        fail("file del proprietario illeggibile: %s (%s)" % (PROPRIETARIO, e))
    if prop.get("formato") != FORMATO or not isinstance(prop.get("voci"), dict):
        fail("file del proprietario con formato inatteso: " + str(prop.get("formato")))
    ignote = sorted(set(prop["voci"]) - set(slot_prop))
    if ignote:
        print("ATTENZIONE: voci del proprietario senza slot nella proposta: " + ", ".join(ignote))

    dati = []
    for v in voci:
        s = v["slot"]
        t = tipo_di(s)
        d = dict(v)
        d.update({"tipo": t, "tipoNome": TIPI[t], "gruppo": gruppo_di(s, gr), "testo": bozza[s]["testo"],
                  "ruolo": gr.get(s, {}).get("ruolo", "")})
        dati.append(d)
    ordine_g = [g for g, _ in GRUPPI]
    dati.sort(key=lambda d: (ordine_g.index(d["gruppo"]), ORDINE_TIPO.index(d["tipo"]), d["slot"]))

    conti_att = Counter(d["rarita_attuale"] for d in dati if d["slot"] != "TOKEN")
    conti_prop = Counter(d["rarita"] for d in dati if d["slot"] != "TOKEN")
    meta = {
        "incorporato": prop.get("aggiornato"),
        "proposta": impronta,
        "formato": FORMATO,
        "percorso": PERCORSO_REPO,
        "gruppi": GRUPPI,
        "foto": FOTO,
        "tipi": [[k, TIPI[k]] for k in ORDINE_TIPO],
        "contiAttuali": dict(conti_att),
        "contiProposti": dict(conti_prop),
    }

    def js(o):
        return json.dumps(o, ensure_ascii=False).replace("</", "<\\/")

    html = MODELLO.replace("/*META*/null", js(meta)).replace("/*DATI*/null", js(dati)).replace(
        "/*PROPRIETARIO*/null", js(prop))
    OUT.write_text(html, encoding="utf-8", newline="\n")
    print("Scritto %s: %d voci (%d carte del set + token), proposta %s." % (
        OUT.relative_to(ROOT).as_posix(), len(dati), len(dati) - 1, impronta))
    print("Rarità attuali: " + " / ".join("%d %s" % (conti_att[k], k) for k in ("C", "NC", "R", "P") if conti_att[k]))
    print("Rarità proposte: " + " / ".join("%d %s" % (conti_prop[k], k) for k in ("C", "NC", "R", "P") if conti_prop[k]))
    print("Lavoro del proprietario incorporato: %d voci, aggiornato %s." % (len(prop["voci"]), prop.get("aggiornato")))


MODELLO = r"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SB-24 · Revisione nomi e flavour</title>
<style>
:root{--bg:#f6f1e7;--card:#fffdf8;--ink:#2a2420;--muted:#76695e;--line:#d9cdbb;--accent:#7a2e2e;--accent2:#2f5d62;
--ok:#2e6b3a;--okbg:#e3f1e2;--warn:#8a5a00;--warnbg:#fff1cc;--edit:#fff7d6;--danger:#9b1c1c}
@media (prefers-color-scheme: dark){:root{--bg:#1c1916;--card:#26221e;--ink:#eee6da;--muted:#a89a8a;--line:#3d362f;
--accent:#d58b8b;--accent2:#8cc3c9;--ok:#8fd19b;--okbg:#1f3323;--warn:#f0c062;--warnbg:#3a2f12;--edit:#3a3420;--danger:#f08080}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.45 system-ui,Segoe UI,Roboto,sans-serif}
header{position:sticky;top:0;z-index:5;background:var(--card);border-bottom:1px solid var(--line);padding:10px 16px}
h1{font-size:18px;margin:0 0 6px}
.riga{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
button,select,input[type=search]{font:inherit;padding:5px 10px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}
button{cursor:pointer}button:hover{border-color:var(--accent2)}
button.primario{background:var(--accent2);color:#fff;border-color:var(--accent2)}
.stato{font-size:13px;color:var(--muted)}
.sporco{background:var(--warnbg);color:var(--warn);padding:3px 8px;border-radius:6px;font-weight:600}
.pulito{background:var(--okbg);color:var(--ok);padding:3px 8px;border-radius:6px}
main{max-width:1200px;margin:0 auto;padding:12px 16px 80px}
.avviso{border:1px solid var(--line);background:var(--card);border-radius:8px;padding:10px 14px;margin:10px 0}
.avviso.forte{border-color:var(--warn);background:var(--warnbg)}
.promemoria{position:fixed;right:16px;bottom:16px;max-width:560px;width:calc(100% - 32px);z-index:10;background:var(--card);
border:2px solid var(--accent);border-radius:10px;padding:12px 14px;box-shadow:0 6px 24px rgba(0,0,0,.25)}
.promemoria pre{margin:4px 0;padding:6px 8px;background:var(--bg);border-radius:6px;overflow-x:auto;font-size:13px;display:flex;justify-content:space-between;gap:8px;align-items:center}
.promemoria pre code{white-space:pre}
h2{font-size:17px;margin:22px 0 8px;display:flex;gap:10px;align-items:center}
h2 img{width:48px;height:48px;object-fit:cover;border-radius:50%;border:1px solid var(--line)}
.voce{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:10px 0;padding:10px 14px}
.voce.ok{border-left:6px solid var(--ok)}.voce.rivedere{border-left:6px solid var(--warn)}
.testa{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}
.slot{font-weight:700;font-family:ui-monospace,Consolas,monospace}
.etichetta{font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:10px;padding:0 7px}
.stampato{font-size:13px;color:var(--muted);margin:6px 0;padding:6px 8px;background:var(--bg);border-radius:6px}
table{width:100%;border-collapse:collapse;margin-top:6px}
th{text-align:left;font-size:12px;color:var(--muted);font-weight:600;width:110px;vertical-align:top;padding:6px 6px 6px 0}
td{vertical-align:top;padding:4px 6px}
td.att{width:38%;color:var(--muted);font-size:14px}
td.att .vuoto{font-style:italic;opacity:.7}
.fonte{font-size:11px;color:var(--muted);display:block}
input.campo,textarea.campo,select.campo{width:100%;font:inherit;padding:5px 7px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink)}
textarea.campo{min-height:44px;resize:vertical}
.cambiato{background:var(--edit)!important;border-color:var(--warn)!important}
.conta{font-size:11px;color:var(--muted)}
.motivo{font-size:13px;margin-top:6px}
.piede{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.piede textarea{flex:1 1 300px}
button.segno.attivo.ok{background:var(--ok);color:#fff;border-color:var(--ok)}
button.segno.attivo.rivedere{background:var(--warn);color:#fff;border-color:var(--warn)}
details{margin-top:8px}summary{cursor:pointer;color:var(--accent2)}
@media (max-width:760px){td.att{width:auto;display:block}tr{display:block}th{display:block;width:auto}td{display:block}}
</style>
</head>
<body>
<header>
  <h1>SB-24 · Revisione di nomi, flavour, illustrazioni e rarità</h1>
  <div class="riga">
    <button class="primario" id="bSalva" title="Scrive revisione-proprietario.json nella cartella del repository">Salva</button>
    <button id="bApri" title="Carica revisione-proprietario.json dal repository">Apri</button>
    <button id="bEsporta" title="Scarica il JSON, da salvare sopra quello del repository">Esporta</button>
    <span id="indicatore"></span>
    <span class="stato" id="fileStato"></span>
  </div>
  <div class="riga" style="margin-top:6px">
    <select id="fGruppo"></select>
    <select id="fTipo"></select>
    <select id="fSegno">
      <option value="">Tutti i segni</option><option value="nessuno">Senza segno</option>
      <option value="ok">Ok</option><option value="rivedere">Da rivedere</option>
      <option value="modificate">Modificate da me</option><option value="nota">Con nota</option>
      <option value="cambia">Con nome nuovo proposto</option>
    </select>
    <input type="search" id="fTesto" placeholder="Cerca nome, slot, testo…">
    <span class="stato" id="progresso"></span>
  </div>
</header>
<main>
  <div class="avviso" id="aiuto">
    <b>Come si usa.</b> Per ogni voce a sinistra c'è il valore attuale, a destra la proposta: cambia quello che non ti piace,
    scrivi una nota, segna <b>Ok</b> o <b>Da rivedere</b>. Il testo stampato è solo contesto (lo rifà SB-25).
    <b>Salva</b> (Chrome o Edge) scrive il file <code id="percorso1"></code>: la prima volta scegli quel file nella cartella del
    repository, poi la pagina lo ricorda. Con altri browser usa <b>Esporta</b> e salva il file scaricato sopra quello del repository.
    Su un altro PC, dopo <code>git pull</code>, apri la pagina e premi <b>Apri</b> sullo stesso file (oppure rigenera la pagina:
    <code>python docs/design/set-base/sb-24/genera-revisione.py</code>). Le modifiche non salvate restano anche nel browser, come rete di sicurezza.
    <div id="conti" class="stato" style="margin-top:6px"></div>
  </div>
  <div id="avvisi"></div>
  <div id="lista"></div>
</main>
<div class="promemoria" id="promemoria" hidden></div>
<input type="file" id="inputFile" accept=".json,application/json" hidden>
<script>
"use strict";
const META = /*META*/null;
const DATI = /*DATI*/null;
const INCORPORATO = /*PROPRIETARIO*/null;
const CHIAVE_LS = "bm-sb24-revisione";
const CAMPI = ["nome", "flavour", "illustrazione", "rarita"];
const PER_SLOT = Object.fromEntries(DATI.map(d => [d.slot, d]));
let lavoro = normalizza(INCORPORATO);
let sporco = false;
let toccate = new Set();  // voci cambiate qui dopo l'ultimo salvataggio o caricamento
let maniglia = null;          // FileSystemFileHandle del file nel repository
let manigliaRicordata = null; // dalla sessione precedente, va riconfermata con un clic

function $(id) { return document.getElementById(id); }
function adesso() { return new Date().toISOString(); }
function esc(s) { return String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

function normalizza(o) {
  const out = {formato: META.formato, proposta: META.proposta, aggiornato: null, voci: {}};
  if (o && typeof o === "object") {
    if (o.formato && o.formato !== META.formato) throw new Error("formato inatteso: " + o.formato);
    out.aggiornato = o.aggiornato || null;
    if (o.proposta) out.propostaFile = o.proposta;
    for (const [slot, v] of Object.entries(o.voci || {})) if (v && typeof v === "object") out.voci[slot] = {...v};
  }
  return out;
}

// Unisce due lavori voce per voce: vince la voce aggiornata più di recente.
function unisci(a, b) {
  const out = normalizza(a);
  let prese = 0;
  for (const [slot, v] of Object.entries(b.voci)) {
    const mia = out.voci[slot];
    if (!mia || (v.aggiornato || "") > (mia.aggiornato || "")) { out.voci[slot] = {...v}; prese++; }
  }
  out.aggiornato = [a.aggiornato, b.aggiornato].filter(Boolean).sort().pop() || null;
  return {lavoro: out, prese};
}

function salvaLocale() {
  try { localStorage.setItem(CHIAVE_LS, JSON.stringify({sporco, toccate: [...toccate], lavoro})); } catch (e) { /* solo rete di sicurezza */ }
}
function leggiLocale() {
  try { const t = localStorage.getItem(CHIAVE_LS); return t ? JSON.parse(t) : null; } catch (e) { return null; }
}

function valore(slot, campo) {
  const v = lavoro.voci[slot];
  return v && campo in v ? v[campo] : (campo === "nota" || campo === "stato" ? "" : PER_SLOT[slot][campo]);
}
function modificate(slot) {
  const v = lavoro.voci[slot] || {};
  return CAMPI.filter(c => c in v);
}

function imposta(slot, campo, val) {
  const v = lavoro.voci[slot] || (lavoro.voci[slot] = {});
  if (CAMPI.includes(campo)) {
    if (val === PER_SLOT[slot][campo]) delete v[campo]; else v[campo] = val;
  } else {
    if (val) v[campo] = val; else delete v[campo];
  }
  v.aggiornato = adesso();
  lavoro.aggiornato = v.aggiornato;
  toccate.add(slot);
  segnaSporco(true);
}

function segnaSporco(s) {
  sporco = s;
  if (!s) toccate.clear();
  salvaLocale();
  const i = $("indicatore");
  i.className = s ? "sporco" : "pulito";
  i.textContent = s ? "● Modifiche non salvate nel file" : "Tutto salvato nel file";
  aggiornaProgresso();
}

function testoFile() {
  const out = {formato: META.formato, proposta: META.proposta, aggiornato: lavoro.aggiornato || adesso(), voci: {}};
  for (const slot of Object.keys(lavoro.voci).sort()) {
    const v = lavoro.voci[slot];
    const pulita = {};
    for (const k of [...CAMPI, "nota", "stato", "aggiornato"]) if (k in v && v[k] !== "") pulita[k] = v[k];
    if (Object.keys(pulita).length) out.voci[slot] = pulita;
  }
  return JSON.stringify(out, null, 1) + "\n";
}

// ---- File: Salva, Apri, Esporta
const IDB = {
  apri() { return new Promise((ok, ko) => { const r = indexedDB.open("bm-sb24", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("maniglie"); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); }); },
  async metti(v) { const db = await this.apri(); return new Promise((ok, ko) => { const t = db.transaction("maniglie", "readwrite");
    t.objectStore("maniglie").put(v, "file"); t.oncomplete = ok; t.onerror = () => ko(t.error); }); },
  async prendi() { const db = await this.apri(); return new Promise((ok, ko) => { const r = db.transaction("maniglie").objectStore("maniglie").get("file");
    r.onsuccess = () => ok(r.result || null); r.onerror = () => ko(r.error); }); },
};
async function ricorda(m) { maniglia = m; manigliaRicordata = null; try { await IDB.metti(m); } catch (e) {} mostraFile(); }
function mostraFile() {
  const s = $("fileStato");
  if (maniglia) s.textContent = "File collegato: " + maniglia.name;
  else if (manigliaRicordata) s.innerHTML = 'File della volta scorsa: ' + esc(manigliaRicordata.name) + ' <button id="bRicollega">Ricollega e ricarica</button>';
  else s.textContent = "Nessun file collegato" + (window.showSaveFilePicker ? "" : " (questo browser non scrive file: usa Esporta)");
  const b = $("bRicollega"); if (b) b.onclick = ricollega;
}
async function permesso(m) {
  const opz = {mode: "readwrite"};
  if ((await m.queryPermission(opz)) === "granted") return true;
  return (await m.requestPermission(opz)) === "granted";
}
async function caricaTesto(testo, origine) {
  const daFile = normalizza(JSON.parse(testo));
  // Il file vince; se qui ci sono modifiche non salvate, restano quelle più recenti del file.
  const nelFile = Object.keys(daFile.voci).length;
  const tenute = [...toccate].filter(s => lavoro.voci[s] && (lavoro.voci[s].aggiornato || "") > (daFile.voci[s]?.aggiornato || ""));
  for (const s of tenute) daFile.voci[s] = {...lavoro.voci[s]};
  lavoro = daFile;
  toccate = new Set(tenute);
  const qui = tenute.length;
  avvisoProposta(daFile);
  disegna();
  segnaSporco(qui > 0);
  avviso(`Caricato ${origine}: ${nelFile} voci nel file` + (qui ? `; restano ${qui} voci cambiate qui e non ancora salvate (premi Salva)` : "") + ".");
}
async function ricollega() {
  try {
    if (!(await permesso(manigliaRicordata))) return;
    const m = manigliaRicordata; await ricorda(m);
    await caricaTesto(await (await m.getFile()).text(), "dal file " + m.name);
  } catch (e) { avviso("Non riesco a ricollegare il file: " + e.message, true); }
}
async function apri() {
  if (window.showOpenFilePicker) {
    try {
      const [m] = await showOpenFilePicker({types: [{description: "JSON", accept: {"application/json": [".json"]}}], id: "bm-sb24"});
      await caricaTesto(await (await m.getFile()).text(), "dal file " + m.name);
      await ricorda(m);
    } catch (e) { if (e.name !== "AbortError") avviso("Apertura non riuscita: " + e.message, true); }
  } else $("inputFile").click();
}
async function salva() {
  if (!window.showSaveFilePicker) return esporta();
  try {
    if (!maniglia && manigliaRicordata && (await permesso(manigliaRicordata))) await ricorda(manigliaRicordata);
    if (!maniglia) {
      const m = await showSaveFilePicker({suggestedName: "revisione-proprietario.json", id: "bm-sb24",
        types: [{description: "JSON", accept: {"application/json": [".json"]}}]});
      await ricorda(m);
    }
    if (!(await permesso(maniglia))) throw new Error("permesso di scrittura negato");
    lavoro.aggiornato = lavoro.aggiornato || adesso();
    const w = await maniglia.createWritable();
    await w.write(testoFile()); await w.close();
    segnaSporco(false);
    promemoria("salvato");
  } catch (e) { if (e.name !== "AbortError") avviso("Salvataggio non riuscito: " + e.message + ". Prova con Esporta.", true); }
}
function esporta() {
  const blob = new Blob([testoFile()], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "revisione-proprietario.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  segnaSporco(false);
  promemoria("esportato");
}

function promemoria(come) {
  const p = $("promemoria");
  const cmd = [`git add ${META.percorso}`, `git commit -m "SB-24: owner review"`, `git push`];
  p.innerHTML = `<b>${come === "salvato" ? "Salvato nel file." : "File scaricato."} Ricordati di committarlo e pusharlo.</b>` +
    (come === "esportato" ? `<div class="stato">Prima sposta il file scaricato sopra <code>${esc(META.percorso)}</code> nel repository.</div>` : "") +
    `<div class="stato">Dalla radice del repository:</div>` +
    cmd.map(c => `<pre><code>${esc(c)}</code><button data-c="${esc(c)}">Copia</button></pre>`).join("") +
    `<div class="riga"><button data-c="${esc(cmd.join("\n"))}">Copia tutto</button><button id="bChiudiProm">Fatto, chiudi</button></div>`;
  p.hidden = false;
  p.querySelectorAll("button[data-c]").forEach(b => b.onclick = async () => {
    try { await navigator.clipboard.writeText(b.dataset.c); b.textContent = "Copiato"; }
    catch (e) { b.textContent = "Seleziona e copia a mano"; }
  });
  $("bChiudiProm").onclick = () => { p.hidden = true; };
}

function avviso(testo, forte) {
  const d = document.createElement("div");
  d.className = "avviso" + (forte ? " forte" : "");
  d.innerHTML = esc(testo) + ' <button>×</button>';
  d.querySelector("button").onclick = () => d.remove();
  $("avvisi").prepend(d);
}
function avvisoProposta(f) {
  if (f.propostaFile && f.propostaFile !== META.proposta)
    avviso(`Il file del proprietario è stato salvato su un'altra versione della proposta (${f.propostaFile}, ora ${META.proposta}): controlla le voci segnate.`, true);
}

// ---- Disegno
function opzioni(sel, voci, tutte) {
  sel.innerHTML = `<option value="">${tutte}</option>` + voci.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join("");
}
function campoAtt(testo, fonte) {
  return (testo ? esc(testo) : '<span class="vuoto">nessuna fonte</span>') + (fonte ? `<span class="fonte">${esc(fonte)}</span>` : "");
}
function rigaCampo(d, campo, titolo, area) {
  const val = valore(d.slot, campo);
  const cl = "campo" + (modificate(d.slot).includes(campo) ? " cambiato" : "");
  let input;
  if (campo === "rarita") {
    input = `<select class="${cl}" data-slot="${d.slot}" data-campo="${campo}">` +
      ["C", "NC", "R", "P", "—"].map(r => `<option${r === val ? " selected" : ""}>${r}</option>`).join("") + "</select>";
  } else if (area) {
    input = `<textarea class="${cl}" data-slot="${d.slot}" data-campo="${campo}" rows="2">${esc(val)}</textarea>`;
  } else {
    input = `<input class="${cl}" data-slot="${d.slot}" data-campo="${campo}" value="${esc(val)}">`;
  }
  const att = d[campo + "_attuale"];
  const proposto = val !== d[campo] ? `<span class="fonte">Proposta: ${esc(d[campo])}</span>` : "";
  const conta = campo === "flavour" ? `<span class="conta" data-conta="${d.slot}">${val.length} caratteri</span>` : "";
  return `<tr><th>${titolo}</th><td class="att">${campoAtt(att, d["fonte_" + campo + "_attuale"])}</td><td>${input}${proposto}${conta}</td></tr>`;
}
function voceHtml(d) {
  const st = valore(d.slot, "stato");
  const nomeCambia = d.nome !== d.nome_attuale ? '<span class="etichetta">nome nuovo proposto</span>' : "";
  return `<div class="voce ${st}" id="v-${d.slot}" data-slot="${d.slot}">
  <div class="testa"><div><span class="slot">${d.slot}</span> · <b>${esc(valore(d.slot, "nome"))}</b>
   <span class="etichetta">${esc(d.tipoNome)}</span>${d.ruolo ? `<span class="etichetta">${esc(d.ruolo)}</span>` : ""}${nomeCambia}</div>
   <div class="riga"><button class="segno ok${st === "ok" ? " attivo" : ""}" data-segno="ok">Ok</button>
   <button class="segno rivedere${st === "rivedere" ? " attivo" : ""}" data-segno="rivedere">Da rivedere</button>
   <button class="ripristina" title="Torna alla proposta su nome, flavour, illustrazione e rarità">↺ Proposta</button></div></div>
  <div class="stampato"><b>Testo stampato (sola lettura, SB-25):</b> ${esc(d.testo)}</div>
  <table><tr><th></th><th>Attuale</th><th>Proposta (modificabile)</th></tr>
  ${rigaCampo(d, "nome", "Nome")}
  ${rigaCampo(d, "flavour", "Flavour", true)}
  ${rigaCampo(d, "illustrazione", "Illustrazione", true)}
  ${rigaCampo(d, "rarita", "Rarità")}</table>
  <div class="motivo"><b>Perché:</b> ${esc(d.motivo)}</div>
  <div class="piede"><textarea class="campo" data-slot="${d.slot}" data-campo="nota" rows="1" placeholder="Nota libera">${esc(valore(d.slot, "nota"))}</textarea></div>
 </div>`;
}
function filtra(d) {
  const g = $("fGruppo").value, t = $("fTipo").value, s = $("fSegno").value, q = $("fTesto").value.trim().toLowerCase();
  if (g && d.gruppo !== g) return false;
  if (t && d.tipo !== t) return false;
  const st = valore(d.slot, "stato");
  if (s === "nessuno" && st) return false;
  if ((s === "ok" || s === "rivedere") && st !== s) return false;
  if (s === "modificate" && !modificate(d.slot).length) return false;
  if (s === "nota" && !valore(d.slot, "nota")) return false;
  if (s === "cambia" && d.nome === d.nome_attuale) return false;
  if (q) {
    const pag = [d.slot, d.nome_attuale, valore(d.slot, "nome"), valore(d.slot, "flavour"), d.testo, valore(d.slot, "nota")].join(" ").toLowerCase();
    if (!pag.includes(q)) return false;
  }
  return true;
}
function disegna() {
  const parti = [];
  for (const [g, nome] of META.gruppi) {
    const voci = DATI.filter(d => d.gruppo === g && filtra(d));
    if (!voci.length) continue;
    const foto = META.foto[g] ? `<img src="../identikit/riferimenti/${META.foto[g]}.png" alt="" loading="lazy" onerror="this.remove()">` : "";
    parti.push(`<h2>${foto}${esc(nome)} <span class="stato">${voci.length}</span></h2>` + voci.map(voceHtml).join(""));
  }
  $("lista").innerHTML = parti.join("") || '<div class="avviso">Nessuna voce con questi filtri.</div>';
  aggiornaProgresso();
}
function aggiornaProgresso() {
  let ok = 0, riv = 0, mod = 0, note = 0;
  for (const d of DATI) {
    const st = valore(d.slot, "stato");
    if (st === "ok") ok++; else if (st === "rivedere") riv++;
    if (modificate(d.slot).length) mod++;
    if (valore(d.slot, "nota")) note++;
  }
  $("progresso").textContent = `Segnate ${ok + riv}/${DATI.length} (ok ${ok}, da rivedere ${riv}) · modificate ${mod} · con nota ${note}`;
}
function conti(o) { return ["C", "NC", "R", "P"].filter(k => o[k]).map(k => `${o[k]} ${k}`).join(" / "); }

// ---- Eventi
$("lista").addEventListener("input", e => {
  const el = e.target; const slot = el.dataset.slot, campo = el.dataset.campo;
  if (!slot || !campo) return;
  imposta(slot, campo, el.value);
  if (CAMPI.includes(campo)) el.classList.toggle("cambiato", modificate(slot).includes(campo));
  if (campo === "flavour") { const c = document.querySelector(`[data-conta="${slot}"]`); if (c) c.textContent = el.value.length + " caratteri"; }
});
$("lista").addEventListener("change", e => {
  if (e.target.dataset.campo === "rarita") e.target.classList.toggle("cambiato", modificate(e.target.dataset.slot).includes("rarita"));
});
$("lista").addEventListener("click", e => {
  const box = e.target.closest(".voce"); if (!box) return;
  const slot = box.dataset.slot;
  if (e.target.dataset.segno) {
    const nuovo = valore(slot, "stato") === e.target.dataset.segno ? "" : e.target.dataset.segno;
    imposta(slot, "stato", nuovo);
    box.outerHTML = voceHtml(PER_SLOT[slot]);
  } else if (e.target.classList.contains("ripristina")) {
    if (!modificate(slot).length) return;
    if (!confirm("Riportare " + slot + " alla proposta? Nota e segno restano.")) return;
    const v = lavoro.voci[slot]; for (const c of CAMPI) delete v[c];
    v.aggiornato = adesso(); lavoro.aggiornato = v.aggiornato; toccate.add(slot); segnaSporco(true);
    box.outerHTML = voceHtml(PER_SLOT[slot]);
  }
});
for (const id of ["fGruppo", "fTipo", "fSegno"]) $(id).addEventListener("change", disegna);
$("fTesto").addEventListener("input", disegna);
$("bSalva").onclick = salva;
$("bApri").onclick = apri;
$("bEsporta").onclick = esporta;
$("inputFile").onchange = async e => {
  const f = e.target.files[0]; if (!f) return;
  try { await caricaTesto(await f.text(), "da " + f.name); } catch (err) { avviso("File non valido: " + err.message, true); }
  e.target.value = "";
};
window.addEventListener("beforeunload", e => { if (sporco) { e.preventDefault(); e.returnValue = ""; } });
document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); salva(); } });

// ---- Avvio
opzioni($("fGruppo"), META.gruppi, "Tutti i personaggi e i gruppi");
opzioni($("fTipo"), META.tipi, "Tutti i tipi");
$("percorso1").textContent = META.percorso;
$("conti").textContent = `Voci: ${DATI.length} (7 personaggi, ${DATI.length - 8} carte, 1 token) · rarità attuali ${conti(META.contiAttuali)} · proposte ${conti(META.contiProposti)} · proposta ${META.proposta} · lavoro incorporato alla generazione: ${META.incorporato || "nessuno"}`;
avvisoProposta(lavoro);
const locale = leggiLocale();
if (locale && locale.lavoro && locale.sporco) {
  try {
    const {lavoro: unito, prese} = unisci(lavoro, normalizza(locale.lavoro));
    if (prese) { lavoro = unito; sporco = true; toccate = new Set(locale.toccate || []); avviso(`Ritrovate nel browser ${prese} voci modificate e non salvate nel file: le ho ripristinate. Premi Salva.`, true); }
  } catch (e) { /* copia locale illeggibile: si ignora */ }
}
disegna();
segnaSporco(sporco);
mostraFile();
if (window.indexedDB && window.showSaveFilePicker) IDB.prendi().then(m => { if (m && !maniglia) { manigliaRicordata = m; mostraFile(); } }).catch(() => {});
window.__sb24 = {testoFile, caricaTesto, get lavoro() { return lavoro; }, get sporco() { return sporco; }};
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
