// Interacción del landing: vista inst/estudiantes, título que se enciende,
// el día que avanza, recorrido con el teléfono fijo, roles, pasos y copiar.
const root = document.documentElement;
root.classList.add('js');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
type View = 'inst' | 'est';

// ---------- Vistas ----------
// La elección se recuerda en este navegador: la primera visita pregunta y
// el switch del hero (o "Cambiar de perfil" del pie) la cambia después.
const PERFIL_KEY = 'hanet.landing.perfil';
function remember(view: View) {
  try { localStorage.setItem(PERFIL_KEY, view); } catch { /* sin almacenamiento */ }
}
function remembered(): string | null {
  try { return localStorage.getItem(PERFIL_KEY); } catch { return null; }
}
function setView(view: View, opts: { top?: boolean } = {}) {
  root.dataset.view = view;
  remember(view);
  document.querySelectorAll<HTMLButtonElement>('.hero .seg__btn').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.pick === view));
  });
  const hash = view === 'est' ? '#estudiantes' : ' ';
  try { history.replaceState(null, '', hash.trim() ? hash : location.pathname + location.search); } catch { /* sin historial */ }
  window.dispatchEvent(new Event('hanet:view'));
  restartSteps();
  if (opts.top) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}
document.querySelectorAll<HTMLButtonElement>('[data-pick]').forEach(b => {
  b.addEventListener('click', () => {
    const view = b.dataset.pick as View;
    if (root.dataset.view !== view || b.hasAttribute('data-top')) setView(view, { top: b.hasAttribute('data-top') });
  });
});
window.addEventListener('hashchange', () => {
  if (location.hash === '#estudiantes' && root.dataset.view !== 'est') setView('est');
});
document.querySelectorAll<HTMLButtonElement>('.hero .seg__btn').forEach(b => {
  b.setAttribute('aria-pressed', String(b.dataset.pick === root.dataset.view));
});

// ---------- Primera visita: ¿quién eres? ----------
const ask = document.querySelector<HTMLDialogElement>('[data-ask]');
function closeAsk() {
  if (!ask?.open) return;
  const done = () => { ask.close(); ask.classList.remove('is-closing'); };
  if (reduce) done();
  else { ask.classList.add('is-closing'); window.setTimeout(done, 140); }
}
function openAsk() {
  if (!ask || ask.open || typeof ask.showModal !== 'function') return false;
  ask.showModal();
  // El foco va a la tarjeta, no a una opción, para que ninguna parezca elegida.
  ask.focus();
  return true;
}
if (ask) {
  ask.addEventListener('close', () => {
    root.classList.remove('asking');
    // Si se cerró sin elegir (Esc), queda la vista que ya estaba y no se vuelve a preguntar.
    if (!remembered()) remember(root.dataset.view as View);
    window.dispatchEvent(new Event('hanet:asked'));
  });
  ask.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(b => {
    b.addEventListener('click', () => {
      const a = b.dataset.answer;
      if (a === 'est' || a === 'inst') {
        if (root.dataset.view !== a) setView(a, { top: true });
        else remember(a);
      } else remember(root.dataset.view as View);
      closeAsk();
    });
  });
  // Tocar fuera de la tarjeta también cierra, como "Solo estoy mirando".
  ask.addEventListener('click', e => { if (e.target === ask) closeAsk(); });
  document.querySelectorAll<HTMLButtonElement>('[data-ask-open]').forEach(b => b.addEventListener('click', () => openAsk()));
  if (root.classList.contains('asking') && !openAsk()) root.classList.remove('asking');
}

