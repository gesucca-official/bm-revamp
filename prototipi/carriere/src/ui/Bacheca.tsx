// CA-0a, Fase C: bozzetto statico della mappa come bacheca a lettere in feltro (docs/design/carriere/bacheca.md), da giudicare.
// Tutto disegnato dal codice: feltro con scanalature a passo esatto, lettere di plastica in League Gothic con imperfezioni decise dai
// dati, spilli e cordicelle fra i punti, post-it con puntina per i «???», cornice di legno. Nessuna immagine generata.
import {useEffect, useState, type ReactNode} from 'react';
import type {Carriera} from '../formato.ts';
import {caso, componi, statoBozzetto, type Composizione, type Lettera, type Punto} from '../bacheca.ts';

const FELTRO = '#211d1a';
const SPAGO = '#cdb88c';
const SPAGO_ROSSO = '#b4493b';

function useMisura() {
  const [m, setM] = useState({w: window.innerWidth, h: window.innerHeight});
  useEffect(() => {
    const f = () => setM({w: window.innerWidth, h: window.innerHeight});
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return m;
}

/** Una riga di lettere di plastica, ciascuna con la sua rotazione, il suo scarto e il suo colore. */
function Riga({lettere, x, y, fs, ancora = 'start'}: {lettere: Lettera[]; x: number; y: number; fs: number; ancora?: 'start' | 'middle'}) {
  let prima = 0;
  return (
    <text x={x} y={y} fontSize={fs} textAnchor={ancora} className="lettere" filter="url(#spessore)">
      {lettere.map((l, i) => {
        const dy = (l.dy - prima) * fs;
        prima = l.dy;
        return <tspan key={i} dy={dy.toFixed(2)} rotate={l.ruota.toFixed(2)} fill={l.manca ? 'transparent' : l.colore}>{l.c === ' ' ? ' ' : l.c}</tspan>;
      })}
    </text>
  );
}

function Spillo({x, y, r, rosso}: {x: number; y: number; r: number; rosso?: boolean}) {
  return (
    <g>
      <ellipse cx={x + r * 0.5} cy={y + r * 0.7} rx={r * 0.9} ry={r * 0.6} fill="rgba(0,0,0,.45)" />
      <circle cx={x} cy={y} r={r} fill={rosso ? 'url(#testa-rossa)' : 'url(#testa-ottone)'} stroke="rgba(0,0,0,.4)" strokeWidth={0.6} />
    </g>
  );
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
      <path d={d} stroke={colore} strokeWidth={tipo === 'tesa' ? 1.9 : 1.6} strokeDasharray={tipo === 'lenta' ? '0' : undefined} />
    </g>
  );
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
  const comp: Composizione = componi(c, stato, ultimo, "Serraglio — carriera: Dov'è Grappino?", verticale ? 14 : 13);

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

  // Intestazione del listino: in verticale su due righe, sotto il pulsante «Chiudi».
  const testate = verticale ? dividi(comp.testata) : [comp.testata];
  const lunga = Math.max(...testate.map(t => t.length));
  const testataFs = Math.min(fs * 1.35, (fw * 0.86) / (lunga * 0.5));
  const yTestata = scan(fy + p * (verticale ? 5 : 3));
  const ySotto = yTestata + p * 2 * testate.length;
  // In verticale la legenda sta in fondo, sotto i finali; in orizzontale nell'angolo dei finali.
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
  for (const n of nodi) {
    if (!verticale) {
      const colW = (fw - p * 2) / colonne;
      const x = fx + p + (n.colonna + 0.5) * colW;
      const y = scan(yA + ((n.riga + 0.5) * (yB - yA)) / Math.max(righe, 1) - p * 2);
      pos.set(n.id, {x, y});
    } else {
      const laneW = (fw - p * 2) / Math.max(righe, 1);
      const x = fx + p * 1.2 + n.riga * laneW;
      const y = scan(yA + ((n.colonna + 0.2) * (yB - yA)) / colonne);
      pos.set(n.id, {x, y});
    }
  }
  // Ogni finale sotto il nodo da cui ci si arriva, così le cordicelle scendono invece di attraversare la bacheca.
  // Da destra verso sinistra: ognuno al più alla sua x voluta e almeno a una distanza fissa dal successivo.
  const voluti = fini.map(f => {
    const da = comp.fili.filter(x => x.a === f.id).map(x => pos.get(x.da)).filter((x): x is {x: number; y: number} => !!x);
    return {f, x: (da.length ? da.reduce((t, q) => t + q.x, 0) / da.length : fx + fw / 2) - (verticale ? 0 : p * 4)};
  }).sort((a, b) => a.x - b.x);
  const distanza = verticale ? fw * 0.45 : p * 14;
  let limite = fx + fw - (verticale ? fw * 0.5 : p * 10);
  for (let i = voluti.length - 1; i >= 0; i--) {
    const x = Math.max(fx + p, Math.min(voluti[i].x, limite));
    pos.set(voluti[i].f.id, {x, y: scan(yFinali + p * 2) + p});
    limite = x - distanza;
  }

  // Dove stanno le lettere rispetto allo spillo: sotto e al centro in orizzontale, a destra in verticale.
  const etichetta = (n: Punto) => {
    const s = pos.get(n.id)!;
    if (n.tipo === 'finale') return {x: s.x + p * 1.1, y: s.y + p * 0.65, ancora: 'start' as const};
    return verticale ? {x: s.x + p * 1.1, y: s.y + p * 0.65, ancora: 'start' as const} : {x: s.x, y: s.y + p * 2.6, ancora: 'middle' as const};
  };

  const elementi: ReactNode[] = [];
  for (const n of comp.punti) {
    const e = etichetta(n);
    if (n.postit) {
      const pw = verticale ? p * 7 : p * 8, ph = p * 3.4;
      const cx = e.ancora === 'middle' ? e.x : e.x + pw / 2 - p * 0.4;
      const cy = pos.get(n.id)!.y - p * 0.5;
      elementi.push(<Postit key={`p-${n.id}`} x={cx} y={cy} w={pw} h={ph} ruota={n.inclinazione} fs={p * 2} />);
      if (n.freccia) elementi.push(<Riga key={`f-${n.id}`} lettere={[{c: '→', ruota: 0, dy: 0, colore: '#f6f3ea'}]} x={cx - pw / 2 - p * 1.6} y={cy + ph * 0.62} fs={fs} />);
      continue;
    }
    n.titolo.forEach((riga, i) => {
      const testo = n.freccia && i === 0 ? [{c: '→', ruota: 0, dy: 0, colore: '#f6f3ea'}, {c: ' ', ruota: 0, dy: 0, colore: '#fff'}, ...riga] : riga;
      elementi.push(<Riga key={`t-${n.id}-${i}`} lettere={testo} x={e.x} y={e.y + i * p * 2} fs={n.tipo === 'finale' ? fs * 0.9 : fs} ancora={e.ancora} />);
    });
  }

  // Lettere cadute in fondo alla cornice (dai nodi esclusi) e un paio di sempre, decise dai dati.
  const r = caso(`${c.id}:cadute`);
  const cadute = [...comp.punti.flatMap(n => n.caduta ? [n.caduta] : []), {c: 'E', ruota: 96, dy: 0, colore: '#d2b97c'}];
  const fondo = fy + fh - p * 1.1;

  // Cartoncino con la legenda, scritto a penna.
  const lw = verticale ? fw - p * 6 : p * 17;
  const lx = fx + p * 1.2, ly = fy + fh - lh - p * (verticale ? 1.4 : 0.8);
  const xTitoloFinali = verticale ? fx + p : Math.min(...fini.map(f => pos.get(f.id)!.x)) - p;

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
          <filter id="spessore" x="-10%" y="-20%" width="130%" height="160%">
            <feOffset in="SourceAlpha" dx={fs * 0.045} dy={fs * 0.06} result="o" />
            <feGaussianBlur in="o" stdDeviation={0.7} result="b" />
            <feFlood floodColor="#000" floodOpacity="0.7" /><feComposite in2="b" operator="in" result="ombra" />
            <feOffset in="SourceAlpha" dx={-0.6} dy={-0.8} result="l" />
            <feFlood floodColor="#fff" floodOpacity="0.35" /><feComposite in2="l" operator="in" result="luce" />
            <feMerge><feMergeNode in="ombra" /><feMergeNode in="luce" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="sfoca"><feGaussianBlur stdDeviation="2.5" /></filter>
          <pattern id="scanalature" width={fw} height={p} x={fx} y={fy} patternUnits="userSpaceOnUse">
            <rect y={p - 3.4} width={fw} height={1.2} fill="rgba(0,0,0,.22)" />
            <rect y={p - 2.2} width={fw} height={1.7} fill="#0a0807" />
            <rect y={p - 0.5} width={fw} height={0.8} fill="rgba(255,236,210,.075)" />
          </pattern>
          <linearGradient id="legno-o" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7a5636" /><stop offset=".5" stopColor="#5e3f25" /><stop offset="1" stopColor="#3e2817" /></linearGradient>
          <radialGradient id="testa-ottone" cx=".35" cy=".35" r=".7"><stop offset="0" stopColor="#fff3c4" /><stop offset=".4" stopColor="#d6ad4f" /><stop offset="1" stopColor="#7c5a1c" /></radialGradient>
          <radialGradient id="testa-rossa" cx=".35" cy=".35" r=".7"><stop offset="0" stopColor="#ffc9bd" /><stop offset=".4" stopColor="#d7322a" /><stop offset="1" stopColor="#6b0f0b" /></radialGradient>
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

        {/* Feltro: colore, pelo, aloni e polvere, scanalature a passo esatto, bordo in ombra */}
        <rect x={fx} y={fy} width={fw} height={fh} fill={FELTRO} />
        <rect x={fx} y={fy} width={fw} height={fh} filter="url(#aloni)" opacity={0.5} />
        <rect x={fx} y={fy} width={fw} height={fh} filter="url(#pelo)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="url(#scanalature)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="url(#ombra-bordo)" />
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke="rgba(0,0,0,.7)" strokeWidth={3} />

        {/* Intestazione */}
        {testate.map((t, i) => <Riga key={i} lettere={t} x={fx + fw / 2} y={yTestata + i * p * 2} fs={testataFs} ancora="middle" />)}
        <Riga lettere={comp.sottotitolo} x={fx + fw / 2} y={ySotto} fs={fs * 0.62} ancora="middle" />
        <Riga lettere={comp.titoloFinali} x={xTitoloFinali} y={yFinali} fs={fs * 0.7} />

        {/* Cordicelle (sotto le lettere), poi lettere e post-it, poi gli spilli */}
        {comp.fili.map(f => <Cordicella key={`${f.da}>${f.a}`} a={pos.get(f.da)!} b={pos.get(f.a)!} tipo={f.tipo} rossa={f.sconfitta} seme={`${f.da}>${f.a}`} />)}
        {elementi}
        {comp.punti.filter(n => !n.postit).map(n => <Spillo key={n.id} x={pos.get(n.id)!.x} y={pos.get(n.id)!.y} r={n.corrente ? p * 0.5 : p * 0.3} rosso={n.corrente} />)}
        {comp.punti.filter(n => n.postit).map(n => <Spillo key={n.id} x={pos.get(n.id)!.x} y={pos.get(n.id)!.y} r={p * 0.36} rosso={false} />)}

        {/* Lettere cadute in fondo */}
        {cadute.map((l, i) => <Riga key={`c-${i}`} lettere={[{...l, dy: 0}]} x={fx + fw * (verticale ? 0.82 + i * 0.07 : 0.35 + i * 0.08 + r() * 0.04)} y={fondo} fs={fs * 0.9} />)}

        {/* Cartoncino della legenda */}
        <g transform={`translate(${lx} ${ly}) rotate(${verticale ? -1 : 1.5})`}>
          <rect x={3} y={4} width={lw} height={lh} fill="rgba(0,0,0,.45)" filter="url(#sfoca)" />
          <rect width={lw} height={lh} fill="#efe8d6" />
          {legenda.map((t, i) => <text key={i} x={p * 0.6} y={p * (1.5 + i * 1.15)} fontSize={p * 0.95} className="penna">{t}</text>)}
        </g>
        <Spillo x={lx + lw / 2} y={ly + p * 0.3} r={p * 0.3} />
      </svg>
      <button className="chiudi-bacheca" data-testid="chiudi-bacheca" onClick={onChiudi}>Chiudi</button>
    </div>
  );
}
