#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera la pagina di revisione di SB-25 Fase A (glossario e campione dei testi per i giocatori).

Uso, dalla radice del repository:
    python -X utf8 docs/design/set-base/sb-25/genera-revisione.py

Legge, senza modificarli:
    docs/design/set-base/sb-25/glossario.json            glossario proposto
    docs/design/set-base/sb-25/campione.json             voci del campione, motivi e note di precisione
    docs/design/set-base/sb-25/frasi.py                  prototipo delle frasi (legge la bozza e il generatore di oggi)
    docs/design/set-base/sb-25/simboli.json              simboli del client in SVG (da simboli.mjs)
    docs/design/set-base/sb-25-fase-a.md                 piano della Fase B e domande, mostrati nella pagina
    docs/design/set-base/sb-25/revisione-proprietario.json   lavoro del proprietario, incorporato

Scrive docs/design/set-base/sb-25/revisione.html: un solo file, niente rete, si apre da file://.
Esce con errore se un segnaposto non ha simbolo, se una voce del campione manca dalla bozza o se il file del proprietario
non è leggibile.
"""
import hashlib
import html
import importlib.util
import json
import re
import sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
ROOT = QUI.parents[3]
OUT = QUI / "revisione.html"
PROPRIETARIO = QUI / "revisione-proprietario.json"
PROPOSTA_MD = QUI.parent / "sb-25-fase-a.md"
FORMATO = "sb-25-revisione-proprietario/1"
PERCORSO_REPO = "docs/design/set-base/sb-25/revisione-proprietario.json"
SEGNAPOSTO = re.compile(r"\[\[([A-Z]+)\]\]")


def fail(msg):
    print("ERRORE: " + msg, file=sys.stderr)
    sys.exit(1)


def carica_frasi():
    spec = importlib.util.spec_from_file_location("sb25_frasi", QUI / "frasi.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def sezione_md(testo, titolo):
    """Il corpo di una sezione «## titolo» del documento della proposta."""
    m = re.search(r"^## " + re.escape(titolo) + r"\s*$(.*?)(?=^## |\Z)", testo, re.M | re.S)
    if not m:
        fail(f"sezione «{titolo}» assente da {PROPOSTA_MD.name}")
    return m.group(1).strip()


def md_html(testo):
    """Il poco di Markdown che usa la proposta: paragrafi, elenchi, grassetto, codice, link (resi come testo)."""
    def riga(s):
        s = html.escape(s, quote=False)
        s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
        s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
        s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
        return s
    out, lista, para = [], None, []

    def chiudi():
        nonlocal lista, para
        if para:
            out.append("<p>" + riga(" ".join(para)) + "</p>")
            para = []
        if lista:
            out.append(f"</{lista}>")
            lista = None
    for linea in testo.splitlines():
        s = linea.strip()
        m = re.match(r"^(?:(\d+)\.|[-*])\s+(.*)$", s)
        if not s:
            chiudi()
        elif s.startswith("### "):
            chiudi()
            out.append("<h3>" + riga(s[4:]) + "</h3>")
        elif m and not linea.startswith("   "):
            tipo = "ol" if m.group(1) else "ul"
            if para:
                out.append("<p>" + riga(" ".join(para)) + "</p>")
                para = []
            if lista != tipo:
                if lista:
                    out.append(f"</{lista}>")
                out.append(f"<{tipo}>")
                lista = tipo
            out.append("<li>" + riga(m.group(2)) + "</li>")
        elif lista and out and out[-1].startswith("<li>"):
            out[-1] = out[-1][:-5] + " " + riga(s) + "</li>"
        else:
            para.append(s)
    chiudi()
    return "\n".join(out)


