// CA-0a, Fase D: i pezzi disegnati della bacheca (bacheca.md). Feltro, scanalature, lettere, cordicelle e sporco dal codice; cornice e
// puntine dal codice finché non arrivano le immagini generate (prompt-bacheca.md, in docs/design/carriere/asset/bacheca/), poi da lì.
import type {ReactNode} from 'react';
import {caso, catenaria, DI_PLASTICA, GEOMETRIA, ROSSO_SEI_QUI, type Disposizione, type Filo, type Lettera, type Macchia, type Pt, type Spillo} from '../bacheca.ts';

// Le immagini generate, se ci sono: Vite le trova con il glob; finché la cartella è vuota resta tutto disegnato dal codice.
const RADICE = '../../../../docs/design/carriere/asset/bacheca/';
const IMMAGINI = import.meta.glob('../../../../docs/design/carriere/asset/bacheca/{cornice.webp,puntine/*.webp}',
  {eager: true, query: '?url', import: 'default'}) as Record<string, string>;
export const immagine = (rel: string): string | undefined => IMMAGINI[RADICE + rel];
/** Quanto della cornice.webp è cornice, per ogni lato: il prompt chiede circa il 9% della larghezza. */
export const FETTA_CORNICE = 9.5;

export const FELTRO = '#211d1a';
const SPAGO = '#cdb88c';
const SPAGO_ROSSO = '#b4493b';
const VINO = '#7a2232';
const CAFFE = '#b38a5c';
const LUCE = {x: 0.6, y: 0.8};  // direzione delle ombre: la luce viene da sinistra, in alto

const schiarisci = (hex: string, t: number) => {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (255 - v) * t));
  return `rgb(${c.join(',')})`;
};
const scurisci = (hex: string, t: number) => {
  const n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * (1 - t)));
  return `rgb(${c.join(',')})`;
};
const idColore = (hex: string) => `ricolora-${hex.slice(1)}`;

/** Una riga di lettere di plastica, ciascuna con la sua rotazione, il suo scarto e il suo colore; il filtro dà rilievo e lucido. */
export function Riga({lettere, x, y, fs, ancora = 'start', nascosta, riga}: {lettere: Lettera[]; x: number; y: number; fs: number;
  ancora?: 'start' | 'middle'; /** Fase G: la lettera che si è allentata (la disegna la bacheca, sopra) */ nascosta?: number; riga?: string}) {
  let prima = 0;
  return (
    <text x={x} y={y} fontSize={fs} textAnchor={ancora} className="lettere" filter="url(#plastica)" data-riga={riga}>
      {lettere.map((l, i) => {
        const dy = (l.dy - prima) * fs;
        prima = l.dy;
        return <tspan key={i} dy={dy.toFixed(2)} rotate={l.ruota.toFixed(2)} fill={l.manca || i === nascosta ? 'transparent' : l.colore}>{l.c === ' ' ? ' ' : l.c}</tspan>;
      })}
    </text>
  );
}

