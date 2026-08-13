# NEXO

**Encuentra a quien ya recorrió el camino que tú quieres empezar.**

NEXO es una plataforma de mentoría construida como proyecto de portafolio frontend.
No es un directorio de expertos: es un producto que conecta a alguien con un objetivo
concreto con quien ya lo consiguió, y que **sigue acompañando después de la
videollamada** con objetivos, hitos, tareas y progreso medible.

> Aplicación ficticia. Los mentores, reseñas y transacciones son datos de ejemplo.

---

## El problema

Buscar mentoría suele fallar por dos motivos:

1. **Descubrimiento genérico.** Los directorios listan "expertos" por categoría y
   precio, pero no responden a la pregunta real: *¿quién ha pasado ya por donde
   yo estoy?*
2. **La mentoría se evapora.** Termina la llamada, hay buenas intenciones, y dos
   semanas después no queda nada accionable.

## La propuesta

- **Match por trayectoria, no por catálogo.** El matching pondera experiencia y
  similitud del camino recorrido por encima del precio o la disponibilidad.
- **La mentoría no termina en la llamada.** Cada mentoría genera objetivos, hitos,
  tareas, notas y recursos, con una métrica de progreso real detrás.

El recorrido que sostiene todo el producto:

```
Descubrir → Matching → Perfil → Reserva → Dashboard → Mentoría → Tareas/Hitos → Progreso
```

---

## Funcionalidades

### Público

- **Home editorial** con hero split-screen, bento asimétrico de categorías y
  composiciones distintas por sección (nada de "título + párrafo + 3 cards").
- **Explorar mentores** con 5 filtros (categoría, objetivo, experiencia,
  valoración, mentoría gratuita) y drawer en móvil.
- **Búsqueda por objetivo** en lenguaje natural, resuelta con tags y mapping local.
- **Perfil de mentor** con trayectoria, "El camino que recorrí", mentorías,
  reseñas, disponibilidad y reserva sticky.
- **Cómo funciona**, login, registro y recuperación de contraseña.

### Privado

- **Dashboard del mentee**: progreso, tareas pendientes, próxima sesión, objetivos,
  actividad y mentores recomendados.
- **Dashboard del mentor**: sesiones, mentees y su progreso, seguimientos,
  métricas y gestión de mentorías y disponibilidad.
- **Workspace compartido**: objetivo, siguientes pasos, tareas, notas, timeline y
  recursos.
- **Progreso**: roadmap de hitos y desglose de métricas.
- **Reserva completa**: slot → formulario → checkout → confirmación, con política
  de cancelación aplicada de verdad.

---

## Real vs. simulado

Distinguirlo importa: es un proyecto de portafolio, no un producto en producción.

| Área | Estado |
|------|--------|
| Navegación, rutas y guards por rol | **Real** |
| Filtros, búsqueda y matching | **Real** (algoritmo local, ver abajo) |
| Cálculo de progreso (70/30) | **Real**, centralizado y con tests |
| Política de cancelación y reprogramación | **Real**, con tests |
| Mentores guardados | **Real**, persistido en `localStorage` |
| Light/dark mode | **Real**, con persistencia y sin flash |
| SSR, prerender y SEO por ruta | **Real** |
| Autenticación | **Real con Supabase Auth** cuando hay credenciales; si no, adaptador demo aislado |
| Pago y checkout | **Simulado** — loading, éxito y error, sin pasarela |
| Videollamada | **Simulada** — la reserva es real, la llamada no existe |
| Notificaciones | **Simuladas** — toasts internos, sin email ni push |
| Ingresos y analítica del mentor | **Mock** |
| Verificación de mentores | **Mock** (badges) |

---

## Stack

| Capa | Elección |
|------|----------|
| Framework | Angular 22 (standalone, signals, control flow `@if`/`@for`) |
| Lenguaje | TypeScript en modo estricto |
| Estilos | Tailwind CSS 3 + PostCSS |
| Rendering | Angular SSR con prerender selectivo |
| Motion | GSAP + ScrollTrigger |
| Backend | Supabase (Auth y PostgreSQL) |
| Testing | Vitest + `@angular/build:unit-test` |
| Calidad | ESLint 10 (flat config) + Prettier |
| Deploy | Netlify |

