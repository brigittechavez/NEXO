# NEXO — Task Backlog

> **Estado verificado el 2026-08-12** mediante auditoría técnica del código real
> (build de producción, tests, lint, servidor SSR en ejecución y revisión de
> componentes), no según lo que estaba marcado previamente.
>
> Leyenda: `[x]` verificado funcionando · `[~]` implementado pero incompleto o con
> defectos · `[ ]` pendiente.
>
> Estado del proyecto: build limpio · 36 tests en verde · lint sin errores ·
> 32 rutas prerenderizadas · servidor SSR respondiendo 200.

---

## Defectos encontrados en la auditoría y corregidos

| # | Problema | Impacto | Estado |
|---|----------|---------|--------|
| 1 | `security.allowedHosts: []` en `angular.json` | **SSR devolvía HTTP 400 en todas las rutas.** La app era inservible servida con SSR y el deploy habría fallado | Corregido |
| 2 | `nx-button` no era un `<button>` real y nunca emitía `(clicked)` | **Todos los botones del sistema de diseño estaban muertos** (login incluido) | Corregido |
| 3 | `.fade-wrapper { opacity: 0 }` en el layout público | Todo el HTML renderizado en servidor salía **invisible** hasta la hidratación | Corregido |
| 4 | `requestAnimationFrame` en el layout público | Excepción SSR en las 14 rutas prerenderizadas | Corregido |
| 5 | `effect()` dentro de `afterNextRender()` en `ThemeService` | Violación de contexto de inyección; el tema no se aplicaba | Corregido |
| 6 | `FavoritesService` nunca se inyectaba en ningún sitio | **Guardar mentor no persistía**; la página de guardados mostraba una lista fija | Corregido |
| 7 | `setTimeout` artificial de 400 ms en `/explorar` | La página prerenderizada solo contenía skeletons: cero contenido para SEO | Corregido |
| 8 | ESLint no ejecutaba (`.eslintrc.json` con ESLint 10) | Sin linting real en todo el proyecto | Corregido (flat config) |
| 9 | Cálculo de progreso embebido en el componente | Incumplía el requisito §41 (servicio central + tests) | Corregido |
| 10 | `app.spec.ts` fallaba (test scaffold de Angular) | Suite de tests en rojo | Corregido |
| 11 | Fechas de datos demo fijas en 2025 | La "próxima mentoría" del demo quedaba un año en el pasado | Corregido (fechas relativas) |
| 12 | `font-heading` usada 31 veces sin existir en Tailwind | Clases muertas en 9 archivos | Corregido |
| 13 | `netlify.toml` publicaba una SPA estática con fallback a `index.html` | El deploy servía el HTML del home bajo URLs de dashboard | Corregido |
| 14 | Sin flash-guard de tema | Los usuarios en dark mode veían un destello claro | Corregido |

---

## Fase 0 — Bootstrap

- [x] Create Angular 22 project with SSR
- [x] Configure TypeScript strict mode
- [x] Install and configure Tailwind CSS + PostCSS
- [x] Configure ESLint + Prettier — *migrado a `eslint.config.js` (flat config)*
- [x] Install GSAP + ScrollTrigger
- [x] Install Supabase JS client
- [x] Create environment config (.env.example)
- [x] Verify build compiles clean

## Fase 1 — Foundations

- [x] Create feature-based architecture structure
- [x] Set up routing with lazy loading
- [x] Create public-layout and dashboard-layout
- [x] Define design tokens (colors, typography, spacing, radii)
- [x] Configure Manrope + Instrument Serif fonts
- [x] Implement light/dark mode with theme switcher — *`effect()` corregido +
      script anti-flash en `index.html`*
- [x] Create UI primitives — *`nx-button` reescrito como `<button>` real*
- [x] Create motion primitives (scroll-reveal, magnetic, parallax directives)
- [x] Create shared logo SVG component
- [x] Registrar `font-heading` en Tailwind (31 usos apuntaban a una clase inexistente)
- [x] Eliminar archivos muertos (`app.component.ts`, `app.html`,
      `features/progress/`, `loading-skeleton.component.ts`)
- [ ] Unificar tokens: `styles.css` declara variables CSS (`--surface`, `--ink`…)
      que ya no consume nadie; los colores viven duplicados en `tailwind.config.js`

## Fase 2 — Mock Data

- [x] Define TypeScript models/interfaces
- [x] Create 18 mentor profiles (8 detailed, 10 brief) — *verificado `m1`–`m18`*
- [x] Create categories data — *las 7 categorías del requisito*
- [x] Create mentorship types data
- [x] Create objectives templates per category
- [x] Create reviews/testimonials data
- [x] Create demo user accounts (mentee + mentor) — *fechas relativas a hoy*
- [x] Create mock adapter layer

