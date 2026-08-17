import { Component, signal, inject, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorService } from '../../core/services/mentor.service';
import { CATEGORIES } from '../../core/models/category.model';
import { AvatarComponent } from '../../shared/ui/avatar.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ScrollRevealDirective } from '../../shared/motion/scroll-reveal.directive';
import { StaggerDirective } from '../../shared/motion/stagger.directive';
import { MagneticDirective } from '../../shared/motion/magnetic.directive';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    AvatarComponent,
    BadgeComponent,
    ScrollRevealDirective,
    StaggerDirective,
    MagneticDirective,
  ],
  template: `
    <!-- ====== HERO ======
         Composition reinterpreted from design-references/ref-02: a stacked,
         centred layout whose visual scene is an ecosystem orbiting a single
         nucleus. There the nucleus is a CTA button; here it is the real search
         field, because that is where the visitor states where they want to go. -->
    <section class="hero relative overflow-hidden pb-14 pt-24 md:pb-20 md:pt-20">
      <!-- Atmosphere: light at the top, deepening into violet behind the scene.
           No black, no neon — the wash fades back into the page. -->
      <div class="hero__sky" aria-hidden="true"></div>

      <div class="container-editorial relative">
        <!-- Copy block -->
        <div class="mx-auto max-w-3xl text-center">
          <p class="text-sm font-semibold uppercase tracking-widest text-nexo-violet dark:text-electric-cyan">
            Mentoría real, personas reales
          </p>
          <h1 class="mt-4 font-serif text-display-sm text-ink dark:text-dark-text md:text-display-md lg:text-display-lg">
            Encuentra a quien
            <em class="not-italic font-serif italic text-nexo-violet dark:text-electric-cyan">ya recorrió</em>
            ese camino
          </h1>
          <p class="mx-auto mt-4 max-w-xl text-lg text-muted-text dark:text-dark-muted md:text-xl">
            Cuéntanos hacia dónde quieres ir y descubre a quién puede ayudarte a llegar.
          </p>
        </div>

        <!-- ===== Ecosystem scene ===== -->
        <div class="hero-scene" [class.is-searching]="searchFocused()">
          <!-- Concentric tracks. Rounded rectangles that repeat the silhouette of
               the search pill, so the orbits belong to the nucleus rather than
               floating behind it. Decorative only. -->
          <div class="hero-scene__tracks" aria-hidden="true">
            <span class="hero-track hero-track--1"></span>
            <span class="hero-track hero-track--2"></span>
            <span class="hero-track hero-track--3"></span>
          </div>

          <!-- Mentors orbiting the nucleus -->
          @for (m of sceneMentors(); track m.mentor.id; let i = $index) {
            <a
              [routerLink]="['/mentor', m.mentor.id]"
              class="hero-orb group"
              [class]="m.place + ' ' + m.size + ' ' + m.drift"
              [style.--orb-delay]="m.delay"
            >
              <span class="hero-orb__ring">
                <img
                  [src]="m.mentor.photo"
                  [alt]="m.mentor.name"
                  class="hero-orb__img"
                  loading="lazy"
                  width="240"
                  height="240"
                />
              </span>
              <!-- Identity appears on demand; the resting scene stays photographic -->
              <span class="hero-orb__tag">
                <span class="block font-semibold">{{ m.mentor.name }}</span>
                <span class="block text-[11px] opacity-80">
                  {{ m.mentor.specialties[0] }} · ★ {{ m.mentor.rating }}
                </span>
              </span>
            </a>
          }

          <!-- Two quiet discipline chips: they close the horizontal balance the
               way the small badges do in the reference, but carry real meaning. -->
          <a
            routerLink="/explorar"
            [queryParams]="{ category: 'tecnologia' }"
            class="hero-chip hero-chip--left"
          >
            Tecnología
          </a>
          <a
            routerLink="/explorar"
            [queryParams]="{ category: 'liderazgo' }"
            class="hero-chip hero-chip--right"
          >
            Liderazgo
          </a>

          <!-- Nucleus: the real search -->
          <div class="hero-core">
            <label for="hero-search" class="sr-only">¿Qué quieres aprender?</label>
            <svg
              class="hero-core__icon"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="hero-search"
              type="text"
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              (keydown.enter)="navigateToSearch()"
              (focus)="searchFocused.set(true)"
              (blur)="searchFocused.set(false)"
              placeholder="¿Qué quieres aprender? Angular, liderazgo, emprendimiento..."
              class="hero-core__input"
            />
            <button (click)="navigateToSearch()" class="hero-core__go" aria-label="Buscar mentores">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer line under the scene -->
        <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
          <div class="flex items-center gap-2">
            <div class="flex -space-x-2">
              @for (m of featuredMentors(); track m.id; let i = $index) {
                @if (i < 3) {
                  <nx-avatar [src]="m.photo" [name]="m.name" size="sm" />
                }
              }
            </div>
            <span class="text-sm text-muted-text dark:text-dark-muted">
              {{ featuredMentors().length }}+ mentores disponibles
            </span>
          </div>
          <div class="flex items-center gap-5">
            <a routerLink="/explorar" class="text-sm font-semibold text-nexo-violet hover:underline underline-offset-4 dark:text-electric-cyan">
              Explorar mentores
            </a>
            <a routerLink="/como-funciona" class="text-sm font-medium text-muted-text hover:text-ink dark:text-dark-muted dark:hover:text-dark-text">
              Cómo funciona
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== FEATURED MENTORS ====== -->
    <section class="section-editorial" scrollReveal variant="clip" direction="right">
      <div class="container-editorial">
        <div class="flex items-end justify-between mb-12">
          <div class="max-w-md">
            <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan mb-3">Los mejores del momento</p>
            <h2 class="font-serif text-display-sm md:text-heading-lg text-ink dark:text-dark-text">
              Mentores destacados
            </h2>
          </div>
          <a routerLink="/explorar" class="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-nexo-violet dark:text-electric-cyan hover:underline underline-offset-4">
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Horizontal scroll container -->
      <div class="overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div class="flex gap-6 pb-4 sm:justify-center lg:justify-start lg:container-editorial lg:px-8">
          @for (mentor of featuredMentors(); track mentor.id; let i = $index) {
            <a
              [routerLink]="['/mentor', mentor.id]"
              class="mentor-tile flex-shrink-0 w-[300px] sm:w-[320px] card-editorial group cursor-pointer"
            >
              <div class="relative h-52 overflow-hidden bg-gradient-to-br from-soft-lavender/40 to-ice-blue/30 dark:from-dark-surface-high dark:to-dark-surface">
                <img
                  [src]="mentor.photo"
                  [alt]="mentor.name"
                  class="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                  loading="lazy"
                />
                <!-- Scrim under the badge: a translucent violet pill washed out
                     against the photograph and the label became unreadable. -->
                <div class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-ink/45 to-transparent opacity-90"></div>
                <span class="absolute top-3 left-3 rounded-pill bg-white/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-soft-sm backdrop-blur-sm dark:bg-dark-surface/95 dark:text-dark-text">
                  {{ getCategoryName(mentor.category) }}
                </span>
                <!-- Affordance: appears on hover to say the whole tile is a link -->
                <span
                  class="absolute right-3 top-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-nexo-violet text-white opacity-0 shadow-soft-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </span>
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <h3 class="font-semibold text-ink dark:text-dark-text truncate">{{ mentor.name }}</h3>
                    <p class="text-sm text-muted-text dark:text-dark-muted truncate mt-0.5">{{ mentor.title }}</p>
                  </div>
                  <div class="flex items-center gap-1 flex-shrink-0">
                    <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    <span class="text-sm font-semibold text-ink dark:text-dark-text">{{ mentor.rating }}</span>
                  </div>
                </div>
                <div class="flex flex-wrap gap-1.5 mt-3">
                  @for (badge of mentor.badges.slice(0, 2); track badge.id) {
                    <nx-badge variant="lavender" size="sm">{{ badge.name }}</nx-badge>
                  }
                </div>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-surface dark:border-dark-surface-high">
                  <span class="text-sm font-semibold text-nexo-violet">S/. {{ mentor.price }}/sesión</span>
                  <span class="text-xs text-muted-text dark:text-dark-muted">{{ mentor.mentorships }} mentorías</span>
                </div>
              </div>
            </a>
          }
        </div>
      </div>

      <div class="sm:hidden mt-6 text-center">
        <a routerLink="/explorar" class="inline-flex items-center gap-2 text-sm font-semibold text-nexo-violet">
          Ver todos los mentores
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </section>

    <!-- ====== CATEGORIES - ASYMMETRIC BENTO ====== -->
    <section class="section-editorial bg-surface/50 dark:bg-dark-surface/50" scrollReveal variant="clip" direction="up">
      <div class="container-editorial">
        <div class="max-w-lg mb-14">
          <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan mb-3">Por disciplina</p>
          <h2 class="font-serif text-display-sm md:text-heading-lg text-ink dark:text-dark-text">
            Explora por categoría
          </h2>
        </div>

        <!-- Category showcase.
             This replaced a seven-rectangle bento. Instead of showing every
             category at once and asking the reader to scan, one category is
             *presented* at a time: a tab strip drives a single panel that
             changes accent, copy, specialities and real mentor portraits. -->
        <div class="mt-10">
          <!-- Level 1: editorial tab strip -->
          <div
            role="tablist"
            aria-label="Categorías de mentoría"
            class="cat-strip -mx-4 flex gap-7 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0"
            (keydown)="onCategoryKeydown($event)"
          >
            @for (cat of showcaseCategories; track cat.slug; let i = $index) {
              <button
                type="button"
                role="tab"
                [id]="'cat-tab-' + cat.slug"
                [attr.aria-selected]="activeCategoryIndex() === i"
                [attr.tabindex]="activeCategoryIndex() === i ? 0 : -1"
                [attr.aria-controls]="'cat-panel'"
                class="cat-tab flex-shrink-0 whitespace-nowrap pb-1 text-lg transition-colors duration-300 sm:text-xl"
                [class.cat-tab--active]="activeCategoryIndex() === i"
                (click)="setCategory(i)"
                (mouseenter)="setCategory(i)"
                (focus)="setCategory(i)"
              >
                {{ cat.name }}
              </button>
            }
          </div>

          <!-- Level 2: the panel -->
          @if (activeCategory(); as cat) {
            <div
              id="cat-panel"
              role="tabpanel"
              [attr.aria-labelledby]="'cat-tab-' + cat.slug"
              class="cat-panel relative mt-8 overflow-hidden rounded-card-xl p-6 sm:p-8 md:p-12"
              [class]="cat.surface"
            >
              <!-- Accent wash, repositioned per category -->
              <span class="cat-panel__wash" [class]="cat.wash" aria-hidden="true"></span>

              <div class="relative z-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
                <!-- Copy -->
                <div class="lg:col-span-7">
                  <p class="mb-4 font-mono text-xs font-semibold tracking-widest" [class]="cat.kicker">
                    {{ padIndex(activeCategoryIndex() + 1) }} / {{ padIndex(showcaseCategories.length) }}
                  </p>

                  <h3 class="cat-panel__title font-serif text-display-sm md:text-display-md" [class]="cat.titleTone">
                    {{ cat.name }}
                  </h3>

                  <p class="cat-panel__lede mt-4 max-w-lg text-lg leading-relaxed" [class]="cat.bodyTone">
                    {{ cat.promise }}
                  </p>

                  <ul class="cat-panel__specs mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm" [class]="cat.bodyTone">
                    @for (spec of cat.specialties; track spec; let last = $last) {
                      <li class="flex items-center gap-3">
                        <span>{{ spec }}</span>
                        @if (!last) {
                          <span class="opacity-40" aria-hidden="true">·</span>
                        }
                      </li>
                    }
                  </ul>

                  <div class="mt-8 flex flex-wrap items-center gap-5">
                    <span class="inline-flex items-center gap-2 text-sm font-semibold" [class]="cat.bodyTone">
                      <span class="h-1.5 w-1.5 rounded-full" [class]="cat.dot"></span>
                      <span class="cat-panel__count">{{ categoryMentors().length }}</span>
                      {{ categoryMentors().length === 1 ? 'mentor' : 'mentores' }}
                    </span>

                    <a
                      routerLink="/explorar"
                      [queryParams]="{ category: cat.slug }"
                      class="cat-panel__cta group inline-flex items-center gap-2 rounded-pill px-5 py-2.5 text-sm font-semibold transition-all duration-300"
                      [class]="cat.cta"
                    >
                      Explorar {{ cat.name.toLowerCase() }}
                      <svg
                        class="transition-transform duration-300 group-hover:translate-x-1"
                        width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                      </svg>
                    </a>
                  </div>
                </div>

                <!-- Real portraits of mentors in this category -->
                <div class="lg:col-span-5">
                  <div class="cat-panel__faces flex items-end justify-start gap-3 lg:justify-end">
                    @for (mentor of categoryMentors().slice(0, 3); track mentor.id; let i = $index) {
                      <a
                        [routerLink]="['/mentor', mentor.id]"
                        class="cat-face group relative block overflow-hidden rounded-card-lg bg-surface shadow-soft-lg dark:bg-dark-surface-high"
                        [class]="i === 0
                          ? 'h-[150px] w-[104px] sm:h-[190px] sm:w-[132px] md:h-[250px] md:w-[176px]'
                          : 'h-[124px] w-[86px] sm:h-[156px] sm:w-[108px] md:h-[196px] md:w-[138px]'"
                        [attr.aria-label]="'Ver perfil de ' + mentor.name"
                      >
                        <img
                          [src]="mentor.photo"
                          [alt]="mentor.name"
                          class="cat-face__img h-full w-full object-cover object-top"
                          loading="lazy"
                          width="352"
                          height="500"
                        />
                        <span class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink/85 to-transparent"></span>
                        <span class="absolute bottom-2 left-2.5 right-2 truncate text-xs font-semibold text-white">
                          {{ mentor.name.split(' ')[0] }}
                        </span>
                      </a>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ====== CÓMO FUNCIONA ====== -->
    <section class="section-editorial" scrollReveal variant="clip" direction="left">
      <div class="container-editorial">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <!-- Left sticky header -->
          <div class="lg:col-span-4 lg:sticky lg:top-28">
            <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan mb-3">Simple y directo</p>
            <h2 class="font-serif text-display-sm md:text-heading-lg text-ink dark:text-dark-text mb-6">
              Cómo funciona NEXO
            </h2>
            <p class="text-muted-text dark:text-dark-muted leading-relaxed">
              Tres pasos para conectar con alguien que ya recorrió el camino que tú estás empezando.
            </p>
            <a routerLink="/como-funciona" class="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-nexo-violet dark:text-electric-cyan hover:underline underline-offset-4">
              Ver detalles completos
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>

          <!-- Right steps.
               One template over a data array instead of three near-identical
               blocks. A rail connects them so the three read as a sequence, and
               the hovered step raises itself out of the stack. -->
          <div class="lg:col-span-8">
            <ol class="steps relative space-y-5" staggerChildren [delay]="0.12">
              <span class="steps__rail" aria-hidden="true"></span>

              @for (step of steps; track step.number) {
                <li
                  class="step-card group relative rounded-card-lg border border-surface bg-white p-7 md:p-9 dark:border-dark-surface-high dark:bg-dark-surface"
                >
                  <div class="flex items-start gap-5 md:gap-6">
                    <div class="relative z-10 flex-shrink-0">
                      <div
                        class="step-card__badge flex h-14 w-14 items-center justify-center rounded-card-sm"
                        [class]="step.tone"
                      >
                        <span class="font-serif text-2xl leading-none">{{ step.number }}</span>
                      </div>
                    </div>

                    <div class="min-w-0">
                      <h3 class="text-heading-md font-semibold text-ink dark:text-dark-text mb-2">{{ step.title }}</h3>
                      <p class="leading-relaxed text-muted-text dark:text-dark-muted">{{ step.body }}</p>
                      <div class="mt-4 flex flex-wrap gap-2">
                        @for (tag of step.tags; track tag) {
                          <span class="step-card__tag rounded-pill bg-surface px-3 py-1 text-xs font-medium text-muted-text dark:bg-dark-surface-high dark:text-dark-muted">
                            {{ tag }}
                          </span>
                        }
                      </div>
                    </div>
                  </div>
                </li>
              }
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== NEXO NO TERMINA - FOLLOW UP ====== -->
    <section class="section-editorial bg-ink dark:bg-dark-bg relative overflow-hidden" scrollReveal variant="scale">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-nexo-violet/10 blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-electric-cyan/5 blur-3xl"></div>
      </div>

      <div class="container-editorial">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan mb-3">Más allá de la sesión</p>
            <h2 class="font-serif text-display-sm md:text-heading-lg text-white mb-6 leading-tight">
              NEXO no termina cuando acaba la mentoría
            </h2>
            <p class="text-dark-muted text-lg leading-relaxed mb-8 max-w-lg">
              La mentoría es el punto de partida. NEXO te acompaña con seguimiento, historial de progreso y la posibilidad de volver a conectarte con tu mentor cuando lo necesites.
            </p>
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-8 h-8 rounded-full bg-nexo-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-nexo-violet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-white text-sm">Registro de progreso</p>
                  <p class="text-dark-muted text-sm mt-0.5">Documenta cada sesión, cada avance, cada aprendizaje</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-8 h-8 rounded-full bg-nexo-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-nexo-violet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-white text-sm">Sesiones de seguimiento</p>
                  <p class="text-dark-muted text-sm mt-0.5">Reagenda con tu mentor en cualquier momento</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="w-8 h-8 rounded-full bg-nexo-violet/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="text-nexo-violet" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-white text-sm">Comunidad de mentores</p>
                  <p class="text-dark-muted text-sm mt-0.5">Conoce otros mentores con trayectorias similares</p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="rounded-card-xl bg-dark-surface border border-dark-surface-high p-8 md:p-10">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-nexo-violet to-electric-indigo flex items-center justify-center">
                  <svg class="text-white" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20V10"/>
                    <path d="M18 20V4"/>
                    <path d="M6 20v-4"/>
                  </svg>
                </div>
                <div>
                  <p class="font-semibold text-white">Tu panel de progreso</p>
                  <p class="text-sm text-dark-muted">Cada paso cuenta</p>
                </div>
              </div>

              <div class="space-y-4">
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-dark-muted">Sesiones completadas</span>
                    <span class="text-sm font-semibold text-white">3 / 5</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-dark-surface-high overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-nexo-violet to-electric-cyan" style="width: 60%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-dark-muted">Objetivos alcanzados</span>
                    <span class="text-sm font-semibold text-white">2 / 4</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-dark-surface-high overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-acid-lime to-electric-cyan" style="width: 50%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-dark-muted">Próxima sesión</span>
                    <span class="text-sm font-semibold text-white">Jue, 15 Ago</span>
                  </div>
                  <div class="w-full h-2 rounded-full bg-dark-surface-high overflow-hidden">
                    <div class="h-full rounded-full bg-nexo-violet" style="width: 85%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== TESTIMONIOS ====== -->
    <section class="section-editorial" scrollReveal direction="up">
      <div class="container-editorial">
        <div class="max-w-lg mb-14">
          <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan mb-3">Historias reales</p>
          <h2 class="font-serif text-display-sm md:text-heading-lg text-ink dark:text-dark-text">
            Lo que dicen quienes ya encontraron su nexo
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (t of testimonials; track t.name) {
            <div class="rounded-card-lg bg-white dark:bg-dark-surface p-8 border border-surface dark:border-dark-surface-high">
              <div class="flex items-center gap-1 mb-4">
                @for (star of [1,2,3,4,5]; track star) {
                  <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                }
              </div>
              <p class="text-ink dark:text-dark-text leading-relaxed text-sm mb-6">"{{ t.quote }}"</p>
              <div class="flex items-center gap-3 pt-4 border-t border-surface dark:border-dark-surface-high">
                <nx-avatar [name]="t.name" size="md" />
                <div>
                  <p class="font-semibold text-sm text-ink dark:text-dark-text">{{ t.name }}</p>
                  <p class="text-xs text-muted-text dark:text-dark-muted">{{ t.role }}</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- ====== FINAL CTA ====== -->
    <section class="section-editorial relative overflow-hidden" scrollReveal variant="clip" direction="right">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-nexo-violet/5 via-transparent to-electric-cyan/5 dark:from-nexo-violet/10 dark:to-electric-cyan/10"></div>

      <div class="container-editorial text-center">
        <div class="max-w-2xl mx-auto space-y-6">
          <h2 class="font-serif text-display-sm md:text-heading-lg text-ink dark:text-dark-text leading-tight">
            Tu camino ya tiene alguien que lo recorrió
          </h2>
          <p class="text-lg text-muted-text dark:text-dark-muted max-w-lg mx-auto leading-relaxed">
            No empieces de cero. Conecta con un mentor que ya pasó por lo que tú estás enfrentando ahora.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a routerLink="/explorar" class="btn-primary btn-lg" magnetic [strength]="0.25">
              Encontrar mi mentor
            </a>
            <a routerLink="/como-funciona" class="btn-secondary btn-lg">
              Saber más
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      /* "Cómo funciona" steps. The rail ties the three together as a sequence;
         the hovered step lifts and its number block fills in, so the reader
         always has one clearly active step instead of three flat cards. */
      .steps__rail {
        position: absolute;
        left: 2.75rem;
        top: 3.5rem;
        bottom: 3.5rem;
        width: 2px;
        background: linear-gradient(
          to bottom,
          rgba(91, 75, 255, 0.28),
          rgba(99, 216, 255, 0.28),
          rgba(217, 255, 67, 0.35)
        );
        border-radius: 9999px;
      }

      @media (max-width: 767px) {
        .steps__rail {
          display: none;
        }
      }

      .step-card {
        transition:
          transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
          border-color 0.35s ease;
      }

      .step-card:hover,
      .step-card:focus-within {
        transform: translateX(6px);
        border-color: rgba(91, 75, 255, 0.3);
        box-shadow: 0 16px 40px rgba(91, 75, 255, 0.12);
      }

      .step-card__badge {
        transition:
          transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.35s ease;
      }

      .step-card:hover .step-card__badge {
        transform: scale(1.08);
        box-shadow: 0 8px 20px rgba(91, 75, 255, 0.18);
      }

      .step-card__tag {
        transition: background-color 0.3s ease;
      }
/* Category showcase.
         Replaces the old bento grid entirely: a tab strip plus one panel that
         re-renders per category. Angular swaps the panel content, and these
         keyframes give that swap a direction instead of a hard cut. */
      .cat-strip {
        scrollbar-width: none;
        border-bottom: 1px solid rgba(18, 18, 20, 0.08);
      }

      .cat-strip::-webkit-scrollbar {
        display: none;
      }

      :host-context(.dark) .cat-strip {
        border-bottom-color: rgba(247, 247, 244, 0.1);
      }

      .cat-tab {
        position: relative;
        color: #66666d;
        font-family: 'Manrope', system-ui, sans-serif;
        font-weight: 600;
      }

      :host-context(.dark) .cat-tab {
        color: #a7a5af;
      }

      /* The active tab switches to the serif: an editorial cue rather than a
         filled pill, which is what made the old version look like a SaaS UI. */
      .cat-tab--active {
        font-family: 'Instrument Serif', Georgia, serif;
        font-weight: 400;
        font-size: 1.35em;
        line-height: 1;
        color: #121214;
      }

      :host-context(.dark) .cat-tab--active {
        color: #f7f7f4;
      }

      .cat-tab::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -13px;
        height: 2px;
        border-radius: 9999px;
        background: linear-gradient(90deg, #5b4bff, #63d8ff);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .cat-tab--active::after,
      .cat-tab:hover::after {
        transform: scaleX(1);
      }

      .cat-tab:focus-visible {
        outline: 2px solid #5b4bff;
        outline-offset: 4px;
        border-radius: 4px;
      }

      .cat-panel {
        min-height: 360px;
        transition: background 0.6s ease;
      }

      /* Accent light that drifts as the category changes. */
      .cat-panel__wash {
        position: absolute;
        top: -30%;
        right: -10%;
        width: 55%;
        aspect-ratio: 1;
        border-radius: 9999px;
        filter: blur(90px);
        opacity: 0.9;
        pointer-events: none;
        animation: wash-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
      }


      /* Content enters in sequence so switching category feels authored. */
      .cat-panel__title {
        animation: panel-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .cat-panel__lede {
        animation: panel-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both;
      }
      .cat-panel__specs {
        animation: panel-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both;
      }
      .cat-panel__count {
        display: inline-block;
        animation: panel-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both;
      }


      .cat-panel__cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(18, 18, 20, 0.18);
      }

      .cat-panel__cta:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 3px;
      }

      /* Portraits fan in one after another, each slightly rotated. */
      .cat-face {
        animation: face-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        transition:
          transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.45s ease;
      }

      .cat-face:nth-child(1) {
        animation-delay: 0.1s;
        transform: rotate(-2deg);
      }
      .cat-face:nth-child(2) {
        animation-delay: 0.18s;
        transform: rotate(1.5deg);
      }
      .cat-face:nth-child(3) {
        animation-delay: 0.26s;
        transform: rotate(-1deg);
      }

      .cat-face:hover,
      .cat-face:focus-visible {
        transform: translateY(-8px) rotate(0deg) scale(1.03);
        box-shadow: 0 26px 54px -14px rgba(18, 18, 20, 0.45);
        z-index: 5;
      }

      .cat-face__img {
        transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      }

      .cat-face:hover .cat-face__img {
        transform: scale(1.07);
      }

      /* Featured mentor tiles: lift plus a violet edge, so the interactive
         surface is obvious without adding a visible button. */
      .mentor-tile {
        transition:
          transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        box-shadow: 0 1px 2px rgba(18, 18, 20, 0.04);
      }

      .mentor-tile:hover,
      .mentor-tile:focus-visible {
        transform: translateY(-8px);
        box-shadow:
          0 20px 44px rgba(91, 75, 255, 0.16),
          0 0 0 1px rgba(91, 75, 255, 0.18);
      }

      /* Reduced motion for the sections that live in this component. The hero
         scene has its own contract in styles.css, next to its definition. */
      @media (prefers-reduced-motion: reduce) {
        .step-card,
        .step-card__badge,
        .mentor-tile,
        .cat-face,
        .cat-face__img,
        .cat-panel__cta,
        .cat-tab::after {
          transition: none;
        }

        .cat-panel__wash,
        .cat-panel__title,
        .cat-panel__lede,
        .cat-panel__specs,
        .cat-panel__count,
        .cat-face {
          animation: none;
        }

        .step-card:hover,
        .step-card:focus-within,
        .step-card:hover .step-card__badge,
        .mentor-tile:hover,
        .mentor-tile:focus-visible,
        .cat-face:hover,
        .cat-face:focus-visible,
        .cat-panel__cta:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class HomeComponent {
  private readonly mentorService = inject(MentorService);
  private readonly router = inject(Router);

  readonly searchQuery = signal('');
  readonly categories = CATEGORIES;

  /**
   * Category showcase.
   *
   * Each entry carries its own accent within the NEXO palette — violet, indigo,
   * lavender, ice blue and ink, with acid lime reserved for Ciencia — so the
   * seven categories read as one family rather than a rainbow.
   */
  readonly showcaseCategories = [
    {
      slug: 'tecnologia',
      name: 'Tecnología',
      promise: 'Construye, cambia o acelera tu camino en producto digital, con quien ya lo hizo.',
      specialties: ['Desarrollo', 'Datos', 'IA', 'Producto', 'UX'],
      surface: 'bg-gradient-to-br from-nexo-violet via-electric-indigo to-[#2A1F8F]',
      wash: 'bg-electric-cyan/25',
      titleTone: 'text-white',
      bodyTone: 'text-white/80',
      kicker: 'text-white/50',
      dot: 'bg-acid-lime',
      cta: 'bg-white text-ink hover:bg-off-white',
    },
    {
      slug: 'negocios',
      name: 'Negocios',
      promise: 'Valida una idea, levanta tu empresa o afila tu estrategia comercial.',
      specialties: ['Startups', 'Finanzas', 'Estrategia', 'Ventas'],
      surface: 'bg-gradient-to-br from-electric-indigo via-nexo-violet to-[#3B2FA8]',
      wash: 'bg-soft-lavender/30',
      titleTone: 'text-white',
      bodyTone: 'text-white/80',
      kicker: 'text-white/50',
      dot: 'bg-acid-lime',
      cta: 'bg-white text-ink hover:bg-off-white',
    },
    {
      slug: 'marketing',
      name: 'Marketing',
      promise: 'Haz que tu marca, tu contenido y tu crecimiento dejen de ser intuición.',
      specialties: ['Branding', 'Growth', 'Contenido', 'Digital'],
      surface: 'bg-gradient-to-br from-soft-lavender via-[#EDEAFF] to-ice-blue dark:from-dark-surface dark:via-dark-surface dark:to-dark-surface-high',
      wash: 'bg-nexo-violet/15',
      titleTone: 'text-ink dark:text-dark-text',
      bodyTone: 'text-muted-text dark:text-dark-muted',
      kicker: 'text-nexo-violet',
      dot: 'bg-nexo-violet',
      cta: 'bg-nexo-violet text-white hover:bg-electric-indigo',
    },
    {
      slug: 'ciencia',
      name: 'Ciencia',
      promise: 'Orienta tu carrera investigadora: posgrados, publicaciones y convocatorias.',
      specialties: ['Investigación', 'Datos', 'Academia', 'Posgrados'],
      surface: 'bg-gradient-to-br from-ink via-[#16141F] to-[#0C0B12]',
      wash: 'bg-acid-lime/20',
      titleTone: 'text-white',
      bodyTone: 'text-white/70',
      kicker: 'text-acid-lime',
      dot: 'bg-acid-lime',
      cta: 'bg-acid-lime text-ink hover:bg-[#E4FF6B]',
    },
    {
      slug: 'carrera',
      name: 'Carrera',
      promise: 'Cambia de rumbo, prepara entrevistas y cuenta tu experiencia como merece.',
      specialties: ['Transiciones', 'CV', 'Entrevistas', 'LinkedIn'],
      surface: 'bg-gradient-to-br from-[#EFECFF] via-soft-lavender to-[#E4F6FF] dark:from-dark-surface dark:via-dark-surface-high dark:to-dark-surface',
      wash: 'bg-electric-indigo/15',
      titleTone: 'text-ink dark:text-dark-text',
      bodyTone: 'text-muted-text dark:text-dark-muted',
      kicker: 'text-electric-indigo dark:text-electric-cyan',
      dot: 'bg-electric-indigo',
      cta: 'bg-ink text-white hover:bg-electric-indigo dark:bg-dark-text dark:text-dark-bg',
    },
    {
      slug: 'liderazgo',
      name: 'Liderazgo',
      promise: 'Pasa de hacer a dirigir: equipos, cultura y decisiones difíciles.',
      specialties: ['Equipos', 'Cultura', 'Gestión', 'Personas'],
      surface: 'bg-gradient-to-br from-ice-blue via-[#E3F4FF] to-soft-lavender dark:from-dark-surface dark:via-dark-surface-high dark:to-dark-surface',
      wash: 'bg-electric-cyan/25',
      titleTone: 'text-ink dark:text-dark-text',
      bodyTone: 'text-muted-text dark:text-dark-muted',
      kicker: 'text-electric-indigo dark:text-electric-cyan',
      dot: 'bg-electric-cyan',
      cta: 'bg-ink text-white hover:bg-electric-indigo dark:bg-dark-text dark:text-dark-bg',
    },
    {
      slug: 'productividad',
      name: 'Productividad',
      promise: 'Ordena tu tiempo y tu desarrollo profesional con métodos que sí sostienes.',
      specialties: ['Hábitos', 'Enfoque', 'Metodologías'],
      surface: 'bg-gradient-to-br from-[#F3F1FF] via-off-white to-soft-lavender dark:from-dark-surface dark:via-dark-bg dark:to-dark-surface-high',
      wash: 'bg-nexo-violet/12',
      titleTone: 'text-ink dark:text-dark-text',
      bodyTone: 'text-muted-text dark:text-dark-muted',
      kicker: 'text-nexo-violet',
      dot: 'bg-nexo-violet',
      cta: 'bg-nexo-violet text-white hover:bg-electric-indigo',
    },
  ];

  readonly activeCategoryIndex = signal(0);

  readonly activeCategory = computed(() => this.showcaseCategories[this.activeCategoryIndex()]);

  /** Real mentors of the active category — the portraits are never invented. */
  readonly categoryMentors = computed(() =>
    this.mentorService.getMentorsByCategory(this.activeCategory().slug)
  );

  setCategory(index: number): void {
    this.activeCategoryIndex.set(index);
  }

  protected padIndex(value: number): string {
    return String(value).padStart(2, '0');
  }

  /** Arrow keys move between tabs, as expected of a tablist. */
  protected onCategoryKeydown(event: KeyboardEvent): void {
    const last = this.showcaseCategories.length - 1;
    const current = this.activeCategoryIndex();
    let next: number | null = null;

    if (event.key === 'ArrowRight') next = current === last ? 0 : current + 1;
    else if (event.key === 'ArrowLeft') next = current === 0 ? last : current - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;

    if (next === null) return;

    event.preventDefault();
    this.setCategory(next);

    const tab = (event.currentTarget as HTMLElement).querySelectorAll<HTMLElement>('[role="tab"]')[next];
    tab?.focus();
  }

  /** The three steps of the home "Cómo funciona" section. */
  readonly steps = [
    {
      number: '01',
      title: 'Descubre tu camino',
      body: 'Explora mentores por categoría, trayectoria o especialidad. El matching pondera experiencia y similitud de trayectoria para mostrarte a quien mejor encaja con tu objetivo.',
      tags: ['Búsqueda por filtros', 'Matching por trayectoria'],
      tone: 'bg-nexo-violet/10 text-nexo-violet',
    },
    {
      number: '02',
      title: 'Conecta directamente',
      body: 'Agenda una sesión con el mentor que elijas. Sin intermediarios, sin burocracia. Una conversación real con alguien que vivió lo que tú estás viviendo ahora.',
      tags: ['Agenda flexible', 'Sesiones 1 a 1'],
      tone: 'bg-electric-cyan/15 text-electric-indigo dark:text-electric-cyan',
    },
    {
      number: '03',
      title: 'Avanza con rumbo',
      body: 'Después de cada sesión quedan objetivos, tareas e hitos. NEXO no termina cuando acaba la videollamada: ahí es donde empieza tu progreso.',
      tags: ['Seguimiento post-sesión', 'Historial de progreso'],
      tone: 'bg-acid-lime/25 text-ink dark:text-dark-text',
    },
  ];

  readonly featuredMentors = this.mentorService.featuredMentors;

  /* ---------- hero ecosystem scene ---------- */

  /** True while the search has focus; the scene answers with a little light. */
  readonly searchFocused = signal(false);

  /**
   * Placement of the mentors orbiting the search.
   *
   * Three scales build depth, and the six anchors are laid out three above and
   * three below the nucleus so the group stays balanced without being
   * symmetrical. All six stay on mobile — every scale steps down there, so the
   * scene reads as a smaller ecosystem rather than a thinned-out one.
   */
  private readonly scenePlacements = [
    { place: 'left-[6%] top-[2%]', size: 'hero-orb--lg', drift: 'hero-orb--driftA', delay: '0ms' },
    // Midway point: low enough to clear the description, high enough not to sit
    // over the search, and pulled back to the centre so it stops crowding the
    // blue submit button at the right end of the pill. Rides the second track.
    { place: 'left-[52%] top-[9%]', size: 'hero-orb--sm', drift: 'hero-orb--driftB', delay: '90ms' },
    { place: 'right-[8%] top-[4%]', size: 'hero-orb--md', drift: 'hero-orb--driftC', delay: '180ms' },
    { place: 'left-[10%] bottom-[2%]', size: 'hero-orb--lg', drift: 'hero-orb--driftC', delay: '260ms' },
    { place: 'left-[44%] bottom-[-2%]', size: 'hero-orb--sm', drift: 'hero-orb--driftA', delay: '340ms' },
    { place: 'right-[5%] bottom-[4%]', size: 'hero-orb--md', drift: 'hero-orb--driftB', delay: '420ms' },
  ];

  /** Six real mentors; the data and the photographs are untouched. */
  readonly sceneMentors = computed(() =>
    this.featuredMentors()
      .slice(0, this.scenePlacements.length)
      .map((mentor, i) => ({ mentor, ...this.scenePlacements[i] }))
  );


  navigateToSearch(): void {
    const q = this.searchQuery();
    this.router.navigate(['/explorar'], { queryParams: q ? { q } : {} });
  }

  getCategoryName(slug: string): string {
    return this.categories.find(c => c.slug === slug)?.name ?? slug;
  }

  getCategoryMentorCount(slug: string): number {
    return this.categories.find(c => c.slug === slug)?.mentorCount ?? 0;
  }

  readonly testimonials = [
    {
      name: 'Ana Torres',
      role: 'Frontend Developer',
      quote: 'Carlos me ayudó a dar el salto de junior a mid-level en 4 meses. No fue solo código, fue entender cómo pensar como ingeniero.',
    },
    {
      name: 'Luis Mendoza',
      role: 'Founder, DataLoop',
      quote: 'Mi mentora me ayudó a validar mi idea de negocio antes de invertir. Ahora tenemos 200 clientes activos.',
    },
    {
      name: 'María Fernanda',
      role: 'Data Scientist',
      quote: 'Después de 3 sesiones supe exactamente qué pasos seguir para transicionar de biología a data science. Ya estoy en mi primer empleo.',
    },
  ];
}
