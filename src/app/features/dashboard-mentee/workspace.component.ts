import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ProgressBarComponent } from '../../shared/ui/progress-bar.component';
import {
  DEMO_MENTEE_GOAL,
  DEMO_MENTEE_SESSIONS,
} from '../../core/data/demo.data';
import { Booking } from '../../core/models/booking.model';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    ProgressBarComponent,
    PageHeaderComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-8">
      <nx-page-header size="app" title="Espacio de trabajo" subtitle="Mentoría continua con Carlos Mendoza" />

      <!-- Objective -->
      <nx-card [hover]="false">
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-nexo-violet/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="6"/>
              <circle cx="12" cy="12" r="2"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-1">Objetivo de la mentoria</h3>
            <p class="text-sm text-muted-text dark:text-dark-muted leading-relaxed">{{ goal().description }}</p>
            <div class="mt-3">
              <nx-progress-bar [value]="goal().progress" color="violet" size="sm" label="Progreso" />
            </div>
          </div>
        </div>
      </nx-card>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Next Steps -->
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Siguientes pasos</h3>
            <div class="space-y-3">
              @for (step of nextSteps(); track $index) {
                <div class="flex items-start gap-3">
                  <div class="mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    [class]="step.done ? 'border-acid-lime bg-acid-lime/10' : 'border-surface dark:border-dark-surface-high'"
                  >
                    @if (step.done) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-acid-lime">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    }
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-ink dark:text-dark-text"
                      [class]="step.done ? 'line-through opacity-60' : ''"
                    >{{ step.title }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">{{ step.detail }}</p>
                  </div>
                </div>
              }
            </div>
          </nx-card>

          <!-- Tasks -->
          <nx-card [hover]="false">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-base font-semibold text-ink dark:text-dark-text">Tareas</h3>
              <a routerLink="/dashboard/tareas" class="text-sm font-medium text-nexo-violet hover:text-electric-indigo transition-colors">Ver todas</a>
            </div>
            <div class="space-y-2">
              @for (task of workspaceTasks(); track task.id) {
                <div class="flex items-center gap-3 p-3 rounded-xl bg-surface/50 dark:bg-dark-surface-high/50">
                  <div class="w-2 h-2 rounded-full flex-shrink-0"
                    [class]="task.status === 'completed' ? 'bg-acid-lime' : task.status === 'in_progress' ? 'bg-electric-cyan' : 'bg-nexo-violet/40'"
                  ></div>
                  <span class="text-sm text-ink dark:text-dark-text flex-1"
                    [class]="task.status === 'completed' ? 'line-through opacity-60' : ''"
                  >{{ task.title }}</span>
                  <nx-badge [variant]="task.status === 'completed' ? 'lime' : task.status === 'in_progress' ? 'cyan' : 'violet'" size="sm">
                    {{ task.status === 'completed' ? 'Hecho' : task.status === 'in_progress' ? 'Haciendo' : 'Pendiente' }}
                  </nx-badge>
                </div>
              }
            </div>
          </nx-card>

          <!-- Notes -->
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Notas</h3>
            <div class="space-y-3">
              @for (note of notes(); track $index) {
                <div class="p-3 rounded-xl bg-surface/50 dark:bg-dark-surface-high/50">
                  <p class="text-xs font-semibold text-nexo-violet mb-1">{{ note.date }}</p>
                  <p class="text-sm text-ink dark:text-dark-text leading-relaxed">{{ note.content }}</p>
                </div>
              }
            </div>
          </nx-card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Resources -->
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Recursos</h3>
            <div class="space-y-2">
              @for (resource of resources(); track $index) {
                <div class="flex items-center gap-3 p-3 rounded-xl bg-surface/50 dark:bg-dark-surface-high/50 hover:bg-surface dark:hover:bg-dark-surface-high transition-colors cursor-pointer">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    [class]="resource.type === 'doc' ? 'bg-nexo-violet/10' : resource.type === 'link' ? 'bg-electric-cyan/10' : 'bg-acid-lime/15'"
                  >
                    @if (resource.type === 'doc') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    } @else if (resource.type === 'link') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-electric-cyan">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                        <polygon points="23 7 16 12 23 17 23 7"/>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-ink dark:text-dark-text truncate">{{ resource.title }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted">{{ resource.type === 'doc' ? 'Documento' : resource.type === 'link' ? 'Enlace' : 'Video' }}</p>
                  </div>
                </div>
              }
            </div>
          </nx-card>

          <!-- Timeline -->
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Cronologia</h3>
            <div class="relative">
              @for (entry of timeline(); track $index; let i = $index) {
                <div class="relative flex gap-3 pb-6 last:pb-0">
                  @if (i < timeline().length - 1) {
                    <div class="absolute left-[7px] top-5 bottom-0 w-px bg-surface dark:bg-dark-surface-high"></div>
                  }
                  <div class="relative z-10 flex-shrink-0 mt-1">
                    <div class="w-4 h-4 rounded-full border-2"
                      [class]="i === 0 ? 'border-nexo-violet bg-nexo-violet/10' : 'border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface'"
                    ></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-ink dark:text-dark-text">{{ entry.title }}</p>
                    <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">{{ entry.description }}</p>
                  </div>
                </div>
              }
            </div>
          </nx-card>

          <!-- Mentor info -->
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-3">Tu mentor</h3>
            <div class="flex items-center gap-3">
              <img [src]="mentorPhoto" [alt]="mentorName" class="w-12 h-12 rounded-full object-cover bg-surface" loading="lazy" />
              <div>
                <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ mentorName }}</p>
                <p class="text-xs text-muted-text dark:text-dark-muted">{{ mentorTitle }}</p>
              </div>
            </div>
          </nx-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class WorkspaceComponent {
  protected readonly goal = signal(DEMO_MENTEE_GOAL);
  protected readonly sessions = signal<Booking[]>(DEMO_MENTEE_SESSIONS);

  protected readonly mentorName = 'Carlos Mendoza';
  protected readonly mentorTitle = 'Senior Frontend Engineer en Globant';
  protected readonly mentorPhoto = '/assets/images/mentors/mentor-m1-carlos-mendoza.webp';

  protected readonly nextSteps = signal([
    { title: 'Completar modulo de servicios en Angular', detail: 'Practica dependency injection con un ejemplo real', done: true },
    { title: 'Crear componente de dashboard con RxJS', detail: 'Usa Observables para manejar datos en tiempo real', done: false },
    { title: 'Revisar arquitectura del e-commerce', detail: 'Aplicar patrones de diseño aprendidos en sesion', done: false },
    { title: 'Publicar proyecto en GitHub', detail: 'Documentar README y subir cambios', done: false },
  ]);

  protected readonly workspaceTasks = computed(() => {
    return this.goal().tasks.slice(0, 4);
  });

  protected readonly notes = signal([
    { date: '21 Ago 2025', content: 'En la ultima sesion repasamos dependency injection. Carlos recomendo crear un servicio de autenticacion como ejemplo practico. Practicar antes de la proxima sesion.' },
    { date: '7 Ago 2025', content: 'Feedback del e-commerce: mejorar la separacion de componentes, usar signals para el estado del carrito, y agregar lazy loading en rutas.' },
    { date: '24 Jul 2025', content: 'Introduccion a RxJS: Subject, BehaviorSubject, pipe operators. Practicar con un observable que emita datos de usuario cada 5 segundos.' },
  ]);

  protected readonly resources = signal([
    { title: 'Guia de Angular Services', type: 'doc' as const },
    { title: 'RxJS operators cheat sheet', type: 'link' as const },
    { title: 'Sesion: DI en Angular', type: 'video' as const },
    { title: 'Patrones de arquitectura', type: 'doc' as const },
  ]);

  protected readonly timeline = signal([
    { title: 'Sesion de preparacion de entrevista', description: '21 Ago 2025 - Proxima', type: 'session' as const },
    { title: 'Sesion de marca personal', description: '14 Ago 2025 - Completada', type: 'session' as const },
    { title: 'Sesion de feedback e-commerce', description: '7 Ago 2025 - Completada', type: 'session' as const },
    { title: 'Curso de TypeScript completado', description: '15 Jul 2025', type: 'task' as const },
    { title: 'Dominar Angular basico e intermedio', description: 'Hito alcanzado', type: 'milestone' as const },
  ]);
}