// ---------- El día que avanza ----------
const rows = document.querySelector<HTMLElement>('[data-rows]');
if (rows) {
  const items = Array.from(rows.children) as HTMLElement[];
  const day = items.map(li => ({
    t: li.querySelector('.day__time')?.textContent ?? '',
    s: li.querySelector('.day__subject')?.textContent ?? '',
    pause: li.classList.contains('day__row--pause'),
  }));
  const ends = ['08:45', '09:30', '09:45', '10:30', '11:15', '11:30', '12:15', '13:00', '13:45', '14:30'];
  const wheres = ['2° Medio K · Sala 14', '2° Medio K · Sala 14', '15 minutos', '2° Medio K · Sala 14', 'Laboratorio de ciencias', '15 minutos', '2° Medio K · Sala 14', '2° Medio K · Sala 14', '45 minutos', 'Gimnasio'];
  const $ = (k: string) => document.querySelector<HTMLElement>(`[data-now-${k}]`);
  let cur = 3;
  let prog = 30;
  const paint = () => {
    items.forEach((li, i) => {
      const d = i - cur;
      li.classList.remove('is-past', 'is-now', 'is-next1', 'is-next2', 'is-next3', 'is-next4');
      li.classList.add(d < 0 ? 'is-past' : d === 0 ? 'is-now' : `is-next${Math.min(d, 4)}`);
    });
    rows.style.setProperty('--y', `${-Math.max(0, cur - 2) * 60 + Math.max(0, 2 - cur) * 60}px`);
    $('label')!.textContent = day[cur].pause ? 'Ahora · pausa' : 'Ahora en clases';
    $('subject')!.textContent = day[cur].s;
    $('where')!.textContent = wheres[cur];
    $('start')!.textContent = day[cur].t;
    $('end')!.textContent = ends[cur];
  };
  const bar = $('bar')!;
  paint();
  bar.style.width = `${prog}%`;
  if (!reduce) {
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(rows);
    window.setInterval(() => {
      if (!visible || document.hidden) return;
      prog += 1.4;
      if (prog >= 100) { prog = 0; cur = (cur + 1) % day.length; paint(); }
      bar.style.width = `${prog}%`;
    }, 90);
  }
}

// ---------- Recorrido: el paso del centro de la pantalla elige la pantalla del teléfono ----------
const tourPhone = document.querySelector<HTMLElement>('.phone--tour');
const steps = Array.from(document.querySelectorAll<HTMLElement>('.step'));
const dots = Array.from(document.querySelectorAll<HTMLElement>('[data-dot]'));
let notasTimer = 0;
function uncover(phone: HTMLElement) {
  window.clearTimeout(notasTimer);
  phone.classList.remove('uncovered');
  notasTimer = window.setTimeout(() => phone.classList.add('uncovered'), reduce ? 0 : 1600);
}
function activate(i: number) {
  steps.forEach((s, j) => s.classList.toggle('active', j === i));
  dots.forEach((d, j) => d.classList.toggle('on', j === i));
  const key = steps[i]?.dataset.key;
  if (tourVisible && key) document.body.dataset.theme = key;
  if (tourPhone && key && tourPhone.dataset.screen !== key) {
    tourPhone.dataset.screen = key;
    if (key === 'notas') uncover(tourPhone);
  }
}
let tourVisible = false;
const tour = document.querySelector<HTMLElement>('[data-tour]');
if (tour) {
  // Cada módulo se adueña de la pantalla con su color mientras se ve el recorrido.
  new IntersectionObserver(([e]) => {
    tourVisible = e.isIntersecting;
    if (!tourVisible) delete document.body.dataset.theme;
    else {
      const active = steps.find(st => st.classList.contains('active'));
      if (active?.dataset.key) document.body.dataset.theme = active.dataset.key;
    }
  }, { rootMargin: '-35% 0px -35% 0px' }).observe(tour);
}
if (steps.length) {
  activate(0);
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) activate(steps.indexOf(e.target as HTMLElement)); });
  }, { rootMargin: '-45% 0px -45% 0px' });
  steps.forEach(s => io.observe(s));
  steps.forEach((s, i) => s.addEventListener('click', () => activate(i)));
}
// En el celular cada paso tiene su teléfono: la nota se destapa al verla.
document.querySelectorAll<HTMLElement>('.phone--step[data-screen="notas"]').forEach(p => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) window.setTimeout(() => p.classList.add('uncovered'), reduce ? 0 : 1600);
  }, { threshold: 0.6 }).observe(p);
});