## Fase 3 — Public Experience

- [x] Homepage hero, buscador, mentores destacados, categorías, cómo funciona,
      propuesta de seguimiento, testimonios y CTA final
- [x] Build public navigation (editorial, light)
- [x] Implement responsive design for all sections
- [x] Add GSAP animations (hero, scroll reveals, stagger)
- [x] Build "Cómo funciona" page

## Fase 4 — Marketplace

- [x] Build explore page with mentor grid
- [x] Build mentor card component (editorial, photo-dominant, hover reveal)
- [x] Build 5-filter system + mobile drawer
- [x] Build objective search with tag matching
- [x] Build matching service with configurable weights (§10)
- [x] Build match result display (percentage, phrase, tags)
- [x] Build "Mentores que también podrían ayudarte" recommendations
- [x] Implement save/bookmark mentor — *card, `/explorar` y `/guardados`
      comparten `FavoritesService`; feedback por toast*
- [x] Build saved mentors page
- [ ] Persistir guardados en Supabase (hoy `localStorage`; requiere credenciales)
- [ ] Tests unitarios de filtros y matching (§85)

## Fase 5 — Mentor Profile

- [x] Hero editorial, navegación sticky, "Sobre mí", trayectoria, "El camino que
      recorrí", mentorías, reseñas, disponibilidad y columna de reserva sticky
- [x] Estado "Mentor no encontrado" para ids inválidos
- [x] Los 18 perfiles se prerenderizan como HTML real (SEO)

## Fase 6 — Auth

- [x] Configure Supabase Auth (email/password) — *`AuthService` usa Supabase Auth
      real cuando hay credenciales y cae a un adaptador demo aislado cuando no.
      Login, registro, logout, recuperación y `onAuthStateChange` implementados*
- [x] Build login page / register page (role selection)
- [x] Implement session persistence — *sesión Supabase restaurada al arrancar;
      en modo demo se persiste en `localStorage`*
- [x] Build password recovery flow — *conectado a `resetPasswordForEmail`*
- [x] Create auth guards (role-based)
- [x] Build mentee onboarding (3-4 steps) / mentor onboarding
- [x] Implement demo access buttons — *siempre funcionan, haya o no Supabase*
- [ ] **Pendiente de credenciales:** rellenar `src/environments/environment*.ts`
      con `SUPABASE_URL` y `SUPABASE_ANON_KEY` (ver `.env.example`)
- [ ] Crear las tablas y políticas RLS en Supabase (§13)

## Fase 7 — Booking

- [x] Build slot selection calendar
- [x] Build booking form (objetivo, contexto, qué espera resolver)
- [x] Build checkout page + simulated payment (loading, success, error)
- [x] Build booking confirmation
- [x] Implement cancellation policy (>24h free, <24h restricted) — *`BookingService`
      con la regla de 24 h, aplicada también a sesiones gratuitas, 19 tests*
- [x] Build reschedule flow — *reprogramación con aprobación del mentor dentro de
      la ventana de 24 h*

## Fase 8 — Mentee

- [x] Mentee dashboard, detalle de sesión, workspace, objetivos, tareas, hitos
      y vista de progreso
- [x] Build progress calculation service with unit tests — *`ProgressService`
      (70 % hitos / 30 % tareas, pesos configurables), 17 tests, consumido por la
      vista de progreso*

## Fase 9 — Mentor

- [x] Dashboard, gestión de mentees, seguimientos, disponibilidad y CRUD de mentorías

## Fase 10 — Polish (fase actual)

- [x] Ensure SSR works (no window/document during SSR)
- [x] Add route transitions (editorial public, discreet dashboard)
- [x] Add loading skeletons for all major views
- [x] Add success feedback — *toasts para guardar mentor, cancelar y reprogramar*
- [x] Accesibilidad base: skip link en ambos layouts, `main` etiquetado,
      live region correcta en los toasts, focus visible global
- [x] **Fundamentos globales del sistema visual**
  - [x] Tokens: eliminadas las variables CSS duplicadas; `tailwind.config.js` es
        la única fuente de verdad de la paleta
  - [x] Botones: una sola definición (`.btn-base` + variantes + `.btn-sm/md/lg`).
        `nx-button` compone esas mismas clases, así que un `<button>` y un
        `<a class="btn-primary">` son idénticos y solo pueden cambiar juntos
  - [x] Corregidos 8 `<a><nx-button></a>`: contenido interactivo anidado, HTML
        inválido desde que el botón es un `<button>` real
  - [x] Inputs: `.input-nexo` unificado en todos los formularios (6 campos usaban
        clases sueltas), con `disabled` y nuevo estado `.input-error`
  - [x] Corregido `[class.ring-2.ring-red-500/30]` en 7 campos: Angular lo leía
        como **una** clase inexistente, así que el error nunca se veía
  - [x] `aria-invalid` en los campos de formulario inválidos
  - [x] Badges: eliminada la clase muerta `.badge-nexo`; `nx-badge` es el único
        sistema de badges
  - [x] CTAs del home y de "Cómo funciona" normalizados a los tamaños del sistema
