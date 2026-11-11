// Il testo che scorre, a pezzi con gli stacchi su chi ascolta (la regia delle frasi di Piera) e con le interruzioni.
// Fase C (prova del proprietario, impressione 4): lo stacco resta fino al tocco, con una durata minima.
import {useEffect, useRef, useState} from 'react';

export const CARATTERI_AL_SECONDO = 45;   // velocità 1; il cast la moltiplica per personaggio (Piera 0.3)
export const STACCO_MINIMO = 700;          // ms: prima di questo tempo un tocco sullo stacco aspetta, poi va avanti
const PASSO = 33;

export type Ascolto = {chi: string; espressione: string};
type Opzioni = {velocita: number; stacchi?: Ascolto[]; interrotta?: boolean; onInterrotta?: () => void};

/** I pezzi si dividono dopo i puntini di sospensione, solo se la battuta ha degli stacchi. */
export const pezzi = (testo: string, conStacchi: boolean) => conStacchi ? testo.split(/(?<=\.\.\.)\s+/).filter(Boolean) : [testo];

type Stato = {pezzo: number; car: number; stacco: number | null; ascolta: Ascolto | null; interrotta: boolean; completo: boolean; inAttesa: boolean};

/**
 * Regole del tocco: mentre scorre un pezzo, il tocco lo completa (con gli stacchi) o completa tutta la battuta (senza); durante uno stacco,
 * il tocco passa al pezzo dopo, ma non prima della durata minima. `tocca` dice se il tocco è stato usato qui; se no, si va alla battuta dopo.
 */
export function useTesto(chiave: string, testo: string, o: Opzioni) {
  const parti = pezzi(testo, !!o.stacchi?.length);
  const [, ridisegna] = useState(0);
  const st = useRef<Stato>({pezzo: 0, car: 0, stacco: null, ascolta: null, interrotta: false, completo: false, inAttesa: false});
  const timer = useRef<number | undefined>(undefined);
  const opz = useRef(o);
  opz.current = o;

  const prossimoPezzo = () => {
    const s = st.current;
    window.clearTimeout(timer.current);
    Object.assign(s, {pezzo: s.pezzo + 1, car: 0, stacco: null, ascolta: null, inAttesa: false});
    ridisegna(x => x + 1);
  };
  const iniziaStacco = () => {
    const s = st.current;
    const lista = opz.current.stacchi ?? [];
    if (!lista.length) { prossimoPezzo(); return; }
    Object.assign(s, {stacco: performance.now(), ascolta: lista[s.pezzo % lista.length], inAttesa: false});
    ridisegna(x => x + 1);
  };

  useEffect(() => {
    st.current = {pezzo: 0, car: 0, stacco: null, ascolta: null, interrotta: false, completo: !testo, inAttesa: false};
    ridisegna(x => x + 1);
    const cps = CARATTERI_AL_SECONDO * (opz.current.velocita || 1);
    const id = window.setInterval(() => {
      const s = st.current;
      if (s.completo || s.stacco !== null) return;
      const lung = parti[s.pezzo].length;
      s.car = Math.min(lung, s.car + cps * PASSO / 1000);
      const ultimo = s.pezzo === parti.length - 1;
      if (ultimo && opz.current.interrotta && !s.interrotta && s.car >= lung * 0.5) {
        s.interrotta = true;
        opz.current.onInterrotta?.();
        return;
      }
      if (s.car >= lung) { if (ultimo) s.completo = true; else iniziaStacco(); }
      ridisegna(x => x + 1);
    }, PASSO);
    return () => { window.clearInterval(id); window.clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chiave]);

  const s = st.current;
  const visibile = [...parti.slice(0, s.pezzo), parti[s.pezzo]?.slice(0, Math.floor(s.car)) ?? ''].filter(Boolean).join(' ');
  const conStacchi = parti.length > 1;
  return {
    visibile: s.completo ? parti.join(' ') : visibile,
    completo: s.completo,
    ascolta: s.completo ? null : s.ascolta,
    /** Uno stacco in corso, che aspetta il tocco. */
    inStacco: !s.completo && s.stacco !== null,
    tocca: (): boolean => {
      const x = st.current;
      if (x.completo) return false;
      if (x.stacco !== null) {
        const mancano = STACCO_MINIMO - (performance.now() - x.stacco);
        if (mancano <= 0) prossimoPezzo();
        else if (!x.inAttesa) { x.inAttesa = true; timer.current = window.setTimeout(prossimoPezzo, mancano); }
        return true;
      }
      if (conStacchi) {
        x.car = parti[x.pezzo].length;
        if (x.pezzo === parti.length - 1) x.completo = true; else iniziaStacco();
      } else x.completo = true;
      ridisegna(n => n + 1);
      return true;
    },
  };
}