def domande(testo):
    """Le domande numerate della proposta: «1. **Titolo.** testo» (con righe di continuazione rientrate)."""
    voci = []
    for linea in testo.splitlines():
        m = re.match(r"^(\d+)\.\s+(.*)$", linea)
        if m:
            voci.append({"id": "D" + m.group(1), "testo": m.group(2).strip()})
        elif voci and linea.startswith("   ") and linea.strip():
            voci[-1]["testo"] += " " + linea.strip()
    if not voci or len(voci) > 5:
        fail(f"attese da 1 a 5 domande, trovate {len(voci)}")
    for v in voci:
        m = re.match(r"\*\*(.+?)\*\*\s*(.*)$", v["testo"])
        v["titolo"], v["testo"] = (m.group(1), m.group(2)) if m else ("", v["testo"])
        v["testo"] = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", v["testo"]).replace("`", "")
    return voci


def main():
    frasi = carica_frasi()
    voci_bozza = frasi.tutte()
    simboli = json.loads((QUI / "simboli.json").read_text(encoding="utf-8"))
    glossario = json.loads((QUI / "glossario.json").read_text(encoding="utf-8"))["voci"]
    campione = json.loads((QUI / "campione.json").read_text(encoding="utf-8"))["voci"]
    md = PROPOSTA_MD.read_text(encoding="utf-8")

    dati = []
    for g in glossario:
        dati.append({"id": g["id"], "sezione": "glossario", "gruppo": g["gruppo"], "titolo": g["voce"], "oggi": g["oggi"],
                     "proposta": g["proposta"], "perche": g["perche"]})
    for c in campione:
        v = voci_bozza.get(c["slot"])
        if not v:
            fail("voce del campione assente dalla bozza: " + c["slot"])
        dati.append({"id": c["slot"], "sezione": "campione", "gruppo": "Campione", "titolo": v["nome"], "oggi": v["oggi"],
                     "proposta": v["proposto"], "perche": c["perche"], "sottile": c["sottile"], "flavour": v["flavour"]})
    ids = [d["id"] for d in dati]
    if len(set(ids)) != len(ids):
        fail("voci doppie: " + ", ".join(sorted({i for i in ids if ids.count(i) > 1})))
    usati = {m for d in dati for k in ("oggi", "proposta", "sottile") for m in SEGNAPOSTO.findall(d.get(k, ""))}
    ignoti = sorted(u for u in usati if f"[[{u}]]" not in simboli)
    if ignoti:
        fail("segnaposto senza simbolo: " + ", ".join(ignoti))

    dom = domande(sezione_md(md, "Domande"))
    piano = md_html(sezione_md(md, "Piano della Fase B"))

    # Impronta di ciò che il proprietario rivede: se cambia, la pagina avvisa chi aveva salvato su quella vecchia.
    base = json.dumps([[d["id"], d["proposta"]] for d in dati] + [[q["id"], q["testo"]] for q in dom], ensure_ascii=False)
    impronta = hashlib.sha256(base.encode("utf-8")).hexdigest()[:12]

    try:
        prop = json.loads(PROPRIETARIO.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        fail("file del proprietario illeggibile: %s (%s)" % (PROPRIETARIO, e))
    if prop.get("formato") != FORMATO or not isinstance(prop.get("voci"), dict):
        fail("file del proprietario con formato inatteso: " + str(prop.get("formato")))
    ignote = sorted(set(prop["voci"]) - set(ids) - {q["id"] for q in dom})
    if ignote:
        print("ATTENZIONE: voci del proprietario che la pagina non ha: " + ", ".join(ignote))

    meta = {"incorporato": prop.get("aggiornato"), "proposta": impronta, "formato": FORMATO, "percorso": PERCORSO_REPO,
            "simboli": {k: {"nome": v["nome"], "svg": v["svg"]} for k, v in simboli.items()},
            "gruppi": list(dict.fromkeys(d["gruppo"] for d in dati if d["sezione"] == "glossario"))}

    def js(o):
        return json.dumps(o, ensure_ascii=False).replace("</", "<\\/")

    pagina = (MODELLO.replace("/*META*/null", js(meta)).replace("/*DATI*/null", js(dati))
              .replace("/*DOMANDE*/null", js(dom)).replace("/*PROPRIETARIO*/null", js(prop))
              .replace("<!--PIANO-->", piano))
    OUT.write_text(pagina, encoding="utf-8", newline="\n")
    print("Scritto %s: %d voci del glossario, %d del campione, %d domande; proposta %s." % (
        OUT.relative_to(ROOT).as_posix(), len(glossario), len(campione), len(dom), impronta))
    print("Lavoro del proprietario incorporato: %d voci, aggiornato %s." % (len(prop["voci"]), prop.get("aggiornato")))


MODELLO = r"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SB-25 · Testi delle carte</title>
<style>
:root{--bg:#f6f1e7;--card:#fffdf8;--ink:#2a2420;--muted:#76695e;--line:#d9cdbb;--accent:#7a2e2e;--accent2:#2f5d62;
--ok:#2e6b3a;--okbg:#e3f1e2;--warn:#8a5a00;--warnbg:#fff1cc;--edit:#fff7d6;--paper:#f3ead2}
@media (prefers-color-scheme: dark){:root{--bg:#1c1916;--card:#26221e;--ink:#eee6da;--muted:#a89a8a;--line:#3d362f;
--accent:#d58b8b;--accent2:#8cc3c9;--ok:#8fd19b;--okbg:#1f3323;--warn:#f0c062;--warnbg:#3a2f12;--edit:#3a3420}}
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
h2{font-size:19px;margin:26px 0 8px}
h3{font-size:16px;margin:18px 0 6px;color:var(--accent2)}
.voce{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:10px 0;padding:10px 14px}
.voce.ok{border-left:6px solid var(--ok)}.voce.rivedere{border-left:6px solid var(--warn)}
.testa{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}
.sigla{font-weight:700;font-family:ui-monospace,Consolas,monospace}
.etichetta{font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:10px;padding:0 7px}
table{width:100%;border-collapse:collapse;margin-top:6px}
th{text-align:left;font-size:12px;color:var(--muted);font-weight:600;width:130px;vertical-align:top;padding:6px 6px 6px 0}
td{vertical-align:top;padding:4px 6px}
.oggi{color:var(--muted)}
.testo-carta{background:var(--paper);color:#2a2420;border-radius:6px;padding:6px 9px;display:inline-block;max-width:100%}
.sim{display:inline-block;width:1.05em;height:1.05em;vertical-align:-0.17em;margin:0 .06em}
.sim svg{width:100%;height:100%;display:block}
.tieni{white-space:nowrap}
.ignoto{color:#b00;font-weight:700}
textarea.campo{width:100%;font:inherit;padding:5px 7px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);min-height:44px;resize:vertical}
textarea.mono{font-family:ui-monospace,Consolas,monospace;font-size:13px}
.cambiato{background:var(--edit)!important;border-color:var(--warn)!important}
.conta{font-size:11px;color:var(--muted)}
.nota-voce{font-size:13px;margin-top:6px}
.piede{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.piede textarea{flex:1 1 300px}
button.segno.attivo.ok{background:var(--ok);color:#fff;border-color:var(--ok)}
button.segno.attivo.rivedere{background:var(--warn);color:#fff;border-color:var(--warn)}
.legenda{display:flex;flex-wrap:wrap;gap:6px 18px}
.legenda code{font-size:13px}
.piano{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:4px 16px}
.flavour{font-style:italic;color:var(--muted);font-size:13px}
@media (max-width:760px){tr{display:block}th{display:block;width:auto}td{display:block}}
</style>
</head>
<body>
<header>
  <h1>SB-25 · Testi delle carte: glossario e campione</h1>
  <div class="riga">
    <button class="primario" id="bSalva" title="Scrive revisione-proprietario.json nella cartella del repository">Salva</button>
    <button id="bApri" title="Carica revisione-proprietario.json dal repository">Apri</button>
    <button id="bEsporta" title="Scarica il JSON, da salvare sopra quello del repository">Esporta</button>
    <span id="indicatore"></span>
    <span class="stato" id="fileStato"></span>
  </div>
  <div class="riga" style="margin-top:6px">
    <select id="fSezione"><option value="">Tutto</option><option value="glossario">Glossario</option><option value="campione">Campione</option><option value="domande">Domande</option></select>
    <select id="fSegno">
      <option value="">Tutti i segni</option><option value="nessuno">Senza segno</option>
      <option value="ok">Ok</option><option value="rivedere">Da rivedere</option>
      <option value="modificate">Corrette da me</option><option value="nota">Con nota</option>
    </select>
    <input type="search" id="fTesto" placeholder="Cerca…">
    <span class="stato" id="progresso"></span>
  </div>
</header>
<main>
  <div class="avviso">
    <b>Come si usa.</b> Per ogni voce trovi il testo di oggi e quello proposto, già coi simboli come li disegna il client.
    Se una frase non ti piace correggila nel riquadro (i simboli si scrivono come segnaposto, vedi la legenda: sotto vedi
    come viene), scrivi una nota e segna <b>Ok</b> o <b>Da rivedere</b>. In fondo ci sono le domande e il piano della Fase B.
    <b>Salva</b> (Chrome o Edge) scrive il file <code id="percorso1"></code>: la prima volta scegli quel file nella cartella del
    repository, poi la pagina lo ricorda. Con altri browser usa <b>Esporta</b> e salva il file scaricato sopra quello del repository.
    Su un altro PC, dopo <code>git pull</code>, apri la pagina e premi <b>Apri</b> sullo stesso file (oppure rigenera la pagina:
    <code>python -X utf8 docs/design/set-base/sb-25/genera-revisione.py</code>). Le modifiche non salvate restano anche nel browser, come rete di sicurezza.
    <div style="margin-top:8px"><b>Legenda dei segnaposto</b> (nei testi i numeri vengono dalla bozza 1.7):</div>
    <div class="legenda" id="legenda"></div>
    <div id="conti" class="stato" style="margin-top:6px"></div>
  </div>
  <div id="avvisi"></div>
  <div id="lista"></div>
  <section id="sezPiano"><h2>Piano della Fase B</h2><div class="piano"><!--PIANO--></div>
  <p class="stato">Dal documento della proposta, <code>docs/design/set-base/sb-25-fase-a.md</code>.</p></section>
</main>
<div class="promemoria" id="promemoria" hidden></div>
<input type="file" id="inputFile" accept=".json,application/json" hidden>
<script>
"use strict";
const META = /*META*/null;
const DATI = /*DATI*/null;
const DOMANDE = /*DOMANDE*/null;
const INCORPORATO = /*PROPRIETARIO*/null;
const CHIAVE_LS = "bm-sb25-revisione";
const PER_ID = Object.fromEntries(DATI.map(d => [d.id, d]));
let lavoro = normalizza(INCORPORATO);
let sporco = false;
let toccate = new Set();
let maniglia = null, manigliaRicordata = null;

function $(id) { return document.getElementById(id); }
function adesso() { return new Date().toISOString(); }
function esc(s) { return String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

// I segnaposto come il client: numero, simbolo e punteggiatura vicina restano insieme quando la riga va a capo.
function disegna(testo) {
  const t = esc(testo);
  return t.replace(/([+−-]?\d+ )?\[\[([A-Z]+)\]\]([.,;:!?)»])?/g, (tutto, num, k, punt) => {
    const s = META.simboli["[[" + k + "]]"];
    if (!s) return `<span class="ignoto" title="segnaposto sconosciuto">${tutto}</span>`;
    return `<span class="tieni">${num || ""}<span class="sim" role="img" aria-label="${esc(s.nome)}" title="${esc(s.nome)} · [[${k}]]">${s.svg}</span>${punt || ""}</span>`;
  });
}
// Lunghezza come la vede il giocatore: ogni simbolo conta un carattere.
function lunghezza(testo) { return String(testo).replace(/\[\[[A-Z]+\]\]/g, "#").length; }

function normalizza(o) {
  const out = {formato: META.formato, proposta: META.proposta, aggiornato: null, voci: {}};
  if (o && typeof o === "object") {
    if (o.formato && o.formato !== META.formato) throw new Error("formato inatteso: " + o.formato);
    out.aggiornato = o.aggiornato || null;
    if (o.proposta) out.propostaFile = o.proposta;
    for (const [id, v] of Object.entries(o.voci || {})) if (v && typeof v === "object") out.voci[id] = {...v};
  }
  return out;
}
function unisci(a, b) {
  const out = normalizza(a); let prese = 0;
  for (const [id, v] of Object.entries(b.voci)) {
    const mia = out.voci[id];
    if (!mia || (v.aggiornato || "") > (mia.aggiornato || "")) { out.voci[id] = {...v}; prese++; }
  }
  out.aggiornato = [a.aggiornato, b.aggiornato].filter(Boolean).sort().pop() || null;
  return {lavoro: out, prese};
}
function salvaLocale() { try { localStorage.setItem(CHIAVE_LS, JSON.stringify({sporco, toccate: [...toccate], lavoro})); } catch (e) {} }
function leggiLocale() { try { const t = localStorage.getItem(CHIAVE_LS); return t ? JSON.parse(t) : null; } catch (e) { return null; } }

function valore(id, campo) {
  const v = lavoro.voci[id];
  if (v && campo in v) return v[campo];
  if (campo === "testo") return PER_ID[id] ? PER_ID[id].proposta : "";
  return "";
}
function corretta(id) { const v = lavoro.voci[id]; return !!(v && "testo" in v); }
function imposta(id, campo, val) {
  const v = lavoro.voci[id] || (lavoro.voci[id] = {});
  if (campo === "testo" && PER_ID[id] && val === PER_ID[id].proposta) delete v.testo;
  else if (val) v[campo] = val; else delete v[campo];
  v.aggiornato = adesso(); lavoro.aggiornato = v.aggiornato;
  toccate.add(id); segnaSporco(true);
}
function segnaSporco(s) {
  sporco = s; if (!s) toccate.clear(); salvaLocale();
  const i = $("indicatore"); i.className = s ? "sporco" : "pulito";
  i.textContent = s ? "● Modifiche non salvate nel file" : "Tutto salvato nel file";
  aggiornaProgresso();
}
function testoFile() {
  const out = {formato: META.formato, proposta: META.proposta, aggiornato: lavoro.aggiornato || adesso(), voci: {}};
  for (const id of Object.keys(lavoro.voci).sort()) {
    const v = lavoro.voci[id], pulita = {};
    for (const k of ["testo", "risposta", "nota", "stato", "aggiornato"]) if (k in v && v[k] !== "") pulita[k] = v[k];
    if (Object.keys(pulita).length) out.voci[id] = pulita;
  }
  return JSON.stringify(out, null, 1) + "\n";
}

// ---- File: Salva, Apri, Esporta (come la pagina di SB-24)
const IDB = {
  apri() { return new Promise((ok, ko) => { const r = indexedDB.open("bm-sb25", 1);
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
async function permesso(m) { const opz = {mode: "readwrite"}; if ((await m.queryPermission(opz)) === "granted") return true; return (await m.requestPermission(opz)) === "granted"; }
async function caricaTesto(testo, origine) {
  const daFile = normalizza(JSON.parse(testo));
  const nelFile = Object.keys(daFile.voci).length;
  const tenute = [...toccate].filter(id => lavoro.voci[id] && (lavoro.voci[id].aggiornato || "") > (daFile.voci[id]?.aggiornato || ""));
  for (const id of tenute) daFile.voci[id] = {...lavoro.voci[id]};
  lavoro = daFile; toccate = new Set(tenute);
  avvisoProposta(daFile); ridisegna(); segnaSporco(tenute.length > 0);
  avviso(`Caricato ${origine}: ${nelFile} voci nel file` + (tenute.length ? `; restano ${tenute.length} voci cambiate qui e non ancora salvate (premi Salva)` : "") + ".");
}
async function ricollega() {
  try { if (!(await permesso(manigliaRicordata))) return; const m = manigliaRicordata; await ricorda(m);
    await caricaTesto(await (await m.getFile()).text(), "dal file " + m.name);
  } catch (e) { avviso("Non riesco a ricollegare il file: " + e.message, true); }
}
async function apri() {
  if (window.showOpenFilePicker) {
    try { const [m] = await showOpenFilePicker({types: [{description: "JSON", accept: {"application/json": [".json"]}}], id: "bm-sb25"});
      await caricaTesto(await (await m.getFile()).text(), "dal file " + m.name); await ricorda(m);
    } catch (e) { if (e.name !== "AbortError") avviso("Apertura non riuscita: " + e.message, true); }
  } else $("inputFile").click();
}
async function salva() {
  if (!window.showSaveFilePicker) return esporta();
  try {
    if (!maniglia && manigliaRicordata && (await permesso(manigliaRicordata))) await ricorda(manigliaRicordata);
    if (!maniglia) { const m = await showSaveFilePicker({suggestedName: "revisione-proprietario.json", id: "bm-sb25",
      types: [{description: "JSON", accept: {"application/json": [".json"]}}]}); await ricorda(m); }
    if (!(await permesso(maniglia))) throw new Error("permesso di scrittura negato");
    const w = await maniglia.createWritable(); await w.write(testoFile()); await w.close();
    segnaSporco(false); promemoria("salvato");
  } catch (e) { if (e.name !== "AbortError") avviso("Salvataggio non riuscito: " + e.message + ". Prova con Esporta.", true); }
}
function esporta() {
  const blob = new Blob([testoFile()], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "revisione-proprietario.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  segnaSporco(false); promemoria("esportato");
}
function promemoria(come) {
  const p = $("promemoria");
  const cmd = [`git add ${META.percorso}`, `git commit -m "SB-25: owner review"`, `git push`];
  p.innerHTML = `<b>${come === "salvato" ? "Salvato nel file." : "File scaricato."} Ricordati di committarlo e pusharlo.</b>` +
    (come === "esportato" ? `<div class="stato">Prima sposta il file scaricato sopra <code>${esc(META.percorso)}</code> nel repository.</div>` : "") +
    `<div class="stato">Dalla radice del repository:</div>` +
    cmd.map(c => `<pre><code>${esc(c)}</code><button data-c="${esc(c)}">Copia</button></pre>`).join("") +
    `<div class="riga"><button data-c="${esc(cmd.join("\n"))}">Copia tutto</button><button id="bChiudiProm">Fatto, chiudi</button></div>`;
  p.hidden = false;
  p.querySelectorAll("button[data-c]").forEach(b => b.onclick = async () => {
    try { await navigator.clipboard.writeText(b.dataset.c); b.textContent = "Copiato"; } catch (e) { b.textContent = "Seleziona e copia a mano"; }
  });
  $("bChiudiProm").onclick = () => { p.hidden = true; };
}
function avviso(testo, forte) {
  const d = document.createElement("div"); d.className = "avviso" + (forte ? " forte" : "");
  d.innerHTML = esc(testo) + ' <button>×</button>'; d.querySelector("button").onclick = () => d.remove(); $("avvisi").prepend(d);
}
function avvisoProposta(f) {
  if (f.propostaFile && f.propostaFile !== META.proposta)
    avviso(`Il file del proprietario è stato salvato su un'altra versione della proposta (${f.propostaFile}, ora ${META.proposta}): controlla le voci segnate.`, true);
}

