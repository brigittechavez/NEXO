import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorService } from '../../core/services/mentor.service';
import { CATEGORIES } from '../../core/models/category.model';
import { AvatarComponent } from '../../shared/ui/avatar.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ScrollRevealDirective } from '../../shared/motion/scroll-reveal.directive';
import { StaggerDirective } from '../../shared/motion/stagger.directive';
import { ParallaxDirective } from '../../shared/motion/parallax.directive';
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
    ParallaxDirective,
    MagneticDirective,
  ],
  template: `
    <!-- ====== HERO ====== -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-soft-lavender/60 via-nexo-violet/20 to-transparent blur-3xl opacity-60 dark:opacity-30"></div>
        <div class="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-ice-blue/60 via-electric-cyan/15 to-transparent blur-3xl opacity-50 dark:opacity-20"></div>
      </div>

      <div class="container-editorial w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <!-- Left: Functional -->
          <div class="lg:col-span-6 xl:col-span-5 space-y-8">
            <div class="space-y-5">
              <p class="text-sm font-semibold tracking-widest uppercase text-nexo-violet dark:text-electric-cyan">Mentoría real, personas reales</p>
              <h1 class="font-serif text-display-sm md:text-display-md lg:text-display-lg text-ink dark:text-dark-text leading-[1.05]">
                Encuentra a quien
                <span class="text-gradient italic">ya recorrió</span>
                ese camino
              </h1>
              <p class="text-lg md:text-xl text-muted-text dark:text-dark-muted max-w-lg leading-relaxed">
                Conecta con mentores que comparten tu trayectoria. No es un curso más, es una conversación con alguien que ya está donde tú quieres estar.
              </p>
            </div>

            <!-- Search bar -->
            <div class="relative max-w-md">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-text dark:text-dark-muted" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
                (keydown.enter)="navigateToSearch()"
                placeholder="¿Qué quieres aprender? Angular, liderazgo, emprendimiento..."
                class="w-full pl-12 pr-4 py-4 bg-white dark:bg-dark-surface-high text-ink dark:text-dark-text rounded-card-lg border-0 placeholder-muted-text dark:placeholder-dark-muted text-base shadow-soft-md focus:ring-2 focus:ring-nexo-violet/30 focus:shadow-soft-lg transition-all duration-200"
              />
              <button
                (click)="navigateToSearch()"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-nexo-violet text-white rounded-pill hover:bg-electric-indigo transition-colors duration-200"
                aria-label="Buscar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <a routerLink="/explorar" class="btn-primary btn-md">
                Explorar mentores
              </a>
              <a routerLink="/como-funciona" class="btn-ghost btn-md">
                Cómo funciona
              </a>
            </div>

            <div class="flex items-center gap-6 pt-2">
              <div class="flex items-center gap-2">
                <div class="flex -space-x-2">
                  @for (m of featuredMentors(); track m.id; let i = $index) {
                    @if (i < 3) {
                      <nx-avatar [src]="m.photo" [name]="m.name" size="sm" />
                    }
                  }
                </div>
                <span class="text-sm text-muted-text dark:text-dark-muted">{{ featuredMentors().length }}+ mentores disponibles</span>
              </div>
            </div>
          </div>

          <!-- Right: Visual - Floating cards -->
          <div class="hidden lg:block lg:col-span-6 xl:col-span-7 relative h-[520px]">
            <!-- Floating mentor cards -->
            @for (card of heroCards(); track card.mentor.id; let i = $index) {
              <div
                class="absolute card-editorial p-4 w-64 transition-transform duration-500"
                [style.top.px]="card.top"
                [style.left.px]="card.left"
                [style.z-index]="card.z"
                [style.animation-delay]="card.delay + 'ms'"
                [class.animate-slide-up]="true"
              >
                <div class="flex items-start gap-3">
                  <nx-avatar [src]="card.mentor.photo" [name]="card.mentor.name" size="lg" />
                  <div class="min-w-0">
                    <p class="font-semibold text-sm text-ink dark:text-dark-text truncate">{{ card.mentor.name }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ card.mentor.title }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 mt-3">
                  <nx-badge variant="violet" size="sm">{{ card.mentor.specialties[0] }}</nx-badge>
                  <span class="text-xs font-semibold text-nexo-violet">{{ card.match }}% match</span>
                </div>
              </div>
            }

            <!-- Decorative floating elements. Parallax at different speeds gives
                 the hero depth as the page scrolls; both are aria-hidden because
                 they carry no information a screen reader needs. -->
            <div
              class="absolute top-12 right-12 animate-fade-in"
              style="animation-delay: 400ms"
              parallax
              [speed]="0.35"
              aria-hidden="true"
            >
              <div class="w-16 h-16 rounded-card-sm bg-gradient-to-br from-nexo-violet to-electric-indigo flex items-center justify-center shadow-soft-lg">
                <span class="text-white font-serif text-2xl italic">N</span>
              </div>
            </div>
            <div
              class="absolute bottom-24 left-8 animate-fade-in"
              style="animation-delay: 600ms"
              parallax
              [speed]="0.6"
              aria-hidden="true"
            >
              <div class="px-4 py-2 rounded-pill bg-acid-lime/20 dark:bg-acid-lime/10 backdrop-blur-sm">
                <span class="text-sm font-semibold text-ink dark:text-dark-text">92% match con Carlos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ====== FEATURED MENTORS ====== -->
    <section class="section-editorial" scrollReveal direction="right">
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
              class="flex-shrink-0 w-[300px] sm:w-[320px] card-editorial group cursor-pointer"
            >
              <div class="relative h-52 overflow-hidden bg-gradient-to-br from-soft-lavender/40 to-ice-blue/30 dark:from-dark-surface-high dark:to-dark-surface">
                <img
                  [src]="mentor.photo"
                  [alt]="mentor.name"
                  class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div class="absolute top-3 left-3">
                  <nx-badge variant="violet" size="sm">{{ getCategoryName(mentor.category) }}</nx-badge>
                </div>
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

        <!-- Asymmetric Bento Grid -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]"
          staggerChildren
          [delay]="0.07"
        >
          <!-- Tech - spans 2 cols, taller -->
          <a routerLink="/explorar" [queryParams]="{ category: 'tecnologia' }"
             class="sm:col-span-2 sm:row-span-2 relative overflow-hidden rounded-card-lg group cursor-pointer bg-gradient-to-br from-nexo-violet to-electric-indigo p-8 flex flex-col justify-end min-h-[260px] sm:min-h-full">
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div class="absolute top-6 left-6 w-12 h-12 rounded-card-sm bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-serif text-xl">T</div>
            <div class="relative z-10">
              <h3 class="font-serif text-heading-lg text-white mb-2">Tecnología</h3>
              <p class="text-white/80 text-sm max-w-xs">Desarrollo, datos, IA, producto digital</p>
              <div class="flex items-center gap-1.5 mt-4">
                <span class="w-2 h-2 rounded-full bg-acid-lime"></span>
                <span class="text-xs font-medium text-white/70">{{ getCategoryMentorCount('tecnologia') }} mentores</span>
              </div>
            </div>
          </a>

          <!-- Negocios -->
          <a routerLink="/explorar" [queryParams]="{ category: 'negocios' }"
             class="relative overflow-hidden rounded-card-lg group cursor-pointer bg-white dark:bg-dark-surface p-6 flex flex-col justify-end border border-surface dark:border-dark-surface-high hover:shadow-soft-md transition-shadow">
            <div class="absolute top-5 right-5 w-10 h-10 rounded-full bg-electric-cyan/10 flex items-center justify-center">
              <span class="text-electric-cyan font-serif text-lg font-bold">N</span>
            </div>
            <h3 class="font-heading-sm font-semibold text-ink dark:text-dark-text">Negocios</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Startups, finanzas, estrategia</p>
            <span class="text-xs font-medium text-muted-text dark:text-dark-muted mt-3">{{ getCategoryMentorCount('negocios') }} mentores</span>
          </a>

          <!-- Marketing -->
          <a routerLink="/explorar" [queryParams]="{ category: 'marketing' }"
             class="relative overflow-hidden rounded-card-lg group cursor-pointer bg-gradient-to-br from-soft-lavender/40 to-ice-blue/30 dark:from-dark-surface dark:to-dark-surface-high p-6 flex flex-col justify-end border border-surface dark:border-dark-surface-high">
            <div class="w-10 h-10 rounded-full bg-nexo-violet/10 flex items-center justify-center mb-4">
              <span class="text-nexo-violet font-serif text-lg font-bold">M</span>
            </div>
            <h3 class="font-heading-sm font-semibold text-ink dark:text-dark-text">Marketing</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Branding, digital, contenido</p>
            <span class="text-xs font-medium text-muted-text dark:text-dark-muted mt-3">{{ getCategoryMentorCount('marketing') }} mentores</span>
          </a>

          <!-- Ciencia -->
          <a routerLink="/explorar" [queryParams]="{ category: 'ciencia' }"
             class="relative overflow-hidden rounded-card-lg group cursor-pointer bg-ink dark:bg-dark-bg p-6 flex flex-col justify-end">
            <div class="w-10 h-10 rounded-full bg-acid-lime/20 flex items-center justify-center mb-4">
              <span class="text-acid-lime font-serif text-lg font-bold">C</span>
            </div>
            <h3 class="font-heading-sm font-semibold text-white">Ciencia</h3>
            <p class="text-sm text-dark-muted mt-1">Investigación, datos, academia</p>
            <span class="text-xs font-medium text-dark-muted mt-3">{{ getCategoryMentorCount('ciencia') }} mentores</span>
          </a>

          <!-- Carrera -->
          <a routerLink="/explorar" [queryParams]="{ category: 'carrera' }"
             class="relative overflow-hidden rounded-card-lg group cursor-pointer bg-white dark:bg-dark-surface p-6 flex flex-col justify-end border border-surface dark:border-dark-surface-high hover:shadow-soft-md transition-shadow">
            <h3 class="font-heading-sm font-semibold text-ink dark:text-dark-text">Carrera</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Transiciones, CV, entrevistas</p>
            <span class="text-xs font-medium text-muted-text dark:text-dark-muted mt-3">{{ getCategoryMentorCount('carrera') }} mentores</span>
          </a>

          <!-- Liderazgo -->
          <a routerLink="/explorar" [queryParams]="{ category: 'liderazgo' }"
             class="relative overflow-hidden rounded-card-lg group cursor-pointer bg-gradient-to-br from-electric-cyan/20 to-ice-blue/20 dark:from-dark-surface dark:to-dark-surface-high p-6 flex flex-col justify-end border border-surface dark:border-dark-surface-high">
            <div class="w-10 h-10 rounded-full bg-electric-indigo/10 flex items-center justify-center mb-4">
              <span class="text-electric-indigo font-serif text-lg font-bold">L</span>
            </div>
            <h3 class="font-heading-sm font-semibold text-ink dark:text-dark-text">Liderazgo</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Equipos, cultura, gestión</p>
            <span class="text-xs font-medium text-muted-text dark:text-dark-muted mt-3">{{ getCategoryMentorCount('liderazgo') }} mentores</span>
          </a>

          <!-- Productividad -->
          <a routerLink="/explorar" [queryParams]="{ category: 'productividad' }"
             class="relative overflow-hidden rounded-card-lg group cursor-pointer bg-white dark:bg-dark-surface p-6 flex flex-col justify-end border border-surface dark:border-dark-surface-high hover:shadow-soft-md transition-shadow">
            <h3 class="font-heading-sm font-semibold text-ink dark:text-dark-text">Productividad</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Hábitos, enfoque, metodologías</p>
            <span class="text-xs font-medium text-muted-text dark:text-dark-muted mt-3">{{ getCategoryMentorCount('productividad') }} mentores</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ====== CÓMO FUNCIONA ====== -->
    <section class="section-editorial" scrollReveal direction="left">
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

          <!-- Right steps -->
          <div class="lg:col-span-8 space-y-6">
            <!-- Step 1 -->
            <div class="relative rounded-card-lg bg-white dark:bg-dark-surface p-8 md:p-10 border border-surface dark:border-dark-surface-high group hover:shadow-soft-md transition-shadow">
              <div class="flex items-start gap-6">
                <div class="flex-shrink-0 w-14 h-14 rounded-card-sm bg-nexo-violet/10 flex items-center justify-center">
                  <span class="font-serif text-2xl text-nexo-violet">01</span>
                </div>
                <div>
                  <h3 class="font-heading-md font-bold text-ink dark:text-dark-text mb-2">Descubre tu camino</h3>
                  <p class="text-muted-text dark:text-dark-muted leading-relaxed">
                    Explora mentores por categoría, trayectoria o especialidad. Usa el matching inteligente que analiza experiencia, trayectoria y compatibilidad para encontrar a quien mejor se alinea con tu objetivo.
                  </p>
                  <div class="flex flex-wrap gap-2 mt-4">
                    <span class="px-3 py-1 rounded-pill bg-surface dark:bg-dark-surface-high text-xs font-medium text-muted-text dark:text-dark-muted">Búsqueda por filtros</span>
                    <span class="px-3 py-1 rounded-pill bg-surface dark:bg-dark-surface-high text-xs font-medium text-muted-text dark:text-dark-muted">Matching por trayectoria</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="relative rounded-card-lg bg-white dark:bg-dark-surface p-8 md:p-10 border border-surface dark:border-dark-surface-high group hover:shadow-soft-md transition-shadow">
              <div class="flex items-start gap-6">
                <div class="flex-shrink-0 w-14 h-14 rounded-card-sm bg-electric-cyan/10 flex items-center justify-center">
                  <span class="font-serif text-2xl text-electric-cyan">02</span>
                </div>
                <div>
                  <h3 class="font-heading-md font-bold text-ink dark:text-dark-text mb-2">Conecta directamente</h3>
                  <p class="text-muted-text dark:text-dark-muted leading-relaxed">
                    Agenda una sesión con el mentor que elijas. Sin intermediarios, sin burocracia. Una conversación real con alguien que vivió lo que tú estás viviendo ahora.
                  </p>
                  <div class="flex flex-wrap gap-2 mt-4">
                    <span class="px-3 py-1 rounded-pill bg-surface dark:bg-dark-surface-high text-xs font-medium text-muted-text dark:text-dark-muted">Agenda flexible</span>
                    <span class="px-3 py-1 rounded-pill bg-surface dark:bg-dark-surface-high text-xs font-medium text-muted-text dark:text-dark-muted">Sesiones 1 a 1</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="relative rounded-card-lg bg-white dark:bg-dark-surface p-8 md:p-10 border border-surface dark:border-dark-surface-high group hover:shadow-soft-md transition-shadow">
              <div class="flex items-start gap-6">
                <div class="flex-shrink-0 w-14 h-14 rounded-card-sm bg-acid-lime/15 flex items-center justify-center">
                  <span class="font-serif text-2xl text-ink dark:text-dark-text">03</span>
                </div>
                <div>
                  <h3 class="font-heading-md font-bold text-ink dark:text-dark-text mb-2">Avanza con rumbo</h3>
                  <p class="text-muted-text dark:text-dark-muted leading-relaxed">
                    Después de cada sesión, registra tu progreso. Sigue sesiones de seguimiento. NEXO no termina cuando acaba la mentoría, empieza tu camino con alguien que te acompañó desde el principio.
                  </p>
                  <div class="flex flex-wrap gap-2 mt-4">
                    <span class="px-3 py-1 rounded-pill bg-surface dark:bg-dark-surface-high text-xs font-medium text-muted-text dark:text-dark-muted">Seguimiento post-sesión</span>
                    <span class="px-3 py-1 rounded-pill bg-surface dark:bg-dark-surface-high text-xs font-medium text-muted-text dark:text-dark-muted">Historial de progreso</span>
                  </div>
                </div>
              </div>
            </div>
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
})
export class HomeComponent implements OnInit {
  private readonly mentorService = inject(MentorService);
  private readonly router = inject(Router);

  readonly searchQuery = signal('');
  readonly categories = CATEGORIES;

  readonly featuredMentors = this.mentorService.featuredMentors;

  readonly heroCards = computed(() => {
    const mentors = this.featuredMentors();
    const positions = [
      { top: 20, left: 60, z: 3, delay: 0 },
      { top: 160, left: 280, z: 2, delay: 150 },
      { top: 320, left: 140, z: 1, delay: 300 },
    ];
    return mentors.slice(0, 3).map((mentor, i) => ({
      mentor,
      ...positions[i],
      match: [92, 87, 84][i],
    }));
  });

  ngOnInit() {}

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
