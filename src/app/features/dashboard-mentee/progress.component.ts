import { Component, signal, computed, inject } from '@angular/core';
import { ProgressService } from '../../core/services/progress.service';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ProgressBarComponent } from '../../shared/ui/progress-bar.component';
import { MetricCardComponent } from '../../shared/ui/metric-card.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import {
  DEMO_MENTEE_GOAL,
  DEMO_MENTEE_SESSIONS,
} from '../../core/data/demo.data';

@Component({
  selector: 'app-mentee-progress',
  standalone: true,
  imports: [
    CardComponent,
    BadgeComponent,
    ProgressBarComponent,
    MetricCardComponent,
    PageHeaderComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-8">
      <nx-page-header size="app" title="Mi progreso" subtitle="Seguimiento de tu desarrollo profesional" />

      <!-- Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <nx-metric-card
          label="Progreso general"
          [value]="calculatedProgress() + '%'"
          [icon]="progressIcon"
          color="violet"
        />
        <nx-metric-card
          label="Tareas completadas"
          [value]="completedTasks() + '/' + totalTasks()"
          [icon]="taskIcon"
          color="cyan"
          trend="up"
          trendValue="+1 esta semana"
        />
        <nx-metric-card
          label="Sesiones realizadas"
          [value]="completedSessions()"
          [icon]="sessionIcon"
          color="lime"
        />
        <nx-metric-card
          label="Hitos alcanzados"
          [value]="completedMilestones() + '/' + totalMilestones()"
          [icon]="milestoneIcon"
          color="violet"
        />
      </div>

      <!-- Roadmap / Journey -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Mi hoja de ruta</h2>
        <nx-card [hover]="false">
          <div class="relative">
            @for (ms of milestones(); track ms.id; let i = $index; let last = $last) {
              <div class="relative flex gap-5" [class.pb-10]="!last">
                <!-- Connecting line -->
                @if (!last) {
                  <div
                    class="absolute left-[15px] top-[31px] bottom-0 w-0.5"
                    [class]="ms.completed ? 'bg-acid-lime' : 'bg-surface dark:bg-dark-surface-high'"
                  ></div>
                }

                <!-- Milestone circle -->
                <div class="relative z-10 flex-shrink-0">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    [class]="ms.completed
                      ? 'bg-acid-lime text-ink'
                      : isCurrentMilestone(i)
                        ? 'bg-nexo-violet text-white ring-4 ring-nexo-violet/20'
                        : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted'"
                  >
                    @if (ms.completed) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    } @else if (isCurrentMilestone(i)) {
                      <span class="text-xs font-bold">{{ i + 1 }}</span>
                    } @else {
                      <span class="text-xs font-semibold">{{ i + 1 }}</span>
                    }
                  </div>
                </div>

                <!-- Milestone content -->
                <div class="flex-1 min-w-0 pt-0.5">
                  <div class="flex items-center gap-2 mb-1">
                    <h4
                      class="text-sm font-semibold"
                      [class]="ms.completed ? 'text-green-700 dark:text-green-400' : isCurrentMilestone(i) ? 'text-nexo-violet' : 'text-muted-text dark:text-dark-muted'"
                    >
                      {{ ms.title }}
                    </h4>
                    @if (ms.completed) {
                      <nx-badge variant="lime" size="sm">Completado</nx-badge>
                    } @else if (isCurrentMilestone(i)) {
                      <nx-badge variant="violet" size="sm">En progreso</nx-badge>
                    }
                  </div>
                  <p class="text-sm text-muted-text dark:text-dark-muted">
                    {{ ms.completed ? 'Has completado este paso exitosamente' : isCurrentMilestone(i) ? 'Estas trabajando en este paso' : 'Paso pendiente' }}
                  </p>
                </div>
              </div>
            }
          </div>
        </nx-card>
      </section>

      <!-- Progress Breakdown -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Desglose del progreso</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <nx-card [hover]="false">
            <h3 class="text-sm font-semibold text-ink dark:text-dark-text mb-3">Progreso por hitos</h3>
            <nx-progress-bar [value]="milestoneProgress()" color="violet" size="md" />
            <p class="text-xs text-muted-text dark:text-dark-muted mt-2">
              {{ completedMilestones() }} de {{ totalMilestones() }} hitos completados (70% del progreso total)
            </p>
          </nx-card>
          <nx-card [hover]="false">
            <h3 class="text-sm font-semibold text-ink dark:text-dark-text mb-3">Progreso por tareas</h3>
            <nx-progress-bar [value]="taskProgress()" color="cyan" size="md" />
            <p class="text-xs text-muted-text dark:text-dark-muted mt-2">
              {{ completedTasks() }} de {{ totalTasks() }} tareas completadas (30% del progreso total)
            </p>
          </nx-card>
        </div>
      </section>

      <!-- Sessions Summary -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Historial de sesiones</h2>
        <nx-card [hover]="false">
          @if (allSessions().length === 0) {
            <div class="text-center py-8">
              <p class="text-sm text-muted-text dark:text-dark-muted">Aun no tienes sesiones registradas</p>
            </div>
          } @else {
            <div class="space-y-3">
              @for (session of allSessions(); track session.id) {
                <div class="flex items-center gap-4 p-3 rounded-xl bg-surface/30 dark:bg-dark-surface-high/30">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    [class]="session.status === 'completed' ? 'bg-green-50 dark:bg-green-500/10' : session.status === 'upcoming' ? 'bg-nexo-violet/10' : 'bg-red-50 dark:bg-red-500/10'"
                  >
                    @if (session.status === 'completed') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    } @else if (session.status === 'upcoming') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-ink dark:text-dark-text">{{ session.objective }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">{{ formatDate(session.date) }}</p>
                  </div>
                  <nx-badge
                    [variant]="session.status === 'completed' ? 'lime' : session.status === 'upcoming' ? 'violet' : 'dark'"
                    size="sm"
                  >
                    {{ session.status === 'completed' ? 'Completada' : session.status === 'upcoming' ? 'Proxima' : 'Cancelada' }}
                  </nx-badge>
                </div>
              }
            </div>
          }
        </nx-card>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class MenteeProgressComponent {
  private readonly progressService = inject(ProgressService);

  protected readonly goal = signal(DEMO_MENTEE_GOAL);
  protected readonly allSessions = signal(DEMO_MENTEE_SESSIONS);

  protected readonly completedMilestones = computed(
    () => this.goal().milestones.filter(m => m.completed).length
  );
  protected readonly totalMilestones = computed(() => this.goal().milestones.length);

  protected readonly completedTasks = computed(
    () => this.goal().tasks.filter(t => t.status === 'completed').length
  );
  protected readonly totalTasks = computed(() => this.goal().tasks.length);

  protected readonly completedSessions = computed(
    () => this.allSessions().filter(s => s.status === 'completed').length
  );

  protected readonly milestones = computed(() => this.goal().milestones);

  /** All progress maths lives in ProgressService — see its unit tests. */
  private readonly breakdown = computed(() => this.progressService.getBreakdown(this.goal()));

  protected readonly calculatedProgress = computed(() => this.breakdown().overall);
  protected readonly milestoneProgress = computed(() => this.breakdown().milestones);
  protected readonly taskProgress = computed(() => this.breakdown().tasks);

  private readonly currentMilestone = computed(() =>
    this.progressService.currentMilestoneIndex(this.milestones())
  );

  isCurrentMilestone(index: number): boolean {
    return this.currentMilestone() === index;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  protected readonly progressIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
  protected readonly taskIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
  protected readonly sessionIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  protected readonly milestoneIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
}
