// La mappa dei rami: dove si è, cosa è stato fatto, cosa è disponibile, cosa questo giro ha escluso e cosa è ancora «???».
import {useState} from 'react';
import type {Carriera, Nodo} from '../formato.ts';
import {entra, finali, nodo as trovaNodo, risolvi, avversari, type Evento, type Stato} from '../motore.ts';
import {archi, caselle, disposizione, statiMappa, type Casella, type StatoNodo} from '../mappa.ts';
import {nomeDi, nomeSblocco} from './dati.ts';
import {useVerticale} from './orientamento.ts';

type Props = {c: Carriera; s: Stato; azione: (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => void;
  onRiprendi: () => void; onAchievement: () => void; onNuovoGiro: () => void; onElenco: () => void; onStato: () => void};

const DESCRIZIONE: Record<StatoNodo, string> = {
  corrente: 'Sei qui.', disponibile: 'Disponibile: toccalo per entrare.', bloccato: 'Raggiunto, ma per ora chiuso.',
  fatto: 'Fatto in questo giro.', aperto: 'Ancora raggiungibile in questo giro.', escluso: 'Escluso in questo giro: un\'altra scelta l\'ha chiuso.',
  nascosto: '',
};

export function Mappa({c, s, azione, onRiprendi, onAchievement, onNuovoGiro, onElenco, onStato}: Props) {
  const verticale = useVerticale();
  const stati = statiMappa(c, s);
  const {posizione, colonne, righe} = disposizione(c);
  const disponibili = c.nodi.filter(n => stati[n.id].stato === 'disponibile');
  const [scelto, setScelto] = useState<string | null>(null);
  const tutte = caselle(c);
  const sel = scelto ? tutte.find(x => x.id === scelto) ?? null : null;

  // Coordinate in una griglia: le colonne scorrono da sinistra a destra in orizzontale, dall'alto in basso in verticale.
  const CELLA_L = verticale ? 150 : 190, CELLA_A = verticale ? 112 : 120;
  const xy = (id: string) => {
    const p = posizione[id];
    const [a, b] = verticale ? [p.riga, p.colonna] : [p.colonna, p.riga];
    return {x: a * CELLA_L + CELLA_L / 2, y: b * CELLA_A + CELLA_A / 2};
  };
  const larghezza = (verticale ? righe : colonne) * CELLA_L, altezza = (verticale ? colonne : righe) * CELLA_A;
  const visibili = new Set(tutte.filter(n => stati[n.id].stato !== 'nascosto').map(n => n.id));

  const entraIn = (id: string) => azione((cc, ss) => entra(cc, ss, id));
  const corrente = c.nodi.find(n => stati[n.id].stato === 'corrente');

  return (
    <div className="mappa" data-testid="mappa">
      <header>
        <div className="titolo"><b>{c.titolo}</b> · giro {s.giro.numero}{s.giro.fine ? ' · finito' : ''}</div>
        <div className="conti">Sblocchi {s.account.sblocchi.length} · Finali {s.account.finali.length}/{finali(c).length} · Achievement {s.account.achievement.length}/{c.achievement.length}</div>
        <nav>
          <button onClick={onAchievement} data-testid="apri-achievement">Achievement</button>
          <button onClick={onNuovoGiro} data-testid="mappa-nuovo-giro">Nuovo giro</button>
          <button onClick={onStato}>Stato</button>
          <button onClick={onElenco}>Elenco</button>
        </nav>
      </header>

      <div className="tela">
        <div className="grafo" style={{width: larghezza, height: altezza}}>
          <svg width={larghezza} height={altezza}>
            {archi(c).filter(a => visibili.has(a.da) && visibili.has(a.a)).map((a, i) => {
              const p = xy(a.da), q = xy(a.a);
              // Un arco che salta una colonna sulla stessa riga passerebbe sotto la casella di mezzo: si incurva.
              const salto = Math.abs(posizione[a.a].colonna - posizione[a.da].colonna) > 1 && posizione[a.a].riga === posizione[a.da].riga;
              const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2;
              const percorso = a.indietro
                ? `M${p.x},${p.y} C${p.x + (verticale ? 90 : 0)},${p.y + (verticale ? 0 : 80)} ${q.x + (verticale ? 90 : 0)},${q.y + (verticale ? 0 : 80)} ${q.x},${q.y}`
                : salto ? `M${p.x},${p.y} Q${mx + (verticale ? 110 : 0)},${my - (verticale ? 0 : 110)} ${q.x},${q.y}` : `M${p.x},${p.y} L${q.x},${q.y}`;
              return <path key={i} d={percorso} className={`arco ${a.tipo}${a.indietro ? ' indietro' : ''}`} />;
            })}
          </svg>
          {tutte.filter(n => visibili.has(n.id)).map(n => {
            const {stato, noto} = stati[n.id];
            const {x, y} = xy(n.id);
            return (
              <button key={n.id} className={`casella ${stato}${n.fine ? ' finale' : ''}${scelto === n.id ? ' scelta' : ''}`} style={{left: x, top: y}}
                data-testid={`nodo-${n.id}`} data-stato={stato}
                onClick={() => stato === 'disponibile' ? entraIn(n.id) : setScelto(n.id)}>
                <small>{n.etichetta}{n.segreto ? ' ★' : ''}</small>
                <span>{noto || stato === 'corrente' ? n.titolo || n.etichetta : '???'}</span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="pannello-nodo">
        {disponibili.length > 0 && !sel && (
          <button className="primario" data-testid="mappa-continua" onClick={() => entraIn(disponibili[0].id)}>
            Continua: {stati[disponibili[0].id].noto ? disponibili[0].titolo : '???'}
          </button>
        )}
        {corrente && !sel && <button className="primario" onClick={onRiprendi}>Riprendi: {corrente.titolo}</button>}
        {s.giro.fine && !sel && <span>Giro finito. <button className="primario" onClick={onNuovoGiro}>Nuovo giro</button></span>}
        {sel && <Dettaglio c={c} n={sel} s={s} stato={stati[sel.id].stato} noto={stati[sel.id].noto} onEntra={() => entraIn(sel.id)} onRiprendi={onRiprendi} onChiudi={() => setScelto(null)} />}
        <p className="legenda">
          <i className="l corrente" /> qui <i className="l disponibile" /> disponibile <i className="l fatto" /> fatto
          <i className="l aperto" /> da fare <i className="l escluso" /> escluso · «???» mai visto
        </p>
      </footer>
    </div>
  );
}

function Dettaglio({c, n: casella, s, stato, noto, onEntra, onRiprendi, onChiudi}: {c: Carriera; n: Casella; s: Stato; stato: StatoNodo; noto: boolean;
  onEntra: () => void; onRiprendi: () => void; onChiudi: () => void}) {
  if (casella.fine) {
    return (
      <div className="dettaglio" data-testid="dettaglio">
        <b>{casella.etichetta}{noto ? ` — ${casella.titolo}` : ' — ???'}</b>
        <span>{stato === 'fatto' ? 'Il finale di questo giro.' : stato === 'aperto' ? 'Ancora raggiungibile in questo giro.' : 'Non più raggiungibile in questo giro.'}
          {noto ? ' Visto in un giro.' : ' Mai visto.'}</span>
        <span className="pulsanti"><button onClick={onChiudi}>Chiudi</button></span>
      </div>
    );
  }
  const n: Nodo = trovaNodo(c, casella.id);
  const partite = n.passi.flatMap(p => p.tipo === 'partita' ? [p] : []);
  const sblocchi = n.passi.flatMap(p => p.tipo === 'sblocco' ? [p.sblocco] : []);
  return (
    <div className="dettaglio" data-testid="dettaglio">
      <b>{n.etichetta}{noto ? ` — ${n.titolo}` : ' — ???'}</b>
      <span>{DESCRIZIONE[stato]}</span>
      {noto && partite.map(p => (
        <span key={p.id}>{p.modo === 'duello' ? 'Duello' : 'FFA'}: {nomeDi(risolvi(p.giocatore, s))} contro {avversari(p, s).map(nomeDi).join(', ')}</span>
      ))}
      {noto && sblocchi.length > 0 && <span>Sblocca: {sblocchi.map(nomeSblocco).join(', ')}</span>}
      <span className="pulsanti">
        {stato === 'disponibile' && <button className="primario" onClick={onEntra}>Entra</button>}
        {stato === 'corrente' && <button className="primario" onClick={onRiprendi}>Riprendi</button>}
        <button onClick={onChiudi}>Chiudi</button>
      </span>
    </div>
  );
}