Deliberadamente **fuera** del proyecto: NgRx, microfrontends, Storybook, GraphQL,
Firebase, pasarela de pagos real, OAuth social y librerías extra de animación.
El estado se resuelve con signals y servicios; nada aquí justificaba más.

---

## Arquitectura

```
src/app/
├── core/                    # Lógica sin UI
│   ├── config/              # Cliente Supabase (carga diferida)
│   ├── data/                # Catálogo de mentores y datos demo
│   ├── guards/              # authGuard, roleGuard
│   ├── models/              # Interfaces del dominio
│   └── services/            # auth, matching, progress, booking, filter, favorites…
├── shared/
│   ├── motion/              # Directivas GSAP reutilizables
│   └── ui/                  # Sistema de diseño (nx-*)
├── features/                # Una carpeta por área de producto
└── layouts/                 # public-layout y dashboard-layout
```

Regla que se mantiene en todo el proyecto:

```
Componente → Servicio de feature → Fuente de datos (mock hoy, Supabase mañana)
```

Los componentes nunca consultan datos directamente, así que sustituir el mock por
Supabase no obliga a reescribir la UI.

### Sistema de diseño

Los tokens viven **solo** en `tailwind.config.js`. Los botones tienen una única
definición en `styles.css` (`.btn-base` + variantes + tamaños) que el componente
`nx-button` compone: por eso un `<button>` de acción y un `<a class="btn-primary">`
de navegación son idénticos y solo pueden cambiar juntos. Los primitivos con dos
escalas (`nx-empty-state`, `nx-page-header`) exponen un input `size` en lugar de
duplicarse: `editorial`/`page` para las páginas públicas, `app`/`inline` para la
aplicación funcional.

---

## Rendering híbrido

La estrategia está en `src/app/app.routes.server.ts`, no en la configuración del
host:

| Rutas | Modo | Motivo |
|-------|------|--------|
| Home, explorar, cómo funciona, login, registro, onboarding | **Prerender** | Públicas y relevantes para SEO |
| `mentor/:id` (los 18) | **Prerender + fallback SSR** | HTML real para buscadores; un mentor nuevo se renderiza en servidor bajo demanda |
| `dashboard/**`, progreso, mentorías, workspace, guardados, configuración, reserva | **Client** | Contenido por usuario, sin valor SEO |

Resultado: **27 rutas prerenderizadas, ninguna privada**.

GSAP nunca se ejecuta en servidor: las directivas de motion importan la librería
de forma diferida y solo tras comprobar que existe DOM.

---

## Matching local

`MatchingService` calcula compatibilidad con pesos aislados y configurables:

| Dimensión | Peso |
|-----------|------|
| Experiencia profesional | 30 % |
| Similitud de trayectoria con el objetivo | 25 % |
| Valoración | 20 % |
| Precio | 10 % |
| Disponibilidad | 10 % |
| Afinidad | 5 % |

Devuelve porcentaje, una frase explicativa y 2–3 tags que justifican el match.
No usa IA: es determinista, testeable y explicable. La forma del servicio permite
sustituirlo o complementarlo con un LLM más adelante sin tocar los componentes.

---

## Reservas y progreso

**Cancelación (`BookingService`).** Más de 24 h antes: cancelar o reprogramar sin
penalidad. Dentro de las 24 h: no hay cancelación desde la plataforma y la
reprogramación requiere aprobación del mentor. La regla se aplica igual a las
sesiones gratuitas, porque ocupan tiempo real en la agenda.

**Progreso (`ProgressService`).** 70 % hitos + 30 % tareas, con los pesos
configurables. La ponderación es deliberada: completar muchas tareas pequeñas no
debe inflar el progreso mientras los hitos reales siguen pendientes. Si una de las
dos dimensiones está vacía, la otra escala a 100 en lugar de quedar capada.

Ambos servicios concentran las reglas de negocio y están cubiertos por tests.

---

## Autenticación y modo demo

`AuthService` funciona en dos modos con la **misma API pública**, así que ningún
componente sabe cuál está activo:

- **Con credenciales**: Supabase Auth real — registro, login, logout, recuperación
  de contraseña, persistencia de sesión y `onAuthStateChange`.
- **Sin credenciales**: adaptador demo aislado, con la sesión en `localStorage`.

El SDK de Supabase se importa **dinámicamente**. Un import estático lo arrastraba
al bundle inicial a través del guard de autenticación, incluso en modo demo donde
nunca se usa (ver *Performance*).

