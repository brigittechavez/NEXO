import { Component, input, HostBinding } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'nx-success-state',
  standalone: true,
  template: `
    <div class="text-center py-12 px-6">
      <div class="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6 check-animation">
        <svg class="w-10 h-10 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h2 class="font-heading font-bold text-2xl text-ink dark:text-dark-text mb-3">{{ title() }}</h2>
      <p class="text-muted-text dark:text-dark-muted text-base max-w-md mx-auto mb-8 leading-relaxed">{{ message() }}</p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        @if (actionLabel()) {
          <button
            class="px-6 py-3 bg-nexo-violet text-white font-semibold rounded-pill hover:bg-electric-indigo transition-colors duration-200"
            (click)="navigate()"
          >
            {{ actionLabel() }}
          </button>
        }
        <button
          class="px-6 py-3 bg-transparent text-muted-text dark:text-dark-muted font-semibold rounded-pill hover:bg-surface dark:hover:bg-dark-surface-high transition-colors duration-200"
          (click)="goHome()"
        >
          Volver al dashboard
        </button>
      </div>
    </div>
  `,
  styles: [`
    .check-animation {
      animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes scaleIn {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
  `],
})
export class SuccessStateComponent {
  title = input<string>('¡Reserva confirmada!');
  message = input<string>('Tu sesión ha sido agendada correctamente. Recibirás un correo con los detalles.');
  actionLabel = input<string>('');
  actionRoute = input<string>('');

  @HostBinding('class')
  get hostClasses(): string {
    return 'block';
  }

  constructor(private router: Router) {}

  navigate(): void {
    const route = this.actionRoute();
    if (route) {
      this.router.navigate([route]);
    }
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }
}
