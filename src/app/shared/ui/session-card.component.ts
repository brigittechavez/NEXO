import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from './button.component';
import { CardComponent } from './card.component';

@Component({
  selector: 'nx-session-card',
  standalone: true,
  imports: [DatePipe, ButtonComponent, CardComponent],
  template: `
    <nx-card [hover]="true">
      <div class="flex items-start gap-4">
        <img
          [src]="menteeAvatar()"
          [alt]="menteeName()"
          class="w-11 h-11 rounded-full object-cover flex-shrink-0 bg-surface"
        />
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-2">
            <h4 class="font-semibold text-ink dark:text-dark-text truncate">{{ menteeName() }}</h4>
            <span
              class="flex-shrink-0 text-xs font-semibold px-2.5 py-1 rounded-pill"
              [class]="statusClasses"
            >
              {{ statusLabel }}
            </span>
          </div>
          <p class="text-sm text-muted-text dark:text-dark-muted mt-1 line-clamp-1">{{ objective() }}</p>
          <div class="flex items-center gap-3 mt-3 text-xs text-muted-text dark:text-dark-muted">
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {{ date() | date:'dd MMM' }}
            </span>
            <span class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {{ time() }} · {{ duration() }} min
            </span>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <nx-button size="sm" variant="primary" (clicked)="viewDetails.emit()">Ver detalles</nx-button>
            <nx-button size="sm" variant="secondary" (clicked)="addFollowUp.emit()">Seguimiento</nx-button>
          </div>
        </div>
      </div>
    </nx-card>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  `],
})
export class SessionCardComponent {
  menteeName = input<string>('');
  menteeAvatar = input<string>('');
  objective = input<string>('');
  date = input<Date>(new Date());
  time = input<string>('');
  duration = input<number>(60);
  status = input<'upcoming' | 'completed' | 'cancelled'>('upcoming');

  viewDetails = output<void>();
  addFollowUp = output<void>();

  get statusLabel(): string {
    const map: Record<string, string> = {
      upcoming: 'Proxima',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return map[this.status()] || this.status();
  }

  get statusClasses(): string {
    const map: Record<string, string> = {
      upcoming: 'bg-nexo-violet/10 text-nexo-violet',
      completed: 'bg-acid-lime/15 text-ink',
      cancelled: 'bg-red-100 text-red-600',
    };
    return map[this.status()] || '';
  }
}
