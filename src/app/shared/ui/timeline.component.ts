import { Component, input, HostBinding } from '@angular/core';

export interface TimelineEntry {
  role: string;
  company: string;
  period: string;
  description?: string;
}

@Component({
  selector: 'nx-timeline',
  standalone: true,
  template: `
    <div class="relative">
      @for (entry of entries(); track $index; let i = $index) {
        <div class="relative flex gap-6 pb-10 last:pb-0">
          <!-- Line -->
          @if (i < entries().length - 1) {
            <div class="absolute left-[11px] top-7 bottom-0 w-px bg-surface dark:bg-dark-surface-high"></div>
          }
          <!-- Dot -->
          <div class="relative z-10 flex-shrink-0 mt-1.5">
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              [class]="i === 0
                ? 'border-nexo-violet bg-nexo-violet/10'
                : 'border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface'"
            >
              <div
                class="w-2 h-2 rounded-full"
                [class]="i === 0
                  ? 'bg-nexo-violet'
                  : 'bg-muted-text/40'"
              ></div>
            </div>
          </div>
          <!-- Content -->
          <div class="flex-1 min-w-0 -mt-0.5">
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
              <h4 class="font-semibold text-ink dark:text-dark-text">{{ entry.role }}</h4>
              <span class="text-sm text-muted-text dark:text-dark-muted flex-shrink-0">{{ entry.period }}</span>
            </div>
            <p class="text-sm text-nexo-violet font-medium mb-1">{{ entry.company }}</p>
            @if (entry.description) {
              <p class="text-sm text-muted-text dark:text-dark-muted leading-relaxed">{{ entry.description }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class TimelineComponent {
  entries = input.required<TimelineEntry[]>();

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
