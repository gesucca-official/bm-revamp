#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Genera la pagina di revisione di SB-25 Fase B2: tutti i testi per i giocatori della bozza 1.7.

Uso, dalla radice del repository:
    python -X utf8 docs/design/set-base/sb-25/genera-revisione-b.py

Legge, senza modificarli:
    docs/design/set-base/testi/testi-completi.json        testo breve e testo completo delle 125 voci (generato in B1)
    server/src/test/resources/set-base/bozza.json         flavour delle carte e dei personaggi, nomi e descrizioni dei 44 stati
    docs/design/set-base/sb-25/simboli.json               simboli del client in SVG (da simboli.mjs, Fase A)
    docs/reports/set-base/sb-25/ingombro-stampa.json      prova d'ingombro sulla carta stampata (ingombro-stampa.py)
    docs/reports/set-base/sb-25/ingombro-client.json      prova d'ingombro nell'ispezione del client (ingombro-client.mjs)
    docs/design/set-base/sb-25/revisione-b-proprietario.json   lavoro del proprietario, incorporato

Scrive docs/design/set-base/sb-25/revisione-b.html: un solo file, niente rete, si apre da file://.
Esce con errore se un segnaposto non ha simbolo, se una voce non ha slot o se il file del proprietario non è leggibile.
"""
import hashlib
import html
import json
import re
import sys
from pathlib import Path

QUI = Path(__file__).resolve().parent
ROOT = QUI.parents[3]
OUT = QUI / "revisione-b.html"
PROPRIETARIO = QUI / "revisione-b-proprietario.json"
COMPLETI = ROOT / "docs/design/set-base/testi/testi-completi.json"
BOZZA = ROOT / "server/src/test/resources/set-base/bozza.json"
STAMPA = ROOT / "docs/reports/set-base/sb-25/ingombro-stampa.json"
CLIENT = ROOT / "docs/reports/set-base/sb-25/ingombro-client.json"
FORMATO = "sb-25-revisione-b-proprietario/1"
PERCORSO_REPO = "docs/design/set-base/sb-25/revisione-b-proprietario.json"
SEGNAPOSTO = re.compile(r"\[\[([A-Z]+)\]\]")
# Tagli di flavour proposti dalla prova d'ingombro (D166 (2)): slot -> flavour accorciato. Solo proposte, mai scritte nella bozza.
# La prova della B2 non ne ha richiesto nessuno: tutti i flavour entrano sulla carta stampata e nell'ispezione.
FLAVOUR_PROPOSTI = {}
TIPO = {"personaggio": "Personaggi", "carta": "Carte", "token": "Token"}


def fail(msg):
    print("ERRORE: " + msg, file=sys.stderr)
    sys.exit(1)


def stati(carta):
    """Gli stati che la carta dà, nell'ordine dei passi: (nome, descrizione)."""
    out = []

    def cammina(o):
        if isinstance(o, dict):
            if o.get("op") == "status" and "name" in o:
                out.append((o["name"], o.get("description", "")))
            for v in o.values():
                cammina(v)
        elif isinstance(o, list):
            for v in o:
                cammina(v)
    cammina({k: v for k, v in carta.items() if k != "gui"})
    return out


