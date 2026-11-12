// Il lettore di scene: sfondo, sprite, un personaggio alla volta, finestra di dialogo, e sopra le scelte, la partita simulata e la fine.
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import type {Carriera} from '../formato.ts';
import {avanti, conNome, finali, nodo, perdi, ritenta, salta, scegli, vinci, vista, type Evento, type Stato} from '../motore.ts';
import {cast, espressioneStacco, nomeDi, nomeSblocco, ritratto, ritrattoAlfa, ritrattoBocca, sfondo, sprite} from './dati.ts';
import {pagine, useTesto} from './testo.ts';
import {CARATTERE} from './font.ts';
import {preparaRitratto, Ritratto, Uscente, useMovimentoRidotto} from './Ritratto.tsx';
import {CHI_REAGISCE, DURATA_ENTRATA, LIVELLI, scalaDiChiReagisce, type Livello, type Posto} from '../animazione.ts';

type Azione = (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => void;
type Props = {c: Carriera; s: Stato; nome: string; eventi: {id: number; e: Evento}[]; azione: Azione;
  livello: Livello; onLivello: () => void; onMappa: () => void; onStato: () => void; onElenco: () => void; onNuovoGiro: () => void; onAchievement: () => void};

const LARGHEZZA_SFONDO = 1536, ALTEZZA_SFONDO = 1024;
/** Fase H: con ?banco nell'indirizzo la scena ha un fondo grigio uniforme, per il banco della fluidità (strumenti/banco.mjs). */
const BANCO = new URLSearchParams(window.location.search).has('banco');

/** Il testo a parole, ciascuna in uno span con il carattere da cui comincia: per sapere in che riga la mette il disegno. */
function parti(testo: string) {
  const out: (string | ReturnType<typeof Parola>)[] = [];
  for (const m of testo.matchAll(/\S+|\s+/g)) out.push(/\s/.test(m[0]) ? m[0] : Parola({da: m.index, testo: m[0]}));
  return out;
}
const Parola = ({da, testo}: {da: number; testo: string}) => <span key={da} data-da={da}>{testo}</span>;

export function Gioco({c, s, nome, eventi, azione, livello, onLivello, onMappa, onStato, onElenco, onNuovoGiro, onAchievement}: Props) {
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
    if (misura.h > misura.w && sp.verticale) {
      const h = sp.verticale.altezza * misura.h;
      return {left: ox + sp.x * bw, top: sp.verticale.piedi * misura.h - h, height: h};
    }
    const h = sp.altezza * bh;
    return {left: ox + sp.x * bw, top: oy + sp.piedi * bh - h, height: h};
  };

  const battuta = v.tipo === 'battuta' || v.tipo === 'ritento' ? v.battuta : null;
  const chiave = `${g.numero}:${g.nodo}:${g.passo}:${g.ritento}`;
  const testoPieno = battuta ? conNome(battuta.testo, nome) : v.tipo === 'narrazione' ? conNome(v.testo, nome) : '';
  // Finestra di dialogo (Fase F): sempre alta due righe, con un corpo fisso per orientamento; le battute più lunghe vanno a pagine da
  // due righe. Dove vanno a capo le parole lo dice il disegno: una copia invisibile del testo intero, parola per parola, nella finestra.
  const verticale = misura.h > misura.w;
  const px = Math.round(verticale ? Math.min(22, Math.max(18, misura.w * 0.054)) : Math.min(32, Math.max(20, misura.h * 0.04)));
  const chiaveMisura = `${testoPieno}|${CARATTERE.id}|${misura.w}x${misura.h}`;
  const [misurate, setMisurate] = useState({chiave: '', pagine: [0]});
  const inizioPagine = misurate.chiave === chiaveMisura ? misurate.pagine : [0];
  const copia = useRef<HTMLDivElement>(null);
  const [, rimisura] = useState(0);
  useLayoutEffect(() => {
    const el = copia.current;
    if (!el) return;
    const parole = [...el.querySelectorAll<HTMLElement>('[data-da]')];
    const cime = [...new Set(parole.map(x => x.offsetTop))].sort((a, b) => a - b);
    const p = pagine(parole.map(x => Number(x.dataset.da)), parole.map(x => cime.indexOf(x.offsetTop)));
    if (misurate.chiave !== chiaveMisura || p.join() !== misurate.pagine.join()) setMisurate({chiave: chiaveMisura, pagine: p});
  });
  // Quando il font arriva dalla rete gli a capo cambiano: si rimisura.
  useEffect(() => { let vivo = true; document.fonts?.ready.then(() => { if (vivo) rimisura(x => x + 1); }); return () => { vivo = false; }; }, []);

  const t = useTesto(chiave, testoPieno, inizioPagine, {
    velocita: battuta ? cast.personaggi[battuta.chi]?.velocita ?? 1 : 1,
    stacchi: battuta?.stacchi,
    interrotta: battuta?.interrotta,
    onInterrotta: () => azione(avanti),
  });

  const leggibile = v.tipo === 'battuta' || v.tipo === 'ritento' || v.tipo === 'narrazione' || v.tipo === 'messaggio';
  const tocca = () => {
    if (!leggibile) return;
    if (v.tipo !== 'messaggio' && t.tocca()) return;
    azione(avanti);
  };

  // Chi si vede (Fase J: al più due in scena). Chi parla, se non è in ombra né fuori campo; e, da quando arriva il primo stacco di regia su
  // chi ascolta, chi ascolta (con l'espressione esasperata, se c'è), che resta a fianco fino alla fine della battuta. Dalla Fase K a fuoco
  // è sempre chi parla.
  const parlante = battuta && !battuta.fuoriCampo ? {chi: battuta.chi, espressione: battuta.espressione} : null;
  const accantoRif = useRef<{chiave: string; chi: string; espressione: string} | null>(null);
  if (t.ascolta) accantoRif.current = {chiave, chi: t.ascolta.chi, espressione: espressioneStacco(t.ascolta.chi, t.ascolta.espressione)};
  else if (accantoRif.current && accantoRif.current.chiave !== chiave) accantoRif.current = null;
  const accanto = accantoRif.current && accantoRif.current.chi !== parlante?.chi ? accantoRif.current : null;
  type Figura = {chi: string; espressione?: string; src: string; posto: Posto; scala: number; parla: boolean; ascolta: boolean; alza: number};
  // Fase K: la testa di ognuno, dal cast (raggio della testa nella maglia), per la grandezza di chi reagisce.
  const testaDi = (chi: string) => cast.personaggi[chi]?.animazione?.maglia?.testa.raggio;
  // Fase F: in verticale un personaggio può stare più in alto (Spazienzio sembrava troppo basso rispetto allo sfondo).
  const alzaDi = (chi: string) => verticale ? (cast.personaggi[chi]?.verticale?.alza ?? 0) * misura.h : 0;
  const figure: Figura[] = [];
  if (parlante) {
    const src = ritratto(parlante.chi, parlante.espressione);
    if (src) figure.push({...parlante, src, posto: accanto ? 'parla' : 'solo', scala: 1, parla: !t.ascolta && t.scrive, ascolta: false, alza: alzaDi(parlante.chi)});
  }
  if (accanto) {
    const src = ritratto(accanto.chi, accanto.espressione);
    if (src) figure.push({...accanto, src, posto: 'ascolta',
      scala: scalaDiChiReagisce(parlante ? testaDi(parlante.chi) : undefined, testaDi(accanto.chi)), parla: false, ascolta: true, alza: alzaDi(accanto.chi)});
  }
  const parole = testoPieno.slice(0, t.scritti).split(/\s+/).filter(Boolean).length;
  const n = g.nodo ? nodo(c, g.nodo) : null;
  const messaggioPrima = n ? [...n.passi.slice(0, g.passo)].reverse().find(p => p.tipo === 'messaggio') : undefined;

  // Fase H: all'inizio di un nodo si preparano i ritratti che servono (battute e stacchi), così chi entra non aspetta i calcoli.
  useEffect(() => {
    if (!n) return;
    for (const p of n.passi) {
      if (p.tipo !== 'battuta' || p.fuoriCampo) continue;
      for (const q of [{chi: p.chi, espressione: p.espressione}, ...(p.stacchi ?? []).map(x => ({chi: x.chi, espressione: espressioneStacco(x.chi, x.espressione)}))]) {
        const src = q.espressione ? ritratto(q.chi, q.espressione) : null;
        if (src) preparaRitratto(q.chi, src, ritrattoBocca(q.chi, q.espressione), ritrattoAlfa(q.chi, q.espressione)).catch(() => {});
      }
    }
  }, [n]);

  // Fasi H e J: entrate e uscite, solo di lato. Ogni personaggio ha il suo ritratto (si rimonta quando arriva): entra dal suo lato; chi
  // lascia la scena esce dal suo lato, dal posto dove stava. Con il movimento ridotto nessuno entra né esce: si cambia e basta.
  const ridotto = useMovimentoRidotto();
  type Visto = {chi: string; src: string; srcAlfa: string | null; posto: Posto; scala: number; alza: number};
  const visti = useRef<Visto[]>([]);
  const [uscenti, setUscenti] = useState<(Visto & {id: number})[]>([]);
  const chiOra = figure.map(x => x.chi).join(',');
  useLayoutEffect(() => {
    if (!ridotto) for (const prima of visti.current) {
      if (figure.some(x => x.chi === prima.chi)) continue;
      const id = performance.now() + Math.random();
      setUscenti(x => [...x, {...prima, id}]);
      const tempo = cast.personaggi[prima.chi]?.tempoAnimazioni ?? 1;
      window.setTimeout(() => setUscenti(x => x.filter(u => u.id !== id)), (DURATA_ENTRATA / tempo) * 1000 + 100);
    }
    visti.current = figure.map(x => ({chi: x.chi, src: x.src, srcAlfa: ritrattoAlfa(x.chi, x.espressione), posto: x.posto, scala: x.scala, alza: x.alza}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chiOra, figure.map(x => `${x.posto}${x.scala}${x.src}`).join()]);



  return (
    <div className={`gioco${scossa ? ' scossa' : ''}${battuta || v.tipo === 'narrazione' ? ' con-dialogo' : ''}${BANCO ? ' banco' : ''}`} ref={scena} onClick={tocca} data-testid="scena">
      {sfondo(g.scena.sfondo, sfarfalla ?? g.scena.variante) && <img className="sfondo" src={sfondo(g.scena.sfondo, sfarfalla ?? g.scena.variante)!} alt="" />}
      {g.scena.sfondo && cast.sfondi[g.scena.sfondo]?.insegna && (() => {
        const i = cast.sfondi[g.scena.sfondo!].insegna!;
        const spenta = i.spentaIn?.includes(sfarfalla ?? g.scena.variante ?? '');
        return <div className={`insegna${spenta ? ' spenta' : ''}`} style={{left: ox + i.x * bw, top: oy + i.y * bh, width: i.larghezza * bw, fontSize: i.larghezza * bw / 11}}>{i.testo}</div>;
      })()}
      {Object.entries(g.scena.sprite).map(([id, p]) => <img key={id} className="sprite" src={sprite(id, p)} style={posa(id)} alt="" />)}
      {uscite.map(u => <img key={u.id} className="sprite esce" src={sprite(u.sprite, u.posa)} style={posa(u.sprite)} alt="" />)}
      {uscenti.map(u => <Uscente key={u.id} src={u.src} srcAlfa={u.srcAlfa} altezza={misura.h * (verticale ? 0.75 : 0.85)} alza={u.alza} posto={u.posto}
        verticale={verticale} luce={u.posto === 'ascolta' ? CHI_REAGISCE.luce : 1} scala={u.scala} tempo={cast.personaggi[u.chi]?.tempoAnimazioni ?? 1} />)}
      {figure.map(x => <Ritratto key={x.chi} src={x.src} srcBocca={ritrattoBocca(x.chi, x.espressione)} srcAlfa={ritrattoAlfa(x.chi, x.espressione)} alt={nomeDi(x.chi)} chi={x.chi}
        espressione={x.espressione} ascolta={x.ascolta} parlando={x.parla} ultimo={testoPieno[t.scritti - 1]} parole={x.parla ? parole : 0}
        livello={livello} altezza={misura.h * (verticale ? 0.75 : 0.85)} alza={x.alza} posto={x.posto} scala={x.scala} verticale={verticale}
        testid={x.ascolta ? 'ritratto-accanto' : 'ritratto'} />)}

      <span className="dove">{c.titolo}{n ? ` · ${n.titolo || n.etichetta}` : ''}</span>
      {/* Azioni: in alto a destra in orizzontale, in basso e grandi in verticale (Fase C, impressione 6). */}
      <div className="barra" onClick={e => e.stopPropagation()}>
        <button className="carattere" data-testid="animazione" title="Ritratti animati" onClick={onLivello}>✦ <small>{LIVELLI.find(l => l.id === livello)!.nome}</small></button>
        <button onClick={onStato}>Stato</button>
        <button data-testid="apri-mappa" onClick={onMappa}>Mappa</button>
        {leggibile && <button className="primario" data-testid="salta" onClick={() => azione(salta)}>{v.tipo === 'ritento' ? 'Salta il ritento' : 'Salta'}</button>}
      </div>

      {(battuta || v.tipo === 'narrazione') && (
        <div className="dialogo" data-testid="dialogo">
          {battuta && <div className="nome">{battuta.nome ?? nomeDi(battuta.chi)}{battuta.fuoriCampo ? ' (fuori campo)' : ''}</div>}
          <div className={`testo${v.tipo === 'narrazione' ? ' narrazione' : ''}`} style={{fontSize: px}} data-testid="testo">
            <span className="scorre">{t.visibile}</span><span className="resto" aria-hidden="true">{t.resto}</span>
            <div ref={copia} className="misura" aria-hidden="true">{parti(testoPieno)}</div>
          </div>
          {(t.completo || t.inStacco || t.finePagina) && <div className={`avanti${t.inStacco ? ' stacco' : ''}${t.finePagina ? ' pagina' : ''}`}>▼</div>}
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
          </div>
        </div>
      )}

      {v.tipo === 'fine' && (
        <div className="riquadro fine" onClick={e => e.stopPropagation()} data-testid="fine">
          <h2>{v.esito === 'completata' ? `${c.titolo}: completata` : `${c.titolo}: fallita`}</h2>
          {finali(c).length > 1 && <p className="finale-titolo" data-testid="finale">Finale: «{v.finale.titolo}» · finali visti {s.account.finali.length} su {finali(c).length}</p>}
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
