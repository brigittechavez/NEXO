# NEXO — Master Requirements & OpenCode Build Specification

## 0. Instrucción principal

Construye **NEXO**, una plataforma ficticia tipo **mentorship marketplace** para un portafolio frontend profesional.

Este documento es la **fuente de verdad del proyecto**. Antes de escribir código:

1. Lee este documento completo.
2. Inspecciona el estado actual del repositorio.
3. If `/design-references/` exists, inspect all visual references before making major visual decisions. These references complement the visual requirements defined in this document and must be considered during visual implementation and polish.
4. Crea un plan de implementación por fases.
5. Crea un archivo `NEXO_TASKS.md` con el backlog.
6. Implementa el proyecto progresivamente.
7. Después de cada fase:
   - compila;
   - ejecuta los tests correspondientes;
   - revisa errores;
   - corrige problemas;
   - verifica el flujo afectado;
   - continúa automáticamente con la siguiente tarea.
8. No esperes aprobación entre fases.
9. Solo detente si:
   - necesitas credenciales reales;
   - existe una decisión realmente ambigua que afecte significativamente el producto;
   - una acción podría destruir datos o configuración existente;
   - existe un bloqueo técnico que no puedes resolver razonablemente.

No des una tarea por terminada únicamente porque el código fue escrito.

Debe funcionar.

---

# 1. Concepto del producto

NEXO conecta personas que quieren alcanzar un objetivo con mentores que **ya recorrieron el camino que esas personas quieren empezar**.

La propuesta de valor se basa principalmente en dos ideas:

### Experiencia real

El usuario puede encontrar personas que ya lograron algo similar a lo que él quiere conseguir.

### Progreso después de la mentoría

NEXO no termina cuando acaba una videollamada.

Después de la mentoría deben existir:

- objetivos;
- próximos pasos;
- tareas;
- hitos;
- notas;
- recursos;
- seguimiento;
- métricas de progreso.

La experiencia central debe comunicar:

> Encontrar a alguien que ya estuvo donde tú quieres llegar y convertir esa experiencia en acciones concretas.

---

# 2. Público objetivo

NEXO está dirigido a un público amplio.

El usuario principal es:

> Una persona, independientemente de su edad o etapa profesional, que tiene un objetivo concreto y quiere encontrar a alguien con experiencia relevante para ayudarla a avanzar.

La plataforma estará inicialmente orientada a **Latinoamérica**, con una presencia especialmente fuerte de mentores peruanos.

Idioma inicial:

**Español.**

Moneda:

**Soles peruanos — PEN / S/.**

No implementar internacionalización todavía.

---

# 3. Categorías

Usar exactamente estas siete categorías principales:

1. Tecnología
2. Negocios y emprendimiento
3. Marketing y comunicación
4. Ciencia e investigación
5. Carrera y empleabilidad
6. Liderazgo y management
7. Productividad y desarrollo profesional

---

# 4. Roles

Existirán dos roles separados:

- Mentee
- Mentor

Durante el registro el usuario debe elegir:

- `Quiero encontrar un mentor`
- `Quiero ser mentor`

En esta primera versión no implementar cambio dinámico de rol.

Las experiencias de mentor y mentee deben mantenerse claramente separadas.

---

# 5. Recorrido crítico del producto

El recorrido que **nunca debe sacrificarse** es:

**Descubrir → Matching → Perfil del mentor → Reserva → Dashboard → Mentoría → Seguimiento → Progreso**

Si el alcance empieza a crecer demasiado:

1. reducir funcionalidades secundarias;
2. simplificar integraciones simuladas;
3. eliminar detalles no esenciales;

pero no degradar:

- este recorrido principal;
- responsive;
- identidad visual;
- UX;
- accesibilidad básica;
- estabilidad.

---

# 6. Stack tecnológico

## Core

Usar:

- Angular 22.x
- TypeScript
- Angular Router
- Angular Signals
- Angular SSR / hydration
- HTML5
- Tailwind CSS
- PostCSS
- GSAP
- GSAP ScrollTrigger
- Supabase
- PostgreSQL mediante Supabase
- Git

Mantener el proyecto compatible como mínimo con Angular 17+, pero usar Angular 22.x como objetivo.

---

# 7. Tecnologías deliberadamente fuera de NEXO

NO añadir solamente para hacer el stack más grande:

- Microfrontends
- Web Components
- Storybook
- Figma Tokens
- Firebase
- GraphQL
- Headless CMS
- NoSQL
- Google Analytics
- Google Calendar real
- pasarela de pagos real
- OAuth social
- OpenID Connect
- chat interno
- sistema de comunidad/feed
- librerías adicionales de motion innecesarias

Estas tecnologías podrán demostrarse en otros proyectos del portafolio.

---

# 8. Arquitectura frontend

Usar arquitectura organizada por features.

Estructura orientativa:

```text
src/app/

core/
  auth/
  guards/
  interceptors/
  models/
  services/
  repositories/
  config/

shared/
  ui/
  directives/
  pipes/
  motion/
  utilities/

features/
  home/
  mentors/
  matching/
  booking/
  onboarding/
  progress/
  mentorship/
  dashboard-mentee/
  dashboard-mentor/
  profile/
  settings/
  auth/
  how-it-works/

layouts/
  public-layout/
  dashboard-layout/
```

Evitar componentes gigantes.

Separar:

- presentación;
- estado;
- acceso a datos;
- lógica de negocio.

---

# 9. Capa de datos

Los componentes no deben consultar datos directamente de forma desordenada.

Usar:

```text
Component
↓
Feature service / repository
↓
Data source
↓
Supabase / REST / mock adapter
```

La arquitectura debe permitir sustituir datos mock por API real sin reescribir los componentes.

---

# 10. Matching Service

Crear un servicio independiente, por ejemplo:

`MatchingService`

La versión actual NO utilizará una API de IA.

Implementar matching local mediante:

- categorías;
- tags;
- objetivos;
- trayectoria;
- experiencia;
- valoración;
- precio;
- disponibilidad;
- afinidad.

Prioridad definida:

1. experiencia profesional;
2. similitud entre trayectoria del mentor y objetivo;
3. valoración;
4. precio;
5. disponibilidad;
6. afinidad personal.

Se puede usar una ponderación aproximada:

```text
Experiencia                30%
Similitud del camino       25%
Valoración                 20%
Precio                     10%
Disponibilidad             10%
Afinidad                    5%
```

Aislar estos pesos en configuración para que puedan modificarse.

El resultado debe generar:

- porcentaje de compatibilidad;
- una frase breve explicativa;
- 2–3 tags que expliquen el match.

Ejemplo:

**94% match**

`Transición similar` `8 años de experiencia` `4.9 ★`

> Recomendamos a Mariana porque realizó una transición profesional similar y ha acompañado a otros profesionales en ese proceso.

Preparar la arquitectura para que en el futuro `MatchingService` pueda reemplazarse o complementarse con una API/LLM.

---

# 11. Autenticación

Implementar autenticación REAL usando Supabase Auth.

V1:

- registro con email/password;
- login;
- logout;
- persistencia de sesión;
- recuperación de contraseña;
- protección de rutas;
- separación por rol.

No implementar todavía:

- Google;
- GitHub;
- Apple;
- 2FA;
- OAuth social.

Nunca colocar secretos administrativos de Supabase en el frontend.

Preparar:

`.env.example`

o el mecanismo equivalente adecuado para Angular/Netlify.

Incluir solo variables públicas necesarias para conectar el cliente.

Nunca incluir:

- service role key;
- secret key;
- contraseña de base de datos.

---

# 12. Datos persistentes

Persistir realmente:

- autenticación;
- perfil del usuario;
- objetivos;
- tareas;
- progreso;
- reservas básicas;
- mentores guardados;
- información básica de mentorías.

Mantener simulados:

- pagos;
- ingresos;
- videollamadas;
- Google Calendar;
- notificaciones externas;
- verificación real de mentores;
- IA;
- sistema complejo de reputación.

---

# 13. Modelo de datos

Crear un esquema simple y razonablemente normalizado.

Entidades mínimas:

```text
profiles
mentor_profiles
mentorships
bookings
goals
milestones
tasks
favorites
reviews
resources
mentor_availability
availability_exceptions
```

Añadir tablas auxiliares solo cuando exista una necesidad real.

Configurar RLS apropiadamente.

Cada usuario autenticado debe poder modificar únicamente información que le corresponda.

---

# 14. Datos ficticios

Crear aproximadamente:

**18 mentores ficticios.**

Distribución:

- Tecnología: 4
- Negocios y emprendimiento: 3
- Marketing y comunicación: 2
- Ciencia e investigación: 3
- Carrera y empleabilidad: 2
- Liderazgo y management: 2
- Productividad y desarrollo profesional: 2

La mayoría deben ser:

- peruanos;
- latinoamericanos.

Puede haber algunos perfiles internacionales.

Priorizar diversidad de:

- trayectorias;
- profesiones;
- edades;
- experiencia;
- caminos profesionales.

No crear diversidad artificial o caricaturesca.

---

# 15. Mentores protagonistas

De los 18 perfiles:

**8 deben estar especialmente desarrollados.**

Estos perfiles necesitan:

- biografía;
- trayectoria;
- historia profesional;
- hitos;
- mentorías;
- especialidades;
- badges;
- precios;
- disponibilidad;
- testimonios;
- tipos de acompañamiento;
- mentorías gratuitas;
- objetivos para los que son recomendados.

Los otros 10 pueden tener datos más breves.

La información debe ser coherente.

No generar perfiles como datos aleatorios inconexos.

---

# 16. Imágenes

Durante la primera fase:

usar placeholders visuales bien compuestos.

No utilizar fotografías aleatorias inconsistentes.

Las imágenes definitivas de mentores se generarán posteriormente mediante IA.

La interfaz debe estar preparada para sustituir placeholders sin cambiar layouts.

Usar proporciones de imagen consistentes.

---

# 17. Tipos de mentoría

Soportar principalmente:

### Sesión individual

Sesión puntual de 30–60 minutos.

### Paquete

Varias sesiones.

### Mentoría continua

Acompañamiento durante varias semanas con seguimiento.

---

# 18. Mentorías gratuitas

Las mentorías pueden ser gratuitas o pagadas.

Las gratuitas deben tener alcance limitado.

Mostrar de forma editorial:

- badge `Gratis`;
- cupos disponibles;
- razón.

Ejemplos:

`2 cupos este mes`

`Sesión introductoria`

`Cupo para estudiantes`

`Mentoría comunitaria`

---

# 19. Precios

Usar soles peruanos.

Rangos orientativos:

### Mentor junior / especializado

S/40–S/80

### Experiencia media

S/80–S/150

### Senior / líder / founder

S/150–S/280

Paquetes:

incluir pequeño descuento.

Mentoría continua:

precio por programa o período.

---

# 20. Marketplace — Explorar mentores

Página pública.

Mostrar principalmente:

- fotografía;
- nombre;
- cargo actual;
- badges;
- mentoría gratuita si existe;
- valoración;
- porcentaje de match cuando aplique;
- guardar;
- CTA de perfil/reserva.

No saturar las cards.

---

# 21. Mentor cards

Las cards deben ser altamente visuales y editoriales.

La fotografía debe dominar.

Estado inicial aproximado:

```text
[ FOTO GRANDE ]

Mariana Rojas
Product Lead

[badge]                         ↗
```

Hover desktop:

revelar progresivamente:

- mini biografía;
- especialidades;
- match;
- CTA;
- mentoría gratuita;
- información adicional.

No mostrar 10 datos simultáneamente.

Al hacer hover:

- imagen puede escalar 1.02–1.05;
- información puede desplazarse;
- gradiente suave;
- CTA aparece;
- ligera elevación;
- movimiento reactivo al cursor.

Mobile:

no depender de hover.

Mostrar información esencial directamente y utilizar tap.

---

# 22. Filtros

Solo cinco filtros principales:

1. Categoría
2. Objetivo
3. Experiencia
4. Valoración
5. Mentoría gratuita

En mobile usar:

- drawer;
- bottom sheet;

en vez de mantener una barra compleja.

---

# 23. Buscador por objetivo

Permitir búsquedas como:

> Quiero pasar de marketing a product management.

No limitarse a coincidencia textual.

Utilizar:

- tags;
- categoría;
- mapping de objetivos;
- keywords;
- matching local.

Mostrar explicación del match.

---

# 24. Recomendaciones relacionadas

En:

- resultados;
- perfil del mentor;
- determinadas mentorías;

mostrar:

**Mentores que también podrían ayudarte**

Basado en:

- objetivo;
- categoría;
- trayectoria;
- tags;
- matching score.

---

# 25. Onboarding del mentee

Máximo 3–4 pasos.

Recopilar:

1. objetivo principal;
2. categoría;
3. nivel actual;
4. tipo de ayuda.

Objetivo:

texto libre.

Después de seleccionar categoría, mostrar sugerencias dinámicas.

Ejemplo Tecnología:

- Conseguir mi primer trabajo en frontend
- Cambiar hacia data
- Prepararme para entrevistas
- Mejorar mi portafolio
- Crecer hacia un rol senior

No pedir demasiados datos.

Precio y disponibilidad pueden filtrarse después.

---

# 26. Onboarding del mentor

Dividir en pocos pasos.

Recopilar:

- nombre;
- foto;
- cargo;
- biografía;
- años de experiencia;
- categorías;
- especialidades;
- logros;
- trayectoria;
- tipos de mentoría;
- duración;
- precios;
- mentorías gratuitas;
- cupos;
- disponibilidad;
- badges simulados.

Debe sentirse visual, no como un formulario administrativo enorme.

---

# 27. Badges

Usar tres tipos:

### Verificación

- Verificado
- Experiencia validada

### Reputación

- Top mentor
- Muy recomendado
- Respuesta rápida

### Trayectoria

- Founder
- 10+ años
- Investigador
- Ex-[empresa ficticia o coherente]

Mostrar máximo 2–3 simultáneamente en superficies pequeñas.

---

# 28. Perfil del mentor

Página pública con SSR.

Estructura:

### Hero editorial

- foto grande;
- nombre;
- cargo;
- badges;
- valoración;
- match;
- CTA.

### Navegación interna sticky

- Sobre mí
- Trayectoria
- Mentorías
- Reseñas
- Disponibilidad

### Columna de reserva sticky

Desktop.

Mobile:

CTA persistente/inferior.

---

# 29. Historia del mentor

No convertir el perfil en un CV.

Mostrar:

### Trayectoria

Timeline profesional.

### El camino que recorrí

Historia más humana:

- decisiones;
- cambios;
- obstáculos;
- aprendizajes;
- transiciones.

Debe reforzar la propuesta de valor de NEXO.

---

# 30. Reservas

Flujo:

```text
Perfil del mentor
→ elegir mentoría
→ fecha/hora
→ formulario breve
→ checkout/revisión
→ confirmación
```

Antes de reservar pedir:

- objetivo;
- contexto breve;
- qué espera resolver.

---

# 31. Calendario

Calendario semanal funcional.

Mentor:

- disponibilidad semanal recurrente;
- excepciones;
- días bloqueados.

Mentee:

- elegir slots disponibles.

Google Calendar NO se integra realmente ahora.

Preparar la arquitectura para hacerlo posteriormente.

---

# 32. Checkout

Checkout visual completo.

No procesar pagos reales.

Mostrar:

- mentor;
- mentoría;
- fecha;
- hora;
- duración;
- precio;
- objetivo;
- método de pago simulado;
- política de cancelación.

Interacción simulada debe incluir:

- loading;
- success;
- error cuando corresponda.

No integrar Stripe todavía.

Preparar una abstracción para payment provider futuro.

---

# 33. Política de cancelación

Regla:

### Más de 24 horas

Cancelar o reprogramar sin penalidad.

### Menos de 24 horas

No permitir cancelación normal desde la plataforma.

Reprogramar únicamente si el mentor lo permite.

Aplicar también a sesiones gratuitas.

Mostrar política claramente en checkout.

---

# 34. Detalle de sesión

Mostrar información según estado.

Estados:

- Próxima
- Completada
- Cancelada

### Próxima

- mentor;
- fecha;
- duración;
- objetivo;
- preparación;
- videollamada simulada.

### Completada

- notas;
- recursos;
- tareas;
- próximos pasos.

