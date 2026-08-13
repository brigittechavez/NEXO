import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MentorDetail } from '../../core/data/mentors.data';
import { Mentorship } from '../../core/models/mentorship.model';
import { MentorService } from '../../core/services/mentor.service';
import { BookingStepIndicatorComponent, BookingStep } from '../../shared/ui/booking-step-indicator.component';
import { AvailabilityCalendarComponent } from '../../shared/ui/availability-calendar.component';
import { CheckoutSummaryComponent } from '../../shared/ui/checkout-summary.component';
import { SuccessStateComponent } from '../../shared/ui/success-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    BookingStepIndicatorComponent,
    AvailabilityCalendarComponent,
    CheckoutSummaryComponent,
    SuccessStateComponent,
    ErrorStateComponent,
  ],
  template: `
    @if (error()) {
      <div class="min-h-[60vh] flex items-center justify-center">
        <nx-error-state
          title="No encontramos al mentor"
          message="El mentor que buscas no existe o no está disponible en este momento."
          retryLabel="Volver a explorar"
          (retry)="router.navigate(['/explorar'])"
        />
      </div>
    } @else if (mentor()) {
      <div class="min-h-screen bg-off-white dark:bg-dark-bg">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div class="mb-2">
            <a
              [routerLink]="['/mentor', mentor()!.id]"
              class="inline-flex items-center gap-1.5 text-sm text-muted-text dark:text-dark-muted hover:text-nexo-violet transition-colors"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver al perfil
            </a>
          </div>

          <h1 class="font-heading font-bold text-2xl sm:text-3xl text-ink dark:text-dark-text mb-2">
            Reservar mentoría con {{ mentor()!.name }}
          </h1>
          <p class="text-muted-text dark:text-dark-muted mb-8">
            {{ stepDescriptions[currentStep()] }}
          </p>

          <nx-booking-step-indicator
            [steps]="steps"
            [currentStep]="currentStep()"
          />

          <div class="mt-8">
            @if (currentStep() === 0) {
              <div class="space-y-4">
                <h2 class="font-heading font-bold text-xl text-ink dark:text-dark-text mb-4">Elige el tipo de mentoría</h2>
                @for (ms of mentor()!.mentorshipDetails; track ms.id) {
                  <button
                    class="w-full text-left p-5 rounded-card-lg border-2 transition-all duration-200"
                    [class]="selectedMentorship()?.id === ms.id
                      ? 'border-nexo-violet bg-nexo-violet/5'
                      : 'border-surface/50 dark:border-dark-surface-high/50 bg-white dark:bg-dark-surface hover:border-nexo-violet/30'"
                    (click)="selectMentorship(ms)"
                  >
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                        <h3 class="font-semibold text-ink dark:text-dark-text mb-1">{{ ms.title }}</h3>
                        <p class="text-sm text-muted-text dark:text-dark-muted mb-3">{{ ms.description }}</p>
                        <div class="flex flex-wrap gap-2">
                          @for (item of ms.includes; track item) {
                            <span class="text-xs px-2.5 py-1 bg-surface/50 dark:bg-dark-surface-high/50 text-muted-text dark:text-dark-muted rounded-full">
                              {{ item }}
                            </span>
                          }
                        </div>
                      </div>
                      <div class="text-right flex-shrink-0">
                        @if (ms.isFree) {
                          <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400">Gratis</span>
                        } @else {
                          <span class="text-lg font-bold text-ink dark:text-dark-text">S/ {{ ms.price }}</span>
                        }
                        <p class="text-xs text-muted-text dark:text-dark-muted mt-1">{{ ms.duration }}</p>
                      </div>
                    </div>
                  </button>
                }
                @if (mentor()!.mentorshipDetails.length === 0) {
                  <div class="text-center py-12 bg-surface/30 dark:bg-dark-surface-high/30 rounded-card-lg">
                    <p class="text-muted-text dark:text-dark-muted">Este mentor no tiene mentorías disponibles por el momento.</p>
                  </div>
                }
              </div>
            }

            @if (currentStep() === 1) {
              <div>
                <nx-availability-calendar
                  [availability]="mentor()!.availability"
                  (slotSelected)="onSlotSelected($event)"
                />
                @if (selectedDate()) {
                  <div class="mt-6 flex justify-end">
                    <button
                      class="px-6 py-3 bg-nexo-violet text-white font-semibold rounded-pill hover:bg-electric-indigo transition-colors duration-200"
                      (click)="nextStep()"
                    >
                      Continuar
                    </button>
                  </div>
                }
              </div>
            }

            @if (currentStep() === 2) {
              <div class="max-w-lg">
                <h2 class="font-heading font-bold text-xl text-ink dark:text-dark-text mb-2">Cuéntanos sobre tu sesión</h2>
                <p class="text-sm text-muted-text dark:text-dark-muted mb-6">
                  Esta información ayuda a {{ mentor()!.name }} a prepararse para tu mentoría.
                </p>

                <div class="space-y-5">
                  <div>
                    <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                      ¿Cuál es tu objetivo principal?
                    </label>
                    <input
                      type="text"
                      class="w-full px-4 py-3 bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text placeholder-muted-text dark:placeholder-dark-muted rounded-input border-0 text-base font-sans transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet/30 focus:bg-white dark:focus:bg-dark-surface-high"
                      placeholder="Ej: Quiero aprender Angular desde cero"
                      [ngModel]="objective()"
                      (ngModelChange)="objective.set($event)"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                      Contexto breve de tu situación
                    </label>
                    <textarea
                      rows="3"
                      class="w-full px-4 py-3 bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text placeholder-muted-text dark:placeholder-dark-muted rounded-input border-0 text-base font-sans transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet/30 focus:bg-white dark:focus:bg-dark-surface-high resize-none"
                      placeholder="Cuéntanos brevemente tu situación actual..."
                      [ngModel]="context()"
                      (ngModelChange)="context.set($event)"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-ink dark:text-dark-text mb-1.5">
                      ¿Qué esperas resolver en esta sesión?
                    </label>
                    <textarea
                      rows="3"
                      class="w-full px-4 py-3 bg-surface dark:bg-dark-surface-high text-ink dark:text-dark-text placeholder-muted-text dark:placeholder-dark-muted rounded-input border-0 text-base font-sans transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nexo-violet/30 focus:bg-white dark:focus:bg-dark-surface-high resize-none"
                      placeholder="Describe qué resultados esperas..."
                      [ngModel]="expectations()"
                      (ngModelChange)="expectations.set($event)"
                    ></textarea>
                  </div>
                </div>

                <div class="mt-8 flex justify-between">
                  <button
                    class="px-6 py-3 text-muted-text dark:text-dark-muted font-semibold rounded-pill hover:bg-surface dark:hover:bg-dark-surface-high transition-colors duration-200"
                    (click)="prevStep()"
                  >
                    Atrás
                  </button>
                  <button
                    class="px-6 py-3 bg-nexo-violet text-white font-semibold rounded-pill hover:bg-electric-indigo transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    [disabled]="!objective()"
                    (click)="nextStep()"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            }

            @if (currentStep() === 3) {
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 class="font-heading font-bold text-xl text-ink dark:text-dark-text mb-4">Revisa tu reserva</h2>
                  <nx-checkout-summary
                    [mentor]="mentor()!"
                    [mentorship]="selectedMentorship()!"
                    [date]="selectedDate()!"
                    [time]="selectedTime()!"
                    [objective]="objective()"
                    [processing]="processingPayment()"
                    [selectedPayment]="true"
                    (pay)="processPayment()"
                  />
                </div>

                <div class="flex flex-col justify-between">
                  <div class="bg-white dark:bg-dark-surface rounded-card-lg border border-surface/50 dark:border-dark-surface-high/50 p-6">
                    <h3 class="font-heading font-bold text-lg text-ink dark:text-dark-text mb-3">Lo que incluye</h3>
                    <ul class="space-y-2.5">
                      @for (item of selectedMentorship()!.includes; track item) {
                        <li class="flex items-start gap-2.5 text-sm text-muted-text dark:text-dark-muted">
                          <svg class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          {{ item }}
                        </li>
                      }
                    </ul>
                  </div>

                  <div class="mt-6 flex justify-between">
                    <button
                      class="px-6 py-3 text-muted-text dark:text-dark-muted font-semibold rounded-pill hover:bg-surface dark:hover:bg-dark-surface-high transition-colors duration-200"
                      [disabled]="processingPayment()"
                      (click)="prevStep()"
                    >
                      Atrás
                    </button>
                  </div>
                </div>
              </div>
            }

            @if (currentStep() === 4) {
              <div class="min-h-[40vh] flex items-center justify-center">
                <nx-success-state
                  title="¡Reserva confirmada!"
                  [message]="'Tu sesión con ' + mentor()!.name + ' está agendada para el ' + selectedDate() + ' a las ' + selectedTime() + '. Recibirás un correo con el link de la videoconferencia y los detalles de la mentoría.'"
                  actionLabel="Ver mis mentorías"
                  actionRoute="/mentorias"
                />
              </div>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-[60vh] flex items-center justify-center">
        <div class="text-center">
          <svg class="animate-spin w-8 h-8 text-nexo-violet mx-auto mb-4" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <p class="text-muted-text dark:text-dark-muted">Cargando información del mentor...</p>
        </div>
      </div>
    }
  `,
})
export class BookingComponent implements OnInit {
  readonly steps: BookingStep[] = [
    { label: 'Mentoría' },
    { label: 'Fecha' },
    { label: 'Detalles' },
    { label: 'Pago' },
    { label: 'Confirmación' },
  ];

