import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../shared/motion/scroll-reveal.directive';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  template: `
    <!-- ====== HERO ====== -->
    <section class="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-1/3 -left-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-soft-lavender/50 via-nexo-violet/15 to-transparent blur-3xl opacity-50 dark:opacity-20"></div>
      </div>

      <div class="container-editorial">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan mb-4">El proceso</p>
          <h1 class="font-serif text-display-sm md:text-display-md lg:text-display-lg text-ink dark:text-dark-text leading-[1.05] mb-6">
            Cómo funciona
            <span class="text-gradient italic">NEXO</span>
          </h1>
          <p class="text-lg md:text-xl text-muted-text dark:text-dark-muted max-w-xl leading-relaxed">
            Tres pasos simples para conectar con alguien que ya recorrió el camino que tú estás empezando. Sin intermediarios, sin burocracia.
          </p>
        </div>
      </div>
    </section>

    <!-- ====== STEP 1 ====== -->
    <section class="section-editorial" scrollReveal>
      <div class="container-editorial">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div class="lg:col-span-5 order-2 lg:order-1">
            <!-- The step number and the icon used to sit on top of each other,
                 the numeral absolutely positioned over the centred icon. Now the
                 numeral reads as a label at the top, an oversized ghost copy acts
                 as texture in the corner, and the icon anchors the bottom. -->
            <div class="step-visual relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-card-xl bg-gradient-to-br from-nexo-violet to-electric-indigo p-8 md:p-10">
              <span
                class="pointer-events-none absolute -bottom-10 -right-3 font-serif text-[12rem] leading-none text-white/[0.08] select-none"
                aria-hidden="true"
                >01</span
              >
              <span class="relative z-10 font-serif text-4xl leading-none text-white/70">01</span>
              <div class="relative z-10 flex items-center gap-4">
                <div class="step-visual__icon flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-card-sm bg-white/20 backdrop-blur-sm">
                  <svg class="text-white" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <p class="text-base font-semibold text-white">Búsqueda inteligente</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-nexo-violet/10 flex items-center justify-center font-serif text-lg text-nexo-violet font-bold">1</span>
              <h2 class="text-heading-lg font-bold text-ink dark:text-dark-text">Descubre tu camino</h2>
            </div>
            <p class="text-muted-text dark:text-dark-muted text-lg leading-relaxed max-w-lg">
              Explora mentores por categoría, trayectoria o especialidad. NEXO analiza tu objetivo y te muestra a los mentores que mejor se alinean con lo que necesitas.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-nexo-violet w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Explora 7 categorías de mentoría</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-nexo-violet w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Filtra por experiencia, precio y disponibilidad</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-nexo-violet w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Matching inteligente por trayectoria y compatibilidad</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== STEP 2 ====== -->
    <section class="section-editorial bg-surface/50 dark:bg-dark-surface/50" scrollReveal>
      <div class="container-editorial">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div class="lg:col-span-7 space-y-6">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-electric-cyan/10 flex items-center justify-center font-serif text-lg text-electric-cyan font-bold">2</span>
              <h2 class="text-heading-lg font-bold text-ink dark:text-dark-text">Conecta directamente</h2>
            </div>
            <p class="text-muted-text dark:text-dark-muted text-lg leading-relaxed max-w-lg">
              Agenda una sesión con el mentor que elijas. Sin intermediarios, sin burocracia. Una conversación real con alguien que vivió lo que tú estás viviendo ahora.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-electric-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-electric-cyan w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Elige el formato: virtual, presencial o híbrido</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-electric-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-electric-cyan w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Agenda flexible según tu disponibilidad</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-electric-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-electric-cyan w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Sesiones individuales o grupales desde S/. 80</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5">
            <div class="step-visual relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-card-xl border border-electric-cyan/20 bg-gradient-to-br from-electric-cyan/20 to-ice-blue/30 p-8 dark:border-dark-surface-high dark:from-dark-surface dark:to-dark-surface-high md:p-10">
              <span
                class="pointer-events-none absolute -bottom-10 -right-3 font-serif text-[12rem] leading-none text-electric-indigo/[0.07] select-none dark:text-electric-cyan/[0.07]"
                aria-hidden="true"
                >02</span
              >
              <span class="relative z-10 font-serif text-4xl leading-none text-electric-indigo/60 dark:text-electric-cyan/70">02</span>
              <div class="relative z-10 flex items-center gap-4">
                <div class="step-visual__icon flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-card-sm bg-white/70 dark:bg-electric-cyan/10">
                  <svg class="text-electric-indigo dark:text-electric-cyan" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <p class="text-base font-semibold text-ink dark:text-dark-text">Agenda directa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== STEP 3 ====== -->
    <section class="section-editorial" scrollReveal>
      <div class="container-editorial">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <div class="lg:col-span-5 order-2 lg:order-1">
            <div class="step-visual relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-card-xl bg-gradient-to-br from-ink to-dark-surface p-8 dark:from-dark-bg dark:to-dark-surface md:p-10">
              <span
                class="pointer-events-none absolute -bottom-10 -right-3 font-serif text-[12rem] leading-none text-acid-lime/[0.09] select-none"
                aria-hidden="true"
                >03</span
              >
              <span class="relative z-10 font-serif text-4xl leading-none text-white/60">03</span>
              <div class="relative z-10 flex items-center gap-4">
                <div class="step-visual__icon flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-card-sm bg-acid-lime/15">
                  <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20V10"/>
                    <path d="M18 20V4"/>
                    <path d="M6 20v-4"/>
                  </svg>
                </div>
                <p class="text-base font-semibold text-white">Progreso continuo</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div class="flex items-center gap-3">
              <span class="w-10 h-10 rounded-full bg-acid-lime/15 flex items-center justify-center font-serif text-lg text-ink dark:text-dark-text font-bold">3</span>
              <h2 class="text-heading-lg font-bold text-ink dark:text-dark-text">Avanza con rumbo</h2>
            </div>
            <p class="text-muted-text dark:text-dark-muted text-lg leading-relaxed max-w-lg">
              Después de cada sesión, registra tu progreso. NEXO no termina cuando acaba la mentoría. Sigue con sesiones de seguimiento y vuelve a conectarte con tu mentor cuando lo necesites.
            </p>
            <div class="space-y-3 pt-2">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-acid-lime/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-ink dark:text-dark-text w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Registra cada sesión y cada avance en tu panel</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-acid-lime/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-ink dark:text-dark-text w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Agenda sesiones de seguimiento cuando las necesites</p>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-acid-lime/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-ink dark:text-dark-text w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p class="text-sm text-ink dark:text-dark-text">Historial de progreso para medir tu crecimiento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== CTA ====== -->
    <section class="section-editorial bg-ink dark:bg-dark-bg" scrollReveal>
      <div class="container-editorial text-center">
        <div class="max-w-2xl mx-auto space-y-6">
          <h2 class="font-serif text-display-sm md:text-heading-lg text-white leading-tight">
            ¿Listo para empezar?
          </h2>
          <p class="text-lg text-dark-muted max-w-lg mx-auto leading-relaxed">
            Explora nuestros mentores y encuentra a alguien que ya recorrió el camino que tú quieres seguir.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a routerLink="/explorar" class="btn-primary btn-lg">
              Explorar mentores
            </a>
            <a routerLink="/" class="btn-ghost btn-lg text-white hover:bg-white/10 hover:text-white">
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* The visual panel reacts as a whole: its icon lifts slightly when the
         panel is hovered, which keeps the step feeling alive without animating
         the illustration itself. */
      .step-visual__icon {
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .step-visual:hover .step-visual__icon {
        transform: translateY(-4px) scale(1.05);
      }

      @media (prefers-reduced-motion: reduce) {
        .step-visual__icon,
        .step-visual:hover .step-visual__icon {
          transition: none;
          transform: none;
        }
      }
    `,
  ],
})
export class HowItWorksComponent {}