/** I simboli che League Gothic non ha, come pezzi di plastica: la freccia del disponibile e la stella dei finali. */
export function Freccia({x, y, fs}: {x: number; y: number; fs: number}) {
  const a = fs * 0.62, s = fs * 0.12;
  return <path filter="url(#plastica)" fill="#f6f3ea" transform={`translate(${x} ${y - fs * 0.36})`}
    d={`M0,${-s} H${a * 0.62} V${-s * 2.6} L${a},0 L${a * 0.62},${s * 2.6} V${s} H0 Z`} />;
}
export function Stella({x, y, r, colore}: {x: number; y: number; r: number; colore: string}) {
  const punti = Array.from({length: 10}, (_, i) => {
    const ang = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(ang) * rr).toFixed(1)},${(y + Math.sin(ang) * rr).toFixed(1)}`;
  }).join(' ');
  return <polygon points={punti} fill={colore} filter="url(#plastica)" />;
}

/** Quanto sporge ogni forma dal feltro, in raggi: decide la lunghezza dell'ombra portata. */
const ALTEZZA: Record<Spillo['forma'], number> = {tonda: 1.1, cilindro: 1.7, ottone: 0.3, spillo: 0.9, chiodino: 0.6, ombrello: 1.3};
const FILE: Record<Spillo['forma'], string> = {tonda: 'tonda-rossa', cilindro: 'cilindro', ottone: 'ottone', spillo: 'spillo', chiodino: 'chiodino', ombrello: 'ombrello'};

/** Ombra portata di una puntina sul feltro, calcolata dalla sua altezza e dalla direzione della luce. */
function OmbraPuntina({x, y, r, s}: {x: number; y: number; r: number; s: Spillo}) {
  const lung = ALTEZZA[s.forma] * r;
  return <ellipse cx={x + LUCE.x * lung} cy={y + LUCE.y * lung} rx={r * (s.forma === 'ottone' ? 1.25 : 0.95)} ry={r * 0.7}
    fill="rgba(0,0,0,.55)" filter="url(#sfoca-poco)" transform={`rotate(${Math.atan2(LUCE.y, LUCE.x) * 57.3} ${x + LUCE.x * lung} ${y + LUCE.y * lung})`} />;
}

/**
 * Puntine e spilli trovati nel cassetto. Con l'immagine generata (puntine/<nome>.webp) si usa quella, ricolorata se è di plastica; senza,
 * il disegno del codice. (x, y) è il punto in cui la puntina entra nel feltro, dove si legano le cordicelle: per le immagini del secondo
 * giro, senza punta, è la base della testa, o la fine del gambo per spillo e chiodino (GEOMETRIA in bacheca.ts). L'ombra portata la
 * calcola il client dal centro della testa.
 */
export function Puntina({id, x, y, lato, s}: {id: string; x: number; y: number; lato: number; s: Spillo}) {
  const file = immagine(`puntine/${FILE[s.forma]}.webp`);
  const r = lato * 0.19;
  if (file) {
    const g = GEOMETRIA[s.forma];
    const ricolora = DI_PLASTICA.has(s.forma) && !(s.forma === 'tonda' && s.colore === ROSSO_SEI_QUI);
    const ang = (s.inclinazione * Math.PI) / 180, dx = (g.testa.x - g.ancora.x) * lato, dy = (g.testa.y - g.ancora.y) * lato;
    const testa = {x: x + dx * Math.cos(ang) - dy * Math.sin(ang), y: y + dx * Math.sin(ang) + dy * Math.cos(ang)};
    return (
      <g>
        <OmbraPuntina x={testa.x} y={testa.y} r={r} s={s} />
        <image href={file} x={x - g.ancora.x * lato} y={y - g.ancora.y * lato} width={lato} height={lato} transform={`rotate(${s.inclinazione} ${x} ${y})`}
          filter={ricolora ? `url(#${idColore(s.colore)})` : undefined} />
      </g>
    );
  }
  const g = `g-${id.replace(/[^a-z0-9]/gi, '')}`;
  const sfera = (cx: number, cy: number, rr: number, colore: string) => (
    <>
      <radialGradient id={g} cx=".33" cy=".3" r=".75"><stop offset="0" stopColor={schiarisci(colore, 0.75)} /><stop offset=".45" stopColor={colore} /><stop offset="1" stopColor={scurisci(colore, 0.6)} /></radialGradient>
      <circle cx={cx} cy={cy} r={rr} fill={`url(#${g})`} />
      <ellipse cx={cx - rr * 0.32} cy={cy - rr * 0.38} rx={rr * 0.3} ry={rr * 0.19} fill="rgba(255,255,255,.8)" />
      <path d={`M${cx - rr * 0.75},${cy + rr * 0.35} A${rr},${rr} 0 0 0 ${cx + rr * 0.6},${cy + rr * 0.6}`} stroke="rgba(255,255,255,.18)" strokeWidth={rr * 0.12} fill="none" />
    </>
  );
  let corpo: ReactNode;
  switch (s.forma) {
    case 'ottone':
      corpo = (
        <>
          <radialGradient id={g} cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#fff2c2" /><stop offset=".35" stopColor="#d4a944" /><stop offset=".85" stopColor="#8a6420" /><stop offset="1" stopColor="#5e4314" /></radialGradient>
          <circle cx={x} cy={y} r={r * 1.25} fill={`url(#${g})`} />
          <circle cx={x} cy={y} r={r * 0.85} fill="none" stroke="rgba(60,40,10,.45)" strokeWidth={0.8} />
          <circle cx={x + r * 0.45} cy={y + r * 0.3} r={r * 0.22} fill="rgba(40,60,30,.35)" />
          <path d={`M${x - r * 0.9},${y - r * 0.4} A${r * 1.05},${r * 1.05} 0 0 1 ${x + r * 0.3},${y - r * 1.05}`} stroke="rgba(255,255,255,.6)" strokeWidth={1} fill="none" />
        </>
      );
      break;
    case 'cilindro': {
      // Impugnatura a cilindro vista di fronte e un po' dall'alto: base allargata, fusto, cappello ellittico.
      const c = s.colore, rr = r * 0.7;
      corpo = (
        <g transform={`rotate(${s.inclinazione * 0.5} ${x} ${y})`}>
          <linearGradient id={g} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={scurisci(c, 0.45)} /><stop offset=".35" stopColor={schiarisci(c, 0.35)} /><stop offset="1" stopColor={scurisci(c, 0.55)} /></linearGradient>
          <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} fill={scurisci(c, 0.35)} />
          <rect x={x - rr} y={y - r * 1.5} width={rr * 2} height={r * 1.5} fill={`url(#${g})`} />
          <ellipse cx={x} cy={y - r * 1.5} rx={rr} ry={rr * 0.42} fill={schiarisci(c, 0.3)} />
          <rect x={x - rr * 0.55} y={y - r * 1.4} width={rr * 0.25} height={r * 1.2} fill="rgba(255,255,255,.4)" />
        </g>
      );
      break;
    }
    case 'spillo': {
      const ang = ((35 + s.inclinazione) * Math.PI) / 180, l = r * 3.2;
      corpo = (
        <>
          <line x1={x + 2} y1={y + 3} x2={x + Math.cos(ang) * l + 3} y2={y + Math.sin(ang) * l + 4} stroke="rgba(0,0,0,.45)" strokeWidth={1.4} />
          <line x1={x} y1={y} x2={x + Math.cos(ang) * l} y2={y + Math.sin(ang) * l} stroke="#c9ccd1" strokeWidth={1.1} strokeLinecap="round" />
          {sfera(x, y, r * 0.62, s.colore)}
        </>
      );
      break;
    }
    case 'chiodino': {
      const ang = (s.inclinazione * Math.PI) / 180, l = r * 2.6;
      const k = {x: x + Math.cos(ang) * l * 0.55, y: y + Math.sin(ang) * l * 0.55 + r * 0.3};
      corpo = (
        <>
          <path d={`M${x + 2},${y + 3} L${k.x + 2},${k.y + 3} L${k.x + l * 0.5 + 2},${k.y - r * 0.8 + 3}`} stroke="rgba(0,0,0,.45)" strokeWidth={2} fill="none" />
          <path d={`M${x},${y} L${k.x},${k.y} L${k.x + l * 0.5},${k.y - r * 0.8}`} stroke="#7d7a74" strokeWidth={1.8} fill="none" strokeLinecap="round" />
          <circle cx={k.x} cy={k.y} r={1.4} fill="#7a4a24" opacity={0.8} />
          <circle cx={x} cy={y} r={r * 0.78} fill="#8d8a84" stroke="#55524d" strokeWidth={0.8} />
          <circle cx={x + r * 0.25} cy={y + r * 0.1} r={r * 0.22} fill="#8a4b1e" opacity={0.7} />
          <circle cx={x - r * 0.2} cy={y - r * 0.2} r={r * 0.25} fill="rgba(255,255,255,.45)" />
        </>
      );
      break;
    }
    case 'ombrello': {
      // Testa schiacciata a ombrello, vista un po' dall'alto: una cupola larga con il bordo.
      const c = s.colore;
      corpo = (
        <g transform={`rotate(${s.inclinazione} ${x} ${y})`}>
          <radialGradient id={g} cx=".4" cy=".25" r=".85"><stop offset="0" stopColor={schiarisci(c, 0.6)} /><stop offset=".5" stopColor={c} /><stop offset="1" stopColor={scurisci(c, 0.55)} /></radialGradient>
          <ellipse cx={x} cy={y + r * 0.15} rx={r * 1.25} ry={r * 0.55} fill={scurisci(c, 0.45)} />
          <path d={`M${x - r * 1.2},${y + r * 0.1} Q${x},${y - r * 1.5} ${x + r * 1.2},${y + r * 0.1} Q${x},${y + r * 0.5} ${x - r * 1.2},${y + r * 0.1} Z`} fill={`url(#${g})`} />
          <ellipse cx={x - r * 0.35} cy={y - r * 0.45} rx={r * 0.35} ry={r * 0.15} fill="rgba(255,255,255,.6)" />
        </g>
      );
      break;
    }
    default:
      corpo = sfera(x, y, r, s.colore);
  }
  return <g><OmbraPuntina x={x} y={y} r={r} s={s} />{corpo}</g>;
}