// ---- Disegno
function segni(id, ripristino) {
  const st = valore(id, "stato");
  return `<div class="riga"><button class="segno ok${st === "ok" ? " attivo" : ""}" data-segno="ok">Ok</button>
   <button class="segno rivedere${st === "rivedere" ? " attivo" : ""}" data-segno="rivedere">Da rivedere</button>` +
   (ripristino ? `<button class="ripristina" title="Torna al testo proposto">↺ Proposta</button>` : "") + `</div>`;
}
function voceHtml(d) {
  const id = d.id, st = valore(id, "stato"), testo = valore(id, "testo"), cambiato = corretta(id);
  const carta = d.sezione === "campione";
  const anteprima = cambiato ? `<div class="stato" style="margin-top:4px">Come viene la tua correzione:</div><div class="testo-carta" data-anteprima="${id}">${disegna(testo)}</div>`
    : `<div data-anteprima="${id}" hidden></div>`;
  return `<div class="voce ${st}" id="v-${id}" data-id="${id}">
  <div class="testa"><div><span class="sigla">${esc(id)}</span> · <b>${esc(d.titolo)}</b> <span class="etichetta">${esc(d.gruppo)}</span></div>${segni(id, true)}</div>
  <table>
   <tr><th>Oggi</th><td class="oggi">${disegna(d.oggi)}</td></tr>
   <tr><th>Proposta</th><td><div class="testo-carta">${disegna(d.proposta)}</div>${carta ? ` <span class="conta">${lunghezza(d.proposta)} caratteri (oggi ${lunghezza(d.oggi)}; ogni simbolo conta 1)</span>` : ""}</td></tr>
   <tr><th>Correggi</th><td><textarea class="campo mono${cambiato ? " cambiato" : ""}" data-id="${id}" data-campo="testo" rows="2">${esc(testo)}</textarea>${anteprima}</td></tr>
   ${d.sottile ? `<tr><th>Cosa non dice</th><td class="nota-voce">${disegna(d.sottile)}</td></tr>` : ""}
   ${d.flavour ? `<tr><th>Flavour</th><td class="flavour">${esc(d.flavour)} <span class="conta">${d.flavour.length} caratteri, per la prova d'ingombro della Fase B</span></td></tr>` : ""}
  </table>
  <div class="nota-voce"><b>Perché:</b> ${disegna(d.perche)}</div>
  <div class="piede"><textarea class="campo" data-id="${id}" data-campo="nota" rows="1" placeholder="Nota libera">${esc(valore(id, "nota"))}</textarea></div>
 </div>`;
}
function domandaHtml(q) {
  const st = valore(q.id, "stato");
  return `<div class="voce ${st}" id="v-${q.id}" data-id="${q.id}">
  <div class="testa"><div><span class="sigla">${q.id}</span> · <b>${esc(q.titolo)}</b></div>${segni(q.id, false)}</div>
  <p>${disegna(q.testo)}</p>
  <div class="piede"><textarea class="campo" data-id="${q.id}" data-campo="risposta" rows="2" placeholder="La tua risposta (vuota = va bene la proposta)">${esc(valore(q.id, "risposta"))}</textarea></div>
  <div class="piede"><textarea class="campo" data-id="${q.id}" data-campo="nota" rows="1" placeholder="Nota libera">${esc(valore(q.id, "nota"))}</textarea></div>
 </div>`;
}
function filtra(id, d) {
  const s = $("fSegno").value, q = $("fTesto").value.trim().toLowerCase(), st = valore(id, "stato");
  if (s === "nessuno" && st) return false;
  if ((s === "ok" || s === "rivedere") && st !== s) return false;
  if (s === "modificate" && !corretta(id) && !valore(id, "risposta")) return false;
  if (s === "nota" && !valore(id, "nota")) return false;
  if (q) { const pag = [id, d.titolo, d.oggi, d.proposta, d.testo, d.perche, d.sottile, valore(id, "testo"), valore(id, "nota"), valore(id, "risposta")].join(" ").toLowerCase();
    if (!pag.includes(q)) return false; }
  return true;
}
function ridisegna() {
  const sez = $("fSezione").value, parti = [];
  if (!sez || sez === "campione") {
    const voci = DATI.filter(d => d.sezione === "campione" && filtra(d.id, d));
    if (voci.length) parti.push(`<h2>Campione <span class="stato">${voci.length} voci, testi generati dalla bozza 1.7</span></h2>` + voci.map(voceHtml).join(""));
  }
  if (!sez || sez === "glossario") {
    const blocchi = [];
    for (const g of META.gruppi) {
      const voci = DATI.filter(d => d.sezione === "glossario" && d.gruppo === g && filtra(d.id, d));
      if (voci.length) blocchi.push(`<h3>${esc(g)}</h3>` + voci.map(voceHtml).join(""));
    }
    if (blocchi.length) parti.push(`<h2>Glossario</h2>` + blocchi.join(""));
  }
  if (!sez || sez === "domande") {
    const voci = DOMANDE.filter(q => filtra(q.id, q));
    if (voci.length) parti.push(`<h2>Domande</h2>` + voci.map(domandaHtml).join(""));
  }
  $("lista").innerHTML = parti.join("") || '<div class="avviso">Nessuna voce con questi filtri.</div>';
  $("sezPiano").hidden = !!sez && sez !== "domande";
  aggiornaProgresso();
}
function aggiornaProgresso() {
  const tutte = [...DATI.map(d => d.id), ...DOMANDE.map(q => q.id)];
  let ok = 0, riv = 0, mod = 0, note = 0;
  for (const id of tutte) { const st = valore(id, "stato"); if (st === "ok") ok++; else if (st === "rivedere") riv++;
    if (corretta(id) || valore(id, "risposta")) mod++; if (valore(id, "nota")) note++; }
  $("progresso").textContent = `Segnate ${ok + riv}/${tutte.length} (ok ${ok}, da rivedere ${riv}) · corrette o risposte ${mod} · con nota ${note}`;
}
function ridisegnaVoce(id) {
  const box = $("v-" + id); if (!box) return;
  box.outerHTML = PER_ID[id] ? voceHtml(PER_ID[id]) : domandaHtml(DOMANDE.find(q => q.id === id));
}

// ---- Eventi
$("lista").addEventListener("input", e => {
  const el = e.target, id = el.dataset.id, campo = el.dataset.campo; if (!id || !campo) return;
  imposta(id, campo, el.value);
  if (campo === "testo") {
    const cambiato = corretta(id); el.classList.toggle("cambiato", cambiato);
    const a = document.querySelector(`[data-anteprima="${id}"]`);
    if (a) { a.hidden = !cambiato; a.className = cambiato ? "testo-carta" : ""; a.innerHTML = cambiato ? disegna(el.value) : ""; }
  }
});
$("lista").addEventListener("click", e => {
  const box = e.target.closest(".voce"); if (!box) return; const id = box.dataset.id;
  if (e.target.dataset.segno) { imposta(id, "stato", valore(id, "stato") === e.target.dataset.segno ? "" : e.target.dataset.segno); ridisegnaVoce(id); }
  else if (e.target.classList.contains("ripristina")) {
    if (!corretta(id)) return;
    if (!confirm("Riportare " + id + " al testo proposto? Nota e segno restano.")) return;
    imposta(id, "testo", PER_ID[id].proposta); ridisegnaVoce(id);
  }
});
for (const id of ["fSezione", "fSegno"]) $(id).addEventListener("change", ridisegna);
$("fTesto").addEventListener("input", ridisegna);
$("bSalva").onclick = salva; $("bApri").onclick = apri; $("bEsporta").onclick = esporta;
$("inputFile").onchange = async e => { const f = e.target.files[0]; if (!f) return;
  try { await caricaTesto(await f.text(), "da " + f.name); } catch (err) { avviso("File non valido: " + err.message, true); } e.target.value = ""; };
window.addEventListener("beforeunload", e => { if (sporco) { e.preventDefault(); e.returnValue = ""; } });
document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); salva(); } });

// ---- Avvio
$("percorso1").textContent = META.percorso;
$("legenda").innerHTML = Object.entries(META.simboli).map(([k, s]) => `<span>${disegna(k)} <code>${esc(k)}</code> ${esc(s.nome)}</span>`).join("");
$("conti").textContent = `Voci: ${DATI.filter(d => d.sezione === "glossario").length} del glossario, ${DATI.filter(d => d.sezione === "campione").length} del campione, ${DOMANDE.length} domande · proposta ${META.proposta} · lavoro incorporato alla generazione: ${META.incorporato || "nessuno"}`;
avvisoProposta(lavoro);
const locale = leggiLocale();
if (locale && locale.lavoro && locale.sporco) {
  try { const {lavoro: unito, prese} = unisci(lavoro, normalizza(locale.lavoro));
    if (prese) { lavoro = unito; sporco = true; toccate = new Set(locale.toccate || []); avviso(`Ritrovate nel browser ${prese} voci modificate e non salvate nel file: le ho ripristinate. Premi Salva.`, true); }
  } catch (e) {}
}
ridisegna(); segnaSporco(sporco); mostraFile();
if (window.indexedDB && window.showSaveFilePicker) IDB.prendi().then(m => { if (m && !maniglia) { manigliaRicordata = m; mostraFile(); } }).catch(() => {});
window.__sb25 = {testoFile, caricaTesto, get lavoro() { return lavoro; }, get sporco() { return sporco; }};
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