  readonly mentor = signal<MentorDetail | null>(null);
  readonly error = signal(false);
  readonly currentStep = signal(0);

  readonly selectedMentorship = signal<Mentorship | null>(null);
  readonly selectedDate = signal<string | null>(null);
  readonly selectedTime = signal<string | null>(null);

  readonly objective = signal('');
  readonly context = signal('');
  readonly expectations = signal('');

  readonly processingPayment = signal(false);

  readonly stepDescriptions: Record<number, string> = {
    0: 'Selecciona el tipo de mentoría que mejor se adapte a lo que necesitas.',
    1: 'Elige el día y hora que más te convenga.',
    2: 'Comparte los detalles para que tu mentor pueda prepararse.',
    3: 'Revisa todo y confirma tu reserva.',
    4: 'Tu reserva ha sido confirmada exitosamente.',
  };

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private mentorService: MentorService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set(true);
      return;
    }
    const found = this.mentorService.getMentorById(id);
    if (!found) {
      this.error.set(true);
      return;
    }
    this.mentor.set(found);

    if (found.mentorshipDetails.length === 1) {
      this.selectedMentorship.set(found.mentorshipDetails[0]);
    }
  }

  selectMentorship(ms: Mentorship): void {
    this.selectedMentorship.set(ms);
  }

  onSlotSelected(slot: { day: string; time: string }): void {
    this.selectedDate.set(slot.day);
    this.selectedTime.set(slot.time);
  }

  nextStep(): void {
    const curr = this.currentStep();
    if (curr < this.steps.length - 1) {
      this.currentStep.set(curr + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep(): void {
    const curr = this.currentStep();
    if (curr > 0) {
      this.currentStep.set(curr - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  processPayment(): void {
    if (this.processingPayment()) return;
    this.processingPayment.set(true);

    setTimeout(() => {
      this.processingPayment.set(false);
      this.currentStep.set(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2200);
  }
}
