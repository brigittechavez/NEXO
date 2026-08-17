import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import {
  DEMO_MENTEE_SESSIONS,
  DEMO_MENTEE_GOAL,
} from '../../core/data/demo.data';
import { ALL_MENTORS } from '../../core/data/mentors.data';
import { Booking } from '../../core/models/booking.model';

@Component({
  selector: 'app-mentorship',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-serif font-bold text-ink dark:text-dark-text">Mis mentorias</h1>
          <p class="text-muted-text dark:text-dark-muted mt-1">Gestiona tus sesiones de mentoria</p>
        </div>
        <a routerLink="/explorar" class="btn-secondary btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Buscar mentor
        </a>
      </div>

      <!-- Active Mentorship (Workspace) -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Mentoria activa</h2>
        <nx-card [hover]="true">
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <img [src]="mentorPhoto" [alt]="mentorName" class="w-14 h-14 rounded-full object-cover bg-surface" loading="lazy" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-base font-semibold text-ink dark:text-dark-text">{{ mentorName }}</h3>
                <nx-badge variant="violet" size="sm">Continua</nx-badge>
              </div>
              <p class="text-sm text-muted-text dark:text-dark-muted truncate">{{ activeGoal().title }}</p>
              <p class="text-xs text-muted-text dark:text-dark-muted mt-1">{{ completedSessions() }} sesiones completadas</p>
            </div>
            <a routerLink="/workspace" class="btn-primary btn-sm flex-shrink-0">
              Ir al espacio de trabajo
            </a>
          </div>
        </nx-card>
      </section>

      <!-- All Sessions -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Todas las sesiones</h2>

        <!-- Filters -->
        <div class="flex flex-wrap gap-2 mb-4">
          <button
            type="button"
            class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
            [class]="activeFilter() === 'all'
              ? 'bg-nexo-violet text-white'
              : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
            (click)="activeFilter.set('all')"
          >
            Todas
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
            [class]="activeFilter() === 'upcoming'
              ? 'bg-nexo-violet text-white'
              : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
            (click)="activeFilter.set('upcoming')"
          >
            Proximas
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-pill text-sm font-medium transition-all duration-200"
            [class]="activeFilter() === 'completed'
              ? 'bg-nexo-violet text-white'
              : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
            (click)="activeFilter.set('completed')"
          >
            Completadas
          </button>
        </div>

        <!-- Session List -->
        <div class="space-y-3">
          @for (session of filteredSessions(); track session.id) {
            <a [routerLink]="['/dashboard/sesion', session.id]" class="block">
              <nx-card [hover]="true">
                <div class="flex items-center gap-4">
                  <div class="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center"
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
                    <div class="flex items-center gap-2 mb-0.5">
                      <h4 class="text-sm font-semibold text-ink dark:text-dark-text">{{ getMentorName(session.mentorId) }}</h4>
                      <nx-badge
                        [variant]="session.status === 'completed' ? 'lime' : session.status === 'upcoming' ? 'violet' : 'dark'"
                        size="sm"
                      >
                        {{ session.status === 'completed' ? 'Completada' : session.status === 'upcoming' ? 'Proxima' : 'Cancelada' }}
                      </nx-badge>
                    </div>
                    <p class="text-sm text-muted-text dark:text-dark-muted truncate">{{ session.objective }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted mt-1 flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {{ formatDateTime(session.date, session.time) }}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text dark:text-dark-muted flex-shrink-0">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </nx-card>
            </a>
          }
        </div>

        <!-- Empty -->
        @if (filteredSessions().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-8">
              <p class="text-sm text-muted-text dark:text-dark-muted">No hay sesiones con este filtro</p>
            </div>
          </nx-card>
        }
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class MentorshipComponent {
  protected readonly sessions = signal<Booking[]>(DEMO_MENTEE_SESSIONS);
  protected readonly activeGoal = signal(DEMO_MENTEE_GOAL);
  protected readonly activeFilter = signal<'all' | 'upcoming' | 'completed'>('all');

  protected readonly mentorName = 'Carlos Mendoza';
  protected readonly mentorPhoto = '/assets/images/mentors/mentor-m1-carlos-mendoza.webp';

  protected readonly completedSessions = computed(
    () => this.sessions().filter(s => s.status === 'completed').length
  );

  protected readonly filteredSessions = computed(() => {
    const filter = this.activeFilter();
    const all = this.sessions();
    if (filter === 'all') return all;
    return all.filter(s => s.status === filter);
  });

  private mentorNameCache = new Map<string, string>();

  getMentorName(mentorId: string): string {
    if (!this.mentorNameCache.has(mentorId)) {
      const mentor = ALL_MENTORS.find(m => m.id === mentorId);
      this.mentorNameCache.set(mentorId, mentor?.name ?? 'Mentor');
    }
    return this.mentorNameCache.get(mentorId)!;
  }

  formatDateTime(date: Date, time: string): string {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    return `${dateStr} - ${time}`;
  }
}
