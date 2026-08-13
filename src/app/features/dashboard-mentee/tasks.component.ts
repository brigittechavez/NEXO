import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { TaskCardComponent } from '../../shared/ui/task-card.component';
import { Task, TaskStatus } from '../../core/models/goal.model';
import { DEMO_MENTEE_GOAL } from '../../core/data/demo.data';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CardComponent,
    ButtonComponent,
    TaskCardComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-serif font-bold text-ink dark:text-dark-text">Mis tareas</h1>
          <p class="text-muted-text dark:text-dark-muted mt-1">{{ tasks().length }} tareas en total</p>
        </div>
        @if (pendingCount() > 0) {
          <nx-button variant="secondary" size="sm" (clicked)="bulkComplete()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Completar pendientes ({{ pendingCount() }})
          </nx-button>
        }
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
          [class]="activeFilter() === 'all'
            ? 'bg-nexo-violet text-white'
            : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeFilter.set('all')"
        >
          Todas ({{ tasks().length }})
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
          [class]="activeFilter() === 'pending'
            ? 'bg-nexo-violet text-white'
            : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeFilter.set('pending')"
        >
          Pendientes ({{ pendingCount() }})
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
          [class]="activeFilter() === 'in_progress'
            ? 'bg-nexo-violet text-white'
            : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeFilter.set('in_progress')"
        >
          En progreso ({{ inProgressCount() }})
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
          [class]="activeFilter() === 'completed'
            ? 'bg-nexo-violet text-white'
            : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeFilter.set('completed')"
        >
          Completadas ({{ completedCount() }})
        </button>
      </div>

      <!-- Task List -->
      <div class="space-y-3">
        @for (task of filteredTasks(); track task.id) {
          <nx-task-card [task]="task" (statusChange)="onStatusChange($event)" />
        }
      </div>

      <!-- Empty State -->
      @if (filteredTasks().length === 0) {
        <nx-card [hover]="false">
          <nx-empty-state
            size="inline"
            [icon]="taskIcon"
            [title]="activeFilter() === 'all' ? 'Todavía no hay tareas' : 'Nada con este filtro'"
            [message]="activeFilter() === 'all'
              ? 'Las tareas aparecen aquí cuando tú o tu mentor las creáis a partir de un objetivo.'
              : 'Prueba con otro estado para ver el resto de tus tareas.'"
            [actionLabel]="activeFilter() === 'all' ? 'Ver mis objetivos' : 'Ver todas'"
            (action)="onEmptyAction()"
          />
        </nx-card>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class TasksComponent {
  private readonly router = inject(Router);

  protected readonly tasks = signal<Task[]>([...DEMO_MENTEE_GOAL.tasks]);
  protected readonly activeFilter = signal<'all' | TaskStatus>('all');

  protected readonly taskIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';

  /** With no tasks at all the way out is a goal; with a filter it is the filter. */
  protected onEmptyAction(): void {
    if (this.activeFilter() === 'all') {
      this.router.navigate(['/dashboard/objetivos']);
    } else {
      this.activeFilter.set('all');
    }
  }

  protected readonly filteredTasks = computed(() => {
    const filter = this.activeFilter();
    const all = this.tasks();
    if (filter === 'all') return all;
    return all.filter(t => t.status === filter);
  });

  protected readonly pendingCount = computed(() => this.tasks().filter(t => t.status === 'pending').length);
  protected readonly inProgressCount = computed(() => this.tasks().filter(t => t.status === 'in_progress').length);
  protected readonly completedCount = computed(() => this.tasks().filter(t => t.status === 'completed').length);

  onStatusChange(event: { taskId: string; status: TaskStatus }): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.id === event.taskId ? { ...t, status: event.status } : t)
    );
  }

  bulkComplete(): void {
    this.tasks.update(tasks =>
      tasks.map(t => t.status !== 'completed' ? { ...t, status: 'completed' as TaskStatus } : t)
    );
  }
}
