// Il testo che scorre, a pezzi con gli stacchi su chi ascolta (la regia delle frasi di Piera) e con le interruzioni.
import {useEffect, useRef, useState} from 'react';

export const CARATTERI_AL_SECONDO = 45;   // velocità 1; il cast la moltiplica per personaggio (Piera 0.3)
export const DURATA_STACCO = 900;          // ms su chi ascolta, fra un pezzo e l'altro
const PASSO = 33;

export type Ascolto = {chi: string; espressione: string};
type Opzioni = {velocita: number; stacchi?: Ascolto[]; interrotta?: boolean; onInterrotta?: () => void};

/** I pezzi si dividono dopo i puntini di sospensione, solo se la battuta ha degli stacchi. */
export const pezzi = (testo: string, conStacchi: boolean) => conStacchi ? testo.split(/(?<=\.\.\.)\s+/).filter(Boolean) : [testo];

export function useTesto(chiave: string, testo: string, o: Opzioni) {
  const parti = pezzi(testo, !!o.stacchi?.length);
  const [, ridisegna] = useState(0);
  const st = useRef({pezzo: 0, car: 0, pausa: false, ascolta: null as Ascolto | null, interrotta: false, completo: false});
  const timer = useRef<number | undefined>(undefined);
  const opz = useRef(o);
  opz.current = o;

  useEffect(() => {
    st.current = {pezzo: 0, car: 0, pausa: false, ascolta: null, interrotta: false, completo: !testo};
    ridisegna(x => x + 1);
    const cps = CARATTERI_AL_SECONDO * (opz.current.velocita || 1);
    const id = window.setInterval(() => {
      const s = st.current;
      if (s.completo || s.pausa) return;
      const lung = parti[s.pezzo].length;
      s.car = Math.min(lung, s.car + cps * PASSO / 1000);
      const ultimo = s.pezzo === parti.length - 1;
      if (ultimo && opz.current.interrotta && !s.interrotta && s.car >= lung * 0.5) {
        s.interrotta = true;
        opz.current.onInterrotta?.();
        return;
      }
      if (s.car >= lung) {
        if (ultimo) s.completo = true;
        else {
          const st2 = opz.current.stacchi ?? [];
          s.pausa = true;
          s.ascolta = st2.length ? st2[s.pezzo % st2.length] : null;
          timer.current = window.setTimeout(() => { s.pezzo++; s.car = 0; s.pausa = false; s.ascolta = null; ridisegna(x => x + 1); }, DURATA_STACCO);
        }
      }
      ridisegna(x => x + 1);
    }, PASSO);
    return () => { window.clearInterval(id); window.clearTimeout(timer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chiave]);

  const s = st.current;
  const visibile = [...parti.slice(0, s.pezzo), parti[s.pezzo]?.slice(0, Math.floor(s.car)) ?? ''].filter(Boolean).join(' ');
  return {
    visibile: s.completo ? parti.join(' ') : visibile,
    completo: s.completo,
    ascolta: s.completo ? null : s.ascolta,
    completa: () => { window.clearTimeout(timer.current); Object.assign(st.current, {completo: true, pausa: false, ascolta: null}); ridisegna(x => x + 1); },
  };
}
