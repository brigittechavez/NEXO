import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CardComponent } from '../../shared/ui/card.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DEMO_MENTOR_ACTIVE_MENTEES } from '../../core/data/demo.data';

interface FollowUp {
  id: string;
  menteeId: string;
  menteeName: string;
  type: string;
  message: string;
  dueDate: Date;
  completed: boolean;
}

@Component({
  selector: 'app-follow-ups',
  standalone: true,
  imports: [FormsModule, DatePipe, CardComponent, ButtonComponent, BadgeComponent],
  template: `
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-ink dark:text-dark-text">Seguimientos</h1>
        <p class="text-sm text-muted-text dark:text-dark-muted mt-1">Crea y gestiona seguimientos con tus alumnos</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 p-1 bg-surface dark:bg-dark-surface-high rounded-pill mb-6 max-w-xs">
        <button
          class="flex-1 px-4 py-2 text-sm font-semibold rounded-pill transition-all duration-200"
          [class]="activeTab() === 'create' ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm' : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeTab.set('create')"
        >
          Crear
        </button>
        <button
          class="flex-1 px-4 py-2 text-sm font-semibold rounded-pill transition-all duration-200"
          [class]="activeTab() === 'pending' ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm' : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeTab.set('pending')"
        >
          Pendientes ({{ pendingFollowUps().length }})
        </button>
        <button
          class="flex-1 px-4 py-2 text-sm font-semibold rounded-pill transition-all duration-200"
          [class]="activeTab() === 'completed' ? 'bg-white dark:bg-dark-surface text-ink dark:text-dark-text shadow-soft-sm' : 'text-muted-text dark:text-dark-muted hover:text-ink dark:hover:text-dark-text'"
          (click)="activeTab.set('completed')"
        >
          Completados ({{ completedFollowUps().length }})
        </button>
      </div>

      <!-- Create Form -->
      @if (activeTab() === 'create') {
        <nx-card [hover]="false">
          <h3 class="text-lg font-bold text-ink dark:text-dark-text mb-5">Nuevo seguimiento</h3>
          <form (ngSubmit)="createFollowUp()" class="space-y-5">
            <!-- Mentee selector -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Alumno</label>
              <select
                [(ngModel)]="newFollowUp.menteeId"
                name="menteeId"
                class="w-full px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                required
              >
                <option value="">Seleccionar alumno</option>
                @for (mentee of mentees; track mentee.menteeId) {
                  <option [value]="mentee.menteeId">{{ mentee.menteeName }}</option>
                }
              </select>
            </div>

            <!-- Follow-up type -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Tipo de seguimiento</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                @for (ft of followUpTypes; track ft.value) {
                  <button
                    type="button"
                    class="p-3 rounded-xl border-2 text-left transition-all duration-200"
                    [class]="newFollowUp.type === ft.value
                      ? 'border-nexo-violet bg-nexo-violet/5'
                      : 'border-surface dark:border-dark-surface-high hover:border-nexo-violet/30'"
                    (click)="newFollowUp.type = ft.value"
                  >
                    <span class="text-sm font-semibold text-ink dark:text-dark-text block">{{ ft.label }}</span>
                    <span class="text-xs text-muted-text dark:text-dark-muted">{{ ft.description }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Message -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Mensaje</label>
              <textarea
                [(ngModel)]="newFollowUp.message"
                name="message"
                rows="3"
                placeholder="Describe el seguimiento que deseas realizar..."
                class="input-nexo text-sm resize-none"
                required
              ></textarea>
            </div>

            <!-- Due date -->
            <div>
              <label class="block text-sm font-semibold text-ink dark:text-dark-text mb-2">Fecha de vencimiento</label>
              <input
                type="date"
                [(ngModel)]="newFollowUp.dueDate"
                name="dueDate"
                class="px-4 py-2.5 rounded-pill border border-surface dark:border-dark-surface-high bg-white dark:bg-dark-surface text-ink dark:text-dark-text text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet focus:border-transparent"
                required
              />
            </div>

            <div class="flex items-center gap-3 pt-2">
              <nx-button size="md" variant="primary">
                Crear seguimiento
              </nx-button>
              <nx-button size="md" variant="ghost" (clicked)="resetForm()">Cancelar</nx-button>
            </div>
          </form>
        </nx-card>
      }

      <!-- Pending Follow-ups -->
      @if (activeTab() === 'pending') {
        @if (pendingFollowUps().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted font-medium">Sin seguimientos pendientes</p>
              <p class="text-sm text-muted-text/60 dark:text-dark-muted/60 mt-1">Crea un nuevo seguimiento desde la pestana "Crear"</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (fu of pendingFollowUps(); track fu.id) {
              <nx-card [hover]="true">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-3 min-w-0">
                    <div class="w-9 h-9 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 flex-wrap">
                        <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ fu.menteeName }}</p>
                        <nx-badge variant="lavender" size="sm">{{ fu.type }}</nx-badge>
                      </div>
                      <p class="text-sm text-muted-text dark:text-dark-muted mt-1">{{ fu.message }}</p>
                      <p class="text-xs text-muted-text/60 dark:text-dark-muted/60 mt-1.5">Vence: {{ fu.dueDate | date:'dd MMM yyyy' }}</p>
                    </div>
                  </div>
                  <nx-button size="sm" variant="primary" (clicked)="completeFollowUp(fu.id)">
                    Completar
                  </nx-button>
                </div>
              </nx-card>
            }
          </div>
        }
      }

      <!-- Completed Follow-ups -->
      @if (activeTab() === 'completed') {
        @if (completedFollowUps().length === 0) {
          <nx-card [hover]="false">
            <div class="text-center py-10">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-muted-text/40 mx-auto mb-3">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p class="text-muted-text dark:text-dark-muted font-medium">Aun no hay seguimientos completados</p>
            </div>
          </nx-card>
        } @else {
          <div class="space-y-3">
            @for (fu of completedFollowUps(); track fu.id) {
              <nx-card [hover]="false">
                <div class="flex items-start gap-3 opacity-70">
                  <div class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-green-600">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <p class="text-sm font-semibold text-ink dark:text-dark-text">{{ fu.menteeName }}</p>
                      <nx-badge variant="lime" size="sm">{{ fu.type }}</nx-badge>
                    </div>
                    <p class="text-sm text-muted-text dark:text-dark-muted mt-1">{{ fu.message }}</p>
                  </div>
                </div>
              </nx-card>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class FollowUpsComponent {
  protected readonly activeTab = signal<'create' | 'pending' | 'completed'>('pending');
  protected readonly mentees = DEMO_MENTOR_ACTIVE_MENTEES;

  protected readonly followUpTypes = [
    { value: 'check-in', label: 'Check-in', description: 'Estado general del alumno' },
    { value: 'task-review', label: 'Revision de tarea', description: 'Revisar entregables pendientes' },
    { value: 'recommendation', label: 'Recomendacion', description: 'Sugerir recursos o proximos pasos' },
  ];

  protected readonly pendingFollowUps = signal<FollowUp[]>([
    { id: 'fu-1', menteeId: 'mentee-1', menteeName: 'María García', type: 'Revision de tarea', message: 'Revisar avance del proyecto e-commerce en Angular', dueDate: new Date('2025-08-23'), completed: false },
    { id: 'fu-2', menteeId: 'mentee-3', menteeName: 'Luis Paredes', type: 'Check-in', message: 'Verificar progreso en preparación de entrevistas FAANG', dueDate: new Date('2025-08-26'), completed: false },
    { id: 'fu-3', menteeId: 'mentee-2', menteeName: 'Andrea Vásquez', type: 'Recomendacion', message: 'Enviar recursos de React hooks avanzados', dueDate: new Date('2025-08-20'), completed: false },
  ]);

  protected readonly completedFollowUps = signal<FollowUp[]>([
    { id: 'fu-c1', menteeId: 'mentee-1', menteeName: 'María García', type: 'Check-in', message: 'Revisar progreso en modulo de Angular', dueDate: new Date('2025-08-10'), completed: true },
  ]);

  protected newFollowUp = {
    menteeId: '',
    type: 'check-in',
    message: '',
    dueDate: '',
  };

  protected createFollowUp(): void {
    if (!this.newFollowUp.menteeId || !this.newFollowUp.message || !this.newFollowUp.dueDate) return;

    const mentee = this.mentees.find(m => m.menteeId === this.newFollowUp.menteeId);
    if (!mentee) return;

    const followUp: FollowUp = {
      id: 'fu-' + Date.now(),
      menteeId: this.newFollowUp.menteeId,
      menteeName: mentee.menteeName,
      type: this.followUpTypes.find(t => t.value === this.newFollowUp.type)?.label || 'Check-in',
      message: this.newFollowUp.message,
      dueDate: new Date(this.newFollowUp.dueDate),
      completed: false,
    };

    this.pendingFollowUps.update(fus => [followUp, ...fus]);
    this.resetForm();
    this.activeTab.set('pending');
  }

  protected completeFollowUp(id: string): void {
    const fu = this.pendingFollowUps().find(f => f.id === id);
    if (!fu) return;
    this.pendingFollowUps.update(fus => fus.filter(f => f.id !== id));
    this.completedFollowUps.update(fus => [{ ...fu, completed: true }, ...fus]);
  }

  protected resetForm(): void {
    this.newFollowUp = { menteeId: '', type: 'check-in', message: '', dueDate: '' };
  }
}