- [x] Add empty states with NEXO identity — *`nx-empty-state` con dos escalas
      (`page` e `inline`) adoptado en marketplace, guardados, objetivos, tareas y
      el perfil de mentor inexistente*
- [x] Add error states with recovery — *`nx-error-state` alineado con el sistema
      de botones; "mentor no encontrado" pasa a estado vacío neutro, que es lo que
      es: un resultado vacío, no un fallo*
- [x] Respect prefers-reduced-motion — *la regla global congelaba también los
      spinners y skeletons; ahora el movimiento decorativo se elimina pero el
      feedback funcional se mantiene, ralentizado (§75). `magnetic` no
      comprobaba reduced-motion*
- [x] Adoptar `nx-page-header` — *añadida escala `app` (dashboards) frente a
      `editorial` (públicas); adoptado en progreso, workspace y guardados*
- [x] **Motion diversificado (§73)** — *las 6 secciones del home usaban el mismo
      `scrollReveal`. Añadidas variantes `clip` y `scale` a la directiva y
      direcciones distintas por sección; `staggerChildren` en el bento de
      categorías; `parallax` a dos velocidades en el hero; botón magnético en el
      CTA final. `stagger`, `parallax` y `magnetic` existían sin usarse*
- [x] Audit and improve mobile experience — *drawer del sidebar fuera del orden
      de tabulación cuando está cerrado, Escape para cerrarlo, `aria-expanded` +
      `aria-controls`, etiqueta en español; corregido el botón de menú que se
      superponía al encabezado de cada página en móvil*
- [x] Accesibilidad — *jerarquía de encabezados en onboarding (empezaba en h2 sin
      h1), `aria-hidden` en los elementos decorativos del hero*
- [x] Polish pantalla por pantalla — *home, explorar, perfil, onboarding,
      dashboards mentee y mentor*
- [ ] Contraste AA medido con herramienta (pendiente de auditoría en navegador)

## Fase 11 — Quality

- [x] Unit tests: progreso, reservas y cancelación, **matching** y **filtros**
      — 114 tests en 9 archivos
- [x] Component tests: mentor card y task card
- [x] Tests del recorrido crítico — *`guards.spec.ts` conduce la configuración
      real de rutas: visitante anónimo, mentee y mentor, logout y ruta desconocida*
- [x] Lint sin errores ni warnings
- [x] SEO por ruta — *`SeoService` reescrito y conectado: title, description,
      Open Graph, Twitter y canonical por ruta, con metadatos dinámicos en el
      perfil del mentor. Verificado en el HTML prerenderizado de cada página*
- [x] Performance — *bundle inicial 123 kB (41 kB transferidos), muy por debajo
      del presupuesto de 500 kB; lazy loading por ruta correcto*
- [ ] E2E en navegador real (Playwright) — *ver decisión pendiente abajo*
- [ ] Lighthouse / medición de LCP, CLS e INP — *requiere navegador*

### Defectos encontrados por los tests de Fase 11

| Problema | Impacto | Estado |
|----------|---------|--------|
| **Ningún mentor del catálogo ofrecía mentoría gratuita** | El filtro "gratuita" —uno de los 5 obligatorios (§22)— siempre devolvía cero, el badge "Gratuita" de la card nunca aparecía y §18 quedaba sin cumplir | Corregido: 3 mentorías gratuitas con motivo y cupos |
| **La mentor card no era alcanzable por teclado** | Era un `<article routerLink>`: sin `href`, sin foco, sin abrir en pestaña nueva. Rompía el primer paso del recorrido crítico | Corregido con patrón de enlace extendido sobre el nombre |
| Botón "Ver perfil y reservar" sin acción | Control muerto y segundo tab stop hacia el mismo destino | Convertido en afordancia visual |
| **Regresión de bundle introducida en Fase 6** | El cliente Supabase entraba en el bundle *eager* vía `AuthService`: 340 kB iniciales frente a 128 kB | Corregido con import dinámico: 123 kB |
| `logout()` no se esperaba antes de navegar | Con Supabase real se navegaría con la sesión aún abierta | Corregido |
| Caracteres chinos (`持续`) en una descripción | Texto visible corrupto en el perfil de mentor | Corregido |
| "Excellent" en copy español | Idioma inconsistente | Corregido |

### Decisión pendiente: E2E en navegador