// ---------- Roles ----------
const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-role]'));
function pickRole(i: number, focus = false) {
  tabs.forEach((t, j) => {
    const on = j === i;
    t.setAttribute('aria-selected', String(on));
    t.tabIndex = on ? 0 : -1;
    const panel = document.getElementById(t.getAttribute('aria-controls')!);
    if (panel) panel.hidden = !on;
  });
  if (focus) tabs[i].focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => pickRole(i));
  t.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') pickRole((i + 1) % tabs.length, true);
    if (e.key === 'ArrowLeft') pickRole((i - 1 + tabs.length) % tabs.length, true);
  });
});

// ---------- Pasos que se van marcando ----------
let stepTimer = 0;
function restartSteps() {
  window.clearInterval(stepTimer);
  const view = root.dataset.view as View;
  const list = document.querySelector<HTMLElement>(`.start[data-aud="${view}"] [data-steps]`);
  if (!list) return;
  const lis = Array.from(list.children) as HTMLElement[];
  if (reduce) { lis.forEach(li => li.classList.add('done')); return; }
  let n = 0;
  const tick = () => { lis.forEach((li, i) => li.classList.toggle('done', i < n)); n = (n + 1) % (lis.length + 1); };
  tick();
  stepTimer = window.setInterval(tick, 1600);
}
restartSteps();

// ---------- Copiar correo o link ----------
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(b => {
  const label = b.textContent;
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy!);
      b.textContent = b.dataset.done ?? label;
      window.setTimeout(() => { b.textContent = label; }, 2400);
    } catch { /* sin permiso para el portapapeles */ }
  });
});

// ---------- Carrusel de módulos en el celular ----------
const carousel = document.querySelector<HTMLElement>('[data-carousel]');
const mdots = Array.from(document.querySelectorAll<HTMLElement>('[data-mdot]'));
const narrow = window.matchMedia('(max-width: 859px)');
if (carousel) {
  const onScroll = () => {
    if (!narrow.matches) return;
    const center = carousel.scrollLeft + carousel.clientWidth / 2;
    let best = 0;
    let dist = Infinity;
    steps.forEach((st, i) => {
      const d = Math.abs(st.offsetLeft + st.offsetWidth / 2 - center);
      if (d < dist) { dist = d; best = i; }
    });
    mdots.forEach((d, j) => d.classList.toggle('on', j === best));
    if (tourVisible) {
      const key = steps[best]?.dataset.key;
      if (key) document.body.dataset.theme = key;
      const p = steps[best]?.querySelector<HTMLElement>('.phone[data-screen="notas"]');
      if (p) window.setTimeout(() => p.classList.add('uncovered'), reduce ? 0 : 1200);
    }
  };
  carousel.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  // Con mouse también se arrastra.
  let down: { x: number; left: number } | null = null;
  carousel.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || !narrow.matches) return;
    down = { x: e.clientX, left: carousel.scrollLeft };
    carousel.classList.add('dragging');
  });
  window.addEventListener('pointermove', e => { if (down) carousel.scrollLeft = down.left - (e.clientX - down.x); });
  window.addEventListener('pointerup', () => { down = null; carousel.classList.remove('dragging'); });
}

// ---------- Teléfono que se inclina con el mouse ----------
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const tilt = document.querySelector<HTMLElement>('[data-tilt]');
if (tilt && fine && !reduce) {
  const zone = tilt.closest<HTMLElement>('.tour') ?? tilt;
  zone.addEventListener('pointermove', e => {
    const r = tilt.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
    const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
    tilt.style.setProperty('--ry', `${Math.max(-1, Math.min(1, dx * 2)) * 10}deg`);
    tilt.style.setProperty('--rx', `${Math.max(-1, Math.min(1, -dy * 2)) * 8}deg`);
  });
  zone.addEventListener('pointerleave', () => { tilt.style.setProperty('--ry', '0deg'); tilt.style.setProperty('--rx', '0deg'); });
}

// ---------- Botones imán ----------
if (fine && !reduce) {
  document.querySelectorAll<HTMLElement>('.btn--pink, .btn--light, .mail__copy').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

// ---------- Aparecer al hacer scroll (el "antes" se tacha solo) ----------
const reveal = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } });
}, { rootMargin: '0px 0px -12% 0px' });
document.querySelectorAll('.swap, .kicker, .h2, .role__grid li, .steps li, .releases__list li, .cta__list li').forEach(el => {
  el.classList.add('reveal');
  reveal.observe(el);
});