### Cancelada

- estado;
- explicación;
- volver a reservar.

---

# 35. Workspace mentor–mentee

Para paquetes y mentorías continuas crear un workspace compartido.

Debe incluir:

- objetivo principal;
- próximos pasos;
- tareas;
- notas;
- timeline;
- recursos.

NO incluir chat interno.

---

# 36. Tareas

Estados:

- Pendiente
- En progreso
- Completada

Cada tarea puede tener:

- título;
- descripción breve;
- fecha límite;
- estado.

No implementar prioridades.

---

# 37. Recursos

Permitir:

- enlaces;
- documentos/PDF simulados.

Mostrar como cards simples.

No construir un gestor de archivos complejo.

---

# 38. Objetivos

Permitir:

- objetivos personalizados;
- plantillas.

Crear plantillas por las siete categorías.

Ejemplos:

- Conseguir mi primer empleo
- Cambiar de carrera
- Lanzar un emprendimiento
- Preparar una postulación
- Mejorar liderazgo
- Lanzar un proyecto
- Organizar mi desarrollo profesional

---

# 39. Hitos

NEXO propone inicialmente una plantilla de hitos según el objetivo.

El mentor puede:

- editar;
- eliminar;
- reorganizar;
- añadir.

---

# 40. Progreso

El progreso debe sentirse como un journey.

Combinar:

- roadmap;
- hitos;
- progreso;
- métricas.

Métricas principales:

1. progreso del objetivo;
2. tareas completadas / totales;
3. sesiones realizadas;
4. hitos alcanzados.

---

# 41. Cálculo de progreso

Usar aproximadamente:

```text
70% hitos
30% tareas
```

Evitar que completar muchas tareas pequeñas infle el progreso artificialmente.

Centralizar el cálculo en un servicio.

Añadir tests unitarios.

---

# 42. Gamificación

Gamificación selectiva.

Permitido:

- hitos;
- badges;
- desbloqueos;
- pequeñas celebraciones;
- progreso visual.

Evitar:

- XP innecesario;
- leaderboards;
- rankings;
- monedas;
- estética infantil;
- mecánicas de videojuego.

---

# 43. Dashboard del mentee

Orden de prioridad:

1. progreso;
2. tareas pendientes;
3. próxima mentoría;
4. objetivos activos;
5. actividad reciente;
6. mentores recomendados.

Mantenerlo funcional.

No usar composiciones excesivamente experimentales.

---

# 44. Dashboard del mentor

Orden:

1. próximas sesiones;
2. mentees activos y progreso;
3. seguimientos pendientes;
4. nuevas reservas;
5. métricas;
6. actividad reciente.

Métricas:

- sesiones realizadas;
- mentees activos;
- valoración promedio;
- tasa de finalización.

Ingresos pueden aparecer de forma secundaria como mock, pero no son KPI principal.

---

# 45. Gestión de mentorías

El mentor podrá crear/editar:

- título;
- descripción;
- tipo;
- duración;
- precio;
- opción gratuita;
- cupos;
- qué incluye;
- para quién está dirigida.

Formulario corto y visual.

---

# 46. Reviews

Después de una mentoría:

- 1–5 estrellas;
- comentario;
- tags rápidos.

Ejemplos:

- Muy claro
- Práctico
- Inspirador
- Buen seguimiento

Algunos reviews aparecerán como testimonios públicos.

---

# 47. Guardar mentor

No usar dos sistemas diferentes de favorito/seguir.

Implementar solamente:

**Guardar mentor**

Usar preferentemente icono bookmark.

Permitir:

- guardar;
- quitar;
- ver guardados;
- filtrar guardados por categoría.

Persistir en Supabase.

---

# 48. Notificaciones

Solo esenciales:

- próxima mentoría;
- reserva/reprogramación/cancelación;
- nueva tarea/recomendación;
- seguimiento pendiente.

Pueden ser notificaciones internas simuladas.

No enviar email/push real en V1.

---

# 49. Páginas

Crear:

1. Inicio
2. Explorar mentores
3. Perfil individual del mentor
4. Resultados/recomendaciones
5. Flujo de reserva
6. Login
7. Registro
8. Onboarding mentee
9. Onboarding mentor
10. Dashboard mentee
11. Detalle de mentoría/sesión
12. Mi progreso
13. Perfil/configuración
14. Cómo funciona
15. Dashboard mentor
16. Gestión de disponibilidad
17. Gestión de mentorías
18. Mentores guardados

---

# 50. Navegación

## Sitio público

Navegación editorial, ligera.

Evitar demasiados links visibles.

Elementos recomendados:

- logo;
- Explorar;
- Cómo funciona;
- Entrar;
- CTA.

## Dashboard

Sidebar funcional.

Separar claramente navegación pública de navegación privada.

---

# 51. Homepage

Incluir:

1. hero;
2. buscador;
3. mentores destacados;
4. categorías;
5. cómo funciona;
6. propuesta de seguimiento;
7. testimonios;
8. CTA final.

No utilizar repetidamente:

`Título + párrafo + tres cards`.

Variar composiciones.

---

# 52. Hero

Hero split-screen + experimental.

Lado funcional:

- headline;
- copy corto;
- buscador;
- CTA.

Lado visual:

- cards flotantes;
- mentores;
- badges;
- porcentajes de match;
- conexiones;
- pequeños indicadores.

Debe transmitir:

**personas + trayectorias + conexión + movimiento.**

---

# 53. Concepto visual

NEXO debe sentirse:

**editorial + digital + joven + premium + experimental**

Personalidad:

