import { Component, input, output, computed, HostBinding } from '@angular/core';
import { Mentorship, MentorshipType } from '../../core/models/mentorship.model';
import { BadgeComponent } from './badge.component';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'nx-mentorship-card',
  standalone: true,
  imports: [BadgeComponent, ButtonComponent],
  template: `
    <article
      class="relative bg-white dark:bg-dark-surface rounded-card-lg overflow-hidden border border-surface/50 dark:border-dark-surface-high/50 transition-all duration-300 hover:shadow-soft-md hover:border-nexo-violet/20"
      [class.ring-2]="selected()"
      [class.ring-nexo-violet]="selected()"
    >
      @if (mentorship().isFree) {
        <div class="absolute top-4 right-4 z-10">
          <nx-badge variant="lime" size="sm">Gratis</nx-badge>
        </div>
      }

      <div class="p-6">
        <!-- Type badge -->
        <div class="mb-3">
          <nx-badge [variant]="typeVariant()" size="sm">{{ typeLabel() }}</nx-badge>
        </div>

        <!-- Title -->
        <h3 class="font-heading font-bold text-ink dark:text-dark-text text-lg mb-2 pr-16">
          {{ mentorship().title }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-muted-text dark:text-dark-muted leading-relaxed mb-4">
          {{ mentorship().description }}
        </p>

        <!-- Meta -->
        <div class="flex items-center gap-4 mb-5 text-sm">
          <span class="flex items-center gap-1.5 text-muted-text dark:text-dark-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ mentorship().duration }}
          </span>
          <span class="flex items-center gap-1.5 text-muted-text dark:text-dark-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {{ mentorship().slots }} {{ mentorship().slots === 1 ? 'lugar' : 'lugares' }}
          </span>
        </div>

        <!-- Includes -->
        <div class="mb-5">
          <h4 class="text-xs font-semibold text-ink dark:text-dark-text uppercase tracking-wider mb-2">Incluye</h4>
          <ul class="space-y-1.5">
            @for (item of mentorship().includes; track item) {
              <li class="flex items-start gap-2 text-sm text-muted-text dark:text-dark-muted">
                <svg class="w-4 h-4 text-acid-lime flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                {{ item }}
              </li>
            }
          </ul>
        </div>

        <!-- Target audience -->
        <p class="text-xs text-muted-text dark:text-dark-muted italic mb-5">
          Para: {{ mentorship().targetAudience }}
        </p>

        <!-- Price + CTA -->
        <div class="flex items-center justify-between pt-4 border-t border-surface/50 dark:border-dark-surface-high/50">
          <div>
            @if (mentorship().isFree) {
              <span class="text-2xl font-bold text-acid-lime">Gratis</span>
            } @else {
              <span class="text-2xl font-bold text-ink dark:text-dark-text">S/{{ mentorship().price }}</span>
              <span class="text-sm text-muted-text dark:text-dark-muted ml-1">por sesión</span>
            }
          </div>
          <nx-button
            variant="primary"
            size="sm"
            (clicked)="reserve.emit(mentorship().id)"
          >
            Reservar
          </nx-button>
        </div>
      </div>
    </article>
  `,
})
export class MentorshipCardComponent {
  mentorship = input.required<Mentorship>();
  selected = input<boolean>(false);

  reserve = output<string>();

  protected readonly typeLabel = computed(() => {
    const map: Record<MentorshipType, string> = {
      individual: 'Sesión individual',
      package: 'Paquete',
      continuous: 'Mentoría continua',
    };
    return map[this.mentorship().type] ?? this.mentorship().type;
  });

  protected readonly typeVariant = computed(() => {
    const map: Record<MentorshipType, 'violet' | 'cyan' | 'lavender'> = {
      individual: 'violet',
      package: 'cyan',
      continuous: 'lavender',
    };
    return map[this.mentorship().type] ?? 'violet';
  });

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
