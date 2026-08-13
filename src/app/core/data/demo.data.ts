import { User } from '../models/user.model';
import { Goal } from '../models/goal.model';
import { Booking } from '../models/booking.model';
import { Review } from '../models/review.model';

/**
 * Demo dates are relative to "today" on purpose.
 *
 * The demo accounts must always show a believable in-progress state — a session
 * coming up in a couple of days, recent completed ones, tasks with live due
 * dates. Hard-coded calendar dates go stale and make the dashboard look broken.
 */
function daysFromToday(days: number, hours = 0, minutes = 0): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

/* ====== DEMO MENTEE ====== */

export const DEMO_MENTEE: User = {
  id: 'mentee-1',
  email: 'maria.garcia@email.com',
  name: 'María García',
  role: 'mentee',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
  createdAt: daysFromToday(-79),
};

export const DEMO_MENTEE_GOAL: Goal = {
  id: 'goal-1',
  menteeId: 'mentee-1',
  title: 'Conseguir mi primer trabajo como frontend developer',
  description: 'Transicionar de diseñadora gráfica a desarrolladora frontend. Aprender Angular, construir portafolio y conseguir empleo en una empresa tech.',
  category: 'tecnologia',
  milestones: [
    { id: 'ms-1', title: 'Aprender fundamentos de HTML, CSS y JavaScript', completed: true, order: 1 },
    { id: 'ms-2', title: 'Dominar Angular básico y intermedio', completed: true, order: 2 },
    { id: 'ms-3', title: 'Construir 3 proyectos para portafolio', completed: false, order: 3 },
    { id: 'ms-4', title: 'Preparar CV técnico y LinkedIn', completed: false, order: 4 },
    { id: 'ms-5', title: 'Conseguir entrevistas y oferta laboral', completed: false, order: 5 },
  ],
  tasks: [
    { id: 't-1', title: 'Completar curso de TypeScript', description: 'Terminar el módulo de TypeScript en Platzi', status: 'completed', dueDate: daysFromToday(-35) },
    { id: 't-2', title: 'Crear proyecto de e-commerce con Angular', description: 'Desarrollar un e-commerce funcional con carrito y pagos simulados', status: 'in_progress', dueDate: daysFromToday(1) },
    { id: 't-3', title: 'Publicar proyectos en GitHub', description: 'Subir los 3 proyectos del portafolio a GitHub con README profesional', status: 'pending', dueDate: daysFromToday(11) },
    { id: 't-4', title: 'Actualizar CV con habilidades técnicas', description: 'Incluir Angular, TypeScript y proyectos recientes', status: 'pending', dueDate: daysFromToday(17) },
    { id: 't-5', title: 'Practicar entrevistas técnicas', description: 'Resolver 20 ejercicios de JavaScript y 5 de system design básico', status: 'pending', dueDate: daysFromToday(27) },
    { id: 't-6', title: 'Enviar 10 applications a empresas tech', description: 'Aplicar a frontend developer positions en startups y empresas medianas', status: 'pending', dueDate: daysFromToday(32) },
  ],
  progress: 45,
  createdAt: daysFromToday(-79),
};

export const DEMO_MENTEE_SESSIONS: Booking[] = [
  {
    id: 'booking-1',
    mentorId: 'm1',
    menteeId: 'mentee-1',
    mentorshipId: 'ms1',
    date: daysFromToday(-40),
    time: '18:30',
    duration: 60,
    status: 'completed',
    objective: 'Revisar progreso en Angular y definir siguiente paso',
    context: 'María completó el módulo de componentes y necesita guía sobre servicios y dependency injection.',
  },
  {
    id: 'booking-2',
    mentorId: 'm1',
    menteeId: 'mentee-1',
    mentorshipId: 'ms1',
    date: daysFromToday(-26),
    time: '19:00',
    duration: 60,
    status: 'completed',
    objective: 'Resolver dudas sobre RxJS y observables',
    context: 'María está implementando un módulo de dashboard y necesita entender patrones reactivos.',
  },
  {
    id: 'booking-3',
    mentorId: 'm1',
    menteeId: 'mentee-1',
    mentorshipId: 'ms1',
    date: daysFromToday(-12),
    time: '18:00',
    duration: 60,
    status: 'completed',
    objective: 'Revisar proyecto de e-commerce y dar feedback',
    context: 'María tiene una primera versión del e-commerce y quiere recibir feedback sobre arquitectura y UX.',
  },
  {
    id: 'booking-4',
    mentorId: 'm6',
    menteeId: 'mentee-1',
    mentorshipId: 'ms15',
    date: daysFromToday(-5),
    time: '18:30',
    duration: 60,
    status: 'completed',
    objective: 'Crear marca personal en LinkedIn',
    context: 'María necesita posicionarse como frontend developer en LinkedIn para atraer reclutadores.',
  },
  {
    id: 'booking-5',
    mentorId: 'm1',
    menteeId: 'mentee-1',
    mentorshipId: 'ms1',
    date: daysFromToday(2),
    time: '19:00',
    duration: 60,
    status: 'upcoming',
    objective: 'Preparar ejercicios de entrevista técnica',
    context: 'María quiere practicar coding challenges antes de aplicar a empleos.',
  },
  {
    id: 'booking-6',
    mentorId: 'm15',
    menteeId: 'mentee-1',
    mentorshipId: 'ms15',
    date: daysFromToday(9),
    time: '10:00',
    duration: 60,
    status: 'upcoming',
    objective: 'Simular entrevista laboral',
    context: 'María quiere hacer un mock interview para ganar confianza antes de postular.',
  },
];