1. joven, energética y dinámica;
2. cercana y humana;
3. premium/minimalista como base.

Evitar:

- SaaS corporativo genérico;
- look bancario;
- estética infantil;
- interfaz excesivamente futurista;
- glassmorphism constante.

---

# 54. Lenguaje visual

Usar:

- grandes titulares;
- whitespace generoso;
- composición asimétrica;
- grids editoriales;
- Bento UI selectivo;
- fotografía protagonista;
- cards grandes;
- superficies redondeadas;
- gradientes atmosféricos;
- pequeños elementos gráficos;
- layouts con ritmo visual.

No centrar absolutamente todo.

## 54.1 Visual Reference Images

The directory `/design-references/` contains the original visual references selected for NEXO.

These images are mandatory references for understanding the intended visual direction of the project.

They are NOT templates and must NOT be copied literally.

Before implementing, redesigning, or polishing major visual areas of the application — especially the homepage, marketplace, mentor cards, mentor profile, public pages, responsive layouts and motion system — inspect all images inside `/design-references/`.

Analyze the references as a COLLECTION rather than treating each image independently.

Extract the recurring visual principles related to:

- typography and type scale;
- visual hierarchy;
- spacing and whitespace;
- grid systems;
- asymmetrical composition;
- proportion and scale;
- card geometry;
- border radius;
- surface treatment;
- photography placement;
- image-to-text relationships;
- color distribution;
- gradients;
- contrast;
- buttons;
- badges;
- navigation;
- section rhythm;
- information density;
- editorial layouts;
- Bento-style compositions;
- responsive behavior;
- opportunities for programmed motion and microinteractions.

The references should inform the visual sensitivity of NEXO.

Do NOT reproduce:

- exact layouts;
- brand identities;
- logos;
- text;
- illustrations;
- distinctive compositions one-to-one;
- proprietary graphic elements.

Instead, combine the recurring principles found across the references with the NEXO product requirements to create an ORIGINAL interface.

### Visual characteristics extracted from the references

NEXO should strongly reflect the following characteristics:

- large contemporary typography;
- strong hierarchy between headlines and supporting text;
- generous whitespace;
- controlled asymmetry;
- modular editorial layouts;
- selective Bento-style grids;
- large photography-led surfaces;
- variable card sizes instead of repetitive identical grids;
- strong image cropping and intentional photography placement;
- clean neutral backgrounds contrasted with high-impact color moments;
- violet, lavender, blue and cool-toned gradients;
- occasional electric accent colors used sparingly;
- rounded large surfaces combined with open, borderless sections;
- minimal and soft shadows;
- compact pills and badges;
- strong visual rhythm between dense and spacious sections;
- clear separation between editorial public pages and functional application interfaces;
- visual compositions that suggest motion even before animation is added.

### Important visual exclusions

Do NOT make NEXO look like:

- a generic SaaS template;
- a banking product;
- a generic AI startup landing page;
- a corporate HR platform;
- a traditional marketplace;
- a childish application;
- a copy of any individual reference.

Avoid:

- centering every section;
- identical card grids throughout the site;
- excessive glassmorphism;
- excessive gradients;
- excessive rounded containers;
- excessive decorative shapes;
- heavy shadows;
- tiny typography;
- random color use;
- overloading mentor cards with metadata;
- repeating the same section composition throughout the homepage.

### Relationship between written requirements and references

`NEXO_MASTER_REQUIREMENTS.md` remains the source of truth for:

- functionality;
- architecture;
- product behavior;
- scope;
- technology;
- accessibility;
- performance.

`/design-references/` is the primary supporting reference for:

- visual mood;
- composition;
- scale;
- spacing;
- editorial sensitivity;
- visual hierarchy;
- color balance;
- interaction opportunities.

When the written functional requirements and a visual reference appear to conflict, preserve the functional requirements while adapting the visual idea rather than copying it.

---

# 55. Concepto gráfico de marca

La identidad puede usar:

- nodos;
- conexiones;
- caminos;
- intersecciones;
- puntos.

Pero de manera abstracta.

Evitar iconografía literal de cadena/enlace.

---

# 56. Logo

Crear un símbolo simple y estático.

Características:

- forma abstracta;
- inspiración en conexión y movimiento;
- esconder sutilmente una `N`;
- funcionar sin wordmark;
- funcionar como favicon;
- funcionar en sidebar;
- funcionar monocromático;
- funcionar light/dark.

No animar el logo.

Crear SVG limpio.

---

# 57. Tipografía

Usar una combinación editorial contemporánea.

### Primaria

Sans serif moderna / neo-grotesca.

Debe ocupar aproximadamente 85–90% de la interfaz.

Preferencia:

**Manrope**, o equivalente si existe una razón técnica clara.

### Acento

Serif/display editorial.

Preferencia:

**Instrument Serif**, o equivalente.

Utilizar solamente en:

- palabras de hero;
- headings especiales;
- momentos editoriales.

Nunca en formularios o controles críticos.

Headlines:

- tracking cerrado;
- line-height compacto;
- tamaños grandes.

---

# 58. Paleta

Base propuesta:

```text
Nexo Violet       #5B4BFF
Electric Indigo   #4938E8
Soft Lavender     #DCD7FF
Ice Blue          #DDF4FF
Electric Cyan     #63D8FF

Off White         #F8F8F5
Surface           #F1F1F4
Ink               #121214
Muted Text        #66666D

Acid Lime         #D9FF43
```

El lima debe usarse muy poco.

Ejemplos:

- match;
- progreso;
- badge;
- CTA puntual.

