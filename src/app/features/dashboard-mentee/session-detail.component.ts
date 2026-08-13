import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SkeletonComponent } from '../../shared/ui/skeleton.component';
import {
  DEMO_MENTEE_SESSIONS,
} from '../../core/data/demo.data';
import { ALL_MENTORS } from '../../core/data/mentors.data';
import { Booking } from '../../core/models/booking.model';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';

/** Format a Date as the `yyyy-MM-dd` value an `<input type="date">` expects. */
function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [
    RouterLink,
    CardComponent,
    BadgeComponent,
    ButtonComponent,
    SkeletonComponent,
  ],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Back link -->
      <a routerLink="/mentorias" class="inline-flex items-center gap-1.5 text-sm font-medium text-muted-text hover:text-ink dark:hover:text-dark-text transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver a mentorias
      </a>

      @if (session()) {
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-serif font-bold text-ink dark:text-dark-text">Detalle de sesion</h1>
              <nx-badge [variant]="statusBadgeVariant()" size="md">{{ statusLabel() }}</nx-badge>
            </div>
            <p class="text-muted-text dark:text-dark-muted">{{ session()!.objective }}</p>
          </div>
          @if (session()!.status === 'upcoming') {
            <nx-button variant="primary" size="md" (clicked)="joinCall()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
              Unirse a videollamada
            </nx-button>
          }
        </div>

        <!-- Mentor info -->
        <nx-card [hover]="false">
          <div class="flex items-center gap-4">
            <img [src]="mentorPhoto()" [alt]="mentorName()" class="w-14 h-14 rounded-full object-cover bg-surface" loading="lazy" />
            <div>
              <h3 class="font-semibold text-ink dark:text-dark-text">{{ mentorName() }}</h3>
              <p class="text-sm text-muted-text dark:text-dark-muted">{{ mentorTitle() }}</p>
            </div>
          </div>
        </nx-card>

        <!-- Session Info -->
        <nx-card [hover]="false">
          <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Informacion de la sesion</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-nexo-violet/10 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-muted-text dark:text-dark-muted">Fecha</p>
                <p class="text-sm font-medium text-ink dark:text-dark-text">{{ formatDate(session()!.date) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-electric-cyan/10 flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-electric-cyan">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <p class="text-xs text-muted-text dark:text-dark-muted">Hora y duracion</p>
                <p class="text-sm font-medium text-ink dark:text-dark-text">{{ session()!.time }} - {{ session()!.duration }} min</p>
              </div>
            </div>
          </div>
        </nx-card>

        <!-- Context -->
        <nx-card [hover]="false">
          <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-3">Contexto</h3>
          <p class="text-sm text-muted-text dark:text-dark-muted leading-relaxed">{{ session()!.context }}</p>
        </nx-card>

        <!-- Upcoming: Preparation -->
        @if (session()!.status === 'upcoming') {
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Preparacion para la sesion</h3>
            <div class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-nexo-violet">1</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-ink dark:text-dark-text">Revisa tu objetivo</p>
                  <p class="text-sm text-muted-text dark:text-dark-muted">{{ session()!.objective }}</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-nexo-violet">2</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-ink dark:text-dark-text">Prepara tus dudas</p>
                  <p class="text-sm text-muted-text dark:text-dark-muted">Escribe las preguntas que quieras hacer durante la sesion</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-nexo-violet/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs font-bold text-nexo-violet">3</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-ink dark:text-dark-text">Verifica tu conexion</p>
                  <p class="text-sm text-muted-text dark:text-dark-muted">Asegurate de tener una buena conexion a internet y un ambiente tranquilo</p>
                </div>
              </div>
            </div>
          </nx-card>

          <!-- Cancellation / reschedule policy (§33) -->
          <nx-card [hover]="false">
            <div class="flex items-start justify-between gap-4 mb-3">
              <h3 class="text-base font-semibold text-ink dark:text-dark-text">
                Cancelar o reprogramar
              </h3>
              <nx-badge [variant]="policy().canCancel ? 'lavender' : 'dark'" size="sm">
                {{ policy().canCancel ? 'Flexible' : 'Menos de 24 h' }}
              </nx-badge>
            </div>

            <p class="text-sm text-muted-text dark:text-dark-muted leading-relaxed mb-4">
              {{ policy().reason }}
            </p>

            @if (rescheduleOpen()) {
              <div class="p-4 bg-surface dark:bg-dark-surface-high rounded-card-sm space-y-3">
                <p class="text-sm font-medium text-ink dark:text-dark-text">Elige un nuevo horario</p>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label class="block">
                    <span class="block text-xs font-semibold text-muted-text dark:text-dark-muted mb-1">Fecha</span>
                    <input
                      type="date"
                      [value]="rescheduleDate()"
                      [min]="minRescheduleDate()"
                      (change)="rescheduleDate.set($any($event.target).value)"
                      class="w-full px-3 py-2 bg-white dark:bg-dark-surface text-ink dark:text-dark-text rounded-input border-0 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet/30"
                    />
                  </label>
                  <label class="block">
                    <span class="block text-xs font-semibold text-muted-text dark:text-dark-muted mb-1">Hora</span>
                    <input
                      type="time"
                      [value]="rescheduleTime()"
                      (change)="rescheduleTime.set($any($event.target).value)"
                      class="w-full px-3 py-2 bg-white dark:bg-dark-surface text-ink dark:text-dark-text rounded-input border-0 text-sm focus:outline-none focus:ring-2 focus:ring-nexo-violet/30"
                    />
                  </label>
                </div>
                @if (policy().requiresMentorApproval) {
                  <p class="text-xs text-muted-text dark:text-dark-muted">
                    Tu mentor recibirá la solicitud y deberá confirmarla.
                  </p>
                }
                @if (actionError()) {
                  <p class="text-sm text-red-600 dark:text-red-400" role="alert">{{ actionError() }}</p>
                }
                <div class="flex flex-wrap gap-2">
                  <nx-button variant="primary" size="sm" (clicked)="confirmReschedule()">
                    Confirmar nuevo horario
                  </nx-button>
                  <nx-button variant="ghost" size="sm" (clicked)="closeReschedule()">Volver</nx-button>
                </div>
              </div>
            } @else {
              <div class="flex flex-wrap gap-2">
                @if (policy().canReschedule) {
                  <nx-button variant="secondary" size="sm" (clicked)="openReschedule()">
                    {{ policy().requiresMentorApproval ? 'Solicitar reprogramación' : 'Reprogramar' }}
                  </nx-button>
                }
                <nx-button
                  variant="ghost"
                  size="sm"
                  [disabled]="!policy().canCancel"
                  (clicked)="cancelSession()"
                >
                  Cancelar sesión
                </nx-button>
              </div>
              @if (actionError()) {
                <p class="text-sm text-red-600 dark:text-red-400 mt-3" role="alert">{{ actionError() }}</p>
              }
            }
          </nx-card>
        }

        <!-- Completed: Post-session -->
        @if (session()!.status === 'completed') {
          <nx-card [hover]="false">
            <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-4">Notas de la sesion</h3>
            <div class="space-y-4">
              <div>
                <p class="text-xs font-semibold text-muted-text dark:text-dark-muted uppercase tracking-wide mb-1">Objetivo</p>
                <p class="text-sm text-ink dark:text-dark-text">{{ session()!.objective }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-muted-text dark:text-dark-muted uppercase tracking-wide mb-1">Siguientes pasos</p>
                <ul class="space-y-2">
                  <li class="flex items-start gap-2 text-sm text-ink dark:text-dark-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet mt-0.5 flex-shrink-0">
                      <polyline points="9 11 12 14 22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Continuar practicando ejercicios de coding
                  </li>
                  <li class="flex items-start gap-2 text-sm text-ink dark:text-dark-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet mt-0.5 flex-shrink-0">
                      <polyline points="9 11 12 14 22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Revisar los recursos compartidos por el mentor
                  </li>
                  <li class="flex items-start gap-2 text-sm text-ink dark:text-dark-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nexo-violet mt-0.5 flex-shrink-0">
                      <polyline points="9 11 12 14 22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    Aplicar lo aprendido en el proyecto practico
                  </li>
                </ul>
              </div>
              <div>
                <p class="text-xs font-semibold text-muted-text dark:text-dark-muted uppercase tracking-wide mb-1">Recursos</p>
                <div class="flex flex-wrap gap-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface dark:bg-dark-surface-high rounded-pill text-xs font-medium text-ink dark:text-dark-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Guia de Angular Services
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface dark:bg-dark-surface-high rounded-pill text-xs font-medium text-ink dark:text-dark-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Ejercicios de RxJS
                  </span>
                </div>
              </div>
            </div>
          </nx-card>
        }

        <!-- Cancelled -->
        @if (session()!.status === 'cancelled') {
          <nx-card [hover]="false">
            <div class="text-center py-6">
              <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h3 class="text-base font-semibold text-ink dark:text-dark-text mb-1">Sesion cancelada</h3>
              <p class="text-sm text-muted-text dark:text-dark-muted mb-4">Esta sesion fue cancelada. Puedes agendar una nueva sesion con tu mentor.</p>
              <a routerLink="/explorar" class="btn-primary btn-md">Agendar nueva sesión</a>
            </div>
          </nx-card>
        }
      } @else {
        <!-- Loading skeleton -->
        <div class="space-y-4">
          <nx-skeleton height="24px" width="200px" />
          <nx-skeleton height="16px" width="300px" />
          <nx-skeleton height="200px" />
          <nx-skeleton height="120px" />
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
})
export class SessionDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookingService = inject(BookingService);
  private readonly notifications = inject(NotificationService);

  protected readonly session = signal<Booking | null>(null);
  protected readonly loading = signal(true);

  protected readonly rescheduleOpen = signal(false);
  protected readonly rescheduleDate = signal('');
  protected readonly rescheduleTime = signal('');
  protected readonly actionError = signal('');

  /** Cancellation rules for the session on screen (§33). */
  protected readonly policy = computed(() => {
    const s = this.session();
    if (!s) {
      return {
        canCancel: false,
        canReschedule: false,
        requiresMentorApproval: false,
        hoursUntilSession: 0,
        reason: '',
      };
    }
    return this.bookingService.getCancellationPolicy(s);
  });

  /** A reschedule can never target a past day. */
  protected readonly minRescheduleDate = computed(() => toDateInputValue(new Date()));

  protected openReschedule(): void {
    const s = this.session();
    if (!s) return;

    this.actionError.set('');
    this.rescheduleDate.set(toDateInputValue(s.date));
    this.rescheduleTime.set(s.time);
    this.rescheduleOpen.set(true);
  }

  protected closeReschedule(): void {
    this.rescheduleOpen.set(false);
    this.actionError.set('');
  }

  protected confirmReschedule(): void {
    const s = this.session();
    if (!s) return;

    const dateValue = this.rescheduleDate();
    const timeValue = this.rescheduleTime();

    if (!dateValue || !timeValue) {
      this.actionError.set('Elige una fecha y una hora para continuar.');
      return;
    }

    const [year, month, day] = dateValue.split('-').map(Number);
    const updated = this.bookingService.reschedule(s, new Date(year, month - 1, day), timeValue);

    if (!updated) {
      this.actionError.set('Ese horario no es válido. Elige un momento futuro.');
      return;
    }

    this.session.set(updated);
    this.rescheduleOpen.set(false);
    this.actionError.set('');

    if (this.bookingService.getCancellationPolicy(s).requiresMentorApproval) {
      this.notifications.success(
        'Solicitud enviada',
        'Tu mentor revisará la reprogramación y te confirmará.'
      );
    } else {
      this.notifications.success('Sesión reprogramada', 'Actualizamos la fecha de tu mentoría.');
    }
  }

  protected cancelSession(): void {
    const s = this.session();
    if (!s) return;

    const updated = this.bookingService.cancel(s);

    if (!updated) {
      this.actionError.set(this.bookingService.getCancellationPolicy(s).reason);
      return;
    }

    this.session.set(updated);
    this.actionError.set('');
    this.notifications.success('Sesión cancelada', 'Puedes agendar una nueva cuando quieras.');
  }

  protected readonly statusBadgeVariant = computed(() => {
    const s = this.session();
    if (!s) return 'violet' as const;
    const map: Record<string, 'violet' | 'lime' | 'dark'> = {
      upcoming: 'violet',
      completed: 'lime',
      cancelled: 'dark',
    };
    return map[s.status];
  });

  protected readonly statusLabel = computed(() => {
    const s = this.session();
    if (!s) return '';
    const map: Record<string, string> = {
      upcoming: 'Proxima',
      completed: 'Completada',
      cancelled: 'Cancelada',
    };
    return map[s.status];
  });

  protected readonly mentorName = computed(() => {
    const s = this.session();
    if (!s) return '';
    return ALL_MENTORS.find(m => m.id === s.mentorId)?.name ?? 'Mentor';
  });

  protected readonly mentorTitle = computed(() => {
    const s = this.session();
    if (!s) return '';
    return ALL_MENTORS.find(m => m.id === s.mentorId)?.title ?? '';
  });

  protected readonly mentorPhoto = computed(() => {
    const s = this.session();
    if (!s) return '';
    return ALL_MENTORS.find(m => m.id === s.mentorId)?.photo ?? '';
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = DEMO_MENTEE_SESSIONS.find(s => s.id === id);
      if (found) {
        this.session.set(found);
      }
    }
    this.loading.set(false);
  }

  joinCall(): void {
    alert('En un entorno real, esto abria la videollamada.');
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
}
