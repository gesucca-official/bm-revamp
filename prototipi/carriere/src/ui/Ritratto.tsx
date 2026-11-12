// CA-0a, Fasi E–H: il ritratto di chi parla, animato senza un asset per fotogramma. Il cast dice per personaggio ed espressione se si
// piega (maglia) o si muove intero (movimento); l'interruttore può forzare tutti fermi, tutti a movimento o tutti a maglia. Con la
// preferenza di movimento ridotto del sistema resta tutto fermo, bocca ed entrate comprese. Fase F: se c'è la versione «-bocca» del
// ritratto, mentre il testo scorre la bocca si apre e si chiude (solo la zona della bocca, presa con una maschera).
// Fase H (banco della fluidità): niente fotogrammi vuoti né lampeggi. La tela, una volta pronta, non si nasconde più: al cambio di
// espressione si continua a disegnare l'immagine di prima finché la nuova non è pronta, poi una dissolvenza breve. L'immagine di riserva
// (senza WebGL o con i ritratti fermi) mostra solo immagini già decodificate. Le immagini composte (bocca, sagoma) si calcolano una volta
// per espressione e restano in memoria. Il personaggio entra in scena quando il suo ritratto è pronto, nel modo voluto dalla scena.
import {useEffect, useRef, useState} from 'react';
import {boccaAllineata, boccaAltra, comparsa, IN_SCENA, modo as modoDi, movimento, trasformazione, zonaBocca, FERMA, type Comparsa, type Entrata,
  type Livello} from '../animazione.ts';
import {cast} from './dati.ts';
import {componiBocca, conAlfaDi, controllaComposta, differenza, Maglia, type Sorgente} from './maglia.ts';

const LARGHEZZA_SU_ALTEZZA = 1024 / 1536;
/** ?testa=larga: la piega della testa con le ampiezze di prima della Fase I, per confrontare. */
const TESTA_LARGA = new URLSearchParams(window.location.search).get('testa') === 'larga';

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

let webgl: boolean | null = null;
const conWebGL = (): boolean => {
  if (webgl === null) { try { webgl = !!document.createElement('canvas').getContext('webgl'); } catch { webgl = false; } }
  return webgl;
};

/** Le immagini pronte per la tela, una volta per espressione: il ritratto (con la sagoma, se serve) e la versione con la bocca. */
type Pronte = {base: Sorgente; altra: HTMLCanvasElement | null};
const pronte = new Map<string, Promise<Pronte>>();
export function preparaRitratto(chi: string, src: string, srcBocca: string | null, srcAlfa: string | null): Promise<Pronte> {
  const chiave = `${src}|${srcBocca}|${srcAlfa}`;
  if (!pronte.has(chiave)) {
    pronte.set(chiave, Promise.all([carica(src), srcBocca ? carica(srcBocca).catch(() => null) : null, srcAlfa ? carica(srcAlfa).catch(() => null) : null])
      .then(([img, bocca, sagoma]) => {
        const p = cast.personaggi[chi];
        const base = sagoma ? conAlfaDi(img, sagoma) : img;
        let altra: HTMLCanvasElement | null = null, zona = null;
        if (bocca && p?.bocca) {
          const diff = differenza(base, bocca);
          zona = boccaAllineata(diff, 128, 192, p.bocca) ? zonaBocca(diff, 128, 192, p.bocca) : null;
          if (zona) altra = componiBocca(base, bocca, zona);
        }
        // Con il banco della fluidità acceso, il controllo delle immagini composte (bordo, zona della bocca, pixel scuri).
        const banco = (window as unknown as {__bancoControlli?: unknown[]}).__bancoControlli;
        if (banco) {
          const nome = src.split('/').pop()!.replace(/\?.*$/, '');
          if (sagoma) banco.push({immagine: nome, cosa: 'sagoma', ...controllaComposta(sagoma, base)});
          if (altra && zona) banco.push({immagine: nome, cosa: 'bocca', ...controllaComposta(base, altra, zona)});
        }
        return {base, altra};
      }));
  }
  return pronte.get(chiave)!;
}

const maschera = (srcAlfa?: string | null) =>
  srcAlfa ? {maskImage: `url(${srcAlfa})`, WebkitMaskImage: `url(${srcAlfa})`, maskSize: '100% 100%', WebkitMaskSize: '100% 100%'} : {};
const stile = (c: Comparsa, ascolta: boolean) => ({
  opacity: c.opacita.toFixed(3),
  filter: [c.sfoca > 0.05 ? `blur(${c.sfoca.toFixed(2)}px)` : '', ascolta ? 'brightness(0.92)' : ''].filter(Boolean).join(' '),
});

