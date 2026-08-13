import { Component, input, output, signal, computed, inject, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Mentor } from '../../core/models/mentor.model';
import { BadgeComponent } from './badge.component';
import { FavoritesService } from '../../core/services/favorites.service';

@Component({
  selector: 'nx-mentor-card',
  standalone: true,
  imports: [RouterLink, BadgeComponent],
  template: `
    <!-- The whole card is clickable, but the link itself is the mentor's name:
         a routerLink on the <article> would give no href, no keyboard focus and
         no "open in new tab". The name anchor stretches over the card instead. -->
    <article
      class="group relative bg-white dark:bg-dark-surface rounded-card-lg overflow-hidden
        focus-within:ring-2 focus-within:ring-nexo-violet focus-within:ring-offset-2
        focus-within:ring-offset-off-white dark:focus-within:ring-offset-dark-bg"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
      (mousemove)="onMouseMove($event)"
    >
      <!-- Photo Area -->
      <div class="relative aspect-[3/4] overflow-hidden bg-surface dark:bg-dark-surface-high">
        <img
          [src]="mentor().photo"
          [alt]="mentor().name"
          class="w-full h-full object-cover transition-transform duration-500 ease-out"
          [style.transform]="'scale(' + imageScale() + ')'"
          loading="lazy"
        />

        <!-- Gradient overlay on hover -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        ></div>

        <!-- Free badge (top left) -->
        @if (hasFreeMentorship()) {
          <div class="absolute top-3 left-3 z-10">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-acid-lime text-ink text-xs font-bold rounded-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Gratuita
            </span>
          </div>
        }

        <!-- Bookmark button (top right) -->
        <button
          class="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:hover:bg-dark-surface shadow-soft-sm"
          [class.scale-110]="isSaved()"
          [class.text-nexo-violet]="isSaved()"
          [class.text-muted-text]="!isSaved()"
          (click)="onSaveClick($event)"
          [attr.aria-label]="isSaved() ? 'Quitar de guardados' : 'Guardar mentor'"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            [attr.fill]="isSaved() ? 'currentColor' : 'none'"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>

        <!-- Desktop hover overlay content -->
        <div
          class="absolute inset-x-0 bottom-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 pointer-events-none group-hover:pointer-events-auto"
        >
          <p class="text-white/80 text-sm leading-relaxed line-clamp-2 mb-2">
            {{ mentor().bio }}
          </p>
          <div class="flex flex-wrap gap-1.5 mb-3">
            @for (specialty of mentor().specialties.slice(0, 3); track specialty) {
              <span class="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-pill">
                {{ specialty }}
              </span>
            }
          </div>
          @if (showMatch()) {
            <div class="flex items-center gap-2 mb-3">
              <div class="h-1.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  class="h-full bg-acid-lime rounded-full transition-all duration-500"
                  [style.width.%]="matchPercentage() ?? 0"
                ></div>
              </div>
              <span class="text-acid-lime text-sm font-bold">{{ matchPercentage() }}%</span>
            </div>
          }
          <!-- Visual affordance only: the card itself is the link, so a real
               button here would be a dead control and a duplicate tab stop. -->
          <span
            aria-hidden="true"
            class="block w-full text-center py-2.5 px-4 bg-white text-ink font-semibold text-sm rounded-pill"
          >
            Ver perfil y reservar
          </span>
        </div>
      </div>

      <!-- Info Area -->
      <div class="p-4">
        <!-- Mobile: show more info directly -->
        <div class="block md:hidden">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="min-w-0">
              <h3 class="font-semibold text-ink dark:text-dark-text truncate">
              <a
                [routerLink]="['/mentor', mentor().id]"
                class="outline-none after:absolute after:inset-0 after:content-['']"
              >{{ mentor().name }}</a>
            </h3>
              <p class="text-sm text-muted-text dark:text-dark-muted truncate mt-0.5">{{ mentor().title }}</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span class="text-sm font-semibold text-ink dark:text-dark-text">{{ mentor().rating }}</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5 mb-3">
            @for (s of mentor().specialties.slice(0, 2); track s) {
              <nx-badge variant="lavender" size="sm">{{ s }}</nx-badge>
            }
            @if (mentor().specialties.length > 2) {
              <span class="text-xs text-muted-text dark:text-dark-muted self-center">+{{ mentor().specialties.length - 2 }}</span>
            }
          </div>
          @if (showMatch()) {
            <div class="flex items-center gap-2 mb-3">
              <div class="h-1.5 flex-1 bg-surface dark:bg-dark-surface-high rounded-full overflow-hidden">
                <div
                  class="h-full bg-nexo-violet rounded-full"
                  [style.width.%]="matchPercentage() ?? 0"
                ></div>
              </div>
              <span class="text-nexo-violet text-sm font-bold">{{ matchPercentage() }}%</span>
            </div>
          }
        </div>

        <!-- Desktop: minimal info -->
        <div class="hidden md:block">
          <h3 class="font-semibold text-ink dark:text-dark-text truncate">
              <a
                [routerLink]="['/mentor', mentor().id]"
                class="outline-none after:absolute after:inset-0 after:content-['']"
              >{{ mentor().name }}</a>
            </h3>
          <p class="text-sm text-muted-text dark:text-dark-muted truncate mt-0.5">{{ mentor().title }}</p>
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-surface dark:border-dark-surface-high">
            <div class="flex items-center gap-1">
              <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span class="text-sm font-semibold text-ink dark:text-dark-text">{{ mentor().rating }}</span>
            </div>
            <span class="text-sm text-muted-text dark:text-dark-muted">{{ mentor().mentorships }} mentorías</span>
          </div>
        </div>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
})
export class MentorCardComponent {
  mentor = input.required<Mentor>();
  showMatch = input<boolean>(false);
  matchPercentage = input<number | null>(null);

  save = output<string>();
  cardClick = output<string>();

  private readonly favorites = inject(FavoritesService);

  protected isHovered = signal(false);
  protected imageScale = signal(1);

  /** Saved state is owned by FavoritesService so it stays in sync everywhere. */
  protected readonly isSaved = computed(() => this.favorites.favorites().includes(this.mentor().id));

  /** Brief mentor records carry no mentorship details, hence the narrowing. */
  protected readonly hasFreeMentorship = computed(() => {
    const mentor = this.mentor() as Mentor & { mentorshipDetails?: { isFree: boolean }[] };
    return mentor.mentorshipDetails?.some(mentorship => mentorship.isFree) ?? false;
  });

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
    this.imageScale.set(1);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isHovered()) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const scale = 1 + 0.03 * (1 - Math.abs(x - 0.5) * 2);
    this.imageScale.set(Math.min(scale, 1.05));
  }

  onSaveClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.favorites.toggleFavorite(this.mentor().id);
    this.save.emit(this.mentor().id);
  }
}
