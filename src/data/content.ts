// Textos del landing. Las dos vistas: "inst" (la predeterminada) y "est" (estudiantes).
export const APP_URL = 'https://app.hanet.muxp.art';
export const DOCS_URL = 'https://docs.hanet.muxp.art/';
export const PANEL_URL = 'https://panel.hanet.muxp.art';
export const STATUS_URL = 'https://status.hanet.muxp.art';
export const TERMS_URL = 'https://id.hanet.muxp.art/terminos';
export const GITHUB_URL = 'https://github.com/HaNet-Chile/hanetcl';
export const EMAIL = 'muxp@muxp.art';
export const SITE_URL = 'https://hanet.muxp.art';

export type Aud = 'inst' | 'est';

export const AUDS: { id: Aud; name: string }[] = [
  { id: 'inst', name: 'Para instituciones' },
  { id: 'est', name: 'Para estudiantes' },
];

export const TITLES: Record<Aud, string> = {
  inst: 'Toda tu institución, en una sola app.',
  est: 'Tu institución entera, en tu bolsillo.',
};

export const HERO: Record<Aud, { sub: string; main: string; mainHref: string; other: string; otherHref: string }> = {
  inst: {
    sub: 'La app todo en uno más completa hecha en Chile. Horarios, calendarios de curso, material de clases y eventos de tu institución en un mismo lugar. Para estudiantes, docentes y equipos directivos.',
    main: 'Llevar HaNet a mi institución', mainHref: '#instituciones', other: 'Abrir HaNet', otherHref: APP_URL,
  },
  est: {
    sub: 'Tu horario, tus pruebas, tus notas y los eventos de tu institución en un mismo lugar. Sin buscar en diez grupos ni preguntar a última hora.',
    main: 'Abrir HaNet', mainHref: APP_URL, other: '¿Tu institución no tiene HaNet?', otherHref: '#instituciones',
  },
};

export const NAV: Record<Aud, { label: string; href: string }[]> = {
  inst: [{ label: 'Módulos', href: '#modulos' }, { label: 'Cómo empezar', href: '#empezar' }, { label: 'Contacto', href: '#instituciones' }],
  est: [{ label: 'Módulos', href: '#modulos' }, { label: 'Crear cuenta', href: '#empezar' }, { label: 'Contribuir', href: '#novedades' }],
};

export const DAY = [
  { t: '08:00', end: '08:45', s: 'Matemática', where: '2° Medio K · Sala 14' },
  { t: '08:45', end: '09:30', s: 'Matemática', where: '2° Medio K · Sala 14' },
  { t: '09:30', end: '09:45', s: 'Recreo', where: '15 minutos', pause: true },
  { t: '09:45', end: '10:30', s: 'Lenguaje y Literatura', where: '2° Medio K · Sala 14' },
  { t: '10:30', end: '11:15', s: 'Química', where: 'Laboratorio de ciencias', test: true },
  { t: '11:15', end: '11:30', s: 'Recreo', where: '15 minutos', pause: true },
  { t: '11:30', end: '12:15', s: 'Historia, Geografía y Ciencias Sociales', where: '2° Medio K · Sala 14' },
  { t: '12:15', end: '13:00', s: 'Inglés', where: '2° Medio K · Sala 14' },
  { t: '13:00', end: '13:45', s: 'Almuerzo', where: '45 minutos', pause: true },
  { t: '13:45', end: '14:30', s: 'Educación Física y Salud', where: 'Gimnasio' },
];

export const SWAPS: Record<Aud, { before: string; after: string }[]> = {
  inst: [
    { before: 'Foto del horario en el grupo del curso', after: 'Tu horario en HaNet, con la clase que sigue.' },
    { before: 'Prueba que alguien avisó a última hora', after: 'Calendar del curso, con aviso un día antes.' },
    { before: 'La lista en papel en la puerta del evento', after: 'Pasar lista con el QR de HaNet ID.' },
    { before: 'Puntaje de las alianzas desconocido', after: 'Marcador en vivo y para todos.' },
  ],
  est: [
    { before: 'Buscar la foto del horario en el grupo', after: 'Tu horario en HaNet, con la clase que sigue.' },
    { before: 'Enterarte de la prueba el mismo día', after: 'Aviso un día antes y cuatro horas antes.' },
    { before: 'Esperar la nota hasta la próxima clase', after: 'Destápala apenas tu profe la publica.' },
    { before: 'Preguntar quién va ganando en las alianzas', after: 'Marcador en vivo en tu teléfono.' },
  ],
};

