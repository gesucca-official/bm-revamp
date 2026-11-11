// Orizzontale o verticale, come le composizioni di prova (specifica-asset.md): decide la disposizione della mappa.
import {useEffect, useState} from 'react';

const QUERY = '(orientation: portrait)';
export function useVerticale(): boolean {
  const [v, setV] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const m = window.matchMedia(QUERY);
    const f = () => setV(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return v;
}