---

# 59. Intensidad cromática

La interfaz será predominantemente limpia.

Utilizar 2–3 momentos de alto impacto cromático.

Especialmente:

- hero;
- journey/progreso;
- CTA importante.

No saturar todas las secciones.

---

# 60. Gradientes

Usar con moderación.

Ejemplos:

- lavanda → violeta → azul;
- blanco → lavanda translúcida → violeta;
- violeta → azul profundo.

Especialmente útiles en dark mode y hero.

---

# 61. Light mode

Base:

- off-white;
- blanco;
- lavanda suave;
- texto casi negro;
- violeta protagonista;
- cian secundario.

---

# 62. Dark mode

No invertir simplemente colores.

Usar aproximadamente:

```text
Background     #0C0B12
Surface        #16141F
Surface High   #201D2D
Text           #F7F7F4
Muted          #A7A5AF
```

Ajustar violetas y cian para mantener contraste.

---

# 63. Theme switcher

Implementar light/dark mode real.

Guardar preferencia.

Evitar flash incorrecto de tema durante carga.

---

# 64. Formas

Usar aproximadamente:

```text
Pills             999px
Inputs             14–18px
Cards pequeñas     16–20px
Cards grandes      24–32px
Hero/paneles       28–40px
```

No redondear absolutamente todos los elementos.

Combinar superficies redondeadas con secciones abiertas.

---

# 65. Shadows

Evitar sombras pesadas.

Preferir:

- sombras amplias;
- blur alto;
- opacidad baja;
- bordes translúcidos.

Dark mode:

usar contraste de superficies y borders antes que sombras negras agresivas.

---

# 66. Iconografía

Iconos:

- outline;
- geométricos;
- consistentes;
- 1.5–2px.

Elementos recurrentes posibles:

- ↗
- →
- +
- ✦
- ●

Evitar iconografía decorativa excesiva.

---

# 67. CTA

Dos niveles.

### Funcionales

- Reservar
- Guardar
- Continuar
- Ver disponibilidad

Claridad primero.

### Editoriales

- Encuentra a quien ya recorrió ese camino
- Quiero avanzar
- Ver quién encaja conmigo

Pueden ser más creativos.

Nunca sacrificar comprensión por copy creativo.

---

# 68. Tono de comunicación

Tono:

- cercano;
- joven;
- energético;
- directo;
- frases cortas.

Evitar:

- lenguaje corporativo frío;
- motivación genérica;
- clichés;
- exceso de signos de admiración.

Permitir copy editorial en momentos puntuales del dashboard.

---

# 69. Animaciones

NEXO debe sentirse dinámico.

Las animaciones deben ser PROGRAMADAS.

No usar videos pre-renderizados para simular interactividad.

---

# 70. Estrategia de motion

Usar:

### CSS / Tailwind

Para:

- hover;
- focus;
- botones;
- dropdowns;
- opacity;
- scale;
- pequeñas transiciones;
- cambio de tema;
- microfeedback.

### GSAP + ScrollTrigger

Para:

- hero;
- parallax;
- stagger;
- scroll reveals;
- mask reveals;
- movimiento reactivo al cursor;
- roadmap;
- números;
- secuencias;
- efectos magnéticos;
- transiciones editoriales.

---

# 71. Sistema reutilizable de motion

No dispersar código GSAP en decenas de componentes.

Crear utilidades/directivas.

Ejemplo:

```text
shared/motion/

scroll-reveal.directive.ts
magnetic.directive.ts
parallax.directive.ts
cursor-tilt.directive.ts
stagger.directive.ts
motion.utils.ts
```

---

# 72. Cursor interaction

En desktop público permitir:

- ligera inclinación;
- profundidad;
- parallax del cursor;
- botones magnéticos;
- cards reactivas.

No aplicar en:

- dashboard;
- checkout;
- formularios;
- mobile.

Nunca dificultar clicks.

---

# 73. Scroll animation

Evitar simplemente hacer `fade-in` a todo.

Combinar:

- reveal;
- slide;
- stagger;
- clip;
- mask;
- scale;
- parallax.

Mantener coherencia.

---

# 74. Transiciones entre rutas

Páginas públicas:

permitir transiciones editoriales más notorias.

Dashboard / checkout / formularios:

transiciones cortas y discretas.

Nunca retrasar artificialmente navegación.

---

# 75. Reduced motion

Respetar:

`prefers-reduced-motion`.

Cuando esté activo:

- eliminar parallax;
- eliminar seguimiento de cursor;
- reducir stagger;
- reducir transforms;
- mantener únicamente feedback funcional.

---

# 76. SSR + GSAP

No ejecutar APIs del navegador durante SSR.

Asegurarse de inicializar GSAP únicamente cuando exista DOM/browser.

Evitar:

- `window`;
- `document`;

durante ejecución server-side.

---

# 77. Responsive

Diseñar mobile cuidadosamente.

No hacer únicamente “desktop reducido”.

Desktop:

puede ser experimental.

Mobile:

más funcional.

Reducir:

- elementos flotantes;
- parallax;
- motion complejo;
- densidad.

---

# 78. Mobile patterns

Usar cuando corresponda:

- bottom sheets;
- drawers;
- CTA sticky;
- navegación compacta;
- cards verticales;
- scroll horizontal controlado;
- targets táctiles grandes.

No depender de hover.

---

# 79. Accesibilidad

Priorizar:

- teclado;
- focus visible;
- contraste;
- labels;
- errores claros;
- semantic HTML;
- ARIA solo cuando sea necesario;
- reduced motion.

