import { motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useAsked, useReducedMotion, useView, type View } from './useView';

// Título del hero: las palabras llegan desordenadas (giradas, corridas y
// borrosas, como las letras del título de Encuadre) y se arman con un resorte.
// Al aterrizar, cada una pasa de delgada a gruesa.
type Props = { titles: Record<View, string> };

function scatter(seed: number) {
  // Pseudoaleatorio estable: el mismo desorden en cada visita.
  const r = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  return { x: (r(1) - 0.5) * 220, y: 40 + (r(2) - 0.5) * 160, rotate: (r(3) - 0.5) * 44, scale: 0.7 + r(4) * 0.5 };
}

export default function HeroTitle({ titles }: Props) {
  const view = useView();
  const reduce = useReducedMotion();
  const asked = useAsked();
  const [landed, setLanded] = useState<number[]>([]);
  const words = useMemo(() => titles[view].split(' '), [titles, view]);
  useEffect(() => { setLanded([]); }, [view]);

  return (
    <h1 className="hero__title" aria-label={titles[view]}>
      {words.map((w, i) => {
        const s = scatter(i + (view === 'est' ? 20 : 0));
        const scattered = { opacity: 0, x: s.x, y: s.y, rotate: s.rotate, scale: s.scale, filter: 'blur(10px)' };
        return (
          <span className="word" aria-hidden="true" key={`${view}-${i}`}>
            <span className="word__ghost">{w}</span>
            <motion.span
              className={`word__ink${landed.includes(i) || reduce ? ' on' : ''}`}
              initial={reduce ? false : scattered}
              animate={asked || reduce ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' } : scattered}
              transition={{ type: 'spring', stiffness: 140, damping: 15, mass: 0.9, delay: 0.15 + i * 0.09 }}
              onAnimationComplete={() => { if (asked) setLanded(l => (l.includes(i) ? l : [...l, i])); }}
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}
