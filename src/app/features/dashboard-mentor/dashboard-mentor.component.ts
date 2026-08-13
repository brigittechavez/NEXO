import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { SessionCardComponent } from '../../shared/ui/session-card.component';
import { MenteeCardComponent } from '../../shared/ui/mentee-card.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import {
  DEMO_MENTOR,
  DEMO_MENTOR_ACTIVE_MENTEES,
  DEMO_MENTOR_UPCOMING_SESSIONS,
  DEMO_MENTOR_METRICS,
} from '../../core/data/demo.data';

@Component({
  selector: 'app-dashboard-mentor',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    CardComponent,
    BadgeComponent,
    StatCardComponent,
    SessionCardComponent,
    MenteeCardComponent,
    SkeletonComponent,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-ink dark:text-dark-text tracking-tight">
          Hola, {{ mentorName }}
        </h1>
        <p class="text-muted-text dark:text-dark-muted mt-1">
          Este es tu resumen de mentoría para hoy
        </p>
      </div>

      <!-- Pending follow-ups alert -->
      @if (pendingFollowUps().length > 0) {
        <div class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-card-lg p-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 flex-shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span class="text-sm text-amber-800 dark:text-amber-200 font-medium">
              Tienes {{ pendingFollowUps().length }} seguimiento(s) pendiente(s) por completar
            </span>
          </div>
          <a routerLink="/dashboard/mentor/seguimientos" class="text-sm font-semibold text-amber-700 dark:text-amber-300 hover:underline whitespace-nowrap">
            Ver seguimientos
          </a>
        </div>
      }

      <!-- Section 1: Upcoming Sessions -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-ink dark:text-dark-text">Proximas sesiones</h2>
          <a routerLink="/dashboard/mentor/mentees" class="text-sm font-semibold text-nexo-violet hover:underline">
            Ver todas
          </a>
        </div>
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white dark:bg-dark-surface rounded-card-lg p-5 shadow-soft-sm">
                <div class="flex items-start gap-4">
                  <nx-skeleton width="44px" height="44px" borderRadius="50%"></nx-skeleton>
                  <div class="flex-1 space-y-2">
                    <nx-skeleton width="60%" height="16px"></nx-skeleton>
                    <nx-skeleton width="90%" height="12px"></nx-skeleton>
                    <nx-skeleton width="40%" height="12px"></nx-skeleton>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (upcomingSessions().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-3">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted font-medium">No hay sesiones programadas</p>
              <p class="text-sm text-muted-text/60 dark:text-dark-muted/60 mt-1">Cuando tus alumnos agenden sesiones, aparecerán aqui</p>
            </div>
          </nx-card>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (session of upcomingSessions(); track session.id) {
              <nx-session-card
                [menteeName]="getMenteeName(session.menteeId)"
                [menteeAvatar]="getMenteeAvatar(session.menteeId)"
                [objective]="session.objective"
                [date]="session.date"
                [time]="session.time"
                [duration]="session.duration"
                [status]="session.status"
              ></nx-session-card>
            }
          </div>
        }
      </section>

      <!-- Section 2: Active Mentees & Progress -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-ink dark:text-dark-text">Alumnos activos</h2>
          <a routerLink="/dashboard/mentor/mentees" class="text-sm font-semibold text-nexo-violet hover:underline">
            Gestionar
          </a>
        </div>
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white dark:bg-dark-surface rounded-card-lg p-5 shadow-soft-sm">
                <div class="flex items-start gap-4">
                  <nx-skeleton width="48px" height="48px" borderRadius="50%"></nx-skeleton>
                  <div class="flex-1 space-y-2">
                    <nx-skeleton width="50%" height="16px"></nx-skeleton>
                    <nx-skeleton width="80%" height="12px"></nx-skeleton>
                    <nx-skeleton width="100%" height="6px"></nx-skeleton>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (activeMentees().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-3">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted font-medium">Aun no tienes alumnos activos</p>
              <p class="text-sm text-muted-text/60 dark:text-dark-muted/60 mt-1">Publica tus mentorías para empezar a recibir solicitudes</p>
            </div>
          </nx-card>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (mentee of activeMentees(); track mentee.menteeId) {
              <nx-mentee-card
                [name]="mentee.menteeName"
                [avatar]="mentee.menteeAvatar"
                [goal]="mentee.goal"
                [progress]="mentee.progress"
                [lastSession]="mentee.nextSession"
              ></nx-mentee-card>
            }
          </div>
        }
      </section>

      <!-- Section 3: Pending Follow-ups (compact) -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-ink dark:text-dark-text">Seguimientos pendientes</h2>
          <a routerLink="/dashboard/mentor/seguimientos" class="text-sm font-semibold text-nexo-violet hover:underline">
            Ver todos
          </a>
        </div>
        @if (pendingFollowUps().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted text-sm">Sin seguimientos pendientes</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (fu of pendingFollowUps(); track fu.id) {
              <nx-card [hover]="true">
                <div class="flex items-center justify-between gap-4">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-ink dark:text-dark-text truncate">{{ fu.menteeName }} — {{ fu.type }}</p>
                      <p class="text-xs text-muted-text dark:text-dark-muted truncate">{{ fu.message }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <nx-badge variant="lavender" size="sm">{{ fu.dueDate | date:'dd MMM' }}</nx-badge>
                  </div>
                </div>
              </nx-card>
            }
          </div>
        }
      </section>

      <!-- Section 4: New Bookings -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-ink dark:text-dark-text">Nuevas reservas</h2>
        </div>
        @if (newBookings().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted text-sm">No hay nuevas reservas recientes</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (booking of newBookings(); track booking.id) {
              <nx-card [hover]="true">
                <div class="flex items-center gap-4">
                  <img
                    [src]="getMenteeAvatar(booking.menteeId)"
                    [alt]="getMenteeName(booking.menteeId)"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-surface"
                  />
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ getMenteeName(booking.menteeId) }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted">{{ booking.objective }}</p>
                  </div>
                  <span class="text-xs text-muted-text dark:text-dark-muted whitespace-nowrap">{{ booking.date | date:'dd MMM' }} · {{ booking.time }}</span>
                </div>
              </nx-card>
            }
          </div>
        }
      </section>

      <!-- Section 5: Metrics -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-ink dark:text-dark-text mb-4">Metricas</h2>
        @if (loading()) {
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="bg-white dark:bg-dark-surface rounded-card-lg p-5 shadow-soft-sm">
                <nx-skeleton width="44px" height="44px" borderRadius="12px"></nx-skeleton>
                <div class="mt-3 space-y-2">
                  <nx-skeleton width="60%" height="24px"></nx-skeleton>
                  <nx-skeleton width="80%" height="12px"></nx-skeleton>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <nx-stat-card
              label="Sesiones completadas"
              [value]="metrics().completedSessions"
              [icon]="sessionsIcon"
              [trend]="{ direction: 'up', value: '+12 este mes' }"
            ></nx-stat-card>
            <nx-stat-card
              label="Alumnos activos"
              [value]="metrics().activeMentees"
              [icon]="menteesIcon"
            ></nx-stat-card>
            <nx-stat-card
              label="Calificacion promedio"
              [value]="metrics().averageRating"
              [icon]="starIcon"
              [trend]="{ direction: 'up', value: '+0.1' }"
            ></nx-stat-card>
            <nx-stat-card
              label="Tasa de finalizacion"
              [value]="metrics().completionRate + '%'"
              [icon]="checkIcon"
              [trend]="{ direction: 'up', value: '+2%' }"
            ></nx-stat-card>
          </div>
        }
      </section>

      <!-- Section 6: Recent Activity -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-ink dark:text-dark-text mb-4">Actividad reciente</h2>
        @if (recentActivity().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-6">
              <p class="text-muted-text dark:text-dark-muted text-sm">Sin actividad reciente</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (activity of recentActivity(); track activity.id) {
              <nx-card [hover]="false">
                <div class="flex items-start gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    [class]="activity.iconBg"
                  >
                    <span [innerHTML]="activity.icon" class="w-4 h-4"></span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm text-ink dark:text-dark-text">{{ activity.text }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">{{ activity.time }}</p>
                  </div>
                </div>
              </nx-card>
            }
          </div>
        }
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class DashboardMentorComponent {
  protected readonly sessionsIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  protected readonly menteesIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>';
  protected readonly starIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  protected readonly checkIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

  protected readonly mentorName = DEMO_MENTOR.name;
  protected readonly loading = signal(true);
  protected readonly activeMentees = signal(DEMO_MENTOR_ACTIVE_MENTEES);
  protected readonly upcomingSessions = signal(DEMO_MENTOR_UPCOMING_SESSIONS);
  protected readonly metrics = signal(DEMO_MENTOR_METRICS);

  protected readonly pendingFollowUps = signal([
    { id: 'fu-1', menteeName: 'María García', type: 'Revision de tarea', message: 'Revisar avance del proyecto e-commerce en Angular', dueDate: new Date('2025-08-23') },
    { id: 'fu-2', menteeName: 'Luis Paredes', type: 'Check-in', message: 'Verificar progreso en preparación de entrevistas FAANG', dueDate: new Date('2025-08-26') },
  ]);

  protected readonly newBookings = computed(() =>
    this.upcomingSessions().filter(s => {
      const sessionDate = new Date(s.date);
      const now = new Date();
      const diffDays = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7 && diffDays >= 0;
    })
  );

  protected readonly recentActivity = signal([
    { id: 'a-1', text: 'María García completó la sesion sobre entrevista tecnica', time: 'Hace 2 horas', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', iconBg: 'bg-green-100 text-green-600' },
    { id: 'a-2', text: 'Andrea Vásquez reservó una sesion de React hooks avanzados', time: 'Hace 5 horas', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', iconBg: 'bg-nexo-violet/10 text-nexo-violet' },
    { id: 'a-3', text: 'Luis Paredes dejó una calificacion de 5 estrellas', time: 'Ayer', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>', iconBg: 'bg-amber-100 text-amber-600' },
    { id: 'a-4', text: 'Nueva solicitud de mentoría de María García', time: 'Hace 2 dias', icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>', iconBg: 'bg-electric-cyan/10 text-electric-cyan' },
  ]);

  constructor() {
    setTimeout(() => this.loading.set(false), 600);
  }

  protected getMenteeName(menteeId: string): string {
    return this.activeMentees().find(m => m.menteeId === menteeId)?.menteeName || 'Alumno';
  }

  protected getMenteeAvatar(menteeId: string): string {
    return this.activeMentees().find(m => m.menteeId === menteeId)?.menteeAvatar || '';
  }
}