Los accesos **"Entrar como mentee demo"** y **"Entrar como mentor demo"** funcionan
siempre, haya o no Supabase configurado.

---

## Motion

- **CSS/Tailwind** para hover, focus y microinteracciones.
- **GSAP + ScrollTrigger** para reveals, stagger, parallax y efectos magnéticos.

Las secciones públicas no entran todas igual: la directiva `scrollReveal` admite
variantes `slide`, `clip` (wipe editorial) y `scale`, y cada sección usa una
combinación distinta. Las rejillas usan `staggerChildren`; el hero, `parallax` a
dos velocidades; el CTA final, un botón magnético.

El dashboard, el checkout y los formularios se dejan **quietos** a propósito: son
superficies funcionales.

`prefers-reduced-motion` elimina el movimiento decorativo pero **mantiene el
feedback funcional**: un spinner congelado deja de comunicar "sigo trabajando",
que es peor que el movimiento que evita.

---

## Responsive y accesibilidad

Móvil no es el escritorio encogido: el hero cambia de composición, los filtros
pasan a drawer, la card de mentor muestra la información esencial sin depender de
hover y el sidebar se convierte en drawer con overlay.

En accesibilidad:

- Skip link en ambos layouts y `<main>` etiquetado.
- El drawer cerrado sale del orden de tabulación y del árbol de accesibilidad.
- Escape cierra el menú móvil; `aria-expanded` y `aria-controls` en el disparador.
- Las cards de mentor son enlaces reales: foco de teclado y "abrir en pestaña nueva".
- `aria-invalid` y mensaje de error en los campos inválidos; el color nunca es la
  única señal.
- Toasts en una live region que existe antes de que llegue el mensaje.

Pendiente: medición de contraste AA con herramienta en navegador.

---

## Testing

**114 tests en 9 archivos**, centrados en la lógica que puede romper el producto
en silencio:

| Área | Cobertura |
|------|-----------|
| `ProgressService` | Ponderación 70/30, casos límite, pesos configurables |
| `BookingService` | Regla de 24 h, límite exacto, sesiones gratuitas, reprogramación |
| `MatchingService` | Pesos, orden entre mentores, explicación y tags |
| `FilterService` | Los 5 filtros contra el catálogo real, combinaciones, reset |
| Guards | Recorrido crítico: anónimo, mentee, mentor, logout, ruta desconocida |
| `SeoService` | Metadatos por ruta y no-filtración entre páginas |
| `MentorCardComponent` | Guardado, match, badge gratuita, móvil, accesibilidad |
| `TaskCardComponent` | Ciclo de estados, inmutabilidad, etiquetas ARIA |

Estos tests encontraron defectos reales, no solo confirmaron lo que ya funcionaba:
ningún mentor del catálogo ofrecía mentoría gratuita (el filtro obligatorio
devolvía siempre cero), y la card de mentor no era alcanzable por teclado.

```bash
npm test          # 114 tests
npm run lint      # sin errores ni warnings
npm run build     # 27 rutas prerenderizadas
```

---

## Performance

| Métrica | Valor |
|---------|-------|
| Bundle inicial | 123 kB (41 kB transferidos) |
| Presupuesto | 500 kB (warning) / 1 MB (error) |
| Rutas prerenderizadas | 27 |

Optimizaciones aplicadas:

- **Lazy loading por ruta**: cada feature es su propio chunk.
- **GSAP diferido**: solo se descarga en el navegador y cuando hace falta.
- **SDK de Supabase diferido**: un import estático lo metía en el bundle eager vía
  el guard de autenticación y lo subía a **340 kB**; con import dinámico baja a
  **123 kB**.
- **Sin skeletons artificiales** en páginas prerenderizadas: un `setTimeout` de
  400 ms en el marketplace hacía que los buscadores recibieran una página de solo
  skeletons.
- Imágenes con `loading="lazy"` y proporciones fijas para evitar CLS.

Pendiente: medición de LCP, CLS e INP con Lighthouse en navegador.

---

## SEO

`SeoService` aplica metadatos **por ruta**: title, description, Open Graph,
Twitter Card y canonical. Las rutas públicas los declaran en `data.seo`; el perfil
de mentor los genera desde el mentor que renderiza. Una ruta sin metadatos vuelve
a los valores por defecto, para que un título no se filtre de una página a otra.