Objetivo práctico cercano a WCAG AA, sin convertir el proyecto en una auditoría formal.

---

# 80. Estados

Diseñar:

### Loading

Skeletons.

### Empty

Ejemplos:

`Aún no tienes mentorías`

`No encontramos mentores con estos filtros`

### Error

Con recuperación clara.

### Success

Ejemplos:

- Reserva confirmada
- Tarea completada
- Mentor guardado
- Perfil actualizado

Los estados deben mantener identidad NEXO.

---

# 81. SSR / rendering strategy

Priorizar SSR/prerender en:

- homepage;
- explorar mentores;
- perfil del mentor;
- cómo funciona.

Cliente principalmente:

- dashboards;
- checkout;
- progreso;
- configuración.

No forzar SSR donde no aporta.

---

# 82. SEO

Optimizar páginas públicas:

- Inicio
- Explorar
- Perfil mentor
- Cómo funciona

Implementar:

- title;
- meta description;
- canonical cuando corresponda;
- Open Graph básico;
- semantic HTML;
- headings correctos.

No hacer SEO complejo en dashboards.

---

# 83. Performance

Priorizar:

- lazy loading;
- route splitting;
- imágenes responsive;
- formatos modernos;
- dimensiones explícitas;
- font optimization;
- deferred components;
- evitar JavaScript innecesario;
- GSAP controlado;
- skeletons.

Revisar:

- LCP;
- CLS;
- INP.

Especial cuidado con:

- hero;
- fotografías;
- animaciones.

---

# 84. Developer Tools

Configurar:

- ESLint;
- Prettier.

Durante desarrollo utilizar/documentar:

- Angular DevTools;
- Chrome DevTools;
- Lighthouse.

Crear posteriormente en README una sección breve explicando:

- qué se midió;
- qué se optimizó;
- decisiones de performance.

---

# 85. Testing

Testing selectivo.

## Unit tests

Especialmente:

- matching;
- progreso;
- filtros;
- reservas;
- cancelación;
- reprogramación.

## Component tests

Priorizar:

- mentor card;
- onboarding;
- horario;
- tareas/progreso.

## E2E

Solo recorridos importantes:

1. registro + onboarding;
2. buscar + filtrar;
3. reservar;
4. completar tarea + actualizar progreso.

No perseguir cobertura artificial.

---

# 86. Demo mentee

Crear una cuenta/demo con estado intermedio.

Ejemplo conceptual:

- objetivo activo;
- mentor asignado;
- algunas sesiones realizadas;
- próxima sesión;
- tareas completadas y pendientes;
- hitos logrados y pendientes;
- recursos;
- progreso aproximadamente 50–70%.

Debe permitir demostrar inmediatamente el valor del dashboard.

---

# 87. Demo mentor

Crear mentor con actividad intermedia:

- próxima sesión;
- mentees activos;
- seguimientos;
- reserva nueva;
- valoración;
- métricas;
- actividad reciente.

---

# 88. Acceso demo

En login mostrar:

**Entrar como mentee demo**

**Entrar como mentor demo**

Debe ser rápido para recruiters.

Las cuentas demo pueden apoyarse en Supabase Auth real cuando las credenciales/configuración estén disponibles.

Si Supabase todavía no está configurado:

usar un adapter/mock temporal claramente aislado.

---

# 89. Deployment

Target:

**Netlify**

Preparar:

- configuración Angular;
- SSR;
- variables de entorno;
- redirects;
- SPA/SSR routing según corresponda.

El proyecto debe poder desplegarse en Netlify.

---

# 90. Variables de entorno

Crear:

`.env.example`

o mecanismo equivalente.

Documentar exactamente qué necesita el desarrollador.

No escribir credenciales reales.

---

# 91. README

Crear README tipo case study técnico.

Debe incluir:

- problema;
- solución;
- propuesta de valor;
- screenshots;
- funcionalidades;
- stack;
- arquitectura;
- rutas;
- modelo de datos;
- funcionalidades reales;
- funcionalidades simuladas;
- matching;
- SSR;
- responsive;
- accessibility;
- performance;
- testing;
- instalación;
- configuración Supabase;
- deploy;
- decisiones importantes;
- roadmap futuro.

Debe ser visual y fácil de escanear.

---

# 92. Funcionalidades reales vs simuladas

## Reales

- Angular app
- responsive
- navegación
- light/dark
- Auth
- perfil
- filtros
- matching local
- favoritos
- booking
- disponibilidad
- objetivos
- hitos
- tareas
- progreso
- datos persistentes
- reviews básicos

## Simuladas pero interactivas

- checkout;
- pago;
- videollamada;
- algunas notificaciones;
- explicación “inteligente” de matching.

## Mock solamente

- ingresos;
- verificación profesional;
- analíticas avanzadas.

---

# 93. No overengineering

No implementar soluciones complejas si una solución clara y mantenible cumple el objetivo.

Evitar:

- state management global innecesario;
- microfrontends;
- capas abstractas sin utilidad;
- dependencias grandes para tareas pequeñas;
- premature optimization;
- arquitecturas empresariales artificiales.

---

# 94. Estado de aplicación

Preferir:

- Signals;
- servicios;
- estado local por feature.

No añadir NgRx salvo que aparezca una necesidad real y documentada.

---

# 95. Principios visuales obligatorios

El resultado NO debe parecer una plantilla genérica.

Mantener:

- fotografía dominante;
- tipografía grande;
- composición editorial;
- espacios generosos;
- asimetría controlada;
- cards modulares;
- color frío;
- violetas/lavanda;
- motion;
- personalidad.