Los recorridos críticos están cubiertos a nivel de router e integración
(`guards.spec.ts` + tests de componente), que se ejecutan en el runner actual sin
dependencias nuevas. Un E2E real de navegador exige añadir Playwright y descargar
sus navegadores, algo que no puedo validar en este entorno y que amplía el stack
—precisamente lo que §7 pide evitar sin necesidad explícita.

Queda como decisión tuya: si quieres E2E de navegador, lo añado; si no, la
cobertura actual ya protege el recorrido completo.

## Fase 12 — Delivery

- [x] Configure Netlify deployment — *sin dependencias añadidas: Netlify publica
      el bundle de servidor como Edge Function al detectar SSR. Sin redirect SPA,
      porque las páginas SSR no pasan por los redirects*
- [x] Create .env.example with documentation — *`SUPABASE_PUBLISHABLE_KEY`,
      `NG_ALLOWED_HOSTS` y cómo llegan los valores a Angular*
- [x] **README reescrito como case study** — *en español, alineado con el idioma
      del producto: problema, propuesta, real vs. simulado, stack, arquitectura,
      rendering híbrido, matching, reservas y progreso, auth y modo demo, motion,
      responsive y accesibilidad, testing con los defectos que encontró,
      performance con la reducción de bundle, SEO, Netlify, Supabase y roadmap*
- [x] `.env` añadido a `.gitignore` — *`.env.example` decía "never commit a real
      .env" pero nada lo impedía*
- [x] Final build verification — *build limpio, 114 tests, `ng lint` sin hallazgos,
      27 rutas prerenderizadas y 0 privadas*
- [x] Final cross-page flow verification — *19 rutas de ambos recorridos
      (mentee y mentor) responden 200 sobre el servidor SSR, sin excepciones*
- [x] Barrido de entrega — *sin secretos, sin TODOs, sin enlaces rotos, sin
      placeholders, sin copy en idioma incorrecto, sin dependencias sobrantes*

---

## Estado final de la V1

**Verificado el 2026-08-13**

| Comprobación | Resultado |
|--------------|-----------|
| Build de producción | Limpio, sin errores ni warnings |
| Bundle inicial | 123 kB (41 kB transferidos) — presupuesto 500 kB |
| Tests | 114 en verde, 9 archivos |
| Lint (`ng lint`) | Sin errores ni warnings |
| Rutas prerenderizadas | 27 públicas · 0 privadas |
| SSR | 19 rutas de ambos recorridos en 200, 0 excepciones |
| Secretos en el repo | Ninguno |

### Pospuesto deliberadamente

- **E2E de navegador (Playwright).** El recorrido crítico está cubierto a nivel de
  router e integración sin dependencias nuevas. Decisión tomada para no ampliar el
  stack en la V1.
- **Lighthouse y medición de LCP/CLS/INP.** Requiere navegador.
- **Contraste AA medido con herramienta.** Requiere navegador.
- **Conexión real a Supabase**: esquema, RLS y migración de favoritos desde
  `localStorage`. Bloqueado por credenciales.

---

## Estrategia de rendering y deploy (verificada)

Netlify **detecta Angular y publica el bundle de servidor como Edge Function
automáticamente** cuando el build genera SSR. No hace falta declarar
`@netlify/angular-runtime` en `package.json` ni añadir ninguna dependencia: lo
instala su propio sistema de build al detectar el framework.

Consecuencia importante: las páginas servidas por SSR **no pasan por los
redirects** de `netlify.toml`, porque la Edge Function se ejecuta antes. El
fallback SPA `/*` que había se eliminó por eso — no se aplicaría nunca y solo
describía mal cómo se sirve el sitio.

La estrategia híbrida vive en `src/app/app.routes.server.ts`:

| Rutas | Modo | Motivo |
|-------|------|--------|
| home, explorar, cómo funciona, login, registro, onboarding | Prerender | Públicas y relevantes para SEO |
| `mentor/:id` (los 18) | Prerender + fallback SSR | HTML real para SEO; un mentor nuevo se renderiza en servidor bajo demanda |
| `dashboard/**`, progreso, mentorías, workspace, guardados, configuración, reserva | Client | Contenido por usuario, sin valor SEO |

Resultado del build: **27 rutas prerenderizadas, ninguna privada** (antes el
catch-all prerenderizaba también páginas del dashboard del mentor).

## Trabajo restante (post-V1)

Bloqueado por credenciales o por necesitar navegador:

1. **Supabase**: credenciales, esquema, RLS y migrar favoritos a la tabla.
2. **Lighthouse**: LCP, CLS, INP y contraste AA.
3. **E2E de navegador** (Playwright), si se decide ampliar el stack.

Mejoras funcionales para siguientes versiones (fuera del alcance de la V1):
pasarela de pago real sobre la abstracción de checkout existente, videollamada e
integración de calendario, reseñas verificadas tras sesión completada e
internacionalización.
