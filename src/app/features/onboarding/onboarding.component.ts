import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../shared/ui/logo.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { ProgressStepsComponent } from '../../shared/ui/progress-steps.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LogoComponent, ButtonComponent, ProgressStepsComponent],
  template: `
    <div class="min-h-screen bg-off-white dark:bg-dark-bg">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-surface dark:border-dark-surface-high">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <app-logo [size]="28" />
            <span class="text-lg font-bold tracking-tight text-ink dark:text-dark-text">NEXO</span>
          </a>
          @if (currentStep() > 0) {
            <button
              (click)="previousStep()"
              class="text-sm font-medium text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text transition-colors flex items-center gap-1">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 12H5"></path>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Atras
            </button>
          }
          @if (canSkip()) {
            <button
              (click)="skipStep()"
              class="text-sm font-medium text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text transition-colors">
              Omitir
            </button>
          }
        </div>
      </header>

      <!-- Progress -->
      <div class="pt-20 pb-4 px-4 sm:px-6 max-w-2xl mx-auto">
        <app-progress-steps
          [steps]="stepLabels"
          [currentStep]="currentStep()"
        />
      </div>

      <!-- Steps Content -->
      <main class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <!-- Step 1: Objective -->
        @if (currentStep() === 0) {
          <div class="animate-fade-in">
            <div class="text-center mb-10">
              <div class="w-16 h-16 mx-auto mb-6 bg-nexo-violet/10 rounded-card-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B4BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <h1 class="text-heading-lg font-bold text-ink dark:text-dark-text mb-3">
                Que quieres lograr?
              </h1>
              <p class="text-muted-text dark:text-dark-muted max-w-md mx-auto">
                Cuéntanos tu objetivo para encontrar la mejor experiencia de mentoria para ti
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <textarea
                  [(ngModel)]="objective"
                  placeholder="Ej: Quiero aprender Angular desde cero para conseguir mi primer empleo como desarrollador frontend..."
                  class="input-nexo min-h-[120px] resize-none"
                  rows="4"
                ></textarea>
              </div>

              <div>
                <p class="text-sm font-medium text-muted-text dark:text-dark-muted mb-3">Sugerencias populares:</p>
                <div class="flex flex-wrap gap-2">
                  @for (suggestion of objectiveSuggestions; track suggestion) {
                    <button
                      (click)="objective = suggestion"
                      class="px-3 py-1.5 text-sm rounded-pill border transition-all duration-200"
                      [class]="objective === suggestion
                        ? 'bg-nexo-violet text-white border-nexo-violet'
                        : 'bg-white dark:bg-dark-surface border-surface dark:border-dark-surface-high text-ink dark:text-dark-text hover:border-nexo-violet/50'">
                      {{ suggestion }}
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Step 2: Category -->
        @if (currentStep() === 1) {
          <div class="animate-fade-in">
            <div class="text-center mb-10">
              <div class="w-16 h-16 mx-auto mb-6 bg-electric-cyan/10 rounded-card-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#63D8FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <h1 class="text-heading-lg font-bold text-ink dark:text-dark-text mb-3">
                Elige una categoria
              </h1>
              <p class="text-muted-text dark:text-dark-muted max-w-md mx-auto">
                Selecciona el area donde buscas crecimiento
              </p>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              @for (cat of categories; track cat.id) {
                <button
                  (click)="selectCategory(cat.id)"
                  class="p-4 rounded-card-sm border-2 text-left transition-all duration-200"
                  [class]="category === cat.id
                    ? 'border-nexo-violet bg-nexo-violet/5'
                    : 'border-surface dark:border-dark-surface-high hover:border-muted-text/30 bg-white dark:bg-dark-surface'">
                  <div class="text-2xl mb-2">{{ cat.icon }}</div>
                  <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ cat.name }}</p>
                </button>
              }
            </div>

            @if (category) {
              <div class="mt-6 animate-fade-in">
                <p class="text-sm font-medium text-muted-text dark:text-dark-muted mb-3">Subtemas en {{ getCategoryName(category) }}:</p>
                <div class="flex flex-wrap gap-2">
                  @for (topic of getCategoryTopics(category); track topic) {
                    <button
                      (click)="toggleTopic(topic)"
                      class="px-3 py-1.5 text-sm rounded-pill border transition-all duration-200"
                      [class]="selectedTopics().includes(topic)
                        ? 'bg-nexo-violet text-white border-nexo-violet'
                        : 'bg-white dark:bg-dark-surface border-surface dark:border-dark-surface-high text-ink dark:text-dark-text hover:border-nexo-violet/50'">
                      {{ topic }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        }

        <!-- Step 3: Level -->
        @if (currentStep() === 2) {
          <div class="animate-fade-in">
            <div class="text-center mb-10">
              <div class="w-16 h-16 mx-auto mb-6 bg-acid-lime/10 rounded-card-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D9FF43" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              </div>
              <h1 class="text-heading-lg font-bold text-ink dark:text-dark-text mb-3">
                Cual es tu nivel?
              </h1>
              <p class="text-muted-text dark:text-dark-muted max-w-md mx-auto">
                No hay respuestas incorrectas, solo queremos entender tu punto de partida
              </p>
            </div>

            <div class="space-y-3 max-w-md mx-auto">
              @for (level of levels; track level.id) {
                <button
                  (click)="selectedLevel.set(level.id)"
                  class="w-full p-5 rounded-card-sm border-2 text-left transition-all duration-200"
                  [class]="selectedLevel() === level.id
                    ? 'border-nexo-violet bg-nexo-violet/5'
                    : 'border-surface dark:border-dark-surface-high hover:border-muted-text/30 bg-white dark:bg-dark-surface'">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                         [class]="selectedLevel() === level.id ? 'bg-nexo-violet text-white' : 'bg-surface dark:bg-dark-surface-high text-muted-text'">
                      {{ level.icon }}
                    </div>
                    <div>
                      <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ level.name }}</p>
                      <p class="text-xs text-muted-text dark:text-dark-muted mt-0.5">{{ level.description }}</p>
                    </div>
                  </div>
                </button>
              }
            </div>
          </div>
        }

        <!-- Step 4: Help Type -->
        @if (currentStep() === 3) {
          <div class="animate-fade-in">
            <div class="text-center mb-10">
              <div class="w-16 h-16 mx-auto mb-6 bg-nexo-violet/10 rounded-card-lg flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5B4BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                </svg>
              </div>
              <h1 class="text-heading-lg font-bold text-ink dark:text-dark-text mb-3">
                Como quieres recibir ayuda?
              </h1>
              <p class="text-muted-text dark:text-dark-muted max-w-md mx-auto">
                Elige el tipo de mentoria que mejor se adapte a tus necesidades
              </p>
            </div>

            <div class="space-y-3 max-w-lg mx-auto">
              @for (type of helpTypes; track type.id) {
                <button
                  (click)="helpType.set(type.id)"
                  class="w-full p-5 rounded-card-sm border-2 text-left transition-all duration-200"
                  [class]="helpType() === type.id
                    ? 'border-nexo-violet bg-nexo-violet/5'
                    : 'border-surface dark:border-dark-surface-high hover:border-muted-text/30 bg-white dark:bg-dark-surface'">
                  <div class="flex items-start gap-4">
                    <div class="w-12 h-12 rounded-card-sm flex items-center justify-center flex-shrink-0 transition-colors"
                         [class]="helpType() === type.id ? 'bg-nexo-violet text-white' : 'bg-surface dark:bg-dark-surface-high text-muted-text'">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [innerHTML]="type.iconPath"></svg>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ type.name }}</p>
                        <span class="text-xs font-medium px-2 py-0.5 rounded-pill"
                              [class]="helpType() === type.id
                                ? 'bg-nexo-violet/10 text-nexo-violet'
                                : 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted'">
                          {{ type.frequency }}
                        </span>
                      </div>
                      <p class="text-xs text-muted-text dark:text-dark-muted mt-1">{{ type.description }}</p>
                    </div>
                  </div>
                </button>
              }
            </div>
          </div>
        }
      </main>

      <!-- Footer Navigation -->
      <div class="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-t border-surface dark:border-dark-surface-high">
        <div class="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div class="text-sm text-muted-text dark:text-dark-muted">
            Paso {{ currentStep() + 1 }} de {{ totalSteps }}
          </div>
          <div class="flex items-center gap-3">
            @if (currentStep() > 0) {
              <nx-button variant="ghost" size="md" (clicked)="previousStep()">
                Atras
              </nx-button>
            }
            <nx-button
              variant="primary"
              size="md"
              [disabled]="!canProceed()"
              (clicked)="nextStep()">
              @if (currentStep() === totalSteps - 1) {
                Completar perfil
              } @else {
                Siguiente
              }
            </nx-button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OnboardingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  currentStep = signal(0);
  totalSteps = 4;

  stepLabels = ['Objetivo', 'Categoria', 'Nivel', 'Tipo de ayuda'];

  objective = '';
  objectiveSuggestions = [
    'Aprender Angular para mi primer empleo',
    'Cambiar de carrera a tecnologia',
    'Mejorar mis habilidades de liderazgo',
    'Conseguir promocion en mi empresa',
    'Empezar mi propio negocio',
  ];

  category = '';
  categories = [
    { id: 'frontend', name: 'Frontend', icon: '{}' },
    { id: 'backend', name: 'Backend', icon: '<>' },
    { id: 'design', name: 'Diseno', icon: '[]' },
    { id: 'leadership', name: 'Liderazgo', icon: '>>' },
    { id: 'data', name: 'Datos', icon: '##' },
    { id: 'devops', name: 'DevOps', icon: '//' },
    { id: 'career', name: 'Carrera', icon: '^^' },
  ];

  selectedTopics = signal<string[]>([]);

  categoryTopics: Record<string, string[]> = {
    frontend: ['React', 'Angular', 'Vue', 'CSS', 'TypeScript', 'Responsive Design'],
    backend: ['Node.js', 'Python', 'Java', 'Go', 'APIs', 'Microservicios'],
    design: ['UI/UX', 'Figma', 'Prototipos', 'Investigacion', 'Accesibilidad'],
    leadership: ['Gestion de equipos', 'Comunicacion', 'Toma de decisiones', 'Agile'],
    data: ['SQL', 'Python', 'Machine Learning', 'Visualizacion', 'Estadistica'],
    devops: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Monitoring'],
    career: ['Networking', 'Portafolio', 'Entrevistas', 'Negociacion salarial'],
  };

  selectedLevel = signal('');

  levels = [
    { id: 'beginner', name: 'Principiante', description: 'Recien empezando, busco fundamentos solidos', icon: '1' },
    { id: 'intermediate', name: 'Intermedio', description: 'Tengo bases, quiero profundizar y mejorar', icon: '2' },
    { id: 'advanced', name: 'Avanzado', description: 'Experiencia solida, busco especializacion y liderazgo', icon: '3' },
  ];

  helpType = signal('');

  helpTypes = [
    {
      id: 'quick',
      name: 'Sesiones puntuales',
      description: 'Resuelve dudas especificas en sesiones cortas',
      frequency: '1-2 por mes',
      iconPath: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
    },
    {
      id: 'deep',
      name: 'Mentoria profunda',
      description: 'Acompanamiento personalizado para metas concretas',
      frequency: 'Semanal',
      iconPath: '<path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>',
    },
    {
      id: 'ongoing',
      name: 'Acompanamiento continuo',
      description: 'Relacion a largo plazo con tu mentor de referencia',
      frequency: 'Mensual',
      iconPath: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    },
  ];

  role: 'mentee' | 'mentor' = 'mentee';

  ngOnInit(): void {
    const path = this.route.snapshot.url.map(s => s.path).join('/');
    this.role = path.includes('mentor') ? 'mentor' : 'mentee';
  }

  canSkip(): boolean {
    return this.currentStep() === 2 || this.currentStep() === 3;
  }

  canProceed(): boolean {
    switch (this.currentStep()) {
      case 0:
        return this.objective.trim().length > 0;
      case 1:
        return this.category !== '';
      case 2:
        return this.selectedLevel() !== '';
      case 3:
        return this.helpType() !== '';
      default:
        return false;
    }
  }

  nextStep(): void {
    if (!this.canProceed()) return;

    if (this.currentStep() < this.totalSteps - 1) {
      this.currentStep.update(s => s + 1);
    } else {
      this.completeOnboarding();
    }
  }

  previousStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update(s => s - 1);
    }
  }

  skipStep(): void {
    if (this.currentStep() < this.totalSteps - 1) {
      this.currentStep.update(s => s + 1);
    }
  }

  selectCategory(id: string): void {
    this.category = id;
    this.selectedTopics.set([]);
  }

  toggleTopic(topic: string): void {
    this.selectedTopics.update(topics => {
      if (topics.includes(topic)) {
        return topics.filter(t => t !== topic);
      }
      return [...topics, topic];
    });
  }

  getCategoryName(id: string): string {
    return this.categories.find(c => c.id === id)?.name ?? '';
  }

  getCategoryTopics(id: string): string[] {
    return this.categoryTopics[id] ?? [];
  }

  private completeOnboarding(): void {
    const role = this.authService.getUserRole();
    if (role === 'mentor') {
      this.router.navigate(['/dashboard/mentor']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }
}