type Props = {src: string; srcBocca: string | null; /** la sagoma da cui prendere la trasparenza, se il cast la indica */ srcAlfa?: string | null; alt: string; chi: string; espressione?: string; ascolta: boolean;
  /** Il personaggio in quadro sta parlando e il testo scrive. */ parlando: boolean; ultimo?: string; parole: number;
  livello: Livello; altezza: number; alza: number;
  /** Fase H: come entra in scena (alla prima immagine pronta). */ entrata: Entrata};

export function Ritratto({src, srcBocca, srcAlfa, alt, chi, espressione, ascolta, parlando, ultimo, parole, livello, altezza, alza, entrata}: Props) {
  const ridotto = useMovimentoRidotto();
  const p = cast.personaggi[chi];
  const modo = modoDi(livello, p?.animazione, espressione, ridotto);
  const controlli = modo === 'maglia' ? p?.animazione?.maglia ?? null : null;
  // Fase I: il tempo delle sue animazioni (Piera molto più lenta); le dissolvenze degli stacchi restano brevi.
  const f = p?.tempoAnimazioni ?? 1;
  const scatola = useRef<HTMLDivElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const ingresso = useRef(performance.now());
  const parola = useRef<number | null>(null);
  const ultimeParole = useRef(parole);
  const maglia = useRef<Maglia | null>(null);
  const [suTela, setSuTela] = useState(false);                    // la tela ha un'immagine: da qui in poi resta visibile
  const [mostrata, setMostrata] = useState<string | null>(null);  // l'immagine di riserva, solo quando è già decodificata
  const [conBocca, setConBocca] = useState(false);
  const [inScena, setInScena] = useState<number | null>(null);    // quando è cominciata l'entrata
  const stato = useRef({parlando, ultimo});
  stato.current = {parlando, ultimo};

  // Cambio d'espressione o stacco: un piccolo rimbalzo (dopo l'entrata).
  useEffect(() => { ingresso.current = performance.now(); }, [src]);
  // Una parola in più mentre il testo scorre: sobbalzo (movimento) o cenno (maglia).
  useEffect(() => {
    if (parole > ultimeParole.current) parola.current = performance.now();
    ultimeParole.current = parole;
  }, [parole]);

  // L'immagine di riserva: si cambia solo a decodifica fatta, così non resta mai un fotogramma vuoto.
  useEffect(() => {
    let vivo = true;
    carica(src).then(() => { if (vivo) setMostrata(src); }).catch(() => { if (vivo) setMostrata(src); });
    return () => { vivo = false; };
  }, [src]);

  // La tela: si prepara dalle immagini pronte; fino ad allora disegna quelle di prima.
  useEffect(() => {
    if (modo === 'fermo' || !tela.current) return;
    const t = tela.current;
    let vivo = true;
    preparaRitratto(chi, src, srcBocca, srcAlfa ?? null).then(({base, altra}) => {
      if (!vivo) return;
      maglia.current ??= Maglia.crea(t);
      if (!maglia.current) return;
      maglia.current.imposta(base, altra);
      maglia.current.disegna(performance.now() / 1000, false, null, controlli, false);
      setConBocca(!!altra);
      setSuTela(true);
    }).catch(() => { /* resta l'immagine */ });
    return () => { vivo = false; };
  }, [modo, chi, src, srcBocca, srcAlfa, controlli]);
  // La tela se ne va con il modo fermo: si libera il suo contesto.
  useEffect(() => { if (modo === 'fermo') { maglia.current?.chiudi(); maglia.current = null; setSuTela(false); } }, [modo]);
  useEffect(() => () => { maglia.current?.chiudi(); maglia.current = null; }, []);

  // L'entrata comincia quando c'è qualcosa da far vedere: la tela, o l'immagine decodificata se si resta all'immagine.
  const pronto = modo === 'fermo' || !conWebGL() ? mostrata !== null : suTela;
  useEffect(() => { if (pronto && inScena === null) setInScena(performance.now()); }, [pronto, inScena]);

  const base = `translateX(-50%) translateY(${(-alza).toFixed(1)}px)`;
  const larghezza = altezza * LARGHEZZA_SU_ALTEZZA;
  useEffect(() => {
    const el = scatola.current;
    if (!el) return;
    const applica = (c: Comparsa, posa = FERMA) => {
      el.style.transform = trasformazione(posa, altezza, `${base} translate(${(c.dx * larghezza).toFixed(1)}px, ${(c.dy * altezza).toFixed(1)}px) scale(${c.scala.toFixed(4)})`);
      Object.assign(el.style, stile(c, ascolta));
    };
    if (ridotto) { applica(inScena === null ? {...IN_SCENA, opacita: 0} : IN_SCENA); el.dataset.entrata = 'no'; return; }
    let id = 0;
    const passo = () => {
      const ora = performance.now(), t = (ora / 1000) * f;
      const {parlando: parla, ultimo: u} = stato.current;
      const daParola = parla && parola.current !== null ? ((ora - parola.current) / 1000) * f : null;
      const c = inScena === null ? {...IN_SCENA, opacita: 0} : comparsa(entrata, 'entra', ((ora - inScena) / 1000) * (entrata === 'stacco' ? 1 : f));
      el.dataset.entrata = inScena === null || c !== IN_SCENA ? 'si' : 'no';  // anche mentre aspetta di entrare
      if (modo === 'fermo') { applica(c); id = requestAnimationFrame(passo); return; }
      if (maglia.current && suTela) maglia.current.disegna(t, parla, daParola, controlli, boccaAltra(t, parla, u), ora, TESTA_LARGA);
      // Il rimbalzo per il cambio d'espressione solo dopo l'entrata; con la maglia l'immagine intera fa solo quello.
      const daIngresso = inScena !== null && ingresso.current > inScena + 50 ? ((ora - ingresso.current) / 1000) * f : 1000;
      const posa = modo === 'maglia' ? movimento(undefined, 0, null, daIngresso) : movimento(ascolta ? undefined : espressione, t, daParola, daIngresso);
      applica(c, posa);
      id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [modo, controlli, espressione, ascolta, altezza, base, larghezza, ridotto, entrata, inScena, suTela, f]);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const conImmagine = modo === 'fermo' || !suTela;
  return (
    <div ref={scatola} className={`ritratto${ascolta ? ' ascolta' : ''}`} style={{width: larghezza, height: altezza, opacity: 0}} data-testid="ritratto"
      data-modo={modo} data-bocca={conBocca && suTela ? 'si' : 'no'} data-src={src.split('/').pop()} role="img" aria-label={alt}>
      {mostrata && <img src={mostrata} alt="" style={{visibility: conImmagine ? 'visible' : 'hidden', ...maschera(srcAlfa)}} />}
      {modo !== 'fermo' && <canvas ref={tela} data-testid="ritratto-tela" width={Math.round(larghezza * dpr)} height={Math.round(altezza * dpr)}
        style={{visibility: suTela ? 'visible' : 'hidden'}} />}
    </div>
  );
}

/**
 * Chi esce di scena: l'ultima immagine del ritratto, che se ne va nel modo voluto (di lato, lontano, dissolta). Un'immagine semplice,
 * senza tela: dura meno di un secondo. Con il movimento ridotto non c'è.
 */
export function Uscente({src, srcAlfa, altezza, alza, modo, ascolta, tempo = 1}: {src: string; srcAlfa?: string | null; altezza: number; alza: number; modo: Entrata; ascolta: boolean;
  /** Fase I: il tempo delle animazioni del personaggio (Piera esce lentissima); lo stacco resta breve. */ tempo?: number}) {
  const el = useRef<HTMLDivElement>(null);
  const larghezza = altezza * LARGHEZZA_SU_ALTEZZA;
  useEffect(() => {
    const e = el.current;
    if (!e) return;
    const t0 = performance.now();
    let id = 0;
    const passo = () => {
      const c = comparsa(modo, 'esce', ((performance.now() - t0) / 1000) * (modo === 'stacco' ? 1 : tempo));
      e.style.transform = `translateX(-50%) translateY(${(-alza).toFixed(1)}px) translate(${(c.dx * larghezza).toFixed(1)}px, ${(c.dy * altezza).toFixed(1)}px) scale(${c.scala.toFixed(4)})`;
      Object.assign(e.style, stile(c, ascolta));
      if (c.opacita > 0) id = requestAnimationFrame(passo);
    };
    id = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(id);
  }, [modo, alza, altezza, larghezza, ascolta, tempo]);
  return (
    <div ref={el} className="ritratto uscente" style={{width: larghezza, height: altezza, transform: `translateX(-50%) translateY(${(-alza).toFixed(1)}px)`}}
      data-testid="ritratto-uscente" data-uscita="si" data-src={src.split('/').pop()} aria-hidden="true">
      <img src={src} alt="" style={maschera(srcAlfa)} />
    </div>
  );
}
