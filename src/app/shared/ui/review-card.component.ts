import { Component, input, HostBinding, computed } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'nx-review-card',
  standalone: true,
  imports: [DatePipe],
  template: `
    <article class="bg-white dark:bg-dark-surface rounded-card-lg p-6 border border-surface/50 dark:border-dark-surface-high/50">
      <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex items-center gap-3">
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-semibold text-nexo-violet">{{ initials() }}</span>
          </div>
          <div>
            <h4 class="font-semibold text-ink dark:text-dark-text text-sm">{{ menteeName() }}</h4>
            <p class="text-xs text-muted-text dark:text-dark-muted">{{ date() | date:'mediumDate' }}</p>
          </div>
        </div>
        <!-- Stars -->
        <div class="flex items-center gap-0.5 flex-shrink-0">
          @for (star of stars(); track $index) {
            <svg
              class="w-4 h-4"
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
      </div>

      <!-- Comment -->
      <p class="text-muted-text dark:text-dark-muted text-sm leading-relaxed mb-4">{{ comment() }}</p>

      <!-- Tags -->
      @if (tags().length > 0) {
        <div class="flex flex-wrap gap-1.5">
          @for (tag of tags(); track tag) {
            <span class="px-2.5 py-0.5 bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted text-xs font-medium rounded-pill">
              {{ tag }}
            </span>
          }
        </div>
      }
    </article>
  `,
})
export class ReviewCardComponent {
  menteeName = input.required<string>();
  rating = input.required<number>();
  comment = input.required<string>();
  tags = input<string[]>([]);
  date = input.required<Date>();

  protected readonly initials = computed(() => {
    const name = this.menteeName();
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  });

  protected readonly stars = computed(() => {
    const r = this.rating();
    return Array.from({ length: 5 }, (_, i) => i < Math.round(r));
  });

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