Al mismo tiempo:

- dashboard funcional;
- checkout claro;
- calendario claro;
- formularios simples.

---

# 96. Prioridad de implementación

Implementar aproximadamente en este orden:

## Fase 0 — Bootstrap

- crear Angular;
- TypeScript;
- Tailwind;
- PostCSS;
- SSR;
- lint;
- formatting;
- testing;
- GSAP;
- Supabase client;
- environment config.

## Fase 1 — Foundations

- arquitectura;
- routing;
- layouts;
- design tokens;
- typography;
- light/dark;
- UI primitives;
- motion primitives.

## Fase 2 — Mock data

- models;
- 18 mentors;
- categories;
- mentorship types;
- objectives;
- reviews;
- seed/demo data.

## Fase 3 — Public experience

- home;
- hero;
- categories;
- featured mentors;
- how it works;
- navigation;
- responsive;
- motion.

## Fase 4 — Marketplace

- explore;
- filters;
- search;
- matching;
- recommendations;
- mentor card;
- saved mentor.

## Fase 5 — Mentor profile

- hero;
- timeline;
- journey;
- mentorships;
- reviews;
- availability;
- sticky booking.

## Fase 6 — Auth

- Supabase;
- register;
- login;
- roles;
- guards;
- onboarding.

## Fase 7 — Booking

- slots;
- booking;
- form;
- checkout;
- confirmation;
- cancellation;
- reschedule.

## Fase 8 — Mentee

- dashboard;
- session detail;
- workspace;
- goals;
- tasks;
- milestones;
- progress.

## Fase 9 — Mentor

- dashboard;
- mentees;
- follow-ups;
- availability;
- mentorship management.

## Mandatory Visual Audit — Before Phase 10

Before starting Phase 10:

1. Finish Phases 7, 8 and 9 without discarding correct functionality.
2. Re-read the visual requirements in this document.
3. Inspect every image inside `/design-references/`.
4. Compare the current implementation against the intended NEXO visual language.
5. Identify visual deviations before changing code.
6. Correct global foundations first:
   - typography;
   - type scale;
   - design tokens;
   - colors;
   - spacing;
   - border radii;
   - surfaces;
   - buttons;
   - cards;
   - badges;
   - layout primitives.
7. Then adjust individual public pages and components where necessary.
8. Preserve all correct functionality.
9. Do NOT restart or rebuild the application from scratch.
10. Validate both desktop and mobile.
11. Only after this audit is complete, continue with Phase 10.

Update `NEXO_TASKS.md` to include this visual audit as a mandatory checkpoint.

## Fase 10 — Polish

- loading;
- errors;
- empty;
- success;
- mobile;
- accessibility;
- animations;
- route transitions.

## Fase 11 — Quality

- unit tests;
- component tests;
- E2E;
- performance;
- Lighthouse;
- SEO.

## Fase 12 — Delivery

- Netlify;
- README;
- env example;
- final verification.

---

# 97. Proceso autónomo

Después de crear `NEXO_TASKS.md`:

trabaja sobre la primera tarea incompleta.

Al terminar:

1. marca la tarea;
2. ejecuta validación;
3. corrige errores;
4. registra decisiones importantes;
5. continúa con la siguiente.

No esperes mensajes del usuario entre tareas salvo que sea estrictamente necesario.

---

# 98. Calidad del código

Priorizar:

- nombres claros;
- tipos estrictos;
- componentes pequeños;
- funciones puras cuando corresponda;
- reutilización razonable;
- semántica;
- accessibility;
- comentarios solo donde aportan contexto.

No comentar código obvio.

Evitar `any` salvo necesidad justificada.

---

# 99. Manejo de errores

No ignorar errores silenciosamente.

Proporcionar:

- feedback visual;
- logging razonable en desarrollo;
- errores recuperables;
- fallback de UI.

No mostrar errores técnicos crudos al usuario.

---

# 100. Criterios de finalización

NEXO se considera funcional cuando un usuario puede:

### Mentee

1. entrar;
2. registrarse;
3. completar onboarding;
4. buscar un objetivo;
5. ver recomendaciones;
6. filtrar;
7. abrir un mentor;
8. guardar mentor;
9. reservar;
10. ver reserva en dashboard;
11. entrar a una mentoría;
12. revisar tareas;
13. completar tareas;
14. ver progreso actualizado.

### Mentor

1. iniciar sesión;
2. ver dashboard;
3. ver próxima sesión;
4. ver mentees;
5. gestionar disponibilidad;
6. gestionar mentorías;
7. revisar progreso;
8. añadir seguimiento.

Además:

- funciona mobile;
- funciona desktop;
- light/dark;
- SSR no falla;
- build limpio;
- no hay errores críticos de consola;
- tests críticos pasan;
- navegación funciona;
- Netlify es desplegable.

---

# 101. Regla final

No conviertas NEXO en un proyecto gigantesco.

Debe demostrar **profundidad, no cantidad de tecnologías**.

La prioridad es construir un producto frontend convincente que demuestre:

- Angular moderno;
- TypeScript;
- arquitectura;
- SSR;
- UI/UX;
- responsive;
- motion;
- Auth;
- SQL/Supabase;
- consumo y abstracción de datos;
- testing;
- performance;
- Developer Tools;
- accesibilidad;
- criterio de producto.

Si una funcionalidad secundaria amenaza el alcance, simplifícala.

No simplifiques el recorrido principal.

Empieza por planificar, después implementa y continúa automáticamente hasta completar el backlog razonablemente posible.