// CA-0a, Fase C: bozzetto statico della mappa come bacheca a lettere in feltro (docs/design/carriere/bacheca.md), da giudicare.
// Tutto disegnato dal codice: feltro con scanalature a passo esatto, lettere di plastica in League Gothic con imperfezioni decise dai
// dati, spilli e cordicelle fra i punti, post-it con puntina per i «???», cornice di legno. Nessuna immagine generata.
// Secondo giro (giudizio del proprietario): lettere tondeggianti e lucide come plastica, puntine tutte diverse, macchie di vino e ditate,
// verticale centrata su tutta la larghezza.
import {useEffect, useState, type ReactNode} from 'react';
import type {Carriera} from '../formato.ts';
import {caso, componi, statoBozzetto, type Composizione, type Lettera, type Punto, type Spillo} from '../bacheca.ts';

const FELTRO = '#211d1a';
const SPAGO = '#cdb88c';
const SPAGO_ROSSO = '#b4493b';
const VINO = '#7a2232';
const CAFFE = '#b38a5c';
const CARATTERE_LETTERA = 0.42;   // larghezza media di una lettera di League Gothic con la spaziatura, in em

function useMisura() {
  const [m, setM] = useState({w: window.innerWidth, h: window.innerHeight});
  useEffect(() => {
    const f = () => setM({w: window.innerWidth, h: window.innerHeight});
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return m;
}

/** Una riga di lettere di plastica, ciascuna con la sua rotazione, il suo scarto e il suo colore; il filtro dà rilievo e lucido. */
function Riga({lettere, x, y, fs, ancora = 'start'}: {lettere: Lettera[]; x: number; y: number; fs: number; ancora?: 'start' | 'middle'}) {
  let prima = 0;
  return (
    <text x={x} y={y} fontSize={fs} textAnchor={ancora} className="lettere" filter="url(#plastica)">
      {lettere.map((l, i) => {
        const dy = (l.dy - prima) * fs;
        prima = l.dy;
        return <tspan key={i} dy={dy.toFixed(2)} rotate={l.ruota.toFixed(2)} fill={l.manca ? 'transparent' : l.colore}>{l.c === ' ' ? ' ' : l.c}</tspan>;
      })}
    </text>
  );
}

/** I simboli che League Gothic non ha, come pezzi di plastica: la freccia del disponibile e la stella dei finali. */
function Freccia({x, y, fs}: {x: number; y: number; fs: number}) {
  const a = fs * 0.62, s = fs * 0.12;
  return <path filter="url(#plastica)" fill="#f6f3ea" transform={`translate(${x} ${y - fs * 0.36})`}
    d={`M0,${-s} H${a * 0.62} V${-s * 2.6} L${a},0 L${a * 0.62},${s * 2.6} V${s} H0 Z`} />;
}
function Stella({x, y, r, colore}: {x: number; y: number; r: number; colore: string}) {
  const punti = Array.from({length: 10}, (_, i) => {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(ang) * rr).toFixed(1)},${(y + Math.sin(ang) * rr).toFixed(1)}`;
  }).join(' ');
  return <polygon points={punti} fill={colore} filter="url(#plastica)" />;
}

const schiarisci = (hex: string, t: number) => {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (255 - v) * t));
  return `rgb(${c.join(',')})`;
};
const scurisci = (hex: string, t: number) => {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * (1 - t)));
  return `rgb(${c.join(',')})`;
};

/** Puntine e spilli trovati nel cassetto: testa tonda di plastica, puntina d'ottone piatta, spillo da sarta, chiodino storto, puntina a ombrello. */
function Puntina({id, x, y, r, s}: {id: string; x: number; y: number; r: number; s: Spillo}) {
  const g = `g-${id.replace(/[^a-z0-9]/gi, '')}`;
  const ombra = <ellipse cx={x + r * 0.55} cy={y + r * 0.75} rx={r * 0.95} ry={r * 0.6} fill="rgba(0,0,0,.5)" filter="url(#sfoca-poco)" />;
  const sfera = (cx: number, cy: number, rr: number, colore: string) => (
    <>
      <radialGradient id={g} cx=".33" cy=".3" r=".75"><stop offset="0" stopColor={schiarisci(colore, 0.75)} /><stop offset=".45" stopColor={colore} /><stop offset="1" stopColor={scurisci(colore, 0.55)} /></radialGradient>
      <circle cx={cx} cy={cy} r={rr} fill={`url(#${g})`} />
      <ellipse cx={cx - rr * 0.32} cy={cy - rr * 0.38} rx={rr * 0.28} ry={rr * 0.18} fill="rgba(255,255,255,.75)" />
    </>
  );
  switch (s.forma) {
    case 'piatta':
      return (
        <g>
          {ombra}
          <radialGradient id={g} cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#fff2c2" /><stop offset=".35" stopColor="#d4a944" /><stop offset=".85" stopColor="#8a6420" /><stop offset="1" stopColor="#5e4314" /></radialGradient>
          <circle cx={x} cy={y} r={r * 1.25} fill={`url(#${g})`} />
          <circle cx={x} cy={y} r={r * 0.85} fill="none" stroke="rgba(60,40,10,.45)" strokeWidth={0.8} />
          <path d={`M${x - r * 0.9},${y - r * 0.4} A${r * 1.05},${r * 1.05} 0 0 1 ${x + r * 0.3},${y - r * 1.05}`} stroke="rgba(255,255,255,.6)" strokeWidth={1} fill="none" />
        </g>
      );
    case 'sarta': {
      const ang = ((35 + s.inclinazione) * Math.PI) / 180, l = r * 3.2;
      return (
        <g>
          <line x1={x + 2} y1={y + 3} x2={x + Math.cos(ang) * l + 2} y2={y + Math.sin(ang) * l + 3} stroke="rgba(0,0,0,.45)" strokeWidth={1.4} />
          <line x1={x} y1={y} x2={x + Math.cos(ang) * l} y2={y + Math.sin(ang) * l} stroke="#c9ccd1" strokeWidth={1.1} strokeLinecap="round" />
          {sfera(x, y, r * 0.62, s.colore)}
        </g>
      );
    }
    case 'chiodino': {
      const ang = (s.inclinazione * Math.PI) / 180, l = r * 2.6;
      const k = {x: x + Math.cos(ang) * l * 0.55, y: y + Math.sin(ang) * l * 0.55 + r * 0.3};
      return (
        <g>
          <path d={`M${x + 2},${y + 3} L${k.x + 2},${k.y + 3} L${k.x + l * 0.5 + 2},${k.y - r * 0.8 + 3}`} stroke="rgba(0,0,0,.45)" strokeWidth={2} fill="none" />
          <path d={`M${x},${y} L${k.x},${k.y} L${k.x + l * 0.5},${k.y - r * 0.8}`} stroke="#7d7a74" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <circle cx={k.x} cy={k.y} r={1.4} fill="#7a4a24" opacity={0.8} />
          <circle cx={x} cy={y} r={r * 0.75} fill="#8d8a84" stroke="#55524d" strokeWidth={0.8} />
          <circle cx={x - r * 0.2} cy={y - r * 0.2} r={r * 0.25} fill="rgba(255,255,255,.45)" />
        </g>
      );
    }
    case 'ombrello':
      return (
        <g transform={`rotate(${s.inclinazione} ${x} ${y})`}>
          <ellipse cx={x + r * 0.6} cy={y + r * 1.2} rx={r * 0.8} ry={r * 1.5} fill="rgba(0,0,0,.45)" filter="url(#sfoca-poco)" />
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={scurisci(s.colore, 0.35)} /><stop offset=".4" stopColor={schiarisci(s.colore, 0.35)} /><stop offset="1" stopColor={scurisci(s.colore, 0.5)} /></linearGradient>
          <rect x={x - r * 0.45} y={y - r * 1.6} width={r * 0.9} height={r * 1.6} rx={r * 0.3} fill={`url(#${g})`} />
          <ellipse cx={x} cy={y - r * 1.6} rx={r * 0.7} ry={r * 0.35} fill={schiarisci(s.colore, 0.25)} />
          <ellipse cx={x} cy={y} rx={r * 0.85} ry={r * 0.35} fill={scurisci(s.colore, 0.2)} />
          <rect x={x - r * 0.3} y={y - r * 1.5} width={r * 0.15} height={r * 1.2} fill="rgba(255,255,255,.5)" />
        </g>
      );
    default:
      return <g>{ombra}{sfera(x, y, r, s.colore)}</g>;
  }
}

function Postit({x, y, w, h, ruota, fs}: {x: number; y: number; w: number; h: number; ruota: number; fs: number}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ruota})`}>
      <rect x={-w / 2 + 3} y={4} width={w} height={h} fill="rgba(0,0,0,.4)" filter="url(#sfoca)" />
      <path d={`M${-w / 2},0 H${w / 2} V${h - h * 0.12} Q${w / 2 - w * 0.04},${h} ${w / 2 - w * 0.12},${h} H${-w / 2} Z`} fill="url(#carta-postit)" />
      <text x={0} y={h * 0.68} fontSize={fs} textAnchor="middle" className="penna">???</text>
    </g>
  );
}

/** Cordicella fra due spilli: tesa (dritta), lenta (che pende) o arrotolata intorno allo spillo di partenza. */
function Cordicella({a, b, tipo, rossa, seme}: {a: {x: number; y: number}; b: {x: number; y: number}; tipo: 'tesa' | 'lenta' | 'arrotolata'; rossa: boolean; seme: string}) {
  const colore = rossa ? SPAGO_ROSSO : SPAGO;
  if (tipo === 'arrotolata') {
    const r = caso(seme);
    const giri = [0, 1, 2].map(i => `M${a.x - 7 + i},${a.y} a${7 - i},${4 + r() * 2} 0 1 0 ${14 - 2 * i},0 a${7 - i},${4 + r() * 2} 0 1 0 ${-(14 - 2 * i)},0`).join(' ');
    const dx = (b.x - a.x), dy = (b.y - a.y), l = Math.hypot(dx, dy) || 1;
    const coda = `M${a.x},${a.y} q${(dx / l) * 14},${18} ${(dx / l) * 10 + 4},${30 + r() * 10}`;
    return <g stroke={colore} strokeWidth={1.4} fill="none" opacity={0.9}><path d={giri} /><path d={coda} /></g>;
  }
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const pende = tipo === 'lenta' ? 10 + Math.hypot(b.x - a.x, b.y - a.y) * 0.1 : 0;
  const d = `M${a.x},${a.y} Q${mx},${my + pende * 2} ${b.x},${b.y}`;
  return (
    <g fill="none">
      <path d={d} stroke="rgba(0,0,0,.5)" strokeWidth={2.2} transform="translate(1.5 2.5)" />
      <path d={d} stroke={colore} strokeWidth={tipo === 'tesa' ? 1.9 : 1.6} />
    </g>
  );
}

/** Macchie in posizioni fisse decise dai dati: aloni di bicchiere di vino, schizzi, ditate unte, una colatura. */
function Macchie({seme, fx, fy, fw, fh, p}: {seme: string; fx: number; fy: number; fw: number; fh: number; p: number}) {
  const r = caso(seme);
  const punto = () => ({x: fx + fw * (0.06 + r() * 0.88), y: fy + fh * (0.12 + r() * 0.8)});
  const out: ReactNode[] = [];
  for (let i = 0; i < 3; i++) {
    const {x, y} = punto(), rr = p * (1.6 + r() * 0.9);
    out.push(<g key={`a${i}`} filter="url(#irregolare)">
      <circle cx={x} cy={y} r={rr} fill={VINO} opacity={0.08} />
      <circle cx={x} cy={y} r={rr} fill="none" stroke={VINO} strokeWidth={1.8 + r() * 1.8} opacity={0.55} strokeDasharray={`${rr * (2 + r() * 3)} ${rr * 0.4}`} />
    </g>);
  }
  for (let i = 0; i < 2; i++) {
    const {x, y} = punto();
    out.push(<g key={`s${i}`} filter="url(#irregolare)" fill={VINO} opacity={0.5}>
      <ellipse cx={x} cy={y} rx={p * (0.9 + r())} ry={p * (0.6 + r() * 0.5)} />
      {Array.from({length: 7}, (_, j) => <circle key={j} cx={x + (r() - 0.5) * p * 5} cy={y + (r() - 0.5) * p * 3} r={0.8 + r() * p * 0.22} />)}
    </g>);
  }
  for (let i = 0; i < 2; i++) {
    const {x, y} = punto(), ang = (r() - 0.5) * 60;
    out.push(<g key={`d${i}`} transform={`rotate(${ang} ${x} ${y})`} fill="none" stroke="rgba(255,236,205,.07)" strokeWidth={0.9}>
      {Array.from({length: 6}, (_, j) => <ellipse key={j} cx={x} cy={y} rx={p * (0.3 + j * 0.14)} ry={p * (0.45 + j * 0.18)} />)}
    </g>);
  }
  // Un alone chiaro di caffè o di birra, che sul feltro scuro si vede di più.
  {
    const {x, y} = punto(), rr = p * 1.4;
    out.push(<circle key="caffe" cx={x} cy={y} r={rr} fill="none" stroke={CAFFE} strokeWidth={2.2} opacity={0.28} filter="url(#irregolare)"
      strokeDasharray={`${rr * 4} ${rr * 0.6}`} />);
  }
  const {x, y} = punto();
  out.push(<path key="colatura" d={`M${x},${y} q${p * 0.3},${p * 3} ${-p * 0.1},${p * 6}`} stroke={VINO} strokeWidth={p * 0.35} opacity={0.3}
    strokeLinecap="round" fill="none" filter="url(#irregolare)" />);
  return <g>{out}</g>;
}

/** La testata divisa in due righe al trattino lungo («SERRAGLIO» / «CARRIERA: …»). */
function dividi(l: Lettera[]): Lettera[][] {
  const i = l.findIndex(x => x.c === '—');
  return i < 0 ? [l] : [l.slice(0, i).filter((x, j, a) => !(j === a.length - 1 && x.c === ' ')), l.slice(i + 1).filter((x, j) => !(j === 0 && x.c === ' '))];
}

export function Bacheca({c, onChiudi}: {c: Carriera; onChiudi: () => void}) {
  const {w, h} = useMisura();
  const verticale = h > w;
  const {stato, ultimo} = statoBozzetto(c);
  const comp: Composizione = componi(c, stato, ultimo, "Serraglio — carriera: Dov'è Grappino?", verticale ? 12 : 13);

  // Pannello e scanalature: tutto si appoggia su un passo esatto.
  const T = verticale ? 14 : 24;                          // cornice
  const p = verticale ? Math.max(12, Math.min(16, Math.floor((h - 2 * T) / 60))) : 18;
  const fx = T, fy = T, fw = w - 2 * T, fh = h - 2 * T;
  const scan = (y: number) => fy + Math.round((y - fy) / p) * p;  // la scanalatura più vicina
  const fs = p * 1.95;                                    // corpo delle lettere: cap alte circa una scanalatura e mezza
  const nodi = comp.punti.filter(x => x.tipo === 'nodo');
  const fini = comp.punti.filter(x => x.tipo === 'finale');
  const colonne = Math.max(...nodi.map(x => x.colonna)) + 1;
  const righe = Math.max(...nodi.map(x => x.riga)) + 1;
  const larghezza = (n: Punto) => Math.max(...n.titolo.map(t => t.length)) * CARATTERE_LETTERA * (n.tipo === 'finale' ? fs * 0.9 : fs);

  // Intestazione del listino: in verticale su due righe, sotto il pulsante «Chiudi».
  const testate = verticale ? dividi(comp.testata) : [comp.testata];
  const lunga = Math.max(...testate.map(t => t.length));
  const testataFs = Math.min(fs * 1.35, (fw * 0.86) / (lunga * 0.5));
  const yTestata = scan(fy + p * (verticale ? 5 : 3));
  const ySotto = yTestata + p * 2 * testate.length;
  // In verticale la legenda sta in fondo, sotto i finali; in orizzontale nell'angolo in basso a sinistra.
  const legenda = ['puntina rossa: sei qui', '→ lettere bianche: si va di qui', 'post-it: mai visto', 'lettere storte: chiuso in questo giro',
    'cordicella tesa: fatto · lenta: da fare', 'arrotolata: chiusa · rossa: se perdi'];
  const lh = p * (legenda.length * 1.15 + 1.2);
  const altezzaLegenda = verticale ? lh + p * 2 : 0;
  // Fascia dei finali, in fondo: «piatti del giorno».
  const altezzaFinali = verticale ? p * 7 : p * 6;
  const yFinali = scan(fy + fh - altezzaLegenda - altezzaFinali - p);
  // Area dei nodi fra l'intestazione e i finali.
  const yA = ySotto + p * 3, yB = yFinali - p * 2;

  const pos = new Map<string, {x: number; y: number}>();  // posizione dello spillo
  if (!verticale) {
    const colW = (fw - p * 2) / colonne;
    for (const n of nodi) pos.set(n.id, {x: fx + p + (n.colonna + 0.5) * colW, y: scan(yA + ((n.riga + 0.5) * (yB - yA)) / Math.max(righe, 1) - p * 2)});
  } else {
    // In verticale ogni profondità è una fila: un nodo solo sta al centro, due si dividono la larghezza. Lo spillo sta a sinistra del
    // titolo e il blocco spillo più titolo è centrato nel suo spazio, così la bacheca è piena da un lato all'altro.
    for (let d = 0; d < colonne; d++) {
      const fila = nodi.filter(n => n.colonna === d).sort((a, b) => a.riga - b.riga);
      fila.forEach((n, i) => {
        const centro = fx + (fw * (i + 0.5)) / fila.length;
        // Il post-it è fissato dalla sua puntina, al centro in alto: lo spillo è lì.
        const blocco = larghezza(n) + p * 1.1 + (n.freccia ? fs * 0.8 : 0);
        const x = n.postit ? centro + (n.freccia ? fs * 0.4 : 0) : Math.max(fx + p, centro - blocco / 2);
        pos.set(n.id, {x, y: scan(yA + ((d + 0.15) * (yB - yA)) / colonne)});
      });
    }
  }
  // Ogni finale sotto il nodo da cui ci si arriva (in orizzontale), o nella sua metà (in verticale).
  if (!verticale) {
    const voluti = fini.map(f => {
      const da = comp.fili.filter(x => x.a === f.id).map(x => pos.get(x.da)).filter((x): x is {x: number; y: number} => !!x);
      return {f, x: (da.length ? da.reduce((t, q) => t + q.x, 0) / da.length : fx + fw / 2) - p * 4};
    }).sort((a, b) => a.x - b.x);
    let limite = fx + fw - p * 10;
    for (let i = voluti.length - 1; i >= 0; i--) {
      const x = Math.max(fx + p, Math.min(voluti[i].x, limite));
      pos.set(voluti[i].f.id, {x, y: scan(yFinali + p * 2) + p});
      limite = x - p * 14;
    }
  } else {
    fini.forEach((f, i) => {
      const centro = fx + (fw * (i + 0.5)) / fini.length;
      const blocco = larghezza(f) + p * 2.4;
      pos.set(f.id, {x: f.postit ? centro : Math.max(fx + p, centro - blocco / 2), y: scan(yFinali + p * 2) + p});
    });
  }

  // Dove stanno le lettere rispetto allo spillo: sotto e al centro in orizzontale, a destra in verticale e per i finali.
  const etichetta = (n: Punto) => {
    const s = pos.get(n.id)!;
    if (n.tipo === 'finale') return {x: s.x + p * 1.1 + fs * 0.55, y: s.y + p * 0.65, ancora: 'start' as const};
    return verticale ? {x: s.x + p * 1.1 + (n.freccia ? fs * 0.8 : 0), y: s.y + p * 0.65, ancora: 'start' as const} : {x: s.x, y: s.y + p * 2.6, ancora: 'middle' as const};
  };

  const elementi: ReactNode[] = [];
  for (const n of comp.punti) {
    const e = etichetta(n);
    if (n.postit) {
      const pw = verticale ? p * 7 : p * 8, ph = p * 3.4;
      const cx = pos.get(n.id)!.x;
      const cy = pos.get(n.id)!.y - p * 0.5;
      elementi.push(<Postit key={`p-${n.id}`} x={cx} y={cy} w={pw} h={ph} ruota={n.inclinazione} fs={p * 2} />);
      if (n.freccia) elementi.push(<Freccia key={`f-${n.id}`} x={cx - pw / 2 - fs * 0.75} y={cy + ph * 0.62} fs={fs} />);
      continue;
    }
    if (n.tipo === 'finale') elementi.push(<Stella key={`s-${n.id}`} x={e.x - fs * 0.32} y={e.y - fs * 0.3} r={fs * 0.26} colore={n.titolo[0][0]?.colore ?? '#e6d9b2'} />);
    n.titolo.forEach((riga, i) => {
      const fsRiga = n.tipo === 'finale' ? fs * 0.9 : fs;
      if (n.freccia && i === 0) {
        const xf = e.ancora === 'middle' ? e.x - (riga.length * CARATTERE_LETTERA * fsRiga) / 2 - fs * 0.85 : e.x - fs * 0.8;
        elementi.push(<Freccia key={`f-${n.id}`} x={xf} y={e.y} fs={fs} />);
      }
      elementi.push(<Riga key={`t-${n.id}-${i}`} lettere={riga} x={e.x} y={e.y + i * p * 2} fs={fsRiga} ancora={e.ancora} />);
    });
  }

  // Lettere cadute in fondo alla cornice (dai nodi esclusi) e un paio di sempre, decise dai dati.
  const r = caso(`${c.id}:cadute`);
  const cadute = [...comp.punti.flatMap(n => n.caduta ? [n.caduta] : []), {c: 'E', ruota: 96, dy: 0, colore: '#d2b97c'}];
  const fondo = fy + fh - p * 1.1;

  // Cartoncino con la legenda, scritto a penna.
  const lw = verticale ? fw - p * 6 : p * 17;
  const lx = verticale ? fx + p * 3 : fx + p * 1.2, ly = fy + fh - lh - p * (verticale ? 1.4 : 0.8);
  const xTitoloFinali = verticale ? fx + fw / 2 : Math.min(...fini.map(f => pos.get(f.id)!.x)) - p;
  const raggio = p * (verticale ? 0.48 : 0.55);

  return (
    <div className="bacheca" data-testid="bacheca">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <filter id="pelo" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="7" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.86  0 0 0 0 0.8  0 0 0 0 0.7  0 0 0 0.26 -0.07" />
          </filter>
          <filter id="aloni" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="3" seed="3" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.55  0 0 0 0 0.45  0 0 0 0.55 -0.2" />
          </filter>
          <filter id="venatura" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.004 0.18" numOctaves="2" seed="11" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 0 0.05  0 0 0 0.6 -0.1" />
          </filter>
          {/* Plastica: spigoli arrotondati (alfa sfocata e ritagliata), rilievo con luce diffusa e riflesso speculare, ombra netta. */}
          <filter id="plastica" x="-15%" y="-30%" width="135%" height="180%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation={fs * 0.018} result="sfocata" />
            <feComponentTransfer in="sfocata" result="forma"><feFuncA type="linear" slope="1.9" intercept="-0.3" /></feComponentTransfer>
            <feComposite in="SourceGraphic" in2="forma" operator="in" result="colore" />
            <feGaussianBlur in="forma" stdDeviation={fs * 0.05} result="rilievo" />
            <feDiffuseLighting in="rilievo" surfaceScale={fs * 0.09} diffuseConstant="1.18" lightingColor="#fff" result="diffusa">
              <feDistantLight azimuth="225" elevation="68" />
            </feDiffuseLighting>
            <feComposite in="colore" in2="diffusa" operator="arithmetic" k1="1.08" k2="0" k3="0" k4="0" result="ombreggiata" />
            <feSpecularLighting in="rilievo" surfaceScale={fs * 0.09} specularConstant="1" specularExponent="26" lightingColor="#fffaf0" result="lucida">
              <feDistantLight azimuth="225" elevation="52" />
            </feSpecularLighting>
            <feComposite in="lucida" in2="forma" operator="in" result="lucidaDentro" />
            <feComposite in="ombreggiata" in2="lucidaDentro" operator="arithmetic" k1="0" k2="1" k3="0.6" k4="0" result="plastica" />
            <feComposite in="plastica" in2="forma" operator="in" result="pezzo" />
            <feOffset in="forma" dx={fs * 0.05} dy={fs * 0.07} result="spostata" />
            <feGaussianBlur in="spostata" stdDeviation={fs * 0.025} result="ombraMorbida" />
            <feFlood floodColor="#000" floodOpacity="0.7" /><feComposite in2="ombraMorbida" operator="in" result="ombra" />
            <feMerge><feMergeNode in="ombra" /><feMergeNode in="pezzo" /></feMerge>
          </filter>
          <filter id="irregolare" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="2" seed="5" result="rumore" />
            <feDisplacementMap in="SourceGraphic" in2="rumore" scale="9" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="sfoca"><feGaussianBlur stdDeviation="2.5" /></filter>
          <filter id="sfoca-poco"><feGaussianBlur stdDeviation="1.2" /></filter>
          <pattern id="scanalature" width={fw} height={p} x={fx} y={fy} patternUnits="userSpaceOnUse">
            <rect y={p - 3.4} width={fw} height={1.2} fill="rgba(0,0,0,.22)" />
            <rect y={p - 2.2} width={fw} height={1.7} fill="#0a0807" />
            <rect y={p - 0.5} width={fw} height={0.8} fill="rgba(255,236,210,.075)" />
          </pattern>
          <linearGradient id="legno-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5636" /><stop offset=".5" stopColor="#5e3f25" /><stop offset="1" stopColor="#3e2817" /></linearGradient>
          <linearGradient id="carta-postit" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stopColor="#fbe98a" /><stop offset=".8" stopColor="#f2d65f" /><stop offset="1" stopColor="#e3c34c" /></linearGradient>
          <radialGradient id="ombra-bordo" cx=".5" cy=".5" r=".75"><stop offset=".7" stopColor="rgba(0,0,0,0)" /><stop offset="1" stopColor="rgba(0,0,0,.55)" /></radialGradient>
        </defs>

        {/* Cornice di legno graffiata */}
        <rect width={w} height={h} fill="url(#legno-o)" />
        <rect width={w} height={h} filter="url(#venatura)" />
        {Array.from({length: 9}, (_, i) => {
          const g = caso(`graffio:${i}`);
          const lato = i % 4, l = 20 + g() * 60, t = g();
          const [x1, y1] = lato === 0 ? [t * w, g() * T] : lato === 1 ? [t * w, h - g() * T] : lato === 2 ? [g() * T, t * h] : [w - g() * T, t * h];
          const ang = lato < 2 ? (g() - 0.5) * 0.3 : Math.PI / 2 + (g() - 0.5) * 0.3;
          return <line key={i} x1={x1} y1={y1} x2={x1 + Math.cos(ang) * l} y2={y1 + Math.sin(ang) * l} stroke="rgba(255,225,180,.22)" strokeWidth={0.8} />;
        })}

        {/* Feltro: colore, pelo, aloni e polvere, macchie, scanalature a passo esatto, bordo in ombra */}
        <rect x={fx} y={fy} width={fw} height={fh} fill={FELTRO} />
        <rect x={fx} y={fy} width={fw} height={fh} filter="url(#aloni)" opacity={0.5} />
        <rect x={fx} y={fy} width={fw} height={fh} filter="url(#pelo)" />
        <Macchie seme={`${c.id}:macchie:${verticale ? 'v' : 'o'}`} fx={fx} fy={fy} fw={fw} fh={fh} p={p} />
        <rect x={fx} y={fy} width={fw} height={fh} fill="url(#scanalature)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="url(#ombra-bordo)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke="rgba(0,0,0,.7)" strokeWidth={3} />

        {/* Intestazione */}
        {testate.map((t, i) => <Riga key={i} lettere={t} x={fx + fw / 2} y={yTestata + i * p * 2} fs={testataFs} ancora="middle" />)}
        <Riga lettere={comp.sottotitolo} x={fx + fw / 2} y={ySotto} fs={fs * 0.62} ancora="middle" />
        <Riga lettere={comp.titoloFinali} x={xTitoloFinali} y={yFinali} fs={fs * 0.7} ancora={verticale ? 'middle' : 'start'} />

        {/* Cordicelle (sotto le lettere), poi lettere e post-it, poi spilli e puntine */}
        {comp.fili.map(f => <Cordicella key={`${f.da}>${f.a}`} a={pos.get(f.da)!} b={pos.get(f.a)!} tipo={f.tipo} rossa={f.sconfitta} seme={`${f.da}>${f.a}`} />)}
        {elementi}
        {comp.punti.map(n => <Puntina key={n.id} id={n.id} x={pos.get(n.id)!.x} y={pos.get(n.id)!.y} r={n.corrente ? raggio * 1.35 : raggio} s={n.spillo} />)}

        {/* Lettere cadute in fondo */}
        {cadute.map((l, i) => <Riga key={`c-${i}`} lettere={[{...l, dy: 0}]} x={fx + fw * (verticale ? 0.82 + i * 0.07 : 0.35 + i * 0.08 + r() * 0.04)} y={fondo} fs={fs * 0.9} />)}

        {/* Cartoncino della legenda */}
        <g transform={`translate(${lx} ${ly}) rotate(${verticale ? -1 : 1.5})`}>
          <rect x={3} y={4} width={lw} height={lh} fill="rgba(0,0,0,.45)" filter="url(#sfoca)" />
          <rect width={lw} height={lh} fill="#efe8d6" />
          {legenda.map((t, i) => <text key={i} x={p * 0.6} y={p * (1.5 + i * 1.15)} fontSize={p * 0.95} className="penna">{t}</text>)}
        </g>
        <Puntina id="legenda" x={lx + lw / 2} y={ly + p * 0.3} r={raggio} s={{forma: 'piatta', colore: '#d4a944', inclinazione: 0}} />
      </svg>
      <button className="chiudi-bacheca" data-testid="chiudi-bacheca" onClick={onChiudi}>Chiudi</button>
    </div>
  );
}
