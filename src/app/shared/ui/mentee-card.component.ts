import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CardComponent } from './card.component';

@Component({
  selector: 'nx-mentee-card',
  standalone: true,
  imports: [DatePipe, CardComponent],
  template: `
    <nx-card [hover]="true">
      <div class="flex items-start gap-4 cursor-pointer" (click)="selectMentee.emit()">
        <img
          [src]="avatar()"
          [alt]="name()"
          class="w-12 h-12 rounded-full object-cover flex-shrink-0 bg-surface"
        />
        <div class="min-w-0 flex-1">
          <h4 class="font-semibold text-ink dark:text-dark-text truncate">{{ name() }}</h4>
          <p class="text-sm text-muted-text dark:text-dark-muted mt-0.5 line-clamp-1">{{ goal() }}</p>
          <div class="mt-3">
            <div class="flex items-center justify-between text-xs mb-1.5">
              <span class="text-muted-text dark:text-dark-muted">Progreso</span>
              <span class="font-semibold text-ink dark:text-dark-text">{{ progress() }}%</span>
            </div>
            <div class="w-full h-1.5 bg-surface dark:bg-dark-surface-high rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                [style.width.%]="progress()"
                [class]="progressBarClass"
              ></div>
            </div>
          </div>
          @if (lastSession()) {
            <p class="text-xs text-muted-text dark:text-dark-muted mt-2.5">
              Ultima sesion: {{ lastSession() | date:'dd MMM yyyy' }}
            </p>
          }
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text flex-shrink-0 mt-1">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </nx-card>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
  `],
})
export class MenteeCardComponent {
  name = input<string>('');
  avatar = input<string>('');
  goal = input<string>('');
  progress = input<number>(0);
  lastSession = input<Date | null>(null);

  selectMentee = output<void>();

  get progressBarClass(): string {
    if (this.progress() >= 70) return 'bg-green-500';
    if (this.progress() >= 40) return 'bg-nexo-violet';
    return 'bg-amber-400';
  }
}
