import { Component, input, output, HostBinding } from '@angular/core';

@Component({
  selector: 'nx-error-state',
  standalone: true,
  template: `
    <div class="text-center py-12 px-6">
      <div class="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-red-500 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>

      <h2 class="font-heading font-bold text-2xl text-ink dark:text-dark-text mb-3">{{ title() }}</h2>
      <p class="text-muted-text dark:text-dark-muted text-base max-w-md mx-auto mb-8 leading-relaxed">{{ message() }}</p>

      <button class="btn-primary btn-md" (click)="retry.emit()">
        {{ retryLabel() }}
      </button>
    </div>
  `,
})
export class ErrorStateComponent {
  title = input<string>('Algo salió mal');
  message = input<string>('No pudimos completar la operación. Por favor, intenta nuevamente.');
  retryLabel = input<string>('Intentar de nuevo');

  retry = output<void>();

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }
}
