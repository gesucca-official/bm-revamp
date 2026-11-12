// CA-0a, Fase D: la mappa vera come bacheca a lettere in feltro (docs/design/carriere/bacheca.md), per tutte e due le carriere e nei due
// orientamenti. Si tocca un punto disponibile per entrare; gli altri mostrano un cartoncino con quello che si sa. Il disegno sta in
// disegno.tsx, la composizione e la disposizione (funzioni pure) in ../bacheca.ts.
import {useEffect, useState, type ReactNode} from 'react';
import type {Carriera} from '../formato.ts';
import {avversari, entra, finali, nodo as trovaNodo, risolvi, type Evento, type Stato} from '../motore.ts';
import {caso, CARATTERE_LETTERA, componi, disponi, latoPuntina, sporco, LEGENDA, type Punto} from '../bacheca.ts';
import type {StatoNodo} from '../mappa.ts';
import {nomeDi, nomeSblocco} from './dati.ts';
import {CorniceDisegnata, Cordicella, Definizioni, FELTRO, FETTA_CORNICE, Freccia, immagine, Postit, Puntina, Riga, Sporco, Stella} from './disegno.tsx';

type Props = {c: Carriera; s: Stato; azione: (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => void;
  onRiprendi: () => void; onAchievement: () => void; onNuovoGiro: () => void; onElenco: () => void; onStato: () => void};

const DESCRIZIONE: Record<StatoNodo, string> = {
  corrente: 'Sei qui.', disponibile: 'Disponibile: toccalo per entrare.', bloccato: 'Raggiunto, ma per ora chiuso.',
  fatto: 'Fatto in questo giro.', aperto: 'Ancora raggiungibile in questo giro.', escluso: 'Chiuso in questo giro: un\'altra scelta l\'ha escluso.',
  nascosto: '',
};

function useMisura() {
  const [m, setM] = useState({w: window.innerWidth, h: window.innerHeight});
  useEffect(() => {
    const f = () => setM({w: window.innerWidth, h: window.innerHeight});
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return m;
}

export function Bacheca({c, s, azione, onRiprendi, onAchievement, onNuovoGiro, onElenco, onStato}: Props) {
  const {w, h} = useMisura();
  const verticale = h > w;
  const g = s.giro;
  const ultimo = g.nodo ?? g.visti.at(-1) ?? null;  // «sei qui»: dove si è, o l'ultimo nodo lasciato
  const comp = componi(c, s, ultimo, `Serraglio — carriera: ${c.titolo}`, verticale ? 12 : 13);
  // Spazio per i pulsanti: in orizzontale una fila in basso; in verticale una fila in alto e «Continua» in basso.
  const d = disponi(comp, w, h, verticale ? 56 : 0, verticale ? 64 : 58);
  const {p, fs, fx, fy, fw, fh, T} = d;
  const [scelto, setScelto] = useState<string | null>(null);
  const [legendaAperta, setLegendaAperta] = useState(false);
  const sel = comp.punti.find(x => x.id === scelto) ?? null;
  const disponibili = comp.punti.filter(x => x.stato === 'disponibile' && x.tipo === 'nodo');
  const corrente = g.nodo ? trovaNodo(c, g.nodo) : null;
  const entraIn = (id: string) => azione((cc, ss) => entra(cc, ss, id));
  const cornice = immagine('cornice.webp');
  const larghezza = (n: Punto) => Math.max(...n.titolo.map(t => t.length)) * CARATTERE_LETTERA * (n.tipo === 'finale' ? fs * 0.9 : fs);
  // Lettere, post-it, stelle e frecce; per ogni punto anche l'area da toccare.
  const elementi: ReactNode[] = [];
  const aree: ReactNode[] = [];
  for (const n of comp.punti) {
    const e = d.etichette[n.id], sp = d.pos[n.id];
    let box: {x: number; y: number; w: number; h: number};
    if (n.postit) {
      const {w: pw, h: ph} = d.postit;
      const py = d.postitY[n.id];
      elementi.push(<Postit key={`p-${n.id}`} x={sp.x} y={py} w={pw} h={ph} ruota={n.inclinazione} fs={p * 2} />);
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
        elementi.push(<Riga key={`t-${n.id}-${i}`} lettere={riga} x={e.x} y={e.y + i * p * 2} fs={fsRiga} ancora={e.ancora} />);
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
      {l.righe.map((t, i) => <text key={i} x={p * 0.6} y={p * (1.7 + i * (verticale ? 1.25 : 1.15))} fontSize={p * (verticale ? 1.15 : 0.95)} className="penna">{t}</text>)}
    </g>
  );
  const colori = [...new Set(comp.punti.map(x => x.spillo.colore))];
  const legenda = d.legenda ?? (legendaAperta ? {x: fx + p * 2, y: fy + 70, w: fw - p * 4, h: p * (LEGENDA.length * 1.25 + 1.4), righe: LEGENDA} : null);

  return (
    <div className="bacheca" data-testid="mappa">
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

        {/* Livelli (giudizio del proprietario sulla Fase D): lettere cadute, cartoncino della legenda, lettere e post-it sul feltro; sopra
            tutto le cordicelle tese fra gli spilli, con la loro ombra che cade su ciò che sta sotto; in cima le teste delle puntine. */}
        {cadute.map((l, i) => <Riga key={`c-${i}`} lettere={[{...l, dy: 0}]} x={fx + fw * (verticale ? 0.82 + i * 0.07 : 0.62 + i * 0.06 + r() * 0.03)} y={d.fondo} fs={fs * 0.9} />)}
        {legenda && !verticale && cartoncinoLegenda(legenda)}
        {elementi}
        {comp.fili.map(f => <Cordicella key={`${f.da}>${f.a}`} a={d.pos[f.da]} b={d.pos[f.a]} tipo={f.tipo} rossa={f.sconfitta} seme={`${f.da}>${f.a}`} />)}
        {comp.punti.map(n => <Puntina key={n.id} id={n.id} x={d.pos[n.id].x} y={d.pos[n.id].y} lato={d.lato[n.id]} s={n.spillo} />)}
        {legenda && !verticale && <Puntina id="legenda" x={legenda.x + legenda.w / 2} y={legenda.y + p * 0.5} lato={latoPuntina(p, verticale, false)} s={{forma: 'ottone', colore: '#d4a944', inclinazione: 0}} />}
        {/* In verticale la legenda si apre sopra la mappa, a richiesta */}
        {legenda && verticale && <g data-testid="legenda" onClick={() => setLegendaAperta(false)}>{cartoncinoLegenda(legenda)}
          <Puntina id="legenda" x={legenda.x + legenda.w / 2} y={legenda.y + p * 0.5} lato={latoPuntina(p, verticale, false)} s={{forma: 'ottone', colore: '#d4a944', inclinazione: 0}} /></g>}
        {aree}
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
