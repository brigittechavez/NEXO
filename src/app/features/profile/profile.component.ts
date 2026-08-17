import {
  Component,
  inject,
  signal,
  OnInit,
  HostListener,
  computed,
  DestroyRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MentorService } from '../../core/services/mentor.service';
import { MentorDetail, ALL_MENTORS } from '../../core/data/mentors.data';
import { AvatarComponent } from '../../shared/ui/avatar.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { TimelineComponent, TimelineEntry } from '../../shared/ui/timeline.component';
import { ReviewCardComponent } from '../../shared/ui/review-card.component';
import { MentorshipCardComponent } from '../../shared/ui/mentorship-card.component';
import { AvailabilityCalendarComponent } from '../../shared/ui/availability-calendar.component';
import { MentorCardComponent } from '../../shared/ui/mentor-card.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { SeoService } from '../../shared/ui/seo.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AvatarComponent,
    BadgeComponent,
    ButtonComponent,
    TimelineComponent,
    ReviewCardComponent,
    MentorshipCardComponent,
    AvailabilityCalendarComponent,
    MentorCardComponent,
    EmptyStateComponent,
  ],
  template: `
    @if (mentor()) {
      <!-- ====== HERO ====== -->
      <section class="relative overflow-hidden">
        <!-- Gradient bg -->
        <div class="absolute inset-0 bg-gradient-to-br from-soft-lavender/40 via-white to-electric-cyan/20 dark:from-dark-surface dark:via-dark-bg dark:to-dark-surface pointer-events-none"></div>

        <div class="relative container-editorial pt-28 pb-12 md:pt-36 md:pb-16">
          <div class="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
            <!-- Photo -->
            <div class="w-full lg:w-[380px] flex-shrink-0">
              <div class="relative aspect-[3/4] rounded-card-xl overflow-hidden shadow-soft-lg max-w-[340px] mx-auto lg:mx-0">
                <!-- The LCP element of this page: loaded eagerly and hinted as
                     high priority. The container fixes the ratio, so no shift. -->
                <img
                  [src]="mentor()!.photo"
                  [alt]="mentor()!.name"
                  class="w-full h-full object-cover"
                  fetchpriority="high"
                  decoding="async"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent"></div>
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <!-- Badges -->
              <div class="flex flex-wrap gap-2 mb-4">
                @for (badge of mentor()!.badges.slice(0, 3); track badge.id) {
                  <nx-badge variant="lavender" size="sm">
                    <span class="mr-1">{{ badge.icon }}</span>
                    {{ badge.name }}
                  </nx-badge>
                }
              </div>

              <!-- Name -->
              <h1 class="font-heading font-extrabold text-ink dark:text-dark-text text-4xl md:text-5xl lg:text-heading-lg leading-tight mb-2">
                {{ mentor()!.name }}
              </h1>

              <!-- Title -->
              <p class="text-lg md:text-xl text-muted-text dark:text-dark-muted mb-5">
                {{ mentor()!.title }}
              </p>

              <!-- Rating + Mentorships -->
              <div class="flex flex-wrap items-center gap-5 mb-6">
                <div class="flex items-center gap-2">
                  <div class="flex items-center gap-0.5">
                    @for (star of heroStars(); track $index) {
                      <svg
                        class="w-5 h-5"
                        [class]="star ? 'text-acid-lime' : 'text-surface dark:text-dark-surface-high'"
                        viewBox="0 0 24 24"
                        [attr.fill]="star ? 'currentColor' : 'none'"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    }
                  </div>
                  <span class="text-lg font-bold text-ink dark:text-dark-text">{{ mentor()!.rating }}</span>
                </div>
                <span class="text-muted-text dark:text-dark-muted text-sm">
                  {{ mentor()!.mentorships }} mentorías completadas
                </span>
              </div>

              <!-- Social proof -->
              <p class="text-sm text-muted-text dark:text-dark-muted mb-6">
                Ha mentorizado a <strong class="text-ink dark:text-dark-text">{{ mentor()!.mentorships }}</strong> profesionales en su trayectoria.
              </p>

              <!-- CTAs -->
              <div class="flex flex-wrap gap-3 mb-6">
                <nx-button variant="primary" size="lg" (clicked)="scrollToSection('disponibilidad')">
                  Reservar mentoría
                </nx-button>
                <nx-button variant="secondary" size="lg" (clicked)="scrollToSection('disponibilidad')">
                  Ver disponibilidad
                </nx-button>
              </div>

              <!-- Specialties -->
              <div class="flex flex-wrap gap-2">
                @for (spec of mentor()!.specialties; track spec) {
                  <nx-badge variant="dark" size="sm">{{ spec }}</nx-badge>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ====== STICKY NAV ====== -->
      <div
        class="sticky top-0 z-40 border-b border-surface/60 dark:border-dark-surface-high/60 transition-all duration-300"
        [class]="isNavSticky() ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl shadow-soft-sm' : 'bg-white dark:bg-dark-bg'"
      >
        <div class="container-editorial">
          <nav class="flex gap-1 overflow-x-auto no-scrollbar py-1 -mb-px">
            @for (item of navItems; track item.id) {
              <button
                class="px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                [class]="activeSection() === item.id
                  ? 'border-nexo-violet text-nexo-violet'
                  : 'border-transparent text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
                (click)="scrollToSection(item.id)"
              >
                {{ item.label }}
              </button>
            }
          </nav>
        </div>
      </div>

      <!-- ====== MAIN CONTENT ====== -->
      <div class="container-editorial py-12 md:py-16">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16">
          <!-- Left: Main content -->
          <div class="flex-1 min-w-0">

            <!-- ====== SOBRE MÍ ====== -->
            <section id="sobre-mi" class="mb-16 scroll-mt-20">
              <h2 class="font-heading font-bold text-ink dark:text-dark-text text-2xl md:text-3xl mb-6">
                Sobre mí
              </h2>
              <div class="prose-editorial">
                <p class="text-muted-text dark:text-dark-muted leading-relaxed text-lg whitespace-pre-line">
                  {{ mentor()!.fullBio }}
                </p>
              </div>

              <!-- El camino que recorrí -->
              @if (mentor()!.trajectory) {
                <div class="mt-10 bg-surface/30 dark:bg-dark-surface-high/30 rounded-card-xl p-8">
                  <h3 class="font-heading font-bold text-ink dark:text-dark-text text-xl mb-2">
                    El camino que recorrí
                  </h3>
                  <p class="text-sm text-muted-text dark:text-dark-muted mb-6">
                    No es un CV. Es la historia de cómo llegué hasta aquí.
                  </p>
                  <div class="flex flex-wrap gap-2">
                    @for (step of trajectorySteps(); track step) {
                      <div class="flex items-center gap-2">
                        <span class="px-3 py-1.5 bg-white dark:bg-dark-surface rounded-pill text-sm font-medium text-ink dark:text-dark-text border border-surface/60 dark:border-dark-surface-high/60">
                          {{ step }}
                        </span>
                        @if (!$last) {
                          <svg class="w-4 h-4 text-muted-text/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        }
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Recommended for -->
              @if (mentor()!.recommendedFor.length > 0) {
                <div class="mt-8">
                  <h4 class="font-semibold text-ink dark:text-dark-text mb-3">Te puedo ayudar con</h4>
                  <div class="flex flex-wrap gap-2">
                    @for (item of mentor()!.recommendedFor; track item) {
                      <span class="px-4 py-2 bg-nexo-violet/5 dark:bg-nexo-violet/10 text-nexo-violet text-sm font-medium rounded-pill">
                        {{ item }}
                      </span>
                    }
                  </div>
                </div>
              }
            </section>

            <!-- ====== TRAYECTORIA ====== -->
            @if (timelineEntries().length > 0) {
              <section id="trayectoria" class="mb-16 scroll-mt-20">
                <h2 class="font-heading font-bold text-ink dark:text-dark-text text-2xl md:text-3xl mb-6">
                  Trayectoria
                </h2>
                <p class="text-muted-text dark:text-dark-muted mb-8">
                  {{ mentor()!.experience }} años de experiencia construyendo su carrera.
                </p>
                <nx-timeline [entries]="timelineEntries()" />
              </section>
            }

            <!-- ====== MENTORÍAS ====== -->
            @if (mentor()!.mentorshipDetails.length > 0) {
              <section id="mentorias" class="mb-16 scroll-mt-20">
                <h2 class="font-heading font-bold text-ink dark:text-dark-text text-2xl md:text-3xl mb-2">
                  Mentorías
                </h2>
                <p class="text-muted-text dark:text-dark-muted mb-8">
                  Elige el formato que mejor se adapte a tu objetivo.
                </p>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  @for (ms of mentor()!.mentorshipDetails; track ms.id) {
                    <nx-mentorship-card
                      [mentorship]="ms"
                      [selected]="selectedMentorship() === ms.id"
                      (reserve)="selectMentorship($event)"
                    />
                  }
                </div>
              </section>
            }

            <!-- ====== RESEÑAS ====== -->
            @if (mentor()!.testimonials.length > 0) {
              <section id="resenas" class="mb-16 scroll-mt-20">
                <h2 class="font-heading font-bold text-ink dark:text-dark-text text-2xl md:text-3xl mb-2">
                  Reseñas
                </h2>
                <p class="text-muted-text dark:text-dark-muted mb-8">
                  Lo que dicen quienes ya fueron mentorizados.
                </p>

                <!-- Rating summary -->
                <div class="flex flex-col sm:flex-row gap-8 mb-10 p-6 bg-surface/30 dark:bg-dark-surface-high/30 rounded-card-xl">
                  <div class="flex flex-col items-center justify-center">
                    <span class="text-5xl font-extrabold text-ink dark:text-dark-text">{{ mentor()!.rating }}</span>
                    <div class="flex items-center gap-0.5 mt-2">
                      @for (star of heroStars(); track $index) {
                        <svg
                          class="w-5 h-5"
                          [class]="star ? 'text-acid-lime' : 'text-surface dark:text-dark-surface-high'"
                          viewBox="0 0 24 24"
                          [attr.fill]="star ? 'currentColor' : 'none'"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                      }
                    </div>
                    <span class="text-sm text-muted-text dark:text-dark-muted mt-1">
                      {{ mentor()!.testimonials.length }} reseñas
                    </span>
                  </div>
                  <div class="flex-1 space-y-2">
                    @for (level of [5, 4, 3, 2, 1]; track level) {
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-muted-text dark:text-dark-muted w-3 text-right">{{ level }}</span>
                        <svg class="w-4 h-4 text-acid-lime flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        <div class="flex-1 h-2 bg-surface dark:bg-dark-surface-high rounded-full overflow-hidden">
                          <div
                            class="h-full bg-acid-lime rounded-full transition-all duration-500"
                            [style.width.%]="ratingDistribution(level)"
                          ></div>
                        </div>
                        <span class="text-xs text-muted-text dark:text-dark-muted w-8 text-right">
                          {{ ratingCount(level) }}
                        </span>
                      </div>
                    }
                  </div>
                </div>

                <!-- Featured testimonial -->
                @if (featuredTestimonial()) {
                  <div class="mb-8 p-8 bg-gradient-to-br from-nexo-violet/5 to-electric-cyan/5 dark:from-nexo-violet/10 dark:to-electric-cyan/10 rounded-card-xl border border-nexo-violet/10 dark:border-nexo-violet/20">
                    <svg class="w-8 h-8 text-nexo-violet/30 mb-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    <p class="text-ink dark:text-dark-text text-lg leading-relaxed italic mb-4">
                      "{{ featuredTestimonial()!.comment }}"
                    </p>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-nexo-violet/10 flex items-center justify-center">
                        <span class="text-xs font-semibold text-nexo-violet">{{ getInitials(featuredTestimonial()!.menteeName) }}</span>
                      </div>
                      <div>
                        <span class="font-semibold text-ink dark:text-dark-text text-sm">{{ featuredTestimonial()!.menteeName }}</span>
                        <div class="flex items-center gap-0.5">
                          @for (star of getStars(featuredTestimonial()!.rating); track $index) {
                            <svg class="w-3 h-3 text-acid-lime" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                }

                <!-- All reviews -->
                <div class="grid gap-4 md:grid-cols-2">
                  @for (review of mentor()!.testimonials; track review.id) {
                    <nx-review-card
                      [menteeName]="review.menteeName"
                      [rating]="review.rating"
                      [comment]="review.comment"
                      [tags]="review.tags"
                      [date]="review.date"
                    />
                  }
                </div>
              </section>
            }

            <!-- ====== DISPONIBILIDAD ====== -->
            <section id="disponibilidad" class="scroll-mt-20">
              <nx-availability-calendar
                [availability]="mentor()!.availability"
                (slotSelected)="onSlotSelected($event)"
              />
            </section>
          </div>

          <!-- ====== STICKY SIDEBAR (Desktop) ====== -->
          <aside class="hidden lg:block w-[340px] flex-shrink-0">
            <div class="sticky top-24">
              <div class="bg-white dark:bg-dark-surface rounded-card-xl border border-surface/50 dark:border-dark-surface-high/50 p-6 shadow-soft-sm">
                <!-- Summary -->
                <div class="flex items-center gap-3 mb-5">
                  <nx-avatar [src]="mentor()!.photo" [name]="mentor()!.name" size="md" />
                  <div class="min-w-0">
                    <h3 class="font-semibold text-ink dark:text-dark-text truncate">{{ mentor()!.name }}</h3>
                    <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ mentor()!.title }}</p>
                  </div>
                </div>

                <div class="border-t border-surface/50 dark:border-dark-surface-high/50 pt-4 mb-4">
                  @if (selectedMentorship()) {
                    <div class="mb-3">
                      <p class="text-xs text-muted-text dark:text-dark-muted mb-1">Mentoría seleccionada</p>
                      <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ selectedMentorshipTitle() }}</p>
                    </div>
                  }
                  <div class="flex items-baseline gap-1">
                    @if (selectedMentorshipPrice()) {
                      <span class="text-3xl font-extrabold text-ink dark:text-dark-text">S/{{ selectedMentorshipPrice() }}</span>
                    } @else {
                      <span class="text-3xl font-extrabold text-ink dark:text-dark-text">S/{{ mentor()!.price }}</span>
                    }
                    <span class="text-sm text-muted-text dark:text-dark-muted">por sesión</span>
                  </div>
                </div>

                <nx-button
                  variant="primary"
                  size="lg"
                  class="w-full mb-3"
                  (clicked)="scrollToSection('disponibilidad')"
                >
                  Reservar ahora
                </nx-button>

                <div class="flex items-center gap-2 justify-center text-sm text-muted-text dark:text-dark-muted">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Pago seguro · Garantía de satisfacción
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <!-- ====== RELATED MENTORS ====== -->
      @if (relatedMentors().length > 0) {
        <section class="border-t border-surface/60 dark:border-dark-surface-high/60 py-16">
          <div class="container-editorial">
            <h2 class="font-heading font-bold text-ink dark:text-dark-text text-2xl md:text-3xl mb-2">
              Mentores que también podrían ayudarte
            </h2>
            <p class="text-muted-text dark:text-dark-muted mb-8">
              Profesionales con trayectoria similar en la misma categoría.
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              @for (rel of relatedMentors(); track rel.id) {
                <nx-mentor-card [mentor]="rel" />
              }
            </div>
          </div>
        </section>
      }

      <!-- ====== MOBILE STICKY CTA ====== -->
      <div class="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white dark:bg-dark-surface border-t border-surface/60 dark:border-dark-surface-high/60 px-4 py-3 safe-area-bottom">
        <div class="flex items-center gap-3">
          <div class="flex-1 min-w-0">
            @if (selectedMentorship()) {
              <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ selectedMentorshipTitle() }}</p>
            }
            <p class="font-bold text-ink dark:text-dark-text">
              S/{{ selectedMentorshipPrice() || mentor()!.price }}
            </p>
          </div>
          <nx-button variant="primary" size="md" (clicked)="scrollToSection('disponibilidad')">
            Reservar
          </nx-button>
        </div>
      </div>
    } @else {
      <!-- Not found. A missing mentor is an empty result, not a failure, so it
           uses the neutral empty state rather than the red error one. -->
      <section class="pt-28 pb-16 md:pt-36 md:pb-24">
        <div class="container-editorial max-w-xl">
          <nx-empty-state
            [icon]="notFoundIcon"
            title="No encontramos a este mentor"
            message="El perfil no existe o ya no está disponible en la plataforma. Puedes seguir explorando el resto de mentores."
            actionLabel="Explorar mentores"
            actionRoute="/explorar"
          />
        </div>
      </section>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .safe-area-bottom {
      padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
    }
    .scroll-mt-20 {
      scroll-margin-top: 5rem;
    }
  `],
})
export class ProfileComponent implements OnInit {
  protected readonly notFoundIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';

