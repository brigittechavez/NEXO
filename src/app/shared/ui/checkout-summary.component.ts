import { Component, input, output, HostBinding } from '@angular/core';
import { MentorDetail } from '../../core/data/mentors.data';
import { Mentorship } from '../../core/models/mentorship.model';

@Component({
  selector: 'nx-checkout-summary',
  standalone: true,
  template: `
    <div class="bg-white dark:bg-dark-surface rounded-card-lg border border-surface/50 dark:border-dark-surface-high/50 overflow-hidden">
      <div class="p-6 border-b border-surface/50 dark:border-dark-surface-high/50">
        <h3 class="font-heading font-bold text-ink dark:text-dark-text text-lg mb-4">Resumen de tu reserva</h3>

        <div class="flex items-center gap-3 mb-4">
          <img
            [src]="mentor().photo"
            [alt]="mentor().name"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p class="font-semibold text-ink dark:text-dark-text">{{ mentor().name }}</p>
            <p class="text-sm text-muted-text dark:text-dark-muted">{{ mentor().title }}</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-start">
            <span class="text-sm text-muted-text dark:text-dark-muted">Mentoría</span>
            <span class="text-sm font-medium text-ink dark:text-dark-text text-right max-w-[60%]">{{ mentorship().title }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-muted-text dark:text-dark-muted">Duración</span>
            <span class="text-sm font-medium text-ink dark:text-dark-text">{{ mentorship().duration }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-muted-text dark:text-dark-muted">Fecha</span>
            <span class="text-sm font-medium text-ink dark:text-dark-text">{{ date() }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-muted-text dark:text-dark-muted">Hora</span>
            <span class="text-sm font-medium text-ink dark:text-dark-text">{{ time() }}</span>
          </div>
        </div>
      </div>

      @if (objective()) {
        <div class="px-6 py-4 border-b border-surface/50 dark:border-dark-surface-high/50 bg-surface/30 dark:bg-dark-surface-high/30">
          <p class="text-xs text-muted-text dark:text-dark-muted uppercase tracking-wider mb-1.5">Tu objetivo</p>
          <p class="text-sm text-ink dark:text-dark-text">{{ objective() }}</p>
        </div>
      }

      <div class="p-6">
        <p class="text-xs text-muted-text dark:text-dark-muted uppercase tracking-wider mb-3">Método de pago</p>
        <div class="flex items-center gap-3 p-3 bg-surface/50 dark:bg-dark-surface-high/50 rounded-card">
          <div class="w-10 h-7 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
            <span class="text-white text-xs font-bold">VISA</span>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-ink dark:text-dark-text">•••• •••• •••• 4242</p>
            <p class="text-xs text-muted-text dark:text-dark-muted">Simulado — sin cobro real</p>
          </div>
          <svg class="w-5 h-5 text-muted-text dark:text-dark-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>

      <div class="px-6 pb-6">
        <div class="flex justify-between items-baseline mb-4">
          <span class="text-sm text-muted-text dark:text-dark-muted">Total</span>
          <div class="text-right">
            <span class="text-2xl font-heading font-bold text-ink dark:text-dark-text">S/ {{ mentorship().price }}</span>
            <span class="text-sm text-muted-text dark:text-dark-muted ml-1">.00</span>
          </div>
        </div>

        <button
          class="w-full py-3 bg-nexo-violet text-white font-semibold rounded-pill hover:bg-electric-indigo transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          [disabled]="processing() || !selectedPayment()"
          (click)="pay.emit()"
        >
          @if (processing()) {
            <span class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Procesando pago...
            </span>
          } @else {
            Confirmar y pagar
          }
        </button>

        <div class="mt-4 p-3 bg-surface/30 dark:bg-dark-surface-high/30 rounded-card">
          <div class="flex items-start gap-2">
            <svg class="w-4 h-4 text-muted-text dark:text-dark-muted mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p class="text-xs font-medium text-muted-text dark:text-dark-muted mb-1">Política de cancelación</p>
              <p class="text-xs text-muted-text/80 dark:text-dark-muted/80">
                Cancelación gratuita con más de 24 horas de anticipación. Cancelaciones con menos de 24 horas no son reembolsables desde la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutSummaryComponent {
  mentor = input.required<MentorDetail>();
  mentorship = input.required<Mentorship>();
  date = input<string>('');
  time = input<string>('');
  objective = input<string>('');
  processing = input<boolean>(false);
  selectedPayment = input<boolean>(true);

  pay = output<void>();

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
