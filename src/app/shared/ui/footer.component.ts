import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LogoComponent } from './logo.component';

@Component({
  selector: 'nx-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  template: `
    <footer class="bg-ink dark:bg-dark-bg border-t border-surface dark:border-dark-surface-high">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div class="md:col-span-2">
            <a routerLink="/" class="flex items-center gap-2 mb-4">
              <app-logo variant="mark" [height]="28" alt="" />
              <span class="font-serif text-xl font-bold text-white">NEXO</span>
            </a>
            <p class="text-dark-muted text-sm max-w-sm leading-relaxed">
              Conectando mentores y mentees que comparten el mismo camino. Encuentra a quien ya recorrió ese camino.
            </p>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Plataforma</h4>
            <ul class="space-y-3">
              <li>
                <a routerLink="/explorar" class="text-sm text-dark-muted hover:text-white transition-colors duration-200">Explorar</a>
              </li>
              <li>
                <a routerLink="/como-funciona" class="text-sm text-dark-muted hover:text-white transition-colors duration-200">Cómo funciona</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 class="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-sm text-dark-muted hover:text-white transition-colors duration-200">Términos</a>
              </li>
              <li>
                <a href="#" class="text-sm text-dark-muted hover:text-white transition-colors duration-200">Privacidad</a>
              </li>
            </ul>
          </div>
        </div>

        <div class="mt-12 pt-8 border-t border-dark-surface-high flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-dark-muted">
            &copy; {{ currentYear }} NEXO. Todos los derechos reservados.
          </p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-dark-muted hover:text-white transition-colors duration-200" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" class="text-dark-muted hover:text-white transition-colors duration-200" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" class="text-dark-muted hover:text-white transition-colors duration-200" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