  private readonly mentorService = inject(MentorService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly seo = inject(SeoService);

  readonly mentor = signal<MentorDetail | undefined>(undefined);
  protected readonly selectedMentorship = signal<string | null>(null);
  protected readonly isNavSticky = signal(false);
  protected readonly activeSection = signal('sobre-mi');

  readonly navItems = [
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'trayectoria', label: 'Trayectoria' },
    { id: 'mentorias', label: 'Mentorías' },
    { id: 'resenas', label: 'Reseñas' },
    { id: 'disponibilidad', label: 'Disponibilidad' },
  ];

  protected readonly heroStars = computed(() => {
    const r = this.mentor()?.rating ?? 0;
    return Array.from({ length: 5 }, (_, i) => i < Math.round(r));
  });

  protected readonly trajectorySteps = computed(() => {
    const traj = this.mentor()?.trajectory;
    if (!traj) return [];
    return traj.split(/\s*(?:→|->|—|-)\s*/).filter(Boolean);
  });

  protected readonly timelineEntries = computed((): TimelineEntry[] => {
    const m = this.mentor();
    if (!m) return [];
    const steps = this.trajectorySteps();
    if (steps.length === 0) return [];

    return steps.map((step, i) => {
      const parts = step.split(/\s+en\s+/i);
      const role = parts[0]?.trim() ?? step;
      const company = parts[1]?.trim() ?? '';
      const isLast = i === steps.length - 1;
      return {
        role,
        company,
        period: isLast ? 'Actual' : `Etapa ${i + 1}`,
        description: isLast ? 'Posición actual' : undefined,
      };
    });
  });

