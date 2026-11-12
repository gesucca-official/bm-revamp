// CA-0a: il prototipo delle carriere. Elenco → mappa → nodo (scena, scelte, partite simulate) → mappa → … → fine del giro.
import {useCallback, useEffect, useRef, useState} from 'react';
import {LIVELLI, type Livello} from '../animazione.ts';
import type {Carriera} from '../formato.ts';
import {nuovoAccount, nuovoGiro, vista, type Evento, type Stato} from '../motore.ts';
import {carriere, nomeSblocco} from './dati.ts';
import {Gioco} from './Gioco.tsx';
import {Bacheca} from './Bacheca.tsx';
import {applicaCarattere} from './font.ts';
import {Achievement, Elenco, PannelloStato} from './Pannelli.tsx';
import {azzeraTutto, carica, caricaNome, salva, salvaNome} from './salvataggio.ts';

// Fase F: chiave nuova, perché il predefinito è cambiato (il cast decide) e la scelta della Fase E non deve restare.
applicaCarattere();
const CHIAVE_LIVELLO = 'bm-carriere-prototipo-v1:animazione-f';
type Avviso = {id: number; testo: string; tipo: Evento['tipo']};

export function App() {
  const [nome, setNome] = useState(caricaNome);
  const [stati, setStati] = useState<Record<string, Stato>>(() => Object.fromEntries(carriere.map(c => [c.id, carica(c)])));
  const [aperta, setAperta] = useState<string | null>(null);
  // Ritratti animati (Fase E): fermi, movimento, maglia; si sceglie nell'elenco o con «✦» nella scena e resta salvato nel browser.
  const [livello, setLivello] = useState<Livello>(() => {
    try { const l = localStorage.getItem(CHIAVE_LIVELLO); return LIVELLI.some(x => x.id === l) ? l as Livello : 'cast'; } catch { return 'cast'; }
  });
  useEffect(() => { try { localStorage.setItem(CHIAVE_LIVELLO, livello); } catch { /* niente */ } }, [livello]);
  const prossimoLivello = () => setLivello(x => LIVELLI[(LIVELLI.findIndex(l => l.id === x) + 1) % LIVELLI.length].id);
  const [pannello, setPannello] = useState<'gioco' | 'mappa' | 'achievement'>('gioco');
  const [statoAperto, setStatoAperto] = useState(false);
  const [eventi, setEventi] = useState<{id: number; e: Evento}[]>([]);
  const [avvisi, setAvvisi] = useState<Avviso[]>([]);
  const contatore = useRef(0);

  const imposta = useCallback((c: Carriera, s: Stato, nuovi: Evento[] = []) => {
    salva(c, s);
    setStati(x => ({...x, [c.id]: s}));
    if (!nuovi.length) return;
    const conId = nuovi.map(e => ({id: ++contatore.current, e}));
    setEventi(x => [...x.slice(-20), ...conId]);
    for (const {id, e} of conId) {
      const testo = e.tipo === 'sblocco' ? `Sbloccato: ${nomeSblocco(e.sblocco)}`
        : e.tipo === 'achievement' ? `Achievement: ${c.achievement.find(a => a.id === e.achievement)?.titolo ?? e.achievement}`
        : e.tipo === 'ramo' ? 'Hai perso… e si apre un\'altra strada' : null;
      if (!testo) continue;
      setAvvisi(x => [...x, {id, testo, tipo: e.tipo}]);
      window.setTimeout(() => setAvvisi(x => x.filter(a => a.id !== id)), 3200);
    }
  }, []);

  const c = carriere.find(x => x.id === aperta);
  // Notifiche nello stile della bacheca (ritocchi della Fase D): post-it per gli achievement, cartoncino per sblocchi e rami.
  const avvisiDom = <div className="avvisi">{avvisi.map(a => <div key={a.id} className={`avviso ${a.tipo}`} data-testid="avviso">{a.testo}</div>)}</div>;

  if (!c) {
    return <>
      <Elenco carriere={carriere} stati={stati} nome={nome} onNome={n => { setNome(n); salvaNome(n); }}
        livello={livello} onLivello={setLivello}
        onApri={id => { setAperta(id); setPannello('gioco'); }}
        onNuovoGiro={id => { const cc = carriere.find(x => x.id === id)!; imposta(cc, nuovoGiro(cc, stati[id].account, stati[id].giro)); setAperta(id); setPannello('mappa'); }}
        onAchievement={id => { setAperta(id); setPannello('achievement'); }}
        onAzzera={() => { azzeraTutto(); setStati(Object.fromEntries(carriere.map(x => [x.id, nuovoGiro(x, nuovoAccount())]))); }} />
      {avvisiDom}
    </>;
  }

  const s = stati[c.id];
  const azione = (f: (c: Carriera, s: Stato) => {stato: Stato; eventi: Evento[]}) => {
    const r = f(c, stati[c.id]);
    imposta(c, r.stato, r.eventi);
    setPannello('gioco');
  };
  const nuovo = () => { imposta(c, nuovoGiro(c, s.account, s.giro)); setPannello('mappa'); };
  const v = vista(c, s);
  const stato = statoAperto && <PannelloStato s={s} onChiudi={() => setStatoAperto(false)} />;

  let schermo;
  if (pannello === 'achievement') schermo = <Achievement c={c} s={s} onChiudi={() => setPannello(v.tipo === 'mappa' ? 'mappa' : 'gioco')} />;
  else if (pannello === 'mappa' || v.tipo === 'mappa') {
    schermo = <Bacheca c={c} s={s} azione={azione} onRiprendi={() => setPannello('gioco')} onAchievement={() => setPannello('achievement')}
      onNuovoGiro={nuovo} onElenco={() => setAperta(null)} onStato={() => setStatoAperto(x => !x)} />;
  } else {
    schermo = <Gioco c={c} s={s} nome={nome || 'Giocatore'} eventi={eventi} azione={azione} livello={livello} onLivello={prossimoLivello} onMappa={() => setPannello('mappa')}
      onStato={() => setStatoAperto(x => !x)} onElenco={() => setAperta(null)} onNuovoGiro={nuovo} onAchievement={() => setPannello('achievement')} />;
  }
  return <>{schermo}{stato}{avvisiDom}</>;
}
