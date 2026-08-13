import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';

interface Mentorship {
  id: string;
  title: string;
  description: string;
  type: string;
  duration: string;
  price: number;
  isFree: boolean;
  slots: number;
  includes: string[];
  targetAudience: string;
  bookings: number;
  rating: number;
}

@Component({
  selector: 'app-mentorship-management',
  standalone: true,
  imports: [FormsModule, CardComponent, ButtonComponent, BadgeComponent, SkeletonComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-ink dark:text-dark-text">Mentorias</h1>
          <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Crea y gestiona tus mentorías disponibles</p>
        </div>
        <nx-button size="sm" variant="primary" (clicked)="showForm.set(!showForm())">
          @if (showForm()) {
            Cerrar
          } @else {
            Nueva mentoría
          }
        </nx-button>
      </div>

      <!-- Create/Edit Form -->
      @if (showForm()) {
        <nx-card [hover]="false">
          <h3 class="text-lg font-bold text-ink dark:text-dark-text mb-5">
            {{ editingId() ? 'Editar mentoría' : 'Crear nueva mentoría' }}
          </h3>
          <form (ngSubmit)="saveMentorship()" class="space-y-5">
            <!-- Title -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Titulo de la mentoría</label>
              <input
                type="text"
                [(ngModel)]="form.title"
                name="title"
                placeholder="Ej: Sesión individual de orientación Frontend"
                class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Descripcion</label>
              <textarea
                [(ngModel)]="form.description"
                name="description"
                rows="3"
                placeholder="Describe qué aprenderá el alumno en esta mentoría..."
                class="input-nexo text-sm resize-none"
                required
              ></textarea>
            </div>

            <!-- Type, Duration, Price row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Tipo</label>
                <select
                  [(ngModel)]="form.type"
                  name="type"
                  class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                >
                  <option value="individual">Individual</option>
                  <option value="package">Paquete</option>
                  <option value="continuous">Continua</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Duracion</label>
                <select
                  [(ngModel)]="form.duration"
                  name="duration"
                  class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                >
                  <option value="30 min">30 minutos</option>
                  <option value="60 min">60 minutos</option>
                  <option value="90 min">90 minutos</option>
                  <option value="120 min">120 minutos</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Slots por sesión</label>
                <input
                  type="number"
                  [(ngModel)]="form.slots"
                  name="slots"
                  min="1"
                  max="10"
                  class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                />
              </div>
            </div>

            <!-- Price & Free toggle -->
            <div class="flex items-center gap-4">
              <div class="flex-1">
                <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Precio (S/.)</label>
                <input
                  type="number"
                  [(ngModel)]="form.price"
                  name="price"
                  min="0"
                  [disabled]="form.isFree"
                  class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent disabled:opacity-50"
                />
              </div>
              <div class="pt-6">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="form.isFree"
                    name="isFree"
                    class="w-5 h-5 rounded border-surface dark:border-dark-surface-high text-nexo-violet focus:ring-nexo-violet"
                  />
                  <span class="text-sm font-semibold text-ink dark:text-dark-text">Gratuita</span>
                </label>
              </div>
            </div>

            <!-- Target Audience -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Publico objetivo</label>
              <input
                type="text"
                [(ngModel)]="form.targetAudience"
                name="targetAudience"
                placeholder="Ej: Desarrolladores frontendJunior/intermedio"
                class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
              />
            </div>

            <!-- Includes -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Que incluye</label>
              <div class="space-y-2">
                @for (item of form.includes; track $index; let i = $index) {
                  <div class="flex items-center gap-2">
                    <input
                      type="text"
                      [ngModel]="item"
                      [ngModelOptions]="{ standalone: true }"
                      (ngModelChange)="form.includes[i] = $event"
                      class="flex-1 px-4 py-2 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                      placeholder="Ej: Sesión grabada, recursos descargables"
                    />
                    <button
                      type="button"
                      class="text-muted-text hover:text-red-500 transition-colors p-1"
                      (click)="removeInclude(i)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                }
                <button
                  type="button"
                  class="flex items-center gap-1 text-sm text-nexo-violet hover:underline"
                  (click)="addInclude()"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Agregar item
                </button>
              </div>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <nx-button size="md" variant="primary">
                {{ editingId() ? 'Guardar cambios' : 'Crear mentoría' }}
              </nx-button>
              <nx-button size="md" variant="ghost" (clicked)="cancelEdit()">Cancelar</nx-button>
            </div>
          </form>
        </nx-card>
      }

      <!-- Mentorships List -->
      <section class="mt-6">
        @if (loading()) {
          <div class="space-y-4">
            @for (i of [1, 2]; track i) {
              <div class="bg-white dark:bg-dark-surface rounded-card-lg p-5 shadow-soft-sm">
                <div class="flex items-start gap-4">
                  <div class="flex-1 space-y-2">
                    <nx-skeleton width="60%" height="18px"></nx-skeleton>
                    <nx-skeleton width="90%" height="12px"></nx-skeleton>
                    <nx-skeleton width="40%" height="12px"></nx-skeleton>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (mentorships().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-3">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted font-medium">Aun no has creado mentorías</p>
              <p class="text-sm text-muted-text/60 dark:text-dark-muted/60 mt-1">Crea tu primera mentoría para empezar a recibir alumnos</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-4">
            @for (ms of mentorships(); track ms.id) {
              <nx-card [hover]="true">
                <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <h4 class="font-bold text-ink dark:text-dark-text">{{ ms.title }}</h4>
                      <nx-badge [variant]="ms.isFree ? 'lime' : 'cyan'" size="sm">
                        {{ ms.isFree ? 'Gratuita' : 'S/. ' + ms.price }}
                      </nx-badge>
                      <nx-badge variant="dark" size="sm">{{ ms.type }}</nx-badge>
                    </div>
                    <p class="text-sm text-muted-text dark:text-dark-muted line-clamp-2">{{ ms.description }}</p>
                    <div class="flex items-center gap-4 mt-3 text-xs text-muted-text dark:text-dark-muted">
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {{ ms.duration }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                        {{ ms.slots }} slot(s)
                      </span>
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                        {{ ms.bookings }} reservas
                      </span>
                      <span class="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        {{ ms.rating }}
                      </span>
                    </div>
                    @if (ms.includes.length > 0) {
                      <div class="flex flex-wrap gap-1.5 mt-3">
                        @for (inc of ms.includes; track inc) {
                          <nx-badge variant="lavender" size="sm">{{ inc }}</nx-badge>
                        }
                      </div>
                    }
                  </div>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <nx-button size="sm" variant="secondary" (clicked)="editMentorship(ms)">Editar</nx-button>
                    <nx-button size="sm" variant="ghost" (clicked)="deleteMentorship(ms.id)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </nx-button>
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
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `],
})
export class MentorshipManagementComponent {
  protected readonly loading = signal(true);
  protected readonly showForm = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected readonly mentorships = signal<Mentorship[]>([
    {
      id: 'ms-1',
      title: 'Sesión individual de orientación Frontend',
      description: 'Sesión de 60 minutos para resolver dudas específicas sobre desarrollo frontend, revisar código o planificar tu aprendizaje.',
      type: 'individual',
      duration: '60 min',
      price: 180,
      isFree: false,
      slots: 1,
      includes: ['Sesión 1:1 en videollamada', 'Grabación de la sesión', 'Feedback escrito post-sesión'],
      targetAudience: 'Desarrolladores frontend junior/intermedio',
      bookings: 32,
      rating: 4.9,
    },
    {
      id: 'ms-2',
      title: 'Preparación de entrevistas técnicas FAANG',
      description: 'Paquete de 3 sesiones para preparar entrevistas técnicas en empresas FAANG. Incluye práctica de coding challenges y system design.',
      type: 'package',
      duration: '90 min',
      price: 480,
      isFree: false,
      slots: 1,
      includes: ['3 sesiones de 90 min', 'Ejercicios personalizados', 'Simulacro de entrevista', 'Feedback detallado'],
      targetAudience: 'Desarrolladores que buscan empleo en FAANG',
      bookings: 15,
      rating: 4.8,
    },
    {
      id: 'ms-3',
      title: 'Mentoría gratuita de bienvenida',
      description: 'Sesión de 30 minutos para conocernos, entender tus objetivos y definir un plan de mentoría personalizado.',
      type: 'individual',
      duration: '30 min',
      price: 0,
      isFree: true,
      slots: 1,
      includes: ['Sesión de bienvenida', 'Plan de aprendizaje personalizado'],
      targetAudience: 'Cualquier persona interesada en mentoría',
      bookings: 40,
      rating: 5.0,
    },
  ]);

  protected form = this.getEmptyForm();

  constructor() {
    setTimeout(() => this.loading.set(false), 500);
  }

  protected saveMentorship(): void {
    if (this.editingId()) {
      this.mentorships.update(ms =>
        ms.map(m =>
          m.id === this.editingId()
            ? { ...m, ...this.form }
            : m
        )
      );
    } else {
      const newMs: Mentorship = {
        id: 'ms-' + Date.now(),
        ...this.form,
        bookings: 0,
        rating: 0,
      };
      this.mentorships.update(ms => [newMs, ...ms]);
    }
    this.cancelEdit();
  }

  protected editMentorship(ms: Mentorship): void {
    this.editingId.set(ms.id);
    this.form = {
      title: ms.title,
      description: ms.description,
      type: ms.type,
      duration: ms.duration,
      price: ms.price,
      isFree: ms.isFree,
      slots: ms.slots,
      includes: [...ms.includes],
      targetAudience: ms.targetAudience,
    };
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected deleteMentorship(id: string): void {
    this.mentorships.update(ms => ms.filter(m => m.id !== id));
  }

  protected cancelEdit(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.form = this.getEmptyForm();
  }

  protected addInclude(): void {
    this.form.includes.push('');
  }

  protected removeInclude(index: number): void {
    this.form.includes.splice(index, 1);
  }

  private getEmptyForm() {
    return {
      title: '',
      description: '',
      type: 'individual',
      duration: '60 min',
      price: 0,
      isFree: false,
      slots: 1,
      includes: [''],
      targetAudience: '',
    };
  }
}
