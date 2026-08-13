import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MentorService } from '../../core/services/mentor.service';
import { CATEGORIES } from '../../core/models/category.model';
import { MentorDetail, ALL_MENTORS } from '../../core/data/mentors.data';
import { FavoritesService } from '../../core/services/favorites.service';
import { NotificationService } from '../../core/services/notification.service';
import { MentorCardComponent } from '../../shared/ui/mentor-card.component';
import { SearchBarComponent } from '../../shared/ui/search-bar.component';
import { FilterDrawerComponent, FilterState } from '../../shared/ui/filter-drawer.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';

@Component({
  selector: 'app-mentors',
  standalone: true,
  imports: [
    MentorCardComponent,
    SearchBarComponent,
    FilterDrawerComponent,
    SkeletonComponent,
    EmptyStateComponent,
  ],
  template: `
    <section class="pt-28 pb-16 md:pt-36 md:pb-24">
      <div class="container-editorial">
        <!-- Header -->
        <div class="max-w-3xl mb-10 md:mb-14">
          <h1 class="font-serif text-display-sm md:text-heading-lg text-ink dark:text-dark-text mb-4">
            Explorar mentores
          </h1>
          <p class="text-lg text-muted-text dark:text-dark-muted leading-relaxed">
            Encuentra el mentor que mejor se alinea con tu objetivo y tu trayectoria.
          </p>
        </div>

        <!-- Search + Desktop filter bar -->
        <div class="mb-8 space-y-4">
          <!-- Search bar -->
          <nx-search-bar
            placeholder="¿Qué quieres lograr?"
            (searchChange)="onSearchChange($event)"
          />

          <!-- Desktop category pills -->
          <div class="hidden md:flex flex-wrap items-center gap-2">
            <button
              (click)="onCategoryChange(null)"
              class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
              [class]="activeCategory() === null
                ? 'bg-nexo-violet text-white shadow-soft-sm'
                : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
            >
              Todos
            </button>
            @for (cat of categories; track cat.slug) {
              <button
                (click)="onCategoryChange(cat.slug)"
                class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
                [class]="activeCategory() === cat.slug
                  ? 'bg-nexo-violet text-white shadow-soft-sm'
                  : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
              >
                {{ cat.name }}
              </button>
            }

            <div class="w-px h-6 bg-surface dark:bg-dark-surface-high mx-1"></div>

            <!-- Desktop quick filters -->
            <button
              (click)="onExperienceToggle()"
              class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
              [class]="activeExperience() !== ''
                ? 'bg-nexo-violet/10 text-nexo-violet'
                : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              {{ activeExperience() === 'senior' ? 'Senior' : 'Experiencia' }}
            </button>

            <button
              (click)="onRatingToggle()"
              class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
              [class]="activeRating() > 0
                ? 'bg-nexo-violet/10 text-nexo-violet'
                : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
            >
              <svg class="text-acid-lime" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              {{ activeRating() > 0 ? activeRating() + '+' : 'Valoración' }}
            </button>

            <button
              (click)="onFreeToggle()"
              class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
              [class]="freeOnly()
                ? 'bg-nexo-violet/10 text-nexo-violet'
                : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:bg-soft-lavender/30'"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Gratuita
            </button>

            @if (hasActiveFilters()) {
              <button
                (click)="clearAllFilters()"
                class="px-3 py-2 rounded-pill text-xs font-semibold text-nexo-violet hover:bg-nexo-violet/10 transition-colors flex items-center gap-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Limpiar
              </button>
            }
          </div>

          <!-- Mobile filter trigger -->
          <div class="flex md:hidden items-center gap-2">
            <button
              (click)="drawerOpen.set(true)"
              class="flex items-center gap-2 px-4 py-2.5 rounded-pill bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text text-sm font-medium transition-all duration-200 hover:bg-soft-lavender/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"/>
                <line x1="4" y1="10" x2="4" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12" y2="3"/>
                <line x1="20" y1="21" x2="20" y2="16"/>
                <line x1="20" y1="12" x2="20" y2="3"/>
                <line x1="1" y1="14" x2="7" y2="14"/>
                <line x1="9" y1="8" x2="15" y2="8"/>
                <line x1="17" y1="16" x2="23" y2="16"/>
              </svg>
              Filtros
              @if (activeFilterCount() > 0) {
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-nexo-violet text-white text-xs font-bold">
                  {{ activeFilterCount() }}
                </span>
              }
            </button>
            @if (hasActiveFilters()) {
              <button
                (click)="clearAllFilters()"
                class="text-xs text-nexo-violet font-semibold"
              >
                Limpiar
              </button>
            }
          </div>
        </div>

        <!-- Search explanation -->
        @if (searchExplanation()) {
          <div class="mb-6 p-4 bg-nexo-violet/5 dark:bg-nexo-violet/10 rounded-card-lg border border-nexo-violet/10">
            <p class="text-sm text-ink dark:text-dark-text leading-relaxed">
              {{ searchExplanation() }}
            </p>
          </div>
        }

        <!-- Results count -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-sm text-muted-text dark:text-dark-muted">
            {{ filteredMentors().length }} {{ filteredMentors().length === 1 ? 'mentor encontrado' : 'mentores encontrados' }}
          </p>
        </div>

        <!-- Mentor grid -->
        @if (loading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3,4,5,6]; track i) {
              <div class="bg-white dark:bg-dark-surface rounded-card-lg overflow-hidden">
                <nx-skeleton width="100%" height="280px" borderRadius="0"></nx-skeleton>
                <div class="p-4 space-y-3">
                  <nx-skeleton width="70%" height="18px"></nx-skeleton>
                  <nx-skeleton width="90%" height="14px"></nx-skeleton>
                  <div class="flex gap-2">
                    <nx-skeleton width="60px" height="24px" borderRadius="999px"></nx-skeleton>
                    <nx-skeleton width="50px" height="24px" borderRadius="999px"></nx-skeleton>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (filteredMentors().length === 0) {
          <nx-empty-state
            [icon]="searchIcon"
            title="No encontramos mentores"
            message="Prueba ajustando tus filtros o buscando con otros términos. Hay mentores excelentes esperándote."
            actionLabel="Limpiar filtros"
            (action)="clearAllFilters()"
          />
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (mentor of filteredMentors(); track mentor.id; let idx = $index) {
              <div
                class="animate-fade-in"
                [style.animation-delay]="(idx * 60) + 'ms'"
              >
                <nx-mentor-card
                  [mentor]="mentor"
                  [showMatch]="!!searchQuery() || hasActiveFilters()"
                  [matchPercentage]="getMatchScore(mentor)"
                  (save)="onSaveMentor($event)"
                />
              </div>
            }
          </div>
        }

        <!-- Recommendations section -->
        @if (recommendations().length > 0 && !loading()) {
          <div class="mt-16 md:mt-20">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-1 h-8 bg-nexo-violet rounded-full"></div>
              <h2 class="font-serif text-heading-md text-ink dark:text-dark-text">
                Mentores que también podrían ayudarte
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (mentor of recommendations(); track mentor.id; let idx = $index) {
                <div
                  class="animate-fade-in"
                  [style.animation-delay]="(idx * 80) + 'ms'"
                >
                  <nx-mentor-card
                    [mentor]="mentor"
                    [showMatch]="false"
                    (save)="onSaveMentor($event)"
                  />
                </div>
              }
            </div>
          </div>
        }
      </div>
    </section>

    <!-- Mobile filter drawer -->
    <nx-filter-drawer
      [isOpen]="drawerOpen()"
      [categories]="categories"
      [initialFilters]="currentFilterState()"
      (filterChange)="onFilterDrawerChange($event)"
      (close)="drawerOpen.set(false)"
    />
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class MentorsComponent implements OnInit {
  private readonly mentorService = inject(MentorService);
  private readonly route = inject(ActivatedRoute);
  private readonly favorites = inject(FavoritesService);
  private readonly notifications = inject(NotificationService);

  protected readonly searchIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>';

  readonly categories = CATEGORIES;

  readonly loading = signal(true);
  readonly drawerOpen = signal(false);
  readonly searchQuery = signal('');
  readonly activeCategory = signal<string | null>(null);
  readonly activeExperience = signal('');
  readonly activeRating = signal(0);
  readonly freeOnly = signal(false);

  readonly filteredMentors = computed(() => {
    let result = this.mentorService.mentors();

    const cat = this.activeCategory();
    if (cat) {
      result = result.filter(m => m.category === cat);
    }

    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.title.toLowerCase().includes(query) ||
        m.bio.toLowerCase().includes(query) ||
        m.specialties.some(s => s.toLowerCase().includes(query)) ||
        m.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    const exp = this.activeExperience();
    if (exp === 'junior') {
      result = result.filter(m => m.experience <= 4);
    } else if (exp === 'senior') {
      result = result.filter(m => m.experience >= 5);
    }

    const rating = this.activeRating();
    if (rating > 0) {
      result = result.filter(m => m.rating >= rating);
    }

    if (this.freeOnly()) {
      result = result.filter(m =>
        m.mentorshipDetails?.some(ms => ms.isFree) ?? false
      );
    }

    return result;
  });

  readonly recommendations = computed(() => {
    const filtered = this.filteredMentors();
    const all = this.mentorService.mentors();
    const filteredIds = new Set(filtered.map(m => m.id));

    if (filtered.length === 0 || filtered.length >= all.length * 0.5) {
      return all
        .filter(m => !filteredIds.has(m.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
    }

    const topSpecialties = new Map<string, number>();
    filtered.forEach(m => {
      m.specialties.forEach(s => {
        topSpecialties.set(s, (topSpecialties.get(s) || 0) + 1);
      });
    });

    return all
      .filter(m => !filteredIds.has(m.id))
      .map(m => ({
        mentor: m,
        score: m.specialties.reduce((acc, s) => acc + (topSpecialties.get(s) || 0), 0),
      }))
      .sort((a, b) => b.score - a.score || b.mentor.rating - a.mentor.rating)
      .slice(0, 3)
      .map(item => item.mentor);
  });

  readonly searchExplanation = computed(() => {
    const query = this.searchQuery();
    if (!query) return '';

    const count = this.filteredMentors().length;
    if (count === 0) return '';

    return `Mostrando mentores para "${query}". ${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''} que coinciden con tu busqueda.`;
  });

  readonly currentFilterState = computed<FilterState>(() => ({
    category: this.activeCategory(),
    objective: this.searchQuery(),
    experience: this.activeExperience(),
    minRating: this.activeRating(),
    freeOnly: this.freeOnly(),
  }));

  readonly hasActiveFilters = computed(() =>
    this.activeCategory() !== null ||
    this.searchQuery() !== '' ||
    this.activeExperience() !== '' ||
    this.activeRating() > 0 ||
    this.freeOnly()
  );

  readonly activeFilterCount = computed(() => {
    let count = 0;
    if (this.activeCategory()) count++;
    if (this.searchQuery()) count++;
    if (this.activeExperience()) count++;
    if (this.activeRating() > 0) count++;
    if (this.freeOnly()) count++;
    return count;
  });

  ngOnInit(): void {
    // The mentor catalogue is local data, so it resolves synchronously. Keeping an
    // artificial delay here would ship an all-skeleton page to crawlers and to the
    // server-rendered HTML, hurting both SEO and LCP on the marketplace.
    this.loading.set(false);

    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.activeCategory.set(params['category']);
      }
      if (params['q']) {
        this.searchQuery.set(params['q']);
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  onCategoryChange(category: string | null): void {
    this.activeCategory.set(category);
  }

  onExperienceToggle(): void {
    const current = this.activeExperience();
    if (current === '') {
      this.activeExperience.set('senior');
    } else if (current === 'senior') {
      this.activeExperience.set('junior');
    } else {
      this.activeExperience.set('');
    }
  }

  onRatingToggle(): void {
    const current = this.activeRating();
    if (current === 0) {
      this.activeRating.set(4.5);
    } else if (current === 4.5) {
      this.activeRating.set(4.8);
    } else {
      this.activeRating.set(0);
    }
  }

  onFreeToggle(): void {
    this.freeOnly.update(v => !v);
  }

  onFilterDrawerChange(state: FilterState): void {
    this.activeCategory.set(state.category);
    this.searchQuery.set(state.objective);
    this.activeExperience.set(state.experience);
    this.activeRating.set(state.minRating);
    this.freeOnly.set(state.freeOnly);
  }

  clearAllFilters(): void {
    this.activeCategory.set(null);
    this.searchQuery.set('');
    this.activeExperience.set('');
    this.activeRating.set(0);
    this.freeOnly.set(false);
  }

  /**
   * The card writes to FavoritesService itself; this only reports the outcome so
   * the user gets feedback on a save that is now genuinely persisted.
   */
  onSaveMentor(mentorId: string): void {
    const saved = this.favorites.favorites().includes(mentorId);
    const mentor = ALL_MENTORS.find(m => m.id === mentorId);
    const name = mentor ? mentor.name : 'Mentor';

    if (saved) {
      this.notifications.success('Mentor guardado', `${name} está en tu lista de guardados.`);
    } else {
      this.notifications.info('Mentor quitado', `${name} ya no está en tus guardados.`);
    }
  }

  getMatchScore(mentor: MentorDetail): number {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return 0;

    let score = 0;

    if (mentor.specialties.some(s => s.toLowerCase().includes(query))) score += 40;
    if (mentor.tags.some(t => t.toLowerCase().includes(query))) score += 30;
    if (mentor.bio.toLowerCase().includes(query)) score += 15;
    if (mentor.title.toLowerCase().includes(query)) score += 15;

    return Math.min(score, 98);
  }
}