Como las páginas públicas se prerenderizan, los metadatos ya están en el HTML que
recibe el buscador, no después de la hidratación.

---

## Instalación

```bash
git clone <repo>
cd NEXO
npm install
npm start            # http://localhost:4200
```

Otros comandos:

```bash
npm run build            # build de producción + prerender
npm run serve:ssr:nexo   # sirve el SSR compilado en :4000
npm test                 # tests unitarios
npm run lint             # ESLint
npm run format           # Prettier
```

La aplicación **arranca y es completamente navegable sin configurar nada**: sin
credenciales usa el adaptador demo.

---

## Configurar Supabase

Solo hace falta si quieres autenticación real. Consulta `.env.example`.

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En *Project Settings → API* copia la **URL** y la **publishable key**
   (`sb_publishable_…`, el nombre actual de lo que antes era la anon key).
3. Pégalas en los dos ficheros de entorno, que vienen con placeholders:

   ```
   src/environments/environment.ts              # build de producción
   src/environments/environment.development.ts  # ng serve
   ```

Mientras los placeholders sigan ahí, `isSupabaseConfigured()` devuelve `false` y
la app usa el adaptador demo: sin llamadas de red y sin errores.

> **Seguridad.** En el frontend solo va la publishable key, y solo es segura si
> RLS está activo con políticas en cada tabla. **Nunca** pongas aquí la service
> role key, ninguna secret key ni la contraseña de la base de datos.
>
> En Netlify, define las variables en la UI y genera `environment.ts` en el paso
> de build, para que las claves no vivan en el repositorio.

Entidades previstas: `profiles`, `mentor_profiles`, `mentorships`, `bookings`,
`goals`, `milestones`, `tasks`, `favorites`, `reviews`, `resources`,
`mentor_availability`, `availability_exceptions`.

---

## Deploy en Netlify

`netlify.toml` ya está configurado. Netlify **detecta Angular y publica el bundle
de servidor como Edge Function automáticamente** cuando el build genera SSR: no
hay que declarar ningún plugin ni añadir dependencias.

```toml
[build]
  command = "npm run build"
  publish = "dist/nexo/browser"
```

Dos detalles que conviene conocer:

- **No hay redirect SPA `/*`.** Las páginas servidas por SSR no pasan por los
  redirects, porque la Edge Function se ejecuta antes. Una regla así no se
  aplicaría nunca y solo describiría mal cómo se sirve el sitio.
- **`NG_ALLOWED_HOSTS`.** Angular 22 valida la cabecera `Host` como protección
  frente a SSRF. Si el dominio desplegado responde HTTP 400, define esa variable
  con tu dominio. En local, `angular.json` ya permite `localhost` y `127.0.0.1`.

---

## Decisiones que merecen explicación

**Prerender con fallback SSR en los perfiles de mentor.** Los 18 mentores son datos
estáticos, así que generarlos en build da HTML real y cacheable en CDN. El
`fallback: Server` mantiene la ruta correcta el día que los mentores vengan de
Supabase.

**Dos entradas al mismo botón.** `nx-button` para acciones (`<button>`) y las
clases `.btn-*` para navegación (`<a>`). Un enlace debe seguir siendo un enlace
—clic central, orden de foco, lectores de pantalla— y un botón dentro de un enlace
es HTML inválido.

**Fechas demo relativas a hoy.** Las cuentas demo deben mostrar siempre un estado
intermedio creíble. Con fechas fijas, la "próxima mentoría" acaba en el pasado y
el dashboard parece roto.

**El matching no usa IA.** Un algoritmo determinista es explicable, testeable y
suficiente. La arquitectura deja la puerta abierta a un LLM sin tocar la UI.

---

## Roadmap

**Cerrar la V1**
- Conectar Supabase: esquema, RLS y migrar favoritos de `localStorage` a la tabla.
- Medir contraste AA, LCP, CLS e INP con Lighthouse.
- E2E de navegador (Playwright). Hoy el recorrido crítico está cubierto a nivel de
  router e integración, sin dependencias añadidas.

**Siguientes**
- Pasarela de pago real sobre la abstracción de checkout ya existente.
- Videollamada e integración de calendario.
- Reseñas verificadas tras sesión completada.
- Internacionalización (hoy solo español, PEN).

---

## Licencia

Proyecto de portafolio. Los datos de mentores, reseñas y transacciones son
ficticios.
