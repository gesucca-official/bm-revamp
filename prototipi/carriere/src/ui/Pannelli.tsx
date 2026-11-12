// Elenco delle carriere, achievement e pannello dello stato per le prove.
import type {Carriera} from '../formato.ts';
import {finali, indizio, vista, type Stato} from '../motore.ts';
import {nomeSblocco} from './dati.ts';
import {CARATTERI} from './font.ts';
import {LIVELLI, type Livello} from '../animazione.ts';

/** Battute vere del tutorial, con accenti e maiuscole. */
const CAMPIONE = 'Lui è Spazienzio. Ha finito la pazienza nel 2019, e da allora non gli è più tornata. «È FREDDO, FA SCHIFO.»';

export function Elenco({carriere, stati, nome, onNome, carattere, onCarattere, livello, onLivello, onApri, onNuovoGiro, onAchievement, onAzzera}: {carriere: Carriera[]; stati: Record<string, Stato>;
  nome: string; onNome: (n: string) => void; carattere: string; onCarattere: (id: string) => void; livello: Livello; onLivello: (l: Livello) => void; onApri: (id: string) => void; onNuovoGiro: (id: string) => void; onAchievement: (id: string) => void; onAzzera: () => void}) {
  return (
    <div className="elenco" data-testid="elenco">
      <h1>Carriere <small>prototipo CA-0a</small></h1>
      <label className="nome-giocatore">Il tuo nome nelle battute <input value={nome} onChange={e => onNome(e.target.value)} maxLength={24} /></label>
      {/* Campionario dei caratteri (secondo giro della Fase C): la stessa battuta in ogni font, si tocca per sceglierlo. */}
      {/* Ritratti animati (Fase E e F): come dice il cast, o tutti in un modo per confrontare. */}
      <h2 className="titoletto">Ritratti di chi parla</h2>
      <div className="pulsanti scelta-livello" data-testid="livelli">
        {LIVELLI.map(l => <button key={l.id} className={l.id === livello ? 'scelto' : ''} data-testid={`livello-${l.id}`} onClick={() => onLivello(l.id)}>{l.nome}</button>)}
      </div>
      <h2 className="titoletto">Carattere dei dialoghi</h2>
      <div className="selettore-carattere" data-testid="campionario">
        {CARATTERI.map(f => (
          <button key={f.id} className={`campione${f.id === carattere ? ' scelto' : ''}`} data-testid={`carattere-${f.id}`} onClick={() => onCarattere(f.id)}>
            <small>{f.nome}{f.id === carattere ? ' · scelto' : ''}</small>
            <span style={{fontFamily: f.famiglia, fontWeight: f.peso ?? 400, WebkitTextStroke: `${f.contorno ?? 0}em #100b08`}}>{CAMPIONE}</span>
          </button>
        ))}
      </div>
      <div className="schede">
        {carriere.map(c => {
          const s = stati[c.id];
          const v = vista(c, s);
          const iniziata = s.giro.visti.length > 0;
          const noti = c.nodi.filter(n => !n.segreto || s.account.esplorati.includes(n.id));
          return (
            <section key={c.id} className="scheda">
              <h2>{c.titolo}</h2>
              <p>{s.giro.fine ? `Giro ${s.giro.numero} finito` : iniziata ? `Giro ${s.giro.numero} in corso` : `Giro ${s.giro.numero} da iniziare`}
                {' · '}giri completati {s.account.giri}</p>
              <p>Nodi esplorati {s.account.esplorati.length}/{noti.length} · finali {s.account.finali.length}/{finali(c).length} · achievement {s.account.achievement.length}/{c.achievement.length}</p>
              {s.account.sblocchi.length > 0 && <p className="nota">Sblocchi: {s.account.sblocchi.map(nomeSblocco).join(', ')}</p>}
              <div className="pulsanti">
                <button className="primario" data-testid={`apri-${c.id}`} onClick={() => onApri(c.id)}>{iniziata || v.tipo === 'fine' ? 'Continua' : 'Inizia'}</button>
                <button onClick={() => onNuovoGiro(c.id)}>Nuovo giro</button>
                <button onClick={() => onAchievement(c.id)}>Achievement</button>
              </div>
            </section>
          );
        })}
      </div>
      <p className="nota">Prototipo usa e getta: partite simulate, progresso salvato solo in questo browser. <button onClick={onAzzera} data-testid="azzera">Azzera tutto</button></p>
    </div>
  );
}

export function Achievement({c, s, onChiudi}: {c: Carriera; s: Stato; onChiudi: () => void}) {
  return (
    <div className="achievement" data-testid="achievement">
      <header><b>{c.titolo}: achievement</b><button onClick={onChiudi}>Chiudi</button></header>
      <ul>
        {c.achievement.map(a => {
          const preso = s.account.achievement.includes(a.id);
          const ind = indizio(a, s);
          return (
            <li key={a.id} className={preso ? 'preso' : a.nascosto ? 'nascosto' : ''}>
              <b>{preso || !a.nascosto ? a.titolo : '???'}</b>
              {preso ? <span>{a.descrizione}</span> : ind ? <span className="indizio">Indizio: {ind}</span> : <span className="indizio">???</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PannelloStato({s, onChiudi}: {s: Stato; onChiudi: () => void}) {
  const g = s.giro;
  const riga = (k: string, v: string) => <div><b>{k}</b> {v || '—'}</div>;
  return (
    <div className="pannello-stato" onClick={e => e.stopPropagation()} data-testid="pannello-stato">
      <header><b>Stato (per le prove)</b><button onClick={onChiudi}>Chiudi</button></header>
      {riga('Giro', `${g.numero}, nodo ${g.nodo ?? '(mappa)'}, passo ${g.passo}${g.ritento !== null ? `, ritento ${g.ritento}` : ''}`)}
      {riga('Segni', Object.entries(g.segni).map(([k, v]) => `${k} = ${v}`).join(', '))}
      {riga('Visti', g.visti.join(', '))}
      {riga('Vinti', g.vinti.join(', '))}
      {riga('Persi', g.persi.join(', '))}
      {riga('Sconfitte per nodo', Object.entries(g.tentativi).map(([k, v]) => `${k} ${v}`).join(', '))}
      {riga('Prossimi', g.prossimi.map(d => 'nodo' in d ? d.nodo + (d.da ? ` (da ${d.da})` : '') : `fine ${d.fine}`).join(', '))}
      {riga('Account: esplorati', s.account.esplorati.join(', '))}
      {riga('Account: sblocchi', s.account.sblocchi.join(', '))}
      {riga('Account: achievement', s.account.achievement.join(', '))}
      {riga('Account: finali', s.account.finali.join(', '))}
      {riga('Account: giri', String(s.account.giri))}
    </div>
  );
}
