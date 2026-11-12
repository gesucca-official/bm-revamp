// CA-0a, Fase E: il ritratto di chi parla, animato senza un asset per fotogramma. Tre livelli (interruttore nell'elenco e nella scena):
// fermo; movimento procedurale sull'immagine intera; maglia, cioè l'immagine piegata con WebGL (solo Spazienzio, gli altri restano al
// movimento). Con la preferenza di movimento ridotto del sistema resta tutto fermo.
import {useEffect, useRef, useState} from 'react';
import {FERMA, movimento, trasformazione, type Livello} from '../animazione.ts';
import {Maglia} from './maglia.ts';

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

type Props = {src: string; alt: string; chi: string; espressione?: string; ascolta: boolean; parlando: boolean; parole: number;
  livello: Livello; altezza: number};

export function Ritratto({src, alt, chi, espressione, ascolta, parlando, parole, livello, altezza}: Props) {
  const ridotto = useMovimentoRidotto();
  const efficace: Livello = ridotto ? 'fermo' : livello;
  const conMaglia = efficace === 'maglia' && chi === 'spazienzio';
  const rif = useRef<HTMLImageElement | HTMLCanvasElement | null>(null);
  const ingresso = useRef(performance.now());
  const parola = useRef<number | null>(null);
  const ultimeParole = useRef(parole);
  const maglia = useRef<Maglia | null>(null);
  const [magliaPronta, setMagliaPronta] = useState(false);

  // Cambio di immagine (chi parla, espressione, stacco su chi ascolta): rimbalzo d'ingresso.
  useEffect(() => { ingresso.current = performance.now(); }, [src]);
  // Una parola in più mentre il testo scorre: sobbalzo.
  useEffect(() => {
    if (parole > ultimeParole.current) parola.current = performance.now();
    ultimeParole.current = parole;
  }, [parole]);

  // La maglia si prepara dall'immagine; se WebGL non c'è si resta al movimento.
  useEffect(() => {
    maglia.current = null; setMagliaPronta(false);
    if (!conMaglia || !(rif.current instanceof HTMLCanvasElement)) return;
    const tela = rif.current;
    const img = new Image();
    img.src = src;
    let vivo = true;
    img.decode().then(() => { if (vivo) { maglia.current = Maglia.crea(tela, img); setMagliaPronta(!!maglia.current); } }).catch(() => { /* resta ferma */ });
    return () => { vivo = false; };
  }, [conMaglia, src]);

  useEffect(() => {
    const el = rif.current;
    if (!el) return;
    if (efficace === 'fermo') { el.style.transform = trasformazione(FERMA, altezza, 'translateX(-50%)'); return; }
    let id = 0;
    const passo = () => {
      const ora = performance.now(), t = ora / 1000;
      const daParola = parlando && parola.current !== null ? (ora - parola.current) / 1000 : null;
      const daIngresso = (ora - ingresso.current) / 1000;
      if (conMaglia && maglia.current) {
        maglia.current.disegna(t, parlando, daParola);
        // La maglia fa respiro, cenni e inclinazione; sull'immagine intera resta solo il rimbalzo d'ingresso.
        el.style.transform = trasformazione(movimento(undefined, 0, null, daIngresso), altezza, 'translateX(-50%)');
      } else {
        el.style.transform = trasformazione(movimento(ascolta ? undefined : espressione, t, daParola, daIngresso), altezza, 'translateX(-50%)');
      }
      id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [efficace, conMaglia, magliaPronta, parlando, espressione, ascolta, altezza]);

  const classe = `ritratto${ascolta ? ' ascolta' : ''}`;
  if (conMaglia) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = altezza * LARGHEZZA_SU_ALTEZZA;
    return <canvas ref={x => { rif.current = x; }} className={classe} data-testid="ritratto-maglia" aria-label={alt}
      width={Math.round(w * dpr)} height={Math.round(altezza * dpr)} style={{width: w, height: altezza}} />;
  }
  return <img ref={x => { rif.current = x; }} className={classe} src={src} alt={alt} data-livello={efficace} data-testid="ritratto" />;
}
