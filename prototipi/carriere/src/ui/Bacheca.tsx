// CA-0a, Fase D: la mappa vera come bacheca a lettere in feltro (docs/design/carriere/bacheca.md), per tutte e due le carriere e nei due
// orientamenti. Si tocca un punto disponibile per entrare; gli altri mostrano un cartoncino con quello che si sa. Il disegno sta in
// disegno.tsx, la composizione e la disposizione (funzioni pure) in ../bacheca.ts.
// Fase G: la bacheca si muove, poco (../movimentiBacheca.ts). Due strati: sotto il feltro con lettere e post-it, fermo, con i suoi filtri;
// sopra, in uno strato a parte, cordicelle, puntine, le aree da toccare e i pezzi che si muovono, così il movimento non ridisegna il feltro.
// Un orologio solo, che si ferma mentre si legge un cartoncino o la legenda; con il movimento ridotto del sistema niente si muove.
import {useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode} from 'react';
import type {Carriera} from '../formato.ts';
import {avversari, entra, finali, nodo as trovaNodo, ottieniAchievement, risolvi, type Evento, type Stato} from '../motore.ts';
import {caso, catenaria, CARATTERE_LETTERA, componi, disponi, latoPuntina, sporco, LEGENDA, ROSSO_SEI_QUI, type Pt, type Punto} from '../bacheca.ts';
import {accartoccia, avanzaDanno, chiusiOra, danno, strappo, TEMPO_DANNO} from '../movimentiBacheca.ts';
import {agitazione, alPosto, ampiezzaFilo, angoloPostit, cadutaLettera, DURATA_ANGOLO, durataMosca, filoMosso, letteraAllentata, mosca, oscillazioneDi,
  PASSO_CORDICELLE, pianoMosca, premioLettere, PREMIO_LETTERE, prossimoAngolo, toccataMosca, VOLO, type PianoMosca,
  ritmo, scoperti, siAllenta, staccoPostit, TEMPI, tremolio, trovaLettera, viaggio, type Allentata} from '../movimentiBacheca.ts';
import type {StatoNodo} from '../mappa.ts';
import {nomeDi, nomeSblocco} from './dati.ts';
import {CorniceDisegnata, Cordicella, Definizioni, FELTRO, FETTA_CORNICE, Freccia, immagine, percorsiCordicella, Postit, Puntina, Riga, Sporco, Stella} from './disegno.tsx';
import {useMovimentoRidotto} from './Ritratto.tsx';
import {caricaBacheca, salvaBacheca} from './salvataggio.ts';

