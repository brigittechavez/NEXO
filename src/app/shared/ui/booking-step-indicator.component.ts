import { Component, input, HostBinding } from '@angular/core';

export interface BookingStep {
  label: string;
}

@Component({
  selector: 'nx-booking-step-indicator',
  standalone: true,
  template: `
    <nav aria-label="Progreso de reserva" class="flex items-center justify-center gap-0 w-full max-w-md mx-auto">
      @for (step of steps(); track step.label; let i = $index) {
        <div class="flex items-center">
          <div class="flex flex-col items-center">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300"
              [class]="getStepClass(i)"
            >
              @if (i < currentStep()) {
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <span
              class="text-xs mt-1.5 font-medium whitespace-nowrap hidden sm:block"
              [class]="i <= currentStep() ? 'text-ink dark:text-dark-text' : 'text-muted-text dark:text-dark-muted'"
            >
              {{ step.label }}
            </span>
          </div>
          @if (i < steps().length - 1) {
            <div
              class="h-0.5 w-8 sm:w-12 mx-1 transition-colors duration-300 -mt-4 sm:mt-0"
              [class]="i < currentStep() ? 'bg-nexo-violet' : 'bg-surface dark:bg-dark-surface-high'"
            ></div>
          }
        </div>
      }
    </nav>
  `,
})
export class BookingStepIndicatorComponent {
  steps = input.required<BookingStep[]>();
  currentStep = input<number>(0);

  @HostBinding('class')
  get hostClasses(): string {
    return 'block py-4';
  }

  getStepClass(index: number): string {
    const current = this.currentStep();
    if (index < current) {
      return 'bg-nexo-violet text-white';
    }
    if (index === current) {
      return 'bg-nexo-violet text-white ring-4 ring-nexo-violet/20';
    }
    return 'bg-surface dark:bg-dark-surface-high text-muted-text dark:text-dark-muted';
  }
}
