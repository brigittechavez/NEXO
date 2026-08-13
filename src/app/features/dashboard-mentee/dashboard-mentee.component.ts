import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { MetricCardComponent } from '../../shared/ui/metric-card.component';
import { ProgressBarComponent } from '../../shared/ui/progress-bar.component';
import {
  DEMO_MENTEE,
  DEMO_MENTEE_GOAL,
  DEMO_MENTEE_SESSIONS,
} from '../../core/data/demo.data';
import {
  ALL_MENTORS,
  MENTOR_CARLOS,
  MENTOR_DANIELA,
} from '../../core/data/mentors.data';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-dashboard-mentee',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    MetricCardComponent,
    ProgressBarComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-serif font-bold text-ink dark:text-dark-text">
            Hola, {{ menteeName() }}
          </h1>
          <p class="text-muted-text dark:text-dark-muted mt-1">
            Este es tu resumen de progreso
          </p>
        </div>
        <a routerLink="/explorar" class="btn-secondary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Explorar mentores
        </a>
      </div>

      <!-- 1. Progress Overview -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text">Progreso general</h2>
          <a routerLink="/progreso" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">
            Ver detalle
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <nx-metric-card
            label="Progreso total"
            [value]="goalProgress() + '%'"
            [icon]="progressIcon"
            color="violet"
          />
          <nx-metric-card
            label="Hitos alcanzados"
            [value]="completedMilestones() + '/' + totalMilestones()"
            [icon]="milestoneIcon"
            color="cyan"
          />
          <nx-metric-card
            label="Tareas completadas"
            [value]="completedTasks() + '/' + totalTasks()"
            [icon]="taskIcon"
            color="lime"
          />
          <nx-metric-card
            label="Sesiones realizadas"
            [value]="completedSessions()"
            [icon]="sessionIcon"
            color="violet"
          />
        </div>
      </section>

      <!-- 2. Pending Tasks -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text">Tareas pendientes</h2>
          <a routerLink="/dashboard/tareas" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">
            Ver todas
          </a>
        </div>
        @if (pendingTasks().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-8">
              <div class="w-12 h-12 rounded-full bg-acid-lime/15 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-acid-lime">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <p class="text-sm font-medium text-ink dark:text-dark-text">No hay tareas pendientes</p>
              <p class="text-xs text-muted-text dark:text-dark-muted mt-1">Excelente, has completado todas tus tareas</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (task of pendingTasks().slice(0, 3); track task.id) {
              <nx-card [hover]="true">
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 w-2 h-2 rounded-full flex-shrink-0"
                    [class]="task.status === 'in_progress' ? 'bg-electric-cyan' : 'bg-nexo-violet/40'"
                  ></div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-3">
                      <h4 class="text-sm font-semibold text-ink dark:text-dark-text">{{ task.title }}</h4>
                      <nx-badge [variant]="task.status === 'in_progress' ? 'cyan' : 'violet'" size="sm">
                        {{ task.status === 'in_progress' ? 'En progreso' : 'Pendiente' }}
                      </nx-badge>
                    </div>
                    <p class="text-xs text-muted-text dark:text-dark-muted mt-1.5">
                      Vence: {{ formatDate(task.dueDate) }}
                    </p>
                  </div>
                </div>
              </nx-card>
            }
          </div>
        }
      </section>

      <!-- 3. Next Session -->
      @if (nextSession()) {
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text">Próxima sesión</h2>
            <a [routerLink]="['/dashboard/sesion', nextSession()!.id]" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">
              Ver detalle
            </a>
          </div>
          <nx-card [hover]="true">
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <div class="flex-shrink-0 w-12 h-12 rounded-full bg-nexo-violet/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h4 class="text-sm font-semibold text-ink dark:text-dark-text">{{ getMentorName(nextSession()!.mentorId) }}</h4>
                  <nx-badge variant="violet" size="sm">{{ nextSession()!.duration }} min</nx-badge>
                </div>
                <p class="text-sm text-muted-text dark:text-dark-muted">{{ nextSession()!.objective }}</p>
                <p class="text-xs text-muted-text dark:text-dark-muted mt-1.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ formatDateTime(nextSession()!.date, nextSession()!.time) }}
                </p>
              </div>
              <a [routerLink]="['/dashboard/sesion', nextSession()!.id]" class="btn-primary btn-sm flex-shrink-0">
                Preparar sesión
              </a>
            </div>
          </nx-card>
        </section>
      }

      <!-- 4. Active Objectives -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text">Objetivo activo</h2>
          <a routerLink="/dashboard/objetivos" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">
            Ver todos
          </a>
        </div>
        <nx-card [hover]="true">
          <div class="space-y-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <h4 class="text-base font-semibold text-ink dark:text-dark-text">{{ goal().title }}</h4>
                <nx-badge variant="violet" size="sm">{{ goal().category }}</nx-badge>
              </div>
              <p class="text-sm text-muted-text dark:text-dark-muted">{{ goal().description }}</p>
            </div>
            <nx-progress-bar [value]="goalProgress()" color="violet" size="md" label="Progreso del objetivo" />
            <div class="flex flex-wrap gap-2">
              @for (ms of goal().milestones.slice(0, 3); track ms.id) {
                <div class="flex items-center gap-1.5 text-xs" [class]="ms.completed ? 'text-green-600' : 'text-muted-text dark:text-dark-muted'">
                  @if (ms.completed) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  }
                  <span [class]="ms.completed ? 'line-through opacity-70' : ''">{{ ms.title }}</span>
                </div>
              }
              @if (goal().milestones.length > 3) {
                <span class="text-xs text-muted-text dark:text-dark-muted">+{{ goal().milestones.length - 3 }} mas</span>
              }
            </div>
          </div>
        </nx-card>
      </section>

      <!-- 5. Recent Activity -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Actividad reciente</h2>
        @if (recentSessions().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-8">
              <p class="text-sm text-muted-text dark:text-dark-muted">Aun no tienes actividad reciente</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (session of recentSessions().slice(0, 3); track session.id) {
              <a [routerLink]="['/dashboard/sesion', session.id]" class="block">
                <nx-card [hover]="true">
                  <div class="flex items-center gap-4">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      [class]="session.status === 'completed' ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10'"
                    >
                      @if (session.status === 'completed') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                          <polyline points="20 6 9 17 4 12"/>
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
                      <div class="flex items-center gap-2">
                        <h4 class="text-sm font-semibold text-ink dark:text-dark-text">{{ getMentorName(session.mentorId) }}</h4>
                        <nx-badge [variant]="session.status === 'completed' ? 'lime' : 'dark'" size="sm">
                          {{ session.status === 'completed' ? 'Completada' : 'Cancelada' }}
                        </nx-badge>
                      </div>
                      <p class="text-sm text-muted-text dark:text-dark-muted truncate">{{ session.objective }}</p>
                      <p class="text-xs text-muted-text dark:text-dark-muted mt-1">{{ formatDate(session.date) }}</p>
                    </div>
                  </div>
                </nx-card>
              </a>
            }
          </div>
        }
      </section>

      <!-- 6. Recommended Mentors -->
      <section>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text">Mentores recomendados</h2>
          <a routerLink="/explorar" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">
            Ver todos
          </a>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (mentor of recommendedMentors(); track mentor.id) {
            <a [routerLink]="['/mentor', mentor.id]" class="block">
              <nx-card [hover]="true">
                <div class="flex items-center gap-4">
                  <img [src]="mentor.photo" [alt]="mentor.name" class="w-12 h-12 rounded-full object-cover bg-surface" loading="lazy" />
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-semibold text-ink dark:text-dark-text truncate">{{ mentor.name }}</h4>
                    <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ mentor.title }}</p>
                    <div class="flex items-center gap-1 mt-1">
                      <svg class="text-acid-lime" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <span class="text-xs font-semibold text-ink dark:text-dark-text">{{ mentor.rating }}</span>
                      <span class="text-xs text-muted-text dark:text-dark-muted ml-1">{{ mentor.mentorships }} mentorias</span>
                    </div>
                  </div>
                </div>
              </nx-card>
            </a>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class DashboardMenteeComponent {
  protected readonly mentee = DEMO_MENTEE;
  protected readonly goal = signal(DEMO_MENTEE_GOAL);
  protected readonly sessions = signal<Booking[]>(DEMO_MENTEE_SESSIONS);

  protected readonly menteeName = computed(() => this.mentee.name.split(' ')[0]);

  protected readonly goalProgress = computed(() => this.goal().progress);

  protected readonly completedMilestones = computed(
    () => this.goal().milestones.filter(m => m.completed).length
  );
  protected readonly totalMilestones = computed(() => this.goal().milestones.length);

  protected readonly completedTasks = computed(
    () => this.goal().tasks.filter(t => t.status === 'completed').length
  );
  protected readonly totalTasks = computed(() => this.goal().tasks.length);

  protected readonly completedSessions = computed(
    () => this.sessions().filter(s => s.status === 'completed').length
  );

  protected readonly pendingTasks = computed(
    () => this.goal().tasks.filter(t => t.status !== 'completed')
  );

  protected readonly nextSession = computed(() =>
    this.sessions()
      .filter(s => s.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] ?? null
  );

  protected readonly recentSessions = computed(() =>
    this.sessions()
      .filter(s => s.status !== 'upcoming')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );

  protected readonly recommendedMentors = signal([
    MENTOR_CARLOS,
    MENTOR_DANIELA,
    ALL_MENTORS.find(m => m.id === 'm3')!,
  ]);

  protected readonly progressIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
  protected readonly milestoneIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  protected readonly taskIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>';
  protected readonly sessionIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';

  private mentorNameCache = new Map<string, string>();

  getMentorName(mentorId: string): string {
    if (!this.mentorNameCache.has(mentorId)) {
      const mentor = ALL_MENTORS.find(m => m.id === mentorId);
      this.mentorNameCache.set(mentorId, mentor?.name ?? 'Mentor');
    }
    return this.mentorNameCache.get(mentorId)!;
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  formatDateTime(date: Date, time: string): string {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
    return `${dateStr} a las ${time}`;
  }
}