def main():
    completi = json.loads(COMPLETI.read_text(encoding="utf-8"))["voci"]
    bozza = json.loads(BOZZA.read_text(encoding="utf-8-sig"))
    simboli = json.loads((QUI / "simboli.json").read_text(encoding="utf-8"))
    stampa = {r["id"]: r for r in json.loads(STAMPA.read_text(encoding="utf-8"))["items"]}
    client = json.loads(CLIENT.read_text(encoding="utf-8"))["sizes"]
    misure = {size: {c["binding"]: c for c in v["items"]} for size, v in client.items()}
    flavour = {c["id"]: c.get("flavour", "") for c in bozza["characters"]}
    flavour.update({c["binding"]: c["gui"].get("flavour", "") for c in bozza["cards"]})
    carte = {c["binding"]: c for c in bozza["cards"]}

    dati, stati_dati = [], []
    for binding, v in completi.items():
        slot = v.get("slot")
        if not slot:
            fail("voce senza slot: " + binding)
        s = stampa.get(binding)
        ingombro = {"stampa": None if s is None else {"resta": s.get("room"), "senza": s.get("room_without_flavour"), "problema": s.get("problem")},
                    "client": {size: (None if binding not in m else {"margine": m[binding]["view"] - (m[binding]["blockHeight"] or m[binding]["textHeight"]),
                                                                    "righe": m[binding]["textLines"], "righeFlavour": m[binding]["flavourLines"]})
                               for size, m in misure.items()}}
        dati.append({"id": slot, "binding": binding, "sezione": v["tipo"], "gruppo": TIPO[v["tipo"]], "titolo": v["nome"], "breve": v["breve"],
                     "completo": v["completo"], "flavour": (flavour.get(binding) or "").strip(), "flavourProposto": FLAVOUR_PROPOSTI.get(slot, ""),
                     "ingombro": ingombro})
        if binding in carte:
            for n, (nome, descrizione) in enumerate(stati(carte[binding]), 1):
                stati_dati.append({"id": f"{slot}/S{n}", "sezione": "stato", "gruppo": "Stati", "carta": v["nome"], "titolo": nome, "breve": descrizione})
    ids = [d["id"] for d in dati + stati_dati]
    if len(set(ids)) != len(ids):
        fail("voci doppie: " + ", ".join(sorted({i for i in ids if ids.count(i) > 1})))
    testi = [d["breve"] for d in dati + stati_dati] + [p for d in dati for p in d["completo"]]
    ignoti = sorted({m for t in testi for m in SEGNAPOSTO.findall(t)} - {k[2:-2] for k in simboli})
    if ignoti:
        fail("segnaposto senza simbolo: " + ", ".join(ignoti))

    # Impronta di ciò che il proprietario rivede: se cambia, la pagina avvisa chi aveva salvato su quella vecchia.
    base = json.dumps([[d["id"], d["breve"], d.get("flavour", ""), d.get("completo")] for d in dati + stati_dati], ensure_ascii=False)
    impronta = hashlib.sha256(base.encode("utf-8")).hexdigest()[:12]
    try:
        prop = json.loads(PROPRIETARIO.read_text(encoding="utf-8"))
    except (OSError, ValueError) as e:
        fail("file del proprietario illeggibile: %s (%s)" % (PROPRIETARIO, e))
    if prop.get("formato") != FORMATO or not isinstance(prop.get("voci"), dict):
        fail("file del proprietario con formato inatteso: " + str(prop.get("formato")))
    ignote = sorted(set(prop["voci"]) - set(ids))
    if ignote:
        print("ATTENZIONE: voci del proprietario che la pagina non ha: " + ", ".join(ignote))

    meta = {"incorporato": prop.get("aggiornato"), "proposta": impronta, "formato": FORMATO, "percorso": PERCORSO_REPO,
            "simboli": {k: {"nome": v["nome"], "svg": v["svg"]} for k, v in simboli.items()},
            "misure": sorted(misure), "bozza": hashlib.sha256(BOZZA.read_bytes()).hexdigest()[:12]}

    def js(o):
        return json.dumps(o, ensure_ascii=False).replace("</", "<\\/")

    pagina = (MODELLO.replace("/*META*/null", js(meta)).replace("/*DATI*/null", js(dati)).replace("/*STATI*/null", js(stati_dati))
              .replace("/*PROPRIETARIO*/null", js(prop)))
    OUT.write_text(pagina, encoding="utf-8", newline="\n")
    print("Scritto %s: %d voci (%s), %d stati; proposta %s; tagli di flavour proposti: %d." % (
        OUT.relative_to(ROOT).as_posix(), len(dati), ", ".join(f"{sum(d['sezione'] == k for d in dati)} {TIPO[k].lower()}" for k in TIPO),
        len(stati_dati), impronta, len(FLAVOUR_PROPOSTI)))
    print("Lavoro del proprietario incorporato: %d voci, aggiornato %s." % (len(prop["voci"]), prop.get("aggiornato")))


