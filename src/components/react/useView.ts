import { useEffect, useState } from 'react';

export type View = 'inst' | 'est';

// La vista (inst o estudiantes) vive en <html data-view>; el script del
// landing avisa cada cambio con el evento "hanet:view".
export function useView(): View {
  const [view, setView] = useState<View>('inst');
  useEffect(() => {
    const read = () => setView((document.documentElement.dataset.view as View) || 'inst');
    read();
    window.addEventListener('hanet:view', read);
    return () => window.removeEventListener('hanet:view', read);
  }, []);
  return view;
}

export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

// Mientras la primera visita pregunta quién eres (<html class="asking">), el
// título espera: se arma recién al cerrar la pregunta ("hanet:asked").
export function useAsked(): boolean {
  const [asked, setAsked] = useState(() =>
    typeof document === 'undefined' || !document.documentElement.classList.contains('asking'));
  useEffect(() => {
    const read = () => setAsked(!document.documentElement.classList.contains('asking'));
    read();
    window.addEventListener('hanet:asked', read);
    return () => window.removeEventListener('hanet:asked', read);
  }, []);
  return asked;
}
