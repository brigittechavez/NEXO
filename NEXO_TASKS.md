# NEXO — Task Backlog

## Fase 0 — Bootstrap
- [ ] Create Angular 22 project with SSR
- [ ] Configure TypeScript strict mode
- [ ] Install and configure Tailwind CSS + PostCSS
- [ ] Configure ESLint + Prettier
- [ ] Install GSAP + ScrollTrigger
- [ ] Install Supabase JS client
- [ ] Create environment config (.env.example)
- [ ] Verify build compiles clean

## Fase 1 — Foundations
- [ ] Create feature-based architecture structure
- [ ] Set up routing with lazy loading
- [ ] Create public-layout and dashboard-layout
- [ ] Define design tokens (colors, typography, spacing, radii)
- [ ] Configure Manrope + Instrument Serif fonts
- [ ] Implement light/dark mode with theme switcher
- [ ] Create UI primitives (button, input, badge, card, avatar, skeleton)
- [ ] Create motion primitives (scroll-reveal, magnetic, parallax directives)
- [ ] Create shared logo SVG component

## Fase 2 — Mock Data
- [ ] Define TypeScript models/interfaces
- [ ] Create 18 mentor profiles (8 detailed, 10 brief)
- [ ] Create categories data
- [ ] Create mentorship types data
- [ ] Create objectives templates per category
- [ ] Create reviews/testimonials data
- [ ] Create demo user accounts (mentee + mentor)
- [ ] Create mock adapter layer

## Fase 3 — Public Experience
- [ ] Build homepage hero (split-screen, editorial)
- [ ] Build search bar component
- [ ] Build featured mentors section
- [ ] Build categories section (varied composition, NOT title+paragraph+3cards)
- [ ] Build "how it works" section
- [ ] Build follow-up/progress proposal section
- [ ] Build testimonials section
- [ ] Build final CTA section
- [ ] Build public navigation (editorial, light)
- [ ] Implement responsive design for all sections
- [ ] Add GSAP animations (hero, scroll reveals, stagger)
- [ ] Build "Cómo funciona" page

## Fase 4 — Marketplace
- [ ] Build explore page with mentor grid
- [ ] Build mentor card component (editorial, photo-dominant, hover reveal desktop, tap mobile)
- [ ] Build 5-filter system (categoría, objetivo, experiencia, valoración, gratuita)
- [ ] Build mobile filter drawer/bottom sheet
- [ ] Build objective search with tag matching
- [ ] Build matching service with configurable weights
- [ ] Build match result display (percentage, phrase, tags)
- [ ] Build "Mentores que también podrían ayudarte" recommendations
- [ ] Implement save/bookmark mentor (Supabase persist)
- [ ] Build saved mentors page

## Fase 5 — Mentor Profile
- [ ] Build mentor profile hero (editorial, SSR)
- [ ] Build sticky internal navigation
- [ ] Build "Sobre mí" section
- [ ] Build "Trayectoria" timeline
- [ ] Build "El camino que recorrí" human story section
- [ ] Build mentorships listing
- [ ] Build reviews section
- [ ] Build availability calendar
- [ ] Build sticky booking column (desktop) / persistent CTA (mobile)

## Fase 6 — Auth
- [ ] Configure Supabase Auth (email/password)
- [ ] Build login page
- [ ] Build register page (role selection)
- [ ] Implement session persistence
- [ ] Build password recovery flow
- [ ] Create auth guards (role-based)
- [ ] Build mentee onboarding (3-4 steps)
- [ ] Build mentor onboarding (multi-step, visual)
- [ ] Implement demo access buttons

## Fase 7 — Booking
- [ ] Build slot selection calendar
- [ ] Build booking form (objetivo, contexto, qué espera resolver)
- [ ] Build checkout page (mentor, mentoría, fecha, hora, precio, mock payment)
- [ ] Implement simulated payment flow (loading, success, error)
- [ ] Build booking confirmation
- [ ] Implement cancellation policy (>24h free, <24h restricted)
- [ ] Build reschedule flow

## Fase 8 — Mentee
- [ ] Build mentee dashboard (progreso, tareas, próxima mentoría, objetivos, actividad, recomendados)
- [ ] Build session detail page (próxima/completada/cancelada states)
- [ ] Build workspace mentor-mentee (objetivo, próximos pasos, tareas, notas, timeline, recursos)
- [ ] Build goals management (custom + templates per category)
- [ ] Build tasks management (pendiente/en progreso/completada)
- [ ] Build milestones (template-based, editable by mentor)
- [ ] Build progress view (roadmap + metrics: 70% hitos, 30% tareas)
- [ ] Build progress calculation service with unit tests

## Fase 9 — Mentor
- [ ] Build mentor dashboard (próximas sesiones, mentees, seguimientos, reservas, métricas, actividad)
- [ ] Build mentee management view
- [ ] Build follow-up creation
- [ ] Build availability management
- [ ] Build mentorship CRUD (título, descripción, tipo, duración, precio, gratuita, cupos)

## Fase 10 — Polish
- [ ] Add loading skeletons for all major views
- [ ] Add empty states with NEXO identity
- [ ] Add error states with recovery
- [ ] Add success feedback (reserva, tarea, guardado, perfil)
- [ ] Audit and improve mobile experience
- [ ] Audit accessibility (keyboard, focus, contrast, labels, ARIA)
- [ ] Add route transitions (editorial public, discreet dashboard)
- [ ] Respect prefers-reduced-motion
- [ ] Ensure SSR works (no window/document during SSR)

## Fase 11 — Quality
- [ ] Unit tests: matching, progress, filters, booking, cancellation
- [ ] Component tests: mentor card, onboarding, calendar, tasks/progress
- [ ] E2E: register+onboarding, search+filter, booking, task+progress
- [ ] Performance audit (LCP, CLS, INP)
- [ ] SEO audit (titles, meta, OG, semantic HTML)
- [ ] Lighthouse check

## Fase 12 — Delivery
- [ ] Configure Netlify deployment
- [ ] Create .env.example with documentation
- [ ] Create README (case study format)
- [ ] Final build verification
- [ ] Final cross-page flow verification