MODELLO = r"""<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SB-25 · Tutti i testi</title>
<style>
:root{--bg:#f6f1e7;--card:#fffdf8;--ink:#2a2420;--muted:#76695e;--line:#d9cdbb;--accent:#7a2e2e;--accent2:#2f5d62;
--ok:#2e6b3a;--okbg:#e3f1e2;--warn:#8a5a00;--warnbg:#fff1cc;--edit:#fff7d6;--paper:#f3ead2}
@media (prefers-color-scheme: dark){:root{--bg:#1c1916;--card:#26221e;--ink:#eee6da;--muted:#a89a8a;--line:#3d362f;
--accent:#d58b8b;--accent2:#8cc3c9;--ok:#8fd19b;--okbg:#1f3323;--warn:#f0c062;--warnbg:#3a2f12;--edit:#3a3420}}
*{box-sizing:border-box}
[hidden]{display:none!important}
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
.voce{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:10px 0;padding:10px 14px}
.voce.ok{border-left:6px solid var(--ok)}.voce.rivedere{border-left:6px solid var(--warn)}
.testa{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;justify-content:space-between}
.sigla{font-weight:700;font-family:ui-monospace,Consolas,monospace}
.etichetta{font-size:12px;color:var(--muted);border:1px solid var(--line);border-radius:10px;padding:0 7px}
table{width:100%;border-collapse:collapse;margin-top:6px}
th{text-align:left;font-size:12px;color:var(--muted);font-weight:600;width:130px;vertical-align:top;padding:6px 6px 6px 0}
td{vertical-align:top;padding:4px 6px}
.testo-carta{background:var(--paper);color:#2a2420;border-radius:6px;padding:6px 9px;display:inline-block;max-width:100%}
.completo p{margin:0 0 6px}.completo{font-size:14px}
.sim{display:inline-block;width:1.05em;height:1.05em;vertical-align:-0.17em;margin:0 .06em}
.sim svg{width:100%;height:100%;display:block}
.tieni{white-space:nowrap}
.ignoto{color:#b00;font-weight:700}
textarea.campo{width:100%;font:inherit;padding:5px 7px;border:1px solid var(--line);border-radius:6px;background:var(--bg);color:var(--ink);min-height:44px;resize:vertical}
textarea.mono{font-family:ui-monospace,Consolas,monospace;font-size:13px}
.cambiato{background:var(--edit)!important;border-color:var(--warn)!important}
.conta{font-size:11px;color:var(--muted)}
.piede{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}
.piede textarea{flex:1 1 300px}
button.segno.attivo.ok{background:var(--ok);color:#fff;border-color:var(--ok)}
button.segno.attivo.rivedere{background:var(--warn);color:#fff;border-color:var(--warn)}
.legenda{display:flex;flex-wrap:wrap;gap:6px 18px}
.legenda code{font-size:13px}
.flavour{font-style:italic}
.ingombro{font-size:12px;color:var(--muted)}
details summary{cursor:pointer;color:var(--accent2);font-size:13px}
@media (max-width:760px){header{position:static}tr{display:block}th{display:block;width:auto}td{display:block}}
</style>
</head>
<body>
<header>
  <h1>SB-25 · Tutti i testi delle carte (Fase B2)</h1>
  <div class="riga">
    <button class="primario" id="bSalva" title="Scrive revisione-b-proprietario.json nella cartella del repository">Salva</button>
    <button id="bApri" title="Carica revisione-b-proprietario.json dal repository">Apri</button>
    <button id="bEsporta" title="Scarica il JSON, da salvare sopra quello del repository">Esporta</button>
    <span id="indicatore"></span>
    <span class="stato" id="fileStato"></span>
  </div>
  <div class="riga" style="margin-top:6px">
    <select id="fSezione"><option value="">Tutto</option><option value="personaggio">Personaggi</option><option value="carta">Carte</option><option value="token">Token</option><option value="stato">Stati</option></select>
    <select id="fSegno">
      <option value="">Tutti i segni</option><option value="nessuno">Senza segno</option>
      <option value="ok">Ok</option><option value="rivedere">Da rivedere</option>
      <option value="modificate">Corrette da me</option><option value="nota">Con nota</option>
    </select>
    <select id="fRata" title="Per rivedere a rate: un gruppo di voci alla volta"></select>
    <input type="search" id="fTesto" placeholder="Cerca…">
    <span class="stato" id="progresso"></span>
  </div>
</header>
<main>
  <div class="avviso">
    <b>Come si usa.</b> Per ogni carta, personaggio e token trovi il testo breve (quello sulla carta e nel client, coi simboli
    disegnati come nel client), il flavour, il testo completo (che prevale in caso di dubbio) e la prova d'ingombro; in fondo
    i 44 stati col nome e la descrizione dei segnalini. Se una frase non ti piace correggila nel riquadro (i simboli si scrivono
    come segnaposto, vedi la legenda: sotto vedi come viene), scrivi una nota e segna <b>Ok</b> o <b>Da rivedere</b>. Puoi
    rivedere a rate: il menu delle rate e il filtro «Senza segno» mostrano solo un gruppo alla volta, il contatore dice a che punto sei.
    <b>Salva</b> (Chrome o Edge) scrive il file <code id="percorso1"></code>: la prima volta scegli quel file nella cartella del
    repository, poi la pagina lo ricorda. Con altri browser usa <b>Esporta</b> e salva il file scaricato sopra quello del repository.
    Su un altro PC, dopo <code>git pull</code>, apri la pagina e premi <b>Apri</b> sullo stesso file (oppure rigenera la pagina:
    <code>python -X utf8 docs/design/set-base/sb-25/genera-revisione-b.py</code>). Le modifiche non salvate restano anche nel browser, come rete di sicurezza.
    <div style="margin-top:8px"><b>Legenda dei segnaposto</b> (nei testi i numeri vengono dalla bozza 1.7):</div>
    <div class="legenda" id="legenda"></div>
    <div style="margin-top:8px"><b>Prova d'ingombro.</b> Stampa: millimetri che restano sotto testo e flavour sulla carta di 62 × 87 mm
    (testo a 9 pt, flavour in corsivo a 7,5 pt). Client: pixel che restano nella finestra d'ispezione quando testo e flavour sono
    in vista insieme, a 1366×768 e 844×390 (il flavour nel client arriva con SB-31; qui è stato aggiunto solo per misurare).
    Tutte le voci entrano: nessun taglio di testo applicato, nessun taglio di flavour proposto.</div>
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
const STATI = /*STATI*/null;
const INCORPORATO = /*PROPRIETARIO*/null;
const TUTTE = [...DATI, ...STATI];
const CHIAVE_LS = "bm-sb25b-revisione";
const PER_ID = Object.fromEntries(TUTTE.map(d => [d.id, d]));
const RATA = 20;
let lavoro = normalizza(INCORPORATO);
let sporco = false;
let toccate = new Set();
let maniglia = null, manigliaRicordata = null;

function $(id) { return document.getElementById(id); }
function voci(n) { return n === 1 ? "1 voce" : n + " voci"; }
function adesso() { return new Date().toISOString(); }
function esc(s) { return String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c])); }

// I segnaposto come il client (EffectText): numero, simbolo e punteggiatura vicina restano insieme quando la riga va a capo.
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

// I campi correggibili: «testo» (testo breve o descrizione dello stato) e «flavour»; assenti nel file = proposta accettata.
function originale(id, campo) { const d = PER_ID[id]; if (!d) return ""; return campo === "testo" ? d.breve : campo === "flavour" ? (d.flavourProposto || d.flavour || "") : ""; }
function valore(id, campo) {
  const v = lavoro.voci[id];
  if (v && campo in v) return v[campo];
  return originale(id, campo);
}
function corretta(id, campo) { const v = lavoro.voci[id]; return !!(v && (campo ? campo in v : ("testo" in v || "flavour" in v))); }
function imposta(id, campo, val) {
  const v = lavoro.voci[id] || (lavoro.voci[id] = {});
  if ((campo === "testo" || campo === "flavour") && val === originale(id, campo)) delete v[campo];
  else if (val || campo === "flavour") v[campo] = val; else delete v[campo];
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
    for (const k of ["testo", "flavour", "nota", "stato", "aggiornato"]) if (k in v && (v[k] !== "" || k === "flavour")) pulita[k] = v[k];
    if (Object.keys(pulita).some(k => k !== "aggiornato")) out.voci[id] = pulita;
  }
  return JSON.stringify(out, null, 1) + "\n";
}

// ---- File: Salva, Apri, Esporta (come le pagine di SB-24 e della Fase A)
const IDB = {
  apri() { return new Promise((ok, ko) => { const r = indexedDB.open("bm-sb25b", 1);
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
  avviso(`Caricato ${origine}: ${nelFile} voci nel file` + (tenute.length ? `; cambiate qui e non ancora salvate nel file: ${voci(tenute.length)} (premi Salva)` : "") + ".");
}
async function ricollega() {
  try { if (!(await permesso(manigliaRicordata))) return; const m = manigliaRicordata; await ricorda(m);
    await caricaTesto(await (await m.getFile()).text(), "dal file " + m.name);
  } catch (e) { avviso("Non riesco a ricollegare il file: " + e.message, true); }
}
async function apri() {
  if (window.showOpenFilePicker) {
    try { const [m] = await showOpenFilePicker({types: [{description: "JSON", accept: {"application/json": [".json"]}}], id: "bm-sb25b"});
      await caricaTesto(await (await m.getFile()).text(), "dal file " + m.name); await ricorda(m);
    } catch (e) { if (e.name !== "AbortError") avviso("Apertura non riuscita: " + e.message, true); }
  } else $("inputFile").click();
}
async function salva() {
  if (!window.showSaveFilePicker) return esporta();
  try {
    if (!maniglia && manigliaRicordata && (await permesso(manigliaRicordata))) await ricorda(manigliaRicordata);
    if (!maniglia) { const m = await showSaveFilePicker({suggestedName: "revisione-b-proprietario.json", id: "bm-sb25b",
      types: [{description: "JSON", accept: {"application/json": [".json"]}}]}); await ricorda(m); }
    if (!(await permesso(maniglia))) throw new Error("permesso di scrittura negato");
    const w = await maniglia.createWritable(); await w.write(testoFile()); await w.close();
    segnaSporco(false); promemoria("salvato");
  } catch (e) { if (e.name !== "AbortError") avviso("Salvataggio non riuscito: " + e.message + ". Prova con Esporta.", true); }
}
function esporta() {
  const blob = new Blob([testoFile()], {type: "application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = "revisione-b-proprietario.json";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  segnaSporco(false); promemoria("esportato");
}
function promemoria(come) {
  const p = $("promemoria");
  const cmd = [`git add ${META.percorso}`, `git commit -m "SB-25: owner review of all texts"`, `git push`];
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
    avviso(`Il file del proprietario è stato salvato su un'altra versione dei testi (${f.propostaFile}, ora ${META.proposta}): controlla le voci segnate.`, true);
}

// ---- Disegno
function segni(id) {
  const st = valore(id, "stato");
  return `<div class="riga"><button class="segno ok${st === "ok" ? " attivo" : ""}" data-segno="ok">Ok</button>
   <button class="segno rivedere${st === "rivedere" ? " attivo" : ""}" data-segno="rivedere">Da rivedere</button>` +
   (corretta(id) ? `<button class="ripristina" title="Torna ai testi proposti">↺ Proposta</button>` : "") + `</div>`;
}
function correzione(id, campo, righe) {
  const val = valore(id, campo), cambiato = corretta(id, campo);
  return `<textarea class="campo mono${cambiato ? " cambiato" : ""}" data-id="${id}" data-campo="${campo}" rows="${righe}">${esc(val)}</textarea>` +
    `<div class="testo-carta${campo === "flavour" ? " flavour" : ""}" data-anteprima="${id}:${campo}"${cambiato ? "" : " hidden"}>${cambiato ? disegna(val) : ""}</div>`;
}
function ingombroHtml(g) {
  const parti = [];
  if (g.stampa) parti.push(g.stampa.problema ? `stampa: <b>non entra</b> (${esc(g.stampa.problema)})` : `stampa: restano ${g.stampa.resta} mm (senza flavour ${g.stampa.senza} mm)`);
  else parti.push("stampa: non è un fronte stampato");
  for (const size of META.misure) { const c = g.client[size]; parti.push(c ? `client ${size}: margine ${c.margine} px (testo ${c.righe} righe` + (c.righeFlavour ? `, flavour ${c.righeFlavour}` : "") + ")" : `client ${size}: non è nel catalogo del client`); }
  return parti.join(" · ");
}
function voceHtml(d) {
  const id = d.id, st = valore(id, "stato");
  if (d.sezione === "stato") return `<div class="voce ${st}" id="v-${cssId(id)}" data-id="${esc(id)}">
  <div class="testa"><div><span class="sigla">${esc(id)}</span> · <b>${esc(d.titolo)}</b> <span class="etichetta">stato di «${esc(d.carta)}»</span></div>${segni(id)}</div>
  <table>
   <tr><th>Descrizione</th><td><div class="testo-carta">${disegna(d.breve)}</div> <span class="conta">${lunghezza(d.breve)} caratteri</span></td></tr>
   <tr><th>Correggi</th><td>${correzione(id, "testo", 2)}</td></tr>
  </table>
  <div class="piede"><textarea class="campo" data-id="${esc(id)}" data-campo="nota" rows="1" placeholder="Nota libera (anche per il nome dello stato)">${esc(valore(id, "nota"))}</textarea></div>
 </div>`;
  const taglio = d.flavourProposto ? `<div class="stato">Taglio proposto (la bozza resta com'è finché non lo approvi):</div><div class="flavour">${esc(d.flavourProposto)}</div>` : "";
  return `<div class="voce ${st}" id="v-${cssId(id)}" data-id="${esc(id)}">
  <div class="testa"><div><span class="sigla">${esc(id)}</span> · <b>${esc(d.titolo)}</b> <span class="etichetta">${esc(d.sezione)}</span></div>${segni(id)}</div>
  <table>
   <tr><th>Testo breve</th><td><div class="testo-carta">${disegna(d.breve)}</div> <span class="conta">${lunghezza(d.breve)} caratteri (ogni simbolo conta 1)</span></td></tr>
   <tr><th>Correggi</th><td>${correzione(id, "testo", 2)}</td></tr>
   <tr><th>Flavour</th><td>${d.flavour ? `<span class="flavour">${esc(d.flavour)}</span> <span class="conta">${d.flavour.length} caratteri</span>` : '<span class="stato">nessuno</span>'}${taglio}</td></tr>
   ${d.flavour ? `<tr><th>Correggi il flavour</th><td>${correzione(id, "flavour", 1)}</td></tr>` : ""}
   <tr><th>Ingombro</th><td class="ingombro">${ingombroHtml(d.ingombro)}</td></tr>
   <tr><th>Testo completo</th><td><details${$("fCompleto")?.checked ? " open" : ""}><summary>${d.completo.length} paragrafi: prevale sul testo breve</summary><div class="completo">${d.completo.map(p => `<p>${disegna(p)}</p>`).join("")}</div></details></td></tr>
  </table>
  <div class="piede"><textarea class="campo" data-id="${esc(id)}" data-campo="nota" rows="1" placeholder="Nota libera (anche sul testo completo)">${esc(valore(id, "nota"))}</textarea></div>
 </div>`;
}
function cssId(id) { return id.replace(/[^A-Za-z0-9-]/g, "_"); }
function filtra(d) {
  const id = d.id, s = $("fSegno").value, q = $("fTesto").value.trim().toLowerCase(), st = valore(id, "stato"), sez = $("fSezione").value;
  if (sez && d.sezione !== sez) return false;
  if (s === "nessuno" && st) return false;
  if ((s === "ok" || s === "rivedere") && st !== s) return false;
  if (s === "modificate" && !corretta(id)) return false;
  if (s === "nota" && !valore(id, "nota")) return false;
  if (q) { const pag = [id, d.titolo, d.carta, d.breve, d.flavour, (d.completo || []).join(" "), valore(id, "testo"), valore(id, "flavour"), valore(id, "nota")].join(" ").toLowerCase();
    if (!pag.includes(q)) return false; }
  return true;
}
function ridisegna() {
  let voci = TUTTE.filter(filtra);
  const rate = Math.ceil(voci.length / RATA), scelta = $("fRata").value;
  $("fRata").innerHTML = `<option value="">Tutte le rate</option>` + Array.from({length: rate}, (_, i) =>
    `<option value="${i}"${String(i) === scelta ? " selected" : ""}>Rata ${i + 1}: ${i * RATA + 1}–${Math.min(voci.length, (i + 1) * RATA)}</option>`).join("");
  if (scelta !== "" && Number(scelta) < rate) voci = voci.slice(Number(scelta) * RATA, (Number(scelta) + 1) * RATA);
  const parti = [];
  for (const [sez, titolo] of [["personaggio", "Personaggi"], ["carta", "Carte"], ["token", "Token"], ["stato", "Stati"]]) {
    const qui = voci.filter(d => d.sezione === sez);
    if (qui.length) parti.push(`<h2>${titolo} <span class="stato">${qui.length} voci</span></h2>` + qui.map(voceHtml).join(""));
  }
  $("lista").innerHTML = parti.join("") || '<div class="avviso">Nessuna voce con questi filtri.</div>';
  aggiornaProgresso();
}
function aggiornaProgresso() {
  let ok = 0, riv = 0, mod = 0, note = 0;
  for (const d of TUTTE) { const st = valore(d.id, "stato"); if (st === "ok") ok++; else if (st === "rivedere") riv++;
    if (corretta(d.id)) mod++; if (valore(d.id, "nota")) note++; }
  $("progresso").textContent = `Segnate ${ok + riv}/${TUTTE.length} (ok ${ok}, da rivedere ${riv}) · corrette ${mod} · con nota ${note}`;
}
function ridisegnaVoce(id) { const box = $("v-" + cssId(id)); if (box) box.outerHTML = voceHtml(PER_ID[id]); }

// ---- Eventi
$("lista").addEventListener("input", e => {
  const el = e.target, id = el.dataset.id, campo = el.dataset.campo; if (!id || !campo) return;
  imposta(id, campo, el.value);
  if (campo === "testo" || campo === "flavour") {
    const cambiato = corretta(id, campo); el.classList.toggle("cambiato", cambiato);
    const a = document.querySelector(`[data-anteprima="${CSS.escape(id + ":" + campo)}"]`);
    if (a) { a.hidden = !cambiato; a.innerHTML = cambiato ? disegna(el.value) : ""; }
  }
});
$("lista").addEventListener("click", e => {
  const box = e.target.closest(".voce"); if (!box) return; const id = box.dataset.id;
  if (e.target.dataset.segno) { imposta(id, "stato", valore(id, "stato") === e.target.dataset.segno ? "" : e.target.dataset.segno); ridisegnaVoce(id); }
  else if (e.target.classList.contains("ripristina")) {
    if (!confirm("Riportare " + id + " ai testi proposti? Nota e segno restano.")) return;
    imposta(id, "testo", originale(id, "testo")); if (PER_ID[id].flavour !== undefined) imposta(id, "flavour", originale(id, "flavour")); ridisegnaVoce(id);
  }
});
for (const id of ["fSezione", "fSegno"]) $(id).addEventListener("change", () => { $("fRata").value = ""; ridisegna(); });
$("fRata").addEventListener("change", ridisegna);
$("fTesto").addEventListener("input", () => { $("fRata").value = ""; ridisegna(); });
$("bSalva").onclick = salva; $("bApri").onclick = apri; $("bEsporta").onclick = esporta;
$("inputFile").onchange = async e => { const f = e.target.files[0]; if (!f) return;
  try { await caricaTesto(await f.text(), "da " + f.name); } catch (err) { avviso("File non valido: " + err.message, true); } e.target.value = ""; };
window.addEventListener("beforeunload", e => { if (sporco) { e.preventDefault(); e.returnValue = ""; } });
document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); salva(); } });

// ---- Avvio
$("percorso1").textContent = META.percorso;
$("legenda").innerHTML = Object.entries(META.simboli).map(([k, s]) => `<span>${disegna(k)} <code>${esc(k)}</code> ${esc(s.nome)}</span>`).join("");
$("conti").textContent = `Voci: ${DATI.filter(d => d.sezione === "personaggio").length} personaggi, ${DATI.filter(d => d.sezione === "carta").length} carte, ${DATI.filter(d => d.sezione === "token").length} token, ${STATI.length} stati · testi ${META.proposta} · bozza ${META.bozza} · lavoro incorporato alla generazione: ${META.incorporato || "nessuno"}`;
avvisoProposta(lavoro);
const locale = leggiLocale();
if (locale && locale.lavoro && locale.sporco) {
  try { const {lavoro: unito, prese} = unisci(lavoro, normalizza(locale.lavoro));
    if (prese) { lavoro = unito; sporco = true; toccate = new Set(locale.toccate || []); avviso(`Ritrovate nel browser ${voci(prese)} modificate e non salvate nel file: le ho ripristinate. Premi Salva.`, true); }
  } catch (e) {}
}
ridisegna(); segnaSporco(sporco); mostraFile();
if (window.indexedDB && window.showSaveFilePicker) IDB.prendi().then(m => { if (m && !maniglia) { manigliaRicordata = m; mostraFile(); } }).catch(() => {});
window.__sb25b = {testoFile, caricaTesto, get lavoro() { return lavoro; }, get sporco() { return sporco; }};
</script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