export type Screen = 'inicio' | 'calendar' | 'classhall' | 'eventos' | 'notas' | 'alianzas' | 'feed' | 'entradas' | 'herramientas' | 'ciudad';

export const SCREEN_ALT: Record<string, string> = {
  inicio: 'Inicio de HaNet',
  calendar: 'Calendar del curso con una prueba dentro de su clase',
  classhall: 'ClassHall de Matemáticas',
  eventos: 'Eventos de la institución',
  'notas-tapada': 'Nota tapada para raspar',
  'notas-destapada': 'Nota destapada',
  alianzas: 'Marcador de las alianzas',
  feed: 'Feed con una votación',
  entradas: 'Entrada con QR',
  herramientas: 'Herramientas',
  ciudad: 'Eventos cerca de mí',
};

export type TourStep = {
  key: Screen; tag: 'Base' | 'Módulo'; name: string; sub?: string;
  head?: Partial<Record<Aud, string>>; headText?: Partial<Record<Aud, string>>;
  text: Record<Aud, string>;
};

export const TOUR: TourStep[] = [
  { key: 'calendar', tag: 'Base', name: 'Calendar', sub: 'La agenda del curso',
    head: { inst: 'Todo lo que una institución necesita y sin costo adicional.', est: 'Toda tu institución, sin buscar en diez grupos.' },
    text: { inst: 'Haz que tus estudiantes no se pierdan ninguna evaluación, actividad o tarea. Cada prueba aparece dentro de su clase, con aviso un día antes.',
      est: 'No te pierdas ninguna prueba, actividad o tarea. Cada evaluación aparece dentro de su clase, con aviso un día antes.' } },
  { key: 'classhall', tag: 'Base', name: 'ClassHall', sub: 'El espacio de cada asignatura',
    text: { inst: 'Anuncios, documentos, evaluaciones, pautas y tareas con entrega. Plan común, electivos y dominios, cada uno con su horario complementado con Calendar.',
      est: 'Anuncios, material, pautas y tareas de cada asignatura. Entrega tus tareas desde el teléfono y lee los comentarios de tu profe.' } },
  { key: 'eventos', tag: 'Base', name: 'Eventos', sub: 'Lo que pasa en la institución',
    text: { inst: '¿Tienes una actividad en el patio? Publícala en Eventos y haz que tus estudiantes se enteren rápidamente. Con inscripción, entradas y más.',
      est: '¿Qué pasa hoy en tu institución? Tocatas, ferias y campeonatos, con inscripción en un toque.' } },
  { key: 'notas', tag: 'Módulo', name: 'Notas',
    head: { inst: 'Solo lo que tu institución necesita.', est: 'Y mucho más, según tu institución.' },
    headText: { inst: 'El Ecosistema HaNet tiene mucho más que ofrecerte. Activa más módulos HaNet y disfruta de más funciones en menos aplicaciones extras.',
      est: 'Cada institución activa los módulos que necesita.' },
    text: { inst: 'Mantén a tus estudiantes informados de sus calificaciones y promedios por asignatura desde una sola app.',
      est: 'Raspa la pantalla y destapa tu nota apenas se publica. Mira tu promedio por asignatura cuando quieras.' } },
  { key: 'alianzas', tag: 'Módulo', name: 'Alianzas',
    text: { inst: 'Informa actividades, puntajes, descuentos y todo lo necesario para las alianzas de tu institución.',
      est: 'Sigue a tu alianza en vivo: puntajes, actividades del día y pruebas flash.' } },
  { key: 'feed', tag: 'Módulo', name: 'Feed',
    text: { inst: 'Publicaciones de la institución, el CEE y la directiva de cada curso, con votaciones y notificaciones.',
      est: 'Avisos de tu institución, del CEE y de tu curso. Vota en las encuestas, siempre de forma anónima.' } },
  { key: 'entradas', tag: 'Módulo', name: 'Entradas',
    text: { inst: 'Ofrece y emite entradas a eventos de tu institución desde HaNet y obtén analíticas en vivo de quiénes llegaron y quiénes no.',
      est: 'Tu entrada vive en tu teléfono. Muestra el QR en la puerta y listo.' } },
  { key: 'herramientas', tag: 'Módulo', name: 'Herramientas',
    text: { inst: 'Test de electividad para 2° medio, escala y calculadora de notas, y práctica de verbos en inglés. Actualizadas por HaNet.',
      est: 'Descubre qué electivos van contigo, calcula cuánto te falta para pasar y practica verbos en inglés.' } },
  { key: 'ciudad', tag: 'Módulo', name: 'Eventos de la ciudad',
    text: { inst: 'Panoramas, conciertos, ferias y expos cerca de la ubicación del estudiante, revisados por HaNet.',
      est: 'Panoramas, conciertos y expos cerca de ti, revisados por HaNet.' } },
];