export function Postit({x, y, w, h, ruota, fs}: {x: number; y: number; w: number; h: number; ruota: number; fs: number}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ruota})`}>
      <path d={`M${-w / 2 + 4},6 H${w / 2 + 5} V${h + 2} Q${w / 2},${h + 8} ${w / 2 - w * 0.15},${h + 6} H${-w / 2 + 4} Z`} fill="rgba(0,0,0,.45)" filter="url(#sfoca)" />
      <path d={`M${-w / 2},0 H${w / 2} V${h - h * 0.12} Q${w / 2 - w * 0.04},${h} ${w / 2 - w * 0.12},${h} H${-w / 2} Z`} fill="url(#carta-postit)" />
      <path d={`M${w / 2 - w * 0.12},${h} Q${w / 2 - w * 0.06},${h - h * 0.1} ${w / 2},${h - h * 0.12}`} fill="rgba(0,0,0,.12)" />
      <text x={0} y={h * 0.82} fontSize={fs} textAnchor="middle" className="penna">???</text>
    </g>
  );
}

/**
 * Cordicella fra due spilli. Tesa: dritta, con l'ombra vicina. Lenta: una catenaria che pende di più se è lunga, con l'ombra che si
 * allontana dove la corda si stacca dal feltro. Arrotolata: qualche giro intorno allo spillo di partenza e una coda che penzola.
 */
export function Cordicella({a, b, tipo, rossa, seme}: {a: Pt; b: Pt; tipo: Filo['tipo']; rossa: boolean; seme: string}) {
  const colore = rossa ? SPAGO_ROSSO : SPAGO;
  // data-filo: la bacheca la ritrova per farla oscillare (Fase G), ricalcolando i percorsi con percorsiCordicella.
  if (tipo === 'arrotolata') {
    const r = caso(seme);
    const giri = [0, 1, 2].map(i => `M${a.x - 7 + i},${a.y} a${7 - i},${4 + r() * 2} 0 1 0 ${14 - 2 * i},0 a${7 - i},${4 + r() * 2} 0 1 0 ${-(14 - 2 * i)},0`).join(' ');
    const dx = b.x - a.x, l = Math.hypot(dx, b.y - a.y) || 1;
    const coda = `M${a.x},${a.y} q${(dx / l) * 10},${20} ${(dx / l) * 6 + 2},${42 + r() * 12}`;
    return (
      <g fill="none" data-filo={seme} data-tipo="arrotolata" data-ax={a.x} data-ay={a.y}>
        <path d={giri} stroke={colore} strokeWidth={1.5} />
        <g className="coda">
          <path d={coda} stroke="rgba(0,0,0,.45)" strokeWidth={2} transform="translate(3 4)" filter="url(#sfoca-poco)" />
          <path d={coda} stroke={colore} strokeWidth={1.5} />
        </g>
      </g>
    );
  }
  const {d, ombra} = percorsiCordicella(catenaria(a, b, tipo));
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" data-filo={seme} data-tipo={tipo}>
      <path className="ombra" d={ombra} stroke="rgba(0,0,0,.5)" strokeWidth={2.4} filter="url(#sfoca-poco)" />
      <path className="corda" d={d} stroke={scurisci(colore, 0.35)} strokeWidth={tipo === 'tesa' ? 2.4 : 2.1} />
      <path className="corda" d={d} stroke={colore} strokeWidth={tipo === 'tesa' ? 1.6 : 1.3} strokeDasharray="3 1.2" />
    </g>
  );
}

/** I percorsi di una cordicella (la corda e la sua ombra) dai suoi punti; l'ombra si allontana dove la corda si stacca di più dal feltro. */
export function percorsiCordicella({punti, distacco}: {punti: Pt[]; distacco: number[]}): {d: string; ombra: string} {
  const d = 'M' + punti.map(q => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(' L');
  const ombra = 'M' + punti.map((q, i) => {
    const o = 2 + distacco[i] * 7;
    return `${(q.x + LUCE.x * o).toFixed(1)},${(q.y + LUCE.y * o).toFixed(1)}`;
  }).join(' L');
  return {d, ombra};
}

/** Sporco del feltro, in posizioni fisse decise dai dati (bacheca.ts, `sporco`): misure in frazioni del pannello. */
export function Sporco({macchie, d}: {macchie: Macchia[]; d: Disposizione}) {
  const lato = Math.min(d.fw, d.fh) * (d.verticale ? 1.6 : 1);
  return (
    <g>
      {macchie.map((m, i) => {
        const x = d.fx + m.x * d.fw, y = d.fy + m.y * d.fh, r = m.r * lato;
        const g = caso(`macchia:${i}:${m.x}`);
        switch (m.tipo) {
          case 'consunto':
            return <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} transform={`rotate(${m.ruota} ${x} ${y})`} fill="url(#consunto-grad)" filter="url(#consunto)" />;
          case 'alone':
            return (
              <g key={i} filter="url(#irregolare)">
                <circle cx={x} cy={y} r={r} fill={VINO} opacity={0.1} />
                <circle cx={x} cy={y} r={r} fill="none" stroke={VINO} strokeWidth={2 + g() * 2.4} opacity={0.6} strokeDasharray={`${r * (2 + g() * 3)} ${r * 0.35}`} />
                <circle cx={x + r * 0.08} cy={y - r * 0.05} r={r * 0.94} fill="none" stroke={VINO} strokeWidth={1} opacity={0.3} />
              </g>
            );
          case 'schizzo':
            return (
              <g key={i} filter="url(#irregolare)" fill={VINO} opacity={0.55}>
                <ellipse cx={x} cy={y} rx={r} ry={r * 0.65} transform={`rotate(${m.ruota} ${x} ${y})`} />
                {Array.from({length: 9}, (_, j) => <circle key={j} cx={x + (g() - 0.5) * r * 5} cy={y + (g() - 0.5) * r * 3} r={0.8 + g() * r * 0.25} />)}
              </g>
            );
          case 'caffe':
            return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={CAFFE} strokeWidth={2.4} opacity={0.3} filter="url(#irregolare)" strokeDasharray={`${r * 4} ${r * 0.6}`} />;
          case 'ditata':
            return (
              <g key={i} transform={`rotate(${m.ruota} ${x} ${y})`} fill="none" stroke="rgba(255,236,205,.08)" strokeWidth={0.9}>
                {Array.from({length: 6}, (_, j) => <ellipse key={j} cx={x} cy={y} rx={r * (0.4 + j * 0.2)} ry={r * (0.6 + j * 0.25)} />)}
              </g>
            );
          default:
            return <path key={i} d={`M${x},${y} q${r * 0.1},${r * 0.5} ${-r * 0.03},${r}`} stroke={VINO} strokeWidth={r * 0.12} opacity={0.35}
              strokeLinecap="round" fill="none" filter="url(#irregolare)" />;
        }
      })}
    </g>
  );
}

/** Cornice di legno disegnata dal codice: il ripiego finché non c'è cornice.webp. */
export function CorniceDisegnata({w, h, T}: {w: number; h: number; T: number}) {
  return (
    <g>
      <rect width={w} height={h} fill="url(#legno-o)" />
      <rect width={w} height={h} filter="url(#venatura)" />
      {Array.from({length: 9}, (_, i) => {
        const g = caso(`graffio:${i}`);
        const lato = i % 4, l = 20 + g() * 60, t = g();
        const [x1, y1] = lato === 0 ? [t * w, g() * T] : lato === 1 ? [t * w, h - g() * T] : lato === 2 ? [g() * T, t * h] : [w - g() * T, t * h];
        const ang = lato < 2 ? (g() - 0.5) * 0.3 : Math.PI / 2 + (g() - 0.5) * 0.3;
        return <line key={i} x1={x1} y1={y1} x2={x1 + Math.cos(ang) * l} y2={y1 + Math.sin(ang) * l} stroke="rgba(255,225,180,.22)" strokeWidth={0.8} />;
      })}
    </g>
  );
}

/** Filtri, motivi e gradienti della bacheca. `fs` è il corpo delle lettere: rilievo e ombre gli sono proporzionali. */
export function Definizioni({d, colori}: {d: Disposizione; colori: string[]}) {
  const {fs, fw, p, fx, fy} = d;
  return (
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
      {/* Feltro consunto: una chiazza più chiara bucherellata dal rumore, come il pelo che se n'è andato. */}
      <filter id="consunto" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="3" seed="9" result="rumore" />
        <feColorMatrix in="rumore" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.55" result="buchi" />
        <feComposite in="SourceGraphic" in2="buchi" operator="in" />
      </filter>
      <radialGradient id="consunto-grad"><stop offset="0" stopColor="#7a6b5c" stopOpacity=".55" /><stop offset=".6" stopColor="#5f5347" stopOpacity=".35" /><stop offset="1" stopColor="#4a4038" stopOpacity="0" /></radialGradient>
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
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="5" result="rumore" />
        <feDisplacementMap in="SourceGraphic" in2="rumore" scale="11" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="sfoca"><feGaussianBlur stdDeviation="2.5" /></filter>
      <filter id="sfoca-poco" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4" /></filter>
      {/* Ricolorare le puntine di plastica generate: luminosità per il colore voluto. */}
      {colori.map(c => {
        const n = parseInt(c.slice(1), 16), [r, g, b] = [n >> 16, (n >> 8) & 255, n & 255].map(v => (v / 255) * 1.9);
        const riga = (k: number) => `${(0.3 * k).toFixed(3)} ${(0.59 * k).toFixed(3)} ${(0.11 * k).toFixed(3)} 0 0`;
        return <filter key={c} id={idColore(c)}><feColorMatrix type="matrix" values={`${riga(r)}  ${riga(g)}  ${riga(b)}  0 0 0 1 0`} /></filter>;
      })}
      <pattern id="scanalature" width={fw} height={p} x={fx} y={fy} patternUnits="userSpaceOnUse">
        <rect y={p - 3.4} width={fw} height={1.2} fill="rgba(0,0,0,.22)" />
        <rect y={p - 2.2} width={fw} height={1.7} fill="#0a0807" />
        <rect y={p - 0.5} width={fw} height={0.8} fill="rgba(255,236,210,.075)" />
      </pattern>
      <linearGradient id="legno-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5636" /><stop offset=".5" stopColor="#5e3f25" /><stop offset="1" stopColor="#3e2817" /></linearGradient>
      <linearGradient id="carta-postit" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" stopColor="#fbe98a" /><stop offset=".8" stopColor="#f2d65f" /><stop offset="1" stopColor="#e3c34c" /></linearGradient>
      <radialGradient id="ombra-bordo" cx=".5" cy=".5" r=".75"><stop offset=".7" stopColor="rgba(0,0,0,0)" /><stop offset="1" stopColor="rgba(0,0,0,.55)" /></radialGradient>
    </defs>
  );
}
