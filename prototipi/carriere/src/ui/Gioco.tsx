// Il lettore di scene: sfondo, sprite, un personaggio alla volta, finestra di dialogo, e sopra le scelte, la partita simulata e la fine.
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {Carriera} from '../formato.ts';
import {avanti, conNome, nodo, perdi, prendiRamo, ritenta, salta, scegli, vinci, vista, type Evento, type Stato} from '../motore.ts';
import {cast, nomeDi, nomeSblocco, ritratto, sfondo, sprite} from './dati.ts';
import {useTesto} from './testo.ts';

type Azione = (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => void;
type Props = {c: Carriera; s: Stato; nome: string; eventi: {id: number; e: Evento}[]; azione: Azione;
  onMappa: () => void; onStato: () => void; onElenco: () => void; onNuovoGiro: () => void; onAchievement: () => void};

const LARGHEZZA_SFONDO = 1536, ALTEZZA_SFONDO = 1024;

export function Gioco({c, s, nome, eventi, azione, onMappa, onStato, onElenco, onNuovoGiro, onAchievement}: Props) {
  const v = vista(c, s);
  const g = s.giro;
  const scena = useRef<HTMLDivElement>(null);
  const [misura, setMisura] = useState({w: 1366, h: 768});
  const [scossa, setScossa] = useState(false);
  const [sfarfalla, setSfarfalla] = useState<string | null>(null);
  const [uscite, setUscite] = useState<{id: number; sprite: string; posa: string}[]>([]);
  const ultimo = useRef(eventi.at(-1)?.id ?? 0);

  useLayoutEffect(() => {
    const el = scena.current;
    if (!el) return;
    const o = new ResizeObserver(() => setMisura({w: el.clientWidth, h: el.clientHeight}));
    o.observe(el);
    return () => o.disconnect();
  }, []);

  // Effetti di regia, una volta per evento.
  useEffect(() => {
    for (const {id, e} of eventi) {
      if (id <= ultimo.current) continue;
      ultimo.current = id;
      if (e.tipo === 'scossa') { setScossa(true); window.setTimeout(() => setScossa(false), 450); }
      if (e.tipo === 'sfarfallio' && e.variante) {
        const variante = e.variante;
        for (let i = 0; i < 7; i++) window.setTimeout(() => setSfarfalla(i % 2 === 0 ? variante : null), i * 160);
      }
      if (e.tipo === 'esce') {
        const u = {id, sprite: e.sprite, posa: e.posa ?? ''};
        setUscite(x => [...x, u]);
        window.setTimeout(() => setUscite(x => x.filter(y => y.id !== id)), 1100);
      }
    }
  }, [eventi]);

  // Lo sfondo è ritagliato come «cover»: gli sprite si posano sulle coordinate dello sfondo, non dello schermo.
  const scala = Math.max(misura.w / LARGHEZZA_SFONDO, misura.h / ALTEZZA_SFONDO);
  const bw = LARGHEZZA_SFONDO * scala, bh = ALTEZZA_SFONDO * scala;
  const ox = (misura.w - bw) / 2, oy = (misura.h - bh) / 2;
  const posa = (id: string) => {
    const sp = cast.sprite[id];
    const h = sp.altezza * bh;
    return {left: ox + sp.x * bw, top: oy + sp.piedi * bh - h, height: h};
  };

  const battuta = v.tipo === 'battuta' || v.tipo === 'ritento' ? v.battuta : null;
  const chiave = `${g.numero}:${g.nodo}:${g.passo}:${g.ritento}`;
  const testoPieno = battuta ? conNome(battuta.testo, nome) : v.tipo === 'narrazione' ? conNome(v.testo, nome) : '';
  const t = useTesto(chiave, testoPieno, {
    velocita: battuta ? cast.personaggi[battuta.chi]?.velocita ?? 1 : 1,
    stacchi: battuta?.stacchi,
    interrotta: battuta?.interrotta,
    onInterrotta: () => azione(avanti),
  });

  const leggibile = v.tipo === 'battuta' || v.tipo === 'ritento' || v.tipo === 'narrazione' || v.tipo === 'messaggio';
  const tocca = () => {
    if (!leggibile) return;
    if (v.tipo !== 'messaggio' && !t.completo) t.completa();
    else azione(avanti);
  };

  // Chi si vede: chi parla, o chi ascolta durante uno stacco. Nessun ritratto per le figure in ombra e il fuori campo.
  const inQuadro = t.ascolta ?? (battuta && !battuta.fuoriCampo ? {chi: battuta.chi, espressione: battuta.espressione} : null);
  const volto = inQuadro ? ritratto(inQuadro.chi, inQuadro.espressione) : null;
  const n = g.nodo ? nodo(c, g.nodo) : null;
  const messaggioPrima = n ? [...n.passi.slice(0, g.passo)].reverse().find(p => p.tipo === 'messaggio') : undefined;

  return (
    <div className={`gioco${scossa ? ' scossa' : ''}`} ref={scena} onClick={tocca} data-testid="scena">
      {sfondo(g.scena.sfondo, sfarfalla ?? g.scena.variante) && <img className="sfondo" src={sfondo(g.scena.sfondo, sfarfalla ?? g.scena.variante)!} alt="" />}
      {g.scena.sfondo && cast.sfondi[g.scena.sfondo]?.insegna && (() => {
        const i = cast.sfondi[g.scena.sfondo!].insegna!;
        const spenta = i.spentaIn?.includes(sfarfalla ?? g.scena.variante ?? '');
        return <div className={`insegna${spenta ? ' spenta' : ''}`} style={{left: ox + i.x * bw, top: oy + i.y * bh, width: i.larghezza * bw, fontSize: i.larghezza * bw / 11}}>{i.testo}</div>;
      })()}
      {Object.entries(g.scena.sprite).map(([id, p]) => <img key={id} className="sprite" src={sprite(id, p)} style={posa(id)} alt="" />)}
      {uscite.map(u => <img key={u.id} className="sprite esce" src={sprite(u.sprite, u.posa)} style={posa(u.sprite)} alt="" />)}
      {volto && <img className={`ritratto${t.ascolta ? ' ascolta' : ''}`} src={volto} alt={nomeDi(inQuadro!.chi)} />}

      <div className="barra" onClick={e => e.stopPropagation()}>
        <span className="dove">{c.titolo}{n ? ` · ${n.titolo || n.etichetta}` : ''}</span>
        {leggibile && <button data-testid="salta" onClick={() => azione(salta)}>{v.tipo === 'ritento' ? 'Salta il ritento' : 'Salta'}</button>}
        <button data-testid="apri-mappa" onClick={onMappa}>Mappa</button>
        <button onClick={onStato}>Stato</button>
      </div>

      {(battuta || v.tipo === 'narrazione') && (
        <div className="dialogo" data-testid="dialogo">
          {battuta && <div className="nome">{battuta.nome ?? nomeDi(battuta.chi)}{battuta.fuoriCampo ? ' (fuori campo)' : ''}</div>}
          <div className={v.tipo === 'narrazione' ? 'testo narrazione' : 'testo'}>{t.visibile}</div>
          {t.completo && <div className="avanti">▼</div>}
        </div>
      )}

      {v.tipo === 'messaggio' && (
        <div className="notifica" data-testid="notifica">
          <div className="mittente">📱 {v.da ? nomeDi(v.da) : 'Messaggio'}</div>
          <div>{conNome(v.testo, nome)}</div>
          <div className="suggerimento">Tocca per continuare</div>
        </div>
      )}

      {v.tipo === 'scelta' && v.scelta.modo === 'muta' && (
        <div className="riquadro scelta-muta" onClick={e => e.stopPropagation()}>
          {v.scelta.domanda && <h2>{v.scelta.domanda[0].toUpperCase() + v.scelta.domanda.slice(1)}</h2>}
          <div className="opzioni">
            {v.opzioni.map(({indice, opzione}) => (
              <button key={indice} className="offerta" data-testid={`opzione-${indice}`} onClick={() => azione((cc, ss) => scegli(cc, ss, indice))}>
                {opzione.chi && ritratto(opzione.chi) && <img src={ritratto(opzione.chi)!} alt="" />}
                <span>{opzione.etichetta}</span>
              </button>
            ))}
          </div>
          <p className="nota">Non parli: scegli con chi andare.</p>
        </div>
      )}

      {v.tipo === 'scelta' && v.scelta.modo === 'messaggio' && (
        <div className="riquadro telefono" onClick={e => e.stopPropagation()}>
          <div className="schermo">
            <div className="intestazione">{messaggioPrima?.tipo === 'messaggio' && messaggioPrima.da ? nomeDi(messaggioPrima.da) : 'Messaggi'}</div>
            {messaggioPrima?.tipo === 'messaggio' && <div className="fumetto ricevuto">{conNome(messaggioPrima.testo, nome)}</div>}
            <div className="rispondi">Rispondi:</div>
            {v.opzioni.map(({indice, opzione}) => (
              <button key={indice} className="fumetto risposta" data-testid={`opzione-${indice}`} onClick={() => azione((cc, ss) => scegli(cc, ss, indice))}>{opzione.etichetta}</button>
            ))}
          </div>
        </div>
      )}

      {v.tipo === 'partita' && (
        <div className="riquadro partita" onClick={e => e.stopPropagation()}>
          <h2>{v.partita.modo === 'duello' ? 'Duello' : 'Tutti contro tutti'}</h2>
          <div className="tavolo">
            <figure className="per-te">{ritratto(v.giocatore) && <img src={ritratto(v.giocatore)!} alt="" />}<figcaption>{nomeDi(v.giocatore)}<small>gioca per te</small></figcaption></figure>
            <span className="contro">contro</span>
            <div className="avversari">
              {v.avversari.map(a => <figure key={a}>{ritratto(a) && <img src={ritratto(a)!} alt="" />}<figcaption>{nomeDi(a)}</figcaption></figure>)}
            </div>
          </div>
          {v.partita.modificatori?.length ? <p className="nota">Modificatori: {v.partita.modificatori.join(', ')}</p> : null}
          {v.sblocchi.length > 0 && <p className="nota">Se vinci: {v.sblocchi.map(nomeSblocco).join(', ')}</p>}
          <p className="nota">Partita simulata: nel prototipo si sceglie l'esito.</p>
          <div className="pulsanti">
            <button className="primario" data-testid="vinci" onClick={() => azione(vinci)}>Vinci</button>
            <button data-testid="perdi" onClick={() => azione(perdi)}>Perdi</button>
          </div>
        </div>
      )}

      {v.tipo === 'sconfitta' && (
        <div className="riquadro sconfitta" onClick={e => e.stopPropagation()}>
          <h2>Hai perso</h2>
          <div className="pulsanti">
            <button className="primario" data-testid="ritenta" onClick={() => azione(ritenta)}>Ritenta</button>
            {v.ramo && 'nodo' in v.ramo && (
              <button data-testid="ramo" onClick={() => azione(prendiRamo)}>
                Prendi l'altra strada: {s.account.esplorati.includes(v.ramo.nodo) ? nodo(c, v.ramo.nodo).titolo : '???'}
              </button>
            )}
          </div>
          {v.ramo && <p className="nota">Questa sconfitta apre un ramo nuovo.</p>}
        </div>
      )}

      {v.tipo === 'fine' && (
        <div className="riquadro fine" onClick={e => e.stopPropagation()} data-testid="fine">
          <h2>{v.esito === 'completata' ? `${c.titolo}: completata` : `${c.titolo}: fallita`}</h2>
          <p>Giro {g.numero}. Nodi esplorati: {s.account.esplorati.length} su {c.nodi.filter(x => !x.segreto || s.account.esplorati.includes(x.id)).length}{c.nodi.some(x => x.segreto && !s.account.esplorati.includes(x.id)) ? ' (e forse altri)' : ''}.</p>
          {g.nuovi.sblocchi.length > 0 && <p>Sbloccati: {g.nuovi.sblocchi.map(nomeSblocco).join(', ')}</p>}
          {g.nuovi.achievement.length > 0 && <p>Achievement: {g.nuovi.achievement.map(id => c.achievement.find(a => a.id === id)?.titolo ?? id).join(', ')}</p>}
          <div className="pulsanti">
            <button className="primario" data-testid="nuovo-giro" onClick={onNuovoGiro}>Nuovo giro</button>
            <button onClick={onMappa}>Mappa</button>
            <button onClick={onAchievement}>Achievement</button>
            <button onClick={onElenco}>Elenco</button>
          </div>
        </div>
      )}
    </div>
  );
}