export const ROLES = [
  { name: 'Estudiantes', intro: 'Todo tu día de clases en una sola app.', items: [
    'Tu horario y tus pruebas, con aviso 24 y 4 horas antes.',
    'Tus notas, apenas tu docente las publica.',
    'Los eventos y las entradas de tu institución.',
    'Tu próxima clase en la pantalla de inicio del teléfono.'] },
  { name: 'Docentes', intro: 'Tus clases, ordenadas por asignatura y curso.', items: [
    'Publica anuncios, material y tareas en cada Hall.',
    'Revisa entregas y deja comentarios.',
    'Sube notas y publícalas cuando estén listas.',
    'Comparte un PDF a HaNet desde cualquier app.'] },
  { name: 'Directiva y CEE', intro: 'Organiza tu curso y tu institución sin planillas.', items: [
    'Mantén al día el Calendar y el horario del curso.',
    'Organiza las alianzas y los eventos.',
    'Publica avisos en el Feed y notifica a todos.',
    'Pasa lista en la puerta con HaNet ID.'] },
  { name: 'Administración', intro: 'Lo que decide tu institución llega a todos al instante.', items: [
    'Suspende clases o adelanta la salida: las pruebas se mueven solas.',
    'Publica en el Espacio de la institución y en Eventos.',
    'Revisa los resultados de electividad de tu institución.',
    'Personas, nómina y año escolar desde el panel web.'] },
];

export const PASOS: Record<Aud, { title: string; text: string; steps: string[]; labels: string[]; main: string; mainHref: string; other: string; otherHref: string; foot: string }> = {
  inst: { title: 'Así de fácil se suma tu institución.', text: 'Nosotros te acompañamos en cada paso.',
    steps: ['Escríbenos y cuéntanos qué necesita tu institución.', 'Elige los módulos que quieres activar.', 'Carga la nómina y entrega el código de tu institución.', '¡Y tus estudiantes ya están dentro!'],
    labels: ['01', '02', '03', '04'],
    main: 'Escríbenos', mainHref: '#instituciones', other: 'Ver los módulos', otherHref: '#modulos', foot: 'Disponible en iPhone, Android y en el navegador.' },
  est: { title: 'Entras antes del primer timbre.', text: 'Cuatro pasos, una sola vez. Exclusivo para miembros de la institución.',
    steps: ['Crea tu cuenta y verifica tu correo.', 'Escribe el código de tu institución.', 'Vincula tu correo institucional.', '¡Y ya estás dentro!'],
    labels: ['07:56', '07:57', '07:58', '07:59'],
    main: 'Crear mi cuenta', mainHref: APP_URL, other: 'Iniciar sesión', otherHref: APP_URL, foot: 'Disponible en iPhone, Android y en tu navegador.' },
};
