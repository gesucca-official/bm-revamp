// CA-0a, Fase E e F: il ritratto di chi parla, animato senza un asset per fotogramma. Il cast dice per personaggio ed espressione se si
// piega (maglia) o si muove intero (movimento); l'interruttore può forzare tutti fermi, tutti a movimento o tutti a maglia. Con la
// preferenza di movimento ridotto del sistema resta tutto fermo, bocca compresa. Fase F: se c'è la versione «-bocca» del ritratto, mentre
// il testo scorre la bocca si apre e si chiude (solo la zona della bocca, presa con una maschera).
import {useEffect, useRef, useState} from 'react';
import {boccaAltra, modo as modoDi, movimento, trasformazione, zonaBocca, FERMA, type Livello} from '../animazione.ts';
import {cast} from './dati.ts';
import {componiBocca, differenza, Maglia} from './maglia.ts';

const LARGHEZZA_SU_ALTEZZA = 1024 / 1536;

export function useMovimentoRidotto(): boolean {
  const [r, setR] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    const f = () => setR(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return r;
}

const carica = (src: string) => { const i = new Image(); i.src = src; return i.decode().then(() => i); };

type Props = {src: string; srcBocca: string | null; alt: string; chi: string; espressione?: string; ascolta: boolean;
  /** Il personaggio in quadro sta parlando e il testo scrive. */ parlando: boolean; ultimo?: string; parole: number;
  livello: Livello; altezza: number; alza: number};

export function Ritratto({src, srcBocca, alt, chi, espressione, ascolta, parlando, ultimo, parole, livello, altezza, alza}: Props) {
  const ridotto = useMovimentoRidotto();
  const p = cast.personaggi[chi];
  const modo = modoDi(livello, p?.animazione, espressione, ridotto);
  const controlli = modo === 'maglia' ? p?.animazione?.maglia ?? null : null;
  const scatola = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const ingresso = useRef(performance.now());
  const parola = useRef<number | null>(null);
  const ultimeParole = useRef(parole);
  const maglia = useRef<Maglia | null>(null);
  const [pronta, setPronta] = useState<string | null>(null);  // il src per cui la tela è pronta
  const [conBocca, setConBocca] = useState(false);
  const stato = useRef({parlando, ultimo});
  stato.current = {parlando, ultimo};

  // Cambio di immagine (chi parla, espressione, stacco su chi ascolta): rimbalzo d'ingresso.
  useEffect(() => { ingresso.current = performance.now(); }, [src]);
  // Una parola in più mentre il testo scorre: sobbalzo (movimento) o cenno (maglia).
  useEffect(() => {
    if (parole > ultimeParole.current) parola.current = performance.now();
    ultimeParole.current = parole;
  }, [parole]);

  // La tela si prepara dalle immagini: il ritratto e, se c'è, la versione con la bocca limitata alla zona della bocca.
  useEffect(() => {
    if (modo === 'fermo' || !tela.current) return;
    const t = tela.current;
    let vivo = true;
    Promise.all([carica(src), srcBocca ? carica(srcBocca).catch(() => null) : Promise.resolve(null)]).then(([base, bocca]) => {
      if (!vivo) return;
      let altra: HTMLCanvasElement | null = null;
      if (bocca && p?.bocca) {
        const z = zonaBocca(differenza(base, bocca), 128, 192, p.bocca);
        if (z) altra = componiBocca(base, bocca, z);
      }
      maglia.current ??= Maglia.crea(t);
      maglia.current?.imposta(base, altra);
      setConBocca(!!altra);
      setPronta(maglia.current ? src : null);
    }).catch(() => { /* resta l'immagine */ });
    return () => { vivo = false; };
  }, [modo, src, srcBocca, p]);
  // La tela se ne va con il modo fermo: si libera il suo contesto.
  useEffect(() => { if (modo === 'fermo') { maglia.current?.chiudi(); maglia.current = null; setPronta(null); } }, [modo]);
  useEffect(() => () => { maglia.current?.chiudi(); maglia.current = null; }, []);

  const base = `translateX(-50%) translateY(${(-alza).toFixed(1)}px)`;
  useEffect(() => {
    const el = scatola.current;
    if (!el) return;
    if (modo === 'fermo') { el.style.transform = trasformazione(FERMA, altezza, base); return; }
    let id = 0;
    const passo = () => {
      const ora = performance.now(), t = ora / 1000;
      const {parlando: parla, ultimo: u} = stato.current;
      const daParola = parla && parola.current !== null ? (ora - parola.current) / 1000 : null;
      const daIngresso = (ora - ingresso.current) / 1000;
      if (maglia.current && pronta === src) maglia.current.disegna(t, parla, daParola, controlli, boccaAltra(t, parla, u));
      // Con la maglia l'immagine intera fa solo l'ingresso; con il movimento fa tutto (chi ascolta non fa il movimento dell'espressione).
      const posa = modo === 'maglia' ? movimento(undefined, 0, null, daIngresso) : movimento(ascolta ? undefined : espressione, t, daParola, daIngresso);
      el.style.transform = trasformazione(posa, altezza, base);
      id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [modo, controlli, pronta, src, espressione, ascolta, altezza, base]);

  const dpr = Math.min(window.devicePixelRatio || 1, 2), w = altezza * LARGHEZZA_SU_ALTEZZA;
  const suTela = modo !== 'fermo' && pronta === src;
  return (
    <div ref={scatola} className={`ritratto${ascolta ? ' ascolta' : ''}`} style={{width: w, height: altezza}} data-testid="ritratto"
      data-modo={modo} data-bocca={conBocca && suTela ? 'si' : 'no'} role="img" aria-label={alt}>
      <img src={src} alt="" style={{visibility: suTela ? 'hidden' : 'visible'}} />
      {modo !== 'fermo' && <canvas ref={tela} data-testid="ritratto-tela" width={Math.round(w * dpr)} height={Math.round(altezza * dpr)}
        style={{visibility: suTela ? 'visible' : 'hidden'}} />}
    </div>
  );
}
