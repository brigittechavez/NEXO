import { Component, signal } from '@angular/core';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { ProgressBarComponent } from '../../shared/ui/progress-bar.component';
import { Goal } from '../../core/models/goal.model';
import { DEMO_MENTEE_GOAL } from '../../core/data/demo.data';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';

interface GoalTemplate {
  title: string;
  description: string;
  category: string;
  milestones: string[];
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    ProgressBarComponent,
    EmptyStateComponent,
  ],
  template: `
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-serif font-bold text-ink dark:text-dark-text">Mis objetivos</h1>
          <p class="text-muted-text dark:text-dark-muted mt-1">Define y gestiona tus metas de crecimiento</p>
        </div>
        <nx-button variant="primary" size="sm" (clicked)="showForm.set(!showForm())">
          @if (showForm()) {
            Cancelar
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nuevo objetivo
          }
        </nx-button>
      </div>

      <!-- Add Goal Form -->
      @if (showForm()) {
        <nx-card [hover]="false">
          <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Crear nuevo objetivo</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">Titulo del objetivo</label>
              <input
                type="text"
                [value]="newGoalTitle()"
                (input)="newGoalTitle.set($any($event.target).value)"
                placeholder="Ej: Conseguir empleo como frontend developer"
                class="input-nexo text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">Descripcion</label>
              <textarea
                [value]="newGoalDescription()"
                (input)="newGoalDescription.set($any($event.target).value)"
                rows="3"
                placeholder="Describe tu objetivo y por que es importante para ti..."
                class="input-nexo text-sm resize-none"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">Categoria</label>
              <div class="flex flex-wrap gap-2">
                @for (cat of categories; track cat) {
                  <button
                    type="button"
                    class="px-3 py-1.5 rounded-pill text-sm font-medium transition-all duration-200"
                    [class]="newGoalCategory() === cat
                      ? 'bg-nexo-violet text-white'
                      : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
                    (click)="newGoalCategory.set(cat)"
                  >
                    {{ cat }}
                  </button>
                }
              </div>
            </div>
            <div class="flex justify-end gap-3 pt-2">
              <nx-button variant="ghost" size="sm" (clicked)="showForm.set(false)">Cancelar</nx-button>
              <nx-button variant="primary" size="sm" (clicked)="addGoal()">Crear objetivo</nx-button>
            </div>
          </div>
        </nx-card>
      }

      <!-- Templates -->
      @if (!showForm()) {
        <section>
          <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Plantillas de objetivos</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (tpl of templates; track tpl.title) {
              <button
                type="button"
                class="text-left p-4 rounded-card-lg border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface hover:border-nexo-violet/30 hover:shadow-soft-sm transition-all duration-200"
                (click)="applyTemplate(tpl)"
              >
                <nx-badge [variant]="getCategoryVariant(tpl.category)" size="sm" class="mb-2">{{ tpl.category }}</nx-badge>
                <h4 class="text-sm font-semibold text-ink dark:text-dark-text mb-1">{{ tpl.title }}</h4>
                <p class="text-xs text-muted-text dark:text-dark-muted line-clamp-2">{{ tpl.description }}</p>
              </button>
            }
          </div>
        </section>
      }

      <!-- Active Goals -->
      <section>
        <h2 class="text-lg font-serif font-bold text-ink dark:text-dark-text mb-4">Objetivos activos</h2>
        <div class="space-y-4">
          @for (goal of goals(); track goal.id) {
            <nx-card [hover]="true">
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-base font-semibold text-ink dark:text-dark-text">{{ goal.title }}</h3>
                      <nx-badge [variant]="getCategoryVariant(goal.category)" size="sm">{{ goal.category }}</nx-badge>
                    </div>
                    <p class="text-sm text-muted-text dark:text-dark-muted">{{ goal.description }}</p>
                  </div>
                  <button
                    type="button"
                    class="p-2 rounded-lg text-muted-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    (click)="removeGoal(goal.id)"
                    aria-label="Eliminar objetivo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>

                <nx-progress-bar [value]="goal.progress" color="violet" size="sm" />

                <div class="flex flex-wrap gap-1.5">
                  @for (ms of goal.milestones; track ms.id) {
                    <div class="flex items-center gap-1 text-xs" [class]="ms.completed ? 'text-green-600' : 'text-muted-text dark:text-dark-muted'">
                      @if (ms.completed) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                        </svg>
                      }
                      <span [class]="ms.completed ? 'line-through opacity-70' : ''">{{ ms.title }}</span>
                    </div>
                  }
                </div>
              </div>
            </nx-card>
          }

          @if (goals().length === 0) {
            <nx-card [hover]="false">
              <nx-empty-state
                size="inline"
                [icon]="targetIcon"
                title="Aún no tienes objetivos"
                message="Crea tu primer objetivo o parte de una plantilla. Los hitos y las tareas se organizan alrededor de él."
                actionLabel="Crear objetivo"
                (action)="showForm.set(true)"
              />
            </nx-card>
          }
        </div>
      </section>
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
export class GoalsComponent {
  protected readonly targetIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>';

  protected readonly goals = signal<Goal[]>([DEMO_MENTEE_GOAL]);
  protected readonly showForm = signal(false);
  protected readonly newGoalTitle = signal('');
  protected readonly newGoalDescription = signal('');
  protected readonly newGoalCategory = signal('tecnologia');

  protected readonly categories = ['tecnologia', 'negocios', 'carrera', 'liderazgo', 'ciencia'];

  protected readonly templates: GoalTemplate[] = [
    {
      title: 'Conseguir mi primer empleo en tech',
      description: 'Transicionar a la industria tecnologica con las habilidades necesarias',
      category: 'tecnologia',
      milestones: ['Aprender fundamentos', 'Construir portafolio', 'Preparar CV', 'Conseguir entrevistas'],
    },
    {
      title: 'Lanzar mi startup',
      description: 'Validar idea de negocio y lanzar un MVP funcional',
      category: 'negocios',
      milestones: ['Validar idea', 'Crear MVP', 'Conseguir primeros usuarios', 'Iterar producto'],
    },
    {
      title: 'Preparar entrevistas FAANG',
      description: 'Entrenamiento intensivo para entrevistas tecnicas en grandes empresas',
      category: 'carrera',
      milestones: ['Repasar algoritmos', 'Practicar system design', 'Mock interviews', 'Aplicar'],
    },
  ];

  addGoal(): void {
    if (!this.newGoalTitle()) return;

    const goal: Goal = {
      id: 'goal-' + Date.now(),
      menteeId: 'mentee-1',
      title: this.newGoalTitle(),
      description: this.newGoalDescription(),
      category: this.newGoalCategory(),
      milestones: [],
      tasks: [],
      progress: 0,
      createdAt: new Date(),
    };

    this.goals.update(goals => [...goals, goal]);
    this.newGoalTitle.set('');
    this.newGoalDescription.set('');
    this.showForm.set(false);
  }

  applyTemplate(tpl: GoalTemplate): void {
    const goal: Goal = {
      id: 'goal-' + Date.now(),
      menteeId: 'mentee-1',
      title: tpl.title,
      description: tpl.description,
      category: tpl.category,
      milestones: tpl.milestones.map((title, i) => ({
        id: 'ms-' + Date.now() + '-' + i,
        title,
        completed: false,
        order: i + 1,
      })),
      tasks: [],
      progress: 0,
      createdAt: new Date(),
    };

    this.goals.update(goals => [...goals, goal]);
  }

  removeGoal(id: string): void {
    this.goals.update(goals => goals.filter(g => g.id !== id));
  }

  getCategoryVariant(category: string): 'violet' | 'cyan' | 'lime' | 'dark' {
    const map: Record<string, 'violet' | 'cyan' | 'lime' | 'dark'> = {
      tecnologia: 'violet',
      negocios: 'cyan',
      carrera: 'lime',
      liderazgo: 'dark',
      ciencia: 'cyan',
    };
    return map[category] ?? 'violet';
  }
}
