import { Component, signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { MentorDetail, ALL_MENTORS } from '../../core/data/mentors.data';
import { FavoritesService } from '../../core/services/favorites.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

@Component({
  selector: 'app-saved-mentors',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    EmptyStateComponent,
    PageHeaderComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">
      <nx-page-header
        size="app"
        title="Mentores guardados"
        [subtitle]="savedMentors().length + ' mentores en tu lista'"
      />

      <!-- Filters -->
      @if (savedMentors().length > 0) {
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
            [class]="activeCategory() === 'all'
              ? 'bg-nexo-violet text-white'
              : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
            (click)="activeCategory.set('all')"
          >
            Todos
          </button>
          @for (cat of uniqueCategories(); track cat) {
            <button
              type="button"
              class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200 capitalize"
              [class]="activeCategory() === cat
                ? 'bg-nexo-violet text-white'
                : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
              (click)="activeCategory.set(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      }

      <!-- Mentor Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (mentor of filteredMentors(); track mentor.id) {
          <nx-card [hover]="true">
            <div class="space-y-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <img [src]="mentor.photo" [alt]="mentor.name" class="w-14 h-14 rounded-full object-cover bg-surface" loading="lazy" />
                  <div class="min-w-0">
                    <h3 class="text-sm font-semibold text-ink dark:text-dark-text truncate">{{ mentor.name }}</h3>
                    <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ mentor.title }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="p-2 rounded-lg text-nexo-violet hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                  (click)="removeMentor(mentor.id)"
                  aria-label="Quitar de guardados"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                  </svg>
                </button>
              </div>

              <p class="text-sm text-muted-text dark:text-dark-muted line-clamp-2">{{ mentor.bio }}</p>

              <div class="flex flex-wrap gap-1.5">
                @for (specialty of mentor.specialties.slice(0, 3); track specialty) {
                  <nx-badge variant="lavender" size="sm">{{ specialty }}</nx-badge>
                }
                @if (mentor.specialties.length > 3) {
                  <span class="text-xs text-muted-text dark:text-dark-muted self-center">+{{ mentor.specialties.length - 3 }}</span>
                }
              </div>

              <div class="flex items-center justify-between pt-3 border-t border-surface dark:border-dark-surface-high">
                <div class="flex items-center gap-1">
                  <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span class="text-sm font-semibold text-ink dark:text-dark-text">{{ mentor.rating }}</span>
                </div>
                <span class="text-sm font-semibold text-nexo-violet">S/ {{ mentor.price }}</span>
              </div>

              <a [routerLink]="['/mentor', mentor.id]" class="btn-secondary btn-sm w-full">
                Ver perfil
              </a>
            </div>
          </nx-card>
        }
      </div>

      <!-- Empty State -->
      @if (savedMentors().length === 0) {
        <nx-card [hover]="false">
          <nx-empty-state
            size="inline"
            [icon]="bookmarkIcon"
            title="No tienes mentores guardados"
            message="Explora mentores y guarda los que más te interesen para volver a ellos cuando quieras."
            actionLabel="Explorar mentores"
            actionRoute="/explorar"
          />
        </nx-card>
      }

      <!-- Empty filtered -->
      @if (savedMentors().length > 0 && filteredMentors().length === 0) {
        <nx-card [hover]="false">
          <nx-empty-state
            size="inline"
            [icon]="bookmarkIcon"
            title="Nada en esta categoría"
            message="Ninguno de tus mentores guardados pertenece a esta categoría."
            actionLabel="Ver todos"
            (action)="activeCategory.set('all')"
          />
        </nx-card>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class SavedMentorsComponent {
  private readonly favorites = inject(FavoritesService);

  protected readonly bookmarkIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';

  /** Derived from the real saved-mentor state, so it stays in sync with the marketplace. */
  protected readonly savedMentors = computed<MentorDetail[]>(() => {
    const ids = this.favorites.favorites();
    return ALL_MENTORS.filter(m => ids.includes(m.id));
  });

  protected readonly activeCategory = signal<string>('all');

  protected readonly uniqueCategories = computed(() => {
    const cats = new Set(this.savedMentors().map(m => m.category));
    return Array.from(cats);
  });

  protected readonly filteredMentors = computed(() => {
    const cat = this.activeCategory();
    const all = this.savedMentors();
    if (cat === 'all') return all;
    return all.filter(m => m.category === cat);
  });

  removeMentor(id: string): void {
    this.favorites.toggleFavorite(id);
  }
}
