import { Component, input, output, HostBinding } from '@angular/core';
import { Task, TaskStatus } from '../../core/models/goal.model';
import { BadgeComponent } from './badge.component';

@Component({
  selector: 'nx-task-card',
  standalone: true,
  imports: [BadgeComponent],
  template: `
    <div class="flex items-start gap-4 p-4 bg-white dark:bg-dark-surface rounded-card-lg shadow-soft-sm transition-all duration-200 hover:shadow-soft-md">
      <button
        type="button"
        class="mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nexo-violet"
        [class]="checkboxClasses"
        (click)="toggleStatus()"
        [attr.aria-label]="task().status === 'completed' ? 'Marcar como pendiente' : 'Marcar como completada'"
      >
        @if (task().status === 'completed') {
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        }
      </button>

      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-3">
          <h4
            class="text-sm font-semibold leading-snug"
            [class]="task().status === 'completed'
              ? 'text-muted-text dark:text-dark-muted line-through'
              : 'text-ink dark:text-dark-text'"
          >
            {{ task().title }}
          </h4>
          <nx-badge [variant]="statusBadgeVariant" size="sm">{{ statusLabel }}</nx-badge>
        </div>
        @if (task().description) {
          <p class="text-sm text-muted-text dark:text-dark-muted mt-1.5 line-clamp-2">{{ task().description }}</p>
        }
        @if (task().dueDate) {
          <p class="text-xs text-muted-text dark:text-dark-muted mt-2 flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ formatDate(task().dueDate) }}
          </p>
        }
      </div>
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
export class TaskCardComponent {
  task = input.required<Task>();
  statusChange = output<{ taskId: string; status: TaskStatus }>();

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  get checkboxClasses(): string {
    const status = this.task().status;
    if (status === 'completed') {
      return 'border-acid-lime bg-acid-lime text-ink';
    }
    if (status === 'in_progress') {
      return 'border-nexo-violet bg-nexo-violet/10 text-nexo-violet';
    }
    return 'border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface hover:border-nexo-violet/50';
  }

  get statusBadgeVariant(): 'violet' | 'cyan' | 'lime' {
    const map: Record<string, 'violet' | 'cyan' | 'lime'> = {
      pending: 'violet',
      in_progress: 'cyan',
      completed: 'lime',
    };
    return map[this.task().status];
  }

  get statusLabel(): string {
    const map: Record<string, string> = {
      pending: 'Pendiente',
      in_progress: 'En progreso',
      completed: 'Completada',
    };
    return map[this.task().status];
  }

  toggleStatus(): void {
    const current = this.task().status;
    let next: TaskStatus;
    if (current === 'pending') next = 'in_progress';
    else if (current === 'in_progress') next = 'completed';
    else next = 'pending';

    this.statusChange.emit({ taskId: this.task().id, status: next });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