  protected readonly relatedMentors = computed(() => {
    const m = this.mentor();
    if (!m) return [];
    return ALL_MENTORS
      .filter(x => x.id !== m.id && x.category === m.category)
      .slice(0, 4);
  });

  protected readonly featuredTestimonial = computed(() => {
    const testimonials = this.mentor()?.testimonials;
    if (!testimonials || testimonials.length === 0) return null;
    return [...testimonials].sort((a, b) => b.rating - a.rating)[0];
  });

  protected readonly selectedMentorshipTitle = computed(() => {
    const id = this.selectedMentorship();
    if (!id) return '';
    const ms = this.mentor()?.mentorshipDetails.find(x => x.id === id);
    return ms?.title ?? '';
  });

  protected readonly selectedMentorshipPrice = computed(() => {
    const id = this.selectedMentorship();
    if (!id) return null;
    const ms = this.mentor()?.mentorshipDetails.find(x => x.id === id);
    return ms?.price ?? null;
  });

  protected ratingCount(level: number): number {
    return this.mentor()?.testimonials.filter(t => Math.round(t.rating) === level).length ?? 0;
  }

  protected ratingDistribution(level: number): number {
    const total = this.mentor()?.testimonials.length ?? 0;
    if (total === 0) return 0;
    return (this.ratingCount(level) / total) * 100;
  }

