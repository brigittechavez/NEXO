import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { MenteeCardComponent } from '../../shared/ui/mentee-card.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import {
  DEMO_MENTOR_ACTIVE_MENTEES,
  DEMO_MENTEE_GOAL,
  DEMO_MENTEE_SESSIONS,
} from '../../core/data/demo.data';

@Component({
  selector: 'app-mentees-management',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, CardComponent, ButtonComponent, BadgeComponent, MenteeCardComponent, SkeletonComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-ink dark:text-dark-text">Gestion de alumnos</h1>
          <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Administra tus mentorías y sigue el progreso de tus alumnos</p>
        </div>
        <a routerLink="/dashboard/mentor" class="btn-ghost btn-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Volver
        </a>
      </div>

      <!-- Search and Filters -->
      <div class="mb-6">
        <div class="relative max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar alumno por nombre..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="w-full pl-10 pr-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
          />
        </div>
      </div>

      <!-- Active Mentees -->
      <section class="mb-10">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-ink dark:text-dark-text">
            Alumnos activos
            <span class="text-sm font-normal text-muted-text dark:text-dark-muted">({{ filteredMentees().length }})</span>
          </h2>
        </div>
        @if (loading()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (i of [1, 2]; track i) {
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
        } @else if (filteredMentees().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-3">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted font-medium">No se encontraron alumnos</p>
              <p class="text-sm text-muted-text/60 dark:text-dark-muted/60 mt-1">
                @if (searchQuery()) {
                  Intenta con otro termino de busqueda
                } @else {
                  Aun no tienes alumnos activos
                }
              </p>
            </div>
          </nx-card>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            @for (mentee of filteredMentees(); track mentee.menteeId) {
              <div
                class="cursor-pointer"
                (click)="selectedMentee.set(mentee)"
              >
                <nx-mentee-card
                  [name]="mentee.menteeName"
                  [avatar]="mentee.menteeAvatar"
                  [goal]="mentee.goal"
                  [progress]="mentee.progress"
                  [lastSession]="mentee.nextSession"
                ></nx-mentee-card>
              </div>
            }
          </div>
        }
      </section>

      <!-- Mentee Detail Panel -->
      @if (selectedMentee()) {
        <section class="mb-10">
          <nx-card [hover]="false">
            <div class="flex items-center justify-between mb-5">
              <div class="flex items-center gap-3">
                <img
                  [src]="selectedMentee()!.menteeAvatar"
                  [alt]="selectedMentee()!.menteeName"
                  class="w-12 h-12 rounded-full object-cover bg-surface"
                />
                <div>
                  <h3 class="text-lg font-bold text-ink dark:text-dark-text">{{ selectedMentee()!.menteeName }}</h3>
                  <p class="text-sm text-muted-text dark:text-dark-muted">{{ selectedMentee()!.goal }}</p>
                </div>
              </div>
              <nx-button size="sm" variant="ghost" (clicked)="selectedMentee.set(null)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </nx-button>
            </div>

            <!-- Progress -->
            <div class="mb-5">
              <div class="flex items-center justify-between text-sm mb-2">
                <span class="text-muted-text dark:text-dark-muted">Progreso del objetivo</span>
                <span class="font-bold text-ink dark:text-dark-text">{{ selectedMentee()!.progress }}%</span>
              </div>
              <div class="w-full h-2 bg-surface dark:bg-dark-surface-high rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  [style.width.%]="selectedMentee()!.progress"
                  [class]="getProgressBarClass(selectedMentee()!.progress)"
                ></div>
              </div>
            </div>

            <!-- Milestones -->
            <div class="mb-5">
              <h4 class="text-sm font-semibold text-ink dark:text-dark-text mb-3">Hitos del objetivo</h4>
              <div class="space-y-2">
                @for (milestone of demoGoal.milestones; track milestone.id) {
                  <div class="flex items-center gap-3">
                    <div
                      class="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      [class]="milestone.completed ? 'bg-green-500 text-white' : 'border-2 border-surface dark:border-dark-surface-high'"
                    >
                      @if (milestone.completed) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      }
                    </div>
                    <span class="text-sm" [class]="milestone.completed ? 'text-muted-text dark:text-dark-muted line-through' : 'text-ink dark:text-dark-text'">
                      {{ milestone.title }}
                    </span>
                  </div>
                }
              </div>
            </div>

            <!-- Recent Sessions -->
            <div>
              <h4 class="text-sm font-semibold text-ink dark:text-dark-text mb-3">Sesiones recientes</h4>
              <div class="space-y-2">
                @for (session of demoSessions.slice(0, 3); track session.id) {
                  <div class="flex items-center gap-3 p-3 rounded-xl bg-surface/50 dark:bg-dark-surface-high/50">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      [class]="session.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-nexo-violet/10 text-nexo-violet'"
                    >
                      @if (session.status === 'completed') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      }
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-medium text-ink dark:text-dark-text truncate">{{ session.objective }}</p>
                      <p class="text-xs text-muted-text dark:text-dark-muted">{{ session.date | date:'dd MMM yyyy' }} · {{ session.time }}</p>
                    </div>
                    <nx-badge [variant]="session.status === 'completed' ? 'lime' : 'violet'" size="sm">
                      {{ session.status === 'completed' ? 'Completada' : 'Proxima' }}
                    </nx-badge>
                  </div>
                }
              </div>
            </div>
          </nx-card>
        </section>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-through { text-decoration: line-through; }
  `],
})
export class MenteesManagementComponent {
  protected readonly loading = signal(true);
  protected readonly searchQuery = signal('');
  protected readonly selectedMentee = signal<typeof DEMO_MENTOR_ACTIVE_MENTEES[number] | null>(null);
  protected readonly allMentees = signal(DEMO_MENTOR_ACTIVE_MENTEES);

  protected readonly demoGoal = DEMO_MENTEE_GOAL;
  protected readonly demoSessions = DEMO_MENTEE_SESSIONS;

  protected readonly filteredMentees = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allMentees();
    return this.allMentees().filter(m =>
      m.menteeName.toLowerCase().includes(query) ||
      m.goal.toLowerCase().includes(query)
    );
  });

  constructor() {
    setTimeout(() => this.loading.set(false), 500);
  }

  protected getProgressBarClass(progress: number): string {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-nexo-violet';
    return 'bg-amber-400';
  }
}
