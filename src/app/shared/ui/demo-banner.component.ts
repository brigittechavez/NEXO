import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!dismissed()) {
      <div class="bg-gradient-to-r from-nexo-violet to-electric-indigo text-white px-4 py-2.5 text-center relative z-50">
        <div class="max-w-5xl mx-auto flex items-center justify-center gap-3">
          <div class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <p class="text-sm font-medium">
            Modo demo — Explora la plataforma sin registro
          </p>
          <button
            (click)="dismiss()"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1"
            aria-label="Cerrar banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    }
  `,
})
export class DemoBannerComponent {
  dismissed = signal(false);

  dismiss(): void {
    this.dismissed.set(true);
  }
}