  protected getStars(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.round(rating));
  }

  protected getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  selectMentorship(id: string): void {
    this.selectedMentorship.set(id);
  }

  scrollToSection(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.activeSection.set(id);
    }
  }

  onSlotSelected(_slot: { day: string; time: string }): void {
    // Emit or navigate to booking
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    this.isNavSticky.set(scrollY > 400);

    // Determine active section
    for (const item of [...this.navItems].reverse()) {
      const el = document.getElementById(item.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          this.activeSection.set(item.id);
          break;
        }
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.mentor.set(this.mentorService.getMentorById(id));
        this.selectedMentorship.set(null);
        this.activeSection.set('sobre-mi');
        this.applySeo();
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0 });
        }
      }
    });
  }

  /**
   * Mentor profiles are the most SEO-relevant pages on the site, and they are
   * prerendered, so the metadata has to be set as the page renders rather than
   * after hydration.
   */
  private applySeo(): void {
    const mentor = this.mentor();

    if (!mentor) {
      this.seo.setAll({
        title: 'Mentor no encontrado | NEXO',
        description: 'Este perfil no existe o ya no está disponible. Explora el resto de mentores de NEXO.',
      });
      return;
    }

    // No `image`: the portraits are WebP and several social crawlers still fail
    // to render WebP previews, so this falls back to the PNG social card.
    this.seo.setAll({
      title: `${mentor.name} — ${mentor.title} | NEXO`,
      description: mentor.bio,
      path: `/mentor/${mentor.id}`,
    });
  }
}