export const DEMO_MENTEE_REVIEWS: Review[] = [
  { id: 'rev-1', mentorId: 'm1', menteeName: 'María García', rating: 5, comment: 'Carlos es un mentor excepcional. Su capacidad para explicar conceptos complejos de Angular de forma simple es increíble. Cada sesión salgo con más claridad y confianza.', tags: ['paciente', 'claro', 'práctico'], date: daysFromToday(-39) },
  { id: 'rev-2', mentorId: 'm1', menteeName: 'María García', rating: 5, comment: 'La segunda sesión fue genial. Carlos me ayudó a entender RxJS de una manera que ningún tutorial logró. Muy recomendado para cualquiera que quiera aprender Angular.', tags: ['experto', 'didáctico'], date: daysFromToday(-25) },
  { id: 'rev-3', mentorId: 'm1', menteeName: 'María García', rating: 5, comment: 'El feedback de Carlos sobre mi proyecto fue transformador. Me señaló problemas de arquitectura que no veía y me dio un plan claro de mejora.', tags: ['detallista', 'constructivo'], date: daysFromToday(-11) },
  { id: 'rev-4', mentorId: 'm6', menteeName: 'María García', rating: 4, comment: 'Daniela me dio estrategias concretas para LinkedIn. En una semana ya estaba recibiendo mensajes de reclutadores. Muy práctica y orientada a resultados.', tags: ['estratega', 'práctica'], date: daysFromToday(-4) },
];

/* ====== DEMO MENTOR ====== */

export const DEMO_MENTOR: User = {
  id: 'mentor-1',
  email: 'carlos.mendoza@email.com',
  name: 'Carlos Mendoza',
  role: 'mentor',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  createdAt: daysFromToday(-582),
};

export const DEMO_MENTOR_ACTIVE_MENTEES = [
  {
    menteeId: 'mentee-1',
    menteeName: 'María García',
    menteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    goal: 'Conseguir primer trabajo como frontend developer',
    sessionsCompleted: 3,
    nextSession: daysFromToday(2),
    progress: 45,
  },
  {
    menteeId: 'mentee-2',
    menteeName: 'Andrea Vásquez',
    menteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andrea',
    goal: 'Aprender React para un proyecto freelance',
    sessionsCompleted: 5,
    nextSession: daysFromToday(1),
    progress: 70,
  },
  {
    menteeId: 'mentee-3',
    menteeName: 'Luis Paredes',
    menteeAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LuisParedes',
    goal: 'Preparar entrevistas para FAANG',
    sessionsCompleted: 2,
    nextSession: daysFromToday(6),
    progress: 30,
  },
];

export const DEMO_MENTOR_UPCOMING_SESSIONS: Booking[] = [
  {
    id: 'booking-m1',
    mentorId: 'm1',
    menteeId: 'mentee-2',
    mentorshipId: 'ms1',
    date: daysFromToday(0),
    time: '18:00',
    duration: 60,
    status: 'upcoming',
    objective: 'Repasar hooks avanzados en React',
    context: 'Andrea necesita entender useEffect y custom hooks para su proyecto freelance.',
  },
  {
    id: 'booking-m2',
    mentorId: 'm1',
    menteeId: 'mentee-1',
    mentorshipId: 'ms1',
    date: daysFromToday(2),
    time: '19:00',
    duration: 60,
    status: 'upcoming',
    objective: 'Preparar ejercicios de entrevista técnica',
    context: 'María quiere practicar coding challenges antes de aplicar a empleos.',
  },
  {
    id: 'booking-m3',
    mentorId: 'm1',
    menteeId: 'mentee-3',
    mentorshipId: 'ms1',
    date: daysFromToday(6),
    time: '18:30',
    duration: 60,
    status: 'upcoming',
    objective: 'Simular entrevista de sistema design',
    context: 'Luis necesita practicar system design para entrevistas en Google y Amazon.',
  },
];

export const DEMO_MENTOR_METRICS = {
  totalMentees: 47,
  activeMentees: 3,
  completedSessions: 89,
  averageRating: 4.9,
  totalEarnings: 15960,
  monthlyEarnings: 2340,
  responseTime: '< 2 horas',
  completionRate: 96,
};