type Props = {c: Carriera; s: Stato; azione: (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => void;
  onRiprendi: () => void; onAchievement: () => void; onNuovoGiro: () => void; onElenco: () => void; onStato: () => void};

const DESCRIZIONE: Record<StatoNodo, string> = {
  corrente: 'Sei qui.', disponibile: 'Disponibile: toccalo per entrare.', bloccato: 'Raggiunto, ma per ora chiuso.',
  fatto: 'Fatto in questo giro.', aperto: 'Ancora raggiungibile in questo giro.', escluso: 'Chiuso in questo giro: un\'altra scelta l\'ha escluso.',
  nascosto: '',
};

/** Lo spazio per i pulsanti in alto, in verticale: due righe di pulsanti (Fase I). */
export const ALTO_VERTICALE = 92;

function useMisura() {
  const [m, setM] = useState({w: window.innerWidth, h: window.innerHeight});
  useEffect(() => {
    const f = () => setM({w: window.innerWidth, h: window.innerHeight});
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return m;
}

/** La lettera allentata: dove sta (il suo posto nel titolo, misurato sul disegno) e cosa sta facendo. */
type FaseLettera = 'attesa' | 'trema' | 'cade' | 'giu' | 'trascina' | 'ricade' | 'rientra' | 'fine';
type Posto = {x: number; y: number; c: string; colore: string; ruota: number; fs: number; riga: number; indice: number};

export function Bacheca({c, s, azione, onRiprendi, onAchievement, onNuovoGiro, onElenco, onStato}: Props) {
  const {w, h} = useMisura();
  const verticale = h > w;
  const g = s.giro;
  const ultimo = g.nodo ?? g.visti.at(-1) ?? null;  // «sei qui»: dove si è, o l'ultimo nodo lasciato
  const comp = componi(c, s, ultimo, `Serraglio — carriera: ${c.titolo}`, verticale ? 12 : 13);
  // Spazio per i pulsanti: in orizzontale una fila in basso; in verticale una fila in alto e «Continua» in basso.
  // In verticale i pulsanti in alto stanno su due righe (Fase I): più spazio sopra la bacheca.
  const d = disponi(comp, w, h, verticale ? ALTO_VERTICALE : 0, verticale ? 64 : 58);
  const {p, fs, fx, fy, fw, fh, T} = d;
  const [scelto, setScelto] = useState<string | null>(null);
  const [legendaAperta, setLegendaAperta] = useState(false);
  const sel = comp.punti.find(x => x.id === scelto) ?? null;
  const disponibili = comp.punti.filter(x => x.stato === 'disponibile' && x.tipo === 'nodo');
  const corrente = g.nodo ? trovaNodo(c, g.nodo) : null;
  const entraIn = (id: string) => azione((cc, ss) => entra(cc, ss, id));
  const cornice = immagine('cornice.webp');
  const larghezza = (n: Punto) => Math.max(...n.titolo.map(t => t.length)) * CARATTERE_LETTERA * (n.tipo === 'finale' ? fs * 0.9 : fs);

  // ------------------------------------------------------------------------------------------------------------------------------
  // Fase G: cosa è cambiato dall'ultima volta che si è vista questa bacheca, deciso una volta sola all'apertura.
  const ridotto = useMovimentoRidotto();
  const [apertura] = useState(() => {
    const m = caricaBacheca(c.id);
    const esiste = (id: string | null | undefined) => !!id && comp.punti.some(n => n.id === id);
    const caduta = m?.caduta && esiste(m.caduta.id) ? m.caduta : null;
    const rimesse = m?.rimesse ?? 0;
    const forza = new URLSearchParams(window.location.search).has('allenta');  // per le catture e la registrazione
    const allenta = !ridotto && !caduta && (forza || siAllenta(`${c.id}:allenta:${g.numero}:${g.visti.length}`, false))
      ? letteraAllentata(comp.punti, `${c.id}:quale:${rimesse}`) : null;
    const chiusi = comp.punti.filter(n => n.postit && n.stato === 'escluso').map(n => n.id);
    return {
      // Fase I: i nodi che si sono chiusi dall'ultima volta, nello stesso giro: il loro post-it si strappa o si accartoccia davanti a noi.
      chiusi: !ridotto && m ? chiusiOra({giro: m.giro ?? -1, chiusi: m.chiusi ?? []}, g.numero, chiusi) : [],
      scoperti: m && !ridotto ? scoperti(m.postit, comp.punti) : [],
      da: m && !ridotto && m.seiQui !== ultimo && esiste(m.seiQui) && esiste(ultimo) ? m.seiQui : null,
      caduta, rimesse, allenta,
    };
  });
  const [lettera] = useState<Allentata | null>(apertura.caduta ?? apertura.allenta);
  const [fase, setFase] = useState<FaseLettera>(apertura.caduta ? 'giu' : apertura.allenta ? 'attesa' : 'fine');
  const [rimesse, setRimesse] = useState(apertura.rimesse);
  const [viaggioFatto, setViaggioFatto] = useState(!apertura.da);
  const [postitFatti, setPostitFatti] = useState(!apertura.scoperti.length);
  const [danniFatti, setDanniFatti] = useState(!apertura.chiusi.length);
  // Fase H: la mosca di questa apertura (una volta su due), e cosa le succede se la si tocca.
  // ?mosca e ?angolo (per le catture e le registrazioni) fanno arrivare subito la mosca e presto un angolo di post-it.
  const cerca = new URLSearchParams(window.location.search);
  const [piano] = useState<PianoMosca | null>(() => ridotto ? null : pianoMosca(`${c.id}:${g.numero}:${g.visti.length}`, cerca.has('mosca')));
  const presto = cerca.has('angolo');
  const [schiacciata, setSchiacciata] = useState<Pt | null>(null);
  const fuga = useRef<{da: Pt; t0: number} | null>(null);
  const moscaQui = useRef<Pt>({x: -1, y: -1});
  const caduta = lettera && fase !== 'attesa' && fase !== 'trema' && fase !== 'fine' && fase !== 'rientra' ? lettera : null;
  // La memoria si aggiorna a ogni cambio: «sei qui», post-it, lettera caduta, lettere rimesse.
  const postitOra = comp.punti.filter(n => n.postit).map(n => n.id).join(',');
  const chiusiAdesso = comp.punti.filter(n => n.postit && n.stato === 'escluso').map(n => n.id).join(',');
  useEffect(() => {
    salvaBacheca(c.id, {seiQui: ultimo, postit: postitOra ? postitOra.split(',') : [], caduta: caduta ? {id: caduta.id, k: caduta.k} : null, rimesse,
      chiusi: chiusiAdesso ? chiusiAdesso.split(',') : [], giro: g.numero});
  }, [c.id, ultimo, postitOra, caduta, rimesse, chiusiAdesso, g.numero]);

  // Il posto della lettera allentata: dal disegno delle lettere (riga e posizione del carattere), non da una stima.
  const [posto, setPosto] = useState<Posto | null>(null);
  const nodoLettera = lettera ? comp.punti.find(n => n.id === lettera.id) ?? null : null;
  const dove = nodoLettera && lettera ? trovaLettera(nodoLettera.titolo, lettera.k) : null;
  useLayoutEffect(() => {
    if (!nodoLettera || !dove) { setPosto(null); return; }
    const t = document.querySelector<SVGTextElement>(`text[data-riga="${nodoLettera.id}:${dove.riga}"]`);
    if (!t) return;
    const q = t.getStartPositionOfChar(dove.indice), l = nodoLettera.titolo[dove.riga][dove.indice];
    const nuovo = {x: q.x, y: q.y, c: l.c, colore: l.colore, ruota: l.ruota, fs: Number(t.getAttribute('font-size')), riga: dove.riga, indice: dove.indice};
    setPosto(x => x && x.x === nuovo.x && x.y === nuovo.y && x.fs === nuovo.fs ? x : nuovo);
  }, [nodoLettera?.id, dove?.riga, dove?.indice, w, h]);
  const giu: Pt = useMemo(() => {
    const r = caso(`${c.id}:giu:${rimesse}`);
    // In verticale il fondo della cornice sta sotto «Continua»: la lettera cade appena sopra, fra i due finali, dove la si può riprendere.
    return verticale ? {x: fx + fw * (0.42 + r() * 0.12), y: d.fondo - 64 - p * 0.4} : {x: fx + fw * (0.3 + r() * 0.2), y: d.fondo};
  }, [c.id, rimesse, fx, fw, verticale, d.fondo, p]);
  const gira = useMemo(() => 70 + caso(`${c.id}:gira:${rimesse}`)() * 50, [c.id, rimesse]);

  // L'orologio e il ciclo dei fotogrammi: tocca il DOM dello strato di sopra, senza ridisegnare la bacheca; lo stato di React cambia
  // solo ai passaggi (viaggio finito, post-it caduto, lettera che cade o torna).
  const sopra = useRef<SVGSVGElement>(null);
  const orologio = useRef(0), colpo = useRef<number | null>(null);
  const fermo = !!sel || legendaAperta || fase === 'trascina';
  const fermoRif = useRef(fermo);
  fermoRif.current = fermo;
  const faseRif = useRef({fase, inizio: 0});
  if (faseRif.current.fase !== fase) faseRif.current = {fase, inizio: orologio.current};
  const trascinata = useRef<Pt | null>(null);
  const fili = useMemo(() => comp.fili.filter(f => d.pos[f.da] && d.pos[f.a]).map(f => {
    const a = d.pos[f.da], b = d.pos[f.a];
    const seme = `${f.da}>${f.a}`;
    return {seme, tipo: f.tipo, a, cat: catenaria(a, b, f.tipo), amp: ampiezzaFilo(f.tipo, Math.hypot(b.x - a.x, b.y - a.y)), ritmo: ritmo(seme), coda: ritmo(seme + ':coda')};
  }), [comp.fili, d.pos]);
  // I post-it ancora coperti, con la loro posizione: uno di loro ogni tanto solleva un angolo.
  const angoli = useMemo(() => comp.punti.filter(n => n.postit && d.postitY[n.id] !== undefined).map(n => ({
    trasforma: `translate(${d.pos[n.id].x} ${d.postitY[n.id]}) rotate(${n.inclinazione})`, w: d.postit.w, h: d.postit.h,
  })), [comp.punti, d.pos, d.postitY, d.postit]);
  const toccaMosca = (ev: React.PointerEvent) => {
    ev.stopPropagation();
    if (!piano || fuga.current || schiacciata) return;
    if (toccataMosca(`${c.id}:${g.numero}:${g.visti.length}`) === 'vola') {
      fuga.current = {da: {x: (moscaQui.current.x - fx) / fw, y: (moscaQui.current.y - fy) / fh}, t0: orologio.current};
      colpo.current = orologio.current;
    } else setSchiacciata({...moscaQui.current});
  };
  const inizioViaggio = TEMPI.viaggio + (apertura.scoperti.length ? TEMPI.staccoPostit - TEMPI.postit : 0);
  const fineAperture = apertura.da ? inizioViaggio + TEMPI.durataViaggio : apertura.scoperti.length ? TEMPI.postit + TEMPI.staccoPostit : 0;

  useEffect(() => {
    if (ridotto) return;
    const svg = sopra.current;
    if (!svg) return;
    // Gli elementi da muovere si cercano una volta sola, non a ogni fotogramma.
    const corde = fili.map(f => {
      const e = svg.querySelector<SVGGElement>(`[data-filo="${f.seme}"]`);
      return {f, corda: e ? [...e.querySelectorAll('.corda')] : [], ombra: e?.querySelector('.ombra') ?? null, coda: e?.querySelector('.coda') ?? null};
    }).filter(x => x.f.tipo === 'arrotolata' ? x.coda : x.f.amp && x.corda.length);
    let id = 0, prima: number | null = null, ultimeCorde = -1, angoloK = 0;
    const angolo = svg.querySelector('[data-angolo]'), moscaG = svg.querySelector<SVGGElement>('[data-mosca]');
    // I passaggi si annunciano a React una volta sola: chiamarlo a ogni fotogramma lo farebbe ridisegnare tutta la bacheca per niente.
    let postitAnnunciati = postitFatti, viaggioAnnunciato = viaggioFatto, dannoFinito = danniFatti || !apertura.chiusi.length;
    const passo = (ora: number) => {
      const dt = prima === null ? 0 : Math.min(0.1, (ora - prima) / 1000);
      prima = ora;
      if (!fermoRif.current) orologio.current += dt;
      const t = orologio.current;
      // Cordicelle che penzolano: oscillano piano, di più dopo un colpo; le tese no. A trenta fotogrammi al secondo, e niente se l'orologio
      // è fermo (cartoncino o legenda aperti).
      if (t - ultimeCorde >= PASSO_CORDICELLE) {
        ultimeCorde = t;
        const agita = agitazione(colpo.current === null ? null : t - colpo.current);
        for (const {f, corda, ombra, coda} of corde) {
          if (coda) { coda.setAttribute('transform', `rotate(${(4 * agita * oscillazioneDi(t, f.coda)).toFixed(2)} ${f.a.x} ${f.a.y})`); continue; }
          const q = percorsiCordicella({punti: filoMosso(f.cat.punti, f.cat.distacco, f.amp * agita * oscillazioneDi(t, f.ritmo)), distacco: f.cat.distacco});
          for (const x of corda) x.setAttribute('d', q.d);
          ombra?.setAttribute('d', q.ombra);
        }
      }
      // Il post-it di un nodo appena scoperto si stacca e cade.
      if (!postitAnnunciati) for (const n of apertura.scoperti) {
        const q = staccoPostit(t - TEMPI.postit, d.fondo - d.postitY[n]);
        const e = svg.querySelector(`[data-cade="${n}"]`);
        e?.setAttribute('transform', `translate(0 ${q.dy.toFixed(1)}) rotate(${q.ruota.toFixed(1)} ${d.pos[n].x} ${d.pos[n].y})`);
        e?.setAttribute('opacity', q.opacita.toFixed(2));
      }
      if (!postitAnnunciati && t > TEMPI.postit + TEMPI.staccoPostit) { postitAnnunciati = true; setPostitFatti(true); }
      // La puntina «sei qui» che viaggia, con la cordicella nuova che si tende dietro di lei.
      if (!viaggioAnnunciato && apertura.da && ultimo) {
        const tv = (t - inizioViaggio) / TEMPI.durataViaggio, da = d.pos[apertura.da], a = d.pos[ultimo];
        if (tv >= 0 && colpo.current === null) colpo.current = t;
        const q = tv < 0 ? {x: da.x, y: da.y, alza: 0, scala: 1} : viaggio(tv, da, a);
        svg.querySelector('[data-viaggio]')?.setAttribute('transform', `translate(${(q.x - a.x).toFixed(1)} ${(q.y - a.y).toFixed(1)}) translate(${a.x} ${a.y}) scale(${q.scala.toFixed(3)}) translate(${-a.x} ${-a.y})`);
        svg.querySelector('[data-ombra-viaggio]')?.setAttribute('transform', `translate(${(q.x - a.x + q.alza * 10).toFixed(1)} ${(q.y - a.y + q.alza * 14).toFixed(1)})`);
        svg.querySelector('[data-ombra-viaggio]')?.setAttribute('opacity', (q.alza * 0.5).toFixed(2));
        const filo = svg.querySelector('[data-filo-viaggio]');
        filo?.setAttribute('x2', q.x.toFixed(1)); filo?.setAttribute('y2', q.y.toFixed(1));
        filo?.setAttribute('opacity', tv < 0 ? '0' : '1');
        if (tv >= 1) { viaggioAnnunciato = true; setViaggioFatto(true); }
      }
      // Fase I: i post-it dei nodi appena chiusi. Strappo: il pezzo che manca si stacca e cade. Accartocciato: la carta intera sopra si
      // stringe e sparisce, sotto resta quella accartocciata.
      if (!dannoFinito) {
        for (const id of apertura.chiusi) {
          const e = svg.querySelector(`[data-danno-anim="${id}"]`);
          if (!e) continue;
          if (danno(id) === 'strappo') {
            const q = staccoPostit(t - TEMPO_DANNO.inizio, d.fondo - d.postitY[id]);
            e.querySelector('.pezzo')?.setAttribute('transform', `translate(0 ${q.dy.toFixed(1)}) rotate(${(q.ruota * 1.5).toFixed(1)} ${d.postit.w / 2} ${d.postit.h})`);
            e.setAttribute('opacity', q.opacita.toFixed(2));
          } else {
            const a = avanzaDanno(t), s = accartoccia(id, d.postit.w, d.postit.h).scala;
            e.querySelector('.intero')?.setAttribute('transform', `scale(${(1 - (1 - s) * a).toFixed(3)})`);
            e.setAttribute('opacity', (1 - a).toFixed(2));
          }
        }
        if (t > TEMPO_DANNO.inizio + Math.max(TEMPO_DANNO.durata, 1.6)) { dannoFinito = true; setDanniFatti(true); }
      }
      // Fase H: ogni tanto un angolo di post-it si solleva e ricade, come per uno spiffero.
      if (angoli.length) {
        while (t > prossimoAngolo(c.id, angoloK, presto) + DURATA_ANGOLO) angoloK++;
        const t0 = prossimoAngolo(c.id, angoloK, presto), su = angoloPostit(t - t0);
        const a = angoli[Math.floor(caso(`${c.id}:quale-angolo:${angoloK}`)() * angoli.length)];
        if (angolo) {
          angolo.setAttribute('display', su > 0.01 ? 'inline' : 'none');
          if (su > 0.01) {
            const s = su * p * 1.4, X = a.w / 2, Y = a.h;
            angolo.setAttribute('transform', a.trasforma);
            angolo.querySelector('.buco')?.setAttribute('d', `M${X - s},${Y} L${X},${Y - s} L${X},${Y} Z`);
            angolo.querySelector('.lembo')?.setAttribute('d', `M${X - s},${Y} L${X},${Y - s} L${X - s * 0.95},${Y - s * 0.95} Z`);
            angolo.querySelector('.ombra-lembo')?.setAttribute('d', `M${X - s},${Y} L${X},${Y - s} L${X - s * 0.8 + 3},${Y - s * 0.8 + 4} Z`);
          }
        }
      }
      // Fase H: la mosca. Arriva in volo, passeggia, se ne va; toccata, vola via in fretta (o si schiaccia: lo disegna React).
      if (piano && moscaG) {
        const tm = t - piano.inizio;
        let q = mosca(piano, tm);
        if (fuga.current) {
          const u = Math.min(1, (t - fuga.current.t0) / (VOLO * 0.5));
          q = {x: fuga.current.da.x + (piano.via.x - fuga.current.da.x) * u * u, y: fuga.current.da.y + (piano.via.y - fuga.current.da.y) * u * u, angolo: q.angolo, ali: 1, fase: u >= 1 ? 'andata' : 'via'};
        }
        const visibile = q.fase !== 'prima' && q.fase !== 'andata' && tm < durataMosca(piano) + 0.1;
        moscaG.setAttribute('display', visibile ? 'inline' : 'none');
        if (visibile) {
          const x = fx + q.x * fw, y = fy + q.y * fh;
          moscaQui.current = {x, y};
          moscaG.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${q.angolo.toFixed(1)})`);
          const ali = q.ali ? 0.35 + 0.65 * Math.abs(Math.sin(t * 90)) : 1;
          moscaG.querySelector('.ali')?.setAttribute('transform', `scale(${ali.toFixed(2)} 1)`);
          moscaG.dataset.fase = q.fase;
        }
      }
      // La lettera allentata: aspetta che la bacheca sia ferma da un po', tremola, cade in fondo alla cornice.
      const fl = faseRif.current, e = svg.querySelector('[data-lettera]');
      if (fl.fase === 'attesa' && t > fineAperture + TEMPI.allenta) setFase('trema');
      if (posto && e) {
        const tf = t - fl.inizio, cx = posto.x + posto.fs * 0.2, cy = posto.y - posto.fs * 0.7;
        let tr = '';
        if (fl.fase === 'trema') {
          tr = `rotate(${tremolio(tf).toFixed(2)} ${cx} ${cy})`;
          if (tf >= TEMPI.tremolio) setFase('cade');
        } else if (fl.fase === 'cade' || fl.fase === 'ricade') {
          const da = fl.fase === 'cade' ? {x: posto.x, y: posto.y} : trascinata.current ?? giu;
          const q = cadutaLettera(tf, da, giu, gira);
          tr = `translate(${(q.x - posto.x).toFixed(1)} ${(q.y - posto.y).toFixed(1)}) rotate(${q.ruota.toFixed(1)} ${cx} ${cy})`;
          if (tf >= TEMPI.caduta) setFase('giu');
        } else if (fl.fase === 'rientra') {
          const da = trascinata.current ?? giu, u = Math.min(1, tf / TEMPI.rientro);
          tr = `translate(${((da.x - posto.x) * (1 - u)).toFixed(1)} ${((da.y - posto.y) * (1 - u)).toFixed(1)})`;
          if (u >= 1) setFase('fine');
        }
        if (tr) e.setAttribute('transform', tr);
      }
      id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [ridotto, fili, apertura, d, ultimo, posto, giu, gira, inizioViaggio, fineAperture, angoli, piano, schiacciata, presto, danniFatti]);

  // Trascinare la lettera caduta: lasciata vicino al suo posto ci torna (e resta), altrove ricade in fondo.
  const punto = (ev: React.PointerEvent) => { const r = sopra.current!.getBoundingClientRect(); return {x: ev.clientX - r.left, y: ev.clientY - r.top}; };
  const presa = useRef<Pt>({x: 0, y: 0});
  const giuTrasforma = posto ? `translate(${(giu.x - posto.x).toFixed(1)} ${(giu.y - posto.y).toFixed(1)}) rotate(${gira.toFixed(1)} ${posto.x + posto.fs * 0.2} ${posto.y - posto.fs * 0.7})` : '';
  const prendi = (ev: React.PointerEvent<SVGCircleElement>) => {
    if (fase !== 'giu' || !posto) return;
    ev.stopPropagation();
    ev.currentTarget.setPointerCapture(ev.pointerId);
    const q = punto(ev);
    presa.current = {x: q.x - giu.x, y: q.y - giu.y};
    trascinata.current = {...giu};
    setFase('trascina');
  };
  const muovi = (ev: React.PointerEvent<SVGCircleElement>) => {
    if (fase !== 'trascina' || !posto) return;
    const q = punto(ev), l = {x: q.x - presa.current.x, y: q.y - presa.current.y};
    trascinata.current = l;
    sopra.current?.querySelector('[data-lettera]')?.setAttribute('transform', `translate(${(l.x - posto.x).toFixed(1)} ${(l.y - posto.y).toFixed(1)})`);
  };
  const lascia = () => {
    if (fase !== 'trascina' || !posto || !trascinata.current) return;
    if (alPosto(trascinata.current, posto, posto.fs * 0.9)) {
      const n = rimesse + 1;
      setRimesse(n);
      if (premioLettere(n)) azione((cc, ss) => ottieniAchievement(cc, ss, PREMIO_LETTERE.id));
      setFase(ridotto ? 'fine' : 'rientra');
    } else setFase(ridotto ? 'giu' : 'ricade');
  };

  // Lettere, post-it, stelle e frecce; per ogni punto anche l'area da toccare.
  const nascondi = (id: string, i: number) => lettera && posto && lettera.id === id && posto.riga === i && fase !== 'attesa' && fase !== 'fine' ? posto.indice : undefined;
  const elementi: ReactNode[] = [];
  const aree: ReactNode[] = [];
  for (const n of comp.punti) {
    const e = d.etichette[n.id], sp = d.pos[n.id];
    let box: {x: number; y: number; w: number; h: number};
    if (n.postit) {
      const {w: pw, h: ph} = d.postit;
      const py = d.postitY[n.id];
      elementi.push(<Postit key={`p-${n.id}`} x={sp.x} y={py} w={pw} h={ph} ruota={n.inclinazione} fs={p * 2}
        danno={n.stato === 'escluso' ? {tipo: danno(n.id), seme: n.id} : undefined} />);
      if (n.freccia) elementi.push(<Freccia key={`f-${n.id}`} x={sp.x - pw / 2 - fs * 0.75} y={py + ph * 0.62} fs={fs} />);
      box = {x: sp.x - pw / 2 - (n.freccia ? fs * 0.8 : 0), y: Math.min(sp.y - p, py), w: pw + (n.freccia ? fs * 0.8 : 0), h: py + ph - Math.min(sp.y - p, py)};
    } else {
      if (n.tipo === 'finale') elementi.push(<Stella key={`s-${n.id}`} x={e.x - fs * 0.32} y={e.y - fs * 0.3} r={fs * 0.26} colore={n.titolo[0][0]?.colore ?? '#e6d9b2'} />);
      n.titolo.forEach((riga, i) => {
        const fsRiga = n.tipo === 'finale' ? fs * 0.9 : fs;
        if (n.freccia && i === 0) {
          const xf = e.ancora === 'middle' ? e.x - (riga.length * CARATTERE_LETTERA * fsRiga) / 2 - fs * 0.85 : e.x - fs * 0.8;
          elementi.push(<Freccia key={`f-${n.id}`} x={xf} y={e.y} fs={fs} />);
        }
        elementi.push(<Riga key={`t-${n.id}-${i}`} lettere={riga} x={e.x} y={e.y + i * p * 2} fs={fsRiga} ancora={e.ancora} riga={`${n.id}:${i}`} nascosta={nascondi(n.id, i)} />);
      });
      const lw = larghezza(n), righe = n.titolo.length;
      box = e.ancora === 'middle'
        ? {x: e.x - lw / 2 - p, y: sp.y - p, w: lw + p * 2, h: e.y - sp.y + p * 1.6 + (righe - 1) * p * 2}
        : {x: sp.x - p, y: sp.y - p * 1.2, w: e.x - sp.x + lw + p * 2, h: p * (1.6 + righe * 2)};
    }
    aree.push(
      <rect key={`a-${n.id}`} x={box.x} y={box.y} width={box.w} height={box.h} fill="transparent" className={`area ${n.stato}`}
        data-testid={`nodo-${n.id}`} data-stato={n.stato} role="button" aria-label={n.postit ? '???' : n.titolo.map(r => r.map(l => l.c).join('')).join(' ')}
        onClick={() => n.stato === 'disponibile' && n.tipo === 'nodo' ? entraIn(n.id) : setScelto(n.id)} />,
    );
  }

  // Lettere cadute in fondo alla cornice (dai nodi esclusi) e una di sempre, decise dai dati.
  const r = caso(`${c.id}:cadute`);
  const cadute = [...comp.punti.flatMap(n => n.caduta ? [n.caduta] : []), {c: 'E', ruota: 96, dy: 0, colore: '#d2b97c'}];
  const cartoncinoLegenda = (l: NonNullable<typeof legenda>) => (
    <g transform={`translate(${l.x} ${l.y}) rotate(${verticale ? -1 : 1.5})`} data-testid={verticale ? undefined : 'legenda'}>
      <rect x={3} y={4} width={l.w} height={l.h} fill="rgba(0,0,0,.45)" filter="url(#sfoca)" />
      <rect width={l.w} height={l.h} fill="#efe8d6" />
      {l.righe.map((t, i) => <text key={i} x={p * 0.6} y={p * (1.7 + i * (verticale ? 1.25 : 1.15))} fontSize={p * (verticale ? 1.0 : 0.82)} className="scritta">{t}</text>)}
    </g>
  );
  const colori = [...new Set(comp.punti.map(x => x.spillo.colore))];
  const legenda = d.legenda ?? (legendaAperta ? {x: fx + p * 2, y: fy + ALTO_VERTICALE + 14, w: fw - p * 4, h: p * (LEGENDA.length * 1.25 + 1.4), righe: LEGENDA} : null);
  // Durante il viaggio la puntina «sei qui» e la sua cordicella nuova le disegna il movimento, non lo strato fermo.
  const inViaggio = !viaggioFatto && !!apertura.da && !!ultimo;
  const filoNuovo = inViaggio ? comp.fili.find(f => f.da === apertura.da && f.a === ultimo) : undefined;
  const seiQui = ultimo ? comp.punti.find(n => n.id === ultimo) : undefined;
  const letteraMossa = posto && lettera && fase !== 'attesa' && fase !== 'fine';

  return (
    <div className="bacheca" data-testid="mappa" data-movimento={ridotto ? 'ridotto' : fermo ? 'fermo' : 'si'}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Definizioni d={d} colori={colori} />
        {!cornice && <CorniceDisegnata w={w} h={h} T={T} />}

        {/* Feltro: colore, pelo, aloni, sporco e parti consunte, scanalature a passo esatto, bordo in ombra. Provato a farne
            un'immagine in memoria disegnata una volta sola: nessun guadagno misurabile (rapporto della Fase D), quindi resta dal vivo. */}
        <rect x={fx} y={fy} width={fw} height={fh} fill={FELTRO} />
        <rect x={fx} y={fy} width={fw} height={fh} filter="url(#aloni)" opacity={0.5} />
        <rect x={fx} y={fy} width={fw} height={fh} filter="url(#pelo)" />
        <Sporco macchie={sporco(`${c.id}:sporco:${verticale ? 'v' : 'o'}`)} d={d} />
        <rect x={fx} y={fy} width={fw} height={fh} fill="url(#scanalature)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="url(#ombra-bordo)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke="rgba(0,0,0,.7)" strokeWidth={3} />

        {/* Intestazione del listino e titolo dei finali */}
        {d.testate.map((t, i) => <Riga key={i} lettere={t} x={fx + fw / 2} y={d.yTestata + i * p * 2} fs={d.testataFs} ancora="middle" />)}
        <Riga lettere={comp.sottotitolo} x={fx + fw / 2} y={d.ySotto} fs={fs * 0.62} ancora="middle" />
        <Riga lettere={comp.titoloFinali} x={d.xTitoloFinali} y={d.yFinali} fs={fs * 0.7} ancora={verticale ? 'middle' : 'start'} />

        {/* Livelli (giudizio del proprietario sulla Fase D): lettere cadute, cartoncino della legenda, lettere e post-it sul feltro; sopra,
            nello strato che si muove, le cordicelle tese fra gli spilli, con la loro ombra, e in cima le teste delle puntine. */}
        {cadute.map((l, i) => <Riga key={`c-${i}`} lettere={[{...l, dy: 0}]} x={fx + fw * (verticale ? 0.82 + i * 0.07 : 0.62 + i * 0.06 + r() * 0.03)} y={d.fondo} fs={fs * 0.9} />)}
        {legenda && !verticale && cartoncinoLegenda(legenda)}
        {elementi}
      </svg>

      {/* Fase H: la luce e l'ombra delle lampade del bar, che oscillano piano sulla bacheca (un'animazione CSS, ferma se si legge). */}
      {!ridotto && <div className={`lampade${fermo ? ' ferme' : ''}`} style={{left: fx, top: fy, width: fw, height: fh}} aria-hidden="true" />}
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="sopra" ref={sopra}>
        {/* Un tocco sul feltro scuote un poco le cordicelle. */}
        <rect x={fx} y={fy} width={fw} height={fh} fill="transparent" onPointerDown={() => { colpo.current = orologio.current; }} />
        {!postitFatti && apertura.scoperti.map(id => {
          const n = comp.punti.find(x => x.id === id)!, {w: pw, h: ph} = d.postit;
          return <g key={`cade-${id}`} data-cade={id}><Postit x={d.pos[id].x} y={d.postitY[id]} w={pw} h={ph} ruota={n.inclinazione} fs={p * 2} /></g>;
        })}
        {/* Fase I: i post-it dei nodi appena chiusi che si strappano (il pezzo cade) o si accartocciano (la carta intera sparisce). */}
        {!danniFatti && apertura.chiusi.map(id => {
          const n = comp.punti.find(x => x.id === id);
          if (!n) return null;
          const {w: pw, h: ph} = d.postit, tr = `translate(${d.pos[id].x} ${d.postitY[id]}) rotate(${n.inclinazione})`;
          if (danno(id) === 'strappo') {
            const pezzo = strappo(id, pw, ph).pezzo;
            return <g key={`danno-${id}`} data-danno-anim={id} transform={tr} pointerEvents="none">
              <path className="pezzo" d={'M' + pezzo.map(q => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' L') + ' Z'} fill="url(#carta-postit)" stroke="rgba(0,0,0,.12)" strokeWidth={0.6} />
            </g>;
          }
          return <g key={`danno-${id}`} data-danno-anim={id} pointerEvents="none">
            <g className="intero-esterno"><g transform={tr}><g className="intero"><Postit x={0} y={0} w={pw} h={ph} ruota={0} fs={p * 2} /></g></g></g>
          </g>;
        })}
        {/* L'angolo di post-it che si solleva: sotto si vede il feltro, sopra il retro della carta. */}
        {angoli.length > 0 && (
          <g data-angolo display="none" pointerEvents="none">
            <path className="buco" fill={FELTRO} />
            <path className="ombra-lembo" fill="rgba(0,0,0,.35)" filter="url(#sfoca-poco)" />
            <path className="lembo" fill="#e9d77e" stroke="rgba(0,0,0,.15)" strokeWidth={0.6} />
          </g>
        )}
        {letteraMossa && (
          <text data-lettera x={posto.x} y={posto.y} fontSize={posto.fs} className={`lettere lettera-mossa ${fase}`} filter="url(#plastica)" fill={posto.colore}
            transform={fase === 'giu' ? giuTrasforma : undefined} data-testid="lettera-caduta" data-fase={fase} pointerEvents="none">
            <tspan rotate={posto.ruota.toFixed(2)}>{posto.c}</tspan>
          </text>
        )}
        {comp.fili.filter(f => f !== filoNuovo).map(f => <Cordicella key={`${f.da}>${f.a}`} a={d.pos[f.da]} b={d.pos[f.a]} tipo={f.tipo} rossa={f.sconfitta} seme={`${f.da}>${f.a}`} />)}
        {comp.punti.filter(n => !(inViaggio && n.id === ultimo)).map(n => <Puntina key={n.id} id={n.id} x={d.pos[n.id].x} y={d.pos[n.id].y} lato={d.lato[n.id]} s={n.spillo} />)}
        {inViaggio && seiQui && (
          <g data-testid="viaggio">
            {filoNuovo && <line data-filo-viaggio x1={d.pos[apertura.da!].x} y1={d.pos[apertura.da!].y} x2={d.pos[apertura.da!].x} y2={d.pos[apertura.da!].y}
              stroke={filoNuovo.sconfitta ? '#b4493b' : '#cdb88c'} strokeWidth={1.8} strokeDasharray="3 1.2" opacity={0} />}
            <ellipse data-ombra-viaggio cx={d.pos[ultimo!].x} cy={d.pos[ultimo!].y} rx={d.lato[ultimo!] * 0.2} ry={d.lato[ultimo!] * 0.14} fill="rgba(0,0,0,.6)" filter="url(#sfoca-poco)" opacity={0} />
            <g data-viaggio><Puntina id={`${ultimo}-viaggio`} x={d.pos[ultimo!].x} y={d.pos[ultimo!].y} lato={d.lato[ultimo!]} s={{...seiQui.spillo, colore: ROSSO_SEI_QUI}} /></g>
          </g>
        )}
        {legenda && !verticale && <Puntina id="legenda" x={legenda.x + legenda.w / 2} y={legenda.y + p * 0.5} lato={latoPuntina(p, verticale, false)} s={{forma: 'ottone', colore: '#d4a944', inclinazione: 0}} />}
        {/* In verticale la legenda si apre sopra la mappa, a richiesta */}
        {legenda && verticale && <g data-testid="legenda" onClick={() => setLegendaAperta(false)}>{cartoncinoLegenda(legenda)}
          <Puntina id="legenda" x={legenda.x + legenda.w / 2} y={legenda.y + p * 0.5} lato={latoPuntina(p, verticale, false)} s={{forma: 'ottone', colore: '#d4a944', inclinazione: 0}} /></g>}
        {aree}
        {/* La mosca: sopra tutto, così la si può toccare; schiacciata, resta una macchiolina che svanisce. */}
        {piano && !schiacciata && (
          <g data-mosca display="none" data-testid="mosca">
            <g transform="scale(1.4)">
            <ellipse cx={1.5} cy={2.5} rx={p * 0.22} ry={p * 0.32} fill="rgba(0,0,0,.35)" filter="url(#sfoca-poco)" />
            <g className="ali" opacity={0.55}>
              <ellipse cx={-p * 0.22} cy={p * 0.05} rx={p * 0.2} ry={p * 0.34} fill="#cfd6dc" transform={`rotate(-25 ${-p * 0.22} ${p * 0.05})`} />
              <ellipse cx={p * 0.22} cy={p * 0.05} rx={p * 0.2} ry={p * 0.34} fill="#cfd6dc" transform={`rotate(25 ${p * 0.22} ${p * 0.05})`} />
            </g>
            <ellipse cx={0} cy={p * 0.08} rx={p * 0.13} ry={p * 0.27} fill="#1b1b1e" />
            <circle cx={0} cy={-p * 0.22} r={p * 0.11} fill="#2a1a1a" />
            <circle cx={-p * 0.06} cy={-p * 0.25} r={p * 0.05} fill="#7a2020" /><circle cx={p * 0.06} cy={-p * 0.25} r={p * 0.05} fill="#7a2020" />
            </g>
            <circle cx={0} cy={0} r={Math.max(22, p * 1.2)} fill="transparent" onPointerDown={toccaMosca} />
          </g>
        )}
        {schiacciata && <g data-testid="mosca-schiacciata" className="schiacciata" transform={`translate(${schiacciata.x} ${schiacciata.y})`} pointerEvents="none">
          <ellipse rx={p * 0.28} ry={p * 0.2} fill="#1b1b1e" opacity={0.8} /><ellipse cx={p * 0.2} cy={p * 0.1} rx={p * 0.12} ry={p * 0.06} fill="#5a1414" opacity={0.6} />
        </g>}
        {letteraMossa && (fase === 'giu' || fase === 'trascina') && (
          // Sopra le aree, così la si prende anche dove sta sotto un titolo; un cerchio largo da toccare con il dito, che tiene il puntatore
          // mentre la si trascina.
          <circle cx={giu.x + posto.fs * 0.2} cy={giu.y - posto.fs * 0.35} r={Math.max(22, posto.fs * 0.7)} fill="transparent" className="presa"
            data-testid="presa-lettera" onPointerDown={prendi} onPointerMove={muovi} onPointerUp={lascia} onPointerCancel={lascia} />
        )}
      </svg>
      {/* La cornice generata, tagliata in nove fette: angoli fermi, lati ripetuti. */}
      {cornice && <div className="cornice" style={{borderWidth: T, borderImage: `url(${cornice}) ${FETTA_CORNICE}% round`}} />}

      <nav className="comandi-bacheca">
        <button onClick={onAchievement} data-testid="apri-achievement">Achievement</button>
        <button onClick={onNuovoGiro} data-testid="mappa-nuovo-giro">Nuovo giro</button>
        <button onClick={onStato}>Stato</button>
        <button onClick={onElenco}>Elenco</button>
        {verticale && <button onClick={() => setLegendaAperta(x => !x)} data-testid="apri-legenda">Legenda</button>}
      </nav>
      <div className="azione-bacheca">
        {disponibili.length > 0 && (
          <button className="primario" data-testid="mappa-continua" onClick={() => entraIn(disponibili[0].id)}>
            Continua: {disponibili[0].postit ? '???' : trovaNodo(c, disponibili[0].id).titolo}
          </button>
        )}
        {corrente && <button className="primario" onClick={onRiprendi}>Riprendi: {corrente.titolo}</button>}
        {g.fine && <button className="primario" onClick={onNuovoGiro}>Giro finito · Nuovo giro</button>}
      </div>
      {sel && <Cartoncino c={c} s={s} n={sel} onEntra={() => entraIn(sel.id)} onRiprendi={onRiprendi} onChiudi={() => setScelto(null)} />}
    </div>
  );
}

/** Cosa si sa di un punto toccato: un cartoncino appeso, con quello che è noto. */
function Cartoncino({c, s, n, onEntra, onRiprendi, onChiudi}: {c: Carriera; s: Stato; n: Punto; onEntra: () => void; onRiprendi: () => void; onChiudi: () => void}) {
  const noto = !n.postit;
  if (n.tipo === 'finale') {
    const f = finali(c).find(x => `fine:${x.id}` === n.id)!;
    return (
      <div className="cartoncino" data-testid="dettaglio">
        <b>Piatto del giorno — {noto ? f.titolo : '???'}</b>
        <span>{n.stato === 'fatto' ? 'Il finale di questo giro.' : n.stato === 'aperto' ? 'Ancora raggiungibile in questo giro.' : 'Non più raggiungibile in questo giro.'}
          {noto ? ' Visto in un giro.' : ' Mai visto.'}</span>
        <span className="pulsanti"><button onClick={onChiudi}>Chiudi</button></span>
      </div>
    );
  }
  const nodo = trovaNodo(c, n.id);
  const partite = nodo.passi.flatMap(p => p.tipo === 'partita' ? [p] : []);
  const sblocchi = nodo.passi.flatMap(p => p.tipo === 'sblocco' ? [p.sblocco] : []);
  return (
    <div className="cartoncino" data-testid="dettaglio">
      <b>{nodo.etichetta}{noto ? ` — ${nodo.titolo}` : ' — ???'}</b>
      <span>{DESCRIZIONE[n.stato]}</span>
      {noto && partite.map(p => (
        <span key={p.id}>{p.modo === 'duello' ? 'Duello' : 'Tutti contro tutti'}: {nomeDi(risolvi(p.giocatore, s))} contro {avversari(p, s).map(nomeDi).join(', ')}</span>
      ))}
      {noto && sblocchi.length > 0 && <span>Sblocca: {sblocchi.map(nomeSblocco).join(', ')}</span>}
      <span className="pulsanti">
        {n.stato === 'disponibile' && <button className="primario" onClick={onEntra}>Entra</button>}
        {n.stato === 'corrente' && <button className="primario" onClick={onRiprendi}>Riprendi</button>}
        <button onClick={onChiudi}>Chiudi</button>
      </span>
    </div>
  );
}
